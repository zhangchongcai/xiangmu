// import axios from 'frame_cpm/http/api';
// import config from '../config';
import { axios } from 'base';

export default {
  // 采购管理
  procurement: {
    // 供应商查询接口
    supplierAdminQueryList: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/supplierAdmin/queryList',
        method: 'post',
        data
      });
    },
    // 获取区域接口
    supplierGetAreaList: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/supplierAdmin/getAreaList',
        method: 'post',
        data
      });
    },
    // 供应商新增接口
    supplierAdminAddSupplier: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/supplierAdmin/addSupplier',
        method: 'post',
        data
      });
    },
    // 供应商修改接口
    supplierAdminUpdateSupplier: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/supplierAdmin/updateSupplier',
        method: 'post',
        data
      });
    },
    // 供应商删除
    supplierAdminDeleteSupplier: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/supplierAdmin/deleteSupplier',
        method: 'post',
        data
      });
    },
    // 供应商禁用
    supplierAdminUpdateSupplierStatus: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/supplierAdmin/updateSupplierStatus',
        method: 'post',
        data
      });
    },
    // 供应商详情
    supplierAdminSelectSupplierEntity: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/supplierAdmin/selectSupplierEntity',
        method: 'post',
        data
      });
    },
    // 查询采购单列表
    purchaseList: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/purchase/list',
        method: 'post',
        data
      });
    },
    // 生成采购单编码
    purchaseCode: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/purchase/code',
        method: 'post',
        data
      });
    },
    // 添加采购单商品明细
    purchasePurchaseMer: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/purchase/purchaseMer',
        method: 'post',
        data
      });
    },
    // 新增采购单
    purchaseSave: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/purchase/save',
        method: 'post',
        data
      });
    },
    // 修改采购单
    purchaseUpdate: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/purchase/update',
        method: 'post',
        data
      });
    },
    // 提交采购单
    purchaseSubmit: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/purchase/submit',
        method: 'post',
        data
      });
    },
    // 查看采购单
    purchaseGet: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/purchase/get',
        method: 'post',
        data
      });
    },
    // 删除采购单
    purchaseDelete: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/purchase/delete',
        method: 'post',
        data
      });
    },
    // 查询入库单列表
    storeBillQueryStoreIn: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/store/in/bill/queryStoreIn',
        method: 'post',
        data
      });
    },
    // 查询入库单编码
    storeBillGetStoreInBillCode: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/store/in/bill/getStoreInBillCode',
        method: 'post',
        data
      });
    },
    // 更新或删除入库单
    storeBillUpdateStoreIn: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/store/in/bill/updateStoreIn',
        method: 'post',
        data
      });
    },
    // 新增入库单
    storeBillSaveStoreIn: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/store/in/bill/saveStoreIn',
        method: 'post',
        data
      });
    },
    // 入库单详情
    storeBillGetStoreIn: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/store/in/bill/getStoreIn',
        method: 'post',
        data
      });
    },
    // 退货单列表
    storeoutBillList: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/storeoutBill/list',
        method: 'post',
        data
      });
    },
    // 退货单回选
    storeoutBillToPage: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/storeoutBill/toPage',
        method: 'post',
        data
      });
    },
    // 根据商品uid查采购单位
    queryPurUnitBySpuUid: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/purchase/queryPurUnitBySpuUid',
        method: 'post',
        data
      });
    },
    // 新增退货单
    purchaseReturnSave: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/storeoutBill/purchase/return/save',
        method: 'post',
        data
      });
    },
    // 修改或删除退货单
    purchaseReturnUpdate: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/storeoutBill/purchase/return/update',
        method: 'post',
        data
      });
    },
    // 删除主表单
    storeoutBillDelete: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/storeoutBill/delete',
        method: 'post',
        data
      });
    },
    // 执行出库
    purchaseReturnOut: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/storeoutBill/purchase/return/out',
        method: 'post',
        data
      });
    },
    // 采购协议列表检索
    agreementQueryPage: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/agreement/queryPage',
        method: 'post',
        data
      });
    },
    // 采购协议列表删除
    agreementDelete: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/agreement/delete',
        method: 'post',
        data
      });
    },
    // 生成协议编码
    agreementCreateCode: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/agreement/createCode',
        method: 'post',
        data
      });
    },
    // 新建协议
    agreementSave: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/agreement/save',
        method: 'post',
        data
      });
    },
    // 修改协议
    agreementUpdate: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/agreement/update',
        method: 'post',
        data
      });
    },
    // 查看协议
    agreementGet: data => {
      return axios({
        // baseURL: config.baseURL,
        url: '/cim/agreement/get',
        method: 'post',
        data
      });
    }
  }
};
