const routerApi = require('koa-router')();
const weChatCtrl = require('../controller/weChatController');
// 微信&登录
routerApi.post('/api/xcx/weChat/getWeChatId', weChatCtrl.getWeChatId); // 微信openid
routerApi.post('/api/xcx/weChat/getUnionId', weChatCtrl.getUnionId); // 微信unionid
routerApi.post('/api/xcx/weChat/thirdLoginIn', weChatCtrl.thirdLoginIn); // 微信登录注册
routerApi.post('/api/pcmall/user/auth_phone_login', weChatCtrl.getWxlogin); // 微信手机号快速登录
routerApi.post('/api/pcmall/user/authInfo', weChatCtrl.authInfo); // 微信个人信息授权登录

// 搜索
// routerApi.post('/api/getCommodityDetail', commodityController.getCommodityDetail); // 获取商品详情

module.exports = routerApi;
