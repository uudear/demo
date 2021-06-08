import Vue from 'vue'
import App from '@/App'
import router from '@/router'
import ElementUI from 'element-ui'
import http from '@/utils/request'

Vue.use(ElementUI)

Vue.config.productionTip = false

// 挂载全局
Vue.prototype.$ = http
console.log('内容', Vue)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
