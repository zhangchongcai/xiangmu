import Vue from 'vue'

/**
 * 时间格式化
 */
export function formalDate(d) {
  let date = new Date(d)
  let dateValue =
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) +
    '-' +
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
  return dateValue
}

/**
 * 金额格式化
 */
export function formalMoney(value) {
  if (!value || value === 0) return '0'
  // 分到元
  value = parseInt(value) / 100
  // 转成字符串
  value += ''
  // 千分符的正则
  var reg =
    value.indexOf('.') > -1
      ? /(\d{1,3})(?=(?:\d{3})+\.)/g
      : /(\d{1,3})(?=(?:\d{3})+$)/g
  // 千分位格式化
  value = value.replace(reg, '$1,')
  return value
}
