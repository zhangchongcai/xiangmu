<template>
<div>
    <div class="movie-plan_default" v-if="!addGroupShow" :class="{isTableCheck:isEdit == 'detail'}">
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-form :model="basicDataForm" :rules="basicDataRule" ref="basicDataForm" label-width="120px" class="common-form">
                <!-- 活动基础信息 -->
                <el-collapse-item title="活动基础信息" name="1">
                    <el-form-item label="活动名称:" prop="activityName" :rules="commonRules.valActivityName">
                        <el-input class="input-activity-name" v-model="basicDataForm.activityName" placeholder="请输入活动名称" :disabled="disabled" maxlength="15" @change="delSpace()"></el-input>
                    </el-form-item>
                    <el-form-item label="活动描述:" prop="activityDesc">
                        <el-input type="textarea" v-model="basicDataForm.activityDesc" :disabled="disabled" placeholder="请输入活动描述" maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="执行策略:" size="mini" prop="executeMode">
                        <el-radio-group v-model="basicDataForm.executeMode" :disabled="disabled">
                            <el-radio :label="'AUTO_MATCH'">自动</el-radio>
                            <el-radio :label="'AUTO_MATCH_RECOMMEND'">推荐</el-radio>
                            <el-popover placement="right-start" title width="200" trigger="hover" content="1.自动执行策略：在交易时系统自动匹配执行的策略；
                                2.推荐执行策略：在交易时系统匹配并提示操作人员选择执行的策略；在自助体系（网站、手机APP及自助购票机等）的交易过程中，系统只匹配自动执行策略。例：
                                “会员半价”，这种活动在系统识别会员时打折，建议设置自动执行策略；
                                “刷招行信用卡25元购票”，对于这种活动必须由柜台操作员判断顾客是否持有相应的信用卡支付，确认后需手工点选实现打折，建议设置为推荐执行策略；
                                当同一个优先级存在多个匹配的活动时，系统提示操作员手工选择执行。">
                                <el-button type="text" slot="reference" class="el-icon-warning" style="margin-left:5px;">
                                    <span style="color:#ffffff">1</span>
                                </el-button>
                            </el-popover>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="执行优先级:" size="mini" class="priorityNum">
                        <el-radio-group v-model="basicDataForm.priority" :disabled="disabled">
                            <el-row class="flex-base" style="height:32px;line-height:32px;">
                                <el-radio :label="1">输入优先级数字</el-radio>
                                <el-form-item v-if="basicDataForm.priority==1" prop="priorityNum">
                                    <el-input style="width:252px;height:32px;" v-model="basicDataForm.priorityNum" :disabled="disabled" placeholder="数值越大优先级越高(0-99)" min="0" max="99"></el-input>
                                </el-form-item>
                            </el-row>
                            <el-row style="height:32px;line-height:32px;margin-top:10px;">
                                <el-radio :label="2">按最优先执行</el-radio>
                            </el-row>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="活动有效期:" prop="validDateOption">
                        <el-date-picker v-model="basicDataForm.validDateOption" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="disabled" @change="setValidityDate"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="排除日期:">
                        <el-checkbox-group v-model="basicDataForm.excludeDate" :disabled="disabled">
                            <el-checkbox :label="'节假日除外'" name="excludeDate">节假日除外</el-checkbox>
                            <el-checkbox :label="'指定排除日期范围'" name="excludeDate">指定排除日期范围</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>

                    <div v-if="basicDataForm.excludeDate.indexOf('指定排除日期范围')!=-1">
                        <el-form-item label v-for="(item,index) in basicDataForm.excludeDateOptions" :key="index" :prop="'excludeDateOptions.'+index+'.excludeDateOption'" :rules="{required: true, message: '指定排除日期范围不能为空', trigger: 'change'}">
                            <el-date-picker v-model="item.excludeDateOption" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="disabled" @change="setExcludeDate"></el-date-picker>
                            <el-button size="small" type="text" @click="delExcludeDate(index)">删除</el-button>
                        </el-form-item>
                    </div>

                    <el-form-item label v-if="basicDataForm.excludeDate.indexOf('指定排除日期范围') != -1 && isEdit != 'detail'" >
                        <div class="addDate" @click="addExcludeDate">
                            <i class="el-icon-circle-plus-outline"></i>添加日期
                        </div>
                    </el-form-item>

                    <el-form-item label="时段范围:" >
                        <el-select v-model="basicDataForm.timeRange" :disabled="disabled">
                            <el-option label="不限" value></el-option>
                            <el-option label="指定时段" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <div v-if="basicDataForm.timeRange==1 && basicDataForm.timeRangeSelect.length>0" class="timeRange_bg">
                        <div label v-for="(item,index) in basicDataForm.timeRangeSelect" :key="item.key" style="margin-bottom: -4px;">
                            <el-form-item >
                                <el-form-item>
                                    <el-checkbox :indeterminate="item.isIndeterminateWithWorkDay" v-model="item.checkAllWorkDay" :disabled="disabled" @change="handleCheckAllWorkDayChange(item,$event)" style="float:left; margin-right:25px;">工作日
                                    </el-checkbox>
                                    <el-checkbox-group v-model="item.workDay" :disabled="disabled" @change="handleCheckedWorkDayChange(item,$event)">
                                        <el-checkbox v-for="item in workDayOptions" :label="item.id" :key="item.id">{{item.text}}</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <el-form-item :prop="'timeRangeSelectDays.'+index" :rules="{required: true, message: '时段范围不能为空', trigger: 'blur'}">
                                    <el-checkbox :indeterminate="item.isIndeterminateWithWeekend" :disabled="disabled" v-model="item.checkAllWeekend" @change="handleCheckAllWeekendChange(item,$event)" style="float:left; margin-right:40px;">周末
                                    </el-checkbox>
                                    <el-checkbox-group v-model="item.weekend" :disabled="disabled" @change="handleCheckedWeekendChange(item,$event)">
                                        <el-checkbox v-for="item in weekendOptions" :label="item.id" :key="item.id">{{item.text}}</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                                <el-form-item style="margin-top:20px;" :prop="'timeRangeSelect.'+index+'.specifyTime'" :rules="{required: true, message: '时段范围不能为空', trigger: 'change'}">
                                    <el-time-picker is-range v-model="item.specifyTime" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="HH:mm:ss" :disabled="disabled" style="float:left;"></el-time-picker>
                                    <div style="float:left; margin-left:25px;" v-if="isEdit != 'detail'">
                                        <span>指定范围：</span>
                                        <el-button size="small" type="text" @click="amClick(item)">上午</el-button>
                                        <el-button size="small" type="text" @click="pmClick(item)">下午</el-button>
                                        <el-button size="small" type="text" @click="eveningClick(item)">晚上</el-button>
                                        <el-button style="margin-left:25px;" size="small" type="text" @click="delTimeRangeSelect(index)">删除</el-button>
                                    </div>
                                </el-form-item>
                            </el-form-item>
                        </div>
                    </div>
                    <el-form-item label v-if="basicDataForm.timeRange==1 && isEdit != 'detail'">
                        <div class="addDate" @click.stop="addTimeRangeSelect">
                            <i class="el-icon-circle-plus-outline"></i>添加时间
                        </div>
                    </el-form-item>

                    <el-form-item label="交易渠道:">
                        <el-row class="flex-base">
                            <el-select v-model="basicDataForm.tradingChannel" :disabled="disabled" clearable>
                                <el-option label="不限" value></el-option>
                                <el-option label="包含" value="normalIn"></el-option>
                                <el-option label="不包含" value="normalNotIn"></el-option>
                            </el-select>
                            <el-form-item v-if="basicDataForm.tradingChannel!=''" prop="tradingChannelInput">
                                <el-input class="chooseWidth1" v-model="basicDataForm.tradingChannelInput" readonly></el-input>
                                <el-button class="windowBtn" type="primary" :disabled="disabled" @click="tradeChannelClick()" plain>选择</el-button>
                            </el-form-item>
                        </el-row>
                    </el-form-item>
                    <el-row class="flex-base">
                        <el-form-item label="交易影院:" prop="tradingMerchant">
                            <el-select v-model="basicDataForm.tradingMerchant" :disabled="disabled">
                                <el-option label="包含" value="normalIn"></el-option>
                                <el-option label="不包含" value="normalNotIn"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="tradingMerchantInput" class="tradingMerchantInput" style="width: 257px;">
                            <el-input class="chooseWidth1" v-show="!basicDataForm.tradingMerchantInput" style="width: 166px;" v-model="basicDataForm.tradingMerchantInput" readonly></el-input>
                            <el-tooltip placement="bottom" v-show="basicDataForm.tradingMerchantInput">
                                <el-input class="chooseWidth1" style="width: 166px;" v-model="basicDataForm.tradingMerchantInput" readonly></el-input>
                                <div slot="content">
                                    <div v-for="item in basicDataForm.tradingMerchantInput.split(',')" :key="item" style="font-size:12px">{{ item }}<br/></div>
                                </div>
                            </el-tooltip>   
                            <el-button type="primary" class="windowBtn" @click="cinemaClick('movieTicketDialog')" plain :disabled="disabled">选择</el-button>
                        </el-form-item>
                    </el-row>
                </el-collapse-item>
                <!-- 分组活动执行条件 -->
                <el-collapse-item title="分组活动执行条件" name="2" class="addGroupLeft">
                    <div class="bigBtn">
                        <div class="def-tag" v-for="(rule,index) in rules" :key="index" closable @click="addGroup(rule,index)">
                            <i class="el-icon-close closeIcon" @click.stop="removeRule(index)"></i>
                            <span>{{rule.name}}</span>
                        </div>
                        <ul>
                            <li class="addBtn" v-if="rules && rules.length<10 && isEdit != 'detail'"  @click="addGroup()">
                                <span class="icon el-icon-plus"></span>
                            </li>
                        </ul>
                    </div>
                </el-collapse-item>
                <!-- 设置活动预算 -->
                <el-collapse-item title="设置活动预算" name="3">
                    <el-form-item label="预算金额计算:">
                        <el-select v-model="basicDataForm.amountCalculation" :disabled="disabled">
                            <el-option label="优惠金额" value="discount"></el-option>
                            <el-option label="补贴金额" value="allowance"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="活动总预算:">
                        <el-select v-model="basicDataForm.activityBudgetSum" :disabled="disabled">
                            <el-option label="不限制" value></el-option>
                            <el-option label="指定预算限制" value="1"></el-option>
                        </el-select>

                        <div v-if="basicDataForm.activityBudgetSum==1">
                            <el-form-item prop="totalTicketsAmount">
                                <el-row class="flex-base">
                                    <span>限制总票数</span>
                                    <el-input class="input-type-94" v-model="basicDataForm.totalTicketsAmount" :disabled="disabled" placeholder="请输入"></el-input>
                                    <span>张</span>
                                </el-row>
                            </el-form-item>
                            <el-form-item prop="totalDiscountAmount" class="margin-top-15">
                                <el-row class="flex-base">
                                    <span>限制总补贴金额</span>
                                    <el-input class="input-type-94" v-model="basicDataForm.totalDiscountAmount" :disabled="disabled" placeholder="请输入"></el-input>
                                    <span>元</span>
                                </el-row>
                            </el-form-item>
                        </div>
                    </el-form-item>
                    <el-form-item label="活动总预算周期限制:" class="br-row">
                        <el-row class="flex-base">
                            <el-select v-model="basicDataForm.activityBudgetCycle" :disabled="disabled">
                                <el-option label="不限制" value></el-option>
                                <el-option label="每日限制" value="perDay"></el-option>
                                <el-option label="每周限制" value="perWeek"></el-option>
                                <el-option label="每月限制" value="perMonth"></el-option>
                                <el-option label="每年限制" value="perYear"></el-option>
                                <el-option label="指定周期限制" value="appointTimeRange"></el-option>
                            </el-select>
                            <el-form-item v-if="basicDataForm.activityBudgetCycle == 'appointTimeRange'" prop="activityBudgetCycleDate">
                                <el-date-picker v-model="basicDataForm.activityBudgetCycleDate" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="disabled"></el-date-picker>
                            </el-form-item>
                        </el-row>
                        <el-form-item v-if="basicDataForm.activityBudgetCycle!=''" prop="activityBudgetCycleInput">
                            <span>数量</span>
                            <el-input class="input-type-94" v-model="basicDataForm.activityBudgetCycleInput" :disabled="disabled" placeholder="请输入"></el-input>
                            <span>个</span>
                        </el-form-item>
                    </el-form-item>
                </el-collapse-item>
            </el-form>
        </el-collapse>
        <!-- <fixStepTool :stepData="stepData.stepList"></fixStepTool> -->
        <el-row class="flex-base flex-center bottom-control-group">
            <el-button class="bottomBtn" type="primary" v-if="isEdit!='detail'" @click="dataFormSubmit(2)" :disabled="isDisabled">提交执行</el-button>
            <el-button class="bottomBtn" type="primary" v-if="isEdit!='detail'" @click="dataFormSubmit(1)" :disabled="isDisabled">保存草稿</el-button>
            <el-button class="bottomBtn" @click="returnList()" v-if="isEdit!='detail'">返回</el-button>
            <div v-if="isEdit=='detail'" class="detailReturnBtn">
                <el-button :class="{bottomBtn:true,returnBtn:isEdit=='detail'}" @click="returnList()">返回</el-button>
            </div>
        </el-row>
    </div>
    <add-group v-if="addGroupShow" ref="addGroup" @close="close" @transferData="transferData"></add-group>

    <!-- 弹窗组件都加这 -->
    <section class="alert-group">
        <!-- 交易影院 -->
        <cinemaDialog :title="cinemaDialog.title" :dialogTableVisible.sync="cinemaDialog.cinemaDialogVisible" ref="movieTicketDialog" @callBack="handleMovieTicketCinemaDialogCallBack"></cinemaDialog>
        <!-- 交易渠道弹窗 -->
        <tradeChannelDialog :title="tradeChannelDialog.title" :dialogTableVisible.sync="tradeChannelDialog.tradeChannelDialogVisible" ref="tradeChannelDialog" :channelNature="''" @callBack="handleTradeChannelCallBack" ></tradeChannelDialog>
    </section>


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

