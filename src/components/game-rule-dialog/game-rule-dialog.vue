<template>
  <x-dialog class="game-rule-dialog" v-model="show">
    <h3 class="game-rule-dialog__title">规则</h3>
    <scroller ref="ruleScroll" lock-x scrollbar-y :height="'270px'" :bounce="false" class="game-rule-dialog__content">
      <div>
        <div class="game-rule" v-html="lotteryRule"></div>
      </div>
    </scroller>
    <div class="game-rule-dialog__foot">
      <x-button type="warn" class="close-btn" @click.native="$emit('onCancel')">关  闭</x-button>
    </div>
  </x-dialog>
</template>

<script>
  import { XDialog, XButton, Scroller } from 'vux'
  import { mapGetters } from 'vuex'
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
    watch: {
      lotteryRule (val) {
        this.$nextTick(function () {
          this.$refs['ruleScroll'].reset({top: 0})
        })
      }
    },
    computed: {
      ...mapGetters([
        'lotteryRule'
      ])
    }
  }
</script>
<style lang="less">
  .game-rule h2 {
    font-size: 1.1rem;
    padding: 1px 0;
    font-weight: bold;
  }

  .game-rule h3 {
    font-size: 1rem;
    padding: 3px 0;
    font-weight: normal;
  }

  .game-rule p {
    font-size: 14px;
    padding: 3px 0;
    margin-left: 10px;
  }
</style>
<style lang="less" scoped>
  .game-rule-dialog {
    .game-rule-dialog__title {
      line-height: 30px;
      color: #666;
    }
    .game-rule-dialog__content {
      background: #EAEAEA;
      .game-rule {
        text-align: left;
        padding: 7px;
      }
    }
    .game-rule-dialog__foot {
      padding: 5px 0 5px 0;
      .close-btn {
        width: 80px;
        height: 25px;
        line-height: 25px;
        font-size: 1rem;
      }
    }
  }
</style>
