<template>
  <div class="add-products-page" v-infinite-scroll="infiniteload">
    <div class="add-products ms">
    <el-backtop :bottom="100" :right="20" target=".add-products-page">
      <div class="backtop-img">
        <img src="@/static/top@2x.png" alt="">
      </div>
    </el-backtop>
    <div class="add-products-header">
      <div class="header-title">Added Products</div>
      <div class="header-select">
        <div class="shopify-name-box" ref="shopify_name_box">
          <el-select
            popper-class="se-shopify"
            no-data-text='No Data'
            v-model="currentSelStoreId"
            @change="changeShopify"
            placeholder="Select Shopify">
            <div slot="prefix">
              <img :src="selectImg" alt="">
            </div>
            <el-option
              v-for="item in shopifyNameList"
              :key="item.storeId"
              :label="item.domain || item.storeName"
              :value="item.storeId">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="header-number">{{ total }}{{ total===1?' Item': ' Items' }}</div>
      <div class="header-search-sub">
        <el-input
          class="header-search-input-sub"
          size="middle"
          clearable
          placeholder="Search Added Products"
          @keyup.enter.native="submitFormSearch(inputSearch)"
          @clear="submitFormSearch(inputSearch)"
          v-model="inputSearch">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
    </div>
    <div class="add-products-content">
      <div class="add-products-content-results" v-if="commonData.searchFlag && (searchKey!=='' && searchKey!==undefined && searchKey!==null)">Results for <span>'{{ searchKey }}'</span></div>
      <card-product @load='infiniteload' :storeType="currentSelStoreType" v-if="cardproducts.length" :cardproduct="cardproducts" @removeShopify="removeShopify" @viewShopify="viewShopify" />
      <div v-if="cardproducts.length===0 && isLoad!==true" class="no-data">
        <img src="../../static/noData@2x.png" alt="">
        <div class="no-data-results" :class="{ 'results-info': commonData.searchFlag }">No Results</div>
        <div v-if="commonData.searchFlag" class="no-data-search">Sorry, we can’t find what you're searching for.</div>
      </div>
    </div>
    <el-dialog class="dialog-cancelBtn" title="Remove" width="300px" :visible.sync="dialogFormVisibleCancel" center>
      <div><span>Are you sure you want to remove this product from {{ currentSelStoreType===0?'Shopify':'Trendsi Store' }}?</span></div>
      <div slot="footer" class="dialog-footer">
        <div class="dialog-btntext" @click="dialogCancelBtn()">Remove</div>
      </div>
    </el-dialog>
  </div>
  </div>
</template>

