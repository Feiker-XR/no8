import axios from 'axios'
// import {isJson} from './util'
import {assembleParam} from './cache'
// import store from '../../store'
// import vue from '../../main'
// import {ERR_ERROR} from 'api/config'

const service = axios.create({
  baseURL: process.env.BASE_API_CREDIT,
  timeout: 60000,
  headers: {
    post: {
      'Content-Type': 'application/json'
    }
  }
})

service.interceptors.request.use(config => {
  return Object.assign(config, { data: assembleParam(config.url.replace(config.baseURL, ''), config.data) })
}, error => {
  Promise.reject(error)
})

service.interceptors.response.use(
  response => {
    // const resJsonData = !isJson(response.data) ? JSON.parse(response.data) : response.data
    // const {currentStatus, errorInformation} = resJsonData
    // if (currentStatus === ERR_ERROR && errorInformation.errCode === '非法访问') {
    //   vue.$vux.toast.text('登录失效....', 'top')
    //   setTimeout(function () {
    //     store.dispatch('loginOut').then(() => {
    //       location.reload()
    //     })
    //   }, 2000)
    // }
    return response.data
  },
  error => {
    return Promise.reject(error)
  })

export default service
