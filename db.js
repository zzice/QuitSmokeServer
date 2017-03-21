/*Mongodb数据库连接*/
var mongoose = require('mongoose');
var config = require('./config/config');
// var DB_URL = 'mongodb://localhost:27017/quitsmoke';
var url;
url = config.mongodb.url;
mongoose.connect(url);
/*连接成功*/
mongoose.connection.on('open', function () {
    console.log('db connect success')
});
/*连接错误*/
mongoose.connection.on('error', function (err) {
    console.log('Mongoose connection error: ' + err);
});
/*断开连接*/
mongoose.connection.on('disconnected', function (err) {
    console.log('Mongoose connection disconnected');
});

module.exports = mongoose;