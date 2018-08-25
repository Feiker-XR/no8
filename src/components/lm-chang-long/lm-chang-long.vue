<template>
  <popup v-model="popupVisible" :height="'300px'" :position="'bottom'" @on-hide="onPopupHide"
         should-rerender-on-show style="background-color: white">
    <toggle-text v-if="!luzhuData.length" style="position: absolute;top: 30%;left: 42%;"></toggle-text>
    <template v-else>
      <div>
        <tab :line-width=2 :active-color="'#d23747'" v-model="activeTab">
          <tab-item>路珠</tab-item>
          <tab-item>两面长龙</tab-item>
        </tab>
      </div>
      <swiper v-model="activeTab" :height="'265px'" :aspect-ratio="2" :show-dots="false" :disableTouch="true">
        <swiper-item class="lu-zhu">
          <div class="lu-zhu-wrapper">
            <flexbox :gutter="0" class="lu-zhu-wrapper__btn">
              <div class="btn_box">
                <selector :options="options" v-model="selectorValue" @on-change="onSelectorChange"
                          class="lu-zhu-selector btn-font"></selector>
                <x-button class="lu-zhu-btn btn-font" :class="{'active':activeBtn==='single'}"
                          @click.native="onClickSingle">单双
                </x-button>
                <x-button class="lu-zhu-btn btn-font" :class="{'active':activeBtn==='big'}" @click.native="onClickBig">
                  大小
                </x-button>
              </div>
            </flexbox>
            <flexbox :gutter="0" class="lu-zhu-wrapper__box">
              <flexbox-item>
                <Scroller lock-y scrollbar-x>
                  <x-table class="lu-zhu-wrapper__table" full-bordered>
                    <tbody>
                    <tr v-for="y in 9">
                      <td v-for="x in 20">
                        <span :class="getLuzhuClass(y,x)">{{getLuzhu(y, x)}}</span>
                      </td>
                    </tr>
                    </tbody>
                  </x-table>
                </Scroller>
              </flexbox-item>
            </flexbox>
          </div>
        </swiper-item>
        <swiper-item class="chang-long">
          <Scroller lock-x scrollbar-y height="255px">
            <div class="table-wrapper">
              <x-table :cell-bordered="false" style="border: 0">
                <tbody>
                <tr v-for="(item, index) in lmChangLongData">
                  <td style="text-align:left;padding: 0 5px;">{{item.lotteryLocation}}</td>
                  <td style="text-align:right;padding: 0 5px;color: #d23747">{{item.lotteryContinuous}}期</td>
                </tr>
                </tbody>
              </x-table>
            </div>
          </Scroller>
        </swiper-item>
      </swiper>
    </template>
  </popup>
</template>

