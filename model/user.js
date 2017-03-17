/*用户模型*/
var moogoose = require('mongoose');
var Schema = moogoose.Schema;
global.titles = ['筑基', '开光', '融合', '心动', '金丹', '元婴', '出窍', '分神', '合体', '洞虚', '大乘', '渡劫'];
global.levels = ['1级', '2级', '3级', '4级', '5级', '6级', '7级', '8级', '9级', '10级', '11级', '12级'];
global.exps = [0, 300, 650, 1300, 1800, 2800, 4300, 6300, 8000, 9800, 11500, 13500];
var UserSchema = new Schema({
    userPhone: {type: String, required: true},
    password: {type: String, required: true},
    //头像
    avatar: {type: String},
    //昵称
    nick_name: {type: String, default: '戒友' + new Date().getTime()},
    //签名
    signature: {type: String, default: '我发誓今天起再也不抽烟了'},
    //经验
    experience: {type: Number, default: exps[0]},
    //等级
    level: {type: String, default: levels[0]},
    //称号
    title: {type: String, default: titles[0]},
    create_time: {type: Date, default: Date.now()},
    sign_time: {type: Date},
    //抽烟信息{数量、价格、焦油含量}
    smoke_info: {type: Object},
    //戒烟开始时间
    qs_start_date:{type:Date},
    //戒烟停止/失败时间
    qs_fail_date:{type:Date}
}, {versionKey: false});


module.exports = moogoose.model('User', UserSchema);