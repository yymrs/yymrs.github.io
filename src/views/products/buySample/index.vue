<template>
  <div class="buy-sample-page">
    <div class="has-product ms" v-if="subCartInfoList.length>0&&initLoading">
      <div class="buy-sample-page-product">
        <div class="buy-sample-page-product-header">
          <div class="bag-number">
            <strong>Bag</strong>
            <span>{{allShopItem}} {{allShopItem==1?'Item':'Items'}}</span>
          </div>
          <div class="bag-amount-tip" v-if="reduceAmount">
            <span class="shipping"
              >{{reduceAmount}}</span
            >
            <div class="go-shop" @click="goShop">
              <span class="shop-more">Shop More</span>
              <img src="@/static/productDetail/show-more@2x.png" alt="" />
            </div>
          </div>
        </div>
        <BuyShopProduct :cartData='subCartInfoList' :editShopNumber='true' @eidtCartData='eidtCartData' />
      </div>
      <div class="buy-sample-page-checkout">
        <div class="summary-info">
          <div class="summary">Summary</div>
          <div class="sub-total amount-row">
            <span class="name">Item Total</span>
            <span class="amount">${{formatPrice(productAmount)}}</span>
          </div>
          <div class="shipping amount-row">
            <span class="name">Shipping</span>
            <span class="amount">${{formatPrice(deliveryAmount)}}</span>
          </div>
          <div v-if="discountAmount!=='' && discountAmount!==null" class="tax amount-row"><span class="name">Discount</span><span style="color: #C79618;" class="amount">-${{ formatPrice(discountAmount) }}</span></div>
          <div class="tax amount-row">
            <span class="name">Tax</span>
            <span class="amount">${{formatPrice(textAmount)}}</span>
          </div>
          <div class="order-toatl amount-row">
            <span class="name">Order Total</span>
            <span class="amount">${{formatPrice(orderAmount)}}</span>
          </div>
          <!-- <div class="refund">
            <img
              src="@/static/productDetail/return&RefundYellow@2x.png"
              alt=""
            />
            <span class="return-date">{{refundRemark}}</span>
          </div> -->
        </div>
        <div class="buy-checkout">
          <div class="checkout-button" :class="{disable:continueToCheckoutDisable}" @click="continueCheckout">Continue to Checkout</div>
        </div>
      </div>
    </div>
    <div class="no-product ms" v-if="subCartInfoList.length==0&&initLoading">
      <div class="buy-sample-page-product-header">
        <div class="bag-number">
          <strong>Bag</strong>
          <span>0 Items</span>
        </div>
      </div>
      <div class="no-product-content">
        <div class="no-product-img">
        <img src="@/static/noCart@2X.png" alt="" />
      </div>
      <div class="Empty">Your Bag Is Empty</div>
      <div class="Empty-tip">Browse products to find samples to buy.</div>
      <div class="browse-Products">
        <div class="browse-Products-button" @click="goShop">Browse Products</div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import BuyShopProduct from "@/views/products/components/buyShopProduct";
