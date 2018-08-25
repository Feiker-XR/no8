
export function filterData (data) {
  let obj = {}
  let typeList = {
    sg: '三军',
    wq: '围骰、全骰',
    ds: '点数',
    cp: '长牌',
    dp: '短牌',
    big: '大',
    small: '小',
    qs: '全骰'
  }
  data.map((item, index) => {
    let key = item.showCode.split('-')
    if (!obj[key[0]]) {
      obj[key[0]] = {
        name: typeList[key[0]],
        dxds: [],
        sz: []
      }
    }
    item.choosen = false
    if (isNaN(Number(key[1]))) {
      item.displayName = typeList[key[1]]
    } else {
      item.displayName = Number(key[1])
    }
    if (key[0] === 'ds') {  // 点数样式不同
      obj[key[0]]['sz'].push(item)
    } else {
      obj[key[0]]['dxds'].push(item)
    }
  })
  console.log(obj)
  return JSON.stringify(obj)
}

export function generateMap (unit, that) {
  that.tabs.map((item, index) => {
    that.viewM[item.value] = JSON.parse(unit)
    for (let key in that.viewM[item.value]) {
      if (key !== item.value) {
        delete that.viewM[item.value][key]
      }
    }
  })
}
