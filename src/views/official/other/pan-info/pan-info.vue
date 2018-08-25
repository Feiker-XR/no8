<template>
  <scroller class="history" lock-x>
    <div>
      <x-table :cell-bordered="false" style="background-color:#fff;">
        <thead>
        <tr>
          <th class="text-left" width=30%><span>类型</span></th>
          <th>单注最低</th>
          <th>单注最高</th>
          <th>单项最高</th>
        </tr>
        <tr>
          <td colspan="4" class="line"></td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in dataList" :key="index">
          <td class="text-left">
            <span>{{item.ruleName}}</span>
          </td>
          <td>
            1
          </td>
          <td class="red">
            {{item.singleLimit}}
          </td>
          <td class="red">
            {{item.totalLimit}}
          </td>
        </tr>
        </tbody>
      </x-table>
    </div>
  </scroller>

</template>

<script>
  import {XTable, Scroller} from 'vux'
  import {mapMutations} from 'vuex'
  import {getPanInfo} from 'api/credit/credit'
  export default {
    name: 'DrawHistory',
    components: {
      XTable,
      Scroller
    },
    data () {
      return {
        dataList: [],
        pullup: true,
        beforeScroll: true,
        hasMore: true,
        gameTypeCode: '',
        gameCode: '',
        query: {
          gameId: ''
        }
      }
    },
    mounted () {

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
      initData (option) {
        this.setOptions(option)
        this.setHeaderTitle('盘口信息')
        this.searchMore()
      },
      setOptions (option) {
        const {gameTypeCode, gameCode, gameId} = option
        this.gameTypeCode = gameTypeCode
        this.gameCode = gameCode
        this.query.gameId = gameId
      },
      searchMore () {
        getPanInfo(this.query).then((res) => {
          const {currentStatus, currentData} = res
          if (currentStatus === 0) {
            this.dataList = currentData
          }
        }).catch(() => {
          this.$vux.toast.text('服务器繁忙', 'top')
        })
      },
      ...mapMutations({
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
  .history {
    position: fixed;
    width: 100%;
    top: 46px;
    bottom: 50px;
    overflow: hidden;
  }
  .line{
    content: ' ';
    height: .2rem;
    width: 100%;
    background-color: #e6e7e8 !important;
  }
  .text-left>span{
    display: inline-block;
    width: 72px;
    text-align: left;
  }
</style>

