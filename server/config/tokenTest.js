'use strict';
const sha1 = require("sha1");
var config = {
    wechat:{
        appID:"wx9ba2105f9a09cbec",
        appSecret:"e64d3c6f0f9630f2e631baae706c7c3b",
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
