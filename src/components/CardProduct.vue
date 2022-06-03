<template>
  <div class="card-product" infinite-scroll-distance='550' v-infinite-scroll="infiniteload">
    <div class="card-product-item" v-for="(item, index) in cardproduct" :key="index" @click="productDetail(item)">
      <img v-imgError :src="item.mainImage?item.mainImage:littleImgError" alt="">
      <div class="card-product-right">
        <div class="card-product-title">{{ item.title }}</div>
        <div class="card-product-price">
          <!-- <div v-show="item.price"><span v-if="true">Shopify </span>${{ formatPrice(item.price) }}</div>
          <div v-show="item.earn">Earn ${{ formatPrice(item.earn) }}</div> -->
          <div v-show="item.priceB || item.minPriceB"><span>Product Cost </span><span v-if="item.minCrossedPrice" class="price-color-throughline">${{ formatPrice(item.minCrossedPrice) }}</span><span class="price-color-yellow">${{ formatPrice(item.priceB || item.minPriceB) }}</span></div>
          <div v-show="item.price || item.minPrice">Selling Price ${{ formatPrice(item.price || item.minPrice) }}</div>
        </div>
        <div class="card-product-btn">
          <div @click.stop="removeShopify(item)">Remove From {{ storeType===0?'Shopify':'Trendsi Store' }}</div>
          <!-- :style="`opacity:${((item.state === 0)&&(storeType === 1))?'0.1':'1'}`" -->
          <div @click.stop="viewShopify(item)">View On {{ storeType===0?'Shopify':'Trendsi Store' }}</div>
        </div>
        <!-- 商品上下架状态state: 1正常，0下架，2售空 -->
        <!-- storeType: 0是shopify店铺, 1是trendsi店铺 -->
        <div v-if="item.state === 0" class="card-product-extra sold-out">No Longer Available</div>
        <!-- <div v-else-if="item.state === 2" class="card-product-extra sold-out">Sold Out</div> -->
        <!-- <div v-else-if="isSoldOut(item)" class="card-product-extra sold-out">Sold Out</div> -->
        <div v-else-if="item.state !== 3 && storeType === 0 ? isSoldOut(item) : item.state === 2" class="card-product-extra sold-out">Sold Out</div>
        <div v-else-if="item.state === 4 && storeType === 0" class="card-product-extra sold-out">Shipping Delay</div>
        <div v-else-if="item.state === 3" class="card-product-extra sold-out">Restocking</div>
        <div v-else-if="item.preSell" class="card-product-extra sale-ends">Pre-order</div>
        <div v-else-if="item.tagType==6" class="card-product-extra sold-out">Pre-Launch</div>
        <div v-else-if="expirationTime(item.expireT)" class="card-product-extra sale-ends">Sale Ends: {{ expirationTime(item.expireT) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatPrice, transferDateFromNowDetail } from "@/utils/common";
export default {
  name: 'CardProduct',
  components: {
  },
  props: {
    cardproduct: {
      type: Array,
      default: () => {}
    },
    storeType: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      formatPrice,
      littleImgError: require('../static/littleImgError@2x.png')
    }
  },
  computed: {
  },
  watch: {
  },
  methods: {
    expirationTime(val) {
      let date = transferDateFromNowDetail(val);
      if (date && date.indexOf("-") == -1) { return date; }
    },
    isSoldOut(val) {
      let stockAll = val.skuList;
      let stockItem = (stockAll.filter((r)=>r.stock === 0).length) === stockAll.length;
      return stockItem;
    },
    removeShopify(val) {
      this.$emit('removeShopify', val)
    },
    viewShopify(val) {
      if (val.state === 0 && this.storeType === 1) {
        return;
      } else {
        this.$emit('viewShopify', val)
      }
    },
    productDetail(val) {
      if (val.state === 0) {
        return;
      } else {
        const { href } = this.$router.resolve({ path: '/products/detail', query: {
          id: val.productId,
          ref_pv_id: this.$route.params.pv_id
        }});
        window.open(href,'_blank')
      }
    },
    infiniteload() {
      this.$emit('load')
    }
  },
  created() {
  },
  mounted() {
  }
}
</script>

<style lang="less">
  .card-product {
    padding-bottom: 20px; 
    .card-product-item {
      height: 120px;
      width: 468px;
      margin-top: 24px;
      margin-right: 24px;
      display: inline-flex;
      background: #FFFFFF;
      border: 1px solid #EEEEEE;
      border-radius: 18px;
      box-sizing: border-box;
      & > img {
        width: 80px;
        height: 120px;
        border-top-left-radius: 17px;
        border-bottom-left-radius: 17px;
        margin-top: -1px;
        margin-left: -1px;
        object-fit: cover;
      }
      & > div {
        display: inline-block;
      }
      .card-product-right {
        height: 120px;
        width: 100%;
        position: relative;
        box-sizing: border-box;
        padding: 16px 16px 16px 24px;
        .card-product-title {
          font-weight: bold;
          word-break: break-word;
          font-size: 14px;
          line-height: 16px;
        }
        .card-product-price {
          margin-top: 8px;
          display: inline-flex;
          align-items: center;
          & > div, span {
            font-weight: 500;
            font-size: 12px;
          }
          .price-color-throughline {
            text-decoration: line-through;
            color: #979797;
            font-weight: normal;
            font-size: 10px;
            margin-right: 4px;
          }
          .price-color-yellow {
            color: #C79618;
          }
          & > div:nth-child(2) {
            margin-left: 16px;
          }
        }
        .card-product-btn {
          display: none;
          position: absolute;
          bottom: 16px;
          & > div {
            cursor: pointer;
            // width: 152px;
            height: 24px;
            line-height: 24px;
            color: #ffffff;
            font-weight: 500;
            font-size: 12px;
            text-align: center;
          }
          & > div:first-child {
            width: 175px;
            background: #333333;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
            border-radius: 20px;
          }
          & > div:nth-child(2) {
            width: 152px;
            margin-left: 24px;
            background: #C79818;
            box-shadow: 0px 4px 10px rgba(118, 85, 0, 0.2);
            border-radius: 20px;
          }
          & > div:first-child:hover { opacity: 0.6; }
          & > div:first-child:active { opacity: 0.8; }
          & > div:nth-child(2):hover { opacity: 0.6; }
          & > div:nth-child(2):active { opacity: 0.8; }
        }
        .card-product-extra {
          float: right;
          width: 156px;
          height: 24px;
          line-height: 24px;
          border-radius: 10px 0px 17px 0px;
          position: absolute;
          bottom: 0;
          right: 0;
          font-weight: bold;
          font-size: 10px;
          text-align: center;
        }
        .sale-ends {
          background: #EEEEEE;
          color: #333333;
        }
        .sold-out {
          background: #333333;
          color: #ffffff;
        }
      }
    }
    .card-product-item:hover {
      cursor: pointer;
      box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
      border-color: transparent;
      .card-product-btn {
        display: flex;
        align-items: center;
      }
      .card-product-extra {
        display: none;
      }
    }
  }
</style>