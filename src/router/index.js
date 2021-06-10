import Vue from 'vue'
import Router from 'vue-router'
// import $ from '@/utils/request'
import Cookies from 'js-cookie'

// const TOKEN_KEY = 'login_token'

Vue.use(Router)

const routes = [
  { path: '/login', component: () => import('@/views/common/login'), name: 'login', meta: { title: '登录' } }
]

// export const moduleRoutes = {
//   path: '/',
//   component: () => import('@/views/common/login'),
//   name: 'main',
//   redirect: { name: 'login' },
//   meta: { title: '主入口布局' }
// }

const router = new Router({
  mode: 'history',
  routes
})

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

router.beforeEach((to, from, next) => {
  const token = Cookies.get('login_token')
  console.log('token', !token)
  // if (!token) {
  //   return next('/login')
  // }
  // $.get('/sys/menu/nav').then(res => {
  //   console.log('菜单', res)
  //   // if (res.code !== 0) {
  //   //   Vue.prototype.$message.error(res.msg)
  //   //   return next('/login')
  //   // }
  // })
  // if()
})

export default router
