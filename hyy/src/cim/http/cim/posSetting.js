import axios from 'frame_cpm/http/api';
import config from '../config';
export default {
    posSetting:{
        //pos端常用商品设置
        // 门店常用商品查询
        userProQueryUseInfo: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/user/pro/queryUseInfo',
                method: 'post',
                data
            })
        },
        // 保存常用商品
        userProSaveUseInfo: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/user/pro/saveUseInfo',
                method: 'post',
                data
            })
        },
        // 终端列表接口
        userProTerminalList: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/user/pro/terminalList',
                method: 'post',
                data
            })
        },
        // 终端删除
        userProDelterminal: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/user/pro/delterminal',
                method: 'post',
                data
            })
        },
        // 标签查询
        labelConfigurationQueryLabel: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/labelConfiguration/queryLabel',
                method: 'post',
                data
            })
        },
        // 标签添加
        labelConfigurationSaveLabel: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/labelConfiguration/saveLabel',
                method: 'post',
                data
            })
        },
        // 标签单个删除
        labelConfigurationDeleteLabel: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/labelConfiguration/deleteLabel',
                method: 'post',
                data
            })
        },
        // 标签列表删除
        labelConfigurationDeleteLabelList: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/labelConfiguration/deleteLabelList',
                method: 'post',
                data
            })
        },
        //商品积分查询
        integralExchQuery: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/integralExch/query',
                method: 'post',
                data
            })
        },
        //添加积分
        integralExchSave: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/integralExch/save',
                method: 'post',
                data
            })
        },
        //更新积分
        integralExchUpdate: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/integralExch/update',
                method: 'post',
                data
            })
        },
        //批量更新积分
        integralExchBatchUpdate: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/integralExch/batchUpdate',
                method: 'post',
                data
            })
        },
        //启用或禁用
        integralExchDisabled: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/integralExch/disabled',
                method: 'post',
                data
            })
        },
        integralExchDelete: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/integralExch/delete',
                method: 'post',
                data
            })
        },
        integralExchBatchDelete: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/integralExch/batchDelete',
                method: 'post',
                data
            })
        },
        //常用商品分类查询
        categoryUserQuery: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/categoryUser/query',
                method: 'post',
                data
            })
        },
        //常用商品分类保存
        categoryUserSave: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/categoryUser/save',
                method: 'post',
                data
            })
        },
        //终端商品分类保存
        categoryUserTerminalSave: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/categoryUser/terminalSave',
                method: 'post',
                data
            })
        },
        //终端商品分类删除
        categoryUserDelterminal: data => {
            return axios({
                baseURL: config.baseURL,
                url: '/categoryUser/delterminal',
                method: 'post',
                data
            })
        },
    }
}