import Vue from 'vue';
import utils from '../../../util/uiUtils';
let state = {
  // 菜单缓存
  menus: [],
  // perms: JSON.parse(sessionStorage.getItem('perms') ? sessionStorage.getItem('perms') : '[]') || [],
  perms: JSON.parse(sessionStorage.getItem('perms') ? sessionStorage.getItem('perms') : '[]') || [],
  cache: {},
  level: {
    level1:sessionStorage.getItem('level1') ? sessionStorage.getItem('level3') : '',
    level2:sessionStorage.getItem('level2') ? sessionStorage.getItem('level3') : '',
    level3:sessionStorage.getItem('level3') ? sessionStorage.getItem('level3') : '',
  },

};

let mutations = {
  updateMenus(state, data) {
    state.menus = data
    let perms = utils.treeToArray(data, 'submenu');
    // console.log(perms)
    sessionStorage.setItem('perms', JSON.stringify(perms));
    state.perms = perms;
  },
  setCache(state, data) {
    // console.log("setCache");
    // console.log(data);
    if (data && data.key && data.value) {
      state.cache[data.key] = data.value
    }
    var arr = Object.keys(state.cache);
    // console.log(arr); // ['name','sex','age']
    // console.log(arr.length);
    if (arr.length > 25) {
      // console.log("溢出了");
      let cutArr = arr.slice(10, arr.length)
      let cacheTmp = {}
      cutArr.forEach(item => {
        cacheTmp[item] = state.cache[item]
      })
      state.cache = cacheTmp;
      // console.log("截取后");
      // console.log(cutArr);
      // console.log(cacheTmp);
    }
  },
  //标记移除缓存
  removeTabCache(state, data) {
    // console.log(data);
    if (data && data.path) {
      let cache = state.cache;
      // console.log(state.cache);
      // console.log(data.path);
      let key = data.path;
      let obj = cache[key];
      // console.log(obj);
      if (obj) {
        // console.log("存在缓存");
        obj.tab_cache_clear = true;
        cache[key] = obj;
        state.cache = cache;
        // console.log(cache);
      } else {
        obj = {
          tab_cache_clear: true
        }
        cache[key] = obj;
        state.cache = cache;
      }
      //清除子组件缓存
      // console.log(cache);
      Object.keys(cache).forEach(item => {
        if (item.indexOf(key) == 0) {
          let obj = cache[item];
          obj.tab_cache_clear = true;
          cache[item] = obj;
        }
      })
      state.cache = cache;
    }
  },
  removeCache(state, data) {
    if (data && data.key) {
      // console.log("removeCache");
      // console.log(data);
      delete state.cache[data.key]
    }
  },
  removeAllCache(state, data){
    state.cache={};
  },
  getLevel(state,data) {
      if(localStorage.getItem('leftTreeList')){
        let level1Arr = JSON.parse(localStorage.getItem('level1Arr'))
        let level2Arr = JSON.parse(localStorage.getItem('level2Arr'))
        let level3Arr = JSON.parse(localStorage.getItem('level3Arr'))
        if(data){
          state.level.level3 = data.menuName
          sessionStorage.setItem('level3',data.menuName)
          let str = level3Arr.find(item=>item.menuCode==data.menuCode).parentId
          let str1 = level2Arr.find(it=>it.id==str)
          state.level.level2 = str1.name
          sessionStorage.setItem('level2',str1.name)
          let str2 = level1Arr.find(i=>i.id==str1.parentId)
          state.level.level1 = str2.name
          sessionStorage.setItem('level1',str2.name)
        }else{
          state.level.level3 = ''
          sessionStorage.setItem('level3','')
        }
      }
  }
};
export default {
  namespace: true,
  state,
  mutations
}
