// import axios from 'frame_cpm/http/api';
import axios from './api'
/**
 * 将所有接口统一起来便于维护
 * 如果项目很大可以将 URL 独立成文件，接口分成不同的模块
 */
/**
 * 清机结算
 */
// 班次收银管理列表
export const clearaccountList = (data, current, size) => {
  return axios({
    url: `/workTime/findByPage?current=${current}&size=${size}`,
    method: 'post',
    data
  })
}
// 获取收银员（管理列表）
export const getWorker = (params) => {
  return axios({
    url: '/workTime/findWorkTimeUsersByPage/workers',
    method: 'get',
    params
  })
}
// 获取制单人（管理列表）
export const getCreater = (params) => {
  return axios({
    url: '/workTime/findWorkTimeUsersByPage/creators',
    method: 'get',
    params
  })
}
// 获取收银员（上班登记）
export const getCashier = (params) => {
  return axios({
    url: '/workTime/findCashierByPage',
    method: 'get',
    params
  })
}
// 获取会员等级 （上班登记）
export const getVip = (params) => {
  return axios({
    url: '/workTime/findVipLevelByPage',
    method: 'get',
    params
  })
}
// 获取可领用的其他物品 （上班登记）
export const getOtherthing = (params) => {
  return axios({
    url: '/workTime/findCinemaOtherthingByPage',
    method: 'get',
    params
  })
}
// 新增数据 （上班登记）
export const increaseWorker = (data) => {
  return axios({
    url: '/workTime/save',
    method: 'post',
    data
  })
}
// 追加领用接口 
export const addIssue = (data) => {
  return axios({
    url: '/workTime/addIssue',
    method: 'post',
    data
  })
}
// 清机结算（第一步）
export const clearOne = (params) => {
  return axios({
    url: '/workTime/readWorkTimeForClearing',
    method: 'get',
    params
  })
}
// 清机结算（第二步）
export const clearTwo = (data) => {
  return axios({
    url: '/workTime/workTimeClearing',
    method: 'post',
    data
  })
}
// 清机结算（总的详情）
export const clearDetail = (params) => {
  return axios({
    url: '/workTime/readWorkTime',
    method: 'get',
    params
  })
}
// 清机结算（领取详情）
export const thingDetail = (params) => {
  return axios({
    url: '/workTime/selectIssueItems',
    method: 'get',
    params
  })
}
// 清机结算（实收金额）
export const actualCash = (params) => {
  return axios({
    url: '/workTime/selectWorkTimeCashList',
    method: 'get',
    params
  })
}
// 清机结算（支付信息明细）
export const payTotal = (data, current, size) => {
  return axios({
    url: `/workTime/selectSaleBillPayFlowList?current=${current}&size=${size}`,
    method: 'post',
    data
  })
}
// 清机结算（电影票销售）
export const filmSell = (data, current, size) => {
  return axios({
    url: `/workTime/selectMovieTicketList?current=${current}&size=${size}`,
    method: 'post',
    data
  })
}
// 清机结算（卖品销售）
export const goodsSell = (data, current, size) => {
  return axios({
    url: `/workTime/selectSaleMerFlowList?current=${current}&size=${size}`,
    method: 'post',
    data
  })
}
// 清机结算（会员卡销售）
export const vipSell = (data, current, size) => {
  return axios({
    url: `/workTime/selectSaleMemberFlowList?current=${current}&size=${size}`,
    method: 'post',
    data
  })
}
// 清机结算（票券销售）
export const ticketSell = (data, current, size) => {
  return axios({
    url: `/workTime/selectSaleTicketFlowList?current=${current}&size=${size}`,
    method: 'post',
    data
  })
}
// 清机结算（票券销售）
export const otherSell = (data, current, size) => {
  return axios({
    url: `/workTime/selectSaleOtherFlowList?current=${current}&size=${size}`,
    method: 'post',
    data
  })
}
// 清机结算（资金调整单列表）
export const adjustList = (data, current, size) => {
  return axios({
    url: `/fundChange/findByPage?current=${current}&size=${size}`,
    method: 'post',
    data
  })
}
// 清机结算（资金调整单 新增）
export const adjustAdd = (data) => {
  return axios({
    url: 'fundChange/save',
    method: 'post',
    data
  })
}
// 清机结算（资金调整单 获取资金科目）
export const getAdjustSubject = (data) => {
  return axios({
    url: 'fundChangeSubject/findByPage?current=1&size=100',
    method: 'post',
    data
  })
}
// 清机结算（清机结算完成）
export const clearFinish = (data) => {
  return axios({
    url: '/workTime/workTimeCleared',
    method: 'post',
    data
  })
}
export const tickettypeUpdate = data => {
  console.log(data)
  let datas = JSON.stringify(data)
  console.log(datas)
  return axios({
    url: '/tickettype/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    dataType: "json",
    data: datas
  })
}

