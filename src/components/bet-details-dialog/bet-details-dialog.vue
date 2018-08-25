<template>
  <transition name="fade">
  <div v-show="show">
    <yd-popup position="center" class="bets-detail-dialog" width="300px" v-model="show" height='370px' :closeOnMasker="false">
      <div class="bets-detail-dialog__table">
        <p class="dialog-title">第<span class="issue">{{nextIssue}}</span>期&nbsp;&nbsp;<span class="issue">{{lotteryName}}</span>下注明细</p>
        <div class="table-header">
          <span>号码</span>
          <span>赔率</span>
          <span>金额</span>
          <span>操作</span>
        </div>

        <Scroller lock-x scrollbar-y :height="'200px'" style="background: #f5f5f5;" v-if="show">
          <div class="table-list">
            <div class="table-list__item" v-for="(item, index) in betList" :key="index">
              <span style="color: rgb(255, 44, 103);">{{item.displayName}}</span>
              <span>{{item.odds}}</span>
              <span>{{item.amount}}</span>
              <span style="color: rgb(27, 163, 241);" @click="selectBet(item)">删除</span>
            </div>
          </div>
        </Scroller>

        <div class="table-total">
          共&nbsp;<span>{{betList.length}}</span>&nbsp;注&nbsp;<span>{{betList.length * (betList.length ? betList[0].amount : 0)}}</span>&nbsp;元
        </div>
        <div class="foot-buttons">
          <div class="last-time">
            <span>封盘时间:</span>
            <span class="time">{{timerTime}}</span>
          </div>
          <div class="btn-group">
            <div class="btn-group__item">
              <yd-button mini action-type="button" class="btn cancel" @click.native="$emit('onCancel')">取消</yd-button>
            </div>
            <div class="btn-group__item">
              <yd-button mini action-type="button" class="btn submit-bet" @click.native="handleSubmit">确认</yd-button>
            </div>
          </div>
        </div>
      </div>
    </yd-popup>
  </div>
  </transition>
</template>

<script>
  import { Popup } from 'vue-ydui/dist/lib.rem/popup'
  import { Button } from 'vue-ydui/dist/lib.rem/button'
  import { Scroller } from 'vux'
  import { mapGetters, mapActions } from 'vuex'
  export default {
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    components: {
      YdPopup: Popup,
      YdButton: Button,
      Scroller
    },
    computed: {
      ...mapGetters([
        'betList',
        'timerTime',
        'nextIssue',
        'lotteryName'
      ])
    },
    methods: {
      ...mapActions([
        'selectBet',
        'betting'
      ]),
      handleSubmit () {
        this.$emit('onSubmit', this.betting)
      }
    }
  }
</script>

<style lang="less" scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity .2s;
  }
  .fade-enter, .fade-leave-to {
    opactiy: 0
  }
  .bets-detail-dialog {
    height: 370px;
    .bets-detail-dialog__table {
      .dialog-title {
        padding: 10px 0;
        text-align: center;
        color: #000;
        font-size: 0.9rem;
        background-color: #f5f5f5;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        .issue {
          color: rgb(253, 124, 92);
          font-size: 0.8rem;
        }
      }
      .table-header {
        overflow: hidden;
        padding: 10px 0;
        background-color: #fff;
        font-size: 0.75rem;
        span {
          float: left;
          width: 25%;
          text-align: center;
        }
      }
      .table-list {
        .table-list__item {
          overflow: hidden;
          padding: 10px 0;
          background-color: #f5f5f5;
          font-size: 0.75rem;
          span {
            float: left;
            width: 25%;
            text-align: center;
          }
        }
      }
      .table-total {
        font-size: 0.75rem;
        text-align: right;
        padding: 10px;
        border-bottom: 1px dashed #aaa;
        background: #fff;
        span {
          color: #ff2c67;
          font-size: 0.75rem;
        }
      }
      .foot-buttons {
        background: #fff;
        overflow: hidden;
        padding: 10px 5px 10px 5px;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        .last-time {
          float: left;
          font-size: 0.75rem;
          padding: 5px;
          .time {
            color: #d23747;
          }
        }
        .btn-group {
          overflow: hidden;
          float: right;
          display: inline-block;
          .btn-group__item {
            float: left;
            .btn {
              width: 65px;
              height: 27px;
              margin-right: 5px;
            }
            .cancel {
              font-size: 13px;
              background-color: #d4d7dc;
              color: #008ca5;
            }
            .submit-bet {
              width: 80px;
              color: #fff;
              background-color: #fc1f5d;
              font-size: 13px;
            }
          }
        }
      }
    }
  }
</style>
