<template>
  <div class="home-category-nav" @mousemove.stop='showHomeCategory'>
    <div class="home-category-container">
      <div class="home-category-container-list ms">
        <div
          class="left-direction switch-box"
          v-if="homeCategory.prev"
          @mousemove.prevent
        >
          <div class="switch-box-img" @click="switchNav('prev')">
            <img src="@/static/productDetail/left@2x.png" alt="" />
          </div>
        </div>
        <div
          class="home-category-list"
          :class="{center:homeCategoryListCenter}"
          v-scrollView="homeCategory"
          ref="homeCategory"
        >
          <div
            :class="['home-category-item', active == i ? 'active' : '']"
            v-for="(item, i) in list"
            :key="item.id"
            @mouseover="mouseover($event, i)"
            @mouseout="mouseout"
            @click="navJump(item)"
          >
            {{ item.name }}
          </div>
        </div>
        <div
          class="right-direction switch-box"
          v-if="homeCategory.next"
          @mousemove.prevent
        >
          <div class="switch-box-img" @click="switchNav('next')">
            <img src="@/static/productDetail/right@2x.png" alt="" />
          </div>
        </div>
      </div>
    </div>
    <!-- v-show="listChildrenTwo.length>0" -->
    <div class="home-category-content" v-show="listChildrenTwo.length>0">
      <div class="home-category-content-container ms">
        <div class="category-list-container">
          <div class="first-category" :class="{hasChild:listChildrenThree&&listChildrenThree.length>0,'child-warp':!findChildrenTwo&&listChildrenTwo.length>13&&listChildrenTwo.length<27}">
            <div class="category-list">
              <div @mousemove='showChildItem(i,item)' @click="twoCategoryJump(item)" :class="['category-list-item',i==childActive?'active':'']"  v-for="(item,i) in listChildrenTwo" :key="item.id">
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="two-category" v-if="findChildrenTwo">
            <div class="category-list">
              <div @mousemove='showChildItem2(i)' @click="threeCategoryJump(item)" :class="['category-list-item',i==childActive2?'active':'']" v-for="(item,i) in listChildrenThree" :key="item.id">
                {{ item.name }}
              </div>
            </div>
          </div>
          <div class="main-category-img" v-if="findActiveImg">
            <img
              v-if="activeImg"
              @click="imgCategoryJump"
              :src="activeImg"
              alt=""
            />
            <div v-if="activeImg&&navImageTitle" class="nav-image-title" @click="imgCategoryJump">
              {{navImageTitle}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {queryCategoryNavList} from '@/api/home'
import {hasScrolled} from '@utils/common'
export default {
  name: "HomeCategory",
  props: {},
  data() {
    return {
      list: [], // nav分类
      listChildrenTwo:[], // 2级分类
      listChildrenThree:[], // 3级分类
      homeCategory: {
        prev: false,
        next: false,
      },
      showHomeCategoryContent:false,
      active: 0,
      childActive:null,
      childActive2:null,
      activeImg:null,
      findActiveImg:null,
      navImageTitle:null,
      listChildrenOne:{},
      ChildrenTwo:{},
      findChildrenTwo:null,
      homeCategoryListCenter:false,
      hiddenClickOneCategory:false,
      oneCategoryMouseoverNum:1
    };
  },
  watch:{
    $route:{
      handler(n) {
        if(this.list.length>0) {
          this.active = this.list.findIndex(item=>{
            return item.name==n.params.name
          })
        }
        // console.log(this.active,'this.active');
      },
      deep:true,
      immediate:true
    }
  },
  mounted() {
    // 获取本地缓存分类，没有就重新请求
    this.getLocalStorageNavList()
    window.addEventListener('beforeunload', this.beforeunloadHandler)
    window.addEventListener('resize',this.watchWidht)
    document.addEventListener('mousemove',this.documentHiderCategoryContent)
    this.$EventBus.$off('hiddenNavTwoList')
    this.$EventBus.$on('hiddenNavTwoList',(flag)=>{
      this.hiddenClickOneCategory = flag
      if(flag) {
        this.documentHiderCategoryContent()
      }
    })
  },
  
  destroyed() {
    window.removeEventListener('resize',this.watchWidht)
    document.removeEventListener('mousemove',this.documentHiderCategoryContent)
  },
  methods: {
    beforeunloadHandler() {
      sessionStorage.setItem('TRENDSICATEGORYNAVLIST','')
    },
    getLocalStorageNavList() {
      let TRENDSICATEGORYNAVLIST = sessionStorage.getItem('TRENDSICATEGORYNAVLIST')
      if(TRENDSICATEGORYNAVLIST&&Array.isArray(JSON.parse(TRENDSICATEGORYNAVLIST))) {
        TRENDSICATEGORYNAVLIST = JSON.parse(TRENDSICATEGORYNAVLIST)
        this.list = TRENDSICATEGORYNAVLIST
        this.localStorageNavData(TRENDSICATEGORYNAVLIST)
      }else {
        this.queryCategoryNavList()
      }
    },
    watchWidht() {
      this.$nextTick(()=>{
        const el = this.$refs.homeCategory
        if(el) {
          const horizontaFlag = hasScrolled(el,'horizontal')
          if(horizontaFlag) {
            this.homeCategoryListCenter = false
            this.homeCategory.next = true
          }else {
            this.homeCategoryListCenter = true
            this.homeCategory.next = false
          }
        }
      })
    },
    mapChildren(listArr,parentItem) {
      if(Array.isArray(listArr)) {
        listArr.forEach((item=>{
          const currentUrl = parentItem?.currentUrl||[]
          const currentIds = parentItem?.currentIds||[]
          item.name = item.name.trim()
          item.currentUrl = [...currentUrl,item.name]
          item.currentIds = [...currentIds,item.id]
          if(item.children) {
            this.mapChildren(item.children,item)
          }
        }))
      } 
      return listArr
    },
    localStorageNavData(list) {
      sessionStorage.setItem('TRENDSICATEGORYNAVLIST',JSON.stringify(list))
      this.active = this.list.findIndex(item=>{
        return item.name==this.$route.params.name
      })
      this.$nextTick(()=>{
        const el = this.$refs.homeCategory
        const horizontaFlag = hasScrolled(el,'horizontal')
        if(horizontaFlag) {
          this.homeCategoryListCenter = false
          this.homeCategory.next = true
        }else {
          this.homeCategoryListCenter = true
        }
      })
    },
    queryCategoryNavList() {
      let data, success, error, complete;
      data = {
      };
      success = (res) => {
        const {result} = res
        const mapNewCategoryList = this.mapChildren(result.categoryNavInfoList)
        this.list = mapNewCategoryList
        this.localStorageNavData(this.list)
        
      };
      error = (res) => {
        console.log(res);
      };
      complete = () => {};
      queryCategoryNavList(data,success,error,complete)
    },
    documentHiderCategoryContent() {
      this.listChildrenTwo = []
      this.showHomeCategoryContent = false
      this.active = this.list.findIndex(item=>{
        return item.name==this.$route.params.name
      })
    },
    debounce(fn, wait) {
      var timeout = null;
      return function() {
          if(timeout !== null) clearTimeout(timeout);
          timeout = setTimeout(fn, wait);
      }
    },
    showChildItem(i,item) {
      this.childActive = i
      this.ChildrenTwo = item
      // 悬浮二级分类展示图片
      this.activeImg = item.navImage
      this.navImageTitle = item.navImageTitle
      this.childActive2 = null
      this.listChildrenThree = item.children
    },
    showChildItem2(i) {
      this.childActive2 = i
    },
    switchNav(type) {
      let e = this.$refs["homeCategory"];
      let clientWidth = e.clientWidth;
      let scrollDistance = 0;
      if (type == "next") {
        // let clientWidth = e.clientWidth;
        let timer = setInterval(() => {
          let ispeed = 4;
          scrollDistance = scrollDistance + ispeed;
          e.scrollLeft = e.scrollLeft + ispeed;
          if (
            scrollDistance >= clientWidth ||
            this.homeCategory.next == false
          ) {
            clearInterval(timer);
          }
        }, 2);
      } else {
        clientWidth = clientWidth + 40;
        let timer = setInterval(() => {
          let ispeed = 4;
          scrollDistance += ispeed;
          e.scrollLeft = e.scrollLeft - ispeed;
          if (scrollDistance >= clientWidth || e.scrollLeft == 0) {
            clearInterval(timer);
          }
        }, 2);
      }
    },
    mouseout() {
      if(this.hiddenClickOneCategory) {
        this.oneCategoryMouseoverNum = 0
        return
      }
      this.oneCategoryMouseoverNum++
    },
    mouseover(e, index) {
      if(this.hiddenClickOneCategory||this.oneCategoryMouseoverNum==0) {
        this.documentHiderCategoryContent()
        return
      }
      this.oneCategoryMouseoverNum=1
      const list = this.$refs.homeCategory;
      this.active = index; // 悬浮激活nav分类
      // 渲染二级分类
      this.renderTwoList(index)
      // this.showHomeCategoryContent = true
      const childLeft = e.target.offsetLeft + e.target.clientWidth;
      const childScrollLeft = e.target.offsetLeft;
      const parentWidth = [list][0].clientWidth;
      const parentScrollLeft = [list][0].scrollLeft;
      const parentLeft = parentScrollLeft + parentWidth;
      const leftDistance = childLeft - parentLeft;
      // console.log('parentWidth',parentWidth);
      // console.log('parentScrollLeft',parentScrollLeft);
      // console.log('leftDistance',leftDistance);
      // 左边滚动
      if (Math.abs(leftDistance) > parentWidth / 2) {
        const moveLeft = parentScrollLeft - childScrollLeft;
        if (moveLeft <= 0) {
          return;
        }
        let scrollDistance = 0;
        let timer = setInterval(() => {
          let ispeed = 1;
          scrollDistance = scrollDistance + ispeed;
          list.scrollLeft = list.scrollLeft - ispeed;
          if (scrollDistance >= moveLeft || this.homeCategory.prev == false) {
            clearInterval(timer);
          }
        }, 16);
      } else {
        // 右边滚动
        if (leftDistance > 0) {
          let scrollDistance = 0;
          let timer = setInterval(() => {
            let ispeed = 1;
            scrollDistance = scrollDistance + ispeed;
            list.scrollLeft = list.scrollLeft + ispeed;
            if (
              scrollDistance >= leftDistance ||
              this.homeCategory.next == false
            ) {
              clearInterval(timer);
            }
          }, 16);
        }
      }
    },
    // 查询分类是否有二级分类，和图片
    findActiveImgAndChildrenTwo(item) {
      this.findActiveImg = false
      this.findChildrenTwo = false
      if(Array.isArray(item)) {
        item.some(list=>{
          if(this.findActiveImg&&this.findChildrenTwo) {
            return true
          }
          if(list.navImage) {
            this.findActiveImg = true
          }
          if(list.children.length>0) {
            this.findChildrenTwo = true
          }
        })
      }
    },
    renderTwoList(index) {
      this.findActiveImgAndChildrenTwo(this.list[index].children)
      this.activeImg = this.list[index].children&&this.list[index].children[0]?.navImage
      this.navImageTitle = this.list[index].children&&this.list[index].children[0]?.navImageTitle
      this.childActive = 0
      this.childActive2 = null
      const twoList = this.list[index].children
      this.listChildrenOne = this.list[index]
      this.listChildrenThree = []
      if(Array.isArray(twoList)&&twoList.length>0) {
        if(Array.isArray(twoList)) {
          this.listChildrenTwo = twoList
          this.listChildrenThree = twoList[0]?.children
        }else {
          this.listChildrenTwo = []
        }
      }else {
          this.listChildrenTwo = []
      }
      
    },
    showHomeCategory() {
      this.showHomeCategoryContent = true
    },
    // 一级分类跳转分类页面
    navJump(item) {
      this.oneCategoryMouseoverNum = 1
      this.enumNavType(item)
      this.documentHiderCategoryContent()
    },
    enumNavType(item) {
      console.log(item,'新的跳转');
      const { name } = item
      const route = this.$route
      switch (item.navType) {
        // 跳转分类
        case 10:
        case 20:
        case 70:
          // eslint-disable-next-line no-case-declarations
          const currentName = route.params.name3||route.params.name2||route.params.name
          // !this.$route.query.classifyId 没有classifyId是虚拟分类
          if(!this.$route.query.classifyId&&name.trim()==(currentName&&currentName.trim())) {
            const params ={
              name:item.currentUrl[0],
              name2:item.currentUrl[1],
              name3:item.currentUrl[2],
              // name
            }
            const nameList = []
            for (const key in params) {
              if (Object.hasOwnProperty.call(params, key)) {
                if(!params[key]) {
                  delete params[key]
                }else {
                  nameList.push(params[key])
                }
              }
            }
            this.historyPushState({},{currentUrl:nameList,id:item.id})
            console.log('相同路径点---------');
            this.$EventBus.$emit("upClassifyLeftNav")
          }else {
            let _params = {
              name:item.currentUrl[0],
              name2:item.currentUrl[1],
              name3:item.currentUrl[2],
            }
            for (const key in _params) {
              if (Object.hasOwnProperty.call(_params, key)) {
                const value = _params[key];
                if(!value) {
                  delete _params[key]
                }
              }
            }
            const ClassifyMoreName = 'ClassifyMore' + (Object.keys(_params).length==1?'':Object.keys(_params).length)
            console.log('-------不相同路径点---------');
            this.$emit('setWatchPushState',false)
            this.$router.push({
              name:ClassifyMoreName,
              params:_params
            })
          }
        break;
        // 跳转活动页面
        case 30:
          // eslint-disable-next-line no-case-declarations
          let routeData = this.$router.resolve({ path: `/event?id=${item.bannerId}` });
          window.open(routeData.href, '_blank');
        break;
        default:
          break;
      }
    },
    historyPushState(_query,item){
      let currentUrl = '/classify';
      item.currentUrl.map(item=>{
        currentUrl+='/'+item
      })
      this.$EventBus.$emit('updateChangeNavId',false)
      window.history.pushState({ name: 'newUrl' }, 'newUrl', currentUrl) // 无刷新浏览器添加url参数
    },
    twoCategoryJump(item) {
      // const name = this.listChildrenOne.name
      this.enumNavType(item)
      // if(item.bannerId) {
      //   var routeData = this.$router.resolve({ path: `/event?id=${item.bannerId}` });
      //   window.open(routeData.href, '_blank');
      //   return
      // }
      // this.$router.push({
      //   name:'ClassifyMore2',
      //   params:{
      //     name,
      //     name2:item.name
      //   }
      // })
      this.documentHiderCategoryContent()

    },
    imgCategoryJump() {
      // const name = this.listChildrenOne.name
      // debugger
      const item = this.listChildrenTwo[this.childActive]
      this.enumNavType(item)
      // if(item.bannerId) {
      //   var routeData = this.$router.resolve({ path: `/event?id=${item.bannerId}` });
      //   window.open(routeData.href, '_blank');
      //   return
      // }
      // this.$router.push({
      //   name:'ClassifyMore2',
      //   params:{
      //     name,
      //     name2:item.name
      //   }
      // })
      this.documentHiderCategoryContent()
      
    },
    threeCategoryJump(item) {
      // const name = this.listChildrenOne.name
      // const name2 = this.ChildrenTwo.name
      this.enumNavType(item)
      // const {currentUrl} = item
      // if(item.bannerId) {
      //   var routeData = this.$router.resolve({ path: `/event?id=${item.bannerId}` });
      //   window.open(routeData.href, '_blank');
      //   return
      // }
      // this.$router.push({
      //   name:'ClassifyMore3',
      //   params:{
      //     name,
      //     name2:currentUrl[1],
      //     name3:item.name
      //   }
      // })
      this.documentHiderCategoryContent()
    },
    
  },
};
</script>

<style lang="less">
.home-category-nav {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 99;
  width: 100%;
  .home-category-container {
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.05);

    .home-category-container-list {
      max-width: 1320px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      overflow: hidden;
      position: relative;
      height: 48px;
    }
    .switch-box {
      position: relative;
      flex-shrink: 0;
      width: 40px;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      // top: 9px;
      cursor: pointer;
      &.left-direction {
        left: 0;
        justify-content: flex-start;

        &::before {
          right: -30px;
          background-image: linear-gradient(
            270deg,
            hsla(0, 0%, 100%, 0) 0,
            #fff
          );
        }
      }
      &.right-direction {
        right: 0;
        justify-content: flex-end;
        &::before {
          // right: -40px;
          left: -30px;
        }
      }
      &::before {
        content: "";
        height: 48px;
        position: absolute;
        top: 0px;
        width: 30px;
        background-image: linear-gradient(90deg, hsla(0, 0%, 100%, 0) 0, #fff);
      }
      .switch-box-img {
        width: 24px;
        height: 24px;
        background: #eeeeee;
        border-radius: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      img {
        height: 12px;
      }
    }
    .home-category-list {
      position: relative;
      display: flex;
      overflow: auto hidden;
      flex: 1;
      // height: 68px;
      justify-content: space-between;
      padding-bottom: 4px;
      margin-bottom: -14px;
      &.center {
        justify-content: center;
      }
      &::-webkit-scrollbar {
        width: 0 !important;
      }
      &::-webkit-scrollbar-thumb {
        display: none;
      }
    }
    .home-category-item {
      cursor: pointer;
      white-space: nowrap;
      &:nth-child(1) {
        margin-left: 0;
      }
      &.active {
        color: #c79818;
        &::before {
          position: absolute;
          bottom: -5px;
          content: "";
          width: 100%;
          box-sizing: border-box;
          height: 4px;
          background: #c79818;
        }
      }
      position: relative;
      color: #333;
      font-weight: 500;
      font-size: 18px;
      margin-left: 24px;
    }
  }
  .home-category-content {
    position: absolute;
    width: 100%;
    height: 100%;
    min-height: 490px;
    max-height: 490px;
    left: 0;
    top: 48px;
    z-index: -1;
    background: #ffffff;
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
    border-radius: 0px 0px 20px 20px;
    box-sizing: border-box;
    .home-category-content-container {
      height: 100%;
      padding: 24px 40px;
      max-width: 1320px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      box-sizing: border-box;
      justify-content: center;
      .category-list-container {
        display: flex;
        // flex: 1;
        .category-list {
          overflow: auto;
          height: 100%;
          width: 260px;
        }
        .first-category {
          overflow: auto;
          height: 100%;
          // max-width: 300px;
          width: 260px;
          margin-right: 24px;
          // padding-right: 1px;
          // border-right: 1px solid #EEEEEE;
          // flex: 1;
          &.child-warp {
            display: flex;
            flex-direction: column;
            flex-wrap: wrap;
            width: auto;
            .category-list {
              overflow: initial;
              display: flex;
              flex-direction: column;
              flex-wrap: wrap;
              width: 520px;
              .category-list-item {
                flex-shrink: 0;
                width: 260px;
                &:nth-child(14) {
                  margin-top: 0;
                }
              }
            }
          }
          &.hasChild{
            border-right: 1px solid #EEEEEE;
          }
        }
        .two-category {
          flex: 1;
          .category-list-item {
            font-weight: normal;
            &:hover {
              font-weight: 500;
            }
            &.active {
              font-weight: 500;
            }
          }
        }
        .line {
          width: 1px;
          background: #EEEEEE;
          margin: 0 80px;
        }
        .category-list-item {
          cursor: pointer;
          font-weight: 500;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          &:nth-child(1) {
            margin-top: 0;
          }
          margin-top: 16px;
          &.active {
            font-weight: bold;
          }
        }
      }
      .main-category-img {
        max-width: 260px;
        width: 260px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        flex-direction: column;
        &:hover {
          .nav-image-title {
            font-weight: 700;
          }
          img {
            opacity: .8;
          }
        }
        .nav-image-title {
          cursor: pointer;
          margin-top: 12px;
        }
        img {
         cursor: pointer;
          width: 200px;
          height: 300px;
          left: 1108px;
          top: 24px;
          background: #f9f9f9;
          border-radius: 12px;
        }
      }
    }
  }
}
</style>
