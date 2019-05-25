//营销活动规则部分传值JSON解析
{
	"templateId": "1",		//模版ID
	"name": "1234",			//营销活动名称
	"remark": "1234",		//营销活动简介
	"executeMode": "AUTO_MATCH",	//执行策略;自动/推荐   AUTO_MATCH/AUTO_MATCH_RECOMMEND
	"priority": "0",				//优先级
	"validDateStart": "2019-03-04",	//有效开始日期
	"validDateEnd": "2019-03-29",	//有效结束日期
	"bizId" : "1",//营销活动id
	"bizOrderCode" : "YX11234290192",//营销活动编号
	commonInfo : [{ //公共规则部分
		key : 'holiday'   , //属性名称;对照志雄企业微信群中发出的'规则属性对照表' 中的 modelFieldName 介绍
		value : '',//属性值
		opUniqueName : '',//操作符,不填默认为 =
		text : ''//属性对应的描述,如: 属性值为影院编码的时候,这里填写影院名称
		category : "",//对应模板属性中的category
		groupId : 1,//分组id，没有可空
	}],

	rules : [{
		name : '',//规则名称
		ruleConditions : [{	//规则项
			key : '',
			value : '',
			opUniqueName : '',//操作符,不填默认为 =
			category : "",//对应模板属性中的category
			groupId : 1,//分组id
			text : ''
		}],
		
		actions : [ 
			{
				opUniqueName : "",// 对应'营销活动执行方法组分析.js'中的actionFnUniqueName
				key : '', //对应志雄企业微信群中发出的'规则属性对照表' 中的   fnParameterName 介绍
				value : '', //对应该属性的值,到时候会列出所有票券相关规则的key和值
				groupId : 1,//分组id
				text : ''//
			}
		],
		"bizPropertyMap":{		// 活动预算信息，具体值待定
			{
				"runAmount":"2",				//执行次数
				"runRestrainType":"perDay",		//预算周期限制   perDay 每天，perWeek 每周，perMonth 每月，perYear 每年，appointTimeRange 指定周期 选择appointTimeRange时appointRunRestrainRange传值
				"appointRunRestrainRange":"[[\"2019-02-27\",\"2019-03-26\"]]",	//指定周期限制
				"budgetSet":"discount",			//预算设置 : discount 优惠金额，allowance 补贴金额
				"totalDiscountAmount":"99.89",	//总优惠金额限制
				"userTradeAmount":"5",			//单用户交易限制
				"customerRegCardAmount":"5",	//总开卡数限制
				"totalOrdersAmount":"5",		//总订单数限制
				"totalTicketsAmount":"5"		//总票数限制
			}
		}
	}]

}

// 公共规则部分内容,这部分是写死在界面上,所有营销活动都通用的,其他不通用的可以从'营销活动执行方法组分析.js' 中找到

1. 节假日排除与否 ,展现形式 : checkbox;  若未选中,则不需要传这个JSON  
	key :	holiday 
	category : CommonInfo
	opUniqueName :	not_HolidayOperator 
	value : 不要
	text : 不要

2. 指定排除日期范围 , 展现形式 : checkbox ; 若未选中,则不需要传这个JSON
	key :	appointInvalidDate 
	category : CommonInfo
	opUniqueName :	not_DateRangeContainOperator 
	value : [["2019-02-04","2019-02-27"],["2019-02-28","2019-03-08"],["2019-03-09","2019-03-19"]]   // checkbox选中的情况下才需要
	text : 不要
	指定排除日期范围值解释: [[]]双重数组值,每个内部数组的值分别为 ["起始日期","结束日期"],起始日期不能大于结束日期

3. 星期范围 ,展示形式 : 下拉框,下拉框中存放opUniqueName,text分别为: 每天,周一至周五,指定星期范围,若选择为每天,则不需要传这个JSON
选中为WeekDateRangeOperator时,界面增加多选框,分别为周一至周日
	key	:	validWeek
	category : CommonInfo
	opUniqueName	: WeekDateOperator/WeekDateRangeOperator	// 解释: 周一至周五/指定范围(指定范围为: 周一,周二,周三,周四,周五,周六,周日)
	value	:	"1,2,3,4,5,6,7" //当下拉框选中为WeekDateRangeOperator时,对应周一至周日的值
	text	: 不要

4. 时段范围	, 展示形式: 下拉框,下拉框中存放opUniqueName,text分别为: 全天/上午/下午/晚上/自定义,若选择为全天,则不需要传这个JSON
	key	:	validTime
	category : CommonInfo
	opUniqueName : all/MorningOperator/AfternoonOperator/NightOperator/TimeRangeContainOperator //值解释: 全天/上午/下午/晚上/自定义
	value : '[["00:00","00:30"]]' 
	text	: 不要