import { loginPost, logoutPost, shopifyLogin, userInfo } from "@/api/login"
import VueCookies from 'vue-cookies'

const state = {
  token: VueCookies.get('TOKEN'),
  shopId: '',
  userInfo: ''
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_SHOPID: (state, shopId) => {
    state.shopId = shopId
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  nologin ({ commit }, params) {
    return new Promise((resolve, reject) => {
      shopifyLogin(params,
      (res) => {
        let recentsearches = localStorage.getItem('RECENTSEARCHES');
        let recentviewed = localStorage.getItem('RECENTVIEWED');
        localStorage.clear();
        localStorage.setItem('RECENTSEARCHES', recentsearches);
        localStorage.setItem('RECENTVIEWED', recentviewed);
        let result = res.result
        let userInfo = {
          id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          avatar: result.profilePhoto,
          mobile: result.mobile,
          email: result.email,
          shopId: result.shopVo.id,
          domainName: result.shopVo.domainName,
          uuId: result.uuId,
          invitationCode:result.shopVo.shareCode,
          permitStatus:result.permitStatus,
        }
        commit('SET_TOKEN', result.token)
        commit('SET_SHOPID', result.shopVo.id)
        commit('SET_USERINFO', userInfo)
        VueCookies.set("TOKEN", result.token) // 不写过期时间默认是1day
        sessionStorage.setItem('SHOPID', result.shopVo.id)
        localStorage.setItem('USERINFO', JSON.stringify(userInfo))
        resolve(res);
      },
      (err) => { reject(err) },
      (com) => { console.log(com) })
    })
  },
  login ({ commit }, params) {
    return new Promise((resolve, reject) => {
      loginPost(params,
      (res) => {
        let result = res.result
        let userInfo = {
          id: result.id,
          firstName: result.firstName,
          lastName: result.lastName,
          avatar: result.profilePhoto,
          mobile: result.mobile,
          email: result.email,
          shopId: result.shopVo.id,
          domainName: result.shopVo.domainName,
          uuId: result.uuId,
          firstNotice: result.firstNotice,
          invitationCode:result.shopVo.shareCode,
          permitStatus:result.permitStatus,
        }
        commit('SET_TOKEN', result.token)
        commit('SET_SHOPID', result.shopVo.id)
        commit('SET_USERINFO', userInfo)
        VueCookies.set("TOKEN", result.token) // 不写过期时间默认是1day
        sessionStorage.setItem('SHOPID', result.shopVo.id)
        localStorage.setItem('USERINFO', JSON.stringify(userInfo))
        resolve(res);
      },
      (err) => { reject(err) },
      (com) => { console.log(com) })
    })
  },
  logout ({ commit }) {
    commit('SET_TOKEN', '')
    commit('SET_SHOPID', '')
    commit('SET_USERINFO', '')
    VueCookies.remove('TOKEN')
    sessionStorage.removeItem('SHOPID')
    localStorage.removeItem('USERINFO')
    localStorage.removeItem('UTMINFO')
    localStorage.removeItem('COMPLETED')
    localStorage.removeItem('QUESTIONNAIRE')
    // localStorage.removeItem('isShopifyORhasCreateStore')
    localStorage.removeItem('HASINVITECODE')
    localStorage.removeItem('ALLINFO')
    localStorage.removeItem('ISFIRSTLOGIN')
    localStorage.removeItem('BINDSHOPIFY')
    localStorage.removeItem('ISWHITEUSER')
    // localStorage.removeItem('ACTIVITYURL')
    localStorage.removeItem('EMAIL')
    let recentsearches = localStorage.getItem('RECENTSEARCHES');
    let recentviewed = localStorage.getItem('RECENTVIEWED');
    let ACTIVITYURL = localStorage.getItem('ACTIVITYURL')
    localStorage.clear(); // 清除掉localStorage，但排除RECENTSEARCHES
    localStorage.setItem('RECENTSEARCHES', recentsearches);
    localStorage.setItem('RECENTVIEWED', recentviewed);
    localStorage.setItem('ACTIVITYURL', ACTIVITYURL);
    return new Promise((resolve, reject) => {
      logoutPost({},
      (res) => { resolve(res)},
      (err) => { reject(err) },
      (com) => { console.log(com) })
    })
  },
  // 
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      let userInfoItem = localStorage.getItem('USERINFO')
      if (!userInfoItem) { reject('Verification failed,\n please Login again.') }
      let userInfo = JSON.parse(userInfoItem)
      const { shopId } = userInfo
      commit('SET_SHOPID', shopId)
      commit('SET_USERINFO', userInfo)
      resolve({shopId})
      this.state.user?.token&&this.dispatch('user/reloadUserPhotoInfo')
    })
  },
  // 重新加载用户头像信息
  reloadUserPhotoInfo() {
    return new Promise((resolve,reject)=>{
      userInfo({}, (resUser) => {
        console.log(resUser);
        // 重新赋值头像地址，并更新vuex和store里面的用户数据
        const profilePhoto = resUser.result.profilePhoto
        const userInfo = Object.assign({},this.state.user.userInfo) 
        userInfo.avatar = profilePhoto
        this.dispatch('user/setUserInfo',userInfo).then(()=>{
          resolve()
        })
      },
      () => {
        reject()
      },
      () => {})
    })
  },
  setUserInfo({ commit }, userInfo) {
    return new Promise(resolve => {
      commit('SET_USERINFO', userInfo)
      localStorage.setItem('USERINFO', JSON.stringify(userInfo))
      resolve()
    })
  },
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      VueCookies.remove('TOKEN')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
