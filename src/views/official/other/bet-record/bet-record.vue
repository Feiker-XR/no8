<template>
  <scroller :height="'-46px'" class="betRecord" lock-x scrollbar-y @on-scroll-bottom="searchMore" :scroll-bottom-offst="200">
    <div>
      <x-table :cell-bordered="false" style="background-color:#fff">
        <thead>
        <tr>
          <th>时间</th>
          <th>类型</th>
          <th>金额</th>
          <th>查看详情</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in dataList">
          <td>{{item.betTime | filterBetTime}}</td>
          <td>{{item.lotteryGameName}}</td>
          <td :class="item.betStatusColor">{{item.betAmount}}元</td>
          <td><img src="./circle.svg" @click="handleOpenDialog(item)"/></td>
        </tr>
        </tbody>
      </x-table>
      <load-more :showLoading="hasMore" :tip="hasMore?'正在加载...':'没有更多啦'"></load-more>
    </div>
    <div v-transfer-dom @touchmove.prevent>
      <x-dialog v-model="dialogVisable">
        <group label-align="left">
          <group-title slot="title">
            <h4>投注详情</h4>
          </group-title>
          <cell class="group-cell" title="期号" :border-intent="false">
            第<span class="issue">{{form.issue}}</span>期&nbsp;<span class="game-name">{{form.lotteryName}}</span>
          </cell>
          <cell class="group-cell" title="订单号" :border-intent="false" :arrow-direction="'up'">
          </cell>
          <cell-box style="font-size: 12px;" :border-intent="false">{{form.billNo}}</cell-box>
          <cell class="group-cell" title="开奖号码" :border-intent="false" :value="form.lotteryNumber"></cell>
          <cell class="group-cell" title="玩法" :border-intent="false" :value="form.playName"></cell>
          <cell class="group-cell" title="奖金赔率" :border-intent="false" :value="form.odds"></cell>
          <cell class="group-cell" title="投注内容" :border-intent="false" :value="form.betContent"></cell>
          <cell class="group-cell" title="投注总额" :border-intent="false" :value="form.betTotal"></cell>
          <cell class="group-cell" title="派彩金额" :border-intent="false" :value="form.amount"></cell>
          <cell class="group-cell" title="状态" :border-intent="false">
            <span :class="form.betStatusColor">{{form.betStatus}}</span>
          </cell>
          <div class="dialog-foot">
            <x-button class="btn-confirm" @click.native="dialogVisable=false">确定</x-button>
          </div>
        </group>
      </x-dialog>
    </div>
  </scroller>
</template>

<script>
  import { XTable, LoadMore, XDialog, Scroller, Group, GroupTitle, Cell, CellBox, XButton } from 'vux'
  import { mapActions, mapMutations } from 'vuex'
  import { getUserGameBetList } from 'api/credit/credit'
  import TransferDom from 'directive/transfer-dom/index'
  export default {
    name: 'DrawHistory',
    directives: {
      TransferDom
    },
    components: {
      XTable,
      LoadMore,
      Scroller,
      XDialog,
      Group,
      GroupTitle,
      Cell,
      CellBox,
      XButton
    },
    data () {
      return {
        dataList: [],
        pullup: true,
        dialogVisable: false,
        beforeScroll: true,
        onFetching: false,
        hasMore: true,
        query: {
          pageNum: 0,
          pageSize: 30
        },
        dicMap: {
          '-1': '未派彩',
          '2': '已派彩',
          '3': '已撤单'
        },
        form: {
          lotteryName: '',
          issue: '',
          lotteryNumber: '',
          billNo: '',
          playName: '',
          odds: '',
          betContent: '',
          betTotal: '',
          amount: '',
          betStatus: '',
          betStatusColor: ''
        }
      }
    },
    filters: {
      filterBetTime (val) {
        return val && val.length > 3 ? val.substr(0, val.length - 3) : val
      }
    },
    methods: {
      ...mapActions([
        'setLotteryName',
        'updateBetBarIsShow'
      ]),
      handleOpenDialog ({lotteryGameName, lotteryGameNum, lotteryResult, billSeqNo, masterName, proxyOdds, betContent, betAmount, gameNetBetAmount, billStatus, betStatusColor}) {
        this.form = {
          lotteryName: lotteryGameName,
          issue: lotteryGameNum,
          lotteryNumber: lotteryResult || '',
          billNo: billSeqNo,
          playName: masterName,
          odds: proxyOdds,
          betContent: betContent,
          betTotal: betAmount,
          amount: gameNetBetAmount,
          betStatus: this.dicMap[billStatus] || billStatus,
          betStatusColor: betStatusColor
        }
        this.dialogVisable = true
      },
      _initData () {
        this.setHeaderTitle('投注记录')
        this.searchMore()
      },
      searchMore () {
        if (!this.hasMore || this.onFetching) {
          return
        }
        this.onFetching = true
        this.query.pageNum++
        getUserGameBetList(this.query).then((res) => {
          this.onFetching = false
          const {currentStatus, currentData} = res
          if (currentStatus === 0 && currentData) {
            const {list} = currentData
            const dic = {'-1': 'default-color'}
            this.dataList = this.dataList.concat(list.map(v => {
              const {billStatus} = v
              if (billStatus === '2') {
                v.betStatusColor = this.isWinning(v) ? 'red' : 'green'
              } else {
                v.betStatusColor = dic[billStatus] || 'black'
              }
              return v
            }))
            this._checkMore(list)
          }
        })
      },
      isWinning (betInfo) {
        return betInfo.gameNetBetAmount && betInfo.gameNetBetAmount > 0
      },
      _checkMore (data) {
        if (!data.length || data.length < this.query.pageSize) {
          this.hasMore = false
        }
      },
      ...mapMutations({
        setHeaderTitle: 'SET_HEADER_TITLE'
      })
    },
    beforeRouteEnter (to, from, next) {
      if (!from.path) return false
      next(vm => {
        vm._initData(to.params)
      })
    }
  }
</script>
<style lang="less">
  .group-cell {
    font-size: 13px;
  }

  .red {
    color: #d23747;
  }

  .green {
    color: green;
  }

  .black {
    color: black;
  }

  .default-color {
    color: #d1d4d9;
  }

  .issue,.game-name{
    color: #fd7c5c;
  }

  .dialog-foot {
    padding: 5px 0 5px 0;
    border-top: 0.045rem solid #D9D9D9;
    .btn-confirm {
      width: 76px;
      height: 25px;
      line-height: 25px;
      font-size: 15px;
      color: #999999;
    }
  }
</style>

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
  }

  .betRecord {
    position: fixed;
    width: 100%;
    top: 46px;
    bottom: 0px;
    overflow: hidden;
    img {
      width: 25px;
      height: 25px;
      vertical-align: middle;
    }
  }
</style>

