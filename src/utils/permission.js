import router from '@/router'
import store from '@/store'
// import { Notification } from 'element-ui'
import VueCookies from 'vue-cookies'
import {isMobileOs} from '@/utils/common'
import amplitude from 'amplitude-js'
import _global from '@/utils/global';

const whiteList = [  // whiteList
  '/login',
  '/login/verification',
  '/login/info',
  '/login/questionnaire',
  '/login/setup-store',
  // '/login/setup-info',
  // '/login/setup-success',
  // '/login/setup-addproducts',
  '/login/add-channel',
  '/login/invite-code',
  // '/shopifyLogin',
  // '/mobileShow'
];

function setPageAmplitude(pageCode, to) {
  console.log(111, 'page埋点-----', pageCode, to);
  let event_value;
  let pv_id_val = global.userId?_global.pv_id_func(_global.userId):_global.pv_id_func(amplitude.getInstance().options.deviceId);
  switch(pageCode) {
    case 'product_detail_page':
      event_value = to.query.id;
      to.params.pv_id = pv_id_val;
      break;
    default:
      to.params.pv_id = pv_id_val;
      break;
  }
  amplitude.getInstance().logEvent('imp', {
    'page_code': pageCode,
    'module_code': '',
    'position_code': '',
    'event_target': 'page',
    'event_value': event_value || '',
    'pv_id': pv_id_val,
    'url': window.location.href
  });
}

