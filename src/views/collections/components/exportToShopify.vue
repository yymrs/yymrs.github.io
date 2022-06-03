<template>
  <div class="export-to-shopify">
    <el-dialog
      title="提示"
      custom-class="add-to-shopify"
      :show-close="false"
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
      :before-close="handleClose"
    >
      <div slot="title" class="add-to-shopify-title">
        <span class="name">Add to Shopify</span>
        <span class="close"  @click="closeCollection($event,'dialogVisible')">
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
      title="提示"
      custom-class="next-add-to-shopify"
      :show-close="false"
      :visible.sync="nextDialogVisible"
      :before-close="handleClose2"
      :modal-append-to-body="false"
    >
      <div slot="title" class="next-add-shopify-title">
        <span class="name">Export Collection</span>
        <span class="close"  @click="closeCollection">
          <img src="../../../static/modelClose@2x.png" alt="" />
        </span>
      </div>
      <div class="sel-shopify-info">
        <div class="shopify-name-box">
          <div class="tip">Export to</div>
          <div class="shopify-name">
            <img src="../../../static/collection/connetShopify@2x.png" alt="" />
            <span>{{ currentSelshopifyName }}</span>
          </div>
        </div>
        <div class="shopify-collection-name">
          <el-select
            popper-class="shopify-seft-sel"
            no-data-text='No Data'
            v-model="defaultShopName"
            placeholder="Select Shopify Collection"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <!-- 商品价格编辑 -->
      <div class="product-edit-price" infinite-scroll-distance='50' v-infinite-scroll="load">
        <div class="product-list">
          <div
            class="product-single"
            v-for="(product, index) in detaileList"
            :key="product.id"
          >
            <div class="left-mian-img">
              <img :src="product.mainImage" v-imgError:big />
            </div>
            <div class="right-main-info">
              <div class="title-and-brand">
                {{ product.brand }}{{ product.title }}
              </div>
              <div class="price-earn">
                Earn：<span
                  class="amount"
                  :class="{
                    loss: cmputedEditPriceLoss(product,cmputedPrice),
                  }"
                  >{{ cmputedPrice(product) }}</span
                >
              </div>
              <div class="edit-price-contrast">
                <div class="trendis-price">
                  <span class="name">Trendsi Price：</span>
                  <span class="amount">${{ product.minPriceB }}</span>
                </div>
                <div class="your-price">
                  <span class="name">Customer Price：</span>
                  <div
                    class="input-you-price"
                    :class="{
                      isedit: cmputedEditPrice(product, index),
                    }"
                  >
                    <span class="amount">$</span>
                    <input
                      type="text"
                      @input="inputMinPrice"
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
      <div class="export-to-shopify-btn-box">
        <div
          class="export-to-shopify-btn"
          :class="{disable:detaileList.length<=0}"
          v-elementEvent
          @click="exportProduct"
        >
          Export to Store
        </div>
      </div>
    </el-dialog>
    <!-- 正在导出提示 -->
    <div class="export-loading-container" v-if="exportLoading">
      <div class="loading-container">
        <div class="tip1">Exporting To Your Store</div>
        <div class="tip2">This may take a few minutes…</div>
      </div>
    </div>
    <div class="self-modal" v-if="exportLoading">
    </div>
  </div>
</template>

