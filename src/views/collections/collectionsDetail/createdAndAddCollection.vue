<template>
  <div class="add-collection-component">
    <el-dialog
      title="提示"
      key="1"
      custom-class="add-to-collections-box"
      :show-close="false"
      :visible.sync="dialogVisible"
      :before-close="closeCollection"
    >
      <div slot="title" class="add-collections-box-title">
        <span class="name">Add to Collection</span>
        <span class="close" @click="closeCollection">
          <img src="../../../static/modelClose@2x.png" alt="" />
        </span>
      </div>
      <div class="collectins-tip"> 
        Go to “Collections” to add products to Shopify and other options.
      </div>
      <div class="collectins-list" infinite-scroll-distance='50' v-infinite-scroll="load">
        <div
          class="collection-single"
          v-for="collection in collections"
          :key="collection.id"
          @click="handleDditCollectionProduct(collection)"
        >
          <div class="collection-single-shop-img">
            <img
              v-imgError:big
              :src="img.mainImage"
              v-for="img in collection.productVos"
              :key="img.id"
              alt=""
            />
          </div>
          <div class="collection-single-name">
            <div class="collection-name">{{ collection.collectionName }}</div>
            <div class="collection-number">
              <div class="amount">{{ collection.totalDetail }} Items</div>
              <div class="input-box">
                <input
                  :id="'radio' + collection.id"
                  type="checkbox"
                  name="item"
                  v-model="collection.checked"
                  :value="collection.id"
                />
                <label :for="'radio' + collection.id">
                  <img class="collect circle" src="../../../static/circle@2x.png" alt="">
                  <img
                    class="collect"
                    src="../../../static/Collection@2x.png"
                    alt=""
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div
          class="collection-single add-collection"
          @click="createdAndAddCollection"
        >
          <div class="collection-single-shop-img add-img">
            <img src="../../../static/addCollction@2x.png" alt="" />
          </div>
          <div class="collection-single-name">
            <div class="add-title">Add</div>
            <div>New Collection</div>
          </div>
        </div>
      </div>
      <div class="collectins-bottom">
        <div class="affirm" v-elementEvent @click="closeCollection">
          OK
        </div>
      </div>
      <!-- <span slot="footer" class="dialog-footer"> </span> -->
    </el-dialog>

    <el-dialog
      title="提示"
      key="2"
      custom-class="careted-collections-box"
      :show-close="false"
      :visible.sync="CaretedAddDialogVisible"
      :before-close="closeCaretedAddDialogVisible"
    >
      <div slot="title" class="add-collections-box-title">
        <span class="name">Create New Collection</span>
        <span
          class="close"
          @click="closeCaretedAddDialogVisible"
        >
          <img src="../../../static/modelClose@2x.png" alt="" />
        </span>
      </div>
      <el-form ref="form" class="add-collection" :model="form">
        <el-form-item prop="name">
          <el-input
            class="add-collection-input no-content"
            ref="collectionName"
            maxlength="40"
            @input="notificationText=''"
            v-model="form.name"
            placeholder="Name your collection..."
          ></el-input>
        </el-form-item>
        <el-form-item v-if="notificationText">
          <div class="error-info">
            <p>
              <img class="collection-error" src="../../../static/collection/addCollectionError@2x.png" alt="">
              {{ notificationText }}
            </p>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="created-btn" v-elementEvent :class="{error:notificationText}" @click="createCollection">
            Create
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  productCollectionList,
  editProductStatusAtSomeProductCollection,
  addProductCollection
} from "@/api/collections";
import {myTrim} from '@/utils/common'
export default {
  name:'AddCollectionComponent',
  props:{
    dialogVisible:{
    },
    currentClickProductId:{

    },
    currentProduct:{}
  },
  data() {
    return {
      isFinished:false,
      isLoadProduct:false,
      CaretedAddDialogVisible:false,
      editCollectionLoading:false,
      curPage:1,
      pageSize:10,
      collections: [],
      notificationText: '',
      form: {
        name: "",
      },
    }
  },
  watch: {
    dialogVisible() {
      // this.getProductCollectionList(1);
    },
  },
  methods:{
    closeCollection() {
      this.$emit('update:dialogVisible', false)
    },
    // 加载更多
    load() {
      console.log("加载加载加载加载");
      if (this.isFinished || this.isLoadProduct) {
        return;
      }
      this.getProductCollectionList();
    },
    // 合集列表数据
    getProductCollectionList() {
      var data, sucess, error, complete;
      this.isLoadProduct = true;
      const loading = this.$loading({
        lock: true,
        text: "",
        spinner: "el-icon-loading",
        background: "rgba(51,51,51,0.25)",
      });
      data = {
        productId: null,
        curPage: this.curPage,
        pageSize: this.pageSize,
      };
      sucess = (res) => {
        console.log(res);
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
          console.log(this.currentClickProductId);
          if (item.productIds.indexOf(this.currentClickProductId-0) > -1) {
            item.checked = true;
          }
        });
        if (this.curPage > 1) {
          this.collections = [...this.collections, ...result];
        } else {
          this.collections = result;
        }
        this.curPage++;
      };
      error = (res) => {
        console.log(res);
      };
      complete = (res) => {
        this.isLoadProduct = false;
        loading.close();
        console.log(res);
      };
      productCollectionList(data, sucess, error, complete);
    },
     // 添加或删除合集商品
    editCollectionShop(collection,isCreated) {
      this.editCollectionLoading = true;
      var data, sucess, error, complete, operate;
      operate = collection.checked ? 0 : 1;
      data = {
        collectionId: collection.id,
        productId: this.currentClickProductId,
        operate, //1:添加,0:移除
      };
      sucess = (res) => {
        console.log(res);
        if(isCreated) {
          this.curPage = 1
          this.collections = []
          this.isFinished = false
        }
        this.mokEditProduct(collection,operate)
        // this.getProductCollectionList();
      };
      error = (res) => {
        console.log(res.data.message);
      };
      complete = (res) => {
        this.editCollectionLoading = false;
        console.log(res);
      };
      editProductStatusAtSomeProductCollection(data, sucess, error, complete);
    },
    // 前端模拟删除或者添加商品到合集
    mokEditProduct(collection,operate) {
      console.log(collection,'cococcocooc',operate);
      // 模拟添加数据
      // if(collection.productVos==0) {
      //   console.log(123);
      //   var index = collection.productVos.findIndex((item)=>item.id==this.currentProduct.id)
      //   var productIdsIndex = collection.productIds.indexOf(this.currentProduct.id)
      //   console.log(index);
      //   if(index>-1){
      //     collection.productVos.splice(index,1)
      //   }else {
      //     collection.productVos.splice(0,0,this.currentProduct)
      //   }
      //   if(productIdsIndex>-1){
      //     collection.productIds.splice(productIdsIndex,1)
      //   }else {
      //     collection.productIds.splice(0,0,this.currentProduct.id)
      //   }
      //   collection.checked = operate==1?true:false
      //   collection.totalDetail = operate==1?++collection.totalDetail:--collection.totalDetail
      //   collection.productVos = collection.productVos.slice(0,3)
      //   if(collection.productVos.length<3) {
      //     collection.productVos.push({})
      //   }
      // }
      this.curPage = 1
      this.getProductCollectionList()
      this.$emit('updateproduct',{operate})
    },
    // 创建并添加合集
    createdAndAddCollection() {
      this.CaretedAddDialogVisible = true
      this.$nextTick(()=>{
        this.$refs.collectionName.focus()
      })
      this.closeCollection()
    },
    // 关闭创建合集
    closeCaretedAddDialogVisible() {
      this.CaretedAddDialogVisible = false
      this.$emit('update:dialogVisible', true)
    },
    // 创建合集
    createCollection() {
      if(!this.form.name) {
        this.notificationText = 'The collection name cannot be blank.'
        return
      }
      this.createdAddCollection()

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
        this.CaretedAddDialogVisible = false;
        this.notificationText = ''
        this.form.name = ''
        this.$emit('update:dialogVisible', true)
        // 成功后执行添加合集
        const collectionObj = {id:collectionID,checked:false}
        this.handleDditCollectionProduct(collectionObj,true)
      };
      error = (res) => {
        console.log(res.data);
        console.log(res.data.message);
        this.notificationText = res.data.message
      };
      complete = (res) => {
        console.log(res);
      };
      addProductCollection(data, sucess, error, complete);
    },
    // 添加或删除合集商品
    handleDditCollectionProduct(item,isCreated) {
      if (this.editCollectionLoading) {
        return;
      }
      this.editCollectionShop(item,isCreated);
    },
  }
};
</script>

<style lang="less">
  @import '../../../styles/addCollectionAndCreated.less';

</style>