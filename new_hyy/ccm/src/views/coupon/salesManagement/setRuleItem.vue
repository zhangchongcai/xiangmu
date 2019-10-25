<template>
<div class="coupon-setRuleItem">
    <el-collapse v-model="activeNames">
        <el-form :model="ruleChild" ref="ruleChild" label-width="120px">
            <el-collapse-item title="规则基本信息" name="ruleInfo">
                <el-form-item label="规则名称：" prop="name" :rules="baseConfig.rules.name">
                    <el-input class="input-type-166" v-model="ruleChild.name"></el-input>
                </el-form-item>
                <el-form-item label="票券使用数量：" prop="bizPropertyMap.couponAmount" :rules="baseConfig.rules.count">
                    <el-input class="input-type-166" v-model="ruleChild.bizPropertyMap.couponAmount"></el-input>
                </el-form-item>
                <!-- 兑换规则专有 -->
                <template v-if="model.type == 'exchange'">
                    <el-form-item label="加价金额：">
                        <span class="addPrice">{{(Number(ruleChild.bizPropertyMap.totalAddPrice)).toFixed(2)}} 元 (需在兑换商品中设置加价金额)</span>
                    </el-form-item>
                </template>
            </el-collapse-item>
        </el-form>
        <el-collapse-item class="rule-table" :title="'设置'+model.title+'商品'" name="ruleItems">
            <div class="add-rule-btn">
                <el-dropdown @command="addRuleItem">
                    <el-button type="primary" style="width:114px">
                        添加商品<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item :disabled="addConfig.isEdition" command="goods">添加卖品</el-dropdown-item>
                        <el-dropdown-item :disabled="addConfig.isEdition" command="films" v-if="!ruleChild.bizPropertyMap.containSaleItemType.includes('0')">添加影片</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <section class="rule-table-content">
                <el-table :data="tableConfig.data" style="width: 100%">
                    <template v-for="(item,index) in tableConfig.title">
                        <el-table-column v-if="item.label != '操作'" :type="item.type" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed"></el-table-column>
                        <el-table-column v-else :type="item.type" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed">
                            <template slot-scope="scope">
                                <el-button class="control-btn" @click="checkRuleItem(scope.row)" :disabled="addConfig.isEdition" type="text" style="width:auto;height:auto">查看</el-button>
                                <el-button class="control-btn" @click="editionRuleItem(scope.row)" :disabled="addConfig.isEdition" type="text" style="width:auto;height:auto">编辑</el-button>
                                <el-button class="control-btn" @click="deleteRuleItem(scope.row)" :disabled="addConfig.isEdition" type="text" style="width:auto;height:auto">删除</el-button>
                            </template>
                        </el-table-column>
                    </template>
                </el-table>
                <!-- 添加商品/卖品 -->
                <el-form class="rule-form" ref="addConfig" :model="addConfig.form" :rules="addConfig.rules" label-width="120px">
                    <template v-if="addConfig.isShow">
                        <div class="add-form-title flex-base flex-center">添加{{model.type == 'exchange' ? '兑换' : '优惠'}}{{addConfig.type == 'goods' ? '卖品' : '影票'}}</div>
                        <!-- 数量 -->
                        <template v-if="model.type == 'favourable'">
                            <el-form-item label="商品数量：" prop="appointAmount">
                                <el-row class="flex-base height40">
                                    <el-radio-group class="margin-right-10" v-model="addConfig.form.appointAmount">
                                        <el-radio v-for="item in addConfig.system.appointAmount" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                                    </el-radio-group>
                                    <template v-if="addConfig.form.appointAmount == 'appointAmount'">
                                        <el-form-item prop="amount">
                                            <el-input class="input-type-94" v-model="addConfig.form.amount"></el-input>
                                        </el-form-item>
                                    </template>
                                </el-row>
                            </el-form-item>
                        </template>
                        <template v-else-if="model.type == 'exchange'">
                            <el-form-item label="商品数量：" prop="amount">
                                <el-input class="input-type-94" v-model="addConfig.form.amount"></el-input>
                            </el-form-item>
                        </template>
                        <!-- 影片 -->
                        <template v-if="addConfig.type == 'films'">
                            <el-form-item label="放映有效期：" prop="planStartTimeOp">
                                <el-radio-group v-model="addConfig.form.planStartTimeOp">
                                    <el-radio v-for="item in addConfig.system.planStartTimeOp" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                                </el-radio-group>
                                <el-form-item v-if="addConfig.form.planStartTimeOp == 'TimeBetweenOperator'" prop="planTime">
                                    <el-date-picker 
                                    v-model="addConfig.form.planTime" 
                                    type="daterange" 
                                    range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                    :picker-options="disabledDate"
                                    >
                                    </el-date-picker>
                                </el-form-item>
                            </el-form-item>
                            <el-form-item label="放映排除日期：" prop="filmPlanInvalidTime">
                                <el-checkbox-group v-model="addConfig.form.filmPlanInvalidTime">
                                    <el-checkbox v-for="item in addConfig.system.filmPlanInvalidTime" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
                                </el-checkbox-group>
                                <template v-if="addConfig.form.filmPlanInvalidTime.includes('not_DateRangeContainOperator')">
                                    <template v-for="(item,index) in addConfig.form.filmPlanInvalidTime_more">
                                        <el-row class="flex-base" :key="index">
                                            <el-form-item :prop="'filmPlanInvalidTime_more.'+index+'.value'" :rules="addConfig.rules.filmPlanInvalidTime_more">
                                                <el-date-picker 
                                                v-model="item.value" 
                                                type="daterange" 
                                                range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                                :picker-options="disabledDate"
                                                ></el-date-picker>
                                            </el-form-item>
                                            <el-button type="text" @click="addOrRemove('filmPlanInvalidTime_more',index)">{{index == 0 ? '添加' : '删除'}}</el-button>
                                        </el-row>
                                    </template>
                                </template>
                            </el-form-item>
                            <el-form-item label="放映星期范围：" prop="filmPlanWeekRange" >
                                <el-select v-model="addConfig.form.filmPlanWeekRange" placeholder="请选择">
                                    <el-option v-for="item in addConfig.system.filmPlanWeekRange" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                                <template v-if="addConfig.form.filmPlanWeekRange == 'WeekDateRangeOperator'">
                                    <el-form-item prop="week" :rules="addConfig.rules.filmPlanInvalidWeek_more">
                                        <el-checkbox-group v-model="addConfig.form.week">
                                            <template v-for="(item, index) in addConfig.system.week">
                                                <el-checkbox v-if="!item.isBr" :key="index" :label="item.value" @change="selectWeek($event,item)">{{item.label}}</el-checkbox>
                                                <br :key="index" v-if="item.isBr"  />
                                        </template>
                                        </el-checkbox-group>
                                    </el-form-item>
                                </template>
                            </el-form-item>
                            <el-form-item label="放映时段范围：" prop="filmPlanTimeRange">
                                <el-select v-model="addConfig.form.filmPlanTimeRange" placeholder="请选择">
                                    <el-option v-for="item in addConfig.system.filmPlanTimeRange" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                                <template v-if="addConfig.form.filmPlanTimeRange == 'TimeRangeContainOperator'">
                                    <el-row class="flex-base" :key="index" v-for="(item,index) in addConfig.form.filmPlanTimeRange_more">
                                        <el-form-item :prop="'filmPlanTimeRange_more.'+index+'.value'" :rules="addConfig.rules.filmPlanTimeRange_more">
                                            <el-time-picker is-range v-model="item.value" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" format='HH:mm' value-format="HH:mm" >
                                            </el-time-picker>
                                        </el-form-item>
                                        <el-button type="text" @click="addOrRemove('filmPlanTimeRange_more',index)">{{index == 0 ? '添加' : '删除'}}</el-button>
                                    </el-row>
                                </template>
                            </el-form-item>
                            <!-- 影片属性 -->
                            <template v-for="(item,index) in addConfig.filmEffect">
                                <el-form-item :key="index" :label="item.label+'：'" :prop="item.prop">
                                    <el-row class="flex-base height40">
                                        <el-radio-group class="margin-right-15" v-model="addConfig.form[`${item.prop}`]" >
                                            <el-radio v-for="(item,index) in item.radioOptions" :key="index" :label="item.value">{{item.label}}</el-radio>
                                        </el-radio-group>
                                        <template v-if="addConfig.form[`${item.prop}`] == item.children.showValue">
                                            <!-- 选择输入 -->
                                            <template v-if="!item.children.type">
                                                <el-form-item :prop="`${item.children.prop}.text`" :rules="item.children.rules">
                                                    <el-row>
                                                        <el-input class="input-type-166 popup-input" 
                                                        v-model="addConfig.form[`${item.children.prop}`].text" 
                                                        :placeholder="'请选择'+item.children.placeholder"  
                                                        :readonly=true
                                                        >
                                                            <i slot="suffix" class="el-icon-close popup-close" @click="clearInputValue(item.children.prop,'both')" v-show="addConfig.form[`${item.children.prop}`].text"></i>
                                                        </el-input>
                                                        <el-button type="primary" plain @click="selectInputValue(item.children.prop)">选择</el-button>
                                                    </el-row>
                                                </el-form-item>
                                            </template>
                                        </template>
                                    </el-row>
                                </el-form-item>
                            </template>
                        </template>
                        <!-- 卖品 -->
                        <template v-else-if="addConfig.type == 'goods'">
                            <el-form-item label="商品选项:" prop="productType">
                                <el-radio-group v-model="addConfig.form.productType">
                                    <el-radio v-for="item in addConfig.system.productType" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <div v-if="addConfig.form.productType == '0'">
                                <el-form-item label="商品名称：" prop="merName.text" :rules="addConfig.rules.merName">
                                    <el-row class="flex-base">
                                        <el-input class="input-type-166 popup-input" 
                                        v-model="addConfig.form.merName.text" 
                                        :readonly=true
                                        >
                                            <i slot="suffix" class="el-icon-close popup-close" 
                                            @click="clearInputValue('merName','both')" 
                                            v-if="addConfig.form.merName.text"></i>

                                        </el-input>
                                        <el-button class="margin-left-10" type="primary" plain 
                                        @click="selectInputValue('merName')">选择</el-button>
                                    </el-row>
                                </el-form-item>
                            </div>
                            <template v-else-if="addConfig.form.productType == '1'">
                                <el-form-item label="商品类别：" prop="className.text" :rules="addConfig.rules.className">
                                    <el-row class="flex-base">
                                        <el-input class="input-type-166 popup-input" 
                                        v-model="addConfig.form.className.text"
                                        :readonly=true  
                                        >
                                            <i slot="suffix" class="el-icon-close popup-close" @click="clearInputValue('className','both')" v-show="addConfig.form.className.text"></i>
                                        </el-input>
                                        <el-button class="margin-left-10" type="primary" plain @click="selectInputValue('className')">选择</el-button>
                                    </el-row>
                                </el-form-item>
                                <el-form-item label="品牌：" prop="brandName.text" :rules="addConfig.rules.brandName">
                                    <el-row class="flex-base">
                                        <el-input class="input-type-166 popup-input" 
                                        v-model="addConfig.form.brandName.text"  
                                        :readonly=true
                                        >
                                            <i slot="suffix" class="el-icon-close popup-close" @click="clearInputValue('brandName','both')" v-show="addConfig.form.brandName.text"></i>
                                        </el-input>
                                        <el-button class="margin-left-10" type="primary" plain @click="selectInputValue('brandName')">选择</el-button>
                                    </el-row>
                                </el-form-item>
                            </template>
                        </template>
                        <el-form-item label="价格范围：" prop="priceRange">
                            <el-row class="flex-base height40 ">
                                <el-radio-group v-model="addConfig.form.priceRange">
                                    <el-radio v-for="item in addConfig.system.priceRange" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                                </el-radio-group>
                                <el-row v-if=" addConfig.form.priceRange == 'BetweenOperator'" class="flex-base margin-left-10">
                                    <el-form-item prop="priceStart" >
                                        <el-input class="input-type-94" v-model="addConfig.form.priceStart" @change="changeInput('addConfig','priceEnd')"></el-input>
                                    </el-form-item>
                                    <span class="line">-</span>
                                    <el-form-item prop="priceEnd">
                                        <el-input class="input-type-94" v-model="addConfig.form.priceEnd" @change="changeInput('addConfig','priceStart')"></el-input>
                                    </el-form-item>
                                </el-row>
                            </el-row>
                        </el-form-item>
                        <!-- 规则 -->
                        <template>
                            <div class="rule-title">{{model.type == 'exchange' ? '兑换' : '优惠'}}规则：</div>
                            <el-form-item label="调整零售价为：" prop="priceModifyMethod" style="margin-bottom:0px">
                                <el-row class="flex-base">
                                    <el-select v-model="addConfig.form.priceModifyMethod" placeholder="请选择" @change="priceModifyMethodChange">
                                        <template v-for="item in addConfig.system.priceModifyMethod">
                                            <el-option v-if="!(item.value == 'lowest_price' && addConfig.type == 'goods')" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </template>
                                    </el-select>
                                    <template v-if="addConfig.form.priceModifyMethod != 'lowest_price'" >
                                        <el-form-item class="margin-left-5" prop="priceModifyValue" :rules="addConfig.rules.priceModifyValue" style="width:200px">
                                            <el-input class="input-type-94" style="width:150px;" v-model="addConfig.form.priceModifyValue" @change="priceModifyValueChange"></el-input> {{addConfig.form.priceModifyMethod == 'appointPercent' ? '%' : '元' }}
                                        </el-form-item>
                                    </template>
                                </el-row>
                            </el-form-item>
                            <template v-if="model.type == 'exchange'">
                                <el-form-item label="抵用金额：" prop="moneyMethod" style="margin-bottom:0;margin-top:15px;">
                                    <el-row class="flex-base margin-bottom-10">
                                    
                                        <el-select v-model="addConfig.form.moneyMethod" placeholder="请选择">
                                            <el-option v-for="item in addConfig.system.moneyMethod" :key="item.value" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                        <template v-if="addConfig.form.moneyMethod == 'fix_price'">
                                            <el-form-item class="margin-left-5" prop="fixPriceValue" :rules="addConfig.rules.fixPriceValue">
                                                <el-input class="input-type-94" style="width:150px;" v-model="addConfig.form.fixPriceValue"></el-input> 元
                                            </el-form-item>
                                        </template>
                                    </el-row>
                                    <div style="color:#666" v-if="addConfig.type == 'films' ">零售价 - 抵用金额后，仍不足抵消零售价时，采用以下方式处理：</div>                                    
                                    <template v-if="addConfig.form.moneyMethod == 'sale_price'">
                                        <span class="second-title margin-right-10" style="vertical-align:middle;display:inline-block;height:55px;">加价金额:</span>
                                        <el-form-item prop="addPriceValue"  :rules="addConfig.rules.addPriceValue" style="vertical-align:middle;height:55px;display:inline-block">
                                            <el-row class="flex-base">
                                                <el-input v-model="addConfig.form.addPriceValue" class="input-type-94 margin-right-5"></el-input> 元<span class="tips-font">（设置加价兑换时需设置此金额）</span>
                                            </el-row>
                                        </el-form-item>
                                    </template>
                                </el-form-item>
                            </template>
                            <template v-if=" addConfig.type == 'films' && ( (addConfig.form.priceModifyMethod!='lowest_price'&& model.type =='favourable') || addConfig.form.moneyMethod=='fix_price')">
                                <el-row class="flex-base" >
                                    <el-form-item prop="payer" style="margin-bottom:0">
                                        <div style="color:#666" v-if="model.type =='favourable' && addConfig.form.priceModifyMethod!='lowest_price'">影片最低票价 - 优惠金额（调整后零售价）后，仍不足抵消最低票价时，采用以下方式处理：</div>
                                        <el-radio-group class="input-type-94" v-model="addConfig.form.payer">
                                            <el-radio   :label="'cinema'"  style="height:45px;line-height:50px;" >
                                                使用影院限额补贴
                                                <el-form-item prop="payerPayAmount" style="display:inline-block" v-if="addConfig.form.payer=='cinema'">
                                                    <el-input v-model="addConfig.form.payerPayAmount" :rules="addConfig.rules.payerPayAmount" style="width:150px;" class="input-type-94 margin-right-5" ></el-input>
                                                </el-form-item>
                                                元后，剩下再顾客支付
                                            </el-radio>
                                            <el-radio   :label="'client'" style="height:45px;line-height:50px;">
                                                使用顾客限额支付
                                                <el-form-item prop="payerPayAmount" style="display:inline-block" v-if="addConfig.form.payer=='client'">
                                                    <el-input v-model="addConfig.form.payerPayAmount" :rules="addConfig.rules.payerPayAmount" style="width:150px;" class="input-type-94 margin-right-5" ></el-input>
                                                </el-form-item>
                                                元后，剩下再影院补贴
                                            </el-radio>
                                            <el-radio   :label="'clientAll'" style="height:45px;line-height:50px;">剩下均顾客支付</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                </el-row>
                            </template>
                            <el-form-item>
                                <el-checkbox class="tips-font" v-model="addConfig.form.couponMoneyAsPriceIn"  v-if="addConfig.form.moneyMethod == 'fix_price'&& model.type == 'exchange'">如抵用金额高于零售价时，使用抵用金额作为零售价</el-checkbox>
                            </el-form-item>
                            <el-form-item label="折扣后取整方式:" prop="decimalRoundMode">
                                <el-select v-model="addConfig.form.decimalRoundMode" placeholder="请选择">
                                    <el-option v-for="item in addConfig.system.decimalRoundMode" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                        <el-row class="flex-base flex-center margin-bottom-15">
                            <el-button type="primary" @click="sureAddItem('addConfig')">确定</el-button>
                            <el-button @click="closeAddItem('addConfig')" style="margin-left:32px;">取消</el-button>
                        </el-row>
                    </template>
                </el-form>
            </section>
        </el-collapse-item>
        <el-row class="flex-base flex-center margin-top-15">
            <el-button type="primary" @click="sureAddItem('ruleChild')">确定</el-button>
            <el-button @click="closeAddItem('ruleChild')" style="margin-left:32px;">取消</el-button>
        </el-row>
    </el-collapse>
    <!-- 弹窗 -->
    <!-- 影片弹窗 -->
    <filmDialog :title="filmDialog.title" :dialogTableVisible.sync="filmDialog.filmDialogVisible" ref="uniformCode" @callBack="handleFilmCallBack"></filmDialog>
    <!-- 影片类型 -->
    <filmTypeDialog :title="filmTypeDialog.title" :dialogTableVisible.sync="filmTypeDialog.filmTypeDialogVisible" ref="filmTypeKey" @callBack="handleFilmTypeCallBack"></filmTypeDialog>
    <!-- 影厅类型 -->
    <cinemaTypeDialog title="选择影厅类型" :dialogTableVisible.sync="cinemaTypeDialog.cinemaTypeDialogVisible" ref="hallTypeKey" @callBack="handleCinemaTypeCallBack"></cinemaTypeDialog>
    <!-- 影片效果 -->
    <projectionEffectDialog :title="projectionEffectDialog.title" :dialogTableVisible.sync="projectionEffectDialog.projectionEffectDialogVisible" ref="showEffectCode" @callBack="handleProjectionEffectCallBack"></projectionEffectDialog>
    <!-- 商品单选 -->
    <selectedGoodsSingle ref="merName" 
    :merNameId="addConfig.form.merName"  
    @selectedGoodsSingleCallBack="selectedGoodsSingleCallBack"
    :innerData="innerData"
    ></selectedGoodsSingle>
    <!-- 商品品牌单选 -->
    <selectedBrandSingle ref="brandName" @selectedBrandSingleCallBack="selectedBrandSingleCallBack"></selectedBrandSingle>
    <!-- 商品分类 -->
    <merClassSingle ref="className" @merClassSingleCallBack="merClassSingleCallBack"></merClassSingle>
    <!-- 查看子规则 -->
    <checkRuleItem ref="checkRuleItem"></checkRuleItem>
