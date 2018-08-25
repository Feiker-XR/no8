<template>
  <div class="drawer-header">
     <div class="drawer-header__avatar">
       <img src="./drawer-user.png" alt="">
     </div>
     <div class="drawer-header__info">
       <div class="user-name-wrapper">
         <span class="user-name"><x-icon type="person-stalker" class="svg-icon" size="22"></x-icon>：{{userAccount}}</span>
       </div>
       <div class="user-balance-wrapper">
         <x-icon type="social-yen" size="22" class="svg-icon"></x-icon>
         ：<span class="user-balance">{{userAmount}}</span><span>
         <x-icon type="refresh" class="svg-icon" size="22" @click="refreshUserBalance"></x-icon></span>
       </div>
     </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
export default {
  computed: {
    ...mapGetters([
      'userAccount',
      'userAmount'
    ])
  },
  methods: {
    ...mapActions([
      'refreshUserBalance'
    ])
  }
}
</script>

<style lang="less" scoped>
  .svg-icon {
    vertical-align: text-bottom;
    fill: currentColor;
  }
  .drawer-header {
    height: 135px;
    background: url("drawer-bg.jpg") #d23748 left center no-repeat;
    background-size: contain;
    .drawer-header__avatar {
      display: inline-block;
      position: absolute;
      top: 39px;
      left: 26px;
      img {
        width: 60px;
      }
    }
    .drawer-header__info {
      position: absolute;
      display: inline-block;
      vertical-align: top;
      height: 60px;
      line-height: 30px;
      width: 65%;
      top: 37px;
      left: 101px;
      color: #fff;
      .user-name-wrapper {
        font-size: 20px;
        .user-name {
          width: 100%;
          display: inline-block;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .user-balance-wrapper {
        .user-balance {
          color: #ffe336;
          margin-right: 5px;
        }
      }
    }
  }
</style>
