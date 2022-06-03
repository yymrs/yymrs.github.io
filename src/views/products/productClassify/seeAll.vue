<template>
  <div class="classify-all ms" :class="{isTourist}">
    <div class="classify-all-title">
      <div class="classify-img" @click="backPage"><img src="@/static/productDetail/headerBack@2x.png" alt=""></div>
      <span class="back-text" @click="backPage"> Back </span>
      <span class="classify-text" >Categories</span>
    </div>
    <div class="categories-items">
      <div class="categories-item-single" v-for="category in categoryList" :key="category.id" @click="openClassify(category)">
        <div class="img-box"><img class="icon" v-imgError :src="category.icon || '@/static/littleImgError@2x.png'" alt="" /></div>
        <div class="name">{{ category.name.replace("\\n", "\n") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getStoragePrefix } from "@/utils/common";
import { homeProductPostCategoryList, homeComingSoonProductList } from "@/api/production";
export default {
  name: "ClassifyAll",
  data() {
    return {
      categoryList: []
    };
  },
  created() {
    localStorage.removeItem('ACTIVITYURL');
    this.cateGoriesAndComingSoon();
  },
  computed: {},
  methods: {
    backPage() {
      this.$router.back();
    },
    openClassify(item) {
      localStorage.setItem(
        getStoragePrefix("shopClassify"),
        JSON.stringify(item)
      );
      this.$router.push({
        path: `/products/classify`,
        name: "Classify",
        query: { id: item.id, name: item.name}
      });
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
    // 预发布结果处理
    handleComing(comData, categoryData) {
      var comingAndCategoryList, childArr, obj;
      if(comData.status==1 && comData.tagVos.length > 0) {
        childArr = comData.tagVos;
        obj = {
          name: comData.name,
          icon: comData.logo,
          id: childArr[0].id,
          type: "coming",
          children: childArr,
        };
        comingAndCategoryList = [obj, ...categoryData];
      }else {
        comingAndCategoryList = categoryData;
      }
      this.categoryList = comingAndCategoryList;
    }
  }
};
</script>

<style lang="less">
.classify-all {
  // margin-left: 40px;
  &.isTourist {
    // margin-left: 132px;
  }
  box-sizing: border-box;
  max-width: 1320px;
  margin: 0 auto;
  .classify-all-title {
    display: flex;
    align-items: center;
    margin: 24px 0 24px 0;
    .back-text {
      cursor: pointer;
      display: none;
      padding: 0 8px;
      font-weight: 600;
      font-size: 18px;
      color: #000;
      &:hover {
        display: inline;
      }
    }
    & > div {
      cursor: pointer;
      display: inline-block;
      height: 24px;
      width: 24px;
      background: rgba(51, 51, 51, .1);
      text-align: center;
      border-radius: 12px;
      & > img {
        height: 11px;
        vertical-align: sub;
        margin-left: -1px;
      }
    }
    & > div:hover {
      background: rgba(51, 51, 51, .2);
    }
    & > div:hover + .back-text {
      display: inline
    }
    .classify-text {
      margin-left: 16px;
      font-weight: bold;
      font-size: 24px;
      color: #333333;
    }
  }
  .categories-items {
    margin-left: -4px;
    .categories-item-single {
      cursor: pointer;
      display: inline-grid;
      text-align: center;
      margin: 0 40px 40px 0;
      width: 108px;
      .img-box {
        margin-bottom: 18px;
        width: 108px;
        height: 108px;
        border-radius: 54px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        img {
          height: 100px;
          border-radius: 50px;
          width: 100px;
          object-fit: cover;
        }
      }
      .name {
        max-width: 110px;
        font-weight: bold;
        font-size: 14px;
        color: #333333;
      }
    }
    .categories-item-single:hover {
      .img-box {
          box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
        }
    }
    .categories-item-single:active { opacity: 0.8; }
  }
}
</style>