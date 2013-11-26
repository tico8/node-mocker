/**
 * HTTP
 * 
 * @author furuya_kaoru
 */
var log4js = require('log4js');
var logger = log4js.getLogger();
var express = require('express');
var cons = require('consolidate');

var conf = require('../conf');
var store = require('../store/memory.js');

function HttpInterface() {
    
}

module.exports = new HttpInterface();

HttpInterface.prototype.setup = function(option, callback) {
    var app = express();
    app.use(express.bodyParser());
    app.engine('html', cons.swig);
    app.set('view engine', 'html');
    app.set('views', __dirname + '/../../views/admin');
    app.use(express.static(__dirname + '/../../public'));
    
    //Controller
    app.get('/', function(req, res) {
        res.render('data', {
            title : 'data page',
            apiPort : conf.http.port,
        });
    });
    
    app.get('/data', function(req, res) {
        res.render('data', {
            title : 'data page',
            apiPort : conf.http.port,
        });
    });
    
    app.get('/monitor', function(req, res) {
        res.render('monitor', {
            title : 'monitor page',
            wsPort : conf.ws.port,
        });
    });

    app.listen(option.port);
    callback && callback();
    
    logger.info('AdminInterface is setuped. port = ' + option.port);
}
