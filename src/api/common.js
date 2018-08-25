import httpRequest from '@/assets/scripts/request'

/**
 * 获取用户信息
 * @param params
 */
export function getUserInfoByToken (params) {
  return httpRequest({
    url: '/game/userManager/getUserInfoByToken',
    method: 'post',
    data: params
  })
}

/**
 * 根据 userId 获取用户余额
 * @param params
 */
export function getUserBalance (params) {
  return httpRequest({
    url: '/game/userManager/userAmount',
    method: 'post',
    data: params
  })
}

/**
 * 收藏或取消收藏彩种
 * @param data
 * @returns {*}
 */
export function submitLikeGame (data) {
  return httpRequest({
    url: '/admin/lotteryGame/submitLikeGame',
    method: 'post',
    data
  })
}

/**
 * 获取喜欢收藏彩种
 * @param data
 * @returns {*}
 */
export function getLikeLotteryGame (data) {
  return httpRequest({
    url: '/admin/lotteryGame/getLikeLotteryGame',
    method: 'post',
    data
  })
}

/**
 * 获取热门彩种
 * @param data
 * @returns {*}
 */
export function getHotLotteryGame (data) {
  return httpRequest({
    url: '/admin/lotteryGame/getHotLotteryGame',
    method: 'post',
    data
  })
}

/**
 * 获取两面长龙
 * @param data
 * @returns {*}
 */
export function getDewdropList (data) {
  return httpRequest({
    url: '/task/lotteryGameKgController/getDewdropList',
    method: 'post',
    data
  })
}

/**
 * 彩票走势图表
 * @param data
 * @returns {*}
 */
export function getHistoryChartList (data) {
  return httpRequest({
    url: '/task/lotteryGameKgController/getHistoryChartList',
    method: 'post',
    data
  })
}
