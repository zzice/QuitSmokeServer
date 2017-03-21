/*入口*/
var express = require('express'),
    baseModel = require('./model/base_model'),
    bodyParser = require('body-parser'),
    router = require('./router/router'),
    db = require('./db'),
    config = require('./config/config');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});
app.use('/', router);
port = config.port;
app.set('port', port);
app.listen(app.get('port'), function () {
    console.log('app start server at ' + app.get('port'));
});
app.get('/', function (req, res) {
    res.json(baseModel(true, false, 'Welcome to the API!'));
});
