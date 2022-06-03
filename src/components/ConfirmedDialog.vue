<template>
  <div class="confirmed-dialog-page">
    <el-dialog
      :title="textInfo.title"
      custom-class="confirmed-dialog-box"
      center
      :visible.sync="dialogVisible"
      :before-close="handleCreatedClose"
    >
      <div class="confirmed-collectins-tip" v-if="textInfo.tip">
        {{ textInfo.tip }}
      </div>
      <div class="confirmed-collectins-button">
        <div class="confirmed-btn" v-elementEvent @click="handleDelete">
          {{ textInfo.Confirmed }}
        </div>
        <div class="cancel-btn" v-elementEvent @click="handleCancel">
          {{ textInfo.Cancel }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import successInfo from "@/mixins/successInfo";
export default {
  data() {
    return {
      email: "",
      errorInfo: "",
    };
  },
  mixins: [successInfo],
  props: {
    dialogVisible: {},
    textInfo: {},
  },

  methods: {
    handleCreatedClose() {
      this.$emit("update:dialogVisible", false);
    },
    handleDelete() {
      this.handleCreatedClose()
      this.$emit('ConfirmedFun')
    },
    handleCancel() {
      this.handleCreatedClose()
    },
  },
};
</script>

<style lang="less">
.confirmed-dialog-page {
  .confirmed-dialog-box {
    top: 50%;
    width: 350px;
    // height: 220px;
    transform: translateY(-50%);
    margin-top: 0 !important;
    .el-dialog__body {
      padding-top: 16px;
      overflow: hidden;
    }
    .confirmed-collectins-tip {
      text-align: center;
      font-size: 14px;
      line-height: 18px;
      color: #333;
    }
    .confirmed-collectins-button {
      .confirmed-btn {
        text-align: center;
        margin: 16px 0;
        line-height: 40px;
        background: #333333;
        border-radius: 30px;
        font-weight: 600;
        font-size: 16px;
        color: #ffffff;
      }
      .cancel-btn {
        text-align: center;
        line-height: 40px;
        height: 40px;
        box-sizing: border-box;
        border: 1px solid #333333;
        font-weight: 600;
        font-size: 16px;
        color: #333333;
        border-radius: 30px;
        margin-bottom: 24px;
      }
    }
  }
}
</style>