router.beforeEach(async(to, from, next) => {
  { // Google analytics获取UTM标签：https://zhuanlan.zhihu.com/p/22557609
    let UTMInfo = {};
    if (to.name === 'InputMobile' && to.fullPath.split('?')[1]) {
      to.fullPath.split('?')[1].split('&').forEach((item)=>{
        UTMInfo[item.split('=')[0]] = item.split('=')[1]
      })
    }
    if( Object.keys(UTMInfo).length !== 0  && Object.keys(UTMInfo).includes('utm_source') ) { localStorage.setItem('UTMINFO', JSON.stringify(UTMInfo)); }
  }
  document.title = to.meta.title; // set page title

  let isMobile = isMobileOs.call(to);
	let { inAPP } = to.query;
  const hasToken = VueCookies.get('TOKEN'); // get token
  const completed = JSON.parse(localStorage.getItem('COMPLETED')); // 是否填了email
  const questionnaire = JSON.parse(localStorage.getItem('QUESTIONNAIRE'));  // 是否填了问卷
  const uuId = JSON.parse(localStorage.getItem('USERINFO')) && JSON.parse(localStorage.getItem('USERINFO')).uuId;  // 是否有uuId
  const allInfo = JSON.parse(localStorage.getItem('ALLINFO')); // 获取用户信息
  const bindshopify = JSON.parse(localStorage.getItem('BINDSHOPIFY')); // 是否是shopify过来的
  
  // 这里是Shopify页面过来的一系列操作：手动修改了isShopify=true,store/bind接口不成功的话，得改回来false
  if (
    (uuId && completed && questionnaire && bindshopify && bindshopify.shop) ||
    (uuId && completed && questionnaire && to.name === "Channels" && to.query.shop) || 
    (uuId && completed && questionnaire && allInfo.isOpenShopify === false)
  ) {
    allInfo.isShopify = true;
    localStorage.setItem('ALLINFO', JSON.stringify(allInfo));
  }

  { // 是否是游客模式，以及路由跳转配置
    // (allInfo.setUpLater) || !((allInfo.isShopify === false || allInfo.isShopify === null) && (!allInfo.hasCreateStore)) // 既没有shopify店，又没有trendsi店
    const isTouristPermission = !( hasToken && uuId && completed && questionnaire && allInfo &&
    (allInfo.setUpLater || (allInfo.isShopify === true) || allInfo.hasCreateStore) // 有没有setUpLater，有没有shopify店，有没有trendsi店
    || (inAPP === 1) || (inAPP === '1') );

    if (allInfo) {
      allInfo.isTouristPermission = isTouristPermission;
      localStorage.setItem('ALLINFO', JSON.stringify(allInfo));
      console.log('游客模式', allInfo.isTouristPermission);
      if (allInfo.isTouristPermission) {
        amplitude.getInstance().setUserId(null);
        _global.userId = null;
      } else {
        amplitude.getInstance().setUserId(allInfo.id);
        _global.userId = allInfo.id;
      }
    }
    // web手机打开跳转下载app 加上return防止继续下一个next
    if (to.path==='/mobileShow') {
      setPageAmplitude('mweb_app_download_page', to);
      next()
      return
    }
    if (isMobile) {
      setPageAmplitude('mweb_app_download_page', to);
      next({ path: '/mobileShow' })
      return
    }
    // 游客模式登陆后跳转到游客之前浏览的页面
    if (!isTouristPermission&&whiteList.includes(to.path)) {
      if(whiteList.includes(to.path)&& to.path !== '/login'){
        next({ path: '/' });
      }
    }
    // 如果已登录的话，跳转/login的话，还会在本页的，除非退出
    if (!isTouristPermission && to.path === '/login') { // if is logged in, redirect to the home page
      next({ path: from.fullPath });
    }
    // 游客模式下这些页面需要跳转到login
    if (isTouristPermission && (
      to.name === 'Collections' ||
      to.name === 'CollectionsDetail' ||
      to.name === 'AddProducts' ||
      to.name === 'Orders' ||
      to.name === 'OrdersDetail' ||
      to.name === 'Packaging' ||
      to.name === 'Channels' ||
      to.name === 'Checkout' ||
      to.name === 'BuySample' ||
      to.name === 'eventDetail'||
      to.name === 'MyStore' ||
      to.name === 'WebsiteStyle' ||
      to.name === 'StoreSetting'
    )) {
      localStorage.setItem('ACTIVITYURL', window.location.href);
      // 1.shopify过来的话,在本页跳login
      // 2.新开窗口跳login
      if (to.query.action && to.query.shop) {
        next(`/login?redirect=${to.fullPath}&info=${JSON.stringify(to.query)}`);
      } else {
        // next(from.fullPath);
        next(`/login?redirect=${to.fullPath}&info=${JSON.stringify(to.query)}`);
        // window.open(`/login?redirect=${to.fullPath}&info=${JSON.stringify(to.query)}`, '_blank');
      }
    }
    // // 这两个是window.open先打开一个的，要去指定地方去判断
    // if (isTouristPermission && (
    //   to.name === 'Activity' ||
    //   to.name === 'eventDetail'
    // )) {
    //   next(from.fullPath);
    //   window.open('/login', '_blank');
    // }

    // 防止登录之后刷新浏览器而store里的数据丢失
    if (store.getters.userInfo && store.getters.userInfo.firstName) { // the user has obtained his permission roles
      next()
    } else { // no user permission roles
      try {
        await store.dispatch('user/getInfo')
        next()
      } catch (error) {
        await store.dispatch('user/resetToken') // remove token and go to login page to re-login
        next()
      }
    }
  }

  console.log('permission.js---to', to);
  switch (to.name) {
    case 'InputMobile':
      setPageAmplitude('sign_in_page', to);
      break;
    case 'UserInfo':
      setPageAmplitude('basic_info_page', to);
      break;
    case 'Questionnaire':
      setPageAmplitude('sign_up_questionaire_page', to);
      break;
    case 'SetupStore':
      setPageAmplitude('sign_up_sales_channel_page', to);
      break;
    case 'SetupInfo':
      setPageAmplitude('trendsi_store_sign_up_page', to);
      break;
    case 'SetupAddproducts':
      setPageAmplitude('trendsi_store_sign_up_select_product_page', to);
      break;
    case 'SetupSuccess':
      setPageAmplitude('trendsi_store_sign_up_completion_page', to);
      break;
    // case 'Products':
    //   setPageAmplitude('home_page', to);
    //   break;
    // case 'Search':
    //   setPageAmplitude('search_results_page', to);
    //   break;
    // case 'ClassifyMore':
    //   setPageAmplitude('product_listing_page', to);
    //   break;
    // case 'ClassifyMore2':
    //   setPageAmplitude('product_listing_page', to);
    //   break;
    // case 'ClassifyMore3':
    //   setPageAmplitude('product_listing_page', to);
    //   break;
    case 'AddProducts':
      setPageAmplitude('added_product_listing_page', to);
      break;
    case 'productsDetail':
      setPageAmplitude('product_detail_page', to);
      break;
    case 'Collections':
      setPageAmplitude('collection_listing_page', to);
      break;
    // case 'CollectionsDetail':
    //   setPageAmplitude('collection_listing_detail_page', to);
    //   break;
    case 'Orders':
      setPageAmplitude('order_listing_page', to);
      break;
    case 'OrdersDetail':
      setPageAmplitude('order_detail_page', to);
      break;
    case 'Packaging':
      setPageAmplitude('packaging_page', to);
      break;
    case 'Channels':
      setPageAmplitude('channels_listing_page', to);
      break;
    case 'BuySample':
      setPageAmplitude('sample_order_shopping_cart_page', to);
      break;
    case 'Checkout':
      setPageAmplitude('sample_order_place_order_page', to);
      break;
    case '404':
      setPageAmplitude('404_page', to);
      break;
    // case 'Activity':
    //   setPageAmplitude('promotion_banners_page', to);
    //   break;
    // case 'mobileShow':
    //   setPageAmplitude('mweb_app_download_page', to);
    //   break;
    default:
      console.log('other');
      break;
  }

  // if ( // has token
  //   hasToken && uuId && completed && questionnaire && allInfo && 
  //   !((allInfo.isShopify === false || allInfo.isShopify === null) && 
  //   (!allInfo.hasCreateStore)) || (inAPP === 1)
  // ) {
  //   // if (to.path === '/login') { // if is logged in, redirect to the home page
  //   //   next({ path: '/' })
  //   // }  else {
  //   //   if (store.getters.userInfo && store.getters.userInfo.firstName|| inAPP===1 ) { // the user has obtained his permission roles
  //   //     next()
  //   //   } else { // no user permission roles
  //   //     try {
  //   //       await store.dispatch('user/getInfo')
  //   //       next()
  //   //     } catch (error) {
  //   //       await store.dispatch('user/resetToken') // remove token and go to login page to re-login
  //   //       Notification({
  //   //         title: "Oops",
  //   //         message: 'Verification failed,\n please Login again.',
  //   //         iconClass:'el-icon-warning-outline',
  //   //         duration: 3000
  //   //       });
  //   //       next('/login')
  //   //     }
  //   //   }
  //   // }
  //   if (to.path==='/mobileShow') {
  //     next()
  //   } else 
  //   if (to.path === '/login') { // if is logged in, redirect to the home page
  //     if (isMobile) {
  //       next({ path: '/mobileShow' })
  //     } else {
  //       next({ path: '/' })
  //     }
  //   } else {
  //     if (store.getters.userInfo && store.getters.userInfo.firstName|| inAPP===1 ) { // the user has obtained his permission roles
  //       if (isMobile) {
  //         next({ path: '/mobileShow' })
  //       } else {
  //         next()
  //       }
  //     } else { // no user permission roles
  //       try {
  //         await store.dispatch('user/getInfo')
  //         if (isMobile) {
  //           next({ path: '/mobileShow' })
  //         } else {
  //           next()
  //         }
  //       } catch (error) {
  //         await store.dispatch('user/resetToken') // remove token and go to login page to re-login
  //         Notification({
  //           title: "Oops",
  //           message: 'Verification failed,\n please Login again.',
  //           iconClass:'el-icon-warning-outline',
  //           duration: 3000
  //         });
  //         next('/login')
  //       }
  //     }
  //   }
  // } else {
  //   // if (whiteList.indexOf(to.path) !== -1) {
  //   //   next() // in the free login whitelist, go directly
  //   // } else {
  //   //   localStorage.setItem('ACTIVITYURL', window.location.href);
  //   //   next(`/login?redirect=${to.fullPath}&info=${JSON.stringify(to.query)}`) // other pages that do not have permission to access are redirected to the login page.
  //   // }
  //   if (to.path=='/mobileShow') {
  //     next()
  //   } else if (whiteList.indexOf(to.path) !== -1) {
  //     if (isMobile) {
  //       next({ path: '/mobileShow' })
  //     } else {
  //       next() // in the free login whitelist, go directly
  //     }
  //   } else {
  //     localStorage.setItem('ACTIVITYURL', window.location.href);
  //     next(`/login?redirect=${to.fullPath}&info=${JSON.stringify(to.query)}`) // other pages that do not have permission to access are redirected to the login page.
  //   }
  // }

})
router.afterEach(() => {}) // done