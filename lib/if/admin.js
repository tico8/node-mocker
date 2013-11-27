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
    
    app.get('/dump', function(req, res) {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=node-mocker.dump');
        res.end(store.dump());
        
    });
    
    app.post('/restore', function(req, res) {
        var dumpFile = req.files.dumpFile;
        console.log(dumpFile);
        store.restore(dumpFile.path, function(err, ok) {
            if (err) {
                res.json(500, {
                    'errorCode' : 'serverError',
                    'message' : err
                });
                return;
            }
            
            res.json(200, { 'status' : 'ok'});
        })
    });

    app.listen(option.port);
    callback && callback();
    
    logger.info('AdminInterface is setuped. port = ' + option.port);
}
