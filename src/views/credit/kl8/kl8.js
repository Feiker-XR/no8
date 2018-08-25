export function filterData (data) {
  let obj = {
    sum: {
      name: '总和、总和过关',
      dxds: []
    },
    forewordEnd: {
      name: '前后和',
      dxds: []
    },
    singleDouble: {
      name: '单双和',
      dxds: []
    },
    fiveEle: {
      name: '五行',
      dxds: []
    },
    zm: {
      name: '正码',
      sz: []
    }
  }
  let typeList = {
    big: '总和大',
    small: '总和小',
    single: '总和单',
    double: '总和双',
    810: '总和810',
    bigsingle: '总大单',
    bigdouble: '总大双',
    smallsingle: '总小单',
    smalldouble: '总小双',
    headmore: '前(多)',
    endmore: '后(多)',
    hendend: '前后(和)',
    singlemore: '单(多)',
    doublemore: '双(多)',
    singledouble: '单双(和)',
    glod: '金',
    wood: '木',
    water: '水',
    fire: '火',
    soil: '土'
  }
  data.map((item, index) => {
    let key = item.showCode.split('-')
    item.choosen = false
    if (key.length === 1) {
      item.displayName = typeList[key[0]]
      if (key[0].length <= 5) { // 五行
        obj.fiveEle.dxds.push(item)
      } else if (key[0] === 'headmore' || key[0] === 'endmore') { // 前后和
        obj.forewordEnd.dxds.push(item)
      } else {  // 单双和
        obj.singleDouble.dxds.push(item)
      }
    } else {
      if (key[0] === 'sum') {
        item.displayName = typeList[key[1]]
        if (key[1] === 'hendend') { // 前后和
          obj.forewordEnd.dxds.push(item)
        } else if (key[1] === 'singledouble') { // 单双和
          obj.singleDouble.dxds.push(item)
        } else { // 总和
          obj.sum.dxds.push(item)
        }
      } else {
        item.displayName = Number(key[1])
        obj.zm.sz.push(item)
      }
    }
  })
  // console.log(obj)
  return JSON.stringify(obj)
}

export function generateMap (unit, that) {
  that.tabs.map((item, index) => {
    that.viewM[item.value] = JSON.parse(unit)
    if (item.value === 'lm') {
      for (let key in that.viewM[item.value]) {
        if (key === 'zm') {
          delete that.viewM[item.value][key]
        }
      }
    } else {
      for (let key in that.viewM[item.value]) {
        if (key !== 'zm') {
          delete that.viewM[item.value][key]
        }
      }
    }
  })
}
