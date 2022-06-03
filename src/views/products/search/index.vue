<template>
  <div class="search" v-infinite-scroll="load" :class="{isTourist}" infinite-scroll-distance='400' @scroll="scrollDom">
   <HomeCategory></HomeCategory>
    <div class="search-results ms">

      <div>
        <span class='text-no-wrap'>Results for </span>
        <span class="search-results-keyword text-no-wrap">'{{ thekeyword }}'</span>
        <span v-if="total" style='margin-left:16px;white-space: nowrap; font-weight: 500;font-size: 14px;line-height: 19px;color: #333333;'>{{total}} {{total==1?'Item':'Items'}}</span>
      </div>
      <div class="right-sort-filter">
        <el-select v-model="filterVal.sort" clearable placeholder="Sort" @change="sortChange">
          <el-option
            v-for="item in filterVal.sortOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <!-- <filter-sort
      style="margin:0 0 0 24px"
      class="search-filter"
      :sortValue="sortValue"
      @queryTerm="showQueryTerm"
      @filterApply="dialogFilterApply"
      @sortApply="dialogSort"
      @regionChange="regionChange"
      @timeChange="timeChange"
      @inventoryChange="inventoryChange"
      @sortChange="sortChange"
    ></filter-sort> -->
    </div>
    <div v-if="seachProductsNoData && isLoadProduct!==true" class="no-data">
      <img src="@/static/noData@2x.png" alt="">
      <div>No Results</div>
      <div>Sorry, we can’t find what you're searching for, but you can check out some recommended items below or continue shopping.</div>
      <div class="no-data-feedback">
        <a href="https://share.hsforms.com/1qzVGYwzhQli_K0Kx5JH8tg51yxd" target="_blank">Submit Product Request</a>
      </div>
    </div>
    <div class="products-container ms" :style="{ 'margin-top': (seachProductsNoData && isLoadProduct!==true) ? '44px' : '0' } ">
      <div class="left-filter">
        <filter-sort
        class="search-filter flex-column"
        :sortValue="sortValue"
        @queryTerm="showQueryTerm"
        @filterApply="dialogFilterApply"
        @sortApply="dialogSort"
        @regionChange="regionChange"
        @timeChange="timeChange"
        @inventoryChange="inventoryChange"
        :isSort='false'
        @sortChange="sortChange" />
      </div>
      <ProductsSingle
        :productsData="products"
        @updateproduct="updateProduct"
        @updateSingleProduct="updateSingleProduct"
        @showDetail="showDetail"
        :amplitude='amplitude'
      />
    </div>
    <el-backtop :bottom="100" :right="20" target=".search">
      <div class="products-top">
        <img src="../../../static/top@2x.png" alt="" />
      </div>
    </el-backtop>
  </div>
</template>

<script>
import { searchProduct, homeProductPost } from "@/api/production";
import FilterSort from "@/components/FilterSort";
import ProductsSingle from "../components/productSingle";
import recentviewed from "@/mixins/recentviewed";
import amplitudeMixins from "@/mixins/amplitudeMixins";
import HomeCategory from '@/views/products/components/HomeCategory'

