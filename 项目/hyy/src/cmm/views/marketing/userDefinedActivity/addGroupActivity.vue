<template>
  <div class="add-group-default">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>自定义营销活动</el-breadcrumb-item>
        <el-breadcrumb-item>设置子活动条件</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-collapse v-model="activeNames">
      <!-- 子活动基础信息 -->
      <el-collapse-item title="子活动基础信息" name="1">
        <el-form :model="basicDataForm" :rules="basicDataRule" ref="basicDataForm">
          <el-form-item label="分组活动名称" prop="activityName">
            <el-input
              style="width:50%"
              v-model="basicDataForm.activityName"
              placeholder="请输入分组活动名称"
              :disabled="disabled"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-collapse-item>
      <!-- 子活动适用条件 -->
      <el-collapse-item title="子活动适用条件" name="2">
        <div style="color:#666666;margin-bottom:10px">请选择该活动适用条件，可多选</div>
        <el-card class="box-card">
          <div slot="header">子活动适用条件</div>
          <div class="box-content">
            <div class="box-tabs">
              <el-tabs v-model="activeName" tab-position="left" type="border-card">
                <el-tab-pane label name="first">
                  <span slot="label">
                    <el-badge
                      v-if="checkedMemberOption.length>0"
                      type="primary "
                      size="small"
                      :value="checkedMemberOption.length"
                    >会员类</el-badge>
                    <span v-else>会员类</span>
                  </span>
                  <el-checkbox-group v-model="checkedMemberOption" @change="handleCheckedOption">
                    <el-checkbox
                      v-for="item in memberOptions"
                      :label="item"
                      :key="item.key"
                      :value="item"
                    >{{item.value}}</el-checkbox>
                  </el-checkbox-group>
                </el-tab-pane>

                <el-tab-pane name="second">
                  <span slot="label">
                    <el-badge
                      v-if="checkedTicketsOption.length>0"
                      type="primary "
                      size="small"
                      :value="checkedTicketsOption.length"
                    >影票类</el-badge>
                    <span v-else>影票类</span>
                  </span>
                  <el-checkbox-group v-model="checkedTicketsOption" @change="handleCheckedOption">
                    <el-checkbox
                      v-for="item in movieTicketsOptions"
                      :label="item"
                      :key="item.key"
                      :value="item"
                    >{{item.value}}</el-checkbox>
                  </el-checkbox-group>
                </el-tab-pane>

                <el-tab-pane name="third">
                  <span slot="label">
                    <el-badge
                      v-if="checkedGoodsOption.length>0"
                      type="primary "
                      size="small"
                      :value="checkedGoodsOption.length"
                    >卖品类</el-badge>
                    <span v-else>卖品类</span>
                  </span>
                  <el-checkbox-group v-model="checkedGoodsOption" @change="handleCheckedOption">
                    <el-checkbox
                      v-for="item in goodsOptions"
                      :label="item"
                      :value="item"
                      :key="item.key"
                    >{{item.value}}</el-checkbox>
                  </el-checkbox-group>
                </el-tab-pane>

                <el-tab-pane label name="fourth">
                  <span slot="label">
                    <el-badge
                      v-if="checkedTradeOption.length>0"
                      type="primary "
                      size="small"
                      :value="checkedTradeOption.length"
                    >交易类</el-badge>
                    <span v-else>交易类</span>
                  </span>

                  <el-checkbox-group v-model="checkedTradeOption" @change="handleCheckedOption">
                    <el-scrollbar style="height:500px;overflow-x: hidden;">
                      <el-checkbox
                        v-for="item in tradeOptions"
                        :label="item"
                        :key="item.key"
                        :value="item"
                      >{{item.value}}</el-checkbox>
                    </el-scrollbar>
                  </el-checkbox-group>
                </el-tab-pane>
              </el-tabs>
            </div>

            <div class="box-cond">
              <el-scrollbar style="height:500px">
                <p>已选活动条件（共{{selectedOptions.length}}项）：</p>
                <el-form v-for="item of selectedOptions" :key="item.value">
                  <!-- 会员类 -->
                  <el-form-item v-if="item.value=='生日'" label="生日">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.birthday7.opUniqueName"
                          :disabled="disabled"
                          clearable
                          @change="handleChangeBirthday"
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="等于当日" value="EqualCurrentDay"></el-option>
                          <el-option label="等于当月" value="EqualCurrentMoney"></el-option>
                          <el-option label="交易当月前后N月" value="EqualCurrentMonthOffset"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <el-input
                          v-if="basicDataForm.birthday7.opUniqueName=='EqualCurrentMonthOffset'"
                          v-model="basicDataForm.birthday7.value"
                          :disabled="disabled"
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='年龄'" label="年龄">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.age9.opUniqueName"
                          :disabled="disabled"
                          clearable
                          @change="handleChangeAge"
                        >
                          <el-option label="大于" value="normalGreater"></el-option>
                          <el-option label="等于" value="normalEqual"></el-option>
                          <el-option label="小于" value="normalLess"></el-option>
                          <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                          <el-option label="小于等于" value="normalLessEqual"></el-option>
                          <el-option label="不等于" value="normalNotEqual"></el-option>
                          <el-option label="包含区间" value="BetweenOperator"></el-option>
                          <el-option label="不包含区间" value="not_BetweenOperator"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <div
                          v-if="basicDataForm.age9.opUniqueName=='BetweenOperator' || basicDataForm.age9.opUniqueName=='not_BetweenOperator'"
                        >
                          <div v-for="(item,index) in basicDataForm.ageRange" :key="index">
                            <el-input
                              style="width:30%;"
                              v-model="item.minAge"
                              :disabled="disabled"
                              placeholder="请输入"
                            ></el-input>
                            <span>-</span>
                            <el-input
                              style="width:30%;"
                              v-model="item.maxAge"
                              :disabled="disabled"
                              placeholder="请输入"
                            ></el-input>
                            <el-button size="small" type="text" @click="delAgeRange(index)">删除</el-button>
                          </div>
                          <el-button size="small" type="text" @click="addAgeRange()">
                            <i class="el-icon-circle-plus-outline"></i>添加
                          </el-button>
                        </div>
                        <span
                          v-if="basicDataForm.age9.opUniqueName!='' && basicDataForm.age9.opUniqueName!='BetweenOperator' && basicDataForm.age9.opUniqueName!='not_BetweenOperator'"
                        >
                          <el-input v-model="basicDataForm.age9.value" placeholder="请输入"></el-input>
                        </span>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='性别'" label="性别">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.sex8.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="包含" value="normalIn"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <el-select
                          v-if="basicDataForm.sex8.opUniqueName!=''"
                          v-model="basicDataForm.sexState"
                          multiple
                          collapse-tags
                          @change="handleChangeSex"
                          :title="basicDataForm.sexStateName.join(',')"
                          clearable
                        >
                          <el-option label="全选" value></el-option>
                          <el-option label="男" value="0"></el-option>
                          <el-option label="女" value="1"></el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='会员等级'" label="会员等级">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.cardTypeKey10.opUniqueName"
                          :disabled="disabled"
                        >
                          <el-option label="全部会员" value="AllMember"></el-option>
                          <el-option label="指定会员等级" value="normalIn"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          v-if="basicDataForm.cardTypeKey10.opUniqueName=='normalIn'"
                          v-model="basicDataForm.cardTypeKey10.value"
                          readonly
                        ></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          type="primary"
                          v-if="basicDataForm.cardTypeKey10.opUniqueName=='normalIn'"
                          @click="selectMembershipLevel()"
                          plain
                        >选择</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='开卡日期'" label="开卡日期">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.openDate12.opUniqueName"
                          :disabled="disabled"
                        >
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
                      </el-col>

                      <el-col :span="10">
                        <el-date-picker
                          v-if="basicDataForm.openDate12.opUniqueName!='DateRangeContainOperator'&&basicDataForm.openDate12.opUniqueName!='not_DateRangeContainOperator'&&basicDataForm.openDate12.opUniqueName!=''"
                          v-model="basicDataForm.openDate12.value"
                          style="width: 200px;"
                          type="date"
                          placeholder="选择日期"
                          value-format="yyyy-MM-dd"
                          :disabled="disabled"
                        ></el-date-picker>
                      </el-col>
                    </el-row>

                    <div
                      v-if="basicDataForm.openDate12.opUniqueName=='DateRangeContainOperator'||basicDataForm.openDate12.opUniqueName=='not_DateRangeContainOperator'"
                    >
                      <el-form-item
                        label
                        v-for="(item,index) in basicDataForm.openCardDateOptions"
                        :key="index"
                      >
                        <el-row>
                          <el-date-picker
                            v-model="item.openCardDateOption"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            :disabled="disabled"
                          ></el-date-picker>
                          <el-button size="small" type="text" @click="delOpenCardDate(index)">删除</el-button>
                        </el-row>
                      </el-form-item>

                      <el-form-item label>
                        <div class="addDate" @click="addOpenCardDate">
                          <i class="el-icon-circle-plus-outline"></i>添加时间
                        </div>
                      </el-form-item>
                    </div>
                  </el-form-item>

                  <el-form-item v-if="item.value=='开卡年限'" label="开卡年限">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.openYears11.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
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
                      </el-col>
                      <el-col :span="10">
                        <span
                          v-if="basicDataForm.openYears11.opUniqueName!='' && basicDataForm.openYears11.opUniqueName!='BetweenOperator' && basicDataForm.openYears11.opUniqueName!='not_BetweenOperator'"
                        >
                          <el-input
                            v-model="basicDataForm.openYears11.value"
                            :disabled="disabled"
                            placeholder="请输入"
                          ></el-input>
                        </span>
                        <div
                          v-if="basicDataForm.openYears11.opUniqueName=='BetweenOperator' || basicDataForm.openYears11.opUniqueName=='not_BetweenOperator'"
                        >
                          <div
                            v-for="(item,index) in basicDataForm.openCardYearsRange"
                            :key="index"
                          >
                            <el-input
                              style="width:30%"
                              v-model="item.minYear"
                              :disabled="disabled"
                              placeholder="请输入"
                            ></el-input>
                            <span>-</span>
                            <el-input
                              style="width:30%"
                              v-model="item.maxYear"
                              :disabled="disabled"
                              placeholder="请输入"
                            ></el-input>
                            <el-button
                              size="small"
                              type="text"
                              @click="delOpenCardYearsRange(index)"
                            >删除</el-button>
                          </div>
                          <el-button size="small" type="text" @click="addOpenCardYearsRange()">
                            <i class="el-icon-circle-plus-outline"></i>添加
                          </el-button>
                        </div>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='开卡月限'" label="开卡月限">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.openMonths87.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
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
                      </el-col>
                      <el-col :span="10">
                        <span
                          v-if="basicDataForm.openMonths87.opUniqueName!='' && basicDataForm.openMonths87.opUniqueName!='BetweenOperator' && basicDataForm.openMonths87.opUniqueName!='not_BetweenOperator'"
                        >
                          <el-input
                            v-model="basicDataForm.openMonths87.value"
                            :disabled="disabled"
                            placeholder="请输入"
                          ></el-input>
                        </span>
                        <div
                          v-if="basicDataForm.openMonths87.opUniqueName=='BetweenOperator' || basicDataForm.openMonths87.opUniqueName=='not_BetweenOperator'"
                        >
                          <div v-for="(item,index) in basicDataForm.openMonthsRange" :key="index">
                            <el-input
                              style="width:30%"
                              v-model="item.minMonth"
                              :disabled="disabled"
                              placeholder="请输入"
                            ></el-input>
                            <span>-</span>
                            <el-input
                              style="width:30%"
                              v-model="item.maxMonth"
                              :disabled="disabled"
                              placeholder="请输入"
                            ></el-input>
                            <el-button
                              size="small"
                              type="text"
                              @click="delOpenMonthsRange(index)"
                            >删除</el-button>
                          </div>
                          <el-button size="small" type="text" @click="addOpenMonthsRange()">
                            <i class="el-icon-circle-plus-outline"></i>添加
                          </el-button>
                        </div>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='账户余额'" label="账户余额">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.balance3.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
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
                        <el-input
                          v-if="basicDataForm.balance3.opUniqueName!=''"
                          v-model="basicDataForm.balance3.value"
                          :disabled="disabled"
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='积分余额'" label="积分余额">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.integral4.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
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
                        <el-input
                          v-if="basicDataForm.integral4.opUniqueName!=''"
                          v-model="basicDataForm.integral4.value"
                          :disabled="disabled"
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='累计积分'" label="累计积分">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.integralTotall52.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
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
                        <el-input
                          v-if="basicDataForm.integralTotall52.opUniqueName!=''"
                          v-model="basicDataForm.integralTotall52.value"
                          :disabled="disabled"
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='注册商户'" label="注册商户">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.registerBusinessCode13.opUniqueName"
                          :disabled="disabled"
                        >
                          <el-option label="包含" value="normalIn"></el-option>
                          <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8">
                        <el-input v-model="basicDataForm.registerBusinessCode13.value" readonly></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          type="primary"
                          disabled="disabled"
                          @click="selectRegMerchant"
                          plain
                        >选择</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='单次消费金额'" label="单次消费金额">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.consumeWayCode2.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
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
                        <el-input
                          v-if="basicDataForm.consumeWayCode2.opUniqueName!=''"
                          v-model="basicDataForm.consumeWayCode2.value"
                          :disabled="disabled"
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='累计消费金额'" label="累计消费金额">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.consumeSum6.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
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
                        <el-input
                          v-if="basicDataForm.consumeSum6.opUniqueName!=''"
                          v-model="basicDataForm.consumeSum6.value"
                          :disabled="disabled"
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <!--影票类 -->
                  <el-form-item v-if="item.value=='放映效果'" label="放映效果">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.showEffect35.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="包含" value="FieldStringIndexOf"></el-option>
                          <el-option label="不包含" value="notFieldStringIndexOf"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          v-if="basicDataForm.showEffect35.opUniqueName!=''"
                          v-model="basicDataForm.showEffect35.value"
                          readonly
                        ></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          type="primary"
                          disabled="disabled"
                          v-if="basicDataForm.showEffect35.opUniqueName!=''"
                          @click="selectEffectOfScreening"
                          plain
                        >选择</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='影厅类型'" label="影厅类型">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.hallTypeKey36.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="包含" value="normalIn"></el-option>
                          <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          v-if="basicDataForm.hallTypeKey36.opUniqueName!=''"
                          v-model="basicDataForm.hallTypeKey36.value"
                          readonly
                        ></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          type="primary"
                          disabled="disabled"
                          v-if="basicDataForm.hallTypeKey36.opUniqueName!=''"
                          @click="selectMovieHall"
                          plain
                        >选择</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='影片'" label="影片">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.uniformCode79.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="包含" value="normalIn"></el-option>
                          <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          v-if="basicDataForm.uniformCode79.opUniqueName!=''"
                          v-model="basicDataForm.uniformCode79.value"
                          readonly
                        ></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          type="primary"
                          disabled="disabled"
                          v-if="basicDataForm.uniformCode79.opUniqueName!=''"
                          @click="selectFilm"
                          plain
                        >选择</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='影片类型'" label="影片类型">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.filmTypeKey34.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="包含" value="stringSplitContainOneOperator"></el-option>
                          <el-option label="不包含" value="notStringSplitContainOneOperator"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          v-if="basicDataForm.filmTypeKey34.opUniqueName!=''"
                          v-model="basicDataForm.filmTypeKey34.value"
                          readonly
                        ></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          type="primary"
                          disabled="disabled"
                          v-if="basicDataForm.filmTypeKey34.opUniqueName!=''"
                          @click="selectFilmType"
                          plain
                        >选择</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='放映有效期'" label="放映有效期">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.planStartTime81.opUniqueName"
                          :disabled="disabled"
                          clearable
                          @change="handleScreeningValidityChange"
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="包含范围" value="TimeBetweenOperator"></el-option>
                          <el-option label="包含每月指定日" value="DayContainOperator"></el-option>
                          <el-option label="不包含每月指定日" value="not_DayContainOperator"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="12">
                        <span
                          v-if="basicDataForm.planStartTime81.opUniqueName=='DayContainOperator'||basicDataForm.planStartTime81.opUniqueName=='not_DayContainOperator'"
                        >
                          <el-input
                            v-model="basicDataForm.planStartTime81.value"
                            :disabled="disabled"
                          ></el-input>
                        </span>
                        <el-date-picker
                          v-if="basicDataForm.planStartTime81.opUniqueName=='TimeBetweenOperator'"
                          v-model="basicDataForm.screeningValidityOption"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd"
                          :disabled="disabled"
                          @change="setScreeningValidity"
                        ></el-date-picker>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='放映排除日期'" label="放映排除日期">
                    <el-checkbox-group
                      v-model="basicDataForm.excludeDate"
                      :disabled="disabled"
                      @change="handleChangeExcludeDate"
                    >
                      <el-row>
                        <el-col :span="10">
                          <el-checkbox :label="'节假日除外'" name="excludeDate">节假日除外</el-checkbox>
                        </el-col>
                        <el-col :span="10">
                          <el-checkbox :label="'指定排除日期范围'" name="excludeDate">指定排除日期范围</el-checkbox>
                        </el-col>
                      </el-row>
                    </el-checkbox-group>

                    <div v-if="basicDataForm.excludeDate.indexOf('指定排除日期范围')!=-1">
                      <el-form-item
                        label
                        v-for="(item,index) in basicDataForm.excludeDateOptions"
                        :key="index"
                      >
                        <el-row>
                          <el-col :span="18">
                            <el-date-picker
                              v-model="item.excludeDateOption"
                              type="daterange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              value-format="yyyy-MM-dd"
                              :disabled="disabled"
                              @change="setExcludeDate"
                            ></el-date-picker>
                          </el-col>
                          <el-col :span="2">
                            <el-button size="small" type="text" @click="delExcludeDate(index)">删除</el-button>
                          </el-col>
                        </el-row>
                      </el-form-item>

                      <el-form-item label>
                        <div class="addDate" @click="addExcludeDate">
                          <i class="el-icon-circle-plus-outline"></i>添加时间
                        </div>
                      </el-form-item>
                    </div>
                  </el-form-item>

                  <el-form-item v-if="item.value=='放映星期范围'" label="放映星期范围">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.filmPlanWeekRange83.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="周一到周五" value="WeekDateOperator"></el-option>
                          <el-option label="指定星期范围" value="WeekDateRangeOperator"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <el-select
                          v-if="basicDataForm.filmPlanWeekRange83.opUniqueName =='WeekDateRangeOperator'"
                          v-model="basicDataForm.weekRangeState"
                          multiple
                          collapse-tags
                          @change="handleChangeweekRange"
                          :title="basicDataForm.weekRangeStateName.join(',')"
                          clearable
                        >
                          <el-option label="全选" value></el-option>
                          <el-option
                            v-for="item in weekOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='放映时段范围'" label="放映时段范围">
                    <el-select
                      v-model="basicDataForm.filmPlanTimeRange84.opUniqueName"
                      :disabled="disabled"
                      style="margin-bottom:10px"
                      clearable
                    >
                      <el-option label="不限" value></el-option>
                      <el-option label="上午09:00-12:59" value="MorningOperator"></el-option>
                      <el-option label="下午13:00-16:59" value="AfternoonOperator"></el-option>
                      <el-option label="晚上17:00-02:00" value="NightOperator"></el-option>
                      <el-option label="指定时段范围" value="TimeRangeContainOperator"></el-option>
                    </el-select>

                    <div
                      v-if="basicDataForm.filmPlanTimeRange84.opUniqueName=='TimeRangeContainOperator'"
                    >
                      <el-form-item
                        label
                        v-for="(item,index) in basicDataForm.screeningPeriodOptions"
                        :key="index"
                      >
                        <el-row>
                          <el-col :span="18">
                            <el-date-picker
                              v-model="item.screeningPeriodOption"
                              type="daterange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              value-format="yyyy-MM-dd"
                              :disabled="disabled"
                            ></el-date-picker>
                          </el-col>
                          <el-col :span="2">
                            <el-button
                              size="small"
                              type="text"
                              @click="delScreeningPeriod(index)"
                            >删除</el-button>
                          </el-col>
                        </el-row>
                      </el-form-item>
                      <div class="addDate" @click="addScreeningPeriod">
                        <i class="el-icon-circle-plus-outline"></i>添加时间
                      </div>
                    </div>
                  </el-form-item>

                  <el-form-item v-if="item.value=='最低发行价'" label="最低发行价">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.lowestPrice38.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="大于" value="normalGreater"></el-option>
                          <el-option label="小于" value="normalLess"></el-option>
                          <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                          <el-option label="小于等于" value="normalLessEqual"></el-option>
                          <el-option label="不等于" value="normalNotEqual"></el-option>
                          <el-option label="等于" value="normalEqual"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <span v-if="basicDataForm.lowestPrice38.opUniqueName!=''">
                          <el-input
                            v-model="basicDataForm.lowestPrice38.value"
                            :disabled="disabled"
                            placeholder="请输入"
                          ></el-input>
                          <span>元</span>
                        </span>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='放映厅座位数'" label="放映厅座位数">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.hallSeatAmout37.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="大于" value="normalGreater"></el-option>
                          <el-option label="等于" value="normalEqual"></el-option>
                          <el-option label="小于" value="normalLess"></el-option>
                          <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                          <el-option label="小于等于" value="normalLessEqual"></el-option>
                          <el-option label="不等于" value="normalNotEqual"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          v-if="basicDataForm.hallSeatAmout37.opUniqueName!=''"
                          v-model="basicDataForm.hallSeatAmout37.value"
                          :disabled="disabled"
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='座位等级'" label="座位等级">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.seatGrade89.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="包含" value="normalIn"></el-option>
                          <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <el-select
                          v-model="basicDataForm.seatLevelState"
                          multiple
                          collapse-tags
                          @change="handleChangeSeatLevel"
                          :title="basicDataForm.seatLevelStateName.join(',')"
                          clearable
                        >
                          <el-option label="全选" value></el-option>
                          <el-option
                            v-for="(item,index) in 10"
                            :key="index"
                            :label="index"
                            :value="index"
                          ></el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <!--卖品类 -->
                  <el-form-item v-if="item.value=='品牌'" label="品牌">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.brandId40.opUniqueName"
                          :disabled="disabled"
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="包含" value="normalIn"></el-option>
                          <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          v-if="basicDataForm.brandId40.opUniqueName!=''"
                          v-model="basicDataForm.brandId40.value"
                          readonly
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          type="primary"
                          disabled="disabled"
                          v-if="basicDataForm.brandId40.opUniqueName!=''"
                          @click="selectBrand"
                          plain
                        >选择</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='类别'" label="类别">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.classCode41.opUniqueName"
                          :disabled="disabled"
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="包含" value="normalIn"></el-option>
                          <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          v-if="basicDataForm.classCode41.opUniqueName!=''"
                          v-model="basicDataForm.classCode41.value"
                          readonly
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          type="primary"
                          disabled="disabled"
                          v-if="basicDataForm.classCode41.opUniqueName!=''"
                          @click="selectType"
                          plain
                        >选择</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='商品名称'" label="商品名称">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.merKey46.opUniqueName"
                          :disabled="disabled"
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="包含" value="normalIn"></el-option>
                          <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          v-if="basicDataForm.merKey46.opUniqueName!=''"
                          placeholder="请输入"
                          v-model="basicDataForm.merKey46.value"
                          readonly
                        ></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          type="primary"
                          disabled="disabled"
                          v-if="basicDataForm.merKey46.opUniqueName!=''"
                          @click="selectGoodsName"
                          plain
                        >选择</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='店内码'" label="店内码">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.merCode42.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="包含" value="normalIn"></el-option>
                          <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <el-input
                          v-if="basicDataForm.merCode42.opUniqueName!=''"
                          v-model="basicDataForm.merCode42.value"
                          :disabled="disabled"
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                      <el-col :span="4"></el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='国际条码'" label="国际条码">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.merBarCode43.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="包含" value="normalIn"></el-option>
                          <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <el-input
                          v-if="basicDataForm.merBarCode43.opUniqueName!=''"
                          v-model="basicDataForm.merBarCode43.value"
                          :disabled="disabled"
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <!-- 交易类 -->
                  <el-form-item v-if="item.value=='交易影院'" label="交易影院">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.cinemaCode19.opUniqueName"
                          :disabled="disabled"
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="包含" value="normalIn"></el-option>
                          <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          v-if="basicDataForm.cinemaCode19.opUniqueName!=''"
                          v-model="basicDataForm.cinemaCode19.value"
                          readonly
                        ></el-input>
                      </el-col>
                      <el-col :span="3">
                        <el-button
                          v-if="basicDataForm.cinemaCode19.opUniqueName!=''"
                          type="primary"
                          disabled="disabled"
                          @click="selectTradeCinema"
                          plain
                        >选择</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='交易影院行政区域'" label="交易影院行政区域">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.cinemaAreaId25.opUniqueName"
                          :disabled="disabled"
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="包含" value="normalIn"></el-option>
                          <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          v-if="basicDataForm.cinemaAreaId25.opUniqueName!=''"
                          v-model="basicDataForm.cinemaAreaId25.value"
                          readonly
                        ></el-input>
                      </el-col>
                      <el-col :span="3">
                        <el-button
                          v-if="basicDataForm.cinemaAreaId25.opUniqueName!=''"
                          type="primary"
                          disabled="disabled"
                          @click="selectTradeCinemaArea()"
                          plain
                        >选择</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='交易渠道'" label="交易渠道">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.consumeWayCode32.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="包含" value="normalIn"></el-option>
                          <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <el-select
                          v-if="basicDataForm.consumeWayCode32.opUniqueName!=''"
                          v-model="basicDataForm.tradeChannelState"
                          multiple
                          collapse-tags
                          @change="handleChangeTradeChannel"
                          :title="basicDataForm.tradeChannelStateName.join(',')"
                          clearable
                        >
                          <el-option
                            v-for="item in tradingMerchantoptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='交易商户'" label="交易商户">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.businessCode14.opUniqueName"
                          :disabled="disabled"
                        >
                          <el-option label="包含" value="normalIn"></el-option>
                          <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8">
                        <el-input v-model="basicDataForm.businessCode14.value" readonly></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          type="primary"
                          disabled="disabled"
                          @click="selectTradeMerchant"
                          plain
                        >选择</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='交易类型'" label="交易类型">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.tradeType33.opUniqueName"
                          :disabled="disabled"
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="包含" value="normalIn"></el-option>
                          <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <el-select
                          v-if="basicDataForm.tradeType33.opUniqueName!=''"
                          v-model="basicDataForm.tradeTypeState"
                          multiple
                          collapse-tags
                          @change="handleChangeTradeType"
                          :title="basicDataForm.tradeTypeStateName.join(',')"
                          clearable
                        >
                          <el-option label="全选" value></el-option>
                          <el-option label="消费" value="BUY"></el-option>
                          <el-option label="充值" value="MEMBER_ADD_AMOUNT"></el-option>
                          <el-option label="退货" value="REJECT"></el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='消费者身份'" label="消费者身份">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.consumerTypeKey27.opUniqueName"
                          :disabled="disabled"
                        >
                          <el-option label="全部会员" value="AllMember"></el-option>
                          <el-option label="指定会员等级" value="AppointMember"></el-option>
                          <el-option label="非会员" value="not_memberOperator"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          v-if="basicDataForm.consumerTypeKey27.opUniqueName=='AppointMember'"
                          v-model="basicDataForm.consumerTypeKey27.value"
                          readonly
                        ></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          type="primary"
                          disabled="disabled"
                          v-if="basicDataForm.consumerTypeKey27.opUniqueName=='AppointMember'"
                          @click="selectConsumerIdentity"
                          plain
                        >选择</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='商品单价'" label="商品单价">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.price31.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="大于" value="normalGreater"></el-option>
                          <el-option label="等于" value="normalEqual"></el-option>
                          <el-option label="小于" value="normalLess"></el-option>
                          <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                          <el-option label="小于等于" value="normalLessEqual"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <el-input
                          v-if="basicDataForm.price31.opUniqueName!=''"
                          v-model="basicDataForm.price31.value"
                          :disabled="disabled"
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='影票单价'" label="影票单价">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.filmPrice92.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="大于" value="normalGreater"></el-option>
                          <el-option label="等于" value="normalEqual"></el-option>
                          <el-option label="小于" value="normalLess"></el-option>
                          <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                          <el-option label="小于等于" value="normalLessEqual"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <el-input
                          v-if="basicDataForm.filmPrice92.opUniqueName!=''"
                          v-model="basicDataForm.filmPrice92.value"
                          :disabled="disabled"
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='卖品单价'" label="卖品单价">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.merPrice93.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="大于" value="normalGreater"></el-option>
                          <el-option label="等于" value="normalEqual"></el-option>
                          <el-option label="小于" value="normalLess"></el-option>
                          <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                          <el-option label="小于等于" value="normalLessEqual"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <el-input
                          v-if="basicDataForm.merPrice93.opUniqueName!=''"
                          v-model="basicDataForm.merPrice93.value"
                          :disabled="disabled"
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='影票商品数量'" label="影票商品数量">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.filmTicketAmount80.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="等于" value="normalEqual"></el-option>
                          <el-option label="小于" value="normalLess"></el-option>
                          <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                          <el-option label="小于等于" value="normalLessEqual"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <el-input
                          v-if="basicDataForm.filmTicketAmount80.opUniqueName!=''"
                          v-model="basicDataForm.filmTicketAmount80.value"
                          :disabled="disabled"
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='影票总金额'" label="影票总金额">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.filmSumPrice90.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="大于" value="normalGreater"></el-option>
                          <el-option label="等于" value="normalEqual"></el-option>
                          <el-option label="小于" value="normalLess"></el-option>
                          <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                          <el-option label="小于等于" value="normalLessEqual"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <el-input
                          v-if="basicDataForm.filmSumPrice90.opUniqueName!=''"
                          v-model="basicDataForm.filmSumPrice90.value"
                          :disabled="disabled"
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='卖品总金额'" label="卖品总金额">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.merSumPrice91.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="大于" value="normalGreater"></el-option>
                          <el-option label="等于" value="normalEqual"></el-option>
                          <el-option label="小于" value="normalLess"></el-option>
                          <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                          <el-option label="小于等于" value="normalLessEqual"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <el-input
                          v-if="basicDataForm.merSumPrice91.opUniqueName!=''"
                          v-model="basicDataForm.merSumPrice91.value"
                          :disabled="disabled"
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='指定商品购买数量'" label>
                    <el-form-item label="商品名称">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.buyNum.merKey21.opUniqueName"
                            :disabled="disabled"
                          >
                            <el-option label="等于" value="normalEqual"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="8">
                          <el-input v-model="basicDataForm.buyNum.merKey21.value" readonly></el-input>
                        </el-col>
                        <el-col :span="4">
                          <el-button
                            type="primary"
                            disabled="disabled"
                            style="margin-left:10px;"
                            @click="selectGoodsName21"
                            plain
                          >选择</el-button>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-form-item label="数量">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.buyNum.amount21.opUniqueName"
                            :disabled="disabled"
                          >
                            <el-option label="不限" value></el-option>
                            <el-option label="等于" value="normalEqual"></el-option>
                            <el-option label="小于" value="normalLess"></el-option>
                            <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                            <el-option label="小于等于" value="normalLessEqual"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="10">
                          <el-input
                            v-if="basicDataForm.buyNum.amount21.opUniqueName!=''"
                            v-model="basicDataForm.buyNum.amount21.value"
                            placeholder="请输入"
                          ></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-form-item>

                  <el-form-item v-if="item.value=='整单交易金额'" label="整单交易金额">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.sumPrice26.opUniqueName"
                          :disabled="disabled"
                          placeholder="请输入"
                          clearable
                        >
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
                        <el-input
                          v-if="basicDataForm.sumPrice26.opUniqueName!=''"
                          v-model="basicDataForm.sumPrice26.value"
                          :disabled="disabled"
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='同类商品累计购买数量'" label>
                    <el-form-item label="商品类别">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.buyNumByType.classCode28.opUniqueName"
                            :disabled="disabled"
                          >
                            <el-option label="包含" value="normalIn"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="8">
                          <el-input v-model="basicDataForm.buyNumByType.classCode28.value" readonly></el-input>
                        </el-col>
                        <el-col :span="4">
                          <el-button
                            type="primary"
                            disabled="disabled"
                            style="margin-left:10px;"
                            @click="selectClassCode28"
                            plain
                          >选择</el-button>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item label="累计购买数量">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.buyNumByType.sumAmount28.opUniqueName"
                            :disabled="disabled"
                          >
                            <el-option label="不限" value></el-option>
                            <el-option label="大于" value="MerStatisItemAmountGreater"></el-option>
                            <el-option label="等于" value="MerStatisItemAmountEqual"></el-option>
                            <el-option label="小于" value="MerStatisItemAmountLess"></el-option>
                            <el-option label="大于等于" value="MerStatisItemAmountGreaterEqual"></el-option>
                            <el-option label="小于等于" value="MerStatisItemAmountLessEqual"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="10">
                          <el-input
                            v-if="basicDataForm.buyNumByType.sumAmount28.opUniqueName!=''"
                            v-model="basicDataForm.buyNumByType.sumAmount28.value"
                            placeholder="请输入"
                          ></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-form-item>

                  <el-form-item v-if="item.value=='同品牌商品累计购买数量'" label>
                    <el-form-item label="商品品牌">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.buyNumByBrand.brandId29.opUniqueName"
                            :disabled="disabled"
                          >
                            <el-option label="包含" value="normalIn"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="8">
                          <el-input v-model="basicDataForm.buyNumByBrand.brandId29.value" readonly></el-input>
                        </el-col>
                        <el-col :span="4">
                          <el-button
                            type="primary"
                            disabled="disabled"
                            style="margin-left:10px;"
                            @click="selectBrandId29()"
                            plain
                          >选择</el-button>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-form-item label="累计购买数量">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.buyNumByBrand.sumAmount29.opUniqueName"
                            :disabled="disabled"
                          >
                            <el-option label="不限" value></el-option>
                            <el-option label="大于" value="MerStatisItemAmountGreater"></el-option>
                            <el-option label="等于" value="MerStatisItemAmountEqual"></el-option>
                            <el-option label="小于" value="MerStatisItemAmountLess"></el-option>
                            <el-option label="大于等于" value="MerStatisItemAmountGreaterEqual"></el-option>
                            <el-option label="小于等于" value="MerStatisItemAmountLessEqual"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="10">
                          <el-input
                            v-if="basicDataForm.buyNumByBrand.sumAmount29.opUniqueName!=''"
                            v-model="basicDataForm.buyNumByBrand.sumAmount29.value"
                            placeholder="请输入"
                          ></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </el-form-item>

                  <el-form-item v-if="item.value=='支付方式（柜台用）'" label="支付方式">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.payTypeCode86.opUniqueName"
                          :disabled="disabled"
                          clearable
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="包含" value="normalIn"></el-option>
                          <el-option label="不包含" value="normalNotIn"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="8">
                        <el-input
                          v-if="basicDataForm.payTypeCode86.opUniqueName!=''"
                          v-model="basicDataForm.payTypeCode86.value"
                          readonly
                        ></el-input>
                      </el-col>
                      <el-col :span="4">
                        <el-button
                          type="primary"
                          v-if="basicDataForm.payTypeCode86.opUniqueName!=''"
                          style="margin-left:10px;"
                          @click="selectPayType"
                          plain
                          disabled="disabled"
                        >选择</el-button>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='放映前N天'" label="放映前N天">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.filmStartDayBefore94.opUniqueName"
                          :disabled="disabled"
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="大于" value="normalGreater"></el-option>
                          <el-option label="等于" value="normalEqual"></el-option>
                          <el-option label="小于" value="normalLess"></el-option>
                          <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                          <el-option label="小于等于" value="normalLessEqual"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <el-input
                          v-if="basicDataForm.filmStartDayBefore94.opUniqueName!=''"
                          v-model="basicDataForm.filmStartDayBefore94.value"
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='放映前N小时'" label="放映前N小时">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.filmStartHourBefore95.opUniqueName"
                          :disabled="disabled"
                        >
                          <el-option label="不限" value></el-option>
                          <el-option label="大于" value="normalGreater"></el-option>
                          <el-option label="等于" value="normalEqual"></el-option>
                          <el-option label="小于" value="normalLess"></el-option>
                          <el-option label="大于等于" value="normalGreaterEqual"></el-option>
                          <el-option label="小于等于" value="normalLessEqual"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <el-input
                          v-if="basicDataForm.filmStartHourBefore95.opUniqueName!=''"
                          v-model="basicDataForm.filmStartHourBefore95.value"
                          placeholder="请输入"
                        ></el-input>
                      </el-col>
                    </el-row>
                  </el-form-item>

                  <el-form-item v-if="item.value=='MOVIE365首次购票'" label="MOVIE365首次购票">
                    <el-row>
                      <el-col :span="8">
                        <el-select
                          v-model="basicDataForm.firstBuyTicket96.opUniqueName"
                          :disabled="disabled"
                        >
                          <el-option label="等于" value="normalEqual"></el-option>
                        </el-select>
                      </el-col>
                      <el-col :span="10">
                        <el-select
                          v-model="basicDataForm.firstBuyTicket96.value"
                          :disabled="disabled"
                        >
                          <el-option label="是" value="1"></el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-form>
              </el-scrollbar>
            </div>
          </div>
        </el-card>
      </el-collapse-item>
      <!-- 子活动执行方式 -->
      <el-collapse-item title="子活动执行方式" name="3">
        <div style="color:#666666;margin-bottom:10px">请选择该活动执行方法，可多选</div>
        <el-card class="box-card">
          <div slot="header">子活动执行方法</div>
          <div class="box-content">
            <div class="box-tabs">
              <el-tabs v-model="activeName1" tab-position="left" type="border-card">
                <el-tab-pane label name="first1">
                  <span slot="label">
                    <el-badge
                      v-if="checkedMemberAction.length>0"
                      type="primary "
                      size="small"
                      :value="checkedMemberAction.length"
                    >会员类</el-badge>
                    <span v-else>会员类</span>
                  </span>
                  <el-checkbox-group v-model="checkedMemberAction" @change="handleCheckedAction">
                    <el-checkbox
                      v-for="item in memberActions"
                      :label="item"
                      :key="item.key"
                    >{{item.value}}</el-checkbox>
                  </el-checkbox-group>
                </el-tab-pane>

                <el-tab-pane name="second1">
                  <span slot="label">
                    <el-badge
                      v-if="checkedTicketsAction.length>0"
                      type="primary "
                      size="small"
                      :value="checkedTicketsAction.length"
                    >影票类</el-badge>
                    <span v-else>影票类</span>
                  </span>
                  <el-checkbox-group v-model="checkedTicketsAction" @change="handleCheckedAction">
                    <el-checkbox
                      v-for="item in movieTicketsActions"
                      :label="item"
                      :key="item.key"
                    >{{item.value}}</el-checkbox>
                  </el-checkbox-group>
                </el-tab-pane>

                <el-tab-pane label name="third1">
                  <span slot="label">
                    <el-badge
                      v-if="checkedTradeAction.length>0"
                      type="primary "
                      size="small"
                      :value="checkedTradeAction.length"
                    >交易类</el-badge>
                    <span v-else>交易类</span>
                  </span>

                  <el-checkbox-group v-model="checkedTradeAction" @change="handleCheckedAction">
                    <el-scrollbar style="height:500px;overflow-x: hidden;">
                      <el-checkbox
                        v-for="item in tradeActions"
                        :label="item"
                        :key="item.key"
                      >{{item.value}}</el-checkbox>
                    </el-scrollbar>
                  </el-checkbox-group>
                </el-tab-pane>
              </el-tabs>
            </div>
            <div class="box-cond">
              <el-scrollbar style="height:500px">
                <p>已选执行方法（共{{selectedActions.length}}项）：</p>

                <el-form v-for="item of selectedActions" :key="item.key">
                  <!-- 会员类 -->
                  <div v-if="item.value=='赠送积分'">
                    <div class="actionLabel">【赠送积分】</div>
                    <el-form-item label="赠送积分">
                      <el-row>
                        <el-col :span="10">
                          <el-input
                            v-model="basicDataForm.presentPoint1.value"
                            :disabled="disabled"
                            placeholder="请输入"
                          ></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </div>

                  <div v-if="item.value=='赠送积分倍率'">
                    <div class="actionLabel">【赠送积分倍率】</div>
                    <el-form-item label="赠送积分倍率">
                      <el-row>
                        <el-col :span="10">
                          <el-input
                            v-model="basicDataForm.pointPersent18.value"
                            :disabled="disabled"
                            placeholder="请输入"
                          ></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </div>

                  <div v-if="item.value=='赠送会员卡储值额'">
                    <div class="actionLabel">【赠送会员卡储值额】</div>
                    <el-form-item label="赠送会员卡储值额">
                      <el-row>
                        <el-col :span="10">
                          <el-input
                            v-model="basicDataForm.presentMoney2.value"
                            :disabled="disabled"
                            placeholder="请输入"
                          ></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </div>

                  <div v-if="item.value=='赠送票券'">
                    <div class="actionLabel">【赠送票券】</div>
                    <el-form-item label="票券名称">
                      <el-row>
                        <el-col :span="8">
                          <el-input
                            v-model="basicDataForm.giftTicket.couponApplyCode3.value"
                            readonly
                          ></el-input>
                        </el-col>
                        <el-col :span="4">
                          <el-button type="primary" @click="selectTicketName3" plain>选择</el-button>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item label="数量">
                      <el-row>
                        <el-col :span="8">
                          <el-input
                            v-model="basicDataForm.giftTicket.amount3.value"
                            :disabled="disabled"
                            placeholder="请输入"
                          ></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item label="是否发送短信">
                      <el-row>
                        <el-col :span="10">
                          <el-select
                            v-model="basicDataForm.giftTicket.isSendSms3.value"
                            :disabled="disabled"
                          >
                            <el-option label="是" value="send"></el-option>
                            <el-option label="否" value="unsend"></el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </div>

                  <!-- 影票类 -->
                  <div v-if="item.value=='按座位等级修改票价'">
                    <div class="actionLabel">【按座位等级修改票价】</div>
                    <el-form-item label="调价方式">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.updateTicketPriceBySeatGrade.modifyWay29.value"
                            :disabled="disabled"
                          >
                            <el-option label="固定金额 ( 元 )" value="fixPrice"></el-option>
                            <el-option label="零售价打折 ( % )" value="discountPrice"></el-option>
                            <el-option label="零售价-N ( 元 )" value="subPrice"></el-option>
                            <el-option label="最低发行价±N元" value="addToLowestPrice"></el-option>
                          </el-select>
                        </el-col>

                        <el-col
                          :span="10"
                          v-if="basicDataForm.updateTicketPriceBySeatGrade.modifyWay29.value!='' "
                        >
                          <el-form-item label="调整额">
                            <el-row>
                              <el-col :span="10">
                                <el-input
                                  v-model="basicDataForm.updateTicketPriceBySeatGrade.modifyValue29.value"
                                  :disabled="disabled"
                                  placeholder="请输入"
                                ></el-input>
                              </el-col>
                            </el-row>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item
                      label="折扣后加减N元"
                      v-if="basicDataForm.updateTicketPriceBySeatGrade.modifyWay29.value=='discountPrice' "
                    >
                      <el-row>
                        <el-col :span="8">
                          <el-input
                            v-model="basicDataForm.updateTicketPriceBySeatGrade.addAmountAfterDiscount29.value"
                            :disabled="disabled"
                            placeholder="请输入"
                          ></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-row>
                      <el-col :span="10">
                        <el-form-item label="积分定价（分）">
                          <el-row>
                            <el-col :span="12">
                              <el-input
                                v-model="basicDataForm.updateTicketPriceBySeatGrade.integralAmount29.value"
                                :disabled="disabled"
                                placeholder="请输入"
                              ></el-input>
                            </el-col>
                          </el-row>
                        </el-form-item>
                      </el-col>

                      <el-col :span="8">
                        <el-form-item label="加金额（元）">
                          <el-row>
                            <el-col :span="12">
                              <el-input
                                v-model="basicDataForm.updateTicketPriceBySeatGrade.integralMoney29.value"
                                :disabled="disabled"
                                placeholder="请输入"
                              ></el-input>
                            </el-col>
                          </el-row>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-form-item label="折后取整方式">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.updateTicketPriceBySeatGrade.decimalRoundMode29.value"
                            :disabled="disabled"
                          >
                            <el-option label="四舍五入" value="ROUND_HALF_UP"></el-option>
                            <el-option label="忽略小数取整" value="ROUND_FLOOR"></el-option>
                            <el-option label="小数进1取整" value="ROUND_CEILING"></el-option>
                            <el-option label="保留小数" value="ROUND_UNNECESSARY"></el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-form-item label="低于最低价时">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.updateTicketPriceBySeatGrade.lessProcessMethod29.value"
                            :disabled="disabled"
                          >
                            <el-option label="不允许出票" value="notAllowSale"></el-option>
                            <el-option label="影院补贴" value="cinemaPay"></el-option>
                            <el-option label="用户补贴" value="clientPay"></el-option>
                          </el-select>
                        </el-col>
                        <el-col
                          :span="10"
                          v-if="basicDataForm.updateTicketPriceBySeatGrade.lessProcessMethod29.value=='cinemaPay'"
                        >
                          <el-form-item label="影院补贴N元">
                            <el-row>
                              <el-col :span="10">
                                <el-input
                                  v-model="basicDataForm.updateTicketPriceBySeatGrade.cinemaPayAmount29.value"
                                  :disabled="disabled"
                                  placeholder="请输入"
                                ></el-input>
                              </el-col>
                            </el-row>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-form-item label="调价商品数量">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.updateTicketPriceBySeatGrade.modifyAmountMethod29.value"
                            :disabled="disabled"
                          >
                            <el-option label="指定数量" value="appointAmount"></el-option>
                            <el-option label="全部影票" value="all"></el-option>
                          </el-select>
                        </el-col>
                        <el-col
                          :span="10"
                          v-if="basicDataForm.updateTicketPriceBySeatGrade.modifyAmountMethod29.value=='appointAmount'"
                        >
                          <el-form-item label="数量">
                            <el-row>
                              <el-col :span="10">
                                <el-input
                                  v-model="basicDataForm.updateTicketPriceBySeatGrade.modifyAmount29.value"
                                  :disabled="disabled"
                                  placeholder="请输入"
                                ></el-input>
                              </el-col>
                            </el-row>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-form-item label="座位等级">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.action_seatLevel"
                            multiple
                            collapse-tags
                            @change="handleChangeAction_SeatLevel"
                            :title="basicDataForm.action_seatLevelName.join(',')"
                            clearable
                          >
                            <el-option label="全选" value></el-option>
                            <el-option
                              v-for="(item,index) in 10"
                              :key="index"
                              :label="index"
                              :value="index"
                            ></el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </div>

                  <div v-if="item.value=='修改单票售价'">
                    <div class="actionLabel">【修改单票售价】</div>
                    <el-form-item label="调价方式">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.updateTicketPrice.modifyWay15.value"
                            :disabled="disabled"
                          >
                            <el-option label="固定金额 ( 元 )" value="fixPrice"></el-option>
                            <el-option label="零售价打折 ( % )" value="discountPrice"></el-option>
                            <el-option label="零售价-N ( 元 )" value="subPrice"></el-option>
                            <el-option label="最低发行价±N元" value="addToLowestPrice"></el-option>
                          </el-select>
                        </el-col>

                        <el-col
                          :span="10"
                          v-if="basicDataForm.updateTicketPrice.modifyWay15.value!='' "
                        >
                          <el-form-item label="调整额">
                            <el-row>
                              <el-col :span="10">
                                <el-input
                                  v-model="basicDataForm.updateTicketPrice.modifyValue15.value"
                                  :disabled="disabled"
                                  placeholder="请输入"
                                ></el-input>
                              </el-col>
                            </el-row>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item
                      label="折扣后加减N元"
                      v-if="basicDataForm.updateTicketPrice.modifyWay15.value=='discountPrice' "
                    >
                      <el-row>
                        <el-col :span="8">
                          <el-input
                            v-model="basicDataForm.updateTicketPrice.addAmountAfterDiscount15.value"
                            :disabled="disabled"
                            placeholder="请输入"
                          ></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-row>
                      <el-col :span="10">
                        <el-form-item label="积分定价（分）">
                          <el-row>
                            <el-col :span="12">
                              <el-input
                                v-model="basicDataForm.updateTicketPrice.integralAmount15.value"
                                :disabled="disabled"
                                placeholder="请输入"
                              ></el-input>
                            </el-col>
                          </el-row>
                        </el-form-item>
                      </el-col>

                      <el-col :span="8">
                        <el-form-item label="加金额（元）">
                          <el-row>
                            <el-col :span="12">
                              <el-input
                                v-model="basicDataForm.updateTicketPrice.integralMoney15.value"
                                :disabled="disabled"
                                placeholder="请输入"
                              ></el-input>
                            </el-col>
                          </el-row>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-form-item label="折后取整方式">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.updateTicketPrice.decimalRoundMode15.value"
                            :disabled="disabled"
                          >
                            <el-option label="四舍五入" value="ROUND_HALF_UP"></el-option>
                            <el-option label="忽略小数取整" value="ROUND_FLOOR"></el-option>
                            <el-option label="小数进1取整" value="ROUND_CEILING"></el-option>
                            <el-option label="保留小数" value="ROUND_UNNECESSARY"></el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-form-item label="低于最低价时">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.updateTicketPrice.lessProcessMethod15.value"
                            :disabled="disabled"
                          >
                            <el-option label="不允许出票" value="notAllowSale"></el-option>
                            <el-option label="影院补贴" value="cinemaPay"></el-option>
                            <el-option label="用户补贴" value="clientPay"></el-option>
                          </el-select>
                        </el-col>
                        <el-col
                          :span="10"
                          v-if="basicDataForm.updateTicketPrice.lessProcessMethod15.value=='cinemaPay'"
                        >
                          <el-form-item label="影院补贴N元">
                            <el-row>
                              <el-col :span="10">
                                <el-input
                                  v-model="basicDataForm.updateTicketPrice.cinemaPayAmount15.value"
                                  :disabled="disabled"
                                  placeholder="请输入"
                                ></el-input>
                              </el-col>
                            </el-row>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-form-item label="调价商品数量">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.updateTicketPrice.modifyAmountMethod15.value"
                            :disabled="disabled"
                          >
                            <el-option label="指定数量" value="appointAmount"></el-option>
                            <el-option label="全部影票" value="all"></el-option>
                            <el-option label="每会员每日数量" value="perMemberDay"></el-option>
                            <el-option label="每会员每周数量" value="perMemberWeek"></el-option>
                            <el-option label="每会员每月数量" value="perMemberMonth"></el-option>
                          </el-select>
                        </el-col>
                        <el-col
                          :span="10"
                          v-if="basicDataForm.updateTicketPrice.modifyAmountMethod15.value!='all'"
                        >
                          <el-form-item label="数量">
                            <el-row>
                              <el-col :span="10">
                                <el-input
                                  v-model="basicDataForm.updateTicketPrice.modifyAmount15.value"
                                  :disabled="disabled"
                                  placeholder="请输入"
                                ></el-input>
                              </el-col>
                            </el-row>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </div>

                  <!-- 交易类 -->
                  <div v-if="item.value=='单品优惠价调整'">
                    <div class="actionLabel">【单品优惠价调整】</div>
                    <el-form-item label="商品">
                      <el-row>
                        <el-col :span="8">
                          <el-input
                            v-model="basicDataForm.judgeDiscountPrice.merKey9.value"
                            readonly
                          ></el-input>
                        </el-col>
                        <el-col :span="4">
                          <el-button type="primary" @click="selectGoods9" plain>选择</el-button>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item label="调价方式">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.judgeDiscountPrice.modifyWay9.value"
                            :disabled="disabled"
                          >
                            <el-option label="固定金额 ( 元 )" value="fixPrice"></el-option>
                            <el-option label="零售价打折 ( % )" value="discountPrice"></el-option>
                            <el-option label="零售价-N ( 元 )" value="subPrice"></el-option>
                            <el-option label="最低发行价±N元" value="addToLowestPrice"></el-option>
                          </el-select>
                        </el-col>

                        <el-col
                          :span="10"
                          v-if="basicDataForm.judgeDiscountPrice.modifyWay9.value!='' "
                        >
                          <el-form-item label="调整额">
                            <el-row>
                              <el-col :span="10">
                                <el-input
                                  v-model="basicDataForm.judgeDiscountPrice.modifyValue9.value"
                                  :disabled="disabled"
                                  placeholder="请输入"
                                ></el-input>
                              </el-col>
                            </el-row>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item
                      label="折扣后加减N元"
                      v-if="basicDataForm.judgeDiscountPrice.modifyWay9.value=='discountPrice' "
                    >
                      <el-row>
                        <el-col :span="8">
                          <el-input
                            v-model="basicDataForm.judgeDiscountPrice.addAmountAfterDiscount9.value"
                            :disabled="disabled"
                            placeholder="请输入"
                          ></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-row>
                      <el-col :span="10">
                        <el-form-item label="积分定价（分）">
                          <el-row>
                            <el-col :span="12">
                              <el-input
                                v-model="basicDataForm.judgeDiscountPrice.integralAmount9.value"
                                :disabled="disabled"
                                placeholder="请输入"
                              ></el-input>
                            </el-col>
                          </el-row>
                        </el-form-item>
                      </el-col>

                      <el-col :span="8">
                        <el-form-item label="加金额（元）">
                          <el-row>
                            <el-col :span="12">
                              <el-input
                                v-model="basicDataForm.judgeDiscountPrice.integralMoney9.value"
                                :disabled="disabled"
                                placeholder="请输入"
                              ></el-input>
                            </el-col>
                          </el-row>
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-form-item label="调价商品数量">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.judgeDiscountPrice.modifyAmountMethod9.value"
                            :disabled="disabled"
                          >
                            <el-option label="指定数量" value="appointAmount"></el-option>
                            <el-option label="该商品全部数量" value="all"></el-option>
                          </el-select>
                        </el-col>
                        <el-col
                          :span="10"
                          v-if="basicDataForm.judgeDiscountPrice.modifyAmountMethod9.value=='appointAmount'"
                        >
                          <el-form-item label="数量">
                            <el-row>
                              <el-col :span="10">
                                <el-input
                                  v-model="basicDataForm.judgeDiscountPrice.modifyAmount9.value"
                                  :disabled="disabled"
                                  placeholder="请输入"
                                ></el-input>
                              </el-col>
                            </el-row>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-form-item label="折后取整方式">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.judgeDiscountPrice.decimalRoundMode9.value"
                            :disabled="disabled"
                          >
                            <el-option label="四舍五入" value="ROUND_HALF_UP"></el-option>
                            <el-option label="忽略小数取整" value="ROUND_FLOOR"></el-option>
                            <el-option label="小数进1取整" value="ROUND_CEILING"></el-option>
                            <el-option label="保留小数" value="ROUND_UNNECESSARY"></el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </div>

                  <div v-if="item.value=='以优惠价格增加单品'">
                    <div class="actionLabel">【以优惠价格增加单品】</div>
                    <el-form-item label="商品">
                      <el-row>
                        <el-col :span="8">
                          <el-input
                            v-model="basicDataForm.addGoodsWithDiscountPrice.merKey10.value"
                            readonly
                          ></el-input>
                        </el-col>
                        <el-col :span="4">
                          <el-button type="primary" @click="selectGoods10" plain>选择</el-button>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item label="商品单价">
                      <el-row>
                        <el-col :span="8">
                          <el-input
                            v-model="basicDataForm.addGoodsWithDiscountPrice.price10.value"
                            :disabled="disabled"
                            placeholder="请输入"
                          ></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-form-item label="增加数量">
                      <el-row>
                        <el-col :span="8">
                          <el-input
                            v-model="basicDataForm.addGoodsWithDiscountPrice.amount10.value"
                            :disabled="disabled"
                            placeholder="请输入"
                          ></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </div>

                  <div v-if="item.value=='赠送商品'">
                    <div class="actionLabel">【赠送商品】</div>
                    <el-form-item label="商品">
                      <el-row>
                        <el-col :span="8">
                          <el-input v-model="basicDataForm.giftGoods.merKey11.value" readonly></el-input>
                        </el-col>
                        <el-col :span="4">
                          <el-button type="primary" @click="selectGoods" plain>选择</el-button>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item label="商品单价">
                      <el-row>
                        <el-col :span="8">
                          <el-input
                            v-model="basicDataForm.giftGoods.price11.value"
                            readonly
                            placeholder="请输入"
                          ></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-form-item label="赠送数量">
                      <el-row>
                        <el-col :span="8">
                          <el-input
                            v-model="basicDataForm.giftGoods.amount11.value"
                            :disabled="disabled"
                            placeholder="请输入"
                          ></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </div>

                  <div v-if="item.value=='卖品分类优惠价调整'">
                    <div class="actionLabel">【卖品分类优惠价调整】</div>
                    <el-form-item label="商品分类">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.judgeDiscountPriceByType.merCategoryMethod27.value"
                            :disabled="disabled"
                          >
                            <el-option label="全部卖品分类" value="allMerCategory"></el-option>
                            <el-option label="指定分类" value="appointCategory"></el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item
                      label="分类"
                      v-if="basicDataForm.judgeDiscountPriceByType.merCategoryMethod27.value=='appointCategory'"
                    >
                      <el-row>
                        <el-col :span="8">
                          <el-input
                            v-model="basicDataForm.judgeDiscountPriceByType.classCode27.value"
                            readonly
                          ></el-input>
                        </el-col>
                        <el-col :span="4">
                          <el-button type="primary" @click="selectGoodsType" plain>选择</el-button>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item label="调价方式">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.judgeDiscountPriceByType.modifyWay27.value"
                            :disabled="disabled"
                          >
                            <el-option label="零售价打折 ( % )" value="discountPrice"></el-option>
                            <el-option label="零售价-N ( 元 )" value="subPrice"></el-option>
                          </el-select>
                        </el-col>

                        <el-col
                          :span="10"
                          v-if="basicDataForm.judgeDiscountPriceByType.modifyWay27.value!='' "
                        >
                          <el-form-item label="调价值">
                            <el-row>
                              <el-col :span="10">
                                <el-input
                                  v-model="basicDataForm.judgeDiscountPriceByType.modifyValue27.value"
                                  :disabled="disabled"
                                  placeholder="请输入"
                                ></el-input>
                              </el-col>
                            </el-row>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item
                      label="折扣后加减N元"
                      v-if="basicDataForm.judgeDiscountPriceByType.modifyWay27.value=='discountPrice' "
                    >
                      <el-row>
                        <el-col :span="8">
                          <el-input
                            v-model="basicDataForm.judgeDiscountPriceByType.addAmountAfterDiscount27.value"
                            :disabled="disabled"
                            placeholder="请输入"
                          ></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-form-item label="调价商品数量">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.judgeDiscountPriceByType.modifyAmountMethod27.value"
                            :disabled="disabled"
                          >
                            <el-option label="指定数量" value="appointAmount"></el-option>
                            <el-option label="该分类全部数量" value="all"></el-option>
                          </el-select>
                        </el-col>
                        <el-col
                          :span="10"
                          v-if="basicDataForm.judgeDiscountPriceByType.modifyAmountMethod27.value=='appointAmount'"
                        >
                          <el-form-item label="数量">
                            <el-row>
                              <el-col :span="10">
                                <el-input
                                  v-model="basicDataForm.judgeDiscountPriceByType.modifyAmount27.value"
                                  :disabled="disabled"
                                  placeholder="请输入"
                                ></el-input>
                              </el-col>
                            </el-row>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-form-item label="折后取整方式">
                      <el-row>
                        <el-col :span="8">
                          <el-select
                            v-model="basicDataForm.judgeDiscountPriceByType.decimalRoundMode27.value"
                            :disabled="disabled"
                          >
                            <el-option label="四舍五入" value="ROUND_HALF_UP"></el-option>
                            <el-option label="忽略小数取整" value="ROUND_FLOOR"></el-option>
                            <el-option label="小数进1取整" value="ROUND_CEILING"></el-option>
                            <el-option label="保留小数" value="ROUND_UNNECESSARY"></el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </div>

                  <div v-if="item.value=='按品牌优惠价调整'">
                    <div class="actionLabel">【按品牌优惠价调整】</div>
                    <el-form-item label="商品品牌">
                      <el-row>
                        <el-col :span="8">
                          <el-select v-model="basicDataForm.judgeDiscountPriceByBrand.merBrandMethod28.value" :disabled="disabled">
                            <el-option label="全部品牌" value="allMerBrand"></el-option>
                            <el-option label="指定品牌" value="appointBrand"></el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item label="品牌" v-if="basicDataForm.judgeDiscountPriceByBrand.merBrandMethod28.value=='appointBrand'">
                      <el-row>
                        <el-col :span="8">
                          <el-input v-model="basicDataForm.judgeDiscountPriceByBrand.brandId28.value" readonly></el-input>
                        </el-col>
                        <el-col :span="4">
                          <el-button type="primary" @click="selectBrandId28" plain>选择</el-button>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item label="调价方式">
                      <el-row>
                        <el-col :span="8">
                          <el-select v-model="basicDataForm.judgeDiscountPriceByBrand.modifyWay28.value" :disabled="disabled">
                            <el-option label="零售价打折 ( % )" value="discountPrice"></el-option>
                            <el-option label="零售价-N ( 元 )" value="subPrice"></el-option>
                          </el-select>
                        </el-col>

                        <el-col :span="10" v-if="basicDataForm.judgeDiscountPriceByBrand.modifyWay28.value!='' ">
                          <el-form-item label="调价值">
                            <el-row>
                              <el-col :span="10">
                                <el-input
                                  v-model="basicDataForm.judgeDiscountPriceByBrand.modifyValue28.value"
                                  :disabled="disabled"
                                  placeholder="请输入"
                                ></el-input>
                              </el-col>
                            </el-row>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item
                      label="折扣后加减N元"
                      v-if="basicDataForm.judgeDiscountPriceByBrand.modifyWay28.value=='discountPrice' "
                    >
                      <el-row>
                        <el-col :span="8">
                          <el-input
                            v-model="basicDataForm.judgeDiscountPriceByBrand.addAmountAfterDiscount28.value"
                            :disabled="disabled"
                            placeholder="请输入"
                          ></el-input>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-form-item label="调价商品数量">
                      <el-row>
                        <el-col :span="8">
                          <el-select v-model="basicDataForm.judgeDiscountPriceByBrand.modifyAmountMethod28.value" :disabled="disabled">
                            <el-option label="指定数量" value="appointAmount"></el-option>
                            <el-option label="该分类全部数量" value="all"></el-option>
                          </el-select>
                        </el-col>
                        <el-col :span="10" v-if="basicDataForm.judgeDiscountPriceByBrand.modifyAmountMethod28.value=='appointAmount'">
                          <el-form-item label="数量">
                            <el-row>
                              <el-col :span="10">
                                <el-input
                                  v-model="basicDataForm.judgeDiscountPriceByBrand.modifyAmount28.value"
                                  :disabled="disabled"
                                  placeholder="请输入"
                                ></el-input>
                              </el-col>
                            </el-row>
                          </el-form-item>
                        </el-col>
                      </el-row>
                    </el-form-item>

                    <el-form-item label="折后取整方式">
                      <el-row>
                        <el-col :span="8">
                          <el-select v-model="basicDataForm.judgeDiscountPriceByBrand.decimalRoundMode28.value" :disabled="disabled">
                            <el-option label="四舍五入" value="ROUND_HALF_UP"></el-option>
                            <el-option label="忽略小数取整" value="ROUND_FLOOR"></el-option>
                            <el-option label="小数进1取整" value="ROUND_CEILING"></el-option>
                            <el-option label="保留小数" value="ROUND_UNNECESSARY"></el-option>
                          </el-select>
                        </el-col>
                      </el-row>
                    </el-form-item>
                  </div>
                </el-form>
              </el-scrollbar>
            </div>
          </div>
        </el-card>
      </el-collapse-item>
    </el-collapse>
    <fixStepTool :stepData="stepData.stepList" style="margin-right:100px;"></fixStepTool>

    <div style="margin-left:200px; margin-bottom:100px;">
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
      <el-button @click="returnList()">返回</el-button>
    </div>
  </div>
