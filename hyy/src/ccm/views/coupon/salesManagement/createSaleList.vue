<template>
<div class="coupon-create">
    <el-form :model="form" :label-width="'100px'" ref="form">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="票劵基本资料" name="baseInfo">
                <el-form-item label="票券名称：" 
                prop="baseInfo.name.value" 
                :rules="[{required:true,validator:checkName}]"
                >
                    <span v-if="model.type=='revise'" class="font-666">{{form.baseInfo.name.value}}</span>
                    <el-input v-else v-model="form.baseInfo.name.value" class="input-type-217"></el-input>
                </el-form-item>
                <el-form-item label="票券类型：" prop="baseInfo.couponType.value" >
                    <span v-if="model.type=='revise'&&form.baseInfo.couponType.value" class="font-666">{{FormcouponType()}}</span>
                    <ul class="tab-tilte" v-else>
                        <li v-for="(item,index) in form.baseInfo.couponType.options" @click="resetcouponTypeId(item.value)" :class="form.baseInfo.couponType.value==item.value?'active':''" :key="index">{{item.label}}</li>
                    </ul>
                </el-form-item>
                <el-form-item label="票券分类：" prop="baseInfo.couponTypeId.value" :rules="form.baseInfo.couponTypeId.rules">
                    <span v-if="model.type=='revise'&&form.baseInfo.couponTypeId.options.length" class="font-666">{{form.baseInfo.couponTypeName}}</span>
                    <el-select v-model="form.baseInfo.couponTypeId.value" placeholder="请选择" @change="changeTicketType" v-else>
                        <el-option v-for="item in form.baseInfo.couponTypeId.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item> 
                <el-form-item label="票券数量：" 
                prop="baseInfo.couponCount.value" 
                :rules="[{required:true,validator:checkCouponCount}]"
                >
                    <span v-if="model.type=='revise'" class="font-666">{{form.baseInfo.couponCount.value}}</span>
                    <div v-else>
                        <el-input v-model="form.baseInfo.couponCount.value" 
                        class="input-type-94"
                        @change="couponCountChange"
                        >
                        </el-input> <span class="tips-font">(不大于100,000)</span>
                    </div>
                </el-form-item>
                <el-form-item label="销售单价：" 
                prop="baseInfo.couponPrice.value" 
                :rules="[{required:true,validator:checkCouponPrice}]"
                >
                    <el-input v-model="form.baseInfo.couponPrice.value" class="input-type-94"></el-input> <span class="font-666">元</span> 
                </el-form-item>
                <el-form-item label="起售数量：">
                    <el-form-item
                    prop="baseInfo.startSaleNum.value" 
                    :rules="[{required:false,validator:checkStartSaleNum}]"
                    >
                        <el-input v-model="form.baseInfo.startSaleNum.value" class="input-type-94"></el-input>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="销售方式：" prop="baseInfo.salesMode.value">
                    <span v-if="model.type=='revise'" class="font-666">
                        {{formSalesModeName(form.baseInfo.salesMode.value)}}
                    </span>
                    <el-radio-group v-model="form.baseInfo.salesMode.value" @change="salesModeChange" v-else>
                        <el-radio v-for="item in form.baseInfo.salesMode.options" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="form.baseInfo.salesMode.value == '3' || form.baseInfo.salesMode.value == '4'">
                    <el-form-item label="客商名称：" prop="baseInfo.custId.value" :rules="form.baseInfo.custId.rules">
                        <span v-if="model.type=='revise'" class="font-666">{{form.baseInfo.custId.text}}</span>
                        <el-row v-else>
                            <el-input v-model="form.baseInfo.custId.text" 
                            class="input-type-124 popup-input"  :readonly=true>
                                <i slot="suffix" class="el-icon-close popup-close" @click="clearInputValue('custId','baseInfo','both')" v-show="form.baseInfo.custId.text"></i>
                            </el-input>
                            <el-button type="primary" plain @click="selectInputValue('custId','baseInfo')">选择</el-button>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="合同协议号：" prop="baseInfo.contractCode.value">
                        <span v-if="model.type=='revise'" class="font-666">{{form.baseInfo.contractCode.value}}</span>
                        <el-row class="flex-base" v-else>
                            <el-input v-model="form.baseInfo.contractCode.value" class="input-type-124"></el-input>
                            <el-upload class="upload" 
                            ref="attatchFile" 
                            :action="form.baseInfo.attatchFile.action" 
                            :on-preview="handlePreview" 
                            :on-remove="removeAttatchFile" 
                            :limit="form.baseInfo.attatchFile.limit" 
                            :file-list="form.baseInfo.attatchFile.list" 
                            :on-change="setAttatchFile" :auto-upload="false"
                            >
                                <el-button slot="trigger" size="small" type="primary">添加附件</el-button>
                            </el-upload>
                            <el-button type="text" v-if="form.baseInfo['attachFileName'] " @click="searchAttachFileName('attachFileName')">下载合同号</el-button>
                        </el-row>
                    </el-form-item>
                </template>
                <el-form-item label="入账影院：" prop="baseInfo.incomeCinemaId.value" :rules="form.baseInfo.incomeCinemaId.rules">
                    <span v-if="model.type=='revise'&& !model.isTransfer" class="font-666">{{form.baseInfo.incomeCinemaId.text}}</span>
                    <el-row v-else>
                        <el-input 
                        v-model="form.baseInfo.incomeCinemaId.text" 
                        class="input-type-124 popup-input"  
                        :readonly=true 
                        >
                        <i slot="suffix" class="el-icon-close popup-close" @click="clearInputValue('incomeCinemaId','baseInfo','both')" v-show="form.baseInfo.incomeCinemaId.text"></i>
                        </el-input>
                        <el-button type="primary" plain @click="selectInputValue('incomeCinemaId','baseInfo')">选择</el-button>
                    </el-row>
                </el-form-item>
                <el-form-item label="票券编号：" prop="baseInfo.couponGeneration.value">
                    <span v-if="model.type=='revise'" class="font-666">
                        {{form.baseInfo.couponGeneration.value==0?'系统生成':form.baseInfo.couponGeneration.value==1? '外部导入':'使用预生成编号'}}
                        <span v-if="form.baseInfo.couponGeneration.value==2&&form.baseInfo.batchTicketIds.value">(已添加{{form.baseInfo.batchTicketIds.value.split(',').length}}张预生成票券)</span>
                    </span>
                    <el-radio-group v-model="form.baseInfo.couponGeneration.value" @change="couponGeneration" v-else>
                        <el-radio v-for="item in form.baseInfo.couponGeneration.options" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                        <span v-if="form.baseInfo.couponGeneration.value==2&&form.baseInfo.batchTicketIds.value"  class="font-666">(已添加{{form.baseInfo.batchTicketIds.value.split(',').length}}张预生成票券)</span>
                </el-form-item>
                <el-form-item label="外部导入：" prop="baseInfo.importFileName.value" v-if="form.baseInfo.couponGeneration.value == '1'&& model.type != 'revise'">
                    <el-row class="flex-base">
                        <el-upload class="upload" ref="importFileName" 
                        :action="form.baseInfo.importFileName.action" 
                        :limit="form.baseInfo.importFileName.limit" 
                        :on-preview="handlePreview" 
                        :on-remove="removeImportFile" 
                        :file-list="form.baseInfo.importFileName.list" 
                        :on-change="setImportFile" :auto-upload="false"
                        >
                            <el-button slot="trigger" size="small" type="primary" plain>导入票券编号</el-button>
                        </el-upload>
                        <el-button type="primary" class="margin-left-10" plain @click="downloadTemplate">下载导入模板</el-button>
                    </el-row>
                </el-form-item>
                <el-form-item label="备注：" prop="baseInfo.remark.value">
                    <el-input type="textarea" class="input-type-360" :rows="2" placeholder="请输入内容" v-model="form.baseInfo.remark.value">
                    </el-input>
                </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="票券消费规则" name="commonInfo" >
                <el-form-item label="有效期：" prop="commonInfo.validType.value" :rules="{required: true, message: '请选择日期范围', trigger: 'change'}">
                    <el-radio-group v-model="form.commonInfo.validType.value" >
                        <el-radio v-for="item in form.commonInfo.validType.options" :key="item.value" :label="item.value" @change="validDateChange">{{item.label}}</el-radio>
                    </el-radio-group>
                        <div v-if="form.commonInfo.validType.value==0">
                        <el-form-item prop="commonInfo.validDate.value" :rules="form.commonInfo.validDate.rules">
                            <el-date-picker v-model="form.commonInfo.validDate.value" 
                            type="daterange" 
                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                            :picker-options="disabledDate"
                            >
                            </el-date-picker>
                        </el-form-item>
                        </div>
                        <div v-if="form.commonInfo.validType.value==1">
                        <el-form-item  prop="commonInfo.validGenType.value" :rules="form.commonInfo.validGenType.rules">
                            <el-select v-model="form.commonInfo.validGenType.value" placeholder="请选择">
                                <el-option v-for="item in form.commonInfo.validGenType.options" :key="item.value" :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                            <el-form-item  prop="commonInfo.validGenValue.value" 
                            :rules="[{required:true,validator:checkVliadDate}]"
                            v-if="form.commonInfo.validGenType.value==1"
                            style="display:inline-block"
                            >
                                <el-input placeholder="请输入正整数" 
                                v-model="form.commonInfo.validGenValue.value" 
                                class="input-type-124" 
                                ></el-input>
                            </el-form-item>
                        </el-form-item>                
                        </div>
                </el-form-item>
                <el-form-item label="排除日期：" prop="commonInfo.eliminationDate.value">
                    <el-checkbox-group v-model="form.commonInfo.eliminationDate.value">
                        <el-checkbox v-for="item in form.commonInfo.eliminationDate.options" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                    <template v-if="form.commonInfo.eliminationDate.value.includes('not_DateRangeContainOperator')">
                        <el-form-item style="padding-bottom:15px;" v-for="(item,index) in form.commonInfo.appointInvalidDate.value" :key="index" :prop="'commonInfo.appointInvalidDate.value.' + index + '.value'" :rules="{required: true, message: '请选择日期范围', trigger: 'blur'}">
                            <el-row class="flex-base">
                                <el-date-picker v-model="item.value" 
                                type="daterange" range-separator="至" 
                                start-placeholder="开始日期" end-placeholder="结束日期"
                                :picker-options="disabledDate"
                                >
                                </el-date-picker>
                                <el-button type="text" class="margin-left-10" @click="addOrRemove(index)">{{index == 0 ? '添加' : '删除'}}</el-button>
                            </el-row>
                        </el-form-item>
                    </template>
                </el-form-item>
                <el-form-item label="星期范围：" prop="commonInfo.ruleValidWeek.value">
                    <el-select v-model="form.commonInfo.ruleValidWeek.value" placeholder="请选择">
                        <el-option v-for="item in form.commonInfo.ruleValidWeek.options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <template v-if="form.commonInfo.ruleValidWeek.value == 'WeekDateRangeOperator'">
                        <el-form-item prop="commonInfo.week.value" :rules="form.commonInfo.week.rules">
                            <el-checkbox-group v-model="form.commonInfo.week.value">
                                <template v-for="(item,index) in form.commonInfo.week.options">
                                    <el-checkbox :key="item.label" :label="item.value" @change="handleSelectType($event,item)">{{item.label}}</el-checkbox>
                                    <br :key="index" v-if="item.br"/>
                                </template>
                            </el-checkbox-group>
                        </el-form-item>
                    </template>
                </el-form-item>
                <el-form-item label="时段范围：" prop="commonInfo.ruleValidTime.value">
                    <el-select class="margin-bottom-10" v-model="form.commonInfo.ruleValidTime.value" placeholder="请选择">
                        <el-option v-for="item in form.commonInfo.ruleValidTime.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <template v-if="form.commonInfo.ruleValidTime.value == 'TimeRangeContainOperator'">
                        <el-form-item style="padding-bottom:15px;" v-for="(item, index) in form.commonInfo.TimeRangeContainOperator.value" :key="index" :prop="'commonInfo.TimeRangeContainOperator.value.' + index + '.value'" :rules="{required: true, message: '请选择时段范围', trigger: 'blur'}">
                            <el-row class="flex-base">
                                <el-time-picker is-range v-model="item.value" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时段范围">
                                </el-time-picker>
                                <el-button type="text" class="margin-left-10" @click="addOrRemoveTimeRangeContainOperator(index)">{{index == 0 ? '添加' : '删除'}}</el-button>
                            </el-row>
                        </el-form-item>
                    </template>
                </el-form-item>
                <el-form-item label="影院范围：" prop="commonInfo.cinemaCode.value">
                    <el-row class="flex-base">
                        <el-select class="margin-right-10" v-model="form.commonInfo.cinemaCode.value" placeholder="请选择" @change="cinemaCodeChange">
                            <el-option v-for="item in form.commonInfo.cinemaCode.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <template v-if="form.commonInfo.cinemaCode.value != ''">
                            <el-form-item prop="commonInfo.cinemarangev.value" :rules="form.commonInfo.cinemarangev.rules">
                                <el-row class="flex-base">
                                    <el-input class="input-type-124 popup-input" 
                                    v-model="form.commonInfo.cinemarangev.text"  
                                    :readonly=true
                                    >
                                        <i slot="suffix" class="el-icon-close popup-close" @click="clearInputValue('cinemarangev','commonInfo','both')" v-show="form.commonInfo.cinemarangev.text"></i>
                                    </el-input>
                                    <el-button class="margin-left-10" type="primary" plain @click="selectInputValue('cinemarangev','commonInfo')">选择</el-button>
                                </el-row>
                            </el-form-item>
                        </template>
                    </el-row>
                </el-form-item>
                <el-form-item label="交易渠道：" prop="commonInfo.consumeWayCode.value">
                    <el-radio-group v-model="form.commonInfo.consumeWayCode.value">
                        <el-radio v-for="item in form.commonInfo.consumeWayCode.options" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                    <template v-if="form.commonInfo.consumeWayCode.value.includes('normalIn')">
                        <el-form-item prop="commonInfo.consumeWayCodeOp.text" :rules="form.commonInfo.consumeWayCodeOp.rules" style="display:inline-block;margin-left:10px;">
                            <el-row class="flex-base">
                                <el-input class="input-type-124 popup-input" 
                                v-model="form.commonInfo.consumeWayCodeOp.text"  
                                :readonly=true
                                >
                                    <i slot="suffix" class="el-icon-close popup-close" @click="clearInputValue('consumeWayCodeOp','commonInfo','both')" v-show="form.commonInfo.consumeWayCodeOp.text"></i>
                                </el-input>
                                <el-button class="margin-left-10" type="primary" plain @click="selectInputValue('consumeWayCodeOp','commonInfo')">选择</el-button>
                            </el-row>
                        </el-form-item>
                    </template>
                </el-form-item>
                <el-form-item label="会员等级：" prop="commonInfo.customerLevelType.value">
                    <el-row class="flex-base">
                        <el-select v-model="form.commonInfo.customerLevelType.value" placeholder="请选择">
                            <el-option v-for="item in form.commonInfo.customerLevelType.options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <template v-if="form.commonInfo.customerLevelType.value == 'normalIn' || form.commonInfo.customerLevelType.value == 'normalNotIn'">
                            <el-row class="flex-base margin-left-10">
                                <el-form-item prop="commonInfo.customerLevelCode.value" :rules="form.commonInfo.customerLevelCode.rules">
                                    <el-input class="input-type-124 popup-input"
                                    v-model="form.commonInfo.customerLevelCode.text"
                                    :readonly=true
                                    >
                                        <i slot="suffix" class="el-icon-close popup-close" @click="clearInputValue('customerLevelCode','commonInfo','both')" v-if="form.commonInfo.customerLevelCode.text"></i>
                                      </el-input>
                                    <el-button class="margin-left-10" type="primary" plain @click="selectInputValue('customerLevelCode','commonInfo')">选择</el-button>
                                </el-form-item>
                            </el-row>
                        </template>
                    </el-row>
                </el-form-item>
                <el-form-item label="会员卡政策：" prop="commonInfo.cardPolicyType.value">
                    <el-row class="flex-base">
                        <el-select v-model="form.commonInfo.cardPolicyType.value" placeholder="请选择">
                            <el-option v-for="item in form.commonInfo.cardPolicyType.options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <template v-if="form.commonInfo.cardPolicyType.value == 'normalIn' || form.commonInfo.cardPolicyType.value == 'normalNotIn'">
                            <el-row class="flex-base margin-left-10">
                                <el-form-item prop="commonInfo.cardPolicyCode.value" :rules="form.commonInfo.cardPolicyCode.rules">
                                    <el-input class="input-type-124 popup-input"
                                    v-model="form.commonInfo.cardPolicyCode.text"
                                    :readonly=true
                                    >
                                        <i slot="suffix" class="el-icon-close popup-close" @click="clearInputValue('cardPolicyCode','commonInfo','both')" v-if="form.commonInfo.cardPolicyCode.text"></i>
                                      </el-input>
                                    <el-button class="margin-left-10" type="primary" plain @click="selectInputValue('cardPolicyCode','commonInfo')">选择</el-button>
                                </el-form-item>
                            </el-row>
                        </template>
                    </el-row>
                </el-form-item>
                <el-form-item label="会员生日：" prop="commonInfo.MemberInfo.value">
                    <el-row class="flex-base">
                        <el-select class="margin-right-10" v-model="form.commonInfo.MemberInfo.value" placeholder="请选择">
                            <el-option v-for="item in form.commonInfo.MemberInfo.options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <template v-if="form.commonInfo.MemberInfo.value == 'EqualCurrentDayOffset'">
                            <el-form-item 
                            prop="commonInfo.memberBirthdayOffset.value" 
                            :rules="[{required:true,validator:checkMemberBirthdayOffset}]"
                            >
                                <el-input class="input-type-124" v-model="form.commonInfo.memberBirthdayOffset.value" placeholder="请输入"></el-input>
                            </el-form-item>
                        </template>
                    </el-row>
                </el-form-item>
            </el-collapse-item>
            <el-collapse-item v-if="ruleInfo.isShow" :title="ruleInfo.config.title" name="moneyInfo">
                <template v-if="ruleInfo.config.showType == '0' || ruleInfo.config.showType == '2'">
                    <ul class="flex-base rule-window">
                        <template v-for="(item,index) in showRule">
                            <li :key="item.name" class="rule-item flex-base">
                                <div class="rule-title flex-base">
                                    <span>{{item.name}}</span>
                                </div>
                                <div class="flex-base rule-content">
                                    <div class="rule-content-title">可{{form.baseInfo.couponType.value == '0' ? '兑换' : '优惠'}}商品:</div>
                                    <div class="rule-content-content flex-base">
                                        <ol>
                                            <template v-for="item in item.child">
                                                <li :key="item.name">{{item.name}}:{{item.text}}</li>
                                            </template>
                                        </ol>
                                    </div>
                                </div>
                                <div class="delete-btn" @click="deleteRule(index)">
                                    <i class="el-icon-close" style="font-size:16px;margin-rigth:5px"></i>
                                </div>
                                <div class="change-text" @click="editionRule('edit',index)">
                                    修改
                                </div>
                            </li>
                        </template>
                        <li class="addRule flex-base" @click="editionRule">
                            <i class="el-icon-plus"></i>
                        </li>
                    </ul>
                </template>
                <template v-if="ruleInfo.config.showType == '1'">
                    <el-form-item class="change-label inline-reset" label="代金券面值(抵用金额)：" 
                    prop="moneyInfo.voucherValue.value" 
                    :rules="[{required:true,validator:checkVoucherValue}]"
                    >
                        <el-input class="input-type-217" v-model="form.moneyInfo.voucherValue.value" ></el-input>
                    </el-form-item>
                    <el-form-item class="change-label inline-reset" label="代金券消费密码：" prop="moneyInfo.voucherIsPassword.value">
                        <el-row class="flex-base">
                            <el-checkbox v-model="form.moneyInfo.voucherIsPassword.value"><span v-if="!form.moneyInfo.voucherIsPassword.value" style="corlor:#606266">需要</span></el-checkbox>  
                            <el-form-item v-if="form.moneyInfo.voucherIsPassword.value" prop="moneyInfo.voucherPasswordType.value">
                                <el-radio-group v-model="form.moneyInfo.voucherPasswordType.value">
                                    <el-radio v-for="item in form.moneyInfo.voucherPasswordType.options" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item v-if="form.moneyInfo.voucherPasswordType.value == '2'&& form.moneyInfo.voucherIsPassword.value" 
                            prop="moneyInfo.voucherPassword.value" 
                            :rules="[{required:true,validator:checkVoucherPassword}]"
                            >
                                <el-input class="margin-left-15 input-type-166" v-model="form.moneyInfo.voucherPassword.value" placeholder="请输入6位密码" maxlength="6"></el-input>
                            </el-form-item>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="允许购买商品范围：" prop="moneyInfo.saleItemType.value" class="inline-reset">
                        <el-radio-group v-model="form.moneyInfo.saleItemType.value">
                            <el-radio v-for="item in form.moneyInfo.saleItemType.options" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="每笔消费金额不小于：" 
                    prop="moneyInfo.sumPrice.value" 
                    :rules="[{required:true,validator:checkSunPrice}]"
                    class="inline-reset"
                    >
                        <el-input class="input-type-94" v-model="form.moneyInfo.sumPrice.value"></el-input> <span class="font-666">元</span> 
                    </el-form-item>
                </template>
            </el-collapse-item>
        </el-collapse>
        <div class="fixed-bottom">
            <el-button type="primary" @click="saveOrSubmit('form',2)" v-if="btnShow()">提交审批</el-button>
            <el-button type="primary" @click="saveOrSubmit('form',1)" v-if="model.type !='revise'">保存</el-button>
            <el-button @click="cancle()">取消</el-button>
        </div>
    </el-form>
    <!-- 弹窗 -->
    <!-- 查看预生成编号 -->
    <find-start-num ref="findStarNum" 
    :couponCount="form.baseInfo.couponCount.value" 
    :incomeCinemaId="form.baseInfo.incomeCinemaId.value"
    @batchTicketIdsCallBack="batchTicketIdsCallBack"
    @batchTicketIdsCancel = "batchTicketIdsCancel"
     ></find-start-num>
    <!-- 交易渠道 -->
    <tradeChannelDialog 
    :title="tradeChannelDialog.title" 
    :dialogTableVisible.sync="tradeChannelDialog.tradeChannelDialogVisible" 
    ref="consumeWayCodeOp" 
    :channelNature="''" 
    @callBack="handleOtherTradeChannelCallBack" 
    ></tradeChannelDialog>
    <!-- 入账包含组织节点影院 -->
    <cinemaTreeDialog  ref="incomeCinemaId"  @cinemaCallBack="cinemaCallBack"></cinemaTreeDialog>
    <!-- 影院范围单选 -->
    <cinemaSingleDialog ref="cinemaSingle" @cinemaSingleCallBack="cinemaSingleCallBack"></cinemaSingleDialog>
    <!-- 影院范围 多选 -->
    <cinemaMultipDialog :title="cinemaMultipDialog.title" 
    :dialogTableVisible.sync="cinemaMultipDialog.cinemaDialogVisible" 
    ref="cinemarangev" 
    @callBack="handleRegisterCinemaCallBack"
    >
    </cinemaMultipDialog>
    <!-- 交易客商 -->
    <tradeMerchantSingleDialog ref="custId" 
    @tradeMerchantSingleCallBack="tradeMerchantSingleCallBack" 
    :customerType="form.baseInfo.salesMode.value"
    :customerId="form.baseInfo.custId.value"
    ></tradeMerchantSingleDialog>
    <!-- 会员卡政策 -->
    <crmCardPolicyDialog
        @crmCardPolicyDialogCallBack="cardPolicyDialogCallBack" 
        whereUse= "mainPageUnique" 
        :reviewData="reviewData" 
        :dialogVisible.sync="cardPolicyDialogVisible" 
        :unique="'id'" 
    />
    <!-- 会员等级 -->
    <crmMemberLevelDialog 
        @crmMemberLevelDialogCallBack="MemberLevelDialogCallBack" 
        :reviewData="reviewData" 
        :dialogVisible.sync="memberLevelDatadialogVisible" 
    />
