<template>
  <div @scroll="scrollDom" class="products-page" :class="isTourist?'is-tourist':''" infinite-scroll-distance='900' ref="productsPage" v-infinite-scroll="load">
   <HomeCategory></HomeCategory>
   <div class="product-content" :class="isTourist?'is-tourist':''">
    <div class="home-carousel" :class="isTourist?'is-tourist':''" v-if="carouselImgs.length > 2">
      <el-carousel :interval="5000" :autoplay="true" :loop="true" type="card" :height="carouselHeight">
        <el-carousel-item v-for="item in carouselImgs" :key="item.id">
          <img :src="item.href" alt="" @click="lookCard(item)">
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- <div class="categories-container" :class="isTourist?'is-tourist':''">
      <div class="categories-show" :class="isTourist?'is-tourist':''">
        <div class="categories-show-left">Categories</div>
        <div class="categories-show-right" @click="seeAll()">
          <span>See All</span>
          <img src="@/static/productDetail/show-more@2x.png" alt="" />
        </div>
      </div>
      <ProductCategories :categoryListData="categoryList" />
    </div> -->
    <filter-sort
      :isSort="false"
      @regionChange="regionChange"
      @timeChange="timeChange"
      @inventoryChange="inventoryChange"
    ></filter-sort>
    <div class="products-container">
      <div v-if="!products.length && isLoadProduct!==true" class="no-data">
        <img src="@/static/noData@2x.png" alt="">
        <div>No Results</div>
      </div>
      <ProductsSingle
        :productsData="products"
        @updateproduct="updateProduct"
        @updateSingleProduct='updateSingleProduct'
        @showDetail="showDetail"
        :amplitude='amplitude'
      />
    </div>
   </div>
    <el-backtop :bottom="100" :right="20" target=".products-page">
      <div class="products-top">
        <img src="@/static/top@2x.png" alt="">
      </div>
    </el-backtop>
    <el-dialog class="dialog-success" :visible.sync="dialogVisible" center @close="dialogClose">
      <img src="@/static/successYellow@2x.png" alt="">
      <div class="text-info-header">Success</div>
      <div class="text-info-content">Your order has been placed.</div>
      <span slot="footer" class="dialog-footer">
        <div class="btn-content" @click="dialogVisible = false">OK</div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatPrice } from "@/utils/common";
