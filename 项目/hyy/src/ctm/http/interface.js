import axios from "frame_cpm/http/api"

/**
 * 将所有接口统一起来便于维护
 * 如果项目很大可以将 URL 独立成文件，接口分成不同的模块
 */
/**接口处理示例 */
export const testGet = (params) => {
  //接口备注
  return axios({
    url: '/ticket/getApi',
    method: 'get',
    params
  });
};

export const testPost = data => {
  return axios({
    url: '/ticket/postApi',
    method: 'post',
    data
  })
}

export const login = data => {
  return axios({
    url: '/ticket/login',
    method: 'post',
    data
  })
}

// 获取数据字典枚举值统一接口
export const getByName = params => {
  return axios({
    url: '/ticket/dictionary/getByName',
    method: 'get',
    params
  })
}

export const findAllHall = data => {
  return axios({
    url: '/ticket/cihall/findAllHall',
    method: 'post',
    data
  })
}

export const listCalendarPlan = data => {
  return axios({
    url: '/ticket/schplan/listCalendarPlan',
    method: 'post',
    data
  })
}

export const copySchPlan = data => {
  return axios({
    url: '/ticket/schplan/copySchPlan',
    method: 'post',
    data
  })
}

export const getApproveList = data => {
  return axios({
    url: '/ticket/schplan/approve/list',
    method: 'post',
    data
  })
}

export const getSaleList = data => {
  return axios({
    url: '/ticket/schplan/sale/list',
    method: 'post',
    data
  })
}

export const getPrizeList = data => {
  return axios({
    url: '/ticket/schplan/prize/list',
    method: 'post',
    data
  })
}

export const getChannelList = params => {
  return axios({
    url: '/ticket/base/channel/list',
    method: 'get',
    params
  })
}

export const approvePass = data => {
  return axios({
    url: '/ticket/schplan/approve/pass',
    method: 'post',
    data
  })
}

export const saleOpenStop = data => {
  return axios({
    url: '/ticket/schplan/sale/openStop',
    method: 'post',
    data
  })
}

export const getBaseChannelList = data => {
    return axios({
        url: '/ticket/base/channel/query',
        method: 'post',
        data
    })
}

export const setChannelStop = data => {
    return axios({
        url: '/ticket/schplan/channel/stop',
        method: 'post',
        data
    })
}

export const setChannelOpen = data => {
    return axios({
        url: '/ticket/schplan/channel/open',
        method: 'post',
        data
    })
}

export const getSchreportCalendar = data => {
  return axios({
    url: '/ticket/schreport/calendar',
    method: 'post',
    data
  })
}

export const schreportReport = data => {
  return axios({
    url: '/ticket/schreport/report',
    method: 'post',
    data
  })
}

export const getCinemaHallSeat = params => {
    return axios({
        url: '/ticket/cinema/hallSeat',
        method: 'get',
        params
    })
}

// 查询影院树
export const getCinemaTree = params => {
  return axios({
    url: '/ticket/cinema/tree',
    method: 'get',
    params
  })
}

// 获取当前用户信息
export const getUserInfo = params => {
  return axios({
    url: '/ticket/common/user',
    method: 'get',
    params
  })
}
// 票类管理接口
export const tickettypeList = (limit,data) => {
  return axios({
    url: '/ticket/tickettype/list'+`?page=${limit.page}&pageSize=${limit.pageSize}`,
    method: 'post',
    data
  })
}
export const tickettypeDel = data => {
  return axios({
    url: '/ticket/tickettype/del/' + data,
    method: 'post'
  })
}
export const tickettypeAdd = data => {
  console.log(data)
  let datas = JSON.stringify(data)
  console.log(datas)
  return axios({
    url: '/ticket/tickettype/add',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    dataType: "json",
    data: datas
  })
}
export const tickettypeView = (params) => {
  return axios({
    url: '/ticket/tickettype/view/' + params,
    method: 'get'
  })
}
export const tickettypeUpdate = data => {
  console.log(data)
  let datas = JSON.stringify(data)
  console.log(datas)
  return axios({
    url: '/ticket/tickettype/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    dataType: "json",
    data: datas
  })
}
    // 票版管理接口
    //票版列表

//元素列表
export const ticketelementList = params => {
  return axios({
      url: '/ticket/ticketsample/item/list',
      method: 'get',
      params
  })
}

export const ticketList = params => {
  return axios({
      url: '/ticket/ticketsample/page',
      method: 'post',
      params
  })
}
export const ticketsampleDel = params => {
      return axios({
          url: '/ticket/ticketsample/del/' + params,
          method: 'get',
      })
  }
  //票版详情
