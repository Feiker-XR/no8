import * as types from './mutation-types'
import {getUserInfoByToken, getUserBalance, getLikeLotteryGame} from 'api/common'
import {getCreditLotteryList, bet} from 'api/credit/credit'
import {getOfficialLotteryList, officialBetGame} from 'api/official/official'
import {setMenus, getMenus, removeToken, removeMenus, removeResource} from '@/assets/scripts/cache'
import {
  findIndex,
  Cnm,
  unique,
  Combination,
  parse,
  joinStr,
  MathArray,
  arrToStr,
  uniqueCnm,
  uniqueCnm3,
  uniquePK10,
  unique11X5ZhiXuan,
  unique11X5ZuXuan
} from '@/assets/scripts/util'
import {ERR_OK, CREDIT, OFFICIAL, OFFICIAL_UNIT} from '@/assets/const/config'

export const selectBet = function ({commit, state}, bet) {
  let betList = state.betList.slice()
  let betIdsList = state.betIdsList.slice()
  let index = findIndex(betList, bet, 'ruleId')
  if (index > -1) {
    betList.splice(index, 1)
    betIdsList.splice(index, 1)
  } else {
    betList.push(bet)
    betIdsList.push(bet.ruleId)
  }
  commit(types.SET_BET_DATA, betList)
  commit(types.SET_BET_DATA_IDS, betIdsList)
  if (!betList.length) {
    commit(types.SET_BETS_DIALOG_VISIBLE, {visible: false})
  }
}

export const removeBetting = function ({commit, state}, {index}) {
  let bettingList = state.bettingList.slice()
  bettingList.splice(index, 1)
  commit(types.SET_BETTING_LIST, bettingList)

  if (!bettingList.length) {
    commit(types.SET_BETS_DIALOG_VISIBLE, {visible: false})
  }
}

export const changeCollection = function ({commit, state}, {gameTypeCode, gameId, like}) {
  let menuList = state.userMenuList.credit.slice()
  for (let x = 0; x < menuList.length; x++) {
    const group = menuList[x]
    if (group.typeCode === gameTypeCode) {
      const games = JSON.parse(JSON.stringify(group.children))
      for (let y = 0; y < games.length; y++) {
        if (Number(games[y].gameId) === Number(gameId)) {
          games[y].isLike = like
          commit(types.CHANGE_GAME_COLLECTION, {index: x, games})
          break
        }
      }
      break
    }
  }
}

export const setBetsAmount = function ({commit}, amount) {
  commit(types.SET_BET_DATA_AMOUNT, amount)
}

export const cleanBets = function ({commit}) {
  commit(types.SET_BET_DATA, [])
  commit(types.SET_BET_DATA_IDS, [])
}

/**
 * 获取用户账号信息
 * @param commit
 * @param token
 * @returns {Promise}
 */