// 弹窗混入回调方法，注册弹窗和设置回调都在此处
import alertHandle from 'cmm/mixins/marketing/alertHandle.js';
import commonRules from 'cmm/mixins/rules'
// 活动条件
const memberOptions = [{
        key: "birthday7",
        value: "生日"
    }, //key 等于key+groupId 必须保证key的唯一性
    {
        key: "sex8",
        value: "性别"
    },
    {
        key: "age9",
        value: "年龄"
    },
    {
        key: "openMonths87",
        value: "开卡月限"
    },
    {
        key: "openYears11",
        value: "开卡年限"
    },
    {
        key: "openDate12",
        value: "开卡日期"
    },    
    {
        key: "registerBusinessCode13",
        value: "注册影院"
    },
    {
        key: "balance3",
        value: "账户余额"
    },
    {
        key: "integral4",
        value: "积分余额"
    },
    {
        key: "integralTotall52",
        value: "累计积分"
    },
    {
        key: "sumPrice2",
        value: "单次消费金额"
    },
    {
        key: "consumeSum6",
        value: "累计消费金额"
    },
    {
        key: "cardTypeKey10",
        value: "会员卡类型"
    },
    {
        key: "cardRightCode100",
        value: "会员卡政策"
    },
    {
        key: "customerLevelCode101",
        value: "会员等级"
    },
    {
        key: "firstRecharge98",
        value: "首充金额"
    },
    {
        key: "sumPrice1",
        value: "单次充值金额"
    },
    // {
    //     key: "consumeNum",
    //     value: "动态周期消费次数",
    //     hasSon: true,
    //     sonData: [{
    //         key: "dynamicPeriod15",
    //         value: "动态周期",
    //     },{
    //         key: "appointPeriod15",
    //         value: "指定周期",
    //     },{
    //         key: "consumeWayCode15",
    //         value: "交易渠道",
    //     },{
    //         key: "dynamicConsumeCount15",
    //         value: "消费次数",
    //     }]
    // },
    // {
    //     key: "cycleConsumeNum",
    //     value: "动态周期消费额",
    //     hasSon: true,
    //     sonData: [{
    //         key: "dynamicPeriod17",
    //         value: "动态周期",
    //     },{
    //         key: "appointPeriod17",
    //         value: "指定周期",
    //     },{
    //         key: "consumeWayCode17",
    //         value: "交易渠道",
    //     },{
    //         key: "saleItemType17",
    //         value: "商品类型",
    //     },{
    //         key: "dynamicConsumeSum17",
    //         value: "动态周期消费额",
    //     }]
    // }
];
const tradeOptions = [
    // {
    //     key: "cinemaCode19",
    //     value: "交易影院"
    // },
    {
        key: "cinemaAreaId25",
        value: "交易影院行政区域"
    },
    // {
    //     key: "businessCode14",
    //     value: "交易客商"
    // },
    // {
    //     key: "consumerTypeKey27",
    //     value: "消费者身份"
    // },
    {
        key: "tradeType33",
        value: "交易类型"
    },
    {
        key: "saleItemType17",
        value: "商品类型"
    },
    // {
    //     key: "consumeWayCode32",
    //     value: "交易渠道"
    // },
    {
        key: "price31",
        value: "商品单价"
    },
    {
        key: "filmPrice92",
        value: "影票单价"
    },
    {
        key: "merPrice93",
        value: "卖品单价"
    },
    {
        key: "filmTicketAmount80",
        value: "影票商品数量"
    },
    {
        key: "filmSumPrice90",
        value: "影票总金额"
    },
    {
        key: "merSumPrice91",
        value: "卖品总金额"
    },
    {
        key: "sumPrice26",
        value: "整单交易金额"
    },
    {
        key: "buyNum",
        value: "指定商品购买数量",
        hasSon: true,
        sonData: [{
                key: "merKey21",
                value: "商品名称",
            },
            {
                key: "amount21",
                value: "数量"
            }
        ]
    },
    {
        key: "buyNumByType",
        value: "同类商品累计购买数量",
        hasSon: true,
        sonData: [{
                key: "classCode28",
                value: "商品类别"
            },
            {
                key: "sumAmount28",
                value: "累计购买数量"
            }
        ]
    },
    {
        key: "payTypeCode86",
        value: "支付方式(柜台用)"
    },
    {
        key: "filmStartDayBefore94",
        value: "放映前N天"
    },
    {
        key: "filmStartHourBefore95",
        value: "放映前N小时"
    },
    {
        key: "firstBuyTicket96",
        value: "首次购票"
    }
];
const movieTicketsOptions = [{
        key: "uniformCode79",
        value: "影片"
    },
    {
        key: "hallTypeKey36",
        value: "影厅类型"
    },
    {
        key: "filmTypeKey34",
        value: "影片类型"
    },
    {
        key: "showEffect35",
        value: "放映效果"
    },
    {
        key: "seatGrade89",
        value: "座位等级"
    },
    {
        key: "hallSeatAmout37",
        value: "放映厅座位数"
    },
    {
        key: "lowestPrice38",
        value: "最低发行价"
    },
    {
        key: "planStartTime81",
        value: "放映有效期"
    },
    {
        key: "filmPlanWeekRange83",
        value: "放映星期范围"
    },
    {
        key: "filmPlanInvalidTime82",
        value: "放映排除日期"
    },
    {
        key: "filmPlanTimeRange84",
        value: "放映时段范围"
    }
];
const goodsOptions = [{
        key: "brandId40",
        value: "品牌"
    },
    {
        key: "classCode41",
        value: "类别"
    },
    {
        key: "merKey46",
        value: "商品名称"
    },
    // {
    //     key: "merCode42",
    //     value: "店内码"
    // },
    // {
    //     key: "merBarCode43",
    //     value: "国际条码"
    // }
];
//执行方法
const memberActions = [{
        key: "presentPoint1",
        value: "赠送积分"
    },
    {
        key: "pointPersent18",
        value: "赠送积分倍率"
    },
    {
        key: "presentMoney2",
        value: "赠送会员卡储值额"
    },
    {
        key: "giftTicket",
        value: "赠送票券",
        hasSon: true,
        sonData: [{
                key: "couponApplyCode3",
                value: "票券名称"
            },
            {
                key: "amount3",
                value: "数量"
            },
            {
                key: "isSendSms3",
                value: "是否发送短信"
            }
        ]
    }
];
const tradeActions = [{
        key: "giftGoods",
        value: "赠送商品",
        hasSon: true,
        sonData: [{
                key: "merKey11",
                value: "商品"
            },
            {
                key: "price11",
                value: "商品单价"
            },
            {
                key: "amount11",
                value: "赠送数量"
            }
        ]
    },
    {
        key: "judgeDiscountPrice",
        value: "单品优惠价调整",
        hasSon: true,
        sonData: [{
                key: "merKey9",
                value: "商品"
            },
            {
                key: "modifyWay9",
                value: "调价方式"
            },
            {
                key: "modifyValue9",
                value: "调价值"
            },
            {
                key: "addAmountAfterDiscount9",
                value: "折扣后加减N元"
            },
            {
                key: "integralAmount9",
                value: "积分定价(分)"
            },
            {
                key: "integralMoney9",
                value: "加金额(元)"
            },
            {
                key: "decimalRoundMode9",
                value: "折后取整方式"
            },
            {
                key: "modifyAmountMethod9",
                value: "调价商品数量"
            },
            {
                key: "modifyAmount9",
                value: "数量"
            }
        ]
    },
    {
        key: "addGoodsWithDiscountPrice",
        value: "以优惠价格增加单品",
        hasSon: true,
        sonData: [{
                key: "merKey10",
                value: "商品"
            },
            {
                key: "price10",
                value: "商品单价"
            },
            {
                key: "amount10",
                value: "增加数量"
            }
        ]
    },
    {
        key: "judgeDiscountPriceByType",
        value: "卖品分类优惠价调整",
        hasSon: true,
        sonData: [{
                key: "merCategoryMethod27",
                value: "商品分类"
            },
            {
                key: "classCode27",
                value: "分类"
            },
            {
                key: "modifyWay27",
                value: "调价方式"
            },
            {
                key: "modifyValue27",
                value: "调价值"
            },
            {
                key: "addAmountAfterDiscount27",
                value: "折扣后加减N元"
            },
            {
                key: "decimalRoundMode27",
                value: "折后取整方式"
            },
            {
                key: "modifyAmountMethod27",
                value: "调价商品数量"
            },
            {
                key: "modifyAmount27",
                value: "数量"
            }
        ]
    },
    {
        key: "judgeDiscountPriceByBrand",
        value: "按品牌优惠价调整",
        hasSon: true,
        sonData: [{
                key: "merBrandMethod28",
                value: "商品品牌"
            },
            {
                key: "brandId28",
                value: "品牌"
            },
            {
                key: "modifyWay28",
                value: "调价方式"
            },
            {
                key: "modifyValue28",
                value: "调价值"
            },
            {
                key: "addAmountAfterDiscount28",
                value: "折扣后加减N元"
            },
            {
                key: "decimalRoundMode28",
                value: "折后取整方式"
            },
            {
                key: "modifyAmountMethod28",
                value: "调价商品数量"
            },
            {
                key: "modifyAmount28",
                value: "数量"
            }
        ]
    }
    // "赠送商品",
    // "单品优惠价调整",
    // "以优惠价格增加单品",
    // "卖品分类优惠价调整",
    // "按品牌优惠价调整"
];
const movieTicketsActions = [{
        key: "updateTicketPrice",
        value: "修改单票售价",
        hasSon: true,
        sonData: [{
                key: "modifyWay15",
                value: "调价方式"
            },
            {
                key: "modifyValue15",
                value: "调整额"
            },
            {
                key: "addAmountAfterDiscount15",
                value: "折扣后加减N元"
            },
            {
                key: "integralAmount15",
                value: "积分定价(分)"
            },
            {
                key: "integralMoney15",
                value: "加金额(元)"
            },
            {
                key: "decimalRoundMode15",
                value: "折后取整方式"
            },
            {
                key: "lessProcessMethod15",
                value: "低于最低价时"
            },
            {
                key: "cinemaPayAmount15",
                value: "影院补贴N元"
            },
            {
                key: "modifyAmountMethod15",
                value: "调价商品数量"
            },
            {
                key: "modifyAmount15",
                value: "数量"
            }
        ]
    },
    {
        key: "updateTicketPriceBySeatGrade",
        value: "按座位等级修改票价",
        hasSon: true,
        sonData: [{
                key: "modifyWay29",
                value: "调价方式"
            },
            {
                key: "modifyValue29",
                value: "调整额"
            },
            {
                key: "addAmountAfterDiscount29",
                value: "折扣后加减N元"
            },
            {
                key: "integralAmount29",
                value: "积分定价(分)"
            },
            {
                key: "integralMoney29",
                value: "加金额(元)"
            },
            {
                key: "decimalRoundMode29",
                value: "折后取整方式"
            },
            {
                key: "lessProcessMethod29",
                value: "低于最低价时"
            },
            {
                key: "cinemaPayAmount29",
                value: "影院补贴N元"
            },
            {
                key: "modifyAmountMethod29",
                value: "调价商品数量"
            },
            {
                key: "modifyAmount29",
                value: "数量"
            },
            {
                key: "seatGrade29",
                value: "座位等级"
            }
        ]
    }
    // "修改单票售价",
    // "按座位等级修改票价"
];
export default {
    data() {
        return {
            //限制过去时间不可选
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            // 折叠区域
            memberActions:memberActions,
            tradeActions:tradeActions,
            movieTicketsActions:movieTicketsActions,
            memberOptions:memberOptions,
            tradeOptions:tradeOptions,
            movieTicketsOptions:movieTicketsOptions,
            goodsOptions:goodsOptions,
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
                }],
                priorityNum: [{
                    required: true,
                    validator: (rules, value, callback) => {
                        if (value === "") {
                            return callback(new Error('优先级数字不能为空'));
                        }
                        let regExp = /^([1-9]\d|\d)$/;
                        if (!regExp.test(value)) {
                            return callback(new TypeError('请输入0~99的数字'));
                        }

                        return callback();
                    },
                    trigger: "blur"
                }],
                tradingMerchant: [{
                    required: true,
                    message: "交易影院不能为空",
                    trigger: "change"
                }],
                tradingChannel:[{
                    required: true,
                    message: "交易渠道不能为空",
                    trigger: "change"
                }],
                tradingChannelInput:[{
                    required: true,
                    message: "交易渠道不能为空",
                    trigger: "change"
                }],
                totalTicketsAmount:[{
                    required: true,
                    validator: (rules, value, callback) => {
                        if (!value) {
                            return callback(new Error('限制总票数不能为空'));
                        }
                        let regExp = /^[1-9]\d*$/;
                        if (!regExp.test(value) || value == 0) {
                            return callback(new TypeError('请输入正整数'));
                        }else if(value>=1000000000){
                            return callback(new TypeError('超出范围'));
                        }
                        return callback();
                    },
                    trigger: "blur"
                }],
                totalDiscountAmount:[{
                    required: true,
                    validator: (rules, value, callback) => {
                        if (!value) {
                            return callback(new Error('限制总优惠金额不能为空'));
                        }
                        let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                        if (!regExp.test(value) || value < 1.00) {
                            return callback(new TypeError('请输入正数,且只允许输入两位小数位'));
                        }else if(value>=1000000000){
                            return callback(new TypeError('超出范围'));
                        }

                        return callback();
                    },
                    trigger: "blur"
                }],
                activityBudgetCycle:[{
                    required: true,
                    message: "活动总预算周期限制不能为空",
                    trigger: "change"
                }],
                activityBudgetCycleDate:[{
                    required: true,
                    message: "请选择指定周期限制",
                    trigger: "change"
                }],
                activityBudgetCycleInput:[{
                    required: true,
                    validator: (rules, value, callback) => {
                        if (!value) {
                            return callback(new Error('数量不能为空'));
                        }
                        let regExp = /^[1-9]\d*$/;
                        if (!regExp.test(value) || value == 0) {
                            return callback(new TypeError('请输入正整数'));
                        }else if(value>=1000000000){
                            return callback(new TypeError('超出范围'));
                        }

                        return callback();
                    },
                    trigger: "blur"
                }],
                tradingMerchantInput:[{
                    required: true,
                    message: "交易影院不能为空",
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
            isDisabled: false,
            activityId: "",
            isData:false,
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
                tenantId:  JSON.parse(localStorage.getItem('user')).consumerId,
                activityCode: "",
                // activityId: "",
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
                timeRange: "",
                timeRangeSelect: [{
                    isIndeterminateWithWorkDay: false,
                    checkAllWorkDay: true,
                    isIndeterminateWithWeekend: false,
                    checkAllWeekend: true,
                    workDay: [1,2,3,4,5],
                    weekend: [6,7],
                    specifyTime: ["00:00:00", "23:59:00"]
                }],

                tradingChannel: "", //交易渠道
                tradingChannelId:"",
                tradingChannelInput: "",

                //交易影院
                tradingMerchant: "normalIn",
                tradingMerchantId: "",
                tradingMerchantInput: "",

                // 设置活动预算
                amountCalculation: "discount",

                activityBudgetCycle: "",
                activityBudgetCycleInput: "",
                activityBudgetCycleDate: "",

                activityBudgetSum: "",
                totalDiscountAmount: "",
                totalTicketsAmount: "",

                /* 基础信息-交易渠道 */
                // tradingChannelState: [],
                // tradingChannelStateName: [],
                timeRangeSelectDays:[]
            },

            
            options: [],
        };
    },
    mixins: [fixStepMixin,alertHandle,commonRules],
    components: {
        fixStepTool: FixStepTool,
        AddGroup
    },
    created() {
        // this.getChannelList();
    },
    // watch: {
    //     tradingChannelState(val) {
    //         this.basicDataForm.tradingChannelStateName = [];
    //         val.map(item => {
    //             if (item == 1) {
    //                 item = "柜台";
    //             } else if (item == 2) {
    //                 item = "自助终端";
    //             } else if (item == 3) {
    //                 item = "官方网站";
    //             } else if (item == 4) {
    //                 item = "手机APP";
    //             } else if (item == 5) {
    //                 item = "小程序";
    //             } else if (item == 6) {
    //                 item = "微信公众号";
    //             }
    //             this.basicDataForm.tradingChannelStateName.push(item);
    //         });
    //     }
    // },
    methods: {
        // getChannelList(){
        //     if(this.options.length==0){
        //         let params={
        //             name: "",
        //             code: "",
        //             pageNum: "",
        //             pageSize: "",
        //             channelNature: 1,
        //             tenantId:this.basicDataForm.tenantId
        //         }
        //         this.$cmmList.getChannelList(params).then(data => {
        //             if (data && data.code === 200) {
        //                 console.log(data)
        //                 let options = [{value:"",label:"全选"}];
        //                 for(let item of data.data.list){
        //                     let ChanneObj = {value:item.code,label:item.name}
        //                     options.push(ChanneObj)
        //                 }
        //                 this.options = options;
        //             } else {
        //                 console.log(data.msg);
        //             }
        //         })
        //         .catch(err => {
        //             console.log(err);
        //         });
        //     }
        // },
        delSpace(){
            this.basicDataForm.activityName = (this.basicDataForm.activityName).replace(/\s*/g,"");
        },
        /********** 编辑数据回显 **********/
        init(row, isEdit) {
            if (row) {
                this.activityId = row.id || 0;
                this.isEdit = isEdit;
                if (this.isEdit === "copy") {
                     this.activityId = "";
                }
                let params = qs.stringify({
                    activityId: row.id,
                    tenantId: this.basicDataForm.tenantId
                });
                if(this.isEdit != "add"){
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
            }
            console.log("isEdit",this.isEdit)
            if (this.isEdit == "detail") {
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
                    this.basicDataForm.tradingChannel = item.opUniqueName ;
                    this.basicDataForm.tradingChannelInput = item.text;
                    this.basicDataForm.tradingChannelId = item.value;
                } else if (item.key == "cinemaCode") {
                    //交易影院
                    this.basicDataForm.tradingMerchant = item.opUniqueName ?
                        item.opUniqueName :
                        "";
                    this.basicDataForm.tradingMerchantInput = item.text ?
                        item.text :
                        "";
                    this.basicDataForm.tradingMerchantId = item.value ?
                        item.value :
                        "";
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
                            if (value == 1 || value == 2 || value == 3 || value == 4 || value == 5) {
                                obj.workDay.push(parseInt(value));
                            } else if (value == 6 || value == 7) {
                                obj.weekend.push(parseInt(value));
                            } else {
                               obj.specifyTime.push(value+':00');
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
                            obj.weekend &&
                            obj.weekend.length > 0 &&
                            obj.weekend.length == 2
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
            if(!this.basicDataForm.activityBudgetCycle){
                this.basicDataForm.activityBudgetCycle = "";
            }
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
           
            let map = this.json2Map( JSON.parse(JSON.stringify(RuleConditions)));
            console.log("map",map)

            //将Actions转换成map结构便于取值
            let actMap = this.json2Map(JSON.parse(JSON.stringify(Actions)));
            console.log("actMap",actMap)
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
                        // targetActions.push({
                        //     key: value.fkey,
                        //     value: value.fvalue
                        // });
                        this.memberActions.forEach(item=>{
                            if(value.fvalue==item.value){
                                targetActions.push(item)
                            }
                        })
                        this.tradeActions.forEach(item=>{
                            if(value.fvalue==item.value){
                                targetActions.push(item)
                            }
                        })
                        this.movieTicketsActions.forEach(item=>{
                            if(value.fvalue==item.value){
                                targetActions.push(item)
                            }
                        })
                    } else {
                        let actionsKeys = targetActions.map(item => {
                            return item.key;
                        });
                        if (!actionsKeys.includes(value.fkey)) {
                           
                            // targetActions.push({
                            //     key: value.fkey,
                            //     value: value.fvalue
                            // });
                            this.memberActions.forEach(item=>{
                                if(value.fvalue==item.value){
                                    targetActions.push(item)
                                }
                            })
                            this.tradeActions.forEach(item=>{
                                if(value.fvalue==item.value){
                                    targetActions.push(item)
                                }
                            })
                            this.movieTicketsActions.forEach(item=>{
                                if(value.fvalue==item.value){
                                    targetActions.push(item)
                                }
                            })
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
            console.log("rule",rule);
            console.log("map",map);
            
            let targetConditions = [];

            for (let cond of rule.ruleConditions) {
                let key = cond.key + cond.groupId;
                let value = map.get(key);
                if (typeof value == "object") {
                    console.log("object");
                    if (targetConditions.length <= 0) {
                        // targetConditions.push({
                        //     key: value.fkey,
                        //     value: value.fvalue
                        // });
                        this.memberOptions.forEach(item=>{
                            if(value.fvalue==item.value){
                                targetConditions.push(item)
                            }
                        })
                         this.tradeOptions.forEach(item=>{
                            if(value.fvalue==item.value){
                                targetConditions.push(item)
                            }
                        })
                         this.movieTicketsOptions.forEach(item=>{
                            if(value.fvalue==item.value){
                                targetConditions.push(item)
                            }
                        })
                         this.goodsOptions.forEach(item=>{
                            if(value.fvalue==item.value){
                                targetConditions.push(item)
                            }
                        })

                    } else {
                        let conditionKeys = targetConditions.map(item => {
                            return item.key;
                        });
                        if (!conditionKeys.includes(value.fkey)) {
                            // targetConditions.push({
                            //     key: value.fkey,
                            //     value: value.fvalue
                            // });
                            this.memberOptions.forEach(item=>{
                                if(value.fvalue==item.value){
                                    targetConditions.push(item)
                                }
                            })
                            this.tradeOptions.forEach(item=>{
                                if(value.fvalue==item.value){
                                    targetConditions.push(item)
                                }
                            })
                            this.movieTicketsOptions.forEach(item=>{
                                if(value.fvalue==item.value){
                                    targetConditions.push(item)
                                }
                            })
                            this.goodsOptions.forEach(item=>{
                                if(value.fvalue==item.value){
                                    targetConditions.push(item)
                                }
                            })
                        }
                    }
                } else {
                     console.log("else-object");
                    targetConditions.push({
                        key: key,
                        value: value
                    });
                }
            }
           

            return targetConditions;
        },

        setFormData(rule, map, actMap) {
            let formData =  JSON.parse(JSON.stringify(FormData)); //formData初始数据
            formData.activityName = rule.name
            for (let cond of rule.ruleConditions) {
                let key = cond.key + cond.groupId;
                let value = map.get(key);
                // console.log(formData[key])

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
        // handleChangeSelect(data) {
        //     if (data.indexOf("") != -1) {
        //         if(this.isData){
        //             data = [];
        //         }else{
        //             let optionsArr = [];
        //             for(let item of this.options){
        //                 if(item.value){
        //                     optionsArr.push(item.value)
        //                 } 
        //             }
        //             data = optionsArr;
        //         }
        //         this.isData = !this.isData;
        //     }
        //     this.basicDataForm.tradingChannelState = data;
        //     this.basicDataForm.tradingChannelInput = this.basicDataForm.tradingChannelState.join(",");
        // },
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
            this.testExcludeDate();
        },
        // 验证排除日期
        testExcludeDate(){
            if(this.validExcludeDate()){
                this.$message.error("指定排除日期不能相同");
            }
        },
        /* 添加排除日期 */
        addExcludeDate() {
            this.basicDataForm.excludeDateOptions.push({
                excludeDateOption: ""
            });
        },
        /* 删除排除日期 */
        delExcludeDate(index) {
            if(this.basicDataForm.excludeDateOptions.length!=1){
                this.basicDataForm.excludeDateOptions.splice(index, 1);
            }
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
                isIndeterminateWithWorkDay: false,
                checkAllWorkDay: true,
                isIndeterminateWithWeekend: false,
                checkAllWeekend: true,
                workDay: [1,2,3,4,5],
                weekend: [6,7],
                specifyTime: ["00:00:00", "23:59:00"],
                key: Date.now()
            });
        },
        /** 删除时段范围 */
        delTimeRangeSelect(index) {
            if(this.basicDataForm.timeRangeSelect.length != 1){
                this.basicDataForm.timeRangeSelect.splice(index, 1);
            }
            // this.$nextTick(()=>{
            //     this.validAppointDays();
            //     this.$refs["basicDataForm"].validate((valid) => {})
            // })
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
        //验证时段范围
        validAppointDays(){
            //时段范围
            let AppointDays = [];
            let rangerValue = [];
            if (this.basicDataForm.timeRange == "1" &&this.basicDataForm.timeRangeSelect.length > 0) {
                for (let item of this.basicDataForm.timeRangeSelect) {
                    let arrDay = [];
                    arrDay = item.workDay.concat(item.weekend);
                    AppointDays.push(arrDay);
                    if(item.specifyTime){
                        let arrSpecifyTime = [item.specifyTime[0].slice(0,5)];
                        arrSpecifyTime.push(item.specifyTime[1].slice(0,5));
                        arrDay = arrDay.concat(arrSpecifyTime)
                        rangerValue.push(arrDay)
                    }
                }
                this.basicDataForm.rangerDays = rangerValue
                this.basicDataForm.timeRangeSelectDays = AppointDays;
            }
        },
        //验证排除日期
        validExcludeDate(){
            let excludeDateArr = [];
            if(this.basicDataForm.excludeDateOptions){
                for(let item of this.basicDataForm.excludeDateOptions){
                    if(item.excludeDateOption){
                        excludeDateArr.push(item.excludeDateOption.join(","))
                    }
                }
                if((new Set(excludeDateArr)).size != excludeDateArr.length){
                    return true;
                }
            } 
        },
        //验证时段范围
        validRangerValue(){
            let rangerValueArr = [];
            if(this.basicDataForm.rangerDays){
                for(let item of this.basicDataForm.rangerDays){
                    if(item != ""){
                        rangerValueArr.push(item.join(","))
                    }
                }
                if((new Set(rangerValueArr)).size != rangerValueArr.length){
                    return true;
                }
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
                    value:"true",
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
                    let arrSpecifyTime = [item.specifyTime[0].slice(0,5)];
                    let changeArr = [];
                    arrSpecifyTime.push(item.specifyTime[1].slice(0,5));
                    arr = item.workDay.concat(item.weekend).concat(arrSpecifyTime);
                    changeArr = arr.join(',').split(',');
                    rangerValue.push(changeArr);
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
                    value: this.basicDataForm.tradingChannelId,
                    text: this.basicDataForm.tradingChannelInput,
                    opUniqueName: this.basicDataForm.tradingChannel
                });
            }

            // 交易影院
            if (this.basicDataForm.tradingMerchant != "") {
                this.commonInfo.push({
                    category: "SaleInfo",
                    key: "cinemaCode",
                    value: this.basicDataForm.tradingMerchantId, 
                    text: this.basicDataForm.tradingMerchantInput, 
                    opUniqueName: this.basicDataForm.tradingMerchant 
                });
            }
            
            this.commonInfo.push({
                category: "SaleInfo",
                key: "tradeType",
                value: "BUY",
                text: "",
                opUniqueName: "normalEqual"
            });
            //过滤
            this.filterCommonInfoData()
        },
        //过滤组装公共规则数据commonInfo
        filterCommonInfoData(){
            let arr=[]
            this.commonInfo.forEach(item => {
                if(item.value!=""){
                    arr.push(item)
                }
            });
            this.commonInfo=arr
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
            //过滤
           this.filterBizPropertyMap()
        },
        //过滤组装活动预算数据bizPropertyMap
        filterBizPropertyMap(){
            let obj={}
            for (const key in this.bizPropertyMap) {
                if (this.bizPropertyMap[key]!="") {
                    obj[key]=this.bizPropertyMap[key]
                }
            }
            this.bizPropertyMap=obj
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
            // console.log("targetRules",this.targetRules)
        },
        /* 组装活动条件数据 */
        buildRuleConditionsData(formData, tmpCond) {
            let tmpArr = [];
            for (let item of tmpCond) {
                if (item.key && formData[item.key].opUniqueName2) {
                    //对应两个对象的情况
                    //例如 放映排除日期
                    if (item.value) {
                        let obj = JSON.parse(JSON.stringify(RuleConditions[item.value]));
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
                        let obj = JSON.parse(JSON.stringify(RuleConditions[item.value]));
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
                    let data = JSON.parse(JSON.stringify(RuleConditions[item.value]));
                    let formProp = formData[item.key];
                    for (let son of item.sonData) {
                        let targetObj = data[son.value];
                        let key = targetObj.key + targetObj.groupId;
                        let formObj = formProp[key];
                        targetObj.opUniqueName = formObj.opUniqueName;
                        targetObj.value = formObj.value ? formObj.value : "";
                        targetObj.text = formObj.text ? formObj.text : "";
                        tmpArr.push(targetObj);
                    }
                }
            }
            tmpArr=this.filterConditionsData(tmpArr)
            return tmpArr;
        },
        //过滤组装活动条件数据ruleConditions
        filterConditionsData(tmpArr){
            let arr=[]
            tmpArr.forEach(item => {
                if(item.value!=""){
                    arr.push(item)
                }
            });
            tmpArr=arr
            return tmpArr
        },
        /* 组装优惠方案数据 */
        buildActionsData(formData, tmpActions) {
            let tmpArr = [];
            for (let item of tmpActions) {
                if (!item.hasSon && item.value) {
                    //只有一个对象的情况 如赠送积分
                     
                    let obj = JSON.parse(JSON.stringify(Actions[item.value]));
                    obj.value = formData[item.key].value ? formData[item.key].value : "";
                    obj.text = formData[item.key].text ? formData[item.key].text : "";
                    tmpArr.push(obj);
                }
                if (item.hasSon && item.value) {
                    let data = JSON.parse(JSON.stringify(Actions[item.value]));
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
            tmpArr=this.filterActionsData(tmpArr)
            return tmpArr;
        },
        //过滤组装优惠方案数据actions
        filterActionsData(tmpArr){
            let arr=[]
            tmpArr.forEach(item => {
                if(item.value!=""){
                    arr.push(item)
                }
            });
            tmpArr=arr
            return tmpArr
        },
        //过滤所有数据
        filterAllData(ruleGroup){
            ruleGroup.commonInfo=this.filterCommonInfoData(ruleGroup.commonInfo)
        },
        // 表单提交
        dataFormSubmit(flag) {
            this.isDisabled = true;
            this.validAppointDays();
            this.$refs["basicDataForm"].validate(valid => {
                if(this.rules.length == 0){
                    this.$message.error("请添加分组活动执行条件");
                    this.isDisabled = false;
                    return false;
                }else if(this.validExcludeDate()){
                    this.$message.error("指定排除日期不能相同");
                    this.isDisabled = false;
                }else if(this.validRangerValue()){
                    this.$message.error("指定时段不能相同");
                    this.isDisabled = false;
                }else{
                    if (valid) {
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
                                bizId:  this.activityId, //营销活动id
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
                                        this.isDisabled = false;
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }
                    }else{
                        this.isDisabled = false;
                    }
                }
                
            });
        },
        // 添加分组活动执行条件
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

            this.close()
        },
        removeRule(index) {
            this.rules.splice(index, 1);
        }
    }
}
</script>


<style lang="scss" scoped>
/deep/.movie-plan_default {
    .input-activity-name{
        width:360px;
        height:32px;
        border-radius:4px;
    }
    .bigBtn {
        display: flex;
        flex-wrap: wrap;
        .def-tag {
            background: #F2F4FD;
            width: 140px;
            height: 70px;
            margin: 0 10px 10px 0;
            text-align: center;
            padding: 15px;
            white-space: pre-wrap;
            word-wrap: break-word;
            // background-color: rgba(59, 116, 255, 0.1);
            font-size: 12px;
            font-weight:bolder;
            color: #333333;
            border-radius: 4px;
            box-sizing: border-box;
            border: 1px solid #3B74FF;
            // border: 1px solid rgba(59, 116, 255, 0.2);
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
                color: #3B74FF;
            }

            .closeIcon:hover {
                background-color: #3b74ff;
                color: #ffffff;
            }
        }
        .addBtn{
            text-align: center;
            cursor: pointer;
            border: 1px dashed #BCBCBC;
            border-radius: 4px;
            width: 83px;
            height: 70px;
            line-height: 70px;
            font-size: 14px;
            position: relative;
            .icon {
                font-size: 20px;
                color: #bbb;
                font-weight:bolder;
            }
        } 
    }
    .addGroupLeft{
        .el-collapse-item__header{
            padding-left: 50px;
            width: 968px;
            border-bottom: 1px solid #ebeef5;
            .el-collapse-item__arrow{
                margin-left: -132px;
            }
        }
    }
}
.el-select-dropdown__item{
    font-size: 12px !important;
}
.el-tooltip__popper{
    div{
        font-size: 12px;
    }  
}


@import "../../../assets/comstyle.scss";

</style>
