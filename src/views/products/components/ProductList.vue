<template>
  <div class="product-list">
    <div v-for="(item, index) in productLists" :key="index" @click="showDetail(item)" >
      <div class="Pre-order">
        <img v-imgError :src="item.mainImage" alt="">
        <div class="pre-order-bk" v-if="item.forwardSell==1">
          Pre-order
        </div>
      </div>
      <div class='right-content'>
        <div class="product-list-title">{{ item.title }}</div>
        <div class="product-list-price" v-if="!isTourist">
          <div class="list-price"><span>Product Cost</span>
            <span class="price-color-yellow">
              <img v-if="isTourist" src="@/static/lock@2x.png" alt="">
              <p v-else>
                <span v-if="item.minCrossedPrice" class="price-color-throughline">${{ formatPrice(item.minCrossedPrice) }}</span>
                <span>${{ formatPrice(item.minPriceB) }}</span>
              </p>
            </span>
          </div>
          <div class="list-price"><span>Suggested Resale Price</span><span>${{ formatPrice(item.minPrice) }}</span></div>
          <!-- <div v-show="item.minPrice">${{ formatPrice(item.minPrice) }}</div>
          <div v-show="item.minCrossedPrice">${{ formatPrice(item.minCrossedPrice) }}</div>
          <div v-show="item.minEarn">Earn ${{ formatPrice(item.minEarn) }}</div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatPrice } from "@/utils/common";
export default {
  props: {
    productLists: {
      type: Array,
      default: () => {
        return [];
      },
    }
  },
  computed: {
  },
  data() {
    return {
      formatPrice
    };
  },
  methods: {
    showDetail(item) {
      this.$emit('close');
      if(this.$route.fullPath !== `/products/detail?id=${item.id}`) {
        this.$router.push({
          path: "/products/detail",
          query: {
            id: item.id,
            ref_pv_id: this.$route.params.pv_id
          },
        });
      }
    }
  },
};
</script>
<style lang="less">
  .product-list {
    & > div {
      cursor: pointer;
      margin: 16px 16px 0 0;
      width: 368px;
      display: inline-flex;
      background: #FFFFFF;
      box-shadow: 0px 5px 20px rgba(147, 141, 128, 0.1);
      border-radius: 12px;
      .Pre-order {
        position: relative;
        img {
          display: block;
          width: 80px;
          height: 120px;
          object-fit: cover;
          border-top-left-radius: 12px;
          border-bottom-left-radius: 12px;
        }
        .pre-order-bk {
          position: absolute;
          z-index: 20;
          bottom: 10px;
          white-space: nowrap;
          padding: 2px 6px;
          color: #333;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(10px);
          height: 16px;
          line-height: 16px;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          border-radius: 6px;
        }
      }
      & .right-content{
        font-weight: 600;
        font-size: 14px;
        padding: 16px;
        max-width: 256px;
        width: 100%;
        .product-list-title {
          height: calc(100% - 48px);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .product-list-price {
          .list-price {
            margin-top: 8px;
            & > span {
              font-family: Avenir Next;
              font-style: normal;
              font-weight: 500;
              font-size: 12px;
              line-height: 16px;
              color: #333333;
            }
            & > span:last-child {
              float: right;
              font-weight: 600;
            }
            span.price-color-yellow {
              p {
                color: #C79618;
                .price-color-throughline {
                  text-decoration: line-through;
                  color: #979797;
                  font-weight: normal;
                  font-size: 12px;
                  margin-right: 4px;
                }
              }
              img {
                width: 9px;
                height: 12px;
              }
            }
          }
        }
        // .product-list-price {
        //   height: 18px;
        //   & > div {
        //     height: 18px;
        //     display: inline-flex;
        //   }
        //   & > div:first-child {
        //     color: #C79618;
        //   }
        //   & > div:nth-child(2) {
        //     text-decoration: line-through;
        //     font-weight: normal;
        //     padding-left: 8px;
        //     color: #979797;
        //   }
        //   & > div:nth-child(3) {
        //     padding-left: 8px;
        //   }
        // }
      }
    }
  }
</style>