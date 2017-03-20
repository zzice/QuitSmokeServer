var express = require('express');
var router = express.Router();
var v1Path = '../api/v1';
var auth = require(v1Path + '/auth/auth');
var version = require(v1Path + '/version/version');
var advice = require(v1Path + '/business/advice');
var smokeCtrl = require(v1Path + '/business/quitSmokeCtrl');
var sCtrl = require(v1Path + '/business/smokeCtrl');

/*根路径*/
router.get('/', function (req, res) {
    res.end('Welcome!');
});
/*post 注册*/
router.post('/api/v1/register', auth.register);
/*post 登录*/
router.post('/api/v1/login', auth.login);
/*get 检查更新版本*/
router.get('/api/v1/check/version/:versionCode', version.checkVersion);
/*post 上传版本信息*/
router.post('/api/v1/upload/version/', version.uploadVersionInfo);
/*get 获取戒烟建议*/
router.get('/api/v1/get/advince/', advice.getAdviceMsg);
/*post 签到*/
router.post('/api/v1/user/sign/', smokeCtrl.signIn);
/*post 开始戒烟计划 1 戒烟计划*/
router.post('/api/v1/start/1/', smokeCtrl.quitSmoke);
/*0 控烟计划*/
//router.post('/api/v1/start/2/', smokeCtrl.quitSmoke);
/*post 抽烟或压制 经验变化*/
router.post('/api/v1/smoke/ctrl/', smokeCtrl.smokeBehavior);
router.post('/api/v1/smoke/ctrl/c/', sCtrl.createSmoke);
router.post('/api/v1/smoke/ctrl/c1/', sCtrl.countSmoke);
module.exports = router;