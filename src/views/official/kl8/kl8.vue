<template>
  <div class="content-wrapper">
    <lottery-timer ref="drawTimer"></lottery-timer>
    <game-collecting @on-show="onCollectingShow" @on-hide="onCollectingHide"></game-collecting>
    <flexbox :gutter="0" :align="'flex-start'" class="content">
      <flexbox-item :span="3">
        <Scroller ref="playsScroll" class="lottery-plays-scroll" lock-x scrollbar-y
                  :height="collecting?'-344px': '-203px'">
          <ul class="lottery-plays">
            <li>玩法选择</li>
            <li v-for="(item,index) in playList" :class="{active:playIndex===index}"
                @click="_onPlayClick(item.id,index)">
              {{item.ruleMasterName}}
            </li>
          </ul>
        </Scroller>
      </flexbox-item>
      <flexbox-item :span="9">
        <spinner class="spinner-loading" type="bubbles" size="80px" v-show="!playGroupList.length"></spinner>
        <swiper :show-dots="false" :height="height">
          <swiper-item>
            <Scroller ref="playGroupScroll" class="play-group-scroll" lock-x scrollbar-y
                      :height="collecting?'-344px': '-203px'">
              <div>
                <template v-for="(group,x) in playGroupList">
                  <flexbox :wrap="'wrap'" :align="'flex-start'" :gutter="0">
                    <flexbox-item class="play-group-title">
                      <div class="title">{{group.ruleMasterName}}</div>
                    </flexbox-item>
                  </flexbox>
                  <flexbox :wrap="'wrap'" :align="'flex-start'" :gutter="0">
                    <flexbox-item :span="6" class="play-group-item" v-waves
                                  v-for="(item,y) in group.gameRuleDetailList" :key="item.id"
                                  :class="{selected:isSelected(item.id)}">
                      <div class="item" @click="handleBet(group.ruleMasterName,item)">
                        <span class="text"
                              :class="isNumber(item.showName)?`mid-ball kl8-ball-${item.showName}`: ''">{{item.showName}}</span>
                        <span class="odds">{{item.ruleOdds}}</span>
                        <i class="icon"></i>
                      </div>
                    </flexbox-item>
                  </flexbox>
                </template>
              </div>
            </Scroller>
          </swiper-item>
        </swiper>
      </flexbox-item>
    </flexbox>
    <foot-bars></foot-bars>
  </div>
</template>

<script>
  import {Flexbox, FlexboxItem, Swiper, SwiperItem, Scroller, Spinner} from 'vux'
  import LotteryTimer from 'components/credit-lottery-timer/credit-lottery-timer'
  import FootBars from 'components/credit-foot-bars/credit-foot-bars'
  import GameCollecting from 'components/game-collecting/game-collecting'
  import {mapGetters} from 'vuex'

  export default {
    components: {
      Swiper,
      SwiperItem,
      Flexbox,
      FlexboxItem,
      LotteryTimer,
      FootBars,
      Scroller,
      Spinner,
      GameCollecting
    },
    computed: {
      ...mapGetters([
        'lotteryCode',
        'lotteryName'
      ])
    },
    created () {
      console.log(111)
    },
    methods: {
      $init () {
        this.$refs.timer.$init(this.lotteryCode, false)
      },
      handleRouter (item, index) {
        this.playIndex = index
        this.$router.push({path: `/official/pk10/${this.lotteryCode}/${this.lotteryName}/${item.code}`})
      },
      onCollectingShow () {
        this.collecting = true
      },
      onCollectingHide () {
        this.collecting = false
      }
    },
    watch: {
      lotteryCode (val) {
        this.$init()
      }
    },
    beforeRouteEnter (to, from, next) {
      if (!from.path) return false
      next(vm => {
        vm.$init()
      })
    }
  }
</script>

<style lang="less" scoped>
  .content-wrapper {
    .content {
      border-top: solid 1px #dcdcdc;
      .lottery-plays-scroll {
        background: #ebebeb;
        ul {
          text-align: center;
          list-style-type: none;
          li {
            height: 35px;
            line-height: 35px;
            font-size: 14px;
            border-bottom: 1px solid #fff;
            color: #5d5d5d;
            &.active {
              background: #d23748;
              color: #fff;
              border-bottom: 1px solid #9a1a28;
            }
            &:first-child {
              border-right: solid 1px #dcdcdc;
              height: 31px;
              line-height: 31px;
            }
            &.active:before {
              background: #fdcb00 !important;
            }
            &:not(:first-child):before {
              content: "";
              display: block;
              width: 6px;
              height: 6px;
              border-radius: 50%;
              -webkit-border-radius: 50%;
              background: #ccc;
              position: absolute;
              left: 6px;
              margin-top: 15px
            }
          }
        }
      }

    }
  }
</style>
