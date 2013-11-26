function WsClient() {
    this.conn;
    this.eventHandlers;
}

WsClient.prototype.setup = function(host, port, callback) {
    var self = this;
    this.conn = new WebSocket('ws://' + host + ':' + port, []);
    
    this.conn.onopen = function() {
        console.log('WebSocket open.:');
        callback && callback(null, 'ok');
    };
    
    this.conn.onerror = function (err) {
      console.log('WebSocket Error ' + err);
      callback && callback(err, 'ng');
    };

    this.conn.onmessage = function (e) {
      console.log('WebSocket message: ' + e.data);
      self.handleMessage(e.data);
    };
};

WsClient.prototype.handleMessage = function(message) {
    this.emitEvent('message', message)
};

WsClient.prototype.onEvent = function(name, callback) {
    if (!this.eventHandlers) {
      this.eventHandlers = {};
    }

    if (!this.eventHandlers[name]) {
      this.eventHandlers[name] = callback;
    }
};

WsClient.prototype.emitEvent = function(name) {
    if (!this.eventHandlers) {
      return false;
    }

    var handler = this.eventHandlers[name];

    if (!handler) {
      return false;
    }

    var args = Array.prototype.slice.call(arguments, 1);

    if ('function' === typeof handler) {
      handler.apply(this, args);
    }
};

WsClient.prototype.join = function(userId, roomId) {
    var req = { 
        'header' : {
            'func' : "join",
            'userId' : userId,
            'roomId' : roomId
        }
    };
    
    this.conn.send(JSON.stringify(req));
}