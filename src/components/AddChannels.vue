<template>
  <div>
    <el-dialog 
      class="channels-dialog-add"
      title="Add New Channel"
      :visible.sync="dialogFormVisibleAdd"
      center
      @close="closeDialog"
    >
      <el-form
        :model="dialogAddChanels"
        ref="addForm"
        :rules="rules"
        @submit.native.prevent
      >
        <el-form-item prop="name">
          <el-input
            v-focus
            ref="inputNewChannel"
            class="add-channels-input"
            v-model="dialogAddChanels.name"
            placeholder="Enter Shopify domain"
            autocomplete="off"
            size="large"
            @input="onInput()"
            @keyup.enter.native="submitForm()"
          >
            <template slot="prepend">https://</template>
            <template slot="append">.myshopify.com</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="channels-dialog-help">
        <a href="https://help.trendsi.com/knowledge/locating-shopify-handle" target="_blank">Where to find myshopify.com domain?</a>
      </div>
      <div slot="footer" class="dialog-footer">
        <div v-if="dialogAddChanels.name.toString().length" class="dialog-btntext" @click="dialogChannelsAdd(dialogAddChanels)">Continue</div>
        <div v-else class="dialog-btntext btntext-disabled">Continue</div>
      </div>
    </el-dialog>
    <submit-shopify :dialogFormVisible="dialogFormVisibleShopify" @dialogClose="dialogCloseShopify"></submit-shopify>
  </div>
</template>

<script>
import { connectShopifyStore, registerCustomApp, switchShopify } from "@/api/channels";
import SubmitShopify from '@/components/SubmitShopify.vue';

export default {
  components: {
    SubmitShopify
  },
  props: {
    // cms:{
    //   type: Boolean,
    //   default: false,
    // },
    // dialogFormVisibleAdd: {
    //   type: Boolean,
    //   default: false
    // }
  },
  data() {
    return {
      dialogFormVisibleAdd: true,
      dialogAddChanels: {
        name: "",
      },
      rules: {
        name: [],
      },
      isOpenShopify: true,
      dialogFormVisibleShopify: false
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  methods: {
    closeDialog() {
      this.dialogAddChanels = { name: '' };
      this.$emit('closeDialog');
    },
    onInput() {
      this.$refs["addForm"].clearValidate();
    },
    submitForm() {
      if (this.dialogAddChanels.name.toString().length) {
        this.commonSubmit();
      }
    },
    dialogChannelsAdd() {
      this.commonSubmit();
    },
    commonSubmit() {
      this.$refs['addForm'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '',
            spinner: 'el-icon-loading',
            background: 'rgba(51, 51, 51, 0.25)'
          });
          switchShopify({},
          (res) => {
            this.isOpenShopify = res.result;
            const allInfo = JSON.parse(localStorage.getItem('ALLINFO'));
            allInfo.isOpenShopify = res.result;
            localStorage.setItem('ALLINFO', JSON.stringify(allInfo));
            if(this.isOpenShopify) {
              connectShopifyStore({
                storeName: this.dialogAddChanels.name + ".myshopify.com",
              },
              (res) => {
                this.dialogFormVisibleAdd = false;
                this.$store.commit('layout/SET_AddChannel', false);
                window.open(res.result, "_self");
                loading.close();
              },
              (err) => {
                loading.close();
                { // 手动校验
                  const dom = this.$refs['addForm'];
                  dom.clearValidate();
                  this.rules.name.push({
                    validator: (rule, value, callback) => {
                      // callback('This store has already been added. Try a different store.');
                      callback(new Error(err.data.message))
                    },
                    trigger: 'blur'
                  })
                  dom.validateField('name');
                  this.rules.name = [];
                }
              },
              () => {})
            } else {
              registerCustomApp({
                domain: this.dialogAddChanels.name + ".myshopify.com",
                email: JSON.parse(localStorage.getItem('USERINFO')).email,
                mobile: JSON.parse(localStorage.getItem('USERINFO')).mobile,
                userId: JSON.parse(localStorage.getItem('USERINFO')).id
              },
              (res) => {
                loading.close();
                if(res.success) {
                  if(res.message === 'connected') {
                    this.dialogFormVisibleAdd = false;
                    this.getList();
                  } else {
                    this.dialogFormVisibleShopify = true;
                  }
                } else {
                  { // 手动校验
                    const dom = this.$refs['addForm'];
                    dom.clearValidate();
                    this.rules.name.push({
                      validator: (rule, value, callback) => {
                        callback('This store has already been added. Try a different store.');
                      },
                      trigger: 'blur'
                    })
                    dom.validateField('name');
                    this.rules.name = [];
                  }
                  this.getList();
                }
              },
              (err) => {
                loading.close();
                { // 手动校验
                  const dom = this.$refs['addForm'];
                  dom.clearValidate();
                  this.rules.name.push({
                    validator: (rule, value, callback) => {
                      callback(err.data.message);
                    },
                    trigger: 'blur'
                  })
                  dom.validateField('name');
                  this.rules.name = [];
                }
                this.getList();
              },
              () => {})
            }
          },
          (err) => {
            console.log(err);
          },
          () => {})
        } else {
          return false;
        }
      });
    },
    dialogCloseShopify() {
      this.dialogFormVisibleAdd = false;
      this.dialogFormVisibleShopify = false;
    }
  },
};
</script>
<style lang='less'>
  .channels-dialog-add {
    .el-form-item__content {
      .el-input-group__append {
        padding: 5px;
      }
      .el-input-group__prepend {
        background: #fff;
        border-color: transparent;
      }
    }
    input {
      &::-webkit-input-placeholder {
        font-size: 16px;
        font-weight: normal;
      }
      &::-moz-placeholder {
        font-size: 16px;
        font-weight: normal;
      }
    }
    .channels-dialog-help {
      text-align: center;
      margin-bottom: 16px;
      a {
        color: #333333;
        text-decoration: underline;
      }
      a:hover { opacity: 0.6; }
      a:active { opacity: 0.8; }
    }
    .el-dialog {
      margin-top: -112px !important;
      .el-dialog__body {
        margin-bottom: 12px;
        .el-form-item {
          margin-bottom: 36px !important;
          .el-form-item__error {
            margin-top: 8px;
            text-align: center;
          }
        }
      }
    }
  }
// .channels-dialog-add {
//   margin-top: -112px !important;
//   .el-dialog__body {
//     margin-bottom: 12px;
//     .el-form-item {
//       margin-bottom: 36px;
//       .el-form-item__error {
//         margin-top: 8px;
//         text-align: center;
//       }
//     }
//   }
//   .el-dialog {
//     margin-top: -112px !important;
//     .el-dialog__body {
//       margin-bottom: 12px;
//       .el-form-item {
//         margin-bottom: 36px;
//         .el-form-item__error {
//           margin-top: 8px;
//           text-align: center;
//         }
//       }
//     }
//   }
// }
// .channels-dialog-add {
//   .el-form-item__content {
//     .el-input-group__append {
//       padding: 5px;
//     }
//   }
// }
</style>