</template>

<script>
import FixStepTool from "../../../components/fix-step-tool/fix-step-tool";
import fixStepMixin from "../../../mixins/marketing/fixStepTool.js";
import qs from "qs";
import Actions from "./actions.json";
import RuleConditions from "./ruleConditions.json";

// 活动条件
const memberOptions = [
  { key: "birthday7", value: "生日" }, //key 等于key+groupId 必须保证key的唯一性
  { key: "sex8", value: "性别" },
  { key: "age9", value: "年龄" },
  { key: "openMonths87", value: "开卡月限" },
  { key: "openYears11", value: "开卡年限" },
  { key: "openDate12", value: "开卡日期" },
  { key: "cardTypeKey10", value: "会员等级" },
  { key: "registerBusinessCode13", value: "注册商户" },
  { key: "balance3", value: "账户余额" },
  { key: "integral4", value: "积分余额" },
  { key: "integralTotall52", value: "累计积分" },
  { key: "consumeWayCode2", value: "单次消费金额" },
  { key: "consumeSum6", value: "累计消费金额" }
];
const tradeOptions = [
  { key: "cinemaCode19", value: "交易影院" },
  { key: "cinemaAreaId25", value: "交易影院行政区域" },
  { key: "businessCode14", value: "交易商户" },
  { key: "consumerTypeKey27", value: "消费者身份" },
  { key: "tradeType33", value: "交易类型" },
  { key: "consumeWayCode32", value: "交易渠道" },
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
  { key: "payTypeCode86", value: "支付方式(柜台用)" },
  { key: "filmStartDayBefore94", value: "放映前N天" },
  { key: "filmStartHourBefore95", value: "放映前N小时" },
  { key: "firstBuyTicket96", value: "MOVIE365首次购票" }
];
const movieTicketsOptions = [
  { key: "uniformCode79", value: "影片" },
  { key: "hallTypeKey36", value: "影厅类型" },
  { key: "filmTypeKey34", value: "影片类型" },
  { key: "showEffect35", value: "放映效果" },
  { key: "seatGrade89", value: "座位等级" },
  { key: "hallSeatAmout37", value: "放映厅座位数" },
  { key: "lowestPrice38", value: "最低发行价" },
  { key: "planStartTime81", value: "放映有效期" },
  { key: "filmPlanWeekRange83", value: "放映星期范围" },
  { key: "filmPlanInvalidTime82", value: "放映排除日期" },
  { key: "filmPlanTimeRange84", value: "放映时段范围" }
];
const goodsOptions = [
  { key: "brandId40", value: "品牌" },
  { key: "classCode41", value: "类别" },
  { key: "merKey46", value: "商品名称" },
  { key: "merCode42", value: "店内码" },
  { key: "merBarCode43", value: "国际条码" }
];

