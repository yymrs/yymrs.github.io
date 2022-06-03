<template>
  <div class="input-mobile">
    <div class="login-welcome">Welcome to</div>
    <img class="login-welcome-img" :src="projName" alt="">
    <div class="login-input">
      <el-form :model="formInfo" ref="formLogin" class="login-form" @submit.native.prevent>
        <el-form-item
          prop="mobile"
          :rules="[
            { validator: validateMobile, trigger: 'change' }
          ]">
          <el-input class="login-mobile"
            ref="inputMobile"
            v-focus
            v-model="formInfo.mobile"
            :maxlength="maxLength"
            placeholder="Enter your phone number"
            @keyup.enter.native="submitForm(formInfo.mobile)"
            @input="onInputMobile(formInfo)"
            v-focusblurstyle>
            <div slot="prefix" @click="showRegion">
              <span>{{ regionValue }}</span>
              <img src="@/static/dropDown@2x.png" alt="">
            </div>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- <div class="login-agree">
      By clicking Continue, you agree to our <span @click="openurl('Service')">Terms and<br> Conditions</span> and <span @click="openurl('Policy')">Privacy Policy</span>.
    </div> -->
    <div v-if="isClick" class="login-continue-active button-mobile" @click="continueLink(formInfo.mobile)">Continue</div>
    <div v-else class="login-continue">Continue</div>
    <el-dialog class="dialog-chooseRegion" :append-to-body="true" title="Choose your region" width="375px" :visible.sync="dialogFormVisibleRegion" center>
      <div>
        <div class="dialog-chooseRegion-item" v-for="item in regions" :key="item.iso" @click="chooseRegion(item)">
          <div>{{ item.name }}</div>
          <div class="item-val">{{ item.code }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRegion } from "@/utils/region";
import { verficationPost } from "@/api/login";

export default {
  name: 'InputMobile',
  components: {
  },
	data() {
		return {
      projName: require('@/static/projName@2x.png'),
      formInfo: {
        mobile: ''
      },
      isClick: false,
      validateMobile: (rule, value, callback) => {
        if (value.length > 0) {
          // let pattern = /^[0-9]{3}[-][0-9]{3}[-][0-9]{4}$/;
          let pattern = /^\d+(-\d+)?(-\d+)?$/;
          if(!(pattern.test(value))) {
            callback(new Error('This phone number is invalid.'));
          }
          if(this.isError===true) {
            callback(new Error(this.errorInfo));
            this.$refs['inputMobile'].focus();
          }
          if(this.isError===false || this.isError===undefined) {
            callback();
          }
        } else { callback() }
      },
      dialogFormVisibleRegion: false,
      regionValue: '+1',
      regions: getRegion(),
      maxLength: 15,
      isError: undefined,
      errorInfo: ''
    }
  },
  computed: {},
  watch:{},
  methods: {
    // openurl(url) {
    //   if(url === 'Service') {
    //     window.open('https://www.trendsi.com/terms-of-service','_blank'); // ,'location=no'
    //   }
    //   if(url === 'Policy') {
    //     window.open('https://www.trendsi.com/privacy-policy','_blank');
    //   }
    // },
    // commonAddLine(val) {
    //   let value = val.toString();
    //   value = value.replace(/\s*/g, "");
    //   let result = [];
    //   if(value.length > 6 && value.indexOf('-') < 0) { // 复制粘贴的情况
    //     for (var i = 0; i < value.length; i++) {
    //       if ((i===3&&value.charAt(3)!=='-') || i===6&&value.charAt(6)!=='-') {
    //         result.push("-" + value.charAt(i));
    //       }else {
    //         result.push(value.charAt(i));
    //       }
    //     }
    //   } else {
    //     for (var x = 0; x < value.length; x++) {
    //       if ((x===3&&value.charAt(3)!=='-') || (x===7&&value.charAt(7)!=='-')) {
    //         result.push("-" + value.charAt(x));
    //       }else {
    //         result.push(value.charAt(x));
    //       }
    //     }
    //   }
    //   value = result.join("");
    //   return value;
    // },
    getSeparatorMobile(mobile) {
      if (!mobile) {
        return '';
      }
      const reg = new RegExp('\\s', 'g');
      const regLine = new RegExp('-', 'g');
      const mobileResultStr = mobile.replace(reg, '').replace(regLine, ''); //去掉空格
      const prefixSeparator = mobileResultStr.length > 3 ? '-' : '';
      const middleSeparator = mobileResultStr.length > 6 ? '-' : '';
      let result = (
        mobileResultStr.substring(0, 3) +
        prefixSeparator +
        mobileResultStr.substring(3, 6) +
        middleSeparator +
        mobileResultStr.substring(6, mobileResultStr.length)
      )
      if( mobileResultStr.length > 10 ) {
        this.maxLength = 17 - this.regionValue.length;
        return mobileResultStr;
      } else {
        this.maxLength = 19 - this.regionValue.length;
        return result;
      }
    },
    onInputMobile(val) {
      // let pattern = /^[0-9]{3}[-][0-9]{3}[-][0-9]{4}$/;
      let pattern = /^\d+(-\d+)?(-\d+)?$/;
      // this.formInfo.mobile = this.commonAddLine(val.mobile.toString());
      // this.isClick = pattern.test(val.mobile.toString()) ? true : false;
      this.formInfo.mobile = this.getSeparatorMobile(val.mobile);
      // this.isClick = (pattern.test(this.formInfo.mobile.toString()) && (val.mobile.replace(/-/g,'').length > 8)) ? true : false;
      this.isClick = pattern.test(this.formInfo.mobile.toString()) ? true : false;
      this.isError = undefined;
    },
    commonSubmit(val) {
      this.$refs['formLogin'].validate((valid) => {
        if (valid) {
          // this.$router.push({path: '/login/verification', query: { mobile: val.replace(/-/g,''), region: this.regionValue }});
          const loading = this.$loading({
            lock: true,
            text: '',
            spinner: 'el-icon-loading',
            background: 'rgba(51, 51, 51, 0.25)'
          });
          verficationPost({
            mobile: this.regionValue + val.replace(/-/g,'')
          },
          () => {
            loading.close();
            this.$router.push({path: '/login/verification', query: { mobile: val.replace(/-/g,''), region: this.regionValue }});
          },
          (err) => {
            this.isError = true;
            this.errorInfo = err.data.message;
            this.$refs['formLogin'].validateField("mobile");
            // this.$notify({
            //   title: "Oops",
            //   message: err.data.message,
            //   iconClass:'el-icon-warning-outline',
            //   duration: 3000,
            //   showClose: false
            // });
            loading.close();
          },
          () => {})
        } else {
          return false;
        }
      });
    },
    continueLink(val) {
      this.commonSubmit(val);
    },
    submitForm(val) {
      if(this.isClick) {
        this.commonSubmit(val);
      }
    },
    showRegion() {
      this.dialogFormVisibleRegion = true;
    },
    chooseRegion(val) {
      this.regionValue = val.code;
      this.dialogFormVisibleRegion = false;
    }
  },
	created() {
    if( this.$route.query.info && JSON.parse(this.$route.query.info) && (JSON.parse(this.$route.query.info)).action) {
      localStorage.setItem('BINDSHOPIFY', this.$route.query.info);
    }
    if( this.$route.query.email ) {
      localStorage.setItem('EMAIL', this.$route.query.email);
    }
  },
  mounted() {},
  activated() {}
}
</script>

