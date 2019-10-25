<template>
    <div class="add-group-default">
        <el-collapse v-model="activeNames">
            <el-form :model="basicDataForm" :rules="basicDataRule" ref="basicDataForm">
            <!-- 子活动基础信息 -->
            <el-collapse-item title="子活动基础信息" name="1">
                <el-form-item label="分组活动名称:" prop="activityName"  class="activity-name">
                    <el-input class="activity-name-title" v-model="basicDataForm.activityName" placeholder="请输入分组活动名称" :disabled="disabled"></el-input>
                </el-form-item>
            </el-collapse-item>
            <!-- 子活动适用条件 -->
            <el-collapse-item title="子活动适用条件" name="2">
                <div style="color:#666666;margin-bottom:20px;margin-top:10px">请选择该活动适用条件，可多选</div>
                <div class="box-title">子活动适用条件</div>
                <div class="box-content">
                    <div class="box-tabs">
                        <el-tabs v-model="activeName" tab-position="left" type="card">
                            <!-- 会员类 -->
                            <el-tab-pane label name="first">
                                <span slot="label">
                                    <span :class="(checkedMemberOption.length > 0)?'item-name-is-activity':'item-name-no-activity'">会员类</span>
                                    <i class="item-select-number" v-if="checkedMemberOption.length">{{checkedMemberOption.length}}</i>
                                </span>

                                <el-checkbox-group v-model="checkedMemberOption" @change="handleCheckedOption">
                                    <el-scrollbar style="height:500px;overflow-x: hidden;">
                                        <el-checkbox v-for="item in memberOptions" :label="item" :key="item.key" :value="item">{{item.value}}</el-checkbox>
                                    </el-scrollbar>
                                </el-checkbox-group>
                            </el-tab-pane>
                            <!-- 影票类 -->
                            <el-tab-pane name="second">
                                <span slot="label">
                                    <span :class="(checkedTicketsOption.length > 0)?'item-name-is-activity':'item-name-no-activity'">影票类</span>
                                    <i class="item-select-number" v-if="checkedTicketsOption.length">{{checkedTicketsOption.length}}</i>
                                </span>

                                <el-checkbox-group v-model="checkedTicketsOption" @change="handleCheckedOption">
                                    <el-checkbox v-for="item in movieTicketsOptions" :label="item" :key="item.key" :value="item">{{item.value}}</el-checkbox>
                                </el-checkbox-group>
                            </el-tab-pane>
                            <!-- 卖品类 -->
                            <el-tab-pane name="third">
                                <span slot="label">
                                    <span :class="(checkedGoodsOption.length > 0)?'item-name-is-activity':'item-name-no-activity'">卖品类</span>
                                    <i class="item-select-number" v-if="checkedGoodsOption.length">{{checkedGoodsOption.length}}</i>
                                </span>

                                <el-checkbox-group v-model="checkedGoodsOption" @change="handleCheckedOption">
                                    <el-checkbox v-for="item in goodsOptions" :label="item" :value="item" :key="item.key">{{item.value}}</el-checkbox>
                                </el-checkbox-group>
                            </el-tab-pane>
                            <!-- 交易类 -->
                            <el-tab-pane label name="fourth">
                                <span slot="label">
                                    <span :class="(checkedTradeOption.length > 0)?'item-name-is-activity':'item-name-no-activity'">交易类</span>
                                    <i class="item-select-number" v-if="checkedTradeOption.length">{{checkedTradeOption.length}}</i>
                                </span>

                                <el-checkbox-group v-model="checkedTradeOption" @change="handleCheckedOption">
                                    <el-scrollbar style="height:500px;overflow-x: hidden;">
                                        <el-checkbox v-for="item in tradeOptions" :label="item" :key="item.key" :value="item">{{item.value}}</el-checkbox>
                                    </el-scrollbar>
                                </el-checkbox-group>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <div class="box-cond">
                        <el-scrollbar style="height:500px">
                            <p  class="box-cond-info">
                                <span>已选活动条件（共{{selectedOptions.length}}项）：</span>    
                                <el-button v-if="selectedOptions.length" type="primary" class="clearBtn" plain @click="clearAllConditionHandle">清空</el-button> 
                            </p>
                            <div v-for="item of selectedOptions" :key="item.value" style="">
                                <!-- 会员类 -->
                                <el-form-item v-if="item.value=='生日'" label="生日：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="birthday7.opUniqueName">
                                                <el-select v-model="basicDataForm.birthday7.opUniqueName" :disabled="disabled" @change="handleChangeBirthday" placeholder="请选择">
                                                    <el-option label="等于当日" value="EqualCurrentDay"></el-option>
                                                    <el-option label="等于当月" value="EqualCurrentMoney"></el-option>
                                                    <el-option label="交易当月前后N月" value="EqualCurrentMonthOffset"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                    
                                        <div class="box-cond-item" v-if="basicDataForm.birthday7.opUniqueName=='EqualCurrentMonthOffset'">
                                            <el-form-item prop="birthday7.value">
                                                <el-input v-model="basicDataForm.birthday7.value" :disabled="disabled" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='年龄'" label="年龄：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="age9.opUniqueName">
                                                <el-select v-model="basicDataForm.age9.opUniqueName" :disabled="disabled" @change="handleChangeAge">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                    <el-option label="不等于" value="normalNotEqual"></el-option>
                                                    <el-option label="包含区间" value="BetweenOperator"></el-option>
                                                    <el-option label="不包含区间" value="not_BetweenOperator"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                    
                                        <div class="box-cond-item" v-if="basicDataForm.age9.opUniqueName!='' && basicDataForm.age9.opUniqueName!='BetweenOperator' && basicDataForm.age9.opUniqueName!='not_BetweenOperator'">
                                            <el-form-item prop="age9.value">    
                                                <el-input v-model="basicDataForm.age9.value" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item"  v-if="basicDataForm.age9.opUniqueName=='BetweenOperator' || basicDataForm.age9.opUniqueName=='not_BetweenOperator'">
                                            <div style="float:left;width:278px;">
                                                <el-row class="flex-base margin-bottom-22"  v-for="(item,index) in basicDataForm.ageRange" :key="index" >
                                                    <el-form-item :prop="'ageRange.'+index+'.minAge'" :rules="{required: true, validator: verificationAge, trigger: 'blur'}">
                                                        <el-input class="input-type-94" v-model="item.minAge" :disabled="disabled" placeholder="请输入"></el-input>
                                                    </el-form-item>

                                                    <span style="padding:0 8px;">-</span>

                                                    <el-form-item :prop="'ageRange.'+index+'.maxAge'" :rules="{required: true, validator: verificationAge, trigger: 'blur'}">
                                                        <el-input class="input-type-94" v-model="item.maxAge" :disabled="disabled" placeholder="请输入"></el-input>
                                                    </el-form-item>

                                                    <el-button size="small" class="deleteBtn" v-if="basicDataForm.ageRange.length!=1" type="text" @click="delAgeRange(index)">删除</el-button>
                                                </el-row>
                                            </div>

                                            <el-button size="small" type="text" @click="addAgeRange()" class="addBtn"  style="float:left;">
                                                <i class="el-icon-circle-plus-outline"></i>添加
                                            </el-button>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='性别'" label="性别：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="sex8.opUniqueName">
                                                <el-select v-model="basicDataForm.sex8.opUniqueName" :disabled="disabled">
                                                    <el-option label="包含" value="normalIn"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                
                                        <div class="box-cond-item" v-if="basicDataForm.sex8.opUniqueName!=''">
                                            <el-form-item prop="sexState">
                                                <el-select class="select-type-178" v-model="basicDataForm.sexState" multiple collapse-tags @change="handleSex" :title="basicDataForm.sexStateName.join(',')" clearable>
                                                    <el-option label="全选" value></el-option>
                                                    <el-option label="男" value="0"></el-option>
                                                    <el-option label="女" value="1"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='开卡日期'" label="开卡日期：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="openDate12.opUniqueName">
                                                <el-select v-model="basicDataForm.openDate12.opUniqueName" :disabled="disabled" @change="handleChangeOpenDate">
                                                    <el-option label="大于" value="TimeGreaterOperator"></el-option>
                                                    <el-option label="等于" value="TimeEqualOperator"></el-option>
                                                    <el-option label="小于" value="TimeLessOperator"></el-option>
                                                    <el-option label="大于等于" value="TimeGreaterEqualOperator"></el-option>
                                                    <el-option label="小于等于" value="TimeLessEqualOperator"></el-option>
                                                    <el-option label="不等于" value="not_TimeEqualOperator"></el-option>
                                                    <el-option label="包含区间" value="DateRangeContainOperator"></el-option>
                                                    <el-option label="不包含区间" value="not_DateRangeContainOperator"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.openDate12.opUniqueName!='DateRangeContainOperator'&&basicDataForm.openDate12.opUniqueName!='not_DateRangeContainOperator'&&basicDataForm.openDate12.opUniqueName!=''">
                                            <el-form-item prop="openDate12.value" v-if="basicDataForm.openDate12.opUniqueName!='DateRangeContainOperator'&&basicDataForm.openDate12.opUniqueName!='not_DateRangeContainOperator'&&basicDataForm.openDate12.opUniqueName!=''">
                                                <el-date-picker v-model="basicDataForm.openDate12.value" style="width: 200px;"  type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :disabled="disabled"></el-date-picker>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item"  v-if="basicDataForm.openDate12.opUniqueName=='DateRangeContainOperator'||basicDataForm.openDate12.opUniqueName=='not_DateRangeContainOperator'">
                                            <div style="float:left;width:278px;">
                                                <el-row class="margin-bottom-22" v-for="(item,index) in basicDataForm.openCardDateOptions" :key="index">
                                                    <el-form-item  :prop="'openCardDateOptions.'+index+'.openCardDateOption'" :rules="{required: true, message: '开卡日期不能为空', trigger: 'blur'}">
                                                        <el-date-picker class="date-type-210" v-model="item.openCardDateOption"  type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="disabled"></el-date-picker>
                                                        <el-button size="small" class="deleteBtn" type="text"  v-if="basicDataForm.openCardDateOptions.length!=1" @click="delOpenCardDate(index)">删除</el-button>
                                                    </el-form-item>
                                                </el-row>
                                            </div>

                                            <div class="addBtn" @click="addOpenCardDate">
                                                <i class="el-icon-circle-plus-outline"></i>添加日期
                                            </div>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='开卡月限'" label="开卡月限：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="openMonths87.opUniqueName">
                                                <el-select v-model="basicDataForm.openMonths87.opUniqueName" :disabled="disabled"  @change="handleChangeOpenMonths">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                    <el-option label="不等于" value="normalNotEqual"></el-option>
                                                    <el-option label="包含区间" value="BetweenOperator"></el-option>
                                                    <el-option label="不包含区间" value="not_BetweenOperator"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item"  v-if="basicDataForm.openMonths87.opUniqueName!='' && basicDataForm.openMonths87.opUniqueName!='BetweenOperator' && basicDataForm.openMonths87.opUniqueName!='not_BetweenOperator'">
                                            <el-form-item prop="openMonths87.value">
                                                <el-input
                                                    v-model="basicDataForm.openMonths87.value"
                                                    :disabled="disabled"
                                                    placeholder="请输入"
                                                ></el-input>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.openMonths87.opUniqueName=='BetweenOperator' || basicDataForm.openMonths87.opUniqueName=='not_BetweenOperator'">
                                            <div style="float:left;width:278px;">
                                                <el-row class="flex-base margin-bottom-22"  v-for="(item,index) in basicDataForm.openMonthsRange" :key="index">
                                                    <el-form-item :prop="'openMonthsRange.'+index+'.minMonth'" :rules="{required: true, validator: verificationOpenMonths, trigger: 'blur'}">
                                                        <el-input class="input-type-96" v-model="item.minMonth" :disabled="disabled" placeholder="请输入"></el-input>
                                                    </el-form-item>

                                                    <span style="padding:0 8px;">-</span>

                                                    <el-form-item :prop="'openMonthsRange.'+index+'.maxMonth'" :rules="{required: true, validator: verificationOpenMonths, trigger: 'blur'}">
                                                        <el-input class="input-type-96" v-model="item.maxMonth" :disabled="disabled" placeholder="请输入"></el-input>
                                                    </el-form-item>

                                                    <el-button size="small" type="text" class="deleteBtn" v-if="basicDataForm.openMonthsRange.length!=1" @click="delOpenMonthsRange(index)">删除</el-button>
                                                </el-row>
                                            </div>

                                            <el-button size="small" class="addBtn" type="text" @click="addOpenMonthsRange()"  style="float:left;">
                                                <i class="el-icon-circle-plus-outline"></i>添加
                                            </el-button>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='开卡年限'" label="开卡年限：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="openYears11.opUniqueName">
                                                <el-select v-model="basicDataForm.openYears11.opUniqueName" :disabled="disabled" @change="handleChangeOpenYears">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                    <el-option label="不等于" value="normalNotEqual"></el-option>
                                                    <el-option label="包含区间" value="BetweenOperator"></el-option>
                                                    <el-option label="不包含区间" value="not_BetweenOperator"></el-option>
                                                </el-select>
                                            </el-form-item> 
                                        </div>
                            
                                        <div class="box-cond-item" v-if="basicDataForm.openYears11.opUniqueName!='' && basicDataForm.openYears11.opUniqueName!='BetweenOperator' && basicDataForm.openYears11.opUniqueName!='not_BetweenOperator'">
                                            <el-form-item prop="openYears11.value">
                                                <el-input
                                                    v-model="basicDataForm.openYears11.value"
                                                    :disabled="disabled"
                                                    placeholder="请输入"
                                                ></el-input>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item"  v-if="basicDataForm.openYears11.opUniqueName=='BetweenOperator' || basicDataForm.openYears11.opUniqueName=='not_BetweenOperator'">
                                            <div style="float:left;width:278px;">
                                                <el-row class="flex-base margin-bottom-22"  v-for="(item,index) in basicDataForm.openCardYearsRange" :key="index">
                                                    <el-form-item :prop="'openCardYearsRange.'+index+'.minYear'" :rules="{required: true, validator: verificationYears, trigger: 'blur'}">
                                                        <el-input class="input-type-96" v-model="item.minYear" :disabled="disabled" placeholder="请输入"></el-input>
                                                    </el-form-item>

                                                    <span style="padding:0 8px;">-</span>

                                                    <el-form-item :prop="'openCardYearsRange.'+index+'.maxYear'" :rules="{required: true, validator: verificationYears, trigger: 'blur'}">
                                                        <el-input class="input-type-96" v-model="item.maxYear" :disabled="disabled" placeholder="请输入"></el-input>
                                                    </el-form-item>

                                                    <el-button size="small" type="text" class="deleteBtn" v-if="basicDataForm.openCardYearsRange.length!=1" @click="delOpenCardYearsRange(index)">删除</el-button>
                                                </el-row>
                                            </div>

                                            <el-button size="small" class="addBtn" type="text" @click="addOpenCardYearsRange()" style="float:left;">
                                                <i class="el-icon-circle-plus-outline"></i>添加
                                            </el-button>
                                        </div>
                                    </el-row>
                                </el-form-item>
                                
                                <el-form-item v-if="item.value=='注册影院'" label="注册影院：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="registerBusinessCode13.opUniqueName">
                                                <el-select v-model="basicDataForm.registerBusinessCode13.opUniqueName" :disabled="disabled">
                                                    <el-option label="包含" value="normalIn"></el-option>
                                                    <el-option label="不包含" value="normalNotIn"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.registerBusinessCode13.opUniqueName=='normalIn'||basicDataForm.registerBusinessCode13.opUniqueName=='normalNotIn'">
                                            <el-form-item prop="registerBusinessCode13.text">
                                                <el-input class="input-dialog" v-model="basicDataForm.registerBusinessCode13.text" readonly></el-input>
                                                <i class="el-icon-close close-btn" v-show="basicDataForm.registerBusinessCode13.text" @click="clearInputValue('registerBusinessCode13')"></i>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.registerBusinessCode13.opUniqueName=='normalIn'||basicDataForm.registerBusinessCode13.opUniqueName=='normalNotIn'">
                                            <el-button  type="primary" class="dialogBtn" @click="cinemaClick('cinemaRegisterDialog',{value:basicDataForm.registerBusinessCode13.value,text:basicDataForm.registerBusinessCode13.text})" plain>选择</el-button>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='账户余额'" label="账户余额：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="balance3.opUniqueName">
                                                <el-select v-model="basicDataForm.balance3.opUniqueName" :disabled="disabled">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                    <el-option label="不等于" value="normalNotEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.balance3.opUniqueName!=''">
                                            <el-form-item prop="balance3.value" >
                                                <el-input v-model="basicDataForm.balance3.value" :disabled="disabled" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='积分余额'" label="积分余额：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="integral4.opUniqueName">
                                                <el-select v-model="basicDataForm.integral4.opUniqueName" :disabled="disabled">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                    <el-option label="不等于" value="normalNotEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.integral4.opUniqueName!=''">
                                            <el-form-item prop="integral4.value" >
                                                <el-input v-model="basicDataForm.integral4.value" :disabled="disabled" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='累计积分'" label="累计积分：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="integralTotall52.opUniqueName">
                                                <el-select v-model="basicDataForm.integralTotall52.opUniqueName" :disabled="disabled">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                    <el-option label="不等于" value="normalNotEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.integralTotall52.opUniqueName!=''">
                                            <el-form-item prop="integralTotall52.value">
                                                <el-input v-model="basicDataForm.integralTotall52.value" :disabled="disabled" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='单次消费金额'" label="单次消费金额：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="sumPrice2.opUniqueName">
                                                <el-select v-model="basicDataForm.sumPrice2.opUniqueName" :disabled="disabled">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                    <el-option label="不等于" value="normalNotEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.sumPrice2.opUniqueName!=''">
                                            <el-form-item prop="sumPrice2.value">
                                                <el-input v-model="basicDataForm.sumPrice2.value" :disabled="disabled" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='累计消费金额'" label="累计消费金额：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="consumeSum6.opUniqueName">
                                                <el-select v-model="basicDataForm.consumeSum6.opUniqueName" :disabled="disabled">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                    <el-option label="不等于" value="normalNotEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.consumeSum6.opUniqueName!=''">
                                            <el-form-item prop="consumeSum6.value">
                                                <el-input v-model="basicDataForm.consumeSum6.value" :disabled="disabled" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='会员卡类型'" label="会员卡类型：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="cardTypeKey10.opUniqueName">
                                                <el-select v-model="basicDataForm.cardTypeKey10.opUniqueName" :disabled="disabled">
                                                    <el-option label="包含" value="normalIn"></el-option>
                                                    <el-option label="不包含" value="normalNotIn"></el-option> 
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item"  v-if="basicDataForm.cardTypeKey10.opUniqueName=='normalIn'||basicDataForm.cardTypeKey10.opUniqueName=='normalNotIn'">
                                            <el-form-item prop="cardTypeKey10.text">
                                                <el-input class="input-dialog" v-model="basicDataForm.cardTypeKey10.text" readonly></el-input>
                                                <i class="el-icon-close close-btn" v-show="basicDataForm.cardTypeKey10.text" @click="clearInputValue('cardTypeKey10')"></i>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item"  v-if="basicDataForm.cardTypeKey10.opUniqueName=='normalIn'||basicDataForm.cardTypeKey10.opUniqueName=='normalNotIn'">
                                            <el-button class="dialogBtn" @click="cardTypeKeyClick('crmCardTypeDialog',{value:basicDataForm.cardTypeKey10.value,text:basicDataForm.cardTypeKey10.text})" type="primary" plain>选择</el-button>
                                        </div>
                                    </el-row>
                                </el-form-item>
                                
                                <el-form-item v-if="item.value=='会员卡政策'" label="会员卡政策：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="cardRightCode100.opUniqueName">
                                                <el-select v-model="basicDataForm.cardRightCode100.opUniqueName" :disabled="disabled" @change="handleChangeCardRightCode">
                                                    <el-option label="包含" value="normalIn"></el-option>
                                                    <el-option label="不包含" value="normalNotIn"></el-option> 
                                                    <el-option label="全部卡政策" value="AllMember"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                    
                                        <div class="box-cond-item" v-if="basicDataForm.cardRightCode100.opUniqueName=='normalIn' || basicDataForm.cardRightCode100.opUniqueName=='normalNotIn'">
                                            <el-form-item prop="cardRightCode100.text">
                                                <el-input class="input-dialog" v-model="basicDataForm.cardRightCode100.text" readonly></el-input>
                                                <i class="el-icon-close close-btn" v-show="basicDataForm.cardRightCode100.text" @click="clearInputValue('cardRightCode100')"></i>
                                            </el-form-item>
                                        </div>
                                    
                                        <div class="box-cond-item" v-if="basicDataForm.cardRightCode100.opUniqueName=='normalIn' || basicDataForm.cardRightCode100.opUniqueName=='normalNotIn'">
                                            <el-button type="primary" class="dialogBtn" @click="cardPolicyClick('crmCardPolicyDialog',{text:basicDataForm.cardRightCode100.text,value:basicDataForm.cardRightCode100.value})" plain>选择</el-button>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='会员等级'" label="会员等级：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="customerLevelCode101.opUniqueName">
                                                <el-select v-model="basicDataForm.customerLevelCode101.opUniqueName" :disabled="disabled" @change="handleChangeCustomerLevelCode">
                                                    <el-option label="包含" value="normalIn"></el-option>
                                                    <el-option label="不包含" value="normalNotIn"></el-option> 
                                                    <el-option label="非会员" value="not_memberOperator"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item"  v-if="basicDataForm.customerLevelCode101.opUniqueName=='normalIn'||basicDataForm.customerLevelCode101.opUniqueName=='normalNotIn'">
                                            <el-form-item prop="customerLevelCode101.text">
                                                <el-input class="input-dialog" v-model="basicDataForm.customerLevelCode101.text" readonly></el-input>
                                                <i class="el-icon-close close-btn" v-show="basicDataForm.customerLevelCode101.text" @click="clearInputValue('customerLevelCode101')"></i>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.customerLevelCode101.opUniqueName=='normalIn'||basicDataForm.customerLevelCode101.opUniqueName=='normalNotIn'">
                                            <el-button class="dialogBtn" @click="membershipLevelClick('crmMemberLevelDialog',{text:basicDataForm.customerLevelCode101.text,value:basicDataForm.customerLevelCode101.value})" type="primary" plain>选择</el-button>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='首充金额'" label="首充金额：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="firstRecharge98.opUniqueName">
                                                <el-select v-model="basicDataForm.firstRecharge98.opUniqueName" :disabled="disabled">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                    <el-option label="不等于" value="normalNotEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.firstRecharge98.opUniqueName!=''">
                                            <el-form-item prop="firstRecharge98.value">
                                                <el-input v-model="basicDataForm.firstRecharge98.value" :disabled="disabled" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='单次充值金额'" label="单次充值金额：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="sumPrice1.opUniqueName">
                                                <el-select v-model="basicDataForm.sumPrice1.opUniqueName" :disabled="disabled">
                                                    <el-option label="大于" value="customGreater"></el-option>
                                                    <el-option label="等于" value="customEqual"></el-option>
                                                    <el-option label="小于" value="customLess"></el-option>
                                                    <el-option label="小于等于" value="customLessEqual"></el-option>
                                                    <el-option label="大于等于" value="customGreaterEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.sumPrice1.opUniqueName!=''">
                                            <el-form-item prop="sumPrice1.value">
                                                <el-input class="input-type-94" v-model="basicDataForm.sumPrice1.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                <span>元</span>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='累计充值金额'" label="累计充值金额：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="chargeSum50.opUniqueName">
                                                <el-select v-model="basicDataForm.chargeSum50.opUniqueName" :disabled="disabled">
                                                    <el-option label="大于" value="customGreater"></el-option>
                                                    <el-option label="等于" value="customEqual"></el-option>
                                                    <el-option label="小于" value="customLess"></el-option>
                                                    <el-option label="小于等于" value="customLessEqual"></el-option>
                                                    <el-option label="大于等于" value="customGreaterEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.chargeSum50.opUniqueName!=''">
                                            <el-form-item prop="chargeSum50.value">
                                                <el-input class="input-type-94" v-model="basicDataForm.chargeSum50.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                <span>元</span>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <!-- <el-form-item v-if="item.value=='动态周期消费次数'" label>
                                    <el-form-item label="动态周期">
                                        <el-row>
                                            <el-col :span="8">
                                                <el-select v-model="basicDataForm.consumeNum.dynamicPeriod15.opUniqueName" :disabled="disabled">
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="10">
                                                <el-form-item prop="consumeNum.dynamicPeriod15.value">
                                                    <el-select v-model="basicDataForm.consumeNum.dynamicPeriod15.value" :disabled="disabled">
                                                        <el-option label="当日" value="CurrentDay"></el-option>
                                                        <el-option label="当月" value="CurrentMonth"></el-option>
                                                        <el-option label="当季" value="CurrentSeason"></el-option>
                                                        <el-option label="当年" value="CurrentYear"></el-option>
                                                        <el-option label="指定周期" value="AppointDayRange"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>  

                                    <el-form-item label="指定周期">
                                        <el-row>
                                            <el-col :span="8">
                                                <el-select v-model="basicDataForm.consumeNum.appointPeriod15.opUniqueName" :disabled="disabled">
                                                    <el-option label="不限" value></el-option>
                                                    <el-option label="包含区间" value="AppointDateEqual"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="12">
                                                <div v-if="basicDataForm.consumeNum.appointPeriod15.opUniqueName=='AppointDateEqual'">
                                                    <el-form-item label v-for="(item,index) in basicDataForm.appointPeriodOptions" :key="index">
                                                        <el-row>
                                                            <el-form-item :prop="'appointPeriodOptions.'+index+'.appointPeriodOption'" :rules="{required: true, message: '指定周期不能为空', trigger: 'blur'}">
                                                                <el-date-picker v-model="item.appointPeriodOption" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="disabled"></el-date-picker>
                                                                <el-button size="small" type="text" @click="delAppointPeriod(index)">删除</el-button>
                                                            </el-form-item>
                                                        </el-row>
                                                    </el-form-item>

                                                    <el-form-item label>
                                                        <div class="addDate" @click="addAppointPeriod">
                                                            <i class="el-icon-circle-plus-outline"></i>添加周期
                                                        </div>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="交易渠道">
                                        <el-row>
                                            <el-col :span="8">
                                                <el-select v-model="basicDataForm.consumeNum.consumeWayCode15.opUniqueName" :disabled="disabled">
                                                    <el-option label="不限" value></el-option>
                                                    <el-option label="包含" value="DynamicInEqual"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="10">
                                                <el-form-item prop="consumeWayState" v-if="basicDataForm.consumeNum.consumeWayCode15.opUniqueName!=''">
                                                    <el-select v-model="basicDataForm.consumeWayState" multiple collapse-tags @change="handleChangeConsumeWayState" :title="basicDataForm.consumeWayStateName.join(',')" >
                                                        <el-option label="全选" value></el-option>
                                                        <el-option label="柜台" value="0"></el-option>
                                                        <el-option label="自助终端" value="1"></el-option>
                                                        <el-option label="官方网站" value="2"></el-option>
                                                        <el-option label="手机APP" value="3"></el-option>
                                                        <el-option label="电话" value="4"></el-option>
                                                        <el-option label="微信" value="5"></el-option>
                                                        <el-option label="第三方渠道" value="T"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-form-item> 

                                    <el-form-item label="消费次数">
                                        <el-row>
                                            <el-col :span="8">
                                                <el-select v-model="basicDataForm.consumeNum.dynamicConsumeCount15.opUniqueName" :disabled="disabled" >
                                                    <el-option label="不限" value></el-option>
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                    <el-option label="不等于" value="normalNotEqual"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="10">
                                                <el-form-item prop="consumeNum.dynamicConsumeCount15.value" v-if="basicDataForm.consumeNum.dynamicConsumeCount15.opUniqueName!=''">
                                                    <el-input v-model="basicDataForm.consumeNum.dynamicConsumeCount15.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-form-item> 
                                </el-form-item> -->

                                <!-- <el-form-item v-if="item.value=='动态周期消费额'" label>
                                    <el-form-item label="动态周期">
                                        <el-row>
                                            <el-col :span="8">
                                                <el-select v-model="basicDataForm.cycleConsumeNum.dynamicPeriod17.opUniqueName" :disabled="disabled">
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="10">
                                                <el-form-item prop="cycleConsumeNum.dynamicPeriod17.value">
                                                    <el-select v-model="basicDataForm.cycleConsumeNum.dynamicPeriod17.value" :disabled="disabled">
                                                        <el-option label="当日" value="CurrentDay"></el-option>
                                                        <el-option label="当月" value="CurrentMonth"></el-option>
                                                        <el-option label="当季" value="CurrentSeason"></el-option>
                                                        <el-option label="当年" value="CurrentYear"></el-option>
                                                        <el-option label="指定周期" value="AppointDayRange"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="指定周期">
                                        <el-row>
                                            <el-col :span="8">
                                                <el-select v-model="basicDataForm.cycleConsumeNum.appointPeriod17.opUniqueName" :disabled="disabled">
                                                    <el-option label="不限" value></el-option>
                                                    <el-option label="包含区间" value="AppointDateEqual"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="12">
                                                <div v-if="basicDataForm.cycleConsumeNum.appointPeriod17.opUniqueName=='AppointDateEqual'">
                                                    <el-form-item label v-for="(item,index) in basicDataForm.appointPeriodOptions17" :key="index">
                                                        <el-row>
                                                            <el-form-item :prop="'appointPeriodOptions17.'+index+'.appointPeriodOption17'" :rules="{required: true, message: '指定周期不能为空', trigger: 'blur'}">
                                                                <el-date-picker v-model="item.appointPeriodOption17" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="disabled"></el-date-picker>
                                                                <el-button size="small" type="text" @click="delAppointPeriod17(index)">删除</el-button>
                                                            </el-form-item>
                                                        </el-row>
                                                    </el-form-item>

                                                    <el-form-item label>
                                                        <div class="addDate" @click="addAppointPeriod17">
                                                            <i class="el-icon-circle-plus-outline"></i>添加周期
                                                        </div>
                                                    </el-form-item>
                                                </div>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="交易渠道">
                                        <el-row>
                                            <el-col :span="8">
                                                <el-select v-model="basicDataForm.cycleConsumeNum.consumeWayCode17.opUniqueName" :disabled="disabled">
                                                    <el-option label="不限" value></el-option>
                                                    <el-option label="包含" value="DynamicInEqual"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="10">
                                                <el-form-item prop="cycleConsumeWayState" v-if="basicDataForm.cycleConsumeNum.consumeWayCode17.opUniqueName!=''">
                                                    <el-select v-model="basicDataForm.cycleConsumeWayState" multiple collapse-tags @change="handleChangeCycleConsumeWayState" :title="basicDataForm.cycleConsumeWayStateName.join(',')" >
                                                        <el-option label="全选" value></el-option>
                                                        <el-option label="柜台" value="0"></el-option>
                                                        <el-option label="自助终端" value="1"></el-option>
                                                        <el-option label="官方网站" value="2"></el-option>
                                                        <el-option label="手机APP" value="3"></el-option>
                                                        <el-option label="电话" value="4"></el-option>
                                                        <el-option label="微信" value="5"></el-option>
                                                        <el-option label="第三方渠道" value="T"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="商品类型">
                                        <el-row>
                                            <el-col :span="8">
                                                <el-select v-model="basicDataForm.cycleConsumeNum.saleItemType17.opUniqueName" :disabled="disabled">
                                                    <el-option label="不限" value></el-option>
                                                    <el-option label="包含" value="normalIn"></el-option>
                                                    <el-option label="不包含" value="normalNotIn"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="10">
                                                <el-form-item prop="goodsItemTypeState" v-if="basicDataForm.cycleConsumeNum.saleItemType17.opUniqueName!=''">
                                                    <el-select v-model="basicDataForm.goodsItemTypeState" multiple collapse-tags @change="handleChangeGoodsItemType" :title="basicDataForm.goodsItemTypeStateName.join(',')" >
                                                        <el-option label="全选" value></el-option>
                                                        <el-option label="卖品" value="1"></el-option>
                                                        <el-option label="电影票" value="0"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="动态周期消费额">
                                        <el-row>
                                            <el-col :span="8">
                                                <el-select v-model="basicplanStartTimeDataForm.cycleConsumeNum.dynamicConsumeSum17.opUniqueName" :disabled="disabled" >
                                                    <el-option label="不限" value></el-option>
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                    <el-option label="不等于" value="normalNotEqual"></el-option>
                                                </el-select>
                                            </el-col>
                                            <el-col :span="10">
                                                <el-form-item prop="cycleConsumeNum.dynamicConsumeSum17.value" v-if="basicDataForm.cycleConsumeNum.dynamicConsumeSum17.opUniqueName!=''">
                                                    <el-input v-model="basicDataForm.cycleConsumeNum.dynamicConsumeSum17.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-form-item> 
                                </el-form-item> -->

                                <!--影票类 -->
                                <el-form-item v-if="item.value=='影片'" label="影片：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="uniformCode79.opUniqueName">
                                                <el-select v-model="basicDataForm.uniformCode79.opUniqueName" :disabled="disabled">
                                                    <el-option label="包含" value="normalIn"></el-option>
                                                    <el-option label="不包含" value="normalNotIn"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.uniformCode79.opUniqueName =='normalIn' || basicDataForm.uniformCode79.opUniqueName =='normalNotIn'">
                                            <el-form-item prop="uniformCode79.text">
                                                <el-input class="input-dialog" v-model="basicDataForm.uniformCode79.text" ></el-input>
                                                <i class="el-icon-close close-btn" v-show="basicDataForm.uniformCode79.text" @click="clearInputValue('uniformCode79')"></i>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.uniformCode79.opUniqueName =='normalIn' || basicDataForm.uniformCode79.opUniqueName =='normalNotIn'">
                                            <el-button type="primary" class="dialogBtn" @click="filmClick({value:basicDataForm.uniformCode79.value,text:basicDataForm.uniformCode79.text})" plain>选择</el-button>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='影厅类型'" label="影厅类型：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="hallTypeKey36.opUniqueName">
                                                <el-select v-model="basicDataForm.hallTypeKey36.opUniqueName" :disabled="disabled">
                                                    <el-option label="包含" value="normalIn"></el-option>
                                                    <el-option label="不包含" value="normalNotIn"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.hallTypeKey36.opUniqueName =='normalIn' || basicDataForm.hallTypeKey36.opUniqueName =='normalNotIn'">
                                            <el-form-item prop="hallTypeKey36.text">
                                                <el-input class="input-dialog" v-model="basicDataForm.hallTypeKey36.text" readonly></el-input>
                                                <i class="el-icon-close close-btn" v-show="basicDataForm.hallTypeKey36.text" @click="clearInputValue('hallTypeKey36')"></i>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.hallTypeKey36.opUniqueName =='normalIn' || basicDataForm.hallTypeKey36.opUniqueName =='normalNotIn'">
                                            <el-button type="primary" class="dialogBtn" @click="cinemaTypeClick({value:basicDataForm.hallTypeKey36.value,text:basicDataForm.hallTypeKey36.text})" plain>选择</el-button>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='影片类型'" label="影片类型：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="filmTypeKey34.opUniqueName">
                                                <el-select v-model="basicDataForm.filmTypeKey34.opUniqueName" :disabled="disabled">
                                                    <el-option label="包含" value="stringSplitContainOneOperator"></el-option>
                                                    <el-option label="不包含" value="notStringSplitContainOneOperator"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.filmTypeKey34.opUniqueName =='stringSplitContainOneOperator' || basicDataForm.filmTypeKey34.opUniqueName =='notStringSplitContainOneOperator'">
                                            <el-form-item prop="filmTypeKey34.text">
                                                <el-input class="input-dialog" v-model="basicDataForm.filmTypeKey34.text" readonly></el-input>
                                                <i class="el-icon-close close-btn" v-show="basicDataForm.filmTypeKey34.text" @click="clearInputValue('filmTypeKey34')"></i>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item"  v-if="basicDataForm.filmTypeKey34.opUniqueName =='stringSplitContainOneOperator' || basicDataForm.filmTypeKey34.opUniqueName =='notStringSplitContainOneOperator'">
                                            <el-button type="primary" class="dialogBtn" @click="filmTypeClick({value:basicDataForm.filmTypeKey34.value,text:basicDataForm.filmTypeKey34.text})" plain>选择</el-button>
                                        </div>
                                    </el-row>
                                </el-form-item>
                            
                                <el-form-item v-if="item.value=='放映效果'" label="放映效果：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="showEffect35.opUniqueName">
                                                <el-select v-model="basicDataForm.showEffect35.opUniqueName" :disabled="disabled">
                                                    <el-option label="包含" value="FieldStringIndexOf"></el-option>
                                                    <el-option label="不包含" value="notFieldStringIndexOf"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.showEffect35.opUniqueName =='FieldStringIndexOf'|| basicDataForm.showEffect35.opUniqueName =='notFieldStringIndexOf'">
                                            <el-form-item prop="showEffect35.text">
                                                <el-input class="input-dialog" v-model="basicDataForm.showEffect35.text" readonly></el-input>
                                                <i class="el-icon-close close-btn" v-show="basicDataForm.showEffect35.text" @click="clearInputValue('showEffect35')"></i>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.showEffect35.opUniqueName =='FieldStringIndexOf'|| basicDataForm.showEffect35.opUniqueName =='notFieldStringIndexOf'">
                                            <el-button type="primary" class="dialogBtn" @click="projectionEffectClick({text:basicDataForm.showEffect35.text,value:basicDataForm.showEffect35.value})" plain>选择</el-button>
                                        </div>
                                    </el-row>
                                </el-form-item>
