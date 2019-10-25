import feDicts from './dict.js';
let utilDict = {};
/**
 * 设置数据字典缓存
 * @param dicts
 */
utilDict.setDicts = function (dicts) {
  localStorage.setItem('dicts', JSON.stringify(dicts));
};
/**
 * 获取数据字典
 * @param groupName
 * @returns {*|Array}
 */
utilDict.getDicts = function (groupName) {
  var dicts = localStorage.getItem('dicts');
  if (!dicts) {
    console.error('缓存的数据字典已失效');
  }
  dicts = JSON.parse(dicts);

  if (
    dicts.filter(item => item.code == groupName) &&
    dicts.filter(item => item.code == groupName)[0]
  ) {
    return dicts.filter(item => item.code == groupName)[0].dictItems;
  } else {
    return [];
  }
};
/**
 * 获取数据字典值
 * @param groupName
 * @param code
 * @returns {string}
 */
utilDict.getDictValue = function (groupName, code) {
  code = code + '';
  var dicts = utilDict.getDicts(groupName);
  var dict = dicts.filter(item => item.code === code);
  return dict.length ? dict[0].name : '';
};
/**
 * 获取数据字典
 * @param groupName
 * @returns {*|Array}
 */
utilDict.getStateDicts = function (groupName) {
  var dicts = feDicts;
  if (!dicts) {
    console.error('缓存的数据字典已失效');
  }

  if (
    dicts.filter(item => item.code == groupName) &&
    dicts.filter(item => item.code == groupName)[0]
  ) {
    return dicts.filter(item => item.code == groupName)[0].dictItems;
  } else {
    return [];
  }
};
utilDict.getDictStateValue = function (groupName, code) {
  code = code + '';
  var dicts = utilDict.getStateDicts(groupName);
  var dict = dicts.filter(item => item.code === code);
  return dict.length ? dict[0].name : '';
};

export default utilDict;
