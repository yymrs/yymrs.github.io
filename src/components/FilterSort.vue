<template>
  <div class="filter-sort" :class="isTourist?'is-tourist':''">
    <div class="product-filter">
      <el-select v-model="filterVal.region" ref="shipsFrom" :popper-append-to-body='false' clearable placeholder="Ships From" @change="regionChange">
        <el-option
          v-for="item in filterVal.regionOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="filterVal.time" ref="shippingTime" :popper-append-to-body='false' clearable placeholder="Shipping Time" @change="timeChange">
        <el-option
          v-for="item in filterVal.timeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="filterVal.inventory" ref="inventory" :popper-append-to-body='false' clearable placeholder="Inventory" @change="inventoryChange">
        <el-option
          v-for="item in filterVal.inventoryOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-show="isSort" v-model="filterVal.sort" ref="filterSort" clearable placeholder="Sort" @change="sortChange">
        <el-option
          v-for="item in filterVal.sortOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div v-show="false" class="classify-query" v-for="(item, index) in querylists" :key="index" @click="showQueryTerm(item)" :class="item.selectFlag ? '' : 'isNotActive'"
      :style="{ 'background': item.selectFlag?'#333333':'#eeeeee', 'color': item.selectFlag?'#ffffff':'#333333' }">
      <img v-if="!item.selectFlag" :src="item.img" alt="">
      <img v-if="item.selectFlag" :src="item.imgWhite" alt="">
      <span>{{ item.value }}</span>
    </div>
    <el-dialog :modal-append-to-body="false" :modal="true" @close="dialogClose()"
      class="dialog-filter" title="Filters" :visible.sync="dialogVisibleFilter" width="400" center>
      <div class="clear-all" @click="clearAll">
        Clear All
      </div>
      <div class="shipping-time">
        Shipping Time
      </div>
      <el-radio v-model="dateValue" :label="item.value" v-for="(item, index) in datelists" :key="index">
        {{ item.text }}
        <img v-if="dateValue === item.value" src="@/static/check@2x.png" alt="">
        <img v-else src="@/static/nocheck@2x.png" alt="">
      </el-radio>
      <div class="dialog-filter-text">
        <div>Earn</div>
        <div>${{ filterValue[0] }} - ${{ filterValue[1] }}{{ filterValue[1]===30?'+':'' }}</div>
      </div>
      <el-slider class="dialog-filter-slider" v-model="filterValue" range :max="30" :step="1"></el-slider>
      <div slot="footer" class="dialog-footer">
        <div class="dialog-btntext" @click="dialogFilterApply(filterValue)">Apply</div>
      </div>
    </el-dialog>
    <el-dialog :modal-append-to-body="false" :modal="true" @close="dialogClose()"
      class="dialog-sort" title="Sort by" :visible.sync="dialogVisibleSort" width="400" center>
      <el-radio v-model="sortValue" :label="item.label" v-for="(item, index) in sortlists" :key="index" @click.prevent.native="dialogSort(item.label)">
        {{ item.text }}
        <img v-if="sortValue === item.label" src="@/static/check@2x.png" alt="">
        <img v-else src="@/static/nocheck@2x.png" alt="">
      </el-radio>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "FilterSort",
  props: {
    sortValue: {
      type: String,
      default: 'Featured'
    },
    isSort: {
      type: Boolean,
      default: true
    },
    hiddenFilter:{
      type:Object,
      default(){
        return {}
      }
    }
  },
  data() {
    return {
      querylists: [
        { selectFlag: false, img: require('@/static/filter@2x.png'), imgWhite: require('@/static/filterWhite@2x.png'), value: 'Filter' },
        { selectFlag: false, img: require('@/static/sort@2x.png'), imgWhite: require('@/static/sortWhite@2x.png'), value: 'Sort' }
      ],
      dialogVisibleFilter: false,
      dialogVisibleSort: false,
      filterValue: [0, 30],
      sortlists: [
        {label:'Featured', text: 'Featured'},
        {label:'Newest', text: 'Newest'},
        {label:'EarnDesc', text: 'Earn (High to Low)'},
        {label:'EarnAsc', text: 'Earn (Low to High)'}
      ],
      datelists: [
        {value:'1', text: '2 - 5 Business Days'},
        {value:'2', text: '5 - 10 Business Days'},
      ],
      dateValue:'',
      filterValueflag: false,
      sortValueflag: 'Featured',
      value1: 0,
      filterVal: {
        region: '',
        regionOptions: [
          {
            value: 1,
            label: 'USA'
          },
          {
            value: 2,
            label: 'Overseas'
          }
        ],
        time: '',
        timeOptions: [
          {
            value: 1,
            label: '2 - 5 Business Days'
          },
          {
            value: 4,
            label: '5 - 8 Business Days'
          },
          {
            value: 2,
            label: '5 - 10 Business Days'
          },
        ],
        inventory : '',
        inventoryOptions: [
          {
            value: 25,
            label: 'More than 25'
          },
          {
            value: 50,
            label: 'More than 50'
          },
          {
            value: 100,
            label: 'More than 100'
          }
        ],
        sort : '',
        sortOptions: [
          {
            value: 'Featured',
            label: 'Featured'
          },
          {
            value: 'Newest',
            label: 'Newest'
          },
          {
            value: 'shoppurchasepricedesc',
            label: 'Product Cost (High to Low)'
          },
          {
            value: 'shoppurchasepriceasc',
            label: 'Product Cost (Low to High)'
          }
        ]
      }
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.copyFilterVal()
  },
  methods: {
    copyFilterVal(){
      this.filterVal.oldRegionOptions = JSON.parse(JSON.stringify(this.filterVal.regionOptions));
      this.filterVal.oldTimeOptions = JSON.parse(JSON.stringify(this.filterVal.timeOptions));
    },
    showQueryTerm(val) {
      this.$emit('queryTerm', val);
      if( val.value === 'Filter' ) { this.dialogVisibleFilter = true; }
      if( val.value === 'Sort' ) { this.dialogVisibleSort = true; }
    },
    dialogFilterApply(val) {
      this.filterValueflag = true;
      this.dialogVisibleFilter = false;
      let date = undefined;
      if(this.dateValue) {
        date = this.dateValue -0;
      }
      this.$emit('filterApply', val,date);
    },
    dialogSort(val) {
      this.sortValueflag = val;
      this.dialogVisibleSort = false;
      if(val==='Featured') { this.querylists[1].selectFlag = false; }
      this.$emit('sortApply', val);
    },
    dialogClose() {
      if((this.filterValue[0]===0) && (this.filterValue[1]===30)&&!this.dateValue) { this.querylists[0].selectFlag = false; }
      if(this.sortValueflag==='Featured') { this.querylists[1].selectFlag = false; }
      if(this.$route.path=='/products/classify') {
        setTimeout(()=>{
          this.$emit('classify', false);
        },300)
      }
    },
    // 清楚过滤条件
    clearAll() {
      this.filterValue = [0, 30];
      this.dateValue = '';
    },
    // Ships From
    regionChange(val,flag=true) {
      const shipsFrom = this.$refs.shipsFrom.$el
      if(val==='') {
        shipsFrom.querySelector('input').style.cssText = "width: 120px;";
        shipsFrom.querySelector('.el-input .el-select__caret').style.cssText = "color: #333333;";
      } else {
        shipsFrom.querySelector('input').style.cssText = "width: 120px;background: #333333;color: #ffffff;";
        shipsFrom.querySelector('.el-input .el-select__caret').style.cssText = "color: #ffffff;";
      }
      this.changeShipFrom(val);
      if(flag) {
        this.$emit('regionChange', val,true);
      }else {
        this.$emit('regionChange', val,false);
      }
    },
    changeShipFrom(val) {
      if(val) {
        this.filterVal.timeOptions = this.filterVal.oldTimeOptions.filter(item=>{
          // USA
          if(val===1) {
            return item.value==val
          }
          return item.value==val||item.value==4
        })
      }else {
        this.filterVal.timeOptions = this.filterVal.oldTimeOptions
      }
    },
    changeShipTime(val) {
      if(val=='') {
        this.filterVal.regionOptions = this.filterVal.oldRegionOptions
      }else {
        this.filterVal.region = val;
        this.filterVal.regionOptions = this.filterVal.oldRegionOptions.filter(item=>{
          // 4的话就返回来源的值是2的地区
          if(val==4) {
            return item.value==2
          }else {
            return item.value==val
          }
        })
        if(val==4) {
          this.filterVal.region = 2
          this.regionChange(2,false)
        }else {
          this.regionChange(val,false)
        }
      }
    },
    timeChange(val) {
      const shippingTime = this.$refs.shippingTime.$el
      if(val==='') {
        shippingTime.querySelector('input').style.cssText = "width: 140px;";
        shippingTime.querySelector('.el-input .el-select__caret').style.cssText = "color: #333333;";
      } else if(val === 3) {
        shippingTime.querySelector('input').style.cssText = "width: 110px;background: #333333;color: #ffffff;";
        shippingTime.querySelector('.el-input .el-select__caret').style.cssText = "color: #ffffff;";
      } else {
        shippingTime.querySelector('input').style.cssText = "width: 180px;background: #333333;color: #ffffff;";
        shippingTime.querySelector('.el-input .el-select__caret').style.cssText = "color: #ffffff;";
      }
      // 根据time的值来更改ship from的状态
      this.changeShipTime(val);
      this.$emit('timeChange', val);
    },
    inventoryChange(val) {
      const inventory = this.$refs.inventory.$el
      if(val==='') {
        inventory.querySelector('input').style.cssText = "width: 110px;";
        inventory.querySelector('.el-input .el-select__caret').style.cssText = "color: #333333;";
      } else {
        inventory.querySelector('input').style.cssText = "width: 145px;background: #333333;color: #ffffff;";
        inventory.querySelector('.el-input .el-select__caret').style.cssText = "color: #ffffff;";
      }
      this.$emit('inventoryChange', val);
    },
    sortChange(val) {
      const filterSort = this.$refs.filterSort.$el
      if(val==='') {
        filterSort.querySelector('input').style.cssText = "width: 75px;";
        filterSort.querySelector('.el-input .el-select__caret').style.cssText = "color: #333333;";
      } else if(val==='Featured' || val==='Newest') {
        filterSort.querySelector('input').style.cssText = "width: 105px;background: #333333;color: #ffffff;";
        filterSort.querySelector('.el-input .el-select__caret').style.cssText = "color: #ffffff;";
      } else {
        filterSort.querySelector('input').style.cssText = "width: 220px;background: #333333;color: #ffffff;";
        filterSort.querySelector('.el-input .el-select__caret').style.cssText = "color: #ffffff;";
      }
      this.$emit('sortChange', val);
    }
  }
};
</script>

