<template>
  <div class="collections-detail-page" v-infinite-scroll="load" @scroll="scrollDom" infinite-scroll-distance='400'>
    <div class="collections-detail-box ms">
       <div class="collections-detail-nav">
        <div class="back-img" >
          <div class="seft-back-img-container" @click="backPage">
            <img src="../../../static/productDetail/headerBack@2x.png" alt="" />
          </div>
          <span class="back-text" @click="backPage"> Back </span>
          <span class="collection-text" 
            >{{ collectionName }}
          </span>
          <span class="collection-number">{{ total }} {{total==1?'Item':'Items'}}</span>
        </div>
        <div class="collections-handle">
          <!-- <div class="collections-handle-item" v-elementEvent @click="handleopenExportToShopify">
            <img src="../../../static/collection/shopify@2x.png" alt="" />
            <span>Add to Shopify</span>
          </div>
          <div class="collections-handle-item" v-elementEvent @click="addToFacebook">
            <img src="../../../static/collection/Facebook@2x.png" alt="" />
            <span>Add to Facebook Shop</span>
          </div> -->
          <div class="collections-handle-item" v-elementEvent @click.stop="openAddPopup()">
            <img src="../../../static/add@2x.png" style="margin-right:13px" alt="" />
            <span>Add</span>
          </div> 
          <div class="more-horizontal" v-elementEvent @click="moreHandle">
            <img src="../../../static/collection/more_horizontal@2x.png" alt="" />
          </div>
        </div>
      </div>

      <div class="collections-detail-container">
        <ProductsSingle
          :productsData="detaileList"
          :isCollection="true"
          :removeCurrentShop="removeCurrentShop"
          :amplitude='amplitude'
        />
      </div>
      <el-dialog
        title="提示"
        custom-class="del-collections-product"
        :show-close="false"
        :visible.sync="delDialogVisible"
      >
        <div slot="title" class="del-collections-product-title">
          <span class="name">Remove from Collection</span>
          <span class="close"  @click="closeCollection"> 
            <img src="../../../static/modelClose@2x.png" alt="" />
          </span>
        </div>
        <div class="del-collectins-tip" v-if="detaileList.length > 0">
          Are you sure you want to remove this item from {{collectionName}}
        </div>
        <div class="del-collectins-button">
          <div class="delete-btn" v-elementEvent @click="handleDelete">
            Remove
          </div>
          <div class="cancel-btn" v-elementEvent @click="handleCancel">
            Cancel
          </div>
        </div>
      </el-dialog>
      <!-- <DialogTip :dialogVisible.sync='openComingDialong' :title="'Share Collection'" @childContinue='childContinue'>
      </DialogTip> -->
      <ShopifyDialogTip :dialogVisible.sync='openComingShopifyDialong' >
      </ShopifyDialogTip>
      <ExportToShopify  v-if="openExportToShopify" :total='total' :openExportToShopify.sync='openExportToShopify' :collectionId='id' :collectionName="collectionName" :amplitude='amplitude' @closeAll='closeAll' :dialogVisible.sync='firstModel' />
      <!-- 没有店铺去绑定店铺 -->
      <!-- <el-dialog class="channels-dialog-add" custom-class="shopify-connect-collections" title="Add New Channel" v-if="dialogFormVisibleAdd" :visible.sync="dialogFormVisibleAdd" center @close="closeDialog">
        <el-form :model="dialogAddChanels" @submit.native.prevent ref="addForm" :rules="rules">
          <el-form-item prop="name">
            <el-input ref="inputNewChannel" v-model="dialogAddChanels.name" v-focus  @keyup.enter.native='dialogChannelsAdd(dialogAddChanels)' autocomplete="off" size="large" @input="onInput()">
              <template slot="prepend">https://</template>
              <template slot="append">.myshopify.com</template>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <div v-if="dialogAddChanels.name.toString().length" class="dialog-btntext" @click="dialogChannelsAdd(dialogAddChanels)">Continue</div>
          <div v-else class="dialog-btntext btntext-disabled">Continue</div>
        </div>
      </el-dialog> -->
      <!-- 更多操作 -->
      <CollectionMore @upCollectionName='upCollectionName' :isDefaultCollection='isDefaultCollection' :dialogVisible.sync='openMore' :isComingProduct='isComingProduct' :id='id' />
      <!-- 导出fb -->
      <ExportToFb v-if="showFb" @close='handleClose' :collectionId='id' :collectionName="collectionName" :exportType='0' :dialogVisible.sync="showFb" :productId="null" :productInfo="detaileList"/>
      <!-- fb有预发布提示 -->
      <DialogTip :dialogVisible.sync='openFbComingDialong' :title="'Add to Facebook Shop'" @childContinue='childContinue'>
      </DialogTip>
      <open-add-popup v-if="!isTourist" :dialogVisible.sync='eventOpenAddPopup' :amplitude='amplitude' :hiddenItem='hiddenItem' :product='currentCollection' @updateProductStore='updateProductStore' :width="'400px'" />
      <el-backtop :bottom="100" :right="20" target=".collections-detail-page">
        <div class="products-top">
          <img src="../../../static/top@2x.png" alt="">
        </div>
      </el-backtop>
      <!-- <submit-shopify :dialogFormVisible="dialogFormVisibleShopify" @dialogClose="dialogCloseShopify"></submit-shopify> -->
    </div>
   
  </div>
