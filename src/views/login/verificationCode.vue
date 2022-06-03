<template>
  <div class="verification-code">
    <div class="login-welcome">Welcome to</div>
    <img class="login-welcome-img" :src="projName" alt="">
    <div class="login-tip">
      <span>Enter the 6-digit code sent to you at</span>
      <div class="login-tip-number">{{ region + ' ' + mobile }}</div>
    </div>
    <el-form :model="formInfo" ref="formInfo" class="login-form">
      <el-form-item prop="code" :rules="[{ validator: validateCode, trigger: 'change'}]">
        <el-input class="login-code" type="tel" ref="input1" maxlength="1"  v-model.number="formInfo.code.code1" @input="nextFocus(formInfo.code.code1,1)" v-focusblurstyle @keyup.delete.native="submitCode(formInfo.code.code1,1)" v-focus></el-input>
        <el-input class="login-code" type="tel" ref="input2" maxlength="1"  v-model.number="formInfo.code.code2" @input="nextFocus(formInfo.code.code2,2)" v-focusblurstyle @keyup.delete.native="submitCode(formInfo.code.code2,2)"></el-input>
        <el-input class="login-code" type="tel" ref="input3" maxlength="1"  v-model.number="formInfo.code.code3" @input="nextFocus(formInfo.code.code3,3)" v-focusblurstyle @keyup.delete.native="submitCode(formInfo.code.code3,3)"></el-input>
        <el-input class="login-code" type="tel" ref="input4" maxlength="1"  v-model.number="formInfo.code.code4" @input="nextFocus(formInfo.code.code4,4)" v-focusblurstyle @keyup.delete.native="submitCode(formInfo.code.code4,4)"></el-input>
        <el-input class="login-code" type="tel" ref="input5" maxlength="1"  v-model.number="formInfo.code.code5" @input="nextFocus(formInfo.code.code5,5)" v-focusblurstyle @keyup.delete.native="submitCode(formInfo.code.code5,5)"></el-input>
        <el-input class="login-code login-code-last" type="tel" ref="input6" maxlength="1"  v-model.number="formInfo.code.code6" @input="nextFocus(formInfo.code.code6,6)" v-focusblurstyle @keyup.delete.native="submitCode(formInfo.code.code6,6)"></el-input>
      </el-form-item>
    </el-form>
    <div class="login-resend" @click="continueLink()"><span>Didn’t receive it? <a href="javascript:void(0);">Resend Code</a></span></div>
  </div>
</template>

