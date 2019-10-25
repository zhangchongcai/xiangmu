<template>
    <div>
        <div class="movie-plan_default" v-if="!addGroupShow">
            <el-collapse v-model="activeNames" @change="handleChange">
                <el-form :model="basicDataForm" :rules="basicDataRule" ref="basicDataForm" label-width="120px" class="common-form">
                    <!-- 活动基础信息 -->
                    <el-collapse-item title="活动基础信息" name="1">
                        <el-form-item label="活动名称:" prop="activityName" :rules="commonRules.valActivityName">
                            <el-input class="input-activity-name" v-model="basicDataForm.activityName" placeholder="请输入活动名称"  maxlength="15" @change="delSpace()"></el-input>
                        </el-form-item>

                        <el-form-item label="活动描述:" prop="activityDesc">
                            <el-input type="textarea" v-model="basicDataForm.activityDesc"  placeholder="请输入活动描述" maxlength="100"></el-input>
                        </el-form-item>

                        <el-form-item label="执行策略:" size="mini" prop="executeMode">
                            <el-radio-group v-model="basicDataForm.executeMode" >
                                <el-radio :label="'AUTO_MATCH'">自动</el-radio>
                                <el-radio :label="'AUTO_MATCH_RECOMMEND'">推荐</el-radio>
                                <el-tooltip effect="dark" content="" placement="right">
                                    <div slot="content" style="width: 166px;">
                                        1.自动执行策略：在交易时系统自动匹配执行的策略；<br>
                                        2.推荐执行策略：在交易时系统匹配并提示操作人员选择执行的策略；在自助体系（网站、手机APP及自助购票机等）的交易过程中，系统只匹配自动执行策略。例：
                                        “会员半价”，这种活动在系统识别会员时打折，建议设置自动执行策略；
                                        “刷招行信用卡25元购票”，对于这种活动必须由柜台操作员判断顾客是否持有相应的信用卡支付，确认后需手工点选实现打折，建议设置为推荐执行策略；
                                        当同一个优先级存在多个匹配的活动时，系统提示操作员手工选择执行。
                                    </div>
                                    <i class="el-icon-warning" style="color: #3B74FF;width:12px;height:12px;"></i>
                                </el-tooltip>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="执行优先级:" size="mini" class="priorityNum">
                            <el-radio-group v-model="basicDataForm.priority" >
                                <el-row class="flex-base" style="height:32px;line-height:32px;">
                                    <el-radio :label="1">输入优先级数字</el-radio>
                                    <el-form-item v-if="basicDataForm.priority==1" prop="priorityNum">
                                        <el-input style="width:252px;height:32px;" v-model="basicDataForm.priorityNum"  placeholder="数值越大优先级越高(0-99)" min="0" max="99"></el-input>
                                    </el-form-item>
                                </el-row>
                                <el-row style="height:32px;line-height:32px;margin-top:10px;">
                                    <el-radio :label="2">按最优先执行</el-radio>
                                </el-row>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="活动有效期:" prop="validDateOption">
                            <el-date-picker v-model="basicDataForm.validDateOption" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"  @change="setValidityDate"></el-date-picker>
                        </el-form-item>

                        <el-form-item label="排除日期:">
                            <el-checkbox-group v-model="basicDataForm.excludeDate" >
                                <el-checkbox :label="'节假日除外'" name="excludeDate">节假日除外</el-checkbox>
                                <el-checkbox :label="'指定排除日期范围'" name="excludeDate">指定排除日期范围</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>

                        <div v-if="basicDataForm.excludeDate.indexOf('指定排除日期范围')!=-1">
                            <el-form-item label v-for="(item,index) in basicDataForm.excludeDateOptions" :key="index" :prop="'excludeDateOptions.'+index+'.excludeDateOption'" :rules="{required: true, message: '指定排除日期范围不能为空', trigger: 'change'}">
                                <el-date-picker v-model="item.excludeDateOption" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"  @change="setExcludeDate"></el-date-picker>
                                <el-button size="small" type="text" @click="delExcludeDate(index)" v-if="basicDataForm.excludeDateOptions.length > 1">删除</el-button>
                            </el-form-item>
                        </div>

                        <el-form-item label v-if="basicDataForm.excludeDate.indexOf('指定排除日期范围') != -1" >
                            <div class="addDate" @click="addExcludeDate">
                                <i class="el-icon-circle-plus-outline"></i>添加日期
                            </div>
                        </el-form-item>

                        <el-form-item label="时段范围:" >
                            <el-select v-model="basicDataForm.timeRange" >
                                <el-option label="不限" value></el-option>
                                <el-option label="指定时段" value="1"></el-option>
                            </el-select>
                        </el-form-item>

                        <div v-if="basicDataForm.timeRange==1 && basicDataForm.timeRangeSelect.length>0" class="timeRange_bg">
                            <div label v-for="(item,index) in basicDataForm.timeRangeSelect" :key="item.key" style="margin-bottom: -4px;">
                                <el-form-item>
                                    <el-form-item>
                                        <el-checkbox :indeterminate="item.isIndeterminateWithWorkDay" v-model="item.checkAllWorkDay"  @change="handleCheckAllWorkDayChange(item,$event)" style="float:left; margin-right:25px;">工作日
                                        </el-checkbox>
                                        <el-checkbox-group v-model="item.workDay"  @change="handleCheckedWorkDayChange(item,$event)">
                                            <el-checkbox v-for="item in workDayOptions" :label="item.id" :key="item.id">{{item.text}}</el-checkbox>
                                        </el-checkbox-group>
                                    </el-form-item>

                                    <el-form-item :prop="'timeRangeSelectDays.'+index" :rules="{required: true, message: '时段范围不能为空', trigger: 'blur'}">
                                        <el-checkbox :indeterminate="item.isIndeterminateWithWeekend"  v-model="item.checkAllWeekend" @change="handleCheckAllWeekendChange(item,$event)" style="float:left; margin-right:37px;">周末
                                        </el-checkbox>
                                        <el-checkbox-group v-model="item.weekend"  @change="handleCheckedWeekendChange(item,$event)">
                                            <el-checkbox v-for="item in weekendOptions" :label="item.id" :key="item.id">{{item.text}}</el-checkbox>
                                        </el-checkbox-group>
                                    </el-form-item>

                                    <el-form-item style="margin-top:20px;" :prop="'timeRangeSelect.'+index+'.specifyTime'" :rules="{required: true, message: '时段范围不能为空', trigger: 'change'}">
                                        <el-time-picker is-range v-model="item.specifyTime" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="HH:mm"  style="float:left;"></el-time-picker>
                                        <div style="float:left; margin-left:25px;">
                                            <span>指定范围：</span>
                                            <el-button size="small" type="text" @click="amClick(item)">上午</el-button>
                                            <el-button size="small" type="text" @click="pmClick(item)">下午</el-button>
                                            <el-button size="small" type="text" @click="eveningClick(item)">晚上</el-button>
                                            <el-button style="margin-left:25px;" size="small" type="text" @click="delTimeRangeSelect(index)" v-if="basicDataForm.timeRangeSelect.length > 1">删除</el-button>
                                        </div>
                                    </el-form-item>
                                </el-form-item>
                            </div>
                        </div>

                        <el-form-item label v-if="basicDataForm.timeRange==1">
                            <div class="addDate" @click.stop="addTimeRangeSelect">
                                <i class="el-icon-circle-plus-outline"></i>添加时间
                            </div>
                        </el-form-item>

                        <el-form-item label="交易渠道:">
                            <el-row class="flex-base">
                                <el-select v-model="basicDataForm.tradingChannel" >
                                    <el-option label="不限" value></el-option>
                                    <el-option label="包含" value="normalIn"></el-option>
                                    <el-option label="不包含" value="normalNotIn"></el-option>
                                </el-select>

                                <el-form-item v-if="basicDataForm.tradingChannel!=''" prop="tradingChannelInput">
                                    <el-input class="chooseWidth1 input-dialog" v-show="!basicDataForm.tradingChannelInput" v-model="basicDataForm.tradingChannelInput" readonly></el-input>
                                    <el-tooltip placement="bottom" v-show="basicDataForm.tradingChannelInput">
                                        <el-input class="chooseWidth1 input-dialog" style="width: 166px;" v-model="basicDataForm.tradingChannelInput" readonly></el-input>
                                        <div slot="content">
                                            <div v-for="item in basicDataForm.tradingChannelInput.split(',')" :key="item" style="font-size:12px">{{ item }}<br/></div>
                                        </div>
                                    </el-tooltip>
                                    <i class="el-icon-close close-btn" v-show="basicDataForm.tradingChannelInput" @click="clearInputValue('tradingChannelInput','tradingChannelId')"></i>
                                    <el-button class="windowBtn" type="primary"  @click="tradeChannelClick({value:basicDataForm.tradingChannelId,text:basicDataForm.tradingChannelInput})" plain>选择</el-button>
                                </el-form-item>
                            </el-row>
                        </el-form-item>

                        <el-row class="flex-base">
                            <el-form-item label="交易影院:" prop="tradingMerchant">
                                <el-select v-model="basicDataForm.tradingMerchant" >
                                    <el-option label="包含" value="normalIn"></el-option>
                                    <el-option label="不包含" value="normalNotIn"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item prop="tradingMerchantInput" class="tradingMerchantInput" style="width: 257px;">
                                <el-input class="chooseWidth1 input-dialog" v-show="!basicDataForm.tradingMerchantInput" style="width: 166px;" v-model="basicDataForm.tradingMerchantInput" readonly></el-input>
                                <el-tooltip placement="bottom" v-show="basicDataForm.tradingMerchantInput">
                                    <el-input class="chooseWidth1 input-dialog" style="width: 166px;" v-model="basicDataForm.tradingMerchantInput" readonly></el-input>
                                    <div slot="content">
                                        <div v-for="item in basicDataForm.tradingMerchantInput.split(',')" :key="item" style="font-size:12px">{{ item }}<br/></div>
                                    </div>
                                </el-tooltip>
                                <i class="el-icon-close close-btn" style="right: 100px;" v-show="basicDataForm.tradingMerchantInput" @click="clearInputValue('tradingMerchantInput','tradingMerchantId')"></i>
                                <el-button type="primary" class="windowBtn" @click="cinemaClick('movieTicketDialog',{value:basicDataForm.tradingMerchantId,text:basicDataForm.tradingMerchantInput})" plain >选择</el-button>
                            </el-form-item>
                        </el-row>
                    </el-collapse-item>
                    <!-- 分组活动执行条件 -->
                    <el-collapse-item title="分组活动执行条件" name="2" class="addGroupLeft">
                        <div class="bigBtn">
                            <!-- 数据迁移(transferStatus==5) --> 
                            <template v-if="transferStatus==5">
                                <div :class="{'def-tag':true,'validate-status-green':validateStatus[index],'validate-status-red':!validateStatus[index]}" v-for="(rule,index) in rules" :key="index" closable @click="addGroupRule(rule,index)">
                                    <i class="el-icon-close closeIcon" @click.stop="removeRule(index)"></i>
                                    <span>{{rule.name}}</span>
                                </div>
                            </template>

                            <template v-else>
                                <div class="def-tag" v-for="(rule,index) in rules" :key="index" closable @click="addGroupRule(rule,index)">
                                    <i class="el-icon-close closeIcon" @click.stop="removeRule(index)"></i>
                                    <span>{{rule.name}}</span>
                                </div>
                            </template>

                            <ul>
                                <li class="addBtn" v-if="rules && rules.length<10"  @click="addGroupRule()">
                                    <span class="icon el-icon-plus"></span>
                                </li>
                            </ul>
                        </div>
                    </el-collapse-item>
                    <!-- 设置活动预算 -->
                    <el-collapse-item title="设置活动预算" name="3">
                        <el-form-item label="预算金额计算:">
                            <el-select v-model="basicDataForm.amountCalculation" >
                                <el-option label="优惠金额" value="discount"></el-option>
                                <el-option label="补贴金额" value="allowance"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="活动总预算:" prop="activityBudgetSumCheckList">
                            <el-select v-model="basicDataForm.activityBudgetSum"   @change="activityBudgetAmountOptionChange">
                                <el-option label="不限制" value></el-option>
                                <el-option label="指定预算限制" value="1"></el-option>
                            </el-select>

                            <div v-if="basicDataForm.activityBudgetSum==1">
                                <el-checkbox-group v-model="basicDataForm.activityBudgetSumCheckList" @change="activityBudgetSumChange">
                                    <el-checkbox label="限制总票数" style="width:110px"></el-checkbox>
                                    <el-form-item prop="totalTicketsAmount" style="width:150px;display:inline-block;" v-if="basicDataForm.activityBudgetSumCheckList.indexOf('限制总票数')!=-1">
                                        <el-input style="width:120px;" v-model="basicDataForm.totalTicketsAmount"  placeholder="请输入"></el-input>
                                        <span style="margin-left:8px;">张</span>
                                    </el-form-item>
                                    <br>
                                    <el-checkbox label="限制总补贴金额" style="width:110px"></el-checkbox>
                                    <el-form-item prop="totalDiscountAmount" style="width:150px;display:inline-block;margin-top:15px;" v-if="basicDataForm.activityBudgetSumCheckList.indexOf('限制总补贴金额')!=-1">
                                        <el-input style="width:120px;" v-model="basicDataForm.totalDiscountAmount"  placeholder="请输入"></el-input>
                                        <span style="margin-left:8px;">元</span>
                                    </el-form-item>
                                </el-checkbox-group>
                            </div>
                        </el-form-item>

                        <el-form-item label="活动总预算周期限制:" class="br-row">
                            <el-row class="flex-base">
                                <el-select v-model="basicDataForm.activityBudgetCycle" >
                                    <el-option label="不限制" value></el-option>
                                    <el-option label="每日限制" value="perDay"></el-option>
                                    <el-option label="每周限制" value="perWeek"></el-option>
                                    <el-option label="每月限制" value="perMonth"></el-option>
                                    <el-option label="每年限制" value="perYear"></el-option>
                                    <el-option label="指定周期限制" value="appointTimeRange"></el-option>
                                </el-select>

                                <el-form-item v-if="basicDataForm.activityBudgetCycle == 'appointTimeRange'" prop="activityBudgetCycleDate">
                                    <el-date-picker style="position: relative;top: 2px;" v-model="basicDataForm.activityBudgetCycleDate" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" ></el-date-picker>
                                </el-form-item>
                            </el-row>

                            <el-form-item v-if="basicDataForm.activityBudgetCycle!=''" prop="activityBudgetCycleInput">
                                <span>数量</span>
                                <el-input class="input-type-94" v-model="basicDataForm.activityBudgetCycleInput"  placeholder="请输入"></el-input>
                                <span>个</span>
                            </el-form-item>
                        </el-form-item>
                    </el-collapse-item>
                </el-form>
            </el-collapse>


            <fixStepTool :stepData="stepData.stepList"></fixStepTool>


            <el-row class="flex-base flex-center bottom-control-group buttonGroup">
                <el-button class="bottomBtn" type="primary" style="margin-left:0px" @click="dataFormSubmit(2)" :disabled="isDisabled">提交执行</el-button>
                <el-button class="bottomBtn" type="primary" @click="dataFormSubmit(1)" :disabled="isDisabled">保存草稿</el-button>
                <el-button class="bottomBtn" @click="returnList()">返回</el-button>
            </el-row>
        </div>

        <!-- 子活动 --> <!-- 数据迁移(transferStatus==5) --> 
        <template v-if="transferStatus==5">
            <add-group v-if="addGroupShow" ref="addGroup" @close="close" @transferData="transferData" :transferStatus="transferStatus" @transferHandle="handleTransferStatus"></add-group>
        </template>
        <!-- 子活动 --> <!-- 正常活动 --> 
        <template v-else>
            <add-group v-if="addGroupShow" ref="addGroup" @close="close" @transferData="transferData"></add-group>
        </template>

        <!-- 弹窗组件都加这 -->
        <section class="alert-group">
            <!-- 交易影院 -->
            <cinemaDialog :title="cinemaDialog.title" :dialogTableVisible.sync="cinemaDialog.cinemaDialogVisible" ref="movieTicketDialog" @callBack="handleMovieTicketCinemaDialogCallBack"></cinemaDialog>
            <!-- 交易渠道 -->
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

