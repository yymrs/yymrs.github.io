<template>
  <div class="addpay">
    <el-dialog
      class="dialog-addpay"
      title="Payment Methods"
      :visible.sync="dialogVisible"
      width="640"
      :modal-append-to-body="modalAppend"
      :modal="modal"
      :before-close="onClose"
      center>
      <div style="min-height: 232px;">
        <div class="addpay-card" v-for="(item, index) in listcard" :key="index">
          <div class="addpay-card-item">
            <div class="addpay-card-left">
              <div class="addpay-card-check">
                <input @input="inputradio(item, index)" :id="index" type="radio" name="card" :value="item.id" 
                :checked="((checked === index) || ((defaultChecked && Number(defaultChecked.id) === item.id) || (defaultChecked?0:item.isDefault)) && checkedDeafult)?true:false" />
              </div>
              <div class="addpay-card-info">
                <label :for="index">
                  <img v-if="(checked === index) || ((defaultChecked && Number(defaultChecked.id) === item.id) || (defaultChecked?0:item.isDefault)) && checkedDeafult" src="../static/check@2x.png" alt="">
                  <img v-else src="../static/nocheck@2x.png" alt="">
                  <img class="addpay-card-img" :src=" item.logo || defaultImg" alt="">
                  <span>...{{ item.mask }}</span>
                  <div v-if="item.isDefault" class="addpay-card-default">Default</div>
                </label>
              </div>
            </div>
            <div class="addpay-card-delete" @click="deleteCard(item)">
              <div><img src="../static/delete@2x.png" alt=""></div>
            </div>
          </div>
        </div>
        <div class="addpay-card-add" @click="AddCard">
          <img src="../static/add@2x.png" alt="">
          Add New Card
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <div v-if="setType==='setDefault' && listcard.length===0" class="opacity-disabled"><div>Set As Default</div></div>
        <div v-if="setType==='setDefault' && listcard.length!==0" class="add-pay-btn"><div @click="setDefault">Set As Default</div></div>
        <div v-if="setType==='useCard' && listcard.length===0" class="opacity-disabled"><div>Use This Card</div></div>
        <div v-if="setType==='useCard' && listcard.length!==0"  class="add-pay-btn"><div @click="useCard">Use This Card</div></div>
      </div>
    </el-dialog>
    <input-pay v-if="inputpayShow" :dialogVisible.sync="inputpayShow" @close='inputpayShow=false' @closeSave="inputpayClose" />
    <el-dialog class="dialog-delete" title="Delete Card" width="300px"
      :visible.sync="dialogFormVisibleDelete"
      center
      :modal-append-to-body="modalAppendDelete"
      :modal="true"
      @close="closeDialog">
      <div><span>Are you sure you want to delete this Card?</span></div>
      <div slot="footer" class="dialog-footer">
        <div class="dialog-btntext" @click="dialogDelete">Delete</div>
        <div class="dialog-btntext dialog-cancel" @click="dialogFormVisibleDelete=false">Cancel</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import InputPay from '@/components/InputPay.vue'
import { queryPaymentCardList, deletePaymentCardByID, setPaymentCardAsDefaultByID } from '@/api/stripe'
import { mapMutations } from 'vuex';
import { autoCheckoutPay } from "@/api/orders";

export default {
  name: 'AddPay',
  components: {
    InputPay
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    modalAppend: {
      type: Boolean,
      default: false
    },
    modalAppendDelete: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: true
    },
    setType: {
      type: String,
      default: ''
    },
    defaultChecked: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      listcard: [],
      checked: '',
      cardInfo: {},
      defaultImg: require('../static/defaultCard@2x.png'),
      checkedDeafult: true,
      inputpayShow: false,
      deleteId: '',
      dialogFormVisibleDelete: false,
      removeItem: {}
    }
  },
  computed: {
    removeDefault() {
      return this.removeItem&&this.removeItem.isDefault===1
    },
  },
  watch: {
    dialogVisible: { //深度监听，可监听到对象、数组的变化
      handler (newVal, oldVal) {
        if(newVal) {
          console.log(999, 'page埋点-----', 'set_payment_page');
          this.$amplitude.getInstance().logEvent('imp', {
            'page_code': 'set_payment_page',
            'module_code': '',
            'position_code': '',
            'event_target': 'page',
            'event_value': '',
            'pv_id': this._global.userId?this._global.pv_id_func(this._global.userId):this._global.pv_id_func(this.$amplitude.getInstance().options.deviceId),
            'url': window.location.href
          });
        }
      },
      deep:true,
      immediate: true
    }
  },
  methods: {
    ...mapMutations('layout',[
      'SET_AutoCheckout'
    ]),
    getlist() {
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      queryPaymentCardList( JSON.parse(localStorage.getItem('USERINFO')).id,
      (res) => {
        loading.close();
        this.listcard = res.result;
        if( this.listcard.length === 0 ) { // 如果没有银行卡，自动下单支付的功能将取消
          this.SET_AutoCheckout(false);
          autoCheckoutPay({ autoPay: 0 }, () => {},
          () => {},
          () => {})
        }
      },
      () => {
        loading.close();
      },
      () => {})
    },
    inputpayClose() {
      this.getlist();
      this.inputpayShow = false;
    },
    onClose() {
      if(this.listcard.length === 0) {
        this.$emit('close', {});
      } else {
        this.$emit('close', this.defaultChecked?this.defaultChecked:this.listcard[0]);
      }
    },
    inputradio(item, index) {
      this.checked = index;
      this.checkedDeafult = false;
      this.cardInfo = item;
    },
    setDefault() {
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      setPaymentCardAsDefaultByID( this.cardInfo.id,
      () => {
        loading.close();
        this.checked = '';
        this.checkedDeafult = true;
        this.getlist();
        this.$EventBus.$emit("refreshPay");
        this.removeItem = null
      },
      () => {
        loading.close();
      },
      () => {})
    },
    useCard() {
      this.$emit('usecard', Object.keys(this.cardInfo).length?this.cardInfo:this.defaultChecked);
    },
    deleteCard(val) {
      this.deleteId = val.id;
      this.removeItem = val;
      this.dialogFormVisibleDelete = true;
    },
    dialogDelete() {
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      deletePaymentCardByID( this.deleteId,
      () => {
        loading.close();
        this.dialogFormVisibleDelete = false;
        // this.getlist();
        if(this.removeDefault&&this.listcard.length>=2) {
          this.cardInfo = this.listcard[1]
          this.setDefault()
        }else if(this.removeDefault&&this.listcard.length<2) {
          this.$EventBus.$emit("refreshPay");
          this.getlist();
        }else{
          this.getlist();
        }
      },
      () => {
        loading.close();
      },
      () => {})
    },
    AddCard() {
      this.inputpayShow = true;
    },
    closeDialog() {
      this.dialogFormVisibleDelete = false;
    }
  },
  created() {
    setTimeout(()=> {
      this.getlist();
    }, 50)
  }
}
</script>

