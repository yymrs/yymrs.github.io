<template>
  <div class="orders">
    <div class="orders-filter ms">
      <el-radio-group v-model="filterValue" size="large">
          <el-radio-button v-for="(item, index) in filters" :label="item" :key="index" @click.prevent.native="filterClick(item)">
            <template v-if="item === 'Unpaid' && unpaidNumb > 0">
              <el-badge :value="(unpaidNumb>999)?'999+':unpaidNumb">{{ item }}</el-badge>
            </template>
          </el-radio-button>
      </el-radio-group>
      <div class="orders-auto-checkout">
        <el-switch v-model="autoCheckout" active-color="#C79818" inactive-color="#eeeeee" @change="autoCheckoutChange" :disabled="isDisabledSwitch"></el-switch>
        <span class="orders-checkout-title">Auto Checkout</span>
        <div class="orders-checkout-info">New Shopify orders will be automatically paid for using the payment method on your account, and then be fulfilled and shipped to your customers by Trendsi.</div>
      </div>
    </div>
    <div class="orders-list" ref="ordersList"><!-- infinite-scroll-distance='400' v-infinite-scroll="infiniteload" -->
      <ListCard
        :dataType="filterValue"
        @showParentModul='showParentModul'
        :inputSearch="inputSearch"
        :listcard="listcards"
        :totalPages='totalPages'
        :curPage='curPage'
        @jumpPage='jumpPage'
        @orderDetail="orderDetail"
        @orderDetailReurn="orderDetailReurn"
        @cancelbtn="cancelBtn"
        @submitFormSearch="submitFormSearch"
      />
      <div v-if="listcards.length===0 && isLoad!==true" class="no-data">
        <img src="../../static/noData@2x.png" alt="">
        <div>No orders found</div>
      </div>
      <!-- <el-backtop :bottom="100" :right="20" target=".orders-list">
        <div class="orders-top">
          <img src="../../static/top@2x.png" alt="" />
        </div>
      </el-backtop> -->
    </div>
    <!-- <el-dialog
      class="dialog-detail"
      :title="dialogTitle"
      :visible.sync="DialogVisibleOrderDetail"
      :modal-append-to-body="false"
      :modal="true"
      width="548"
      @close="closeDialogDetail"
      center>
      <div class="common-card dialog-detail-orderinfo">
        <div :style="`display:flex; align-items:center; margin-left:${detailInfo.type===4?'80px':'24px'}`">
          Order Number:&nbsp;{{ detailInfo.billNo }}
          <img class="copy-order" @click="shareInvitationCode(detailInfo.billNo,{tip:'Your order number has been copied.'})" src="../../static/copy@2x.png" alt="">
        </div>
        <div :style="`display:${detailInfo.type===4?'block':'none'};margin-left:${detailInfo.type===4?'80px':'24px'}`">Shopify Order:&nbsp;#{{ detailInfo.outNo }}</div>
        <div :style="`margin-left:${detailInfo.type===4?'80px':'24px'}`">Order Placed:&nbsp;{{ this.$moment.unix(detailInfo.createTimeT).format('ll') }}</div>
        <div>Shipping Address</div>
        <div>{{ detailInfo.firstName + '&nbsp;' + detailInfo.lastName }}</div>
        <div>{{ detailInfo.addressLine1 }} {{ (detailInfo.addressLine2)?',&nbsp;':'' }} {{ detailInfo.addressLine2 }}</div>
        <div>{{ detailInfo.city + ',&nbsp;' + detailInfo.state + '&nbsp;' + detailInfo.zipCode }}</div>
        <div>Phone Number: {{ detailInfo.phoneNumber }}</div>
        <div>Email: {{ detailInfo.email }}</div>
        <img v-if="detailInfo.type===4" src="../../static/shopify@2x.png" alt="">
      </div>
      <div class="common-card dialog-detail-products">
        <div class="detail-products-item" v-for="(item, index) in detailInfo.detailList" :key="index">
          <div class="item-header">
            <div class="item-left">{{ (item.statusRemark==='Unpaid'&&isCheck)?'Products':item.statusRemark }}</div>
            <div class="item-right">
              <div v-if="(item.statusRemark==='Paid') && (item.platform !== 1)" class="item-btn-cancel" @click="cancelBtn(item)">Cancel</div>
              <div v-if="(item.statusRemark==='Delivered') && (item.platform !== 1)" class="item-btn-cancel" @click="returnBtn()">Return</div>
              <div class="item-btn-track" v-if="item.printFlag===1">
                <div v-if="!item.trackUrl" @click="trackUrlTip()">Track</div>
                <a v-if="item.trackUrl" :href="item.trackUrl" target="_blank">Track</a>
              </div>
            </div>
          </div>
          <div class="item-content" v-for="(itemVo, indexVo) in item.detailVoList" :key="indexVo" @click="productViewDetail(itemVo)">
            <div class="item-content-img">
              <img v-imgError :src="itemVo.skuImage?itemVo.skuImage:'../../static/littleImgError@2x.png'" alt="">
              <div v-if="((itemVo.onlineStatus === 0) || (itemVo.stockCount === 0)) && (detailInfo.status === 1) && isCheck">Sold Out</div>
              <div v-if="((itemVo.onlineStatus === 1) && (itemVo.stockCount < itemVo.num) && (itemVo.stockCount !== 0)) && (detailInfo.status === 1) && isCheck">Out of Stock</div>
            </div>
            <div class="item-descr">
              <div class="">{{ (itemVo.brand?(itemVo.brand + '&nbsp;'):'') + itemVo.title }}</div>
              <div>{{itemVo.dimensionValues && Object.keys(itemVo.dimensionValues).length ? Object.values(itemVo.dimensionValues).join(',') : '' }}</div>
              <div> Quantity: {{ itemVo.num }}</div>
              <div> Total: <span>${{ formatPrice(itemVo.price) }}</span></div>
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
        <div :style="`display:${(detailInfo.status === 1&&isCheck)?'block':'none'}`">Order Summary</div>
        <div><span>Item Total</span><span>${{ formatPrice(detailInfo.totalAmount) }}</span></div>
        <div><span>Shipping</span><span>${{ formatPrice(detailInfo.shippingMethodVo.deliveryFee) }}</span></div>
        <div :style="`display:${(detailInfo.couponAmount===0)?'none':'block'}`"><span>Discount</span><span>-${{ formatPrice(detailInfo.couponAmount) }}</span></div>
        <div><span>Tax</span><span>$0.00</span></div>
        <div><span>Order Total</span><span>${{ formatPrice(detailInfo.payAmount) }}</span></div>
        <div class="amount-support"><img src="../../static/emailUs@2x.png" alt="">Have questions? Email us at support@trendsi.com</div>
      </div>
      <div v-if="detailInfo.status === 1 && isCheck" class="common-card dialog-detail-total">
        <div><span>Total</span><span>${{ formatPrice(detailInfo.payAmount) }}</span></div>
        <div>
          <div v-if="commonData.flagPlaceOrder" class="isDisabled">Place Order</div>
          <div v-else @click="placeOrder(detailInfo)">Place Order</div>
        </div>
      </div>
    </el-dialog> -->
    <!-- <el-dialog class="dialog-ok" title="Enter email" width="300px" :visible.sync="dialogFormVisibleOK" center @close="closeDialogOK">
      <el-form :model="dialogOK" ref="okForm" :rules="rules">
        <el-form-item prop="email">
          <el-input v-model="dialogOK.email" autocomplete="off" size="large" @input="onInputOK()"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <div v-if="dialogOK.email.toString().length" class="dialog-btntext" @click="dialogOKBtn(dialogOK)">OK</div>
        <div v-else class="dialog-btntext btntext-disabled">OK</div>
      </div>
    </el-dialog> -->
    <el-dialog class="dialog-cancelBtn" title="Cancel Order" width="300px" :visible.sync="dialogFormVisibleCancel" center @close="closeDialogCancel">
      <div><span>Are you sure you want to cancel this order?</span></div>
      <div slot="footer" class="dialog-footer">
        <div class="dialog-btntext" @click="dialogCancelBtn()">Cancel Order</div>
        <div class="dialog-btntext dialog-cancel" @click="dialogFormVisibleCancel=false">Never Mind</div>
      </div>
    </el-dialog>
    <el-dialog class="dialog-success" :visible.sync="dialogVisibleSuccess" center @close="closeDialogSuccess">
      <img src="@/static/successYellow@2x.png" alt="">
      <div class="text-info-header">Success</div>
      <div class="text-info-content">Your order has been placed.</div>
      <span slot="footer" class="dialog-footer">
        <div class="btn-content" @click="dialogVisibleSuccess = false">OK</div>
      </span>
    </el-dialog>
    <el-dialog class="dialog-checkoutOffBtn" title="Auto Checkout" width="300px" :visible.sync="dialogFormVisibleCheckoutOff" center @close="closeDialogCheckoutOff">
      <div><span>Are you sure you want to turn off Auto Checkout?</span></div>
      <div slot="footer" class="dialog-footer">
        <div class="dialog-btntext" @click="dialogCheckoutOffBtn()">Turn Off</div>
      </div>
    </el-dialog>
    <el-dialog class="dialog-checkoutBtn" title="Auto Checkout" width="300px" :visible.sync="dialogFormVisibleCheckout" center @close="closeDialogCheckout">
      <div><span>To use Auto Checkout you must have a payment method on your account.</span></div>
      <div slot="footer" class="dialog-footer">
        <div class="dialog-btntext" @click="dialogCheckoutBtn()">Add Payment Method</div>
      </div>
    </el-dialog>
    <el-dialog class="dialog-checkoutTurnBtn" title="Did You Know?" width="480px" :visible.sync="dialogFormVisibleTurn" center>
      <div>
        <div class="checkoutTurnBtn-img"><img src="@/static/autoCheckout@2x.png" alt=""></div>
        <div class="checkoutTurnBtn-info">Auto Checkout</div>
        <div class="checkoutTurnBtn-text">New Shopify orders will be automatically paid for using the payment method on your account, and then be fulfilled and shipped to your customers by Trendsi.</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="dialog-btntext" @click="dialogCheckoutTurnBtn()">Turn On</div>
      </div>
    </el-dialog>
    <!-- <AddPay v-if="addpayShow" :dialogVisible.sync="addpayShow" @close='closeDialogaddpay' @usecard="useCardPay" :modal="true" :modalAppend="true" :modalAppendDelete="true" setType="useCard" :defaultChecked="payInfo" /> -->
    <InputPay v-if="inputpayShow" :dialogVisible.sync="inputpayShow" @close='inputpayShow=false' @closeSave="inputpayClose" />
    <OrderTrack :trackData='trackData' :orderTrackVisible.sync='orderTrackVisible' />
  </div>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import ListCard from '@/components/ListCard.vue';
