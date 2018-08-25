import httpRequest from '@/assets/scripts/request'

/**
 * 获取信用玩法彩种的游戏列表
 */
export function getCreditLotteryList () {
  return httpRequest({
    url: '/task/lotteryGameKgController/getGameList',
    method: 'post',
    timeout: 50000
  })
}

/**
 * 信用玩法投注
 * @param params
 */
export function bet (params) {
  return httpRequest({
    url: '/task/gameBetManger/lotteryBet',
    method: 'post',
    data: params
  })
}

/**
 * 获取用户下注记录
 * @param data
 */
export function getUserGameBetList (data) {
  return httpRequest({
    url: '/task/lotteryGameKgController/getUserGameBetInfo',
    method: 'post',
    data
  })
}

/**
 * 获取游戏开奖历史记录
 * @param data
 */
export function getLotteryDrawHistory (data) {
  return httpRequest({
    url: '/task/lotteryGameKgController/getChartList',
    method: 'post',
    data
  })
}

/**
 * 盘口信息
 * @param data
 * @returns {*}
 */
export function getPanInfo (data) {
  return httpRequest({
    url: '/admin/gameBetRule/getGameBetRuleByGameCode',
    method: 'post',
    data
  })
}

/**
 * 即时注单
 * @param data
 * @returns {*}
 */
export function getCurrentBet () {
  return httpRequest({
    url: '/task/lotteryGameKgController/queryNowBet',
    method: 'post'
  })
}

/**
 * 今日输赢
 * @returns {*}
 */
export function getTodayTotalWin () {
  return httpRequest({
    url: '/task/lotteryGameKgController/getWinOrLoseToday',
    method: 'post'
  })
}

/**
 * 获取彩种开奖信息
 * @param {组id, 彩票id}
 */
export function getLotterysInfo (query) {
  return httpRequest({
    url: '/task/lotteryGameKgController/PcLoadKgGameResult',
    method: 'post',
    data: query
  })
}

/**
 * 获取游戏的开奖结果
 * @param {组id, 彩票id}
 */
export function getLotteryDraw (query) {
  return httpRequest({
    url: '/task/lotteryGameKgController/getLotteryGameResult',
    method: 'post',
    data: query
  })
}
/**
 * 获取用户url信息，根据token获取
 * @returns {*}
 */
export function getUrlByToken (data) {
  return httpRequest({
    url: '/task/lotteryGameKgController/getUrlByToken',
    method: 'post',
    data
  })
}

/**
 * 即时注单详情
 * @returns {*}
 */
export function getCurrentBetDetail (data) {
  return httpRequest({
    url: '/task/lotteryGameKgController/queryBetDetail  ',
    method: 'post',
    data
  })
}

/**
 * 获取赔率及页面渲染相关的
 * @returns{彩票代码lotteryCode}
 */
export function queryOddsByCode (data) {
  return httpRequest({
    url: '/task/lotteryGameKgController/queryOddsByCode',
    method: 'post',
    data
  })
}
