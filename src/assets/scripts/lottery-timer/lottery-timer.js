import {getLotteryDrawTime} from 'api/official/official'
import {ERR_OK} from 'api/config'

function LotteryTimer () {
  this.lotteryCode = ''
  this.nextIssue = ''
  this.issue = ''
  this.periods = ''
  this.stopTime = ''
  this.openTime = ''
  this.openTimeType = ''
}

LotteryTimer.prototype = {
  constructor: LotteryTimer,
  setOptions: function (lotteryCode) {
    this.lotteryCode = lotteryCode
  },
  fetchDrawInfo: function () {
    getLotteryDrawTime({gameCode: this.lotteryCode}).then(response => {
      const {currentStatus, currentData} = response
      if (currentStatus === ERR_OK) {
        const {issue, periods, stopTime, openTime, openTimeType} = currentData
        this.issue = issue
        this.periods = periods
        this.stopTime = stopTime
        this.openTime = openTime
        this.openTimeType = openTimeType
      }
    })
  },
  updateDrawInfo: function () {

  }
}

export default LotteryTimer
