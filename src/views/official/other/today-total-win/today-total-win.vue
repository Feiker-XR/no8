<template>
  <div>
    <Scroller lock-x scrollbar-y use-pulldown height="-81" style="top:0px;bottom: 35px"
              :pulldown-config="pulldownConfig"
              v-model="status"
              @on-pulldown-loading="handlePullDown">
      <x-table :cell-bordered="false" class="x-table-background">
        <thead>
        <tr>
          <th>期号</th>
          <th>下注明细</th>
          <th>下注金额</th>
          <th>输赢金额</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in dataList">
          <td><span>{{item.lotteryGameNum}}</span></td>
          <td><span>{{item.betDetail | formatBetDetail}}</span></td>
          <td><span>{{item.betAmount}}</span></td>
          <td><span :class="item.winOrLose>0?'red':'green'">{{item.winOrLose}}</span></td>
        </tr>
        </tbody>
      </x-table>
    </Scroller>
    <div class="total-tool-bar">
      <ul>
        <li><span>下注金额：</span><span>{{total.betAmount}}</span></li>
        <li><span>输赢金额：</span><span :class="total.winAmount>0?'green':'red'">{{total.winAmount}}</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import {XTable, Scroller} from 'vux'
  import {mapMutations} from 'vuex'
  import {getTodayTotalWin} from 'api/credit/credit'
  export default {
    name: 'TodayTotalWin',
    components: {XTable, Scroller},
    data () {
      return {
        dataList: [],
        total: {
          betAmount: '0.00',
          winAmount: '0.00'
        },
        status: {
          pulldownStatus: 'default'
        },
        pulldownConfig: {
          content: '下拉刷新',
          downContent: '下拉刷新',
          upContent: '释放刷新',
          loadingContent: '加载中...'
        }
      }
    },
    mounted () {
      this.getList()
    },
    filters: {
      formatBetDetail (val) {
        if (val.length > 6) {
          return `${val.substr(0, 3)}...${val.substr(val.length - 3, val.length)}`
        }
        return val
      }
    },
    methods: {
      ...mapMutations({
        setHeaderTitle: 'SET_HEADER_TITLE'
      }),
      init () {
        this.setHeaderTitle('今日输赢')
      },
      handlePullDown () {
        this.getList()
      },
      getList () {
        getTodayTotalWin().then(res => {
          this.status.pulldownStatus = 'default'
          const {currentStatus, currentData} = res
          if (currentStatus === 0 && currentData) {
            const {total, resultData} = currentData
            this.dataList = resultData
            if (total) {
              this.total.winAmount = parseFloat(total.winOrLoseTotal).toFixed(2)
              this.total.betAmount = parseFloat(total.betAmountTotal).toFixed(2)
            }
          }
        }).catch(() => {
          this.$vux.toast.text('服务器繁忙', 'top')
          this.status.pulldownStatus = 'default'
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
        width: 49%;
        display: inline-block;
        line-height: 34px;
        text-align: center;
      }
    }
  }

</style>

