export function filterData (data) {
  let obj = {
    wx: {
      name: '五行',
      dxds: []
    },
    banbo: {
      name: '半波',
      dxds: []
    },
    tmtw_head: {
      name: '特码头',
      dxds: []
    },
    tmtw_tail: {
      name: '特码尾',
      dxds: []
    },
    zm: {
      name: '正码',
      sz: [],
      dxds: []
    },
    zm1: {
      name: '正码一',
      sz: [],
      dxds: []
    },
    zm2: {
      name: '正码二',
      sz: [],
      dxds: []
    },
    zm3: {
      name: '正码三',
      sz: [],
      dxds: []
    },
    zm4: {
      name: '正码四',
      sz: [],
      dxds: []
    },
    zm5: {
      name: '正码五',
      sz: [],
      dxds: []
    },
    zm6: {
      name: '正码六',
      sz: [],
      dxds: []
    },
    sum: {
      name: '总买',
      dxds: []
    }
  }
  let typeList = {
    tm: '特码',
    tx: '特肖',
    zm: '正码',
    zm1: '正码一',
    zm2: '正码二',
    zm3: '正码三',
    zm4: '正码四',
    zm5: '正码五',
    zm6: '正码六',
    qm: '七码',
    start: '头',
    end: '尾',
    gold: '金',
    wood: '木',
    water: '水',
    fire: '火',
    soil: '土',
    redsingle: '红单',
    reddouble: '红双',
    redbig: '红大',
    redsmall: '红小',
    bluesingle: '蓝单',
    bluedouble: '蓝双',
    bluebig: '蓝大',
    bluesmall: '蓝小',
    greensingle: '绿单',
    greendouble: '绿双',
    greenbig: '绿大',
    greensmall: '绿小',
    sumbig: '总大',
    sumsmall: '总小',
    sumsingle: '总单',
    sumdouble: '总双',
    rat: '鼠',
    cow: '牛',
    tiger: '虎',
    rabbit: '兔',
    dragon: '龙',
    snake: '蛇',
    horse: '马',
    sheep: '羊',
    monkey: '猴',
    chicken: '鸡',
    dog: '狗',
    pig: '猪',
    single: '单',
    double: '双',
    big: '大',
    small: '小',
    red: '红波',
    blue: '蓝波',
    green: '绿波',
    supbig: '特大',
    supsmall: '特小',
    supsingle: '特单',
    supdouble: '特双',
    supsumbig: '特合大',
    supsumsmall: '特合小',
    supsumsingle: '特合单',
    supsumdouble: '特合双',
    supbigdouble: '特大双',
    supsmalldouble: '特小双',
    supbigsingle: '特大单',
    supsmallsingle: '特小单',
    supendbig: '特尾大',
    supendsmall: '特尾小'
  }
  data.map((item, index) => {
    let key = item.showCode.split('-')
    item.choosen = false
    if (key.length === 1) { // 不带-的
      item.displayName = typeList[key[0]]
      if (key[0] === 'gold' || key[0] === 'wood' || key[0] === 'water' || key[0] === 'fire' || key[0] === 'soil') {
        obj.wx.dxds.push(item)
      } else if (key[0].startsWith('red') || key[0].startsWith('blue') || key[0].startsWith('green')) {
        if (key[0] !== 'red' && key[0] !== 'blue' && key[0] !== 'green') { // 半波
          obj.banbo.dxds.push(item)
        } else {  // 红蓝绿波
          item.displayName = typeList[key[0]]
          obj['th']['dxds'].push(item)
        }
      } else if (key[0].startsWith('sup')) {    // 特号
        if (!obj['th']) {
          obj['th'] = {}
          obj['th']['name'] = '特号'
          obj['th']['dxds'] = []
        }
        obj.th.dxds.push(item)
      } else if (key[0].startsWith('sum')) {    // 总和
        obj.sum.dxds.push(item)
      } else {  // 特码头尾
        item.displayName = key[0].substr(0, 1) + typeList[key[0].substr(1)]
        if (key[0].endsWith('start')) {
          obj.tmtw_head.dxds.push(item)
        } else {
          obj.tmtw_tail.dxds.push(item)
        }
      }
    } else {  // 带-的
      if (!obj[key[0]]) {
        obj[key[0]] = {
          name: typeList[key[0]],
          sz: [],
          dxds: []
        }
      }
      if (key[1].length <= 2) {
        item.displayName = Number(key[1])
        obj[key[0]]['sz'].push(item)
      } else {
        item.displayName = typeList[key[1]]
        if (key[0] === 'qm') {   // 七波特殊处理
          item.displayName = typeList[key[1].substr(0, key[1].length - 1)] + key[1].substr(key[1].length - 1)
        }
        switch (key[1]) {
          case 'sumbig':
            item.displayName = '合大'
            break
          case 'sumsmall':
            item.displayName = '合小'
            break
          case 'sumsingle':
            item.displayName = '合单'
            break
          case 'sumdouble':
            item.displayName = '合双'
            break
        }
        obj[key[0]]['dxds'].push(item)
      }
    }
  })
  return JSON.stringify(obj)
}

export function generateMap (unit, that) {
  that.tabs.map((item, index) => {
    that.viewM[item.value] = JSON.parse(unit)
    switch (item.value) {
      case 'kj':
        for (let key in that.viewM[item.value]) {
          if (key !== 'zm1') {
            delete that.viewM[item.value][key]
          } else {
            delete that.viewM[item.value][key]['dxds']
          }
        }
        break
      case 'tm':  // 特码
        for (let key in that.viewM[item.value]) {
          if (key !== 'tm' && key !== 'th') {
            delete that.viewM[item.value][key]
          }
        }
        break
      case 'tmtw':  // 特码头尾
        for (let key in that.viewM[item.value]) {
          if (key !== 'tmtw_head' && key !== 'tmtw_tail') {
            delete that.viewM[item.value][key]
          }
        }
        break
      case 'tx': // 特肖
      case 'wx': // 五行
      case 'banbo': // 半波
      case 'qm': // 七码
        for (let key in that.viewM[item.value]) {
          if (key !== item.value) {
            delete that.viewM[item.value][key]
          }
        }
        break
      case 'zm': // 正码
        for (let key in that.viewM[item.value]) {
          if (key !== item.value && key !== 'sum') {
            delete that.viewM[item.value][key]
          }
        }
        break
      default:  // 正一二三四五六
        for (let key in that.viewM[item.value]) {
          if (key !== item.value) {
            delete that.viewM[item.value][key]
          }
        }
    }
  })
}