export const ticketsampleQuery = params => {
  return axios({
      url: '/ticket/ticketsample/view/' + params,
      method: 'get',
  })
}
export const ticketelementAdd = data => {
  return axios({
      url: '/ticket/ticketsample/add',
      method: 'post',
      data
  })
}
export const ticketSampleUpdata = data => {
      return axios({
          url: '/ticket/ticketsample/update',
          method: 'post',
          data
      })
  }
  //渠道
export const ticketGetChannelList = params => {
  return axios({
      url: '/ticket/base/channel/list',
      method: 'get',
      params,
  })
}
export const checkChannelExsit = params => {
      return axios({
          url: '/ticket/ticketsample/check/channel/exsit/' + params,
          method: 'get',
      })
  }
  //导入导出
export const exportTicketFile  = params => {
  return axios({
      url:'/ticket/ticketsample/export/' + params,
      method:'get',
      params
  })
}
export const importTicketFile  = data => {
  return axios({
      url:'/ticket/ticketsample/import' ,
      method:'post',
      data
  })
}
  //------影厅管理接口-------
  //影厅类型
export const cinemagetByName = (params) => {
      return axios({
          url: '/ticket/dictionary/getByName' + params,
          method: 'get',
      })
  }
  //查询列表
export const cinemagetList = (params) => {
      return axios({
          url: '/ticket/cihall/find',
          method: 'post',
          params
      })
  }
  //查询影厅
export const getCiHallByUid = (params) => {
      return axios({
          url: '/ticket/cihall/getCiHallByUid',
          method: 'post',
          params
      })
  }
  //新增
export const addCiHall = data => {
      return axios({
          url: '/ticket/cihall/addCiHall',
          method: 'post',
          data: data
      })
  }
  //更新
export const updataCiHall = data => {
      return axios({
          url: '/ticket/cihall/updateCiHall',
          method: 'post',
          data
      })
  }
  //删除
export const deleteCiHall = params => {
      return axios({
          url: '/ticket/cihall/deleteCiHall',
          method: 'post',
          params
      })
  }
  //校验
export const nameExsit = (params) => {
  return axios({
      url: '/ticket/cihall/nameExsit',
      method: 'get',
      params
  })
}
export const aliasesExsit = (params) => {
  return axios({
      url:'/ticket/cihall/aliasesExsit',
      method: 'get',
      params
  })
}
export const seqExsit = (params) => {
      return axios({
          url: '/ticket/cihall/seqExsit',
          method: 'get',
          params
      })
  }
  //-----影院管理--------
export const cinemaList = (params,data) => {
      return axios({
          url: '/ticket/cinema/list',
          method: 'post',
          params,
          data,
      })
  }
  //-----影厅座位图--------
export const ciseatMap = (params,data) => {
    return axios({
        url: '/ticket/ciseat/map',
        method: 'post',
        params,
        data,
    })
}
//-----保存影厅座位图--------
export const ciseatDesign = data => {
    let datas = JSON.stringify(data)
      return axios({
          url: '/ticket/ciseat/design',
          method: 'post',
          headers: {
              'Content-Type': 'application/json;charset=utf-8'
          },
          dataType: "json",
          data:datas
      })
}
  //获得影院信息
export const cinemaGetInfo = (data) => {
      return axios({
          url: '/ticket/cinema/view/' + data,
          method: 'get',
      })
  }
  //修改影院
export const cinemaSave = data => {
      let datas = JSON.stringify(data)
      return axios({
          url: '/ticket/cinema/add',
          method: 'post',
          headers: {
              'Content-Type': 'application/json;charset=utf-8'
          },
          dataType: "json",
          data: datas
      })
  }
  //城市查询
export const getPname = (parems) => {
  return axios({
      url: '/ticket/area/list/' + parems,
      method: 'get',
  })
}
  //影院下载证书
export const cinemaDownload = (params) => {
  return axios({
      url: '/ticket/cinema/download',
      method: 'post',
      params
  })
}
  //影院绑定USBKEY
export const cinemaBindUSBKey = (params) => {
  return axios({
      url: '/ticket/cinema/bindUSBKey',
      method: 'post',
      params
  })
}
//影片管理接口
export const DownloadmovieList = data => {
  return axios({
    url: '/ticket/schbashmovie/find',
    method: 'post',
    data
  })
}
export const schbashmovieLoad = params => {
  return axios({
    url: '/ticket/schbashmovie/load',
    method: 'get',
    params
  })
}
export const DownloadmovieScan = params => {
  return axios({
    url: '/ticket/schbashmovie/getByMovieCode',
    method: 'get',
    params
  })
}
export const cinemaStockList = data => {
  return axios({
    url: '/ticket/schmovie/find',
    method: 'post',
    data
  })
}
export const cinemaStockScan = params => {
  return axios({
    url: '/ticket/schmovie/getSchMovieDetail',
    method: 'get',
    params
  })
}
export const DownloadmovieEdit = data => {
  return axios({
    url: '/ticket/schbashmovie/save',
    method: 'post',
    data
  })
}
export const cinemaStockEdit = data => {
  return axios({
    url: '/ticket/schmovie/update',
    method: 'post',
    data
  })
}
//价格方案接口
export const ticketPriceplanList = data => {
  return axios({
    url: '/ticket/priceprogram/find',
    method: 'post',
    data
  })
}

