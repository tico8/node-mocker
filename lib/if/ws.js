/**
 * WebSocket
 * 
 * @author furuya_kaoru
 */
var log4js = require('log4js');
var logger = log4js.getLogger();
var ws = require('ws');

var store = require('../store/memory.js');

function WebSocketInterface() {
    this.connections = {}; // key userId, value : connection(Object)
    this.room = {}; // key : roomId, value : connections(Object)
}

WebSocketInterface.ROOM_ID_MONITOR = 'monitor'; //管理画面でトレースするための部屋

module.exports = new WebSocketInterface();

WebSocketInterface.prototype.setup = function(option, callback) {
    var WebSocketServer = ws.Server;
    var wss = new WebSocketServer({port: option.port});
    var self = this;
    
    wss.on('connection', function(ws) {
        logger.info('WebSocket connected. :');
        
        ws.on('message', function(message) {
            logger.info('WebSocket message. : message = ' + message);
            self.handleMessage(null, ws, message);
        });
    });
    
    logger.info('WebSocketInterface is setuped. port = ' + option.port);
};

WebSocketInterface.prototype.connect = function(userId, ws) {
    var conn = {};
    conn.userId = userId;
    conn.ws = ws;
    conn.roomId = null;
    this.connections[userId] = conn;
    
    var self = this;
    ws.on('message', function(message) {
        logger.info('WebSocket message. : message = ' + message);
        self.handleMessage(userId, ws, message);
    });
    ws.on('close', function() {
        logger.info('WebSocket disconnected. : ');
        self.disconnect(userId);
    });
    
    return conn;
};

WebSocketInterface.prototype.disconnect = function(userId) {
    var conn = this.connections[userId];
    if (!conn) {
        return;
    }
    
    // leave
    if (conn.roomId) {
        this.leave(userId, conn.roomId);
    }
    
    // disconnect
    delete this.connections[userId];
    
    //notification for monitor
    var leaveMonData = {
            'header' : {
                'func' : 'monitor_leave',
                'userId' : userId,
                'members' : Object.keys(this.connections)
            }
    };
    this.broadcast(WebSocketInterface.ROOM_ID_MONITOR, JSON.stringify(leaveMonData));
};

WebSocketInterface.prototype.join = function(userId, ws, roomId) {
    var conn = this.connections[userId];
    if (!conn) {
        conn = this.connect(userId, ws);
    }
    
    // leave
    if (conn.roomId) {
        this.leave(userId, conn.roomId);
    }
    
    //join
    if (!this.room[roomId]) {
        this.room[roomId] = {};
    }
    this.room[roomId][userId] = conn;
    conn.roomId = roomId;
    
    //notification
    var members = Object.keys(this.room[roomId]);
    var joinData = {
            'header' : {
                'func' : 'join',
                'userId' : userId,
                'roomId' : roomId,
                'members' : members
            }
    };
    this.broadcast(roomId, JSON.stringify(joinData));
    
    //notification for monitor
    var joinMonData = {
            'header' : {
                'func' : 'monitor_join',
                'userId' : userId,
                'members' : Object.keys(this.connections)
            }
    };
    this.broadcast(WebSocketInterface.ROOM_ID_MONITOR, JSON.stringify(joinMonData));
};

WebSocketInterface.prototype.leave = function(userId, roomId, ws) {
    var conn = this.connections[userId];
    if (!conn) {
        logger.warn('WebSocket connection is not found. : userId = ' + userId);
        return;
    }
    
    delete this.room[roomId][userId];
    conn.roomId = null;
    
    //notification
    var members = Object.keys(this.room[roomId]);
    var leaveData = {
            'header' : {
                'func' : 'leave',
                'userId' : userId,
                'roomId' : roomId,
                'members' : members
            }
    };
    this.broadcast(roomId, JSON.stringify(leaveData));
};

WebSocketInterface.prototype.unicast = function(userId, data) {
    var conn = this.connections[userId];
    if (conn) {
        conn.ws.send(data);
    }
};

WebSocketInterface.prototype.monitor = function(userId, data) {
    var data = {
            'header' : {
                'func' : 'monitor_message',
                'userId' : userId,
                'time' : new Date().getTime()
            },
            'json' : data
    };
    this.broadcast(WebSocketInterface.ROOM_ID_MONITOR, JSON.stringify(data));
}

