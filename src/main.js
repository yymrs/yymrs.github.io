import Vue from 'vue'
import VueGtm from "vue-gtm";
import { 
  Menu, Submenu, MenuItem, Input, Form, FormItem, Checkbox, Notification,
  Image, Dialog, Loading, Popover, Backtop, Icon, InfiniteScroll, Button,
  RadioGroup, RadioButton, Radio, Select, Option, Autocomplete, Row, Col, Slider,
  Badge, Upload, Carousel, CarouselItem, Switch,Tooltip
} from 'element-ui'
import lang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
import moment from 'moment'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/utils/permission' // permission control
import {EventBus} from '@/utils/bus'
import commonDirective from '@/utils/directive'
import 'less'
import '@/styles/global.less' // global css
import "@/styles/selfNotify.less";
import VueCropper from "vue-cropper";
import VueFacebookPixel from 'vue-analytics-facebook-pixel';
import amplitude from 'amplitude-js';
import commonMixins from '@/mixins/common'
import '@/icons'
import md5 from 'js-md5';
import global from '@/utils/global';

Vue.config.productionTip = false
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 }
Vue.prototype.$EventBus = EventBus
Vue.use(VueCropper);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(Input);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Checkbox);
Vue.use(Image);
Vue.use(Dialog);
Vue.use(Popover);
Vue.use(Backtop);
Vue.use(Icon);
Vue.use(Select);
Vue.use(Option);
Vue.use(InfiniteScroll);
Vue.use(Button);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Radio);
Vue.use(Autocomplete);
Vue.prototype.$notify = Notification;
Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$moment = moment;
Vue.use(commonDirective);
Vue.use(Row);
Vue.use(Col);
Vue.use(Slider);
Vue.use(Badge);
Vue.use(Upload);
Vue.use(Carousel);
Vue.use(CarouselItem);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.mixin(commonMixins);
Vue.use(VueFacebookPixel, { router, debug: true });
locale.use(lang)

// amplitude埋点
const userId = JSON.parse(localStorage.getItem('USERINFO')) && JSON.parse(localStorage.getItem('USERINFO')).id;  // 是否有userId
console.log(11111111, 'main.js---key', process.env.VUE_APP_AMPLITUDE_API_KEY);
if (userId) {
  console.log(22222222, 'main.js---有userId', userId)
  amplitude.getInstance().init(process.env.VUE_APP_AMPLITUDE_API_KEY, userId, {
    useDynamicConfig: true,
    includeUtm: true,
    includeGclid: true,
    includeReferrer: true
  });
} else {
  console.log(22222222, 'main.js---无userId', userId)
  amplitude.getInstance().init(process.env.VUE_APP_AMPLITUDE_API_KEY, null, {
    useDynamicConfig: true,
    includeUtm: true,
    includeGclid: true,
    includeReferrer: true
  });
}
Vue.prototype.$amplitude = amplitude;
Vue.prototype.$md5 = md5;
Vue.prototype._global = global;

// GTM埋点
Vue.use(VueGtm, {
  id: "GTM-WMKW35X", // Your GTM single container ID or array of container ids ['GTM-xxxxxx', 'GTM-yyyyyy'] or array of objects [{id: 'GTM-xxxxxx', queryPararms: { gtm_auth: 'abc123', gtm_preview: 'env-4', gtm_cookies_win: 'x'}}, {id: 'GTM-yyyyyy', queryParams: {gtm_auth: 'abc234', gtm_preview: 'env-5', gtm_cookies_win: 'x'}}]
  queryParams: {
    // Add url query string when load gtm.js with GTM ID (optional)
    // gtm_auth: "AB7cDEf3GHIjkl-MnOP8qr",
    // gtm_preview: "env-4",
    // gtm_cookies_win: "x",
  },
  defer: false, // defaults to false. Script can be set to `defer` to increase page-load-time at the cost of less accurate results (in case visitor leaves before script is loaded, which is unlikely but possible)
  enabled: true, // defaults to true. Plugin can be disabled by setting this to false for Ex: enabled: !!GDPR_Cookie (optional)
  debug: true, // Whether or not display console logs debugs (optional)
  loadScript: true, // Whether or not to load the GTM Script (Helpful if you are including GTM manually, but need the dataLayer functionality in your components) (optional)
  vueRouter: router, // Pass the router instance to automatically sync with router (optional)
  ignoredViews: [], // Don't trigger events for specified router names (case insensitive) (optional)
  trackOnNextTick: false, // Whether or not call trackView in Vue.nextTick
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
