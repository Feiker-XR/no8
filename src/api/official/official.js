import httpRequest from '@/assets/scripts/requestGF'

/**
 * 获取当前时间期数
 * @param {彩票代码lotteryCode}
 */
export function getLotteryDrawTime (data) {
  return httpRequest({
    url: '/game/officialottery/getCurrentData',
    method: 'post',
    data
  })
}

/**
 * 查询彩种列表
 * @param {*} data
 */
export function getOfficialLotteryList (data) {
  return httpRequest({
    url: '/game/officialottery/getGameList',
    method: 'post',
    data
  })
}

/**
 * 查询开奖结果
 * @param data
 */
export function getCurrentResult (data) {
  return httpRequest({
    url: '/game/officialottery/getCurrentResult',
    method: 'post',
    data
  })
}

/****
 * 官方玩法下注
 * @param data
 */
export function officialBetGame (data) {
  return httpRequest({
    url: '/task/baseGameBetManger/baseBetGame',
    method: 'post',
    data
  })
}

/**
 * 获取玩法赔率
 * @param data
 */
export function getProxyPlayList (data) {
  return httpRequest({
    url: '/game/officialottery/getProxyPlayList',
    method: 'post',
    data
  })
}
