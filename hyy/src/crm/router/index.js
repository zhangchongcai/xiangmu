let routes = [{
        path: "test",
        meta: {
            title: "会员测试页面"
        },
        component: resolve => require(["../views/member/Index.vue"], resolve),
        name: "会员测试页面",
        children: [{
            path: "test",
            meta: {
                title: "会员测试页面"
            },
            component: resolve =>
                require([
                    // "../dialogs/crmCardType.vue"
                    "../views/member/test/test2.vue"
                    // "../views/member/test/test.vue"
                ], resolve),
            name: "会员测试页面"
        }]
    },
    // 会员等级权益管理
    {
        path: "memberLevelEquity",
        meta: {
            title: "等级权益管理"
        },
        component: resolve => require(["../views/member/Index.vue"], resolve),
        name: "等级权益管理",
        redirect: "memberLevelEquity/detail",
        children: [{
                path: "detail",
                meta: {
                    title: "等级权益管理"
                },
                component: resolve =>
                    require([
                        "../views/member/memberLevelEquity/memberLevelEquityDetail.vue"
                    ], resolve),
                name: "等级权益管理"
            },
            {
                path: "edit",
                meta: {
                    title: "等级权益编辑"
                },
                component: resolve =>
                    require([
                        "../views/member/memberLevelEquity/editMemberLevelEquity.vue"
                    ], resolve),
                name: "等级权益编辑"
            }
        ]
    },
    // 会员积分
    {
        path: "memberIntegral",
        meta: {
            title: "会员积分"
        },
        component: resolve => require(["../views/member/Index.vue"], resolve),
        name: "会员积分",
        redirect: "memberIntegral/query",
        children: [{
                path: "query",
                meta: {
                    title: "会员积分查询"
                },
                component: resolve =>
                    require([
                        "../views/member/memberIntegral/memberIntegralQuery.vue"
                    ], resolve),
                name: "会员积分查询"
            },
            {
                path: "rules",
                meta: {
                    title: "积分获取规则"
                },
                component: resolve =>
                    require([
                        "../views/member/memberIntegral/memberIntegralRules.vue"
                    ], resolve),
                name: "积分获取规则"
            },
            {
                path: "editRules",
                meta: {
                    title: "编辑积分获取规则"
                },
                component: resolve =>
                    require([
                        "../views/member/memberIntegral/editMemberIntegralRules.vue"
                    ], resolve),
                name: "编辑积分获取规则"
            },
            {
                path: "history",
                meta: {
                    title: "积分交易记录"
                },
                component: resolve =>
                    require([
                        "../views/member/memberIntegral/memberIntegralHistory.vue"
                    ], resolve),
                name: "积分交易记录"
            }
        ]
    },
    // 会员标签
    {
        path: "memberTags",
        meta: {
            title: "会员标签"
        },
        component: resolve => require(["../views/member/Index.vue"], resolve),
        name: "会员标签",
        redirect: "memberTags/list",
        children: [{
                path: "list",
                meta: {
                    title: "会员标签列表"
                },
                component: resolve =>
                    require([
                        "../views/member/memberTags/memberTagsList.vue"
                    ], resolve),
                name: "会员标签列表"
            },
            {
                path: "add",
                meta: {
                    title: "添加会员标签"
                },
                component: resolve =>
                    require([
                        "../views/member/memberTags/addMemberTags.vue"
                    ], resolve),
                name: "添加会员标签"
            },
            {
                path: "edit",
                meta: {
                    title: "编辑会员标签"
                },
                component: resolve =>
                    require([
                        "../views/member/memberTags/addMemberTags.vue"
                    ], resolve),
                name: "编辑会员标签"
            },
            {
                path: "msgDetailList",
                meta: {
                    title: "短信发送详情"
                },
                component: resolve =>
                    require([
                        "../views/member/memberTags/msgDetailList.vue"
                    ], resolve),
                name: "短信发送详情"
            }
        ]
    },
    {
        path: "differentIndustryGoods",
        meta: {
            title: "异业商品管理"
        },
        component: resolve => require(["../views/member/Index.vue"], resolve),
        name: "异业商品管理",
        redirect: "differentIndustryGoods/list",
        children: [{
                path: "list",
                meta: {
                    title: "异业商品列表"
                },
                component: resolve =>
                    require([
                        "../views/member/differentIndustryGoods/differentIndustryGoodsList.vue"
                    ], resolve),
                name: "异业商品列表"
            },
            {
                path: "detail",
                meta: {
                    title: "异业商品详情"
                },
                component: resolve =>
                    require([
                        "../views/member/differentIndustryGoods/differentIndustryGoodsDetail.vue"
                    ], resolve),
                name: "异业商品详情"
            },
            {
                path: "add",
                meta: {
                    title: "添加异业商品"
                },
                component: resolve =>
                    require([
                        "../views/member/differentIndustryGoods/addDifferentIndustryGoods.vue"
                    ], resolve),
                name: "添加异业商品"
            },
            {
                path: "edit",
                meta: {
                    title: "编辑异业商品"
                },
                component: resolve =>
                    require([
                        "../views/member/differentIndustryGoods/addDifferentIndustryGoods.vue"
                    ], resolve),
                name: "编辑异业商品"
            }
        ]
    }, ,
    {
        path: "commodityReportForm",
        meta: {
            title: "异业商品统计"
        },
        component: resolve => require(["../views/member/Index.vue"], resolve),
        name: "异业商品统计",
        redirect: "commodityReportForm/commodityReport",
        children: [{
                path: "commodityReport",
                meta: {
                    title: "异业商品统计"
                },
                component: resolve =>
                    require([
                        "../views/member/commodityReportForm/commodityReport.vue"
                    ], resolve),
                name: "异业商品统计"
            },
            {
                path: "commodityReportDetail",
                meta: {
                    title: "异业商品明细"
                },
                component: resolve =>
                    require([
                        "../views/member/commodityReportForm/commodityReportDetail.vue"
                    ], resolve),
                name: "异业商品明细"
            }
        ]
    },
    {
        path: "membershipLevel",
        meta: {
            title: "会员等级管理"
        },
        component: resolve => require(["../views/member/Index.vue"], resolve),
        name: "会员等级管理",
        redirect: "membershipLevel/detail",
        children: [{
                path: "detail",
                meta: {
                    title: "会员等级详情"
                },
                component: resolve =>
                    require([
                        "../views/member/membershipLevel/membershipLevelDetail.vue"
                    ], resolve),
                name: "会员等级详情"
            },
            {
                path: "edit",
                meta: {
                    title: "编辑会员等级"
                },
                component: resolve =>
                    require([
                        "../views/member/membershipLevel/editMembershipLevel.vue"
                    ], resolve),
                name: "编辑会员等级"
            }
        ]
    },
    {
        path: "otherCommodity",
        meta: {
            title: "异业商品"
        },
        component: resolve => require(["../views/member/Index.vue"], resolve),
        name: "异业商品",
        redirect: "otherCommodity/commodityList",
        children: [{
                path: "creatCommodityType",
                meta: {
                    title: "创建商品类型"
                },
                component: resolve =>
                    require(["../views/member/otherCommodity/creatCommodityType.vue"], resolve),
                name: "创建商品类型"
            },
            {
                path: "editCommodityType",
                meta: {
                    title: "编辑商品类型"
                },
                component: resolve =>
                    require(["../views/member/otherCommodity/creatCommodityType.vue"], resolve),
                name: "编辑商品类型"
            },
            {
                path: "commodityTypeDetail",
                meta: {
                    title: "商品类型详情"
                },
                component: resolve =>
                    require(["../views/member/otherCommodity/commodityTypeDetail.vue"], resolve),
                name: "商品类型详情"
            },
            {
                path: "commodityList",
                meta: {
                    title: "商品类型列表"
                },
                component: resolve =>
                    require(["../views/member/otherCommodity/commodityTypeList.vue"], resolve),
                name: "商品类型列表"
            }
        ]
    },
    {
        path: "otherRights",
        meta: {
            title: "异业权益"
        },
        component: resolve => require(["../views/member/Index.vue"], resolve),
        name: "异业权益",
        redirect: "otherRights/otherRightsList",
        children: [{
                path: "otherRightsList",
                meta: {
                    title: "异业权益列表"
                },
                component: resolve =>
                    require(["../views/member/otherRights/otherRightsList.vue"], resolve),
                name: "异业权益列表"
            },
            {
                path: "addOtherRights",
                meta: {
                    title: "创建异业权益"
                },
                component: resolve =>
                    require(["../views/member/otherRights/addOtherRights.vue"], resolve),
                name: "创建异业权益"
            },
            {
                path: "editOtherRights",
                meta: {
                    title: "编辑异业权益"
                },
                component: resolve =>
                    require(["../views/member/otherRights/addOtherRights.vue"], resolve),
                name: "编辑异业权益"
            },
            {
                path: "otherRightsDetail",
                meta: {
                    title: "异业权益详情"
                },
                component: resolve =>
                    require(["../views/member/otherRights/otherRightsDetail.vue"], resolve),
                name: "异业权益详情"
            }
        ]
    },
    {
        path: "ownRights",
        meta: {
            title: "自有卡权益"
        },
        component: resolve => require(["../views/member/Index.vue"], resolve),
        name: "会员",
        redirect: "ownRights/list",
        children: [{
                path: "addOwnRights",
                meta: {
                    title: "创建自有卡权益"
                },
                component: resolve =>
                    require(["../views/member/ownRights/addOwnRights.vue"], resolve),
                name: "创建自有卡权益"
            },
            {
                path: "editOwnRights",
                meta: {
                    title: "编辑自有卡权益"
                },
                component: resolve =>
                    require(["../views/member/ownRights/addOwnRights.vue"], resolve),
                name: "编辑自有卡权益"
            },
            {
                path: "ownRightsList",
                meta: {
                    title: "自有卡权益管理"
                },
                component: resolve =>
                    require(["../views/member/ownRights/ownRightsList.vue"], resolve),
                name: "自有卡权益管理"
            },
            {
                path: "seeOwnrightsCard",
                meta: {
                    title: "查看自有卡权益"
                },
                component: resolve =>
                    require(["../views/member/ownRights/seeOwnrightsCard"], resolve),
                name: "查看自有卡权益"
            }
        ]
    },
    {
        path: "member",
        meta: {
            title: "会员"
        },
        component: resolve => require(["../views/member/Index.vue"], resolve),
        name: "会员",
        redirect: "member/list",
        children: [{
                path: "list",
                meta: {
                    title: "会员列表"
                },
                component: resolve =>
                    require(["../views/member/memberInfo/MemberList.vue"], resolve),
                name: "会员列表"
            },
            {
                path: "detail",
                meta: {
                    title: "会员详情"
                },
                component: resolve =>
                    require(["../views/member/memberInfo/MemberDetail.vue"], resolve),
                name: "会员详情"
            }
        ]
    },
    {
        path: "membershipCard",
        meta: {
            title: "会员卡"
        },
        component: resolve => require(["../views/member/Index.vue"], resolve),
        name: "会员卡",
        children: [{
                path: "list",
                meta: {
                    title: "会员卡列表"
                },
                component: resolve =>
                    require([
                        "../views/member/membershipCardInfo/membershipCardList.vue"
                    ], resolve),
                name: "会员卡列表"
            },
            {
                path: "detail",
                meta: {
                    title: "会员卡详情"
                },
                component: resolve =>
                    require([
                        "../views/member/membershipCardInfo/membershipCardDetail.vue"
                    ], resolve),
                name: "会员卡详情"
            },
            {
                path: "entityCardList",
                meta: {
                    title: "实体卡列表"
                },
                component: resolve =>
                    require([
                        "../views/member/membershipCardInfo/entityCardList.vue"
                    ], resolve),
                name: "实体卡列表"
            },
            {
                path: "addEntityCard",
                meta: {
                    title: "申请会员卡"
                },
                component: resolve =>
                    require([
                        "../views/member/membershipCardInfo/addEntityCard.vue"
                    ], resolve),
                name: "申请会员卡"
            },
            {
                path: "receiveEntityCard",
                meta: {
                    title: "领用礼品卡"
                },
                component: resolve =>
                    require([
                        "../views/member/membershipCardInfo/receiveEntityCard.vue"
                    ], resolve),
                name: "领用礼品卡"
            },
            {
                path: "cardBatchDetail",
                meta: {
                    title: "卡批次详情"
                },
                component: resolve =>
                    require([
                        "../views/member/membershipCardInfo/cardBatchDetail.vue"
                    ], resolve),
                name: "卡批次详情"
            }
        ]
    },
    {
        path: "cardTypeManagement",
        meta: {
            title: "卡政策管理"
        },
        component: resolve => require(["../views/member/Index.vue"], resolve),
        name: "卡政策管理",
        children: [{
                path: "list",
                meta: {
                    title: "会员卡政策列表"
                },
                component: resolve =>
                    require([
                        "../views/member/cardTypeManagement/cardList.vue"
                    ], resolve),
                name: "会员卡政策列表"
            },
            {
                path: "detail",
                meta: {
                    title: "会员卡政策详情"
                },
                component: resolve =>
                    require([
                        "../views/member/cardTypeManagement/cardTypeDetail.vue"
                    ], resolve),
                name: "会员卡政策详情"
            },
            {
                path: "addCardType",
                meta: {
                    title: "添加卡政策"
                },
                component: resolve =>
                    require([
                        "../views/member/cardTypeManagement/addCardType.vue"
                    ], resolve),
                name: "添加卡政策"
            },
            {
                path: "editCardType",
                meta: {
                    title: "编辑卡政策"
                },
                component: resolve =>
                    require([
                        "../views/member/cardTypeManagement/addCardType.vue"
                    ], resolve),
                name: "编辑卡政策"
            }
        ]
    },
    // 联名卡商户管理
    {
        path: "jointNameCard",
        meta: {
            title: "联名卡商户管理"
        },
        component: resolve => require(["../views/member/Index.vue"], resolve),
        name: "联名卡商户管理",
        children: [{
                path: "list",
                meta: {
                    title: "联名卡商户列表"
                },
                component: resolve =>
                    require([
                        "../views/member/jointNameCard/jointNameCardMerchantList.vue"
                    ], resolve),
                name: "联名卡商户列表"
            },
            {
                path: "detail",
                meta: {
                    title: "联名卡商户详情"
                },
                component: resolve =>
                    require([
                        "../views/member/jointNameCard/jointNameCardMerchantDetail.vue"
                    ], resolve),
                name: "联名卡商户详情"
            },
            {
                path: "addJointNameCardMerchant",
                meta: {
                    title: "添加联名卡商户"
                },
                component: resolve =>
                    require([
                        "../views/member/jointNameCard/addJointNameCardMerchant.vue"
                    ], resolve),
                name: "添加联名卡商户"
            },
            {
                path: "editJointNameCardMerchant",
                meta: {
                    title: "编辑联名卡商户"
                },
                component: resolve =>
                    require([
                        "../views/member/jointNameCard/addJointNameCardMerchant.vue"
                    ], resolve),
                name: "编辑联名卡商户"
            }
        ]
    }
]
export default routes;