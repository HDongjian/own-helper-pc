export const weeks = ['日', '一', '二', '三', '四', '五', '六']
export const times = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00']
export const moment = {
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
  getDateMonthFirst (date) {
    date = date ? new Date(date) : new Date()
    date.setDate(1)
    return date
  },
  getDateMonthLast (date) {
    date = date ? new Date(date) : new Date()
    var currentMonth = date.getMonth()
    var nextMonth = ++currentMonth
    var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
    var oneDay = 1000 * 60 * 60 * 24
    return new Date(nextMonthFirstDay - oneDay)
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
  }
}
