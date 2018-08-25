import * as types from './mutation-types'

const mutations = {
  [types.SET_BET_DATA] (state, list) {
    state.betList = list
  },
  [types.SET_BET_DATA_AMOUNT] (state, amount) {
    state.betList.forEach(bet => {
      bet.amount = amount
    })
  },
  [types.SET_BET_DATA_IDS] (state, ids) {
    state.betIdsList = ids
  },
  [types.SET_USER_ACCOUNT] (state, account) {
    state.userAccount = account
  },
  [types.SET_USER_AMOUNT] (state, amount) {
    state.userAmount = amount
  },
  [types.SET_USER_ID] (state, userId) {
    state.userId = userId
  },
  [types.SET_USER_PROXY_ID] (state, userProxyId) {
    state.userProxyId = userProxyId
  },
  [types.SET_USER_CREDIT_MENU_LIST] (state, menus) {
    state.userMenuList.credit = menus
  },
  [types.SET_USER_OFFIC_MENU_LIST] (state, menus) {
    state.userMenuList.official = menus
  },
  [types.TOGGLE_CREDIT_USER_MENU_LIST_SHOW] (state, index) {
    state.userMenuList.credit[index].isShow = !state.userMenuList.credit[index].isShow
  },
  [types.TOGGLE_OFFIC_USER_MENU_LIST_SHOW] (state, index) {
    state.userMenuList.official[index].isShow = !state.userMenuList.official[index].isShow
  },
  [types.CHANGE_GAME_COLLECTION] (state, payload) {
    state.userMenuList.credit[payload.index].children = payload.games
  },
  [types.SET_USER_GAME_LIST_INDEX] (state, index) {
    state.gameListIndex = index
  },
  [types.SET_LOTTERY_ID] (state, id) {
    state.lotteryId = id
  },
  [types.SET_LOTTERY_CODE] (state, code) {
    state.lotteryCode = code
  },
  [types.SET_LOTTERY_NAME] (state, name) {
    state.lotteryName = name
  },
  [types.SET_LOTTERY_RULE] (state, rule) {
    state.lotteryRule = rule
  },
  [types.SET_LOTTERY_GROUP_ID] (state, id) {
    state.lotteryGroupId = id
  },
  [types.SET_LOTTERY_GROUP_CODE] (state, code) {
    state.lotteryGroupCode = code
  },
  [types.SET_HEADER_TITLE] (state, title) {
    state.headerTitle = title
  },
  [types.SET_BETS_DIALOG_VISIBLE] (state, payload) {
    state.betsDialogVisible = payload.visible
  },
  [types.SET_STOP_BET] (state, payload) {
    state.stopBet = payload.stopBet
  },
  [types.SET_TIMER_TIME] (state, payload) {
    state.timerTime = payload.time
  },
  [types.SET_NEXT_ISSUE] (state, payload) {
    state.nextIssue = payload.issue
  },
  [types.SET_PRE_ISSUE] (state, payload) {
    state.preIssue = payload.issue
  },
  [types.SET_STOP_SELL] (state, payload) {
    state.stopSell = payload.stopSell
  },
  [types.UPDATE_LIKE_LIST] (state, payload) {
    state.likeList = payload
  },
  [types.TOGGLE_CHART_CONFIG_VISIBLE] (state, payload) {
    state.chartConfigVisible = payload.visible
  },
  [types.INPUT_AMOUNT] (state, amount) {
    state.inputAmount = amount
  }, // before
  [types.PUSH_SELECTED_BALL] (state, payload) {
    state.selected[payload.index].push(payload.ball)
  },
  [types.DEL_SELECTED_BALL] (state, payload) {
    state.selected[payload.index].splice(payload.dataIndex, 1)
  },
  [types.CLEAN_SELECTED_BALL] (state, index) {
    state.selected[index].length = 0
  },
  [types.SET_SELECTED_BALL] (state, payload) {
    state.selected = payload
  },
  [types.SET_SELECTED_MODE_BY_INDEX] (state, payload) {
    state.selectedModeMap[payload.index] = payload.mode
  },
  [types.SET_SELECTED_MODE] (state, modeMap) {
    state.selectedModeMap = modeMap
  },
  [types.SET_SELECTED_BET_COUNT] (state, count) {
    state.selectedBetCount = count
  },
  [types.SET_PLAYING_CODE] (state, code) {
    state.selectedPlayingCode = code
  },
  [types.SET_SELECTED_SPILT] (state, number) {
    state.selectedSpilt = number
  },
  [types.SET_INPUT_TEXT_BALL] (state, {index, balls}) {
    state.selected[index] = balls
  },
  [types.PUSH_BETTING_LIST] (state, bet) {
    state.bettingList.push(bet)
  },
  [types.SET_UNIT_OPTIONS] (state, options) {
    state.unitOptions = options
  },
  [types.SET_UNIT] (state, unit) {
    state.unit = unit
  },
  [types.SET_BONUS_PERCENT_OPTIONS] (state, options) {
    state.bonusPercentOptions = options
  },
  [types.SET_BONUS_PERCENT] (state, bonusPercent) {
    state.bonusPercent = bonusPercent
  },
  [types.SET_BETTING_MULTIPLE] (state, multiple) {
    state.bettingMultiple = multiple
  },
  [types.SET_BETTING_LIST] (state, list) {
    state.bettingList = list
  },
  [types.SET_POSITION_PLAN] (state, plan) {
    state.positionPlan = plan
  },
  isGF (state, payload) {
    state.isGF = payload
  }
}

export default mutations
