export function filterData (data) {
  let obj = {}
  let typeList = {
    '1': '第一球',
    '2': '第二球',
    '3': '第三球',
    '4': '第四球',
    '5': '第五球',
    'su': '总和-龙虎和',
    'big': '大',
    'small': '小',
    'single': '单',
    'double': '双',
    'dragon': '龙',
    'tiger': '虎',
    'endbig': '尾大',
    'endsmall': '尾小'
  }
  data.map(function (item, index) {
    console.log(item.showCode)
    var key = item.showCode.split('-')
    if (key[0] === 'sum' || key[0] === 'dragon' || key[0] === 'tiger') {
      key[0] = 'su'
    }
    if (!obj[key[0]]) {
      obj[key[0]] = {}
      obj[key[0]]['name'] = typeList[key[0]]
      obj[key[0]]['sz'] = []
      obj[key[0]]['dxds'] = []
    }
    item.choosen = false
    if (typeof key[1] === 'undefined' || key[1].length > 2) {
      item.displayName = typeList[key[1]]
      if (typeof key[1] === 'undefined') {  // 龙虎
        item.displayName = typeList[item.showCode.split('-')[0]]
      } else if (key[0] === 'su') {
        console.log(111111)
        item.displayName = '总和' + typeList[key[1]]
      }
      obj[key[0]]['dxds'].push(item)
    } else {
      item.displayName = Number(key[1])
      obj[key[0]]['sz'].push(item)
    }
  })
  console.log(obj)
  return JSON.stringify(obj)
}

export function generateMap (unit, that) {
  that.tabs.map(function (item, index) {
    that.viewM[item.value] = JSON.parse(unit)
    switch (item.value) {
      case 'kj':    // 快捷
        for (let key in that.viewM[item.value]) {
          if (key !== '1') {
            delete that.viewM[item.value][key]
          }
        }
        break
      case 'lm':    // 两面
        for (let key in that.viewM[item.value]) {
          if (key !== 'su') {
            delete that.viewM[item.value][key]['sz']
          }
        }
        break
      default:      // 第几球
        for (let key in that.viewM[item.value]) {
          if (key !== item.value) {
            delete that.viewM[item.value][key]
          } else {
            delete that.viewM[item.value][key]['dxds']
          }
        }
        break
    }
  })
}
