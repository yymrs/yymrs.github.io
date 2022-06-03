<template>
  <div class="channels ms">
    <div class="channels-btn">
      <div class="channels-btn-add" @click="channelsAddBtn()">
        <img v-imgError src="@/static/collection/addCollection@2x.png" alt="" />
        <span>Add New Channel</span>
      </div>
    </div>
    <div class="channels-content">
      <div v-if="storelists.length===0 && isLoad!==true" class="no-data">
        <img src="../../static/noChannels@2x.jpeg" alt="">
        <div>No Channels found</div>
      </div>
      <div class="channels-content-item" v-for="(val, index) in storelists" :key="index">
        <div class="content-item-img" :style="{'background': val.ogImage?'#ffffff':'#eeeeee'}" @click="linkShopifyStore(val)">
          <img v-if="val.ogImage" class="content-item" :src="val.ogImage" alt="">
          <div v-if="!val.ogImage" class="content-item-nodata"><img :src="channelNodata" alt=""></div>
          <div class="content-item-default"><img :src="storeImgDefault" alt=""></div>
        </div>
        <div class="content-item-name" @click="linkShopifyStore(val)">
          <div class="name-fullname">{{ val.storeName }}</div>
          <div class="name-email">{{ val.domain }}</div>
        </div>
        <div class="content-item-addproduct">
          <div class="content-item-addproduct-text" @click="channelsAddProducttBtn(val)">Added Products</div>
        </div>
      </div>
    </div>
    <!-- <el-dialog class="channels-dialog-add" title="Add New Channel" :visible.sync="dialogFormVisibleAdd" center @close="closeDialog">
      <el-form :model="dialogAddChanels" ref="addForm" :rules="rules" @submit.native.prevent>
        <el-form-item prop="name">
          <el-input ref="inputNewChannel" class="add-channels-input" v-model="dialogAddChanels.name" placeholder="Enter Shopify domain" autocomplete="off" size="large" @input="onInput()" @keyup.enter.native="submitForm()">
            <template slot="prepend">https://</template>
            <template slot="append">.myshopify.com</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="channels-dialog-help"><a href="https://help.trendsi.com/knowledge/locating-shopify-handle" target="_blank">Where to find myshopify.com domain?</a></div>
      <div slot="footer" class="dialog-footer">
        <div v-if="dialogAddChanels.name.toString().length" class="dialog-btntext" @click="dialogChannelsAdd(dialogAddChanels)">Continue</div>
        <div v-else class="dialog-btntext btntext-disabled">Continue</div>
      </div>
    </el-dialog> -->
    <!-- <submit-shopify :dialogFormVisible="dialogFormVisibleShopify" @dialogClose="dialogCloseShopify"></submit-shopify> -->
    <add-channels v-if="dialogFormVisibleAdd" @closeDialog="closeDialog"></add-channels>
  </div>
</template>

<script>
import { shopifyStoreList, bindShopifyStore } from "@/api/channels";
import AddChannels from '@/components/AddChannels.vue';
// import SubmitShopify from '@/components/SubmitShopify.vue';

