/**
 * 获取window的可视尺寸
 * @return {{width: (Number|number), height: (Number|number)}}
 */
function getWindowSize () {
  let width = window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth

  let height = window.innerHeight
    || document.documentElement.clientHeight
    || document.body.clientHeight
  return {
    width,
    height
  }
}

/**
 * 移动端rem单位适配
 * @param width 设计图宽度
 * @param size  字体大小，默认100
 * @param max   最大比率
 */
function setFlexible (width=750, size=100, max) {  //100/750
  let docBody = document.body || document.documentElement
  let ratio = size / width  //100/750=.013333
  let w = getWindowSize().width
  let newRatio = w * ratio  //375*.1333
  if (max && newRatio > max) {
    newRatio = max
  }
	
	var css = document.createElement('style');
	css.type='text/css';
	css.innerHTML='html,body{font-size:' + newRatio + 'px;}';
	document.getElementsByTagName('head')[0].appendChild(css); 
	
  docBody.style.fontSize = newRatio + 'px';
}

/**
 * 设置viewport的自适应
 * @param scaleWidth
 */
function setViewport (scaleWidth) {
  let clientWidth = getWindowSize().width
  let scale = clientWidth / scaleWidth
  let viewport = document.querySelector('meta[name=viewport]')
  viewport.setAttribute('content', 'width=' + scaleWidth + ',initial-scale=' + scale + ',user-scalable=no')
}

/**
 * 获取对象类型
 * @param obj
 * @return {*}
 */
function getObjType (obj) { 
  let toString = Object.prototype.toString

  const class2type = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Object]': 'object'
  }

  return obj === null ? String(obj) : class2type[toString.call(obj)] || 'object'
}

/**
 * 是否window对象
 * @param obj
 * @return {boolean}
 */
function isWindow (obj) {
  return obj && typeof obj === 'object' && 'setInterval' in obj
}

/**
 * 是否数组
 * @param obj
 * @return {boolean}
 */
function isArray (obj) {
  if (Array.isArray) {
    return Array.isArray(obj)
  } else {
    return getObjType(obj) === 'array'
  }
}

/**
 * 扩展对象 作用和用法和jQuery.extend一样
 */
const extend = (function () {
  let copyIsArray
  let hasOwn = Object.prototype.hasOwnProperty

  const isPlainObject = function (obj) {
    if (!obj || getObjType(obj) !== 'object' || obj.nodeType || isWindow(obj)) {
      return false
    }

    if (obj.constructor && !hasOwn.call(obj, 'constructor')
      && !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
      return false
    }

    let key
    for (key in obj) {
    }

    return key === undefined || hasOwn.call(obj, key)
  }

  const extendFactory = function (target, options, deep) {
    for (let name in options) {
      let src = target[name]
      let copy = options[name]

      if (target === copy) {
        continue
      }

      if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
        let clone
        if (copyIsArray) {
          copyIsArray = false
          clone = src && isArray(src) ? src : []

        } else {
          clone = src && isPlainObject(src) ? src : {}
        }

        target[name] = extend(clone, copy, deep)
      } else if (copy !== undefined) {
        target[name] = copy
      }
    }
    return target
  }

  const extend = function () {
    let lastParam = arguments[arguments.length - 1]
    let lastParamIsDeep = typeof lastParam === 'boolean'
    let deep = lastParamIsDeep ? lastParam : false
    let max = arguments.length - (lastParamIsDeep ? 2 : 1)
    let target
    for (let i = max; i >= 0; i--) {
      if (i > 0) {
        target = extendFactory(arguments[i - 1], arguments[i], deep)
      } else {
        target = arguments[i]
      }
    }

    return target
  }

  return extend
})()

/**
 * [dateFormat 时间转字符串]
 * @param  {Date} date   [时间，时间戳]
 * @param  {String} format [格式字符串，如'yyyy-MM-dd hh:mm:ss']
 * @return {String}        [目标字符串]
 */
function dateFormat (date, format) {
  let args = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3), //quarter
    'S': date.getMilliseconds()
  }
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let i in args) {
    let n = args[i]
    if (new RegExp('(' + i + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? n : ('00' + n).substr(('' + n).length))
    }
  }
  return format
}

/**
 * [stringToDate 年月日格式字符串转时间]
 * @param  {String} dateStr  [年月日字符串]
 * @param  {String} symbol  [年月日分隔符]
 * @return {Date}         [时间]
 */
function stringToDate (dateStr, symbol) {
  let arr = dateStr.split(symbol)
  return new Date(arr[0], arr[1] - 1, arr[2])
}

/**
 * [stringToDateTime 年月日格式字符串转时间戳]
 * @param  {String} dateStr  [年月日字符串]
 * @param  {String} symbol  [年月日分隔符]
 * @return {Number}         [时间戳]
 */
function stringToDateTime (dateStr, symbol) {
  let arr = dateStr.split(symbol)
  return new Date(arr[0], arr[1] - 1, arr[2]).getTime()
}

/**
 * cookie 含set、get、del方法
 */
