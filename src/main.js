import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App.vue'
import router from './router'
import wx from 'weixin-js-sdk';
import zhCN from './assets/lang/zh-CN'
import store from './store'
import Vlf from '@/vueFuntion/vlf';
import httpService from '@/https/httpApi';
import shareMethod from '@/vueFuntion/share';
import VueClipboard from 'vue-clipboard2'
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
Vue.use(Vlf);
Vue.use(VueClipboard);
Vue.use(Tab).use(Tabs);

Vue.prototype.httpService = httpService;
Vue.prototype.$dateFormat = dateFormat;
Vue.prototype.$vlf = Vlf;
Vue.prototype.$share = shareMethod;
Vue.config.productionTip = false;
const i18n = new VueI18n({locale: 'zhCN', messages: { zhCN }});

router.beforeEach((to, from, next) => {
    httpService.getSign({
        url: decodeURIComponent(window.location.href)
    }).then(res => {
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.data.appId, // 必填，公众号的唯一标识
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr,// 必填，生成签名的随机串
            signature: res.data.signature,// 必填，签名
            jsApiList: [
                'onMenuShareTimeline',
                'onMenuShareAppMessage',
                'onMenuShareQQ',
                'onMenuShareWeibo',
                'onMenuShareQZone',
                'chooseWXPay',
                'getLocation'
            ] // 必填，需要使用的JS接口列表
        });
        next();
    });
});
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