import commonRules from 'cmmSrc/mixins/rules'
// import minxins from 'frame_cpm/mixins/cacheMixin.js'
// 弹窗混入回调方法，注册弹窗和设置回调都在此处
import alertHandle from 'cmmSrc/mixins/marketing/alertHandle.js';

const { cacheMixin } = requireModule('base');

//数据迁移过滤选项(临时状态)
const transferOptions={
    //公共条件
    clearDialogCommonInfo:[
        //清空-弹窗类-交易影院
        {
            groupId: 19,
            key: "cinemaCode",
            text: "",
            value: ""
        },
        //交易渠道
        {
            groupId: 32,
            key: "consumeWayCode",
            text: "",
            value: ""
        },
    ],
    //分组活动条件
    rules:{
        //显示-活动条件
        showRuleConditions:[
            //生日-等于当日
            {
                groupId: 7,
                key: "birthday",
                text: "",
                value: "true",
                opUniqueName:"EqualCurrentDay"
            },
            //生日-等于当月
            {
                groupId: 7,
                key: "birthday",
                text: "",
                value: "true",
                opUniqueName:"EqualCurrentMoney"
            },
            //生日-交易当月前后N月
            {
                groupId: 7,
                key: "birthday",
                text: "",
                value: "",
                opUniqueName:"EqualCurrentMonthOffset"
            },

        ],
        //清空-弹窗类-活动条件
        clearDialogRuleConditions:[
            //注册影院
            {
                groupId: 13,
                key: "registerBusinessCode",
                text: "",
                value: ""
            },
            //会员等级
            {
                groupId: 101,
                key: "customerLevelCode",
                text: "",
                value: ""
            },
            //会员卡政策
            {
                groupId: 100,
                key: "cardRightCode",
                text: "",
                value: ""
            },
            //会员卡类型
            {
                groupId: 10,
                key: "cardTypeKey",
                text: "",
                value: ""
            },
            //影片
            {
                groupId: 79,
                key: "uniformCode",
                text: "",
                value: ""
            },
            //影厅类型
            {
                groupId: 36,
                key: "hallTypeKey",
                text: "",
                value: ""
            },
            //影片类型
            {
                groupId: 34,
                key: "filmTypeKey",
                text: "",
                value: ""
            },
            //放映效果
            {
                groupId: 35,
                key: "showEffect",
                text: "",
                value: ""
            },
            //商品品牌
            {
                groupId: 40,
                key: "brandId",
                text: "",
                value: ""
            },
            //商品类别
            {
                groupId: 41,
                key: "classCode",
                text: "",
                value: ""
            },
            //商品名称
            {
                groupId: 46,
                key: "merKey",
                text: "",
                value: ""
            },
            //交易影院行政区域
            {
                groupId: 25,
                key: "cinemaAreaId",
                text: "",
                value: ""
            },
            //支付方式(柜台用)
            {
                groupId: 86,
                key: "payTypeCode",
                text: "",
                value: ""
            },
            //指定商品购买数量-商品名称
            {
                groupId: 21,
                key: "merKey",
                text: "",
                value: ""
            },
            //指定商品购买数量-商品类别
            {
                groupId: 28,
                key: "classCode",
                text: "",
                value: ""
            },
            //同品牌商品累计购买数量-商品品牌
            {
                groupId: 29,
                key: "brandId",
                text: "",
                value: ""
            },
        ],
        //清空-弹窗类-执行条件
        clearDialogActions:[
            //赠送票券-票券名称
            {
                groupId: 3,
                key: "couponApplyCode",
                text: "",
                value: ""
            },
            //赠送商品-商品
            {
                groupId: 11,
                key: "merKey",
                text: "",
                value: ""
            },
            //单品优惠价调整-商品
            {
                groupId: 9,
                key: "merKey",
                text: "",
                value: ""
            },
            //以优惠价格增加单品-商品
            {
                groupId: 10,
                key: "merKey",
                text: "",
                value: ""
            },
            //卖品分类优惠价调整-分类
            {
                groupId: 27,
                key: "classCode",
                text: "",
                value: ""
            },
            //按品牌优惠价调整-品牌
            {
                groupId: 28,
                key: "brandId",
                text: "",
                value: ""
            },
        ]

    
    },
}
// 活动条件（key 等于key+groupId 必须保证key的唯一性）
// 会员类
const memberOptions = [
    { key: "birthday7", value: "生日" }, 
    { key: "sex8", value: "性别" },
    { key: "age9", value: "年龄" },
    { key: "openMonths87", value: "开卡月限" },
    { key: "openYears11", value: "开卡年限" },
    { key: "openDate12", value: "开卡日期" },    
    { key: "registerBusinessCode13", value: "注册影院" },
    { key: "balance3", value: "账户余额" },
    { key: "integral4",  value: "积分余额" },
    { key: "integralTotall52", value: "累计积分" },
    { key: "sumPrice2", value: "单次消费金额" },
    { key: "consumeSum6", value: "累计消费金额" },
    { key: "cardTypeKey10", value: "会员卡类型" },
    { key: "cardRightCode100", value: "会员卡政策" },
    { key: "customerLevelCode101", value: "会员等级" },
    { key: "firstRecharge98", value: "首充金额" },
    { key: "sumPrice1", value: "单次充值金额" },
    { key: "chargeSum50", value: "累计充值金额" },
    //原本产品需要加上的需求，但是后端不支持，所以暂时隐藏
    // { 
    //     key: "consumeNum",
    //     value: "动态周期消费次数",
    //     hasSon: true,
    //     sonData: [
    //         { key: "dynamicPeriod15", value: "动态周期" },
    //         { key: "appointPeriod15", value: "指定周期" },
    //         { key: "consumeWayCode15", value: "交易渠道" },
    //         { key: "dynamicConsumeCount15", value: "消费次数" }
    //     ]
    // },
    // {
    //     key: "cycleConsumeNum",
    //     value: "动态周期消费额",
    //     hasSon: true,
    //     sonData: [
    //         { key: "dynamicPeriod17", value: "动态周期" },
    //         { key: "appointPeriod17", value: "指定周期" },
    //         { key: "consumeWayCode17", value: "交易渠道" },
    //         { key: "saleItemType17", value: "商品类型" },
    //         { key: "dynamicConsumeSum17", value: "动态周期消费额" }
    //     ]
    // }
];
//交易类
const tradeOptions = [
    // { key: "cinemaCode19", value: "交易影院" },
    { key: "cinemaAreaId25", value: "交易影院行政区域" },
    // { key: "businessCode14", value: "交易客商" },
    // { key: "consumerTypeKey27", value: "消费者身份" },
    // { key: "tradeType33", value: "交易类型" },
    // { key: "saleItemType17", value: "商品类型" },
    // { key: "consumeWayCode32", value: "交易渠道" },
    { key: "price31", value: "商品单价" },
    { key: "filmPrice92", value: "影票单价" },
    { key: "merPrice93", value: "卖品单价" },
    { key: "filmTicketAmount80", value: "影票商品数量" },
    { key: "filmSumPrice90", value: "影票总金额" },
    { key: "merSumPrice91", value: "卖品总金额" },
    { key: "sumPrice26", value: "整单交易金额" },
    { key: "buyNum",
        value: "指定商品购买数量",
        hasSon: true,
        sonData: [
            { key: "merKey21", value: "商品名称" },
            { key: "amount21", value: "数量" }
        ]
    },
    {
        key: "buyNumByType",
        value: "同类商品累计购买数量",
        hasSon: true,
        sonData: [
            { key: "classCode28", value: "商品类别" },
            { key: "sumAmount28", value: "累计购买数量" }
        ]
    },
    {
        key: "buyNumByBrand",
        value: "同品牌商品累计购买数量",
        hasSon: true,
        sonData: [
            { key: "brandId29", value: "商品品牌" },
            { key: "sumAmount29", value: "累计购买数量" }
        ]
    },
    { key: "payTypeCode86", value: "支付方式(柜台用)" },
    { key: "filmStartDayBefore94", value: "放映前N天" },
    { key: "filmStartHourBefore95", value: "放映前N小时" },
    { key: "firstBuyTicket96", value: "首次购票" }
];
//影票类
const movieTicketsOptions = [
    { key: "uniformCode79", value: "影片" },
    { key: "hallTypeKey36", value: "影厅类型" },
    { key: "filmTypeKey34", value: "影片类型" },
    { key: "showEffect35", value: "放映效果" },
    // { key: "seatGrade89", value: "座位等级" },
    { key: "hallSeatAmout37", value: "放映厅座位数" },
    { key: "lowestPrice38", value: "最低发行价" },
    { key: "planStartTime81", value: "放映有效期" },
    { key: "filmPlanWeekRange83", value: "放映星期范围" },
    { key: "filmPlanInvalidTime82", value: "放映排除日期" },
    { key: "filmPlanTimeRange84", value: "放映时段范围" }
];
//卖品类
const goodsOptions = [
    { key: "brandId40", value: "品牌" },
    { key: "classCode41", value: "类别" },
    { key: "merKey46", value: "商品名称" },
    // { key: "merCode42", value: "店内码" },
    // { key: "merBarCode43", value: "国际条码" }
];
//执行方法（key 等于key+groupId 必须保证key的唯一性）
//会员类
const memberActions = [
    { key: "presentPoint1", value: "赠送积分" },
    { key: "pointPersent18", value: "赠送积分倍率" },
    { key: "presentMoney2",  value: "赠送会员卡储值额" },
    {
        key: "giftTicket",
        value: "赠送票券",
        hasSon: true,
        sonData: [
            { key: "couponApplyCode3", value: "票券名称" },
            { key: "amount3", value: "数量" },
            { key: "isSendSms3", value: "是否发送短信" }
        ]
    }
];
//交易类
const tradeActions = [{
        key: "giftGoods",
        value: "赠送商品",
        hasSon: true,
        sonData: [
            { key: "merKey11", value: "商品" },
            { key: "price11", value: "商品单价" },
            { key: "amount11", value: "赠送数量" }
        ]
    },
    {
        key: "judgeDiscountPrice",
        value: "单品优惠价调整",
        hasSon: true,
        sonData: [
            { key: "merKey9",  value: "商品" },
            { key: "modifyWay9", value: "调价方式" },
            { key: "modifyValue9", value: "调价值" },
            { key: "addAmountAfterDiscount9", value: "折扣后加减N元" },
            { key: "integralAmount9", value: "积分定价(分)" },
            { key: "integralMoney9", value: "加金额(元)" },
            { key: "decimalRoundMode9", value: "折后取整方式" },
            { key: "modifyAmountMethod9", value: "调价商品数量" },
            { key: "modifyAmount9", value: "数量" }
        ]
    },
    {
        key: "addGoodsWithDiscountPrice",
        value: "以优惠价格增加单品",
        hasSon: true,
        sonData: [
            { key: "merKey10", value: "商品" },
            { key: "price10", value: "商品单价" },
            { key: "amount10", value: "增加数量" }
        ]
    },
    {
        key: "judgeDiscountPriceByType",
        value: "卖品分类优惠价调整",
        hasSon: true,
        sonData: [
            { key: "merCategoryMethod27", value: "商品分类" },
            { key: "classCode27", value: "分类" },
            { key: "modifyWay27", value: "调价方式" },
            { key: "modifyValue27", value: "调价值" },
            { key: "addAmountAfterDiscount27", value: "折扣后加减N元" },
            { key: "decimalRoundMode27", value: "折后取整方式" },
            { key: "modifyAmountMethod27", value: "调价商品数量" },
            { key: "modifyAmount27", value: "数量" }
        ]
    },
    {
        key: "judgeDiscountPriceByBrand",
        value: "按品牌优惠价调整",
        hasSon: true,
        sonData: [
            { key: "merBrandMethod28", value: "商品品牌" },
            { key: "brandId28", value: "品牌" },
            { key: "modifyWay28", value: "调价方式" },
            { key: "modifyValue28", value: "调价值" },
            { key: "addAmountAfterDiscount28", value: "折扣后加减N元" },
            { key: "decimalRoundMode28", value: "折后取整方式" },
            { key: "modifyAmountMethod28", value: "调价商品数量" },
            { key: "modifyAmount28", value: "数量" }
        ]
    }
    // "赠送商品",
    // "单品优惠价调整",
    // "以优惠价格增加单品",
    // "卖品分类优惠价调整",
    // "按品牌优惠价调整"
];
//影票类
const movieTicketsActions = [{
        key: "updateTicketPrice",
        value: "修改单票售价",
        hasSon: true,
        sonData: [
            { key: "modifyWay15", value: "调价方式" },
            { key: "modifyValue15", value: "调整额" },
            { key: "addAmountAfterDiscount15", value: "折扣后加减N元" },
            { key: "integralAmount15", value: "积分定价(分)" },
            { key: "integralMoney15", value: "加金额(元)" },
            { key: "decimalRoundMode15", value: "折后取整方式" },
            { key: "lessProcessMethod15", value: "低于最低价时" },
            { key: "cinemaPayAmount15", value: "影院补贴N元" },
            { key: "modifyAmountMethod15", value: "调价商品数量" },
            { key: "modifyAmount15", value: "数量" }
        ]
    },
    // {
    //     key: "updateTicketPriceBySeatGrade",
    //     value: "按座位等级修改票价",
    //     hasSon: true,
    //     sonData: [
    //         { key: "modifyWay29", value: "调价方式" },
    //         { key: "modifyValue29", value: "调整额" },
    //         { key: "addAmountAfterDiscount29", value: "折扣后加减N元" },
    //         { key: "integralAmount29", value: "积分定价(分)" },
    //         { key: "integralMoney29", value: "加金额(元)" },
    //         { key: "decimalRoundMode29", value: "折后取整方式" },
    //         { key: "lessProcessMethod29", value: "低于最低价时" },
    //         { key: "cinemaPayAmount29", value: "影院补贴N元" },
    //         { key: "modifyAmountMethod29", value: "调价商品数量" },
    //         { key: "modifyAmount29", value: "数量" },
    //         { key: "seatGrade29", value: "座位等级" }
    //     ]
    // }
    // "修改单票售价",
    // "按座位等级修改票价"
];
export default {
    components: {
        fixStepTool: FixStepTool,
        AddGroup
    },
    props:{
        //页面状态
        pageType: {
            type: String,
            default: "create"
        },
        //入参
        innerId: {
            type: Number,
            default: null
        },
        activityState: {
            type: Number,
            default: null
        },
        //审批状态
        approvalResult: {
            type: Number,
            default: 0
        },
    },
    mixins: [fixStepMixin,alertHandle,commonRules,cacheMixin.cacheMixin],
    data() {
        return {
            //缓存对象数据
            cacheField: ["basicDataForm","activityId","transferId","transferStatus","validateStatus","rules","addGroupShow","rule","index"],
            subComName:"userDefinedActivity_"+this.pageType,//缓存数据唯一标识

            tenantId:  this.$store.state.loginUser.consumerId || "",//租户id

            transferId:0,//数据迁移id（临时处理）
            transferStatus:0,//数据迁移id（临时处理）
            validateStatus:[],//数据迁移验证修改列表（临时处理）
            transferOptions:transferOptions,//迁移数据过滤选项（临时处理）

            memberActions:memberActions,//执行方法-会员类
            tradeActions:tradeActions,//执行方法-交易类
            movieTicketsActions:movieTicketsActions,//执行方法-影票类

            memberOptions:memberOptions,//活动条件-会员类
            tradeOptions:tradeOptions,//活动条件-交易类
            movieTicketsOptions:movieTicketsOptions,//活动条件-影票类
            goodsOptions:goodsOptions,//活动条件-卖品类
            // 折叠区域
            activeNames: ["1", "2", "3"],
            //限制过去时间不可选
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            //步骤条数据
            stepData: {
                stepEl: ".el-collapse-item",
                stepList: [
                    { name: "活动基础信息", isactive: false },
                    { name: "分组活动执行条件", isactive: false },
                    { name: "设置活动预算", isactive: false }
                ]
            },
            //表单验证数据
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
                activityBudgetSumCheckList:[{
                    required: true,
                    validator: (rules, value, callback) => {
                        if(this.basicDataForm.activityBudgetSum==""){
                            return callback();
                        }
                        //指定预算限制
                        if (value && value.length==0) {
                            return callback(new Error('指定预算限制至少选择一个'));
                        }else{
                            return callback();
                        }

                    },
                    trigger: "change"
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

            //时段范围选项1到5
            workDayOptions: [
                { id: 1, text: "星期一" },
                { id: 2, text: "星期二" },
                { id: 3, text: "星期三" },
                { id: 4, text: "星期四" },
                { id: 5, text: "星期五" }
            ],
            //时段范围选项6到7
            weekendOptions: [
                { id: 6, text: "星期六" }, 
                { id: 7, text: "星期天" }
            ],
            isDisabled: false,//是否可以选中底部按钮
            activityId: "",//活动的id

            addGroupShow: false,//子活动显示和关闭状态
            isStorage:false,
            rule:"",
            index:"",
            rules: [],
            // rule: [],
            //所有规则
            targetRules: [],
            //公共规则部分
            commonInfo: [],
            //活动预算
            bizPropertyMap: [],
           
            //活动基本信息
            basicDataForm: {
                tenantId:  this.$store.state.loginUser.consumerId || "",
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
                }],
                //指定排除日期
                excludeDateOption: [],

                //基础信息-时段范围
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
                //交易类型
                tradeTypeId:"BUY",
                tradeTypeInput:'["消费"]',
                //交易渠道
                tradingChannel: "", 
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
                activityBudgetSumCheckList:[],

                //基础信息-交易渠道
                // tradingChannelState: [],
                // tradingChannelStateName: [],
                timeRangeSelectDays:[]
            },
        };
    },
    created() {

        console.log("innerId:",this.innerId)
        console.log("approvalResult:",this.approvalResult)
        console.log("pageType:",this.pageType)
        console.log("activityId:",this.activityId)
        console.log("this.$route.query.id:",this.$route.query.id)
        if(this.activityId == this.$route.query.id){
            console.log("取缓存数据")
        }else{
            //修订、修改、复制页
            if(this.pageType!="create"){
                this.init(this.innerId,this.pageType,this.approvalResult)
            }
        }
        if(this.addGroupShow){
            if(this.rule){
                this.isStorage = true;
                this.$nextTick(() => {
                    this.$refs.addGroup.init(this.rule,this.index,this.isStorage);
                });
            }else{
                this.$nextTick(() => {
                    this.$refs.addGroup.init();
                });
            }
        }
    },
    methods: {
        /********** 编辑数据回显 **********/
        //初始化
        init(id,type,approvalResult) {
            if (id) {
                this.activityId = id || 0;
                console.log("this.activityId = id || 0;",this.activityId)
                let params = qs.stringify({ activityId: id, tenantId: this.basicDataForm.tenantId });
                //临时处理（迁移数据）
                if(approvalResult && approvalResult == 5){
                    this.transferStatus=5
                }

                this.$cmmList
                .marketingViewActivity(params)
                .then(res => {
                    if (res && res.code === 200) {
                        let data = res.data.marketingActivityVO;
                        let ruleGroup = JSON.parse( res.data.marketingActivityVO.ruleGroup );
                        let commonInfo = ruleGroup.commonInfo;
                        let bizPropertyMap = ruleGroup.rules[0].bizPropertyMap;
                        let rules = ruleGroup.rules;

                        //回显初始化
                        this.showDataInit(data,ruleGroup,id)

                        //------------过滤迁移数据start-------------
                        //数据迁移方法的执行顺序 不能和 回显方法的顺序 上下更换
                        if(this.transferStatus==5){
                            //数据迁移初始化
                            this.transferDataInit(data,ruleGroup)
                            //数据迁移活动条件（该方法的执行顺序不能上下更换）
                            this.transferRules(rules)
                            //数据迁移公共添加粘（该方法的执行顺序不能上下更换）
                            this.transferCommonInfo(commonInfo,rules)
                        }
                        //------------过滤迁移数据end-------------

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
        },
        //数据迁移初始化(临时状态)
        transferDataInit(data,ruleGroup){
            //活动名称
            if(ruleGroup.name==data.activityName){
                this.basicDataForm.activityName = ruleGroup.name;
            }else{
                this.basicDataForm.activityName = data.activityName;
            }
            //活动描述
            if(ruleGroup.remark==data.activityDesc){
                this.basicDataForm.activityDesc = ruleGroup.remark;
            }else{
                this.basicDataForm.activityDesc = data.activityDesc;
            }
        },
        //数据迁移过滤数据commonInfo(临时状态)
        transferCommonInfo(commonInfo,rules){
            for (let i = commonInfo.length-1; i >=0; i--) {
                try {
                    //3.0交易客商,临时处理（数据迁移）
                    if(commonInfo[i].key == "businessCode"){
                        commonInfo.splice(i,1)
                    }
                } catch (error) {
                    console.log(error)
                }

                try {
                    //3.0消费者身份,临时处理（数据迁移）
                    if(commonInfo[i] && commonInfo[i].key == "consumerTypeKey"){
                        //3.0消费者身份 迁移成 4.0会员卡政策（数据迁移）
                        this.validHasOrNoOption("cardRightCode",rules)
                    }
                } catch (error) {
                    console.log(error)
                }

                try {
                    //3.0会员等级,临时处理（数据迁移）
                    if(commonInfo[i] && commonInfo[i].key == "cardTypeKey"){
                        //3.0会员等级 迁移成 4.0会员卡政策（数据迁移）
                        this.validHasOrNoOption("cardRightCode",rules)
                    }
                } catch (error) {
                    console.log(error)
                }

                try {
                    //3.0支付方式(柜台用),临时处理（数据迁移）
                    if(commonInfo[i] && commonInfo[i].key == "payTypeCode"){
                        //3.0支付方式(柜台用) 迁移成 4.0支付方式(柜台用)（数据迁移）
                        this.validHasOrNoOption("payTypeCode",rules)
                    }
                } catch (error) {
                    console.log(error)
                }
               
                //清空弹窗内的值让用户重新选择
                this.transferOptions.clearDialogCommonInfo.forEach(item=>{
                    if(commonInfo[i] 
                        && commonInfo[i].groupId == item.groupId 
                        && commonInfo[i].key == item.key
                    ){
                        commonInfo[i].value=item.value
                        commonInfo[i].text=item.text
                    }
                })
                
            }
        },
        //数据迁移验证选项是否存在(临时状态)
        validHasOrNoOption(key,rules){
            rules.forEach(els=>{
                let keyFlag=false//判断子活动中是否存在该条件
                //活动条件
                if(els.ruleConditions.length!=0){
                    for (let i =0; i < els.ruleConditions.length; i++) {
                        if(els.ruleConditions[i].key==key){
                            keyFlag=true;
                            break
                        }
                    }
                }
                if(!keyFlag){
                    //插入 会员卡政策
                    if(key=="cardRightCode"){
                        els.ruleConditions.push({
                            category: "SaleInfo",
                            groupId: 100,
                            key: "cardRightCode",
                            opUniqueName: "normalIn",
                            text: "",
                            value: ""
                        })
                    }
                    //插入 支付方式(柜台用)
                    if(key=="payTypeCode"){
                        els.ruleConditions.push({
                            category: "SaleInfo",
                            groupId: 86,
                            key: "payTypeCode",
                            opUniqueName: "normalIn",
                            text: "",
                            value: ""
                        })
                    }
                   
                }
            })
        },
        //数据迁移过滤数据rules(临时状态)
        transferRules(rules){
            rules.forEach(els=>{
                //活动条件
                if(els.ruleConditions.length!=0){
                    for (let i = els.ruleConditions.length-1; i >=0; i--) {
                        try {
                            //消费者身份,临时处理（数据迁移）
                            if(els.ruleConditions[i].key == "consumerTypeKey" || els.ruleConditions[i].key == "cardTypeKey"){
                                els.ruleConditions.splice(i,1)
                                //迁移成会员卡政策
                                els.ruleConditions.push({
                                    category: "SaleInfo",
                                    groupId: 100,
                                    key: "cardRightCode",
                                    opUniqueName: "normalIn",
                                    text: "",
                                    value: ""
                                })
                            }
                        } catch (error) {
                            console.log(error)
                        }
                      
                        try {
                            //交易客商,临时处理（数据迁移）
                            if(els.ruleConditions[i].key == "businessCode"){
                                els.ruleConditions.splice(i,1)
                            }
                        } catch (error) {
                            console.log(error)
                        }
                       
                        try {
                            //交易渠道,临时处理（数据迁移）
                            if(els.ruleConditions[i].key == "consumeWayCode"){
                                els.ruleConditions.splice(i,1)
                            }
                        } catch (error) {
                            console.log(error)
                        }
                       
                        try {
                            //交易影院,临时处理（数据迁移）
                            if(els.ruleConditions[i].key == "cinemaCode"){
                                els.ruleConditions.splice(i,1)
                            }
                        } catch (error) {
                            console.log(error)
                        }

                        try {
                            //指定商品购买数量-商品名称（数据迁移）
                            if(els.ruleConditions[i].key == "merKey" && els.ruleConditions[i].groupId=="21"){
                                if(els.ruleConditions[i].opUniqueName=="normalEqual"){
                                    els.ruleConditions[i].opUniqueName="normalIn"
                                }
                            }
                        } catch (error) {
                            console.log(error)
                        }
               

                        //清空弹窗内的值让用户重新选择
                        this.transferOptions.rules.clearDialogRuleConditions.forEach(item=>{
                            if(els.ruleConditions[i] 
                                && els.ruleConditions[i].groupId == item.groupId
                                && els.ruleConditions[i].key == item.key
                            ){
                                els.ruleConditions[i].value=item.value
                                els.ruleConditions[i].text=item.text
                            }
                        })
                        //显示活动条件内的值
                        this.transferOptions.rules.showRuleConditions.forEach(showItem=>{
                            if(els.ruleConditions[i] 
                                && els.ruleConditions[i].groupId == showItem.groupId
                                && els.ruleConditions[i].key == showItem.key
                                && els.ruleConditions[i].opUniqueName == showItem.opUniqueName
                            ){
                                els.ruleConditions[i].value=els.ruleConditions[i].value || showItem.value
                                els.ruleConditions[i].text=els.ruleConditions[i].text || showItem.text
                                els.ruleConditions[i].opUniqueName=els.ruleConditions[i].opUniqueName || showItem.opUniqueName
                            }
                        })
                    }
                }
                // 执行条件-清空弹窗内的值让用户重新选择
                if(els.actions.length!=0){
                    els.actions.forEach(el=>{
                        this.transferOptions.rules.clearDialogActions.forEach(item=>{
                            if(el.groupId == item.groupId && el.key == item.key){
                                el.value=item.value
                                el.text=item.text
                            }
                        })
                    })
                }
            })
        },
        //回显初始化
        showDataInit(data,ruleGroup,id){
            //临时处理（迁移数据）
            if(this.transferStatus==5){
                this.transferId=id
            }
            this.basicDataForm.activityCode = data.activityCode;//营销活动编号
            this.basicDataForm.tenantId = ruleGroup.tenantId;//租户id
            this.basicDataForm.activityType = data.activityType;//模板id
            this.basicDataForm.activityName = ruleGroup.name;//活动名称
            this.basicDataForm.activityDesc = ruleGroup.remark;//活动备注
            this.basicDataForm.executeMode = ruleGroup.executeMode;//执行策略
            this.basicDataForm.priority = ruleGroup.priority == 100 ? 2 : 1;//优先级
            this.basicDataForm.priorityNum = ruleGroup.priority;//优先级
            this.basicDataForm.validDateEnd = ruleGroup.validDateEnd;//有效期结束时间
            this.basicDataForm.validDateStart = ruleGroup.validDateStart;//有效期开始时间
            //有效期数组
            this.basicDataForm.validDateOption.push(ruleGroup.validDateStart);
            this.basicDataForm.validDateOption.push(ruleGroup.validDateEnd);
        },
        //回显公共规则CommonInfo
        showCommonInfo(commonInfo) {
            for (let item of commonInfo) {
                //交易类型
                if(item.key=="tradeType"){
                    this.basicDataForm.tradeTypeId=item.value
                    this.basicDataForm.tradeTypeInput=item.text
                }

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
                        if (obj.workDay && obj.workDay.length > 0 && obj.workDay.length == 5) {
                            obj.checkAllWorkDay = true;
                            obj.isIndeterminateWithWorkDay = false;
                        } else if(obj.workDay.length == 0){
                            obj.checkAllWorkDay = false;
                            obj.isIndeterminateWithWorkDay = false;
                        } else {
                            obj.checkAllWorkDay = false;
                            obj.isIndeterminateWithWorkDay = true;
                        }
                        obj.checkAllWeekend = false;
                        if (obj.weekend && obj.weekend.length > 0 && obj.weekend.length == 2) {
                            obj.checkAllWeekend = true;
                            obj.isIndeterminateWithWeekend = false;
                        } else if(obj.weekend.length == 0){
                            obj.checkAllWeekend = false;
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
        //回显活动预算BizPropertyMap
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
            this.basicDataForm.totalDiscountAmount = bizPropertyMap.totalDiscountAmount;
            this.basicDataForm.totalTicketsAmount = bizPropertyMap.totalTicketsAmount;

            if (bizPropertyMap.totalDiscountAmount || bizPropertyMap.totalTicketsAmount) {
                this.basicDataForm.activityBudgetSum = "1";
                if(this.basicDataForm.totalDiscountAmount){
                    this.basicDataForm.activityBudgetSumCheckList.push("限制总补贴金额")
                }
                if(this.basicDataForm.totalTicketsAmount){
                    this.basicDataForm.activityBudgetSumCheckList.push("限制总票数")
                }
            }

        },
        //回显所有规则Rules
        showRules(rules) {
            //将RuleConditions（ruleConditions.json）转换成map结构便于取值
            let map = this.json2Map( JSON.parse(JSON.stringify(RuleConditions)));
            //将Actions（actions.json）转换成map结构便于取值
            let actMap = this.json2Map(JSON.parse(JSON.stringify(Actions)));

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
                if(this.transferStatus==5){
                    //数据迁移验证(临时状态)
                    this.validateStatus.push(false)
                }
            }
        },
        //将json文件转换成map格式
        json2Map(param) {
            /* 目标格式
                简单数据： { "presentPoint1", "赠送积分"},
                嵌套数据： { "couponApplyCode3", {"fkey": "giftTicket","fvalue": "赠送票券","svalue": "票券名称"}}
                表示[赠送票券]下的[票券名称] 对应formData[giftTicket][couponApplyCode3]
            */
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
        //回显 转换成传给子活动的形式
        setFormData(rule, map, actMap) {
            let formData =  JSON.parse(JSON.stringify(FormData)); //FormData(basicFormData.json)初始数据
            formData.activityName = rule.name

            for (let cond of rule.ruleConditions) {
                let key = cond.key + cond.groupId;
                let value = map.get(key);

                if (typeof value == "object") {
                    try {
                        formData[value.fkey][key].opUniqueName = cond.opUniqueName ?
                            cond.opUniqueName :
                            "";
                        formData[value.fkey][key].value = cond.value ? cond.value : "";
                        formData[value.fkey][key].text = cond.text ? cond.text : "";
                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    try {
                        formData[key].opUniqueName = cond.opUniqueName ?
                        cond.opUniqueName :
                        "";
                        formData[key].value = cond.value ? cond.value : "";
                        formData[key].text = cond.text ? cond.text : "";
                    } catch (error) {
                        console.log(error)
                    }
                }
            }

            for (let action of rule.actions) {
                let key = action.key + action.groupId;
                let value = actMap.get(key);
                if (typeof value == "object") {
                    try {
                        formData[value.fkey][key].value = action.value ? action.value : "";
                        formData[value.fkey][key].text = action.text ? action.text : "";
                    } catch (error) {
                        console.log(error)
                    }
                } else {
                    try {
                        formData[key].value = action.value ? action.value : "";
                        formData[key].text = action.text ? action.text : "";
                    } catch (error) {
                        console.log(error)
                    }
                   
                }
            }

            return formData;
        },
        //回显活动条件RuleConditions
        setConditions(rule, map) {
            /* 目标格式
                [
                    { key: "sumPrice26", value: "整单交易金额" },
                    { key: "buyNum" ,value: "指定商品购买数量" }
                ]
            */  
            let targetConditions = [];
            for (let cond of rule.ruleConditions) {
                let key = cond.key + cond.groupId;
                let value = map.get(key);

                if (typeof value == "object") {
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
                    try {
                        targetConditions.push({
                            key: key,
                            value: value
                        });
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
            return targetConditions;
        },
        //回显执行条件Actions
        setActions(rule, actMap) {
            /* 目标格式
                [
                    { key: "presentPoint1", value: "赠送积分" },
                    { key: "giftTicket", value: "赠送票券" }
                ]
            */
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
                    try {
                        targetActions.push({
                            key: key,
                            value: actMap.get(key)
                        });
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
            
            return targetActions;
        },
        /********** 编辑数据回显 **********/
        //数据初始化（清除缓存：表单、活动id）
        resetDataInit(){
            //活动的id
            this.activityId=""
            //数据迁移id（临时处理）
            this.transferId=0
            //数据迁移id（临时处理）
            this.transferStatus=0
            //数据迁移验证修改列表（临时处理）
            this.validateStatus=[]
            this.rules=[]
            //活动基本信息
            this.basicDataForm= {
                tenantId:  this.$store.state.loginUser.consumerId || "",
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
                }],
                //指定排除日期
                excludeDateOption: [],

                //基础信息-时段范围
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
                //交易类型
                tradeTypeId:"BUY",
                tradeTypeInput:'["消费"]',
                //交易渠道
                tradingChannel: "", 
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
                activityBudgetSumCheckList:[],

                //基础信息-交易渠道
                // tradingChannelState: [],
                // tradingChannelStateName: [],
                timeRangeSelectDays:[]
            }
        },
        //返回
        returnList() {
            this.resetDataInit()
            this.$store.commit("tagNav/removeTagNav", this.$route);  //关闭页面tag
            this.$router.push({name:'自定义营销活动管理'});
        },
        handleChange(val) {},
        //清除弹窗显示内容
        clearInputValue(input,id){
            this.basicDataForm[input]=""
            this.basicDataForm[id]=""
        },
        //监听活动名称变化
        delSpace(){
            //将空格、制表符、换页符等等 去除
            this.basicDataForm.activityName = (this.basicDataForm.activityName).replace(/\s*/g,"");
        },
        //修改活动有效期
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
        //活动总预算 监听
        activityBudgetAmountOptionChange(val){
            if(val==""){
                this.basicDataForm.activityBudgetSumCheckList=[]
                this.basicDataForm.totalTicketsAmount=""
                this.basicDataForm.totalDiscountAmount=""
            }
        },
        //活动总预算-指定预算限制 监听
        activityBudgetSumChange(val){
            if(val.length!=0){
                if(val.indexOf("限制总票数")==-1){
                    this.basicDataForm.totalTicketsAmount=""
                }
                if(val.indexOf("限制总补贴金额")==-1){
                    this.basicDataForm.totalDiscountAmount=""
                }
            }else{
                this.basicDataForm.totalTicketsAmount=""
                this.basicDataForm.totalDiscountAmount=""
            }
        },
        //修改排除日期
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
        //添加排除日期
        addExcludeDate() {
            this.basicDataForm.excludeDateOptions.push({
                excludeDateOption: ""
            });
        },
        //删除排除日期
        delExcludeDate(index) {
            if(this.basicDataForm.excludeDateOptions.length!=1){
                this.basicDataForm.excludeDateOptions.splice(index, 1);
            }
        },
        //时段范围- 全选工作日
        handleCheckAllWorkDayChange(item, val) {
            item.workDay = val ?
                this.workDayOptions.map(item => {
                    return item.id;
                }) : [];
            item.isIndeterminateWithWorkDay = false;
        },
        //选中工作日
        handleCheckedWorkDayChange(item, value) {
            let checkedCount = value.length;
            item.checkAllWorkDay = checkedCount === this.workDayOptions.length;
            item.isIndeterminateWithWorkDay =
                checkedCount > 0 && checkedCount < this.workDayOptions.length;
        },
        //全选周末
        handleCheckAllWeekendChange(item, val) {
            item.weekend = val ?
                this.weekendOptions.map(item => {
                    return item.id;
                }) : [];
            item.isIndeterminateWithWeekend = false;
        },
        //选中周末
        handleCheckedWeekendChange(item, value) {
            let checkedCount = value.length;
            item.checkAllWeekend = checkedCount === this.weekendOptions.length;
            item.isIndeterminateWithWeekend =
                checkedCount > 0 && checkedCount < this.weekendOptions.length;
        },
        //设置具体时间范围
        setSpecifyTime(val) {
            item.specifyTime = val;
        },
        //添加时段范围
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
        //删除时段范围
        delTimeRangeSelect(index) {
            if(this.basicDataForm.timeRangeSelect.length != 1){
                this.basicDataForm.timeRangeSelect.splice(index, 1);
            }
        },
        //上午时间范围
        amClick(item) {
            item.specifyTime = ["09:00:00", "12:59:00"];
        },
        //下午时间范围
        pmClick(item) {
            item.specifyTime = ["13:00:00", "16:59:00"];
        },
        //晚上时间范围
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
        //组装公共规则数据
        buildCommonInfoData() {
            // 初始化commonInfo
            this.commonInfo = [];
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

            //交易类型
            this.commonInfo.push({
                category: "SaleInfo",
                key: "tradeType",
                value: this.basicDataForm.tradeTypeId || "BUY",
                text: this.basicDataForm.tradeTypeInput || '["消费"]',
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
        //组装活动预算数据
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
        //组装rules
        buildTargetRules() {
            //初始化targetRules
            this.targetRules = [];
            for (let item of this.rules) {
                let rule = {
                    name: "", //规则名称
                    ruleConditions: [],
                    actions: [],
                    bizPropertyMap: this.bizPropertyMap
                };
                rule.name = item.name;
                rule.ruleConditions = this.buildRuleConditionsData(item.formData,item.conditions);
                rule.actions = this.buildActionsData(item.formData, item.actions);
                this.targetRules.push(rule);
            }
        },
        //组装活动条件数据
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
            //过滤
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
        //组装优惠方案数据
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
            //过滤
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
        //过滤所有数据（暂时用不到）
        filterAllData(ruleGroup){
            ruleGroup.commonInfo=this.filterCommonInfoData(ruleGroup.commonInfo)
        },
        //数据迁移验证(临时状态)
        validTransferStatusList(){
            let flag=false
            for(let i =0; i<this.validateStatus.length;i++){
                if(!this.validateStatus[i]){
                    flag=false
                    break;
                }else{
                    flag=true
                }
            }

            return flag;
        },
        //表单提交
        dataFormSubmit(flag) {
            this.isDisabled = true;
            setTimeout(() => {
               this.isDisabled = false;
            }, 2000)
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

                        // 迁移数据
                        if(this.transferStatus==5){
                            let transferFlag=false//迁移数据,是否允许提交执行(临时状态)
                            transferFlag=this.validTransferStatusList()//迁移数据,是否允许提交执行(临时状态)
                            if(!transferFlag){//迁移数据状态特殊处理
                                this.$message.error("请完成分组活动执行条件的修改");
                                this.isDisabled = false;
                                return false;
                            }
                        }

                        //公共规则
                        this.buildCommonInfoData();
                        //活动预算
                        this.buildBizPropertyMap();
                        //组装活动规则
                        this.buildTargetRules();

                        //基础信息(营销活动id-activityId)
                        if (this.pageType == "copy") {
                            this.activityId = "";
                        }
                        let ruleGroup = {
                            flag: flag,//保存草稿：1；提交执行：2
                            tenantId: this.basicDataForm.tenantId,//租户id
                            bizId:  this.activityId, //营销活动id
                            bizOrderCode: this.basicDataForm.activityCode, //营销活动编号
                            id: this.activityId,//活动id
                            templateId: this.basicDataForm.activityType,//模板id
                            name: this.basicDataForm.activityName,//活动名称
                            remark: this.basicDataForm.activityDesc,//活动备注
                            executeMode: this.basicDataForm.executeMode,//执行策略
                            priority: this.basicDataForm.priority == 1 ? this.basicDataForm.priorityNum : 100,//优先级
                            validDateStart: this.basicDataForm.validDateStart + " 00:00:00",//有效期开始时间
                            validDateEnd: this.basicDataForm.validDateEnd + " 00:00:00",//有效期结束时间
                            commonInfo: this.commonInfo,//公共条件 type:Array
                            ruleType: "SaleActivity",//规则类型
                            rules: this.targetRules ? this.targetRules : []//子活动条件 type:Array
                        };

                        if (this.pageType === 'revise' && (Number(this.activityState) === 3 || Number(this.activityState) === 4)){
                            this.$confirm('当前活动处于执行当中，继续操作将使当前活动失效，编辑后的活动内容需要重新审核，确认继续吗？', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                            }).then(() => {
                                this.saveDraft(ruleGroup)
                            }).catch(() => {
                                this.isDisabled = false
                            })
                        } else {
                            this.saveDraft(ruleGroup)
                        }
                    }else{
                        this.isDisabled = false;
                    }
                }
            });
        },
        // 点击保存草稿
        saveDraft(ruleGroup) {
            this.$cmmList
            .marketingAdd(ruleGroup)
            .then(data => {
                if (data && data.code === 200) {
                    //临时处理（迁移数据）
                    // if(this.transferStatus == 5){
                        // this.deleteHandle(this.transferId)
                    // }
                    this.$message({
                        message: "操作成功",
                        type: "success",
                        duration: 1500,
                        onClose: () => {
                            this.returnList()
                        }
                    });
                } else {
                    this.$message.error(data.msg);
                    this.isDisabled = false;
                }
            })
            .catch(err => {
                this.isDisabled = false;
                console.log(err);
            });
        },
        //根据活动id 删除活动（暂时用不到）
        deleteHandle(id) {
            this.$cmmList.marketingDel({
                id: id,
                tenantId: this.tenantId
            }).then(data => {
                if (data && data.code === 200) {
                   
                } else {
                    this.$message.error(data.msg)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        //添加分组活动执行条件
        addGroupRule(rule, index) {
            if(rule){
                rule=JSON.parse(JSON.stringify(rule))
                this.isStorage = false;
            }else{
                this.isStorage = true;
            }
            this.rule = rule;
            this.index = index+"";
            this.addGroupShow = true;
            this.$nextTick(() => {
                this.$refs.addGroup.init(rule, index , this.isStorage);
            });
        },
        //删除分组活动条件
        removeRule(index) {
            this.rules.splice(index, 1);
            //数据迁移(临时状态)
            if(this.transferStatus==5){
                this.validateStatus.splice(index, 1);
            }
        },
        //关闭子活动
        close() {
            this.addGroupShow = false;
        },
        //验证是否迁移成功数据(处理数据迁移临时状态)
        handleTransferStatus(data){
            if(data.status){
                this.validateStatus[data.index]=data.status
            }
        },
        //接收子活动返回的数据
        transferData(data) {
            if (data.index !== "" && data.index != null && data.index != "undefined") {
                for (let i = 0; i < this.rules.length; i++) {
                    if (i == data.index) {
                        this.rules[i] = data;
                    }
                }
            } else {
                this.rules.push(data);
                if(this.transferStatus==5){
                    //数据迁移验证(临时状态)
                    this.validateStatus.push(true)
                }
            }

            this.close()
        },
    }
}
</script>

<style lang="scss" scoped>
/deep/ .el-form-item.is-error .el-input__inner{
    border-color: #F56C6C!important;
}
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
            font-size: 12px;
            font-weight:bolder;
            color: #333333;
            border-radius: 4px;
            box-sizing: border-box;
            border: 1px solid #3B74FF;
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
        .validate-status-green{
            border: 1px solid #67C23A;
        }
        .validate-status-red{
            border: 1px solid #F56C6C;
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
