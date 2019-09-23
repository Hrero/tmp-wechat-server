'use strict';
const sha1 = require("sha1");
var config = {
    wechat:{
        appID:"wxf58455f0c5a38d1d",
        appSecret:"914d770e7224e980b94ae6727e9c2810",
        token:"haohao"
    }
}
module.exports = (app) => {
    app.use( async (ctx, next) => {
        const token = config.wechat.token
        const signature = ctx.request.query.signature
        const nonce = ctx.request.query.nonce
        const timestamp = ctx.request.query.timestamp
        const echostr = ctx.request.query.echostr
        let str = [token, timestamp, nonce].sort().join('')
        const sha = sha1(str)
        ctx.body = sha === signature ? echostr + '' : 'failed'
    });
};