<script>
  import {
    Popup,
    Tab,
    TabItem,
    SwiperItem,
    XTable,
    XButton,
    Flexbox,
    FlexboxItem,
    Group,
    Selector,
    ButtonTab,
    ButtonTabItem,
    Scroller
  } from 'vux'
  import ToggleText from 'components/base/toggleText/toggleText'
  import Swiper from 'components/base/swiper/swiper.vue'
  import { getDewdropList } from 'api/common'
  import { mapGetters } from 'vuex'
  import { ERR_OK } from '@/assets/const/config'
  import { sscOptions, pk10Options, c11x5Options, klsfOptions } from './config'
  export default {
    components: {
      Popup,
      Tab,
      TabItem,
      Scroller,
      Swiper,
      SwiperItem,
      XTable,
      Flexbox,
      FlexboxItem,
      Group,
      Selector,
      ButtonTab,
      ButtonTabItem,
      XButton,
      ToggleText
    },
    data () {
      return {
        popupVisible: false,
        activeTab: 0,
        options: [],
        selectorValue: '',
        bigOrSmall: [],
        sumBigOrSmall: [],
        singleOrEven: [],
        sumSingleOrEven: [],
        luzhuData: [],
        lmChangLongData: [],
        activeBtn: 'single'
      }
    },
    methods: {
      onPopupHide () {
        this.popupVisible = false
      },
      reset () {
        this.luzhuData = []
        this.lmChangLongData = []
        this.activeTab = 0
        this.activeBtn = 'single'
        this.selectorValue = this.options && this.options.length ? this.options[0].key : ''
      },
      fetchLuzhuData () {
        if (this.lotteryGroupCode) {
          if (this.lotteryGroupCode === 'ssc') {
            this.options = sscOptions
          } else if (this.lotteryGroupCode === 'pk10') {
            this.options = pk10Options
          } else if (this.lotteryGroupCode === 'c11x5') {
            this.options = c11x5Options
          } else if (this.lotteryGroupCode === 'klsf') {
            this.options = klsfOptions
          }
          this.reset()
          getDewdropList({
            lotteryGameId: this.lotteryId,
            typeCode: this.lotteryGroupCode
          }).then(response => {
            const {currentStatus, currentData} = response
            if (currentStatus === ERR_OK && currentData) {
              const {bigOrSmall, sumBigOrSmall, singleOrEven, sumSingleOrEven, winLongRank} = currentData
              this.bigOrSmall = bigOrSmall
              this.sumBigOrSmall = sumBigOrSmall
              this.singleOrEven = singleOrEven
              this.sumSingleOrEven = sumSingleOrEven
              this.lmChangLongData = winLongRank

              if (this.selectorValue !== 'sum') {
                this.computedLuzhu(singleOrEven[this.selectorValue])
              }
            }
          }).catch(() => {})
        }
      },
      onClickSingle () {
        this.activeBtn = 'single'
        if (this.selectorValue !== 'sum') {
          this.computedLuzhu(this.singleOrEven[this.selectorValue])
        } else {
          this.computedLuzhu(this.sumSingleOrEven)
        }
      },
      onClickBig () {
        this.activeBtn = 'big'
        if (this.selectorValue !== 'sum') {
          this.computedLuzhu(this.bigOrSmall[this.selectorValue])
        } else {
          this.computedLuzhu(this.sumBigOrSmall)
        }
      },
      onSelectorChange (key) {
        if (key !== 'sum') {
          if (this.activeBtn === 'single') {
            this.computedLuzhu(this.singleOrEven[key])
          } else {
            this.computedLuzhu(this.bigOrSmall[key])
          }
        } else {
          this.computedLuzhu(this.activeBtn === 'single' ? this.sumSingleOrEven : this.sumBigOrSmall)
        }
      },
      computedLuzhu (data) {
        this.luzhuData = this.getPosition(data)
      },
      getPosition (data) {
        let result = []
        if (data && data.length) {
          let pre = ''
          let temp = []
          for (let i = 0; i < data.length; i++) {
            if (pre !== data[i] && i !== 0) {
              result.push(temp)
              temp = []
              temp.push(data[i])
            } else {
              temp.push(data[i])
            }
            pre = data[i]
          }
          if (temp.length > 0) {
            result.push(temp)
          }
        }
        return result
      },
      getLuzhu (y, x) {
        let _x = x - 1
        let _y = y - 1
        if (this.luzhuData.length && this.luzhuData.length > _x) {
          const group = this.luzhuData[_x]
          if (group.length && group.length > _y) {
            return this.luzhuData[_x][_y]
          }
          return ''
        }
        return ''
      },
      getLuzhuClass (y, x) {
        const luzhu = this.getLuzhu(y, x)
        if (luzhu) {
          if (luzhu === '大' || luzhu === '单') {
            return 'tab-tr_red2'
          } else if (luzhu === '和') {
            return 'tab-tr_green2'
          } else if (luzhu) {
            return 'tab-tr_blue1'
          } else {
            return ''
          }
        }
        return ''
      },
      toggleVisible ({visible}) {
        this.popupVisible = visible
        if (visible) {
          this.fetchLuzhuData()
        }
      }
    },
    computed: {
      ...mapGetters([
        'lotteryId',
        'lotteryGroupCode'
      ]),
      lmChangLong () {
        return []
      }
    }
  }
</script>
<style lang="less">
  .lu-zhu-wrapper__btn .vux-selector .weui-select {
    height: 30px;
    line-height: 30px;
  }

  .lu-zhu-wrapper__btn .weui-btn + .weui-btn {
    margin-top: 0;
  }
</style>
<style lang="less" scoped>
  .lu-zhu {
    overflow: hidden;
    .lu-zhu-wrapper {
      padding-left: 10px;
      .lu-zhu-wrapper__btn {
        padding: 5px;
        .btn_box {
          line-height: 30px;
          width: 100%;
          overflow: hidden;
          padding: 5px 0 5px 0;
          .lu-zhu-selector {
            height: 30px;
            width: 90px;
            border: 1px solid #bababa;
            border-radius: 5px;
          }
          .btn-font {
            display: inline-block;
            font-size: 13px;
          }
          .lu-zhu-btn {
            border: 0;
            color: black;
            width: 69px;
            height: 30px;
            line-height: 30px;
            &.active {
              background: #d23748;
              color: #fff;
            }
          }
        }
      }
      .lu-zhu-wrapper__box {
        .lu-zhu-wrapper__table {
          tbody {
            line-height: 1;
            td {
              padding: 1px;
              height: 20px;
              min-width: 22px;
              & > span.tab-tr_blue1, & > span.tab-tr_red2, & > span.tab-tr_green2 {
                display: inline-block;
                width: 100%;
                height: 100%;
                line-height: 20px;
                font-size: 12px;

                border-radius: 50%;
                color: #fff;
              }
              & > span.tab-tr_blue1 {
                background: #1aa3f1;
              }
              & > span.tab-tr_red2 {
                background: #f65857;
              }
              & > span.tab-tr_green2 {
                background: #33b178;
              }
            }
          }
        }
      }
    }
  }

  .chang-long {
    overflow: hidden;
    font-size: 13px;
    padding-bottom: 50px;
    .table-wrapper {
      padding: 10px 15px 0 15px;
      .vux-table td:before {
        border-bottom: 1px dashed #e4e4e4;
      }
      .vux-table:after {
        display: none;
      }
      .vux-table tr:last-child td:before {
        border-bottom-width: 0;
      }
    }
  }
</style>
