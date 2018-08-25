<template>
  <div>
    <tab :line-width='line_width'
         :active-color='active_color'
         v-model="index">
      <tab-item class="vux-center"
                :selected="selected.code === item.code"
                v-for="(item, index) in list"
                @click.native="toggleDown(item)"
                :key="index">
        {{item.name}}&nbsp;
        <div class="toggleDown"
             :style="item.show?'transform:rotate(180deg)':'transform:rotate(0deg)'">
        </div>
      </tab-item>
    </tab>

    <div class="hotList"
      :style="selected.code === 'hot' && selected.show ?'height:140px;overflow:auto':'height:0px; overflow:hidden'">
      <swiper height="140px"
              :show-dots="hotListTran&&hotListTran.length>1?true:false"
              dots-position="center"
              dots-class="dotsClass">
        <swiper-item v-for="(item, index) in hotListTran"
                     :key="index">
            <span v-for="(itemSub, index) in item" style="float: left;width: 33.33%;">
              <x-button class="linkButton"
                        style="width: 95%;" mini
                        @click.native="linkHandler(itemSub)">
                {{itemSub.gameName}}
              </x-button>
            </span>
        </swiper-item>
      </swiper>
      <!--<div><span class="delete">删除 <span class="delete_btn"></span></span></div>-->
    </div>

    <div class="likeList"
      :style="selected.code === 'like' && selected.show ?'height:140px;overflow:auto':'height:0px;overflow:hidden'">
      <swiper v-if="likeListTran&&likeListTran.length>0" height="140px"
              :show-dots="likeListTran&&likeListTran.length>1?true:false"
              dots-position="center"
              dots-class="dotsClass">
        <swiper-item v-for="(item, index) in likeListTran"
                     :key="index">
            <span v-for="(itemSub, index) in item"
                  style="float: left;width: 33.33%;position: relative"
                  v-if="item.length>0"
                  :class="showLikeDelete === true?'headShake':''">
              <x-button class="linkButton"
                        style="width: 95%;" mini
                        @click.native="linkHandler(itemSub)">
                {{itemSub.gameName}}
              </x-button>
              <transition name="slide-fade">
                <span @click.stop="deleteLike(itemSub)"
                      v-show="showLikeDelete === true"
                      class="delete_sub_btn headShake">
                  <x-icon type="close-circled" style="fill:#d23748" size="16"></x-icon>
                </span>
              </transition>
            </span>
          <span class="delete"
                @click="showDeleteLikeBtn">
            编辑
            <span class="delete_btn">
            </span>
          </span>
        </swiper-item>

      </swiper>
      <div v-else>
        <div class="noLike">暂无喜爱彩种</div>
        <div style="color: #d8d6d6">请在彩种选择栏中添加喜爱彩种</div>
      </div>
    </div>

    <div class="hotList"
      :style="selected.code === 'history' && selected.show ?'height:140px;overflow:auto':'height:0px;overflow:hidden'">
      <draw-history v-if="selected.code === 'history' && selected.show"
                    :height="'140px'"
                    :options="drawHistoryOptions">
      </draw-history>
    </div>
  </div>
