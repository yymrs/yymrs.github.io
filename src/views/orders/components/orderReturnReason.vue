<template>
  <div class="order-return-reason">
    <div class="order-return-each" v-for="(item, index) in dataList" :key="index">
      <div class="order-return-product">
        <div class="product-left">
          <img :src="item.skuImage" alt="">
          <div class="product-info">
            <div class="product-top">
              <div class="product-title">{{ (item.brand?(item.brand + '&nbsp;'):'') + item.title }}</div>
              <div class="product-sku">{{item.dimensionValues && Object.keys(item.dimensionValues).length ? Object.values(item.dimensionValues).join(',') : '' }}</div>
            </div>
            <div class="product-bottom">Quantity：1</div>
          </div>
          </div>
        <div class="product-right">
          <div>
            <el-select v-model="returnReason[index]" placeholder="Select return reason" @change="changeReturnReason(returnReason[index], index)">
              <el-option
                v-for="item in returnReasons"
                :key="item.value"
                :label="item.desc"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <!-- 
            :on-preview="handleImgPreview"
            :on-progress="handleImgProgress"
            :on-success="handleImgSuccess"
           -->
           <!-- {{ fileList[index] }} -->
          <el-upload
            :action="uploadAction"
            list-type="picture-card"
            :file-list="fileList[index]"
            :before-upload="beforeImgUpload"
            :on-remove="(file,filelist)=>handleImgRemove(file,filelist,index)"
            :on-success="(response,file,filelist)=>handleImgSuccess(response,file,filelist,index)"
            :on-error="handleImgError"
            :on-change="(file,filelist)=>handleImgChange(file,filelist,index)"
            multiple
            :limit="3"
            :class="{'hidden-upload': isHidden[index]}"
          >
            <img class="upload-icon" slot="default" src="@static/uploadImg@2x.png" alt="">
          </el-upload>
          <!-- <div class="photo-required" v-if="(photoRequired[index]) && ((fileList.length === 0) || (fileList && fileList[index] && fileList[index].length==0))"> -->
          <div class="photo-required" v-if="(photoRequired[index])">
            Photos required.
          </div>
        </div>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'orderReturn',
    props: {
      dataList: {
        type: Array,
        default: ()=>{}
      },
      returnReasons: {
        type: Array,
        default: ()=>{}
      }
    },
    data() {
      return {
        middleData: [],
        isHidden: new Array(10000).fill(false),
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false,
        returnReason: [],
        fileList: [],
        needUploadImg: [],
        photoRequired: new Array(10000).fill(0),
        uploadAction: `${process.env.VUE_APP_BASE_API}/file/upload/`
      }
    },
    methods: {
      beforeImgUpload(file) {
        const isJPG = (file.type === 'image/gif') || (file.type === 'image/svg') || (file.type === 'image/png') || (file.type === 'image/jpeg') || (file.type === 'image/jpg');
        const isLt2M = file.size / 1024 / 1024 < 10;
        if (!isJPG) {
          return false;
        }
        if (!isLt2M) {
          this.$notify({
            title: "Oops",
            message: 'Maximum file size 10MB.',
            iconClass:'el-icon-warning-outline',
            duration: 3000,
            showClose: false
          });
        }
        return isJPG && isLt2M;
      },
      handleImgRemove(file, fileList, index) {
        this.fileList[index] = [...new Set(fileList)];
        if((this.fileList[index].length === 3) || (this.fileList[index].length > 3)) {
          this.isHidden[index] = true;
          this.$forceUpdate(); // 解决数组不渲染的问题
        } else {
          this.isHidden[index] = false;
          this.$forceUpdate(); // 解决数组不渲染的问题
        }
        if(this.needUploadImg.includes(this.returnReason[index])) {
          if(this.fileList && this.fileList[index] && this.fileList[index].length) {
            this.photoRequired[index] = 0;
          } else {
            this.photoRequired[index] = 1; // 不能submit
          }
        } else {
          this.photoRequired[index] = 0;
        }
      },
      handleImgSuccess(res, file, fileList, index) {
        this.fileList[index] = [...new Set(fileList)];
        this.photoRequired[index] = 0; // 不能submit
        if((this.fileList[index].length === 3) || (this.fileList[index].length > 3)) {
          this.isHidden[index] = true;
          this.$forceUpdate(); // 解决数组不渲染的问题
        } else {
          this.isHidden[index] = false;
          this.$forceUpdate(); // 解决数组不渲染的问题
        }
        this.$emit('changeReturnReason', this.returnReason, this.photoRequired, this.fileList);
      },
      handleImgError() {
        console.log(1111, this.fileList);
      },
      handleImgChange(file, fileList, index) {
        if(([...new Set(fileList)].length === 3) || ([...new Set(fileList)].length > 3)) {
          this.isHidden[index] = true;
          this.$forceUpdate(); // 解决数组不渲染的问题
        } else {
          this.isHidden[index] = false;
          this.$forceUpdate(); // 解决数组不渲染的问题
        }
      },
      handleRemove(file, fileList) {
        this.fileList = fileList;
      },
      changeReturnReason(val, index) {
        if(this.needUploadImg.includes(val)) {
          if(this.fileList && this.fileList[index] && this.fileList[index].length) {
            this.photoRequired[index] = 0;
          } else {
            this.photoRequired[index] = 1; // 不能submit
          }
        } else {
          this.photoRequired[index] = 0;
        }
        this.$emit('changeReturnReason', this.returnReason, this.photoRequired, this.fileList);
      }
    },
    created() {
    },
    watch: {
      returnReasons() {
        this.needUploadImg = [];
        this.returnReasons.forEach((item)=>{
          if(item.needUpload) {
            this.needUploadImg.push(item.value);
          }
        })
      }
    }
  }
