<template>
  <div class="orders-detail" v-if="!isLoad">
    <div class="order-detail-title">
      <div class="title-img" @click="btnPrevious()">
        <div><img :src="backIcon" alt=""></div>
      </div>
      {{ (detailInfo.status === 1&&isCheck)?'Checkout':'Order Details' }}
    </div>
    <div class="order-detail-cardinfo">
      <div class="order-detail-cardinfo-left">
        <div :style="`display:flex; align-items:center; margin-left:${detailInfo.type===4?'56px':'0'}`">
          Order Number:&nbsp;{{ detailInfo.billNo }}
          <img class="copy-order" @click="shareInvitationCode(detailInfo.billNo,{tip:'Your order number has been copied.'})" src="@/static/copy@2x.png" alt="">
        </div>
        <div :style="`display:${detailInfo.type===4?'block':'none'};margin-left:${detailInfo.type===4?'56px':'0'}`">Shopify Order:&nbsp;#{{ detailInfo.outNo }}</div>
        <div :style="`margin-left:${detailInfo.type===4?'56px':'0'}`">Order Placed:&nbsp;{{ this.$moment.unix(detailInfo.createTimeT).format('ll') }}</div>
        <div v-if="detailInfo.payTime" :style="`margin-left:${detailInfo.type===4?'56px':'0'}`">Order Paid:&nbsp;{{ this.$moment(detailInfo.payTime).format('ll') }}</div>
        <img v-if="detailInfo.type===4" src="@/static/shopify@2x.png" alt="">
      </div>
      <div class="order-detail-cardinfo-right">
        <div>Shipping Address</div>
        <div class="order-detail-cardinfo-right-name">{{ detailInfo.firstName + '&nbsp;' + detailInfo.lastName }}</div>
        <div>{{ detailInfo.addressLine1 }} {{ (detailInfo.addressLine2)?',&nbsp;':'' }} {{ detailInfo.addressLine2 }}</div>
        <div>{{ detailInfo.city + ',&nbsp;' + detailInfo.state + '&nbsp;' + detailInfo.zipCode }}</div>
        <div class="order-detail-cardinfo-right-top">Phone Number: {{ detailInfo.phoneNumber }}</div>
        <div>Email: {{ detailInfo.email }}</div>
      </div>
    </div>
    <!-- <div class="common-card dialog-detail-orderinfo">
        <div :style="`display:flex; align-items:center; margin-left:${detailInfo.type===4?'80px':'24px'}`">
          Order Number:&nbsp;{{ detailInfo.billNo }}
          <img class="copy-order" @click="shareInvitationCode(detailInfo.billNo,{tip:'Your order number has been copied.'})" src="@/static/copy@2x.png" alt="">
        </div>
        <div :style="`display:${detailInfo.type===4?'block':'none'};margin-left:${detailInfo.type===4?'80px':'24px'}`">Shopify Order:&nbsp;#{{ detailInfo.outNo }}</div>
        <div :style="`margin-left:${detailInfo.type===4?'80px':'24px'}`">Order Placed:&nbsp;{{ this.$moment.unix(detailInfo.createTimeT).format('ll') }}</div>
        <div>Shipping Address</div>
        <div>{{ detailInfo.firstName + '&nbsp;' + detailInfo.lastName }}</div>
        <div>{{ detailInfo.addressLine1 }} {{ (detailInfo.addressLine2)?',&nbsp;':'' }} {{ detailInfo.addressLine2 }}</div>
        <div>{{ detailInfo.city + ',&nbsp;' + detailInfo.state + '&nbsp;' + detailInfo.zipCode }}</div>
        <div>Phone Number: {{ detailInfo.phoneNumber }}</div>
        <div>Email: {{ detailInfo.email }}</div>
        <img v-if="detailInfo.type===4" src="@/static/shopify@2x.png" alt="">
    </div> -->
    <div class="content-info-header-large">
      <div>Products</div>
      <div v-if="buyItem!==''">{{ buyItem }} {{ (buyItem===1)?'Item':'Items' }}</div>
    </div>
    <div class="common-card dialog-detail-products">
      <div class="detail-products-item" :style="`border-top:${(detailInfo.status === 1&&isCheck)?'none':'1px solid #EAEAEA'}`" v-for="(item, index) in detailInfo.detailList" :key="index">
        <div class="item-header" :style="`display:${(detailInfo.status === 1&&isCheck)?'none':'inline-flex'}`">
          <div class="item-left">{{ (item.statusRemark==='Unpaid'&&isCheck)?'Products':item.statusRemark }}</div>
          <div class="item-right">
            <div v-if="(item.statusRemark==='Paid') && (item.platform !== 1)" class="item-btn-cancel" @click="cancelBtn(item)">Cancel</div>
            <div v-if="(item.statusRemark==='Shipped' || item.statusRemark==='Delivered') && (item.platform !== 1) && (item.canReturn === 1)" class="item-btn-cancel" @click="returnBtn(item)">Return</div>
            <div class="item-btn-track" v-if="item.printFlag===1">
              <div v-if="!item.trackUrl&&!item.internationalTrackUrl" @click="trackUrlTip()">Track</div>
              <!-- <a v-if="item.trackUrl" :href="item.trackUrl" target="_blank">Track</a> -->
                <a v-if="item.trackUrl||item.internationalTrackUrl" @click.prevent="showParentModul(item)" target="_blank">Track</a>
            </div>
          </div>
        </div>
        <div class="item-content" v-for="(itemVo, indexVo) in item.detailVoList" :key="indexVo" @click="productViewDetail(itemVo)">
          <!-- orderdetail下有‘Adjusted且库存为0则图片是置灰’，checkout下库存为0或下架则图片是置灰 -->
          <!-- <div class="item-content-img" :style="`opacity:${((((itemVo.onlineStatus===0)||(itemVo.stockCount===0))&&(detailInfo.status===1)&&isCheck) || ((itemVo.num!==itemVo.planNum)&&(itemVo.num===0)&&(!isCheck)))?0.3:1}`"> -->
          <div class="item-content-img" :style="`opacity:${((((itemVo.onlineStatus===0)||(itemVo.stockCount===0))&&(detailInfo.status===1)&&isCheck&&(detailInfo.type===4)))?0.3:1}`">
            <img v-imgError :src="itemVo.skuImage?itemVo.skuImage:'@/static/littleImgError@2x.png'" alt="">
            <div class="refunded" v-if="itemVo.refunded === 1">Refunded</div>
            <!-- <div v-if="((itemVo.onlineStatus === 0) || (itemVo.stockCount === 0)) && (detailInfo.status === 1) && isCheck">Sold Out</div> -->
            <!-- <div v-if="((itemVo.onlineStatus === 1) && (itemVo.stockCount < itemVo.num) && (itemVo.stockCount !== 0)) && (detailInfo.status === 1) && isCheck">Out of Stock</div> -->
          </div>
          <div class="item-descr">
            <div class="">{{ (itemVo.brand?(itemVo.brand + '&nbsp;'):'') + itemVo.title }}</div>
            <div>{{itemVo.dimensionValues && Object.keys(itemVo.dimensionValues).length ? Object.values(itemVo.dimensionValues).join(',') : '' }}</div>
            <div>
              Quantity: <span :class="{'item-descr-line': (itemVo.num !== itemVo.planNum)}">{{ itemVo.planNum }}</span>
              <span class="item-descr-adjusted" v-if="(itemVo.num !== itemVo.planNum) && ((itemVo.num === itemVo.stockCount && isCheck) || (!isCheck))">Adjusted Quantity: {{ itemVo.num }}</span>
            </div>
            <div class="item-descr-stock" v-if="((itemVo.onlineStatus === 1) && (itemVo.stockCount < itemVo.num)) && (detailInfo.status === 1) && isCheck && (detailInfo.type===4)">Product is low in stock/out of stock, reduce the quantity to checkout.</div>
            <div class="item-descr-price price-line-through" v-if="itemVo.price !== itemVo.actPrice"><span>${{ formatPrice(itemVo.price) }}</span></div>
            <div class="item-descr-price"><span>${{ formatPrice(itemVo.actPrice) }}</span></div>
          </div>
          <div class="item-numbers" @click.stop v-if="((itemVo.onlineStatus === 1) && (itemVo.stockCount < itemVo.num)) && (detailInfo.status === 1) && isCheck && (detailInfo.type===4)">
            <div class="item-numbers-quantity">Quantity</div>
            <div class="prune-number" @click.stop>
              <i class="el-icon-remove circle" @click.stop="addShopStock('remove', itemVo)"></i>
              <span class="shop-numbers">{{ itemVo.num }}</span>
              <i class="el-icon-circle-plus circle" :class="{disable: true}"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="detailInfo.status === 1 && isCheck" class="common-card dialog-detail-payment">
      <div>Payment</div>
      <div>
        <span>Email</span>
        <span class="dialog-detail-payment-email">{{ email || 'Enter email address' }}
        </span>
      </div>
      <div><span>Pay with</span><span @click="inputPay(payInfo)">{{ (payInfo.mask?(payInfo.officialName+'-'+payInfo.mask):'') || 'Select payment method' }}<i class="el-icon-arrow-right"></i></span></div>
    </div>
    <div class="common-card dialog-detail-amount">
      <div class="amount-padding amount-summary">Order Summary</div>
      <div class="amount-padding amount-item-total"><span>Item Total</span><span>${{ formatPrice(detailInfo.totalAmount) }}</span></div>
      <div class="amount-padding amount-shipping"><span>Shipping</span><span>${{ formatPrice(detailInfo.shippingMethodVo.deliveryFee) }}</span></div>
      <div class="amount-padding amount-discount" :style="`display:${(detailInfo.couponAmount===0)?'none':'block'}`"><span>Discount</span><span>-${{ formatPrice(detailInfo.couponAmount) }}</span></div>
      <div class="amount-padding amount-tax"><span>Tax</span><span>$0.00</span></div>
      <div class="amount-order-total"><span>Order Total</span><span>${{ formatPrice(detailInfo.payAmount) }}</span></div>
      <div class="amount-support"><img src="@/static/emailUs@2x.png" alt="">Have questions? Email us at support@trendsi.com</div>
    </div>
    <div v-if="detailInfo.status === 1 && isCheck" class="common-card dialog-detail-total">
      <div>
        <div v-if="commonData.flagPlaceOrder || (formatPrice(detailInfo.totalAmount)==='0.00')" class="isDisabled">Place Order</div>
        <div v-else @click="placeOrder(detailInfo)">Place Order</div>
      </div>
    </div>
    <el-dialog class="dialog-cancelBtn" title="Cancel Order" width="300px" :visible.sync="dialogFormVisibleCancel" center @close="closeDialogCancel">
      <div><span>Are you sure you want to cancel this order?</span></div>
      <div slot="footer" class="dialog-footer">
        <div class="dialog-btntext" @click="dialogCancelBtn()">Cancel Order</div>
        <div class="dialog-btntext dialog-cancel" @click="dialogFormVisibleCancel=false">Never Mind</div>
      </div>
    </el-dialog>
    <AddPay v-if="addpayShow" :dialogVisible.sync="addpayShow" @close='closeDialogaddpay' @usecard="useCardPay" :modal="true" :modalAppend="true" :modalAppendDelete="true" setType="useCard" :defaultChecked="payInfo" />
    <InputPay v-if="inputpayShow" :dialogVisible.sync="inputpayShow" @close='inputpayShow=false' @closeSave="inputpayClose" />
    <OrderTrack :trackData='trackData' :orderTrackVisible.sync='orderTrackVisible' />
  </div>
