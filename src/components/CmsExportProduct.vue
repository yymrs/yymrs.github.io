<template>
  <div class="cms-export-product">
    <!-- <div
      class="handle-item"
      v-elementEvent
      @click="handleItem('openExportToShopify')"
    >
      <img src="@/static/collection/shopify@2x.png" />
      <span>Add to Shopify</span>
    </div>
    <div class="handle-item" v-elementEvent @click="handleItem('showFb')">
      <img src="@/static/collection/Facebook@2x.png" />
      <span>Add to Facebook Shop</span>
    </div> -->
    <div
      class="handle-item"
      v-elementEvent
      @click="handleItem('showAddToCollection')"
    >
      <img src="@/static/addToCollectionW@2x.png" alt="" />
      <span>Add to Collections</span>
    </div>
    <CreatedAndAddCollection
      v-if="showAddToCollection"
      :dialogVisible.sync="showAddToCollection"
      :cms='true'
      :cmsId='cmsId'
      @updateproduct="updateproduct"
      @createdAddDefaultCollectionSuccessInfo="
        chidlCreatedAddDefaultCollectionSuccessInfo
      "
      :currentProduct="seftProduct"
      :currentClickProductId="null"
    />
    <!-- 已绑定店铺后的导出弹出框 -->
    <!-- <ExportToShopify  v-if="openExportToShopify" :total='seftProduct.length' :openExportToShopify.sync='openExportToShopify' :collectionId='null' :collectionName="collectionName" @closeAll='closeAll' :dialogVisible.sync='firstModel' /> -->
    <ExportToShopify
      v-if="openExportToShopify"
      @upadtaProduct="shopifyUpadtaProduct"
      :openExportToShopify.sync="openExportToShopify"
      :cms="true"
      :cmsId='cmsId'
      :total="seftProduct.length"
      @closeAll="closeAll"
      :dialogVisible.sync="firstModel"
      :currentExportData="seftProduct"
      :amplitude='amplitude'
    />
    <!-- 绑定店铺弹框 -->
    <!-- fb有预发布提示 -->
    <DialogTip
      :dialogVisible.sync="openFbComingDialong"
      :title="'Add to Facebook Shop'"
      @childContinue="childContinue"
    >
    </DialogTip>
    <!-- 导出fb -->
    <ExportToFb
      v-if="showFb"
      @close="handleClose"
      :cms='true'
      :cmsId='cmsId'
      :dialogVisible.sync="showFb"
      :productId="null"
      :productInfo="seftProduct"
    />
    <!-- :cms='true' -->
    <add-channels v-if="dialogFormVisibleAdd"></add-channels>
  </div>
</template>

<script>
// import x from ''
import DialogTip from "@/views/collections/components/dialogTip";
import ExportToShopify from "@/views/products/components/exportSingleToShopify";
import ExportToFb from "@/views/products/components/exportFb";
import CreatedAndAddCollection from "@/views/products/components/createdAndAddCollection";
import AddChannels from "@/components/AddChannels";
import successInfo from '@/mixins/successInfo'
import { formatPrice } from "@/utils/common";
export default {
  components: {
    DialogTip,
    ExportToFb,
    ExportToShopify,
    CreatedAndAddCollection,
    AddChannels,
  },
  mixins:[successInfo],
  props: {
    parentProduct: {
      type: Array,
      default: () => {
        return [];
      },
    },
    shopifyNameList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    cmsId:{},
    amplitude:{
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      seftProduct: [],
      firstModel: false,
      dialogFormVisibleAdd: false, //没有店铺先添加店铺
      showFb: false, //导出fb
      openFbComingDialong: false, //商品里面有预发布的提示预发布商品不能导出
      openExportToShopify: false, //已绑定店铺后的导出弹出框
      showAddToCollection: false, //添加到合集弹出框
      formatPrice
    };
  },
  computed: {},
  watch: {
    parentProduct: {
      handler() {
        let filterProductArr = this.parentProduct.filter((item) => {
          if (item.componentType == 3) {
            return item;
          }
        });
        filterProductArr = JSON.parse(JSON.stringify(filterProductArr))
        this.seftProduct = [];
        filterProductArr.map((item) => {
          this.seftProduct.push(...item.productsPage);
        });
      },
      deep: true,
    },
  },
  mounted() {
    // this.seftProduct = this.parentProduct
  },
  methods: {
    handleItem(name) {
      if (name == "openExportToShopify") {
        let flag = this.isHasShopify();
        if (flag) {
          this.dialogFormVisibleAdd = true;
          return;
        }
        this.firstModel = true
      }
      this[name] = true;
    },
    childContinue() {
      this.showFb = true;
      this.openFbComingDialong = false;
    },
    closeAll() {
      this.openExportToShopify = false;
      this.firstModel = false;
    },
    handleClose() {},
    isHasShopify() {
      if (this.shopifyNameList.length == 0) {
        return true;
      }
    },
    shopifyUpadtaProduct() {},
    upadtaProduct() {},
    // 子组件触发change
    chidlCreatedAddDefaultCollectionSuccessInfo(parms) {
      console.log(parms);
      this.createdAddDefaultCollectionSuccessInfo(parms.info, ()=>{},parms.product,true);
      // this.createdAddDefaultCollectionSuccessInfo({}, ()=>{},{},true);
    },
    updateproduct() {},
  },
};
</script>
<style lang='less'>
.cms-export-product {
  display: flex;
  .handle-item {
    background: #eeeeee;
    border-radius: 20px;
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 20px 0 6px;
    margin-right: 10px;
    &:nth-child(3) {
      margin-right: 12px;
    }
    img {
      width: 24px;
      margin-right: 8px;
    }
    span {
      font-size: 16px;
      color: #333;
    }
  }
  
}
</style>