// import AddPay from '@/components/AddPay.vue';
import InputPay from '@/components/InputPay.vue';
import OrderTrack from './components/orderTrack.vue';
import { formatPrice } from "@/utils/common";
// import { queryOrderListByStatus, queryOrderDetailById, cancelOrderById, checkShopifyOrderCanBePayment, autoCheckoutPay } from "@/api/orders";
// import { stripeCharge, queryPaymentCardList } from "@/api/stripe";
import { queryOrderListByStatus, cancelOrderById, autoCheckoutPay, orderListReturn } from "@/api/orders";
import { queryPaymentCardList } from "@/api/stripe";
import { userInfo } from '@/api/login';
// import Share from '@/mixins/share';

export default {
  name: 'Orders',
  // mixins: [Share],
  components: {
    ListCard,
    // AddPay,
    InputPay,
    OrderTrack
  },
	data() {
		return {
      searchKey: '',
      commonData: {
        // flagPlaceOrder: false,
        flagTurnOff: false,
        flagAddPayment: false,
        isUnpaid: undefined,
        flagScroll: false
      },
      isDisabledSwitch: false,
      formatPrice,
      status: {
        // 'All' : 0,
        // 'Others' : 99,
        'Unpaid' : 1,
        'Paid' : 3,
        'Processing': 3.5,
        'Shipped' : 4,
        'Delivered' : 5,
        'Canceled' : 2,
        'Return' : ''
        // 'Shopify' : undefined,
        // 'My Trendsi Store' : undefined
      },
      filters: [ 'Unpaid', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Canceled', 'Return'], // , 'Shopify', 'My Trendsi Store' 
      filterValue: '',
      listcards: [],
      // DialogVisibleOrderDetail: false,
      // dialogTitle: '',
      curPage: 1,
      // detailInfo: {
      //   shippingMethodVo: ''
      // },
      // addpayShow: false,
      // dialogFormVisibleOK: false,
      // dialogOK: {
      //   email: ''
      // },
      // rules: {
      //   email: []
      // },
      email: JSON.parse(localStorage.getItem('USERINFO')).email,
      // payInfo: {},
      dialogFormVisibleCancel: false,
      dialogFormVisibleCheckout: false,
      dialogFormVisibleTurn: false,
      dialogFormVisibleCheckoutOff: false,
      operateOrderId: '',
      isLoad: false,
      // isFinished: false,
      // isCheck: false,
      dialogVisibleSuccess: false,
      // promiseInfo: null,
      promiseInfoPayCard: null,
      inputpayShow: false,
      orderTrackVisible:false,
      trackData: {},
      totalPages: 1,
      isShowCheckoutSuccess: this.$store.state.layout.isShowCheckoutSuccess,
      inputSearch: ''
    }
  },
  computed: {
    ...mapState('layout',[
      'unpaidNumb'
    ]),
    autoCheckout: {
      get() {
        return this.$store.state.layout.autoCheckout;
      },
      set(val) {
        this.SET_AutoCheckout(val);
      }
    }
  },
  watch: {},
  methods: {
    ...mapMutations('layout',[
      'SET_UnPaidNum',
      'SET_AutoCheckout',
      'SET_SearchOrder'
    ]),
    getAutoCheckout() {
      userInfo({}, (res) => {
        this.$nextTick(()=>{
          this.SET_AutoCheckout(res.result.autoPay ? true : false);
        })
      },
      () => {},
      () => {})
    },
    // getDetailList(valId) {
    //   this.promiseInfo = new Promise((resolve, reject) => {
    //     queryOrderDetailById({
    //       orderId: valId
    //     },
    //     (res) => {
    //       resolve(res.result);
    //       let result = res.result;
    //       let listcardsResult = {};
    //       let mobile = result.addressVO.phoneNumber?result.addressVO.phoneNumber:'';
    //       let mobileResult = mobile
    //         ? mobile.substring(0,2)+'('+mobile.substring(2,5)+')'+mobile.substring(5,8)+'-'+mobile.substring(8)
    //         : '';
    //       listcardsResult = Object.assign({}, result, {
    //         firstName: result.addressVO.firstName,
    //         lastName: result.addressVO.lastName,
    //         phoneNumber: mobileResult,
    //         addressLine1: result.addressVO.addressLine1,
    //         addressLine2: result.addressVO.addressLine2,
    //         city: result.addressVO.city,
    //         state: result.addressVO.state,
    //         zipCode: result.addressVO.zipCode
    //       });
    //       this.detailInfo = listcardsResult;
    //     },
    //     (err) => {
    //       reject(err)
    //     },
    //     () => {})
    //   })
    // },
    getListCard() {
      this.promiseInfoPayCard = new Promise((resolve, reject) => {
        queryPaymentCardList( JSON.parse(localStorage.getItem('USERINFO')).id,
        (res) => {
          const result = res.result;
          resolve(result);
          // this.payInfo = result[0]?result[0]:{};
        },
        (err) => {
          reject(err)
        },
        () => {})
      })
    },
    getList(curPage) {
      this.isLoad = true;
      // this.listcards = [];
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      queryOrderListByStatus({
        curPage: curPage,
        pageSize: 10,
        status: this.status[this.filterValue],
        type: this.filterValue === 'Shopify' ? 4 : (this.filterValue === 'My Trendsi Store' ? 1 : undefined),
        search: this.searchKey.trim() || undefined
      },
      (res) => {
        loading.close();
        // this.isFinished = this.curPage >= res.page.pages;
        this.totalPages = res.page.pages;
        let result = res.result;
        let listcardsResult = [];
        // if(result.length) {
        result.forEach((item, index) => {
          listcardsResult[index] = Object.assign({}, item, {
            firstName: item.addressVO.firstName,
            lastName: item.addressVO.lastName,
            phoneNumber: item.addressVO.phoneNumber,
            addressLine1: item.addressVO.addressLine1,
            addressLine2: item.addressVO.addressLine2,
            city: item.addressVO.city,
            state: item.addressVO.state,
            zipCode: item.addressVO.zipCode,
            email: item.smallUserVo.email,
            createTimeT: this.$moment.unix(item.createTimeT).format('ll')
          });
        });
        // if (this.curPage > 1) {
        //   this.listcards = [...this.listcards, ...listcardsResult];
        // } else {
        this.listcards = listcardsResult;
        // }
        // this.curPage++;
        // } else {
        //   this.listcards = [];
        // }
        this.$nextTick(function() {
          if(this.commonData.flagScroll) {
            this.$refs.ordersList.scrollTop = JSON.parse(localStorage.getItem('ORDERINFO')).scrollTop;
          } else {
            this.$refs.ordersList.scrollTop = 0;
          }
        })
      },
      () => {
        loading.close();
        // this.listcards = [];
        this.$notify({
          title: "Oops",
          message: 'Data response failed!',
          iconClass:'el-icon-warning-outline',
          duration: 3000,
          showClose: false
        });
      },
      () => {
        this.isLoad = false;
      })
    },
    getListReturn(curPage) {
      this.isLoad = true;
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      orderListReturn({
        curPage: curPage,
        pageSize: 10,
        searchNo: this.searchKey.trim() || undefined
      },
      (res) => {
        loading.close();
        this.totalPages = res.page.pages;
        let result = res.result;


        let listcardsResult = [];
        result.forEach((item, index) => {
          listcardsResult[index] = Object.assign({}, item, {
            // firstName: item.addressVO.firstName,
            // lastName: item.addressVO.lastName,
            // phoneNumber: item.addressVO.phoneNumber,
            // addressLine1: item.addressVO.addressLine1,
            // addressLine2: item.addressVO.addressLine2,
            // city: item.addressVO.city,
            // state: item.addressVO.state,
            // zipCode: item.addressVO.zipCode,
            // email: item.smallUserVo.email,
            createTimeT: this.$moment.unix(item.createTimeT).format('ll')
          });
        });
        this.listcards = listcardsResult;

        console.log(1111111, this.listcards)


        this.$nextTick(function() {
          if(this.commonData.flagScroll) {
            this.$refs.ordersList.scrollTop = JSON.parse(localStorage.getItem('ORDERINFO')).scrollTop;
          } else {
            this.$refs.ordersList.scrollTop = 0;
          }
        })




      },
      () => {
        loading.close();
        this.$notify({
          title: "Oops",
          message: 'Data response failed!',
          iconClass:'el-icon-warning-outline',
          duration: 3000,
          showClose: false
        });
      },
      () => {
        this.isLoad = false;
      })


    },
    filterClick(val) {
      this.curPage = 1;
      this.filterValue = (val === this.filterValue) ? '' : val;
      this.listcards = [];
      if(this.filterValue === 'Return') {
        console.log(22222, this.filterValue);
        this.getListReturn(this.curPage);
      } else {
        this.getList(this.curPage);
      }
      this.$EventBus.$emit("isUnpaidShow");
    },
    orderDetail(val, isCheck) {
      localStorage.setItem('ORDERINFO', JSON.stringify({
        curPage: this.curPage,
        filterValue: this.filterValue,
        search: this.searchKey.trim(),
        scrollTop: this.$refs.ordersList.scrollTop
      }))
      this.$router.push({
        path: `/orders/detail/${val.id}`,
        query: { isCheck: isCheck ? true : false }
      })
    },
    orderDetailReurn(val) {
      localStorage.setItem('ORDERINFO', JSON.stringify({
        curPage: this.curPage,
        filterValue: this.filterValue,
        search: this.searchKey.trim(),
        scrollTop: this.$refs.ordersList.scrollTop
      }))
      this.$router.push({
        path: `/returns/details/${val.id}`
      })
    },
    // infiniteload () {
    //   if (this.isFinished || this.isLoad) {
    //     return;
    //   }
    //   this.getList(this.curPage);
    // },
    // closeDialogDetail() {
    //   this.DialogVisibleOrderDetail = false;
    //   this.email = JSON.parse(localStorage.getItem('USERINFO')).email;
    //   this.payInfo = {};
    //   // this.curPage = 1;
    //   // this.getList(this.curPage);
    // },
    // closeDialogaddpay(val) {
    //   if(Object.keys(val).length === 0) { this.getListCard(); }
    //   this.addpayShow = false;
    // },
    // useCardPay(val) {
    //   this.addpayShow = false;
    //   this.payInfo = val;
    // },
    // closeDialogOK() {
    //   this.dialogFormVisibleOK = false;
    //   if(this.$refs['okForm']) {
    //     this.$refs['okForm'].resetFields()
    //   }
    // },
    closeDialogCancel() {
      this.dialogFormVisibleCancel = false;
    },
    // inputEmail() {
    //   this.dialogFormVisibleOK = true;
    // },
    // inputPay() {
    //   this.addpayShow = true;
    // },
    // onInputOK() {
    //   this.$refs['okForm'].clearValidate(); // 移除表单项的校验结果
    // },
    // dialogOKBtn(val) {
    //   this.$refs['okForm'].validate((valid) => {
    //     if (valid) {
    //       this.dialogFormVisibleOK = false;
    //       this.email = val.email;
    //       if(this.$refs['okForm']) {
    //         this.$refs['okForm'].resetFields()
    //       }
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    cancelBtn(val, istrue) {
      this.dialogFormVisibleCancel = true;
      this.operateOrderId = val.orderId || val.id;
      this.commonData.isUnpaid = istrue;
    },
    // returnBtn() {
    //   window.open('https://trendsi.typeform.com/to/zQvUbJNA?typeform-source=help.trendsi.com','_blank');
    // },
    dialogCancelBtn() {
      this.curPage = 1;
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
          { // 后端有延迟，前端手动改unpaidNumb
            if(this.unpaidNumb-1 < 1) {
              this.$EventBus.$emit("isUnpaidShow", true);
            }
            this.SET_UnPaidNum(this.unpaidNumb-1);
          }
        } else {
          this.$notify({
            title: "Order Cancelled",
            message: 'Money will be refunded in 5 - 10 days',
            iconClass:'el-icon-circle-check',
            duration: 3000,
            showClose: false
          });
        }
        // this.getDetailList(this.operateOrderId);
        this.getList(this.curPage);
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
    // placeOrder(val) {
    //   const loading = this.$loading({
    //     lock: true,
    //     text: '',
    //     spinner: 'el-icon-loading',
    //     background: 'rgba(51, 51, 51, 0.25)'
    //   });
    //   this.commonData.flagPlaceOrder = true;
    //   if(this.commonData.flagPlaceOrder) {
    //     checkShopifyOrderCanBePayment(val.id,
    //     (res) => {
    //       loading.close();
    //       if(res.success) {
    //         stripeCharge({
    //           currency: 'usd',
    //           customerId: this.payInfo.customerId,
    //           orderId: val.id,
    //           email: this.email
    //         },
    //         (resCharge) => {
    //           if(resCharge.success) {
    //             let commonOne = [];
    //             let commonTwo = [];
    //             val.detailList.forEach(item=>{
    //               commonOne = commonOne.concat(item.detailVoList)
    //             })
    //             commonOne.forEach((item, index)=> {
    //               commonTwo.push({
    //                 item_name: item.title,
    //                 item_id: item.productId,
    //                 price: item.price,
    //                 item_brand: item.brand,
    //                 index: index+1,
    //                 quantity: item.num,
    //                 item_category: '',
    //                 item_category2: '',
    //                 item_category3: '',
    //                 item_category4: '',
    //                 item_variant: '',
    //                 item_list_name: '',
    //                 item_list_id: '',
    //               })
    //             })
    //             console.log('第13个埋点------Shopify_Store-----', val);
    //             let InfoOne = val;
    //             this.$gtm.trackEvent({
    //               event: 'purchase',
    //               userId: JSON.parse(localStorage.getItem('USERINFO')).uuId,
    //               ecommerce: {
    //                 transaction_id: InfoOne.id, // order Id
    //                 affiliation: 'Shopify_Store',
    //                 value: InfoOne.payAmount, // 付款的总价
    //                 tax: '0.00',
    //                 shipping: val.shippingMethodVo.deliveryFee,
    //                 currency: 'USD',
    //                 coupon: '',
    //                 items: commonTwo
    //               }
    //             });
    //             this.DialogVisibleOrderDetail = false;
    //             this.dialogVisibleSuccess = true;
    //             // this.$notify({
    //             //   title: "Order Paid",
    //             //   message: 'A confirmation email has been sent to you.',
    //             //   iconClass:'el-icon-circle-check',
    //             //   duration: 3000,
    //             //   showClose: false
    //             // });
    //             this.listcards.forEach((item, index)=>{ // 后端有延迟，前端手动改数据
    //               if(item.id === val.id) {
    //                 item.status = 3;
    //                 item.subDetailList.forEach((key)=>{
    //                   key.statusRemark = 'Paid';
    //                 })
    //                 if(this.status) {
    //                   this.listcards.splice(index, 1);
    //                 }
    //               }
    //             })
    //             // this.curPage = 1;
    //             // this.getList(this.curPage);
    //             {
    //               // this.unpaidNumb -= 1; // 后端有延迟，前端手动改unpaidNumb
    //               if(this.unpaidNumb-1 < 1) {
    //                 this.$EventBus.$emit("isUnpaidShow", true);
    //               }
    //               this.SET_UnPaidNum(this.unpaidNumb-1);
    //             }
    //             setTimeout(() => {
    //               this.commonData.flagPlaceOrder = false;
    //             }, 300);
    //           }
    //           loading.close();
    //         },
    //         (err) => {
    //           loading.close();
    //           this.commonData.flagPlaceOrder = false;
    //           this.$notify({
    //             title: "Oops",
    //             message: err.data.message,
    //             iconClass:'el-icon-warning-outline',
    //             duration: 3000,
    //             showClose: false
    //           });
    //           this.getDetailList(val.id);
    //         },
    //         () => {})
    //       }
    //     },
    //     (err) => {
    //       loading.close();
    //       this.commonData.flagPlaceOrder = false;
    //       this.$notify({
    //         title: "Oops",
    //         message: err.data.message,
    //         iconClass:'el-icon-warning-outline',
    //         duration: 3000,
    //         showClose: false
    //       });
    //       this.getDetailList(val.id);
    //     },
    //     () => {})
    //   }
    // },
    autoCheckoutChange(val) {
      this.isDisabledSwitch = true;
      if(val) {
        this.commonData.flagTurnOff = false;
        this.commonData.flagAddPayment = false;
        this.getListCard();
        this.promiseInfoPayCard.then(data => {
          if(data.length === 0) {
            this.dialogFormVisibleCheckout = true;
          } else {
            this.isDisabledSwitch = false;
            autoCheckoutPay({ autoPay: this.autoCheckout?1:0 }, () => {
            },
            () => {},
            () => {})
          }
        })
      } else {
        this.dialogFormVisibleCheckoutOff = true;
        this.isDisabledSwitch = false;
      }
    },
    closeDialogSuccess() {
      this.$store.commit('layout/SET_ShowCheckoutSuccess', false);
      // 是否是第一次, 说明提示过了
      if(JSON.parse(localStorage.getItem('USERINFO')).firstNotice === 1 && this.autoCheckout === false) {
        this.dialogFormVisibleTurn = true;
        autoCheckoutPay({ firstNotice: 0 }, () => {
          const userInfo = JSON.parse(localStorage.getItem('USERINFO'));
          userInfo.firstNotice = 0;
          localStorage.setItem('USERINFO', JSON.stringify(userInfo));
        },
        () => {},
        () => {})
      }
    },
    dialogCheckoutBtn() {
      this.inputpayShow = true;
    },
    dialogCheckoutTurnBtn() {
      this.SET_AutoCheckout(true);
      this.dialogFormVisibleTurn = false;
    },
    dialogCheckoutOffBtn() {
      this.SET_AutoCheckout(false);
      this.dialogFormVisibleCheckoutOff = false;
      this.commonData.flagTurnOff = true;
      autoCheckoutPay({ autoPay: this.autoCheckout?1:0 }, () => {},
      () => {},
      () => {})
    },
    closeDialogCheckout() {
      this.SET_AutoCheckout(false);
      this.isDisabledSwitch = false;
      if(this.commonData.flagAddPayment) {
      this.SET_AutoCheckout(true);
      } else {
      this.SET_AutoCheckout(false);
      }
    },
    closeDialogCheckoutOff() {
      if(!this.commonData.flagTurnOff) {
        this.SET_AutoCheckout(true);
      }
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
    trackUrlTip() {
      this.$notify({
        title: "Oops",
        message: 'Your tracking number is not available yet.',
        iconClass:'el-icon-warning-outline',
        duration: 3000,
        showClose: false
      });
    },
    // productViewDetail(val) {
    //   if(val.onlineStatus === 0) { // 下架商品不可点进入详情
    //     return false;
    //   } else {
    //     if(this.$route.fullPath !== `/products/detail?id=${val.productId}`) {
    //       const routeData = this.$router.resolve({
    //         path: "/products/detail",
    //         query: {
    //           id: val.productId,
    //         },
    //       });
    //       window.open(routeData.href, '_blank')
    //     }
    //   }
    // },
    showParentModul(val) {
      this.trackData = val
      this.orderTrackVisible = true
    },
    submitFormSearch(searchKey) {
      this.commonData.flagScroll = false;
      this.listcards = [];
      this.curPage = 1;
      this.searchKey = searchKey;
      if(this.filterValue === 'Return') {
        this.getListReturn(this.curPage);
      } else {
        this.getList(this.curPage);
      }
    },
    jumpPage (num) {
      this.$refs.ordersList.scrollTop = 0;
      this.curPage = num;
      this.commonData.flagScroll = false;
      if(this.filterValue === 'Return') {
        this.getListReturn(this.curPage);
      } else {
        this.getList(this.curPage);
      }
    },
    setOrderDetailVal() {
      if(!JSON.parse(localStorage.getItem('ORDERINFO'))) return
      this.curPage = JSON.parse(localStorage.getItem('ORDERINFO')).curPage;
      this.filterValue = JSON.parse(localStorage.getItem('ORDERINFO')).filterValue;
      this.searchKey = JSON.parse(localStorage.getItem('ORDERINFO')).search;
      this.commonData.flagScroll = true;
      this.SET_SearchOrder(this.searchKey);
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => { // vm相当于this
      if(from.name === 'OrdersDetail') {
        vm.setOrderDetailVal();
      }
      // vm.getList(vm.curPage);
    });
  },
	created() {
    this.setOrderDetailVal();
    if(this.filterValue === 'Return') {
      this.getListReturn(this.curPage);
    } else {
      this.getList(this.curPage);
    }
    this.getAutoCheckout();
    this.$EventBus.$emit("isUnpaidShow");
    if(this.isShowCheckoutSuccess) {
      this.dialogVisibleSuccess = true;
      this.$store.commit('layout/SET_ShowCheckoutSuccess', false);
    }
    this.$EventBus.$off('showSuccess');
    this.$EventBus.$on('showSuccess',()=>{
      setTimeout(()=>{
        this.dialogVisibleSuccess = true;
      }, 400)
    })
  }
}
</script>

<style lang="less">
  @import "../../styles/dialogSuccess.less";
  .orders{
    height: 100%;
    position: relative;
    .orders-filter {
      box-sizing: border-box;
      max-width: 1320px;
      margin: 0 auto;
      overflow: auto;
      height: 158px;
      background: #FFFFFF;
      z-index: 2;
      .el-radio-group {
        display: flex;
        justify-content: center;
        overflow: overlay;
        overflow-y: hidden;
        height: 42px;
        line-height: 42px;
        padding-top: 40px;
        @media screen and (max-width:1060px) {
          justify-content:inherit
        }
        .el-radio-button__inner {
          height: 100%;
          background: #eeeeee;
          color: #333333;
          border-color: transparent;
          border-radius: 20px;
          font-family: Avenir Next;
          font-style: normal;
          font-weight: normal;
          font-size: 16px;
          padding-left: 26px;
          padding-right: 26px;
          .el-badge {
            font-size: 16px;
            .el-badge__content {
              position: absolute;
              top: -16px;
              right: 0;
              background-color: #F363A0;
              border: 0;
              padding: 4px 5px 4px 6px;
              margin-right: -9px;
              line-height: 12px;
              box-sizing: border-box;
              display: inline-flex;
              align-items: center;
              justify-content: center;
            }
          }
        }
        .el-radio-button__orig-radio:checked+.el-radio-button__inner {
          background-color: #333333;
          border-color: #333333;
          color: #ffffff;
          box-shadow: 0 0 0 0;
        }
        .el-radio-button:hover:not(.el-radio-button__orig-radio:checked+.el-radio-button__inner) {
          background-color: #eeeeee;
          opacity: 0.6;
          color: #333333;
        }
        .el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
          box-shadow: 0 0 0 0;
        }
        .el-radio-button {
          margin-right: 16px;
          background: #eeeeee;
          border-radius: 21px;
        }
      }
      .orders-auto-checkout {
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        .el-switch {
          .el-switch__core {
            height: 24px;
            border-radius: 12px;
          }
          .el-switch__core::after {
            height: 20px;
            width: 20px;
          }
        }
        .el-switch.is-checked .el-switch__core::after {
          margin-left: -21px;
        }
        .orders-checkout-title {
          margin-left: 8px;
          font-weight: bold;
          font-size: 16px;
          color: #333333;
          min-width: 116px;
        }
        .orders-checkout-info {
          display: inline-block;
          width: 712px;
          margin-left: 24px;
          font-size: 14px;
          color: #979797;
        }
      }
    }
    .orders-filter::-webkit-scrollbar {
      display: none;
    }
    .orders-list {
      box-sizing: content-box;
      width: 100%;
      height: calc(100% - 158px);
      overflow: auto;
      & > div.no-data {
        text-align: center;
        margin-top: 110px;
        & > img {
          width: 200px;
          height: 200px;
        }
        & > div {
          font-weight: 500;
          font-size: 18px;
        }
      }
    }
    .el-backtop {
      height: 60px;
      width: 60px;
      box-shadow: 0 0 0 0;
      .orders-top {
        height: 60px;
        width: 60px;
        cursor: pointer;
        text-align: center;
        border-radius: 30px;
        background: rgba(255, 255, 255, 0.8);
        box-shadow: 0px 5px 20px rgba(51, 51, 51, 0.15);
        backdrop-filter: blur(10px);
        img {
          height: 36px;
          width: 36px;
          margin-top: 15px;
        }
      }
    }
    .dialog-detail > .el-dialog {
      width: 548px;
      height: 640px;
      margin-top: -320px !important;
      & > .el-dialog__body {
        position: relative;
        overflow: auto;
        height: 395px;
        margin: 24px 0;
        padding: 0 24px;
      }
    }
    .dialog-cancelBtn > .el-dialog {
      margin-top: -112px !important;
      & > .el-dialog__body {
        text-align: center;
        padding: 8px 20px 16px 20px;
      }
    }
    .dialog-checkoutOffBtn > .el-dialog {
      margin-top: -91px !important;
      & > .el-dialog__body {
        padding: 16px 20px 24px;
        text-align: center;
      }
    }
    .dialog-checkoutBtn > .el-dialog {
      margin-top: -96.5px !important;
      & > .el-dialog__body {
        line-height: 24px;
        padding: 16px 16px 24px 16px;
        text-align: center;
      }
    }
    .dialog-checkoutTurnBtn > .el-dialog {
      margin-top: -223px !important;
      & > .el-dialog__body {
        text-align: center;
        color: #333333;
        padding: 32px 32px 40px 32px;
        .checkoutTurnBtn-img {
          margin: 0 auto;
          height: 128px;
          line-height: 128px;
          width: 128px;
          border-radius: 64px;
          background: #ffffff;
          img {
            height: 60px;
            width: 60px;
            vertical-align: middle;
          }
        }
        .checkoutTurnBtn-info {
          margin-top: 16px;
          font-weight: 500;
          font-size: 18px;
        }
        .checkoutTurnBtn-text {
          margin-top: 24px;
          font-size: 14px;
          line-height: 24px;
        }
      }
      & > .el-dialog__footer {
        .dialog-btntext {
          width: 256px;
          height: 48px;
          line-height: 48px;
          border-radius: 24px;
          text-align: center;
          margin: 0 auto;
        }
      }
    }
    .dialog-ok > .el-dialog {
      height: 224px;
      margin-top: -112px !important;
      & > .el-dialog__body {
        padding: 24px 24px 0 24px;
        margin-bottom: 48px;
        .el-form .el-form-item {
          margin-bottom: 0px;
        }
      }
    }
    .dialog-ok, .dialog-cancelBtn {
      .el-form-item__content {
        .el-input-group__append {
          padding: 5px;
        }
      }
      .el-input {
        .el-input__inner {
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
        }
      }
    }
    // .el-dialog {
    //   .el-dialog__body {
    //     .common-card {
    //       position: relative;
    //       background: #FFFFFF;
    //       border-radius: 20px;
    //       box-sizing: border-box;
    //       margin-bottom: 16px;
    //     }
    //     .common-card:last-child {
    //       margin-bottom: 0;
    //     }
    //     .dialog-detail-orderinfo {
    //       position: relative;
    //       font-weight: normal;
    //       font-size: 14px;
    //       color: #333333;
    //       padding: 24px 0;
    //       box-sizing: border-box;
    //       .copy-order {
    //         cursor: pointer;
    //         margin-left: 8px;
    //         display: block;
    //         position: initial;
    //         width: 24px;
    //         height: 24px;
    //       }
    //       img {
    //         position: absolute;
    //         top: 36px;
    //         left: 24px;
    //       }
    //       div:first-child {
    //         margin: 0 0 8px 24px;
    //       }
    //       div:nth-child(2) {
    //         margin: 0 0 8px 24px;
    //       }
    //       div:nth-child(3) {
    //         margin: 0 0 24px 24px;
    //       }
    //       div:nth-child(4) {
    //         font-weight: bold;
    //         font-size: 18px;
    //         background: #F9F9F9;
    //         height: 36px;
    //         line-height: 36px;
    //         padding-left: 24px;
    //         margin-bottom: 16px;
    //         box-sizing: border-box;
    //       }
    //       div:nth-child(5) {
    //         padding-left: 24px;
    //         box-sizing: border-box;
    //         font-weight: 600;
    //       }
    //       div:nth-child(6), div:nth-child(7), div:nth-child(8), div:nth-child(9) {
    //         padding-left: 24px;
    //         box-sizing: border-box;
    //       }
    //       div:nth-child(8) {
    //         margin-top: 24px;
    //       }
    //     }
    //     .dialog-detail-products {
    //       .detail-products-item:first-child {
    //         border-top: none;
    //       }
    //       .detail-products-item {
    //         border-top: 1px solid #EAEAEA;
    //         .item-header {
    //           display: inline-flex;
    //           align-items: center;
    //           margin: 24px 0 24px 24px;
    //           width: 100%;
    //           .item-left {
    //             font-weight: bold;
    //             font-size: 18px;
    //             color: #333333;
    //             width: 100px;
    //           }
    //           .item-right {
    //             position: absolute;
    //             right: 24px;
    //             div {
    //               color: #ffffff;
    //               text-align: center;
    //               height: 24px;
    //               line-height: 24px;
    //             }
    //             .item-btn-cancel {
    //               cursor: pointer;
    //               width: 80px;
    //               background: #333333;
    //               display: inline-block;
    //               border-radius: 12px;
    //               box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
    //             }
    //             .item-btn-track {
    //               margin-left: 16px;
    //               width: 80px;
    //               background: #C79818;
    //               display: inline-block;
    //               border-radius: 12px;
    //               box-shadow: 0px 4px 10px rgba(118, 85, 0, 0.2);
    //               a {
    //                 padding: 2px 24px;
    //                 color: #ffffff;
    //               }
    //               div {
    //                 cursor: pointer;
    //               }
    //             }
    //           }
    //         }
    //         .item-content {
    //           margin-left: 24px;
    //           margin-right: 24px;
    //           color: #333333;
    //           display: flex;
    //           padding-bottom: 16px;
    //           cursor: pointer;
    //           & > div.item-content-img {
    //             img {
    //               object-fit: cover;
    //               height: 120px;
    //               width: 80px;
    //               border-radius: 10px;
    //             }
    //             & > div {
    //               background: rgba(51, 51, 51, 0.6);
    //               backdrop-filter: blur(10px);
    //               border-radius: 4px;
    //               font-weight: 500;
    //               font-size: 12px;
    //               color: #FFFFFF;
    //               text-align: center;
    //               margin: -30px 4px 0;
    //             }
    //           }
    //           .item-descr {
    //             width: 100%;
    //             display: inline-block;
    //             margin: 0 0 0 16px;
    //             div:first-child {
    //               font-weight: 500;
    //               font-size: 14px;
    //               line-height: 16px;
    //               height: 32px;
    //             }
    //             div:nth-child(2), div:nth-child(3) {
    //               color: #979797;
    //               font-weight: normal;
    //               font-size: 12px
    //             }
    //             div:nth-child(2) {
    //               margin-top: 10px;
    //             }
    //             div:nth-child(4) {
    //               margin-top: 29px;
    //               span {
    //                 font-weight: 600;
    //                 font-size: 12px;
    //               }
    //             }
    //           }
    //         }
    //       }
    //     }
    //     .dialog-detail-amount {
    //       font-weight: normal;
    //       font-size: 14px;
    //       color: #333333;
    //       padding: 24px 0;
    //       margin-bottom: 0;
    //       div{
    //         span:last-child {
    //           position: absolute;
    //           right: 24px;
    //         }
    //       }
    //       div:first-child, div:nth-child(2), div:nth-child(3), div:nth-child(4), div:nth-child(5) {
    //         padding: 0 24px 14px;
    //       }
    //       div:first-child {
    //         font-weight: bold;
    //         font-size: 18px;
    //       }
    //       div:nth-child(4) {
    //         span:last-child {
    //           color: #C79618;
    //         }
    //       }
    //       div:nth-child(6) {
    //         height: 45px;
    //         line-height: 45px;
    //         color: #C79618;
    //         font-weight: 500;
    //         padding-left: 24px;
    //         background: #FCF8F1;
    //       }
    //       div.amount-return {
    //         color: #C79618;
    //         margin: 24px 0 0 24px;
    //         img {
    //           width: 24px;
    //           height: 24px;
    //           padding-right: 5px;
    //         }
    //         div {
    //           vertical-align: super;
    //           display: inline-block;
    //           padding: 0;
    //         }
    //       }
    //       div.amount-support {
    //         font-weight: 500;
    //         font-size: 13px;
    //         margin: 24px 0 0 24px;
    //         img {
    //           width: 20px;
    //           height: 15px;
    //           padding-right: 10px;
    //         }
    //       }
    //     }
    //     .dialog-detail-payment {
    //       padding: 24px 24px;
    //       .dialog-detail-payment-email {
    //         padding-right: 2px;
    //       }
    //       div:first-child {
    //         font-weight: bold;
    //         font-size: 18px;
    //         margin-bottom: 16px;
    //         color: #333333;
    //       }
    //       div:nth-child(2) {
    //         margin-bottom: 16px;
    //       }
    //       div:nth-child(2), div:nth-child(3) {
    //         span:last-child {
    //           position: absolute;
    //           right: 24px;
    //           color: #C79618;
    //           i {
    //             font-weight: 600;
    //             vertical-align: middle;
    //           }
    //         }
    //       }
    //     }
    //     .dialog-detail-total {
    //       position: fixed;
    //       left: 0;
    //       right: 0;
    //       bottom: 24px;
    //       margin: 0 24px;
    //       padding: 24px;
    //       .isDisabled {
    //         opacity: 0.1;
    //       }
    //       div:first-child {
    //         span {
    //           color: #333333;
    //           font-weight: bold;
    //           font-size: 18px;
    //           margin-left: 20px;
    //         }
    //         span:last-child {
    //           position: absolute;
    //           right: 48px;
    //           color: #333333;
    //           font-weight: bold;
    //           font-size: 18px;
    //         }
    //       }
    //       div:nth-child(2) {
    //         cursor: pointer;
    //         margin-top: 16px;
    //         width: 100%;
    //         text-align: center;
    //         div {
    //           display: inline-block;
    //           font-weight: 500;
    //           font-size: 20px;
    //           color: #FFFFFF;
    //           text-align: center;
    //           height: 48px;
    //           line-height: 48px;
    //           width: 412px;
    //           background: #C79619;
    //           box-shadow: 0px 4px 10px rgba(118, 85, 0, 0.2);
    //           border-radius: 24px;
    //         }
    //       }
    //     }
    //   }
    // }
  }
</style>