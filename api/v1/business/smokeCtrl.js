var BaseModel = require('../../../model/base_model');
var User = require('../../../model/user');
var Plan = require('../../../model/plan');
var jwt = require('jsonwebtoken');

/*生成戒烟计划*/
module.exports.createSmoke = function (req, res) {
    if (!req.body) {
        BaseModel(false, res, '检查参数是否提交');
        return;
    }
    var key = req.body.key;
    var dayNum = req.body.dayNum;
    var price = req.body.price;
    var tar = req.body.tar;
    var adviceNum = req.body.adviceNum;
    if (!key || !dayNum || !price || !tar || !adviceNum) {
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
                        User.update({_id: _id}, {
                            smoke_info: SmokeInfo,
                            sc_start_date: Date.now(),
                            planId: _id
                        }, function (err) {
                            if (!err) {
                                var plan = new Array(30);
                                for (var i = 0; i < 30; i++) {
                                    var dayInfo = {};
                                    dayInfo.realNum = 0;
                                    dayInfo.isSucess = true;
                                    dayInfo.planDate = new Date((new Date().getTime()+(i*86400000)));
                                    plan[i] = dayInfo;
                                }
                                //创建30日计划
                                Plan.create({id: _id, dayGoal: adviceNum, plan: plan}, function (err, plan) {
                                    if (!err) {
                                        BaseModel(true, res, plan);
                                    } else {
                                        BaseModel(false, res, err);
                                    }
                                });
                                // Plan.find().populate('id').exec(function (err, data) {
                                //     BaseModel(true, res, data);
                                // });
                                // Plan.findOne({id: _id}, function (err, data) {
                                //     BaseModel(true, res, data);
                                // });
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
            BaseModel(false, res, '账号过期,请重新登录,' + err);
        }
    });
};

/*控烟动作计算*/
module.exports.countSmoke = function (req, res) {
    var key = req.body.key;
    var type = req.body.type;
    var num = req.body.num;
    var cNum = req.body.cNum;
    if (!key || !type) {
        BaseModel.notParamRes(res);
        return;
    }
    /**
     * 查询Plan表，并更新表数据
     * @param id Plan关联id
     * @param cNum 每日抽烟数量
     */
    function findPlanAndModify(id, cNum) {
        Plan.findOne({id: id}, function (err, data) {
            if (!err && data) {
                var _id = data._id;
                var dayGoal = data.dayGoal;
                var plan = data.plan;
                if (cNum > dayGoal) {
                    for (var i = 0; i < plan.length; i++) {
                        if (plan[i].planDate.toDateString() === new Date().toDateString()) {
                            var dayInfo = {};
                            dayInfo.planDate = plan[i].planDate;
                            dayInfo.isSucess = false;
                            dayInfo.realNum = cNum;
                            plan[i] = dayInfo;
                            Plan.update({_id: _id}, {
                                plan: plan
                            }, function (err) {
                                if (!err) {
                                    BaseModel(true, res, 'Good');
                                } else {
                                    BaseModel(false, res, err);
                                }
                            })
                        }
                    }
                }
            } else {
                BaseModel(false, res, err);
            }
        });
    }
    /**
     * 抽烟操作，查询User,更新Exp经验。
     * @param id
     * @param cNum
     * @param res
     */
    function findUserAndUpdateSubtractExp(id, cNum, res) {
        User.findById(id, function (err, user) {
            if (!err || user) {
                if (user.experience > 10) {
                    var experience = user.experience - 10;
                    for (var pos in global.exps) {
                        if (experience > global.exps[pos]) {
                            position = pos;
                        }
                    }
                    User.update({_id: id}, {
                        experience: experience,
                        level: global.levels[position],
                        title: global.titles[position]
                    }, function (err) {
                        if (!err) {
                            findPlanAndModify(id, cNum);
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
    }
    jwt.verify(key, 'zhaobing', function (err, decoded) {
        if (!err) {
            var id = decoded._id;
            if (id) {
                //抽烟
                if (type === '0') {
                    cNum = parseInt(cNum);
                    if (isNaN(cNum)) {
                        BaseModel(false, res, '操作失败,请检查参数是否正确');
                        return;
                    }
                    findUserAndUpdateSubtractExp(id, cNum, res);
                } else if (type === '1') {
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
                } else {
                    //复吸or更改计划
                    User.findById(id, function (err, user) {
                        if (!err || user) {
                            var resObject = {
                                experience: 0,
                                level: global.levels[0],
                                title: global.titles[0]
                            };
                            User.update({_id: id}, {
                                experience: 0,
                                level: global.levels[0],
                                title: global.titles[0]
                            }, function (err) {
                                if (!err) {
                                    BaseModel(true, res, resObject);
                                } else {
                                    BaseModel(false, res, '操作失败');
                                }
                            });
                        }
                    })
                }
            } else {
                BaseModel(false, res, '账号过期,请重新登录');
            }
        } else {
            BaseModel(false, res, err);
        }
    });
};