/**
 * 订单查询
 */
// 订单列表页查询
export const orderList = (data, current, size) => {
  return axios({
    // baseURL:'http://192.168.100.118:2302',
    url: `/saleBillSearch/selectSaleBillByPage?current=${current}&size=${size}`,
    method: 'post',
    data
  })
}
// 支付方式
export const payType = (params) => {
  return axios({
    // baseURL:'http://192.168.100.118:2302',
    url: '/payType/findAllForBillQuery',
    method: 'get',
    params
  })
}
// 订单详情
export const payDetail = (params) => {
  return axios({
    url: '/saleBillSearch/readSaleBillInfo',
    method: 'get',
    params
  })
}

/**
 * 领用物品管理
 */
// 物品列表页查询
export const otherthingsList = (params, current, size) => {
  return axios({
    url: `/otherthing/findByPage?current=${current}&size=${size}`,
    method: 'get',
    params
  })
}
// 新增领用物品
export const addOtherthing = (data) => {
  return axios({
    url: '/otherthing/save',
    method: 'post',
    data
  })
}
// 删除物品
export const deleteOtherthing = (uid) => {
  return axios({
    url: `/otherthing/delete/${uid}`,
    method: 'delete',
  });
}
// 获取电影影院
export const getCinemaByParam = (params) => {
  console.log(document.domain)
  let domain = document.domain;
  let baseURL = "";
  switch (domain) {
    case '127.0.0.1':
      baseURL = 'http://apidev.oristarcloud.com'
      break;
    case "dev.oristarcloud.com":
      baseURL = 'http://apidev.oristarcloud.com'

      break;
    case "test.oristarcloud.com":
      baseURL = 'http://apitest.oristarcloud.com'
      break;
    default:
      baseURL = 'http://apidev.oristarcloud.com';
      break;
  }
  return axios({
    //🌲状结构
    // baseURL:'http://apidev.oristarcloud.com/report',
    // url: '/condition/getCinemaByParam',
    // 表格结构 （正确数据）
    // baseURL:'http://apidev.oristarcloud.com',
    baseURL:baseURL,
    url: '/cpm/user/auth/queryUserCinemas',
    method: 'get',
    params
  });
}
/*
 * 抽钞记录管理
 */
// 物品列表页查询
export const getMoneyList = (data, current, size) => {
  return axios({
    url: `/extractFund/findTimeExtractFundByPage?current=${current}&size=${size}`,
    method: 'post',
    data
  })
}
// 抽钞记录查询-抽钞人列表
export const getMoneyPerson = (params) => {
  return axios({
    url: '/extractFund/findExtractUsersByPage/extracters',
    method: 'get',
    params
  })
}
// 抽钞记录查询-收银员列表
export const getMoneyCashier = (params) => {
  return axios({
    url: `/extractFund/findExtractUsersByPage/workers`,
    method: 'get',
    params
  });
}

/*** 公共组件接口 start ***/
// 交易渠道/代理商
export const getDitch = (data) => {
  return axios({
    // baseURL:'http://192.168.100.23:2301',
    baseURL: 'http://apidev.oristarcloud.com',
    url: `/ticket/base/channel/agent`,
    method: 'post',
    data
  });
}
// 页面控件类型
export const getMoudelData = (page, pageSize, name) => {
  return axios({
    // baseURL:'http://192.168.100.23:2301',
    baseURL: 'http://apidev.oristarcloud.com',
    url: `/ticket//dictionary/page?page=${page}&pageSize=${pageSize}&name=${name}`,
    method: 'post',
  });
}
/*** 公共组件接口 end ***/

/*** 支付方式 start ***/
// 条件分页检索支付方式
export const findPayTypePage = (data) => {
  return axios({
    url: `/payType/findByPage`,
    method: 'post',
    data
  });
};

// 新建自定义支付方式
export const savePayType = (data) => {
  return axios({
    url: `/payType/save`,
    method: 'post',
    data
  });
};