export default {
  name: 'Channels',
  components: {
    AddChannels
    // SubmitShopify
  },
	data() {
		return {
      channelNodata: require('@/static/channelNodata@2x.png'),
      storeImgDefault: require('@/static/store@2x.png'),
      storelists: [],
      dialogFormVisibleAdd: false,
      // dialogAddChanels: {
      //   name: ''
      // },
      // rules: {
      //   name: []
      // },
      storeId: '',
      isLoad: false,
      isAddChannel: this.$store.state.layout.isAddChannel,
      // isOpenShopify: true,
      // dialogFormVisibleShopify: false
    }
  },
  computed: {},
  watch: {
    '$route' (to) {
      if(to.query.action) {
        this.bindShopify(to.query.shop, JSON.parse(localStorage.getItem('USERINFO').id));
      }
    }
  },
  methods: {
    getList() {
      this.isLoad = true;
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(51, 51, 51, 0.25)'
      });
      shopifyStoreList({
        curPage: 1,
        pageSize: 10000,
        storeType: 0
      },
      (res) => {
        loading.close();
        this.storelists = res.result.filter((item) => {
          if (item.storeType == 0) {
            return item;
          }
        });
      },
      () => {
      },
      () => {
        this.isLoad = false;
        loading.close();
      })
    },
    bindShopify(shop, userId) {
      bindShopifyStore({
        shop: shop,
        userId: userId
      },
      (res) => {
        if(res.success) {
          this.getList();
          localStorage.removeItem('BINDSHOPIFY');
        } else {
          this.$notify({
            title: "Oops",
            message: res.error.message,
            iconClass:'el-icon-warning-outline',
            duration: 3000,
            showClose: false
          });
        }
      },
      (err) => { // 手动修改了isShopify=true,store/bind接口不成功的话，得改回来false
        const allInfo = JSON.parse(localStorage.getItem('ALLINFO'));
        allInfo.isShopify = false;
        localStorage.setItem('ALLINFO', JSON.stringify(allInfo));
        this.$notify({
          title: "Oops",
          message: err.data.message,
          iconClass:'el-icon-warning-outline',
          duration: 3000,
          showClose: false
        });
      },
      () => {})
    },
    closeDialog() {
      this.dialogFormVisibleAdd = false;
      this.$store.commit('layout/SET_AddChannel', false);
      // this.dialogAddChanels = { name: '' };
      if(this.$route.fullPath !== '/channels') {
        this.$router.push({path: '/channels'});
      }
    },
    // onInput() {
    //   this.$refs['addForm'].clearValidate();
    // },
    channelsAddBtn() {
      this.dialogFormVisibleAdd = true;
      // this.$nextTick(()=>{
      //   this.$refs['inputNewChannel'].focus();
      // })
    },
    // commonSubmit() {
    //   this.$refs['addForm'].validate((valid) => {
    //     if (valid) {
    //       const loading = this.$loading({
    //         lock: true,
    //         text: '',
    //         spinner: 'el-icon-loading',
    //         background: 'rgba(51, 51, 51, 0.25)'
    //       });
    //       switchShopify({},
    //       (res) => {
    //         this.isOpenShopify = res.result;
    //         const allInfo = JSON.parse(localStorage.getItem('ALLINFO'));
    //         allInfo.isOpenShopify = res.result;
    //         localStorage.setItem('ALLINFO', JSON.stringify(allInfo));
    //         if(this.isOpenShopify) {
    //           connectShopifyStore({
    //             storeName: this.dialogAddChanels.name + ".myshopify.com",
    //           },
    //           (res) => {
    //             this.dialogFormVisibleAdd = false;
    //             this.$store.commit('layout/SET_AddChannel', false);
    //             window.open(res.result, "_self");
    //             loading.close();
    //           },
    //           () => {
    //             loading.close();
    //             { // 手动校验
    //               const dom = this.$refs['addForm'];
    //               dom.clearValidate();
    //               this.rules.name.push({
    //                 validator: (rule, value, callback) => {
    //                   callback('This store has already been added. Try a different store.');
    //                 },
    //                 trigger: 'blur'
    //               })
    //               dom.validateField('name');
    //               this.rules.name = [];
    //             }
    //           },
    //           () => {})
    //         } else {
    //           registerCustomApp({
    //             domain: this.dialogAddChanels.name + ".myshopify.com",
    //             email: JSON.parse(localStorage.getItem('USERINFO')).email,
    //             mobile: JSON.parse(localStorage.getItem('USERINFO')).mobile,
    //             userId: JSON.parse(localStorage.getItem('USERINFO')).id
    //           },
    //           (res) => {
    //             loading.close();
    //             if(res.success) {
    //               if(res.message === 'connected') {
    //                 this.dialogFormVisibleAdd = false;
    //                 this.getList();
    //               } else {
    //                 this.dialogFormVisibleShopify = true;
    //               }
    //             } else {
    //               { // 手动校验
    //                 const dom = this.$refs['addForm'];
    //                 dom.clearValidate();
    //                 this.rules.name.push({
    //                   validator: (rule, value, callback) => {
    //                     callback('This store has already been added. Try a different store.');
    //                   },
    //                   trigger: 'blur'
    //                 })
    //                 dom.validateField('name');
    //                 this.rules.name = [];
    //               }
    //               this.getList();
    //             }
    //           },
    //           (err) => {
    //             loading.close();
    //             { // 手动校验
    //               const dom = this.$refs['addForm'];
    //               dom.clearValidate();
    //               this.rules.name.push({
    //                 validator: (rule, value, callback) => {
    //                   callback(err.data.message);
    //                 },
    //                 trigger: 'blur'
    //               })
    //               dom.validateField('name');
    //               this.rules.name = [];
    //             }
    //             this.getList();
    //           },
    //           () => {})
    //         }
    //       },
    //       (err) => {
    //         console.log(err);
    //       },
    //       () => {})
    //     } else {
    //       return false;
    //     }
    //   });
    // },
    // dialogChannelsAdd() {
    //   this.commonSubmit();
    // },
    // submitForm() {
    //   if(this.dialogAddChanels.name.toString().length) {
    //     this.commonSubmit();
    //   }
    // },
    linkShopifyStore(val) {
      window.open( 'https://'+ val.domain + '/admin');
    },
    channelsAddProducttBtn(val) {
      this.$router.push({
        path: '/add-products',
        query: { storeId: val.storeId }
      });
    },
    // dialogCloseShopify() {
    //   this.dialogFormVisibleAdd = false;
    //   // this.dialogFormVisibleShopify = false;
    // }
  },
	created() {
    this.getList();
    if(this.isAddChannel) {
      this.dialogFormVisibleAdd = true;
      this.$store.commit('layout/SET_AddChannel', false);
      // this.$nextTick(()=>{
      //   this.$refs['inputNewChannel'].focus();
      // })
    }
    this.$EventBus.$off('addChannel');
    this.$EventBus.$on('addChannel',()=>{
      this.dialogFormVisibleAdd = true;
      // this.$nextTick(()=>{
      //   this.$refs['inputNewChannel'].focus();
      // })
    })
    let bindshopifyVal = JSON.parse(localStorage.getItem('BINDSHOPIFY'));
    if( (bindshopifyVal && bindshopifyVal.action) || this.$route.query.action) {
      this.bindShopify(
        (bindshopifyVal && bindshopifyVal.shop) || this.$route.query.shop,
        JSON.parse(localStorage.getItem('USERINFO')).id
      );
    }
  },
  mounted() {}
}
</script>

