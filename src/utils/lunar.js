var lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977,
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970,
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557,
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573, 0x052d0, 0x0a9a8, 0x0e950, 0x06aa0,
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0,
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b5a0, 0x195a6,
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570,
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0,
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5,
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930,
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530,
  0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45,
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0]

var nStr1 = ['日', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
var nStr2 = ['初', '十', '廿', '卅']
// 公历节日
var sFtv = [
  '0101 元旦',
  '0214 情人节',
  '0308 妇女节',
  // '0312 植树节',
  // '0315 消费者权益日',
  '0401 愚人节',
  '0501 劳动节',
  // '0504 青年节',
  // '0512 护士节',
  // '0601 儿童节',
  '0701 建党节',
  '0801 建军节',
  '0910 教师节',
  // '0928 孔子诞辰',
  '1001 国庆节',
  // '1006 老人节',
  // '1024 联合国日',
  '1224 平安夜',
  '1225 圣诞节']
// 农历节日
var lFtv = [
  '0101 春节',
  '0102 大年初二',
  '0103 大年初三',
  '0104 大年初四',
  '0105 大年初五',
  '0115 元宵节',
  '0206 老婆生日',
  '0505 端午节',
  '0707 七夕情人节',
  '0715 中元节',
  '0815 中秋节',
  '0909 重阳节',
  '1208 腊八节',
  '1224 小年'
]
// 返回农历y年的总天数
function lYearDays (y) {
  var i; var sum = 348
  for (i = 0x8000; i > 0x8; i >>= 1)sum += (lunarInfo[y - 1900] & i) ? 1 : 0
  return (sum + leapDays(y))
}
// 返回农历y年闰月的天数
function leapDays (y) {
  if (leapMonth(y)) return ((lunarInfo[y - 1900] & 0x10000) ? 30 : 29)
  else return (0)
}
// 判断y年的农历中那个月是闰月,不是闰月返回0
function leapMonth (y) {
  return (lunarInfo[y - 1900] & 0xf)
}
// 返回农历y年m月的总天数
function monthDays (y, m) {
  return ((lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29)
}
// 算出当前月第一天的农历日期和当前农历日期下一个月农历的第一天日期
function dianaday (objDate) {
  var i; var leap = 0; var temp = 0
  var baseDate = new Date(1900, 0, 31)
  var offset = (objDate - baseDate) / 86400000
  for (i = 1900; i < 2050 && offset > 0; i++) {
    temp = lYearDays(i)
    offset -= temp
  }
  if (offset < 0) {
    offset += temp
    i--
  }
  let year = i
  leap = leapMonth(i) // 闰哪个月
  let isLeap = false
  for (i = 1; i < 13 && offset > 0; i++) {
    if (leap > 0 && i === (leap + 1) && isLeap === false) { // 闰月
      --i; isLeap = true; temp = leapDays(year)
    } else {
      temp = monthDays(year, i)
    }
    if (isLeap === true && i === (leap + 1)) isLeap = false // 解除闰月
    offset -= temp
  }
  if (offset === 0 && leap > 0 && i === leap + 1) {
    if (isLeap) { isLeap = false } else { isLeap = true; --i }
  }
  if (offset < 0) { offset += temp; --i }
  let month = i
  let day = offset + 1
  return {
    sYear: objDate.getFullYear(),
    sMonth: objDate.getMonth() + 1,
    sDay: objDate.getDate(),
    week: objDate.getDay(),
    // 农历
    lYear: year,
    lMonth: month,
    lDay: parseInt(day),
    isLeap: isLeap,
    lunarFestival: '', // 农历节日
    solarFestival: '', // 公历节日
    solarTerms: ''// 节气
  }
}

function cDay (d) {
  var s
  switch (d) {
    case 10:
      s = '初十'
      break
    case 20:
      s = '二十'
      break
    case 30:
      s = '三十'
      break
    default:
      s = nStr2[Math.floor(d / 10)]
      // s += nStr1[d % 10];
      s += nStr1[parseInt(d % 10)]
      break
  }
  return (s)
}

function getLunarDay (date) {
  date = new Date(date + ' 00:00:00')
  let calendar = dianaday(date)
  let result = cDay(calendar.lDay)
  let isFestival = false
  let eve = 0
  let lX = calendar.isLeap ? leapDays(calendar.lYear) : monthDays(calendar.lYear, calendar.lMonth)
  if (calendar.lMonth === 12) { eve = lX }
  for (var ipp = 0; ipp < sFtv.length; ipp++) { // 公历节日
    if (parseInt(sFtv[ipp].substr(0, 2)) === parseInt(calendar.sMonth)) {
      if (parseInt(sFtv[ipp].substr(2, 4)) === parseInt(calendar.sDay)) {
        result = sFtv[ipp].substr(5)
        isFestival = true
      }
    }
  }
  for (var ippl = 0; ippl < lFtv.length; ippl++) { // 农历节日
    if (parseInt(lFtv[ippl].substr(0, 2)) === parseInt(calendar.lMonth)) {
      if (parseInt(lFtv[ippl].substr(2, 4)) === parseInt(calendar.lDay)) {
        result = lFtv[ippl].substr(5)
        isFestival = true
      }
    }
    if (calendar.lMonth === 12) { // 判断是否为除夕
      if (calendar.lDay === eve) { result = '除夕'; isFestival = true }
    }
  }
  return { result, isFestival }
}

export default getLunarDay
