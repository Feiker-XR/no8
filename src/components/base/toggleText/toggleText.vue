<template>
  <div class="text-body">
    <spinner name="crescent"></spinner>
    <br>
    <span>{{ text }}</span>
  </div>
</template>

<script>
import { Spinner } from 'vux'

export default {
  components: {
    Spinner
  },
  props: {
    scrollable: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      text: '加载中...'
    }
  }
}
</script>

<style lang="less" scoped>
.text-body {
  padding: 30px 0;
  color: #666;
  text-align: center;
}
</style>
