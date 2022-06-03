<template>
  <div class="buy-shop-products" :class="!editShopNumber?'buy-shop-products-checkout':''">
    <div class="buy-shop-products-list">
      <div
        class="buy-shop-products-single"
        v-for="(singleCartData, index) in cartData"
        :key="index"
      >
        <div
          class="user-cart-volist"
          :class="{nohover:singleCart.onlineStatus==0}"
          :style="{ height, width }"
          v-for="(singleCart) in singleCartData.userCartVoList"
          :key="singleCart.id"
          @click="goShopDetail(singleCart)"
        >
          <div class="main-img">
            <img :src="singleCart.skuImage" alt="" />
            <div class="sold-out" v-if="singleCart.stockLeft == 0 ||singleCart.onlineStatus==0">
              Sold Out
            </div>
            <div class="sold-out" v-else-if="singleCart.forwardSell==1">
              Pre-order
            </div>
          </div>
          <div class="product-info">
            <div class="product-info-title">
              {{ singleCart.brand }} {{ singleCart.title }}
            </div>
            <div class="product-info-price-and-size">
              <div class="product-info-price">
                <div class="price">${{ formatPrice(singleCart.price) }}</div>
                <div class="crossed-price" v-if="singleCart.minCrossedPrice">${{ formatPrice(singleCart.minCrossedPrice) }}</div>
                <!-- <span class="product-info-msrp" v-if="singleCart.minCrossedPrice">MSRP</span> -->
              </div>
              <div class="size">
                {{ filterSizeName(singleCart.dimensionValues) }}
              </div>
            </div>
            <div class="pre-launch-tip" v-if="editShopNumber&&(singleCart._tagType==6||singleCart.tagType==6)">
              {{singleCart.productForecastSalesWaring}}
            </div>
            <div class="numbers">
              <strong>Quantity</strong>
              <div class="prune-number" @click.stop>
                <i
                  v-if="editShopNumber"
                  class="el-icon-remove circle"
                  @click.stop="addShopStock('remove', singleCart)"
                ></i>
                <span class="shop-numbers">{{ singleCart.num }}</span>
                <i
                  v-if="editShopNumber"
                  class="el-icon-circle-plus circle"
                  :class="{disable:singleCart.num>=singleCart.stockLeft||singleCart._tagType==6}"
                  @click.stop="addShopStock('plus', singleCart)"
                ></i>
              </div>
            </div>
          </div>
        </div>
        <!-- 到货时间 -->
        <div class="estimated-arrival">
          Estimated Arrival: {{ filterEstimatedTime(singleCartData) }}
        </div>
      </div>
    </div>
    <ConfirmedDialog
      v-if="dialogVisible"
      :dialogVisible.sync="dialogVisible"
      @ConfirmedFun="ConfirmedFun"
      :textInfo="textInfo"
    />
  </div>
</template>

