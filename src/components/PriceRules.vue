<template>
  <div class="price-rules-component">
    <el-dialog
      v-loading="loading"
      @click.native='hiddenShowOption'
      title="Price Rules"
      :visible.sync="priceDialogVisible"
      width="640px"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(51,51,51,0.25)"
      center
      custom-class="price-rules-dialog"
      :before-close="handleClose"
    >
      <div class="price-rules-container">
        <div class="price-rules-title">
          Turn on price rules to override default product selling prices.
        </div>
        <div class="price-rules-selling-price" v-for="(i,index) in sellingPrice" :key="index">
          <div class="flex">
            <SwitchCircle :open.sync="i.open" @inputfocus='inputfocus(index)' />
            <span class="price-name">{{i.label}}</span>
            <CircleTip :width="index==0?'320px':'342px'" :direction="index==0?'bottom':'top'">
               {{computedTip(i,index)}}
            </CircleTip>
          </div>
          <div class="flex">
            <span>{{i.rule.label}}</span>
            <span class="price-accord" :class="{active:i.open}">{{i.rule.accord}}</span>
            <div class="input-price-select" :class="{active:i.open}">
              <span v-if="i.rule.accord=='+'" style="margin-left:8px">$</span>
              <input :disabled='!i.open' @blur="blur(i)" :class="{add:i.rule.accord=='+'}"  :ref="'sellingPrice'+index"  v-onedot v-number v-model.trim="i.value"  class="selling-input" type="text" />
              <div class="select-text" :style="{cursor:i.open?'pointer':'initial'}" @click.stop="showOptions(i)">
                <div class="current-select-text">
                  <span> {{i.rule.currentOption}} </span>
                  <img
                    style="width: 10px"
                    :src="require('@/static/down@2x.png')"
                    alt=""
                  />
                </div>
                <div v-if="i.rule.showOption" class="selling-input-option">
                  <div
                    v-for="(option,index) in  i.rule.options"
                    :key="index"
                    class="selling-input-option-single"
                    @click.stop="selectOption(i,option)"
                  >
                    {{option.label}}
                    <!-- <img
                      v-if="option.select"
                      style="width: 10px"
                      :src="require('@/static/down@2x.png')"
                      alt=""
                    /> -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="price-rules-tip">
          Selling prices must be lower than the compare at prices. If selling
          prices are higher, compare at prices are automatically removed.
        </div>
        <div class="set-price-selling">
          Set cents to have selling prices end with standard formatting.
        </div>
        <div class="set-price-selling-tip">
          You can set a specific cent value for your selling price. We will use
          this value when forming the final price for your items (e.g., if you
          want the cost of your products to be XX.99 then add 99 to the fields
          below.)
        </div>
        <div class="set-selling-box">
          <div class="set-price-selling-end" v-for="(item,index) in setSelling" :key="index">
            <div class="input-box">
              <input
                :id="'end'+index"
                @click='switchCheckbox(item,index)'
                type="checkbox"
                name="item"
                v-model="item.end"
              />
              <label :for="'end'+index">
                <img
                  v-if="!item.end"
                  class="circle"
                  :src="require('@/static/circle@2x.png')"
                  alt=""
                />
                <img v-else :src="require('@/static/check@2x.png')" alt="" />
              </label>
            </div>
            <span class="price-tip" v-html="item.label"></span>
            <span class="price-default">{{item.fixed}}</span>
            <div class="input-selling-box" :class="{active:item.end}">
              <input type="text" :ref="'setSelling'+index"  v-justnumber='{item}' :placeholder="item.end?'':99"  :disabled='!item.end' maxlength='2'   v-model="item.value" class="input-selling" />
            </div>
          </div>
        </div>
        <div class="save-button-box">
          <div class="save-button" :class="{'save-btn-active':saveBtnActive}"  @click='savePrice'>Save</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SwitchCircle from "./SwitchCircle.vue";
