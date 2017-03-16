if(!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
}
console.log(process.env.NODE_ENV);

/**
 * Module dependencies.
 */
var express = require('express')
    , app = express()
    , configs = require('./config/config.js')
    , PORT = configs['basic']['port']
    , server = app.listen(PORT)
    , route = require('./route/route.js')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , log4js = require('log4js')
    , mongoose = require('mongoose')
    , mongoStore = require('connect-mongo')(session);


app.set('env','development');

app.set('port', process.env.PORT || 8080);
app.use(express.static('public'));
app.use(bodyParser.json({ type: 'application/json' }));
// 创建 application/x-www-form-urlencoded 编码解析
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'user',
    resave: false,                  // don't save session if unmodified
    cookie:{httpOnly:true,maxAge: 3600*1000},

    saveUninitialized: false,       // don't create session until something stored
    store: new mongoStore({
        url : configs[process.env.NODE_ENV]['db'],
        stringify : true,           // default:true
        collection : 'sessions'     // default:'sessions'
    })
}));


// db connections , switch to config
mongoose.Promise = global.Promise
mongoose.connect(configs[process.env.NODE_ENV]['db']);
mongoose.connection.on('connected', function () {
    console.log('!--- MongoDB Connection success ---!');
});

if ('development' === app.get('env')) {
    app.set('showStackError', true);
    // app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}

// config routes
route(app);
