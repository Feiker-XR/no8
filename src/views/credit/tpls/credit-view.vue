<template>
  <div class="content-wrapper">
    <!---开奖及倒计时--->
    <lottery-timer ref="drawTimer"></lottery-timer>
    <!--推荐、收藏、开奖历史-->
    <game-collecting @on-show="onCollectingShow"
      @on-hide="onCollectingHide">
    </game-collecting>
    <!--快速切换区-->
    <quick-tab :tabList="tabs"
      @tabchanged="tabChanged">
    </quick-tab>
    <!--投注选项区-->
    <component :is="comp"
      :showLeftSide="showLeftSide"
      :listData="lists"
      :sidebar="menus"
      @ballCheck="ballCheck"
      :changeTab="changeTab"
      :confirm="isConfirm"
      :collecting="collecting">
    </component>
    <!--投注按钮等--->
    <foot-bars @cleanAll="cleanAll"
      :cleanInput="cleanInput"
      @showDetail="showDetail"
      :lotteryRateIsReady="lotteryRateIsReady">
    </foot-bars>
  </div>
</template>

<script>
  import LotteryTimer from 'components/credit-lottery-timer/credit-lottery-timer'
  import FootBars from 'components/credit-foot-bars/credit-foot-bars'
  import GameCollecting from 'components/game-collecting/game-collecting'
  import BetDefault from './bet-area/credit-bet-default'
  import BetK3 from './bet-area/credit-bet-k3'
  import BetPK10 from './bet-area/credit-bet-pk10'
  import QuickTab from '@/components/base/quickTab/quickTab'
  import { mapActions, mapMutations, mapGetters } from 'vuex'
  import { queryOddsByCode } from 'api/credit/credit'
  export default {
    components: {
      LotteryTimer,
      FootBars,
      GameCollecting,
      BetDefault,
      BetK3,
      BetPK10,
      QuickTab
    },
    data () {
      return {
        lotteryRateIsReady: false,  // 是否获取到赔率数据
        collecting: false,  //
        isConfirm: false,  // 删除对象后再检查
        viewM: typeof this.dataObject.viewM !== 'undefined' ? this.dataObject.viewM : {},          // 模型对象
        lists: {            // 默认渲染数据(保留，否则报错)
          x: {
            name: '--',
            sz: [],
            dxds: []
          }
        },
        cleanInput: false,  // 通知清理input值
        defaultPlay: typeof this.dataObject.defaultPlay !== 'undefined' ? this.dataObject.defaultPlay : 'kj',  // 默认快捷玩法
        showLeftSide: this.dataObject.showLeftSide,   // 是否显示左边栏
        menus: this.dataObject.menus,   // 左侧菜单
        tabs: this.dataObject.tabs,      // 顶部菜单
        comp: BetDefault,    // 默认组件
        resetScroll: true
      }
    },
    props: {
      betSuceess: { // 投注成功后清除选择的球
        type: Boolean
      },
      dataObject: {   // 配置文件的数据
        type: Object
      }
    },
    created () {    // 獲取賠率
      let groupCode = this.$route.params.groupCode
      if (groupCode === 'k3') {
        this.comp = BetK3
      } else if (groupCode === 'pk10') {
        this.comp = BetPK10
      }
      this.getLotteryRates()
    },
    mounted () {  // 更新定時器等
      this._initParams()
    },
    computed: {
      ...mapGetters([
        'betIdsList',
        'userMenuList',
        'inputAmount',  // 投注金额
        'betList',      // 预投注篮
        'lotteryGroupCode',   // 组号
        'lotteryGroupId',   // 组id
        'lotteryId',    // 彩种id
        'lotteryCode',  // 彩种代号
        'headerTitle'   // 标题
      ]),
      height () {
        return this.collecting ? `${window.innerHeight - 357}px` : `${window.innerHeight - 216}px`
      }
    },
    methods: {
      ...mapActions([
        'selectBet'
      ]),
      ...mapMutations({
        setHeaderTitle: 'SET_HEADER_TITLE',
        setLotteryId: 'SET_LOTTERY_ID',
        setLotteryCode: 'SET_LOTTERY_CODE',
        setLotteryName: 'SET_LOTTERY_NAME',
        setGroupId: 'SET_LOTTERY_GROUP_ID',
        setGroupCode: 'SET_LOTTERY_GROUP_CODE',
        setLotteryRule: 'SET_LOTTERY_RULE',
        setStopSell: 'SET_STOP_SELL',
        setStopBet: 'SET_STOP_BET',
        setBetData: 'SET_BET_DATA'
      }),
      ...mapMutations([
        'updateLoadingStatus'
      ]),
      onCollectingShow (item) {
        this.collecting = true
      },
      onCollectingHide (item) {
        this.collecting = false
      },
      showDetail () {
        this.isConfirm = !this.isConfirm
      },
      getLotteryRates () {    // 获取赔率
        let _this = this
        let _gameCode = this.$route.params.gameCode
        // 生成模型对象
        let _json = require('../../../../static/json/' + this.$route.params.groupCode + '.json')
        this.setViewModel(_json)
        // setTimeout(() => {   // 测试延时
        if (sessionStorage.getItem('_lottery_rates_' + _gameCode)) {
          this.lotteryRateIsReady = true
          console.log('_____信用赔率 from sessionStorage')
          _this.viewM = JSON.parse(sessionStorage.getItem('_lottery_rates_' + _gameCode))
          _this.tabChanged(_this.defaultPlay)
        } else {
          queryOddsByCode({
            gameCode: _gameCode
          }).then(response => {
            if (response.currentStatus === 2) { // 没有获取到赔率的错误信息
              alert(response.errorInformation.errCode)
            } else {
              this.lotteryRateIsReady = true
              console.log('_____信用赔率 from 接口: ')
              this.setViewModel(response.currentData)
              sessionStorage.setItem('_lottery_rates_' + _gameCode, JSON.stringify(_this.viewM))
            }
          })
        }
        // }, 5000)
      },
      setViewModel (res) {
        let _this = this
        let groupCode = this.$route.params.groupCode
        let { filterData, generateMap } = require('../' + groupCode + '/' + groupCode + '.js')  // 运用工具函数
        let result = filterData(res, _this)
        generateMap(result, _this)
        _this.tabChanged(_this.defaultPlay)
      },
      ballCheck (arr) {     // 选球逻辑
        let _list = []
        let _this = this
        let _amount = this.inputAmount
        let _onlyDronOrTiger = []    // 没有龙虎位, 0表示选择了其他，1表示选择了龙虎
        for (let key in this.viewM) {
          let isKJ = false
          if (key === 'kj') {   // 快捷选择
            isKJ = true
          }
          for (let _key in this.viewM[key]) {
            for (let __key in this.viewM[key][_key]) {
              let _array = this.viewM[key][_key][__key]
              if (Array.isArray(_array)) {
                _array.map(function (item) {
                  if (item.choosen) {
                    if (isKJ) {
                      let sub = item.showCode.split('-')[1]
                      let isDronOrTiger = (sub === 'dragon' || sub === 'tiger')
                      arr.map(function (_item) {
                        if (_this.lotteryGroupCode === 'pk10' && Number(_item) >= 6 && isDronOrTiger) {    // pk10 第六到十位没有龙虎
                          if (_onlyDronOrTiger.indexOf(1) === -1) {
                            _onlyDronOrTiger.push(1)
                          }
                        } else if (_this.lotteryGroupCode === 'klsf' && Number(_item) >= 5 && isDronOrTiger) { // 快乐十分 第四到八位没有龙虎
                          if (_onlyDronOrTiger.indexOf(1) === -1) {
                            _onlyDronOrTiger.push(1)
                          }
                        } else {
                          if (_onlyDronOrTiger.indexOf(0) === -1) {
                            _onlyDronOrTiger.push(0)
                          }
                          let _showCode = typeof item.showCode.split('-')[1] === 'undefined' ? item.showCode : _item + '-' + item.showCode.split('-')[1]
                          _list.push({
                            showCode: _showCode,
                            odds: item.odds,
                            amount: _amount,
                            displayName: item.displayName
                          })
                        }
                      })
                    } else {
                      _list.push({
                        showCode: item.showCode,
                        odds: item.odds,
                        amount: _amount,
                        displayName: item.displayName
                      })
                    }
                  }
                })
              }
            }
          }
        }
        // console.log(_list)
        if (_onlyDronOrTiger.length === 1 && _onlyDronOrTiger[0] === 1) { // 选择了，但是不符合标准
          _list = [{}]
        }
        this.setBetData(_list)
      },      // 点击球检查
      cleanAll: function () {
        for (let key in this.viewM) {
          for (let _key in this.viewM[key]) {
            for (let __key in this.viewM[key][_key]) {
              var _array = this.viewM[key][_key][__key]
              if (Array.isArray(_array)) {
                _array.map(function (item) {
                  if (item.choosen) {
                    item.choosen = false
                  }
                })
              }
            }
          }
        }
        // 清除左邊栏
        this.menus.map((item, index) => {
          item.choosen = false
        })
      },  // 清除选择
      tabChanged (key) {
        this.showLeftSide = key === 'kj'
        this.lists = this.viewM[key]
        this.changeTab = !this.changeTab
      }, // 导航切换
      isStopSell (pGroupCode, pGameCode) {
        const _this = this
        const obj = {
          isStopSell: false,
          ruleContent: ''
        }
        if (_this.menuList && _this.menuList.length > 0) {
          for (let x = 0; x < _this.menuList.length; x++) {
            const {typeCode, children} = _this.menuList[x]
            if (typeCode === pGroupCode && children && children.length > 0) {
              for (let y = 0; y < children.length; y++) {
                const {gameCode, removed, lotteryText} = children[y]
                if (gameCode === pGameCode) {
                  obj.isStopSell = removed === 1
                  obj.ruleContent = lotteryText
                  break
                }
              }
              break
            }
          }
        }
        return obj
      },
      _initParams () {
        console.log(`_____————信用 获取倒计时等 : ${this.lotteryCode} _initParams`)
        this.setStopBet({stopBet: false})
        const obj = this.isStopSell(this.lotteryGroupCode, this.lotteryCode)
        this.setStopSell({stopSell: obj.isStopSell})
        this.setLotteryRule(obj.ruleContent)
        this.$refs['drawTimer']._initTimer({
          lotteryGroupId: this.lotteryGroupId,
          lotteryId: this.lotteryId,
          stopSell: obj.isStopSell
        })
      }
    },
    watch: {
      betSuceess (newData, oldData) {    // 当投注成功时，清除所有选项
        this.cleanInput = !this.cleanInput
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
