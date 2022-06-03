<template>
  <div
    class="activity-page"
    ref="activityPage"
    @scroll="scrollDom"
    :class="{isTourist}"
    infinite-scroll-distance='900' v-infinite-scroll="load"
  >
  <HomeCategory></HomeCategory>
  <div class="activity-product-content">

  <div class="activity-handle" v-if='!closeCms&&!isTourist&&cmsDetailProduct.length>0'>
    <!-- <filter-sort
      :sortValue="sortValue"
      @filterApply="dialogFilterApply"
      @sortApply="dialogSort"
      @classify="editParnentStyle"
    ></filter-sort> -->
    <CmsExportProduct :shopifyNameList='shopifyNameList' :cmsId='id' :amplitude='amplitude' @updataList='updataList' :parentProduct='[]' />
  </div>
  <div :class="{'products-container':!isTourist}" v-if="cmsDetailProduct.length>0">
      <ProductsSingle
        class="activity-page-products activity-products"
        :class="{isTourist}"
        :hasImgType='true'
        :parentShopifyNameList='true'
        :shopifyNameList='shopifyNameList'
        :productsData="cmsDetailProduct"
        @updateproduct="updateProduct"
        @updateSingleProduct='updateSingleProduct'
        @showDetail="showDetail"
        @goUrl='goUrl'
        :amplitude='amplitude'
      />
  </div>
  <div v-if="closeCms && isLoadProduct!==true" class="no-data">
    <img src="@/static/activity-cms@2x.png" alt="">
    <div class="oops">Oops</div>
    <div class="tip">This event is no longer available. Please check out our other events.</div>
  </div>
  </div>

    <el-backtop :bottom="100" :right="20" target=".activity-page">
      <div class="activity-top">
        <img src="@/static/top@2x.png" alt="" />
      </div>
    </el-backtop>
  </div>
</template>

<script>
import { getOperateCmsPage } from "@/api/cms";
import ProductsSingle from "@/views/products/components/productSingle";
import CmsExportProduct from "@/components/CmsExportProduct";
import { shopifyStoreList } from "@/api/channels";
import amplitudeMixins from "@/mixins/amplitudeMixins";
import HomeCategory from "@/views/products/components/HomeCategory";

