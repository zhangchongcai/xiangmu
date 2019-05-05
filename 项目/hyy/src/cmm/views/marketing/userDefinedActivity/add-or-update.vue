<template>
<div>
    <div class="movie-plan_default" v-if="!addGroupShow">
        <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <!-- <el-breadcrumb-item>高级营销活动</el-breadcrumb-item> -->
                <el-breadcrumb-item>自定义营销活动</el-breadcrumb-item>
                <el-breadcrumb-item class="primary">{{isEdit=="update" ? '修改' : (isEdit=="detail" ? '查看' : (isEdit=="copy" ? '复制' : '新建'))}}自定义营销活动</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <el-collapse v-model="activeNames" @change="handleChange">
            <el-form :model="basicDataForm" :rules="basicDataRule" ref="basicDataForm" label-width="150px" class="common-form">
                <!-- 活动基础信息 -->
                <el-collapse-item title="活动基础信息" name="1">
                    <el-form-item label="活动名称" prop="activityName">
                        <el-input v-model="basicDataForm.activityName" placeholder="请输入活动名称" :disabled="disabled" @blur="valActivityName" maxlength="15"></el-input>
                    </el-form-item>
                    <el-form-item label="活动描述" prop="activityDesc">
                        <el-input type="textarea" v-model="basicDataForm.activityDesc" :disabled="disabled" placeholder="请输入活动描述" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="执行策略" size="mini" prop="executeMode">
                        <el-radio-group v-model="basicDataForm.executeMode" :disabled="disabled">
                            <el-radio :label="'AUTO_MATCH'">自动</el-radio>
                            <el-radio :label="'AUTO_MATCH_RECOMMEND'">推荐</el-radio>
                            <el-popover placement="right-start" title width="200" trigger="hover" content="1.自动执行策略：在交易时系统自动匹配执行的策略；
