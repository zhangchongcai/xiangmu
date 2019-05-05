import axios from './api';
/**
 * 将所有接口统一起来便于维护
 * 如果项目很大可以将 URL 独立成文件，接口分成不同的模块
 */
/**接口处理示例 */
export const testGet = (params) => {
    //接口备注
    return axios({
        url: '/cpm/getApi',
        method: 'get',
        params
    });
};

export const LoginApi = data => { //登录接口
    return axios({
        url: '/cpm/user/login',
        method: 'post',
        data
    });
};
export const LoginOutApi = data => { //登录接口
    return axios({
        url: '/cpm/user/logout',
        method: 'get',
        data
    });
};
export const menuList = params => {
    return axios({
        url: '/cpm/user/auth/getUserMenuTree',
        method: 'get',
        params
    })
}


export const getFirstMenu = () => {
    return axios({
        url: '/cpm/menu/listNavigationMenu/1',
        method: 'get'
    })
}
export const getUser = data => {
    return axios({
        url: '/cpm/user/listUserByCondition',
        method: 'post',
        data
    })
}

export const getRoleTree = param => {
    return axios({
        url: '/cpm/user/listAllRoles' + param,
        method: 'get'
    })
}
export const getDepartTree = () => {
    return axios({
        url: '/cpm/user/listAllOrg  ',
        method: 'get'
    })
}
export const getCinemTree = () => {
    return axios({
        url: '/cpm/user//listAllEmpCinema  ',
        method: 'get'
    })
}


export const getSecondMenu = params => {
    return axios({
        url: '/cpm/menu/secondMenu/'+params,
        method: 'get',
    })
}
export const testPost = data => {
    return axios({
        url: '/cpm/postApi',
        method: 'post',
        data
    })
}


//组织结构模块
export const organizationList = params => {
    return axios({
        url: '/cpm/organization/list',
        method: 'get',
        params
    })
}
export const addOrg  = data => {
    return axios({
        url: '/cpm/organization/save ',
        method: 'post',
        data
    })
}
export const editOrg  = data => {
    return axios({
        url: '/cpm/organization/update ',
        method: 'post',
        data
    })
}
export const deleteOrg  = params => {
    return axios({
        url: '/cpm/organization/remove/'+params.uid,
        method: 'get',

    })
}
export const listCinemaUnBind  = data => {
    return axios({
        url: '/cpm/organization/listCinemaUnBind ',
        method: 'post',
        data
    })
}
export const removeBindingCinema  = data => {
    return axios({
        url: '/cpm/organization/removeBindingCinema ',
        method: 'post',
        data
    })
}
export const cinemaBinding  = data => {
    return axios({
        url: '/cpm/organization/cinemaBinding ',
        method: 'post',
        data
    })
}
export const listOrganizationCinema  = data => {
    return axios({
        url: '/cpm/organization/listOrganizationCinema ',
        method: 'post',
        data
    })
}
//角色管理
export const roleList  = data => {
    return axios({
        url: '/cpm/role/listCustomerRoleByRequirements',
        method: 'post',
        data
    })
}

export const addRole  = data => {
    return axios({
        url: '/cpm/role/addRole',
        method: 'post',
        data
    })
}

export const editRole  = data => {
    return axios({
        url: '/cpm/role/modifyRole',
        method: 'post',
        data
    })
}
export const deleteRole  = params => {
    return axios({
        url: '/cpm/role/delRole'+ params.uid,
        method: 'get',
    })
}

export const roleMenuTree  = params => {
    return axios({
        url: '/cpm/role/getRoleMenuTreeModel/'+params,
        method: 'get',
    })
}

// *************用户管理******************
export const userList  = data => {
    return axios({
        url: '/cpm/user/listUserByCondition',
        method: 'post',
        data
    })
}

export const resetPassword  = params => {
    return axios({
        url: '/cpm/user/resetPassword/'+ params,
        method: 'get',
    })
}

export const orgList  = () => {
    return axios({
        url: '/cpm/user/listAllOrg',
        method: 'get',
    })
}

export const addUser  = data => {
    return axios({
        url: '/cpm/user/saveUser',
        method: 'post',
        data
    })
}

export const roleTree  = () => {
    return axios({
        url: '/cpm/user/listAllRoles',
        method: 'get',
    })
}

export const deptTree  = () => {
    return axios({
        url: '/cpm/user/listAllDataPurview',
        method: 'get',
    })
}

export const editUser  = data => {
    return axios({
        url: '/cpm/user/updateUser',
        method: 'post',
        data
    })
}

export const onlyUser  = params => {
    return axios({
        url: '/cpm/user/queryUserInfo/'+ params,
        method: 'get',
    })
}

export const modifyUserPassword  = data => {
    return axios({
        url: '/cpm/user/modifyUserPassword',
        method: 'post',
        data
    })
}

//***********日志************
export const oplogList  = data => {
    return axios({
        url: '/cpm/operationLog/listOperationLog ',
        method: 'post',
        data
    })
}

export const oplogDetail  = params => {
    return axios({
        url: '/cpm/operationLog/getOperationLogInfo/'+params,
        method: 'get',
    })
}

//**************数据字典***************
export const dictList  = data => {
    return axios({
        url: '/cpm/dict/listAllDictByCondition',
        method: 'post',
        data
    })
}

export const editDict  = data => {
    return axios({
        url: '/cpm/dict/saveDict',
        method: 'post',
        data
    })
}

export const dictDetail  = params => {
    return axios({
        url: '/cpm/dict/getDictInfo/'+params,
        method: 'get',
    })
}

export const listAuthCommCinemas = params => {
    return axios({
        url: '/cpm/user/auth/listAuthCommCinemas',
        method: 'get',
        params
    })
}

export default {
    // 组织结构 **/
    organizationList,
    listCinemaUnBind,
    removeBindingCinema,
    cinemaBinding,
    listOrganizationCinema,
    addOrg,
    editOrg,
    deleteOrg,
    //************ */
    //角色管理*/
    // roleList,
    addRole,
    //********* */
    testGet,
    testPost,
    LoginApi,
    LoginOutApi,
    getFirstMenu,
    getSecondMenu,
    getUser,
    getRoleTree,
    getDepartTree,
    getCinemTree,
    userList,
    resetPassword,
    orgList,
    addUser,
    roleTree,
    deptTree,
};