export default {
  mixins: [ amplitudeMixins ],
  components: {
    ProductsSingle,
    CmsExportProduct,
    HomeCategory
  },
  data() {
    return {
      products: [],
      curPage: 1,
      cmsDetail:[],
      isLoadProduct: false,
      isFinished: false,
      id:undefined,
      offsetTop:0,
      closeCms:false,
      sortValue:undefined,
      pageSize:10,
      shopifyNameList:[],
      topMessageBox:false,
      cmsDetailProduct:[],
      amplitude:{
        buy_sample:{
          page_code:'promotion_banners_page'
        },
        event_value_productsId: [],
        pv_id: ''
      }
    };
  },
  watch: {},
  beforeRouteLeave(to, from, next) {
    // 组件离开的时候，获取页面滚动高度
    this.offsetTop = document.querySelector('.activity-page').scrollTop
    next()
  },
  // created() {
  //   localStorage.setItem('ACTIVITYURL', window.location.href);
  // },
  activated() {
    this.observerData.activatedflag = true;
    if(this.cmsDetailProduct.length !== 0) {
      console.log(44444, '页面缓存了activated----埋点');
      this.comFuncSettimeout('promotion_banners_page');
    }
    setTimeout(()=>{
      this.$nextTick(() => {
        document.querySelector('.activity-page').scrollTop = this.offsetTop;
        setTimeout(() => {
          this.observerData.activatedflag = false;
        }, 1100);
      });
    },10)
  },
  mounted() {
    // var flag = null;
    this.id = this.$route.query.id
    // this.resizeContainer();
    // let container = this.$refs.activityPage;
    this.getShopifyStoreList()
    // window.onresize=()=>{
    //   let dWidth = document.body.offsetWidth;
    //   if(dWidth<=1200) {
    //     const topMessageBox = this.topMessageBox
    //     const size = !this.isTourist?topMessageBox?118:0:16
    //     container.style = `padding-top:${size}px`;
    //     return
    //   }
    //   clearTimeout(flag)
    //   flag = setTimeout(()=>{
    //     this.resizeContainer()
    //   },10)
    // }
    // this.$EventBus.$off('topMessage')
    // this.$EventBus.$on("topMessage",()=>{
    //   this.topMessageBox = true
    //   this.resizeContainer();
    // });
    this.$EventBus.$off('upActivityPage')
    this.$EventBus.$on('upActivityPage',()=>{
      this.curPage = 1;
      this.isFinished = false;
      this.getHomeProduct(true);
    });
    // this.getHomeProduct();
  },
  methods: {
    load() {
      if (this.isFinished || this.isLoadProduct) {
        return;
      }
      this.getHomeProduct();
    },
    getShopifyStoreList() {
      if(this.isTourist) {
        return
      }
      var data, sucess, error, complete;
      data = {
        storeType: 0,
        curPage: this.curPage,
        pageSize: 1000,
      };
      sucess = (res) => {
        const { result } = res;
        if (result.length == 0) {
          return;
        }
        this.shopifyNameList = result.filter(item=>item.storeType===0);
      };
      error = (res) => {
        console.log(res.data.message);
      };
      complete = () => {};
      shopifyStoreList(data, sucess, error, complete);
    },
    resizeContainer() {
      // let dWidth = document.body.offsetWidth;
      // let container = this.$refs.activityPage;
      // let padding = 0;
      // if(dWidth>1200) {
      //   padding = (dWidth - 1200)/2
      // }
      // console.log(padding);
      // const topMessageBox = this.topMessageBox
      // const size = !this.isTourist?topMessageBox?118:0:16
      // if(padding) {
      //   container.style = `padding:${size}px ${padding}px 20px`;
      // }
      // const size = !this.isTourist?88:16
      // container.style = `padding:${size}px ${padding}px 20px`;
    },
    scrollDom() {
      this.domScroll('promotion_banners_page', 'activity-page');
    },
    // 首页活动商品数据
    getHomeProduct() {
      var data, sucess, error, complete;
      // if(!isUpdata&&this.curPage==1) {
      //   this.isLoadProduct = true;
      // }
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
        cmsId:this.id,
        status:1
      };
      sucess = (res) => {
        console.log(res);
        const { result,page } = res;
        const allPage = page.pages;
        const curPage = this.curPage;
        const status = result.some(item=>{
          return item.status === 2
        })
        // 是否关闭活动页面
        if(status) {
          this.isFinished = true;
          this.closeCms = true;
          return
        }
        // const {cmsDetail} = result;
        this.isFinished = curPage >= allPage;

        this.cmsDetail = result[0]?.newCmsDetail|| [];
        this.filterCmsDetail()
        this.curPage++
        this.amplitudeFunc('promotion_banners_page', true); // true指瀑布流，不是翻页
      };
      error = (res) => {
        console.log(res);
        this.closeCms = true;
        this.isFinished = true;
      };
      complete = () => {
        this.isLoadProduct = false;
        loading.close();
      };
      getOperateCmsPage(data, sucess, error, complete);
    },
    filterCmsDetail() {
      // const product = this.cmsDetailProduct || []
      const tempArray = []
      this.cmsDetail.map(item=>{
        if(item.componentType==3) {
          Array.isArray(item.productsList)?tempArray.push(...item.productsList):tempArray.push(item.productsList)
        } else if(item.componentType==1) {
          tempArray.push({imageJson:item.imageJson,url:item.imageJson?.picUrl,hasImgType:true})
        }
      })
      if(this.curPage>1) {
        this.cmsDetailProduct = [...this.cmsDetailProduct,...tempArray]
      }else {
        this.cmsDetailProduct = tempArray
      }
    },
    arrayNonRepeatfy(arr) {
      let map = new Array();
      let array = new Array();
      for (let i = 0; i < arr.length; i++) {
        if (array.indexOf(arr[i].id) == -1) {
          array.push(arr[i].id);
          map.push(arr[i]);
        }
      }
      return map;
    },
    // 更新商品是否是合集的
    updateProduct(parms) {
      console.log(parms);
      var index = parms.productsData.findIndex(
        (item) => item.id == parms.currentProduct.id
      );
      parms.operate == 1
        ? parms.productsData[index].containProduct++
        : parms.productsData[index].containProduct--;
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
      console.log(parms);
      var index = parms.product.findIndex(
        (item) => item.id == parms.id
      );
      parms.product[index].containProduct =parms.product[index].containProduct  - parms.number
      if(parms.product[index].containProduct<0) {
        parms.product[index].containProduct = 0
      }
    },
    // 更新活动列表
    updataList() {
      this.getHomeProduct()
    },
    hasUrl(cms) {
      const item = cms.imageJson&&cms.imageJson[0]
      const url = item.url || item.productId
      return url
    },
    goUrl(cms) {
      const item = cms.imageJson;
      const url = cms.imageJson?.url;
      switch (item.paramType) {
        case 1:
          /*eslint-disable*/
          const {href} = this.$router.resolve({ path: `/login`});
          const eventDetail = url.includes('event-detail')
          /*eslint-disable*/
          if(this.isTourist&&eventDetail) {
            localStorage.setItem('ACTIVITYURL', url);
            window.open(href,'_blank')
          }else {
            window.open(url,'_blank')
          }
          break;
        case 2:
          {
            console.log(66666555, this.$route.params.pv_id);
            const {href} = this.$router.resolve({
              path: `/products/detail?id=${item.productId}`,
              query: {
                ref_pv_id: this.$route.params.pv_id
              }
            });
            window.open(href,'_blank')
          }
          break;
        default:
          break;
      }
    }
  },
};
</script>
<style lang='less'>
.activity-page {
  // width: 1200px;
  // padding: 0 40px;
  // margin: 0 auto;
  // position: absolute;
  // left: 50%;
  // transform: translateX(-50%);
  // transform: rotate(0);
  overflow: scroll;
  height: 100%;
  box-sizing: border-box;
  // height: calc(100%);;
  // height: calc(100% - 88px);
  padding-bottom: 20px;
  &.isTourist {
    .activity-product-content {
      margin-top: 16px;
    }
    // padding-top: 16px;
  }
  .products-container {
    // margin-top: 88px;
  }
  .activity-product-content {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto 0;
    box-sizing: border-box;
    @media screen and (min-width: 768px) {
      padding: 0 40px;
    }
  }
  // transition: padding .3s;
  .mian-img {
    // padding: 24px 0;
    margin-bottom: 16px;
    .hashove {
      cursor: pointer;
    }
    img {
      border-radius: 20px;
      margin: 0 auto;
      display: block;
      width: 1176px;
      // height: 300px;
      // cursor: pointer;
    }
  }
  .activity-page-products {
    // .products-single:not(.single-image-box){
    //   &:nth-child(5n + 5) {
    //     margin-right: 0;
    //   }
    // }
    width: 1200px;
    // .single-product {
    //   &:nth-child(5n + 5) {
    //     margin-right: 0;
    //   }
    // }
    &.activity-products {
      .products-single {
        border-radius: 18px;
        margin-bottom: 0;
        & {
          height: 452px;
          &:hover .shop-bottom-box {
            bottom: 0;
          }
          &.isTourist {
            margin-right: 24px;
            height: 406px;
          }
        }
      }
    }
  }
  .activity-component {
    width: 1200px;
  }
  .activity-handle {
    // margin-top: 24px;
    padding: 24px 0;
    display: flex;
    position: sticky;
    background: #fff;
    top: 48px;
    // width: 1200px;
    width: 100%;
    max-width: 1200px;
    z-index: 9;
    justify-content: flex-end;
    &>.filter-sort>.classify-query:nth-child(1) {
      margin-left: 10px;
    }
    @media (max-width: 1080px) {
      & {
        width: 100%;
      }
    }
      &~.activity-component:nth-of-type(2) {
        .mian-img {
          padding-top: 0;
        }
    }
  }
  .no-data {
    text-align: center;
    margin-top: 209px;
    img {
      display: block;
      Width: 250.81px;
      Height: 154px;
      margin: 0 auto;
    }
    .oops {
      margin: 40px 0 24px;
      font-weight: bold;
      font-size: 36px;
      line-height: 48px;
      color: #333333;
    }
    .tip {
      font-weight: 500;
      font-size: 18px;
      line-height: 18px;
      color: #333;
    }
  }
  .el-backtop {
    height: 60px;
    width: 60px;
    box-shadow: 0 0 0 0;
    .activity-top {
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
}
</style>