const cookie = (function () {
  /**
   * 获取秒数
   * @param str 时间代号 s = 秒，s20 = 20秒; h = 小时，h12 = 12小时; d = 天，d30 = 30天
   * @return {number} 秒数
   */
  function getsec (str) {
    let str1 = str.substring(1, str.length) * 1
    let str2 = str.substring(0, 1)
    if (str2 === 's') {
      return str1 * 1000
    }
    else if (str2 === 'h') {
      return str1 * 60 * 60 * 1000
    }
    else if (str2 === 'd') {
      return str1 * 24 * 60 * 60 * 1000
    }
  }

  /**
   * 设置cookie
   * @param name 键名
   * @param value 值
   * @param time 过期时间 s = 秒，s20 = 20秒; h = 小时，h12 = 12小时; d = 天，d30 = 30天
   */
  function set (name, value, time) {
    let strsec = getsec(time)
    let exp = new Date()
    exp.setTime(exp.getTime() + strsec * 1)
    document.cookie = name + '=' + encodeURIComponent(value) + ';expires=' + exp.toGMTString()
  }

  /**
   * 获取cookie
   * @param name 键名
   * @return {*}
   */
  function get (name) {
    let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    let arr = document.cookie.match(reg)
    if (arr) {
      return decodeURIComponent(arr[2])
    }
    else {
      return null
    }
  }

  /**
   * 删除cookie
   * @param name 键名
   */
  function del (name) {
    let exp = new Date()
    exp.setTime(exp.getTime() - 1)
    let cval = get(name)
    if (cval !== null) {
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
    }
  }

  return {
    set,
    get,
    del
  }
})()

/**
 * 获取cookie高级版 会尝试转为JSON对象
 * @param name 键名
 * @return {JSON|String}
 */
function getCookieEx (name) {
  let str = cookie.get(name)
  try {
    return JSON.parse(str)
  } catch (err) {
    return str
  }
}

/**
 * 生成指定范围的随机整数
 * @param under 最小值
 * @param over 最大值
 * @returns {*}
 */
function getRandom (under, over) {
  switch (arguments.length) {
    case 1:
      return parseInt(Math.random() * under + 1)
    case 2:
      return parseInt(Math.random() * (over - under + 1) + under)
    default:
      return 0
  }
}

/**
 * 获取背景图片自适应全覆盖样式
 * @param url 图片地址
 * @param conW 容器宽度
 * @param conH 容器高度
 * @param imgW 图片宽度
 * @param imgH 图片高度
 * @returns {{backgroundImage: string, backgroundSize: string}}
 */
function getAutoImageStyle (url, conW, conH, imgW, imgH) {
  let conR = conW / conH
  let imgR = imgW / imgH
  let style = {
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundImage: 'url(' + url + ')',
    backgroundSize: ''
  }

  if (conR > imgR) {
    style.backgroundSize = '100% auto'
  } else {
    style.backgroundSize = 'auto 100%'
  }

  return style
}

/**
 * 获取url的参数值
 * @param key
 * @return {*}
 */
function getUrlParam (key) {
  let reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)')
  let r = location.search.substr(1).match(reg)
  if (r) {
    return decodeURI(r[2])
  }
  return ''
}

/*
 * ====================================
 * 定时器 timeout
 * ====================================
 */
let timeout = {
  ids: [],
  /**
   * 定时器
   * @param callback 定时回调
   * @param delay 定时时长 单位：ms 默认：300ms
   */
  create (callback, delay) {
    if (!(delay >= 0)) delay = 300
    let id = setTimeout(() => {
      callback()
      this.remove(id, false)
    }, delay)
    this.save(id)
    return id
  },
  /**
   * 储存一个定时器Id
   * @param id
   * @param [check] {boolean} 是否检查重复 默认不检查
   * @returns {number} 返回索引
   */
  save (id, check) {
    let ids = this.ids
    if (check) {
      for (let i = 0; i < ids; i++) {
        if (ids[i] === id) {
          return i
        }
      }
    }
    ids.push(id)
    return ids.length - 1
  },
  /**
   * 移除定时器
   * @param id 定时器id
   * @param [clear] 是否执行clearTimeout 默认执行
   */
  remove (id, clear) {
    if (typeof clear !== 'boolean') {
      clear = true
    }

    let ids = this.ids
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] === id) {
        console.log('Remove timeout id: ', id)
        if (clear) clearTimeout(id)
        ids.splice(i, 1)
        break
      }
    }
  },
  /**
   * 清除所有定时器
   */
  clear () {
    let ids = this.ids
    for (let i = 0; i < ids.length; i++) {
      clearTimeout(ids[i])
    }
    ids = []
  }
}

/*
 * ====================================
 * 定时器 interval
 * ====================================
 */
let interval = {
  ids: [],
  /**
   * 定时器
   * @param callback 定时回调
   * @param delay 定时时长 单位：ms 默认：300ms
   */
  create (callback, delay) {
    if (!(delay >= 0)) delay = 300
    let id = setInterval(() => {
      callback()
    }, delay)
    this.save(id)
    return id
  },
  /**
   * 储存一个定时器Id
   * @param id
   * @param [check] {boolean} 是否检查重复 默认不检查
   * @returns {number} 返回索引
   */
  save (id, check) {
    let ids = this.ids
    if (check) {
      for (let i = 0; i < ids; i++) {
        if (ids[i] === id) {
          return i
        }
      }
    }
    ids.push(id)
    return ids.length - 1
  },
  /**
   * 移除定时器
   * @param id 定时器id
   * @param [clear] 是否执行clearInterval 默认执行
   */
  remove (id, clear) {
    if (typeof clear !== 'boolean') {
      clear = true
    }

    let ids = this.ids
    for (let i = 0; i < ids.length; i++) {
      if (ids[i] === id) {
        console.log('Remove interval id: ', id)
        if (clear) clearInterval(id)
        ids.splice(i, 1)
        break
      }
    }
  },
  /**
   * 清除所有定时器
   */
  clear () {
    let ids = this.ids
    for (let i = 0; i < ids.length; i++) {
      clearInterval(ids[i])
    }
    ids = []
  }
}

export {
  getWindowSize,
  setFlexible,
  setViewport,
  extend,
  dateFormat,
  stringToDate,
  stringToDateTime,
  cookie,
  getCookieEx,
  getRandom,
  getAutoImageStyle,
  getUrlParam,
  timeout,
  interval
}
