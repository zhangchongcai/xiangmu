import { formateSearch ,selectOption} from '../../util/utils';

const pageData = {};
const status = {
    '全部使用状态': "",
    '已使用': 'USED',
    '未使用': 'NOUSE'
}
pageData.columnData = [
    { prop: 'createTime', label: '绑定时间', search: true, type: 'date' },
    { prop: 'couponNo', label: '票券编号' },
    { prop: 'couponName', label: '票券类型' },
    { prop: 'couponName', label: '票券名称' },
    { prop: 'couponNum', label: '面值(元)' },
    { prop: 'startTimeAndEndTime', label: '有效期', width: '200', aging:true},
    { prop: 'activityName', label: '关联活动' },
    { prop: 'status', label: '使用状态', type: 'select', search:true, option:selectOption(status) },
]

pageData.formateSearchData = formateSearch(pageData.columnData)

export default pageData