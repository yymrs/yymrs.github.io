<template>
  <div class="order-return">
    <div class="order-return-each" v-for="(item, index) in dataList" :key="index">
      <div class="order-return-product" :style="`opacity:${(item.canReturn === 2)?'0.5':'1'}`">
        <div class="product-left">
          <img :src="item.skuImage" alt="">
          <div class="product-info">
            <div class="product-title">{{ (item.brand?(item.brand + '&nbsp;'):'') + item.title }}</div>
            <div class="product-sku">{{item.dimensionValues && Object.keys(item.dimensionValues).length ? Object.values(item.dimensionValues).join(',') : '' }}</div>
          </div>
        </div>
        <div class="product-right" :style="`opacity:${((item.canReturn === 0) && (item.maxReturnNum === 0))?'0.5':'1'}`">
          <div class="product-number" @click.stop>
            <i class="el-icon-remove circle disabled" v-if="(currentNum[index] === 0) || (item.canReturn === 0)"></i>
            <i class="el-icon-remove circle" v-else @click.stop="addReturn('remove', index)"></i>
            <span class="shop-numbers">{{ currentNum[index] }}</span>
            <i class="el-icon-remove circle disabled" v-if="(currentNum[index] === item.num) || (item.canReturn === 0)"></i>
            <i class="el-icon-circle-plus circle" v-else @click.stop="addReturn('add', index)"></i>
          </div>
          <div class="product-maximium">Maximium {{ item.maxReturnNum }}</div>
        </div>
      </div>
      <div class="order-return-info" v-if="(item.canReturn === 0) && (item.maxReturnNum === 0)">
        Return requested.
      </div>
      <div class="order-return-info" v-if="item.canReturn === 2">
        Not eligible for return.  <div class="order-return-info-link" @click="seeDetail()">See details</div>
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
      },
      seeDetail() {
        window.open('https://help.trendsi.com/knowledge/trendsi-return/exchange-policy-procedure', '_blank');
      }
    },
    created() {}
  }
</script>

<style lang="less">
  .order-return {
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
          width: calc( 100% - 83px );
          img {
            width: 60px;
            height: 90px;
            border-radius: 8px;
          }
          .product-info {
            display: inline-block;
            margin-left: 10px;
            .product-title {
              font-size: 14px;
              line-height: 20px;
              color: #333333;
              text-overflow: ellipsis;
              overflow: hidden;
              width: 450px;
              white-space: nowrap;
            }
            .product-sku {
              margin-top: 8px;
              font-size: 12px;
              line-height: 16px;
              color: #979797;
            }
          }
        }
        .product-right {
          width: 83px;
          text-align: center;
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
      .order-return-info {
        font-size: 12px;
        line-height: 18px;
        color: #F363A0;
        .order-return-info-link {
          display: inline-block;
          color: #333333;
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }
  }
</style>