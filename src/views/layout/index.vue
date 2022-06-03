<template>
  <div class="layout" :class="{'has-message-info':messageList.length>0}">
    <!-- 头部公共信息 -->
   <top-message v-if="!isTourist&&messageList.length>0" :class="{asideHidden:asideHidden&&!isTourist}" :messageList='messageList' />
   <header :class="{zindex,asideHidden:asideHidden&&!isTourist&&messageList.length>0}">
      <div class="layout-header" v-if="!$route.meta.headerHidden">
        <div>
          <router-link to="/">
            <template v-if="isWebMobile">
              <img class="header-proj" :class="isTourist?'is-tourist':''" :src="projName" alt="">
            </template>
            <template v-else>
              <img class="header-proj" :class="isTourist?'is-tourist':''" :src="projNameTourist" alt="">
            </template>
          </router-link>
        </div>
        <!-- isWebMobile 隐藏web搜索 -->
        <div class="header-search" v-show="!isWebMobile" :class="isTourist?'is-tourist':''">
          <el-input
            v-show="!dialogVisibleSearch"
            class="header-search-input"
            :class="isTourist?'is-tourist':''"
            placeholder="Search Products"
            prefix-icon="el-icon-search"
            @focus="isShowSearch"
            v-model="keyword">
          </el-input>
        </div>
        <el-dialog v-show="dialogVisibleSearch"  :visible.sync="dialogVisibleSearch" :modal="false" class="dialog-search" @close="closeParent">
          <el-input
            ref="inputSearch"
            v-focus
            clearable
            class="header-search-input header-search-input-large"
            placeholder="Search"
            prefix-icon="el-icon-search"
            @keyup.enter.native="searchSubmit()"
            @input="searchInput"
            v-model="keyword">
          </el-input>
          <div class="header-search-list">
            <ul><li :class="{'active':indexSearch-1===index}" v-for="(item, index) in searchlists" :key="index" @click="searchSelect(item)" v-html="searchFuzzyMatching(item)">{{ item }}</li></ul>
          </div>
          <div class="header-search-recent" v-if="recentSearches.length!==0">
            <div class="recent-header">
              <div><span>Recent Searches</span></div>
              <div class="recent-clear" @click="recentClear">Clear</div>
            </div>
            <div class="recent-info"><div v-for="(item, index) in recentSearches" :key="index" @click="recentSearch(item)">{{ item }}</div></div>
          </div>
          <div class="header-search-recentview" v-if="productLists.length!==0">
            <span>Recently Viewed</span>
            <product-list :productLists="productLists" @close="closeParent" :isTourist="isTourist"></product-list>
          </div>
        </el-dialog>
        <div class="header-right">
          <template v-if="isTourist">
            <div class="mobile-search" @click="isShowSearch" v-if="isWebMobile">
              <i class="el-icon-search"></i>
            </div>
            <div class="header-help" :class="isTourist?'is-tourist':''" v-if="isTourist" @click="helpCenter()">Help Center</div>
            <div class="header-sign" :class="isTourist?'is-tourist':''" v-if="isTourist" @click="logout()">Sign Up/Sign In</div>
          </template>
         <template v-else>
          <div class="header-self-pop">
            <div class="header-avatar-box" :class="{zindex}" @mouseover='popContentHover' @mouseout='popContentOut'>
              <img class="user-img" src="@/static/user@2x.png" alt="">
              <span class="my-account">My Account</span>
              <img class="user-hove-down" src="@/static/down@2x.png">
              <div class="pop-content"> 
                <div class="user-info">
                  <img v-imgError class="pop-avatar" :src="avatarName || avatarNameDefault" alt="" >
                  <div class="pop-user">
                    <div class="pop-fullname">{{ fullName }}</div>
                    <div class="pop-mobile">{{ mobile }}</div>
                  </div>
                </div>
                <div class="invitation-code" @click="shareInvitationCode(invitationCode)">
                  <span>My Referral Code</span>
                  <span>{{invitationCode}}</span>
                </div>
                <ul>
                  <li @click.stop="goRouter('/add-products')">
                    <a @click.prevent>Added Products</a>
                  </li>
                  <li @click.stop="goRouter('/collections')">
                    <a @click.prevent>Collections</a>
                  </li>
                  <li @click.stop="goRouter('/orders')">
                    <el-badge is-dot v-if="isUnpaid">
                      <a @click.prevent>Orders</a>
                    </el-badge>
                    <a v-else @click.prevent>Orders</a>
                  </li>
                  <li @click.stop="goRouter('/packaging')">
                    <a @click.prevent>Packaging</a>
                  </li>
                  <li class="quarantine-line"></li>
                  <li style="margin-top:12px" @click="myStore"><a href="javascript:void(0);">My Trendsi Store</a></li>
                  <li @click.stop="goRouter('/channels')">
                    <a @click.prevent>My Channels</a>
                  </li>
                  <li class="quarantine-line"></li>
                  <li class="my-settings">
                    <span class="title">My Settings</span>
                    <span @click="editPriceRules">Price Rules</span>
                    <span @click="payment">Payment Methods</span>
                    <span @click="addresses">Shipping Addresses</span>
                    <span class="quarantine-line"></span>
                    <a class="text-center" href="javascript:void(0);" @click="helpCenter">Help Center</a>
                    <span class="text-center" @click="logout()">Sign Out</span>
                  </li>
                </ul>
              </div>
              <div class="popper__arrow"></div>
            </div>
          </div>
          <div class="header-bag" v-if="!isTourist" @click="showBag()">
            <el-badge v-if="bagValue>0" :value="(bagValue>999)?'999+':bagValue" class="item">
              <img src="@/static/bag@2x.png" alt="">
            </el-badge>
            <img v-else src="@/static/bag@2x.png" alt="">
            
            <!-- <el-popover placement="top"  width="256" trigger="hover"  v-if="!isTourist">
          <div class="pop-content"> 
            <div class="user-info">
              <img v-imgError class="pop-avatar" :src="avatarName || avatarNameDefault" alt="" >
              <div class="pop-user">
                <div class="pop-fullname">{{ fullName }}</div>
                <div class="pop-mobile">{{ mobile }}</div>
              </div>
            </div>
            <div class="invitation-code" @click="shareInvitationCode(invitationCode)">
              <span>My Referral Code</span>
              <span>{{invitationCode}}</span>
            </div>
            <ul>
              <li>
                <router-link to="/add-products">Added Products</router-link>
              </li>
              <li>
                <router-link to="/collections">Collections</router-link>
              </li>
              <li>
                <router-link to="/orders">Orders</router-link>
              </li>
              <li>
                <router-link to="/packaging">Packaging</router-link>
              </li>
              <li class="quarantine-line"></li>
              <li @click="myStore"><a href="javascript:void(0);">My Trendsi Store</a></li>
              <li>
                <router-link to="/channels">My Channels</router-link>
              </li>
              <li class="quarantine-line"></li>
              <li class="my-settings">
                <span class="title">My settings</span>
                <span @click="editPriceRules">Price Rules</span>
                <span @click="payment">Payment Methods</span>
                <span @click="addresses">Shipping Addresses</span>
                <span class="quarantine-line"></span>
                <a class="text-center" href="javascript:void(0);" @click="helpCenter">Help Center</a>
                <span class="text-center" @click="logout()">Sign Out</span>
              </li>
            </ul>
          </div>
          <div class="header-avatar-box" slot="reference">
            <img class="user-img" src="@/static/user@2x.png" alt="">
            <span>My Account</span>
            <img class="user-hove-down" src="@/static/down@2x.png">
          </div>
        </el-popover> -->
          </div>
          </template>
        </div>
        
      </div>
    </header>
    <add-address v-if="addaddressShow" :dialogVisible.sync="addaddressShow" @close='addaddressShow=false' :modal="true" :modalAppend="false" :modalAppendDelete="false" setType="setDefault" />
    <add-pay v-if="addpayShow" :dialogVisible.sync="addpayShow" @close='addpayShow=false' :modal="true" :modalAppend="false" :modalAppendDelete="false" setType="setDefault" />
    <!-- <div class="aside" v-if="!asideHidden">
      <ul>
        <li><router-link to="/">Products</router-link></li>
        <li @mouseover="mouseOverCollections()" @mouseleave="mouseLeaveCollections()">
          <router-link to="/collections">My Collections</router-link>
          <router-link to="/collections" @click.native="collectionsAdd" v-if="isShowCollections" class="img-link"><img src="../../static/add@2x.png" alt=""></router-link>
        </li>
        <li><router-link to="/add-products">Added Products</router-link></li>
        <li>
          <el-badge is-dot v-if="isUnpaid">
            <router-link to="/orders">Orders</router-link>
          </el-badge>
          <router-link v-else to="/orders">Orders</router-link>
        </li>
        <li><router-link to="/packaging">Packaging</router-link></li>
        <li class="line"></li>
        <li @mouseover="mouseOverStore()" @mouseleave="mouseLeaveStore()">
          <a href="javascript:void(0);" @click="myStore">My Trendsi Store</a>
          <a href="javascript:void(0);" class="img-link" v-if="isShowStore"><img src="../../static/mystore@2x.png" alt="" @click="copyLink"></a>
        </li>
        <li @mouseover="mouseOverChannels()" @mouseleave="mouseLeaveChannels()">
          <router-link to="/channels">My Channels</router-link>
          <router-link to="/channels" @click.native="channelsAdd" v-if="isShowChannels" class="img-link"><img src="../../static/add@2x.png" alt=""></router-link>
        </li>
        <li class="line"></li>
        <li><a href="javascript:void(0);" @click="helpCenter">Help Center</a></li>
        <div class="aside-bottom-info"><div @click="mobileApp">Mobile App</div></div>
      </ul>
    </div> -->
    <div class="content" :class="{asideHidden}">
      <keep-alive>
        <router-view :key="key" v-if="!$route.meta.noCache" />
      </keep-alive>
      <router-view :key="key" v-if="$route.meta.noCache"></router-view>
      <transition name="el-zoom-in-center">
        <el-button v-show="showUsersnap" v-if="isWhiteUser" class="content-btn" type="warning" @click="usersnap()">Report Issue</el-button>
      </transition>
    </div>
    <el-dialog
      class="dialog-welcome"
      title="Welcome"
      :visible.sync="dialogVisibleWelcome"
      :close-on-click-modal="false"
      @close="closeDialog"
      width="480"
      center>
      <div class="welcome-content">
        <div>
          <img src="../../static/trendsi@2x.png" alt="">
          <img src="../../static/fashion@2x.png" alt="">
        </div>
        <div>
          <ul>
            <li>Find products and add them to a collection.</li>
            <li>Connect your Shopify store via Channels.</li>
            <li>Add the products in a collection to your Shopify store.</li>
            <li>Don’t have a Shopify Store? Enjoy other features like orders, My Store, and more.</li>
          </ul>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="dialog-btntext" @click="dialogVisibleWelcome = false">OK</div>
      </span>
    </el-dialog>
    <PriceRules v-if="priceDialogVisible" :priceDialogVisible.sync='priceDialogVisible' />
  </div>
