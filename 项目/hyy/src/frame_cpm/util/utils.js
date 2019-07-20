import {
  checkMobile,
  checkEmail
} from './inputDataCheck';

export default class Utils {
  /**
   * 通过传入的children字段名，将多层级的对象打平为一个数组
   * @param {T} source
   * @param {string} children
   * @returns {T[]}
   * 例如  [{id: 1, children: [{id: 2}]}] => [{id: 1}, {id: 2}]
   */
  flatObject(source, children = 'children') {
    const re = []
    const clone = JSON.parse(JSON.stringify(source))
    this.flatObjectDo(clone, children, re)
    return re
  }

  /**
   * 数组转树
   * @param source
   * @param parentIdVal
   * @param id
   * @param parentId
   * @returns {*}
   */
  list2Tree(source, parentIdVal = undefined, id = 'id', parentId = 'parentId', max = 3, currentLevel = 1) {
    const target = source.filter((s) => s[parentId] === parentIdVal)
    target.forEach((t) => {
      if (currentLevel < max) {
        const children = this.list2Tree(source, t[id], id, parentId, max, currentLevel + 1)
        if (children.length) {
          t.children = children
        }
      }
    })
    return target
  }

  treeDataTranslate(data, id = 'id', pid = 'parentId') {
    var res = []
    var temp = {}
    for (var i = 0; i < data.length; i++) {
      temp[data[i][id]] = data[i]
    }
    for (var k = 0; k < data.length; k++) {
      if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
        if (!temp[data[k][pid]]['children']) {
          temp[data[k][pid]]['children'] = []
        }
        if (!temp[data[k][pid]]['_level']) {
          temp[data[k][pid]]['_level'] = 1
        }
        data[k]['_level'] = temp[data[k][pid]]._level + 1
        temp[data[k][pid]]['children'].push(data[k])
      } else {
        res.push(data[k])
      }
    }
    return res
  }

  treeToArray(nodes_tmp, children = 'children') {
    if (!nodes_tmp) {
      return [];
    }
    let nodes = JSON.parse(JSON.stringify(nodes_tmp));
    // console.log(nodes);
    let r = [];
    if (Array.isArray(nodes)) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].menuType == 5) {
          r.push(nodes[i]); // 取每项数据放入一个新数组
        }
        // if (Array.isArray(nodes[i][children]) && nodes[i][children].length > 0) {
        // 若存在children则递归调用，把数据拼接到新数组中，并且删除该children
        r = r.concat(this.treeToArray(nodes[i][children], children));
        delete nodes[i][children]
        // }
      }
    }
    return r;
  }

   getMenuTree(nodes_tmp, children = 'children') {
    if (!nodes_tmp) {
      return [];
    }
    let nodes = JSON.parse(JSON.stringify(nodes_tmp));
    // console.log(nodes);
    let r = [];
    if (Array.isArray(nodes)) {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].menuType == 4) {
          r.push(nodes[i]); // 取每项数据放入一个新数组
        }
        // if (Array.isArray(nodes[i][children]) && nodes[i][children].length > 0) {
        // 若存在children则递归调用，把数据拼接到新数组中，并且删除该children
        r = r.concat(this.getMenuTree(nodes[i][children], children));
        delete nodes[i][children]
        // }
      }
    }
    return r;
  }
  // 日期判断
  isDate(obj) {
    return Object.prototype.toString.call(obj) === '[object Date]'
  }
  isObj(obj) {
    return Object.prototype.toString.call(obj) === '[object Object]'
  }
  // 空对象判断
  isEmptyObject(obj) {
    return Object.keys(obj).length <= 0
  }
  //
  delEmptyProp(obj = {}) {
    for (const key of Object.keys(obj)) {
      if (this.isObj(obj[key])) {
        this.delEmptyProp(obj[key])
      }
      if (obj[key] === null || obj[key] === undefined || obj[key] === '' || (this.isObj(obj[key]) && this.isEmptyObject(obj[key]))) {
        delete obj[key]
      }
    }
    return obj
  }
  // 对象转为数组
  objToArr(obj = {}, labelField = 'label', valueField = 'value') {
    const arr = []
    for (const key of Object.keys(obj)) {
      arr.push({
        [labelField]: key,
        [valueField]: obj[key]
      })
    }
    return arr
  }

  // 反转对象的key-value
  reverse(source) {
    const re = {}
    for (const key of Object.keys(source)) {
      re[source[key]] = key
    }
    return re
  }

  flatObjectDo(source, children, re, parentId) {
    source.forEach((s) => {
      if (parentId) {
        s.parentId = parentId
      }
      re.push(s)
      if (s[children]) {
        this.flatObjectDo(s[children], children, re, s.id)
        delete s[children]
      }
    })
  }

  /**
   * 分组
   * @param array
   * @param f
   * @returns [[],[]]
   */
  groupBy(array, f) {
    let groups = {}
    array.forEach(function (o) {
      let group = JSON.stringify(f(o))
      groups[group] = groups[group] || []
      groups[group].push(o)
    })
    return Object.keys(groups).map(function (group) {
      return groups[group]
    })
  }
  deepCopy(obj) {
    // 只拷贝对象
    if (typeof obj !== 'object') return obj
    // 根据obj的类型判断是新建一个数组还是一个对象
    let newObj = obj instanceof Array ? [] : {}
    for (let key in obj) {
      // 遍历obj,并且判断是obj的属性才拷贝
      if (obj.hasOwnProperty(key)) {
        // 判断属性值的类型，如果是对象递归调用深拷贝
        newObj[key] = typeof obj[key] === 'object' ? this.deepCopy(obj[key]) : obj[key]
      }
    }
    return newObj
  }

  getUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
    })
  }

  // 可空手机号码校验
  emptyPhoneNumber(rule, value, callback) {
    if (!value) {
      return callback()
    } else {
      if (!/^1[0-9]{10}$/.test(value)) {
        callback(new Error(rule.message))
      } else {
        let str = value.toString();
        // console.log(str.substring(1, 2));
        if (str.substring(1, 2) === '0') {
          callback(new Error(rule.message))
        } else {
          return callback()
        }
      }
    }
  }
  // 可空邮箱校验
  emptyEmail(rule, value, callback) {
    if (!value) {
      return callback()
    } else {
      if (!checkEmail(value)) {
        callback(new Error(rule.message))
      } else {
        return callback()
      }
    }
  }

  //特殊字符检验
  smartChatFilter(rule, value, callback) {
    if (!value) {
      return callback()
    } else {
      if (!value.match("^[a-zA-Z0-9_\u4e00-\u9fa5]+$")) {
        callback(new Error(rule.message))
      } else {
        return callback()
      }
    }
  }
  to(promise) {
    return promise.then(data => {
        return [null, data];
      })
      .catch(err => [err]);
  }
  padLeftZero(str) {
    return ('00' + str).substr(str.length);
  }
  formatDate(timestamp, fmt = "yyyy-MM-dd hh:mm:ss") {
    let date = new Date(timestamp);
    try {
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
      };
      for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
          let str = o[k] + '';
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : this.padLeftZero(str));
        }
      }
      return fmt;
    } catch (e) {
      console.log(e);
      return '';
    }
  }
}
Utils.prototype.checkMobile = checkMobile;
Utils.prototype.checkEmail = checkEmail;

export const utils = new Utils()
