var log4js = require('log4js');
var logger = log4js.getLogger();

var conf = require('script/conf');
var adminIf = require('script/if/admin');
var httpIf = require('script/if/http');
var wsIf = require('script/if/ws');

adminIf.setup({ 'port' : conf.admin.port});
httpIf.setup({ 'port' : conf.http.port});
wsIf.setup({ 'port' : conf.ws.port});