var log4js = require('log4js');
var logger = log4js.getLogger();

var conf = require('lib/conf');
var adminIf = require('lib/if/admin');
var httpIf = require('lib/if/http');
var wsIf = require('lib/if/ws');

adminIf.setup({ 'port' : conf.admin.port});
httpIf.setup({ 'port' : conf.http.port});
wsIf.setup({ 'port' : conf.ws.port});