</script>

<style lang="less">
  .order-return-reason {
    .order-return-each {
      text-align: left;
      margin-top: 24px;
      .order-return-product {
        display: inline-flex;
        align-items: center;
        text-align: left;
        width: 100%;
        .product-left {
          display: inline-flex;
          width: calc( 100% - 240px );
          img {
            width: 60px;
            height: 90px;
            border-radius: 8px;
          }
          .product-info {
            display: inline-block;
            margin-left: 10px;
            .product-top {
              height: calc( 100% - 20px );
              .product-title {
                font-size: 14px;
                line-height: 20px;
                color: #333333;
                text-overflow: ellipsis;
                overflow: hidden;
                width: 300px;
                white-space: nowrap;
              }
              .product-sku {
                margin-top: 8px;
                font-size: 12px;
                line-height: 16px;
                color: #979797;
              }
            }
            .product-bottom {
              height: 20px;
              font-size: 12px;
              line-height: 20px;
              color: #333333;
            }
          }
        }
        .product-right {
          width: 240px;
          & > div:nth-child(2) {
            width: 700px;
          }
          .el-select {
            width: 240px;
            input {
              border-radius: 20px;
            }
            .el-input__inner:focus {
              border: 1px solid #EEEEEE !important;
            }
          }
          .el-upload {
            margin-top: 8px;
            width: 74px;
            height: 50px;
            line-height: 50px;
            img.upload-icon {
              height: 15px;
            }
          }
          .el-upload-list__item {
            margin-top: 8px;
            width: 74px;
            height: 50px;
            line-height: 50px;
          }
          .photo-required {
            margin-top: 6px;
            font-size: 12px;
            line-height: 12px;
            color: #F363A0;
          }
          // .el-upload-list__item { // 去掉上传动画
          //   transform: none !important;
          // }
          ul.el-upload-list.el-upload-list--picture-card {
            display: inline-flex;
            height: 58px;
            li.el-upload-list__item.is-success {
              margin-bottom: 0 !important;
              border: none;
            }
          }
          div.el-upload.el-upload--picture-card {
            border: none;
            background: #F9F9F9;
            border-radius: 5px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .hidden-upload {
            .el-upload--picture-card {
              display: none !important;
            }
            & > ul {
              li:last-child {
                margin-right: 0;
              }
            }
          }
        }
      }
    }
  }
  .el-select-dropdown.el-popper {
    border: 1px solid #EEEEEE !important;
    border-radius: 8px !important;
  }
</style>