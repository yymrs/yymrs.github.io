<template>
  <div></div>
</template>
<script>
import { isShow, questionHasCommit } from '@/api/login';
export default {
  name: 'ShopifyLogin',
  components: {},
	data() {
		return {}
  },
  computed: {},
  watch:{},
  methods: {},
	created() {
    let urlData = {userId: ''};
    if(window.location.href.indexOf('userId') > -1) {
      window.location.href.split('?')[1].split('&').forEach(item=>{
        let val = item.split('=');
        urlData[val[0]] = val[1];
      })
    }
    const loading = this.$loading({
      lock: true,
      text: '',
      spinner: 'el-icon-loading',
      background: 'rgba(51, 51, 51, 0.25)'
    });
    // let bindshopifyVal = JSON.parse(localStorage.getItem('BINDSHOPIFY'));
    this.$store.dispatch('user/nologin', {
      userId: (urlData['userId'] === 'null' || urlData['userId'] === '' || urlData['userId'] === undefined || urlData['userId'] === 'undefined') ? undefined : Number(urlData['userId'])
    })
    .then((reself) => {
      loading.close();
      // localStorage.setItem('ISFIRSTLOGIN', ((reself.result.completed===0) || (reself.result.hasInviteCode===false)) ? true : false); // true:首次登录
      isShow({}, (res) => {
        questionHasCommit({}, (requestion) => {
          localStorage.setItem('ISFIRSTLOGIN', (!(res.result)) ? true : false); // true:首次登录
          localStorage.setItem('COMPLETED', reself.result.completed)
          localStorage.setItem('QUESTIONNAIRE', requestion.data);
          localStorage.setItem('HASINVITECODE', reself.result.hasInviteCode)
          localStorage.setItem('ALLINFO', JSON.stringify(reself.result));
          !(reself.result.completed) // 0：需要采集 1：不需要采集
          ? this.$router.push({path: '/login/info'})
          // : !(reself.result.hasInviteCode) // false：需要录入 true：不需要录入
          //   ? this.$router.push({path: '/login/invite-code'})
          // : !reself.result.hasCreateStore
          //   ? this.$router.push({path: '/login/setup-store'})
          //   : (bindshopifyVal && bindshopifyVal.action)
          //     ? this.$router.push({path: '/channels'})
          : !(requestion.data) // false：需要录入 true：不需要录入
            ? this.$router.push({path: '/login/questionnaire'})
            : this.$router.push({path: '/'})
        },
        () => {},
        () => {})
      },
      () => {},
      () => {})
    })
    .catch(() => {
      loading.close();
      this.$router.push({path: '/login'})
    })
  },
  mounted() {},
  activated() {}
}
</script>

<style lang="less">
</style>