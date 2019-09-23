import exception from './zh-CN/exception'
import form from './zh-CN/form'
import global from './zh-CN/global'
import login from './zh-CN/login'
import menu from './zh-CN/menu'
import result from './zh-CN/result'
import settings from './zh-CN/settings'
import component from './zh-CN/component'
import pwa from './zh-CN/pwa'

export default {
  message: {
    ...exception,
    ...form,
    ...global,
    ...login,
    ...menu,
    ...result,
    ...settings,
    ...pwa,
    ...component
  }
}
