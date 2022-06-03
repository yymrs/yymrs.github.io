<template>
  <div class="coming-shopify-dialong-tip">
    <el-dialog
      title="Add to Shopify"
      custom-class="coming-shopify-collections-box"
      :visible.sync="dialogVisible"
      :before-close="handleCancel"
    >
      <!-- <div slot="title" class="coming-shopify-collections-box-title">
        <span class="name">Add to Shopify</span>
        <span class="close"  @click="closeCollection">
          <img
            style="height: 8.6px; width: 8.6px"
            src="../../../static/modelClose@2x.png"
            alt=""
          />
        </span>
      </div> -->
      <div class="coming-shopify-collectins-tip">
        This collection contains 'coming soon' items. You must remove those items before exporting.
      </div>
      <div class="affirm-collectins-button">
        <div class="affirm-btn" v-elementEvent @click="handleCancel">OK</div>
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
  },
  methods: {
    closeCollection() {
      this.handleCancel();
    },
    handleCancel() {
      this.$emit("update:dialogVisible", false);
    },
  },
};
</script>

<style lang="less">
.coming-shopify-dialong-tip {
  .coming-shopify-collections-box {
    position: relative;
    width: 300px;
    // height: 220px;
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
    
      padding: 5px 20px 20px;
    }
    .coming-shopify-collections-box-title {
      display: flex;
      .close {
        display: flex;
        align-items: center;
        cursor: pointer;
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
    .coming-shopify-collectins-tip {
      font-size: 13px;
      line-height: 18px;
      color: #333;
      word-break: break-word;
    }
    .affirm-collectins-button {
     
      .affirm-btn {
        margin-top: 20px;
        line-height: 40px;
        border: 1px solid #333333;
        font-weight: 600;
        font-size: 16px;
        color: #333333;
        background: #333333;
        color: #fff;
        border-radius: 30px;
      }
    }
  }
}
</style>