<script>
import { verficationPost, isWhiteUser, isShow, questionHasCommit } from "@/api/login";
export default {
  name: 'VerificationCode',
  components: {
  },
	data() {
    const region = this.$route.query.region;
    const mobile = this.$route.query.mobile;
    let mobileVal = (mobile.length === 9 || mobile.length === 10) ? (`(${mobile.substring(0,3)})-${mobile.substring(3,6)}-${mobile.substring(6,10)}`) : mobile;
		return {
      projName: require('@/static/projName@2x.png'),
      region: region,
      mobile: mobileVal,
      formInfo: {
        code: {
          code1: '',
          code2: '',
          code3: '',
          code4: '',
          code5: '',
          code6: ''
        },
        // code: ''
      },
      validateCode: (rule, value, callback) => {
        if (!(Object.values(value).includes(''))) {
          const loading = this.$loading({ lock: true, text: '', spinner: 'el-icon-loading', background: 'rgba(51, 51, 51, 0.25)' });
          let bindshopifyVal = JSON.parse(localStorage.getItem('BINDSHOPIFY'));
          // var smsCode = ''
          // for (const key in value) {
          //   if (Object.hasOwnProperty.call(value, key)) {
          //     const number = value[key];
          //     smsCode += number
          //   }
          // }
          let smsCode = Object.values(value).join('');
          this.$store.dispatch('user/login', {
            clientId: document.cookie.match(/_ga=(.+?);/) && document.cookie.match(/_ga=(.+?);/)[1].split('.').slice(-2).join("."), // https://stackoverflow.com/questions/20053949/how-to-get-the-google-analytics-client-id
            utm: localStorage.getItem('UTMINFO')?localStorage.getItem('UTMINFO'):undefined,
            mobile: this.region + this.$route.query.mobile,
            platform: 2,
            smsCode: smsCode,
            shareCode: (bindshopifyVal && bindshopifyVal.action) ? 'easymoney' : undefined
          })
          .then((source) => {
            isWhiteUser({},
            (reself) => {
              loading.close();
              // localStorage.setItem('ISFIRSTLOGIN', ((source.result.completed===0) || (source.result.hasInviteCode===false)) ? true : false); // true:首次登录
              isShow({}, (reshow) => { // 是否展示过引导页
                questionHasCommit({}, (requestion) => { // 是否填过问卷
                  localStorage.setItem('ISFIRSTLOGIN', (!(reshow.result)) ? true : false); // true:首次登录
                  localStorage.setItem('COMPLETED', source.result.completed);
                  localStorage.setItem('QUESTIONNAIRE', requestion.data);
                  localStorage.setItem('HASINVITECODE', source.result.hasInviteCode);
                  localStorage.setItem('ALLINFO', JSON.stringify(source.result));
                  // localStorage.setItem('isShopifyORhasCreateStore', (source.result.isShopify === false || source.result.isShopify === null) &&  (!source.result.hasCreateStore));
                  let activity_url = localStorage.getItem('ACTIVITYURL');
                  if(process.env.NODE_ENV=='production') {
                    localStorage.setItem('ISWHITEUSER', reself.result);
                  } else {
                    localStorage.setItem('ISWHITEUSER', false);
                  }
                  !(source.result.completed) // 0：需要采集 1：不需要采集
                  ? this.$router.push({path: '/login/info'})
                  // : !(source.result.hasInviteCode) // false：需要录入 true：不需要录入
                  //   ? this.$router.push({path: '/login/invite-code'})
                  : !(requestion.data) // false：需要录入 true：不需要录入
                    ? this.$router.push({path: '/login/questionnaire'})
                    : (!(source.result.setUpLater)) && (source.result.isShopify === false || source.result.isShopify === null) && (!source.result.hasCreateStore)
                      ? this.$router.push({path: '/login/setup-store'})
                      : (bindshopifyVal && bindshopifyVal.action)
                        ? this.$router.push({path: '/channels'})
                        : (activity_url)
                          ? window.open(activity_url, '_top')
                          : this.$router.push({path: '/'})
                },
                () => {},
                () => {})
              },
              () => {},
              () => {})
            },
            () => {
              loading.close();
            },
            () => {})
          })
          .catch(() => {
            loading.close();
            callback('SMS verification code is invalid.');
            // this.formInfo.code = '';
          })
        } else { callback() }
      }
    }
  },
  computed: {},
  watch:{},
  methods: {
    // codeInput() {
    //   setTimeout(()=>{
    //     if(this.formInfo.code.toString().length === 6) {
    //       this.$refs['inputCode'].blur();
    //     }
    //   }, 200);
    // },
    commonLink() {
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      verficationPost({
        // prefixMobile: this.region,
        mobile: this.region + this.$route.query.mobile
      },
      () => {
        loading.close();
      },
      () => {
        loading.close();
      },
      () => {})
    },
    continueLink() {
      this.commonLink();
    },
    // 自动聚焦下一个input
    nextFocus(val, index) {
      const curInput = this.$refs[`input${index}`];
      const nextInput = this.$refs[`input${index + 1}`];
      const lastInput = this.$refs[`input${index - 1}`];
      if (!curInput) return;
      if (val.toString().length === 1) {
        if (nextInput && !nextInput.value) {
          nextInput.focus();
        }
      }
      if(val === '') {
         if (lastInput) {
          lastInput.focus();
        }
      }
    },
    submitCode(val, index) {
      const lastInput = this.$refs[`input${index - 1}`];
      if(val === '') {
         if (lastInput) {
          lastInput.focus();
        }
      }
    }
  },
	created() {
    // verficationPost({
    //   // prefixMobile: this.region,
    //   mobile: this.region + this.$route.query.mobile
    // },
    // () => {},
    // () => {},
    // () => {})
    // setTimeout(()=>{
    //   this.$refs['firstName'].focus();
    // }, 100)
    // this.$nextTick(()=>{
    //   this.$refs['input1'].focus();
    //   // this.$refs['input1'].style.cssText = 'background: #fffffff;';
    // })
  },
  mounted() {},
  activated() {}
}
</script>

<style lang="less">
  @import "../../styles/common.less";
  @import "./CommonLogin.less";
  .verification-code {
    // .login-form {
    //   text-align: center;
    //   margin-top: 24px;
    //   .login-code {
    //     display: inline-block;
    //     width: auto;
    //     input {
    //       width: 52px;
    //       height: 52px;
    //       .common-input();
    //       .common-text();
    //       margin-right: 16px;
    //     }
    //   }
    //   .login-code:last-child {
    //     input {
    //       margin-right: 0;
    //     }
    //   }
    // }
    .login-resend {
      position: absolute;
      bottom: 0;
      left: 50%;
      margin-left: -130px;
      width: 260px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      a {
        font-weight: 700;
        color: #333333;
        text-decoration: underline;
      }
    }
    .login-form {
      margin-top: 16px;
      display: inline-block;
      .el-form-item__error {
        margin-top: 16px;
      }
      .login-code {
        margin-bottom: 0 !important;
        display: inline-block;
        width: auto;
        .el-form-item__content {
          line-height: 1px;
        }
        input {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          margin-right: 16px;
          -webkit-user-select:text
        }
        /* chrome */ 
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { 
            -webkit-appearance: none; 
        }
        /* 火狐浏览器 */
        input[type="number"]{ 
            -moz-appearance: textfield; 
        }
        .el-input__inner {
          border: 1px solid #EEEEEE;
          font-weight: bold;
          font-size: 18px;
          padding: 8px;
          text-align: center;
        }
        .el-input__inner:focus {
          background: #ffffff !important;
          box-shadow: 0px 0px 20px rgba(51, 51, 51, 0.15);
        }
        // .login-code-input {
        //   width: 440px;
        //   margin: 0 8px;
        //   input {
        //     letter-spacing: 48px;
        //     outline: none;
        //     .common-input();
        //     .common-text();
        //     border-bottom: 0;
        //     color: transparent; // 是否显示光标
        //     text-shadow:0 0 0 #333333;
        //   }
        // }
        // .code-line {
        //   width: 52px;
        //   border: 1px solid #E1E1E1;
        //   display: inline-block;
        //   border-left: 0;
        //   border-right: 0;
        //   border-top: 0;
        //   margin-right: 16px;
        // }
        // .code-line:last-child {
        //   margin-right: 0;
        // }
      }
      .login-code-last {
        input {
          margin-right: 0;
        }
      }
    }
  }
</style>