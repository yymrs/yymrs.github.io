<template>
  <div class="checkout">
    <div class="checkout-container ms">
      <div class="content-left" v-if="isLoad.isLoadEmail === false">
      <div class="content-info-header-large"><div>Checkout</div></div>
      <el-form ref="formInfo" :model="formInfo" :rules="rules">
        <div class="content-info-header">Shipping</div>
        <div class="shipping-info">
          <el-form-item prop="email" class="margin-top-8">
            <el-input class="inputEmail" size="large" v-model.trim="formInfo.email" placeholder="Email Address*" autocomplete="off" maxlength="70" v-focusblurstyle></el-input>
          </el-form-item>
          <div class="shipping-info-address" v-if="!isShow.address" @click="chooseAddress(formInfo.address)">
            <div class="view-info">
              <div>{{ formInfo.address.firstName + ' ' + formInfo.address.lastName }}</div>
              <div>{{ formInfo.address.addressLine1 + ((formInfo.address.addressLine2)?(', ' + formInfo.address.addressLine2):'') + ', ' + formInfo.address.city + ', ' + formInfo.address.state + ', ' + formInfo.address.zipCode }}</div>
            </div>
            <div class="edit-info">
              <span>Use Other Address</span>
              <img src="@/static/productDetail/rightYellow@2x.png" alt="">
            </div>
          </div>
          <Address v-if="isShow.address" @addSuccessAddress="addSuccessAddress"></Address>
        </div>
        <div class="content-info-header">Payment</div>
        <div v-if="isShow.default">
          <div class="payment-info" v-if="!isShow.pay"  @click="choosePay(formInfo.pay)">
            <div class="view-info">
              <img class="addpay-card-img" :src="formInfo.pay.logo || (load === false && defaultImg)" alt="">
              <span>. . . {{ formInfo.pay.mask }}</span>
            </div>
            <div class="edit-info">
              <span>Use Other Payment</span>
              <img src="@/static/productDetail/rightYellow@2x.png" alt="">
            </div>
          </div>
          <Pay v-if="isShow.pay" @addSuccessPay="addSuccessPay" :setDefault='isShow.pay?1:0'></Pay>
          <div class="content-info-header">Promo Code</div>
          <div class="promo-code-info">
            <el-form :model="formInfoPromo" ref="formInfoPromo" @submit.native.prevent>
              <el-form-item class="promo-code-input margin-top-8" prop="code" :rules="[{ validator: validateMobile, trigger: 'change' }]">
                <el-input class="inputCode" size="large" v-model="formInfoPromo.code" placeholder="Enter Promo Code" autocomplete="off" @input="inputCode" @clear="clearCode" clearable v-focusblurstyle></el-input>
              </el-form-item>
              <div v-if="formInfoPromo.code" class="promo-code-apply promo-opacity" @click="promoCodeApply">Apply</div>
              <div v-else class="promo-code-apply isDisabled">Apply</div>
            </el-form>
          </div>
        </div>
      </el-form>
    </div>
    <div class="content-right" v-if="isLoad.isLoadBag === false">
      <div class="content-info-header-large">
        <div>Summary</div>
        <div>{{ buyItem }} {{ buyItem===1?'Item':'Items' }}</div>
      </div>
      <div class="bag-info">
        <BuyShopProduct height="100px" width="410px" :cartData='formInfo.subCartInfoList' :editShopNumber='false' :hasRemove="false" />
      </div>
      <div class="checkout-info">
        <div class="divider-1"></div>
        <div class="price-bag"><div>Item Total</div><div>${{ formatPrice(formInfo.productAmount) }}</div></div>
        <div class="price-bag"><div>Shipping</div><div>${{ formatPrice(formInfo.deliveryAmount) }}</div></div>
        <div v-if="formInfo.discountAmount!=='' && formInfo.discountAmount!==null" class="price-bag"><div>Discount</div><div class="color-yellow">-${{ formatPrice(formInfo.discountAmount) }}</div></div>
        <div class="price-bag"><div>Tax</div><div>${{ formatPrice(formInfo.textAmount) }}</div></div>
        <div class="divider-2"></div>
        <div class="price-bag fontbold color-yellow"><div>Order Total</div><div>${{ formatPrice(formInfo.orderAmount) }}</div></div>
        <!-- <div class="return">
          <img src="@/static/return@2x.png" alt="">
          <span class="color-yellow">7 Day Return and Refund</span>
        </div> -->
      </div>
      <div v-if="this.formInfo.email && this.formInfo.address.id && this.formInfo.pay.customerId && (this.commonData.flagPlaceOrder === false)" class="btn-checkout"><div @click="placeOrder">Place Order</div></div>
      <div v-else class="btn-checkout-disabled"><div class="isDisabled">Place Order</div></div>
    </div>
    </div>
    <add-address v-if="addaddressShow" :dialogVisible.sync="addaddressShow" @close='closeDialogaddress' @usecard="useCardAddress" :modal="true" :modalAppend="true" :modalAppendDelete="true" setType="useCard" :defaultChecked="formInfo.address"/>
    <add-pay v-if="addpayShow" :dialogVisible.sync="addpayShow" @close='closeDialogaddpay' @usecard="useCardPay" :modal="true" :modalAppend="true" :modalAppendDelete="true" setType="useCard" :defaultChecked="formInfo.pay"/>
  </div>