export const importPricePlan = data => {
  return axios({
      url: '/ticket/priceprogram/leadingInPage',
      method: 'post',
      data
  })
}

// 批量导入价格方案
// schplan/loadPricePrograme
export const importBatchPricePlan = data => {
  return axios({
      url: '/ticket/schplan/loadPricePrograme',
      method: 'post',
      data
  })
}

export const exportMoviePlan = data => {
  return axios({
      url: '/ticket/schplan/getPrintPlanDate',
      method: 'post',
      data
  })
}
export const priceprogramSave = data => {
  return axios({
    url: '/ticket/priceprogram/save',
    method: 'post',
    data
  })
}
export const priceprogramUpdate = data => {
  return axios({
    url: '/ticket/priceprogram/update',
    method: 'post',
    data
  })
}
export const priceprogramScan = params => {
  return axios({
    url: '/ticket/priceprogram/getById',
    method: 'get',
    params
  })
}
export const deletePricePlan = params => {
  return axios({
    url: '/ticket/priceprogram/delete',
    method: 'get',
    params
  })
}
//新增价格体系获取字典
// 获取发行版本  获取导入价格方案影厅列表
// name SCH_MOVIE_DIS_VERSION (发行版本)    name CI_HALL_TYPE (影厅类型)
export const getCinemaTreeList = params => {
  return axios({
    url: '/ticket/cinema/tree',
    method: 'get',
    params
  })
}
export const hallTypeList = params => {
  return axios({
    url: '/ticket/dictionary/getByName',
    method: 'get',
    params
  })
}
export const getTickettypeList = params => {
  return axios({
    url: '/ticket/tickettype/findByCinemaUids',
    method: 'post',
    params
  })
}
export const disVersionList = params => {
  return axios({
    url: '/ticket/dictionary/getByName',
    method: 'get',
    params
  })
}
export const getPriceAddChannelList = params => {
  return axios({
    url: '/ticket/base/channel/findByChannelNature',
    method: 'get',
    params
  })
}
/*
    排片管理
    影厅列表
*/
export const cinemaRoomList = data => {
  return axios({
    url: '/ticket/cihall/findAllHall',
    method: 'post',
    data
  })
}

// 排片页根据 id 查询排片详情(单场)
export const getmoviePlanDetail = params => {
  return axios({
    url: '/ticket/schplan/priceDetail',
    method: 'get',
    params
  })
}

// 排片页根据 id 查询排片详情(连排)
export const getmoviePlanDetails = params => {
  return axios({
    url: '/ticket/schplan/planDetails',
    method: 'get',
    params
  })
}

// 获取排片参考页 竞对影院list
export const getRefCinema = data => {
  return axios({
    url: '/ticket/schplan/competeCinema',
    method: 'get',
    data
  })
}

// 获取排片页 左侧参考数据
export const getRefTip = data => {
  return axios({
    url: '/ticket/schplan/reference/tip',
    method: 'post',
    data
  })
}
export const getTicketChannel = params => {
  return axios({
    url: '/ticket/schplan/getBaseTicketAndChannels',
    method: 'post',
    params
  })
}
// 获取排片参考页数据接口
export const getPlanReference = data => {
  return axios({
    url: '/ticket/schplan/reference',
    method: 'post',
    data
  })
}

// 查询黄金时段
export const getgoldTimeSet = params => {
  return axios({
    url: '/ticket/schplan/goldSet/query',
    method: 'get',
    params
  })
}

// 设置黄金时段
export const setgoldTimeSet = data => {
  return axios({
    url: '/ticket/schplan/goldSet/save',
    method: 'post',
    data
  })
}


// 获取排片页价格方案
export const getPricePlan = params => {
  return axios({
    url: '/ticket/priceprogram/simpleList',
    method: 'get',
    params
  })
}

// 获取排片的语言
export const getSchPlanLang = params => {
  return axios({
    url: '/ticket/schbashmovie/language',
    method: 'get',
    params
  })
}
// 排片获取价格体系
export const getPriceSystem = data => {
  return axios({
    url: '/ticket/schplan/getnetSale',
    method: 'post',
    data
  })
}
// 批量设置票价
export const setBatchPirce = data => {
  return axios({
    url: '/ticket/schplan/setPrice',
    method: 'post',
    data
  })
}

// 保存排片信息
export const saveMoviePlan = data => {
  return axios({
    url: '/ticket/schplan/save',
    method: 'post',
    data
  })
}
// 提交审批
export const subApproves = data => {
  return axios({
    url: '/ticket/schplan/submitSchPlanApprove',
    method: 'post',
    data
  })
}


