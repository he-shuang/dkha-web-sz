import axios from 'axios'
import Cookies from 'js-cookie'
import router from '@/router'
import qs from 'qs'
import { clearLoginInfo } from '@/utils'
import isPlainObject from 'lodash/isPlainObject'
import  store from '@/store'
import { Message } from 'element-ui'

const http = axios.create({
    baseURL: window.SITE_CONFIG['apiURL'],
    timeout: 1000 * 180,
    withCredentials: true
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
    config.headers['Accept-Language'] = Cookies.get('language') || 'zh-CN'
    if (config.url !== '/auth/oauth/token') {
        config.headers['Authorization'] = 'Bearer ' + Cookies.get('access_token') || ''
    }
    // 默认参数
    var defaults = {}
        // 防止缓存，GET请求默认带_t参数
    if (config.method === 'get') {
        config.params = {
            ...config.params,
            ... { '_t': new Date().getTime() }
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

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
    if (response.data.code === 401 || response.data.code === 10001) {
        clearLoginInfo()
        router.replace({ name: 'login' })
        return Promise.reject(response.data.msg)
    }
    return response
}, error => {
    if (error.request.status === 0 && error.response === undefined && store.state.user.id) {
        // 加入 store.state.user.id   避免多个请求 重复提示
        clearLoginInfo()
        Message.warning('系统升级中，请稍后重试！')
        router.replace({ name: 'login' })
    }
    return Promise.reject(error)
})

export default http