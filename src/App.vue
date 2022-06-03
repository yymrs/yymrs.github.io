<template>
  <div id="app">
    <router-view v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      countTimer: null,
      isRouterAlive:true
    }
  },
  provide(){
    return{
      reload: this.reload
    }
  },
  methods: {
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(function(){
        this.isRouterAlive = true;
      })
    }
    // handleScroll(e) {
    //   document.styleSheets[0].addRule(`.${e.target.className}::-webkit-scrollbar-thumb`, 'visibility:inherit !important'); // document.styleSheets[0].insertRule('*::-webkit-scrollbar {display:block !important}', 0);
    //   if(this.countTimer) { clearTimeout(this.countTimer); }
    //   this.countTimer = setTimeout(()=>{
    //     document.styleSheets[0].addRule(`.${e.target.className}::-webkit-scrollbar-thumb`, 'visibility:hidden !important');
    //   }, 500);
    // },
    // debounce(fn, delay = 500) { // 防抖
    //   let timer = null;
    //   return function() {
    //     if(timer) clearTimeout(timer);
    //     timer = setTimeout(()=> {
    //       fn.apply(this, arguments)
    //       timer = null
    //     }, delay)
    //   }
    // },
    // throttle(fn, delay = 500) { // 节流
    //   let timer = null;
    //   return function() {
    //     if(timer) return;
    //     timer = setTimeout(()=> {
    //       fn.apply(this, arguments)
    //       timer = null
    //     }, delay)
    //   }
    // }
  },
  mounted () {
    // window.addEventListener('scroll', (e)=> {
    //   if( !(e.srcElement.className === 'bag-info') ) { this.handleScroll(e); }
    // }, true)
    // window.addEventListener('scroll', this.throttle(()=> {
    //   this.handleScroll();
    // }, 500), true)
    // window.addEventListener('setItemEvent', function (e) {
    // })
  },
  created() {}
}
</script>

<style lang="less">
  *, html, body {
    margin: 0;
    padding: 0;
    font-family: 'Avenir Next';
    font-size: 14px;
  }
  body {
    padding: 0 !important;
  }
  html,body,#app {
    height: 100%;
  }
  *::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    // display: none;
  }
  *::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background-color: rgba(0, 0, 0, 0.2);
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    // visibility: hidden;
  }
  // *::-webkit-scrollbar-track { background:#acaeac; }
</style>
