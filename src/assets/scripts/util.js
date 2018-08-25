export function getViewportSize () {
  return {
    width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
  }
}

export function findIndex (list, info, attribute) {
  return list.findIndex(item => {
    return item[attribute] === info[attribute]
  })
}

export function isJson (obj) {
  return typeof (obj) === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length
}

/**
 * 判断是否为数字
 * @param val
 * @returns {boolean}
 */
export function isNumber (val) {
  return /^[0-9]+[1-9]*]*$/.test(val)
}

/**
 * 判断是否为数组
 * @param o
 * @returns {boolean}
 */
export function isArray (o) {
  return Object.prototype.toString.call(o) === '[object Array]'
}

export function go (url, $router) {
  if (/^javas/.test(url) || !url) return
  const useRouter = typeof url === 'object' || ($router && typeof url === 'string' && !/http/.test(url))
  if (useRouter) {
    if (typeof url === 'object' && url.replace === true) {
      $router.replace(url)
    } else {
      url === 'BACK' ? $router.go(-1) : $router.push(url)
    }
  } else {
    window.location.href = url
  }
}

export function parse (data) {
  if (data && data.length) {
    return data.map(item => {
      item.isShow = false
      return item
    })
  }
}

export function joinStr (array, str1, str2) {
  let result = ''
  if (array && array.length) {
    array.forEach(item => {
      if (item.length) {
        result += item.join(str1) + str2
      }
    })
    result = result.substr(0, result.length - 1)
  }
  return result
}

/**
 * 根据下期开奖期数推算出上期开奖期数
 * @param nextIssue 下期开奖期数
 * @param period 当前彩种每天开多少期
 * @param lotteryType 当前彩种类型
 * @returns {string}
 */
export function getPerIssue (nextIssue, period, lotteryType) {
  let perIssue = ''
  let issue = nextIssue.substr(nextIssue.length - period.length, nextIssue.length)
  if ((Number(issue) - 1) === 0) {
    if (lotteryType === 1) { // 为yyyyMMdd xxx 3位数
      perIssue = period.length > 2 ? `${getLastDayYYYYMMDDStr(nextIssue)}${period}` : `${getLastDayYYYYMMDDStr(nextIssue)}0${period}`
    } else if (lotteryType === 3) { // yyMMdd xxx 3位数
      perIssue = period.length > 2 ? `${getLastDayYYMMDDStr(nextIssue)}${period}` : `${getLastDayYYMMDDStr(nextIssue)}0${period}`
    } else if (lotteryType === 6) {
      perIssue = period.length > 3 ? `${getLastDayYYYYMMDDStr(nextIssue)}${period}` : `${getLastDayYYYYMMDDStr(nextIssue)}0${period}`
    } else if (lotteryType === 7) {
      perIssue = period.length > 1 ? `${getLastDayYYYYMMDDStr(nextIssue)}${period}` : `${getLastDayYYYYMMDDStr(nextIssue)}0${period}`
    } else {
      perIssue = `${(Number(nextIssue) - 1)}`
    }
  } else {
    perIssue = `${(Number(nextIssue) - 1)}`
  }
  let flag = false
  if (nextIssue.split('')[0] === 0) {
    flag = true
  }
  if (flag) {
    perIssue = `0${perIssue}`
  }
  return perIssue
}

function getLastDayYYMMDDStr (nextGameResultNum) {
  const perIssueDate = `${nextGameResultNum.substr(0, 4)}/${nextGameResultNum.substr(4, 2)}/${nextGameResultNum.substr(6, 2)}`
  const lastDateTime = new Date(perIssueDate).getTime() - 24 * 60 * 60 * 1000
  return getFormateDate(lastDateTime, 'yyMMdd')
}

function getLastDayYYYYMMDDStr (nextGameResultNum) {
  const perIssueDate = `${nextGameResultNum.substr(0, 4)}/${nextGameResultNum.substr(4, 2)}/${nextGameResultNum.substr(6, 2)}`
  const lastDateTime = new Date(perIssueDate).getTime() - 24 * 60 * 60 * 1000
  return getFormateDate(lastDateTime, 'yyyyMMdd')
}

/**
 * 日期格式化
 * @param dateTime 格式
 * @param fmt 被格式化的时间(没有就取当前系统时间)
 * @returns {string}
 */
export function getFormateDate (dateTime, fmt) {
  if (dateTime) {
    return `${new Date(dateTime).Format(fmt)}`
  }
  return `${new Date().Format(fmt)}`
}

export function parseDrawResult (code, result) {
  const temp = []
  let sum = 0
  result.forEach((ball, index) => {
    sum += Number(ball)
    if (code === 'xgc' && result.length === (index + 1)) {
      temp.push({show: true, value: '+', code: 'plus'})
    }
    temp.push({show: code !== 'pk10', value: ball, code: ball})
  })
  if (code === 'klc') {
    temp.push({show: true, value: '=', code: 'equal'})
    temp.push({show: true, value: sum, code: sum})
  }
  return temp
}