import { cartConfirmForMutilableOrder } from "@/api/cart";
import { formatPrice } from "@/utils/common";
export default {
  name: "buySample",
  data() {
    return {
      subCartInfoList:[],
      addressVo:{},
      orderAmount:0,//订单金额
      textAmount:0,//运费
      productAmount:0,//商品
      deliveryAmount:0, //运费
      refundRemark:'', 
      reduceAmount:null,
      initLoading:null,
      getDataLoading:false,
      formatPrice,
      discountAmount:null,
      continueToCheckoutDisable:false
    };
  },
  computed:{
    allShopItem() {
      let number = 0
      if(this.subCartInfoList.length>0) {
        this.subCartInfoList.map((item)=>{
          item.userCartVoList.map((list)=>{
            number += list.num
          })
        })
      }
      return number
    }
  },
  components: {
    BuyShopProduct,
  },
  created() {
    this.initCartData({addressId:''},true);
  },
  methods: {
    initCartData(parms,init=false,fun) {
      var data, sucess, error, complete;
      this.getDataLoading = true;
      data = {
        addressId: parms.addressId?parms.addressId:"",
        discountCodeId: null,
      };
      if(init) {
        var loading = this.$loading({
          lock: true,
          text: "",
          spinner: "el-icon-loading",
          background: "rgba(51,51,51,0.25)",
        });
      }
      console.log(data);
      // return
      sucess = (res) => {
        const {
          subCartInfoList, //购物车数据
          addressVo, //地址
          orderAmount, // 订单金额
          productAmount,
          textAmount,
          deliveryAmount,
          refundRemark,
          reduceAmount,
        } = res.result;
        this.subCartInfoList = subCartInfoList
        this.addressVo = addressVo
        this.discountAmount = res.result.dicount
        this.orderAmount = orderAmount
        this.textAmount = textAmount
        this.productAmount = productAmount
        this.deliveryAmount = deliveryAmount
        this.refundRemark = refundRemark
        this.reduceAmount = reduceAmount
        if(fun) {
          fun()
        }else {
          // 初始化的时候对pre商品进行下一步按钮禁用
          let flag = this.subCartInfoList.some((item)=>{
            const singleCart = item.userCartVoList
            return singleCart.some((signle)=>{
              const preLaunch = signle.productForecastSalesWaring
              return preLaunch
            })
          })
          if(flag) {
            this.continueToCheckoutDisable = true
          }else {
            this.continueToCheckoutDisable = false
          }
        }
      };
      error = (res) => {
        console.log(res);
        // this.errorInfo = res.data.message;
      };
      complete = () => {
        this.initLoading = true
        this.getDataLoading = false
        if(init) {
          loading.close();
        }
      };
      cartConfirmForMutilableOrder(data, sucess, error, complete);
    },
    eidtCartData(parms) {
      console.log(parms);
      let query = {
        addressId:this.addressVo?this.addressVo.id:''
      }
      this.initCartData(query,parms.initLoading)
    },
    goShop() {
      this.$router.push({
        path:'/'
      })
    },
    continueCheckout() {
      if(this.getDataLoading||this.continueToCheckoutDisable) {
        return
      }
      this.initCartData({addressId:''},false,this.fillterCheckout)
    },
    // init是否是初始化的请求数据
    fillterCheckout() {
      // 库存不足，下架商品，pre库存不够商品
      let stockLeft,onlineStatus,preLaunch;
      let flag = this.subCartInfoList.some((item)=>{
        const singleCart = item.userCartVoList
        console.log(singleCart);
        return singleCart.some((signle)=>{
          if(signle.stockLeft==0||signle.num>signle.stockLeft) {
            stockLeft = true
          }else if(signle.onlineStatus==0) {
            onlineStatus = true
          }else if(signle.tagType == 6 && signle.productForecastSalesWaring) {
            preLaunch = signle.productForecastSalesWaring
          }
          return signle.stockLeft == 0 ||signle.onlineStatus==0 ||signle.num>signle.stockLeft || preLaunch
        })
      })
      console.log(flag);
      // 1.无库存或者下架商品，或者购买量大于库存
      // 没有任何不满足购买商品情况
      if(flag==false) {
        this.continueToCheckoutDisable = false
        let commonOne = [];
        let commonTwo = [];
        this.subCartInfoList.forEach((item)=> {
          commonOne = commonOne.concat(item.userCartVoList);
        })
        commonOne.forEach((item, index)=> {
          commonTwo.push({
            item_name: item.title,
            item_id: item.productId,
            price: item.price,
            item_brand: item.brand,
            index: index+1,
            quantity: item.num,
            item_category: '',
            item_category2: '',
            item_category3: '',
            item_category4: '',
            item_variant: '',
            item_list_name: '',
            item_list_id: '',
          })
        })
        console.log('第15个埋点------Sample_from_app_checkout-----', commonTwo);
        let uuId = JSON.parse(localStorage.getItem('USERINFO'))?JSON.parse(localStorage.getItem('USERINFO')).uuId:undefined;
        this.$gtm.trackEvent({
          event: 'begin_checkout',
          userId: uuId,
          ecommerce: {
            cstm_checkout_option: 'Sample_from_app_checkout',
            items: commonTwo
          }
        });
        this.$router.push({
          path:'/checkout'
        })
      }else if(flag==true) {
        let message = ''
        this.continueToCheckoutDisable = true
        if(onlineStatus) {
          message = 'Some items are no longer available. Please remove and try again.'
        }else if(stockLeft) {
          message = 'Some items in your bag are no longer available.'
        }else if(preLaunch) {
          message = preLaunch
        }
        this.$notify({
          title: "Oops",
          message,
          iconClass:'el-icon-warning-outline',
          duration: 3000
        });
      }
    }
  },
};
</script>

