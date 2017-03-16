var logger = require('../app/common/log4js');

module.exports = function(app){

    // app.use(function(req, res, next) {
    //     var url = req._parsedUrl.pathname;
    //     var _user = req.session.user;
    //
    //     if(!req.session.user && url !='/signin' && url != '/user/signin' ){
    //         return res.redirect("/signin");
    //     }
    //     app.locals.user = _user;
    //     next()
    // })

    // app.use(function(req , res , next){
    //
    //     var body = req.body;
    //
    //     var method = "req_method : "+ req.method,
    //         url = "req_url : " + req.path,
    //         param = "req_params : " + JSON.stringify(body);
    //
    //     var log = '{'+"\r\n    "+method+"\r\n    "+url+"\r\n    "+param+"\r\n"+'}';
    //
    //     logger.info('Request :\r\n'+log);
    //
    //     next();
    // });

    // //user router
    var user = require('../app/controller/user/user');

    app.post('/user/signin', user.signin);
    app.post('/user/signup', user.signup);
    app.get('/logout', user.logout);
    app.get('/', user.logout);
};
