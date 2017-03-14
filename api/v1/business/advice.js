/*戒烟指标*/
var BaseModel = require('../../../model/base_model');
var User = require('../../../model/user');
var jwt = require('jsonwebtoken');

module.exports.getAdviceMsg = function (req, res) {
    if (req.query === undefined) {
        req.query = req.body;
    }
    var dayNum = req.query.dayNum;
    var yearNum = req.query.yearNum;
    if (!dayNum || !yearNum) {
        BaseModel(false, res, '缺少参数信息');
        return;
    }
    if (dayNum > 0 && dayNum <= 5) {
        BaseModel(true, res, '您是轻度烟民,戒烟推荐2支/日!');
    } else if (dayNum > 5 && dayNum < 10) {
        BaseModel(true, res, '您是中度烟民,戒烟推荐5支/日!');
    } else {
        BaseModel(true, res, '您是重度烟民,戒烟推荐10支/日!');
    }
};

module.exports.signIn = function (req, res) {
    if (req.query === undefined) {
        req.query = req.body;
    }
    var id = req.query.userId;
    var key = req.query.key;
    if (!id || !key) {
        BaseModel(false, res, '参数不全');
    }
    function updateUserSignData(user) {
        var experience = user.experience + 10;
        var position = undefined;
        for (var pos in global.exps) {
            if (experience > global.exps[pos]) {
                position = pos;
            }
        }
        User.update({_id: id}, {
            sign_time: Date.now(),
            experience: experience,
            level: global.levels[position],
            title: global.titles[position]
        }, function (err) {
            if (!err) {
                BaseModel(true, res, '签到成功');
            } else {
                BaseModel(false, res, '签到失败');
            }
        });
    }

    jwt.verify(key, 'zhaobing', function (err, decoded) {
        if (!err) {
            var _id = decoded._id;
            if (id != _id) {
                BaseModel(false, res, 'key值过期,请重新登录');
            } else {
                //签到
                User.findById(id, function (err, user) {
                    if (err || !user) {
                        BaseModel(false, res, 4);
                    } else {
                        var signTime = user.sign_time;
                        if (!signTime) {
                            updateUserSignData(user);
                        } else {
                            var difDate = new Date().getTime() - signTime.getTime();
                            //计算出相差天数
                            var days = Math.floor(difDate / (24 * 3600 * 1000));
                            console.log(days);
                            if (days > 1) {
                                updateUserSignData(user);
                            } else {
                                BaseModel(false, res, '不能重复签到');
                            }
                        }
                    }
                });
            }
        } else
            BaseModel(false, res, 'error:' + err);
    });
};
