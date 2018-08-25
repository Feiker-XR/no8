<template>
  <div>正在跳转...</div>
</template>
<script>
import { setToken, setResource } from '@/assets/scripts/cache'
import { mapMutations } from 'vuex'

export default {
  methods: {
    ...mapMutations([
      'updateLoadingStatus',
      'SET_LOTTERY_CODE',
      'SET_LOTTERY_NAME',
      'SET_LOTTERY_GROUP_CODE',
      'SET_LOTTERY_GROUP_ID',
      'SET_LOTTERY_ID',
      'SET_HEADER_TITLE'
    ]),
    routerFirstMenu (menus) { // 默认导向第一个
      const {children} = menus[0]
      const lotteryGroupCode = menus[0].typeCode
      const lotteryGroupId = menus[0].typeId
      this.SET_LOTTERY_GROUP_CODE(lotteryGroupCode)     // 组号
      this.SET_LOTTERY_GROUP_ID(lotteryGroupId)  // 组id
      const childrenObj = children && children.length ? children[0] : null
      if (childrenObj) {
        const lotteryId = childrenObj.gameId  // 彩种id
        const lotteryCode = childrenObj.gameCode  // 彩种代号
        const lotteryName = childrenObj.gameName  // 彩种名称
        this.SET_LOTTERY_CODE(lotteryCode)
        this.SET_LOTTERY_NAME(lotteryName)
        this.SET_HEADER_TITLE(lotteryName)
        this.SET_LOTTERY_ID(lotteryId)
        sessionStorage.clear()
        this.$router.push({path: `/credit/${lotteryGroupCode}/${lotteryCode}`})
      }
    },
    getUserInfoByTokenFun (token, resource) {
      const _this = this
      _this.updateLoadingStatus({isLoading: true})
      this.$store.dispatch('getAccountInfo', token).then(data => {
        setToken(token)
        setResource(resource)
        return data
      }).then(() => {
        this.$store.dispatch('getCreditRouter').then(menus => {
          _this.updateLoadingStatus({isLoading: false})
          _this.routerFirstMenu(menus)
        }).catch(error => {
          console.log(error)
          _this.updateLoadingStatus({isLoading: false})
          _this.$router.push({path: '/401'})
        })
        this.$store.dispatch('getOfficRouter').then(() => {
          _this.updateLoadingStatus({isLoading: false})
        }).catch(error => {
          console.log(error)
          _this.updateLoadingStatus({isLoading: false})
        })
      }).catch(error => {
        console.log(error)
        _this.updateLoadingStatus({isLoading: false})
        _this.$router.push({path: '/401'})
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    if (!from.path) return false
    next(vm => {
      const {token, resource} = to.params
      vm.getUserInfoByTokenFun(token, resource)
    })
  }
}
</script>
