<template>
  <div style="height:100%;" @touchmove.prevent>
    <div v-transfer-dom>
      <loading v-model="isLoading"></loading>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
  import { Loading } from 'vux'
  import { mapState } from 'vuex'
  import TransferDom from 'directive/transfer-dom/index'
  export default {
    directives: {
      TransferDom
    },
    components: {
      Loading
    },
    computed: {
      ...mapState({
        isLoading: state => state.vux.isLoading
      })
    }
  }
</script>

<style lang="less">
  html {
    font-size: 16px;
    touch-action: manipulation;
  }
  body {
    background-color: #fff;
    font-family: 'Microsoft YaHei';
    overflow: hidden;
  }
  .vux-tab-wrap {
    padding-top: 35px !important;
  }
  .vux-tab-container {
    height: 35px !important;
  }
  .vux-tab{
    height: 35px !important;
  }
  .vux-tab .vux-tab-item{
    line-height: 35px !important;
  }
  .vux-header .vux-header-left a, .vux-header .vux-header-left, .vux-header .vux-header-right {
    color: #fff !important;
  }
  table {
    max-width: 100%;
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0
  }
  html, body {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    webkit-text-size-adjust: none;
  }
</style>
