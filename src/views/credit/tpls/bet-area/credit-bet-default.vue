<template>
  <flexbox :gutter="0" :align="'flex-start'" class="content">
    <!-- 左侧快捷导航选择 -->
    <flexbox-item :span="3" v-if="showLeftSide">
      <Scroller :ref="`playsScroll`"
        class="lottery-plays-scroll"
        lock-x
        scrollbar-y
        :height="collecting ? '-403px' : '-262px'">   <!--'collecting ? '-403px' : '-262px''-->
        <ul class="lottery-plays">
          <li v-for="(item, index) in sidebar"
            :class="{active: item.choosen}"
            @click="chooseNUM(item, true)"
            :key="index">
            {{item.label}}
          </li>
        </ul>
      </Scroller>
    </flexbox-item>
    <!-- 右边内容区 -->
    <flexbox-item :span="showLeftSide ? 9 : 12">
      <transition name="slide-fade" mode="out-in">
        <Scroller :ref="`playGroupScroll`"
          lock-x
          scrollbar-y
          :height="collecting ? '-403px' : '-262px'"
          :key="changeTab">
          <div class="ssc-kj-box"><!--'-403px' : '-262px'-->
            <section v-for="(item, index) in listData"
              v-if="JSON.stringify(item) !== '{}'"
              :key="index">
              <div class="ssc-kj-item title" v-if="!showLeftSide">{{ item.name }}</div>
              <div :class="[showLeftSide ? '' : 'smaller','ssc-kj-item']"
                v-for="(_item, _index) in item.sz"
                @click="chooseNUM(_item)"
                :key="_index">
                <div :class="{'active' : _item.choosen }">
                  {{ _item.displayName }}
                </div>
                <p :class="{ 'active' : _item.choosen }">
                  {{ _item.odds }}
                </p>
              </div>
              <div class="ssc-kj-item-big">
                <div class="ssc-kj-item-inner">
                  <div :class="[_item.choosen ? 'active' : '', 'ssc-kj-item-inner-item']"
                    v-for="(_item, _index) in item.dxds"
                    @click="chooseNUM(_item)"
                    :key="_index">
                    <div>{{ _item.displayName }}</div>
                    <p>{{ _item.odds }}</p>
                    <i :class="[{'icon1': showLeftSide },'icon']" v-if="_item.choosen"></i>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </Scroller>
      </transition>
    </flexbox-item>
  </flexbox>
</template>

<script>
  import { Flexbox, FlexboxItem, Swiper, SwiperItem, Scroller, Spinner } from 'vux'
  import {betMIX} from './betarea.mixin'
  export default {
    name: 'credit-bet-default',
    components: {
      Flexbox,
      FlexboxItem,
      Scroller,
      Swiper,
      SwiperItem,
      Spinner
    },
    mixins: [betMIX]
  }
</script>

<style scoped lang="less">
  @import "credit";
  .ssc-kj-item-inner-item {
    position: relative;     /** 相对定位,便于定位icon ***/
    background: url('../../../../assets/images/border-bg.png') no-repeat center center;
    background-size: 100% 100%;
    height: 45px;
  }
  .ssc-kj-item-inner-item > div {
    font-size: 17px;
    font-size: 1rem;
    color: #333;
    line-height: 1.5;
    font-weight: 600;
  }
  .ssc-kj-item-inner-item > p {
    line-height: 1;
    font-size: 14px;
    font-size: 0.875rem;
    color: #666;
  }
  .ssc-kj-item-big {
    flex-basis: 100%;
    height: auto;
  }
  .ssc-kj-item > div {
    width: 50px;
    margin: 0 auto;
    border-radius: 50%;
    height: 50px;
    background: url('../../../../assets/images/border-bg_circle.png') no-repeat center center;
    background-size: 100% 100%;
    color: #d53b4e;
    line-height: 50px;
    text-align: center;
    font-size: 22px;
    font-size: 1.875rem;
    font-weight: normal;
  }
  .ssc-kj-item > div.active{
    background: #d53b4e;
    color: #fff;
  }
  .ssc-kj-item-inner-item.active{
    background-color: rgba(213, 59, 78, 0.05);
  }
  .ssc-kj-item > p {
    font-size: 0.75rem;
    color: #999;
  }
  .ssc-kj-item > p.active {
    color: #d53b4e;
  }
</style>
