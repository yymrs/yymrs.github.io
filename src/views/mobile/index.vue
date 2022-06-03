<template>
  <div class="mobile-open-web">
    <div class="main-img">
      <img :src="require('@/static/mobileOpenImg@2x.png')" alt="" />
    </div>
    <div class="mobile-open-web-title">Download Mobile Apps</div>
    <div class="mobile-open-web-tip">
      The Trendsi Web App is not supported on mobile devices. You can download
      our iOS or Android app below.
    </div>
    <div class="downloadImg-box">
      <div class="app-store" @click="downloadApple">
        <img :src="require('@/static/appStore@2x.png')" alt="" />
      </div>
      <div class="google-store" @click="downloadAnroid">
        <img :src="require('@/static/googleImg@2x.png')" alt="" />
      </div>
    </div>
    <!-- appStore@2x.png -->
    <!-- googleImg@2x.png -->
  </div>
</template>

<script>
export default {
  name: "Mobile",
  data() {
    return {};
  },
  methods: {
    downloadApple() {
      window.open(
        "https://apps.apple.com/us/app/trendsi-earn-from-home/id1525167315"
      );
    },
    downloadAnroid() {
      window.open("https://play.google.com/store/apps/details?id=com.shobby");
    },
  },
};
</script>
<style lang="less">
.mobile-open-web {
  padding-top: 100px;
  .main-img {
    text-align: center;
    font-size: 0;
    img {
      object-fit: cover;
      width: 146.87px;
      height: 252.23px;
    }
  }
  .mobile-open-web-title {
    font-family: Avenir Next;
    font-style: normal;
    font-weight: bold;
    font-size: 24px;
    line-height: 28px;
    /* identical to box height, or 117% */

    text-align: center;

    color: #333333;
  }
  .mobile-open-web-tip {
    margin: 24px 0 60px;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    line-height: 25px;
    text-align: center;

    /* Grey 66 */

    color: #666666;
  }
  .downloadImg-box {
    display: flex;
    padding: 0 24px;
    justify-content: center;
    font-size: 0;
    img {
      display: block;
      object-fit: cover;
      width: 150px;
      height: 50px;
    }
  }
}
</style>