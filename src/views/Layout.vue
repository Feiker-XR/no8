<template>
  <drawer
    :show.sync="drawerVisibility"
    :show-mode="showModeValue"
    :placement="showPlacementValue"
    :drawer-style="{'background-color':'#fff', width: '80%'}">
    <!--左侧菜单栏--->
    <div slot="drawer">
      <drawer-header></drawer-header>
      <drawer-body @onRouterClick="drawerVisibility = false"></drawer-body>
    </div>

    <view-box ref="viewBox" body-padding-top="46px" body-padding-bottom="48px">
      <!--标题--->
      <x-header
        slot="header"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;"
        :left-options="leftOptions"
        :title="headerTitle"
        :transition="headerTransition"
        @on-click-more="onClickMore">
        <template v-if="isLotteryPage">
          <span class="header-show-drawer"
                slot="overwrite-left"
                @click="drawerVisibility = true">
            彩种选择
          </span>
          <span slot="right" @touchmove.prevent>
            <dropdown-menu
              ref="dropDownMenu"
              @onToggle="onDropdownMenu"
              @onRuleClick="onRuleClick"
              @onShowPopup="onShowPopup">
            </dropdown-menu>
          </span>
        </template>
        <template v-if="isChartPage">
          <div slot="right" style="margin-top: -5px;" @click="setChartConfigVisible({visible: true})">
            <x-icon type="ios-gear-outline" size="30" style="fill:#fff;"></x-icon>
          </div>
        </template>
      </x-header>

      <!--<transition
        @after-enter="$vux.bus && $vux.bus.$emit('vux:after-view-enter')"
        :name="viewTransition" :css="!!direction">

      </transition>-->
      <transition name="slide">
        <router-view class="router-view" :key="updateRouter" :betSuceess="betSuceess"></router-view>
      </transition>

      <transition name="view-box-mask">
        <div class="view-box-mask" v-show="viewBoxVisible"></div>
      </transition>
    </view-box>

    <div v-transfer-dom @touchmove.prevent>  <!--投注对话框-->
      <component :is="dialogType"
                 :show="betsDialogVisible"
                 @onCancel="onBetDialogCancel"
                 @onSubmit="submitBets">
      </component>
    </div>
    <div v-transfer-dom @touchmove.prevent> <!-- 玩法对话框 ---->
      <game-rule-dialog :show="showRule" @onCancel="showRule=false"></game-rule-dialog>
    </div>

    <div v-transfer-dom @touchmove.prevent> <!--- 两面长龙对话框 --->
      <lm-chang-long ref="lmChangLong"></lm-chang-long>
    </div>
  </drawer>
</template>

