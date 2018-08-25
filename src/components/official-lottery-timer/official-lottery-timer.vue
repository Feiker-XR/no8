<template>
  <div class="lottery-timer-wrapper">
    <div class="timer-container">
      <flexbox class="per-issue-wrapper">
        <flexbox-item :span="3">
          <div class="per-issue">{{preIssue}}</div>
        </flexbox-item>
        <flexbox-item>
          <lottery-draw-balls :loading="isLoading"
                              :balls="drawBalls"
                              :groupCode="lotteryGroupCode">
          </lottery-draw-balls>
          <lottery-draw-balls :loading="isLoading"
                              :statistics="drawStatistics"
                              :groupCode="lotteryGroupCode">
          </lottery-draw-balls>
        </flexbox-item>
      </flexbox>
      <flexbox class="next-issue-wrapper">
        <flexbox-item :span="3">
          <div class="next-issue">{{nextIssue}}</div>
        </flexbox-item>
        <flexbox-item><span>封盘时间:</span><span class="time" :class="{red:betEndIsRuning}">{{betEndTime}}</span>
        </flexbox-item>
        <flexbox-item><span>开奖时间:</span><span class="time" :class="{red:drawIsRuning}">{{drawEndTime}}</span>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>

<script>
  import {Flexbox, FlexboxItem} from 'vux'
  import LotteryDrawBalls from 'components/lottery-draw-balls/lottery-draw-balls'
  import {mapGetters, mapMutations} from 'vuex'
  import {getLotteryDrawTime, getCurrentResult} from 'api/official/official'
  import {ERR_OK} from '@/assets/const/config'
  import {getPerIssue, isNumber, parseDrawResult} from '@/assets/scripts/util'

  export default {
    props: {
      name: {
        type: String
      }
    },
    data () {
      const loading = [
        {show: true, value: '正', code: 'string'},
        {show: true, value: '在', code: 'string'},
        {show: true, value: '开', code: 'string'},
        {show: true, value: '奖', code: 'string'}]
      return {
        loading,
        isLoading: true,
        drawBalls: [],
        drawStatistics: [],
        betEndTime: '加载中...',
        drawEndTime: '加载中...',
        preIssue: '加载中...',
        nextIssue: '加载中...',
        drawIsRuning: false,
        betEndIsRuning: false,
        gameGroupCode: '',
        gameCode: ''
      }
    },
    components: {
      Flexbox,
      FlexboxItem,
      LotteryDrawBalls
    },
    computed: {
      ...mapGetters([
        'lotteryGroupCode',
        'lotteryCode'
      ])
    },
    beforeDestroy () {
      this._timerClear()
    },
    methods: {
      ...mapMutations({
        setStopBet: 'SET_STOP_BET',
        setTimerTime: 'SET_TIMER_TIME',
        setPreIssue: 'SET_PRE_ISSUE',
        setNextIssue: 'SET_NEXT_ISSUE',
        setStopSell: 'SET_STOP_SELL'
      }),
      reset () {
        this._loading()
        this.drawIsRuning = false
        this.betEndIsRuning = false
        this.setPreIssue({issue: '加载中...'})
        this.setNextIssue({issue: '加载中...'})
        this.betEndTime = '加载中...'
        this.drawEndTime = '加载中...'
        this.preIssue = '加载中...'
        this.nextIssue = '加载中...'
      },
      _loading () {
        this.isLoading = true
        this.drawBalls = this.loading
        this.drawStatistics = []
      },
      _timerClear () {
        this._clearGetDataTimer()
        this.$timer.stop()
      },
      $init (gameCode, stopSell) {      // 没有调用
        this.gameCode = gameCode
        this.reset()
        this._timerClear()
        this._fetchDrawInfo(stopSell)
      },
      _stopSell () {
        this.$timer.stop()
        this.betEndTime = '已停售'
        this.drawEndTime = '已停售'
        this.setStopSell({stopSell: true})
        this.setTimerTime({time: '已停售'})
      },
      _fetchDrawInfo () {
        const _this = this
        getLotteryDrawTime({gameCode: _this.lotteryCode}).then(response => {
          const {currentStatus, currentData} = response
          if (currentStatus === ERR_OK && currentData) {
            const {issue, stopTime, openTime, periods, openTimeType} = currentData
            _this.nextIssue = issue
            _this.betEndTime = stopTime
            _this.drawEndTime = openTime
            _this.setIssue(issue, periods, openTimeType)
            if (_this.isStopSell(stopTime, openTime)) {
              _this.setStopBet({stopBet: true})
              _this.timerStart(stopTime, openTime)
            } else {
              _this._stopSell()
            }
          }
        }).catch(error => {
          console.log(error)
          _this._stopSell()
        })
      },
      timerStart: function (nextLotteryTime, openLotteryTime) {
        const _this = this
        _this.$timer.on('onBetEnd', () => {
          _this.betEndIsRuning = false
          _this.betEndTime = '已封盘'
          _this.setStopBet({stopBet: true})
          _this.setTimerTime({time: '已封盘'})
        })
        _this.$timer.on('onDrawEnd', () => {
          _this._fetchDrawInfo()
          _this.drawIsRuning = false
          _this.drawEndTime = '开奖中'
        })
        _this.$timer.on('onBetEndTime', time => {
          _this.betEndIsRuning = true
          _this.betEndTime = time
          _this.setTimerTime({time})
        })
        _this.$timer.on('onDrawEndTime', time => {
          _this.drawIsRuning = true
          _this.drawEndTime = time
        })
        _this.$timer.setOptions({endSeconds: nextLotteryTime, drawSeconds: openLotteryTime})
        _this.$timer.start()
      },
      isStopSell: function (nextLotteryTime, openLotteryTime) {
        return /^[+-]?\d+(\.\d+)?$/.test(nextLotteryTime) && /^[+-]?\d+(\.\d+)?$/.test(openLotteryTime)
      },
      setIssue: function (nextIssue, period, issueType) {
        if (nextIssue && isNumber(nextIssue) && period && issueType) {
          const preIssue = getPerIssue(nextIssue, period, issueType)
          this.preIssue = preIssue
          this.nextIssue = nextIssue
          this.setPreIssue({issue: preIssue})
          this.setNextIssue({issue: nextIssue})
          this.startGetLotteryData(this.lotteryCode, preIssue)
        }
      },
      _clearGetDataTimer: function () {
        if (this.interValTimerId) {
          clearInterval(this.interValTimerId)
        }
      },
      setDrawBalls (balls) {
        this.drawBalls = parseDrawResult(this.lotteryGroupCode, balls)
      },
      startGetLotteryData: function (gameCode, issue) {
        const _this = this
        _this._loading()
        const query = Object.assign({}, {gameCode, lotteryResultNum: issue})
        _this._clearGetDataTimer()
        function getLotteryDrawData () {
          getCurrentResult(query).then(res => {
            const {currentStatus, currentData} = res
            if (currentStatus === 0 && currentData) {
              const {lotteryResult} = currentData
              if (lotteryResult) {
                _this.isLoading = false
                _this._clearGetDataTimer()
                _this.setDrawBalls(lotteryResult.split(','))
              }
            }
          }).catch(() => {

          })
        }
        _this.interValTimerId = setInterval(function () {
          getLotteryDrawData()
        }, 2000)
      }
    }
  }
</script>
<style lang="less" scoped>
  .lottery-timer-wrapper {
    width: 100%;
    position: relative;
    .timer-container {
      height: 100%;
      overflow: hidden;
      padding: 0 10px;
      .per-issue-wrapper {
        border-bottom: 1px dashed #dcdcdc;
        font-size: 13px;
        min-height: 46px;
        padding: 2px 0;
        overflow: hidden;
        .per-issue {
          text-align: center;
        }
      }
      .next-issue-wrapper {
        font-size: 13px;
        height: 36px;
        border-bottom: 1px dashed #dcdcdc;
        .next-issue {
          text-align: center;
        }
        .time {
          &.red {
            color: #d23747;
          }
        }
      }
    }
  }
</style>
