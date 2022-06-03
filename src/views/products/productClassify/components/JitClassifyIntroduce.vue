<template>
  <div class="jit-classify-introduce-component">
    <div class="jit-classify-bk" :style="hasBkImg">
      <p class="title" :class="{hasBkImg}">{{jitData.navDescTitle}}</p>
      <p class="introduce" :class="{hasBkImg}">
        {{jitData.navDescInfo}}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    hasBkImg() {
      if (this.jitData.navDescImage) {
        return {
          minHeight:'192px',
          backgroundImage: `url(${this.jitData.navDescImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 100%",
        };
      }
      return null
    },
  },
  props:{
    jitData:{
      type:Object,
      default() {
        return {}
      }
    }
  }
};
</script>

<style lang="less">
.jit-classify-introduce-component {
  margin: 0 0 24px 0;
  .jit-classify-bk {
    box-sizing: border-box;
    background: #f9f9f9;
    border-radius: 20px;
    width: 100%;
    // height: 192px;
    color: #333333;
    position: relative;
    overflow: hidden;
    padding: 24px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .bk-img {
      position: absolute;
      // z-index: -1;
      height: 100%;
      width: 100%;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      border-radius: 8px;
    }
    .title {
      font-weight: 700;
      font-size: 24px;
      line-height: 33px;
      text-align: center;
      margin-bottom: 8px;
      word-break: break-word;
      &.hasBkImg {
        color: #FFFFFF;
        text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
      }
    }
    .introduce {
      font-weight: 400;
      text-align: center;
      line-height: 19px;
      padding: 0 35px;
      word-break: break-word;
      // margin-bottom: 60px;
      &.hasBkImg {
        padding: 15px 75px;
        background: rgba(255, 255, 255, 0.6);
        backdrop-filter: blur(8px);
        text-align: center;
      }
    }
  }
}
</style>
