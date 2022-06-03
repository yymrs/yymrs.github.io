<template>
  <div class="export-to-shopify-singel">
    <el-dialog
      title="提示"
      custom-class="add-to-shopify"
      :show-close="false"
      :visible.sync="nextDialogVisible"
      :modal-append-to-body="single"
      :before-close="handleClose"
    >
      <div slot="title" class="add-to-shopify-title">
        <span class="name">Add to Shopify</span>
        <span class="close" @click="closeCollection($event, 'dialogVisible')">
          <img src="../../../static/modelClose@2x.png" alt="" />
        </span>
      </div>
      <div class="sel-shopify-name">
        <div class="tip">Choose a store</div>
        <div class="shopify-name-list">
          <div
            class="single"
            v-for="shopify in shopifyNameList"
            :key="shopify.id"
          >
            <div class="name">{{ shopify.domain }}</div>
            <div class="input-box" @click="seShopifyNameID(shopify)">
              <!-- <el-radio v-model="currentSelName" :label="i.id"></el-radio> -->
              <input
                :id="'radio' + shopify.id"
                type="radio"
                name="item"
                v-model="currentSelID"
                :value="shopify.id"
              />
              <label :for="'radio' + shopify.id"></label>
            </div>
          </div>
        </div>
        <div class="continue-box">
          <div class="continue-btn" v-elementEvent @click="nextContinue">
            Continue
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 下一步 -->
    <el-dialog
      class="productBox"
      width="704px"
      title="Add to Shopify"
      :class="{ more: !single }"
      custom-class="next-add-to-shopify"
      center
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleClose2"
      :modal-append-to-body="false"
    >
      <div
        style="
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
          margin-top: -16px;
        "
      >
        <span
          style="
            font-weight: bold;
            color: black;
            text-align: center;
            margin-right: 6px;
          "
          >{{shopTotal}}</span
        ><span>{{single?'Item':'Items'}}</span>
      </div>
      <div class="sel-shopify-info">
        <div class="shopify-name-box" ref="shopify_name_box">
          <el-select
            popper-class="se-shopify"
            id="sebox"
            v-model="currentSelStoreId"
            placeholder="Select Shopify"
            @visible-change="productTypeShowsebox"
            no-data-text="No Data"
          >
            <el-option
              v-for="item in shopifyNameList"
              :key="item.storeId"
              :label="item.domain"
              :value="item.storeId"
            >
            </el-option>
          </el-select>
        </div>
        <div class="shopify-collection-name shopify-collectionBox">
          <span class="title">Shopify Collection:</span>
          <el-select
            stlye="appearance: none;padding-left:50px"
            class="inputBox box2"
            id="box2"
            popper-class="shopify-seft-sel"
            v-model="defaultShopName"
            @visible-change="productTypeShowbox2"
            no-data-text="No Data"
            placeholder="Select"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.title"
              :disabled="!item.isCustom"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="sel-shopify-info">
        <div class="shopify-collection-name shopify-collectionBox">
          <span class="title">Status:</span>
          <el-select
            stlye="appearance: none;"
            class="inputBox box3"
            id="box3"
            popper-class="shopify-seft-sel"
            @visible-change="productTypeShowbox3"
            v-model="defaultStatus"
            no-data-text="No Data"
            placeholder="Select"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.label"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="shopify-collection-name shopify-collectionBox">
          <span class="title">Product Type:</span>
          <el-select
            class="inputbox1"
            id="inputbox1"
            popper-class="shopify-seft-sel"
            v-model="productTypeValue"
            filterable
            @change="productTypeChnage"
            @visible-change="productTypeShow"
            allow-create
            no-data-text="No Data"
            default-first-option
            placeholder="Select"
          >
            <el-option
              v-for="item in optionsProductType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="tagsBox">
        <div class="shopify-name-box tags" ref="shopify_name_box2">
          <el-select
            multiple
            popper-class="shopify-seft-sel"
            v-model="selectedTags"
            id="tags"
            placeholder="Select"
            no-data-text="No Data"
            @visible-change="productTypeShowTag"
            filterable
            allow-create
            default-first-option
          >
            <el-option
              v-for="item in tagsMultiple"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <!-- 商品价格编辑 -->
      <div
        class="product-edit-price"
        :class="{ more: !single }"
        infinite-scroll-distance="50"
        v-infinite-scroll="load"
      >
        <div class="product-list">
          <div
            class="product-single"
            v-for="(product, index) in detaileList"
            :key="product.id"
          >
            <div class="left-mian-img">
              <img :src="product.mainImage" v-imgError:big />
              <div class="pre-order-bk" v-if="product.forwardSell==1">
                Pre-order
              </div>
              <div class="pre-order-bk Launch" v-else-if="product.tagType==6">
                Pre-Launch
              </div>
            </div>
            <div class="right-main-info">
              <div class="title-and-brand">
                {{ product.title }}
              </div>
              <div class="price-earn">
                Earn：<span
                  class="amount"
                  :class="{
                    loss: cmputedEditPriceLoss(product, cmputedPrice),
                  }"
                  >{{ cmputedPrice(product) }}</span
                >
              </div>
              <div class="edit-price-contrast">
                <div class="trendis-price">
                  <span class="name">Product Cost：</span>
                  <span class="amount"
                    >${{ formatPrice(product.minPriceB) }}</span
                  >
                </div>
                <div class="your-price">
                  <span class="name">Selling Price：</span>
                  <div
                    class="input-you-price"
                    :class="{
                      isedit: cmputedEditPrice(product, index),
                    }"
                  >
                    <span class="amount">$</span>
                    <input
                      type="text"
                      @keydown="allclearMinus($event, product)"
                      @input="inputMinPrice(product)"
                      @blur="blurEditPrice(product)"
                      :class="{
                        isedit: cmputedEditPrice(product, index),
                      }"
                      v-model="product.minPrice"
                    />
                  </div>
                  <!-- <span>$23.90</span> -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="export-to-shopify-singel-btn-box">
        <div class="pre-launch-tip" v-if="showPreLaunchTitle">
          Please do not sell or promote pre-launch products prior to launch date.
        </div>
        <div
          class="export-to-shopify-singel-btn"
          v-elementEvent
          @click="exportProduct"
        >
          Add to Shopify
        </div>
      </div>
    </el-dialog>
    <!-- 正在导出提示 -->
    <div class="export-loading-container" v-if="exportLoading">
      <div class="loading-container">
        <img
          class="export-loading-close"
          :src="require('@/static/closeShopifyLoading@2x.png')"
          @click="exportLoadingClose"
        />
        <div class="tip1">Adding To Shopify</div>
        <div class="tip2">
          This may take a few minutes. You can close this window and we’ll
          notify you by email when it’s done.
        </div>
        <div class="progress" ref="progress" v-if="!single">
          <div
            class="progress-bk"
            :style="{ width: (progressBkWidth / exportShopNumber) * 100 + '%' }"
          ></div>
        </div>
        <div class="progress-number" v-if="!single">
          {{ progressBkWidth }}/{{ exportShopNumber }}
        </div>
      </div>
    </div>
    <div class="self-modal" v-if="exportLoading"></div>
    <Success
      v-if="exportSuccessDailog"
      :single="single"
      :cms="cms"
      @colseSinglePopup="closeAllDialong"
      :info="exportStatusInfo"
      :exportSuccessDailog.sync="exportSuccessDailog"
    />
  </div>
