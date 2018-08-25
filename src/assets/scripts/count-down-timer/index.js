import CDT from './count-down-timer'

export default {
  install (Vue) {
    Vue.prototype.$timer = new CDT()
  }
}
