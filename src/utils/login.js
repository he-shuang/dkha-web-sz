import axios from 'axios'
import Cookies from 'js-cookie'
const ajax = axios.create({
    baseURL: window.GLOBAL_CONFIG['loginUrl'],
    timeout: 1000 * 180,
})
/**
 * 请求拦截
 */
ajax.interceptors.request.use(config => {
    if (config.url !== '/map/account/token') {
      config.headers['Authorization'] = 'Bearer ' + Cookies.get('token') || ''
    }
    return config
  }, error => {
    return Promise.reject(error)
  })
/**
 * 响应拦截
 */
ajax.interceptors.response.use(response => {
    return response
}, error => {
    console.error(error)
    return Promise.reject(error.response)
})

export default ajax