2.推荐执行策略：在交易时系统匹配并提示操作人员选择执行的策略；在自助体系（网站、手机APP及自助购票机等）的交易过程中，系统只匹配自动执行策略。例：
“会员半价”，这种活动在系统识别会员时打折，建议设置自动执行策略；
“刷招行信用卡25元购票”，对于这种活动必须由柜台操作员判断顾客是否持有相应的信用卡支付，确认后需手工点选实现打折，建议设置为推荐执行策略；
当同一个优先级存在多个匹配的活动时，系统提示操作员手工选择执行。">
                                <el-button type="text" slot="reference" class="el-icon-warning"></el-button>
                                <span style="color:#ffffff">1</span>
                            </el-popover>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="执行优先级" size="mini" prop="priorityNum" class="priorityNum">
                        <el-radio-group v-model="basicDataForm.priority" style="width:70%;" :disabled="disabled">
                            <el-radio :label="1" style="margin:6px 10px 15px 0;">输入优先级数字</el-radio>
                            <el-input v-if="basicDataForm.priority==1" v-model="basicDataForm.priorityNum" :disabled="disabled" placeholder="数值越大优先级越高(0-99)" min="0" max="99"></el-input>
                            <br>
                            <el-radio :label="2">按最优先执行</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="活动有效期" prop="validDateOption">
                        <el-date-picker v-model="basicDataForm.validDateOption" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="disabled" @change="setValidityDate"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="排除日期">
                        <el-checkbox-group v-model="basicDataForm.excludeDate" :disabled="disabled">
                            <el-checkbox :label="'节假日除外'" name="excludeDate">节假日除外</el-checkbox>
                            <el-checkbox :label="'指定排除日期范围'" name="excludeDate">指定排除日期范围</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <div v-if="basicDataForm.excludeDate.indexOf('指定排除日期范围')!=-1">
                        <el-form-item label v-for="(item,index) in basicDataForm.excludeDateOptions" :key="index">
                            <el-date-picker v-model="item.excludeDateOption" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="disabled" @change="setExcludeDate"></el-date-picker>
                            <el-button size="small" type="text" @click="delExcludeDate(index)">删除</el-button>
                        </el-form-item>
                    </div>

                    <el-form-item label v-if="basicDataForm.excludeDate.indexOf('指定排除日期范围')!=-1">
                        <div class="addDate" @click="addExcludeDate">
                            <i class="el-icon-circle-plus-outline"></i>添加时间
                        </div>
                    </el-form-item>

                    <el-form-item label="时段范围">
                        <el-select v-model="basicDataForm.timeRange" :disabled="disabled">
                            <el-option label="不限制" value="0"></el-option>
                            <el-option label="指定时段" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <div v-if="basicDataForm.timeRange==1 && basicDataForm.timeRangeSelect.length>0" class="timeRange_bg">
                        <div label v-for="(item,index) in basicDataForm.timeRangeSelect" :key="index" style="margin-bottom: -4px;">
                            <el-form-item>
                                <el-checkbox :indeterminate="item.isIndeterminateWithWorkDay" v-model="item.checkAllWorkDay" :disabled="disabled" @change="handleCheckAllWorkDayChange(item,$event)" style="float:left; margin-right:25px;">工作日</el-checkbox>

                                <el-checkbox-group v-model="item.workDay" :disabled="disabled" @change="handleCheckedWorkDayChange(item,$event)">
                                    <el-checkbox v-for="item in workDayOptions" :label="item.id" :key="item.id">{{item.text}}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>

                            <el-form-item label>
                                <el-checkbox :indeterminate="item.isIndeterminateWithWeekend" :disabled="disabled" v-model="item.checkAllWeekend" @change="handleCheckAllWeekendChange(item,$event)" style="float:left; margin-right:40px;">周末</el-checkbox>
                                <el-checkbox-group v-model="item.weekend" :disabled="disabled" @change="handleCheckedWeekendChange(item,$event)">
                                    <el-checkbox v-for="item in weekendOptions" :label="item.id" :key="item.id">{{item.text}}</el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>

                            <el-form-item label>
                                <el-time-picker is-range v-model="item.specifyTime" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="HH:mm:ss" :disabled="disabled" @change="setSpecifyTime" style="float:left;"></el-time-picker>
                                <div style="float:left; margin-left:25px;">
                                    <span>指定范围：</span>
                                    <el-button size="small" type="text" @click="amClick(item)">上午</el-button>
                                    <el-button size="small" type="text" @click="pmClick(item)">下午</el-button>
                                    <el-button size="small" type="text" @click="eveningClick(item)">晚上</el-button>
                                </div>
                            </el-form-item>
                        </div>
                    </div>
                    <el-form-item label v-if="basicDataForm.timeRange==1">
                        <div class="addDate" @click.stop="addTimeRangeSelect">
                            <i class="el-icon-circle-plus-outline"></i>添加时间
                        </div>
                    </el-form-item>

                    <el-form-item label="交易渠道">
                        <el-select v-model="basicDataForm.tradingChannel" :disabled="disabled" clearable>
                            <el-option label="不限" value></el-option>
                            <el-option label="包含" value="normalIn"></el-option>
                            <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                        <el-select v-if="basicDataForm.tradingChannel!=''" v-model="tradingChannelState" multiple collapse-tags @change="handleChangeSelect" :title="tradingChannelStateName.join(',')" clearable>
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-collapse-item>
                <!-- 分组活动执行条件 -->
                <el-collapse-item title="分组活动执行条件" name="2" class="addGroupLeft">
                    <div class="bigBtn">
                        <div class="def-tag" v-for="(rule,index) in rules" :key="index" closable @click="addGroup(rule,index)">
                            <i class="el-icon-close closeIcon" @click.stop="removeRule(index)"></i>
                            <span>{{rule.name}}</span>
                        </div>
                        <ul>
                            <li v-if="rules && rules.length<10" class="addBtn" @click="addGroup()">
                                <span class="icon el-icon-plus"></span>
                            </li>
                        </ul>
                    </div>
                </el-collapse-item>
                <!-- 设置活动预算 -->
                <el-collapse-item title="设置活动预算" name="3">
                    <el-form-item label="预算金额计算" prop="amountCalculation">
                        <el-select v-model="basicDataForm.amountCalculation" :disabled="disabled">
                            <el-option label="优惠金额" value="discount"></el-option>
                            <el-option label="补贴金额" value="allowance"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动总预算" prop="activityBudgetSum">
                        <el-select v-model="basicDataForm.activityBudgetSum" :disabled="disabled">
                            <el-option label="不限制" value></el-option>
                            <el-option label="指定预算限制" value="1"></el-option>
                        </el-select>
                        <div v-if="basicDataForm.activityBudgetSum==1">
                            <span>限制总票数</span>
                            <el-input style="width:20%;" v-model="basicDataForm.totalTicketsAmount" :disabled="disabled" placeholder="请输入"></el-input>
                            <span>张</span>
                            <br>
                            <span>限制总补贴金额</span>
                            <el-input style="width:20%;" v-model="basicDataForm.totalDiscountAmount" :disabled="disabled" placeholder="请输入"></el-input>
                            <span>元</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="活动总预算周期限制" prop="activityBudgetCycle">
                        <el-select v-model="basicDataForm.activityBudgetCycle" :disabled="disabled">
                            <el-option label="不限制" value></el-option>
                            <el-option label="每日限制" value="perDay"></el-option>
                            <el-option label="每周限制" value="perWeek"></el-option>
                            <el-option label="每月限制" value="perMonth"></el-option>
                            <el-option label="每年限制" value="perYear"></el-option>
                            <el-option label="指定周期限制" value="appointTimeRange"></el-option>
                        </el-select>
                        <el-date-picker v-if="basicDataForm.activityBudgetCycle == 'appointTimeRange'" v-model="basicDataForm.activityBudgetCycleDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="disabled"></el-date-picker>
                        <span v-if="basicDataForm.activityBudgetCycle!=''">
                <span>数量</span>
                        <el-input style="width:20%;" v-model="basicDataForm.activityBudgetCycleInput" :disabled="disabled" placeholder="请输入"></el-input>
                        <span>个</span>
                        </span>
                    </el-form-item>
                </el-collapse-item>
            </el-form>
        </el-collapse>
        <fixStepTool :stepData="stepData.stepList"></fixStepTool>
        <div style="margin-left:200px; margin-bottom:100px;">
            <el-button type="primary" v-if="isEdit!='detail'" @click="dataFormSubmit(2)">提交执行</el-button>
            <el-button type="primary" v-if="isEdit!='detail'" @click="dataFormSubmit(1)">保存草稿</el-button>
            <el-button @click="returnList()">返回</el-button>
        </div>
    </div>
    <add-group v-if="addGroupShow" ref="addGroup" @close="close" @transferData="transferData"></add-group>
