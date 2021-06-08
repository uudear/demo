import Vue from 'vue'
import VueRouter from 'vue-router'
import $ from '@/utils/request'

Vue.use(VueRouter)

const routes = [
]

const router = new VueRouter({
  mode: 'history',
  routes
})
router.beforeEach((to, from, next) => {
  $.get('/sys/menu/nav').then(res => {
    console.log('菜单', res)
    if (res.code !== 0) {
      Vue.prototype.$message.error(res.msg)
      return next({ name: 'login' })
    }
  })
})

export default router