/*
    排片管理
    电影列表
*/
export const cinemaMovieList = data => {
  return axios({
    url: '/ticket/schmovie/find',
    method: 'post',
    data
  })
}

/*
    排片管理
    新拖或位移保存排片
*/
export const savePlanAll = data => {
  return axios({
    url: '/ticket/schplan/save',
    method: 'post',
    data
  })
}

/*
    排片管理
    获取时间轴内排片
*/
export const datePlanList = data => {
  return axios({
    url: '/ticket/schplan/showPlan',
    method: 'post',
    data
  })
}

/*
    排片管理
    删除影片
*/
export const deletePlan = data => {
  return axios({
    url: '/ticket/schplan/delSchPlan',
    method: 'post',
    data
  })
}

/*
    排片管理
    保存修改时间轴
*/
export const editTimeLine = data => {
  return axios({
    url: '/ticket/schplan/editTimeLine',
    method: 'post',
    data
  })
}

/*
    排片管理
    打开时间轴
*/
export const initTimeLine = data => {
  return axios({
    url: '/ticket/schplan/initTimeLine',
    method: 'post',
    data
  })
}
//门店参数设置
export const systemParamLoad = data => {
  return axios({
    url: '/ticket/systemParam/load',
    method: 'post',
    data
  })
}
export const systemParamSavePlat = data => {
  return axios({
    url: '/ticket/systemParam/savePlat',
    method: 'post',
    data
  })
}
export const systemParamSaveBasic = data => {
  return axios({
    url: '/ticket/systemParam/saveBasic',
    method: 'post',
    data
  })
}
export const systemGetUserMenuTree = params => {
  return axios({
    url: '/ticket/systemParam/getUserMenuTree',
    method: 'get',
    params
  })
}
//软件升级信息

export const systemCinemaUiduUdate = params => {
  return axios({
    url: '/ticket/system/version/update',
    method: 'post',
    params
  })
}
export default {
  //影片管理接口**start*/
  DownloadmovieList,
  schbashmovieLoad,
  DownloadmovieScan,
  cinemaStockList,
  cinemaStockScan,
  DownloadmovieEdit,
  cinemaStockEdit,
  //****end */
  //票价方案**start*/
  ticketPriceplanList,
  getCinemaTreeList,
  hallTypeList,
  getTickettypeList,
  disVersionList,
  priceprogramSave,
  priceprogramUpdate,
  getPriceAddChannelList,
  priceprogramScan,
  deletePricePlan,
  //****end */
  testGet,
  testPost,
  login,
  getByName,
  findAllHall,
  listCalendarPlan,
  copySchPlan,
  getApproveList,
  getSaleList,
  getPrizeList,
  getChannelList,
  approvePass,
  saleOpenStop,
  getBaseChannelList,
  setChannelStop,
  setChannelOpen,
  getSchreportCalendar,
  schreportReport,
  getCinemaHallSeat,
  getCinemaTree,
  getUserInfo,
  tickettypeList,
  tickettypeDel,
  tickettypeAdd,
  tickettypeView,
  tickettypeUpdate,
   // 票版管理接口
   ticketList,
   ticketsampleQuery,
   ticketsampleDel,
   ticketelementList,
   ticketelementAdd,
   checkChannelExsit,
   ticketGetChannelList,
   ticketSampleUpdata,
   exportTicketFile,
   importTicketFile,
   //影厅管理
   cinemagetByName,
   cinemagetList,
   getCiHallByUid,
   updataCiHall,
   nameExsit,
   addCiHall,
   aliasesExsit,
   seqExsit,
   deleteCiHall,
   //影院管理
   cinemaList,
   cinemaGetInfo,
   getPname,
   ciseatMap,
   ciseatDesign,
   cinemaDownload,
   cinemaBindUSBKey,
  // 排片
  cinemaSave,
  /* 场次排片 */
  cinemaRoomList,
  cinemaMovieList,
  savePlanAll,
  datePlanList,
  deletePlan,
  editTimeLine,
  initTimeLine,
  getRefCinema,
  getPlanReference,
  getgoldTimeSet,
  setgoldTimeSet,
  getRefTip,
  getTicketChannel,
  setBatchPirce, 
  importBatchPricePlan, 
  // 放映计划详情
  getmoviePlanDetail,
  getmoviePlanDetails,
  getPricePlan,
  getSchPlanLang,
  getPriceSystem,
  exportMoviePlan,
  saveMoviePlan,
  subApproves,
  importPricePlan,
  //影院参数设置
  systemParamLoad,
  systemParamSavePlat,
  systemParamSaveBasic,
  systemGetUserMenuTree,
  //软件升级信息
  systemCinemaUiduUdate
};