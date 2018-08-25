<template>
  <div>
    <scroller lock-y class="play-group-item">
      <ul :style="{width:`${playGroupList.length * 70}px`}">
        <li v-for="(item, index) in playGroupList"
            @click="togglePlayGroup(index,item)">
          <span :class="{active:playGroupIndex===index}">{{item.name}}</span>
        </li>
      </ul>
    </scroller>
    <swiper v-model="playGroupIndex"
            height="560px"
            :show-dots="false"
            :disableTouch="true"> <!-- :height="collecting ? '400px': '560px'" -->
      <swiper-item v-for="(item,index) in playGroupList" :key="index">
        <scroller lock-x
                  scrollbar-y
                  :ref="`playGroupList_${index}`"
                  :height="collecting ? '-420px': '-280px'">  <!--- 298px '-280px'-->
          <number-select v-if="item.type==='balls'"
                         :data="item">
          </number-select>
          <input-text v-else ref="inputText"
                      :activate="index===playGroupIndex"
                      :tips="item.rule"
                      :split="item.customChoice">
          </input-text>
        </scroller>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  import NumberSelect from 'components/official/number-select/number-select'
  import InputText from 'components/official/input-text/input-text'
  import Swiper from 'components/base/swiper/swiper.vue'
  import {SwiperItem, Scroller} from 'vux'
  import {mapActions, mapMutations} from 'vuex'
  export default {
    data () {
      return this.dataObject
    },
    props: {
      dataObject: {
        type: Object
      },
      bouns: {
        type: Array
      },
      collecting: {
        type: Boolean
      }
    },
    created () {
      this.setPlayingCode(this.playGroupList[0].code)
      if (this.bouns.length) {    // 切换侧边时
        this.togglePlayGroup(0, this.playGroupList[0])
      }
    },
    components: {
      NumberSelect,
      InputText,
      Swiper,
      SwiperItem,
      Scroller
    },
    methods: {
      ...mapActions([
        'resetSelected',
        'getBonusPercent'
      ]),
      ...mapMutations({
        setPlayingCode: 'SET_PLAYING_CODE'
      }),
      togglePlayGroup (index, item) {
        if (item.type === 'text') {
          const inputs = this.$refs['inputText']
          inputs.forEach(target => {
            target.clearValue()
          })
        }
        this.resetSelected({cleanBetting: false})
        this.setPlayingCode(item.code)
        this.getBonusPercent(this.bouns)
        this.playGroupIndex = index
        console.log(this.playGroupList[index].rule)
      }
    },
    watch: {
      bouns (n, l) {
        if (l.length === 0) {
          this.togglePlayGroup(0, this.playGroupList[0])    // 第一次接口返回数据后,调用默认
        }
      },
      collecting () {
        /* this.$nextTick(() => {
          console.log(this.$refs['playGroupList_0'][0].height)
        }) */
      }
    }
  }
</script>
<style lang="less" scoped>
  @import "official";
</style>
