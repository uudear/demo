import Vue from 'vue'
import VueRouter from 'vue-router'
import $ from '@/utils/request'
import Cookies from 'js-cookie'

// const TOKEN_KEY = 'login_token'

Vue.use(VueRouter)

const routes = [
]

const router = new VueRouter({
  mode: 'history',
  routes
})
router.beforeEach((to, from, next) => {
  const token = Cookies.get('login_token')
  console.log('token', !!token)
  if (token) {

  } else {
    $.get('/sys/menu/nav').then(res => {
      console.log('菜单', res)
      if (res.code !== 0) {
        Vue.prototype.$message.error(res.msg)
        return next({ name: 'login' })
      }
    })
  }
  // if()
})

export default router
