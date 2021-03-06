import {formateSearch} from '../../util/utils';

const pageData = {}
pageData.columnData = [
    {prop:'outOrderNo',label:'订单编号'},
    {prop:'flowNo',label:'会员交易流水'},
    {prop:'transactionTime',label:'交易时间',search:true,type:'date'},
    {prop:'businessName',label:'交易类型'},
    {prop:'cardNo',label:'会员卡号'},
    {prop:'amount',label:'交易金额(元)'},
    {prop:'channelName',label:'交易渠道'},
    {prop:'payMethodCode',label:'支付方式'},
    {prop:'cinemaName',label:'交易影院'}
]

pageData.formateSearchData = formateSearch(pageData.columnData)

export default pageData