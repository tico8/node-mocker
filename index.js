var log4js = require('log4js');
var logger = log4js.getLogger();

var httpIf = require('script/if/http');
var wsIf = require('script/if/ws');

httpIf.setup();
wsIf.setup();