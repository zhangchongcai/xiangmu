<template>
  <div class="add-edit-card-type">
    <!-- 面包屑 -->
    <div class="crumbs-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>会员</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡</el-breadcrumb-item>
        <el-breadcrumb-item>
          <router-link class="itemLink" :to="{path : '/cardTypeManagement/list'}">会员卡政策管理</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{this.$route.query.cardId?'修改卡政策':'新建卡政策'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 内容区 - 折叠面板 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="medium" label-width="120px" label-position="right"
      class="demo-ruleForm">
      <el-collapse v-model="activeNames" class="card-type-content">
        <!-- 基础设置 -->
        <el-collapse-item title="基础设置" name="1">
          <div class="card-type-basic-set">
            <el-form-item label="卡政策名称：" prop="cardName">
              <el-input v-model="ruleForm.cardName"></el-input>
            </el-form-item>
            <el-form-item label="卡类型：" prop="cardTypeCode">
              <el-radio-group v-model="ruleForm.cardTypeCode" :disabled="$route.query.cardId?true:false" @change="handleChangeCardType('ruleForm')">
                <el-radio label="stored_card">储值卡</el-radio>
                <el-radio label="equity_card">权益卡</el-radio>
                <el-radio label="cobranded_card">联名卡</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="卡样式：" prop="cardStyle" v-if="ruleForm.cardTypeCode != 'cobranded_card'">
              <el-radio-group v-model="cardStyle" class="card-style-wrap" @change="handleChangeCardStyle">
                <div class="card-style-item">
                  <div class="card-face enjoy-gold">
                  </div>
                  <el-radio label="enjoy_gold">尊享黄金</el-radio>
                </div>
                <div class="card-style-item">
                  <div class="card-face fresh-tea-making"></div>
                  <el-radio label="fresh_tea_making">清新抹茶</el-radio>
                </div>
                <div class="card-style-item">
                  <div class="card-face elegant-blue-violet"></div>
                  <el-radio label="elegant_blue_violet">优雅蓝紫</el-radio>
                </div>
                <div class="custom_card-item">
                  <el-radio label="custom_card">自定义卡片</el-radio>
                  <template v-if="ruleForm.custom">
                    <img v-if="ruleForm.picPath" :src="ruleForm.picPath" alt="custom_card" class="custom-card">
                    <el-upload :action="this.$store.state.crm.imgAction" list-type="picture-card" :show-file-list="false"
                      accept="image/png" :before-upload="beforeAvatarUpload" :on-success="imgUploaded" :multiple="false"
                      name="file" :data="{type:'product_picture'}">
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <div class="upload-tip">（535×318，背景透明 png24，200K以内）</div>
                  </template>
                </div>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-collapse-item>
        <!-- 开卡/充值设置 -->
        <el-collapse-item title="开卡/充值设置" name="2">
          <div class="open-card-recharge-set">
            <el-form-item label="开卡必填：" prop="mustFill">
              <el-checkbox-group v-model="ruleForm.mustFill">
                <el-checkbox label="user_name">姓名</el-checkbox>
                <el-checkbox label="sex">性别</el-checkbox>
                <el-checkbox label="birthday">生日</el-checkbox>
                <el-checkbox label="phone_number" disabled>手机号</el-checkbox>
                <el-checkbox label="id_card">身份证号</el-checkbox>
                <el-checkbox label="email">邮箱</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <!-- 储值卡 start -->
            <template v-if="ruleForm.cardTypeCode == 'stored_card'">
              <el-form-item label="简单密码：" prop="weakPassword">
                <el-select v-model="ruleForm.weakPassword" placeholder="请选择">
                  <el-option label="允许简单密码" :value="1"></el-option>
                  <el-option label="不允许简单密码" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="充值设置：" prop="canCharge">
                <el-select v-model="ruleForm.canCharge" placeholder="请选择">
                  <el-option label="允许充值" :value="1"></el-option>
                  <el-option label="不允许充值" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="首充最小金额：" prop="firstChargeMin">
                <el-input v-model="ruleForm.firstChargeMin"></el-input>
                <span class="unit">元</span>
              </el-form-item>
              <el-form-item label="单充最小金额：" prop="chargeMin">
                <el-input v-model="ruleForm.chargeMin"></el-input>
                <span class="unit">元</span>
              </el-form-item>
              <el-form-item label="单充最大金额：" prop="chargeMax">
                <el-input v-model="ruleForm.chargeMax"></el-input>
                <span class="unit">元</span>
              </el-form-item>
              <el-form-item label="开卡手续费：" prop="openPrice">
                <el-input v-model="ruleForm.openPrice"></el-input>
                <span class="unit">元</span>
              </el-form-item>
              <el-form-item label="补卡手续费：" prop="makeUpPrice">
                <el-input v-model="ruleForm.makeUpPrice"></el-input>
                <span class="unit">元</span>
              </el-form-item>
              <!-- <el-form-item label="换卡手续费：" prop="replacePrice">
                <el-input v-model="ruleForm.replacePrice"></el-input>
                <span class="unit">元</span>
              </el-form-item> -->
              <el-form-item label="注销手续费：" prop="backPrice">
                <el-input v-model="ruleForm.backPrice"></el-input>
                <span class="unit">元</span>
              </el-form-item>
              <el-checkbox v-model="ruleForm.annualFee" style="margin:10px 0" @change="handleInitYearRule">设置储值卡年费规则</el-checkbox>
              <div v-if="ruleForm.annualFee" class="checked-fee-wrap">
                <el-form-item label="卡年费：" prop="yearRule.price">
                  <el-input v-model="ruleForm.yearRule.price" style="width:335px"></el-input>
                  <span class="unit">元</span>
                </el-form-item>
                <el-form-item label="免年费机制：" prop="yearRule.freeAnnualFee" class="freeAnnual-fee">
                  <el-radio-group v-model="ruleForm.yearRule.freeAnnualFee" @change="handleChangeFreeAnnualFee">
                    <el-radio label="total_ticket" style="width:50px">累计购票</el-radio>
                    <el-input :value="ruleForm.yearRule.freeAnnualFee == 'total_ticket'?ruleForm.yearRule.freeAnnualNum:''"
                      @change="changeAnnualNum($event)" :disabled="ruleForm.yearRule.freeAnnualFee != 'total_ticket'"
                      placeholder="购票次数" style="width:105px;margin-right:5px;"></el-input>
                    <span class="unit">次</span>
                    <el-radio label="total_consume" style="width:50px;margin-left:20px;">累计消费</el-radio>
                    <el-input :value="ruleForm.yearRule.freeAnnualFee == 'total_consume'?ruleForm.yearRule.freeAnnualNum:''"
                      @change="changeAnnualNum($event)" :disabled="ruleForm.yearRule.freeAnnualFee != 'total_consume'"
                      placeholder="消费金额" style="width:105px;margin-right:5px;"></el-input>
                    <span class="unit">元</span>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="开卡首年是否免年费：" prop="yearRule.firstYearFee" class="first-year-free-fee">
                  <el-radio-group v-model="ruleForm.yearRule.firstYearFee">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="扣年费时间：" prop="yearRule.deductionsType" class="deductions-type">
                  <el-radio-group v-model="ruleForm.yearRule.deductionsType" @change="handleChangeDeductionsType">
                    <el-radio label="fixed_date" style="width:50px">固定日期</el-radio>
                    <span class="unit" style="margin-right:5px;">每年</span>
                    <el-date-picker :value="ruleForm.yearRule.deductionsType == 'fixed_date'?ruleForm.yearRule.deductionsTime:''"
                      format="MM-dd" value-format="MM-dd" type="date" @input="changeDate" :disabled="ruleForm.yearRule.deductionsType != 'fixed_date'"
                      placeholder="选择日期" style="width:115px;">
                    </el-date-picker>
                    <el-radio label="dynamic_time" style="width:50px;margin-left:20px;">动态日期</el-radio>
                    <el-input :value="ruleForm.yearRule.deductionsType == 'dynamic_time'?ruleForm.yearRule.deductionsTime:''"
                      @change="changeDate($event)" :disabled="ruleForm.yearRule.deductionsType != 'dynamic_time'"
                      placeholder="天数" style="width:115px;margin-right:5px;"></el-input>
                    <span class="unit">日</span><span style="color:#A3A3A3;font-size:12px;margin-left:10px;">开卡后，多少天</span>
                  </el-radio-group>
                </el-form-item>
              </div>

              <!-- <el-form-item label="最低发行价" prop="MinIssuePrice">
                <el-input v-model="ruleForm.MinIssuePrice"></el-input><span class="unit"> 元</span>
              </el-form-item>
              <el-form-item label="限制单用户开卡数" prop="limitNumber">
                <el-input v-model="ruleForm.limitNumber"></el-input><span class="unit"> 张</span>
              </el-form-item> -->
            </template>
            <!-- 储值卡 end -->
            <!-- ------------------------------------------------------------------------------------------ -->
            <!-- 权益卡 start -->
            <template v-if="ruleForm.cardTypeCode == 'equity_card'">
              <el-form-item label="权益卡售价：" prop="price">
                <el-input v-model="ruleForm.price"></el-input>
                <span class="unit">元</span>
              </el-form-item>
              <el-form-item label="免密支付：" prop="freeConsumption">
                <el-select v-model="ruleForm.freeConsumption" placeholder="请选择">
                  <el-option label="允许免密支付" :value="true"></el-option>
                  <el-option label="不允许免密支付" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <!-- 权益卡 end -->
            <!-- ------------------------------------------------------------------------------------------ -->
            <!-- 联名卡 start -->
            <template v-if="ruleForm.cardTypeCode == 'cobranded_card'">
              <el-form-item label="联名卡结算价：" prop="settlementPrice">
                <el-input v-model="ruleForm.settlementPrice"></el-input>
                <span class="unit">元</span>
              </el-form-item>
              <el-form-item label="联名卡标价：" prop="priceTag">
                <el-input v-model="ruleForm.priceTag"></el-input>
                <span class="unit">元</span>
              </el-form-item>
              <!-- <el-form-item label="延期设置" prop="canDelay">
                <el-select v-model="ruleForm.canDelay" placeholder="请选择">
                  <el-option label="允许延期" value="can_delay"></el-option>
                  <el-option label="不允许延期" value="no_delay"></el-option>
                </el-select>
              </el-form-item> -->
            </template>
            <!-- 联名卡 end -->
            <el-form-item v-if="ruleForm.cardTypeCode != 'stored_card'" label="延期设置：" prop="delayPrice">
              <el-select v-model="ruleForm.canDelay" placeholder="请选择">
                <el-option label="允许延期" value="can_delay"></el-option>
                <el-option label="不允许延期" value="no_delay"></el-option>
              </el-select>
              <div v-if="ruleForm.canDelay == 'can_delay'" style="position:relative">
                <el-form-item label="延期手续费：" style="position:absolute;left:-120px;" :rules="[{ required: true, message: ' ', trigger: 'blur' }]" />
                <el-input v-model="ruleForm.delayPrice" placeholder="请输入延期手续费"></el-input>
                <span class="unit">元</span>
              </div>
            </el-form-item>
            <el-form-item label="卡使用须知：" prop="remark" class="remark">
              <el-input type="textarea" resize="none" :rows="5" v-model="ruleForm.remark"></el-input>
            </el-form-item>
          </div>
        </el-collapse-item>
        <!-- 会员卡规则 -->
        <el-collapse-item title="会员卡规则" name="3">
          <div class="card-rule">
            <!-- 储值卡 和 权益卡 可售渠道 -->
            <el-form-item label="可售渠道：" prop="salableChannel" class="salable-channel" v-if="ruleForm.cardTypeCode != 'cobranded_card'">
              <div class="salable-channel-item-wrap">
                <el-checkbox label="影城前台" name="salableChannel" v-model="frontDesk"></el-checkbox>
                <div class="network-channel-wrap">
                  <el-checkbox label="网售渠道" name="salableChannel" v-model="networkSale" @change="handleCheckedNetworkSale"></el-checkbox>
                  <div v-if="networkSale?true:false" class="network-channel">
                    <el-checkbox :indeterminate="isIndeterminateChannel" v-model="checkAllChannels" @change="handleCheckAllChange">全选</el-checkbox>
                    <el-checkbox-group v-model="checkedChannels" @change="handleCheckedChannelsChange">
                      <el-checkbox v-for="(item,index) in channels" :label="item.desc+','+item.code" :key="index">{{item.desc}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </div>
            </el-form-item>
            <!-- 储值卡允许补现、积分规则 -->
            <template v-if="ruleForm.cardTypeCode == 'stored_card'">
              <el-form-item label="余额不足：" prop="withCash" class="balance-insufficient">
                <el-select v-model="ruleForm.withCash" placeholder="请选择">
                  <el-option label="允许补现" :value="1"></el-option>
                  <el-option label="不允许补现" :value="0"></el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="积分规则" prop="integralRule" style="color:#666">
                <span style="fontSize:12px;">为普通消费积分的</span>
                <el-input v-model="ruleForm.integralRule" placeholder="请填写数字"></el-input><span class="unit"> 倍</span>
              </el-form-item> -->
            </template>
            <!-- 联名卡选择商户 -->
            <template v-if="ruleForm.cardTypeCode == 'cobranded_card'">
              <el-form-item label="联名商户：" prop="merchantList" class="merchant-list">
                <div style="display:flex;">
                  <div class="select-btn" @click="handleClickSelectMerchant">选择商户</div>
                  <el-tag closable v-if="currentMerchantRow.merchantId" @close="handleClose(tag)" style="margin-left:15px;">{{currentMerchantRow.merchantName}}</el-tag>
                </div>
              </el-form-item>
            </template>
            <!-- 权益卡 和 联名卡 有效期 -->
            <template v-if="ruleForm.cardTypeCode != 'stored_card'">
              <el-form-item label="有效期：" prop="workTimeNum">
                <el-input v-model="ruleForm.workTimeNum" placeholder="请填写数字"></el-input>
                <el-select v-model="ruleForm.workTimeType" placeholder="请选择">
                  <el-option label="日" value="day"></el-option>
                  <el-option label="月" value="month"></el-option>
                  <el-option label="年" value="year"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </div>
        </el-collapse-item>
        <!-- 会员卡权益 -->
        <el-collapse-item title="会员卡权益" name="4">
          <div class="card-equity">
            <el-form-item label="权益：" prop="equityList">
              <div class="equity-item-wrap">
                <div class="equity-coupon-item" v-for="(item, index) of ruleForm.equityList" :key="index">
                  <i class="iconfont icon-neiye-danchuangquxiao" @click="handleDeleteEquity(index)"></i>
                  <img src="../../../assets/image/white-dot.png" class="white-dot">
                  <div class="coupon-item-type" :class="item.equityType == 'consumer_type'?'consumption-type-color':item.equityType == 'service_type'?'service-type-color':item.equityType == 'experience_type'?'experience-type-color':'identity-type-color'">
                    {{item.equityTypeName}}
                  </div>
                  <div class="coupon-item-name" :class="item.equityType == 'consumer_type'?'consumption-name-color':item.equityType == 'service_type'?'service-name-color':item.equityType == 'experience_type'?'experience-name-color':'identity-name-color'">
                    {{item.equityName}}
                  </div>
                  <span class="preview-btn" @click="handlePreviewEquity(item.id)">预览</span>
                </div>
              </div>
              <div class="select-btn" @click="handleAddEquityDialog">添加权益</div>
            </el-form-item>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-form-item style="textAlign:center">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="handleCancle('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
    <fixStepTool :stepData="stepData.stepList" class="_fixsteptool-member"></fixStepTool>
    <!-- 添加权益dialog -->
    <el-dialog title="自有权益" class="__equity-dialog" :visible.sync="equityDialog" width="892px">
      <div class="__table-wrap">
        <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap">
          <el-form-item label="权益名称：" prop="equityName">
            <el-input v-model="formData.equityName" placeholder="填写权益名称" clearable maxlength="30"></el-input>
          </el-form-item>
          <el-form-item label="权益类型：" prop="equityType">
            <el-select v-model="formData.equityType" placeholder="全部" clearable>
              <el-option v-for="item in equityTypeList" :key="item.name" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权益类别：" prop="equityCategory" class="heightBug">
            <el-select v-model="formData.equityCategory" placeholder="全部" clearable :disabled="formData.equityType != 'consumer_type'">
              <el-option v-for="item in equityCategoryList" :key="item.name" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="btn-wrap">
            <el-button type="primary" @click="handleSearch" class="el-btn-custom">搜索</el-button>
            <el-button @click="resetForm('formData')" class="el-btn-custom">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="member-list-table _m-member-table-custom">
          <el-table ref="multipleTable" :data="tableData" stripe style="width: 100%" @select="handleSelect" @select-all="handleSelect"
            :row-key="getRowKeys">
            <el-table-column type="selection" width="55" :reserve-selection="true">
            </el-table-column>
            <el-table-column prop="equityName" :formatter="emptyShow" label="权益名称" min-width="120"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="equityTypeName" :formatter="emptyShow" label="权益类型" min-width="120"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="equityCategoryName" :formatter="equityCategoryNameShow" label="权益类别" min-width="100"
              show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <!-- 分页 start -->
        <div class="page-wrap" style="padding:0">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage-0"
            :page-size="formData.size-0" layout="prev, pager, next, jumper, sizes" :page-sizes="[20 , 50 , 100]" :total="total-0"></el-pagination>
        </div>
        <!-- 分页 end -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="changeEquityDialog(true)">确 定</el-button>
        <el-button size="medium" @click="changeEquityDialog(false)">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 预览dialog -->
    <el-dialog title="权益预览" class="__equity-dialog" :visible.sync="previewDialog" width="892px">
      <OwnershipDetail :equityID="equityId" :isShow="false"></OwnershipDetail>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" size="medium" @click="previewDialog = false">确 定</el-button> -->
        <el-button size="medium" @click="previewDialog = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!--  权益相同时的dialog -->
    <el-dialog title="" class="__equity-dialog" :visible.sync="sameCategoryDialog">
      <div style="text-align:center;margin:40px 0;">
        {{`此政策内包含同为“${sameCategory}”权益类别的规则`}}<br /><br />
        请仔细检查，避免会员在<span style="font-size:22px;">同一场次可享受多种价格权益</span>的情况发生<br /><br />
        若出现此情况，则默认<span style="color:red;">享受最低折扣（全部优惠中的最高价格）</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="handleSureSameEquity">确 定</el-button>
        <el-button size="medium" @click="sameCategoryDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 选择商户的dialog -->
    <el-dialog title="联名商户" class="__equity-dialog" :visible.sync="merchantDialog" width="892px">
      <div class="__table-wrap">
        <el-form :inline="true" :model="searchData" ref="searchData" class="search-data-wrap">
          <el-form-item label="商户编号" prop="merchantNum" :rules="[{ max: 20, message: '长度不可超过20个字符', trigger: 'blur' }]">
            <el-input v-model="searchData.merchantNum" @blur="()=>{searchData.merchantNum = searchData.merchantNum.trim()}"
              placeholder="请输入商户编号" clearable></el-input>
          </el-form-item>
          <el-form-item label="商户名称" prop="merchantName" :rules="[{ max: 30, message: '长度不可超过30个字符', trigger: 'blur' }]">
            <el-input v-model="searchData.merchantName" @blur="()=>{searchData.merchantName = searchData.merchantName.trim()}"
              placeholder="请输入商户名称" clearable></el-input>
          </el-form-item>
          <el-form-item class="btn-wrap">
            <el-button type="primary" @click="handleSelectMerchant" class="el-btn-custom">搜索</el-button>
            <el-button @click="resetForm('searchData')" class="el-btn-custom">重置</el-button>
          </el-form-item>
        </el-form>
        <div class="entity-card-list-table _m-member-table-custom">
          <el-table :data="tableDataList" ref="merchantTable" stripe style="width: 100%" :empty-text="tipMessage">
            <el-table-column label="" width="70" center>
              <template slot-scope="scope">
                <el-radio class="radio" v-model="merchantRadio" :label="scope.row.merchantId" @change.native="getCurrentRow(scope)">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="merchantNum" label="商户编号" min-width="140" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="merchantName" label="商户名称" min-width="140" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="createTime" label="创建时间" min-width="120" :formatter="formateEmpty"
              show-overflow-tooltip>
              <template slot-scope="scope">{{scope.row.createTime | formatCreateTime}}</template></el-table-column>
          </el-table>
        </div>
        <!-- 分页 start -->
        <div class="page-wrap">
          <el-pagination background @size-change="handleMerchantSizeChange" @current-change="handleMerchantCurrentChange"
            :current-page="searchData.current-0" :page-size="searchData.size-0" layout="prev, pager, next, jumper, sizes"
            :page-sizes="[20 , 50 , 100]" :total="merchantTotal-0"></el-pagination>
        </div>
        <!-- 分页 end -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" @click="handleChangeMerchantDialog(true)">确 定</el-button>
        <el-button size="medium" @click="handleChangeMerchantDialog(false)">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import FixStepTool from "../../../components/fix-step-tool/fix-step-tool";
import fixStepMixin from "../../../mixins/CRM/fixStepTool.js";
import OwnershipDetail from "../components/OwnershipDetail";

export default {
  name: "addCardType",
  data() {
    // 输入限制正则
    var testName = /^[\u4e00-\u9fa50-9a-zA-Z\s\~\`\·\！\!\@\#\￥\%\^\……\&\*\（\）\——\-\+\=\【\】\{\}\|\、\\\：\；\:\;\“\”\‘\’\'\"\[\]\{\}\<\,\>\.\《\》\，\。\？\、\?\/\(\)\_]+$/;

    // 验证卡政策名称
    var checkCardName = (rule, value, callback) => {
      if (!value.toString().trim()) {
        callback(new Error("请输入卡政策名称"));
      } else if (!testName.test(value.toString().trim())) {
        callback(new Error("输入的名称含有不合法字符"));
      } else {
        // this.ruleForm[rule.field] = value.toString().trim();
        // callback();
        if (this.$route.query.cardId) {
          callback();
        }
        this.$crmList
          .cardTypeNameIsExist({
            cardProductName: value.toString().trim(),
            id: this.$route.query.cardTypeId
              ? this.$route.query.cardTypeId
              : "",
            tenantId: this.$store.state.loginUser.consumerId
          })
          .then(data => {
            if (data.isExist) {
              callback(new Error("该名称已存在，请更换其他名称"));
            } else {
              this.ruleForm.cardName = value.toString().trim();
              callback();
            }
          })
          .catch(err => console.log(err));
      }
    };
    var checkRemark = (rule, value, callback) => {
      if (value == null) {
        value = "";
      }
      if (!value.toString().trim()) {
        callback();
      } else if (!testName.test(value.toString().trim())) {
        callback(new Error("输入的名称含有不合法字符"));
      } else {
        callback();
      }
    };
    // 正则 整数或小数
    var testNum = /^\d+(\.\d+)?$/;
    // 验证金额
    var checkMoney = (rule, value, callback) => {
      if (value.toString().replace(/\s/g, "") == "") {
        callback(new Error("请输入金额"));
      }
      if (!testNum.test(value.toString().replace(/\s/g, ""))) {
        callback(new Error("请输入正确的数字"));
      }
      if (
        rule.field == "firstChargeMin" ||
        rule.field == "chargeMin" ||
        rule.field == "chargeMax"
      ) {
        if (value.toString().replace(/\s/g, "") * 1 <= 0) {
          callback(new Error("请输入大于0的数字"));
        }
        if (
          this.ruleForm.firstChargeMin &&
          this.ruleForm.chargeMin &&
          this.ruleForm.chargeMax
        ) {
          if (
            this.ruleForm.firstChargeMin.toString().replace(/\s/g, "") * 1 >
              this.ruleForm.chargeMax.toString().replace(/\s/g, "") * 1 &&
            rule.field == "firstChargeMin"
          ) {
            callback(new Error("首充最小金额不能大于单充最大金额"));
          }
          if (
            this.ruleForm.chargeMin.toString().replace(/\s/g, "") * 1 >
              this.ruleForm.chargeMax.toString().replace(/\s/g, "") * 1 &&
            rule.field == "chargeMin"
          ) {
            callback(new Error("单充最小金额不能大于单充最大金额"));
          }
          if (
            this.ruleForm.firstChargeMin.toString().replace(/\s/g, "") * 1 >
              this.ruleForm.chargeMax.toString().replace(/\s/g, "") * 1 &&
            rule.field == "chargeMax"
          ) {
            callback(new Error("单充最大金额不能小于首充最小金额"));
          }
          if (
            this.ruleForm.chargeMin.toString().replace(/\s/g, "") * 1 >
              this.ruleForm.chargeMax.toString().replace(/\s/g, "") * 1 &&
            rule.field == "chargeMax"
          ) {
            callback(new Error("单充最大金额不能小于单充最小金额"));
          }
        }
      }
      if (
        !/^\d{1,8}$|^\d{1,8}[.]\d{1,2}$/.test(
          value.toString().replace(/\s/g, "")
        )
      ) {
        callback(new Error("整数部分最多8位，且最多两位小数"));
      } else {
        if (/^[0-9]+$/.test(value.toString().replace(/\s/g, ""))) {
          this.ruleForm[rule.field] = (
            value.toString().replace(/\s/g, "") * 1
          ).toFixed(0);
        } else {
          this.ruleForm[rule.field] = (
            value.toString().replace(/\s/g, "") * 1
          ).toFixed(2);
        }
        // this.ruleForm[rule.field] = (
        //   value.toString().replace(/\s/g, "") * 1
        // ).toFixed(2);
        callback();
      }
    };
    // 验证延期手续费
    var checkDelayPrice = (rule, value, callback) => {
      if (this.ruleForm.canDelay == "no_delay") {
        callback();
      } else {
        if (!this.ruleForm.delayPrice) {
          this.ruleForm.delayPrice = "";
        }
        if (this.ruleForm.delayPrice.toString().replace(/\s/g, "") == "") {
          callback(new Error("请输入金额"));
        }
        if (
          !testNum.test(this.ruleForm.delayPrice.toString().replace(/\s/g, ""))
        ) {
          callback(new Error("请输入正确的数字"));
        }
        // if (this.ruleForm.delayPrice.toString().replace(/\s/g, "") * 1 < 0) {
        //   callback(new Error("请输入大于0的数字"));
        // }
        if (
          !/^\d{1,8}$|^\d{1,8}[.]\d{1,2}$/.test(
            this.ruleForm.delayPrice.toString().replace(/\s/g, "")
          )
        ) {
          callback(new Error("整数部分最多8位，且最多两位小数"));
        } else {
          callback();
        }
      }
    };
    // 校验卡样式
    var checkCardStyle = (rule, value, callback) => {
      if (this.cardStyle == "custom_card") {
        if (this.ruleForm.picPath == "") {
          this.$message.error("请上传卡样式图片");
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    // 校验联名卡标价
    var checkJointCardPrice = (rule, value, callback) => {
      if (value == null) {
        value = "";
      }
      if (value.toString().replace(/\s/g, "") == "") {
        callback();
      }
      if (!testNum.test(value.toString().replace(/\s/g, ""))) {
        callback(new Error("请输入正确的数字"));
      }
      if (
        !/^\d{1,8}$|^\d{1,8}[.]\d{1,2}$/.test(
          value.toString().replace(/\s/g, "")
        )
      ) {
        callback(new Error("整数部分最多8位，且最多两位小数"));
      } else {
        if (/^[0-9]+$/.test(value.toString().replace(/\s/g, ""))) {
          this.ruleForm[rule.field] = (
            value.toString().replace(/\s/g, "") * 1
          ).toFixed(0);
        } else {
          this.ruleForm[rule.field] = (
            value.toString().replace(/\s/g, "") * 1
          ).toFixed(2);
        }
        callback();
      }
    };
    // 校验有效期
    var checkWorkTimeNum = (rule, value, callback) => {
      if (value.toString().replace(/\s/g, "") == "") {
        callback(new Error("请输入数字"));
      }
      if (value.toString().replace(/\s/g, "") * 1 <= 0) {
        callback(new Error("请输入大于0的数字"));
      }
      if (!/^[1-9]\d*$/.test(value.toString().replace(/\s/g, ""))) {
        callback(new Error("请输入正整数"));
      }
      if (value.toString().replace(/\s/g, "") * 1 > 9999) {
        callback(new Error("最多不能超过4位数字"));
      } else {
        callback();
      }
    };
    // 免年费机制校验
    var checkFreeAnnualFee = (rule, value, callback) => {
      if (value == "total_ticket") {
        if (
          this.ruleForm.yearRule.freeAnnualNum.toString().replace(/\s/g, "") ==
          ""
        ) {
          callback(new Error("请输入数字"));
        }
        if (
          !/^[1-9]\d*$/.test(
            this.ruleForm.yearRule.freeAnnualNum.toString().replace(/\s/g, "")
          )
        ) {
          callback(new Error("请输入正整数"));
        }
        if (
          this.ruleForm.yearRule.freeAnnualNum.toString().replace(/\s/g, "") *
            1 >
          9999
        ) {
          callback(new Error("最多不能超过4位数字"));
        } else {
          callback();
        }
      } else if (value == "total_consume") {
        if (
          this.ruleForm.yearRule.freeAnnualNum.toString().replace(/\s/g, "") ==
          ""
        ) {
          callback(new Error("请输入数字"));
        }
        if (
          !testNum.test(
            this.ruleForm.yearRule.freeAnnualNum.toString().replace(/\s/g, "")
          )
        ) {
          callback(new Error("请输入正确的数字"));
        }
        if (
          this.ruleForm.yearRule.freeAnnualNum.toString().replace(/\s/g, "") *
            1 <=
          0
        ) {
          callback(new Error("请输入大于0的数字"));
        }
        if (
          !/^\d{1,8}$|^\d{1,8}[.]\d{1,2}$/.test(
            this.ruleForm.yearRule.freeAnnualNum.toString().replace(/\s/g, "")
          )
        ) {
          callback(new Error("整数部分最多8位，且最多两位小数"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    // 检验扣年费时间
    var checkAnnualFeeTime = (rule, value, callback) => {
      if (value == "fixed_date") {
        if (this.ruleForm.yearRule.deductionsTime == "") {
          callback(new Error("请选择日期"));
        } else {
          callback();
        }
      } else if (value == "dynamic_time") {
        if (
          this.ruleForm.yearRule.deductionsTime.toString().replace(/\s/g, "") ==
          ""
        ) {
          callback(new Error("请填写天数"));
        }
        if (
          !/^[1-9]\d*$/.test(
            this.ruleForm.yearRule.deductionsTime.toString().replace(/\s/g, "")
          )
        ) {
          callback(new Error("请输入正整数"));
        }
        if (
          this.ruleForm.yearRule.deductionsTime.toString().replace(/\s/g, "") *
            1 >
          365
        ) {
          callback(new Error("输入的数字不能大于365"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    // 校验是否选择商户
    var checkMerchantSelect = (rule, value, callback) => {
      if (!this.currentMerchantRow.merchantId) {
        callback(new Error("请选择商户"));
      } else {
        callback();
      }
    };
    // 校验是否选择权益
    var checkEquitySelect = (rule, value, callback) => {
      if (this.ruleForm.equityList.length == 0) {
        callback(new Error("请选择权益"));
      } else {
        callback();
      }
    };
    //校验积分规则
    var checkIntegralRule = (rule, value, callback) => {
      if (value.toString().replace(/\s/g, "") == "") {
        callback(new Error("请输入数字"));
      }
      if (!/^[0-9]\d*$/.test(value.toString().replace(/\s/g, ""))) {
        callback(new Error("请输入整数"));
      }
      if (value.toString().replace(/\s/g, "") * 1 > 9999) {
        callback(new Error("最多不能超过4位数字"));
      } else {
        callback();
      }
    };
    // 验证可售渠道
    var checkSalableChannel = (rule, value, callback) => {
      if (this.frontDesk | this.checkedChannels.length) {
        callback();
      } else {
        callback(new Error("请至少选择一种可售渠道"));
      }
    };

    return {
      cardStyle: "enjoy_gold",
      temporaryCurrentMerchantRow: {}, // 临时所选商户信息
      currentMerchantRow: {}, //所选商户信息
      merchantRadio: "",
      tipMessage: "", //商户列表提示语
      merchantTotal: 20, //商户总数
      merchantDialog: false, //选择联名商户的dialog显示/隐藏
      sameCategoryDialog: false, // 相同类别的dialog显示/隐藏
      sameCategory: "", //相同类别的权益
      equityId: "", //权益id
      deleteArray: [], //删除后的权益数组
      // multipleSelection: [], //选择的自有权益
      multipleSelectionItem: [], //临时选择的自有权益
      tableDataList: [], // 商户列表数据
      tableData: [], // 权益列表数据
      currentPage: 1,
      total: 20,
      // 选择商户的dialog
      searchData: {
        merchantNum: "", //商户编号
        merchantName: "", // 商户名称
        status: "1", //状态
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId
      },
      // 添加权益的dialog
      formData: {
        equityName: "", //权益名称
        equityType: "", //权益类型
        equityCategory: "", //权益类别
        status: "start", //卡状态
        equityNo: "", //权益ID
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId //租户id
      },
      equityTypeList: [
        { name: "服务类", value: "service_type" },
        { name: "消费类", value: "consumer_type" },
        { name: "体验类", value: "experience_type" },
        { name: "身份类", value: "identity_type" }
      ], //权益类型列表
      equityCategoryList: [
        { name: "影票折扣", value: "movie" },
        { name: "卖品折扣", value: "goods" },
        { name: "生日赠券", value: "birthday" },
        { name: "代金卷", value: "voucher" }
      ], //权益类别列表
      previewDialog: false, // 预览权益dialog显示/隐藏
      equityDialog: false, // 权益dialog显示/隐藏
      dialogVisible: false,
      selectedCinema: true,
      activeNames: ["1", "2", "3", "4"],
      stepData: {
        stepEl: ".el-collapse-item",
        stepList: [
          {
            name: "基础信息",
            isactive: false
          },
          {
            name: "开卡/充值设置",
            isactive: false
          },
          {
            name: "会员卡规则",
            isactive: false
          },
          {
            name: "会员卡权益",
            isactive: false
          }
        ]
      },
      ruleForm: {
        tenantId: this.$store.state.loginUser.consumerId, //租户id
        cardName: "", //卡政策名称
        equityList: [], //所选择的权益
        annualFee: false, // 是否设置储值卡年费规则
        merchantList: [], //所选择的商户
        remark: "", //卡政策备注
        cardTypeCode: "stored_card", //卡类型 stored_card —— 储值卡；equity_card —— 权益卡；cobranded_card —— 联名卡
        custom: false, //是否自定义卡样式
        picPath:
          "http://llyy-java.oss-cn-beijing.aliyuncs.com/product/picture/product_picture_20190321155446_f42wvd.png", //卡样式
        mustFill: ["user_name", "sex", "birthday", "phone_number"], //开卡必填（姓名，手机号...）
        weakPassword: 0, //是否允许简单密码
        canCharge: 1, //是否允许充值
        freeConsumption: false,//是否免费支付
        firstChargeMin: "50", //首充最小金额
        chargeMin: "", //最大充值金额
        chargeMax: "", //最小充值金额
        openPrice: "", //开卡手续费
        makeUpPrice: "", //补卡手续费
        // replacePrice: "0", //换卡手续费
        backPrice: "0", //注销手续费
        price: "", //权益卡售价
        canDelay: "no_delay", //权益卡延期设置
        delayPrice: "", //延期手续费
        settlementPrice: "", //联名卡结算价
        priceTag: "", //联名卡标价
        list: [], //可售渠道
        withCash: 1, //是否允许补现
        // integralRule: "2",
        workTimeNum: "", //有效期
        // MinIssuePrice: "30",//最低发行价
        // limitNumber: "10000", // 限制开卡数
        workTimeType: "month", //有效期类型
        yearRule: {
          price: "0", //卡年费
          freeAnnualFee: "", //total_ticket:累计购票，total_consume：消费累计
          freeAnnualNum: "", //免年费次数 或 免年费消费金额
          firstYearFee: 0, // 首年是否免年费
          deductionsType: "fixed_date", //扣年费类型
          deductionsTime: "" //扣年费时间
        }
      },
      allChannels: [], //存起来的网售渠道
      frontDesk: true, //影城前台
      networkSale: true, //网售渠道
      checkAllChannels: true,
      checkedChannels: [],
      channels: [],
      isIndeterminateChannel: false,
      rules: {
        cardName: [
          { max: 20, message: "长度不可超过20个字符", trigger: "blur" },
          { required: true, validator: checkCardName, trigger: "blur" }
        ],
        weakPassword: [
          { required: true, message: "请选择", trigger: "change" }
        ],
        remark: [
          { max: 500, message: "长度不可超过500个字符", trigger: "blur" },
          { required: false, validator: checkRemark, trigger: "blur" }
        ],
        canCharge: [{ required: true, message: "请选择", trigger: "change" }],
        freeConsumption: [{ required: true, message: "请选择", trigger: "change" }],
        firstChargeMin: [
          { required: true, validator: checkMoney, trigger: "blur" }
        ],
        chargeMin: [{ required: true, validator: checkMoney, trigger: "blur" }],
        chargeMax: [{ required: true, validator: checkMoney, trigger: "blur" }],
        openPrice: [{ required: true, validator: checkMoney, trigger: "blur" }],
        makeUpPrice: [
          { required: true, validator: checkMoney, trigger: "blur" }
        ],
        // replacePrice: [
        //   { required: true, validator: checkMoney, trigger: "blur" }
        // ],
        backPrice: [{ required: true, validator: checkMoney, trigger: "blur" }],
        MinIssuePrice: [
          { required: true, validator: checkMoney, trigger: "blur" }
        ],
        price: [{ required: true, validator: checkMoney, trigger: "blur" }],
        settlementPrice: [
          { required: true, validator: checkMoney, trigger: "blur" }
        ],
        priceTag: [
          { required: false, validator: checkJointCardPrice, trigger: "blur" }
        ],
        workTimeNum: [
          { required: true, validator: checkWorkTimeNum, trigger: "blur" }
        ],
        mustFill: [
          {
            type: "array",
            required: true,
            message: "请至少选择一项",
            trigger: "change"
          }
        ],
        salableChannel: [
          { required: true, validator: checkSalableChannel, trigger: "change" }
        ],
        cardTypeCode: [
          { required: true, message: "请选择卡类型", trigger: "change" }
        ],
        withCash: [
          { required: false, message: "请选择方式", trigger: "change" }
        ],
        // integralRule: [
        //   { required: true, validator: checkIntegralRule, trigger: "blur" }
        // ],
        merchantList: [
          { required: true, validator: checkMerchantSelect, trigger: "change" }
        ],
        "yearRule.price": [
          { required: true, validator: checkMoney, trigger: "blur" }
        ],
        "yearRule.freeAnnualFee": [
          { required: false, validator: checkFreeAnnualFee, trigger: "blur" }
        ],
        "yearRule.firstYearFee": [
          { required: true, message: "请选择", trigger: "change" }
        ],
        "yearRule.deductionsType": [
          { required: true, validator: checkAnnualFeeTime, trigger: "blur" }
        ],
        equityList: [
          { required: true, validator: checkEquitySelect, trigger: "change" }
        ],
        // 延期手续费
        delayPrice: [
          { required: true, validator: checkDelayPrice, trigger: "blur" }
        ],
        // 卡样式
        cardStyle: [
          { required: true, validator: checkCardStyle, trigger: "blur" }
        ]
      }
    };
  },
  components: {
    fixStepTool: FixStepTool,
    OwnershipDetail
  },
  filters: {
    formatCreateTime: function(value) {
      if (value) {
        return new Date(value.replace(/-/g, "/")).formatDate("yyyy-MM-dd");
      } else {
        return "-";
      }
    }
  },
  mounted() {
    this.$crmList
      .channelList({ tenantId: this.$store.state.loginUser.consumerId })
      .then(res => {
        this.channels = res;
        this.allChannels = res;
        // 添加时的初始化
        this.checkedChannels = res.map(item => {
          return item.desc + "," + item.code;
        });
      });
    this.$route.query.cardId
      ? this.getcardTypeInfo(this.$route.query.cardId)
      : console.log("添加卡");
  },
  mixins: [fixStepMixin],
  watch: {
    "ruleForm.canDelay": {
      handler(newName, oldName) {
        if (newName == "no_delay") {
          this.ruleForm.delayPrice = "";
          this.$refs["ruleForm"].clearValidate("delayPrice");
        }
      }
    },
    deep: true,
    immediate: true
  },
  methods: {
    // 卡样式上传成功之后
    imgUploaded(response, file, fileList) {
      if (!response.data) {
        this.$message.error(response.msg);
      } else {
        this.ruleForm.picPath = response.data.url;
        this.$message.success("上传成功!");
      }
    },
    // 卡样式上传前的校验
    beforeAvatarUpload(file) {
      const isPNG = file.type === "image/png";
      const isLt200k = file.size / 1024 < 200;
      if (!isPNG) {
        this.$message.error("上传卡样式图片只能是 PNG 格式!");
      }
      if (!isLt200k) {
        this.$message.error("上传卡样式图片大小不能超过 200k!");
      }
      return isPNG && isLt200k;
    },
    // 初始化年费信息
    handleInitYearRule(val) {
      if (val && this.ruleForm.yearRule == null) {
        this.ruleForm.yearRule = {
          price: "0", //卡年费
          freeAnnualFee: "", //total_ticket:累计购票，total_consume：消费累计
          freeAnnualNum: "", //免年费次数 或 免年费消费金额
          firstYearFee: 0, // 首年是否免年费
          deductionsType: "fixed_date", //扣年费类型
          deductionsTime: "" //扣年费时间
        };
      }
    },
    // 点击选择商户dialog的确定、取消按钮
    handleChangeMerchantDialog(status) {
      this.merchantDialog = false;
      if (status) {
        this.currentMerchantRow = this.temporaryCurrentMerchantRow;
      } else {
        this.temporaryCurrentMerchantRow = this.currentMerchantRow;
      }
    },
    // 删除商户
    handleClose(tag) {
      this.currentMerchantRow = {};
      this.merchantRadio = "";
    },
    // 选择商户时 点击单选按钮
    getCurrentRow(val) {
      this.temporaryCurrentMerchantRow = val.row;
    },
    // 点击 选择商户 按钮
    handleClickSelectMerchant() {
      this.merchantDialog = true;
      this.searchMerchant();
      this.merchantRadio = this.currentMerchantRow.merchantId;
    },
    /* 选择商户分页相关 start */
    handleMerchantSizeChange(val) {
      this.searchData.size = val;
      this.searchMerchant();
    },
    handleMerchantCurrentChange(val) {
      this.searchData.current = val;
      this.searchMerchant();
    },
    /* 选择商户分页相关 end */
    formateEmpty(row, column, cellValue, index) {
      return cellValue != null ? cellValue : "-";
    },
    // 搜索商户
    searchMerchant() {
      let params = JSON.parse(JSON.stringify(this.searchData));
      this.tipMessage = "数据加载中...";
      this.$crmList
        .getjointNameCardList(params)
        .then(data => {
          if (data.total == 0) {
            this.tipMessage = "暂无数据";
          }
          this.tableDataList = data.records;
          this.searchData.size = data.size;
          this.merchantTotal = data.total;
        })
        .catch(err => {
          this.tipMessage = err.message;
        });
    },
    // 选择商户dialog中点击搜索
    handleSelectMerchant() {
      this.searchData.current = 1;
      this.searchMerchant();
    },
    // 切换卡样式时
    handleChangeCardStyle(val) {
      if (val == "custom_card") {
        this.ruleForm.custom = true;
        this.ruleForm.picPath = "";
      } else {
        this.ruleForm.custom = false;
        if (val == "enjoy_gold") {
          this.ruleForm.picPath =
            "http://llyy-java.oss-cn-beijing.aliyuncs.com/product/picture/product_picture_20190321155446_f42wvd.png";
        }
        if (val == "fresh_tea_making") {
          this.ruleForm.picPath =
            "http://llyy-java.oss-cn-beijing.aliyuncs.com/product/picture/product_picture_20190321155633_frlyct.png";
        }
        if (val == "elegant_blue_violet") {
          this.ruleForm.picPath =
            "http://llyy-java.oss-cn-beijing.aliyuncs.com/product/picture/product_picture_20190321155744_6vtndu.png";
        }
        // console.log("this.ruleForm.picPath===", this.ruleForm.picPath);
      }
    },
    // 切换卡类型时
    handleChangeCardType(formName) {
      this.$refs[formName].clearValidate();
    },
    // 过滤权益类别
    equityCategoryNameShow(row, column, cellValue, index) {
      if (row.equityType != "consumer_type") {
        return "-";
      } else {
        return cellValue ? cellValue : "-";
      }
    },
    // 点击权益dialog的确定、取消按钮
    changeEquityDialog(ok) {
      this.equityDialog = false;
      if (ok) {
        this.ruleForm.equityList = new Array(...this.multipleSelectionItem) ;
      } else {
        this.multipleSelectionItem = new Array(...this.ruleForm.equityList);
      }
    },
    // 添加权益
    handleAddEquityDialog() {
      this.search();
      this.equityDialog = true;
    },
    // 预览权益
    handlePreviewEquity(id) {
      this.$set(this, "equityId", id);
      this.previewDialog = true;
    },
    // 删除权益
    handleDeleteEquity(index) {
      this.ruleForm.equityList.splice(index, 1);
      this.multipleSelectionItem = new Array(...this.ruleForm.equityList)
    },
    // 权益回显
    rowMultipleChecked(selectedArr) {
      if (selectedArr.length != 0) {
        for (let i = 0; i < selectedArr.length; i++) {
          for (let k = 0; k < this.tableData.length; k++) {
            if (selectedArr[i].id == this.tableData[k].id) {
                this.$refs.multipleTable.toggleRowSelection(
                  this.tableData[k],
                  true
                );
                break
              }
          }
        }
      }
    },
    //数据为空格式化
    emptyShow(row, column, cellValue, index) {
      return cellValue ? cellValue : "-";
    },
    getRowKeys(row) {
      return row.id;
    },
    //单一数据toggle
    rowOneToggle(row){
        for (let index = 0; index < this.multipleSelectionItem.length; index++) {
          if(row.id == this.multipleSelectionItem[index].id){
            this.multipleSelectionItem.splice(index,1)
            return
          }
        }
        this.multipleSelectionItem.push(row)
    },
    //单一数据add
    rowOneAdde(row){
        for (let index = 0; index < this.multipleSelectionItem.length; index++) {
          if(row.id == this.multipleSelectionItem[index].id){
            return
          }
        }
        this.multipleSelectionItem.push(row)
    },
    //单一数据reomove
    rowOneRemove(row){
        for (let index = 0; index < this.multipleSelectionItem.length; index++) {
          if(row.id == this.multipleSelectionItem[index].id){
            this.multipleSelectionItem.splice(index,1)
            return
          }
        }
    },
    //手动选择权益
    handleSelect(selection, row) {
      if(row){
        this.rowOneToggle(row)
      }else{
        if(selection.length == 0){
          for (let index = 0; index < this.tableData.length; index++) {
            const item = this.tableData[index];
            this.rowOneRemove(item)
          }
        }else{
          for (let j = 0; j < selection.length; j++) {
            const selectionItem = selection[j];
            this.rowOneAdde(selectionItem);
          }
        }
      }
    },
    handleSizeChange(val) {
      this.formData.size = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.formData.current = val;
      this.search();
    },
    // 搜索自有权益
    search() {
      let params = JSON.parse(JSON.stringify(this.formData));
      this.$crmList
        .getEquityList(params)
        .then(data => {
          this.tableData = data.records;
          this.total = data.total;
          this.$refs.multipleTable.clearSelection();
          console.log('this.ruleForm.equityList3243234634655',this.ruleForm.equityList)
          this.rowMultipleChecked(this.multipleSelectionItem);
          // this.loading = false;
        })
        .catch(err => {
          // this.loading = false;
        });
    },
    // 点击搜索按钮
    handleSearch() {
      this.formData.current = 1;
      this.search();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 免年费机制类型改变
    handleChangeFreeAnnualFee() {
      this.ruleForm.yearRule.freeAnnualNum = "";
    },
    // 免年费机制
    changeAnnualNum(val) {
      this.ruleForm.yearRule.freeAnnualNum = val;
    },
    // 扣年费类型改变
    handleChangeDeductionsType(val) {
      this.ruleForm.yearRule.deductionsTime = "";
    },
    // 扣年费日期
    changeDate(val) {
      this.ruleForm.yearRule.deductionsTime = val;
    },
    // 初始化网售渠道
    initChannel(res) {
      // 修改时的初始化
      if (res == null) return;

      let resData = res.map(item => {
        return item.channelName;
      });
      if (resData.indexOf("影城前台") != -1 && resData.length == 1) {
        this.frontDesk = true;
        this.networkSale = false;
        this.checkAllChannels = false;
        this.isIndeterminateChannel = false;
        this.checkedChannels = [];
      }
      if (resData.indexOf("全选") != -1) {
        this.frontDesk = true;
        this.networkSale = true;
        this.checkAllChannels = true;
        this.isIndeterminateChannel = false;
        this.checkedChannels = res.map(item => {
          return item.channelName + "," + item.channelNo;
        });
      }
      if (
        resData.indexOf("影城前台") != -1 &&
        resData.length <= this.channels.length &&
        resData.length != 1
      ) {
        this.frontDesk = true;
        this.networkSale = true;
        this.checkAllChannels = false;
        this.isIndeterminateChannel = true;
        this.checkedChannels = res.map(item => {
          return item.channelName + "," + item.channelNo;
        });
      }

      if (resData.indexOf("影城前台") == -1 && resData.length > 1) {
        this.frontDesk = false;
        this.networkSale = true;
        this.checkedChannels = res.map(item => {
          return item.channelName + "," + item.channelNo;
        });
      }
    },

    //数据反处理
    dataTurnFormatDate(formatDate) {
      formatDate.mustFill = formatDate.mustFill
        ? formatDate.mustFill.split(",")
        : [];
      // 处理卡权益的回显
      // this.multipleSelectionItem = formatDate.equityList;
      this.multipleSelectionItem = formatDate.equityList.map(item => {
        return {
          id: item.equityId,
          equityName: item.equityName,
          equityType: item.equityType,
          equityTypeName: item.equityTypeName
        };
      });
      formatDate.equityList = formatDate.equityList.map(item => {
        return {
          id: item.equityId,
          equityName: item.equityName,
          equityType: item.equityType,
          equityTypeName: item.equityTypeName
        };
      });
      // 处理商户
      if (formatDate.cardTypeCode == "cobranded_card") {
        this.currentMerchantRow = {
          // row: {
          merchantName: formatDate.merchantList[0].merchantName,
          merchantId: formatDate.merchantList[0].merchantId
          // }
        };
      }
      // 处理卡样式
      if (formatDate.custom) {
        this.cardStyle = "custom_card";
      } else {
        if (
          formatDate.picPath ==
          "http://llyy-java.oss-cn-beijing.aliyuncs.com/product/picture/product_picture_20190321155446_f42wvd.png"
        ) {
          this.cardStyle = "enjoy_gold";
        }
        if (
          formatDate.picPath ==
          "http://llyy-java.oss-cn-beijing.aliyuncs.com/product/picture/product_picture_20190321155633_frlyct.png"
        ) {
          this.cardStyle = "fresh_tea_making";
        }
        if (
          formatDate.picPath ==
          "http://llyy-java.oss-cn-beijing.aliyuncs.com/product/picture/product_picture_20190321155744_6vtndu.png"
        ) {
          this.cardStyle = "elegant_blue_violet";
        }
      }
      // formatDate.weakPassword = formatDate.weakPassword + "";
      // formatDate.canCharge = formatDate.canCharge + "";
      return formatDate;
    },
    //获取卡详情
    getcardTypeInfo(cardId) {
      this.$crmList
        .getcardTypeInfo({
          cardProductId: cardId,
          tenantId: this.$store.state.loginUser.consumerId
        })
        .then(res => {
          this.$set(this, "ruleForm", this.dataTurnFormatDate(res));
          this.initChannel(res.channelList);
        });
    },
    // 表单提交前的 可售渠道处理
    handleSalableChannel(data) {
      data.list = [];
      if (this.frontDesk && this.networkSale && this.checkAllChannels) {
        this.checkedChannels.push("影城前台,front_desk", "全选,0");
        data.list = this.checkedChannels;
      } else if (this.frontDesk && this.networkSale) {
        this.checkedChannels.push("影城前台,front_desk");
        data.list = this.checkedChannels;
      } else if (this.frontDesk) {
        data.list.push("影城前台,front_desk");
      } else {
        data.list = this.checkedChannels;
      }
      return data;
    },
    // 取消提交
    handleCancle(formName) {
      this.$refs[formName].resetFields();
      this.$router.push({ path: "/member/cardTypeManagement/list" });
    },
    // 相同权益dialog点击确定时
    handleSureSameEquity() {
      this.handleSave();
    },
    // 提交表单数据
    handleSave() {
      let data = JSON.parse(JSON.stringify(this.ruleForm));
      data.mustFill = data.mustFill.join(",");
      data = this.handleSalableChannel(data);

      if (this.ruleForm.cardTypeCode == "cobranded_card") {
        data.merchantList = [this.currentMerchantRow];
      }
      if (this.$route.query.cardId) {
        data.equityList = data.equityList.map(item => {
          return {
            equityId: item.equityId ? item.equityId : item.id,
            equityName: item.equityName,
            equityType: item.equityType
          };
        });
      } else {
        data.equityList = data.equityList.map(item => {
          return {
            equityId: item.id,
            equityName: item.equityName,
            equityType: item.equityType
          };
        });
      }

      if (this.$route.query.cardId) {
        this.$crmList
          .editcardTypeInfo(data)
          .then(res => {
            // this.loading = false;
            this.$message.success("修改成功");
            this.$router.push({
              path: "/member/cardTypeManagement/detail",
              query: { cardProductId: this.$route.query.cardId }
            });
          })
          .catch(err => {
            // this.loading = false;
            this.$message.error("添加失败，请重试");
            console.log(err);
          });
      } else {
        this.$crmList
          .addCardType(data)
          .then(res => {
            // this.loading = false;
            this.$message.success("添加成功");
            this.$router.push({
              path: "/member/cardTypeManagement/detail",
              query: { cardProductId: res.id }
            });
          })
          .catch(err => {
            // this.loading = false;
            this.$message.error("添加失败，请重试");
            console.log(err);
          });
      }
    },
    //   提交表单前的校验
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 查看是否存在相同类别的权益
          function repeatArray(arr) {
            var temp = []; //一个新的临时数组
            var repeatArr = []; // 重复的数组
            for (var i = 0; i < arr.length; i++) {
              if (arr[i].equityType == "consumer_type") {
                if (temp.indexOf(arr[i].equityCategoryName) == -1) {
                  temp.push(arr[i].equityCategoryName);
                } else if (
                  temp.indexOf(arr[i].equityCategoryName) != -1 &&
                  arr[i].equityCategoryName != null
                ) {
                  repeatArr.push(arr[i].equityCategoryName);
                }
              }
            }
            return repeatArr;
          }
          var val = this.ruleForm.equityList;

          if (repeatArray(val).length > 0) {
            this.sameCategoryDialog = true;
            function uniq(array) {
              var sameArr = [];
              for (var i = 0; i < array.length; i++) {
                //如果当前数组的第i项在当前数组中第一次出现的位置是i，才存入数组；否则代表是重复的
                if (array.indexOf(array[i]) == i) {
                  sameArr.push(array[i]);
                }
              }
              return sameArr;
            }
            this.sameCategory = uniq(repeatArray(val)).join("、");
          } else {
            this.handleSave();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 网售渠道
    handleCheckedNetworkSale(val) {
      if (!val) {
        this.checkedChannels = [];
        this.checkAllChannels = false;
        this.isIndeterminateChannel = false;
      }
    },
    handleCheckAllChange(val) {
      this.checkedChannels = val
        ? this.allChannels.map(item => {
            return item.desc + "," + item.code;
          })
        : [];
      this.isIndeterminateChannel = false;
    },
    handleCheckedChannelsChange(value) {
      let checkedCount = value.length;
      this.checkAllChannels = checkedCount === this.channels.length;
      this.isIndeterminateChannel =
        checkedCount > 0 && checkedCount < this.channels.length;
    }
  }
};
</script>
<style lang="scss">
.add-edit-card-type {
  width: 80%;
  // 面包屑
  .crumbs-wrap {
    padding: 0 0 20px 0;
    a.itemLink {
      font-weight: normal;
      color: #666666;
      cursor: pointer;
    }
  }
  // 选择按钮的样式
  .select-btn {
    width: 92px;
    height: 30px;
    line-height: 30px;
    background: #ffffff;
    border: 1px solid #3b74ff;
    border-radius: 4px;
    font-size: 12px;
    color: #3b74ff;
    letter-spacing: 0;
    text-align: center;
    cursor: pointer;
  }
  .el-form--label-left .el-form-item__label {
    color: #666;
    font-size: 12px;
  }
  .el-radio__label {
    font-size: 12px;
  }
  .el-input {
    font-size: 12px;
  }
  .unit {
    font-size: 12px;
    color: #666;
  }
  .card-type-content {
    border: 0;
    .el-input {
      width: 360px;
    }
    .el-textarea {
      // width: 360px;
      width: 97%;
    }
    // .el-form-item__error {
    //   top: 12px !important;
    //   left: 380px;
    // }
    .el-form-item {
      margin-bottom: 3px;
    }
    //   基础设置
    .card-type-basic-set {
      padding: 0 15px;
      .el-form-item__error {
        top: 8.5px !important;
        left: 380px;
      }
      .card-style-wrap {
        display: flex;
        width: 97%;
        justify-content: space-between;
        flex-wrap: wrap;
        .card-style-item {
          text-align: center;
          .card-face {
            border-radius: 8px;
            width: 230px;
            height: 109px;
            margin-bottom: 15px;
          }
          // 尊享黄金
          .enjoy-gold {
            // background-image: linear-gradient(-180deg, #ffcd6c 3%, #ffbc39 97%);
            background: url(http://llyy-java.oss-cn-beijing.aliyuncs.com/equity/picture/equity_picture_20190321145605_m20nk1.png)
              no-repeat;
            background-size: 100% 100%;
          }
          // .enjoy-gold::after {
          //   content: "";
          //   display: block;
          //   position: relative;
          //   top: 90px;
          //   height: 1px;
          //   background: #fcb429;
          // }
          // 清新抹茶
          .fresh-tea-making {
            // background-image: linear-gradient(-180deg, #b3e7f5 0%, #8cc6d6 98%);
            background: url(http://llyy-java.oss-cn-beijing.aliyuncs.com/product/picture/product_picture_20190321155633_frlyct.png)
              no-repeat;
            background-size: 100% 100%;
          }
          // .fresh-tea-making::after {
          //   content: "";
          //   display: block;
          //   position: relative;
          //   top: 90px;
          //   height: 1px;
          //   background: #81c5d8;
          // }
          // 优雅蓝紫
          .elegant-blue-violet {
            // background-image: linear-gradient(
            //   -180deg,
            //   #92b6fd 6%,
            //   #5f89ef 100%
            // );
            background: url(http://llyy-java.oss-cn-beijing.aliyuncs.com/product/picture/product_picture_20190321155744_6vtndu.png)
              no-repeat;
            background-size: 100% 100%;
          }
          // .elegant-blue-violet::after {
          //   content: "";
          //   display: block;
          //   position: relative;
          //   top: 90px;
          //   height: 1px;
          //   background: #5f89ef;
          // }
        }
        // 自定义卡片样式
        .custom_card-item {
          display: flex;
          width: 100%;
          margin-top: 15px;
          .upload-tip {
            font-size: 12px;
            color: #999999;
            letter-spacing: 0;
            align-self: flex-end;
          }
          .el-radio {
            margin-right: 5px;
          }
          .custom-card {
            width: 230px;
            height: 109px;
            margin-right: 5px;
          }
          .el-upload--picture-card {
            width: 109px;
            height: 109px;
            line-height: 110px;
            background-color: #fff;
          }
        }
      }
    }
    // 开卡/充值设置
    .open-card-recharge-set {
      padding: 0 15px;
      .el-form-item__error {
        top: 8.5px !important;
        left: 380px;
      }
      .checked-fee-wrap {
        background: #f5f5f5;
        width: 97.3%;
        padding: 15px 25px;
        box-sizing: border-box;
        margin: 5px 0 12px;
        border-radius: 4px;
        .freeAnnual-fee {
          .el-form-item__error {
            top: 10px !important;
            left: 460px;
          }
        }
        .first-year-free-fee > .el-form-item__label {
          line-height: 1;
          position: relative;
          top: 10px;
        }
        .deductions-type {
          .el-form-item__error {
            top: 8px !important;
            left: 580px;
          }
        }
      }
      .remark {
        .el-form-item__error {
          top: 120px !important;
          left: 0;
        }
      }
    }
    // 会员卡规则
    .card-rule {
      padding: 0 15px;
      .el-input {
        width: 178px;
      }
      .balance-insufficient .el-input {
        width: 360px;
      }
      .salable-channel {
        .salable-channel-item-wrap {
          display: flex;
          .network-channel-wrap {
            display: flex;
            margin-left: 0;
            .el-checkbox {
              margin-right: 15px;
            }
            .network-channel {
              display: flex;
              padding: 0 15px;
              height: 32px;
              line-height: 32px;
              background: #f5f5f5;
            }
          }
        }
        .el-form-item__error {
          top: 6px;
          left: 490px;
        }
      }
      .merchant-list {
        .el-form-item__error {
          top: 10px;
          left: 380px;
        }
      }
    }
    // 会员卡权益
    .card-equity {
      padding: 0 15px;
      .equity-item-wrap {
        display: flex;
        flex-wrap: wrap;
        .equity-coupon-item {
          display: flex;
          position: relative;
          width: 289px;
          margin: 0 55px 25px 0;
          .icon-neiye-danchuangquxiao {
            cursor: pointer;
            font-size: 12px;
            color: #666;
            transform: scale(0.8);
            position: absolute;
            right: 16px;
            top: -4px;
          }
          .white-dot {
            position: absolute;
            height: 85px;
            left: 4px;
          }
          .coupon-item-type {
            font-family: MicrosoftYaHei;
            width: 48px;
            height: 76px;
            line-height: 1.4;
            padding: 11px 15px;
            box-sizing: border-box;
            text-align: center;
            letter-spacing: 0;
            font-size: 14px;
            color: #ffffff;
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
          }
          .coupon-item-name {
            font-family: MicrosoftYaHei;
            width: 240px;
            height: 76px;
            padding: 0 15px;
            line-height: 76px;
            text-align: center;
            font-size: 14px;
            color: #333333;
            letter-spacing: 0;
            border-top-right-radius: 4px;
            border-bottom-left-radius: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .preview-btn {
            font-family: MicrosoftYaHei;
            font-size: 12px;
            color: #666666;
            letter-spacing: 0;
            cursor: pointer;
            position: absolute;
            bottom: -3px;
            right: 16px;
          }
          // 消费类颜色
          .consumption-type-color {
            background: #619bff;
          }
          .consumption-name-color {
            background: #f2f7ff;
          }
          // 服务类颜色
          .service-type-color {
            background: #c191e8;
          }
          .service-name-color {
            background: #f5eff9;
          }
          // 体验类颜色
          .experience-type-color {
            background: #fba07c;
          }
          .experience-name-color {
            background: #faf4f2;
          }
          // 身份类颜色
          .identity-type-color {
            background: #ff1e78;
          }
          .identity-name-color {
            background: #fff5f9;
          }
        }
      }
    }
  }
}
// 自有权益dialog样式
.__equity-dialog {
  .el-dialog__header {
    padding: 10px 20px;
  }
  .el-dialog__body {
    padding: 0px 20px;
  }
  .el-dialog__footer {
    text-align: center;
  }
  .__table-wrap {
    border-top: 1px solid #f5f5f5;
    padding-top: 10px;
    .el-form-item {
      margin: 0 5px 5px 0;
    }
    .heightBug input {
      height: 32px !important;
    }
  }
}
</style>


