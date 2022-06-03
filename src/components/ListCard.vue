<template>
  <div class="listcard ms" :style="{height: listcard.length===0?'40px':'100%'}">
    <!-- <el-backtop :bottom="100" :right="20" target=".listcard">
      <div class="orders-top">
        <img src="../static/top@2x.png" alt="">
      </div>
    </el-backtop> -->
    <div class="listcard-result">
      <div class="listcard-result-info" v-if="(commonData.searchFlag && (searchKey!=='' && searchKey!==undefined && searchKey!==null)) || inputSearch">Results for <span>'{{ searchKey.trim() || inputSearch }}'</span>
        <!-- <span>{{ commonData.searchTotal===0?'0 order':(commonData.searchTotal+' orders') }}</span> -->
      </div>
      <div class="header-search-sub">
        <el-input
          class="header-search-input-sub"
          size="middle"
          clearable
          placeholder="Search Orders"
          @keyup.enter.native="submitFormSearch(inputSearch)"
          @clear="submitFormSearch(inputSearch)"
          v-model="inputSearch">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
    </div>



    <template v-if="listcard.length && dataType !== 'Return'">
      <div class="listcard-item" v-for="(val, index) in listcard" :key="index">
        <div class="listcard-item-header">{{ val.createTimeT }}</div>
        <div class="listcard-item-content-info">
          <div class="info-left" @click="orderDetail(val, false)" :style="`width: ${(val.showInternationalCancelOrder ===1 && (val.status === 2 || val.type === 4))?'calc(100% - 400px) !important;':'calc(100% - 163px);'}`">
            <div class="info-ordernumb">
              <div class="info-ordernumb-billNo">Order #:  {{ val.billNo }}</div>
              <img class="copy-order" @click.stop="shareInvitationCode(val.billNo,{tip:'Your order number has been copied.'})" src="@/static/copy@2x.png" alt="">
              <div class="info-ordernumb-outNo" v-if="val.outNo">
                Shopify Order: #{{ val.outNo }}
                <!-- <img src="@/static/shopify@2x.png" alt=""> -->
              </div>
            </div>
            <div class="info-mobile">Ordered by: {{ val.phoneNumber }}</div>
            <div class="info-person">Shipped to: {{ val.firstName + ' ' + val.lastName }}</div>
          </div>
          <div class="info-right" :style="`width: ${(val.showInternationalCancelOrder ===1 && (val.status === 2 || val.type === 4))?'400px !important;':'163px;'}`">
            <div class="tip-canceled" v-if="val.showInternationalCancelOrder ===1 && (val.status === 2 || val.type === 4)">
              <img src="@/static/tip@2x.png" alt="">
              <span>Canceled as Trendsi does not ship to international addresses.</span>
            </div>
            <div class="operate-cancel" v-if="val.type===4 && val.status===1" @click="orderCancel(val)">Cancel</div>
            <div class="operate-checkout" v-if="(val.type===1 || val.type===4) && val.status===1" @click="orderDetail(val, true)">Checkout</div>
          </div>
        </div>
        <div v-if="val.subDetailList.length" class="listcard-item-line"><div></div></div>
        <div class="listcard-item-content" v-for="(valSub, indexSub) in val.subDetailList" :key="indexSub">
          <div>
            <div class="listcard-item-content-left" @click="orderDetail(val, false)" :ref="'clientWidthImg'+indexSub">
              <div class="listcard-item-content-img">
                <div v-for="(valImg, indexImg) in valSub.detailVoList" :key="indexImg">
                  <img v-imgError
                    :style="`opacity:${(valImg.stockCount===0 && valSub.statusRemark==='Unpaid')?0.3:1}`"
                    :src="valImg.skuImage?valImg.skuImage:'@/static/littleImgError@2x.png'" alt="">
                  <div class="refunded" v-if="valImg.refunded === 1">Refunded</div>
                </div>
                <!-- <img v-imgError :style="`opacity:${(valImg.stockCount===0 && valSub.statusRemark==='Unpaid')?0.3:1}`"
                v-for="(valImg, indexImg) in valSub.detailVoList" :key="indexImg" :src="valImg.skuImage?valImg.skuImage:'@/static/littleImgError@2x.png'" alt=""> -->
              </div>
              <!-- <div class="listcard-item-content-dot" v-if="isShow[indexSub]">...</div> -->
            </div>
            <div class="listcard-item-content-operate">
              <div class="operate-status">{{ valSub.statusRemark }}</div>
              <div class="operate-btn" v-if="(valSub.statusRemark==='Paid') && (valSub.platform !== 1)" @click="cancelBtn(valSub)">Cancel</div>
              <!-- && valSub.type!==4 -->
              <div class="operate-btn-track" v-if="valSub.printFlag===1">
                <div v-if="!valSub.trackUrl&&!valSub.internationalTrackUrl" @click="trackUrlTip()">Track</div>
                <a v-if="valSub.trackUrl||valSub.internationalTrackUrl" @click.prevent="showParentModul(valSub)" target="_blank">Track</a>
              </div>
            </div>
          </div>
          <div class="listcard-item-line"><div></div></div>
        </div>
        <!-- v-if="valLine.length>1 && (valLine.length-1!==indexLine)"  -->
        <!-- <div class="listcard-item-line"><div></div></div> -->
      </div>
    </template>
    <template v-if="listcard.length && (dataType === 'Return')">
      <div class="listcard-item" v-for="(val, index) in listcard" :key="index">
        <div class="listcard-item-header">{{ val.createTimeT}}</div>
        <div class="listcard-item-content-info listcard-return">
          <div class="info-left" @click="orderDetailReurn(val)" :style="`width: ${(val.showInternationalCancelOrder ===1 && (val.status === 2 || val.type === 4))?'calc(100% - 400px) !important;':'calc(100% - 163px);'}`">
            <div class="info-ordernumb">
              <div class="info-ordernumb-billNo">Return Auth #:  {{ val.afterBillNo }}</div>
              <img class="copy-order" @click.stop="shareInvitationCode(val.afterBillNo,{tip:'Your order number has been copied.'})" src="@/static/copy@2x.png" alt="">
            </div>
            <div class="info-order-num" v-if="val.orderCode">Order: #{{ val.orderCode }}</div>
            <div class="info-shopify-num" v-if="val.thirdPartyCode">{{ val.thirdPartSource }}: #{{ val.thirdPartyCode }}</div>
          </div>
        </div>



        <div class="listcard-item-line"><div></div></div>
        <div class="listcard-item-content">
          <div>
            <div class="listcard-item-content-left" @click="orderDetailReurn(val)">
              <div class="listcard-item-content-img">
                <div v-for="(valImg, indexImg) in val.pics" :key="indexImg">
                  <img v-imgError
                    :src="valImg?valImg:'@/static/littleImgError@2x.png'" alt="">
                </div>
              </div>
            </div>
            <div class="listcard-item-content-operate">
              <div class="operate-status">{{ val.auditStatusDesc }}</div>
              <!-- <div class="operate-btn" v-if="(valSub.statusRemark==='Paid') && (valSub.platform !== 1)" @click="cancelBtn(valSub)">Cancel</div>
              <div class="operate-btn-track" v-if="valSub.printFlag===1">
                <div v-if="!valSub.trackUrl&&!valSub.internationalTrackUrl" @click="trackUrlTip()">Track</div>
                <a v-if="valSub.trackUrl||valSub.internationalTrackUrl" @click.prevent="showParentModul(valSub)" target="_blank">Track</a>
              </div> -->
            </div>
          </div>
          <!-- <div class="listcard-item-line"><div></div></div> -->
        </div>




      </div>
    </template>
    <Pagination v-show="listcard.length > 0" :totalPages='totalPages' :curPage='curPage' @jumpPage='jumpPage' />
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import Share from '@/mixins/share';
import Pagination from '@/components/Pagination.vue';

