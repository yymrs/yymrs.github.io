<template>
  <div class="common-pagination">
    <div class="prev-page" @click="goPage(active-1)" :class="{dislale:prevDislale}">
      <i class="el-icon-arrow-left"></i>
      <span>Back</span>
    </div>
    <div class="page-count-box"><!--  v-if="!isWebMobile" -->
      <div class="page-number" :class="{ 'active-page':1 === active }" @click="goPage(1)" v-if="active > 0">1</div>
      <div class="more-prev" :style="{'margin-left':showNextMore?0:0}" v-if="showPrevMore" @click="shoMore('prev')">
        <i class="el-icon-more"></i>
      </div>
      <div class="page-number" @click="goPage(number)" :class="{ 'active-page':number === active }" v-for="number in pagers" :key="number">{{number}}</div>
      <div class="more-next" :style="{'margin-left':showNextMore?0:0}" v-if="showNextMore" @click="shoMore('next')">
        <i class="el-icon-more"></i>
      </div>
      <div class="page-number" :class="{ 'active-page':totalPages === active }" @click="goPage(totalPages)" v-if="totalPages > 1">{{totalPages}}</div>
    </div>
    <div class="next-page" @click="goPage(active+1)" :class="{dislale:nextDislale}">
      <span>Next</span>
      <i class="el-icon-arrow-right"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    totalPages: {
      type: Number,
      default: 1
    },
    curPage: {
      type: Number,
      default: 1
    }
  },
  // inject: ['webMobile'],
  data () {
    return {
      showPrevMore: false,
      showNextMore: false,
      pagerCount: 16 // 最多展示16个页面
    }
  },
  computed: {
    // isWebMobile () {
    //   return this.webMobile.isWebMobile
    // },
    active () {
      return this.curPage
    },
    prevDislale () {
      return this.active <= 1
    },
    nextDislale () {
      return this.active >= this.totalPages
    },
    pagers () {
      return this.computedPage()
    }
  },
  methods: {
    computedPage () {
      const pagerCount = this.pagerCount // 展示列数总数
      const halfPagerCount = (pagerCount - 1) / 2

      const currentPage = Number(this.active) // 当前页数
      const pageCount = Number(this.totalPages)
      let showPrevMore = false
      let showNextMore = false

      if (pageCount > pagerCount) {
        if (currentPage > pagerCount - halfPagerCount) {
          showPrevMore = true
        }
        if (currentPage < pageCount - halfPagerCount) {
          showNextMore = true
        }
      }
      const array = []
      if (showPrevMore && !showNextMore) {
        const startPage = pageCount - (pagerCount - 2) // 去掉第一和最后一个
        for (let i = startPage; i < pageCount; i++) {
          array.push(i)
        }
      } else if (!showPrevMore && showNextMore) {
        for (let i = 2; i < pagerCount; i++) {
          array.push(i)
        }
      } else if (showPrevMore && showNextMore) {
        const offset = Math.floor(pagerCount / 2) - 1
        for (let i = currentPage - offset; i <= currentPage + offset; i++) {
          array.push(i)
        }
      } else {
        for (let i = 2; i < pageCount; i++) {
          array.push(i)
        }
      }

      this.showPrevMore = showPrevMore
      this.showNextMore = showNextMore
      return array || []
    },
    goPage (number, tyep) {
      if (typeof tyep === 'string') {
        const pagerCountOffset = this.pagerCount / 2
        const active = this.active
        const newPage = tyep === 'next' ? (active + pagerCountOffset) : (active - pagerCountOffset)
        this.$emit('jumpPage', newPage)
        return
      }
      if (number <= 0 || number > this.totalPages) {
        return
      }
      if (!isNaN(number)) {
        if (number < 1) {
          number = 1
        }
        if (number > this.totalPages) {
          number = this.totalPages
        }
      }
      this.$emit('jumpPage', number)
    },
    shoMore (type) {
      const pagerCountOffset = this.pagerCount - 2
      const currentPage = this.active
      let newPage
      if (type === 'prev') {
        newPage = currentPage - pagerCountOffset
      } else {
        newPage = currentPage + pagerCountOffset
      }
      /* istanbul ignore if */
      if (!isNaN(newPage)) {
        if (newPage < 1) {
          newPage = 1
        }
        if (newPage > this.totalPages) {
          newPage = this.totalPages
        }
      }
      this.$emit('jumpPage', newPage)
    }
  }
}
</script>

<style lang="less">
.common-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  @media screen and (min-width: 768px){
    padding: 0 40px;
  }
  @media screen and (max-width: 768px) {
    padding: 0 24px;
    justify-content: space-between;
  }
  .prev-page,.next-page {
    cursor: pointer;
    font-weight: bold;
    font-size: 14px;
    display: flex;
    align-items: center;
    // padding: 4px 8px;
    i {
      font-weight: bolder;
      font-size: 14px;
    }
    &.dislale {
      // opacity: .4;
      color: #979797;
      cursor: initial;
    }
    &:not(.dislale):hover {
      background: #EEEEEE;
      border-radius: 20px;
    }
    &.prev-page {
      padding: 4px 8px 4px 4px;
    }
    &.next-page {
      padding: 4px 4px 4px 8px;
    }
  }
  .more-prev,.more-next {
    display: flex;
    align-items: center;
    cursor: pointer;
    margin: 0 4px;
  }
  .page-count-box {
    display: flex;
    // flex: 1;
    // max-width: 500px;
    margin: 0 24px;
    color: #333;
    .page-number {
      margin-right: 4px;
      padding:0 8px;
      border-radius: 50%;
      cursor: pointer;
      // width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      &:last-child {
        margin: 0;
      }
      &:hover {
        background: #EEEEEE;
      }
    }
    .active-page {
      color: #fff !important;
      background: #333 !important;
    }
  }
}
</style>
