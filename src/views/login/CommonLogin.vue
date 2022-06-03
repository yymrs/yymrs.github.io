<template>
  <div class="login">
    <router-link to="/"><img class="login-proj" :src="projName" alt=""></router-link>
    <div class="login-back" @click="backBtnLink()"
      v-if="!((this.$route.path === '/login') || (this.$route.path === '/login/setup-store') || (this.$route.path === '/login/questionnaire') || (this.$route.path === '/login/setup-addproducts') || (this.$route.path === '/login/setup-success'))">
      <img :src="backBtn" alt="">Back
    </div>
    <div class="login-content" :style="`height: ${
        this.$route.path === '/login'
        ? '465px'
        : this.$route.path === '/login/verification'
        ? '331px'
        : this.$route.path === '/login/info'
        ? '566px'
        : this.$route.path === '/login/questionnaire'
        ? '623px'
        : this.$route.path === '/login/invite-code'
        ? '401px'
        : this.$route.path === '/login/setup-store'
        ? '579px'
        : this.$route.path === '/login/setup-info'
        ? '624px'
        : this.$route.path === '/login/setup-addproducts'
        ? '661px'
        : this.$route.path === '/login/setup-success'
        ? '561px'
        : this.$route.path === '/login/add-channel'
        ? '531px'
        : '300px'
      };
      width: ${ this.$route.path === '/login/setup-addproducts' ? '801px' : '640px' };
      bottom: ${ this.$route.path === '/login' ? '70px' : '0' }`"
    >
      <router-view :key="key" />
    </div>
    <div class="login-footer" v-if="this.$route.path === '/login'">
      <!-- <span @click="openurl('Service')">Terms of Service</span> -->
      <!-- <span @click="openurl('Policy')">Privacy Policy</span> -->
      By clicking Continue, you agree to our <span @click="openurl('Service')">Terms and Conditions</span> and <span @click="openurl('Policy')">Privacy Policy</span>.
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  components: {
  },
	data() {
		return {
      showBack: false,
      projName: require('@/static/projNameTourist.png'),
      backBtn: require('@/static/backBtn@2x.png')
    }
  },
  computed: {
    key() {
      return this.$route.fullPath;
    }
  },
  watch: {},
  methods: {
    backBtnLink() {
      this.$router.back(-1);
    },
    openurl(url) {
      if(url === 'Service') {
        window.open('https://www.trendsi.com/terms-of-service','_blank'); // ,'location=no'
      }
      if(url === 'Policy') {
        window.open('https://www.trendsi.com/privacy-policy','_blank');
      }
    }
  },
	created() {
  },
  mounted() {},
  activated() {}
}
</script>

<style lang="less">
  .login {
    .login-proj {
      position: fixed;
      top: 40px;
      left: 40px;
      height: 40px;
    }
    .login-back {
      position: fixed;
      top: 132px;
      left: 40px;
      font-size: 20px;
      color: #333333;
      cursor: pointer;
      img {
        height: 12px;
        margin-right: 8px;
      }
    }
    .login-content {
      position: fixed;
      top: 0;
      bottom: 70px;
      left: 0;
      right: 0;
      margin-left:auto;
      margin-right:auto;
      margin-top:auto;
      margin-bottom:auto;
      text-align: center;
      width: 640px;
      height: 300px;
    }
    .login-footer {
      background: #ffffff;
      text-align: center;
      padding-bottom: 40px;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      margin-left:auto;
      margin-right:auto;
      // width: 434px;
      width: 500px;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: #333333;
      span {
        font-size: 12px;
        cursor: pointer;
        text-decoration: underline;
      }
      // span:hover {
      //   text-decoration: underline;
      // }
    }
  }
</style>
