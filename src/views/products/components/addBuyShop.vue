<template>
  <div class="add-buy-shop">
    <el-dialog
      title="Buy Sample"
      custom-class="add-buy-shop-dialog"
      :visible.sync="openAddBuyShop"
      width="430px"
      center
      :before-close="handleClose"
    >
      <div class="select-spec-img">
        <img v-if="!hoverSkuImg" draggable="false" :src="currentSelectSku.image" alt="" />
        <img v-else :data-active='hoverSkuImg' class="current-img hovesku-img" ref="hovesku-img" :src="hoveSkuImage" alt="">
      </div>
      
      <!-- 商品规格 -->
        <!-- 1.规格都可以选择，2.选择之前需要计算出当前规格是否在有货的sku，3.默认初始化一个sku规格 -->
        <div class="product-sku" v-if="productInfo.dimensions">
          <div class="select-spec">
            <div class="single-select" v-for="(spec,index) in productInfo.dimensions" :key="index">
              <div class="single-select-name">
                {{spec.name}}: <span v-if="colorList.includes(spec.name)">{{hoverSkuImg||hoverSkuSpec?hoverSkuInfo[spec.name]:cuomputedSelectSku[spec.name]}}</span>
              </div>
              <div class="single-select-item color hidden-scroll" :ref="'specList'+index" v-scrollView="specList[index]" v-if="colorList.includes(spec.name)">
                <div class="prev scroll" v-if="specList[index]&&specList[index].prev" @click="switchSpec('prev', 'specList',index)">
                   <img
                      class="arrow"
                      src="@/static/productDetail/left@2x.png"
                      alt=""
                    />
                </div>
                <div class="select-img-list">
                  <div class="select-img" @mouseleave="mouseleaveSkuImg" @mouseover='mouseoverSkuImg(sku.image,sku.dimensionValue,spec.name)' :class="{select:checkIsSelect(sku,spec.name),'has-selcet':hasCurrentSku(spec,sku.dimensionValue[spec.name]),'selcet-nosku':selcetNosku(spec,sku.dimensionValue[spec.name])}"  @click="selectSpecItem(sku,'Color',spec.name)" v-for="(sku,i) in productInfo.newFilterSku" :key="i">
                    <img :src="sku.image" alt="">
                  </div>
                </div>
                <div class="next scroll" v-if="specList[index]&&specList[index].next" @click="switchSpec('next', 'specList',index)">
                   <img
                      class="arrow"
                      src="@/static/productDetail/right@2x.png"
                      alt=""
                    />
                </div>
              </div>
              <div v-else class="single-select-item hidden-scroll" :ref="'specList'+index" v-scrollView="specList[index]">
                <div class="prev scroll" v-if="specList[index]&&specList[index].prev" @click="switchSpec('prev', 'specList',index)">
                   <img
                      class="arrow"
                      src="@/static/productDetail/left@2x.png"
                      alt=""
                    />
                </div>
                <div class="select-spec-item" @mouseleave="mouseleaveSpec" @mouseover='mouseoverSpec(specItem,spec.name)' :class="{select:checkIsSelect(specItem,spec.name),'has-selcet':hasCurrentSku(spec,specItem),'selcet-nosku':selcetNosku(spec,specItem)}" @click="selectSpecItem(specItem,spec.name)" v-for="(specItem,i) in spec.values" :key='i'>
                  {{specItem}}
                </div>
                <div class="next scroll" v-if="specList[index]&&specList[index].next" @click="switchSpec('next', 'specList',index)">
                   <img
                      class="arrow"
                      src="@/static/productDetail/right@2x.png"
                      alt=""
                    />
                </div>
              </div>
            </div>
          </div>
          <div>
          </div>
        </div>



      <div class="select-quantity">
        <div class="name">Quantity: {{hoverSkuImg||hoverSkuSpec?hoverSkuInfo.inventory:getStocksShowInfo(currentSelectSku.stock)}} available <span class="restocking" v-if="currentSelectSku.restock">{{ currentSelectSku.estimateRestockDate }}</span></div>
        <!-- <div class="name">Select Quantity</div> -->
        <div class="input-number">
          <i
            class="el-icon-remove circle"
            @click="quantityHandle('down')"
            :class="{ disable: quantity <= 1 }"
          ></i>
          <span class="shop-numbers">{{ quantity }}</span>
          <i
            class="el-icon-circle-plus circle"
            :class="{ disable: quantity >= currentSelectSku.stock||showPreLaunchTip }"
            @click="quantityHandle('up')"
          ></i>
         
        </div>
        <div class="pre-launch" v-if="productInfo.tagType==6&&showPreLaunchTip">
          {{showPreLaunchTip}}
        </div>
      </div>
      <div class="add-to-bag">
        <div v-elementEvent :class="{disable:currentSelectSku.stock<=0||checkHasPreBuy}" class="add-to-bag-button" @click="addToBag">
          Add to Bag
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addShopToCart } from "@/api/cart";
import successInfo from "@/mixins/successInfo";
import {
  cartEvent
} from "@/api/production";
const colorList = ['Color']
export default {
  props:{
    amplitude:{
      type: Object,
      default: () => {},
    }
  },
  data() {
    return {
      dimensionsOne: [],
      dimensionsList: [], // 规格
      skuList: [], // sku列表
      quantity: 1,
      hasSkuList: [],
      selectSku: {}, //选择sku的数据
      selectSkuValue: {}, //sku的 规格
      addToBagLoading: false,
      lastarrow: true,
      onespecList:{
        next:false,
        prev:false
      },
      specList:[
        {
          next:false,
          prev:false
        },
        {
          next:false,
          prev:false
        },
        {
          next:false,
          prev:false
        }
      ],
      colorList,
      openAddBuyShop:false,
      currentSelectSku:{},
      productInfo:{},
      clickSkuImg:false,
      hoverSkuImg:false,
      hoverSkuSpec:false,
      hoveSkuImage:null,
      showPreLaunchTip:false,
      checkHasPreBuy:false,
      cartEventLoading:false
    };
  },
  mixins: [successInfo],
  computed: {
    oneDimensions() {
      return this.dimensionsList.length == 1;
    },
    cuomputedSelectSku() {
      if(Object.keys(this.currentSelectSku).length === 0) {
        return {}
      }
      const {dimensionValue} = this.currentSelectSku
      return {...dimensionValue}
    },
  },
  methods: {
    open(info) {
      Object.assign(this.$data, this.$options.data.call())
      this.openAddBuyShop = true
      this.productInfo = info
      this.filterSkuImgList()
      this.initSelectSku()
      this.checkPreLaunch()
      this.$nextTick(() => {
        this.computedElmentWidth();
      });
    },
    checkPreLaunch() {
      if(this.productInfo.tagType==6) {
        this.cartEvent()
      }
    },
    // 校验是否可以是pre-launch商品
    cartEvent(type) {
      // if(this.quantity>=2) {
      //   return
      // }
      let data, success, error, complete,number;
      if(type) {
        if(type=='up') {
          number = this.quantity + 1
        }else {
          number = this.quantity - 1
        }
      }else {
        number = this.quantity
      }
      data = {
        "num":number,
        "productId": this.productInfo.id,
        "skuId": this.currentSelectSku.id
      };
      success=()=>{
        this.cartEventLoading = false
        this.showPreLaunchTip = null
        if (this.quantity >= this.currentSelectSku.stock) {
          return;
        }
        if(type) {
          if(type=='up') {
            this.quantity++;
          }else {
            this.quantity--
          }
        }
      }
      error=(res)=>{
        if(res.data.code===500) {
          this.checkHasPreBuy = number == 1?true:false
          if(type) {
            if(type=='down') {
              this.quantity--
            }
          }
          this.cartEventLoading = false
          this.showPreLaunchTip = res.data.message
        }
      }
      complete=()=>{
      }
      if((!this.cartEventLoading&&!this.showPreLaunchTip)||type=='down') {
        if(type=='down'&&this.quantity<=1) {
          return
        }
        this.cartEventLoading = true
        cartEvent(data,success,error,complete)
      }
    },
    mouseleaveSkuImg() {
      this.hoverSkuImg = false
      this.currentImgComputed()
    },
    // 展示当前图片对图片进行判断正方形和长方形来设置容器高度
    currentImgComputed() {
      // let currentImg = this.allImg.querySelectorAll('.current-img')
      // this.$nextTick(()=>{
      //   Array.from(currentImg).forEach((item)=>{
      //     if(item.dataset.active=='true') {
      //       if(item.naturalWidth==0) {
      //         return
      //       }
      //       if(item.naturalWidth == item.naturalHeight) {
      //         item.id = "square";
      //         this.allImg.style.height = 320 + 'px'
      //       }else {
      //         item.removeAttribute('id')
      //         this.allImg.style.height = item.clientHeight + 'px'
      //       }
      //     }
      //   })
      // })
    },
    mouseoverSpec(value,name) {
      const dimensionValue = {...this.cuomputedSelectSku}
      dimensionValue[name] = value
      this.hoverSkuSpec = true
      this.hoverSkuInfo = {...dimensionValue}
      this.tempSkuSpec(this.hoverSkuInfo)
    },
    mouseleaveSpec() {
      this.hoverSkuSpec = false
    },
    // 鼠标悬浮sku图片切换主图 _dimensionValue传进来的sku的dimensionValue
    mouseoverSkuImg(src,_dimensionValue,name) {
      const dimensionValue = {...this.cuomputedSelectSku}
      dimensionValue[name] = _dimensionValue[name]
      this.hoverSkuImg = true
      this.hoveSkuImage = src
      this.hoverSkuInfo = {...dimensionValue}
      this.tempSkuSpec(this.hoverSkuInfo)
    },
    // 临时展示规格售卖数量
    tempSkuSpec(hoverSkuInfo) {
      const findSkuSpec = this.productInfo.skuList.find(sku=>{
        const { dimensionValue } = sku;
        return JSON.stringify(dimensionValue) == JSON.stringify(hoverSkuInfo)
      })
      if(findSkuSpec) {
        this.hoverSkuInfo.stock = findSkuSpec.stock
        this.hoverSkuInfo.inventory = this.getStocksShowInfo(findSkuSpec.stock)
      }else {
        this.hoverSkuInfo.inventory = this.getStocksShowInfo(0)
      }
    },
    // 过滤sku图片列表
    filterSkuImgList() {
      const {dimensions} = this.productInfo
      let colorName,colorIndex=-1;
      const colorList = dimensions.find(item=>{
        if(this.colorList.includes(item.name)) {
          colorIndex = this.colorList.indexOf(item.name)
          return true
        }
      })
      // 查到colorName 的单词
      let newFilterSku = []
      if(colorIndex!=-1) {
        colorName = this.colorList[colorIndex]
        colorList.values.map(item=>{
          this.productInfo.skuList.find(sku=>{
            if(sku.dimensionValue[colorName]===item) {
              newFilterSku.push(sku)
              return true
            }
          })
        })
      }
      this.productInfo.newFilterSku = newFilterSku
    },
    // 初始化可以选择的sku
    initSelectSku() {
      const {skuList} = this.productInfo
      const hasSkutList = skuList
      this.hasSkuList = hasSkutList.filter((sku) => sku.stock > 0);
      if(Number.isInteger(Number(this.skuId))) {
        const bagProduct = hasSkutList.find(item=>item.id === Number(this.skuId))
        this.currentSelectSku = bagProduct?bagProduct:this.hasSkuList.length>0?this.hasSkuList[0]:hasSkutList[0]
        this.clickSkuImg = true
      }else {
        this.currentSelectSku = this.hasSkuList.length>0?this.hasSkuList[0]:hasSkutList[0]
      }
    },
    // 点击规格选择sku _specName图片列表的图片color名称可能是大写或者小写
    selectSpecItem(specItem,name,_specName) {
      let specName
      const _dimensionValue = {...this.cuomputedSelectSku}
      if(name==='Color') {
        specName = specItem.dimensionValue[_specName]
        // this.currentImgComputed()
        _dimensionValue[_specName] = specName
      } else {
        specName = specItem
        _dimensionValue[name] = specName
      }
      // _dimensionValue[name] = specName
      // this.productInfo.skuList.filter(sku=>sku.dimensionValue.Color=='red').map(sku=>{
      //   console.log(sku.dimensionValue);
      // })
      let skuListSelect = false
      this.productInfo.skuList.map((sku) => {
        const { dimensionValue } = sku;
        if (
          JSON.stringify(dimensionValue) == JSON.stringify(_dimensionValue)
        ) {
          skuListSelect = true
          this.currentSelectSku = sku
          if(this.quantity>sku.stock) {
            this.quantity = sku.stock
          }else if (sku.stock&&this.quantity<=0) {
            this.quantity = 1
          }
        }
      });
      // sku列表没有
      if(!skuListSelect) {
        const skuImgObj = this.productInfo.newFilterSku.find(item=>item.dimensionValue.Color===_dimensionValue.Color)
        this.currentSelectSku = {
          dimensionValue:{..._dimensionValue},
          image:skuImgObj?skuImgObj.image:this.productInfo.mainImage,
          stock:0,
          restockRequested:true
        }
        this.quantity = 0
      }
      // 点击sku的图片切换主图显示
      this.clickSkuImg = true
      // console.log(specName);
      // console.log(this.currentSelectSku,'currentSelectSku');
      // console.log(_dimensionValue);
    },
    // 校验是否选中
    checkIsSelect(specItem,specName) {
      // 有dimensionValue说明是sku图片的校验选中
      if(specItem.dimensionValue) {
        return this.cuomputedSelectSku[specName]===specItem.dimensionValue[specName]
      } else {
        return this.cuomputedSelectSku[specName]===specItem
      }
    },
    // 校验是否可以选择
    hasCurrentSku(dimensions, name) {
      // name 规格分类的名称
      let sizeName = dimensions.name; //规格分类名称
      let flag = false;
      if (this.productInfo.dimensions.length == 1) {
        this.hasSkuList.map((hasSku) => {
          let dimension = hasSku.dimensionValue; //当前sku的规格
          // sku规格没有当前是属性 直接返回
          if (dimension[sizeName] == name) {
            flag = true;
          }
        });
      } else {
        // console.log("selectSku", this.cuomputedSelectSku);
        const dimensionValue = this.cuomputedSelectSku; //当前默认选择的sku 规格
        let allserachArr = [];
        let other = {};
        // 从有库存的sku里面查找，不查当前选择
        for (const key in dimensionValue) {
          if (key != sizeName) {
            other[key] = key;
            // console.log("当前的name", name);
            // console.log(key, sizeName);
            // console.log("dimensionValue[key]", dimensionValue[key]);
            // 从有库存的sku里面查找
            this.hasSkuList.forEach((item) => {
              if (item.dimensionValue[key] == dimensionValue[key]) {
                allserachArr.push(item.dimensionValue);
                // return item.dimensionValue;
              }
            });
            // allserachArr = allserachArr.concat(seracharr);
          }
        }
        allserachArr.map((searchDismenValue) => {
          // console.log(dimensionValue[sizeName]);
          if (searchDismenValue && searchDismenValue[sizeName] == name) {

            searchDismenValue == dimensionValue;
            let count = 0;
            for (const key in other) {
              if (searchDismenValue[key] == dimensionValue[key]) {
                count++;
              }
            }
            if (
              count == this.productInfo.dimensions.length - 1 &&
              searchDismenValue[sizeName] == name
            ) {
              flag = true;
            }
          }
        });
      }
      // console.log(flag,'name',name,sizeName);
      return flag;
    },
    // 选中但是没有库存
    selcetNosku(spec,name) {
      const stock = this.currentSelectSku.stock
      if (this.cuomputedSelectSku[spec.name] === name&&stock<=0) {
        return true
      }
    },
    getStocksShowInfo(maxNum){
        if(maxNum){
            if(maxNum <= 100 ){
                return '1-100';
            }
            if((maxNum > 100) && (maxNum <= 200) ){
                return '101-200';
            }
            if((maxNum > 200) && (maxNum <= 300) ){
                return '201-300';
            }
            if((maxNum > 300) && (maxNum <= 400) ){
                return '301-400';
            }
            if((maxNum > 400) && (maxNum <= 500) ){
                return '401-500';
            }
            if((maxNum > 500) && (maxNum <= 1000) ){
                return '501-1000';
            }
            if(maxNum > 1000){
               return '1000+'
            }
        }else {
            return '0';
        }
    },
    // 添加到购物车
    addToBag() {
      if(this.currentSelectSku.stock<=0||this.checkHasPreBuy) {
        return
      }
      var data, success, error, complete;
      if (this.addToBagLoading) {
        return;
      }
      this.addToBagLoading = true;
      data = {
        productId: this.productInfo.id,
        skuId: this.currentSelectSku.id,
        num: this.quantity - 0,
      };
      success = () => {
        let info = {
          title: "Success",
          tip: "Added to Bag",
        };
        this.createdSuccessInfo(info);
        this.$EventBus.$emit("searchCartNumber");
        this.handleClose()
        let uuId = JSON.parse(localStorage.getItem('USERINFO'))?JSON.parse(localStorage.getItem('USERINFO')).uuId:undefined;
        let productInfoOne = this.productInfo;
        let skuInfoOne = this.currentSelectSku;
        this.$gtm.trackEvent({
          event: 'add_to_cart',
          userId: uuId,
          ecommerce: {
            Cstm_add_option: 'add_sample_to_bag',
            items: [{
              item_name: productInfoOne.title,
              item_id: productInfoOne.id,
              price: productInfoOne.minPriceB,
              item_brand: productInfoOne.brand,
              item_category: '',
              item_category2: '',
              item_category3: '',
              item_category4: '',
              item_variant: skuInfoOne.dimensionValue,
              item_list_name: '',
              item_list_id: '',
              index: 1,
              quantity: this.quantity
            }]
          }
        });
      };
      error = (res) => {
        console.log(res);
      };
      complete = () => {
        this.addToBagLoading = false;
      };
      const page_code = this.amplitude.buy_sample.page_code;
      let rankVal;
      this.amplitude.event_value_productsId.forEach((item, index)=>{
        if(item === this.productInfo.id) {
          rankVal = index;
        }
      })
      console.log(222, 'button埋点-----add_to_bag', page_code, [rankVal, this.productInfo.id], this.amplitude.pv_id);
      this.$amplitude.getInstance().logEvent('click', {
        'page_code': page_code,
        'module_code': 'buy_pop_up',
        'position_code': 'add_to_bag',
        'event_target': 'button',
        'event_value': [rankVal, this.productInfo.id],
        'pv_id': this.amplitude.pv_id,
        'url': window.location.href
      });
      addShopToCart(data, success, error, complete);
    },
    // 失去焦点判断有没有值，没有值默认1
    // isNumber() {
    //   if (!this.quantity) {
    //     this.quantity = 1;
    //   }
    // },
    // number() {
    //   this.quantity = this.quantity.replace(/[^\d]/g, "");
    // },
    // 关闭添加购物车
    handleClose() {
      this.openAddBuyShop = false
      // this.$emit("update:openAddBuyShop", false);
    },
    // 初始化sku,过滤有库存的sku
    initSkuStock() {
      this.hasSkuList = this.skuList.filter((sku) => sku.stock > 0);
      console.log(this.hasSkuList);
      this.defautlSelectSku();
    },
    // 默认选择一个sku
    defautlSelectSku() {
      this.selectSku = this.hasSkuList[0];
      const { dimensionValue } = this.selectSku;
      for (const key in dimensionValue) {
        let value = dimensionValue[key];
        this.dimensionsList.forEach((dimensions) => {
          if (dimensions.name == key) {
            let index = dimensions.values.indexOf(value);
            this.$set(dimensions, "index", index);
          }
        });
      }
      this.selectSkuValue = JSON.parse(JSON.stringify(dimensionValue));
    },
   
   
    
    // 修改购买数量
    quantityHandle(type) {
      if(this.productInfo.tagType==6) {
        this.cartEvent(type)
      }else {
        if (type === "up") {
          if (this.quantity >= this.currentSelectSku.stock) {
            return;
          }
          this.quantity++;
        } else {
          if (this.quantity <= 1) {
            return;
          }
          this.quantity--;
        }
      }
    },
    
    computedElmentWidth() {
      // let element = this.$refs.onespecList;
      // this.specList
      const refs = Object.keys(this.$refs)
      for (let index = 0; index < refs.length; index++) {
        const refName = refs[index];
        if(refName.indexOf('specList')!=-1) {
          const num = refName.slice(-1)
          const element = this.$refs['specList'+num][0];
          if(element) {
            if (element.scrollWidth > element.clientWidth) {
              this.specList[num].next = true
            }else {
              this.specList[num].next = false
            }
            this.specList[num].prev = false
          }
        }
      }
      // if(!element) {
      //   return
      // }
      // if (element.scrollWidth > element.clientWidth) {
      //   this.onespecList.next = true
      // }
      // let specListRef = this.$refs.specList;
      // if(!specListRef) {
      //   return
      // }
      // specListRef.map((item,index)=>{
      //   if (item.scrollWidth > item.clientWidth) {
      //     this.specList[index].next = true
      //   }
      // })
      // console.log(this.specList);
    },
    // 切换属性
    switchSpec(type,refname,index) {
      let e = this.$refs[refname+index][0]
      let clientWidth = e.clientWidth-60;
      if (type == "next") {
        let scrollDistance = 0;
        let timer = setInterval(() => {
          let ispeed = 4;
          scrollDistance = scrollDistance + ispeed;
          e.scrollLeft = e.scrollLeft + ispeed;
          if (scrollDistance >= clientWidth) {
            clearInterval(timer);
          }
        }, 2);
      } else {
        let scrollDistance = 0;
        let timer = setInterval(() => {
          let ispeed = 4;
          scrollDistance += ispeed;
          e.scrollLeft = e.scrollLeft - ispeed;
          if (scrollDistance >= clientWidth || e.scrollLeft == 0) {
            clearInterval(timer);
          }
        }, 2);
      }
    },
  },
  
};
</script>

