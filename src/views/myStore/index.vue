<template>
  <div class="mystore-page">
    <div class="mystore-container">
      <div class="left-nav">
        <div class="mystore-title" :class="{activeUrl:watchActiveUrl({urlName:'MyStore'})}" @click="showChildPage('MyStore')">
          My Trendsi store
        </div>
        <div class="store-list">
          <div class="store-item" :class="{activeUrl:watchActiveUrl(item)}" v-for="item in storeItem"  :key="item.label" @click="storeItemHandle(item)">
            <svg><use :xlink:href='"#icon-"+item.icon' /></svg>
            <span>{{item.label}}</span>
          </div>
        </div>
      </div>
      <div class="mystore-right-content"> 
        <router-view v-if="$route.name!='MyStore'" />
        <div class="default-content" v-else>
          <div class="title">
            Website
          </div>
          <div class="live-site flex-space-between"> 
            <div class="live-site-left">
              <div>
                <span>Live Site</span>
              </div>
              <div class="website-url">
                <a :href="storeUrl" target="_blank">{{storeUrl}}
                  <img :src="require('@/static/storeSetting/eyeBlue@2x.png')">
                  <img class="eye" :src="require('@/static/storeSetting/eyeY@2x.png')">
                </a>
              </div>
            </div>
            <div class="live-site-right"  @click="shareShop('','product',storeUrl)">
              <!-- <img :src="require('@/static/storeSetting/copy@2x.png')"> -->
              <svg><use xlink:href="#icon-copy" /></svg>
            </div>
          </div>
          <div class="appearance flex-space-between" @click="showChildPage('WebsiteStyle')"> 
            <div class="appearance-left">
              <div>
                <span class="strong-text">Appearance</span>
              </div>
              <div >
                <span>Customize website background, text color, button color and style</span>
              </div>
            </div>
            <div>
              <img class="right-arrow" :src="require('@/static/rightArrowB@2x.png')">
              <img class="right-arrow2" :src="require('@/static/rightArrowY@2x.png')">
            </div>
          </div>
          <div class="store-settings flex-space-between" @click="showChildPage('StoreSetting')"> 
            <div class="store-settings-left">
              <div>
                <span class="strong-text">Store Settings</span>
              </div>
              <div>
               <span>Edit store logo, name, URL and social link displays</span>
              </div>
            </div>
            <div>
              <img class="right-arrow" :src="require('@/static/rightArrowB@2x.png')">
              <img class="right-arrow2" :src="require('@/static/rightArrowY@2x.png')">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import productShare from '@/mixins/share'