<!-- 
                                <el-form-item v-if="item.value=='座位等级'" label="座位等级：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-select v-model="basicDataForm.seatGrade89.opUniqueName" :disabled="disabled">
                                                <el-option label="包含" value="normalIn"></el-option>
                                                <el-option label="不包含" value="normalNotIn"></el-option>
                                            </el-select>
                                        </div>

                                        <div class="box-cond-item">
                                            <el-form-item prop="seatLevelState">
                                                <el-select v-model="basicDataForm.seatLevelState" multiple collapse-tags @change="handleChangeSeatLevel" :title="basicDataForm.seatLevelStateName.join(',')" clearable>
                                                    <el-option label="全选" value></el-option>
                                                    <el-option v-for="(item,index) in 10" :key="index" :label="index" :value="index"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item> -->

                                <el-form-item v-if="item.value=='放映厅座位数'" label="放映厅座位数：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="hallSeatAmout37.opUniqueName">
                                                <el-select v-model="basicDataForm.hallSeatAmout37.opUniqueName" :disabled="disabled">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                    <el-option label="不等于" value="normalNotEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.hallSeatAmout37.opUniqueName!=''">
                                            <el-form-item prop="hallSeatAmout37.value">
                                                <el-input v-model="basicDataForm.hallSeatAmout37.value" :disabled="disabled" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='最低发行价'" label="最低发行价：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="lowestPrice38.opUniqueName">
                                                <el-select v-model="basicDataForm.lowestPrice38.opUniqueName" :disabled="disabled">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                    <el-option label="不等于" value="normalNotEqual"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.lowestPrice38.opUniqueName!=''">
                                            <el-form-item prop="lowestPrice38.value">
                                                <el-input class="input-type-94" v-model="basicDataForm.lowestPrice38.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                <span>元</span>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='放映有效期'" label="放映有效期：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="planStartTime81.opUniqueName">
                                                <el-select v-model="basicDataForm.planStartTime81.opUniqueName" :disabled="disabled" @change="handleScreeningValidityChange">
                                                    <el-option label="包含范围" value="TimeBetweenOperator"></el-option>
                                                    <el-option label="包含每月指定日" value="DayContainOperator"></el-option>
                                                    <el-option label="不包含每月指定日" value="not_DayContainOperator"></el-option>
                                                </el-select>
                                            </el-form-item> 
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.planStartTime81.opUniqueName=='DayContainOperator'||basicDataForm.planStartTime81.opUniqueName=='not_DayContainOperator'">
                                            <el-form-item prop="planStartTime81.value">
                                                <el-input v-model="basicDataForm.planStartTime81.value" :disabled="disabled"></el-input> 
                                            </el-form-item> 
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.planStartTime81.opUniqueName=='TimeBetweenOperator'">
                                            <el-form-item prop="screeningValidityOption">
                                                <el-date-picker class="date-type-210" v-model="basicDataForm.screeningValidityOption" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="disabled" @change="setScreeningValidity"></el-date-picker>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='放映星期范围'" label="放映星期范围：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="filmPlanWeekRange83.opUniqueName">
                                                <el-select v-model="basicDataForm.filmPlanWeekRange83.opUniqueName" :disabled="disabled"  @change="handleChangeFilmPlanWeekRange">
                                                    <el-option label="周一到周五" value="WeekDateOperator"></el-option>
                                                    <el-option label="指定星期范围" value="WeekDateRangeOperator"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.filmPlanWeekRange83.opUniqueName =='WeekDateRangeOperator'">
                                            <el-form-item prop="weekRangeState">
                                                <el-select v-model="basicDataForm.weekRangeState" multiple collapse-tags @change="handleChangeweekRange" :title="basicDataForm.weekRangeStateName.join(',')" clearable>
                                                    <el-option label="全选" value></el-option>
                                                    <el-option v-for="item in weekOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='放映排除日期'" label="放映排除日期：">
                                    <div class="box-cond-item">
                                        <el-checkbox-group v-model="basicDataForm.excludeDate" :disabled="disabled" @change="handleChangeExcludeDate">
                                            <el-row>
                                                <el-checkbox :label="'节假日除外'" name="excludeDate">节假日除外</el-checkbox>
                                                <el-checkbox :label="'指定排除日期范围'" name="excludeDate">指定排除日期范围</el-checkbox>
                                            </el-row>
                                        </el-checkbox-group>
                                    </div>

                                    <div class="box-cond-item" v-if="basicDataForm.excludeDate.indexOf('指定排除日期范围')!=-1">
                                        <div style="float:left;width:278px;padding-left:20px;">
                                            <el-row class="flex-base margin-bottom-22" v-for="(item,index) in basicDataForm.excludeDateOptions" :key="index">
                                                <el-form-item :prop="'excludeDateOptions.'+index+'.excludeDateOption'" :rules="{required: true, message: '放映排除日期不能为空', trigger: 'change'}">
                                                    <el-date-picker class="date-type-210" v-model="item.excludeDateOption" :picker-options="pickerOptions" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" :disabled="disabled" @change="setExcludeDate"></el-date-picker>
                                                    <el-button size="small" class="deleteBtn" type="text" v-if="basicDataForm.excludeDateOptions.length!=1" @click="delExcludeDate(index)">删除</el-button>
                                                </el-form-item>
                                            </el-row>
                                        </div>

                                        <div class="addBtn" @click="addExcludeDate" style="float:left;">
                                            <i class="el-icon-circle-plus-outline"></i>添加日期
                                        </div>
                                    </div>
                                </el-form-item>

                                <el-form-item v-if="item.value=='放映时段范围'" label="放映时段范围：">
                                    <div class="box-cond-item">
                                        <el-form-item prop="filmPlanTimeRange84.opUniqueName">
                                            <el-select v-model="basicDataForm.filmPlanTimeRange84.opUniqueName" @change="handleFilmPlanTime" :disabled="disabled">
                                                <el-option label="上午09:00-12:59" value="MorningOperator"></el-option>
                                                <el-option label="下午13:00-16:59" value="AfternoonOperator"></el-option>
                                                <el-option label="晚上17:00-02:00" value="NightOperator"></el-option>
                                                <el-option label="指定时段范围" value="TimeRangeContainOperator"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </div>

                                    <div class="box-cond-item" v-if="basicDataForm.filmPlanTimeRange84.opUniqueName=='TimeRangeContainOperator'">
                                        <div style="float:left;width:278px;">
                                            <el-row class="flex-base margin-bottom-22"  v-for="(item,index) in basicDataForm.screeningPeriodOptions" :key="index">
                                                <el-form-item :prop="'screeningPeriodOptions.'+index+'.screeningPeriodOption'" :rules="{required: true, message: '放映时段范围不能为空', trigger: 'change'}">
                                                    <el-time-picker class="date-type-210" @change="setScreeningPeriod" is-range v-model="item.screeningPeriodOption" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" value-format="HH:mm" :disabled="disabled" style="float:left;" ></el-time-picker>
                                                    <el-button size="small" class="deleteBtn" type="text" v-if="basicDataForm.screeningPeriodOptions.length!=1" @click="delScreeningPeriod(index)">删除</el-button>
                                                </el-form-item>
                                            </el-row>
                                        </div>

                                        <div class="addBtn" @click="addScreeningPeriod" style="float:left;">
                                            <i class="el-icon-circle-plus-outline"></i>添加时间
                                        </div>
                                    </div>
                                </el-form-item>
                                
                                <!--卖品类 -->
                                <el-form-item v-if="item.value=='品牌'" label="品牌：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="brandId40.opUniqueName">
                                                <el-select v-model="basicDataForm.brandId40.opUniqueName" :disabled="disabled">
                                                    <el-option label="包含" value="normalIn"></el-option>
                                                    <el-option label="不包含" value="normalNotIn"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.brandId40.opUniqueName!=''">
                                            <el-form-item prop="brandId40.text">
                                                <el-input class="input-dialog" v-model="basicDataForm.brandId40.text" readonly></el-input>
                                                <i class="el-icon-close close-btn" v-show="basicDataForm.brandId40.text" @click="clearInputValue('brandId40')"></i>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.brandId40.opUniqueName!=''">
                                            <el-button type="primary" class="dialogBtn" @click="brandNameClick('selBrand',{text:basicDataForm.brandId40.text,value:basicDataForm.brandId40.value})" plain>选择</el-button>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='类别'" label="类别：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="classCode41.opUniqueName">
                                                <el-select v-model="basicDataForm.classCode41.opUniqueName" :disabled="disabled">
                                                    <el-option label="包含" value="normalIn"></el-option>
                                                    <el-option label="不包含" value="normalNotIn"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.classCode41.opUniqueName!=''">
                                            <el-form-item prop="classCode41.text">
                                                <el-input class="input-dialog" readonly v-model="basicDataForm.classCode41.text"></el-input>
                                                <i class="el-icon-close close-btn" v-show="basicDataForm.classCode41.text" @click="clearInputValue('classCode41')"></i>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.classCode41.opUniqueName!=''">
                                            <el-button type="primary" class="dialogBtn" v-if="basicDataForm.classCode41.opUniqueName!=''" @click="goodClassClick('goodClassDialog',{value:basicDataForm.classCode41.value})" plain>选择</el-button>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='商品名称'" label="商品名称：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="merKey46.opUniqueName">
                                                <el-select v-model="basicDataForm.merKey46.opUniqueName" :disabled="disabled">
                                                    <el-option label="包含" value="normalIn"></el-option>
                                                    <el-option label="不包含" value="normalNotIn"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.merKey46.opUniqueName!=''">
                                            <el-form-item prop="merKey46.text">
                                                <el-input class="input-dialog" readonly v-model="basicDataForm.merKey46.text" ></el-input>
                                                <i class="el-icon-close close-btn" v-show="basicDataForm.merKey46.text" @click="clearInputValue('merKey46')"></i>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.merKey46.opUniqueName!=''">
                                            <el-button type="primary" class="dialogBtn" @click="selectGoodsClick('tradeGoods',{value:basicDataForm.merKey46.value,text:basicDataForm.merKey46.text})" plain>{{basicDataForm.merKey46.value?'编辑':'选择'}}</el-button>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <!-- <el-form-item v-if="item.value=='店内码'" label="店内码">
                                    <el-row>
                                        <el-col :span="8">
                                            <el-select v-model="basicDataForm.merCode42.opUniqueName" :disabled="disabled" >
                                                <el-option label="不限" value></el-option>
                                                <el-option label="包含" value="normalIn"></el-option>
                                                <el-option label="不包含" value="normalNotIn"></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="10">
                                            <el-input v-if="basicDataForm.merCode42.opUniqueName!=''" v-model="basicDataForm.merCode42.value" :disabled="disabled" placeholder="请输入"></el-input>
                                        </el-col>
                                        <el-col :span="4"></el-col>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='国际条码'" label="国际条码">
                                    <el-row>
                                        <el-col :span="8">
                                            <el-select v-model="basicDataForm.merBarCode43.opUniqueName" :disabled="disabled" >
                                                <el-option label="不限" value></el-option>
                                                <el-option label="包含" value="normalIn"></el-option>
                                                <el-option label="不包含" value="normalNotIn"></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="10">
                                            <el-input v-if="basicDataForm.merBarCode43.opUniqueName!=''" v-model="basicDataForm.merBarCode43.value" :disabled="disabled" placeholder="请输入"></el-input>
                                        </el-col>
                                    </el-row>
                                </el-form-item> -->

                                <!-- 交易类 -->
                                <!-- <el-form-item v-if="item.value=='交易影院'" label="交易影院">
                                    <el-row>
                                        <el-col :span="8">
                                            <el-select v-model="basicDataForm.cinemaCode19.opUniqueName" :disabled="disabled">
                                                <el-option label="不限" value></el-option>
                                                <el-option label="包含" value="normalIn"></el-option>
                                                <el-option label="不包含" value="normalNotIn"></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-input v-if="basicDataForm.cinemaCode19.opUniqueName!=''" v-model="basicDataForm.cinemaCode19.text" readonly></el-input>
                                        </el-col>
                                        <el-col :span="3">
                                            <el-button v-if="basicDataForm.cinemaCode19.opUniqueName!=''" type="primary"  @click="cinemaClick('cinemaTradeDialog')" plain>选择</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item> -->

                                <el-form-item v-if="item.value=='交易影院行政区域'" label="交易影院行政区域：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="cinemaAreaId25.opUniqueName">
                                                <el-select v-model="basicDataForm.cinemaAreaId25.opUniqueName" :disabled="disabled">
                                                    <el-option label="包含" value="normalIn"></el-option>
                                                    <el-option label="不包含" value="normalNotIn"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item">
                                            <el-form-item prop="cinemaAreaId25.text" v-if="basicDataForm.cinemaAreaId25.opUniqueName!=''">
                                                <el-input class="input-dialog" v-model="basicDataForm.cinemaAreaId25.text" readonly></el-input>
                                                <i class="el-icon-close close-btn" v-show="basicDataForm.cinemaAreaId25.text" @click="clearInputValue('cinemaAreaId25')"></i>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item" v-if="basicDataForm.cinemaAreaId25.opUniqueName!=''">
                                            <el-button type="primary" class="dialogBtn" @click="orgStructureClick({value:basicDataForm.cinemaAreaId25.value})" plain>选择</el-button>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <!-- <el-form-item v-if="item.value=='交易渠道'" label="交易渠道">
                                    <el-row>
                                        <el-col :span="8">
                                            <el-select v-model="basicDataForm.consumeWayCode32.opUniqueName" :disabled="disabled">
                                                <el-option label="包含" value="normalIn"></el-option>
                                                <el-option label="不包含" value="normalNotIn"></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-input v-model="basicDataForm.consumeWayCode32.text" readonly></el-input>
                                        </el-col>
                                        <el-col :span="4">
                                            <el-button type="primary"  @click="handleChangeTradeChannel" plain>选择</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item> -->
                                <!-- <el-form-item v-if="item.value=='交易客商'" label="交易客商">
                                    <el-row>
                                        <el-col :span="8">
                                            <el-select v-model="basicDataForm.businessCode14.opUniqueName" :disabled="disabled">
                                                <el-option label="不限" value></el-option>
                                                <el-option label="包含" value="normalIn"></el-option>
                                                <el-option label="不包含" value="normalNotIn"></el-option>
                                            </el-select>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item prop="businessCode14.text" v-if="basicDataForm.businessCode14.opUniqueName!=''">
                                                <el-input v-model="basicDataForm.businessCode14.text" readonly></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="4">
                                            <el-button v-if="basicDataForm.businessCode14.opUniqueName!=''" type="primary"  @click="tradingMerchantClick" plain>选择</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item> -->

                                <!-- <el-form-item v-if="item.value=='交易类型'" label="交易类型：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-select v-model="basicDataForm.tradeType33.opUniqueName" :disabled="disabled">
                                                <el-option label="不限" value></el-option>
                                                <el-option label="包含" value="normalIn"></el-option>
                                                <el-option label="不包含" value="normalNotIn"></el-option>
                                            </el-select>
                                        </div>

                                        <div class="box-cond-item">
                                            <el-form-item prop="tradeTypeState" v-if="basicDataForm.tradeType33.opUniqueName!=''">
                                                <el-select v-model="basicDataForm.tradeTypeState" multiple collapse-tags @change="handleChangeTradeType" :title="basicDataForm.tradeTypeStateName.join(',')" clearable>
                                                    <el-option label="全选" value></el-option>
                                                    <el-option label="消费" value="BUY"></el-option>
                                                    <el-option label="充值" value="MEMBER_ADD_AMOUNT"></el-option>
                                                    <el-option label="退货" value="REJECT"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item> -->

                                <!-- <el-form-item v-if="item.value=='消费者身份'" label="消费者身份">
                                    <el-row>
                                        <el-col :span="8">
                                            <el-form-item prop="consumerTypeKey27.opUniqueName">
                                                <el-select v-model="basicDataForm.consumerTypeKey27.opUniqueName" :disabled="disabled">
                                                    <el-option label="全部会员" value="AllMember"></el-option>
                                                    <el-option label="指定会员卡政策" value="AppointMember"></el-option>
                                                    <el-option label="非会员" value="not_memberOperator"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="8">
                                            <el-form-item prop="consumerTypeKey27.text" v-if="basicDataForm.consumerTypeKey27.opUniqueName=='AppointMember'">
                                                <el-input v-model="basicDataForm.consumerTypeKey27.text" readonly></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="4">
                                            <el-button type="primary"  v-if="basicDataForm.consumerTypeKey27.opUniqueName=='AppointMember'" @click="cardPolicyClick('consumerIdentityDialog')" plain>选择</el-button>
                                        </el-col>
                                    </el-row>
                                </el-form-item> -->

                                <el-form-item v-if="item.value=='商品单价'" label="商品单价：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="price31.opUniqueName">
                                                <el-select v-model="basicDataForm.price31.opUniqueName" :disabled="disabled">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item">
                                            <el-form-item prop="price31.value" v-if="basicDataForm.price31.opUniqueName != ''">
                                                <el-input v-model="basicDataForm.price31.value" :disabled="disabled" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <!-- <el-form-item v-if="item.value=='商品类型'" label="商品类型：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-select v-model="basicDataForm.saleItemType100.opUniqueName" :disabled="disabled">
                                                <el-option label="不限" value></el-option>
                                                <el-option label="包含" value="normalIn"></el-option>
                                                <el-option label="不包含" value="normalNotIn"></el-option>
                                            </el-select>
                                        </div>
                                    <div class="box-cond-item">
                                            <el-form-item prop="SaleItemTypeState" v-if="basicDataForm.saleItemType100.opUniqueName!=''">
                                                <el-select v-model="basicDataForm.SaleItemTypeState" multiple collapse-tags @change="handleChangeSaleItemType" :title="basicDataForm.SaleItemTypeStateName.join(',')" clearable>
                                                    <el-option label="全选" value></el-option>
                                                    <el-option label="卖品" value="1"></el-option>
                                                    <el-option label="电影票" value="0"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item> -->

                                <el-form-item v-if="item.value=='影票单价'" label="影票单价：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="filmPrice92.opUniqueName">
                                                <el-select v-model="basicDataForm.filmPrice92.opUniqueName" :disabled="disabled">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item">
                                            <el-form-item prop="filmPrice92.value" v-if="basicDataForm.filmPrice92.opUniqueName!=''">
                                                <el-input v-model="basicDataForm.filmPrice92.value" :disabled="disabled" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='卖品单价'" label="卖品单价：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="merPrice93.opUniqueName">
                                                <el-select v-model="basicDataForm.merPrice93.opUniqueName" :disabled="disabled">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item">
                                            <el-form-item prop="merPrice93.value" v-if="basicDataForm.merPrice93.opUniqueName!=''">
                                                <el-input v-model="basicDataForm.merPrice93.value" :disabled="disabled" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='影票商品数量'" label="影票商品数量：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="filmTicketAmount80.opUniqueName">
                                                <el-select v-model="basicDataForm.filmTicketAmount80.opUniqueName" :disabled="disabled">
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item">
                                            <el-form-item prop="filmTicketAmount80.value" v-if="basicDataForm.filmTicketAmount80.opUniqueName!=''">
                                                <el-input v-model="basicDataForm.filmTicketAmount80.value" :disabled="disabled" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='影票总金额'" label="影票总金额：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="filmSumPrice90.opUniqueName">
                                                <el-select v-model="basicDataForm.filmSumPrice90.opUniqueName" :disabled="disabled">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item">
                                            <el-form-item prop="filmSumPrice90.value" v-if="basicDataForm.filmSumPrice90.opUniqueName!=''">
                                                <el-input v-model="basicDataForm.filmSumPrice90.value" :disabled="disabled" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='卖品总金额'" label="卖品总金额：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="merSumPrice91.opUniqueName">
                                                <el-select v-model="basicDataForm.merSumPrice91.opUniqueName" :disabled="disabled">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item">
                                            <el-form-item prop="merSumPrice91.value" v-if="basicDataForm.merSumPrice91.opUniqueName!=''">
                                                <el-input v-model="basicDataForm.merSumPrice91.value" :disabled="disabled" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='指定商品购买数量'" label>
                                    <el-form-item label="商品名称：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-select v-model="basicDataForm.buyNum.merKey21.opUniqueName" :disabled="disabled">
                                                    <el-option label="包含" value="normalIn"></el-option>
                                                </el-select>
                                            </div>

                                            <div class="box-cond-item">
                                                <el-form-item prop="buyNum.merKey21.text">
                                                    <el-input class="input-dialog" v-model="basicDataForm.buyNum.merKey21.text" readonly></el-input>
                                                    <i class="el-icon-close close-btn" v-show="basicDataForm.buyNum.merKey21.text" @click="basicDataForm.buyNum.merKey21.text='';basicDataForm.buyNum.merKey21.value='';"></i>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item">
                                                <el-button type="primary" class="dialogBtn" @click="selectGoodsClick('appointGoods',{value:basicDataForm.buyNum.merKey21.value,text:basicDataForm.buyNum.merKey21.text})" plain>选择</el-button>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="数量：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="buyNum.amount21.opUniqueName">
                                                    <el-select v-model="basicDataForm.buyNum.amount21.opUniqueName" :disabled="disabled" @change="handleChangeBuyNumAmount">
                                                        <el-option label="等于" value="normalEqual"></el-option>
                                                        <el-option label="小于" value="normalLess"></el-option>
                                                        <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                        <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item">
                                                <el-form-item prop="buyNum.amount21.value" v-if="basicDataForm.buyNum.amount21.opUniqueName!=''">
                                                    <el-input v-model="basicDataForm.buyNum.amount21.value" placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>
                                </el-form-item>

                                <el-form-item v-if="item.value=='整单交易金额'" label="整单交易金额：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="sumPrice26.opUniqueName">
                                                <el-select v-model="basicDataForm.sumPrice26.opUniqueName" :disabled="disabled" placeholder="请输入">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                    <el-option label="不等于" value="normalNotEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item">
                                            <el-form-item prop="sumPrice26.value" v-if="basicDataForm.sumPrice26.opUniqueName!=''">
                                                <el-input v-model="basicDataForm.sumPrice26.value" :disabled="disabled" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='同类商品累计购买数量'" label>
                                    <el-form-item label="商品类别：" prop="buyNumByType.classCode28.opUniqueName">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-select v-model="basicDataForm.buyNumByType.classCode28.opUniqueName" :disabled="disabled">
                                                    <el-option label="包含" value="normalIn"></el-option>
                                                </el-select>
                                            </div>

                                            <div class="box-cond-item">
                                                <el-form-item prop="buyNumByType.classCode28.text">
                                                    <el-input class="input-dialog" v-model="basicDataForm.buyNumByType.classCode28.text" readonly></el-input>
                                                    <i class="el-icon-close close-btn" v-show="basicDataForm.buyNumByType.classCode28.text" @click="basicDataForm.buyNumByType.classCode28.text='';basicDataForm.buyNumByType.classCode28.value='';"></i>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item">
                                                <el-button type="primary" class="dialogBtn" @click="goodClassClick('tradeGoodClassDialog',{value:basicDataForm.buyNumByType.classCode28.value})" plain>选择</el-button>
                                            </div>
                                        </el-row>
                                    </el-form-item>
                                    <el-form-item label="累计购买数量：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="buyNumByType.sumAmount28.opUniqueName">
                                                    <el-select v-model="basicDataForm.buyNumByType.sumAmount28.opUniqueName" :disabled="disabled" @change="handleChangeBuyNumByTypeSumAmount">
                                                        <el-option label="大于" value="MerStatisItemAmountGreater"></el-option>
                                                        <el-option label="等于" value="MerStatisItemAmountEqual"></el-option>
                                                        <el-option label="小于" value="MerStatisItemAmountLess"></el-option>
                                                        <el-option label="大于等于" value="MerStatisItemAmountGreaterEqual"></el-option>
                                                        <el-option label="小于等于" value="MerStatisItemAmountLessEqual"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item">
                                                <el-form-item prop="buyNumByType.sumAmount28.value" v-if="basicDataForm.buyNumByType.sumAmount28.opUniqueName!=''">
                                                    <el-input v-model="basicDataForm.buyNumByType.sumAmount28.value" placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>
                                </el-form-item>

                                <el-form-item v-if="item.value=='同品牌商品累计购买数量'" label>
                                    <el-form-item label="商品品牌：" prop="buyNumByBrand.brandId29.opUniqueName">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-select v-model="basicDataForm.buyNumByBrand.brandId29.opUniqueName" :disabled="disabled">
                                                    <el-option label="包含" value="normalIn"></el-option>
                                                </el-select>
                                            </div>

                                            <div class="box-cond-item">
                                                <el-form-item prop="buyNumByBrand.brandId29.text">
                                                    <el-input class="input-dialog" v-model="basicDataForm.buyNumByBrand.brandId29.text" readonly></el-input>
                                                    <i class="el-icon-close close-btn" v-show="basicDataForm.buyNumByBrand.brandId29.text" @click="basicDataForm.buyNumByBrand.brandId29.text='';basicDataForm.buyNumByBrand.brandId29.value='';"></i>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item">
                                                <el-button type="primary" class="dialogBtn" @click="brandNameClick('buyNumByBrand',{text:basicDataForm.buyNumByBrand.brandId29.text,value:basicDataForm.buyNumByBrand.brandId29.value})" plain>选择</el-button>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="累计购买数量：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="buyNumByBrand.sumAmount29.opUniqueName">
                                                    <el-select v-model="basicDataForm.buyNumByBrand.sumAmount29.opUniqueName" :disabled="disabled" @change="handleChangeBuyNumByBrandSumAmount">
                                                        <el-option label="大于" value="MerStatisItemAmountGreater"></el-option>
                                                        <el-option label="等于" value="MerStatisItemAmountEqual"></el-option>
                                                        <el-option label="小于" value="MerStatisItemAmountLess"></el-option>
                                                        <el-option label="大于等于" value="MerStatisItemAmountGreaterEqual"></el-option>
                                                        <el-option label="小于等于" value="MerStatisItemAmountLessEqual"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item">
                                                <el-form-item v-if="basicDataForm.buyNumByBrand.sumAmount29.opUniqueName!=''" prop="buyNumByBrand.sumAmount29.value">
                                                    <el-input v-model="basicDataForm.buyNumByBrand.sumAmount29.value" placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>
                                </el-form-item>

                                <el-form-item v-if="item.value=='支付方式(柜台用)'" label="支付方式：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="payTypeCode86.opUniqueName">
                                                <el-select v-model="basicDataForm.payTypeCode86.opUniqueName" :disabled="disabled">
                                                    <el-option label="包含" value="normalIn"></el-option>
                                                    <el-option label="不包含" value="normalNotIn"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item">
                                            <el-form-item prop="payTypeCode86.text" v-if="basicDataForm.payTypeCode86.opUniqueName!=''">
                                                <el-input class="input-dialog" v-model="basicDataForm.payTypeCode86.text" readonly></el-input>
                                                <i class="el-icon-close close-btn" v-show="basicDataForm.payTypeCode86.text" @click="clearInputValue('payTypeCode86')"></i>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item">
                                            <el-button type="primary" class="dialogBtn" v-if="basicDataForm.payTypeCode86.opUniqueName!=''" @click="payTypeClick({value:basicDataForm.payTypeCode86.value,text:basicDataForm.payTypeCode86.text})" plain >选择</el-button>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='放映前N天'" label="放映前N天：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="filmStartDayBefore94.opUniqueName">
                                                <el-select v-model="basicDataForm.filmStartDayBefore94.opUniqueName" :disabled="disabled">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item">
                                            <el-form-item prop="filmStartDayBefore94.value" v-if="basicDataForm.filmStartDayBefore94.opUniqueName!=''">
                                                <el-input v-model="basicDataForm.filmStartDayBefore94.value" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='放映前N小时'" label="放映前N小时：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item prop="filmStartHourBefore95.opUniqueName">
                                                <el-select v-model="basicDataForm.filmStartHourBefore95.opUniqueName" :disabled="disabled">
                                                    <el-option label="大于" value="normalGreater"></el-option>
                                                    <el-option label="等于" value="normalEqual"></el-option>
                                                    <el-option label="小于" value="normalLess"></el-option>
                                                    <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                                                    <el-option label="小于等于" value="normalLessEqual"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item">
                                            <el-form-item prop="filmStartHourBefore95.value" v-if="basicDataForm.filmStartHourBefore95.opUniqueName!=''">
                                                <el-input v-model="basicDataForm.filmStartHourBefore95.value" placeholder="请输入"></el-input>
                                            </el-form-item>
                                        </div>
                                    </el-row>
                                </el-form-item>

                                <el-form-item v-if="item.value=='首次购票'" label="首次购票：">
                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-select v-model="basicDataForm.firstBuyTicket96.opUniqueName" :disabled="disabled">
                                                <el-option label="等于" value="normalEqual"></el-option>
                                            </el-select>
                                        </div>

                                        <div class="box-cond-item">
                                            <el-select v-model="basicDataForm.firstBuyTicket96.value" :disabled="disabled">
                                                <el-option label="是" value="true"></el-option>
                                            </el-select>
                                        </div>
                                    </el-row>
                                </el-form-item>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
            </el-collapse-item>
            <!-- 子活动执行方式 -->
            <el-collapse-item title="子活动执行方式" name="3">
                <div style="color:#666666;margin-bottom:20px;margin-top:10px">请选择该活动执行方法，可多选</div>
                <div class="box-title">子活动执行方式</div>
                <div class="box-content">
                    <div class="box-tabs">
                        <el-tabs v-model="activeName1" tab-position="left" type="card">
                            <!-- 会员类 -->
                            <el-tab-pane label name="first1">
                                <span slot="label">
                                    <span :class="(checkedMemberAction.length > 0)?'item-name-is-activity':'item-name-no-activity'">会员类</span>
                                    <i class="item-select-number" v-if="checkedMemberAction.length">{{checkedMemberAction.length}}</i>
                                </span>

                                <el-checkbox-group v-model="checkedMemberAction" @change="handleCheckedAction">
                                    <el-checkbox v-for="item in memberActions" :label="item" :key="item.key">{{item.value}}</el-checkbox>
                                </el-checkbox-group>
                            </el-tab-pane>
                            <!-- 影票类 -->
                            <el-tab-pane name="second1">
                                <span slot="label">
                                    <span :class="(checkedTicketsAction.length > 0)?'item-name-is-activity':'item-name-no-activity'">影票类</span>
                                    <i class="item-select-number" v-if="checkedTicketsAction.length">{{checkedTicketsAction.length}}</i>
                                </span>

                                <el-checkbox-group v-model="checkedTicketsAction" @change="handleCheckedAction">
                                    <el-checkbox v-for="item in movieTicketsActions" :label="item" :key="item.key">{{item.value}}</el-checkbox>
                                </el-checkbox-group>
                            </el-tab-pane>
                            <!-- 交易类 -->
                            <el-tab-pane label name="third1">
                                <span slot="label">
                                    <span :class="(checkedTradeAction.length > 0)?'item-name-is-activity':'item-name-no-activity'">交易类</span>
                                    <i class="item-select-number" v-if="checkedTradeAction.length">{{checkedTradeAction.length}}</i>
                                </span>

                                <el-checkbox-group v-model="checkedTradeAction" @change="handleCheckedAction">
                                    <el-scrollbar style="height:500px;overflow-x: hidden;">
                                        <el-checkbox v-for="item in tradeActions" :label="item" :key="item.key">{{item.value}}</el-checkbox>
                                    </el-scrollbar>
                                </el-checkbox-group>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <div class="box-cond">
                        <el-scrollbar style="height:500px">
                            <p  class="box-cond-info">
                                <span>已选执行方法（共{{selectedActions.length}}项）：</span>    
                                <el-button v-if="selectedActions.length" type="primary" class="clearBtn" plain @click="clearAllActionsHandle">清空</el-button> 
                            </p>
                            <div v-for="item of selectedActions" :key="item.key"  style="">
                                <!-- 会员类 -->
                                <div v-if="item.value=='赠送积分'">
                                    <div class="actionLabel">【赠送积分】</div>
                                    <el-form-item label="赠送积分：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="presentPoint1.value">
                                                    <el-input v-model="basicDataForm.presentPoint1.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>
                                </div>

                                <div v-if="item.value=='赠送积分倍率'">
                                    <div class="actionLabel">【赠送积分倍率】</div>
                                    <el-form-item label="赠送积分倍率：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="pointPersent18.value">
                                                    <el-input v-model="basicDataForm.pointPersent18.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>
                                </div>

                                <div v-if="item.value=='赠送会员卡储值额'">
                                    <div class="actionLabel">【赠送会员卡储值额】</div>
                                    <el-form-item label="赠送会员卡储值额：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="presentMoney2.value">
                                                    <el-input v-model="basicDataForm.presentMoney2.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>
                                </div>

                                <div v-if="item.value=='赠送票券'">
                                    <div class="actionLabel">【赠送票券】</div>
                                    <el-form-item label="票券名称：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="giftTicket.couponApplyCode3.text">
                                                    <el-input class="input-dialog" v-model="basicDataForm.giftTicket.couponApplyCode3.text" readonly></el-input>
                                                    <i class="el-icon-close close-btn" v-show="basicDataForm.giftTicket.couponApplyCode3.text" @click="basicDataForm.giftTicket.couponApplyCode3.text = '';basicDataForm.giftTicket.couponApplyCode3.value = ''"></i>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item">
                                                <el-button type="primary" class="dialogBtn" @click="couponBatchSingleClick('couponBatchSingleDialog',{value:basicDataForm.giftTicket.couponApplyCode3.value,text:basicDataForm.giftTicket.couponApplyCode3.text})" plain>选择</el-button>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="数量：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="giftTicket.amount3.value">
                                                    <el-input v-model="basicDataForm.giftTicket.amount3.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="是否发送短信：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="giftTicket.isSendSms3.value">
                                                    <el-select class="select-type-178" v-model="basicDataForm.giftTicket.isSendSms3.value" :disabled="disabled">
                                                        <el-option label="是" value="send"></el-option>
                                                        <el-option label="否" value="unsend"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>
                                </div>

                                <!-- 影票类 -->
                                <!-- <div v-if="item.value=='按座位等级修改票价'">
                                    <div class="actionLabel">【按座位等级修改票价】</div>
                                    <el-form-item label="调价方式：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="updateTicketPriceBySeatGrade.modifyWay29.value">
                                                    <el-select v-model="basicDataForm.updateTicketPriceBySeatGrade.modifyWay29.value" :disabled="disabled" @change="changeModifyWay29">
                                                        <el-option label="固定金额 ( 元 )" value="fixPrice"></el-option>
                                                        <el-option label="零售价打折 ( % )" value="discountPrice"></el-option>
                                                        <el-option label="零售价-N ( 元 )" value="subPrice"></el-option>
                                                        <el-option label="最低发行价±N元" value="addToLowestPrice"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item" v-if="basicDataForm.updateTicketPriceBySeatGrade.modifyWay29.value!='' ">
                                                <el-form-item label="调整额：">
                                                    <el-row class="region-adjustments">
                                                        <div class="box-cond-item">
                                                            <el-form-item prop="updateTicketPriceBySeatGrade.modifyValue29.value">
                                                                <el-input class="input-adjustments" v-model="basicDataForm.updateTicketPriceBySeatGrade.modifyValue29.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                            </el-form-item>
                                                        </div>
                                                    </el-row>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="折扣后加减N元：" v-if="basicDataForm.updateTicketPriceBySeatGrade.modifyWay29.value=='discountPrice' ">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="updateTicketPriceBySeatGrade.addAmountAfterDiscount29.value">
                                                    <el-input class="input-after-discount" v-model="basicDataForm.updateTicketPriceBySeatGrade.addAmountAfterDiscount29.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item label="积分定价（分）：">
                                                <el-row class="region-integral-pricing">
                                                    <div class="box-cond-item">
                                                        <el-form-item prop="updateTicketPriceBySeatGrade.integralAmount29.value">
                                                            <el-input class="input-integral-pricing" v-model="basicDataForm.updateTicketPriceBySeatGrade.integralAmount29.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                        </el-form-item>
                                                    </div>
                                                </el-row>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item">
                                            <el-form-item label="加金额（元）：">
                                                <el-row class="region-additional-amount">
                                                    <div class="box-cond-item">
                                                        <el-form-item prop="updateTicketPriceBySeatGrade.integralMoney29.value">
                                                            <el-input class="input-additional-amount" v-model="basicDataForm.updateTicketPriceBySeatGrade.integralMoney29.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                        </el-form-item>
                                                    </div>
                                                </el-row>
                                            </el-form-item>
                                        </div>
                                    </el-row>

                                    <el-form-item label="折后取整方式：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-select v-model="basicDataForm.updateTicketPriceBySeatGrade.decimalRoundMode29.value" :disabled="disabled">
                                                    <el-option label="四舍五入" value="ROUND_HALF_UP"></el-option>
                                                    <el-option label="忽略小数取整" value="ROUND_FLOOR"></el-option>
                                                    <el-option label="小数进1取整" value="ROUND_CEILING"></el-option>
                                                    <el-option label="保留小数" value="ROUND_UNNECESSARY"></el-option>
                                                </el-select>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="低于最低价时：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-select v-model="basicDataForm.updateTicketPriceBySeatGrade.lessProcessMethod29.value" :disabled="disabled" @change="changeLessProcessMethod29">
                                                    <el-option label="不允许出票" value="notAllowSale"></el-option>
                                                    <el-option label="影院补贴" value="cinemaPay"></el-option>
                                                    <el-option label="用户补贴" value="clientPay"></el-option>
                                                </el-select>
                                            </div>

                                            <div class="box-cond-item" v-if="basicDataForm.updateTicketPriceBySeatGrade.lessProcessMethod29.value=='cinemaPay'">
                                                <el-form-item label="最多补贴N元：">
                                                    <el-row class="region-maximum-subsidy">
                                                        <div class="box-cond-item">
                                                            <el-form-item prop="updateTicketPriceBySeatGrade.cinemaPayAmount29.value">
                                                                <el-input  class="input-maximum-subsidy" v-model="basicDataForm.updateTicketPriceBySeatGrade.cinemaPayAmount29.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                            </el-form-item>
                                                        </div>
                                                    </el-row>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="调价商品数量：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="updateTicketPriceBySeatGrade.modifyAmountMethod29.value">
                                                    <el-select v-model="basicDataForm.updateTicketPriceBySeatGrade.modifyAmountMethod29.value" :disabled="disabled" @change="changeModifyAmountMethod29">
                                                        <el-option label="指定数量" value="appointAmount"></el-option>
                                                        <el-option label="全部影票" value="all"></el-option>
                                                        <el-option label="每会员每日数量" value="perMemberDay"></el-option>
                                                        <el-option label="每会员每周数量" value="perMemberWeek"></el-option>
                                                        <el-option label="每会员每月数量" value="perMemberMonth"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item" v-if="basicDataForm.updateTicketPriceBySeatGrade.modifyAmountMethod29.value!='all'">
                                                <el-form-item label="数量：">
                                                    <el-row class="region-count">
                                                        <div class="box-cond-item">
                                                            <el-form-item prop="updateTicketPriceBySeatGrade.modifyAmount29.value">
                                                                <el-input class="input-count" v-model="basicDataForm.updateTicketPriceBySeatGrade.modifyAmount29.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                            </el-form-item>
                                                        </div>
                                                    </el-row>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="座位等级：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="action_seatLevel">
                                                    <el-select v-model="basicDataForm.action_seatLevel" multiple collapse-tags @change="handleChangeAction_SeatLevel" :title="basicDataForm.action_seatLevelName.join(',')" clearable>
                                                        <el-option label="全选" value></el-option>
                                                        <el-option v-for="(item,index) in 10" :key="index" :label="index" :value="index"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>
                                </div> -->

                                <div v-if="item.value=='修改单票售价'">
                                    <div class="actionLabel">【修改单票售价】</div>
                                    <el-form-item label="调价方式：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="updateTicketPrice.modifyWay15.value">
                                                    <el-select v-model="basicDataForm.updateTicketPrice.modifyWay15.value" :disabled="disabled" @change="changeModifyWay15">
                                                        <el-option label="固定金额 ( 元 )" value="fixPrice"></el-option>
                                                        <el-option label="零售价打折 ( % )" value="discountPrice"></el-option>
                                                        <el-option label="零售价-N ( 元 )" value="subPrice"></el-option>
                                                        <el-option label="最低发行价±N元" value="addToLowestPrice"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item"  v-if="basicDataForm.updateTicketPrice.modifyWay15.value!='' ">
                                                <el-form-item label="调整额：">
                                                    <el-row class="region-adjustments">
                                                        <div class="box-cond-item">
                                                            <el-form-item prop="updateTicketPrice.modifyValue15.value">
                                                                <el-input class="input-adjustments" v-model="basicDataForm.updateTicketPrice.modifyValue15.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                            </el-form-item>
                                                    </div>
                                                    </el-row>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>
                                    <el-form-item label="折扣后加减N元：" v-if="basicDataForm.updateTicketPrice.modifyWay15.value=='discountPrice' ">
                                        <el-row >
                                            <div class="box-cond-item">
                                                <el-form-item prop="updateTicketPrice.addAmountAfterDiscount15.value">
                                                    <el-input class="input-after-discount" v-model="basicDataForm.updateTicketPrice.addAmountAfterDiscount15.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item label="积分定价（分）：">
                                                <el-row class="region-integral-pricing">
                                                    <div class="box-cond-item">
                                                        <el-form-item prop="updateTicketPrice.integralAmount15.value">
                                                            <el-input class="input-integral-pricing" v-model="basicDataForm.updateTicketPrice.integralAmount15.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                        </el-form-item>
                                                    </div>
                                                </el-row>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item">
                                            <el-form-item label="加金额（元）：">
                                                <el-row class="region-additional-amount">
                                                    <div class="box-cond-item">
                                                        <el-form-item prop="updateTicketPrice.integralMoney15.value">
                                                            <el-input class="input-additional-amount" v-model="basicDataForm.updateTicketPrice.integralMoney15.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                        </el-form-item>
                                                    </div>
                                                </el-row>
                                            </el-form-item>
                                        </div>
                                    </el-row>

                                    <el-form-item label="折后取整方式：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-select v-model="basicDataForm.updateTicketPrice.decimalRoundMode15.value" :disabled="disabled">
                                                    <el-option label="四舍五入" value="ROUND_HALF_UP"></el-option>
                                                    <el-option label="忽略小数取整" value="ROUND_FLOOR"></el-option>
                                                    <el-option label="小数进1取整" value="ROUND_CEILING"></el-option>
                                                    <el-option label="保留小数" value="ROUND_UNNECESSARY"></el-option>
                                                </el-select>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="低于最低价时：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-select v-model="basicDataForm.updateTicketPrice.lessProcessMethod15.value" :disabled="disabled" @change="changeLessProcessMethod15">
                                                    <el-option label="不允许出票" value="notAllowSale"></el-option>
                                                    <el-option label="影院补贴" value="cinemaPay"></el-option>
                                                    <el-option label="用户补贴" value="clientPay"></el-option>
                                                </el-select>
                                            </div>

                                            <div class="box-cond-item" v-if="basicDataForm.updateTicketPrice.lessProcessMethod15.value=='cinemaPay'">
                                                <el-form-item label="最多补贴N元：">
                                                    <el-row class="region-maximum-subsidy">
                                                        <div class="box-cond-item">
                                                            <el-form-item prop="updateTicketPrice.cinemaPayAmount15.value">
                                                                <el-input class="input-maximum-subsidy" v-model="basicDataForm.updateTicketPrice.cinemaPayAmount15.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                            </el-form-item>
                                                        </div>
                                                    </el-row>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="调价商品数量：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="updateTicketPrice.modifyAmountMethod15.value">
                                                    <el-select v-model="basicDataForm.updateTicketPrice.modifyAmountMethod15.value" :disabled="disabled" @change="changeModifyAmountMethod15">
                                                        <el-option label="指定数量" value="appointAmount"></el-option>
                                                        <el-option label="全部影票" value="all"></el-option>
                                                        <el-option label="每会员每日数量" value="perMemberDay"></el-option>
                                                        <el-option label="每会员每周数量" value="perMemberWeek"></el-option>
                                                        <el-option label="每会员每月数量" value="perMemberMonth"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item"  v-if="basicDataForm.updateTicketPrice.modifyAmountMethod15.value!='all'">
                                                <el-form-item label="数量：">
                                                    <el-row class="region-count">
                                                        <div class="box-cond-item">
                                                            <el-form-item prop="updateTicketPrice.modifyAmount15.value">
                                                                <el-input class="input-count" v-model="basicDataForm.updateTicketPrice.modifyAmount15.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                            </el-form-item>
                                                        </div>
                                                    </el-row>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>
                                </div>

                                <!-- 交易类 -->
                                <div v-if="item.value=='单品优惠价调整'">
                                    <div class="actionLabel">【单品优惠价调整】</div>
                                    <el-form-item label="商品：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="judgeDiscountPrice.merKey9.text">
                                                    <el-input class="input-dialog" v-model="basicDataForm.judgeDiscountPrice.merKey9.text" readonly></el-input>
                                                    <i class="el-icon-close close-btn" v-show="basicDataForm.judgeDiscountPrice.merKey9.text" @click="basicDataForm.judgeDiscountPrice.merKey9.text = '';basicDataForm.judgeDiscountPrice.merKey9.value = ''"></i>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item">
                                                <el-button type="primary" class="dialogBtn" @click="selectGoodsClick('singleGoods',{value:basicDataForm.judgeDiscountPrice.merKey9.value,text:basicDataForm.judgeDiscountPrice.merKey9.text})" plain>选择</el-button>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="调价方式：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="judgeDiscountPrice.modifyWay9.value">
                                                    <el-select v-model="basicDataForm.judgeDiscountPrice.modifyWay9.value" :disabled="disabled" @change="changeModifyWay9">
                                                        <el-option label="固定金额 ( 元 )" value="fixPrice"></el-option>
                                                        <el-option label="零售价打折 ( % )" value="discountPrice"></el-option>
                                                        <el-option label="零售价-N ( 元 )" value="subPrice"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item" v-if="basicDataForm.judgeDiscountPrice.modifyWay9.value!='' ">
                                                <el-form-item label="调整额：">
                                                    <el-row class="region-adjustments">
                                                        <div class="box-cond-item">
                                                            <el-form-item prop="judgeDiscountPrice.modifyValue9.value">
                                                                <el-input class="input-adjustments" v-model="basicDataForm.judgeDiscountPrice.modifyValue9.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                            </el-form-item>
                                                        </div>
                                                    </el-row>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="折扣后加减N元：" v-if="basicDataForm.judgeDiscountPrice.modifyWay9.value=='discountPrice' ">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="judgeDiscountPrice.addAmountAfterDiscount9.value">
                                                    <el-input class="input-after-discount" v-model="basicDataForm.judgeDiscountPrice.addAmountAfterDiscount9.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-row>
                                        <div class="box-cond-item">
                                            <el-form-item label="积分定价（分）：">
                                                <el-row class="region-integral-pricing">
                                                    <div class="box-cond-item">
                                                        <el-form-item prop="judgeDiscountPrice.integralAmount9.value">
                                                            <el-input class="input-integral-pricing" v-model="basicDataForm.judgeDiscountPrice.integralAmount9.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                        </el-form-item>
                                                    </div>
                                                </el-row>
                                            </el-form-item>
                                        </div>

                                        <div class="box-cond-item">
                                            <el-form-item label="加金额（元）：">
                                                <el-row class="region-additional-amount">
                                                    <div class="box-cond-item">
                                                        <el-form-item prop="judgeDiscountPrice.integralMoney9.value">
                                                            <el-input class="input-additional-amount" v-model="basicDataForm.judgeDiscountPrice.integralMoney9.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                        </el-form-item>
                                                    </div>
                                                </el-row>
                                            </el-form-item>
                                        </div>
                                    </el-row>

                                    <el-form-item label="调价商品数量：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="judgeDiscountPrice.modifyAmountMethod9.value">
                                                    <el-select v-model="basicDataForm.judgeDiscountPrice.modifyAmountMethod9.value" :disabled="disabled" @change="changeModifyAmountMethod9">
                                                        <el-option label="指定数量" value="appointAmount"></el-option>
                                                        <el-option label="该商品全部数量" value="all"></el-option>
                                                        <el-option label="每会员每日数量" value="perMemberDay"></el-option>
                                                        <el-option label="每会员每周数量" value="perMemberWeek"></el-option>
                                                        <el-option label="每会员每月数量" value="perMemberMonth"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item" v-if="basicDataForm.judgeDiscountPrice.modifyAmountMethod9.value != 'all'">
                                                <el-form-item label="数量：">
                                                    <el-row class="region-count">
                                                        <div class="box-cond-item">
                                                            <el-form-item prop="judgeDiscountPrice.modifyAmount9.value">
                                                                <el-input class="input-count" v-model="basicDataForm.judgeDiscountPrice.modifyAmount9.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                            </el-form-item>
                                                    </div>
                                                    </el-row>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="折后取整方式：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-select v-model="basicDataForm.judgeDiscountPrice.decimalRoundMode9.value" :disabled="disabled">
                                                    <el-option label="四舍五入" value="ROUND_HALF_UP"></el-option>
                                                    <el-option label="忽略小数取整" value="ROUND_FLOOR"></el-option>
                                                    <el-option label="小数进1取整" value="ROUND_CEILING"></el-option>
                                                    <el-option label="保留小数" value="ROUND_UNNECESSARY"></el-option>
                                                </el-select>
                                            </div>
                                        </el-row>
                                    </el-form-item>
                                </div>

                                <div v-if="item.value=='以优惠价格增加单品'">
                                    <div class="actionLabel">【以优惠价格增加单品】</div>
                                    <el-form-item label="商品：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="addGoodsWithDiscountPrice.merKey10.text">
                                                    <el-input class="input-dialog" v-model="basicDataForm.addGoodsWithDiscountPrice.merKey10.text" readonly></el-input>
                                                    <i class="el-icon-close close-btn" v-show="basicDataForm.addGoodsWithDiscountPrice.merKey10.text" @click="basicDataForm.addGoodsWithDiscountPrice.merKey10.text = '';basicDataForm.addGoodsWithDiscountPrice.merKey10.value = ''"></i>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item">
                                                <el-button type="primary" class="dialogBtn" @click="selectGoodsClick('favorablePrice',{value:basicDataForm.addGoodsWithDiscountPrice.merKey10.value,text:basicDataForm.addGoodsWithDiscountPrice.merKey10.text})" plain>选择</el-button>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="商品单价：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="addGoodsWithDiscountPrice.price10.value">
                                                    <el-input class="input-good-pricing" v-model="basicDataForm.addGoodsWithDiscountPrice.price10.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="增加数量：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="addGoodsWithDiscountPrice.amount10.value">
                                                    <el-input v-model="basicDataForm.addGoodsWithDiscountPrice.amount10.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>
                                </div>

                                <div v-if="item.value=='赠送商品'">
                                    <div class="actionLabel">【赠送商品】</div>
                                    <el-form-item label="商品：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="giftGoods.merKey11.text">
                                                    <el-input class="input-dialog" v-model="basicDataForm.giftGoods.merKey11.text" readonly></el-input>
                                                    <i class="el-icon-close close-btn" v-show="basicDataForm.giftGoods.merKey11.text" @click="basicDataForm.giftGoods.merKey11.text = '';basicDataForm.giftGoods.merKey11.value = ''"></i>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item">
                                                <el-button type="primary" class="dialogBtn" @click="selectGoodsClick('zengSongGoods',{value:basicDataForm.giftGoods.merKey11.value,text:basicDataForm.giftGoods.merKey11.text})" plain>选择</el-button>
                                            </div>
                                        </el-row>
                                    </el-form-item>
                                    <el-form-item label="商品单价：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="giftGoods.price11.value">
                                                    <el-input class="input-good-pricing" v-model="basicDataForm.giftGoods.price11.value"  placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="赠送数量：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="giftGoods.amount11.value">
                                                    <el-input v-model="basicDataForm.giftGoods.amount11.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>
                                </div>

                                <div v-if="item.value=='卖品分类优惠价调整'">
                                    <div class="actionLabel">【卖品分类优惠价调整】</div>
                                    <el-form-item label="商品分类：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item>
                                                    <el-select v-model="basicDataForm.judgeDiscountPriceByType.merCategoryMethod27.value" :disabled="disabled" @change="changeMerCategoryMethod27">
                                                        <el-option label="全部卖品分类" value="allMerCategory"></el-option>
                                                        <el-option label="指定分类" value="appointCategory"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="分类：" v-if="basicDataForm.judgeDiscountPriceByType.merCategoryMethod27.value=='appointCategory'">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="judgeDiscountPriceByType.classCode27.text">
                                                    <el-input class="input-dialog" v-model="basicDataForm.judgeDiscountPriceByType.classCode27.text" readonly></el-input>
                                                    <i class="el-icon-close close-btn" v-show="basicDataForm.judgeDiscountPriceByType.classCode27.text" @click="basicDataForm.judgeDiscountPriceByType.classCode27.text = '';basicDataForm.judgeDiscountPriceByType.classCode27.value = ''"></i>
                                                </el-form-item>
                                            </div>
                                            <div class="box-cond-item">
                                                <el-button type="primary" class="dialogBtn" @click="goodClassClick('actionTradeGoodClassDialog',{value:basicDataForm.judgeDiscountPriceByType.classCode27.value})" plain>选择</el-button>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="调价方式：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="judgeDiscountPriceByType.modifyWay27.value">
                                                    <el-select v-model="basicDataForm.judgeDiscountPriceByType.modifyWay27.value" :disabled="disabled" @change="changeModifyWay27">
                                                        <el-option label="零售价打折 ( % )" value="discountPrice"></el-option>
                                                        <el-option label="零售价-N ( 元 )" value="subPrice"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item" v-if="basicDataForm.judgeDiscountPriceByType.modifyWay27.value!='' ">
                                                <el-form-item label="调价值：">
                                                    <el-row class="region-adjustments">
                                                        <div class="box-cond-item">
                                                            <el-form-item prop="judgeDiscountPriceByType.modifyValue27.value">
                                                                <el-input class="input-adjustments" v-model="basicDataForm.judgeDiscountPriceByType.modifyValue27.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                            </el-form-item>
                                                        </div>
                                                    </el-row>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="折扣后加减N元：" v-if="basicDataForm.judgeDiscountPriceByType.modifyWay27.value=='discountPrice' ">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="judgeDiscountPriceByType.addAmountAfterDiscount27.value">
                                                    <el-input class="input-after-discount" v-model="basicDataForm.judgeDiscountPriceByType.addAmountAfterDiscount27.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="调价商品数量：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="judgeDiscountPriceByType.modifyAmountMethod27.value">
                                                    <el-select v-model="basicDataForm.judgeDiscountPriceByType.modifyAmountMethod27.value" :disabled="disabled" @change="changeModifyAmountMethod27">
                                                        <el-option label="指定数量" value="appointAmount"></el-option>
                                                        <el-option label="该分类全部数量" value="all"></el-option>
                                                        <el-option label="每会员每日数量" value="perMemberDay"></el-option>
                                                        <el-option label="每会员每周数量" value="perMemberWeek"></el-option>
                                                        <el-option label="每会员每月数量" value="perMemberMonth"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item" v-if="basicDataForm.judgeDiscountPriceByType.modifyAmountMethod27.value!='all'">
                                                <el-form-item label="数量：">
                                                    <el-row class="region-count">
                                                        <div class="box-cond-item">
                                                            <el-form-item prop="judgeDiscountPriceByType.modifyAmount27.value">
                                                                <el-input class="input-count" v-model="basicDataForm.judgeDiscountPriceByType.modifyAmount27.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                            </el-form-item>
                                                        </div>
                                                    </el-row>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="折后取整方式：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-select v-model="basicDataForm.judgeDiscountPriceByType.decimalRoundMode27.value" :disabled="disabled">
                                                    <el-option label="四舍五入" value="ROUND_HALF_UP"></el-option>
                                                    <el-option label="忽略小数取整" value="ROUND_FLOOR"></el-option>
                                                    <el-option label="小数进1取整" value="ROUND_CEILING"></el-option>
                                                    <el-option label="保留小数" value="ROUND_UNNECESSARY"></el-option>
                                                </el-select>
                                            </div>
                                        </el-row>
                                    </el-form-item>
                                </div>

                                <div v-if="item.value=='按品牌优惠价调整'">
                                    <div class="actionLabel">【按品牌优惠价调整】</div>
                                    <el-form-item label="商品品牌：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="judgeDiscountPriceByBrand.merBrandMethod28.value">
                                                    <el-select v-model="basicDataForm.judgeDiscountPriceByBrand.merBrandMethod28.value" :disabled="disabled" @change="changeMerBrandMethod28">
                                                        <el-option label="全部品牌" value="allMerBrand"></el-option>
                                                        <el-option label="指定品牌" value="appointBrand"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="品牌：" v-if="basicDataForm.judgeDiscountPriceByBrand.merBrandMethod28.value=='appointBrand'">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="judgeDiscountPriceByBrand.brandId28.text">
                                                    <el-input class="input-dialog" v-model="basicDataForm.judgeDiscountPriceByBrand.brandId28.text" readonly></el-input>
                                                    <i class="el-icon-close close-btn" v-show="basicDataForm.judgeDiscountPriceByBrand.brandId28.text" @click="basicDataForm.judgeDiscountPriceByBrand.brandId28.text = '';basicDataForm.judgeDiscountPriceByBrand.brandId28.value = ''"></i>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item">
                                                <el-button type="primary" class="dialogBtn" @click="brandNameClick('youhuiselBrand',{text:basicDataForm.judgeDiscountPriceByBrand.brandId28.text,value:basicDataForm.judgeDiscountPriceByBrand.brandId28.value})" plain>选择</el-button>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="调价方式：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="judgeDiscountPriceByBrand.modifyWay28.value">
                                                    <el-select v-model="basicDataForm.judgeDiscountPriceByBrand.modifyWay28.value" :disabled="disabled" @change="changeModifyWay28">
                                                        <el-option label="零售价打折 ( % )" value="discountPrice"></el-option>
                                                        <el-option label="零售价-N ( 元 )" value="subPrice"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item" v-if="basicDataForm.judgeDiscountPriceByBrand.modifyWay28.value!='' ">
                                                <el-form-item label="调价值：">
                                                    <el-row class="region-adjustments">
                                                        <div class="box-cond-item">
                                                            <el-form-item prop="judgeDiscountPriceByBrand.modifyValue28.value">
                                                                <el-input class="input-adjustments" v-model="basicDataForm.judgeDiscountPriceByBrand.modifyValue28.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                            </el-form-item>
                                                        </div>
                                                    </el-row>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="折扣后加减N元：" v-if="basicDataForm.judgeDiscountPriceByBrand.modifyWay28.value=='discountPrice' ">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="judgeDiscountPriceByBrand.addAmountAfterDiscount28.value">
                                                    <el-input class="input-after-discount" v-model="basicDataForm.judgeDiscountPriceByBrand.addAmountAfterDiscount28.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="调价商品数量：">
                                        <el-row>
                                            <div class="box-cond-item">
                                                <el-form-item prop="judgeDiscountPriceByBrand.modifyAmountMethod28.value">
                                                    <el-select v-model="basicDataForm.judgeDiscountPriceByBrand.modifyAmountMethod28.value" :disabled="disabled" @change="changeModifyAmountMethod28">
                                                        <el-option label="指定数量" value="appointAmount"></el-option>
                                                        <el-option label="该分类全部数量" value="all"></el-option>
                                                        <el-option label="每会员每日数量" value="perMemberDay"></el-option>
                                                        <el-option label="每会员每周数量" value="perMemberWeek"></el-option>
                                                        <el-option label="每会员每月数量" value="perMemberMonth"></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </div>

                                            <div class="box-cond-item" v-if="basicDataForm.judgeDiscountPriceByBrand.modifyAmountMethod28.value!='all'">
                                                <el-form-item label="数量：">
                                                    <el-row class="region-count">
                                                        <div class="box-cond-item">
                                                            <el-form-item prop="judgeDiscountPriceByBrand.modifyAmount28.value">
                                                                <el-input class="input-count" v-model="basicDataForm.judgeDiscountPriceByBrand.modifyAmount28.value" :disabled="disabled" placeholder="请输入"></el-input>
                                                            </el-form-item>
                                                        </div>
                                                    </el-row>
                                                </el-form-item>
                                            </div>
                                        </el-row>
                                    </el-form-item>

                                    <el-form-item label="折后取整方式：">
                                        <el-row>
                                        <div class="box-cond-item">
                                                <el-select v-model="basicDataForm.judgeDiscountPriceByBrand.decimalRoundMode28.value" :disabled="disabled">
                                                    <el-option label="四舍五入" value="ROUND_HALF_UP"></el-option>
                                                    <el-option label="忽略小数取整" value="ROUND_FLOOR"></el-option>
                                                    <el-option label="小数进1取整" value="ROUND_CEILING"></el-option>
                                                    <el-option label="保留小数" value="ROUND_UNNECESSARY"></el-option>
                                                </el-select>
                                            </div>
                                        </el-row>
                                    </el-form-item>
                                </div>

                                <div v-if="item.value=='修改订单结算价'">
                                    <div class="actionLabel">【修改订单结算价】</div>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                </div>
            </el-collapse-item>
            </el-form>
        </el-collapse>

        <!-- 侧边链接栏 -->
        <fixStepTool :stepData="stepData.stepList"></fixStepTool>

        <!-- 底部区域 -->
        <el-row class="flex-base flex-center footerGroup">
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
            <el-button @click="returnList()">返回</el-button>
        </el-row>
        <!-- 弹窗组件都加这 -->
        <section>
            <!-- 选择商品弹窗 -->
            <selected-goods :dialogVisible.sync="selectedGoodsDialogVisible" :dialogFeedbackData="selectedFeedbackData" @cimSelectedGoodsDialogCallBack="cimSelectedGoodsDialogCallBack"></selected-goods>
            <!-- 品牌弹窗 -->
            <selBrandDialog :title="selBrandDialog.title"  ref="selBrand" @callBack="SelBrandCallBack" />
            <selBrandDialog :title="selBrandDialog.title"  ref="youhuiselBrand" @callBack="youhuiBrandcallBack" />
            <selBrandDialog :title="selBrandDialog.title"  ref="buyNumByBrand" @callBack="buyNumByBrandcallBack" />
        
            <!-- 商品类别弹窗 -->
            <goodClassDialog :title="goodClassDialog.title" :dialogTableVisible.sync="goodClassDialog.goodClassDialogVisible" ref="goodClassDialog"  @callBack="handleGoodClassCallBack"></goodClassDialog>
            <goodClassDialog :title="goodClassDialog.title" :dialogTableVisible.sync="goodClassDialog.goodClassDialogVisible" ref="tradeGoodClassDialog"  @callBack="handleTradeGoodClassCallBack"></goodClassDialog>
            <goodClassDialog :title="goodClassDialog.title" :dialogTableVisible.sync="goodClassDialog.goodClassDialogVisible" ref="actionTradeGoodClassDialog"  @callBack="handleAcitonTradeGoodClassCallBack"></goodClassDialog>

            <!-- 交易渠道弹窗-弃用 -->
            <!-- <TradeChannel ref="TradeChannel" @TrandeChannelcallbackData="TrandeChannelcallbackData"></TradeChannel> -->
            <!-- 支付方式 -->
            <payTypeDialog :title="payTypeDialog.title" :dialogTableVisible.sync="payTypeDialog.payTypeDialogVisible"  ref="payTypeDialog" @callBack="handlePayTypeCounterUseCallBack" ></payTypeDialog>
            <!-- 交易客商弹窗 -->
            <tradeMerchantDialog :title="tradeMerchantDialog.title" :dialogTableVisible.sync="tradeMerchantDialog.tradeMerchantDialogVisible" ref="tradeMerchantDialog" @callBack="handleTradeMerchantCallBack" :channelNature="'2'"></tradeMerchantDialog>
            <!-- 交易影院弹窗-弃用 -->
            <!-- <cinemaDialog :title="cinemaDialog.title" :dialogTableVisible.sync="cinemaDialog.cinemaDialogVisible" ref="cinemaTradeDialog" @callBack="handleTradeCinemaCallBack"></cinemaDialog> -->
            <!-- 影院行政区域弹窗（新） -->
            <orgStructureDialog :title="orgStructureDialog.title" :dialogTableVisible.sync="orgStructureDialog.orgStructureDialogVisible" ref="orgStructureDialog"  @callBack="handleOrgStructureBack"></orgStructureDialog>
            <!-- 影院行政区域弹窗（旧）-弃用 -->
            <!-- <cinemaAdminRegionDialog :title="cinemaAdminRegionDialog.title" :dialogTableVisible.sync="cinemaAdminRegionDialog.cinemaAdminRegionDialogVisible" ref="cinemaAdminRegionDialog" @callBack="handleCinemaAdminRegionCallBack"></cinemaAdminRegionDialog> -->
            <!-- 放映效果弹窗 -->
            <projectionEffectDialog :title="projectionEffectDialog.title" :dialogTableVisible.sync="projectionEffectDialog.projectionEffectDialogVisible" ref="projectionEffectDialog" @callBack="handleProjectionEffectCallBack"></projectionEffectDialog>
            <!-- 注册影院弹窗 -->
            <cinemaDialog :title="cinemaDialog.title" :dialogTableVisible.sync="cinemaDialog.cinemaDialogVisible" ref="cinemaRegisterDialog" @callBack="handleRegisterCinemaCallBack"></cinemaDialog>
            <!-- 影片弹窗 -->
            <filmDialog :title="filmDialog.title" :dialogTableVisible.sync="filmDialog.filmDialogVisible" ref="filmDialog" @callBack="handleFilmCallBack"></filmDialog>
            <!-- 影片类型弹窗 -->
            <filmTypeDialog :title="filmTypeDialog.title" :dialogTableVisible.sync="filmTypeDialog.filmTypeDialogVisible" ref="filmTypeDialog" @callBack="handleFilmTypeCallBack"></filmTypeDialog>
            <!-- 影厅类型弹窗 -->
            <cinemaTypeDialog :title="cinemaTypeDialog.title" :dialogTableVisible.sync="cinemaTypeDialog.cinemaTypeDialogVisible" ref="cinemaTypeDialog" @callBack="handleCinemaTypeCallBack"></cinemaTypeDialog>
            <!-- 票券批次弹窗 -->
            <couponBatchDialog :title="couponBatchDialog.title" :dialogTableVisible.sync="couponBatchDialog.couponBatchDialogVisible" ref="couponBatchDialog" @callBack="handleCouponBatchCallBack"></couponBatchDialog>
            <!-- 票券批次单选弹窗 -->
            <couponBatchSingleDialog :title="couponBatchSingleDialog.title" :dialogTableVisible.sync="couponBatchSingleDialog.couponBatchSingleDialogVisible" ref="couponBatchSingleDialog" @callBack="handleCouponBatchSingleCallBack"></couponBatchSingleDialog>
            <!-- 会员卡政策弹窗 -->
            <crmCardPolicyDialog @crmCardPolicyDialogCallBack="handleCardPolicy" :whereUse="crmCardPolicyDialogWhereUse" :reviewData="reviewCrmCardPolicyTypeData" :dialogVisible.sync="crmCardPolicyDialogVisible" :unique="crmCardPolicyDialogUnique"/>
            <!-- 会员等级弹窗 -->
            <crmMemberLevelDialog @crmMemberLevelDialogCallBack="handleMembershipLevel" :whereUse="crmMemberLevelDialogWhereUse" :reviewData="reviewCrmMemberLevelData" :dialogVisible.sync="crmMemberLevelDialogVisible" />
            <!-- 会员卡类型弹窗 -->
            <crmCardTypeDialog @crmCardTypeDialogCallBack="handleCardshipType" :whereUse="crmCardTypeDialogWhereUse" :reviewData="reviewCrmCardTypeData" :dialogVisible.sync="crmCardTypeDialogVisible" />
        </section>
    </div>
