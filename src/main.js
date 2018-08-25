import Vue from 'vue'
import FastClick from 'fastclick'
import router from './router'
import App from './App'
import store from './store'
import waves from './directive/waves'
import { sync } from 'vuex-router-sync'
import countDownTimer from '@/assets/scripts/count-down-timer/index'
import { getToken } from '@/assets/scripts/cache'
import 'vue-ydui/dist/ydui.rem.css'
import { Confirm, Alert, Toast, Notify, Loading } from 'vue-ydui/dist/lib.rem/dialog'

import 'vux/src/styles/reset.less'
import 'vux/src/styles/1px.less'

import {
  ToastPlugin
} from 'vux'

// Ydui的弹框系统
Vue.prototype.$dialog = {
  confirm: Confirm,
  alert: Alert,
  toast: Toast,
  notify: Notify,
  loading: Loading
}

Vue.use(ToastPlugin)
Vue.use(waves)
Vue.use(countDownTimer)
sync(store, router)

FastClick.attach(document.body)

Vue.config.productionTip = false

const shouldUseTransition = !/transition=none/.test(location.href)

store.registerModule('vux', {
  state: {
    isLoading: false,
    direction: shouldUseTransition ? 'forward' : ''
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    },
    updateDirection (state, payload) {
      if (!shouldUseTransition) {
        return
      }
      state.direction = payload.direction
    }
  }
})

const history = window.sessionStorage
// history.clear()
let historyCount = history.getItem('count') * 1 || 0
history.setItem('/', 0)
let isPush = false
let endTime = Date.now()
let methods = ['push', 'go', 'replace', 'forward', 'back']

document.addEventListener('touchend', () => {
  endTime = Date.now()
})

methods.forEach(key => {
  let method = router[key].bind(router)
  router[key] = function (...args) {
    isPush = true
    method.apply(null, args)
  }
})

const whiteList = ['/', '/401', '/404']
router.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', {isLoading: true})

  const toIndex = history.getItem(to.path)
  const fromIndex = history.getItem(from.path)

  if (toIndex) {
    if (!fromIndex || parseInt(toIndex, 10) > parseInt(fromIndex, 10) || (toIndex === '0' && fromIndex === '0')) {
      store.commit('updateDirection', {direction: 'forward'})
    } else {
      // 判断是否是ios左滑返回
      if (!isPush && (Date.now() - endTime) < 377) {
        store.commit('updateDirection', {direction: ''})
      } else {
        store.commit('updateDirection', {direction: 'reverse'})
      }
    }
  } else {
    ++historyCount
    history.setItem('count', historyCount)
    to.path !== '/' && history.setItem(to.path, historyCount)
    store.commit('updateDirection', {direction: 'forward'})
  }
  if (/\/http/.test(to.path)) {
    let url = to.path.split('http')[1]
    window.location.href = `http${url}`
  } else {
    if (to.path.indexOf('/redirect') !== -1 || to.path.indexOf('/login') !== -1) {
      next()
    } else {  // F5刷新
      if (getToken()) {
        if (!store.getters.userAccount) {
          store.dispatch('getAccountInfo', getToken()).then(() => {
            console.log('___页面刷线: done nothing')
            next()
          }).catch(() => {
            store.dispatch('loginOut').then(() => {
              next({path: '/401'})
            }).catch(() => {
              next({path: '/401'})
            })
          })
        } else {
          next()
        }
      } else {
        if (whiteList.indexOf(to.path) !== -1) {
          next()
        } else {
          store.dispatch('loginOut').then(() => {
            next({path: '/401'})
          }).catch(() => {
            next({path: '/401'})
          })
        }
      }
    }
  }
})

router.afterEach(function () {
  isPush = false
  store.commit('updateLoadingStatus', {isLoading: false})
  store.commit('SET_BET_DATA', [])
  store.commit('SET_BET_DATA_IDS', [])
})

Date.prototype.Format = function (fmt) {
  let o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

export default new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')