</div>
</template>

<script>
import alertWindow from '../../../components/alertWindow/index.vue';
const saleListUtil = require('../../../util/saleList.js');
import alertHandle from 'ccm/mixins/marketing/alertHandle.js'
import config from 'frame_cpm/http/config.js';
import {getChannelList} from 'cmm/http/interface'
import minxins from 'frame_cpm/mixins/cacheMixin.js';

export default {
    
    components: {
        alertWindow,
    },
    mixins:[alertHandle,minxins.cacheMixin],
    data() {
        return {
            /* 缓存数据 */
            cacheField: ["activeNames","model","form","ruleInfo","ruleChild","showRule","limitName"],
            subComName:this.$route.query.pageName,
            baseUrl: config.baseURL,
            //返回有效日期
            disabledDate :{
                disabledDate(time){
                    let date = new Date();
                    let y = date.getFullYear()
                    let m = date.getMonth()+1
                    let d = date.getDate()
                    let dateString = `${y}-${m}-${d}`
                    return time.getTime() < new Date(dateString);
                }
            },
            /**
             * @param model - 模式
             * @param model.type - create 新建模式，change 修改模式 copy复制
             * @param model.applyCode - 销售申请单号，修改时使用
             * @param model.id - 销售单ID，修改时使用
             * @param model.isTransfer -当前是否为数据迁移
             */
            model: {
                type: 'create',
                applyCode: null,
                id: null,
                isTransfer:false,
            },
            /* 用于计时器缓存 */
            time: null,
            /* 活动栏 */
            activeNames: ['baseInfo', 'commonInfo', 'moneyInfo'],
            /* 表单内容 */
            form: {
                /* 基本资料 */
                baseInfo: {
                    // 票券名称
                    name: {
                        value: '',
                    },
                    // 票券类型
                    couponType: {
                        value: '0',
                        options: [{
                            label: '兑换券',
                            value: '0'
                        }, {
                            label: '代金券',
                            value: '1'
                        }, {
                            label: '优惠券',
                            value: '2'
                        }]
                    },
                    // 票券分类
                    couponTypeId: {
                        value: '',
                        text:'',
                        options: [],
                        rules: {
                            required: true,
                            message: '请选择票券分类',
                            trigger: 'blur'
                        }
                    },
                    // 票券数量
                    couponCount: {
                        value: '',
                    },
                    // 销售单价
                    couponPrice: {
                        value: ''
                    },
                    // 起售数量
                    startSaleNum: {
                        value: ''
                    },
                    // 销售方式
                    salesMode: {
                        value: 1,
                        options: [{
                            label: '影院零售',
                            value: 1
                        }, {
                            label: '营销活动',
                            value: 2
                        }, {
                            label: '大客户',
                            value: 3
                        }, {
                            label: '第三方合作',
                            value: 4
                        }]
                    },
                    // 客户Id名称 此项只在销售方式为'3','4'时出现，且必填
                    custId: {
                        value: '',
                        text: '',
                        rules: {
                            required: true,
                            message : '请选择客商名称',
                            trigger:'change'
                        }
                    },
                    // 合同协议号 此项只在销售方式为'3','4'时出现
                    contractCode: {
                        value: '',
                    },
                    // 添加附件
                    attatchFile: {
                        value: '',
                        action: 'https://jsonplaceholder.typicode.com/posts/',
                        list: [],
                        limit: 2
                    },
                    // 入账影院
                    incomeCinemaId: {
                        value: '',
                        text: '',
                        rules: {
                            required: true,
                            message: '请选择入账影院',
                            trigger: 'change'
                        }
                    },
                    // 票券编号
                    couponGeneration: {
                        value: '0',
                        options: [{
                            label: '系统生成',
                            value: '0'
                        }, {
                            label: '外部导入',
                            value: '1'
                        }, {
                            label: '使用预生成编号',
                            value: '2'
                        }]
                    },
                    // 导入票券编号
                    importFileName: {
                        value: '',
                        action: 'https://jsonplaceholder.typicode.com/posts/',
                        list: [],
                        limit: 2
                    },
                    // 预生成编号ID
                    batchTicketIds: {
                        value: ''
                    },
                    // 备注
                    remark: {
                        value: ''
                    }
                },
                /* 票券消费规则 */
                commonInfo: {
                    // 有效期 需要拆分成 validDateStart 和 validDateEnd
                    validDate: {
                        value: [],
                        rules: {
                            required: true,
                            message: '请选择有效期范围',
                            trigger:'change'
                        }
                    },
                    validType:{
                        value: 0,
                        options: [{
                            label: '默认模式',
                            value: 0
                        }, {
                            label: '动态模式',
                            value: 1
                        }]
                    },
                    validGenType:{
                        value:'',
                        options:[
                                {
                                label:'1个月',
                                value:'2-1'
                            }, {
                                label:'2个月',
                                value:'2-2'
                            }, {
                                label:'3个月',
                                value:'2-3'
                            }, {
                                label:'4个月',
                                value:'2-4'
                            }, {
                                label:'5个月',
                                value:'2-5'
                            }, {
                                label:'6个月',
                                value:'2-6'
                            }, {
                                label:'7个月',
                                value:'2-7'
                            }, {
                                label:'8个月',
                                value:'2-8'
                            }, {
                                label:'9个月',
                                value:'2-9'
                            }, {
                                label:'10个月',
                                value:'2-10'
                            }, {
                                label:'11个月',
                                value:'2-11'
                            }, {
                                label:'1年',
                                value:'3-1'
                            }, {
                                label:'2年',
                                value:'3-2'
                            }, {
                                label:'3年',
                                value:'3-3'
                            },{
                                label:'按日计算',
                                value:'1'
                            }
                        ],
                        rules: {
                            required:true,
                            message:'请输入日期'
                        }
                    },
                    validGenValue:{
                        value:'',
                        rules: {
                            required: true,
                            message: '请输入有效值'
                        }
                    },
                    // 节假日排除 指定排除日期范围
                    eliminationDate: {
                        value: [],
                        options: [{
                            label: '节假日除外',
                            value: 'not_HolidayOperator'
                        }, {
                            label: '指定排除日期范围',
                            value: 'not_DateRangeContainOperator'
                        }]
                    },
                    // 指定排除日期范围
                    appointInvalidDate: {
                        value: [{
                            value: ''
                        }]
                    },
                    // 星期范围
                    ruleValidWeek: {
                        value: '',
                        options: [{
                            label: '每天',
                            value: ''
                        }, {
                            label: '周一至周五',
                            value: 'WeekDateOperator'
                        }, {
                            label: '指定范围',
                            value: 'WeekDateRangeOperator'
                        }]
                    },
                    // 指定范围
                    week: {
                        value: [],
                        options: [{
                            label: '工作日',
                            value: 'workday',
                            check: false,
                            index: 0,
                            isIndeterminate: true,
                            list: ['1', '2', '3', '4', '5']
                        }, {
                            label: '星期一',
                            value: '1'
                        }, {
                            label: '星期二',
                            value: '2'
                        }, {
                            label: '星期三',
                            value: '3'
                        }, {
                            label: '星期四',
                            value: '4'
                        }, {
                            label: '星期五',
                            value: '5',
                            br: true
                        }, {
                            label: '周末',
                            value: 'holiday',
                            check: false,
                            index: 6,
                            isIndeterminate: true,
                            list: ['6', '7']
                        }, {
                            label: '星期六',
                            value: '6'
                        }, {
                            label: '星期天',
                            value: '7'
                        }],
                        rules: {
                            required: true,
                            message: '请选择指定范围'
                        }
                    },
                    // 时段范围
                    ruleValidTime: {
                        value: '',
                        options: [{
                            label: '全天有效',
                            value: ''
                        }, {
                            label: '上午（09:00—12:59）',
                            value: 'MorningOperator'
                        }, {
                            label: '下午（13:00—16:59）',
                            value: 'AfternoonOperator'
                        }, {
                            label: '晚上（17:00—02:00）',
                            value: 'NightOperator'
                        }, {
                            label: '指定时段',
                            value: 'TimeRangeContainOperator'
                        }]
                    },
                    // 指定时段
                    TimeRangeContainOperator: {
                        value: [{
                            value: ''
                        }]
                    },
                    // 影院范围
                    cinemaCode: {
                        value: '',
                        options: [{
                            label: '不限',
                            value: ''
                        }, {
                            label: '等于',
                            value: 'normalEqual'
                        }, {
                            label: '包含',
                            value: 'normalIn'
                        }]
                    },
                    // 指定 等于
                    cinemarangev: {
                        value: '',
                        text: '',
                        rules: {
                            required: true,
                            message: '请选择影院范围'
                        }
                    },
                    // 交易渠道
                    consumeWayCode: {
                        value: '',
                        options: [{
                            label: '不限',
                            value: ''
                        }, {
                            label: '指定指定渠道',
                            value: 'normalIn'
                        }]
                    },
                    // 指定消费渠道 value
                    consumeWayCodeOp: {
                        value: '',
                        text:'',
                        rules: {
                            required: true,
                            message: '请选择消费渠道',
                        }
                    },
                    // 会员等级 type
                    customerLevelType: {
                        value: '',
                        options: [{
                            label: '不限',
                            value: ''
                        }, {
                            label: '包含',
                            value: 'normalIn'
                        }, {
                            label: '不包含',
                            value: 'normalNotIn'
                        }, {
                            label: '非会员',
                            value: 'not_memberOperator'
                        }]
                    },
                    // 会员等级 value
                    customerLevelCode: {
                        text: '',
                        value: '',
                        rules: {
                            required: true,
                            message: '请选择会员卡等级',
                            trigger:'change'
                        }
                    },
                    // 会员卡政策 op
                    cardPolicyType: {
                        value: '',
                        options: [{
                            label: '不限',
                            value: ''
                        }, {
                            label: '包含',
                            value: 'normalIn'
                        }, {
                            label: '不包含',
                            value: 'normalNotIn'
                        }, {
                            label: '全部卡政策',
                            value: 'AllMember'
                        }]
                    },
                    // 会员卡政策
                    cardPolicyCode: {
                        text: '',
                        value: '',
                        rules: {
                            required: true,
                            message: '请选择会员卡政策',
                            trigger:'change'
                        }
                    },
                    // 会员生日
                    MemberInfo: {
                        value: '',
                        options: [{
                            label: '不限',
                            value: ''
                        }, {
                            label: '生日当天',
                            value: 'EqualCurrentDay'
                        }, {
                            label: '生日当月',
                            value: 'EqualCurrentMoney'
                        }, {
                            label: '生日前后N日',
                            value: 'EqualCurrentDayOffset'
                        }]
                    },
                    // 生日前后N天
                    memberBirthdayOffset: {
                        value: '',
                    }
                },
                /* 代金规则 */
                moneyInfo: {
                    // 代金券面值(抵用金额)
                    voucherValue: {
                        value: ''
                    },
                    // 代金券消费密码
                    voucherIsPassword: {
                        value: false
                    },
                    // 是否需要代金券消费密码
                    voucherPasswordType: {
                        value: '1',
                        options: [{
                            label: '随机密码（一票一码）',
                            value: '1'
                        }, {
                            label: '统一密码',
                            value: '2'
                        }]
                    },
                    // 消费密码
                    voucherPassword: {
                        value: '',
                    },
                    // 允许购买商品范围
                    saleItemType: {
                        value: '',
                        options: [{
                            label: ' 不限',
                            value: ''
                        }, {
                            label: '电影票',
                            value: '0'
                        }, {
                            label: '卖品',
                            value: '1'
                        }]
                    },
                    // 每笔消费金额不小于
                    sumPrice: {
                        value: ''
                    }
                }
            },
            /* 兑换规则 */
            ruleInfo: {
                config: {
                    title: '',
                    router: '',
                    showType: ''
                },
                isShow: false
            },
            
            ruleChild: [],
            showRule: [],
            limitName: []
        }
    },
    created() {
        /**
         * @params isEdit 修订、修改、复制都有此属性
         * @params type -reviese修定 -copy复制 -change修改
         */
        let isEdit = this.$route.query.isEdit ? this.$route.query.isEdit : false;
        if (isEdit) {
            let type = 'revise'; 
            let isCopy = this.$route.query.isCopy ? this.$route.query.isCopy : false;
            if (isCopy) {
                type = 'copy';
            }else if (this.$route.query.ischange){
                type = 'change';
            }
            this.model.type = type;
            let  url = window.location.search;
            console.log('获取id',this.model)
            console.log(`${this.model.applyCode} != ${this.$route.query.applyCode}`)
            if( this.model.applyCode != this.$route.query.applyCode ){   //如果被缓存下来的 applyCode跟query的applyCode相等 则不用重新请求
                this.editiSaleList(this.$route.query.applyCode);
            }
            return ;
        }
        // 是否需要从缓存中拿取之前的操作
        let isGetForm = this.$route.query.isGetForm ? this.$route.query.isGetForm : false;
        if (isGetForm) {
            // 从vuex上获取数据从vuex上获取数据
            let params = JSON.parse(JSON.stringify(this.$store.getters['saleList/getForm']));
            console.log('是否需要从缓存中拿取之前的操作',params)
            let keyArray = Object.keys(params);
            keyArray.forEach((item, index) => {
                this[`${item}`] = JSON.parse(JSON.stringify(params[`${item}`]));
            });
            // 清空缓存
            this.$store.commit('saleList/deleteForm');
        }
        // 是否需要获取rule
        let isGetRule = this.$route.query.isGetRule ? this.$route.query.isGetRule : false;
        if (isGetRule) {
            // 从vuex上获取数据
            let params = JSON.parse(JSON.stringify(this.$store.getters['saleList/getChildRule']));
            let editIndex = this.$route.query.editIndex;
            if (editIndex != null) {
                this.ruleChild.splice(editIndex, 1, JSON.parse(JSON.stringify(params.ruleChild)));
            } else {
                this.ruleChild.push(JSON.parse(JSON.stringify(params.ruleChild)));
            }
            // 清空缓存
            this.$store.commit('saleList/deleteChildRule');
        }
        // 展示ruleChild
        this.showRuleData(this.ruleChild);
        // 查询当前票券分类类型
        this.getcouponTypeId(this.form.baseInfo.couponType.value);

    },
    methods: {
        //修改、修订 数值状态转换
        FormcouponType() {
            if( this.model.type == 'revise' ) {
                let item  = this.form.baseInfo.couponType.options.filter(item => {
                    return item.value == this.form.baseInfo.couponType.value
                })
                return item[0].label
            }
        },
        //起始数量不能超过销售数量
        couponCountChange(){
            this.$refs['form'].validateField("baseInfo.startSaleNum.value")
        },
        //有效日期单独校验
        validDateChange() {
            this.$refs['form'].validateField("commonInfo.validDate.value")
            this.$refs['form'].validateField("commonInfo.validGenType.value")
            this.$refs['form'].validateField("commonInfo.validGenValue.value")
        },
        formSalesModeName(type) {
            let text = ''
            switch(type) {
                case 1 : text = '影院零售'
                break;
                case 2 : text = '营销活动'
                break;
                case 3 : text = '大客户'
                break;
                case 4 : text = '第三方合作'
                break;
                default : text = '未知'
            }
            return text 
        },
        /**
         *  1. couponGeneration=1 外部导入没有提交审批按钮 
            2.外部导入&&修订可以提交审批 
         */
        btnShow() {
            if(this.model.type=='revise'){
                return true
            }else{
                return (this.form.baseInfo.couponGeneration.value == 1? false:true)
            }
        },
        

        /**
         * @function editiSaleList - 编辑销售单
         * 
         * @param {String} applyCode - 销售申请单号
         */
        /**
         * 规则匹配 方法
         */
        checkName(rules, value, callback) {
            let reg =  /^[a-zA-Z\u4E00-\u9FA5]{0,}$/;
            if (!value) {
                return callback(new Error('请输入票券名称'));
            }else if(value.length>25){
                return callback(new Error('票券名称不能超过25位字符'));
            }
            let param = {
                couponName: value
            }
            let pointer = this;
            if (pointer.model.type !== 'copy') {
                param[`id`] = pointer.model.id;
            }
            // 校验唯一性 debunch
            if (pointer.time) clearTimeout(pointer.time);

            pointer.time = setTimeout(() => {
                pointer.$ccmList.saleListCheckName(param).then(data => {
                    if (data.flag == 1) {
                        callback();
                    } else {
                        callback(new Error(`${data.msg}`));
                    }
                    clearTimeout(pointer.time);
                }).catch(msg => {
                    callback(`查询票券名重复错误：${msg}`);
                    clearTimeout(pointer.time);
                })
            }, 1000);
        },
        checkCouponCount(rule, value, callback) {
            if(!value) {
                return callback(new Error('请输入票券数量'));
            }
            let regExp = /^[1-9]\d*$/;
            if (!regExp.test(value)) {
                return callback(new TypeError('请输入正整数'));
            }else if(value == 0){
                return callback(new TypeError('请输入正整数'));
            }
            if (value > 0 && value < 100000) {
                return callback();
            } else {
                return callback(new Error('请输入100000以内的数字'));
            }
        },               
        checkStartSaleNum(rules, value, callback) {
            if(!value){
                callback();
            }else{
                let regExp = /^[1-9]\d*$/;
                if (!regExp.test(value)) {
                    return callback(new TypeError('请输入正整数'));
                }else if(value == 0){
                    return callback(new TypeError('请输入正整数'));
                }
                let couponCount = this.form.baseInfo.couponCount.value;
                if (Number(value)> Number(couponCount) ) {
                    return callback(new Error('起售数量不能超过票券数量'))
                }
                callback();
            }  
        },
        checkVliadDate(rules, value, callback) {
            if(!value) {
                return callback(new Error('请输入有效日期'));
            }
            let regExp = /^[1-9]\d*$/;
            if (!regExp.test(value)) {
                return callback(new TypeError('请输入正整数'));
            }else if(value == 0){
                return callback(new TypeError('请输入正整数'));
            }
            if (value > 0 && value < 100000) {
                return callback();
            } else {
                return callback(new Error('请输入100000以内的数字'));
            }
        },
        checkCouponPrice(rules, value, callback) {
            if (!value) {
                return callback(new Error('请输入销售单价'));
            }
            const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            if (!reg.test(value)) {
                return callback(new TypeError('请输入正数,且允许两位小数'));
            }

            callback();
        },
        checkSunPrice(rules, value, callback) {
            if (!value) {
                return callback(new Error('请输入消费金额'));
            }

            const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

            if (!reg.test(value)) {
                return callback(new TypeError('请输入正数,且只允许输入两位小数位'));
            }else if(value>9999.99){
                return callback(new TypeError('金额不大于9999.99'));
            }

            callback();
        },
        checkMemberBirthdayOffset(rules, value, callback){
            if (!value) {
                return callback(new Error('生日前后N天为必填字段'));
            }
            let regExp = /^[1-9]\d*$/;
            if (!regExp.test(value)) {
                return callback(new TypeError('请输入正整数'));
            }else if(value == 0){
                return callback(new TypeError('请输入正整数'));
            }
            return callback();
        },
        checkVoucherValue(rules, value, callback) {
            if (!value) {
                return callback(new Error('请输入代金券面值（抵用金额）'));
            }

            const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

            if (!reg.test(value)) {
                return callback(new TypeError('请输入正数,且只允许输入两位小数位'));
            }else if(value == 0){
                return callback(new TypeError('请输入正数,且只允许输入两位小数位'));
            }else if(value>9999.99){
                return callback(new TypeError('金额不大于9999.99'));
            }

            callback();
        },
        checkVoucherPassword(rules, value, callback) {
            if (!value) {
                return callback(new Error('请输入消费密码'));
            }

            const reg = /^\d{6}$/;

            if (!reg.test(value)) {
                return callback(new TypeError('请输入6位数字密码'));
            }

            callback();
        },
        /**
         *   编辑 
         */
        editiSaleList(applyCode) {
            let param = {
                applyCode
            }
            this.$ccmList.checkSaleList(param).then((data) => {
                if (data.flag == 1) {
                    saleListUtil.unPackageForm(data.data, this);
                    //查看票券分类
                    this.getcouponTypeId(this.form.baseInfo.couponType.value);
                }
            }).catch((msg) => {
                console.log('编辑销售申请单错误：', msg);
            });
        },
        /**
         * @function selectInputValue - 选择，调起弹窗
         * @param {String} formName -  表单名
         */
        selectInputValue(inputName,formName) {
            //会员卡政策
            let value = this.form[`${formName}`][`${inputName}`].value 
            let text = this.form[`${formName}`][`${inputName}`].text 
            console.log(`弹窗名：${inputName},弹窗的value:${value}，弹窗的text:${text}`)
            let reviewList = []

            switch (inputName) {
                case 'cardPolicyCode': //会员卡政策
                    if(value && text){
                        value.split(',').map((item) => { reviewList.push({ id: item, cardName: ""}) });
                        text.split(',').map((item, index) => { reviewList[index].cardName = item });
                    }
                    this.reviewData = reviewList
                    this.cardPolicyDialogVisible = true
                    break;
                case 'customerLevelCode': //会员等级
                    if ( value && text) {
                        value.split(',').map((item) => { reviewList.push({ levelNo: item, levelName: "", reviewFlag: "review" }) });
                        text.split(',').map((item, index) => { reviewList[index].levelName = item });
                    }
                    this.reviewData = reviewList
                    this.memberLevelDatadialogVisible = true
                    break;
                case 'consumeWayCodeOp':  //交易渠道
                    if (value && text) {
                        value.split(',').map((item) => { reviewList.push({ code: item, name: "", reviewFlag: "review" }) });
                        text.split(',').map((item, index) => { reviewList[index].name = item });
                    }
                    this.$refs[inputName].openDialog(true,reviewList)
                    break;
                case 'cinemarangev':  //影院范围
                    let addition = this.form.commonInfo.cinemaCode.value
                    if(addition == 'normalEqual'){      //等于 影院范围单选
                        console.log('单选',addition)
                        this.$refs.cinemaSingle.openDialog(true,value)
                        return
                    }else if(addition == 'normalIn'){   //包含 影院范围多选
                        console.log('多选',addition)
                        if (value && text) {
                            value.split(',').map((item) => { reviewList.push({ code: item, name: "", reviewFlag: "review" }) });
                            text.split(',').map((item, index) => { reviewList[index].name = item });
                        }
                        this.$refs[inputName].openDialog(true,reviewList)
                        return
                    }
                default:
                    this.$refs[inputName].openDialog(true,value) //单选的弹窗
                    break;
            }
        },
        /**
         *  @cinemaCodeChange -影院范围change事件
         */
        cinemaCodeChange(){
            this.form.commonInfo.cinemarangev.value = ''
            this.form.commonInfo.cinemarangev.text = ''
        },
        salesModeChange() {
            this.form.baseInfo.custId.text = ""
            this.form.baseInfo.custId.value = ""
        },
        /**
         * @function clearInputValue - 清空输入框
         * @param {String} inputName - 需要清空的输入框名
         * @param {String} formName -  表单名
         * @param {String} [type='both'] 可选值传入既清空 text 和 value 否在只清空 value
         */
        clearInputValue(inputName, formName, type) {
            if (type == 'both') {
                this.form[`${formName}`][`${inputName}`].text = '';
            }
            this.form[`${formName}`][`${inputName}`].value = '';
            console.log(this.form[`${formName}`][`${inputName}`])
        },
        /**
         * @function changeInput - 修改输入框的值
         */
        changeInput(callFnName, param) {
            let formName = callFnName.split('_')[0];
            let keyName = callFnName.split('_')[1];

            if (keyName == 'couponGeneration') {
                if (param.isCancle) {
                    this.form.baseInfo.couponGeneration.value = '0';
                    this.form.baseInfo.batchTicketIds.value = '';
                } else {
                    // 使用预生成编号生成方式时，选择的票券id
                    this.form[`${formName}`].batchTicketIds.value = param.data;
                }
            } else {
                // text 为展示给用户的信息
                this.form[`${formName}`][`${keyName}`].text = param.data;
                // value 为传递给后端的数据
                this.form[`${formName}`][`${keyName}`].value = param.data;
            }
        },
        /**
         * @function handlePreview - 点击文件列表中已上传的文件时的钩子
         */
        handlePreview() {},
        /**
         * @function downloadTemplate - 下载导入模板
         */
        downloadTemplate() {
            let url = this.baseUrl + "/coupon/prebuild/exportTemplate";
            let headers={}
            if(this.$store.state.CpmUserKey){
                headers['Cpm-User-Token'] = this.$store.state.CpmUserKey;
            }
            if (sessionStorage.getItem('token')) {
                headers['Cpm-User-Token'] = sessionStorage.getItem('token');
            }
            axios(url, {
                headers,
                method: "get",
                responseType: "blob"
            }).then(data => {
                console.log(data)
                let flag = data.headers.flag;
                let message = '下载模板错误，请稍后再试！';
                let type = 'warning';

                if (flag == '1') {
                    type = 'success';
                    message = "下载成功"
                }

                    this.$message({
                        type,
                        message
                    });

                const blob = new Blob([data.data]);
                const fileName = data.headers.filename;
                const elink = document.createElement('a');
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);
            });
        },
        /**
         * @function addOrRemove - 添加或移除指定排除日期
         */
        addOrRemove(index) {
            if (index != 0) {
                let appointInvalidDate = JSON.parse(JSON.stringify(this.form.commonInfo.appointInvalidDate.value));
                appointInvalidDate.splice(index, 1);
                this.form.commonInfo.appointInvalidDate.value = appointInvalidDate;
            } else {
                this.form.commonInfo.appointInvalidDate.value.push({
                    value: ''
                });
            }
        },
        /**
         * @function handleSelectType - 选中对应项 星期范围
         */
        handleSelectType(check, param) {
            let isIndeterminate = param.isIndeterminate;

            if (!isIndeterminate) {
                return;
            }
            let isCheck = check;
            let weekArray = JSON.parse(JSON.stringify(this.form.commonInfo.week.value));
            let currentList = param.list;
            if (isCheck) {
                // 校验是否已经存在
                for (let i = 0; i < currentList.length; i++) {
                    let currentItem = currentList[i];
                    if (!weekArray.includes(currentItem)) {
                        weekArray.push(currentItem);
                    }
                }
            } else {
                for (let i = 0; i < currentList.length; i++) {
                    let currentItem = currentList[i];
                    for (let j = 0; j < weekArray.length; j++) {
                        if (weekArray[j] == currentItem) {
                            weekArray.splice(j, 1);
                        }
                    }
                }
            }
            this.form.commonInfo.week.value = weekArray;
        },
        /**
         * @function addOrRemoveTimeRangeContainOperator - 添加或移除指定时段
         */
        addOrRemoveTimeRangeContainOperator(index) {
            if (index != 0) {
                let timeArr = JSON.parse(JSON.stringify(this.form.commonInfo.TimeRangeContainOperator.value));
                timeArr.splice(index, 1);
                this.form.commonInfo.TimeRangeContainOperator.value = timeArr;
            } else {
                this.form.commonInfo.TimeRangeContainOperator.value.push({
                    value: ''
                });
            }
        },
        /**
         * @function resetcouponTypeId - 重置票券分类选择
         * @param  {String} couponType - '0':兑换券;'1':代金券;'2':优惠券;
         * @param  1.只有当兑换、优惠规则、代金券有值的时候才弹窗提示框切换类型
         */
        resetcouponTypeId(couponType) {
            if(this.showRule.length || this.moneyInfoHaveValue()){
                this.$confirm('更换票券类型将重置规则', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.form.baseInfo.couponType.value = couponType;
                    this.form.baseInfo.couponTypeId.value = '';
                    this.ruleInfo.isShow = false;
                    //票券分类查询接口
                    this.getcouponTypeId(couponType);
                    //清空规则数据
                    this.resetRules() 
                })
            }else{
                this.form.baseInfo.couponType.value = couponType;
                this.form.baseInfo.couponTypeId.value = '';
                this.ruleInfo.isShow = false;
                //票券分类查询接口
                this.getcouponTypeId(couponType);
            }
        },
        /**
         * resetRules  - 重置规则
         */
        resetRules() {
            this.ruleChild =  []
            this.showRule =  []
            this.limitName =  []

            let moneyInfo = this.form.moneyInfo
            /**
             * @params voucherValue -代金券面值(抵用金额)
             * @params voucherIsPassword -代金券消费密码
             * @params voucherPasswordType -是否需要代金券消费密码
             * @params voucherPassword -消费密码
             * @params saleItemType -允许购买商品范围
             * @params sumPrice -每笔消费金额不小于
             * 
             */
            moneyInfo.voucherValue.value = ''
            moneyInfo.voucherIsPassword.value = ''
            moneyInfo.voucherPasswordType.value = ''
            moneyInfo.voucherPassword.value = ''
            moneyInfo.saleItemType.value = ''
            moneyInfo.sumPrice.value = ''
 
        },
        /**
         * @pfunction money -
         */
        moneyInfoHaveValue() {
            let moneyInfo = this.form.moneyInfo
            let moneyArr = ['voucherValue','voucherIsPassword','voucherPassword','saleItemType','sumPrice']
            let bool = moneyArr.some(key => moneyInfo[key].value )
            return bool
        },
        /**
         * @function getcouponTypeId - 票券分类查询接口
         */
        getcouponTypeId(couponType) {
            let params = {
                couponName: '',
                couponType,
                couponTypeStatus: 0,
                pageNo: 1,
                pageSize: 1000
            };
            this.$ccmList.findCouponList(params).then(data => {
                if (data.flag == 1) {
                    let couponDataArr = data.data;
                    let couponArr = [];
                    couponDataArr.forEach(item => {
                        let label = item.couponName,
                            value = item.id.toString();
                        couponArr.push({
                            label,
                            value
                        });
                    });
                    this.form.baseInfo.couponTypeId.options = couponArr;
                } else {
                    this.$message({
                        type: 'warning',
                        message: `查询票券分类错误：${msg}`
                    });
                }
            }).catch(msg => {
                console.log(`查询票券分类错误：${msg}`);
            });
        },
        /**
         * @function couponGeneration - 票券编号方式
         * @descrition 当选择预生成编号生成方式时，唤起弹窗，选择的票券id
         */
        couponGeneration(val) {
            if (val == '2') {
                if(!this.form.baseInfo.incomeCinemaId.value){
                    this.$message({
                        type:'warning',
                        message:'请先选择影院！'
                    })
                    return
                }
                //  else if (!this.form.baseInfo.couponCount.value){
                //      this.$message({
                //         type:'warning',
                //         message:'请先输入票券数量！'
                //     })
                //     return
                // }
                this.$refs['form'].validateField("baseInfo.couponCount.value",err=>{
                    if(err){
                            this.$message({
                            type:'warning',
                            message:'请先输入票券数量！'
                        })
                    }else{
                        this.$refs.findStarNum.openDialog()
                    }
                })

            }
        },
        /**
         * @function changeTicketType - 根据票券类型,是否选择修改跳转路由
         */
        changeTicketType() {
            let type = this.form.baseInfo.couponType.value;
            let title = '';
            let showType;
            let router;
            switch (type) {
                case '0':
                    title = '兑换';
                    showType = '0';
                    router = 'createExchange';
                    break;
                case '1':
                    title = '代金';
                    showType = '1';
                    router = '';
                    break;
                case '2':
                    title = '优惠';
                    showType = '2';
                    router = 'createFavourable';
                    break;
                default:
                    break;
            }
            let config = {
                title: title + '规则',
                showType,
                router,
            }
            console.log(this.ruleInfo)
            this.ruleInfo.config = config;
            this.ruleInfo.isShow = true;
        },
        /**
         * @function saveForm - 缓存表格
         */
        saveForm() {
            // 缓存填写信息
            this.$store.commit('saleList/updateForm', {   
                model: this.model,
                form: this.form,
                ruleInfo: this.ruleInfo,
                ruleChild: this.ruleChild
            });
        },
        /**
         * @function editionRule - 添加或编辑子项规则
         */
        editionRule(type, index) {
            let _type = this.form.baseInfo.couponType.value == '0' ? 'exchange' : 'favourable';

            this.saveForm();

            if (type == 'edit') {
                this.$store.commit('saleList/updateChildRule', {
                    ruleChild: this.ruleChild[index]
                });
            }

            this.$router.push({
                path: 'setRuleItem',
                query: {
                    type: _type,
                    familyIdBaseNum: (new Date()).getTime(),
                    isEdition: type == 'edit' ? true : false,
                    editIndex: type == 'edit' ? index : null,
                    limitName: this.limitName,
                    pageName:this.$route.query.pageName,
                    applyCode:this.model.applyCode
                }
            })
        },
        /**
         * @function deleteRule - 删除子规则
         */
        deleteRule(index) {
            this.ruleChild.splice(index, 1);
            this.showRuleData(this.ruleChild);
        },
        /**
         * @function removeAttatchFile - 移除合同协议号附件文件
         */
        removeAttatchFile(file, fileList) {
            this.$refs[`attatchFile`].abort();
            this.form.baseInfo[`attatchFile`].value = '';
            this.form.baseInfo[`attatchFile`].list = [];
        },
        /**
         * @function -查看合同文件
         */
        searchAttachFileName(type) {
            let url = this.baseUrl + this.form.baseInfo[`${type}`];
            let headers = {
                 "Cpm-User-Token": localStorage.getItem("token")
            }
            axios(url, {
                headers,
                method: "post",
                responseType: "blob"
            }).then(data => {
                console.log(data)
                let flag = data.headers.flag;
                let message = '下载文件错误，请稍后再试！';
                let type = 'warning';

                if (flag == '1') {
                    type = 'success';
                    message = "下载成功"
                }

                    this.$message({
                        type,
                        message
                    });
                const blob = new Blob([data.data]);
                const fileName = data.headers.filename;
                const elink = document.createElement('a');
                elink.download = fileName;
                elink.style.display = 'none';
                elink.href = URL.createObjectURL(blob);
                document.body.appendChild(elink);
                elink.click();
                URL.revokeObjectURL(elink.href); // 释放URL 对象
                document.body.removeChild(elink);
            });
        },
        /**
         * @function removeImportFile - 移除外部导入文件
         */
        removeImportFile(file, fileList) {
            this.$refs[`importFileName`].abort();
            this.form.baseInfo[`importFileName`].value = '';
            this.form.baseInfo[`importFileName`].list = [];
        },
        /**
         * @function setAttatchFile - 设置合同协议附件
         */
        setAttatchFile(file, fileList) {
            this.form.baseInfo.attatchFile.list = []
            this.fileReader('attatchFile', file, this);
        },
        /**
         * @function setImportFile - 设置外部导入票券文件
         */
        setImportFile(file, fileList) {
            this.form.baseInfo.importFileName.list=[]
            fileList = []
            // console.log('form.baseInfo.importFileName.list',this.form.baseInfo.importFileName.list)
            // console.log('fileList',fileList)
            // console.log(file)
            let fileName = file.name.substring(file.name.lastIndexOf('.')+1)
            if(fileName =='xls' || fileName =='xlsx'){
                this.fileReader('importFileName', file, this);
            }else{
                this.$message({
                    type:"warning",
                    message:'请选择xls或者xlsx文件'
                })
            }
        },
        /**
         * @function fileReader - 文件转化，分发
         */
        fileReader(type, file, pointer) {
            let _file = file.raw;
            // 10M
            let limitSize = 10485760;
            if (_file.size > limitSize) {
                pointer.$refs[`${type}`].clearFiles();

                pointer.$message({
                    type: 'warning',
                    message: '您上传的内容已超过10M',
                    showClose: true
                });

                return;
            }

            let fileReader = new FileReader();

            pointer.form.baseInfo[`${type}`].list.push({
                name: file.name,
                url: file.url
            });
            console.log(`pointer.form.baseInfo[${type}].list`,pointer.form.baseInfo[`${type}`].list)
            fileReader.readAsDataURL(_file);

            fileReader.onload = () => {
                pointer.form.baseInfo[`${type}`].value = `${file.name}(_file_)${fileReader.result}`;
            };

        },
        /**
         * @function saveOrSubmit - 保存/提交审批
         * 
         * @param {Number} flag - 1：保存；2：保存并提交审批
         */
        async saveOrSubmit(formName, flag) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if (this.form.baseInfo.couponType.value != '1' && this.ruleChild.length == 0) {
                        return this.$message({
                            message: '请添加规则项',
                            type: 'warning'
                        });
                    };
                    let param = this.packageParam(this.form, flag);
                    this.$ccmList.saleListSaveOrUpdate(param).then(data => {
                        let type = '';
                        if (data.flag == 1) {
                            type = 'success';
                        } else {
                            type = 'warning';
                        }
    
                        this.$message({
                            type,
                            message: data.msg
                        });

                        if (type == 'success') {
                            this.activeNames = null
                            this.model = null
                            this.form = null
                            this.ruleInfo = null
                            this.ruleChild = null
                            this.showRule = null
                            this.limitName = null
                            this.$store.commit("tagNav/removeTagNav", {
                                name: this.$route.name,
                                path: this.$route.path,
                                title: this.$route.meta.title,
                                query: this.$route.query
                            })

                            this.$router.push({
                                path: 'salesManagement'
                            });
                        }

                    }).catch(msg => {
                        console.log(`${this.model.type == 'change' ? '更新' : '新建'}票券销售申请单错误：${msg}`);
                    });

                }
            });
        },
        /**
         * @function cancle - 取消
         */
        cancle() {
            this.$confirm('确定不提交就退出？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.activeNames = null
                    this.model = null
                    this.form = null
                    this.ruleInfo = null
                    this.ruleChild = null
                    this.showRule = null
                    this.limitName = null

                    this.$store.commit("tagNav/removeTagNav", {
                        name: this.$route.name,
                        path: this.$route.path,
                        title: this.$route.meta.title,
                        query: this.$route.query
                    })
                    this.$router.push({
                        path: 'salesManagement'
                    });
                })
        },
        /**
         * @function packageParam - 组装数据
         * 
         * @param {Object} form 需要组装的表单 
         * @param {Number} flag - 1：保存；2：保存并提交审批
         * 
         * @returns {Object} param 请求参数 
         */
        packageParam(form, flag) {
            // 基本资料
            let baseInfo = form.baseInfo;
            // 票券消费规则
            let commonInfo = form.commonInfo;
            // 代金规则 票券类型为 (代金券:1) 存在
            let moneyInfo = form.moneyInfo;

            let param = {
                flag
            };

            // 修改的时候需要传
            let modelType = this.model.type;
            if (modelType == 'revise'|| modelType == 'change') {
                param[`applyCode`] = JSON.parse(JSON.stringify(this.model.applyCode));
                param[`id`] = this.model.id;
            }

            let keyArr_baseInfo = ['couponType', 'couponTypeId', 'couponCount', 'couponPrice', 'startSaleNum', 'salesMode', 'incomeCinemaId', 'couponGeneration'];
            keyArr_baseInfo.forEach((item, index) => {
                let value = baseInfo[`${item}`].value;
                param[`${item}`] = value;
                if( item =='incomeCinemaId'){
                    param[`incomeCinemaName`] = baseInfo[`${item}`].text
                }

                // 销售模式
                if (item == 'salesMode' && (value == '3' || value == '4')) {
                    // 客户id
                    param[`custId`] = baseInfo[`custId`].value;
                    param[`custName`] = baseInfo[`custId`].text;
                    // 合同协议号
                    let contractCodeVal = baseInfo[`contractCode`].value;
                    if (contractCodeVal) {
                        param[`contractCode`] = contractCodeVal;
                    }
                    // 添加附件
                    let attatchFileVal = baseInfo[`attatchFile`].value;
                    if (attatchFileVal) {
                        param[`attachFileName`] = attatchFileVal;
                    }
                }
                // 票券编号
                if (item == 'couponGeneration') {
                    let importFileVal = baseInfo[`importFileName`].value;
                    let batchTicketIdsVal = baseInfo[`batchTicketIds`].value;
                    // 合同协议附件
                    if (value == '1' && importFileVal) {
                        param[`importFileName`] = importFileVal;
                    } else if (value == '2') {
                        param[`batchTicketIds`] = batchTicketIdsVal;
                    }
                }
            })
            
            // 组装commonInfo
            let param_commonInfo = this.packageCommonInfo(commonInfo, this);

            // 规则组
            let simpleRuleGroupStr = {
                ruleType: 'CouponSale',
                name: baseInfo[`name`].value,
                remark: baseInfo[`remark`].value,
                // validDateStart: this.timeRule(commonInfo[`validDate`].value[0]),
                // validDateEnd: this.timeRule(commonInfo[`validDate`].value[1]),
                commonInfo: param_commonInfo,
                rules: []
            }
            console.log('-------------',commonInfo.validType.value)
            //0是默认模式  1是动态模式
            param.validType = commonInfo.validType.value 
            if(commonInfo.validType.value==0){
                simpleRuleGroupStr.validDateStart = this.timeRule(commonInfo[`validDate`].value[0])
                simpleRuleGroupStr.validDateEnd = this.timeRule(commonInfo[`validDate`].value[1])
            }else if (commonInfo.validType.value==1){
                console.log('-------动态值------',commonInfo.validGenType.value)
                let data = commonInfo.validGenType.value.split('-') 
                //validGenType 1日 2月 3年
                param.validGenType = data[0]

                if(data[0]==1 && commonInfo.validGenValue.value){  //按日计算
                    param.validGenValue = commonInfo.validGenValue.value
                }else{
                    param.validGenValue = data[1]   //按月、年

                }
            }
            // 代金券
            if (baseInfo[`couponType`].value == '1') {
                // 代金券面值（抵用金额）
                console.log('抵用金额---------',moneyInfo[`voucherValue`].value)
                param[`voucherValue`] = moneyInfo[`voucherValue`].value;

                // 代金券是否需要密码，1-不需要，2-需要
                let isPassword = moneyInfo[`voucherIsPassword`].value;
                let passwordVal = 1;
                if (isPassword) {
                    passwordVal = 2;
                }
                param[`voucherIsPassword`] = passwordVal;

                // 代金券消费密码类型，1-随机，2-统一密码
                let passwordTypeVal = moneyInfo[`voucherPasswordType`].value;
                param[`voucherPasswordType`] = passwordTypeVal;
                if (passwordTypeVal == '2') {
                    param[`voucherPassword`] = moneyInfo[`voucherPassword`].value;
                }

                let voucherRulesObj = {
                    ruleConditions: [],
                    actions: []
                }
                // ruleConditions
                // 允许购买商品范围
                let saleItemTypeVal = moneyInfo[`saleItemType`].value;
                if (saleItemTypeVal) {
                    let obj = {
                        key: 'saleItemType',
                        category: 'SaleItemInfo',
                        opUniqueName: 'normalEqual',
                        value: saleItemTypeVal
                    }
                    voucherRulesObj.ruleConditions.push(obj);
                }

                // 每笔消费金额不小于
                voucherRulesObj.ruleConditions.push({
                    key: 'sumPrice',
                    category: 'SaleInfo',
                    opUniqueName: 'normalGreaterEqual',
                    value: moneyInfo[`sumPrice`].value
                });

                // actions
                // 抵用金额
                voucherRulesObj.actions.push({
                    key: 'cashValue',
                    value: moneyInfo[`voucherValue`].value,
                    familyId: '1',
                    opUniqueName: 'CashCouponMoneyFunction'
                });

                simpleRuleGroupStr.rules.push(voucherRulesObj);

            } else {
                simpleRuleGroupStr.rules = this.ruleChild;
            }
            console.log("simpleRuleGroupStr",simpleRuleGroupStr)
            param[`simpleRuleGroupStr`] = JSON.stringify(simpleRuleGroupStr);

            return param;

        },
        /**
         * @function packageCommonInfo - 组装commonInfo
         * 
         * @param  {Object} form.commonInfo 票券消费规则
         * @param {Object} pointer - this指针
         * @returns {Array} commonInfo
         */
        packageCommonInfo(param, pointer) {

            let commonInfo = [];

            // 节假日排除与否
            if (param[`eliminationDate`].value.includes('not_HolidayOperator')) {
                let obj = {
                    key: 'holiday',
                    category: 'CommonInfo',
                    opUniqueName: 'not_HolidayOperator'
                }
                commonInfo.push(obj);
            }

            // 指定排除日期范围
            if (param[`eliminationDate`].value.includes('not_DateRangeContainOperator')) {
                let obj = {
                    key: 'appointInvalidDate',
                    category: 'CommonInfo',
                    opUniqueName: 'not_DateRangeContainOperator'
                }

                let timeArr = param[`appointInvalidDate`].value;

                let _timeArr = [];
                for (let i = 0; i < timeArr.length; i++) {
                    let item = timeArr[i].value;
                    _timeArr.push([pointer.timeRule(item[0]), pointer.timeRule(item[1])]);
                }
                obj['value'] = JSON.stringify(_timeArr);
                commonInfo.push(obj);
            }

            // 星期范围
            let ruleValidWeekVal = param[`ruleValidWeek`].value;
            if (ruleValidWeekVal) {
                let obj = {
                    key: 'validWeek',
                    category: 'CommonInfo',
                    opUniqueName: ruleValidWeekVal
                }
                // 指定范围
                if (ruleValidWeekVal == 'WeekDateRangeOperator') {
                    let weekArr = param[`week`].value;
                    let weekStr = '';
                    for (let i = 0; i < weekArr.length; i++) {
                        let item = weekArr[i];
                        if (item != 'workday' && item != 'holiday') {
                            weekStr += i == weekArr.length - 1 ? item : `${item},`
                        }
                    }
                    obj[`value`] = weekStr;
                }
                commonInfo.push(obj);
            }

            // 时段范围
            let ruleValidTimeVal = param[`ruleValidTime`].value;
            if (ruleValidTimeVal) {
                let obj = {
                    key: 'validTime',
                    category: 'CommonInfo',
                    opUniqueName: ruleValidTimeVal
                }
                // 指定时段
                if (ruleValidTimeVal == 'TimeRangeContainOperator') {
                    let timeArr = param[`TimeRangeContainOperator`].value;
                    let _timeArr = [];

                    for (let i = 0; i < timeArr.length; i++) {
                        let item = timeArr[i].value;

                        _timeArr.push([pointer.timeRule(item[0], 'hours'), pointer.timeRule(item[1], 'hours')]);
                    }
                    obj[`value`] = JSON.stringify(_timeArr);
                }
                commonInfo.push(obj);
            }

            // 影院范围
            let cinemaCodeVal = param[`cinemaCode`].value;
            if (cinemaCodeVal) {
                let obj = {
                    key: 'cinemaCode',
                    category: 'SaleInfo',
                    opUniqueName: cinemaCodeVal,
                    value: param[`cinemarangev`].value,
                    text: param[`cinemarangev`].text
                }
                commonInfo.push(obj);
            }

            // 消费渠道
            let consumeWayCodeVal = param[`consumeWayCode`].value;
            if (consumeWayCodeVal) {
                let obj = {
                    key: 'consumeWayCode',
                    category: 'SaleInfo',
                    opUniqueName: consumeWayCodeVal
                };
                // 指定消费渠道
                if (consumeWayCodeVal == 'normalIn') {
                    obj[`value`] = pointer.form.commonInfo.consumeWayCodeOp.value
                    obj['text'] = pointer.form.commonInfo.consumeWayCodeOp.text
                }
                commonInfo.push(obj);
            }
             // 会员等级
            let customerLevelVal= param[`customerLevelType`].value;
            if (customerLevelVal) {
                let obj = {
                    key: 'customerLevelCode',
                    category: 'SaleInfo',
                    opUniqueName: customerLevelVal
                }
                // 指定会员等级
                if (customerLevelVal == 'normalIn' || customerLevelVal == 'normalNotIn') {
                    obj[`value`] = param[`customerLevelCode`].value;
                    obj[`text`] = param[`customerLevelCode`].text;
                }
                commonInfo.push(obj);
            }
            // 会员卡政策
            let consumerTypeVal = param[`cardPolicyType`].value;
            if (consumerTypeVal) {
                let obj = {
                    key: 'cardRightCode',
                    category: 'SaleInfo',
                    opUniqueName: consumerTypeVal
                }
                // 指定会员卡政策
                if (consumerTypeVal == 'normalIn' || consumerTypeVal == 'normalNotIn') {
                    obj[`value`] = param[`cardPolicyCode`].value;
                    obj[`text`] = param[`cardPolicyCode`].text;
                }
                commonInfo.push(obj);
            }

            // 会员生日
            let MemberInfoVal = param[`MemberInfo`].value;
            if (MemberInfoVal) {
                let obj = {
                    key: 'birthday',
                    category: 'MemberInfo',
                    opUniqueName: MemberInfoVal
                }
                // 生日前后N日
                if (MemberInfoVal == 'EqualCurrentDayOffset') {
                    obj[`value`] = param[`memberBirthdayOffset`].value;
                }
                commonInfo.push(obj);
            }

            return commonInfo;
        },
        /**
         * @function timeRule - 格式化时间 用于后台传参
         * 
         * @param {String} time - 时间
         * @param {String} [type] - 格式化类型 00:00 可不传，格式化为年月日
         */
        timeRule(time, type) {
            try {
                let _time = new Date(time);

                let _year = _time.getFullYear(),
                    _mounth = _time.getMonth() + 1,
                    _day = _time.getDate(),
                    _hours = _time.getHours(),
                    _minutes = _time.getMinutes();

                let returnStr = `${_year}-${_mounth}-${_day}`;

                if (type == 'hours') {
                    returnStr = `${_hours}:${_minutes}`;
                }

                return returnStr;

            } catch (msg) {
                console.log(new TypeError('转换时间类型错误：', msg));
            }
        },
        /**
         * @function showRule - 展示ruleChild
         */
        showRuleData(ruleChild) {
            let showRule = [];
            // 用于限制同一规则组里面出现命名重复
            let limitName = [];
            console.log('规则-------',ruleChild)
            for (let i = 0; i < ruleChild.length; i++) {
                let _obj = {};
                let item = ruleChild[i];
                console.log('item---------------',item)
                let containSaleItemType = item.bizPropertyMap.containSaleItemType;
                // let _actions = item.actions;
                // let _ruleCondition = item.ruleConditions

                _obj[`name`] = item.name;
                limitName.push(item.name);
                let _arr = [];

                if (containSaleItemType.indexOf('0') != -1) {
                    _arr.push({
                        name: '影票',
                        text: '不限'
                    })
                }
                if (containSaleItemType.indexOf('1') != -1) {
                    _arr.push({
                        name: '卖品',
                        text: '不限'
                    })
                };
                _obj[`child`] = _arr;
                showRule.push(_obj);
            }
            // console.log('规则数组后：',showRule)
            this.showRule = showRule;
            this.limitName = limitName;
        },
    },
}
</script>

