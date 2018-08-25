<template>
  <div class="multiple-round">
    <div>
      <a @click="sub" class="number-selector">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18"><defs></defs><path d="M863.744 544 163.424 544c-17.664 0-32-14.336-32-32s14.336-32 32-32l700.32 0c17.696 0 32 14.336 32 32S881.44 544 863.744 544z" fill="#cdcdcd"></path></svg>
      </a>
      <input v-model.number="currentValue" class="number-input" pattern="[0-9]*" type="number" @blur="blur"/>
      <a @click="add" class="number-selector">
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18"><defs></defs><path d="M863.328 482.56l-317.344-1.12L545.984 162.816c0-17.664-14.336-32-32-32s-32 14.336-32 32l0 318.4L159.616 480.064c-0.032 0-0.064 0-0.096 0-17.632 0-31.936 14.24-32 31.904C127.424 529.632 141.728 544 159.392 544.064l322.592 1.152 0 319.168c0 17.696 14.336 32 32 32s32-14.304 32-32l0-318.944 317.088 1.12c0.064 0 0.096 0 0.128 0 17.632 0 31.936-14.24 32-31.904C895.264 496.992 880.96 482.624 863.328 482.56z" p-id="1477" fill="#cdcdcd"></path></svg>
      </a>
      <span>倍</span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      min: Number,
      max: Number,
      value: {
        validator (value) {
          if (typeof value === 'number') {
            return true
          } else if (typeof value === 'string') {
            return value === ''
          }
          return false
        },
        default: 0
      }
    },
    created () {
      this.currentValue = this.value
    },
    data () {
      return {
        currentValue: 0
      }
    },
    computed: {
      disabledMin () {
        return typeof this.min === 'undefined' ? false : (this.currentValue === '' ? true : this.currentValue <= this.min)
      },
      disabledMax () {
        return typeof this.max === 'undefined' ? false : (this.currentValue === '' ? true : this.currentValue >= this.max)
      }
    },
    watch: {
      currentValue (newValue, old) {
        if (newValue !== '') {
          if (typeof this.min !== 'undefined' && this.currentValue < this.min) {
            this.currentValue = this.min
          }
          if (this.max && this.currentValue > this.max) {
            this.currentValue = this.max
          }
        }
        this.$emit('input', this.currentValue)
      },
      value (newValue) {
        this.currentValue = newValue
        this.$emit('on-change', newValue)
      }
    },
    methods: {
      add () {
        if (!this.disabledMax) {
          this.currentValue = this.currentValue + 1
        }
      },
      sub () {
        if (!this.disabledMin) {
          this.currentValue = this.currentValue - 1
        }
      },
      blur () {
        if (this.currentValue === '') {
          this.currentValue = 0
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .multiple-round {
    display: inline-block;
    font-size: 12px;
    .number-input{
      text-align: center;
      border-radius: 5px;
      appearance: none;
      border: 1px solid #ececec;
      width: 25px;
      height: 24px;
      background-color: #f8f8f8;
      font-size: 12px;
      box-sizing: border-box;
      outline: none;
    }
    .number-selector {
      border: 1px solid #ececec;
      height: 18px;
      width: 18px;
      vertical-align: middle;
      background-color: #ffffff;
      svg {
        height: 10px;
        width: 15px;
      }
    }
  }
</style>
