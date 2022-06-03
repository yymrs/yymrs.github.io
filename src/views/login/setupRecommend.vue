<template>
  <div class="setup-recommend">
    <div class="setup-recommend-header">Last Step: Add Some Products</div>
    <div class="setup-recommend-headertwo">And See How It Works</div>
    <div class="setup-recommend-tip">Try adding a few best selling products to your store. Don't worrry, you can always remove them.</div>
    <div class="recommend-card">
      <div class="recommend-card-item" v-for="(item, index) in listcard" :key="index">
        <div class="recommend-card-check">
          <input @input="inputradio(item, index)" :id="index" type="checkbox" v-model="checkGroup" :value="index" :disabled="(checkGroup.length === 1?true:false) && (checkGroup[0] === index?true:false)" />
        </div>
        <div class="recommend-card-info">
          <label :for="index">
            <img v-if="checkGroup.indexOf(index) > -1" src="../../static/check1@2x.png" alt="">
            <img v-else src="../../static/nocheck1@2x.png" alt="">
            <div class="recommend-card-products" :style="`opacity: ${(checkGroup.indexOf(index) > -1)?'0.2':'1'}`">
              <img :src="item.mainImage" alt="">
            </div>
          </label>
        </div>
      </div>
    </div>
    <div class="login-continue-active button-setuprecommend" @click="continueLink()">Add {{ checkGroup.length }} {{ checkGroup.length > 1?'Products':'Product' }}</div>
  </div>
</template>

<script>
import { getHotSaleProduct, addHotSaleProduct } from '@/api/login';

export default {
  name: 'SetupRecommend',
  components: {},
	data() {
		return {
      loading: '',
      checked: '',
      listcard: [],
      cardInfo: [],
      checkGroup: [0]
    }
  },
  computed: {},
  watch:{},
  methods: {
    getList() {
      getHotSaleProduct({
        pageSize: 10000
      }, (res) => {
       if (res.result) {
        this.listcard = res.result
       }
      },
      () => {},
      () => {})
    },
    inputradio(item, index) {
      this.checked = index;
      this.cardInfo = item;
    },
    commonSubmit() {
      let productInfos = []
      for( let i in this.checkGroup ) {
        productInfos.push(
          { productId: this.listcard[this.checkGroup[i]].id }
        )
      }
      addHotSaleProduct({
        productInfos: productInfos
      }, (res) => {
       if (res.success) {
        this.$router.push({path: '/login/setup-success'});
       }
      },
      () => {},
      () => {})
    },
    continueLink() {
      this.commonSubmit();
    }
  },
	created() {
    this.getList();
  },
  mounted() {},
  activated() {}
}
</script>

<style lang="less">
  @import "../../styles/common.less";
  @import "./CommonLogin.less";
  .setup-recommend{
    .setup-recommend-header {
      font-weight: 100;
      font-size: 48px;
      line-height: 40px;
    }
    .setup-recommend-headertwo {
      font-weight: bold;
      font-size: 48px;
      line-height: 40px;
    }
    .setup-recommend-tip {
      font-size: 14px;
      color: #979797;
      margin-top: 24px;
      line-height: 19px;
    }
    .recommend-card {
      margin: 0 auto;
      text-align: left;
      margin-top: 40px;
      height: 386px; // 445px
      width: 680px; // 332px
      overflow: auto;
      .recommend-card-item {
        display: inline-flex;
        margin-right: 12px;
        margin-bottom: 16px;
        height: 150px;
        .recommend-card-check {
          display: none;
        }
        .recommend-card-info {
          width: 100px;
          label {
            cursor: pointer;
            display: inline-flex;
          }
          label > img {
            z-index: 2;
            width: 24px;
            height: 24px;
            margin-left: 6px;
            margin-top: 6px;
          }
          .recommend-card-products {
            z-index: 1;
            margin-left: -30px;
            & > img {
              object-fit: cover;
              width: 100px;
              height: 150px;
            }
          }
        }
      }
    }
    .button-setuprecommend {
      bottom: 0;
    }
  }
</style>