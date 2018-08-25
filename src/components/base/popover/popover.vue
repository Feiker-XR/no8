<template>
  <div v-click-outside="onClickedOutside">
    <span ref="trigger" @click="toggle">
      <slot>
      </slot>
    </span>
    <transition name="fade">
      <div class="vux-popover"
           ref="popover"
           :style="popoverStyle"
           v-show="show">
        <div :class="arrowClass"></div>
        <div @click="$emit('on-click-content')">
          <slot name="content">
            <div v-html="content"></div>
          </slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import ClickOutside from 'vux/src/directives/click-outside'
  export default {
    name: 'SuperPopover',
    mounted () {
      this.$nextTick(() => {
        const trigger = this.$refs.trigger.children[0]
        const popover = this.$refs.popover
        switch (this.placement) {
          case 'top' :
            this.position.left = trigger.offsetLeft - popover.offsetWidth / 2 + trigger.offsetWidth / 2
            this.position.top = trigger.getBoundingClientRect().top - popover.offsetHeight - this.gutter
            break
          case 'left':
            this.position.left = trigger.offsetLeft - popover.offsetWidth - this.gutter
            this.position.top = trigger.getBoundingClientRect().top + trigger.offsetHeight / 2 - popover.offsetHeight / 2
            break
          case 'right':
            this.position.left = trigger.offsetLeft + trigger.offsetWidth + this.gutter
            this.position.top = trigger.getBoundingClientRect().top + trigger.offsetHeight / 2 - popover.offsetHeight / 2
            break
          case 'bottom':
            this.position.left = trigger.offsetLeft - popover.offsetWidth / 2 + trigger.offsetWidth / 2
            this.position.top = trigger.getBoundingClientRect().top + trigger.offsetHeight + this.gutter
            break
          default:
            console.warn('Wrong placement prop')
        }
        this.show = false
        this.popoverStyle = {
          top: this.position.top + 'px',
          left: this.position.left + 'px',
          display: 'none'
        }
      })
    },
    directives: {
      ClickOutside
    },
    props: {
      content: String,
      placement: String,
      gutter: {
        type: Number,
        default: 5
      }
    },
    methods: {
      onClickedOutside () {
        if (this.show) {
          this.show = false
          this.$emit('on-hide')
        }
      },
      toggle () {
        this.show = !this.show
        this.$emit(`on-${this.show === true ? 'show' : 'hide'}`)
      }
    },
    data () {
      return {
        position: {
          top: 0,
          left: 0
        },
        show: true,
        popoverStyle: {}
      }
    },
    computed: {
      arrowClass () {
        return {
          'vux-popover-arrow': true,
          'vux-popover-arrow-up': this.placement === 'bottom',
          'vux-popover-arrow-right': this.placement === 'left',
          'vux-popover-arrow-left': this.placement === 'right',
          'vux-popover-arrow-down': this.placement === 'top'
        }
      }
    }
  }
</script>

<style lang="less">

  .vux-popover {
    position: absolute;
    background-color: #ffffff;
    color: #262626;
    border-radius: 3px;
    z-index: 500;
    left: -85px !important;
    top: 32px !important;
    width: 127px;
    padding-bottom: 5px;
  }

  .vux-popover-arrow {
    position: absolute;
    width: 0;
    height: 0;
  }

  .vux-popover-arrow-up {
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-bottom: 5px solid #ffffff;
    left: 79%;
    transform: translateX(-50%);
    top: -5px;

  }

  .vux-popover-arrow-down {
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid #35495e;
    left: 50%;
    transform: translateX(-50%);
    bottom: -5px;
  }

  .vux-popover-arrow-left {
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    border-right: 5px solid #35495e;
    top: 50%;
    transform: translateY(-50%);
    left: -5px;
  }

  .vux-popover-arrow-right {
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 8px solid #35495e;
    top: 50%;
    transform: translateY(-50%);
    right: -8px;
  }

  .fade-enter-active, .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
</style>
