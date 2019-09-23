import Vue from 'vue'
import {
    Icon, Input, Message, Page, Form, FormItem, Upload, Drawer, Avatar, DropdownMenu, DropdownItem, Dropdown, Carousel, CarouselItem, Tabs, TabPane, Table, Button, Modal
} from 'iview'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import router from './router'
import zhCN from './assets/lang/zh-CN'
import store from './store'
import httpService from '@/https/httpApi';
import './theme/index.less'
import dateFormat from '@/vueFuntion/dateFormat';

Vue.use(VueI18n)
Vue.component('Icon', Icon)
Vue.component('Upload', Upload)
Vue.component('Page', Page)
Vue.component('Drawer', Drawer)
Vue.component('Button', Button)
Vue.component('Modal', Modal)
Vue.component('Table', Table)
Vue.component('Input', Input)
Vue.component('Avatar', Avatar)
Vue.component('DropdownMenu', DropdownMenu)
Vue.component('DropdownItem', DropdownItem)
Vue.component('Dropdown', Dropdown)
Vue.component('Carousel', Carousel)
Vue.component('CarouselItem', CarouselItem)
Vue.component('Tabs', Tabs)
Vue.component('TabPane', TabPane)
Vue.component('Form', Form)
Vue.component('FormItem', FormItem)
Vue.prototype.httpService = httpService;
Vue.prototype.$dateFormat = dateFormat;
Vue.prototype.$Message = Message;
Vue.config.productionTip = false
const i18n = new VueI18n({locale: 'zhCN', messages: { zhCN }})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: {
    App
  },
  store,
  template: '<App/>'
})
