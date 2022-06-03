<template>
  <div class="products" :class="{isTourist}">
    <div
      class="products-single"
      :ref="hasImgType?'products-single':''"
      :class="{isTourist:isTourist,'single-image-box':product.hasImgType}"
      v-for="(product,index) in products"
      :key="product.id"
      @click="showDetail(product)"
    >
    <div v-if="hasImgType&&product.hasImgType" @click="$emit('goUrl',product)" class="single-image">
      <img :class="{hashover:product.imageJson.url||product.imageJson.productId}"  :src="product.url" alt="">
    </div>
    <router-link v-else :to="{ path: '/products/detail', query: {
        id: product.id,
        ref_pv_id: ref_pv_id
      }}"
      :target='"_blank"'>
      <div class="img-box">
        <div class="self-tag-box" v-if="computedImg(product.tagName)">
          <img class="self-tag" :src="computedImg(product.tagName)" alt="">
          <span class="self-tag-text">{{product.tagName}}</span>
        </div>
        <div class="jit-new-tag" v-if="product.tagType==1&&product.tagName=='New Arrivals'">
          <span class="text">NEW</span>
        </div>
        <img
          class="collect showicon"
          :class="{isAdd:product.exportedToShopify&&product.containProduct,sisAdd:product.exportedToShopify||product.containProduct,}"
          v-if="product.isAdd&&!isTourist"
          src="../../../static/addStore@2x.png"
          alt=""
        />
        <img
          class="collect showicon"
          v-if="product.containProduct&&!isTourist"
          src="../../../static/Collection@2x.png"
          alt=""
        />
        <img
          class="collect showicon"
          :class="{nocollect:product.containProduct}"
          v-if="product.exportedToShopify&&!isTourist"
          src="../../../static/productshopify@2x.png"
          alt=""
        />
        <!-- <el-image  :src="product.mainImage" lazy></el-image> -->
        
          <div class="carousel-img-box"  @mouseover="loadImg(index)" :ref="'loadImg'+index">
            <img class="icon"  :class="{ active: product.activeImgIndex == index }" v-for="(item, index) in product.allHeadImage" :key="index" :data-originImg='item'  :src="index==product.activeImgIndex?item:null" v-imgError:big alt="" loading="lazy" />
            <div class="left-direction" @click.stop.prevent="switchImg('prev',product)">
              <img
                src="../../../static/productDetail/left@2x.png"
              />
            </div>
            <div class="right-direction" @click.stop.prevent="switchImg('next',product)">
              <img src="../../../static/productDetail/right@2x.png" alt="" />
            </div>
          </div>
        
        <!-- <img class="icon active" :src="product.mainImage" v-imgError:big alt="" loading="lazy" /> -->
        <div class="goods-coming-soon goods-tag-bk" v-if="product.status == 1">
          <span>Coming Soon</span>
        </div>
        <div class="goods-sold-out goods-tag-bk" v-else-if="isSlodOut(product)">
          <span v-if="isRestocking(product)">Restocking</span>
          <span v-else>Sold Out</span>
        </div>
        <div class="goods-sold-out goods-tag-bk" v-else-if="product.state===4">
          <span style="font-size:10px">Shipping Delay {{product.shippingDelayPeriod}}</span>
        </div>
        <div class="goods-pre-order goods-tag-bk" v-else-if="product.forwardSell==1">
          <span>Pre-order</span>
        </div>
         <div class="goods-sold-out goods-tag-bk" v-else-if="product.tagType == 6">
          <span>Pre-Launch</span>
        </div>
        <div
          class="goods-time goods-tag-bk"
          v-else-if="expirationTime(product)"
        >
          <span>Sale Ends: {{ expirationTime(product) }}</span>
        </div>
      </div>
      <div class="shop-brand-and-name">
        {{ product.showBrand==1?product.brandIndex:'' }} {{ product.title }}
      </div>
      <!-- v-if="product.lock" -->
      
      <div class="shop-attribute">
        <div class="price-box">
            <span class="price-text">Product Cost</span>
            <span v-if="!isTourist">
              <span v-if="product.minCrossedPrice" class="cost-price-throughline">${{ formatPrice(product.minCrossedPrice) }}</span>
              <span class="cost-price">${{ formatPrice(product.minPriceB) }}</span>
            </span>
            <div v-else>
              <img @mouseleave='hoveLock(product,false)' @mouseenter="hoveLock(product,true)" class="lock-img" @click.stop.prevent='loginHandle' :src="!product.lock?require('@/static/lock@2x.png'):require('@/static/yellowlock@2x.png')">
              <div @mouseleave='hoveLock(product,false)' @mouseenter="hoveLock(product,true)" class="tourist-lock-tip"  @click.stop.prevent='loginHandle'>
                Sign up for Trendsi to unlock product cost
              </div>
            </div>
          <!-- <img v-else src="@/static/lock@2x.png"> -->
        </div>
        <div class="suggested-price" v-if="!isTourist">
          <span class="price-text">Suggested Resale Price</span>
           <span class="suggested-price"
            >${{ formatPrice(product.minPrice) }}</span
          >
        </div>
      </div>
      <div class="shop-bottom-box">
        <div class="event-box" v-if="!isTourist">
          <!-- <div class="shop-share" v-elementEvent @click.stop.prevent="shareShop(product.id,'product')">
            <span>Copy Link</span>
          </div> -->
          <div class="buy-sample" v-elementEvent @click.stop.prevent="buySample(product)">
            <span>Buy Sample</span>
          </div>
          <div
            v-if="isCollection"
            class="shop-add-collection"
            v-elementEvent
            @click.stop.prevent="removeCurrentShop(product)"
          >
            <span>Remove</span>
          </div>
          <div
            v-else
            v-elementEvent
            class="shop-add-collection"
            @click.stop.prevent="addCollection(product)"
          >
            <span>Add</span>
          </div>
        </div>
      </div>
      </router-link>
    </div>
    <open-add-popup v-if="!isTourist" :dialogVisible.sync='eventOpenAddPopup' :amplitude='amplitude' :shopifyNameList='shopifyNameList' :parentShopifyNameList='parentShopifyNameList'  @uPproduct='uPproduct' @updateProductStore='updateProductStore' @uPcurrentProduct='uPcurrentProduct' :product='currentProduct' :width="'400px'" />
    <AddBuyShop :amplitude='amplitude' ref="AddBuyShop" />
    <LicenseComponent :dialogVisible.sync='licenseComponentVisible' @continueBuy='continueBuy' :oldUserText='"Skip for Now"'></LicenseComponent>
  </div>