import CircleTip from "./CircleTip.vue";
import {getSaveCommonPrice,saveCommonPrice} from '@/api/saveCommonPrice'
export default {
  components: { SwitchCircle,CircleTip },
  props: {
    priceDialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading:false,
      userId:undefined,
      priceId:undefined,
      originSellingPriceData:null,
      originSetSellingData: null,
      loadingData:false,
      sellingPrice:[
        {
          open:false,
          label:'Selling Price',
          value:'',
          rule:{
            label:'Cost (USD)',
            accord:'×',
            showOption:false,
            currentOption:'Multiplier',
            options:[
              {label:'Multiplier',select:true},
              {label:'Fixed',select:false},
            ],
          }
        },
        {
          open:false,
          label:'Compare At Price',
          value:'',
          rule:{
            label:'Cost (USD)',
            accord:'×',
            showOption:false,
            currentOption:'Multiplier',
            options:[
              {label:'Multiplier',select:true},
              {label:'Fixed',select:false},
            ],
          }
        },
      ],
      setSelling: [
        {
          end: false,
          label:'Assign Cents',
          fixed:'$XX.',
          value: '',
        },
        {
          end: false,
          label:'Assign Compare <br>At Price Cents',
          fixed:'XX.',
          value: '',
        },
      ],
    };
  },
  computed: {
    saveBtnActive() {
      let flag = false;
      let originSellingPriceData = JSON.stringify(this.originSellingPriceData);
      let originSetSellingData = JSON.stringify(this.originSetSellingData);
      let sellingPriceData = JSON.stringify(this.sellingPrice);
      let setSellingData = JSON.stringify(this.setSelling);
      if(!this.loadingData) {
        return false;
      }
      // console.log(setSellingData == originSetSellingData&&originSellingPriceData==sellingPriceData);
      if(setSellingData == originSetSellingData&&originSellingPriceData==sellingPriceData) {
        flag = false
      }else {
        flag = true
      }
      // this.sellingPrice.map(item=>{
      //   if(item.open&&!isNaN(item.value)&&item.value!=='') {
      //     flag = true
      //   }
      // })
      // this.setSelling.map(item=>{
      //   if(item.end&&!isNaN(item.value&&item.value!=='')) {
      //     flag = true
      //   }
      // })
      return flag;
    }
  },
  watch: {
    priceDialogVisible: { //深度监听，可监听到对象、数组的变化
      handler (newVal, oldVal) {
        if(newVal) {
          console.log(888, 'page埋点-----', 'set_price_page');
          this.$amplitude.getInstance().logEvent('imp', {
            'page_code': 'set_price_page',
            'module_code': '',
            'position_code': '',
            'event_target': 'page',
            'event_value': '',
            'pv_id': this._global.userId?this._global.pv_id_func(this._global.userId):this._global.pv_id_func(this.$amplitude.getInstance().options.deviceId),
            'url': window.location.href
          });
        }
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    this.userId = this.$store.state.user.userInfo.id;
    this.getPriceData()
  },
  mounted() {
  },
  methods: {
    hiddenShowOption() {
      this.sellingPrice.map(item=>{
        item.rule.showOption = false
      })
    },
    getPriceData() {
      let data,success,error,complete;
      data = {};
      success = (res)=>{
        this.loadingData = true;
        if(res.result!=null) {
          const {assignCents,assignCentsNumber,assignCompareAtPriceCents,
          assignCompareAtPriceCentsNumber,sellingPrice,compareAtPrice,
          compareAtPriceNumber,compareAtPriceType,id,sellingPriceType,sellingPriceNumber} =  res.result;
          this.priceId = id;
          this.sellingPrice.map((item,index) => {
            if(index==0) {
              item.open = sellingPrice;
              item.rule.currentOption = sellingPriceType;
              if(sellingPriceType=='Multiplier') {
                item.rule.accord = '×'
              }else {
                item.rule.accord = '+'
              }
              item.value = sellingPriceNumber
            }else {
              item.open = compareAtPrice;
              item.rule.currentOption = compareAtPriceType;
              if(compareAtPriceType=='Multiplier') {
                item.rule.accord = '×'
              }else {
                item.rule.accord = '+'
              }
              item.value = compareAtPriceNumber
            }
          });
          this.setSelling.map((item,index)=>{
            if(index==0) {
              item.end = assignCents;
              item.value = assignCentsNumber;
            }else {
              item.end = assignCompareAtPriceCents;
              item.value = assignCompareAtPriceCentsNumber;
            }
          })
        }
        this.originSellingPriceData = JSON.parse(JSON.stringify(this.sellingPrice))
        this.originSetSellingData = JSON.parse(JSON.stringify(this.setSelling))
      }
      error = ()=>{

      };
      complete = ()=>{
        this.loadingData = false;
      };
      getSaveCommonPrice(data, success, error, complete)
    },
    switchCheckbox(item,index) {
      item.end = !item.end
      this.$nextTick(()=>{
        if(item.end) {
          this.$refs['setSelling'+index][0].focus()
        }
      })
    },
    computedTip(i,index) {
      if(index==0) {
        let accord = i.rule.accord;
        let sumValue;
        let newAccord = i.rule.accord=='×'?'*':'+';
        if(!isNaN(i.value)&&i.value!==''&&i.open) {
          if(newAccord=='*') {
            sumValue = 10*i.value-0
          }else {
            sumValue = 10+(i.value-0)
          }
          return `A product that costs 10 USD would have its selling price set to $${sumValue} USD (10 ${accord} ${i.value} = ${sumValue}).`
        }else {
          if(newAccord=='*') {
            sumValue = 10*2
          }else {
            sumValue = 10+2
          }
          return `A product that costs 10 USD would have its selling price set to $${sumValue} USD (10 ${accord} 2 = ${sumValue}).`
          // A product that costs 10 USD would have its selling price set to 20 USD (10 x 2 = 20) 
        }
      }else {
        let accord = i.rule.accord;
        let sumValue;
        let newAccord = i.rule.accord=='×'?'*':'+';
        if(!isNaN(i.value)&&i.value!==''&&i.open) {
          if(newAccord=='*') {
            sumValue = 10*i.value-0
          }else {
            sumValue = 10+(i.value-0)
          }
          // let sumValue = eval('10'+newAccord+i.value);
          return `A product that costs 10 USD would have its compared at price set to $${sumValue} USD (10 ${accord} ${i.value} = ${sumValue}).`
        }else {
          if(newAccord=='*') {
            sumValue = 10*2
          }else {
            sumValue = 10+2
          }
          return `A product that costs 10 USD would have its compared at price set to $${sumValue} USD (10 ${accord} 2 = ${sumValue}).`
        }
      }
    },
    inputfocus(index) {
      this.$nextTick(() => {
        setTimeout(()=>{
          this.$refs['sellingPrice'+index][0].focus()
        },0)
      })
    },
    savePrice() {
      if(!this.saveBtnActive) {
        return
      }
      this.loading = true;
      let data,success,error,complete,sellingPrice,setSelling;
      sellingPrice = this.sellingPrice;
      setSelling = this.setSelling;
      data = {
        "assignCents": setSelling[0].end,
        "assignCentsNumber": setSelling[0].value-0,
        "assignCompareAtPriceCents": setSelling[1].end,
        "assignCompareAtPriceCentsNumber": setSelling[1].value-0,
        "compareAtPrice": sellingPrice[1].open,
        "compareAtPriceNumber": sellingPrice[1].value-0,
        "compareAtPriceType": sellingPrice[1].rule.currentOption,
        "id": this.priceId,
        "sellingPrice": sellingPrice[0].open,
        "sellingPriceNumber": sellingPrice[0].value-0,
        "sellingPriceType": sellingPrice[0].rule.currentOption,
        "userId": this.userId
      };
      console.log(data);
      // return
      success = (res)=>{
        console.log(res);
        this.getPriceData();
        this.upDataShopify()
      }
      error = ()=>{

      };
      complete = ()=>{
        this.loading = false;
      };
      saveCommonPrice(data, success, error, complete)
    },
    upDataShopify() {
      switch (this.$route.path) {
        case '/':
          this.$EventBus.$emit('upProductsPage')
          break;
        case '/products/detail':
          this.$EventBus.$emit('upShopDetailPage')
          break;
        case '/products/classify':
          this.$EventBus.$emit('upProductsClassifyPage')
          break;
        case '/event':
          this.$EventBus.$emit('upActivityPage')
          break;
      }
    },
    blur(i) {
      let value = i.value + '';
      if(value.indexOf('.')==-1&&value.length>1&&value.charAt(0)==0) { 
        i.value = i.value.slice(1)
      }else if(value.length>=2&&value.indexOf('.')==value.length-1) {
        i.value = i.value.slice(0,value.length-1)
      }
    },
    handleClose() {
      this.$emit("update:priceDialogVisible", false);
    },
    showOptions(i) {
      this.sellingPrice.map(item=>{
        item.rule.showOption = false
      })
      if(i.open) {
        i.rule.showOption = true;
      }
      // i.rule.currentOption
    },
    selectOption(i,option) {
      if(option.label == 'Fixed') {
        i.rule.accord = '+'
      }else {
        i.rule.accord = '×'  
      }
      i.rule.showOption = false;
      i.rule.currentOption = option.label;
      i.rule.options.map(item=>{
        item.label == option.label?item.select=true:item.select=false;
      })
    },
  },
};
</script>
<style lang='less'>
.price-rules-dialog {
  margin-top: 0 !important;
  transform: translateY(-50%);
  .el-dialog__body {
    padding-bottom: 24px !important;
  }
  .price-rules-container {
    .price-rules-title {
      margin-bottom: 24px;
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 24px;
      color: #333333;
    }
    .price-rules-selling-price {
      &:nth-child(3) {
        margin-top: 24px;
      }
      box-sizing: border-box;
      height: 56px;
      background: #fff;
      border-radius: 10px;
      display: flex;
      padding: 8px 16px;
      align-items: center;
      justify-content: space-between;
      .price-name {
        margin: 0 8px;
        font-weight: 500;
        font-size: 16px;
        line-height: 18px;
        color: #333333;
      }
      .price-accord {
        margin-left: 2px;     
        font-weight: 500;
        font-size: 16px;
        line-height: 18px;
        &.active {
          color:rgb(199, 152, 24) ;
        }      
      }
      .flex {
        display: flex;
        align-items: center;
        .input-price-select {
          &.active {
            background-color:#fff;
            border: 1px solid #EEEEEE;
            .selling-input {
              background-color:#fff
            }
          }
          position: relative;
          box-sizing: border-box;
          border: 1px solid transparent;
          margin-left: 8px;
          display: flex;
          align-items: center;
          width: 174px;
          height: 40px;
          background: #eeeeee;
          border-radius: 8px;
          .selling-input {
            &.add {
              padding-left:4px
            }
            height: 38px;
            background: #eeeeee;
            border-radius: 8px;
            width: 0;
            flex: 1;
            color: #333;
            border: none;
            outline: none;
            padding-left: 8px;
            margin-right: 8px;
          }
          .select-text {
            cursor: pointer;
            padding-right: 8px;
            .current-select-text {
              display: flex;
              align-items: center;
              img {
                margin-left: 4px;
              }
            }
            .selling-input-option {
              position: absolute;
              // padding: 10px 0;
              width: 102px;
              top: 0;
              z-index: 10;
              background: #fff;
              box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.15);
              border-radius: 8px;
              right: 0;
              flex-shrink: 0;
              box-sizing: border-box;
              text-align: center;
              display: flex;
              flex-direction: column;
              // align-items: center;
              .selling-input-option-single {
                &:nth-child(1) {
                  margin-top: 10px;
                }
                height: 24px;
                padding-left: 16px;
                margin-bottom: 10px;
                font-weight: 500;
                font-size: 14px;
                line-height: 24px;
                color: #333333;
                text-align: left;
                &:hover {
                  background: #f9f9f9;
                }
              }
            }
          }
        }
      }
    }
    .price-rules-tip {
      margin: 16px 0 24px 0;
      font-size: 14px;
      line-height: 19px;
      color: #666666;
    }
    .set-price-selling {
      font-weight: 500;
      font-size: 18px;
      line-height: 25px;
      color: #333333;
    }
    .set-price-selling-tip {
      margin: 13px 0 16px 0;
      font-size: 14px;
      line-height: 18px;
      font-weight: 400;
      color: #666666;
    }
    .set-selling-box {
      display: flex;
      justify-content: space-between;
      .set-price-selling-end {
        padding: 8px 8px 8px 16px;
        box-sizing: border-box;
        width: 284px;
        height: 56px;
        background: #ffffff;
        border-radius: 10px;
        display: flex;
        align-items: center;
        .input-box {
          position: relative;
          display: inherit;
          input {
            opacity: 0;
            width: 18px;
            height: 18px;
          }
          label {
            position: absolute;
            font-size: 0;
            z-index: 1;
            left: 0;
            top: 0;
            img {
              width: 18px;
              height: 18px;
            }
          }
        }
        .price-tip {
          margin-left: 8px;
          font-weight: 500;
          font-size: 14px;
          line-height: 18px;
          color: #979797;
          // flex-shrink: 0;
          width:128px
        }
        .price-default {
          // margin-left: 34px;
          margin-right: 6px;
          font-size: 14px;
          line-height: 18px;
          color: #979797;
        }
        .input-selling-box {
          &.active {
            background-color: #fff;
            .input-selling {
              background-color: #fff;
              color: #333333;
              box-shadow: 0px 0px 20px rgba(51, 51, 51, 0.15);
            }
          }
          .input-selling {
            padding-left: 14px;
            box-sizing: border-box;
            border: none;
            outline: none;
            width: 80px;
            height: 40px;
            background: #eeeeee;
            border-radius: 8px;
            font-size: 14px;
            line-height: 18px;
            color: #979797;
          }
        }
      }
    }
    .save-button-box {
      margin-top: 40px;
      display: flex;
      justify-content: center;
      
      .save-button {
        &.save-btn-active {
          opacity: 1;
          cursor: pointer;
          &:hover {
            opacity: .6;
          }
          &:active {
            opacity: .8;
          }
        }
        background: #333333;
        opacity: 0.1;
        height: 48px;
        text-align: center;
        line-height: 48px;
        width: 240px;
        border-radius: 48px;
        color: #ffffff;
      }
    }
  }
}
</style>