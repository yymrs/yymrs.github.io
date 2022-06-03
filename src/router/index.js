import Vue from 'vue'
import VueRouter from 'vue-router'
import CommonLogin from '../views/login/CommonLogin.vue'
import Layout from '../views/layout/index.vue'

Vue.use(VueRouter)
// 解决重复点击路由报错的BUG
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}
const routes = [
  {
    path: '/login',
    component: CommonLogin,
    redirect: '/login',
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/login/inputMobile'),
        name: 'InputMobile',
        meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: true }
      },
      {
        path: 'verification', // verification
        component: () => import('@/views/login/verificationCode'),
        name: 'VerificationCode',
        meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: true }
      },
      {
        path: 'info',
        component: () => import('@/views/login/userInfo'),
        name: 'UserInfo',
        meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: true }
      },
      {
        path: 'questionnaire',
        component: () => import('@/views/login/questionnaire'),
        name: 'Questionnaire',
        meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: true }
      },
      {
        path: 'invite-code',
        component: () => import('@/views/login/invitationCode'),
        name: 'InvitationCode',
        meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: true }
      },
      {
        path: 'setup-store', // setup-store
        component: () => import('@/views/login/setupStore'),
        name: 'SetupStore',
        meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: true }
      },
      {
        path: 'setup-info', // setup-info
        component: () => import('@/views/login/setupInfo'),
        name: 'SetupInfo',
        meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: true }
      },
      {
        path: 'setup-addproducts', // setup-addproducts
        component: () => import('@/views/login/setupRecommend'),
        name: 'SetupAddproducts',
        meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: true }
      },
      {
        path: 'setup-success', // setup-success
        component: () => import('@/views/login/setupSuccess'),
        name: 'SetupSuccess',
        meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: true }
      },
      {
        path: 'add-channel', // add-channel
        component: () => import('@/views/login/AddChannel'),
        name: 'AddChannel',
        meta: { title: 'My Channels', noCache: true }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/',
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/products/products/index'),
        name: 'Products',
        meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: false }
      },
      {
        path: 'products/detail',
        name: 'productsDetail',
        component: () => import('@/views/products/productsDetail/index'),
        meta: { title: '', noCache: true }
      },
      // {
      //   path: 'products/classify',
      //   name:'Classify',
      //   component: () => import('@/views/products/productClassify/index'),
      //   meta: { title: '', noCache: false }
      // },
      {
        path: 'classify/:name',
        component: () => import('@/views/products/productClassify/index'),
        children:[
          {
            path: '',
            name:'ClassifyMore',
            // component: () => import('@/views/products/productClassify/index'),
            meta: { title: '', noCache: true }
          },
          {
            path: ':name2',
            name:'ClassifyMore2',
            // component: () => import('@/views/products/productClassify/index'),
            meta: { title: '', noCache: true }
          },
          {
            path: ':name2/:name3',
            name:'ClassifyMore3',
            // component: () => import('@/views/products/productClassify/index'),
            meta: { title: '', noCache: true }
          }
        ],
        meta: { title: '', noCache: true }
      },
      {
        path: 'products/classify-all',
        name:'ClassifyAll',
        component: () => import('@/views/products/productClassify/seeAll'),
        meta: { title: 'Finding Products', noCache: false }
      },
      {
        path: 'products/search',
        name:'Search',
        component: () => import('@/views/products/search/index'),
        meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: false }
      },
      {
        path: 'products/buySample',
        name:'BuySample',
        component: () => import('@/views/products/buySample/index'),
        meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: true }
      }
    ]
  },
  {
    path: '/collections',
    component: Layout,
    redirect: '/collections',
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/collections/index'),
        name: 'Collections',
        meta: { title: 'My Collections', noCache: false }
      },
      {
        path: 'detail',
        component: () => import('@/views/collections/collectionsDetail/index'),
        name: 'CollectionsDetail',
        meta: { title: '', noCache: false }
      },
    ]
  },
  {
    path: '/add-products',
    component: Layout,
    redirect: '/add-products',
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/add-products/index'),
        name: 'AddProducts',
        meta: { title: 'Added Products', noCache: true }
      }
    ]
  },
  {
    path: '/orders',
    component: Layout,
    redirect: '/orders',
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/orders/index'),
        name: 'Orders',
        meta: { title: 'Orders', noCache: true }
      },
      {
        path: 'detail/:id(\\d+)',
        component: () => import('@/views/orders/ordersDetail/index'),
        name: 'OrdersDetail',
        meta: { title: 'Orders Detail', noCache: true }
      },
      {
        path: 'detail/return/:id(\\d+)',
        component: () => import('@/views/orders/ordersDetail/return'),
        name: 'OrdersReturn',
        meta: { title: 'Orders Detail Return', noCache: true }
      }
    ]
  },
  {
    path: '/returns',
    component: Layout,
    redirect: '/returns',
    hidden: true,
    children: [
      {
        path: 'details/:id(\\d+)',
        component: () => import('@/views/orders/ordersDetail/returnDetail'),
        name: 'OrdersDetailReturn',
        meta: { title: 'Orders Detail Return', noCache: true }
      }
    ]
  },
  {
    path: '/packaging',
    component: Layout,
    redirect: '/packaging',
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/packaging/index'),
        name: 'Packaging',
        meta: { title: 'Packaging', noCache: true }
      }
    ]
  },
  {
    path: '/channels',
    component: Layout,
    redirect: '/channels',
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/channels/index'),
        name: 'Channels',
        meta: { title: 'My Channels', noCache: true }
      }
    ]
  },
  {
    path: '/checkout',
    component: Layout,
    redirect: '/checkout',
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/checkout/index'),
        name: 'Checkout',
        meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: true }
      }
    ]
  },
  {
    path: '/my-store',
    component: Layout,
    hidden: true,
    redirect: '/my-store/website',
    children: [
      {
        path: 'website',
        component: () => import('@/views/myStore/index'),
        name: 'MyStore',
        meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: false ,asideHidden:true},
        children:[
          {
            path: 'style',
            component: () => import('@/views/myStore/components/websiteStyle'),
            name: 'WebsiteStyle',
            meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: false ,asideHidden:true}
          },
          {
            path: 'store-setting',
            component: () => import('@/views/myStore/components/storeSetting'),
            name: 'StoreSetting',
            meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: false ,asideHidden:true}
          },
        ]
      },
      
    ]
  },
  {
    path: '/event',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '',
        component: () => import('@/views/activity/index'),
        name: 'Activity',
        meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: false, asideHidden:false }
      }
    ]
  },
  {
    path: '/event-detail',
    component: () => import('@/views/activity/detail'),
    name: 'eventDetail',
    hidden: true,
    meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: true}
  },
  // 免登录
  {
    path: '/shopifyLogin',
    component: () => import('@/views/login/nologin'),
    name: 'shopifyLogin',
    hidden: true,
    meta: { title: 'Trendsi | Your Fashion Business Made Easy', noCache: true}
  },
  {
    path: '/mobileShow',
    component: () => import('@/views/mobile/index'),
    name: 'mobileShow',
    hidden: true,
    meta: { title: 'Trendsi Mobile Apps', noCache: true}
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    name: '404',
    hidden: true,
    meta: { title: '404', noCache: true}
  },
  { path: '*', name: '404', redirect: '/404', hidden: true, meta: {noCache: true}}
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