import { homeProductPost, homeProductPostCategoryList, homeComingSoonProductList, bannerList } from "@/api/production";
import ProductsSingle from "../components/productSingle";
// import ProductCategories from "../components/productCateGories";
import recentviewed from '@/mixins/recentviewed';
import amplitudeMixins from '@/mixins/amplitudeMixins';
import FilterSort from "@/components/FilterSort";
import HomeCategory from '@/views/products/components/HomeCategory'
export default {
  name: "Shop",
  mixins:[ recentviewed, amplitudeMixins ],
  data() {
    return {
      curPage: 1,
      pageSize: 20,
      isFinished: false,
      isLoadProduct: false,
      editCollectionLoading: false,
			keywordInput: '',
      currentClickProductId: null,
      products: [],
      collections: [],
      formatPrice,
      categoryList: [],
      offsetTop:0,
      dialogVisible: false,
      isShowCheckoutSuccess: this.$store.state.layout.isShowCheckoutSuccess,
      carouselImgs: [],
      // 因为media有个zoom:0.9的样式
      carouselHeight: 1240/5 + 'px',
      amplitude:{
        buy_sample:{
          page_code:'home_page'
        },
        event_value_productsId: [],
        pv_id: ''
      },
      shippedTime: undefined,
    };
  },
  watch: {
  },
  created() {
    this.observerData.initflag = true;
    this.getBannerList();
    if(this.isShowCheckoutSuccess) {
      this.dialogVisible = true;
      this.$store.commit('layout/SET_ShowCheckoutSuccess', false);
    }
    this.$EventBus.$off('showSuccess');
    this.$EventBus.$on('showSuccess',()=>{
      setTimeout(()=>{
        this.dialogVisible = true;
      }, 400)
    })
    // this.cateGoriesAndComingSoon();
  },
  mounted() {
    this.$EventBus.$off('upProductsPage')
    this.$EventBus.$on('upProductsPage',()=>{
      this.curPage = 1;
      this.isFinished = false;
      this.load();
    });
  },
  components: {
    ProductsSingle,
    // ProductCategories,
    FilterSort,
    HomeCategory
  },
  computed:{},
  beforeRouteLeave(to, from, next) {
    // 组件离开的时候，获取页面滚动高度
    this.offsetTop = document.querySelector('.products-page').scrollTop
    next()
  },
  deactivated() {
    window.removeEventListener('resize',this.watchWidth)
  },
  activated() {
    this.observerData.activatedflag = true;
    if(this.products.length !== 0) {
      console.log(44444, '页面缓存了activated----埋点');
      this.comFuncSettimeout('home_page');
    }
    // upProductsPage
    // this.$EventBus.$off('upProductsPage')
    // this.$EventBus.$emit('upProductsPage',()=>{
    //   this.curPage = 1;
    //   this.isFinished = false;
    //   this.load();
    // });
    window.addEventListener('resize',this.watchWidth)
    localStorage.removeItem('ACTIVITYURL');
    setTimeout(()=>{
      this.$nextTick(() => {
        document.querySelector('.products-page').scrollTop = this.offsetTop;
        setTimeout(() => {
          this.observerData.activatedflag = false;
        }, 1100);
      });
    },10)
  },
  methods: {
    watchWidth() {
      // 因为media有个zoom:0.9的样式
      let elementHeight;
      if (window.innerWidth < 768) {
        elementHeight = (window.innerWidth/0.9-0)/5;
      } else if (window.innerWidth < 1188) {
        elementHeight = (window.innerWidth/0.9-84)/5;
      } else {
        elementHeight = 1240/5;
      }
      document.querySelectorAll(".products-page .product-content .el-carousel__container")[0].style.cssText = `height: ${elementHeight}px !important;`;
    },
    scrollDom(e) {
      this.offsetTop = e.target.scrollTop;
      this.domScroll('home_page', 'products-page'); // 埋点需要
    },
    getBannerList() {
      bannerList({},
      (res) => {
        this.carouselImgs = res.result;
        setTimeout(()=>{
          this.$nextTick(() => {
            if (window.innerWidth < 768) {
              this.carouselHeight = (window.innerWidth/0.9)/5 + 'px';
            } else if(window.innerWidth < 1188) {
              this.carouselHeight = (window.innerWidth/0.9-84)/5 + 'px';
            } else {
              this.carouselHeight = 1240/5 + 'px';
            }
          });
        },10)
      },
      (err) => {
        console.log(err);
      },
      () => {})
    },
    // 并发一级分类和预发布商品接口
    cateGoriesAndComingSoon() {
      var than = this;
      Promise.all([
        this.getHomeComingSoonProductList(),
        this.getHomeProductPostCategoryList(),
      ])
      .then((res) => {
        const coming = res[0];
        const CategoryList = res[1];
        than.handleComing(coming.result, CategoryList.result);
      })
      .catch((res) => {
        console.log("错误了", res.response);
      });
    },
    filterPrice(number) {
      return number;
    },
    // 预发布结果处理
    handleComing(comData, categoryData) {
      var comingAndCategoryList,childArr,obj;
      if(comData.status==1&&comData.tagVos.length>0) {
        childArr = comData.tagVos;
        obj = {
          name: comData.name,
          icon: comData.logo,
          id: childArr[0].id,
          type: "coming",
          children: childArr,
        };
        // comingAndCategoryList = [obj, ...categoryData].slice(0, 8);
        comingAndCategoryList = [obj, ...categoryData];
      }else {
        // comingAndCategoryList = [...categoryData].slice(0, 8);
        comingAndCategoryList = categoryData;
      }
      this.categoryList = comingAndCategoryList;
    },
    getHomeComingSoonProductList() {
      var data, sucess, error, complete;
      data = {
        productId: null,
        curPage: 1,
        pageSize: this.pageSize,
      };
      sucess = (res) => {
        console.log(res);
      };
      error = (res) => {
        console.log(res);
      };
      complete = () => {};
      return homeComingSoonProductList(data, sucess, error, complete);
    },
    load() {
      if (this.isFinished || this.isLoadProduct) {
        return;
      }
      this.getHomeProduct();
    },
    // 首页商品数据
    getHomeProduct(isScroll) {
      var data, sucess, error, complete;
      this.isLoadProduct = true;
      const loading = this.$loading({
        lock: true,
        text: "",
        spinner: "el-icon-loading",
        background: "rgba(51,51,51,0.25)",
      });
      data = {
        curPage: this.curPage,
        pageSize: this.pageSize,
        originType: this.originType,
        shippedTime: this.shippedTime,
        stockGt: this.stockGt
      };
      sucess = (res) => {
        const allPage = res.page.pages;
        const page = this.curPage;
        this.isFinished = page >= allPage;
        const { result } = res;
        if (this.curPage > 1) {
          let rearrangement = this.arrayNonRepeatfy([...this.products, ...result]);
          this.products = rearrangement;
        } else {
          this.$refs.productsPage.scrollTop = 0;
          this.products = result;
        }
        this.curPage++;
        if (isScroll) { document.querySelector('.products-page').scrollTop = this.offsetTop; }
        document.querySelector('.products-container').style.cssText = `min-height: ${document.body.clientHeight - 65 - 80 - 24}px;margin-left: -10px;`;
        if (this.isTourist) {
          document.querySelectorAll(".products-container")[0].style.cssText = 'margin-left: -13px;margin-right: -13px;';
        } else {
          document.querySelectorAll(".products-container")[0].style.cssText = 'margin-left: 0;';
        }
        this.amplitudeFunc('home_page', true); // true是指瀑布流不是翻页
      };
      error = (res) => {
        console.log(res);
        this.isFinished = true;
      };
      complete = () => {
        this.isLoadProduct = false;
        loading.close();
      };
      homeProductPost(data, sucess, error, complete);
    },
    arrayNonRepeatfy(arr) {
      let map = new Array();
      let array = new Array();  
      for (let i = 0; i < arr.length; i++) {
        if(array.indexOf(arr[i].id)==-1) {
          array.push(arr[i].id)
          map.push(arr[i])
        }
      }
      return map;
    },
    // 一级分类
    getHomeProductPostCategoryList() {
      var data, sucess, error, complete;
      data = {
        curPage: 1,
        pageSize: this.pageSize,
      };
      sucess = (res) => {
        const { result } = res;
        this.categoryList = result;
      };
      error = (res) => {
        console.log(res);
      };
      complete = () => {};
      return homeProductPostCategoryList(data, sucess, error, complete);
    },
    addCollection(id) {
      this.currentClickProductId = id;
    },
    // 更新商品是否是合集的
    updateProduct(parms) {
      var index = this.products.findIndex(
        (item) => item.id == parms.currentProduct.id
      );
      parms.operate==1?this.products[index].containProduct++:this.products[index].containProduct--
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
    // 更新单个数据
    updateSingleProduct(parms) {
      var index = this.products.findIndex(
        (item) => item.id == parms.id
      );
      this.products[index].containProduct =this.products[index].containProduct  - parms.number
      if(this.products[index].containProduct<0) {
        this.products[index].containProduct = 0
      }
    },
    dialogClose() {
      this.dialogVisible = false;
      this.$store.commit('layout/SET_ShowCheckoutSuccess', false);
    },
    lookCard(val) {
      // 1商品ID; 2cmsId; 3外部URL; 4前台分类ID
      switch (val.linkType) {
        case 1:
          this.$router.push({ 
            path: `/products/detail?id=${val.productId}`,
            query: {
              ref_pv_id: this.$route.params.pv_id
            }
          });
          break;
        case 2:
          // this.$router.push({ path: `/activity?id=${val.cmsId}` });
          var routeData = this.$router.resolve({ path: `/event?id=${val.cmsId}` });
          window.open(routeData.href, '_blank');
          break;
        case 3:
          {
            const {href} = this.$router.resolve({ path: `/login`});
            const eventDetail = val.outUrl.includes('event-detail')
            if(this.isTourist&&eventDetail) {
              localStorage.setItem('ACTIVITYURL', val.outUrl);
              window.open(href,'_blank')
            }else {
              window.open(val.outUrl, '_blank');
            }
          }
          break;
        case 4:
          {
            const path = `/products/classify?id=${val.fcId}&name=${val.fcName}&selectid=${val.fcSecondId}`
            const {href} = this.$router.resolve({ path });
            const url = window.location.origin + href
            localStorage.setItem('ACTIVITYURL', url);
            this.$router.push({ path });
          }
          break;
        default:
          this.$router.push({ path: "/404" });
				}
    },
    seeAll() {
      this.$router.push({ name: 'ClassifyAll' });
    },
    regionChange(val,flag) {
      this.originType = (val==='')?undefined:val;
      if(flag) {
        this.curPage = 1;
        this.getHomeProduct(true);
      }
    },
    timeChange(val) {
      this.shippedTime = val === "" ? undefined : val;
      this.curPage = 1
      this.getHomeProduct()
    },
    inventoryChange(val) {
      this.stockGt = (val==='')?undefined:val;
      this.curPage = 1;
      this.getHomeProduct(true);
    }
  }
};
</script>
<style lang="less">
@import "../../../styles/dialogSuccess.less";
// 首页分类样式
.products-page {
  // padding-left: 40px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: scroll;
  position: relative;
  padding-bottom: 40px;
  .categories-container {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    position: relative;
    .categories-show {
      margin: 0 0 8px 0;
      display: inline-flex;
      align-items: center;
      justify-content: space-between;
      .categories-show-left {
        font-weight: bold;
        font-size: 18px;
      }
      .categories-show-right {
        cursor: pointer;
        font-weight: 500;
        font-size: 14px;
        color: #C79618;
        img {
          height: 9px;
          margin-left: 8px;
        }
      }
    }
    .categories-show.is-tourist {
      margin-right: 0;
    }
  }
  .categories-container.is-tourist {
    margin: 0;
  }
  // 商品数据样式
  .products-container {
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    // min-height: 983px;
    .no-data {
      margin-top: 40px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: calc( 100% - 80px );
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
  }
  .product-content {
    width: 100%;
    max-width: 1320px;
    margin: 40px auto 0;
    margin-top: 32px;
    box-sizing: border-box;
    @media screen and (min-width: 768px) {
      padding: 0 40px;
    }
    .home-carousel {
      // margin: 0 48px 0 10px;
      .el-carousel > ul > li.is-active .el-carousel__button {
        background: #C79818;
      }
      .el-carousel > .el-carousel__container .el-carousel__item {
        filter: drop-shadow(0px 5px 20px rgba(0, 0, 0, 0.1));
      }
      .el-carousel__indicators.el-carousel__indicators--horizontal.el-carousel__indicators--outside {
        height: 32px;
        bottom: 32px;
      }
      .el-carousel .el-carousel__arrow i {
        font-weight: 1000;
        color: #333333;
      }
    }
    .home-carousel.is-tourist {
      margin: 0;
    }
    .el-carousel__item {
      img {
        width: 100%;
        border-radius: 20px;
      }
    }
    .el-carousel__item.is-active {
      opacity: 1;
    }
    .el-carousel__item:not(.is-active) {
      opacity: 0.3;
    }
    .filter-sort {
      margin-top: 32px;
    }
  }
  .product-content.is-tourist {
    margin: 24px auto 0;
    // margin-top: 24px;
    // margin-left: 132px;
    // margin-right: 132px;
  }
}
.products-page.is-tourist {
  padding-left: 0;
}
@import "../../../styles/addCollectionAndCreated.less";
.el-backtop {
  height: 60px;
  width: 60px;
  box-shadow: 0 0 0 0;
  .products-top {
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
</style>
