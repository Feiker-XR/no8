export function generateMap (unit, that) {  // 生成数据模型对象
  for (var i = 0; i < that.tabs.length; i++) {
    var modelName = that.tabs[i].value
    that.viewM[modelName] = JSON.parse(unit)
    switch (modelName) {
      case 'kj':  // 快捷
        for (let key in that.viewM[modelName]) {
          if (key !== 'w') {
            delete that.viewM[modelName][key]
          }
        }
        break
      case 'zh':  // 整合
        delete that.viewM[modelName]['su']
        break
      case 'lm':  // 两面
        for (let key in that.viewM[modelName]) {
          delete that.viewM[modelName][key]['sz']
        }
        break
      case 'sz':  // 数字
        for (let key in that.viewM[modelName]) {
          if (key !== 'su') {
            delete that.viewM[modelName][key]['dxds']
          } else {
            delete that.viewM[modelName][key]
          }
        }
        break
      default:  // 第几球
        for (let key in that.viewM[modelName]) {
          if (key === modelName || key === 'su') {
            if (key === modelName) {
              that.viewM[modelName][key].name = that.viewM[modelName][key].name.substr(1)
            }
          } else {
            delete that.viewM[modelName][key]
          }
        }
        break
    }
  }
}

// 组装获得的数据成指定格式
export function filterData (data) {
  var arr = {}
  var typeList = {
    'w': '万第一球',
    'q': '千第二球',
    'b': '百第三球',
    's': '十第四球',
    'g': '个第五球',
    'su': '总和/龙虎',
    'big': '大',
    'small': '小',
    'single': '单',
    'double': '双',
    'dragon': '龙',
    'tiger': '虎',
    'sum': '和'
  }
  data.map(function (value, index) {
    var _keys = value.showCode.split('-')
    var _key = _keys[0]
    var _key1 = _keys[1]
    if (_key === 'sum' || _key === 'lhh') {
      _key = 'su'
    }
    if (!arr[_key]) {
      arr[_key] = {}
      arr[_key]['name'] = typeList[_key]
      arr[_key]['sz'] = []
      arr[_key]['dxds'] = []
    }
    value.choosen = false
    if (_key1.length > 2) {  // 非数字
      value.displayName = typeList[_key1]
      if (value.showCode.split('-')[0] === 'sum') { // 总和
        value.displayName = '总和' + typeList[_key1]
      }
      arr[_key]['dxds'].push(value)
    } else {  // 数字
      value.displayName = Number(_key1)
      arr[_key]['sz'].push(value)
    }
  })
  return JSON.stringify(arr)
}
