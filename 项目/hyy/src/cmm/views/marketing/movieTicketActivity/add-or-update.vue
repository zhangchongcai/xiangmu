<template>
<div class="movie-plan_default" :class="{isTableCheck:isEdit == 'detail'}">
    <el-collapse v-model="activeNames" @change="handleChange">
        <el-form :model="basicDataForm" :rules="basicDataRule" ref="basicDataForm" label-width="120px" class="common-form">
            <!-- 活动基础信息 -->
            <el-collapse-item title="活动基础信息" name="1">
                <el-form-item label="活动类型:" size="small" prop="activityType">
                    <el-radio-group v-model="basicDataForm.activityType" :disabled="disabled">
                        <el-radio-button :label="14">打折</el-radio-button>
                        <el-radio-button :label="15">立减</el-radio-button>
                        <el-radio-button :label="16">减至</el-radio-button>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="活动名称:" prop="activityName" :rules="commonRules.valActivityName" >
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
                    <el-checkbox-group v-if="isEdit != 'detail'" v-model="basicDataForm.excludeDate" :disabled="disabled">
                        <el-checkbox :label="'节假日除外'" name="excludeDate">节假日除外</el-checkbox>
                        <el-checkbox :label="'指定排除日期范围'" name="excludeDate">指定排除日期范围</el-checkbox>
                    </el-checkbox-group>
                    <div v-if="isEdit == 'detail'" class="check-font-color">{{basicDataForm.excludeDate[0] != '' ? basicDataForm.excludeDate[0]  : '不限'}}</div>
                </el-form-item>

                <div v-if="basicDataForm.excludeDate.indexOf('指定排除日期范围')!=-1">
                    <el-form-item label v-for="(item,index) in basicDataForm.excludeDateOptions" :key="index" :prop="'excludeDateOptions.'+index+'.excludeDateOption'" :rules="{required: true, message: '指定排除日期范围不能为空', trigger: 'change'}">
                        <el-date-picker v-model="item.excludeDateOption" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="disabled" @change="setExcludeDate"></el-date-picker>
                        <el-button size="small" type="text" @click="delExcludeDate(index)">删除</el-button>
                    </el-form-item>

                    <el-form-item label v-if="isEdit != 'detail'">
                        <div class="addDate" @click="addExcludeDate">
                            <i class="el-icon-circle-plus-outline"></i>添加日期
                        </div>
                    </el-form-item>
                </div>

                <el-form-item label="时段范围:" >
                    <el-select v-model="basicDataForm.timeRange" :disabled="disabled">
                        <el-option label="不限" value></el-option>
                        <el-option label="指定时段" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <div v-if="basicDataForm.timeRange==1 && basicDataForm.timeRangeSelect.length>0" class="timeRange_bg">
                    <div label v-for="(item,index) in basicDataForm.timeRangeSelect" :key="item.key" style="margin-bottom: -4px;">
                        <el-form-item>
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
                                    <span style="font-size:12px;">指定范围：</span>
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
                        <el-select v-model="basicDataForm.tradingChannel" :disabled="disabled">
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
            </el-collapse-item>

            <!-- 设置活动条件 -->
            <el-collapse-item title="设置活动条件" name="2">
                <el-row class="flex-base">
                    <el-form-item label="交易影院:" prop="tradingMerchant">
                        <el-select v-model="basicDataForm.tradingMerchant" :disabled="disabled">
                            <el-option label="包含" value="normalIn"></el-option>
                            <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="tradingMerchantInput" class="tradingMerchantInput">
                        <el-input  class="chooseWidth1" v-show="!basicDataForm.tradingMerchantInput" style="width: 166px;" v-model="basicDataForm.tradingMerchantInput" readonly></el-input>
                        <el-tooltip placement="bottom" v-show="basicDataForm.tradingMerchantInput">
                            <el-input class="chooseWidth1" style="width: 166px;" v-model="basicDataForm.tradingMerchantInput" readonly></el-input>
                            <div slot="content">
                                <div v-for="item in basicDataForm.tradingMerchantInput.split(',')" :key="item" style="font-size:12px">{{ item }}<br/></div>
                            </div>
                        </el-tooltip>   
                        <el-button class="windowBtn" type="primary" :disabled="disabled" @click="cinemaClick('movieTicketDialog')" plain>选择</el-button>
                    </el-form-item>
                </el-row>

                <el-form-item label="会员等级:">
                    <el-row class="flex-base">
                        <el-select v-model="basicDataForm.customerLevel" :disabled="disabled">
                            <el-option label="不限" value></el-option>
                            <el-option label="包含" value="normalIn"></el-option>
                            <el-option label="不包含" value="normalNotIn"></el-option>
                            <el-option label="非会员" value="not_memberOperator"></el-option>
                        </el-select>
                        <el-form-item v-if="basicDataForm.customerLevel=='normalIn' || basicDataForm.customerLevel=='normalNotIn'" prop="customerLevelInput">
                            <el-input class="chooseWidth1" v-model="basicDataForm.customerLevelInput" readonly></el-input>
                            <el-button class="windowBtn" type="primary" :disabled="disabled" @click="membershipLevelClick('otherCrmMemberLevelDialog')" plain>选择</el-button>
                        </el-form-item>
                    </el-row>
                </el-form-item>

                <!-- <el-form-item label="消费者身份:">
                    <el-row class="flex-base">
                        <el-select v-model="basicDataForm.consumerIdentity" :disabled="disabled" @change="changeConsumerIdentity">
                            <el-option label="所有(会员+非会员)" value></el-option>
                            <el-option label="全部会员" value="AllMember"></el-option>
                            <el-option label="指定会员卡政策" value="AppointMember"></el-option>
                            <el-option label="非会员" value="not_memberOperator"></el-option>
                        </el-select>
                        <el-form-item v-if="basicDataForm.consumerIdentity=='AppointMember'" prop="consumerIdentityInput">
                            <el-input class="chooseWidth1" v-model="basicDataForm.consumerIdentityInput" readonly></el-input>
                            <el-button class="windowBtn" type="primary" :disabled="disabled" @click="cardPolicyClick('movieTicketConsumerIdentityDialog')" plain>选择</el-button>
                        </el-form-item>
                    </el-row>
                </el-form-item> -->

                <el-form-item label="会员卡政策:">
                    <el-row class="flex-base">
                        <el-select v-model="basicDataForm.membershipLevel" :disabled="disabled">
                            <el-option label="不限" value></el-option>
                            <el-option label="包含" value="normalIn"></el-option>
                            <el-option label="不包含" value="normalNotIn"></el-option>
                            <el-option label="全部卡政策" value="AllMember"></el-option>
                        </el-select>
                        <el-form-item v-if="basicDataForm.membershipLevel=='normalIn' || basicDataForm.membershipLevel=='normalNotIn'" prop="membershipLevelInput">
                            <el-input class="chooseWidth1" v-model="basicDataForm.membershipLevelInput" ></el-input>
                            <el-button type="primary" v-if="basicDataForm.membershipLevel!=''" class="windowBtn" @click="cardPolicyClick('giftMembershipLevelDialog')" plain>选择</el-button>
                        </el-form-item>
                    </el-row>
                </el-form-item>
                <el-form-item label="放映效果:">
                    <el-row class="flex-base">
                        <el-select v-model="basicDataForm.projectionEffect" :disabled="disabled" clearable>
                            <el-option label="不限" value></el-option>
                            <el-option label="包含" value="FieldStringIndexOf"></el-option>
                            <el-option label="不包含" value="notFieldStringIndexOf"></el-option>
                        </el-select>
                        <el-form-item v-if="basicDataForm.projectionEffect!=''" prop="projectionEffectInput">
                            <el-input class="chooseWidth1" v-model="basicDataForm.projectionEffectInput" readonly></el-input>
                            <el-button class="windowBtn" type="primary" :disabled="disabled" v-if="basicDataForm.projectionEffect!=''" @click="projectionEffectClick()" plain>选择</el-button>
                        </el-form-item>
                    </el-row>
                </el-form-item>

                <el-form-item label="影厅类型:">
                    <el-row class="flex-base">
                        <el-select v-model="basicDataForm.studioType" :disabled="disabled" clearable>
                            <el-option label="不限" value></el-option>
                            <el-option label="包含" value="normalIn"></el-option>
                            <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                        <el-form-item v-if="basicDataForm.studioType!=''" prop="studioTypeInput">
                            <el-input class="chooseWidth1" v-model="basicDataForm.studioTypeInput" readonly></el-input>
                            <el-button class="windowBtn" type="primary" :disabled="disabled" v-if="basicDataForm.studioType!=''" @click="cinemaTypeClick()" plain>选择</el-button>
                        </el-form-item>
                    </el-row>
                </el-form-item>

                <el-form-item label="影片:">
                    <el-row class="flex-base">
                        <el-select v-model="basicDataForm.film" :disabled="disabled" clearable>
                            <el-option label="不限" value></el-option>
                            <el-option label="包含" value="normalIn"></el-option>
                            <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                        <el-form-item v-if="basicDataForm.film!=''" prop="filmInput">
                            <el-input class="chooseWidth1" v-model="basicDataForm.filmInput" ></el-input>
                            <el-button class="windowBtn" type="primary" :disabled="disabled" v-if="basicDataForm.film!=''" @click="filmClick()" plain>选择</el-button>
                        </el-form-item>
                    </el-row>
                </el-form-item>

                <el-form-item label="影片类型:">
                    <el-row class="flex-base">
                        <el-select v-model="basicDataForm.filmType" :disabled="disabled" clearable>
                            <el-option label="不限" value></el-option>
                            <el-option label="包含" value="stringSplitContainOneOperator"></el-option>
                            <el-option label="不包含" value="notStringSplitContainOneOperator"></el-option>
                        </el-select>
                        <el-form-item v-if="basicDataForm.filmType!=''" prop="filmTypeInput">
                            <el-input class="chooseWidth1" v-model="basicDataForm.filmTypeInput" readonly></el-input>
                            <el-button class="windowBtn" type="primary" :disabled="disabled" v-if="basicDataForm.filmType!=''" @click="filmTypeClick()" plain>选择</el-button>
                        </el-form-item>
                    </el-row>
                </el-form-item>

                <el-form-item label="放映有效期:">
                    <el-row class="flex-base">
                        <el-select v-model="basicDataForm.screeningValidity" :disabled="disabled" clearable @change="handleScreeningValidityChange">
                            <el-option label="不限" value></el-option>
                            <el-option label="包含范围" value="TimeBetweenOperator"></el-option>
                            <el-option label="包含每月指定日" value="DayContainOperator"></el-option>
                            <el-option label="不包含每月指定日" value="not_DayContainOperator"></el-option>
                        </el-select>
                        <el-form-item v-if="basicDataForm.screeningValidity=='TimeBetweenOperator'" prop="screeningValidityOption">
                            <el-date-picker style="position: relative;top: 2px;" v-model="basicDataForm.screeningValidityOption" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="disabled" @change="setScreeningValidity"></el-date-picker>
                        </el-form-item>
                        <el-form-item prop="screeningValidityInput" v-if="basicDataForm.screeningValidity=='DayContainOperator'||basicDataForm.screeningValidity=='not_DayContainOperator'">
                            <el-input class="chooseWidth1" v-model="basicDataForm.screeningValidityInput" :disabled="disabled"></el-input>
                        </el-form-item>
                    </el-row>
                </el-form-item>

                <el-form-item label="放映时段范围:">
                    <el-select v-model="basicDataForm.screeningPeriod" :disabled="disabled" clearable>
                        <el-option label="不限" value></el-option>
                        <el-option label="上午09:00-12:59" value="MorningOperator"></el-option>
                        <el-option label="下午13:00-16:59" value="AfternoonOperator"></el-option>
                        <el-option label="晚上17:00-02:00" value="NightOperator"></el-option>
                        <el-option label="指定时段范围" value="TimeRangeContainOperator"></el-option>
                    </el-select>
                </el-form-item>

                <div v-if="basicDataForm.screeningPeriod=='TimeRangeContainOperator'">
                    <el-form-item label v-for="(item,index) in basicDataForm.screeningPeriodOptions" :key="index" :prop="'screeningPeriodOptions.'+index+'.screeningPeriodOption'" :rules="{required: true, message: '时段范围不能为空', trigger: 'change'}">
                        <el-time-picker is-range v-model="item.screeningPeriodOption" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="HH:mm:ss" :disabled="disabled" style="float:left;" @change="setScreeningPeriod"></el-time-picker>
                        <el-button size="small" type="text" @click="delScreeningPeriod(index)">删除</el-button>
                    </el-form-item>
                </div>
                <el-form-item label v-if="basicDataForm.screeningPeriod=='TimeRangeContainOperator' && isEdit != 'detail'">
                    <div class="addDate" @click="addScreeningPeriod">
                        <i class="el-icon-circle-plus-outline"></i>添加时间
                    </div>
                </el-form-item>

                <el-form-item label="最低发行价:">
                    <el-row class="flex-base">
                        <el-select v-model="basicDataForm.issuePrice" :disabled="disabled" clearable>
                            <el-option label="不限" value></el-option>
                            <el-option label="大于" value="normalGreater"></el-option>
                            <el-option label="小于" value="normalLess"></el-option>
                            <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                            <el-option label="小于等于" value="normalLessEqual"></el-option>
                            <el-option label="不等于" value="normalNotEqual"></el-option>
                            <el-option label="等于" value="normalEqual"></el-option>
                        </el-select>
                        <el-form-item v-if="basicDataForm.issuePrice!=''" prop="issuePriceInput">
                            <el-row class="flex-base">
                                <el-input class="input-type-94" v-model="basicDataForm.issuePriceInput" :disabled="disabled" placeholder="请输入"></el-input>
                                <span class="margin-left-5">元</span>
                            </el-row>
                        </el-form-item>
                    </el-row>
                </el-form-item>

                <el-form-item label="支付方式:">
                    <el-row class="flex-base">
                        <el-select v-model="basicDataForm.payType" :disabled="disabled" clearable>
                            <el-option label="不限" value></el-option>
                            <el-option label="包含" value="normalIn"></el-option>
                            <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                        <el-form-item v-if="basicDataForm.payType!=''" prop="payTypeInput">
                            <el-input class="chooseWidth1" v-model="basicDataForm.payTypeInput" readonly></el-input>
                            <el-button class="windowBtn" type="primary" v-if="basicDataForm.payType!=''" @click="payTypeClick()" plain>选择</el-button>
                        </el-form-item>
                    </el-row>
                </el-form-item>
            </el-collapse-item>

            <!-- 设置优惠方案 -->
            <el-collapse-item title="设置优惠方案" name="3">
                <el-form-item label="优惠设置:" prop="discount">
                    <el-row class="flex-base">
                        <span>{{basicDataForm.activityType == 15 ? '立减' : basicDataForm.activityType==16 ? '定价' : basicDataForm.activityType==14 ? '折扣' : ''}}</span>
                        <el-input style="width:100px;" v-model="basicDataForm.discount" :disabled="disabled" placeholder="请输入"></el-input>
                        <span>{{basicDataForm.activityType == 15 ? '/每张影票' : basicDataForm.activityType==16 ? '元/每张影票' : basicDataForm.activityType==14 ? '%(零售价打折)' : ''}}</span>
                    </el-row>
                </el-form-item>
                <el-form-item label="折扣后取整方式:" v-if="basicDataForm.activityType==14">
                    <el-select v-model="basicDataForm.roundingMethod" :disabled="disabled">
                        <el-option label="保留小数" value="ROUND_UNNECESSARY"></el-option>
                        <el-option label="四舍五入" value="ROUND_HALF_UP"></el-option>
                        <el-option label="忽略小数取整" value="ROUND_FLOOR"></el-option>
                        <el-option label="小数进1取整" value="ROUND_CEILING"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 立减 -->
                <el-form-item label="调价方式:" v-if="basicDataForm.activityType==15">
                    <el-select v-model="basicDataForm.priceMethod" :disabled="disabled">
                        <el-option label="影票原价" value="1"></el-option>
                        <el-option label="最低票价" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="低于最低价时:">
                    <el-row class="flex-base">
                        <el-select v-model="basicDataForm.miniPrice" :disabled="disabled">
                             <!-- @change="initPrice()" -->
                            <el-option label="不允许出票" value="notAllowSale"></el-option>
                            <el-option label="用户补贴" value="clientPay"></el-option>
                            <el-option label="影院补贴" value="cinemaPay"></el-option>
                            <el-option label="第三方补贴" value="thirdaPay"></el-option>
                        </el-select>
                        <el-form-item v-if="basicDataForm.miniPrice=='cinemaPay' || basicDataForm.miniPrice=='thirdaPay'" prop="miniPriceInput" >
                            <el-row class="flex-base">
                                <span >最多补贴N元</span>
                                <el-input class="input-type-94 margin-right-10" v-model="basicDataForm.miniPriceInput" :disabled="disabled" placeholder="请输入"></el-input>
                                <!-- <span>不足部分:</span>
                                <el-select v-model="basicDataForm.subsidyPrice" :disabled="disabled">
                                    <el-option label="用户补齐" value = "clientMakeUp"></el-option>
                                    <el-option label="影院补齐" value = "cinemaMakeUp" v-if="basicDataForm.miniPrice=='cinemaPay'"></el-option>
                                    <el-option label="第三方补齐" value = "thirdaMakeUp" v-if="basicDataForm.miniPrice=='thirdaPay'"></el-option>
                                </el-select> -->
                            </el-row>
                        </el-form-item>
                    </el-row>
                </el-form-item>

                <el-form-item label="调价商品数量:">
                    <el-row class="flex-base">
                        <el-select v-model="basicDataForm.roundingNum" :disabled="disabled">
                            <el-option label="指定数量" value="appointAmount"></el-option>
                            <el-option label="全部影票" value="all"></el-option>
                            <el-option label="每会员每日数量" value="perMemberDay"></el-option>
                            <el-option label="每会员每周数量" value="perMemberWeek"></el-option>
                            <el-option label="每会员每月数量" value="perMemberMonth"></el-option>
                        </el-select>
                        <el-form-item v-if="basicDataForm.roundingNum!='all'" prop="roundingNumInput">
                            <span>数量</span>
                            <el-input style="width:100px;" v-model="basicDataForm.roundingNumInput" :disabled="disabled" placeholder="请输入"></el-input>
                            <span>个</span>
                        </el-form-item>
                    </el-row>
                </el-form-item>
            </el-collapse-item>

            <!-- 设置活动预算 -->
            <el-collapse-item title="设置活动预算" name="4">
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
                            <span>限制总票数</span>
                            <el-input class="input-type-94" v-model="basicDataForm.totalTicketsAmount" :disabled="disabled" placeholder="请输入"></el-input>
                            <span>张</span>
                        </el-form-item>
                        <el-form-item prop="totalDiscountAmount" class="margin-top-15">
                            <span>限制总优惠金额</span>
                            <el-input class="input-type-94" v-model="basicDataForm.totalDiscountAmount" :disabled="disabled" placeholder="请输入"></el-input>
                            <span>元</span>
                        </el-form-item>
                    </div>
                </el-form-item>
                <el-form-item label="活动总预算周期限制:" class="br-row">
                    <el-row class="flex-base">
                        <el-select v-model="basicDataForm.activityBudgetCycle" :disabled="disabled" @change="handleActivityBudgetChange">
                            <el-option label="不限制" value></el-option>
                            <el-option label="每日限制" value="perDay"></el-option>
                            <el-option label="每周限制" value="perWeek"></el-option>
                            <el-option label="每月限制" value="perMonth"></el-option>
                            <el-option label="每年限制" value="perYear"></el-option>
                            <el-option label="指定周期限制" value="appointTimeRange"></el-option>
                        </el-select>
                        <el-form-item v-if="basicDataForm.activityBudgetCycle == 'appointTimeRange'" prop="activityBudgetCycleDate">
                            <el-date-picker style="position: relative;top: 2px;" v-model="basicDataForm.activityBudgetCycleDate" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="disabled"></el-date-picker>
                        </el-form-item>
                    </el-row>
                    <el-form-item v-if="basicDataForm.activityBudgetCycle!=''" prop="activityBudgetCycleInput">
                        <el-row class="flex-base flex-start">
                            <span>数量</span>
                            <el-input class="input-type-94" v-model="basicDataForm.activityBudgetCycleInput" :disabled="disabled" placeholder="请输入"></el-input>
                            <span>个</span>
                        </el-row>
                    </el-form-item>
                </el-form-item>
            </el-collapse-item>
        </el-form>
    </el-collapse>

    <fixStepTool :stepData="stepData.stepList"></fixStepTool>

    <div class="flex-base flex-center bottom-control-group">
        <!-- <el-button type="primary" @click="dataFormSubmit()">效果测算</el-button> -->
        <el-button class="bottomBtn" type="primary" v-if="isEdit!='detail'" @click="dataFormSubmit('basicDataForm',2)" :disabled="isDisabled">提交执行</el-button>
        <el-button class="bottomBtn" type="primary" v-if="isEdit!='detail'" @click="dataFormSubmit('basicDataForm',1)" :disabled="isDisabled">保存草稿</el-button>
        <el-button class="bottomBtn" @click="returnList()" v-if="isEdit!='detail'">返回</el-button>
        <div v-if="isEdit=='detail'" class="detailReturnBtn">
            <el-button :class="{bottomBtn:true,returnBtn:isEdit=='detail'}" @click="returnList()">返回</el-button>
        </div>
    </div>
    <!-- 弹窗组件都加这 -->
    <section class="alert-group">
        <!-- 选择支付 -->
        <!-- <payType @getData="handlePayTypeBack" ref="payType"></payType> -->
        <!-- 支付方式 -->
        <payTypeDialog
            :title="payTypeDialog.title" 
            :dialogTableVisible.sync="payTypeDialog.payTypeDialogVisible" 
            ref="payTypeDialog"
            @callBack="handlePayTypeCallBack"
        >
        </payTypeDialog>
        <!-- 选择影院 -->
        <cinemaDialog
            :title="cinemaDialog.title" 
            :dialogTableVisible.sync="cinemaDialog.cinemaDialogVisible" 
            ref="movieTicketDialog"
            @callBack="handleMovieTicketCinemaDialogCallBack"
        >
        </cinemaDialog>
         <!-- 影片弹窗 -->
        <filmDialog
            :title="filmDialog.title" 
            :dialogTableVisible.sync="filmDialog.filmDialogVisible" 
            ref="filmDialog"
            @callBack="handleMovieTicketFilmCallBack"
        >
        </filmDialog>
        <!-- 影片类型弹窗 -->
        <filmTypeDialog
            :title="filmTypeDialog.title" 
            :dialogTableVisible.sync="filmTypeDialog.filmTypeDialogVisible" 
            ref="filmTypeDialog"
            @callBack="handleMovieTicketFilmTypeCallBack"
        >
        </filmTypeDialog>
        <!-- 影院类型弹窗 -->
        <cinemaTypeDialog
            :title="cinemaTypeDialog.title" 
            :dialogTableVisible.sync="cinemaTypeDialog.cinemaTypeDialogVisible" 
            ref="cinemaTypeDialog"
            @callBack="handleMovieTicketCinemaTypeCallBack"
        >
        </cinemaTypeDialog>
        <!-- 放映效果弹窗 -->
        <projectionEffectDialog :title="projectionEffectDialog.title" :dialogTableVisible.sync="projectionEffectDialog.projectionEffectDialogVisible" ref="projectionEffectDialog" @callBack="handleOtherProjectionEffectCallBack"></projectionEffectDialog>
        <!-- 会员卡政策弹窗 -->
        <crmCardPolicyDialog @crmCardPolicyDialogCallBack="handleCardPolicy" :whereUse="crmCardPolicyDialogWhereUse" :reviewData="reviewCrmCardPolicyTypeData" :dialogVisible.sync="crmCardPolicyDialogVisible" />
        <!-- 会员等级弹窗 -->
        <crmMemberLevelDialog @crmMemberLevelDialogCallBack="handleMembershipLevel" :whereUse="crmMemberLevelDialogWhereUse" :reviewData="reviewCrmMemberLevelData" :dialogVisible.sync="crmMemberLevelDialogVisible"/>
        <!-- 交易渠道弹窗 -->
        <tradeChannelDialog :title="tradeChannelDialog.title" :dialogTableVisible.sync="tradeChannelDialog.tradeChannelDialogVisible" ref="tradeChannelDialog" :channelNature="''" @callBack="handleOtherTradeChannelCallBack" ></tradeChannelDialog>
    </section>
