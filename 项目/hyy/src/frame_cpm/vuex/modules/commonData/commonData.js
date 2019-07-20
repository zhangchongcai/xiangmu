import Vue from 'vue';
import utils from '../../../util/uiUtils';
let state = {
  // 菜单缓存
  menus: [],
  // perms: JSON.parse(sessionStorage.getItem('perms') ? sessionStorage.getItem('perms') : '[]') || [],
  perms: JSON.parse(sessionStorage.getItem('perms') ? sessionStorage.getItem('perms') : '[]') || [],
  cache: {},
  level: {
    // level1: '',
    // level2:'',
    // level3:''
    level1: localStorage.getItem('level1')?localStorage.getItem('level1'):'',
    level2:localStorage.getItem('level2')?localStorage.getItem('level2'):'',
    level3:localStorage.getItem('level3')?localStorage.getItem('level3'):''
  }
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
  getLevel(state,data) {
      if(localStorage.getItem('leftTreeList')){
        let level1Arr = JSON.parse(localStorage.getItem('leftTreeList')).map(item=>{
          return {'name':item.menuName,'id':item.id}
        })
        let arr = JSON.parse(localStorage.getItem('leftTreeList')).map(item=>{
          return item.submenu.map(item=>{
            return {'name':item.menuName,'id':item.id,'parentId':item.parentId}
          })
        })
        let level2Arr = []
        for (var i = 0; i < arr.length; i++) {
          for (var j = 0; j < arr[i].length; j++) {
            level2Arr.push(arr[i][j]);
          }
        }
        let level3Arr = utils.getMenuTree(JSON.parse(localStorage.getItem('leftTreeList')), 'submenu');
        if(data){
          level3Arr.forEach(item=>{
            if(item.menuCode==data.menuCode){
              state.level.level3 = data.menuName
              localStorage.setItem('level3',data.menuName)
              let str = item.parentId
              level2Arr.forEach(it=>{
                if(it.id == str){
                  state.level.level2 = it.name
                  localStorage.setItem('level2',it.name)
                  let str1 = it.parentId
                  level1Arr.forEach(i=>{
                    if(i.id == str1){
                      state.level.level1 = i.name
                      localStorage.setItem('level1',i.name)
                    }
                  })
                }
              })
            }
          })
        }
      }
  }
};
export default {
  namespace: true,
  state,
  mutations
}