<style lang="scss" scoped>
@import '../../../assets/css/element-reset.scss' ;
.font-666{
    color:#666;
    font-size: 12px;
}

@mixin font-base {
    font {
        font-family: 'MicrosoftYaHei';
        size: 12px;
    }

    color: #333333;
    letter-spacing: 0;
    text-align: left;
    line-height: 15px;
}

@each $i in 5,
10,
15,
20 {
    .margin-left-#{$i} {
        margin-left: #{$i}px;
    }

    .margin-right-#{$i} {
        margin-right: #{$i}px;
    }

    .margin-top-#{$i} {
        margin-top: #{$i}px;
    }

    .margin-bottom-#{$i} {
        margin-bottom: #{$i}px;
    }
}
.tips-font {
    font-size: 12px;
    color: grey;
}

.upload {
    margin-left: 5px;
    display: flex;
}

.rule-window {
    $margin15: 15px;

    &>li {
        margin-left: $margin15;
        margin-bottom: $margin15;
    }
}

.rule-item {
    $ruleWidth: 160px;
    width: 200px;
    height: 90px;
    background: #F2F4FD;
    border: 1px solid #3B74FF;
    border-radius: 4px;
    align-content: center;
    justify-content: center;
    position: relative;

    .rule-title {
        @include font-base;
        width: $ruleWidth;
        font-weight: bold;
        margin-bottom: 8px;
    }

    .rule-content {
        width: $ruleWidth;
        height: 40px;
        justify-content: flex-start;
        align-items: flex-start;

        .rule-content-title {
            @include font-base;
            margin-right: 8px;
        }

        .rule-content-content {
            @include font-base;
        }
    }

    $margin: 6px;

    .delete-btn {
        $wh: 14px;
        position: absolute;
        right: $margin;
        top: $margin;
        width: $wh;
        height: $wh;
        cursor: pointer;

        i {
            display: inherit;
        }

        &:hover {
            color: #3B74FF;
        }
    }

    .change-text {
        cursor: pointer;
        position: absolute;
        right: $margin;
        bottom: $margin;
        @include font-base;

        &:hover {
            color: #3B74FF;
        }
    }
}

