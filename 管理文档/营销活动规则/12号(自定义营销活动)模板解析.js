// 12号模板（自定义营销活动) 条件元素
//营销活动动态元素JSON解析
//每一个外层list中的json表示一组条件,与现有营销活动中的一一对应

[
{
	"g_name": "MOVIE365首次购票",
	"g_id": 96,
	"fields": [{
		"g_id": 96,
		"ops": [{
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}],
		"sources": [{
			"f_id": 174,
			"label": "是",
			"value": "true"
		}],
		"f_name": "MOVIE365首次购票",
		"f_form_ctrl": "multiSelect",
		"f_rule": null,
		"f_type": "java.lang.Boolean",
		"category": "SaleInfo",
		"key": "firstBuyTicket"
	}]
},
{
        "g_name":"首充金额",
        "g_id":98,
        "fields":[
            {
                "g_id":98,
                "ops":[
                    {
                        "unqueName":"normalLess",
                        "o_name":"小于",
                        "o_remark":null,
                        "o_default":null
                    },
                    {
                        "unqueName":"normalGreater",
                        "o_name":"大于",
                        "o_remark":null,
                        "o_default":null
                    },
                    {
                        "unqueName":"normalNotEqual",
                        "o_name":"不等于",
                        "o_remark":null,
                        "o_default":null
                    },
                    {
                        "unqueName":"normalGreaterEqual",
                        "o_name":"大于等于",
                        "o_remark":null,
                        "o_default":null
                    },
                    {
                        "unqueName":"normalEqual",
                        "o_name":"等于",
                        "o_remark":"普通的等于(注意要和每等于区别)",
                        "o_default":null
                    },
                    {
                        "unqueName":"normalLessEqual",
                        "o_name":"小于等于",
                        "o_remark":null,
                        "o_default":null
                    }
                ],
                "f_name":"首充金额",
                "f_form_ctrl":"input",
                "f_rule":"{\"floatNumber\" :[5,2],\"min\" : 0.01}",
                "f_id":178,
                "f_type":"java.math.BigDecimal",
                "category":"MemberInfo",
                "key":"firstRecharge"
            }
        ]
    }
,{
        "g_name":"单次充值金额",
        "g_id":1,
        "fields":[
            {
                "g_id":1,
                "ops":[
                    {
                        "unqueName":"normalIn",
                        "o_name":"包含",
                        "o_remark":"普通零散值的包含",
                        "o_default":null
                    },
                    {
                        "unqueName":"normalNotIn",
                        "o_name":"不包含",
                        "o_remark":"普通零散值的不包含",
                        "o_default":null
                    }
                ],
                "sources":[
                    {
                        "label":"柜台",
                        "value":"0"
                    },
                    {
                        "label":"自助终端",
                        "value":"1"
                    },
                    {
                        "label":"官方网站",
                        "value":"3"
                    },
                    {
                        "label":"手机APP",
                        "value":"2"
                    },
                    {
                        "label":"小程序",
                        "value":"4"
                    },
                    {
                        "label":"微信公众号",
                        "value":"T"
                    },
                    {
                        "label":"第三方渠道",
                        "value":"5"
                    }
                ],
                "f_name":"交易渠道",
                "f_form_ctrl":"multiSelect",
                "f_rule":null,
                "f_id":28,
                "f_type":"java.lang.String",
                "category":"SaleInfo",
                "key":"consumeWayCode"
            },
            {
                "g_id":1,
                "ops":[
                    {
                        "unqueName":"customGreater",
                        "o_name":"大于",
                        "o_remark":"自定义大于",
                        "o_default":null
                    },
                    {
                        "unqueName":"customEqual",
                        "o_name":"等于",
                        "o_remark":"自定义等于",
                        "o_default":null
                    },
                    {
                        "unqueName":"customLess",
                        "o_name":"小于",
                        "o_remark":"自定义小于",
                        "o_default":null
                    },
                    {
                        "unqueName":"customGreaterEqual",
                        "o_name":"大于等于",
                        "o_remark":"自定义大于等于",
                        "o_default":null
                    },
                    {
                        "unqueName":"customLessEqual",
                        "o_name":"小于等于",
                        "o_remark":"自定义小于等于",
                        "o_default":null
                    }
                ],
                "f_name":"整单交易金额",
                "f_form_ctrl":"input",
                "f_rule":"{\"floatNumber\" :[5,2], \"min\" : 0.01}",
                "f_id":27,
                "f_type":"java.math.BigDecimal",
                "category":"SaleInfo",
                "key":"sumPrice"
            }
        ]
    },
    {
        "g_name":"累计充值金额",
        "g_id":5,
        "fields":[
            {
                "g_id":5,
                "ops":[
                    {
                        "unqueName":"normalGreater",
                        "o_name":"大于",
                        "o_remark":null,
                        "o_default":null
                    },
                    {
                        "unqueName":"normalEqual",
                        "o_name":"等于",
                        "o_remark":"普通的等于(注意要和每等于区别)",
                        "o_default":null
                    },
                    {
                        "unqueName":"normalLess",
                        "o_name":"小于",
                        "o_remark":null,
                        "o_default":null
                    },
                    {
                        "unqueName":"normalGreaterEqual",
                        "o_name":"大于等于",
                        "o_remark":null,
                        "o_default":null
                    },
                    {
                        "unqueName":"normalLessEqual",
                        "o_name":"小于等于",
                        "o_remark":null,
                        "o_default":null
                    },
                    {
                        "unqueName":"normalNotEqual",
                        "o_name":"不等于",
                        "o_remark":null,
                        "o_default":null
                    }
                ],
                "f_name":"累计充值金额",
                "f_form_ctrl":"input",
                "f_rule":"{\"floatNumber\" :[5,2], \"min\" : 0.01}",
                "f_id":50,
                "f_type":"java.math.BigDecimal",
                "category":"MemberInfo",
                "key":"chargeSum"
            }
        ]
    },
{
	"g_name": "单次消费金额",						//条件分组名,对应营销活动动态添加元素的是按钮文字
	"g_id": 2,										//条件分组ID	
	"fields": [{									//条件元素集合
		"g_id": 2,
		"ops": [{									//操作符集合,一般存在这个列表时,表示操作符需要用下拉框表示,如果只存在一个,
			"unqueName": "normalIn",				//回传给保存时使用的unqueName
			"o_name": "包含",						//操作符显示名称
			"o_remark": "普通零散值的包含",			//操作符备注
			"o_default": null						//操作符默认值
		}, {
			"unqueName": "normalNotIn",
			"o_name": "不包含",
			"o_remark": "普通零散值的不包含",
			"o_default": null
		}],
		"sources": [{
			"label": "柜台",
			"value": "0"
		}, {
			"label": "自助终端",
			"value": "1"
		}, {
			"label": "官方网站",
			"value": "3"
		}, {
			"label": "手机APP",
			"value": "2"
		}, {
			"label": "小程序",
			"value": "4"
		}, {
			"label": "微信公众号",
			"value": "T"
		}, {
			"label": "第三方渠道",
			"value": "5"
		}],
		"f_name": "交易渠道",						//元素label
		"f_form_ctrl": "multiSelect",				//界面展示形式,这个表示多选下拉
		"f_rule": null,								//值规范
		"f_id": 28,		
		"f_type": "java.lang.String",				//值类型
		"category": "SaleInfo",						//回传给保存时使用的category
		"key": "consumeWayCode"						//回传给保存时使用的Key
	}, {
		"g_id": 2,
		"ops": [{
			"unqueName": "normalGreater",
			"o_name": "大于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalNotEqual",
			"o_name": "不等于",
			"o_remark": null,
			"o_default": null
		}],
		"f_name": "整单交易金额",
		"f_form_ctrl": "input",
		"f_rule": "{\"floatNumber\" :[5,2], \"min\" : 0.01}",
		"f_id": 27,
		"f_type": "java.math.BigDecimal",
		"category": "SaleInfo",
		"key": "sumPrice"
	}]
}, {
	"g_name": "账户余额",
	"g_id": 3,
	"fields": [{
		"g_id": 3,
		"ops": [{
			"unqueName": "normalGreater",
			"o_name": "大于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalNotEqual",
			"o_name": "不等于",
			"o_remark": null,
			"o_default": null
		}],
		"f_name": "账户余额",
		"f_form_ctrl": "input",
		"f_rule": "{\"floatNumber\" :[5,2],\"min\" : 0.01}",
		"f_id": 48,
		"f_type": "java.math.BigDecimal",
		"category": "MemberInfo",
		"key": "balance"
	}]
}, {
	"g_name": "积分余额",
	"g_id": 4,
	"fields": [{
		"g_id": 4,
		"ops": [{
			"unqueName": "normalGreater",
			"o_name": "大于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalNotEqual",
			"o_name": "不等于",
			"o_remark": null,
			"o_default": null
		}],
		"f_name": "积分余额",
		"f_form_ctrl": "input",
		"f_rule": "{\"floatNumber\" :[5,2], \"min\" : 0.01}",
		"f_id": 49,
		"f_type": "java.lang.Integer",
		"category": "MemberInfo",
		"key": "integral"
	}]
}, {
	"g_name": "累计消费金额",
	"g_id": 6,
	"fields": [{
		"g_id": 6,
		"ops": [{
			"unqueName": "normalGreater",
			"o_name": "大于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalNotEqual",
			"o_name": "不等于",
			"o_remark": null,
			"o_default": null
		}],
		"f_name": "累计消费金额",
		"f_form_ctrl": "input",
		"f_rule": "{\"floatNumber\" :[5,2],\"min\" : 0.01}",
		"f_id": 51,
		"f_type": "java.math.BigDecimal",
		"category": "MemberInfo",
		"key": "consumeSum"
	}]
}, {
	"g_name": "生日",
	"g_id": 7,
	"fields": [{
		"g_id": 7,
		"ops": [{
			"unqueName": "EqualCurrentDay",
			"o_name": "等于当日",
			"o_remark": "drools等于当天",
			"o_default": null
		}, {
			"unqueName": "EqualCurrentMoney",
			"o_name": "等于当月",
			"o_remark": "等于当月",
			"o_default": null
		}, {
			"unqueName": "EqualCurrentMonthOffset",
			"o_name": "交易当月前后N月",
			"o_remark": null,
			"o_default": null
		}],
		"f_name": "生日",
		"f_form_ctrl": "input",
		"f_rule": "{\"intNumber\": true, \"digits\":true,\"min\":0,\"max\":12}",
		"f_id": 53,
		"f_type": "java.util.Date",
		"category": "MemberInfo",
		"key": "birthday"
	}]
}, {
	"g_name": "性别",
	"g_id": 8,
	"fields": [{
		"g_id": 8,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}],
		"sources": [{
			"label": "男性",
			"value": "0"
		}, {
			"label": "女性",
			"value": "1"
		}],
		"f_name": "性别",
		"f_form_ctrl": "multiSelect",
		"f_rule": null,
		"f_id": 54,
		"f_type": "java.lang.Integer",
		"category": "MemberInfo",
		"key": "sex"
	}]
}, {
	"g_name": "年龄",
	"g_id": 9,
	"fields": [{
		"g_id": 9,
		"ops": [{
			"unqueName": "normalGreater",
			"o_name": "大于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalNotEqual",
			"o_name": "不等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "BetweenOperator",
			"o_name": "包含区间",
			"o_remark": "普通数值的包含区间",
			"o_default": null
		}, {
			"unqueName": "not_BetweenOperator",
			"o_name": "不包含区间",
			"o_remark": "不包含区间",
			"o_default": null
		}],
		"f_name": "年龄",
		"f_form_ctrl": "input",
		"f_rule": "{\"intNumber\" :true, \"digits\":true, \"min\" : 1, \"max\" : 99}",
		"f_id": 55,
		"f_type": "java.lang.Integer",
		"category": "MemberInfo",
		"key": "age"
	}]
}, {
	"g_name": "会员等级",
	"g_id": 10,
	"fields": [{
		"g_id": 10,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}, {
			"unqueName": "normalNotIn",
			"o_name": "不包含",
			"o_remark": "普通零散值的不包含",
			"o_default": null
		}, {
			"unqueName": "AllMember",
			"o_name": "全部会员",
			"o_remark": "全部会员(即会员等级不为空)",
			"o_default": "0"
		}],
		"f_name": "会员等级",
		"f_form_ctrl": "input",
		"f_rule": null,
		"f_id": 5,
		"f_type": "java.lang.Long",
		"category": "MemberInfo",
		"key": "cardTypeKey"
	}]
}, {
	"g_name": "开卡年限",
	"g_id": 11,
	"fields": [{
		"g_id": 11,
		"ops": [{
			"unqueName": "normalGreater",
			"o_name": "大于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalNotEqual",
			"o_name": "不等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "BetweenOperator",
			"o_name": "包含区间",
			"o_remark": "普通数值的包含区间",
			"o_default": null
		}, {
			"unqueName": "not_BetweenOperator",
			"o_name": "不包含区间",
			"o_remark": "不包含区间",
			"o_default": null
		}],
		"f_name": "开卡年限",
		"f_form_ctrl": "input",
		"f_rule": "{\"intNumber\" :true, \"digits\":true, \"min\" : 1, \"max\":99}",
		"f_id": 57,
		"f_type": "java.lang.Integer",
		"category": "MemberInfo",
		"key": "openYears"
	}]
}, {
	"g_name": "开卡日期",
	"g_id": 12,
	"fields": [{
		"g_id": 12,
		"ops": [{
			"unqueName": "TimeGreaterOperator",
			"o_name": "大于",
			"o_remark": "日期大于",
			"o_default": null
		}, {
			"unqueName": "TimeEqualOperator",
			"o_name": "等于",
			"o_remark": "日期等于",
			"o_default": null
		}, {
			"unqueName": "TimeLessOperator",
			"o_name": "小于",
			"o_remark": "日期小于",
			"o_default": null
		}, {
			"unqueName": "TimeGreaterEqualOperator",
			"o_name": "大于等于",
			"o_remark": "日期大于等于",
			"o_default": null
		}, {
			"unqueName": "TimeLessEqualOperator",
			"o_name": "小于等于",
			"o_remark": "日期小于等于",
			"o_default": null
		}, {
			"unqueName": "not_TimeEqualOperator",
			"o_name": "不等于",
			"o_remark": "日期不等于",
			"o_default": null
		}, {
			"unqueName": "DateRangeContainOperator",
			"o_name": "包含区间",
			"o_remark": "日期区间范围, 可填入多组, 每组2个值",
			"o_default": null
		}, {
			"unqueName": "not_DateRangeContainOperator",
			"o_name": "不包含区间",
			"o_remark": "日期区间范围, 可填入多组, 每组2个值",
			"o_default": null
		}],
		"f_name": "开卡日期",
		"f_form_ctrl": "dateInput",
		"f_rule": null,
		"f_id": 58,
		"f_type": "java.util.Date",
		"category": "MemberInfo",
		"key": "openDate"
	}]
}, {
	"g_name": "注册商户",
	"g_id": 13,
	"fields": [{
		"g_id": 13,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}, {
			"unqueName": "normalNotIn",
			"o_name": "不包含",
			"o_remark": "普通零散值的不包含",
			"o_default": null
		}],
		"f_name": "注册商户",
		"f_form_ctrl": "input",
		"f_rule": null,
		"f_id": 59,
		"f_type": "java.lang.String",
		"category": "MemberInfo",
		"key": "registerBusinessCode"
	}]
}, {
	"g_name": "交易商户",
	"g_id": 14,
	"fields": [{
		"g_id": 14,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}],
		"f_name": "交易商户",
		"f_form_ctrl": "input",
		"f_rule": null,
		"f_id": 80,
		"f_type": "java.lang.String",
		"category": "SaleInfo",
		"key": "businessCode"
	}]
}, {
	"g_name": "交易影院",
	"g_id": 19,
	"fields": [{
		"g_id": 19,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}, {
			"unqueName": "normalNotIn",
			"o_name": "不包含",
			"o_remark": "普通零散值的不包含",
			"o_default": null
		}],
		"f_name": "影院编码",
		"f_form_ctrl": "input",
		"f_rule": null,
		"f_id": 30,
		"f_type": "java.lang.String",
		"category": "SaleInfo",
		"key": "cinemaCode"
	}]
}, {
	"g_name": "指定商品购买数量",
	"g_id": 21,
	"fields": [{
		"g_id": 21,
		"ops": [{
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}],
		"f_name": "商品名称",
		"f_form_ctrl": "input",
		"f_rule": null,
		"f_id": 129,
		"f_type": "java.lang.String",
		"category": "MerchandiseInfo",
		"key": "merKey"
	}, {
		"g_id": 21,
		"ops": [{
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}],
		"f_name": "数量",
		"f_form_ctrl": "input",
		"f_rule": "{\"intNumber\" : true, \"min\":1, \"max\" : 99999}",
		"f_id": 4,
		"f_type": "java.math.BigDecimal",
		"category": "MerchandiseInfo",
		"key": "amount"
	}]
}, {
	"g_name": "交易影院行政区域",
	"g_id": 25,
	"fields": [{
		"g_id": 25,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}, {
			"unqueName": "normalNotIn",
			"o_name": "不包含",
			"o_remark": "普通零散值的不包含",
			"o_default": null
		}],
		"f_name": "交易影院行政区域",
		"f_form_ctrl": "input",
		"f_rule": null,
		"f_id": 31,
		"f_type": "java.lang.String",
		"category": "SaleInfo",
		"key": "cinemaAreaId"
	}]
}, {
	"g_name": "整单交易金额",
	"g_id": 26,
	"fields": [{
		"g_id": 26,
		"ops": [{
			"unqueName": "normalGreater",
			"o_name": "大于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalNotEqual",
			"o_name": "不等于",
			"o_remark": null,
			"o_default": null
		}],
		"f_name": "整单交易金额",
		"f_form_ctrl": "input",
		"f_rule": "{\"floatNumber\" :[5,2], \"min\" : 0.01}",
		"f_id": 27,
		"f_type": "java.math.BigDecimal",
		"category": "SaleInfo",
		"key": "sumPrice"
	}]
}, {
	"g_name": "消费者身份",
	"g_id": 27,
	"fields": [{
		"g_id": 27,
		"ops": [{
			"unqueName": "AllMember",
			"o_name": "全部会员",
			"o_remark": "全部会员(即会员等级不为空)",
			"o_default": "0"
		}, {
			"unqueName": "AppointMember",
			"o_name": "指定会员等级",
			"o_remark": "指定会员等级(某些group需要)",
			"o_default": null
		}, {
			"unqueName": "not_memberOperator",
			"o_name": "非会员",
			"o_remark": "判空",
			"o_default": null
		}],
		"f_name": "消费者身份",
		"f_form_ctrl": "input",
		"f_rule": null,
		"f_id": 34,
		"f_type": "java.lang.Long",
		"category": "SaleInfo",
		"key": "consumerTypeKey"
	}]
}, {
	"g_name": "同类商品累计购买数量",
	"g_id": 28,
	"fields": [{
		"g_id": 28,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}],
		"f_name": "商品类别",
		"f_form_ctrl": "input",
		"f_rule": null,
		"f_id": 40,
		"f_type": "java.lang.String",
		"category": "SaleItemStatis",
		"key": "classCode"
	}, {
		"g_id": 28,
		"ops": [{
			"unqueName": "MerStatisItemAmountGreater",
			"o_name": "大于",
			"o_remark": "商品统计类加数量总和大于",
			"o_default": null
		}, {
			"unqueName": "MerStatisItemAmountEqual",
			"o_name": "等于",
			"o_remark": "商品统计类加数量总和等于",
			"o_default": null
		}, {
			"unqueName": "MerStatisItemAmountLess",
			"o_name": "小于",
			"o_remark": "商品统计类加数量总和小于",
			"o_default": null
		}, {
			"unqueName": "MerStatisItemAmountGreaterEqual",
			"o_name": "大于等于",
			"o_remark": "商品统计类加数量总和大于等于",
			"o_default": null
		}, {
			"unqueName": "MerStatisItemAmountLessEqual",
			"o_name": "小于等于",
			"o_remark": "商品统计类加数量总和小于等于",
			"o_default": null
		}],
		"f_name": "累计购买数量",
		"f_form_ctrl": "input",
		"f_rule": "{\"intNumber\" : true, \"min\":1, \"max\" : 99999}",
		"f_id": 43,
		"f_type": "java.math.BigDecimal",
		"category": "SaleItemStatis",
		"key": "sumAmount"
	}]
}, {
	"g_name": "同品牌商品累计购买数量",
	"g_id": 29,
	"fields": [{
		"g_id": 29,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}],
		"f_name": "商品品牌",
		"f_form_ctrl": "input",
		"f_rule": null,
		"f_id": 41,
		"f_type": "java.lang.String",
		"category": "SaleItemStatis",
		"key": "brandId"
	}, {
		"g_id": 29,
		"ops": [{
			"unqueName": "MerStatisItemAmountGreater",
			"o_name": "大于",
			"o_remark": "商品统计类加数量总和大于",
			"o_default": null
		}, {
			"unqueName": "MerStatisItemAmountEqual",
			"o_name": "等于",
			"o_remark": "商品统计类加数量总和等于",
			"o_default": null
		}, {
			"unqueName": "MerStatisItemAmountLess",
			"o_name": "小于",
			"o_remark": "商品统计类加数量总和小于",
			"o_default": null
		}, {
			"unqueName": "MerStatisItemAmountGreaterEqual",
			"o_name": "大于等于",
			"o_remark": "商品统计类加数量总和大于等于",
			"o_default": null
		}, {
			"unqueName": "MerStatisItemAmountLessEqual",
			"o_name": "小于等于",
			"o_remark": "商品统计类加数量总和小于等于",
			"o_default": null
		}],
		"f_name": "累计购买数量",
		"f_form_ctrl": "input",
		"f_rule": "{\"intNumber\" : true, \"min\":1, \"max\" : 99999}",
		"f_id": 43,
		"f_type": "java.math.BigDecimal",
		"category": "SaleItemStatis",
		"key": "sumAmount"
	}]
}, {
	"g_name": "商品单价",
	"g_id": 31,
	"fields": [{
		"g_id": 31,
		"ops": [{
			"unqueName": "normalGreater",
			"o_name": "大于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalNotEqual",
			"o_name": "不等于",
			"o_remark": null,
			"o_default": null
		}],
		"f_name": "商品单价",
		"f_form_ctrl": "input",
		"f_rule": "{\"floatNumber\" :[5,2],\"min\" : 0.01}",
		"f_id": 7,
		"f_type": "java.math.BigDecimal",
		"category": "SaleItemInfo",
		"key": "price"
	}]
}, {
	"g_name": "交易渠道",
	"g_id": 32,
	"fields": [{
		"g_id": 32,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}, {
			"unqueName": "normalNotIn",
			"o_name": "不包含",
			"o_remark": "普通零散值的不包含",
			"o_default": null
		}],
		"f_name": "交易渠道",
		"f_form_ctrl": "multiSelect",
		"f_rule": null,
		"f_id": 28,
		"f_type": "java.lang.String",
		"category": "SaleInfo",
		"key": "consumeWayCode"
	}]
}, {
	"g_name": "交易类型",
	"g_id": 33,
	"fields": [{
		"g_id": 33,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}, {
			"unqueName": "normalNotIn",
			"o_name": "不包含",
			"o_remark": "普通零散值的不包含",
			"o_default": null
		}],
		"sources": [{
			"label": "消费",
			"value": "BUY"
		}, {
			"label": "充值",
			"value": "MEMBER_ADD_AMOUNT"
		}, {
			"label": "退货",
			"value": "REJECT"
		}],
		"f_name": "交易类型",
		"f_form_ctrl": "multiSelect",
		"f_rule": null,
		"f_id": 33,
		"f_type": "java.lang.String",
		"category": "SaleInfo",
		"key": "tradeType"
	}]
}, {
	"g_name": "影片类型",
	"g_id": 34,
	"fields": [{
		"g_id": 34,
		"ops": [{
			"unqueName": "stringSplitContainOneOperator",
			"o_name": "包含",
			"o_remark": "逗号分隔的值有交集",
			"o_default": null
		}, {
			"unqueName": "notStringSplitContainOneOperator",
			"o_name": "不包含",
			"o_remark": "逗号分隔的值无交集",
			"o_default": null
		}],
		"f_name": "影片类型",
		"f_form_ctrl": "input",
		"f_rule": null,
		"f_id": 18,
		"f_type": "java.lang.String",
		"category": "FilmTicketInfo",
		"key": "filmTypeKey"
	}]
}, {
	"g_name": "放映效果",
	"g_id": 35,
	"fields": [{
		"g_id": 35,
		"ops": [{
			"unqueName": "FieldStringIndexOf",
			"o_name": "包含",
			"o_remark": "属性值中的字符串出现在某个操作数中",
			"o_default": null
		}, {
			"unqueName": "notFieldStringIndexOf",
			"o_name": "不包含",
			"o_remark": "属性值中的字符串没有出现在所有操作数中",
			"o_default": null
		}],
		"f_name": "放映效果",
		"f_form_ctrl": "input",
		"f_rule": null,
		"f_id": 19,
		"f_type": "java.lang.String",
		"category": "FilmTicketInfo",
		"key": "showEffect"
	}]
}, {
	"g_name": "影厅类型",
	"g_id": 36,
	"fields": [{
		"g_id": 36,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}, {
			"unqueName": "normalNotIn",
			"o_name": "不包含",
			"o_remark": "普通零散值的不包含",
			"o_default": null
		}],
		"f_name": "影厅类型",
		"f_form_ctrl": "input",
		"f_rule": null,
		"f_id": 20,
		"f_type": "java.lang.String",
		"category": "FilmTicketInfo",
		"key": "hallTypeKey"
	}]
}, {
	"g_name": "放映厅座位数",
	"g_id": 37,
	"fields": [{
		"g_id": 37,
		"ops": [{
			"unqueName": "normalGreater",
			"o_name": "大于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalNotEqual",
			"o_name": "不等于",
			"o_remark": null,
			"o_default": null
		}],
		"f_name": "放映厅座位数",
		"f_form_ctrl": "input",
		"f_rule": "{\"intNumber\" : true, \"min\":1, \"max\" : 99999}",
		"f_id": 21,
		"f_type": "java.lang.Integer",
		"category": "FilmTicketInfo",
		"key": "hallSeatAmout"
	}]
}, {
	"g_name": "最低发行价",
	"g_id": 38,
	"fields": [{
		"g_id": 38,
		"ops": [{
			"unqueName": "normalGreater",
			"o_name": "大于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalNotEqual",
			"o_name": "不等于",
			"o_remark": null,
			"o_default": null
		}],
		"f_name": "最低发行价",
		"f_form_ctrl": "input",
		"f_rule": "{\"floatNumber\" :[3,2],\"min\" : 0.01}",
		"f_id": 22,
		"f_type": "java.math.BigDecimal",
		"category": "FilmTicketInfo",
		"key": "lowestPrice"
	}]
}, {
	"g_name": "品牌",
	"g_id": 40,
	"fields": [{
		"g_id": 40,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}, {
			"unqueName": "normalNotIn",
			"o_name": "不包含",
			"o_remark": "普通零散值的不包含",
			"o_default": null
		}],
		"f_name": "品牌",
		"f_form_ctrl": "input",
		"f_rule": null,
		"f_id": 10,
		"f_type": "java.lang.String",
		"category": "MerchandiseInfo",
		"key": "brandId"
	}]
}, {
	"g_name": "类别",
	"g_id": 41,
	"fields": [{
		"g_id": 41,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}, {
			"unqueName": "normalNotIn",
			"o_name": "不包含",
			"o_remark": "普通零散值的不包含",
			"o_default": null
		}],
		"f_name": "商品类别",
		"f_form_ctrl": "input",
		"f_rule": null,
		"f_id": 9,
		"f_type": "java.lang.String",
		"category": "MerchandiseInfo",
		"key": "classCode"
	}]
}, {
	"g_name": "店内码",
	"g_id": 42,
	"fields": [{
		"g_id": 42,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}, {
			"unqueName": "normalNotIn",
			"o_name": "不包含",
			"o_remark": "普通零散值的不包含",
			"o_default": null
		}],
		"f_name": "店内码",
		"f_form_ctrl": "input",
		"f_rule": "{\"splitNumLength\":[1,8]}",
		"f_id": 3,
		"f_type": "java.lang.String",
		"category": "MerchandiseInfo",
		"key": "merCode"
	}]
}, {
	"g_name": "国际条码",
	"g_id": 43,
	"fields": [{
		"g_id": 43,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}, {
			"unqueName": "normalNotIn",
			"o_name": "不包含",
			"o_remark": "普通零散值的不包含",
			"o_default": null
		}],
		"f_name": "国际条码",
		"f_form_ctrl": "input",
		"f_rule": "{\"splitNumLength\":[1, 13]}",
		"f_id": 2,
		"f_type": "java.lang.String",
		"category": "MerchandiseInfo",
		"key": "merBarCode"
	}]
}, {
	"g_name": "商品名称",
	"g_id": 46,
	"fields": [{
		"g_id": 46,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}, {
			"unqueName": "normalNotIn",
			"o_name": "不包含",
			"o_remark": "普通零散值的不包含",
			"o_default": null
		}],
		"f_name": "商品名称",
		"f_form_ctrl": "input",
		"f_rule": null,
		"f_id": 129,
		"f_type": "java.lang.String",
		"category": "MerchandiseInfo",
		"key": "merKey"
	}]
}, {
	"g_name": "累计积分",
	"g_id": 52,
	"fields": [{
		"g_id": 52,
		"ops": [{
			"unqueName": "normalGreater",
			"o_name": "大于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalNotEqual",
			"o_name": "不等于",
			"o_remark": null,
			"o_default": null
		}],
		"f_name": "累计积分",
		"f_form_ctrl": "input",
		"f_rule": "{\"floatNumber\" :[8,2],\"min\" : 0.01}",
		"f_id": 52,
		"f_type": "java.lang.Integer",
		"category": "MemberInfo",
		"key": "integralTotall"
	}]
}, {
	"g_name": "影片",
	"g_id": 79,
	"fields": [{
		"g_id": 79,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}, {
			"unqueName": "normalNotIn",
			"o_name": "不包含",
			"o_remark": "普通零散值的不包含",
			"o_default": null
		}],
		"f_name": "影片编码",
		"f_form_ctrl": "input",
		"f_rule": null,
		"f_id": 67,
		"f_type": "java.lang.String",
		"category": "FilmTicketInfo",
		"key": "uniformCode"
	}]
}, {
	"g_name": "影票商品数量",
	"g_id": 80,
	"fields": [{
		"g_id": 80,
		"ops": [{
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}],
		"f_name": "影票商品数量",
		"f_form_ctrl": "input",
		"f_rule": "{\"intNumber\" :true, \"min\" : 1, \"max\":1000}",
		"f_id": 144,
		"f_type": "java.lang.Integer",
		"category": "SaleInfo",
		"key": "filmTicketAmount"
	}]
}, {
	"g_name": "放映有效期",
	"g_id": 81,
	"fields": [{
		"g_id": 81,
		"ops": [{
			"unqueName": "TimeBetweenOperator",
			"o_name": "包含范围",
			"o_remark": "时间在区间内",
			"o_default": null
		}, {
			"unqueName": "DayContainOperator",
			"o_name": "包含每月指定日",
			"o_remark": "日期包含在列表中, 只对比日",
			"o_default": null
		}, {
			"unqueName": "not_DayContainOperator",
			"o_name": "不包含每月指定日",
			"o_remark": "日期不包含在列表中, 只对比日",
			"o_default": null
		}],
		"f_name": "电影放映时间",
		"f_form_ctrl": "dateInput",
		"f_rule": null,
		"f_id": 150,
		"f_type": "java.lang.String",
		"category": "FilmTicketInfo",
		"key": "planStartTime"
	}]
}, {
	"g_name": "放映排除日期",
	"g_id": 82,
	"fields": [{
		"g_id": 82,
		"ops": [{
			"unqueName": "not_RelateDateHolidayOperator",
			"o_name": "节假日除外",
			"o_remark": "指定日期是否节假日，判断关联属性",
			"o_default": null
		}, {
			"unqueName": "not_DateRangeContainOperator",
			"o_name": "不包含区间",
			"o_remark": "日期区间范围, 可填入多组, 每组2个值",
			"o_default": null
		}],
		"f_name": "放映排除日期",
		"f_form_ctrl": "dateInput",
		"f_rule": null,
		"f_id": 151,
		"f_type": "java.lang.String",
		"category": "FilmTicketInfo",
		"key": "filmPlanInvalidTime"
	}]
}, {
	"g_name": "放映星期范围",
	"g_id": 83,
	"fields": [{
		"g_id": 83,
		"ops": [{
			"unqueName": "WeekDateOperator",
			"o_name": "周一到周五",
			"o_remark": "周一到周五",
			"o_default": "1,2,3,4,5"
		}, {
			"unqueName": "WeekDateRangeOperator",
			"o_name": "指定星期范围",
			"o_remark": "指定星期",
			"o_default": null
		}],
		"sources": [{
			"label": "周一",
			"value": "1"
		}, {
			"label": "周二",
			"value": "2"
		}, {
			"label": "周三",
			"value": "3"
		}, {
			"label": "周四",
			"value": "4"
		}, {
			"label": "周五",
			"value": "5"
		}, {
			"label": "周六",
			"value": "6"
		}, {
			"label": "周日",
			"value": "7"
		}],
		"f_name": "放映星期范围",
		"f_form_ctrl": "multiSelect",
		"f_rule": null,
		"f_id": 152,
		"f_type": "java.lang.String",
		"category": "FilmTicketInfo",
		"key": "filmPlanWeekRange"
	}]
}, {
	"g_name": "放映时段范围",
	"g_id": 84,
	"fields": [{
		"g_id": 84,
		"ops": [{
			"unqueName": "MorningOperator",
			"o_name": "上午（09:00—12:59）",
			"o_remark": null,
			"o_default": "[[\"09:00\",\"12:59\"]]"
		}, {
			"unqueName": "AfternoonOperator",
			"o_name": "下午（13:00—16:59）",
			"o_remark": null,
			"o_default": "[[\"13:00\",\"16:59\"]]"
		}, {
			"unqueName": "NightOperator",
			"o_name": "晚上（17:00—02:00）",
			"o_remark": null,
			"o_default": "[[\"17:00\",\"02:00\"]]"
		}, {
			"unqueName": "TimeRangeContainOperator",
			"o_name": "指定时段范围",
			"o_remark": "时间区间范围, 可填入多组, 每组2个值",
			"o_default": null
		}],
		"f_name": "放映时段范围",
		"f_form_ctrl": "timeInput",
		"f_rule": null,
		"f_id": 153,
		"f_type": "java.lang.String",
		"category": "FilmTicketInfo",
		"key": "filmPlanTimeRange"
	}]
}, {
	"g_name": "支付方式(柜台用)",
	"g_id": 86,
	"fields": [{
		"g_id": 86,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}, {
			"unqueName": "normalNotIn",
			"o_name": "不包含",
			"o_remark": "普通零散值的不包含",
			"o_default": null
		}],
		"f_name": "支付方式(柜台用)",
		"f_form_ctrl": "input",
		"f_rule": null,
		"f_id": 83,
		"f_type": "java.lang.String",
		"category": "SaleInfo",
		"key": "payTypeCode"
	}]
}, {
	"g_name": "开卡月限",
	"g_id": 87,
	"fields": [{
		"g_id": 87,
		"ops": [{
			"unqueName": "normalGreater",
			"o_name": "大于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalNotEqual",
			"o_name": "不等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "BetweenOperator",
			"o_name": "包含区间",
			"o_remark": "普通数值的包含区间",
			"o_default": null
		}, {
			"unqueName": "not_BetweenOperator",
			"o_name": "不包含区间",
			"o_remark": "不包含区间",
			"o_default": null
		}],
		"f_name": "开卡月限",
		"f_form_ctrl": "input",
		"f_rule": "{\"intNumber\" :true, \"digits\":true, \"min\" : 0, \"max\":999}",
		"f_id": 165,
		"f_type": "java.lang.Integer",
		"category": "MemberInfo",
		"key": "openMonths"
	}]
}, {
	"g_name": "座位等级",
	"g_id": 89,
	"fields": [{
		"g_id": 89,
		"ops": [{
			"unqueName": "normalIn",
			"o_name": "包含",
			"o_remark": "普通零散值的包含",
			"o_default": null
		}, {
			"unqueName": "normalNotIn",
			"o_name": "不包含",
			"o_remark": "普通零散值的不包含",
			"o_default": null
		}],
		"sources": [{
			"label": "0",
			"value": "0"
		}, {
			"label": "1",
			"value": "1"
		}, {
			"label": "2",
			"value": "2"
		}, {
			"label": "3",
			"value": "3"
		}, {
			"label": "4",
			"value": "4"
		}, {
			"label": "5",
			"value": "5"
		}, {
			"label": "6",
			"value": "6"
		}, {
			"label": "7",
			"value": "7"
		}, {
			"label": "8",
			"value": "8"
		}, {
			"label": "9",
			"value": "9"
		}],
		"f_name": "座位等级",
		"f_form_ctrl": "multiSelect",
		"f_rule": null,
		"f_id": 168,
		"f_type": "java.lang.Integer",
		"category": "FilmTicketInfo",
		"key": "seatGrade"
	}]
}, {
	"g_name": "影票总金额",
	"g_id": 90,
	"fields": [{
		"g_id": 90,
		"ops": [{
			"unqueName": "normalGreater",
			"o_name": "大于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}],
		"f_name": "影票总金额",
		"f_form_ctrl": "input",
		"f_rule": "{\"floatNumber\" :[5,2], \"min\" : 0.01}",
		"f_id": 142,
		"f_type": "java.math.BigDecimal",
		"category": "SaleInfo",
		"key": "filmSumPrice"
	}]
}, {
	"g_name": "卖品总金额",
	"g_id": 91,
	"fields": [{
		"g_id": 91,
		"ops": [{
			"unqueName": "normalGreater",
			"o_name": "大于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}],
		"f_name": "卖品总金额",
		"f_form_ctrl": "input",
		"f_rule": "{\"floatNumber\" :[5,2], \"min\" : 0.01}",
		"f_id": 143,
		"f_type": "java.math.BigDecimal",
		"category": "SaleInfo",
		"key": "merSumPrice"
	}]
}, {
	"g_name": "影票单价",
	"g_id": 92,
	"fields": [{
		"g_id": 92,
		"ops": [{
			"unqueName": "normalGreater",
			"o_name": "大于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}],
		"f_name": "影票单价",
		"f_form_ctrl": "input",
		"f_rule": "{\"floatNumber\" :[5,2],\"min\" : 0.01}",
		"f_id": 169,
		"f_type": "java.math.BigDecimal",
		"category": "FilmTicketInfo",
		"key": "filmPrice"
	}]
}, {
	"g_name": "卖品单价",
	"g_id": 93,
	"fields": [{
		"g_id": 93,
		"ops": [{
			"unqueName": "normalGreater",
			"o_name": "大于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}],
		"f_name": "卖品单价",
		"f_form_ctrl": "input",
		"f_rule": "{\"floatNumber\" :[5,2],\"min\" : 0.01}",
		"f_id": 170,
		"f_type": "java.math.BigDecimal",
		"category": "MerchandiseInfo",
		"key": "merPrice"
	}]
}, {
	"g_name": "放映前N天",
	"g_id": 94,
	"fields": [{
		"g_id": 94,
		"ops": [{
			"unqueName": "normalGreater",
			"o_name": "大于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}],
		"f_name": "放映前N天",
		"f_form_ctrl": "input",
		"f_rule": "{\"intNumber\" : true, \"min\":0, \"max\" : 9999}",
		"f_id": 171,
		"f_type": "java.lang.Integer",
		"category": "FilmTicketInfo",
		"key": "filmStartDayBefore"
	}]
}, {
	"g_name": "放映前N小时",
	"g_id": 95,
	"fields": [{
		"g_id": 95,
		"ops": [{
			"unqueName": "normalGreater",
			"o_name": "大于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalEqual",
			"o_name": "等于",
			"o_remark": "普通的等于(注意要和每等于区别)",
			"o_default": null
		}, {
			"unqueName": "normalLess",
			"o_name": "小于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalGreaterEqual",
			"o_name": "大于等于",
			"o_remark": null,
			"o_default": null
		}, {
			"unqueName": "normalLessEqual",
			"o_name": "小于等于",
			"o_remark": null,
			"o_default": null
		}],
		"f_name": "放映前N小时",
		"f_form_ctrl": "input",
		"f_rule": "{\"intNumber\" : true, \"min\":0, \"max\" : 9999}",
		"f_id": 172,
		"f_type": "java.lang.Integer",
		"category": "FilmTicketInfo",
		"key": "filmStartHourBefore"
	}]
},
{
	"g_name": "放映星期时间范围",
	"g_id": 99,
	"fields": [{
		"g_id": 99,
		"ops": [{
			"unqueName": "WeekTimeRangeOperator",
			"o_name": "指定星期时段范围",
			"o_remark": "时间区间范围, 可填入多组",
			"o_default": null
		}],
		"f_name": "星期时段范围",
		"f_form_ctrl": "timeInput",
		"f_rule": null,
		"f_type": "java.util.Date",
		"category": "CommonInfo",
		"key": "validWeekTimeRange"
	}]
}];



