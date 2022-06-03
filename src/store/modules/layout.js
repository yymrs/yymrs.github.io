const state = {
  isAddCollection: false,
  isAddChannel: false,
  isShowCheckoutSuccess: false,
  unpaidNumb: 0,
  autoCheckout: false,
  searchOrder: ''
}

const mutations = {
  SET_AddCollection: (state, flag) => {
    state.isAddCollection = flag
  },
  SET_AddChannel: (state, flag) => {
    state.isAddChannel = flag
  },
  SET_ShowCheckoutSuccess: (state, flag) => {
    state.isShowCheckoutSuccess = flag
  },
  SET_UnPaidNum: (state, num) => {
    state.unpaidNumb = num
  },
  SET_AutoCheckout: (state, val) => {
    state.autoCheckout = val
  },
  SET_SearchOrder: (state, val) => {
    state.searchOrder = val
  },
}

export default {
  namespaced: true,
  state,
  mutations
}
