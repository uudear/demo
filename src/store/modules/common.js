import Cookies from 'js-cookie'

const TOKEN_KEY = 'login_token'
export default {
  state: {
    isLogin: Cookies.get(TOKEN_KEY),
    token: Cookies.get(TOKEN_KEY),
    menuList: [], // 左侧菜单列表（后台返回，未做处理）
    menuRouteLoaded: false // 左侧菜单是否已经加载
  },
  mutations: {
    setToken (state, token) {
      console.log('setToken', token)
      state.token = token
      Cookies.set(TOKEN_KEY, token)
    },
    setMenuList (state, menuList) {
      state.menuList = menuList
    },
    setMenuRouteLoaded (state, menuRouteLoaded) {
      state.menuRouteLoaded = menuRouteLoaded
    }
  },
  actions: {
    logOut () {
      Cookies.remove(TOKEN_KEY)
    }
  }
}
