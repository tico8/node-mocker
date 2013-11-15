/**
 * ��������Ńf�[�^��ێ��������
 * 
 * @author furuya_kaoru
 */
var log4js = require('log4js');
var logger = log4js.getLogger();
var fs = require('fs');

function MemoryStore() {
    this.data = {};
}

module.exports = new MemoryStore();

MemoryStore.KEY_SEPALATOR = ':';

MemoryStore.prototype.createKey = function() {
    var key = '';
    var argKeys = Object.keys(arguments);
    for (var i = 0; i < argKeys.length; i++) {
        if (!key) {
            key = arguments[i];
        } else {
            key = key + MemoryStore.KEY_SEPALATOR + arguments[i];
        }
    }
    
    return key;
};

MemoryStore.prototype.set = function(key, value) {
    this.data[key] = value;
};

MemoryStore.prototype.del = function(key) {
    delete this.data[key];
};

MemoryStore.prototype.get = function(key, callback) {
    var err;
    if (!this.data) {
        err = "data is not found.";
        callback && callback(err, null);
        return;
    }

    var result = this.data[key];
    callback && callback(err, result);
};

MemoryStore.prototype.list = function(prefix, callback) {
    var err;
    if (!this.data) {
        err = "data is not found.";
        callback && callback(err, null);
        return;
    }

    var rx = new RegExp('^' + prefix);
    var result = [];
    var self = this;
    Object.keys(this.data).forEach(function(key) {
        var m = key.match(rx);
        if (m && m.length > 0) {
            result.push(self.data[key])
        }
    });
    callback && callback(err, result);
};

MemoryStore.prototype.dump = function(filePath) {
    var json = JSON.stringify(this.data);
    fs.writeFileSync(filePath, json);
    logger.info('MemoryStore dumped. : data = ' + json);
};

MemoryStore.prototype.restore = function(filePath) {
    var json = fs.readFileSync('/etc/passwd');
    this.data = JSON.parse(json);
    logger.info('MemoryStore restored. : data = ' + json);
};

MemoryStore.prototype.clear = function() {
    var json = JSON.stringify(this.data);
    this.data = {};
    logger.info('MemoryStore cleared. : data = ' + json);
};