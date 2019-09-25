const Koa = require('koa');
const serve = require('koa-static')
const koaBody = require('koa-body');
const router = require('./server/router/router');
const logUtil = require("./server/config/log");
const fetch = require('./server/proxy/fetch');
const config = require('./server/config/server');
const wechatConfig = require('./server/config/wechat');
const wechat = require('koa2-wechat')
// const tokenTest = require('./server/config/tokenTest');
// const socket = require('./server/function/socket');
const setWeChat = require('./server/function/wechatLogin');
const schedule = require('./server/function/schedule');
const app = new Koa();

require('./server/db/db');
schedule.clearLogs();
app.context.fetch = fetch; // 全局http请求方法
app.use(koaBody({ // 配置文件上传
    multipart: true,
    formLimit: '10240kb',
    jsonLimit: '102400',
    formidable: {
        uploadDir: __dirname + '/upload',
        keepExtensions: true
    }
}));

if (config.environment === 'test' || config.environment === 'development') {
    // 配置测试用数据
} else {
    // tokenTest(app);
    setWeChat(app);
}
app.use(wechat({
    token: wechatConfig.token,
    appid: wechatConfig.appid,
    encodingAESKey: wechatConfig.encodingAESKey
}).middleware( async(ctx)=>{
    // 微信输入信息都在ctx.state.weixin上
    console.log(ctx.state.weixin, '======')
    let message = ctx.state.weixin;
    if (message.FromUserName === 'diaosi') {
      // 回复屌丝(普通回复)
      ctx.body = 'hehe';
    } else if (message.FromUserName === 'text') {
      //你也可以这样回复text类型的信息
      ctx.body = {
        content: 'text object',
        type: 'text'
      };
    } else if (message.FromUserName === 'hehe') {
      // 回复一段音乐
      ctx.body = {
        type: "music",
        content: {
          title: "来段音乐吧",
          description: "一无所有",
          musicUrl: "http://mp3.com/xx.mp3",
          hqMusicUrl: "http://mp3.com/xx.mp3"
        }
      };
    } else if (message.FromUserName === 'kf') {
      // 转发到客服接口
      ctx.body = {
        type: "customerService",
        kfAccount: "test1@test"
      };
    } else {
      // 回复高富帅(图文回复)
      ctx.body = [
        {
          title: '你来我家接我吧',
          description: '这是女神与高富帅之间的对话',
          picurl: 'http://nodeapi.cloudfoundry.com/qrcode.jpg',
          url: 'http://nodeapi.cloudfoundry.com/'
        }
      ];
    }
}));
app.use(serve(__dirname + "/dist",{ extensions: ['html']}));
app.use(async (ctx, next) => {
    const start = new Date(); // 响应开始时间
    var ms; // 响应间隔时间
    try {
      await next(); // 开始进入到下一个中间件
      ms = new Date() - start;
      logUtil.logResponse(ctx, ms); // 记录响应日志
    } catch (error) {
      ms = new Date() - start;
      logUtil.logError(ctx, error, ms); // 记录异常日志
    }
});

app.use(router.routes()); // 引入路由

module.exports = app;
