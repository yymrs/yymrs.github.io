<template>
  <div class="seft-tip-info" :class="{ [direction]: direction }">
    <img
      :src="currentIcon"
      @mousemove="mousemove"
      @mouseout="mouseout"
      @click="click"
    />
    <div class="tip-content" :style="{width}" v-show="isShow" ref="tipContent">
      <span>
        <slot></slot>
      </span>
    </div>
  </div>
</template>

<script>
// import x from ''
export default {
  props: {
    width: {
    },
    icon: {
      default: () => require("@/static/blackTip@2x.png"),
    },
    direction: {
      type: String,
      default: "top",
    },
  },
  data() {
    return {
      isShow: false,
    };
  },
  computed: {
    currentIcon() {
      if (!this.isShow) {
        return require("@/static/whiteTip@2x.png");
      } else {
        return this.icon;
      }
    },
  },
  watch: {},
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$refs.tipContent.style[this.direction] = "30px";
    },
    mousemove() {
      this.isShow = true;
    },
    mouseout() {
      this.isShow = false;
    },
    click() {
      // this.isShow = true;
      // document.addEventListener("click", (e) => {
      //   console.log(e);
      // });
    },
  },
};
</script>
<style lang='less' scoped>
.seft-tip-info {
  position: relative;

  &.bottom {
    .tip-content::before {
      bottom: -10px;
      border-top: 10px solid rgba(51, 51, 51, 0.6);
      content: "";
      position: absolute;
      bottom: -10px;
      top: initial;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: none;
      box-shadow: 0px 4px 8px rgb(0 0 0 / 15%);
    }
  }
  img {
    cursor: pointer;
    display: block;
    width: 18px;
    height: 18px;
  }
  .tip-content {
    position: absolute;
    z-index: 99;
    padding: 12px 8px 15px 8px;
    transform: translateX(-50%);
    background: rgba(111, 111, 111);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
    width: 304px;
    border-radius: 8px;
    line-height: 20px;
    left: 9px;
    &::before {
      content: "";
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 10px solid rgba(51, 51, 51, 0.6);
      box-shadow: 0px 4px 8px rgb(0 0 0 / 15%);
    }

    span {
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      display: inline-block;
      color: #fff;
    }
  }
}
</style>