'use strict';
const config = require('../config/server');
const cObj = require('../config/cookieSet');
const User = require('../model/user');
const Token = require('../function/token');
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
const thirdLogin = async (ctx, options) => {
    let req = options;
    try {
        let isUser = await User.find({openId: req.oid});
        let userNumAll = await User.find({});
        console.log(userNumAll)
        if (isUser.length === 0) {
            userNum = userNumAll.length + 1;
            let user = await new User({
                platform: req.platform,
                userid: userNum,
                unionid: req.uid,
                openid: req.oid,
                username: req.username,
                headimgurl: req.icon_url
            }).save()
            console.log(user)
            const token = Token.encrypt({id: user._id},'15d');
            await User.update({_id: user._doc._id}, {token: token});
            ctx.body = {
                code: 1,
                data: {
                    token: token,
                    userId: userid
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
                    userId: isUser[0].userid
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
};
module.exports = (app) => {
    app.use( async (ctx, next) => {
        let reqUrl = ctx.request.url;
        if(!ctx.cookies.get('weChatOid')){
            if( ctx.query.code && ctx.query.state) {
                const weChatUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token';
                const weChatParams = setOptions(ctx, 'GET', {
                    appid: 'wxf58455f0c5a38d1d',
                    secret: '914d770e7224e980b94ae6727e9c2810',
                    code: ctx.query.code,
                    grant_type: 'authorization_code'
                });
                const weChatInfo = await ctx.fetch(weChatUrl, weChatParams);
                if(weChatInfo.unionid)  ctx.cookies.set('weChatUid', weChatInfo.unionid, cObj.long);
                if(weChatInfo.openid)  ctx.cookies.set('weChatOid', weChatInfo.openid, cObj.long);
                const userUrl = 'https://api.weixin.qq.com/sns/userinfo';
                const userParams = setOptions(ctx, 'GET', {
                    access_token: weChatInfo.access_token,
                    openid: weChatInfo.openid,
                    lang: 'zh_CN'
                });
                const userInfo = await ctx.fetch(userUrl, userParams);
                thirdLogin(ctx, {
                    platform: 'weChat',
                    uid: weChatInfo.unionid || ctx.cookies.get('weChatUid'),
                    oid: weChatInfo.openid || ctx.cookies.get('weChatOid'),
                    username: userInfo.nickname,
                    icon_url: userInfo.headimgurl
                });
            } else {
                const to_url = 'https://lmyear.com' + reqUrl;
                console.log(to_url, '====')
                ctx.redirect('https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf58455f0c5a38d1d&redirect_uri='+ encodeURIComponent(to_url) +'&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect');
                return;
            }
        } else {
            thirdLogin(ctx, {
                platform: 'weChat',
                uid: ctx.cookies.get('weChatUid')
            });
        }
        await next();
    });
};
