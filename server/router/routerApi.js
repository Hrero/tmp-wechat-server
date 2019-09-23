const routerApi = require('koa-router')();
const token = require('../function/token');
const ourRating = require('../function/ourRatings');
const weChatCtrl = require('../controller/weChatController');
const UserController = require('../controller/userController');
const userAttentionToController = require('../controller/userAttentionToController');
const commodityController = require('../controller/commodityController');
const userToCollectController = require('../controller/userToCollectController');
const userTransmitsController = require('../controller/userTransmitsController');
const userLikesController = require('../controller/userLikesController');
const SearchController = require('../controller/searchController');
const commodityTypeController = require('../controller/commodityTypeController');
const remarksController = require('../controller/remarksController');

// 用户
routerApi.post('/api/user/addUser', UserController.saveUser); // 添加用户

routerApi.post('/api/user/getUserList', token.auth, UserController.getAllUser); // 查询用户

routerApi.post('/api/user/getUserDetail', token.auth, UserController.userDetail); // 查询用户详情
routerApi.post('/api/user/userUpdate', token.auth, UserController.userUpdate); // 用户信息更新
// 关注
routerApi.post('/api/user/addAttention', token.auth, userAttentionToController.addAttention); // 点击关注
routerApi.post('/api/user/userAttentionList', token.auth, userAttentionToController.userAttentionList); // 关注/粉丝列表
// 收藏
routerApi.post('/api/user/getCollectionList', token.auth, userToCollectController.getCollectionList); // 取消收藏
routerApi.post('/api/user/addCollection', token.auth, userToCollectController.addCollection, ourRating.rating); // 添加收藏
// 转发
routerApi.post('/api/user/addTransmit', token.auth, userTransmitsController.addTransmit, ourRating.rating); // 添加转发
// 喜欢/点赞
routerApi.post('/api/user/addLike', token.auth, userLikesController.addLike, ourRating.rating); // 点赞
// 商品
routerApi.post('/api/user/getCommodityList', token.auth, commodityController.getAllCommdity); // 所有商品
routerApi.post('/api/editCommodityStatus', commodityController.editStatus); // 上架商品
routerApi.post('/api/user/saveCommodity', token.auth, commodityController.saveCommodity); // 添加商品
routerApi.post('/api/user/getUserCommodityList', token.auth, commodityController.getUserCommodityList); // 获取用户下的商品
routerApi.post('/api/getCommodityDetail', token.auth , commodityController.getCommodityDetail); // 获取商品详情
// 推荐
routerApi.post('/api/recommendToCommodity', commodityController.recommendToCommodity); // 推荐商品
// 物品分类
routerApi.post('/api/addCommodityType', commodityTypeController.addCommodityType); // 添加物品分类
routerApi.post('/api/getCommodityTypeList', commodityTypeController.getCommodityTypeList); // 物品分类列表
// 搜索
routerApi.post('/api/user/getEverybodySearching', token.auth, SearchController.getEverybodySearching); // 大家都在搜
routerApi.post('/api/user/deleteUserSearch', token.auth, SearchController.deleteUserSearch); // 删除用户历史搜索
// 评论
routerApi.post('/api/user/addRemarks', token.auth, remarksController.addRemarks); // 添加评论
routerApi.post('/api/user/getRemarksList', token.auth, remarksController.getRemarksList); // 单条评论全部列表
// 消息
routerApi.post('/api/user/getMessageList', token.auth, remarksController.getMessageList); // 该用户的评论消息
routerApi.post('/api/user/updateMessage', token.auth, remarksController.updateMessage); // 更新0未读消息找机会封装一个公用的更新字段的方法
routerApi.post('/api/user/clearMessage', token.auth, remarksController.clearMessage); // 清空未读消息
routerApi.post('/api/user/getMessageNum', token.auth, remarksController.getMessageNum); // 消息请求推送


// 微信&登录
routerApi.post('/api/xcx/weChat/getWeChatId', weChatCtrl.getWeChatId); // 微信openid
routerApi.post('/api/xcx/weChat/getUnionId', weChatCtrl.getUnionId); // 微信unionid
routerApi.post('/api/xcx/weChat/thirdLoginIn', weChatCtrl.getThirdLoginIn); // 微信登录注册
routerApi.post('/api/pcmall/user/auth_phone_login', weChatCtrl.getWxlogin); // 微信手机号快速登录
routerApi.post('/api/pcmall/user/authInfo', weChatCtrl.authInfo); // 微信个人信息授权登录

// 搜索
// routerApi.post('/api/getCommodityDetail', commodityController.getCommodityDetail); // 获取商品详情

module.exports = routerApi;
