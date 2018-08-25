<template>
  <popover ref="popover" class="drop-down-menu" :placement="'bottom'" @on-show="onShow" @on-hide="onHide">
    <x-icon type="ios-gear-outline" size="30" style="fill:#fff;"></x-icon>
    <div slot="content" class="drop-down-menu__content">
      <ul>
        <li class="popover-li" @click.prevent="openGameRuleDialog">
          <span class="popover-li-a"><img src="./rules.svg"/>游戏规则</span>
        </li>
        <li class="popover-li" @click.prevent="routerBetRecord">
          <span class="popover-li-a"><img src="./history.svg"/>投注记录</span>
        </li>
        <li class="popover-li" @click.prevent="routerDrawHis">
          <span class="popover-li-a"><img src="./drawHis.svg"/>开奖历史</span>
        </li>
        <li class="popover-li" @click.prevent="routerPanInfo">
          <span class="popover-li-a"><img src="./message.svg"/>盘口信息</span>
        </li>
        <li class="popover-li" v-if="showLuzhuLong" style="font-size: 10px;">
          <span class="popover-li-a" @click.prevent="$emit('onShowPopup')"><img src="./changlong.svg"/>路珠/两面长龙</span>
        </li>
        <li class="popover-li" @click.prevent="routerTodayTotalWin" style="height: 47px;">
          <span class="popover-li-a">
            <img src="./today.svg"/>今天输赢
            <i v-if="!isLoading">{{todayWinAmount}}</i>
            <i v-else><spinner type="ios-small" size="20px"></spinner></i>
          </span>
        </li>
        <li class="popover-li" @click.prevent="routerCurrentBet" style="height: 47px">
          <span class="popover-li-a">
            <img src="./realtime.svg"/>即时注单
            <i v-if="!isLoading">{{currentBetAmount}}</i>
            <i v-else><spinner type="ios-small" size="20px"></spinner></i>
          </span>
        </li>
        <li class="popover-li" v-if="showDrawChart" @click.prevent="routerChart">
          <span class="popover-li-a"><img src="./chart.svg"/>号码走势</span>
        </li>
      </ul>
    </div>
  </popover>
</template>

<script>
  import Popover from 'components/base/popover/popover'
  import { mapGetters } from 'vuex'
  import { getTodayTotalWin } from 'api/credit/credit'
  import { ERR_OK } from '@/assets/const/config'
  import { Spinner } from 'vux'
  export default {
    components: {Popover, Spinner},
    data () {
      return {
        isLoading: true,
        todayWinAmount: '0.00',
        currentBetAmount: '0.00'
      }
    },
    computed: {
      showLuzhuLong () {
        return ['c11x5', 'pk10', 'ssc', 'klsf'].some(item => this.lotteryGroupCode === item)
      },
      showDrawChart () {
        return ['c11x5', 'ssl', 'ssc', 'pk10', 'k3'].some(item => this.lotteryGroupCode === item)
      },
      ...mapGetters([
        'lotteryGroupCode',
        'lotteryCode',
        'lotteryName',
        'lotteryId'
      ])
    },
    methods: {
      onShow () {
        this.todayWinAmount = '0.00'
        this.currentBetAmount = '0.00'
        this.isLoading = true
        getTodayTotalWin().then(response => {
          const {currentStatus, currentData} = response
          if (currentStatus === ERR_OK) {
            this.isLoading = false
            const {total} = currentData
            if (total) {
              this.todayWinAmount = parseFloat(total.winOrLoseTotal).toFixed(2)
              this.currentBetAmount = parseFloat(total.currentTotal).toFixed(2)
            }
          }
        }).catch(() => {})
        this.$emit('onToggle', true)
      },
      onHide () {
        this.$emit('onToggle', false)
      },
      openGameRuleDialog () {
        this.$emit('onRuleClick')
      },
      routerBetRecord () {
        this.routerControl({path: '/credit/betRecord'})
      },
      routerDrawHis () {
        this.routerControl({path: `/credit/drawHistory/${this.lotteryGroupCode}/${this.lotteryCode}/${this.lotteryId}`})
      },
      routerPanInfo () {
        this.routerControl({path: `/credit/panInfo/${this.lotteryGroupCode}/${this.lotteryCode}/${this.lotteryId}`})
      },
      routerTodayTotalWin () {
        this.routerControl({path: '/credit/todayTotalWin'})
      },
      routerCurrentBet () {
        this.routerControl({path: '/credit/instantBetting'})
      },
      routerChart () {
        this.routerControl({path: `/credit/trendChart/${this.lotteryGroupCode}/${this.lotteryName}/${this.lotteryId}`})
      },
      routerControl (router) {
        this.$router.push(router)
        this.closeMenusPopup()
      },
      closeMenusPopup () {
        this.$refs.popover.onClickedOutside()
      }
    }
  }
</script>

<style lang="less">
  .drop-down-menu {
    margin-top: -5px;
    .drop-down-menu__content {
      ul {
        list-style: none;
        text-align: left;
        font-size: 14px;
        padding: 0 10px;
        li {
          box-sizing: content-box;
          padding: 5px 0;
          & + li {
            border-top: 1px solid #e4e4e4;
          }
          span {
            font-family: 'Microsoft YaHei';
            display: block !important;
            padding: 3px 5px 3px 5px;
            float: none !important;
            width: 100%;
            font-weight: bold;
            display: block;
            text-align: left;
            img {
              vertical-align: text-bottom;
              margin-right: 10px;
              height: 18px;
              width: 18px;
            }
            i {
              display: block;
              color: #da3e4c;
              text-indent: 30px;
              font-size: 14px;
              font-weight: 400;
            }
          }
        }
      }
    }
  }
</style>