<script>
import { formatPrice,dateAddSomeDays } from "@/utils/common";
import { addShopToCart, cartDelete } from "@/api/cart";
import successInfo from "@/mixins/successInfo";
import ConfirmedDialog from "@/components/ConfirmedDialog";
export default {
  data() {
    return {
      formatPrice,
      addToBagLoading: false,
      remToBagLoading: false,
      dialogVisible: false,
      textInfo: {
        title: "Remove",
        Cancel: "Cancel",
        Confirmed: "Remove Item",
        tip: "Are you sure you want to remove this from your bag?",
      },
      tempClickShopData: {}
    };
  },
  components: {
    ConfirmedDialog,
  },
  props: {
    height: {
      type: String,
      default: "150px",
    },
    width: {
      type: String,
      default: "100%",
    },
    cartData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    editShopNumber: {
      type: Boolean,
      default: false
    },
    hasRemove: {
      type: Boolean,
      default: true
    }
  },
  mixins: [successInfo],
  created() {
    console.log(this);
  },
  watch:{
    cartData:{
      handler:function (val) {
        if(!this.hasRemove) return;
        val.map((item)=>{
          const {userCartVoList} = item
          userCartVoList.map((list)=>{
            if(list.num>list.stockLeft) {
              const number = Math.abs(list.num - list.stockLeft)
              if(list.stockLeft>0) {
                this.removeToBag('remove', list, number,true);
              } 
            }
          })
        })
      },
      deep:true,
      immediate: true
    },
  },
  methods: {
    filterEstimatedTime(subCartInfoList) {
      let shippingMethod;
      //预售商品根据发货时间 与 货仓位置  计算发货时间
      if(subCartInfoList.forwardSell === 1){
        const forwardSellTime = subCartInfoList.forwardSellTime;
        //中国仓
        if(subCartInfoList.originType === 1){
          shippingMethod = `${dateAddSomeDays(forwardSellTime,2)} - ${dateAddSomeDays(forwardSellTime,5)}`
        }
        //美国仓
        if(subCartInfoList.originType === 2){
          shippingMethod = `${dateAddSomeDays(forwardSellTime,5)} - ${dateAddSomeDays(forwardSellTime,10)}`
        }
      }else{
        shippingMethod = subCartInfoList.shippingMethod;
      }
      return shippingMethod
    },
    filterSizeName(dimensionValues) {
      let str = "";
      for (const key in dimensionValues) {
        str += dimensionValues[key] + ", ";
      }
      return str.slice(0, str.length - 2);
    },
    addShopStock(type, singleCart) {
      if (type == "plus") {
        if (singleCart.num >= singleCart.stockLeft||singleCart._tagType==6) {
          return;
        }
        this.addToBag(type, singleCart);
      } else {
        if (singleCart.num == 1) {
          this.dialogVisible = true;
          this.tempClickShopData = {
            type,
            singleCart,
          };
          return;
        }
        this.removeToBag(type, singleCart);
      }
    },
    // 删除确认操作
    ConfirmedFun() {
      const { type, singleCart } = this.tempClickShopData;
      this.removeToBag(type, singleCart);
    },
    // 添加到购物车
    addToBag(type, singleCart) {
      var data, sucess, error, complete;
      if (this.addToBagLoading) {
        return;
      }
      this.addToBagLoading = true;
      const loading = this.$loading({
        lock: true,
        text: "",
        spinner: "el-icon-loading",
        background: "rgba(51,51,51,0.25)",
      });
      data = {
        productId: singleCart.productId,
        skuId: singleCart.skuId,
        num: 1,
      };
      console.log(data);

      // return
      sucess = () => {
        this.$emit("eidtCartData", { type, singleCart });
      };
      error = (res) => {
        if(res.data.code==500) {
          this.$set(singleCart,'_tagType',6)
          this.$set(singleCart,'productForecastSalesWaring',res.data.message)
          if(!res.data.message.includes('pre-launch')) {
            this.$emit("eidtCartData", { type, singleCart });
          }
        }
        console.log(res);
        // this.errorInfo = res.data.message;
      };
      complete = () => {
        this.$EventBus.$emit('searchCartNumber')
        loading.close();
        this.addToBagLoading = false;
      };
      console.log(data);
      addShopToCart(data, sucess, error, complete);
    },
    // 移除购物车
    removeToBag(type, singleCart, number = 1,initLoading = false) {
      var data, sucess, error, complete;
      if (this.remToBagLoading) {
        return;
      }
      this.remToBagLoading = true;
      const loading = this.$loading({
        lock: true,
        text: "",
        spinner: "el-icon-loading",
        background: "rgba(51,51,51,0.25)",
      });
      data = {
        // productId: singleCart.productId,
        skuId: singleCart.skuId,
        num: number,
      };
      console.log(data);

      // return
      sucess = () => {
        this.$emit("eidtCartData", { type, singleCart ,initLoading});
        console.log('第11个埋点------Remove from Bag-----', singleCart);
        let productInfoOne = singleCart;
        let uuId = JSON.parse(localStorage.getItem('USERINFO'))?JSON.parse(localStorage.getItem('USERINFO')).uuId:undefined;
        this.$gtm.trackEvent({
          event: 'remove_from_cart',
          userId: uuId,
          ecommerce: {
            Cstm_add_option: 'remove_from_bag',
            items: [{
              item_name: productInfoOne.title,
              item_id: productInfoOne.id,
              price: productInfoOne.price, // shopify 小c的价格
              item_brand: productInfoOne.brand,
              item_category: '',
              item_category2: '',
              item_category3: '',
              item_category4: '',
              item_variant: '',
              item_list_name: '',
              item_list_id: '',
              index: 1,
              quantity: 1
            }]
          }
        });
      };
      error = (res) => {
        console.log(res);
        // this.errorInfo = res.data.message;
      };
      complete = () => {
        this.$EventBus.$emit('searchCartNumber')
        loading.close();
        this.remToBagLoading = false;
      };
      console.log(data);
      cartDelete(data, sucess, error, complete);
    },
    goShopDetail(info) {
      if(info.onlineStatus==0) {
        return
      }
      this.$router.push({
        path: "/products/detail",
        query: {
          id: info.productId,
          skuId: info.skuId,
          ref_pv_id: this.$route.params.pv_id
        },
      });
    }
  },
};
</script>
<style lang="less">
.buy-shop-products {
  height: calc(100% - 56px);
  .buy-shop-products-list {
    height: 100%;
    overflow-y: auto;
    .buy-shop-products-single {
      margin-bottom: 24px;
      padding-bottom: 23px;
      border-bottom: 1px solid #EAEAEA;
      &:last-child {
        border: none;
      }
      .user-cart-volist {
        margin-bottom: 24px;
        display: flex;
        height: 100%;
        cursor: pointer;
        &.nohover {
          cursor: initial;
        }
        .main-img {
          flex-shrink: 0;
          height: 100%;
          width: 100px;
          margin-right: 24px;
          position: relative;
          .sold-out {
            position: absolute;
            left: 50%;
            bottom: 8px;
            transform: translateX(-50%);
            white-space: nowrap;
            font-weight: 600;
            font-size: 14px;
            height: 16px;
            line-height: 16px;
            padding: 2px 8px;
            border-radius: 4px;
            color: #fff;
            background: rgba(51, 51, 51, 0.6);
            backdrop-filter: blur(10px);
          }
          img {
            border-radius: 5px;
            height: 100%;
            width: 100%;
            object-fit: cover;
          }
        }
        .product-info {
          margin-right: 8px;
          display: flex;
          flex: 1;
          width: 0; //flex为1后如果不想子元素超出父元素设置width 0
          flex-direction: column;
          .product-info-title {
            font-size: 14px;
            font-weight: 500;
            line-height: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .product-info-price-and-size {
            margin-top: 24px;
            // margin-bottom: 52px;
            flex: 1;
            .product-info-price {
              display: flex;
              align-items: center;
              .price {
                font-size: 14px;
                font-weight: 500;
                line-height: 19px;
                color: #c79618;
              }
              .crossed-price {
                margin-left: 16px;
                font-size: 14px;
                font-weight: 400;
                line-height: 22px;
                color: #979797;
                text-decoration-line: line-through;
              }
              .product-info-msrp {
                margin-left: 4px;
                font-size: 14px;
                font-weight: 400;
                line-height: 22px;
                color: #979797;
              }
            }
            .size {
              font-size: 12px;
              font-weight: 400;
              line-height: 16px;
              color: #a9a2a2;
            }
          }

          .numbers {
            display: flex;
            justify-content: space-between;
            .prune-number {
              cursor: initial;
              display: flex;
              .shop-numbers {
                display: block;
                margin: 0 18px;
              }
              .circle {
                &.disable {
                  color: #979797;
                  cursor: inherit;
                }
                cursor: pointer;
                font-size: 20px;
              }
            }
          }
          .pre-launch-tip {
            font-size: 12px;
            line-height: 16px;
            color: #F363A0;
            margin-bottom: 15px;
          }
        }
      }
      .estimated-arrival {
        font-weight: bold;
        font-size: 14px;
        line-height: 19px;
        color: #333333;
      }
    }
    .buy-shop-products-single:last-child {
      .estimated-arrival {
        margin-bottom: 24px;
      }
    }
  }
}
.buy-shop-products-checkout {
  height: auto;
  .main-img {
    width: 60px !important;
  }
  .product-info-title {
    height: 30px;
  }
  .product-info-price-and-size {
    margin: 0 0 14px 0 !important;
  }
  .buy-shop-products-single:last-child {
    margin-bottom: 0 !important;
    padding-bottom: 0 !important;
  }
  .shop-numbers {
    text-align: right !important;
    font-weight: bold !important;
    margin: 0 !important;
  }
}
</style>