export default {
  name: "Search",
  mixins: [ recentviewed, amplitudeMixins ],
  components: {
    FilterSort,
    ProductsSingle,
    HomeCategory
  },
  data() {
    return {
      thekeyword: this.$route.query.keyword,
      sortValue: "Featured",
      filterval: [],
      curPage: 1,
      dateValue:undefined,
      pageSize: 20,
      isFinished: false,
      isLoadProduct: false,
      editCollectionLoading: false,
      currentClickProductId: null,
      products: [],
      collections: [],
      categoryList: [],
      offsetTop: 0,
      seachProductsNoData: false,
      total: undefined,
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
      amplitude: {
        buy_sample:{
          page_code:'search_results_page'
        },
        event_value_productsId: [],
        pv_id: ''
      },
      shippedTime: undefined,
    };
  },
  created() {
    this.observerData.initflag = true;
    this.$EventBus.$off("productSearch");
    // this.$EventBus.$on("productSearch", () => {
    //   this.getlist();
    //   this.thekeyword = this.$route.query.keyword;
    // });
    if (this.$route.query.keyword) {
      this.$EventBus.$emit("productSearchValue", this.$route.query.keyword);
    }
  },
  beforeRouteLeave(to, from, next) {
    // 组件离开的时候，获取页面滚动高度
    this.offsetTop = document.querySelector(".search").scrollTop;
    next();
  },
  activated() {
    this.observerData.activatedflag = true;
    if(this.products.length !== 0) {
      console.log(44444, '页面缓存了activated----埋点');
      this.comFuncSettimeout('search_results_page');
    }
    localStorage.removeItem('ACTIVITYURL');
    setTimeout(() => {
      this.$nextTick(() => {
        document.querySelector(".search").scrollTop = this.offsetTop;
        setTimeout(() => {
          this.observerData.activatedflag = false;
        }, 1100);
      });
    }, 10);
  },
  watch: {
  },
  methods: {
    getlist() {
      this.isLoadProduct = true;
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      if(this.seachProductsNoData === true) {
        this.getHomeProduct();
      } else {
        searchProduct({
          curPage: this.curPage,
          pageSize: this.pageSize,
          keyword: this.$route.query.keyword,
          screenParams: this.filterval,
          // orderColumns: [this.sortValue], // 原来的弃用
          orderColumns: this.sort?[this.sort]:undefined,
          // originType:this.dateValue // 原来的弃用
          originType: this.originType,
          shippedTime: this.shippedTime,
          stockGt: this.stockGt,
        }, (res) => {
          let recentSearches = ( localStorage.getItem("RECENTSEARCHES")  && (localStorage.getItem('RECENTSEARCHES') !== 'null') )
            ? localStorage.getItem("RECENTSEARCHES").split(",")
            : [];
          if (
            this.$route.query.keyword &&
            this.$route.query.keyword.trim().length !== 0
          ) {
            recentSearches.push(this.$route.query.keyword);
          }
          let middleval = [...new Set(recentSearches)]; // 去重
          let middlevalSplice = [];
          if(middleval.length > 6) {
            middlevalSplice = middleval.splice(middleval.length-6, 6);
          } else {
            middlevalSplice = middleval;
          }
          localStorage.setItem('RECENTSEARCHES', middlevalSplice);
          this.$store.commit("localdata/RECENT_SEARCHES", middlevalSplice);

          if(res.result.length === 0) {
            this.getHomeProduct();
            // this.seachProductsNoData = true;
          } else {
            this.seachProductsNoData = false;
            const allPage = res.page.pages;
            const page = this.curPage;
            this.total = res.page.total
            this.isFinished = page >= allPage;
            const { result } = res;
            if (this.curPage > 1) {
              this.products = [...this.products, ...result];
            } else {
              this.products = result;
            }
            this.curPage++;
            let el = document.querySelector(".search")
            this.$nextTick(()=>{
              if(el.scrollHeight <= el.clientHeight) {
                this.load()
              }
            })
            this.amplitudeFunc('search_results_page', true); // true指瀑布流不是翻页
          }},() => {},() => {
          this.isLoadProduct = false;
          loading.close();
        });
      }
    },
    scrollDom() {
      this.domScroll('search_results_page', 'search');
    },
    // 首页商品数据
    getHomeProduct() {
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
      };
      sucess = (res) => {
        const allPage = res.page.pages;
        const page = this.curPage;
        const { result } = res;
        this.isFinished = page >= allPage;
        if (this.curPage > 1) {
          this.products = [...this.products, ...result];
        } else {
          this.products = result;
        }
        this.curPage++;
        this.amplitudeFunc('search_results_page', true); // true指瀑布流不是翻页
      };
      error = (res) => {
        console.log(res);
      };
      complete = (res) => {
        this.isLoadProduct = false;
        this.seachProductsNoData = true;
        loading.close();
        console.log(res);
      };
      homeProductPost(data, sucess, error, complete);
    },
    showQueryTerm(val) {
      val.selectFlag = true;
      if (this.$route.path == "/products/classify") {
        this.isAddTransfom = true;
      }
    },
    dialogFilterApply(val,d) {
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
      this.seachProductsNoData =false;
      this.getlist();
    },
    dialogSort(val) {
      this.sortValue = val;
      this.curPage = 1;
      this.seachProductsNoData =false;
      this.getlist();
    },
    load() {
      if (this.isFinished || this.isLoadProduct) {
        return;
      }
      this.getlist();
      console.log("加载加载加载加载");
    },
    // 更新商品是否是合集的
    updateProduct(parms) {
      var index = this.products.findIndex(
        (item) => item.id == parms.currentProduct.id
      );
      parms.operate == 1
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
    // 更新单个数据
    updateSingleProduct(parms) {
      var index = this.products.findIndex((item) => item.id == parms.id);
      this.products[index].containProduct = this.products[index].containProduct - parms.number;
    },
    regionChange(val,flag) {
      this.originType = (val==='')?undefined:val;
      if(flag) {
        this.curPage = 1;
        this.seachProductsNoData = false;
        this.products = [];
        this.getlist();
      }
    },
    timeChange(val) {
      this.shippedTime = (val==='')?undefined:val;
      this.curPage = 1;
      this.seachProductsNoData = false;
      this.products = [];
      this.getlist();
    },
    inventoryChange(val) {
      this.stockGt = (val==='')?undefined:val;
      this.curPage = 1;
      this.seachProductsNoData = false;
      this.products = [];
      this.getlist();
    },
    sortChange(val) {
      this.sort = (val==='')?undefined:val;
      this.curPage = 1;
      this.seachProductsNoData = false;
      this.products = [];
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
      this.getlist();
    }
  },
};
</script>

