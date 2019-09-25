
const routerApi = require('koa-router')();
const weChatCtrl = require('../controller/weChatController');
routerApi.post('/api/xcx/weChat/thirdLoginIn', weChatCtrl.thirdLoginIn); // 微信登录注册
routerApi.post('/api/xcx/weChat/sign', weChatCtrl.sign); // 微信登录注册
routerApi.post('/', weChatCtrl.postHandle); // 消息
routerApi.get('/', weChatCtrl.getHandle); // 消息
module.exports = routerApi;