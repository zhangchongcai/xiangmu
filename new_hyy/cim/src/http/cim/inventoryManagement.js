// import axios from 'frame_cpm/http/api';
import { axios } from 'base';
// import config from '../config';
export default {
  // 盘点方案
  inventoryPlan: {
    // 盘点方案查询
    checkSolutionQuery: data => {
      return axios({
        // baseURL:config.baseURL,
        url: '/cim/checkSolution/query',
        method: 'post',
        data
      });
    },
    // 盘点方案修改
    checkSolutionUpdate: data => {
      return axios({
        // baseURL:config.baseURL,
        url: '/cim/checkSolution/update',
        method: 'post',
        data
      });
    },
    // 盘点方案删除
    checkSolutionDelete: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/checkSolution/delete',
        method: 'post',
        data
      });
    },
    // 盘点方案新增
    checkSolutionSave: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/checkSolution/save',
        method: 'post',
        data
      });
    },
    // 跳转修改页面/取消修改/查询盘点方案商品清单
    checkSolutionToPage: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/checkSolution/toPage',
        method: 'post',
        data
      });
    }
  },
  // 盘点单管理
  inventoryManagement: {
    // 盘点单首页查询
    checkBillQuery: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/checkBill/query',
        method: 'post',
        data
      });
    },
    // 仓库列表
    checkBillStorehouse: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/checkBill/storehouse',
        method: 'post',
        data
      });
    },
    // 货架列表
    checkBillStorageRack: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/checkBill/storageRack',
        method: 'post',
        data
      });
    },
    // 新建盘点单号
    checkBillCreateBillCode: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/checkBill/createBillCode',
        method: 'post',
        data
      });
    },
    // 查询盘点方案
    checkBillNames: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/checkBill/names',
        method: 'post',
        data
      });
    },
    // 查询盘点商品清单列表
    checkBillCheckSolutionMerInfo: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/checkBill/checkSolutionMerInfo',
        method: 'post',
        data
      });
    },
    // 新增盘点单
    checkBillSave: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/checkBill/save',
        method: 'post',
        data
      });
    },
    // 删除盘点单
    checkBillDelete: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/checkBill/delete',
        method: 'post',
        data
      });
    },
    // 处理提交审核
    checkBillSubmitCheck: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/checkBill/submitCheck',
        method: 'post',
        data
      });
    },
    // 跳转修改页面
    checkBillToPage: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/checkBill/toPage',
        method: 'post',
        data
      });
    },
    // 盘点单修改
    checkBillUpdate: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/checkBill/update',
        method: 'post',
        data
      });
    },
    // 查看盘点单商品信息
    checkBillQueryCheckBill: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/checkBill/queryCheckBill',
        method: 'post',
        data
      });
    },
    // 差异类别列表
    checkBillCategory: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/checkBill/category',
        method: 'post',
        data
      });
    },
    // 处理差异(接受盘亏)
    checkBillDifferenceManage: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/checkBill/differenceManage',
        method: 'post',
        data
      });
    }
  },
  // 库存转移管理
  inventoryTransfer: {
    // 库存转移管理首页查询
    moveBillFindMoveList: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/move/bill/findMoveList',
        method: 'post',
        data
      });
    },
    // 查询单据信息（点击修改，查看，新建时调用）接口
    moveBillFindMoveDetailInfo: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/move/bill/findMoveDetailInfo',
        method: 'post',
        data
      });
    },
    // 仓库/货架下拉框接口
    moveBillFindAllStorehouse: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/move/bill/findAllStorehouse',
        method: 'post',
        data
      });
    },
    // 选择商品查询商品sku列表
    moveBillFindProductList: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/move/bill/findProductList',
        method: 'post',
        data
      });
    },
    // 确认并提交 保存为草稿
    moveBillSaveMoveBillInfo: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/move/bill/saveMoveBillInfo',
        method: 'post',
        data
      });
    },
    // 转移提交
    moveBillSubmitMoveBillInfo: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/move/bill/submitMoveBillInfo',
        method: 'post',
        data
      });
    },
    // 转移删除
    moveBillDelMoveBillInfo: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/move/bill/delMoveBillInfo',
        method: 'post',
        data
      });
    }
  },
  // 商品入库登记
  goodsWarehousingIn: {
    // 商品入库登记首页查询
    storeInBillRegisterGetList: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/store/in/bill/register/getList',
        method: 'post',
        data
      });
    },
    // 生产入库单编码
    storeInBillRegisterGetStoreInBillCode: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/store/in/bill/register/getStoreInBillCode',
        method: 'post',
        data
      });
    },
    // 保存商品入库
    storeInBillRegisterSave: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/store/in/bill/register/save',
        method: 'post',
        data
      });
    },
    // 选择商品
    storeInGetList: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/store/in/bill/register/cinemaMer/getList',
        method: 'post',
        data
      });
    },
    // 删除商品入库
    storeInDelete: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/store/in/bill/register/delete',
        method: 'post',
        data
      });
    },
    // 提交商品入库
    storeInSubmit: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/store/in/bill/register/submit',
        method: 'post',
        data
      });
    },
    // 查看修改进入详情页
    storeInDetail: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/store/in/bill/register/detail',
        method: 'post',
        data
      });
    },
    // 修改
    storeInUpdate: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/store/in/bill/register/update',
        method: 'post',
        data
      });
    }
  },
  // 商品出库登记
  goodsWarehousingOut: {
    // 商品出库登记首页查询
    storeoutBillList: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/storeoutBill/list',
        method: 'post',
        data
      });
    },
    // 跳转新增/修改页面
    storeoutBillToPage: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/storeoutBill/toPage',
        method: 'post',
        data
      });
    },
    // 选择商品
    storeoutBillQuerySkus: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/storeoutBill/querySkus',
        method: 'post',
        data
      });
    },
    // 修改新增保存
    storeoutBillSave: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/storeoutBill/save',
        method: 'post',
        data
      });
    },
    // 删除
    storeoutBillDelete: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/storeoutBill/delete',
        method: 'post',
        data
      });
    },
    // 提交
    storeoutBillCommit: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/storeoutBill/commit',
        method: 'post',
        data
      });
    }
  },
  // 门店商品坤村查询
  storeInventoryQuery: {
    // 商品出库登记首页查询
    cinemaMerStockQueryStock: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/cinemaMerStock/queryStock',
        method: 'post',
        data
      });
    }
  },
  // 调拨申请allotBill/save
  goodsWarehousingApply: {
    // 调拨申请编号
    allotBillGetBillCode: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/allotBill/getBillCode',
        method: 'post',
        data
      });
    },
    // 调拨申请单保存
    allotBillSave: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/allotBill/save',
        method: 'post',
        data
      });
    },
    // 调拨申请选择商品
    allotBillFindGoods: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/allotBill/findGoods',
        method: 'post',
        data
      });
    },
    // 调拨申请首页查询
    allotBillList: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/allotBill/list',
        method: 'post',
        data
      });
    },
    // 调拨申请单详情
    allotBillFind: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/allotBill/find',
        method: 'post',
        data
      });
    },
    // 调拨申请单未提交修改
    allotBillUpdate: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/allotBill/update',
        method: 'post',
        data
      });
    },
    // 调拨申请单提交
    allotBillRefer: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/allotBill/refer',
        method: 'post',
        data
      });
    },
    // 调拨申请单删除
    allotBillDelete: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/allotBill/delete',
        method: 'post',
        data
      });
    },
    // 库存出入库调拨单接口
    allotBillGetList: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/allotBill/getList',
        method: 'post',
        data
      });
    }
  },
  // 门店商品库存分析
  storeInventoryAnalysis: {
    // 门店商品库存分析
    cinemaMerStockQueryStock: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/cinemaMerStockType/queryStockTypeList',
        method: 'post',
        data
      });
    }
  }
};
