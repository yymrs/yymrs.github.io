<template>
  <div class="packaging-page">
    <div class="packaging-page-container ms">
      <div class="packaging-info">
        <div class="title">Packaging</div>
        <div class="branded-invoice">
          <div class="branded-invoice-title">Branded Invoice</div>
          <p class="tip">
            Brand the invoice that customers receive in their orders with your
            logo and a thank you message.
          </p>
        </div>
        <div class="logo-section">
          <div class="logo-section-title">Logo</div>
          <p class="tip">
            This should fit within a 320px wide x 180px tall area.
          </p>
        </div>
        <!-- 上传文件 -->
        <div class="upload-file">
          <div
            class="pack-file"
            @mouseover="mouseOverFile"
            @dragenter="ondragenter"
            @dragleave="ondragleave"
            @dragover="ondragover"
            @drop="ondrop"
            @dragend="ondragend"
            @mouseleave="mouseLeaveFile"
            :class="{ hasimg: imgUrl, dragenter }"
          >
            <div v-if="!imgUrl" class="pack-file-tip">
              <img src="@/static/uploading@2x.png" />
              <p>Click or drag & drop an image here to upload.</p>
            </div>
            <input
              :class="{ imgZindex: imgdragenter }"
              ref="uploadFile"
              type="file"
              accept="image/gif,image/jpeg,image/jpg,image/png,image/svg"
              title=""
              @change="changeFile"
            />
            <div class="previewImg-box" v-if="imgUrl">
              <img v-if="imgUrl" class="previewImg" :src="imgUrl" alt="" />
            </div>
            <div
              class="hasimg-del"
              v-if="delAndUpload"
            >
              <div class="param-bk" @click="paramBk('updateImg')">
                <img
                  class="upload"
                  src="@/static/blackuploading@2x.png"
                  alt=""
                />
              </div>
              <div
                class="param-bk del"
                @click="paramBk('delImg')"
              >
                <img src="@/static/blackDelImg@2x.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <!-- 填写信息 -->
        <div class="fill-message">
          <div class="fill-message-title">Message</div>
          <textarea
            :class="{ hasinfo: fillMessage }"
            maxlength="280"
            @input="userMessage"
            v-model="fillMessage"
            placeholder="Write a thank you message to your customers..."
          ></textarea>
          <div class="text-number">
            <span>{{ fillMessage.length }}/280</span
            ><span v-if="fillMessageError" class="error-text">最多展示4行</span>
          </div>
        </div>
        <div class="save-info">
          <div
            class="save-button"
            :class="{ hasinfo }"
            v-elementEvent
            @click="save"
          >
            Save
          </div>
        </div>
      </div>
      <!-- 预览 -->
      <div class="packaging-preview">
        <div class="title">Preview</div>
        <div
          class="bk"
          v-loading="loading"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(51,51,51,0.25)"
        >
          <div class="preview-img-box">
            <div v-if="nowImUrl">
              <img :src="nowImUrl" />
            </div>
            <span v-else>Thank You</span>
          </div>
          <div class="textarea-box">
            <textarea
            class="premisg"
            v-if="initLoading"
            disabled
            :value="
              nowFillMessage ||
              'Thank you for your order. When you support a small business, you are supporting a dream. Your purchase is truly appreciated!'
            "
          ></textarea>
          </div>
          
          <!-- <p v-if="initLoading" class="nowFillMessage">
          {{ nowFillMessage?nowFillMessage:'Thank you for your order. When you support a small business, you are supporting a dream. Your purchase is truly appreciated!' }}
        </p> -->
          <img src="@/static/packagingn@2x.jpg" alt="" />
        </div>
      </div>
      <el-dialog
        custom-class="cropper-box"
        title="Crop a picture"
        center
        :visible.sync="dialogVisible"
        :close-on-click-modal="false"
        width="70%"
        :before-close="handleClose"
      >
        <div style="width: 100%; height: 500px">
          <vueCropper
            :autoCrop="true"
            ref="cropper"
            fixed
            autoCropWidth="320"
            :fixedNumber="[16, 9]"
            autoCropHeight="180"
            :img="cropperImg"
            :outputType="'png'"
          ></vueCropper>
        </div>
        <div class="submit">
          <div class="button" @click="cropperSave">OK</div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { shopSaveInvoice, getShopInvoice } from "@/api/packaging";
