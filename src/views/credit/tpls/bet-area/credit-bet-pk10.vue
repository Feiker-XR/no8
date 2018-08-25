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
                <div :class="['pk10_ball_' + _item.displayName, {'active' : _item.choosen}]">
                  {{ _item.displayName }}
                  <p>{{ _item.odds }}</p>
                </div>
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
    name: 'credit-bet-pk10',
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
  position: relative;   /** 相对定位,便于定位icon ***/
}
.ssc-kj-item.title{
  margin-top: 15px;
}
.ssc-kj-item-inner-item {
  background: url('../../../../assets/images/border-bg.png') no-repeat center center;
  background-size: 100% 100%;
  height: 45px;
}
.ssc-kj-item-inner-item > div {
  font-size: 17px;
  font-size: 1rem;
  line-height: 1.5;
  font-weight: 600;
}

.ssc-kj-item-inner-item > p {
  line-height: 1;
  font-size: 14px;
  font-size: 0.875rem;
  color: #606060;
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
  color: #d53b4e;
  text-align: center;
  font-weight: 600;
  font-style: italic;
  -webkit-text-stroke: 1px #333;
  font-size: 25px;
  font-size: 1.5rem;
  border-radius: 1px;
}
.ssc-kj-item > div.pk10_ball_1, .ssc-kj-item > div.pk10_ball_11{
  color: #fffb08;
}
.ssc-kj-item > div.pk10_ball_2, .ssc-kj-item > div.pk10_ball_12{
  color: #008bf9;
}
.ssc-kj-item > div.pk10_ball_3, .ssc-kj-item > div.pk10_ball_13{
  color: #4c4d51;
}
.ssc-kj-item > div.pk10_ball_4, .ssc-kj-item > div.pk10_ball_14{
  color: #f47a00;
}
.ssc-kj-item > div.pk10_ball_5, .ssc-kj-item > div.pk10_ball_15{
  color: #8ff9f9;
}
.ssc-kj-item > div.pk10_ball_6, .ssc-kj-item > div.pk10_ball_16{
  color: #420aff;
}
.ssc-kj-item > div.pk10_ball_7, .ssc-kj-item > div.pk10_ball_17{
  color: #e3e3e3;
}
.ssc-kj-item > div.pk10_ball_8, .ssc-kj-item > div.pk10_ball_18{
  color: #dd0400;
}
.ssc-kj-item > div.pk10_ball_9, .ssc-kj-item > div.pk10_ball_19{
  color: #770100;
}
.ssc-kj-item > div.pk10_ball_10{
  color: #2bc610;
}
.ssc-kj-item > div.pk10_ball_1.active, .ssc-kj-item > div.pk10_ball_11.active{
  background: #fffb08;
  color: #fff;
  border-color:#fffb08;
}
.ssc-kj-item > div.pk10_ball_2.active, .ssc-kj-item > div.pk10_ball_12.active{
  background: #008bf9;
  color: #fff;
  border-color:#008bf9;
}
.ssc-kj-item > div.pk10_ball_3.active, .ssc-kj-item > div.pk10_ball_13.active{
  background: #4c4d51;
  color: #fff;
  border-color: #4c4d51;
}
.ssc-kj-item > div.pk10_ball_4.active, .ssc-kj-item > div.pk10_ball_14.active{
  background: #f47a00;
  color: #fff;
  border-color: #f47a00;
}
.ssc-kj-item > div.pk10_ball_5.active, .ssc-kj-item > div.pk10_ball_15.active{
  background: #8ff9f9;
  color: #fff;
  border-color: #8ff9f9;
}
.ssc-kj-item > div.pk10_ball_6.active, .ssc-kj-item > div.pk10_ball_16.active{
  background: #420aff;
  color: #fff;
  border-color: #420aff;
}
.ssc-kj-item > div.pk10_ball_7.active, .ssc-kj-item > div.pk10_ball_17.active{
  background: #e3e3e3;
  color: #fff;
  border-color: #e3e3e3;
}
.ssc-kj-item > div.pk10_ball_8.active, .ssc-kj-item > div.pk10_ball_18.active{
  background: #dd0400;
  color: #fff;
  border-color: #dd0400;
}
.ssc-kj-item > div.pk10_ball_9.active, .ssc-kj-item > div.pk10_ball_19.active{
  background: #770100;
  color: #fff;
  border-color: #770100;
}
.ssc-kj-item > div.pk10_ball_10.active{
  background: #2bc610;
  color: #fff;
  border-color: #2bc610;
}
.ssc-kj-item > div p{
  font-size: 14px;
  font-size: 0.875rem;
  font-weight:normal;
  color: #666;
  font-style: normal;
  margin-top: -10px;
  -webkit-text-stroke: 0px rgba(0,0,0,.5);
}
.ssc-kj-item > div.active p{
  color: #fff;
  font-weight: bold
}
.ssc-kj-item > p {
  color: #606060;
}
.ssc-kj-item > p.active{
  color: #d53b4e;
}
</style>