</template>

<script>
import { formatPrice, transferDateFromNowDetail } from "@/utils/common";
import productShare from '@/mixins/share'
import successInfo from '@/mixins/successInfo'
import recentviewed from '@/mixins/recentviewed';
import {myTrim} from '@/utils/common'
import {
  productCollectionList,
  editProductStatusAtSomeProductCollection,
  addDefaultproductCollection,
  addProductCollection
} from "@/api/collections";
import openAddPopup from '@/views/products/components/openAddPopup'
import AddBuyShop from "@/views/products/components/addBuyShop";
import LicenseComponent from "@/views/products/components/LicenseComponent";
import { userInfo } from '@/api/login';
export default {
  props: {
    productsData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isCollection: {
      type: Boolean,
      default: false,
    },
    removeCurrentShop: {
      type: Function,
      default: () => {},
    },
    parentShopifyNameList:{
      type: Boolean,
      default: false,
    },
    shopifyNameList:{
      type: Array,
      default: () => [],
    },
    hasImgType:{
      type: Boolean,
      default: false,
    },
    amplitude:{
      type: Object,
      default: () => {},
    }
  },
  mixins:[productShare, successInfo, recentviewed],
  computed: {
    products() {
      this.productsData.map(item=>{
        if(!item.hasImgType) {
          item.allHeadImage = [item.mainImage,...item.headImage]
          this.$set(item,'activeImgIndex',0) 
          this.$set(item,'lock',false) 
        }
      })
      this.$nextTick(()=>{
        if(this.hasImgType) {
          const productsSingle = this.$refs['products-single']
          let index = 0
          productsSingle.map(item=>{
            if(item.classList && item.classList[0]=='products-single'&&!(Array.from(item.classList).includes('single-image-box'))) {
              ++index
              if(index===5) {
                item.style.marginRight = '0'
                index = 0
              }
            }else {
              index = 0
            }
            // console.log([item]);
          })
        }
      })
      return this.productsData;
    },
    notCollection() {
      return this.$route.path!='/collections/detail'
    }
  },
  watch: {
    dialogVisible() {
      // this.getProductCollectionList(1);
    },
    'amplitude.pv_id' () {
      this.ref_pv_id = this.$route.params.pv_id;
    }
  },
  components:{
    openAddPopup,
    AddBuyShop,
    LicenseComponent
  },
  mounted() {
    this.$nextTick(()=>{
      if(this.hasImgType) {
        const productsSingle = this.$refs['products-single']
        let index = 0
        productsSingle.map(item=>{
          if(item.classList && item.classList[0]=='products-single'&&!(Array.from(item.classList).includes('single-image-box'))) {
            ++index
            if(index===5) {
              item.style.marginRight = '0'
              index = 0
            }
          }else {
            index = 0
          }
          console.log([item]);
        })
      }
    })
  },
  data() {
    return {
      formatPrice,
      dialogVisible: false,
      eventOpenAddPopup: false, //点击add打开弹窗框
      isFinished:false,
      isLoadProduct:false,
      caretedAddDialogVisible: false,
      editCollectionLoading: false,
      notificationText:'',
      currentClickProductId: null,
      currentProduct: null, //当前点击add的商品
      curPage:1,
      pageSize:10,
      collections: [],
      form: {
        name: "",
      },
      touristObject:{
        lock:false
      },
      licenseComponentVisible:false,
      ref_pv_id: ''
    };
  },
  methods: {
    // 点击change后更新点击产品
    uPcurrentProduct(parms) {
      this.currentProduct = parms.product;
    },
    // 添加合集弹窗
    async addCollection(product) {
      this.eventOpenAddPopup = true
      this.currentProduct = product;
      if(this.$route.path=='/products/classify') {
        this.$emit('classify',true)
      }
      // return
      // this.currentClickProductId = product.id;
      // if(this.$route.path=='/products/classify') {
      //   this.$emit('classify',true)
      // }
      // if(this.collections.length>0) {
      //   this.collections.map((item) => {
      //     if (item.productVos.length < 3) {
      //       var fill = 3 - item.productVos.length;
      //       var fillArr = Array(fill).fill({});
      //       item.productVos.push(...fillArr);
      //     }
      //     console.log(this.currentClickProductId);
      //     if (item.productIds.indexOf(this.currentClickProductId-0) > -1) {
      //       item.checked = true;
      //     }else {
      //       item.checked = false;
      //     }
      //   });
      // }
      // if(product.containProduct==0) {
      //   this.handleAddDefaultproductCollection(product)
      // }else {
      //   this.dialogVisible = true;
      // }
      
    },
    // 更新数据
    uPproduct(parms) {
      parms.product = this.productsData;
      this.$emit('updateSingleProduct',parms)
    },
    // 添加到默认合集
    handleAddDefaultproductCollection(product) {
      var data, sucess, error, complete;
      data = {
        productId:product.id
      }
      const loading = this.$loading({
        lock: true,
        text: "",
        spinner: "el-icon-loading",
        background: "rgba(51,51,51,0.25)",
      });
      sucess = () =>{
        this.$emit('updateproduct',{currentProduct:this.currentProduct,operate:1,productsData:this.productsData})
        this.dialogVisible = true;
        this.curPage = 1
        this.collections = []
        this.isFinished = false
      }
      error = () =>{
        this.dialogVisible = true;
      }
      complete = () =>{
        loading.close();
      }
      addDefaultproductCollection(data,sucess,error,complete)
    },
    // 点击关闭按钮执行
    handleClose() {
      this.closeCollection()
    },
    load() {
      if (this.isFinished || this.isLoadProduct) {
        return;
      }
      this.getProductCollectionList();
    },
    // 合集列表数据
    getProductCollectionList() {
      var data, sucess, error, complete;
      this.isLoadProduct = true;
      data = {
        productId: null,
        curPage: this.curPage,
        pageSize: this.pageSize,
      };
      const loading = this.$loading({
        lock: true,
        text: "",
        spinner: "el-icon-loading",
        background: "rgba(51,51,51,0.25)",
      });
      sucess = (res) => {
        const { result } = res;
        const allPage = res.page.pages;
        const page = this.curPage;
        this.isFinished = page >= allPage;
        result.map((item) => {
          if (item.productVos.length < 3) {
            var fill = 3 - item.productVos.length;
            var fillArr = Array(fill).fill({});
            item.productVos.push(...fillArr);
          }
          if (item.productIds.indexOf(this.currentClickProductId-0) > -1) {
            item.checked = true;
          }else {
            item.checked = false;
          }
        });
        if (this.curPage > 1) {
          this.collections = [...this.collections, ...result];
        } else {
          this.collections = result;
        }
        this.curPage++;
      };
      error = () => {
      };
      complete = () => {
        this.isLoadProduct = false;
        loading.close();
      };
      productCollectionList(data, sucess, error, complete);
    },
    // 添加或删除合集商品 product
    editCollectionShop(collection,isCreated) {
      this.editCollectionLoading = true;
      var data, sucess, error, complete, operate;
      operate = collection.checked ? 0 : 1;
      data = {
        collectionId: collection.id,
        productId: this.currentClickProductId,
        operate, //1:添加,0:移除
      };
      sucess = () => {
        if(isCreated) {
          this.curPage = 1
          this.collections = []
          this.isFinished = false
        }
        this.mokEditProduct(collection,operate)
        // this.getProductCollectionList();
      };
      error = () => {
      };
      complete = () => {
        this.editCollectionLoading = false;
      };
      editProductStatusAtSomeProductCollection(data, sucess, error, complete);
    },
    // 前端模拟删除或者添加商品到合集
    mokEditProduct(collection,operate) {
      if(collection.productVos) {
        // var index = collection.productVos.findIndex((item)=>item.id==this.currentProduct.id)
        // var productIdsIndex = collection.productIds.indexOf(this.currentProduct.id)
        // console.log(index);
        // if(index>-1){
        //   collection.productVos.splice(index,1)
        // }else {
        //   collection.productVos.splice(0,0,this.currentProduct)
        // }
        // if(productIdsIndex>-1){
        //   collection.productIds.splice(productIdsIndex,1)
        // }else {
        //   collection.productIds.splice(0,0,this.currentProduct.id)
        // }
        // collection.checked = operate==1?true:false
        // collection.totalDetail = operate==1?++collection.totalDetail:--collection.totalDetail
        // collection.productVos = collection.productVos.slice(0,3)
        // if(collection.productVos.length<3) {
        //   collection.productVos.push({})
        // }
        this.curPage = 1
        this.getProductCollectionList()
        this.$emit('updateproduct',{checked:collection.checked,currentProduct:this.currentProduct,operate,productsData:this.productsData})
      }else {
        this.dialogVisible = true;
        this.$emit('updateproduct',{checked:true,currentProduct:this.currentProduct,operate,productsData:this.productsData})
      }
      
    },
    // 是否卖完
    isSlodOut(item) {
      const availableSkuList = item.skuList.filter((item) => item.stock > 0);
      if (availableSkuList?.length === 0) {
        return true;
      }
    },
    // 添加或删除合集商品
    handleDditCollectionProduct(item,isCreated) {
      if (this.editCollectionLoading) {
        return;
      }
      this.editCollectionShop(item,isCreated);
    },
    // 创建并添加合集
    createdAndAddCollection() {
      this.dialogVisible = false;
      this.caretedAddDialogVisible = true
      this.$nextTick(()=>{
        this.$refs.collectionName.focus()
      })
    },
    closeCollection() {
      if(this.$route.path=='/products/classify') {
        setTimeout(()=>{
          this.$emit('classify',false)
        },300)
      }
      this.dialogVisible = false;
    },
    expirationTime(item) {
      let date = transferDateFromNowDetail(item.expireT);
      // 正时间
      if (date && date.indexOf("-") == -1) {
        return date;
      }
    },
    showDetail(item) {
      // this.$emit("showDetail", item);
      this.recentViewedFunc(item);
      // this.$router.push({
      //   path: "/products/detail",
      //   query: {
      //     id: item.id,
      //   },
      // });
    },
    // 创建合集
    createCollection() {
      if(!this.form.name) {
        this.notificationText = 'The collection name cannot be blank.'
        return
      }
      this.createdAddCollection()

    },
    // 关闭创建合集
    closeCaretedAddDialogVisible() {
      this.caretedAddDialogVisible = false
      this.dialogVisible = true;
    },
    // 添加合集
    createdAddCollection() {
      var data, sucess, error, complete;
      data = {
        collectionName: myTrim(this.form.name)
      };
      sucess = (res) => {
        console.log(res);
        const collectionID = res.result
        this.caretedAddDialogVisible = false;
        this.form.name = ''
        this.notificationText = ''
        // 成功后执行添加合集
        const collectionObj = {id:collectionID,checked:false}
        this.handleDditCollectionProduct(collectionObj,true)
      };
      error = (res) => {
        this.notificationText = res.data.message
      };
      complete = () => {
      };
      addProductCollection(data, sucess, error, complete);
    },
    switchImg(direction,product) {
      if (direction == "next") {
        if (product.activeImgIndex + 1 >= product.allHeadImage.length) {
          product.activeImgIndex = 0
          return;
        }
        product.activeImgIndex++;
      } else {
        if (product.activeImgIndex == 0) {
          product.activeImgIndex = product.allHeadImage.length - 1
        }else {
          product.activeImgIndex--;
        }
      }
    },
    loadImg(index) {
      // console.log(this.$refs['loadImg'+index].setAttribute('isLoad',true));
      let dom = this.$refs['loadImg'+index][0]
      if(dom.dataset['isloadimg']) {
        return
      }
      this.$refs['loadImg'+index][0].setAttribute('data-isLoadImg',true)
      var imgs = this.$refs['loadImg'+index][0].querySelectorAll('.icon')
      imgs = Array.from(imgs);

      // this.$refs['loadImg'+index].data = true;
      imgs.map((item,index)=>{
        if(index == 0){
          return
        }
        item.setAttribute('src',item.dataset['originimg'] )
      })
    },
    computedImg(tagName) {
      switch (tagName) {
        case "Top Sellers":
          return require('@/static/hotProduct@2x.png')
        case "Trending":
          return require('@/static/hotArrowUp@2x.png')
        // case "New Arrivals":
        //   return require('@/static/hotNewProduct@2x.png')
        default:
          return null
      }
    },
    // 游客模式鼠标放到锁上
    hoveLock(product,flag) {
      product.lock = flag
    },
    // login
    loginHandle() {
      const oldACTIVITYURL = localStorage.getItem('ACTIVITYURL') || '';
      if(!oldACTIVITYURL.includes('selectid')) {
        localStorage.setItem('ACTIVITYURL', window.location.href);
      }
      // localStorage.setItem('ACTIVITYURL', window.location.href);
      const {href} = this.$router.resolve({ path: `/login`});
      window.open(href,'_blank')
      // this.$router.push('/login')
    },
    updateProductStore(params) {
      params.product.isAdd = 1
    },
    // 判断是否有补货
    isRestocking(product) {
      const findRestocking = product.skuList.find(item=>{
        return item.restock === 1
      })
      return findRestocking
    },
    // 购买弹框
    buySample(info) {
      const page_code = this.amplitude.buy_sample.page_code
      let rankVal;
      this.amplitude.event_value_productsId.forEach((item, index)=>{
        if(item === info.id) {
          rankVal = index;
        }
      })
      console.log(666, 'button埋点-----buy_sample', page_code, [rankVal, info.id], this.amplitude.pv_id);
      this.$amplitude.getInstance().logEvent('click', {
        'page_code': page_code,
        'module_code': '',
        'position_code': 'buy_sample',
        'event_target': 'button',
        'event_value': [rankVal, info.id],
        'pv_id': this.amplitude.pv_id,
        'url': window.location.href
      });
      // this.$refs.AddBuyShop.productInfo = info
      // 获取用户上传资质状态
      // 新用户 0-1-2/0-1-3-1-2 //未认证>待审核>已通过 ｜ 未认证>待审核>已拒绝>待审核>已通过
      // 老用户 4-5-2/4-5-6-5-2 //未认证>待审核>已通过 ｜ 未认证>待审核>已拒绝>待审核>已通过
      const permitStatus = this.$store.state.user.userInfo.permitStatus
      this.currentProduct = info
      // 已经认证成功用户 直接购买
      if(permitStatus==2) {
        this.$refs.AddBuyShop.open(info)
       
        return
      }
      // 未认证，重新请求数据防止后台认证通过了用户还无法购买
      this.getUserInfo(true)
      
    },
    // 老用户继续购买
    continueBuy() {
      this.licenseComponentVisible = false
      this.$refs.AddBuyShop.open(this.currentProduct)
    },
    // 未认证获取用户信息 ，并提示信息
    getUserInfo(hasCheckUserLicense) {
      const that = this
      userInfo({}, (resUser) => {
        // 重新赋值上传资质状态，并更新vuex和store里面的用户数据
        const newPermitStatus = resUser.result.permitStatus
        const userInfo = Object.assign({},this.$store.state.user.userInfo) 
        userInfo.permitStatus = newPermitStatus
        that.$store.dispatch('user/setUserInfo',userInfo).then(()=>{
          // 重新获取数据后在进行上传资质状态数据判断
          hasCheckUserLicense&&that.checkUserLicense()
        })
      },
      () => {},
      () => {})
    },
    checkUserLicense() {
      const permitStatus = this.$store.state.user.userInfo.permitStatus
      //新用户审核中 不可购买
      // 已经认证成功用户/或者老用户审核 直接购买
      if(permitStatus==2||permitStatus==5) {
        this.$refs.AddBuyShop.open(this.currentProduct)
      
        return
      }
      if(permitStatus === 1){
        const info = {
          icon: require("@/static/productDetail/whiteTip@2x.png"),
          title: "Documents Under Review ",
          tip: "You can purchase from Trendsi after your account is approved via email.",
          selfStyle:'width:32px;height:32px'
        };
        this.customImgCreatedSuccessInfo(info);
        return true
      }
      // 需要展示上传资质 0 3 4 6 新用户未认证、新用户被拒绝、老用户未认证、老用户被拒绝
      if(permitStatus === 0 || permitStatus === 4 || permitStatus === 3 || permitStatus === 6){
        this.licenseComponentVisible = true
        return true
      }
    },
  },
};
</script>
<style lang="less">
.products {
  display: flex;
  flex-wrap: wrap;
  .products-single {
    position: relative;
    box-sizing: border-box;
    // transition: all 0.3s;
    &:not(.single-image-box):hover {
      // display: block !important;
      background: #fff;
      box-shadow: 0px 10px 40px rgba(151, 151, 151, 0.15);
      border-top-left-radius: 18px;
      border-top-right-radius: 18px;
      transition: all 0.3s;
    }
    &.isTourist:nth-child(5n) {
      margin-right: 0;
    }
    @media (min-width: 1441px)  {
      &.isTourist:nth-child(5n) {
        margin-right: 24px;
      }
    }
    @media (max-width: 1439px)  {
      &.isTourist {
        margin-right: 24px !important;
      }
    }
    &:not(.single-image-box).isTourist:hover {
      border-radius: 18px;
    }
    &.isTourist {
      height: 382px;
    }
    &:not(.single-image-box).isTourist:hover .shop-bottom-box{
      background: transparent;
      z-index: 0;
    }
    &:not(.single-image-box):hover .event-box {
      // display: block !important;
      opacity: 2;
      transition: opacity 0.3s;
    }
    &:not(.single-image-box):hover .shop-bottom-box {
      background: #fff;
      z-index: 3;
    }
    &:not(.single-image-box):hover .left-direction {
      display: flex !important;
    }
    &:not(.single-image-box):hover .right-direction {
      display: flex !important;
    }
    cursor: pointer;
    margin-right: 24px;
    margin-bottom: 16px;
    display: flex;
    flex-direction: column;
    width: 220px;
    height: 406px;
    padding: 10px 10px 16px 10px;
    .img-box {
      overflow: hidden;
      height: 300px;
      border-radius: 8px;
      position: relative;
      width: 100%;
      .jit-new-tag {
        position: absolute;
        left: 0;
        top: 10px;
        z-index: 2;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 0px 10px 10px 0px;
        padding: 5px 8px 5px 4px;
        .text {
          font-weight: 600;
          line-height: 10px;
          color: #C79818;
          display: block;
          font-size: 12px;
          transform : scale(0.83,0.83);
          *font-size: 10px;
        }
      }
      .self-tag-box {
        position: absolute;
        display: flex;
        align-items: center;
        top: 8px;
        left: 8px;
        z-index: 2;
        border-radius: 20px;
        max-width: 24px;
        overflow: hidden;
        transition: all .3s;
        &:hover {
          background: #fff;
          max-width: 120px;
          transition: max-width .3s;
          padding-right: 7px;
        } 
        &:hover .self-tag-text{
          opacity: 1;
        }
        .self-tag-text {
          font-size: 12px;
          color: #000000;
          font-weight: 400;
          opacity: 0;
          white-space: nowrap;
        }
        .self-tag {
          width: 24px;
          height: 24px;
        }
      }
      
      .carousel-img-box {
        overflow: hidden;
        position: relative;
        width: 100%;
        height: 100%;
        .left-direction {
          background: rgba(51, 51, 51, 0.1);
          transform: translateY(-50%);
          border-radius:50%;
          display:none;
          justify-content:center;
          align-items: center;
          top: 50%;
          left: 0;
          position: absolute;
          z-index: 1;
          width: 24px;
          height: 24px;
          &:hover {
            background: rgba(51, 51, 51, 0.3);
          }
          img {
            display: block;
            height: 9px;
            // width: 7.5px;
          }
        }
        .right-direction {
          background: rgba(51, 51, 51, 0.1);
          transform: translateY(-50%);
          border-radius:50%;
          display:none;
          justify-content:center;
          align-items: center;
          top: 50%;
          right: 0;
          position: absolute;
          z-index: 1;
          width: 24px;
          height: 24px;
          &:hover {
            background: rgba(51, 51, 51, 0.3);
          }
          img {
            display: block;
            height: 9px;
            // width: 7.5px;
          }
        }
      }
      .showicon {
        display: block !important;
        z-index: 2;
      }
      &:hover .collect {
        display: initial;
      }
      .collect {
        position: absolute;
        display: none;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        &.nocollect,&.sisAdd {
          right: 36px;
        }
        &.isAdd {
          right:64px;
        }
      }
      // 商品标签样式
      .goods-tag-bk {
        position: absolute;
        z-index: 3;
        bottom: 10px;
        left: 10px;
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(10px);
        width: 180px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border-radius: 6px;
      }
      .goods-time {
        font-weight: bold;
        color: #333;
        span {
          font-size: 12px;
        }
      }
      .goods-sold-out {
        font-weight: 600;
        color: #fff;
        background: rgba(51, 51, 51, 0.6);
        span {
          font-size: 14px;
        }
      }
      .goods-pre-order {
        color: #333;
        font-weight: bold;
        span {
          font-size: 14px;
        }
      }
      .goods-coming-soon {
        font-weight: 700;
        span {
          font-size: 12px;
        }
      }
      .icon {
        object-fit: cover;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        z-index: 0;
        opacity: 0;
        position: absolute;
        &.active {
          z-index: 1;
          opacity: 1;
          transition: opacity 0.6s;
        }
      }
      .share-box {
        text-align: center;
        bottom: -30px;
        // display: none;
        height: 27px;
        line-height: 27px;
        width: 100%;
        transition: bottom 0.5s;
        position: absolute;
        background: #c4c4c4;
        border-radius: 0px 0px 8px 8px;
      }
    }
    // 商品品牌名称样式
    .shop-brand-and-name {
      margin-bottom: 8px;
      margin-top: 16px;
      font-weight: 600;
      line-height: 16px;
      font-size: 14px;
      color: #333;
      // line-height: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      // display: -webkit-box;
      // -webkit-box-orient: vertical;
      // -webkit-line-clamp: 2;
    }
    .tourist-lock-tip {
      display: none;
      box-sizing: border-box;
      position: absolute;
      padding: 11px 14px;
      border-radius: 8px;
      border-bottom-right-radius: 0;
      z-index: 3;
      width: 200px;
      height: 60px;
      left: 10px;
      top: 282px;
      background: #C79818;
      font-size: 14px;
      line-height: 18px;
      color: #fff;
      &:hover {
        display: block;
      }
      &::after {
        position: absolute;
        content: '';
        display: block;
        width: 20px;
        height: 20px;
        z-index: 10;
        bottom: -10px;
        right: 0;
      }
      &::before {
        position: absolute;
        content: '';
        display: block;
        z-index: 2;
        bottom: -6px;
        right: 0;
        border-width: 5px;
        border-style: solid dashed dashed dashed;
        border-color: #C79818 #C79818 transparent transparent
      }
    }
    .shop-attribute {
      // display: flex;
      // align-items: center;
      // justify-content: space-between;
      line-height: 16px;
      .price-box {
        display: flex;
        justify-content:space-between;
        align-items:center;
        margin-bottom: 8px;
        .lock-img {
          height: 12px;
          &:hover + .tourist-lock-tip {
            display: block;
          }
        }
        span {
          display: inline-flex;
        }
        .cost-price-throughline {
          text-decoration: line-through;
          color: #979797;
          font-weight: normal;
          font-size: 10px;
          margin-right: 8px;
        }
        .cost-price {
          color: #c79618;
          font-weight: 600;
          font-size: 12px;
        }
      }
      .price-text {
        font-size: 12px;
        color: #333333;
      }
      .suggested-price {
        display: flex;
        justify-content:space-between;
        align-items:center;
        .suggested-price {
          font-size: 12px;
          color: #333333;
          font-weight: 600;
        }
      }
    }
    .shop-bottom-box {
      position: absolute;
      // background-color:#fff;
      border-bottom-left-radius:18px;
      border-bottom-right-radius:18px;
      left: 0;
      bottom: -46px;
      width: 100%;
      height:46px;
    }
    .event-box {
      display: flex;
      position: absolute;
      z-index: 1;
      bottom: 16px;
      left: 16px;
      font-weight: 500;
      font-size: 14px;
      opacity: 0;
      color: #fff;
      // transition: all 0.3s;
      .shop-share,
      .shop-add-collection,.buy-sample {
        width: 90px;
        height: 30px;
        line-height: 30px;
        background: #333333;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
        border-radius: 20px;
        text-align: center;
        span {
          font-size: 12px;
          font-weight: 500;
        }
      }
      .shop-share,.buy-sample {
        margin-right: 8px;
      }
      .shop-add-collection {
        background: #c79818;
        box-shadow: 0px 4px 10px rgba(118, 85, 0, 0.2);
      }
    }
    .name {
      height: 20px;
      margin-top: 8px;
      background: #ccc;
    }
    &.single-image-box {
      width: 100%;
      flex-shrink: 0;
      padding: 0;
      margin-right: 0;
      height: inherit !important;
      border-radius: inherit !important;
      // &:nth-child(2n + 2) {
      //   margin-bottom: 40px !important;
      // }
      .single-image {
        margin-bottom: 20px;
        img {
          display: block;
          width: 100%;
          cursor: initial;
          &.hashover {
            cursor: pointer;
          }
        }
      }
    }
  }
}
.seft-notify {
  &.link {
    // height: 80px;
    .title {
      margin-bottom: 0 !important;
    }
  }
  width: 340px;
  // height: 102px;
  padding: 16px 20px;
  background: rgba(51, 51, 51, 0.6);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(25px);
  /* Note: backdrop-filter has minimal browser support */
  border: none;
  border-radius: 20px;
  .el-notification__group {
    margin: 0;
  }
  .el-notification__content {
    font-size: 14px;
    //  line-height: 21px;
    margin: 0;
    color: #fff;
    text-align: inherit;
  }
  .self {
    display: flex;
    align-items: center;
    color: #fff;
    .img-box {
      &.link {
        background: url(../../../static/link@2x.png) no-repeat;
        background-size: contain;
      }
      font-size: 0;
      background: url(../../../static/success@2x.png) no-repeat;
      background-size: contain;
      width: 40px;
      height: 40px;
      margin-right: 10px;
      .tip {
        font-size: 14px;
      }
    }
    .title {
      margin-bottom: 10px;
      span {
        font-weight: bold;
        font-size: 16px;
      }
    }
  }
  @import '../../../styles/addCollectionAndCreated.less';
  
  
}

</style>