export const getAccountInfo = function ({commit}, token) {
  return new Promise((resolve, reject) => {
    getUserInfoByToken({token}).then(response => {
      const {currentStatus, currentData} = response
      if (currentStatus === ERR_OK && currentData.hasOwnProperty('userContext')) {
        const {id, parentProxyId, userAccount} = currentData.userContext
        commit(types.SET_USER_ACCOUNT, userAccount)
        commit(types.SET_USER_ID, id)
        commit(types.SET_USER_PROXY_ID, parentProxyId)
        const menus = getMenus()
        if (menus) {
          commit(types.SET_USER_CREDIT_MENU_LIST, menus.credit || [])
          commit(types.SET_USER_OFFIC_MENU_LIST, menus.official || [])
        }
        resolve(currentData)
      } else {
        reject(new Error('error data'))
      }
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 下注
 * @param commit
 * @param state
 * @returns {Promise}
 */
export const betting = function ({commit, state}) {
  return new Promise((resolve, reject) => {
    if (state.stopBet) {
      reject(new Error('已封盘'))
      return
    }
    if (state.stopSell) {
      reject(new Error('已停售'))
      return
    }
    if (state.nextIssue === '加载中...') {
      reject(new Error('开奖数据加载中'))
      return
    }
    bet({
      betList: state.betList,
      currentNum: state.nextIssue,
      gameId: state.lotteryId,
      proxyId: state.userProxyId,
      userId: state.userId
    }).then(response => {
      const {currentStatus, errorInformation} = response
      if (currentStatus === ERR_OK) {
        commit(types.SET_BET_DATA, [])
        commit(types.SET_BET_DATA_IDS, [])
        commit(types.SET_BETS_DIALOG_VISIBLE, {visible: false})
        resolve()
      } else {
        reject(new Error(errorInformation.errCode))
      }
    }).catch(() => {
      reject(new Error('服务器繁忙'))
    })
  })
}

/**
 * 刷新用户余额
 * @param commit
 * @param state
 * @returns {Promise}
 */
export const refreshUserBalance = function ({commit, state}) {
  commit(types.SET_USER_AMOUNT, 'loading...')
  return new Promise((resolve, reject) => {
    getUserBalance({proxyGameUserId: state.userId}).then(response => {
      const {currentStatus, currentData} = response
      if (currentStatus === ERR_OK) {
        commit(types.SET_USER_AMOUNT, currentData)
        resolve()
      } else {
        commit(types.SET_USER_AMOUNT, '读取失败')
        reject(new Error('error data'))
      }
    }).catch(error => {
      commit(types.SET_USER_AMOUNT, '读取失败')
      reject(error)
    })
  })
}

export const toggleGroupMenu = function ({commit, state}, group) {
  const menuList = state.userMenuList[group.type].slice()
  const index = findIndex(menuList, group, 'typeCode')
  if (index > -1) {
    if (group.type === 'credit') {
      commit(types.TOGGLE_CREDIT_USER_MENU_LIST_SHOW, index)
    } else {
      commit(types.TOGGLE_OFFIC_USER_MENU_LIST_SHOW, index)
    }
  }
}

/**
 * 获取信用玩法彩种列表
 * @param commit
 * @returns {Promise}
 */
export const getCreditRouter = function ({commit}) {
  return new Promise((resolve, reject) => {
    getCreditLotteryList().then(response => {
      const {currentStatus, currentData} = response
      if (currentStatus === ERR_OK && currentData.length) {
        const menuList = parse(currentData)
        commit(types.SET_USER_CREDIT_MENU_LIST, menuList)
        setMenus(CREDIT, menuList)
        resolve(menuList)
      } else {
        reject(new Error('error credit data'))
      }
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 获取官方玩法彩种列表
 * @param commit
 * @returns {Promise}
 */
export const getOfficRouter = function ({commit}) {
  return new Promise((resolve, reject) => {
    getOfficialLotteryList().then(response => {
      const {currentStatus, currentData} = response
      if (currentStatus === ERR_OK && currentData.length) {
        const menuList = parse(currentData)
        commit(types.SET_USER_OFFIC_MENU_LIST, menuList)
        setMenus(OFFICIAL, menuList)
        resolve(menuList)
      } else {
        reject(new Error('error official data'))
      }
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 登出操作
 * @param commit
 */
export const loginOut = function ({commit}) {
  commit(types.SET_USER_ID, '')
  commit(types.SET_USER_ACCOUNT, '')
  commit(types.SET_USER_PROXY_ID, '')
  commit(types.SET_USER_AMOUNT, '')
  // 方便测试，保留Token
  if (typeof anyone !== 'undefined') {
    removeToken()
    removeMenus()
    removeResource()
  }
}

/**
 * 获取猜你喜欢列表
 * @param commit
 */
export const fetchLikeList = function ({commit}) {
  getLikeLotteryGame().then(response => {
    if (response.currentStatus === ERR_OK) {
      commit(types.UPDATE_LIKE_LIST, response.currentData)
    }
  }).catch(() => {
  })
}

export const setInputTextBall = function ({commit}, {index, balls}) {
  commit(types.SET_INPUT_TEXT_BALL, {index, balls})
}

export const pushSelectedBall = function ({commit}, {index, ball}) {
  commit(types.PUSH_SELECTED_BALL, {index, ball})
}

export const delSelectedBall = function ({commit}, {index, dataIndex}) {
  commit(types.DEL_SELECTED_BALL, {index, dataIndex})
}

export const cleanSelectedBall = function ({commit}, index) {
  commit(types.CLEAN_SELECTED_BALL, index)
}

export const resetSelected = function ({commit}, {cleanBetting}) {
  commit(types.SET_SELECTED_BALL, [[], [], [], [], [], [], [], [], [], []])
  commit(types.SET_SELECTED_MODE, {})
  commit(types.SET_SELECTED_BET_COUNT, 0)

  if (cleanBetting) {
    commit(types.SET_BETTING_LIST, [])
  }
}

export const setSelectedMode = function ({commit, state}, {index, mode}) {
  if (!state.selectedModeMap[index]) {
    const obj = {}
    obj[index] = mode
    commit(types.SET_SELECTED_MODE, Object.assign({}, state.selectedModeMap, obj))
  } else {
    commit(types.SET_SELECTED_MODE_BY_INDEX, {index, mode})
  }
}

export const getBonusPercent = function ({commit, state}, bouns) {
  let palyCode = state.selectedPlayingCode
  bouns.forEach((value) => {
    if (value[palyCode]) {   // 找到当前的
      const bonusOptions = value[palyCode].map(item => {
        return {
          key: item.rebate,
          bonus: item.bonus,
          value: `${item.bonus}-${(item.rebate * 100).toFixed(1)}%`
        }
      })
      commit(types.SET_BONUS_PERCENT, bonusOptions[0].key)
      commit(types.SET_BETTING_MULTIPLE, 1)
      commit(types.SET_UNIT, 1)
      commit(types.SET_BONUS_PERCENT_OPTIONS, bonusOptions)
    }
  })
/*  getProxyPlayList({
    gameCode: state.lotteryCode,
    playCode: state.selectedPlayingCode
  }).then(response => {
    const {currentStatus, currentData} = response
    if (currentStatus === ERR_OK && currentData && currentData.length) {
      const bonusOptions = currentData.map(item => {
        return {
          key: item.rebate,
          bonus: item.bonus,
          value: `${item.bonus}-${(item.rebate * 100).toFixed(1)}%`
        }
      })
      commit(types.SET_BONUS_PERCENT, bonusOptions[0].key)
      commit(types.SET_BETTING_MULTIPLE, 1)
      commit(types.SET_UNIT, 1)
      commit(types.SET_BONUS_PERCENT_OPTIONS, bonusOptions)
    }
  }).catch(() => {
    commit(types.SET_BONUS_PERCENT, '')
    commit(types.SET_BETTING_MULTIPLE, 1)
    commit(types.SET_UNIT, 1)
    commit(types.SET_BONUS_PERCENT_OPTIONS, [])
  }) */
}

export const confirmChoice = function ({commit, state}) {
  return new Promise((resolve, reject) => {
    if (!state.selectedBetCount) {
      reject(new Error('请先选号'))
      return
    }
    const bonusList = state.bonusPercentOptions
    const bonusPercent = state.bonusPercent
    let bonus = ''
    for (let i = 0; i < bonusList.length; i++) {
      const {key, value} = bonusList[i]
      if (key === bonusPercent) {
        bonus = value.split('-')[0]
        break
      }
    }
    const bet = {
      name: state.lotteryName,
      issue: state.nextIssue,
      odds: bonus,
      rebate: state.bonusPercent,
      betMultiplier: state.bettingMultiple,
      model: state.unit,
      betNums: state.selectedBetCount,
      amount: (state.selectedBetCount * 2 * state.bettingMultiple * OFFICIAL_UNIT[state.unit]).toFixed(2),
      text: joinStr(state.selected, ' ', '/'),
      betContent: joinStr(state.selected, '&', '|'),
      playCode: state.selectedPlayingCode
    }

    commit(types.PUSH_BETTING_LIST, bet)

    commit(types.SET_BETS_DIALOG_VISIBLE, {visible: true})

    commit(types.SET_SELECTED_BALL, [[], [], [], [], [], [], [], [], [], []])
    commit(types.SET_SELECTED_MODE, {})
    commit(types.SET_SELECTED_BET_COUNT, 0)
    resolve()
  })
}

export const officialBetting = function ({commit, state}) {
  return new Promise((resolve, reject) => {
    if (!state.bettingList.length) {
      reject(new Error('请先选号'))
      return
    }

    officialBetGame({
      gameCode: state.lotteryCode,
      currentNum: state.nextIssue,
      betList: state.bettingList
    }).then(response => {
      const {currentStatus, errorInformation} = response
      if (currentStatus === ERR_OK) {
        commit(types.SET_BETS_DIALOG_VISIBLE, {visible: false})
        commit(types.SET_BETTING_LIST, [])
        resolve(response.currentData)
      } else {
        reject(new Error(errorInformation.errCode))
      }
    }).catch(error => {
      reject(error)
    })
  })
}

export const randomBetting = function ({commit, state}) {
  let wei0
  let wei1
  let wei2
  let wei3
  let wei4
  let wei5
  let wei6
  let wei7
  let randomArray = []
  let newRandomArray = []
  let i
  let j
  let randomArrayL
  let randomFor

  commit(types.SET_SELECTED_BALL, [[], [], [], [], [], [], [], [], [], []])
  commit(types.SET_SELECTED_MODE, {})
  commit(types.SET_SELECTED_BET_COUNT, 0)

  const selected = [[], [], [], [], [], [], [], [], [], []]

  switch (state.selectedPlayingCode) {
    case 'ssc_wx_zxfs':// 五星_直选复式
    case 'ssc_wx_wxzh':// 五星_组合
    case 'ffc_wx_zxfs':
    case 'ffc_wx_wxzh':
      randomArray = MathArray(5, 0, 9)
      for (i = 0; i < 5; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: i, ball: `${randomArray[i]}`})
      }
      break
    case 'ssc_wx_zxds':// 五星_直选单式
    case 179:
      randomArray = MathArray(5, 0, 9)
      randomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray})
      break
    case 'ssc_wx_zux120':// 五星_组选120
    case 'ffc_wx_zx120':
      randomArray = MathArray(5, 0, 9)
      for (i = 0; i < 5; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: `${randomArray[i]}`})
      }
      break
    case 'ssc_wx_zux60':// 五星_组选60
    case 'ffc_wx_zx60':
      wei0 = MathArray(1, 0, 9)
      wei1 = MathArray(3, 0, 9)
      while (wei1.indexOf(wei0 / 1) !== -1) {
        wei0 = MathArray(1, 0, 9)
      }
      wei0 = arrToStr(wei0)
      wei1 = arrToStr(wei1)
      selected.unshift(wei0, wei1)
      commit(types.SET_SELECTED_BALL, selected)
      break
    case 'ssc_wx_zux30':// 五星_组选30
    case 'ffc_wx_zx30':
      wei0 = MathArray(2, 0, 9)
      wei1 = MathArray(1, 0, 9)
      while (wei0.indexOf(wei1 / 1) !== -1) {
        wei1 = MathArray(1, 0, 9)
      }
      wei0 = arrToStr(wei0)
      wei1 = arrToStr(wei1)
      selected.unshift(wei0, wei1)
      commit(types.SET_SELECTED_BALL, selected)
      break
    case 'ssc_wx_zux20':// 五星_组选20
    case 'ffc_wx_zx20':
    case 'ssc_sx_zux12':// 四星_组选12
    case 'ffc_sx_zx12':
    case 'ssc_rx4_zux12':// 任四_组选12
    case 'ffc_rx4_zx12':
      wei0 = MathArray(1, 0, 9)
      wei1 = MathArray(2, 0, 9)
      while (wei1.indexOf(wei0 / 1) !== -1) {
        wei0 = MathArray(1, 0, 9)
      }
      wei0 = arrToStr(wei0)
      wei1 = arrToStr(wei1)
      selected.unshift(wei0, wei1)
      commit(types.SET_SELECTED_BALL, selected)
      break
    case 'ssc_wx_zux10':// 五星_组选10
    case 'ffc_wx_zx10':
    case 'ssc_wx_zux5':// 五星_组选5
    case 'ffc_wx_zx5':
    case 'ssc_sx_zux4':// 四星_组选4
    case 'ffc_sx_zx4':
    case 'ssc_qe_zxfs':// 前二_直选复式
    case 'ffc_qe_zxfs':
    case 'ssc_he_zxfs':// 后二_直选复式
    case 'ffc_he_zxfs':
    case 'ssc_rx4_zux4':// 任四_组选4
    case 'ffc_rx4_zx4':
      wei0 = MathArray(1, 0, 9)
      wei1 = MathArray(1, 0, 9)
      while (wei0 / 1 === wei1 / 1) {
        wei0 = MathArray(1, 0, 9)
      }
      randomArray.push(wei0, wei1)
      for (i = 0; i < 2; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: i, ball: `${randomArray[i]}`})
      }
      break
    case 'ssc_dxds_qe':// 大小单双前二后二
    case 'ssc_dxds_he':
    case 283:
    case 284:
      wei0 = MathArray(1, 0, 3)
      wei1 = MathArray(1, 0, 3)
      while (wei0 / 1 === wei1 / 1) {
        wei0 = MathArray(1, 0, 3)
      }
      randomArray.push(wei0, wei1)
      let DXDS = ['大', '小', '单', '双']
      for (i = 0; i < 2; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: i, ball: `${DXDS[randomArray[i]]}`})
      }
      break
    case 'ssc_sx_zxfs':// 四星_直选复式
    case 'ffc_sx_zxfs':
    case 'ssc_sx_sxzh':// 四星_组合
    case 'ffc_sx_sxzh':
      randomArray = MathArray(4, 0, 9)
      for (i = 0; i < 4; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: i, ball: `${randomArray[i]}`})
      }
      break
    case 'ssc_sx_zxds':// 四星_直选单式
    case 'ffc_sx_zxds':
    case 'ssc_rx4_zxds':// 任四_直选单式
    case 'ffc_rx4_zxds':
      randomArray = MathArray(4, 0, 9)
      randomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray})
      break
    case 'ssc_sx_zux24':// 四星_组选24
    case 'ffc_sx_zx24':
    case 'ssc_rx4_zux24':// 任四_组选24
    case 'ffc_rx4_zx24':
      randomArray = MathArray(4, 0, 9)
      for (i = 0; i < 4; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: `${randomArray[i]}`})
      }
      break
    case 'ssc_sx_zux6':// 四星_组选6
    case 'ffc_sx_zx6':
    case 'ssc_qs_zusfs':// 前三_组三复式
    case 'ssc_zs_zusfs':// 中三_组三复式
    case 'ssc_hs_zusfs':// 后三_组三复式
    case 'ffc_qs_zsfs':
    case 'ffc_zs_zsfs':
    case 'ffc_hs_zsfs':
    case 'ssc_qe_zuxfs':// 前二_组选复式
    case 'ssc_he_zuxfs':// 后二_组选复式
    case 'ffc_qe_zxze':
    case 'ffc_he_zxze':
    case 'ssc_rx2_zuxfs':// 任二_组选复式
    case 'ffc_rx2_zuxfs':
    case 'ssc_rx3_zusfs':// 任三_组三复式
    case 'ffc_rx3_zsfs':
    case 'ssc_rx4_zux6':// 任四_组选6
    case 'ffc_rx4_zx6':
    case 'ssc_bdwd_qsem':// 不定位_前三二码
    case 'ssc_bdwd_zsem':// 不定位_中三二码
    case 'ssc_bdwd_hsem':// 不定位_后三二码
    case 'ssc_bdwd_sxem':// 不定位_四星二码
    case 'ffc_bdwd_qsem':
    case 'ffc_bdwd_zsem':
    case 'ffc_bdwd_hsem':
    case 'ffc_bdwd_sxem':
    case 'ffc_bdwd_wxem':
    case 'ssc_bdwd_wxem':// 不定位_五星二码
      wei0 = MathArray(1, 0, 9)
      wei1 = MathArray(1, 0, 9)
      while (wei0 / 1 === wei1 / 1) {
        wei0 = MathArray(1, 0, 9)
      }
      randomArray.push(wei0, wei1)
      for (i = 0; i < 2; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: `${randomArray[i]}`})
      }
      break
    case 'ssc_qs_zxfs':// 前三_直选复式
    case 'ssc_zs_zxfs':// 中三_直选复式
    case 'ssc_hs_zxfs':// 后三_直选复式
    case 'ffc_qs_zxfs':
    case 'ffc_zs_zxfs':
    case 'ffc_hs_zxfs':
      randomArray = MathArray(3, 0, 9)
      for (i = 0; i < 3; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: i, ball: `${randomArray[i]}`})
      }
      break
    case 'ssc_qs_zxds':// 前三_直选单式
    case 'ssc_zs_zxds':// 中三_直选单式
    case 'ssc_hs_zxds':// 后三_直选单式
    case 'ffc_qs_zxds':
    case 'ffc_zs_zxds':
    case 'ffc_hs_zxds':
    case 'ssc_qs_zlds':// 前三_组六单式
    case 'ssc_zs_zlds':// 中三_组六单式
    case 'ssc_hs_zlds':// 后三_组六单式
    case 'ffc_qs_zlds':
    case 'ffc_zs_zlds':
    case 'ffc_hs_zlds':
    case 'ssc_qs_zuxhh':// 前三_组选混合
    case 'ssc_zs_zuxhh':// 中三_混合组选
    case 'ssc_hs_zuxhh':// 后三_组选混合
    case 'ffc_qs_zxhh':
    case 'ffc_zs_zxhh':
    case 'ffc_hs_zxhh':
    case 'ssc_rx3_zxds':// 任三_直选单式
    case 'ffc_rx3_zxds':
    case 'ssc_rx3_zulds':// 任三_组六单式
    case 'ffc_rx3_zlds':
    case 'ssc_rx3_hhzx':// 任三_组选混合
    case 'ffc_rx3_hhzx':
      randomArray = MathArray(3, 0, 9)
      randomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray})
      break
    case 'ssc_qs_zxhz':// 前三_直选和值
    case 'ssc_zs_zxhz':// 中三_直选和值
    case 'ssc_hs_zxhz':// 后三_直选和值
    case 'ffc_qs_zxhz':
    case 'ffc_zs_zxhz':
    case 'ffc_hs_zxhz':
    case 'ssc_rx3_zxhz':// 任三_直选和值
    case 'ffc_rx3_zxhz':
      randomArray = MathArray(1, 0, 27)
      randomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray})
      break
    case 'ssc_hs_zxkd':// 前三_直选跨度
    case 'ssc_zs_zxkd':// 中三_直选跨度
    case 'ssc_qs_zxkd':// 后三_直选跨度
    case 'ffc_hs_zxkd':
    case 'ffc_zs_zxkd':
    case 'ffc_qs_zxkd':
    case 'ssc_qe_zxkd':// 前二_直选跨度
    case 'ssc_he_zxkd':// 后二_直选跨度
    case 'ffc_qe_zxkd':
    case 'ffc_he_zxkd':
    case 'ssc_qe_zuxhz':// 前二_组选包胆
    case 'ssc_he_zuxhz':// 后二_组选包胆
    case 'ffc_qe_zxbd':
    case 'ffc_he_zxbd':
    case 'ssc_bdwd_qsym':// 不定位_前三一码
    case 'ssc_bdwd_zsym':// 不定位_中三一码
    case 'ssc_bdwd_hsym':// 不定位_后三一码
    case 'ssc_bdwd_sxym':// 不定位_四星一码
    case 'ffc_bdwd_qsym':
    case 'ffc_bdwd_zsym':
    case 'ffc_bdwd_hsym':
    case 'ffc_bdwd_sxym':
    case 'ssc_qw_yffs':// 一帆风顺
    case 'ssc_qw_hscs':// 好事成双
    case 'ssc_qw_sxbx':// 三星报喜
    case 'ssc_qw_sjfc':// 四季发财
    case 'ffc_qw_yffs':
    case 'ffc_qw_hscs':
    case 'ffc_qw_sxbx':
    case 'ffc_qw_sjfc':
      randomArray = MathArray(1, 0, 9)
      randomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray})
      break
    case 'ssc_dxds_dxds':// 大小单双总和
    case 'ffc_dxds_dxds':
      randomArray = MathArray(1, 0, 3)
      randomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray})
      break
    case 'ssc_lh_wq':// 龙虎
    case 'ssc_lh_wb':
    case 'ssc_lh_ws':
    case 'ssc_lh_wg':
    case 'ssc_lh_qb':
    case 'ssc_lh_qs':
    case 'ssc_lh_qg':
    case 'ssc_lh_bs':
    case 'ssc_lh_bg':
    case 'ssc_lh_sg':
    case 'ffc_lh_wq':
    case 'ffc_lh_wb':
    case 'ffc_lh_ws':
    case 'ffc_lh_wg':
    case 'ffc_lh_qb':
    case 'ffc_lh_qs':
    case 'ffc_lh_qg':
    case 'ffc_lh_bs':
    case 'ffc_lh_bg':
    case 'ffc_lh_sg':
      randomArray = MathArray(1, 0, 2)
      let LH = ['龙', '虎', '和']
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: `${LH[randomArray]}`})
      break
    case 'ssc_qs_zsds':// 前三_组三单式
    case 'ssc_zs_zusds':// 中三_组三单式
    case 'ssc_hs_zsds':// 后三_组三单式
    case 'ffc_qs_zsds':
    case 'ffc_zs_zsds':
    case 'ffc_hs_zsds':
    case 'ssc_rx3_zusds':// 任三_组三单式
    case 'ffc_rx3_zsds':
      wei0 = MathArray(1, 0, 9)
      wei1 = MathArray(1, 0, 9)
      wei2 = MathArray(1, 0, 9)
      while (wei0 / 1 !== wei1 / 1) {
        if (wei0 / 1 === wei1 / 1 === wei2 / 1) continue
        if (wei0 / 1 === wei2 / 1 || wei1 / 1 === wei2 / 1) break
        wei0 = MathArray(1, 0, 9)
        wei1 = MathArray(1, 0, 9)
        wei2 = MathArray(1, 0, 9)
      }
      randomArray.push(wei0, wei1, wei2)
      randomArray = randomArray.sort(this.asc_sort)
      randomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray})
      break
    case 'ssc_qs_zulfs':// 前三_组六复式
    case 'ssc_zs_zulfs':// 中三_组六复式
    case 'ssc_hs_zulfs':// 后三_组六复式
    case 'ffc_qs_zlfs':
    case 'ffc_zs_zlfs':
    case 'ffc_hs_zlfs':
    case 'ssc_rx3_zulfs':// 任三_组六复式
    case 'ffc_rx3_zlfs':
    case 'ssc_bdwd_wxsm':// 不定位_五星三码
    case 'ffc_bdwd_wxsm':
      randomArrayL = MathArray(3, 0, 9)
      wei0 = randomArrayL[0]
      wei1 = randomArrayL[1]
      wei2 = randomArrayL[2]
      randomArray.push(wei0, wei1, wei2)
      for (i = 0; i < 3; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: `${randomArray[i]}`})
      }
      break
    case 'ssc_qe_zxds':// 前二_直选单式
    case 'ssc_he_zxds':// 后二_直选单式
    case 134:// 后二_组选单式
    case 'ffc_qe_zxds':
    case 'ffc_he_zxds':
    case 'ssc_he_zuxds':
    case 'ssc_qe_zuxds':
    case 'ssc_rx2_zxds':// 任二_直选单式
    case 'ssc_rx2_zuxds':// 任二_组选单式
    case 'ffc_rx2_zxds':
    case 'ffc_rx2_zuxds':
      randomArray = MathArray(2, 0, 9)
      randomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray})
      break
    case 'ssc_qe_zxhz':// 前二_直选和值
    case 'ssc_he_zxhz':// 后二_直选和值
    case 'ffc_qe_zxhz':
    case 'ffc_he_zxhz':
    case 'ssc_rx2_zxhz':// 任二_直选和值
    case 'ffc_rx2_zxhz':
      randomArray = MathArray(1, 0, 18)
      randomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray})
      break
    case 'ssc_rx2_zuxhz':// 任二_组选和值
    case 'ffc_rx2_zuxhz':
      randomArray = MathArray(1, 2, 17)
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray})
      break
    case 'ssc_dwd_wxdwd':// 五星_定位胆
    case 'ffc_dwd_wxdwd':
      randomArray = MathArray(1, 0, 9)
      randomFor = MathArray(1, 0, 4) / 1
      commit(types.PUSH_SELECTED_BALL, {index: randomFor, ball: `${randomArray[0]}`})
      break
    case 'pk10_dwd_wxdwd':
      randomArray = MathArray(1, 0, 9)
      randomFor = MathArray(1, 0, 9) / 1
      commit(types.PUSH_SELECTED_BALL, {index: randomFor, ball: `${randomArray[0]}`})
      break
    case 'ssc_rx2_zxfs':// 任二_直选复式
    case 'ffc_rx2_zxfs':
      randomArray = MathArray(2, 0, 9)
      randomFor = MathArray(2, 0, 4)
      for (i = 0; i < 2; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: randomFor[i], ball: `${randomArray[i]}`})
      }
      break
    case 'ssc_rx3_zxfs':// 任三_直选复式
    case 'ffc_rx3_zxfs':
      randomArray = MathArray(3, 0, 9)
      randomFor = MathArray(3, 0, 4)
      for (i = 0; i < 3; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: randomFor[i], ball: `${randomArray[i]}`})
      }
      break
    case 'ssc_rx4_zxfs':// 任四_直选复式
    case 'ffc_rx4_zxfs':
      randomArray = MathArray(4, 0, 9)
      randomFor = MathArray(4, 0, 4)
      for (i = 0; i < 4; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: randomFor[i], ball: `${randomArray[i]}`})
      }
      break

    // 十一选五
    case '11x5_qs_zxfs':// 前三_直选复式
    case '11x5_zs_zxfs':// 中三_直选复式
    case '11x5_hs_zxfs':// 后三_直选复式
      randomArray = MathArray(3, 1, 11)
      for (i = 0; i < 3; i++) {
        commit(types.PUSH_SELECTED_BALL, {
          index: i,
          ball: randomArray[i] < 10 ? `0${randomArray[i]}` : `${randomArray[i]}`
        })
      }
      break
    case '11x5_qs_zxds':// 前三_直选单式
    case '11x5_zs_zxds':// 中三_直选单式
    case '11x5_hs_zxds':// 后三_直选单式
    case '11x5_qs_zuxds':// 前三_组选单式
    case '3d/p3_sx_zuxzl':// 中三_组选单式
    case '11x5_hs_zuxds':// 后三_组选单式
      randomArray = MathArray(3, 1, 11)
      for (j = 0; j < 3; j++) {
        newRandomArray.push(randomArray[j] < 10 ? `0${randomArray[j]}` : `${randomArray[j]}`)
      }
      newRandomArray = newRandomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray})
      break
    case '11x5_qs_zuxfs':// 前三_组选复式
    case '11x5_zs_zuxfs':// 中三_组选复式
    case '11x5_hs_zuxfs':// 后三_组选复式
      randomArray = MathArray(3, 1, 11)
      wei0 = randomArray[0] < 10 ? `0${randomArray[0]}` : `${randomArray[0]}`
      wei1 = randomArray[1] < 10 ? `0${randomArray[1]}` : `${randomArray[1]}`
      wei2 = randomArray[2] < 10 ? `0${randomArray[2]}` : `${randomArray[2]}`
      selected[0].unshift(wei0, wei1, wei2)
      commit(types.SET_SELECTED_BALL, selected)
      break
    case '11x5_qs_zxdt':// 前三_组选胆拖
    case '11x5_zs_zxdt':// 中三_组选胆拖
    case '11x5_hs_zxdt':// 后三_组选胆拖
      wei0 = MathArray(1, 1, 11)
      wei1 = MathArray(2, 1, 11)
      while (wei1.indexOf(wei0 / 1) !== -1) {
        wei0 = MathArray(1, 1, 11)
      }
      wei0 = wei0 < 10 ? `0${wei0}` : `${wei0}`
      for (i = 0; i < 2; i++) {
        wei1[i] = wei1[i] < 10 ? `0${wei1[i]}` : `${wei1[i]}`
      }
      selected[0].push(wei0)
      selected[1].push(wei1[0], wei1[1])
      commit(types.SET_SELECTED_BALL, selected)
      break
    case '11x5_qe_zxfs':// 前二_直选复式
    case '11x5_he_zxfs':// 后二_直选复式
    case '11x5_qe_zxdt':// 前二_组选胆拖
    case '11x5_he_zxdt':// 后二_组选胆拖
      randomArray = MathArray(2, 1, 11)
      for (j = 0; j < 2; j++) {
        newRandomArray.push(randomArray[j] < 10 ? `0${randomArray[j]}` : `${randomArray[j]}`)
      }
      for (i = 0; i < 2; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: i, ball: newRandomArray[i]})
      }
      break
    case '11x5_qe_zxds':// 前二_直选单式
    case '11x5_he_zxds':// 后二_直选单式
    case '11x5_qe_zuxds':// 前二_组选单式
    case '11x5_he_zuxds':// 后二_组选单式
      randomArray = MathArray(2, 1, 11)
      for (j = 0; j < 2; j++) {
        newRandomArray.push(randomArray[j] < 10 ? `0${randomArray[j]}` : `${randomArray[j]}`)
      }
      newRandomArray = newRandomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray})
      break
    case '11x5_qe_zuxfs':// 前二_组选复式
    case '11x5_he_zuxfs':// 后二_组选复式
      randomArray = MathArray(2, 1, 11)
      wei0 = randomArray[0] < 10 ? `0${randomArray[0]}` : `${randomArray[0]}`
      wei1 = randomArray[1] < 10 ? `0${randomArray[1]}` : `${randomArray[1]}`
      selected[0].unshift(wei0, wei1)
      commit(types.SET_SELECTED_BALL, selected)
      break
    case '11x5_bdwd_qsbdwd':// 不定位
    case '11x5_bdwd_zsbdwd':
    case '11x5_bdwd_hsbdwd':
      randomArray = MathArray(1, 1, 11)
      newRandomArray.push(randomArray[0] < 10 ? `0${randomArray[0]}` : `${randomArray[0]}`)
      selected[0].unshift(newRandomArray[0])
      commit(types.SET_SELECTED_BALL, selected)
      break
    case '11x5_dwd_wxdwd':// 定位胆
      randomArray = MathArray(1, 1, 11)
      randomFor = MathArray(1, 0, 4) / 1
      newRandomArray.push(randomArray[0] < 10 ? `0${randomArray[0]}` : `${randomArray[0]}`)
      commit(types.PUSH_SELECTED_BALL, {index: randomFor, ball: newRandomArray[0]})
      break
    case '11x5_rxfs_rxyzy':// 一中一
      randomArrayL = MathArray(1, 1, 11)
      wei0 = randomArrayL[0] < 10 ? `0${randomArrayL[0]}` : `${randomArrayL[0]}`
      randomArray.push(wei0)
      for (i = 0; i < 1; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray[i]})
      }
      break
    case '11x5_rxfs_rxeze':// 二中二
      randomArrayL = MathArray(2, 1, 11)
      randomArray = []
      for (i = 0; i < 2; i++) {
        randomArray[i] = randomArrayL[i] < 10 ? `0${randomArrayL[i]}` : `${randomArrayL[i]}`
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray[i]})
      }
      break
    case '11x5_rxfs_rxszs':// 三中三
      randomArrayL = MathArray(3, 1, 11)
      randomArray = []
      for (i = 0; i < 3; i++) {
        randomArray[i] = randomArrayL[i] < 10 ? `0${randomArrayL[i]}` : `${randomArrayL[i]}`
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray[i]})
      }
      break
    case '11x5_rxfs_rxsizsi':// 四中四
      randomArrayL = MathArray(4, 1, 11)
      randomArray = []
      for (i = 0; i < 4; i++) {
        randomArray[i] = randomArrayL[i] < 10 ? `0${randomArrayL[i]}` : `${randomArrayL[i]}`
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray[i]})
      }
      break
    case '11x5_rxfs_rxwzw':// 五中五
      randomArrayL = MathArray(5, 1, 11)
      randomArray = []
      for (i = 0; i < 5; i++) {
        randomArray[i] = randomArrayL[i] < 10 ? `0${randomArray[i]}` : `${randomArrayL[i]}`
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray[i]})
      }
      break
    case '11x5_rxfs_rxlzw':// 六中五
      randomArrayL = MathArray(6, 1, 11)
      randomArray = []
      for (i = 0; i < 6; i++) {
        randomArray[i] = randomArrayL[i] < 10 ? `0${randomArray[i]}` : `${randomArrayL[i]}`
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray[i]})
      }
      break
    case '11x5_rxfs_rxqzw':// 七中五
      randomArrayL = MathArray(7, 1, 11)
      randomArray = []
      for (i = 0; i < 7; i++) {
        randomArray[i] = randomArrayL[i] < 10 ? `0${randomArray[i]}` : `${randomArrayL[i]}`
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray[i]})
      }
      break
    case '11x5_rxfs_rxbzw':// 八中五
      randomArrayL = MathArray(8, 1, 11)
      randomArray = []
      for (i = 0; i < 8; i++) {
        randomArray[i] = randomArrayL[i] < 10 ? `0${randomArray[i]}` : `${randomArrayL[i]}`
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray[i]})
      }
      break
    case '11x5_rxds_rxyzy':// 单式一中一
      randomArrayL = MathArray(1, 1, 11)
      wei0 = randomArrayL[0] < 10 ? `0${randomArrayL[0]}` : `${randomArrayL[0]}`
      randomArray.push(wei0)
      newRandomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray})
      break
    case '11x5_rxds_rxeze':// 单式二中二
      randomArrayL = MathArray(2, 1, 11)
      wei0 = randomArrayL[0] < 10 ? `0${randomArrayL[0]}` : `${randomArrayL[0]}`
      wei1 = randomArrayL[1] < 10 ? `0${randomArrayL[1]}` : `${randomArrayL[1]}`
      randomArray.push(wei0, wei1)
      newRandomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray})
      break
    case '11x5_rxds_rxszs':// 单式三中三
      randomArrayL = MathArray(3, 1, 11)
      wei0 = randomArrayL[0] < 10 ? `0${randomArrayL[0]}` : `${randomArrayL[0]}`
      wei1 = randomArrayL[1] < 10 ? `0${randomArrayL[1]}` : `${randomArrayL[1]}`
      wei2 = randomArrayL[2] < 10 ? `0${randomArrayL[2]}` : `${randomArrayL[2]}`
      randomArray.push(wei0, wei1, wei2)
      newRandomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray})
      break
    case '11x5_rxds_rxsizsi':// 单式四中四
      randomArrayL = MathArray(4, 1, 11)
      wei0 = randomArrayL[0] < 10 ? `0${randomArrayL[0]}` : `${randomArrayL[0]}`
      wei1 = randomArrayL[1] < 10 ? `0${randomArrayL[1]}` : `${randomArrayL[1]}`
      wei2 = randomArrayL[2] < 10 ? `0${randomArrayL[2]}` : `${randomArrayL[2]}`
      wei3 = randomArrayL[3] < 10 ? `0${randomArrayL[3]}` : `${randomArrayL[3]}`
      randomArray.push(wei0, wei1, wei2, wei3)
      newRandomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray})
      break
    case '11x5_rxds_rxwzw':// 单式五中五
      randomArrayL = MathArray(5, 1, 11)
      wei0 = randomArrayL[0] < 10 ? `0${randomArrayL[0]}` : `${randomArrayL[0]}`
      wei1 = randomArrayL[1] < 10 ? `0${randomArrayL[1]}` : `${randomArrayL[1]}`
      wei2 = randomArrayL[2] < 10 ? `0${randomArrayL[2]}` : `${randomArrayL[2]}`
      wei3 = randomArrayL[3] < 10 ? `0${randomArrayL[3]}` : `${randomArrayL[3]}`
      wei4 = randomArrayL[4] < 10 ? `0${randomArrayL[4]}` : `${randomArrayL[4]}`
      randomArray.push(wei0, wei1, wei2, wei3, wei4, wei5)
      newRandomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray})
      break
    case '11x5_rxds_rxlzw':// 单式六中五
      randomArrayL = MathArray(6, 1, 11)
      wei0 = randomArrayL[0] < 10 ? `0${randomArrayL[0]}` : `${randomArrayL[0]}`
      wei1 = randomArrayL[1] < 10 ? `0${randomArrayL[1]}` : `${randomArrayL[1]}`
      wei2 = randomArrayL[2] < 10 ? `0${randomArrayL[2]}` : `${randomArrayL[2]}`
      wei3 = randomArrayL[3] < 10 ? `0${randomArrayL[3]}` : `${randomArrayL[3]}`
      wei4 = randomArrayL[4] < 10 ? `0${randomArrayL[4]}` : `${randomArrayL[4]}`
      wei5 = randomArrayL[5] < 10 ? `0${randomArrayL[5]}` : `${randomArrayL[5]}`
      randomArray.push(wei0, wei1, wei2, wei3, wei4, wei5)
      newRandomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray})
      break
    case '11x5_rxds_rxqzw':// 单式七中五
      randomArrayL = MathArray(7, 1, 11)
      wei0 = randomArrayL[0] < 10 ? `0${randomArrayL[0]}` : `${randomArrayL[0]}`
      wei1 = randomArrayL[1] < 10 ? `0${randomArrayL[1]}` : `${randomArrayL[1]}`
      wei2 = randomArrayL[2] < 10 ? `0${randomArrayL[2]}` : `${randomArrayL[2]}`
      wei3 = randomArrayL[3] < 10 ? `0${randomArrayL[3]}` : `${randomArrayL[3]}`
      wei4 = randomArrayL[4] < 10 ? `0${randomArrayL[4]}` : `${randomArrayL[4]}`
      wei5 = randomArrayL[5] < 10 ? `0${randomArrayL[5]}` : `${randomArrayL[5]}`
      wei6 = randomArrayL[6] < 10 ? `0${randomArrayL[6]}` : `${randomArrayL[6]}`
      randomArray.push(wei0, wei1, wei2, wei3, wei4, wei5, wei6)
      newRandomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray})
      break
    case '11x5_rxds_rxbzw':// 单式八中五
      randomArrayL = MathArray(8, 1, 11)
      wei0 = randomArrayL[0] < 10 ? `0${randomArrayL[0]}` : `${randomArrayL[0]}`
      wei1 = randomArrayL[1] < 10 ? `0${randomArrayL[1]}` : `${randomArrayL[1]}`
      wei2 = randomArrayL[2] < 10 ? `0${randomArrayL[2]}` : `${randomArrayL[2]}`
      wei3 = randomArrayL[3] < 10 ? `0${randomArrayL[3]}` : `${randomArrayL[3]}`
      wei4 = randomArrayL[4] < 10 ? `0${randomArrayL[4]}` : `${randomArrayL[4]}`
      wei5 = randomArrayL[5] < 10 ? `0${randomArrayL[5]}` : `${randomArrayL[5]}`
      wei6 = randomArrayL[6] < 10 ? `0${randomArrayL[6]}` : `${randomArrayL[6]}`
      wei7 = randomArrayL[7] < 10 ? `0${randomArrayL[7]}` : `${randomArrayL[7]}`
      randomArray.push(wei0, wei1, wei2, wei3, wei4, wei5, wei6, wei7)
      newRandomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray})
      break

    // 福彩3D
    case '3d/p3_sx_zxfs':// 三星_直选复式
      randomArray = MathArray(3, 0, 9)
      for (i = 0; i < 3; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: i, ball: `${randomArray[i]}`})
      }
      break
    case '3d/p3_sx_zxds':// 三星_直选单式
    case '3d/p3_sx_zuxhh':// 三星_组选混合
      randomArray = MathArray(3, 0, 9)
      randomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray})
      break
    case '3d/p3_sx_zuxzs':// 三星_组三复式
      wei0 = MathArray(1, 0, 9)
      wei1 = MathArray(1, 0, 9)
      while (wei0 / 1 === wei1 / 1) {
        wei0 = MathArray(1, 0, 9)
      }
      randomArray.push(wei0, wei1)
      for (i = 0; i < 2; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: `${randomArray[i]}`})
      }
      break
    case '3d/p3_sx_zxzl':// 三星_组六复式
      randomArrayL = MathArray(3, 0, 9)
      wei0 = randomArrayL[0]
      wei1 = randomArrayL[1]
      wei2 = randomArrayL[2]
      randomArray.push(wei0, wei1, wei2)
      for (i = 0; i < 3; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: `${randomArray[i]}`})
      }
      break
    case '3d/p3_qe_zxfs':// 前二_直选复式
    case '3d/p3_he_zxfs':// 后二_直选复式
      wei0 = MathArray(1, 0, 9)
      wei1 = MathArray(1, 0, 9)
      while (wei0 / 1 === wei1 / 1) {
        wei0 = MathArray(1, 0, 9)
      }
      randomArray.push(wei0, wei1)
      for (i = 0; i < 2; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: i, ball: `${randomArray[i]}`})
      }
      break
    case '3d/p3_qe_zxds':// 前二_直选单式
    case '3d/p3_he_zxds':// 后二_直选单式
    case '3d/p3_he_zuxhh':// 后二_组选混合
    case '3d/p3_qe_zuxhh':// 前二_组选混合
      randomArray = MathArray(2, 0, 9)
      randomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray})
      break
    case 101:// 前二_组选复式
    case 105:// 后二_组选复式
      wei0 = MathArray(1, 0, 9)
      wei1 = MathArray(1, 0, 9)
      while (wei0 / 1 === wei1 / 1) {
        wei0 = MathArray(1, 0, 9)
      }
      randomArray.push(wei0, wei1)
      for (i = 0; i < 2; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray})
      }
      break
    case '3d/p3_dwd_dwd':// 定位胆
      randomArray = MathArray(1, 0, 9)
      randomFor = MathArray(1, 0, 2) / 1
      commit(types.PUSH_SELECTED_BALL, {index: randomFor, ball: `${randomArray[0]}`})
      break
    case '3d/p3_bdwd_embdwd':// 二码不定位胆
      wei0 = MathArray(1, 0, 9)
      wei1 = MathArray(1, 0, 9)
      while (wei0 / 1 === wei1 / 1) {
        wei0 = MathArray(1, 0, 9)
      }
      randomArray.push(wei0, wei1)
      for (i = 0; i < 2; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: `${randomArray[i]}`})
      }
      break
    case '3d/p3_bdwd_ymbdwd':// 一码不定位胆
      randomArray = MathArray(1, 0, 9)
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: `${randomArray[0]}`})
      break
    // 快乐8
    case 'klc_rx_rx1':// 任选一
      randomArray = MathArray(1, 1, 80)
      newRandomArray = randomArray[0] < 10 ? `0${randomArray[0]}` : `${randomArray[0]}`
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray})
      break
    case 'klc_rx_rx2':// 任选二
      randomArray = MathArray(2, 1, 80)
      wei0 = randomArray[0] < 10 ? `0${randomArray[0]}` : `${randomArray[0]}`
      wei1 = randomArray[1] < 10 ? `0${randomArray[1]}` : `${randomArray[1]}`
      newRandomArray.push(wei0, wei1)
      for (i = 0; i < 2; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray[i]})
      }
      break
    case 'klc_rx_rx3':// 任选三
      randomArray = MathArray(3, 1, 80)
      wei0 = randomArray[0] < 10 ? `0${randomArray[0]}` : `${randomArray[0]}`
      wei1 = randomArray[1] < 10 ? `0${randomArray[1]}` : `${randomArray[1]}`
      wei2 = randomArray[2] < 10 ? `0${randomArray[2]}` : `${randomArray[2]}`
      newRandomArray.push(wei0, wei1, wei2)
      for (i = 0; i < 3; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray[i]})
      }
      break
    case 'klc_rx_rx4':// 任选四
      randomArray = MathArray(4, 1, 80)
      wei0 = randomArray[0] < 10 ? `0${randomArray[0]}` : `${randomArray[0]}`
      wei1 = randomArray[1] < 10 ? `0${randomArray[1]}` : `${randomArray[1]}`
      wei2 = randomArray[2] < 10 ? `0${randomArray[2]}` : `${randomArray[2]}`
      wei3 = randomArray[3] < 10 ? `0${randomArray[3]}` : `${randomArray[3]}`
      newRandomArray.push(wei0, wei1, wei2, wei3)
      for (i = 0; i < 4; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray[i]})
      }
      break
    case 'klc_rx_rx5':// 任选五
      randomArray = MathArray(5, 1, 80)
      wei0 = randomArray[0] < 10 ? `0${randomArray[0]}` : `${randomArray[0]}`
      wei1 = randomArray[1] < 10 ? `0${randomArray[1]}` : `${randomArray[1]}`
      wei2 = randomArray[2] < 10 ? `0${randomArray[2]}` : `${randomArray[2]}`
      wei3 = randomArray[3] < 10 ? `0${randomArray[3]}` : `${randomArray[3]}`
      wei4 = randomArray[4] < 10 ? `0${randomArray[4]}` : `${randomArray[4]}`
      newRandomArray.push(wei0, wei1, wei2, wei3, wei4)
      for (i = 0; i < 5; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray[i]})
      }
      break
    case 'klc_rx_rx6':// 任选六
      randomArray = MathArray(6, 1, 80)
      wei0 = randomArray[0] < 10 ? `0${randomArray[0]}` : `${randomArray[0]}`
      wei1 = randomArray[1] < 10 ? `0${randomArray[1]}` : `${randomArray[1]}`
      wei2 = randomArray[2] < 10 ? `0${randomArray[2]}` : `${randomArray[2]}`
      wei3 = randomArray[3] < 10 ? `0${randomArray[3]}` : `${randomArray[3]}`
      wei4 = randomArray[4] < 10 ? `0${randomArray[4]}` : `${randomArray[4]}`
      wei5 = randomArray[5] < 10 ? `0${randomArray[5]}` : `${randomArray[5]}`
      newRandomArray.push(wei0, wei1, wei2, wei3, wei4, wei5)
      for (i = 0; i < 6; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray[i]})
      }
      break
    case 'klc_rx_rx7':// 任选七
      randomArray = MathArray(7, 1, 80)
      wei0 = randomArray[0] < 10 ? `0${randomArray[0]}` : `${randomArray[0]}`
      wei1 = randomArray[1] < 10 ? `0${randomArray[1]}` : `${randomArray[1]}`
      wei2 = randomArray[2] < 10 ? `0${randomArray[2]}` : `${randomArray[2]}`
      wei3 = randomArray[3] < 10 ? `0${randomArray[3]}` : `${randomArray[3]}`
      wei4 = randomArray[4] < 10 ? `0${randomArray[4]}` : `${randomArray[4]}`
      wei5 = randomArray[5] < 10 ? `0${randomArray[5]}` : `${randomArray[5]}`
      wei6 = randomArray[6] < 10 ? `0${randomArray[6]}` : `${randomArray[6]}`
      newRandomArray.push(wei0, wei1, wei2, wei3, wei4, wei5, wei6)
      for (i = 0; i < 7; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray[i]})
      }
      break
    case 'klc_qw_sxp':// 上下盘
    case 'klc_qw_jop':// 奇偶盘
      randomArray = MathArray(1, 0, 2)
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray})
      break
    case 'klc_qw_hzdxds':// 和值大小单双
      randomArray = MathArray(1, 0, 3)
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray})
      break

    // 北京pk10
    case 'pk10_qy_zxfs':// 前一
      randomArray = MathArray(1, 1, 10)
      wei0 = randomArray[0] < 10 ? `0${randomArray[0]}` : `${randomArray[0]}`
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: wei0})
      break
    case 'pk10_qe_zxfs':// 前二复式
      wei0 = MathArray(1, 1, 10)
      wei1 = MathArray(1, 1, 10)
      while (wei0 / 1 === wei1 / 1) {
        wei0 = MathArray(1, 1, 10)
      }
      wei0 = wei0 < 10 ? `0${wei0}` : `${wei0}`
      wei1 = wei1 < 10 ? `0${wei1}` : `${wei1}`
      randomArray.push(wei0, wei1)
      for (i = 0; i < 2; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: i, ball: randomArray[i]})
      }
      break
    case 'pk10_qe_zxds':// 前二单式
      randomArray = MathArray(2, 1, 10)
      while (randomArray[0] / 1 === randomArray[1] / 1) {
        randomArray = MathArray(2, 1, 10)
      }
      for (j = 0; j < 2; j++) {
        newRandomArray.push(randomArray[j] < 10 ? `0${randomArray[j]}` : `${randomArray[j]}`)
      }
      newRandomArray = newRandomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray})
      break
    case 'pk10_qs_zxfs':// 前三复式
      wei0 = MathArray(1, 1, 10)
      wei1 = MathArray(1, 1, 10)
      wei2 = MathArray(1, 1, 10)
      while (wei0 / 1 === wei1 / 1 || wei0 / 1 === wei2 / 1 || wei1 / 1 === wei2 / 1) {
        wei0 = MathArray(1, 1, 10)
        wei1 = MathArray(1, 1, 10)
        wei2 = MathArray(1, 1, 10)
      }
      wei0 = wei0 < 10 ? `0${wei0}` : `${wei0}`
      wei1 = wei1 < 10 ? `0${wei1}` : `${wei1}`
      wei2 = wei2 < 10 ? `0${wei2}` : `${wei2}`
      randomArray.push(wei0, wei1, wei2)
      for (i = 0; i < 3; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: i, ball: randomArray[i]})
      }
      break
    case 'pk10_qs_zxds':// 前三单式
      randomArray = MathArray(3, 1, 10)
      while (randomArray[0] / 1 === randomArray[1] / 1 || randomArray[0] / 1 === randomArray[2] / 1 || randomArray[1] / 1 === randomArray[2] / 1) {
        randomArray = MathArray(3, 1, 10)
      }
      for (j = 0; j < 3; j++) {
        newRandomArray.push(randomArray[j] < 10 ? `0${randomArray[j]}` : `${randomArray[j]}`)
      }
      newRandomArray = newRandomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: newRandomArray})
      break
    case 'pk10_dwd_dwd':// 定位胆
      randomArray = MathArray(1, 1, 10)
      randomFor = MathArray(1, 1, 9) / 1
      randomArray[0] = randomArray[0] < 10 ? `0${randomArray[0]}` : `${randomArray[0]}`
      commit(types.PUSH_SELECTED_BALL, {index: randomFor, ball: randomArray[0]})
      break
    // 江苏快三
    case 'ks_hz_zx':
      randomArray = MathArray(1, 3, 18)
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: `${randomArray[0]}`})
      break
    case 307:
    case 309:
      randomArray = MathArray(1, 0, 5)
      randomArray = randomArray.join('')
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: randomArray})
      break
    case 'ks_eth_fs':
      randomArray = MathArray(1, 1, 6)
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: `${randomArray[0]}${randomArray[0]}`})
      break
    case 'ks_ebth_bz':
      randomArray = MathArray(2, 1, 6)
      for (i = 0; i < 2; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: `${randomArray[i]}`})
      }
      break
    case 'ks_sth_dx':
      randomArray = MathArray(1, 1, 6)
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: `${randomArray[0]}${randomArray[0]}${randomArray[0]}`})
      break
    case 'ks_sbth_bz':
      randomArray = MathArray(3, 1, 6)
      for (let i = 0; i < 3; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: `${randomArray[i]}`})
      }
      break
    case 'ks_slh_dx':
      randomArray = MathArray(1, 1, 4)
      commit(types.PUSH_SELECTED_BALL, {index: 0, ball: `${randomArray[0]}${randomArray[0] + 1}${randomArray[0] + 2}`})
      break
    case '3d/p3_he_zuxze':
    case '3d/p3_qe_zuxze':
      randomArray = MathArray(2, 0, 9)
      for (i = 0; i < 2; i++) {
        commit(types.PUSH_SELECTED_BALL, {index: 0, ball: `${randomArray[i]}`})
      }
      break
    default:
      console.log(`code:${this.playDetailCode} mapping random function is not found`)
  }
}

