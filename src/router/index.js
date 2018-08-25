import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _import = require('./_import_' + process.env.NODE_ENV)

// 获取动动态的JSON数据
function getJSON (route) {
  let lotteryGroupName = route.params.groupCode  // 组名
  var category = route.path.startsWith('/credit') ? 'credit' : 'official'   // 官方还是信用
  let playMethod = category === 'official' ? route.params.playMethod : lotteryGroupName // 具体玩法名
  let _JSON = require('@/views/' + category + '/' + lotteryGroupName + '/conf/' + playMethod + '.json')
  return { dataObject: _JSON }
}

export default new Router({
  routes: [
    {path: '/', redirect: '/404'},
    {path: '/login/:token/:resource', component: _import('views/Login')},
    {path: '/redirect/:groupCode/:gameCode/:token/:resource', component: _import('views/Redirect')},
    {path: '/401', component: _import('views/401')},
    {path: '/404', component: _import('views/404')},
    {
      path: '/credit',    // 信用玩法
      component: _import('views/Layout'),
      children: [
        {
          path: ':groupCode/:gameCode',
          name: 'credit_' + ':gameCode',
          component: _import('views/credit/tpls/credit-view'),
          props: getJSON
        },
        {path: 'betRecord', name: 'betRecord', component: _import('views/credit/other/bet-record/bet-record')},
        {path: 'drawHistory/:gameTypeCode/:gameCode/:gameId', name: 'drawHistory', component: _import('views/credit/other/history/history')},
        {path: 'panInfo/:gameTypeCode/:gameCode/:gameId', name: 'panInfo', component: _import('views/credit/other/pan-info/pan-info')},
        {path: 'instantBetting', name: 'instantBetting', component: _import('views/credit/other/instant-betting/instant-betting')},
        {path: 'instantBetting/detail/:gameId/:gameName', name: 'instantBettingDetail', component: _import('views/credit/other/instant-betting/detail/detail')},
        {path: 'todayTotalWin', name: 'todayTotalWin', component: _import('views/credit/other/today-total-win/today-total-win')},
        {path: 'trendChart/:gameTypeCode/:gameName/:gameId', name: 'trendChart', component: _import('views/credit/other/trend-chart/trend-chart')}
      ]
    },
    {
      path: '/official',      // 官方玩法
      component: _import('views/Layout'),
      children: [
        {
          path: ':groupCode/:gameCode',
          name: 'official_' + ':gameCode',
          component: _import('views/official/tpls/official-view')
        }
      ]
    }
  ]
})
