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
        // updateLoginToken(state, newToken){ //更新token信息
        //     state.loginToken = newToken ; 
        // },
        // updateLoginUser(state, newUserInfor){  //更新登录用户信息
        //     state.loginUser = newUserInfor ; 
        // },
        getCategory(state,res){
            state.categoryList = res;
            console.log(res,'品类arrays')
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
                // console.log(resData,'品类')
                commit('getCategory',resData)
            })
        }
    }
}
export default {
    cam
}

