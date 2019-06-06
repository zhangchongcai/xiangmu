import {formateSearch} from '../../util/utils';

const pageData = {}
pageData.columnData = [
    {prop:'operateTime',label:'操作时间',search:true,type:'date',width:'180'},
    {prop:'operateTypeName',label:'操作类型'},
    {prop:'oldMemberInfo',label:'操作前信息'},
    {prop:'memberInfo',label:'操作后信息'},
    {prop:'cost',label:'手续费(元)'},
    {prop:'channelName',label:'交易商户'},
    {prop:'operator',label:'操作人'},
]

pageData.formateSearchData = formateSearch(pageData.columnData)

export default pageData