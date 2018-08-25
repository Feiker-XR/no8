<template>
  <Scroller :height="height"
            lock-x
            scrollbar-y
            @on-scroll-bottom="searchMore"
            :scroll-bottom-offst="200">
    <div>
      <x-table :cell-bordered="false"
               style="background-color:#fff;"
               :class="options.gameTypeCode? '':'shortTable'"
               v-if="dataList">
        <thead>
        <tr>
          <th style="line-height:30px">期号</th>
          <th style="line-height:30px">开奖号码</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in dataList" :key="index">
          <td style="width: 35%;vertical-align: middle">第{{item.lotteryResultNum}}期</td>
          <td style="width: 65%;vertical-align: middle;text-align: center">
            <lottery-draw-balls :groupCode="options.gameTypeCode"
                                :balls="parseDrawResult(options.gameTypeCode, item.lotteryNumber.split(','))"></lottery-draw-balls>
            <lottery-draw-balls v-if="item.lotteryStatistics" :statistics="item.lotteryStatistics.split(',')"></lottery-draw-balls>
          </td>
        </tr>
        </tbody>
      </x-table>
      <load-more :showLoading="hasMore" :tip="hasMore?'正在加载...':'没有更多啦'"></load-more>
    </div>
  </Scroller>
</template>

<script>
  import { XTable, LoadMore, Scroller } from 'vux'
  import { getLotteryDrawHistory } from 'api/credit/credit'
  import { parseDrawResult } from '@/assets/scripts/util'
  import LotteryDrawBalls from 'components/lottery-draw-balls/lottery-draw-balls'
  export default {
    props: {
      options: {
        type: Object,
        default: function () {
          return {}
        }
      },
      height: {
        type: String
      }
    },
    components: {
      XTable,
      LoadMore,
      Scroller,
      LotteryDrawBalls
    },
    data () {
      return {
        dataList: [],
        drawStatistics: [],
        onFetching: false,
        beforeScroll: true,
        hasMore: true,
        query: {
          lotteryGameId: '',
          recentIssues: 10
        }
      }
    },
    mounted () {
      if (this.options.gameId) {
        this.query.lotteryGameId = this.options.gameId
        this.searchMore()
      }
    },
    watch: {
      'options': {
        deep: true,
        handler: function (val, oldVal) {
          console.log(`watch options new:${val},old:${oldVal}`)
          if (val.gameId) {
            this.query.lotteryGameId = val.gameId
            this.searchMore()
          }
        }
      }
    },
    filters: {
      filterGameName (val) {
        return val.length > 5 ? `${val.substr(0, 5)}...` : val
      },
      filterMasterName (val) {
        return val.length > 7 ? `${val.substr(0, 6)}...` : val
      }
    },
    methods: {
      parseDrawResult,
      searchMore () {
        if (!this.hasMore || this.onFetching) {
          return
        }
        this.onFetching = true
        this.query.recentIssues += 10
        getLotteryDrawHistory(this.query).then((res) => {
          const {currentStatus, currentData} = res
          this.onFetching = false
          if (currentStatus === 0 && currentData.length) {
            this.dataList = currentData
            this._checkMore(currentData)
          }
        })
      },
      _checkMore (data) {
        if (!data.length || data.length < this.query.recentIssues) {
          this.hasMore = false
        }
      }
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
    line-height: 1.0;
  }
  table {
    border: 0;
    font-size: 0.75rem;
  }

  .history {
    position: fixed;
    width: 100%;
    top: 46px;
    bottom: 0px;
    overflow: hidden;
    /*height:200px;*/
  }

  .shortHistory {
    width: 100%;
    overflow: hidden;
    height: 150px;
  }
  .balls-wrapper{
    margin: 5px 0;
  }
  .shortTable {
    line-height: 30px;
  }

  .loading-container {
    position: absolute;
    width: 100%;
  }

  .lottery-his-ball {
    vertical-align: middle;
    list-style: none;
    display: inline-block;
    li {
      display: inline-block;
    }
  }
</style>

