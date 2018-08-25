const state = {
  drawerVisibility: false,
  userId: '',         // 用户id
  userAccount: '',    // 用户账号
  userAmount: '',     // 用户余额
  userProxyId: '',
  userMenuList: {       // 左侧菜单栏（信用/官方）
    credit: [],
    official: []
  },
  headerTitle: '',
  lotteryGroupId: '',     // 组id   eg: 90000000000000011
  lotteryGroupCode: '',   // 组代号  eg: ssc
  lotteryId: '',          // 彩种id  eg: 1
  lotteryCode: '',        // 彩种代号 eg: cqssc
  lotteryName: '',        // 彩种名称 eg: 重庆时时彩
  lotteryRule: '',        // 玩法规则
  betList: [],            // 信用玩法预投注数组
  betIdsList: [],
  betsDialogVisible: false,   // 确定投注弹框
  stopBet: false,       // 是否已封盘
  stopSell: false,      // 是否已停售
  timerTime: '加载中',
  preIssue: '加载中...',
  nextIssue: '加载中...',
  likeList: [],       // 喜爱彩种列表
  chartConfigVisible: false,
  isGF: false,
  selected: [[], [], [], [], [], [], [], [], [], []],
  selectedModeMap: {},
  selectedBetCount: 0,
  selectedPlayingCode: '',
  selectedSpilt: 5,
  bettingList: [],
  customChoice: 0,
  positionPlan: 0,
  unitOptions: [{key: 1, value: '元'}, {key: 2, value: '角'}, {key: 4, value: '分'}],
  unit: 1,
  bonusPercentOptions: [],
  bonusPercent: '',
  bettingMultiple: 1,
  inputAmount: ''  // 投注金额
}

export default state
