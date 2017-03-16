
var log4js = require('log4js');

log4js.configure('config/log4js.json',{reloadSecs:300});

var logger = log4js.getLogger("app");

exports = module.exports = logger;