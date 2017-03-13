var express = require('express');
var router = express.Router();
var auth = require('../api/v1/auth/auth');
var version = require('../api/v1/version/version');
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

/*get 更新版本*/
router.get('/api/v1/check/version/:versionCode', version.checkVersion);
module.exports = router;