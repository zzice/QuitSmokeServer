/*戒烟指标*/
var BaseModel = require('../../../model/base_model');
var User = require('../../../model/user');
var jwt = require('jsonwebtoken');
/*获得控烟目标*/
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

