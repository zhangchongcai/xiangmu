// import axios from './api';
import axios from '../../frame_cpm/http/api'

/**
 * 将所有接口统一起来便于维护
 * 如果项目很大可以将 URL 独立成文件，接口分成不同的模块
 */
/**接口处理示例 */
export const testGet = (params) => {
    //接口备注
    return axios({
        url: 'report/getApi',
        method: 'get',
        params
    });
};

export const testPost = data => {
    return axios({
        url: 'report/postApi',
        method: 'post',
        data
    })
}

export const login = data => {
    return axios({
        url: 'report/login',
        method: 'post',
        data
    })
}

export const listCalendarPlan = data => {
    return axios({
        url: 'report/listCalendarPlan',
        method: 'post',
        data
    })
}

export const query = params => {
    return axios({
        url: 'report/report/reportTableInfo',
        method: 'get',
        params
    })
}


/**  查询报表基础信息 */
export const reportTableInfo = (data, params) => {
    if (params) {
        return axios({
            url: `report/report/reportTableInfo/${data.reportCode}?styleUid=${params}`,
            method: 'post',
            data
        });
    } else {
        return axios({
            url: `report/report/reportTableInfo/${data.reportCode}`,
            method: 'post',
            data
        });
    }

}

/**  保存用户样式 */
export const saveUserStyle = data => {
    return axios({
        url: 'report/report/saveUserStyle',
        method: 'post',
        data
    });
}


// 删除模板样式
export const deleteUserStyle = query => {
    return axios({
        url: 'report/report/delUserStyle?styleUid=' + query,
        method: 'get'
    });
}
/**  展示表格数据 */
export const showReportData = data => {
    return axios({
        url: 'report/report/showReportData',
        method: 'post',
        data
    });
}

// checkbox数据
export const getCheckBoxData = (data, params) => {
    return axios({
        url: `report/${params}`,
        method: 'post',
        data
    });
}

// cinemaTree数据
export const getCinemaByParam = () => {
    return axios({
        url: 'report/condition/getCinemaByParam',
        method: 'get'
    });
}

//表格筛选查询数据
export const getTableSearchData = (tableName, colKey, reportCode) => {
    return axios({
        url: 'report/tableQuery/getColSelectValue',
        method: 'get',
        params: {
            tableName: tableName,
            colKey: colKey,
            reportCode: reportCode
        }
    })
}

//表格筛选模糊查询
export const getFuzzySearchData = (tableName, colKey, reportCode, value) => {
    return axios({
        url: 'report/tableQuery/getColSelectValue',
        method: 'get',
        params: {
            tableName: tableName,
            colKey: colKey,
            reportCode: reportCode,
            value: value
        }
    })
}

//影片数据
export const getFilmData = (pageNum, pageSize, filmName, filmCode) => {
    return axios({
        url: '/report/condition/getFilmCode',
        method: 'get',
        params: {
            pageNum: pageNum,
            pageSize: pageSize,
            filmName: filmName,
            filmCode: filmCode
        }
    })
}

//收银员/授权人接口
export const getUser = (pageNum, pageSize, fullName) => {
    return axios({
        url: '/report/condition/getUser',
        method: 'get',
        params: {
            pageNum: pageNum,
            pageSize: pageSize,
            fullName: fullName
        }
    })
}

// cinemaTree数据
export const getUserMenuTree = () => {
    return axios({
        url: '/ticket/systemParam/getUserMenuTree',
        method: 'get'
    });
}

// 会员等级
export const selectCardProductList = (cardName) => {
    return axios({
        url: 'report/condition/selectCardProductList',
        method: 'get',
        params: {
            cardName: cardName
        }
    });
}

//控件-发行版本获取数据
export const movieReleasedVersion = () => {
    return axios({
        url: 'report/condition/getDictInfo',
        method: 'get',
        params: {
            code: "movie_film_film_edition"
        }
    })
}

//控件-影片类型获取数据
export const movieType = () => {
    return axios({
        url: 'report/condition/getDictInfo',
        method: 'get',
        params: {
            code: "movie_film_film_type"
        }
    })
}

// 交易单类型
export const getDictionaryData = params => {
    return axios({
        url: '/ticket/dictionary/getByName',
        method: 'get',
        params
    })
}

//多选影院
export const systemGetUserMenuTree = params => {
    return axios({
        url: '/ticket/systemParam/getUserMenuTree',
        method: 'get',
        params
    })
}

//支付方式
export const selectForTenant = data => {
    return axios({
        url: '/payType/selectForTenant',
        method: 'post',
        data
    })
}

//交易渠道、代理商
export const getDitch = data => {
    return axios({
        url: `/ticket/base/channel/agent`,
        method: 'post',
        data
    });
}

// 交易类型
export const getMoudelData = (page, pageSize, name) => {
    return axios({
        url: `/ticket//dictionary/page?page=${page}&pageSize=${pageSize}&name=${name}`,
        method: 'post',
    });
}

// 商品类别
export const setmealLoadCategoies = data => {
    return axios({
        url: '/setmeal/loadCategoies',
        method: 'post',
        data
    })
}

//商品数据
export const goodsDataQueryGoodsList = data => {
    return axios({
        url: '/cim/goodsData/queryGoodsList',
        method: 'post',
        data
    })
}

// 仓库数据
export const checkBillStorehouse = data => {
    return axios({
        url: 'cim/checkBill/storehouse',
        method: 'post',
        data
    })
}

//货架数据
export const checkBillStorageRack = data => {
    return axios({
        url: 'cim/checkBill/storageRack',
        method: 'post',
        data
    })
}

export default {
    testGet,
    testPost,
    login,
    listCalendarPlan,
    /* 导出excle */
    query,
    //上面都是没用的接口，但是不知道哪里有调用到

    //下面都是有用的接口
    reportTableInfo,
    saveUserStyle,
    showReportData,
    getCheckBoxData,
    getCinemaByParam,
    getTableSearchData,
    getFuzzySearchData,
    deleteUserStyle,
    getFilmData,
    getUser,
    getUserMenuTree,
    selectCardProductList,
    movieReleasedVersion,
    movieType,
    getDictionaryData,
    getDictionaryData,
    systemGetUserMenuTree,
    selectForTenant,
    getDitch,
    getMoudelData,
    setmealLoadCategoies,
    goodsDataQueryGoodsList,
    checkBillStorehouse,
    checkBillStorageRack
};