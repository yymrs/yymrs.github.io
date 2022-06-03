<template>
  <div class="products-detail" :class="{isTourist}">
    <HomeCategory></HomeCategory>

    <div class="products-detail-container ms">
      <div class="detail-router-info">
        <div><span @click="backHomePage">Home</span> </div>
        <div class="computed" v-for="(name,id,index) in computedDetailRouter" :key="id">/ <span @click="jumpUrl(index,id)">{{name}}</span> </div>
      </div>
    <div class="detail-main-img">
        
      <!-- <div class="back-img">
        <div class="seft-back-img-container" @click="backPage">
          <img src="../../../static/productDetail/headerBack@2x.png" alt="" />
        </div>
        <span class="back-text" @click="backPage"> Back </span>
      </div> -->
      <div class="detail-img">
        <div class="img-container" :class="{allImgSquare:allImgSquare}">
          <div class="all-img">
            <div class="self-tag-box" v-if="computedImg(productInfo.tagName)">
              <img class="self-tag" :src="computedImg(productInfo.tagName)" alt="">
              <span class="self-tag-text">{{productInfo.tagName}}</span>
            </div>
            <div class="jit-new-tag" v-if="productInfo.tagType==1&&productInfo.tagName=='New Arrivals'">
              <span class="text">NEW</span>
            </div>
            <img
              v-show="!hoverSkuImg&&!clickSkuImg"
              @click="showBigImg(item,index)"
              v-imgError:big
              draggable="false"
              @load="imgLoad(index)"
              :ref="'imgSize' + index"
              class="current-img"
              :data-active='(activeImgIndex == index)&&!hoverSkuImg&&!clickSkuImg'
              :class="{ active: activeImgIndex == index }"
              :src="item"
              v-for="(item, index) in productInfo.headImages"
              :key="index"
              alt=""
            />
            <!-- @load="loadSkuImg('hovesku-img')" -->
            <img @load="loadSkuImg('sku-img')" v-show="clickSkuImg&&!hoverSkuImg" :data-active='clickSkuImg&&!hoverSkuImg' class="current-img sku-img" ref="sku-img" :src="currentSelectSku.image" alt="">
            <img @load="loadSkuImg('hovesku-img')" v-show="hoverSkuImg" :data-active='hoverSkuImg' class="current-img hovesku-img" ref="hovesku-img" :src="hoveSkuImage" alt="">
            <img
              class="collect showicon"
              :class="{isAdd:productInfo.exportedToShopify&&productInfo.containProduct,sisAdd:productInfo.exportedToShopify||productInfo.containProduct,}"
              v-if="productInfo.isAdd&&!isTourist"
              src="../../../static/addStore@2x.png"
              alt=""
            />
            <img
              v-if="productInfo.containProduct"
              class="collect nohover showicon"
              src="../../../static/Collection@2x.png"
              alt=""
            />
             <img
              class="collect showicon"
              :class="{nocollect:productInfo.containProduct}"
              v-if="productInfo.exportedToShopify"
              src="../../../static/productshopify@2x.png"
              alt=""
            />
            <div
              class="goods-coming-soon goods-tag-bk"
              v-if="productInfo.status == 1"
            >
              <span>Coming Soon</span>
            </div>
            <div
              class="goods-sold-out goods-tag-bk"
              v-else-if="productInfo.stock == 0||productInfo.onlineStatus==0"
            >
              <span>Sold Out</span>
            </div>
            <div class="goods-sold-out goods-tag-bk" v-else-if="productInfo.state===4">
              <span>Shipping Delay </span>
            </div>
            <div
              class="goods-pre-sale goods-tag-bk"
              v-else-if="productInfo.forwardSell==1"
            >
              <span>Pre-order</span>
            </div>
            <div
              class="goods-sold-out goods-tag-bk"
              v-else-if="productInfo.tagType==6"
            >
              <span>Pre-Launch</span>
            </div>
            <div
              class="goods-time goods-tag-bk"
              v-else-if="expirationTime(productInfo)"
            >
              <span>Sale Ends: {{ expirationTime(productInfo) }}</span>
            </div>
            <div class="img-number-position" :class="{secondDisplay:secondDisplay}">
              {{ activeImgIndex + 1 }}/{{
                productInfo.headImages ? productInfo.headImages.length : ""
              }}
            </div>
          </div>
        </div>
        <!-- <div
          class="collect left-direction"
          :class="{secondDisplay:secondDisplay}"
          @click="switchImg('prev')"
        >
          <img
            src="../../../static/productDetail/left@2x.png"
            alt=""
          />
        </div>
        <div class="collect right-direction" :class="{secondDisplay:secondDisplay}" @click="switchImg('next')">
          <img src="../../../static/productDetail/right@2x.png" alt="" />
        </div> -->
      </div>
      <div class='smaill-img-box'>
        <div class='img-handle prev-img unselect' v-if="activeImgIndex!=0&&productInfo.headImages.length>5" @click="smailPrev()">
          <img draggable="false" src="../../../static/productDetail/left@2x.png" alt="" />
        </div>
        <!-- @click="parentClick" -->
        <div class='smaill-img-container unselect' @click="parentClick"   @mousedown="smaillImgMousedown"   @mouseup="smaillImgMouseup" @mousemove.capture.stop="smaillImgMousemove"  @mouseleave="smaillImgMouseleave">
          <!--  -->
          <div class='smaill-img unselect' :style="{cursor: productInfo.headImages&&productInfo.headImages.length<5?'initial':'pointer'}" style="transform: translateX(0px)" ref="smaillImg" >
              <!-- @click="smaillSwitchImg(index)" -->
            <div class="smaill-img-single" :class="{ active: activeImgIndex == index&&!clickSkuImg }" :data-index='index' v-for="(item, index) in productInfo.headImages" :key="index">
              <img
              :data-index='index'
              v-imgError:big
              draggable="false"
              loading="lazy"
              :ref="'smaill'+index"
              class="unselect"
              :class="{ active: activeImgIndex == index&&!clickSkuImg }"
              :src="item"
              alt=""
            />
            </div>
          </div>
        </div>
        <div class="img-handle next-img unselect" v-if="maxSmaillClick&&productInfo.headImages.length>5" @click="smailNext()">
          <img draggable="false" src="../../../static/productDetail/right@2x.png" alt="" />
        </div>
      </div>
      <div class="img-download-info-copy" v-if="!isTourist">
        <div class="img-download unselect" @click="downloadImg">
          <div>
            <img draggable="false" src="../../../static/productDetail/doadImages@2x.png" alt="">
          </div>
          <div class="text">
            Images
          </div>
        </div>
        <div class="info-copy unselect" @click="selfShareShopInfo">
          <div>
            <img draggable="false" src="../../../static/productDetail/Info@2x.png" alt="">
          </div>
          <div class="text">
            Info
          </div>
        </div>
      </div>
    </div>
    <div class="detail-info">
      <div class="detail-info-centre" ref="detail-info-centre">
        <div class="info-brand-title">
          {{ productInfo.brand }} {{ productInfo.title }}
        </div>
        <!-- <div class="min-crossed-price" v-if="productInfo.minCrossedPrice > 0">
          Retail ${{ formatPrice(productInfo.minCrossedPrice) }}
        </div> -->
        <div class="price-container">
          <div class="customer-price">
            <div>
              <span class="amount" v-if="!isTourist">${{ formatPrice(productInfo.minPriceB) }}</span>
              <div class="lock-img-box" v-else>
                <img @mouseleave='hoveLock("lock",false)' @mouseenter='hoveLock("lock",true)' class="lock-img" :src="!tourist.lock?require('@/static/lock@2x.png'):require('@/static/yellowlock@2x.png')">
                <div @mouseleave='hoveLock("lock",false)' @mouseenter='hoveLock("lock",true)' class="tourist-lock-tip"  @click.stop.prevent='loginHandle'>
                  Sign up for Trendsi to unlock product cost
                </div>
              </div>
              <span class="amount-msrp" v-if="productInfo.minCrossedPrice&&!isTourist">${{ formatPrice(productInfo.minCrossedPrice) }}</span>
              <!-- <span v-if="productInfo.minCrossedPrice&&!isTourist" class="msrp">MSRP</span> -->
            </div>
            <span class="amount-name">Product Cost</span>
            <span class="tip">What you pay when you buy.</span>
          </div>
          <div class="trendsist-price">
            <span class="amount" v-if="!isTourist">
              ${{ formatPrice(productInfo.priceC) }}
              <span class="amount-msrp" v-if="productInfo.minCrossedPrice&&isTourist">${{ formatPrice(productInfo.minCrossedPrice) }}</span>
              <!-- <span v-if="productInfo.minCrossedPrice&&isTourist" class="msrp">MSRP</span> -->
            </span>
            <div v-else class="amount">
              <img class="lock-img" :src="require('@/static/lock@2x.png')">
            </div>
            
            <span class="amount-name">Suggested Resale Price   </span>
            <span class="tip">What someone pays when they buy from you.    </span>
          </div>
          <div class="earn-price">
            <span class="amount" v-if="!isTourist">${{ formatPrice(productInfo.maxEarn) }}</span>
            <div class="lock-img-box" v-else>
                <img class="lock-img nohover" :src="require('@/static/lock@2x.png')">
            </div>
            <span class="amount-name">Earn</span>
            <span class="tip">Your profit each time someone buys from you.</span>
          </div>
        </div>
        <div class="shipping-time">
          <div>
            <img src="../../../static/productDetail/shipping@2x.png" alt="" />
            <!-- <span class="shipping-time-title">Shipping Time</span> -->
            <template v-if="Object.keys(productInfo).length!=0">
              <span class="shipping-time-date" v-if="!(productInfo.state===4)">{{
                productInfo.deliveryRemark
              }} <br> <a class="return" :href="'https://help.trendsi.com/knowledge/how-long-does-the-shipping-take?hs_preview=oTlWWLlb-43303282781'" target="_blank">
                See details 
                </a></span>
              <template v-else>
                <span class="shipping-time-date shipping-delay">
                {{
                  productInfo.deliveryRemark
                }}
                <a v-if="productInfo.seeDetailsLink" :href="productInfo.seeDetailsLink" target="_blank">
                See details 
                </a>
                </span>
              </template>
            </template>
          </div>
          <div>
            <img
              src="../../../static/productDetail/freeShipping@2x.png"
              alt=""
            />
            <!-- <span class="shipping-time-title">Free Shipping</span> -->
            <span class="shipping-time-date">
              {{
                productInfo.deliveryFeeRemark
                  ? productInfo.deliveryFeeRemark.replace("Free Shipping", "")
                  : ""
              }}</span
            >
          </div>
          <div>
            <img
              src="../../../static/productDetail/return&Refund@2x.png"
              alt=""
            />
            <!-- <span class="shipping-time-title">Return & Refund</span> -->
            <span v-if="Object.keys(productInfo).length!=0" class="shipping-time-date">{{
              productInfo.refundRemark
                ? productInfo.refundRemark.replace("Return & Refund", "")
                : ""
            }}Return & Refund <br> on most items. <a class="return" href="https://help.trendsi.com/knowledge/trendsi-return/exchange-policy-procedure" target="_blank">See details</a></span>
          </div>
        </div>
        <div class="pre-launch" v-if="productInfo.tagType==6">
          Only sample purchases are permitted prior to launch. You may add products to Shopify to prepare your listing, but sales channels will be disabled prior to the launch date on <span class="tagEndDate">{{productInfo.tagEndDate}}.</span> Shopify orders on pre-launch products will not be fulfilled.
        </div>
        <!-- 商品规格 -->
        <!-- 1.规格都可以选择，2.选择之前需要计算出当前规格是否在有货的sku，3.默认初始化一个sku规格 -->
        <div class="product-sku" v-if="productInfo.dimensions">
          <div class="select-spec">
            <div class="single-select" v-for="(spec,index) in productInfo.dimensions" :key="index">
              <div class="single-select-name">
                {{spec.name}}: <span v-if="colorList.includes(spec.name)">{{hoverSkuImg||hoverSkuSpec?hoverSkuInfo[spec.name]:cuomputedSelectSku[spec.name]}}</span>
              </div>
              <div class="single-select-item color" v-if="colorList.includes(spec.name)">
                <div class="select-img-list">
                  <div class="select-img" @mouseleave="mouseleaveSkuImg" @mouseover='mouseoverSkuImg(sku.image,sku.dimensionValue,spec.name)' :class="{select:checkIsSelect(sku,spec.name),'has-selcet':hasCurrentSku(spec,sku.dimensionValue[spec.name]),'selcet-nosku':selcetNosku(spec,sku.dimensionValue[spec.name])}"  @click="selectSpecItem(sku,'Color',spec.name)" v-for="(sku,i) in productInfo.newFilterSku" :key="i">
                    <img :src="sku.image" alt="">
                  </div>
                </div>
              </div>
              <div v-else class="single-select-item">
                <div class="select-spec-item" @mouseleave="mouseleaveSpec" @mouseover='mouseoverSpec(specItem,spec.name)' :class="{select:checkIsSelect(specItem,spec.name),'has-selcet':hasCurrentSku(spec,specItem),'selcet-nosku':selcetNosku(spec,specItem)}" @click="selectSpecItem(specItem,spec.name)" v-for="(specItem,i) in spec.values" :key='i'>
                  {{specItem}}
                </div>
              </div>
            </div>
          </div>
          <div>
            <div class="select-quantity">
              <div class="name">Quantity: {{hoverSkuImg||hoverSkuSpec?hoverSkuInfo.inventory:getStocksShowInfo(currentSelectSku.stock)}} available <span class="restocking" v-if="currentSelectSku.restock">{{ currentSelectSku.estimateRestockDate }}</span></div>
              <div class="input-number" :class="{disable:quantity<=0}">
                <span class="shop-numbers">{{ quantity }}</span>
                <!-- 预发布商品添加悬浮效果提示文字 -->
                <el-tooltip v-if="productInfo.tagType==6&&!isTourist&&showCartEventMousemove" class="item" offset='60' effect="dark" content="The maximum order quantity on pre-launch products is 2." placement="top-start">
                  <div slot="content" :style="{width:filterShowCartEventMousemoveMessage.includes('pre-launch products')?'240px':''}" class="filter-showCart-event-mousemove">{{filterShowCartEventMousemoveMessage}}</div>
                  <i
                    class="el-icon-arrow-up quantity-icon"
                    :class="{ disable: quantity >= currentSelectSku.stock }"
                    @click="quantityHandle('up')"
                    @mousemove="quantityPreLaunch"
                  ></i>
                </el-tooltip>
                <i
                  v-else
                  class="el-icon-arrow-up quantity-icon"
                  :class="{ disable: quantity >= currentSelectSku.stock }"
                  @click="quantityHandle('up')"
                  @mousemove="quantityPreLaunch"
                ></i>
              
                <i
                  class="el-icon-arrow-down quantity-icon"
                  :class="{ disable: quantity <= 1 }"
                  @click="quantityHandle('down')"
                ></i> 
              </div>
            </div>
          </div>
        </div>
        <!-- detail -->
        
        <div class="product-details">Product Details</div>
        <div class="description" v-html="productInfo.description"></div>
      </div>
      <div>
        
      </div>
      <div class="brand-info-container">
        <div class="brand-info">
        <img  style="
          " src="../../../static/productDetail/brand@2x.png" />
        <span style="margin-left:6px">Brand:</span>
        <span style="margin-left:8px">{{productInfo.brandIndex}}</span>
      </div>
      </div>
      <div class="event-box" :style="{width:eventBoxWidth}" v-if="Object.keys(productInfo).length!=0">
        <template v-if="!isTourist">
          <!-- productInfo.stock != 0 && productInfo.onlineStatus == 1 && productInfo.status!=1 -->
          <div class="buy-sample" :class="{notify:currentSelectSku.stock<=0,disable:isSubscription}" @click="openBuySample">
            <template v-if="currentSelectSku.stock>0">
              <el-tooltip v-if="filterShowCartEventMousemoveMessage&&!filterShowCartEventMousemoveMessage.includes('pre-launch')" class="item" offset='60' effect="dark" content="The maximum order quantity on pre-launch products is 2." placement="top-start">
                <div slot="content" class="filter-showCart-event-mousemove">{{filterShowCartEventMousemoveMessage}}</div>
                <span>Buy Sample</span>
              </el-tooltip>
              <span v-else>Buy Sample</span>
            </template>
            <template v-else>
              <span v-if="currentSelectSku.restock!==1">Request Restock</span>
              <span v-else>Notify Me When Available</span>
            </template>
          </div>
          <!-- <div
            class="notify-available"
            :class="{ active: isAttentionProduct }"
            @click="notifyAvailable"
            v-if="productInfo.stock == 0 && productInfo.status != 1"
          >
            <span>Notify Me When Available</span>
          </div> -->
          <div class="shop-share" v-if="productInfo.stock != 0 || productInfo.status == 1" @click="shareShop(productId)">
            <span>Copy Link</span>
          </div>
          <div class="shop-add-collection" @click.stop="addCollection">
            <span>Add</span>
          </div>
        </template>
        <div v-else>
          <div
            class="istourist-login"
            :class="{ active: isAttentionProduct }"
            @click="loginHandle"
          >
            <span>Sign Up to Unlock Product Cost</span>
          </div>
        </div>
        
      </div>
    </div>
    <open-add-popup v-if="!isTourist" :dialogVisible.sync='eventOpenAddPopup' :amplitude='amplitude' @uPproduct='uPproduct' @updateProductStore='updateProductStore' :product='productInfo' :width="'400px'" />
    <CreatedAndAddCollection
      v-if="!isTourist"
      :dialogVisible.sync="showAddToCollection"
      @updateproduct="updateproduct"
      :currentProduct="productInfo"
      :currentClickProductId="productId"
    />
    <div v-if="openBigImgModule">
      <BigImgShow :openBigImgModule.sync='openBigImgModule' @updataImg='updataImg' :currentTitle='imgTitle' :currentImg.sync='currentImg' :activeImgIndex.sync='currentIndex' :allImgList='productInfo.headImages' />
    </div>
    <el-dialog :show-close='false' width="300" class="pre-launch-dialog" title="Exceeded Order Quantity" :visible.sync="preLaunchDialog" center @close="preLaunchDialog=false">
      <div>
        {{preErrorTip}}
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="dialog-btntext" @click="preLaunchDialog=false">ok</div>
      </div>
    </el-dialog>
    <LicenseComponent :dialogVisible.sync='licenseComponentVisible' @continueBuy='continueBuy' :oldUserText='"Continue Shopping"'></LicenseComponent>
    <!-- 添加购买商品 -->
    <!-- <AddBuyShop v-if="openAddBuyShop" :openAddBuyShop.sync='openAddBuyShop' :shopData='productInfo' /> -->
    </div>
  </div>
