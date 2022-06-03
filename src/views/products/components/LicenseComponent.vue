<template>
  <div class="license-component">
    <el-dialog
      title="Upload Required Documents"
      custom-class="license-component-dialog"
      :width="'640px'"
      center
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="tip">
        <!-- 老用户单独展示的文案 -->
        <div v-if="permitStatus==4">
          Trendsi only provides services to business owners. To continue to purchase from Trendsi, please provide your seller's permit, resale certificate, or business license before <span class="date">Mar 31st, 2022:</span>
        </div>
        <div v-else>
          {{permitStatusTip}}
        </div>
      </div>
     <div class="upload-license-box">
       <div class="left-upload">
          <div class="add-files" :class="{disable:uploadFileList.length>=5}">
            <img src="@/static/blackUpload@2x.png" alt="">
            <p>Add Files to Upload</p>
            <!-- 
              multiple
             -->
            <input
              accept=".docx,application/msword,application/msword,application/pdf,image/gif,image/jpeg,image/jpg,image/png,image/svg"
              class="hidden-input"
              ref="uploadFile"
              type="file"
              title=""
              @click="clickFile"
              @change="changeFile"
            />
          </div>
          <div class="add-files-tip">Accept file in: Word/PDF/Jpeg/png formats  <br>  (Max: 5 files, 10MB each)</div>
       </div>
       <div class="right-speed-progress">
         <div class="list-progress">
           <div class="item-progress" v-for="(file,i) in uploadFileList" :key="file.name+i">
             <div class="file-info">
               <div class="file-info-l" :class="{'error-file':file.status==3}">
                 <div class="file-name">
                   <span class="name">{{file.name}}</span>
                   <span>{{file.filterSize}}</span>
                 </div>
                 <div class="file-progress" v-show="file.status!=3">
                   <div class="file-progress-y" :style="{width:file.progress+'%'}"></div>
                 </div>
               </div>
               <div class="check-status" @click="handleFile(file,i)">
                 <i v-show="file.status==1" class="el-icon-success"></i>
                 <i v-show="file.status==0" class="el-icon-error"></i>
                 <i v-show="file.status==2" class="el-icon-error computed"></i>
                 <i v-show="file.status==3" class="el-icon-error"></i>
                 <!-- <i :class="[file.status==1?'el-icon-success':file.status==2?'el-icon-success':'el-icon-success']"></i> -->
               </div>
             </div>

           </div>
         </div>
       </div>
     </div>
     <div class="agreement">
       <div class="left-img">
          <img @click="checkAgreement=!checkAgreement" class="collect circle" :src="checkAgreementImg" alt="">
       </div>
       <div class="right-tip">
         Check here to certify that the above information is accurate and that all purchases from Trendsi are for resale. You also permit Trendsi to verify and store your documents for legal purposes.
       </div>
     </div>
     <p class="help">
       <a href="https://help.trendsi.com/knowledge/seller-requirements" target="_blank">What documents are accepted?</a>
     </p>
      <div class="submit">
        <!-- 4 老用户可以先暂时不上传直接购买 -->
        <div class="skip-for-now" v-if="permitStatus===4" @click="continueBuy">
          {{oldUserText}}
        </div>
        <div :class="['continue-btn',{disable:!checkAgreement||!uploadFileListStatus}]"  @click="upload">
          Submit
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import successInfo from '@/mixins/successInfo'
import { uploadFileApi,modifyUserPermit } from "@/api/uploadFile";
import { userInfo } from '@/api/login';
export default {
  data() {
    return {
      uploadFileList:[],
      checkAgreement:false,
      uploadLoading:false,
    };
  },
  mixins:[successInfo],
  props: {
    dialogVisible: {},
    oldUserText:{}
  },
  computed:{
    checkAgreementImg() {
      if(this.checkAgreement) {
        return require('@/static/yellowCircle@2x.png')
      }else {
        return require('@/static/circle@2x.png')
      }
    },
    permitStatusTip() {
      let tip
      switch (this.permitStatus) {
        case 0:
          tip = "Trendsi only provides services to business owners. Please provide your seller's permit, resale certificate, or business license in order to purchase from Trendsi:"
          break;
        case 4:
          tip = "Trendsi only provides services to business owners. To continue to purchase from Trendsi, please provide your seller's permit, resale certificate, or business license before Mar 31st, 2022:"
          break;
          // 拒绝提示
        case 3:
        case 6:
          tip = "Your submitted documents were not approved, please resubmit your seller's permit, resale certificate, or business license to use Trendsi services:"
          break;
        default:
          break;
      }
      return tip
    },
    uploadFileListStatus() {
      if(this.uploadFileList.length>0) {
        return this.uploadFileList.every(item=>{
          if(item.status==1) {
            return true
          }else {
            return false
          }
        })
      }
      return false
    },
    permitStatus() {
      return this.$store.state.user.userInfo.permitStatus
    }
  },
  created() {
  },
  methods: {
    handleClose() {
      this.uploadFileList = []
      this.checkAgreement = false
      this.uploadLoading = false
      this.$emit("update:dialogVisible", false);
    },
    // 校验文件名称
    checkFileName(file) {
      const names = ['image/png','image/jpeg','application/pdf']
      const type = file.type
      const name = file.name
      let suffix = name.split('.').splice(-1)[0]
      if(type==''&&suffix=='docx'||suffix=='doc') {
        return true
      }
      return names.includes(type)
    },
    clickFile(e) {
      console.log(1,e);
      if(this.uploadFileList.length>=5) {
        e.preventDefault()
      }
    },
    uploadFile(files) {
      const that = this
      files.forEach(file=>{

        if(file.size>1000000) {
          file.filterSize = (file.size/1000000).toFixed(2) + 'MB'
        }else {
          file.filterSize = (file.size/1000).toFixed(2) + 'KB'
        }
        const tempObj = {
          name:file.name,
          progress:0,
          status:2,
          cancel:{},
          ...file
        }
        that.uploadFileList.push(tempObj)
        let param = new FormData(); // 创建form对象
        // status 文件状态 0 => 失败 1 => 正常 2 => 上传中 3 => 文件不符合要求 
        param.append("file", file);
        // errorFlag 失败时候禁止添加进度
        let errorFlag = false
        if(file.size>10000000||!this.checkFileName(file)) {

          that.$set(tempObj,'status',3)
          errorFlag = true
          this.$refs.uploadFile.value = null
        }
        const onUploadProgress = (progress)=>{
          console.log(progress);
          file.progress = progress
          if(errorFlag) {
            return
          }
          that.$set(tempObj,'progress',progress)
        }
        const success = (res)=>{
          console.log(res);
          that.$set(tempObj,'status',1)
          that.$set(tempObj,'url',res.result)
        }
        const error = (res)=>{
          console.log('test-error',res);
          errorFlag = true
          that.$set(tempObj,'status',0)
        }
        const complete = ()=>{
          this.$refs.uploadFile.value = null
        }
        if(!errorFlag) {
          uploadFileApi(param,success,error,complete,onUploadProgress,tempObj.cancel)
        }
      })
    },
    async changeFile(e) {
      console.log(e.target);
      console.log(e.target.files);
      const files = Array.from(e.target.files)
      console.log(files);
      this.uploadFile(files)
      // console.log(this.$refs.uploadFile.value,'23232323232this.$refs.uploadFile.value');
    },
    handleFile(file,i) {
      file.cancel.cancel&&file.cancel.cancel('cancelApi')
      this.uploadFileList.splice(i,1)
    },
    getUserInfo() {
      const that = this
      userInfo({}, (resUser) => {
        const newPermitStatus = resUser.result.permitStatus
        const userInfo = Object.assign({},this.$store.state.user.userInfo) 
        userInfo.permitStatus = newPermitStatus
        that.$store.dispatch('user/setUserInfo',userInfo)
      },
      () => {},
      () => {})
    },
    upload() {
      // 确认协议可以上传
      // 上传成功更新用户协议状态值
      if(this.checkAgreement&&this.uploadFileListStatus&&this.uploadLoading==false) {
        this.uploadLoading = true
        const uploadFileList = this.uploadFileList.filter(item=>{
          return item.status==1
        })
        let permitStatus = this.permitStatus
        let result
        if(permitStatus !== null){
          switch (permitStatus){
            //未认证
            case 0:{
                result = 1;
            }break;
            //1待审核
            case 1:{
                result = 1;
            }break;
            //已通过
            case 2:{
                result = 2;
            }break;
            //新用户已拒绝
            case 3:{
                result = 1;
            }break;
            //老用户未认证
            case 4:{
                result = 5;
            }break;
            //老用户待审核
            case 5:{
                result = 5;
            }break;
            //老用户被拒绝
            case 6:{
                result = 5;
            }break;
          }
        }

        const data = {
          permitStatus:result,
          permitUrl:uploadFileList.map(item=>item.url).join(';')
        }
        const success = (res)=>{
          console.log(res);
          const info = {
            title: "Documents Submitted",
            tip: "An email will be sent once approved.",
          };
          this.createdSuccessInfo(info);
          this.handleClose()
          this.getUserInfo()
        }
        const error = ()=>{
          
        }
        const complete = ()=>{
          this.uploadLoading = false
        }
        console.log(data);
        modifyUserPermit(data,success,error,complete)
      }
    },
    continueBuy() {
      this.$emit('continueBuy')
    }
  },
};
</script>

