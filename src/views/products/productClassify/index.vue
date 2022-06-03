<template>
  <div
    class="classify-page"
    ref="classifyPage"
    @scroll="scrollDom"
    :class="{ noisAddTransfom: isAddTransfom, isTourist }"
  >
    <HomeCategory @setWatchPushState='setWatchPushState'></HomeCategory>

    <div class="classify-page-container">
      <div class="classify-page-container-box ms">
        <div class="left-nav-filter-box" :class='{changeNavHeight}'>
          <LeftNav :leftNavData='leftNavData' ref="leftNavClassify" :changeNavId.sync='changeNavId'></LeftNav>
          <div class="classify-filter-sort-box" v-if="leftNavData.name!='Trendsi Luxe'">
            <filter-sort
            class="classify-filter-sort flex-column"
            :sortValue="sortValue"
            @filterApply="dialogFilterApply"
            @sortApply="dialogSort"
            @classify="editParnentStyle"
            @regionChange="regionChange"
            @timeChange="timeChange"
            @inventoryChange="inventoryChange"
            @sortChange="sortChange"
            :isSort='false'
            :hiddenFilter="hiddenFilter"
          ></filter-sort>
          </div>
        </div>
       
        <div class="products-container" :class="{ isTourist }">
          <div class="classify-page-nav product-filter">
            <div class="nav-url-classify">
              <span class="home" @click="$router.push({path:'/'})">
                Home
              </span>
              <!-- 详情页面路由进入的分类列表 需要从url上面获取 -->
              <div class="computed" v-for="(item,i) in categoryInfo.currentUrl" :key="i" @click="jumpUrl(i)">
                / <span>{{item}}</span>
              </div>
              <div class="total-item">
                <span>({{totalItem}} Items)</span>
              </div>
            </div>
            <!-- jit介绍内容 -->
            <JitClassifyIntroduce v-if="showJitClassifyIntroduce" :jitData='jitData' />
            
            <div class="right-sort-filter">
              <div
                v-if="!isTourist"
                class="handle-item"
                v-elementEvent
                @click="handleItem('showAddToCollection')"
              >
                <img src="@/static/addToCollectionW@2x.png" alt="" />
                <span>Add to Collections</span>
              </div>
              <div
                class="handle-item"
                v-if="!isTourist&&navMarketingUrl"
                v-elementEvent
                @click="openMarketing"
              >
                <img src="@/static/doadImageB@2x.png" alt="" />
                <span>Marketing Materials</span>
              </div>
              <el-select v-model="filterVal.sort" clearable placeholder="Sort" @change="sortChange">
                <el-option
                  v-for="item in filterVal.sortOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div
            v-if="!products.length && isLoadProduct !== true"
            :class="{ isTourist }"
            class="no-data"
          >
            <img src="@/static/noData@2x.png" alt="" />
            <div>No Results</div>
          </div>
          <ProductsSingle
            :productsData="products"
            @showDetail="showDetail"
            @updateproduct="updateProduct"
            @updateSingleProduct="updateSingleProduct"
            @classify="editParnentStyle"
            :amplitude='amplitude'
          />
          <Pagination class="classify-page-pagination" v-show="products.length > 0" :totalPages='totalPages' :curPage='curPage' @jumpPage='jumpPage' />
          <!-- 一键导出合集 -->
          <CreatedAndAddCollection
            v-if="showAddToCollection"
            :dialogVisible.sync="showAddToCollection"
            @updateproduct="updateProduct"
            @updateProductAll='updateProductAll'
            @createdAddDefaultCollectionSuccessInfo="
              chidlCreatedAddDefaultCollectionSuccessInfo
            "
            :currentClickProductId="null"
            :classifyProductList='products'
          />
          <el-backtop :bottom="100" :right="20" target=".products-container">
            <div class="classify-top">
              <img src="../../../static/top@2x.png" alt="" />
            </div>
          </el-backtop>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { homeProductPost } from "@/api/production";
