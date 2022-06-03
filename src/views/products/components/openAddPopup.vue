<template>
  <div class="open-add-popup-box">
    <el-dialog
      custom-class="open-add-popup"
      :visible.sync="openAddPopup"
      center
      :width="width"
      :title="title"
      :before-close="handleClose"
    >
    <div class="coming-product-tip" v-if="product&&product.status==1">
      This is a 'coming soon' item that customers can only preview.
    </div>
    <!--  addToCollection:false,
          addToTrendsiStore:false,
          addToShopify:false,
          addToFacebookShop:false, -->
      <div class="choice-row" v-if="!hiddenItem.addToCollection">
        <div class="choice-row-box" @click="addToCollection">
          <img src="../../../static/addToCollection@2x.png" alt="" />
          <span class="name">Add to Collection</span>
        </div>
      </div>
      <div class="title" :class="{noCollection:hiddenItem.addToCollection}">Channels</div>
      <div class="choice-row" :class="{disable:product&&product.status==1}" style="margin-bottom: 8px" @click="addToShopify">
        <div class="choice-row-box">
          <img src="../../../static/addToShopify@2x.png" alt="" />
          <span class="name">Add to Shopify</span>
        </div>
      </div>
      <div
        class="choice-row"
        style="margin-bottom: 8px"
        @click="addToTrendsi"
      >
        <div class="choice-row-box">
          <img src="../../../static/webStore@2x.png" alt="" />
          <span class="name">Add to Trendsi Store</span>
        </div>
      </div>
      <div
        class="choice-row"
        style="margin-bottom: 24px"
        @click="addToFacebook"
      >
        <div class="choice-row-box">
          <img src="../../../static/addToFb@2x.png" alt="" />
          <span class="name">Add to Facebook Shop</span>
        </div>
      </div>
    </el-dialog>
    <CreatedAndAddCollection
      v-if="showAddToCollection"
      :dialogVisible.sync="showAddToCollection"
      @updateproduct="updateproduct"
      @createdAddDefaultCollectionSuccessInfo='chidlCreatedAddDefaultCollectionSuccessInfo'
      :currentProduct="product"
      :currentClickProductId="product && product.id"
    />
    <!-- 已绑定店铺后的导出弹出框 -->
    <ExportToShopify :amplitude='amplitude' v-if="openExportToShopify&&!hiddenItem.addToCollection" @upadtaProduct='shopifyUpadtaProduct'  :openExportToShopify.sync='openExportToShopify' :single='true'  @closeAll='closeAll' :dialogVisible.sync='firstModel'   :currentExportData='[product]' />
    <ExportToShopify :amplitude='amplitude' v-if="openExportToShopify&&hiddenItem.addToCollection"  :openExportToShopify.sync='openExportToShopify' :collectionId='collectionId' :collectionName="product.collectionName" @closeAll='closeAll' :dialogVisible.sync='firstModel' />
    <!-- <ExportToShopify  v-if="openExportToShopify&&hiddenItem.addToCollection" @upadtaProduct='shopifyUpadtaProduct' :openExportToShopify.sync='openExportToShopify'  @closeAll='closeAll' :dialogVisible.sync='firstModel'   :currentExportData='collectionList' /> -->
    <!-- 绑定店铺弹框 -->
    <!-- fb有预发布提示 -->
    <DialogTip :dialogVisible.sync='openFbComingDialong' :title="'Add to Facebook Shop'" @childContinue='childContinue'>
    </DialogTip>
    <!-- 导出fb -->
    <ExportToFb v-if="showFb" @close='handleClose' :dialogVisible.sync="showFb" :collectionId='collectionId' :exportType='exportType' :productId='product && product.id' :productInfo="product" />
    <add-channels v-if="dialogFormVisibleAdd" @closeDialog="closeDialog"></add-channels>
    <!-- <el-dialog
      class="channels-dialog-add"
      custom-class="shopify-connect-collections"
      title="Add New Channel"
      v-if="dialogFormVisibleAdd"
      :visible.sync="dialogFormVisibleAdd"
      center
      @close="closeDialog"
    >
      <el-form :model="dialogAddChanels" @submit.native.prevent ref="addForm" :rules="rules">
        <el-form-item prop="name">
          <el-input
            ref="inputNewChannel"
            v-focus
            v-model="dialogAddChanels.name"
            autocomplete="off"
            size="large"
            placeholder="Enter Shopify domain"
            @input="onInput()"
            @keyup.enter.native='dialogChannelsAdd(dialogAddChanels)'
          >
            <template slot="prepend">https://</template>
            <template slot="append">.myshopify.com</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="channels-dialog-help"><a href="https://help.trendsi.com/knowledge/locating-shopify-handle" target="_blank">Where to find myshopify.com domain?</a></div>
      <div slot="footer" class="dialog-footer">
        <div
          v-if="dialogAddChanels.name.toString().length"
          class="dialog-btntext"
          @click="dialogChannelsAdd(dialogAddChanels)"
        >
          Continue
        </div>
        <div v-else class="dialog-btntext btntext-disabled">Continue</div>
      </div>
    </el-dialog>
    <submit-shopify :dialogFormVisible="dialogFormVisibleShopify" @dialogClose="dialogCloseShopify"></submit-shopify> -->
  </div>
