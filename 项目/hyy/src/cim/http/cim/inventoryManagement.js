import axios from 'frame_cpm/http/api';
import config from './config';
export default {
    // 盘点方案
    inventoryPlan: {
        // 盘点方案查询
        checkSolutionQuery: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/checkSolution/query',
                method: 'post',
                data
            })
        },
        // 盘点方案修改
        checkSolutionUpdate: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/checkSolution/update',
                method: 'post',
                data
            })
        },
        // 盘点方案删除
        checkSolutionDelete: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/checkSolution/delete',
                method: 'post',
                data
            })
        },
        // 盘点方案新增
        checkSolutionSave: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/checkSolution/save',
                method: 'post',
                data
            })
        },
        // 跳转修改页面/取消修改/查询盘点方案商品清单
        checkSolutionToPage: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/checkSolution/toPage',
                method: 'post',
                data
            })
        }
    },
    // 盘点单管理
    inventoryManagement: {
        // 盘点单首页查询
        checkBillQuery: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/checkBill/query',
                method: 'post',
                data
            })
        },
        // 仓库列表
        checkBillStorehouse: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/checkBill/storehouse',
                method: 'post',
                data
            })
        },
        // 货架列表
        checkBillStorageRack: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/checkBill/storageRack',
                method: 'post',
                data
            })
        },
        // 新建盘点单号
        checkBillCreateBillCode: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/checkBill/createBillCode',
                method: 'post',
                data
            })
        },
        // 查询盘点方案
        checkBillNames: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/checkBill/names',
                method: 'post',
                data
            })
        },
        // 查询盘点商品清单列表
        checkBillCheckSolutionMerInfo: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/checkBill/checkSolutionMerInfo',
                method: 'post',
                data
            })
        },
        // 新增盘点方案
        checkBillSave: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/checkBill/save',
                method: 'post',
                data
            })
        },
    },
    // 库存转移管理
    inventoryTransfer: {
        // 库存转移管理首页查询
        moveBillFindMoveList: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/move/bill/findMoveList',
                method: 'post',
                data
            })
        },
        // 查询单据信息（点击修改，查看，新建时调用）接口
        moveBillFindMoveDetailInfo: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/move/bill/findMoveDetailInfo',
                method: 'post',
                data
            })
        },
        // 仓库/货架下拉框接口
        moveBillFindAllStorehouse: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/move/bill/findAllStorehouse',
                method: 'post',
                data
            })
        },
        // 选择商品查询商品sku列表
        moveBillFindProductList: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/move/bill/findProductList',
                method: 'post',
                data
            })
        },
    },
}
