<template>
  <div class="order-return-submit">
    <div class="order-return-each" v-for="(item, index) in dataList" :key="index">
      <div class="order-return-product">
        <div class="product-left">
          <img :src="item.image" alt="">
          <div class="product-info">
            <div class="product-top">
              <div class="product-title">{{ (item.brand?(item.brand + '&nbsp;'):'') + item.productTitle }}</div>
              <div class="product-sku">{{item.dimensionValues && Object.keys(item.dimensionValues).length ? Object.values(item.dimensionValues).join(',') : '' }}</div>
            </div>
            <div class="product-bottom">Quantity：1</div>
          </div>
        </div>
        <div class="product-right">
          <div>
            <div>{{ item.afterReason }}</div>
            <div class="color-red" v-if="(item.afterReason === 'Damaged upon arrival') || (item.afterReason === 'Wrong item sent')">Item doesn't need to be returned</div>
          </div>
          <div>${{ item.actPrice }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'orderReturn',
    props: {
      dataList: {
        type: Array,
        default: ()=>{}
      }
    },
    data() {
      return {
        currentNum: new Array(10000).fill(0) // 定义全0数组
      }
    },
    methods: {
      addReturn (type, index) {
        if(type === 'remove') {
          this.currentNum[index] -= 1;
          this.$forceUpdate(); // 解决数组不渲染的问题
          this.$emit('currentNum', this.currentNum, this.dataList.length);
        }
        if(type === 'add') {
          this.currentNum[index] += 1;
          this.$forceUpdate();
          this.$emit('currentNum', this.currentNum, this.dataList.length);
        }
      }
    },
    created() {}
  }
</script>

<style lang="less">
  .order-return-submit {
    .order-return-each {
      text-align: left;
      margin-top: 24px;
      .order-return-product {
        display: inline-flex;
        align-items: center;
        text-align: left;
        width: 100%;
        .product-left {
          display: inline-flex;
          width: calc( 100% - 298px );
          img {
            width: 60px;
            height: 90px;
            border-radius: 8px;
          }

          .product-info {
            display: inline-block;
            margin-left: 10px;
            .product-top {
              height: calc( 100% - 20px );
              .product-title {
                font-size: 14px;
                line-height: 20px;
                color: #333333;
                text-overflow: ellipsis;
                overflow: hidden;
                width: 240px;
                white-space: nowrap;
              }
              .product-sku {
                margin-top: 8px;
                font-size: 12px;
                line-height: 16px;
                color: #979797;
              }
            }
            .product-bottom {
              height: 20px;
              font-size: 12px;
              line-height: 20px;
              color: #333333;
            }
          }
        }
        .product-right {
          width: 298px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;
          color: #333333;
          .color-red {
            color: #F363A0;
            margin-top: 4px;
          }
          .product-number {
            display: flex;
            justify-content: space-between;
            align-items: center;
            i {
              cursor: pointer;
            }
            i.disabled {
              opacity: 0.1;
            }
          }
          .product-maximium {
            margin-top: 4px;
            font-size: 12px;
            line-height: 16px;
            color: #979797;
          }
        }
      }
    }
  }
</style>