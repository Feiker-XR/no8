<template>
  <div class="official-foot-bars">
    <footer class="footer">
      <flexbox :gutter="0" :wrap="'wrap'" orient="vertical">

        <flexbox-item class="odds-bar">
          <flexbox :gutter="0" :wrap="'wrap'" class="selector-box">
            <flexbox-item :span="9">
              <div class="selector-wrapper">
                <multiple-btn class="multiple" v-model="multipleSelected" :min="1"
                              @on-change="onMultipleChange"></multiple-btn>
                <selector class="unit-selector" :options="unitOptions" v-model="unitSelected"
                          @on-change="onUnitChange"></selector>
                <selector class="bonus-selector" :options="bonusPercentOptions" v-model="bonusPercentSelected"
                          @on-change="onBonusChange"></selector>
              </div>
            </flexbox-item>
            <flexbox-item :span="3" class="amount-wrapper">
              <span>{{selectedBetCount}}</span>注<span>{{totalAmount}}</span>元
            </flexbox-item>
          </flexbox>
        </flexbox-item>

        <flexbox-item class="opera-bar">
          <flexbox :gutter="0" :wrap="'wrap'" class="opera-bar-wrapper">
            <flexbox-item :span="2.5">
              <a class="clean-btn" @click="handleClean">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 23" width="22" height="25" fill="#888888">
                  <path
                    d="M77.08,100H66.92A1.92,1.92,0,0,1,65,98.08V83.92A1.92,1.92,0,0,1,66.92,82H77.08A1.92,1.92,0,0,1,79,83.92V98.08A1.92,1.92,0,0,1,77.08,100ZM66.92,83a.92.92,0,0,0-.92.92V98.08a.92.92,0,0,0,.92.92H77.08a.92.92,0,0,0,.92-.92V83.92a.92.92,0,0,0-.92-.92Z"
                    transform="translate(-63 -77)"/>
                  <rect x="4.75" y="8.5" width="1" height="10" rx="0.5" ry="0.5"/>
                  <rect x="8.5" y="8.5" width="1" height="10" rx="0.5" ry="0.5"/>
                  <rect x="12.25" y="8.5" width="1" height="10" rx="0.5" ry="0.5"/>
                  <path d="M79,83H65a2,2,0,0,1,0-4H79a2,2,0,0,1,0,4ZM65,80a1,1,0,0,0,0,2H79a1,1,0,0,0,0-2Z"
                        transform="translate(-63 -77)"/>
                  <path
                    d="M69.5,79v-.68a.33.33,0,0,1,.32-.32h4.36a.33.33,0,0,1,.32.32V79h1v-.68A1.32,1.32,0,0,0,74.18,77H69.82a1.32,1.32,0,0,0-1.32,1.32V79Z"
                    transform="translate(-63 -77)"/>
                </svg>
                <span>清除</span>
              </a>
            </flexbox-item>
            <flexbox-item :span="2.5">
              <a class="random-btn" @click="handleRandom">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23.8 23.8" width="22" height="25" fill="#888888">
                  <path
                    d="M123.17,85a2.5,2.5,0,1,1,2.32-2.66A2.51,2.51,0,0,1,123.17,85Zm-.28-4.15a1.66,1.66,0,1,0,1.77,1.55A1.67,1.67,0,0,0,122.89,80.84Z"
                    transform="translate(-117.6 -76.6)"/>
                  <path
                    d="M136.17,85a2.5,2.5,0,1,1,2.32-2.66A2.51,2.51,0,0,1,136.17,85Zm-.28-4.15a1.66,1.66,0,1,0,1.77,1.55A1.67,1.67,0,0,0,135.89,80.84Z"
                    transform="translate(-117.6 -76.6)"/>
                  <path
                    d="M123.17,97a2.5,2.5,0,1,1,2.32-2.66A2.51,2.51,0,0,1,123.17,97Zm-.28-4.15a1.66,1.66,0,1,0,1.77,1.55A1.67,1.67,0,0,0,122.89,92.84Z"
                    transform="translate(-117.6 -76.6)"/>
                  <path
                    d="M136.17,97a2.5,2.5,0,1,1,2.32-2.66A2.51,2.51,0,0,1,136.17,97Zm-.28-4.15a1.66,1.66,0,1,0,1.77,1.55A1.67,1.67,0,0,0,135.89,92.84Z"
                    transform="translate(-117.6 -76.6)"/>
                  <path
                    d="M129.67,91A2.5,2.5,0,1,1,132,88.33,2.51,2.51,0,0,1,129.67,91Zm-.28-4.15a1.66,1.66,0,1,0,1.77,1.55A1.67,1.67,0,0,0,129.39,86.84Z"
                    transform="translate(-117.6 -76.6)"/>
                  <path
                    d="M138.17,100.4H120.83a3.23,3.23,0,0,1-3.23-3.23V79.83a3.23,3.23,0,0,1,3.23-3.23h17.34a3.23,3.23,0,0,1,3.23,3.23V97.17A3.23,3.23,0,0,1,138.17,100.4Zm-17.34-23a2.43,2.43,0,0,0-2.43,2.43V97.17a2.43,2.43,0,0,0,2.43,2.43h17.34a2.43,2.43,0,0,0,2.43-2.43V79.83a2.43,2.43,0,0,0-2.43-2.43Z"
                    transform="translate(-117.6 -76.6)"/>
                </svg>
                <span>机选</span>
              </a>
            </flexbox-item>
            <flexbox-item :span="3.5">
              <x-button class="bet-btn" @click.native="handleFastBetting">立即下注</x-button>
            </flexbox-item>
            <flexbox-item :span="3.5">
              <sup class="sup-icon" v-if="bettingList.length">
                <span class="sup-icon__i">{{bettingList.length}}</span>
              </sup>
              <x-button class="bet-btn" @click.native="handleConfirmChoice">确认选号</x-button>
            </flexbox-item>
          </flexbox>
        </flexbox-item>

      </flexbox>
    </footer>
  </div>
