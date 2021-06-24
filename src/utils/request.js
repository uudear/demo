import axios from 'axios'
import router from '@/router'
import store from '@/store'
import Cookies from 'js-cookie'
import qs from 'qs'

const isProd = process.env.NODE_ENV === 'production'
const baseURL = isProd ? process.env.VUE_APP_GATEWAY : process.env.VUE_APP_PIXAPI

const http = axios.create({
  baseURL: baseURL,
  timeout: 1000 * 180,
  withCredentials: true
})
// 请求拦截器
http.interceptors.request.use(config => {
  config.headers['Accept-Language'] = Cookies.get('language') || 'zh-CN'
  config.headers.token = Cookies.get('login_token') || ''
  // 默认参数
  console.log('config', config)
  var defaults = {}
  // 防止缓存，GET请求默认带_t参数
  if (config.method === 'get') {
    config.params = {
      ...config.params,
      ...{ _t: new Date().getTime() }
    }
  }
  if (JSON.stringify(config.params) !== '{}') {
    config.params = {
      ...defaults,
      ...config.params
    }
  }
  if (JSON.stringify(config.data) !== '{}') {
    config.data = {
      ...defaults,
      ...config.data
    }
    if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
      config.data = qs.stringify(config.data)
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if ([401, 10004, 10010].includes(response.data.code)) {
    store.dispatch('logOut')
    router.replace({ path: '/login' })
    return Promise.reject(response.data.msg)
  } else if (response.data.code === 500) {
    const msg = Cookies.get('language') === 'zh-CN' ? '服务器内部错误' : 'Internal Server Error'
    return Promise.reject(msg)
  }
  return response.data.data
}, error => {
  console.error(error)
  return Promise.reject(error)
})

export default http
