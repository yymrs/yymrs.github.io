<template>
  <div class="classify-left-nav-container">
    <div class="classify-left-nav-box">
      <div class="title-1">
        <div @click="showOneChild">{{selfLeftNavData.name}}</div>
      </div>
      <!-- 详情页面过来的分类树展示
          1.最后一级分类没有分类树
          2.二级分类展示下面的三级分类数据
          3.一级分类展示二级分类数据
          4.点击右边的面包屑向上渲染数据
          例如我3级分类进来，是没有分类树的，点击一集分类面包屑后展示一级分类进入的分类树
       -->
      <div class="classify-title"
        v-if="selfLeftNavData&&selfLeftNavData.children&&selfLeftNavData.children.length>0"
      >
      <!-- active2:active2Child('title-2-child' + index,item,index),  -->
        <div
          class="title-2"
          :class="{ active:item&&item.active,active2:active2Child('title-2-child' + index,item,index)}"
          v-for="(item, index) in selfLeftNavData.children"
          :key="index"
        >
          <div
            class="title"
            @click="showTitle2Child('title-2-child' + index, index,item)"
          >
            {{item&&item.name}}
          </div>
          <div class="title-2-child" :style="{height:item&&item.height}" :ref="'title-2-child' + index" v-show="item&&item.children&&item.children.length>0">
            <div :class="{ active: two&&two.active }" v-for="(two,i) in item&&item.children" :key="i" class="title-2-child-item" @click="showChildItemThree(i,two,item&&item.children)">
              {{two&&two.name}}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  props:{
    leftNavData:{
      type:Object,
      default() {
        return {}
      }
    },
    changeNavId:{}
  },
  watch:{
    leftNavData:{
      handler(n) {
        // console.log(22222222,n);
        this.selfLeftNavData = JSON.parse(JSON.stringify(n))
        this.$nextTick(()=>{
          this.initListActive()
        })
      },
      // deep:true
    }
  },
  data() {
    return {
      activeTitle2: null,
      activeTitle3: null,
      selfLeftNavData: {}
    };
  },
  mounted() {
    this.$EventBus.$off('upClassifyLeftNav')
    this.$EventBus.$on("upClassifyLeftNav",()=>{
      console.log('更新');
      this.initListActive()
    })
  },
  
  destroyed() {
    this.$EventBus.$off('upClassifyLeftNav')
    window.removeEventListener('pushState',this.initListActive)
  },
  methods: {
    // 初始化当前激活的分类
    initListActive() {
      console.log('initListActive','-----');
      this.selfLeftNavData = JSON.parse(JSON.stringify(this.leftNavData))
      const currentPathNameList = location.pathname.split('/').filter(item=>item)
      const index = currentPathNameList.findIndex(item=>item==='classify')
      currentPathNameList.splice(index,1)
      const PathNameList = currentPathNameList.map(item=>{
        // debugger
        let TranslationName = decodeURI(item)
         TranslationName = TranslationName.replace(/\%2B/g, "+");//"+"转义
         TranslationName= TranslationName.replace(/\%26/g, "&");//"&" 
         TranslationName= TranslationName.replace(/\%23/g, "#");//"#"
         TranslationName= TranslationName.replace(/\%2F/g, "/");//"/"
         TranslationName= TranslationName.replace(/\%20/g, " ");//"/"
         TranslationName= TranslationName.replace(/\%26/g, "&");//"&"
         TranslationName= TranslationName.replace(/\&3D/g, "=");//"&"
        return decodeURI(TranslationName)
      })
      // 详情页面进入分类的激活判断
      if(this.$route.query.classifyId) {
        const query = location.search.substr(1)
        const pathName = { ...qs.parse(query)}
        const selectClassifyId = pathName.selectClassifyId
        this.selfLeftNavData?.children?.findIndex(item=>{
          if(item.id == selectClassifyId) {
            item.active = true
            tempData = item
            return true
          }else {
            const index = item.children?.findIndex(tItem=>{
              if(tItem.id == selectClassifyId) {
                tItem.active = true
                return true
              }
            })
            if(index!=-1) {
              item.active = true
              tempData = item
              return true
            }
          }
        })
       this.selfLeftNavData.children = this.selfLeftNavData.children.filter(item=>{
         item.children = item.children.filter(two=>{
          if(two.name) {
            return true
          }
         })
         if(item.name) {
           return true
         }
       }) 
       return
      }
      // 正常分类进入
      // 如果是三级分类
      let tempData 
      if(PathNameList[2]) {
        const index = this.selfLeftNavData?.children?.findIndex(item=>{
          const indexTwo = item.children.find(three=>{
             if(three.currentUrl.slice(-1)[0].trim() == PathNameList[2].trim()) {
              if(item.currentUrl.slice(-1)[0].trim() == PathNameList[1].trim()) {
                item.active = true
                three.active = true
                return true
              }
             }
          })
          if(indexTwo) {
            tempData = item
            return indexTwo
          }
        })
        if(tempData) {
          this.selfLeftNavData?.children?.splice(index,1,tempData)
        }
      }
      // 如果是二级分类
      else if(PathNameList[1]) {
        let findFlag = false
        const index = this.selfLeftNavData?.children?.findIndex(item=>{
          if(item.name.trim() == PathNameList[1].trim()) {
            item.active = true
            tempData = item
            findFlag = true
            return true
          }
        })
        if(findFlag) {
          this.selfLeftNavData?.children?.splice(index,1,tempData)
        }
      
      }
      

    },
    // 详情页面进入分类页面的侧边栏点击跳转
    detailUrlHistoryPushState(_query,item) {
      const path = location.pathname
      const query = location.search.substr(1)
      console.log(qs.parse(query));
      const classifyInfo = {}
      item.currentIds.forEach((id,i)=>{
        classifyInfo[id] = item.currentUrl[i]
      })
      const pathName = { ...qs.parse(query),'selectClassifyId':item.id,classifyInfo:JSON.stringify(classifyInfo), ..._query }
      const url = decodeURIComponent(path + "?" + qs.stringify(pathName))
      window.history.pushState({ name: 'newUrl' }, 'newUrl', url) // 无刷新浏览器添加url参数
    },
    historyPushState(_query,item){
      // console.log(item);
      // console.log(this.$route);
      let currentUrl = '/classify';
      item.currentUrl.map(item=>{
        currentUrl+='/'+item
      })
      // this.$emit('update:changeNavId',item.id)
      // this.$emit('searchData')
      // const path = location.pathname
      // const query = location.search
      // const pathName = { ...qs.parse(query), ..._query }
      // const url = decodeURIComponent(path + qs.stringify(pathName))
      window.history.pushState({ name: 'newUrl' }, 'newUrl', currentUrl) // 无刷新浏览器添加url参数
    },
    active2Child(name,item,index) {
      // const change = this.changeNavId
      // console.log('sdfdsfdsfdsf');
      this.$nextTick(()=>{
        if(this.selfLeftNavData?.children) {
          const childList = document.querySelectorAll(".title-2-child");
          const height = this.$refs[name][0].scrollHeight;
          if(item&&item.active) {
            item.active = true
            this.$refs[name][0].style.height = height + "px";
            Array.from(childList).map((item, _index) => {
              if (_index == index) {
                return;
              }
              item.style.height = "";
            });
            this.selfLeftNavData?.children?.forEach((item,i)=>{
              if(i==index) {
                return
              }
              if(item) {
                item.active = false
              }
            })
            return true
          }
        }
      })
      
    },
    showTitle2Child(name, index,item) {
      this.enumNavType(item)
      const height = this.$refs[name][0].scrollHeight;
      if (item&&item.active) {
        item.active = true
        item.children = item.children.map(_item=>{
          _item.active = false
          return _item
        })
        this.selfLeftNavData.children.splice(index,1,item)
      }
      // 其他分类全部高度隐藏

      this.selfLeftNavData.children.forEach((_item,i)=>{
        if(i==index) {
          this.$set(_item,'active',true)
          this.$set(_item,'height',height+"px")
        }else {
          this.$set(_item,'active',false)
          // 其他分类下面所有子项不激活
          _item.children = _item.children?.map(_item=>{
            _item.active = false
            return _item
          })
          this.$set(_item,'height','')
        }
      })
    },
    showOneChild() {
      // 40 50 60
      if(this.selfLeftNavData.navType==40||this.selfLeftNavData.navType==50||this.selfLeftNavData.navType==60) {
        return
      }
      if(this.selfLeftNavData.bannerId&&this.selfLeftNavData.navType==30) {
        var routeData = this.$router.resolve({ path: `/event?id=${this.selfLeftNavData.bannerId}` });
        window.open(routeData.href, '_blank');
        return
      }
      const childList = document.querySelectorAll(".title-2-child");
      Array.from(childList).map((item) => {
        item.style.height = "";
      });
      // 所有分类都不激活
      this.selfLeftNavData.children = this.selfLeftNavData.children.map(item=>{
        item.active = false
        const children = item.children.map(item=>{
          item.active = false
          return item
        })
        item.children = children
        return item
      })
      // this.$emit('update:changeNavId',this.selfLeftNavData.id)
      if(this.$route.query.classifyId) {
        this.detailUrlHistoryPushState({},{...this.selfLeftNavData})
      } else {
        this.historyPushState({},{currentUrl:[this.selfLeftNavData.name]})
      }
      // this.selfLeftNavData = this.leftNavData
      this.initListActive()
    },
    // 三级分类点击
    showChildItemThree(index,item,children) {
      this.enumNavType(item)
      this.activeTitle3 = index
      children.map((item,i)=>{
        if(i==index) {
          item.active = true
        }else {
          item.active = false
        }
        return item
      })
    },
    enumNavType(item) {
      console.log(item,'新的跳转');
      // const { name } = item
      // const route = this.$route
      switch (item.navType) {
        // 跳转分类
        case 10:
        case 20:
        case 70:
          // const currentName = route.params.name3||route.params.name2||route.params.name
            // eslint-disable-next-line no-case-declarations
            const params ={
              name:item.currentUrl[0],
              name2:item.currentUrl[1],
              name3:item.currentUrl[2],
              // name
            }
            // eslint-disable-next-line no-case-declarations
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
        break;
        // 跳转活动页面
        case 30:
          // eslint-disable-next-line no-case-declarations
          let routeData = this.$router.resolve({ path: `/event?id=${item.bannerId}` });
          window.open(routeData.href, '_blank');
        break;
        case 'self-classifyId':
          {
            const params ={
              name:item.currentUrl[0],
              name2:item.currentUrl[1],
              name3:item.currentUrl[2],
            }
            // eslint-disable-next-line no-case-declarations
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
            this.detailUrlHistoryPushState({},{...item,currentUrl:nameList,id:item.id,navType:'self-classifyId'})
          }
        break;
        default:
          break;
      }
    },
   
  },
};
</script>

