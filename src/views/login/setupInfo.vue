<template>
  <div class="setup-info">
    <div class="setup-info-header">Add some Quick info</div>
    <div class="setup-info-headertwo">To Create Your Online Store</div>
    <!-- <el-upload
      class="setup-info-upload"
      :action="uploadAction"
      :show-file-list="false"
      :before-upload="handleAvatarProgress"
      :on-success="handleAvatarSuccess">
      <img v-if="imageUrl" :src="imageUrl" class="setup-info-img">
      <img v-else :src="defaultImg" alt="" class="setup-info-img">
    </el-upload> -->
    <!-- <div class="setup-info-imgtext">Upload Store Logo</div> -->
    <upload-img class="setup-info-upload" @getImgVal="getImgVal"></upload-img>
    <el-form ref="formInfo" class="setup-info-store" :model="formInfo" :rules="rules" @submit.native.prevent>
      <el-form-item prop="name">
        <el-input
          v-focus
          v-model="formInfo.name"
          maxlength="20"
          placeholder="My Store Name*"
          @input="inputName"
          v-focusblurstyle>
        </el-input>
      </el-form-item>
      <!-- <el-form-item prop="link">
        <el-input class="setup-info-shop"
          v-model="formInfo.link"
          maxlength="40"
          placeholder="My Store Link*"
          @input="inputLink"
          v-focusblurstyle>
          <span slot="suffix">.shop.social</span>
        </el-input>
      </el-form-item> -->
      <div class="setup-info-tip">You can always change your store name and logo later.</div>
      <div v-if="formInfo.name && formInfo.link" class="login-continue-active button-setupinfo" @click="continueLink(formInfo)">Continue</div>
      <div v-else class="login-continue">Continue</div>
      <div v-if="isShowSetUpLater" class="login-later"><a href="#" @click="continueLater()">Set up later</a></div>
    </el-form>

    <el-dialog :modal-append-to-body="false" :modal="true" class="dialog-createStore" title="" 
      :visible.sync="dialogVisible"
      width="300"
      center
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false">
      <img src="@/static/waiting1.gif" alt="">
      <div class="create-store-header">Creating Store</div>
      <div class="create-store-info">Hold on we are setting up your store and adding products</div>
    </el-dialog>

  </div>
</template>

