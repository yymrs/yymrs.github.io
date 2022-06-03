<template>
  <div class="add-collection-component">
    <el-dialog
      title="Add to Collection"
      key="1"
      center
      :append-to-body='cms'
      custom-class="add-to-collections-box"
      :visible.sync="dialogVisible"
      :before-close="closeCollection"
    >
      <!-- <div slot="title" class="add-collections-box-title">
        <span class="name">Add to Collection</span>
        <span class="close" @click="closeCollection">
          <img src="../../../static/modelClose@2x.png" alt="" />
        </span>
      </div> -->
      <div class="collectins-tip"> 
        {{headerTip}}
      </div>
      <div class="collectins-list" infinite-scroll-distance='50' v-infinite-scroll="load">
        <div
          class="collection-single add-collection"
          @click="createdAndAddCollection"
        >
          <div class="collection-single-shop-img add-img">
            <img src="../../../static/addCollction@2x.png" alt="" />
          </div>
          <div class="collection-single-name">
            <div class="add-title">Create</div>
            <div>New Collection</div>
          </div>
        </div>
        <div
          class="collection-single"
          v-for="collection in collections"
          :key="collection.id"
          @click.stop="handleDditCollectionProduct(collection)"
        >
          <div class="collection-single-shop-img">
            <img
              :src="img.mainImage"
              v-for="img in collection.productVos"
              :key="img.id"
              alt=""
            />
          </div>
          <div class="collection-single-name">
            <div class="collection-name">{{ collection.collectionName }}</div>
            <div class="collection-number">
              <div class="amount" v-if="!cms&&classifyProductList.length==0">{{ collection.totalDetail>=1?collection.totalDetail:0 }} {{collection.totalDetail==1?'Item':'Items'}}</div>
              <div class="input-box">
                <input
                  @click.stop="stop($event)"
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
      </div>
      <div class="collectins-bottom">
        <div class="affirm" v-elementEvent @click="affirm">
          OK
        </div>
      </div>
    </el-dialog>
    <!-- 创建合集弹框 -->
    <el-dialog
      title="Create New Collection"
      key="2"
      :append-to-body='cms'
      center
      custom-class="careted-collections-box"
      :visible.sync="CaretedAddDialogVisible"
      :before-close="closeCaretedAddDialogVisible"
    >
      <el-form ref="form" class="add-collection" @submit.native.prevent :model="form">
        <el-form-item prop="name">
          <el-input
            class="add-collection-input no-content"
            ref="collectionName"
            maxlength="40"
            @input="notificationText=''"
            @keyup.enter.native='createCollection'
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
  productCollectionMulti,
  addProductCollection,
  cmsEditProductStatusAtSomeProductCollection
} from "@/api/collections";
import {myTrim} from '@/utils/common'
import successInfo from '@/mixins/successInfo'
export default {
  name:'AddCollectionComponent',
  props:{
    dialogVisible:{
    },
    currentClickProductId:{

    },
    currentProduct:{},
    // 活动页面导出合集
    cms:{
      type: Boolean,
      default:false
    },
    cmsId:{},
    // 分类页面导出需要的ids
    classifyProductList:{
      type:Array,
      default(){
        return []
      }
    }
  },
  mixins:[successInfo],
  computed:{
    headerTip() {
      const length = this.classifyProductList.length
      if(length==0) {
        return 'Go to “Collections” to add products to Shopify and other options.'
      }else {
        return `You are adding all ${length} products on current page to collection. `
      }
    }
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
      oldCollections: [],
      notificationText: '',
      form: {
        name: "",
      },
      clickCollectionArr:[]
    }
  },
  watch: {
    currentProduct: {
      handler() {
        console.log(this.currentProduct);
      },
      deep:true
      // this.getProductCollectionList(1);
    },
  },
  methods:{
    closeCollection(flag=true) {
      this.clickCollectionArr = []
      this.collections = this.oldCollections
      this.$emit('updateproduct',{number:0})
      if(flag) {
        this.$emit('update:dialogVisible', false)
      }
    },
    stop(e) {
      e.preventDefault()
      // this.handleDditCollectionProduct(collection)
      console.log(2);
    },
    // 加载更多
    load() {
      console.log("加载加载加载加载");
      if (this.isFinished || this.isLoadProduct) {
        return;
      }
      this.getProductCollectionList();
    },
    // 排序合集
    sortCollections(array) {
      if(array === null || array === undefined || array?.length===0){
        return []
      }
      if(array instanceof Array) {
        const defaultCollectionIndex = array.findIndex(item=>item.defaultCollection);
        const defaultCollection = array[defaultCollectionIndex];
        array.splice(defaultCollectionIndex,1);
        array.sort((a, b) => a.collectionName.localeCompare(b.collectionName))
        array.unshift(defaultCollection)
      }
      return array
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
        productId: this.currentClickProductId,
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
          if (item.containProduct >= 1) {
            item.checked = true;
          }else {
            item.checked = false;
          }
        });
        if (this.curPage > 1) {
          this.collections = this.sortCollections([...this.collections, ...result])
          this.oldCollections = this.sortCollections(JSON.parse(JSON.stringify([...this.oldCollections,...result])))
        } else {
          this.collections = this.sortCollections(result);
          this.oldCollections = this.sortCollections(JSON.parse(JSON.stringify(this.collections)))
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
     // 创建合集后执行的添加商品
    editCollectionShop(collection,isCreated) {
      if(this.editCollectionLoading) {
        return
      }
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
        this.mokEditProduct(collection,-1)
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
    mokEditProduct(collection,number) {
      console.log(collection,'cococcocooc',number);
      this.curPage = 1
      this.isFinished = false
      this.getProductCollectionList()
      this.$emit('updateproduct',{number})
      this.closeCollection()
    },
    // 创建并添加合集
    createdAndAddCollection() {
      this.CaretedAddDialogVisible = true
      this.$nextTick(()=>{
        this.$refs.collectionName.focus()
      })
      this.closeCollection(false)
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
        this.CaretedAddDialogVisible = false;
        this.notificationText = ''
        this.form.name = ''
        this.$emit('update:dialogVisible', true)
        this.$EventBus.$emit('upCollcetion')
        this.curPage = 1
        this.isFinished = false
        this.getProductCollectionList()
        // 成功后执行添加合集
        // const collectionObj = {id:collectionID,checked:false}
        // this.handleDditCollectionProduct(collectionObj,true)
        // this.editCollectionShop(collectionObj,true);
        // this.submitCollection(collectionObj,true)
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
    // 添加或删除合集商品到数组之后点击ok进行添加
    handleDditCollectionProduct(item) {
      // if (this.editCollectionLoading) {
      //   return;
      // }
      // debugger
      if(item.checked) {
        // 使用vue $set更新没有写在监听的数据对象
        this.$set(item,'checked', false)
        item.totalDetail = item.totalDetail-1
        // let mokeFindCollections = this.oldCollections.find((oldCollections)=>{
        //   return oldCollections.id == item.id
        // })
        // item.productVos = JSON.parse(JSON.stringify(mokeFindCollections.productVos))
        // let mokeFindIndex = item.productVos.findIndex((item)=>{
        //   return item.id = this.currentProduct.id
        // }) 
        // item.productVos.splice(mokeFindIndex,1)
        // if (item.productVos.length < 3) {
        //   var fill = 3 - item.productVos.length;
        //   var fillArr = Array(fill).fill({});
        //   item.productVos.push(...fillArr);
        // }
        // item.checked = false
        var index = this.clickCollectionArr.indexOf(item.id)
        this.clickCollectionArr.splice(index,1)
      }else {
        this.$set(item,'checked', true)
        // item.checked = true
        // let findIndex = item.productVos.findIndex((productVos)=>{
        //   return productVos.id == this.currentProduct.id
        // })
        // if(findIndex<0) {
        //   item.productVos.unshift(this.currentProduct);
        //   item.productVos = item.productVos.slice(0,3)
        // }
        item.totalDetail = item.totalDetail?item.totalDetail:0
        item.totalDetail = item.totalDetail+1
        this.clickCollectionArr.push(item.id)
      }
      console.log(item);
      // this.editCollectionShop(item,isCreated);
    },
    // 对比合集操作结果
    collectionHandle() {
      var addArr = []
      var remArr = []
      this.oldCollections.map((oldCollections)=>{
        var collections = this.collections.find((collections)=>{
          return collections.id == oldCollections.id
        })
        if(oldCollections.checked != collections.checked) {
          var id = collections.id
          collections.checked?addArr.push(id):remArr.push(id)
        }
      })
      return {
        addArr,
        remArr
      }
    },
    // 合集导出确认按钮
    affirm() {
      // 1.如果当前组件是活动页面调用 执行活动的导出方法
      // 2.分类页面导出
      // 3.正常导出
      if(this.cms) {
        this.cmsSubmitCollection()
      }else if(this.classifyProductList.length!=0) {
        this.classifySubmitCollection()
      }else {
        this.submitCollection()
      }
    },
    // 合集页面导出
    classifySubmitCollection() {
      if(this.editCollectionLoading) {
        return
      }
      this.editCollectionLoading = true;
      var data, sucess, error, complete ;
      // clickCollectionArr = this.clickCollectionArr.join(',')
      const collection = this.collectionHandle()
      console.log(collection);
      const ids = this.classifyProductList.map(item=>item.id)
      console.log(ids);
      data = {
        collectionIds:collection.addArr, // 合集id
        productIds: ids,
      };
      // console.log(data);
      if(data.collectionIds.length==0) {
        this.editCollectionLoading = false;
        this.closeCollection()
        return
      }
      sucess = (res) => {
        console.log(res);
        this.curPage = 1
        this.isFinished = false
       
        let info = {
          title:'Added To Collections',
          tip:'',
          ids
        }
        
        data.collectionIds.map((id)=>{
          this.collections.map((item)=>{
            if(item.id == id) {
              info.tip +=item.collectionName + ', '
            }
          })
        })
       
        info.tip = info.tip.substr(0, info.tip.length - 2);
        // 更新分类的商品到合集
        this.clickCollectionArr = []
        this.collections = this.oldCollections
        this.$emit('updateProductAll')
        this.$emit('update:dialogVisible', false)
        this.$EventBus.$emit('upCollcetion')
        this.$EventBus.$emit('upCollcetionDetail');
        this.$emit('createdAddDefaultCollectionSuccessInfo',{info,collectionIds:collection.addArr })
      };
      error = (res) => {
        console.log(res.data.message);
      };
      complete = (res) => {
        this.editCollectionLoading = false;
        console.log(res);
      };
      cmsEditProductStatusAtSomeProductCollection(data, sucess, error, complete);
    },
    // 活动导出合集
    cmsSubmitCollection() {
      if(this.editCollectionLoading) {
        return
      }
      this.editCollectionLoading = true;
      var data, sucess, error, complete ;
      // clickCollectionArr = this.clickCollectionArr.join(',')
      const collection = this.collectionHandle()
      console.log(collection);
      data = {
        collectionIds:collection.addArr, // 要导出的合集id
        cmsId: this.cmsId,
      };
      console.log(data);
      if(data.collectionIds.length==0) {
        this.editCollectionLoading = false;
        this.closeCollection()
        return
      }
      // return
      sucess = (res) => {
        console.log(res);
        this.curPage = 1
        this.isFinished = false
       
        let info = {
          title:'Added To Collections',
          tip:'',
        }
        
        data.collectionIds.map((id)=>{
          this.collections.map((item)=>{
            if(item.id == id) {
              info.tip +=item.collectionName + ', '
            }
          })
        })
       
        info.tip = info.tip.substr(0, info.tip.length - 2);
        // this.mokEditProduct(null,number)
        this.closeCollection()
        this.$EventBus.$emit('upCollcetion')
        this.$EventBus.$emit('upCollcetionDetail');
        this.$emit('createdAddDefaultCollectionSuccessInfo',{info,product:this.currentProduct })
      };
      error = (res) => {
        console.log(res.data.message);
      };
      complete = (res) => {
        this.editCollectionLoading = false;
        console.log(res);
      };
      cmsEditProductStatusAtSomeProductCollection(data, sucess, error, complete);
    },
    // 正常导出合集
    submitCollection(e,isCreated) {
      console.log(e,isCreated);
      if(this.editCollectionLoading) {
        return
      }
      this.editCollectionLoading = true;
      var data, sucess, error, complete ;
      // clickCollectionArr = this.clickCollectionArr.join(',')
      var collcetion = this.collectionHandle()
      console.log(collcetion);
      data = {
        addCollectionIds:collcetion.addArr,
        productId: this.currentClickProductId,
        removeCollectionIds:collcetion.remArr
      };
      if(data.addCollectionIds.length+data.removeCollectionIds.length==0) {
        this.editCollectionLoading = false;
        this.$emit('updateproduct',{number:0})
        this.closeCollection()
        return
      }
      console.log(this.collections);
      sucess = (res) => {
        console.log(res);
        this.curPage = 1
        this.isFinished = false
        // if(isCreated) {
        //   this.curPage = 1
        //   this.collections = []
        //   this.isFinished = false
        // }
        var number = collcetion.addArr.length + -collcetion.remArr.length
        if(number<0) {
          number = Math.abs(number)
        }else {
          number = -number
        }
        let info = {
          title:'Added To Collections',
          tip:'',
        }
        // var length = data.addCollectionIds.length+data.removeCollectionIds.length
        if(data.addCollectionIds.length>=1&&data.removeCollectionIds.length>=1) {
          info.title = 'Updated Collections'
        } else {
          if(data.addCollectionIds.length==0&&data.removeCollectionIds.length>=1) {
            if(data.removeCollectionIds.length>1) {
              info.title = 'Removed From Collections'
            }else {
              info.title = 'Removed From Collection'
            }
          }
        }
        data.addCollectionIds.map((id)=>{
          this.collections.map((item)=>{
            if(item.id == id) {
              info.tip +=item.collectionName + ', '
            }
          })
        })
        data.removeCollectionIds.map((id)=>{
          this.collections.map((item)=>{
            if(item.id == id) {
              info.tip += item.collectionName + ', '
            }
          })
        })
        info.tip = info.tip.substr(0, info.tip.length - 2);
        this.collections = []
        this.mokEditProduct(null,number)
        this.$EventBus.$emit('upCollcetion')
        this.$EventBus.$emit('upCollcetionDetail');
        this.$emit('createdAddDefaultCollectionSuccessInfo',{info,product:this.currentProduct })
        // this.createdAddDefaultCollectionSuccessInfo(info, this.changeFun,product);
        // this.getProductCollectionList();
        console.log('第4-2个埋点------add_to_collection-----', this.currentProduct);
        let uuId = JSON.parse(localStorage.getItem('USERINFO'))?JSON.parse(localStorage.getItem('USERINFO')).uuId:undefined;
        let productInfoOne = this.currentProduct;
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
        console.log(res.data.message);
      };
      complete = (res) => {
        this.editCollectionLoading = false;
        console.log(res);
      };
      productCollectionMulti(data, sucess, error, complete);
    }
  }
};
</script>

<style lang="less">
  @import '../../../styles/addCollectionAndCreated.less';

</style>