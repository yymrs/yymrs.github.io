<template>
  <div class="invitation-code">
    <div class="login-welcome">Welcome to</div>
    <img class="login-welcome-img" :src="projName" alt="">
    <div class="login-tip"><span>We’re only giving access to a selected few at the moment.<br >Please enter your invite code below.</span></div>
    <el-form :model="formInfo" ref="formInfo" class="login-form" :rules="rules" @submit.native.prevent>
      <el-form-item prop="invitation">
        <el-input ref="invitationInput" v-focus class="login-invitation" v-model="formInfo.invitation" @keyup.enter.native="submitForm()"></el-input>
      </el-form-item>
    </el-form>
    <!-- <img v-if="!(formInfo.invitation.toString().length)" class="login-continue" :src="continueBtn" alt=""> -->
    <!-- <img v-else class="login-continue-active" :src="continueBtnActive" alt="" @click="continueLink()"> -->
    <div v-if="formInfo.invitation.toString().length" class="login-continue-active" @click="continueLink()">Continue</div>
    <div v-else class="login-continue">Continue</div>
    <div class="login-join">
      <span>Don’t have an invite code? </span>
      <a href="https://share.hsforms.com/1NCrmohluRC2zaALPlKbHhQ51yxd" target="_blank">Join Pilot Program</a>
    </div>
  </div>
</template>

<script>
import { userShareCodePost } from "@/api/login";
export default {
  name: 'InvitationCode',
  components: {},
	data() {
		return {
      projName: require('@/static/projName@2x.png'),
      formInfo: {
        invitation: ''
      },
      rules: {
        invitation: []
      }
    }
  },
  computed: {},
  watch:{},
  methods: {
    commonBtn() {
      this.$refs['formInfo'].validate((valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '',
            spinner: 'el-icon-loading',
            background: 'rgba(51, 51, 51, 0.25)'
          });
          let bindshopifyVal = JSON.parse(localStorage.getItem('BINDSHOPIFY'));
          userShareCodePost({
            shareCode: this.formInfo.invitation
          },
          () => {
            loading.close();
            localStorage.setItem('HASINVITECODE', true);
            (bindshopifyVal && bindshopifyVal.action)
              ? this.$router.push({path: '/channels'})
              : this.$router.push({path: '/'})
          },
          () => {
            loading.close();
            // 手动校验
            {
              const dom = this.$refs['formInfo'];
              dom.clearValidate();
              this.rules.invitation.push({
                validator: (rule, value, callback) => {
                  callback('Invite code is invalid.');
                  // document.querySelector('el-form-item__error')[0].appendChild('<i class="el-icon-delete"></i>')
                },
                trigger: 'blur'
              })
              dom.validateField('invitation');
              this.rules.invitation = [];
            }
          },
          () => {})
        } else {
          return false;
        }
      });
    },
    submitForm() {
      if(this.formInfo.invitation.toString().length) {
        this.commonBtn();
      }
    },
    continueLink() {
      this.commonBtn();
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
  .invitation-code{
    .login-form {
      width: 320px;
      margin-top: 2px;
      margin-left: 44px;
      .login-invitation {
        input {
          .common-input();
          .common-text();
          height: 52px;
          text-align: center;
        }
      }
    }
    .login-continue,
    .login-continue-active {
      bottom: 46px;
    }
    .login-join {
      position: absolute;
      bottom: 0;
      left: 50%;
      margin-left: -170px;
      width: 340px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      a {
        font-weight: 700;
        color: #333333;
        text-decoration: underline;
      }
    }
  }
</style>