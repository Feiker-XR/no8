export function filterData (data, that) {
  let typeList = {
    big: '大',
    small: '小',
    single: '单',
    double: '双',
    bigsingle: '大单',
    bigdouble: '大双',
    smallsingle: '小单',
    smalldouble: '小双',
    supbig: '极大',
    supsmall: '极小',
    red: '红波',
    green: '绿波',
    blue: '蓝波',
    bz: '豹子',
    tmsb: '特码三包'
  }
  let obj = {
    ds: {
      name: '点数',
      dxds: [],
      sz: []
    },
    lm: {
      name: '两面',
      dxds: [],
      sz: []
    },
    sb: {
      name: '色波/豹子/包三',
      dxds: [],
      sz: []
    }
  }
  data.map(function (item, index) {
    item.choosen = false
    if (item.showCode.length <= 2 && item.showCode !== 'bz') { // 数字
      item.displayName = Number(item.showCode)
      obj.ds.sz.push(item)
      // that.viewM['zh']['1']['sz'].push(item)
    } else if (item.showCode === 'red' || item.showCode === 'green' || item.showCode === 'blue' || item.showCode === 'bz' || item.showCode === 'tmsb') { // 波胆
      item.displayName = typeList[item.showCode]
      obj.sb.dxds.push(item)
      // that.viewM['zh']['3']['dxds'].push(item)
    } else { // 大小单双
      item.displayName = typeList[item.showCode]
      obj.lm.dxds.push(item)
      that.viewM['zh']['2']['dxds'].push(item)
    }
  })
  return JSON.stringify(obj)
}

export function generateMap (unit, that) {
  that.tabs.map((item, index) => {
    that.viewM[item.value] = JSON.parse(unit)
    switch (item.value) {
      default:
        for (let key in that.viewM[item.value]) {
          if (key !== item.value) {
            delete that.viewM[item.value][key]
          }
        }
    }
  })
}
