import axios from 'frame_cpm/http/api';
let cimRegion = '/cim'
// let cimRegion = ''
export default {
    // 总部商品
    headquartersGoods: {
        // 总部查询接口
        goodsDataQueryGoodsList: data => {
            return axios({
                url: cimRegion + '/goodsData/queryGoodsList',
                method: 'post',
                data
            })
        },
        // 新建sku
        singleProductCreateSku: data => {
            return axios({
                url: cimRegion + '/singleProduct/createSku',
                method: 'post',
                data
            })
        },
        // 新建单品
        singleProductSave: data => {
            return axios({
                url: cimRegion + '/singleProduct/save',
                method: 'post',
                data
            })
        },
        // 查看单品
        singleProductGet: data => {
            return axios({
                url: cimRegion + '/singleProduct/get',
                method: 'post',
                data
            })
        },
        // 修改单品
        singleProductUpdate: data => {
            return axios({
                url: cimRegion + '/singleProduct/update',
                method: 'post',
                data
            })
        },
        // 新建原材料
        merRawStockSave: data => {
            return axios({
                url: cimRegion +'/mer/rawStock/save',
                method: 'post',
                data
            })
        },
        // 查看原材料
        MerRawStockQuery: data => {
            return axios({
                url: cimRegion +'/mer/rawStock/query',
                method: 'post',
                data
            })
        },
        // 修改原材料
        merRawStockUpdate: data => {
            return axios({
                url: cimRegion +'/mer/rawStock/update',
                method: 'post',
                data
            })
        },
        // 基本单位/采购单位
        merUnitList: data => {
            return axios({
                url: cimRegion + '/mer/unit/list',
                method: 'post',
                data
            })
        },
        // 商品编码
        singleProductCreateMerCode: data => {
            return axios({
                url: cimRegion + '/singleProduct/createMerCode',
                method: 'post',
                data
            })
        },
        // 新增原材料
        merRawStockSave: data => {
            return axios({
                url: cimRegion + '/mer/rawStock/save',
                method: 'post',
                data
            })
        },
        // 获取原材料列表接口
        synproFindSemifinishedMater: data => {
            return axios({
                url: cimRegion + '/synpro/findSemifinishedMater',
                method: 'post',
                data
            })
        },
        // 新建合成品
        synproSaveSyntheticProduct: data => {
            return axios({
                url: cimRegion + '/synpro/saveSyntheticProduct',
                method: 'post',
                data
            })
        },
        // 获取基本单位
        synproFindUnitList: data => {
            return axios({
                url: cimRegion + '/synpro/findUnitList',
                method: 'post',
                data
            })
        },
        // 选择商品分类
        setmeaLoadCategoies: data => {
            return axios({
                url: cimRegion + '/setmeal/loadCategoies',
                method: 'post',
                data
            })
        },
        // 修改合成品
        synproUpdateSyntheticProduct: data => {
            return axios({
                url: cimRegion + 'synpro/updateSyntheticProduct',
                method: 'post',
                data
            })
        },
        // 查看合成品
        synproQuerySyntheticProduct: data => {
            return axios({
                url: cimRegion + '/synpro/querySyntheticProduct',
                method: 'post',
                data
            })
        },
        // 查看销售属性
        singleProductQueryAttribute: data => {
            return axios({
                url: cimRegion + '/singleProduct/queryAttribute',
                method: 'post',
                data
            })
        },
        // 选择原材料组合sku信息接口
        synproTrycombinationSku: data => {
            return axios({
                url: cimRegion + '/synpro/trycombinationSku',
                method: 'post',
                data
            })
        },
        // 新建服务商品
        merServiceGoodsSave: data => {
            return axios({
                url: cimRegion + '/mer/serviceGoods/save',
                method: 'post',
                data
            })
        },
        // 修改服务商品
        merServiceGoodsUpdate: data => {
            return axios({
                url: cimRegion + '/mer/serviceGoods/update',
                method: 'post',
                data
            })
        },
        // 查看服务商品
        merServiceGoodsQuery: data => {
            return axios({
                url: cimRegion + '/mer/serviceGoods/query',
                method: 'post',
                data
            })
        },
        // 根据商品分类查询品牌列表
        classBrandQuery: data => {
            return axios({
                url: cimRegion + '/class/brand/query',
                method: 'post',
                data
            })
        },
   
        // 新增套餐
        setmealSave: data => {
            return axios({
                url: cimRegion + '/setmeal/save',
                method: 'post',
                data
            })
        },
        // 新增前选择的分类
        setmealLoadCategoies: data => {
            return axios({
                url: cimRegion + '/setmeal/loadCategoies',
                method: 'post',
                data
            })
        },
        // 新增与修改页面数据填充
        setmealToPage: data => {
            return axios({
                url: cimRegion + '/setmeal/toPage',
                method: 'post',
                data
            })
        },
        // 获取套餐商品及可选商品
        setmealLoadItems: data => {
            return axios({
                url: cimRegion + '/setmeal/loadItems',
                method: 'post',
                data
            })
        },
        // 查看套餐
        setmealQuery: data => {
            return axios({
                url: cimRegion + '/setmeal/query',
                method: 'post',
                data
            })
        },
        // 查总部所有启用渠道
        queryBaseChannel: data => {
            return axios({
                url: cimRegion + '/singleProduct/queryBaseChannel',
                method: 'post',
                data
            })
        },
        // 首页删除
        goodsDataDeleteMerByUid: data => {
            return axios({
                url: cimRegion + '/goodsData/deleteMerByUid',
                method: 'post',
                data
            })
        },
        // 首页禁用
        goodsDataUpdateMerStatusByUid: data => {
            return axios({
                url: cimRegion + '/goodsData/updateMerStatusByUid',
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
                url: cimRegion + '/synpro/updateCinemaSynthetic',
                method: 'post',
                data
            })
        },
        // 查看合成品
        synproqueryCinemaSynthetic: data => {
            return axios({
                url: cimRegion + '/synpro/queryCinemaSynthetic',
                method: 'post',
                data
            })
        },
        // 修改服务商品
        cinemaServiceGoodsUpdate: data => {
            return axios({
                url: cimRegion + '/cinema/serviceGoods/update',
                method: 'post',
                data
            })
        },
        // 查看服务商品
        cinemaServiceGoodsQuery: data => {
            return axios({
                url: cimRegion + '/cinema/serviceGoods/query',
                method: 'post',
                data
            })
        },
        // 首页查询
        goodsDataQueryCinemaGoodsList: data => {
            return axios({
                url: cimRegion + '/goodsData/queryCinemaGoodsList',
                method: 'post',
                data
            })
        }, 
        // 查看原材料
        cinemaRawStockQuery: data => {
            return axios({
                url: cimRegion + '/cinema/rawStock/query',
                method: 'post',
                data
            })
        },
        // 修改原材料
        cinemaRawStockUpdate: data => {
            return axios({
                url: cimRegion + '/cinema/rawStock/update',
                method: 'post',
                data
            })
        },// 查询套餐
        cinmaSetmealQuery: data => {
            return axios({
                url: cimRegion + '/cinmaSetmeal/query',
                method: 'post',
                data
            })
        },// 修改套餐
        cinmaSetmealSave: data => {
            return axios({
                url: cimRegion + '/cinmaSetmeal/save',
                method: 'post',
                data
            })
        },// 查看单品
        singleProductGetCinema: data => {
            return axios({
                url: cimRegion + '/singleProduct/getCinema',
                method: 'post',
                data
            })
        },// 修改单品
        singleProductUpdateCinema: data => {
            return axios({
                url: cimRegion + '/singleProduct/updateCinema',
                method: 'post',
                data
            })
        }
    },
}
