const config = require('../config/server');
const User = require('../model/user');
const WXBizDataCrypt = require('../function/WXBizDataCrypt.js');
const Token = require('../function/token');
const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');
const sha1 = require("sha1");
const fs = require("fs");
const wxConfig = require('../config/wechat.js')
const wxMsg = require('../function/wxmsg/xmlwx')
const serverUrl = config.apiProxy.javaServer;
const setOptions = (ctx, method, handleParams) => { // 设置和获取header
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
const getTicke = async (ctx, access_token) => { // 获取jsApi_ticke
    return new Promise((resolve, reject) => {
        let curTime = getTimestamp()
        let jsapiObj = require('../config/jsapiTicket.json')
        if(curTime <= jsapiObj.expiresTime) return resolve(jsapiObj.ticket)
        let userUrl = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`
        ctx.fetch(userUrl, setOptions(ctx, 'GET', {})).then(chunk => {
            jsapiObj.ticket = chunk.ticket
            jsapiObj.expiresTime = getTimestamp() + 7000
            fs.writeFileSync(wxConfig.jsapiTicketPath, JSON.stringify(jsapiObj))
            resolve(jsapiObj.ticket)
        });
    })
}
const getAccessToken = async (ctx, next) => { // 获取access_token
    return new Promise((resolve, reject) => {
        let curTime = getTimestamp()
        let accessToken = require('../config/accessToken.json')
        if (curTime <= accessToken.expiresTime) return resolve(accessToken['access_token'])
        let userUrl = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${wxConfig.appid}&secret=${wxConfig.secret}`
        ctx.fetch(userUrl, setOptions(ctx, 'GET', {})).then(chunk => {
            accessToken.access_token = chunk.access_token
            accessToken.expiresTime = getTimestamp() + 7000 
            fs.writeFileSync(wxConfig.accessTokenPath, JSON.stringify(accessToken))
            resolve(accessToken["access_token"])
        });
    })
}
const getNonceStr = (length = 16) => { // 获取随机字符串
    let str = 'abcdefghijklmnopqrstuvwxyzABCKEFGHIJKLMNOPQRSTUVWXYZ1234567890' // 长度62
    // 取0-62的随机整数
    let max = str.length,
        min = 0
    let randomStr = ''
    for(let i = 0; i < length; i++) {
        randomStr += str.substr(Math.floor(Math.random() * (max - min + 1)) + min, 1) // 取两数之间的整数(包括这两个整数)
    }
    return randomStr
}
const getTimestamp = () => { // 获取时间戳
    return Math.round(new Date().getTime() / 1000)
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
    thirdLoginIn: async (ctx, next) => { // 新建用户和返回token
        let req = ctx.request.body;
        try {
            for (const key in req) {
                if (req[key] === undefined || req[key] === "") {
                    throw new ApiError(ApiErrorNames.UserSomeNull)
                }
            }
            let isUser = await User.find({openId: req.openId});
            if (isUser.length !== 0) {
                const token = Token.encrypt({id: isUser[0]._id},'15d');
                await User.update({_id: isUser[0]._doc._id}, {token: token});
                ctx.body = {
                    code: 1,
                    data: {
                        token,
                        userId: isUser[0]._id
                    },
                    msg: '该用户已存在'
                }
            } else {
                ctx.body = {
                    code: 0,
                    data: '不存在',
                    msg: '不存在'
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

    },
    sign: async (ctx, next) => { // 签名
        let url = ctx.request.body.url // 获取前端传递的url
        let timestamp = getTimestamp() // 时间戳
        let nonceStr = getNonceStr(16) // 随机16位字符串
        let accessToken = await getAccessToken(ctx, next) // 获取accessToken(用于获取jsapiTicket)
        let jsapiTicket = await getTicke(ctx, accessToken) // 使用获取到的jsapiTicket
        let str = `jsapi_ticket=${jsapiTicket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}` // 对四个数据做字典序的排序
        let signature = sha1(str) // 使用sha1第三方模块进行加密得到的就是签名
        console.log('accessToken: ', accessToken)
        console.log('jsapiTicket: ', jsapiTicket)
        console.log('str: ', str)
        console.log('signature: ', signature)
        console.log('timestamp: ', timestamp)
        console.log('nonceStr: ', nonceStr)
        ctx.body = {
            code: 0,
            msg: 'success',
            data: {
                appId: wxConfig.appid, // 必填，公众号的唯一标识
                timestamp, // 必填，生成签名的时间戳
                nonceStr, // 必填，生成签名的随机串
                signature // 必填，签名
            }
        }
    },
    postHandle: async (ctx, next) => {
        let msg,
            MsgType,
            result
    
        msg = ctx.req.body ? ctx.req.body.xml : ''
    
        if (!msg) {
            ctx.body = 'error request.'
            return;
        }
        
        MsgType = msg.MsgType[0]
    
        switch (MsgType) {
            case 'text':
                result = wxMsg.message.text(msg, msg.Content)
                break;
            default: 
                result = 'success'
        }
        ctx.res.setHeader('Content-Type', 'application/xml')
        ctx.res.end(result)
    },
    getHandle: async (ctx, next) => {
        const result = wxMsg.auth(ctx)
        if (result) {
            ctx.body = ctx.query.echostr
        } else {
            ctx.body = { code: -1, msg: "You aren't wechat server !"}
        }
    }
}