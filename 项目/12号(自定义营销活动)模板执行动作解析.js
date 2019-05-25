// 12号模板（自定义营销活动) 执行元素
//营销活动动态执行元素JSON解析
[
{
	"g_name": "修改套票售价",
	"g_id": 31,
	"funs": [{
		"actionFnUniqueName": "ComboPriceModify",
		"a_id": 38,
		"params": [{
			"form_ctrl": "select",
			"a_default": null,
			"a_id": 38,
			"sources": [{
				"s_rule": "{\"floatNumber\" : [6,2], \"min\":1}",
				"LABEL": "零售价-N ( 元 )",
				"VALUE": "subPrice",
				"p_id": 132
			}],
			"a_rule": null,
			"a_name": "调价方式",
			"p_id": 132,
			"key": "modifyWay"
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_id": 38,
			"a_rule": null,
			"a_name": "调整额",
			"p_id": 133,
			"key": "modifyValue"
		}, {
			"form_ctrl": "select",
			"a_default": "TICKET_FIRST",
			"a_id": 38,
			"sources": [{
				"s_rule": null,
				"LABEL": "卖品和影票均摊",
				"VALUE": "TICKET_MERCHANDISE_AVERAGE",
				"p_id": 134
			}],
			"a_rule": null,
			"a_name": "优惠金额分摊",
			"p_id": 134,
			"key": "discountApportion"
		}]
	}]
},
{
	"g_name": "赠送积分",	//组名
	"g_id": 1,				//分组ID,需要保存回传的
	"funs": [{				//分组方法元素
		"a_id": 6,			//方法ID,可以不用管
		"actionFnUniqueName": "PresentPoint",	//方法的唯一名称,需要保存回传的
		"params": [{							//方法元素
			"form_ctrl": "input",				//界面展示形式
			"a_default": null,					//默认值
			"a_rule": "{\"intNumber\" : true, \"min\":1, \"max\" : 999999}",	//取值规范
			"a_name": "赠送积分",				//方法显示名称
			"key": "presentPoint",				// 需要保存回传的key
			"p_id": ""							//不用管
		}]
	}]
}, {
	"g_name": "赠送会员卡储值额",
	"g_id": 2,
	"funs": [{
		"a_id": 7,
		"actionFnUniqueName": "PresentMemberCardMoney",
		"params": [{
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": "{\"floatNumber\" :[5,2],\"min\" : 0.01}",
			"a_name": "赠送金额",
			"key": "presentMoney",
			"p_id": ""
		}]
	}]
}, {
	"g_name": "赠送票券",						//组名
	"g_id": 3,									//分组ID,需要保存回传的
	"funs": [{									//分组方法元素
		"a_id": 8,								//方法ID,可以不用管
		"actionFnUniqueName": "PresentCoupon",	//方法的唯一名称,需要保存回传的opUniqueName
		"params": [{							//方法元素，像这种有多个方法元素，就表示需要actions中多个json来表示，它们拥有相同的opUniqueName，不同的key和值
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": null,
			"a_name": "票券名称",
			"key": "couponApplyCode",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": "{\"intNumber\" : true, \"min\":1, \"max\" : 999}",
			"a_name": "数量",
			"key": "amount",
			"p_id": ""
		}, {
			"form_ctrl": "select",
			"a_default": null,
			"sources": [{				//单选/多选 下拉框中的值列表，select表示单选框，mutilSelect 表示多选下拉框
				"s_rule": null,			//取值规范
				"LABEL": "是",			//显示值
				"VALUE": "send",		//具体值
				"p_id": 121
			}, {
				"s_rule": null,
				"LABEL": "否",
				"VALUE": "unsend",
				"p_id": 121
			}],
			"a_rule": null,
			"a_name": "是否发送短信",
			"key": "isSendSms",
			"p_id": ""
		}, {
			"form_ctrl": "select",
			"a_default": null,
			"sources": [{
				"s_rule": null,
				"LABEL": "选择已有短信模板",
				"VALUE": "template",
				"p_id": 122
			}, {
				"s_rule": null,
				"LABEL": "发送自定义内容",
				"VALUE": "customized",
				"p_id": 122
			}],
			"a_rule": null,
			"a_name": "选择方式",
			"key": "isUseModel",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": null,
			"a_name": "短信模板",
			"key": "smsModelCode",
			"p_id": ""
		}, {
			"form_ctrl": "textarea",
			"a_default": null,
			"a_rule": "{\"maxlength\" : 200}",
			"a_name": "短信内容",
			"key": "msgContent",
			"p_id": ""
		}]
	}]
}, {
	"g_name": "单品优惠价调整",
	"g_id": 9,
	"funs": [{
		"g_id": 9,
		"actionFnUniqueName": "MerchandiseModifyPrice",
		"a_id": 13,
		"params": [{
			"form_ctrl": "input",
			"a_default": null,
			"a_id": 13,
			"a_rule": null,
			"a_name": "商品",
			"p_id": 25,
			"key": "merKey"
		}, {
			"form_ctrl": "select",
			"a_default": null,
			"a_id": 13,
			"sources": [{
				"s_rule": null,
				"LABEL": "满减",
				"VALUE": "fullReduce",
				"p_id": 26
			}],
			"a_rule": null,
			"a_name": "调价方式",
			"p_id": 26,
			"key": "modifyWay"
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_id": 13,
			"a_rule": null,
			"a_name": "调价值",
			"p_id": 27,
			"key": "modifyValue"
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_id": 13,
			"a_rule": "{\"intNumber\" : true, \"digits\" : true, \"min\" : 1, \"max\" : 99}",
			"a_name": "数量",
			"p_id": 64,
			"key": "modifyAmount"
		}, {
			"form_ctrl": "select",
			"a_default": "appointAmount",
			"a_id": 13,
			"sources": [{
				"s_rule": null,
				"LABEL": "该商品全部数量",
				"VALUE": "all",
				"p_id": 73
			}],
			"a_rule": null,
			"a_name": "调价商品数量",
			"p_id": 73,
			"key": "modifyAmountMethod"
		}, {
			"form_ctrl": "select",
			"a_default": "ROUND_UNNECESSARY",
			"a_id": 13,
			"sources": [{
				"s_rule": null,
				"LABEL": "保留小数",
				"VALUE": "ROUND_UNNECESSARY",
				"p_id": 79
			}],
			"a_rule": null,
			"a_name": "折扣后取整方式",
			"p_id": 79,
			"key": "decimalRoundMode"
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_id": 13,
			"a_rule": "{\"intNumber\" : true, \"digits\" : true, \"min\" : 1, \"max\" : 999999, \"required\":false}",
			"a_name": "积分定价（分）",
			"p_id": 95,
			"key": "integralAmount"
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_id": 13,
			"a_rule": "{\"floatNumber\" : [4,2], \"min\": 0, \"max\" : 9999.99, \"required\":false}",
			"a_name": "加金额（元）",
			"p_id": 97,
			"key": "integralMoney"
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_id": 13,
			"a_rule": "{\"floatNumber\" : [6,2], \"min\":-999999.99, \"max\" : 999999.99, \"required\" : false}",
			"a_name": "折扣后加减N元",
			"p_id": 99,
			"key": "addAmountAfterDiscount"
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_id": 13,
			"a_rule": null,
			"a_name": "满减值",
			"p_id": 131,
			"key": "fullReduceValue"
		}]
	}]
}, {
	"g_name": "以优惠价格增加单品",
	"g_id": 10,
	"funs": [{
		"a_id": 14,
		"actionFnUniqueName": "MerchandiseAddWithPrice",
		"params": [{
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": null,
			"a_name": "商品",
			"key": "merKey",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": "{\"floatNumber\" : [4,2], \"min\" : 0.01}",
			"a_name": "商品单价",
			"key": "price",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": "{\"intNumber\" : true, \"digits\":true, \"min\" :1, \"max\" : 99}",
			"a_name": "增加数量",
			"key": "amount",
			"p_id": ""
		}]
	}]
}, {
	"g_name": "赠送商品",
	"g_id": 11,
	"funs": [{
		"a_id": 15,
		"actionFnUniqueName": "MerchandisePresent",
		"params": [{
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": null,
			"a_name": "商品",
			"key": "merKey",
			"p_id": ""
		}, {
			"form_ctrl": "plaintext",
			"a_default": "0",
			"a_rule": null,
			"a_name": "商品单价",
			"key": "price",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": "{\"intNumber\" : true, \"digits\":true, \"min\" :1, \"max\" : 99}",
			"a_name": "赠送数量",
			"key": "amount",
			"p_id": ""
		}]
	}]
}, {
	"g_name": "修改单票售价",
	"g_id": 15,
	"funs": [{
		"a_id": 19,
		"actionFnUniqueName": "FilmTicketPriceModify",
		"params": [{
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": null,
			"a_name": "调整额",
			"key": "modifyValue",
			"p_id": ""
		}, {
			"form_ctrl": "select",
			"a_default": null,
			"sources": [{
				"s_rule": "{\"floatNumber\" : [3,2], \"min\":0}",
				"LABEL": "固定金额 ( 元 )",
				"VALUE": "fixPrice",
				"p_id": 68
			}, {
				"s_rule": "{\"intNumber\" : true, \"min\":1,\"max\":100}",
				"LABEL": "零售价打折 ( % )",
				"VALUE": "discountPrice",
				"p_id": 68
			}, {
				"s_rule": "{\"floatNumber\" : [6,2], \"min\":1}",
				"LABEL": "零售价-N ( 元 )",
				"VALUE": "subPrice",
				"p_id": 68
			}, {
				"s_rule": "{\"floatNumber\" : [3,2], \"min\":-999.99, \"max\": 999.99}",
				"LABEL": "最低发行价±N元",
				"VALUE": "addToLowestPrice",
				"p_id": 68
			}],
			"a_rule": null,
			"a_name": "调价方式",
			"key": "modifyWay",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": "{\"intNumber\" : true, \"digits\" : true, \"min\" : 1, \"max\" : 999}",
			"a_name": "数量",
			"key": "modifyAmount",
			"p_id": ""
		}, {
			"form_ctrl": "select",
			"a_default": "notAllowSale",
			"sources": [{
				"s_rule": null,
				"LABEL": "不允许出票",
				"VALUE": "notAllowSale",
				"p_id": 70
			}, {
				"s_rule": "{\"intNumber\" : true, \"min\":0,\"max\":999}",
				"LABEL": "影院补贴",
				"VALUE": "cinemaPay",
				"p_id": 70
			}, {
				"s_rule": null,
				"LABEL": "用户补贴",
				"VALUE": "clientPay",
				"p_id": 70
			}],
			"a_rule": null,
			"a_name": "低于最低价时",
			"key": "lessProcessMethod",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": null,
			"a_name": "最多补贴N元",
			"key": "cinemaPayAmount",
			"p_id": ""
		}, {
			"form_ctrl": "select",
			"a_default": "appointAmount",
			"sources": [{
				"s_rule": "{\"intNumber\" : true, \"digits\" : true, \"min\" : 1, \"max\" : 999}",
				"LABEL": "指定数量",
				"VALUE": "appointAmount",
				"p_id": 72
			}, {
				"s_rule": null,
				"LABEL": "全部影票",
				"VALUE": "all",
				"p_id": 72
			}, {
				"s_rule": null,
				"LABEL": "每会员每日数量",
				"VALUE": "perMemberDay",
				"p_id": 72
			}, {
				"s_rule": null,
				"LABEL": "每会员每周数量",
				"VALUE": "perMemberWeek",
				"p_id": 72
			}, {
				"s_rule": null,
				"LABEL": "每会员每月数量",
				"VALUE": "perMemberMonth",
				"p_id": 72
			}],
			"a_rule": null,
			"a_name": "调价商品数量",
			"key": "modifyAmountMethod",
			"p_id": ""
		}, {
			"form_ctrl": "select",
			"a_default": "ROUND_UNNECESSARY",
			"sources": [{
				"s_rule": null,
				"LABEL": "四舍五入",
				"VALUE": "ROUND_HALF_UP",
				"p_id": 78
			}, {
				"s_rule": null,
				"LABEL": "忽略小数取整",
				"VALUE": "ROUND_FLOOR",
				"p_id": 78
			}, {
				"s_rule": null,
				"LABEL": "小数进1取整",
				"VALUE": "ROUND_CEILING",
				"p_id": 78
			}, {
				"s_rule": null,
				"LABEL": "保留小数",
				"VALUE": "ROUND_UNNECESSARY",
				"p_id": 78
			}],
			"a_rule": null,
			"a_name": "折扣后取整方式",
			"key": "decimalRoundMode",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": "{\"intNumber\" : true, \"digits\" : true, \"min\" : 0, \"max\" : 99999999, \"required\":false}",
			"a_name": "积分定价（分）",
			"key": "integralAmount",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": "{\"floatNumber\" : [4,2], \"min\": 0, \"max\" : 9999.99, \"required\":false}",
			"a_name": "加金额（元）",
			"key": "integralMoney",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": "{\"floatNumber\" : [6,2], \"min\":-999999.99, \"max\" : 999999.99, \"required\" : false}",
			"a_name": "折扣后加减N元",
			"key": "addAmountAfterDiscount",
			"p_id": ""
		}]
	}]
}, {
	"g_name": "赠送积分倍率",
	"g_id": 18,
	"funs": [{
		"a_id": 24,
		"actionFnUniqueName": "PresentPointPersent",
		"params": [{
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": "{\"floatNumber\" : [3,2], \"min\":0.01}",
			"a_name": "积分倍率",
			"key": "pointPersent",
			"p_id": ""
		}]
	}]
}, {
	"g_name": "卖品分类优惠价调整",
	"g_id": 27,
	"funs": [{
		"a_id": 34,
		"actionFnUniqueName": "MerchandiseCategoryModifier",
		"params": [{
			"form_ctrl": "select",
			"a_default": "appointCategory",
			"sources": [{
				"s_rule": null,
				"LABEL": "全部卖品分类",
				"VALUE": "allMerCategory",
				"p_id": 86
			}, {
				"s_rule": null,
				"LABEL": "指定分类",
				"VALUE": "appointCategory",
				"p_id": 86
			}],
			"a_rule": null,
			"a_name": "商品分类",
			"key": "merCategoryMethod",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": null,
			"a_name": "分类",
			"key": "classCode",
			"p_id": ""
		}, {
			"form_ctrl": "select",
			"a_default": "appointAmount",
			"sources": [{
				"s_rule": "{\"intNumber\" : true, \"digits\" : true, \"min\" : 1, \"max\" : 99}",
				"LABEL": "指定数量",
				"VALUE": "appointAmount",
				"p_id": 88
			}, {
				"s_rule": null,
				"LABEL": "该分类全部数量",
				"VALUE": "all",
				"p_id": 88
			}],
			"a_rule": null,
			"a_name": "调价商品数量",
			"key": "modifyAmountMethod",
			"p_id": ""
		}, {
			"form_ctrl": "select",
			"a_default": null,
			"sources": [{
				"s_rule": "{\"intNumber\" : true, \"min\":1,\"max\":100}",
				"LABEL": "零售价打折 ( % )",
				"VALUE": "discountPrice",
				"p_id": 89
			}, {
				"s_rule": "{\"floatNumber\" : [6,2], \"min\":1, \"max\" : 999999.99}",
				"LABEL": "零售价-N元",
				"VALUE": "subPrice",
				"p_id": 89
			}],
			"a_rule": null,
			"a_name": "调价方式",
			"key": "modifyWay",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": null,
			"a_name": "调价值",
			"key": "modifyValue",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": null,
			"a_name": "数量",
			"key": "modifyAmount",
			"p_id": ""
		}, {
			"form_ctrl": "select",
			"a_default": "ROUND_UNNECESSARY",
			"sources": [{
				"s_rule": null,
				"LABEL": "四舍五入",
				"VALUE": "ROUND_HALF_UP",
				"p_id": 92
			}, {
				"s_rule": null,
				"LABEL": "忽略小数取整",
				"VALUE": "ROUND_FLOOR",
				"p_id": 92
			}, {
				"s_rule": null,
				"LABEL": "小数进1取整",
				"VALUE": "ROUND_CEILING",
				"p_id": 92
			}, {
				"s_rule": null,
				"LABEL": "保留小数",
				"VALUE": "ROUND_UNNECESSARY",
				"p_id": 92
			}],
			"a_rule": null,
			"a_name": "折扣后取整方式",
			"key": "decimalRoundMode",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": "{\"floatNumber\" : [6,2], \"min\":-999999.99, \"max\" : 999999.99, \"required\" : false}",
			"a_name": "折扣后加减N元",
			"key": "addAmountAfterDiscount",
			"p_id": ""
		}]
	}]
}, {
	"g_name": "按品牌优惠价调整",
	"g_id": 28,
	"funs": [{
		"a_id": 35,
		"actionFnUniqueName": "MerchandiseBrandModifier",
		"params": [{
			"form_ctrl": "select",
			"a_default": "appointBrand",
			"sources": [{
				"s_rule": null,
				"LABEL": "全部品牌",
				"VALUE": "allMerBrand",
				"p_id": 101
			}, {
				"s_rule": null,
				"LABEL": "指定品牌",
				"VALUE": "appointBrand",
				"p_id": 101
			}],
			"a_rule": null,
			"a_name": "商品品牌",
			"key": "merBrandMethod",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": null,
			"a_name": "品牌",
			"key": "brandId",
			"p_id": ""
		}, {
			"form_ctrl": "select",
			"a_default": "appointAmount",
			"sources": [{
				"s_rule": "{\"intNumber\" : true, \"digits\" : true, \"min\" : 1, \"max\" : 99}",
				"LABEL": "指定数量",
				"VALUE": "appointAmount",
				"p_id": 103
			}, {
				"s_rule": null,
				"LABEL": "该品牌全部数量",
				"VALUE": "all",
				"p_id": 103
			}],
			"a_rule": null,
			"a_name": "调价商品数量",
			"key": "modifyAmountMethod",
			"p_id": ""
		}, {
			"form_ctrl": "select",
			"a_default": null,
			"sources": [{
				"s_rule": "{\"intNumber\" : true, \"min\":1,\"max\":100}",
				"LABEL": "零售价打折 ( % )",
				"VALUE": "discountPrice",
				"p_id": 104
			}, {
				"s_rule": "{\"floatNumber\" : [6,2], \"min\":1, \"max\" : 999999.99}",
				"LABEL": "零售价-N元",
				"VALUE": "subPrice",
				"p_id": 104
			}],
			"a_rule": null,
			"a_name": "调价方式",
			"key": "modifyWay",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": null,
			"a_name": "调价值",
			"key": "modifyValue",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": null,
			"a_name": "数量",
			"key": "modifyAmount",
			"p_id": ""
		}, {
			"form_ctrl": "select",
			"a_default": "ROUND_UNNECESSARY",
			"sources": [{
				"s_rule": null,
				"LABEL": "四舍五入",
				"VALUE": "ROUND_HALF_UP",
				"p_id": 107
			}, {
				"s_rule": null,
				"LABEL": "忽略小数取整",
				"VALUE": "ROUND_FLOOR",
				"p_id": 107
			}, {
				"s_rule": null,
				"LABEL": "小数进1取整",
				"VALUE": "ROUND_CEILING",
				"p_id": 107
			}, {
				"s_rule": null,
				"LABEL": "保留小数",
				"VALUE": "ROUND_UNNECESSARY",
				"p_id": 107
			}],
			"a_rule": null,
			"a_name": "折扣后取整方式",
			"key": "decimalRoundMode",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": "{\"floatNumber\" : [6,2], \"min\":-999999.99, \"max\" : 999999.99, \"required\" : false}",
			"a_name": "折扣后加减N元",
			"key": "addAmountAfterDiscount",
			"p_id": ""
		}]
	}]
}, {
	"g_name": "按座位等级修改票价",
	"g_id": 29,
	"funs": [{
		"a_id": 36,
		"actionFnUniqueName": "FilmSeatGradePriceModify",
		"params": [{
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": null,
			"a_name": "调整额",
			"key": "modifyValue",
			"p_id": ""
		}, {
			"form_ctrl": "select",
			"a_default": null,
			"sources": [{
				"s_rule": "{\"floatNumber\" : [3,2], \"min\":0}",
				"LABEL": "固定金额 ( 元 )",
				"VALUE": "fixPrice",
				"p_id": 110
			}, {
				"s_rule": "{\"intNumber\" : true, \"min\":1,\"max\":100}",
				"LABEL": "零售价打折 ( % )",
				"VALUE": "discountPrice",
				"p_id": 110
			}, {
				"s_rule": "{\"floatNumber\" : [6,2], \"min\":1}",
				"LABEL": "零售价-N ( 元 )",
				"VALUE": "subPrice",
				"p_id": 110
			}, {
				"s_rule": "{\"floatNumber\" : [3,2], \"min\":-999.99, \"max\": 999.99}",
				"LABEL": "最低发行价±N元",
				"VALUE": "addToLowestPrice",
				"p_id": 110
			}],
			"a_rule": null,
			"a_name": "调价方式",
			"key": "modifyWay",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": "{\"intNumber\" : true, \"digits\" : true, \"min\" : 1, \"max\" : 999}",
			"a_name": "数量",
			"key": "modifyAmount",
			"p_id": ""
		}, {
			"form_ctrl": "select",
			"a_default": "notAllowSale",
			"sources": [{
				"s_rule": null,
				"LABEL": "不允许出票",
				"VALUE": "notAllowSale",
				"p_id": 112
			}, {
				"s_rule": "{\"intNumber\" : true, \"min\":0,\"max\":999}",
				"LABEL": "影院补贴",
				"VALUE": "cinemaPay",
				"p_id": 112
			}, {
				"s_rule": null,
				"LABEL": "用户补贴",
				"VALUE": "clientPay",
				"p_id": 112
			}],
			"a_rule": null,
			"a_name": "低于最低价时",
			"key": "lessProcessMethod",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": null,
			"a_name": "最多补贴N元",
			"key": "cinemaPayAmount",
			"p_id": ""
		}, {
			"form_ctrl": "select",
			"a_default": "appointAmount",
			"sources": [{
				"s_rule": "{\"intNumber\" : true, \"digits\" : true, \"min\" : 1, \"max\" : 999}",
				"LABEL": "指定数量",
				"VALUE": "appointAmount",
				"p_id": 114
			}, {
				"s_rule": null,
				"LABEL": "全部影票",
				"VALUE": "all",
				"p_id": 114
			}],
			"a_rule": null,
			"a_name": "调价商品数量",
			"key": "modifyAmountMethod",
			"p_id": ""
		}, {
			"form_ctrl": "select",
			"a_default": "ROUND_UNNECESSARY",
			"sources": [{
				"s_rule": null,
				"LABEL": "四舍五入",
				"VALUE": "ROUND_HALF_UP",
				"p_id": 115
			}, {
				"s_rule": null,
				"LABEL": "忽略小数取整",
				"VALUE": "ROUND_FLOOR",
				"p_id": 115
			}, {
				"s_rule": null,
				"LABEL": "小数进1取整",
				"VALUE": "ROUND_CEILING",
				"p_id": 115
			}, {
				"s_rule": null,
				"LABEL": "保留小数",
				"VALUE": "ROUND_UNNECESSARY",
				"p_id": 115
			}],
			"a_rule": null,
			"a_name": "折扣后取整方式",
			"key": "decimalRoundMode",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": "{\"intNumber\" : true, \"digits\" : true, \"min\" : 0, \"max\" : 99999999, \"required\":false}",
			"a_name": "积分定价（分）",
			"key": "integralAmount",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": "{\"floatNumber\" : [4,2], \"min\": 0, \"max\" : 9999.99, \"required\":false}",
			"a_name": "加金额（元）",
			"key": "integralMoney",
			"p_id": ""
		}, {
			"form_ctrl": "input",
			"a_default": null,
			"a_rule": "{\"floatNumber\" : [6,2], \"min\":-999999.99, \"max\" : 999999.99, \"required\" : false}",
			"a_name": "折扣后加减N元",
			"key": "addAmountAfterDiscount",
			"p_id": ""
		}, {
			"form_ctrl": "multiSelect",
			"a_default": null,
			"sources": [{
				"s_rule": null,
				"LABEL": "0",
				"VALUE": "0",
				"p_id": 119
			}, {
				"s_rule": null,
				"LABEL": "1",
				"VALUE": "1",
				"p_id": 119
			}, {
				"s_rule": null,
				"LABEL": "2",
				"VALUE": "2",
				"p_id": 119
			}, {
				"s_rule": null,
				"LABEL": "3",
				"VALUE": "3",
				"p_id": 119
			}, {
				"s_rule": null,
				"LABEL": "4",
				"VALUE": "4",
				"p_id": 119
			}, {
				"s_rule": null,
				"LABEL": "5",
				"VALUE": "5",
				"p_id": 119
			}, {
				"s_rule": null,
				"LABEL": "6",
				"VALUE": "6",
				"p_id": 119
			}, {
				"s_rule": null,
				"LABEL": "7",
				"VALUE": "7",
				"p_id": 119
			}, {
				"s_rule": null,
				"LABEL": "8",
				"VALUE": "8",
				"p_id": 119
			}, {
				"s_rule": null,
				"LABEL": "9",
				"VALUE": "9",
				"p_id": 119
			}],
			"a_rule": null,
			"a_name": "座位等级",
			"key": "seatGrade",
			"p_id": ""
		}]
	}]
}]