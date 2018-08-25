
export function filterData (data) {
  var obj = {}
  var typeList = {
    'east': '東',
    'south': '南',
    'west': '西',
    'noth': '北',
    'center': '中',
    'send': '发',
    'white': '白',
    'big': '大',
    'small': '小',
    'single': '单',
    'double': '双',
    'endbig': '尾大',
    'endsmall': '尾小',
    'sumsingle': '合数单',
    'sumdouble': '合数双',
    'dragon': '龙',
    'tiger': '虎',
    '1': '第一球',
    '2': '第二球',
    '3': '第三球',
    '4': '第四球',
    '5': '第五球',
    '6': '第六球',
    '7': '第七球',
    '8': '第八球',
    'sum': '总和',
    'zm': '正码'
  }
  data.map(function (item) {
    var _key = item.showCode.split('-')
    if (!obj[_key[0]]) {
      obj[_key[0]] = {}
      obj[_key[0]]['name'] = typeList[_key[0]]
      obj[_key[0]]['sz'] = []
      obj[_key[0]]['dxds'] = []
    }
    item.choosen = false
    if (_key[1].length > 2) { // 非数字盘
      item.displayName = typeList[_key[1]]
      if (_key[0] === 'sum') {
        item.displayName = '总和' + typeList[_key[1]]
      }
      item.displayType = 'dxds'
      obj[_key[0]]['dxds'].push(item)
    } else {  // 数字
      item.displayName = Number(_key[1])
      item.displayType = 'sz'
      obj[_key[0]]['sz'].push(item)
    }
  })
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
          if (key === 'zm') {
            delete that.viewM[item.value][key]
          } else {
            delete that.viewM[item.value][key]['sz']
          }
        }
        break
      case 'zm':    // 正码
        for (let key in that.viewM[item.value]) {
          if (key === 'zm' || key === 'sum') {
          } else {
            delete that.viewM[item.value][key]
          }
        }
        break
      default:      // 第几球
        for (let key in that.viewM[item.value]) {
          if (key !== item.value) {
            delete that.viewM[item.value][key]
          }
        }
        break
    }
  })
}
