import { formateSearch ,selectOption} from '../../util/utils';

const pageData = {};
pageData.status = {
    '全部使用状态': "",
    '已绑定': '1',
    '已消费': '2',
    '已退货': '3',
    '已停用': '4',
    '未生成': '5',
    '已作废': '6',
    '已过期': '7',
}
pageData.textShow = function (){
    let obj = {};
    for(let i in pageData.status){
        obj[pageData.status[i]] = i;
    };
    return obj;
}();
pageData.columnData = [
    { prop: 'createTime', label: '绑定时间', search: true, type: 'date' },
    { prop: 'couponNo', label: '票券编号'},
    { prop: 'couponType', label: '票券类型' },
    { prop: 'couponName', label: '票券名称' },
    { prop: 'couponAmount', label: '面值(元)' },
    { prop: 'activeTimeAndexpireTime', label: '有效期', aging:true},//activeTimeAndexpireTime
    { prop: 'activityName', label: '关联活动' },
    { prop: 'status', label: '使用状态', type: 'select', search:true, option:selectOption(pageData.status) },
]

pageData.formateSearchData = formateSearch(pageData.columnData)

export default pageData