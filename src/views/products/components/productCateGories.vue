<template>
  <div class="categories" :class="isTourist?'is-tourist':''" ref="categories" @scroll="classifyScroll">
      <!-- @click="openClassify(category)" -->
      <div class="categories-item-single" v-for="category in categoryList" :key="category.id">
        <router-link :to="{ path: '/products/classify', query: { id: category.id, name: category.name }}" target='_self'>
          <div class="img-box"><img class="icon" v-imgError :src="category.icon  || '@/static/littleImgError@2x.png'" alt="" /></div>
          <span class="name">{{ category.name.replace("\\n", "\n") }}</span>
        </router-link>
      </div>
    <div v-show="isShowLeft" class="categories-arrow-left" :class="isTourist?'is-tourist':''" @click="clickLeft()">
      <img src="@/static/productDetail/left@2x.png" alt="" />
    </div>
    <div v-show="isShowRight" class="categories-arrow-right" :class="isTourist?'is-tourist':''" @click="clickRight()">
      <img src="@/static/productDetail/right@2x.png" alt="" />
    </div>
  </div>
</template>

<script>
import { formatPrice } from "@/utils/common";

export default {
  props: {
    categoryListData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    addCollection: {
      type: Function,
      default: () => {},
    },
  },
  components: {},
  computed: {
    categoryList() {
      return this.categoryListData;
    }
  },
  watch: {
    categoryList() {
      let self = this;
      self.$nextTick(() => {
        let el = self.$refs['categories'];
        self.isShowLeft = false;
        self.isShowRight = (el.scrollWidth > el.clientWidth) ? true : false;
      })
    }
  },
  data() {
    return {
      formatPrice,
      isShowLeft: false,
      isShowRight: false
    };
  },
  created() {},
  activated() {
    let self = this;
    self.$nextTick(() => {
      let el = self.$refs['categories'];
      self.isShowLeft = false;
      self.isShowRight = (el.scrollWidth > el.clientWidth) ? true : false;
    })
  },
  mounted() {
    window.onresize = ()=> {
      let el = self.$refs['categories'];
      self.isShowLeft = (el.scrollWidth > el.clientWidth) ? true : false;
      self.isShowRight = (el.scrollWidth > el.clientWidth) ? true : false;
    }
  },
  methods: {
    // openClassify(item) {
    //   this.$router.push({
    //     path: `/products/classify`,
    //     name: "Classify",
    //     query: { id: item.id, name: item.name}
    //   });
    // },
    clickLeft() {
      let el = this.$refs['categories'];
      let clientWidth = el.clientWidth;
      let scrollDistance = 0;
      let timer = setInterval(() => {
        scrollDistance = scrollDistance + 8;
        el.scrollLeft -= 8;
        if (scrollDistance >= clientWidth || el.scrollLeft === 0) {
          clearInterval(timer);
          this.isShowLeft = false;
          this.isShowRight = true;
        }
      }, 2);
    },
    clickRight() {
      let el = this.$refs['categories'];
      let clientWidth = el.clientWidth;
      let scrollDistance = 0;
      let timer = setInterval(() => {
        scrollDistance = scrollDistance + 8;
        el.scrollLeft += 8;
        if (scrollDistance >= clientWidth) {
          clearInterval(timer);
          this.isShowRight = false;
          this.isShowLeft = true;
        }
      }, 2);
    },
    classifyScroll(e) {
      let scrollLeft = e.target.scrollLeft;
      let clientWidth = e.target.clientWidth;
      let scrollWidth = e.target.scrollWidth;
      if (Math.round(scrollLeft + clientWidth) >= scrollWidth) {
        this.isShowRight = false;
      } else {
        this.isShowRight = true;
      }
      if(scrollLeft == 0) {
        this.isShowLeft = false;
      }else if(scrollLeft>0) {
        this.isShowLeft = true;
      }
    }
  },
};
</script>
<style lang="less">
.categories::-webkit-scrollbar {
  display: none;
}
.categories:hover {
  .categories-arrow-left, .categories-arrow-right {
    display: inline-block;
    transition: all .3s;
    opacity: 1;
  }
  .categories-arrow-left {
    left: 0;
    transform: translateX(-50%);
  }
  .categories-arrow-right {
    right: 0;
    transform: translateX(50%);
  }
}
.categories {
  white-space: nowrap;
  width: 100%;
  overflow: auto;
  margin-top: -10px;
  // margin-right: 48px;
  // margin-left: -20px;
  .categories-arrow-left, .categories-arrow-right {
    height: 40px;
    width: 40px;
    border-radius: 20px;
    background: rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    text-align: center;
    position: absolute;
    cursor: pointer;
    margin-top: 34px;
    opacity: 0;
    img {
      height: 15px;
      margin-top: 12px;
    }
  }
  .categories-arrow-left {
    left: 50px;
  }
  .categories-arrow-right {
    right: 48px;
  }
  .categories-item-single {
    width: 88px;
    & > a {
      color: #333333;
    }
    &:last-child {
      margin: 0;
    }
    &:hover {
      .img-box {
        box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
      }
    }
    &:active {
      opacity: .8;
    }
    font-weight: 500;
    color: #333;
    text-align: center;
    cursor: pointer;
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    margin-right: 16px;
    margin-left: 16px;
    margin-top: 10px;
    .img-box {
      position: relative;
      font-size: 0;
      margin-bottom: 14px;
      background: #ffffff;
      border-radius: 44px;
      width: 88px;
      height: 88px;
      text-align: center;
      img {
        margin-top: 4px;
      }
      .icon {
        position: relative;
        border-radius: 50%;
        width: 80px;
        height: 80px;
        object-fit: cover;
      }
    }
    .name {
      white-space: break-spaces;
      width: 110px;
    }
  }
  .categories-item-single:first-child {
    margin-left: -4px;
  }
}
.categories.is-tourist {
  margin-right: 0;
  .categories-arrow-left.is-tourist {
    // left: 132px;
  }
  .categories-arrow-right.is-tourist {
    // right: 132px;
  }
}
</style>