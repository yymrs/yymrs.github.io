<template>
  <el-dialog class="leave-page-component" :title="parentInfo.title" width="300px" :visible="dialogLeave" center @close="close">
    <div class="parentInfo-tip"><span>{{parentInfo.tip}}</span></div>
    <div slot="footer" class="dialog-footer">
      <div class="dialog-btntext" @click="confirm">{{parentInfo.confirm}}</div>
      <div class="dialog-btntext dialog-cancel" @click="cancel">{{parentInfo.cancel}}</div>
    </div>
  </el-dialog>
</template>

<script>
export default {
props:{
  parentInfo:{
    type:Object,
    default:()=>{
      return {}
    }
  },
  dialogLeave:{}
},
mounted() {
  console.log(this.parentInfo);
},
methods:{
  close() {
    this.$emit('update:dialogLeave',false)
  },
  confirm() {
    this.$emit('confirm')
  },
  cancel() {
    this.close()
  }
}
}
</script>

<style lang="less">
.leave-page-component {
  .el-dialog {
    margin-top: -110px !important;
    .el-dialog__body {
      padding-top: 8px;
      margin-bottom: 16px;
    }
    .parentInfo-tip {
      text-align: center;
    }
  }
}
</style>