import { axios } from 'base';
import qs from 'qs';

/**
 * 将所有接口统一起来便于维护
 * 如果项目很大可以将 URL 独立成文件，接口分成不同的模块
 */
/** 接口处理示例 */
export const testGet = params => {
  // 接口备注
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
  });
};

export const login = data => {
  return axios({
    url: 'report/login',
    method: 'post',
    data
  });
};

export const listCalendarPlan = data => {
  return axios({
    url: 'report/listCalendarPlan',
    method: 'post',
    data
  });
};

export const query = params => {
  return axios({
    url: 'report/report/reportTableInfo',
    method: 'get',
    params
  });
};

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
};

/**  保存用户样式 */
export const saveUserStyle = data => {
  return axios({
    url: 'report/report/saveUserStyle',
    method: 'post',
    data
  });
};

// 删除模板样式
export const deleteUserStyle = query => {
  return axios({
    url: 'report/report/delUserStyle?styleUid=' + query,
    method: 'get'
  });
};
/**  展示表格数据 */
export const showReportData = data => {
  return axios({
    url: 'report/report/showReportData',
    method: 'post',
    data
  });
};

// checkbox数据
export const getCheckBoxData = (data, params) => {
  return axios({
    url: `report/${params}`,
    method: 'post',
    data
  });
};

// cinemaTree数据
export const getCinemaByParam = () => {
  return axios({
    url: 'report/condition/getCinemaByParam',
    method: 'get'
  });
};

// 表格筛选查询数据
export const getTableSearchData = (tableName, colKey, reportCode, queryArr) => {
  return axios({
    url: 'report/tableQuery/getColSelectValue',
    method: 'post',
    data: {
      tableName: tableName,
      colKey: colKey,
      reportCode: reportCode,
      queryArr: queryArr
    }
  });
};

// 表格筛选模糊查询
export const getFuzzySearchData = (tableName, colKey, reportCode, value) => {
  return axios({
    url: 'report/tableQuery/getColSelectValue',
    method: 'post',
    data: {
      tableName: tableName,
      colKey: colKey,
      reportCode: reportCode,
      value: value
    }
  });
};

// 影片数据
export const getFilmData = (pageNum, pageSize, filmName, filmCode) => {
  return axios({
    url: '/report/condition/getFilmCode',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      filmName: filmName,
      code: filmCode
    }
  });
};

// 收银员/授权人接口
export const getUser = (pageNum, pageSize, fullName) => {
  return axios({
    url: '/report/condition/getUser',
    method: 'get',
    params: {
      pageNum: pageNum,
      pageSize: pageSize,
      fullName: fullName
    }
  });
};

// cinemaTree数据
export const getUserMenuTree = () => {
  return axios({
    url: '/ticket/systemParam/getUserMenuTree',
    method: 'get'
  });
};

// 会员等级
export const selectCardProductList = (pageNum, pageSize, cardName) => {
  return axios({
    url: 'report/condition/selectCardProductList',
    method: 'get',
    params: {
      current: pageNum,
      size: pageSize,
      cardName: cardName
    }
  });
};

// 控件-发行版本获取数据
export const movieReleasedVersion = () => {
  return axios({
    url: '/ticket/dictionary/getByName',
    method: 'get',
    params: {
      name: 'SCH_MOVIE_DIS_VERSION'
    }
  });
};

// 控件-影片类型获取数据
export const movieType = () => {
  return axios({
    url: 'report/condition/getDictInfo',
    method: 'get',
    params: {
      code: 'movie_film_film_type'
    }
  });
};

// 交易单类型
export const getDictionaryData = params => {
  return axios({
    url: '/ticket/dictionary/getByName',
    method: 'get',
    params
  });
};

// 多选影院
export const getCinemaTree = (cinemaName, cinemaCode) => {
  return axios({
    url: '/report/condition/getCinemaTree',
    method: 'get',
    params: {
      cinemaName: cinemaName,
      cinemaCode: cinemaCode
    }
  });
};

// 支付方式
export const getPayTypeData = (
  cinemaUids,
  payTypeName,
  currentPage,
  pageSize
) => {
  let url;
  switch (document.domain) {
    case '127.0.0.1':
      // url = 'http://apidevpos.oristarcloud.com/faPayTypeCinema/findPayTypeCinema'
      url =
        'http://apitestpos.oristarcloud.com/faPayTypeCinema/findPayTypeCinema';
      break;
    case 'dev.oristarcloud.com':
      url =
        'http://apidevpos.oristarcloud.com/faPayTypeCinema/findPayTypeCinema';
      break;
    case 'test.oristarcloud.com':
      url =
        'http://apitestpos.oristarcloud.com/faPayTypeCinema/findPayTypeCinema';
      break;
    case 'pre.oristarcloud.com':
      url =
        'http://apiprepos.oristarcloud.com/faPayTypeCinema/findPayTypeCinema';
      break;
    case 'www.oristarcloud.com':
      url = 'https://apipos.oristarcloud.com/faPayTypeCinema/findPayTypeCinema';
      break;
    default:
      url =
        'http://apidevpos.oristarcloud.com/faPayTypeCinema/findPayTypeCinema';
  }
  return axios({
    url: url,
    method: 'get',
    params: {
      cinemaUids: cinemaUids,
      current: currentPage,
      name: payTypeName,
      pageSize: pageSize
    },
    paramsSerializer: params => {
      return qs.stringify(params, {
        indices: false
      });
    }
  });
};