/**
 * 获取页面元素绝对定位坐标
 * @param target //目标元素
 * @returns {object}
 *
 */
export function offset (target) {
  let top = 0
  let left = 0

  while (target.offsetParent) {
    top += target.offsetTop
    left += target.offsetLeft
    target = target.offsetParent
  }

  return {
    top: top,
    left: left
  }
}

export function Cnm (n, m) {
  let i = 0
  let fengzi = 1
  let fengmu = 1
  for (i = 0; i < m; i++) {
    fengzi = fengzi * (n - i)
  }
  for (i = 0; i < m; i++) {
    fengmu = fengmu * (m - i)
  }
  return fengzi / fengmu
}

/**
 * 根据传入字符切割长度为NUM指定的数组
 * @param str
 * @param num
 * @returns {Array}
 * @constructor
 */
export function StringToArray (str, num) {
  if (str && str.length === 0) return []
  let leng = 0
  let arr = []
  while (true) {
    if ((leng + num) > str.length) break
    arr.push(str.substr(leng, num))
    leng += num
  }
  return arr
}

/**
 * 获得一组随机数
 * @param length
 * @param minNum
 * @param maxNum
 * @returns {Array}
 * @constructor
 */
export function MathArray (length, minNum, maxNum) {
  let tempArr = []
  while (true) {
    if (tempArr.length === length) {
      break
    }
    let x = parseInt(Math.random() * (maxNum + 1))
    if (isRepeat(tempArr, x) && x >= minNum) {
      tempArr.push(x)
    }
  }
  return tempArr
}

export function save (array, value, type) {
  if (type === 'add') {
    return add(array, value)
  } else if (type === 'clear') {
    return clear(array, value)
  } else if (type === 'reverse') {
    return reverse(array, value)
  }
}

// 不存在则添加
function add (array, value) {
  if (array.indexOf(value) === -1) {
    array.push(value)
  }
  return 1
}
// 存在则删除
function clear (array, value) {
  const index = array.indexOf(value)
  if (index !== -1) {
    array.splice(index, 1)
  }
  return -1
}
// 存在则清除,不存在则添加
function reverse (array, value) {
  const index = array.indexOf(value)
  if (index === -1) {
    array.push(value)
    return 1
  } else {
    array.splice(index, 1)
    return -1
  }
}

export function unique (arr, count) {
  let fit = []
  let error = []
  let hash = {}
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i]
    // 去除长度不符合的投注号码
    if (item.length !== count) {
      error.push(item)
      continue
    }
    // 去除投注框重复号码
    if (hash[item] !== 1) {
      fit.push(item)
      hash[item] = 1
    } else {
      error.push(item)
    }
  }
  return [fit, error]
}

/**
 * 是否重复
 * @param arr
 * @param s
 * @returns {boolean}
 */
function isRepeat (arr, s) {
  return arr.indexOf(s) === -1
}

export function Combination (o, c) {
  let l = o.length
  let r = []
  if (c > l) return r
  if (c === 1) return o
  if (l === c) {
    r[0] = o.join('|')
    return r
  }
  let a = ''
  let b = ''
  let s = ''
  for (let g = 0; g < c; g++) {
    a += '1'
    b += '1'
  }
  for (let e = 0; e < l - c; e++) {
    a += '0'
  }
  for (let d = 0; d < c; d++) {
    s += o[d] + '|'
  }
  r[0] = s.substr(0, s.length - 1)
  let h = 1
  s = ''
  while (a.substr(a.length - c, c) !== b) {
    a = movestring(a)
    for (let d = 0; d < l; d++) {
      if (a.substr(d, 1) === '1') {
        s += o[d] + '|'
      }
    }
    r[h] = s.substr(0, s.length - 1)
    s = ''
    h++
  }
  return r
}

export function movestring (a) {
  let h = ''
  let k = '01'
  let b = ''
  let f = ''
  let j = ''
  let g = false
  let c = false
  for (let e = 0; e < a.length; e++) {
    if (g === false) {
      h += a.substr(e, 1)
    }
    if (g === false && a.substr(e, 1) === '1') {
      c = true
    } else {
      if (g === false && c === true && a.substr(e, 1) === '0') {
        g = true
      } else {
        if (g === true) {
          b += a.substr(e, 1)
        }
      }
    }
  }
  h = h.substr(0, h.length - 2)
  for (let d = 0; d < h.length; d++) {
    if (h.substr(d, 1) === '1') {
      f += h.substr(d, 1)
    } else {
      if (h.substr(d, 1) === '0') {
        j += h.substr(d, 1)
      }
    }
  }
  h = f + j
  return h + k + b
}

export function arrToStr (arr) {
  let temp = []
  arr.forEach(item => {
    temp.push(`${item}`)
  })
  return temp
}