<style lang="less">
.search {
  height: 100%;
  box-sizing: border-box;
  overflow: scroll;
  padding-bottom: 40px;
  // padding-left: 40px;
  .products-container {
    max-width: 1320px;
    margin: 0 auto;
    box-sizing: border-box;
    .left-filter {
      position: fixed;
      z-index: 9;
    }
    .products {
      padding-left: 288px;
      position: relative;
      left: 8px;
      @media screen and (min-width: 1326px) {
       .products-single:nth-child(4n) {
          margin-right: 0 !important;
        }
      }
    }
  }
  &.isTourist {
    // padding: 0 132px 0 122px;
    .products-container {
      width: calc(100% + 26px);
    }
    .no-data {
      width: auto;
    }
    // .search-results {
    //   display: block;
    //   .filter-sort {
    //     margin-left: 0 !important;
    //     margin-top: 16px !important;
    //   }
    // }
  }
  .search-results {
    max-width: 1320px;
    margin: 0 auto;
    box-sizing: border-box;
    padding-top: 24px;
    top: 48px;
    background: #fff;
    z-index: 10;
    position: sticky;
    // margin-left: 12px;
    padding-bottom: 14px;
    font-weight: normal;
    font-size: 16px;
    color: #979797;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .right-sort-filter {
      max-width: 230px;
      width: 100%;
      display: flex;
      justify-content: flex-end;
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
    .text-no-wrap {
      white-space: nowrap;
    }
    .search-results-keyword {
      font-weight: 600;
      color: #333333;
    }
    .product-filter {
      justify-content: flex-end;
    }
  }
  .search-filter {
    margin: 10px 0 20px 10px;
    display: inline-flex;
    align-items: center;
    // .classify-query {
    //   height: 34px;
    // }
    .classify-query:first-child {
      margin-left: 0;
    }
    &.flex-column {
      width: 100%;
      margin-left: 0;
      // margin-bottom: 32px;
      .product-filter {
        display: flex;
        flex-direction: column;
        min-width: 270px;
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
  .no-data {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    // width: calc( 100% - 260px );
    max-width: 1320px;
    margin: 0 auto;
    & > img {
      width: 200px;
      height: 200px;
    }
    & > div:nth-child(2) {
      margin-top: 16px;
      font-weight: bold;
      font-size: 18px;
    }
    & > div:nth-child(3) {
      margin-top: 8px;
      max-width: 410px;
      font-weight: normal;
      font-size: 14px;
      text-align: center;
    }
    .no-data-feedback {
      cursor: pointer;
      margin-top: 24px;
      height: 56px;
      width: 370px;
      color: #ffffff;
      background: #333333;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 28px;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
      a {
        color: #ffffff;
        font-weight: 500;
        font-size: 20px;
      }
    }
    .no-data-feedback:hover { opacity: 0.6; }
    .no-data-feedback:active { opacity: 0.8; }
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
}
</style>
