import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import store from '@/store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import http from '@/utils/request'

Vue.use(ElementUI)

Vue.config.productionTip = false

// 挂载全局
Vue.prototype.$http = http

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
