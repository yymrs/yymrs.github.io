<template>
  <el-dialog
    custom-class="export-to-shopify-success"
    :show-close="false"
    :visible.sync="exportSuccessDailog"
    width="400px"
    :append-to-body='cms'
    :before-close="handleClose"
  >
    <div class="export-to-shopify-success-info">
      <div class="status-img">
        <img :src="info.img" alt="" />
      </div>
      <div class="status-info">{{info.title}}</div>
      <div class="tip">
        {{info.tip}}
      </div>
      <div class="open-view button" v-if="info.domain">
        <div v-elementEvent @click="openShopify">View on Shopify</div>
      </div>
      <div class="affirm button" :class="{error:info.domain==null}">
        <div v-elementEvent @click="affirm">OK</div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      nextDialogVisible: true,
    };
  },
  props: {
    exportSuccessDailog: {},
    info:{
      type:Object,
      default:()=>{
        return {}
      }
    },
    single:{
    },
    cms:{
      type: Boolean,
      default: false,
    }
  },
  methods:{
    affirm() {
      this.handleClose()
    },
    openShopify() {
      this.handleClose()
      window.open(this.info.domain)
    },
    handleClose() {
      this.$emit('update:exportSuccessDailog',false)
      this.$emit('colseSinglePopup')
    }
  }
};
</script>

<style lang="less">
.export-to-shopify-success {
  // height: 298px;
  text-align: center;
  top: 50%;
  transform: translateY(-50%);
  margin-top: 0 !important;
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding-top: 16px;
  }
  .export-to-shopify-success-info {
    .status-img {
      font-size: 0;
      img {
        width: 40px;
        height: 40px;
      }
    }
    .status-info {
      margin: 8px 0;
      font-size: 18px;
      line-height: 28px;
      text-align: center;

      color: #333333;
    }
    .tip {
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 16px;
      text-align: center;
      color: #333333;
      margin-bottom: 24px;
    }
    .button {
      & div {
        width: 252px;
        height: 48px;
        background: #333333;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
        border-radius: 26px;
        font-size: 16px;
        font-weight: 600;
      }

      display: flex;
      justify-content: center;
      &.open-view {
        color: #fff;
      }
      &.affirm {
        margin-top: 16px;
        margin-bottom: 24px;
        &.error {
          div {
            background: #333333;
            color: #fff;
          }
        }
        div {
          background: transparent;
          border: 2px solid #333;
          box-sizing: border-box;
          color: #333;
        }
      }
    }
  }
}
</style>