</template>

<script>
import { shopifyStoreList, shopifyStorecollections,getShopifyProductType } from "@/api/channels";
import Success from "./exportShopifySuccess";
import successInfo from "@/mixins/successInfo";
import { productCollectionIsDefault } from "@/api/collections";
import { formatPrice } from "@/utils/common";
// import { accSub } from "@/utils/common";
import Stomp from "stompjs";
import SockJS from "sockjs-client";
import {exportProductPost,checkExportProduct} from '@/api/production'
let connectionNumber = 0;
export default {
  name: "ExportToShopify",
  props: {
    currentExportData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    collectionName: {
      type: String,
      default: "",
    },
    collectionId: {},
    dialogVisible: {},
    collcetionId: {},
    single: {
      type: Boolean,
      default: false,
    },
    cms: {
      type: Boolean,
      default: false,
    },
    total: {},
    cmsId: {},
    amplitude:{
      type: Object,
      default: () => {
        return {};
      },
    }
  },
  components: {
    Success,
  },
  mixins: [successInfo],
  computed: {
    exportShopNumber() {
      if (this.single) {
        return 1;
      }
      return this.total?this.total:this.collectionListTotal
    },
    shopTotal() {
      if(this.single) {
        return 1 
      }else if(this.cms) {
        return this.detaileList.length
      }else {
        return this.total?this.total:this.collectionListTotal
      }
    },
    computedDomain() {
      let shoify = this.shopifyNameList.find((item) => {
        return item.storeId == this.currentSelStoreId;
      });
      return "https://" + shoify.domain + "/admin/products";
    },
    computedDomainLocationId() {
      let shoify = this.shopifyNameList.find((item) => {
        return item.storeId == this.currentSelStoreId;
      });
      return shoify.locationId;
    },
    showPreLaunchTitle() {
      let flag = false
      if(this.detaileList[0]) {
        flag = this.detaileList[0].tagType===6||this.collectionProperty===6
      }
      return flag
    }
  },
  data() {
    return {
      selectedTags: [],
      tagsMultiple: [
      ],
      statusOptions:[
        {
          value: 0,
          label: "Active",
        },
        {
          value: 1,
          label: "Draft",
        },
      ],
      cloneProductTypeValue: "",
      productTypeValue: "",
      optionsProductType: [
      ],
      value: [],
      exportLoading: false,
      // dialogVisible: this.firstModel,
      nextDialogVisible: false,
      currentSelID: "",
      currentSelStoreId: "",
      currentSelshopifyName: "",
      options: [],
      detaileList: [],
      originDetaileList: [],
      shopifyNameList: [],
      defaultShopName: "",
      defaultShopifyName: "",
      shopCurPage: 1,
      curPage: 1,
      collectionCurPage: 1,
      pageSize: 10,
      isFinished: false,
      isLoadCollection: false,
      stompClient: null,
      progressBkWidth: 0,
      exportSuccessDailog: false,
      exportStatusInfo: {},
      socket: null,
      formatPrice,
      defaultStatus: 0,
      collectionListTotal:0,
      collectionProperty:null,
      checkExportProductFlag:null,
      requestId:null
    };
  },
  created() {
    this.getShopifyStoreList();
    if (this.single) {
      let copyProduct = JSON.parse(JSON.stringify(this.currentExportData));
      let copyList = JSON.parse(JSON.stringify(copyProduct));
      copyProduct[0].minPrice = this.toFormatPrice(
        copyProduct[0].priceCWithRule||copyProduct[0].minPriceWithRule||copyProduct[0].minPrice
      );
      let copyList2 = JSON.parse(JSON.stringify(copyProduct));
      this.originDetaileList = copyList;
      this.detaileList = copyList2;
    } else if (this.cms) {
      let copyProduct = JSON.parse(JSON.stringify(this.currentExportData));
      let copyList = JSON.parse(JSON.stringify(copyProduct));
      copyProduct.map((item)=>{
          item.minPrice = this.toFormatPrice(item.minPriceWithRule || item.minPrice)
      })
      let copyList2 = JSON.parse(JSON.stringify(copyProduct));
      this.originDetaileList = copyList;
      this.detaileList = copyList2;
    } else {
      this.getCollectionShop();
    }
    console.log(this.currentExportData);
  },
  mounted() {
    // this.initWebSocket();
    console.log(this.$refs);
    this.$nextTick(() => {
      var seShopify = this.$refs.shopify_name_box;
      console.log(seShopify);
      var span = document.createElement("span");
      var img = document.createElement("img");
      img.src = require("../../../static/blackShopify@2x.png");
      var input = seShopify.querySelector("input");
      span.innerHTML = "Store:";
      //   span.style.fontSize = '18px';
      span.style.fontWeight = "bold";
      span.style.color = "black";
      //   span.innerHTML = 'Export To:'
      span.classList = "Export";
      // seShopify.insertBefore(span,input)
      input.parentElement.insertBefore(span, input);
      input.parentElement.insertBefore(img, input);
      // seShopify.append(span)
    });

    this.$nextTick(() => {
      let tags = this.$refs.shopify_name_box2;
      let input = tags.querySelector("input");
      input.parentElement.parentElement.firstChild.style.paddingLeft = "50px";
      var span = document.createElement("div");
      span.innerHTML = "Tags:";
      //   span.style.fontSize = '18px';
      span.style.fontWeight = "bold";
      span.style.color = "black";
      span.style.marginRight = "10px";
      span.style.position = "absolute";
      // span.style.top = "50"
      span.style.left = "16px";
      //   span.innerHTML = 'Export To:'
      span.classList = "Export";

      input.parentElement.insertBefore(span, input);
      this.shopifyDialog();
      console.log(input);
    });
  },
  beforeDestroy: function () {
    // this.disconnect();
    this.exportLoadingClose()
  },
  watch: {
    currentSelStoreId() {
      this.getShopifyStorecollections();
      this.getShpifyProductType()
    },
    currentExportData: {
      handler() {
        var copyList = JSON.parse(JSON.stringify(this.currentExportData));
        var copyList2 = JSON.parse(JSON.stringify(this.currentExportData));
        this.originDetaileList = copyList;
        this.detaileList = copyList2;
      },
      deep: true,
    },
  },
  methods: {
    getShpifyProductType() {
      var data, sucess, error, complete;
      this.isLoadCollection = true;
      data = {
        storeId:this.currentSelStoreId
      };
      sucess = (res)=>{
        console.log(res);
        const {productTypes,tags} = res.result;
        this.optionsProductType = productTypes.map((item)=>{
            return {
              value: item,
              label: item,
            }
        });
        this.tagsMultiple = tags.map((item)=>{
          return {
            value: item,
            label: item,
          }
        });
      }
      error = (res)=>{
        console.log(res);
      }
      complete = ()=>{
        this.isLoadCollection = false;
      }
      getShopifyProductType(data,sucess,error,complete)
    },
    toFormatPrice(number) {
      return new Number(number).toFixed(2)
    },
    shopifyDialog() {
      let Wheight = document.body.clientHeight;
      let shopifyHeidht = document.querySelector('.next-add-to-shopify').clientHeight;
      let marginTop = 0;
      if(Wheight-shopifyHeidht>0) {
        marginTop = Math.abs(shopifyHeidht - Wheight)/2 + 'px'
      }
      document.querySelector('.next-add-to-shopify').style.marginTop = marginTop
    },
    productTypeShowTag(item) {
      let dom = document.getElementById("tags").parentNode;
      if (item) {
        dom.style.borderRadius = "10px 10px 0px 0px";
      } else {
        dom.style.borderRadius = "10px 10px 10px 10px";
      }
    },
    productTypeShowsebox(item) {
      let dom = document.getElementById("sebox").parentNode;
      if (item) {
        dom.style.borderRadius = "10px 10px 0px 0px";
      } else {
        dom.style.borderRadius = "10px 10px 10px 10px";
      }
    },
    productTypeShow(item) {
      let dom = document.getElementById("inputbox1");
      if (item) {
        dom.style.borderRadius = "10px 10px 0px 0px";
      } else {
        dom.style.borderRadius = "10px 10px 10px 10px";
      }
      // this.productTypeValue = "";
      this.$nextTick(() => {
        dom.value = this.cloneProductTypeValue;
      });
    },
    productTypeShowbox3(item) {
      let dom = document.getElementById("box3");
      if (item) {
        dom.style.borderRadius = "10px 10px 0px 0px";
      } else {
        dom.style.borderRadius = "10px 10px 10px 10px";
      }
    },
    productTypeShowbox2(item) {
      let dom = document.getElementById("box2");
      if (item) {
        dom.style.borderRadius = "10px 10px 0px 0px";
      } else {
        dom.style.borderRadius = "10px 10px 10px 10px";
      }
      
    },
    productTypeChnage(item) {
      let dom = document.getElementById("inputbox1");
      this.$nextTick(() => {
        this.cloneProductTypeValue = item;
        this.productTypeValue = item;
        dom.value = item;
      });
    },

    closeCollection(e, name) {
      console.log(e);
      if (name) {
        this.$emit(`update:${name}`, false);
      } else {
        this.$emit(`update:dialogVisible`, false);
        this.$emit(`update:openExportToShopify`, false);
        this.nextDialogVisible = false;
      }
      // this.dialogVisible = false;
    },
    // 查询合集列表
    getCollectionShop() {
      const loading = this.$loading({
        lock: true,
        text: "",
        spinner: "el-icon-loading",
        background: "rgba(51,51,51,0.25)",
      });
      var data, sucess, error, complete;
      this.isLoadCollection = true;
      data = {
        collectionId: this.collectionId,
        curPage: this.collectionCurPage,
        pageSize: this.pageSize,
      };

      sucess = (res) => {
        const { result } = res.result;
        this.collectionProperty = res.result.collectionProperty
        var copyList = JSON.parse(JSON.stringify(result.result));
        result.result.map((item) => {
          item.minPrice = this.toFormatPrice(item.minPriceWithRule || item.minPrice);
        });
        const allPage = result.page.pages;
        this.collectionListTotal = result.page.total;//合集列表总数
        const page = this.collectionCurPage;
        this.isFinished = page >= allPage;
        if (this.collectionCurPage > 1) {
          this.originDetaileList = [...this.originDetaileList, ...copyList];
          this.detaileList = [...this.detaileList, ...result.result];
        } else {
          this.originDetaileList = copyList;
          this.detaileList = result.result;
        }
        this.collectionCurPage++;
      };
      error = (res) => {
        console.log(res.data.message);
      };
      complete = (res) => {
        this.isLoadCollection = false;
        loading.close();
        console.log(res);
      };
      productCollectionIsDefault(data, sucess, error, complete);
    },
    /** 初始化Socket连接 */
    initWebSocket() {
      this.connection();
    },
    connection() {
      // 建立连接对象
      console.log(
        "process.env.VUE_APP_BASE_Websocket",
        process.env.VUE_APP_BASE_Web_Socket
      );
      const socket = new SockJS(process.env.VUE_APP_BASE_Web_Socket);
      // const socket = new WebSocket(process.env.VUE_APP_BASE_Web_Socket)
      // const socket = new SockJS('/shopify-websocket')
      console.log(socket);
      // 获取STOMP子协议的客户端对象
      this.socket = socket;
      this.stompClient = Stomp.over(socket);
      // 定义客户端的认证信息,按需求配置
      // 向服务器发起websocket连接
      const that = this;
      this.stompClient.connect(
        {},
        function (frame) {
          console.log("Connected: " + frame);
          that.stompClient.subscribe(
            "/user/queue/store/export/result",
            (msg) => {
              // this.stompClient.subscribe('/user/queue/store/export/result', (msg) => { // 订阅服务端提供的某个topic
              console.log(msg.body);
              let info = JSON.parse(msg.body);
              if (!info.success) {
                console.log('error');
                that.exportStatusInfo = {
                  img: require("@/static/collection/exportCollectionError@2x.png"),
                  title: "Unable to Add",
                  tip:
                    `${info.message}`,
                  domain: null,
                };
                that.disconnect();
                that.handleClose();
                console.log("infoinfo", that.exportStatusInfo);
                that.exportLoading = false;
                that.exportSuccessDailog = true;
                return;
              }
              // if (info.data || info.data == 0) {
                ++that.progressBkWidth;
                if (that.progressBkWidth == that.exportShopNumber) {
                  that.exportStatusInfo = {
                    img: require("@/static/collection/exportCollectionSuccess@2x.png"),
                    title: "Added",
                    tip: "",
                    domain: that.computedDomain,
                  };
                  if (that.single == 1) {
                    that.exportStatusInfo.tip =
                      "This product has been successfully added to your Shopify store.";
                      if(info.data) {
                        that.exportStatusInfo.domain =
                        that.exportStatusInfo.domain + "/" + info.data;
                      }
                    that.$emit("upadtaProduct", that.currentExportData);
                  } else {
                    that.$EventBus.$emit("upCollcetionDetail");
                    that.exportStatusInfo.tip =
                      "This collection has been successfully added to your Shopify store.";
                    that.exportStatusInfo.domain =
                      that.exportStatusInfo.domain +
                      "/inventory?location_id=" +
                      that.computedDomainLocationId;
                  }
                  that.disconnect();
                  that.handleClose();
                  console.log("infoinfo", that.exportStatusInfo);
                  that.exportLoading = false;
                  that.exportSuccessDailog = true;
                }
              // } 
              // else if (info.data == null && that.single == 1) {
              //   that.exportStatusInfo = {
              //     img: require("@/static/collection/exportCollectionError@2x.png"),
              //     title: "Unable to Add",
              //     tip:`${info.message}`,
              //     domain: null,
              //   };
              //   that.disconnect();
              //   that.handleClose();
              //   console.log("infoinfo", that.exportStatusInfo);
              //   that.exportLoading = false;
              //   that.exportSuccessDailog = true;
              // }
              if (that.progressBkWidth === 1) {
                console.log(
                  "第5、7个埋点------add_to_shopify-----",
                  that.detaileList
                );
                if (that.single == 1) {
                  let productInfoOne = that.detaileList[0];
                  let uuId = JSON.parse(localStorage.getItem('USERINFO'))?JSON.parse(localStorage.getItem('USERINFO')).uuId:undefined;
                  that.$gtm.trackEvent({
                    event: "add_to_cart",
                    userId: uuId,
                    ecommerce: {
                      Cstm_add_option: "add_to_shopify",
                      items: [
                        {
                          item_name: productInfoOne.title,
                          item_id: productInfoOne.id,
                          price: productInfoOne.minPriceB,
                          item_brand: productInfoOne.brand,
                          item_category: "",
                          item_category2: "",
                          item_category3: "",
                          item_category4: "",
                          item_variant: "",
                          item_list_name: "",
                          item_list_id: "",
                          index: 1,
                          quantity: 1,
                        },
                      ],
                    },
                  });
                } else if (that.progressBkWidth == that.exportShopNumber) {
                  that.$gtm.trackEvent({
                    event: "add_to_cart",
                    userId: JSON.parse(localStorage.getItem("USERINFO")).uuId,
                    ecommerce: {
                      Cstm_add_option: "add_to_shopify",
                      items: [
                        {
                          item_name: that.collectionName,
                          item_id: that.collectionId,
                          price: "",
                          item_brand: "",
                          item_category: "",
                          item_category2: "",
                          item_category3: "",
                          item_category4: "",
                          item_variant: "",
                          item_list_name: "",
                          item_list_id: "",
                          index: 1,
                          quantity: that.detaileList.length,
                        },
                      ],
                    },
                  });
                }
              }
              // msg.ack()
            }
          );
          that.handleShopifyExport();
          // 用户加入接口
        },
        (err) => {
          console.log(err);
          // 连接发生错误时的处理函数
          connectionNumber++;
          if (connectionNumber <= 3) {
            that.connection();
          } else {
            // Notification({
            //   title: "Error",
            //   message: 'Data response failed!',
            //   iconClass:'el-icon-warning-outline',
            //   duration: 3000,
            //   showClose: false
            // });
            that.exportStatusInfo = {
              img: require("@/static/collection/exportCollectionError@2x.png"),
              title: "Unable to Add",
              tip:
                "Unable to add products to Shopify. Please try again later.",
              domain: null,
            };
            that.disconnect();
            that.handleClose();
            console.log("infoinfo", that.exportStatusInfo);
            that.exportLoading = false;
            that.exportSuccessDailog = true;
          }
        }
      );
    },
    disconnect() {
      if (this.stompClient) {
        console.log(this.socket);
        this.stompClient.disconnect();
        this.socket.close();
      }
    },
    // shopifyExport2(data, sucess, error, complete) {
    //   this.stompClient.send('/app/ws/store/export', {}, JSON.stringify(data))
    // },
    // 导出shopify
    exportProduct() {
      this.exportProductBuriedPoint()
      if (this.detaileList.length <= 0 || !this.currentSelStoreId) {
        return;
      }
      // this.initWebSocket();
      this.exportProductPostApi()
      this.exportLoading = true;
      this.$nextTick(() => {
        var modal = document
          .querySelector(".export-to-shopify-singel")
          .querySelector(".v-modal");
        modal.style.display = "none";
      });
      // this.handleShopifyExport();
    },
    // 方案2
    exportProductPostApi() {
      var data, storeProduct, email;
      storeProduct = JSON.parse(JSON.stringify(this.detaileList));
      email = JSON.parse(localStorage.getItem("USERINFO")).email;
      this.requestId = this._global.pv_id_func()
      var filterProduct = storeProduct.map((item) => {
        return {
          id: item.id,
          minPrice: item.minPrice,
        };
      });
      if (this.single && storeProduct[0].headImages) {
        storeProduct[0].headImage = this.detaileList[0].headImages.slice(1);
      }
      data = {
        storeId: this.currentSelStoreId,
        collectionId: this.single ? "" : this.collectionId,
        exportType: this.single ? 1 : 0, // 1单个，0多个 2活动导出
        storeCollectionId: this.defaultShopName,
        storeProduct: filterProduct,
        email,
        userId:this.$store.state.user.userInfo.id,
        productType:this.productTypeValue,
        tags:this.selectedTags,
        status:this.defaultStatus,
        requestId:this.requestId
      };
      if (this.cms) {
        data.cmsPageId = this.cmsId;
        data.exportType = 2;
        delete data.collectionId;
      }
      console.log(data);
      // 单个商品不调用轮询
      if(!this.single) {
        this.checkExportProductApi()
      }
      const that = this;
      exportProductPost(data,(info)=>{
        console.log(info,'成功');
        // if (that.progressBkWidth == that.exportShopNumber) {
          if (info.data==null||!info.data){
            that.exportStatusInfo = {
                img: require("@/static/collection/exportCollectionError@2x.png"),
                title: "Unable to Add",
                tip:
                  `Unable to add products to Shopify. Please try again later.`,
                domain: null,
              };
              // that.disconnect();
              // 关闭导出进度弹框，展示失败的弹框
              that.handleClose();
              console.log("infoinfo", that.exportStatusInfo);
              that.exportLoading = false;
              that.exportSuccessDailog = true;
              return;
          }
          that.exportStatusInfo = {
            img: require("@/static/collection/exportCollectionSuccess@2x.png"),
            title: "Added",
            tip: "",
            domain: that.computedDomain,
          };
          if (that.single == 1) {
            that.exportStatusInfo.tip =
              "This product has been successfully added to your Shopify store.";
              if(info.data) {
                that.exportStatusInfo.domain =
                that.exportStatusInfo.domain + "/" + info.data;
              }
            that.$emit("upadtaProduct", that.currentExportData);
          } else {
            that.$EventBus.$emit("upCollcetionDetail");
            that.exportStatusInfo.tip =
              "This collection has been successfully added to your Shopify store.";
            that.exportStatusInfo.domain =
              that.exportStatusInfo.domain +
              "/inventory?location_id=" +
              that.computedDomainLocationId;
          }
          // that.disconnect();
          // 关闭导出进度弹框，展示成功的弹框
          that.handleClose();
          console.log("infoinfo", that.exportStatusInfo);
          that.exportLoading = false;
          that.exportSuccessDailog = true;
          // clearInterval(this.checkExportProductFlag)
        // }
      },(err)=>{
        console.log(err,'error');
        // that.disconnect();
        // that.handleClose();
        // that.exportLoading = false;
        this.exportLoadingClose()
        // that.exportStatusInfo = {
        //   img: require("@/static/collection/exportCollectionError@2x.png"),
        //   title: "Unable to Add",
        //   tip:
        //     `Unable to add products to Shopify. Please try again later.`,
        //   domain: null,
        // };
        // that.disconnect();
        // that.handleClose();
        // console.log("infoinfo", that.exportStatusInfo);
        // that.exportLoading = false;
        // that.exportSuccessDailog = true;
        // console.log(err,'异常');
      },(res)=>{
        console.log(res,'完成');
      })

    },
    // 轮询成功数量
    checkExportProductApi() {
      const data = {
        // storeId:this.currentSelStoreId,
        requestId:this.requestId
      }
      const that = this;
      this.checkExportProductFlag =  setInterval(()=>{
        checkExportProduct(data,(info)=>{
          console.log(info,111111111);
          if (info.data==null||!info.data){
            that.exportStatusInfo = {
              img: require("@/static/collection/exportCollectionError@2x.png"),
              title: "Unable to Add",
              tip:
                `Unable to add products to Shopify. Please try again later.`,
              domain: null,
            };
            that.disconnect();
            that.handleClose();
            console.log("infoinfo", that.exportStatusInfo);
            that.exportLoading = false;
            that.exportSuccessDailog = true;
            return;
          }
          that.progressBkWidth = info.data;
          if (info.data >= that.exportShopNumber) {
            that.exportStatusInfo = {
              img: require("@/static/collection/exportCollectionSuccess@2x.png"),
              title: "Added",
              tip: "",
              domain: that.computedDomain,
            };
            if (that.single == 1) {
              that.exportStatusInfo.tip =
                "This product has been successfully added to your Shopify store.";
                if(info.data) {
                  that.exportStatusInfo.domain =
                  that.exportStatusInfo.domain + "/" + info.data;
                }
              that.$emit("upadtaProduct", that.currentExportData);
            } else {
              that.$EventBus.$emit("upCollcetionDetail");
              that.exportStatusInfo.tip =
                "This collection has been successfully added to your Shopify store.";
              that.exportStatusInfo.domain =
                that.exportStatusInfo.domain +
                "/inventory?location_id=" +
                that.computedDomainLocationId;
            }
            that.disconnect();
            that.handleClose();
            console.log("infoinfo", that.exportStatusInfo);
            that.exportLoading = false;
            that.exportSuccessDailog = true;
          }
        },(err)=>{
          that.exportStatusInfo = {
            img: require("@/static/collection/exportCollectionError@2x.png"),
            title: "Unable to Add",
            tip:
              `Unable to add products to Shopify. Please try again later.`,
            domain: null,
          };
          that.disconnect();
          that.handleClose();
          console.log("infoinfo", that.exportStatusInfo);
          that.exportLoading = false;
          that.exportSuccessDailog = true;
          console.log(err);
        },()=>{
        })
      },5000)
    },
    // 导出shopify埋点
    exportProductBuriedPoint() {
      const page_code = this.amplitude.buy_sample.page_code
      let rankVal, event_value, event_target;
      if(page_code === 'product_detail_page') {
        event_value = ''
      } else if(page_code === 'collection_listing_detail_page') {
        event_value = this.collectionId;
      } else if(page_code === 'collection_listing_page') {
        this.amplitude.event_value_productsId.forEach((item, index)=>{
          if(item === this.collectionId) {
            rankVal = index;
          }
        })
        event_value = [rankVal, this.collectionId];
      } else {
        this.amplitude.event_value_productsId.forEach((item, index)=>{
          if(item === this.detaileList[0].id) {
            rankVal = index;
          }
        })
        event_value = [rankVal, this.detaileList[0].id];
      }
      if(page_code === 'collection_listing_page' || page_code === 'collection_listing_detail_page') {
        event_target = 'collection';
      } else {
        event_target = 'button';
      }
      console.log(333, 'button埋点-----add_to_shopify', page_code, event_value, this.amplitude.pv_id);
      this.$amplitude.getInstance().logEvent('click', {
        'page_code': page_code,
        'module_code': 'add_to_shopify_pop_up',
        'position_code': 'add_to_shopify',
        'event_target': event_target,
        'event_value': event_value,
        'pv_id': this.amplitude.pv_id,
        'url': window.location.href
      });
    },
    // 执行导出
    handleShopifyExport() {
      var data, storeProduct, email;
      storeProduct = JSON.parse(JSON.stringify(this.detaileList));
      email = JSON.parse(localStorage.getItem("USERINFO")).email;
      var filterProduct = storeProduct.map((item) => {
        // console.log(accSub(item.minPrice,item.minPriceB));
        return {
          id: item.id,
          minPrice: item.minPrice,
        };
        //  item.maxEarn = accSub(item.minPrice, item.minPriceB);
      });
      if (this.single && storeProduct[0].headImages) {
        storeProduct[0].headImage = this.detaileList[0].headImages.slice(1);
      }
      data = {
        storeId: this.currentSelStoreId,
        collectionId: this.single ? "" : this.collectionId,
        exportType: this.single ? 1 : 0, // 1单个，0多个 2活动导出
        storeCollectionId: this.defaultShopName,
        storeProduct: filterProduct,
        email,
        userId:this.$store.state.user.userInfo.id,
        productType:this.productTypeValue,
        tags:this.selectedTags,
        status:this.defaultStatus
      };
      if (this.cms) {
        data.cmsPageId = this.cmsId;
        data.exportType = 2;
        delete data.collectionId;
      }
      console.log(data);
      this.stompClient.send("/ws/store/exportProduct", {}, JSON.stringify(data));
      // sucess = (res) => {
      //   console.log(res);
      //   var message = {
      //     title: "Added",
      //     tip:
      //       "This collection has been successfully added to your shopify store.",
      //   };
      //   this.createdSuccessInfo(message);
      //   this.closeAllDialong();
      // };
      // error = (res) => {
      //   console.log(res.data.message);
      //   Notification({
      // 		title: "Error",
      // 		message: res.data.message,
      // 		iconClass:'el-icon-warning-outline',
      // 		duration: 3000,
      // 		showClose: false
      // 	});
      // };
      // complete = (res) => {
      //   this.exportLoading = false;
      //   var modal = document.querySelector('.export-to-shopify-singel').querySelector('.v-modal')
      //   modal.style.display = 'block'
      //   console.log(res);
      // };
      // this.shopifyExport2(data, sucess, error, complete);
    },
    // 导出成功关闭所有弹窗
    closeAllDialong() {
      this.handleClose2();
      this.$emit(`closeAll`);
    },
    seShopifyNameID(item) {
      this.currentSelID = item.id;
      this.currentSelStoreId = item.storeId;
      this.currentSelshopifyName = item.domain;
    },
    // 获取三方店铺
    getShopifyStorecollections() {
      var data, sucess, error, complete;
      data = {
        storeId: this.currentSelStoreId,
        curPage: 1,
        pageSize: 20,
      };
      sucess = (res) => {
        console.log(res);
        const { result } = res;
        this.options = result;
        this.defaultShopName = "";
        // console.log();
        // this.shopifyNameList = result;
        // this.currentSelID = this.shopifyNameList[0].storeId
      };
      error = (res) => {
        console.log(res.data.message);
      };
      complete = (res) => {
        console.log(res);
      };
      shopifyStorecollections(data, sucess, error, complete);
    },
    getShopifyStoreList() {
      var data, sucess, error, complete;
      data = {
        storeType: 0,
        curPage: this.curPage,
        pageSize: 1000,
      };
      sucess = (res) => {
        console.log(res);
        const { result } = res;
        if (result.length == 0) {
          return;
        }
        this.shopifyNameList = result.filter(item=>item.storeType===0);
        this.currentSelID = this.shopifyNameList[0].id;
        this.$nextTick(() => {
          this.currentSelStoreId = this.shopifyNameList[0].storeId;
        });
        this.currentSelshopifyName = this.shopifyNameList[0].domain;
      };
      error = (res) => {
        console.log(res.data.message);
      };
      complete = (res) => {
        console.log(res);
      };
      shopifyStoreList(data, sucess, error, complete);
    },
    // 修改价格事件
    inputMinPrice(product) {
      console.log(product);
      product.minPrice = product.minPrice.replace(/[^\d|.]/g, "");
      // product.minPrice = product.minPrice.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); /保留2为小数
    },
    // 封装清除多个点的方法
    allclearMinus(e, product) {
      var keynum = window.event ? e.keyCode : e.which;
      product.minPrice = "" + product.minPrice;
      if (product.minPrice.includes(".") && keynum == 110) {
        keynum = 0;
        window.event.returnValue = false;
      }
    },
    // 计算价格差
    cmputedPrice(product) {
      // debugger
      // let priceCWithRule = product.priceCWithRule;
      // let minPromotionPrice = product.minPromotionPrice;
      // let priceCWithRule = product.priceCWithRule;
      // let priceCWithRule = product.priceCWithRule;
      // if(priceCWithRule)
      let minPrice = product.priceCWithRule&&product.priceCWithRule.toString()||product.minPrice.toString();
      let index = minPrice.indexOf(".");
      let resultMinPrice =
        index >= 0 ? minPrice.slice(0, index + 3) : minPrice + ".00";

      let minPriceB = product.minPriceB.toString();
      let indexB = minPriceB.indexOf(".");
      let resultMinPriceB =
        indexB >= 0 ? minPriceB.slice(0, indexB + 3) : minPriceB + ".00";
      return (resultMinPrice - resultMinPriceB).toFixed(2);
      // this.originDetaileList[index].minPrice == currentMinPrice
      // return current
    },
    // 计算是否修改价格
    cmputedEditPrice(product, index) {
      return this.originDetaileList[index].minPrice == product.minPrice
        ? false
        : true;
    },
    // 计算价格亏损
    cmputedEditPriceLoss(product, fun) {
      return fun(product) < 0;
    },
    // 加载数据
    load() {
      if (this.isFinished || this.isLoadCollection || this.single || this.cms) {
        return;
      }
      this.getCollectionShop();
    },
    // 关闭第一层弹窗
    handleClose() {
      this.$emit("update:dialogVisible", false);
      clearInterval(this.checkExportProductFlag)

      // this.dialogVisible = false;
    },
    // 关闭第二层弹窗
    handleClose2() {
      clearInterval(this.checkExportProductFlag)
      this.$emit(`update:dialogVisible`, false);
      this.$emit(`closeAll`);
      // this.$emit(`closeAll`);
      this.nextDialogVisible = false;
      // this.dialogVisible = false;
    },
    nextContinue() {
      if (!this.currentSelID) {
        return;
      }
      this.nextDialogVisible = true;
      this.getShopifyStorecollections();
    },
    // 关闭导出loading弹窗按钮
    exportLoadingClose() {
      this.exportLoading = false;
      // this.disconnect();
      this.handleClose2();
      clearInterval(this.checkExportProductFlag)
      connectionNumber = 0
      this.progressBkWidth = 0
    },
    blurEditPrice(product) {
      product.minPrice = this.toFormatPrice(product.minPrice);
    },
  },
};
</script>
<style lang="less">
.el-scrollbar__wrap {
  overflow-y: auto !important ;
}
.el-select-dropdown.is-multiple {
  background-color: none !important;
  min-width: 320px !important;
  width: 320px !important;
  .el-scrollbar {
    .el-scrollbar__wrap {
      overflow-y: auto !important ;
    }
    .el-select-dropdown__wrap {
      overflow-y: auto !important ;
    }
  }
}