</div>
</template>

<script>
import fixStepTool from "cmm/components/fix-step-tool/fix-step-tool.vue";
import fixStepMixin from "cmm/mixins/marketing/fixStepTool.js";
import qs from "qs";
import commonRules from 'cmm/mixins/rules'
console.log(commonRules)
// 弹窗混入回调方法，注册弹窗和设置回调都在此处
import alertHandle from 'cmm/mixins/marketing/alertHandle.js';
export default {
    components: {
        fixStepTool
    },
    mixins: [fixStepMixin,alertHandle,commonRules],
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
    //         console.log(this.basicDataForm.tradingChannelStateName);
    //     }
    // },
    data() {
        return {
            //限制过去时间不可选
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            // 折叠区域
            activeNames: ["1", "2", "3", "4"],
            //步骤条数据
            stepData: {
                stepEl: ".el-collapse-item",
                stepList: [{
                        name: "活动基础信息",
                        isactive: false
                    },
                    {
                        name: "设置活动条件",
                        isactive: false
                    },
                    {
                        name: "设置优惠方案",
                        isactive: false
                    },
                    {
                        name: "设置活动预算",
                        isactive: false
                    }
                ]
            },
            //表单验证数据
            basicDataRule: {
                activityType: [{
                    required: true,
                    message: "活动类型不能为空",
                    trigger: "change"
                }],
                activityName: [{
                    // validator:valActivityName,
                    // trigger:"blur"
                }],
                activityDesc: [{
                    required: true,
                    message: "活动描述不能为空",
                    trigger: "blur"
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
                tradingChannelInput:[{
                    required: true,
                    message: "交易渠道不能为空",
                    trigger: "change"
                }],
                validDateOption: [{
                    required: true,
                    message: "活动有效期不能为空",
                    trigger: "change"
                }],
                tradingMerchant: [{
                    required: true,
                    message: "交易影院不能为空",
                    trigger: "change"
                }],
                tradingMerchantInput:[{
                    required: true,
                    message: "交易影院不能为空",
                    trigger: "change"
                }],
                customerLevelInput:[{
                    required: true,
                    message: "会员等级不能为空",
                    trigger: "change"
                }],
                membershipLevelInput:[{
                    required: true,
                    message: "会员卡政策不能为空",
                    trigger: "change"
                }],
                // consumerIdentityInput:[{
                //     required: true,
                //     message: "消费者身份不能为空",
                //     trigger: "change"
                // }],
                projectionEffectInput:[{
                    required: true,
                    message: "放映效果不能为空",
                    trigger: "change"
                }],
                studioTypeInput:[{
                    required: true,
                    message: "影厅类型不能为空",
                    trigger: "change"
                }],
                filmInput:[{
                    required: true,
                    message: "影片不能为空",
                    trigger: "change"
                }],
                filmTypeInput:[{
                    required: true,
                    message: "影片类型不能为空",
                    trigger: "change"
                }],
                screeningValidityOption:[{
                    required: true,
                    message: "放映有效期不能为空",
                    trigger: "change"
                }],
                screeningValidityInput:[{
                    required: true,
                    validator: (rules, value, callback) => {
                        if (!value) {
                            return callback(new Error('指定日不能为空'));
                        }
                        // 把中文逗号替换成英文逗号
                        value = value.replace(/，/ig,',');
                        value = value.split(",")
                        if((new Set(value)).size != value.length){
                            return callback(new Error('指定日不能重复'));
                        }
                        let regExp = /^\+?[1-9][0-9]*$/;
                        for(let item of value){
                            if(!regExp.test(item)){
                                return callback(new Error('日期用逗号分隔，如"1,10,22",某个值只能1到31'));
                            }else if(item>31){
                                return callback(new Error('日期用逗号分隔，如"1,10,22",某个值只能1到31'));
                            }
                        }
                        return callback();
                    },
                    trigger: "blur"
                }],
                issuePriceInput:[{
                    required: true,
                    validator: (rules, value, callback) => {
                        if (!value) {
                            return callback(new Error('最低发行价不能为空'));
                        }
                        let regExp = /^(?:(?!0\d)\d{1,2}(?:\.\d{1,2})?|100(?:\.0{1,2})?)$/;
                        if (!regExp.test(value) || value == 0 || value == 100) {
                            return callback(new TypeError('请输入0.01-99.99范围内的正数'));
                        }
                        return callback();
                    },
                    trigger: "blur"
                }],
                payTypeInput:[{
                    required: true,
                    message: "支付方式不能为空",
                    trigger: "change"
                }],
                totalTicketsAmount: [{
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
                totalDiscountAmount: [{
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
                activityBudgetCycleDate: [{
                    required: true,
                    message: "请选择指定周期限制",
                    trigger: "change"
                }],
                activityBudgetCycleInput: [{
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
                discount:[{
                    required: true,
                    validator: (rules, value, callback) => {
                        if (!value) {
                            return callback(new Error('优惠设置不能为空'));
                        }
                        // if(this.basicDataForm.activityType==14){
                        //     let regExp = /^(?:(?!0\d)\d{1,2}(?:\.\d{1,2})?|100(?:\.0{1,2})?)$/;
                        //     if (!regExp.test(value)) {
                        //         return callback(new TypeError('请输入100以内的正数,且只允许输入两位小数位'));
                        //     }
                        // }else{
                        //     let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                        //     if (!regExp.test(value)) {
                        //         return callback(new TypeError('请输入正数,且只允许输入两位小数位'));
                        //     }else if(value == 0){
                        //         return callback(new TypeError('请输入正数,且只允许输入两位小数位'));
                        //     }
                        // }
                        let regExp = /^(?:(?!0\d)\d{1,2}(?:\.\d{1,2})?|100(?:\.0{1,2})?)$/;
                        if (!regExp.test(value)) {
                            return callback(new TypeError('请输入100以内的正数,且只允许输入两位小数位'));
                        }
                        return callback();
                    },
                    trigger: "blur"    
                }],
                miniPriceInput:[{
                    required: true,
                    validator: (rules, value, callback) => {
                        if (!value) {
                            return callback(new Error('补贴不能为空'));
                        }
                        let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                        if (!regExp.test(value) || value == 0 || value >= 1000) {
                            return callback(new TypeError('请输入0.01-999.99范围内的正数'));
                        }
                        return callback();
                    },
                    trigger: "blur"         
                }],
                roundingNumInput:[{
                    required: true,
                    validator: (rules, value, callback) => {
                        if (!value) {
                            return callback(new Error('商品数量不能为空'));
                        }
                        let regExp = /^[1-9]\d*$/;
                        if (!regExp.test(value) || value == 0 || value>=1000) {
                            return callback(new TypeError('请输入1-999范围内的正数'));
                        }
                        return callback();
                    },
                    trigger: "blur"
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
                },
                {
                    id: 7,
                    text: "星期天"
                }
            ],

            isEdit: "",
            disabled: true,
            isDisabled:false,
            activityId: "",
            isData:false,

            //公共规则部分
            commonInfo: [],
            //活动条件
            ruleConditions: [],
            //优惠方案
            actions: [],
            //活动预算
            bizPropertyMap: [],

            //表单数据
            basicDataForm: {
                // 活动基本信息
                tenantId: JSON.parse(localStorage.getItem('user')).consumerId,
                activityCode: "",

                activityType: 14,
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

                /* 设置活动条件 */
                tradingMerchant: "normalIn", //交易影院
                tradingMerchantId: "",
                tradingMerchantInput: "",

                customerLevel:"",
                customerLevelId:"",
                customerLevelInput:"",

                // consumerIdentity: "", //消费者身份
                // consumerIdentityId: "",
                // consumerIdentityInput: "", //弹窗选择值

                projectionEffect: "", //放映效果
                projectionEffectId: "",
                projectionEffectInput: "",

                studioType: "",
                studioTypeId: "",
                studioTypeInput: "",

                film: "",
                filmId: "",
                filmInput: "",

                filmType: "",
                filmTypeId: "",
                filmTypeInput: "",

                screeningPeriod: "",
                screeningPeriodOptions: [{
                    screeningPeriodOption: ""
                }], //放映时段范围
                screeningPeriodOption: "",

                screeningValidity: "",
                screeningValidityInput: "",
                screeningStart: "",
                screeningEnd: "",
                screeningValidityOption: [],

                issuePrice: "",
                issuePriceInput: "",

                payType: "",
                payTypeId: "",
                payTypeInput: "",

                membershipLevel: "",//会员卡政策
                membershipLevelId: "",
                membershipLevelInput: "",

                // 设置优惠方案
                discount: "",
                priceMethod: "2", //立减
                roundingMethod: "ROUND_HALF_UP", //四舍五入
                roundingNumInput: "",

                miniPrice: "notAllowSale",
                miniPriceInput: "",
                roundingNum: "appointAmount",
                // subsidyPrice: "clientMakeUp", //不足部分

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

                timeRangeSelectDays:[],
                rangerDays:[]
            },
            // options: [],
        };
    },
    created() {
        // this.getChannelList();
    },
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
            this.basicDataForm.activityName = (this.basicDataForm.activityName).replace(/\s*/g,"");;
        },
        init(row, isEdit) {
            if (row) {
                this.activityId = row.id || 0;
                this.isEdit = isEdit;
                console.log("isEdit",this.isEdit)
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
                            console.log(res)
                            let data = res.data.marketingActivityVO;
                            let ruleGroup = JSON.parse(
                                res.data.marketingActivityVO.ruleGroup
                            );
                            console.log("ruleGroup " + JSON.stringify(ruleGroup));

                            this.activityId = data.id;
                            this.basicDataForm.activityCode = data.activityCode;
                            this.basicDataForm.tenantId = ruleGroup.tenantId;
                            this.basicDataForm.activityType = ruleGroup.templateId;
                            console.log(this.basicDataForm.activityType)
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
                            let ruleConditions = ruleGroup.rules[0].ruleConditions;
                            let actions = ruleGroup.rules[0].actions;
                            let bizPropertyMap = ruleGroup.rules[0].bizPropertyMap;

                            //公共规则
                            for (let item of commonInfo) {
                                if (item.key == "appointInvalidDate") {
                                    this.basicDataForm.excludeDate.push("指定排除日期范围");
                                    this.basicDataForm.excludeDateOptions = [];
                                    let values = JSON.parse(item.value);
                                    for (let value of values) {
                                        let excludeDateOption = {
                                            excludeDateOption: value
                                        };
                                        this.basicDataForm.excludeDateOptions.push(
                                            excludeDateOption
                                        );
                                    }
                                } else if (item.key == "holiday") {
                                    this.basicDataForm.excludeDate.push("节假日除外");
                                } else if (item.key == "consumeWayCode") {
                                    //交易渠道
                                    this.basicDataForm.tradingChannel = item.opUniqueName ;
                                    this.basicDataForm.tradingChannelInput = item.text;
                                    this.basicDataForm.tradingChannelId = item.value;
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
                                        if (obj.workDay && obj.workDay.length > 0 && obj.workDay.length == 5) {
                                            obj.checkAllWorkDay = true;
                                            obj.isIndeterminateWithWorkDay = false;
                                        } else {
                                            obj.checkAllWorkDay = false;
                                            obj.isIndeterminateWithWorkDay = true;
                                        }
                                        obj.checkAllWeekend = false;
                                        if (obj.weekend && obj.weekend.length > 0 && obj.weekend.length == 2) {
                                            
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

                            
                            //活动条件
                            for (let item of ruleConditions) {
                                if (item.key == "cinemaCode") {
                                    //交易影院
                                    this.basicDataForm.tradingMerchant = item.opUniqueName;
                                    this.basicDataForm.tradingMerchantInput = item.text;
                                    this.basicDataForm.tradingMerchantId = item.value;
                                } else if (item.key == "customerLevelCode") {
                                    // 会员等级
                                    this.basicDataForm.customerLevel = item.opUniqueName;
                                    this.basicDataForm.customerLevelInput = item.text;
                                    this.basicDataForm.customerLevelId = item.value;
                                } else if (item.key == "cardRightCode") {
                                    //会员卡政策
                                    this.basicDataForm.membershipLevel = item.opUniqueName;
                                    this.basicDataForm.membershipLevelInput = item.text;
                                    this.basicDataForm.membershipLevelId = item.value;
                                }
                                // else if (item.key == "consumerTypeKey") {
                                //     // 消费者身份
                                //     this.basicDataForm.consumerIdentity = item.opUniqueName;
                                //     this.basicDataForm.consumerIdentityInput = item.text;
                                //     this.basicDataForm.consumerIdentityId = item.value;
                                // } 
                                else if (item.key == "showEffect") {
                                    // 放映效果
                                    this.basicDataForm.projectionEffect = item.opUniqueName;
                                    this.basicDataForm.projectionEffectInput = item.text;
                                    this.basicDataForm.projectionEffectId = item.value;
                                } else if (item.key == "hallTypeKey") {
                                    //影厅类型
                                    this.basicDataForm.studioType = item.opUniqueName;
                                    this.basicDataForm.studioTypeInput = item.text;
                                    this.basicDataForm.studioTypeId = item.text;
                                } else if (item.key == "uniformCode") {
                                    // 影片
                                    this.basicDataForm.film = item.opUniqueName;
                                    this.basicDataForm.filmInput = item.text;
                                    this.basicDataForm.filmId = item.value;
                                } else if (item.key == "filmTypeKey") {
                                    //影片类型
                                    this.basicDataForm.filmType = item.opUniqueName;
                                    this.basicDataForm.filmTypeInput = item.text;
                                    this.basicDataForm.filmTypeId = item.value;
                                } else if (item.key == "planStartTime") {
                                    //放映有效期
                                    this.basicDataForm.screeningValidity = item.opUniqueName;
                                    if (this.basicDataForm.screeningValidity == "TimeBetweenOperator") {
                                        this.basicDataForm.screeningValidityOption = JSON.parse(item.value);
                                    } else if (this.basicDataForm.screeningValidity == "DayContainOperator" || this.basicDataForm.screeningValidity == "not_DayContainOperator") {
                                        this.basicDataForm.screeningValidityInput = item.value.replace(/\"/g, "");
                                    }
                                } else if (item.key == "filmPlanTimeRange") {
                                    //放映时段范围
                                    this.basicDataForm.screeningPeriod = item.opUniqueName;
                                    if(item.value != ""){
                                        let value = JSON.parse(item.value)
                                        let dateTime = "";
                                        this.basicDataForm.screeningPeriodOptions = [];
                                        for(let item of value){
                                            dateTime = {screeningPeriodOption:item}
                                            this.basicDataForm.screeningPeriodOptions.push(dateTime)
                                        }
                                    }else{
                                        this.basicDataForm.screeningPeriodOptions = []
                                    }
                                } else if (item.key == "lowestPrice") {
                                    //最低发行价
                                    this.basicDataForm.issuePrice = item.opUniqueName;
                                    this.basicDataForm.issuePriceInput = item.value;
                                } else if (item.key == "payTypeCode") {
                                    //支付方式
                                    this.basicDataForm.payType = item.opUniqueName;
                                    this.basicDataForm.payTypeInput = item.text;
                                    this.basicDataForm.payTypeId = item.value;
                                }
                            }

                            // 优惠方案
                            for (let item of actions) {
                                if (item.key == "modifyValue") {
                                    this.basicDataForm.discount =  Math.abs(item.value-0);
                                } else if (item.key == "modifyWay") {
                                    if (item.value == "addToLowestPrice") {
                                        this.basicDataForm.priceMethod = "2";
                                    } else if (item.value == "subPrice") {
                                        this.basicDataForm.priceMethod = "1";
                                    }
                                } else if (item.key == "decimalRoundMode") {
                                    this.basicDataForm.roundingMethod = item.value;
                                } else if (item.key == "lessProcessMethod") {
                                    this.basicDataForm.miniPrice = item.value;
                                } else if (item.key == "cinemaPayAmount") {
                                    this.basicDataForm.miniPriceInput = item.value;
                                } else if (item.key == "modifyAmountMethod") {
                                    this.basicDataForm.roundingNum = item.value;
                                } else if (item.key == "modifyAmount") {
                                    this.basicDataForm.roundingNumInput = item.value;
                                }
                            }

                            // 活动预算
                            this.basicDataForm.amountCalculation = bizPropertyMap.budgetSet;
                            this.basicDataForm.activityBudgetCycle = bizPropertyMap.runRestrainType;
                            if(!this.basicDataForm.activityBudgetCycle){
                                this.basicDataForm.activityBudgetCycle = "";
                            }
                            if (bizPropertyMap.appointRunRestrainRange) {
                                this.basicDataForm.activityBudgetCycle == "appointTimeRange";
                                this.basicDataForm.activityBudgetCycleDate = JSON.parse(bizPropertyMap.appointRunRestrainRange);
                            }
                            if (this.basicDataForm.activityBudgetCycle != "") {
                                this.basicDataForm.activityBudgetCycleInput = bizPropertyMap.runAmount;
                            }
                            this.basicDataForm.totalDiscountAmount = bizPropertyMap.totalDiscountAmount;
                            this.basicDataForm.totalTicketsAmount = bizPropertyMap.totalTicketsAmount;
                            if (bizPropertyMap.totalDiscountAmount && bizPropertyMap.totalTicketsAmount) {
                                this.basicDataForm.activityBudgetSum = "1";
                            }
                        }
                            //复制情况下 ID 置空
                            if(isEdit == "copy"){
                                this.activityId = ""
                            }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
            if (this.isEdit == "detail") {
                this.disabled = true;
            } else {
                this.disabled = false;
            }
        },
        //初始化不足部分
        // initPrice(){
        //     this.basicDataForm.subsidyPrice = "clientMakeUp";
        // },
        returnList() {
            this.$emit("refreshDataList");
        },
        handleChange(val) {
            console.log(val); 
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
            this.testExcludeDate();
        },
        // 验证排除日期
        testExcludeDate(){
            if(this.validExcludeDate()){
                this.$message.error("指定排除日期不能相同");
            }
        },

        // 验证放映时段范围
        testScreeningPeriod(){
            if(this.validScreeningPeriod()){
                this.$message.error("放映时段范围不能相同");
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
            item.isIndeterminateWithWeekend = checkedCount > 0 && checkedCount < this.weekendOptions.length;
        },
        /* 设置具体时间范围 */
        // setSpecifyTime(item,val) {
        //     item.specifyTime = val;
        // },
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
        //改变消费者身份
        changeConsumerIdentity(val){
            console.log(val)
            if(val){
                if(val=="AllMember"){
                    this.basicDataForm.consumerIdentityId=true
                }else if(val=="not_memberOperator"){
                    this.basicDataForm.consumerIdentityId=true
                }else{
                    this.basicDataForm.consumerIdentityId=""
                }
            }
        },
        /*添加放映时段范围 */
        addScreeningPeriod() {
            this.basicDataForm.screeningPeriodOptions.push({
                screeningPeriodOption: ""
            });
        },
        /*修改放映时段范围 */
        setScreeningPeriod(val) {
            this.basicDataForm.screeningPeriodOption = val;
            this.testScreeningPeriod();
        },

        /*删除放映时段范围 */
        delScreeningPeriod(index) {
            if(this.basicDataForm.screeningPeriodOptions.length != 1){
                this.basicDataForm.screeningPeriodOptions.splice(index, 1);
            }
        },

        handleActivityBudgetChange() {
            this.basicDataForm.activityBudgetCycleInput = "";
        },

        /* 设置放映有效期 */
        setScreeningValidity(val) {
            if (val) {
                this.basicDataForm.screeningStart = val[0];
                this.basicDataForm.screeningEnd = val[1];
                this.basicDataForm.screeningValidityOption = val;
                // this.$refs['basicDataForm'].clearValidate(['screeningValidityOption'])
            } else {
                this.basicDataForm.screeningStart = "";
                this.basicDataForm.screeningEnd = "";
                // this.$refs['basicDataForm'].clearValidate(['screeningValidityOption'])
            }
        },
        /* 修改放映有效期 */
        handleScreeningValidityChange(value) {
            if (value == "TimeBetweenOperator") {
                this.basicDataForm.screeningValidityInput = "";
            } else if (
                this.basicDataForm.screeningValidity == "DayContainOperator" ||
                this.basicDataForm.screeningValidity == "not_DayContainOperator"
            ) {
                this.basicDataForm.screeningValidityOption = [];
            } else {
                this.basicDataForm.screeningValidityInput = "";
                this.basicDataForm.screeningValidityOption = [];
            }
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
        //验证放映时段范围
        validScreeningPeriod(){
            let screeningPeriodArr = [];
            if(this.basicDataForm.screeningPeriodOptions){
                for(let item of this.basicDataForm.screeningPeriodOptions){
                    if(item.screeningPeriodOption){
                        screeningPeriodArr.push(item.screeningPeriodOption.join(","))
                    }
                }
                if((new Set(screeningPeriodArr)).size != screeningPeriodArr.length){
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
                    value: "true",
                    text: "",
                    opUniqueName: "not_HolidayOperator"
                });
            }

            if (this.basicDataForm.excludeDate.indexOf("指定排除日期范围") != -1) {
                //指定排除日期范围
                console.log(this.basicDataForm.excludeDateOptions)
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
                console.log(rangerValue)
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
            this.commonInfo.push({
                category: "SaleInfo",
                key: "tradeType",
                value: "BUY",
                text: "",
                opUniqueName: "normalEqual"
            });
        },

        /* 组装活动条件数据 */
        buildRuleConditionsData() {
            /* 活动条件 */
            // 交易影院
            if (this.basicDataForm.tradingMerchant != "") {
                this.ruleConditions.push({
                    category: "SaleInfo",
                    key: "cinemaCode",
                    groupId: 14,
                    value: this.basicDataForm.tradingMerchantId, //弹窗回传
                    text: this.basicDataForm.tradingMerchantInput, //弹窗回传
                    opUniqueName: this.basicDataForm.tradingMerchant //操作符,不填默认为 =
                });
            }

            // 会员等级
            if (this.basicDataForm.customerLevel != "") {
                this.ruleConditions.push({
                    category: "SaleInfo",
                    key: "customerLevelCode",
                    groupId: 101,
                    value: this.basicDataForm.customerLevelId,
                    text: this.basicDataForm.customerLevelInput,
                    opUniqueName: this.basicDataForm.customerLevel
                });
            }
            // 会员卡政策
            if (this.basicDataForm.membershipLevel == "normalIn") {
                this.ruleConditions.push({
                    category: "SaleInfo",
                    key: "cardRightCode",
                    groupId: 100,
                    value: this.basicDataForm.membershipLevelId,
                    text: this.basicDataForm.membershipLevelInput,
                    opUniqueName: this.basicDataForm.membershipLevel
                });
            }
            // 消费者身份
            // if (this.basicDataForm.consumerIdentity != "") {
            //     this.ruleConditions.push({
            //         category: "SaleInfo",
            //         key: "consumerTypeKey",
            //         groupId: 27,
            //         value: this.basicDataForm.consumerIdentityId,
            //         text: this.basicDataForm.consumerIdentityInput,
            //         opUniqueName: this.basicDataForm.consumerIdentity
            //     });
            // }
            // 放映效果
            if (this.basicDataForm.projectionEffect != "") {
                this.ruleConditions.push({
                    category: "FilmTicketInfo",
                    key: "showEffect",
                    groupId: 35,
                    value: this.basicDataForm.projectionEffectId,
                    text: this.basicDataForm.projectionEffectInput,
                    opUniqueName: this.basicDataForm.projectionEffect
                });
            }
            // 影厅类型
            if (this.basicDataForm.studioType != "") {
                this.ruleConditions.push({
                    category: "FilmTicketInfo",
                    key: "hallTypeKey",
                    groupId: 36,
                    value: this.basicDataForm.studioTypeId,
                    text: this.basicDataForm.studioTypeInput,
                    opUniqueName: this.basicDataForm.studioType
                });
            }
            // 影片
            if (this.basicDataForm.film != "") {
                this.ruleConditions.push({
                    category: "FilmTicketInfo",
                    key: "uniformCode",
                    groupId: 79,
                    value: this.basicDataForm.filmId,
                    text: this.basicDataForm.filmInput,
                    opUniqueName: this.basicDataForm.film
                });
            }
            // 影片类型
            if (this.basicDataForm.filmType != "") {
                this.ruleConditions.push({
                    category: "FilmTicketInfo",
                    key: "filmTypeKey",
                    groupId: 34,
                    value: this.basicDataForm.filmTypeId,
                    text: this.basicDataForm.filmTypeInput,
                    opUniqueName: this.basicDataForm.filmType
                });
            }

            // 放映有效期
            if (this.basicDataForm.screeningValidity != "") {
                let targetValue = "";
                if (this.basicDataForm.screeningValidity == "TimeBetweenOperator") {
                    targetValue = this.basicDataForm.screeningValidityOption;
                } else if (
                    this.basicDataForm.screeningValidity == "DayContainOperator" ||
                    this.basicDataForm.screeningValidity == "not_DayContainOperator"
                ) {
                    targetValue = this.basicDataForm.screeningValidityInput.replace(/，/ig,',');
                }

                this.ruleConditions.push({
                    category: "FilmTicketInfo",
                    key: "planStartTime",
                    groupId: 81,
                    value: targetValue != "" ? JSON.stringify(targetValue) : "",
                    text: "",
                    opUniqueName: this.basicDataForm.screeningValidity
                });
            }
            // 放映时段范围
            if (this.basicDataForm.screeningPeriod != "") {
                let targetValue = "";
                if (this.basicDataForm.screeningPeriod == "TimeRangeContainOperator") {
                    targetValue = this.basicDataForm.screeningPeriodOptions.map(item => {
                        if (item.screeningPeriodOption) {
                            return item.screeningPeriodOption;
                        }
                    });
                }
                this.ruleConditions.push({
                    category: "FilmTicketInfo",
                    key: "filmPlanTimeRange",
                    groupId: 84,
                    value: targetValue != "" ? JSON.stringify(targetValue) : "",
                    text: "",
                    opUniqueName: this.basicDataForm.screeningPeriod
                });
            }

            // 最低发行价
            if (this.basicDataForm.issuePrice != "") {
                this.ruleConditions.push({
                    category: "FilmTicketInfo",
                    key: "lowestPrice",
                    groupId: 38,
                    value: this.basicDataForm.issuePriceInput,
                    text: "",
                    opUniqueName: this.basicDataForm.issuePrice
                });
            }
            // 支付方式
            if (this.basicDataForm.payType != "") {
                this.ruleConditions.push({
                    category: "SaleInfo",
                    key: "payTypeCode",
                    groupId: 86,
                    value: this.basicDataForm.payTypeId,
                    text: this.basicDataForm.payTypeInput,
                    opUniqueName: this.basicDataForm.payType
                });
            }
        },

        /* 组装优惠设置数据 */
        buildActionsData() {
            let targetValue = "discountPrice";
            if (this.basicDataForm.activityType == 15) {
                if (this.basicDataForm.priceMethod == 1) {
                    targetValue = "subPrice";
                } else if (this.basicDataForm.priceMethod == 2) {
                    targetValue = "addToLowestPrice";
                }
            } else if (this.basicDataForm.activityType == 16) {
                targetValue = "fixPrice";
            }
            if(this.basicDataForm.activityType == 15){
                this.basicDataForm.discount=(this.basicDataForm.discount*-1)+""
            }

              //优惠设置- 修改单票售价
            this.actions.push({
                key: "modifyValue",
                groupId: 15,
                value: this.basicDataForm.discount,
                text: "",
                opUniqueName: "FilmTicketPriceModify"
            });

            //调价方式
            this.actions.push({
                key: "modifyWay",
                groupId: 15,
                value: targetValue,
                text: "",
                opUniqueName: "FilmTicketPriceModify"
            });

            //折扣后取整方式
            this.actions.push({
                key: "decimalRoundMode",
                groupId: 15,
                value: this.basicDataForm.roundingMethod,
                text: "",
                opUniqueName: "FilmTicketPriceModify"
            });

            //低于最低价时
            this.actions.push({
                key: "lessProcessMethod",
                groupId: 15,
                value: this.basicDataForm.miniPrice,
                text: "",
                opUniqueName: "FilmTicketPriceModify"
            });

            //影院最多补贴N元
            if (this.basicDataForm.miniPriceInput != "") {
                this.actions.push({
                    key: "cinemaPayAmount",
                    groupId: 15,
                    value: this.basicDataForm.miniPriceInput,
                    text: "",
                    opUniqueName: "FilmTicketPriceModify"
                });
            }

            //调价商品数量
            this.actions.push({
                key: "modifyAmountMethod",
                groupId: 15,
                value: this.basicDataForm.roundingNum,
                text: "",
                opUniqueName: "FilmTicketPriceModify"
            });

            //数量
            if (this.basicDataForm.roundingNumInput != "") {
                this.actions.push({
                    key: "modifyAmount",
                    groupId: 15,
                    value: this.basicDataForm.roundingNumInput,
                    text: "",
                    opUniqueName: "FilmTicketPriceModify"
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
            let obj={}
            for (const key in this.bizPropertyMap) {
                if (this.bizPropertyMap[key]) {
                    obj[key]=this.bizPropertyMap[key]
                }
            }
            this.bizPropertyMap=obj
            console.log(this.bizPropertyMap)
        },
        
        // 表单提交
        dataFormSubmit(formName,flag) {
            
            this.isDisabled = true;
            this.validAppointDays();
            
            this.$refs[formName].validate((valid) => {
                if(this.validExcludeDate()){
                    this.$message.error("指定排除日期不能相同");
                    this.isDisabled = false;
                }else if(this.validRangerValue()){
                    this.$message.error("指定时段不能相同");
                    this.isDisabled = false;
                }else if(this.validScreeningPeriod()){
                    this.$message.error("指定放映时段范围不能相同");
                    this.isDisabled = false;
                }else{
                    if (valid) {
                        // this.$refs["basicDataForm"].validate(valid => {
                        // if (valid) {
                        /* 公共规则 */
                        this.buildCommonInfoData();

                        /* 活动条件 */
                        this.buildRuleConditionsData();

                        /* 优惠设置 */
                        this.buildActionsData();

                        /* 活动预算 */
                        this.buildBizPropertyMap();

                        // }

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
                            rules: [{
                                name: "", //规则名称
                                ruleConditions: this.ruleConditions, //活动规则
                                actions: this.actions,
                                bizPropertyMap: this.bizPropertyMap
                            }]
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
                                            this.$emit("refreshDataList",true);
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
                    }else{
                        this.isDisabled = false;
                    }
                }
            })
            
            
        }

        
    }
};
</script>
<style lang="scss" scoped>
    @import "../../../assets/comstyle.scss";
    .el-select-dropdown__item{
        font-size: 12px !important;
    }
    /deep/.movie-plan_default{
        .el-radio-button__inner{
            width: 80px;
            height: 32px;
        }
    }
</style>


