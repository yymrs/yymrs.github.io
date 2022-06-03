const getters = {
  token: state => state.user.token,
  shopId: state => state.user.shopId,
  userInfo: state => state.user.userInfo,
  recentSearches: state => state.localdata.recentSearches,
  recentviewed: state => state.localdata.recentviewed,
  autoCheckout: state => state.layout.autoCheckout,
  searchOrder: state => state.layout.searchOrder
}
export default getters
