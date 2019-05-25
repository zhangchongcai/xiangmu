<template>
<div class="movie-plan_default" :class="{isTableCheck:isEdit == 'detail'}">
    <div class="breadcrumb">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>赠送余额活动</el-breadcrumb-item>
            <el-breadcrumb-item>赠送余额总览</el-breadcrumb-item>
            <el-breadcrumb-item class="primary">{{isEdit=="update" ? '修改' : (isEdit=="detail" ? '查看' : (isEdit=="copy" ? '复制' : '新建'))}}赠送余额</el-breadcrumb-item>
        </el-breadcrumb>
    </div>

    <el-collapse v-model="activeNames" @change="handleChange">
        <el-form :model="basicDataForm" :rules="basicDataRule" ref="basicDataForm" label-width="150px" class="common-form">
            <!-- 活动基础信息 -->
            <el-collapse-item title="活动基础信息" name="1">
                <el-form-item label="活动类型:" size="small" prop="activityType">
                    <el-radio-group v-model="basicDataForm.activityType" :disabled="disabled">
                        <el-radio-button :label="27">开卡送余额</el-radio-button>
                        <el-radio-button :label="28">充值送余额</el-radio-button>
                        <el-radio-button :label="29">消费送余额</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="活动名称:" prop="activityName">
                    <el-input class="input-type-217" v-model="basicDataForm.activityName" placeholder="请输入活动名称" :disabled="disabled" @blur="valActivityName" maxlength="15"></el-input>
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
                            <el-button type="text" slot="reference" class="el-icon-warning"></el-button>
                            <!-- <span style="color:#ffffff">1</span> -->
                        </el-popover>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="执行优先级:" size="mini" prop="priorityNum" class="priorityNum">
                    <el-radio-group v-model="basicDataForm.priority" style="width:70%;" :disabled="disabled">
                        <el-row class="flex-base">
                            <el-radio :label="1">输入优先级数字</el-radio>
                            <el-form-item prop="priorityNum">
                                <el-input class="input-type-94" v-if="basicDataForm.priority==1" v-model="basicDataForm.priorityNum" :disabled="disabled" placeholder="数值越大优先级越高(0-99)" min="0" max="99"></el-input>
                            </el-form-item>
                            <el-radio class="margin-left-10" :label="2">按最优先执行</el-radio>
                        </el-row>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="活动有效期:" prop="validDateOption">
                    <el-date-picker v-model="basicDataForm.validDateOption" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="disabled" @change="setValidityDate"></el-date-picker>
                </el-form-item>
                <el-form-item label="排除日期:">
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
                <!-- <el-form-item label="时段范围">
            <el-select v-model="basicDataForm.timeRange" :disabled="disabled">
              <el-option label="不限制" value="0"></el-option>
              <el-option label="指定时段" value="1"></el-option>
            </el-select>
          </el-form-item>
          <div v-if="basicDataForm.timeRange==1" class="timeRange_bg">
            <el-form-item label style="margin-bottom: -4px;">
              <el-checkbox
                :indeterminate="isIndeterminateWithWorkDay"
                v-model="checkAllWorkDay"
                :disabled="disabled"
                @change="handleCheckAllWorkDayChange"
                style="float:left; margin-right:25px;"
              >工作日</el-checkbox>
              <el-checkbox-group
                v-model="basicDataForm.workday"
                :disabled="disabled"
                @change="handleCheckedWorkDayChange"
              >
                <el-checkbox
                  v-for="item in workDayOptions"
                  :label="item.id"
                  :key="item.id"
                >{{item.text}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label>
              <el-checkbox
                :indeterminate="isIndeterminateWithWeekend"
                :disabled="disabled"
                v-model="checkAllWeekend"
                @change="handleCheckAllWeekendChange"
                style="float:left; margin-right:40px;"
              >周末</el-checkbox>
              <el-checkbox-group
                v-model="basicDataForm.weekend"
                :disabled="disabled"
                @change="handleCheckedWeekendChange"
              >
                <el-checkbox
                  v-for="item in weekendOptions"
                  :label="item.id"
                  :key="item.id"
                >{{item.text}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label>
              <el-time-picker
                is-range
                v-model="specifyTime"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="HH:mm:ss"
                :disabled="disabled"
                @change="setSpecifyTime"
                style="float:left;"
              ></el-time-picker>
              <div style="float:left; margin-left:25px;">
                <span>指定范围：</span>
                <el-button size="small" type="text" @click="amClick">上午</el-button>
                <el-button size="small" type="text" @click="pmClick">下午</el-button>
                <el-button size="small" type="text" @click="eveningClick">晚上</el-button>
              </div>
            </el-form-item>
          </div>
          <el-form-item label v-if="basicDataForm.timeRange==1">
            <div class="addDate" @click="addSpecifyTime">
              <i class="el-icon-circle-plus-outline"></i>添加时间
            </div>
          </el-form-item> -->
                <el-form-item label="时段范围:">
                    <el-select v-model="basicDataForm.timeRange" :disabled="disabled">
                        <el-option label="不限制" value="0"></el-option>
                        <el-option label="指定时段" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <div v-if="basicDataForm.timeRange==1 && basicDataForm.timeRangeSelect.length>0" class="timeRange_bg">
                    <div label v-for="(item,index) in basicDataForm.timeRangeSelect" :key="index" style="margin-bottom: -4px;">
                        <el-form-item>
                            <el-checkbox :indeterminate="item.isIndeterminateWithWorkDay" v-model="item.checkAllWorkDay" :disabled="disabled" @change="handleCheckAllWorkDayChange(item,$event)" style="float:left; margin-right:25px;">工作日
                            </el-checkbox>

                            <el-checkbox-group v-model="item.workDay" :disabled="disabled" @change="handleCheckedWorkDayChange(item,$event)">
                                <el-checkbox v-for="item in workDayOptions" :label="item.id" :key="item.id">{{item.text}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>

                        <el-form-item label>
                            <el-checkbox :indeterminate="item.isIndeterminateWithWeekend" :disabled="disabled" v-model="item.checkAllWeekend" @change="handleCheckAllWeekendChange(item,$event)" style="float:left; margin-right:40px;">周末
                            </el-checkbox>
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
                <el-form-item label="交易渠道:">
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
            <!-- 设置活动条件 -->
            <el-collapse-item title="设置活动条件" name="2">
                <el-form-item label="交易商户:" prop="tradingMerchant">
                    <el-select v-model="basicDataForm.tradingMerchant" :disabled="disabled">
                        <el-option label="包含" value="normalIn"></el-option>
                        <el-option label="不包含" value="normalNotIn"></el-option>
                    </el-select>
                    <el-input class="chooseWidth1" v-model="basicDataForm.tradingMerchantInput" ></el-input>
                    <el-button type="primary" style="margin-left:10px;" @click="tradingMerchantClick()" plain>选择</el-button>
                </el-form-item>
                <el-form-item label="会员等级:">
                    <el-select v-model="basicDataForm.membershipLevel" :disabled="disabled">
                        <el-option label="全部会员" value="AllMember"></el-option>
                        <el-option label="指定会员等级" value="normalIn"></el-option>
                    </el-select>
                    <el-input class="chooseWidth1" v-if="basicDataForm.membershipLevel=='normalIn'" v-model="basicDataForm.membershipLevelInput" ></el-input>
                    <el-button type="primary" v-if="basicDataForm.membershipLevel=='normalIn'" style="margin-left:10px;" @click="membershipLevelClick()" plain>选择</el-button>
                </el-form-item>
                <div v-if="basicDataForm.activityType==29">
                    <el-form-item label="放映效果:">
                        <el-select v-model="basicDataForm.projectionEffect" :disabled="disabled" clearable>
                            <el-option label="不限" value></el-option>
                            <el-option label="包含" value="FieldStringIndexOf"></el-option>
                            <el-option label="不包含" value="notFieldStringIndexOf"></el-option>
                        </el-select>
                        <el-input class="chooseWidth1" v-if="basicDataForm.projectionEffect!=''" v-model="basicDataForm.projectionEffectInput" ></el-input>
                        <el-button type="primary" disabled="disabled" v-if="basicDataForm.projectionEffect!=''" style="margin-left:10px;" @click="projectionEffectClick()" plain>选择</el-button>
                    </el-form-item>

                    <el-form-item label="影厅类型:">
                        <el-select v-model="basicDataForm.studioType" :disabled="disabled" clearable>
                            <el-option label="不限" value></el-option>
                            <el-option label="包含" value="normalIn"></el-option>
                            <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                        <el-input class="chooseWidth1" v-if="basicDataForm.studioType!=''" v-model="basicDataForm.studioTypeInput" ></el-input>
                        <el-button type="primary" disabled="disabled" v-if="basicDataForm.studioType!=''" style="margin-left:10px;" @click="studioTypeClick()" plain>选择</el-button>
                    </el-form-item>

                    <el-form-item label="影片:">
                        <el-select v-model="basicDataForm.film" :disabled="disabled" clearable>
                            <el-option label="不限" value></el-option>
                            <el-option label="包含" value="normalIn"></el-option>
                            <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                        <el-input class="chooseWidth1" v-if="basicDataForm.film!=''" v-model="basicDataForm.filmInput" ></el-input>
                        <el-button type="primary" disabled="disabled" v-if="basicDataForm.film!=''" style="margin-left:10px;" @click="filmClick()" plain>选择</el-button>
                    </el-form-item>
                    <el-form-item label="影片类型:">
                        <el-select v-model="basicDataForm.filmType" :disabled="disabled" clearable>
                            <el-option label="不限" value></el-option>
                            <el-option label="包含" value="stringSplitContainOneOperator"></el-option>
                            <el-option label="不包含" value="notStringSplitContainOneOperator"></el-option>
                        </el-select>
                        <el-input class="chooseWidth1" v-if="basicDataForm.filmType!=''" v-model="basicDataForm.filmTypeInput" ></el-input>
                        <el-button type="primary" disabled="disabled" v-if="basicDataForm.filmType!=''" style="margin-left:10px;" @click="filmTypeClick()" plain>选择</el-button>
                    </el-form-item>

                    <el-form-item label="放映有效期:">
                        <el-select v-model="basicDataForm.screeningValidity" :disabled="disabled" clearable @change="handleScreeningValidityChange">
                            <el-option label="不限" value></el-option>
                            <el-option label="包含范围" value="TimeBetweenOperator"></el-option>
                            <el-option label="包含每月指定日" value="DayContainOperator"></el-option>
                            <el-option label="不包含每月指定日" value="not_DayContainOperator"></el-option>
                        </el-select>
                        <el-date-picker v-if="basicDataForm.screeningValidity=='TimeBetweenOperator'" v-model="basicDataForm.screeningValidityOption" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="disabled" @change="setScreeningValidity"></el-date-picker>
                        <el-input class="chooseWidth1" v-if="basicDataForm.screeningValidity=='DayContainOperator'||basicDataForm.screeningValidity=='not_DayContainOperator'" v-model="basicDataForm.screeningValidityInput" :disabled="disabled"></el-input>
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
                        <el-form-item label v-for="(item,index) in basicDataForm.screeningPeriodOptions" :key="index">
                            <el-date-picker v-model="item.screeningPeriodOption" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="disabled" @change="setScreeningPeriod"></el-date-picker>
                            <el-button size="small" type="text" @click="delScreeningPeriod(index)">删除</el-button>
                        </el-form-item>
                    </div>
                    <el-form-item label v-if="basicDataForm.screeningPeriod=='TimeRangeContainOperator'">
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
                                <el-input class="input-type-94 margin-left-5" v-model="basicDataForm.issuePriceInput" :disabled="disabled" placeholder="请输入"></el-input>
                                <span class="margin-left-5">元</span>
                            </el-form-item>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="商品名称:" prop="tradeName">
                        <el-select v-model="basicDataForm.tradeName" :disabled="disabled" clearable>
                            <el-option label="不限" value></el-option>
                            <el-option label="包含" value="normalIn"></el-option>
                            <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                        <el-input class="chooseWidth1" v-if="basicDataForm.tradeName!=''" v-model="basicDataForm.tradeNameInput" ></el-input>
                        <el-button type="primary" v-if="basicDataForm.tradeName!=''" style="margin-left:10px;" @click="tradeNameClick()" plain>选择</el-button>
                    </el-form-item>
                    <el-form-item label="卖品单价:" prop="goodsSold">
                        <el-row class="flex-base">
                            <el-select v-model="basicDataForm.goodsSold" :disabled="disabled" clearable>
                                <el-option label="不限" value></el-option>
                                <el-option label="大于" value="normalGreater"></el-option>
                                <el-option label="小于" value="normalLess"></el-option>
                                <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                <el-option label="小于等于" value="normalLessEqual"></el-option>
                                <el-option label="等于" value="normalEqual"></el-option>
                            </el-select>
                            <el-form-item v-if="basicDataForm.goodsSold!=''" prop="goodsSoldInput">
                                <el-input class="margin-left-5 input-type-94" v-model="basicDataForm.goodsSoldInput" :disabled="disabled" placeholder="请输入"></el-input>
                                <span class="margin-left-5">元</span>
                            </el-form-item>
                        </el-row>
                    </el-form-item>
                </div>
                <!-- 开卡送余额 -->
                <el-form-item label="支付方式:" v-if="basicDataForm.activityType!=28">
                    <el-select v-model="basicDataForm.payType" :disabled="disabled" clearable>
                        <el-option label="不限" value></el-option>
                        <el-option label="包含" value="normalIn"></el-option>
                        <el-option label="不包含" value="normalNotIn"></el-option>
                    </el-select>
                    <el-input class="chooseWidth1" v-if="basicDataForm.payType!=''" v-model="basicDataForm.payTypeInput" ></el-input>
                    <el-button type="primary" v-if="basicDataForm.payType!=''" style="margin-left:10px;" @click="payTypeClick()" plain>选择</el-button>
                </el-form-item>
                <el-form-item label="首充金额:" v-if="basicDataForm.activityType==27">
                    <el-row class="flex-base">
                        <el-select v-model="basicDataForm.firstChargeAmount" :disabled="disabled" clearable>
                            <el-option label="不限" value=""></el-option>
                            <el-option label="大于" value="normalGreater"></el-option>
                            <el-option label="等于" value="normalEqual"></el-option>
                            <el-option label="小于" value="normalLess"></el-option>
                            <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                            <el-option label="小于等于" value="normalLessEqual"></el-option>
                            <el-option label="不等于" value="normalNotEqual"></el-option>
                            <el-option label="包含区间" value="BetweenOperator"></el-option>
                            <el-option label="不包含区间" value="not_BetweenOperator"></el-option>
                        </el-select>
                        <el-form-item v-if="basicDataForm.firstChargeAmount!=''" prop="firstChargeAmountInput">
                            <el-row class="margin-left-5">
                                <el-input class="input-type-94" v-model="basicDataForm.firstChargeAmountInput" :disabled="disabled" placeholder="请输入"></el-input>
                                <span>元</span>
                            </el-row>
                        </el-form-item>
                    </el-row>
                </el-form-item>
                <div v-if="basicDataForm.activityType==28">
                    <!-- 充值送余额 -->
                    <el-form-item label="单次充值金额:">
                        <el-row class="flex-base">
                            <el-select v-model="basicDataForm.chargeAmount" :disabled="disabled" clearable>
                                <el-option label="不限" value></el-option>
                                <el-option label="大于" value="customGreater"></el-option>
                                <el-option label="等于" value="customEqual"></el-option>
                                <el-option label="小于" value="customLess"></el-option>
                                <el-option label="小于等于" value="customLessEqual"></el-option>
                                <el-option label="大于等于" value="customGreaterEqual"></el-option>
                            </el-select>
                            <el-form-item v-if="basicDataForm.sumPrice!=''" prop="chargeAmountInput">
                                <el-input class="input-type-94 margin-left-5" v-model="basicDataForm.chargeAmountInput" :disabled="disabled" placeholder="请输入"></el-input>
                                <span class="margin-left-5">元</span>
                            </el-form-item>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="累计充值金额:">
                        <el-row class="flex-base">
                            <el-select v-model="basicDataForm.chargeAmountSum" :disabled="disabled" clearable>
                                <el-option label="不限" value></el-option>
                                <el-option label="大于" value="normalGreater"></el-option>
                                <el-option label="等于" value="normalEqual"></el-option>
                                <el-option label="小于" value="normalLess"></el-option>
                                <el-option label="小于等于" value="normalLessEqual"></el-option>
                                <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                <el-option label="不等于" value="normalNotEqual"></el-option>
                            </el-select>
                            <el-form-item v-if="basicDataForm.chargeSum!=''" prop="chargeAmountSumInput">
                                <el-input class="input-type-94 margin-left-5" v-model="basicDataForm.chargeAmountSumInput" :disabled="disabled" placeholder="请输入"></el-input>
                                <span class="margin-left-5">元</span>
                            </el-form-item>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="累计消费金额:">
                        <el-row class="flex-base">
                            <el-select v-model="basicDataForm.consumeAmountSum" :disabled="disabled" clearable>
                                <el-option label="不限" value></el-option>
                                <el-option label="大于" value="normalGreater"></el-option>
                                <el-option label="等于" value="normalEqual"></el-option>
                                <el-option label="小于" value="normalLess"></el-option>
                                <el-option label="小于等于" value="normalLessEqual"></el-option>
                                <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                <el-option label="不等于" value="normalNotEqual"></el-option>
                            </el-select>
                            <el-form-item v-if="basicDataForm.consumeSum!=''" prop="consumeAmountSumInput">
                                <el-input class="input-type-94 margin-left-5" v-model="basicDataForm.consumeAmountSumInput" :disabled="disabled" placeholder="请输入"></el-input>
                                <span class="margin-left-5">元</span>
                            </el-form-item>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="生日:">
                        <el-row class="flex-base">
                            <el-select v-model="basicDataForm.birthday" :disabled="disabled" clearable>
                                <el-option label="不限" value></el-option>
                                <el-option label="等于当日" value="EqualCurrentDay"></el-option>
                                <el-option label="等于当月" value="EqualCurrentMoney"></el-option>
                                <el-option label="交易当月前后N月" value="EqualCurrentMonthOffset"></el-option>
                            </el-select>
                            <el-form-item v-if="basicDataForm.birthday=='EqualCurrentMonthOffset'" prop="birthdayInput">
                                <el-input class="input-type-94 margin-left-5" v-model="basicDataForm.birthdayInput" :disabled="disabled" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="开卡年限:">
                        <el-row class="flex-base">
                            <el-select v-model="basicDataForm.openCardYears" :disabled="disabled" clearable>
                                <el-option label="不限" value></el-option>
                                <el-option label="大于" value="normalGreater"></el-option>
                                <el-option label="等于" value="normalEqual"></el-option>
                                <el-option label="小于" value="normalLess"></el-option>
                                <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                <el-option label="小于等于" value="normalLessEqual"></el-option>
                                <el-option label="不等于" value="normalNotEqual"></el-option>
                                <el-option label="包含区间" value="BetweenOperator"></el-option>
                                <el-option label="不包含区间" value="not_BetweenOperator"></el-option>
                            </el-select>
                            <el-form-item v-if="basicDataForm.openYears!=''">
                                <el-input class="input-type-94 margin-left-5" v-model="basicDataForm.openCardYearsInput" :disabled="disabled" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="开卡月限:">
                        <el-row class="flex-base">
                            <el-select v-model="basicDataForm.openCardMonths" :disabled="disabled" clearable>
                                <el-option label="不限" value></el-option>
                                <el-option label="大于" value="normalGreater"></el-option>
                                <el-option label="等于" value="normalEqual"></el-option>
                                <el-option label="小于" value="normalLess"></el-option>
                                <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                <el-option label="小于等于" value="normalLessEqual"></el-option>
                                <el-option label="不等于" value="normalNotEqual"></el-option>
                                <el-option label="包含区间" value="BetweenOperator"></el-option>
                                <el-option label="不包含区间" value="not_BetweenOperator"></el-option>
                            </el-select>
                            <el-form-item v-if="basicDataForm.openMonths!=''">
                                <el-input class="input-type-94 margin-left-5" v-model="basicDataForm.openCardMonthsInput" :disabled="disabled" placeholder="请输入"></el-input>
                            </el-form-item>
                        </el-row>
                    </el-form-item>
                </div>
                <el-form-item label="开卡日期:" v-if="basicDataForm.activityType!=29">
                    <el-select v-model="basicDataForm.openCardDate" :disabled="disabled">
                        <el-option label="不限" value></el-option>
                        <el-option label="大于" value="TimeGreaterOperator"></el-option>
                        <el-option label="等于" value="TimeEqualOperator"></el-option>
                        <el-option label="小于" value="TimeLessOperator"></el-option>
                        <el-option label="大于等于" value="TimeGreaterEqualOperator"></el-option>
                        <el-option label="小于等于" value="TimeLessEqualOperator"></el-option>
                        <el-option label="不等于" value="not_TimeEqualOperator"></el-option>
                        <el-option label="包含区间" value="DateRangeContainOperator"></el-option>
                        <el-option label="不包含区间" value="not_DateRangeContainOperator"></el-option>
                    </el-select>
                    <!-- <span v-if="basicDataForm.openDate!=''"><el-input style="width:20%; margin-right:6px;" v-model="openDateInput" :disabled="disabled" placeholder="请输入"></el-input></span> -->
                    <el-date-picker v-if="basicDataForm.openCardDate=='DateRangeContainOperator'||basicDataForm.openCardDate=='not_DateRangeContainOperator'" v-model="basicDataForm.openDateCardOption" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="disabled" @change="setOpenCardDate"></el-date-picker>
                    <el-date-picker v-if="basicDataForm.openCardDate!='DateRangeContainOperator'&&basicDataForm.openCardDate!='not_DateRangeContainOperator'&&basicDataForm.openCardDate!=''" v-model="basicDataForm.openCardDateInput" style="width: 200px;" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :disabled="disabled"></el-date-picker>
                </el-form-item>
            </el-collapse-item>
            <!-- 设置优惠方案 -->
            <el-collapse-item title="设置优惠方案" name="3">
                <el-form-item label="优惠设置:">
                    <span>赠送余额</span>
                    <el-input class="input-type-94" v-model="basicDataForm.discount" :disabled="disabled" placeholder="请输入"></el-input>
                </el-form-item>
            </el-collapse-item>
            <!-- 设置活动预算 -->
            <el-collapse-item title="设置活动预算" name="4">
                <el-form-item label="活动总预算:" prop="activityBudgetSum">
                    <el-select v-model="basicDataForm.activityBudgetSum" :disabled="disabled">
                        <el-option label="不限制" value></el-option>
                        <el-option label="指定预算限制" value="1"></el-option>
                    </el-select>
                    <div v-if="basicDataForm.activityBudgetSum==1">
                        <span>{{basicDataForm.activityType==27 ? '开卡总数量限制' : basicDataForm.activityType==28 ? '充值次数限制' : basicDataForm.activityType==29 ? '交易次数限制' : ''}}</span>
                        <el-input class="input-type-94" v-model="basicDataForm.activityBudgetSumInput" :disabled="disabled" placeholder="请输入"></el-input>
                        <span>{{basicDataForm.activityType==27 ? '张' : '次'}}</span>
                    </div>
                </el-form-item>
                <el-form-item label="单用户限制:" prop="singleUserLimit" v-if="basicDataForm.activityType!=27">
                    <el-select v-model="basicDataForm.singleUserLimit" :disabled="disabled">
                        <el-option label="不限制" value></el-option>
                        <el-option label="指定预算限制" value="1"></el-option>
                    </el-select>
                    <div v-if="basicDataForm.singleUserLimit==1">
                        <span>{{basicDataForm.activityType==28?'充值':'交易'}}次数限制</span>
                        <el-input class="input-type-94" v-model="basicDataForm.singleUserLimitInput" :disabled="disabled" placeholder="请输入"></el-input>
                        <span>次</span>
                    </div>
                </el-form-item>
            </el-collapse-item>
        </el-form>
    </el-collapse>
    <fixStepTool :stepData="stepData.stepList"></fixStepTool>
    <el-row class="flex-base flex-center bottom-control-group">
        <el-button type="primary" v-if="isEdit!='detail'" @click="dataFormSubmit(2)">提交执行</el-button>
        <el-button type="primary" v-if="isEdit!='detail'" @click="dataFormSubmit(1)">保存草稿</el-button>
        <el-button @click="returnList()">返回</el-button>
    </el-row>
    <!-- 弹窗组件都加这 -->
    <section class="alert-group">
        <!-- 选择支付 -->
        <payType @getData="handlePayTypeBack" ref="payType"></payType>
    </section>
</div>
</template>

<script>
import fixStepTool from "../../../components/fix-step-tool/fix-step-tool";
import fixStepMixin from "../../../mixins/marketing/fixStepTool.js";
import qs from "qs";

// 弹窗混入回调方法，注册弹窗和设置回调都在此处
import alertHandle from 'cmm/mixins/marketing/alertHandle.js';

export default {
    data() {
        return {
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
            basicDataRule: {
                activityType: [{
                    required: true,
                    message: "活动类型不能为空",
                    trigger: "change"
                }],
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
                dateOption: [{
                    required: true,
                    message: "活动有效期不能为空",
                    trigger: "blur"
                }],
                tradingMerchant: [{
                    required: true,
                    message: "交易商户不能为空",
                    trigger: "change"
                }],
                activityBudgetSum: [{
                    required: true,
                    message: "活动总预算不能为空",
                    trigger: "change"
                }],
                singleUserLimit: [{
                    required: true,
                    message: "单用户限制不能为空",
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

            //公共规则部分
            commonInfo: [],
            //活动条件
            ruleConditions: [],
            //优惠方案
            actions: [],
            //活动预算
            bizPropertyMap: [],

            // 活动基本信息
            basicDataForm: {
                tenantId: "1",
                activityCode: "",

                activityType: 27,
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
                    specifyTime: ['08:00:00', '08:00:00']
                }],

                tradingChannel: "", //交易渠道
                tradingChannelInput: "",

                // 设置活动条件
                tradingMerchant: "normalIn", //交易商户
                tradingMerchantId: "",
                tradingMerchantInput: "",

                membershipLevel: "AllMember", //会员等级
                membershipLevelId: "",
                membershipLevelInput: "",

                projectionEffect: "", //放映效果
                projectionEffectId: "",
                projectionEffectInput: "",

                studioType: "", //影厅类型
                studioTypeId: "",
                studioTypeInput: "",

                film: "", //影片
                filmId: "",
                filmInput: "",

                filmType: "", //影片类型
                filmTypeId: "",
                filmTypeInput: "",

                screeningValidity: "", //放映有效期
                screeningValidityInput: "",
                screeningStart: "",
                screeningEnd: "",
                screeningValidityOption: [],

                screeningPeriod: "",
                screeningPeriodOptions: [{
                    screeningPeriodOption: ""
                }], //放映时段范围
                screeningPeriodOption: "",

                issuePrice: "", //最低发行价
                issuePriceInput: "",

                tradeName: "", //商品名称
                tradeNameId: "",
                tradeNameInput: "",

                goodsSold: "", //卖品单价
                goodsSoldInput: "",

                payType: "", //支付方式
                payTypeId: "",
                payTypeInput: "",

                firstChargeAmount: "", //首充金额
                firstChargeAmountInput: "",

                chargeAmount: "", //单次充值金额
                chargeAmountInput: "",

                chargeAmountSum: "", //累计充值金额
                chargeAmountSumInput: "",

                consumeAmountSum: "", //累计消费金额
                consumeAmountSumInput: "",

                birthday: "",
                birthdayInput: "",

                openCardYears: "", //开卡年限
                openCardYearsInput: "",

                openCardMonths: "",
                openCardMonthsInput: "",

                openCardDate: "",
                openCardDateInput: "",
                openCardDateStart: "",
                openCardDateEnd: "",
                openDateCardOption: "",

                // 设置优惠方案
                discount: "",

                // 设置活动预算
                activityBudgetSum: "",
                activityBudgetSumInput: "",

                customerRegCardAmount: "", //总开卡数
                chargeNum: "", //充值次数
                tradeNum: "", //交易次数

                singleUserLimit: "",
                singleUserLimitInput: ""
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
    mixins: [fixStepMixin, alertHandle],
    components: {
        fixStepTool
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
        init(row, isEdit) {
            if (row) {
                this.activityId = row.id || 0;
                this.isEdit = isEdit;
                if (this.isEdit == "copy") {
                    this.activityId = "";
                }
                console.log(this.activityId);
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
                            // console.log("ruleGroup " + JSON.stringify(ruleGroup));

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
                                    this.basicDataForm.tradingChannel = item.opUniqueName ? item.opUniqueName : "";
                                    this.tradingChannelState = item.value.split(",");
                                    this.basicDataForm.tradingChannelInput = this.tradingChannelState.join(",");
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
                                        if (obj.workDay && obj.workDay.length > 0 && obj.workDay.length == 5) {
                                            obj.checkAllWorkDay = true;
                                            obj.isIndeterminateWithWorkDay = false;
                                        } else {
                                            obj.checkAllWorkDay = false;
                                            obj.isIndeterminateWithWorkDay = true;
                                        }
                                        obj.checkAllWeekend = false;
                                        if (obj.workend && obj.workend.length > 0 && obj.workend.length == 2) {
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
                                switch (item.key) {
                                    case "businessCode": //交易商户
                                        this.basicDataForm.tradingMerchant = item.opUniqueName;
                                        this.basicDataForm.tradingMerchantInput = item.text;
                                        this.basicDataForm.tradingMerchantId = item.value;
                                        break;
                                    case "cardTypeKey": //会员等级
                                        this.basicDataForm.membershipLevel = item.opUniqueName;
                                        this.basicDataForm.membershipLevelInput = item.text;
                                        this.basicDataForm.membershipLevelId = item.value;
                                        break;
                                    case "showEffect": // 放映效果
                                        this.basicDataForm.projectionEffect = item.opUniqueName;
                                        this.basicDataForm.projectionEffectInput = item.text;
                                        this.basicDataForm.projectionEffectId = item.value;
                                        break;
                                    case "hallTypeKey": //影厅类型
                                        this.basicDataForm.studioType = item.opUniqueName;
                                        this.basicDataForm.studioTypeInput = item.text;
                                        this.basicDataForm.studioTypeId = item.text;
                                        break;
                                    case "uniformCode": // 影片
                                        this.basicDataForm.film = item.opUniqueName;
                                        this.basicDataForm.filmInput = item.text;
                                        this.basicDataForm.filmId = item.value;
                                        break;
                                    case "filmTypeKey": //影片类型
                                        this.basicDataForm.filmType = item.opUniqueName;
                                        this.basicDataForm.filmTypeInput = item.text;
                                        this.basicDataForm.filmTypeId = item.value;
                                        break;
                                    case "planStartTime": //放映有效期
                                        this.basicDataForm.screeningValidity = item.opUniqueName;
                                        if (this.basicDataForm.screeningValidity == "TimeBetweenOperator") {
                                            this.basicDataForm.screeningValidityOption = JSON.parse(item.value);
                                        } else if (
                                            this.basicDataForm.screeningValidity == "DayContainOperator" ||
                                            this.basicDataForm.screeningValidity == "not_DayContainOperator") {
                                            this.basicDataForm.screeningValidityInput = item.value;
                                        }
                                        break;
                                    case "filmPlanTimeRange": //放映时段范围
                                        this.basicDataForm.screeningPeriod = item.opUniqueName;
                                        this.basicDataForm.screeningPeriodOptions =
                                            item.value != "" ? JSON.parse(item.value) : [];
                                        break;
                                    case "lowestPrice": //最低发行价
                                        this.basicDataForm.issuePrice = item.opUniqueName;
                                        this.basicDataForm.issuePriceInput = item.value;
                                        break;
                                    case "merKey": // 商品名称
                                        this.basicDataForm.tradeName = item.opUniqueName;
                                        this.basicDataForm.tradeNameInput = item.text;
                                        this.basicDataForm.tradeNameId = item.value;
                                        break;
                                    case "merPrice": // 卖品单价
                                        this.basicDataForm.goodsSold = item.opUniqueName;
                                        this.basicDataForm.goodsSoldInput = item.text;
                                        this.basicDataForm.goodsSoldId = item.value;
                                        break;
                                    case "payTypeCode": //支付方式
                                        this.basicDataForm.payType = item.opUniqueName;
                                        this.basicDataForm.payTypeInput = item.text;
                                        this.basicDataForm.payTypeId = item.value;
                                        break;
                                    case "openDate": //开卡日期
                                        this.basicDataForm.openCardDate = item.opUniqueName;
                                        this.basicDataForm.openCardDateInput = item.value;
                                        break;
                                    case "firstRecharge": // 首充金额
                                        this.basicDataForm.firstChargeAmount = item.opUniqueName;
                                        this.basicDataForm.firstChargeAmountInput = item.value;
                                        break;
                                    case "consumeWayCode": // 单次充值金额
                                        this.basicDataForm.chargeAmount = item.opUniqueName;
                                        this.basicDataForm.chargeAmountInput = item.value;
                                        break;
                                    case "chargeSum": // 累计充值金额
                                        this.basicDataForm.chargeAmountSum = item.opUniqueName;
                                        this.basicDataForm.chargeAmountSumInput = item.value;
                                        break;
                                    case "consumeWayCode": // 累计消费金额
                                        this.basicDataForm.consumeAmountSum = item.opUniqueName;
                                        this.basicDataForm.consumeAmountSumInput = item.value;
                                        break;
                                    case "birthday": //生日
                                        this.basicDataForm.birthday = item.opUniqueName;
                                        this.basicDataForm.birthdayInput = item.value;
                                        break;
                                    case "openYears": //开卡年限
                                        this.basicDataForm.openCardYears = item.opUniqueName;
                                        this.basicDataForm.openCardYearsInput = item.value;
                                        break;
                                    case "openMonths": //开卡月限
                                        this.basicDataForm.openCardMonths = item.opUniqueName;
                                        this.basicDataForm.openCardMonthsInput = item.value;
                                        break;
                                }
                            }

                            // 优惠方案
                            for (let item of actions) {
                                if (item.key == "presentMoney") {
                                    this.basicDataForm.discount = item.value;
                                }
                            }
                            // 活动预算
                            if (bizPropertyMap.customerRegCardAmount != '' || bizPropertyMap.runAmount != '') {
                                this.basicDataForm.activityBudgetSum = '1';
                            }
                            if (this.basicDataForm.activityType == 27) {
                                this.basicDataForm.activityBudgetSumInput = bizPropertyMap.customerRegCardAmount;
                            } else {
                                this.basicDataForm.activityBudgetSumInput = bizPropertyMap.runAmount;
                            }

                            if (bizPropertyMap.userTradeAmount != '') {
                                this.basicDataForm.singleUserLimit = 1;
                                this.basicDataForm.singleUserLimitInput = bizPropertyMap.userTradeAmount;
                            }

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
            if (this.basicDataForm.excludeDateOptions.length > 1) {
                this.basicDataForm.excludeDateOptions.splice(index, 1);
            }
        },

        /*时段范围- 全选工作日 */
        handleCheckAllWorkDayChange(item, val) {
            item.workDay = val ? this.workDayOptions.map(item => {
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
            item.weekend = val ? this.weekendOptions.map(item => {
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
        /** 添加时段范围 */
        addTimeRangeSelect() {
            this.basicDataForm.timeRangeSelect.push({
                isIndeterminateWithWorkDay: true,
                checkAllWorkDay: false,
                isIndeterminateWithWeekend: true,
                checkAllWeekend: false,
                weekend: [],
                workDay: [],
                specifyTime: ['08:00:00', '08:00:00'],
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

        /*添加放映时段范围 */
        addScreeningPeriod() {
            this.basicDataForm.screeningPeriodOptions.push({
                screeningPeriodOption: ""
            });
        },

        /*修改放映时段范围 */
        setScreeningPeriod(val) {
            this.basicDataForm.screeningPeriodOption = val;
        },

        /*删除放映时段范围 */
        delScreeningPeriod(index) {
            this.basicDataForm.screeningPeriodOptions.splice(index, 1);
        },
        //设置开卡日期
        setOpenCardDate(val) {
            if (val) {
                this.basicDataForm.openCardDateStart = val[0];
                this.basicDataForm.openCardDateEnd = val[1];
                this.basicDataForm.openCardDateOption = val;
                // this.$refs['basicDataForm'].clearValidate(['screeningValidityOption'])
            } else {
                this.basicDataForm.openCardDateStart = "";
                this.basicDataForm.openCardDateEnd = "";
                // this.$refs['basicDataForm'].clearValidate(['screeningValidityOption'])
            }
        },
        // 验证名称是否一致
        valActivityName() {
            // let flag = this.activityId?"0":"1"
            let params = qs.stringify({
                // "flag": flag,
                id: this.activityId,
                name: this.basicDataForm.activityName,
                tenantId: this.basicDataForm.tenantId
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
            if (this.basicDataForm.timeRange == "1" && this.basicDataForm.timeRangeSelect.length > 0) {
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

        /* 组装活动条件数据 */
        buildRuleConditionsData() {
            /* 活动条件 */
            // 交易商户
            if (this.basicDataForm.tradingMerchant != "") {
                this.ruleConditions.push({
                    category: "SaleInfo",
                    key: "businessCode",
                    groupId: 14,
                    value: 1, //this.basicDataForm.tradingMerchantId, //弹窗回传
                    text: this.basicDataForm.tradingMerchantInput, //弹窗回传
                    opUniqueName: this.basicDataForm.tradingMerchant //操作符,不填默认为 =
                });
            }
            // 会员等级
            if (this.basicDataForm.membershipLevel == "normalIn") {
                this.ruleConditions.push({
                    category: "MemberInfo",
                    key: "cardTypeKey",
                    groupId: 10,
                    value: this.basicDataForm.membershipLevelId,
                    text: this.basicDataForm.membershipLevelInput,
                    opUniqueName: this.basicDataForm.membershipLevel
                });
            }
            if (this.basicDataForm.activityType != 28) {
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
            }
            if (this.basicDataForm.activityType != 29) {
                //开卡日期
                if (this.basicDataForm.openCardDate != "") {
                    this.ruleConditions.push({
                        category: "MemberInfo",
                        key: "openDate",
                        groupId: 12,
                        value: this.basicDataForm.openCardDateInput,
                        text: "",
                        opUniqueName: this.basicDataForm.openCardDate
                    });
                }
            }
            if (this.basicDataForm.activityType == 27) {
                // 首充金额
                if (this.basicDataForm.firstChargeAmount != "") {
                    this.ruleConditions.push({
                        category: "MemberInfo",
                        key: "firstRecharge",
                        groupId: 98,
                        value: this.basicDataForm.firstChargeAmountInput,
                        text: "",
                        opUniqueName: this.basicDataForm.firstChargeAmount
                    });
                }
            }

            if (this.basicDataForm.activityType == 28) {
                // 单次充值金额
                if (this.basicDataForm.chargeAmount != "") {
                    this.ruleConditions.push({
                        category: "SaleInfo",
                        key: "consumeWayCode",
                        groupId: 1,
                        value: this.basicDataForm.chargeAmountInput,
                        text: "",
                        opUniqueName: this.basicDataForm.chargeAmount
                    });
                }
                // 累计充值金额
                if (this.basicDataForm.chargeAmountSum != "") {
                    this.ruleConditions.push({
                        category: "MemberInfo",
                        key: "chargeSum",
                        groupId: 5,
                        value: this.basicDataForm.chargeAmountSumInput,
                        text: "",
                        opUniqueName: this.basicDataForm.chargeAmountSum
                    });
                }
                // 累计消费金额
                if (this.basicDataForm.consumeAmountSum != "") {
                    this.ruleConditions.push({
                        category: "MemberInfo",
                        key: "consumeSum",
                        groupId: 6,
                        value: this.basicDataForm.consumeAmountSumInput,
                        text: "",
                        opUniqueName: this.basicDataForm.consumeAmountSum
                    });
                }
                // 生日
                if (this.basicDataForm.birthday != "") {
                    this.ruleConditions.push({
                        category: "MemberInfo",
                        key: "birthday",
                        groupId: 7,
                        value: this.basicDataForm.birthdayInput,
                        text: "",
                        opUniqueName: this.basicDataForm.birthday
                    });
                }
                // 开卡年限
                if (this.basicDataForm.openCardYears != "") {
                    this.ruleConditions.push({
                        category: "MemberInfo",
                        key: "openYears",
                        groupId: 11,
                        value: this.basicDataForm.openCardYearsInput,
                        text: "",
                        opUniqueName: this.basicDataForm.openCardYears
                    });
                }
                // 开卡月限
                if (this.basicDataForm.openCardMonths != "") {
                    this.ruleConditions.push({
                        category: "MemberInfo",
                        key: "openMonths",
                        groupId: 87,
                        value: this.basicDataForm.openCardMonthsInput,
                        text: "",
                        opUniqueName: this.basicDataForm.openCardMonths
                    });
                }
            }

            if (this.basicDataForm.activityType == 29) {
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
                        targetValue = this.basicDataForm.screeningValidityInput;
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
                    if (
                        this.basicDataForm.screeningPeriod == "TimeRangeContainOperator"
                    ) {
                        targetValue = this.basicDataForm.screeningPeriodOptions.map(
                            item => {
                                if (item.screeningPeriodOption) {
                                    return item.screeningPeriodOption;
                                }
                            }
                        );
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

                // 商品名称
                if (this.basicDataForm.tradeName != "") {
                    this.ruleConditions.push({
                        category: "MerchandiseInfo",
                        key: "merKey",
                        groupId: 46,
                        value: this.basicDataForm.tradeNameId,
                        text: this.basicDataForm.tradeNameInput,
                        opUniqueName: this.basicDataForm.tradeName
                    });
                }
                // 卖品单价
                if (this.basicDataForm.goodsSold != "") {
                    this.ruleConditions.push({
                        category: "MerchandiseInfo",
                        key: "merPrice",
                        groupId: 93,
                        value: this.basicDataForm.goodsSoldInput,
                        text: "",
                        opUniqueName: this.basicDataForm.goodsSold
                    });
                }
            }
        },

        /* 组装优惠设置数据 */
        buildActionsData() {
            /* 优惠设置 - 赠送余额 */

            //赠送余额
            if (this.basicDataForm.discount != "") {
                this.actions.push({
                    key: "presentMoney",
                    groupId: 2,
                    value: this.basicDataForm.discount,
                    text: "",
                    opUniqueName: "PresentMemberCardMoney"
                });
            }
        },

        /* 组装活动预算数据 */
        buildBizPropertyMap() {
            let customerRegCardAmount = "";
            let runAmount = "";
            let userTradeAmount = "";

            if (this.basicDataForm.activityBudgetSum == 1) {
                if (this.basicDataForm.activityType == 27) {
                    //总开卡
                    customerRegCardAmount = this.basicDataForm.activityBudgetSumInput;
                } else {
                    runAmount = this.basicDataForm.activityBudgetSumInput;
                }
            }
            if (this.basicDataForm.singleUserLimit == 1) {
                if (this.basicDataForm.activityType != 27) {
                    //单用户交易限制
                    userTradeAmount = this.basicDataForm.singleUserLimitInput;
                }
            }
            this.bizPropertyMap = {
                runAmount: runAmount, //执行次数
                userTradeAmount: userTradeAmount, //单用户交易限制
                customerRegCardAmount: customerRegCardAmount //总开卡数限制
            };
        },
        // 表单提交
        dataFormSubmit(flag) {
            this.valActivityName();
            this.$refs["basicDataForm"].validate(valid => {
                if (valid) {
                    /* 公共规则 */
                    this.buildCommonInfoData();

                    /* 活动条件 */
                    this.buildRuleConditionsData();

                    /* 优惠设置 */
                    this.buildActionsData();

                    /* 活动预算 */
                    this.buildBizPropertyMap();

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
                            // console.log(data)
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
            });
        }
    }
};
</script>