import {getLeftCategoryNavTree,getCategoryTree,getMarketingUrl} from '@/api/home'
import ProductsSingle from "../components/productSingle";
import FilterSort from "@/components/FilterSort";
import HomeCategory from "@/views/products/components/HomeCategory";
import LeftNav from "@/views/products/productClassify/components/LeftNav";
import Pagination from '@/components/Pagination.vue';
import recentviewed from "@/mixins/recentviewed";
import amplitudeMixins from "@/mixins/amplitudeMixins";
import CreatedAndAddCollection from "@/views/products/components/createdAndAddCollection";
import successInfo from '@/mixins/successInfo'
import {getStoragePrefix} from '@/utils/common'
import qs from 'qs'
import JitClassifyIntroduce from './components/JitClassifyIntroduce.vue'
var _wr = function(type) {
   var orig = history[type];
   return function() {
       var rv = orig.apply(this, arguments);
      var e = new Event(type);
       e.arguments = arguments;
       window.dispatchEvent(e);
       return rv;
   };
};
history.pushState = _wr('pushState');
history.replaceState = _wr('replaceState');
export default {
  name: "Classify",
  mixins: [ recentviewed, amplitudeMixins, successInfo ],
  components: {
    ProductsSingle,
    FilterSort,
    HomeCategory,
    LeftNav,
    Pagination,
    CreatedAndAddCollection,
    JitClassifyIntroduce
  },
  computed:{
    showJitClassifyIntroduce() {
      const jitData = this.jitData
      const hasJitTip = jitData.navDescInfo&&jitData.navDescTitle
      if(!this.$route.query.classifyId&&hasJitTip) {
        return true
      }
      return false
    }
    //  
  },
  data() {
    return {
      curPage: 1,
      pageSize: 40,
      isFinished: false,
      isLoadProduct: true,
      isAddTransfom: false,
      products: [],
      navOverflow: false,
      sortValue: "Featured",
      filterval: [],
      dateValue: undefined,
      isActivated: null,
      total: undefined,
      hiddenFilter: {},
      filterVal:{
        sort : '',
        sortOptions: [
          {
            value: 'Featured',
            label: 'Featured'
          },
          {
            value: 'Newest',
            label: 'Newest'
          },
          {
            value: 'shoppurchasepricedesc',
            label: 'Product Cost (High to Low)'
          },
          {
            value: 'shoppurchasepriceasc',
            label: 'Product Cost (Low to High)'
          }
        ]
      },
      stockGt:undefined,
      leftNavData:{},
      categoryInfo:{},
      totalPages:1,
      totalItem:0,
      changeNavId:false,
      pathNameList:'',
      openWatchPushState:true,
      changeNavHeight:false,
      amplitude:{
        buy_sample:{
          page_code:'product_listing_page'
        },
        event_value_productsId: [],
        pv_id: ''
      },
      showAddToCollection: false, //添加到合集弹出框
      navMarketingUrl:false,
      oldClassifyMoreName:undefined,
      jitData:{},
    };
  },
  created() {
    console.log('分类页面初始化--------');
    this.observerData.initflag = true;
    window.addEventListener('pushState',this.reloadData)
    this.getLeftCategoryNavTree()
    this.$EventBus.$off('classifyPageNavHeight')
    this.$EventBus.$on('classifyPageNavHeight',()=>{
      this.changeNavHeight = true
    })
    // 更改自定义价格后通知更新数据
    this.$EventBus.$off("upProductsClassifyPage");
    this.$EventBus.$on("upProductsClassifyPage", () => {
      this.curPage = 1;
      this.isFinished = false;
      this.getHomeProduct();
    });
  },
  deactivated() {
    // window.onresize = null;
    // window.onhashchange = null; 
    this.$EventBus.$off('classifyPageNavHeight')
    window.removeEventListener('pushState',this.reloadData)
  },
  beforeRouteLeave(to, from, next) {
    this.openWatchPushState = false
    next();
  },
  destroyed() {
    window.removeEventListener('pushState',this.reloadData)
  },

  methods: {
    setWatchPushState(flag) {
      this.openWatchPushState = flag
    },

    // 递归处理categoryInfo数据
    mapChildren(listArr,parentItem) {
      if(Array.isArray(listArr)) {
        listArr.forEach((item=>{
          const currentUrl = parentItem?.currentUrl||[]
          const currentIds = parentItem?.currentIds||[]
          const currentBannerIds = parentItem?.bannerIds||[]
          item.name = item.name.trim()
          item.active = false
          item.id = Number(item.id)
          item.currentIds = Array.from(new Set([...currentIds,item.id]))
          // 过滤相同的url，以id的数组长度为准，如果url的数组小于id的数组那么不过滤url的数组
          const tempUrl = Array.from(new Set([...currentUrl,item.name]))
          if(tempUrl.length<item.currentIds.length) {
            item.currentUrl = [...currentUrl,item.name]
          }else {
            item.currentUrl = tempUrl
          }
          item.bannerIds = Array.from([...currentBannerIds,item.bannerId])
          if(item.children) {
            this.mapChildren(item.children,item)
          }
        }))
      } 
      return listArr
    },

    filterDetailJumpCategoryUrl(PathNameList) {
      const query = location.search.substr(1)
      console.log(qs.parse(query));
      const pathName = { ...qs.parse(query) }
      const detailInfo = JSON.parse(pathName.classifyInfo) || JSON.parse(this.$route.query.classifyInfo)
      console.log(PathNameList);
      const currentUrl=[],currentIds=[]
      for (const key in detailInfo) {
        if (Object.hasOwnProperty.call(detailInfo, key)) {
          const name = detailInfo[key];
          currentUrl.push(name)
          currentIds.push(key)
        }
      }
      this.categoryInfo = {
        currentUrl:Object.values(detailInfo),
        currentIds:Object.keys(detailInfo),
        navType:'self-classifyId', // 自定义的navType 用来判断是商品详情页真实分类面进入的分类
        navLevel:Object.values(detailInfo).length
      }
    },
    // 查询当前页面的分类面包屑 url
    findCurrentCategoryInfo() {
      // 1.详情页面跳转展示的  2.正常导航分类展示的
      const currentPathNameList = location.pathname.split('/').filter(item=>item)
      const index = currentPathNameList.findIndex(item=>item==='classify')
      currentPathNameList.splice(index,1)
      const PathNameList = currentPathNameList.map(item=>{
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
      this.pathNameList = PathNameList
      const title = this.pathNameList[this.pathNameList.length-1] +' | Trendsi'
      document.title = title
      if(this.$route.query.classifyId) {
        this.filterDetailJumpCategoryUrl(PathNameList)
      } else {
        if(this.leftNavData.currentUrl.toString()==PathNameList.toString()){
          this.categoryInfo = this.leftNavData
          return true
        }else if(this.leftNavData.children&&this.leftNavData.children.length>0) {
          this.mapFindEqualUrlList(this.leftNavData)
        }
      }
     
    },
    // 递归查询分类categoryInfo
    mapFindEqualUrlList(item) {
      item.children.find(childItem=>{
        if(childItem.currentUrl.toString()==this.pathNameList.toString()){
          this.categoryInfo = childItem
          return true
        }else if(childItem.children&&childItem.children.length>0) {
          const flag = this.mapFindEqualUrlList(childItem)
          if(flag) {
            return true
          }
        }
      })

    },
    // 获取左边分类栏数据 1.导航分类列表进入分类。2.商品详情路由进入分类
    getLeftCategoryNavTree() {
      let data, success, error, complete , newLeftNavData;
      const categoryName = this.$route.params.name
      const query = location.search.substr(1)
      const urlQuery = { ...qs.parse(query) }
      const classifyId = urlQuery.classifyId || this.$route.query.classifyId
    
      success = (res) => {
        // 1.获取侧边栏导航数据
        // 2.过滤处理导航数据
        // this.leftNavData = res.result.categoryNavInfoList[0]
        // 3.两种情况一种详情页面跳转过来展示真实分类树，一种头部导航分类跳转的虚拟分类树
        if(this.$route.query.classifyId) {
          const { result } = res
          const currentPathNameList = location.pathname.split('/').filter(item=>item)
          const index = currentPathNameList.findIndex(item=>item==='classify')
          currentPathNameList.splice(index,1)
          const PathNameList = currentPathNameList.map(item=>{
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
          this.pathNameList = PathNameList
          const name = this.pathNameList[this.pathNameList.length-1] 
          let level 
          if(Array.isArray(result)) {
            const currentLevel = result[0]?.level
            if(currentLevel) {
              level = currentLevel - 1
            }else if(currentLevel==undefined) {
              level = 3
            }
          }
          const tempClassifyObj = [{
            name: name,
            bannerId:null,
            id:classifyId,
            navType: 'self-classifyId',
            level,
            children:result.map(item=>{
              // 如果是分类进入的name需要使用cnName就是英文名称
              item.children = item.subCategorys.map(item=>{
                item.navType = 'self-classifyId'
                item.name = item.cnName
                return item
              }) 
              item.navType = 'self-classifyId'
              item.name = item.cnName
              return item
            })
          }]
          
          const classifyInfo = JSON.parse(urlQuery.classifyInfo)
          // 后台真实分类进入的话需要模拟一下 currentIds和currentUrl 给递归函数
          const noNoeClassify = Object.keys(classifyInfo).length==1 ? {} : {currentIds:[Object.keys(classifyInfo)[0]-0],currentUrl:[this.pathNameList[0]]}
          newLeftNavData = this.mapChildren(tempClassifyObj,noNoeClassify)
        } else {
          newLeftNavData = this.mapChildren(res.result.categoryNavInfoList)
        }

        this.leftNavData = newLeftNavData[0]
        this.findCurrentCategoryInfo()
        this.getHomeProduct()
        
      };
      error = () => {
      };
      complete = () => {
      };
      // 详情页面跳转会有classifyId没有的话就是分类列表跳转
      if(this.$route.query.classifyId) {
        data = {
          cId:Number(classifyId),
        }
        // 后台真实分类树
        getCategoryTree(data, success, error, complete)
      }else {
        data = {
          categoryName
        }
        // 虚拟分类树
        getLeftCategoryNavTree(data, success, error, complete)
      }
    },
    reloadData() {
      if(this.openWatchPushState) {
        console.log('reload-------');
        this.curPage=1
        // 如果是详情页面打开的分类页面
        if(this.categoryInfo.navType=='self-classifyId') {
          this.getLeftCategoryNavTree()
        }else {
          this.findCurrentCategoryInfo()
          this.getHomeProduct()
        }
      }
    },
    scrollDom() {
      this.domScroll('product_listing_page', 'classify-page');
    },
    // 首页商品数据
    getHomeProduct() {
      this.getMarketingUrl()
      return new Promise((resolve, reject) => {
        var data, success, error, complete;
        this.isLoadProduct = true;
        const loading = this.$loading({
          lock: true,
          text: "",
          spinner: "el-icon-loading",
          background: "rgba(51,51,51,0.25)",
        });
        //  通知导航分类隐藏二级分类列表
        this.$EventBus.$emit('hiddenNavTwoList',true)
        console.log(this.$route.query,'this.$route.query');
        if(this.$route.query.classifyId) {
          const classifyInfo = JSON.parse(this.$route.query.classifyInfo)
          console.log(classifyInfo,'/classifyInfo');
          const query = location.search.substr(1)
          console.log(qs.parse(query));
          const pathName = { ...qs.parse(query) }
          const categoryId = pathName.selectClassifyId||this.$route.query.classifyId
          const findNavLevel = this.findRealClassifyNavLevel(categoryId)
          console.log('findNavLevelfindNavLevelfindNavLevelfindNavLevel',findNavLevel);
          data = {
            curPage: this.curPage,
            pageSize: this.pageSize,
            originType: this.originType,
            shippedTime: this.shippedTime,
            stockGt: this.stockGt,
            orderColumns: this.sort ? [this.sort] : undefined,
            days:this.categoryInfo?.days||undefined,
            categoryId:Number(categoryId),
            navLevel:findNavLevel?.level||undefined
          };
        }else {
          data = {
            curPage: this.curPage,
            pageSize: this.pageSize,
            originType: this.originType,
            shippedTime: this.shippedTime,
            stockGt: this.stockGt,
            categoryNavId:this.categoryInfo?.id,
            orderColumns: this.sort ? [this.sort] : undefined,
            days:this.categoryInfo?.days||undefined,
            navLevel:this.categoryInfo?.navLevel||undefined
          };
        }
        
        success = (res) => {
          const allPage = res.page.pages;
          const page = this.curPage;
          this.isFinished = page >= allPage;
          const { result } = res;
          this.totalPages = res.page.pages
          this.totalItem = res.page.total
          this.products = result;
          // this.curPage++;
          this.amplitudeFunc('product_listing_page', false);
          resolve(res);
        };
        error = (err) => {
          console.log(err);
          this.isFinished = true;
          reject(err);
        };
        complete = () => {
          this.isLoadProduct = false;
          loading.close();
          this.$EventBus.$emit('hiddenNavTwoList',false)
          // document.querySelector(
          //   ".classify-page"
          // ).scrollTop = 0
          if(this.$refs.classifyPage) {
            this.$refs.classifyPage.scrollTop = 0;
          }
        };
        homeProductPost(data, success, error, complete);
      })
    },
    jumpPage (num) {
      this.jumpPageflag = true;
      this.curPage = num;
      this.getHomeProduct();
      // this.getHomeProduct().then(()=>{
      //   this.$refs.classifyPage.scrollTop = 0;
      // })
    },
    // 商品详情页面进入分类页面的侧边导航分类点击跳转
    detailUrlHistoryPushState(_query,item) {
      const classifyInfo = {}
      item.currentIds.forEach((id,i)=>{
        classifyInfo[id] = item.currentUrl[i]
      })
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
      // if(this.$route.name==ClassifyMoreName) {
      let path = location.pathname
      const query = location.search.substr(1)
        // const classifyInfo = {}
      item.currentIds.forEach((id,i)=>{
        classifyInfo[id] = item.currentUrl[i]
      })
      let pathName = { ...qs.parse(query),'selectClassifyId':item.id,classifyInfo:JSON.stringify(classifyInfo), ..._query }
      // 不相同的分类切换
      if(this.oldClassifyMoreName!=ClassifyMoreName) {
        let currentUrl = '/classify';
        Object.values(_params).map(item=>{
          currentUrl+='/'+item
        })
        path = currentUrl
        pathName = { ...qs.parse(query),'classifyId':item.id,'selectClassifyId':item.id,classifyInfo:JSON.stringify(classifyInfo), ..._query }
      }
      const oldClassifyMoreName = 'ClassifyMore' + (item.currentIds.length==1?'':item.currentIds.length)
      this.oldClassifyMoreName = oldClassifyMoreName
      // const pathName = { ...qs.parse(query),'selectClassifyId':item.id,classifyInfo:JSON.stringify(classifyInfo), ..._query }
      // return
      const url = decodeURIComponent(path + "?" + qs.stringify(pathName))
      window.history.pushState({ name: 'newUrl' }, 'newUrl', url) // 无刷新浏览器添加url参数
      // }else {
      //   window.history.pushState({ name: 'newUrl' }, 'newUrl', url) // 无刷新浏览器添加url参数

       
      // }
      
    },
    historyPushState(_query,item){
      let currentUrl = '/classify';
      item.currentUrl.map(item=>{
        currentUrl+='/'+item
      })
     
      window.history.pushState({ name: 'newUrl' }, 'newUrl', currentUrl) // 无刷新浏览器添加url参数
    },
    jumpUrl(i) {
      const id = this.categoryInfo.currentIds[i]
      const tempCategoryInfo = {id,...this.categoryInfo,currentUrl:this.categoryInfo.currentUrl.slice(0,i+1)}
      // this.openWatchPushState = true
      this.enumNavType(tempCategoryInfo)
      this.$refs.leftNavClassify.initListActive()
      
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
            this.historyPushState({},{currentUrl:nameList})
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
            // this.historyPushState({},{currentUrl:nameList,id:item.id,navType:'self-classifyId'})
          }
        break;
        default:
          break;
      }
    },
    
    // 更新商品是否是合集的
    updateProduct(params) {
      var index = this.products.findIndex(
        (item) => item.id == params.currentProduct.id
      );
      params.operate == 1
        ? this.products[index].containProduct++
        : this.products[index].containProduct--;
      
    },
    
    // 查询看商品详情
    showDetail(item) {
      this.$router.push({
        path: "/products/detail",
        query: {
          id: item.id,
          ref_pv_id: this.$route.params.pv_id
        },
      });
      this.recentViewedFunc(item);
    },
    editParnentStyle(flag) {
      this.isAddTransfom = flag;
    },
    // 更新单个数据
    updateSingleProduct(params) {
      var index = this.products.findIndex((item) => item.id == params.id);
      this.products[index].containProduct = this.products[index].containProduct - params.number;
    },
   
    dialogFilterApply(val, d) {
      this.dateValue = d;
      if (val.length && val[1] === 30) {
        this.filterval = [
          {
            operate: "ge",
            paramName: "Earn",
            paramValue: [`${val[0]}`],
          },
        ];
      } else {
        this.filterval = [
          {
            operate: "range",
            paramName: "Earn",
            paramValue: val.length ? val.join(",").split(",") : [],
          },
        ];
      }
      this.curPage = 1;
      this.getHomeProduct()
    },
    dialogSort(val) {
      this.sortValue = val;
      this.curPage = 1;
      this.getHomeProduct()
    },
  
    regionChange(val, flag) {
      this.originType = val === "" ? undefined : val;
      if (flag) {
        
        this.curPage = 1
        this.getHomeProduct()
      }
    },
    timeChange(val) {
      console.log(val);
      this.shippedTime = val === "" ? undefined : val;
      this.curPage = 1
      this.getHomeProduct()
    },
    inventoryChange(val) {
      console.log(val);
      this.stockGt = val === "" ? undefined : val;
     
      this.curPage = 1
      this.getHomeProduct()
    },
    sortChange(val) {
      console.log(val);
      this.sort = val === "" || val === "Featured" ? undefined : val;
      
      if(val==='') {
        document.querySelectorAll('.right-sort-filter .el-select input')[0].style.cssText = "width: 75px;";
        document.querySelectorAll('.right-sort-filter .el-select .el-input .el-select__caret')[0].style.cssText = "color: #333333;";
      } else if(val==='Featured' || val==='Newest') {
        document.querySelectorAll('.right-sort-filter .el-select input')[0].style.cssText = "width: 105px;background: #333333;color: #ffffff;";
        document.querySelectorAll('.right-sort-filter .el-select .el-input .el-select__caret')[0].style.cssText = "color: #ffffff;";
      } else {
        document.querySelectorAll('.right-sort-filter .el-select input')[0].style.cssText = "width: 220px;background: #333333;color: #ffffff;";
        document.querySelectorAll('.right-sort-filter .el-select .el-input .el-select__caret')[0].style.cssText = "color: #ffffff;";
      }
      this.curPage = 1
      this.getHomeProduct()
    },
    handleItem(name) {
      this[name] = true;
    },
    openMarketing() {
      window.open(this.navMarketingUrl); 
    },
    // 子组件触发change
    chidlCreatedAddDefaultCollectionSuccessInfo(parms) {
      this.createdAddDefaultCollectionSuccessInfo(parms.info, this.changeFun,parms.collectionIds,false,true);
    },
    // 添加到合集后到view操作
    changeFun(ids,name) {
      console.log(name,'name');
      localStorage.setItem(getStoragePrefix('collectionName'),name)
      this.$router.push({
        path: "/collections/detail",
        query: {
          id:ids[0],
        },
      });
    },
    // 添加到合集后到更新所有商品有合集标志图片
    updateProductAll() {
      this.products = this.products.map(item=>{
        ++item.containProduct
        return item
      })
    },
    // 查询marketingUrl
    getMarketingUrl() {
      var data, success, error, complete;
      const query = location.search.substr(1)
      const pathName = { ...qs.parse(query) }
      const categoryId = pathName.selectClassifyId||this.$route.query.classifyId
      data = {
        cId:this.categoryInfo?.id || categoryId,
      }
      success = (res) => {
        console.log(res);
        this.jitData = res.result
        this.navMarketingUrl = res.result.navMarketingUrl
      }
      error = () => {

      }
      complete = () => {

      }
      getMarketingUrl(data, success, error, complete)
    },
    // 查询真实分类的等级
    findRealClassifyNavLevel(categoryId) {
     
      return this.mapFindRealClassifyNavLevel(this.leftNavData,categoryId)
      // return tempObj
    },
    mapFindRealClassifyNavLevel(leftNavData,categoryId) {
      if(Number(leftNavData.id)==Number(categoryId)) {
        return leftNavData
      }else if(Array.isArray(leftNavData.children)&&leftNavData.children.length>0) {
        
        const findObj = leftNavData.children.find(item=>{
          if(Number(item.id)==Number(categoryId)) {
            return true
          }else if(Array.isArray(item.children)&&item.children.length>0) {
            return item.children.find(three=>{
              if(Number(three.id)==Number(categoryId)) {
                return true
              }
            })
          }
        })
        if(findObj) {
          if(findObj.id==categoryId) {
            return findObj
          }else {
            return findObj.children.find(item=>{
              return item.id==categoryId
            })
          }
        }
      }
    }
  },
};
</script>

<style lang="less">
.classify-page {
  // padding-left: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  // padding-bottom: 40px;
  overflow: scroll;
  & {
    .isTourist.products-single {
      margin-right: 24px !important;
    }
  }
  .classify-page-container {
    padding-top: 24px;

    height: 100%;
    .classify-page-container-box {
      position: relative;
      max-width: 1320px;
      height: 100%;
      margin: 0 auto;
      box-sizing: border-box;
      // transform: rotate(0);
      // display: flex;
      // flex-direction: column;
    }
  }
  &.noisAddTransfom {
    transform: none;
  }
  .classify-nav {
    padding-top: 40px;
    position: sticky;
    z-index: 10;
    background: #fff;
    top: 0;
    padding-bottom: 24px;
    // align-items: center;
    // overflow: auto;
    display: flex;
    flex-direction: column;
    .back-img {
      display: inline-flex;
      align-items: center;
      // padding-left: 10px;
      // height: 24px;
      display: flex;
      flex-shrink: 0;
      margin-bottom: 17px;
      .back-text {
        cursor: pointer;
        // display: none;
        padding: 0 8px;
        font-weight: 600;
        font-size: 18px;
        color: #000;
        &:hover {
          display: inline;
        }
      }
      .seft-back-img-container {
        position: relative;
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        cursor: pointer;
        justify-content: center;
        &:hover {
          background: rgba(51, 51, 51, 0.2);
        }
        &:hover + .back-text {
          display: inline;
        }
        font-size: 0;
        background: rgba(51, 51, 51, 0.1);
        border-radius: 50%;
        img {
          cursor: pointer;
          margin-right: 2px;
          margin-bottom: 1px;
          width: 7px;
          height: 11px;
        }
      }
      // .classify-query {
      //   cursor: pointer;
      //   background: #EEEEEE;
      //   border-radius: 20px;
      //   padding: 0 15px 0 14px;
      //   margin-left: 16px;
      //   height: 42px;
      //   display: inline-flex;
      //   align-items: center;
      //   & > img {
      //     vertical-align: middle;
      //     width: 24px;
      //     height: 24px;
      //   }
      // }
      .filter-sort {
        margin-left: 16px;
        .product-filter .el-select {
          margin-right: 16px;
        }
      }
    }
    .switch-classify {
      margin-right: 20px;
      // display: flex;
      position: relative;
      overflow: hidden;
      height: 42px;
      // flex: 1;
      &.next {
        padding-right: 46px;
      }
      &.prev {
        padding-left: 59px;
      }
      &.navOverflow {
        padding: 0 46px 0 59px;
      }

      .switch-box {
        // margin-right: 20px;
        right: 16px;
        top: 16px;
        position: absolute;
        width: 50px;
        height: 42px;
        z-index: 8;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 1px;
        &.left-direction {
          // background: rgba(51, 51, 51, 0.1);
          background: #fff;
          transform: translateY(-50%);
          padding-right: 8px;
          top: 50%;
          left: 0px;
          // &:hover {
          //   background: rgba(51, 51, 51, 0.2);
          // }
          // &:active {
          //   background: rgba(51, 51, 51, 0.3);
          // }
        }
        &.right-direction {
          padding-left: 8px;
          // background: rgba(51, 51, 51, 0.1);
          background: #fff;
          transform: translateY(-50%);
          top: 50%;
          right: 0px;
          // &:hover {
          //   background: rgba(51, 51, 51, 0.2);
          // }
          // &:active {
          //   background: rgba(51, 51, 51, 0.3);
          // }
        }
      }
      .switch {
        right: 16px;
        top: 16px;
        position: absolute;
        width: 40px;
        height: 40px;
        z-index: 8;
        cursor: pointer;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          // width: 7.5px;
          height: 15px;
        }
        &.left-direction {
          background: rgba(51, 51, 51, 0.1);
          transform: translateY(-50%);
          top: 50%;
          left: 10px;
          &:hover {
            background: rgba(51, 51, 51, 0.2);
          }
          &:active {
            background: rgba(51, 51, 51, 0.3);
          }
        }
        &.right-direction {
          background: rgba(51, 51, 51, 0.1);
          transform: translateY(-50%);
          top: 50%;
          right: 0px;
          &:hover {
            background: rgba(51, 51, 51, 0.2);
          }
          &:active {
            background: rgba(51, 51, 51, 0.3);
          }
        }
      }
      .classify-item-box {
        position: relative;
        display: flex;
        overflow-x: auto;
      }
      .classify-item {
        position: relative;
        &:first-child {
          margin-left: 0;
        }
        cursor: pointer;
        &:hover {
          opacity: 0.6;
        }
        &:active {
          opacity: 0.8;
        }
        &.active {
          background: #333333;
          color: #fff;
        }
        // max-width: 200px;
        left: 0;
        transition: left 0.6s;
        height: 42px;
        display: flex;
        line-height: 1;
        align-items: center;
        justify-content: center;
        background: #eeeeee;
        box-sizing: border-box;
        border-radius: 25px;
        padding: 0 20px;
        margin: 0px 16px;
        color: #333333;
        span {
          font-size: 16px;
          white-space: nowrap;
        }
      }
    }
  }
  .products-container {
    flex: 1;
    padding-left: 288px;
    // overflow: auto;
    display: flex;
    flex-direction: column;
    height: 100%;
    margin-top: 0;
    &.isTourist {
      // width: calc(100% + 13px);
    }
    .classify-page-nav {
      // display: flex;
      // flex-wrap: wrap;
      // justify-content: space-between;
      padding-left: 18px;
      // row-gap: 24px;
      box-sizing: border-box;
      &.product-filter {
        // margin-left: 10px;
        // display: flex;
        // overflow-y: hidden;
        width: 100%;
        margin-bottom: 16px;
        .nav-url-classify {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          cursor: pointer;
          white-space: nowrap;
          margin-bottom: 16px;
          .computed {
            margin-left: 0.3em;
            white-space: nowrap;
          }
          .total-item {
            margin-left: 12px;
            span {
              cursor: initial;
              &:hover {
                text-decoration: initial;
              }
            }
          }
        
          span {
            color: #333333;
            &:hover {
              text-decoration: underline;
            }
          }
        }
        .right-sort-filter { 
          // max-width: 230px;
          // width: 100%;
          display: flex;
          // justify-content: flex-end;
          .handle-item {
            flex-shrink: 0;
            background: #eeeeee;
            border-radius: 20px;
            height: 32px;
            display: flex;
            align-items: center;
            padding: 0 14px 0 4px;
            margin-right: 16px;
            img {
              width: 24px;
              margin-right: 6px;
            }
            span {
              // font-weight: 500;
              font-size: 14px;
            }
          }
          .el-input,.el-input__inner {
            height: 32px;
          }
          .el-select .el-input .el-select__caret.el-icon-circle-close:before {
            content: "\e6db" !important;
          }
          .el-select .el-input .el-select__caret.el-icon-circle-close:hover {
            background: #666666;
            border-radius: 20px;
            width: 20px;
            height: 20px;
            line-height: 20px;
            margin-top: 4px;
            margin-right: 2.5px;
            // color: #FFFFFF;
          }
          .el-select {
            margin-right: 0 !important;
          }
          // .el-select,.el-input,.el-input__inner {
          //   width: 100% !important;
          // }
        }
        input {
          background: #EEEEEE;
          border: none;
          border-radius: 20px;
          height: 40px;
          font-weight: 500;
          font-size: 14px;
        }
        input:hover {
          background: #D9D9D9;
        }
        input::-webkit-input-placeholder {
          color: #333333;
          font-weight: 500;
          font-size: 14px;
        }
        input::-moz-placeholder {
          color: #333333;
          font-weight: 500;
          font-size: 14px;
        }
        .el-select:first-child, .el-select:nth-child(2), .el-select:nth-child(3) { margin-right: 24px; }
        .el-select:first-child input { width: 120px; }
        .el-select:nth-child(2) input { width: 140px;}
        .el-select:nth-child(3) input { width: 110px;}
        .el-select:last-child input { width: 75px;}
        .el-select .el-input .el-select__caret {
          color: #333333;
          font-weight: bold;
        }
        .el-select .el-input .el-select__caret.el-icon-circle-close {
          color: #ffffff;
          font-weight: bold;
          font-size: 16px;
          margin-top: -2px;
        }
        .el-select .el-input .el-select__caret.el-icon-circle-close:before {
          content: "\e6db" !important;
        }
        .el-select .el-input .el-select__caret.el-icon-circle-close:hover {
          background: #666666;
          border-radius: 20px;
          width: 20px;
          height: 20px;
          line-height: 20px;
          margin-top: 9px;
          margin-right: 2.5px;
          color: #FFFFFF;
        }
        .el-select .el-input.is-focus .el-input__inner { border-color: #EEEEEE; }
      }
    }
    .no-data {
      margin-top: 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      // width: calc( 100% - 260px );
      &.isTourist {
        width: auto;
      }
      & > img {
        width: 200px;
        height: 200px;
      }
      & > div:nth-child(2) {
        margin-top: 16px;
        font-weight: 500;
        font-size: 18px;
      }
    }
    .products {
      position: relative;
      left: 8px;
      @media screen and (min-width: 1326px) {
       .products-single:nth-child(4n) {
          margin-right: 0 !important;
        }
      }
    }
  }
  .el-backtop {
    height: 60px;
    width: 60px;
    box-shadow: 0 0 0 0;
    .classify-top {
      height: 60px;
      width: 60px;
      cursor: pointer;
      text-align: center;
      border-radius: 30px;
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 0px 5px 20px rgba(51, 51, 51, 0.15);
      backdrop-filter: blur(10px);
      img {
        height: 36px;
        width: 36px;
        margin-top: 15px;
      }
    }
  }
  .left-nav-filter-box {
    position: fixed;
    // top: 89px;
    // left: 40px;
    min-width: 280px;
    padding-right: 4px;
    max-width: 280px;
    // height: 100%;
    height: calc(100% - 137px);
    overflow-y: auto;
    box-sizing: border-box;
    padding-bottom: 30px;
    &.changeNavHeight {
      height: calc(100% - 167px);
    }
    .classify-filter-sort-box {
      margin-top: 16px;
      padding: 23px 0;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;
      .classify-filter-sort {
      &.flex-column {
        width: 100%;
        margin-left: 0;
        // margin-bottom: 32px;
        .product-filter {
          display: flex;
          flex-direction: column;
          max-width: 230px;
          width: 100%;
          .el-select {
            &:nth-child(1) {
              margin-top: 0;
            }
            margin-top: 16px;
            width: 100%;
          }
          .el-input__inner {
            width: 100% !important;
          }
        }
      }
    }
    }
    

  }
  @import "../../../styles/addCollectionAndCreated.less";
  .classify-page-pagination {
    // margin-top: 40px 0 49px;
    padding: 40px 0 49px;
  }
}
</style>
