<template>
  <div class="content-wrapper">
    <!--倒计时 开奖等-->
    <official-lottery-timer :name="'ssc'" ref="timer"></official-lottery-timer>
    <!--推荐、收藏、开奖历史等--->
    <game-collecting @on-show="onCollectingShow"
                     @on-hide="onCollectingHide">
    </game-collecting>
    <flexbox :gutter="0" :align="'flex-start'" class="content" :class="{border: collecting}">
      <flexbox-item :span="3">
        <scroller lock-x
                  scrollbar-y
                  class="lottery-plays-scroll"
                  :height="collecting?'-357px': '-250px'">  <!--- -357px  -258px---->
          <ul>
            <li v-for="(item, index) in playList"
              :class="{active:playIndex===index}"
              @click="handleRouter(item,index)">
              {{item.name}}
            </li>
          </ul>
        </scroller>
      </flexbox-item>
      <flexbox-item :span="9">
        <div class="lazy-load">
          <transition name="slide">
            <!--<router-view :key="childRoute" :bouns="bouns"></router-view>-->
            <official-bet-area :key="childRoute"
                               :dataObject="childs"
                               :bouns="bouns"
                               :collecting="collecting">
            </official-bet-area>
          </transition>
        </div>
      </flexbox-item>
    </flexbox>
    <official-foot-bars ></official-foot-bars>
  </div>
</template>

<script>
  import {
    Flexbox,
    XButton,
    Group,
    FlexboxItem,
    SwiperItem,
    Scroller,
    Spinner,
    Tab,
    TabItem,
    Checker,
    CheckerItem,
    XTextarea
  } from 'vux'
  import OfficialLotteryTimer from 'components/official-lottery-timer/official-lottery-timer'
  import FootBars from 'components/credit-foot-bars/credit-foot-bars'
  import GameCollecting from 'components/game-collecting/game-collecting'
  import OfficialFootBars from 'components/official-foot-bars/official-foot-bars'
  import {mapGetters} from 'vuex'
  import { getProxyPlayList } from 'api/official/official'
  import {ERR_OK} from '@/assets/const/config'
  import OfficialBetArea from './official-bet'

  export default {
    data () {
      return {
        playList: [],
        list2: [],
        selected: '',
        collecting: false,
        childRoute: true,  // 子路由切换更新key
        lottery: {
          gameName: '',
          gameCode: ''
        },
        playIndex: 0,
        digitCheckbox: [],
        inputNumber: null,
        bouns: [], // 赔率
        childs: {}
      }
    },
    components: {
      SwiperItem,
      Flexbox,
      FlexboxItem,
      OfficialLotteryTimer,
      FootBars,
      Scroller,
      Spinner,
      GameCollecting,
      Tab,
      TabItem,
      Checker,
      CheckerItem,
      XTextarea,
      Group,
      XButton,
      OfficialFootBars,
      OfficialBetArea
    },
    computed: {
      ...mapGetters([
        'lotteryCode',
        'lotteryName',
        'lotteryGroupCode'
      ])
    },
    created () {
      let menu = require('../' + this.lotteryGroupCode + '/' + this.lotteryGroupCode + '.json')
      this.playList = menu
      this.handleRouter(menu[0], 0)   // 默认调用
      // 获取赔率
      getProxyPlayList({gameCode: this.lotteryCode}).then((res) => {
        let {currentStatus, currentData} = res
        if (currentStatus === ERR_OK) {
          this.bouns = currentData
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    mounted () {
      this.$init()
    },
    methods: {
      $init () {
        this.$refs.timer.$init(this.lotteryCode, false)
      },
      updatePlay (playMethod) {
        this.playList.forEach((item, index) => {
          if (item.code === playMethod) {
            this.handleRouter(item, index)
          }
        })
      },
      handleRouter (item, index) {
        this.childs = require('../' + this.lotteryGroupCode + '/conf/' + item.code + '.json')
        this.playIndex = index
        this.childRoute = !this.childRoute    // 更新路由
      },
      onCollectingShow () {
        this.collecting = true
      },
      onCollectingHide () {
        this.collecting = false
      }
    },
    beforeRouteEnter (to, from, next) { // 只初始化一次
      if (!from.path) return false
      next(vm => {
        vm.$init()
      })
    }
  }
</script>

<style lang="less" scoped>
  @import "official";
  .slide-enter {
    transform: translate3d(100%,0,0);
    opacity: 0;
  }
  .slide-enter-active {
    transition: all .2s ease;
  }
</style>