// 删除自定义支付方式
export const deletePayType = (data) => {
  return axios({
    url: `/payType/delete/${data.uid}`,
    method: 'delete',
    data
  });
};

// 启用/停用支付状态
export const updatePayTypeStatus = (data) => {
  return axios({
    url: `/payType/updateStatus/${data.uid}?status=${data.status}`,
    method: 'get',
    data
  });
};

// 根据支付编码查询支付方式
export const findPayTypeByCode = (data) => {
  return axios({
    url: `/payType/findByCode/${data.code}`,
    method: 'get',
    data
  });
};

// 修改自定义支付方式
export const updatePayType = (data) => {
  return axios({
    url: `/payType/update/${data.uid}`,
    method: 'post',
    data
  });
};

// 获取有效的支付方式编码
export const getPayTypeCode = (data) => {
  return axios({
    url: `/payType/getPayTypeCode`,
    method: 'get',
    data
  });
};

// 通过影院ids获取支付方式
export const selectForTenant = data => {
  return axios({
    url: '/payType/selectForTenant',
    method: 'post',
    data
  })
}
/*** 支付方式 end ***/

/*** 渠道管理 start ***/
// 获取总部渠道列表
export const getChannelList = (data) => {
  return axios({
    url: `/base/channel/list?page=${data.page}&pageSize=${data.pageSize}`,
    method: 'post',
    data
  });
};
// 获取影院渠道列表
export const getCinemaChannelList = (params) => {
  return axios({
    url: `/cinema/base/channel/list`,
    method: 'get',
    params
  });
};

export const getChannelOtherList = (params) => {
  return axios({
    url: `/base/channel/other/list`,
    method: 'get',
    params
  });
};

export const addHeaderChannel = (data) => {
  return axios({
    url: `/base/channel/add`,
    method: 'post',
    data
  });
};

export const setChannelStatus = (params) => {
  return axios({
    url: `/base/channel/set/status`,
    method: 'post',
    params
  });
};

export const setChannelCinema = (data) => {
    return axios({
        url: `/base/channel/set/cinema`,
        method: 'post',
        data
    });
};

export const getChannelDetail = (params) => {
  return axios({
    url: `/cinema/channel/view`,
    method: 'get',
    params
  });
};
// 获取当前用户信息
export const getUserInfo = (params) => {
  return axios({
    url: `/common/user`,
    method: 'get',
    params
  });
};
// 查询影院树
export const getCinemaTree = params => {
  return axios({
    url: '/cinema/tree',
    method: 'get',
    params
  })
}
// 字典数据查询
export const getDictionaryData = params => {
  return axios({
    url: '/dictionary/getByName',
    method: 'get',
    params
  })
}
/*** 渠道管理 end ***/

export default {
  //班次收银管理**start*/
  clearaccountList,
  getCashier,
  getVip,
  getOtherthing,
  getWorker,
  getCreater,
  increaseWorker,
  addIssue,
  clearOne,
  clearTwo,
  clearFinish,
  clearDetail,
  thingDetail,
  actualCash,
  payTotal,
  filmSell,
  goodsSell,
  vipSell,
  ticketSell,
  otherSell,
  adjustList,
  adjustAdd,
  getAdjustSubject,
  //****end */
  //订单查询**start*/
  orderList,
  payType,
  payDetail,
  //***end */
  //领用物品管理查询**start*/
  otherthingsList,
  addOtherthing,
  deleteOtherthing,
  getCinemaByParam,
  //***end */
  //抽钞记录**start*/
  getMoneyList,
  getMoneyPerson,
  getMoneyCashier,
  //***end */
  //公共组件方法**start*/
  getDitch,
  getMoudelData,
  //***end */
  /*** 支付方式 start ***/
  findPayTypePage,
  savePayType,
  deletePayType,
  updatePayTypeStatus,
  findPayTypeByCode,
  updatePayType,
  getPayTypeCode,
  selectForTenant,
  /*** 支付方式 end ***/

  /*** 渠道管理 start ***/
  getChannelList,
  getCinemaChannelList,
  getChannelOtherList,
  addHeaderChannel,
  setChannelStatus,
  setChannelCinema,
  getChannelDetail,
  getUserInfo,
  getCinemaTree,
  getDictionaryData,
  /*** 渠道管理 end ***/

};