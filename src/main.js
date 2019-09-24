import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import router from './router'
import zhCN from './assets/lang/zh-CN'
import store from './store'
import httpService from '@/https/httpApi';
import dateFormat from '@/vueFuntion/dateFormat';
import { Lazyload , Button, Search, Loading, Swipe, SwipeItem, Tab, Tabs, RadioGroup, Radio, SwitchCell, DatetimePicker } from 'vant';
import 'vant/lib/index.css';

const options = {
    error: 'https://static1.zugeliang01.com/boss/img/2d9f7620-0923-11e7-a590-edb42e297052.jpg?imageView2/0/w/150/h/150',
    loading: 'https://static1.zugeliang01.com/boss/img/2d9f7620-0923-11e7-a590-edb42e297052.jpg?imageView2/0/w/150/h/150'
};
Vue.use(VueI18n)
Vue.use(DatetimePicker);
Vue.use(SwitchCell);
Vue.use(Swipe);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(SwipeItem);
Vue.use(Loading);
Vue.use(Lazyload, options);
Vue.use(Search);
Vue.use(Button);
Vue.use(Tab).use(Tabs);

Vue.prototype.httpService = httpService;
Vue.prototype.$dateFormat = dateFormat;
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
