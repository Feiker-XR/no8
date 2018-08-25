<template>
  <div class="balls-wrapper" :class="groupCode">
    <ul v-if="balls"  class="balls-wrapper__balls">
      <li v-for="(item, index) in balls" :class="getClass(item)" :key="index">{{item.show ? item.value : ''}}</li>
    </ul>
    <ul v-if="statistics" class="balls-wrapper__balls">
      <li v-for="(item, index) in statistics" class="balls-statistics" :key="index">{{item}}</li>
    </ul>
  </div>
</template>

<script>
  export default {
    props: {
      groupCode: {
        type: String
      },
      loading: {
        type: Boolean,
        default: false
      },
      balls: {
        type: Array,
        default: function () {
          return []
        }
      },
      statistics: {
        type: Array,
        default: function () {
          return []
        }
      }
    },
    methods: {
      getClass (item) {
        if (this.groupCode === 'ssc' ||
          this.groupCode === 'k3' ||
          this.groupCode === 'ssl' ||
          this.loading) {
          return `small-ball ssc-ball`
        } else {
          if (this.groupCode === 'pk10') return `pk10-small-ball pk10-ball-${item.code}`
          return `${this.groupCode === 'kl8' ? 'min-ball' : 'small-ball'} ${this.groupCode}-ball-${item.code}`
        }
      }
    }
  }
</script>
<style lang="less">
  @import "balls.less";
</style>
<style lang="less" scoped>
  .balls-wrapper {
    width: 100%;
    overflow: hidden;
    .balls-wrapper__balls {
      list-style: none;
      margin-bottom: 1px;
    }
    .balls-wrapper__balls:last-child {
      margin-right: 0;
    }
  }
  .balls-statistics {
    display: inline-block;
    margin-right: 2px;
    padding: 2px 5px;
    line-height: 1.0;
    border-radius: 5px;
    border: 1px solid #ccc;
  }
</style>
