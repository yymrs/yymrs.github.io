<template>
  <div class="order-track-component">
    <el-dialog
      title="Track"
      custom-class="order-track"
      :width="'360px'"
      center
      :visible.sync="orderTrackVisible"
      :before-close="handleClose"
    >
      <div class="order-track-content">
        <div class="track-item">
          <p class="shoping-transport">Domestic Tracking</p>
          <div class="transport-conatiner">
            <div class="transport-left">
              <span class="strong-text">{{toUpperCase(trackIng.logisticCompany)}}</span>
              <span class="track-order-number">{{trackIng.logisticNumber}}</span>
            </div>
            <img src="@/static/reply@2x.png" @click="goUrl(trackIng.trackUrl)" alt="" />
          </div>
        </div>
        <div class="track-item">
          <p class="shoping-transport">Overseas Tracking</p>
          <div class="transport-conatiner">
            <div class="transport-left">
              <span class="strong-text">{{toUpperCase(trackIng.internationalCompany)}}</span>
              <span class="track-order-number">{{trackIng.internationalNumber}}</span>
            </div>
            <img src="@/static/reply@2x.png" @click="goUrl(trackIng.internationalTrackUrl)" alt="" />
          </div>
        </div>
        <p class="order-track-tip">
          This package is transferring from Trendsi overseas warehouse to US warehouse. The overseas tracking number is only available to you.
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    orderTrackVisible: {
      typeof: Boolean,
      default: false,
    },
    trackData:{
      typeof:Object,
      default:()=>{
        return {}
      }
    }
  },
  computed:{
    trackIng() {
      return this.trackData
    }
  },
  data() {
    return {};
  },

  methods: {
    handleClose() {
      this.$emit('update:orderTrackVisible',false)
    },
    goUrl(url) {
      url&&window.open(url,'_blank')
    },
    toUpperCase(text) {
      return text&&text.toUpperCase()
    }
  },
};
</script>

<style lang='less'>
.order-track-component {
  .order-track {
    margin-top: 0 !important;
    transform: translateY(-50%);
    .el-dialog__body {
      padding: 8px 16px 16px;
    }
  }
  .order-track-content {
    .track-item {
      &:nth-of-type(2) {
        margin-top: 16px;
        .shoping-transport {
          margin-bottom: 8px;
        }
      }
      .shoping-transport {
        font-weight: bold;
        font-size: 14px;
        line-height: 18px;
        /* identical to box height, or 129% */

        color: #000000;
      }
      .transport-conatiner {
        margin-top: 5px;
        height: 48px;
        padding: 0 12px 0 16px;
        box-sizing: border-box;
        /* White */
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #ffffff;
        border-radius: 10px;
        .transport-left {
          display: flex;
          align-items: center;
        }
        img {
          width: 24px;
          height: 24px;
          display: block;
          cursor: pointer;
        }
        .strong-text {
          font-weight: bold;
          font-size: 14px;
          line-height: 16px;
          /* identical to box height, or 114% */

          /* Blak 33 */

          color: #333333;
        }
        .track-order-number {
          font-size: 12px;
          margin: 0 12px 0 8px;
          line-height: 14px;
          word-break: break-all;
          /* identical to box height, or 117% */

          color: #000000;
        }
      }
      .shoping-transport {
      }
    }
    .order-track-tip {
      margin-top: 8px;
      font-size: 12px;
      line-height: 16px;
      color: #979797;
    }
  }
}
</style>