</template>

<script>
import BuyShopProduct from "@/views/products/components/buyShopProduct";
import AddAddress from '@/components/AddAddress.vue'
import AddPay from '@/components/AddPay.vue'
import Address from '@/components/Address.vue'
import Pay from '@/components/Pay.vue'
import { queryPaymentCardList, discountApply, stripeCharge } from '@/api/stripe'
import { cartConfirmForMutilableOrder } from "@/api/cart";
import { queryAddressCardList } from '@/api/address'
import { userInfo } from '@/api/login'
import { orderCreateNew, queryOrderDetailById } from '@/api/orders'
import { formatPrice } from "@/utils/common";
export default {
  name: 'Checkout',
  components: {
    BuyShopProduct,
    AddAddress,
    AddPay,
    Address,
    Pay
  },
  data() {
    const validateEmail = (rule, value, callback) => {
      if (value !== '') {
        // eslint-disable-next-line
        let pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!(pattern.test(value))) {
          callback(new Error('Please enter a valid email address.'));
        } else { callback() }
      } else { callback() }
    };
    return {
      commonData: {
        flagPlaceOrder: false
      },
      isLoad: {
        isLoadEmail: false,
        isLoadBag: false
      },
      codeInfo: '',
      formInfo: {
        email: '',
        address: {
          firstName: '',
          lastName: '',
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          zipCode: ''
        },
        pay: {
          logo: '',
          mask: ''
        },
        productAmount: '',
        deliveryAmount: '',
        discountAmount: '',
        textAmount: '',
        orderAmount: '',
        subCartInfoList: []
      },
      formInfoPromo: {
        code: ''
      },
      validateMobile: (rule, value, callback) => {
        if(this.isDiscount===true) {
          callback('Applied.');
          this.$nextTick(()=>{
            document.querySelector('.inputCode > input').style.cssText = 'border-color: #eeeeee;';
            document.querySelector('.el-form-item__error').style.cssText = 'color: #7DD056; font-weight: 500;';
            document.querySelector('.promo-code-input').classList.remove("is-error");
          })
        }
        if(this.isDiscount===false) {
          callback(new Error(this.errorInfo));
        }
        if(this.isDiscount===undefined) {
          callback();
        }
      },
      defaultImg: require('@/static/defaultCard@2x.png'),
      rules: {
        email: [
          { required: true, message: 'Please enter email address.', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ]
      },
      addaddressShow: false,
      addpayShow: false,
      load: false,
      isDiscount: undefined,
      discountCodeId: undefined,
      isShow: {
        address: false,
        pay: false,
        default: true
      },
      errorInfo: '',
      formatPrice,
      buyItem: ''
    }
  },
  created() {
    this.getListUserInfo();
    this.getListAddress();
    this.getListBank();
    this.getListBag(true);
    this.$EventBus.$off('refreshAddress');
    this.$EventBus.$on('refreshAddress',()=>{
      this.getListAddress();
    })
    this.$EventBus.$off('refreshPay');
    this.$EventBus.$on('refreshPay',()=>{
      this.getListBank();
    })
  },
  mounted() {
  },
  methods: {
    getListUserInfo() {
      this.isLoad.isLoadEmail = true;
      userInfo({}, (res) => {
        this.formInfo.email = res.result.email;
        this.$nextTick(()=>{
          this.isLoad.isLoadEmail = false;
          document.querySelector('.inputEmail > input').style.cssText = 'background: #ffffff;';
        })
      },
      () => {
        this.isLoad.isLoadEmail = false;
      },
      () => {
        this.isLoad.isLoadEmail = false;
      })
    },
    getListAddress() {
      queryAddressCardList({
        userId: JSON.parse(localStorage.getItem('USERINFO')).id,
        curPage: 1,
        pageSize: 1
      }, (res) => {
        if(res.result.length === 1) { // && res.result[0].isDefault === 1
          this.formInfo.address = res.result[0];
          this.isShow.address = false;
        }
        if(res.result.length === 0) {
          this.isShow.address = true;
          this.isShow.default = false;
        }
      },
      () => {},
      () => {})
    },
    getListBank() {
      this.load = true;
      queryPaymentCardList( JSON.parse(localStorage.getItem('USERINFO')).id,
      (res) => {
        this.load = false;
        if(res.result.length > 0) {
          this.isShow.pay = false;
          this.formInfo.pay = res.result[0];
        }
        if(res.result.length === 0) {
          this.isShow.pay = true;
        }
      },
      () => {},
      () => {})
    },
    getListBag(isreLoad, addressId, discountCodeId) {
      if(isreLoad) { this.isLoad.isLoadBag = true; }
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      cartConfirmForMutilableOrder({
        addressId: addressId,
        discountCodeId: discountCodeId
      },
      (res) => {
        const result = res.result;
        this.formInfo.productAmount = result.productAmount;
        this.formInfo.deliveryAmount = result.deliveryAmount;
        this.formInfo.discountAmount = result.dicount;
        this.formInfo.textAmount = result.textAmount;
        this.formInfo.orderAmount = result.orderAmount;
        this.formInfo.subCartInfoList = result.subCartInfoList;
        {  // 购物车总数量
          let bagProducts = [];
          let bagProductsNumber = 0;
          this.formInfo.subCartInfoList.forEach((item)=> {
            bagProducts = bagProducts.concat(item.userCartVoList);
          })
          bagProducts.forEach((item)=> {
            bagProductsNumber = bagProductsNumber + item.num;
          })
          this.buyItem = bagProductsNumber;
        }
        this.$nextTick(()=>{
          if(isreLoad) {
            this.isLoad.isLoadBag = false;
          }
          let fixheight = (window.innerWidth < 1330) ? (509*0.9) : 509;
          if( (document.querySelector('.buy-shop-products').clientHeight) < (window.innerHeight - fixheight) ) {
            document.querySelector('.bag-info').style.cssText = 'height: auto;'
          } else {
            document.querySelector('.bag-info').style.cssText = 'height: calc( 100% - 404px );'
          }
        });
        loading.close();
      },
      (err) => {
        this.$notify({
          title: "Oops",
          message: err.data.message,
          iconClass:'el-icon-warning-outline',
          duration: 3000,
          showClose: false
        });
        this.isLoad.isLoadBag = false;
        loading.close();
      },
      () => {
        this.isLoad.isLoadBag = false;
      })
    },
    inputCode(val) {
      this.formInfoPromo.code = val.toUpperCase();
      this.isDiscount = undefined;
      if(val === '') {
        this.clearCode();
      }
    },
    clearCode() {
      this.discountCodeId = undefined;
      this.getListBag(false);
      this.isDiscount = undefined;
      this.$refs['formInfoPromo'].validateField("code");
    },
    promoCodeApply() {
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      discountApply({
        amount: this.formInfo.productAmount,
        code: this.formInfoPromo.code
      },
      (res) => {
        this.getListBag(false, undefined, res.data.discountCodeId);
        this.discountCodeId = res.data.discountCodeId;
        this.isDiscount = true;
        this.$refs['formInfoPromo'].validateField("code");
        loading.close();
      },
      (err) => {
        this.getListBag(false);
        this.discountCodeId = undefined;
        this.isDiscount = false;
        this.errorInfo = err.data.message;
        this.$refs['formInfoPromo'].validateField("code");
        loading.close();
      },
      () => {})
    },
    placeOrder() {
      this.$refs['formInfo'].validate((valid) => {
        if (valid) {
          let bagProducts = [];
          let bagProductsAll = [];
          let bagProductsAllMaidian = [];
          this.formInfo.subCartInfoList.forEach((item)=> {
            bagProducts = bagProducts.concat(item.userCartVoList);
          })
          bagProducts.forEach((item)=> {
            bagProductsAll.push({
              productId: item.productId,
              num: item.num,
              price: item.price,
              promotionPrice: item.promotionPrice,
              skuId: item.skuId
            })
          })
          bagProducts.forEach((item, index)=> {
            bagProductsAllMaidian.push({
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
          const loading = this.$loading({
            lock: true,
            text: '',
            spinner: 'el-icon-loading',
            background: 'rgba(51, 51, 51, 0.25)'
          });
          this.commonData.flagPlaceOrder = true;
          if(this.commonData.flagPlaceOrder) {
            orderCreateNew({
              addressId: this.formInfo.address.id,
              discountCodeId: this.discountCodeId,
              email: this.formInfo.email,
              skuList: bagProductsAll
            },
            (resCreateNew) => {
              queryOrderDetailById({
                orderId: resCreateNew.result.orderId
              },
              () => {
                stripeCharge({
                  currency: 'usd',
                  customerId: this.formInfo.pay.customerId,
                  orderId: resCreateNew.result.orderId
                },
                (resCharge) => {
                  if(resCharge.success) {
                    setTimeout(() => {
                      this.commonData.flagPlaceOrder = false;
                    }, 300);
                    console.log('第14个埋点------Sample_from_App-----');
                    let uuId = JSON.parse(localStorage.getItem('USERINFO'))?JSON.parse(localStorage.getItem('USERINFO')).uuId:undefined;
                    this.$gtm.trackEvent({
                      event: 'purchase',
                      userId: uuId,
                      ecommerce: {
                        transaction_id: resCreateNew.result.orderId,
                        affiliation: 'Sample_from_App',
                        value: this.formInfo.orderAmount, // 付款的总价
                        tax: this.formInfo.textAmount,
                        shipping: this.formInfo.deliveryAmount,
                        currency: 'USD',
                        coupon: this.formInfoPromo.code,
                        items: bagProductsAllMaidian
                      }
                    });
                    this.$EventBus.$emit("searchCartNumber");
                    this.$store.commit('layout/SET_ShowCheckoutSuccess', true);
                    this.$EventBus.$emit('showSuccess');
                    this.$router.push({path: '/'});
                  }
                  loading.close();
                },
                (err) => {
                  loading.close();
                  this.commonData.flagPlaceOrder = false;
                  this.$notify({ title: "Oops", message: err.data.message, iconClass:'el-icon-warning-outline', duration: 3000, showClose: false });
                },
                () => {})
              },
              (err) => {
                loading.close();
                this.commonData.flagPlaceOrder = false;
                this.$notify({ title: "Oops", message: err.data.message, iconClass:'el-icon-warning-outline', duration: 3000, showClose: false });
              },
              () => {})
            },
            (res) => {
              loading.close();
              this.commonData.flagPlaceOrder = false;
              if(res.data.code == 500) {
                this.$notify({ title: "Oops", message: res.data.message, iconClass:'el-icon-warning-outline', duration: 3000, showClose: false })
                this.getListBag(false);
              }
            },
            () => {})
          }
        } else {
          return false;
        }
      })
    },
    chooseAddress() {
      this.addaddressShow = true;
    },
    choosePay() {
      this.addpayShow = true;
    },
    closeDialogaddress(val) {
      if(Object.keys(val).length === 0) { this.getListAddress(); }
      this.addaddressShow = false;
    },
    closeDialogaddpay(val) {
      if(Object.keys(val).length === 0) { this.getListBank(); }
      this.addpayShow = false;
    },
    useCardAddress(val) {
      this.addaddressShow = false;
      this.formInfo.address = val;
    },
    useCardPay(val) {
      this.addpayShow = false;
      this.formInfo.pay = val;
    },
    addSuccessAddress() {
      this.getListAddress();
      this.isShow.address = false;
      this.isShow.default = true;
    },
    addSuccessPay() {
      this.getListBank();
      this.isShow.pay = false;
    }
  }
}
</script>

<style lang="less">
  .checkout {
    padding: 40px 0 0 0;
    // display: flex;
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
    .checkout-container {
      display: flex;
      max-width: 1320px;
      box-sizing: border-box;
      margin: 0 auto;
    }
    .margin-top-8 {
      margin-top: 8px;
    }
    .margin-8-0 {
      margin: 8px 0;
    }
    .isDisabled {
      opacity: 0.1;
    }
    .content-info-header-large {
      display: inline-flex;
      align-items: center;
      & > div {
        display: inline-block;
      }
      & > div:first-child {
        font-weight: bold;
        font-size: 24px;
      }
      & > div:nth-child(2) {
        margin-left: 16px;
        font-size: 14px;
        font-weight: 500;
        line-height: 19px;
        color: #979797;
      }
    }
    .content-left {
      width: calc( 100% - 490px );
      max-width: 700px;
      min-width: 330px;
      display: inline-block;
      .content-info-header {
        font-weight: bold;
        font-size: 18px;
        margin-top: 24px;
      }
      input {
        height: 48px;
        border-radius: 8px;
        border: 1px solid #eeeeee;
        padding: 0 16px;
      }
      .common-card {
        padding: 10px 16px;
        box-sizing: border-box;
        display: inline-flex;
        align-items: center;
      }
      .el-form-item {
        margin-bottom: 16px;
      }
      .view-info {
        width: calc( 100% - 184px );
      }
      .edit-info {
        text-align: right;
        width: 184px;
        color: #C79618;
        img {
          height: 10px;
          margin-left: 10px;
        }
      }
      .shipping-info {
        input {
          font-weight: 500;
        }
        // input.no-empty {
        //   background: #fff;
        // }
        // input.is-focus {
        //   filter: drop-shadow(0px 0px 20px rgba(51, 51, 51, 0.15));
        // }
        .shipping-info-address {
          cursor: pointer;
          width: 100%;
          height: 56px;
          border: 1px solid #eeeeee;
          box-sizing: border-box;
          border-radius: 8px;
          .common-card();
          & > div.view-info {
            width: calc( 100% - 184px );
            & > div {
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              width: 100%;
            }
            & > div:first-child {
              font-weight: 600;
            }
          }
        }
      }
      .payment-info {
        margin-top: 8px;
        cursor: pointer;
        width: 100%;
        height: 48px;
        border: 1px solid #eeeeee;
        box-sizing: border-box;
        border-radius: 8px;
        .common-card();
        & > div.view-info {
          & > img.addpay-card-img {
            height: 25px;
            vertical-align: middle;
          }
          & > span {
            margin-left: 16px;
            font-weight: 500;
          }
        }
      }
      .promo-code-info {
        .promo-code-input {
          display: inline-block;
          width: calc( 100% - 96px );
          margin-bottom: 4px;
          .el-form-item__error {
            width: 330px;
            margin-top: 4px;
          }
        }
        .promo-code-apply {
          cursor: pointer;
          display: inline-block;
          margin-left: 16px;
          width: 80px;
          height: 40px;
          line-height: 40px;
          border-radius: 20px;
          background: #333333;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
          color: #ffffff;
          font-weight: 500;
          font-size: 14px;
          text-align: center;
        }
        .promo-opacity:hover { opacity: 0.6 }
        .promo-opacity:active { opacity: 0.8 }
        .code-info {
          font-size: 12px;
        }
      }
    }
    .content-right {
      width: 410px;
      display: inline-block;
      margin-left: 80px;
      .bag-info::-webkit-scrollbar-thumb {
        visibility: inherit !important;
      }
      .bag-info {
        // height: calc( 100% - 369px );
        height: calc( 100% - 404px );
        min-height: 140px;
        margin: 24px 0 0 0;
        overflow: overlay;
        // overflow: auto;
        box-sizing: border-box;
        .sold-out {
          bottom: 2px !important;
          transform: translateX(-50%);
          white-space: nowrap;
          font-weight: 500 !important;
          font-size: 12px !important;
          height: 16px;
          line-height: 16px !important;
          padding: 2px 2px !important;
        }
      }
      .checkout-info {
        // height: 311.5px;
        // height: 346.5px;
        height: 232.5px;
      }
      .price-bag {
        font-weight: 500;
        display: inline-flex;
        width: 100%;
        margin-top: 16px;
        & > div:first-child {
          width: calc( 100% - 100px );
        }
        & > div:nth-child(2) {
          width: 100px;
          text-align: right;
        }
      }
      .divider-1 {
        border-top: 1px solid #EEEEEE;
      }
      .divider-2 {
        margin-top: 16px;
        border-top: 1px solid #EEEEEE;
      }
      .return {
        margin-top: 16px;
        display: inline-flex;
        align-items: center;
        & > img {
          height: 18px;
        }
        & > span {
          margin-left: 8px;
        }
      }
      .color-yellow {
        color: #C79618;
      }
      .fontbold {
        font-weight: bold;
        font-size: 16px;
      }
      // @media only screen and (min-height: 798px) { //最小高度798px
      //   .btn-checkout, .btn-checkout-disabled {
      //     position: absolute;
      //     bottom: 0;
      //   }
      // }
      .btn-checkout, .btn-checkout-disabled {
        position: absolute;
        bottom: 0;
        padding: 24px 35px 40px 35px;
        display: inline-flex;
        justify-content: center;
        background: #ffffff;
        & > div {
          cursor: pointer;
          width: 340px;
          height: 50px;
          line-height: 50px;
          background: #C79619;
          border-radius: 25px;
          font-weight: 500;
          font-size: 20px;
          color: #FFFFFF;
          text-align: center;
        }
      }
      .btn-checkout > div:hover { opacity: 0.6; }
      .btn-checkout > div:active { opacity: 0.8; }
    }
    @import "../../styles/inputPay.less";
  }
</style>