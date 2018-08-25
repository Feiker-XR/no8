export function filterData (data) {
  let obj = {}
  let typeList = {
    '1': '百第一球',
    '2': '十第二球',
    '3': '个第三球',
    lhh: '龙虎和',
    kd: '跨度',
    bssum: '百十和数',
    bgsum: '百个和数',
    sgsum: '十个和数',
    bsgsum: '百十个和数',
    big: '大',
    small: '小',
    single: '单',
    double: '双',
    zhi: '质',
    sum: '合',
    endbig: '尾数大',
    endsmall: '尾数小',
    endzhi: '尾数质',
    endsum: '尾数合',
    dragon: '龙',
    tiger: '虎'
  }
  data.map((item, index) => {
    let key = item.showCode.split('-')
    if (!obj[key[0]]) {
      obj[key[0]] = {
        name: typeList[key[0]],
        sz: [],
        dxds: []
      }
    }
    item.choosen = false
    if (key[1].length === 1) {
      item.displayName = Number(key[1])
      obj[key[0]].sz.push(item)
    } else {
      item.displayName = typeList[key[1]]
      if (item.showCode === 'lhh-sum') {    // 特殊处理龙虎的和
        item.displayName = '和'
      }
      obj[key[0]].dxds.push(item)
    }
  })
  return JSON.stringify(obj)
}

export function generateMap (unit, that) {
  that.tabs.map((item, index) => {
    that.viewM[item.value] = JSON.parse(unit)
    switch (item.value) {
      case 'kj':    // 快捷
        for (let key in that.viewM[item.value]) {
          if (key !== '1') {  //  && key !== 'lhh'
            delete that.viewM[item.value][key]
          }
        }
        break
      case 'lm':  // 两面
        for (let key in that.viewM[item.value]) {
          if (key !== '1' && key !== '2' && key !== '3' && key !== 'lhh') {
            delete that.viewM[item.value][key]
          } else {
            delete that.viewM[item.value][key]['sz']
          }
        }
        break
      case 'sz': // 数字
        for (let key in that.viewM[item.value]) {
          if (key !== '1' && key !== '2' && key !== '3') {
            delete that.viewM[item.value][key]
          } else {
            delete that.viewM[item.value][key]['dxds']
          }
        }
        break
      case 'kd': // 跨度
        for (let key in that.viewM[item.value]) {
          if (key !== 'kd') {
            delete that.viewM[item.value][key]
          } else {
            delete that.viewM[item.value][key]['dxds']
          }
        }
        break
      case 'hs':  // 和数
        for (let key in that.viewM[item.value]) {
          if (key !== 'bgsum' && key !== 'bsgsum' && key !== 'bssum' && key !== 'sgsum') {
            delete that.viewM[item.value][key]
          } else {
            delete that.viewM[item.value][key]['sz']
          }
        }
        break
      default:  // 第几球
        for (let key in that.viewM[item.value]) {
          if (key !== item.value && key !== 'lhh') {
            delete that.viewM[item.value][key]
          }
        }
    }
  })
}
