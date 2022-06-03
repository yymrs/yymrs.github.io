<template>
  <div class="orders-return-detail">
    <div class="order-detail-title">
      <div class="title-img" @click="btnPrevious()">
        <div><img :src="backIcon" alt=""></div>
      </div>
      Return Details
    </div>
    <div class="submit-order-num">
      <div class="order-num-left">
        <div class="order-num-return">Return Auth #: {{ returnDetail.afterBillNo }}
          <img class="copy-order" @click="shareInvitationCode(returnDetail.afterBillNo, {tip:'Your order number has been copied.'})" src="@/static/copy@2x.png" alt="">
        </div>
        <div>Order #: {{ returnDetail.orderCode }}</div>
        <div class="margin-top-24"><span class="color-grey">Request Date:</span> {{ this.$moment.unix(returnDetail.createTimeT).format('ll') }}</div>
        <div><span class="color-grey">Return Status:</span> {{ returnDetail.auditStatusDesc }}</div>
      </div>
      <div class="order-num-right" v-if="returnDetail.auditStatusDesc === 'Requested'">
        <div @click="cancelBtn(returnDetail)">Cancel</div>
      </div>
    </div>
    <div class="orders-return-head">
      <div class="">Products</div>
      <div class="return-head-right">
        <div>Return Reason</div>
        <div>Price</div>
      </div>
    </div>
    <div class="orders-return-line"></div>
    <order-return-submit :dataList="returnDetail.detailVos"></order-return-submit>
    <!-- <order-return-submit :dataList="dataListReason"></order-return-submit> -->
    <div class="orders-return-line"></div>
    <div class="orders-return-total">
      <div>Total Return Requested:</div>
      <div>${{ returnDetail.totalAmount }}</div>
    </div>
    <div class="orders-return-total margin-top-8" v-if="returnDetail.adjustmentsAmount">
      <div class="orders-return-adjust">Other Adjustments:
        <el-tooltip effect="dark" placement="top" popper-class="text_tooltip">
          <div slot="content">Adjustments may include discounts, <br/>previous deductions or restocking fee.</div>
          <img src="@/static/blackTip@2x.png" alt="">
        </el-tooltip>
      </div>
      <div>-${{ returnDetail.adjustmentsAmount }}</div>
    </div>
    <!-- <div class="orders-return-total margin-top-8 color-yellow" v-if="(returnDetail.actReturnAmount) || (returnDetail.auditStatusDesc === 'Declined')"> -->
    <div class="orders-return-total margin-top-8 color-yellow" v-if="(returnDetail.actReturnAmount !== '') && (returnDetail.actReturnAmount !== undefined) && (returnDetail.actReturnAmount !== null) ">
      <div>Refunded Amount:</div>
      <div>${{ returnDetail.actReturnAmount }}</div>
    </div>
    <div class="orders-return-note" v-if="(returnDetail.needReturn === 0) || (returnDetail.needReturn === 2)">
      <div>
        Note: Damaged upon arrival items doesn't need to be returned. We will review the photos submitted and a refund will be processed within 5-7 business days.
      </div>
    </div>
    <div class="orders-return-instructions" v-if="returnDetail.needReturn !== 0">
      <div>Return Instructions:</div>
      <pre>
        1. Return auth number must be included with the return.

        2. All items returned must be new, unworn, and in original clear garment bag with SKU sticker and tags.

        3. Send return back within 7 business days of this submission to:

        Returns Department
        17300 Railroad Street, Unit D
        City of Industry, CA 91748

        4. Please note, the return may be subject to a 20% restocking fee or declined if the above criteria are not met.
      </pre>
    </div>
    <el-dialog class="dialog-cancelBtn" width="400px" :visible.sync="dialogFormVisibleCancel" center @close="closeDialogCancel">
      <div><span>Are you sure you want to cancel this return?</span></div>
      <div slot="title" class="dialog-header">
        <img src="@/static/question@2x.png" alt="">
        <div class="cancelBtn-title">Cancel Return Request</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div class="dialog-btntext" @click="dialogFormVisibleCancel=false">Keep the Return</div>
        <div class="dialog-btntext dialog-cancel" @click="dialogCancelBtn()">Cancel Request</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { orderReturnDetail, orderReturnCancel } from "@/api/orders";
import OrderReturnSubmit from '../components/orderReturnSubmit.vue';
import Share from '@/mixins/share';

