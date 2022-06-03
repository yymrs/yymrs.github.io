<template>
  <div class="website-style-component">
    <div class="title">
      Color Templates
    </div>
    <div class="setup-website-style-box">
      <div class="setup-website-style">
        <div class="common-website-style">
          <div class="single-style" @click="selcetStyle(item,index)" v-for="(item,index) in commonStyle" :key="index">
            <div class="bk-style" :class="{selcet:item.default}" :style="{background:item.bgColor}">
              <img class="selcet-icon" v-if="item.default" src="@/static/checkYellow@2x.png" alt="">
              <div class="text-style" :style="{color:item.textColor}">Aa</div>
              <div class="button-style" :style="{background:item.buttonColor,color:item.buttonTextColor}">
                Aa
              </div>
            </div>  
          </div>
        </div>
        <!-- <div class="self-website-style">
        </div> -->
        <div class="save-style">
          <div class="save-button" @click="saveStyle" :class="{edit:edit}">
            Save
          </div>
        </div>
      </div>
      <div class="setup-website-style-preview-box">
        <div class="setup-website-style-preview web-bk-color" :class="{cssWhite}">
          <div class="title text-color">
            Template Preview
          </div>
          <div class="banner button-bk-color">
            <p class="store-name button-color">Store name</p>
            <p class="welcome button-color">Welcome to my store and wish you happy shopping</p>
            <span class="circular circular1"></span>
            <span class="circular circular2"></span>
            <span class="circular circular3"></span>
            <span class="circular circular4"></span>
          </div>
          <!-- <div class="drops">
            <p class="title text-color">Drops</p>
            <div class="drops-list-box">
              <img class="arrow left-arrow" src="../../../static/productDetail/left@2x.png"/>
              <img class="arrow right-arrow" src="../../../static/productDetail/right@2x.png" alt="" />
              <div class="drops-list">
                <div class="single-drops" v-for="i in 7" :key="i">
                  <div class="circular"></div>
                  <div class="name">
                    <span class="text-color">Drop {{i}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div> -->
          <div class="all-products">
            <div class="all-products-header">
              <span class="title text-color">All Products</span>
              <div class="sort button-bk-color">
                <span class="button-color">Sort</span>
                <img src="@/static/downW@2x.png" alt="">
              </div>
            </div>
            <div class="products-list">
              <div class="products-single" v-for="i in 16" :key="i">
                <div class="products-main-img">
                  <img v-imgError:big src="@/static/preview@2x.png" alt="">
                </div>
                <div class="products-info">
                  <p class="name"><span class="text-color">PRODUCT {{i}}</span></p>
                  <p class="price"><span class="text-color">$XX.XX</span></p>
                </div>
              </div>
            </div>
            <div class="more-products">
              <div class="more-button button-bk-color">
                <p class="button-color">Load more products</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <LevaePageComponent :dialogLeave.sync='dialogLeave' :parentInfo='parentInfo'  @confirm='confirm' />
  </div>
</template>

<script>
import LevaePageComponent from '@/views/myStore/components/leavePage.vue'
import { personalStoreConfig, getShopStyleConfig } from '@/api/storeSetting'
export default {
components:{
  LevaePageComponent
},
beforeRouteLeave(to, from, next) {
  // 导航离开该组件的对应路由时调用
  // 可以访问组件实例 `this`
  this.beforeunloadFn(next)
},
data() {
  return {
    commonStyle:[
      {textColor:'#000',buttonTextColor:'#fff',bgColor:'#ECE6D7',buttonColor:'#000',default:0,templateCode:1},
      {textColor:'#000',buttonTextColor:'#fff',bgColor:'#fff',buttonColor:'#000',default:0,templateCode:2},
      {textColor:'#9D81BF',buttonTextColor:'#fff',bgColor:'#EFEBFD',buttonColor:'#9D81BF',templateCode:3},
      {textColor:'#8BAABF',buttonTextColor:'#6BA5CE',bgColor:'#D3E7F5',buttonColor:'#fff',default:0,templateCode:4},
      {textColor:'#B8737F',buttonTextColor:'#fff',bgColor:'#F7E0E8',buttonColor:'#C67085',default:0,templateCode:5},
      {textColor:'#fff',buttonTextColor:'#7776B6',bgColor:'#6E6D9A',buttonColor:'rgba(255, 255, 255, 0.8)',default:0,templateCode:6},
      {textColor:'#B4839D',buttonTextColor:'#fff',bgColor:'linear-gradient(90deg, #EEDEDE 0%, #DEEEED 100%)',buttonColor:'linear-gradient(90deg, #D67296 0%, #5AB3E4 100%)',default:0,templateCode:7},
      {textColor:'#A38333',buttonTextColor:'#fff',bgColor:'linear-gradient(90deg, #F4C4C3 0%, #ECE6D7 100%)',buttonColor:'linear-gradient(90deg, #F185A9 0%, #E6CE90 100%)',default:0,templateCode:8},
      {textColor:'#fff',buttonTextColor:'#71538F',bgColor:'linear-gradient(90deg, #887A98 0%, #CBB9D8 100%)',buttonColor:'#fff',default:0,templateCode:9},
    ],
    currentSelectStyle:{

    },
    cssWhite:false,
    edit:false,
    parentInfo:{
      title:'Unsaved Changes',
      tip:'You have unsaved changes,are you sure you want to leave this page?',
      confirm:'Leave',
      cancel:'Cancel' 
    },
    dialogLeave:false,
    nextOrigin:null
  }
},
mounted() {
  this.getShopStyleConfig()
},

methods:{
  // copy数据
  copyData() {
    this.commonStyle=this.commonStyle.map((item)=>{
      if(item.default) {
        this.$set(item,'originSelect',true)
      }else {
        this.$set(item,'originSelect',false)
      }
      console.log(item);
      return item
    })
  },
  // 获取设置样式
  getShopStyleConfig(fun) {

    getShopStyleConfig({},(res)=>{
      const {result} = res
      const initStyle = this.commonStyle.find((item)=>{
        if(item.templateCode===Number(result.templateCode)) {
          this.$set(item,'default',1)
          this.$set(item,'originSelect',true)
          return true
        }
      })
      if(initStyle) {
        this.currentSelectStyle = initStyle;
      }else {
        this.$set(this.commonStyle[0],'default',1)
        this.$set(this.commonStyle[0],'originSelect',true)
        this.currentSelectStyle = this.commonStyle[0];
      }
      fun&&fun()
      this.changeTheme();
    },()=>{

    },()=>{
      this.copyData()
    })
  },
  // 离开页面弹框
  beforeunloadFn(next) {
    if(this.edit) {
      this.dialogLeave = true
      this.nextOrigin = next
    }else {
      next()
    }
  },
  // 弹框确认
  confirm() {
    // 确认离开页面操作恢复数据
    this.currentSelectStyle = {textColor:'#000',buttonTextColor:'#fff',bgColor:'#ECE6D7',buttonColor:'#000',default:1,originSelect:true},
    this.dialogLeave = false
    this.edit = false
    this.resetCommonStyle()
    this.changeTheme()
    this.nextOrigin()
  },
  // 恢复默认颜色设置
  resetCommonStyle() {
    this.commonStyle.map((item)=>{
      if(item.originSelect) {
        this.currentSelectStyle = item
        item.default = 1
      }else {
        item.default = 0
      }
    })
  },
  // 选中样式
  selcetStyle(item,index) {
    this.commonStyle.map((item,_index)=>{
      if(index == _index) {
        item.default = 1
      }else {
        item.default = 0
      }
    })
    this.currentSelectStyle = item;
    this.changeTheme();
    this.editStyle()
  },
  editStyle() {
    const styleItem = this.commonStyle.find(item=>{
      return item.default == 1        
    })
    console.log(styleItem);
    this.edit = !styleItem.originSelect
  },
  changeTheme() {
    const {textColor,buttonTextColor,bgColor,buttonColor} = this.currentSelectStyle
    if(bgColor=='#fff') {
      this.cssWhite = true
    }else {
      this.cssWhite = false
    }
    // 调用 less.modifyVars 方法来改变变量值
    window.less.modifyVars({
      '@webTextColor': textColor,
      '@webButtonTextColor':buttonTextColor,
      '@webBkColor': bgColor,
      '@webButtonBkColor': buttonColor,
    })
  },
  // 保存小b样式
  saveStyle() {
    if(!this.edit) return;
    const loading = this.$loading({
      lock: true,
      text: "",
      spinner: "el-icon-loading",
      background: "rgba(51,51,51,0.25)",
    });
    const data = {
      templateCode:this.currentSelectStyle.templateCode,
    }
    personalStoreConfig(data,()=>{
      this.getShopStyleConfig(this.editStyle)
    },()=>{
      this.resetCommonStyle()
    },()=>{
      loading.close()
    })
  }
}
}
</script>

<style lang="less">
.website-style-component {
  .title {
    font-weight: bold;
    font-size: 18px;
    line-height: 24px;
    color: #000000;
    margin-bottom: 16px;
  }
  .setup-website-style-box {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .setup-website-style {
      
      .common-website-style {
        display: grid;
        grid-template-columns: repeat(3,160px);
        grid-gap: 16px;
        // display: flex;
        // flex-wrap: wrap;
        .single-style {
          // margin: 0 16px 16px 0;
          .bk-style {
            position: relative;
            cursor: pointer;
            &.selcet {
              border: 1px solid #C79818;
            }
            &:hover {
              opacity: .8;
            }
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            padding: 19px 0;
            box-sizing: border-box;
            width: 160px;
            height: 120px;
            // background: #FFFFFF;
            border: 1px solid #EEEEEE;
            box-sizing: border-box;
            border-radius: 10px;
            text-align: center;
            .text-style {
              font-weight: 500;
              font-size: 24px;
              line-height: 33px;
              text-align: center;
              // color: #000000;
            }
            .selcet-icon {
              position: absolute;
              top: 8px;
              left: 8px;
              z-index: 1;
              width: 24px;
              display: block;
            }
            .button-style {
              display: inline-block;
              width: 98px;
              height: 32px;
              // background: #000000;
              font-weight: 500;
              font-size: 24px;
              line-height: 33px;
            }
          }
        }
      }
      .save-style {
        margin: 30px 0;
        .save-button {
          width: 229px;
          height: 56px;
          background: #333333;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
          border-radius: 40px;
          text-align: center;
          line-height: 56px;
          color: #fff;
          font-size: 18px;
          font-weight: bold;
          opacity: .1;
          &.edit {
            cursor: pointer;
            opacity: 1;
            &:active {
              opacity: .8;
            }
            &:hover {
              opacity: .6;
            }
          }
        }
      }
    }
  }
  .setup-website-style-preview-box {
    @media screen and (min-width: 1066px) {
      height: 100%;
      overflow: auto;
      position: fixed;
      right: 0;
      top: 66px;
    }
    .setup-website-style-preview {
      width: 400px;
      // height: 100%;
      box-sizing: border-box;
      padding: 23px 23px 71px;
      background: #ECE6D7;
      &.cssWhite {
        border: 1px solid #EEEEEE;
      }
      .title {
        font-weight: bold;
        font-size: 18px;
        line-height: 24px;
        color: #000000;
      }
      .banner {
        width: 354px;
        height: 109px;
        // line-height: 109px;
        display: flex;
        align-items: center;
        flex-direction: column;
        background: #000000;
        position: relative;
        text-align: center;
        overflow: hidden;
        .circular {
          position: absolute;
          border-radius: 50%;
          height: 100px;
          width: 100px;
          &.circular1 {
            left: 8.78px;
            top: 46.87px;
            border: 2px solid rgba(216, 216, 216, 0.5);
          }
          &.circular2{
            width: 108.25px;
            height: 107.55px;
            left: 56.68px;
            top: -17.08px;
            background: rgba(216, 216, 216, 0.5);
            // opacity: 0.5;
          }
          &.circular3{
            width: 128.73px;
            height: 127.89px;
            left: 179.93px;
            top: 4.36px;

            border: 2px solid rgba(216, 216, 216, 0.5);
            box-sizing: border-box;
          }
          &.circular4{
            width: 70.21px;
            height: 69.76px;
            left: 249.77px;
            top: 33.43px;
            background: rgba(216, 216, 216, 0.5);
            // opacity: 0.5;
          }
        }
        .welcome {
          font-weight: 500;
          position: relative;
          z-index: 1;
          // max-width: 130px;
          font-size: 6px;
          color: #fff;
        }
        .store-name {
          margin: 41px 0 6px;
          font-weight: bold;
          font-size: 14px;
          line-height: 19px;
          text-align: center;
          position: relative;
          z-index: 1;
          color: #fff;
          text-transform: uppercase;
        }
      }
      .drops {
        margin-top: 16px;
        .title {
          font-weight: bold;
          font-size: 10px;
          line-height: 12px;
          color: #000000;
          text-transform: uppercase;
        }
        .drops-list-box {
          position: relative;
          .arrow {
            position: absolute;
            display: block;
            top: 20px;
            height: 4px;
            &.left-arrow {
              left: -6px;
            }
            &.right-arrow {
              right: -6px;
            }
          }
          .drops-list {
            display: flex;
            overflow: hidden;
            
            .single-drops {
              margin-right: 12.3px;
              text-align: center;
              .circular {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: #EEEEEE;
                margin-bottom: 7px;
              }
              .name {
                width: 40px;
                text-align: center;
                span {
                  white-space: nowrap;
                  color: #333333;
                  display: block;
                  transform: scale(.5);
                  font-weight: 500;
                  font-size: 14px;
                  line-height: 10px;
                }
              }
            }
          }
        }
        
      }
      .all-products {
        margin-top: 29px;
        .all-products-header {
          display: flex;
          justify-content: space-between;
          .title {
            font-weight: bold;
            font-size: 10px;
            line-height: 14px;
            text-transform: uppercase;
            color: #000000;
          }
          .sort {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 50px;
            height: 12px;
            text-align: center;
            background: #000000;
            color: #fff;
            font-weight: 500;
            span {
              display: block;
              font-size: 20px;
              width: 19px;
              transform: scale(.5);
            }
            img {
              display: inline-block;
              margin-left: 4px;
              height: 6px;
            }
          }
        }
        .products-list {
          display: grid;
          grid-template-columns: repeat(4,1fr);
          // grid-template-rows: repeat(4,105px);
          grid-gap: 8px 22px;
          .products-single {
            .products-main-img {
              height: 105px;
              background: #F3F3F3;
              display: flex;
              align-items: center;
              justify-content: center;
              img {
                width: 41.88px;
                height: 35.62px;
              }
            }
            .products-info {
              text-transform: uppercase;
              color: #000000;
              text-align: left;
              .name {
                margin: 9px 0 4px 0;
                span {
                  position: relative;
                  right: 14px;
                  display: block;
                  font-weight: bold;
                  font-size: 12px;
                  transform: scale(.6);
                  line-height: 11px;
                  color: #000000;
                }
              }
              .price {
                span {
                  position: relative;
                  right: 18px;
                  display: block;
                  font-size: 12px;
                  transform: scale(.5);
                  line-height: 10px;
                }
              }
            }
          }
        }
        .more-products {
          margin-top: 23px;
          display: flex;
          justify-content: center;
          .more-button {
            width: 84px;
            height: 16px;
            background: #000000;
            color: #FFFFFF;
            text-transform: uppercase;
            font-weight: bold;
            p {
              font-size: 12px;
              position: relative;
              right: 15px;
              white-space: nowrap;
              transform: scale(.5);
            }
          }
        }
      }
      
    }
  }
}

</style>