<style lang="less">
  @import "../../styles/common.less";
  @import "./CommonLogin.less";
  .input-mobile{
    .login-input {
      margin-top: 56px;
      text-align: center;
      display: inline-flex;
      width: 100%;
      justify-content: center;
      // .login-area {
      //   width: 56px;
      //   display: inline-block;
      //   text-align: center;
      //   border-top-left-radius: 8px;
      //   border-bottom-left-radius: 8px;
      //   .common-text();
      // }
      .login-welcome-divide {
        width: 1px;
        height: 56px;
        line-height: 56px;
        display: inline-block;
        background: #eeeeee;
        & > div {
          height: 32px;
          background: #979797;
          margin-top: 12px;
        }
      }
      .login-form {
        display: inline-block;
        .el-form-item.is-error .el-input__inner:focus {
          border: 1px solid #F56C6C;
        }
        .login-mobile {
          width: 400px;
          input {
            // .common-input();
            border-color: #eeeeee;
            .common-text();
            font-size: 18px;
            font-weight: bold;
            border-radius: 8px;
            &::-webkit-input-placeholder {
              color: #979797;
              font-size: 18px;
              font-weight: normal;
            }
            &::-moz-placeholder {
              color: #979797;
              font-size: 18px;
              font-weight: normal;
            }
          }
          input.el-input__inner:focus {
            border-color: transparent;
            background: #ffffff !important;
            box-shadow: 0px 0px 20px rgba(51, 51, 51, 0.15);
          }
          // input.el-input__inner:hover {
          //   border-color: #eeeeee;
          // }
        }
        .el-form-item__error {
          padding-top: 16px;
        }
      }
    }
    .el-input--prefix .el-input__inner {
      padding-left: 121px;
    }
    .el-input__prefix {
      left: 0;
      display: inline-flex;
      align-items: center;
      height: 56px;
      width: 105px;
      div {
        cursor: pointer;
        border-right: 1px solid #979797;
        width: 105px;
        height: 32px;
        // margin-left: 12px;
        & > span {
          font-size: 18px;
          font-weight: bold;
          color: #333333;
          margin-left: -8px;
        }
        & > img {
          height: 8px;
          position: absolute;
          right: 8px;
          top: 50%;
          margin-top: -4px;
          // display: none;
        }
      }
    }
    // .login-agree {
    //   margin-top: 25px;
    //   color: #333333;
    //   font-size: 12px;
    //   line-height: 16px;
    //   span {
    //     cursor: pointer;
    //     text-decoration: underline;
    //   }
    // }
  }
  .dialog-chooseRegion > .el-dialog {
    margin-top: 115px !important;
    top: 0 !important;
    .el-dialog__body {
      padding: 24px 0;
      .dialog-chooseRegion-item {
        height: 32px;
        line-height: 32px;
        padding: 0 40px;
        & > div {
          display: inline-block;
        }
        .item-val {
          float: right;
          font-weight: bold;
          color: #333333;
        }
      }
      .dialog-chooseRegion-item:hover {
        // background: #ffffff;
        background: rgba(255, 255, 255, 0.5);
        cursor: pointer;
        // opacity: 0.5;
      }
    }
  }
</style>