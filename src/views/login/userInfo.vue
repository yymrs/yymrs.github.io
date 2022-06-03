<template>
  <div class="user-info">
    <div class="user-info-header">Create</div>
    <div class="user-info-headerTwo">A Free Account</div>
    <el-form :model="formInfo" :rules="rules" ref="formInfo" label-width="364px" label-position="top" class="login-form">
      <el-row>
        <el-col :span="12">
          <el-form-item label="" prop="firstName" style="margin-right: 8px;">
            <el-input ref="firstName" v-model="formInfo.firstName" placeholder="First Name*" maxlength="40" autocomplete="off" v-focusblurstyle v-focus></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="" prop="lastName" style="margin-left: 8px;">
            <el-input v-model="formInfo.lastName" placeholder="Last Name *" maxlength="40" v-focusblurstyle></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="" prop="email">
            <el-input v-model.trim="formInfo.email" placeholder="Email Address *" maxlength="70" v-focusblurstyle @input="inputEmail"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="" prop="shareCode">
            <el-input v-model="formInfo.shareCode" placeholder="Referral Code (Optional)" maxlength="40" v-focusblurstyle @input="inputCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item prop="receive">
            <el-checkbox v-model="formInfo.receive">Receive SMS deals & tips from Trendsi.</el-checkbox>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="formInfo.firstName && formInfo.lastName && formInfo.email"
      v-loading="loading"
      element-loading-text=""
      element-loading-spinner="el-icon-loading"
      element-loading-background="transparent"
      class="login-continue-active button-userinfo" @click="continueLink(formInfo)">{{ loading?'':'Continue' }}</div>
    <div v-else class="login-continue">Continue</div>
  </div>
</template>

