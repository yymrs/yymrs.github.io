const mixin = {
  methods: {
    recentViewedFunc(item) {
      let recentviewed = ( localStorage.getItem('RECENTVIEWED') && localStorage.getItem('RECENTVIEWED') !== 'null' )
        ? JSON.parse((localStorage.getItem('RECENTVIEWED')))
        : [];
      recentviewed.push(item);
      this.unique = (arr)=> {
        const res = new Map();
        return arr.filter((arr) => !res.has(arr.id) && res.set(arr.id, 1))
      }
      let middleval = this.unique(recentviewed); // 去重
      let middlevalSplice = [];
      if(middleval.length > 10) {
        middlevalSplice = middleval.splice(middleval.length-10,10);
      } else {
        middlevalSplice = middleval;
      }
      let middlevalChange = JSON.stringify(middlevalSplice);
      localStorage.setItem('RECENTVIEWED', middlevalChange);
      this.$store.commit('localdata/RECENT_VIEWED', middlevalSplice);
    }
  }
}

export default mixin