<template>
  <div class="error-404">
    <div class="bk-container">
      <div class="back-button" v-elementEvent @click="back">BACK</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  components: {},
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
    back() {
      window.location.href = 'https://www.trendsi.com/'
    }
  },
  created() {},
  mounted() {},
  activated() {},
};
</script>
<style lang="less">
.error-404 {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .bk-container {
    height: 400px;
    width: 800px;
    position: relative;
    background: url("../../static/404@2x.png") no-repeat;
    background-size: cover;
    .back-button {
      position: absolute;
      left: 42px;
      bottom: 41px;
      width: 240px;
      text-align: center;
      line-height: 48px;
      height: 48px;
      background: #333333;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
      border-radius: 50px;
      color: #fff;
      font-weight: 500;
      font-size: 16px;
    }
  }
}
</style>