</template>

<script>
import { formatPrice, transferDateFromNowDetail,transFormTimeToLocalDate } from "@/utils/common";
import productShare from "@/mixins/share";
import successInfo from "@/mixins/successInfo";
import openAddPopup from '@/views/products/components/openAddPopup'
import CreatedAndAddCollection from "@/views/collections/collectionsDetail/createdAndAddCollection.vue";
import BigImgShow from "@/views/products/components/bigImgShow";
import LicenseComponent from "@/views/products/components/LicenseComponent";
import HomeCategory from "@/views/products/components/HomeCategory";
import {
  productDetail,
  attentionProduct,
  recordOnLineProduct,
  cartEvent
} from "@/api/production";
import JSZip from 'jszip'
import FileSaver from 'file-saver'
import axios from 'axios';
import { addDefaultproductCollection } from "@/api/collections";
import { addShopToCart } from "@/api/cart";
import { userInfo } from '@/api/login';
const colorList = ['Color']
export default {
  name: "ProductsDetail",
  data() {
    return {
      productInfo: {},
      formatPrice,
      productId: "",
      showAddToCollection: false,
      eventOpenAddPopup: false,
      detailScroll: false,
      isAttentionProduct: false,
      openBigImgModule: false,
      currentImg:'',
      currentIndex:0,
      activeImgIndex: 0,
      allImgSquare:true,
      openAddBuyShop:false,
      secondDisplay:true, 
      smaillIsClickMove:false,
      smaillIsClickEvnet:{},
      stopClick:false,
      tourist:{
        lock:false,
      },
      quantity:1,
      currentSelectSku:{},
      addToBagLoading: false,
      hasSkuList:[],
      clickSkuImg:false,
      hoverSkuImg:false,
      hoverSkuSpec:false,
      hoveSkuImage:null,
      hoverSkuInfo:{},
      skuId:undefined,
      allImg:null,
      partialSKUSubscriptionLoading:false,
      colorList,
      preLaunchDialog:false,
      preErrorTip:'',
      cartEventLoading:false,
      completeEventSwitch:false, // 切换数量或者sku的话预发布商品可以再次请求接口
      showCartEventMousemove:false,
      showCartEventMousemoveMessage:'',
      amplitude: {
        buy_sample:{
          page_code:'product_detail_page'
        }
      },
      licenseComponentVisible:false,
      eventBoxWidth: 0
    };
  },
  mixins: [productShare,successInfo],
  components: {
    openAddPopup,
    CreatedAndAddCollection,
    BigImgShow,
    LicenseComponent,
    HomeCategory
    // AddBuyShop
  },
  created() {
    this.productId = this.$route.query.id;
    this.skuId = this.$route.query.skuId
    this.getAttentionProduct();
  },
  mounted() {
    // if(window.performance.navigation.type === 1) {
    //   console.log(666666, 1, '页面被刷新');
    //   this.amplitude.ref_pv_id = this.$route.params.pv_id
    // } else {
    //   console.log(666666, 2, '页面被加载');
    // }
    this.allImg = document.querySelector(".all-img");
    this.getProductDetail();
    this.$EventBus.$off('upShopDetailPage');
    this.$EventBus.$on('upShopDetailPage',()=>{
      this.getProductDetail();
    })
  },
  watch:{
    clickSkuImg(n) {
      this.$nextTick(()=>{
        if(n) {
          this.currentImgComputed()
        }
      })
    },
    activeImgIndex() {
      this.currentImgComputed()
    },
    hoverSkuImg(n) {
      this.$nextTick(()=>{
        if(n) {
          this.currentImgComputed()
        }
      })
    },
    quantity(n) {
      this.completeEventSwitch = false
    }
  },
  computed:{
    imgTitle() {
      if(this.productInfo.brand) {
        const brand = this.productInfo.brand
        let upperCase = brand.slice(0,1).toUpperCase() + brand.slice(1)
        return (upperCase+this.productInfo.title).replaceAll(' ','');
      }else {
        return this.productInfo.title.replaceAll(' ','');
      }
      
    },
    maxSmaillClick() {
      const lenght = this.productInfo.headImages&&this.productInfo.headImages.length||0;
      const areaImg = lenght-4;
      if(this.activeImgIndex<areaImg&&lenght!=0) {
        return true
      }else { 
        return false
      }
    },
    cuomputedSelectSku() {
      // sku有变化预发布商品可以继续悬浮请求接口
      // this.completeEventSwitch = false
      if(Object.keys(this.currentSelectSku).length === 0) {
        return {}
      }
      const {dimensionValue} = this.currentSelectSku
      return {...dimensionValue}
    },
    // 计算当前sku是否缺货订阅了
    isSubscription() {
      return this.currentSelectSku.restockRequested
    },
    filterShowCartEventMousemoveMessage() {
      if(this.showCartEventMousemoveMessage) {
        return this.showCartEventMousemoveMessage
      }
      return ''
    },
    // 计算详情页面的路由
    computedDetailRouter() {
      let router = {}
      let backCates = this.productInfo.backCates
      if(typeof backCates == 'string') {
        backCates = backCates.replace(/(\d+):/g,"\"$1\":");
        const passObj = JSON.parse(backCates)
        let passArray = Object.keys(passObj)
        passArray.map((key,index)=>{
          if(passObj[key]&&passObj[key].trim()!='') {
            router[key] = passObj[key]
          }else {
            passArray.length = index
          }
        })
      }
      return router
    }
  },
  methods: {
    getProductDetail() {
      var data, sucess, error, complete;
      data = {
        productId: this.productId
      };
      if(!data.productId) {
        this.$router.push('404')
        return
      }
      const loading = this.$loading({
        lock: true,
        text: "",
        spinner: "el-icon-loading",
        background: "rgba(51,51,51,0.25)",
      });
      sucess = (res) => {
        const { result } = res;
        this.productInfo = result;
        this.filterSkuImgList()
        this.initSelectSku()
        if(this.productInfo.tagType==6&&!this.isTourist) {
          this.cartEvent()
        }
        this.productInfo.minPrice = this.productInfo.priceC;
        // this.$nextTick(()=>{
        //   this.currentImgComputed()
        // })
        console.log('第2个埋点------查看商品详情-----', this.productInfo);
        document.title = (this.productInfo.brand?this.productInfo.brand:'') + (this.productInfo.title?this.productInfo.title:'');
        let productInfoOne = this.productInfo;
        let uuId = JSON.parse(localStorage.getItem('USERINFO'))?JSON.parse(localStorage.getItem('USERINFO')).uuId:undefined;
        this.$gtm.trackEvent({
          event: 'view_item',
          userId: uuId,
          ecommerce: {
            items: [{
              item_name: productInfoOne.title,
              item_id: productInfoOne.id,
              price: productInfoOne.minPriceB,
              item_brand: productInfoOne.brand,
              item_category: '',
              item_category2: '',
              item_category3: '',
              item_category4: '',
              item_variant: '',
              item_list_name: '',
              item_list_id: '',
              index: 1,
              quantity: 1
            }]
          }
        });
      };
      error = (res) => {
        console.log(res);
      };
      complete = () => {
        loading.close();
        var detailInfo = document.querySelector(".detail-info-centre");
        var description = document.querySelector(".description");
        setTimeout(()=>{
          var eventBox = document.querySelector(".event-box");
          this.eventBoxWidth = detailInfo.clientWidth + 'px'
          var result = this.hasScrolled(detailInfo);
          var result2 = this.hasScrolled(description);
          // var div = document.createElement("div");
          // div.style.display = "flex";
          // div.style.marginTop = '24px';
          // div.style.marginBottom = '10px'
          // const brandIndex = this.productInfo.brandIndex
          // const src = require("../../../static/productDetail/brand@2x.png")
          // div.innerHTML = `<div style='background: #F9F9F9;height: 32px;display:flex;
          //   align-items: center;
          //   padding:0 18px 0 5px;
          //   border-radius: 20px;'>
          //   <img  style="
          //     width: 24px;
          //     height: 24px;" src="${src}" />
          //   <span style="margin-left:6px">Brand:</span>
          //   <span style="margin-left:8px">${brandIndex}</span>
          // </div>`
          // description.appendChild(div)
          if (result||result2) {
            this.detailScroll = true;
            eventBox.style.width = detailInfo.clientWidth + "px";
          }
        },100)
        setTimeout(()=>{
          this.secondDisplay = false
        },1000)
      };
      productDetail(data, sucess, error, complete);
    },
    // 过滤sku图片列表
    filterSkuImgList() {
      const {dimensions} = this.productInfo
      let colorName,colorIndex=-1;
      const colorList = dimensions.find(item=>{
        if(this.colorList.includes(item.name)) {
          colorIndex = this.colorList.indexOf(item.name)
          return true
        }
      })
      // 查到colorName 的单词
      let newFilterSku = []
      if(colorIndex!=-1) {
        colorName = this.colorList[colorIndex]
        colorList.values.map(item=>{
          this.productInfo.skuList.find(sku=>{
            if(sku.dimensionValue[colorName]===item) {
              newFilterSku.push(sku)
              return true
            }
          })
        })
      }
      this.productInfo.newFilterSku = newFilterSku
    },
    // 初始化可以选择的sku
    initSelectSku() {
      const {skuList} = this.productInfo
      const hasSkutList = skuList
      this.hasSkuList = hasSkutList.filter((sku) => sku.stock > 0);
      if(Number.isInteger(Number(this.skuId))) {
        const bagProduct = hasSkutList.find(item=>item.id === Number(this.skuId))
        this.currentSelectSku = bagProduct?bagProduct:this.hasSkuList.length>0?this.hasSkuList[0]:hasSkutList[0]
        this.clickSkuImg = true
      }else {
        this.currentSelectSku = this.hasSkuList.length>0?this.hasSkuList[0]:hasSkutList[0]
      }
    },
    // 点击规格选择sku _specName图片列表的图片color名称可能是大写或者小写
    selectSpecItem(specItem,name,_specName) {
      let specName
      const _dimensionValue = {...this.cuomputedSelectSku}
      if(name==='Color') {
        specName = specItem.dimensionValue[_specName]
        this.currentImgComputed()
        _dimensionValue[_specName] = specName
      } else {
        specName = specItem
        _dimensionValue[name] = specName
      }
      // _dimensionValue[name] = specName
      // this.productInfo.skuList.filter(sku=>sku.dimensionValue.Color=='red').map(sku=>{
      //   console.log(sku.dimensionValue);
      // })
      let skuListSelect = false
      this.productInfo.skuList.map((sku) => {
        const { dimensionValue } = sku;
        if (
          JSON.stringify(dimensionValue) == JSON.stringify(_dimensionValue)
        ) {
          skuListSelect = true
          this.currentSelectSku = sku
          if(this.quantity>sku.stock) {
            this.quantity = sku.stock
          }else if (sku.stock&&this.quantity<=0) {
            this.quantity = 1
          }
        }
      });
      // sku列表没有
      if(!skuListSelect) {
        const skuImgObj = this.productInfo.newFilterSku.find(item=>item.dimensionValue.Color===_dimensionValue.Color)
        this.currentSelectSku = {
          dimensionValue:{..._dimensionValue},
          image:skuImgObj?skuImgObj.image:this.productInfo.mainImage,
          stock:0,
          restockRequested:true
        }
        this.quantity = 0
      }
      // 点击sku的图片切换主图显示
      this.clickSkuImg = true
      // console.log(specName);
      // console.log(this.currentSelectSku,'currentSelectSku');
      // console.log(_dimensionValue);
    },
    // 校验是否选中
    checkIsSelect(specItem,specName) {
      // 有dimensionValue说明是sku图片的校验选中
      if(specItem.dimensionValue) {
        return this.cuomputedSelectSku[specName]===specItem.dimensionValue[specName]
      } else {
        return this.cuomputedSelectSku[specName]===specItem
      }
    },
    // 校验是否可以选择
    hasCurrentSku(dimensions, name) {
      // name 规格分类的名称
      let sizeName = dimensions.name; //规格分类名称
      let flag = false;
      if (this.productInfo.dimensions.length == 1) {
        this.hasSkuList.map((hasSku) => {
          let dimension = hasSku.dimensionValue; //当前sku的规格
          // sku规格没有当前是属性 直接返回
          if (dimension[sizeName] == name) {
            flag = true;
          }
        });
      } else {
        // console.log("selectSku", this.cuomputedSelectSku);
        const dimensionValue = this.cuomputedSelectSku; //当前默认选择的sku 规格
        let allserachArr = [];
        let other = {};
        // 从有库存的sku里面查找，不查当前选择
        for (const key in dimensionValue) {
          if (key != sizeName) {
            other[key] = key;
            // console.log("当前的name", name);
            // console.log(key, sizeName);
            // console.log("dimensionValue[key]", dimensionValue[key]);
            // 从有库存的sku里面查找
            this.hasSkuList.forEach((item) => {
              if (item.dimensionValue[key] == dimensionValue[key]) {
                allserachArr.push(item.dimensionValue);
                // return item.dimensionValue;
              }
            });
            // allserachArr = allserachArr.concat(seracharr);
          }
        }
        allserachArr.map((searchDismenValue) => {
          // console.log(dimensionValue[sizeName]);
          if (searchDismenValue && searchDismenValue[sizeName] == name) {

            searchDismenValue == dimensionValue;
            let count = 0;
            for (const key in other) {
              if (searchDismenValue[key] == dimensionValue[key]) {
                count++;
              }
            }
            if (
              count == this.productInfo.dimensions.length - 1 &&
              searchDismenValue[sizeName] == name
            ) {
              flag = true;
            }
          }
        });
      }
      // console.log(flag,'name',name,sizeName);
      return flag;
    },
    // 选中但是没有库存
    selcetNosku(spec,name) {
      const stock = this.currentSelectSku.stock
      if (this.cuomputedSelectSku[spec.name] === name&&stock<=0) {
        return true
      }
    },
    getStocksShowInfo(maxNum){
        if(maxNum){
            if(maxNum <= 100 ){
                return '1-100';
            }
            if((maxNum > 100) && (maxNum <= 200) ){
                return '101-200';
            }
            if((maxNum > 200) && (maxNum <= 300) ){
                return '201-300';
            }
            if((maxNum > 300) && (maxNum <= 400) ){
                return '301-400';
            }
            if((maxNum > 400) && (maxNum <= 500) ){
                return '401-500';
            }
            if((maxNum > 500) && (maxNum <= 1000) ){
                return '501-1000';
            }
            if(maxNum > 1000){
               return '1000+'
            }
        }else {
            return '0';
        }
    },
    updateproduct(parms) {
      parms.operate==1?this.productInfo.containProduct++:this.productInfo.containProduct--
    },
    imgLoad(index) {
      const element = this.$refs[`imgSize${index}`][0];
      if(element&&(element.naturalWidth == element.naturalHeight)) {
        element.id = "square";
        if(index==0&&!this.clickSkuImg) {
          this.allImg.style.height = 320 + 'px'
        }
      }else if(index==0&&element&&(element.naturalWidth||element.naturalHeight)) {
        this.allImg.style.height = element.clientHeight + 'px'
      }else {
        this.allImgSquare = false
      }
    },
    loadSkuImg(name) {
      const element = this.$refs[name];
      if(element&&(element.naturalWidth == element.naturalHeight)) {
        element.id = "square";
        this.allImg.style.height = 320 + 'px'
      }else {
        // 解决鼠标快速切换的时候element.clientHeight = 0导致展示异常
        if(element.clientHeight) {
          this.allImg.style.height = element.clientHeight + 'px'
        }
        this.allImgSquare = false
      }
    },
    // 创建订阅成功提示
    createdSubscriptionSuccess(info) {
      var div = (
        <div class="self">
          <div class="img-box"></div>
          <div>
            <div class="title">
              <span>{info.title}</span>
            </div>
            <div class="tip">
              <span>{info.tip}</span>
            </div>
          </div>
        </div>
      );
      this.$notify({
        customClass: "seft-notify",
        dangerouslyUseHTMLString: true,
        showClose: false,
        duration: 3000,
        message: div,
      });
    },
    // notifyAvailable() {
    //   // const h = this.$createElement;
    //   if (this.isAttentionProduct) {
    //     return;
    //   } else {
    //     this.handleRecordOnLineProduct();
    //   }
    // },
    // 详情页面添加合集打开合集组件
    addCollection() {
      this.eventOpenAddPopup = true
      // if (this.productInfo.containProduct == 0) {
      //   this.handleAddDefaultproductCollection(this.productInfo);
      // } else {
      //   this.showAddToCollection = true;
      // }
    },
    // 添加到默认合集
    handleAddDefaultproductCollection(product) {
      var data, sucess, error, complete;
      data = {
        productId: product.id,
      };
      const loading = this.$loading({
        lock: true,
        text: "",
        spinner: "el-icon-loading",
        background: "rgba(51,51,51,0.25)",
      });
      sucess = () => {
        this.showAddToCollection = true;
        this.productInfo.containProduct++
      };
      error = (res) => {
        console.log(res);
        this.showAddToCollection = true;
      };
      complete = () => {
        loading.close();
      };
      addDefaultproductCollection(data, sucess, error, complete);
    },
    // 部分sku缺货订阅
    partialSKUSubscription() {
      var data, sucess, error, complete;
      data = {
        productId: this.productId,
        skuId:this.currentSelectSku.id
      };
      if(this.partialSKUSubscriptionLoading) {
        return
      }
      this.partialSKUSubscriptionLoading = true
      sucess = () => {
        this.createdSubscriptionSuccess({title:'Thanks',tip:"We'll email you if this item is back in stock."});
        this.$set(this.currentSelectSku,'restockRequested',true) // 订阅后更新数据
        const findSku = this.productInfo.skuList.find(item=>{
          if(item.id===this.currentSelectSku.id) {
            return true
          }
        })
        findSku?findSku.restockRequested = true : null
      };
      error = () => {
      };
      complete = () => {
        this.partialSKUSubscriptionLoading = false
      };
      recordOnLineProduct(data, sucess, error, complete);
    },
    // 订阅商品
    // handleRecordOnLineProduct() {
    //   var data, sucess, error, complete;
    //   data = {
    //     productId: this.productId,
    //   };
    //   sucess = () => {
    //     this.isAttentionProduct = true;
    //     this.createdSubscriptionSuccess();
    //   };
    //   error = (res) => {
    //     console.log(res);
    //   };
    //   complete = (res) => {
    //     console.log(res);
    //   };
    //   recordOnLineProduct(data, sucess, error, complete);
    // },
    // 用户有没有关注缺货sku
    
    // 是否关注商品提示
    getAttentionProduct() {
      if(this.isTourist) {
        return 
      }
      var data, sucess, error, complete;
      data = {
        id: this.productId,
      };
      sucess = (res) => {
        const { result } = res;
        this.isAttentionProduct = result;
      };
      error = (res) => {
        console.log(res);
      };
      complete = (res) => {
        console.log(res);
      };
      attentionProduct(data, sucess, error, complete);
    },
    uPproduct(parms) {
      // var index = this.products.findIndex(
      //   (item) => item.id == parms.id
      // );
      this.productInfo.containProduct = this.productInfo.containProduct - parms.number
    },
    expirationTime(item) {
      var date = transferDateFromNowDetail(item.expireT);
      // 正时间
      if (date && date.indexOf("-") == -1) {
        return date;
      }
    },
    switchImg(direction) {
      const lenght = this.productInfo.headImages&&this.productInfo.headImages.length||0;
      const areaImg = lenght-5;
      if (direction == "next") {
        if (this.activeImgIndex + 1 >= this.productInfo.headImages.length) {
          this.activeImgIndex = 0
          this.productInfo.currentImg = this.productInfo.headImages[
            this.activeImgIndex
          ];
          const element = this.$refs[`imgSize${this.activeImgIndex}`][0]
          if (element.naturalWidth == element.naturalHeight) {
            this.allImg.style.height = 320 + 'px'
          }else {
            this.allImg.style.height = element.clientHeight + 'px'
          }
          this.$refs.smaillImg.style.transform = `translateX(-${0*this.activeImgIndex}px)`
          return;
        }
        this.activeImgIndex++;
        this.productInfo.currentImg = this.productInfo.headImages[
          this.activeImgIndex
        ];
        if(this.activeImgIndex<areaImg+1) {
          this.$refs.smaillImg.style.transform = `translateX(-${66*this.activeImgIndex}px)`
        }
        // this.productInfo.headImages[]
      } else {
        if (this.activeImgIndex == 0) {
          this.activeImgIndex = this.productInfo.headImages.length - 1
          const maxValue = 66*areaImg
          console.log(maxValue,'maxValue');
          this.$nextTick(()=>{
            this.$refs.smaillImg.style.transform = `translateX(-${maxValue}px)`
          })
        }else {
          this.activeImgIndex--;
          // if(this.activeImgIndex<areaImg+1) {
          //   this.$refs.smaillImg.style.transform = `translateX(-${66*this.activeImgIndex}px)`
          // }
          if(this.activeImgIndex>areaImg) {
            return
          }
          this.$refs.smaillImg.style.transform = `translateX(-${66*this.activeImgIndex}px)`
        }
        console.log(this.$refs.smaillImg.style.transform,'prev');
      }
      const element = this.$refs[`imgSize${this.activeImgIndex}`][0]
      if (element.naturalWidth == element.naturalHeight) {
        this.allImg.style.height = 320 + 'px'
      }else {
        this.allImg.style.height = element.clientHeight + 'px'
      }
      this.setTransitonDuration(300)
      this.initTransitonDuration()()
      this.currentImgComputed()
      // this.$refs.smaillImg.style.transform = `translateX(-${66*this.activeImgIndex}px)`
    },
    // 判断元素区域是否有滚动条
    hasScrolled(el, direction = "vertical") {
      if (direction === "vertical") {
        return el.scrollHeight > el.clientHeight;
      } else if (direction === "horizontal") {
        return el.scrollWidth > el.clientWidth;
      }
    },
    backHomePage() {
      this.$router.push({path:'/'})
    },
    // 获取下载图片
    getFile(url){
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url,
          responseType: 'arraybuffer'
        }).then(data => {
          resolve(data.data)
        }).catch(error => {
          reject(error.toString())
        })
      })
    },
    // 批量下载
    async handleBatchDownload(selectImgList) {
      const loading = this.$loading({
        lock: true,
        text: "",
        spinner: "el-icon-loading",
        background: "rgba(51,51,51,0.25)",
      });
      const data = selectImgList;
      const zip = new JSZip();
      const promises = [];
      var than = this;
      // const brand = this.productInfo.brand
      // let upperCase = brand.slice(0,1).toUpperCase() + brand.slice(1)
      // const title = (upperCase+this.productInfo.title).replaceAll(' ','');
      await data.forEach((item,index) => {
        let imgUrl;
        imgUrl = item + '?time=' + Date.now();
        let promise = new Promise((resolve, reject)=>{
            this.getFile(imgUrl).then(data => { // 下载文件, 并存成ArrayBuffer对象
            const arr_name = item.split("/");
            let file_name = arr_name[arr_name.length - 1] // 获取文件名
            let dotIndex = file_name.indexOf('.');
            let suffix = file_name.slice(dotIndex);
            // 图片资源添加了查询导致无法正常打开的bug
            const indexSayHello = suffix.indexOf('?')
            if(indexSayHello!=-1) {
              suffix = suffix.slice(0,indexSayHello)
            }
            const newFileName = this.imgTitle+index+suffix
            zip.file(newFileName, data, {
              binary: true
            }) // 逐个添加文件
            // promises.push(promise)
            resolve(1)
          }).catch(res=>{
            reject(0)
            console.log(res);
          })
        })
        promises.push(promise)
      })
      // return
      Promise.all(promises).then(() => {
        zip.generateAsync({
          type: "blob"
        }).then(content => { // 生成二进制流
          FileSaver.saveAs(content, `${this.imgTitle}.zip`) // 利用file-saver保存文件
          loading.close();
          let info = {
            icon:require('@/static/copyImg@2x.png'),
            title:'Images Downloaded',
            tip:'Product images have been saved',
          }
          than.customImgCreatedSuccessInfo(info)
        })
      }).catch((res)=>{
        console.log(res);
        this.$notify({
          title: "Oops",
          message: 'Data response failed!',
          iconClass:'el-icon-warning-outline',
          duration: 3000,
          showClose: false
        });
        loading.close();
      })
    },
    // 执行下载img
    downloadImg() {
      this.handleBatchDownload(this.productInfo.headImages)
    },
    selfShareShopInfo() {
      this.shareShopInfo(this.productInfo)
      let info = {
        icon:require('@/static/union@2x.png'),
        title:'Product Info Copied',
        tip:'You can paste this when you share.',
      }
      this.customImgCreatedSuccessInfo(info)
    },
    // 展示大图
    showBigImg(url,index) {
      this.currentImg = url
      this.currentIndex = index
      this.openBigImgModule = true
    },
    // 老用户继续购买
    continueBuy() {
      this.licenseComponentVisible = false
      if(this.currentSelectSku.stock>0) {
        this.addToBag()
      } else {
        // 提示部分sku商品通知缺货
        if(!this.isSubscription) {
          this.partialSKUSubscription()
        }
      }
    },
    checkUserLicense() {
      const permitStatus = this.$store.state.user.userInfo.permitStatus
      // 已经认证成功用户/或者老用户审核 直接购买
      if(permitStatus==2||permitStatus==5) {
        if(this.currentSelectSku.stock>0) {
          this.addToBag()
        } else {
          // 提示部分sku商品通知缺货
          if(!this.isSubscription) {
            this.partialSKUSubscription()
          }
        }
        return
      }
      //新用户审核中 不可购买
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
    // 埋点
    buy_sampleBuriedPoint() {
      console.log(777, 'button埋点-----buy_sample', 'product_detail_page', this.$route.params.pv_id);
      this.$amplitude.getInstance().logEvent('click', {
        'page_code': 'product_detail_page',
        'module_code': '',
        'position_code': 'buy_sample',
        'event_target': 'button',
        'event_value': '',
        'pv_id': this.$route.params.pv_id,
        'url': window.location.href
      });
    },
    // 打开购买
    openBuySample() {
      this.buy_sampleBuriedPoint()
      const permitStatus = this.$store.state.user.userInfo.permitStatus
      // 获取用户上传资质状态
      // 新用户 0-1-2/0-1-3-1-2 //未认证>待审核>已通过 ｜ 未认证>待审核>已拒绝>待审核>已通过
      // 老用户 4-5-2/4-5-6-5-2 //未认证>待审核>已通过 ｜ 未认证>待审核>已拒绝>待审核>已通过
      // 已经认证成功用户/或者老用户审核 直接购买
      if(permitStatus==2) {
        if(this.currentSelectSku.stock>0) {
          this.addToBag()
        } else {
          // 提示部分sku商品通知缺货
          if(!this.isSubscription) {
            this.partialSKUSubscription()
          }
        }
        return
      }
      // 未认证，重新请求数据防止后台认证通过了用户还无法购买
      this.getUserInfo(true)
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
    // 添加到购物车
    addToBag() {
      var data, sucess, error, complete;
      if (this.addToBagLoading) {
        return;
      }
      this.addToBagLoading = true;
      data = {
        productId: this.productInfo.id,
        skuId: this.currentSelectSku.id,
        num: this.quantity - 0,
      };
      sucess = () => {
        let info = {
          title: "Success",
          tip: "Added to Bag",
        };
        this.createdSuccessInfo(info);
        this.$EventBus.$emit("searchCartNumber");
        // let uuId = JSON.parse(localStorage.getItem('USERINFO'))?JSON.parse(localStorage.getItem('USERINFO')).uuId:undefined;
        // let productInfoOne = this.productInfo;
        // let skuInfoOne = this.currentSelectSku;
        // this.$gtm.trackEvent({
        //   event: 'add_to_cart',
        //   userId: uuId,
        //   ecommerce: {
        //     Cstm_add_option: 'add_sample_to_bag',
        //     items: [{
        //       item_name: productInfoOne.title,
        //       item_id: productInfoOne.id,
        //       price: productInfoOne.minPriceB,
        //       item_brand: productInfoOne.brand,
        //       item_category: '',
        //       item_category2: '',
        //       item_category3: '',
        //       item_category4: '',
        //       item_variant: skuInfoOne.dimensionValue,
        //       item_list_name: '',
        //       item_list_id: '',
        //       index: 1,
        //       quantity: this.quantity
        //     }]
        //   }
        // });
      };
      error = (res) => {
        if(res.data.code==500) {
          this.preLaunchDialog = true
          this.preErrorTip = res.data.message
        }
      };
      complete = () => {
        this.addToBagLoading = false;
      };
      addShopToCart(data, sucess, error, complete);
    },
    smaillSwitchImg(index) {
      this.setTransitonDuration(300)
      const lenght = this.productInfo.headImages&&this.productInfo.headImages.length||0;
      const areaImg = lenght-5;
      this.activeImgIndex = index - 0;
      if(this.maxSmaillClick) {
        this.$refs.smaillImg.style.transform = `translateX(-${66*this.activeImgIndex}px)`
      }else if(index>=areaImg) {
        this.$refs.smaillImg.style.transform = `translateX(-${66*areaImg+6}px)`
      }
      this.initTransitonDuration()()
      this.currentImgComputed()
    },
    
    smailNext() {
      if (this.activeImgIndex + 1 >= this.productInfo.headImages.length) {
        this.activeImgIndex = 0
        this.productInfo.currentImg = this.productInfo.headImages[
          this.activeImgIndex
        ];
       
      }
      this.clickSkuImg = false
      this.activeImgIndex++;
      if(this.activeImgIndex>this.productInfo.headImages.length-5) {
        return
      }
      this.$refs.smaillImg.style.transform = `translateX(-${66*this.activeImgIndex}px)`
      this.setTransitonDuration(300)
      this.initTransitonDuration()()
    },
    smailPrev() {
      const length = this.productInfo.headImages.length;
      if (this.activeImgIndex == 0) {
        this.activeImgIndex = length - 1
      }else {
        this.activeImgIndex--;
      }
      if(this.maxSmaillClick) {
        this.$refs.smaillImg.style.transform = `translateX(-${66*this.activeImgIndex}px)`
        console.log(this.$refs.smaillImg.style.transform);
      }
      this.setTransitonDuration(300)
      this.initTransitonDuration()()
    },
    imgMoverDist() {
      const length = this.productInfo.headImages.length;
      if(length<=4) {
        this.$refs.smaillImg.style.transform = `translateX(0px)`
        return
      }
      const domTransfrom = this.$refs.smaillImg.style.transform.toString();
      const oldDistIndex = domTransfrom.indexOf('(');
      let oldValue = domTransfrom.slice(oldDistIndex+1, domTransfrom.length-1).replace('px','') - 0;
      const areaImg = length-5;
      const maxVaule = 66*areaImg;
      // oldValue = Math.abs(oldValue);
      const absValue = Math.abs(oldValue);
      let index = Math.ceil(absValue/66);
      if(oldValue>0) {
        if(this.activeImgIndex>0) {
          this.activeImgIndex--
        }
        this.$refs.smaillImg.style.transform = `translateX(0px)`
        return
      }else if(oldValue<-maxVaule) {
        if(this.activeImgIndex>=areaImg&&this.activeImgIndex<length-1) {
          this.activeImgIndex++
        }
        // else if(this.activeImgIndex==length-1) {
          
        // }
        else {
          this.activeImgIndex = areaImg
        }
        this.$refs.smaillImg.style.transform = `translateX(-${maxVaule+6}px)`
        return
      }else{
        this.$refs.smaillImg.style.transform = `translateX(-${66*index}px)`
      }
      if(index >= length-4) {
        this.activeImgIndex = length-4;
        return
      }else if(index>length-4) {
        ++index
      }
      this.activeImgIndex = index;
    },
    smaillImgMousedown(e) {
      this.smaillIsClickMove = true;
      this.smaillIsClickEvnet = e
      let oldDistIndex,oldValue;
      const domTransfrom = this.$refs.smaillImg.style.transform.toString();
      oldDistIndex = domTransfrom.indexOf('(')
      oldValue = domTransfrom.slice(oldDistIndex+1, domTransfrom.length-1).replace('px','') - 0
      this.$refs.smaillImg.oldTransformValue = oldValue;
      this.stopClick = false;
    },
    // 鼠标抬起
    smaillImgMouseup() {
      this.smaillIsClickMove = false;
      // let oldDistIndex, oldValue;
      // const domTransfrom = this.$refs.smaillImg.style.transform.toString();
      // oldDistIndex = domTransfrom.indexOf('(')
      // oldValue = domTransfrom.slice(oldDistIndex+1, domTransfrom.length-1).replace('px','') - 0
      // const lenght = this.productInfo.headImages&&this.productInfo.headImages.length||0;
      // const areaImg = lenght-5;
      // const maxVaule = 66*areaImg
      // if(oldValue>0) {
      //   this.$refs.smaillImg.style.transform = `translateX(0px)`
      // }else if(oldValue<-maxVaule) {
      //   this.$refs.smaillImg.style.transform = `translateX(-${maxVaule}px)`
      // }
      if(this.stopClick) {
        this.setTransitonDuration(300)
        this.initTransitonDuration()()
        this.imgMoverDist()
      }
    },
    setTransitonDuration(date){
      this.clickSkuImg = false
      this.$refs.smaillImg.style.transitionDuration=`${date}ms`
    },
    initTransitonDuration() {
      let flag = null;
      return ()=>{
        if(flag) {
          return
        }
        flag = setTimeout(() => {
          this.$refs.smaillImg.style.transitionDuration='0ms'
          flag = null;
        },300)
      }
      
    },
    // 鼠标移开
    smaillImgMouseleave() {
      // console.log(e.target);
      this.smaillIsClickMove = false;
      let oldDistIndex,oldValue;
      const domTransfrom = this.$refs.smaillImg.style.transform.toString();
      oldDistIndex = domTransfrom.indexOf('(')
      oldValue = domTransfrom.slice(oldDistIndex+1, domTransfrom.length-1).replace('px','') - 0
      const lenght = this.productInfo.headImages&&this.productInfo.headImages.length||0;
      const areaImg = lenght-4;
      const maxVaule = 66*areaImg
      if(oldValue>0) {
        this.$refs.smaillImg.style.transform = `translateX(0px)`
        // this.$refs.smaillImg.style.transitionDuration='300ms'
      }else if(oldValue<-maxVaule) {
        this.$refs.smaillImg.style.transform = `translateX(-${maxVaule}px)`
      }
      if(this.stopClick) {
        this.setTransitonDuration(300)
        this.initTransitonDuration()()
        this.imgMoverDist()
      }
    },
    parentClick(e) {
      if(this.stopClick) {
        this.stopClick = false;
        return
      }
      if(e.target.className.indexOf('smaill-img-single')!=-1) {
        const index = e.target.dataset.index
        this.smaillSwitchImg(index)
      }
    
    },
    // 鼠标移动
    smaillImgMousemove(event) {
      if (!this.smaillIsClickMove) return; // 只有当state == 1时候才允许执行该事件
      const domTransfrom = this.$refs.smaillImg.style.transform.toString();
      const direction = this.smaillIsClickEvnet.pageX>event.pageX?'left':'right';
      let moverDist,oldDistIndex,oldValue;
      oldDistIndex = domTransfrom.indexOf('(')
      if(this.$refs.smaillImg.oldTransformValue||this.$refs.smaillImg.oldTransformValue==0) {
        oldValue = this.$refs.smaillImg.oldTransformValue - 0
      }else {
        oldValue = domTransfrom.slice(oldDistIndex+1, domTransfrom.length-1).replace('px','') - 0
      }
      if(direction=='right') {
        moverDist = event.pageX - this.smaillIsClickEvnet.pageX - 0
        this.$refs.smaillImg.style.transform = `translateX(${oldValue+moverDist}px)`
      }else {
        moverDist = this.smaillIsClickEvnet.pageX - event.pageX - 0
        this.$refs.smaillImg.style.transform = `translateX(${oldValue-moverDist}px)`
      }
      if(Math.abs(moverDist)>2) {
        this.stopClick = true;
      }
    },
    // 大图更新图片
    updataImg(index) {
      this.setTransitonDuration(300)
      this.initTransitonDuration()()
      this.activeImgIndex = index;
      const length = this.productInfo.headImages.length;
      const areaImg = this.productInfo.headImages.length-5;
      if(index<areaImg) {
        this.$refs.smaillImg.style.transform = `translateX(-${66*index}px)`
      }else if(index<=length-1) {
        this.$nextTick(()=>{
          this.$refs.smaillImg.style.transform = `translateX(-${66*areaImg+6}px)`
        })
      }
    },
    //配送时间
    filterDeliveryRemark(goodsInfo) {
      let deliveryRemark = '';
      if(goodsInfo.forwardSell === 1){
          deliveryRemark = `Expect to Ship by ${transFormTimeToLocalDate(goodsInfo.forwardSellTime)}`;
      }else {
          deliveryRemark = goodsInfo.deliveryRemark;
      }
      return deliveryRemark
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
    loginHandle() {
      localStorage.setItem('ACTIVITYURL', window.location.href);
      const {href} = this.$router.resolve({ path: `/login`});
      window.open(href,'_blank')
    },
    // 游客模式鼠标放到锁上
    hoveLock(name,flag) {
      this.tourist[name] = flag
    },
    updateProductStore(params) {
      params.product.isAdd = 1
    },
    cartEvent(type) {
      // if(this.quantity>=2) {
      //   return
      // }
      let data, sucess, error, complete;
      data = {
        "num": type=='up'?this.quantity+1:this.quantity,
        "productId": this.productId,
        "skuId": this.currentSelectSku.id
      };
      sucess=()=>{
        this.showCartEventMousemove = false
        this.cartEventLoading = false
        this.completeEventSwitch = true
        this.showCartEventMousemoveMessage = ''
        if ((this.quantity >= this.currentSelectSku.stock)||(type!='up')) {
          return;
        }
        this.quantity++;
      }
      error=(res)=>{
        if(res.data.code===500) {
          this.showCartEventMousemove = true
          this.showCartEventMousemoveMessage = res.data.message
        }
        this.cartEventLoading = false
        this.completeEventSwitch = true
        console.log(res);
      }
      complete=()=>{
      }
      if(!this.cartEventLoading&&!this.completeEventSwitch) {
        this.cartEventLoading = true
        cartEvent(data,sucess,error,complete)
      }else if(((!this.cartEventLoading)&&type==='up')&&!this.showCartEventMousemove) {
        this.cartEventLoading = true
        cartEvent(data,sucess,error,complete)
      }
    },
    quantityHandle(type) {
      // 预发布商品判断
      if(this.productInfo.tagType==6&&type==='up') {
        this.cartEvent(type)
      }else {
        if (type === "up") {
          if (this.quantity >= this.currentSelectSku.stock) {
            return;
          }
          this.quantity++;
        } else {
          if (this.quantity <= 1) {
            return;
          }
          this.quantity--;
        }
      }
    },
    // 鼠标悬浮sku图片切换主图 _dimensionValue传进来的sku的dimensionValue
    mouseoverSkuImg(src,_dimensionValue,name) {
      const dimensionValue = {...this.cuomputedSelectSku}
      dimensionValue[name] = _dimensionValue[name]
      this.hoverSkuImg = true
      this.hoveSkuImage = src
      this.hoverSkuInfo = {...dimensionValue}
      this.tempSkuSpec(this.hoverSkuInfo)
    },
    // 临时展示规格售卖数量
    tempSkuSpec(hoverSkuInfo) {
      const findSkuSpec = this.productInfo.skuList.find(sku=>{
        const { dimensionValue } = sku;
        return JSON.stringify(dimensionValue) == JSON.stringify(hoverSkuInfo)
      })
      if(findSkuSpec) {
        this.hoverSkuInfo.stock = findSkuSpec.stock
        this.hoverSkuInfo.inventory = this.getStocksShowInfo(findSkuSpec.stock)
      }else {
        this.hoverSkuInfo.inventory = this.getStocksShowInfo(0)
      }
    },
    mouseleaveSkuImg() {
      this.hoverSkuImg = false
      this.currentImgComputed()
    },
    mouseleaveSpec() {
      this.hoverSkuSpec = false
    },
    mouseoverSpec(value,name) {
      const dimensionValue = {...this.cuomputedSelectSku}
      dimensionValue[name] = value
      this.hoverSkuSpec = true
      this.hoverSkuInfo = {...dimensionValue}
      this.tempSkuSpec(this.hoverSkuInfo)
    },
    // 展示当前图片对图片进行判断正方形和长方形来设置容器高度
    currentImgComputed() {
      let currentImg = this.allImg.querySelectorAll('.current-img')
      this.$nextTick(()=>{
        Array.from(currentImg).forEach((item)=>{
          if(item.dataset.active=='true') {
            if(item.naturalWidth==0) {
              return
            }
            if(item.naturalWidth == item.naturalHeight) {
              item.id = "square";
              this.allImg.style.height = 320 + 'px'
            }else {
              item.removeAttribute('id')
              this.allImg.style.height = item.clientHeight + 'px'
            }
          }
        })
      })
    },
    quantityPreLaunch() {
      if(this.productInfo.tagType==6&&!this.isTourist) {
        this.cartEvent()
      }
    },
    jumpUrl(i,id) {
      const list = Object.values(this.computedDetailRouter).map(name=>name&&name.trim())
      list.length = i + 1
      // this.openWatchPushState = true
      let _params = {
        name:list[0],
        name2:list[1],
        name3:list[2],
      }
      for (const key in _params) {
        if (Object.hasOwnProperty.call(_params, key)) {
          const value = _params[key];
          if(!value) {
            delete _params[key]
          }
        }
      }
      const ClassifyMoreName = 'ClassifyMore' + (Object.keys(_params).length==1?'':Object.keys(_params).length)
      let currentUrl=[],currentIds=[]
      for (const key in this.computedDetailRouter) {
        if (Object.hasOwnProperty.call(this.computedDetailRouter, key)) {
          const name = this.computedDetailRouter[key];
          currentUrl.push(name.trim())
          currentIds.push(key)
        }
      }
      currentUrl = currentUrl.splice(0,i+1)
      currentIds = currentIds.splice(0,i+1)
      let tempObj = {};
      currentIds.forEach((id,i)=>{
        tempObj[id]=currentUrl[i]
      })
      this.$router.push({
        name:ClassifyMoreName,
        params:_params,query:{classifyId:id,selectClassifyId:id, classifyInfo:JSON.stringify(tempObj)}
      })
      
    }
    
  },
};
</script>

<style lang="less">
.products-detail {
  // max-width: 1320px;
  // margin: 0 auto;
  // position: relative;
  // height: 100%;
  // max-height: 820px;
  // margin-top: 40px;
  box-sizing: border-box;
  // padding-left: 48px;
  // margin-bottom: 40px;
  overflow: auto;
  // height: 100%;
  // display: flex;
  .products-detail-container {
    max-width: 1320px;
    margin: 0 auto;
    position: relative;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  &.isTourist {
    // padding-left: 132px;
  }
  .detail-info {
    // position: relative;
    overflow: auto;
    padding-right: 40px;
    padding-bottom: 90px;
    display: flex;
    flex: 1;
    position: relative;
    top: -20px;
    padding-top: 20px;
    // height: 520px;
    flex-direction: column;
    // width: 596px;
    // min-width: 596px;
    .detail-info-centre {
      // height: calc(100% - 90px);
      // padding-top: 58px;
      display: flex;
      flex-direction: column;
      // flex: 1;
      @media (max-height: 680px)  {
        & {
          display: initial;
          overflow: auto;
        }
      }
      // padding-bottom: 20px;
      // overflow: auto;
      // max-width: 590px;
      min-width: 590px;
      flex: 1;
      // &::-webkit-scrollbar {
      //   display: none;
      // }
    }
    .info-brand-title {
      flex-shrink: 0;
      // overflow: hidden;
      // text-overflow: ellipsis;
      // white-space: nowrap;
      font-weight: bold;
      font-size: 24px;
      color: #333333;
      line-height: 28px;
      margin-bottom: 8px;
    }
    .min-crossed-price {
      font-size: 14px;
      // height: 200px;
      text-decoration-line: line-through;
      margin-bottom: 16px;
      line-height: 22px;
      color: #929292;
    }
  }
  .detail-router-info {
    width: 100%;
    flex-shrink: 0;
    display: flex;
    align-content: center;
    margin: 24px 0 16px;
    line-height: 18px;
    .computed {
      margin-left: .3em;
    }
    span {
      &:hover {
        text-decoration: underline;
      }
      cursor: pointer;
      font-weight: 400;
      font-size: 14px;
      display: inline-block;
      line-height: 18px;
    }
  }
  .detail-main-img {
    // padding-top: 40px;
    font-size: 0;
    margin-right: 48px;
    
    .back-img {
      height: 24px;
      margin-bottom: 16px;
      display: flex;
      .back-text {
        cursor: pointer;
        &:hover {
          display: inline;
        }
        padding-left: 8px;
        font-weight: 600;
        font-size: 18px;
        color: #000;
        display: none;
      }
      .seft-back-img-container {
        position: relative;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        cursor: pointer;
        justify-content: center;
        &:hover {
          background: rgba(51, 51, 51, 0.2);
        }
        &:hover + .back-text {
          display: inline;
        }

        font-size: 0;
        background: rgba(51, 51, 51, 0.1);
        border-radius: 50%;
        img {
          cursor: pointer;
          margin-right: 2px;
          margin-bottom: 1px;
          width: 7px;
          height: 11px;
        }
      }
    }
    .detail-img {
      width: 320px;
      position: relative;
      font-size: 0;
      // &:hover .left-direction {
      //   display: flex !important;
      // }
      // &:hover .right-direction {
      //   display: flex !important;
      // }
      // &:hover .img-number-position {
      //   display: flex !important;
      // }
      &:hover .collect {
        display: flex !important;
      }
      .img-container {
        &.allImgSquare {
          .all-img {
            height: 320px;
          }
        }
        position: relative;
        display: flex;
        overflow: hidden;
        width: 320px;
        height: 480px;
        .all-img {
          position: relative;
          top: 50%;
          transform: translateY(-50%);
          width: 100%;
          display: flex;
          align-items: center;
          max-height: 480px;
          .showicon {
            display: block !important;
          }
          .jit-new-tag {
            position: absolute;
            left: 0;
            top: 17px;
            z-index: 2;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 0px 10px 10px 0px;
            padding: 7px 15px 7px 10px;
            .text {
              font-weight: 600;
              font-size: 14px;
              line-height: 12px;
              color: #C79818;
            }
          }
          .self-tag-box {
            position: absolute;
            cursor: default;
            display: flex;
            align-items: center;
            top: 12px;
            left: 12px;
            z-index: 2;
            border-radius: 20px;
            max-width: 32px;
            overflow: hidden;
            transition: all .3s;
            &:hover {
              background: #fff;
              max-width: 120px;
              transition: max-width .3s;
              padding-right: 10px;
            } 
            &:hover .self-tag-text{
              opacity: 1;
            }
            .self-tag-text {
              font-size: 14px;
              color: #000000;
              font-weight: 400;
              opacity: 0;
              white-space: nowrap;
            }
            .self-tag {
              width: 32px;
              height: 32px;
            }
          }
        }
        // 商品标签样式
        .goods-tag-bk {
          position: absolute;
          z-index: 20;
          bottom: 22px;
          left: 56px;
          // transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          width: 208px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          border-radius: 6px;
        }
        .goods-time {
          font-weight: bold;
          color: #333;
          span {
            font-size: 18px;
          }
        }
        .goods-sold-out {
          font-weight: 600;
          color: #fff;
          background: rgba(51, 51, 51, 0.6);
          span {
            font-size: 18px;
          }
        }
        .goods-coming-soon {
          font-weight: 700;
          span {
            font-size: 18px;
          }
        }
        .goods-pre-sale {
          font-weight: 700;
          span {
            font-size: 18px;
            color: #333;
          }
        }
      }
      #square {
        top: 50%;
        transform: translateY(-50%);
        height: auto;
      }
      .current-img {
        cursor: pointer;
        &.active {
          z-index: 1;
          opacity: 1;
          transition: opacity 0.6s;
        }
        &.sku-img {
          z-index: 2;
          opacity: 1;
          transition: opacity 0.6s;
        }
        &.hovesku-img {
          z-index: 3;
          opacity: 1;
          transition: opacity 0.6s;
        }
        // object-fit: contain;
        z-index: 0;
        opacity: 0;
        position: absolute;
        width: 320px;
        // height: 480px;
        max-height: 480px;
        border-radius: 20px;
      }
      .collect {
        right: 16px;
        top: 16px;
        position: absolute;
        width: 40px;
        height: 40px;
        z-index: 8;
        &.nohover {
          cursor: initial;
        }
        &.nocollect,&.sisAdd {
          right: 57px;
        }
        &.isAdd {
          right: 99px;
        }
        cursor: pointer;
        border-radius: 50%;
        display: none;
        justify-content: center;
        align-items: center;
        img {
          display: block;
          height: 15px;
          // width: 7.5px;
        }
        &.secondDisplay {
          display: flex !important;
        }
        &.left-direction {
          background: rgba(51, 51, 51, 0.1);
          transform: translateY(-50%);
          top: 50%;
          left: -16px;
          display: none;
          &:hover {
            background: rgba(51, 51, 51, 0.2);
          }
          &:active {
            background: rgba(51, 51, 51, 0.3);
          }
        }
        &.right-direction {
          background: rgba(51, 51, 51, 0.1);
          transform: translateY(-50%);
          top: 50%;
          right: -16px;
          display: none;
          &:hover {
            background: rgba(51, 51, 51, 0.2);
          }
          &:active {
            background: rgba(51, 51, 51, 0.3);
          }
        }
      }
      .img-number-position {
        position: absolute;
        z-index: 20;
        right: 8px;
        bottom: 19px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        // border-radius: 10px;
        backdrop-filter: blur(25px);
        background: #fff;
        background: rgba(255, 255, 255, 0.7);
        font-size: 12px;
        color: #333;
        display: flex;
        justify-content: center;
        align-items: center;
        // &.secondDisplay {
        //   display: flex !important;
        // }
      }
    }
    .smaill-img-box {
      position: relative;
      margin-top: 8px;
      width: 320px;
      &:hover .img-handle{
        display: flex !important;
      }
      .smaill-img-container {
        overflow: hidden;
        position: relative;
        cursor: pointer;
        & div {
          // transform: translateX(0);
          transition-duration: 0ms;
          display: flex;
          // transition: transform 0.3s ease;
        }
        .smaill-img-single {
          position: relative;
          margin-right: 6px;
          &::before {
            content: '';
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            border: 1px solid #C79818;
            box-sizing: border-box;
            border-radius: 5px;
          }
          &:hover {
            &::before {
              content: '';
              display: block;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 1;
              border: 1px solid #C79818;
              box-sizing: border-box;
              border-radius: 5px;
            }
          }
          &.active {
            &::before {
              display: block;
              border: 2px solid #C79818;
            }
          }
        }
        img {
          display: block;
          width: 60px;
          height: 90px;
          border-radius: 5px;
          cursor: pointer;
          object-fit: cover;
          // &.active {
          //   opacity: 0.3;
          // }
        }
      }
      .img-handle {
        display:none;
        position: absolute;
        z-index: 2;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.1);
        cursor: pointer;
        &:hover  {
          display: flex;
        }
        img {
          display: block;
          height: 15px;
        }
        &.prev-img {
          left: 0;
          top: 50%;
          transform: translate(-50%, -50%);
        }
        &.next-img {
          right: 0;
          top: 50%;
          transform: translate(50%, -50%);
        }
      }
    }
    .img-download-info-copy {
      display: flex;
      justify-content: center;
      margin-top: 16px;
      @media (max-height: 720px) {
        margin-top: 10px;
      }
      .img-download {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        &>div:nth-child(1) {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
        }
        img {
          width: 14.86px;
          height: 18px;
        }
        .text {
          margin-top: 4px;
          font-size: 14px;
          line-height: 22px;
          text-align: center;
          color: #333333;
        }
      }
      .info-copy {
        cursor: pointer;
        margin-left: 42px;
        &>div:nth-child(1) {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
        }
         img {
          width: 14.86px;
          height: 18px;
        }
        .text {
          margin-top: 4px;
          font-size: 14px;
          line-height: 22px;
          text-align: center;
          color: #333333;
        }
      }
    }
  }
  .price-container {
    padding-top: 24px;
    display: flex;
    .customer-price {
      margin-right: 16px;
      box-sizing: border-box;
      // height: 106px;
      width: 186px;
      display: flex;
      flex-direction: column;
      &>div {
        display:flex;
        height: 20px;
        // align-items: center;
      }
      .amount {
        color: #c79618;
      }
    }
    .lock-img-box {
      position: relative;
      padding-left: 17px;
      border-left: 4px solid #eeeeee;
    }
    .lock-img {
      height: 16px;
      cursor: pointer;
      &:hover + .tourist-lock-tip {
        display: block;
      }
      &.nohover {
        cursor: unset;
      }
    }
    .tourist-lock-tip {
      cursor: pointer;
      display: none;
      box-sizing: border-box;
      position: absolute;
      padding: 11px 14px;
      border-radius: 8px;
      border-bottom-left-radius: 0;
      z-index: 3;
      width: 180px;
      height: 60px;
      // left: 10px;
      top: -70px;
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
        left: 0;
      }
      &::before {
        position: absolute;
        content: '';
        display: block;
        z-index: 2;
        bottom: -6px;
        left: 0;
        border-width: 6px;
        border-style: solid dashed dashed dashed;
        border-color: #C79818 transparent transparent #C79818
      }
    }
    .amount {
      font-weight: bold;
      margin-right: 8px;
      font-size: 14px;
      border-left: 4px solid #eeeeee;
      padding-left: 17px;
    }
    .amount-msrp {
      font-size: 14px;
      // line-height: 22px;
      text-decoration-line: line-through;
      color: #929292;
      font-weight: normal;
      margin-left: 16px;
      margin-right: 4px;
    }
    .msrp {
      font-size: 14px;
      font-weight: normal;
      // line-height: 22px;
      color: #929292;
    }
    .amount-name {
      font-weight: 500;
      font-size: 14px;
      padding-left: 17px;
      color: #333;
      border-left: 4px solid #eeeeee;
    }
    .tip {
      margin-top: 9px;
      font-size: 12px;
      color: #979797;
      padding-left: 25px;
    }
    .trendsist-price {
      display: flex;
      margin-right: 16px;
      box-sizing: border-box;
      flex-direction: column;
      // height: 106px;
      width: 186px;
      .amount {
        color: #333;
      }
      .lock-img {
        height: 16px;
        cursor: pointer;
      }
    }
    .earn-price {
      display: flex;
      // margin-right: 16px;
      box-sizing: border-box;
      flex-direction: column;
      // height: 106px;
      width: 186px;
      .amount {
        color: #333;
      }
      .lock-img-box {
        height: 20px;
      }
    }
  }
  .shipping-time {
    display: flex;
    padding-top: 23px;
    // padding-bottom: 16px;
    padding-left: 9px;
    & > div {
      box-sizing: border-box;
      min-height: 116px;
      &:nth-child(1) {
        width: 158px;
        margin-right: 45px;
      }
      &:nth-child(2) {
        width: 174px;
        margin-right: 29px;
      }
      display: flex;
      flex-direction: column;
      // width: 186px;
      padding-left: 16px;
      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
      }
      .shipping-time-title {
        margin: 8px 0;
        font-weight: bold;
        font-size: 18px;
        color: #333;
      }
      .shipping-time-date {
        margin-top: 16px;
        font-weight: normal;
        font-size: 12px;
        line-height: 18px;
        color: #333;
        // word-break: break-all;
        &.shipping-delay {
          min-width: 177px;
          color: #F363A0;
          a {
            font-size: 12px;
            margin-left: 5px;
            color: #333;
            text-decoration: underline;
          }
        }
        .return {
          color: #333;
          font-size: 12px;
          text-decoration: underline;
          // color: #167DFB;
        }
      }
    }
  }
  .product-sku {
    max-width: 616px;
    .select-spec {
      .single-select {
        margin-top: 24px;
        .single-select-name {
          font-weight: 500;
          font-size: 14px;
          color: #333;
        }
        .single-select-item {
          display: flex;
          flex-wrap: wrap;
          &.color {

          }
          .select-spec-item {
            margin-top: 8px;
            overflow: hidden;
            &.has-selcet {
              background: #EEEEEE;
              color: #333;
              &::before {
                display: none;
              }
            }
            &:hover:after {
              display: block;
              border: 1px solid #C79818;
              content: '';
              position: absolute;
              display: block;
              top: 0;
              border-radius: 20px;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 1;
            }
            &.select {
              background: #333333;
              color: #fff;
              &::before {
                display: none;
              }
              &::after {
                display: none;
              }
            }
            &.selcet-nosku {
              background: #F9F9F9;
              color: #D3D3D3;
              &::after {
                display: block;
                border: 2px solid #C79818;
                content: '';
                position: absolute;
                display: block;
                top: 0;
                border-radius: 20px;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1;
              }
              &::before {
                display: block;
              }
            }
            background: #F9F9F9;
            font-weight: 500;
            font-size: 14px;
            cursor: pointer;
            margin-right: 16px;
            padding: 7px 16px;
            border-radius: 20px;
            position: relative;
            color: #D3D3D3;
            &::before {
              content: '';
              position: absolute;
              display: block;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              // transform: translate(-50%) rotate(-45deg);
              // background: #D3D3D3;
              background: linear-gradient(
                to top left,
                transparent calc(50% - 1px),
                #D3D3D3,
                transparent calc(50% + 1px)
              );
            }
          }
        }
      }
    }
    .select-img-list {
      display: flex;
      flex-wrap: wrap;
      .select-img {
        cursor: pointer;
        margin-right: 8px;
        margin-top: 8px;
        // opacity: .2;
        &:hover {
          position: relative;
          &::before {
            content: '';
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            border: 1px solid #C79818;
            box-sizing: border-box;
            border-radius: 5px;
          }
        }
        &.select {
          position: relative;
          img {
            opacity: 1;
          }
          &::before {
            content: '';
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 1;
            border: 2px solid #C79818;
            box-sizing: border-box;
            border-radius: 5px;
          }
        }
        &.has-selcet {
          img {
            opacity: 1;
          }
        }
        &.selcet-nosku {
          img {
            opacity: .2;
          }
        }
        img {
          opacity: .2;
          display: block;
          object-fit: cover;
          width: 40px;
          height: 60px;
          border-radius: 5px;
        }
      }
      
    }
    .select-quantity {
      margin-top: 24px;
      .name {
        font-weight: 500;
        font-size: 14px;
        line-height: 150%;
        color: #333333;
        margin-bottom: 8px;
        .restocking {
          color: #C79818;
        }
      }
      .input-number {
        display: flex;
        position: relative;
        width: 86px;
        height: 32px;
        background: #EEEEEE;
        border-radius: 8px;
        align-items: center;
        &.disable {
          .shop-numbers {
            color: #979797;
          }
        }
        // &:hover .quantity-icon{
        //   background: #EEEEEE;
        // }
        // .circle {
        //   font-size: 20px;
        //   color: #333;
        //   cursor: pointer;
        //   &.disable {
        //     color: #979797;
        //     cursor: initial;
        //   }
        // }
        .shop-numbers {
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
          text-align: center;
          color: #333333;
          margin: 0 20px;
        }
        .quantity {
          box-sizing: border-box;
          width: 100%;
          height: 32px;
          background: #ffffff;
          border-radius: 8px;
          border: 0;
          outline: none;
          padding-left: 27px;
          &.surpass {
            color: #f84240;
          }
        }
        .quantity-icon {
          position: absolute;
          // background: #EEEEEE;
          font-weight: bolder;
          width: 20px;
          height: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          right: 6px;
          cursor: pointer;
          color: #333;
          font-weight: border;
          &.el-icon-arrow-up {
            top: 3px;
            &.disable {
              cursor: inherit;
              color: #979797;
            }
          }
          &.el-icon-arrow-down {
            bottom: 3px;
            &.disable {
              cursor: inherit;
              color: #979797;
            }
          }
        }
      }
    }
  }
  .description {
    overflow: auto;
    // height:251px;
    ul,
    ol {
      padding-left: 20px;
      li {
        list-style: initial;
      }
    }
    ol {
      list-style: decimal;
    }
    ul {
      list-style: disc;
    }
  }
  .product-details {
    margin: 32px 0 16px;
    font-weight: bold;
    font-size: 18px;
    line-height: 28px;
    color: #333333;
  }
  .pre-launch {
    font-weight: normal;
    margin-top: 12px;
    background: #FFEECE;
    border-radius: 8px;
    padding: 10px;
    font-size: 12px;
    line-height: 22px;
    .tagEndDate {
      color: #C79818;
      font-weight: 700;
    }
  }
  .brand-info-container {
    padding-top: 14px;
    display: flex;
    margin-bottom: -20px;
    .brand-info {
        background: #F9F9F9;
        height: 32px;display:flex;
        align-items: center;
        padding:0 18px 0 5px;
        border-radius: 20px;
        margin-bottom: 10px;
        img {
          width: 24px;
          height: 24px;
        }
      }
  }
  
  .event-box {
    position: fixed;
    width: 596px;
    bottom: 0;
    z-index: 10;
    padding: 16px 0 24px;
    flex-shrink: 0;
    box-sizing: border-box;
    // padding-left: 17px;
    border-top: 1px solid #eeeeee;
    background: #fff;
    // &.detailScroll {
    //   border-top: 1px solid #eeeeee;
    //   background: #fff;
    // }
    display: flex;
    font-weight: 500;
    height: 90px;
    font-size: 14px;
    opacity: 1;
    // align-items: center;
    color: #fff;
    transition: all 0.3s;
    .buy-sample {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      margin-right: 35px;
      background: #333;
      padding: 0 28px;
      margin-right: 16px;
      height: 40px;
      line-height: 40px;
      border-radius: 20px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
      &.notify {
        padding: 0 28px;
        margin-right: 16px;
        height: 40px;
        line-height: 40px;
        // border: 1px solid #333333;
        background: #333;
        border-radius: 20px;
        margin-right: 24px;
        &.disable {
          opacity: .1;
          cursor: inherit;
        }
        span {
          color: #fff;
          line-height: inherit;
          font-size: 16px;
          font-weight: 500;
          text-decoration: none !important
        }
      }
      &:hover {
        opacity: .8;
        span {
          text-decoration: underline;
        }
      }
      img {
        display: block;
        height: 18px;
        width: 16.7px;
      }
      span {
        color: #fff;
        line-height: inherit;
        font-size: 16px;
        font-weight: 500;
        text-decoration: none !important
      }
    }
    .shop-add-collection {
      &:hover {
        opacity: 0.6;
      }
      &:active {
        opacity: 0.8;
      }
      cursor: pointer;
      width: 150px;
      height: 40px;
      line-height: 40px;
      background: #333333;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
      border-radius: 20px;
      text-align: center;
      span {
        font-size: 16px;
        font-weight: 500;
      }
    }
    .shop-share {
      margin-left: 32px;
      order: 9;
      cursor: pointer;
      width: 85px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      span {
        color: #333333;
        font-size: 16px;
        font-weight: 500;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    .shop-add-collection {
      background: #c79818;
      box-shadow: 0px 4px 10px rgba(118, 85, 0, 0.2);
    }
    .notify-available,.istourist-login {
      &.active {
        cursor: initial;
        opacity: 0.1;
        &:hover {
          opacity: .1;
        }
      }
      &:hover {
        opacity: 0.6;
      }
      &:active {
        opacity: 0.8;
      }
      &.istourist-login  {
        width: 286px;
      }
      cursor: pointer;
      width: 248px;
      height: 40px;
      line-height: 40px;
      margin-right: 16px;
      background: #333333;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
      border-radius: 20px;
      text-align: center;
    }
  }
  .pre-launch-dialog {
    .el-dialog {
      width: 300px;
      margin-top:0 !important;
      transform: translateY(-50%);
      .el-dialog__title {

      }
      .el-dialog__body {
        padding-top: 16px;
        padding-bottom: 24px;
        text-align: center;
      }
    }
  }
}

.seft-notify {
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
}
.unselect  {
  -webkit-user-select: none; 
  -moz-user-select: none;    
  -khtml-user-select: none;  
  -ms-user-select: none;    

  /* 以下两个属性目前并未支持，写在这里为了减少风险 */
  -o-user-select: none;
  user-select: none; 
}
.filter-showCart-event-mousemove {
  max-width: 340px;
}
</style>