import axios from './api';
/**
 * 将所有接口统一起来便于维护
 * 如果项目很大可以将 URL 独立成文件，接口分成不同的模块
 */
/**接口处理示例 */
export const provinceData = () => {
    return axios({
        url: '/cpm/area/getParentArea',
        method: 'get',
    });
};

export const areaData = params => {
    return axios({
        url: '/cpm/area/listAreasByParentCode',
        method: 'get',
        params
    });
};
export const testGet = (params) => {
    //接口备注
    return axios({
        url: '/cpm/getApi',
        method: 'get',
        params
    });
};

export const sendCode = data => {
  //接口备注
  return axios({
    url: '/cpm/user/sendSmsVerifyCodeWithSlider',
    method: 'post',
    data
  });
};
export const mobileLogin = params => { //登录接口
  return axios({
    url: '/cpm/user/loginByMobileVerifyCode',
    method: 'post',
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
export const LoginOutApi = data => {
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

export const getUrl = params => {
    return axios({
        url: '/cpm/user/auth/getHomePageUrl',
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

export const commonFunctions  = params => {
    return axios({
        url: '/cpm/commonfunctions/listAllCommonfunctions',
        method: 'get',
        params
    })
}

export const functionSort  = data => {
    return axios({
        url: '/cpm/commonfunctions/sort',
        method: 'post',
        data
    })
}

export const addFunction  = data => {
    return axios({
        url: '/cpm/commonfunctions/addCommonfunctions',
        method: 'post',
        data
    })
}

export const removeCommonFunctions  = params => {
    return axios({
        url: '/cpm/commonfunctions/deleteById',
        method: 'get',
        params
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
        url: '/cpm/role/delRole/'+ params.uid,
        method: 'get',
    })
}

export const useRole  = params => {
    return axios({
        url: '/cpm/role/updateRoleStatus',
        method: 'post',
        params
    })
}
export const roleMenuTree  = params => {
    return axios({
        url: '/cpm/role/getRoleMenuTreeModel/'+params,
        method: 'get',
    })
}
export const roleListTree  = ()=> {
    return axios({
        url: '/cpm/user/auth/getRoleEditMenuTree',
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

export const attributeType  = () => {
    return axios({
        url: '/cpm/user/getAttributeTypes',
        method: 'get',
    })
}

export const orgList  = params => {
    return axios({
        url: '/cpm/user/listAllOrg',
        method: 'get',
        params
    })
}

export const addUser  = data => {
    return axios({
        url: '/cpm/user/saveUser',
        method: 'post',
        data
    })
}

export const roleTree  = data => {
    return axios({
        url: '/cpm/user/listAllRoles',
        method: 'post',
        data
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
        url: '/cpm/operationLog/listOperationLog',
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
export const opNames = params => {
    return axios({
        url: '/cpm/operationLog/getAllOpName',
        method: 'get',
        params
    })
}

//**************数据字典***************
export const queryDictList  = params => {
    return axios({
        url: '/cpm/dict/queryDictList',
        method: 'get',
        params
    })
}

export const saveDict  = data => {
    return axios({
        url: '/cpm/dict/saveDict',
        method: 'post',
        data
    })
}
export const queryDictPropertyList  = params => {
    return axios({
        url: '/cpm/dict/queryDictPropertyList/',
        method: 'get',
        params
    })
}

export const  updateDictProperty  = params => {
    return axios({
        url: '/cpm/dict/updateDictProperty',
        method: 'post',
        params
    })
}
export const  updateDictPropertyStatus  = params => {
    return axios({
        url: '/cpm/dict/updateDictPropertyStatus',
        method: 'post',
        params
    })
}
// 更新字典类型信息
export const updateDict = params => {
    return axios({
        url: '/cpm/dict/updateDict',
        method: 'post',
        params
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
export const  authQueryUserCinemas = params => {
    return axios({
        url: '/cpm/user/auth/queryUserCinemas',
        method: 'get',
        params
    })
}


//**************客户管理***************
export const cusList  = data => {
    return axios({
        url: '/cpm/buyer/listBuyerCondition',
        method: 'post',
        data
    })
}

export const typeList = () => {
    return axios({
        url: '/cpm/buyer/listBuyerType',
        method: 'get',
    })
}

export const addCus = data => {
    return axios({
        url: '/cpm/buyer/addBuyer',
        method: 'post',
        data
    })
}

export const editCus = data => {
    return axios({
        url: '/cpm/buyer/modifyBuyer',
        method: 'post',
        data
    })
}

export const cusDetail  = params => {
    return axios({
        url: '/cpm/buyer/getBuyerInfo/'+params,
        method: 'get',
    })
}

export const changeStatu = data => {
    return axios({
        url: '/cpm/buyer/modifyStatus',
        method: 'post',
        data
    })
}

export const checkFullName = params => {
    return axios({
        url: '/cpm/buyer/ifExitBuyerFullName',
        method: 'get',
        params
    })
}

export const checkName = params => {
    return axios({
        url: '/cpm/buyer/ifExitBuyerName',
        method: 'get',
        params
    })
}
export const checkSocial = params => {
    return axios({
        url: '/cpm/buyer/ifExitSocialCreditCode',
        method: 'get',
        params
    })
}
export const checkCode = params => {
    return axios({
        url: '/cpm/buyer/ifExitBuyerCode',
        method: 'get',
        params
    })
}

// 获取短信模板

export const  querySmsTemplate = params => {
    return axios({
        url: '/cpm/sms/querySmsTemplate',
        method: 'get',
        params
    })
}
// 获取短信场景
export const  querySmsScene = params => {
    return axios({
        url: '/cpm/sms/querySmsScene',
        method: 'get',
        params
    })
}
// 获取短信场景

export const  sendSingleMsg = params => {
    return axios({
        url: '/cpm/sms/sendSingleMsg',
        method: 'get',
        params
    })
}
export const resendSmsMsg = params => {
    return axios({
        url: '/cpm/sms/resendSmsMsg',
        method: 'post',
        params
    })
}
//
export const createSmsTemplate  = data => {
    return axios({
        url: '/cpm/sms/createSmsTemplate',
        method: 'post',
        data
    })
}
// 短信记录 querySmsRecord
export const  querySmsRecord = params => {
    return axios({
        url: '/cpm/sms/querySmsRecord',
        method: 'get',
        params
    })
}
export const sendSameContentBatchMsg  = params => {
    // 短信批量发送
    return axios({
      url: '/cpm/sms/sendSameContentBatchMsg',
      method: 'post',
      params
    });
  };
export const  reSendSameContentBatchMsg = params => {
    // 短信批量发送
    return axios({
      url: '/cpm/sms/reSendSameContentBatchMsg',
      method: 'post',
      params
    });
  };
export const  querySmsRecordBatch  = params => {
    return axios({
        url: '/cpm/sms/querySmsRecordBatch',
        method: 'get',
        params
    })
}
export const cpmFilmList  = params => {
    return axios({
        url: '/cpm/film/list',
        method: 'get',
        params
    })
}
export const cpmFilmCodeList  = params => {
    return axios({
        url: '/cpm/filmCode/list',
        method: 'get',
        params
    })
}
// 获取单个专资影片
export const cpmFilmCodeget  = params => {
    return axios({
        url: '/cpm/filmCode/get',
        method: 'get',
        params
    })
}
export const getByCode  = params => {
    return axios({
        url: '/cpm/filmCode/getByCode',
        method: 'get',
        params
    })
}
// 获取单个基础影片
export const cpmFilmget  = params => {
    return axios({
        url: '/cpm/film/get',
        method: 'get',
        params
    })
}
export const updateSmsTemplate  = data => {
    return axios({
        url: '/cpm/sms/updateSmsTemplate',
        method: 'post',
        data
    })
}
export const updateSmsTemplateStatus  = data => {
    return axios({
        url: '/cpm/sms/updateSmsTemplateStatus',
        method: 'post',
        data
    })
}
export const deletSmsTemplate = params => {
    return axios({
        url: '/cpm/sms/deletSmsTemplate',
        method: 'post',
        params
    })
}


//********节假日***********

export const holList  = params => {
    return axios({
        url: '/cpm/holiday/list',
        method: 'get',
        params
    })
}
export const newHol  = data => {
    return axios({
        url: '/cpm/holiday/add',
        method: 'post',
        data
    })
}

export const editHol  = data => {
    return axios({
        url: '/cpm/holiday/edit',
        method: 'post',
        data
    })
}

export const changeHolStatus  = data => {
    return axios({
        url: '/cpm/holiday/updateStatus',
        method: 'post',
        data
    })
}

export const getDictList  = params => {
    return axios({
        url: '/cpm/user/getDictList',
        method: 'get',
        params
    })
}

export const detailHol  = params => {
    return axios({
        url: '/cpm/holiday/get',
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
    authQueryUserCinemas,
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
    getDictList,
    getByCode
};
