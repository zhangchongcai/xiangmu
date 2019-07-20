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
    url: '/ticket/schreport/manualReport',
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

export const getRegionTypeList = params => {
  return axios({
    url: '/ticket/regionType/list',
    method: 'get',
    params
  })
}

export const saveRegionType = data => {
  return axios({
    url: '/ticket/regionType',
    method: 'post',
    data
  })
}

export const updateRegionType = data => {
  return axios({
    url: '/ticket/regionType',
    method: 'put',
    data
  })
}

export const delRegionType = params => {
  return axios({
    url: '/ticket/regionType',
    method: 'delete',
    params
  })
}

export const getRegionInfoList = params => {
  return axios({
    url: '/ticket/ciseat/load',
    method: 'get',
    params
  })
}

// 放映计划审核分页列表
export const findSchApprove = data => {
  return axios({
    url: '/ticket/schApprove/find',
    method: 'post',
    data
  })
}

// 放映计划审核详情
export const schApproveDetails = data => {
  return axios({
    url: '/ticket/schApprove/details',
    method: 'post',
    data
  })
}

// 审核放映计划
export const schApprove = data => {
  return axios({
    url: '/ticket/schApprove/approve',
    method: 'post',
    data
  })
}

// 排片信息保存接口
export const schGuideInfoSave = data => {
  return axios({
    url: '/ticket/schGuide/info/save',
    method: 'post',
    data
  })
}

// 排片信息修改接口
export const schGuideInfoUpdate = data => {
  return axios({
    url: '/ticket/schGuide/info/update',
    method: 'post',
    data
  })
}

// 排片信息分页列表
export const schGuideInfoPage = data => {
  return axios({
    url: '/ticket/schGuide/info/page',
    method: 'post',
    data
  })
}

// 排片信息删除
export const schGuideInfoDelete = data => {
  return axios({
    url: '/ticket/schGuide/info/delete',
    method: 'post',
    data
  })
}

// 排片信息审核
export const schGuideInfoApprove = data => {
  return axios({
    url: '/ticket/schGuide/info/approve',
    method: 'post',
    data
  })
}

// 排片信息审核撤回
export const schGuideInfoRecall = params => {
  return axios({
    url: '/ticket/schGuide/info/recall',
    method: 'get',
    params
  })
}

// 排片信息审核撤回
export const schGuideInfoSubmit = data => {
  return axios({
    url: '/ticket/schGuide/info/submit',
    method: 'post',
    data
  })
}

// 排片信息详情
export const schGuideInfoDetails = data => {
  return axios({
    url: '/ticket/schGuide/info/details',
    method: 'post',
    data
  })
}

// 查看黄金时段
export const getPrimeTimeList = data => {
  return axios({
    url: '/ticket/schGuide/primeTime/list',
    method: 'post',
    data
  })
}

