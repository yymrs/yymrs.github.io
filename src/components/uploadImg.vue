<template>
  <div class="upload-img">
    <div class="upload-logo"
      @mouseover="mouseOverFile"
      @mouseleave="mouseLeaveFile"
    >
      <div class="no-logo">
        <img :src="imgval?imgval:require('@/static/webBLogo@2x.png')" @click="uploadImg" alt="">
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
    </div>
    <el-dialog
      custom-class='cropper-box'
      title="Crop a picture"
      center
      :visible.sync="dialogVisible"
      :modal-append-to-body="false"
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
          <div class="button" @click="cropperSave">OK</div>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import { UploadImage } from '@/utils/common'

export default {
  name: 'uploadImg',
  props: {
    imgvalLog: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      cropperImg: '',
      imgval: this.imgvalLog || '',
      delAndUpload: false
    }
  },
  watch: {
    imgvalLog(val) {
      this.imgval = val;
    }
  },
  methods: {
    mouseOverFile() {
      if (this.imgval) {
        this.delAndUpload = true;
      }
    },
    mouseLeaveFile() {
      if (this.imgval) {
        this.delAndUpload = false;
      }
    },
    uploadImg() {
      this.$refs.uploadFile.click()
    },
    paramBk(type) {
      if (type=='updateImg') {
        this.$refs.uploadFile.click()
      } else {
        this.imgval = ''
        this.delAndUpload = false
        this.$refs.uploadFile.value = ''
      }
    },
    handleClose() {
      this.dialogVisible = false
    },
    cropperSave() {
      const that = this
      this.$refs.cropper.getCropBlob(async (data) => {
        const tempFile = that.tempFile
        let file = new File([data], tempFile.name, {type: tempFile.type})
        const loading = that.$loading({
          lock: true,
          text: "",
          spinner: "el-icon-loading",
          background: "rgba(51,51,51,0.25)",
        });
        await UploadImage.upload([file]).then((data) => {
          that.imgval = data[0]
          that.cropperImg = data[0]
          that.$nextTick(()=> {
            that.handleClose()
            that.tempFile = null
            loading.close()
          })
          this.$emit('getImgVal', data[0]);
        })
      })
    },
    async changeFile(e) {
      const that = this;
      const type = e.target.files[0].type
      if(e.target.files.length == 0||type.indexOf('image') == -1) {
        return
      }
      this.tempFile = e.target.files[0]
      const file = e.target.files[0];
      if(file.size > 10*1024*1024) {
        this.$notify({
          title: "Oops",
          message: 'Maximum file size 10MB.',
          iconClass:'el-icon-warning-outline',
          duration: 3000,
          showClose: false
        });
        this.$refs.uploadFile.value = '';
        return
      }
      if (window.FileReader) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        // 监听文件读取结束后事件
        reader.onloadend = function (img) {
          const image = new Image();
          image.src = img.target.result;
          that.cropperImg = img.target.result;
          that.dialogVisible = true;
          that.$refs.uploadFile.value = '';
        };
      }
    }
  }
}
</script>

<style lang="less">
.upload-img {
  .upload-logo {
    position: relative;
    .no-logo {
      text-align: center;
      font-size: 0;
      img {
        border-radius: 50%;
        cursor: pointer;
        width: 120px;
        height: 120px;
      }
      .no-logo-text {
        margin-top: 16px;
        font-weight: 500;
        font-size: 16px;
        line-height: 22px;
        text-align: center;
        color: #333333;
      }
    }
    .upoload-input {
      display: none;
      position: absolute;
      z-index: -1;
    }
  }
  .hasimg-del {
    cursor: pointer;
    font-size: 0;
    background: #333333;
    background: rgba(0, 0, 0, 0.2);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    border-radius: 50%;
    width: 120px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    .param-bk {
      background: #ffffff;
      height: 32px;
      width: 32px;
      opacity: 0.8;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      &:hover {
        opacity: 1;
      }
      &.del {
        position: relative;z-index: 20;
      }
      &:nth-child(2) {
        margin-left: 16px;
      }
      img {
        height: 14px;
        width: 12.4px;
        &.upload {
          height: 12px;
          width: 18px;
        }
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