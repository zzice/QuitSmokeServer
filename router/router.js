var express = require('express');
var router = express.Router();
var v1Path = '../api/v1';
var auth = require(v1Path+'/auth/auth');
var version = require(v1Path+'/version/version');
var advice = require(v1Path+'/business/advice');

/*根路径*/
router.get('/', function (req, res) {
    res.end('Welcome!');
});
/*get 注册*/
router.get('/api/v1/register', auth.register);
/*get 登录*/
router.get('/api/v1/login', auth.login);
/*post 注册*/
router.post('/api/v1/register', auth.register);
/*post 登录*/
router.post('/api/v1/login', auth.login);
/*get 检查更新版本*/
router.get('/api/v1/check/version/:versionCode', version.checkVersion);
/*get 上传版本信息*/
router.get('/api/v1/upload/version/',version.uploadVersionInfo);
/*get 获取吸烟戒烟*/
router.get('/api/v1/get/advince/',advice.getAdviceMsg);
/*get 签到*/
router.get('/api/v1/user/sign/',advice.signIn);
module.exports = router;