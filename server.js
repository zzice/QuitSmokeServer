/*入口*/
var express = require('express'),
    baseModel = require('./model/base_model'),
    bodyParser = require('body-parser'),
    router = require('./router/router'),
    jwt = require('jsonwebtoken'),
    db = require('./db');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.all('*',function (req,res,next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.use('/', router);
app.set('port', 55566);
app.listen(app.get('port'), function () {
    console.log('app start server at ' + app.get('port'));
});
app.get('/', function (req, res) {
    res.json(baseModel(true, false, 'Welcome to the API!'));
});
