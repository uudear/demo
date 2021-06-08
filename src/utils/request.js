import axios from 'axios'
import Cookies from 'js-cookie'
import qs from 'qs'
import isPlainObject from 'lodash/isPlainObject'

const isProd = process.env.NODE_ENV === 'development'
const baseURL = isProd ? process.env.VUE_APP_GATEWAY : process.env.VUE_APP_PIXAPI
console.log('baseURL', process.env)

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
  if (isPlainObject(config.params)) {
    config.params = {
      ...defaults,
      ...config.params
    }
  }
  if (isPlainObject(config.data)) {
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

export default http
