
const routerView = {template: '<router-view></router-view>'};

let routes = [
 
  {
    path: 'index',
    meta: {
        title: '卖品主页'
    },
    component: (resolve) => require(['cim/views/cim/index.vue'], resolve),
    name: '卖品主页'
},
// 基础设置
{
    path: 'goodsStorehouse/list',
    meta: {
        title: '仓库管理'
    },
    component: (resolve) => require(['cim/views/cim/basicSettings/goodsStorehouse/list'], resolve),
    name: '仓库管理',
},
{
    path: 'storageRack/index',
    meta: {
        title: '货架管理'
    },
    component: (resolve) => require(['cim/views/cim/basicSettings/storageRack/index'], resolve),
    name: '货架管理'
},
{
    path: 'salesLocation/index',
    meta: {
        title: '销售地点'
    },
    component: (resolve) => require(['cim/views/cim/basicSettings/salesLocation/index'], resolve),
    name: '销售地点'
},
{
    path: 'salesTerminal/index',
    meta: {
        title: '销售终端'
    },
    component: (resolve) => require(['cim/views/cim/basicSettings/salesTerminal/index'], resolve),
    name: '销售终端'
},
{
    path: 'salesType/index',
    meta: {
        title: '销售大类'
    },
    component: (resolve) => require(['cim/views/cim/basicSettings/salesType/index'], resolve),
    name: '销售大类'
},
{
    path: 'goodsCategories/index',
    meta: {
        title: '类别管理'
    },
    component: (resolve) => require(['cim/views/cim/basicSettings/goodsCategories/index'], resolve),
    name: '类别管理'
},
{
    path: 'goodsCategoriesManagement/index',
    meta: {
        title: '类别管理'
    },
    component: (resolve) => require(['cim/views/cim/basicSettings/goodsCategoriesManagement/index'], resolve),
    name: '类别管理'
},
{
    path: 'goodsUnit/index',
    meta: {
        title: '单位管理'
    },
    component: (resolve) => require(['cim/views/cim/basicSettings/goodsUnit/index'], resolve),
    name: '单位管理'
},
{
    path: 'goodsBrand/index',
    meta: {
        title: '品牌管理'
    },
    component: (resolve) => require(['cim/views/cim/basicSettings/goodsBrand/index'], resolve),
    name: '品牌管理'
},
{
    path: 'goodsUnit/index',
    meta: {
        title: '单位管理'
    },
    component: (resolve) => require(['cim/views/cim/basicSettings/goodsUnit/index'], resolve),
    name: '单位管理'
},
{
    path: 'salesAttribute/index',
    meta: {
        title: '销售属性'
    },
    component: (resolve) => require(['cim/views/cim/basicSettings/salesAttribute/index'], resolve),
    name: '销售属性'
},
// 商品资料---总部商品管理
{
    path: 'commodityInformation',
    name: '总部商品管理',
    meta: {
        title: '总部商品管理'
    },
    component: (resolve) => require(['cim/views/cim/goodsInformation/headquartersGoods/index'], resolve),
    redirect: 'commodityInformation/list',
    children: [
        // 总部商品管理
        {
            path: 'list',
            meta: {
                title: '总部商品管理'
            },
            component: (resolve) => require(['cim/views/cim/goodsInformation/headquartersGoods/list'], resolve),
            name: '总部商品管理'
        },
        // 总部商品管理
        {
            path: 'comPosite',
            meta: {
                title: '合成品'
            },
            component: (resolve) => require(['cim/views/cim/goodsInformation/headquartersGoods/comPosite/common.vue'], resolve),
            name: '合成品'
        },
        {
            path: 'comSingle',
            meta: {
                title: '单品'
            },
            component: (resolve) => require(['cim/views/cim/goodsInformation/headquartersGoods/comSingle/common.vue'], resolve),
            name: '单品'
        },
        {
            path: 'serveGood',
            meta: {
                title: '服务商品'
            },
            component: (resolve) => require(['cim/views/cim/goodsInformation/headquartersGoods/serveGood/common.vue'], resolve),
            name: '服务商品'
        },
        {
            path: 'comMaterial',
            meta: {
                title: '原材料'
            },
            component: (resolve) => require(['cim/views/cim/goodsInformation/headquartersGoods/comMaterial/common.vue'], resolve),
            name: '原材料'
        },
        {
            path: 'setMeal',
            meta: {
                title: '套餐'
            },
            component: (resolve) => require(['cim/views/cim/goodsInformation/headquartersGoods/setMeal/common.vue'], resolve),
            name: '套餐'
        },
    ],
},// 商品资料---门店商品管理
{
    path: 'commodityInformationStore',
    name: '门店商品管理',
    meta: {
        title: '门店商品管理'
    },
    component: (resolve) => require(['cim/views/cim/goodsInformation/storequartersGoods/index'], resolve),
    redirect: 'commodityInformationStore/list',
    children: [
        // 门店商品管理
        {
            path: 'list',
            meta: {
                title: '门店商品管理'
            },
            component: (resolve) => require(['cim/views/cim/goodsInformation/storequartersGoods/list'], resolve),
            name: '门店商品管理'
        },
        // 门店商品管理
        {
            path: 'comPosite',
            meta: {
                title: '合成品'
            },
            component: (resolve) => require(['cim/views/cim/goodsInformation/storequartersGoods/comPosite/common.vue'], resolve),
            name: '合成品'
        },
        {
            path: 'comSingle',
            meta: {
                title: '单品'
            },
            component: (resolve) => require(['cim/views/cim/goodsInformation/storequartersGoods/comSingle/common.vue'], resolve),
            name: '单品'
        },
        {
            path: 'serveGood',
            meta: {
                title: '服务商品'
            },
            component: (resolve) => require(['cim/views/cim/goodsInformation/storequartersGoods/serveGood/common.vue'], resolve),
            name: '服务商品'
        },
        {
            path: 'comMaterial',
            meta: {
                title: '原材料'
            },
            component: (resolve) => require(['cim/views/cim/goodsInformation/storequartersGoods/comMaterial/common.vue'], resolve),
            name: '原材料'
        },
        {
            path: 'setMeal',
            meta: {
                title: '套餐'
            },
            component: (resolve) => require(['cim/views/cim/goodsInformation/storequartersGoods/setMeal/common.vue'], resolve),
            name: '套餐'
        },
    ],
},
];

export default routes;