</template>

<script>
import ProductsSingle from "@/views/products/components/productSingle";
// import ExportToShopify from "@/views/collections/components/exportToShopify";
import ExportToShopify from "@/views/products/components/exportSingleToShopify";
import DialogTip from "@/views/collections/components/dialogTip";
import ShopifyDialogTip from "@/views/collections/components/shopifyDialogTip";
import CollectionMore from "@/views/collections/components/collectionMore";
import ExportToFb from "@/views/products/components/exportFb";
import productShare from '@/mixins/share'
// import { connectShopifyStore, registerCustomApp, switchShopify } from "@/api/channels";
// import SubmitShopify from '@/components/SubmitShopify.vue';
import {
  shopifyStoreList,
} from "@/api/channels";
import {getStoragePrefix} from '@/utils/common'
import {
  productCollectionListDetail,
  editProductStatusAtSomeProductCollection,
  productCollectionIsDefault
} from "@/api/collections";
import openAddPopup from '@/views/products/components/openAddPopup'
import amplitudeMixins from "@/mixins/amplitudeMixins";
export default {
  name: "CollectionsDetail",
  mixins: [ productShare, amplitudeMixins ],
  data() {
    return {
      detaileList: [],
      shopifyNameList: [],
      // dialogAddChanels: {
      //   name: ''
      // },
      // rules: {
      //   name: []
      // },
      curPage: 1,
      pageSize: 10,
      openMore: false,
      showFb: false,//打开导出fb弹框
      delDialogVisible: false,
      // dialogFormVisibleAdd: false,
      currentExportData: null,
      openExportToShopify: false,
      firstModel: false,
      isFinished: false,
      isLoadProduct: false,
      remCurrentProduct: null,
      isComingProduct:false,//合集是否包含预发布商品
      openComingDialong:false,//打开预发布提示
      openComingShopifyDialong:false,//打开预发布导出提示
      total:'',
      id: "",
      collectionName: "",
      offsetTop: 0,
      isDefaultCollection: null,//是否默认合集
      openFbComingDialong:false,
      // isOpenShopify: true,
      // dialogFormVisibleShopify: false,
      hiddenItem:{
        addToCollection:true
      },
      eventOpenAddPopup:false,
      currentCollection:{},
      amplitude:{
        buy_sample:{
          page_code:'collection_listing_detail_page'
        },
        event_value_productsId: [],
        pv_id: ''
      }
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.collectionName = localStorage.getItem(getStoragePrefix('collectionName'));
    // this.getShopifyStoreList()
    // this.getCollectionShop();
  },
  components: {
    ProductsSingle,
    ExportToShopify,
    ShopifyDialogTip,
    DialogTip,
    CollectionMore,
    ExportToFb,
    // SubmitShopify,
    openAddPopup
  },
  beforeRouteLeave(to, from, next) {
    // 组件离开的时候，获取页面滚动高度
    this.offsetTop = document.querySelector('.collections-detail-page').scrollTop
    next()
  },
  activated() {
    document.title = 'My Collections - ' + localStorage.getItem(getStoragePrefix('collectionName'));
    if(this.id!=this.$route.query.id) {
      this.resetPageContent()
    }
    this.$EventBus.$off('upCollcetionDetail');
    this.$EventBus.$on('upCollcetionDetail',()=>{
      this.curPage = 1
      this.isFinished = false
      this.getCollectionIsDefault();
    })
    setTimeout(()=>{
      this.$nextTick(() => {
        document.querySelector('.collections-detail-page').scrollTop = this.offsetTop;
      });
    },10)
  },
  methods: {
    load() {
      if (this.isFinished || this.isLoadProduct) {
        return;
      }
      // this.getCollectionShop();
      this.getCollectionIsDefault()
    },
    // 重置页面内容
    resetPageContent() {
      this.id = this.$route.query.id
      this.collectionName = localStorage.getItem(getStoragePrefix('collectionName'))
      // this.getShopifyStoreList()
      this.isFinished = false
      this.detaileList = []
      this.curPage = 1
      this.load()
    },
    scrollDom() {
      this.domScroll('collection_listing_detail_page', 'collections-detail-page');
    },
    // 查询合集列表
    getCollectionShop() {
      var data, sucess, error, complete;
      this.isLoadProduct = true;
      const loading = this.$loading({
        lock: true,
        text: "",
        spinner: "el-icon-loading",
        background: "rgba(51,51,51,0.25)",
      });
      data = {
        collectionId: this.id,
        curPage: this.curPage,
        pageSize: this.pageSize,
      };
      sucess = (res) => {
        const { result,flag } = res;
        this.isComingProduct = flag
        const allPage = res.page.pages;
        const page = this.curPage;
        this.isFinished = page >= allPage;
        this.total = res.page.total
        if (this.curPage > 1) {
          this.detaileList = [...this.detaileList, ...result];
        } else {
          this.detaileList = result;
        }
        this.curPage++;
      };
      error = (res) => {
        console.log(res.data.message);
      };
      complete = () => {
        this.isLoadProduct = false;
        loading.close();
      };
      productCollectionListDetail(data, sucess, error, complete);
    },
    closeAll() {
      this.openExportToShopify = false
      this.firstModel = false
      // this.handleClose()
    },
    // 查询合集列表带是否默认合集
    getCollectionIsDefault() {
      var data, sucess, error, complete;
      this.isLoadProduct = true;
      const loading = this.$loading({
        lock: true,
        text: "",
        spinner: "el-icon-loading",
        background: "rgba(51,51,51,0.25)",
      });
      data = {
        collectionId: this.id,
        curPage: this.curPage,
        pageSize: this.pageSize,
      };
      sucess = (res) => {
        const { result,isDefault } = res.result;
        const {flag} = result;
        this.isDefaultCollection = isDefault
        this.isComingProduct = flag
        const allPage = result.page.pages;
        const page = this.curPage;
        this.isFinished = page >= allPage;
        this.total = result.page.total
        if (this.curPage > 1) {
          this.detaileList = [...this.detaileList, ...result.result];
        } else {
          this.detaileList = result.result;
        }
        this.curPage++;
        this.amplitudeFunc('collection_listing_detail_page', true); // true指瀑布流，不是翻页
      };
      error = (res) => {
        console.log(res.data.message);
      };
      complete = () => {
        this.isLoadProduct = false;
        loading.close();
      };
      productCollectionIsDefault(data, sucess, error, complete);
    },
    // handleopenExportToShopify() {
    //   if(this.isComingProduct) {
    //     this.openComingShopifyDialong = true
    //     return
    //   }else if(this.shopifyNameList.length==0) {
    //     this.dialogFormVisibleAdd = true
    //     return
    //   }
    //   this.openExportToShopify = true
    //   this.firstModel = true
    // },
    // onInput() {
    //   this.$refs['addForm'].clearValidate();
    // },
    // closeDialog() {
    //   this.dialogFormVisibleAdd = false;
    //   this.dialogAddChanels = { name: '' };
    // },
    // 获取绑定的shopify店铺
    getShopifyStoreList() {
      var data, sucess, error, complete;
      data = {
        storeType: 0,
        curPage: this.curPage,
        pageSize: this.pageSize,
      };
      sucess = (res) => {
        const { result } = res;
        if(result.length==0) {
          return
        }
        this.shopifyNameList = result;
      };
      error = (res) => {
        console.log(res.data.message);
      };
      complete = (res) => {
        console.log(res);
      };
      shopifyStoreList(data, sucess, error, complete);
    },
    // dialogChannelsAdd() {
    //   this.$refs['addForm'].validate((valid) => {
    //     if (valid) {
    //       const loading = this.$loading({
    //         lock: true,
    //         text: '',
    //         spinner: 'el-icon-loading',
    //         background: 'rgba(51, 51, 51, 0.25)'
    //       });
    //       switchShopify({},
    //       (res) => {
    //         this.isOpenShopify = res.result;
    //         const allInfo = JSON.parse(localStorage.getItem('ALLINFO'));
    //         allInfo.isOpenShopify = res.result;
    //         localStorage.setItem('ALLINFO', JSON.stringify(allInfo));
    //         if(this.isOpenShopify) {
    //           connectShopifyStore({
    //             storeName: this.dialogAddChanels.name + ".myshopify.com"
    //           },
    //           (res) => {
    //             this.dialogFormVisibleAdd = false;
    //             window.open(res.result, "_self");
    //             loading.close();
    //           },
    //           (err) => {
    //             loading.close();
    //             // 手动校验
    //             {
    //               const dom = this.$refs['addForm'];
    //               dom.clearValidate();
    //               this.rules.name.push({
    //                 validator: (rule, value, callback) => {
    //                   callback(err.data.message);
    //                 },
    //                 trigger: 'blur'
    //               })
    //               dom.validateField('name');
    //               this.rules.name = [];
    //             }
    //           },
    //           () => {})
    //         } else {
    //           registerCustomApp({
    //             domain: this.dialogAddChanels.name + ".myshopify.com",
    //             email: JSON.parse(localStorage.getItem('USERINFO')).email,
    //             mobile: JSON.parse(localStorage.getItem('USERINFO')).mobile,
    //             userId: JSON.parse(localStorage.getItem('USERINFO')).id
    //           },
    //           (res) => {
    //             loading.close();
    //             if(res.success) {
    //               this.dialogFormVisibleShopify = true;
    //             }
    //           },
    //           () => {
    //             loading.close();
    //           },
    //           () => {})
    //         }
    //       },
    //       (err) => {
    //         console.log(err);
    //       },
    //       () => {})
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    // 合集分享前判断是否有预发布商品
    // clooectionShareShop() {
    //    if(this.isComingProduct) {
    //     this.openComingDialong = true
    //     return
    //   }else {
    //     this.shareShop(this.id,'collection')
    //   }
    // },
    handleCancel() {
      this.delDialogVisible = false;
    },
    handleDelete() {
      this.editCollectionShop(this.remCurrentProduct)
    },
    closeCollection() {
      this.handleCancel();
    },
    removeCurrentShop(item) {
      this.remCurrentProduct = item
      this.delDialogVisible = true;
      // this.editCollectionShop(item)
    },
    // 添加或删除合集商品
    editCollectionShop(product) {
      var data, sucess, error, complete;
      data = {
        collectionId: this.id,
        productId: product.id,
        operate: 0, //1:添加,0:移除
      };
      sucess = () => {
        this.remCurrentProduct = null
        const findIndex = this.detaileList.findIndex(item=>{
          return item.id === product.id
        })
        if(findIndex!==-1) {
          this.detaileList.splice(findIndex,1)
        }else {
          this.curPage = 1
          this.getCollectionIsDefault()
        }
        // 更新合集列表
        this.$EventBus.$emit('upCollcetion');
        this.total--
        // this.getCollectionShop()
        // var index = this.detaileList.findIndex(item=>item.id==product.id)
        // this.detaileList.splice(index,1)
        this.handleCancel()
        console.log('第9个埋点------Remove from Collection-----', product);
        let uuId = JSON.parse(localStorage.getItem('USERINFO'))?JSON.parse(localStorage.getItem('USERINFO')).uuId:undefined;
        let productInfoOne = product;
        this.$gtm.trackEvent({
          event: 'remove_from_cart',
          userId: uuId,
          ecommerce: {
            Cstm_add_option: 'remove_from_collection',
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
        console.log(res.data.message);
      };
      complete = (res) => {
        console.log(res);
      };
      editProductStatusAtSomeProductCollection(data, sucess, error, complete);
    },
    childContinue() {
      this.showFb = true
      this.openFbComingDialong = false
      // this.shareShop(this.id,'collection')
    },
    backPage() {
      this.$router.back();
    },
    // 打开跟多操作
    moreHandle() {
      this.openMore = true
    },
    // 更新合集名称
    upCollectionName() {
      this.collectionName = localStorage.getItem(getStoragePrefix('collectionName'))
    },
    addToFacebook() {
      let USERINFO = JSON.parse(localStorage.getItem('USERINFO'));
      let domainName = USERINFO.domainName;
      if(!domainName) {
        this.$router.push({path: '/login/setup-info', query: {isShowSetUpLater: false}})
        return
      }
      if(this.isComingProduct) {
        this.openFbComingDialong = true
      }else {
        this.showFb = true
      }
    },
    // 关闭fb窗口
    handleClose() {
      this.showFb = false
    },
    // dialogCloseShopify() {
    //   this.dialogFormVisibleAdd = false;
    //   this.dialogFormVisibleShopify = false;
    //   this.dialogAddChanels = { name: "" };
    // },
    // 打开弹框操作合集
    openAddPopup() {
      this.currentCollection = {
        id:this.id,
        collectionName:this.collectionName
      };
      this.eventOpenAddPopup = true
    },
    updateProductStore() {
      this.curPage = 1
      this.isFinished = false
      this.getCollectionIsDefault();
    }
  },
};
</script>

<style lang="less">
.collections-detail-page {
  overflow: scroll;
  padding-top: 40px;
  height: 100%;
  box-sizing: border-box;
  // padding-bottom: 40px;
  // padding-left: 40px;
  .collections-detail-box {
    box-sizing: border-box;
    max-width: 1320px;
    margin: 0 auto;
  }
  .collections-detail-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    // padding-right: 48px;
    .back-img {
      display: flex;
      align-items: center;
      .collection-text {
        margin: 0 16px;
        font-weight: bold;
        font-size: 24px;
        line-height: 33px;
        white-space: nowrap;
        max-width: 450px;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #000;
      }
      .collection-number {
        font-weight: 500;
        font-size: 18px;
        color: #333333;
        line-height: 25px;
      }
      .seft-back-img-container {
        &:hover {
          background: rgba(51, 51, 51, .2);
        }
        &:hover + .back-text {
          display: inline;
        }
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;
        justify-content: center;
        width: 24px;
        height: 24px;
        font-size: 0;
        background: rgba(51, 51, 51, .1);
        border-radius: 50%;
        cursor: pointer;
        img {
          margin-right: 2px;
          margin-bottom: 1px;
          width: 7px;
          height: 11px;
        }
      }
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
    }
    .collections-handle {
      display: flex;
      .more-horizontal {
        display: flex;
        align-items: center;
        justify-content:center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #eeeeee;
        img {
          height: 5px;
          width: 20px;
        }
      }
      .collections-handle-item {
        &:nth-child(2) {
          margin: 0 24px;
        }
        &:nth-child(1) {
          padding: 0 29px 0 9px;
          margin-right: 24px;
        }
        display: flex;
        align-items: center;
        background: #eeeeee;
        height: 40px;
        padding: 0 20px 0 8px;
        border-radius: 20px;
        img {
          display: inline-block;
          width: 24px;
          height: 24px;
          margin-right: 8px;
        }
        span {
          font-size: 16px;
          line-height: 24px;
          color: #333333;
        }
      }
    }
  }
  .collections-detail-container {
    margin-top: 32px;
  }
  .del-collections-product {
    position: relative;
    width: 300px;
    // height: 220px;
    text-align: center;
    margin-top: 0 !important;
    transform: translateY(-50%);
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
      padding-top: 8px;
      padding-left: 24px;
      padding-right: 24px;
      padding-bottom: 24px;
    }
    // @import ;
    .del-collections-product-title {
      position: relative;
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
        // top: 16px;
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
    .del-collectins-tip {
      font-size: 14px;
      line-height: 18px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      color: #333;
    }
    .del-collectins-button {
      .delete-btn {
        margin: 16px 0;
        line-height: 40px;
        background: #333333;
        border-radius: 30px;
        font-weight: 600;
        font-size: 16px;
        color: #ffffff;
      }
      .cancel-btn {
        line-height: 40px;
        border: 1px solid #333333;
        font-weight: 600;
        font-size: 16px;
        color: #333333;
        border-radius: 30px;
      }
    }
  }
  // .channels-dialog-add {
  //     .el-form-item__content {
  //       .el-input-group__append {
  //         padding: 5px;
  //       }
  //     }
  //     .el-dialog__body {
  //       padding-bottom: 48px;
  //       .el-form-item {
  //         .el-form-item__error {
  //           padding-top: 8px;
  //           width: 100%;
  //           text-align: center;
  //         }
  //         margin-bottom: 0;
  //       }
  //     }
  //   }
  // .shopify-connect-collections {
  //   margin-top: -112px !important;
  //   // transform: translateY(-50%);
  // }
  .el-backtop {
    height: 60px;
    width: 60px;
    box-shadow: 0 0 0 0;
    .products-top {
      height: 60px;
      width: 60px;
      cursor: pointer;
      text-align: center;
      border-radius: 30px;
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 0px 5px 20px rgba(51, 51, 51, 0.15);
      backdrop-filter: blur(10px);
      img {
        height: 36px;
        width: 36px;
        margin-top: 15px;
      }
    }
  }
}
</style>