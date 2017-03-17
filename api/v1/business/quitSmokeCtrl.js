/*戒烟业务服务逻辑*/
var BaseModel = require('../../../model/base_model');
var User = require('../../../model/user');
var jwt = require('jsonwebtoken');
function jwtVerify(res, key) {
    jwt.verify(key, 'zhaobing', function (err, decoded) {
        if (!err) {
            var _id = decoded._id;
            if (_id) {
                return _id;
            } else {
                BaseModel(false, res, '账号过期,请重新登录');
            }
        } else {
            BaseModel(false, res, err);
        }
    });
}
/*签到*/
module.exports.signIn = function (req, res) {
    if (req.query === undefined) {
        req.query = req.body;
    }
    var id = req.query.userId;
    var key = req.query.key;
    if (!id || !key) {
        BaseModel.notParamRes(res);
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
            if (_id) {
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
            } else {
                BaseModel(false, res, '账号过期,请重新登录');
            }
        } else {
            BaseModel(false, res, err);
        }
    });
};
/*生成戒烟计划*/
module.exports.quitSmoke = function (req, res) {
    if (!req.body) {
        BaseModel(false, res, '检查参数是否提交');
        return;
    }
    var key = req.body.key;
    var dayNum = req.body.dayNum;
    var price = req.body.price;
    var tar = req.body.tar;
    if (!key || !dayNum || !price || !tar) {
        BaseModel.notParamRes(res);
        return;
    }
    jwt.verify(key, 'zhaobing', function (err, decoded) {
        if (!err) {
            var _id = decoded._id;
            if (_id) {
                User.findById(_id, function (err, user) {
                    if (err) {
                        BaseModel(false, res, '错误:' + err);
                    } else {
                        var SmokeInfo = {};
                        SmokeInfo.dayNum = dayNum;
                        SmokeInfo.price = price;
                        SmokeInfo.tar = tar;
                        var qs_start_date = new Date();
                        User.update({_id: _id}, {
                            smoke_info: SmokeInfo,
                            qs_start_date: Date.now()
                        }, function (err) {
                            if (!err) {
                                BaseModel(true, res, qs_start_date);
                            } else {
                                BaseModel(false, res, '失败:' + err);
                            }
                        });
                    }
                });
            } else {
                BaseModel(false, res, '账号过期,请重新登录');
            }
        } else {
            BaseModel(false, res, err);
        }
    });
};
/*抽烟或压制 经验变化*/
module.exports.smokeBehavior = function (req, res) {
    var key = req.body.key;
    var type = req.body.type;
    var num = req.body.num;
    if (!key || !type) {
        BaseModel.notParamRes(res);
        return;
    }
    jwt.verify(key, 'zhaobing', function (err, decoded) {
        if (!err) {
            var id = decoded._id;
            if (id) {
                //抽烟
                if (type === '0') {
                    User.findById(id, function (err, user) {
                        if (!err || user) {
                            if (user.experience > 10) {
                                var experience = user.experience - 10;
                                for (var pos in global.exps) {
                                    if (experience > global.exps[pos]) {
                                        position = pos;
                                    }
                                }
                                var resObject = {
                                    experience: experience,
                                    level: global.levels[position],
                                    title: global.titles[position]
                                };
                                User.update({_id: id}, {
                                    experience: experience,
                                    level: global.levels[position],
                                    title: global.titles[position]
                                }, function (err) {
                                    if (!err) {
                                        BaseModel(true, res, resObject);
                                    } else {
                                        BaseModel(false, res, '操作失败');
                                    }
                                });
                            } else {
                                BaseModel(true, res, "操作成功 ");
                            }
                        } else {
                            BaseModel(false, res, '服务器错误，稍后重试');
                        }
                    });
                } else {
                    if (!num) {
                        BaseModel.notParamRes(res);
                        return;
                    }
                    //压制
                    User.findById(id, function (err, user) {
                        if (!err || user) {
                            var experience = undefined;
                            num = parseInt(num);
                            if (isNaN(num)) {
                                BaseModel(false, res, '操作失败,请检查参数是否正确');
                                return;
                            }
                            if (num > 5) {
                                experience = user.experience + 5;
                            } else {
                                experience = user.experience + 10;
                            }
                            var position = undefined;
                            for (var pos in global.exps) {
                                if (experience > global.exps[pos]) {
                                    position = pos;
                                }
                            }
                            var resObject = {
                                experience: experience,
                                level: global.levels[position],
                                title: global.titles[position]
                            };
                            User.update({_id: id}, {
                                experience: experience,
                                level: global.levels[position],
                                title: global.titles[position]
                            }, function (err) {
                                if (!err) {
                                    BaseModel(true, res, resObject);
                                } else {
                                    BaseModel(false, res, '操作失败');
                                }
                            });
                        }
                    });
                }
            } else {
                BaseModel(false, res, '账号过期,请重新登录');
            }
        } else {
            BaseModel(false, res, err);
        }
    });
};