</template>

<script>
import { queryOrderDetailById, cancelOrderById, checkShopifyOrderCanBePayment, autoCheckoutPay, orderLessSku } from "@/api/orders";
import { stripeCharge, queryPaymentCardList } from "@/api/stripe";
import { formatPrice } from "@/utils/common";
import Share from '@/mixins/share';
import AddPay from '@/components/AddPay.vue';
import InputPay from '@/components/InputPay.vue';
import OrderTrack from '../components/orderTrack.vue';

export default {
  name: 'ordersDetail',
  mixins: [Share],
  components: {
    AddPay,
    InputPay,
    OrderTrack
  },
  data() {
    return {
      backIcon: require('@static/backPrevious.png'),
      isLoad: false,
      promiseInfo: null,
      detailInfo: {
        shippingMethodVo: ''
      },
      formatPrice,
      isCheck: JSON.parse(this.$route.query.isCheck),
      email: JSON.parse(localStorage.getItem('USERINFO')).email,
      payInfo: {},
      addpayShow: false,
      inputpayShow: false,
      trackData: {},
      orderTrackVisible: false,
      dialogFormVisibleCancel: false,
      buyItem: '',
      commonData: {
        flagPlaceOrder: false,
        flagTurnOff: false,
        flagAddPayment: false,
        isUnpaid: undefined
      },
    }
  },
  methods: {
    getDetailList(valId, isLoad=false) {
      this.isLoad = isLoad;
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      this.promiseInfo = new Promise((resolve, reject) => {
        queryOrderDetailById({
          orderId: valId
        },
        (res) => {
          this.isLoad = false;
          this.commonData.flagPlaceOrder = false;
          loading.close();
          resolve(res.result);
          let result = res.result;
          let listcardsResult = {};
          let mobile = result.addressVO.phoneNumber?result.addressVO.phoneNumber:'';
          let mobileResult = mobile
            ? mobile.substring(0,2)+'('+mobile.substring(2,5)+')'+mobile.substring(5,8)+'-'+mobile.substring(8)
            : '';
          listcardsResult = Object.assign({}, result, {
            firstName: result.addressVO.firstName,
            lastName: result.addressVO.lastName,
            phoneNumber: mobileResult,
            addressLine1: result.addressVO.addressLine1,
            addressLine2: result.addressVO.addressLine2,
            city: result.addressVO.city,
            state: result.addressVO.state,
            zipCode: result.addressVO.zipCode
          });

          // listcardsResult.detailList.sort(function(itema, itemb){
          //   return (
          //     (itemb.detailVoList.sort(function(a, b){
          //       return ((b.onlineStatus === 1) && (b.stockCount < b.num)) - ((a.onlineStatus === 1) && (a.stockCount < a.num));
          //     }))
          //     -
          //     (itema.detailVoList.sort((c, d) => {
          //       return ((d.onlineStatus === 1) && (d.stockCount < d.num)) - ((c.onlineStatus === 1) && (c.stockCount < c.num));
          //     }))
          //   )
          // })

          // 排序
          let self = this;
          if(this.isCheck) {
            listcardsResult.detailList.forEach(function(item){
              item.detailVoList.sort(function(a, b){
                return ((b.onlineStatus === 1) && (b.stockCount < b.num)) - ((a.onlineStatus === 1) && (a.stockCount < a.num));
              })
              item.detailVoList.forEach(function(itemVo){
                if((itemVo.onlineStatus === 1) && (itemVo.stockCount < itemVo.num) && ( listcardsResult.type === 4)) {
                  Object.assign(item, {flag: true})
                  self.commonData.flagPlaceOrder = true;
                }
              })
            })
            listcardsResult.detailList.sort(function(c, d){
              return (d.flag===true) - (c.flag===true);
            })
            this.detailInfo = listcardsResult;
          } else {
            this.detailInfo = listcardsResult;
          }

          {  // 订单商品总数量
            let bagProducts = [];
            let bagProductsNumber = 0;
            this.detailInfo.detailList.forEach((item)=> {
              bagProducts = bagProducts.concat(item.detailVoList);
            })
            bagProducts.forEach((item)=> {
              bagProductsNumber = bagProductsNumber + item.num;
            })
            this.buyItem = bagProductsNumber;
          }
          if(this.detailInfo.status === 1&&this.isCheck) {
            this.$nextTick(()=>{
              document.querySelectorAll('.dialog-detail-products > .detail-products-item')[0].style.cssText = "padding-top: 24px;";
            })
          }
        },
        (err) => {
          this.isLoad = false;
          loading.close();
          reject(err)
        },
        () => {
          this.isLoad = false;
          loading.close();
        })
      })
    },
    cancelBtn(val, istrue) {
      this.dialogFormVisibleCancel = true;
      this.operateOrderId = val.orderId || val.id;
      this.commonData.isUnpaid = istrue;
    },
    returnBtn(val) {
      // window.open('https://trendsi.typeform.com/to/zQvUbJNA?typeform-source=help.trendsi.com','_blank');
      this.$router.push({
        path: `/orders/detail/return/${val.orderId}`,
      })
      console.log(11111, val.orderId);
    },
    getListCard() {
      this.promiseInfoPayCard = new Promise((resolve, reject) => {
        queryPaymentCardList( JSON.parse(localStorage.getItem('USERINFO')).id,
        (res) => {
          const result = res.result;
          resolve(result);
          this.payInfo = result[0]?result[0]:{};
        },
        (err) => {
          reject(err)
        },
        () => {})
      })
    },
    useCardPay(val) {
      this.addpayShow = false;
      this.payInfo = val;
    },
    closeDialogaddpay(val) {
      if(Object.keys(val).length === 0) { this.getListCard(); }
      this.addpayShow = false;
    },
    inputPay() {
      this.addpayShow = true;
    },
    dialogCheckoutBtn() {
      this.inputpayShow = true;
    },
    inputpayClose() {
      this.commonData.flagAddPayment = true;
      this.dialogFormVisibleCheckout = false;
      this.inputpayShow = false;
      this.SET_AutoCheckout(true);
      autoCheckoutPay({ autoPay: this.autoCheckout?1:0 }, () => {
        this.$notify({
          title: "Card Added",
          message: 'The card has been added.',
          iconClass:'el-icon-circle-check',
          duration: 3000,
          showClose: false
        });
      },
      () => {},
      () => {})
    },
    showParentModul(valSub) {
      const trackUrl = valSub.internationalTrackUrl&&valSub.trackUrl;
      const url = valSub.internationalTrackUrl||valSub.trackUrl;
      if (trackUrl) {
        this.trackData = valSub;
        this.orderTrackVisible = true;
      } else {
        window.open(url,'_blank')
      }
    },
    closeDialogCancel() {
      this.dialogFormVisibleCancel = false;
    },
    dialogCancelBtn() {
      // this.curPage = 1;
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      cancelOrderById({
        orderId: this.operateOrderId
      },() => {
        loading.close();
        this.dialogFormVisibleCancel = false;
        if(this.commonData.isUnpaid) {
          this.$notify({
            title: "Order Cancelled",
            message: 'Your order has been canceled',
            iconClass:'el-icon-circle-check',
            duration: 3000,
            showClose: false
          });
          // { // 后端有延迟，前端手动改unpaidNumb
          //   if(this.unpaidNumb-1 < 1) {
          //     this.$EventBus.$emit("isUnpaidShow", true);
          //   }
          //   this.SET_UnPaidNum(this.unpaidNumb-1);
          // }
        } else {
          this.$notify({
            title: "Order Cancelled",
            message: 'Money will be refunded in 5 - 10 days',
            iconClass:'el-icon-circle-check',
            duration: 3000,
            showClose: false
          });
        }
        this.getDetailList(this.$route.params.id, false);
        // this.getList(this.curPage);
      },
      () => {
        loading.close();
        this.$notify({
					title: "Oops",
					message: 'Unable to cancel the order. Please try again later.',
					iconClass:'el-icon-warning-outline',
					duration: 3000,
					showClose: false
        });
      },
      () => {})
    },
    addShopStock(type, itemVo) {
      orderLessSku({
        "billNo": this.detailInfo.billNo,
        "num": itemVo.num,
        "orderId": itemVo.orderId,
        "skuId": itemVo.skuId
      },
      (res) => {
        console.log(res);
        this.getDetailList(this.$route.params.id, false);
      },
      (err) => {
        console.log(err);
      },
      () => {})
    },
    productViewDetail(val) {
      if(val.onlineStatus === 0) { // 下架商品不可点进入详情
        return false;
      } else {
        if(this.$route.fullPath !== `/products/detail?id=${val.productId}`) {
          const routeData = this.$router.resolve({
            path: "/products/detail",
            query: {
              id: val.productId,
              ref_pv_id: this.$route.params.pv_id
            },
          });
          window.open(routeData.href, '_blank')
        }
      }
    },
    placeOrder(val) {
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      this.commonData.flagPlaceOrder = true;
      if(this.commonData.flagPlaceOrder && (this.detailInfo.type === 1)) {
        stripeCharge({
          currency: 'usd',
          customerId: this.payInfo.customerId,
          orderId: val.id,
          email: this.email
        },
        (resCharge) => {
          if(resCharge.success) {
            let commonOne = [];
            let commonTwo = [];
            val.detailList.forEach(item=>{
              commonOne = commonOne.concat(item.detailVoList)
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
            console.log('第13个埋点------Shopify_Store-----', val);
            let InfoOne = val;
            this.$gtm.trackEvent({
              event: 'purchase',
              userId: JSON.parse(localStorage.getItem('USERINFO')).uuId,
              ecommerce: {
                transaction_id: InfoOne.id, // order Id
                affiliation: 'Shopify_Store',
                value: InfoOne.payAmount, // 付款的总价
                tax: '0.00',
                shipping: val.shippingMethodVo.deliveryFee,
                currency: 'USD',
                coupon: '',
                items: commonTwo
              }
            });
            // this.DialogVisibleOrderDetail = false;
            // this.dialogVisibleSuccess = true;
            // this.listcards.forEach((item, index)=>{ // 后端有延迟，前端手动改数据
            //   if(item.id === val.id) {
            //     item.status = 3;
            //     item.subDetailList.forEach((key)=>{
            //       key.statusRemark = 'Paid';
            //     })
            //     if(this.status) {
            //       this.listcards.splice(index, 1);
            //     }
            //   }
            // })
            // {
            //   if(this.unpaidNumb-1 < 1) {
            //     this.$EventBus.$emit("isUnpaidShow", true);
            //   }
            //   this.SET_UnPaidNum(this.unpaidNumb-1);
            // }
            setTimeout(() => {
              this.commonData.flagPlaceOrder = false;
            }, 300);
            this.$store.commit('layout/SET_ShowCheckoutSuccess', true);
            this.$EventBus.$emit('showSuccess');
            this.$router.push({path: '/orders'});
          }
          loading.close();
        },
        (err) => {
          loading.close();
          this.commonData.flagPlaceOrder = false;
          this.$notify({
            title: "Oops",
            message: err.data.message,
            iconClass:'el-icon-warning-outline',
            duration: 3000,
            showClose: false
          });
          this.getDetailList(val.id, false);
        },
        () => {})
      }
      if(this.commonData.flagPlaceOrder && (this.detailInfo.type === 4)) {
        checkShopifyOrderCanBePayment(val.id,
        (res) => {
          loading.close();
          if(res.success) {
            stripeCharge({
              currency: 'usd',
              customerId: this.payInfo.customerId,
              orderId: val.id,
              email: this.email
            },
            (resCharge) => {
              if(resCharge.success) {
                let commonOne = [];
                let commonTwo = [];
                val.detailList.forEach(item=>{
                  commonOne = commonOne.concat(item.detailVoList)
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
                console.log('第13个埋点------Shopify_Store-----', val);
                let InfoOne = val;
                this.$gtm.trackEvent({
                  event: 'purchase',
                  userId: JSON.parse(localStorage.getItem('USERINFO')).uuId,
                  ecommerce: {
                    transaction_id: InfoOne.id, // order Id
                    affiliation: 'Shopify_Store',
                    value: InfoOne.payAmount, // 付款的总价
                    tax: '0.00',
                    shipping: val.shippingMethodVo.deliveryFee,
                    currency: 'USD',
                    coupon: '',
                    items: commonTwo
                  }
                });
                // this.DialogVisibleOrderDetail = false;
                // this.dialogVisibleSuccess = true;
                // this.listcards.forEach((item, index)=>{ // 后端有延迟，前端手动改数据
                //   if(item.id === val.id) {
                //     item.status = 3;
                //     item.subDetailList.forEach((key)=>{
                //       key.statusRemark = 'Paid';
                //     })
                //     if(this.status) {
                //       this.listcards.splice(index, 1);
                //     }
                //   }
                // })
                // {
                //   if(this.unpaidNumb-1 < 1) {
                //     this.$EventBus.$emit("isUnpaidShow", true);
                //   }
                //   this.SET_UnPaidNum(this.unpaidNumb-1);
                // }
                setTimeout(() => {
                  this.commonData.flagPlaceOrder = false;
                }, 300);
                this.$store.commit('layout/SET_ShowCheckoutSuccess', true);
                this.$EventBus.$emit('showSuccess');
                this.$router.push({path: '/orders'});
              }
              loading.close();
            },
            (err) => {
              loading.close();
              this.commonData.flagPlaceOrder = false;
              this.$notify({
                title: "Oops",
                message: err.data.message,
                iconClass:'el-icon-warning-outline',
                duration: 3000,
                showClose: false
              });
              this.getDetailList(val.id, false);
            },
            () => {})
          }
        },
        (err) => {
          loading.close();
          this.commonData.flagPlaceOrder = false;
          this.$notify({
            title: "Oops",
            message: err.data.message,
            iconClass:'el-icon-warning-outline',
            duration: 3000,
            showClose: false
          });
          this.getDetailList(val.id, false);
        },
        () => {})
      }
    },
    trackUrlTip() {
      this.$notify({
        title: "Oops",
        message: 'Your tracking number is not available yet.',
        iconClass:'el-icon-warning-outline',
        duration: 3000,
        showClose: false
      });
    },
    btnPrevious() {
      this.$router.go(-1);
    },
  },
  created() {
    this.getDetailList(this.$route.params.id, true);
    this.getListCard();
  }
}
</script>

<style lang="less">
  .orders-detail {
    max-width: 840px;
    margin: 0 auto;
    margin-top: 40px;
    .order-detail-title {
      font-weight: bold;
      font-size: 24px;
      margin-bottom: 24px;
      text-align: center;
      .title-img {
        float: left;
        cursor: pointer;
        height: 33px;
        display: inline-flex;
        align-items: center;
        & > div {
          line-height: 20px;
          height: 20px;
          width: 20px;
          background: #FFFFFF;
          border-radius: 20px;
          & >img {
            vertical-align: text-top;
            width: 20px;
            height: 20px;
          }
        }
        & > div:hover {
          background: #EEEEEE;
        }
      }
    }
    .order-detail-cardinfo {
      width: 100%;
      .order-detail-cardinfo-left, .order-detail-cardinfo-right {
        max-width: 400px;
        width: 100%;
        height: 178px;
        background: #ffffff;
        box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
        border-radius: 10px;
        font-size: 14px;
        padding-left: 24px;
        padding-top: 16px;
        box-sizing: border-box;
        display: inline-block;
        vertical-align: top;
        margin-bottom: 16px;
        line-height: 18px;
        & > div:first-child {
          font-weight: bold;
          margin-bottom: 8px;
          display: inline-flex;
          align-items: center;
          .copy-order {
            cursor: pointer;
            margin-left: 8px;
            display: block;
            position: initial;
            width: 24px;
            height: 24px;
          }
        }
      }
      .order-detail-cardinfo-left {
        margin-right: 40px;
        position: relative;
        & > div {
          margin-bottom: 8px;
        }
        img {
          position: absolute;
          top: 36px;
          left: 24px;
        }
      }
      .order-detail-cardinfo-right {
        .order-detail-cardinfo-right-name {
          font-weight: 600;
        }
        .order-detail-cardinfo-right-top {
          margin-top: 24px;
        }
      }
    }
    .content-info-header-large {
      display: inline-flex;
      align-items: center;
      margin-bottom: 10px;
      & > div {
        display: inline-block;
      }
      & > div:first-child {
        font-weight: bold;
        font-size: 18px;
      }
      & > div:nth-child(2) {
        margin-left: 16px;
        font-size: 14px;
        font-weight: 500;
        line-height: 19px;
        color: #979797;
      }
    }
    .common-card {
      position: relative;
      background: #FFFFFF;
      border-radius: 10px;
      box-sizing: border-box;
      margin-bottom: 16px;
      box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
    }
    .common-card:last-child {
      margin-bottom: 0;
    }
    // .dialog-detail-orderinfo {
    //   position: relative;
    //   font-weight: normal;
    //   font-size: 14px;
    //   color: #333333;
    //   padding: 24px 0;
    //   box-sizing: border-box;
    //   .copy-order {
    //     cursor: pointer;
    //     margin-left: 8px;
    //     display: block;
    //     position: initial;
    //     width: 24px;
    //     height: 24px;
    //   }
    //   img {
    //     position: absolute;
    //     top: 36px;
    //     left: 24px;
    //   }
    //   div:first-child {
    //     margin: 0 0 8px 24px;
    //   }
    //   div:nth-child(2) {
    //     margin: 0 0 8px 24px;
    //   }
    //   div:nth-child(3) {
    //     margin: 0 0 24px 24px;
    //   }
    //   div:nth-child(4) {
    //     font-weight: bold;
    //     font-size: 18px;
    //     background: #F9F9F9;
    //     height: 36px;
    //     line-height: 36px;
    //     padding-left: 24px;
    //     margin-bottom: 16px;
    //     box-sizing: border-box;
    //   }
    //   div:nth-child(5) {
    //     padding-left: 24px;
    //     box-sizing: border-box;
    //     font-weight: 600;
    //   }
    //   div:nth-child(6), div:nth-child(7), div:nth-child(8), div:nth-child(9) {
    //     padding-left: 24px;
    //     box-sizing: border-box;
    //   }
    //   div:nth-child(8) {
    //     margin-top: 24px;
    //   }
    // }
    .dialog-detail-products {
      .detail-products-item:first-child {
        border-top: none !important;
        // padding-top: 24px;
      }
      .detail-products-item {
        border-top: 1px solid #EAEAEA;
        // padding-bottom: 16px;
        .item-header {
          display: inline-flex;
          align-items: center;
          margin: 24px 0 24px 24px;
          width: 100%;
          .item-left {
            font-weight: bold;
            font-size: 18px;
            color: #333333;
            width: 100px;
          }
          .item-right {
            position: absolute;
            right: 24px;
            div {
              color: #ffffff;
              text-align: center;
              height: 24px;
              line-height: 24px;
            }
            .item-btn-cancel {
              cursor: pointer;
              width: 80px;
              background: #333333;
              display: inline-block;
              border-radius: 12px;
              box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
            }
            .item-btn-track {
              margin-left: 16px;
              width: 80px;
              background: #C79818;
              display: inline-block;
              border-radius: 12px;
              box-shadow: 0px 4px 10px rgba(118, 85, 0, 0.2);
              a {
                padding: 2px 24px;
                color: #ffffff;
              }
              div {
                cursor: pointer;
              }
            }
          }
        }
        .item-content {
          margin-left: 24px;
          margin-right: 24px;
          color: #333333;
          display: flex;
          padding-bottom: 16px;
          cursor: pointer;
          & > div.item-content-img {
            position: relative;
            img {
              object-fit: cover;
              height: 120px;
              width: 80px;
              display: block;
              border-radius: 10px;
            }
            .refunded {
              position: absolute;
              bottom: 10px;
              left: 50%;
              transform: translateX(-50%);
              width: 72px;
            }
            & > div {
              background: rgba(51, 51, 51, 0.6);
              backdrop-filter: blur(10px);
              border-radius: 4px;
              font-weight: 500;
              font-size: 12px;
              color: #FFFFFF;
              text-align: center;
              // margin: -30px 4px 0;
            }
          }
          .item-descr {
            width: 100%;
            display: inline-block;
            margin: 0 0 0 16px;
            position: relative;
            div:first-child {
              font-weight: 500;
              font-size: 14px;
              line-height: 16px;
              height: 32px;
            }
            div:nth-child(2), div:nth-child(3) {
              color: #979797;
              font-weight: normal;
              font-size: 12px
            }
            // div:nth-child(2) {
            //   margin-top: 10px;
            // }
            .item-descr-price {
              position: absolute;
              bottom: 0;
              span {
                font-weight: 900;
                font-size: 12px;
              }
            }
            .item-descr-price.price-line-through {
              bottom: 18px;
              text-decoration: line-through;
              span {
                font-weight: 400;
              }
            }
            .item-descr-stock {
              color: #F363A0;
              margin-top: 8px;
            }
            .item-descr-line {
              text-decoration: line-through;
            }
            .item-descr-adjusted {
              font-weight: bold;
              color: #333333;
              margin-left: 16px;
            }
          }
          .item-numbers {
            display: flex;
            justify-content: space-between;
            align-items: end;
            padding-bottom: 8px;
            .item-numbers-quantity {
              margin-right: 22px;
              font-weight: bold;
              font-size: 14px;
            }
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
                  cursor: not-allowed;
                }
                cursor: pointer;
                font-size: 20px;
              }
            }
          }
        }
      }
      // .detail-products-item:first-child {
      //   .item-content:first-child {
      //     padding-top: 16px !important;
      //   }
      // }
    }
    .dialog-detail-amount {
      font-weight: normal;
      font-size: 14px;
      color: #333333;
      padding: 24px 0;
      margin-bottom: 136px;
      div{
        span:first-child {
          font-weight: bold;
        }
        span:last-child {
          position: absolute;
          right: 24px;
        }
      }
      .amount-padding {
        padding: 0 24px 14px;
      }
      .amount-summary {
        font-weight: bold;
        font-size: 18px;
      }
      .amount-discount {
        span:last-child {
          color: #C79618;
        }
      }
      .amount-order-total {
        height: 45px;
        line-height: 45px;
        color: #C79618;
        font-weight: 500;
        padding-left: 24px;
        background: #FCF8F1;
      }
      div.amount-support {
        font-weight: 500;
        font-size: 13px;
        margin: 24px 0 0 24px;
        img {
          width: 20px;
          height: 15px;
          padding-right: 10px;
        }
      }
      // div.amount-return {
      //   color: #C79618;
      //   margin: 24px 0 0 24px;
      //   img {
      //     width: 24px;
      //     height: 24px;
      //     padding-right: 5px;
      //   }
      //   div {
      //     vertical-align: super;
      //     display: inline-block;
      //     padding: 0;
      //   }
      // }
    }
    .dialog-detail-payment {
      padding: 24px 24px;
      .dialog-detail-payment-email {
        padding-right: 2px;
      }
      div:first-child {
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 16px;
        color: #333333;
      }
      div:nth-child(2) {
        margin-bottom: 16px;
      }
      div:nth-child(2), div:nth-child(3) {
        span:last-child {
          position: absolute;
          right: 24px;
          color: #C79618;
          i {
            font-weight: 600;
            vertical-align: middle;
          }
        }
      }
    }
    .dialog-detail-total {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0;
      padding: 24px;
      background: #ffffff;
      box-shadow: 0 0 0 0;
      border-radius: 0;
      .isDisabled {
        opacity: 0.1;
      }
      // div:first-child {
      //   span {
      //     color: #333333;
      //     font-weight: bold;
      //     font-size: 18px;
      //     margin-left: 20px;
      //   }
      //   span:last-child {
      //     position: absolute;
      //     right: 48px;
      //     color: #333333;
      //     font-weight: bold;
      //     font-size: 18px;
      //   }
      // }
      // div:nth-child(2) {
      div {
        // margin-top: 16px;
        width: 100%;
        text-align: center;
        div {
          cursor: pointer;
          display: inline-block;
          font-weight: 500;
          font-size: 20px;
          color: #FFFFFF;
          text-align: center;
          height: 48px;
          line-height: 48px;
          width: 412px;
          background: #C79619;
          // box-shadow: 0px 4px 10px rgba(118, 85, 0, 0.2);
          border-radius: 24px;
        }
      }
    }
    .dialog-cancelBtn > .el-dialog {
      margin-top: -112px !important;
      & > .el-dialog__body {
        text-align: center;
        padding: 8px 20px 16px 20px;
      }
    }
  }
</style>