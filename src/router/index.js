import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import $http from '@/utils/request'
import Cookies from 'js-cookie'
import { isURL } from '@/utils/validate'

const TOKEN_KEY = 'login_token'

Vue.use(Router)

function filterTree (fn, tree) {
  if (tree && tree.length) {
    tree = tree.filter(fn,
      tree.map(item => ({ ...item, children: filterTree(fn, item.children) }))
    )
  }
  // console.log('过滤后的菜单', tree)
  return tree
}

const pageRoutes = [
  {
    path: '/404',
    component: () => import('@/views/common/404'),
    name: '404',
    meta: { title: '404未找到' },
    beforeEnter (to, from, next) {
      // 拦截处理特殊业务场景
      // 如果, 重定向路由包含__双下划线, 为临时添加路由
      if (/__.*/.test(to.redirectedFrom)) {
        return next(to.redirectedFrom.replace(/__.*/, ''))
      }
      next()
    }
  },
  {
    path: '/login', component: () => import('@/views/common/login'), name: 'login', meta: { title: '登录' }
  }
]

// 模块路由(基于主入口布局页面)
export const moduleRoutes = {
  path: '/',
  component: () => import('@/views/layout/main'),
  name: 'main',
  redirect: { name: 'home' },
  meta: { title: '主入口布局' },
  children: [
    {
      path: '/home',
      component: () => import('@/views/common/home'),
      name: 'home',
      meta: { title: '首页', isTab: true }
    }
  ]
}

const router = new Router({
  mode: 'history',
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: pageRoutes.concat(moduleRoutes)
})

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

router.beforeEach((to, from, next) => {
  // 登录界面登录成功之后，会把用户信息保存在会话
  // 存在时间为会话生命周期，页面关闭即失效。
  const isLogin = Cookies.get(TOKEN_KEY)
  if (to.path === '/login') {
    // 如果是访问登录界面，如果用户会话信息存在，代表已登录过，跳转到主页
    if (isLogin) {
      next({ path: '/' })
    } else {
      next()
    }
  } else {
  // 如果访问非登录界面，且户会话信息不存在，代表未登录，则跳转到登录界面
    if (!isLogin) {
      next({ path: '/login' })
    } else {
      // 加载动态菜单和路由
      addDynamicMenuAndRoutes()
      next()
    }
  }
})
/**
* 加载动态菜单和路由
*/
function addDynamicMenuAndRoutes () {
  console.log('store', store.state.menuRouteLoaded)
  if (store.state.menuRouteLoaded) {
    return
  }
  $http.get('/sys/menu/nav').then((res) => {
    // 添加动态路由
    const menuList = filterTree(item => item.appCode === 'FMEA', res)
    addDynamicRoutes([...menuList])

    // 保存加载状态
    store.commit('setMenuRouteLoaded', true)
    // 保存菜单
    store.commit('setMenuList', menuList)
  }).catch((err) => {
    console.log('err', err)
  })
}

function addDynamicRoutes (menuList = [], routes = []) {
  var routeTemp = []
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      for (var y = 0; y < menuList[i].children.length; y++) {
        if (menuList[i].url.search('/router') !== -1) {
          menuList[i].children[y].url = `${menuList[i].url}/${menuList[i].children[y].url}`
        } else {
          menuList[i].children[y].url = `${menuList[i].url}/router/${menuList[i].children[y].url}`
          routeTemp.push(menuList[i].children[y])
        }
      }
      temp = temp.concat(menuList[i].children)
    } else if (menuList[i].url) {
      routeTemp.push(menuList[i])
    }
  }
  routeTemp.forEach((item, index) => {
    console.log('内容', item)
    // 创建路由配置
    var route = {
      path: item.url.replace('/router', ''),
      component: null,
      name: item.name,
      meta: {
        menuId: item.id,
        title: item.name,
        isDynamic: true,
        isTab: true,
        iframeUrl: ''
      }
    }
    // url以http[s]://开头, 通过iframe展示
    if (isURL(item.url)) {
      route.path = item.url.replace('/router', '')
      route.name = item.name
      route.meta.iframeUrl = item.url
    } else {
      route.component = resolve => require([`@/views/modules/${item.url}`], resolve)
    }
    routes.push(route)
  })
  if (temp.length >= 1) {
    addDynamicRoutes(temp, routes)
  }
  console.log('menuList', routes)

  // const newmoduleRoutes = {
  //   path: '/',
  //   component: () => import('@/views/layout/main'),
  //   name: 'main',
  //   redirect: { name: `${routes[0].name}` },
  //   meta: { title: '主入口布局' },
  //   children: [
  //     {
  //       path: `${routes[0].path.replace('/router', '')}`,
  //       component: () => resolve => require([`@/views/modules/${routes[0].path}`], resolve),
  //       name: `${routes[0].name}`,
  //       meta: { title: '首页', isTab: true }
  //     }
  //   ]
  // }
  // 添加路由
  router.addRoutes([
    {
      ...moduleRoutes,
      name: 'main-dynamic-menu',
      children: routes
    },
    { path: '*', redirect: { name: '404' } }
  ])
}
console.log('内容', router)
export default router