export function uniqueCnm3 (arr, count) {
  let fit = []
  let error = []
  let hash = {}
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i] + ''
    // 去除长度不符合的投注号码
    if (item.length !== count) {
      error.push(item)
      continue
    }
    let itemSort = item.split('').sort()
    if (!(itemSort[0] === itemSort[1] || itemSort[1] === itemSort[2] || itemSort[0] === itemSort[2]) || (itemSort[0] === itemSort[1] && itemSort[1] === itemSort[2])) {
      error.push(item)
      continue
    }
    // 数组排序，合并数组
    itemSort = itemSort.join('')
    // 去除投注框重复号码
    if (hash[itemSort] !== 1) {
      fit.push(item)
      hash[itemSort] = 1
    } else {
      error.push(item)
    }
  }
  return [fit, error]
}

/**
 *PK10去重 (排序,速度适中)
 *单注：长度符合条件 同一注投注不能有相同号码 号码不能小于1,不能大于10
 *投注框：不能有重复号码
 *注：时时彩直选去重
 */
export function uniquePK10 (nums, numLength) {
  let fit = []
  let error = []
  let hash = {}
  for (let s in nums) {
    let n = nums[s]
    if (n.length !== numLength) {
      error.push(n)
      continue
    }
    // 同一注投注不能有相同号码,每个号码不能小于1,不能大于11
    let ns = StringToArray(n, 2).sort()
    let as = false
    for (let i in ns) {
      // 判断大小
      if ((ns[i] / 1) > 10 || (ns[i] / 1) < 1) {
        as = true
        error.push(n)
        break
      }
      // 当前号码去重
      let next = (i / 1) + 1
      if (next < ns.length && ns[i] === ns[next]) {
        as = true
        error.push(n)
        break
      }
    }
    if (as) continue
    if (hash[n] === 1) {
      error.push(n)
      continue
    }
    hash[n] = 1
    fit.push(n)
  }
  hash = null
  return [fit, error]
}

/**
 *11选5直选去重 (排序,速度适中)
 *单注：长度符合条件 同一注投注不能有相同号码 号码不能小于1,不能大于10
 *投注框：不能有重复号码
 *注：时时彩直选去重
 */
export function unique11X5ZhiXuan (nums, numLength) {
  let fit = []
  let error = []
  let hash = {}
  for (let s in nums) {
    let n = nums[s]
    if (n.length !== numLength) {
      error.push(n)
      continue
    }
    // 同一注投注不能有相同号码,每个号码不能小于1,不能大于11
    let ns = StringToArray(n, 2).sort()
    let as = false
    for (let i in ns) {
      // 判断大小
      if ((ns[i] / 1) > 11 || (ns[i] / 1) < 1) {
        as = true
        error.push(n)
        break
      }
      // 当前号码去重
      let next = (i / 1) + 1
      if (next < ns.length && ns[i] === ns[next]) {
        as = true
        error.push(n)
        break
      }
    }
    if (as) continue
    if (hash[n] === 1) {
      error.push(n)
      continue
    }
    hash[n] = 1
    fit.push(n)
  }
  hash = null
  return [fit, error]
}

/*
 *去重(排序,速度适中)
 *单注：长度符合条件 同一注投注不能有相同号码 号码不能小于1,不能大于11
 *投注框：不能有重复号码
 *注：时时彩直选去重
 */
export function unique11X5ZuXuan (nums, numLength) {
  let fit = []
  let error = []
  let hash = {}
  for (let s in nums) {
    let n = nums[s]
    if (n.length !== numLength) {
      error.push(n)
      continue
    }
    // 同一注投注不能有相同号码,每个号码不能小于1,不能大于11
    let ns = StringToArray(n, 2).sort()
    let as = false
    for (let i in ns) {
      if ((ns[i] / 1) > 11 || (ns[i] / 1) < 1) {
        as = true
        error.push(n)
        break
      }
      let next = i / 1 + 1
      if (next < ns.length && ns[i] === ns[next]) {
        as = true
        error.push(n)
        break
      }
    }
    if (as) continue
    ns = ns.join('')
    if (hash[ns] === 1) {
      error.push(n)
      continue
    }
    hash[ns] = 1
    fit.push(n)
  }
  hash = null
  return [fit, error]
}

// 组选混合
// 单注：长度符合,不为豹子号
// 投注框：不能有重复号码
// 注：时时彩组选去重
export function uniqueCnm (arr, count) {
  let fit = []
  let error = []
  let hash = {}
  for (let i = 0; i < arr.length; i++) {
    let item = arr[i] + ''
    // 去除长度不符合的投注号码
    if (item.length !== count) {
      error.push(item)
      continue
    }
    // 数组排序，合并数组
    let itemSort = item.split('').sort()
    if (itemSort.length === 2) {
      if (itemSort[0] === itemSort[1]) {
        error.push(item)
        continue
      }
    } else if (itemSort.length === 3) {
      if (itemSort[0] === itemSort[1] && itemSort[1] === itemSort[2]) {
        error.push(item)
        continue
      }
    }

    itemSort = itemSort.join('')
    // 去除投注框重复号码
    if (hash[itemSort] !== 1) {
      fit.push(item)
      hash[itemSort] = 1
    } else {
      error.push(item)
    }
  }
  return [fit, error]
}
