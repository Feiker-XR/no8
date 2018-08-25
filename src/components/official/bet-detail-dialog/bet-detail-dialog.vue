<template>
  <x-dialog v-model="show">
    <div class="content">
      <p class="title">投注确认</p>
      <div class="bet-list">
        <scroller lock-x scrollbar-y :bounce="false" style="max-height: 320px!important; height: auto!important;"> <!-- :height="120px" -->
          <div>
            <div class="bet-list-item" v-for="(item,index) in bettingList">
              <div class="overflow">
                <div class="top">
                  <span>{{item.issue}}期</span>
                  <span>{{item.name}}</span>
                  <span>{{item.betNums}}注{{item.amount}}元</span>
                </div>
                <a style="position: absolute" @click="handleRemove(index)">
                  <svg t="1532934434176" viewBox="0 0 1024 1024"
                       xmlns="http://www.w3.org/2000/svg" p-id="2299"
                       fill="#cdcdcd"
                       width="22" height="22">
                    <path
                      d="M625.425306 681.589466l-115.472941-115.472941-115.471918 115.472941-54.117548-54.118572 115.471918-115.471918-115.471918-115.472941 54.117548-54.117548 115.471918 115.471918 115.472941-115.471918 54.117548 54.117548-115.472941 115.472941 115.472941 115.471918L625.425306 681.589466zM780.543176 241.409189c-148.824537-148.824537-392.356063-148.824537-541.1806 0s-148.824537 392.355039 0 541.179576 392.356063 148.824537 541.1806 0C929.367713 633.765251 929.367713 390.233726 780.543176 241.409189z"
                      p-id="2300"></path>
                  </svg>
                </a>
              </div>
              <div class="bottom">
                <span>{{item.text}}</span>
              </div>
            </div>
          </div>
        </scroller>
      </div>
      <div class="foot-btn">
        <div class="foot-btn__item">
          <button class="btn" @click="choiceAgain">继续下注</button>
        </div>
        <div class="foot-btn__item">
          <button class="btn" @click="betting">确认投注</button>
        </div>
      </div>
    </div>
  </x-dialog>
</template>

<script>
  import {XDialog, XButton, Scroller} from 'vux'
  import {mapGetters, mapActions, mapMutations} from 'vuex'

  export default {
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    components: {
      XDialog,
      XButton,
      Scroller
    },
    computed: {
      ...mapGetters([
        'betList',
        'timerTime',
        'nextIssue',
        'lotteryName',
        'bettingList'
      ])
    },
    methods: {
      ...mapActions([
        'selectBet',
        'officialBetting',
        'refreshUserBalance',
        'removeBetting'
      ]),
      ...mapMutations({
        setBetsDialogVisible: 'SET_BETS_DIALOG_VISIBLE'
      }),
      ...mapMutations([
        'updateLoadingStatus'
      ]),
      handleRemove (index) {
        this.removeBetting({index})
      },
      choiceAgain () {
        this.$emit('onCancel')
      },
      betting () {
        this.$emit('onSubmit', this.officialBetting)
      }
    }
  }
</script>

<style lang="less" scoped>
  .content {
    max-height: 400px;
    width: 100%;
    .title {
      font-size: 18px;
      height: 47px;
      line-height: 47px;
      border-bottom: 1px solid #eee;
      box-sizing: border-box;
      color: #d23748;
    }
    .bet-list {
      max-height: 320px;
      width: 100%;
      .bet-list-item {
        height: 50px;
        border-bottom: 1px solid #eee;
        padding: 5px 10px 5px 10px;
        .overflow {
          overflow: hidden;
        }
        .top {
          height: 25px;
          width: 90%;
          overflow: hidden;
          float: left;
          line-height: 25px;
          span {
            box-sizing: border-box;
            /*width: 40%;*/
            margin: 0 3px;
            padding: 0 1px;
            float: left;
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 12px;
            white-space: nowrap;
            text-align: left;
          }
        }
        .icon-del {
          float: right;
          height: 25px;
          width: 25px;
          background-color: red;
        }
        .bottom {
          height: 25px;
          line-height: 25px;
          float: left;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #d23748;
          padding-left: 3px;
          box-sizing: border-box;
          span {
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 270px;
            display: inline-block;
            overflow: hidden;
          }
        }
        &:last-child {
          border-bottom: none;
        }
      }
    }
    .foot-btn {
      display: inline-block;
      height: 29px;
      width: 100%;
      border-top: 1px solid #eee;
      .foot-btn__item {
        float: left;
        width: 50%;
        height: 100%;
        .btn {
          height: 100%;
          width: 100%;
          border: 0;
          font-size: 14px;
          background-color: white;
          outline: none;
        }
        &:last-child .btn{
          color: #d23748;
        }
      }
    }
  }
</style>