<script>
import CardProduct from '@/components/CardProduct.vue';
import { shopifyStoreList } from "@/api/channels";
import { addProductsList, addProductRemove, addProductsListTrendsi, addProductRemoveTrendsi } from "@/api/production";
export default {
  name: 'AddProducts',
  components: {
    CardProduct
  },
	data() {
		return {
      commonData: {
        searchFlag: false,
        removeStoreProductId: '',
        removeStoreProductInfo: null,
        offsetTop:0
      },
      total: 0,
      inputSearch: undefined,
      searchKey: '',
      cardproducts: [],
      isLoad: false,
      isFinished: false,
      loading: null,
      curPage: 1,
      pageSize: 10,
      shopifyNameList: [],
      // currentSelID: null,
      currentSelStoreId: null,
      currentSelStoreType: null, // 0:shopify店铺，1:Trendsi店铺
      // currentSelshopifyName: null,
      dialogFormVisibleCancel: false,
      selectImg: require('@/static/blackShopify@2x.png') // blackShopify blackStore
    }
  },
  computed: {
  },
  watch: {
    inputSearch() {
      if(this.inputSearch) {
        document.querySelectorAll(".header-search-input-sub > input")[0].style.cssText = 'background: #ffffff;border-color transparent;'; // box-shadow: inset 0px 2px 6px rgba(0, 0, 0, 0.15);
      } else {
        document.querySelectorAll(".header-search-input-sub > input")[0].style.cssText = 'background: #eeeeee;border-color transparent;'; // box-shadow: 0, 0, 0, 0;
      }
    }
  },
  beforeRouteLeave(to, from, next) { // 组件离开的时候，获取页面滚动高度
    this.commonData.offsetTop = document.querySelector('.add-products').scrollTop;
    next();
  },
  activated() {
    setTimeout(()=>{
      this.$nextTick(() => {
        document.querySelector('.add-products').scrollTop = this.commonData.offsetTop;
      });
    },10)
  },
  methods: {
    getlist(curPage, storeType, storeId, isLoading=false) {
    // getlist(curPage, storeId, isLoading=false) {
      if(isLoading) {
        this.loading = this.$loading({
          lock: true,
          text: '',
          spinner: 'el-icon-loading',
          background: 'rgba(51, 51, 51, 0.25)'
        });
      }
      this.isLoad = true;
      if(storeType === 0) { // shopify店铺
        addProductsList({
          curPage: curPage,
          pageSize: this.pageSize,
          storeId: storeId,
          title: this.inputSearch || undefined
        },
        (res) => {
          this.loading.close();
          this.isLoad = false;
          this.isFinished = res.page?(this.curPage >= res.page.pages):true;
          this.total = res.page.total;
          let listResult = res.result;
          if(res.result.length) {
            if (this.curPage > 1) {
              this.cardproducts = [...this.cardproducts, ...listResult];
            } else {
              this.cardproducts = listResult;
            }
            this.curPage++;
          }
        },
        () => {
          this.isLoad = false;
          this.isFinished = true;
          this.loading.close();
        },
        () => {})
      }
      if(storeType === 1) { // Trendsi 店铺
        addProductsListTrendsi({
          curPage: curPage,
          pageSize: this.pageSize,
          searchType: 1,
          searchContext: this.inputSearch || undefined
        },
        (res) => {
          this.loading.close();
          this.isLoad = false;
          this.isFinished = res.result?(this.curPage >= res.result.pages):true;
          this.total = res.result.total;
          let listResult = res.result.data;
          if(res.result.data.length) {
            if (this.curPage > 1) {
              this.cardproducts = [...this.cardproducts, ...listResult];
            } else {
              this.cardproducts = listResult;
            }
            this.curPage++;
          }
        },
        () => {
          this.isLoad = false;
          this.isFinished = true;
          this.loading.close();
        },
        () => {})
      }
    },
    getShopifyStoreList() {
      this.isLoad = true;
      this.loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      let data, sucess, error, complete;
      data = {
        storeType: 0,
        curPage: this.curPage,
        pageSize: this.pageSize,
      };
      sucess = (res) => {
        const { result } = res;
        if (result.length == 0) {
          this.cardproducts = [];
          this.loading.close();
          this.isFinished = true;
          this.isLoad = false;
          return; 
        } else {
          this.shopifyNameList = result;
          // this.currentSelID = this.shopifyNameList[0].id;
          this.currentSelStoreId = (this.$route.query && this.$route.query.storeId)
            ? Number(this.$route.query.storeId)
            : this.shopifyNameList[0].storeId
          this.currentSelStoreType = (this.$route.query && this.$route.query.storeId)
            ? 0
            : this.shopifyNameList[0].storeType
          this.selectImg = this.currentSelStoreType?require('../../static/blackStore@2x.png'):require('../../static/blackShopify@2x.png')
          // this.currentSelshopifyName = this.shopifyNameList[0].domain;
          this.getlist(this.curPage, this.currentSelStoreType, this.currentSelStoreId);
        }
      };
      error = () => {
        this.loading.close();
        this.isLoad = false;
        this.isFinished = true;
      };
      complete = () => {};
      shopifyStoreList(data, sucess, error, complete);
    },
    submitFormSearch() {
      this.commonData.searchFlag = true;
      this.searchKey = this.inputSearch;
      this.cardproducts = [];
      this.curPage = 1;
      this.getlist(this.curPage, this.currentSelStoreType, this.currentSelStoreId, true);
    },
    infiniteload() {
      if (this.isFinished || this.isLoad) {
        return;
      } else {
        this.getlist(this.curPage, this.currentSelStoreType, this.currentSelStoreId, true);
      }
    },
    removeShopify(val) {
      this.dialogFormVisibleCancel = true;
      this.commonData.removeStoreProductId = val.storeProductId ? val.storeProductId : val.productId;
      this.commonData.removeStoreProductInfo = val;
    },
    viewShopify(val) {
      if ( this.currentSelStoreType === 0 ) {
        window.open(val.url);
      }
      if ( this.currentSelStoreType === 1 ) {
        window.open(`${process.env.VUE_APP_BASE_URL}/products/detail?shopID=${val.shopId}&productId=${val.productId}`);
        // window.open(`${this.userInfo.domainName}/products/detail?shopID=${val.shopId}&productId=${val.productId}`);
      }
    },
    dialogCancelBtn() {
      this.isLoad = true;
      this.loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      if (this.currentSelStoreType === 0) {
        addProductRemove({
          storeProductId: this.commonData.removeStoreProductId
        },
        () => {
          this.cardproducts.forEach((r,index)=>{
            if(r.storeProductId === this.commonData.removeStoreProductId) {
              this.cardproducts.splice(index,1);
            }
          })
          this.total = this.total - 1;
          this.loading.close();
          this.isLoad = false;
          this.dialogFormVisibleCancel = false;
          console.log('第10-1个埋点------Remove from Shopify-----', this.commonData.removeStoreProductInfo);
          let productInfoOne = this.commonData.removeStoreProductInfo;
          this.$gtm.trackEvent({
            event: 'remove_from_cart',
            userId: JSON.parse(localStorage.getItem('USERINFO')).uuId,
            ecommerce: {
              Cstm_add_option: 'remove_from_shopify',
              items: [{
                item_name: productInfoOne.title,
                item_id: productInfoOne.productId,
                price: productInfoOne.price, // shopify 小c的价格
                item_brand: '',
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
        },
        (err) => {
          this.loading.close();
          this.isLoad = false;
          this.$notify({
            title: "Oops",
            message: err.data.message,
            iconClass:'el-icon-warning-outline',
            duration: 3000,
            showClose: false
          });
        },
        () => {})
      }
      if (this.currentSelStoreType === 1) {
        addProductRemoveTrendsi({
          productIds: [this.commonData.removeStoreProductId]
        },
        () => {
          this.cardproducts.forEach((r,index)=>{
            if(r.productId === this.commonData.removeStoreProductId) {
              this.cardproducts.splice(index,1);
            }
          })
          this.total = this.total - 1;
          this.loading.close();
          this.isLoad = false;
          this.dialogFormVisibleCancel = false;
          console.log('第10-2个埋点------Remove from Shopify-----', this.commonData.removeStoreProductInfo);
          let productInfoOne = this.commonData.removeStoreProductInfo;
          this.$gtm.trackEvent({
            event: 'remove_from_cart',
            userId: JSON.parse(localStorage.getItem('USERINFO')).uuId,
            ecommerce: {
              Cstm_add_option: 'remove_from_shopify',
              items: [{
                item_name: productInfoOne.title,
                item_id: productInfoOne.productId,
                price: productInfoOne.price || productInfoOne.minPrice, // shopify 小c的价格
                item_brand: '',
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
        },
        (err) => {
          this.loading.close();
          this.isLoad = false;
          this.$notify({
            title: "Oops",
            message: err.data.message,
            iconClass:'el-icon-warning-outline',
            duration: 3000,
            showClose: false
          });
        },
        () => {})
      }
    },
    changeShopify(val) {
      let storeInfo;
      this.shopifyNameList.forEach(item=>{
        if(val === item.storeId) {
          storeInfo = item
        }
      })
      this.cardproducts = [];
      this.curPage = 1;
      this.currentSelStoreType = storeInfo.storeType;
      this.getlist(this.curPage, storeInfo.storeType, val, true);
      if (this.currentSelStoreType === 0) {
        this.selectImg = require('../../static/blackShopify@2x.png')
      }
      if (this.currentSelStoreType === 1 || this.currentSelStoreType === null) {
        this.selectImg = require('../../static/blackStore@2x.png')
      }
    }
  },
	created() {
    this.getShopifyStoreList();
  },
  mounted() {
    // this.$nextTick(()=>{ // 改用插槽的方法
    //   let seShopify = this.$refs.shopify_name_box
    //   let span = document.createElement('span')
    //   let img = document.createElement('img')
    //   let input = seShopify.querySelector('input')
    //   if (this.currentSelStoreType === 0) {
    //     img.src = require('../../static/blackShopify@2x.png')
    //   }
    //   if (this.currentSelStoreType === 1 || this.currentSelStoreType === null) {
    //     img.src = require('../../static/blackStore@2x.png')
    //   }
    //   span.innerHTML = 'Export To:'
    //   span.classList =  'Export'
    //   input.parentElement.insertBefore(img,input)
    // })
  }
}
</script>

<style lang="less">
.add-products-page {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: auto;
    position: relative;
}
  .add-products {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    // overflow: auto;
    // overflow-y: scroll; // el-backtop
    // overflow-x: auto;
    // padding-left: 40px;
    max-width: 1320px;
    margin: 0 auto;
    @media screen and (min-width: 768px){
      .add-products {
        padding: 0 40px;
      }
    }
    .el-backtop {
      height: 60px;
      width: 60px;
      box-shadow: 0 0 0 0;
      .backtop-img {
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
    .add-products-header {
      width: 100%;
      margin-top: 24px;
      margin-bottom: 8px;
      display: inline-flex;
      align-items: center;
      & > div {
        display: inline-block;
      }
      .header-title {
        font-weight: bold;
        font-size: 24px;
        min-width: 187px;
        flex-shrink: 0;
      }
      .header-select {
        margin-left: 19px;
        width: 256px;
        flex-shrink: 0;
        .shopify-name-box {
          .el-input__inner {
            &.el-input__inner:focus {
              border-color: transparent;
            }
            border-radius: 10px;
          }
          .el-input {
            background: #fff;
            border-radius: 10px;
            border: 1px solid #EEEEEE;
            box-sizing: border-box;
            border-radius: 10px;
            // padding-left: 16px;
            display: flex;
            align-items: center;
            box-sizing: border-box;
            height: 40px;
            input {
              // height: 40px;
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
              margin-left: 14px;
              margin-right: 10px;
            }
            .el-input__inner {
              border-color: transparent;
              background: #fff;
              padding-left: 48px;
            }
            .el-input__prefix {
              display: inline-flex;
              align-items: center;
              height: 40px;
              line-height: 1;
              margin-left: -6px;
            }
          }
          .el-select {
            width: 100%;
          }
          display: flex;
          flex: 1;
          align-items: center;
          justify-content: space-between;
          box-sizing: border-box;
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
      }
      .header-number {
        font-size: 14px;
        color: #979797;
        margin-left: 16px;
        min-width: 100px;
      }
    }
    .add-products-content {
      .add-products-content-results {
        font-weight: normal;
        font-size: 16px;
        line-height: 24px;
        color: #979797;
        & > span {
          font-weight: bold;
          color: #333333;
        }
      }
      .no-data {
        // width: calc(100% - 260px);
        text-align: center;
        margin-top: 110px;
        & > img {
          width: 200px;
          height: 200px;
        }
        .no-data-results {
          font-weight: 500;
          font-size: 18px;
          margin-top: 16px;
          color: #333333;
        }
        .no-data-search {
          margin-top: 8px;
          font-weight: 500;
          font-size: 14px;
          color: #333333;
        }
        .results-info {
          font-weight: bold;
        }
      }
    }
    .dialog-cancelBtn {
      .el-dialog {
        margin-top: -82px !important;
        .el-dialog__header {
          line-height: 24px;
        }
        .el-dialog__body {
          padding: 8px 24px 16px 24px;
          text-align: center;
          line-height: 18px;
        }
      }
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
      max-height: 236px;
    }
  }
  @import "../../styles/searchSub.less";
  .add-products {
    .header-search-sub {
      margin-right: 171px;
    }
  }
</style>