<style lang="less">
/* 过滤下拉框的样式 */
.el-select-dropdown.el-popper {
  background: #FFFFFF;
  border: 1px solid #EEEEEE;
  box-sizing: border-box;
  box-shadow: 0px 10px 25px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
}
.filter-sort {
  // overflow: auto;
  margin-left: 10px;
  display: inherit;
  width: calc( 100% - 10px);
  .classify-query {
    cursor: pointer;
    background: #EEEEEE;
    border-radius: 20px;
    padding: 0 15px 0 14px;
    margin-left: 24px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    & > img {
      vertical-align: middle;
      width: 24px;
      height: 24px;
    }
  }
  .classify-query.isNotActive:hover {
    background: #D9D9D9 !important;
  }
  .classify-query:active {
    opacity: 0.8;
  }
  .dialog-filter {
    .el-dialog {
      margin-top: -176px !important;
      height: 352px;
      width: 400px;
      .el-dialog__body {
        padding-top: 16px;
        // height: 98px;
        .shipping-time {
          font-weight: 600;
          font-size: 18px;
          line-height: 24px;
          color: #000000;
          margin-bottom: 8px;
        }
        .clear-all {
          cursor: pointer;
          position: absolute;
          top: 21px;
          font-size: 14px;
          font-style: normal;
          font-weight: 600;
          line-height: 18px;
          text-align: left;
          color: #333;
        }
        .dialog-filter-text {
          margin-top: 5px;
          display: inline-flex;
          align-items: center;
          & > div:first-child {
            font-weight: 600;
            font-size: 18px;
            color: #000000;
          }
          & > div:nth-child(2) {
            font-weight: 500;
            font-size: 14px;
            color: #333333;
            position: absolute;
            right: 24px;
          }
        }
        .dialog-filter-slider {
          padding: 16px 0;
        }
        .el-slider__bar {
          background-color: #333333;
        }
        .el-slider__runway {
          background-color: #979797;
        }
        .el-slider__button {
          border-color: #333333;
          background: #333333;
        }
        .el-slider__button-wrapper {
          background: rgba(51, 51, 51, 0.2);
          border-radius: 18px;
        }
        .el-slider__button {
          height: 8px;
          width: 8px;
        }
        .el-slider__button-wrapper {
          height: 24px;
          width: 24px;
          top: -10px;
        }
        .el-radio {
          display: block;
          height: 40px;
          margin-right: 0;
          margin-bottom: 8px;
          background: #ffffff;
          border-radius: 8px;
          font-weight: 500;
          font-size: 14px;
          line-height: 18px;
          color: #333333;
          .el-radio__input {
            display: none;
          }
          .el-radio__label {
            padding-left: 16px;
            line-height: 40px;
            height: 40px;
            color: #333333;
            img {
              width: 18px;
              height: 18px;
              position: absolute;
              right: 11px;
              top: 11px;
            }
          }
        }
      }
      .dialog-btntext {
        width: 300px;
        height: 48px;
        justify-content: center;
        align-items: center;
        display: inline-flex;
        border-radius: 25px;
      }
    }
  }
  .dialog-sort {
    .el-dialog {
      margin-top: -134.5px !important;
      height: 269px;
      width: 400px;
      .el-dialog__body {
        padding-top: 18px;
        .el-radio {
          display: block;
          height: 40px;
          margin-right: 0;
          margin-bottom: 8px;
          background: #ffffff;
          border-radius: 8px;
          .el-radio__input {
            display: none;
          }
          .el-radio__label {
            padding-left: 16px;
            line-height: 40px;
            height: 40px;
            color: #333333;
            img {
              width: 18px;
              height: 18px;
              position: absolute;
              right: 11px;
              top: 11px;
            }
          }
        }
      }
    }
  }
  .product-filter {
    // margin-left: 10px;
    display: flex;
    // overflow-y: hidden;
    width: 100%;
    input {
      background: #EEEEEE;
      border: none;
      border-radius: 20px;
      height: 40px;
      font-weight: 500;
      font-size: 14px;
    }
    input:hover {
      background: #D9D9D9;
    }
    input::-webkit-input-placeholder {
      color: #333333;
      font-weight: 500;
      font-size: 14px;
    }
    input::-moz-placeholder {
      color: #333333;
      font-weight: 500;
      font-size: 14px;
    }
    .el-select:first-child, .el-select:nth-child(2), .el-select:nth-child(3) { margin-right: 24px; }
    .el-select:first-child input { width: 120px; }
    .el-select:nth-child(2) input { width: 140px;}
    .el-select:nth-child(3) input { width: 110px;}
    .el-select:last-child input { width: 75px;}
    .el-select .el-input .el-select__caret {
      color: #333333;
      font-weight: bold;
    }
    .el-select .el-input .el-select__caret.el-icon-circle-close {
      color: #ffffff;
      font-weight: bold;
      font-size: 16px;
      margin-top: -2px;
    }
    .el-select .el-input .el-select__caret.el-icon-circle-close:before {
      content: "\e6db" !important;
    }
    .el-select .el-input .el-select__caret.el-icon-circle-close:hover {
      background: #666666;
      border-radius: 20px;
      width: 20px;
      height: 20px;
      line-height: 20px;
      margin-top: 9px;
      margin-right: 2.5px;
      color: #FFFFFF;
    }
    .el-select .el-input.is-focus .el-input__inner { border-color: #EEEEEE; }
  }
}
.filter-sort.is-tourist {
  margin-left: -3px;
  width: 100%;
}
</style>