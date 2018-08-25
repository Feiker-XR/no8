<template>
  <div>
    <scroller ref="scroller" lock-x scrollbar-y height="-46">
      <div>
        <div class="tips">
          <a style="margin-left: 5px">{{gameName}}></a><span><a>下注明细</a></span>
        </div>
        <x-table :cell-bordered="false" style="background-color:#fff;">
          <thead>
          <tr>
            <th>期号</th>
            <th>下注明细</th>
            <th>下注金额</th>
            <th>可赢金额</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, key, index) in dataList">
            <td>{{item.lotteryGameNum}}</td>
            <td>{{item.betDetail | filterBetDetail}}</td>
            <td>{{item.betAmount}}</td>
            <td>{{item.winAmount}}</td>
          </tr>
          </tbody>
        </x-table>
      </div>
    </scroller>
  </div>
</template>

<script>
  import { Scroller, XTable } from 'vux'
  import { mapGetters, mapActions, mapMutations } from 'vuex'
  import { getCurrentBetDetail } from 'api/credit/credit'
  export default {
    name: 'CurrentBet',
    components: {XTable, Scroller},
    data () {
      return {
        dataList: [],
        gameName: '',
        gameId: ''
      }
    },
    computed: {
      ...mapGetters([
        'menuList'
      ])
    },
    filters: {
      filterBetDetail (val) {
        if (val.length > 13) {
          let tempArr = val.split('-')
          if (tempArr.length > 1) {
            if (tempArr[0].length > 6) {
              tempArr[0] = subStr(tempArr[0], 2, 3)
            }
            if (tempArr[1].length > 6) {
              tempArr[1] = subStr(tempArr[1], 2, 4)
            }
          }
          return tempArr.join('-')
        }

        function subStr (value, sIndex, eIndex) {
          return `${value.substr(0, sIndex)}...${value.substr(value.length - eIndex, value.length)}`
        }
        return val
      }
    },
    methods: {
      ...mapActions([
        'updateLoading'
      ]),
      ...mapMutations({
        setHeaderTitle: 'SET_HEADER_TITLE'
      }),
      init (options) {
        const {gameId, gameName} = options
        this.gameId = gameId
        this.gameName = gameName
        this.setHeaderTitle('即时注单-详情')
        this.getList()
      },
      getList () {
        getCurrentBetDetail({lotteryGameId: this.gameId}).then(res => {
          const {currentStatus, currentData} = res
          if (currentStatus === 0 && currentData) {
            this.dataList = currentData
          }
        }).catch(() => {})
      }
    },
    beforeRouteEnter (to, from, next) {
      if (!from.path) return false
      next(vm => {
        vm.init(to.params)
      })
    }
  }
</script>

<style scoped lang="less">
  table > thead > tr:first-child {
    border-top: 1px solid #e0e0e0 !important;
  }

  tr > td, tr > th {
    border-left: 0px;
    border-top: 0px;
  }

  table {
    border: 0;
    font-size: 0.75rem;
    padding-bottom: 50px;
  }

  td, th {
    padding: 0;
  }

  .tips {
    height: 32px;
    line-height: 32px;
    width: 100%;
    a {
      color: #333333;
      font-size: 0.9rem;
    }
  }

  /*.x-table-background {
    background-color: #fff;
  }*/

</style>

