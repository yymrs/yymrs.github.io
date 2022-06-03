<template>
  <div class="collections-page" v-infinite-scroll="load" infinite-scroll-distance='400'>
    <div class="collections-container ms">
      <div class="add-collections">
        <div class="add-collection" @click="openAddCollection">
          <img
            v-imgError
            class="add-collections-img"
            src="../../static/collection/addCollection@2x.png"
            alt=""
          />
          <span>Create New Collection</span>
        </div>
      </div>
      <div class="collections">
        <div
          class="collections-single"
          v-for="collection in collections"
          :key="collection.id"
          @click="showDetail(collection)"
        >
          <div class="img-box">
            <div
              class="single-img"
              v-for="(img,i) in collection.productVos"
              :key="i"
            >
              <img class="icon" v-imgError:big :src="img.mainImage" alt="" />
            </div>
          </div>
          <div class="collections-name">{{ collection.collectionName }}</div>
          <div class="collections-number">
            {{ collection.totalDetail?collection.totalDetail:0 }} {{collection.totalDetail==1?'Item':'Items'}}
          </div>
          <div class="collections-bottom-handle">
              <div
              class="del-collections"
              v-if="collection.defaultCollection!=1"
              @click.stop="Rename(collection)"
            >
              Rename
            </div>
            <div
              class="add-collections-open"
              @click.stop="openAddPopup(collection)"
            >
              Add
            </div>
          </div>
        </div>
      </div>
      <el-dialog
        title="提示"
        custom-class="del-collections-box"
        :show-close="false"
        :visible.sync="delDialogVisible"
      >
        <div slot="title" class="del-collections-box-title">
          <span class="name">Delete Collection</span>
          <span class="close" @click="closeCollection('delDialogVisible')">
            <img src="../../static/modelClose@2x.png" alt="" />
          </span>
        </div>
        <div class="del-collectins-tip">
          Are you sure you want to delete this collection?
        </div>
        <div class="del-collectins-button">
          <div class="delete-btn" v-elementEvent @click="handleDelete">
            Delete
          </div>
          <div class="cancel-btn" v-elementEvent @click="handleCancel">
            Cancel
          </div>
        </div>
      </el-dialog>
      <el-dialog
        title="Create New Collection"
        custom-class="created-add-collections-box"
        center
        :visible.sync="addDialogVisible"
        :before-close="handleCreatedClose"
      >
        <el-form ref="form" class="add-collection" @submit.native.prevent :model="form" :rules="rules">
          <el-form-item prop="name">
            <el-input
              ref="collectionName"
              class="add-collection-input"
              @keyup.enter.native='createCollection'
              @input="notificationText=''"
              maxlength="40"
              :class="{ 'no-content': form.name.length == 0 }"
              v-model="form.name"
              placeholder="Name your collection..."
            ></el-input>
          </el-form-item>
          <el-form-item v-if="notificationText">
            <div class="error-info">
              <p>
                <img class="collection-error" src="../../static/collection/addCollectionError@2x.png" alt="">
                {{ notificationText }}
              </p>
            </div>
          </el-form-item>
          <el-form-item>
            <div class="created-btn" :class="{error:notificationText}"  @click="createCollection">
              Create
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-backtop :bottom="100" :right="20" target=".collections-page">
        <div class="collections-top">
          <img src="../../static/top@2x.png" alt="">
        </div>
      </el-backtop>

      <!-- 编辑名称弹框 -->
      <el-dialog
        custom-class="edit-collection-name"
        :visible.sync="openReanmeDialog"
        center
        :width="'300px'"
        :title="'Rename Collection'"
        :before-close="renameHandleClose"
      >
        <el-form ref="form" class="add-collection" :model="renameForm">
          <el-form-item prop="name">
            <el-input
              class="add-collection-input no-content rename"
              ref="collectionName"
              maxlength="40"
              @input="renameNotificationText = ''"
              v-model="renameForm.name"
              placeholder="Name your collection..."
            ></el-input>
          </el-form-item>
          <div class="error-info" v-if="renameNotificationText">
            <p>
              <img
                class="collection-error"
                src="../../static/collection/addCollectionError@2x.png"
                alt=""
              />
              {{ renameNotificationText }}
            </p>
          </div>
          <el-form-item>
            <div
              class="created-btn"
              v-elementEvent
              :class="{ error: renameNotificationText }"
              @click="saveName"
            >
              Save
            </div>
          </el-form-item>
        </el-form>
      </el-dialog>
      <open-add-popup v-if="!isTourist" :dialogVisible.sync='eventOpenAddPopup' :amplitude='amplitude' :hiddenItem='hiddenItem' :product='currentCollection' :width="'400px'" />
    </div>
  </div>
</template>

