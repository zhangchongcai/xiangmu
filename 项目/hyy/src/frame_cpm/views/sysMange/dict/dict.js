// 前端字典 整体文件
var feDicts = [{
    "code": "orst_consumer_consumer_type", // 客户类型
    "dictItems": [{
        "id": 1,
        "code": "1",
        "name": "影管",
        "status": 1,
        "mainCode": "orst_consumer_consumer_type"
            // 临时注释其余3个
            // , {
            //     "id": 2,
            //     "code": "2",
            //     "name": "院线",
            //     "status": 1,
            //     "mainCode": "orst_consumer_consumer_type"
            // }, {
            //     "id": 3,
            //     "code": "3",
            //     "name": "发行",
            //     "status": 1,
            //     "mainCode": "orst_consumer_consumer_type"
            // }, {
            //     "id": 4,
            //     "code": "4",
            //     "name": "零售",
            //     "status": 1,
            //     "mainCode": "orst_consumer_consumer_type"
            // }
    }]
}, {
    "code": "orst_consumer_status", // 客户状态
    "dictItems": [{
        "id": 5,
        "code": "1",
        "name": "未启用",
        "status": 1,
        "mainCode": "orst_consumer_status"
    }, {
        "id": 6,
        "code": "2",
        "name": "启用中",
        "status": 1,
        "mainCode": "orst_consumer_status"
    }, {
        "id": 7,
        "code": "3",
        "name": "已启用",
        "status": 1,
        "mainCode": "orst_consumer_status"
    }, {
        "id": 8,
        "code": "4",
        "name": "已禁用",
        "status": 1,
        "mainCode": "orst_consumer_status"
    }]
}, {
    "code": "resource_sys_code",
    "dictItems": [{
        "id": 9,
        "code": "CRM",
        "name": "会员",
        "status": 1,
        "mainCode": "resource_sys_code"
    }, {
        "id": 10,
        "code": "CTM",
        "name": "票务",
        "status": 1,
        "mainCode": "resource_sys_code"
    }, {
        "id": 11,
        "code": "RPT",
        "name": "报表",
        "status": 1,
        "mainCode": "resource_sys_code"
    }, {
        "id": 12,
        "code": "CMM",
        "name": "营销",
        "status": 1,
        "mainCode": "resource_sys_code"
    }, {
        "id": 13,
        "code": "SYSTEM",
        "name": "系统设置",
        "status": 1,
        "mainCode": "resource_sys_code"
    }]
}]
let productTypedict = {
    "code": "productType_code",
    "dictItems": [{
        "id": 9,
        "code": "1",
        "name": "慧影云",
        "status": 1,
        "mainCode": "resource_sys_code"
    }, {
        "id": 10,
        "code": "2",
        "name": "pos机",
        "status": 1,
        "mainCode": "resource_sys_code"
    }, {
        "id": 11,
        "code": "3",
        "name": "移动端",
        "status": 1,
        "mainCode": "resource_sys_code"
    }]
}
feDicts.push(productTypedict)
let authStatusdict = {
    "code": "authStatus_code",
    "dictItems": [{
        "id": 9,
        "code": "1",
        "name": "未启用",
        "status": 1,
        "mainCode": "resource_sys_code"
    }, {
        "id": 10,
        "code": "2",
        "name": "已启用",
        "status": 1,
        "mainCode": "resource_sys_code"
    }, {
        "id": 11,
        "code": "3",
        "name": "已禁用",
        "status": 1,
        "mainCode": "resource_sys_code"
    }, {
        "id": 9,
        "code": "4",
        "name": "已过期",
        "status": 1,
        "mainCode": "resource_sys_code"
    }]
}
feDicts.push(authStatusdict)


export default feDicts;