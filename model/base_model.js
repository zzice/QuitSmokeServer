
module.exports = function baseModel(state, res, msg) {
    var baseModel = {};
    baseModel.success = state;
    baseModel.error = !state;
    baseModel.result = msg;
    res.json(baseModel);
    console.log('result:' + JSON.stringify(msg));
};
module.exports.notParamRes=function (res) {
    var baseModel = {};
    baseModel.success = false;
    baseModel.error = true;
    baseModel.result = '参数不全,请检查参数';
    res.json(baseModel);
    console.log('result:' + '参数不全,请检查参数');
};