.addRule {
    $width: 90px;
    width: $width;
    height: $width;
    background: #FFFFFF;
    border: 1px dashed #BCBCBC;
    border-radius: 4px;
    justify-content: center;
    cursor: pointer;

    &:hover {
        border: 1px dashed #3B74FF;

        i {
            color: #3B74FF;
        }
    }
}
.change-label .el-form-item__label {
    line-height: 20px;
}
.fixed-bottom{
    position: fixed;
    bottom: 10px;
    left: 146px;
    right: 10px;
    background: #FFF;
    text-align: center;
    /deep/ .el-button{
        width:80px;
        height:32px;
        padding: 8px 0;
    }
}
/deep/ span{
    font-size: 12px;
}
//日期
/deep/ .el-date-editor{
  width: 230px;
  .el-input__icon,.el-range-separator,.el-input__icon .el-range__close-icon{
    vertical-align: top;
    line-height: 25px;
  }
  .el-range-input{
      font-size: 12px;
  }
  .el-range-separator{
    width: 22px;
    font-size:12px;
  }
}
/deep/ .inline-reset .el-form-item__label{
    line-height: 20px
}
//自定义票券分类css
.tab-tilte{
    width: 217px;
    height:32px;
    display: flex;
    border-radius: 4px;
    border-right: none;

}
.tab-tilte li:nth-child(1){
    border-radius:  4px 0  0 4px ;
    border-right: none
}
.tab-tilte li:nth-child(3){
    border-radius: 0 4px 4px 0 ;
    border-left: none
}
.tab-tilte li{
    flex:1;
    line-height: 32px;
    text-align: center;
    background-color:#fff;
    border: #DCDFE6 1px solid;
    color:#666;
    cursor: pointer;
    animation: all 10s;
    &:hover{
        color:#3B74FF
    }
}
/* 点击对应的标题添加对应的背景颜色 */
.tab-tilte .active{
    background-color: #3B74FF;
    color: #fff;
    border:#3B74FF 1px solid;
    &:hover{
        color: #fff
    }
}
.tab-content div{
    float: left;
    width: 25%;
    line-height: 100px;
    text-align: center;
}
</style>
<style lang="scss">
.coupon-create{
    .el-collapse-item__header::after{
        display: none
    }
    .el-collapse-item__header{
        display: flex;
        justify-content:flex-end;
        flex-direction: row-reverse;
    }
    .el-radio-group{
        .el-radio-button__inner{
            padding:9px 17.5px;
            font-size: 12px;
        }
    }
    span{
        font-size: 12px;
    }

}
</style>
