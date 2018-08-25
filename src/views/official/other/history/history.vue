<template>
  <div>
    <draw-history :height="'-46px'" :options="drawOptions"></draw-history>
  </div>
</template>

<script>
  import DrawHistory from 'components/draw-history/draw-history'
  import { mapMutations } from 'vuex'
  export default {
    components: {
      DrawHistory
    },
    data () {
      return {
        drawOptions: {
          gameId: '',
          gameCode: '',
          gameTypeCode: ''
        }
      }
    },
    methods: {
      initData ({gameTypeCode, gameCode, gameId}) {
        this.setHeaderTitle('开奖历史')
        this.drawOptions.gameCode = gameCode
        this.drawOptions.gameTypeCode = gameTypeCode
        this.drawOptions.gameId = gameId
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

