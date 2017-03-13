var User = require('../../../model/user');
var BaseModel = require('../../../model/base_model');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');

/*get请求取参*/
/*注册*/
module.exports.register = function (req, res) {
    var userPhone = req.query.userPhone;
    var password = req.query.password;
    if (!userPhone || !password) {
        BaseModel(false, res, '请检查注册信息');
        return;
    }
    User.findOne({userPhone: userPhone}, function (err, user) {
        if (err) {
            BaseModel(false, res, '服务器维护,请稍后注册');
        } else if (user) {
            BaseModel(false, res, '该用户已存在');
        } else {
            var hashMd5 = crypto.createHash('sha1');
            hashMd5.update(password);
            var newUser = new User({
                userPhone: userPhone,
                password: hashMd5.digest('hex')
            });
            newUser.save(function (error, saveData) {
                if (error) {
                    console.log(error);
                    BaseModel(false, res, '服务器维护，请稍后注册');
                } else {
                    BaseModel(true, res, '注册成功');
                }
            });
        }
    })
};
/*登录*/
module.exports.login = function (req, res) {
    var userPhone = req.query.userPhone;
    var password = req.query.password;
    if (!userPhone || !password) {
        BaseModel(false, res, '请检查登录信息');
        return;
    }
    var hashMd5 = crypto.createHash('sha1');
    User.findOne({userPhone: userPhone, password: hashMd5.update(password).digest('hex')}, function (err, user) {
        if (err) {
            BaseModel(false, res, '数据库错误，登录失败');
        }
        if (!user) {
            BaseModel(false, res, '尚未注册');
        } else {
            var sign = jwt.sign({
                _id: user._id,
                userPhone: user.userPhone
            }, 'zhaobing', {expiresIn: 60 * 60 * 24});
            jwt.verify(sign, 'zhaobing', function (err, decoded) {
                console.log('a:' + decoded.userPhone);
            });
            res.json({
                success: true,
                error: false,
                result: '登录成功',
                token: sign
            });
            console.log('登录成功,Token:' + sign);
        }
    })
};