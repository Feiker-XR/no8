export function filterData (data) {
  let obj = {}
  let typeList = {
    sum: '冠、亚军和',
    '1': '冠军',
    '2': '亚军',
    '3': '第三名',
    '4': '第四名',
    '5': '第五名',
    '6': '第六名',
    '7': '第七名',
    '8': '第八名',
    '9': '第九名',
    '10': '第十名',
    big: '大',
    small: '小',
    single: '单',
    double: '双',
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
    if (key[1].length <= 2) {
      item.displayName = Number(key[1])
      obj[key[0]]['sz'].push(item)
    } else {
      item.displayName = typeList[key[1]]
      if (key[0] === 'sum') {
        item.displayName = '冠亚' + typeList[key[1]]
      }
      obj[key[0]]['dxds'].push(item)
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
          if (key !== '1') {
            delete that.viewM[item.value][key]
          }
        }
        break
      case 'lm':
        for (let key in that.viewM[item.value]) {
          delete that.viewM[item.value][key]['sz']
        }
        break
      case 'sz':
        for (let key in that.viewM[item.value]) {
          if (key === 'sum') {
            delete that.viewM[item.value][key]
          } else {
            delete that.viewM[item.value][key]['dxds']
          }
        }
        break
      case 'hz':
        for (let key in that.viewM[item.value]) {
          if (key !== 'sum') {
            delete that.viewM[item.value][key]
          }
        }
        break
      default:
    }
  })
}
