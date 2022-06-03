<template>
  <div class="setup-success">
    <div class="setup-success-congrats">Congrats!</div>
    <div class="setup-success-info">Your Trendsi store is now live.</div>
    <img src="@/static/congrats@2x.png" alt="">
    <div class="setup-success-left" @click="doneBtn()">Continue</div>
    <div class="setup-success-right" @click="previewBtn()">Preview My Trendsi Store</div>
  </div>
</template>

<script>
export default {
  name: 'SetupSuccess',
  components: {
  },
	data() {
		return {
      userInfo: JSON.parse(localStorage.getItem('USERINFO'))
    }
  },
  computed: {},
  watch:{},
  methods: {
    previewBtn() {
      // window.open(`${process.env.VUE_APP_BASE_URL}/shop/${this.userInfo.shopId}`,'_blank');
      window.open(this.userInfo.domainName,'_blank');
    },
    doneBtn() {
      const activity_url = localStorage.getItem('ACTIVITYURL');
      if(activity_url) {
        window.open(activity_url, '_top');
      } else {
        this.$router.push({path: '/'});
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
  @import "../../styles/common.less";
  @import "./CommonLogin.less";
  .setup-success{
    img {
      // width: 260px;
      height: 238px;
      margin: 0 auto;
      display: block;
    }
    .setup-success-congrats {
      font-weight: bold;
      font-size: 48px;
      line-height: 28px;
    }
    .setup-success-info {
      font-weight: 100;
      font-size: 48px;
      color: #000000;
      margin-top: 32px;
      line-height: 28px;
      margin-bottom: 80px;
    }
    .setup-success-left {
      cursor: pointer;
      margin-top: 100px;
      display: inline-block;
      width: 256px;
      height: 56px;
      line-height: 56px;
      border: 2px solid #333333;
      box-sizing: border-box;
      filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.15));
      border-radius: 28px;
      font-weight: 500;
      font-size: 18px;
    }
    .setup-success-left:hover { opacity: 0.6; }
    .setup-success-left:active { opacity: 0.8; }
    .setup-success-right {
      cursor: pointer;
      margin-top: 100px;
      display: inline-block;
      margin-left: 24px;
      width: 256px;
      height: 56px;
      line-height: 56px;
      border: 1px solid #333333;
      box-sizing: border-box;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
      border-radius: 28px;
      font-weight: 500;
      font-size: 18px;
      color: #FFFFFF;
      background: #333333;
    }
    .setup-success-right:hover { opacity: 0.6; }
    .setup-success-right:active { opacity: 0.8; }
  }
</style>