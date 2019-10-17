import Vue from 'vue'
import Vuex from 'vuex'
import { getItem } from '@/utils/storage'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    // 初始化本地存储数据，没有数据为null
    user: getItem('user')
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    }
  },
  actions: {

  }
})
