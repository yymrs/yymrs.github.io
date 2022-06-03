<template>
  <div class="collection-more">
    <el-dialog
      custom-class="open-collection-more-popup"
      :visible.sync="dialogVisible"
      center
      :width="'400px'"
      :title="'Collection'"
      :before-close="handleClose"
    >
      <div class="title">Actions</div>
      <div class="choice-row" style="margin-bottom: 8px">
        <div class="choice-row-box" @click="shareCollection">
          <img src="../../../static/collection/share@2x.png" alt="" />
          <span class="name">Share Collection</span>
        </div>
      </div>
      <div class="choice-row" style="margin-bottom: 8px" @click="Rename" >
        <div class="choice-row-box" v-if="isDefaultCollection!=1">
          <img src="../../../static/collection/rename@2x.png" alt="" />
          <span class="name">Rename</span>
        </div>
      </div>
      <div class="choice-row" style="margin-bottom: 24px" @click="Delete">
        <div class="choice-row-box" v-if="isDefaultCollection!=1">
          <img src="../../../static/collection/delcollection@2x.png" alt="" />
          <span class="name">Delete</span>
        </div>
      </div>
    </el-dialog>
    <!-- 编辑名称弹框 -->
    <el-dialog
      custom-class="edit-collection-name"
      :visible.sync="dialogVisible2"
      center
      :width="'300px'"
      :title="'Rename Collection'"
      :before-close="handleClose2"
    >
      <el-form ref="form" class="add-collection" :model="form">
        <el-form-item prop="name">
          <el-input
            class="add-collection-input no-content rename"
            ref="collectionName"
            maxlength="40"
            @input="notificationText = ''"
            v-model="form.name"
            placeholder="Name your collection..."
          ></el-input>
        </el-form-item>
        <div class="error-info" v-if="notificationText">
          <p>
            <img
              class="collection-error"
              src="../../../static/collection/addCollectionError@2x.png"
              alt=""
            />
            {{ notificationText }}
          </p>
        </div>
        <el-form-item>
          <div
            class="created-btn"
            v-elementEvent
            :class="{ error: notificationText }"
            @click="saveName"
          >
            Save
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 删除弹框 -->
    <el-dialog
      title="Delete Collection"
      custom-class="del-collections-box"
      :visible.sync="dialogVisible3"
    >
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
    <DialogTip :dialogVisible.sync='openComingDialong' :title="'Share Collection'" @childContinue='childContinue'>
    </DialogTip>
  </div>
</template>

<script>
import productShare from "@/mixins/share";
import successInfo from "@/mixins/successInfo";
import { getStoragePrefix, myTrim } from "@/utils/common";
import { editproductCollectionName } from "@/api/collections";
import { delProductCollection } from "@/api/collections";
import DialogTip from "@/views/collections/components/dialogTip";
export default {
  data() {
    return {
      notificationText: "",
      form: {
        name: "",
      },
      dialogVisible2: false,
      dialogVisible3: false,
      delCollectionLoading: false,
      collectionName: "",
      openComingDialong:false
    };
  },
  props: {
    dialogVisible: {},
    isComingProduct: {},
    id: {},
    isDefaultCollection: {},
  },
  components:{
    DialogTip
  },
  mixins: [productShare, successInfo],
  methods: {
    handleClose() {
      this.$emit("update:dialogVisible", false);
    },
    handleClose2() {
      this.dialogVisible2 = false;
      this.notificationText = ''
    },
    Delete() {
      if(this.isDefaultCollection==1) {
        return
      }
      this.collectionName = localStorage.getItem(
        getStoragePrefix("collectionName")
      );
      this.handleClose();
      this.dialogVisible3 = true;
    },
    handleDelete() {
      this.delCollection()
    },
    // 删除合集
    delCollection() {
      var data, sucess, error, complete;
      data = {
        collectionId: this.id,
      };
      this.delCollectionLoading = true;
      // this.$EventBus.$emit('upCollcetion')
      // this.$router.back();
      // return
      sucess = (res) => {
        console.log(res);
        this.dialogVisible3 = false;
        var message = {
          title: "Collection Deleted",
          tip: "The collection has  be deleted.",
        };
        this.createdSuccessInfo(message);
        // this.delCollectionSuccess();
        this.$EventBus.$emit('upCollcetion')
        this.$router.back();
        // const { result } = res;
        // this.collections = result;
      };
      error = (res) => {
        console.log(res.data.message);
      };
      complete = (res) => {
        this.delCollectionLoading = false;
        console.log(res);
      };
      delProductCollection(data, sucess, error, complete);
    },
    handleCancel() {
      this.dialogVisible3 = false;
    },
    childContinue() {
      this.openComingDialong = false
      this.shareShop(this.id,'collection')
    },
    Rename() {
      if(this.isDefaultCollection==1) {
        return
      }
      this.handleClose();
      this.form.name = localStorage.getItem(getStoragePrefix("collectionName"));
      this.dialogVisible2 = true;
    },
    shareCollection() {
      this.clooectionShareShop();
    },
    // 合集分享前判断是否有预发布商品
    clooectionShareShop() {
      if (this.isComingProduct) {
        this.openComingDialong = true;
        this.handleClose();
        return;
      } else {
        this.shareShop(this.id, "collection");
        this.handleClose();
      }
    },
    saveName() {
      var data, sucess, error, complete;
      data = {
        collectionName: myTrim(this.form.name),
        collectionId: this.id,
      };
      if (!this.form.name) {
        this.notificationText = "The collection name cannot be blank.";
        return;
      }
      if (
        this.form.name ==
        localStorage.getItem(getStoragePrefix("collectionName"))
      ) {
        this.notificationText =
          "The edit name is the same as the original name";
        return;
      }
      sucess = (res) => {
        console.log(res);
        // const collectionID = res.result
        localStorage.setItem(
          getStoragePrefix("collectionName"),
          myTrim(this.form.name)
        );
        this.notificationText = "";
        this.form.name = "";
        this.dialogVisible2 = false;
        let info = {
          title: "Collection Renamed",
          tip: "The collection has been reamed",
        };
        this.createdSuccessInfo(info);
        this.$emit("upCollectionName");
        this.$EventBus.$emit('upCollcetion')
      };
      error = (res) => {
        console.log(res.data);
        console.log(res.data.message);
        this.notificationText = res.data.message;
      };
      complete = (res) => {
        console.log(res);
      };
      editproductCollectionName(data, sucess, error, complete);
    },
  },
};
</script>


<style lang="less">
.collection-more {
  .open-collection-more-popup {
    margin-top: 0 !important;
    top: 50%;
    transform: translateY(-50%);
    .el-dialog__body {
      overflow: hidden;
      padding-top: 16px;
    }
    .title {
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 22px;
      margin-bottom: 8px;
    }
    .choice-row {
      height: 40px;
      .choice-row-box {
        cursor: pointer;
        background: #fff;
        border-radius: 10px;
        width: 352px;
        height: 40px;
        display: flex;
        align-items: center;
        img {
          display: block;
          width: 24px;
          height: 24px;
          margin: 0 8px;
        }
        span {
          color: #333;
          font-size: 14px;
          font-weight: 500;
        }
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
}
</style>