<script>
import { userModifyPost } from "@/api/login";
export default {
  name: 'UserInfo',
  components: {
  },
	data() {
    const validateEmail = (rule, value, callback) => {
      if (value !== '') {
        // eslint-disable-next-line
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!(pattern.test(value))) {
          callback(new Error('This is not a valid email address.'));
        } else { callback() }
      } else { callback() }
    };
		return {
      formInfo: {
        firstName: '',
        lastName: '',
        email: localStorage.getItem('EMAIL') || '',
        receive: true
      },
      rules: {
        firstName: [
          { required: true, message: 'Please enter first name.', trigger: 'blur' }
        ],
        lastName: [
          { required: true, message: 'Please enter last name.', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Please enter email.', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        shareCode: []
      },
      loading: false
    }
  },
  computed: {},
  watch:{},
  methods: {
    continueLink() {
      this.$refs['formInfo'].validate((valid) => {
        if (valid) {
          this.loading = true;
          // let bindshopifyVal = JSON.parse(localStorage.getItem('BINDSHOPIFY'));
          userModifyPost({
            firstName: this.formInfo.firstName,
            lastName: this.formInfo.lastName,
            email: this.formInfo.email,
            shareCode: this.formInfo.shareCode,
            sendMsg: this.formInfo.receive ? 1 : 0
          },
          (res) => {
            this.loading = false;
            if(res.success) {
              localStorage.setItem('COMPLETED', 1);
              let newUserInfo =  JSON.stringify(Object.assign( {}, JSON.parse(localStorage.getItem('USERINFO')), {
                firstName: this.formInfo.firstName,
                lastName: this.formInfo.lastName,
                email: this.formInfo.email
              }))
              localStorage.setItem('USERINFO', newUserInfo);
              console.log('第12个埋点------successful_registration-----');
              // this.$analytics.fbq.event('successful_registration', {
              //   userId: JSON.parse(localStorage.getItem('USERINFO')).uuId,
              //   event: 'successful_registration',
              // });

              let uuId = JSON.parse(localStorage.getItem('USERINFO'))?JSON.parse(localStorage.getItem('USERINFO')).uuId:undefined;
              this.$gtm.trackEvent({
                event: 'successful_registration',
                userId: uuId,
              });
              this.$router.push({path: '/login/questionnaire'})
              // (bindshopifyVal && bindshopifyVal.action)
              //   ? this.$router.push({path: '/channels'})
              //   : this.$router.push({path: '/login/questionnaire'})
            }
          },
          (err) => {
            if( err.data.message === 'This email has already been registered.' ) { // 手动校验
              const dom = this.$refs['formInfo'];
              dom.clearValidate();
              this.rules['email'].push({
                validator: (rule, value, callback) => {
                  callback('This email has already been registered.');
                },
                trigger: 'blur'
              })
              dom.validateField('email');
              this.rules['email'] = [];
            } else if( err.data.message === 'Please enter a valid invite code' ) { // 手动校验
              const dom = this.$refs['formInfo'];
              dom.clearValidate();
              this.rules['shareCode'].push({
                validator: (rule, value, callback) => {
                  callback('Refer code is invalid.');
                },
                trigger: 'blur'
              })
              dom.validateField('shareCode');
              this.rules['shareCode'] = [];
            } else {
              this.$notify({ title: "Oops", message: err.data.message, iconClass:'el-icon-warning-outline', duration: 3000, showClose: false });
            }
            this.loading = false;
          },
          () => {})
        } else {
          return false;
        }
      });
    },
    inputEmail() {
      this.$refs['formInfo'].clearValidate('email');
    },
    inputCode() {
      this.$refs['formInfo'].clearValidate('shareCode');
    }
  },
	created() {
    // setTimeout(()=>{
    //   this.$refs['firstName'].focus();
    // }, 100)
  },
  mounted() {},
  activated() {}
}
</script>

<style lang="less">
  @import "../../styles/common.less";
  @import "./CommonLogin.less";
  .user-info{
    .user-info-header {
      font-size: 48px;
      line-height: 43px;
      font-weight: 100;
    }
    .user-info-headerTwo {
      font-size: 48px;
      line-height: 43px;
      font-weight: bold;
    }
    .el-icon-loading {
      font-size: 32px;
      font-weight: bold;
    }
    .login-form {
      width: 440px;
      margin: 80px auto 0;
      input {
        .common-input();
        font-size: 18px;
        color: #333333;
        height: 26px;
        font-weight: bold;
      }
      input::-webkit-contacts-auto-fill-button {
        visibility: hidden;
        display: none !important;
        pointer-events: none;
        position: absolute;
        right: 0;
      }
      .el-input__inner:focus {
        background: #ffffff !important;
        box-shadow: 0px 0px 20px rgba(51, 51, 51, 0.15);
      }
      .el-input__inner:hover {
        border-color: #eeeeee !important;
      }
      .el-form-item__label {
        font-size: 16px;
        font-weight: normal;
        color: #333333;
        line-height: 30px;
        padding: 0;
      }
      .el-form-item {
        margin-bottom: 24px;
      }
      .el-input__inner {
        padding: 0;
        height: 56px;
        background: #EEEEEE;
        border-radius: 8px;
        padding: 16px;
      }
      .el-input {
        height: 56px;
        line-height: 56px;
      }
      // input.el-input__inner:focus {
      //   box-shadow: 0px 0px 20px rgba(51, 51, 51, 0.15);
      // }
      .el-form-item__error {
        margin-top: 4px;
      }
      .el-checkbox {
        float: left;
      }
      .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #333333;
        border-color: transparent;
      }
      .el-checkbox__inner {
        border-radius: 8px;
        width: 16px;
        height: 16px;
        border: 1px solid #979797;
      }
      .el-checkbox__inner::after {
        border: 1px solid #ffffff;
        border-left: 0;
        border-top: 0;
        height: 8px;
        left: 5px;
        width: 4px;
      }
      .el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: #979797;
      }
      .el-checkbox__input.is-checked.is-focus .el-checkbox__inner {
          border-color: #333333;
      }
      .el-checkbox, .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #979797;
        font-family: 'Avenir Next';
        font-weight: normal;
        font-size: 14px;
      }
    }
    .login-continue,
    .login-continue-active {
      position: absolute;
    }
  }
</style>