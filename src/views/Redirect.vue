<template>
  <div>正在跳转...</div>
</template>
<script>
import { setToken, setResource } from '@/assets/scripts/cache'
import { mapMutations } from 'vuex'
export default {
  name: 'Redirect',
  data () {
    return {}
  },
  methods: {
    ...mapMutations([
      'updateLoadingStatus'
    ]),
    _validationToken: function (params) {
      const _this = this
      _this.updateLoadingStatus({isLoading: true})
      this.$store.dispatch('getAccountInfo', params.token).then(data => {
        setToken(params.token)
        setResource(params.resource)
        return data
      }).then(() => {
        this.$store.dispatch('getCreditRouter').then(menus => {
          _this.updateLoadingStatus({isLoading: false})
          let flag = false
          for (let x = 0; x < menus.length; x++) {
            const {typeId, typeCode, children} = menus[x]
            if (typeCode === params.groupCode && children && children.length) {
              for (let y = 0; y < children.length; y++) {
                const {gameId, gameCode, gameName} = children[y]
                if (gameCode === params.gameCode) {
                  flag = true
                  _this.$router.push({
                    path: `/credit/${typeCode}/${typeId}/${gameId}/${gameCode}/${gameName}`
                  })
                  break
                }
              }
            }
          }
          if (!flag) {
            _this.error()
          }
        }).catch(() => {
          _this.error()
        })
      }).catch(() => {
        _this.error()
      })
    },
    error () {
      this.$router.push({path: '/401'})
    }
  },
  beforeRouteEnter (to, from, next) {
    if (!from.path) return false
    next(vm => {
      vm._validationToken(to.params)
    })
  }
}
</script>