<style lang="less">
  .channels {
    max-width: 1320px;
    margin: 0 auto;
    box-sizing: border-box;
    .channels-btn {
      text-align: right;
      padding: 24px 0 0 0;
      .channels-btn-add {
        cursor: pointer;
        width: 196px;
        height: 40px;
        background: #EEEEEE;
        border-radius: 20px;
        display: inline-flex;
        align-items: center;
        & > img {
          width: 24px;
          height: 24px;
          margin-left: 6px;
          margin-right: 10px;
        }
        & > span {
          font-size: 16px;
          color: #333333;
        }
      }
      .channels-btn-add:hover { opacity: 0.6; }
      .channels-btn-add:active { opacity: 0.8; }
    }
    .channels-content {
      margin-bottom: 64px;
      & > div.no-data {
        text-align: center;
        margin-top: 130px;
        & > img {
          width: 200px;
        }
        & > div {
          font-weight: 500;
          font-size: 18px;
          padding-top: 24px;
        }
      }
      .channels-content-item {
        display: inline-table;
        vertical-align: middle;
        width: 240px;
        height: 256px;
        margin: 24px 32px 0 0;
        text-align: center;
        padding: 10px 10px 16px 10px;
        border-radius: 30px;
        .content-item-img {
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          width: 320px;
          height: 168px;
          border-radius: 20px;
          margin-bottom: 16px;
          box-sizing: border-box;
          img.content-item {
            border: 1px solid #EAEAEA;
            border-radius: 20px;
            object-fit: contain;
            width: 100%;
            height: 100%;
          }
          & > div.content-item-nodata {
            width: 100%;
            & > img {
              width: 48px;
              height: 48px;
            }
          }
          & > div.content-item-default {
            margin-top: -110px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #A5C35F;
            width: 36px;
            height: 36px;
            border-radius: 18px;
            position: relative;
            margin-left: -52px;
            & > img {
              height: 18px;
            }
          }
        }
        .content-item-name {
          cursor: pointer;
          width: 172px;
          height: 57px;
          text-align: center;
          width: 100%;
          .name-fullname {
            font-weight: bold;
            font-size: 24px;
            color: #333333;
          }
          .name-email {
            max-width: 320px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-weight: normal;
            font-size: 16px;
            color: #979797;
          }
        }
        .content-item-addproduct {
          margin-top: 16px;
          height: 32px;
          .content-item-addproduct-text {
            margin: auto;
            width: 145px;
            height: 32px;
            line-height: 32px;
            background: #333333;
            box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
            border-radius: 20px;
            display: none;
            font-weight: 500;
            font-size: 14px;
            color: #FFFFFF;
            cursor: pointer;
          }
        }
        .content-item-addproduct-text:hover { opacity: 0.6; }
        .content-item-addproduct-text:active { opacity: 0.8; }
      }
      .channels-content-item:hover {
        box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.1);
        border-color: transparent;
      }
      .channels-content-item:hover .content-item-addproduct-text {
        display: block;
      }
    }
    // .channels-dialog-add {
    //   .el-form-item__content {
    //     .el-input-group__append {
    //       padding: 5px;
    //     }
    //     .el-input-group__prepend {
    //       background: #fff;
    //       border-color: transparent;
    //     }
    //   }
    //   input {
    //     &::-webkit-input-placeholder {
    //       font-size: 16px;
    //       font-weight: normal;
    //     }
    //     &::-moz-placeholder {
    //       font-size: 16px;
    //       font-weight: normal;
    //     }
    //   }
    //   .channels-dialog-help {
    //     text-align: center;
    //     margin-bottom: 16px;
    //     a {
    //       color: #333333;
    //       text-decoration: underline;
    //     }
    //     a:hover { opacity: 0.6; }
    //     a:active { opacity: 0.8; }
    //   }
    // }

    // .el-dialog {
    //   margin-top: -112px !important;
    //   .el-dialog__body {
    //     margin-bottom: 12px;
    //     .el-form-item {
    //       margin-bottom: 36px;
    //       .el-form-item__error {
    //         margin-top: 8px;
    //         text-align: center;
    //       }
    //     }
    //   }
    // }
  }
</style>