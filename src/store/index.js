// 专门处理vuex中的模块

import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 放置需要共享的状态
    user: auth.getUser() // token对象
  },
  // 要改token 要通过mutations
  mutations: {
    // 修改
    // 删除
    updateUser (state, payload) {
      state.user = payload.user // 将载荷的数据给user
      // 更新vuex时应该将最新的数据存入缓存
      auth.setUser(payload.user) // 保持vuex和本地存储同步
    },
    delUser (state) {
      state.user = {} // 将vuex中的token设置为空对象
      auth.delUser() // 删除本地缓存中的token
    }
  },
  actions: {
  },
  modules: {
  }
})
