<template>
  <div class="_add-member-tags">
    <el-form :model="ruleForm" :rules="rules" hide-required-asterisk ref="ruleForm" size="medium" label-width="108px" label-position="left">
      <el-collapse v-model="activeNames" class="_member-label-content">
        <!-- 标签基础信息 -->
        <el-collapse-item title="标签基础信息" name="1">
          <div class="_member-label-basic-set">
            <el-form-item label="会员标签：" prop="labelName" style="position:relative">
              <span class="_label-red-star">*</span>
              <el-input v-model="ruleForm.labelName" placeholder="请输入10字以内会员标签"></el-input>
            </el-form-item>
            <el-form-item label="选择标签颜色：" prop="labelColor">
              <ul class="_label-color-wrap">
                <li v-for="(item, index) of labelColorArr" :key="index" class="_label-color-item" :class="item.color==ruleForm.labelColor?'isSelectedColor':''" :style="`background-color:${item.color}`" @click="handleSelectLabelColor(item.color)"></li>
              </ul>
            </el-form-item>
            <el-form-item label="显示预览：" prop="viewPreview">
              <div class="_view-preview-wrap" :style="`border-color:${ruleForm.labelColor}`">
                <span class="_view-preview-word" :style="`color:${ruleForm.labelColor}`">{{ruleForm.labelName?ruleForm.labelName:'标签名称'}}</span>
              </div>
            </el-form-item>
          </div>
        </el-collapse-item>
        <!-- 会员筛选条件设置 -->
        <el-collapse-item title="会员筛选条件设置" name="2">
          <div class="_member-condition-setting">
            <div class="_member-condition-head">会员筛选条件设置</div>
            <div class="_member-condition-body">
              <ul class="_member-condition-left-radio-wrap">
                <li v-for="(item, index) of selectedRadioArr" :key="index" class="_member-condition-radio" :class="item.flag==selectedRadio?'isSelectedRadio':''" @click="handleSelectRadio(item.flag)">
                  {{item.name}}<sup v-if="item.selectedNum!=0" class="_member-badge">{{item.selectedNum}}</sup></li>
              </ul>
              <div v-for="(item, index) of checkboxArr" :key="index" style="position:relative">
                <div class="_member-condition-center-checkbox-wrap" v-if="item.flag == selectedRadio">
                  <el-checkbox-group v-model="item.selectedConditions" @change="handleCheckedConditionsChange($event,item.flag)">
                    <el-checkbox v-for="condition in item.subCheckbox" :disabled="condition.code=='mobileNum'" :label="condition.code" :key="condition.code">{{condition.name}}</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
              <div class="_member-condition-right-content-wrap">
                <div class="_member-condition-right-content-inner-top">
                  <div class="_member-condition-total-desc">已选筛选条件（共{{selectedTotalArr.length}}项）：</div>
                  <el-button type="primary" plain class="clear-button-custom" @click="handleClearAll('ruleForm')">清空
                  </el-button>
                </div>
                <div class="_member-selected-condition">
                  <el-form-item label="手机号：" prop="mobileNum" v-if="itemIsShow('mobileNum')">
                    <el-radio v-model="ruleForm.mobileNum" :label="1">有</el-radio>
                  </el-form-item>
                  <el-form-item label="生日：" prop="birthday" v-if="itemIsShow('birthday')">
                    <el-date-picker v-model="ruleForm.birthday" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                  </el-form-item>
                  <el-form-item label="消费影院：" prop="cinema" v-if="itemIsShow('cinema')">
                    <div class="_consumer-cinema">
                      <el-select v-model="ruleForm.cinemaType" placeholder="请选择">
                        <el-option label="最后一次" value="lastOneTime"></el-option>
                        <el-option label="任意一次" value="anyOneTime"></el-option>
                      </el-select>
                      <div class="_select-cinema-wrap">
                        <div class="_select-cinema-btn" v-show="!(ruleForm.cinema && ruleForm.cinema.length > 0)" @click="chooseCinema">选择</div>
                        <!-- <el-popover placement="bottom-start" popper-class="_member-custom-popover-style" :visible-arrow="false"
                          width="150" trigger="hover">
                          <ul>
                            <li v-for="(item, index) of ruleForm.cinema" :key="index" style="padding:0 0 3px;">
                              {{item.cinemaName ? item.cinemaName : item.name}}
                            </li>
                          </ul> -->
                        <div slot="reference" class="cinema-list" v-show="ruleForm.cinema && ruleForm.cinema.length > 0" @mouseover="isCinemaDelete=true" @mouseout="isCinemaDelete=false">
                          {{getArrCinemaListName(ruleForm.cinema)}}
                          <i v-if="isCinemaDelete" class="el-tag__close el-icon-close myclose" @click.stop="clearSelectedCinema"></i>
                        </div>
                        <!-- </el-popover> -->
                        <div class="_edit-cinema-btn" v-show="ruleForm.cinema && ruleForm.cinema.length > 0" @click="chooseCinema">
                          编辑
                        </div>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item label="会员卡类型：" prop="cardType" v-if="itemIsShow('cardType')" class="_multiple-rows-lable">
                    <el-select v-model="ruleForm.cardType" multiple placeholder="请选择" class="_member-card-type">
                      <el-option v-for="item in cardTypeOptions" :key="item.code" :label="item.desc" :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="开卡时间：" prop="openDate" v-if="itemIsShow('openDate')">
                    <div class="_openDate-type-wrap">
                      <el-select v-model="ruleForm.openDateType" class="_openDate-type" placeholder="请选择">
                        <el-option label="固定时间" value="fixTime"></el-option>
                        <el-option label="相对时间" value="relativeTime"></el-option>
                      </el-select>
                      <el-date-picker v-if="ruleForm.openDateType=='fixTime'" class="_openDate-fix-time" v-model="ruleForm.openDateFixTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                      </el-date-picker>
                      <div class="_relative-time-detail" v-if="ruleForm.openDateType=='relativeTime'">
                        <span class="_condition-word-desc _desc-start">最近</span>
                        <el-input v-model="ruleForm.openDateRelativeTime" placeholder="请输入"></el-input>
                        <el-select v-model="ruleForm.openDateRelativeTimeUnit" placeholder="请选择">
                          <el-option label="天" value="day"></el-option>
                          <el-option label="月" value="month"></el-option>
                        </el-select>
                        <span class="_condition-word-desc _desc-end">开卡</span>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item label="卡到期时间：" prop="endTime" v-if="itemIsShow('endTime')" class="_multiple-rows-lable">
                    <div class="_openDate-type-wrap">
                      <el-select v-model="ruleForm.endTimeType" class="_openDate-type" placeholder="请选择">
                        <el-option label="固定时间" value="fixTime"></el-option>
                        <el-option label="相对时间" value="relativeTime"></el-option>
                      </el-select>
                      <el-date-picker v-if="ruleForm.endTimeType=='fixTime'" class="_openDate-fix-time" v-model="ruleForm.endTimeFixTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                      </el-date-picker>
                      <div class="_relative-time-detail" v-if="ruleForm.endTimeType=='relativeTime'">
                        <span class="_condition-word-desc _desc-start">最近</span>
                        <el-input v-model="ruleForm.endTimeRelativeTime" placeholder="请输入"></el-input>
                        <el-select v-model="ruleForm.endTimeRelativeTimeUnit" placeholder="请选择">
                          <el-option label="天" value="day"></el-option>
                          <el-option label="月" value="month"></el-option>
                        </el-select>
                        <span class="_condition-word-desc _desc-end">到期</span>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item label="储值余额：" prop="totalBalance" v-if="itemIsShow('totalBalance')">
                    <div class="_total-balance">
                      <el-input v-model="ruleForm.totalBalanceStart" placeholder="请输入"></el-input>
                      <span class="_condition-word-desc _word-zhi">至</span>
                      <el-input v-model="ruleForm.totalBalanceEnd" placeholder="请输入"></el-input>
                      <span class="_condition-word-desc _desc-end">元</span>
                    </div>
                  </el-form-item>
                  <el-form-item label="可用券名称：" prop="couponName" v-if="itemIsShow('couponName')" class="_multiple-rows-lable">
                    <div class="_select-cardType-wrap">
                      <div class="_select-cardType-btn" v-show="!(ruleForm.couponName && ruleForm.couponName.length > 0)" @click="chooseCouponName">选择
                      </div>
                      <!-- <el-popover placement="bottom-start" popper-class="_member-custom-popover-style" :visible-arrow="false"
                        width="150" trigger="hover">
                        <ul>
                          <li v-for="(item, index) of ruleForm.couponName" :key="index" style="padding:0 0 3px;">
                            {{item.couponName}}
                          </li>
                        </ul> -->
                      <div slot="reference" class="cardType-list" v-show="ruleForm.couponName && ruleForm.couponName.length > 0" @mouseover="isCouponNameDelete=true" @mouseout="isCouponNameDelete=false">
                        {{getArrCouponName(ruleForm.couponName)}}
                        <i v-if="isCouponNameDelete" class="el-tag__close el-icon-close myclose" @click.stop="clearSelectedCouponName"></i>
                      </div>
                      <!-- </el-popover> -->
                      <div class="_edit-cardType-btn" v-show="ruleForm.couponName && ruleForm.couponName.length > 0" @click="chooseCouponName">
                        编辑
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item label="消费渠道：" prop="channel" v-if="itemIsShow('channel')" class="_consumption-channels">
                    <el-select v-model="ruleForm.channel" multiple placeholder="请选择">
                      <el-option v-for="item in channelOptions" :key="item.code" :label="item.desc" :value="item.code">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="消费次数：" prop="consumeTimes" v-if="itemIsShow('consumeTimes')">
                    <div class="_three-types-wrap">
                      <el-select v-model="ruleForm.consumeTimesType" class="_three-types-select" placeholder="请选择">
                        <el-option label="任意时间" value="anyTime"></el-option>
                        <el-option label="固定时间" value="fixTime"></el-option>
                        <el-option label="相对时间" value="relativeTime"></el-option>
                      </el-select>
                      <div class="_right-content">
                        <el-date-picker v-if="ruleForm.consumeTimesType=='fixTime'" class="_openDate-fix-time" v-model="ruleForm.consumeTimesFixTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                        <div class="_relative-time-detail" v-if="ruleForm.consumeTimesType=='relativeTime'">
                          <span class="_condition-word-desc _desc-start">最近</span>
                          <el-input v-model="ruleForm.consumeTimesRelativeTime" placeholder="请输入"></el-input>
                          <el-select v-model="ruleForm.consumeTimesRelativeTimeUnit" placeholder="请选择">
                            <el-option label="天" value="day"></el-option>
                            <el-option label="月" value="month"></el-option>
                          </el-select>
                          <span class="_condition-word-desc _desc-end">内累计消费</span>
                        </div>
                        <div class="_total-balance">
                          <el-input v-model="ruleForm.consumeTimesStart" placeholder="请输入"></el-input>
                          <span class="_condition-word-desc _word-zhi">至</span>
                          <el-input v-model="ruleForm.consumeTimesEnd" placeholder="请输入"></el-input>
                          <span class="_condition-word-desc">次</span>
                        </div>
                      </div>

                    </div>
                  </el-form-item>
                  <el-form-item label="充值次数：" prop="chargeTimes" v-if="itemIsShow('chargeTimes')">
                    <div class="_three-types-wrap">
                      <el-select v-model="ruleForm.chargeTimesType" class="_three-types-select" placeholder="请选择">
                        <el-option label="任意时间" value="anyTime"></el-option>
                        <el-option label="固定时间" value="fixTime"></el-option>
                        <el-option label="相对时间" value="relativeTime"></el-option>
                      </el-select>
                      <div class="_right-content">
                        <el-date-picker v-if="ruleForm.chargeTimesType=='fixTime'" class="_openDate-fix-time" v-model="ruleForm.chargeTimesFixTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                        <div class="_relative-time-detail" v-if="ruleForm.chargeTimesType=='relativeTime'">
                          <span class="_condition-word-desc _desc-start">最近</span>
                          <el-input v-model="ruleForm.chargeTimesRelativeTime" placeholder="请输入"></el-input>
                          <el-select v-model="ruleForm.chargeTimesRelativeTimeUnit" placeholder="请选择">
                            <el-option label="天" value="day"></el-option>
                            <el-option label="月" value="month"></el-option>
                          </el-select>
                          <span class="_condition-word-desc _desc-end">内充值</span>
                        </div>
                        <div class="_total-balance">
                          <el-input v-model="ruleForm.chargeTimesStart" placeholder="请输入"></el-input>
                          <span class="_condition-word-desc _word-zhi">至</span>
                          <el-input v-model="ruleForm.chargeTimesEnd" placeholder="请输入"></el-input>
                          <span class="_condition-word-desc">次</span>
                        </div>
                      </div>

                    </div>
                  </el-form-item>
                  <el-form-item label="累计消费金额：" prop="totalConsumeAmount" v-if="itemIsShow('totalConsumeAmount')" class="_multiple-rows-lable">
                    <div class="_three-types-wrap">
                      <el-select v-model="ruleForm.totalConsumeAmountType" class="_three-types-select" placeholder="请选择">
                        <el-option label="任意时间" value="anyTime"></el-option>
                        <el-option label="固定时间" value="fixTime"></el-option>
                        <el-option label="相对时间" value="relativeTime"></el-option>
                      </el-select>
                      <div class="_right-content">
                        <el-date-picker v-if="ruleForm.totalConsumeAmountType=='fixTime'" class="_openDate-fix-time" v-model="ruleForm.totalConsumeAmountFixTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                        <div class="_relative-time-detail" v-if="ruleForm.totalConsumeAmountType=='relativeTime'">
                          <span class="_condition-word-desc _desc-start">最近</span>
                          <el-input v-model="ruleForm.totalConsumeAmountRelativeTime" placeholder="请输入"></el-input>
                          <el-select v-model="ruleForm.totalConsumeAmountRelativeTimeUnit" placeholder="请选择">
                            <el-option label="天" value="day"></el-option>
                            <el-option label="月" value="month"></el-option>
                          </el-select>
                          <span class="_condition-word-desc _desc-end">内累计消费</span>
                        </div>
                        <div class="_total-balance">
                          <el-input v-model="ruleForm.totalConsumeAmountStart" placeholder="请输入"></el-input>
                          <span class="_condition-word-desc _word-zhi">至</span>
                          <el-input v-model="ruleForm.totalConsumeAmountEnd" placeholder="请输入"></el-input>
                          <span class="_condition-word-desc _desc-end">元</span>
                        </div>
                      </div>

                    </div>
                  </el-form-item>
                  <el-form-item label="累计充值金额：" prop="totalChargeAmount" v-if="itemIsShow('totalChargeAmount')" class="_multiple-rows-lable">
                    <div class="_three-types-wrap">
                      <el-select v-model="ruleForm.totalChargeAmountType" class="_three-types-select" placeholder="请选择">
                        <el-option label="任意时间" value="anyTime"></el-option>
                        <el-option label="固定时间" value="fixTime"></el-option>
                        <el-option label="相对时间" value="relativeTime"></el-option>
                      </el-select>
                      <div class="_right-content">
                        <el-date-picker v-if="ruleForm.totalChargeAmountType=='fixTime'" class="_openDate-fix-time" v-model="ruleForm.totalChargeAmountFixTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                        <div class="_relative-time-detail" v-if="ruleForm.totalChargeAmountType=='relativeTime'">
                          <span class="_condition-word-desc _desc-start">最近</span>
                          <el-input v-model="ruleForm.totalChargeAmountRelativeTime" placeholder="请输入"></el-input>
                          <el-select v-model="ruleForm.totalChargeAmountRelativeTimeUnit" placeholder="请选择">
                            <el-option label="天" value="day"></el-option>
                            <el-option label="月" value="month"></el-option>
                          </el-select>
                          <span class="_condition-word-desc _desc-end">内累计充值</span>
                        </div>
                        <div class="_total-balance">
                          <el-input v-model="ruleForm.totalChargeAmountStart" placeholder="请输入"></el-input>
                          <span class="_condition-word-desc _word-zhi">至</span>
                          <el-input v-model="ruleForm.totalChargeAmountEnd" placeholder="请输入"></el-input>
                          <span class="_condition-word-desc _desc-end">元</span>
                        </div>
                      </div>

                    </div>
                  </el-form-item>
                  <el-form-item label="影票消费次数：" prop="movieConsumeTimes" v-if="itemIsShow('movieConsumeTimes')" class="_multiple-rows-lable">
                    <div class="_three-types-wrap">
                      <el-select v-model="ruleForm.movieConsumeTimesType" class="_three-types-select" placeholder="请选择">
                        <el-option label="任意时间" value="anyTime"></el-option>
                        <el-option label="固定时间" value="fixTime"></el-option>
                        <el-option label="相对时间" value="relativeTime"></el-option>
                      </el-select>
                      <div class="_right-content">
                        <el-date-picker v-if="ruleForm.movieConsumeTimesType=='fixTime'" class="_openDate-fix-time" v-model="ruleForm.movieConsumeTimesFixTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                        <div class="_relative-time-detail" v-if="ruleForm.movieConsumeTimesType=='relativeTime'">
                          <span class="_condition-word-desc _desc-start">最近</span>
                          <el-input v-model="ruleForm.movieConsumeTimesRelativeTime" placeholder="请输入"></el-input>
                          <el-select v-model="ruleForm.movieConsumeTimesRelativeTimeUnit" placeholder="请选择">
                            <el-option label="天" value="day"></el-option>
                            <el-option label="月" value="month"></el-option>
                          </el-select>
                          <span class="_condition-word-desc _desc-end">内影票消费</span>
                        </div>
                        <div class="_total-balance">
                          <el-input v-model="ruleForm.movieConsumeTimesStart" placeholder="请输入"></el-input>
                          <span class="_condition-word-desc _word-zhi">至</span>
                          <el-input v-model="ruleForm.movieConsumeTimesEnd" placeholder="请输入"></el-input>
                          <span class="_condition-word-desc">次</span>
                        </div>
                      </div>

                    </div>
                  </el-form-item>
                  <el-form-item label="影票消费金额：" prop="movieConsumeAmount" v-if="itemIsShow('movieConsumeAmount')" class="_multiple-rows-lable">
                    <div class="_three-types-wrap">
                      <el-select v-model="ruleForm.movieConsumeAmountType" class="_three-types-select" placeholder="请选择">
                        <el-option label="任意时间" value="anyTime"></el-option>
                        <el-option label="固定时间" value="fixTime"></el-option>
                        <el-option label="相对时间" value="relativeTime"></el-option>
                      </el-select>
                      <div class="_right-content">
                        <el-date-picker v-if="ruleForm.movieConsumeAmountType=='fixTime'" class="_openDate-fix-time" v-model="ruleForm.movieConsumeAmountFixTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                        <div class="_relative-time-detail" v-if="ruleForm.movieConsumeAmountType=='relativeTime'">
                          <span class="_condition-word-desc _desc-start">最近</span>
                          <el-input v-model="ruleForm.movieConsumeAmountRelativeTime" placeholder="请输入"></el-input>
                          <el-select v-model="ruleForm.movieConsumeAmountRelativeTimeUnit" placeholder="请选择">
                            <el-option label="天" value="day"></el-option>
                            <el-option label="月" value="month"></el-option>
                          </el-select>
                          <span class="_condition-word-desc _desc-end">内影票消费</span>
                        </div>
                        <div class="_total-balance">
                          <el-input v-model="ruleForm.movieConsumeAmountStart" placeholder="请输入"></el-input>
                          <span class="_condition-word-desc _word-zhi">至</span>
                          <el-input v-model="ruleForm.movieConsumeAmountEnd" placeholder="请输入"></el-input>
                          <span class="_condition-word-desc _desc-end">元</span>
                        </div>
                      </div>

                    </div>
                  </el-form-item>
                  <el-form-item label="卖品消费次数：" prop="shopConsumeTimes" v-if="itemIsShow('shopConsumeTimes')" class="_multiple-rows-lable">
                    <div class="_three-types-wrap">
                      <el-select v-model="ruleForm.shopConsumeTimesType" class="_three-types-select" placeholder="请选择">
                        <el-option label="任意时间" value="anyTime"></el-option>
                        <el-option label="固定时间" value="fixTime"></el-option>
                        <el-option label="相对时间" value="relativeTime"></el-option>
                      </el-select>
                      <div class="_right-content">
                        <el-date-picker v-if="ruleForm.shopConsumeTimesType=='fixTime'" class="_openDate-fix-time" v-model="ruleForm.shopConsumeTimesFixTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                        <div class="_relative-time-detail" v-if="ruleForm.shopConsumeTimesType=='relativeTime'">
                          <span class="_condition-word-desc _desc-start">最近</span>
                          <el-input v-model="ruleForm.shopConsumeTimesRelativeTime" placeholder="请输入"></el-input>
                          <el-select v-model="ruleForm.shopConsumeTimesRelativeTimeUnit" placeholder="请选择">
                            <el-option label="天" value="day"></el-option>
                            <el-option label="月" value="month"></el-option>
                          </el-select>
                          <span class="_condition-word-desc _desc-end">内卖品消费</span>
                        </div>
                        <div class="_total-balance">
                          <el-input v-model="ruleForm.shopConsumeTimesStart" placeholder="请输入"></el-input>
                          <span class="_condition-word-desc _word-zhi">至</span>
                          <el-input v-model="ruleForm.shopConsumeTimesEnd" placeholder="请输入"></el-input>
                          <span class="_condition-word-desc">次</span>
                        </div>
                      </div>

                    </div>
                  </el-form-item>
                  <el-form-item label="卖品消费金额：" prop="shopConsumeAmount" v-if="itemIsShow('shopConsumeAmount')" class="_multiple-rows-lable">
                    <div class="_three-types-wrap">
                      <el-select v-model="ruleForm.shopConsumeAmountType" class="_three-types-select" placeholder="请选择">
                        <el-option label="任意时间" value="anyTime"></el-option>
                        <el-option label="固定时间" value="fixTime"></el-option>
                        <el-option label="相对时间" value="relativeTime"></el-option>
                      </el-select>
                      <div class="_right-content">
                        <el-date-picker v-if="ruleForm.shopConsumeAmountType=='fixTime'" class="_openDate-fix-time" v-model="ruleForm.shopConsumeAmountFixTime" type="daterange" value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                        <div class="_relative-time-detail" v-if="ruleForm.shopConsumeAmountType=='relativeTime'">
                          <span class="_condition-word-desc _desc-start">最近</span>
                          <el-input v-model="ruleForm.shopConsumeAmountRelativeTime" placeholder="请输入"></el-input>
                          <el-select v-model="ruleForm.shopConsumeAmountRelativeTimeUnit" placeholder="请选择">
                            <el-option label="天" value="day"></el-option>
                            <el-option label="月" value="month"></el-option>
                          </el-select>
                          <span class="_condition-word-desc _desc-end">内卖品消费</span>
                        </div>
                        <div class="_total-balance">
                          <el-input v-model="ruleForm.shopConsumeAmountStart" placeholder="请输入"></el-input>
                          <span class="_condition-word-desc _word-zhi">至</span>
                          <el-input v-model="ruleForm.shopConsumeAmountEnd" placeholder="请输入"></el-input>
                          <span class="_condition-word-desc _desc-end">元</span>
                        </div>
                      </div>
                    </div>
                  </el-form-item>
                  <el-form-item label="距上次消费天数：" prop="lastConsume" v-if="itemIsShow('lastConsume')" class="_multiple-rows-lable">
                    <div class="_openDate-type-wrap">
                      <span class="_condition-word-desc _desc-start">距上次</span>
                      <el-input v-model="ruleForm.lastConsumeStart" placeholder="请输入"></el-input>
                      <span class="_condition-word-desc _word-zhi">至</span>
                      <el-input v-model="ruleForm.lastConsumeEnd" placeholder="请输入"></el-input>
                      <span class="_condition-word-desc _desc-end">天</span>
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
          <!-- 筛选相关 -->
          <div class="_screening-conditions-wrap">
            <el-form-item label="条件筛选规则：" prop="filterCondition">
              <el-radio v-model="ruleForm.filterCondition" label="all">满足以上所有条件</el-radio>
            </el-form-item>
            <!-- <el-form-item label="符合条件人数：" prop="filterCondition">
              <div class="_qualified-number-wrap">
                <el-button type="primary" class="_calculation-btn" @click="handleCalculation(50,1000)">计算</el-button>
                <div class="_qualified-number-desc">
                  该群体人数：{{ruleForm.numberPeople}}，占总人数：{{ruleForm.percent}}%
                </div>
              </div>
            </el-form-item> -->
          </div>
        </el-collapse-item>
      </el-collapse>
      <el-form-item style="textAlign:center">
        <el-button type="primary" @click="submitForm('ruleForm')" class="_el-btn-custom _member-add-edit-save-btn">保存
        </el-button>
        <el-button @click="handleCancelAddLabel" class="_el-btn-custom">取消</el-button>
      </el-form-item>
    </el-form>
    <fixStepTool :stepData="stepData.stepList" class="_fixsteptool-member"></fixStepTool>
    <!-- 使用影院弹层 -->
    <frameMultiCinema :dialogVisible.sync="dialogVisible" :innerCinemaMultiData="{type:2}" :disabledData="[]" :reviewData="innerCinemaMultiData" @frameCinemaDialogCallBack="handleCallBack" />
    <!-- 可用券名称弹层 -->
    <crmAvailableCoupon :dialogVisible.sync="CouponNameDialogVisible" :reviewData="innerCouponNameMultiData" @crmAvailableCouponDialogCallBack="handleCouponNameCallback" />
  </div>
