<template>
  <flexbox :gutter="0" :align="'flex-start'" class="content">
    <flexbox-item :span="3" v-if="showLeftSide">
      <Scroller :ref="`playsScroll`"
                class="lottery-plays-scroll"
                lock-x
                scrollbar-y
                :height="collecting ? '-403px' : '-262px'">
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
    <flexbox-item :span="showLeftSide ? 9 : 12">
      <transition name="slide-fade" transition-node="in-out">
        <Scroller :ref="`playGroupScroll`"
                  lock-x
                  scrollbar-y
                  :height="collecting ? '-403px' : '-262px'"
                  :key="changeTab">
          <div class="ssc-kj-box">
          <section v-for="(item, index) in listData"
                   v-if="JSON.stringify(item) !== '{}'"
                   :key="index">
              <div class="ssc-kj-item title"
                   v-if="!showLeftSide">
                   {{ item.name }}
              </div>
              <div :class="[showLeftSide ? '' : 'smaller','ssc-kj-item']"
                   v-for="(_item, _index) in item.sz"
                   @click="chooseNUM(_item)"
                   :key="_index">
                <div :class="{'active' : _item.choosen }">
                  {{ _item.displayName + '点'}}
                  <p>{{ _item.odds }}</p>
                  <i class="icon1 icon" v-if="_item.choosen"></i>
                </div>
              </div>
              <div class="ssc-kj-item-big">
                <div class="ssc-kj-item-inner">
                  <div :class="[_item.choosen ? 'active' : '', 'ssc-kj-item-inner-item']"
                       v-for="(_item, _index) in item.dxds"
                       @click="chooseNUM(_item)"
                       :key="_index">
                    <div v-for="(val, idx) in _item.displayName.toString().split('')"
                         :key="idx"
                         :class="'dice' + val">
                      {{ isNaN(Number(val)) ? val : '' }}
                    </div>
                    <p>{{ _item.odds }}</p>
                    <i class="icon1 icon" v-if="_item.choosen"></i>
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
    name: 'credit-bet-k3',
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
  .ssc-kj-item, .ssc-kj-item-big, .ssc-kj-item-inner-item {
    flex-basis: 45%;
    position: relative;
  }
  .ssc-kj-item-inner-item {
    background: url('../../../../assets/images/border-bg_reac.png') no-repeat center center;
    background-size: 100% 100%;
    height: 45px;
    border-radius: 1px;
  }
  .ssc-kj-item-inner-item > div {
    font-size: 17px;
    font-size: 1rem;
    font-weight: 600;
    width: 30px;
    height: 43px;
    line-height: 43px;
    float: left;
    background-size: 80% !important;
  }
  .ssc-kj-item-inner-item > div.dice1 {
    background: url('../../../../assets/images/dice-1.jpg') no-repeat center center;
  }
  .ssc-kj-item-inner-item > div.dice2 {
    background: url('../../../../assets/images/dice-2.jpg') no-repeat center center;
  }
  .ssc-kj-item-inner-item > div.dice3 {
    background: url('../../../../assets/images/dice-3.jpg') no-repeat center center;
  }
  .ssc-kj-item-inner-item > div.dice4 {
    background: url('../../../../assets/images/dice-4.jpg') no-repeat center center;
  }
  .ssc-kj-item-inner-item > div.dice5 {
    background: url('../../../../assets/images/dice-5.jpg') no-repeat center center;
  }
  .ssc-kj-item-inner-item > div.dice6 {
    background: url('../../../../assets/images/dice-6.jpg') no-repeat center center;
  }

  .ssc-kj-item-inner-item > p {
    font-size: 14px;
    font-size: 0.875rem;
    color: #606060;
    height: 43px;
    line-height: 43px;
    float: right;
    margin-right: 10px;
  }
  .ssc-kj-item-big {
    flex-basis: 100%;
    height: auto;
  }
  .ssc-kj-item > div {
    width: 50px;
    margin: 0 auto;
    height: 50px;
    background: url('../../../../assets/images/border-bg.png') no-repeat center center;
    background-size: 100% 100%;
    font-weight: bold;
    color: #000;
    text-align: center;
    padding-top: 2px;
    box-sizing: border-box;
    position: relative;
  }
  .ssc-kj-item > div p {
    font-size: 14px;
    font-size: 0.875rem;
    color: #606060;
    font-weight: normal;
    margin-top: -5px;
  }
  .ssc-kj-item > div.active, .ssc-kj-item-inner-item.active {
    background-color: rgba(213, 59, 78, 0.05);
  }
  .ssc-kj-item > div.active, .ssc-kj-item > div.active p, .ssc-kj-item > p.active {
    color: #d53b4e;
  }
  .ssc-kj-item > p {
    color: #606060;
  }
</style>
