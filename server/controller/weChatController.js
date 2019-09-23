const config = require('../config/server');
const User = require('../model/user');
const WXBizDataCrypt = require('../function/WXBizDataCrypt.js');
const Token = require('../function/token');
const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');
const serverUrl = config.apiProxy.javaServer;
const setOptions = function(ctx, method, handleParams) {
    return {
        method: method,
        params: handleParams ? handleParams : ctx.request.body,
        headers: {
            'X-Auth-Token': ctx.request.header['X-Auth-Token'] || ctx.request.header['x-auth-token'] || ctx.cookies.get('token') || '',
            'X-Request-Source': ctx.request.header['X-Request-Source'] || ctx.request.header['x-request-source'] || '',
            'X-Request-Version': ctx.request.header['X-Request-Version'] || ctx.request.header['x-request-version'] || '',
            'User-Real-IP': ctx.req.headers['x-forwarded-for'] || ctx.req.connection.remoteAddress || ctx.req.socket.remoteAddress || ctx.req.connection.socket.remoteAddress
        }
    }
}
module.exports = {
    demoCtrl: async (ctx, next) => { // 控制器的demo
         // 获取传参数的方法
         const demoPostUrl = serverUrl + '服务器的请求地址';
         let params = {}; // 自定义参数
         const demoParams = setOptions(ctx, 'GET',params );
         /*
         * setOptions方法（3个参数）：
           * ctx 必传
           * GET 或者 POST  必须用大写
           * params 非必须  不传默认为 ctx.request.body
           *
           * 返回 headers，method，params
           * headers 包含 'X-Auth-Token'  'X-Request-Source' 'X-Request-Version'
         * */
         ctx.body = await ctx.fetch(demoPostUrl, demoParams);
         /*
         * fetch 方法：（2个参数）
         * demoPostUrl 服务器真实请求地址
         * demoParams  setOptions方法返回的最终参数
         *
         * 返回 服务器数据
         * */
    },
    getWeChatId: async (ctx, next) => {
        const openIdtUrl = 'https://api.weixin.qq.com/sns/jscode2session';
        const openIdParams = setOptions(ctx, 'GET');
        ctx.body = await ctx.fetch(openIdtUrl, openIdParams);
    },
    getWxlogin: async (ctx, next) => {
        // const third_login_url = serverUrl + '/pcmall/user/auth_phone_login';
        // const third_login_params = fn.setOptions(ctx, 'POST');
        // ctx.body = await  ctx.fetch(third_login_url, third_login_params);
    },
    getUnionId: async (ctx, next) => {
        const query = ctx.request.body || {};
        const sessionKey = query.sessionKey;
        const encryptedData = query.encryptedData;
        const iv = query.iv;
        const appId = query.appId;
        const pc = new WXBizDataCrypt(appId, sessionKey);
        ctx.body = pc.decryptData(encryptedData, iv); // uid需要绑定企业
    },
    getThirdLoginIn: async (ctx, next) => { // 新建用户和返回token
        let req = ctx.request.body;
        try {
            for (const key in req) {
                if (req[key] === undefined || req[key] === "") {
                    throw new ApiError(ApiErrorNames.UserSomeNull)
                }
            }
            let isUser = await User.find({openId: req.openId});
            let userNumAll = await User.find({});
            if (isUser.length === 0) {
                userNum = userNumAll.length + 1;
                let user = await new User({
                    openId: req.openId,
                    studentNumber: userNum,
                    phoneNumber: userNum,
                    nickName: null
                }).save()
                const token = Token.encrypt({id: user._id},'15d');
                let tokenUpdate = await User.update({_id: user._doc._id}, {token: token});
                ctx.body = {
                    code: 1,
                    data: {
                        token: token,
                        userId: user._doc._id
                    },
                    msg: '绑定成功'
                }
            } else {
                const token = Token.encrypt({id: isUser[0]._id},'15d');
                await User.update({_id: isUser[0]._doc._id}, {token: token});
                ctx.body = {
                    code: 0,
                    data: {
                        token,
                        userId: isUser[0]._id
                    },
                    msg: '该用户已存在'
                }
            }
        }
        catch(err) {
            ctx.body = {
                code: err.code,
                data: '',
                msg: err.errmsg
            }
            return;
        }
    },
    authInfo: async (ctx, next) => { // 存入其他信息接口
        let req = ctx.request.body;
        try {
            for (const key in req) {
                if (req[key] === undefined || req[key] === "") {
                    throw new ApiError(ApiErrorNames.UserSomeNull)
                }
            }
            let update = await User.update({openId: req.openId}, 
            {$set: {
                nickName: req.nickName || '',
                avatarUrl: req.avatarUrl || ''
            }},
            { upsert: true }, (err, res) => {
                if (err) {
                    ctx.body = {
                        code: 0,
                        data: {},
                        msg: '更新失败'
                    }
                } else {
                    ctx.body = {
                        code: 1,
                        data: {
                            ...req,
                            token: ctx.header.authorization
                        },
                        msg: '已更新'
                    }
                }
            })
        }
        catch(err) {
            ctx.body = {
                code: err.code,
                data: '',
                msg: err.errmsg
            }
            return;
        }

    }
}