</template>

<script>
import AddAddress from '@/components/AddAddress.vue'
import PriceRules from '@/components/PriceRules.vue'
import TopMessage from '@/components/TopMessage.vue'
import AddPay from '@/components/AddPay.vue'
import { searchProductDown } from "@/api/production";
import { addShow } from "@/api/login";
import ProductList from "../products/components/ProductList";
import {mapMutations} from 'vuex'
import { cartNumber } from "@/api/cart";
import { queryOrderListByStatus } from "@/api/orders";
import shareApi from '@/mixins/share'
import VueCookies from 'vue-cookies'
import { queryMessageNotificationList } from '@/api/home.js'
export default {
  name: 'Layout',
  mixins: [shareApi],
  components: {
    AddAddress,
    AddPay,
    ProductList,
    PriceRules,
    TopMessage
  },
  inject:['reload'],
	data() {
    const userInfo = JSON.parse(localStorage.getItem('USERINFO'));
    const isWhiteUser = JSON.parse(localStorage.getItem('ISWHITEUSER'));
		return {
			indexSearch: 0,
			keywordInput: '',
      showUsersnap: true,
      projName: require('@/static/projName@2x.png'),
      projNameTourist: require('@/static/projNameTourist.png'),
      avatarNameDefault: require('@/static/avatar@2x.png'),
      // avatarName: this.$store.getters.userInfo? this.$store.getters.userInfo.avatar :'',
      defalutOpeneds: [
        '/',
        '/collections',
        '/store',
        '/channels'
      ],
      isShowCollections: false,
      isShowStore: false,
      isShowChannels: false,
      // mystore: `${process.env.VUE_APP_BASE_URL}/shop/${userInfo.shopId}`,
      // mystore: `http://${userInfo.domainName}`,
      fullName: userInfo?(userInfo.firstName + (userInfo.lastName?(' '+userInfo.lastName):'')):'',
      mobile: userInfo?userInfo.mobile:'',
      addaddressShow: false,
      addpayShow: false,
      dialogVisibleWelcome: false,
      isWhiteUser: isWhiteUser || undefined,
      searchlists: [],
      keyword: '',
      dialogVisibleSearch: false,
      bagValue: '',
      asideHidden:false,
      priceDialogVisible:false,
      isUnpaid: false,
      isWebMobile:false,
      zindex:false,
      messageList:[]
    }
  },
  computed: {
    avatarName () {
      return this.$store.getters.userInfo?.avatar
    },
    key() {
      return this.$route.fullPath;
    },
    recentSearches() {
      return this.$store.state.localdata.recentSearches;
    },
    productLists() {
      return this.$store.state.localdata.recentviewed;
    },
    invitationCode() {
      if(!this.$store.state.user.userInfo.invitationCode) {
        VueCookies.remove('TOKEN')
      }
      return this.$store.state.user.userInfo.invitationCode
    }
  },
  watch:{
    '$route' () {
      if(this.$route.meta.asideHidden) {
        this.asideHidden = true
      }else {
        this.asideHidden = false
      }
      if(this.$route.query.keyword) {
        this.keyword = this.$route.query.keyword;
        document.querySelectorAll(".header-search-input > input")[0].style.cssText = 'background: #ffffff;'; // box-shadow: inset 0px 2px 6px rgba(0, 0, 0, 0.15);
      } else {
        this.keyword = '';
        document.querySelectorAll(".header-search-input > input")[0].style.cssText = 'background: #eeeeee;'; // box-shadow: 0 0 0 0;
      }
    }
  },
  methods: {
    ...mapMutations('layout',[
      'SET_AddCollection',
      'SET_UnPaidNum'
    ]),
    usersnap() {
      window.Usersnap.open();
      const self = this;
      self.showUsersnap = !self.showUsersnap;
      window.Usersnap.on("close", function() {
        self.showUsersnap = true;
      })
    },
    logout() {
      this.$store.dispatch('user/logout');
      if(this.isTourist) {
        const oldACTIVITYURL = localStorage.getItem('ACTIVITYURL') || '';
        if(!oldACTIVITYURL.includes('selectid')) {
          localStorage.setItem('ACTIVITYURL', window.location.href);
        }
      }else {
        localStorage.removeItem('ACTIVITYURL')
      }
      this.$router.push({path: '/login'});
      // amplitude埋点注销用户
      console.log(44444444, 'logout-----');
      this.$amplitude.getInstance().setUserId(null);
      this._global.userId = null;
    },
    mouseOverCollections() {
      this.isShowCollections = true;
    },
    mouseLeaveCollections() {
      this.isShowCollections = false;
    },
    mouseOverStore() {
      this.isShowStore = true;
    },
    mouseLeaveStore() {
      this.isShowStore = false;
    },
    mouseOverChannels() {
      this.isShowChannels = true;
    },
    mouseLeaveChannels() {
      this.isShowChannels = false;
    },
    addresses() {
      this.zindex = false;
      this.addaddressShow = true;
    },
    payment() {
      this.zindex = false;
      this.addpayShow = true;
    },
    collectionsAdd() {
      this.SET_AddCollection(true);
      this.$EventBus.$emit('addCollection');
    },
    channelsAdd() {
      this.$store.commit('layout/SET_AddChannel', true);
      this.$EventBus.$emit('addChannel');
    },
    // learnmore() {
    //   this.dialogVisibleWelcome = true;
    // },
    mobileApp() {
      window.open('https://www.trendsi.com/download');
    },
    helpCenter() {
      window.open('https://help.trendsi.com/knowledge');
    },
    closeDialog() {
      this.dialogVisibleWelcome = false;
      addShow({}, () => {
        localStorage.setItem('ISFIRSTLOGIN', false);
      },
      () => {},
      () => {})
    },
    searchlist() {
      searchProductDown({
        curPage: 1,
        pageSize: 5,
        keyword: this.keyword.trim()
      },
      (res) => {
        this.searchlists = res.result;
      },
      () => {},
      () => {})
    },
    searchSubmit() {
      this.$router.push({
        path: `/products/search`,
        name: "Search",
        query: { keyword: this.keyword}
      }).catch(()=>{});
      this.$EventBus.$emit('productSearch');
      this.dialogVisibleSearch = false;
    },
    searchInput(val) {
      this.searchlist();
      this.keywordInput = val;
      this.indexSearch = 0;
    },
    searchSelect(val) {
      this.keyword = val;
      this.searchSubmit();
    },
    recentClear() {
      this.$store.commit('localdata/RECENT_SEARCHES');
      localStorage.removeItem('RECENTSEARCHES');
    },
    recentSearch(val) {
      this.keyword = val;
      this.searchSubmit();
    },
    searchFuzzyMatching(name) {
      let string = this.keyword.toLocaleLowerCase();
      let hotName = name.replace(string,`<span style='color: #979797;'>${string}</span>`)
      return hotName;
    },
    isShowSearch() {
      setTimeout(()=>{
        this.dialogVisibleSearch = true;
        this.$nextTick(()=>{
          this.$refs['inputSearch'].focus();
        })
      }, 200)
    },
    closeParent() {
      this.dialogVisibleSearch = false;
      if(this.keyword) {
        document.querySelectorAll(".header-search-input > input")[0].style.cssText = 'background: #ffffff;'; // box-shadow: inset 0px 2px 6px rgba(0, 0, 0, 0.15);
      } else {
        document.querySelectorAll(".header-search-input > input")[0].style.cssText = 'background: #eeeeee;'; // box-shadow: 0 0 0 0;
      }
    },
    myStore() {
      const userInfo = JSON.parse(localStorage.getItem('USERINFO'));
      if( userInfo.domainName === null || userInfo.domainName === undefined || userInfo.domainName === '' ) {
        this.$router.push({path: '/login/setup-info', query: {isShowSetUpLater: false}})
      } else {
        this.goRouter('/my-store')
      }
    },
    copyLink() {
      const userInfo = JSON.parse(localStorage.getItem('USERINFO'));
      if( userInfo.domainName === null || userInfo.domainName === undefined || userInfo.domainName === '' ) {
        this.$router.push({path: '/login/setup-info', query: {isShowSetUpLater: false}})
      } else {
        { // 复制文本
          // createElement() 方法通过指定名称创建一个元素
          let newInput = document.createElement("input");
          // 讲存储的数据赋值给input的value值
          newInput.value = userInfo.domainName;
          // appendChild() 方法向节点添加最后一个子节点。
          document.body.appendChild(newInput);
          // 选中input元素中的文本
          // select() 方法用于选择该元素中的文本。
          newInput.select();
          // 执行浏览器复制命令
          //  execCommand方法是执行一个对当前文档，当前选择或者给出范围的命令
          document.execCommand("Copy");
          // 清空输入框
          newInput.remove();
        }
        this.$notify({
          title: "Link Copied",
          message: 'You can paste this when you share.',
          iconClass:'el-icon-link',
          duration: 3000,
          showClose: false
        });
      }
    },
    // 点击购物车
    showBag() {
      if(this.$route.name !== 'BuySample') {
        this.$router.push({
          path:'/products/buySample'
        })
      }
    },
    // 查询购物车数量
    searchCartNumber() {
      var data, sucess, error, complete;
      data = {
      };
      sucess = (res) => {
        let number = 0
        res.result.map((item)=>{
          number += item.num
        })
        this.bagValue = number
      };
      error = (res) => {
        console.log(res);
      };
      complete = () => {
      };
      cartNumber(data, sucess, error, complete);
    },
    editPriceRules() {
      this.zindex = false
      this.priceDialogVisible = true;
    },
    isUnpaidShow(isSet) {
      queryOrderListByStatus({
        curPage: 1,
        pageSize: 5,
        status: 1 // 1是unpaid
      },
      (res) => {
        if(!isSet) {
          this.SET_UnPaidNum(res.page.total);
          this.isUnpaid = res.page.total ? true : false;
        } else {
          this.isUnpaid = false;
        }
      },
      () => {},
      () => {})
    },
    // 菜单栏跳转页面
    goRouter(path) {
      const hashPath = this.$route.path;
      this.zindex = false;
      if(hashPath===path) {
        if(path==='/orders') {
          localStorage.removeItem('ORDERINFO')
        }
        this.reload()
      }else {
        this.$router.push({path})
      }
    },
    popContentHover() {
      this.zindex = true
    },
    popContentOut() {
      this.zindex = false
    },
    getMessage() {
      if(this.isTourist) return
      const query = {}
      const success = (res)=>{
        const {result} = res
        this.messageList = result
        // this.messageList = []
        if(this.messageList&&this.messageList.length!==0) {
          this.layoutContentScroll()
        }
      }
      const error = ()=>{
      }
      const complete = ()=>{
      }
      queryMessageNotificationList(query,success,error,complete)
    },
    // 修改content的高度
    layoutContentScroll() {
      const content = document.querySelector('.content')
      content.style.height = 'calc(100% - 95px)'
      this.$EventBus.$emit('classifyPageNavHeight')
    }
  },
	created() {
    this.dialogVisibleWelcome = (JSON.parse(localStorage.getItem('ISFIRSTLOGIN')) && localStorage.getItem('ACTIVITYURL')===null) && !(this.isTourist) ? true : false;
    this.$EventBus.$on('productSearchValue',(val)=> {
      this.keyword = val;
    })
    if (!this.isTourist) {
      this.$EventBus.$on('searchCartNumber',()=> {
        this.searchCartNumber();
      })
      this.searchCartNumber();
      this.$EventBus.$off('isUnpaidShow');
      this.$EventBus.$on('isUnpaidShow',(val)=> {
        this.isUnpaidShow(val);
      })
      // this.isUnpaidShow();
      localStorage.removeItem('ACTIVITYURL');
    }
  },
  mounted() {
    // 头部公共信息展示
    // this.layoutContentScroll()
    this.getMessage()
    if(this.$route.meta.asideHidden) {
      this.asideHidden = true
    } else {
      this.asideHidden = false
    }
    if(this.$route.query.keyword) {  document.querySelectorAll(".header-search-input > input")[0].style.cssText = 'background: #ffffff;'; } // box-shadow: inset 0px 2px 6px rgba(0, 0, 0, 0.15);

    document.addEventListener('keydown',(e)=>{
      if(this.searchlists.length === 0) { return; }
      if(e.keyCode == 38) { // 上键
        if( this.indexSearch > 0 ) {
          this.indexSearch--;
          this.keyword = (this.indexSearch-1 === -1) ? this.keywordInput : this.searchlists[this.indexSearch-1];
        } else{
          this.indexSearch = this.searchlists.length;
          this.keyword = (this.indexSearch-1 === -1) ? this.keywordInput : this.searchlists[this.indexSearch-1];
        }
      } else if(e.keyCode ==40) { // 下键
        if( this.indexSearch < this.searchlists.length ){
          this.keyword = this.searchlists[this.indexSearch];
          this.indexSearch++;
        } else if(this.indexSearch === this.searchlists.length) {
          this.indexSearch = 0;
          this.keyword = this.keywordInput;
        }
      }
    })
  },
  activated() {}
}
</script>