</template>
<script>
import FixStepTool from '../../../components/fix-step-tool/fix-step-tool';
import fixStepMixin from '../../../mixins/CRM/fixStepTool.js';
// import frameMultiCinema from "../../../../frame_cpm/dialogs/cinemaDialog/multiCinema2.vue";
import crmAvailableCoupon from '../../../dialogs/crmAvailableCoupon';

const { multiCinema2 } = requireModule('base');

export default {
  name: 'addMemberTags',
  data () {
    // 公共方法-验证范围
    let checkRange = (flag, start, end, callback) => {
      let name = '';
      switch (flag) {
        case 'totalBalance':
          name = '储值余额';
          break;
        case 'consumeTimes':
          name = '消费次数';
          break;
        case 'chargeTimes':
          name = '充值次数';
          break;
        case 'totalConsumeAmount':
          name = '累计消费金额';
          break;
        case 'totalChargeAmount':
          name = '累计充值金额';
          break;
        case 'movieConsumeTimes':
          name = '影票消费次数';
          break;
        case 'movieConsumeAmount':
          name = '影票消费金额';
          break;
        case 'shopConsumeTimes':
          name = '卖品消费次数';
          break;
        case 'shopConsumeAmount':
          name = '卖品消费金额';
          break;
        case 'lastConsume':
          name = '距上次消费天数';
          break;
      }
      if (start == '' && end == '') {
        callback(new Error('请输入数字'));
      } else if (start == '' && end != '') {
        if (!/^[1-9]\d*$/.test(end)) {
          callback(new Error('请输入正整数'));
        } else {
          callback(new Error(`请输入${name}最小值`));
        }
      } else if (start != '' && end == '') {
        if (!/^[1-9]\d*$/.test(start)) {
          callback(new Error('请输入正整数'));
        } else {
          callback(new Error(`请输入${name}最大值`));
        }
      } else if (start != '' && end != '') {
        if (!/^[1-9]\d*$/.test(start)) {
          callback(new Error('请输入正整数'));
        }
        if (!/^[1-9]\d*$/.test(end)) {
          callback(new Error('请输入正整数'));
        }
        if (start * 1 > 99999999) {
          callback(new Error('最多不能超过8位数字'));
        }
        if (end * 1 > 99999999) {
          callback(new Error('最多不能超过8位数字'));
        }
        if (start * 1 >= end * 1) {
          callback(new Error(`${name}最小值必须小于最大值`));
        } else {
          callback();
        }
      }
    };
    // 公共方法-判断类型
    var judgType = (flag, start, end, type, fTime, rTime, callback) => {
      if (type == 'anyTime') {
        checkRange(flag, start, end, callback);
      } else if (type == 'fixTime') {
        if (fTime == null || fTime == '') {
          fTime == [];
        }
        if (fTime.length == 0) {
          callback(new Error('请选择时间'));
        } else {
          checkRange(flag, start, end, callback);
        }
      } else if (type == 'relativeTime') {
        if (rTime == '') {
          callback(new Error('请输入数字'));
        }
        if (!/^[1-9]\d*$/.test(rTime)) {
          callback(new Error('请输入正整数'));
        }
        if (rTime * 1 > 99999999) {
          callback(new Error('最多不能超过8位数字'));
        } else {
          checkRange(flag, start, end, callback);
        }
      }
    };
    // 输入限制正则
    var testName = /^[\u4e00-\u9fa50-9a-zA-Z\s\~\`\·\！\!\@\#\￥\%\^\……\&\*\（\）\——\-\+\=\【\】\{\}\|\、\\\：\；\:\;\“\”\‘\’\'\"\[\]\{\}\<\,\>\.\《\》\，\。\？\、\?\/\(\)\_]+$/;

    // 验证卡政策名称
    var checkLabelName = (rule, value, callback) => {
      if (!value.toString().trim()) {
        callback(new Error('请输入标签名称'));
      } else if (!testName.test(value.toString().trim())) {
        callback(new Error('输入的名称含有不合法字符'));
      } else {
        // callback();
        // 名称唯一性校验;
        this.$crmList
          .labelCheckIfNameRepeat({
            labelName: value.toString().trim(),
            labelId: this.$route.query.labelId ? this.$route.query.labelId : '',
            tenantId: this.$store.state.loginUser.consumerId
          })
          .then(data => {
            if (data) {
              callback(new Error('该名称已存在，请更换其他名称'));
            } else {
              this.ruleForm.labelName = value.toString().trim();
              callback();
            }
          })
          .catch(err => console.log(err));
      }
    };
    // 校验影院
    var checkCinema = (rule, value, callback) => {
      if (value == null || value == '') {
        value = [];
      }
      if (value.length == 0) {
        callback(new Error('请选择消费影院'));
      } else {
        callback();
      }
    };
    // 校验卡类型
    var checkCardType = (rule, value, callback) => {
      if (value == null || value == '') {
        value = [];
      }
      if (value.length == 0) {
        callback(new Error('请选择会员卡类型'));
      } else {
        callback();
      }
    };
    // 校验开卡日期
    var checkOpenDate = (rule, value, callback) => {
      if (this.ruleForm.openDateType == 'fixTime') {
        if (
          this.ruleForm.openDateFixTime.length == null ||
          this.ruleForm.openDateFixTime.length == ''
        ) {
          this.ruleForm.openDateFixTime.length == [];
        }
        if (this.ruleForm.openDateFixTime.length == 0) {
          callback(new Error('请选择开卡时间'));
        } else {
          callback();
        }
      } else if (this.ruleForm.openDateType == 'relativeTime') {
        if (
          this.ruleForm.openDateRelativeTime.toString().replace(/\s/g, '') == ''
        ) {
          callback(new Error('请输入数字'));
        }
        if (
          !/^[1-9]\d*$/.test(
            this.ruleForm.openDateRelativeTime.toString().replace(/\s/g, '')
          )
        ) {
          callback(new Error('请输入正整数'));
        }
        if (
          this.ruleForm.openDateRelativeTime.toString().replace(/\s/g, '') * 1 >
          99999999
        ) {
          callback(new Error('最多不能超过8位数字'));
        } else {
          callback();
        }
      }
    };
    // 验证卡到期时间
    var checkEndTime = (rule, value, callback) => {
      if (this.ruleForm.endTimeType == 'fixTime') {
        if (
          this.ruleForm.endTimeFixTime.length == null ||
          this.ruleForm.endTimeFixTime.length == ''
        ) {
          this.ruleForm.endTimeFixTime.length == [];
        }
        if (this.ruleForm.endTimeFixTime.length == 0) {
          callback(new Error('请选择卡到期时间'));
        } else {
          callback();
        }
      } else if (this.ruleForm.endTimeType == 'relativeTime') {
        if (
          this.ruleForm.endTimeRelativeTime.toString().replace(/\s/g, '') == ''
        ) {
          callback(new Error('请输入数字'));
        }
        if (
          !/^[1-9]\d*$/.test(
            this.ruleForm.endTimeRelativeTime.toString().replace(/\s/g, '')
          )
        ) {
          callback(new Error('请输入正整数'));
        }
        if (
          this.ruleForm.endTimeRelativeTime.toString().replace(/\s/g, '') * 1 >
          99999999
        ) {
          callback(new Error('最多不能超过8位数字'));
        } else {
          callback();
        }
      }
    };
    // 储值余额
    var checkTotalBalance = (rule, value, callback) => {
      let tStart = this.ruleForm.totalBalanceStart
        .toString()
        .replace(/\s/g, '');
      let tEnd = this.ruleForm.totalBalanceEnd.toString().replace(/\s/g, '');
      checkRange('totalBalance', tStart, tEnd, callback);
    };
    // 校验可用券
    var checkCouponName = (rule, value, callback) => {
      if (value == null || value == '') {
        value = [];
      }
      if (value.length == 0) {
        callback(new Error('请选择可用券'));
      } else {
        callback();
      }
    };
    // 验证消费渠道
    var checkChannel = (rule, value, callback) => {
      if (value == null || value == '') {
        value = [];
      }
      if (value.length == 0) {
        callback(new Error('请选择消费渠道'));
      } else {
        callback();
      }
    };
    // 验证消费次数
    var checkConsumeTimes = (rule, value, callback) => {
      let ctStart = this.ruleForm.consumeTimesStart
        .toString()
        .replace(/\s/g, '');
      let ctEnd = this.ruleForm.consumeTimesEnd.toString().replace(/\s/g, '');
      let ctType = this.ruleForm.consumeTimesType;
      let ctFTime = this.ruleForm.consumeTimesFixTime;
      let ctrTime = this.ruleForm.consumeTimesRelativeTime
        .toString()
        .replace(/\s/g, '');
      judgType(
        'consumeTimes',
        ctStart,
        ctEnd,
        ctType,
        ctFTime,
        ctrTime,
        callback
      );
    };
    // 验证充值次数
    var checkChargeTimes = (rule, value, callback) => {
      let ctStart = this.ruleForm.chargeTimesStart
        .toString()
        .replace(/\s/g, '');
      let ctEnd = this.ruleForm.chargeTimesEnd.toString().replace(/\s/g, '');
      let ctType = this.ruleForm.chargeTimesType;
      let ctFTime = this.ruleForm.chargeTimesFixTime;
      let ctrTime = this.ruleForm.chargeTimesRelativeTime
        .toString()
        .replace(/\s/g, '');
      judgType(
        'chargeTimes',
        ctStart,
        ctEnd,
        ctType,
        ctFTime,
        ctrTime,
        callback
      );
    };
    // 验证累计消费金额
    var checkTotalConsumeAmount = (rule, value, callback) => {
      let ctStart = this.ruleForm.totalConsumeAmountStart
        .toString()
        .replace(/\s/g, '');
      let ctEnd = this.ruleForm.totalConsumeAmountEnd
        .toString()
        .replace(/\s/g, '');
      let ctType = this.ruleForm.totalConsumeAmountType;
      let ctFTime = this.ruleForm.totalConsumeAmountFixTime;
      let ctrTime = this.ruleForm.totalConsumeAmountRelativeTime
        .toString()
        .replace(/\s/g, '');
      judgType(
        'totalConsumeAmount',
        ctStart,
        ctEnd,
        ctType,
        ctFTime,
        ctrTime,
        callback
      );
    };
    // 验证累计充值金额
    var checkTotalChargeAmount = (rule, value, callback) => {
      let ctStart = this.ruleForm.totalChargeAmountStart
        .toString()
        .replace(/\s/g, '');
      let ctEnd = this.ruleForm.totalChargeAmountEnd
        .toString()
        .replace(/\s/g, '');
      let ctType = this.ruleForm.totalChargeAmountType;
      let ctFTime = this.ruleForm.totalChargeAmountFixTime;
      let ctrTime = this.ruleForm.totalChargeAmountRelativeTime
        .toString()
        .replace(/\s/g, '');
      judgType(
        'totalChargeAmount',
        ctStart,
        ctEnd,
        ctType,
        ctFTime,
        ctrTime,
        callback
      );
    };
    // 验证影票消费次数
    var checkMovieConsumeTimes = (rule, value, callback) => {
      let ctStart = this.ruleForm.movieConsumeTimesStart
        .toString()
        .replace(/\s/g, '');
      let ctEnd = this.ruleForm.movieConsumeTimesEnd
        .toString()
        .replace(/\s/g, '');
      let ctType = this.ruleForm.movieConsumeTimesType;
      let ctFTime = this.ruleForm.movieConsumeTimesFixTime;
      let ctrTime = this.ruleForm.movieConsumeTimesRelativeTime
        .toString()
        .replace(/\s/g, '');
      judgType(
        'movieConsumeTimes',
        ctStart,
        ctEnd,
        ctType,
        ctFTime,
        ctrTime,
        callback
      );
    };
    // 验证影票消费金额
    var checkMovieConsumeAmount = (rule, value, callback) => {
      let ctStart = this.ruleForm.movieConsumeAmountStart
        .toString()
        .replace(/\s/g, '');
      let ctEnd = this.ruleForm.movieConsumeAmountEnd
        .toString()
        .replace(/\s/g, '');
      let ctType = this.ruleForm.movieConsumeAmountType;
      let ctFTime = this.ruleForm.movieConsumeAmountFixTime;
      let ctrTime = this.ruleForm.movieConsumeAmountRelativeTime
        .toString()
        .replace(/\s/g, '');
      judgType(
        'movieConsumeAmount',
        ctStart,
        ctEnd,
        ctType,
        ctFTime,
        ctrTime,
        callback
      );
    };
    // 验证卖品消费次数
    var checkShopConsumeTimes = (rule, value, callback) => {
      let ctStart = this.ruleForm.shopConsumeTimesStart
        .toString()
        .replace(/\s/g, '');
      let ctEnd = this.ruleForm.shopConsumeTimesEnd
        .toString()
        .replace(/\s/g, '');
      let ctType = this.ruleForm.shopConsumeTimesType;
      let ctFTime = this.ruleForm.shopConsumeTimesFixTime;
      let ctrTime = this.ruleForm.shopConsumeTimesRelativeTime
        .toString()
        .replace(/\s/g, '');
      judgType(
        'shopConsumeTimes',
        ctStart,
        ctEnd,
        ctType,
        ctFTime,
        ctrTime,
        callback
      );
    };
    // 验证卖品消费金额
    var checkShopConsumeAmount = (rule, value, callback) => {
      let ctStart = this.ruleForm.shopConsumeAmountStart
        .toString()
        .replace(/\s/g, '');
      let ctEnd = this.ruleForm.shopConsumeAmountEnd
        .toString()
        .replace(/\s/g, '');
      let ctType = this.ruleForm.shopConsumeAmountType;
      let ctFTime = this.ruleForm.shopConsumeAmountFixTime;
      let ctrTime = this.ruleForm.shopConsumeAmountRelativeTime
        .toString()
        .replace(/\s/g, '');
      judgType(
        'shopConsumeAmount',
        ctStart,
        ctEnd,
        ctType,
        ctFTime,
        ctrTime,
        callback
      );
    };
    // 验证距上次消费天数
    var checkLastConsume = (rule, value, callback) => {
      let tStart = this.ruleForm.lastConsumeStart.toString().replace(/\s/g, '');
      let tEnd = this.ruleForm.lastConsumeEnd.toString().replace(/\s/g, '');
      checkRange('lastConsume', tStart, tEnd, callback);
    };

    return {
      isCinemaDelete: false, // 消费影院删除按钮
      dialogVisible: false, // 消费影院dialog
      innerCinemaMultiData: [], // 影院回显数组
      isCouponNameDelete: false, // 可用券名称删除按钮
      CouponNameDialogVisible: false, // 可用券名称dialog
      innerCouponNameMultiData: [], // 可用券名称回显数据
      ruleForm: {
        tenantId: this.$store.state.loginUser.consumerId, // 租户id
        labelName: '', // 会员标签名称
        labelColor: '#666', // 会员标签颜色
        mobileNum: 1, // 手机号
        birthday: [], // 生日
        cinemaType: 'lastOneTime', // 消费影院的conditionType
        cinema: [], // 所选消费影院
        cardType: [], // 卡类型
        openDateType: 'fixTime', // 开卡时间类型
        openDateFixTime: [], // 开卡固定时间
        openDateRelativeTime: '', // 开卡相对时间
        openDateRelativeTimeUnit: 'day', // 开卡相对时间单位
        endTimeType: 'fixTime', // 卡到期时间类型
        endTimeFixTime: [], // 卡到期固定时间
        endTimeRelativeTime: '', // 卡到期相对时间
        endTimeRelativeTimeUnit: 'day', // 卡到期相对时间单位
        totalBalanceStart: '', // 储值余额下限
        totalBalanceEnd: '', // 储值余额上限
        couponName: [], // 可用券名称
        channel: [], // 可售渠道
        consumeTimesType: 'anyTime', // 消费次数类型
        consumeTimesStart: '', // 消费次数下限
        consumeTimesEnd: '', // 消费次数上限
        consumeTimesFixTime: [], // 消费次数固定时间
        consumeTimesRelativeTime: '', // 消费次数相对时间
        consumeTimesRelativeTimeUnit: 'day', // 消费次数相对时间单位
        chargeTimesType: 'anyTime', // 充值次数类型
        chargeTimesStart: '', // 充值次数下限
        chargeTimesEnd: '', // 充值次数上限
        chargeTimesFixTime: [], // 充值次数固定时间
        chargeTimesRelativeTime: '', // 充值次数相对时间
        chargeTimesRelativeTimeUnit: 'day', // 充值次数相对时间单位
        totalConsumeAmountType: 'anyTime', // 累计消费金额类型
        totalConsumeAmountStart: '', // 累计消费金额下限
        totalConsumeAmountEnd: '', // 累计消费金额上限
        totalConsumeAmountFixTime: [], // 累计消费金额固定时间
        totalConsumeAmountRelativeTime: '', // 累计消费金额相对时间
        totalConsumeAmountRelativeTimeUnit: 'day', // 累计消费金额相对时间单位
        totalChargeAmountType: 'anyTime', // 累计充值金额类型
        totalChargeAmountStart: '', // 累计充值金额下限
        totalChargeAmountEnd: '', // 累计充值金额上限
        totalChargeAmountFixTime: [], // 累计充值金额固定时间
        totalChargeAmountRelativeTime: '', // 累计充值金额相对时间
        totalChargeAmountRelativeTimeUnit: 'day', // 累计充值金额相对时间单位
        movieConsumeTimesType: 'anyTime', // 影票消费次数类型
        movieConsumeTimesStart: '', // 影票消费次数下限
        movieConsumeTimesEnd: '', // 影票消费次数上限
        movieConsumeTimesFixTime: [], // 影票消费次数固定时间
        movieConsumeTimesRelativeTime: '', // 影票消费次数相对时间
        movieConsumeTimesRelativeTimeUnit: 'day', // 影票消费次数相对时间单位
        movieConsumeAmountType: 'anyTime', // 影票消费金额类型
        movieConsumeAmountStart: '', // 影票消费金额下限
        movieConsumeAmountEnd: '', // 影票消费金额上限
        movieConsumeAmountFixTime: [], // 影票消费金额固定时间
        movieConsumeAmountRelativeTime: '', // 影票消费金额相对时间
        movieConsumeAmountRelativeTimeUnit: 'day', // 影票消费金额相对时间单位
        shopConsumeTimesType: 'anyTime', // 卖品消费次数类型
        shopConsumeTimesStart: '', // 卖品消费次数下限
        shopConsumeTimesEnd: '', // 卖品消费次数上限
        shopConsumeTimesFixTime: [], // 卖品消费次数固定时间
        shopConsumeTimesRelativeTime: '', // 卖品消费次数相对时间
        shopConsumeTimesRelativeTimeUnit: 'day', // 卖品消费次数相对时间单位
        shopConsumeAmountType: 'anyTime', // 卖品消费金额类型
        shopConsumeAmountStart: '', // 卖品消费金额下限
        shopConsumeAmountEnd: '', // 卖品消费金额上限
        shopConsumeAmountFixTime: [], // 卖品消费金额固定时间
        shopConsumeAmountRelativeTime: '', // 卖品消费金额相对时间
        shopConsumeAmountRelativeTimeUnit: 'day', // 卖品消费金额相对时间单位
        lastConsumeStart: '', // 距上次消费天数下限
        lastConsumeEnd: '', // 距上次消费天数上限
        filterCondition: 'all' // 条件筛选规则
        // numberPeople: 0, //符合筛选群体数
        // percent: 0 //筛选人群占比
      },
      rules: {
        labelName: [
          { max: 10, message: '长度不可超过10个字符', trigger: 'blur' },
          { required: true, validator: checkLabelName, trigger: 'blur' }
        ],
        birthday: [{ required: true, message: '请选择生日', trigger: 'blur' }],
        cinema: [{ required: true, validator: checkCinema, trigger: 'change' }],
        cardType: [
          { required: true, validator: checkCardType, trigger: 'change' }
        ],
        openDate: [
          { required: true, validator: checkOpenDate, trigger: 'blur' }
        ],
        endTime: [{ required: true, validator: checkEndTime, trigger: 'blur' }],
        totalBalance: [
          { required: true, validator: checkTotalBalance, trigger: 'blur' }
        ],
        couponName: [
          { required: true, validator: checkCouponName, trigger: 'blur' }
        ],
        channel: [
          { required: true, validator: checkChannel, trigger: 'change' }
        ],
        consumeTimes: [
          { required: true, validator: checkConsumeTimes, trigger: 'blur' }
        ],
        chargeTimes: [
          { required: true, validator: checkChargeTimes, trigger: 'blur' }
        ],
        totalConsumeAmount: [
          {
            required: true,
            validator: checkTotalConsumeAmount,
            trigger: 'blur'
          }
        ],
        totalChargeAmount: [
          { required: true, validator: checkTotalChargeAmount, trigger: 'blur' }
        ],
        movieConsumeTimes: [
          { required: true, validator: checkMovieConsumeTimes, trigger: 'blur' }
        ],
        movieConsumeAmount: [
          {
            required: true,
            validator: checkMovieConsumeAmount,
            trigger: 'blur'
          }
        ],
        shopConsumeTimes: [
          { required: true, validator: checkShopConsumeTimes, trigger: 'blur' }
        ],
        shopConsumeAmount: [
          { required: true, validator: checkShopConsumeAmount, trigger: 'blur' }
        ],
        lastConsume: [
          { required: true, validator: checkLastConsume, trigger: 'blur' }
        ]
      },
      channelOptions: [], // 可售渠道
      cardTypeOptions: [], // 会员卡类型
      selectedTotalArr: ['mobileNum'], // 已筛选条件数组
      selectedRadio: 'memberInfo', // 所选的筛选条件父类
      // 所选的筛选条件父类的数组
      selectedRadioArr: [
        { name: '会员资料', flag: 'memberInfo', selectedNum: 1 },
        { name: '会员账户', flag: 'memberAccount', selectedNum: 0 },
        { name: '交易数据', flag: 'transactionData', selectedNum: 0 }
      ],
      // 所选筛选条件子类数组
      checkboxArr: [
        {
          subCheckbox: [
            { name: '手机号', code: 'mobileNum' },
            { name: '生日', code: 'birthday' },
            { name: '消费影院', code: 'cinema' }
          ],
          selectedConditions: ['mobileNum'],
          flag: 'memberInfo'
        },
        {
          subCheckbox: [
            { name: '会员卡类型', code: 'cardType' },
            { name: '开卡时间', code: 'openDate' },
            { name: '卡到期时间', code: 'endTime' },
            { name: '储值余额', code: 'totalBalance' },
            { name: '可用券名称', code: 'couponName' }
          ],
          selectedConditions: [],
          flag: 'memberAccount'
        },
        {
          subCheckbox: [
            { name: '消费渠道', code: 'channel' },
            { name: '消费次数', code: 'consumeTimes' },
            { name: '充值次数', code: 'chargeTimes' },
            { name: '累计消费金额', code: 'totalConsumeAmount' },
            { name: '累计充值金额', code: 'totalChargeAmount' },
            { name: '影票消费次数', code: 'movieConsumeTimes' },
            { name: '影票消费金额', code: 'movieConsumeAmount' },
            { name: '卖品消费次数', code: 'shopConsumeTimes' },
            { name: '卖品消费金额', code: 'shopConsumeAmount' },
            { name: '距上次消费天数', code: 'lastConsume' }
          ],
          selectedConditions: [],
          flag: 'transactionData'
        }
      ],
      // 标签颜色预定义数组
      labelColorArr: [
        { color: '#FF1E78' },
        { color: '#3C83FC' },
        { color: '#C191E8' },
        { color: '#F57E4F' },
        { color: '#35C635' },
        { color: '#1D03FF' },
        { color: '#40ADBF' },
        { color: '#F74701' },
        { color: '#C59300' },
        { color: '#F83BC6' }
      ],
      activeNames: ['1', '2'],
      stepData: {
        stepEl: '.el-collapse-item',
        stepList: [
          {
            name: '标签基础信息',
            isactive: false
          },
          {
            name: '会员筛选条件设置',
            isactive: false
          }
        ]
      }
    };
  },
  mounted () {
    let p1 = this.getCardTypeList();
    let p2 = this.getChannelList();
    Promise.all([p1, p2])
      .then(() => {
        if (this.$route.query.labelId) {
          let params = {
            tenantId: this.$store.state.loginUser.consumerId,
            labelId: this.$route.query.labelId
          };
          this.$crmList.labelGetDetail(params).then(res => {
            // 反处理详情数据
            this.reverseProcessingData(res);
          });
        }
      })
      .catch(reason => {
        if (this.$route.query.labelId) {
          let params = {
            tenantId: this.$store.state.loginUser.consumerId,
            labelId: this.$route.query.labelId
          };
          this.$crmList.labelGetDetail(params).then(res => {
            // 反处理详情数据
            this.reverseProcessingData(res);
          });
        }
      });
  },
  components: {
    fixStepTool: FixStepTool,
    frameMultiCinema: multiCinema2,
    crmAvailableCoupon
  },
  mixins: [fixStepMixin],
  watch: {
    'ruleForm.openDateType': {
      handler (newName, oldName) {
        if (newName != oldName) {
          this.$refs['ruleForm'].clearValidate('openDate');
        }
      }
    },
    'ruleForm.endTimeType': {
      handler (newName, oldName) {
        if (newName != oldName) {
          this.$refs['ruleForm'].clearValidate('endTime');
        }
      }
    },
    'ruleForm.consumeTimesType': {
      handler (newName, oldName) {
        if (newName != oldName) {
          this.$refs['ruleForm'].clearValidate('consumeTimes');
        }
      }
    },
    'ruleForm.chargeTimesType': {
      handler (newName, oldName) {
        if (newName != oldName) {
          this.$refs['ruleForm'].clearValidate('chargeTimes');
        }
      }
    },
    'ruleForm.totalConsumeAmountType': {
      handler (newName, oldName) {
        if (newName != oldName) {
          this.$refs['ruleForm'].clearValidate('totalConsumeAmount');
        }
      }
    },
    'ruleForm.totalChargeAmountType': {
      handler (newName, oldName) {
        if (newName != oldName) {
          this.$refs['ruleForm'].clearValidate('totalChargeAmount');
        }
      }
    },
    'ruleForm.movieConsumeTimesType': {
      handler (newName, oldName) {
        if (newName != oldName) {
          this.$refs['ruleForm'].clearValidate('movieConsumeTimes');
        }
      }
    },
    'ruleForm.movieConsumeAmountType': {
      handler (newName, oldName) {
        if (newName != oldName) {
          this.$refs['ruleForm'].clearValidate('movieConsumeAmount');
        }
      }
    },
    'ruleForm.shopConsumeTimesType': {
      handler (newName, oldName) {
        if (newName != oldName) {
          this.$refs['ruleForm'].clearValidate('shopConsumeTimes');
        }
      }
    },
    'ruleForm.shopConsumeAmountType': {
      handler (newName, oldName) {
        if (newName != oldName) {
          this.$refs['ruleForm'].clearValidate('shopConsumeAmount');
        }
      }
    },
    deep: true,
    immediate: true
  },
  methods: {
    // 反处理详情数据
    reverseProcessingData (res) {
      let detailData = JSON.parse(JSON.stringify(res));
      let labelRulesArr = detailData.labelRules;
      labelRulesArr.forEach(item => {
        if (item.lableType == 'mobileNum') {
          this.ruleForm.mobileNum = item.conditionDetail[0].isHavePhone;
        }
        if (item.lableType == 'birthday') {
          this.ruleForm.birthday = [
            item.conditionDetail[0].startTime,
            item.conditionDetail[0].endTime
          ];
          this.checkboxArr[0].selectedConditions.push('birthday');
          this.selectedRadioArr[0].selectedNum = this.checkboxArr[0].selectedConditions.length;
        }
        if (item.lableType == 'cinema') {
          this.ruleForm.cinema = item.conditionDetail.map(item => {
            return {
              name: item.desc,
              code: item.code,
              id: item.id
            };
          });
          this.ruleForm.cinemaType = item.conditionType;
          this.checkboxArr[0].selectedConditions.push('cinema');
          this.selectedRadioArr[0].selectedNum = this.checkboxArr[0].selectedConditions.length;
        }
        if (item.lableType == 'cardType') {
          this.ruleForm.cardType = item.conditionDetail.map(item => {
            return item.code;
          });
          this.checkboxArr[1].selectedConditions.push('cardType');
          this.selectedRadioArr[1].selectedNum = this.checkboxArr[1].selectedConditions.length;
        }
        if (item.lableType == 'openDate') {
          this.ruleForm.openDateType = item.conditionType;
          this.checkboxArr[1].selectedConditions.push('openDate');
          this.selectedRadioArr[1].selectedNum = this.checkboxArr[1].selectedConditions.length;
          if (item.conditionType == 'fixTime') {
            this.ruleForm.openDateFixTime = [
              item.conditionDetail[0].startTime,
              item.conditionDetail[0].endTime
            ];
          } else if (item.conditionType == 'relativeTime') {
            this.ruleForm.openDateRelativeTime =
              item.conditionDetail[0].relativeValue;
            this.ruleForm.openDateRelativeTimeUnit = item.unit;
          }
        }
        if (item.lableType == 'endTime') {
          this.ruleForm.endTimeType = item.conditionType;
          this.checkboxArr[1].selectedConditions.push('endTime');
          this.selectedRadioArr[1].selectedNum = this.checkboxArr[1].selectedConditions.length;
          if (item.conditionType == 'fixTime') {
            this.ruleForm.endTimeFixTime = [
              item.conditionDetail[0].startTime,
              item.conditionDetail[0].endTime
            ];
          } else if (item.conditionType == 'relativeTime') {
            this.ruleForm.endTimeRelativeTime =
              item.conditionDetail[0].relativeValue;
            this.ruleForm.endTimeRelativeTimeUnit = item.unit;
          }
        }
        if (item.lableType == 'totalBalance') {
          this.ruleForm.totalBalanceStart = item.conditionDetail[0].downValue;
          this.ruleForm.totalBalanceEnd = item.conditionDetail[0].upValue;
          this.checkboxArr[1].selectedConditions.push('totalBalance');
          this.selectedRadioArr[1].selectedNum = this.checkboxArr[1].selectedConditions.length;
        }
        if (item.lableType == 'couponName') {
          this.ruleForm.couponName = item.conditionDetail.map(item => {
            return {
              couponName: item.desc,
              applyCode: item.code
            };
          });
          this.checkboxArr[1].selectedConditions.push('couponName');
          this.selectedRadioArr[1].selectedNum = this.checkboxArr[1].selectedConditions.length;
        }
        if (item.lableType == 'channel') {
          this.ruleForm.channel = item.conditionDetail.map(item => {
            return item.code;
          });
          this.checkboxArr[2].selectedConditions.push('channel');
          this.selectedRadioArr[2].selectedNum = this.checkboxArr[2].selectedConditions.length;
        }
        if (item.lableType == 'consumeTimes') {
          this.ruleForm.consumeTimesType = item.conditionType;
          this.ruleForm.consumeTimesStart = item.conditionDetail[0].downValue;
          this.ruleForm.consumeTimesEnd = item.conditionDetail[0].upValue;
          this.checkboxArr[2].selectedConditions.push('consumeTimes');
          this.selectedRadioArr[2].selectedNum = this.checkboxArr[2].selectedConditions.length;
          if (item.conditionType == 'fixTime') {
            this.ruleForm.consumeTimesFixTime = [
              item.conditionDetail[0].startTime,
              item.conditionDetail[0].endTime
            ];
          } else if (item.conditionType == 'relativeTime') {
            this.ruleForm.consumeTimesRelativeTime =
              item.conditionDetail[0].relativeValue;
            this.ruleForm.consumeTimesRelativeTimeUnit = item.unit;
          }
        }
        if (item.lableType == 'chargeTimes') {
          this.ruleForm.chargeTimesType = item.conditionType;
          this.ruleForm.chargeTimesStart = item.conditionDetail[0].downValue;
          this.ruleForm.chargeTimesEnd = item.conditionDetail[0].upValue;
          this.checkboxArr[2].selectedConditions.push('chargeTimes');
          this.selectedRadioArr[2].selectedNum = this.checkboxArr[2].selectedConditions.length;
          if (item.conditionType == 'fixTime') {
            this.ruleForm.chargeTimesFixTime = [
              item.conditionDetail[0].startTime,
              item.conditionDetail[0].endTime
            ];
          } else if (item.conditionType == 'relativeTime') {
            this.ruleForm.chargeTimesRelativeTime =
              item.conditionDetail[0].relativeValue;
            this.ruleForm.chargeTimesRelativeTimeUnit = item.unit;
          }
        }
        if (item.lableType == 'totalConsumeAmount') {
          this.ruleForm.totalConsumeAmountType = item.conditionType;
          this.ruleForm.totalConsumeAmountStart =
            item.conditionDetail[0].downValue;
          this.ruleForm.totalConsumeAmountEnd = item.conditionDetail[0].upValue;
          this.checkboxArr[2].selectedConditions.push('totalConsumeAmount');
          this.selectedRadioArr[2].selectedNum = this.checkboxArr[2].selectedConditions.length;
          if (item.conditionType == 'fixTime') {
            this.ruleForm.totalConsumeAmountFixTime = [
              item.conditionDetail[0].startTime,
              item.conditionDetail[0].endTime
            ];
          } else if (item.conditionType == 'relativeTime') {
            this.ruleForm.totalConsumeAmountRelativeTime =
              item.conditionDetail[0].relativeValue;
            this.ruleForm.totalConsumeAmountRelativeTimeUnit = item.unit;
          }
        }
        if (item.lableType == 'totalChargeAmount') {
          this.ruleForm.totalChargeAmountType = item.conditionType;
          this.ruleForm.totalChargeAmountStart =
            item.conditionDetail[0].downValue;
          this.ruleForm.totalChargeAmountEnd = item.conditionDetail[0].upValue;
          this.checkboxArr[2].selectedConditions.push('totalChargeAmount');
          this.selectedRadioArr[2].selectedNum = this.checkboxArr[2].selectedConditions.length;
          if (item.conditionType == 'fixTime') {
            this.ruleForm.totalChargeAmountFixTime = [
              item.conditionDetail[0].startTime,
              item.conditionDetail[0].endTime
            ];
          } else if (item.conditionType == 'relativeTime') {
            this.ruleForm.totalChargeAmountRelativeTime =
              item.conditionDetail[0].relativeValue;
            this.ruleForm.totalChargeAmountRelativeTimeUnit = item.unit;
          }
        }
        if (item.lableType == 'movieConsumeTimes') {
          this.ruleForm.movieConsumeTimesType = item.conditionType;
          this.ruleForm.movieConsumeTimesStart =
            item.conditionDetail[0].downValue;
          this.ruleForm.movieConsumeTimesEnd = item.conditionDetail[0].upValue;
          this.checkboxArr[2].selectedConditions.push('movieConsumeTimes');
          this.selectedRadioArr[2].selectedNum = this.checkboxArr[2].selectedConditions.length;
          if (item.conditionType == 'fixTime') {
            this.ruleForm.movieConsumeTimesFixTime = [
              item.conditionDetail[0].startTime,
              item.conditionDetail[0].endTime
            ];
          } else if (item.conditionType == 'relativeTime') {
            this.ruleForm.movieConsumeTimesRelativeTime =
              item.conditionDetail[0].relativeValue;
            this.ruleForm.movieConsumeTimesRelativeTimeUnit = item.unit;
          }
        }
        if (item.lableType == 'movieConsumeAmount') {
          this.ruleForm.movieConsumeAmountType = item.conditionType;
          this.ruleForm.movieConsumeAmountStart =
            item.conditionDetail[0].downValue;
          this.ruleForm.movieConsumeAmountEnd = item.conditionDetail[0].upValue;
          this.checkboxArr[2].selectedConditions.push('movieConsumeAmount');
          this.selectedRadioArr[2].selectedNum = this.checkboxArr[2].selectedConditions.length;
          if (item.conditionType == 'fixTime') {
            this.ruleForm.movieConsumeAmountFixTime = [
              item.conditionDetail[0].startTime,
              item.conditionDetail[0].endTime
            ];
          } else if (item.conditionType == 'relativeTime') {
            this.ruleForm.movieConsumeAmountRelativeTime =
              item.conditionDetail[0].relativeValue;
            this.ruleForm.movieConsumeAmountRelativeTimeUnit = item.unit;
          }
        }
        if (item.lableType == 'shopConsumeTimes') {
          this.ruleForm.shopConsumeTimesType = item.conditionType;
          this.ruleForm.shopConsumeTimesStart =
            item.conditionDetail[0].downValue;
          this.ruleForm.shopConsumeTimesEnd = item.conditionDetail[0].upValue;
          this.checkboxArr[2].selectedConditions.push('shopConsumeTimes');
          this.selectedRadioArr[2].selectedNum = this.checkboxArr[2].selectedConditions.length;
          if (item.conditionType == 'fixTime') {
            this.ruleForm.shopConsumeTimesFixTime = [
              item.conditionDetail[0].startTime,
              item.conditionDetail[0].endTime
            ];
          } else if (item.conditionType == 'relativeTime') {
            this.ruleForm.shopConsumeTimesRelativeTime =
              item.conditionDetail[0].relativeValue;
            this.ruleForm.shopConsumeTimesRelativeTimeUnit = item.unit;
          }
        }
        if (item.lableType == 'shopConsumeAmount') {
          this.ruleForm.shopConsumeAmountType = item.conditionType;
          this.ruleForm.shopConsumeAmountStart =
            item.conditionDetail[0].downValue;
          this.ruleForm.shopConsumeAmountEnd = item.conditionDetail[0].upValue;
          this.checkboxArr[2].selectedConditions.push('shopConsumeAmount');
          this.selectedRadioArr[2].selectedNum = this.checkboxArr[2].selectedConditions.length;
          if (item.conditionType == 'fixTime') {
            this.ruleForm.shopConsumeAmountFixTime = [
              item.conditionDetail[0].startTime,
              item.conditionDetail[0].endTime
            ];
          } else if (item.conditionType == 'relativeTime') {
            this.ruleForm.shopConsumeAmountRelativeTime =
              item.conditionDetail[0].relativeValue;
            this.ruleForm.shopConsumeAmountRelativeTimeUnit = item.unit;
          }
        }
        if (item.lableType == 'lastConsume') {
          this.ruleForm.lastConsumeStart = item.conditionDetail[0].downValue;
          this.ruleForm.lastConsumeEnd = item.conditionDetail[0].upValue;
          this.checkboxArr[2].selectedConditions.push('lastConsume');
          this.selectedRadioArr[2].selectedNum = this.checkboxArr[2].selectedConditions.length;
        }
      });
      // 将转换后的数据赋值给ruleForm
      // this.ruleForm = detailData;
      this.ruleForm.labelName = detailData.labelName;
      this.ruleForm.labelColor = detailData.labelColor;
      this.ruleForm.filterCondition = detailData.filterCondition;
      // this.ruleForm.numberPeople = detailData.numberPeople;
      // this.ruleForm.percent = detailData.percent;
      this.selectedTotalArr = labelRulesArr.map(item => {
        return item.lableType;
      });
    },
    // 获取可售渠道列表
    getChannelList () {
      return new Promise((resolve, reject) => {
        this.$crmList
          .channelList({ tenantId: this.$store.state.loginUser.consumerId })
          .then(res => {
            this.channelOptions = res;
            resolve();
          })
          .catch(reason => {
            console.log(reason);
            reject();
          });
      });
    },
    // 获取会员卡类型列表
    getCardTypeList () {
      return new Promise((resolve, reject) => {
        this.$crmList
          .getCardType({ tenantId: this.$store.state.loginUser.consumerId })
          .then(res => {
            this.cardTypeOptions = res;
            resolve();
          })
          .catch(reason => {
            console.log(reason);
            reject();
          });
      });
    },
    // 保存
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let temporaryArr = this.formatselectedTotalConditions(
            this.selectedTotalArr
          );
          // console.log("筛选条件的数据", temporaryArr);
          let data = {
            tenantId: this.$store.state.loginUser.consumerId, // 租户id
            labelName: this.ruleForm.labelName, // 会员标签名称
            labelColor: this.ruleForm.labelColor, // 会员标签颜色
            filterCondition: this.ruleForm.filterCondition, // 筛选条件
            // numberPeople: this.ruleForm.numberPeople, //	符合筛选群体数
            // percent: this.ruleForm.percent, //	筛选人群占比
            labelRules: temporaryArr
          };

          if (this.$route.query.labelId) {
            data.id = this.$route.query.labelId;
            this.$crmList
              .labelEdit(data)
              .then(res => {
                this.$message.success('修改成功');
                this.$store.commit('tagNav/removeTagNav', this.$route);
                this.$router.push({
                  path: '/member/memberTags/list'
                });
              })
              .catch(err => {
                this.$message.error('修改失败，请重试');
                console.log(err);
              });
          } else {
            this.$crmList
              .labelAdd(data)
              .then(res => {
                this.$message.success('添加成功');
                this.$store.commit('tagNav/removeTagNav', this.$route);
                this.$router.push({
                  path: '/member/memberTags/list'
                });
              })
              .catch(err => {
                this.$message.error('添加失败，请重试');
                console.log(err);
              });
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // 取消
    handleCancelAddLabel () {
      this.$store.commit('tagNav/removeTagNav', this.$route);
      this.$router.push({
        path: '/member/memberTags/list'
      });
    },
    // 选择颜色
    handleSelectLabelColor (color) {
      this.ruleForm.labelColor = color;
    },
    // 选择筛选条件父类
    handleSelectRadio (flag) {
      this.selectedRadio = flag;
    },
    // 判断表单项是否显示
    itemIsShow (lableType) {
      let v = this.selectedTotalArr.findIndex(value => {
        return value == lableType;
      });
      if (v > -1) {
        return true;
      } else {
        return false;
      }
    },
    // 选择条件时的回调
    handleCheckedConditionsChange (value, flag) {
      if (flag == 'memberInfo') {
        this.checkboxArr[0].selectedConditions = value;
        this.selectedRadioArr[0].selectedNum = value.length;
      } else if (flag == 'memberAccount') {
        this.checkboxArr[1].selectedConditions = value;
        this.selectedRadioArr[1].selectedNum = value.length;
      } else if (flag == 'transactionData') {
        this.checkboxArr[2].selectedConditions = value;
        this.selectedRadioArr[2].selectedNum = value.length;
      }
      this.selectedTotalArr = [];
      this.selectedTotalArr = this.selectedTotalArr.concat(
        this.checkboxArr[0].selectedConditions,
        this.checkboxArr[1].selectedConditions,
        this.checkboxArr[2].selectedConditions
      );
    },
    // 格式化卡类型数据
    formateCardType (cardTypeArr) {
      let newCardTypeArr = [];
      for (let i = 0; i < cardTypeArr.length; i++) {
        for (let j = 0; j < this.cardTypeOptions.length; j++) {
          if (cardTypeArr[i] == this.cardTypeOptions[j].code) {
            newCardTypeArr.push(this.cardTypeOptions[j]);
            break;
          }
        }
      }
      return newCardTypeArr;
    },
    // 格式化渠道数据
    formateChannel (channelArr) {
      let newArr = [];
      for (let i = 0; i < channelArr.length; i++) {
        for (let j = 0; j < this.channelOptions.length; j++) {
          if (channelArr[i] == this.channelOptions[j].code) {
            newArr.push(this.channelOptions[j]);
            break;
          }
        }
      }
      return newArr;
    },
    // 处理选中条件后右侧的数据展示
    formatselectedTotalConditions (totalArr) {
      return totalArr.map(item => {
        if (item == 'mobileNum') {
          return {
            lableType: 'mobileNum',
            conditionType: 'normal',
            conditionDetail: [{ isHavePhone: this.ruleForm.mobileNum }],
            unit: ''
          };
        }
        if (item == 'birthday') {
          return {
            lableType: 'birthday',
            conditionType: 'normal',
            conditionDetail: [
              {
                startTime: this.ruleForm.birthday[0],
                endTime: this.ruleForm.birthday[1]
              }
            ],
            unit: ''
          };
        }
        if (item == 'cinema') {
          return {
            lableType: 'cinema',
            conditionType: this.ruleForm.cinemaType,
            conditionDetail: this.ruleForm.cinema.map(item => {
              return {
                desc: item.name,
                code: item.code,
                id: item.id
              };
            }),
            unit: ''
          };
        }
        if (item == 'cardType') {
          return {
            lableType: 'cardType',
            conditionType: 'normal',
            conditionDetail: this.formateCardType(this.ruleForm.cardType),
            unit: ''
          };
        }
        if (item == 'openDate') {
          if (this.ruleForm.openDateType == 'fixTime') {
            return {
              lableType: 'openDate',
              conditionType: this.ruleForm.openDateType,
              conditionDetail: [
                {
                  startTime: this.ruleForm.openDateFixTime[0],
                  endTime: this.ruleForm.openDateFixTime[1]
                }
              ],
              unit: ''
            };
          } else if (this.ruleForm.openDateType == 'relativeTime') {
            return {
              lableType: 'openDate',
              conditionType: this.ruleForm.openDateType,
              conditionDetail: [
                { relativeValue: this.ruleForm.openDateRelativeTime }
              ],
              unit: this.ruleForm.openDateRelativeTimeUnit
            };
          }
        }
        if (item == 'endTime') {
          if (this.ruleForm.endTimeType == 'fixTime') {
            return {
              lableType: 'endTime',
              conditionType: this.ruleForm.endTimeType,
              conditionDetail: [
                {
                  startTime: this.ruleForm.endTimeFixTime[0],
                  endTime: this.ruleForm.endTimeFixTime[1]
                }
              ],
              unit: ''
            };
          } else if (this.ruleForm.endTimeType == 'relativeTime') {
            return {
              lableType: 'endTime',
              conditionType: this.ruleForm.endTimeType,
              conditionDetail: [
                { relativeValue: this.ruleForm.endTimeRelativeTime }
              ],
              unit: this.ruleForm.endTimeRelativeTimeUnit
            };
          }
        }
        if (item == 'totalBalance') {
          return {
            lableType: 'totalBalance',
            conditionType: 'normal',
            conditionDetail: [
              {
                downValue: this.ruleForm.totalBalanceStart,
                upValue: this.ruleForm.totalBalanceEnd
              }
            ],
            unit: ''
          };
        }
        if (item == 'couponName') {
          return {
            lableType: 'couponName',
            conditionType: 'normal',
            conditionDetail: this.ruleForm.couponName.map(item => {
              return {
                desc: item.couponName,
                code: item.applyCode
              };
            }),
            unit: ''
          };
        }
        if (item == 'channel') {
          return {
            lableType: 'channel',
            conditionType: 'normal',
            conditionDetail: this.formateChannel(this.ruleForm.channel),
            unit: ''
          };
        }
        if (item == 'consumeTimes') {
          if (this.ruleForm.consumeTimesType == 'anyTime') {
            return {
              lableType: 'consumeTimes',
              conditionType: this.ruleForm.consumeTimesType,
              conditionDetail: [
                {
                  downValue: this.ruleForm.consumeTimesStart,
                  upValue: this.ruleForm.consumeTimesEnd
                }
              ],
              unit: ''
            };
          } else if (this.ruleForm.consumeTimesType == 'fixTime') {
            return {
              lableType: 'consumeTimes',
              conditionType: this.ruleForm.consumeTimesType,
              conditionDetail: [
                {
                  startTime: this.ruleForm.consumeTimesFixTime[0],
                  endTime: this.ruleForm.consumeTimesFixTime[1],
                  downValue: this.ruleForm.consumeTimesStart,
                  upValue: this.ruleForm.consumeTimesEnd
                }
              ],
              unit: ''
            };
          } else if (this.ruleForm.consumeTimesType == 'relativeTime') {
            return {
              lableType: 'consumeTimes',
              conditionType: this.ruleForm.consumeTimesType,
              conditionDetail: [
                {
                  relativeValue: this.ruleForm.consumeTimesRelativeTime,
                  downValue: this.ruleForm.consumeTimesStart,
                  upValue: this.ruleForm.consumeTimesEnd
                }
              ],
              unit: this.ruleForm.consumeTimesRelativeTimeUnit
            };
          }
        }
        if (item == 'chargeTimes') {
          if (this.ruleForm.chargeTimesType == 'anyTime') {
            return {
              lableType: 'chargeTimes',
              conditionType: this.ruleForm.chargeTimesType,
              conditionDetail: [
                {
                  downValue: this.ruleForm.chargeTimesStart,
                  upValue: this.ruleForm.chargeTimesEnd
                }
              ],
              unit: ''
            };
          } else if (this.ruleForm.chargeTimesType == 'fixTime') {
            return {
              lableType: 'chargeTimes',
              conditionType: this.ruleForm.chargeTimesType,
              conditionDetail: [
                {
                  startTime: this.ruleForm.chargeTimesFixTime[0],
                  endTime: this.ruleForm.chargeTimesFixTime[1],
                  downValue: this.ruleForm.chargeTimesStart,
                  upValue: this.ruleForm.chargeTimesEnd
                }
              ],
              unit: ''
            };
          } else if (this.ruleForm.chargeTimesType == 'relativeTime') {
            return {
              lableType: 'chargeTimes',
              conditionType: this.ruleForm.chargeTimesType,
              conditionDetail: [
                {
                  relativeValue: this.ruleForm.chargeTimesRelativeTime,
                  downValue: this.ruleForm.chargeTimesStart,
                  upValue: this.ruleForm.chargeTimesEnd
                }
              ],
              unit: this.ruleForm.chargeTimesRelativeTimeUnit
            };
          }
        }
        if (item == 'totalConsumeAmount') {
          if (this.ruleForm.totalConsumeAmountType == 'anyTime') {
            return {
              lableType: 'totalConsumeAmount',
              conditionType: this.ruleForm.totalConsumeAmountType,
              conditionDetail: [
                {
                  downValue: this.ruleForm.totalConsumeAmountStart,
                  upValue: this.ruleForm.totalConsumeAmountEnd
                }
              ],
              unit: ''
            };
          } else if (this.ruleForm.totalConsumeAmountType == 'fixTime') {
            return {
              lableType: 'totalConsumeAmount',
              conditionType: this.ruleForm.totalConsumeAmountType,
              conditionDetail: [
                {
                  startTime: this.ruleForm.totalConsumeAmountFixTime[0],
                  endTime: this.ruleForm.totalConsumeAmountFixTime[1],
                  downValue: this.ruleForm.totalConsumeAmountStart,
                  upValue: this.ruleForm.totalConsumeAmountEnd
                }
              ],
              unit: ''
            };
          } else if (this.ruleForm.totalConsumeAmountType == 'relativeTime') {
            return {
              lableType: 'totalConsumeAmount',
              conditionType: this.ruleForm.totalConsumeAmountType,
              conditionDetail: [
                {
                  relativeValue: this.ruleForm.totalConsumeAmountRelativeTime,
                  downValue: this.ruleForm.totalConsumeAmountStart,
                  upValue: this.ruleForm.totalConsumeAmountEnd
                }
              ],
              unit: this.ruleForm.totalConsumeAmountRelativeTimeUnit
            };
          }
        }
        if (item == 'totalChargeAmount') {
          if (this.ruleForm.totalChargeAmountType == 'anyTime') {
            return {
              lableType: 'totalChargeAmount',
              conditionType: this.ruleForm.totalChargeAmountType,
              conditionDetail: [
                {
                  downValue: this.ruleForm.totalChargeAmountStart,
                  upValue: this.ruleForm.totalChargeAmountEnd
                }
              ],
              unit: ''
            };
          } else if (this.ruleForm.totalChargeAmountType == 'fixTime') {
            return {
              lableType: 'totalChargeAmount',
              conditionType: this.ruleForm.totalChargeAmountType,
              conditionDetail: [
                {
                  startTime: this.ruleForm.totalChargeAmountFixTime[0],
                  endTime: this.ruleForm.totalChargeAmountFixTime[1],
                  downValue: this.ruleForm.totalChargeAmountStart,
                  upValue: this.ruleForm.totalChargeAmountEnd
                }
              ],
              unit: ''
            };
          } else if (this.ruleForm.totalChargeAmountType == 'relativeTime') {
            return {
              lableType: 'totalChargeAmount',
              conditionType: this.ruleForm.totalChargeAmountType,
              conditionDetail: [
                {
                  relativeValue: this.ruleForm.totalChargeAmountRelativeTime,
                  downValue: this.ruleForm.totalChargeAmountStart,
                  upValue: this.ruleForm.totalChargeAmountEnd
                }
              ],
              unit: this.ruleForm.totalChargeAmountRelativeTimeUnit
            };
          }
        }
        if (item == 'movieConsumeTimes') {
          if (this.ruleForm.movieConsumeTimesType == 'anyTime') {
            return {
              lableType: 'movieConsumeTimes',
              conditionType: this.ruleForm.movieConsumeTimesType,
              conditionDetail: [
                {
                  downValue: this.ruleForm.movieConsumeTimesStart,
                  upValue: this.ruleForm.movieConsumeTimesEnd
                }
              ],
              unit: ''
            };
          } else if (this.ruleForm.movieConsumeTimesType == 'fixTime') {
            return {
              lableType: 'movieConsumeTimes',
              conditionType: this.ruleForm.movieConsumeTimesType,
              conditionDetail: [
                {
                  startTime: this.ruleForm.movieConsumeTimesFixTime[0],
                  endTime: this.ruleForm.movieConsumeTimesFixTime[1],
                  downValue: this.ruleForm.movieConsumeTimesStart,
                  upValue: this.ruleForm.movieConsumeTimesEnd
                }
              ],
              unit: ''
            };
          } else if (this.ruleForm.movieConsumeTimesType == 'relativeTime') {
            return {
              lableType: 'movieConsumeTimes',
              conditionType: this.ruleForm.movieConsumeTimesType,
              conditionDetail: [
                {
                  relativeValue: this.ruleForm.movieConsumeTimesRelativeTime,
                  downValue: this.ruleForm.movieConsumeTimesStart,
                  upValue: this.ruleForm.movieConsumeTimesEnd
                }
              ],
              unit: this.ruleForm.movieConsumeTimesRelativeTimeUnit
            };
          }
        }
        if (item == 'movieConsumeAmount') {
          if (this.ruleForm.movieConsumeAmountType == 'anyTime') {
            return {
              lableType: 'movieConsumeAmount',
              conditionType: this.ruleForm.movieConsumeAmountType,
              conditionDetail: [
                {
                  downValue: this.ruleForm.movieConsumeAmountStart,
                  upValue: this.ruleForm.movieConsumeAmountEnd
                }
              ],
              unit: ''
            };
          } else if (this.ruleForm.movieConsumeAmountType == 'fixTime') {
            return {
              lableType: 'movieConsumeAmount',
              conditionType: this.ruleForm.movieConsumeAmountType,
              conditionDetail: [
                {
                  startTime: this.ruleForm.movieConsumeAmountFixTime[0],
                  endTime: this.ruleForm.movieConsumeAmountFixTime[1],
                  downValue: this.ruleForm.movieConsumeAmountStart,
                  upValue: this.ruleForm.movieConsumeAmountEnd
                }
              ],
              unit: ''
            };
          } else if (this.ruleForm.movieConsumeAmountType == 'relativeTime') {
            return {
              lableType: 'movieConsumeAmount',
              conditionType: this.ruleForm.movieConsumeAmountType,
              conditionDetail: [
                {
                  relativeValue: this.ruleForm.movieConsumeAmountRelativeTime,
                  downValue: this.ruleForm.movieConsumeAmountStart,
                  upValue: this.ruleForm.movieConsumeAmountEnd
                }
              ],
              unit: this.ruleForm.movieConsumeAmountRelativeTimeUnit
            };
          }
        }
        if (item == 'shopConsumeTimes') {
          if (this.ruleForm.shopConsumeTimesType == 'anyTime') {
            return {
              lableType: 'shopConsumeTimes',
              conditionType: this.ruleForm.shopConsumeTimesType,
              conditionDetail: [
                {
                  downValue: this.ruleForm.shopConsumeTimesStart,
                  upValue: this.ruleForm.shopConsumeTimesEnd
                }
              ],
              unit: ''
            };
          } else if (this.ruleForm.shopConsumeTimesType == 'fixTime') {
            return {
              lableType: 'shopConsumeTimes',
              conditionType: this.ruleForm.shopConsumeTimesType,
              conditionDetail: [
                {
                  startTime: this.ruleForm.shopConsumeTimesFixTime[0],
                  endTime: this.ruleForm.shopConsumeTimesFixTime[1],
                  downValue: this.ruleForm.shopConsumeTimesStart,
                  upValue: this.ruleForm.shopConsumeTimesEnd
                }
              ],
              unit: ''
            };
          } else if (this.ruleForm.shopConsumeTimesType == 'relativeTime') {
            return {
              lableType: 'shopConsumeTimes',
              conditionType: this.ruleForm.shopConsumeTimesType,
              conditionDetail: [
                {
                  relativeValue: this.ruleForm.shopConsumeTimesRelativeTime,
                  downValue: this.ruleForm.shopConsumeTimesStart,
                  upValue: this.ruleForm.shopConsumeTimesEnd
                }
              ],
              unit: this.ruleForm.shopConsumeTimesRelativeTimeUnit
            };
          }
        }
        if (item == 'shopConsumeAmount') {
          if (this.ruleForm.shopConsumeAmountType == 'anyTime') {
            return {
              lableType: 'shopConsumeAmount',
              conditionType: this.ruleForm.shopConsumeAmountType,
              conditionDetail: [
                {
                  downValue: this.ruleForm.shopConsumeAmountStart,
                  upValue: this.ruleForm.shopConsumeAmountEnd
                }
              ],
              unit: ''
            };
          } else if (this.ruleForm.shopConsumeAmountType == 'fixTime') {
            return {
              lableType: 'shopConsumeAmount',
              conditionType: this.ruleForm.shopConsumeAmountType,
              conditionDetail: [
                {
                  startTime: this.ruleForm.shopConsumeAmountFixTime[0],
                  endTime: this.ruleForm.shopConsumeAmountFixTime[1],
                  downValue: this.ruleForm.shopConsumeAmountStart,
                  upValue: this.ruleForm.shopConsumeAmountEnd
                }
              ],
              unit: ''
            };
          } else if (this.ruleForm.shopConsumeAmountType == 'relativeTime') {
            return {
              lableType: 'shopConsumeAmount',
              conditionType: this.ruleForm.shopConsumeAmountType,
              conditionDetail: [
                {
                  relativeValue: this.ruleForm.shopConsumeAmountRelativeTime,
                  downValue: this.ruleForm.shopConsumeAmountStart,
                  upValue: this.ruleForm.shopConsumeAmountEnd
                }
              ],
              unit: this.ruleForm.shopConsumeAmountRelativeTimeUnit
            };
          }
        }
        if (item == 'lastConsume') {
          return {
            lableType: 'lastConsume',
            conditionType: 'normal',
            conditionDetail: [
              {
                downValue: this.ruleForm.lastConsumeStart,
                upValue: this.ruleForm.lastConsumeEnd
              }
            ],
            unit: ''
          };
        }
      });
    },
    // 清空
    handleClearAll (formName) {
      // this.$refs[formName].resetFields();
      this.selectedTotalArr = ['mobileNum'];
      this.checkboxArr[0].selectedConditions = ['mobileNum'];
      this.checkboxArr[1].selectedConditions = [];
      this.checkboxArr[2].selectedConditions = [];
      this.selectedRadioArr[0].selectedNum = this.checkboxArr[0].selectedConditions.length;
      this.selectedRadioArr[1].selectedNum = this.checkboxArr[1].selectedConditions.length;
      this.selectedRadioArr[2].selectedNum = this.checkboxArr[2].selectedConditions.length;
    },
    // 选择消费影院
    chooseCinema () {
      var editData = this.ruleForm.cinema;
      this.$set(this, 'innerCinemaMultiData', editData);
      this.dialogVisible = true;
    },
    // 删除所选影院
    clearSelectedCinema () {
      this.ruleForm.cinema = [];
    },
    // 展示当前适用影院合集
    getArrCinemaListName (arr) {
      if (!arr.length || arr.length == 0) {
        return '请选择';
      }
      var newStrArr = [];
      arr.map((item, index) => {
        newStrArr.push(item.desc ? item.desc : item.name);
      });
      return newStrArr.join('、');
    },
    // 选择影院回调
    handleCallBack (opt) {
      if (opt.btnType == 1 && opt.data.length == 0) {
        this.dialogVisible = true;
        this.$message.warning('请至少选择一家影院');
        return false;
      } else {
        let arr = new Array(...opt.data);
        this.ruleForm.cinema = arr;
        this.$refs['ruleForm'].validateField(['cinema']);
      }
    },
    // 选择可用券
    chooseCouponName () {
      var editData = this.ruleForm.couponName;
      this.$set(this, 'innerCouponNameMultiData', editData);
      this.CouponNameDialogVisible = true;
    },
    // 删除所选可用券
    clearSelectedCouponName () {
      this.ruleForm.couponName = [];
      this.$set(this, 'innerCouponNameMultiData', []);
    },
    // 展示当前可用券合集
    getArrCouponName (arr) {
      if (!arr.length || arr.length == 0) {
        return '请选择';
      }
      var newStrArr = [];
      arr.map((item, index) => {
        newStrArr.push(item.couponName);
      });
      return newStrArr.join('、');
    },
    // 选择可用券回调
    handleCouponNameCallback (opt) {
      var arr = new Array(...opt.data);
      this.ruleForm.couponName = arr;
      this.$refs['ruleForm'].validateField(['couponName']);
      // console.log("选择的可用券", this.ruleForm.couponName);
    }
    // 筛选条件计算
    // handleCalculation(Min, Max) {
    //   var Range = Max - Min;
    //   var Rand = Math.random();
    //   this.ruleForm.numberPeople = Min + Math.round(Rand * Range);
    //   this.ruleForm.percent =
    //     Rand == 0 ? Math.round(Rand + 10) : Math.round(Rand * 100);
    // }
  }
};
</script>
<style lang="scss">
._add-member-tags {
  width: 80%;
  .el-form-item__label {
    text-indent: 0;
    margin-left: 22px;
    margin-top: 10px;
  }
  ._label-red-star {
    color: #f56c6c;
    position: absolute;
    left: -92px;
    top: 0px;
    z-index: 99;
  }
  ._member-label-content {
    border: 0;
    .el-input {
      width: 360px;
      font-size: 12px;
    }
    .el-form-item {
      margin-bottom: 22px;
    }
    .el-range-input,
    .el-range-separator {
      font-size: 12px;
      color: #666;
    }
    // 标签基础信息设置
    ._member-label-basic-set {
      .el-form-item__error {
        top: 40px;
        left: 20px;
      }
      // 标签颜色样式
      ._label-color-wrap {
        display: flex;
        flex: 1;
        flex-wrap: wrap;
        padding-top: 5px;
        height: 32px;
        .isSelectedColor {
          box-shadow: 0 0 3px 2px #409eff;
        }
        ._label-color-item {
          margin: 0 8px 8px 0;
          width: 30px;
          height: 30px;
          border-radius: 4px;
          cursor: pointer;
        }
      }
      //标签预览
      ._view-preview-wrap {
        border: 1px solid #666;
        min-width: 65px;
        height: 20px;
        line-height: 18px;
        margin-top: 8px;
        text-align: center;
        border-radius: 2px;
        padding: 0 7px;
        float: left;
        ._view-preview-word {
          font-size: 12px;
          color: #666;
        }
      }
    }
    // 筛选条件设置
    ._member-condition-setting {
      margin-left: 22px;
      // title
      ._member-condition-head {
        background: #f2f4fd;
        height: 32px;
        line-height: 32px;
        font-size: 12px;
        color: #333333;
        letter-spacing: 0;
        font-family: MicrosoftYaHei;
        text-align: center;
      }
      // body
      ._member-condition-body {
        display: flex;
        height: 545px;
        ._member-condition-left-radio-wrap {
          height: 100%;
          border: 1px solid #bcbcbc;
          box-sizing: border-box;
          overflow-y: auto;
          ._member-condition-radio {
            font-family: MicrosoftYaHei;
            width: 40px;
            min-height: 107px;
            line-height: 1.4;
            padding: 11px 10px;
            box-sizing: border-box;
            text-align: center;
            letter-spacing: 0;
            font-size: 12px;
            color: #666666;
            border-bottom: 1px solid #bcbcbc;
            cursor: pointer;
            ._member-badge {
              background: #3b74ff;
              color: #fff;
              font-size: 12px;
              padding: 0px 4px;
              line-height: 16px;
              height: 16px;
              display: inline-block;
              border-radius: 10px;
              margin-top: 4px;
            }
          }
          // 选中的radio
          .isSelectedRadio {
            background: #3b74ff;
            color: #fff;
            ._member-badge {
              background: #fff;
              color: #3b74ff;
            }
          }
        }
        ._member-condition-center-checkbox-wrap {
          width: 192px;
          height: 100%;
          padding: 24px 14px;
          border: 1px solid #bcbcbc;
          border-left: 0;
          position: absolute;
          box-sizing: border-box;
          overflow-y: auto;
          // left: 42px;
          .el-checkbox-group {
            display: flex;
            flex-direction: column;
            .el-checkbox {
              margin-bottom: 5px;
            }
          }
        }
        ._member-condition-right-content-wrap {
          width: calc(100% - 42px - 193px);
          height: 100%;
          margin-left: 192px;
          border: 1px solid #bcbcbc;
          border-left: 0;
          padding: 24px 14px;
          box-sizing: border-box;
          overflow-y: auto;
          .el-form-item__error {
            top: 96%;
          }
          .el-form-item {
            margin-bottom: 15px;
          }
          ._member-condition-right-content-inner-top {
            display: flex;
            justify-content: space-between;
            ._member-condition-total-desc {
              font-size: 12px;
              color: #333333;
              letter-spacing: 0;
            }
            .clear-button-custom {
              font-size: 12px;
              padding: 4px 15px;
            }
          }
          ._member-selected-condition {
            ._condition-word-desc {
              font-size: 12px;
              color: #666;
            }
            ._desc-start {
              margin-right: 8px;
            }
            ._desc-end {
              margin-left: 8px;
            }
            ._word-zhi {
              margin: 0 10px;
            }
            .el-form-item {
              display: flex;
              // justify-content: flex-start;
              align-items: flex-start;
              font-size: 12px;
              .el-form-item__label {
                width: 60px !important;
                // line-height: 1.5;
                padding: 0;
                text-align: left;
                font-size: 12px;
                color: #666666;
                margin-left: 0px;
              }
              .el-form-item__content {
                margin-left: 10px !important;
                font-size: 12px;
                line-height: 36px;
                .el-date-editor {
                  width: 240px;
                  .el-range__icon {
                    line-height: 25px;
                  }
                  .el-range-separator {
                    padding: 0 13px 0 0;
                    font-size: 12px;
                    color: #666;
                  }
                }
                .el-input {
                  width: 120px;
                  .el-input__icon {
                    line-height: 33px;
                  }
                }
              }
            }
            // 多行lable
            ._multiple-rows-lable {
              .el-form-item__label {
                width: 60px !important;
                line-height: 16px;
                padding: 0;
                text-align: left;
                font-size: 12px;
                color: #666666;
                margin-top: 3px;
                margin-left: 0px;
              }
            }
            ._consumer-cinema {
              display: flex;
              align-items: center;
            }
            ._select-cinema-wrap,
            ._select-cardType-wrap {
              margin-left: 10px;
              display: flex;
              ._select-cinema-btn,
              ._edit-cinema-btn,
              ._select-cardType-btn,
              ._edit-cardType-btn {
                width: 150px;
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
              ._edit-cinema-btn,
              ._edit-cardType-btn {
                width: 92px;
              }
              .cinema-list,
              .cardType-list {
                width: 150px;
                float: left;
                padding-right: 30px;
                padding-left: 10px;
                margin-right: 10px;
                height: 32px;
                line-height: 32px;
                position: relative;
                // display: inline-block;
                background: #f5f5f5;
                border: 1px solid #bcbcbc;
                border-radius: 4px;
                box-sizing: border-box;
                font-size: 12px;
                color: #666;
                letter-spacing: 0;
                text-align: center;
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                .myclose {
                  position: absolute;
                  right: 8px;
                  top: 8px;
                  color: #3b74ff;
                  font-weight: bold;
                }
              }
            }
            // 卡类型
            ._select-cardType-wrap {
              margin-left: 0;
            }
            // 消费渠道
            ._consumption-channels,
            ._member-card-type {
              .el-input {
                width: 240px !important;
                font-size: 12px;
              }
            }
            // 开卡时间
            ._openDate-type-wrap {
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              ._openDate-type {
                margin-right: 15px;
              }
              ._openDate-fix-time {
                margin-top: 1px;
              }
              ._relative-time-detail {
                margin: -2px;
              }
            }
            // 含三种类型的样式
            ._three-types-wrap {
              display: flex;
              // align-items: baseline;
              flex-wrap: wrap;
              ._right-content {
                margin-left: 15px;
                ._openDate-fix-time,
                ._relative-time-detail {
                  margin: 0 15px 8px 0;
                }
              }
            }
          }
        }
      }
    }
    // 筛选相关
    ._screening-conditions-wrap {
      margin-top: 15px;
      ._qualified-number-wrap {
        display: flex;
        ._calculation-btn {
          width: 80px;
          padding: 0;
          height: 32px;
          line-height: 32px;
        }
        ._qualified-number-desc {
          margin-left: 20px;
        }
      }
    }
  }
}
// 自定义popover样式
._member-custom-popover-style {
  background: rgba(51, 51, 51, 0.8);
  color: #fff;
  padding: 8px 10px;
  box-sizing: border-box;
  transform: translateY(-10px);
}
</style>