export const computedSelected = function ({commit, state}) {
  let zhu = 0
  let count = 0
  let inter = 0 // 交集个数
  let i = 0
  let j = 0
  let k = 0
  let x = 0
  let len = 0
  let index
  let value
  let arr = []
  let jsonData = {}
  let arrTemp = []

  const selected = state.selected.slice()

  function groupSelect (arr1, arr2, num1, num2, call) {
    if (arr1.length >= num1 && arr2.length >= num2) {
      inter = 0
      for (index in arr1) {
        value = arr1[index]
        if (arr2.indexOf(value) !== -1) inter++
      }
      count = Cnm(arr1.length, num1) * Cnm(arr2.length, num2)
      if (inter > 0) {
        if (call) {
          call()
        }
      }
    }
  }

  // 任选复式
  function randomDuplex (num) {
    let index
    for (index = 0; index < selected.length; index++) {
      if (selected[index].length > 0) {
        arr.push(selected[index])
      }
    }
    let CmnArray = Combination(arr, num)
    for (index = 0; index < CmnArray.length; index++) {
      count = 1
      arrTemp = CmnArray[index].split('|')
      for (let i = 0; i < arrTemp.length; i++) {
        count *= arrTemp[i].split(',').length
      }
      zhu += count
    }
  }
  switch (state.selectedPlayingCode) {
    // ------------------时时彩  -----------------//
    case 'ssc_wx_zxfs':// 五星直选(直选复式)
    case 'ffc_wx_zxfs':
      zhu = selected[0].length * selected[1].length * selected[2].length * selected[3].length * selected[4].length
      break
    case 'ssc_wx_zxds':// 五星直选(直选单式)
    case 'ffc_wx_zxds':
      arr = unique(selected[0], 5)
      selected[0] = arr[0]
      zhu = selected[0].length
      break
    case 'ssc_wx_wxzh':// 五星直选(五星组合)
    case 'ffc_wx_wxzh':
      count = 1
      arr = [selected[0], selected[1], selected[2], selected[3], selected[4]]
      for (i in arr) {
        count *= selected[i].length
      }
      zhu = count * 5
      break
    case 'ssc_wx_zux120':// 五星组选(组选120)
    case 'ffc_wx_zx120':
      if (selected[0].length > 4) {
        zhu = Cnm(selected[0].length, 5)
      }
      break
    case 'ssc_wx_zux60':// 五星组选(组选60)
    case 'ffc_wx_zx60':
      groupSelect(selected[0], selected[1], 1, 3, function () {
        count -= Cnm(inter, 1) * Cnm(selected[1].length - 1, 2)
      })
      zhu = count
      break
    case 'ssc_wx_zux30':// 五星组选(组选30)
    case 'ffc_wx_zx30':
      groupSelect(selected[0], selected[1], 2, 1, function () {
        count -= Cnm(inter, 2) * Cnm(2, 1)
        if (selected[0].length - inter > 0) {
          count -= Cnm(inter, 1) * Cnm(selected[0].length - inter, 1)
        }
      })
      zhu = count
      break
    case 'ssc_wx_zux20':// 五星组选(组选20)
    case 'ffc_wx_zx20':
      groupSelect(selected[0], selected[1], 1, 2, function () {
        count -= Cnm(inter, 1) * Cnm(selected[1].length - 1, 1)
      })
      zhu = count
      break
    case 'ssc_wx_zux10':// 五星组选(组选10)
    case 'ffc_wx_zx10':
      groupSelect(selected[0], selected[1], 1, 1, function () {
        count -= Cnm(inter, 1)
      })
      zhu = count
      break
    case 'ssc_wx_zux5':// 五星组选 组选5
    case 'ffc_wx_zx5':
      groupSelect(selected[0], selected[1], 1, 1, function () {
        count -= Cnm(inter, 1)
      })
      zhu = count
      break
    case 'ssc_sx_zxfs':// 四星直选(直选复式)
    case 'ffc_sx_zxfs':
      zhu = selected[0].length * selected[1].length * selected[2].length * selected[3].length
      break
    case 'ssc_sx_zxds':// 四星直选(直选单式)
    case 'ffc_sx_zxds':
      arr = unique(selected[0], 4)
      selected[0] = arr[0]
      this.errorArray = arr[1]
      zhu = selected[0].length
      break
    case 'ssc_sx_sxzh':// 四星直选(四星组合)
    case 'ffc_sx_sxzh':
      zhu = selected[0].length * selected[1].length * selected[2].length * selected[3].length * 4
      break
    case 'ssc_sx_zux24':// 四星组选 组选24
    case 'ffc_sx_zx24':
      if (selected[0].length > 3) {
        zhu += Cnm(selected[0].length, 4)
      }
      break
    case 'ssc_sx_zux12':// 四星组选 组选12
    case 'ffc_sx_zx12':
      groupSelect(selected[0], selected[1], 1, 2, function () {
        count -= Cnm(inter, 1) * Cnm(selected[1].length - 1, 1)
      })
      zhu = count
      break
    case 'ssc_sx_zux6':// 四星组选 组选6
    case 'ffc_sx_zx6':
      if (selected[0].length >= 2) {
        zhu += Cnm(selected[0].length, 2)
      }
      break
    case 'ssc_sx_zux4':// 四星组选 组选4
    case 'ffc_sx_zx4':
      groupSelect(selected[0], selected[1], 1, 1, function () {
        count -= Cnm(inter, 1)
      })
      zhu = count
      break
    case 'ssc_hs_zxkd':// 前三,中三,后三(直选跨度)
    case 'ssc_zs_zxkd':
    case 'ssc_qs_zxkd':
    case 'ffc_hs_zxkd':
    case 'ffc_zs_zxkd':
    case 'ffc_qs_zxkd':
      jsonData = {0: 10, 1: 54, 2: 96, 3: 126, 4: 144, 5: 150, 6: 144, 7: 126, 8: 96, 9: 54}
      for (i = 0; i < selected[0].length; i++) {
        zhu += jsonData[parseInt(selected[0][i])]
      }
      break
    case 'ssc_qs_zxfs':// 前三,中三,后三(直选复式)
    case 'ssc_zs_zxfs':
    case 'ssc_hs_zxfs':
    case 'ffc_qs_zxfs':
    case 'ffc_zs_zxfs':
    case 'ffc_hs_zxfs':
      zhu = selected[0].length * selected[1].length * selected[2].length
      break
    case 'ssc_qs_zxds':// 前三,中三,后三(直选单式)
    case 'ssc_zs_zxds':
    case 'ssc_hs_zxds':
    case 'ssc_zs_zlds':
    case 'ssc_qs_zlds':
    case 'ffc_qs_zxds':
    case 'ffc_zs_zxds':
    case 'ffc_hs_zxds':
      arr = unique(selected[0], 3)
      selected[0] = arr[0]
      zhu = selected[0].length
      break
    case 'ssc_qs_zxhz':// 前三,中三,后三(直选和值)
    case 'ssc_zs_zxhz':
    case 'ssc_hs_zxhz':
    case 'ffc_qs_zxhz':
    case 'ffc_zs_zxhz':
    case 'ffc_hs_zxhz':
      for (i = 0; i < selected[0].length; i += 1) {
        count = 0
        for (j = 0; j < 10; j += 1) {
          for (k = 0; k < 10; k += 1) {
            for (x = 0; x < 10; x += 1) {
              if (j + k + x === Number(selected[0][i])) {
                count = count + 1
              }
            }
          }
        }
        zhu += count
      }
      break
    case 'ssc_qs_zulfs':// 前三,中三,后三(组六复式)
    case 'ssc_zs_zulfs':
    case 'ssc_hs_zulfs':
    case 'ffc_qs_zlfs':
    case 'ffc_zs_zlfs':
    case 'ffc_hs_zlfs':
      zhu = Cnm(selected[0].length, 3)
      break
    case 'ssc_qs_zusfs':// 前三,中三,后三(组三复式)
    case 'ssc_zs_zusfs':
    case 'ssc_hs_zusfs':
    case 'ffc_qs_zsfs':
    case 'ffc_zs_zsfs':
    case 'ffc_hs_zsfs':
      zhu = Cnm(selected[0].length, 2) * 2
      break
    case 'ssc_qs_zsds':// 前三,中三,后三(组三单式)
    case 'ssc_zs_zusds':
    case 'ssc_hs_zsds':
    case 'ffc_qs_zsds':
    case 'ffc_zs_zsds':
    case 'ffc_hs_zsds':
      arr = uniqueCnm3(selected[0], 3)
      selected[0] = arr[0]
      zhu = selected[0].length
      break
    case 'ssc_qe_zxfs':// 前二,后二(直选复式)
    case 'ssc_he_zxfs':
    case 'ffc_qe_zxfs':
    case 'ffc_he_zxfs':
      zhu = selected[0].length * selected[1].length
      break
    case 'ssc_qe_zxhz':// 前二,后二(直选和值)
    case 'ssc_he_zxhz':
    case 'ffc_qe_zxhz':
    case 'ffc_he_zxhz':
      for (i = 0; i < selected[0].length; i += 1) {
        count = 0
        for (j = 0; j < 10; j += 1) {
          for (k = 0; k < 10; k += 1) {
            if (j + k === Number(selected[0][i])) {
              count = count + 1
            }
          }
        }
        zhu += count
      }
      break
    case 'ssc_qe_zxkd':// 前二,后二(直选跨度)
    case 'ssc_he_zxkd':
    case 'ffc_qe_zxkd':
    case 'ffc_he_zxkd':
      jsonData = {0: 10, 1: 18, 2: 16, 3: 14, 4: 12, 5: 10, 6: 8, 7: 6, 8: 4, 9: 2}
      for (i = 0; i < selected[0].length; i++) {
        zhu += jsonData[parseInt(selected[0][i])]
      }
      break
    case 'ssc_qe_zuxhz':// 前二,后二(组选包胆)
    case 'ssc_he_zuxhz':
    case 'ffc_qe_zxbd':
    case 'ffc_he_zxbd':
      zhu = selected[0].length * 9
      break
    case 'ssc_bdwd_qsym':// 不定位胆(三星一码,四星一码)
    case 'ssc_bdwd_sxym':
    case 'ssc_bdwd_zsym':
    case 'ssc_bdwd_hsym':
    case 'ffc_bdwd_qsym':
    case 'ffc_bdwd_sxym':
    case 'ffc_bdwd_zsym':
    case 'ffc_bdwd_hsym':
      zhu = selected[0].length
      break
    case 'ssc_bdwd_qsem':// 不定位胆(三星二码,四星二码,五星二码)
    case 'ssc_bdwd_zsem':
    case 'ssc_bdwd_hsem':
    case 'ssc_bdwd_sxem':
    case 'ssc_bdwd_wxem':
    case 'ffc_bdwd_qsem':
    case 'ffc_bdwd_zsem':
    case 'ffc_bdwd_hsem':
    case 'ffc_bdwd_sxem':
    case 'ffc_bdwd_wxem':
      zhu = selected[0].length * (selected[0].length - 1) / 2
      break
    case 'ssc_bdwd_wxsm':// 不定位胆(五星三码)
    case 'ffc_bdwd_wxsm':
      zhu = Cnm(selected[0].length, 3)
      break
    case 'ssc_dwd_wxdwd':// 定位胆(五星定位胆)
    case 'ffc_dwd_wxdwd':
      arr = [selected[0], selected[1], selected[2], selected[3], selected[4]]
      for (index in arr) {
        zhu += selected[index].length
      }
      break
    case 'ssc_qw_yffs':// 趣味(一帆风顺,好事成双,三星报喜,四季发财)
    case 'ssc_qw_hscs':
    case 'ssc_qw_sxbx':
    case 'ssc_qw_sjfc':
    case 'ssc_dxds_dxds':// 大小单双总和
    case 'ssc_lh_wq':// 龙虎
    case 'ssc_lh_wb':
    case 'ssc_lh_ws':
    case 'ssc_lh_wg':
    case 'ssc_lh_qb':
    case 'ssc_lh_qs':
    case 'ssc_lh_qg':
    case 'ssc_lh_bs':
    case 'ssc_lh_bg':
    case 'ssc_lh_sg':
    case 'ffc_qw_yffs':// 趣味(一帆风顺,好事成双,三星报喜,四季发财)
    case 'ffc_qw_hscs':
    case 'ffc_qw_sxbx':
    case 'ffc_qw_sjfc':
    case 'ffc_dxds_dxds':// 大小单双总和
    case 'ffc_lh_wq':// 龙虎
    case 'ffc_lh_wb':
    case 'ffc_lh_ws':
    case 'ffc_lh_wg':
    case 'ffc_lh_qb':
    case 'ffc_lh_qs':
    case 'ffc_lh_qg':
    case 'ffc_lh_bs':
    case 'ffc_lh_bg':
    case 'ffc_lh_sg':
    case 'ks_hz_zx':// 快三总和
    case 'ks_eth_fs':// 快三2T
    case 'ks_sth_dx':// 快三3T
    case 'ks_sth_tx':// 快三3T
    case 'ks_slh_dx':// 快三3L
    case 'ks_slh_tx':// 快三3L全
      zhu = selected[0].length
      break
    case 'ks_ebth_bz':// 快三2BT
      len = selected[0].length
      if (len >= 2) {
        zhu = len * (len - 1) / 2
      } else {
        zhu = 0
      }
      break
    case 'ks_sbth_bz':// 快三3BT
      len = selected[0].length
      if (len >= 3) {
        zhu = len * (len - 1) * (len - 2) / 6
      } else {
        zhu = 0
      }
      break
    case 'ssc_rx2_zxfs':// 任选二(直选复式)
    case 'ffc_rx2_zxfs':
      randomDuplex(2)
      break
    case 'ssc_rx2_zxhz':// 任选二(直选和值)
    case 'ffc_rx2_zxhz':
      count = 0
      jsonData = {
        0: 1,
        1: 2,
        2: 3,
        3: 4,
        4: 5,
        5: 6,
        6: 7,
        7: 8,
        8: 9,
        9: 10,
        10: 9,
        11: 8,
        12: 7,
        13: 6,
        14: 5,
        15: 4,
        16: 3,
        17: 2,
        18: 1
      }
      for (index in selected[0]) {
        count += jsonData[selected[0][index] / 1]
      }
      zhu = count * this.positionPlan
      break
    case 'ssc_rx2_zuxfs':// 任选二(组选复式)
    case 'ffc_rx2_zuxfs':
      count = selected[0].length * (selected[0].length - 1) / 2
      zhu = count * this.positionPlan
      break
    case 'ssc_rx3_zxfs':// 任选三(直选复式)
    case 'ffc_rx3_zxfs':
      randomDuplex(3)
      break
    case 'ssc_rx3_zxhz':// 任选三(直选和值)
    case 'ffc_rx3_zxhz':
      jsonData = {
        0: 1,
        1: 3,
        2: 6,
        3: 10,
        4: 15,
        5: 21,
        6: 28,
        7: 36,
        8: 45,
        9: 55,
        10: 63,
        11: 69,
        12: 73,
        13: 75,
        14: 75,
        15: 73,
        16: 69,
        17: 63,
        18: 55,
        19: 45,
        20: 36,
        21: 28,
        22: 21,
        23: 15,
        24: 10,
        25: 6,
        26: 3,
        27: 1
      }
      count = 0
      let s = 0
      for (index in selected[0]) {
        s = selected[0][index] / 1
        count += jsonData[s]
      }
      zhu = count * state.positionPlan
      break
    case 'ssc_rx3_zusfs':// 任选三(组三复式)
    case 'ffc_rx3_zsfs':
      let n = selected[0].length
      count = n * (n - 1)
      zhu = count * state.positionPlan
      break
    case 'ssc_rx3_zulfs':// 任选三(组六复式)
    case 'ffc_rx3_zlfs':
      zhu = Cnm(selected[0].length, 3) * state.positionPlan
      break
    case 'ssc_rx4_zxfs':// 任选四(直选复式)
    case 'ffc_rx4_zxfs':
      randomDuplex(4)
      break
    case 'ssc_rx4_zux24':// 任选四(组选24)
    case 'ffc_rx4_zx24':
      count = selected[0].length < 4 ? 0 : Cnm(selected[0].length, 4)
      zhu = count * state.positionPlan
      break
    case 'ssc_rx4_zux12':// 任选四(组选12)
    case 'ffc_rx4_zx12':
      groupSelect(selected[0], selected[1], 1, 2, function () {
        count -= Cnm(inter, 1) * Cnm(selected[1].length - 1, 1)
      })
      zhu = count * state.positionPlan
      break
    case 'ssc_rx4_zux6':// 任选四(组选6)
    case 'ffc_rx4_zx6':
      count = selected[0].length < 2 ? 0 : Cnm(selected[0].length, 2)
      zhu = count * state.positionPlan
      break
    case 'ssc_rx4_zux4':// 任选四(组选4)
    case 'ffc_rx4_zx4':
      groupSelect(selected[0], selected[1], 1, 1, function () {
        count -= Cnm(inter, 1)
      })
      zhu = count * state.positionPlan
      break
    // ------------------11选5 -----------------
    case '11x5_qs_zxfs':// 前三,中三,后三(直选复式)-11选五
    case '11x5_zs_zxfs':
    case '11x5_hs_zxfs':
      for (i = 0; i < selected[0].length; i++) {
        for (j = 0; j < selected[1].length; j++) {
          for (k = 0; k < selected[2].length; k++) {
            if (selected[0][i] !== selected[1][j] && selected[0][i] !== selected[2][k] && selected[1][j] !== selected[2][k]) {
              zhu++
            }
          }
        }
      }
      break
    case '11x5_qs_zuxfs':// 前三,中三,后三(组选复式)-11选五
    case '11x5_zs_zuxfs':
    case '11x5_hs_zuxfs':
      zhu = Cnm(selected[0].length, 3)
      break
    case '11x5_qs_zxdt':// 前三,中三,后三(组选胆拖)-11选五
    case '11x5_zs_zxdt':
    case '11x5_hs_zxdt':
      let danlen = selected[0].length
      let tuolen = selected[1].length
      if (danlen < 1 || tuolen < 1 || danlen >= 3) {
        zhu = 0
      } else {
        zhu = Cnm(tuolen, 3 - danlen)
      }
      break
    case '11x5_qs_zxds':
    case '11x5_hs_zxds':
    case '11x5_zs_zxds':
      arr = unique11X5ZhiXuan(selected[0], 6)
      selected[0] = arr[0]
      zhu = selected[0].length
      break
    case '11x5_qs_zuxds':
    case '11x5_hs_zuxds':
    case '3d/p3_sx_zuxzl':
      arr = unique11X5ZuXuan(selected[0], 6)
      selected[0] = arr[0]
      zhu = selected[0].length
      break
    case '11x5_qe_zxfs':// 前二,后二(直选复式)-11选五
    case '11x5_he_zxfs':
      for (i = 0; i < selected[0].length; i++) {
        for (j = 0; j < selected[1].length; j++) {
          if (selected[0][i] !== selected[1][j]) {
            zhu++
          }
        }
      }
      break
    case '11x5_he_zxds':
    case '11x5_qe_zxds':
      arr = unique11X5ZhiXuan(selected[0], 4)
      selected[0] = arr[0]
      zhu = selected[0].length
      break
    case '11x5_he_zuxds':
    case '11x5_qe_zuxds':
      arr = unique11X5ZuXuan(selected[0], 4)
      selected[0] = arr[0]
      zhu = selected[0].length
      break
    case '11x5_qe_zuxfs':// 前二,后二(组选复式)-11选五
    case '11x5_he_zuxfs':
    case 'ffc_he_zxze':
    case 'ssc_he_zuxfs':
    case 'ssc_qe_zuxfs':
    case 'ffc_qe_zxze':
      zhu = Cnm(selected[0].length, 2)
      break
    case '11x5_qe_zxdt':// 前二,后二(组选胆拖)-11选五
    case '11x5_he_zxdt':
      const tempDanlen = selected[0].length
      const tempTuolen = selected[1].length
      if (tempDanlen < 1 || tempTuolen < 1 || tempDanlen >= 2) {
        zhu = 0
      } else {
        zhu = Cnm(tempTuolen, 2 - tempDanlen)
      }
      break
    case '11x5_rxfs_rxyzy': // 任选复式 (任选一中一)-11选五
      if (selected[0].length < 1) return 0
      zhu = Cnm(selected[0].length, 1)
      break
    case '11x5_rxfs_rxeze':// 任选复式(任选二中二)-11选五
      if (selected[0].length < 2) return 0
      zhu = Cnm(selected[0].length, 2)
      break
    case '11x5_rxfs_rxszs':// 任选复式(任选三中三)-11选五
      if (selected[0].length < 3) return 0
      zhu = Cnm(selected[0].length, 3)
      break
    case '11x5_rxfs_rxsizsi':// 任选复式(任选四中四)-11选五
      if (selected[0].length < 4) return 0
      zhu = Cnm(selected[0].length, 4)
      break
    case '11x5_rxfs_rxwzw':// 任选复式(任选五中五)-11选五
      if (selected[0].length < 5) return 0
      zhu = Cnm(selected[0].length, 5)
      break
    case '11x5_rxfs_rxlzw':// 任选复式(任选六中五)-11选五
      if (selected[0].length < 6) return 0
      zhu = Cnm(selected[0].length, 6)
      break
    case '11x5_rxfs_rxqzw':// 任选复式(任选七中五)-11选五
      if (selected[0].length < 7) return 0
      zhu = Cnm(selected[0].length, 7)
      break
    case '11x5_rxfs_rxbzw':// 任选复式(任选八中五)-11选五
      if (selected[0].length < 8) return 0
      zhu = Cnm(selected[0].length, 8)
      break
    case '11x5_bdwd_qsbdwd':// 不定位胆(前三不定位胆,中三不定位胆,后三不定位胆)-11选五
    case '11x5_bdwd_zsbdwd':
    case '11x5_bdwd_hsbdwd':
      zhu = selected[0].length
      break
    case '11x5_dwd_wxdwd':// 定位胆(五星定位胆)-11选五
      arr = [selected[0], selected[1], selected[2], selected[3], selected[4]]
      for (index in arr) {
        zhu = zhu + arr[index].length
      }
      break
    // ------------------福彩3D,排列三 -----------------//
    case '3d/p3_sx_zxfs':// 三星(直选复式)-福彩3D,排列三
      zhu = selected[0].length * selected[1].length * selected[2].length
      break
    case '3d/p3_sx_zxds':// 三星(直选单式)-福彩3D,排列三
      arr = unique(selected[0], 3)
      selected[0] = arr[0]
      zhu = selected[0].length
      break
    case '3d/p3_sx_zxzl':// 三星(组选组六)-福彩3D,排列三
      zhu = Cnm(selected[0].length, 3)
      break
    case '3d/p3_sx_zuxzs':// 三星(组选组三)-福彩3D,排列三
      zhu = selected[0].length * (selected[0].length - 1)
      break
    case '3d/p3_qe_zxfs':// 前二,后二(直选复式)-福彩3D,排列三
    case '3d/p3_he_zxfs':
    case 'ssc_dxds_qe':
    case 'ssc_dxds_he':
      zhu = selected[0].length * selected[1].length
      break
    case '3d/p3_qe_zxds':// 前二,后二(直选单式)-福彩3D,排列三
    case '3d/p3_he_zxds':
    case 'ssc_he_zuxds':
    case 'ssc_qe_zuxds':
      arr = unique(selected[0], 2)
      selected[0] = arr[0]
      zhu = selected[0].length
      break
    case '3d/p3_qe_zuxze':// 前二,后二(组选组二)-福彩3D,排列三
    case '3d/p3_he_zuxze':
      zhu = Cnm(selected[0].length, 2)
      break
    case '3d/p3_dwd_dwd':// 定位胆(三星定位胆)-福彩3D,排列三
      arr = [selected[0], selected[1], selected[2]]
      for (index in arr) {
        zhu += arr[index].length
      }
      break
    case '3d/p3_bdwd_embdwd':// 不定位胆(二码不定位胆)-福彩3D,排列三
      if (selected[0].length >= 2) {
        zhu = selected[0].length * (selected[0].length - 1) / 2
      }
      break
    case '3d/p3_bdwd_ymbdwd':// 不定位胆(一码不定位胆)-福彩3D,排列三
      zhu = selected[0].length
      break
    case '3d/p3_sx_zuxhh':// 三星(组选混合)-福彩3D,排列三
    case 'ssc_hs_zuxhh':// 后三-时时彩
    case 'ssc_zs_zuxhh':
    case 'ssc_qs_zuxhh':
      arr = uniqueCnm(selected[0], 3)
      selected[0] = arr[0]
      zhu = selected[0].length
      break
    case '3d/p3_he_zuxhh':// 后二(组选混合)-福彩3D,排列三
    case '3d/p3_qe_zuxhh':// 前二(组选混合)-福彩3D,排列三
      arr = uniqueCnm(selected[0], 2)
      selected[0] = arr[0]
      zhu = selected[0].length
      break
    // ------------------北京快乐8-----------------//
    case 'klc_rx_rx1':// 任选(任选一)-北京快乐8
      zhu = Cnm(selected[0].length, 1)
      break
    case 'klc_rx_rx2':// 任选(任选二)-北京快乐8
      if (selected[0].length >= 2) {
        zhu = Cnm(selected[0].length, 2)
      }
      break
    case 'klc_rx_rx3':// 任选(任选三)-北京快乐8
      if (selected[0].length >= 3) {
        zhu = Cnm(selected[0].length, 3)
      }
      break
    case 'klc_rx_rx4':// 任选(任选四)-北京快乐8
      if (selected[0].length >= 4) {
        zhu = Cnm(selected[0].length, 4)
      }
      break
    case 'klc_rx_rx5':// 任选(任选五)-北京快乐8
      if (selected[0].length >= 5) {
        zhu = Cnm(selected[0].length, 5)
      }
      break
    case 'klc_rx_rx6':// 任选(任选六)-北京快乐8
      if (selected[0].length >= 6) {
        zhu = Cnm(selected[0].length, 6)
      }
      break
    case 'klc_rx_rx7':// 任选(任选七)-北京快乐8
      if (selected[0].length >= 7) {
        zhu = Cnm(selected[0].length, 7)
      }
      break
    case 'klc_qw_sxp':// 趣味(上下盘,奇偶盘,和值大小单双)-北京快乐8
    case 'klc_qw_jop':
    case 'klc_qw_hzdxds':
      zhu = selected[0].length
      break
    // --------------- PK10  -----------//
    case 'pk10_qy_zxfs':// 前一(直选复式)-PK10
      zhu = selected[0].length
      break
    case 'pk10_qe_zxfs':// 前二(直选复式)-PK10
      for (i = 0; i < selected[0].length; i++) {
        for (j = 0; j < selected[1].length; j++) {
          if (selected[0][i] !== selected[1][j]) {
            zhu++
          }
        }
      }
      break
    case 'pk10_qe_zxds':
      arr = uniquePK10(selected[0], 4)
      selected[0] = arr[0]
      zhu = selected[0].length
      break
    case 'pk10_qs_zxds':
      arr = uniquePK10(selected[0], 6)
      selected[0] = arr[0]
      zhu = selected[0].length
      break
    case 'pk10_qs_zxfs':// 前三(直选复式)-PK10
      for (i = 0; i < selected[0].length; i++) {
        for (j = 0; j < selected[1].length; j++) {
          for (k = 0; k < selected[2].length; k++) {
            if (selected[0][i] !== selected[1][j] && selected[0][i] !== selected[2][k] && selected[1][j] !== selected[2][k]) {
              zhu++
            }
          }
        }
      }
      break
    case 'pk10_dwd_dwd':// 定位胆(定位胆)-PK10
      for (index in selected) {
        zhu += selected[index].length
      }
      break
    default:
      console.log(`code:${state.selectedPlayingCode} mapping function is not found`)
  }
  commit(types.SET_SELECTED_BET_COUNT, zhu)
}