// 交易渠道、代理商
export const getDitch = data => {
  return axios({
    url: `/ticket/base/channel/agent`,
    method: 'post',
    data
  });
};

// 交易类型
export const getMoudelData = (page, pageSize, name) => {
  return axios({
    url: `/ticket//dictionary/page?page=${page}&pageSize=${pageSize}&name=${name}`,
    method: 'post'
  });
};

// 商品类别
export const getMerClassData = data => {
  return axios({
    url: '/cim/category/trees',
    method: 'post',
    data
  });
};

// 商品数据
export const goodsDataQueryGoodsList = data => {
  return axios({
    url: '/cim/goodsData/queryGoodsList',
    method: 'post',
    data
  });
};

// 仓库数据
export const checkBillStorehouse = data => {
  return axios({
    url: 'cim/checkBill/storehouse',
    method: 'post',
    data
  });
};

// 货架数据
export const checkBillStorageRack = data => {
  return axios({
    url: 'cim/checkBill/storageRack',
    method: 'post',
    data
  });
};

// 导出表格
export const exportExcel = data => {
  // config.responseType = 'blob';
  return axios({
    url: '/report/report/exportExcel',
    method: 'post',
    data
  });
};

// 取货状态
export const gitDicData = dicTag => {
  return axios({
    url: '/report/condition/getDicSelect',
    method: 'get',
    params: {
      dicTag: dicTag
    }
  });
};

// 套餐商品
export const gitComboGoodsData = data => {
  return axios({
    url: 'cim/goodsData/getMerInfo',
    method: 'post',
    data
  });
};

// 影厅
export const gitHallData = (page, pageSize, cinemaUid, name) => {
  return axios({
    url: 'ticket/cihall/find',
    method: 'post',
    params: {
      page: page,
      pageSize: pageSize,
      cinemaUid: cinemaUid,
      name: name
    }
  });
};

// 票类
export const gitTicketData = (
  currentPage,
  pageSize,
  cinemaUid,
  ticketTypeName
) => {
  return axios({
    url: '/ticket/tickettype/selectByPage',
    method: 'post',
    data: {
      current: currentPage,
      size: pageSize,
      cinemaUids: cinemaUid,
      ticketTypeName: ticketTypeName
    }
    // paramsSerializer: params => {
    //     return qs.stringify(params, {
    //         indices: false
    //     })
    // }
  });
};

// 活动选择
export const getActivityData = () => {
  return axios({
    url: '/report/condition/getMarketing',
    method: 'post'
  });
};

// 分组合并表格
export const showGroupMergeData = data => {
  return axios({
    // url: 'http://192.168.100.125:3201/report/showGroupMergeData',
    url: 'report/report/showGroupMergeData',
    method: 'post',
    data
  });
};

// 点击表格单元格获取详情表格数据
export const getSonTable = (sonRoute, data) => {
  return axios({
    url: `http://192.168.100.125:3201/report/getSonTable/${sonRoute}`,
    method: 'post',
    data
  });
};

// 3.0集团报表入口数据
export const getOldCinemaCenter = () => {
  return axios({
    url: `report/report/oldCinemaCenter`,
    method: 'get'
  });
};

// 3.0影院报表入口数据
export const getOldCinema = () => {
  return axios({
    url: `report/report/oldCinema`,
    method: 'get'
  });
};

export default {
  testGet,
  testPost,
  login,
  listCalendarPlan,
  /* 导出excle */
  query,
  // 上面都是没用的接口，但是不知道哪里有调用到

  // 下面都是有用的接口
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
  getCinemaTree,
  getPayTypeData,
  getDitch,
  getMoudelData,
  getMerClassData,
  goodsDataQueryGoodsList,
  checkBillStorehouse,
  checkBillStorageRack,
  exportExcel,
  gitDicData,
  gitComboGoodsData,
  gitHallData,
  gitTicketData,
  getActivityData,
  showGroupMergeData,
  getSonTable,
  getOldCinemaCenter,
  getOldCinema
};
