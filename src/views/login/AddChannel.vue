<template>
  <div class="add-channel">
    <div class="add-channel-header">Connect Store</div>
    <el-form ref="formInfo" class="add-channel-connect" :model="formInfo" :rules="rules" @submit.native.prevent>
      <el-form-item prop="link">
        <el-input ref="inputNewChannel" @click.native="focus" class="add-channel-shopify" :class="{inputActive}"
          v-focus
          v-model="formInfo.link"
          placeholder="Enter Shopify domain"
          @keyup.enter.native="submitForm(formInfo)"
          @input="inputLink"
          @focus="inputFocus"
          @blur="inputBlur"
        >
          <template slot="prepend">https://</template>
          <template slot="append">.myshopify.com</template>
        </el-input>
      </el-form-item>
      <div class="channels-dialog-help"><a href="https://help.trendsi.com/knowledge/locating-shopify-handle" target="_blank">Where to find myshopify.com domain?</a></div>
      <div v-if="formInfo.link"
        v-loading="loading"
        element-loading-text=""
        element-loading-spinner="el-icon-loading"
        element-loading-background="transparent"
        class="login-continue-active button-addchannel" @click="continueLink(formInfo)">{{ loading?'':'Continue' }}</div>
      <div v-else class="login-continue">Continue</div>
    </el-form>
    <submit-shopify :dialogFormVisible="dialogFormVisibleShopify" @dialogClose="dialogCloseShopify"></submit-shopify>
  </div>
</template>

<script>
import { connectShopifyStore, registerCustomApp, switchShopify } from "@/api/channels";
import SubmitShopify from '@/components/SubmitShopify.vue';

export default {
  name: 'UserInfo',
  components: {
    SubmitShopify
  },
	data() {
		return {
      formInfo: {
        link: ''
      },
      rules: {
        link: []
      },
      loading: false,
      isOpenShopify: true,
      dialogFormVisibleShopify: false,
      inputActive:false
    }
  },
  computed: {},
  watch:{},
  methods: {
    commonSubmit() {
      this.loading = true;
          switchShopify({},
          (res) => {
            this.isOpenShopify = res.result;
            const allInfo = JSON.parse(localStorage.getItem('ALLINFO'));
            allInfo.isOpenShopify = res.result;
            localStorage.setItem('ALLINFO', JSON.stringify(allInfo));
            if(this.isOpenShopify) {
              connectShopifyStore({
                storeName: this.formInfo.link + ".myshopify.com",
              },
              (res) => {
                this.loading = false;
                window.open(res.result, "_self");
              },
              (err) => {
                this.loading = false;
                { // 手动校验
                  const dom = this.$refs['formInfo'];
                  dom.clearValidate();
                  this.rules['link'].push({
                    validator: (rule, value, callback) => {
                      // callback('This store has already been added. Try a different store.');
                      callback(new Error(err.data.message))
                    },
                    trigger: 'blur'
                  })
                  dom.validateField('link');
                  this.rules.link = [];
                }
              },
              () => {})
            } else {
              registerCustomApp({
                domain: this.formInfo.link + ".myshopify.com",
                email: JSON.parse(localStorage.getItem('USERINFO')).email,
                mobile: JSON.parse(localStorage.getItem('USERINFO')).mobile,
                userId: JSON.parse(localStorage.getItem('USERINFO')).id
              },
              (res) => {
                this.loading = false;
                if(res.success) {
                  this.dialogFormVisibleShopify = true;
                }
              },
              () => {
                this.loading = false;
              },
              () => {})
            }
          },
          (err) => {
            console.log(err);
          },
          () => {})
    },
    submitForm() {
      if(this.formInfo.link) {
        this.commonSubmit();
      }
    },
    continueLink() {
      this.commonSubmit();
    },
    inputLink() {
      this.$refs['formInfo'].clearValidate('link');
    },
    dialogCloseShopify() {
      this.dialogFormVisibleShopify = false;
      if(this.isOpenShopify === false) {
        const activity_url = localStorage.getItem('ACTIVITYURL');
        if(activity_url) {
          window.open(activity_url, '_top')
        } else {
          this.$router.push({path: '/'});
        }
      }
    },
    focus() {
      this.$refs.inputNewChannel.focus()
    },
    inputFocus() {
      this.inputActive = true
    },
    inputBlur() {
      this.inputActive = false
    }
  },
	created() {},
  mounted() {},
  activated() {}
}
</script>

<style lang="less">
  @import "../../styles/common.less";
  @import "./CommonLogin.less";
  .add-channel{
    .add-channel-header {
      font-weight: bold;
      font-size: 48px;
    }
    .add-channel-connect {
      margin-left: auto;
      margin-right: auto;
      width: 640px;
      .channels-dialog-help {
        text-align: center;
        margin-top: 48px;
        margin-bottom: 16px;
        a {
          color: #333333;
          text-decoration: underline;
        }
        a:hover { opacity: 0.6; }
        a:active { opacity: 0.8; }
      }
      .el-form-item.is-error .el-input__inner {
        border-color: #f56c6c;
      }
      .el-icon-loading {
        font-size: 32px;
        font-weight: bold;
      }
      margin-top: 157px;
      .el-form-item {
        margin: 0 auto;
        .el-form-item__error {
          padding-top: 4px;
        }
      }
      .el-form-item__error {
        text-align: center;
        width: 100%;
        padding-top: 9px;
      }
      .add-channel-shopify {
        border-radius: 10px;
        .el-input-group__prepend {
          background:rgb(238, 238, 238);
          border-color: transparent;
          font-size: 16px;
          padding: 0;
          color: #979797;
          padding-left: 16px;
          border-top-left-radius: 10px !important;
          border-bottom-left-radius: 10px !important;
        }
        &.inputActive {
          box-shadow: 0px 0px 20px rgba(51, 51, 51, 0.15);
        }
        &.inputActive .el-input-group__prepend  {
          background:#fff;
        }
        &.inputActive .el-input-group__append {
          background:#fff;
        }
        .el-input-group__append {
          background:rgb(238, 238, 238);
          font-size: 16px;
          border-color: transparent;
          color: #979797;
          padding: 0 !important;
          padding-right: 16px !important;
          border-top-right-radius: 10px !important;
          border-bottom-right-radius: 10px !important;
        }
        .el-input {
          box-shadow: 0px 0px 20px rgba(51, 51, 51, 0.15);
          border-radius: 10px;
        }
        input {
          .common-input();
          font-size: 18px;
          height: 56px;
          background:rgb(238, 238, 238);
          // border-radius: 8px;
          // width: auto;
          border: none;
          padding: 0 5px 0 8px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          font-weight: bold;
        }
        input.el-input__inner:focus {
          background: #ffffff !important;
          // box-shadow: 0px 0px 20px rgba(51, 51, 51, 0.15);
        }
      }
      .el-input__suffix {
        right: 0;
        .el-input__suffix-inner {
          font-family: Avenir Next;
          line-height: 56px;
          padding: 16px;
          span {
            font-size: 18px;
            color: #333333;
          }
        }
      }
    }
  }
</style>