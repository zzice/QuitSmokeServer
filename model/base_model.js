
module.exports = function baseModel(state, res, msg) {
    var baseModel = {};
    baseModel.success = state;
    baseModel.error = !state;
    baseModel.result = msg;
    res.json(baseModel);
    console.log('result:' + msg);
};