</template>

<script>
import FixStepTool from "../../../components/fix-step-tool/fix-step-tool";
import fixStepMixin from "../../../mixins/marketing/fixStepTool.js";
import alertHandle from 'cmmSrc/mixins/marketing/alertHandle.js'
import mixinBasicDataRule from 'cmmSrc/mixins/rules/rule.js'
import qs from "qs";

import Actions from "./actions.json";
// import minxins from 'frame_cpm/mixins/cacheMixin.js'
import RuleConditions from "./ruleConditions.json";
import commonTableVue from '../../../components/Table/commonTable.vue';

const { cacheMixin } = requireModule('base');

// 活动条件(key 等于key+groupId 必须保证key的唯一性)
//会员类
const memberOptions = [
    { key: "birthday7", value: "生日" },
    { key: "sex8", value: "性别" },
    { key: "age9", value: "年龄" },
    { key: "openMonths87", value: "开卡月限" },
    { key: "openYears11", value: "开卡年限" },
    { key: "openDate12", value: "开卡日期" },    
    { key: "registerBusinessCode13", value: "注册影院" },
    { key: "balance3", value: "账户余额" },
    { key: "integral4", value: "积分余额" },
    { key: "integralTotall52", value: "累计积分" },
    { key: "sumPrice2", value: "单次消费金额" },
    { key: "consumeSum6", value: "累计消费金额" },
    { key: "cardTypeKey10", value: "会员卡类型" },
    { key: "cardRightCode100", value: "会员卡政策" },
    { key: "customerLevelCode101", value: "会员等级" },
    { key: "firstRecharge98", value: "首充金额" },
    { key: "sumPrice1", value: "单次充值金额" },
    { key: "chargeSum50", value: "累计充值金额" },
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
    // { key: "saleItemType100", value: "商品类型" },
    // { key: "consumeWayCode32", value: "交易渠道" },
    { key: "price31", value: "商品单价" },
    { key: "filmPrice92", value: "影票单价" },
    { key: "merPrice93", value: "卖品单价" },
    { key: "filmTicketAmount80", value: "影票商品数量" },
    { key: "filmSumPrice90", value: "影票总金额" },
    { key: "merSumPrice91", value: "卖品总金额" },
    { key: "sumPrice26", value: "整单交易金额" },
    {
        key: "buyNum",
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

//执行方法(key 等于key+groupId 必须保证key的唯一性)
//会员类
const memberActions = [
    { key: "presentPoint1", value: "赠送积分" },
    { key: "pointPersent18", value: "赠送积分倍率" },
    { key: "presentMoney2", value: "赠送会员卡储值额" },
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
            { key: "merKey9", value: "商品" },
            { key: "modifyWay9", value: "调价方式" },
            { key: "modifyValue9", value: "调价值" },
            { key: "addAmountAfterDiscount9",  value: "折扣后加减N元" },
            { key: "integralAmount9", value: "积分定价(分)" },
            { key: "integralMoney9", value: "加金额(元)" },
            { key: "decimalRoundMode9", value: "折后取整方式" },
            { key: "modifyAmountMethod9", value: "调价商品数量" },
            { key: "modifyAmount9",  value: "数量" }
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
            { key: "modifyAmountMethod28",  value: "调价商品数量" },
            { key: "modifyAmount28", value: "数量" }
        ]
    }
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
//放映星期范围-指定星期范围
const weekOptions = [
    { label: "周一", value: "1" },
    { label: "周二", value: "2" },
    { label: "周三", value: "3" },
    { label: "周四", value: "4" },
    { label: "周五", value: "5" },
    { label: "周六", value: "6" },
    { label: "周日", value: "7" }
];
export default {
    props:{
        //数据迁移状态(临时状态)
        transferStatus: {
            type: Number,
            default: 0
        },
    },
    mixins: [fixStepMixin,alertHandle,mixinBasicDataRule,cacheMixin.cacheMixin],
    components: {
        fixStepTool:FixStepTool,
    },
    data() {
        return {
            //缓存对象数据
            cacheField: ["basicDataForm","activityId","transferStatus","checkedMemberOption","checkedTradeOption","checkedTicketsOption","checkedGoodsOption","selectedOptions",
                        "checkedMemberAction","checkedTradeAction","checkedTicketsAction","selectedActions","index"],        
            //限制过去时间不可选
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                }
            },
            //折叠区域
            activeNames: ["1", "2", "3"],
            //步骤条数据
            stepData: {
                stepEl: ".el-collapse-item",
                stepList: [{
                        name: "子活动基础信息",
                        isactive: false
                    },
                    {
                        name: "子活动适用条件",
                        isactive: false
                    },
                    {
                        name: "子活动执行方式",
                        isactive: false
                    }
                ]
            },
            //子活动-活动条件
            memberOptions: memberOptions,//活动条件-会员类选项
            tradeOptions: tradeOptions,//活动条件-交易类选项
            movieTicketsOptions: movieTicketsOptions,//活动条件-影票类选项
            goodsOptions: goodsOptions,//活动条件-卖品类选项

            checkedMemberOption: [],//活动条件-会员类-页面渲染数组
            checkedTradeOption: [],//活动条件-交易类-页面渲染数组
            checkedTicketsOption: [],//活动条件-影票类-页面渲染数组
            checkedGoodsOption: [],//活动条件-卖品类-页面渲染数组
            selectedOptions: [],//活动条件-已选择-页面渲染数组

            //子活动-执行条件
            memberActions: memberActions,//执行条件-会员类选项
            tradeActions: tradeActions,//执行条件-交易类选项
            movieTicketsActions: movieTicketsActions,//执行条件-影票类选项

            checkedMemberAction: [],//执行条件-会员类-页面渲染数组
            checkedTradeAction: [],//执行条件-交易类-页面渲染数组
            checkedTicketsAction: [],//执行条件-影票类-页面渲染数组
            selectedActions: [],//执行条件-已选择-页面渲染数组

            weekOptions: weekOptions,//放映星期范围-指定星期范围选项

            activityId: "",//活动的id
            isEdit: "add", //页面状态
            index: "", //记录子活动下标值
            disabled: false,//是否可以选中页面中的元素（当前阶段抽离了查看页，应该全部去掉disabled）
            activeName: "first",//活动条件label 例如页面中的 会员类
            activeName1: "first1",//执行条件label 例如页面中的 会员类
            //活动基本信息
            basicDataForm: {
                activityName: "",//活动名称
                //------------活动条件-会员类-------------
                //生日
                birthday7: { 
                    opUniqueName: "", 
                    value: "" 
                },
                //年龄-区间
                ageRange: [
                    { minAge: "", maxAge: "" }
                ],
                //年龄
                age9: { 
                    opUniqueName: "",
                    value: "",
                    valueRange: "" 
                },
                //性别
                sex8: { 
                    opUniqueName: "",
                    value: "" 
                },
                //性别-组装数组
                sexState: [],
                sexStateName: [],
                //会员卡政策
                cardRightCode100: {
                    opUniqueName: "",
                    value: "",
                    text: ""
                },
                //会员等级
                customerLevelCode101: {
                    opUniqueName: "",
                    value: "",
                    text: ""
                },
                //会员卡类型
                cardTypeKey10: {
                    opUniqueName: "",
                    value: "",
                    text: ""
                },
                //开卡年限
                openYears11: {
                    opUniqueName: "",
                    value: "",
                    valueRange: ""
                },
                //开卡年限-区间
                openCardYearsRange: [{
                    minYear: "",
                    maxYear: ""
                }],
                //开卡月限
                openMonths87: {
                    opUniqueName: "",
                    value: "",
                    valueRange: ""
                },
                //开卡月限-区间
                openMonthsRange: [{
                    minMonth: "",
                    maxMonth: ""
                }],
                //开卡日期
                openDate12: {
                    opUniqueName: "",
                    value: "",
                    valueRange: ""
                },
                //开卡日期-区间
                openCardDateOptions: [{
                    openDateCardOption: ""
                }],
                //账户余额
                balance3: {
                    opUniqueName: "",
                    value: ""
                },
                //积分余额
                integral4: {
                    opUniqueName: "",
                    value: ""
                },
                //累计积分
                integralTotall52: {
                    opUniqueName: "",
                    value: ""
                },
                //注册影院
                registerBusinessCode13: {
                    opUniqueName: "",
                    value: "",
                    text: ""
                },
                //单次消费金额
                sumPrice2: {
                    opUniqueName: "",
                    value: ""
                },
                //累计消费金额
                consumeSum6: {
                    opUniqueName: "",
                    value: ""
                },
                //首充金额
                firstRecharge98: {
                    opUniqueName: "",
                    value: ""
                },
                //单次充值金额
                sumPrice1: {
                    opUniqueName: "",
                    value: ""
                },
                //累计充值金额
                chargeSum50: {
                    opUniqueName: "",
                    value: ""
                },
                //动态周期消费次数
                // consumeNum: {
                //     dynamicPeriod15: {
                //         opUniqueName: "normalEqual",
                //         text: "",
                //         value: ""
                //     },
                //     appointPeriod15: {
                //         opUniqueName: "",
                //         value: "",
                //         text: ""
                //     },
                //     consumeWayCode15: {
                //         opUniqueName: "",
                //         value: "",
                //         text: ""
                //     },
                //     dynamicConsumeCount15: {
                //         opUniqueName: "",
                //         value: "",
                //         text: ""
                //     }
                // },
                // appointPeriodOptions: [{
                //     appointPeriodOption: ""
                // }],
                // 动态周期消费额
                // cycleConsumeNum: {
                //     dynamicPeriod17: {
                //         opUniqueName: "normalEqual",
                //         text: "",
                //         value: ""
                //     },
                //     appointPeriod17: {
                //         opUniqueName: "",
                //         value: "",
                //         text: ""
                //     },
                //     consumeWayCode17: {
                //         opUniqueName: "",
                //         value: "",
                //         text: ""
                //     },
                //     saleItemType17: {
                //         opUniqueName: "",
                //         value: "",
                //         text: ""
                //     },
                //     dynamicConsumeSum17: {
                //         opUniqueName: "",
                //         value: "",
                //         text: ""
                //     }
                // },
                // goodsItemTypeState:[],
                // goodsItemTypeStateName: [],
                // appointPeriodOptions17: [{
                //     appointPeriodOption17: ""
                // }],

                //--------------活动条件-影票类------------
                //放映效果
                showEffect35: {
                    opUniqueName: "",
                    value: "",
                    text: ""
                },
                //影厅类型
                hallTypeKey36: {
                    opUniqueName: "",
                    value: "",
                    text: ""
                },
                //影片
                uniformCode79: {
                    opUniqueName: "",
                    value: "",
                    text: ""
                },
                //影片类型
                filmTypeKey34: {
                    opUniqueName: "",
                    value: "",
                    text: ""
                },
                //放映有效期
                planStartTime81: {
                    opUniqueName: "",
                    value: "",
                    valueRange: ""
                },
                screeningValidityOption: [],
                //放映星期范围
                filmPlanWeekRange83: {
                    opUniqueName: "",
                    value: ""
                },
                //放映星期范围-组装数组
                weekRangeState: [],
                weekRangeStateName: [],
                //放映时段范围
                filmPlanTimeRange84: {
                    opUniqueName: "",
                    value: "",
                    valueRange: ""
                },
                //放映时段范围-区间
                screeningPeriodOptions: [{
                    screeningPeriodOption: ""
                }],
                //放映排除日期
                filmPlanInvalidTime82: {
                    opUniqueName: "",
                    opUniqueName2: "",
                    value: "",
                    valueRange: ""
                },
                //指定排除日期
                excludeDate: [],
                //指定排除日期-选项
                excludeDateOptions: [{
                    excludeDateOption: ""
                }], 
                //最低发行价
                lowestPrice38: {
                    opUniqueName: "",
                    value: ""
                },
                //座位等级
                seatGrade89: {
                    opUniqueName: "normalIn",
                    value: ""
                },
                //座位等级-组装数组
                seatLevelState: [],
                seatLevelStateName: [],
                //放映厅座位数
                hallSeatAmout37: {
                    opUniqueName: "",
                    value: ""
                },
                //----------活动条件-卖品类----------
                //品牌
                brandId40: {
                    opUniqueName: "",
                    value: "",
                    text: ""
                },
                //类别
                classCode41: {
                    opUniqueName: "",
                    value: "",
                    text: ""
                },
                // 商品名称
                merKey46: {
                    opUniqueName: "",
                    value: "",
                    text: ""
                },
                // // 店内码
                // merCode42: {
                //     opUniqueName: "",
                //     value: ""
                // },
                // // 国际条码
                // merBarCode43: {
                //     opUniqueName: "",
                //     value: ""
                // },

                //------------活动条件-交易类-----------
                //交易影院
                // cinemaCode19: {
                //     opUniqueName: "",
                //     value: "",
                //     text: ""
                // },
                //交易影院行政区域
                cinemaAreaId25: {
                    opUniqueName: "",
                    value: "",
                    text: ""
                },
                //交易客商
                // businessCode14: {
                //     opUniqueName: "",
                //     value: "",
                //     text: ""
                // },
                //交易渠道
                // consumeWayCode32: {
                //     opUniqueName: "",
                //     value: "",
                //     text:'',
                // },
                //交易渠道-组装数组
                // tradeChannelState: [],
                // tradeChannelStateName: [],
                // 交易类型
                // tradeType33: {
                //     opUniqueName: "",
                //     value: "",
                //     text:''
                // },
                //交易类型-组装数组
                // tradeTypeState: [],
                // tradeTypeStateName: [],
                //商品类型-组装数组
                // SaleItemTypeState:[],
                // SaleItemTypeStateName: [],
                //交易渠道
                // consumeWayState:[],
                // consumeWayStateName:[],

                // cycleConsumeWayState:[],
                // cycleConsumeWayStateName:[],
                //消费者身份
                // consumerTypeKey27: {
                //     opUniqueName: "AllMember",
                //     value: "",
                //     text: ""
                // },
                //商品单价
                price31: {
                    opUniqueName: "",
                    value: ""
                },
                //商品类型
                // saleItemType100: {
                //     opUniqueName: "",
                //     value: "",
                //     text:''
                // },
                //影票单价
                filmPrice92: {
                    opUniqueName: "",
                    value: ""
                },
                //卖品单价
                merPrice93: {
                    opUniqueName: "",
                    value: ""
                },
                //影票商品数量
                filmTicketAmount80: {
                    opUniqueName: "",
                    value: ""
                },
                //影票总金额
                filmSumPrice90: {
                    opUniqueName: "",
                    value: ""
                },
                //卖品总金额
                merSumPrice91: {
                    opUniqueName: "",
                    value: ""
                },
                //整单交易金额
                sumPrice26: {
                    opUniqueName: "",
                    value: ""
                },
                //指定商品购买数量
                buyNum: {
                    //商品名称
                    merKey21: {
                        opUniqueName: "normalIn",
                        value: "",
                        text: ""
                    },
                    //数量
                    amount21: {
                        opUniqueName: "",
                        value: ""
                    }
                },
                //同类商品累计购买数量
                buyNumByType: {
                    //商品类别
                    classCode28: {
                        opUniqueName: "normalIn",
                        value: "",
                        text: ""
                    },
                    //累计购买数量
                    sumAmount28: {
                        opUniqueName: "",
                        value: ""
                    }
                },
                // 同品牌商品累计购买数量
                buyNumByBrand: {
                    //商品品牌
                    brandId29: {
                        opUniqueName: "normalIn",
                        value: "",
                        text: ""
                    },
                    //累计购买数量
                    sumAmount29: {
                        opUniqueName: "",
                        value: ""
                    }
                },
                //支付方式
                payTypeCode86: {
                    opUniqueName: "",
                    value: "",
                    text: ""
                },
                //放映前N天
                filmStartDayBefore94: {
                    opUniqueName: "",
                    value: ""
                },
                //放映前N小时
                filmStartHourBefore95: {
                    opUniqueName: "",
                    value: ""
                },
                //首次购票
                firstBuyTicket96: {
                    opUniqueName: "normalEqual",
                    value: "true"
                },
                //--------------执行方法-会员类------------------
                //赠送积分
                presentPoint1: {
                    value: ""
                },
                //赠送积分倍率
                pointPersent18: {
                    value: ""
                },
                //赠送会员卡储值额
                presentMoney2: {
                    value: ""
                },
                //赠送票券
                giftTicket: {
                    //票券名称
                    couponApplyCode3: {
                        value: "",
                        text: ""
                    },
                    //数量
                    amount3: {
                        value: ""
                    },
                    //是否发送短信
                    isSendSms3: {
                        value: ""
                    }
                },
                //--------------执行方法-影票类------------------
                //按座位等级调整票价
                updateTicketPriceBySeatGrade: {
                    //调价方式
                    modifyWay29: {
                        value: ""
                    },
                    //调整额
                    modifyValue29: {
                        value: ""
                    },
                    //折扣后加减N元
                    addAmountAfterDiscount29: {
                        value: ""
                    },
                    //积分定价(分)
                    integralAmount29: {
                        value: ""
                    },
                    //加金额（元）
                    integralMoney29: {
                        value: ""
                    },
                    //折后取整方式
                    decimalRoundMode29: {
                        value: "ROUND_UNNECESSARY"
                    },
                    //低于最低价时
                    lessProcessMethod29: {
                        value: "notAllowSale"
                    },
                    //影院补贴N元
                    cinemaPayAmount29: {
                        value: ""
                    },
                    //调价商品数量
                    modifyAmountMethod29: {
                        value: ""
                    },
                    //数量
                    modifyAmount29: {
                        value: ""
                    },
                    //座位等级
                    seatGrade29: {
                        value: ""
                    }
                },
                //座位等级数组的value
                action_seatLevel: [],
                //座位等级数组的label
                action_seatLevelName: [],
                //修改单票售价
                updateTicketPrice: {
                    //调价方式
                    modifyWay15: {
                        value: ""
                    },
                    //调整额
                    modifyValue15: {
                        value: ""
                    },
                    //折扣后加减N元
                    addAmountAfterDiscount15: {
                        value: ""
                    },
                    //积分定价(分)
                    integralAmount15: {
                        value: ""
                    },
                    //加金额（元）
                    integralMoney15: {
                        value: ""
                    },
                    //折后取整方式
                    decimalRoundMode15: {
                        value: "ROUND_UNNECESSARY"
                    },
                    //低于最低价时
                    lessProcessMethod15: {
                        value: "notAllowSale"
                    },
                    //影院补贴N元
                    cinemaPayAmount15: {
                        value: ""
                    },
                    //调价商品数量
                    modifyAmountMethod15: {
                        value: ""
                    },
                    //数量
                    modifyAmount15: {
                        value: ""
                    }
                },
                //--------------执行方法-交易类------------------
                //单品优惠价调整
                judgeDiscountPrice: {
                    //商品
                    merKey9: {
                        value: "",
                        text: ""
                    },
                    //调价方式
                    modifyWay9: {
                        value: ""
                    },
                    //调价值
                    modifyValue9: {
                        value: ""
                    },
                    //折扣后加减N元
                    addAmountAfterDiscount9: {
                        value: ""
                    },
                    //积分定价(分)
                    integralAmount9: {
                        value: ""
                    },
                    //加金额(元)
                    integralMoney9: {
                        value: ""
                    },
                    //折后取整方式
                    decimalRoundMode9: {
                        value: "ROUND_UNNECESSARY"
                    },
                    //调价商品数量
                    modifyAmountMethod9: {
                        value: ""
                    },
                    //数量
                    modifyAmount9: {
                        value: ""
                    }
                },
                //以优惠价格增加单品
                addGoodsWithDiscountPrice: {
                    //商品
                    merKey10: {
                        value: "",
                        text: ""
                    },
                    //商品单价
                    price10: {
                        value: ""
                    },
                    //增加数量
                    amount10: {
                        value: ""
                    }
                },
                //赠送商品
                giftGoods: {
                    //商品
                    merKey11: {
                        value: "",
                        text: ""
                    },
                    //商品单价
                    price11: {
                        value: ''
                    },
                    //赠送数量
                    amount11: {
                        value: ""
                    }
                },
                //卖品分类优惠价调整
                judgeDiscountPriceByType: {
                    //商品分类
                    merCategoryMethod27: {
                        value: "appointCategory"
                    },
                    //分类
                    classCode27: {
                        value: "",
                        text: ""
                    },
                    //调价方式
                    modifyWay27: {
                        value: ""
                    },
                    //调价值
                    modifyValue27: {
                        value: ""
                    },
                    //折扣后加减N元
                    addAmountAfterDiscount27: {
                        value: ""
                    },
                    //折后取整方式
                    decimalRoundMode27: {
                        value: "ROUND_UNNECESSARY"
                    },
                    //调价商品数量
                    modifyAmountMethod27: {
                        value: ""
                    },
                    //数量
                    modifyAmount27: {
                        value: ""
                    }
                },
                //按品牌优惠价调整
                judgeDiscountPriceByBrand: {
                    //商品品牌
                    merBrandMethod28: {
                        value: ""
                    },
                    //品牌
                    brandId28: {
                        value: "",
                        text: ""
                    },
                    //调价方式
                    modifyWay28: {
                        value: ""
                    },
                    //调价值
                    modifyValue28: {
                        value: ""
                    },
                    //折扣后加减N元
                    addAmountAfterDiscount28: {
                        value: ""
                    },
                    //折后取整方式
                    decimalRoundMode28: {
                        value: "ROUND_UNNECESSARY"
                    },
                    //调价商品数量
                    modifyAmountMethod28: {
                        value: ""
                    },
                    //数量
                    modifyAmount28: {
                        value: ""
                    }
                }
            }
        };
    },
    created() {
       
    },
    methods: {
        //初始化
        init(rule, index ,isStorage) {
            if (isStorage) {
                console.log("取缓存数据")
            }else{
                this.index = index+"";
            }
            if (rule) {
                this.isEdit = "update";
            }
            if (this.isEdit == "update") {
                this.basicDataForm = rule.formData;//活动基本信息
                if(isStorage == false){
                    this.selectedOptions = rule.conditions;//活动条件
                    this.selectedActions = rule.actions;//活动执行方法
                }
                //回显处理活动条件部分结构
                this.showRuleConditionsItem(rule)
                //回显全部活动条件
                this.showRuleConditionsAll()
                //回显全部执行方法
                this.showActionsAll()
                //默认显示有数据的标签项
                this.showOptionRules()
            }
            if(this.isEdit == "add"){
                if(isStorage == true){
                    this.checkedMemberOption=[];//活动条件-会员类-页面渲染数组
                    this.checkedTradeOption=[];//活动条件-交易类-页面渲染数组
                    this.checkedTicketsOption=[];//活动条件-影票类-页面渲染数组
                    this.checkedGoodsOption=[];//活动条件-卖品类-页面渲染数组
                    this.selectedOptions=[];//活动条件-已选择-页面渲染数组
                    this.checkedMemberAction=[];//执行条件-会员类-页面渲染数组
                    this.checkedTradeAction=[];//执行条件-交易类-页面渲染数组
                    this.checkedTicketsAction=[];//执行条件-影票类-页面渲染数组
                    this.selectedActions=[];//执行条件-已选择-页面渲染数组
                    this.index="";
                    this.basicDataForm= {
                        activityName: "",//活动名称
                        //------------活动条件-会员类-------------
                        //生日
                        birthday7: { 
                            opUniqueName: "", 
                            value: "" 
                        },
                        //年龄-区间
                        ageRange: [
                            { minAge: "", maxAge: "" }
                        ],
                        //年龄
                        age9: { 
                            opUniqueName: "",
                            value: "",
                            valueRange: "" 
                        },
                        //性别
                        sex8: { 
                            opUniqueName: "",
                            value: "" 
                        },
                        //性别-组装数组
                        sexState: [],
                        sexStateName: [],
                        //会员卡政策
                        cardRightCode100: {
                            opUniqueName: "",
                            value: "",
                            text: ""
                        },
                        //会员等级
                        customerLevelCode101: {
                            opUniqueName: "",
                            value: "",
                            text: ""
                        },
                        //会员卡类型
                        cardTypeKey10: {
                            opUniqueName: "",
                            value: "",
                            text: ""
                        },
                        //开卡年限
                        openYears11: {
                            opUniqueName: "",
                            value: "",
                            valueRange: ""
                        },
                        //开卡年限-区间
                        openCardYearsRange: [{
                            minYear: "",
                            maxYear: ""
                        }],
                        //开卡月限
                        openMonths87: {
                            opUniqueName: "",
                            value: "",
                            valueRange: ""
                        },
                        //开卡月限-区间
                        openMonthsRange: [{
                            minMonth: "",
                            maxMonth: ""
                        }],
                        //开卡日期
                        openDate12: {
                            opUniqueName: "",
                            value: "",
                            valueRange: ""
                        },
                        //开卡日期-区间
                        openCardDateOptions: [{
                            openDateCardOption: ""
                        }],
                        //账户余额
                        balance3: {
                            opUniqueName: "",
                            value: ""
                        },
                        //积分余额
                        integral4: {
                            opUniqueName: "",
                            value: ""
                        },
                        //累计积分
                        integralTotall52: {
                            opUniqueName: "",
                            value: ""
                        },
                        //注册影院
                        registerBusinessCode13: {
                            opUniqueName: "",
                            value: "",
                            text: ""
                        },
                        //单次消费金额
                        sumPrice2: {
                            opUniqueName: "",
                            value: ""
                        },
                        //累计消费金额
                        consumeSum6: {
                            opUniqueName: "",
                            value: ""
                        },
                        //首充金额
                        firstRecharge98: {
                            opUniqueName: "",
                            value: ""
                        },
                        //单次充值金额
                        sumPrice1: {
                            opUniqueName: "",
                            value: ""
                        },
                        //累计充值金额
                        chargeSum50: {
                            opUniqueName: "",
                            value: ""
                        },
                        //动态周期消费次数
                        // consumeNum: {
                        //     dynamicPeriod15: {
                        //         opUniqueName: "normalEqual",
                        //         text: "",
                        //         value: ""
                        //     },
                        //     appointPeriod15: {
                        //         opUniqueName: "",
                        //         value: "",
                        //         text: ""
                        //     },
                        //     consumeWayCode15: {
                        //         opUniqueName: "",
                        //         value: "",
                        //         text: ""
                        //     },
                        //     dynamicConsumeCount15: {
                        //         opUniqueName: "",
                        //         value: "",
                        //         text: ""
                        //     }
                        // },
                        // appointPeriodOptions: [{
                        //     appointPeriodOption: ""
                        // }],
                        // 动态周期消费额
                        // cycleConsumeNum: {
                        //     dynamicPeriod17: {
                        //         opUniqueName: "normalEqual",
                        //         text: "",
                        //         value: ""
                        //     },
                        //     appointPeriod17: {
                        //         opUniqueName: "",
                        //         value: "",
                        //         text: ""
                        //     },
                        //     consumeWayCode17: {
                        //         opUniqueName: "",
                        //         value: "",
                        //         text: ""
                        //     },
                        //     saleItemType17: {
                        //         opUniqueName: "",
                        //         value: "",
                        //         text: ""
                        //     },
                        //     dynamicConsumeSum17: {
                        //         opUniqueName: "",
                        //         value: "",
                        //         text: ""
                        //     }
                        // },
                        // goodsItemTypeState:[],
                        // goodsItemTypeStateName: [],
                        // appointPeriodOptions17: [{
                        //     appointPeriodOption17: ""
                        // }],

                        //--------------活动条件-影票类------------
                        //放映效果
                        showEffect35: {
                            opUniqueName: "",
                            value: "",
                            text: ""
                        },
                        //影厅类型
                        hallTypeKey36: {
                            opUniqueName: "",
                            value: "",
                            text: ""
                        },
                        //影片
                        uniformCode79: {
                            opUniqueName: "",
                            value: "",
                            text: ""
                        },
                        //影片类型
                        filmTypeKey34: {
                            opUniqueName: "",
                            value: "",
                            text: ""
                        },
                        //放映有效期
                        planStartTime81: {
                            opUniqueName: "",
                            value: "",
                            valueRange: ""
                        },
                        screeningValidityOption: [],
                        //放映星期范围
                        filmPlanWeekRange83: {
                            opUniqueName: "",
                            value: ""
                        },
                        //放映星期范围-组装数组
                        weekRangeState: [],
                        weekRangeStateName: [],
                        //放映时段范围
                        filmPlanTimeRange84: {
                            opUniqueName: "",
                            value: "",
                            valueRange: ""
                        },
                        //放映时段范围-区间
                        screeningPeriodOptions: [{
                            screeningPeriodOption: ""
                        }],
                        //放映排除日期
                        filmPlanInvalidTime82: {
                            opUniqueName: "",
                            opUniqueName2: "",
                            value: "",
                            valueRange: ""
                        },
                        //指定排除日期
                        excludeDate: [],
                        //指定排除日期-选项
                        excludeDateOptions: [{
                            excludeDateOption: ""
                        }], 
                        //最低发行价
                        lowestPrice38: {
                            opUniqueName: "",
                            value: ""
                        },
                        //座位等级
                        seatGrade89: {
                            opUniqueName: "normalIn",
                            value: ""
                        },
                        //座位等级-组装数组
                        seatLevelState: [],
                        seatLevelStateName: [],
                        //放映厅座位数
                        hallSeatAmout37: {
                            opUniqueName: "",
                            value: ""
                        },
                        //----------活动条件-卖品类----------
                        //品牌
                        brandId40: {
                            opUniqueName: "",
                            value: "",
                            text: ""
                        },
                        //类别
                        classCode41: {
                            opUniqueName: "",
                            value: "",
                            text: ""
                        },
                        // 商品名称
                        merKey46: {
                            opUniqueName: "",
                            value: "",
                            text: ""
                        },
                        // // 店内码
                        // merCode42: {
                        //     opUniqueName: "",
                        //     value: ""
                        // },
                        // // 国际条码
                        // merBarCode43: {
                        //     opUniqueName: "",
                        //     value: ""
                        // },

                        //------------活动条件-交易类-----------
                        //交易影院
                        // cinemaCode19: {
                        //     opUniqueName: "",
                        //     value: "",
                        //     text: ""
                        // },
                        //交易影院行政区域
                        cinemaAreaId25: {
                            opUniqueName: "",
                            value: "",
                            text: ""
                        },
                        //交易客商
                        // businessCode14: {
                        //     opUniqueName: "",
                        //     value: "",
                        //     text: ""
                        // },
                        //交易渠道
                        // consumeWayCode32: {
                        //     opUniqueName: "",
                        //     value: "",
                        //     text:'',
                        // },
                        //交易渠道-组装数组
                        // tradeChannelState: [],
                        // tradeChannelStateName: [],
                        // 交易类型
                        // tradeType33: {
                        //     opUniqueName: "",
                        //     value: "",
                        //     text:''
                        // },
                        //交易类型-组装数组
                        // tradeTypeState: [],
                        // tradeTypeStateName: [],
                        //商品类型-组装数组
                        // SaleItemTypeState:[],
                        // SaleItemTypeStateName: [],
                        //交易渠道
                        // consumeWayState:[],
                        // consumeWayStateName:[],

                        // cycleConsumeWayState:[],
                        // cycleConsumeWayStateName:[],
                        //消费者身份
                        // consumerTypeKey27: {
                        //     opUniqueName: "AllMember",
                        //     value: "",
                        //     text: ""
                        // },
                        //商品单价
                        price31: {
                            opUniqueName: "",
                            value: ""
                        },
                        //商品类型
                        // saleItemType100: {
                        //     opUniqueName: "",
                        //     value: "",
                        //     text:''
                        // },
                        //影票单价
                        filmPrice92: {
                            opUniqueName: "",
                            value: ""
                        },
                        //卖品单价
                        merPrice93: {
                            opUniqueName: "",
                            value: ""
                        },
                        //影票商品数量
                        filmTicketAmount80: {
                            opUniqueName: "",
                            value: ""
                        },
                        //影票总金额
                        filmSumPrice90: {
                            opUniqueName: "",
                            value: ""
                        },
                        //卖品总金额
                        merSumPrice91: {
                            opUniqueName: "",
                            value: ""
                        },
                        //整单交易金额
                        sumPrice26: {
                            opUniqueName: "",
                            value: ""
                        },
                        //指定商品购买数量
                        buyNum: {
                            //商品名称
                            merKey21: {
                                opUniqueName: "normalIn",
                                value: "",
                                text: ""
                            },
                            //数量
                            amount21: {
                                opUniqueName: "",
                                value: ""
                            }
                        },
                        //同类商品累计购买数量
                        buyNumByType: {
                            //商品类别
                            classCode28: {
                                opUniqueName: "normalIn",
                                value: "",
                                text: ""
                            },
                            //累计购买数量
                            sumAmount28: {
                                opUniqueName: "",
                                value: ""
                            }
                        },
                        // 同品牌商品累计购买数量
                        buyNumByBrand: {
                            //商品品牌
                            brandId29: {
                                opUniqueName: "normalIn",
                                value: "",
                                text: ""
                            },
                            //累计购买数量
                            sumAmount29: {
                                opUniqueName: "",
                                value: ""
                            }
                        },
                        //支付方式
                        payTypeCode86: {
                            opUniqueName: "",
                            value: "",
                            text: ""
                        },
                        //放映前N天
                        filmStartDayBefore94: {
                            opUniqueName: "",
                            value: ""
                        },
                        //放映前N小时
                        filmStartHourBefore95: {
                            opUniqueName: "",
                            value: ""
                        },
                        //首次购票
                        firstBuyTicket96: {
                            opUniqueName: "normalEqual",
                            value: "true"
                        },
                        //--------------执行方法-会员类------------------
                        //赠送积分
                        presentPoint1: {
                            value: ""
                        },
                        //赠送积分倍率
                        pointPersent18: {
                            value: ""
                        },
                        //赠送会员卡储值额
                        presentMoney2: {
                            value: ""
                        },
                        //赠送票券
                        giftTicket: {
                            //票券名称
                            couponApplyCode3: {
                                value: "",
                                text: ""
                            },
                            //数量
                            amount3: {
                                value: ""
                            },
                            //是否发送短信
                            isSendSms3: {
                                value: ""
                            }
                        },
                        //--------------执行方法-影票类------------------
                        //按座位等级调整票价
                        updateTicketPriceBySeatGrade: {
                            //调价方式
                            modifyWay29: {
                                value: ""
                            },
                            //调整额
                            modifyValue29: {
                                value: ""
                            },
                            //折扣后加减N元
                            addAmountAfterDiscount29: {
                                value: ""
                            },
                            //积分定价(分)
                            integralAmount29: {
                                value: ""
                            },
                            //加金额（元）
                            integralMoney29: {
                                value: ""
                            },
                            //折后取整方式
                            decimalRoundMode29: {
                                value: "ROUND_UNNECESSARY"
                            },
                            //低于最低价时
                            lessProcessMethod29: {
                                value: "notAllowSale"
                            },
                            //影院补贴N元
                            cinemaPayAmount29: {
                                value: ""
                            },
                            //调价商品数量
                            modifyAmountMethod29: {
                                value: ""
                            },
                            //数量
                            modifyAmount29: {
                                value: ""
                            },
                            //座位等级
                            seatGrade29: {
                                value: ""
                            }
                        },
                        //座位等级数组的value
                        action_seatLevel: [],
                        //座位等级数组的label
                        action_seatLevelName: [],
                        //修改单票售价
                        updateTicketPrice: {
                            //调价方式
                            modifyWay15: {
                                value: ""
                            },
                            //调整额
                            modifyValue15: {
                                value: ""
                            },
                            //折扣后加减N元
                            addAmountAfterDiscount15: {
                                value: ""
                            },
                            //积分定价(分)
                            integralAmount15: {
                                value: ""
                            },
                            //加金额（元）
                            integralMoney15: {
                                value: ""
                            },
                            //折后取整方式
                            decimalRoundMode15: {
                                value: "ROUND_UNNECESSARY"
                            },
                            //低于最低价时
                            lessProcessMethod15: {
                                value: "notAllowSale"
                            },
                            //影院补贴N元
                            cinemaPayAmount15: {
                                value: ""
                            },
                            //调价商品数量
                            modifyAmountMethod15: {
                                value: ""
                            },
                            //数量
                            modifyAmount15: {
                                value: ""
                            }
                        },
                        //--------------执行方法-交易类------------------
                        //单品优惠价调整
                        judgeDiscountPrice: {
                            //商品
                            merKey9: {
                                value: "",
                                text: ""
                            },
                            //调价方式
                            modifyWay9: {
                                value: ""
                            },
                            //调价值
                            modifyValue9: {
                                value: ""
                            },
                            //折扣后加减N元
                            addAmountAfterDiscount9: {
                                value: ""
                            },
                            //积分定价(分)
                            integralAmount9: {
                                value: ""
                            },
                            //加金额(元)
                            integralMoney9: {
                                value: ""
                            },
                            //折后取整方式
                            decimalRoundMode9: {
                                value: "ROUND_UNNECESSARY"
                            },
                            //调价商品数量
                            modifyAmountMethod9: {
                                value: ""
                            },
                            //数量
                            modifyAmount9: {
                                value: ""
                            }
                        },
                        //以优惠价格增加单品
                        addGoodsWithDiscountPrice: {
                            //商品
                            merKey10: {
                                value: "",
                                text: ""
                            },
                            //商品单价
                            price10: {
                                value: ""
                            },
                            //增加数量
                            amount10: {
                                value: ""
                            }
                        },
                        //赠送商品
                        giftGoods: {
                            //商品
                            merKey11: {
                                value: "",
                                text: ""
                            },
                            //商品单价
                            price11: {
                                value: ''
                            },
                            //赠送数量
                            amount11: {
                                value: ""
                            }
                        },
                        //卖品分类优惠价调整
                        judgeDiscountPriceByType: {
                            //商品分类
                            merCategoryMethod27: {
                                value: "appointCategory"
                            },
                            //分类
                            classCode27: {
                                value: "",
                                text: ""
                            },
                            //调价方式
                            modifyWay27: {
                                value: ""
                            },
                            //调价值
                            modifyValue27: {
                                value: ""
                            },
                            //折扣后加减N元
                            addAmountAfterDiscount27: {
                                value: ""
                            },
                            //折后取整方式
                            decimalRoundMode27: {
                                value: "ROUND_UNNECESSARY"
                            },
                            //调价商品数量
                            modifyAmountMethod27: {
                                value: ""
                            },
                            //数量
                            modifyAmount27: {
                                value: ""
                            }
                        },
                        //按品牌优惠价调整
                        judgeDiscountPriceByBrand: {
                            //商品品牌
                            merBrandMethod28: {
                                value: ""
                            },
                            //品牌
                            brandId28: {
                                value: "",
                                text: ""
                            },
                            //调价方式
                            modifyWay28: {
                                value: ""
                            },
                            //调价值
                            modifyValue28: {
                                value: ""
                            },
                            //折扣后加减N元
                            addAmountAfterDiscount28: {
                                value: ""
                            },
                            //折后取整方式
                            decimalRoundMode28: {
                                value: "ROUND_UNNECESSARY"
                            },
                            //调价商品数量
                            modifyAmountMethod28: {
                                value: ""
                            },
                            //数量
                            modifyAmount28: {
                                value: ""
                            }
                        }
                    }
                }
            }
            
        },
        //回显-处理活动条件部分结构（RuleCondition）
        showRuleConditionsItem(rule){
            //性别
            if(rule.formData["sex8"] && rule.formData["sex8"].value){
                this.basicDataForm.sexState =rule.formData["sex8"].value.split(",");
            }
            //年龄
            if(rule.formData["age9"] 
                && rule.formData["age9"].value
                && (rule.formData["age9"].opUniqueName=="BetweenOperator"
                || rule.formData["age9"].opUniqueName=="not_BetweenOperator")
            ){
                this.basicDataForm.ageRange=[]
                let arr=JSON.parse(rule.formData["age9"].value)
                arr.forEach(item=>{
                    this.basicDataForm.ageRange.push({
                        minAge: item[0],
                        maxAge:item[1]
                    });
                })
            }
            //开卡月限
            if(rule.formData["openMonths87"] 
                && rule.formData["openMonths87"].value
                && (rule.formData["openMonths87"].opUniqueName=="BetweenOperator"
                || rule.formData["openMonths87"].opUniqueName=="not_BetweenOperator")
            ){
                this.basicDataForm.openMonthsRange=[]
                let arr=JSON.parse(rule.formData["openMonths87"].value)
                arr.forEach(item=>{
                    this.basicDataForm.openMonthsRange.push({
                        minMonth:item[0],
                        maxMonth:item[1]
                    });
                })
            }
            //开卡年限
            if(rule.formData["openYears11"] 
                && rule.formData["openYears11"].value
                && (rule.formData["openYears11"].opUniqueName=="BetweenOperator"
                || rule.formData["openYears11"].opUniqueName=="not_BetweenOperator")
            ){
                this.basicDataForm.openCardYearsRange=[]
                let arr=JSON.parse(rule.formData["openYears11"].value)
                arr.forEach(item=>{
                    this.basicDataForm.openCardYearsRange.push({
                        minYear:item[0],
                        maxYear:item[1]
                    });
                })
            }
            //开卡日期
            if(rule.formData["openDate12"] 
                && rule.formData["openDate12"].value
                && (rule.formData["openDate12"].opUniqueName=="DateRangeContainOperator"
                || rule.formData["openDate12"].opUniqueName=="not_DateRangeContainOperator")
            ){
                let values12 = JSON.parse(rule.formData["openDate12"].value.split(","))
                this.basicDataForm.openCardDateOptions=[]
                for (let value12 of values12) {
                    let openCardDateOption = {
                        openCardDateOption: value12
                    };
                    this.basicDataForm.openCardDateOptions.push(openCardDateOption);
                }
            }
            //动态周期
            // if(rule.formData["consumeNum"] 
            //     && rule.formData["consumeNum"].appointPeriod15.value
            //     && (rule.formData["consumeNum"].appointPeriod15.opUniqueName=="AppointDateEqual")
            // ){
            //     let values15 = JSON.parse(rule.formData["consumeNum"].appointPeriod15.value.split(","))
            //     this.basicDataForm.appointPeriodOptions=[]
            //     for (let value15 of values15) {
            //         let appointPeriodOption = {
            //             appointPeriodOption: value15
            //         };
            //         this.basicDataForm.appointPeriodOptions.push(appointPeriodOption);
            //     }
            // }

            // if(rule.formData["cycleConsumeNum"] 
            //     && rule.formData["cycleConsumeNum"].appointPeriod17.value
            //     && (rule.formData["cycleConsumeNum"].appointPeriod17.opUniqueName=="AppointDateEqual")
            // ){
            //     let values17 = JSON.parse(rule.formData["cycleConsumeNum"].appointPeriod17.value.split(","))
            //     this.basicDataForm.appointPeriodOptions17=[]
            //     for (let value17 of values17) {
            //         let appointPeriodOption17 = {
            //             appointPeriodOption17: value17
            //         };
            //         this.basicDataForm.appointPeriodOptions17.push(appointPeriodOption17);
            //     }
            // }

            //交易类型
            // if(rule.formData["tradeType33"] 
            //     && rule.formData["tradeType33"].value
            // ){
            //     this.basicDataForm.tradeTypeState=rule.formData["tradeType33"].value.split(",");
            // }
            //商品类型
            // if(rule.formData["saleItemType100"] 
            //     && rule.formData["saleItemType100"].value
            // ){
            //     this.basicDataForm.SaleItemTypeState = rule.formData["saleItemType100"].value.split(",");
            // }
            // if(rule.formData["cycleConsumeNum"] 
            //     && rule.formData["cycleConsumeNum"].saleItemType17.value
            // ){
            //     this.basicDataForm.goodsItemTypeState = rule.formData["cycleConsumeNum"].saleItemType17.value.split(",");
            // }
            //交易渠道
            // if(rule.formData["consumeNum"] 
            //     && rule.formData["consumeNum"].consumeWayCode15.value
            // ){
            //     this.basicDataForm.consumeWayState = rule.formData["consumeNum"].consumeWayCode15.value.split(",");
            // }
            // if(rule.formData["cycleConsumeNum"] 
            //     && rule.formData["cycleConsumeNum"].consumeWayCode17.value
            // ){
            //     this.basicDataForm.cycleConsumeWayState = rule.formData["cycleConsumeNum"].consumeWayCode17.value.split(",");
            // }
            
            //座位等级
            if (rule.formData["seatGrade89"] 
                && rule.formData["seatGrade89"].value 
            ) {
                this.basicDataForm.seatLevelState = rule.formData["seatGrade89"].value.split(",");
            }
            //执行条件-座位等级（action_seatLevel）
            if (rule.formData["updateTicketPriceBySeatGrade"].seatGrade29 
                && rule.formData["updateTicketPriceBySeatGrade"].seatGrade29.value
            ) {
                this.basicDataForm.action_seatLevel = rule.formData["updateTicketPriceBySeatGrade"].seatGrade29.value.split(",")
                this.basicDataForm.action_seatLevel=this.basicDataForm.action_seatLevel.map(Number)//字符传转数字
                this.basicDataForm.updateTicketPriceBySeatGrade.seatGrade29.value = this.basicDataForm.action_seatLevel.join(",");
            }
            //放映有效期
            if (rule.formData["planStartTime81"] && rule.formData["planStartTime81"].value) {
                if(rule.formData["planStartTime81"].opUniqueName=='TimeBetweenOperator'){
                    this.basicDataForm.screeningValidityOption = JSON.parse(rule.formData["planStartTime81"].value.split(","));
                }else if(rule.formData["planStartTime81"].opUniqueName=='DayContainOperator'||rule.formData["planStartTime81"].opUniqueName=='not_DayContainOperator'){
                    this.basicDataForm.screeningValidityOption = rule.formData["planStartTime81"].value;
                }
            }
            //放映星期范围
            if (rule.formData["filmPlanWeekRange83"] 
                && rule.formData["filmPlanWeekRange83"].value 
            ) {
                this.basicDataForm.weekRangeState = rule.formData["filmPlanWeekRange83"].value.split(",");
            }
            //放映排除日期（节假日除外）
            if (rule.formData["filmPlanInvalidTime82"]
                &&rule.formData["filmPlanInvalidTime82"].value
                &&rule.formData["filmPlanInvalidTime82"].opUniqueName=="not_RelateDateHolidayOperator"
            ) {
                if(this.basicDataForm.excludeDate.indexOf("节假日除外")==-1){
                    this.basicDataForm.excludeDate.push("节假日除外")
                }
            }
            //放映排除日期（指定排除日期范围）
            if (rule.formData["filmPlanInvalidTime82"]
                &&rule.formData["filmPlanInvalidTime82"].value
                &&rule.formData["filmPlanInvalidTime82"].opUniqueName=="not_DateRangeContainOperator"
            ) {

                if(this.basicDataForm.excludeDate.indexOf("指定排除日期范围")==-1){
                    this.basicDataForm.excludeDate.push("指定排除日期范围")
                }

                let values82 = JSON.parse(rule.formData["filmPlanInvalidTime82"].value.split(","))
                this.basicDataForm.excludeDateOptions=[]
                for (let value82 of values82) {
                    let excludeDateOption = {
                        excludeDateOption: value82
                    };
                    this.basicDataForm.excludeDateOptions.push(excludeDateOption);
                }
            }
            //放映时段范围
            if (rule.formData["filmPlanTimeRange84"]
                &&rule.formData["filmPlanTimeRange84"].value
                &&rule.formData["filmPlanTimeRange84"].opUniqueName=="TimeRangeContainOperator"
            ) {

                let values84 = JSON.parse(rule.formData["filmPlanTimeRange84"].value.split(","))
                this.basicDataForm.screeningPeriodOptions=[]
                for (let value84 of values84) {
                    let screeningPeriodOption = {
                        screeningPeriodOption: value84
                    };
                    this.basicDataForm.screeningPeriodOptions.push(screeningPeriodOption);
                }
            }
        },
        //回显-全部活动条件（RuleConditions）
        showRuleConditionsAll(){
            this.checkedMemberOption = [];
            this.checkedTicketsOption = [];
            this.checkedGoodsOption = [];
            this.checkedTradeOption = [];
            //会员类
            for (let option of this.selectedOptions) {
                for (let item of this.memberOptions) {
                    if (option.key == item.key) {
                        this.checkedMemberOption.push(item); 
                    }
                }
            }
            //影票类
            for (let option of this.selectedOptions) {
                for (let item of this.movieTicketsOptions) {
                    if (option.key == item.key) {
                        this.checkedTicketsOption.push(item);
                    }
                }
            }
            //卖品类
            for (let option of this.selectedOptions) {
                for (let item of this.goodsOptions) {
                    if (option.key == item.key) {
                        this.checkedGoodsOption.push(item);
                    }
                }
            }
            //交易类
            for (let option of this.selectedOptions) {
                for (let item of this.tradeOptions) {
                    if (option.key == item.key) {
                        this.checkedTradeOption.push(item);
                    }
                }
            }
        },
        //回显-全部执行方法（Actions）
        showActionsAll(){
            this.checkedMemberAction = []
            this.checkedTicketsAction = []
            this.checkedTradeAction = []
            //会员类
            for (let option of this.selectedActions) {
                for (let item of this.memberActions) {
                    if (option.key == item.key) {
                        this.checkedMemberAction.push(item);
                    }
                }
            }
            //影票类
            for (let option of this.selectedActions) {
                for (let item of this.movieTicketsActions) {
                    if (option.key == item.key) {
                        this.checkedTicketsAction.push(item);
                    }
                }
            }
            //交易类
            for (let option of this.selectedActions) {
                for (let item of this.tradeActions) {
                    if (option.key == item.key) {
                        this.checkedTradeAction.push(item);
                    }
                }
            }
        },
        //清除弹窗显示内容
        clearInputValue(key){
            this.basicDataForm[key].text = "";
            this.basicDataForm[key].value = "";
        },
        //活动条件-清除全部选项
        clearAllConditionHandle(){
            this.selectedOptions=[];
            this.checkedMemberOption=[]
            this.checkedTicketsOption=[]
            this.checkedGoodsOption=[]
            this.checkedTradeOption=[]
        },
        //执行方法-清除全部选项
        clearAllActionsHandle(){
            this.selectedActions=[];
            this.checkedMemberAction=[]
            this.checkedTicketsAction=[]
            this.checkedTradeAction=[]
        },
        //选中某活动条件
        handleCheckedOption() {
            this.selectedOptions = this.checkedMemberOption
                .concat(this.checkedTicketsOption)
                .concat(this.checkedGoodsOption)
                .concat(this.checkedTradeOption);
        },
        //选中某执行方法
        handleCheckedAction() {
            this.selectedActions = this.checkedMemberAction
                .concat(this.checkedTicketsAction)
                .concat(this.checkedTradeAction);
        },
        //样式-默认先显示有内容的标签项(if的先后顺序不能更改)
        showOptionRules(){
            //活动条件label
            if(this.checkedTradeOption.length!=0){
                this.activeName="fourth"
            }
            if(this.checkedGoodsOption.length!=0){
                this.activeName="third"
            }
            if(this.checkedTicketsOption.length!=0){
                this.activeName="second"
            }
            if(this.checkedMemberOption.length!=0){
                this.activeName="first"
            }
            //执行方法label
            if(this.checkedTradeAction.length!=0){
                this.activeName1="third1"
            }
            if(this.checkedTicketsAction.length!=0){
                this.activeName1="second1"
            }
            if(this.checkedMemberAction.length!=0){
                this.activeName1="first1"
            }
        },
        //生日-监听事件
        handleChangeBirthday(val) {
            if (val == "EqualCurrentDay" || val == "EqualCurrentMoney") {
                this.basicDataForm.birthday7.value = "true";
            }else{
                this.basicDataForm.birthday7.value = "";
            }
        },
        //性别-监听事件
        handleSex(data) {
            if (data.indexOf("") != -1) {
                data = ["0", "1"];
            }
            this.basicDataForm.sexState = data;
            this.basicDataForm.sex8.value = this.basicDataForm.sexState.join(",");
        },
        //会员卡政策-监听事件
        handleChangeCardRightCode(val){
            if(val == "AllMember"){
                this.basicDataForm.cardRightCode100.text = '';
                this.basicDataForm.cardRightCode100.value = true;
            }
        },
        //会员等级-监听事件
        handleChangeCustomerLevelCode(val){
            if(val == "not_memberOperator"){
                this.basicDataForm.customerLevelCode101.text = '';
                this.basicDataForm.customerLevelCode101.value = true;
            }
        },
        //----------年龄start------------
        //年龄-监听事件
        handleChangeAge(val) {
            if (val == "BetweenOperator" || val == "not_BetweenOperator") {
                this.basicDataForm.age9.value = "";
            } else {
                this.basicDataForm.age9.valueRange = "";
                this.basicDataForm.age9.value = "";
            }
        },
        //验证年龄
        verificationAge(rules, value, callback){ 
            if (!value) {
                return callback(new Error('年龄不能为空'));
            }
            let regExp = /^[1-9]\d*$/;
            if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
            }else if(value>=1000000000){
                return callback(new TypeError('超出范围'));
            }
            return callback();     
        },
        //添加年龄范围
        addAgeRange() {
            this.basicDataForm.ageRange.push({
                minAge: "",
                maxAge: ""
            });
            this.buildAgeRange()
        },
        //组装年龄范围
        buildAgeRange(){
            if (this.basicDataForm.ageRange.length > 0) {
                let arr = [];
                this.basicDataForm.ageRange.forEach(item => {
                    if (item.minAge && item.maxAge) {
                        arr.push([item.minAge, item.maxAge]);
                        this.basicDataForm.age9.value = JSON.stringify(arr);
                    }
                });
            }
        },
        //移除年龄范围
        delAgeRange(index) {
            if(this.basicDataForm.ageRange.length != 1){
                this.basicDataForm.ageRange.splice(index, 1);
                if (this.basicDataForm.ageRange.length > 0) {
                    let arr = [];
                    this.basicDataForm.ageRange.forEach(item => {
                        if (item.minAge && item.maxAge) {
                            arr.push([item.minAge, item.maxAge]);
                            this.basicDataForm.age9.value= JSON.stringify(arr);
                        }
                    });
                }
            }
        },
        //----------年龄end------------
        //----------开卡日期start------------
        //开卡日期-监听事件
        handleChangeOpenDate(val){
            this.basicDataForm.openDate12.value = "";
            this.basicDataForm.openCardDateOptions = [{openDateCardOption: ""}]
        },
        //添加开卡日期
        addOpenCardDate() {
            this.basicDataForm.openCardDateOptions.push({
                openCardDateOption: ""
            });
            this.buildOpenCardDate()
        },
        //组装开卡日期 
        buildOpenCardDate(){
            if (this.basicDataForm.openCardDateOptions.length > 0) {
                let arr = [];
                this.basicDataForm.openCardDateOptions.forEach(item => {
                    if (item.openCardDateOption) {
                        arr.push(item.openCardDateOption);
                        this.basicDataForm.openDate12.value = JSON.stringify(arr);
                    }
                });
            }
        },
        //删除开卡日期
        delOpenCardDate(index) {
            if(this.basicDataForm.openCardDateOptions.length != 1){
                this.basicDataForm.openCardDateOptions.splice(index, 1);
            }
        },
        //----------开卡日期end------------
        //----------开卡年限start------------
        //开卡年限-监听事件
        handleChangeOpenYears(val){
            this.basicDataForm.openYears11.value = "";
            this.basicDataForm.openCardYearsRange = [{minYear: "",maxYear: ""}];
        },
        //验证开卡年限
        verificationYears(rules, value, callback){
            if (!value) {
                return callback(new Error('开卡年限不能为空'));
            }
            let regExp = /^[1-9]\d*$/;
            if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
            }else if(value>=1000000000){
                return callback(new TypeError('超出范围'));
            }
            return callback();
        },
        //添加开卡年限范围 
        addOpenCardYearsRange() {
            this.basicDataForm.openCardYearsRange.push({
                minYear: "",
                maxYear: ""
            });
            this.buildOpenCardYearsRange()
        },
        //组装开卡年限范围
        buildOpenCardYearsRange(){
             if (this.basicDataForm.openCardYearsRange.length > 0) {
                let arr = [];
                this.basicDataForm.openCardYearsRange.forEach(item => {
                    if (item.minYear && item.maxYear) {
                        arr.push([item.minYear, item.maxYear]);
                        this.basicDataForm.openYears11.value = JSON.stringify(arr);
                    }
                });
            }
        },
        //删除开卡年限范围
        delOpenCardYearsRange(index) {
            if(this.basicDataForm.openCardYearsRange.length != 1){
                this.basicDataForm.openCardYearsRange.splice(index, 1);
                if (this.basicDataForm.openCardYearsRange.length > 0) {
                    let arr = [];
                    this.basicDataForm.openCardYearsRange.forEach(item => {
                        if (item.minYear && item.maxYear) {
                            arr.push([item.minYear, item.maxYear]);
                            this.basicDataForm.openYears11.value = JSON.stringify(arr);
                        }
                    });
                }
            }
        },
        //----------开卡年限end------------
        //----------开卡月限start------------
        //开卡月限-监听事件
        handleChangeOpenMonths(val){
            this.basicDataForm.openMonths87.value = "";
            this.basicDataForm.openMonthsRange = [{minMonth: "",maxMonth: ""}];
        },
        //验证开卡月限
        verificationOpenMonths(rules, value, callback){
            if (!value) {
                return callback(new Error('开卡月限不能为空'));
            }
            let regExp = /^[1-9]\d*$/;
            if (!regExp.test(value) || value == 0 || value > 12) {
                return callback(new TypeError('请输入1-12正整数'));
            }
            return callback();
        },
        //添加开卡月限范围
        addOpenMonthsRange() {
            this.basicDataForm.openMonthsRange.push({
                minMonth: "",
                maxMonth: ""
            });
            this.buildOpenMonthsRange()
        },
        //组装开卡月限范围 
        buildOpenMonthsRange(){
             if (this.basicDataForm.openMonthsRange.length > 0) {
                let arr = [];
                this.basicDataForm.openMonthsRange.forEach(item => {
                    if (item.minMonth && item.maxMonth) {
                        arr.push([item.minMonth, item.maxMonth]);
                        this.basicDataForm.openMonths87.value = JSON.stringify(arr);
                    }
                });
            }
        },
        //删除开卡月限范围
        delOpenMonthsRange(index) {
            if(this.basicDataForm.openMonthsRange.length != 1){
                this.basicDataForm.openMonthsRange.splice(index, 1);
                if (this.basicDataForm.openMonthsRange.length > 0) {
                    let arr = [];
                    this.basicDataForm.openMonthsRange.forEach(item => {
                        if (item.minMonth && item.maxMonth) {
                            arr.push([item.minMonth, item.maxMonth]);
                            this.basicDataForm.openMonths87.value = JSON.stringify(arr);
                        }
                    });
                }
            }
        },
        //----------开卡月限end------------
        //动态周期消费次数-添加指定周期（暂时不用）
        addAppointPeriod() {
            this.basicDataForm.appointPeriodOptions.push({
                appointPeriodOption: ""
            });
            this.buildAppointPeriod();
        },
        //动态周期消费额-添加指定周期（暂时不用）
        addAppointPeriod17() {
            this.basicDataForm.appointPeriodOptions17.push({
                appointPeriodOption17: ""
            });
            this.buildAppointPeriod17();
        },
        //组装-动态周期消费次数-指定周期（暂时不用）
        buildAppointPeriod(){
            if (this.basicDataForm.appointPeriodOptions.length > 0) {
                let arr = [];
                this.basicDataForm.appointPeriodOptions.forEach(item => {
                    if (item.appointPeriodOption) {
                        arr.push(item.appointPeriodOption);
                        this.basicDataForm.consumeNum.appointPeriod15.value = JSON.stringify(arr);
                    }
                });
            }
        },
        //组装-动态周期消费额-指定周期（暂时不用）
        buildAppointPeriod17(){
            if (this.basicDataForm.appointPeriodOptions17.length > 0) {
                let arr = [];
                this.basicDataForm.appointPeriodOptions17.forEach(item => {
                    if (item.appointPeriodOption17) {
                        arr.push(item.appointPeriodOption17);
                        this.basicDataForm.cycleConsumeNum.appointPeriod17.value = JSON.stringify(arr);
                    }
                });
            }
        },
        //动态周期消费次数-删除指定周期-开卡日期（暂时不用）
        delAppointPeriod(index) {
            if(this.basicDataForm.appointPeriodOptions.length != 1){
                this.basicDataForm.appointPeriodOptions.splice(index, 1);
            }
        },
        //动态周期消费额-删除指定周期-开卡日期（暂时不用）
        delAppointPeriod17(index) {
            this.basicDataForm.appointPeriodOptions17.splice(index, 1);
        },
        //指定商品购买数量-数量-监听事件
        handleChangeBuyNumAmount(val){
            if(val == ""){
                this.basicDataForm.buyNum.amount21.value = '';
            }
        },
        //同类商品累计购买数量-累计购买数量-监听事件
        handleChangeBuyNumByTypeSumAmount(val){
            if(val == ""){
                this.basicDataForm.buyNumByType.sumAmount28.value = '';
            }
        },
        //同品牌商品累计购买数量-累计购买数量-监听事件
        handleChangeBuyNumByBrandSumAmount(val){
            if(val == ""){
                this.basicDataForm.buyNumByBrand.sumAmount29.value = '';
            }
        },
        //----------放映有效期start------------
        //组装放映有效期
        setFormData(){
            if(this.basicDataForm.planStartTime81.value){  
                this.basicDataForm.planStartTime81.value = this.basicDataForm.planStartTime81.value.replace(/，/ig,',')
            }
        },
        //设置放映有效期
        setScreeningValidity(val) {
            this.basicDataForm.planStartTime81.valueRange = JSON.stringify(val);
        },
        //放映有效期-监听事件
        handleScreeningValidityChange(value) {
            if (value == "TimeBetweenOperator") {
                this.basicDataForm.planStartTime81.value = "";
            } else if (
                this.basicDataForm.planStartTime81.opUniqueName == "DayContainOperator" ||
                this.basicDataForm.planStartTime81.opUniqueName == "not_DayContainOperator"
            ) {
                this.basicDataForm.planStartTime81.value = "";
                this.basicDataForm.screeningValidityOption = [];
            } else {
                this.basicDataForm.planStartTime81.value = "";
                this.basicDataForm.screeningValidityOption = [];
            }
        },
        //----------放映有效期end------------
        //----------放映排除日期start------------
        //放映排除日期-监听事件
        handleChangeExcludeDate(val) {
            if (val.indexOf("节假日除外") != -1) {
                this.basicDataForm.filmPlanInvalidTime82.opUniqueName = "not_RelateDateHolidayOperator";
                this.basicDataForm.filmPlanInvalidTime82.value="true"
            } 
            if (val.indexOf("指定排除日期范围") != -1) {
                this.basicDataForm.filmPlanInvalidTime82.value=JSON.stringify(this.basicDataForm.excludeDateOption)
                this.basicDataForm.filmPlanInvalidTime82.opUniqueName = "not_DateRangeContainOperator";
            }
        },
        //设置放映排除日期
        setExcludeDate() {
            this.setFilmPlanInvalidTimeRange();
            this.testExcludeDate();
        },
        //添加放映排除日期
        addExcludeDate() {
            this.basicDataForm.excludeDateOptions.push({
                excludeDateOption: ""
            });
            this.setFilmPlanInvalidTimeRange();
        },
        //删除放映排除日期
        delExcludeDate(index) {
            if(this.basicDataForm.excludeDateOptions.length != 1){
                this.basicDataForm.excludeDateOptions.splice(index, 1);
                this.setFilmPlanInvalidTimeRange();
            }
        },
        //组装放映排除日期
        setFilmPlanInvalidTimeRange() {
            if (this.basicDataForm.excludeDateOptions.length > 0) {
                let arr = [];
                this.basicDataForm.excludeDateOptions.forEach(item => {
                    if (item.excludeDateOption) {
                        arr.push(item.excludeDateOption);
                    }
                });
                this.basicDataForm.filmPlanInvalidTime82.value = JSON.stringify(
                    arr
                );
            }
        },
        //提示验证放映排除日期
        testExcludeDate(){
            if(this.validExcludeDate()){
                this.$message.error("放映排除日期不能相同");
            }
        },
        //验证放映排除日期
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
        //----------放映排除日期end------------
        //----------放映时段范围start------------
        //设置时段范围-监听事件
        handleFilmPlanTime(val) {
            if(this.basicDataForm.filmPlanTimeRange84.opUniqueName=="MorningOperator"){
                this.basicDataForm.filmPlanTimeRange84.value="true"
            }
            if(this.basicDataForm.filmPlanTimeRange84.opUniqueName=="AfternoonOperator"){
                this.basicDataForm.filmPlanTimeRange84.value="true"
            }
            if(this.basicDataForm.filmPlanTimeRange84.opUniqueName=="NightOperator"){
                this.basicDataForm.filmPlanTimeRange84.value="true"
            }
            if(this.basicDataForm.filmPlanTimeRange84.opUniqueName=="TimeRangeContainOperator"){
                this.basicDataForm.filmPlanTimeRange84.value=JSON.stringify(this.basicDataForm.screeningPeriodOption)
            }
        },
        //设置放映时段范围 
        setScreeningPeriod() {
            this.setTimeRangeContainOperator()
            this.testScreeningPeriod();
        },
        //提示验证放映时段范围
        testScreeningPeriod(){
            if(this.validScreeningPeriod()){
                this.$message.error("放映时段范围不能相同");
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
        //添加放映时段范围
        addScreeningPeriod() {
            this.basicDataForm.screeningPeriodOptions.push({
                screeningPeriodOption: ""
            });
            this.setTimeRangeContainOperator()
        },
        //删除放映时段范围
        delScreeningPeriod(index) {
            if(this.basicDataForm.screeningPeriodOptions.length != 1){
                this.basicDataForm.screeningPeriodOptions.splice(index, 1);
                if (this.basicDataForm.screeningPeriodOptions.length > 0) {
                    let arr = [];
                    this.basicDataForm.screeningPeriodOptions.forEach(item => {
                        if (item.screeningPeriodOption) {
                            arr.push(item.screeningPeriodOption);
                        }
                    });
                    this.basicDataForm.filmPlanTimeRange84.value = JSON.stringify(arr);
                }
            }
        },
        //组装放映时段范围
        setTimeRangeContainOperator(){
            if (this.basicDataForm.screeningPeriodOptions.length > 0) {
                let arr = [];
                this.basicDataForm.screeningPeriodOptions.forEach(item => {
                    if (item.screeningPeriodOption) {
                        arr.push(item.screeningPeriodOption);
                    }
                });
                this.basicDataForm.filmPlanTimeRange84.value = JSON.stringify(arr);
            }
        },
        //----------放映时段范围end------------
        //放映星期范围-指定星期范围-监听事件
        handleChangeweekRange(data) {
            if (data.indexOf("") != -1) {
                data = ["1", "2", "3", "4", "5", "6", "7"];
            }
            this.basicDataForm.weekRangeState = data;
            this.basicDataForm.filmPlanWeekRange83.value = this.basicDataForm.weekRangeState.join(
                ","
            );
        },
        //放映星期范围-监听事件
        handleChangeFilmPlanWeekRange(val){
            if(val == "WeekDateOperator"){
                this.basicDataForm.filmPlanWeekRange83.value = "true";
            }else{
                this.basicDataForm.filmPlanWeekRange83.value = "";
                this.basicDataForm.weekRangeState = [];
            }
        },
        //座位级别-监听事件
        handleChangeSeatLevel(data) {
            if (data.indexOf("") != -1) {
                data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            }
            this.basicDataForm.seatLevelState = data;
            this.basicDataForm.seatGrade89.value = this.basicDataForm.seatLevelState.join(
                ","
            );
        },  
        //交易类型-监听事件（已弃用）
        handleChangeTradeType(data) {
            if (data.indexOf("") != -1) {
                data = ["BUY", "MEMBER_ADD_AMOUNT", "REJECT"];
            }
            this.basicDataForm.tradeTypeState = data;
            this.basicDataForm.tradeType33.value = this.basicDataForm.tradeTypeState.join(",");
        },
        //商品类型-监听事件（已弃用）
        handleChangeSaleItemType(data) {
            if (data.indexOf("") != -1) {
                data = ["0", "1"];
            }
            this.basicDataForm.SaleItemTypeState = data;
            this.basicDataForm.saleItemType100.value = this.basicDataForm.SaleItemTypeState.join(",");
        },
        //动态周期消费额-商品类型-监听事件（已弃用）
        handleChangeGoodsItemType(data) {
            if (data.indexOf("") != -1) {
                data = ["0", "1"];
            }
            this.basicDataForm.goodsItemTypeState = data;
            this.basicDataForm.cycleConsumeNum.saleItemType17.value = this.basicDataForm.goodsItemTypeState.join(",");
        },
        //动态周期消费次数-交易渠道-监听事件（已弃用）
        handleChangeConsumeWayState(data) {
            if (data.indexOf("") != -1) {
                data = ["0", "1", "2", "3", "4", "5", "T"];
            }
            this.basicDataForm.consumeWayState = data;
            this.basicDataForm.consumeNum.consumeWayCode15.value = this.basicDataForm.consumeWayState.join(",");
        },
        //动态周期消费额-交易渠道-监听事件（已弃用）
        handleChangeCycleConsumeWayState(data) {
            if (data.indexOf("") != -1) {
                data = ["0", "1", "2", "3", "4", "5", "T"];
            }
            this.basicDataForm.cycleConsumeWayState = data;
            this.basicDataForm.cycleConsumeNum.consumeWayCode17.value = this.basicDataForm.cycleConsumeWayState.join(",");
        },
        //执行方法-修改单票售价-调价方式-监听事件
        changeModifyWay15(val){
            if(val != "discountPrice"){
                this.basicDataForm.updateTicketPrice.addAmountAfterDiscount15.value = '';
            }
        },
        //执行方法-修改单票售价-低于最低价时-监听事件
        changeLessProcessMethod15(val){
            if(val != "clientPay"){
                this.basicDataForm.updateTicketPrice.cinemaPayAmount15.value = '';
            }
        },
        //执行方法-修改单票售价-调价商品数量-监听事件
        changeModifyAmountMethod15(val){
            if(val == "all"){
                this.basicDataForm.updateTicketPrice.modifyAmount15.value = '';
            }
        },
        //执行方法-按座位等级修改票价-调价方式-监听事件
        changeModifyWay29(val){
            if(val != "discountPrice"){
                this.basicDataForm.updateTicketPriceBySeatGrade.addAmountAfterDiscount29.value = '';
            }
        },
        //执行方法-按座位等级修改票价-低于最低价时--监听事件
        changeLessProcessMethod29(val){
            if(val != "cinemaPay"){
                this.basicDataForm.updateTicketPriceBySeatGrade.cinemaPayAmount29.value = '';
            }
        },
        //执行方法-按座位等级修改票价-调价商品数量--监听事件
        changeModifyAmountMethod29(val){
            if(val == "all"){
                this.basicDataForm.updateTicketPriceBySeatGrade.modifyAmount29.value = '';
            }
        },
        //执行方法-按座位等级修改票价-座位级别-监听事件
        handleChangeAction_SeatLevel(data) {
            if (data.indexOf("") != -1) {
                data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
            }
            this.basicDataForm.action_seatLevel = data;
            this.basicDataForm.updateTicketPriceBySeatGrade.seatGrade29.value = this.basicDataForm.action_seatLevel.join(
                ","
            );
        },
        //执行方法-单品优惠价调整-调价方式--监听事件
        changeModifyWay9(val){
            if(val != "discountPrice"){
                this.basicDataForm.judgeDiscountPrice.addAmountAfterDiscount9.value = '';
            }
        },
        //执行方法-单品优惠价调整-调价商品数量-监听事件
        changeModifyAmountMethod9(val){
            if(val == "all"){
                this.basicDataForm.judgeDiscountPrice.modifyAmount9.value = '';
            }
        },
        //执行方法-卖品分类优惠价调整-商品分类-监听事件
        changeMerCategoryMethod27(val){
            if(val == "allMerCategory"){
                this.basicDataForm.judgeDiscountPriceByType.classCode27.text = '';
                this.basicDataForm.judgeDiscountPriceByType.classCode27.value = '';
            }
        },
        //执行方法-卖品分类优惠价调整-调价方式-监听事件
        changeModifyWay27(val){
            if(val == "subPrice"){
                this.basicDataForm.judgeDiscountPriceByType.addAmountAfterDiscount27.value = '';
            }
        },
        //执行方法-卖品分类优惠价调整-调价商品数量-监听事件
        changeModifyAmountMethod27(val){
            if(val == "all"){
                this.basicDataForm.judgeDiscountPriceByType.modifyAmount27.value = '';
            }
        },
        //执行方法-按品牌优惠价调整-商品品牌-监听事件
        changeMerBrandMethod28(val){
            if(val == "allMerBrand"){
                this.basicDataForm.judgeDiscountPriceByBrand.brandId28.text = '';
                this.basicDataForm.judgeDiscountPriceByBrand.brandId28.value = '';
            }
        },
        //执行方法-按品牌优惠价调整-调价方式-监听事件
        changeModifyWay28(val){
            if(val == "subPrice"){
                this.basicDataForm.judgeDiscountPriceByBrand.addAmountAfterDiscount28.value = '';
            }
        },
        //执行方法-按品牌优惠价调整-调价商品数量-监听事件
        changeModifyAmountMethod28(val){
            if(val == "all"){
                this.basicDataForm.judgeDiscountPriceByBrand.modifyAmount28.value = '';
            }
        },
        //返回
        returnList() {
            this.$emit("close");
        },
        //单次充值金额和整单交易金额不可同时存在（暂时不用）
        sumPriceRepeat(){
            let arr = [];
            for(let item of this.selectedOptions){
                arr.push(item.key)
            }
            if(arr.includes("sumPrice1") && arr.includes("sumPrice26")){
                return true;
            }else{
                return false;
            }
        },
        //表单提交
        dataFormSubmit() {
            //验证
            this.$refs["basicDataForm"].validate(valid => {
                if(this.selectedActions.length == 0){
                    this.$message.error("请选择子活动执行方式");
                }else if(this.validExcludeDate()){
                    this.$message.error("放映排除日期不能相同");
                }else if(this.validScreeningPeriod()){
                    this.$message.error("放映时段范围不能相同");
                }
                //（暂时不用）
                // else if(this.sumPriceRepeat()){
                //     this.$message.error("单次充值金额和整单交易金额不可同时存在");
                // }

                else{
                    if (valid) {
                        //----------组装数据部分数据start--------
                        //年龄
                        this.buildAgeRange()
                        //开卡日期
                        this.buildOpenCardDate()
                        //开卡月限
                        this.buildOpenMonthsRange()
                        //开卡年限
                        this.buildOpenCardYearsRange()
                        //指定周期
                        // this.buildAppointPeriod()
                        // this.buildAppointPeriod17()
                        //放映有效期
                        this.setFormData()
                        //----------组装数据部分数据end--------
                        //数据迁移状态(临时状态)
                        if(this.transferStatus==5){
                            this.$emit("transferHandle", {
                                status:true,
                                index:this.index,
                            });
                        }
                        //分发数据返回给父组件
                        this.$emit("transferData", {
                            index: this.index,//活动下标
                            name: this.basicDataForm.activityName,//活动名称
                            formData: this.basicDataForm,//活动基本信息
                            conditions: this.selectedOptions,//活动条件
                            actions: this.selectedActions//执行条件
                        });
                    }
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.input-dialog {
    /deep/ .el-input__inner {
        background: #f5f5f5;
        padding-right:25px !important;
        width: 178px !important;
    }
}
.close-btn {
    position: absolute;
    top: 8px;
    right: 6px;
    font-size: 16px!important;
    font-weight: bolder;
    color: #3B74FF;
    cursor:pointer;
}
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
    font-size: 12px !important;
    font-family: "MicrosoftYaHei" !important;
}
/deep/ .el-date-editor .el-range-input{
    font-size: 12px !important;
}
/deep/ .el-date-editor .el-range-separator{
    width: 25px;
    font-size: 12px !important;
}
/deep/ .el-checkbox__label{
    font-size: 12px!important;
}
.add-group-default {
    .breadcrumb {
        margin: 30px 0 50px 30px;
    }
    .el-input {}
    .input-type-94{
        width: 94px;
    }
    .input-type-96{
        width: 96px;
    }
    .input-type-120{
        width: 120px;
    }
    .date-type-210{
        width: 210px;
    }
    .select-type-178{
       width:178px;
    }
    .margin-bottom-22{
        margin-bottom: 22px;
    }
    //---商品单价样式start----
    //输入框长度
    .input-good-pricing{
        width:178px;
        margin-right: 30px;
    }
    //---商品单价样式end----
    //---调价值、调整额样式start----
    //区域长度
    .region-adjustments{
        width: 400px;
    }
    //输入框长度
    .input-adjustments{
        width: 96px;
        margin-right: 160px;
    }
    //---调整价、调价额样式end----
    //---折扣后加减N元start----
    //区域长度
    .region-after-discount{
      
    }
    //输入框长度
    .input-after-discount{
        width: 96px;
        margin-right: 160px;
    }
    //---折扣后加减N元end----
    //---积分定价（分）start----
    //区域长度
    .region-integral-pricing{
        width:314px
    }
    //输入框长度
    .input-integral-pricing{
        width: 96px;
    }
    //---积分定价（分）end----
    //---加金额（元）start----
    //区域长度
    .region-additional-amount{
        width:400px
    }
    //输入框长度
    .input-additional-amount{
        width: 96px;
        margin-right: 160px;
    }
    //---加金额（元）end----
    //---最多补贴N元start----
    //区域长度
    .region-maximum-subsidy{
        width:400px
    }
    //输入框长度
    .input-maximum-subsidy{
        width: 96px;
        margin-right: 160px;
    }
    //---最多补贴N元end----
    //---数量start----
    //区域长度
    .region-count{
        width:400px
    }
    //输入框长度
    .input-count{
        width: 96px;
    }
    //---数量end----
    .el-range-input {
        width: 30%;
        font-size: 12px!important;
    }
    /deep/ .el-form-item {
        margin: 0 0 10px;
        .el-form-item__label {
            width: 121px;
            text-align: right;
            vertical-align: middle;
            float: left;
            font-size: 12px;
            color: #666666;
            line-height: 32px;
            padding: 0 12px 0 0;
            box-sizing: border-box;
        }
        .el-form-item__content{
            font-size: 12px!important;
            line-height: 0px;
            position: relative;
        }
    }
    /deep/ .activity-name{
        .activity-name-title{
            width: 192px;
            .el-input__inner{
                font-size: 12px!important;
            }
        }
        .el-form-item__error{
            padding-left: 120px;
        }
    }
    /deep/ .el-collapse {
        width: 80%;
        border-bottom: 0 none;
        border-top: 0 none;
        margin-bottom: 50px;
        .el-collapse-item__header {
            padding-left: 10px !important;
            position: relative;
            width: 968px;
            font-size: 14px;
            font-family: MicrosoftYaHei;
            color: #333;
            font-weight: 600;
            border-bottom: 1px solid #ebeef5;
        }
        .el-collapse-item__header::after {
            height: 0;
            width: 0;
        }
        .el-collapse-item__header.is-active{
            border-bottom: 0 none;
            border-bottom-color: transparent !important;
        }
        .el-collapse-item__wrap {
            padding: 0;
            border: 0 none;
        }
        .el-collapse-item__content {
            padding:10px 0 15px 10px;
            .el-date-editor {
                &.el-input__inner {
                    padding: 0 5px;
                }
            }
        }
            .box-title{
                width: 100%;
                height: 32px;
                line-height: 32px;
                text-align: center;
                background: #F2F4FD;
                font-family: MicrosoftYaHei;
                font-size: 12px;
                color: #333333;
            }
            .box-content {
                display: flex;
                width: 100%;
                height: 100%;
                background: #fff;
                border:none;
                border: 1px solid #BCBCBC;
                .box-tabs {
                    min-width: 250px;
                    max-width: 350px;
                    border: 0;
                }
                .box-cond {
                    width: 80%;
                    min-width: 600px;
                    padding: 15px 0 15px 15px;
                    .box-cond-info{
                        height: 22px;
                        text-align: left;
                        vertical-align: middle;
                        line-height: 22px;
                        margin-bottom: 10px;
                        .el-button{
                            float: right;
                            width: 64px;
                            height: 20px;
                            line-height: 20px;
                            text-align: center;
                            vertical-align: middle;
                            padding: 0;
                        }
                    }
                    /deep/ .el-form-item {
                        margin:0;
                    }
                    .box-cond-item{
                        float: left;
                        display: inline-block;
                        min-height: 61px;
                        margin-right: 8px;
                    }
                    .el-input__inner{
                        font-size: 12px!important;
                        color: #666666;
                    }
                    /deep/ .el-input{
                        .el-input__inner{
                            font-size: 12px!important;
                            color: #666666;
                        }
                    }
                }
            }
        .el-checkbox-group {
            display: flex;
            flex-direction: column;
            min-width: 100px;
            .el-checkbox {
                margin: 0;
                margin-bottom:7px;
                display: block;
            }
        }
    }
    .el-card__header {
        padding: 0;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background-color: #f2f4fd;
        border-bottom: 0;
    }
    .el-card__body {
        padding: 0;
    }
    /deep/ .el-tabs {
        height: 100%;
        .el-tabs__header{
            border:none;
            border-right:1px solid #BCBCBC;
        }
        .el-tabs__header.is-left{
          margin: 0;
        }
        .el-tabs__content {
            min-height: 530px;
            padding: 16px 0px 0 16px;
            overflow: inherit;
            border: none;
            background-color: #F5F5F5;
            border-right: 1px solid #BCBCBC;
            .el-checkbox__label{
                font-size: 12px!important;
                color: #666666;
            }
        }
        .el-tabs__nav-wrap{
            .el-tabs__nav-scroll{
                height: 100%;
            }
            .el-tabs__nav{
                height: 100%;
                border-radius: 0px;
                border: none;
                .el-tabs__item.is-left {
                    border: none;
                    border-bottom: 1px solid #BCBCBC;
                }
                .el-tabs__item {
                    border-radius: 0px;
                    min-width: 40px;
                    width: 40px!important;
                    height: 90px!important;
                    padding:18px 10px 0 10px;
                    box-sizing: border-box;
                    color:#666666;
                    //导航项名字-未选中
                    .item-name-no-activity{
                        display: block;
                        line-height:16px;
                        font-size: 12px;
                        white-space :pre-line;
                        word-break: break-word;
                    }
                    //导航项名字-选中
                    .item-name-is-activity{
                        display: block;
                        line-height:16px;
                        font-size: 12px;
                        white-space :pre-line;
                        word-break: break-word;
                    }
                    //数字
                    .item-select-number{
                        display: block;
                        width: 14px;
                        height: 14px;
                        line-height: 14px;
                        border-radius: 50%;
                        background-color:#3B74FF ;
                        color: #fff;
                        margin: 2px;
                        text-align: center;
                        vertical-align: middle;
                        font-size: 12px;
                        font-style: normal;
                    }
                }
                //选中样式
                .el-tabs__item.is-active{
                    border: 1px solid #3B74FF;
                    background: #3B74FF;
                    color: #fff;
                    //数字-选中
                    .item-select-number{
                        display: block;
                        width: 14px;
                        height: 14px;
                        line-height: 14px;
                        border-radius: 50%;
                        background-color: #fff;
                        color: #3B74FF;
                        margin: 2px;
                        text-align: center;
                        vertical-align: middle;
                        font-size: 12px;
                        font-style: normal;
                    }
                }
            }
        }
    }
    .el-badge__content.is-fixed {
        position: absolute;
        top: 8px;
        right: 10px;
        transform: translateY(-50%) translateX(100%);
    }
    //添加按钮
    .addBtn {
        color: #3b74ff;
        display: inline-block;
        height: 32px;
        line-height: 32px;
        padding: 0px 0px;
        margin-left: 10px;
        text-align: center;
        vertical-align: top;
        .el-icon-circle-plus-outline {
            margin-right: 3px;
        }
    }
    //删除按钮
    .deleteBtn{
        display: inline-block;
        height: 32px;
        line-height: 32px;
        padding: 0px 0px;
        margin-left: 10px;
        text-align: center;
        vertical-align: top;
    }
    //弹窗按钮
    .dialogBtn{
        width: 80px;
        display: inline-block;
        height: 32px;
        line-height: 32px;
        padding:0;
        text-align: center;
        vertical-align: middle;
    }
    //清空按钮
    .clearBtn{
        width: 80px;
        display: inline-block;
        height: 32px;
        line-height: 32px;
        padding:0;
        text-align: center;
        vertical-align: middle;
        margin-right: 10px;
    }
    .priority1 {
        .el-form-item__error {
            margin-left: 130px;
            margin-top: -18px;
        }
    }
    .actionLabel {
        font-weight: bold;
        margin-bottom: 16px;
    }
    .bigBtn {
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
}
//底部按钮区域
.footerGroup{
    position: fixed;
    bottom: 0px;
    height: 56px;
    width: 90%;
    background: #ffffff;
    z-index: 99;
    .el-button{
        width:80px;
        height: 32px;
        padding: 0;
        text-align: center;
        vertical-align: middle;
        line-height: 32px;
        margin:0;
        margin-right: 32px;
    }
}
</style>