<style lang="less">
  .layout {
    width: 100%;
    height: 100%;
    header {
      width: 100%;
      // border-bottom: 1px solid #EEEEEE;
      position: fixed;
      height: 65px;
      z-index: 1000;
      background: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      &.asideHidden {
        top: 30px;
      }
      &.zindex {
        z-index: 9000;
      }
      .layout-header {
        max-width: 1320px;
        box-sizing: border-box;
        
        @media screen and (min-width: 768px) {
          padding: 0 40px;
        }
       
        margin: 0 auto;
        // position: absolute;
        // max-width: 1200px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        // box-sizing: border-box;
        // left: 50%;
        // transform: translateX(-50%);
      }
      .header-proj {
        // position: absolute;
        // top: 50%;
        // left: 56px;
        height: 40px;
        // margin-top: -20px;
      }
      .header-proj.is-tourist {
        // left: 132px;
      }
      .header-search {
        border-radius: 20px;
        max-width: 480px;
        flex: 1;
        margin: 0 20px;
        // position: absolute;
        // right: 242px;
        
      }
      .dialog-search {
          .el-dialog {
            @media screen and (max-width: 768px) {
              // padding: 0 40px;
              width: 100%;
              min-width: initial;
            }
            
            overflow: overlay;
            margin-top: 0 !important;
            position: fixed;
            width: 56%;
            min-width: 800px;
            max-height: 632px;
            top: 21px;
            left: 0;
            right: 0;
            margin-left: auto;
            margin-right: auto;
            box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2) !important;
            .el-dialog__header {
              display: none;
            }
            .el-dialog__body {
              background: #ffffff;
              padding: 0;
              color: #333333;
            }
          }
        }
        .header-search-input {
          // width: 254px;
          line-height: 65px;
          height: 65px;
          .el-input__prefix {
            color: #000000;
            left: 0;
            .el-icon-search {
              width: 18px;
              margin-left: 12px;
              vertical-align: middle;
            }
            .el-icon-search::before {
              font-size: 18px;
            }
          }
          .el-input__suffix {
            right: 12px;
            i {
              font-size: 24px;
              color: #000000;
            }
            .el-input__suffix-inner {
              border-color: none;
              .el-icon-circle-close:before {
                content: "\e79d" !important;
                font-size: 24px;
              }
            }
          }
          input {
            background: #eeeeee;
            border-radius: 20px;
            height: 40px;
            border-color: #eeeeee;
            font-weight: normal;
            font-size: 16px;
            padding-left: 46px;
          }
          input::-webkit-input-placeholder { /* WebKit browsers */ 
            color: #979797;
          } 
          input:-moz-placeholder { /* Mozilla Firefox 4 to 18 */ 
            color: #979797;
          } 
          input::-moz-placeholder { /* Mozilla Firefox 19+ */ 
            color: #979797;
          } 
          input:-ms-input-placeholder { /* Internet Explorer 10+ */ 
            color: #979797;
          }
        }
        .header-search-input.is-tourist {
          max-width: 480px;
         }
        .header-search-input-large {
          width: 100%;
          & > input {
            background: #ffffff;
          }
        }
        .header-search-list {
          width: 100%;
          top: 52px;
          font-weight: 600;
          font-size: 16px;
          li {
            padding-left: 24px;
            box-sizing: border-box;
            height: 34px;
            line-height: 34px;
          }
          li.active {
            background-color: #F9F9F9;
          }
          li:hover {
            cursor: pointer;
            background: #F9F9F9;
          }
          li:last-child {
            margin-bottom: 16px;
          }
        }
        .header-search-recent {
          padding: 0 24px 24px;
          .recent-header {
            & > div:first-child {
              display: inline-block;
              width: calc( 100% - 84px );
              span {
                font-weight: bold;
                font-size: 18px;
              }
            }
            & > div.recent-clear {
              margin-left: 24px;
              cursor: pointer;
              width: 60px;
              height: 28px;
              display: inline-flex;
              justify-content: center;
              align-items: center;
              text-align: center;
              background: #333333;
              border-radius: 25px;
              color: #ffffff;
            }
            & > div.recent-clear:hover {
              opacity: 0.6;
            }
            & > div.recent-clear:active {
              opacity: 0.8;
            }
          }
          .recent-info {
            margin-top: 8px;
            & > div {
              // height: 32px;
              background: #eeeeee;
              font-weight: 500;
              font-size: 14px;
              border-radius: 25px;
              padding: 8px 12px;
              box-sizing: border-box;
              margin-top: 8px;
              margin-right: 10px;
              cursor: pointer;
              min-width: 40px;
              max-width: 180px;
              text-align: center;
              display: inline-block;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            & > div:hover {
              opacity: 0.6;
            }
            & > div:active {
              opacity: 0.8;
            }
          }
        }
        .header-search-recentview {
          padding: 0 0 24px 24px;
          & > span {
            font-weight: bold;
            font-size: 18px;
          }
        }
      .header-search.is-tourist {
        // left: 50%;
        // margin-left: -240px;
      }
      .header-right {
        position: relative;
        display: flex;
        align-items: center;
       
        .header-sign {
          margin-left: 24px;
        }
        .mobile-search {
          display: inline-block;
          margin-right: 20px;
          cursor: pointer;
          .el-icon-search {
            font-size: 16px;
          }
        }
        .header-self-pop {

          .header-avatar-box {
            cursor: pointer;
            display: flex;
            align-items: center;
            &.zindex:hover {
              &::before {
                content: '';
                position: absolute;
                display: block;
                height: 20px;
                width: 100%;
                right: 0;
                bottom: -17px;
              }
              .pop-content {
                display: flex;
              }
            }

            .popper__arrow {
              &::after {
                position: absolute;
                display: block;
                width: 0;
                height: 0;
                border-color: transparent;
                border-style: solid;
                content: " ";
                border-width: 6px;
                // top: -6px;
                margin-left: -6px;
                border-top-width: 0;
                border-bottom-color: #fff;
              }
              border-width: 6px;
              filter: drop-shadow(0 2px 12px rgba(0,0,0,.03));
              position: absolute;
              display: block;
              width: 0;
              height: 0;
              border-color: transparent;
              border-style: solid;
              top: 40px;
              left: 4px;
              margin-right: 3px;
              border-top-width: 0;
              border-bottom-color: #ebeef5;
            }
            .pop-content {
              max-height: calc(100vh - 65px);
              overflow-y: auto;
              overflow-x: hidden;
              padding: 24px 0;
              width: 256px;
              position: absolute;
              background: #FFFFFF;
              border: 1px solid #EEEEEE;
              box-sizing: border-box;
              box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
              border-radius: 20px;
              display: none;
              flex-direction: column;
              justify-content: center;
              top: 45px;
              right: -15px;
              // align-items: center;
              .user-info {
                display: flex;
                align-items: center;
                padding-left: 24px;
                .pop-avatar {
                  display: block;
                  width: 48px;
                  height: 48px;
                  border-radius: 50%;
                  margin-right: 8px;
                }
              }
              
              .pop-user {
                text-align: center;
                flex: 1;
                width: 0;
                .pop-fullname {
                  font-weight: bold;
                  font-size: 18px;
                  line-height: 24px;
                  color: #333333;
                  line-height: 24px;
                  text-align: center;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                }
                .pop-mobile {
                  font-weight: normal;
                  font-size: 20px;
                  line-height: 20px;
                  color: #666666;
                  // line-height: initial;
                }
              }
              .invitation-code {
                margin: 8px 0 0;
                padding: 0 0 17px 24px;
                cursor: pointer;
                border-bottom: 1px solid #EEEEEE;
                // &::after {
                //   content: '';
                //   width: 256px;
                //   display: block;
                //   border-bottom: 1px solid #EEEEEE;
                //   left: 0;
                //   top: 116px;
                //   position: absolute;
                // }
                span:nth-child(1) {
                  font-weight: 500;
                  font-size: 14px;
                  line-height: 24px;
                  text-align: center;
                  color: #333333;
                }
                span:nth-child(2) {
                  margin-left: 16px;
                  font-weight: bold;
                  font-size: 16px;
                  line-height: 24px;
                  color: #C79818;
                }
              }
              ul {
                overflow: auto;
                .quarantine-line {
                  padding: 0 24px;
                  margin:12px 24px 0;
                  background: #EEEEEE;
                  height: 1px;
                }
                align-self: stretch;
                .el-badge {
                  display: block;
                  .is-dot {
                    left: 35px;
                    right: initial;
                  }
                }
                li {
                  padding: 7px 24px;
                  &:first-child {
                    margin-top: 10px;
                  }
                  font-weight: 500;
                  line-height: 18px;
                  margin-top: 1px;
                  a {
                    font-size: 14px;
                    color: #333333;
                    display: block;
                  }
                  &.my-settings {
                    margin-top: 16px;
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    &:hover {
                      background: initial;
                    }
                    .text-center {
                      padding-left: 0;
                      text-align: center;
                    }
                    .title {
                      padding: 0 24px;
                      margin-bottom: 9px;
                      margin-top: 0;
                      font-weight: 500;
                      font-size: 14px;
                      line-height: 24px;
                      cursor: initial;
                      &:hover {
                        background:initial;
                      }
                    }
                    .quarantine-line {
                      padding: 0;
                      margin: 10px 0 8px 0;
                    }
                    span,a {
                      // margin-top: 4px;
                      font-weight: normal;
                      cursor: pointer;
                      color: #333333;
                      font-weight: 400;
                      font-size: 14px;
                      line-height: 18px;
                      padding: 8px 0 6px 49px;
                      &:hover {
                        background: #F9F9F9;
                      }
                    }
                  }
                }
                li:hover {
                  background: #F9F9F9;
                }
              
              }
            }
            .my-account {
              white-space: nowrap;
              margin-left: 8.5px;
            }
            .user-img {
              width: 19.5px;
              height: 22px;
            }
            .user-hove-down {
              margin-left: 4px;
              height: 8px;
            }
          }
          
        }
        .header-help, .header-sign {
          cursor: pointer;
          display: inline-block;
          // position: absolute;
          // top: 50%;
          // transform: translateY(-50%);
        }
      }
      .header-help, .header-sign {
        cursor: pointer;
        display: inline-block;
        // position: absolute;
        // top: 50%;
        // transform: translateY(-50%);
      }
      // .header-help {
      //   right: 181px;
      // }
      
      // .header-help.is-tourist {
      //   right: 256px;
      // }
      // .header-sign.is-tourist {
      //   right: 138px;
      // }
      .header-bag:hover {
        opacity: 0.6;
      }
      .header-bag:active {
        opacity: 0.8;
      }
      .header-bag {
        cursor: pointer;
        display: inline-block;
        // position: absolute;
        // right: 57px;
        // top: 50%;
        // max-width: 310px;
        margin-left: 24px;
        // transform: translateY(-50%);
        .el-badge__content {
          background: #F363A0;
          border: 0;
          min-width: 11px;
          font-size: 10px;
          padding: 2px 3px;
          height: 12px;
          line-height: 12px;
        }
        .el-badge__content.is-fixed {
          top: 6px;
          right: 2px;
        }
        img {
          height: 24px;
        }
      }
      
      
    }
    .aside {
      overflow: auto;
      height: 100%;
      position: fixed;
      top: 65px;
      width: 280px;
      img {
        width: 24px;
        height: 24px;
      }
      ul {
        overflow: auto;
        height: calc( 100% - 89px );
        padding-top: 24px;
        li {
          min-width: 100px;
          &.line {
            width: 135px;
            height: 0px;
            border: 1px solid #EEEEEE;
          }
          height: 24px;
          margin: 0 0px 24px 56px;
          display: flex;
          align-items: center;
          .el-badge > sup {
            margin-right: -8px;
            margin-top: 6px;
            height: 10px;
            width: 10px;
            background-color: #F363A0;
          }
          a.img-link {
            width: auto;
            display: inline-flex;
            line-height: 24px;
            height: 24px;
            justify-content: flex-end;
            margin-left: 20px;
            align-items: center;
            img:hover {
              opacity: 0.6;
            }
            img:active {
              opacity: 0.8;
            }
          }
          a {
            font-weight: bold;
            font-size: 20px;
            color: #333333;
          }
          a {
            width: 100%;
          }
          a:nth-child(2) {
            padding-left: 0;
          }
          a:active, a:hover {
            color: #666666;
          }
          a.router-link-exact-active.router-link-active {
            color: #C79818;
          }
        }
      }
      .aside-bottom-info {
        // position: fixed;
        // left: 56px;
        // bottom: 56px;
        height: calc( 100% - 493px );
        display: inline-flex;
        align-items: flex-end;
        margin-left: 56px;
        margin-bottom: 56px;
        font-size: 14px;
        font-weight: 500;
      }
      .aside-bottom-info > div:hover {
        cursor: pointer;
        text-decoration: underline;
      }
      // .aside-bottom-info-top {
      //   bottom: 97px;
      // }
    }
    .content {
      @media screen and (min-width: 768px) {
        // padding: 65px 40px 0;
      }
      @media screen and (min-width: 1320px) {
        // padding: 65px 80px 0;
      }
      overflow: overlay !important;
      padding-top: 65px;
      // margin-left: 280px;
      // margin-right: 2px;
      height: calc(100% - 65px);
      &.asideHidden {
        margin: 0;
        overflow: initial !important;
      }
      .content-btn {
        z-index: 4000;
        width: 120px;
        position: fixed;
        right: 0;
        top: 50%;
        transform: rotate(270deg);
        margin-right: -40px;
        margin-top: -17px;
        // margin: -100px -30px 0 0;
      }
    }
    .dialog-welcome {
      & > .el-dialog {
        width: 480px;
        margin-top: -237px !important;
        & > .el-dialog__header {
          padding-top: 24px;
        }
        & > .el-dialog__body {
          padding: 40px 40px 24px 40px;
          .welcome-content {
            & > div:first-child {
              text-align: center;
              & > img:first-child {
                width: 100px;
                height: 100px;
              }
              & > img:nth-child(2) {
                height: 100px;
                margin-left: 24px;
              }
            }
            & > div:nth-child(2) {
              margin-top: 40px;
              font-weight: normal;
              font-size: 14px;
              & > ul {
                margin-left: 15px;
                & > li {
                  line-height: 24px;
                  margin-bottom: 8px;
                  list-style-position: outside;
                  list-style: decimal;
                }
              }
            }
          }
        }
        .dialog-footer {
          .dialog-btntext {
            width: 252px !important;
            filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.1));
            display: inline-block;
          }
        }
      }
    }
    // 如果有消息通知，兼容部分页面的高度
    &.has-message-info {
      .activity-handle {
        // top: 143px;
      }
      .mystore-page {
        padding-top: 54px;
      }
      .setup-website-style-preview-box {
        top: 96px;
      }
      .mystore-container {
        .left-nav {
          top: 119px;
        }
      }
      
    }
  }
 
</style>