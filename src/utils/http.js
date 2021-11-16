import axios from 'axios'
import { api, web } from '../config'
import Vue from 'vue'
const http = axios.create({
  baseURL: api,
  // withCredentials: true,
  timeout: 5000,
  headers: {
    common: {
      'X-Requested-With': 'XMLHttpRequest'
    },
    post: {
      'Content-Type': 'application/json',
      'Accept': 'application/json; charset=utf-8, text/plain, */*'
    },
    put: {
      'Content-Type': 'application/json',
      'Accept': 'application/json; charset=utf-8, text/plain, */*'
    }
  }
})

http.interceptors.request.use(function (request) {
  let account = JSON.parse(sessionStorage.getItem('account') || '{}')
  if (account && account.token) {
    request.headers.token = account.token
  }
  return request
}, error => Promise.reject(error))

http.interceptors.response.use(response => {
  let data = response.data
  if (data.code === 401) {
    sessionStorage.removeItem('account')
    localStorage.clear()
    Vue.prototype.$Message.error('登录过期，请重新登录')
    setTimeout(function () {
      location.href = web
    }, 2000)
    return
  }
  if (data.code !== 200 && data.message) {
    Vue.prototype.$Message.error(data.message)
  }
  return response
}, error => {
  let data = error.response.data || {}
  // if (data.code === 401) {
  //   sessionStorage.removeItem('account')
  //   localStorage.clear()
  //   Vue.prototype.$Message.error('登录过期，请重新登录')
  // } else if (data.code === 500 && data.message) {
  //   let message = '网络请求失败'
  //   Vue.prototype.$Message.error(message)
  // } else {
  //   if (data.message) {
  //     Vue.prototype.$Message.error(data.message)
  //   } else {
  //     Vue.prototype.$Message.error('网络请求失败:' + data.code)
  //   }
  // }
  console.log(data)
  if (data.code === 500) {
    Vue.prototype.$Message.error('网络请求失败')
  }
  return Promise.reject(error)
})
export default {
  install (Vue) {
    Vue.prototype.$http = http
  }
}
