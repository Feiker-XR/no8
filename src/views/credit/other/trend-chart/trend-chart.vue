<template>
  <div class="trend-chart">
    <tab :line-width=2 :scroll-threshold="6" active-color='#e3363a' v-model="index">
      <tab-item class="vux-center" :selected="tabList === item" v-for="(item, index) in tabList" @click="tabList = item"
                :key="index">{{item}}
      </tab-item>
    </tab>

    <p style="text-align:center;" v-if="Loading">
      <br/>
      <span style="vertical-align:middle;display:inline-block;font-size:14px;">加载中&nbsp;&nbsp;</span>
      <inline-loading></inline-loading>
    </p>
    <swiper @on-index-change="onSwiperItemIndexChange" v-if="!Loading" v-model="index" :height="height"
            :show-dots="false"
            :disableTouch="true">
      <swiper-item>
        <scroller ref="scroller0" height="-82px" :bounce="false" lock-x scrollbar-y>
          <div class="trend_wrap cf">
            <ul>
              <li>&nbsp;</li>
              <li v-for="(item, index) in lotteryResultNum" :key="index">{{item}}期</li>
            </ul>
            <div class="trend_con">
              <div class="trend_list">
                <ul>
                  <li>开奖号码</li>
                  <li :class="{is_pk10 : isPk10}" v-for="(items, index) in lotteryNumber" :key="index">
                    <span v-for="(item, index) in items" :key="index">{{item}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </scroller>
      </swiper-item>
      <swiper-item v-for="(items, i) in missTimes" :key="i">
        <scroller ref="scroller" height="-82px" lock-x :bounce="false" scrollbar-y>
          <div class="trend_wrap cf">
            <ul>
              <li>&nbsp;</li>
              <li v-for="(item, index) in lotteryResultNum" :key="index">{{item}}期</li>
            </ul>
            <div class="trend_con">
              <div class="trend_list" ref="trendList">
                <table>
                  <thead>
                  <tr>
                    <td v-for="(item, index) in missTimesTitle" :key="index">
                      {{ gameTypeCode === 'c11x5' || gameTypeCode === 'k3' || gameTypeCode === 'pk10' ? index + 1 : index
                      }}
                    </td>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(items, index) in items" :key="index">
                    <td v-for="(item, index) in items" :key="index">
                      <div v-if="item" ref="omitShow"><span>{{item}}</span></div>
                      <div v-else class="num">{{index.slice(2)}}</div>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </scroller>
      </swiper-item>
    </swiper>
    <!-- 配置弹窗 -->
    <div v-transfer-dom>
      <confirm
        class="k-confirm"
        v-model="config.isShow"
        @on-cancel="onCancel"
        @on-confirm="onConfirm">
        <h3>走势图设置</h3>
        <div class="config-bx">
          <div class="config-bx-card">
            <label>期数：</label>
            <checker
              v-model="config.dataNum"
              radio-required
              default-item-class="config-item"
              selected-item-class="config-item-selected">
              <checker-item :value=30>
                <check-icon>近30期</check-icon>
              </checker-item>
              <checker-item :value=50>
                <check-icon>近50期</check-icon>
              </checker-item>
              <checker-item :value=100>
                <check-icon>近100期</check-icon>
              </checker-item>
              <checker-item :value=200>
                <check-icon>近200期</check-icon>
              </checker-item>
            </checker>
          </div>
          <div class="config-bx-card">
            <label>折线：</label>
            <checker
              v-model="config.polyline"
              radio-required
              default-item-class="config-item"
              selected-item-class="config-item-selected">
              <checker-item :value=1>
                <check-icon>显示折线</check-icon>
              </checker-item>
              <checker-item :value=0>
                <check-icon>隐藏折线</check-icon>
              </checker-item>
            </checker>
          </div>
          <div class="config-bx-card">
            <label>遗漏：</label>
            <checker
              v-model="config.omit"
              radio-required
              default-item-class="config-item"
              selected-item-class="config-item-selected">
              <checker-item :value=1>
                <check-icon>显示遗漏</check-icon>
              </checker-item>
              <checker-item :value=0>
                <check-icon>隐藏遗漏</check-icon>
              </checker-item>
            </checker>
          </div>
        </div>
      </confirm>
    </div>
  </div>
</template>

<script>
  import {
    Tab,
    TabItem,
    SwiperItem,
    Scroller,
    InlineLoading,
    Confirm,
    Checker,
    CheckerItem,
    CheckIcon,
    TransferDomDirective as TransferDom
  } from 'vux'
  import Swiper from 'components/base/swiper/swiper.vue'
  import { mapGetters, mapMutations } from 'vuex'
  import { getHistoryChartList } from 'api/common'
  import { offset } from '@/assets/scripts/util'
  export default {
    name: 'TrendChart',
    directives: {
      TransferDom
    },
    components: {
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
      Scroller,
      InlineLoading,
      Confirm,
      Checker,
      CheckerItem,
      CheckIcon
    },
    data () {
      return {
        index: 0,
        Loading: true,
        tabList: ['号码', '万位', '千位', '百位', '十位', '个位'],
        lotteryResultNum: [],
        lotteryNumber: [],
        lotteryName: [],
        missTimesTitle: [],
        missTimes: [[], [], [], [], []],
        config: {
          isShow: false,
          dataNum: 30,
          polyline: 1,
          omit: 1
        },
        gameTypeCode: '',
        gameCode: '',
        query: {
          lotteryGameId: '',
          recentIssues: 30
        }
      }
    },
    computed: {
      isPk10 () {
        return this.gameTypeCode === 'pk10'
      },
      ...mapGetters([
        'chartConfigVisible'
      ]),
      height () {
        return `${window.innerHeight - 81}px`
      }
    },
    watch: {
      chartConfigVisible (val) {
        this.config.isShow = val
      }
    },
    created () {
      // 判断是不是tab页的历史开奖
      if (this.$route.params.gameTypeCode === undefined) {
        this.initData(this.$route.params)
      }
    },
    methods: {
      initData (option) {
        this.setOptions(option)
      },
      setOptions (option) {
        const {gameTypeCode, gameName, gameId} = option
        this.gameTypeCode = gameTypeCode
        this.lotteryName = gameName
        this.query.lotteryGameId = gameId
        this.query.typeCode = gameTypeCode

        // 判断是不是tab页的历史开奖
        if (gameTypeCode !== undefined) {
          this.setHeaderTitle(`${gameName} - 号码走势`)
        }
        this.getChartData(this.config)
      },
      getChartData (config) {
        this.query.recentIssues = config.dataNum
        getHistoryChartList(this.query).then(res => {
          this.Loading = false
          const {currentStatus, currentData} = res
          if (currentStatus === 0) {
            const tenThousand = []
            const thousand = []
            const hundreds = []
            const tens = []
            const ones = []
            const sixth = []
            const seventh = []
            const eighth = []
            const nineth = []
            const tenth = []
            this.missTimes = []
            this.lotteryResultNum = []
            this.lotteryNumber = []
            currentData.forEach(val => {
              this.lotteryResultNum.push(val.lotteryResultNum)
              this.lotteryNumber.push(val.lotteryNumber.split(','))
              tenThousand.push(val.missTimes.b_0)
              thousand.push(val.missTimes.b_1)
              hundreds.push(val.missTimes.b_2)
              tens.push(val.missTimes.b_3)
              ones.push(val.missTimes.b_4)
              sixth.push(val.missTimes.b_5)
              seventh.push(val.missTimes.b_6)
              eighth.push(val.missTimes.b_7)
              nineth.push(val.missTimes.b_8)
              tenth.push(val.missTimes.b_9)
            })

            if (this.gameTypeCode === 'ssl' || this.gameTypeCode === 'k3') {
              this.tabList = ['号码', '百位', '十位', '个位']
              this.missTimes.push(tenThousand)
              this.missTimes.push(thousand)
              this.missTimes.push(hundreds)
            } else if (this.gameTypeCode === 'pk10') {
              this.tabList = ['号码', '冠军', '亚军', '第三名', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名']
              this.missTimes.push(tenThousand)
              this.missTimes.push(thousand)
              this.missTimes.push(hundreds)
              this.missTimes.push(tens)
              this.missTimes.push(ones)
              this.missTimes.push(sixth)
              this.missTimes.push(seventh)
              this.missTimes.push(eighth)
              this.missTimes.push(nineth)
              this.missTimes.push(tenth)
            } else {
              this.missTimes.push(tenThousand)
              this.missTimes.push(thousand)
              this.missTimes.push(hundreds)
              this.missTimes.push(tens)
              this.missTimes.push(ones)
            }
            this.missTimesTitle = Object.keys(tenThousand[0])
            if (config.polyline) {
              this.$nextTick(() => {
                const trendList = this.$refs.trendList
                this.trendLine(trendList, 'red')
              })
            }
            if (!config.omit) {
              this.$nextTick(() => {
                const target = this.$refs.omitShow
                if (target && target.length) {
                  target.forEach(val => {
                    val.style.display = 'none'
                  })
                }
              })
            }
          }
        })
      },
      onConfirm () {
        this.Loading = true
        this.getChartData(this.config)
        this.setChartConfigVisible({visible: false})
      },
      onCancel () {
        this.setChartConfigVisible({visible: false})
      },
      onSwiperItemIndexChange () {
        if (this.$refs.scroller0 && this.$refs.scroller.length > 0) {
          this.$refs.scroller0.reset({top: 0})
          this.$refs.scroller.forEach(val => {
            val.reset({top: 0})
          })
        }
      },
      // 走势图折线
      trendLine (val, color) {
        val.forEach(obj => {
          const left = parseInt(offset(obj).left)
          const top = parseInt(offset(obj).top)
          const width = obj.offsetWidth
          const height = obj.offsetHeight
          const arr = []
          const canvas = document.createElement('canvas')
          const divNum = [...obj.querySelectorAll('div.num')]
          canvas.setAttribute('style', 'position:absolute;top:0;left:0')
          canvas.width = width
          canvas.height = height
          divNum.forEach((e, i) => {
            const lineTo = {}
            const moveTo = {}
            if (i !== 0) {
              // lineTo
              if (e.innerText / 1 > divNum[i - 1].innerText / 1) {
                lineTo.left = parseInt(offset(e).left) - left
                lineTo.top =
                  parseInt(offset(e).top) -
                  top +
                  parseInt(e.offsetHeight / 2) -
                  4
              } else if (e.innerText / 1 === divNum[i - 1].innerText / 1) {
                lineTo.left =
                  parseInt(offset(e).left) - left + parseInt(e.offsetWidth / 2)
                lineTo.top = parseInt(offset(e).top) - top
              } else {
                lineTo.left =
                  parseInt(offset(e).left) - left + parseInt(e.offsetWidth)
                lineTo.top =
                  parseInt(offset(e).top) -
                  top +
                  parseInt(e.offsetHeight / 2) -
                  4
              }
              arr.push(lineTo)
            }
            if (i + 1 < divNum.length) {
              // moveTo
              if (e.innerText / 1 < divNum[i + 1].innerText / 1) {
                moveTo.left =
                  parseInt(offset(e).left) - left + parseInt(e.offsetWidth)
                moveTo.top =
                  parseInt(offset(e).top) -
                  top +
                  parseInt(e.offsetHeight / 2) +
                  4
              } else if (e.innerText / 1 === divNum[i + 1].innerText / 1) {
                moveTo.left =
                  parseInt(offset(e).left) - left + parseInt(e.offsetWidth / 2)
                moveTo.top =
                  parseInt(offset(e).top) - top + parseInt(e.offsetHeight)
              } else {
                moveTo.left = parseInt(offset(e).left) - left
                moveTo.top =
                  parseInt(offset(e).top) -
                  top +
                  parseInt(e.offsetHeight / 2) +
                  4
              }
              arr.push(moveTo)
            }
          })
          obj.parentNode.appendChild(canvas)
          let cxt = canvas.getContext('2d')
          cxt.strokeStyle = color
          arr.forEach((e, i) => {
            if (i % 2 === 0) {
              cxt.moveTo(e.left, e.top)
            } else {
              cxt.lineTo(e.left, e.top)
            }
          })
          cxt.stroke()
        })
      },
      ...mapMutations({
        setChartConfigVisible: 'TOGGLE_CHART_CONFIG_VISIBLE',
        setHeaderTitle: 'SET_HEADER_TITLE'
      })
    },
    beforeRouteEnter (to, from, next) {
      if (!from.path) return false
      next(vm => {
        vm.initData(to.params)
      })
    }
  }
</script>

<style>
  .vux-slider {
    height: 100%;
  }

  .config-item-selected .weui-icon-success {
    display: inline-block !important;
  }

  .config-item-selected .weui-icon-circle {
    display: none !important;
  }

  .k-confirm .weui-dialog__bd:first-child {
    padding: 0
  }

  .k-confirm .weui-dialog__bd {
    padding: 0;
  }

  .trend-chart .vux-tab-wrap {
    padding-top: 34px !important;
  }
</style>

<style scoped lang="less">
  @import '~vux/src/styles/center.less';

  ul,
  li {
    list-style-type: none;
  }

  .trend-chart {
    position: fixed;
    width: 100%;
    top: 46px;
    bottom: 0px;
    overflow: hidden;
    font-size: 14px;
  }

  .trend_wrap {
    padding-bottom: 45px;
    overflow: hidden;
  }

  .trend_wrap > ul {
    float: left;
    width: 25%;
    position: relative;
    z-index: 2;
  }

  .trend_wrap > ul li {
    border-top: 1px solid #d7d7d7;
    line-height: 30px;
    text-align: center;
    border-right: 2px solid #d7d7d7;
    position: relative;
  }

  .trend_wrap > ul li:nth-child(even) {
    background: #f2f2f2;
  }

  .trend_wrap > ul li::after {
    content: "";
    display: block;
    position: absolute;
    background: #d7d7d7;
    border-radius: 50%;
    height: 8px;
    width: 8px;
    right: -5px;
    top: 12px;
  }

  .trend_con {
    float: left;
    width: 75%;
    position: relative;
  }

  .trend_list {
    width: 100%;
  }

  .trend_list li {
    border-top: 1px solid #d7d7d7;
    line-height: 30px;
    padding-left: 10px;
  }

  .trend_list li:nth-child(even) {
    background: #f2f2f2;
  }

  .trend_list li span {
    display: inline-block;
    background: #e3363a;
    color: #fff;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    border-radius: 50%;
    margin-right: 8px;
  }

  .trend_list table {
    width: 100%;
  }

  .trend_list tr {
    line-height: 30px;
  }

  .trend_list tbody tr:nth-child(odd) {
    background: #f2f2f2;
  }

  .trend_list td {
    border: 1px solid #d7d7d7;
    text-align: center;
    border-left: none;
    min-width: 22px;
  }

  .trend_list tbody td div {
    width: 22px;
    line-height: 22px;
    display: inline-block;
    color: #bbb;
  }

  .trend_list tbody td div.num {
    border-radius: 50%;
    background: red;
    color: #fff;
  }

  .k-confirm {
    h3 {
      line-height: 45px;
      background: #ebebeb;
      text-align: center;
      border-bottom: 2px solid #e3363a;
      font-size: 20px;
    }
  }

  .config-bx-card {
    display: flex;
    text-align: left;
    line-height: 2.8;
    label {
      flex: 0 0 25%;
      text-align: right;
      line-height: 3;
    }
  }

  .k_pk10 {
    height: 61px;
    line-height: 61px !important;
  }

  .trend_list .is_pk10 {
    & > span {
      width: 18px;
      height: 18px;
      font-size: 12px;
      line-height: 18px;
    }
  }
</style>

