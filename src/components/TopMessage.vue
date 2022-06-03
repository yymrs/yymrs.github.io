<template>
  <div class="top-message-component">
    <div class="top-message-component-info">
      <div class="info-text-scroll-box" @mouseenter.stop="mouseEnterText" @mouseleave.stop="mouseLeaveText" ref="info-text-scroll-box">
        <div class="single-top-message" :class="{flipInX:currentIndex==inx}" v-for="(info,inx) in selfMessageList" :key="inx" :data-index='inx'>
          <svg><use :xlink:href="'#icon-message'" /></svg>
          <div class="info-text" :class="{'has-url':info.url}" :ref="'top-info-message'"  @click="infoTextHandle(info)">
           <span>{{info.title}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    messageList:{
      type:Array,
      default:()=>{
        return []
      }
    }
  },
  computed:{
    selfMessageList() {
      const tempMessageList = JSON.parse(JSON.stringify(this.messageList))
      tempMessageList.forEach((item)=>{
        item.title = this.onCheckNotificationTitleLength(item.title)
      })
      return tempMessageList
    }
  },
  data() {
    return {
      scrollTextInterval: null,
      currentIndex: 0
    }
  },
  mounted() {
    this.initTextScroll()
    // this.$EventBus.$emit("topMessage");
  },
  methods: {
    onCheckNotificationTitleLength(title) {
      const standerLength = 80;
      if(title?.length <= standerLength){
        return title;
      }else{
        const handleTitleArr = title.split(' ');
        let currentLength = 0;
        let objTitleStr = '';
        for(let index = 0; index<handleTitleArr.length ;index++){
          const wordItem = handleTitleArr[index];
          currentLength = objTitleStr.length + wordItem?.length;
          if(currentLength <= standerLength){
            if(objTitleStr === ''){
              objTitleStr = wordItem;
            }else{
              //标题中 如果出现连续的空格 空格会被转义成空字符串 导致计算长度失误 因此空格自动给添加上
              const replaceStr = wordItem === '' ? ' ' : wordItem;
              objTitleStr = objTitleStr + ' ' + replaceStr;
            }
            //当最后一个循环完成时，当前长度依然小于 标准长度 那么返回当前数据
            if(index === handleTitleArr.length -1 ){
              return objTitleStr ;
            }
          }else{
            return objTitleStr + ' …';
          }
        }
      }
    },
    mouseEnterText() {
      clearInterval(this.scrollTextInterval)
      this.scrollTextInterval = null
      // if(this.scrollTextInterval&&e.target.className.includes('single-top-message')) {
      // console.log('关闭',e.target.dataset.index);
      //   clearInterval(this.scrollTextInterval)
      //   this.scrollTextInterval = null
      //   console.log('this.scrollTextInterval',this.scrollTextInterval);
      //   this.currentIndex = Number(e.target.dataset.index)
      // }
    },
    mouseLeaveText() {
      this.initTextScroll()
    },
    initTextScroll() {
      if(this.messageList.length==1||this.scrollTextInterval) {
        return
      }
      this.scrollTextInterval = setInterval(()=>{
        this.currentIndex++
        if(this.currentIndex>=this.messageList.length) {
          this.currentIndex=0
        }
      },5000)
    },
    infoTextHandle(info) {
      this.$gtm.trackEvent({
        event: 'click_announcement',
        userId: JSON.parse(localStorage.getItem('USERINFO')).uuId,
      });
      if(info.url) {
        window.open(info.url,'_blank')
      }
    },
    // 根据宽度裁剪文字
    // backInfoInterceptText(infoElement,flag=false) {
    //   const fatherWidth = [infoElement][0].offsetWidth
    //   const childWidth = [infoElement.firstElementChild][0].offsetWidth
    //   if(childWidth>fatherWidth) {
    //     let childText = infoElement.firstElementChild.innerText
    //     let childTextArray = childText.split(' ')
    //     childText.replace(new RegExp(childTextArray[childTextArray.length-1] + '$'),'')
    //     infoElement.firstElementChild.innerText = childText.replace(new RegExp(childTextArray[childTextArray.length-1] + '$'),'')
    //     this.backInfoInterceptText(infoElement,true)
    //   }else if(flag) {
    //     infoElement.firstElementChild.innerText += ' ...' 
    //   }
    // },
  },
};
</script>

<style lang='less'>
.top-message-component {
  @media screen and (min-width: 768px){
    padding: 0 40px;
  }
  &.asideHidden {
    position: fixed;
    top: 0;
    z-index: 1000;
  }
  display: flex;
  box-sizing: border-box;
  // align-items: center;
  width: 100%;
  height: 30px;
  background: #ffeece;
  box-shadow: inset 0px 4px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  .top-message-component-info {
    display: flex;
    // align-items: center;
    justify-content: center;
    position: relative;
    width: 100%;
    .info-text-scroll-box {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      transform: translateY(0);
      transition: all .5s;
      .single-top-message {
        display: none;
        align-items: center;
        justify-content: center;
        height: 30px;
        flex-shrink: 0;
      }
      svg {
        width: 16px;
        height: 19px;
        margin-right: 8px;
      }
      .info-text {
        font-size: 14px;
        font-weight: 400;
        color: #333;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 630px;
        &.has-url:hover {
          cursor: pointer;
          text-decoration: underline;
        }
      }
    }
  }
  
  @keyframes flipInX {
    0% {
      transform: rotate3d(1,0,0,90deg);
      animation-timing-function: ease-in;
      opacity: 0
    }

    40% {
      transform: rotate3d(1,0,0,-20deg);
      animation-timing-function: ease-in
    }

    60% {
      transform: rotate3d(1,0,0,10deg);
      opacity: 1
    }

    80% {
      transform: rotate3d(1,0,0,-5deg)
    }

    100% {
      transform: rotate3d(1,0,0,0deg);
      opacity: 1
    }
  }
  .flipInX {
    display: flex !important;
    backface-visibility: visible!important;
    animation-fill-mode: forwards;
    animation: flipInX 1s
  }
}
</style>