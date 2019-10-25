const cimRoutes = [
  {
    path: 'index',
    meta: {
      title: '卖品主页'
    },
    component: resolve => require(['cimSrc/views/cim/index.vue'], resolve),
    name: '卖品主页'
  },
  // 基础设置
  {
    path: 'goodsStorehouse/list',
    meta: {
      title: '仓库管理'
    },
    component: resolve =>
      require(['cimSrc/views/cim/basicSettings/goodsStorehouse/list'], resolve),
    name: '仓库管理'
  },
  {
    path: 'storageRack/index',
    meta: {
      title: '货架管理'
    },
    component: resolve =>
      require(['cimSrc/views/cim/basicSettings/storageRack/index'], resolve),
    name: '货架管理'
  },
  {
    path: 'salesLocation/index',
    meta: {
      title: '销售地点'
    },
    component: resolve =>
      require(['cimSrc/views/cim/basicSettings/salesLocation/index'], resolve),
    name: '销售地点'
  },
  {
    path: 'salesTerminal/index',
    meta: {
      title: '销售终端'
    },
    component: resolve =>
      require(['cimSrc/views/cim/basicSettings/salesTerminal/index'], resolve),
    name: '销售终端'
  },
  {
    path: 'salesType/index',
    meta: {
      title: '销售大类'
    },
    component: resolve =>
      require(['cimSrc/views/cim/basicSettings/salesType/index'], resolve),
    name: '销售大类'
  },
  {
    path: 'goodsCategories/index',
    meta: {
      title: '类目管理'
    },
    component: resolve =>
      require([
        'cimSrc/views/cim/basicSettings/goodsCategories/index'
      ], resolve),
    name: '类目管理'
  },
  {
    path: 'goodsCategoriesManagement/index',
    meta: {
      title: '商品分类管理'
    },
    component: resolve =>
      require([
        'cimSrc/views/cim/basicSettings/goodsCategoriesManagement/index'
      ], resolve),
    name: '商品分类管理'
  },
  {
    path: 'goodsUnit/index',
    meta: {
      title: '单位管理'
    },
    component: resolve =>
      require(['cimSrc/views/cim/basicSettings/goodsUnit/index'], resolve),
    name: '单位管理'
  },
  {
    path: 'goodsBrand/index',
    meta: {
      title: '品牌管理'
    },
    component: resolve =>
      require(['cimSrc/views/cim/basicSettings/goodsBrand/index'], resolve),
    name: '品牌管理'
  },
  {
    path: 'goodsUnit/index',
    meta: {
      title: '单位管理'
    },
    component: resolve =>
      require(['cimSrc/views/cim/basicSettings/goodsUnit/index'], resolve),
    name: '单位管理'
  },
  {
    path: 'salesAttribute/index',
    meta: {
      title: '销售属性'
    },
    component: resolve =>
      require(['cimSrc/views/cim/basicSettings/salesAttribute/index'], resolve),
    name: '销售属性'
  },
  // 商品资料---总部商品管理
  {
    path: 'commodityInformation',
    name: '总部商品管理',
    meta: {
      title: '总部商品管理'
    },
    component: resolve =>
      require([
        'cimSrc/views/cim/goodsInformation/headquartersGoods/index'
      ], resolve),
    redirect: 'commodityInformation/list',
    children: [
      // 总部商品管理
      {
        path: 'list',
        meta: {
          title: '总部商品管理'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/list'
          ], resolve),
        name: '总部商品管理'
      },
      // 总部商品管理
      {
        path: 'comPosite',
        meta: {
          title: '合成品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/comPosite/common.vue'
          ], resolve),
        name: '合成品'
      },
      {
        path: 'comPositeadd',
        meta: {
          title: '新增合成品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/comPosite/common.vue'
          ], resolve),
        name: '新增合成品'
      },
      {
        path: 'comPositeedit',
        meta: {
          title: '编辑合成品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/comPosite/common.vue'
          ], resolve),
        name: '编辑合成品'
      },
      {
        path: 'comPositedetails',
        meta: {
          title: '查看合成品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/comPosite/common.vue'
          ], resolve),
        name: '查看合成品'
      },
      {
        path: 'comSingle',
        meta: {
          title: '单品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/comSingle/common.vue'
          ], resolve),
        name: '单品'
      },
      {
        path: 'comSingleadd',
        meta: {
          title: '新增单品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/comSingle/common.vue'
          ], resolve),
        name: '新增单品'
      },
      {
        path: 'comSingleedit',
        meta: {
          title: '编辑单品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/comSingle/common.vue'
          ], resolve),
        name: '编辑单品'
      },
      {
        path: 'comSingledetails',
        meta: {
          title: '查看单品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/comSingle/common.vue'
          ], resolve),
        name: '查看单品'
      },
      {
        path: 'serveGood',
        meta: {
          title: '服务商品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/serveGood/common.vue'
          ], resolve),
        name: '服务商品'
      },
      {
        path: 'serveGoodadd',
        meta: {
          title: '新增服务商品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/serveGood/common.vue'
          ], resolve),
        name: '新增服务商品'
      },
      {
        path: 'serveGoodedit',
        meta: {
          title: '编辑服务商品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/serveGood/common.vue'
          ], resolve),
        name: '编辑服务商品'
      },
      {
        path: 'serveGooddetails',
        meta: {
          title: '查看服务商品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/serveGood/common.vue'
          ], resolve),
        name: '查看服务商品'
      },
      {
        path: 'comMaterial',
        meta: {
          title: '原材料'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/comMaterial/common.vue'
          ], resolve),
        name: '原材料'
      },
      {
        path: 'comMaterialadd',
        meta: {
          title: '新增原材料'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/comMaterial/common.vue'
          ], resolve),
        name: '新增原材料'
      },
      {
        path: 'comMaterialedit',
        meta: {
          title: '编辑原材料'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/comMaterial/common.vue'
          ], resolve),
        name: '编辑原材料'
      },
      {
        path: 'comMaterialdetails',
        meta: {
          title: '查看原材料'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/comMaterial/common.vue'
          ], resolve),
        name: '查看原材料'
      },
      {
        path: 'setMeal',
        meta: {
          title: '套餐'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/setMeal/common.vue'
          ], resolve),
        name: '套餐'
      },
      {
        path: 'setMealadd',
        meta: {
          title: '新增套餐'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/setMeal/common.vue'
          ], resolve),
        name: '新增套餐'
      },
      {
        path: 'setMealedit',
        meta: {
          title: '编辑套餐'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/setMeal/common.vue'
          ], resolve),
        name: '编辑套餐'
      },
      {
        path: 'setMealdetails',
        meta: {
          title: '查看套餐'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/headquartersGoods/setMeal/common.vue'
          ], resolve),
        name: '查看套餐'
      }
    ]
  },

  // 商品调价单管理
  {
    path: 'changePriceBill',
    name: '商品调价单管理',
    meta: {
      title: '商品调价单管理'
    },
    component: resolve =>
      require([
        'cimSrc/views/cim/goodsInformation/changePriceBill/index'
      ], resolve),
    redirect: 'changePriceBill/list',
    children: [
      // 调价单管理列表
      {
        path: 'list',
        meta: {
          title: '商品调价单管理'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/changePriceBill/list'
          ], resolve),
        name: '商品调价单管理'
      },
      // （指定门店）调整商品售价
      {
        path: 'forGoods',
        meta: {
          title: '调整商品售价'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/changePriceBill/forGoods/common.vue'
          ], resolve),
        name: '调整商品售价'
      },
      {
        path: 'forGoodsadd',
        meta: {
          title: '新增调整商品售价'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/changePriceBill/forGoods/common.vue'
          ], resolve),
        name: '新增调整商品售价'
      },
      {
        path: 'forGoodsedit',
        meta: {
          title: '修订调整商品售价'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/changePriceBill/forGoods/common.vue'
          ], resolve),
        name: '修订调整商品售价'
      },
      {
        path: 'forGoodsdetails',
        meta: {
          title: '查看调整商品售价'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/changePriceBill/forGoods/common.vue'
          ], resolve),
        name: '查看调整商品售价'
      },
      // （指定商品）调整门店售价
      {
        path: 'forCinema',
        meta: {
          title: '调整门店售价'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/changePriceBill/forCinema/common.vue'
          ], resolve),
        name: '调整门店售价'
      },
      {
        path: 'forCinemaadd',
        meta: {
          title: '新增调整门店售价'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/changePriceBill/forCinema/common.vue'
          ], resolve),
        name: '新增调整门店售价'
      },
      {
        path: 'forCinemaedit',
        meta: {
          title: '修订调整门店售价'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/changePriceBill/forCinema/common.vue'
          ], resolve),
        name: '修订调整门店售价'
      },
      {
        path: 'forCinemadetails',
        meta: {
          title: '查看调整门店售价'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/changePriceBill/forCinema/common.vue'
          ], resolve),
        name: '查看调整门店售价'
      }
    ]
  },
  // 商品资料---门店商品管理
  {
    path: 'commodityInformationStore',
    name: '门店商品管理',
    meta: {
      title: '门店商品管理'
    },
    component: resolve =>
      require([
        'cimSrc/views/cim/goodsInformation/storequartersGoods/index'
      ], resolve),
    redirect: 'commodityInformationStore/list',
    children: [
      // 门店商品管理
      {
        path: 'list',
        meta: {
          title: '门店商品管理'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/storequartersGoods/list'
          ], resolve),
        name: '门店商品管理'
      },
      // 门店商品管理
      {
        path: 'comPosite',
        meta: {
          title: '合成品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/storequartersGoods/comPosite/common.vue'
          ], resolve),
        name: '合成品'
      },
      {
        path: 'comPositeedit',
        meta: {
          title: '编辑合成品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/storequartersGoods/comPosite/common.vue'
          ], resolve),
        name: '编辑合成品'
      },
      {
        path: 'comPositedetails',
        meta: {
          title: '查看合成品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/storequartersGoods/comPosite/common.vue'
          ], resolve),
        name: '查看合成品'
      },
      {
        path: 'comSingle',
        meta: {
          title: '单品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/storequartersGoods/comSingle/common.vue'
          ], resolve),
        name: '单品'
      },
      {
        path: 'comSingleedit',
        meta: {
          title: '编辑单品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/storequartersGoods/comSingle/common.vue'
          ], resolve),
        name: '编辑单品'
      },
      {
        path: 'comSingledetails',
        meta: {
          title: '查看单品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/storequartersGoods/comSingle/common.vue'
          ], resolve),
        name: '查看单品'
      },
      {
        path: 'serveGood',
        meta: {
          title: '服务商品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/storequartersGoods/serveGood/common.vue'
          ], resolve),
        name: '服务商品'
      },
      {
        path: 'serveGoodedit',
        meta: {
          title: '编辑服务商品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/storequartersGoods/serveGood/common.vue'
          ], resolve),
        name: '编辑服务商品'
      },
      {
        path: 'serveGooddetails',
        meta: {
          title: '查看服务商品'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/storequartersGoods/serveGood/common.vue'
          ], resolve),
        name: '查看服务商品'
      },
      {
        path: 'comMaterial',
        meta: {
          title: '原材料'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/storequartersGoods/comMaterial/common.vue'
          ], resolve),
        name: '原材料'
      },
      {
        path: 'comMaterialedit',
        meta: {
          title: '编辑原材料'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/storequartersGoods/comMaterial/common.vue'
          ], resolve),
        name: '编辑原材料'
      },
      {
        path: 'comMaterialdetails',
        meta: {
          title: '查看原材料'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/storequartersGoods/comMaterial/common.vue'
          ], resolve),
        name: '查看原材料'
      },
      {
        path: 'setMeal',
        meta: {
          title: '套餐'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/storequartersGoods/setMeal/common.vue'
          ], resolve),
        name: '套餐'
      },
      {
        path: 'setMealedit',
        meta: {
          title: '编辑套餐'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/storequartersGoods/setMeal/common.vue'
          ], resolve),
        name: '编辑套餐'
      },
      {
        path: 'setMealdetails',
        meta: {
          title: '查看套餐'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/goodsInformation/storequartersGoods/setMeal/common.vue'
          ], resolve),
        name: '查看套餐'
      }
    ]
  },
  // 采购管理
  {
    path: 'procurement',
    name: '采购管理',
    meta: {
      title: '采购管理'
    },
    component: resolve =>
      require(['cimSrc/views/cim/procurement/index'], resolve),
    redirect: 'procurement',
    children: [
      // 供应商管理
      {
        path: 'suppliers',
        meta: {
          title: '供应商管理'
        },
        component: resolve =>
          require(['cimSrc/views/cim/procurement/suppliers/index'], resolve),
        name: '供应商管理',
        redirect: 'suppliers/list',
        children: [
          {
            path: 'list',
            meta: {
              title: '供应商管理'
            },
            component: resolve =>
              require(['cimSrc/views/cim/procurement/suppliers/list'], resolve),
            name: '供应商管理'
          },
          {
            path: 'add',
            meta: {
              title: '新建供应商'
            },
            component: resolve =>
              require(['cimSrc/views/cim/procurement/suppliers/add'], resolve),
            name: '新建供应商'
          },
          {
            path: 'edit',
            meta: {
              title: '编辑供应商'
            },
            component: resolve =>
              require(['cimSrc/views/cim/procurement/suppliers/edit'], resolve),
            name: '编辑供应商'
          },
          {
            path: 'details',
            meta: {
              title: '查看供应商'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/suppliers/details'
              ], resolve),
            name: '查看供应商'
          },
          {
            path: 'common',
            meta: {
              title: '供应商管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/suppliers/common'
              ], resolve),
            name: '供应商管理'
          }
        ]
      },
      // 采购协议管理
      {
        path: 'purchaseProtocol',
        meta: {
          title: '采购协议管理'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/procurement/purchaseProtocol/index'
          ], resolve),
        name: '采购协议管理',
        redirect: 'purchaseProtocol/list',
        children: [
          {
            path: 'list',
            meta: {
              title: '采购协议管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseProtocol/list'
              ], resolve),
            name: '采购协议管理'
          },
          {
            path: 'add',
            meta: {
              title: '新建协议管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseProtocol/add'
              ], resolve),
            name: '新建协议管理'
          },
          {
            path: 'edit',
            meta: {
              title: '编辑协议管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseProtocol/edit'
              ], resolve),
            name: '编辑协议管理'
          },
          {
            path: 'details',
            meta: {
              title: '查看协议管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseProtocol/details'
              ], resolve),
            name: '查看协议管理'
          },
          {
            path: 'common',
            meta: {
              title: '采购协议管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseProtocol/common'
              ], resolve),
            name: '采购协议管理'
          }
        ]
      },
      // 采购单管理
      {
        path: 'purchaseNote',
        meta: {
          title: '采购单管理'
        },
        component: resolve =>
          require(['cimSrc/views/cim/procurement/purchaseNote/index'], resolve),
        redirect: 'purchaseNote/list',
        children: [
          {
            path: 'list',
            meta: {
              title: '采购单管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseNote/list'
              ], resolve),
            name: '采购单管理'
          },
          {
            path: 'add',
            meta: {
              title: '新建采购单'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseNote/add'
              ], resolve),
            name: '新建采购单'
          },
          {
            path: 'edit',
            meta: {
              title: '编辑采购单'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseNote/edit'
              ], resolve),
            name: '编辑采购单'
          },
          {
            path: 'details',
            meta: {
              title: '查看采购单'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseNote/details'
              ], resolve),
            name: '查看采购单'
          },
          {
            path: 'common',
            meta: {
              title: '采购单管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseNote/common'
              ], resolve),
            name: ''
          }
        ]
      },
      // 采购入库单管理
      {
        path: 'purchaseStorage',
        meta: {
          title: '入库单管理'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/procurement/purchaseStorage/index'
          ], resolve),
        name: '入库单管理',
        redirect: 'purchaseStorage/list',
        children: [
          {
            path: 'list',
            meta: {
              title: '入库单管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseStorage/list'
              ], resolve),
            name: '入库单管理'
          },
          {
            path: 'add',
            meta: {
              title: '新建入库单'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseStorage/add'
              ], resolve),
            name: '新建入库单'
          },
          {
            path: 'edit',
            meta: {
              title: '编辑入库单'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseStorage/edit'
              ], resolve),
            name: '编辑入库单'
          },
          {
            path: 'details',
            meta: {
              title: '查看入库单'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseStorage/details'
              ], resolve),
            name: '查看入库单'
          },
          {
            path: 'common',
            meta: {
              title: '入库单管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseStorage/common'
              ], resolve),
            name: '入库单管理'
          }
        ]
      },
      // 采购退货单管理
      {
        path: 'purchaseReturn',
        meta: {
          title: '采购退货单管理'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/procurement/purchaseReturn/index'
          ], resolve),
        name: '采购退货单管理',
        redirect: 'purchaseReturn/list',
        children: [
          {
            path: 'list',
            meta: {
              title: '采购退货单管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseReturn/list'
              ], resolve),
            name: '采购退货单管理'
          },
          {
            path: 'add',
            meta: {
              title: '新建采购退货单'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseReturn/add'
              ], resolve),
            name: '新建采购退货单'
          },
          {
            path: 'edit',
            meta: {
              title: '编辑采购退货单'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseReturn/edit'
              ], resolve),
            name: '编辑采购退货单'
          },
          {
            path: 'details',
            meta: {
              title: '查看采购退货单'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseReturn/details'
              ], resolve),
            name: '查看采购退货单'
          },
          {
            path: 'common',
            meta: {
              title: '采购退货单管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/procurement/purchaseReturn/common.vue'
              ], resolve),
            name: '采购退货单管理'
          }
        ]
      }
    ]
  },
  // 零售POS设置
  {
    path: 'retailPosSetting/terminalGoods/index',
    name: 'POS常用商品设置',
    meta: {
      title: 'POS常用商品设置'
    },
    component: resolve =>
      require([
        'cimSrc/views/cim/retailPosSetting/terminalGoods/index'
      ], resolve),
    // redirect: 'terminalGoods/index',
    children: []
  },
  // 零售POS设置
  {
    path: 'retailPosSetting/terminalClassify/index',
    name: 'POS商品分类设置',
    meta: {
      title: 'POS商品分类设置'
    },
    component: resolve =>
      require([
        'cimSrc/views/cim/retailPosSetting/terminalClassify/index'
      ], resolve),
    // redirect: 'terminalGoods/index',
    children: []
  },
  // 商品标签打印设置
  {
    path: 'retailPosSetting/tagPrinting',
    name: '商品标签打印设置',
    meta: {
      title: '商品标签打印设置'
    },
    component: resolve =>
      require(['cimSrc/views/cim/retailPosSetting/tagPrinting/index'], resolve),
    redirect: 'retailPosSetting/tagPrinting/list',
    children: [
      {
        path: 'list',
        meta: {
          title: '商品标签打印设置'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/retailPosSetting/tagPrinting/list'
          ], resolve),
        name: '商品标签打印设置'
      }
    ]
  },
  // 商品积分兑换设置  path: 'retailPosSetting/creditsExchange'
  {
    path: 'retailPosSetting/creditsExchange',
    name: '商品积分兑换设置',
    meta: {
      title: '商品积分兑换设置'
    },
    component: resolve =>
      require([
        'cimSrc/views/cim/retailPosSetting/creditsExchange/index'
      ], resolve),
    redirect: 'retailPosSetting/creditsExchange/list',
    children: [
      {
        path: 'list',
        meta: {
          title: '商品积分兑换设置'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/retailPosSetting/creditsExchange/list'
          ], resolve),
        name: '商品积分兑换设置'
      }
    ]
  },
  // 库存管理
  {
    path: 'InventoryManagement',
    name: '库存管理',
    meta: {
      title: '库存管理'
    },
    component: resolve =>
      require(['cimSrc/views/cim/InventoryManagement/index'], resolve),
    redirect: 'InventoryManagement',
    children: [
      // 库存管理入库登记
      {
        path: 'goodsWarehousingIn',
        meta: {
          title: '库存管理入库登记'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/InventoryManagement/goodsWarehousingIn/index'
          ], resolve),
        name: '库存管理入库登记',
        redirect: 'goodsWarehousingIn/list',
        children: [
          // 库存管理入库登记
          {
            path: 'list',
            meta: {
              title: '库存管理入库登记'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingIn/list'
              ], resolve),
            name: '库存管理入库登记'
          },
          {
            path: 'return',
            meta: {
              title: '领用退回入库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingIn/return'
              ], resolve),
            name: '领用退回入库'
          },
          {
            path: 'returnadd',
            meta: {
              title: '新增领用退回入库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingIn/return'
              ], resolve),
            name: '新增领用退回入库'
          },
          {
            path: 'returnedit',
            meta: {
              title: '编辑领用退回入库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingIn/return'
              ], resolve),
            name: '编辑领用退回入库'
          },
          {
            path: 'returndetails',
            meta: {
              title: '查看领用退回入库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingIn/return'
              ], resolve),
            name: '查看领用退回入库'
          },
          {
            path: 'inventory',
            meta: {
              title: '盘点赔偿入库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingIn/inventory'
              ], resolve),
            name: '盘点赔偿入库'
          },
          {
            path: 'inventoryadd',
            meta: {
              title: '新增盘点赔偿入库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingIn/inventory'
              ], resolve),
            name: '新增盘点赔偿入库'
          },
          {
            path: 'inventoryedit',
            meta: {
              title: '编辑盘点赔偿入库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingIn/inventory'
              ], resolve),
            name: '编辑盘点赔偿入库'
          },
          {
            path: 'inventorydetails',
            meta: {
              title: '查看盘点赔偿入库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingIn/inventory'
              ], resolve),
            name: '查看盘点赔偿入库'
          },
          {
            path: 'warehousing',
            meta: {
              title: '调拨入库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingIn/warehousing'
              ], resolve),
            name: '调拨入库'
          },
          {
            path: 'warehousingadd',
            meta: {
              title: '新增调拨入库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingIn/warehousing'
              ], resolve),
            name: '新增调拨入库'
          },
          {
            path: 'warehousingedit',
            meta: {
              title: '编辑调拨入库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingIn/warehousing'
              ], resolve),
            name: '编辑调拨入库'
          },
          {
            path: 'warehousingdetails',
            meta: {
              title: '查看调拨入库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingIn/warehousing'
              ], resolve),
            name: '查看调拨入库'
          }
        ]
      },
      // 库存管理出库登记
      {
        path: 'goodsWarehousingOut',
        meta: {
          title: '库存管理出库登记'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/InventoryManagement/goodsWarehousingOut/index'
          ], resolve),
        name: '库存管理出库登记',
        redirect: 'goodsWarehousingOut/list',
        children: [
          // 库存管理入库登记
          {
            path: 'list',
            meta: {
              title: '库存管理出库登记'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingOut/list'
              ], resolve),
            name: '库存管理出库登记'
          },
          {
            path: 'return',
            meta: {
              title: '领用出库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingOut/return'
              ], resolve),
            name: '领用出库'
          },
          {
            path: 'returnadd',
            meta: {
              title: '新增领用出库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingOut/return'
              ], resolve),
            name: '新增领用出库'
          },
          {
            path: 'returnedit',
            meta: {
              title: '编辑领用出库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingOut/return'
              ], resolve),
            name: '编辑领用出库'
          },
          {
            path: 'returndetails',
            meta: {
              title: '查看领用出库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingOut/return'
              ], resolve),
            name: '查看领用出库'
          },
          {
            path: 'inventory',
            meta: {
              title: '报损出库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingOut/inventory'
              ], resolve),
            name: '报损出库'
          },
          {
            path: 'inventoryadd',
            meta: {
              title: '新增报损出库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingOut/inventory'
              ], resolve),
            name: '新增报损出库'
          },
          {
            path: 'inventoryedit',
            meta: {
              title: '编辑报损出库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingOut/inventory'
              ], resolve),
            name: '编辑报损出库'
          },
          {
            path: 'inventorydetails',
            meta: {
              title: '查看报损出库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingOut/inventory'
              ], resolve),
            name: '查看报损出库'
          },
          {
            path: 'warehousing',
            meta: {
              title: '调拨出库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingOut/warehousing'
              ], resolve),
            name: '调拨出库'
          },
          {
            path: 'warehousingadd',
            meta: {
              title: '新增调拨出库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingOut/warehousing'
              ], resolve),
            name: '新增调拨出库'
          },
          {
            path: 'warehousingedit',
            meta: {
              title: '编辑调拨出库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingOut/warehousing'
              ], resolve),
            name: '编辑调拨出库'
          },
          {
            path: 'warehousingdetails',
            meta: {
              title: '查看调拨出库'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingOut/warehousing'
              ], resolve),
            name: '查看调拨出库'
          }
        ]
      },
      // 库存转移管理
      {
        path: 'inventoryTransfer',
        meta: {
          title: '库存转移管理'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/InventoryManagement/inventoryTransfer/index'
          ], resolve),
        name: '库存转移管理',
        redirect: 'inventoryTransfer/list',
        children: [
          // 库存管理入库登记
          {
            path: 'list',
            meta: {
              title: '库存转移管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/inventoryTransfer/list'
              ], resolve),
            name: '库存转移管理'
          },
          {
            path: 'common',
            meta: {
              title: '库存转移管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/inventoryTransfer/common'
              ], resolve),
            name: '库存转移管理'
          },
          {
            path: 'add',
            meta: {
              title: '新增库存转移管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/inventoryTransfer/common'
              ], resolve),
            name: '新增库存转移管理'
          },
          {
            path: 'edit',
            meta: {
              title: '编辑库存转移管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/inventoryTransfer/common'
              ], resolve),
            name: '编辑库存转移管理'
          },
          {
            path: 'details',
            meta: {
              title: '查看库存转移管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/inventoryTransfer/common'
              ], resolve),
            name: '查看库存转移管理'
          }
        ]
      },
      // 盘点方案管理
      {
        path: 'inventoryPlan',
        meta: {
          title: '盘点方案管理'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/InventoryManagement/inventoryPlan/index'
          ], resolve),
        name: '盘点方案管理',
        redirect: 'inventoryPlan/list',
        children: [
          // 库存管理入库登记
          {
            path: 'list',
            meta: {
              title: '盘点方案管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/inventoryPlan/list'
              ], resolve),
            name: '盘点方案管理'
          },
          {
            path: 'common',
            meta: {
              title: '盘点方案'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/inventoryPlan/common'
              ], resolve),
            name: '盘点方案'
          },
          {
            path: 'add',
            meta: {
              title: '新增盘点方案'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/inventoryPlan/common'
              ], resolve),
            name: '新增盘点方案'
          },
          {
            path: 'edit',
            meta: {
              title: '编辑盘点方案'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/inventoryPlan/common'
              ], resolve),
            name: '编辑盘点方案'
          },
          {
            path: 'details',
            meta: {
              title: '查看盘点方案'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/inventoryPlan/common'
              ], resolve),
            name: '查看盘点方案'
          }
        ]
      },
      // 盘点单管理
      {
        path: 'inventoryManagement',
        meta: {
          title: '盘点单管理'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/InventoryManagement/inventoryManagement/index'
          ], resolve),
        name: '盘点单管理',
        redirect: 'inventoryManagement/list',
        children: [
          // 库存管理入库登记
          {
            path: 'list',
            meta: {
              title: '盘点单管理'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/inventoryManagement/list'
              ], resolve),
            name: '盘点单管理'
          },
          {
            path: 'common',
            meta: {
              title: '新建盘点单'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/inventoryManagement/common'
              ], resolve),
            name: '新建盘点单'
          },
          {
            path: 'commonSee',
            meta: {
              title: '盘点单'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/inventoryManagement/commonSee'
              ], resolve),
            name: '盘点单'
          },
          {
            path: 'commonSeedetails',
            meta: {
              title: '查看盘点单'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/inventoryManagement/commonSee'
              ], resolve),
            name: '查看盘点单'
          },
          {
            path: 'commonSeehandle',
            meta: {
              title: '处理盘点单'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/inventoryManagement/commonSee'
              ], resolve),
            name: '处理盘点单'
          },
          {
            path: 'commonPrint',
            meta: {
              title: '打印空白盘点单'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/inventoryManagement/commonPrint'
              ], resolve),
            name: '打印空白盘点单'
          }
        ]
      },
      // 门店商品库存查询
      {
        path: 'storeInventoryQuery',
        meta: {
          title: '门店商品库存查询'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/InventoryManagement/storeInventoryQuery/index'
          ], resolve),
        name: '门店商品库存查询',
        redirect: 'storeInventoryQuery/list',
        children: [
          // 库存管理入库登记
          {
            path: 'list',
            meta: {
              title: '门店商品库存查询'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/storeInventoryQuery/list'
              ], resolve),
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
        component: resolve =>
          require([
            'cimSrc/views/cim/InventoryManagement/goodsWarehousingApply/index'
          ], resolve),
        name: '调拨申请',
        redirect: 'goodsWarehousingApply/list',
        children: [
          // 库存管理入库登记
          {
            path: 'list',
            meta: {
              title: '调拨申请'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingApply/list'
              ], resolve),
            name: '调拨申请'
          },
          {
            path: 'common',
            meta: {
              title: '调拨申请单'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingApply/common'
              ], resolve),
            name: '调拨申请单'
          },
          {
            path: 'add',
            meta: {
              title: '新增调拨申请单'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingApply/common'
              ], resolve),
            name: '新增调拨申请单'
          },
          {
            path: 'edit',
            meta: {
              title: '编辑调拨申请单'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingApply/common'
              ], resolve),
            name: '编辑调拨申请单'
          },
          {
            path: 'details',
            meta: {
              title: '查看调拨申请单'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/goodsWarehousingApply/common'
              ], resolve),
            name: '查看调拨申请单'
          }
        ]
      },
      // 门店商品库存分析
      {
        path: 'storeInventoryAnalysis',
        meta: {
          title: '门店商品库存分析'
        },
        component: resolve =>
          require([
            'cimSrc/views/cim/InventoryManagement/storeInventoryAnalysis/index'
          ], resolve),
        name: '门店商品库存分析',
        redirect: 'storeInventoryAnalysis/list',
        children: [
          // 库存管理入库登记
          {
            path: 'list',
            meta: {
              title: '门店商品库存分析'
            },
            component: resolve =>
              require([
                'cimSrc/views/cim/InventoryManagement/storeInventoryAnalysis/list'
              ], resolve),
            name: '门店商品库存分析'
          }
        ]
      }
    ]
  }
];
export default cimRoutes;
