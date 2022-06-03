<template>
  <div class="store-setting-component" ref="store-setting-component">
    <div class="clientB-logo">
      <div class="left-lable">Logo</div>
      <!-- <div class="upload-logo right-section"
        @mouseover="mouseOverFile"
        @mouseleave="mouseLeaveFile"
      >
        <div class="no-logo">
          <img :src="webBStoreInfo.logo?webBStoreInfo.logo:require('@/static/webBLogo@2x.png')" @click="uploadImg" alt="">
          <p class="no-logo-text">Upload Store Logo</p>
        </div>
        <div class="hasimg-del" v-if="delAndUpload">
          <div class="param-bk" @click="paramBk('updateImg')">
            <img class="upload" src="@/static/blackuploading@2x.png" alt="" />
          </div>
          <div class="param-bk del" @click="paramBk('delImg')">
            <img src="@/static/blackDelImg@2x.png" alt="" />
          </div>
        </div>
        <input
          class="upoload-input"
          ref="uploadFile"
          type="file"
          accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
          @change="changeFile"
        />
      </div> -->
      <div class="right-section">
        <upload-img class="setup-info-upload" @getImgVal="getImgVal" :imgvalLog.sync="webBStoreInfo.logo"></upload-img>
      </div>
    </div>
    <div class="clientB-store-name">
      <div class="left-lable">Store Name</div>
      <div class="sotre-name-setting right-section">
        <input data-require='true' maxlength="20" @input="checkstoreName" spellcheck="false" :class="{edit:editInput('storeName')}" class="sotre-name-input common-input" v-model.trim="webBStoreInfo.storeName" type="text">
        <p class="require-input" >{{storeNameErrorText}}</p>
        <div class="text-number">{{ webBStoreInfo.storeName.length }}/20</div>
      </div>
    </div>
    <div class="clientB-store-Slogan">
      <div class="left-lable">Slogan</div>
      <div class="sotre-Slogan-setting right-section">
        <textarea class="common-input" maxlength="110" :class="{edit:editInput('Slogan')}" v-model.trim="webBStoreInfo.Slogan" ></textarea>
        <div class="text-number">{{ webBStoreInfo.Slogan.length }}/110</div>
      </div>
    </div>
    <div class="clientB-store-url">
      <div class="left-lable">
        <p style="font-weight: bold;font-size: 18px;">Store URL</p>
        <p class="tip">Update your shop.social URL</p>
      </div>
      <div class="sotre-url-setting right-section"> 
        <input data-require='true' spellcheck="false" @input="checkDomain" class="common-input domainName" :class="{edit:editInput('url')}" v-model.trim="webBStoreInfo.url" type="text">
        <p class="require-input" >{{domainNameErrorText}}</p>
        <div class="input-suffix">
          .shop.social
        </div>
        <!-- <div class="connect-your-url">
          <p class="check-tip">
            <img class="check-icon" src="@/static/check@2x.png" alt="">
            <span class="connect-text">Connect a third-party domain to your Trendsi store</span>
          </p>
          <p class="course">
            To connect your domain, you need to log in to your provider account and change your settings. Follow the instructions to get started. <span>View instructions</span>
          </p>
        </div>
        <i v-if="thirdDomainNameCheck" class="el-icon-check"></i>
        <input spellcheck="false" class="common-input thirdDomainName" @input="thirdDomainNameCheck=false" :class="{edit:editInput('thirdDomainName'),'check-domainName':thirdDomainNameCheck}" v-model.trim="webBStoreInfo.thirdDomainName" type="text">
        <div  class="verify-connection" @click="verifyConnection" :class="{edit:editInput('thirdDomainName')}">
          Verify connection
        </div> -->
      </div>
    </div>
    <div class="clientB-store-links">
      <div class="left-lable">Social Links</div>
      <div class="sotre-Slogan-links right-section"> 
        <div class="single" :class="{edit:editLink(item,key)}" v-for="(item,key) in webBStoreInfo.storeLinks" :key="key">
          <svg class="show" v-if="item.url"><use :xlink:href='"#icon-"+item.icon' /></svg>
          <svg v-else><use :xlink:href='"#icon-"+item.icon' /></svg>
          <input spellcheck="false" class="common-input" placeholder="Enter your account URL" v-model.trim="item.url" type="text">
        </div>
      </div>
    </div>
    <div class="save-store-button">
      <div class="button"  :class="{edit}" @click="saveSetting">Save</div>
    </div>
    <LevaePageComponent :dialogLeave.sync='dialogLeave' :parentInfo='parentInfo'  @confirm='confirm' />
    <!-- <el-dialog
      custom-class='cropper-box'
      title="Crop a picture"
      center
      :visible.sync="dialogVisible"
      :close-on-click-modal='false'
      width="70%"
      :before-close="handleClose"
      >
      <div style="width:100%;height:500px">
        <vueCropper
        :autoCrop='true'
        ref="cropper"
        fixed
        autoCropWidth='120'
        :fixedNumber='[1,1]'
        autoCropHeight='120'
        :img="cropperImg"
        :outputType='"png"'
        ></vueCropper>
        </div>
        <div class="submit">
          <div class="button" @click="cropperSave">
            OK
          </div>
        </div>
    </el-dialog> -->
  </div>
