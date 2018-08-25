<template>
  <div>
    <tab :line-width=2 :active-color="activeTabColor" v-model="activeTabIndex">
      <tab-item :selected="activeTab === item.id"
        v-for="(item, index) in tabMenus"
        :key="'tab'+index"
        @click="activeTab = item.id">
        {{item.value}}
      </tab-item>
    </tab>
    <swiper v-model="activeTabIndex"
      :aspect-ratio="2"
      :show-dots="false"
      :disableTouch="true">
      <swiper-item v-for="(menuList, menuType) in userMenuList"
        :key="menuType"
        :swiper-key="menuType">
        <Scroller :ref="'scroll'+menuType" lock-x scrollbar-y :height="'-170px'">
          <div>
            <flexbox orient="vertical"
              :gutter="2" v-for="(group, groupIndex) in menuList"
              :key="menuType+group.typeCode"
              :category-key="menuType+group.typeCode">
              <flexbox-item class="group-item-flexbox">
                <div class="group-item-flexbox__wrapper">
                  <flexbox @click.native="onVisible(group, menuType)" class="header_flexbox">
                    <flexbox-item class="title"
                      :class="{'is-active':group.isShow}"
                      :span="4">
                      <div>
                        <i class="icon">&#xe600;</i><span>{{group.gameTypeName}}</span>
                      </div>
                    </flexbox-item>
                    <flexbox-item :span="8">
                      <transition name="fade">
                        <div v-show="!group.isShow">
                          <span style="color: #d23747;">{{group.children.length}}</span>个游戏
                        </div>
                      </transition>
                    </flexbox-item>
                  </flexbox>
                  <collapse-transition>
                    <div v-show="group.isShow" class="games-flexbox">
                      <grid :cols="2" :show-lr-borders="true" :show-vertical-dividers="false"
                        class="games-flexbox__grid" :class="{isEven : (group.children.length)%2 == 0}">
                        <grid-item v-for="item in group.children"
                          :lottery-key="menuType+item.gameId"
                          :key="menuType+item.gameId"
                          @click.native="onRouterClick(menuType,group,item)">
                          <flexbox :gutter="0"
                            :wrap="'wrap'"
                            :align="'flex-start'">
                            <flexbox-item :span="4">
                              <i class="side-item-left" v-if="group.typeCode == 'ssc'">&#xe65d;</i>
                              <i class="side-item-left" v-else-if="group.typeCode === 'klc'">&#xe609;</i>
                              <i class="side-item-left" v-else-if="group.typeCode === 'pk10'">&#xe65e;</i>
                              <i class="side-item-left" v-else-if="group.typeCode === 'k3'">&#xe65b;</i>
                              <i class="side-item-left" v-else-if="group.typeCode === 'xgc'">&#xe658;</i>
                              <i class="side-item-left" v-else-if="group.typeCode === 'c11x5'">&#xe660;</i>
                              <i class="side-item-left" v-else-if="group.typeCode === 'klsf'">&#xe659;</i>
                              <i class="side-item-left" v-else-if="group.typeCode === 'kl8'">&#xe65f;</i>
                              <i class="side-item-left" v-else-if="group.typeCode === 'ssl'">&#xe65d;</i>
                            </flexbox-item>
                            <flexbox-item :span="8">
                              <div class="side-item-right">
                                <div>{{item.gameName}}</div>
                                <span class="box-collect" @click.stop="onCellCollect(group.typeCode,item)"
                                  :class="{yet: item.isLike == '1' }">
                                  <i>&#xe60b;</i>{{ item.isLike == '1' ? '已收藏' : "收 藏" }}
                                </span>
                              </div>
                            </flexbox-item>
                          </flexbox>
                        </grid-item>
                      </grid>
                    </div>
                  </collapse-transition>
                </div>
              </flexbox-item>
            </flexbox>
          </div>
        </Scroller>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  import {Tab, TabItem, SwiperItem, Flexbox, FlexboxItem, Grid, GridItem, GroupTitle, Scroller} from 'vux'
  import Swiper from 'components/base/swiper/swiper.vue'
  import CollapseTransition from '@/assets/scripts/collapse-transition'
  import { changeCacheLike } from '@/assets/scripts/cache'  // getMenus
  import {mapGetters, mapActions, mapMutations} from 'vuex'
  import {submitLikeGame} from 'api/common'
  import {ERR_OK} from '@/assets/const/config'

  export default {
    components: {
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
      Scroller,
      Flexbox,
      FlexboxItem,
      Grid,
      GridItem,
      GroupTitle,
      CollapseTransition
    },
    computed: {
      tabMenus () {
        return [{id: 1, value: '信用玩法'}, {id: 2, value: '官方玩法'}]
      },
      ...mapGetters([
        'userMenuList'
      ])
    },
    data () {
      return {
        isActive: true,
        activeTabColor: '#d23748',
        activeTabIndex: 0,
        activeTab: '信用玩法'
      }
    },
    methods: {
      ...mapActions([
        'toggleGroupMenu',
        'fetchLikeList',
        'changeCollection'
      ]),
      ...mapMutations({
        setDrawerVisible: 'SET_DRAWER_VISIBLE',
        setHeaderTitle: 'SET_HEADER_TITLE',
        setLotteryCode: 'SET_LOTTERY_CODE',
        setLotteryName: 'SET_LOTTERY_NAME',
        setGroupCode: 'SET_LOTTERY_GROUP_CODE',
        setLotteryGroupId: 'SET_LOTTERY_GROUP_ID',
        setLotteryId: 'SET_LOTTERY_ID',
        setUserCreditMenuList: 'SET_USER_CREDIT_MENU_LIST'
      }),
      onCellCollect (gameTypeCode, game) {
        submitLikeGame({gameId: game.gameId}).then(response => {
          const {currentStatus} = response
          if (currentStatus === ERR_OK) {
            this.$vux.toast.show({text: game.isLike === 1 ? '已取消收藏' : '收藏成功'})
            const newLike = game.isLike === 1 ? 0 : 1
            changeCacheLike(gameTypeCode, game.gameId, newLike)
            this.changeCollection({gameTypeCode: gameTypeCode, gameId: game.gameId, like: newLike})
            this.fetchLikeList()
          }
        }).catch(() => {
        })
      },
      onRouterClick (type, group, item) {
        const _this = this
        _this.$emit('onRouterClick')
        const lotteryGroupCode = group.typeCode   // 组号
        const lotteryCode = item.gameCode         // 彩种号
        const url = {path: `/${type}/${lotteryGroupCode}/${lotteryCode}`}
        _this.$router.push(url)
      },
      onVisible (group, type) {
        console.log('onVisible')
        const _this = this
        _this.toggleGroupMenu({typeCode: group.typeCode, type})
        setTimeout(() => {
          // _this.$refs['scroll' + type].reset()
        }, 300)
      }
    }
  }