<style lang="less">
.add-buy-shop {
  .add-buy-shop-dialog {
    top: 50%;
    margin-top: 0 !important;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.8);
    box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(25px);
    border-radius: 20px;
    .el-dialog__body {
      padding-top: 16px;
    }
    .el-dialog__header {
      padding-top: 24px;
    }
    
    .select-spec-img {
      font-size: 0;
      text-align: center;
      margin-bottom: 24px;
      img {
        user-select: none;
        width: 160px;
        height: 240px;
        object-fit: cover;
        filter: drop-shadow(0px 5px 20px rgba(0, 0, 0, 0.1));
        border-radius: 20px;
      }
    }
    .select-quantity {
      margin-top: 24px;
      .name {
        font-weight: bold;
        font-size: 14px;
        line-height: 150%;
        color: #333333;
        margin-bottom: 8px;
      }
      .input-number {
        display: flex;
        width: 97px;
        position: relative;
        &:hover .quantity-icon{
          background: #EEEEEE;
        }
        .circle {
          font-size: 20px;
          color: #333;
          cursor: pointer;
          &.disable {
            color: #979797;
            cursor: initial;
          }
        }
        .shop-numbers {
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
          text-align: center;
          color: #333333;
          margin: 0 20px;
        }
      }
      .pre-launch {
        margin-top: 10px;
        font-size: 12px;
        color: #F363A0;
      }
    }
    .add-to-bag {
      display: flex;
      justify-content: center;
      margin: 17px 0 24px 0;
      .add-to-bag-button {
        text-align: center;
        width: 240px;
        height: 48px;
        line-height: 48px;
        background: #c79818;
        border-radius: 50px;
        color: #ffffff;
        font-weight: bold;
        font-size: 18px;
        &.disable {
          cursor: initial !important;
          opacity: .2 !important;
        }
      }
    }
    .product-sku {
      max-width: 616px;
      .select-spec {
        .single-select {
          margin-top: 24px;
          position: relative;
          .single-select-name {
            font-weight: 500;
            font-size: 14px;
            color: #333;
          }
          .single-select-item {
            display: flex;
            overflow-x: auto;
            // flex-wrap: wrap;
            &.color {
              .scroll {
                top: 45px;
              }
            }
            .select-spec-item {
              margin-top: 8px;
              overflow: hidden;
              flex-shrink: 0;
              &.has-selcet {
                background: #EEEEEE;
                color: #333;
                &::before {
                  display: none;
                }
              }
              &:hover:after {
                display: block;
                border: 1px solid #C79818;
                content: '';
                position: absolute;
                display: block;
                top: 0;
                border-radius: 20px;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1;
              }
              &.select {
                background: #333333;
                color: #fff;
                &::before {
                  display: none;
                }
                &::after {
                  display: none;
                }
              }
              &.selcet-nosku {
                background: #F9F9F9;
                color: #D3D3D3;
                &::after {
                  display: block;
                  border: 2px solid #C79818;
                  content: '';
                  position: absolute;
                  display: block;
                  top: 0;
                  border-radius: 20px;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  z-index: 1;
                }
                &::before {
                  display: block;
                }
              }
              background: #F9F9F9;
              font-weight: 500;
              font-size: 14px;
              cursor: pointer;
              margin-right: 16px;
              padding: 7px 16px;
              border-radius: 20px;
              position: relative;
              color: #D3D3D3;
              &::before {
                content: '';
                position: absolute;
                display: block;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                // transform: translate(-50%) rotate(-45deg);
                // background: #D3D3D3;
                background: linear-gradient(
                  to top left,
                  transparent calc(50% - 1px),
                  #D3D3D3,
                  transparent calc(50% + 1px)
                );
              }
            }
          }
        }
      }
      .select-img-list {
        display: flex;
        
        .select-img {
          cursor: pointer;
          margin-right: 8px;
          margin-top: 8px;
          // opacity: .2;
          &:hover {
            position: relative;
            &::before {
              content: '';
              display: block;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 1;
              border: 1px solid #C79818;
              box-sizing: border-box;
              border-radius: 50%;
            }
          }
          &.select {
            position: relative;
            img {
              opacity: 1;
            }
            &::before {
              content: '';
              display: block;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              z-index: 1;
              border: 2px solid #C79818;
              box-sizing: border-box;
              border-radius: 50%;
            }
          }
          &.has-selcet {
            img {
              opacity: 1;
            }
          }
          &.selcet-nosku {
            img {
              opacity: .2;
            }
          }
          img {
            opacity: .2;
            display: block;
            object-fit: cover;
            width: 60px;
            height: 60px;
            border-radius: 50%;
          }
        }
        
      }
      .select-quantity {
        margin-top: 24px;
        .name {
          font-weight: 500;
          font-size: 14px;
          line-height: 150%;
          color: #333333;
          margin-bottom: 8px;
          .restocking {
            color: #C79818;
          }
        }
        .input-number {
          display: flex;
          position: relative;
          width: 86px;
          height: 32px;
          background: #EEEEEE;
          border-radius: 8px;
          align-items: center;
          &.disable {
            .shop-numbers {
              color: #979797;
            }
          }
          .shop-numbers {
            font-weight: 500;
            font-size: 14px;
            line-height: 20px;
            text-align: center;
            color: #333333;
            margin: 0 20px;
          }
          .quantity {
            box-sizing: border-box;
            width: 100%;
            height: 32px;
            background: #ffffff;
            border-radius: 8px;
            border: 0;
            outline: none;
            padding-left: 27px;
            &.surpass {
              color: #f84240;
            }
          }
          .quantity-icon {
            position: absolute;
            // background: #EEEEEE;
            font-weight: bolder;
            width: 20px;
            height: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            right: 6px;
            cursor: pointer;
            color: #333;
            font-weight: border;
            &.el-icon-arrow-up {
              top: 3px;
              &.disable {
                cursor: inherit;
                color: #979797;
              }
            }
            &.el-icon-arrow-down {
              bottom: 3px;
              &.disable {
                cursor: inherit;
                color: #979797;
              }
            }
          }
        }
      }
      .scroll {
        cursor: pointer;
        &.next {
          right: -12px;
          top: 30px;
          color:peru;
        }
        &.prev {
          left: -12px;
          top: 30px;
          opacity: 0.8;
        }
        &:hover {
          opacity: 1;
        }
        position: absolute;
        z-index: 9;
        flex-shrink: 0;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: .8;
        // filter: drop-shadow(0px 2px 6px rgba(0, 0, 0, 0.1));
        .arrow {
          height: 9px;
          // width: 4.5px;
        }
      }
    }
  }
}
</style>