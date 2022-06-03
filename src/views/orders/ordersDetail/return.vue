<template>
  <div class="orders-return">
    <div class="orders-return-title">Returns</div>
    <div class="orders-return-progress" v-if="active !== 3">
      <div class="progress-img" @click="btnPrevious()">
        <div><img :src="backIcon" alt=""></div>
      </div>
      <div :class="{'is-active': active===1, 'process-select-return': active===2}" @click="btnPreviousSelect()">Select Returns</div>
      <span> > </span>
      <div :class="{'is-active': active===2}">Select Return Reasons</div>
      <span> > </span>
      <div>Submit</div>
    </div>
    <div v-show="active === 1">
      <div class="orders-return-head">
        <div>Products</div>
        <div>Quantity</div>
      </div>
      <div class="orders-return-line"></div>
      <order-return :dataList="dataList" @currentNum="currentNumEvent"></order-return>
      <div class="orders-return-continue disabled" v-if="!currentNumVal.some(item => item!==0)"><div>Continue</div></div>
      <div class="orders-return-continue" v-else @click="returnNextStep()"><div>Continue</div></div>
    </div>
    <div v-show="active === 2">
      <div class="orders-return-head">
        <div>Products</div>
        <div>Return Reason</div>
      </div>
      <div class="orders-return-line"></div>
      <order-return-reason :dataList="dataListReason" :returnReasons="returnReasons" @changeReturnReason="changeReturnReason"></order-return-reason>
      <div class="orders-return-continue disabled" v-if="!isSubmit"><div>Submit</div></div>
      <!-- <div class="orders-return-continue disabled" v-if="!currentNumVal.some(item => item!==0)"><div>Submit</div></div> -->
      <div class="orders-return-continue" v-else @click="returnNextSubmit()"><div>Submit</div></div>
    </div>
    <div v-show="active === 3" class="orders-return-submit">
      <img class="submit-success" src="@static/successYellow@2x.png" alt="">
      <div class="submit-info">Return Request submitted </div>
      <div class="submit-order-num">
        <div class="order-num-left">
          <div class="order-num-return">Return Auth #: {{ returnDetail.afterBillNo }}
            <img class="copy-order" @click="shareInvitationCode(returnDetail.afterBillNo, {tip:'Your order number has been copied.'})" src="@/static/copy@2x.png" alt="">
          </div>
          <div>Order #: {{ returnDetail.orderCode }}</div>
        </div>
        <div class="order-num-right">
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
  import { queryOrderDetailById, orderListReturnReason, orderReturnCreate, orderReturnDetail, orderReturnCancel } from "@/api/orders";
  import orderReturn from '../components/orderReturn.vue';
  import orderReturnReason from '../components/orderReturnReason.vue';
  import OrderReturnSubmit from '../components/orderReturnSubmit.vue';
  import Share from '@/mixins/share';

  export default {
    name: 'ordersReturn',
    mixins: [ Share ],
    components: { orderReturn, orderReturnReason, OrderReturnSubmit },
    data() {
      return {
        backIcon: require('@static/backPrevious.png'),
        active: 1,
        dataList: [],
        dataListReason: [],
        currentNumVal: [],
        returnReasons: [],
        returnReason: [],
        isSubmit: false,
        returnDetail: {
          afterBillNo: '',
          orderCode: '',
          detailVos: [],
          totalAmount: '',
          needReturn: 1 // 0显示黄色
        },
        dialogFormVisibleCancel: false,
        returnId: ''
      }
    },
    methods: {
      cancelBtn() {
        this.dialogFormVisibleCancel = true;
      },
      closeDialogCancel() {
        this.dialogFormVisibleCancel = false;
      },
      dialogCancelBtn() {
        orderReturnCancel({
          id: this.returnId
        },
        (res) => {
          if(res.success) {
            this.dialogFormVisibleCancel = false;
            this.$router.go(-2);
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
          this.$router.go(-2);
        },() => {})
      },
      btnPrevious() {
        if(this.active === 2) {
          this.active = 1;
        } else if(this.active === 1) {
          this.$router.go(-1);
        }
      },
      btnPreviousSelect() {
        if(this.active === 2) {
          this.active = 1;
        }
      },
      getList() {
        queryOrderDetailById({
          orderId: this.$route.params.id
        },
        (res) => {
          this.dataList = res.result.detailList[0].detailVoList;
        },
        () => {},() => {})
      },
      getReturnReasonList() {
        orderListReturnReason({},
        (res) => {
          this.returnReasons = res.result;
        },
        () => {},() => {})
      },
      currentNumEvent(val, length) {
        this.currentNumVal = val.slice(0, length);
        this.$forceUpdate();
      },
      returnNextStep() {
        this.active = 2;
        this.dataListReason = JSON.parse(JSON.stringify(this.dataList)); // 深拷贝，解决splice影响原数组的问题
        let middleDataIndex = [];
        let middleDataReason = [];
        let middleDataNum = [];
        this.currentNumVal.forEach((item, index)=>{ // 如果为0，则删除掉
          if(item !== 0) {
            middleDataIndex.push(index);
          }
        })
        middleDataIndex.forEach((item)=> {
          middleDataReason.push(this.dataListReason[item]);
        })
        middleDataIndex.forEach((item)=> {
          middleDataNum.push(this.currentNumVal[item]);
        })
        let middleData = JSON.parse(JSON.stringify(middleDataReason));
        middleDataNum.forEach((item, index)=>{
          for(let i=0; i<item-1; i++) {
            middleDataReason.splice(0, 0, middleData[index])
          }
        })
        this.dataListReason = middleDataReason;
        this.dataListReason.sort((a,b)=>{return a.productId - b.productId});
      },
      changeReturnReason(returnReason, photoRequired, fileList) {
        this.returnReason = returnReason;
        this.fileList = fileList;
        // 判断是否都填写了，判断是否包含empty值，判断是否照片没上传
        if((returnReason.length !== this.dataListReason.length) || (returnReason.includes(undefined)) || photoRequired.some(item=>item===1) ) {
          this.isSubmit = false; // 不能点击
        } else {
          this.isSubmit = true;
        }
      },
      returnNextSubmit() {
        let middleDataReason = [];
        this.dataListReason.forEach((item, index)=>{
          middleDataReason.push({
            detailId: item.detailId,
            num: 1,
            returnPic: this.fileList && this.fileList[index] && (this.fileList[index].map((item)=>{
              return item.response.result
            })),
            returnReason: this.returnReason[index],
            skuId: item.skuId
          })
        })
        orderReturnCreate({
          orderId: this.dataListReason[0].orderId,
          returnDetails: middleDataReason
        },
        (res) => {
          if(res.success) {
            this.returnId = res.result;
            orderReturnDetail({
              id: res.result
            },
            (resource) => {
              if(resource.success) {
                this.returnDetail = resource.result;
                this.active = 3;
              }
            },
            () => {},() => {})
          }
        },
        () => {},() => {})
      }
    },
    created() {
      this.getList();
      this.getReturnReasonList();
    }
  }
</script>

<style lang="less">
  .orders-return {
    width: 642px;
    margin: 0 auto;
    text-align: center;
    .orders-return-title {
      margin-top: 24px;
      font-weight: 700;
      font-size: 24px;
      line-height: 32px;
      color: #000000;
    }
    .orders-return-progress {
      margin-top: 16px;
      font-size: 14px;
      line-height: 20px;
      color: #979797;
      div {
        display: inline-block;
      }
      .process-select-return:hover {
        cursor: pointer;
        text-decoration: underline;
      }
      .progress-img {
        float: left;
        cursor: pointer;
        & > div {
          width: 20px;
          height: 20px;
          background: #FFFFFF;
          border-radius: 20px;
          & > img {
            width: 20px;
            height: 20px;
          }
        }
        & > div:hover {
          background: #EEEEEE;
        }
      }
      .is-active {
        font-weight: 700;
        color: #333333;
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
    .orders-return-continue {
      cursor: pointer;
      margin-top: 64px;
      margin-bottom: 40px;
      width: 340px;
      height: 56px;
      background: #333333;
      box-shadow: 0px 5px 20px rgb(0 0 0 / 10%);
      border-radius: 30px;
      color: #FFFFFF;
      font-weight: 500;
      line-height: 27px;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      div {
        font-size: 20px;
      }
    }
    .orders-return-continue.disabled {
      opacity: 0.1;
    }
    .orders-return-submit {
      img.submit-success {
        margin-top: 40px;
        width: 40px;
        height: 40px;
      }
      .submit-info {
        margin-top: 8px;
        font-weight: 500;
        font-size: 16px;
        line-height: 20px;
        color: #000000;
      }
      .submit-order-num {
        width: 640px;
        height: 76px;
        background: #FFFFFF;
        box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.05);
        border-radius: 20px;
        display: flex;
        align-items: center;
        margin-top: 60px;
        .order-num-left {
          width: calc( 100% - 82px );
          display: inline-block;
          text-align: left;
          box-sizing: border-box;
          padding-left: 16px;
          line-height: 18px;
          color: #333333;
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