</script>
<style lang="less" scoped>
  .collapse-transition {
    transition: 0.3s height ease-in-out, 0.3s padding-top ease-in-out, 0.3s padding-bottom ease-in-out;
  }

  .weui-grid:after {
    display: none;
  }

  .weui-grid {
    padding-left: 5px;
    padding-right: 0;
    border-bottom: 1px dashed #dcdcdc;
  }

  .games-flexbox__grid .weui-grid:last-child {
    border-bottom: 0;
  }

  .isEven .weui-grid:last-child,
  .isEven .weui-grid:nth-last-child(2) {
    border-bottom: 0;
  }

  .group-item-flexbox {
    border-bottom: solid .2rem rgb(246, 245, 245);
    .group-item-flexbox__wrapper {
      overflow: hidden;
      .header_flexbox {
        font-size: 14px;
        .title {
          height: 44px;
          line-height: 44px;
          color: #d53b4e;
          .icon {
            font-size: 18px;
            margin: 0 5px 0 5px;
            transition: transform .3s;
            float: left;
            line-height: 44px;
            font-weight: 300;
          }
          &.is-active .icon {
            transform: rotate(180deg);
          }
        }

        .fade-enter-active, .fade-leave-active {
          transition: opacity .5s;
        }
        .fade-enter, .fade-leave-to {
          opacity: 0;
        }
      }
      .games-flexbox {
        will-change: height;
        .games-flexbox__grid {
          .side-item-left {
            display: inline-block;
            width: 45px;
            height: 45px;
            line-height: 45px;
            align-self: center;
            text-align: center;
            font-size: 22px;
            color: #fff;
            background: linear-gradient(140deg, #d53c3e, #f36251);
            border-radius: 50%;
          }
          .side-item-right {
            color: #001e1e;
            font-size: 12px;
            .box-collect.yet {
              color: #888;
            }
            .box-collect {
              display: inline-block;
              padding-top: 4px;
              font-size: 12px;
              color: #d53b4e;
              border-radius: 15px;
              i {
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
  }
</style>
