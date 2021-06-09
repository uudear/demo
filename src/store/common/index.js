import Cookies from 'js-cookie'

const TOKEN_KEY = 'login_token'
export default {
  state: {
    isLogin: Cookies.get(TOKEN_KEY),
    token: Cookies.get(TOKEN_KEY)
  },
  mutations: {
    setToken (state, token) {
      state.token = token
      Cookies.get(TOKEN_KEY)
    }
  },
  actions: {
    login (params = {}) {
      this.$.post('/login/user', {
        ...params
      }).then(res => {

      })
    },
    loginout () {
      Cookies.remove(TOKEN_KEY)
    }
  }
}