//执行方法

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
const tradeActions = [
  {
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
const movieTicketsActions = [
  {
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
  {
    key: "updateTicketPriceBySeatGrade",
    value: "按座位等级修改票价",
    hasSon: true,
    sonData: [
      { key: "modifyWay29", value: "调价方式" },
      { key: "modifyValue29", value: "调整额" },
      { key: "addAmountAfterDiscount29", value: "折扣后加减N元" },
      { key: "integralAmount29", value: "积分定价(分)" },
      { key: "integralMoney29", value: "加金额(元)" },
      { key: "decimalRoundMode29", value: "折后取整方式" },
      { key: "lessProcessMethod29", value: "低于最低价时" },
      { key: "cinemaPayAmount29", value: "影院补贴N元" },
      { key: "modifyAmountMethod29", value: "调价商品数量" },
      { key: "modifyAmount29", value: "数量" },
      { key: "seatGrade29", value: "座位等级" }
    ]
  }
  // "修改单票售价",
  // "按座位等级修改票价"
];

const tradingMerchantoptions = [
  { value: "", label: "全选" },
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
];
const weekOptions = [
  {
    label: "周一",
    value: "1"
  },
  {
    label: "周二",
    value: "2"
  },
  {
    label: "周三",
    value: "3"
  },
  {
    label: "周四",
    value: "4"
  },
  {
    label: "周五",
    value: "5"
  },
  {
    label: "周六",
    value: "6"
  },
  {
    label: "周日",
    value: "7"
  }
];

export default {
  
  data() {
    return {
      testName: "",
      // 折叠区域
      activeNames: ["1", "2", "3"],

      //步骤条数据
      stepData: {
        stepEl: ".el-collapse-item",
        stepList: [
          {
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
      basicDataRule: {
        activityName: [
          { required: true, message: "分组活动名称不能为空", trigger: "blur" }
        ]
      },
      // 子活动适用条件
      memberOptions: memberOptions,
      tradeOptions: tradeOptions,
      movieTicketsOptions: movieTicketsOptions,
      goodsOptions: goodsOptions,
      checkedMemberOption: [],
      checkedTradeOption: [],
      checkedTicketsOption: [],
      checkedGoodsOption: [],
      selectedOptions: [],

      // 子活动执行条件
      memberActions: memberActions,
      tradeActions: tradeActions,
      movieTicketsActions: movieTicketsActions,
      checkedMemberAction: [],
      checkedTradeAction: [],
      checkedTicketsAction: [],
      selectedActions: [],

      seatLevelNum: 9,
      checkedWeekOptions: [],
      weekOptions: weekOptions,
      tradingMerchantoptions: tradingMerchantoptions,

      activityId: "",
      isEdit: "add",
      index: "", //记录下标值
      disabled: false,

      checkedCities: [],
      activeName: "first",
      activeName1: "first1",

      // priority1:'',
      // 活动基本信息
      basicDataForm: {
        activityName: "",

        //会员类 - 生日
        birthday7: {
          opUniqueName: "",
          value: ""
        },

        //年龄
        ageRange: [{ minAge: "", maxAge: "" }],
        age9: {
          opUniqueName: "",
          value: "",
          valueRange: ""
        },
        // 性别
        sex8: {
          opUniqueName: "",
          value: ""
        },
        sexState: [],
        sexStateName: [],

        //会员等级
        cardTypeKey10: {
          opUniqueName: "AllMember",
          value: "",
          text: ""
        },

        //开卡年限
        openYears11: {
          opUniqueName: "",
          value: "",
          valueRange: ""
        },
        openCardYearsRange: [{ minYear: "", maxYear: "" }],

        //开卡月限
        openMonths87: {
          opUniqueName: "",
          value: "",
          valueRange: ""
        },
        openMonthsRange: [{ minMonth: "", maxMonth: "" }],

        //开卡日期
        openDate12: {
          opUniqueName: "",
          value: "",
          valueRange: ""
        },
        openCardDateOptions: [{ openDateCardOption: "" }],

        //账户余额
        balance3: {
          opUniqueName: "",
          value: ""
        },
        // 积分余额
        integral4: {
          opUniqueName: "",
          value: ""
        },
        // 累计积分
        integralTotall52: {
          opUniqueName: "",
          value: ""
        },
        // 注册商户
        registerBusinessCode13: {
          opUniqueName: "",
          value: "",
          text: ""
        },
        // 单次消费金额
        consumeWayCode2: {
          opUniqueName: "",
          value: ""
        },
        // 累计消费金额
        consumeSum6: {
          opUniqueName: "",
          value: ""
        },

        //影票类 - 放映效果
        showEffect35: {
          opUniqueName: "",
          value: "",
          text: ""
        },
        // 影厅类型
        hallTypeKey36: {
          opUniqueName: "",
          value: "",
          text: ""
        },
        // 影片
        uniformCode79: {
          opUniqueName: "",
          value: "",
          text: ""
        },
        // 影片类型
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

        // 放映星期范围
        filmPlanWeekRange83: {
          opUniqueName: "",
          value: ""
        },
        weekRangeState: [],
        weekRangeStateName: [],

        //放映时段范围
        filmPlanTimeRange84: {
          opUniqueName: "",
          value: "",
          valueRange: ""
        },
        screeningPeriodOptions: [{ screeningPeriodOption: "" }],

        //放映排除日期
        filmPlanInvalidTime82: {
          opUniqueName: "",
          opUniqueName2: "",
          value: "",
          valueRange: ""
        },
        excludeDate: [],
        excludeDateOptions: [{ excludeDateOption: "" }], //指定排除日期

        // 最低发行价
        lowestPrice38: {
          opUniqueName: "",
          value: ""
        },

        // 座位等级
        seatGrade89: {
          opUniqueName: "normalIn",
          value: ""
        },
        seatLevelState: [],
        seatLevelStateName: [],

        //放映厅座位数
        hallSeatAmout37: {
          opUniqueName: "",
          value: ""
        },

        /* 卖品类 */
        // 品牌
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
        // 店内码
        merCode42: {
          opUniqueName: "",
          value: ""
        },
        // 国际条码
        merBarCode43: {
          opUniqueName: "",
          value: ""
        },

        /*交易类*/

        // 交易影院
        cinemaCode19: {
          opUniqueName: "",
          value: "",
          text: ""
        },
        // 交易影院行政区域
        cinemaAreaId25: {
          opUniqueName: "",
          value: "",
          text: ""
        },
        // 交易商户
        businessCode14: {
          opUniqueName: "",
          value: "",
          text: ""
        },
        // 交易渠道
        consumeWayCode32: {
          opUniqueName: "",
          value: ""
        },
        tradeChannelState: [],
        tradeChannelStateName: [],

        // 交易类型
        tradeType33: {
          opUniqueName: "",
          value: ""
        },
        tradeTypeState: [],
        tradeTypeStateName: [],
        // 消费者身份
        consumerTypeKey27: {
          opUniqueName: "",
          value: "",
          text: ""
        },
        // 商品单价
        price31: {
          opUniqueName: "",
          value: ""
        },
        // 影票单价
        filmPrice92: {
          opUniqueName: "",
          value: ""
        },
        // 卖品单价
        merPrice93: {
          opUniqueName: "",
          value: ""
        },
        // 影票商品数量
        filmTicketAmount80: {
          opUniqueName: "",
          value: ""
        },
        // 影票总金额
        filmSumPrice90: {
          opUniqueName: "",
          value: ""
        },
        // 卖品总金额
        merSumPrice91: {
          opUniqueName: "",
          value: ""
        },

        //整单交易金额
        sumPrice26: {
          opUniqueName: "",
          value: ""
        },

        // 指定商品购买数量
        buyNum: {
          merKey21: {
            opUniqueName: "",
            value: "",
            text: ""
          },
          amount21: {
            opUniqueName: "",
            value: ""
          }
        },

        // 同类商品累计购买数量
        buyNumByType: {
          classCode28: {
            opUniqueName: "",
            value: "",
            text: ""
          },
          sumAmount28: {
            opUniqueName: "",
            value: ""
          }
        },

        // 同品牌商品累计购买数量
        buyNumByBrand: {
          brandId29: {
            opUniqueName: "",
            value: "",
            text: ""
          },
          sumAmount29: {
            opUniqueName: "",
            value: ""
          }
        },

        // 支付方式
        payTypeCode86: {
          opUniqueName: "",
          value: "",
          text: ""
        },
        // 放映前N天
        filmStartDayBefore94: {
          opUniqueName: "",
          value: ""
        },
        // 放映前N小时
        filmStartHourBefore95: {
          opUniqueName: "",
          value: ""
        },

        // 首次购票
        firstBuyTicket96: {
          opUniqueName: "normalEqual",
          value: ""
        },

        /***执行方法 */

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
          couponApplyCode3: {
            value: "",
            text: ""
          },
          amount3: {
            value: ""
          },
          isSendSms3: {
            value: ""
          }
        },

        /**按座位等级调整票价 */
        updateTicketPriceBySeatGrade: {
          modifyWay29: {
            value: ""
          },
          modifyValue29: {
            value: ""
          },
          addAmountAfterDiscount29: {
            value: ""
          },
          integralAmount29: {
            value: ""
          },
          integralMoney29: {
            value: ""
          },
          decimalRoundMode29: {
            value: "ROUND_UNNECESSARY"
          },
          lessProcessMethod29: {
            value: "notAllowSale"
          },
          cinemaPayAmount29: {
            value: ""
          },
          modifyAmountMethod29: {
            value: ""
          },
          modifyAmount29: {
            value: ""
          },
          seatGrade29: {
            value: ""
          }
        },
        action_seatLevel: [],
        action_seatLevelName: [],

        /** 修改单票售价 */
        updateTicketPrice: {
          modifyWay15: {
            value: ""
          },
          modifyValue15: {
            value: ""
          },
          addAmountAfterDiscount15: {
            value: ""
          },
          integralAmount15: {
            value: ""
          },
          integralMoney15: {
            value: ""
          },
          decimalRoundMode15: {
            value: "ROUND_UNNECESSARY"
          },
          lessProcessMethod15: {
            value: "notAllowSale"
          },
          cinemaPayAmount15: {
            value: ""
          },
          modifyAmountMethod15: {
            value: ""
          },
          modifyAmount15: {
            value: ""
          }
        },

        /** 单品优惠价调整 */
        judgeDiscountPrice: {
          merKey9: {
            value: "",
            text: ""
          },
          modifyWay9: {
            value: ""
          },
          modifyValue9: {
            value: ""
          },
          addAmountAfterDiscount9: {
            value: ""
          },
          integralAmount9: {
            value: ""
          },
          integralMoney9: {
            value: ""
          },
          decimalRoundMode9: {
            value: "ROUND_UNNECESSARY"
          },
          modifyAmountMethod9: {
            value: ""
          },
          modifyAmount9: {
            value: ""
          }
        },

        /** 以优惠价格增加单品 */
        addGoodsWithDiscountPrice: {
          merKey10: {
            value: "",
            text: ""
          },
          price10: {
            value: ""
          },
          amount10: {
            value: ""
          }
        },
        /*赠送商品 */
        giftGoods:{
          merKey11: {
            value: "",
            text: ""
          },
          price11: {
            value: 0
          },
          amount11: {
            value: ""
          }
        },
        /*卖品分类优惠价调整 */
        judgeDiscountPriceByType: {
          merCategoryMethod27: {
            value: "appointCategory"
          },
          classCode27: {
            value: "",
            text: ""
          },
          modifyWay27: {
            value: ""
          },
          modifyValue27: {
            value: ""
          },
          addAmountAfterDiscount27: {
            value: ""
          },
          decimalRoundMode27: {
            value: "ROUND_UNNECESSARY"
          },
          modifyAmountMethod27: {
            value: ""
          },
          modifyAmount27: {
            value: ""
          }
        },
        /*按品牌优惠价调整 */
        judgeDiscountPriceByBrand: {
          merBrandMethod28: {
            value: ""
          },
          brandId28: {
            value: "",
            text: ""
          },
          modifyWay28: {
            value: ""
          },
          modifyValue28: {
            value: ""
          },
          addAmountAfterDiscount28: {
            value: ""
          },
          decimalRoundMode28: {
            value: "ROUND_UNNECESSARY"
          },
          modifyAmountMethod28: {
            value: ""
          },
          modifyAmount28: {
            value: ""
          }
        }
      }
    };
  },
  mixins: [fixStepMixin],
  components: {
    fixStepTool: FixStepTool
  },
  created() {
  },
  methods: {
    
    init(rule, index) {
      this.index = index;
      if (rule) {
        this.isEdit = "update";
      }
      if (this.isEdit == "update") {
        this.basicDataForm = rule.formData;
        this.selectedOptions = rule.conditions;
        this.selectedActions = rule.actions;
        if (rule.formData["seatGrade89"]) {
          //座位等级
          this.basicDataForm.seatLevelState = rule.formData[
            "seatGrade89"
          ].value.split(",");
        }
        if (rule.formData["planStartTime81"]) {
          //放映有效期
          this.basicDataForm.screeningValidityOption =
            rule.formData["planStartTime81"].valueRange;
        }

        for (let option of this.selectedOptions) {
          for (let item of this.memberOptions) {
            if (option.key == item.key) {
              this.checkedMemberOption.push(item); //此处必须push(item)，不能是option,因为option===item 是false
            }
          }
        }
        for (let option of this.selectedOptions) {
          for (let item of this.movieTicketsOptions) {
            if (option.key == item.key) {
              this.checkedTicketsOption.push(item);
            }
          }
        }
        for (let option of this.selectedOptions) {
          for (let item of this.goodsOptions) {
            if (option.key == item.key) {
              this.checkedGoodsOption.push(item);
            }
          }
        }
        for (let option of this.selectedOptions) {
          for (let item of this.tradeOptions) {
            if (option.key == item.key) {
              this.checkedTradeOption.push(item);
            }
          }
        }
        for (let option of this.selectedActions) {
          for (let item of this.memberActions) {
            if (option.key == item.key) {
              this.checkedMemberAction.push(item);
            }
          }
        }
        for (let option of this.selectedActions) {
          for (let item of this.movieTicketsActions) {
            if (option.key == item.key) {
              this.checkedMemberAction.push(item);
            }
          }
        }
        for (let option of this.selectedActions) {
          for (let item of this.tradeActions) {
            if (option.key == item.key) {
              this.checkedTradeAction.push(item);
            }
          }
        }
      }
    },

    /* 选中某活动条件 */
    handleCheckedOption() {
      this.selectedOptions = this.checkedMemberOption
        .concat(this.checkedTicketsOption)
        .concat(this.checkedGoodsOption)
        .concat(this.checkedTradeOption);
    },

    /* 选中某执行方法 */
    handleCheckedAction() {
      this.selectedActions = this.checkedMemberAction
        .concat(this.checkedTicketsAction)
        .concat(this.checkedTradeAction);
    },

    /* 改变生日 */
    handleChangeBirthday(val) {
      if (val != "EqualCurrentMonthOffset") {
        this.basicDataForm.birthday7.value = "";
      }
    },

    /* 改变年龄 */
    handleChangeAge(val) {
      if (val == "BetweenOperator" || val == "not_BetweenOperator") {
        this.basicDataForm.age9.value = "";
      } else {
        this.basicDataForm.age9.valueRange = "";
      }
    },

    /* 添加年龄范围 */
    addAgeRange() {
      this.basicDataForm.ageRange.push({
        minAge: "",
        maxAge: ""
      });
      if (this.basicDataForm.ageRange.length > 0) {
        let arr = [];
        this.basicDataForm.ageRange.forEach(item => {
          if (item.minAge && item.maxAge) {
            arr.push([item.minAge, item.maxAge]);
          }
        });
        this.basicDataForm.age9.valueRange = JSON.stringify(arr);
      }
      console.log(
        "valueRange" + JSON.stringify(this.basicDataForm.age9.valueRange)
      );
    },

    /* 移除年龄范围 */
    delAgeRange(index) {
      this.basicDataForm.ageRange.splice(index, 1);
      if (this.basicDataForm.ageRange.length > 0) {
        let arr = [];
        this.basicDataForm.ageRange.forEach(item => {
          if (item.minAge && item.maxAge) {
            arr.push([item.minAge, item.maxAge]);
          }
        });
        this.basicDataForm.age9.valueRange = JSON.stringify(arr);
      }
    },

    /* 选择性别 */
    handleChangeSex(data) {
      if (data.indexOf("") != -1) {
        data = ["0", "1"];
      }
      this.basicDataForm.sexState = data;
      this.basicDataForm.sex8.value = this.basicDataForm.sexState.join(",");
    },

    /* 添加开卡日期 */
    addOpenCardDate() {
      this.basicDataForm.openCardDateOptions.push({
        openCardDateOption: ""
      });

      if (this.basicDataForm.openCardDateOptions.length > 0) {
        let arr = [];
        this.basicDataForm.openCardDateOptions.forEach(item => {
          if (item.openCardDateOption) {
            arr.push(item.openCardDateOption);
          }
        });
        this.basicDataForm.openDate12.valueRange = JSON.stringify(arr);
      }
      console.log(
        "valueRange" + JSON.stringify(this.basicDataForm.openDate12.valueRange)
      );
    },
    /* 删除开卡日期 */
    delOpenCardDate(index) {
      this.basicDataForm.openCardDateOptions.splice(index, 1);
    },

    /* 设置放映有效期 */
    setScreeningValidity(val) {
      this.basicDataForm.planStartTime81.valueRange = JSON.stringify(val);
    },
    /* 修改放映有效期 */
    handleScreeningValidityChange(value) {
      if (value == "TimeBetweenOperator") {
        this.basicDataForm.planStartTime81.value = "";
      } else if (
        this.basicDataForm.planStartTime81 == "DayContainOperator" ||
        this.basicDataForm.planStartTime81 == "not_DayContainOperator"
      ) {
        this.basicDataForm.screeningValidityOption = [];
      } else {
        this.basicDataForm.planStartTime81.value = "";
        this.basicDataForm.screeningValidityOption = [];
      }
    },

    /* 修改放映排除日期 */
    handleChangeExcludeDate(val) {
      if (val.indexOf("节假日除外") != -1) {
        this.basicDataForm.filmPlanInvalidTime82.opUniqueName =
          "not_RelateDateHolidayOperator";
      } else {
        this.basicDataForm.filmPlanInvalidTime82.opUniqueName = "";
      }
      if (val.indexOf("指定排除日期范围") != -1) {
        this.basicDataForm.filmPlanInvalidTime82.opUniqueName2 =
          "not_DateRangeContainOperator";
      } else {
        this.basicDataForm.filmPlanInvalidTime82.opUniqueName2 = "";
      }
    },
    /* 设置放映排除日期 */
    setExcludeDate() {
      this.setFilmPlanInvalidTimeRange();
    },

    /* 添加放映排除日期 */
    addExcludeDate() {
      this.basicDataForm.excludeDateOptions.push({
        excludeDateOption: ""
      });
      this.setFilmPlanInvalidTimeRange();
    },

    /* 删除放映排除日期 */
    delExcludeDate(index) {
      this.basicDataForm.excludeDateOptions.splice(index, 1);
      this.setFilmPlanInvalidTimeRange();
    },

    setFilmPlanInvalidTimeRange() {
      if (this.basicDataForm.excludeDateOptions.length > 0) {
        let arr = [];
        this.basicDataForm.excludeDateOptions.forEach(item => {
          if (item.excludeDateOption) {
            arr.push(item.excludeDateOption);
          }
        });
        this.basicDataForm.filmPlanInvalidTime82.valueRange = JSON.stringify(
          arr
        );
      }
    },

    /*添加放映时段范围 */
    addScreeningPeriod() {
      this.basicDataForm.screeningPeriodOptions.push({
        screeningPeriodOption: ""
      });

      if (this.basicDataForm.screeningPeriodOptions.length > 0) {
        let arr = [];
        this.basicDataForm.screeningPeriodOptions.forEach(item => {
          if (item.screeningPeriodOption) {
            arr.push(item.screeningPeriodOption);
          }
        });
        this.basicDataForm.filmPlanTimeRange84.valueRange = JSON.stringify(arr);
      }
      console.log(
        "valueRange" +
          JSON.stringify(this.basicDataForm.filmPlanTimeRange84.valueRange)
      );
    },

    /*删除放映时段范围 */
    delScreeningPeriod(index) {
      this.basicDataForm.screeningPeriodOptions.splice(index, 1);

      if (this.basicDataForm.screeningPeriodOptions.length > 0) {
        let arr = [];
        this.basicDataForm.screeningPeriodOptions.forEach(item => {
          if (item.screeningPeriodOption) {
            arr.push(item.screeningPeriodOption);
          }
        });
        this.basicDataForm.filmPlanTimeRange84.valueRange = JSON.stringify(arr);
      }
      console.log(
        "valueRange" +
          JSON.stringify(this.basicDataForm.filmPlanTimeRange84.valueRange)
      );
    },

    /* 选择座位级别 */
    handleChangeSeatLevel(data) {
      if (data.indexOf("") != -1) {
        data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      }
      this.basicDataForm.seatLevelState = data;
      this.basicDataForm.seatGrade89.value = this.basicDataForm.seatLevelState.join(
        ","
      );
    },

    /* 选择放映星期范围 */
    handleChangeweekRange(data) {
      if (data.indexOf("") != -1) {
        data = ["1", "2", "3", "4", "5", "6", "7"];
      }
      this.basicDataForm.weekRangeState = data;
      this.basicDataForm.filmPlanWeekRange83.value = this.basicDataForm.weekRangeState.join(
        ","
      );
    },

    /* 添加开卡年限范围 */
    addOpenCardYearsRange() {
      this.basicDataForm.openCardYearsRange.push({
        minYear: "",
        maxYear: ""
      });
      if (this.basicDataForm.openCardYearsRange.length > 0) {
        let arr = [];
        this.basicDataForm.openCardYearsRange.forEach(item => {
          if (item.minYear && item.maxYear) {
            arr.push([item.minYear, item.maxYear]);
          }
        });
        this.basicDataForm.openYears11.valueRange = JSON.stringify(arr);
      }
      console.log(
        "valueRange " +
          JSON.stringify(this.basicDataForm.openYears11.valueRange)
      );
    },

    /* 删除开卡年限范围 */
    delOpenCardYearsRange(index) {
      this.basicDataForm.openCardYearsRange.splice(index, 1);
      if (this.basicDataForm.openCardYearsRange.length > 0) {
        let arr = [];
        this.basicDataForm.openCardYearsRange.forEach(item => {
          if (item.minYear && item.maxYear) {
            arr.push([item.minYear, item.maxYear]);
          }
        });
        this.basicDataForm.openYears11.valueRange = JSON.stringify(arr);
      }
    },

    /* 添加开卡月限范围 */
    addOpenMonthsRange() {
      this.basicDataForm.openMonthsRange.push({
        minMonth: "",
        maxMonth: ""
      });

      if (this.basicDataForm.openMonthsRange.length > 0) {
        let arr = [];
        this.basicDataForm.openMonthsRange.forEach(item => {
          if (item.minMonth && item.maxMonth) {
            arr.push([item.minMonth, item.maxMonth]);
          }
        });
        this.basicDataForm.openMonths87.valueRange = JSON.stringify(arr);
      }
      console.log(
        "valueRange " +
          JSON.stringify(this.basicDataForm.openMonths87.valueRange)
      );
    },
    /* 删除开卡月限范围 */
    delOpenMonthsRange(index) {
      this.basicDataForm.openMonthsRange.splice(index, 1);

      if (this.basicDataForm.openMonthsRange.length > 0) {
        let arr = [];
        this.basicDataForm.openMonthsRange.forEach(item => {
          if (item.minMonth && item.maxMonth) {
            arr.push([item.minMonth, item.maxMonth]);
          }
        });
        this.basicDataForm.openMonths87.valueRange = JSON.stringify(arr);
      }
      console.log(
        "valueRange " +
          JSON.stringify(this.basicDataForm.openMonths87.valueRange)
      );
    },
    /* 选择交易渠道 */
    handleChangeTradeChannel(data) {
      if (data.indexOf("") != -1) {
        data = ["1", "2", "3", "4", "5", "6"];
      }
      this.basicDataForm.tradeChannelState = data;
      this.basicDataForm.consumeWayCode32.value = this.basicDataForm.tradeChannelState.join(
        ","
      );
    },

    /* 选择交易类型 */
    handleChangeTradeType(data) {
      if (data.indexOf("") != -1) {
        data = ["BUY", "MEMBER_ADD_AMOUNT", "REJECT"];
      }
      this.basicDataForm.tradeTypeState = data;
      this.basicDataForm.tradeType33.value = this.basicDataForm.tradeTypeState.join(
        ","
      );
    },

    /* 执行方法- 选择座位级别 */
    handleChangeAction_SeatLevel(data) {
      if (data.indexOf("") != -1) {
        data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      }
      this.basicDataForm.action_seatLevel = data;
      this.basicDataForm.updateTicketPriceBySeatGrade.seatGrade29.value = this.basicDataForm.action_seatLevel.join(
        ","
      );
    },

    /* 选择会员等级 */
    selectMembershipLevel(data) {
      this.basicDataForm.cardTypeKey10.text = data.text;
    },
    /* 选择注册商户 */
    selectRegMerchant(data) {
      this.basicDataForm.registerBusinessCode13.text = data.text;
    },

    /* 选择放映有效期 */
    selectEffectOfScreening(data) {
      this.basicDataForm.showEffect35.text = data.text;
    },
    /* 选择影厅类型 */
    selectMovieHall(data) {
      this.basicDataForm.hallTypeKey36.text = data.text;
    },
    /* 选择影片 */
    selectFilm(data) {
      this.basicDataForm.uniformCode79.text = data.text;
    },
    /* 选择影片类型 */
    selectFilmType(data) {
      this.basicDataForm.filmTypeKey34.text = data.text;
    },
    /* 选择品牌 */
    selectBrand(data) {
      this.basicDataForm.brandId40.text = data.text;
    },
    /* 选择类别 */
    selectType(data) {
      this.basicDataForm.classCode41.text = data.text;
    },
    /* 选择商品名称 */
    selectGoodsName(data) {
      this.basicDataForm.merKey46.text = data.text;
    },
    /* 选择交易影院 */
    selectTradeCinema(data) {
      this.basicDataForm.cinemaCode19.text = data.text;
    },
    /* 选择交易影院行政区域 */
    selectTradeCinemaArea(data) {
      this.basicDataForm.cinemaAreaId25.text = data.text;
    },
    /* 选择交易商户 */
    selectTradeMerchant(data) {
      this.basicDataForm.businessCode14.text = data.text;
    },
    /* 选择消费者身份 */
    selectConsumerIdentity(data) {
      this.basicDataForm.consumerTypeKey27.text = data.text;
    },
    /* 选择支付方式 */
    selectPayType(data) {
      this.basicDataForm.payTypeCode86.text = data.text;
    },
    /*指定商品购买数量 - 选择商品名称 */
    selectGoodsName21(data) {
      this.basicDataForm.buynum.merKey21.text = data.text;
    },
    /*同类商品累计购买数量 - 选择商品类别 */
    selectClassCode28(data) {
      this.basicDataForm.buyNumByType.classCode28.text = data.text;
    },
    /*同品牌商品累计购买数量 - 选择商品品牌 */
    selectBrandId29(data) {
      this.basicDataForm.buyNumByBrand.brandId29.text = data.text;
    },
    /*赠送票券 - 选择票券名称 */
    selectTicketName3(data) {
      this.basicDataForm.giftTicket.couponApplyCode3.text = data.text;
    },
    /**赠送商品 - 选择商品 */
    selectGoods(data) {
      this.basicDataForm.giftGoods.merKey11.text = data.text;
    },
    /**单品优惠价调整 - 选择商品 */
    selectGoods9(data) {
      this.basicDataForm.judgeDiscountPrice.merKey9.text = data.text;
    },
    /**以优惠价格增加商品 - 选择商品 */
    selectGoods10(data) {
      this.basicDataForm.addGoodsWithDiscountPrice.merKey10.text = data.text;
    },
    /** 卖品分类优惠价调整  - 选择商品分类 */
    selectGoodsType(data) {
      this.basicDataForm.judgeDiscountPriceByType.classCode27.text = data.text;
    },
    /*按品牌优惠价调整 - 选择商品品牌 */
    selectBrandId28(data) {
      this.basicDataForm.judgeDiscountPriceByBrand.brandId28.text = data.text;
    },
    returnList() {
      this.$emit("close");
    },

    // 表单提交
    dataFormSubmit() {
      this.$refs["basicDataForm"].validate(valid => {
        if (valid) {
          this.$emit("transferData", {
            index: this.index,
            name: this.basicDataForm.activityName,
            formData: this.basicDataForm,
            conditions: this.selectedOptions,
            actions: this.selectedActions
          });
        }
      });
    }
  }
};
</script>

<style lang="scss">
.add-group-default {
  .breadcrumb {
    margin: 30px 0 50px 30px;
  }
  .el-input {
    width: 80%;
  }
  .el-input {
    &.el-input--suffix {
      width: 80%;
    }
  }
  .el-range-input {
    width: 30%;
  }
  .el-form-item {
    margin: 0 0 10px 0;
    .el-form-item__label {
      width: 60px;
      word-break: break-all;
      margin-bottom: 0;
      height: 30px;
      line-height: 14px;
      text-align: left;
      padding-top: 5px;
    }
  }

  .el-collapse {
    width: 80%;
    border-bottom: 0 none;
    border-top: 0 none;
    margin-bottom: 50px;
    .el-collapse-item__header {
      padding-left: 30px;
      position: relative;
      font-size: 14px;
      font-family: MicrosoftYaHei;
      color: #333;
      font-weight: 600;
      &.is-active {
        border-bottom: 1px solid #ebeef5;
      }
      .el-collapse-item__arrow {
        position: absolute;
        left: 135px;
        top: 18px;
      }
    }
    .el-collapse-item__wrap {
      border: 0 none;
    }
    .el-collapse-item__content {
      padding-left: 50px;
      padding-top: 20px;
      .el-date-editor {
        margin-top: 3px;
        &.el-input__inner {
          padding: 0 5px;
        }
      }
    }
    .box-card {
      // display: flex;
      .box-content {
        display: flex;
        width: 100%;
        height: auto;
        background: #fff;
        border: 1px solid #dcdfe6;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12),
          0 0 6px 0 rgba(0, 0, 0, 0.04);
        .box-tabs {
          width: 50%;
          border: 0;
        }
        .box-cond {
          width: 80%;
          min-width: 600px;
          padding: 15px;
        }
      }
    }

    .el-checkbox-group {
      display: flex;
      flex-direction: column;
      min-width: 100px;
      .el-checkbox {
        margin: 0;
        padding: 0 30px 10px 0;
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
  .el-tabs {
    .el-tabs__item {
      padding: 0 10px;
    }
    .el-tabs__content {
      padding: 15px 0 0 0;
      overflow: inherit;
      border-top: none;
      border-bottom: none;
    }
  }
  .el-badge__content.is-fixed {
    position: absolute;
    top: 8px;
    right: 10px;
    transform: translateY(-50%) translateX(100%);
  }

  .addDate {
    color: #3b74ff;
    cursor: pointer;
    width: 20%;
    .el-icon-circle-plus-outline {
      margin-right: 3px;
    }
  }
  .priority1 {
    .el-form-item__error {
      margin-left: 130px;
      margin-top: -18px;
    }
  }
  .actionLabel {
    font-weight: bold;
    margin-bottom: 10px;
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
</style>