.el-select-dropdown {
  // border:1px solid red;

  // width: 320px!important;
  z-index: 1;
  margin: 0 !important;
  // box-shadow: 0px 10px 20px rgb(242, 230, 245) inset;
  .popper__arrow {
    width: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    border-bottom-color: none !important;
    background-color: none !important;
    border: 0 !important;
  }
  .popper__arrow::after {
    width: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    border: 0 !important;
    background-color: none !important;
    border-bottom-color: none !important;
  }
}

.export-to-shopify-singel {
  .self-modal {
    position: fixed;
    width: 100%;
    left: 0;
    z-index: 9998;
    top: 0;
    height: 100%;
    background: #000;
    opacity: 0.5;
  }
  .export-loading-container {
    position: fixed;
    width: 100%;
    left: 0;
    z-index: 9999;
    top: 0;
    height: 100%;
    // background: rgba(0, 0, 0, 0.2);
    // background: rgba(51, 51, 51, 0.25);
    .loading-container {
      background: rgba(51, 51, 51, 0.6);
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(25px);
      border-radius: 20px;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 300px;
      height: 277px;
      padding-top: 130px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      background: url(../../../static/waiting2.gif);
      align-items: center;
      background-size: cover;
      background-repeat: no-repeat;
      transform: translate(-50%, -50%);
      .export-loading-close {
        cursor: pointer;
        position: absolute;
        top: 16px;
        right: 16px;
        width: 24px;
        height: 24px;
      }
      .progress {
        margin-top: 16px;
        width: 252px;
        height: 8px;
        background: #c4c4c4;
        border-radius: 5px;
        color: red;
        & .progress-bk {
          width: 0%;
          height: 8px;
          background: #c79618;
          border-radius: 5px;
        }
      }
      .progress-number {
        margin-top: 4px;
        font-style: normal;
        font-weight: normal;
        font-size: 12px;
        line-height: 16px;
        text-align: center;
        color: #fff;
      }
      .tip1 {
        margin: 0 0 9px;
        font-weight: bold;
        font-size: 14px;
        color: #fff;
        line-height: 19px;
      }
      .tip2 {
        font-size: 14px;
        padding: 0 24px;
        line-height: 19px;
        color: #ffffff;
        font-weight: 400;
      }
    }
  }
  .add-to-shopify {
    position: relative;
    width: 375px;
    height: 260px;
    margin-top: 0 !important;
    transform: translateY(-50%);
    text-align: center;
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(25px);
    /* Note: backdrop-filter has minimal browser support */
    padding-top: 16px;
    border-radius: 20px;
    & > .el-dialog__header {
      padding: 0;
    }
    & > .el-dialog__body {
      padding: 6px 17px 20px;
    }
    .add-to-shopify-title {
      display: flex;
      .close {
        width: 24px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        height: 24px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 16px;
        position: absolute;
        right: 16px;
        top: 16px;
        &:hover {
          background: rgba(255, 255, 255, 1);
        }
        img {
          width: 8.6px;
          height: 8.6px;
        }
      }
      .name {
        color: #333333;
        font-size: 18px;
        font-weight: bold;
        flex: 1;
        text-align: center;
      }
    }
    .sel-shopify-name {
      .tip {
        text-align: left;
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
        color: #333333;
        margin-bottom: 5px;
      }
      & > .el-loading-mask {
        background: rgba(51, 51, 51, 0.25);
      }
      .shopify-name-list {
        height: 98px;
        overflow: auto;
        box-sizing: border-box;
        padding-bottom: 10px;
        .single {
          margin-top: 8px;
          &:first-child {
            margin: 0;
          }
          // &:last-child {
          // margin: 0;
          // }
          display: flex;
          padding: 0 11px 0 20px;
          justify-content: space-between;
          background: #ffffff;
          border-radius: 10px;
          height: 40px;
          align-items: center;
          .name {
            font-weight: 500;
            font-size: 16px;
            line-height: 16px;
            color: #000000;
          }
          .input-box {
            position: relative;
            z-index: 10;
            display: flex;
            input[type="radio"] {
              width: 18px;
              height: 18px;
              opacity: 0;
            }

            label {
              position: absolute;
              box-sizing: border-box;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              border: 1px solid #999;
            }

            /*设置选中的input的样式*/
            /* + 是兄弟选择器,获取选中后的label元素*/
            input:checked + label {
              background-color: #333;
              border: 1px solid #333;
            }

            input:checked + label::after {
              position: absolute;
              content: "";
              width: 4px;
              height: 8px;
              top: 1px;
              left: 5px;
              border: 2px solid #fff;
              border-top: none;
              border-left: none;
              transform: rotate(45deg);
            }
          }
        }
      }
      .continue-box {
        margin: 20px 0 0px 0;
        .continue-btn {
          background: #333333;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          border-radius: 25px;
          font-size: 16px;
          line-height: 46px;
          text-align: center;
          color: #ffffff;
        }
      }
    }
  }
  .next-add-to-shopify {
    position: relative;
    // text-align: center;
    top: 0%;
    width: 704px;
    margin-bottom: 0;
    // margin-top: 0 !important;
    // height: 353px;
    // transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(25px);
    /* Note: backdrop-filter has minimal browser support */
    padding-top: 24px;
    border-radius: 20px;
    & > .el-dialog__header {
      padding: 0;
    }
    & > .el-dialog__body {
      padding: 24px;
    }

    .next-add-shopify-title {
      display: flex;
      .close {
        cursor: pointer;
        width: 24px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 24px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 16px;
        position: absolute;
        right: 16px;
        top: 16px;
        &:hover {
          background: rgba(255, 255, 255, 1);
        }
        img {
          width: 8.6px;
          height: 8.6px;
        }
      }
      .name {
        color: #333333;
        font-size: 18px;
        font-weight: bold;
        flex: 1;
        text-align: center;
      }
    }
    .shopify-collection-name {
      .el-input__inner {
        &.el-input__inner:focus {
          border-color: transparent;
        }
        border-radius: 10px;
      }
      
      .el-input {
        input {
          height: 40px;
        }
        .el-input__inner {
          border-color: transparent;
          background: #fff;
        }
      }
    }
    .shopify-collectionBox {
      position: relative;
      // z-index:99999999!important;
      width: 320px;
      .inputbox1 {
        width: 320px;
        ::-webkit-input-placeholder {
          /* Chrome/Opera/Safari */
          padding-left: 0px;
          // color: red;
        }
        .el-select__tags {
          padding-left: 100px;
        }
        input {
          padding-left: 120px;
        }
        // .el-input__inner{
        // 	padding-left:120px ;
        // }
      }
      .inputbox2 {
        .el-input__inner {
          padding-left: 60px;
        }
      }
      .title {
        left: 16px;
        z-index: 99;
        position: absolute;
        transform: translateY(-50%);
        top: 50%;
        font-weight: bold;
        color: #000;
      }
      .inputBox {
        width: 320px;
        .el-input {
          input {
            width: 320px;
          }
        }
      }
      .box2 {
        .el-input {
          input {
            padding-left: 160px;
          }
        }
      }
      .box3 {
        .el-input {
          input {
            padding-left: 70px;
          }
        }
      }
      .box4 {
        .el-input {
          input {
            padding-left: 160px;
          }
        }
      }
    }
    .sel-shopify-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      .shopify-name-box {
        .el-input__inner {
          &.el-input__inner:focus {
            border-color: transparent;
          }
          border-radius: 10px;
        }
        .el-input {
          width: 320px;
          background: #fff;
          border-radius: 10px;
          padding-left: 16px;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          input {
            height: 40px;
            flex: 1;
            padding: 0;
            // width: 50%;
          }
          .Export {
            font-weight: 500;
            font-size: 14px;
            line-height: 18px;
            color: #333;
          }
          img {
            width: 24px;
            height: 24px;
            margin-left: 10px;
            margin-right: 8px;
          }
          .el-input__inner {
            border-color: transparent;
            background: #fff;
          }
        }
        .el-select {
          width: 100%;
        }
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: space-between;
        // background: #ffffff;
        padding: 0 16px 0 0;
        box-sizing: border-box;
        width: 360px;
        border-radius: 10px;
        height: 40px;
        .tip {
          font-weight: 500;
          font-size: 14px;
          line-height: 18px;
          color: #333333;
        }
        .shopify-name {
          display: flex;
          align-items: center;
          img {
            width: 24px;
            height: 24px;
          }
          span {
            margin-left: 8px;
            font-size: 16px;
            line-height: 16px;
            color: #979797;
          }
        }
      }
      .tags {
        width: 320px;
        input {
          width: 320px !important;
          height: 40px;
        }
      }
    }
    .tagsBox {
      width: 320px !important;
      margin-bottom: 16px;
      .tags {
        // border:1px solid red;

        .el-select {
          .el-input {
            input {
              height: 100%;
            }
          }
          .el-select__tags {
            // border:1px solid red;
            width: 240px !important;
          }
        }
      }
      input::-webkit-input-placeholder {
        padding-left: 48px;
      }

      .shopify-name-box {
        .el-input__inner {
          border-radius: 10px;
        }
        .el-tag {
          height:24px;
          padding: 0 8px 0 5px;
        }
        .el-icon-close {
          transform: scale(.5);
          &::before {
            transform: translate(0);
          }
        }
        .el-input {
          width: 320px;
          background: #fff;
          border-radius: 10px;
          padding-left: 16px;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          input {
            min-height: 40px;
            flex: 1;
            padding: 0;
            // width: 50%;
          }
          .Export {
            font-weight: 500;
            font-size: 14px;
            line-height: 18px;
            color: #333;
          }
          .el-input__inner {
            border-color: transparent;
            background: #fff;
          }
        }
        .el-select {
          width: 100%;
        }

        // background: #ffffff;
        padding: 0 16px 0 0;

        border-radius: 10px;

        .tip {
          font-weight: 500;
          font-size: 14px;
          line-height: 18px;
          color: #333333;
        }
        .shopify-name {
          display: flex;
          align-items: center;
          img {
            width: 24px;
            height: 24px;
          }
          span {
            margin-left: 8px;
            font-size: 16px;
            line-height: 16px;
            color: #979797;
          }
        }
      }
      
    }
    //商品样式和修改价格
    .product-edit-price {
      height: 127px;
      &.more {
        height: 460px;
        overflow: auto;
        .product-single {
          margin-bottom: 16px !important;
        }
      }
      .product-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .product-single {
          cursor: pointer;
          margin: 0;
          box-sizing: border-box;
          display: flex;
          width: 320px;
          height: 120px;
          background: #ffffff;
          box-shadow: 0px 5px 20px rgba(147, 141, 128, 0.1);
          border-radius: 20px;
          .left-mian-img {
            font-size: 0;
            height: 100%;
            padding: 0;
            width: auto;
            position: relative;
            .pre-order-bk {
              position: absolute;
              z-index: 20;
              bottom: 10px;
              white-space: nowrap;
              padding: 2px 6px;
              color: #333;
              background: rgba(255, 255, 255, 0.6);
              backdrop-filter: blur(10px);
              height: 16px;
              line-height: 16px;
              left: 50%;
              transform: translateX(-50%);
              text-align: center;
              border-radius: 6px;
              &.Launch {
                color: #fff;
                font-size: 12px;
                background: rgba(51, 51, 51, 0.6);
                // padding: 2px 4px;
              }
            }
            img {
              width: 80px;
              border-top-left-radius: 20px;
              border-bottom-left-radius: 20px;
              height: 100%;
              object-fit: cover;
            }
          }
          .right-main-info {
            flex: 1;
            overflow: hidden;
            padding-left: 16px;
            padding-right: 16px;
            padding-top: 0;
            padding-bottom: 0;
            .title-and-brand {
              margin-top: 16px;
              font-size: 14px;
              line-height: 18px;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              color: #333333;
              text-align: left;
            }
            .price-earn {
              font-weight: 600;
              font-size: 14px;
              color: #333333;
              text-align: left;
              margin: 5px 0;
              .amount {
                &.loss {
                  color: #F363A0;
                }
              }
            }
            .edit-price-contrast {
              display: flex;
              .trendis-price {
                display: flex;
                flex-direction: column;
                .name {
                  font-size: 12px;
                  margin-bottom: 5px;
                }
                .amount {
                  margin-top: 2px;
                  font-weight: 600;
                  font-size: 12px;
                  color: #333333;
                  line-height: 18px;
                }
              }
              .your-price {
                flex: 1;
                display: flex;
                flex-direction: column;
                .name {
                  font-size: 12px;
                  align-self: flex-end;
                  margin-bottom: 5px;
                }
                .input-you-price {
                  width: 96px;
                  height: 24px;
                  background: #eeeeee;
                  align-self: flex-end;
                  border-radius: 6px;
                  align-items: center;
                  padding-left: 10px;
                  display: flex;
                  justify-content: space-between;
                  font-weight: 600;
                  font-size: 12px;
                  line-height: 18px;
                  &.isedit {
                    box-shadow: 0px 0px 20px rgba(51, 51, 51, 0.15);
                    background: #fff !important;
                  }
                  .amount {
                    font-weight: 600;
                    flex-shrink: 0;
                    color: #333333;
                    font-size: 12px;
                  }
                  input {
                    // width: 50%;
                    min-width: 30px;
                    max-width: 60px;
                    padding-right: 10px;
                    border: none;
                    text-align: right;
                    outline: none;
                    background: #eeeeee;
                    &.isedit {
                      background: #fff;
                      color: #c79818;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .export-to-shopify-singel-btn-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 24px;
      .pre-launch-tip {
        font-size: 14px;
        line-height: 19px;
        color: #F363A0;
        margin-bottom: 8px;
      }
      .export-to-shopify-singel-btn {
        font-weight: 600;
        font-size: 16px;
        line-height: 42px;
        text-align: center;
        width: 252px;
        height: 42px;
        background: #333333;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
        border-radius: 26px;
        color: #ffffff;
      }
    }
  }
}
.shopify-seft-sel {
  margin: 0 !important;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  & > .popper__arrow {
    display: none;
  }
  .el-select-dropdown__item {
    &.selected {
      color: #333;
      font-weight: 500;
    }
    &.hover {
      background: transparent;
    }
    text-align: center;
    &.hover span {
      display: inline-block;
      background: #eeeeee;
      color: #333;
      font-weight: 500;
      padding: 0px 16px;
      line-height: 32px;
      box-sizing: border-box;
      border-radius: 20px;
    }
  }
  .el-select-dropdown__wrap {
    max-height: 157px;
  }
}
.se-shopify {
  margin: 0 !important;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  & > .popper__arrow {
    display: none;
  }
  .el-select-dropdown__item {
    &.selected {
      color: #333;
      font-weight: 500;
    }
    &.hover {
      background: transparent;
    }
    text-align: center;
    &.hover span {
      display: inline-block;
      background: #eeeeee;
      color: #333;
      font-weight: 500;
      padding: 0px 16px;
      line-height: 32px;
      box-sizing: border-box;
      border-radius: 20px;
    }
  }
  .el-select-dropdown__wrap {
    max-height: 136px;
  }
}
@import "../../../styles/selfNotify.less";

</style>