WebSocketInterface.prototype.broadcast = function(roomId, json) {
    var range;
    if (roomId) {
        // only room
        range = this.room[roomId];
        logger.info('WebSocket broadcast for room. : roomId = ' + roomId);
    } else {
        // all connections
        range = this.connections;
        logger.info('WebSocket broadcast for all. : ');
    }
    
    if (!range) {
        logger.warn('WebSocket broadcast range is unexists.');
        return;
    }
    
    Object.keys(range).forEach(function(key) {
        var conn = range[key];
        conn.ws.send(json);
    })
};

WebSocketInterface.prototype.handleMessage = function(userId, ws, message) {
    if (!message) {
        this.response(ws, '', 'error', 'message is invalid.', message);
        return;
    }
    
    try {
        var obj = JSON.parse(message);
    } catch (e) {
        this.response(ws, '', 'error', e.message, message);
        return;
    }
    var header = obj.header;
    var json = obj.json;
    if (!header) {
        this.response(ws, '', 'error', 'header is required.', message);
        return;
    }
    
    var func = header.func;
    switch (func) {
    case 'join':
        var userId = header.userId;
        var roomId = header.roomId;
        this.join(userId, ws, roomId);
        break;
    case 'leave':
        var userId = header.userId;
        var roomId = header.roomId;
        this.leave(userId, roomId);
        break;
    case 'data_get':
    case 'data_list':
    case 'data_save':
    case 'data_delete':
        var resFunc = header.resFunc;
        if (!resFunc) {
            resFunc = func;
        }
        var dataName = header.dataName;
        var key = header.key;
        this.handleData(ws, func, dataName, key, json, resFunc);
        break;
    case 'unicast':
        var userId = header.userId;
        this.unicast(userId, json);
        break;
    case 'broadcast':
        var roomId = header.roomId;
        var json = json;
        this.broadcast(roomId, json);
        break;
    default:
        var errmsg = 'WebSocket message func is unsupported. func = : ' + func;
        this.response(ws, resFunc, 'error', errmsg, message);
        logger.error(errmsg);
        break;
    }
    
    this.monitor(userId, message);
};

WebSocketInterface.prototype.handleData = function(conn, func, dataName, key, json, resFunc) {
    var self = this;
    
    switch (func) {
    case 'data_get':
        logger.error('test');
        store.get(store.createKey(dataName, key), function(err, data) {
            logger.error('test');
            if (err) {
                self.response(conn, resFunc, 'error', err);
                return;
            }
            if (!data) {
                self.response(conn, resFunc, 'error', 'data is not found. dataName = ' + dataName + ' key = ' + key);
                return;
            }
            logger.error('test');
            self.response(conn, resFunc, 'ok', '', data);
        });
        break;
    case 'data_list':
        store.list(store.createKey(dataName), function(err, data) {
            if (err) {
                self.response(conn, resFunc, 'error', err);
                return;
            }
            self.response(conn, resFunc, 'ok', '', data);
        })
        break;
    case 'data_save':
        if (!json || !dataName || !key) {
            self.response(conn, resFunc, 'error', 'request params is invalid. dataName = ' + dataName + ' key = ' + key + ' json = ' + json);
            return;
        }
        
        store.set(store.createKey(dataName, key), json);
        self.response(conn, resFunc, 'ok', '');
        break;
    case 'data_delete':
        if (!req.params.dataName || !req.params.key) {
            self.response(conn, resFunc, 'error', 'request params is invalid. dataName = ' + dataName + ' key = ' + key);
        }
        
        store.del(store.createKey(req.params.dataName, req.params.key));
        self.response(conn, resFunc, 'ok', '');
        break;
    default:
        logger.error('WebSocket message func is unsupported. : ');
        break;
    }
};

WebSocketInterface.prototype.response = function(ws, func, status, message, json) {
    var res = {
            'header' : {
                'func' : '',
                'status' : 'ok or error',
                'message' : 'This is a error message.'
            },
            'json' : ""
    };
    res.header.func = func;
    res.header.status = status;
    res.header.message = message;
    res.json = json;
    
    ws.send(JSON.stringify(res));
};
