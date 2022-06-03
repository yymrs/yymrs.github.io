let recentSearches = localStorage.getItem('RECENTSEARCHES');
let recentSearchesNew = (recentSearches === 'null' || recentSearches === null)?[]:recentSearches.split(',');
let recentviewed = localStorage.getItem('RECENTVIEWED');

const state = {
  recentSearches: recentSearchesNew,
  recentviewed: JSON.parse(recentviewed) || []
}

const mutations = {
  RECENT_SEARCHES: (state, recentSearches) => {
    state.recentSearches = recentSearches || [];
  },
  RECENT_VIEWED: (state, recentviewed) => {
    state.recentviewed = recentviewed;
  }
}

export default {
  namespaced: true,
  state,
  mutations
}
