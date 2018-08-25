<template>
  <div class="single-text-wrapper">
    <flexbox :gutter="0" orient="vertical">
      <position-tool-bar v-if="position"></position-tool-bar>
      <flexbox-item>
        <div class="tips">{{tips}}</div>
      </flexbox-item>
      <flexbox-item class="single-text-content">
        <x-textarea v-model="value" :rows="5" class="single-text" @on-change="onChange" type="tel"
                    pattern="[0-9]*"></x-textarea>
      </flexbox-item>
      <flexbox-item>
        <x-button @click.native="handleDeduplication" class="deduplication-btn">删除重复号码</x-button>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>
  import {Flexbox, FlexboxItem, XTextarea, XButton} from 'vux'
  import {mapActions, mapGetters, mapMutations} from 'vuex'
  import {StringToArray} from '@/assets/scripts/util'
  import PositionToolBar from 'components/official/positionToolBar/positionToolBar'

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
      },
      activate: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        value: ''
      }
    },
    components: {Flexbox, FlexboxItem, XTextarea, XButton, PositionToolBar},
    computed: {
      ...mapGetters([
        'selected',
        'selectedSpilt',
        'selectedPlayingCode'
      ])
    },
    watch: {
      selected: {
        handler (newValue, oldValue) {
          if (this.activate) {
            this.value = newValue[0][0]
          }
        },
        deep: true
      }
    },
    methods: {
      ...mapActions([
        'setInputTextBall'
      ]),
      clearValue () {
        this.value = ''
      },
      onChange (value) {
        if (!this.value) return
        let array = []
        const newValue = this.value.replace(/\D+/g, '')
        if (newValue.length % this.split === 0) {
          array = StringToArray(newValue, this.split)
          if (array.length) {
            this.value = array.join(',') + ','
          } else {
            this.value = array.join(',')
          }
          this.setInputTextBall({index: 0, balls: array})
          this.setSelectedBetCount(Array.from(new Set(this.selected[0])).length)
        } else {
          this.value = value
        }
      },
      handleDeduplication () {
        const array = Array.from(new Set(this.selected[0]))
        this.value = array.join(',')
        this.setInputTextBall({index: 0, balls: array})
      },
      ...mapMutations({
        setSelectedBetCount: 'SET_SELECTED_BET_COUNT'
      })
    }
  }
</script>
<style lang="less" scoped>
  .tips{
    padding: 10px 5px 0px 5px;
  }
  .single-text-wrapper {
    padding: 0 10px 0 10px;
    font-size: 12px;
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
      font-size: 14px;
    }
  }
</style>
