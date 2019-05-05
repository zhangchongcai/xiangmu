import axios from '../api';

export default {
    // 总部商品
    headquartersGoods: {
        // 获取原材料列表接口
        synproFindSemifinishedMater: data => {
            return axios({
                url: '/synpro/findSemifinishedMater',
                method: 'post',
                data
            })
        },
        // 新建合成品
        synproSaveSyntheticProduct: data => {
            return axios({
                url: '/synpro/saveSyntheticProduct',
                method: 'post',
                data
            })
        },
    }
}
