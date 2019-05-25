import axios from 'frame_cpm/http/api';
import config from './config';
export default {
    //采购管理
    procurement:{
        // 供应商查询接口
        supplierAdminQueryList: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/supplierAdmin/queryList',
                method: 'post',
                data
            })
        },
        // 获取区域接口
        supplierGetAreaList: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/supplierAdmin/getAreaList',
                method: 'post',
                data
            })
        },
        // 供应商新增接口
        supplierAdminAddSupplier: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/supplierAdmin/addSupplier',
                method: 'post',
                data
            })
        },
        // 供应商删除
        supplierAdminDeleteSupplier: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/supplierAdmin/deleteSupplier',
                method: 'post',
                data
            })
        },
        // 供应商禁用
        supplierAdminUpdateSupplierStatus: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/supplierAdmin/updateSupplierStatus',
                method: 'post',
                data
            })
        },
        // 查询采购单列表
        purchaseList: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/purchase/list',
                method: 'post',
                data
            })
        },
        // 生成采购单编码
        purchaseCode: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/purchase/code',
                method: 'post',
                data
            })
        },
        // 新增采购单
        purchaseSave: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/purchase/save',
                method: 'post',
                data
            })
        },
        // 查看采购单
        purchaseGet: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/purchase/get',
                method: 'post',
                data
            })
        },
    }
}