</template>
<script>
  import { mapActions, mapGetters } from 'vuex'
  import { Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem } from 'vux'
  import DrawHistory from 'components/draw-history/draw-history'
  import { getHotLotteryGame, submitLikeGame } from 'api/common'
  import LotteryDrawBalls from 'components/lottery-draw-balls/lottery-draw-balls'
  import { changeCacheLike } from '@/assets/scripts/cache'
  import { ERR_OK } from '@/assets/const/config'
  export default {
    components: {
      Tab,
      TabItem,
      Sticky,
      Divider,
      XButton,
      Swiper,
      SwiperItem,
      DrawHistory,
      LotteryDrawBalls
    },
    data () {
      return {
        list: [
          {code: 'hot', name: '热门推荐', show: false},
          {code: 'like', name: '喜爱收藏', show: false},
          {code: 'history', name: '历史开奖', show: false}],
        hotList: [],
        selected: {},
        index: 0,
        line_width: 0,
        active_color: '#d23748',
        showLikeDelete: false
      }
    },
    computed: {
      likeListTran: function () {
        let arr = []
        let tempArr = []
        this.likeList.forEach(function (item, index) {
          if (tempArr.length >= 9) {
            arr.push(tempArr.slice(0))
            tempArr = []
          }
          tempArr.push(item)
        })
        if (tempArr.length > 0) {
          arr.push(tempArr.slice(0))
          tempArr = []
        }
        return arr
      },
      hotListTran: function () {
        let arr = []
        let tempArr = []
        this.hotList.forEach(function (item, index) {
          if (tempArr.length >= 9) {
            arr.push(tempArr.slice(0))
            tempArr = []
          }
          tempArr.push(item)
        })
        if (tempArr.length > 0) {
          arr.push(tempArr.slice(0))
          tempArr = []
        }

        return arr
      },
      drawHistoryOptions () {
        return {
          gameId: this.lotteryId,
          gameCode: this.lotteryCode,
          gameTypeCode: this.lotteryGroupCode
        }
      },
      ...mapGetters([
        'isShowLike',
        'isShowHot',
        'isShowHistory',
        'likeList',
        'lotteryId',
        'lotteryCode',
        'lotteryGroupCode'
      ])
    },
    created () {
      this.getLikeLotteryGame()
      this.getHotLotteryGame()
      this.selected = this.list[0]
    },
    methods: {
      ...mapActions([
        'fetchLikeList',
        'changeCollection'
      ]),
      linkHandler (item) {
        this.$router.push({path: `/credit/${item.typeCode}/${item.gameCode}`})
      },
      showDeleteLikeBtn () {
        this.showLikeDelete = !this.showLikeDelete
      },
      deleteLike (item) {
        const _this = this
        submitLikeGame({
          gameId: item.gameId
        }).then(res => {
          if (res.currentStatus === ERR_OK) {
            // this.$vux.toast.show({text: '已取消收藏'})
            _this.$dialog.toast({
              mes: '已取消收藏',
              timeout: 1500,
              icon: 'success'
            })
            _this.fetchLikeList()
            changeCacheLike(item.typeCode, item.gameId, 0)
            this.changeCollection({gameTypeCode: item.typeCode, gameId: item.gameId, like: 0})
          }
        }).catch(() => {})
      },
      toggleDown (item) {
        this.showLikeDelete = false
        this.line_width = 2

        this.list.forEach(tab => {
          if (tab.code === item.code) {
            if (this.selected.code === item.code) {
              if (!item.show) {
                item.show = true
                this.$emit(`on-show`, item)
              } else {
                item.show = false
                this.$emit(`on-hide`, item)
                this.line_width = 0
              }
            } else {
              item.show = true
              this.selected = item
              this.$emit(`on-show`, item)
              this.line_width = 2
            }
          } else {
            tab.show = false
          }
        })
      },
      getLikeLotteryGame () {
        this.fetchLikeList()
      },
      getHotLotteryGame () {
        getHotLotteryGame().then(res => {
          if (res.currentStatus === ERR_OK) {
            this.hotList = res.currentData
          }
        }).catch(() => {

        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @keyframes headShake {
    0% {
      transform: rotate(0deg);
    }

    20% {
      transform: rotate(-2deg);
    }

    40% {
      transform: rotate(2deg);
    }

    60% {
      transform: rotate(-2deg);
    }

    80% {
      transform: rotate(2deg);
    }
    100% {
      transform: rotate(0deg);
    }
  }

  .headShake {
    animation-timing-function: ease-in-out;
    animation-name: headShake;
    animation-iteration-count: infinite;
    animation-duration: 0.6s;
  }

  .box {
    padding: 15px;
  }

  .active-6-1 {
    color: rgb(252, 55, 140) !important;
    border-color: rgb(252, 55, 140) !important;
  }

  .active-6-2 {
    color: #04be02 !important;
    border-color: #04be02 !important;
  }

  .active-6-3 {
    color: rgb(55, 174, 252) !important;
    border-color: rgb(55, 174, 252) !important;
  }

  .tab-swiper {
    background-color: #fff;
    height: 150px;
  }

  .hotList, .likeList {
    text-align: center;
    position: relative;
  }

  .hotList button, .likeList button {
    margin-top: 4px;
  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }

  .slide-fade-leave-active {
    transition: all .3s ease(1.0, 0.5, 0.8, 1.0);
  }

  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */
  {
    transform: translateX(-10px);
    opacity: 0;
  }

  .linkButton {
    padding: 0;
    height: 35px;
    overflow: inherit;
    color: #001e1e;
  }

  .delete {
    position: absolute;
    right: 18px;
    bottom: 0px;
    font-size: 14px;
    color: #df3d3b;
  }

  .toggleDown {
    background: url('./toggleDown.png') no-repeat;
    background-size: 100% 100%;
    width: 18px;
    transition: all 0.3s;
    height: 18px;
    display: inline-block;
    vertical-align: sub;
  }

  .delete_btn {
    background: url('./delete.png') no-repeat;
    background-size: 100% 100%;
    transition: all 0.3s;
    height: 16px;
    width: 16px;
    display: inline-block;
    vertical-align: sub;
  }

  .noLike {
    font-size: 20px;
    margin-top: 42px;
    margin-bottom: 10px;
    color: #d8d6d6;
  }

  .likeList, .hotList {
    transition: 0.3s all;
    background: #fff;
  }
  .vux-tab .vux-tab-item {
    font-size: 0.875rem;
  }
  .weui-btn_mini {
    font-size: 0.8125rem;
  }
</style>
<style>
  .dotsClass .active {
    background-color: #d23748 !important;
  }

  .dotsClass {
    bottom: -4px !important;
  }

  .delete_sub_btn {
    transition: all 0.3s;
    height: 16px;
    width: 16px;
    display: inline-block;
    vertical-align: sub;
    position: absolute;
    top: 0px;
    left: 0px;
  }

  .play-group-scroll {
    background: #fff;
  }
  .vux-table:after{
    border-top: none!important;
  }

</style>
