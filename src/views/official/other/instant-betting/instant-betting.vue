<template>
  <div>
    <scroller ref="scroller" lock-x scrollbar-y use-pulldown height="-81" style="top:0px;bottom: 35px"
              :pulldown-config="pulldownConfig"
              v-model="status"
              @on-pulldown-loading="handlePullDown">
      <x-table :cell-bordered="false" class="x-table-background">
        <thead>
        <tr>
          <th>彩种</th>
          <th>注单笔数</th>
          <th>下注金额</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, key, index) in lotteryMap" @click.stop="handleRouterDetail(item)">
          <td>{{item.gameName}}</td>
          <td>
            <span class="link" :class="{'red':item.betCount>0}">{{item.betCount}}</span>
          </td>
          <td>{{item.betAmount}}</td>
        </tr>
        </tbody>
      </x-table>
    </scroller>
    <div class="total-tool-bar">
      <ul>
        <li><span>当前注单笔数合计：</span><span>{{currentBettotal}}</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { XTable, Scroller } from 'vux'
  import { mapGetters, mapMutations } from 'vuex'
  import { getCurrentBet } from 'api/credit/credit'
  export default {
    name: 'CurrentBet',
    components: {XTable, Scroller},
    data () {
      return {
        dataList: [],
        status: {
          pulldownStatus: 'default'
        },
        pulldownConfig: {
          content: '下拉刷新',
          downContent: '下拉刷新',
          upContent: '释放刷新',
          loadingContent: '加载中...'
        },
        currentBettotal: 0
      }
    },
    computed: {
      lotteryMap () {
        let dataMap = {}
        this.userMenuList.forEach(item => {
          if (item.children && item.children.length > 0) {
            item.children.forEach(children => {
              if (children.removed === 0) {
                dataMap[children.gameCode] = {
                  gameId: children.gameId,
                  gameName: children.gameName,
                  betCount: '0',
                  betAmount: '0.00'
                }
              }
            })
          }
        })
        return dataMap
      },
      ...mapGetters([
        'userMenuList'
      ])
    },
    mounted () {
      this.getList()
    },
    filters: {},
    methods: {
      ...mapMutations({
        setHeaderTitle: 'SET_HEADER_TITLE'
      }),
      init () {
        this.setHeaderTitle('即时注单')
      },
      handlePullDown () {
        this.getList()
      },
      handleRouterDetail (item) {
        if (item.betCount > 0) {
          this.$router.push({path: `/credit/instantBetting/detail/${item.gameId}/${item.gameName}`})
        }
      },
      reset () {
        this.currentBettotal = 0
        Object.keys(this.lotteryMap).forEach(k => {
          this.lotteryMap[k].betAmount = '0.00'
          this.lotteryMap[k].betCount = '0'
        })
      },
      getList () {
        getCurrentBet({}).then(res => {
          this.status.pulldownStatus = 'default'
          const {currentStatus, currentData} = res
          if (currentStatus === 0 && currentData) {
            this.reset()
            const _this = this

            currentData.forEach(item => {
              _this.lotteryMap[item.gameCode].betCount = item.totalCount
              _this.lotteryMap[item.gameCode].betAmount = parseFloat(item.totalAmount).toFixed(2)
              _this.currentBettotal += item.totalCount
            })
          }
        }).catch(() => {
          this.status.pulldownStatus = 'default'
          this.$vux.toast.text('服务器繁忙', 'top')
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      if (!from.path) return false
      next(vm => {
        vm.init()
      })
    }
  }
</script>

<style scoped lang="less">
  tr > td, tr > th {
    border-left: 0px;
    border-top: 0px;
  }

  td, th {
    padding: 0;
  }

  table {
    border: 0;
    font-size: 0.75rem;
    padding-bottom: 50px;
  }

  .x-table-background {
    background-color: #fff;
  }

  .link {
    text-decoration: underline
  }

  .red {
    color: #d23747;
  }

  .total-tool-bar {
    bottom: 0;
    left: 0;
    width: 100%;
    position: absolute;
    background-color: #f8f8f8;

    ul {
      height: 35px;
      list-style-type: none;
      li {
        font-size: 14px;
        height: 35px;
        width: 100%;
        display: inline-block;
        line-height: 34px;
        text-align: right;
        padding-right: 20px;
      }
    }
  }

</style>