import { UploadImage } from "@/utils/common";
export default {
  name: "Packaging",
  data() {
    return {
      fillMessage: "",
      nowFillMessage: "",
      initfillMessage: "",
      dialogVisible: false,
      dragenter: false,
      imgUrl: "",
      initimgUrl: "",
      nowImUrl: "",
      id: undefined,
      delAndUpload: false,
      initLoading: false,
      imgdragenter: false,
      loading: false,
      cropperImg: "",
      tempFile: null,
      fillMessageError: false,
    };
  },
  created() {
    const loading = this.$loading({
      lock: true,
      text: "",
      spinner: "el-icon-loading",
      background: "rgba(51,51,51,0.25)",
    });
    getShopInvoice(
      {},
      (res) => {
        console.log(res.result);
        let { id, logo, message } = res.result;
        if (id) {
          this.id = id;
          this.nowImUrl = logo;
          this.imgUrl = logo;
          this.initimgUrl = logo;
          this.initfillMessage = message;
          this.fillMessage = message;
          this.nowFillMessage = message;
        }
        // logo = JSON.parse(logo)[0]
        const premisg = document.querySelector(".premisg");
        this.$nextTick(() => {
          this.makeExpandingArea(premisg);
        });
      },
      (res) => {
        console.log(res);
      },
      () => {
        this.initLoading = true;
        loading.close();
      }
    );
  },
  mounted() {
    window.addEventListener('resize',this.updateTextareaHeight)
  },
  destroyed() {
    window.removeEventListener('resize',this.updateTextareaHeight)
  },
  computed: {
    hasinfo() {
      if (
        this.imgUrl != this.initimgUrl ||
        this.fillMessage != this.initfillMessage
      ) {
        return true;
      }
      return false;
    },
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    // 更新textarea区域的高度
    updateTextareaHeight() {
      const premisg = document.querySelector(".premisg");
      this.$nextTick(() => {
        this.makeExpandingArea(premisg);
      });
    },
    async changeFile(e) {
      const that = this;
      console.log(e.target);
      console.log(e.target.files);
      const type = e.target.files[0].type;
      if (e.target.files.length == 0 || type.indexOf("image") == -1) {
        return;
      }
      this.tempFile = e.target.files[0];
      const file = e.target.files[0];
      // let singleimg = await UploadImage.upload(e.target.files)
      // console.log(singleimg,22222222222222222222);
      // this.imgUrl = singleimg[0]
      // return
      if (window.FileReader) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        //监听文件读取结束后事件
        reader.onloadend = function (img) {
          const image = new Image();
          image.src = img.target.result;
          that.cropperImg = img.target.result;
          // that.imgUrl = img.target.result
          that.dialogVisible = true;
          that.$refs.uploadFile.value = "";
        };
      }
    },
    save() {
      var data, sucess, error, complete;
      // if(!this.imgUrl&&!this.fillMessage) {
      //   this.$notify({
      //     title: "Oops",
      //     message: 'Please fill in the content',
      //     iconClass:'el-icon-warning-outline',
      //     duration: 3000,
      //     showClose: false
      //   });
      //   return
      // }
      if (!this.hasinfo || this.loading) {
        return;
      }
      this.loading = true;
      data = {
        logo: this.imgUrl,
        message: `${this.fillMessage}`,
      };
      if (this.id) {
        data.id = this.id;
      }
      sucess = (res) => {
        console.log(res);
        this.id = res.result.id;
        this.nowFillMessage = this.fillMessage;
        this.nowImUrl = this.imgUrl;
        this.initimgUrl = this.imgUrl;
        this.initfillMessage = this.fillMessage;
        const premisg = document.querySelector(".premisg");
        this.$nextTick(() => {
          this.makeExpandingArea(premisg);
        });
      };
      error = (res) => {
        console.log(res);
      };
      complete = (res) => {
        // this.curPage++;
        console.log(res);
        this.loading = false;
      };
      shopSaveInvoice(data, sucess, error, complete);
      // this.nowImUrl = this.imgUrl;
      // this.nowFillMessage = this.fillMessage;
    },
    mouseOverFile() {
      if (this.imgUrl) {
        this.delAndUpload = true;
      }
    },
    ondragenter() {
      console.log(3333);
      this.$refs.uploadFile.value = "";
      this.dragenter = false;
      // e.stopPropagation();
      // e.preventDefault();
    },
    ondragover() {
      this.dragenter = true;
      this.imgdragenter = true;
      this.$refs.uploadFile.value = "";
      // e.stopPropagation();
      // e.preventDefault();
      console.log(333333333333333);
    },
    ondragend() {
      // e.preventDefault();
      console.log("完成了");
    },
    ondragleave() {
      this.dragenter = false;
    },
    ondrop(e) {
      //取消事件传播及默认行为
      e.stopPropagation();
      e.preventDefault();
      this.$refs.uploadFile.value = "";
      let that = this;
      //取得拖进来的文件
      var data = e.dataTransfer;
      var files = data.files[0];
      this.tempFile = files;
      this.dragenter = false;
      this.imgdragenter = false;
      //将其传给真正的处理文件的函数
      if (window.FileReader) {
        var reader = new FileReader();
        reader.readAsDataURL(files);
        //监听文件读取结束后事件
        reader.onloadend = function (img) {
          const image = new Image();
          image.src = img.target.result;
          that.cropperImg = img.target.result;
          // that.imgUrl = img.target.result
          that.dialogVisible = true;
          that.$refs.uploadFile.value = "";
        };
      }
    },
    mouseLeaveFile() {
      this.dragenter = false;
      if (this.imgUrl) {
        this.delAndUpload = false;
      }
    },
    paramBk(type) {
      if (type == "updateImg") {
        this.$refs.uploadFile.click();
      } else {
        this.imgUrl = "";
        this.delAndUpload = false;
        this.$refs.uploadFile.value = "";
      }
    },
    cropperSave() {
      const that = this;
      this.$refs.cropper.getCropBlob(async (data) => {
        // do something
        //  let files = new window.File([data], file.name, {type: file.type})
        //  let singleimg = await UploadImage.upload(files)
        // that.imgUrl = singleimg[0]
        const tempFile = that.tempFile;
        console.log(tempFile);
        let file = new File([data], tempFile.name, { type: tempFile.type });
        const loading = that.$loading({
          lock: true,
          text: "",
          spinner: "el-icon-loading",
          background: "rgba(51,51,51,0.25)",
        });
        await UploadImage.upload([file]).then((data)=> {
          that.imgUrl = data[0];
          that.handleClose();
          that.tempFile = null;
          loading.close();
        })
      });
    },
    userMessage() {
      // console.log([e.target.value]);
      // const value = e.target.value.trim()
      // let frequency = {
      //   index:0
      // }
      // this.findLineFeed(value,0,frequency)
      // console.log(frequency.index+1,'行数');
      // if(frequency.index+1>4) {
      //   this.fillMessageError = true
      //   return
      // }else {
      //   this.fillMessageError = false
      // }
    },
    findLineFeed(text, fromIndex = 0, frequency) {
      const index = text.indexOf("\n", fromIndex);
      if (index !== -1) {
        frequency.index++;
        this.findLineFeed(text, index + 1, frequency);
      }
    },
    //code from http://caibaojian.com/textarea-autoheight.html
    makeExpandingArea(el) {
      var timer = null;
      //由于ie8有溢出堆栈问题，故调整了这里
      var setStyle = function (el, auto) {
        if (auto) el.style.height = "auto";
        el.style.height = el.scrollHeight + "px";
      };
      var delayedResize = function (el) {
        if (timer) {
          clearTimeout(timer);
          timer = null;
        }
        timer = setTimeout(function () {
          setStyle(el);
        }, 200);
      };
      if (el.addEventListener) {
        el.addEventListener(
          "input",
          function () {
            setStyle(el, 1);
          },
          false
        );
        setStyle(el,1);
      } else if (el.attachEvent) {
        el.attachEvent("onpropertychange", function () {
          setStyle(el,1);
        });
        setStyle(el,1);
      }
      if (window.VBArray && window.addEventListener) {
        //IE9
        el.attachEvent("onkeydown", function () {
          var key = window.event.keyCode;
          if (key == 8 || key == 46) delayedResize(el);
        });
        el.attachEvent("oncut", function () {
          delayedResize(el);
        }); //处理粘贴
      }
    },
  },
};
</script>
<style lang="less">
.packaging-page {
  // max-width: 1320px;
  // margin: 0 auto;
  height: 100%;
  // box-sizing: border-box;
  // padding-left: 40px;
  // display: flex;
  overflow: auto;
  .packaging-page-container {
    max-width: 1320px;
    margin: 0 auto;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
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
  .packaging-info {
    min-width: 473px;
    // max-width: 800px;
    margin-right: 56px;
    // flex: 1;
    .title {
      margin-top: 44px;
      font-weight: bold;
      font-size: 24px;
      line-height: 24px;
      /* identical to box height, or 100% */

      color: #333333;
    }
    .branded-invoice {
      .branded-invoice-title {
        font-weight: bold;
        font-size: 18px;
        line-height: 24px;
        /* identical to box height, or 133% */

        color: #333333;
        margin: 22px 0 11px;
      }
      .tip {
        font-weight: 500;
        font-size: 14px;
        line-height: 19px;

        /* Blak 33 */

        color: #333333;
      }
    }
    .logo-section {
      margin-top: 20px;
      .logo-section-title {
        font-weight: bold;
        font-size: 18px;
        line-height: 25px;
        color: #333333;
      }
      .tip {
        font-weight: 500;
        font-size: 14px;
        line-height: 19px;
        color: #333333;
        margin: 14px 0;
      }
    }
    .upload-file {
      .pack-file {
        width: 360px;
        height: 220px;
        min-width: 362px;
        min-height: 222px;
        background: #333333;
        border-radius: 10px;
        cursor: pointer;
        position: relative;
        &.dragenter {
          background: #eeeeee;
        }
        &.hasimg {
          padding: 20px;
          box-sizing: border-box;
          background: #fff;
          border: 1px solid #eeeeee;
        }
      }
      .pack-file-tip {
        top: 50%;
        transform: translateY(-50%);
        width: 100%;
        position: absolute;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 0;

        img {
          display: block;
          height: 36px;
          width: 54px;
        }
        p {
          margin-top: 16px;
          width: 180px;
          font-weight: 500;
          font-size: 14px;
          line-height: 19px;
          text-align: center;
          color: #979797;
        }
      }

      .previewImg-box {
        position: absolute;
        width: calc(100% - 40px);
        height: calc(100% - 40px);
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 0;
        .previewImg {
          width: 100%;
          height: 100%;
          // border-radius: 10px;
          // object-fit: contain;
        }
      }
      .hasimg-del {
        font-size: 0;
        background: #333333;
        opacity: 0.8;
        border-radius: 10px;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .param-bk {
          background: #ffffff;
          height: 48px;
          width: 48px;
          opacity: 0.8;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%;
          &.del {
            position: relative;
            z-index: 20;
          }
          &:nth-child(2) {
            margin-left: 30px;
          }
          img {
            height: 21px;
            width: 18.6px;
            &.upload {
              height: 18px;
              width: 27px;
            }
          }
        }
      }
      input[type="file"] {
        border: none;
        outline: none;
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        position: absolute;
        // z-index: 1;
        left: 0;
        top: 0;
        &.imgZindex {
          z-index: 1;
        }
      }
    }
    .fill-message {
      max-width: 800px;
      .fill-message-title {
        font-weight: bold;
        font-size: 18px;
        line-height: 25px;
        color: #333333;
        margin: 25px 0 11px;
      }
      textarea {
        &.hasinfo {
          background: #fff;
          border: 1px solid #eeeeee;
        }
        background: #eeeeee;
        border-radius: 10px;
        border: none;
        outline: none;
        padding: 12px 16px;
        resize: none;
        width: 100%;
        max-width: 404px;
        height: 128px;
        font-size: 10px;
        font-weight: 400;
        box-sizing: border-box;
        word-break: break-word;
        overflow-y: overlay;
        color: #333;
      }
      .text-number {
        color: #979797;
        display: flex;
        justify-content: space-between;
        .error-text {
          color: #f84240;
        }
      }
    }
    .save-info {
      margin: 25px 0 25px;
      padding-bottom: 20px;
      .save-button {
        &.hasinfo {
          background: #333333;
        }
        background: #eeeeee;
        width: 180px;
        height: 40px;
        color: #fff;
        text-align: center;
        line-height: 40px;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
        border-radius: 30px;
      }
    }
  }
  .packaging-preview {
    // margin-left: 56px;
    // padding-right: 83px;
    .nowFillMessage {
      // margin: 34px 0 0 0;
      text-align: center;
      padding: 0 30px;
      font-size: 10px;
      font-weight: 400;
      line-height: 14px;
      max-height: 53px;
    }
    .bk {
      // width: 21cm;
      min-height: 560px;
      width: 8.3in;
      // padding: 50px 64px 104px;
      // min-height: 29.7cm;
      // background: url("../../static/packagingn@2x.png") no-repeat;
      background-size: 100% 100%;
      text-align: center;
      box-shadow: 10px 10px 40px rgba(147, 141, 128, 0.15);
      box-sizing: border-box;
      border-radius: 10px;
      .premisg {
        border: none;
        outline: none;
        width: 100%;
        background: transparent;
        text-align: center;
        resize: none;
        padding: 0;
        // font-size: 10px;
        // font-weight: 400;
        // line-height: 14px;
        overflow: overlay;
        // max-height: 53px;
        box-sizing: border-box;
        font-size: 18px;
        line-height: 25px;
      }
      p {
        word-break: break-word;
        text-align: center;
        // background: #fff;
      }
      .preview-img-box {
        // padding: 20px 0;
        // padding-top: 57px;
        box-sizing: border-box;
        // background: #fff;
        display: flex;
        justify-content: center;
        span {
          padding-top: 57px;
          font-style: normal;
          font-weight: bold;
          font-size: 18px;
          line-height: 25px;
          text-align: center;
          color: #000000;
          margin-bottom: 29px;
        }
        div {
          width: 132px;
          height: 74px;
          // padding: 20px;
          margin: 20px 0 17px 0;
          text-align: center;
          box-sizing: border-box;
        }

        img {
          width: 100%;
          height: 100%;
          // object-fit: contain;
        }
      }
      .textarea-box {
        padding: 0 64px;
        font-size: 0;
      }
      img {
        margin-bottom: 50px;
        width: 100%;
      }
    }
    .title {
      font-weight: bold;
      font-size: 18px;
      line-height: 24px;
      color: #333333;
      margin-bottom: 17px;
      margin-top: 44px;
    }
  }
}
</style>