<template>
  <div class="add-own-rights-type">
    <!-- 面包屑 -->
    <div class="crumbs-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>会员</el-breadcrumb-item>
        <el-breadcrumb-item>权益</el-breadcrumb-item>
        <el-breadcrumb-item>
          <router-link class="itemLink" :to="{path : '/ownRights/ownRightsList'}">自有权益库管理</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{this.$route.query.cardId?'修改权益':'新建权益'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 内容区 - 折叠面板 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="medium" label-width="100px" label-position="right"
      class="demo-ruleForm">
      <el-collapse v-model="activeNames" class="card-type-content">
        <!-- 基础设置 -->
        <el-collapse-item :title="stepData.stepList[0].name" name="1">
          <div class="card-type-basic-set">
            <el-form-item label="权益名称" prop="equityName">
              <el-input v-model="ruleForm.equityName"></el-input>
            </el-form-item>
            <el-form-item label="权益类型" :rules="{required:true}">
              <el-select v-model="ruleForm.equityType" :disabled="$route.query.cardId?true:false" placeholder="请选择">
                <el-option v-for="(item, index) in equityTypeList" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="ruleForm.equityType == 'consumer_type'" label="权益类别" :rules="{required:true}">
              <el-select v-model="ruleForm.equityCategory" placeholder="请选择" @change="equityCategoryChange">
                <el-option v-for="(item, index) in equityCategoryList" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="权益说明" prop="equityRemark">
              <el-input type="textarea" resize="none" maxlength="50" :rows="3" v-model="ruleForm.equityRemark"></el-input>
            </el-form-item>
            <el-form-item label="icon" prop="logoPic">
              <div style="float:left">
                <label for="imgupload">
                  <img v-show="this.ruleForm.logoPic" style="width:148px;height:148px" :src="this.ruleForm.logoPic" alt="">
                </label>
              </div>
              <div :style="this.ruleForm.logoPic?'float:left;margin-left:10px':''">
                <el-upload style="margin-top:5px " :show-file-list="false" :action="this.$store.state.crm.imgAction"
                  list-type="picture-card" :before-upload="beforeAvatarUpload" accept="image/*" :on-success="imgUpload"
                  :multiple="false" name="file" :data="{type:'equity_picture'}">
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </el-form-item>
          </div>
        </el-collapse-item>
        <!-- 会员卡权益 -->
        <el-collapse-item :title="stepData.stepList[1]?stepData.stepList[1].name:''" name="2" v-if="ruleForm.equityType == 'consumer_type' && ruleForm.equityCategory">
          <div class="card-equity" v-if="ruleForm.equityCategory == 'movie'">
            <div class="equity-options" v-for="(domain, index) in ruleForm.movieList" :key="index">
              <div class="ticket-discount">
                <span class="remove-equity" v-if="ruleForm.movieList.length > 1" @click="removeEquity(index,domain)">
                  <i class="iconfont icon-neiye-danchuangquxiao" style="fontSize:12px" />
                </span>
                <div class="applicable-cinema-hall-wrap">
                  <div class="applicable-cinema-hall-inner">
                    <el-form-item label="适用影院" :prop="'movieList.'+ index +'.cinemaList'" :rules="{
                          required: true, validator: checkSaleCinema, trigger: 'change'
                        }"
                      class="shiyong_yingyuan">
                      <div class="select-btn" v-show="!(domain.cinemaList && domain.cinemaList.length > 0)" @click="chooseCinema(index)">请选择影院</div>
                      <div class="cinema-list" v-show="domain.cinemaList && domain.cinemaList.length > 0" @click="chooseCinema(index)">
                        {{getArrCinemaListName(domain.cinemaList)}}
                        <i class="el-tag__close el-icon-close myclose" @click.stop="clearIndexCinema(index)"></i>
                      </div>
                      <div class="select-btn" v-show="domain.cinemaList && domain.cinemaList.length > 0" @click="chooseCinema(index)">
                        编辑
                      </div>
                    </el-form-item>
                    <!-- 适用影厅 -->
                    <el-form-item label="适用影厅" :prop="'movieList.'+ index + '.hallList'" :rules="{
                          required: true, validator: checkHallListSelected, trigger: 'change'
                        }"
                      class="cinema-hall-selection">
                      <el-checkbox :indeterminate="domain.isIndeterminateHallList" v-model="domain.checkAllHallList"
                        @change="handleCheckAllCinemaHall($event,index)">全选</el-checkbox>
                      <el-checkbox-group v-model="domain.hallList" @change="handleCheckedCinemaHallsChange($event,index)">
                        <el-checkbox v-for="(hall,index) in CinemaHalls" :label="hall" :key="index">{{hall.hallName}}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <!-- 适用制式 -->
                    <el-form-item label="适用制式" :prop="'movieList.'+ index + '.screenList'" :rules="{
                          required: true, validator: checkScreenListSelected, trigger: 'change'
                        }"
                      class="cinema-hall-selection">
                      <el-checkbox :indeterminate="domain.isIndeterminateScreenList" v-model="domain.checkAllScreenList"
                        @change="handleCheckAllStandards($event,index)">全选</el-checkbox>
                      <el-checkbox-group v-model="domain.screenList" @change="handleCheckedStandardsChange($event,index)">
                        <el-checkbox v-for="(standard,index) in Standards" :label="standard" :key="index">{{standard.screenName}}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                    <div class="unified-setup">
                      <!-- 放映星期 -->
                      <el-form-item label="放映星期" :prop="'movieList.'+ index + '.weeks'" :rules="{
                          required: true, validator: checkWeeksSelected, trigger: 'change'
                        }"
                        class="week-select-wrap">
                        <el-checkbox :indeterminate="domain.isIndeterminateWeeks" v-model="domain.checkAllWeeks"
                          @change="handleCheckAllWeeks($event,index)">全部时段</el-checkbox>
                        <el-checkbox-group v-model="domain.weeks" @change="handleCheckedWeeksChange($event,index)">
                          <el-checkbox v-for="(week,index) in Weeks" :label="index+1" :key="index+1">{{week}}</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                      <!-- 放映时段 -->
                      <el-form-item label="放映时段" :prop="'movieList.'+ index + '.dayTimesJson'" :rules="{
                          required: true, validator: checkProjectionTime, trigger: 'change'
                        }"
                        class="detail-time-select">
                        <div v-for="(domainTime, indexTime) in domain.dayTimesJson" :key="indexTime" class="detail-time-select-item">
                          <el-time-picker is-range size="medium" v-model="domain.dayTimesJson[indexTime]"
                            range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围"
                            value-format="HH:mm:ss"></el-time-picker>
                          <el-button type="text" v-if="domain.dayTimesJson.length > 1" @click.prevent="removeTimeInterval(index,indexTime,'ruleForm')">删除</el-button>
                        </div>
                        <el-row>
                          <el-col :span="1" style="width:25px">
                            <div class="grid-content bg-purple cursor" @click.prevent="handleAddTimeInterval(index)"><i
                                class="el-icon-circle-plus-outline" style="color:#3b74ff;font-size:20px;"></i></div>
                          </el-col>
                          <el-col :span="1">
                            <div class="grid-content bg-purple-light cursor" style="font-size:12px;margin-top:-2px;color:#3b74ff"
                              @click.prevent="handleAddTimeInterval(index)">添加</div>
                          </el-col>
                        </el-row>
                      </el-form-item>
                      <!-- 优惠方式 -->
                      <el-form-item label="优惠方式" :prop="'movieList.'+ index" :rules="{
                              required: true, validator: checkPreferentialWay, trigger: 'blur'
                            }"
                        class="ticket-preferential-way">
                        <el-select v-model="domain.ticketSaleType" placehaolder="请选择" size="medium">
                          <el-option v-for="(item,index) in setOptions" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-input v-model="domain.ticketSaleData" placeholder="请输入内容" :disabled="!domain.ticketSaleType"
                          size="medium"></el-input>
                      </el-form-item>
                      <!-- 优惠限制 -->
                      <el-form-item label="优惠限制" :prop="'movieList.'+ index" :rules="{
                              required: false, validator: checkLimitSaleData, trigger: 'blur'
                            }"
                        class="ticket-preferential-restrictions-wrap">
                        <div class="ticket-preferential-restrictions-item">
                          <el-radio v-model="domain.ticketLimitSaleType" label="perMemberDay">每日优惠张数上限</el-radio>
                          <el-input @change="changeTicketLimitSaleData($event,index)" :value="domain.ticketLimitSaleType == 'perMemberDay'?domain.ticketLimitSaleData:''"
                            placeholder="请输入优惠张数" :disabled="!(domain.ticketLimitSaleType == 'perMemberDay')" size="medium"></el-input>
                        </div>
                        <div class="ticket-preferential-restrictions-item">
                          <el-radio v-model="domain.ticketLimitSaleType" label="perMemberWeek">每周优惠张数上限</el-radio>
                          <el-input @change="changeTicketLimitSaleData($event,index)" :value="domain.ticketLimitSaleType == 'perMemberWeek'?domain.ticketLimitSaleData:''"
                            placeholder="请输入优惠张数" :disabled="!(domain.ticketLimitSaleType == 'perMemberWeek')" size="medium"></el-input>
                        </div>
                        <div class="ticket-preferential-restrictions-item">
                          <el-radio v-model="domain.ticketLimitSaleType" label="perMemberMonth">每月优惠张数上限</el-radio>
                          <el-input @change="changeTicketLimitSaleData($event,index)" :value="domain.ticketLimitSaleType == 'perMemberMonth'? domain.ticketLimitSaleData : ''"
                            placeholder="请输入优惠张数" :disabled="!(domain.ticketLimitSaleType == 'perMemberMonth')" size="medium"></el-input>
                        </div>
                      </el-form-item>
                      <!-- 补贴方式 -->
                      <el-form-item label="补贴方式" class="set-options-wrap" :rules="{
                              required: true, message: '请选择一项', trigger: 'change'
                            }">
                        <div class="detail-time-select-item">
                          <el-select v-model="domain.lowPriceMark" placehaolder="请选择" size="medium">
                            <el-option v-for="(item,index) in lowPriceMarkList" :key="index" :label="item.label" :value="item.value"></el-option>
                          </el-select>
                        </div>
                      </el-form-item>
                      <el-form-item label="最高补贴N元" :prop="'movieList.'+ index" :rules="{
                              required: true, validator: checkLowPriceMark, trigger: 'blur'
                            }"
                        class="maximum-subsidy-wrap" v-if="domain.lowPriceMark == 'cinemaPay'">
                        <el-input v-model="domain.maxSubsidies" placeholder="最高补贴N元" size="medium"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="add-equity-btn" @click="handleAddEquity">添加其他影院的不同优惠</div>
          </div>
          <div class="card-equity" v-if="ruleForm.equityCategory == 'goods'">
            <div class="equity-options">
              <div class="sale-preference">
                <div class="applicable-cinema-hall-wrap">
                  <div class="applicable-cinema-hall-inner">
                    <div class="unified-setup">
                      <!-- 卖品折扣 -->
                      <el-form-item label="适用影院" class="shiyong_yingyuan" prop="goods.cinemaList" :rules="{required: true, validator: checkSaleCinema, trigger: 'blur'}">
                        <div class="select-btn" v-show="!(ruleForm.goods.cinemaList && ruleForm.goods.cinemaList.length > 0)"
                          @click="chooseCinema('卖品')">请选择影院</div>
                        <div class="cinema-list" v-show="ruleForm.goods.cinemaList && ruleForm.goods.cinemaList.length > 0"
                          @click="chooseCinema('卖品')">
                          {{getArrCinemaListName(ruleForm.goods.cinemaList)}}
                          <i class="el-tag__close el-icon-close myclose" @click.stop="clearIndexCinema('卖品')"></i>
                        </div>
                        <div class="select-btn" v-show="ruleForm.goods.cinemaList && ruleForm.goods.cinemaList.length > 0"
                          @click="chooseCinema('卖品')">
                          编辑
                        </div>
                      </el-form-item>
                      <el-form-item label="适用卖品" class="shiyong_yingyuan" prop="goods.goodsList" :rules="{required: true, validator: checkSaleName, trigger: 'change'}">
                        <div class="select-btn" v-show="!(ruleForm.goods.goodsList && ruleForm.goods.goodsList.length > 0)"
                          @click="chooseGoods()">请选择卖品</div>
                        <div class="cinema-list" v-show="ruleForm.goods.goodsList && ruleForm.goods.goodsList.length > 0"
                          @click="chooseGoods()">
                          {{getArrGoodsName(ruleForm.goods.goodsList)}}
                          <i class="el-tag__close el-icon-close myclose" @click.stop="clearGoods('卖品')"></i>
                        </div>
                        <div class="select-btn" v-show="ruleForm.goods.goodsList && ruleForm.goods.goodsList.length > 0"
                          @click="chooseGoods()">
                          编辑
                        </div>
                      </el-form-item>
                      <el-form-item label="优惠方式" prop="goods" :rules="{
                              required: true, validator: checkSalePreferentialWay, trigger: 'blur'
                            }"
                        class="sale-preference-way">
                        <el-select v-model="ruleForm.goods.goodsSaleType" placehaolder="请选择" size="medium">
                          <el-option v-for="(item,index) in goodsSaleDataList" :key="index" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <el-input v-model="ruleForm.goods.goodsSaleData" placeholder="请输入内容" :disabled="!ruleForm.goods.goodsSaleType"
                          size="medium"></el-input>
                      </el-form-item>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-equity" v-if="ruleForm.equityCategory == 'voucher'">
            <div class="equity-options">
              <div class="sale-preference">
                <div class="applicable-cinema-hall-wrap">
                  <div class="applicable-cinema-hall-inner">
                    <div class="unified-setup">
                      <!-- 代金劵 -->
                      <div style="padding: 10px 0 0 0" class="dajinjuan" v-for="(item, index) in ruleForm.ticketList"
                        :key="index">
                        <el-row :gutter="20" align="middle">
                          <el-col :span="5">
                            <el-form-item label-width="80px" label="销售单号" :prop="'ticketList.'+index+'.ticketNo'"
                              :rules="{
                              required: true, validator: checkticketListTicketNo, trigger: 'change'}"
                              class="maximum-subsidy-wrap">
                              <el-input readonly v-model="item.ticketNo" placeholder="销售单号" size="medium" @focus="showccmSaleList('dai',index)">
                              </el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="4">
                            <el-form-item label-width="50px" label="张数" class="maximum-subsidy-wrap" :prop="'ticketList.'+index+'.totalNum'"
                              :rules="{required: true, validator: checkIntNum, trigger: 'blur'}">
                              <el-input v-model="item.totalNum" placeholder="张数" size="medium">
                              </el-input>
                            </el-form-item>
                          </el-col>
                          <el-col :span="9">
                            <el-form-item label-width="120px" label="发放时间与张数" required class="maximum-subsidy-wrap">
                              <div class="grid-content bg-purple">
                                <el-row :gutter="20">
                                  <el-col :span="1">
                                    <div class="grid-content bg-purple font-style">每</div>
                                  </el-col>
                                  <el-col :span="10">
                                    <div class="grid-content bg-purple" style="text-align: center">
                                      <el-select v-model="item.outOfTime" placeholder="选择" size="medium">
                                        <el-option label="年" value="year" size="medium"></el-option>
                                        <el-option label="月" value="month" size="medium"></el-option>
                                        <el-option label="周" value="week" size="medium"></el-option>
                                      </el-select>
                                    </div>
                                  </el-col>
                                  <el-col :span="9">
                                    <el-form-item :prop="'ticketList.'+index+'.num'" :rules="{required: true, validator: checkIntNum, trigger: 'blur'}">
                                      <div class="grid-content bg-purple" style="text-align: center">
                                        <el-input v-model="item.num" placeholder="数量"></el-input>
                                      </div>
                                    </el-form-item>

                                  </el-col>
                                  <el-col :span="1">
                                    <div class="grid-content bg-purple font-style">张</div>
                                  </el-col>
                                </el-row>
                              </div>
                            </el-form-item>
                          </el-col>
                          <el-col :span="2">
                            <div v-if="ruleForm.ticketList.length > 1" class="grid-content bg-purple font-style cursor"
                              style="color:#3b74ff" @click="removeTicket(index)">
                              删除
                            </div>
                          </el-col>
                        </el-row>
                      </div>
                      <div style="color:#3b74ff;margin-top:10px;margin-left:10px">
                        <el-row>
                          <el-col :span="1" style="width:25px">
                            <div class="grid-content bg-purple cursor" @click="addTicket"><i class="el-icon-circle-plus-outline"
                                style="color:#3b74ff;font-size:20px;"></i></div>
                          </el-col>
                          <el-col :span="1">
                            <div class="grid-content bg-purple-light cursor" style="font-size:12px" @click="addTicket">添加</div>
                          </el-col>
                        </el-row>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-equity" v-if="ruleForm.equityCategory == 'birthday'">
            <div class="equity-options">
              <div class="sale-preference">
                <div class="applicable-cinema-hall-wrap">
                  <div class="applicable-cinema-hall-inner">
                    <div class="unified-setup">
                      <!-- 生日赠劵 -->
                      <div>
                        <el-form-item label="发送时间" prop="birthday.issueType" required class="birthday-time">
                          <el-radio v-model="ruleForm.birthday.issueType" label="BEFORE_DAY">
                            生日前 <el-input placeholder="天数" :disabled="ruleForm.birthday.issueType == 'SAME_MONTH'"
                              v-model="ruleForm.birthday.outOfTime" style="width:60px;margin-right:10px"></el-input>天
                          </el-radio>
                          <el-radio v-model="ruleForm.birthday.issueType" label="SAME_MONTH" @change="clearBirthdayTime">生日当月首日</el-radio>
                        </el-form-item>
                        <el-form-item label="赠送劵类型" required prop="birthday.birthdayCodeOrId" class="birthday-type">
                          <el-checkbox-group v-model="ruleForm.birthday.birthdayCodeOrId">
                            <el-checkbox v-for="(item, index) in birthdayCardType" :key="index" :label="item">{{item}}</el-checkbox>
                          </el-checkbox-group>
                        </el-form-item>
                        <el-form-item>
                          <div v-if="ruleForm.birthday.birthdayCodeOrId.indexOf('代金券') != -1" style="background:#f5f5f5;width:500px;padding-left: 13px;">
                            <div class="my12size">代金券</div>
                            <div style="margin-left:20px">
                              <el-form-item v-for="(voucheritem, index) in ruleForm.birthday.voucherList" :key="index"
                                style="margin-top:14px">
                                <el-row>
                                  <el-col :span="14">
                                    <div class="grid-content bg-purple">
                                      <el-form-item label="销售单号" label-width="80px" :prop="'birthday.voucherList.'+index"
                                        :rules="{required: true, validator: checkvoucherListTicketNo, trigger: 'change'}">
                                        <el-input v-model="voucheritem.ticketNo" placeholder="销售单号" style="width:200px"
                                          readonly @focus="showccmSaleList('birthdaydai',index)"></el-input>
                                      </el-form-item>
                                    </div>
                                  </el-col>
                                  <el-col :span="7">
                                    <div class="grid-content bg-purple">
                                      <div class="grid-content bg-purple">
                                        <el-form-item label="张数" label-width="50px" :prop="'birthday.voucherList.'+index"
                                          :rules="{required: true, validator: checkvoucherListNum, trigger: 'blur'}">
                                          <el-input v-model="voucheritem.num" placeholder="张数" style="width:60px"></el-input>
                                        </el-form-item>
                                      </div>
                                    </div>
                                  </el-col>
                                  <el-col :span="2">
                                    <div class="grid-content bg-purple" v-show="ruleForm.birthday.voucherList.length > 1">
                                      <div class="mybtnsize" @click="removeVoucher(index)">删除</div>
                                    </div>
                                  </el-col>
                                </el-row>
                              </el-form-item>
                              <div style="color:#3b74ff;margin-top:8px;margin-left:10px">
                                <el-row>
                                  <el-col :span="1" style="width:25px">
                                    <div class="grid-content bg-purple cursor" @click="addVoucher"><i class="el-icon-circle-plus-outline"
                                        style="color:#3b74ff;font-size:20px;margin-top:8px"></i></div>
                                  </el-col>
                                  <el-col :span="2">
                                    <div class="grid-content bg-purple-light cursor" style="font-size:12px" @click="addVoucher">添加</div>
                                  </el-col>
                                </el-row>
                              </div>
                            </div>
                          </div>
                          <div v-if="ruleForm.birthday.birthdayCodeOrId.indexOf('兑换码') != -1" style="background:#f5f5f5;width:500px;padding-left: 13px;">
                            <div class="my12size">兑换码</div>
                            <div style="margin-left:20px">
                              <el-form-item v-for="(cdkeyitem, index) in ruleForm.birthday.cdkeyList" :key="index"
                                style="margin-top:14px">
                                <el-row>
                                  <el-col :span="14">
                                    <div class="grid-content bg-purple">
                                      <el-form-item label="销售单号" label-width="80px" :prop="'birthday.cdkeyList.'+index"
                                        :rules="{required: true, validator: checkcdkeyListTicketNo, trigger: 'change'}">
                                        <el-input v-model="cdkeyitem.ticketNo" placeholder="销售单号" style="width:200px"
                                          readonly @focus="showccmSaleList('birthdaycdk',index)"></el-input>
                                      </el-form-item>
                                    </div>
                                  </el-col>
                                  <el-col :span="7">
                                    <div class="grid-content bg-purple">
                                      <div class="grid-content bg-purple">
                                        <el-form-item label="张数" label-width="50px" :prop="'birthday.cdkeyList.'+index"
                                          :rules="{required: true, validator: checkcdkeyListNum, trigger: 'blur'}">
                                          <el-input v-model="cdkeyitem.num" placeholder="张数" style="width:60px"></el-input>
                                        </el-form-item>
                                      </div>
                                    </div>
                                  </el-col>
                                  <el-col :span="3">
                                    <div class="grid-content bg-purple" v-show="ruleForm.birthday.cdkeyList.length > 1">
                                      <div class="mybtnsize" @click="removeCdkey(index)">删除</div>
                                    </div>
                                  </el-col>
                                </el-row>
                              </el-form-item>
                              <div style="color:#3b74ff;margin-top:8px;margin-left:10px">
                                <el-row>
                                  <el-col :span="1" style="width:25px">
                                    <div class="grid-content bg-purple cursor" @click="addCdkey"><i class="el-icon-circle-plus-outline"
                                        style="color:#3b74ff;font-size:20px;margin-top:8px"></i></div>
                                  </el-col>
                                  <el-col :span="2">
                                    <div class="grid-content bg-purple-light cursor" style="font-size:12px" @click="addCdkey">添加</div>
                                  </el-col>
                                </el-row>
                              </div>
                            </div>

                          </div>

                        </el-form-item>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-form-item style="textAlign:center">
        <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
    <div :class="this.ruleForm.equityType != 'consumer_type'?'scorll-right':''">
      <fixStepTool :stepData="stepData.stepList" class="_fixsteptool-member"></fixStepTool>
    </div>
    <!-- 使用影院弹层 -->
    <frame-multicinema :framedialogVisible.sync="dialogVisible" type="1" :whereUse="whereUse" :innerCinemaMultiData="innerCinemaMultiData"
      :disabledData="disabledData" :isListprop="true" @callBack="handleCallBack" ref='frameMultiCinema'>
      <div slot="footerId">
        <el-button @click="closeDialogCinemaDialog()">取 消</el-button>
        <el-button type="primary" @click="confirmCinemaDialog()">确 定</el-button>
      </div>
    </frame-multicinema>
    <!--选择销售单号弹窗-->
    <ccmSaleList ref="ccmSaleList" :incomeData="incomeData" @ccmSaleListCallBack="ccmSaleListCallBack" />
    <!--选择卖品弹窗-->
    <cimSelectedGoods ref="cimSelectedGoods" :dialogFeedbackData="dialogFeedbackData" :dialogVisible.sync="selectedGoodsDialogVisible"
      @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack" />
  </div>