<style lang="less">
.buy-sample-page {
  padding-top: 40px;
  // padding-left: 61px;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  .has-product {
    box-sizing: border-box;
    max-width: 1320px;
    margin: 0 auto;
    display: flex;
    width: 100%;
    height: 100%;
    overflow-x: auto;
    .buy-sample-page-product {
      flex-shrink: 0;
      margin-right: 136px;
      max-width: 623px;
      flex: 1;
      .buy-sample-page-product-header {
        display: flex;
        align-items: center;
        margin-bottom: 24px;
        width: 482px;
        white-space: nowrap;
        height: 32px;
        .bag-number {
          strong {
            display: inline-block;
            font-size: 24px;
            width: 46px;
            font-style: normal;
            font-weight: 700;
            line-height: 28px;
            margin-right: 17px;
          }
          span {
            display: inline-block;
            white-space: nowrap;
            width: 47px;
            font-size: 14px;
            font-weight: 500;
            line-height: 19px;
            color: #979797;
          }
          margin-right: 19px;
        }
        .bag-amount-tip {
          display: flex;
          align-items: center;
          box-sizing: border-box;
          height: 32px;
          background: #fffbf2;
          border-radius: 20px;
          padding: 0 20px;
          .go-shop {
            display: flex;
            align-items: center;
            box-sizing: border-box;
            cursor: pointer;
          }
          .shipping {
            font-weight: 500;
            font-size: 12px;
            line-height: 16px;
            color: #333333;
            margin-right: 15px;
          }
          .shop-more {
            cursor: pointer;
            font-weight: 500;
            font-size: 12px;
            line-height: 16px;
            color: #c79818;
          }
          img {
            margin-left: 8px;
            display: block;
            height: 8px;
            width: 5px;
          }
        }
      }
    }
    .buy-sample-page-checkout {
      // flex-shrink: 0;
      flex: 1;
      max-width: 409px;
      min-width: 300px;
      display: flex;
      padding-right: 72px;
      flex-direction: column;
      .summary-info {
        flex: 1;
        overflow-y: auto;
        .summary {
          margin-bottom: 22px;
          font-size: 24px;
          font-weight: 700;
          line-height: 28px;
        }
        .amount-row {
          &.order-toatl {
            padding-top: 16px;
            border-top: 1px solid #eeeeee;
            span {
              color: #c79618;
              font-weight: bold;
              font-size: 16px;
              line-height: 22px;
            }
          }
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
          .name {
            color: #333;
            font-weight: 500;
            font-size: 14px;
            line-height: 19px;
          }
          .amount {
            color: #333;
            font-weight: 500;
            font-size: 14px;
            line-height: 19px;
          }
        }
        .refund {
          display: flex;
          align-items: center;
          img {
            display: block;
            width: 24px;
            height: 24px;
          }
          .return-date {
            display: block;
            font-size: 14px;
            line-height: 19px;
            color: #c79618;
          }
        }
      }
      .buy-checkout {
        margin-bottom: 40px;
        display: flex;
        justify-content: center;
        .checkout-button {
          &:not(.disable):hover {
            opacity: .6;
          }
          &:not(.disable):active {
            opacity: .8;
          }
          &.disable {
            opacity: .1;
            cursor: initial;
          }
          cursor: pointer;
          width: 340px;
          height: 56px;
          line-height: 56px;
          text-align: center;
          background: #c79818;
          border-radius: 30px;
          text-align: center;
          font-weight: 500;
          font-size: 20px;
          color: #ffffff;
        }
        // .checkout-button:hover { opacity: 0.6; }
        // .checkout-button:active { opacity: 0.8; }
      }
    }
  }
  .no-product {
    max-width: 1320px;
    margin: 0 auto;
    box-sizing: border-box;
    text-align: center;
    .no-product-content {
      // position: absolute;
      text-align: center
      // left: 43%;
      // transform: translateX(-50%);
    }
    .buy-sample-page-product-header {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      .bag-number {
        strong {
          font-size: 24px;
          font-style: normal;
          font-weight: 700;
          line-height: 28px;
          margin-right: 17px;
        }
        span {
          font-size: 14px;
          font-weight: 500;
          line-height: 19px;
        }
        margin-right: 19px;
      }
    }
    .no-product-img {
      font-size: 0;
      img {
        width: 200px;
        height: 200px;
      }
      margin-bottom: 10px;
    }
    .Empty {
      font-size: 18px;
      font-weight: 700;
      line-height: 24px;
      margin-bottom: 20px;
    }
    .Empty-tip {
      font-size: 18px;
      font-weight: 500;
      line-height: 25px;
      margin-bottom: 23px;
    }
    .browse-Products {
      display: flex;
      justify-content: center;
      .browse-Products-button {
        cursor: pointer;
        &:hover {
          opacity: .6;
        }
        &:active {
          opacity: .8;
        }
        width: 340px;
        height: 56px;
        line-height: 56px;
        background: #333333;
        filter: drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.15));
        border-radius: 40px;
        font-size: 18px;
        font-weight: 600;
        color: #fff;
      }
    }
  }
}
</style>