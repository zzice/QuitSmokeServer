/*Android版本模型*/
var moogoose = require('mongoose');
var Schema = moogoose.Schema;

var VersionSchema = new Schema({
    versionCode: {type: Number, default: 1},
    newestVersionName: {type: String, default: '主页重大改版！'},
    newestUrl: {type: String},
    //true 是最新版本 false 非最新版本
    isNewest: {type: Boolean}
}, {versionKey: false});

module.exports = moogoose.model('Version', VersionSchema);