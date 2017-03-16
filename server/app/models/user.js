var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;

var user = new Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    createdAt: {
        type: Date
    },
    updatedAt: {
        type: Date
    },
    lastLoginTime: {
        type: Date,
        default: Date.now()
    }
});

// 数据表的预处理方法
user.pre('save', function (next) {
    var self = this;
    if (this.isNew) {
        this.createdAt = this.updatedAt = Date.now();
    }else {
        this.updatedAt = Date.now();
    }

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        console.log(user.password);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        })
    })
})

user.methods = {
    comparePassword: function(_password, cb) {
        bcrypt.compare(_password, this.password, function(err, isMatch) {
            if (err) return cb(err)

            cb(null, isMatch)
        })
    }
}

var User = mongoose.model('user',user)

module.exports = User


