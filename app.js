const Koa = require('koa');
const serve = require('koa-static')
const koaBody = require('koa-body');
const router = require('./server/router/router');
const logUtil = require("./server/config/log");
const fetch = require('./server/proxy/fetch');
const config = require('./server/config/server');
// const tokenTest = require('./server/config/tokenTest');
// const socket = require('./server/function/socket');
const xmlParse = require('./server/function/xmlParse');
const setWeChat = require('./server/function/wechatLogin');
const schedule = require('./server/function/schedule');
const xml = require('./server/function/xmlTool')
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
app.use( async (ctx, next) => {
    if (ctx.method == 'POST' && ctx.is('text/xml')) {
        let promise = new Promise(function (resolve, reject) {
            let buf = ''
            ctx.req.setEncoding('utf8')
            ctx.req.on('data', (chunk) => {
                buf += chunk
            })
            ctx.req.on('end', () => {
                xml.xmlToJson(buf)
                    .then(resolve)
                    .catch(reject)
            })
        })
        await promise.then((result) => {
                ctx.req.body = result
            })
            .catch((e) => {
                e.status = 400
            })

        next()
    } else {
        await next()
    }
});
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
