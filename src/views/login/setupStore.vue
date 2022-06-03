<template>
  <div class="setup-store">
    <div class="setup-store-header">Connect or Create</div>
    <div class="setup-store-headertwo">an Online Store</div>
    <div class="setup-store-info">Add products to your store, instantly.</div>
    <el-radio
      class="setup-store-choice"
      v-model="value"
      :label="item.label"
      v-for="(item, index) in lists"
      :key="index">
      <div class="setup-store-content">
        <img v-if="value === item.label" src="@/static/checkYellow@2x.png" alt="">
        <img v-else src="@/static/nocheck@2x.png" alt="">
        <div class="setup-store-choice-text">{{ item.text }}</div>
      </div>
    </el-radio>
    <div v-if="value" class="login-continue-active button-setupstore" @click="continueLink(value)">Continue</div>
    <div v-else class="login-continue">Continue</div>
    <div class="login-later"><a href="#" @click="continueLater()">Set up later</a></div>
  </div>
</template>

<script>
import { setUpLater } from "@/api/login";
export default {
  name: 'ShopifyStore',
  components: {
  },
	data() {
		return {
      value: '',
      lists: [
        {label:'Yes', text: 'Connect my existing Shopify store.'},
        {label:'No', text: 'Create my personalized Trendsi store for FREE.'}
      ]
    }
  },
  computed: {},
  watch:{},
  methods: {
    continueLink(val) {
      if(val === 'Yes') {
        this.$router.push({path: '/login/add-channel'});
      }
      if(val === 'No') {
        this.$router.push({path: '/login/setup-info'});
      }
    },
    continueLater() {
      setUpLater({},
      () => {
        const allInfo = JSON.parse(localStorage.getItem('ALLINFO'));
        allInfo.setUpLater = 1;
        localStorage.setItem('ALLINFO', JSON.stringify(allInfo));
        this.$router.push({path: '/'})
      },
      () => {
        const allInfo = JSON.parse(localStorage.getItem('ALLINFO'));
        allInfo.setUpLater = 0;
        localStorage.setItem('ALLINFO', JSON.stringify(allInfo));
        this.$router.push({path: '/'})
      },
      () => {})
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
  .setup-store{
    .setup-store-header {
      font-weight: 100;
      font-size: 48px;
      line-height: 48px;
    }
    .setup-store-headertwo {
      font-weight: bold;
      font-size: 48px;
      line-height: 48px;
    }
    .setup-store-info {
      font-size: 18px;
      color: #979797;
      width: 327px;
      margin: 16px auto;
    }
    .el-radio {
      color: #333333;
    }
    .setup-store-choice {
      width: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-top: 40px;
      .el-radio__input {
        display: none;
      }
      .el-radio__label {
        padding-left: 0;
      }
      .el-radio__input.is-checked+.el-radio__label {
        color: #C79818;
      }
      .setup-store-content:hover {
        background: #FFFFFF;
        box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
        border-radius: 20px;
      }
      .setup-store-content {
        height: 72px;
        width: 339px;
        display: inline-flex;
        align-items: center;
        img {
          margin-left: 16px;
          width: 24px;
          height: 24px;
        }
        .setup-store-choice-label {
          margin-left: 16px;
          display: inline-block;
          font-weight: bold;
          font-size: 36px;
        }
        .setup-store-choice-text {
          font-size: 18px;
          width: 263px;
          line-height: 21px;
          white-space:normal;
          text-align: left;
          margin-left: 16px;
          display: inline-block;
        }
      }
    }
  }
</style>