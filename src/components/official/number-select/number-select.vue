<template>
  <div class="num-select-cont">
    <position-tool-bar v-if="position"></position-tool-bar>
    <div class="num-select-cont-item" v-for="(item,x) in data.list">
      <flexbox>
        <flexbox-item>
          <div class="num-select-cont-item__title">{{item.title}}</div>
        </flexbox-item>
      </flexbox>
      <flexbox>
        <flexbox-item>
          <div class="num-select-cont-item__content">
            <ul class="fast-opera" v-if="showFastOpera">
              <li @click="handleSelect(x,'big')" :class="{active:'big'===selectedModeMap[x]}">大</li>
              <li @click="handleSelect(x,'small')" :class="{active:'small'===selectedModeMap[x]}">小</li>
              <li @click="handleSelect(x,'odd')" :class="{active:'odd'===selectedModeMap[x]}">单</li>
              <li @click="handleSelect(x,'even')" :class="{active:'even'===selectedModeMap[x]}">双</li>
              <li @click="handleSelect(x,'all')" :class="{active:'all'===selectedModeMap[x]}">全</li>
              <li @click="handleSelect(x,'')">清</li>
            </ul>
            <ul class="ball-list">
              <li v-for="(ball,y) in item.balls"
                  @click="selectNum(x, ball)"
                  :class="{active: selected[x].indexOf(ball)!==-1}">
                {{ball}}
              </li>
            </ul>
          </div>
        </flexbox-item>
      </flexbox>
    </div>
  </div>
</template>

<script>
  import {Flexbox, FlexboxItem} from 'vux'
  import {mapActions, mapGetters} from 'vuex'
  import PositionToolBar from 'components/official/positionToolBar/positionToolBar'

  export default {
    components: {Flexbox, FlexboxItem, PositionToolBar},
    props: {
      data: {
        type: Object
      },
      position: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        selectMap: {},
        showFastOpera: typeof this.data.showFastOpera === 'undefined'
      }
    },
    computed: {
      ...mapGetters([
        'selected',
        'selectedModeMap'
      ])
    },
    methods: {
      ...mapActions([
        'pushSelectedBall',
        'cleanSelectedBall',
        'delSelectedBall',
        'setSelectedMode',
        'computedSelected'
      ]),
      handleSelect (index, mode) {
        this.setSelectedMode({index, mode})
        this.selectMode(index, mode)
      },
      selectMode (index, mode) {
        switch (mode) {
          case 'all':
            this.selectAllFun(index)
            break
          case 'big':
            this.selectBigFun(index)
            break
          case 'small':
            this.selectSmallFun(index)
            break
          case 'odd':
            this.selectOddFun(index)
            break
          case 'even':
            this.selectEvenFun(index)
            break
          default:
            this.cleanSelected(index)
            break
        }
        this.computedSelected()
      },
      selectAllFun (index) {
        this.data.list[index].balls.forEach(ball => {
          if (this.selected[index].indexOf(ball) === -1) {
            this.pushSelectedBall({index, ball})
          }
        })
      },
      selectBigFun (index) {
        const _this = this
        const len = _this.data.list[index].balls.length
        const str = len / 2
        _this.cleanSelected(index)
        _this.data.list[index].balls.forEach((ball, i) => {
          if (i >= str && _this.selected[index].indexOf(ball) === -1) {
            _this.pushSelectedBall({index, ball})
          }
        })
      },
      selectSmallFun (index) {
        const _this = this
        const len = _this.data.list[index].balls.length
        const str = len / 2
        _this.cleanSelected(index)
        _this.data.list[index].balls.forEach((ball, i) => {
          if (i < str && _this.selected[index].indexOf(ball) === -1) {
            _this.pushSelectedBall({index, ball})
          }
        })
      },
      selectOddFun (index) {
        const _this = this
        _this.cleanSelected(index)
        _this.data.list[index].balls.forEach(ball => {
          if (ball * 1 % 2 === 1 && _this.selected[index].indexOf(ball) === -1) {
            _this.pushSelectedBall({index, ball})
          }
        })
      },
      selectEvenFun (index) {
        const _this = this
        _this.cleanSelected(index)
        _this.data.list[index].balls.forEach(ball => {
          if (ball * 1 % 2 === 0 && _this.selected[index].indexOf(ball) === -1) {
            _this.pushSelectedBall({index, ball})
          }
        })
      },
      cleanSelected (index) {
        this.cleanSelectedBall(index)
      },
      selectNum (index, ball) {
        console.log(index, ball)
        const i = this.selected[index].indexOf(ball)
        if (i !== -1) {
          this.delSelectedBall({index, dataIndex: i})
        } else {
          this.pushSelectedBall({index, ball})
        }
        this.computedSelected()
      }
    }
  }
</script>
<style lang="less" scoped>
  .num-select-cont {
    .num-select-cont-item {
      .num-select-cont-item__title {
        text-align: center;
        height: 37px;
        line-height: 37px;
        border-top: 1px solid #eeeeee;
        background-color: rgb(238, 238, 238);
        font-size: 12px;
        &:after {
          display: block;
          content: "";
          height: 1px;
          background: #eeeeee;
          transform: scaleY(0.5);
        }
      }
      .num-select-cont-item__content {
        text-align: center;
        .fast-opera {
          padding: 5px 10px;
          overflow: hidden;
          margin: 5px 0;
          margin-bottom: 0;
          li {
            height: 31px;
            width: 31px;
            line-height: 31px;
            text-align: center;
            color: #5d5d5d;
            display: inline-block;
            margin-right: 5px;
            position: relative;
            font-size: 13px;
            &:after {
              display: block;
              content: '';
              width: 200%;
              height: 200%;
              border: 1px solid #a3a3a3;
              position: absolute;
              left: 0;
              top: 0;
              border-radius: 50%;
              transform: scale(0.5);
              transform-origin: 0 0 0;
            }
            &.active {
              color: #d23748;
            }
            &.active:after {
              border-color: #d23748;
            }
            @media only screen and (max-width: 320px) {
              width: 26px;
              height: 26px;
              line-height: 26px;
            }
            @media (min-width: 321px) and (max-width: 375px) {
              width: 32px;
              height: 32px;
              line-height: 32px;
            }
          }
        }
        .ball-list {
          padding: 0 10px 5px;
          overflow: hidden;
          li {
            height: 37px;
            width: 37px;
            line-height: 37px;
            text-align: center;
            display: inline-block;
            border-radius: 50%;
            margin: 7px;
            background: url('./ball.png') no-repeat center center;
            background-size: contain;
            color: #d23748;
            font-size: 18px;
            &.active {
              background: url('./ball_selected.png') no-repeat center center;
              background-size: contain;
              color: #fff;
            }
            @media only screen and (max-width: 320px) {
              width: 28px;
              height: 28px;
              line-height: 28px;
            }
            @media (min-width: 321px) and (max-width: 374px) {
              width: 35px;
              height: 35px;
              line-height: 35px;
            }
          }
        }
      }
    }
  }
</style>
