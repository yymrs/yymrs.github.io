<template>
  <div class="switch-component">
    <div class="switch-container" @click='switchCircles' :class="{open}">
      <div class="switch-circle" ref="circle"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "switch-component",
  props: {
    open:{
      type: Boolean,
      // default: false
    }
  },
  watch: {
    open() {
      this.changeStyle()
    }
  },
  mounted() {
    this.changeStyle()
  },
  methods: {
    changeStyle() {
      if(this.open) {
        this.$refs.circle.style.transform = 'translateX(24px)'
      }else{
        this.$refs.circle.style.transform = 'translateX(0)'
      }
    },
    switchCircles() {
      this.$emit('update:open',!this.open)
      this.$emit('inputfocus')
    },
  },
};
</script>

<style lang="less" scoped>
.switch-component {
  .switch-container {
    &.open {
      background: #C79818;
    }
    width: 56px;
    height: 32px;
    left: 16px;
    box-sizing: border-box;
    padding: 4px;
    top: 12px;
    background: #eeeeee;
    border-radius: 20px;
    display: flex;
    // transform: translateX(-50%);
    align-items: center;
    .switch-circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #ffffff;
      transition: transform 0.3s;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
    }
  }
}
</style>