<script>
import {
  productCollectionList,
  addProductCollection,
  delProductCollection,
  editproductCollectionName
} from "@/api/collections";
import successInfo from "@/mixins/successInfo";
import {getStoragePrefix,myTrim} from '@/utils/common'
import {mapMutations,mapState} from 'vuex'
import openAddPopup from '@/views/products/components/openAddPopup'
export default {
  name: "Collections",
  data() {
    return {
      curPage: 1,
      pageSize: 10,
      collctionName: "",
      form: {
        name: "",
      },
      renameForm: {
        name: "",
      },
      notificationText: "",
      renameNotificationText: "",
      delDialogVisible: false,
      addDialogVisible: false,
      isFinished: false,
      isLoadCollection: false,
      delCollectionLoading: false,
      cartedCollectionLoading: false,
      currentSelCollId: null,
      collections: [],
      collectionsId: [],
      rules: {
        name: [
          // { required: true, message: "请输入活动名称", trigger: "blur" },
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
      offsetTop:0,
      openReanmeDialog:false,
      eventOpenAddPopup:false,
      currentRenameCollection:null,//重制名称合集
      currentCollection:{},//当前操作合集
      hiddenItem:{
        addToCollection:true
      },
      amplitude:{
        buy_sample:{
          page_code:'collection_listing_page',
        },
        event_value_productsId: []
      }
    };
  },
  computed:mapState('layout',[
    // map this.count to store.state.count
    'isAddCollection'
  ]),
  components:{
    openAddPopup
  },
  mixins: [successInfo],
  beforeRouteLeave(to, from, next) {
    // 组件离开的时候，获取页面滚动高度
    this.offsetTop = document.querySelector('.collections-page').scrollTop
    next()
  },
  activated() {
    this.$EventBus.$off('addCollection');
    this.$EventBus.$on('addCollection',()=>{
      console.log('bus');
      if (this.isAddCollection) {
        this.openAddCollection();
        this.SET_AddCollection(false);
      }
    })
    setTimeout(()=>{
      this.$nextTick(() => {
        document.querySelector('.collections-page').scrollTop = this.offsetTop;
      });
    },10)
  },
  created() {
    if (this.isAddCollection) {
      this.openAddCollection();
      this.SET_AddCollection(false);
    }
    this.$EventBus.$off('upCollcetion');
    this.$EventBus.$on('upCollcetion',()=>{
      console.log('来了');
      this.curPage = 1
      this.isFinished = false
      this.getProductCollectionList();
    })
  },
  methods: {
    ...mapMutations('layout',[
      'SET_AddCollection'
    ]),
    load() {
      console.log("加载加载加载加载");
      if (this.isFinished || this.isLoadCollection) {
        return;
      }
      this.getProductCollectionList();
    },
    getProductCollectionList() {
      var data, sucess, error, complete;
      this.isLoadCollection = true;
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
        result.map((item) => {
          if (item.productVos.length < 3) {
            var fill = 3 - item.productVos.length;
            var fillArr = Array(fill).fill({});
            item.productVos.push(...fillArr);
          }
        });
        const allPage = res.page.pages;
        const page = this.curPage;
        this.isFinished = page >= allPage;
        if (this.curPage > 1) {
          this.sortCollections([...this.collections, ...result])
        } else {
          this.sortCollections(result)
        }
        this.curPage++;
        this.collectionsId = this.collections.map((item)=>{
          return item.id
        })
        this.amplitude.event_value_productsId = this.collectionsId;
      };
      error = (res) => {
        console.log(res);
      };
      complete = (res) => {
        this.isLoadCollection = false;
        loading.close();
        console.log(res);
      };
      productCollectionList(data, sucess, error, complete);
    },
    // 排序合集
    sortCollections(array) {
      if(array === null || array === undefined || array?.length===0){
        return 
      }
      // 没有默认合集
      if(array instanceof Array) {
        const defaultCollectionIndex = array.findIndex(item=>item.defaultCollection);
        let defaultCollection
        if(defaultCollectionIndex!=-1) {
          defaultCollection = array[defaultCollectionIndex];
          array.splice(defaultCollectionIndex,1);
          array.sort((a, b) => a.collectionName.localeCompare(b.collectionName))
          array.unshift(defaultCollection)
        }else {
          array.sort((a, b) => a.collectionName.localeCompare(b.collectionName))
        }
      }
      this.collections = array
    },
    // 查看合集详情
    showDetail(item) {
      localStorage.setItem(getStoragePrefix('collectionName'),item.collectionName)
      this.$router.push({
        path: "/collections/detail",
        query: {
          id: item.id,
        },
      });
    },
    // 打开添加合集
    openAddCollection() {
      this.addDialogVisible = true;
      this.$nextTick(()=>{
        this.$refs.collectionName.focus()
      })
    },
    // 删除合集
    openDeleteCollection(item) {
      console.log(item);
      this.currentSelCollId = item.id;
      this.delDialogVisible = true;
    },
    // 创建合集
    createCollection() {
      console.log(1);
      if (!this.form.name) {
        this.notificationText = "The collection name cannot be blank.";
        return;
      }
      if(this.cartedCollectionLoading) {
        return
      }
      this.addCollection();
    },
    handleDelete() {
      if(this.delCollectionLoading) {
        return
      }
      this.delCollection();
    },
    handleCancel() {
      this.delDialogVisible = false;
      this.currentSelCollId = null;
    },
    handleCreatedClose() {
      this.closeCollection()
    },
    closeCollection(name) {
      if (name == "delDialogVisible") {
        this.delDialogVisible = false;
      } else {
        this.form.name = ''
        this.notificationText = ''
        this.addDialogVisible = false;
      }
    },
    // 添加合集
    addCollection() {
      var data, sucess, error, complete;
      data = {
        collectionName: myTrim(this.form.name)
      };
      this.cartedCollectionLoading = true
      sucess = (res) => {
        console.log(res);
        this.closeCollection()
        var message = {
          title: "Collection Created",
          tip: "The collection has be created.",
        };
        this.createdSuccessInfo(message);
        this.curPage = 1
        this.isFinished = false
        this.getProductCollectionList();
      };
      error = (res) => {
        console.log(res.data);
        console.log(res.data.message);
        this.notificationText = res.data.message;
      };
      complete = (res) => {
        this.cartedCollectionLoading = false
        console.log(res);
      };
      addProductCollection(data, sucess, error, complete);
    },
    // 删除合集后的js删除数组
    delCollectionSuccess() {
      // var index = this.collections.findIndex((item)=>item.id == this.currentSelCollId)
      // this.collections.splice(index,1)
      this.curPage = 1
      this.isFinished = false
      this.getProductCollectionList()
    },
    // 删除合集
    delCollection() {
      var data, sucess, error, complete;
      data = {
        collectionId: this.currentSelCollId
      };
      this.delCollectionLoading = true
      sucess = (res) => {
        console.log(res);
        this.delDialogVisible = false;
        var message = {
          title: "Collection Deleted",
          tip: "The collection has  be deleted.",
        };
        this.createdSuccessInfo(message);
        this.delCollectionSuccess();
        // const { result } = res;
        // this.collections = result;
      };
      error = (res) => {
        console.log(res.data.message);
      };
      complete = (res) => {
        this.delCollectionLoading = false
        console.log(res);
      };
      delProductCollection(data, sucess, error, complete);
    },
    // 打开弹框操作合集
    openAddPopup(collection) {
      this.currentCollection = collection;
      this.eventOpenAddPopup = true
    },
    Rename(collection) {
      this.renameForm.name = collection.collectionName;
      this.currentRenameCollection = collection;
      this.openReanmeDialog = true;
    },
    renameHandleClose() {
      this.openReanmeDialog = false;
      this.renameNotificationText = '';
      this.renameForm.name = "";
      this.currentRenameCollection = null
    },
    saveName() {
      var data, sucess, error, complete;
      data = {
        collectionName: myTrim(this.renameForm.name),
        collectionId: this.currentRenameCollection.id,
      };
      if (!this.renameForm.name) {
        this.renameNotificationText = "The collection name cannot be blank.";
        return;
      }
      if (this.renameForm.name == this.currentRenameCollection.collectionName) {
        this.renameNotificationText = "The edit name is the same as the original name";
        return;
      }
      sucess = () => {
        this.currentRenameCollection.collectionName = this.renameForm.name
        this.renameHandleClose()
        let info = {
          title: "Collection Renamed",
          tip: "The collection has been reamed",
        };
        this.createdSuccessInfo(info);
      };
      error = (res) => {
        console.log(res.data.message);
        this.renameNotificationText = res.data.message;
      };
      complete = () => {
      };
      editproductCollectionName(data, sucess, error, complete);
    },
  },
};
</script>

<style lang='less'>
.collections-page {
  // margin-left: 40px;
  // padding-top: 40px;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  // padding-bottom: 40px;
  .collections-container {
    box-sizing: border-box;
    max-width: 1320px;
    margin: 24px auto 24px;
    // padding-top: 24px;
    // padding-bottom: 24px;
    .add-collections {
      display: flex;
      justify-content: flex-end;
      padding-right: 48px;
      .add-collection {
        height: 40px;
        width: 226px;
        cursor: pointer;
        background: #eeeeee;
        border-radius: 20px;
        display: flex;
        align-items: center;
        &:hover {
          opacity: 0.6;
        }
        &:active {
          opacity: 0.8;
        }
        .add-collections-img {
          width: 24px;
          height: 24px;
          margin-left: 6px;
          margin-right: 10px;
        }
        & > span {
          font-size: 16px;
          color: #333333;
        }
      }
    }
    .collections {
      display: flex;
      flex-wrap: wrap;
      // padding-left: 40px;
      .collections-single {
        cursor: pointer;
        &:hover {
          transition: all 0.3s;
          box-shadow: 10px 20px 40px rgba(147, 141, 128, 0.15);
        }
        &:hover .del-collections {
          opacity: 1;
          transition: all 0.3s;
        }
        &:hover .add-collections-open {
          opacity: 1;
          transition: all 0.3s;
        }
        margin-top: 16px;
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        margin-right: 5px;
        padding: 10px;
        padding-bottom: 0;
        height: 273px;
        background: #ffffff;
        border-radius: 25px;
        .img-box {
          width: 280px;
          height: 140px;
          background: #ffffff;
          border: 1px solid #eeeeee;
          box-sizing: border-box;
          border-radius: 20px;
          padding: 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          .single-img {
            font-size: 0;
            margin-right: 10px;
            .icon {
              object-fit: cover;
              width: 80px;
              height: 120px;
              border-radius: 10px;
              background: #c4c4c4;
            }
          }
        }
        .collections-name {
          margin: 14px 0 6px;
          font-weight: bold;
          font-size: 18px;
          line-height: 26px;
          color: #333333;
          max-width: 200px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        }
        .collections-bottom-handle {
          display: flex;
          width: 100%;
          justify-content: center;
        }
        .del-collections,.add-collections-open {
          opacity: 0;
          transition: opacity 0.3s;
          margin-top: 17px;
          max-width: 88px;
          flex: 1;
          text-align: center;
          height: 30px;
          line-height: 30px;
          background: #333333;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
          border-radius: 20px;
          color: #fff;
        }
        .add-collections-open {
          background: #C79818;
        }
        .del-collections {
          margin-right: 16px;
        }
        .collections-number {
          font-weight: 500;
          font-size: 14px;
          line-height: 150%;
          color: #333333;
        }
      }
    }
  }
  .el-backtop {
    height: 60px;
    width: 60px;
    box-shadow: 0 0 0 0;
    .collections-top {
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
.created-add-collections-box {
  position: relative;
  width: 300px;
  height: 224px;
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
    margin-top: 24px;
    padding-top: 0px;
    padding-left: 24px;
    padding-right: 24px;
    padding-bottom: 24px;
    .el-input__inner {
      border-radius: 10px !important;
    }
  }
  .el-form-item {
    margin-bottom: 0;
    .error-info {
      word-break: break-word;
      .collection-error {
        width: 10px;
        height: 10px;
      }
      margin-top: 9px;
      position: absolute;
      color: #f84240;
      line-height: 1;
      p {
        font-size: 12px;
      }
    }
  }
  .created-add-collections-box-title {
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
      line-height: 24px;
      flex: 1;
      text-align: center;
    }
  }
  .add-collection {
    & > .el-input--small {
      &.no-content {
        input {
          color: #979797;
          font-weight: 500;
          background: #fff;
          // background-color: rgba(51, 51, 51, 0.1);
        }
      }
      input {
        border-radius: 10px;
        height: 48px;
        font-size: 18px;
        line-height: 48px;
        // caret-color: red;
      }
      input:focus {
        border-color: initial;
      }
    }
  }

  .created-btn {
    text-align: center;
    cursor: pointer;
    margin-top: 48px;
    color: #fff;
    line-height: 40px;
    background: #333333;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 30px;
    &:hover {
      opacity: .6;
    }
    &:active {
      opacity: .8;
    }
    &.error {
      background: #333333;
      opacity: .1;
    }
  }
}
.del-collections-box {
  position: relative;
  width: 300px;
  height: 220px;
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
  }
  .del-collections-box-title {
    display: flex;
    .close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      cursor: pointer;
      text-align: center;
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
  .del-collectins-tip {
    font-size: 14px;
    line-height: 18px;
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
.edit-collection-name {
    margin-top: 0 !important;
    top: 50%;
    height: 224px;
    transform: translateY(-50%);
    & > .el-dialog__body {
      position: relative;
      .el-input__inner {
        border-radius: 10px !important;
      }
      .rename input {
        color: #333;
        font-weight: 500;
        font-size: 14px;
      }
    }
    .el-form-item {
      margin: 0;
    }
    .error-info {
      position: absolute;
      top: 90px;
      left: 15px;
      color: #f84240;
      word-break: break-word;
      line-height: 1;
      .collection-error {
        width: 10px;
        height: 10px;
      }
      p {
        font-size: 12px;
        // transform: scale(1,.8);
      }
    }
    .created-btn {
      color: #fff;
      line-height: 40px;
      margin-top: 48px;
      text-align: center;
      background: #333333;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      border-radius: 30px;
      &.error {
        background: #333333;
        opacity: 0.1 !important;
      }
    }
  }
@import "../../styles/selfNotify.less";
</style>