</div>
</template>

<script>
// const saleListUtil = require('../../../util/saleList.js');
import saleListUtil from '../../../util/saleList.js';
import alertHandle from 'ccmSrc/mixins/marketing/alertHandle.js'
import checkRuleItem from './checkRuleItem.vue'
import fixStepMixin from "ccmSrc/mixins/marketing/fixStepTool"


export default {
    components: {
        checkRuleItem
    },
    mixins:[alertHandle,fixStepMixin],
    /**
     * @param limitName  -用于限制同一规则组里面出现命名重复
     * @param data    -子规则
     * @param  familyIdBaseNum -用于区分不同的组
     * @param type   -当前是优惠券、兑换券
     * @param editIndex rules 下标 
     */
    props:{
        data : {
            type: Object,
            default:()=>{}
        },
        limitName : {
            type: Array,
            default:()=>[]
        },
        familyIdBaseNum : {
            default: ''
        }, 
        type :  {
            type: String,
            default: ''
        },
        editIndex : {
            default:-1
        }
    },
    data() {
        let pointer = this;
        return {
            /* 缓存数据 */
            cacheField: ["data","limitName","ruleChild","type","editIndex"],
            subComName:this.$route.query.pageName,
            innerData:'',
            //返回有效日期
            disabledDate :{
                disabledDate(time){
                    let date = new Date();
                    let y = date.getFullYear()
                    let m = date.getMonth()+1
                    let d = date.getDate()
                    let dateString = `${y}-${m}-${d}`
                    // pointer.delayWindow.validDateStart
                    return time.getTime() < new Date(dateString);

                }
            },
            activeNames: ['ruleInfo', 'ruleItems'],
            /** 模式 */
            model: {
                title: '',
                type: '',
                familyIdBaseNum: null,
                appyCode:''
            },
            /** 基本信息 */
            baseConfig: {
                rules: {
                    name: {
                        validator: function (rules, value, callBack) {
                            if (!value) {
                                return callBack(new Error('规则名不能为空'));
                            }
                          
                            let limitNameArr = JSON.parse(JSON.stringify(pointer.limitName));
                            let editIndex = pointer.editIndex;
                            if(editIndex != null && editIndex != undefined) {
                                limitNameArr.splice(editIndex,1);
                            }
                            
                            if(limitNameArr.includes(value)) {
                                return callBack(new Error('规则名不能重复'));
                            }
                            callBack();
                        }
                    },
                    count: {
                        validator: function (rules, value, callBack) {
                            if (!value) {
                                return callBack(new Error('票券使用数量不能为空'));
                            }

                            let regExp = /^[1-9]\d*$/;
                            if (!regExp.test(value)) {
                                return callBack(new TypeError('请输入正整数'));
                            }

                            if (value < 0 || value > 100) {
                                return callBack(new TypeError('请输入1-100的整数数字'));
                            }

                            return callBack();
                        }
                    }
                }
            },
            /* 表格信息 */
            tableConfig: {
                title: [],
                options: {
                    exchange: [{
                            type: 'index',
                            width: '50'
                        },
                        {
                            label: '类型',
                            prop: 'merType',
                            width: '100'
                        }, {
                            label: '商品类别',
                            prop: 'className',
                            width: '150'
                        }, {
                            label: '商品名称',
                            prop: 'merName',
                            width: '150'
                        }, {
                            label: '数量',
                            prop: 'amount',
                            width: '150'
                        }, {
                            label: '价格区间',
                            prop: 'priceRange',
                            width: '200'
                        }, {
                            label: '操作',
                            prop: '',
                            width: '250',
                            fixed: 'right'
                        }
                    ],
                    favourable: [{
                        type: 'index',
                        width: '50'
                    }, {
                        label: '类型',
                        prop: 'merType',
                        width: '100'
                    }, {
                        label: '商品类别',
                        prop: 'className',
                        width: '150'
                    }, {
                        label: '商品名称',
                        prop: 'merName',
                        width: '150'
                    }, {
                        label: '数量',
                        prop: 'amount',
                        width: '100'
                    }, {
                        label: '优惠方式',
                        prop: 'priceModifyMethod',
                        width: '200'
                    }, {
                        label: '操作',
                        prop: '',
                        width: '250',
                        fixed: 'right'
                    }]
                },
                data: []
            },
            /* 添加规则 */
            addConfig: {
                isShow: false,
                isEdition: false,
                type: '',
                form: {
                    // merName:{value:''}
                },
                rules: {
                    amount: {
                        required: true,
                        type: 'number',
                        validator: function (rule, value, callBack) {
                            if (!value) {
                                return callBack(new Error('请输入商品数量'));
                            }
                            let reg = /^[0-9]{0,1}[0-9]{0,1}$/;

                            if (!reg.test(value)) {
                                callBack(new Error('请输入小于99的整数'));
                            }else if(value == 0){
                                return callBack(new TypeError('请输入正整数'));
                            } else {
                                callBack();
                            }
                        }
                    },
                    planTime: {
                        required: true,
                        message: '请选择日期范围',
                    },
                    filmPlanInvalidTime_more: {
                        required: true,
                        message: '请选择日期范围',
                        trigger: 'blur'
                    },
                    filmPlanInvalidWeek_more: {
                        required: true,
                        message: '请选择星期范围',
                        trigger: 'blur'
                    },
                    filmPlanTimeRange_more: {
                        required: true,
                        message: '请选择时间段',
                        trigger: 'blur'
                    },
                    priceModifyValue: {
                        required: true,
                        trigger: 'blur',
                        validator: (rules, value, callBack) => {
                            if (!value) {
                                return callBack(new Error('请输入金额'));
                            }else if(this.addConfig.form.priceModifyMethod != 'appointPercent'){
                                let reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

                                if (!reg.test(value)) {
                                    return callBack(new TypeError('请输入正数,且允许两位小数'));
                                }else if (value > 999){
                                    return callBack(new TypeError('金额不能大于999'));
                                }

                            }
                            else{
                                let reg = /^(?:(?!0\d)\d{1,2}(?:\.\d{1,2})?|100(?:\.0{1,2})?)$/;
                                if (!reg.test(value)) {
                                    return callBack(new TypeError('请输入0~100的正数,且允许两位小数'));
                                }
                            }
                            

                            return callBack();
                        }
                    },
                    fixPriceValue: {
                        required: true,
                        trigger: 'blur',
                        validator: (rules, value, callBack) => {
                            if (!value) {
                                return callBack(new Error('请输入金额'));
                            }
                            const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^[0-9]\.[0-9]([0-9])?$)/;

                            if (!reg.test(value)) {
                                return callBack(new TypeError('请输入正数,且允许两位小数'));
                            }else if (value > 999){
                                return callBack(new TypeError('金额不能大于999'));
                            }
                            return callBack();
                        }
                    },
                    addPriceValue: {
                        required: true,
                        trigger: 'blur',
                        validator: (rules, value, callBack) => {
                            if (!value) {
                                return callBack(new Error('请输入金额'));
                            }
                            const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;

                            if (!reg.test(value)) {
                                return callBack(new TypeError('请输入正数,且允许两位小数'));
                            }else if(Number(value)>999.99){
                                return callBack(new TypeError('请输入金额范围,0~999.99'));
                            }

                            return callBack();
                        }
                    },
                    payerPayAmount: {
                        required: true,
                        validator: (rules, value, callBack) => {
                            const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                            if (!reg.test(value)) {
                                return callBack(new TypeError('请输入数字,最大4位'));
                            }else if(value>9999){
                                return callBack(new TypeError('请输入数字,最大4位'))
                            }
                            return callBack();
                        },
                        trigger: 'blur',
                        type: 'number'
                    },
                    // 卖品
                    merName: {
                        required: true,
                        trigger: 'change',
                        validator: (rules, value, callBack) => {
                            if (!value) {
                                return callBack(new Error('请选择商品名称'));
                            }
                            callBack();
                        }
                    },
                    className: {
                        required: true,
                        trigger: 'change',
                        validator: (rules, value, callBack) => {
                            if (!value) {
                                return callBack(new Error('请选择商品类别'));
                            }
                            callBack();
                        }
                    },
                    brandName: {
                        required: true,
                        trigger: 'change',
                        validator: (rules, value, callBack) => {
                            if (!value) {
                                return callBack(new Error('请选择品牌'));
                            }
                            callBack();
                        }
                    },
                    //this.model.type=='goods'
                    priceStart: {
                        required: true,
                        type: 'number',
                        validator: (rules, value, callBack)=> {
                            if (!value) {
                                return callBack(new Error('请输入金额'));
                            }
                            let priceEnd = this.addConfig.form.priceEnd;
                            let priceModifyValue = Number(this.addConfig.form.priceModifyValue) 
                            const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                            if (!reg.test(value)) {
                                return callBack(new TypeError('请输入正数,且允许两位小数'));
                            }else if(value>999){
                                return callBack(new TypeError('最大三位数字'));
                            }

                            if (priceEnd && Number(value)  > Number(priceEnd) ) {
                                return callBack(new Error('请输入小于或等于结束值'))
                            }
                            console.log( this.addConfig.form.priceModifyMethod ) 
                            if(this.addConfig.form.priceModifyMethod == 'fix_price'){
                                if(value < priceModifyValue){
                                    return callBack(new Error('起始值不能小于固定值金额'))
                                }
                            }else if(this.addConfig.form.priceModifyMethod == 'subPrice'){
                                if(value < priceModifyValue) {
                                    return callBack(new Error('起始值不能小于扣减金额'))
                                }
                            }

                            callBack();
                        },
                        trigger: 'blur'
                    },
                    priceEnd: {
                        required: true,
                        type: 'number',
                        validator: (rules, value, callBack)=> {
                            if (!value) {
                                return callBack(new Error('请输入金额'));
                            }
                            let priceStart = this.addConfig.form.priceStart;
                            const reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                            if (!reg.test(value)) {
                                return callBack(new TypeError('请输入正数,且允许两位小数'));
                            }else if(value>999){
                                return callBack(new TypeError('最大三位数字'));
                            }

                            if (priceStart && Number(value)  < Number(priceStart) ) {
                                return callBack(new Error('请输入大于或等于开始值'))
                            }

                            callBack();
                        },
                        trigger: 'blur'
                    }
                },
                options: {
                    exchange_goods: {
                        amount: '',
                        productType: '0',
                        merName: {
                            text: '',
                            value: ''
                        },
                        className: {
                            value: '',
                            text: ''
                        },
                        brandName: {
                            value: '',
                            text: ''
                        },
                        priceRange: 'BetweenOperator',
                        priceStart: '',
                        priceEnd: '',
                        // 规则
                        priceModifyMethod: 'fix_price',
                        priceModifyValue: '',
                        moneyMethod: 'sale_price',
                        payer: 'cinema',
                        payerPayAmount: '',
                        couponMoneyAsPriceIn: false,
                        decimalRoundMode: 'ROUND_UNNECESSARY'
                    },
                    exchange_films: {
                        amount: '',
                        planStartTimeOp: '',
                        planTime: '',
                        filmPlanInvalidTime: [],
                        filmPlanInvalidTime_more: [{
                            value: ''
                        }],
                        filmPlanWeekRange: '',
                        week: [],
                        filmPlanTimeRange: '',
                        filmPlanTimeRange_more: [{
                            value: ''
                        }],
                        showEffectOp: '',
                        showEffectCode: {
                            text: '',
                            value: ''
                        },
                        movieNameOp: '',
                        uniformCode: {
                            value: '',
                            text: ''
                        },
                        filmTypeNameOp: '',
                        filmTypeKey: {
                            value: '',
                            text: ''
                        },
                        hallTypeNameOp: '',
                        hallTypeKey: {
                            value: '',
                            text: ''
                        },
                        priceRange: '',
                        priceStart: '',
                        priceEnd: '',
                        // 规则
                        priceModifyMethod: 'lowest_price',
                        priceModifyValue: '',
                        moneyMethod: 'sale_price',
                        payer: 'cinema',
                        payerPayAmount: '',
                        couponMoneyAsPriceIn: false,
                        decimalRoundMode: 'ROUND_UNNECESSARY'
                    },
                    favourable_goods: {
                        appointAmount: 'appointAmount',
                        amount: '1',
                        productType: '0',
                        merName: {
                            value: '',
                            text: ''
                        },
                        className: {
                            value: '',
                            text: ''
                        },
                        brandName: {
                            text: '',
                            value: ''
                        },
                        priceRange: 'BetweenOperator',
                        priceStart: '',
                        priceEnd: '',
                        // 规则
                        priceModifyMethod: 'fix_price',
                        priceModifyValue: '',
                        decimalRoundMode: 'ROUND_UNNECESSARY'
                    },
                    favourable_films: {
                        appointAmount: '',
                        amount: '',
                        planStartTimeOp: '',
                        planTime: '',
                        filmPlanInvalidTime: [],
                        filmPlanInvalidTime_more: [{
                            value: ''
                        }],
                        filmPlanWeekRange: '',
                        week: [],
                        filmPlanTimeRange: '',
                        filmPlanTimeRange_more: [{
                            value: ''
                        }],
                        showEffectOp: '',
                        showEffectCode: {
                            value: '',
                            text: ''
                        },
                        movieNameOp: '',
                        uniformCode: {
                            value: '',
                            text: ''
                        },
                        filmTypeNameOp: '',
                        filmTypeKey: {
                            value: '',
                            text: ''
                        },
                        hallTypeNameOp: '',
                        hallTypeKey: {
                            value: '',
                            text: ''
                        },
                        priceRange: '',
                        priceStart: '',
                        priceEnd: '',
                        // 规则
                        priceModifyMethod: 'lowest_price',
                        priceModifyValue: '',
                        moneyMethod: 'sale_price',
                        payer: 'cinema',
                        payerPayAmount: '',
                        couponMoneyAsPriceIn: false,
                        decimalRoundMode: 'ROUND_UNNECESSARY'
                    }
                },
                // 用于渲染选项
                system: {
                    appointAmount: [{
                        label: '不限',
                        value: ''
                    }, {
                        label: '指定数量',
                        value: 'appointAmount'
                    }],
                    planStartTimeOp: [{
                        label: '不限',
                        value: ''
                    }, {
                        label: '指定范围',
                        value: 'TimeBetweenOperator'
                    }],
                    filmPlanInvalidTime: [{
                        label: '节假日除外',
                        value: 'not_RelateDateHolidayOperator'
                    }, {
                        label: '指定排除日期范围',
                        value: 'not_DateRangeContainOperator'
                    }],
                    filmPlanWeekRange: [{
                        label: '每天',
                        value: ''
                    }, {
                        label: '周一至周五',
                        value: 'WeekDateOperator'
                    }, {
                        label: '指定范围',
                        value: 'WeekDateRangeOperator'
                    }],
                    week: [{
                        label: '工作日',
                        value: 'work',
                        list: ['work', '1', '2', '3', '4', '5']
                    }, {
                        label: '周一',
                        value: '1'
                    }, {
                        label: '周二',
                        value: '2'
                    }, {
                        label: '周三',
                        value: '3'
                    }, {
                        label: '周四',
                        value: '4'
                    }, {
                        label: '周五',
                        value: '5'
                    }, {
                        isBr: true
                    }, {
                        label: '周末',
                        value: 'holiday',
                        list: ['holiday', '6', '7']
                    }, {
                        label: '周六',
                        value: '6'
                    }, {
                        label: '周日',
                        value: '7'
                    }],
                    filmPlanTimeRange: [{
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
                    }],
                    priceModifyMethod: [{
                        label: '影片最低发行价',
                        value: 'lowest_price'
                    }, {
                        label: '固定金额',
                        value: 'fix_price'
                    }, {
                        label: '扣减金额',
                        value: 'subPrice'
                    }, {
                        label: '指定折扣',
                        value: 'appointPercent'
                    }],
                    // 规则
                    moneyMethod: [{
                            label: '零售价(扣减加价金额)',
                            value: 'sale_price'
                        },
                        {
                            label: '固定金额',
                            value: 'fix_price'
                        }
                    ],
                    decimalRoundMode: [{
                        label: '四舍五入',
                        value: 'ROUND_HALF_UP'
                    }, {
                        label: '忽略小数取整',
                        value: 'ROUND_FLOOR'
                    }, {
                        label: '小数进1取整',
                        value: 'ROUND_CEILING'
                    }, {
                        label: '保留小数',
                        value: 'ROUND_UNNECESSARY'
                    }],
                    // 卖品
                    productType: [{
                        label: '商品名称',
                        value: '0'
                    }, {
                        label: '商品属性',
                        value: '1'
                    }],
                    priceRange: [{
                        label: '不限',
                        value: ''
                    }, {
                        label: '指定区间',
                        value: 'BetweenOperator'
                    }]
                },
                // 影片效果
                filmEffect: [{
                    prop: 'showEffectOp',
                    label: '影片效果',
                    radioOptions: [{
                        label: '不限',
                        value: ''
                    }, {
                        label: '指定影片效果',
                        value: 'FieldStringIndexOf'
                    }],
                    children: {
                        showValue: 'FieldStringIndexOf',
                        prop: 'showEffectCode',
                        placeholder: '影片效果',
                        rules: [{
                            required: true,
                            message: '请选择影片效果',
                            trigger: 'change'
                        }]
                    }
                }, {
                    prop: 'movieNameOp',
                    label: '影片名称',
                    radioOptions: [{
                        label: '不限',
                        value: ''
                    }, {
                        label: '指定影片名称',
                        value: 'normalIn'
                    }],
                    children: {
                        showValue: 'normalIn',
                        prop: 'uniformCode',
                        placeholder: '影片名称',
                        rules: [{
                            required: true,
                            message: '请选择影片名称',
                            trigger: 'change'
                        }]
                    }
                }, {
                    prop: 'filmTypeNameOp',
                    label: '影片类型',
                    radioOptions: [{
                        label: '不限',
                        value: ''
                    }, {
                        label: '指定影片类型',
                        value: 'stringSplitContainOneOperator'
                    }],
                    children: {
                        showValue: 'stringSplitContainOneOperator',
                        prop: 'filmTypeKey',
                        placeholder: '影片类型',
                        rules: [{
                            required: true,
                            message: '请选择影片类型',
                            trigger: 'change'
                        }]
                    }
                }, {
                    prop: 'hallTypeNameOp',
                    label: '影厅类型',
                    radioOptions: [{
                        label: '不限',
                        value: ''
                    }, {
                        label: '指定影厅类型',
                        value: 'normalIn'
                    }],
                    children: {
                        showValue: 'normalIn',
                        prop: 'hallTypeKey',
                        placeholder: '影厅类型',
                        rules: [{
                            required: true,
                            message: '请选择影厅类型',
                            trigger: 'change'
                        }]
                    }
                }]
            },
            /**
             * @param ruleChild - 子规则对象
             * 
             * @param {String} ruleChild.name - 规则名称
             * @param {Number} ruleChild.ruleConditions - 规则限制项
             * @param {Array} ruleChild.actions - 执行方式
             */
            ruleChild: {
                name: '',
                ruleConditions: [],
                actions: [],
                /**
                 * @param {Object} bizPropertyMap - 子规则统计属性
                 * 
                 * @param {Number} bizPropertyMap.couponAmount - 所需票券数量
                 * @param {Number}  bizPropertyMap.totalAddPrice - 总加价金额
                 * @param {String}  bizPropertyMap.containSaleItemType - 包含的商品类型 "0影票,1卖品"
                 */
                bizPropertyMap: {
                    "couponAmount": '',
                    "totalAddPrice": 0,
                    "containSaleItemType": ""
                }
            },
            ruleChildCopy: {},
            tableDataCopy: [],
            // 编辑rule
            isEditionRule: false,
            // 页面进来的参数
            enterQuery: {}
        }
    },
    created() {
        // 设置当前模式
        console.log('是否重新created')
        this.setModeType(this.type);
            let ruleChild = this.data;
            // 拆解数据用于显示
            console.log('获取子规则:',ruleChild,'editIndex',this.editIndex)
            if(this.editIndex >= 0){
                console.log('进入拆解')
                saleListUtil.unPackageRuleTable(ruleChild,this);
                this.ruleChild = ruleChild;
            }
        // 
        // 当前创建子规则familyIdBaseNum
        
        this.model.familyIdBaseNum = this.familyIdBaseNum;
    },
    methods: {
        /**
         * @function setModeType - 设置模式
         * @param {String} type- 类型模式 exchange兑换 favourable优惠
         */
        setModeType(type) {
            let title = '';
            if (type == 'exchange') {
                title = '兑换';
            } else {
                title = '优惠';
            }

            this.model = {
                title,
                type
            }

            // 修改表格模式 兑换 优惠
            console.log(this.tableConfig.options)
            console.log(type)
            this.tableConfig.title = JSON.parse(JSON.stringify(this.tableConfig.options[`${type}`]));
            console.log(this.tableConfig.options[`${type}`])
        },
        /**
         * @function addRuleItem - 添加商品
         */
        addRuleItem(val) {
            console.log('添加商品----------star------------------',this.ruleChild)
            this.$refs[`addConfig`].clearValidate();
            let type = this.model.type;
            // 设置当前状态为正在编辑中            
            this.addConfig.isEdition = true;
            // 备份
            this.ruleChildCopy = JSON.parse(JSON.stringify(this.ruleChild));
            this.tableDataCopy = JSON.parse(JSON.stringify(this.tableConfig.data));
            // 修改添加模式修改添加模式
            this.addConfig.form = this.addConfig.options[`${type}_${val}`];
            this.addConfig.type = val;
            this.addConfig.isShow = true;
            console.log('添加商品----------end------------------',this.ruleChild)
        },
        /**
         * @function addOrRemove - 添加或移除时间段
         * @param {String} itemName - 添加项的名字
         * @param {Number} index - 添加数组的下标 0 为添加 其他数字为移除当前项
         */
        addOrRemove(itemName, index) {
            let pointer = this;
            let itemArray = pointer.addConfig.form[`${itemName}`];

            if (index == 0) {
                itemArray.push({
                    value: ''
                });
            } else {
                itemArray.splice(index, 1);
            }

            pointer.addConfig.form[`${itemName}`] = itemArray;
            console.log(itemName,pointer.addConfig.form[`${itemName}`])
        },
        /**
         * @function selectWeek - 选择放映排除日期指定范围
         */
        selectWeek(isCheck, item) {
            let dayName = item.value;

            if (dayName == 'work' || dayName == 'holiday') {
                let f_weekArray = JSON.parse(JSON.stringify(this.addConfig.form.week));
                let weekArray = item.list;
                let weekObj = {};

                for (let i = 0; i < f_weekArray.length; i++) {
                    if (!weekObj[`${f_weekArray[i]}`]) {
                        weekObj[`${f_weekArray[i]}`] = true;
                    }
                }

                for (let i = 0; i < weekArray.length; i++) {
                    if (isCheck) {
                        if (!weekObj[`${weekArray[i]}`]) {
                            weekObj[`${weekArray[i]}`] = true;
                        }
                    } else {
                        if (weekObj[`${weekArray[i]}`]) {
                            delete weekObj[`${weekArray[i]}`];
                        }
                    }
                }

                f_weekArray = Object.keys(weekObj);
                this.addConfig.form.week = f_weekArray;

            }
        },
        /**
         * @function sureAddItem - 添加子规则
         */
        sureAddItem(formName) {
            this.$refs[`${formName}`].validate((validate) => {
                if (validate) {
                    if (formName == 'addConfig') {
                    // console.log( this.addConfig.type , this.addConfig.form.priceModifyMethod , this.addConfig.form.priceStart)
                        /**
                         * 兑换、优惠规则的卖品、影票，调整零售价为、固定金额或者扣减金额时需要填写价格范围
                         */
                        if( this.addConfig.form.priceModifyMethod == 'fix_price' || this.addConfig.form.priceModifyMethod == 'subPrice' ) {
                            if(this.addConfig.form.priceRange != 'BetweenOperator'){
                                return this.$message({
                                    type:'warning',
                                    message:'请填写价格范围-指定区间'
                                })
                            }

                        }
                        // 组装子规则
                        this.packageAddConfig(this.addConfig.form, this.addConfig.type, this.model.familyIdBaseNum, (new Date()).getTime());

                        // 当前是否为编辑状态，如果是则重置编辑状态
                        if (this.addConfig.isEdition) {
                            this.addConfig.isEdition = false;
                        }
                        console.log('优惠、兑换类型end',this.model)
                        this.$refs[formName].resetFields();
                    } else {
                        if(this.addConfig.isEdition){
                            return this.$message({message:'当前处于编辑状态,请保存修改',type:'warning'})
                        }
                        let containSaleItemType = this.ruleChild.bizPropertyMap.containSaleItemType;
                        if (containSaleItemType) {
                            // let couponAmount = this.ruleChild.count;
                            // this.ruleChild.bizPropertyMap.couponAmount = couponAmount;
                            let _params = {
                                ruleChild:this.ruleChild,
                                editIndex: this.editIndex

                            }
                            this.$emit('editItem',_params)

                            // this.$router.push({
                            //     name: 'createSales',
                            //     query: {
                            //         isGetRule: true,
                            //         isGetForm: true,
                            //         isEditionRule: this.isEditionRule,
                            //         editIndex: this.editIndex,
                            //         pageName:this.$route.query.pageName
                            //     }
                            // });
                            
                        } else {
                            this.$message({
                                message: '需要添加商品或影票',
                                type: 'warning'
                            });
                        }
                    }
                }
            })
        },
        /**
         * @function closeAddItem - 关闭自规则
         * @param {String} formName - 表单名 form 总表 addConifg 子规则
         */
        closeAddItem(formName) {
            if (formName == 'addConfig') {
                if (this.addConfig.isEdition) {
                    this.$confirm('放弃编辑?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.restForm();
                        this.ruleChild = JSON.parse(JSON.stringify(this.ruleChildCopy));
                        console.log('表格关闭的ruleChild:',this.ruleChild)
                        this.tableConfig.data = JSON.parse(JSON.stringify(this.tableDataCopy));
                        this.ruleChildCopy = {};
                        this.tableDataCopy = [];
                        this.addConfig.isEdition = false;
                    }).catch((msg) => {
                        console.log(msg)
                    })
                }
            } else {
                if(this.addConfig.isEdition){
                    return  this.$message({message:'当前处于编辑状态,请保存修改',type:'warning'})
                }
                this.$confirm('确定不提交就退出?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$emit('closeItem')

                }).catch((msg) => {
                    console.log(msg)
                })
            }
        },
        /**
         * @function resetForm - 重置表格
         */
        restForm() {
            this.addConfig.isShow = false;
            this.addConfig.type = '';
            this.addConfig.form = {};
        },
        /**
         * @function packageAddConfig - 组装子规则
         * 
         * @param {Object} form - 表单数据
         * @param {String} type - 添加的类型 films:0,goods:1
         * @param {Number|String} baseNum - familyIdBaseNum用于区分不同的组
         * @param {Number|String} childNum - 当前规则第几项
         */
        packageAddConfig(form, type, baseNum, childNum) {
            let ruleConditions = JSON.parse(JSON.stringify(this.ruleChild[`ruleConditions`]));
            console.log('规则',form)
            let actions = JSON.parse(JSON.stringify(this.ruleChild[`actions`]));

            let familyId = `${baseNum}_${childNum}`;

            // ruleConditions
            // 子规则公共规则  商品类型
            ruleConditions.push({
                key: 'saleItemType',
                category: 'SaleItemInfo',
                opUniqueName: 'normalEqual',
                value: type == 'films' ? 0 : 1,
                familyId
            });

            if (type == 'films') {
                // 票券规则
                let category = 'FilmTicketInfo';
                // 放映有效期
                let planStartTimeOpVal = form[`planStartTimeOp`];
                if (planStartTimeOpVal) {
                    let obj = {
                        key: 'planStartTime',
                        category,
                        opUniqueName: 'TimeBetweenOperator',
                        value: JSON.stringify([this.ruleTime(form[`planTime`][0]), this.ruleTime(form[`planTime`][1])]),
                        familyId
                    }
                    ruleConditions.push(obj);
                }

                // 放映排除日期
                let filmPlanInvalidTimeVal = form[`filmPlanInvalidTime`];
                if (filmPlanInvalidTimeVal.includes('not_RelateDateHolidayOperator')) {
                    let obj = {
                        key: 'filmPlanInvalidTime',
                        category,
                        opUniqueName: 'not_RelateDateHolidayOperator',
                        familyId
                    }
                    ruleConditions.push(obj);
                }

                // 放映排除日期 - 指定排除日期范围
                if (filmPlanInvalidTimeVal.includes('not_DateRangeContainOperator')) {
                    let obj = {
                        key: 'filmPlanInvalidTime',
                        category,
                        opUniqueName: 'not_DateRangeContainOperator',
                        familyId
                    }

                    let timeArr = form[`filmPlanInvalidTime_more`];
                    let _timeArr = [];
                    for (let i = 0; i < timeArr.length; i++) {
                        let item = timeArr[i].value;
                        _timeArr.push([this.ruleTime(item[0]), this.ruleTime(item[1])]);
                    }
                    obj[`value`] = JSON.stringify(_timeArr);
                    ruleConditions.push(obj);
                }

                // 放映星期范围
                let filmPlanWeekRangeVal = form[`filmPlanWeekRange`];
                if (filmPlanWeekRangeVal) {
                    // console.log('放映星期范围',filmPlanWeekRangeVal)
                    let obj = {
                        key: 'filmPlanWeekRange',
                        category: 'FilmTicketInfo',
                        opUniqueName: filmPlanWeekRangeVal,
                        familyId
                    }
                    // 指定范围
                    if (filmPlanWeekRangeVal == 'WeekDateRangeOperator') {
                        let weekArr = form[`week`];
                        let _weekArr = [];
                        for (let i = 0; i < weekArr.length; i++) {
                            let item = weekArr[i];
                            if (item != 'holiday' && item != 'work') {
                                _weekArr.push(item);
                            }
                        }
                        obj[`value`] = _weekArr.join(',');

                    }
                    ruleConditions.push(obj);
                }

                // 放映时段范围
                let filmPlanTimeRangeVal = form[`filmPlanTimeRange`];
                if (filmPlanTimeRangeVal) {
                    console.log('放映时段范围:',filmPlanTimeRangeVal)
                    console.log('放映时段范围:',form[`filmPlanTimeRange_more`])
                    let obj = {
                        key: 'filmPlanTimeRange',
                        category,
                        opUniqueName: filmPlanTimeRangeVal,
                        familyId
                    }
                    // 指定时段
                    if (filmPlanTimeRangeVal == 'TimeRangeContainOperator') {
                        let timeArr = form[`filmPlanTimeRange_more`];
                        let _timeArr = [];
                        for (let i = 0; i < timeArr.length; i++) {
                            let item = timeArr[i].value;
                            _timeArr.push([item[0], item[1]]);
                        }
                        obj[`value`] = JSON.stringify(_timeArr);
                        console.log('放映时段范围-------',obj[`value`])
                        console.log(timeArr)
                    }
                    ruleConditions.push(obj);
                }
                // 影片属性
                let filmEffectArr = [{
                    formName: 'showEffectOp',
                    key: 'showEffect',
                    opUniqueName: 'FieldStringIndexOf',
                    childrenFormName: 'showEffectCode'
                }, {
                    formName: 'movieNameOp',
                    key: 'uniformCode',
                    opUniqueName: 'normalIn',
                    childrenFormName: 'uniformCode'
                }, {
                    formName: 'filmTypeNameOp',
                    key: 'filmTypeKey',
                    opUniqueName: 'stringSplitContainOneOperator',
                    childrenFormName: 'filmTypeKey'
                }, {
                    formName: 'hallTypeNameOp',
                    key: 'hallTypeKey',
                    opUniqueName: 'normalIn',
                    childrenFormName: 'hallTypeKey'
                }]

                for (let i = 0; i < filmEffectArr.length; i++) {
                    let item = filmEffectArr[i];
                    let filmItemVal = form[`${item.formName}`];
                    if (filmItemVal) {
                        let obj = {
                            key: item.key,
                            category,
                            opUniqueName: item.opUniqueName,
                            value: form[`${item.childrenFormName}`].value,
                            text: form[`${item.childrenFormName}`].text,
                            familyId
                        };
                        ruleConditions.push(obj);
                    }
                }
                /* 1.条件在兑换规则的固定金额
                   2.条件在优惠规则非最低发行价
                 */
                if( (form.priceModifyMethod!='lowest_price' && this.model.type =='favourable' ) || form.moneyMethod=='fix_price' ){
                    // 低于零售价时，由谁支付 多少金额 
                    let payerVal = form[`payer`];
                    
                    // 支付限额
                    if (payerVal == 'cinema' || payerVal == 'client') {
                        if(form[`payerPayAmount`]){
                            actions.push({
                                key: 'payerPayAmount',
                                value: form[`payerPayAmount`],
                                familyId
                            });
                        }
                    }
                    // 低于零售价时，由谁支付
                    if(payerVal == 'clientAll'){
                        payerVal = 'client'
                    }
                    actions.push({
                        key: 'payer',
                        value: payerVal,
                        familyId
                    });
                }    

            } else if (type == 'goods') {
                // 商品规则

                // 商品选项
                let productTypeVal = form[`productType`];

                if (productTypeVal == '0') {
                    // 商品名称
                    let merNameVal = form[`merName`].value;
                    if (merNameVal) {
                        let obj = {
                            key: 'merKey',
                            category: 'MerchandiseInfo',
                            opUniqueName: 'normalEqual',
                            value: form[`merName`].value, //商品唯一uid
                            text: form[`merName`].text, //商品名称
                            familyId
                        }
                        ruleConditions.push(obj);
                    }
                } else if (productTypeVal == '1') {
                    // 商品属性

                    // 商品类别
                    let classNameVal = form[`className`].value;
                    if (classNameVal) {
                        let obj = {
                            key: 'classCode',
                            category: 'MerchandiseInfo',
                            opUniqueName: 'normalEqual',
                            value: form[`className`].value, //商品类别唯一uid
                            text: form[`className`].text, //商品类别名称
                            familyId
                        }
                        ruleConditions.push(obj);
                    }

                    // 商品品牌
                    let brandNameVal = form[`brandName`].value;
                    if (brandNameVal) {
                        let obj = {
                            key: 'brandId',
                            category: 'MerchandiseInfo',
                            opUniqueName: 'normalEqual',
                            value: form[`brandName`].value, //商品品牌唯一uid
                            text: form[`brandName`].text, //商品品牌名称
                            familyId
                        }
                        ruleConditions.push(obj);
                    }
                }
            }

            // 子规则公共规则 价格范围
            let priceRangeVal = form[`priceRange`];
            if (priceRangeVal) {
                let obj = {
                    key: 'price',
                    category: 'SaleItemInfo',
                    opUniqueName: 'BetweenOperator', // 选择指定票价范围时,界面增加两个文本框,输入起始价格和结束价格,正整数
                    value: JSON.stringify([
                        [form[`priceStart`], form[`priceEnd`]]
                    ]), //数据格式,虽然只有一组值,还是需要使用二维数组
                    familyId
                }
                ruleConditions.push(obj);
            }
            // 子规则都必须添加属性 兑换券，优惠券此属性为必传属性 
            ruleConditions.push({
                category: "CouponInfo",
                key: "couponUsedItemType",
                opUniqueName: "ElementNotContain",
                familyId, //分组ID，用于票券申请单中，不同商品的兑换/优惠规则区分
                value: type == 'goods' ? 1 : 0 //0：影票；1：卖品
            });

            /* actions */
            // 调整零售价方法
            let priceModifyMethodVal = form[`priceModifyMethod`];
            if (priceModifyMethodVal) {
                let obj = {
                    key: 'priceModifyMethod',
                    value: priceModifyMethodVal,
                    familyId
                };
                actions.push(obj);
            }
            // 调整零售价为(金额值)
            if (priceModifyMethodVal != 'lowest_price') {
                let obj = {
                    key: 'priceModifyValue',
                    value: form[`priceModifyValue`],
                    familyId
                };
                actions.push(obj);
            }
            // 兑换规则专有
            if (this.model.type == 'exchange') {
                // 抵用金额
                let moneyMethodVal = form[`moneyMethod`];
                actions.push({
                    key: 'moneyMethod',
                    value: moneyMethodVal,
                    familyId
                })
                // 零售价
                if (moneyMethodVal == 'sale_price') {
                    actions.push({
                        key: 'addPriceValue',
                        value: form[`addPriceValue`],
                        familyId
                    });

                    // 累加总修改加价金额
                    this.ruleChild.bizPropertyMap.totalAddPrice += Number(form[`addPriceValue`]);
                }
                // 固定金额
                if (  moneyMethodVal == 'fix_price') {
                    actions.push({
                        key: 'fixPriceValue',
                        value: form[`fixPriceValue`],
                        familyId
                    });
                    // 是否高于零售价
                    let couponMoneyAsPriceInVal = form[`couponMoneyAsPriceIn`];
                    if (couponMoneyAsPriceInVal) {
                        actions.push({
                            key: 'couponMoneyAsPrice',
                            value: 1,
                            familyId
                        });
                    }
                }
               
            }

            // 商品数量
            if (this.model.type == 'favourable') {
                let appointAmountVal = form[`appointAmount`];
                if (appointAmountVal) {
                    actions.push({
                        key: 'amount',
                        value: form[`amount`],
                        familyId
                    });
                }
            } else {
                actions.push({
                    key: 'amount',
                    value: form[`amount`],
                    familyId
                });
            }
            // 折扣后取整方式
            actions.push({
                key: 'decimalRoundMode',
                value: form[`decimalRoundMode`],
                familyId
            });

            // 执行方法名称 兑换券：ExchangeCouponFunction 优惠券：CouponModifyPriceFunction
            actions.forEach((item) => {
                item[`opUniqueName`] = this.model.type == 'favourable' ? 'CouponModifyPriceFunction' : 'ExchangeCouponFunction';
            });

            this.ruleChild.ruleConditions = ruleConditions;
            this.ruleChild.actions = actions;
            let containTypeVal = this.ruleChild.bizPropertyMap.containSaleItemType;
            let _containType = type == 'films' ? '0' : '1';
            if (!containTypeVal.includes(_containType)) {
                this.ruleChild.bizPropertyMap.containSaleItemType += containTypeVal == '' ? _containType : `,${_containType}`;
            }
            saleListUtil.setRuleTable(form, type, familyId,this);

            this.restForm();
        },
       
        /**
         * @function ruleTime - 格式化时间
         * @param {Object} time - 时间
         * @param {String} [type='time'] - 可选参数,格式化类型 时分 
         */
        ruleTime(time, type) {
            let _time = new Date(time);

            let _year = _time.getFullYear(),
                _mounth = _time.getMonth() + 1,
                _day = _time.getDate(),
                _hours = _time.getHours(),
                _minutes = _time.getMinutes();

            let returnStr = `${_year}-${_mounth}-${_day}`;
            if (type == 'time') {
                returnStr = `${_hours}:${_minutes}`;
            }
            return returnStr;
        },

        /**
         * @function checkRuleItem - 查看子规则
         */
        checkRuleItem(param) {

            let familyId = param.familyId;

            // 取出对应faimlyId的ruleConditions和actions
            let conditionActions = saleListUtil.returnruleConditionsActions(this.ruleChild, familyId);

            // this.$store.commit('saleList/updateChildRule', {
            //     ruleChild: this.ruleChild
            // });
            
            // this.$store.commit('saleList/updateCheckRule', {
            //     checkRule: {
            //         enterQuery: this.enterQuery,
            //         conditionActions
            //     }
            // });
            
            
            let params = {
                type :  this.model.type,
                path :  'setRuleItem',
                ticketType :  param.type,
                data: conditionActions
            }
            // this.checkRuleItem.type = this.model.type
            // this.checkRuleItem.ticketType = param.type
            // this.checkRuleItem.data = conditionActions
            this.$refs['checkRuleItem'].openDialog(params)
            // this.$router.push({
            //     path: 'checkRuleItem',
            //     query: {
            //         type: this.model.type,
            //         path: 'setRuleItem',
            //         ticketType: param.type
            //     }
            // });
        },
        /**
         * @function editionRuleItem - 修改子规则
         */
        editionRuleItem(param) {
            // 设置当前状态为正在编辑中            
            this.addConfig.isEdition = true;

            // 备份
            this.ruleChildCopy = JSON.parse(JSON.stringify(this.ruleChild));
            this.tableDataCopy = JSON.parse(JSON.stringify(this.tableConfig.data));
            let c_type = param.type;
            let familyId = param.familyId
            // 取出对应faimlyId的ruleConditions和actions
            let conditionActionsObj = saleListUtil.returnruleConditionsActions(this.ruleChild, familyId);

            // 移除对应faimlyId的ruleConditions和actions,table数据
            this.ruleChild = this.removeruleConditionsActions(this.ruleChild, familyId);

            // 影片还是卖品 应该填充的form
            let modelType = this.model.type;
            let form = JSON.parse(JSON.stringify(this.addConfig.options[`${modelType}_${c_type}`]));

            // 拆解数据用于显示
            saleListUtil.unPackageAddForm(form, conditionActionsObj, c_type, false, this);
        },
        /**
         * @function deleteRuleItem - 删除子规则
         */
        deleteRuleItem(param) {
            let pointer = this 
            pointer.$confirm(`确定删除?`, '提示',{type:'warning'}).then(_ => {
                let familyId = param.familyId;
                // 移除对应faimlyId的ruleConditions和actions
                this.ruleChild = this.removeruleConditionsActions(this.ruleChild, familyId);
                }).catch(_ => {});
            
        },
        /**
         * @function removeruleConditionsActions - 移除对应faimlyId的ruleConditions和actions,table数据
         */
        removeruleConditionsActions(ruleChild, familyId) {
            // 移除当前table数据
            let tableData = this.tableConfig.data;
             for (let i = 0; i < tableData.length; i++) {
                let item = tableData[i];
                if (item.familyId == familyId) {
                    tableData.splice(i, 1);
                }
            }

            // 重置包含类型
            let typeArr = [];
            for (let i = 0; i < tableData.length; i++) {
                let item = tableData[i];
                if (item.type == 'goods' && !typeArr.includes(1)) {
                    typeArr.push(1);
                } else if (item.type == 'films' && !typeArr.includes(0)) {
                    typeArr.push(0);
                }
            }
            ruleChild.bizPropertyMap.containSaleItemType = typeArr.join(',');

           ;

            let ruleConditions = [];
            let actions = [];

            let _ruleConditions = ruleChild.ruleConditions;
            let _actions = ruleChild.actions;

            for (let i = 0; i < _ruleConditions.length; i++) {
                let item = JSON.parse(JSON.stringify(_ruleConditions[i]));
                if (item.familyId != familyId) {
                    ruleConditions.push(item);
                }
            }

            for (let i = 0; i < _actions.length; i++) {
                let item = JSON.parse(JSON.stringify(_actions[i]));

                // 减去对应加价金额
                if (item.familyId == familyId && item.key == 'addPriceValue') {
                    ruleChild.bizPropertyMap.totalAddPrice -= Number(item.value);
                }

                if (item.familyId != familyId) {
                    actions.push(item);
                }
            }

            ruleChild.ruleConditions = ruleConditions;
            ruleChild.actions = actions;

            return ruleChild;
        },
        /**
         * @function selectInputValue - 选择，调起弹窗
         * @param {String} inputName -  调起弹窗名
         */
        selectInputValue(inputName) {  
            console.log('打开弹窗名：',inputName,'回参：',this.addConfig.form[inputName].value)
            let value = this.addConfig.form[inputName].value
            let text  = this.addConfig.form[inputName].text
            let reviewList = []
            switch (inputName) {
                case 'showEffectCode': //放映效果
                    if (value && text) {
                        value.split(',').map((item) => { reviewList.push({ propertyCode: item, propertyName: "", reviewFlag: "review" }) });
                        text.split(',').map((item, index) => { reviewList[index].propertyName = item });
                    }
                    this.$refs[inputName].openDialog(true,reviewList)
                    break;
                case 'uniformCode': //影片名称
                    if (value && text) {
                        value.split(',').map((item) => { reviewList.push({ code: item, filmName: "", reviewFlag: "review" }) });
                        text.split(',').map((item, index) => { reviewList[index].filmName = item });
                    }
                    this.$refs[inputName].openDialog(true,reviewList)
                    break;
                case 'filmTypeKey': //影片类型
                     if (value && text) {
                        value.split(',').map((item) => { reviewList.push({ propertyCode: item, propertyName: "", reviewFlag: "review" }) });
                        text.split(',').map((item, index) => { reviewList[index].propertyName = item });
                    }
                    this.$refs[inputName].openDialog(true,reviewList)
                break;
                case 'hallTypeKey': //影厅类型
                    if (value && text) {
                        value.split(',').map((item) => { reviewList.push({ keyCode: item, keyName: "", reviewFlag: "review" }) });
                        text.split(',').map((item, index) => { reviewList[index].keyName = item });
                    }
                    this.$refs[inputName].openDialog(true,reviewList)
                break;
                default:
                    this.$refs[inputName].openDialog(true,value) //单选弹窗
                    this.innerData = this.addConfig.form[inputName].value
                break;
            }
        },
        /**
         * @function clearInputValue - 清空输入框
         * @param {String} inputName - 需要清空的输入框名
         * @param {String} [type='both'] 可选值传入既清空 text 和 value 否在只清空 value
         */
        clearInputValue(inputName, type) {
            if (type == 'both') {
                this.addConfig.form[`${inputName}`].text = '';
            }

            this.addConfig.form[`${inputName}`].value = '';
            console.log('清除input框数据',this.addConfig.form[`${inputName}`])
        },
        /**
         * @function changeInput - 修改输入框的值
         */
        changeInput(form,prop) {
            console.log(this.$refs[`${form}`],form,prop)
            this.$refs[`${form}`].validateField(`${prop}`)
        },
        /**
         * @param value = fix_price 固定金额 、subPrice 扣减金额 this.model.type=='goods'
         */
        priceModifyMethodChange(value) {
            console.log('调整金额方式---------',value)
            if( value == 'fix_price' || value == 'subPrice' ) {
                this.addConfig.form.priceRange = 'BetweenOperator'
            }
        },
        //调整零售价 change事件
        priceModifyValueChange(value) {
            if(this.addConfig.form.priceRange == 'BetweenOperator' && this.addConfig.form.priceStart!=''){
                this.$refs['addConfig'].validateField('priceStart')
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/css/element-reset.scss' ;
@each $marginType in left,
right,
top,
bottom {

    @each $margin in 5,
    10,
    15,
    20 {
        .margin-#{$marginType}-#{$margin} {
            margin-#{$marginType}: #{$margin}px;
        }
    }
}

@mixin font-base {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #666666;
    text-align: left;
}

.addPrice {
    @include font-base;
}

.rule-table {
    position: relative;

    .add-rule-btn {
        position: absolute;
        right: 10px;
        top: 7px;
        margin: auto;
    }
}

.rule-table-content {
    border: 1px solid #BCBCBC;

    .control-btn {
        margin-left: 0;
    }

    .rule-form {
        margin-top: 10px;
    }

    .add-form-title {
        @include font-base;
        margin-bottom: 15px;
        height: 32px;
        background: #F2F4FD;
    }

    .rule-title {
        color: #333333;
        margin-bottom: 15px;
        text-indent: 15px;
    }
}

.line {
    margin: 0 3px;
}

.second-title {
    @include font-base;
    color: #606266;
}

.tips-font {
    @include font-base;
    color: #606266;
}

.height40 {
    height: 40px;
}
</style>
