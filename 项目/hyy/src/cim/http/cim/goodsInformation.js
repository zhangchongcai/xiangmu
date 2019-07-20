import axios from 'frame_cpm/http/api';
import config from '../config';
export default {
    // 总部商品
    headquartersGoods: {
        // 总部查询接口
        goodsDataQueryGoodsList: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/goodsData/queryGoodsList',
                method: 'post',
                data
            })
        },
        // 新建sku
        singleProductCreateSku: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/singleProduct/createSku',
                method: 'post',
                data
            })
        },
        // 新建单品
        singleProductSave: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/singleProduct/save',
                method: 'post',
                data
            })
        },
        // 查看单品
        singleProductGet: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/singleProduct/get',
                method: 'post',
                data
            })
        },
        // 修改单品
        singleProductUpdate: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/singleProduct/update',
                method: 'post',
                data
            })
        },
        // 新建原材料
        merRawStockSave: data => {
            return axios({
                baseURL:config.baseURL,
                url:'/mer/rawStock/save',
                method: 'post',
                data
            })
        },// 新建原材料
        querySalePlace: data => {
            return axios({
                baseURL:config.baseURL,
                url:'/singleProduct/querySalePlace',
                method: 'post',
                data
            })
        },
        // 查看原材料
        MerRawStockQuery: data => {
            return axios({
                baseURL:config.baseURL,
                url:'/mer/rawStock/query',
                method: 'post',
                data
            })
        },
        // 修改原材料
        merRawStockUpdate: data => {
            return axios({
                baseURL:config.baseURL,
                url:'/mer/rawStock/update',
                method: 'post',
                data
            })
        },
        // 基本单位/采购单位
        merUnitList: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/mer/unit/list',
                method: 'post',
                data
            })
        },
        // 品牌管理列表
        merBandList: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/mer/brand/list',
                method: 'post',
                data
            })
        },
        // 商品编码
        singleProductCreateMerCode: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/singleProduct/createMerCode',
                method: 'post',
                data
            })
        },
        // 获取原材料列表接口
        synproFindSemifinishedMater: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/synpro/findSemifinishedMater',
                method: 'post',
                data
            })
        },
        // 新建合成品
        synproSaveSyntheticProduct: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/synpro/saveSyntheticProduct',
                method: 'post',
                data
            })
        },
        // 获取基本单位
        synproFindUnitList: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/synpro/findUnitList',
                method: 'post',
                data
            })
        },
        // 选择商品分类
        setmeaLoadCategoies: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/category/trees',
                method: 'post',
                data
            })
        },
        // 修改合成品
        synproUpdateSyntheticProduct: data => {
            return axios({
                baseURL:config.baseURL,
                url: 'synpro/updateSyntheticProduct',
                method: 'post',
                data
            })
        },
        // 查看合成品
        synproQuerySyntheticProduct: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/synpro/querySyntheticProduct',
                method: 'post',
                data
            })
        },
        // 查看销售属性
        singleProductQueryAttribute: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/singleProduct/queryAttribute',
                method: 'post',
                data
            })
        },
        // 选择原材料组合sku信息接口
        synproTrycombinationSku: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/synpro/trycombinationSku',
                method: 'post',
                data
            })
        },
        // 新建服务商品
        merServiceGoodsSave: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/mer/serviceGoods/save',
                method: 'post',
                data
            })
        },
        // 修改服务商品
        merServiceGoodsUpdate: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/mer/serviceGoods/update',
                method: 'post',
                data
            })
        },
        // 查看服务商品
        merServiceGoodsQuery: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/mer/serviceGoods/query',
                method: 'post',
                data
            })
        },
        // 根据商品分类查询品牌列表
        classBrandQuery: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/class/brand/query',
                method: 'post',
                data
            })
        },

        // 新增套餐
        setmealSave: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/setmeal/save',
                method: 'post',
                data
            })
        },
        // 新增前选择的分类
        setmealLoadCategoies: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/setmeal/loadCategoies',
                method: 'post',
                data
            })
        },
        // 新增与修改页面数据填充
        setmealToPage: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/setmeal/toPage',
                method: 'post',
                data
            })
        },
        // 获取套餐商品及可选商品
        setmealLoadItems: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/setmeal/loadItems',
                method: 'post',
                data
            })
        },
        // 查看套餐
        setmealQuery: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/setmeal/query',
                method: 'post',
                data
            })
        },
        // 查总部所有启用渠道
        queryBaseChannel: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/singleProduct/queryBaseChannel',
                method: 'post',
                data
            })
        },
        // 首页删除
        goodsDataDeleteMerByUid: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/goodsData/deleteMerByUid',
                method: 'post',
                data
            })
        },
        // 首页禁用
        goodsDataUpdateMerStatusByUid: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/goodsData/updateMerStatusByUid',
                method: 'post',
                data
            })
        },
        // 商品库类目接口
        synproTreeAllClass: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/synpro/treeAllClass',
                method: 'post',
                data
            })
        },
        // 商品库商品分类
        synproQueryCmcProCatByClass: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/synpro/queryCmcProCatByClass',
                method: 'post',
                data
            })
        },
        // 商品列表
        synproListAllCmcMer: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/synpro/listAllCmcMer',
                method: 'post',
                data
            })
        },
        // 商品库保存
        synproSynCmcBaseMer: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/synpro/synCmcBaseMer',
                method: 'post',
                data
            })
        },
    },
    //门店商品
    storequartersGoods: {
        // 修改合成品
        synproUpdateCinemaSynthetic: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/synpro/updateCinemaSynthetic',
                method: 'post',
                data
            })
        },
        // 查看合成品
        synproqueryCinemaSynthetic: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/synpro/queryCinemaSynthetic',
                method: 'post',
                data
            })
        },
        // 修改服务商品
        cinemaServiceGoodsUpdate: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/cinema/serviceGoods/update',
                method: 'post',
                data
            })
        },
        // 查看服务商品
        cinemaServiceGoodsQuery: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/cinema/serviceGoods/query',
                method: 'post',
                data
            })
        },
        // 首页查询
        goodsDataQueryCinemaGoodsList: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/goodsData/queryCinemaGoodsList',
                method: 'post',
                data
            })
        },
        // 查看原材料
        cinemaRawStockQuery: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/cinema/rawStock/query',
                method: 'post',
                data
            })
        },
        // 修改原材料
        cinemaRawStockUpdate: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/cinema/rawStock/update',
                method: 'post',
                data
            })
        },// 查询套餐
        cinmaSetmealQuery: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/cinmaSetmeal/query',
                method: 'post',
                data
            })
        },// 修改套餐
        cinmaSetmealSave: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/cinmaSetmeal/save',
                method: 'post',
                data
            })
        },// 查看单品
        singleProductGetCinema: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/singleProduct/getCinema',
                method: 'post',
                data
            })
        },// 修改单品
        singleProductUpdateCinema: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/singleProduct/updateCinema',
                method: 'post',
                data
            })
        },
        // 门店禁用
        soreDataUpdateMerStatusByUid: data => {
            return axios({
                baseURL:config.baseURL,
                url: '/goodsData/updateCinMerStatusByUid',
                method: 'post',
                data
            })
        },
    },
}