export default {
  name: 'ordersReturnDetail',
  mixins: [ Share ],
  components: {
    OrderReturnSubmit
  },
  data() {
    return {
      backIcon: require('@static/backPrevious.png'),
      returnDetail: {
        afterBillNo: '',
        orderCode: '',
        detailVos: [],
        totalAmount: '',
        needReturn: 1 // 0显示黄色
      },
      dialogFormVisibleCancel: false,
    }
  },
  methods: {
    getList() {
      orderReturnDetail({
        id: this.$route.params.id
      },
      (resource) => {
        if(resource.success) {
          this.returnDetail = resource.result;
        }
      },
      () => {},() => {})
    },
    cancelBtn() {
      this.dialogFormVisibleCancel = true;
    },
    closeDialogCancel() {
      this.dialogFormVisibleCancel = false;
    },
    dialogCancelBtn() {
      orderReturnCancel({
        id: this.$route.params.id
      },
      (res) => {
        if(res.success) {
          this.dialogFormVisibleCancel = false;
          this.getList();
          this.$notify({
            title: "Return Canceled",
            message: 'Return request canceled',
            iconClass:'el-icon-circle-check',
            duration: 3000,
            showClose: false
          });
        } else {
          this.$notify({
            title: "Oops",
            message: res.data.message,
            iconClass:'el-icon-warning-outline',
            duration: 3000,
            showClose: false
          });
        }
      },
      () => {
        this.$notify({
          title: "Update",
          message: "There is an update on this order. Please refresh this page.",
          iconClass:'el-icon-warning-outline',
          duration: 3000,
          showClose: false
        });
        this.dialogFormVisibleCancel = false;
        this.getList();
      },() => {})
    },
    btnPrevious() {
      this.$router.go(-1);
    },
  },
  created() {
    this.getList();
  }
}
</script>

<style lang="less">
  .text_tooltip {
    background: rgba(51, 51, 51, 0.6) !important;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(20px);
  }
  .orders-return-detail {
    width: 642px;
    margin: 0 auto;
    text-align: center;
    margin-top: 24px;
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
    .orders-return-head {
      margin-top: 24px;
      font-weight: 700;
      font-size: 14px;
      line-height: 20px;
      color: #333333;
      display: flex;
      justify-content: space-between;
      div {
        display: inline-block;
      }
      .return-head-right {
        width: 298px;
        display: flex;
        justify-content: space-between;
      }
    }
    .orders-return-line {
      margin-top: 4px;
      border: 1px solid #EEEEEE;
    }
    .submit-order-num {
      width: 640px;
      height: 144px;
      background: #FFFFFF;
      box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
      border-radius: 20px;
      display: flex;
      align-items: end;
      padding-bottom: 16px;
      box-sizing: border-box;
      margin-top: 32px;
      .order-num-left {
        width: calc( 100% - 82px );
        display: inline-block;
        text-align: left;
        box-sizing: border-box;
        padding-left: 16px;
        line-height: 18px;
        color: #333333;
        .margin-top-24 {
          margin-top: 24px;
        }
        .color-grey {
          color: #979797;
        }
        .order-num-return {
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
      .order-num-left > div:last-child {
        margin-top: 8px;
      }
      .order-num-right {
        width: 66px;
        height: 24px;
        line-height: 24px;
        background: #333333;
        box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
        border-radius: 30px;
        div {
          color: #FFFFFF;
          font-weight: 500;
          font-size: 12px;
          cursor: pointer;
        }
      }
      .order-num-right:hover { opacity: 0.6; }
      .order-num-right:active { opacity: 0.8; }
    }
    .orders-return-total {
      margin-top: 16px;
      display: flex;
      justify-content: space-between;
      font-weight: 400;
      font-size: 14px;
      line-height: 19px;
      color: #333333;
      .orders-return-adjust {
        display: inline-flex;
        align-items: center;
        img {
          width: 18px;
          height: 18px;
          margin-left: 8px;
        }
      }
    }
    .margin-top-8 {
      margin-top: 8px !important;
    }
    .color-yellow {
      color: #C79818;
    }
    .orders-return-note {
      margin-top: 16px;
      width: 641px;
      height: 50px;
      line-height: 15px;
      background: #FFEECE;
      border-radius: 8px;
      text-align: left;
      box-sizing: border-box;
      padding: 10px;
      div {
        font-family: 'Inter';
        font-weight: 400;
        font-size: 12px;
        line-height: 15px;
        color: #333333;
      }
    }
    .orders-return-instructions {
      margin-top: 24px;
      margin-bottom: 24px;
      width: 640px;
      background: #F9F9F9;
      text-align: left;
      box-sizing: border-box;
      padding: 24px;
      div:first-child {
        font-weight: 700;
        font-size: 14px;
        line-height: 20px;
        color: #333333;
        margin-bottom: 24px;
      }
      pre {
        font-weight: 400;
        font-size: 14px;
        line-height: 18px;
        color: #333333;
        white-space: pre-line;
      }
    }
    .dialog-cancelBtn > .el-dialog {
      margin-top: -112px !important;
      & > .el-dialog__body {
        text-align: center;
        padding: 8px 20px 40px 20px;
      }
      & > .el-dialog__header {
        img {
          width: 40px;
          height: 40px;
        }
        .cancelBtn-title {
          font-size: 18px;
        }
      }
      & > .el-dialog__footer {
        padding: 0 74px 24px 74px !important;
      }
    }
  }
</style>