<style lang="less">
.classify-left-nav-container {
  // position: fixed;
  // top: 0;
  // left: 40px;
  min-width: 100%;
  .classify-left-nav-box {
    .title-1 {
      margin-bottom: 14px;
      &>div {
        font-weight: 700;
        font-size: 18px;
        line-height: 32px;
        color: #333333;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .classify-title {
      // overflow: auto;
      // max-height: 420px;

      .title-2 {
        overflow: hidden;
        white-space: nowrap;
        &.active {
          height: auto;
          .title-2-child {
            transition: height 0.3s ease;
            // overflow: auto;
          }
          .title {
            font-weight: 700;
          }
        }
        margin-top: 10px;
        transition: height 0.3s ease;
        .title {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;    
          height: 24px;
          cursor: pointer;
          font-size: 14px;
          line-height: 28px;
          color: #333333;
          &:hover {
            font-weight: 700;
          }
        }
        .title-2-child {
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;    
          height: 0;
          // max-height: 300px;
          overflow: hidden;
          padding-left: 16px;
          font-size: 14px;
          line-height: 28px;
          color: #333333;
          transition: height 0.3s ease;
          .title-2-child-item {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;     
            cursor: pointer;
            margin-top: 10px;
            height: 28px;
            color: #979797;
            &.active {
              font-weight: 500;
              color: #333;
            }
            &:hover {
              font-weight: 500;
              color: #333;
            }
          }
        }
      }
    }
  }
}
</style>