</template>

<script>
// import { UploadImage } from '@/utils/common'
import { shopInfo, validateThirdDomainName} from '@/api/storeSetting'
import { shopModify } from '@api/channels'
import LevaePageComponent from '@/views/myStore/components/leavePage.vue'
import UploadImg from '@/components/uploadImg.vue'

export default {
  components: {
    LevaePageComponent,
    UploadImg
  },
  name:'StoreSetting',
  data() {
    return {
      loadingData:false,
      dialogLeave:false,
      parentInfo:{
        title:'Unsaved Changes',
        tip:'You have unsaved changes,are you sure you want to leave this page?',
        confirm:'Leave',
        cancel:'Cancel' 
      },
      webBStoreInfo:{
        logo:'',
        storeName:'',
        Slogan:'',
        url:'',
        thirdDomainName:'',
        storeLinks:[
          {icon:'fb',url:''},
          {icon:'ins',url:''},
          {icon:'twitter',url:''},
          {icon:'pinterest',url:''},
          {icon:'tiktok',url:''},
        ],
      },
      edit:false,
      originWebBStoreInfo:{},
      thirdDomainNameCheck:false,
      // cropperImg: '',
      // dialogVisible: false,
      // delAndUpload: false,
      nextOrigin:null,
      domainNameError:false
    }
  },
  computed:{
    domainNameErrorText() {
      let text = ''
      let pattern = /^([a-zA-Z0-9]|[a-zA-Z0-9]+([a-zA-Z0-9- ]*)[a-zA-Z0-9]+)$/;
      if(!pattern.test(this.webBStoreInfo.url)) {
        text = 'Please remove special characters.'
      } else {
        if(this.domainNameError) {
          text = 'A store with that domain name already exists'
        }else if(!this.webBStoreInfo.url) {
          text = 'This is a required field'
        }
      }
      return text
    },
    storeNameErrorText() {
      let text = ''
      let pattern = /^([a-zA-Z0-9]|[a-zA-Z0-9]+([a-zA-Z0-9- ]*)[a-zA-Z0-9]+)$/;
      if(!pattern.test(this.webBStoreInfo.storeName)) {
        text = 'Please remove special characters.'
      } else if(!this.webBStoreInfo.storeName){
        text = 'This is a required field'
      }
      return text
    }
  },
  beforeRouteLeave(to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
    this.beforeunloadFn(next)
  },
  mounted() {
    this.originWebBStoreInfo = JSON.parse(JSON.stringify(this.webBStoreInfo)) //copy
    this.getStoreData()
  },
  methods:{
    // 获取页面数据
    getStoreData() {
      this.loadingData = false
      const loading = this.$loading({
        lock: true,
        text: "",
        spinner: "el-icon-loading",
        background: "rgba(51,51,51,0.25)",
      });
      shopInfo({},(res)=>{
        const {shopName,shopImage,domainName} = res.result
        let shopConfigVo = res.result.shopConfigVo || {}
        this.webBStoreInfo = {
          logo:shopImage,
          storeName:shopName||'',
          Slogan:shopConfigVo.slogan||'',
          thirdDomainName:shopConfigVo.thirdDomainName,
          url:domainName,
          storeLinks:[
            {icon:'fb',url:shopConfigVo.facebookLink},
            {icon:'ins',url:shopConfigVo.instagramLink},
            {icon:'twitter',url:shopConfigVo.twitterLink},
            {icon:'pinterest',url:shopConfigVo.pinterestLink},
            {icon:'tiktok',url:shopConfigVo.tikTokLink},
          ]
        }
        this.originWebBStoreInfo = JSON.parse(JSON.stringify(this.webBStoreInfo)) //copy
      },()=>{

      },()=>{
        this.loadingData = true
        loading.close()
      })
    },
    // 上传img
    // uploadImg() {
    //   this.$refs.uploadFile.click()
    // },
    // handleClose() {
    //   this.dialogVisible = false
    // },
    // cropperSave() {
    //   const that = this
    //   this.$refs.cropper.getCropBlob(async (data) => {
    //     const tempFile = that.tempFile
    //     let file = new File([data], tempFile.name, {type: tempFile.type})
    //     const loading = that.$loading({
    //       lock: true,
    //       text: "",
    //       spinner: "el-icon-loading",
    //       background: "rgba(51,51,51,0.25)",
    //     });
    //     await UploadImage.upload([file]).then((data)=> {
    //       that.webBStoreInfo.logo = data[0]
    //       that.cropperImg = data[0]
    //       that.$nextTick(()=> {
    //         that.handleClose()
    //         that.tempFile = null
    //         loading.close()
    //       })
    //     })
    //   })
    // },
    // async changeFile(e) {
    //   const that = this;
    //   const type = e.target.files[0].type
    //   if(e.target.files.length == 0||type.indexOf('image') == -1) {
    //     return
    //   }
    //   this.tempFile = e.target.files[0]
    //   const file = e.target.files[0];
    //   if(file.size > 10*1024*1024) {
    //     this.$notify({
    //       title: "Oops",
    //       message: 'Maximum file size 10MB.',
    //       iconClass:'el-icon-warning-outline',
    //       duration: 3000,
    //       showClose: false
    //     });
    //     this.$refs.uploadFile.value = '';
    //     return
    //   }
    //   if (window.FileReader) {
    //     var reader = new FileReader();
    //     reader.readAsDataURL(file);
    //     // 监听文件读取结束后事件
    //     reader.onloadend = function (img) {
    //       const image = new Image();
    //       image.src = img.target.result;
    //       that.cropperImg = img.target.result;
    //       that.dialogVisible = true;
    //       that.$refs.uploadFile.value = '';
    //     };
    //   }
    // },
    saveSetting() {
      const storeSettingComponent = this.$refs['store-setting-component']
      const inputs = Array.from(storeSettingComponent.querySelectorAll('input'))
      const checkInput = inputs.filter(item=>{
        if(item.dataset.require) {
          return item
        }
      })
      checkInput.map((item)=>{
        if(!item.value) {
          item.style = 'border: 1px solid #F84240;'
          item.nextElementSibling.style = 'display:block'
        }else {
          item.nextElementSibling.style = 'display:none'
          item.style = 'border: 1px solid #EEEEEE;'
        }
      })
      const {storeLinks,logo,storeName,Slogan,url,thirdDomainName} = this.webBStoreInfo
      if(!this.edit||!storeName||!url) {
        return
      }
      let pattern = /^([a-zA-Z0-9]|[a-zA-Z0-9]+([a-zA-Z0-9- ]*)[a-zA-Z0-9]+)$/;
      if(!pattern.test(this.webBStoreInfo.url)) {
        const input = storeSettingComponent.querySelector('.domainName')
        input.style = 'border: 1px solid #F84240;'
        input.nextElementSibling.style = 'display:block'
        return
      }
      if(!pattern.test(this.webBStoreInfo.storeName)) {
        const input = storeSettingComponent.querySelector('.sotre-name-input')
        input.style = 'border: 1px solid #F84240;'
        input.nextElementSibling.style = 'display:block'
        return
      }
      let data = {
        "domainName":url,
        "shopImage": logo,
        "shopName": storeName,
        "thirdDomainName": thirdDomainName,
        "faceBookLink": storeLinks[0].url,
        "instagramLink": storeLinks[1].url,
        "pinterestLink": storeLinks[3].url,
        "slogan": Slogan,
        "tikTokLink": storeLinks[4].url,
        "twitterLink": storeLinks[2].url,
      }
      const loading = this.$loading({
        lock: true,
        text: "",
        spinner: "el-icon-loading",
        background: "rgba(51,51,51,0.25)",
      });
      shopModify(data,()=>{
        this.getStoreData()
        this.$EventBus.$emit('upDataStore')
        this.domainNameError = false
      },(res)=>{
        const {result} = res.data
        if(Number(result)===303) {
          this.domainNameError = true
          const input = storeSettingComponent.querySelector('.domainName')
          input.style = 'border: 1px solid #F84240;'
          input.nextElementSibling.style = 'display:block'
        }else {
          this.$notify({
            title: "Oops",
            message: res.data.message,
            iconClass:'el-icon-warning-outline',
            duration: 3000,
            showClose: false
          });
        }
        
      },()=>{
        loading.close()
      })
    },
    // 计算是否修过页面
    computedEdit() {
      if(JSON.stringify(this.originWebBStoreInfo)===JSON.stringify(this.webBStoreInfo)) {
        this.edit = false
      }else {
        this.edit = true
      }
    },
    // 修改link
    editLink(item) {
      const findItem = this.originWebBStoreInfo.storeLinks?.find(_item=>{
        return _item.icon == item.icon
      })
      if(findItem&&item.url!=findItem.url) {
        return true
      }
      this.computedEdit()
      return false
    },
    // 修改input
    editInput(name) {
      if(this.originWebBStoreInfo[name] === this.webBStoreInfo[name]) {
        return false
      }else {
        return true
      }
    },
    // mouseOverFile() {
    //   if (this.webBStoreInfo.logo) {
    //     this.delAndUpload = true;
    //   }
    // },
    // mouseLeaveFile() {
    //   if (this.webBStoreInfo.logo) {
    //     this.delAndUpload = false;
    //   }
    // },
    // paramBk(type) {
    //   if(type=='updateImg') {
    //     this.$refs.uploadFile.click()
    //   }else {
    //     this.webBStoreInfo.logo = ''
    //     this.delAndUpload = false
    //     this.$refs.uploadFile.value=''
    //   }
    // },
    verifyConnection() {
      const {thirdDomainName} = this.webBStoreInfo
      if(this.editInput('thirdDomainName')) {
        validateThirdDomainName({
          "thirdDomainName": thirdDomainName
        },()=>{
          this.thirdDomainNameCheck = true
        },()=>{
          this.thirdDomainNameCheck = false
        },()=>{

        })
      }
    },
    // 弹框确认
    confirm() {
      // 确认离开页面操作恢复数据
      // this.currentSelectStyle = {textColor:'#000',buttonTextColor:'#fff',bgColor:'#ECE6D7',buttonColor:'#000',default:1,originSelect:true},
      this.dialogLeave = false
      this.edit = false
      this.resetData()
      this.nextOrigin()
    },
    resetData() {
      this.webBStoreInfo = JSON.parse(JSON.stringify(this.originWebBStoreInfo))
      this.domainNameError = false
      const storeSettingComponent = this.$refs['store-setting-component']
      // const input = storeSettingComponent.querySelector('.domainName')
      // input.nextElementSibling.style = 'display:none'
      // input.style = 'border: 1px solid #EEEEEE;'
      const inputs = Array.from(storeSettingComponent.querySelectorAll('input'))
      const checkInput = inputs.filter(item=>{
        if(item.dataset.require) {
          return item
        }
      })
      checkInput.map((item)=>{
        item.nextElementSibling.style = 'display:none'
        item.style = 'border: 1px solid #EEEEEE;'
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
    checkDomain(e) {
      e.target.nextElementSibling.style = 'display:none'
      e.target.style = 'border: 1px solid #EEEEEE;'
    },
    checkstoreName(e) {
      e.target.nextElementSibling.style = 'display:none'
      e.target.style = 'border: 1px solid #EEEEEE;'
    },
    getImgVal(val) {
      this.webBStoreInfo.logo = val;
    }
  }
}
</script>

<style lang="less">
.store-setting-component {
  .commonFlex {
    display: flex;
    margin-bottom: 40px;
  }
  .clientB-logo {
    display: flex;
    margin-bottom: 32px;
    // .upload-logo {
    //   position: relative;
    //   // padding-top: 6px;
    //   .no-logo {
    //     text-align: center;
    //     font-size: 0;
    //     img {
    //       border-radius: 50%;
    //       cursor: pointer;
    //       width: 120px;
    //       height: 120px;
    //     }
    //     .no-logo-text {
    //       margin-top: 16px;
    //       font-weight: 500;
    //       font-size: 16px;
    //       line-height: 22px;
    //       text-align: center;
    //       color: #333333;
    //     }
    //   }
    //   .upoload-input {
    //     opacity: 0;
    //     position: absolute;
    //     z-index: -1;
    //   }
    // }
    // .hasimg-del {
    //     cursor: pointer;
    //     font-size: 0;
    //     background: #333333;
    //     // opacity: 0.8;
    //     background: rgba(0, 0, 0, 0.2);
    //     // border-radius: 10px;
    //     position: absolute;
    //     top: 0;
    //     left: 115px;
    //     border-radius: 50%;
    //     width: 120px;
    //     height: 120px;
    //     display: flex;
    //     justify-content: center;
    //     align-items: center;
    //     z-index: 1;
    //     .param-bk {
    //       background: #ffffff;
    //       height: 32px;
    //       width: 32px;
    //       opacity: 0.8;
    //       display: flex;
    //       justify-content: center;
    //       align-items: center;
    //       border-radius: 50%;
    //       &:hover {
    //         opacity: 1;
    //       }
    //       &.del {
    //         position: relative;z-index: 20;
    //       }
    //       &:nth-child(2) {
    //         margin-left: 16px;
    //       }
    //       img {
    //         height: 14px;
    //         width: 12.4px;
    //         &.upload {
    //           height: 12px;
    //           width: 18px;
    //         }
    //       }
    //     }
    // }
  }
  .clientB-store-name {
    .commonFlex();
    .sotre-name-setting {
      position: relative;
      .text-number {
        color: rgba(0, 0, 0, 0.5);
        font-size: 12px;
        position: absolute;
        right: 0;
        bottom: -20px;
      }
      .sotre-name-input {
        &.edit {
            background: #fff
        }
      }
      .require-input {
        display: none;
        position: absolute;
        bottom: -20px;
        color:#F84240
      }
    }
  }
  .clientB-store-Slogan {
    .commonFlex();
    .sotre-Slogan-setting {
      .text-number {
        text-align: right;
        color: rgba(0, 0, 0, 0.5);
        font-size: 12px;
      }
      textarea {
        font-size: 14px;
        min-height: 80px;
        &.edit {
          background: #fff
        }
        &:focus {
          border: 1px solid #333333;;
        }
      }
    }
  }
  .clientB-store-url {
    .commonFlex();
    .left-lable {
      .tip {
        font-weight: 400;
        margin-top: 8px;
        font-size: 14px;
        line-height: 19px;
        color: #979797;
      }
    }
    .sotre-url-setting {
      position: relative;
      .common-input.edit {
        background: #fff;
      }
      .common-input {
        padding-right: 130px;
      }
      .check-domainName {
        padding-left: 34px;
      }
      .thirdDomainName {
        color: #979797;
      }
      .require-input {
        position: absolute;
        top: 50px;
        display: none;
        color: #F84240;
      }
      .input-suffix {
        position: absolute;
        right: 17px;
        font-weight: 500;
        font-size: 18px;
        top: 14px;
        color: #979797;
      }
      .connect-your-url {
        margin-top: 43px;
        .check-tip {
          display: flex;
          align-items: center;
          margin-bottom: 8px;
          .connect-text {
            font-size: 14px;
            color: #333333;
            margin-left: 8px;
          }
          .check-icon {
            display: block;
            width: 18px;
            height: 18px;
          }
        }
        .course {
          font-size: 14px;
          line-height: 22px;
          color: #979797;
          font-weight: 400;
          margin-bottom: 8px;
          span {
            cursor: pointer;
            margin-left: 4px;
            font-size: 14px;
            line-height: 22px;
            text-decoration-line: underline;
            color: #000000;
          }
        }
      }
      .verify-connection {
        position: absolute;
        bottom: 8px;
        text-align: center;
        right: -166px;
        width: 151px;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        color: #fff;
        background: rgb(51, 51, 51);
        opacity: 0.1;
        border-radius: 20px;
        &.edit {
          cursor: pointer;
          opacity: 1;
        }
      }
      .el-icon-check {
        position: absolute;
        bottom: 16px;
        left: 16px;
        color: #64C737;
        font-size: 16px;
        font-weight: bolder;
      }
    }
  }
  .clientB-store-links {
    .commonFlex();
    margin-bottom: 100px;
    .common-input {
      font-size: 14px;
      font-weight: 500;
    }
    .sotre-Slogan-links {
      .single {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        &.edit {
          svg {
            opacity:1
          }
          input {
            background: #fff;
          }
        }
        svg.show {
          opacity:1
        }
        svg {
          max-width: 18px;
          height: 18px;
          margin-right: 16px;
          fill: #333;
          opacity:.1
        }
      }
    }
  }
  .left-lable {
    flex: 1;
    max-width: 203px;
    font-weight: bold;
    font-size: 18px;
    line-height: 24px;
    color: #333333;
    margin-right: 40px;
  }
  .right-section {
    flex: 1;
    max-width: 350px;
  }
  .common-input {
    border: 1px solid #EEEEEE;
    box-sizing: border-box;
    border-radius: 8px;
    outline: none;
    padding: 13px 16px;
    width: 100%;
    font-weight: 500;
    font-size: 16px;
    line-height: 22px;
    color: #333333;
    transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    resize: none;
    background: #EEEEEE;
    &.edit-input {
      background: #fff;
    }
    &:focus {
      border: 1px solid #333333;;
    }
  }
  .save-store-button {
    padding: 16px 0 40px;
    background: #fff;
    position: fixed;
    width: 100%;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-weight: bold;
    font-size: 18px;
    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #333333;
      box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
      border-radius: 40px;
      width: 229px;
      height: 56px;
      opacity: 0.1;
      &.edit {
        cursor: pointer;
        opacity: 1;
      }
    }
  }
  .cropper-box {
    top: 0%;
    .submit {
      margin: 20px;
      display: flex;
      justify-content: center;
      .button {
        cursor: pointer;
        color: #fff;
        width: 180px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
        border-radius: 30px;
        line-height: 40px;
        text-align: center;
        background: #333;
      }
      
    }
  }
}
</style>