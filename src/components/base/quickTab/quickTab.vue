<template>
    <div class="ssc-tabs-wrapper">
      <Scroller :ref="`tabsScroll`"
        lock-y
        style=" width: 96%; height: 45px; z-index:7;">
        <div :style="{ width: `${tabList.length * 84}px` }"
          class="clear-fix">
          <div v-for="(tab, index) in tabList"
            class="ssc-tab-item"
            :key="tab.value">
            <a class="ssc-tabs-link"
              :class="{ 'now-hov': nowHoverMenu === index }"
              @click="changeSSCTab(tab, index)"
              href="javascript:;">{{tab.label}}</a>
          </div>
        </div>
      </Scroller>

      <a class="look-all"
        @click="showAllTab = !showAllTab"
        href="javascript:;">
        <img class="pk10-tab-icon"
          :style="{ transform: `rotate(${ showAllTab ? 0 : 180}deg)` }"
          src="./pk10_tab_icon.png"
          alt="">
      </a>
      <div class="transitionbox" v-show="showCurtion" :style="{ 'height': `${hg}+px`}" ref="transitionbox">
        <transition name="showlist" @before-enter="beforeEnter" @after-leave="afterLeave" :css="true">
          <div class="all-tabs" v-show="showAllTab">
            <div class="all-tab-item"
              :key="tab.value"
              v-for="(tab, index) in tabList">
              <a class="ssc-tabs-link"
                :class="{ 'now-hov': nowHoverMenu === index }"
                @click="changeSSCTab(tab, index, true)"
                href="javascript:;">{{tab.label}}
              </a>
            </div>
          </div>
        </transition>
      </div>
    </div>
</template>

<script>
  // :style="{ height: `${showAllTab ? Math.ceil( tabList.length / 4 ) * 57 + 10 : 0}px` }  v-if="showAllTab""
  import { Scroller } from 'vux'
  export default {
    data () {
      return {
        showAllTab: false,
        nowHoverMenu: 0,
        showCurtion: false, // 设置外层容器是否显示
        hg: 0    // 设置外层容器的高
      }
    },
    components: {
      Scroller
    },
    mounted () {
      this.$refs['transitionbox'].style.height = (window.innerHeight - 44 - 88 - 36 - 46) + 'px'
    },
    props: {
      tabList: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    methods: {
      changeSSCTab (tab, index, flag) {
        let _left = 0
        if (flag && this.tabList.length > 4) {
          if (index < (this.tabList.length + 1) - 4) {
            _left = index * 82
          } else {
            _left = (this.tabList.length - 4) * 82
          }
          this.$refs.tabsScroll.reset({
            left: _left
          }, 300, 'ease-in-out')
        }
        this.showAllTab = false
        this.nowHoverMenu = index
        this.$emit('tabchanged', tab.value)
      },
      afterLeave () {
        this.showCurtion = false
      },
      beforeEnter () {
        this.showCurtion = true
      }
    }
  }
</script>

<style scoped>
  .all-tabs {
    position: absolute;
    /*transition: height .2s ease-out, opacity .2s ease-in-out;*/
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    -webkit-transform-style: preserve-3d;
    -webkit-transform: translateZ(0) scale(1.0, 1.0);
    overflow: hidden;
    left: 0;
    background-color: #f5f6f7;
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: row;
    margin-bottom: 25px;
    justify-content: center;
    flex-wrap: wrap;
    /*top:35px;*/
    top: 0;
    box-sizing: border-box;
    padding: 10px;
    padding-top: 0;
    opacity: 1;
    height: auto;
  }
  .transitionbox {
    width: 100%;
    height: 28.2rem;
    background: rgba(0,0,0,0.3);
    z-index: 100;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 47px;
  }
  .showlist-enter-active, .showlist-leave-active {
    transition: transform .3s;
    transform: translateY(0);
  }
  .showlist-enter, .showlist-leave-to {
    transform: translateY(-100%);
  }
  .all-tab-item {
    flex-basis: 22%;
    box-sizing: border-box;
    height: 46px;
    border-radius: 4px;
    text-align: center;
    margin: 11px 4px 0 5px;
  }

  .all-tabs .all-tab-item{
    height: 32px;
    box-sizing: border-box;
    margin-top: 22px;
  }
  .all-tabs .all-tab-item a{
    line-height: 32px;
    border:1px solid #ccc;
  }
  .all-tabs .all-tab-item a.now-hov{
    /*border: 1px solid #d53b4e;*/
    background: url('border-bg.png') no-repeat center center;
    background-size: 100% 100%;
    border: none;
    border-radius: 0;
  }
  .clear-fix::after {
    content: '';
    display: block;
    clear: both;
  }
  .ssc-tabs-wrapper {
    height: 46px;
    position: relative;
    padding: 5px 10px;
    background-color: #f5f6f7;
    width: 100%;
    box-sizing: border-box;
    border-top: none;
    margin-top: 0px;
  }
  .ssc-tabs-wrapper:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    /*height: 1px;
    border-bottom: 1px solid #C7C7C7;*/
    color: #C7C7C7;
    transform-origin: 0 100%;
    transform: scaleY(0.5);
  }

  .ssc-tabs-link {
    box-sizing: border-box;
    display: inline-block;
    float: left;
    text-align: center;
    width: 100%;
    border-radius: 6px;
    line-height: 2.5;
    height: 100%;
    color: #606060;
    font-size: 14px;
    font-size: 0.875rem;
  }
  .pk10-tab-icon {
    width: 16px;
    transition: transform .3s ease-in-out;
    float: right;
  }
  .now-hov {
    color: #d53b4e;
    /*border: 1.4px solid #d53b4e;*/
    /*background: #fff;*/
    background: url('border-bg.png') no-repeat center center;
    background-size: contain;
    border-radius: 0;
  }
  .look-all {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 0px;
    background: #f5f6f7;
    height: 40px;
    width: 40px;
    z-index: 7;
  }
  .look-all img {
    margin: 14px;
  }
  .ssc-tab-item {
    float: left;
    box-sizing: border-box;
    /*min-width: 65px;*/
    min-width: 82px;
  }
</style>
