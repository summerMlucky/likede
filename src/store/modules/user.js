import { loginAPI } from '@/api/login'
export default {
  namespaced: true,
  state: {
    token: null,
    msg: ''
  },
  mutations: {
    SET_TOKEN(data, payload) {
      data.token = payload
    },
    SET_MSG(data, payload) {
      data.msg = payload
    }
  },
  actions: {
    async loginAction({ commit }, loginData) {
      const { data } = await loginAPI(loginData)
      commit('SET_TOKEN', data.token)
      commit('SET_MSG', data.msg)
      console.log(data)
    }
  }
}