// 设置黄金时段
export const setPrimeTimeList = data => {
  return axios({
    url: '/ticket/schGuide/primeTime/setTime',
    method: 'post',
    data
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

// 关键字获取用户授权影院list
export const authQueryUserCinemas = params => {
  return axios({
    url: '/cpm/user/auth/queryUserCinemas',
    method: 'get',
    params
  })
}
// 票类管理接口
export const tickettypeList = (limit, data) => {
  return axios({
    url: '/ticket/tickettype/list' + `?page=${limit.page}&pageSize=${limit.pageSize}`,
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
  let datas = JSON.stringify(data)
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
  let datas = JSON.stringify(data)
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

export const ticketList = (limit, data) => {
  return axios({
    url: '/ticket/ticketsample/page?' + `page=${limit.page}&pageSize=${limit.pageSize}`,
    method: 'post',
    data
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
export const checkChannelExsit = data => {
  return axios({
    url: '/ticket/ticketsample/check/channel/exsit/' + `${data.cinemaUid}/${data.channelUid}  `,
    method: 'get',
  })
}
//导入导出
export const exportTicketFile = params => {
  return axios({
    url: '/ticket/ticketsample/export/' + params,
    method: 'get',
    params
  })
}
export const importTicketFile = data => {
  return axios({
    url: '/ticket/ticketsample/import',
    method: 'post',
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

//排片影厅查询接口
export const getPlanRoomData = (data) => {
  return axios({
    url: '/ticket/cihall/planHall',
    method: 'post',
    data
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
    url: '/ticket/cihall/aliasesExsit',
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
export const cinemaList = (params, data) => {
  return axios({
    url: '/ticket/cinema/list',
    method: 'post',
    params,
    data,
  })
}
//-----影厅座位图--------
export const ciseatMap = (params, data) => {
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
    data: datas
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
//根据影院查询影片库
export const ByCinemaUidsLoadMovies = data => {
  let datas = JSON.stringify(data)
  return axios({
    url: '/ticket/schmovie/findByCinemaUids',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    dataType: "json",
    data: datas
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
//影片资料下拉字典
export const getSysByCode = params => {
  return axios({
    url: '/ticket/dictionary/getSysByCode',
    method: 'get',
    params
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

// 排片页影片列表查询
export const getPlanMovieList = data => {
  return axios({
    url: '/ticket/schmovie/findByCinemaUid',
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
export const getRefCinema = params => {
  return axios({
    url: '/ticket/schplan/competeCinema',
    method: 'get',
    params
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
// 获取排片页 左侧指导数据
export const getPlanAdvice = data => {
  return axios({
    url: '/ticket/schGuide/list',
    method: 'post',
    data
  })
}

// 排片指导
// 排片指导获取 基础影片信息
export const getBaseMovieInfo = data => {
  return axios({
    url: '/ticket/schbashmovie/baseFilmPage',
    method: 'post',
    data
  })
}
// 获取排片指导影院数据
export const getCinemaAreaList = data => {
  return axios({
    url: '/ticket/cinema/areaList',
    method: 'post',
    data
  })
}
// 获取排片指导列表
export const getPlanGuiideList = data => {
  return axios({
    url: '/ticket/schGuide/guidance/page',
    method: 'post',
    data
  })
}

// 删除排片指导
export const delPlanGuiideDetail = data => {
  return axios({
    url: '/ticket/schGuide/guidance/delete',
    method: 'post',
    data
  })
}

// 修改排片指导详情
export const updatePlanGuiideDetail = data => {
  return axios({
    url: '/ticket/schGuide/guidance/update',
    method: 'post',
    data
  })
}

// 获取排片指导详情
export const getPlanGuiideDetail = data => {
  return axios({
    url: '/ticket/schGuide/guidance/details',
    method: 'post',
    data
  })
}

// 获取排片指导省市详情
export const getAreaInfo = params => {
  return axios({
    url: '/ticket/area/info',
    method: 'get',
    params
  })
}

// 保存排片指导
export const savePlanGuide = data => {
  return axios({
    url: '/ticket/schGuide/guidance/save',
    method: 'post',
    data
  })
}

// 查询周转率
export const getTurnoverRate = data => {
  return axios({
    url: '/ticket/schGuide/primeTime/working',
    method: 'post',
    data
  })
}
// 设置周转率
export const setTurnoverRate = data => {
  return axios({
    url: '/ticket/schGuide/primeTime/setWorking',
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


// 单个影城
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

// 复制排片
export const copySinglePlan = data => {
  return axios({
    url: '/ticket/schplan/copyPlan',
    method: 'post',
    data
  })
}

// 查询票房数据
export const getDecision = data => {
  return axios({
    url: '/ticket/schplan/decision',
    method: 'post',
    data
  })
}

// 修改排片影片状态
export const updateMovieOftenUseStatus = params => {
  return axios({
    url: '/ticket/schbashmovie/updateMovieOftenUseStatus',
    method: 'post',
    params
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
// 更新排片信息
export const updateMoviePlan = data => {
  return axios({
    url: '/ticket/schplan/update',
    method: 'post',
    data
  })
}
// 提交审批
export const subApproves = data => {
  return axios({
    url: '/ticket/schApprove/submit',
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


//总部排片指导

//获取指导列表
export const getPlayGuideList = data => {
  return axios({
    url: '/ticket/schGuide/find',
    method: 'post',
    data
  })
}
//保存或修改总部指导
export const savePlayGuide = data => {
  return axios({
    url: '/ticket/schGuide/save',
    method: 'post',
    data
  })
}
//获取指导详情
export const getPlayGuideById = params => {
  return axios({
    url: '/ticket/schGuide/details',
    method: 'get',
    params
  })
}
//删除指导详情
export const deletePlayGuide = params => {
  return axios({
    url: '/ticket/schGuide/delete',
    method: 'get',
    params
  })
}

// 城市分类管理

//获取城市分类列表
export const fetchCitySortList = data => {
  return axios({
    url: '/ticket/area/queryArea',
    method: 'post',
    data
  })
}

//保存 城市分类
export const saveCitySortList = data => {
  return axios({
    url: '/ticket/area/updateGrade',
    method: 'post',
    data
  })
}

//查询所有城市列表
export const queryAreatList = data => {
  return axios({
    url: '/ticket/area/areaList',
    method: 'post',
    data
  })
}
//根据父级查询列表
export const queryAreaByParent = params => {
  return axios({
    url: '/ticket/area/list/' + params.parentCode,
    method: 'get',
    params
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
  ByCinemaUidsLoadMovies,
  schbashmovieLoad,
  DownloadmovieScan,
  cinemaStockList,
  cinemaStockScan,
  DownloadmovieEdit,
  cinemaStockEdit,
  getSysByCode,
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
  getRegionTypeList,
  saveRegionType,
  updateRegionType,
  delRegionType,
  getRegionInfoList,
  findSchApprove,
  schApproveDetails,
  schApprove,
  schGuideInfoSave,
  schGuideInfoUpdate,
  schGuideInfoPage,
  schGuideInfoDelete,
  schGuideInfoApprove,
  schGuideInfoRecall,
  schGuideInfoSubmit,
  schGuideInfoDetails,
  getPrimeTimeList,
  setPrimeTimeList,
  getCinemaTree,
  getUserInfo,
  authQueryUserCinemas,
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
  // 排片指导
  getPlanGuiideList,
  getPlanGuiideDetail,
  getBaseMovieInfo,
  getCinemaAreaList,
  getAreaInfo,
  savePlanGuide,
  delPlanGuiideDetail,
  updatePlanGuiideDetail,
  getTurnoverRate,
  setTurnoverRate,
  // 排片
  cinemaSave,
  getPlanMovieList,
  getPlanRoomData,
  /* 场次排片 */
  cinemaRoomList,
  cinemaMovieList,
  datePlanList,
  deletePlan,
  editTimeLine,
  initTimeLine,
  getRefCinema,
  getPlanReference,
  getgoldTimeSet,
  setgoldTimeSet,
  getRefTip,
  getDecision,
  getPlanAdvice,
  getTicketChannel,
  setBatchPirce,
  importBatchPricePlan,
  // 放映计划详情
  getmoviePlanDetail,
  getmoviePlanDetails,
  getPricePlan,
  getSchPlanLang,
  exportMoviePlan,
  saveMoviePlan,
  updateMoviePlan,
  subApproves,
  importPricePlan,
  copySinglePlan,
  updateMovieOftenUseStatus,
  //影院参数设置
  systemParamLoad,
  systemParamSavePlat,
  systemParamSaveBasic,
  systemGetUserMenuTree,
  //软件升级信息
  systemCinemaUiduUdate
};