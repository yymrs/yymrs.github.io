/*
  * overflow: scroll;
  * @scroll="scrollDom"
  * scrollDom() {this.domScroll('search_results_page', 'search');}
  * this.amplitudeFunc('search_results_page', true); // 在数据加载完成之后调用
*/

const mixin = {
  data() {
    return {
      productsId: [],
      observerData: {
        initflag: false,
        m1: 0,
        m2: 0,
        timer: null,
        scrollflag: false,
        allProductId: [],
        jumpPageflag: false,
        activatedflag: false,
        pv_id_val: ''
      }
    };
  },
  methods: {
    comFunc(page) {
      let rankVal = [];
      let self = this;
      self.productsId.forEach((item, index)=>{
        if(self.observerData.allProductId.indexOf(item) > -1) {
          rankVal.push(index);
        }
      })
      this.pv_id_val = this._global.userId?this._global.pv_id_func(this._global.userId):this._global.pv_id_func(this.$amplitude.getInstance().options.deviceId);
      this.amplitude.pv_id = this.pv_id_val;
      this.$route.params.pv_id = this.pv_id_val;
      let event_value;
      switch(page) {
        case 'search_results_page':
          event_value = this.$route.query.keyword;
          break;
        case 'product_listing_page':
          event_value = this.$route.path.substring(10);
          break;
      }
      console.log(111, 'page埋点-----1', page, this.$route.query.keyword, this.pv_id_val, this.$route.params.pv_id);
      self.$amplitude.getInstance().logEvent('imp', {
        'page_code': page,
        'module_code': '',
        'position_code': '',
        'event_target': 'page',
        'event_value': event_value || '',
        'pv_id': self.pv_id_val,
        'url': window.location.href
      });
      if(self.observerData.allProductId.length!==0) {
        console.log(1100, 'product埋点-----', page, rankVal, self.observerData.allProductId, self.pv_id_val);
        self.$amplitude.getInstance().logEvent('imp', {
          'page_code': page,
          'module_code': 'product_listing',
          'position_code': rankVal,
          'event_target': 'product',
          'event_value': self.observerData.allProductId,
          'pv_id': self.pv_id_val,
          'url': window.location.href
        });
      }
    },
    comFuncSettimeout(page) {
      setTimeout(() => {
        this.comFunc(page);
      }, 1000);
    },
    domScroll(page, domescrollPage) {
      let self = this;
      this.observerData.scrollflag = true;
      // console.log('滚动开始了', this.observerData.scrollflag)
      clearTimeout(this.observerData.timer) // 每次滚动前 清除一次
      this.observerData.timer = setTimeout(function() {
        self.domData(page, domescrollPage);
      }, 1000); // 滚动结束停留1s埋点一次
      this.observerData.m1 = document.getElementsByClassName(domescrollPage)[0].scrollTop;
    },
    domData(page, domescrollPage) {
      this.observerData.m2 = document.getElementsByClassName(domescrollPage)[0].scrollTop;
      if(this.observerData.m2 == this.observerData.m1){
        this.observerData.scrollflag = false;
        console.log('滚动结束了', this.observerData.allProductId);
      // if(this.observerData.allProductId.length > 0) {
        let rankVal = [];
        this.productsId.forEach((item, index)=>{
          if(this.observerData.allProductId.indexOf(item) > -1) {
            rankVal.push(index);
          }
        })
        if(this.jumpPageflag) { // 翻页到其他页会默认scroll到顶部
          console.log(111, 'page埋点-----2', page, this.pv_id_val);
          this.jumpPageflag = false;
          this.$amplitude.getInstance().logEvent('imp', {
            'page_code': page,
            'module_code': '',
            'position_code': '',
            'event_target': 'page',
            'event_value': '',
            'pv_id': this.pv_id_val,
            'url': window.location.href
          });
        }
        if(this.observerData.activatedflag === false && this.observerData.allProductId.length!==0) {
          console.log(1200, 'product埋点-----', page, rankVal, this.observerData.allProductId, this.pv_id_val);
          this.$amplitude.getInstance().logEvent('imp', {
            'page_code': page,
            'module_code': 'product_listing',
            'position_code': rankVal,
            'event_target': 'product',
            'event_value': this.observerData.allProductId,
            'pv_id': this.pv_id_val,
            'url': window.location.href
          });
        }
        // setTimeout(() => {
        //   this.observerData.activatedflag = false;
        // }, 1000);
      // }
      }
    },
    domQuery(selector) {
      return Array.from(document.querySelectorAll(selector));
    },
    amplitudeFunc(page, isLoad) { // 埋点，isLoad是瀑布流还是翻页
      let self = this;
      let observer = new IntersectionObserver(
        function(changes) {
          // console.log(666, changes);
          let showValAllTrue = changes.filter((item)=>{
            return item.isIntersecting === true;
          })
          let showValAllFalse = changes.filter((item)=>{
            return item.isIntersecting === false;
          })
          let showValAllIdTrue = showValAllTrue.map(item=>{
            let a = item.target.getElementsByTagName('a')[0].href;
            return Number(a.substring(a.indexOf('id')+3).split('&')[0])
          })
          let showValAllIdFalse = showValAllFalse.map(item=>{
            let a = item.target.getElementsByTagName('a')[0].href;
            return Number(a.substring(a.indexOf('id')+3).split('&')[0])
          })
          self.observerData.allProductId.push(...showValAllIdTrue);
          self.observerData.allProductId = self.observerData.allProductId.filter((item)=>{
            return showValAllIdFalse.indexOf(item) === -1
          })
          self.observerData.allProductId = Array.from(new Set(self.observerData.allProductId));
          // self.initobserverData = self.observerData.allProductId;
        },
        {
          threshold: 0.7
        }
      )
      this.$nextTick(()=>{
        this.domQuery('.products-single').forEach(function (item) {
          observer.observe(item);
        });
      })
      setTimeout(() => { // 这里不能放在IntersectionObserver里，不得不通过setTimeout
        if(self.cmsDetailProduct) { // 活动页
          self.products = self.cmsDetailProduct;
        }
        if(self.detaileList) { // 合集详情页
          self.products = self.detaileList;
        }
        self.productsId = self.products.map((item)=>{
          return item.id
        })
        console.log(222, '所有的数据Id----', self.curPage, self.productsId, self.observerData.allProductId, self.observerData.scrollflag);
        this.amplitude.event_value_productsId = self.productsId;
        let isLoadVal;
        if(isLoad) {
          isLoadVal = (self.curPage === 2);
          if(self.cmsDetailProduct) {
            isLoadVal = (self.curPage === 3);
          }
        } else {
          isLoadVal = true;
        }
        if(self.observerData.scrollflag === false && isLoadVal) {
          this.comFunc(page);
        }
      }, 500);
    }
  }
}

export default mixin