<template>
  <div class="position-wrapper">
    <label>
      <input type="checkbox" value="4" v-model="checkeds" @change="positionSelect()"/>万位
    </label>
    <label>
      <input type="checkbox" value="3" v-model="checkeds" @change="positionSelect()"/>千位
    </label>
    <label>
      <input type="checkbox" value="2" v-model="checkeds" @change="positionSelect()"/>百位
    </label>
    <label>
      <input type="checkbox" value="1" v-model="checkeds" @change="positionSelect()"/>十位
    </label>
    <label>
      <input type="checkbox" value="0" v-model="checkeds" @change="positionSelect()"/>个位
    </label>
    <br/>
    <span>你选择了<i>{{checkeds.length}}</i>个位置，系统自动根据位置组合成<i>{{plan}}</i>个方案。</span>
  </div>
</template>

<script>
  import {mapActions, mapGetters, mapMutations} from 'vuex'

  export default {
    props: {
      split: {
        type: Number
      },
      tips: {
        type: String
      },
      position: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        value: '',
        checkeds: [],
        plan: 0
      }
    },
    computed: {
      ...mapGetters([
        'selectedSpilt',
        'selected',
        'selectedPlayingCode'
      ])
    },
    methods: {
      ...mapActions([
        'setInputTextBall',
        'computedSelected'
      ]),
      ...mapMutations({
        setPositionPlan: 'SET_POSITION_PLAN'
      }),
      clearValue () {
        this.value = ''
      },
      positionSelect () {
        if (this.checkeds.length < 2) {
          this.plan = 0
        } else {
          if (['ssc_rx2_zxds', 'ssc_rx2_zxhz', 'ssc_rx2_zuxfs', 'ssc_rx2_zuxds', 'ssc_rx2_zxhz', 'ffc_rx2_zxds', 'ffc_rx2_zxhz', 'ffc_rx2_zuxfs', 'ffc_rx2_zuxds', 'ffc_rx2_zxhz'].indexOf(this.selectedPlayingCode) !== -1) {
            if (this.checkeds.length === 2) {
              this.plan = 1
            } else if (this.checkeds.length === 3) {
              this.plan = 3
            } else if (this.checkeds.length === 4) {
              this.plan = 6
            } else if (this.checkeds.length === 5) {
              this.plan = 10
            }
          } else if (['ssc_rx3_zxds', 'ssc_rx3_zxhz', 'ssc_rx3_zlfs', 'ssc_rx3_zlds', 'ssc_rx3_zsfs', 'ssc_rx3_zsds', 'ssc_rx3_hhzx', 'ffc_rx3_zxds', 'ffc_rx3_zxhz', 'ffc_rx3_zlfs', 'ffc_rx3_zlds', 'ffc_rx3_zsfs', 'ffc_rx3_zsds', 'ffc_rx3_hhzx'].indexOf(this.selectedPlayingCode) !== -1) {
            if (this.checkeds.length === 2) {
              this.plan = 0
            } else if (this.checkeds.length === 3) {
              this.plan = 1
            } else if (this.checkeds.length === 4) {
              this.plan = 4
            } else if (this.checkeds.length === 5) {
              this.plan = 10
            }
          } else if (['ssc_rx4_zxds', 'ssc_rx4_zx24', 'ssc_rx4_zx12', 'ssc_rx4_zx6', 'ssc_rx4_zx4', 'ffc_rx4_zxds', 'ffc_rx4_zx24', 'ffc_rx4_zx12', 'ffc_rx4_zx6', 'ffc_rx4_zx4'].indexOf(this.selectedPlayingCode) !== -1) {
            if (this.checkeds.length <= 3) {
              this.plan = 0
            } else if (this.checkeds.length === 4) {
              this.plan = 1
            } else if (this.checkeds.length === 5) {
              this.plan = 5
            }
          }
        }
        this.setPositionPlan(this.plan)
        this.computedSelected()
      }
    }
  }
</script>
<style lang="less" scoped>
  .single-text-wrapper {
    padding: 0 10px 0 10px;
    .single-text-content {
      padding-left: 20px;
      padding-right: 20px;
      margin: 15px 20px 15px 20px;
      .single-text {
        border: 1px solid #dcdcdc;
      }
    }

    .deduplication-btn {
      color: white;
      background-color: #d23748;
      width: 80%;
    }
  }
</style>
