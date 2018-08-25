export const betMIX = {
  data () {
    return {
      isload: false
    }
  },
  props: {
    confirm: {
      type: Boolean,
      default: false
    },
    showLeftSide: {
      type: Boolean,
      required: true
    },
    listData: {
      type: Object,
      default: function () {
        return {}
      }
    },
    resetSide: {
      type: Boolean,
      default: false
    },
    sidebar: {
      type: Array,
      default: function () {
        return [{value: '1', label: 'loading', choosen: false}]
      }
    },
    changeTab: {
      type: Boolean,
      default: false
    },
    collecting: {
      type: Boolean
    }
  },
  watch: {
    'listData': {  // 监控导航切换数据
      handler: function (newData, oldDate) {
        this.listData = newData
        this.show = !this.show
      },
      deep: true
    },
    confirm () {
      this.checkSideChoose()
    },
    collecting () { // 重置 scroller
      this.$nextTick(() => {
        this.$refs.playGroupScroll.reset({top: 0})
        if (this.$refs.playsScroll) {
          this.$refs.playsScroll.reset()
        }
      })
    }
  },
  methods: {
    chooseNUM (item, side) {
      item.choosen = !item.choosen
      this.checkSideChoose()
    },
    checkSideChoose () {  // 工具方法
      var arr = []
      this.sidebar.map(function (val) {
        if (val.choosen) {
          arr.push(val.value)
        }
      })
      this.$emit('ballCheck', arr)
    }
  }
}
