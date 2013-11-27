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
    var key;
    var argKeys = Object.keys(arguments);
    for (var i = 0; i < argKeys.length; i++) {
        var ele = arguments[i];
        if (ele) {
            if (!key) {
                key = ele;
            } else {
                key = key + MemoryStore.KEY_SEPALATOR + ele;
            }
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
    
    var result;
    if (this.data[key]) {
        result = {
                'key' : key,
                'value' : this.data[key]
        };
        callback && callback(err, result);
    } else {
        callback && callback(err, result);
    }
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
            result.push({
                'key' : key,
                'value' : self.data[key]
            });
        }
    });
    callback && callback(err, result);
};

MemoryStore.prototype.dump = function() {
    var self = this;
    var dumpTxt = "";
    Object.keys(self.data).forEach(function(key) {
        //tab区切りでkey, valueを書き出す
        dumpTxt += key + '\t' + self.data[key] + '\n';
    });
    
    logger.info('MemoryStore dumped. : data = ' + dumpTxt);
    return dumpTxt;
};

MemoryStore.prototype.restore = function(filePath, callback) {
    var fileStr = fs.readFileSync(filePath).toString();
    if (!fileStr) {
        var msg = 'file is empty. : filePath = ' + filePath;
        logger.error(msg);
        callback && callback(msg, null);
    }
    
    // return code replace
    logger.error(fileStr);
    fileStr = fileStr.replace(/[\r\n, \r]/g, '\n'); // \r\n -> \n
    logger.error(fileStr);
    
    var tmpData = {}; // init
    fileStr.split('\n').forEach(function (line) {
        var array = line.split('\t');
        var key = array[0];
        var value = array[1];
        if (!key || !value) {
            logger.warn('key or value is empty. key = ' + key + ' value = ' + value);
        } else {
            tmpData[key] = value;
        }
    });
    this.data = tmpData;
    callback && callback(null, 'ok');
    logger.info('MemoryStore restored. : data = ' + fileStr);
};

MemoryStore.prototype.clear = function() {
    var json = JSON.stringify(this.data);
    this.data = {};
    logger.info('MemoryStore cleared. : data = ' + json);
};