</template>
<script>
import FixStepTool from "../../../components/fix-step-tool/fix-step-tool";
import fixStepMixin from "../../../mixins/CRM/fixStepTool.js";
import ccmSaleList from "../../../../ccm/alert/saleList/index";
import cimSelectedGoods from "../../../../cim/dialogs/cimSelectedGoods/index";
const weekOptions = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

export default {
  name: "addOwnrights",
  data() {
    // 输入限制正则
    var testName = /^[\u4e00-\u9fa50-9a-zA-Z\s\~\`\·\！\!\@\#\￥\%\^\……\&\*\（\）\——\-\+\=\【\】\{\}\|\、\\\：\；\:\;\“\”\‘\’\'\"\[\]\{\}\<\,\>\.\《\》\，\。\？\、\?\/\(\)\_]+$/;

    // 验证权益卡卡政策名称
    var checkCardName = (rule, value, callback) => {
      if (!value.toString().trim()) {
        callback(new Error("请输入权益名称"));
      } else if (!testName.test(value.toString().trim())) {
        callback(new Error("输入的名称含有不合法字符"));
      } else {
        this.$crmList
          .chekckEquitynameIsexist({
            equityName: value.toString().trim(),
            equityId: this.$route.query.cardId ? this.$route.query.cardId : "",
            tenantId: this.$store.state.loginUser.consumerId
          })
          .then(data => {
            if (data.isExist) {
              callback(new Error("该名称已存在，请更换其他名称"));
            } else {
              this.ruleForm.equityName = value.toString().trim();
              callback();
            }
          })
          .catch(err => console.log(err));
      }
    };
    // 正则 整数
    var testInt = /^\d+$/;
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
        !/^\d{1,8}$|^\d{1,8}[.]\d{1,2}$/.test(
          value.toString().replace(/\s/g, "")
        )
      ) {
        callback(new Error("整数部分最多8位呦"));
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
    // 验证生日赠劵发放时间
    var birthdaytime = (rule, value, callback) => {
      if (this.ruleForm.birthday.issueType == "BEFORE_DAY") {
        if (!this.ruleForm.birthday.outOfTime) {
          callback(new Error("提前时间必填"));
        } else if (
          !testInt.test(
            this.ruleForm.birthday.outOfTime.toString().replace(/\s/g, "")
          )
        ) {
          callback(new Error("请输入整数"));
        }
      }
      callback();
    };

    return {
      selectedGoodsDialogVisible: false, //卖品弹窗显示隐藏
      dialogFeedbackData: [], //卖品弹窗回显数据
      saleListStatus: "", //临时记载所选券类型
      saleListIndex: "", //临时记载所选券Index
      incomeData: {
        couponType: "1" //弹窗显示类型 1代金券 0兑换码 2优惠券
      },
      whereUse: "1", //适用影院隔离
      cinemaIndex: "0", //当前所处选择影院index
      innerCinemaMultiData: [], //使用影院已选参数
      disabledData: [], //适用影院禁选参数
      multicinemaVisible: false, //适用影院显隐
      delCardProductRuleIdArray: [], //卡权益删除的id数组
      dialogVisible: false,
      activeNames: ["1", "2"],
      birthdayCardType: ["代金券", "兑换码"],
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
        { name: "代金券", value: "voucher" }
      ], //权益类别列表
      stepData: {
        stepEl: ".el-collapse-item",
        stepList: [
          {
            name: "权益信息",
            isactive: false
          },
          {
            name: "权益规则-影票折扣",
            isactive: false
          }
        ]
      },
      ruleForm: {
        tenantId: this.$store.state.loginUser.consumerId, //租户id
        equityName: "", //权益卡名称
        equityRemark: "", //权益卡备注
        equityType: "consumer_type", //权益类型
        equityCategory: "movie", //权益类别
        logoPic: "",
        //代金券优惠规则
        ticketList: [
          {
            num: "",
            outOfTime: "month",
            ticketNo: "",
            ticketType: "",
            totalNum: ""
          }
        ],
        //生日赠劵
        birthday: {
          issueType: "SAME_MONTH",
          birthdayCodeOrId: [], //生日赠送劵类型切换
          outOfTime: "",
          cdkeyList: [
            {
              num: "",
              ticketNo: ""
            }
          ],
          voucherList: [
            {
              num: "",
              ticketNo: ""
            }
          ]
        },
        //卖品优惠规则
        goods: {
          cinemaList: [],
          goodsList: [],
          goodsSaleData: "",
          goodsSaleType: "discountPrice"
        },
        movieList: [
          {
            //影票优惠规则
            cinemaList: [],
            dayTimesJson: [["00:00:00", "23:59:59"]],
            hallList: [],
            lowPriceMark: "cinemaPay",
            maxSubsidies: "",
            screenList: [],
            isIndeterminateScreenList: false,
            checkAllScreenList: true,
            ticketLimitSaleData: "",
            ticketLimitSaleType: "",
            ticketSaleData: "",
            ticketSaleType: "discountPrice",
            weeks: [],
            isIndeterminateWeeks: false,
            checkAllWeeks: true,
            isIndeterminateHallList: false,
            checkAllHallList: true
          }
        ]
      },
      CinemaHalls: [],
      Standards: [],
      Weeks: weekOptions,
      rules: {
        logoPic: [
          { required: true, message: "权益icon必填", trigger: "change" }
        ],
        equityRemark: [
          { required: true, message: "权益说明必填", trigger: "blur" }
        ],
        equityName: [
          { max: 20, message: "长度不可超过20个字符", trigger: "blur" },
          { required: true, validator: checkCardName, trigger: "blur" }
        ],
        remark: [{ max: 50, message: "长度不可超过50个字符", trigger: "blur" }],
        "birthday.issueType": [
          { required: true, validator: birthdaytime, trigger: "change" }
        ],
        "birthday.birthdayCodeOrId": [
          { required: true, message: "赠送劵类型必选", trigger: "change" }
        ]
      },
      goodsSaleDataList: [
        {
          value: "discountPrice",
          label: "零售价打折（%）"
        },
        {
          value: "subPrice",
          label: "零售价-N元"
        }
      ],
      setOptions: [
        {
          value: "fixPrice",
          label: "固定金额（元）"
        },
        {
          value: "discountPrice",
          label: "零售价打折（%）"
        },
        {
          value: "subPrice",
          label: "零售价-N（元）"
        }
      ],
      lowPriceMarkList: [
        {
          value: "cinemaPay",
          label: "影城补贴"
        },
        {
          value: "clientPay",
          label: "用户补贴"
        },
        {
          value: "notAllowSale",
          label: "不允许出票"
        }
      ]
    };
  },
  components: {
    fixStepTool: FixStepTool,
    ccmSaleList,
    cimSelectedGoods
  },
  mounted() {
    this.$crmList
      .screenList({ tenantId: this.$store.state.loginUser.consumerId })
      .then(res => {
        if (res) {
          this.Standards = res;
        }
        this.$crmList
          .hallList({ tenantId: this.$store.state.loginUser.consumerId })
          .then(res => {
            if (res) {
              this.CinemaHalls = res;
            }
            this.$route.query.cardId
              ? this.getcardTypeInfo(this.$route.query.cardId)
              : this.selectAll(0);
          });
      });
  },
  mixins: [fixStepMixin],
  methods: {
    //卖品弹窗返回数据
    selectedGoodsDialogCallBack(opt) {
      if (opt.data) {
        this.ruleForm.goods.goodsList = this.goodsAddGoodsCodeAndName(opt.data);
        this.$refs["ruleForm"].validateField(["goods.goodsList"]);
      }
    },
    //营销单号返回数据
    ccmSaleListCallBack(opt) {
      console.log("opt", opt.data);
      var type = this.saleListStatus;
      if (type == "dai") {
        this.ruleForm.ticketList[this.saleListIndex].ticketNo =
          opt.data.applyCode;
      } else if (type == "birthdaydai") {
        this.ruleForm.birthday.voucherList[this.saleListIndex].ticketNo =
          opt.data.applyCode;
      } else if (type == "birthdaycdk") {
        this.ruleForm.birthday.cdkeyList[this.saleListIndex].ticketNo =
          opt.data.applyCode;
      }
    },
    //显示营销单号
    showccmSaleList(type, index) {
      this.saleListStatus = type;
      this.saleListIndex = index;
      if (type == "dai") {
        this.incomeData.couponType = 1;
      } else if (type == "birthdaydai") {
        this.incomeData.couponType = 1;
      } else if (type == "birthdaycdk") {
        this.incomeData.couponType = 0;
      }
      this.$refs.ccmSaleList.isShowDialog(true);
    },
    //展示当前适用影院合集
    getArrCinemaListName(arr) {
      if (!arr.length || arr.length == 0) {
        return "请选择";
      }
      var newStrArr = [];
      arr.map((item, index) => {
        newStrArr.push(item.cinemaName ? item.cinemaName : item.name);
      });
      return newStrArr.join(",");
    },
    //获取index除外其他所有列表的适用影院合集
    getIndexOtherCinemaList(index) {
      var allList = [];
      for (let i = 0; i < this.ruleForm.movieList.length; i++) {
        const element = this.ruleForm.movieList[i];
        if (index != i) {
          allList = allList.concat(element.cinemaList);
        }
      }
      return allList;
    },
    //清空当前适用影院
    clearIndexCinema(index) {
      if (index == "卖品") {
        this.ruleForm.goods.cinemaList = [];
      } else {
        this.ruleForm.movieList[index].cinemaList = [];
      }
    },
    //适用影院 字段赋值ID->cinemaId
    cinemaAddCinemaId(arr) {
      if (!arr) {
        return [];
      }
      arr.map((item, index) => {
        item.id = item.cinemaId;
        //  cinemaName: "大地影院"
        return item;
      });
      return arr;
    },
    //适用卖品 字段赋值添加Code Name
    goodsAddGoodsCodeAndName(arr) {
      if (!arr) {
        return [];
      }
      arr.map((item, index) => {
        item.goodsCode = item.merCode;
        item.goodsName = item.merName;
        //  cinemaName: "大地影院"
        return item;
      });
      return arr;
    },
    //适用卖品 字段赋值添加Code Name
    goodsAddGoodsMerCodeAndName(arr) {
      if (!arr) {
        return [];
      }
      arr.map((item, index) => {
        item.merCode = item.goodsCode;
        item.merName = item.goodsName;
        //  cinemaName: "大地影院"
        return item;
      });
      return arr;
    },
    //适用影院 字段赋值cinemaId->ID
    cinemaAddId(arr) {
      if (!arr) {
        return [];
      }
      arr.map((item, index) => {
        item.cinemaId = item.id;
        item.cinemaName = item.name;
        return item;
      });
      return arr;
    },
    //清空卖品商品列表
    clearGoods() {
      this.ruleForm.goods.goodsList = [];
      this.dialogFeedbackData = [];
    },
    //适用卖品名称展示
    getArrGoodsName(arr) {
      if (!arr.length || arr.length == 0) {
        return "请选择";
      }
      var newStrArr = [];
      arr.map((item, index) => {
        newStrArr.push(item.goodsName ? item.goodsName : item.merName);
      });
      return newStrArr.join(",");
    },
    //适用卖品选择
    chooseGoods() {
      this.selectedGoodsDialogVisible = true;
      this.ruleForm.goods.goodsList = this.goodsAddGoodsMerCodeAndName(
        this.ruleForm.goods.goodsList
      );
      this.dialogFeedbackData = this.ruleForm.goods.goodsList;
      console.log("回显数据_____________", "dasd", this.dialogFeedbackData);
    },
    //适用影院
    chooseCinema(index) {
      this.cinemaIndex = index;
      this.whereUse = index == "卖品" ? 100 : index;
      if (index == "卖品") {
        var editData = this.ruleForm.goods.cinemaList;
        editData = editData ? this.cinemaAddCinemaId(editData) : [];
        this.$set(this, "innerCinemaMultiData", editData);
        this.$set(this, "disabledData", []);
      } else {
        var editDataIndex = this.ruleForm.movieList[index].cinemaList;
        editDataIndex = editDataIndex
          ? this.cinemaAddCinemaId(editDataIndex)
          : [];
        this.$set(this, "innerCinemaMultiData", editDataIndex);
        this.$set(this, "disabledData", this.getIndexOtherCinemaList(index));
      }
      setTimeout(() => {
        this.dialogVisible = true;
        console.log(
          "innerCinemaMultiData",
          this.innerCinemaMultiData,
          "disabledData"
        );
        this.$refs.frameMultiCinema.listAuthCommCinemas();
      });
    },
    closeDialogCinemaDialog() {
      this.dialogVisible = false;
    },
    confirmCinemaDialog() {
      this.$refs.frameMultiCinema.confirmData();
    },
    handleCallBack(opt) {
      var arr = new Array(...opt.dataList);
      if (this.cinemaIndex == "卖品") {
        this.ruleForm.goods.cinemaList = this.cinemaAddId(arr);
        this.$refs["ruleForm"].validateField(["goods.cinemaList"]);
      } else {
        this.ruleForm.movieList[this.cinemaIndex].cinemaList = this.cinemaAddId(
          arr
        );
        this.$refs["ruleForm"].validateField([
          "movieList." + this.cinemaIndex + ".cinemaList"
        ]);
      }
      this.dialogVisible = false;
    },
    //适用影院 截止
    //图片拦截，格式
    beforeAvatarUpload(file) {},
    //图片上传返回处理
    imgUpload(response, file, fileList) {
      if (!response.data) {
        this.$message.error(response.msg);
      } else {
        this.ruleForm.logoPic = response.data.url;
      }
    },
    //生日发送方式变化清空提前时间
    clearBirthdayTime(value) {
      this.ruleForm.birthday.outOfTime = "";
    },
    //添加兑换码
    addCdkey() {
      var cdModel = {
        num: "",
        ticketNo: ""
      };
      this.ruleForm.birthday.cdkeyList.push(cdModel);
    },
    //删除兑换码
    removeCdkey(index) {
      if (this.ruleForm.birthday.cdkeyList[index].id) {
        if (!this.ruleForm.birthday.delCdkeyIds) {
          this.ruleForm.birthday.delCdkeyIds = [];
        }
        this.ruleForm.birthday.delCdkeyIds.push(
          this.ruleForm.birthday.cdkeyList[index].id
        );
      }
      this.ruleForm.birthday.cdkeyList.splice(index, 1);
    },
    //添加优惠劵
    addVoucher() {
      var voucherListModel = {
        num: "",
        ticketNo: ""
      };
      this.ruleForm.birthday.voucherList.push(voucherListModel);
    },
    //删除优惠劵
    removeVoucher(index) {
      if (this.ruleForm.birthday.voucherList[index].id) {
        if (!this.ruleForm.birthday.delVoucherIds) {
          this.ruleForm.birthday.delVoucherIds = [];
        }
        this.ruleForm.birthday.delVoucherIds.push(
          this.ruleForm.birthday.voucherList[index].id
        );
      }
      this.ruleForm.birthday.voucherList.splice(index, 1);
    },
    //改变消费类别，切换显示状态
    equityCategoryChange(vale) {
      var itemOne = {};
      switch (vale) {
        case "birthday":
          itemOne = {
            name: "权益规则-生日赠劵",
            isactive: false
          };
          break;
        case "movie":
          itemOne = {
            name: "权益规则-影票折扣",
            isactive: false
          };
          break;
        case "goods":
          itemOne = {
            name: "权益规则-卖品折扣",
            isactive: false
          };
          break;

        case "voucher":
          itemOne = {
            name: "权益规则-代金券",
            isactive: false
          };
          break;
      }
      this.$set(this.stepData.stepList, 1, itemOne);
    },
    //添加代金劵 id列表
    addTicket() {
      var ticketOne = {
        num: "",
        outOfTime: "month",
        ticketNo: "",
        ticketType: "",
        totalNum: ""
      };
      this.ruleForm.ticketList.push(ticketOne);
    },
    //删除代金劵 id列表
    removeTicket(index) {
      if (this.ruleForm.ticketList[index].id) {
        if (!this.ruleForm.delTicketIds) {
          this.ruleForm.delTicketIds = [];
        }
        this.ruleForm.delTicketIds.push(this.ruleForm.ticketList[index].id);
      }
      this.ruleForm.ticketList.splice(index, 1);
    },
    //表单验证部分
    //代金券--销售单号验证
    checkticketListTicketNo(rule, value, callback) {
      if (!value) {
        callback(new Error("请输入代金券ID"));
      } else {
        callback();
      }
    },
    // 代金券--整数验证/绑定字段整数验证
    checkIntNum(rule, value, callback) {
      var int = /^\d+$/;
      if (!int.test(value.toString().replace(/\s/g, ""))) {
        callback(new Error("请输入整数"));
      } else if (value == 0) {
        callback(new Error("请输入正整数"));
      } else {
        callback();
      }
    },
    // 生日赠劵--兑换码数量验证
    checkcdkeyListNum(rule, value, callback) {
      var int = /^\d+$/;
      if (!int.test(value.num.toString().replace(/\s/g, ""))) {
        callback(new Error("请输入整数"));
      } else if (value.num == 0) {
        callback(new Error("请输入正整数"));
      } else {
        callback();
      }
    },
    // 生日赠劵--销售单号验证
    checkcdkeyListTicketNo(rule, value, callback) {
      if (!value.ticketNo) {
        callback(new Error("请输入销售单号"));
      } else {
        callback();
      }
    },
    // 生日赠劵--劵数量验证
    checkvoucherListNum(rule, value, callback) {
      var int = /^\d+$/;
      if (!int.test(value.num.toString().replace(/\s/g, ""))) {
        callback(new Error("请输入整数"));
      } else if (value.num == 0) {
        callback(new Error("请输入正整数"));
      } else {
        callback();
      }
    },
    // 生日赠劵--销售单号验证
    checkvoucherListTicketNo(rule, value, callback) {
      if (!value.ticketNo) {
        callback(new Error("请输入销售单号"));
      } else {
        callback();
      }
    },
    // 影城--最低价验证
    checkLowPriceMark(rule, value, callback) {
      if (value.lowPriceMark == "cinemaPay") {
        if (value.maxSubsidies.toString().replace(/\s/g, "") == "") {
          callback(new Error("请输入数字"));
        }
        if (
          !/^[1-9]$|^[1-9][0-9]{1,3}$|^[1-9][.]\d{1}$|^[1-9][0-9]{1,3}[.]\d{1}$/.test(
            value.maxSubsidies.toString().replace(/\s/g, "")
          )
        ) {
          callback(new Error("整数部分为1到9999的数字,最多一位小数"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 影票优惠--优惠限制
    checkLimitSaleData(rule, value, callback) {
      if (!value.ticketLimitSaleType == "") {
        if (value.ticketLimitSaleData.toString().replace(/\s/g, "") == "") {
          callback(new Error("请输入数字"));
        }
        if (
          !/^[1-9]\d*$/.test(
            value.ticketLimitSaleData.toString().replace(/\s/g, "")
          )
        ) {
          callback(new Error("请输入正整数"));
        }
        if (
          value.ticketLimitSaleData.toString().replace(/\s/g, "") * 1 >
          9999
        ) {
          callback(new Error("最多不能超过4位数字呦"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    // 影票优惠--优惠方式
    checkPreferentialWay(rule, value, callback) {
      if (value.ticketSaleData.toString().replace(/\s/g, "") == "") {
        callback(new Error("请输入数字"));
      }
      if (
        !/^\d+(\.\d+)?$/.test(
          value.ticketSaleData.toString().replace(/\s/g, "")
        )
      ) {
        callback(new Error("请输入正确的数字"));
      }
      //零售打折
      if (value.ticketSaleType == "discountPrice") {
        if (
          !/^[1-9][0-9]{0,1}$/.test(
            value.ticketSaleData.toString().replace(/\s/g, "")
          )
        ) {
          callback(new Error("整数部分为1到99的数字"));
        } else {
          callback();
        }
      }
      //零售价-N  固定金额
      if (
        value.ticketSaleType == "subPrice" ||
        value.ticketSaleType == "fixPrice"
      ) {
        if (
          !/^[1-9]$|^[1-9][0-9]{1,3}$|^[1-9][.]\d{1}$|^[1-9][0-9]{1,3}[.]\d{1}$/.test(
            value.ticketSaleData.toString().replace(/\s/g, "")
          )
        ) {
          callback(new Error("整数部分为1到9999的数字,最多一位小数"));
        } else {
          callback();
        }
      }
      callback();
    },
    //适用影院必填验证
    checkSaleCinema(rule, value, callback) {
      if (value.length == 0) {
        callback(new Error("适用影院必选"));
      }
      callback();
    },
    //适用卖品必填验证
    checkSaleName(rule, value, callback) {
      if (value.length == 0) {
        callback(new Error("适用卖品必选"));
      }
      callback();
    },
    // 卖品优惠--优惠方式
    checkSalePreferentialWay(rule, value, callback) {
      if (value.goodsSaleData.toString().replace(/\s/g, "") == "") {
        callback(new Error("请输入数字"));
      }
      if (
        !/^\d+(\.\d+)?$/.test(value.goodsSaleData.toString().replace(/\s/g, ""))
      ) {
        callback(new Error("请输入正确的数字"));
      }
      if (value.goodsSaleType == "discountPrice") {
        if (
          !/^[1-9][0-9]{0,1}$/.test(
            value.goodsSaleData.toString().replace(/\s/g, "")
          )
        ) {
          callback(new Error("整数部分为1到99的数字"));
        } else {
          callback();
        }
      }
      if (value.goodsSaleType == "subPrice") {
        if (
          !/^[1-9][0-9]{0,3}$|^[1-9][0-9]{0,3}[.]\d{1}$/.test(
            value.goodsSaleData.toString().replace(/\s/g, "")
          )
        ) {
          callback(new Error("整数部分为1到9999的数字,最多一位小数"));
        } else {
          callback();
        }
      }
    },
    // 适用影厅多选框是否选中
    checkHallListSelected(rule, value, callback) {
      if (!value.length) {
        callback(new Error("请选择适用影厅"));
      } else {
        callback();
      }
    },

    // 适用制式多选框是否选中
    checkScreenListSelected(rule, value, callback) {
      if (!value.length) {
        callback(new Error("请选择适用制式"));
      } else {
        callback();
      }
    },

    // 放映星期多选框是否选中
    checkWeeksSelected(rule, value, callback) {
      if (!value.length) {
        callback(new Error("请选择放映星期"));
      } else {
        callback();
      }
    },
    turnDate(str) {
      var zero = new Date();
      zero.setHours(str.split(":")[0]);
      zero.setMinutes(str.split(":")[1]);
      zero.setSeconds(str.split(":")[2]);
      return zero.getTime();
    },
    //放映时段，数据去重监测
    checkProjectionTimeCheckSame(arr) {
      var checkArr = [];
      var dataArr = arr.map((item, index) => {
        var timeInit = [];
        timeInit[0] = this.turnDate(item[0]);
        timeInit[1] = this.turnDate(item[1]);
        return timeInit;
      });
      for (let index = 0; index < arr.length; index++) {
        var action = arr[index];
        var actionStart = arr[index][0];
        var actionEnd = arr[index][1];
        if (actionStart == actionEnd) {
          return true;
        }
        for (let item = 0; item < arr.length; item++) {
          if (index != item) {
            var originStart = arr[item][0];
            var originEnd = arr[item][1];
            if (actionStart > originStart && actionStart < originEnd) {
              return true;
            }
            if (actionEnd > originStart && actionEnd < originEnd) {
              return true;
            }
            if (actionStart == originStart && actionEnd == originEnd) {
              return true;
            }
            if (actionStart == originEnd) {
              return true;
            }
          }
        }
      }
      return false;
    },
    // 放映时段
    checkProjectionTime(rule, value, callback) {
      if (value.indexOf(null) > -1) {
        callback(new Error("请选择放映时段"));
      } else {
        //重复检验
        if (this.checkProjectionTimeCheckSame(value)) {
          callback("放映时段不能重叠");
        } else {
          callback();
        }
      }
    },
    //表单验证部分结束
    //星期反处理
    dataTurnWeeks(arr) {
      if (!arr) return [];
      var timeArr = arr.split(",");
      for (var i = 0; i < timeArr.length; i++) {
        let arrOne = timeArr[i];
        timeArr[i] = arrOne - 0;
      }
      return timeArr;
    },
    //制适反处理
    dataTurnScreenList(arr) {
      if (!arr) return [];
      var newarr = this.Standards.filter((item, index, array) => {
        for (var i = 0; i < arr.length; i++) {
          if (item.screenName == arr[i].screenName) {
            return true;
          }
        }
        return false;
      });
      return newarr;
    },
    //影厅反处理
    dataTurnHallList(arr) {
      if (!arr) return [];
      var newarr = this.CinemaHalls.filter((item, index, array) => {
        for (var i = 0; i < arr.length; i++) {
          if (item.hallName == arr[i].hallName) {
            return true;
          }
        }
        return false;
      });
      return newarr;
    },
    //时间反处理
    dataTurnDayTimesJson(str) {
      if (!str) return "";
      var timeArr = str.split(" | ");
      for (var i = 0; i < timeArr.length; i++) {
        timeArr[i] = timeArr[i].split("-");
      }
      return timeArr;
    },
    //数据反处理
    dataTurnFormatDate(formatDate) {
      for (var i = 0; i < formatDate.movieList.length; i++) {
        formatDate.movieList[i].dayTimesJson = this.dataTurnDayTimesJson(
          formatDate.movieList[i].dayTimesJson
        );
        //适用影厅数据处理 图标处理
        formatDate.movieList[i].hallList = this.dataTurnHallList(
          formatDate.movieList[i].hallList
        );
        formatDate.movieList[i].isIndeterminateHallList = false;
        formatDate.movieList[i].checkAllHallList = true;
        if (
          !(
            formatDate.movieList[i].hallList.length > 0 &&
            formatDate.movieList[i].hallList.length == this.CinemaHalls.length
          )
        ) {
          formatDate.movieList[i].isIndeterminateHallList = true;
          formatDate.movieList[i].checkAllHallList = false;
        }
        //适用制式数据处理 图标处理
        formatDate.movieList[i].screenList = this.dataTurnScreenList(
          formatDate.movieList[i].screenList
        );
        formatDate.movieList[i].isIndeterminateScreenList = false;
        formatDate.movieList[i].checkAllScreenList = true;
        if (
          !(
            formatDate.movieList[i].screenList.length > 0 &&
            formatDate.movieList[i].screenList.length == this.Standards.length
          )
        ) {
          formatDate.movieList[i].isIndeterminateScreenList = true;
          formatDate.movieList[i].checkAllScreenList = false;
        }
        //星期数据反处理   状态全选 图标不分轩轾
        formatDate.movieList[i].weeks = this.dataTurnWeeks(
          formatDate.movieList[i].weeks
        );
        formatDate.movieList[i].isIndeterminateWeeks = false;
        formatDate.movieList[i].checkAllWeeks = true;

        if (
          !(
            formatDate.movieList[i].weeks.length > 0 &&
            formatDate.movieList[i].weeks.length == this.Weeks.length
          )
        ) {
          formatDate.movieList[i].isIndeterminateWeeks = true;
          formatDate.movieList[i].checkAllWeeks = false;
        }
      }
      return formatDate;
    },
    initStepData(ruleForm) {
      var stepList = [{ name: "权益信息", isactive: false }];
      var itemOne = {};
      if (ruleForm.equityType == "consumer_type") {
        switch (ruleForm.equityCategory) {
          case "birthday":
            itemOne = {
              name: "权益规则-生日赠劵",
              isactive: false
            };
            break;
          case "movie":
            itemOne = {
              name: "权益规则-影票折扣",
              isactive: false
            };
            break;
          case "goods":
            itemOne = {
              name: "权益规则-卖品折扣",
              isactive: false
            };
            break;

          case "voucher":
            itemOne = {
              name: "权益规则-代金券",
              isactive: false
            };
            break;
        }
        stepList.push(itemOne);
        this.$set(this.stepData.stepList, 1, itemOne);
      }
    },
    //获取卡详情
    getcardTypeInfo(cardId) {
      this.$crmList
        .getOwnrightsInfo({
          equityId: cardId,
          tenantId: this.$store.state.loginUser.consumerId
        })
        .then(res => {
          //卡详情分类型赋值，注册属性
          this.ruleForm.equityType = res.equityType;
          this.ruleForm.equityName = res.equityName;
          this.ruleForm.id = res.id;
          this.ruleForm.logoPic = res.logoPic;
          this.ruleForm.equityRemark = res.equityRemark;
          if (res.equityType != "consumer_type") {
            this.ruleForm.equityCategory = "movie";
          } else {
            this.ruleForm.equityCategory = res.equityCategory;
          }

          //卡详情类型选择性赋值
          if (
            res.equityType == "consumer_type" &&
            res.equityCategory == "movie"
          ) {
            this.ruleForm.movieList = this.dataTurnFormatDate(res).movieList;
          } else if (
            res.equityType == "consumer_type" &&
            res.equityCategory == "voucher"
          ) {
            this.ruleForm.ticketList = res.ticketList;
            this.selectAll(0);
          } else if (
            res.equityType == "consumer_type" &&
            res.equityCategory == "goods"
          ) {
            this.ruleForm.goods = res.goods;
            this.selectAll(0);
          } else if (
            res.equityType == "consumer_type" &&
            res.equityCategory == "birthday"
          ) {
            var birthdayCodeOrId = [];
            if (res.birthday.cdkeyList && res.birthday.cdkeyList.length > 0) {
              birthdayCodeOrId.push("兑换码");
            } else {
              var cdModel = [
                {
                  num: "",
                  ticketNo: ""
                }
              ];
              res.birthday.cdkeyList = cdModel;
            }
            if (
              res.birthday.voucherList &&
              res.birthday.voucherList.length > 0
            ) {
              birthdayCodeOrId.push("代金券");
            } else {
              var voucherListModel = [
                {
                  num: "",
                  ticketNo: ""
                }
              ];
              res.birthday.voucherList = voucherListModel;
            }
            res.birthday.birthdayCodeOrId = birthdayCodeOrId;
            this.ruleForm.birthday = res.birthday;
            this.selectAll(0);
          }
          //卡类型滚动标签注册
          this.initStepData(this.ruleForm);
        });
    },
    timeTurnStr(dayTimesJson) {
      for (var i = 0; i < dayTimesJson.length; i++) {
        dayTimesJson[i] = dayTimesJson[i].join("-");
      }
      return dayTimesJson.join(" | ");
    },
    //多余数组字段删除
    Deleteattribute(data) {
      if (data.equityType != "consumer_type") {
        delete data.birthday;
        delete data.goods;
        delete data.movieList;
        delete data.ticketList;
      } else {
        //删除多余字段
        var movieList = data.movieList;
        var goods = data.goods;
        var birthday = data.birthday;
        var ticketList = data.ticketList;
        delete data.birthday;
        delete data.goods;
        delete data.movieList;
        delete data.ticketList;
        if (data.equityCategory == "movie") {
          for (var i = 0; i < movieList.length; i++) {
            movieList[i].weeks = movieList[i].weeks.join(",");
            movieList[i].dayTimesJson = this.timeTurnStr(
              movieList[i].dayTimesJson
            );
          }
          data.movieList = movieList;
        } else if (data.equityCategory == "goods") {
          data.goods = goods;
        } else if (data.equityCategory == "voucher") {
          data.ticketList = ticketList;
        } else if (data.equityCategory == "birthday") {
          //生日赠劵属性删除
          if (birthday.birthdayCodeOrId.indexOf("兑换码") == -1) {
            delete birthday.cdkeyList;
          }
          if (birthday.birthdayCodeOrId.indexOf("代金券") == -1) {
            delete birthday.voucherList;
          }
          data.birthday = birthday;
        }
      }
      return data;
    },
    //表单提交数据处理
    dataSendBack(data) {
      data = this.Deleteattribute(data);
      return data;
    },
    // 优惠票数限制
    changeTicketLimitSaleData(val, index) {
      this.$set(this.ruleForm.movieList[index], "ticketLimitSaleData", val);
    },
    //   提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.ruleForm));
          data = this.dataSendBack(data);
          if (this.$route.query.cardId) {
            this.$crmList
              .editOwnRights(data)
              .then(res => {
                // this.loading = false;
                this.$message.success("修改成功");
                this.$router.push({
                  path: "/member/ownRights/seeOwnrightsCard",
                  query: {
                    equityId: this.$route.query.cardId,
                    tenantId: this.$store.state.loginUser.consumerId
                  }
                });
              })
              .catch(err => {
                // this.loading = false;
                this.$message.error("添加失败，请重试");
              });
          } else {
            this.$crmList
              .addOwnRights(data)
              .then(res => {
                // this.loading = false;
                this.$message.success("添加成功");
                this.$router.push({
                  path: "/member/ownRights/seeOwnrightsCard",
                  query: {
                    equityId: res.id,
                    tenantId: this.$store.state.loginUser.consumerId
                  }
                });
              })
              .catch(err => {
                // this.loading = false;
                this.$message.error("添加失败，请重试");
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.push({ path: "/member/ownRights/ownRightsList" });
    },
    //适用影厅 制式 星期 默认全选
    selectAll(index) {
      this.handleCheckAllCinemaHall(true, index);
      this.handleCheckAllStandards(true, index);
      this.handleCheckAllWeeks(true, index);
    },
    // 适用影厅
    handleCheckAllCinemaHall(val, index) {
      this.ruleForm.movieList[index].hallList = val ? this.CinemaHalls : [];
      this.ruleForm.movieList[index].isIndeterminateHallList = false;
    },
    handleCheckedCinemaHallsChange(value, index) {
      let checkedCount = value.length;
      this.ruleForm.movieList[index].checkAllHallList =
        checkedCount === this.CinemaHalls.length;
      this.ruleForm.movieList[index].isIndeterminateHallList =
        checkedCount > 0 && checkedCount < this.CinemaHalls.length;
    },
    // 适用制式
    handleCheckAllStandards(val, index) {
      this.ruleForm.movieList[index].screenList = val ? this.Standards : [];
      this.ruleForm.movieList[index].isIndeterminateScreenList = false;
    },
    handleCheckedStandardsChange(value, index) {
      let checkedCount = value.length;
      this.ruleForm.movieList[index].checkAllScreenList =
        checkedCount === this.Standards.length;
      this.ruleForm.movieList[index].isIndeterminateScreenList =
        checkedCount > 0 && checkedCount < this.Standards.length;
    },
    // 选择星期
    handleCheckAllWeeks(val, index) {
      this.ruleForm.movieList[index].weeks = val ? [1, 2, 3, 4, 5, 6, 7] : [];
      this.ruleForm.movieList[index].isIndeterminateWeeks = false;
    },
    handleCheckedWeeksChange(value, index) {
      let checkedCount = value.length;
      this.ruleForm.movieList[index].checkAllWeeks =
        checkedCount === this.Weeks.length;
      this.ruleForm.movieList[index].isIndeterminateWeeks =
        checkedCount > 0 && checkedCount < this.Weeks.length;
    },
    handleAddEquity() {
      this.ruleForm.movieList.push({
        //优惠规则
        cinemaList: [],
        dayTimesJson: [["00:00:00", "23:59:59"]],
        goodsSaleData: "",
        goodsSaleType: "discountPrice",
        hallList: [],
        lowPriceMark: "cinemaPay",
        maxSubsidies: "",
        screenList: [],
        isIndeterminateScreenList: false,
        checkAllScreenList: true,
        ticketLimitSaleData: "",
        ticketLimitSaleType: "",
        ticketSaleData: "",
        ticketSaleType: "discountPrice",
        weeks: [],
        isIndeterminateWeeks: false,
        checkAllWeeks: true,
        isIndeterminateHallList: false,
        checkAllHallList: true
      });
      this.selectAll(this.ruleForm.movieList.length - 1);
    },
    removeEquity(index, domain) {
      if (this.ruleForm.movieList[index].id) {
        if (!this.ruleForm.delMovieIds) {
          this.ruleForm.delMovieIds = [];
        }
        this.ruleForm.delMovieIds.push(this.ruleForm.movieList[index].id);
      }
      this.ruleForm.movieList.splice(index, 1);
      if (this.$route.query.cardId) {
        this.delCardProductRuleIdArray.push(domain.id);
        this.ruleForm.delCardProductRuleId = this.delCardProductRuleIdArray.join(
          ","
        );
      }
    },
    handleAddTimeInterval(index) {
      this.ruleForm.movieList[index].dayTimesJson.push([
        "00:00:00",
        "23:59:59"
      ]);
    },
    removeTimeInterval(index, indexTime, formName) {
      this.ruleForm.movieList[index].dayTimesJson.splice(indexTime, 1);
      this.$refs[formName].validate(() => {});
    }
  }
};
</script>
<style lang="scss">
.add-own-rights-type {
  width: 100%;
  .shiyong_yingyuan {
    .el-form-item__error {
      left: 105px !important;
      top: 10% !important;
    }
  }
  .cinema-list {
    float: left;
    max-width: 200px;
    min-width: 100px;
    padding-right: 20px;
    padding-left: 10px;
    margin-right: 10px;
    height: 30px;
    line-height: 30px;
    position: relative;
    display: inline-block;
    background: rgb(230, 229, 229);
    border: 1px solid #777777;
    border-radius: 4px;
    font-size: 12px;
    color: #333333;
    letter-spacing: 0;
    text-align: center;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .myclose {
      position: absolute;
      right: 2px;
      top: 8px;
      color: #3b74ff;
      font-weight: bold;
    }
  }
  // 面包屑
  .scorll-right .single-step:nth-of-type(2) {
    display: none;
  }
  .crumbs-wrap {
    padding: 0 0 20px 0;
    a.itemLink {
      font-weight: normal;
      color: #666666;
      cursor: pointer;
    }
  }
  .el-form-item__label {
    color: #666 !important;
    font-size: 12px !important;
  }
  .el-radio__label {
    font-size: 12px;
  }
  .el-input {
    font-size: 12px;
  }
  .el-checkbox__label {
    font-size: 12px;
  }
  .unit {
    font-size: 12px;
  }
  .card-type-content {
    border: 0;
    .el-input {
      width: 360px;
    }
    .el-textarea {
      width: 360px;
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
        top: 12px !important;
        left: 380px;
      }
    }
    // 开卡/充值设置
    .open-card-recharge-set {
      padding: 0 15px;
      .el-form-item__error {
        top: 12px !important;
        left: 380px;
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
        .network-channel-wrap {
          display: flex;
          .vertical-line {
            width: 1px;
            background: #666;
            height: 25px;
            margin: 8px 15px 0;
          }
          .network-channel {
            display: flex;
          }
        }
      }
    }
    // 会员卡权益
    .card-equity {
      padding: 0 15px;
      // .el-form-item__error {
      //   top: 70%;
      //   left: 13px;
      // }
      .dajinjuan {
        text-align: center;
        .el-input {
          width: 100% !important;
        }
        .font-style {
          text-align: center;
          height: 32px;
          line-height: 37px;
          font-size: 12px;
          color: #666;
        }
      }
      .equity-options {
        background: #fff;
        margin: 10px 0;
        padding: 10px 5px;
        .remove-equity {
          position: relative;
          left: 98%;
          cursor: pointer;
          color: #666;
        }
        .select-btn {
          display: inline-block;
          float: left;
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
          margin-right: 10px;
        }
      }
      .add-equity-btn {
        width: 200px;
        background: #fff;
        border-radius: 5px;
        border: 1px solid #dcdfe6;
        text-align: center;
        color: #33cc00;
        padding: 3px;
        margin-left: 100px;
        cursor: pointer;
      }
      // 影票优惠
      .ticket-discount {
        width: 80%;
        position: relative;
        .el-form-item__error {
          top: 70%;
          left: 0px;
        }
        .applicable-cinema-hall-wrap {
          margin-left: 10px;
          .applicable-cinema-hall-inner {
            // display: flex;
            .cinema-hall-selection {
              // display: flex;
              .el-form-item__content {
                display: flex;
                .el-checkbox-group {
                  margin-left: 15px;
                }
              }
            }
            .unified-setup {
              .el-input {
                width: 173px;
              }
              .week-select-wrap {
                .el-form-item__content {
                  display: flex;
                  .el-checkbox-group {
                    margin-left: 15px;
                  }
                }
              }
              .detail-time-select {
                margin-top: 12px;
                .el-button--medium {
                  padding: 8px 20px;
                }
                .el-form-item__error {
                  top: 10px;
                  left: 440px;
                }
                .detail-time-select-item {
                  margin-bottom: 5px;
                }
              }
              .ticket-preferential-way {
                .el-form-item__error {
                  top: 10px;
                  left: 360px;
                }
              }
              .ticket-preferential-restrictions-wrap {
                .el-form-item__error {
                  top: 10px;
                  left: 360px;
                }
                .el-radio {
                  margin-right: 53px;
                }
              }
              .maximum-subsidy-wrap {
                .el-form-item__error {
                  top: 10px;
                  left: 180px;
                }
              }
            }
          }
        }
      }
      //卖品优惠
      .sale-preference {
        .applicable-cinema-hall-wrap {
          margin-left: 10px;
          .applicable-cinema-hall-inner {
            // display: flex;
            .cinema-hall-selection {
              // display: flex;
              .el-form-item__content {
                display: flex;
                // .el-checkbox:first-child {
                //   margin-right: 15px;
                // }
                .el-checkbox {
                  margin-left: 15px;
                }
              }
            }
            .unified-setup {
              .el-input {
                width: 173px;
              }
              .detail-time-select {
                .detail-time-select-item {
                  margin-bottom: 5px;
                }
              }
              .sale-preference-way {
                .el-form-item__error {
                  top: 10px;
                  left: 360px;
                }
              }
              .birthday-time {
                .el-form-item__error {
                  top: 20%;
                  left: 313px;
                }
              }
              .birthday-type {
                .el-form-item__error {
                  top: 20%;
                  left: 213px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