</div>
</template>

<script>
import FixStepTool from "../../../components/fix-step-tool/fix-step-tool";
import fixStepMixin from "../../../mixins/marketing/fixStepTool.js";
import qs from "qs";
import AddGroup from "./addGroupActivity";
import RuleConditions from "./ruleConditions.json";
import Actions from "./actions.json";
import FormData from "./basicFormData.json";

export default {
    data() {
        return {
            // 折叠区域
            activeNames: ["1", "2", "3"],

            //步骤条数据
            stepData: {
                stepEl: ".el-collapse-item",
                stepList: [{
                        name: "活动基础信息",
                        isactive: false
                    },
                    {
                        name: "分组活动执行条件",
                        isactive: false
                    },
                    {
                        name: "设置活动预算",
                        isactive: false
                    }
                ]
            },
            basicDataRule: {
                activityName: [{
                    required: true,
                    message: "活动名称不能为空",
                    trigger: "blur"
                }],
                activityDesc: [{
                    required: true,
                    message: "活动描述不能为空",
                    trigger: "blur"
                }],
                validDateOption: [{
                    required: true,
                    message: "活动有效期不能为空",
                    trigger: "blur"
                }],
                amountCalculation: [{
                    required: true,
                    message: "预算金额计算不能为空",
                    trigger: "change"
                }],
                activityBudgetSum: [{
                    required: true,
                    message: "活动总预算不能为空",
                    trigger: "change"
                }],
                activityBudgetValid: [{
                    required: true,
                    message: "活动总预算周期限制不能为空",
                    trigger: "change"
                }]
            },

            workDayOptions: [{
                    id: 1,
                    text: "星期一"
                },
                {
                    id: 2,
                    text: "星期二"
                },
                {
                    id: 3,
                    text: "星期三"
                },
                {
                    id: 4,
                    text: "星期四"
                },
                {
                    id: 5,
                    text: "星期五"
                }
            ],
            weekendOptions: [{
                id: 6,
                text: "星期六"
            }, {
                id: 7,
                text: "星期天"
            }],

            isEdit: "",
            disabled: true,
            activityId: "",
            addGroupShow: false,

            rules: [],
            rule: [],
            //所有规则
            targetRules: [],

            //公共规则部分
            commonInfo: [],

            //活动预算
            bizPropertyMap: [],

            // //活动条件
            // ruleConditions: [],
            // //优惠方案
            // actions: [],

            // 活动基本信息
            basicDataForm: {
                tenantId: "1",
                activityCode: "",

                activityType: 33,
                activityName: "",
                activityDesc: "",
                executeMode: "AUTO_MATCH",
                priority: 1,
                priorityNum: "",
                validDateOption: [],
                validDateStart: "",
                validDateEnd: "",

                excludeDate: [],
                excludeDateOptions: [{
                    excludeDateOption: ""
                }], //指定排除日期
                excludeDateOption: [],

                /* 基础信息-时段范围 */
                timeRange: "0",
                timeRangeSelect: [{
                    isIndeterminateWithWorkDay: true,
                    checkAllWorkDay: false,
                    isIndeterminateWithWeekend: true,
                    checkAllWeekend: false,
                    workDay: [],
                    weekend: [],
                    specifyTime: ["08:00:00", "08:00:00"]
                }],

                tradingChannel: "", //交易渠道
                tradingChannelInput: "",

                // 设置活动预算
                amountCalculation: "discount",

                activityBudgetCycle: "",
                activityBudgetCycleInput: "",
                activityBudgetCycleDate: "",

                activityBudgetSum: "",
                totalDiscountAmount: "",
                totalTicketsAmount: ""
            },

            /* 基础信息-交易渠道 */
            tradingChannelState: [],
            tradingChannelStateName: [],
            options: [{
                    value: "",
                    label: "全选"
                },
                {
                    value: "1",
                    label: "柜台"
                },
                {
                    value: "2",
                    label: "自助终端"
                },
                {
                    value: "3",
                    label: "官方网站"
                },
                {
                    value: "4",
                    label: "手机APP"
                },
                {
                    value: "5",
                    label: "小程序"
                },
                {
                    value: "6",
                    label: "微信公众号"
                }
            ]
        };
    },
    mixins: [fixStepMixin],
    components: {
        fixStepTool: FixStepTool,
        AddGroup
    },
    created() {},
    watch: {
        tradingChannelState(val) {
            console.log(val);
            this.tradingChannelStateName = [];
            val.map(item => {
                if (item == 1) {
                    item = "柜台";
                } else if (item == 2) {
                    item = "自助终端";
                } else if (item == 3) {
                    item = "官方网站";
                } else if (item == 4) {
                    item = "手机APP";
                } else if (item == 5) {
                    item = "小程序";
                } else if (item == 6) {
                    item = "微信公众号";
                }
                this.tradingChannelStateName.push(item);
            });
            console.log(this.tradingChannelStateName);
        }
    },
    methods: {

        /********** 编辑数据回显 **********/
        init(row, isEdit) {
            if (row) {
                this.activityId = row.id || 0;
                this.isEdit = isEdit;
                if (this.isEdit == "copy") {
                    this.activityId = "";
                }
                let params = qs.stringify({
                    activityId: row.id,
                    tenantId: this.basicDataForm.tenantId
                });
                this.$cmmList
                    .marketingViewActivity(params)
                    .then(res => {
                        if (res && res.code === 200) {
                            let data = res.data.marketingActivityVO;
                            let ruleGroup = JSON.parse(
                                res.data.marketingActivityVO.ruleGroup
                            );

                            //基础信息
                            this.activityId = data.id;
                            this.basicDataForm.activityCode = data.activityCode;
                            this.basicDataForm.tenantId = ruleGroup.tenantId;
                            this.basicDataForm.activityType = ruleGroup.templateId;
                            this.basicDataForm.activityName = ruleGroup.name;
                            this.basicDataForm.activityDesc = ruleGroup.remark;
                            this.basicDataForm.executeMode = ruleGroup.executeMode;
                            this.basicDataForm.priority = ruleGroup.priority == 100 ? 2 : 1;
                            this.basicDataForm.priorityNum = ruleGroup.priority;
                            this.basicDataForm.validDateEnd = ruleGroup.validDateEnd;
                            this.basicDataForm.validDateStart = ruleGroup.validDateStart;

                            this.basicDataForm.validDateOption.push(ruleGroup.validDateStart);
                            this.basicDataForm.validDateOption.push(ruleGroup.validDateEnd);

                            let commonInfo = ruleGroup.commonInfo;
                            let bizPropertyMap = ruleGroup.rules[0].bizPropertyMap;
                            let rules = ruleGroup.rules;

                            //回显公共规则
                            this.showCommonInfo(commonInfo);

                            //回显活动预算
                            this.showBizPropertyMap(bizPropertyMap);

                            //回显所有规则
                            this.showRules(rules);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
            if (this.isEdit == "false") {
                this.disabled = true;
            } else {
                this.disabled = false;
            }
        },

        //回显公共规则
        showCommonInfo(commonInfo) {
            for (let item of commonInfo) {
                //排除日期
                if (item.key == "appointInvalidDate") {
                    this.basicDataForm.excludeDate.push("指定排除日期范围");
                    this.basicDataForm.excludeDateOptions = [];
                    let values = JSON.parse(item.value);
                    for (let value of values) {
                        let excludeDateOption = {
                            excludeDateOption: value
                        };
                        this.basicDataForm.excludeDateOptions.push(excludeDateOption);
                    }
                } else if (item.key == "holiday") {
                    this.basicDataForm.excludeDate.push("节假日除外");
                } else if (item.key == "consumeWayCode") {
                    //交易渠道
                    this.basicDataForm.tradingChannel = item.opUniqueName ?
                        item.opUniqueName :
                        "";
                    this.tradingChannelState = item.value.split(",");
                    this.basicDataForm.tradingChannelInput = this.tradingChannelState.join(
                        ","
                    );
                } else if (item.key == "validTime") {
                    this.basicDataForm.timeRange = "1";
                    if (item.value) {
                        this.basicDataForm.specifyTimes = JSON.parse(item.value);
                    }
                } else if (item.key == "validWeekTimeRange") {
                    //时段范围
                    this.basicDataForm.timeRange = "1";
                    this.basicDataForm.timeRangeSelect = [];
                    let weekValues = JSON.parse(item.value);
                    for (let weekValue of weekValues) {
                        let obj = {
                            isIndeterminateWithWorkDay: true,
                            checkAllWorkDay: false,
                            isIndeterminateWithWeekend: true,
                            checkAllWeekend: false,
                            workDay: [],
                            weekend: [],
                            specifyTime: []
                        };
                        for (let value of weekValue) {
                            if (
                                value == 1 ||
                                value == 2 ||
                                value == 3 ||
                                value == 4 ||
                                value == 5
                            ) {
                                obj.workDay.push(value);
                            } else if (value == 6 || value == 7) {
                                obj.weekend.push(value);
                            } else {
                                obj.specifyTime.push(value);
                            }
                        }
                        obj.checkAllWorkDay = false;
                        if (
                            obj.workDay &&
                            obj.workDay.length > 0 &&
                            obj.workDay.length == 5
                        ) {
                            obj.checkAllWorkDay = true;
                            obj.isIndeterminateWithWorkDay = false;
                        } else {
                            obj.checkAllWorkDay = false;
                            obj.isIndeterminateWithWorkDay = true;
                        }
                        obj.checkAllWeekend = false;
                        if (
                            obj.workend &&
                            obj.workend.length > 0 &&
                            obj.workend.length == 2
                        ) {
                            obj.checkAllWeekend = true;
                            obj.isIndeterminateWithWeekend = false;
                        } else {
                            obj.checkAllWeekend = false;
                            obj.isIndeterminateWithWeekend = true;
                        }
                        this.basicDataForm.timeRangeSelect.push(obj);
                    }
                }
            }
        },

        //回显活动预算
        showBizPropertyMap(bizPropertyMap) {
            this.basicDataForm.amountCalculation = bizPropertyMap.budgetSet;
            this.basicDataForm.activityBudgetCycle = bizPropertyMap.runRestrainType;
            if (bizPropertyMap.appointRunRestrainRange) {
                this.basicDataForm.activityBudgetCycle == "appointTimeRange";
                this.basicDataForm.activityBudgetCycleDate = JSON.parse(
                    bizPropertyMap.appointRunRestrainRange
                );
            }
            if (this.basicDataForm.activityBudgetCycle != "") {
                this.basicDataForm.activityBudgetCycleInput = bizPropertyMap.runAmount;
            }
            this.basicDataForm.totalDiscountAmount =
                bizPropertyMap.totalDiscountAmount;
            this.basicDataForm.totalTicketsAmount = bizPropertyMap.totalTicketsAmount;
            if (
                bizPropertyMap.totalDiscountAmount &&
                bizPropertyMap.totalTicketsAmount
            ) {
                this.basicDataForm.activityBudgetSum = "1";
            }
        },

        //回显所有规则
        showRules(rules) {
            //将RuleConditions转换成map结构便于取值
            let map = this.json2Map(RuleConditions);

            //将Actions转换成map结构便于取值
            let actMap = this.json2Map(Actions);

            for (let index = 0; index < rules.length; index++) {
                let rule = rules[index];
                let target = {
                    index: index,
                    name: rule.name,
                    formData: this.setFormData(rule, map, actMap),
                    conditions: this.setConditions(rule, map),
                    actions: this.setActions(rule, actMap)
                };
                this.rules.push(target);
            }
        },

        /** 目标格式
            简单数据： {"presentPoint1","赠送积分"},
            嵌套数据： { "couponApplyCode3",{"fkey": "giftTicket","fvalue": "赠送票券","svalue": "票券名称"}}
            表示[赠送票券]下的[票券名称] 对应formData[giftTicket][couponApplyCode3]
         */
        json2Map(param) {
            let map = new Map();
            for (let text of Object.keys(param)) {
                let item = param[text];
                if (!item.hasSon) {
                    map.set(item.key + item.groupId, text);
                } else {
                    let re = new RegExp("[\u4E00-\u9FA5]+");
                    for (let key of Object.keys(item)) {
                        if (re.test(key)) {
                            let action = item[key];
                            map.set(action.key + action.groupId, {
                                svalue: key,
                                fkey: item.key,
                                fvalue: text
                            });
                        }
                    }
                }
            }
            return map;
        },

        /** 目标格式
            [
              { key: "presentPoint1", value: "赠送积分" },
              { key: "giftTicket",value: "赠送票券"}
            ]
         */
        setActions(rule, actMap) {
            let targetActions = [];
            for (let action of rule.actions) {
                let key = action.key + action.groupId;
                let value = actMap.get(key);
                if (typeof value == "object") {
                    if (targetActions.length <= 0) {
                        targetActions.push({
                            key: value.fkey,
                            value: value.fvalue
                        });
                    } else {
                        let actionsKeys = targetActions.map(item => {
                            return item.key;
                        });
                        if (!actionsKeys.includes(value.fkey)) {
                            targetActions.push({
                                key: value.fkey,
                                value: value.fvalue
                            });
                        }
                    }
                } else {
                    targetActions.push({
                        key: key,
                        value: actMap.get(key)
                    });
                }
            }

            return targetActions;
        },

        /** 目标格式
           [
             { key: "sumPrice26", value: "整单交易金额" },
             {key: "buyNum",value: "指定商品购买数量"}
           ]
        */
        setConditions(rule, map) {
            let targetConditions = [];

            for (let cond of rule.ruleConditions) {
                let key = cond.key + cond.groupId;
                let value = map.get(key);
                if (typeof value == "object") {
                    if (targetConditions.length <= 0) {
                        targetConditions.push({
                            key: value.fkey,
                            value: value.fvalue
                        });
                    } else {
                        let conditionKeys = targetConditions.map(item => {
                            return item.key;
                        });
                        if (!conditionKeys.includes(value.fkey)) {
                            targetConditions.push({
                                key: value.fkey,
                                value: value.fvalue
                            });
                        }
                    }
                } else {
                    targetConditions.push({
                        key: key,
                        value: value
                    });
                }
            }

            return targetConditions;
        },

        setFormData(rule, map, actMap) {
            let formData = FormData; //formData初始数据
            formData.activityName = rule.name;

            for (let cond of rule.ruleConditions) {
                let key = cond.key + cond.groupId;
                let value = map.get(key);
                if (typeof value == "object") {
                    formData[value.fkey][key].opUniqueName = cond.opUniqueName ?
                        cond.opUniqueName :
                        "";
                    formData[value.fkey][key].value = cond.value ? cond.value : "";
                    formData[value.fkey][key].text = cond.text ? cond.text : "";
                } else {
                    formData[key].opUniqueName = cond.opUniqueName ?
                        cond.opUniqueName :
                        "";
                    formData[key].value = cond.value ? cond.value : "";
                    formData[key].text = cond.text ? cond.text : "";
                }
            }
            for (let action of rule.actions) {
                let key = action.key + action.groupId;
                let value = actMap.get(key);
                if (typeof value == "object") {
                    formData[value.fkey][key].value = action.value ? action.value : "";
                    formData[value.fkey][key].text = action.text ? action.text : "";
                } else {
                    formData[key].value = action.value ? action.value : "";
                    formData[key].text = action.text ? action.text : "";
                }
            }
            return formData;
        },

        /********** 编辑数据回显 **********/

        returnList() {
            this.$emit("refreshDataList");
        },
        handleChange(val) {
            console.log(val);
        },
        /* 选择交易渠道 */
        handleChangeSelect(data) {
            if (data.indexOf("") != -1) {
                data = ["1", "2", "3", "4", "5", "6"];
            }
            this.tradingChannelState = data;
            this.basicDataForm.tradingChannelInput = this.tradingChannelState.join(
                ","
            );
        },

        /* 修改活动有效期 */
        setValidityDate(val) {
            if (val) {
                this.basicDataForm.validDateStart = val[0];
                this.basicDataForm.validDateEnd = val[1];
                this.basicDataForm.dateOption = val;
                this.$refs["basicDataForm"].clearValidate(["dateOption"]);
            } else {
                this.basicDataForm.validDateStart = "";
                this.basicDataForm.validDateEnd = "";
                this.$refs["basicDataForm"].clearValidate(["dateOption"]);
            }
        },

        /* 修改排除日期 */
        setExcludeDate(val) {
            this.basicDataForm.excludeDateOption = val;
        },
        /* 添加排除日期 */
        addExcludeDate() {
            this.basicDataForm.excludeDateOptions.push({
                excludeDateOption: ""
            });
        },
        /* 删除排除日期 */
        delExcludeDate(index) {
            this.basicDataForm.excludeDateOptions.splice(index, 1);
        },

        /*时段范围- 全选工作日 */
        handleCheckAllWorkDayChange(item, val) {
            item.workDay = val ?
                this.workDayOptions.map(item => {
                    return item.id;
                }) : [];
            item.isIndeterminateWithWorkDay = false;
        },
        /*选中工作日 */
        handleCheckedWorkDayChange(item, value) {
            let checkedCount = value.length;
            item.checkAllWorkDay = checkedCount === this.workDayOptions.length;
            item.isIndeterminateWithWorkDay =
                checkedCount > 0 && checkedCount < this.workDayOptions.length;
        },
        /* 全选周末 */
        handleCheckAllWeekendChange(item, val) {
            item.weekend = val ?
                this.weekendOptions.map(item => {
                    return item.id;
                }) : [];
            item.isIndeterminateWithWeekend = false;
        },
        /*选中周末 */
        handleCheckedWeekendChange(item, value) {
            let checkedCount = value.length;
            item.checkAllWeekend = checkedCount === this.weekendOptions.length;
            item.isIndeterminateWithWeekend =
                checkedCount > 0 && checkedCount < this.weekendOptions.length;
        },
        /* 设置具体时间范围 */
        setSpecifyTime(val) {
            item.specifyTime = val;
        },
        /** 添加时段范围 */
        addTimeRangeSelect() {
            this.basicDataForm.timeRangeSelect.push({
                isIndeterminateWithWorkDay: true,
                checkAllWorkDay: false,
                isIndeterminateWithWeekend: true,
                checkAllWeekend: false,
                weekend: [],
                workDay: [],
                specifyTime: ["08:00:00", "08:00:00"]
            });
        },
        /** 删除时段范围 */
        delTimeRangeSelect(index) {
            this.basicDataForm.timeRangeSelect.splice(index, 1);
        },
        /* 上午时间范围 */
        amClick(item) {
            item.specifyTime = ["09:00:00", "12:59:00"];
        },
        /* 下午时间范围 */
        pmClick(item) {
            item.specifyTime = ["13:00:00", "16:59:00"];
        },
        /* 晚上时间范围 */
        eveningClick(item) {
            item.specifyTime = ["17:00:00", "02:00:00"];
        },
        // 验证名称是否一致
        valActivityName() {
            // let flag = this.movieTicketId?"0":"1"
            let params = qs.stringify({
                // "flag": flag,
                id: this.movieTicketId,
                name: this.basicDataForm.activityName,
                tenantId: "1"
            });
            if (this.basicDataForm.activityName != "") {
                this.$cmmList
                    .marketingValActivityName(params)
                    .then(data => {
                        console.log(data);
                        if (data && data.code === 200) {
                            if (data.data == "false") {
                                this.$message.error("活动名称已存在");
                                return;
                            }
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        },

        /* 组装公共规则数据 */
        buildCommonInfoData() {
            //排除日期
            if (this.basicDataForm.excludeDate.indexOf("节假日除外") != -1) {
                //节假日除外
                this.commonInfo.push({
                    category: "CommonInfo",
                    key: "holiday",
                    value: "",
                    text: "",
                    opUniqueName: "not_HolidayOperator"
                });
            }

            if (this.basicDataForm.excludeDate.indexOf("指定排除日期范围") != -1) {
                //指定排除日期范围
                let targetValue = this.basicDataForm.excludeDateOptions.map(item => {
                    if (item.excludeDateOption) {
                        return item.excludeDateOption;
                    }
                });
                this.commonInfo.push({
                    category: "CommonInfo",
                    key: "appointInvalidDate",
                    value: JSON.stringify(targetValue),
                    text: "",
                    opUniqueName: "not_DateRangeContainOperator"
                });
            }

            //时段范围
            let opUniqueName = "WeekTimeRangeOperator";
            let rangerValue = [];
            if (
                this.basicDataForm.timeRange == "1" &&
                this.basicDataForm.timeRangeSelect.length > 0
            ) {
                for (let item of this.basicDataForm.timeRangeSelect) {
                    let arr = [];
                    arr = item.workDay.concat(item.weekend).concat(item.specifyTime);
                    rangerValue.push(arr);
                }
                this.commonInfo.push({
                    category: "CommonInfo",
                    key: "validWeekTimeRange",
                    value: JSON.stringify(rangerValue),
                    text: "",
                    opUniqueName: opUniqueName
                });
            }

            // 交易渠道
            if (this.basicDataForm.tradingChannel != "") {
                this.commonInfo.push({
                    category: "SaleInfo",
                    key: "consumeWayCode",
                    value: this.basicDataForm.tradingChannelInput,
                    text: "",
                    opUniqueName: this.basicDataForm.tradingChannel
                });
            }
        },
        /* 组装活动预算数据 */
        buildBizPropertyMap() {
            let appointRunRestrainRange = "";
            if (this.basicDataForm.activityBudgetCycle == "appointTimeRange") {
                if (
                    this.basicDataForm.activityBudgetCycleDate != "" &&
                    this.basicDataForm.activityBudgetCycleDate != []
                ) {
                    appointRunRestrainRange = JSON.stringify(
                        this.basicDataForm.activityBudgetCycleDate
                    );
                }
            }
            this.bizPropertyMap = {
                runAmount: this.basicDataForm.activityBudgetCycle ?
                    this.basicDataForm.activityBudgetCycleInput : "",
                budgetSet: this.basicDataForm.amountCalculation ?
                    this.basicDataForm.amountCalculation : "",
                runRestrainType: this.basicDataForm.activityBudgetCycle ?
                    this.basicDataForm.activityBudgetCycle : "",
                appointRunRestrainRange: appointRunRestrainRange,
                totalDiscountAmount: this.basicDataForm.activityBudgetSum != "" &&
                    this.basicDataForm.totalDiscountAmount ?
                    this.basicDataForm.totalDiscountAmount : "", //总优惠金额限制
                totalTicketsAmount: this.basicDataForm.activityBudgetSum != "" &&
                    this.basicDataForm.totalTicketsAmount ?
                    this.basicDataForm.totalTicketsAmount : "" //总票数限制
            };
        },

        buildTargetRules() {
            for (let item of this.rules) {
                let rule = {
                    name: "", //规则名称
                    ruleConditions: [],
                    actions: [],
                    bizPropertyMap: this.bizPropertyMap
                };
                rule.name = item.name;
                rule.ruleConditions = this.buildRuleConditionsData(
                    item.formData,
                    item.conditions
                );
                rule.actions = this.buildActionsData(item.formData, item.actions);
                this.targetRules.push(rule);
            }
        },

        /* 组装活动条件数据 */
        buildRuleConditionsData(formData, tmpCond) {
            let tmpArr = [];
            for (let item of tmpCond) {
                if (item.key && formData[item.key].opUniqueName2) {
                    //对应两个对象的情况
                    //例如 放映排除日期
                    if (item.value) {
                        let obj = RuleConditions[item.value];
                        let otherObj = JSON.parse(JSON.stringify(obj));
                        obj.opUniqueName = formData[item.key].opUniqueName;
                        otherObj.opUniqueName = formData[item.key].opUniqueName2;
                        otherObj.value = formData[item.key].value ?
                            formData[item.key].value :
                            formData[item.key].valueRange;
                        otherObj.text = formData[item.key].text ?
                            formData[item.key].text :
                            "";
                        tmpArr.push(obj);
                        tmpArr.push(otherObj);
                    }
                }
                if (
                    !item.hasSon &&
                    !formData[item.key].opUniqueName2 &&
                    formData[item.key].opUniqueName != ""
                ) {
                    if (item.value) {
                        let obj = RuleConditions[item.value];
                        obj.opUniqueName = formData[item.key].opUniqueName;
                        obj.value = formData[item.key].value ?
                            formData[item.key].value :
                            formData[item.key].valueRange ?
                            formData[item.key].valueRange :
                            "";
                        obj.text = formData[item.key].text ? formData[item.key].text : "";
                        tmpArr.push(obj);
                    }
                }
                if (item.hasSon) {
                    //有子对象的情况
                    let data = RuleConditions[item.value];
                    let formProp = formData[item.key];
                    for (let son of item.sonData) {
                        let targetObj = data[son.value];
                        console.log("targetObj " + JSON.stringify(targetObj));
                        let key = targetObj.key + targetObj.groupId;
                        let formObj = formProp[key];
                        targetObj.opUniqueName = formObj.opUniqueName;
                        targetObj.value = formObj.value ? formObj.value : "";
                        targetObj.text = formObj.text ? formObj.text : "";
                        tmpArr.push(targetObj);
                    }
                }
            }
            console.log("tmpArr " + JSON.stringify(tmpArr));
            return tmpArr;
        },

        /* 组装优惠方案数据 */
        buildActionsData(formData, tmpActions) {
            let tmpArr = [];
            for (let item of tmpActions) {
                if (!item.hasSon && item.value) {
                    //只有一个对象的情况 如赠送积分
                    let obj = Actions[item.value];
                    obj.value = formData[item.key].value ? formData[item.key].value : "";
                    obj.text = formData[item.key].text ? formData[item.key].text : "";
                    tmpArr.push(obj);
                }
                if (item.hasSon && item.value) {
                    let data = Actions[item.value];
                    let formProp = formData[item.key];
                    for (let son of item.sonData) {
                        let targetObj = data[son.value];
                        let key = targetObj.key + targetObj.groupId;
                        let formObj = formProp[key];
                        targetObj.value = formObj.value ? formObj.value : "";
                        targetObj.text = formObj.text ? formObj.text : "";
                        tmpArr.push(targetObj);
                    }
                }
            }
            return tmpArr;
        },

        // 表单提交
        dataFormSubmit(flag) {
            this.valActivityName();

            this.$refs["basicDataForm"].validate(valid => {
                if (valid) {
                    // this.$refs["activityBudgetForm"].validate(valid => {
                    if (valid) {
                        /* 公共规则 */
                        this.buildCommonInfoData();

                        /* 活动预算 */
                        this.buildBizPropertyMap();

                        /* 组装活动规则 */
                        this.buildTargetRules();

                        let ruleGroup = {
                            flag: flag,
                            tenantId: this.basicDataForm.tenantId,
                            bizId: this.activityId, //营销活动id
                            bizOrderCode: this.basicDataForm.activityCode, //营销活动编号
                            id: this.activityId,
                            templateId: this.basicDataForm.activityType,
                            name: this.basicDataForm.activityName,
                            remark: this.basicDataForm.activityDesc,
                            executeMode: this.basicDataForm.executeMode,
                            priority: this.basicDataForm.priority == 1 ?
                                this.basicDataForm.priorityNum : 100,
                            validDateStart: this.basicDataForm.validDateStart + " 00:00:00",
                            validDateEnd: this.basicDataForm.validDateEnd + " 00:00:00",
                            commonInfo: this.commonInfo,
                            ruleType: "SaleActivity",
                            rules: this.targetRules ? this.targetRules : []
                        };

                        console.log("ruleGroup  " + JSON.stringify(ruleGroup));

                        this.$cmmList
                            .marketingAdd(ruleGroup)
                            .then(data => {
                                if (data && data.code === 200) {
                                    this.$message({
                                        message: "操作成功",
                                        type: "success",
                                        duration: 1500,
                                        onClose: () => {
                                            this.$emit("refreshDataList");
                                        }
                                    });
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            });
                    }
                }
            });

            // }
            // });
        },

        //添加分组活动执行条件
        addGroup(rule, index) {
            this.addGroupShow = true;
            this.$nextTick(() => {
                this.$refs.addGroup.init(rule, index);
            });
        },
        close() {
            this.addGroupShow = false;
        },

        transferData(data) {
            if (data.index !== "" && data.index != null) {
                for (let i = 0; i < this.rules.length; i++) {
                    if (i == data.index) {
                        this.rules[i] = data;
                    }
                }
            } else {
                this.rules.push(data);
            }
            this.close();
        },

        removeRule(index) {
            this.rules.splice(index, 1);
        }
    }
};
</script>

<style lang="scss">
.def-tag {
    width: 150px;
    height: 100px;
    margin: 0 10px 10px 0;
    text-align: left;
    padding: 20px;
    white-space: pre-wrap;
    word-wrap: break-word;
    background-color: rgba(59, 116, 255, 0.1);
    font-size: 12px;
    color: #3b74ff;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid rgba(59, 116, 255, 0.2);
    position: relative;

    .closeIcon {
        position: absolute;
        top: 0;
        right: 0;
        border-radius: 50%;
        text-align: center;
        cursor: pointer;
        font-size: 14px;
        height: 20px;
        width: 20px;
        line-height: 20px;
        vertical-align: middle;
        color: #3b74ff;
    }

    .closeIcon:hover {
        background-color: #3b74ff;
        color: #ffffff;
    }
}

.movie-plan_default {
    .bigBtn {
        display: flex;
        flex-wrap: wrap;

        ul {
            li {
                text-align: center;
                cursor: pointer;
                border: 2px dashed #ccc;
                border-radius: 5px;
                width: 150px;
                height: 100px;
                line-height: 126px;
                font-size: 14px;
                position: relative;

                .icon {
                    font-size: 46px;
                    color: #b8b6b6;
                }
            }
        }
    }

    // addGroupLeft
    .el-collapse .addGroupLeft .el-collapse-item__header .el-collapse-item__arrow {
        left: 147px;
    }
}
</style>
