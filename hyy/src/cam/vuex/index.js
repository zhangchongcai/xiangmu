import camApi from '../http/interface'

const cam = {
    namespaced: true,
    state: {
        categoryList:null,
    },
    getters:{
        categoryObj(state){
            let obj = {};
            state.categoryList.forEach(item=>{
                let id = item.value;
                let parentUid = item.parentUid;
                if(!obj.hasOwnProperty(id)){
                  obj[id] = parentUid;
                }
                if(item.children){
                  item.children.forEach(item=>{
                     if(!obj.hasOwnProperty(item.value)){
                        obj[item.value] = item.parentUid;
                    }
                  })
                }
            })
            return obj;
        }
    },
    mutations: {
        getCategory(state,res){
            state.categoryList = res;
        },  
    },
    actions:{
        getCagegory({commit}){
            camApi.categoryList().then(response =>{
                let res = response.data;
                let resData = [];
                if(res){
                    resData = res.map(item=>{
                        return {
                            value:item.uid,
                            label:item.categoryName,
                            parentUid:item.parentUid,
                            level:item.level,
                            children:item.childNodes.map(item=>{
                                return {
                                    value:item.uid,
                                    label:item.categoryName,
                                    parentUid:item.parentUid,
                                    level:item.level
                                    
                                }
                            })
                        }
                    });
                }
                commit('getCategory',resData)
            })
        }
    }
}
export default {
    cam
}