<script>
import {
  shopifyStoreList,
  shopifyStorecollections,
  shopifyExport,
} from "@/api/channels";
import successInfo from '@/mixins/successInfo'
import { productCollectionListDetail } from "@/api/collections";
import {accSub} from '@/utils/common'
import { Notification } from 'element-ui'
export default {
  name: "ExportToShopify",
  props: {
    currentExportData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    collectionId: {},
    dialogVisible: {},
    collcetionId: {},
  },
  mixins:[successInfo],
  data() {
    return {
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
      shopCurPage: 1,
      curPage: 1,
      collectionCurPage: 1,
      pageSize: 10,
      isFinished: false,
      isLoadCollection: false,
    };
  },
  created() {
    this.getShopifyStoreList();
    this.getCollectionShop();
  },
  methods: {
    closeCollection(e,name) {
      console.log(e);
      console.log(name);
      if(name) {
        this.$emit(`update:${name}`, false)
      }else {
        this.$emit(`update:dialogVisible`, false)
        this.$emit(`update:openExportToShopify`, false)
        this.nextDialogVisible = false
      }
      // this.dialogVisible = false;
    },
    // 查询合集列表
    getCollectionShop() {
      var data, sucess, error, complete;
      this.isLoadCollection = true;
      data = {
        collectionId: this.collectionId,
        curPage: this.collectionCurPage,
        pageSize: this.pageSize,
      };
     
      sucess = (res) => {
        console.log(res);
        const { result } = res;
        var copyList = JSON.parse(JSON.stringify(result));
        const allPage = res.page.pages;
        const page = this.collectionCurPage;
        this.isFinished = page >= allPage;
        if (this.collectionCurPage > 1) {
          this.originDetaileList = [...this.originDetaileList, ...copyList];
          this.detaileList = [...this.detaileList, ...result];
        } else {
          this.originDetaileList = copyList;
          this.detaileList = result;
        }
        this.collectionCurPage++;
      };
      error = (res) => {
        console.log(res.data.message);
      };
      complete = (res) => {
        this.isLoadCollection = false
        console.log(res);
      };
      productCollectionListDetail(data, sucess, error, complete);
    },
    // 导出shopify
    exportProduct() {
      if(this.detaileList.length<=0) {
        return
      }
      this.exportLoading = true;
      this.$nextTick(()=>{
        var modal = document.querySelector('.collections-detail-page').querySelector('.v-modal')
        modal.style.display = 'none'
        // modal.parentElement.removeChild(modal);
      })
      this.handleShopifyExport();
    },
    // 执行导出
    handleShopifyExport() {
      var data, sucess, error, complete,storeProduct;
      storeProduct = JSON.parse(JSON.stringify(this.detaileList))
      storeProduct.map((item)=>{
        // console.log(accSub(item.minPrice,item.minPriceB));
        item.maxEarn = accSub(item.minPrice,item.minPriceB)
      })
      data = {
        storeId: this.currentSelStoreId,
        collectionId:this.collcetionId,
        exportType:0,
        storeCollectionId: this.defaultShopName,
        storeProduct
      };
      sucess = (res) => {
        console.log(res);
        var message= {
          title:'Added',
          tip:'This collection has been successfully added to your shopify store.'
        }
        this.createdSuccessInfo(message)
        this.closeAllDialong()
      };
      error = (res) => {
        console.log(res.data.message);
        Notification({
					title: "Oops",
					message: res.data.message,
					iconClass:'el-icon-warning-outline',
					duration: 3000,
					showClose: false
				});
      };
      complete = (res) => {
        var modal = document.querySelector('.collections-detail-page').querySelector('.v-modal')
        modal.style.display = 'block'
        this.exportLoading = false;
        console.log(res);
      };
      shopifyExport(data, sucess, error, complete);
    },
    // 导出成功关闭所有弹窗
    closeAllDialong() {
      this.handleClose2()
      this.$emit('update:dialogVisible', false)
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
        // this.defaultShopName = result[0].id;
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
        pageSize: this.pageSize,
      };
      sucess = (res) => {
        console.log(res);
        const { result } = res;
        if(result.length==0) {
          return
        }
        this.shopifyNameList = result;
        this.currentSelID = this.shopifyNameList[0].id;
        this.currentSelStoreId = this.shopifyNameList[0].storeId;
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
    inputMinPrice() {},
    // 计算价格差
    cmputedPrice(product) {
      // debugger
      let minPrice = product.minPrice.toString();
      let index = minPrice.indexOf(".");
      let resultMinPrice = index>=0 ? minPrice.slice(0, index + 3) :minPrice+'.00';

      let minPriceB = product.minPriceB.toString();
      let indexB = minPriceB.indexOf(".");
      let resultMinPriceB = indexB>=0? minPriceB.slice(0, indexB + 3) :minPriceB+'.00';
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
    cmputedEditPriceLoss(product,fun) {
      return fun(product) < 0
    },
    // 加载数据
    load() {
      if (this.isFinished||this.isLoadCollection) {
        return;
      }
      console.log(2);
      this.getCollectionShop();
    },
    // 关闭第一层弹窗
    handleClose() {
      console.log('管不');
      this.$emit('update:dialogVisible', false)
      
      // this.dialogVisible = false;
    },
    // 关闭第二层弹窗
    handleClose2() {
      this.$emit(`update:dialogVisible`, false)
      this.$emit(`update:openExportToShopify`, false)
      this.nextDialogVisible = false
      // this.dialogVisible = false;
    },
    nextContinue() {
      if (!this.currentSelID) {
        return;
      }
      this.nextDialogVisible = true;
      this.getShopifyStorecollections();
    },
  },
};
</script>
<style lang="less">
.export-to-shopify {
  .self-modal {
    position: fixed;
    width: 100%;
    left: 0;
    z-index: 9998;
    top: 0;
    height: 100%;
    background: #000;
    opacity: .5;
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
      height: 198px;
      padding-top: 130px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      background: url(../../../static/waiting2.gif);
      align-items: center;
      background-size: cover;
      background-repeat: no-repeat;
      transform: translate(-50%, -50%);
      img {
        width: 100px;
        height: 100px;
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
        line-height: 19px;
        color: #ffffff;
        font-weight: 300;
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
        background: rgba(51,51,51,0.25)
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
    top: 50%;
    width: 704px;
    margin-top: 0 !important;
    height: 640px;
    transform: translateY(-50%);
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
      .el-select {
        width: 280px;
      }
      .el-input{
        input {
          height: 40px;
        }
        .el-input__inner {
          border-color: transparent;
          background: #fff;
        }
      }
    }
    .sel-shopify-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      .shopify-name-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #ffffff;
        padding: 0 16px;
        box-sizing: border-box;
        width: 360px;
        opacity: 0.5;
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
    //商品样式和修改价格
    .product-edit-price {
      height: 413px;
      overflow: auto;
      .product-list {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .product-single {
          cursor: pointer;
          margin-bottom: 16px;
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
                  color: #f84240;
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
                      color: #C79818;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .export-to-shopify-btn-box {
      display: flex;
      justify-content: center;
      margin-top: 24px;
      .export-to-shopify-btn {
        &.disable {
          opacity: .6;
        }
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
    max-height: 227px;
  }
}
@import '../../../styles/selfNotify.less';
</style>