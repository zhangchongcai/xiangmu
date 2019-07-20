
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
        title: '类目管理'
    },
    component: (resolve) => require(['cim/views/cim/basicSettings/goodsCategories/index'], resolve),
    name: '类目管理'
},
{
    path: 'goodsCategoriesManagement/index',
    meta: {
        title: '商品分类管理'
    },
    component: (resolve) => require(['cim/views/cim/basicSettings/goodsCategoriesManagement/index'], resolve),
    name: '商品分类管理'
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
},
// 商品资料---门店商品管理
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
 // 采购管理
{
    path: 'procurement',
    name: '采购管理',
    meta: {
        title: '采购管理'
    },
    component: (resolve) => require(['cim/views/cim/procurement/index'], resolve),
    redirect: 'procurement',
    children: [
        // 供应商管理
        {
            path: 'suppliers',
            meta: {
                title: '供应商管理'
            },
            component: (resolve) => require(['cim/views/cim/procurement/suppliers/index'], resolve),
            name: '供应商管理',
            redirect: 'suppliers/list',
            children: [
                {
                    path: 'list',
                    meta: {
                        title: '供应商管理'
                    },
                    component: (resolve) => require(['cim/views/cim/procurement/suppliers/list'], resolve),
                    name: '供应商管理'
                },
                {
                    path: 'common',
                    meta: {
                        title: '供应商管理'
                    },
                    component: (resolve) => require(['cim/views/cim/procurement/suppliers/common'], resolve),
                    name: '供应商管理'
                },
            ]
        },
        // 采购协议管理
        {
            path: 'purchaseProtocol',
            meta: {
                title: '采购协议管理',
            },
            component: (resolve) => require(['cim/views/cim/procurement/purchaseProtocol/index'], resolve),
            name: '采购协议管理',
            redirect: 'purchaseProtocol/list',
            children: [
                {
                    path: 'list',
                    meta: {
                        title: '采购协议管理',
                    },
                    component: (resolve) => require(['cim/views/cim/procurement/purchaseProtocol/list'], resolve),
                    name: '采购协议管理'
                },
                {
                    path: 'common',
                    meta: {
                        title: '采购协议管理'
                    },
                    component: (resolve) => require(['cim/views/cim/procurement/purchaseProtocol/common'], resolve),
                    name: '采购协议管理'
                },
            ]
        },
        // 采购单管理
        {
            path: 'purchaseNote',
            meta: {
                title: '采购单管理',
            },
            component: (resolve) => require(['cim/views/cim/procurement/purchaseNote/index'], resolve),
            redirect: 'purchaseNote/list',
            children: [
                {
                    path: 'list',
                    meta: {
                        title: '采购单管理',
                    },
                    component: (resolve) => require(['cim/views/cim/procurement/purchaseNote/list'], resolve),
                    name:"采购单管理"
                },
                {
                    path: 'common',
                    meta: {
                        title: ''
                    },
                    component: (resolve) => require(['cim/views/cim/procurement/purchaseNote/common'], resolve),
                    name:""
                },
            ]
        },
        // 采购入库单管理
        {
            path: 'purchaseStorage',
            meta: {
                title: '采购入库单管理'
            },
            component: (resolve) => require(['cim/views/cim/procurement/purchaseStorage/index'], resolve),
            name: '采购入库单管理',
            redirect: 'purchaseStorage/list',
            children: [
                {
                    path: 'list',
                    meta: {
                        title: '采购入库单管理'
                    },
                    component: (resolve) => require(['cim/views/cim/procurement/purchaseStorage/list'], resolve),
                    name: '采购入库单管理'
                },
                {
                    path: 'common',
                    meta: {
                        title: '采购入库单管理'
                    },
                    component: (resolve) => require(['cim/views/cim/procurement/purchaseStorage/common'], resolve),
                    name: '采购入库单管理'
                },
            ]
        },
        // 采购退货单管理
        {
            path: 'purchaseReturn',
            meta: {
                title: '采购退货单管理'
            },
            component: (resolve) => require(['cim/views/cim/procurement/purchaseReturn/index'], resolve),
            name: '采购退货单管理',
            redirect: 'purchaseReturn/list',
            children: [
                {
                    path: 'list',
                    meta: {
                        title: '采购单退货管理'
                    },
                    component: (resolve) => require(['cim/views/cim/procurement/purchaseReturn/list'], resolve),
                    name: '采购退货单管理'
                },
                {
                    path: 'common',
                    meta: {
                        title: '采购退货单管理'
                    },
                    component: (resolve) => require(['cim/views/cim/procurement/purchaseReturn/common.vue'], resolve),
                    name: '采购退货单管理'
                },
            ]
        },
    ],
},
//零售POS设置
{
    path: 'retailPosSetting/terminalGoods/index',
    name: '零售终端常用商品设置',
    meta: {
        title: '零售终端常用商品设置'
    },
    component: (resolve) => require(['cim/views/cim/retailPosSetting/terminalGoods/index'], resolve),
    // redirect: 'terminalGoods/index',
    children: [

    ]
},
//零售POS设置
{
    path: 'retailPosSetting/terminalClassify/index',
    name: '零售终端分类商品设置',
    meta: {
        title: '零售终端分类商品设置'
    },
    component: (resolve) => require(['cim/views/cim/retailPosSetting/terminalClassify/index'], resolve),
    // redirect: 'terminalGoods/index',
    children: []
},
//商品标签打印设置
{
    path: 'retailPosSetting/tagPrinting',
    name: '商品标签打印设置',
    meta: {
        title: '商品标签打印设置'
    },
    component: (resolve) => require(['cim/views/cim/retailPosSetting/tagPrinting/index'], resolve),
    redirect: 'retailPosSetting/tagPrinting/list',
    children: [
        {
            path: 'list',
            meta: {
                title: '商品标签打印设置'
            },
            component: (resolve) => require(['cim/views/cim/retailPosSetting/tagPrinting/list'], resolve),
            name: '商品标签打印设置'
        },
    ]
},
//商品积分兑换设置  path: 'retailPosSetting/creditsExchange'
// 库存管理
{
    path: 'InventoryManagement',
    name: '库存管理',
    meta: {
        title: '库存管理'
    },
    component: (resolve) => require(['cim/views/cim/InventoryManagement/index'], resolve),
    redirect: 'InventoryManagement',
    children: [
        // 库存管理入库登记
        {
            path: 'goodsWarehousingIn',
            meta: {
                title: '库存管理入库登记'
            },
            component: (resolve) => require(['cim/views/cim/InventoryManagement/goodsWarehousingIn/index'], resolve),
            name: '库存管理入库登记',
            redirect: 'goodsWarehousingIn/list',
            children: [
                // 库存管理入库登记
                {
                    path: 'list',
                    meta: {
                        title: '库存管理入库登记'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/goodsWarehousingIn/list'], resolve),
                    name: '库存管理入库登记'
                },
                {
                    path: 'return',
                    meta: {
                        title: '领用退回入库'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/goodsWarehousingIn/return'], resolve),
                    name: '领用退回入库'
                },
                {
                    path: 'inventory',
                    meta: {
                        title: '盘点赔偿入库'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/goodsWarehousingIn/inventory'], resolve),
                    name: '盘点赔偿入库'
                },
                {
                    path: 'warehousing',
                    meta: {
                        title: '调拨入库'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/goodsWarehousingIn/warehousing'], resolve),
                    name: '调拨入库'
                },
            ]
        },
        // 库存管理出库登记
        {
            path: 'goodsWarehousingOut',
            meta: {
                title: '库存管理出库登记'
            },
            component: (resolve) => require(['cim/views/cim/InventoryManagement/goodsWarehousingOut/index'], resolve),
            name: '库存管理出库登记',
            redirect: 'goodsWarehousingOut/list',
            children: [
                // 库存管理入库登记
                {
                    path: 'list',
                    meta: {
                        title: '库存管理出库登记'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/goodsWarehousingOut/list'], resolve),
                    name: '库存管理出库登记'
                },
                {
                    path: 'return',
                    meta: {
                        title: '领用出库'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/goodsWarehousingOut/return'], resolve),
                    name: '领用出库'
                },
                {
                    path: 'inventory',
                    meta: {
                        title: '报损出库'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/goodsWarehousingOut/inventory'], resolve),
                    name: '报损出库'
                },
                {
                    path: 'warehousing',
                    meta: {
                        title: '调拨出库'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/goodsWarehousingOut/warehousing'], resolve),
                    name: '调拨出库'
                },
            ]
        },
        // 库存转移管理
        {
            path: 'inventoryTransfer',
            meta: {
                title: '库存转移管理'
            },
            component: (resolve) => require(['cim/views/cim/InventoryManagement/inventoryTransfer/index'], resolve),
            name: '库存转移管理',
            redirect: 'inventoryTransfer/list',
            children: [
                // 库存管理入库登记
                {
                    path: 'list',
                    meta: {
                        title: '库存转移管理'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/inventoryTransfer/list'], resolve),
                    name: '库存转移管理'
                },
                {
                    path: 'common',
                    meta: {
                        title: '库存转移管理'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/inventoryTransfer/common'], resolve),
                    name: '库存转移管理'
                }
            ]
        },
        // 盘点方案管理
        {
            path: 'inventoryPlan',
            meta: {
                title: '盘点方案管理'
            },
            component: (resolve) => require(['cim/views/cim/InventoryManagement/inventoryPlan/index'], resolve),
            name: '盘点方案管理',
            redirect: 'inventoryPlan/list',
            children: [
                // 库存管理入库登记
                {
                    path: 'list',
                    meta: {
                        title: '盘点方案管理'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/inventoryPlan/list'], resolve),
                    name: '盘点方案管理'
                },
                {
                    path: 'common',
                    meta: {
                        title: '盘点方案'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/inventoryPlan/common'], resolve),
                    name: '盘点方案'
                }
            ]
        },
        // 盘点单管理
        {
            path: 'inventoryManagement',
            meta: {
                title: '盘点单管理'
            },
            component: (resolve) => require(['cim/views/cim/InventoryManagement/inventoryManagement/index'], resolve),
            name: '盘点单管理',
            redirect: 'inventoryManagement/list',
            children: [
                // 库存管理入库登记
                {
                    path: 'list',
                    meta: {
                        title: '盘点单管理'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/inventoryManagement/list'], resolve),
                    name: '盘点单管理'
                },
                {
                    path: 'common',
                    meta: {
                        title: '盘点单'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/inventoryManagement/common'], resolve),
                    name: '盘点单'
                },
                {
                    path: 'commonSee',
                    meta: {
                        title: '盘点单'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/inventoryManagement/commonSee'], resolve),
                    name: '盘点单'
                }
            ]
        },        
        // 门店商品库存查询
        {
            path: 'storeInventoryQuery',
            meta: {
                title: '门店商品库存查询'
            },
            component: (resolve) => require(['cim/views/cim/InventoryManagement/storeInventoryQuery/index'], resolve),
            name: '门店商品库存查询',
            redirect: 'storeInventoryQuery/list',
            children: [
                // 库存管理入库登记
                {
                    path: 'list',
                    meta: {
                        title: '门店商品库存查询'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/storeInventoryQuery/list'], resolve),
                    name: '门店商品库存查询'
                }
            ]
        },
        // 调拨申请
        {
            path: 'goodsWarehousingApply',
            meta: {
                title: '调拨申请'
            },
            component: (resolve) => require(['cim/views/cim/InventoryManagement/goodsWarehousingApply/index'], resolve),
            name: '调拨申请',
            redirect: 'goodsWarehousingApply/list',
            children: [
                // 库存管理入库登记
                {
                    path: 'list',
                    meta: {
                        title: '调拨申请'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/goodsWarehousingApply/list'], resolve),
                    name: '调拨申请'
                },
                {
                    path: 'common',
                    meta: {
                        title: '调拨申请单'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/goodsWarehousingApply/common'], resolve),
                    name: '调拨申请单'
                }
            ]
        },
        // 门店商品库存分析
        {
            path: 'storeInventoryAnalysis',
            meta: {
                title: '门店商品库存分析'
            },
            component: (resolve) => require(['cim/views/cim/InventoryManagement/storeInventoryAnalysis/index'], resolve),
            name: '门店商品库存分析',
            redirect: 'storeInventoryAnalysis/list',
            children: [
                // 库存管理入库登记
                {
                    path: 'list',
                    meta: {
                        title: '门店商品库存分析'
                    },
                    component: (resolve) => require(['cim/views/cim/InventoryManagement/storeInventoryAnalysis/list'], resolve),
                    name: '门店商品库存分析'
                }
            ]
        },
    ],
},
];

export default routes;