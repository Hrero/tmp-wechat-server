const axios = require('koa2-wechat')

/**
 * @description 这是微信消息类 主要封装了一些对话操作
 * 
 * @class WechatMessage
 */
class WechatMessage {
  constructor () {}

  get instance () {
    return new WechatMessage()
  }

  /**
   * @public
   * @param {*} handle 
   */
  message (handle) {
    return async (ctx, next) => {
      const message = await parseXML(ctx.request.body)
      const formatedMessage = formatMessage(message.xml)
      const body = await handle(formatedMessage, ctx)
      const replyMessageXml = reply(body, formatedMessage.ToUserName, formatedMessage.FromUserName)
      ctx.body = replyMessageXml
    }
  }
}

module.exports = WechatMessage