<style lang="less">
  .addpay {
    .dialog-addpay > .el-dialog {
      background: rgba(255, 255, 255, 0.8);
      width: 640px;
      min-height: 480px;
      margin-top: -240px !important;
      .el-dialog__header {
        padding: 24px 16px 0 16px;
      }
      .el-dialog__body {
        padding-top: 0;
        margin-top: 24px;
        margin-bottom: 24px;
        height: 311px;
        overflow: auto;
      }
    }
    .dialog-delete  > .el-dialog {
      // background: #eeeeee;
      margin-top: -112px !important;
      .el-dialog__body {
        padding: 8px 20px 16px 20px;
        text-align: center;
      }
    }
    .addpay-card {
      cursor: pointer;
      background: #FFFFFF;
      border-radius: 10px;
      height: 56px;
      line-height: 56px;
      margin-bottom: 16px;
      .addpay-card-item {
        width: 100%;
        display: inline-flex;
        align-items: center;
        .addpay-card-left{
          width: calc( 100% - 56px );
          display: inline-flex;
          .addpay-card-check{
            width: 56px;
            display: none;
            input {
              margin-left: 16px;
              vertical-align: middle;
              height: 56px;
              padding: 10px;
              width: 20px;
            }
          }
          .addpay-card-info{
            display: inline-block;
            height: 56px;
            width: 100%;
            label {
              display: inline-block;
              height: 56px;
              width: 100%;
              vertical-align: middle;
              span {
                font-weight: 500;
                font-size: 14px;
                color: #333333;
              }
              img {
                height: 24px;
                width: 24px;
                vertical-align: middle;
                padding: 0 16px;
              }
              img.addpay-card-img {
                // height: 38px;
                width: 38px;
                padding-left: 0;
              }
              .addpay-card-default {
                height: 18px;
                width: 50px;
                font-weight: 400;
                font-size: 12px;
                border-radius: 4px;
                margin-left: 16px;
                background: #333333;
                display: inline;
                vertical-align: middle;
                color: #FFFFFF;
                padding: 0 5px;
              }
            }
          }
         }
        .addpay-card-delete{
          cursor: pointer;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          height: 56px;
          line-height: 56px;
          width: 56px;
          div {
            height: 30px;
            width: 30px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            border-radius: 15px;
            img {
              width: 16px;
              height: 16px;
              vertical-align: middle;
            }
          }
          div:hover {
            background: #eeeeee;
          }
        }
      }
    }
    .addpay-card-add {
      cursor: pointer;
      background: #FFFFFF;
      border-radius: 10px;
      height: 56px;
      line-height: 56px;
      color: #333333;
      font-weight: 500;
      font-size: 16px;
      img {
        padding: 16px;
        width: 24px;
        height: 24px;
        vertical-align: middle;
      }
    }
    .add-pay-btn {
      cursor: pointer;
      display: inline-flex;
      justify-content: center;
      width: 100%;
      height: 48px;
      div {
        height: 48px;
        width: 240px;
        background: #333333;
        color: #ffffff;
        border-radius: 24px;
        text-align: center;
        line-height: 48px;
      }
    }
    .opacity-disabled{
      .add-pay-btn();
      opacity: 0.1;
    }
    .addpay-card-add:active, .add-pay-btn:active {
      opacity: 0.8;
    }
  }
</style>