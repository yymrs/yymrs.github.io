<template>
  <div class="submit-shopify">
    <el-dialog
      class="channels-dialog"
      title="Thank You"
      width="380px"
      :visible.sync="dialogFormVisible"
      center
      :append-to-body='true'
      @close="dialogClose">
      <div>
        <span>Thanks for submitting your Shopify URL. We are upgrading our Shopify App and will set up your Shopify integration manually in the meantime. This means we will email you once we process your request. Thanks for your patience.</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="dialog-btntext" @click="dialogOk">OK</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'SubmitShopify',
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  created() {

  },
  methods: {
    dialogOk() {
			this.$emit("dialogClose");
    },
    dialogClose() {
			this.$emit("dialogClose");
    }
  }
}
</script>

<style lang="less">
  .channels-dialog > .el-dialog {
    margin-top: -135px !important;
    .el-dialog__body > div {
      text-align: center;
      line-height: 24px;
    }
    .el-dialog__footer {
      .dialog-btntext {
        width: 256px;
        margin: 0 auto;
        margin-top: 24px;
      }
    }
  }
</style>
