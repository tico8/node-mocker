/**
 * HTTP
 * 
 * @author furuya_kaoru
 */
var log4js = require('log4js');
var logger = log4js.getLogger();
var express = require('express');
var cons = require('consolidate');

var store = require('../store/memory.js');

function HttpInterface() {
    
}

module.exports = new HttpInterface();

HttpInterface.prototype.setup = function(option, callback) {
    var app = express();
    app.engine('html', cons.swig);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/../../views/admin');
    
    //Controller
    app.get('/', function(req, res) {
        res.render('index', {
            title : 'node-mocker admin page'
        });
    });
    app.get('/data', function(req, res) {
        var prefix = store.createKey(req.query.dataName, req.query.key);
        var rx = new RegExp('^' + prefix);
        var dataList = [];
        Object.keys(store.data).forEach(function(key) {
            var m = key.match(rx);
            if (m && m.length > 0) {
                dataList.push({
                    'key' : key,
                    'value' : store.data[key]
                });
            }
        });
        res.render('data', {
            title : 'node-mocker data page',
            dataName : req.query.dataName,
            key : req.query.key,
            dataList : dataList
        });
    });

    app.listen(option.port);
    callback && callback();
    
    logger.info('AdminInterface is setuped. port = ' + option.port);
}
