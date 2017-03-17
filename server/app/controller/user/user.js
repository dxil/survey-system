var User = require('../../models/user');
var logger = require('../../common/log4js');

//signin
exports.showSignin = function(req, res) {
}

exports.signin = function(req, res) {
    var _user = req.body.user
    var name = _user.name
    var password = _user.password

    User.findOne({name: name}, function(err, user) {
        if (err) {
            console.log(err)
        }

        if (!user) {
            return res.send({
                'status': -1,
                'msg': '用户不存在'
            })
        }

        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                console.log(err)
            }

            if (isMatch) {
                req.session.user = user
                return res.send({
                    'status': 0,
                    'msg': ''
                })
            }
            else {
                console.log('Password is not matched')
                return res.send({
                    'status': -2,
                    'msg': '密码错误'
                })
            }
        })
    })
}

// logout
exports.logout = function(req, res) {
    delete req.session.user
}

exports.signup = function(req, res) {
    var _user = req.body.user
    User.findOne({name: _user.name}, function(err, user){
        if(err) {
            console.log(err)
        }
        if(user) {
            console.log('aaa')
            console.log(user)
            return res.send({
                'status': 1234,
                'msg': '用户已存在'
            })
        }else {
            var user = new User(_user)
            user.save(function(err, user) {
                if (err) {
                    console.log(err)
                }
                return res.send({
                    'status': 0,
                    'msg': ''
                })
                console.log(user)
            })
        }
    })
}

// midware for user
exports.signinRequired = function(req, res, next) {
    var user = req.session.user

    if (!user) {
        return res.redirect('/signin')
    }

    next()
}
