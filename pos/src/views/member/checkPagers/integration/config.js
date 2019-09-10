import {formateSearch} from '../../util/utils';

const pageData = {}
pageData.columnData = [
    {prop:'flowNo',label:'交易编号'},
    {prop:'transactionTime',label:'交易时间',search:true,type:'date'},
    {prop:'integral',label:'积分数量'},
    {prop:'integralTypeDesc',label:'积分交易类型'},
    {prop:'channelName',label:'交易渠道'},
    {prop:'cinemaName',label:'交易影院'},
    {prop:'operator',label:'操作人'}
]

pageData.formateSearchData = formateSearch(pageData.columnData)

export default pageData