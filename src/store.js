import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    account: {},
    menus: []
  },
  mutations: {
    account (state, account) {
      state.account = account
    },
    menus (state, menus) {
      state.menus = menus
    }
  }
})