import { shopInfo } from '@/api/storeSetting'
export default {
  name:'MyStore',
  mixins:[productShare],
  data() {
    return {
      domainName:{
        url:''
      },
      storeItem:[
        {
          label:'View Store',
          urlName:'',
          icon:'eye'
        },
        {
          label:'Copy URL',
          urlName:'',
          copy:true,
          icon:'copy'
        },
        {
          label:'Appearance',
          urlName:'WebsiteStyle',
          icon:'apperence'
        },
        {
          label:'Store Settings',
          urlName:'StoreSetting',
          icon:'setting'
        },
      ]
    }
  },
  computed:{
    storeUrl() {
      const {url} = this.domainName
      return `https://${url}.shop.social`
    }
  },
  created() {
    // 没有店铺去绑定店铺
    const userInfo = JSON.parse(localStorage.getItem('USERINFO'));
    if( userInfo.domainName === null || userInfo.domainName === undefined || userInfo.domainName === '' ) {
      this.$router.replace({path: '/login/setup-info', query: {isShowSetUpLater: false}})
    } 
  },
  activated() {
    this.$EventBus.$off('upDataStore')
    this.$EventBus.$on('upDataStore',()=> {
      this.getStoreData()
    })
    this.getStoreData()
  },
  methods:{
    getStoreData() {
      shopInfo({},(res)=>{
        const {domainName} = res.result
        this.domainName.url = domainName
        let newUserInfo =  JSON.stringify(Object.assign( {}, JSON.parse(localStorage.getItem('USERINFO')), { 
          domainName: `https://${domainName}.shop.social`
        }))
        localStorage.setItem('USERINFO', newUserInfo);
      },()=>{

      },()=>{
      })
    },
    watchActiveUrl(item) {
      const routerName = this.$route.name
      return routerName==item.urlName
    },
    showChildPage(name) {
      this.$router.push({name})
    },
    storeItemHandle(item) {
      if(item.urlName) {
        this.showChildPage(item.urlName)
      }else if(item.copy) {
        this.shareShop('','product',this.storeUrl)
      }else {
        window.open(this.storeUrl,'_blank')
      }
    }
  }
}
</script>
<style lang="less">
.mystore-page {
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  position: relative;
  padding-top: 24px;
  .mystore-container {
    width: 100%;
    margin-top: 40px;
    max-width: 1320px;
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    @media screen and (min-width: 768px) {
      padding: 0 40px;
    }
    .left-nav {
      position: fixed;
      top: 89px;
      max-width: 168px;
      height: 407px;
      // flex: 1;
      .activeUrl {
        color: #C79818 !important;
        span {
          color: #C79818 !important;
        }
      }
      .mystore-title {
        font-size: 18px;
        font-weight: bold;
        line-height: 25px;
        margin-bottom: 16px;
        cursor: pointer;
        &:hover {
          color: #C79818;
        }
      }
      .store-list {
        .store-item {
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          line-height: 22px;
          cursor: pointer;
          svg {
            fill: currentColor;
            width: 18px;
            height: 18px;
            margin-right: 6px;
          }
          // &:nth-child(2) {
          //   img {
          //     width: 15px;
          //     margin-right: 10px;
          //   }
          // }
          &:hover {
            span {
              font-weight: 700;
              color: #C79818;
            }
            svg {
              fill:#C79818
            }
          }
          &:nth-child(3),&:nth-child(4) {
            border-top: 1px solid #EEEEEE;
            padding-top: 15px;
            line-height: 24px;
            margin-bottom: 16px;
            span {
              font-weight: 500;
              font-size: 18px;
            }
          }
          // img {
          //   width: 18px;
          //   margin-right: 6px;
          // }
          span {
            color: #333;
            font-size: 16px;
          }
        }
      }

    }
    .mystore-right-content {
      margin-left: 208px;
      flex: 2;
      .default-content {
        .title {
          font-weight: bold;
          font-size: 18px;
          line-height: 22px;
          color: #333333;
          margin-bottom: 24px;
        }
        .flex-space-between {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          // &:nth-child(2) {
          //   border-bottom: 1px solid #eee;
          //   border-top: 1px solid #eee;
          // }
        }
        .live-site {
          background: #F9F9F9;
          height: 84px;
          margin-bottom: 24px;
          background: #FFFFFF;
          box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
          border-radius: 10px;
          .live-site-left {
            padding: 16px 0 16px 16px;
            .website-url {
              margin-top: 8px;
              display: flex;
              align-items: center;
              cursor: pointer;
              a {
                color: #167DFB;
                display: flex;
                align-items: center;
              }
              img {
                margin-left: 8px;
                width: 18px;
              }
              .eye {
                display: none;
              }
              &:hover {
                a {
                  color: #C79818;
                }
                img {
                  display: none;
                }
                .eye {
                  display: initial;
                }
              }
            }
          }
          .live-site-right {
            cursor: pointer;
            background: #EEEEEE;
            margin-right: 18px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            &:hover {
              opacity: .8;
            }
            svg {
              width: 15.23px;
              height: 18px;
            }
          }
        }
        .appearance ,.store-settings{
          padding: 16px 0;
          border-bottom: 1px solid #eee;
          border-top: 1px solid #eee;
          cursor: pointer;
          .right-arrow {
            display: block;
            height: 24px;
            width: 24px;
          }
          &:hover {
            span {
              color:#C79818
            }
            .right-arrow2 {
              display: block;
              width: 24px;
              height: 24px;
            }
            .right-arrow {
              display: none;
            }
          }
          .right-arrow2 {
            display: none;
          }
          .strong-text {
            font-weight: bold;
            font-size: 18px;
            line-height: 22px;
            margin-bottom: 16px;
            display: inline-block;
          }
          span {
            font-size: 14px;
            line-height: 22px;
            color: #333333;
          }
        }
      }
    }
  }
}
</style>