<script>
import { shopModify } from "@/api/channels";
import { userInfo, setUpLater } from '@/api/login';
import UploadImg from '@/components/uploadImg.vue';
export default {
  name: 'SetupInfo',
  components: {UploadImg},
	data() {
    const validateStore = (rule, value, callback) => {
      if (value !== '') {
        let pattern = /^([a-zA-Z0-9]|[a-zA-Z0-9]+([a-zA-Z0-9- ]*)[a-zA-Z0-9]+)$/;
        if(!(pattern.test(value))) {
          callback(new Error('Please remove special characters.'));
        } else { callback() }
      } else { callback() }
    };
    const validateLink = (rule, value, callback) => {
      if (value !== '') {
        let pattern = /^([a-zA-Z0-9]|[a-zA-Z0-9]+([a-zA-Z0-9-]*)[a-zA-Z0-9]+)$/;
        if(!(pattern.test(value))) {
          callback(new Error('Your store link cannot contain special characters.'));
        } else { callback() }
      } else { callback() }
    };
		return {
      // imageUrl: '',
      imageFileUrl: '',
      // defaultImg: require('@/static/upload@2x.png'),
      // uploadAction: `${process.env.VUE_APP_BASE_API}/file/upload/`,
      formInfo: {
        name: '',
        link: ''
      },
      rules: {
        name: [
          { validator: validateStore, trigger: 'blur' }
        ],
        link: [
          { validator: validateLink, trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      commonData: {
        flag: false
      },
      loading: '',
      isShowSetUpLater: this.$route.query.isShowSetUpLater ? (JSON.parse(this.$route.query.isShowSetUpLater)) : true
    }
  },
  computed: {},
  watch:{},
  methods: {
    commonSubmit() {
      this.$refs['formInfo'].validate((valid) => {
        if (valid) {
          this.dialogVisible = true;
          shopModify({
            shopImage: this.imageFileUrl,
            shopName: this.formInfo.name.trim(),
            // domainName: this.formInfo.link
          },
          (res) => {
            if(res.success) {
              userInfo({}, (resUser) => {
                setTimeout(() => {
                  this.dialogVisible = false;
                  this.$router.push({path: '/login/setup-addproducts'});
                  const allInfo = JSON.parse(localStorage.getItem('ALLINFO'));
                  allInfo.hasCreateStore = 1;
                  localStorage.setItem('ALLINFO', JSON.stringify(allInfo));
                  let newUserInfo =  JSON.stringify(Object.assign( {}, JSON.parse(localStorage.getItem('USERINFO')), { 
                    domainName: resUser.result.shopVo.domainName
                  }))
                  localStorage.setItem('USERINFO', newUserInfo);
                }, 5000);
              },
              () => {},
              () => {})
            }
          },
          (err) => {
            this.dialogVisible = false;
            if( err.data.message === 'This store link has already been taken. Please try another one.' ) { // 手动校验
              const dom = this.$refs['formInfo'];
              dom.clearValidate();
              this.rules['link'].push({
                validator: (rule, value, callback) => {
                  callback('This link has already been taken. Please try a different one.');
                },
                trigger: 'blur'
              })
              dom.validateField('link');
              this.rules['link'] = [];
            } else {
              this.$notify({ title: "Oops", message: err.data.message, iconClass:'el-icon-warning-outline', duration: 3000, showClose: false });
            }
          },
          () => {})
        } else {
          return false;
        }
      });
    },
    continueLink() {
      this.commonSubmit();
    },
    // handleAvatarProgress() {
    //   this.loading = this.$loading({ lock: true, text: '', spinner: 'el-icon-loading', background: 'rgba(51, 51, 51, 0.25)' });
    // },
    // handleAvatarSuccess(res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw);
    //   this.imageFileUrl = file.response.result;
    //   this.loading.close();
    // },
    inputName() {
      if( this.commonData.flag === false ) {
        this.formInfo.link = this.formInfo.name.replaceAll(' ', '-').toLowerCase();
      }
    },
    inputLink() {
      this.commonData.flag = true;
      this.formInfo.link = this.formInfo.link.replace(/[^A-Za-z0-9-]/, '').toLowerCase();
    },
    continueLater() {
      setUpLater({},
      () => {
        const allInfo = JSON.parse(localStorage.getItem('ALLINFO'));
        allInfo.setUpLater = 1;
        localStorage.setItem('ALLINFO', JSON.stringify(allInfo));
        this.$router.push({path: '/'})
      },
      () => {
        const allInfo = JSON.parse(localStorage.getItem('ALLINFO'));
        allInfo.setUpLater = 0;
        localStorage.setItem('ALLINFO', JSON.stringify(allInfo));
        this.$router.push({path: '/'})
      },
      () => {})
    },
    getImgVal(val) {
      this.imageFileUrl = val;
    }
  },
	created() {},
  mounted() {},
  activated() {}
}
</script>

<style lang="less">
  @import "../../styles/common.less";
  @import "./CommonLogin.less";
  .setup-info{
    .setup-info-header {
      font-weight: bold;
      font-size: 48px;
      line-height: 40px;
    }
    .setup-info-headertwo {
      font-weight: 100;
      font-size: 48px;
      line-height: 40px;
    }
    .setup-info-upload {
      margin-top: 64px;
    }
    // .setup-info-img {
    //   object-fit: cover;
    //   cursor: pointer;
    //   width: 120px;
    //   height: 120px;
    //   border-radius: 60px;
    // }
    .setup-info-imgtext {
      font-size: 16px;
      margin-top: 8px;
    }
    .setup-info-tip {
      font-weight: normal;
      font-size: 12px;
      color: #979797;
      margin-top: 40px;
    }
    .setup-info-store {
      margin: 56px auto;
      .el-form-item {
        margin-bottom: 24px;
      }
      .el-input {
        width: 327px;
      }
      .el-form-item__error {
        padding-top: 4px;
        // margin-left: 104.5px
        width: 100%;
        text-align: center;
      }
      input {
        .common-input();
        font-size: 18px;
        height: 56px;
        border-radius: 8px;
        border: 1px solid #eeeeee;
        padding: 0 16px;
        font-weight: bold;
      }
      input.el-input__inner:hover {
        border-color: #eeeeee;
      }
      input.el-input__inner:focus {
        border-color: transparent;
        background: #ffffff !important;
        box-shadow: 0px 0px 20px rgba(51, 51, 51, 0.15);
      }
      .setup-info-shop {
        input {
          padding: 0 132px 0 16px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .el-input__suffix {
        right: 0;
        .el-input__suffix-inner {
          font-family: Avenir Next;
          line-height: 56px;
          padding: 16px;
          span {
            font-size: 18px;
            color: #333333;
          }
        }
      }
    }
    .dialog-createStore {
      .el-dialog {
        width: 300px;
        height: 222px;
        margin-top: -111px !important;
        // background: rgba(51, 51, 51, 0.6);
        background: #696969;
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(25px);
        border-radius: 20px;
        .el-dialog__header {
          padding: 0;
        }
        .el-dialog__body {
          height: 222px;
          text-align: center;
          padding: 0;
          img {
            padding: 16px 0;
            width: 100px;
            height: 100px;
            object-fit: cover;
          }
          .create-store-header {
            line-height: 25px;
            font-weight: bold;
            font-size: 18px;
            color: #FFFFFF;
          }
          .create-store-info {
            font-size: 14px;
            color: #FFFFFF;
            line-height: 14px;
            padding: 8px 32px 0;
          }
        }
      }
    }
  }
</style>