<template>
  <div class="export-fb">
    <el-dialog
      title="Add to Facebook Shop"
      custom-class="add-to-fb"
      :width="'400px'"
      center
      :append-to-body='cms'
      :visible.sync="dialogVisible"
      :before-close="handleClose"
    >
      <div class="tip">
        An exported csv file will be sent to the following email address.
      </div>
      <el-input v-model="email" placeholder="Please enter email address"></el-input>
      <div class="error" v-if="errorInfo">
        <img class="collection-error" src="../../../static/collection/addCollectionError@2x.png" alt="">
        {{ errorInfo }}
      </div>
      <div class="submit">
        <div class="continue-btn" v-elementEvent @click="exportFb">
          Export CSV
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { productCollectionCRSToEmail,cmsProductCollectionCRSToEmail } from "@/api/collections";
import successInfo from '@/mixins/successInfo'
export default {
  data() {
    return {
      email: "",
      errorInfo: "",
    };
  },
  mixins:[successInfo],
  props: {
    collectionName: {
      type: String,
      default: ''
    },
    productInfo: null,
    dialogVisible: {},
    productId: {},
    collectionId: {
      default: ''
    },
    exportType:{
      default: 1
    },
    cms:{
      type: Boolean,
      default:false
    },
    cmsId:{}
  },
  created() {
    var USERINFO = JSON.parse(localStorage.getItem('USERINFO'))
    this.email = USERINFO.email;
  },
  methods: {
    handleClose() {
      this.$emit("update:dialogVisible", false);
      this.$emit("close");
      this.errorInfo = ''
    },
    exportFb() {
      var data, sucess, error, complete;
      if (this.email) {
        data = {
          collectionId: this.collectionId,
          email: this.email,
          productId: this.collectionId?null:this.productId,
          exportType: this.exportType,
        };
        sucess = () => {
          let info = {
            title:'Success',
            tip:'Check your email for the .CSV file.',
            icon:require('@/static/exportFb@2x.png')
          }
          this.customImgCreatedSuccessInfo(info)
          this.handleClose()
          console.log('第6、8个埋点------add_to_fbshop-----', this.productInfo);
          let uuId = JSON.parse(localStorage.getItem('USERINFO'))?JSON.parse(localStorage.getItem('USERINFO')).uuId:undefined;
          let productInfoOne = this.productInfo;
          if(Array.isArray(this.productInfo)) {
            this.$gtm.trackEvent({
              event: 'add_to_cart',
              userId: uuId,
              ecommerce: {
                Cstm_add_option: 'add_to_fbshop',
                items: [{
                  item_name: this.collectionName,
                  item_id: this.collectionId,
                  price: '',
                  item_brand: '',
                  item_category: '',
                  item_category2: '',
                  item_category3: '',
                  item_category4: '',
                  item_variant: '',
                  item_list_name: '',
                  item_list_id: '',
                  index: 1,
                  quantity: productInfoOne.length
                }]
              }
            });
          } else {
            this.$gtm.trackEvent({
              event: 'add_to_cart',
              userId: JSON.parse(localStorage.getItem('USERINFO')).uuId,
              ecommerce: {
                Cstm_add_option: 'add_to_fbshop',
                items: [{
                  item_name: productInfoOne.title,
                  item_id: productInfoOne.id,
                  price: productInfoOne.minPriceB,
                  item_brand: productInfoOne.brand,
                  item_category: '',
                  item_category2: '',
                  item_category3: '',
                  item_category4: '',
                  item_variant: '',
                  item_list_name: '',
                  item_list_id: '',
                  index: 1,
                  quantity: 1
                }]
              }
            });
          }
        };
        error = (res) => {
          console.log(res);
          this.errorInfo = res.data.message
        };
        complete = () => {};
        console.log(data);
        if(this.cms) {
          data.cmsPageId = this.cmsId;
          data.exportType = 2;
          cmsProductCollectionCRSToEmail(data, sucess, error, complete);
        }else {
          productCollectionCRSToEmail(data, sucess, error, complete);
        }
      } else {
        this.errorInfo = "The email address cannot be blank.";
      }
    },
  },
};
</script>

<style lang="less">
  .add-to-fb {
    margin-top: 0 !important;
    top: 50%;
    transform: translateY(-50%);
    .el-dialog__body {
      padding-top: 16px;
      padding-bottom: 24px;
      .el-input {
        margin-bottom: 32px;
        input {
          border-radius: 10px;
          font-weight: 500;
          font-size: 16px;
          line-height: 16px;
          color: #000;
        }
      }
    }
    .tip {
      font-family: Avenir Next;
      font-size: 12px;
      font-style: normal;
      font-weight: 500;
      line-height: 18px;
      text-align: left;
      color: #333;
      margin-bottom: 16px;
    }
    .submit {
      display: flex;
      justify-content: center;
      .continue-btn {
        width: 300px;
        line-height: 46px;
        font-weight: 500;
        font-size: 16px;
        text-align: center;
        color: #ffffff;
        background: #333333;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
        border-radius: 25px;
      }
    }
    .error {
      bottom: 80px;
      position: absolute;
      color: #f84240;
      word-break: break-word;
      line-height: 1;
      .collection-error {
        width: 10px;
        height: 10px;
      }
    }
  }
</style>