<template>
  <div class="lottery-timer-wrapper">
    <div class="timer-container">
      <flexbox class="per-issue-wrapper ">
        <flexbox-item :span="3">
          <div class="per-issue">{{preIssue}}</div>
        </flexbox-item>
        <flexbox-item>
          <lottery-draw-balls :loading="isLoading" :balls="drawBalls"
            :groupCode="lotteryGroupCode"></lottery-draw-balls>
          <lottery-draw-balls :loading="isLoading" :statistics="drawStatistics"
            :groupCode="lotteryGroupCode"></lottery-draw-balls>
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
  import { Flexbox, FlexboxItem } from 'vux'
  import LotteryDrawBalls from 'components/lottery-draw-balls/lottery-draw-balls'
  import { mapGetters, mapMutations } from 'vuex'
  import { getLotterysInfo, getLotteryDraw } from 'api/credit/credit'
  import { ERR_OK } from '@/assets/const/config'
  import { getPerIssue, isNumber, parseDrawResult } from '@/assets/scripts/util'
  export default {
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
        betEndIsRuning: false
      }
    },
    components: {
      Flexbox,
      FlexboxItem,
      LotteryDrawBalls
    },
    computed: {
      ...mapGetters([
        'lotteryId',
        'lotteryGroupId',
        'lotteryGroupCode',
        'lotteryCode'
      ])
    },
    beforeDestroy () {
      this._timerClear()
    },
    methods: {
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
      _initTimer ({stopSell}) {
        this.reset()
        this._timerClear()
        this._fetchDrawInfo(stopSell)
      },
      _fetchDrawInfo (stopSell) {
        const _this = this
        console.log(`credit Timer : ${_this.lotteryCode}`)
        getLotterysInfo({lotteryGroupId: _this.lotteryGroupId, gameId: _this.lotteryId}).then(response => {
          const {currentStatus, currentData} = response
          if (currentStatus === ERR_OK && currentData.length) {
            for (let i = 0; i < currentData.length; i++) {
              const {lotteryGameId, nextLotteryTime, nextGameResultNum, openResultNum, openTimeType, openLotteryTime} = currentData[i]
              if (Number(lotteryGameId) === Number(_this.lotteryId)) {
                _this.setIssue(lotteryGameId, nextGameResultNum, openResultNum, openTimeType)
                if (_this.isStopSell(nextLotteryTime, openLotteryTime) && !stopSell) {
                  // console.log(`nextLotteryTime:${nextLotteryTime}`, `openLotteryTime:${openLotteryTime}`)
                  if (nextLotteryTime > 0) {
                    setTimeout(() => {    // 因为是下一秒才执行的
                      _this.setStopBet({stopBet: false})
                    }, 1000)
                  }
                  _this.timerStart(nextLotteryTime, openLotteryTime)
                  break
                } else {
                  _this.$timer.stop()
                  _this.betEndTime = '已停售'
                  _this.drawEndTime = '已停售'
                  _this.setStopSell({stopSell: true})
                  _this.setTimerTime({time: '已停售'})
                }
                break
              }
            }
          }
        }).catch(error => {
          console.log(error)
        })
      },
      timerStart: function (nextLotteryTime, openLotteryTime) {
        const _this = this
        _this.$timer.on('onBetEnd', () => {   // 投注倒计时到
          _this.betEndIsRuning = false
          _this.betEndTime = '已封盘'
          _this.setStopBet({stopBet: true})
          _this.setTimerTime({time: '已封盘'})
        })
        _this.$timer.on('onDrawEnd', () => {  // 开奖倒计时到
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
      setIssue: function (lotteryGameId, nextGameResultNum, openResultNum, issueType) {
        if (nextGameResultNum && isNumber(nextGameResultNum) && openResultNum && issueType) {
          const preIssue = getPerIssue(nextGameResultNum, openResultNum, issueType)
          this.preIssue = preIssue
          this.nextIssue = nextGameResultNum
          this.setPreIssue({issue: preIssue})
          this.setNextIssue({issue: nextGameResultNum})
          this.startGetLotteryData(lotteryGameId, preIssue)
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
      startGetLotteryData: function (lotteryGameId, lotteryResultNum) {
        const _this = this
        _this._loading()
        const query = Object.assign({}, {lotteryGameId, lotteryResultNum})
        _this._clearGetDataTimer()
        function getLotteryDrawData () {
          // console.log(`___________获取开奖信息:${_this.lotteryCode}`)
          getLotteryDraw(query).then(res => {
            const {currentStatus, currentData} = res
            if (currentStatus === 0 && currentData) {
              const {gameResult} = currentData
              _this.drawStatistics = currentData.lotteryStatistics.split(',')
              if (gameResult) {
                _this.isLoading = false
                _this._clearGetDataTimer()
                _this.setDrawBalls(gameResult.split(','))
              }
            }
          }).catch(() => {

          })
        }

        _this.interValTimerId = setInterval(function () {
          getLotteryDrawData()
        }, 2000)
      },
      ...mapMutations({
        setStopBet: 'SET_STOP_BET',
        setTimerTime: 'SET_TIMER_TIME',
        setPreIssue: 'SET_PRE_ISSUE',
        setNextIssue: 'SET_NEXT_ISSUE',
        setStopSell: 'SET_STOP_SELL'
      })
    }
  }
</script>
<style lang="less" scoped>
  .lottery-timer-wrapper {
    width: 100%;
    position: relative;
    min-height: 88px;
    .timer-container {
      height: 100%;
      overflow: hidden;
      padding: 0 10px;
      .per-issue-wrapper {
        border-bottom: 1px dashed #dcdcdc;
        font-size: 13px;
        font-size: 0.8125rem;
        /*color: #606060;*/
        min-height: 46px;
        /*height: 46px;*/
        padding: 2px 0;
        overflow: hidden;
        .per-issue {
          text-align: center;
          color: #d53b4e;
        }
      }
      .next-issue-wrapper {
        font-size: 13px;
        font-size: 0.8125rem;
        color: #606060;
        height: 36px;
        border-bottom: 1px dashed #dcdcdc;
        .next-issue {
          text-align: center;
          color: #d53b4e;
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