<style lang="less">
  .license-component-dialog {
    margin-top: 0 !important;
    top: 50%;
    transform: translateY(-50%);
    .el-dialog__body {
      padding-top: 16px;
      padding-bottom: 24px;
     
    }
    .tip {
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      text-align: left;
      color: #333;
      margin-bottom: 16px;
      &>div {
        font-size: 16px;
      }
      .date {
        color: #C79818;
      }
    }
    .upload-license-box {
      background: #FFFFFF;
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      padding: 16px;
      .left-upload {
        margin-right: 45px;
        .add-files {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 240px;
          height: 148px;
          background: #F9F9F9;
          border-radius: 12px;
          margin-bottom: 16px;
          position: relative;
          &.disable {
            p,img {
              opacity: .2;
            }
          }
          p {
            font-weight: 500;
            font-size: 16px;
            line-height: 22px;
            color: #333333;
            margin-top: 4px;
          }
          .hidden-input {
            width: 100%;
            height: 100%;
            position: absolute;
            opacity: 0;
            z-index: 1;
          }
        }
        .add-files-tip {
          font-size: 12px;
          line-height: 16px;
          color: #666666;
        }
      }
      .right-speed-progress {
        width: 0;
        flex: 1;
        .list-progress {
          .item-progress {
            margin-bottom: 16px;
            &:nth-child(5) {
              margin-bottom: 0;
            }
            .file-info {
              display: flex;
              justify-content: space-between;
              align-items: center;
              .file-info-l {
                width: 0;
                flex: 1;
                margin-right: 24px;
                
                .file-name {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 6px;
                  .name {
                    margin-right: 20px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  }
                  span {
                    color: #000000;;
                    font-size: 12px;
                  }
                }
                .file-progress {
                  background: #eee;
                  height: 4px;
                  width: 100%;
                  border-radius: 4px;
                  .file-progress-y {
                    background: #C79818;
                    height: 4px;
                    width: 30%;
                    border-radius: 4px;
                  }
                }
                &.error-file {
                  span {
                    color: #F84240;
                  }
                }
              }
              .check-status {
                width: 16px;
                height: 16px;
                flex-shrink: 0;
                font-size: 0;
                position: relative;
                &:hover .el-icon-success {
                  opacity: 0;
                }
                i {
                  font-size: 16px;
                  cursor: pointer;
                }
                .el-icon-success {
                  color: #C79818;
                  &:hover {
                    opacity: 0;
                  }
                  &:hover + .el-icon-error {
                    position: absolute;
                    z-index: 1;
                    left: 0;
                    display: initial !important;
                  }
                }
                .el-icon-error {
                  &:not(.computed):hover {
                    position: absolute;
                    z-index: 1;
                    left: 0;
                    display: initial !important;
                  }
                  color:  rgba(51, 51, 51, 0.2);
                  &:hover {
                    color:  rgba(51, 51, 51,1);
                  }
                  &.computed {
                    color:  rgba(51, 51, 51, 0.2);
                    &:hover {
                      color:  rgba(51, 51, 51, 1);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    .agreement {
      margin: 16px 0 24px;
      display: flex;
      justify-content: space-between;
      .left-img {
        flex-shrink: 0;
        margin-right: 16px;
        img {
          width: 24px;
          height: 24px;
          display: block;
        }
      }
      .right-tip {
        font-size: 12px;
        line-height: 18px;
        color: #666666;
      }
    }
    .help {
      text-align: center;
      margin-bottom: 8px;
      a {

        &:hover {
          text-decoration: underline;
        }
        color: #000000;
        font-size: 12px;
      }
    }
    .submit {
      display: flex;
      justify-content: center;
      .skip-for-now {
        width: 252px;
        height: 48px;
        line-height: 48px;
        border: 2px solid #333333;
        box-sizing: border-box;
        border-radius: 26px;
        font-weight: bold;
        text-align: center;
        font-size: 16px;
        margin-right: 24px;
        cursor: pointer;
      }
      .continue-btn {
        width: 252px;
        height: 48px;
        line-height: 48px;
        font-weight: 500;
        font-size: 16px;
        text-align: center;
        color: #ffffff;
        background: #333333;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
        border-radius: 25px;
        cursor: pointer;
        &.disable {
          opacity: .1;
          cursor: initial;
        }
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