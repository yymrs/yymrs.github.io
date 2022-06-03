<template>
  <div class="coming-dialong-tip">
    <el-dialog
      :title="title"
      custom-class="coming-collections"
      :visible.sync="dialogVisible"
      :before-close="handleCancel"
    >
      <!-- <div slot="title" class="coming-collections-title">
        <span class="name">Share Collection</span>
        <span class="close"  @click="closeCollection">
          <img
            style="height: 8.6px; width: 8.6px"
            src="../../../static/modelClose@2x.png"
            alt=""
          />
        </span>
      </div> -->
      <div class="coming-tip">
        <!-- <slot></slot> -->
        This collection contains 'coming soon' items. Your customers can only preview these items.
        <!-- Are you sure you want to delete this collection? -->
      </div>
      <div class="coming-collectins-button">
        <div class="continue-btn" v-elementEvent @click="handleDelete">
          Continue
        </div>
        <div class="cancel-btn" v-elementEvent @click="handleCancel">
          Cancel
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DialogTip",
  data() {
    return {};
  },
  props: {
    dialogVisible: {},
    title:{}
  },
  methods: {
    closeCollection() {
      this.handleCancel();
    },
    handleDelete() {
      this.$emit("childContinue");
    },
    handleCancel() {
      this.$emit("update:dialogVisible", false);
    },
  },
};
</script>

<style lang="less">
.coming-dialong-tip {
  .coming-collections {
    position: relative;
    width: 300px;
    height: auto;
    text-align: center;
    margin-top: 0 !important;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(25px);
    /* Note: backdrop-filter has minimal browser support */
    padding-top: 18px;
    border-radius: 20px;
    & > .el-dialog__header {
      padding: 0;
    }
    & > .el-dialog__body {
      padding: 5px 20px 20px ;
    }
    .coming-collections-title {
      display: flex;
      .close {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
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
    .coming-tip {
      font-weight: 400;
      word-break: break-word;
      text-indent: 1em;
      font-size: 13px;
      line-height: 19px;
      color: #333;
    }
    .coming-collectins-button {
      .continue-btn {
        margin: 20px 0 14px;
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