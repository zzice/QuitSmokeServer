module.exports = function baseModel(state, res, msg) {
    var baseModel = {};
    baseModel.success = state;
    if (state) {
        baseModel.error = null;
        baseModel.result = msg;
    } else {
        baseModel.error = msg;
        baseModel.result = null;
    }
    res.json(baseModel);
    console.log('result:' + JSON.stringify(msg));
};
module.exports.notParamRes = function (res) {
    var baseModel = {};
    baseModel.success = false;
    baseModel.error = '参数不全,请检查参数';
    baseModel.result = null;
    res.json(baseModel);
    console.log('result:' + '参数不全,请检查参数');
};
