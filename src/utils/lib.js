import { validateTime } from './validate'
import { download, fls } from '@/config'
import getLunarDay from './lunar'

let lib = {
  getLunarDay,
  addEventListener (element, type, fn) {
    if (typeof (element.addEventListener) !== 'undefined') {
      element.addEventListener(type, fn, false)
    } else if (typeof (element.attachEvent) !== 'undefined') {
      element.attachEvent('on' + type, fn)
    } else {
      element['on' + type] = fn
    }
  },
  removeEventListener (element, type, fn) {
    if (typeof (element.removeEventListener) !== 'undefined') {
      element.removeEventListener(type, fn)
    } else if (typeof (element.detachEvent) !== 'undefined') {
      element.detachEvent('on' + type, fn)
    } else {
      element['on' + type] = null
    }
  },
  isArray (o) {
    return Object.prototype.toString.call(o) === '[object Array]'
  },

  isObject (o) {
    return Object.prototype.toString.call(o) === '[object Object]'
  },

  isString (o) {
    return Object.prototype.toString.call(o) === '[object String]'
  },

  isNumber (o) {
    return Object.prototype.toString.call(o) === '[object Number]'
  },

  isDate (o) {
    return Object.prototype.toString.call(o) === '[object Date]'
  },

  isRegExp (o) {
    return Object.prototype.toString.call(o) === '[object RegExp]'
  },
  getDateMonthFirst (date) {
    date = date ? new Date(date) : new Date()
    date.setDate(1)
    return this.myMoment(date).formate('YYYY-MM-DD')
  },
  getDateMonthLast (date) {
    date = date ? new Date(date) : new Date()
    var currentMonth = date.getMonth()
    var nextMonth = ++currentMonth
    var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
    var oneDay = 1000 * 60 * 60 * 24
    return this.myMoment(new Date(nextMonthFirstDay - oneDay)).formate('YYYY-MM-DD')
  },
  getAllDates (begin, end) {
    if (!begin || !end) {
      return false
    }
    let ab = begin.split('-')
    let ae = end.split('-')
    let db = new Date()
    db.setUTCFullYear(ab[0], ab[1] - 1, ab[2])
    let de = new Date()
    de.setUTCFullYear(ae[0], ae[1] - 1, ae[2])
    let unixDb = db.getTime()
    let unixDe = de.getTime()
    let arr = []
    for (let k = unixDb; k <= unixDe;) {
      arr.push(this.myMoment(new Date(this.dataFormat(parseInt(k)))).formate('YYYY-MM-DD'))
      k = k + 24 * 60 * 60 * 1000
    }
    return arr
  },
  dataFormat (date) {
    date = new Date(date)
    let s = ''
    let month = date.getMonth() + 1
    let day = date.getDate()
    s += date.getFullYear() + '-'
    s += month + '-'
    s += day
    return s
  },
  myMoment (date = new Date().getTime()) {
    this.date = new Date(date)
    return this
  },
  formate (formatStr = 'YYYY-MM-DD HH:mm:ss') {
    const date = this.date
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const week = date.getDay()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    const weeks = ['日', '一', '二', '三', '四', '五', '六']
    return formatStr.replace(/Y{2,4}|M{1,2}|D{1,2}|d{1,4}|H{1,2}|m{1,2}|s{1,2}/g, (match) => {
      switch (match) {
        case 'YY':
          return String(year).slice(-2)
        case 'YYY':
        case 'YYYY':
          return String(year)
        case 'M':
          return String(month)
        case 'MM':
          return String(month).padStart(2, '0')
        case 'D':
          return String(day)
        case 'DD':
          return String(day).padStart(2, '0')
        case 'd':
          return String(week)
        case 'dd':
          return weeks[week]
        case 'ddd':
          return '周' + weeks[week]
        case 'dddd':
          return '星期' + weeks[week]
        case 'H':
          return String(hour)
        case 'HH':
          return String(hour).padStart(2, '0')
        case 'm':
          return String(minute)
        case 'mm':
          return String(minute).padStart(2, '0')
        case 's':
          return String(second)
        case 'ss':
          return String(second).padStart(2, '0')
        default:
          return match
      }
    })
  },
  // 下载
  downloadFile (fileName, content) {
    let aLink = document.createElement('a')
    let blob = this.base64ToBlob(content) // new Blob([content]);

    let evt = document.createEvent('HTMLEvents')
    evt.initEvent('click', true, true)// initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
    aLink.download = fileName
    aLink.href = URL.createObjectURL(blob)

    // aLink.dispatchEvent(evt);
    // aLink.click()
    aLink.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))// 兼容火狐
  },
  // base64转blob
  base64ToBlob (code) {
    let parts = code.split(';base64,')
    let contentType = parts[0].split(':')[1]
    let raw = window.atob(parts[1])
    let rawLength = raw.length

    let uInt8Array = new Uint8Array(rawLength)

    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i)
    }
    return new Blob([uInt8Array], { type: contentType })
  },
  getDiff (arr1, arr2) {
    for (const item of arr1) {
      if (arr2.includes(item)) {
        return item
      }
    }
    return false
  },
  setTreeCount (data, count = 0) {
    return data.map(item => {
      item.count = count
      if (item.children) {
        item.children = this.setTreeCount(item.children, count + 1)
      }
      return item
    })
  },
  /**
   * 处理部门数据
   */
  dealTreeList (data) {
    let obj = {}
    for (var i = 0; i < data.length; i++) {
      if (obj[data[i].parentId]) {
        obj[data[i].parentId].push(data[i])
      } else {
        obj[data[i].parentId] = []
        obj[data[i].parentId].push(data[i])
      }
    }
    return this.permClassification([...obj[0]], obj)
  },
  /**
   * 递归处理数据
   */
  permClassification (arr, obj) {
    for (var i = 0; i < arr.length; i++) {
      for (var k in obj) {
        if (arr[i].id === Number(k)) {
          arr[i].children = [...obj[k]]
        }
      }
      if (arr[i].children) {
        this.permClassification(arr[i].children, obj)
      }
    }
    return arr
  },
  contrastTime (a, b) {
    let day = '01/01/1970 '
    if (!validateTime(a) || !validateTime(b)) {
      return true
    }
    return new Date(day + a).getTime() - new Date(day + b).getTime() > 0
  },
  getStartEndTime (options) {
    let { date, time, duration } = options
    let data = {}
    data.startTime = this.myMoment(date).formate('YYYY-MM-DD') + ' ' + time
    data.startTime = this.myMoment(data.startTime).formate()
    data.endTime = new Date(data.startTime).getTime() + duration * 60 * 1000
    data.endTime = this.myMoment(data.endTime).formate()
    return data
  },
  hasPeriodOrNot (data, classes) {
    let { startTime, endTime } = data
    startTime = new Date(startTime).getTime()
    endTime = new Date(endTime).getTime()
    for (const c of classes) {
      if (!(new Date(c.endTime).getTime() <= startTime || new Date(c.startTime).getTime() >= endTime)) {
        return this.myMoment(c.startTime).formate('YYYY-MM-DD HH:mm')
      }
    }
    return false
  },
  downLoadUrl (base, param) {
    let accout = JSON.parse(sessionStorage.getItem('account') || '{}')
    let { token } = accout
    if (!token) return ''
    let url = download + base + '?token=' + token
    for (var k in param) {
      if (param[k]) {
        url += '&' + k + '=' + param[k]
      }
    }
    return url
  },
  isSameDay (date1, date2) {
    return new Date(date1).getDate() === new Date(date2).getDate()
  },
  isExternal (path) {
    return /^(https?:|mailto:|tel:)/.test(path)
  },
  getStatic (url) {
    return `${fls.endsWith('/') ? fls : fls + '/'}${url}`
  }
}

export default {
  install (Vue) {
    Vue.lib = Vue.prototype.$lib = lib
  }
}