<script>
  import { Drawer, ViewBox, XHeader, Loading, Popup } from 'vux'
  import { mapState, mapActions, mapGetters, mapMutations } from 'vuex'
  import DrawerBody from 'components/drawer-body/drawer-body'
  import DrawerHeader from 'components/drawer-header/drawer-header'
  import TransferDom from 'directive/transfer-dom/index'
  import BetDetailsDialog from 'components/bet-details-dialog/bet-details-dialog'
  import GameRuleDialog from 'components/game-rule-dialog/game-rule-dialog'
  import DropdownMenu from 'components/dropdown-menu/dropdown-menu'
  import LmChangLong from 'components/lm-chang-long/lm-chang-long'
  import OfficialBetDialog from 'components/official/bet-detail-dialog/bet-detail-dialog'
  import {getMenus} from '@/assets/scripts/cache'

  export default {
    data () {
      return {
        showRule: false,
        showMenu: false,
        showMode: 'push',
        showModeValue: 'push',
        showPlacement: 'left',
        showPlacementValue: 'left',
        drawerVisibility: false,
        viewBoxVisible: false,
        betSuceess: false,
        dialogType: BetDetailsDialog  // 默认对话框
      }
    },
    directives: {
      TransferDom
    },
    components: {
      DrawerBody,
      DrawerHeader,
      Drawer,
      ViewBox,
      XHeader,
      Loading,
      BetDetailsDialog,
      GameRuleDialog,
      DropdownMenu,
      LmChangLong,
      Popup,
      OfficialBetDialog
    },
    methods: {
      onShowPopup () {
        this.$refs['dropDownMenu'].closeMenusPopup()
        const target = this.$refs['lmChangLong']
        target.toggleVisible({visible: true})
      },
      onRuleClick () {
        this.$refs['dropDownMenu'].closeMenusPopup()
        this.showRule = true
      },
      onBetDialogCancel () {
        this.setBetsDialogVisible({visible: false})
      },
      onDropdownMenu (toggle) {
        this.viewBoxVisible = toggle
      },
      onClickMore () {
        this.showMenu = true
      },
      submitBets (action) { // action 表示官方或信用玩法的下注方法
        const _this = this
        if (_this.isLoading) return
        _this.updateLoadingStatus({isLoading: true})
        _this.setBetsDialogVisible({visible: false})
        action().then(() => {
          _this.updateLoadingStatus({isLoading: false})
          _this.$dialog.toast({
            mes: '投注成功',
            timeout: 1500,
            icon: 'success',
            callback: () => {
              _this.refreshUserBalance()
            }
          })
          _this.betSuceess = !_this.betSuceess
        }).catch(error => {
          _this.updateLoadingStatus({isLoading: false})
          _this.$vux.toast.text(error.message, 'top')
        })
      },
      ...mapActions([
        'refreshUserBalance'
      ]),
      ...mapMutations([
        'updateLoadingStatus',
        'SET_LOTTERY_CODE',
        'SET_LOTTERY_GROUP_CODE',
        'SET_LOTTERY_NAME',
        'SET_HEADER_TITLE',
        'SET_LOTTERY_ID',
        'SET_LOTTERY_GROUP_ID'
      ]),
      ...mapMutations({
        setChartConfigVisible: 'TOGGLE_CHART_CONFIG_VISIBLE',
        setBetsDialogVisible: 'SET_BETS_DIALOG_VISIBLE',
        toggleLmChangLongVisible: 'TOGGLE_LM_CHANG_LONG_VISIBLE',
        toggleLmChangLongIndex: 'TOGGLE_LM_CHANG_LONG_VISIBLE'
      })
    },
    created () {
      this.refreshUserBalance()
    },
    computed: {
      ...mapGetters([
        'betsDialogVisible',
        'betList',
        'lotteryId',
        'lotteryCode'
      ]),
      ...mapState({
        route: state => state.route,
        path: state => state.route.path,
        direction: state => state.vux.direction,
        headerTitle: state => state.headerTitle,
        isLoading: state => state.vux.isLoading
      }),
      leftOptions () {
        return {
          showBack: this.route.path !== '/',
          preventGoBack: false
        }
      },
      isChartPage () {
        return this.route.path.indexOf('trendChart') !== -1
      },
      isLotteryPage () {
        const router = ['drawHistory', 'panInfo', 'betRecord', 'instantBetting', 'currentBet/detail', 'todayTotalWin', 'trendChart']
        return !router.some(item => this.route.path.indexOf(item) > -1)
      },
      headerTransition () {
        if (!this.direction) return ''
        return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
      },
      viewTransition () {
        if (!this.direction) return ''
        return 'vux-pop-' + (this.direction === 'forward' ? 'in' : 'out')
      },
      updateRouter () {     // 更新路由信息
        let _menus = getMenus()
        const lotteryCode = this.$route.params.gameCode   // 彩种号
        const lotteryGroupCode = this.$route.params.groupCode   // 组号
        let lotteryGroupId = ''  // 组id
        let lotteryId = ''    // 彩种id
        let lotteryName = ''  // 彩种名称
        let subMenu = []
        if (this.$route.path.startsWith('/credit')) {
          subMenu = _menus.credit
          this.dialogType = BetDetailsDialog
        } else {
          subMenu = _menus.official
          this.dialogType = OfficialBetDialog
        }
        subMenu.forEach((item) => {
          if (item.typeCode === lotteryGroupCode) {
            item.children.forEach((val) => {
              if (val.gameCode === lotteryCode) {
                if (val.typeId) {
                  lotteryGroupId = val.typeId
                }
                if (val.gameId) {
                  lotteryId = val.gameId
                }
                if (val.gameName) {
                  lotteryName = val.gameName
                }
              }
            })
          }
        })
        // 官方
        this.SET_LOTTERY_CODE(lotteryCode)      // 彩种代码

        this.SET_LOTTERY_GROUP_CODE(lotteryGroupCode)      // 组代码

        this.SET_LOTTERY_NAME(lotteryName)    // 名称

        this.SET_HEADER_TITLE(lotteryName)
        // 信用
        if (lotteryId) {  // 彩种id
          this.SET_LOTTERY_ID(lotteryId)
        }
        if (lotteryGroupId) { // 组id
          this.SET_LOTTERY_GROUP_ID(lotteryGroupId)
        }
        console.log('___Layout更新路由: 设置相关参数 ' + lotteryCode)
        return lotteryCode
      }
    }
  }
</script>

<style lang="less">
  .weui-tab__panel {
    position: fixed;
    width: 100%;
  }
  .yd-notify{
    line-height: 30px!important;
    font-size: 0.8125rem!important;
    height: 30px;
  }

  .router-view {
    width: 100%;
    top: 46px;
  }

  .header-show-drawer {
    display: inline-block;
    padding: 0.3125rem 0.625rem;
    border: 1px solid #fff;
    border-radius: 20px;
    margin-top: -6px;
    cursor: pointer;
    color: #fff;
  }

  .vux-header {
    background: url('head_bg.jpg') no-repeat center !important;
    background-size: cover !important;
  }
  .vux-header .vux-header-left {
    left: 11px !important;
  }
  .vux-header .vux-header-left, .vux-header .vux-header-right {
    top: 13px !important;
  }

  .view-box-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    opacity: 1;
    background: rgba(0, 0, 0, 0.2);
  }

  &.view-box-mask-enter-active, &.view-box-mask-leave-active {
    transition: all 0.5s;
  }

  &.view-box-mask-enter, &.view-box-mask-leave-active {
    opacity: 0;
    background: rgba(7, 17, 27, 0);
  }

  @font-face {
    font-family: 'iconfont';
    src: url("../assets/fonts/iconfont.eot");
    src: url("../assets/fonts/iconfont.eot?#iefix") format("embedded-opentype"),
         url("../assets/fonts/iconfont.woff") format("woff"),
         url("../assets/fonts/iconfont.ttf") format("truetype"),
         url("../assets/fonts/iconfont.svg#iconfont") format("svg");
  }

  i {
    font-family: "iconfont";
    font-size: 16px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -webkit-text-stroke-width: 0.2px;
    background: transparent;
    cursor: pointer;
    -webit-user-select: none;
    user-select: none;
  }

  .vux-pop-out-enter-active,
  .vux-pop-out-leave-active,
  .vux-pop-in-enter-active,
  .vux-pop-in-leave-active {
    will-change: transform;
    transition: all 500ms;
    height: 100%;
    top: 46px;
    position: absolute;
    backface-visibility: hidden;
    perspective: 1000;
  }

  .vux-pop-out-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  .vux-pop-out-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .vux-pop-in-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .vux-pop-in-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  /**路由动画**/
  .slide-enter {
    transform: translate3d(100%,0,0);
    opacity: 0;
  }
  .slide-enter-active {
    transition: all .15s;
  }
</style>