export default {
  name: 'ListCard',
  mixins:[Share],
  components: {
    Pagination
  },
  props: {
    listcard: {
      type: Array,
      default: () => []
    },
    totalPages: {
      type: Number,
      default: 1
    },
    curPage: {
      type: Number,
      default: 1
    },
    dataType: {
      type: String,
      default: ''
    }
    // inputSearch: {
    //   type: String,
    //   default: ''
    // }
  },
  computed: {
    inputSearch: {
      get() {
        return this.$store.state.layout.searchOrder;
      },
      set(val) {
        this.SET_SearchOrder(val);
      }
    }
  },
  data() {
    return {
      // inputSearch: undefined,
      searchKey: '',
      commonData: {
        searchFlag: false,
        // searchTotal: 0
      },
      // inputSearchVal: this.$store.state.layout.searchOrder
    }
  },
  watch: {
    inputSearch() {
      if(this.inputSearch) {
        document.querySelectorAll(".header-search-input-sub > input")[0].style.cssText = 'background: #ffffff;border-color transparent;padding-right: 40px;'; // box-shadow: inset 0px 2px 6px rgba(0, 0, 0, 0.15);
      } else {
        document.querySelectorAll(".header-search-input-sub > input")[0].style.cssText = 'background: #eeeeee;border-color transparent;'; // box-shadow: 0, 0, 0, 0;
      }
    }
  },
  created() {},
  methods: {
    ...mapMutations('layout',[
      'SET_SearchOrder'
    ]),
    orderDetail(val, isCheck) {
			this.$emit("orderDetail", val, isCheck);
    },
    orderDetailReurn(val) {
			this.$emit("orderDetailReurn", val);
    },
    cancelBtn(val) {
      this.$emit('cancelbtn', val);
    },
    orderCancel(val) {
      this.$emit('cancelbtn', val, true);
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
    showParentModul(valSub) {
      const trackUrl = valSub.internationalTrackUrl&&valSub.trackUrl;
      const url = valSub.internationalTrackUrl||valSub.trackUrl;
      trackUrl?this.$emit('showParentModul',valSub):window.open(url,'_blank')      
      // this.$emit('showParentModul',index)
    },
    submitFormSearch() {
      this.commonData.searchFlag = true;
      this.searchKey = this.inputSearch;
			this.$emit("submitFormSearch", this.searchKey);
      this.SET_SearchOrder(this.searchKey);
    },
    jumpPage(num) {
      this.$emit("jumpPage", num);
    }
  }
}
</script>

<style lang="less">
  .listcard {
    // padding-right: 186px;
    max-width: 1320px;
    margin: 0 auto;
    box-sizing: border-box;
    height: 100vh;
    position: relative;
    height: 100%;
    // overflow: auto; // el-backtop
    // overflow: overlay;
    .common-btn {
      cursor: pointer;
      height: 28px;
      background: #333333;
      border-radius: 20px;
      color: #ffffff;
      line-height: 28px;
      text-align: center;
      font-size: 12px;
      font-weight: 500;
    }
    .listcard-result {
      // display: inline-flex;
      text-align: right;
      align-items: center;
      // justify-content: center;
      width: 100%;
      max-width: 916px;
      // margin-left: 48px;
      margin: 0 auto 16px;
      & > div {
        display: inline-block;
      }
      .listcard-result-info {
        & > span:first-child {
          font-weight: bold;
          font-size: 16px;
          color: #333333;
        }
        & > span:nth-child(2) {
          margin-left: 16px;
          color: #979797;
        }
      }
    }
    .listcard-item {
      // min-width: 640px;
      max-width: 916px;
      margin: 0 auto;
      cursor: pointer;
      // margin-left: 48px;
      // margin-right: 48px;
      margin-bottom: 24px;
      background: #EEEEEE;
      border: 1px solid #eeeeee;
      border-radius: 20px;
      .listcard-item-header {
        height: 40px;
        line-height: 40px;
        font-size: 16px;
        color: #333333;
        padding-left: 16px;
      }
      .listcard-item-content-info {
        height: 122px;
        padding: 0 16px;
        box-sizing: border-box;
        background: #ffffff;
        .info-left {
          padding: 16px 0;
          box-sizing: border-box;
          width: calc(100% - 163px);
          display: inline-block;
          .info-ordernumb {
            height: 50px;
            div.info-ordernumb-billNo {
              font-weight: bold;
              font-size: 18px;
              color: #333333;
              display: inline-block;
              vertical-align: top;
              padding-right: 16px;
            }
            div.info-ordernumb-outNo {
              font-weight: normal;
              font-size: 14px;
              color: #000000;
              margin-left: 16px;
              height: 24px;
              line-height: 24px;
              display: inline-block;
              vertical-align: top;
            }
            .copy-order {
              margin: 0;
            }
            img {
              margin-left: 8px;
              width: 24px;
              height: 24px;
              vertical-align: top;
            }
          }
          .info-mobile {
            font-weight: 500;
            font-size: 14px;
            color: #333333;
          }
          .info-person {
            font-weight: normal;
            font-size: 14px;
            color: #333333;
          }
          .info-order-num {
            .info-person();
            display: inline-block;
          }
          .info-shopify-num {
            .info-person();
            display: inline-block;
            margin-left: 16px;
          }
        }
        .info-right {
          display: inline-block;
          width: 163px;
          text-align: right;
          .tip-canceled {
            display: inline-flex;
            align-items: center;
            padding: 0 10px;
            height: 24px;
            background: rgba(243, 99, 160, 0.1);
            border-radius: 4px;
            img {
              margin-right: 6px;
              width: 16px;
              height: 16px;
            }
            span {
              color: #F363A0;
              font-size: 12px;
            }
          }
        }
        .operate-checkout {
          .common-btn();
          box-shadow: 0px 4px 10px rgba(118, 85, 0, 0.2);
          width: 81px;
          display: inline-block;
          vertical-align: bottom;
          // margin-bottom: 16px;
          margin-left: 16px;
          background: #C79818;
        }
        .operate-checkout:hover { opacity: 0.6; }
        .operate-checkout:active { opacity: 0.8; }
        .operate-cancel {
          .common-btn();
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
          width: 66px;
          display: inline-block;
          vertical-align: bottom;
          // margin-bottom: 16px;
          background: #333333;
        }
        .operate-cancel:hover { opacity: 0.6; }
        .operate-cancel:active { opacity: 0.8; }
      }
      .listcard-return {
        height: 82px;
        .info-ordernumb {
          height: 30px !important;
        }
      }
      .listcard-item-content {
        & > div:first-child {
          background: #ffffff;
          height: 122px;
          padding: 0 16px;
          width: 100%;
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
        }
        .listcard-item-content-left {
          display: inline-flex;
          align-items: center;
          width: calc(100% - 139px);
          height: 100%;
          .listcard-item-content-img {
            // display: inline-flex;
            // align-items: center;
            min-width: 323px;
            // max-width: 600px;
            width: 85%;
            height: 90px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            .refunded {
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
            }
            & > div {
              display: inline-block;
              position: relative;
              width: 60px;
              margin-right: 8px;
              & > img {
                object-fit: cover;
                display: block;
                width: 60px;
                height: 90px;
                margin-right: 8px;
                border-radius: 8px;
              }
              & > div {
                background: rgba(51, 51, 51, 0.6);
                backdrop-filter: blur(10px);
                border-radius: 4px;
                font-weight: 500;
                font-size: 10px;
                color: #FFFFFF;
                text-align: center;
                // margin: -30px 2px 0;
              }
            }
            // .listcard-item-content-dot {
            //   display: inline-flex;
            //   div {
            //     display: inline-block;
            //     width: 4px;
            //     height: 4px;
            //     background: #EEEEEE;
            //     border-radius: 2px;
            //     margin-right: 2px;
            //   }
            // }
          }
          .listcard-item-content-dot {
            margin-left: 16px;
            margin-top: -12px;
            font-size: 24px;
            height: 90px;
            line-height: 90px;
            color: #333333;
          }
        }
        .listcard-item-content-operate {
          display: inline-block;
          width: 139px;
          text-align: right;
          height: 122px;
          .operate-status {
            margin-top: 16px;
            font-weight: bold;
            font-size: 14px;
            color: #333333;
          }
          .operate-btn {
            .common-btn();
            margin-top: 38px;
            width: 66px;
            display: inline-block;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
          }
          .operate-btn-track {
            .common-btn();
            margin-top: 38px;
            margin-left: 16px;
            width: 57px;
            display: inline-block;
            background: #C79818;
            box-shadow: 0px 4px 10px rgba(118, 85, 0, 0.2);
            a {
              padding: 6px 14px;
              color: #ffffff;
              font-size: 12px;
            }
            div {
              cursor: pointer;
              font-size: 12px;
            }
          }
          .operate-btn:hover, .operate-btn-track:hover { opacity: 0.6; }
          .operate-btn:active, .operate-btn-track:active { opacity: 0.8; }
        }
      }
      .listcard-item-content:last-child {
        & > div:first-child {
          border-bottom-left-radius: 20px;
          border-bottom-right-radius: 20px;
        }
        .listcard-item-line {
          display: none;
        }
      }
      .listcard-item-line {
        height: 1px;
        background: #ffffff;
        div {
          margin: 0 16px;
          border-top: 1px solid #EEEEEE;
        }
      }
    }
    .listcard-item:hover {
      box-shadow: 0px 10px 20px rgba(51, 51, 51, 0.05);
      border-color: #ffffff;
    }
    .common-pagination {
      padding-bottom: 42px;
    }
  }
  @import "../styles/searchSub.less";
  .listcard {
    max-width: 1320px;
    .header-search-sub {
      margin-right: 0;
    }
  }
</style>