</template>

<script>
import CreatedAndAddCollection from "./createdAndAddCollection";
import { addDefaultproductCollection,editProductStatusAtSomeProductCollection } from "@/api/collections";
import { shopifyStoreList, personalStoreProduct, addFromCollections } from "@/api/channels";
import successInfo from "@/mixins/successInfo";
import ExportToShopify from "./exportSingleToShopify";
import ExportToFb from "./exportFb";
import DialogTip from "@/views/collections/components/dialogTip";
import AddChannels from '@/components/AddChannels.vue';
// import SubmitShopify from '@/components/SubmitShopify.vue';

export default {
  props: {
    width: {},
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "Add",
    },
    product: {
      type: Object,
      default: () => {
        return {};
      },
    },
    parentShopifyNameList:{
      type: Boolean,
      default:false
    },
    shopifyNameList:{
      type: Array,
      default: () => {
        return [];
      },
    },
    hiddenItem:{
      type: Object,
      default: () => {
        return {
          addToCollection:false, //如果为真默认是合集的导出
          addToTrendsiStore:false,
          addToShopify:false,
          addToFacebookShop:false,
        };
      },
    },
    amplitude:{
      type: Object,
      default: () => {
        return {};
      },
    }
  },
  computed:{
    collectionId() {
      if(this.hiddenItem.addToCollection==true) {
        return this.product.id
      }
      return ''
    },
    // 0多个，1单个，2活动
    exportType() {
      if(this.hiddenItem.addToCollection==true) {
        return 0
      }
      return undefined
    }
  },
  watch:{
    dialogVisible(n) {
      if(n == true) {
        this.openAddPopup = n
        // 打开弹框就触发埋点
        this.openAddPopupBuriedPoint()
      }
    },
    // 活动页面店铺数据加载慢导致异常
    shopifyNameList() {
      this.selfShopifyNameList = this.shopifyNameList
    }
  },
  mixins: [successInfo],
  data() {
    return {
      showAddToCollection: false, //添加合集的弹窗
      showFb: false, //导出fb弹窗
      curPage: 1,
      defaultAddId: null,//默认添加到合集的id
      pageSize: 20,
      selfShopifyNameList: [],
      // dialogAddChanels: {
      //   name: "",
      // },
      // rules: {
      //   name: [],
      // },
      dialogFormVisibleAdd: false,
      openAddPopup: this.dialogVisible,
      firstModel: false,
      openExportToShopify: false,
      openFbComingDialong: false,
      productInfo: null,
      // isOpenShopify: true,
      dialogFormVisibleShopify: false
    };
  },
  components: {
    CreatedAndAddCollection,
    ExportToShopify,
    ExportToFb,
    DialogTip,
    AddChannels,
    // SubmitShopify
  },
  created() {
    if(this.parentShopifyNameList) {
      this.selfShopifyNameList = this.shopifyNameList
    }else {
      this.getShopifyStoreList();
    }
  },
  methods: {
    // 打开弹框的埋点事件
    openAddPopupBuriedPoint() {
      const page_code = this.amplitude.buy_sample.page_code;
      let rankVal, event_value, event_target;
      if(page_code === 'product_detail_page') {
        event_value = ''
      } else if(page_code === 'collection_listing_detail_page') {
        event_value = this.product.id;
      } else {
        this.amplitude.event_value_productsId.forEach((item, index)=>{
          if(item === this.product.id) {
            rankVal = index;
          }
        })
        event_value = [rankVal, this.product.id];
      }
      if(page_code === 'collection_listing_page' || page_code === 'collection_listing_detail_page') {
        event_target = 'collection';
      } else {
        event_target = 'button';
      }
      console.log(444, 'button埋点-----add', page_code, event_value, this.amplitude.pv_id);
      this.$amplitude.getInstance().logEvent('click', {
        'page_code': page_code,
        'module_code': '',
        'position_code': 'add',
        'event_target': event_target,
        'event_value': event_value,
        'pv_id': this.amplitude.pv_id,
        'url': window.location.href
      });
    },
    handleClose() {
      this.openAddPopup = false
      this.$emit("update:dialogVisible", false);
    },
    closeAll() {
      this.openExportToShopify = false
      this.handleClose()
    },
    // 更新数据
    updateproduct(parms) {
      this.handleClose()
      this.$emit('uPproduct',{id:this.product.id,number:parms.number})
    },
    // 导出小c成功更新数据
    updateProductStore() {
      this.$emit('updateProductStore',{product:this.product})
    },
    // shopify导出成功后更新数据
    shopifyUpadtaProduct(data) {
      console.log(data);
      if(data) {
        data[0].exportedToShopify = true
      }
    },
    // 添加到合集
    addToCollection() {
      // containProduct == 0 商品没有在任何合集，先添加到默认合集
      if (this.product.containProduct == 0) {
        // let info = {
        //   title:'Added To Collection',
        //   tip:'My Favorites.'
        // }
        // this.createdAddDefaultCollectionSuccessInfo(info,this.changeFun)
        this.handleAddDefaultproductCollection(this.product);
      } else {
        this.showAddToCollection = true;
      }
      // this.showAddToCollection = true
    },
    // 点击span打开商品合集
    changeFun(product) {
      this.showAddToCollection = true;
      this.$emit('uPcurrentProduct',{product})
      // this.editCollectionShop(productId)
    },
    // 子组件触发change
    chidlCreatedAddDefaultCollectionSuccessInfo(parms) {
      this.createdAddDefaultCollectionSuccessInfo(parms.info, this.changeFun,parms.product);
    },
     // 添加或删除合集商品
    editCollectionShop(productId) {
      this.editCollectionLoading = true;
      var data, sucess, error, complete, operate;
      operate = 0;
      data = {
        collectionId: this.defaultAddId,
        productId: productId,
        operate, //1:添加,0:移除
      };
      // return
      sucess = () => {
        // if(isCreated) {
        //   this.curPage = 1
        //   this.collections = []
        //   this.isFinished = false
        // }
        this.$emit('uPproduct',{id:productId,number:1})
        this.showAddToCollection = true;
        // this.getProductCollectionList();
      };
      error = (res) => {
        console.log(res.data.message);
      };
      complete = () => {
        this.editCollectionLoading = false;
      };
      editProductStatusAtSomeProductCollection(data, sucess, error, complete);
    },
    // 添加到shopify埋点
    addToShopifyBuriedPoint() {
      const page_code = this.amplitude.buy_sample.page_code
      let rankVal, event_value, event_target;
      if(page_code === 'product_detail_page') {
        event_value = ''
      } else if(page_code === 'collection_listing_detail_page') {
        event_value = this.product.id;
      } else {
        this.amplitude.event_value_productsId.forEach((item, index)=>{
          if(item === this.product.id) {
            rankVal = index;
          }
        })
        event_value = [rankVal, this.product.id];
      }
      if(page_code === 'collection_listing_page' || page_code === 'collection_listing_detail_page') {
        event_target = 'collection';
      } else {
        event_target = 'button';
      }
      console.log(555, 'button埋点-----add_to_shopify_option', page_code, event_value, this.amplitude.pv_id);
      this.$amplitude.getInstance().logEvent('click', {
        'page_code': page_code,
        'module_code': 'add_pop_up',
        'position_code': 'add_to_shopify_option',
        'event_target': event_target,
        'event_value': event_value,
        'pv_id': this.amplitude.pv_id,
        'url': window.location.href
      });
    },
    // 添加到Shopify
    addToShopify() {
      this.addToShopifyBuriedPoint()
      // 如果是预发布商品直接返回
      if(this.product.status==1) {
        return
      }
      // 先判断是否有shopify店铺没有去绑定一个，有的话继续操作
      // isHasShopify 返回值为真的话是 没有绑定店铺
      if (this.isHasShopify()) {
        this.handleClose()
        this.dialogFormVisibleAdd = true;
        return;
      }
      // 已经绑定店铺后
      this.openExportToShopify = true
      // this.dialogVisible2 = false
      this.firstModel = true
    },
    isHasShopify() {
      if (this.selfShopifyNameList.length == 0) {
        return true;
      }
    },
    // 添加到Facebook
    addToFacebook() {
      this.handleClose()
      let USERINFO = JSON.parse(localStorage.getItem('USERINFO'));
      let domainName = USERINFO.domainName;
      if(!domainName) {
        this.$router.push({path: '/login/setup-info', query: {isShowSetUpLater: false}})
        return
      }
      if(this.product.status==1) {
        this.openFbComingDialong = true
      }else {
        this.showFb = true
      }
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
      sucess = (res) => {
        // 成功后修改商品已添加到合集的状态,在弹窗添加成功
        // this.$emit('updateproduct',{currentProduct:this.currentProduct,operate:1})
        let info = {
          title: "Added To Collection",
          tip: res.result.collectionName,
        };
        this.$emit('uPproduct',{id:this.product.id,number:-1})
        this.defaultAddId = res.result.id
        this.handleClose();
        this.$EventBus.$emit('upCollcetion')
        this.$EventBus.$emit('upCollcetionDetail');
        this.createdAddDefaultCollectionSuccessInfo(info, this.changeFun,product);
        console.log('第4-1个埋点------add_to_collection-----', this.product);
        let uuId = JSON.parse(localStorage.getItem('USERINFO'))?JSON.parse(localStorage.getItem('USERINFO')).uuId:undefined;
        let productInfoOne = this.product;
        this.$gtm.trackEvent({
          event: 'add_to_cart',
          userId: uuId,
          ecommerce: {
            Cstm_add_option: 'add_to_collection',
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
        this.dialogVisible = true;
      };
      complete = () => {
        loading.close();
      };
      addDefaultproductCollection(data, sucess, error, complete);
    },
    // 获取绑定的shopify店铺
    getShopifyStoreList() {
      var data, sucess, error, complete;
      data = {
        storeType: 0,
        curPage: this.curPage,
        pageSize: 1000,
      };
      sucess = (res) => {
        const { result } = res;
        if (result.length == 0) {
          return;
        }
        this.selfShopifyNameList = result.filter(item=>item.storeType===0);
      };
      error = (res) => {
        console.log(res.data.message);
      };
      complete = () => {};
      shopifyStoreList(data, sucess, error, complete);
    },
    // dialogChannelsAdd() {
    //   this.$refs["addForm"].validate((valid) => {
    //     if (valid) {
    //       const loading = this.$loading({
    //         lock: true,
    //         text: "",
    //         spinner: "el-icon-loading",
    //         background: "rgba(51, 51, 51, 0.25)",
    //       });
    //       switchShopify({},
    //       (res) => {
    //         this.isOpenShopify = res.result;
    //         const allInfo = JSON.parse(localStorage.getItem('ALLINFO'));
    //         allInfo.isOpenShopify = res.result;
    //         localStorage.setItem('ALLINFO', JSON.stringify(allInfo));
    //         if(this.isOpenShopify) {
    //           connectShopifyStore(
    //             {
    //               storeName: this.dialogAddChanels.name + ".myshopify.com",
    //             },
    //             (res) => {
    //               this.dialogFormVisibleAdd = false;
    //               window.open(res.result, "_self");
    //               loading.close();
    //             },
    //             (res) => {
    //               loading.close();
    //               {
    //                 // 手动校验
    //                 const dom = this.$refs["addForm"];
    //                 dom.clearValidate();
    //                 this.rules.name.push({
    //                   validator: (rule, value, callback) => {
    //                     callback(
    //                       res.data.message
    //                     );
    //                   },
    //                   trigger: "blur",
    //                 });
    //                 dom.validateField("name");
    //                 this.rules.name = [];
    //               }
    //             },
    //             () => {}
    //           );
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
    // onInput() {
    //   this.$refs['addForm'].clearValidate();
    // },
    closeDialog() {
      this.dialogFormVisibleAdd = false;
      // this.dialogAddChanels = { name: "" };
    },
    childContinue() {
      this.showFb = true
      this.openFbComingDialong = false
      // this.shareShop(this.id,'collection')
    },
    // dialogCloseShopify() {
    //   this.dialogFormVisibleShopify = false;
    //   this.dialogFormVisibleAdd = false;
    //   this.dialogAddChanels = { name: "" };
    // },
    // 倒入小b自己店铺
    addToTrendsi() {
      const userInfo = JSON.parse(localStorage.getItem('USERINFO'));
      if( userInfo.domainName === null || userInfo.domainName === undefined || userInfo.domainName === '' ) {
        this.$router.push({path: '/login/setup-info', query: {isShowSetUpLater: false}})
        return
      }
      let data,launchFlag;
      // 如果是预发布商品在里面 不导出直接提示信息
      if(this.product.tagType===6) {
        launchFlag = true
      }
      if(launchFlag) {
        this.$notify({
          title: "Oops",
          message: 'This product can only be added to Trendsi Store post launch date.',
          iconClass:'el-icon-warning-outline',
          duration: 3000,
          showClose: false
        });
        return
      }
      
      if(!this.hiddenItem.addToCollection) {
        data = {
          "categoryId": undefined,
          "productInfos": [
            {
              "price": undefined,
              "productId": this.product.id
            }
          ],
        }
        personalStoreProduct(data,()=>{
          const tip = "This product has been added to your Trendsi store."
          const message = {
            title: "Added",
            tip: tip,
          };
          this.createdSuccessInfo(message);
          this.updateProductStore()
          this.handleClose()
        },(res)=>{
          if(res.data.code==500) {
            const tip = res.data.message
            const message = {
              title: "Added",
              tip: tip,
            };
            this.createdSuccessInfo(message);
            this.handleClose()
          }
        },()=>{
        })
      }else {
        data = {
          "categoryId": undefined,
          "collectionId": this.product.id,
        }
        addFromCollections(data,()=>{
          const message = {
            title: "Added",
            tip: "This collection has been added to your Trendsi store.",
          };
          this.createdSuccessInfo(message);
          this.updateProductStore()
          this.handleClose()
        },(res)=>{
          if(res.data.code==500) {
            const tip = res.data.message
            const message = {
              title: "Added",
              tip: tip,
            };
            this.createdSuccessInfo(message);
            this.handleClose()
          }
        },()=>{
        })
      }
      
    }
  },
};
</script>

<style lang="less">
.open-add-popup {
  margin-top: 0 !important;
  top: 50%;
  transform: translateY(-50%);
  .el-dialog__body {
    position: relative;
    overflow: hidden;
    & > .coming-product-tip {
      font-size: 12px;
      position: absolute;
      top: 0;
      color: #D88868;
    }
    & > .choice-row {
      cursor: pointer;
      &.disable {
        cursor: initial;
        .choice-row-box {
          background: #D8D8D8;
        }
      }
      .choice-row-box {
        width: 352px;
        height: 40px;
        background: #ffffff;
        border-radius: 8px;
        display: flex;
        align-items: center;
        img {
          display: block;
          height: 24px;
          width: 26px;
          margin-left: 8.6px;
        }
        .name {
          margin-left: 8.6px;
          font-family: Avenir Next;
          font-style: normal;
          font-weight: 500;
          font-size: 14px;
          line-height: 19px;
          color: #333333;
        }
      }
    }
    .title {
      font-family: Avenir Next;
      font-style: normal;
      font-weight: bold;
      font-size: 18px;
      line-height: 25px;
      color: #333333;
      margin: 28px 0 7px 0;
      &.noCollection {
        margin: 0 0 7px 0;
      }
    }
  }
}
// .open-add-popup-box {
  // .channels-dialog-add {
  //   input {
  //     &::-webkit-input-placeholder {
  //       font-size: 16px;
  //       font-weight: normal;
  //     }
  //     &::-moz-placeholder {
  //       font-size: 16px;
  //       font-weight: normal;
  //     }
  //   }
  //   .channels-dialog-help {
  //     text-align: center;
  //     margin-bottom: 16px;
  //     a {
  //       color: #333333;
  //       text-decoration: underline;
  //     }
  //     a:hover { opacity: 0.6; }
  //     a:active { opacity: 0.8; }
  //   }
  //   .el-form-item__content {
  //     .el-input-group__append {
  //       padding: 5px;
  //     }
  //   }
  //   // .el-dialog__body {
  //   //   padding-bottom: 48px;
  //   //   .el-form-item {
  //   //     .el-form-item__error {
  //   //       padding-top: 8px;
  //   //     }
  //   //     margin-bottom: 0;
  //   //   }
  //   // }
  //   .el-dialog__body {
  //     margin-bottom: 12px;
  //     .el-form-item {
  //       margin-bottom: 36px;
  //       .el-form-item__error {
  //         margin-top: 8px;
  //         text-align: center;
  //         width: 100%;
  //       }
  //     }
  //   }
  // }
  // .shopify-connect-collections {
  //   // margin-top: 0 !important;
  //   margin-top: -112px !important;
  //   // transform: translateY(-50%);
  // }
// }
</style>