</template>

<script>
  import {Flexbox, FlexboxItem, Selector, XButton, InlineXNumber, XNumber, Range} from 'vux'
  import {mapGetters, mapMutations, mapActions} from 'vuex'
  import MultipleBtn from 'components/official/multiple-btn/multiple-btn'
  import {OFFICIAL_UNIT} from '@/assets/const/config'

  export default {
    data () {
      return {
        bonusPercentSelected: 0,
        unitSelected: 1,
        multipleSelected: 1
      }
    },
    components: {
      Flexbox,
      FlexboxItem,
      Selector,
      XButton,
      InlineXNumber,
      XNumber,
      MultipleBtn,
      Range
    },
    computed: {
      ...mapGetters([
        'selectedBetCount',
        'unitOptions',
        'bonusPercentOptions',
        'bonusPercent',
        'unit',
        'bettingMultiple',
        'bettingList'
      ]),
      totalAmount () {
        return (this.selectedBetCount * 2 * this.bettingMultiple * OFFICIAL_UNIT[this.unitSelected]).toFixed(2)
      }
    },
    watch: {
      bonusPercent (newValue, oldValue) {
        if (this.bonusPercentSelected !== newValue) {
          this.bonusPercentSelected = newValue
        }
      },
      unit (val) {
        if (this.unitSelected !== val) {
          this.unitSelected = val
        }
      },
      bettingMultiple (val) {
        if (this.multipleSelected !== val) {
          this.multipleSelected = val
        }
      }
    },
    methods: {
      ...mapActions([
        'confirmChoice',
        'randomBetting',
        'computedSelected',
        'resetSelected'
      ]),
      ...mapMutations({
        setBetsDialogVisible: 'SET_BETS_DIALOG_VISIBLE',
        setBonusPercent: 'SET_BONUS_PERCENT',
        setUnit: 'SET_UNIT',
        setBettingMultiple: 'SET_BETTING_MULTIPLE'
      }),
      onBonusChange (value) {
        this.setBonusPercent(value)
      },
      onUnitChange (value) {
        this.setUnit(value)
      },
      onMultipleChange (value) {
        this.setBettingMultiple(value)
      },
      handleFastBetting () {
        this.setBetsDialogVisible({visible: true})
      },
      handleConfirmChoice () {
        this.confirmChoice().then(() => {
        }).catch(error => {
          this.$vux.toast.text(error.message, 'top')
        })
      },
      handleClean () {
        this.resetSelected({cleanBetting: true})
      },
      handleRandom () {
        this.resetSelected({cleanBetting: false})
        this.randomBetting()
        this.computedSelected()
      }
    }
  }
</script>
<style lang="less">
  .selector-wrapper .vux-selector .weui-select {
    height: 25px;
    line-height: 25px;
    padding-left: 5px;
    font-size: 12px;
    top: -2px;
  }

  .selector-wrapper .vux-number-selector svg {
    fill: #d23748;
  }

  .selector-wrapper .weui-cell_select .weui-select {
    padding-right: 0;
  }

  .selector-wrapper .weui-cell_select .weui-cell__bd:after {
    right: 7px;
  }
</style>
<style lang="less" scoped>
  .official-foot-bars {
    height: 80px;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid rgb(205, 205, 205);
    .footer {
      position: relative;
      width: 100%;
      background: #fff;
      height: 80px;
      .odds-bar {
        height: 30px;
        border-bottom: 1px solid rgb(205, 205, 205);
        .selector-box {
          height: 30px;
          .selector-wrapper {
            height: 23px;
            .unit-selector {
              width: 36px;
              height: 23px;
              line-height: 23px;
              display: inline-block;
              border: 1px solid #bababa;
              border-radius: 5px;
              position: absolute;
              top: 3px;
              left: 100px;
            }
            .bonus-selector {
              position: absolute;
              width: 120px;
              height: 23px;
              line-height: 23px;
              display: inline-block;
              border: 1px solid #bababa;
              border-radius: 5px;
              top: 3px;
              left: 150px;
            }
            .multiple {
              position: absolute;
              width: 90px;
              top: 3px;
              left: 6px;
            }
          }
          .amount-wrapper {
            font-size: 12px;
            text-align: center;
          }
          .amount-wrapper span{
            margin: 0 1px;
          }

          .amount-wrapper span:last-child {
            color: #d63f52;
          }
        }
      }
      .opera-bar {
        height: 50px;
        line-height: 50px;
        .opera-bar-wrapper {
          .clean-btn {
            margin-left: 5px;
            text-align: center;
            svg{
              position: relative;
              top: 6px;
            }
          }
          .random-btn {
            text-align: center;
            svg {
              position: relative;
              top: 6px;
            }
          }
          .sup-icon {
            position: absolute;
            top: 16px;
            right: 0;
            z-index: 101;
            .sup-icon__i {
              display: inline-block;
              text-align: center;
              background: #f74c31;
              color: #fff;
              font-size: 12px;
              height: 16px;
              line-height: 16px;
              border-radius: 8px;
              padding: 0 5px;
              background-clip: padding-box;
              vertical-align: middle;
            }
          }
          .bet-btn {
            height: 26px;
            width: 95%;
            line-height: 26px;
            background-color: #d23748;
            color: #ffffff;
            font-size: 15px;
          }
        }
      }
    }
  }
</style>
