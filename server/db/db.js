const mongoose = require('mongoose');
const config = require('../config/server');
const DB_URL = `mongodb://${config.apiProxy.javaServer}:27017/second_hand_express_transaction`;

mongoose.connect(DB_URL)

mongoose.connection.on('connected',function() {
   console.log('\x1B[32m 您好！您已经连接打破数据库地址:'+DB_URL + '\x1b[37m');
});
/**
* 连接异常 error 数据库连接错误
*/
mongoose.connection.on('error',function(err) {
  console.log('数据库连接错误: '+ err);
});
/**
* 连接断开 disconnected 连接异常断开
*/
mongoose.connection.on('disconnected',function() {
  console.log('连接异常断开');
});

module.exports = mongoose