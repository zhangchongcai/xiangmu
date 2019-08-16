const state = {
    // 是否要缓存页面，默认不缓存
    cachePage: false,
    // 已经打开的页面
    openedPageList:sessionStorage.getItem('tagNavList')?JSON.parse(sessionStorage.getItem('tagNavList')):[],
    // 缓存的页面
    cachedPageName: [],
    closedItem: {},
    recentVisits:sessionStorage.getItem('recentVisits')?JSON.parse(sessionStorage.getItem('recentVisits')):[],

}
const mutations = {
    addRecentVisits(state, data) {
        if(data){
            if(state.recentVisits.some(page => page.menuCode == data.menuCode)){
                return
            }else{
                state.recentVisits.push(data)
                sessionStorage.setItem('recentVisits',JSON.stringify( state.recentVisits))
            }
        }
        if(state.recentVisits.length>20){
            state.recentVisits.splice(0,1)
        }
    },
    removeRecentVisits(state, data) {
        let index = state.recentVisits.findIndex(page => page.menuCode == data.menuCode)
        if(index >-1){
            state.recentVisits.splice(index, 1)
            sessionStorage.setItem('recentVisits',JSON.stringify( state.recentVisits))
        }
    },
    addTagNav(state, data){
        if (state.openedPageList.some(v => v.path === data.path)) {
            if (data.query) {
                state.openedPageList.find(v => v.path === data.path).query = data.query
            }
            return
        }
        if(state.cachedPageName.includes(data.name)){
            console.error(`${data.name} 组件出现命名重复，请检查组件中的name字段。当前组件所在的路由地址为：${data.path}`)
            return
        }
        state.openedPageList.push(data)
        sessionStorage.setItem('tagNavList',JSON.stringify(state.openedPageList))
        if(state.cachePage){
            state.cachedPageName.push(data.name)
        }
    },

    removeTagNav(state, data){
        if(data){
            state.closedItem = data
            for(let [i, v] of state.openedPageList.entries()){
                if(v.path === data.path){
                    state.openedPageList.splice(i, 1)
                    sessionStorage.setItem('tagNavList',JSON.stringify(state.openedPageList))
                }
            }
            if(state.cachePage){
                let index = state.cachedPageName.findIndex(page => page.name == data.name)
                if(index >= 0){
                    state.cachedPageName.splice(index, 1)
                }
            }
        } else{
            state.openedPageList = []
            state.cachedPageName = []
        }
    },
    resetClosedItem(state,data) {
        state.closedItem = data
    }
}


export default {
    namespaced: true,
    state,
    mutations
}
