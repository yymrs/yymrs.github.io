<template>
  <div class="big-img-box">
    <div class="img-area" @click="close">
      <div class="close">
        <img src="../../../static/modelClose@2x.png" alt="" />
      </div>
      <div class="img-list">
        <div class="prev-img img-handle" @click.stop="switchImg">
          <div>
            <img src="../../../static/productDetail/left@2x.png" alt="" />
          </div>
        </div>
        <div class="img-list-box" ref="img-list-box">
          <img
            @click.stop
            v-imgError:big
            :ref="'imgSize' + index"
            class="current-img"
            :class="{ active: activeImgIndex == index }"
            :src="item"
            v-for="(item, index) in allImgList"
            :key="index"
          />
        </div>
        <div class="next-img img-handle" @click.stop="switchImg('next')">
          <div>
            <img src="../../../static/productDetail/right@2x.png" alt="" />
          </div>
        </div>
      </div>
      <div class="img-number-position" @click.stop>
        {{ activeImgIndex + 1 }}/{{ allImgList ? allImgList.length : "" }}
      </div>
      <div class="downloadImg" @click.stop="downloadImg">
        <img src="../../../static/productDetail/doadImageB@2x.png" alt="" />
      </div>
    </div>
    <div class="mask"></div>
  </div>
</template>

<script>
import successInfo from "@/mixins/successInfo";
export default {
  data() {
    return {};
  },
  props: {
    allImgList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    activeImgIndex: {},
    currentTitle: {},
  },
  mixins: [successInfo],
  mounted() {
    this.updateImgBox()
  },
  watch:{
    activeImgIndex:{
      handler() {
        this.$nextTick(()=>{
          this.updateImgBox()
        })
      },
      immediate: true
    }
  },
  methods: {
    close() {
      this.$emit("update:openBigImgModule", false);
    },
    updateImgBox() {
      const img = this.$refs["imgSize" + this.activeImgIndex][0];
      if(img) {
        this.$refs['img-list-box'].style.height = '80%'
        this.$refs["img-list-box"].style.width = img.width + "px";
      }
    },
    switchImg(direction) {
      let index;
      if (direction == "next") {
        if (this.activeImgIndex + 1 >= this.allImgList.length) {
          this.$emit("update:activeImgIndex", 0);
          this.$emit("updataImg", 0);
          return;
        }
        index = this.activeImgIndex + 1;
        this.$emit("update:activeImgIndex", index);
      } else {
        if (this.activeImgIndex == 0) {
          this.$emit("update:activeImgIndex", this.allImgList.length - 1);
          this.$emit("updataImg", this.allImgList.length - 1);
          return;
        }
        index = this.activeImgIndex - 1;
        this.$emit("update:activeImgIndex", index);
      }
      this.$emit("updataImg", index);
    },
    downloadCanvasIamge() {
      var image = new Image();
      var than = this;
      const loading = this.$loading({
        lock: true,
        text: "",
        spinner: "el-icon-loading",
        background: "rgba(51,51,51,0.25)",
      });
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let imgSuffix = than.allImgList[than.activeImgIndex].split('.').splice(-1)[0]
        if(imgSuffix) {
          if(imgSuffix === 'jpg') {
            imgSuffix = 'jpeg'
          }
        }else {
          imgSuffix = 'png'
        }
        // 未指定img格式默认为png 格式
        var url = canvas.toDataURL("image/"+imgSuffix);

        // 生成一个a元素
        var a = document.createElement("a");
        // 创建一个单击事件
        var event = new MouseEvent("click");

        // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
        a.download = than.currentTitle;
        // 将生成的URL设置为a.href属性
        a.href = url;
        // 触发a的单击事件
        a.dispatchEvent(event);
        let info = {
          icon: require("@/static/copyImg@2x.png"),
          title: "Image Downloaded",
          tip: "Product image has been saved.",
        };
        console.log(than);
        loading.close();
        than.customImgCreatedSuccessInfo(info);
      };
      image.src = this.allImgList[this.activeImgIndex] + "?time=" + Date.now();
    },
    downloadImg() {
      this.downloadCanvasIamge();
    },
  },
};
</script>

<style lang="less">
.big-img-box {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  .mask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.9);
  }
  .img-area {
    width: 100%;
    height: 100%;
    .close {
      &:hover {
        background: rgba(255, 255, 255, 1);
      }
      cursor: pointer;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 30px;
      position: absolute;
      z-index: 2;
      top: 40px;
      right: 40px;
      img {
        position: absolute;
        z-index: 1;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        height: 14.36px;
        width: 14.36px;
      }
    }
    .img-handle {
      &:hover {
        background: rgba(255, 255, 255, 1);
      }
      // position: absolute;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      cursor: pointer;
      img {
        display: block;
        height: 15px;
        // width: 7.5px;
      }
      &.prev-img {
        // left: 50%;
        // top: 50%;
        // transform: translate(-50%, -50%);
        // margin-left: -256px;
      }
      &.next-img {
        // right: 50%;
        // top: 50%;
        // transform: translate(50%, -50%);
        // margin-right: -256px;
      }
    }
    .img-list {
      position: absolute;
      z-index: 1;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      .img-list-box {
        width: 100%;
        height: 80%;
        display: inline-block;
        position: relative;
        margin: 0 10px;
      }
      .current-img {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        // width: 400px;
        height: 100%;
        position: absolute;
        // object-fit: contain;
        display: none;
        transition: opacity 0.3s;
        &.active {
          display: block;
          z-index: 1;
          opacity: 1;
          transition: opacity 0.3s;
        }
        z-index: 0;
        opacity: 0;
      }
    }
    .img-number-position {
      position: absolute;
      bottom: 20px;
      width: 56px;
      height: 20px;
      left: 50%;
      z-index: 1;
      text-align: center;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.8);
      border-radius: 10px;
    }
    .downloadImg {
      &:hover {
        background: rgba(255, 255, 255, 1);
      }
      cursor: pointer;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.5);
      border-radius: 20px;
      position: absolute;
      z-index: 1;
      bottom: 20px;
      right: 90px;
      z-index: 1;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        display: block;
        height: 20px;
        width: 16.84px;
      }
    }
  }
}
</style>
