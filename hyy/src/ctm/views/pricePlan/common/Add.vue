<template>
  <div class="movie-price-plan">
    <el-collapse v-model="activeNames">
      <el-form
        ref="rulesSizeForm"
        :model="sizeForm.ciPriceProgram"
        label-width="130px"
        size="small"
        :rules="rules"
        class="demo-ruleForm"
      >
        <div class="basic-info">
          <el-collapse-item title="基础信息" name="1">
            <!-- <el-form
            ref="form"
            :model="sizeForm"
            label-width="124px"
            size="small"
            >-->
            <el-form-item label="方案名称：" prop="name">
              <el-input
                v-model="sizeForm.ciPriceProgram.name"
                @blur="getgg(sizeForm.ciPriceProgram.name)"
              ></el-input>
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              <el-radio-group v-model="sizeForm.ciPriceProgram.status">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="优先级：" prop="priority">
              <!-- <el-input v-model.number="sizeForm.ciPriceProgram.priority" @change="getxxx"></el-input> -->
              <el-select v-model="sizeForm.ciPriceProgram.priority" placeholder="请选择优先级">
                <el-option key="1" label="1" value="1"></el-option>
                <el-option key="2" label="2" value="2"></el-option>
                <el-option key="3" label="3" value="3"></el-option>
                <el-option key="4" label="4" value="4"></el-option>
                <el-option key="5" label="5" value="5"></el-option>
                <el-option key="6" label="6" value="6"></el-option>
                <el-option key="7" label="7" value="7"></el-option>
                <el-option key="8" label="8" value="8"></el-option>
                <el-option key="9" label="9" value="9"></el-option>
              </el-select>
              <span style="color:#909399;font-size:12px;margin-left:5px;">数字越大，优先级越高</span>
            </el-form-item>
            <el-form-item label="有效日期：" prop="tiemStart_end">
              <el-date-picker
                v-model="sizeForm.ciPriceProgram.tiemStart_end"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="dateChange"
              ></el-date-picker>
              <span v-if="dateClick" style="color:#909399;font-size:12px;margin-left:5px;">
                {{sizeForm.ciPriceProgram.tiemStart_end[0]}} 6:00 至 {{dateAdd(sizeForm.ciPriceProgram.tiemStart_end[1])}} 6:00
              </span>
            </el-form-item>
            <!-- </el-form> -->
          </el-collapse-item>
        </div>
        <div class="basic-info">
          <el-collapse-item title="触发条件" name="2">
            <!-- <el-form
            ref="form"
            :model="sizeForm.ciPriceHallType"
            label-width="97px"
            size="small"
            >-->
            <!-- <el-form-item label="适用影院：">
              <el-button plain @click="cinemaSelectFun()">请选择影院</el-button>
              <span
                style="color:#f56c6c;font-size:14px;margin-left:8px"
                v-for="(item,index) in sizeForm.ciCinemaList"
                :key="index"
              >{{item.name}}</span>
            </el-form-item>-->
            <el-form-item label="适用影院：">
              <!-- <el-tooltip placement="top"> -->
                <!-- <div slot="content">{{chooseCinemas1}}</div> -->
                <el-input
                  v-model="chooseCinemas1"
                  :readonly="true"
                  style="display: inline-block;width:360px"
                ></el-input>
              <!-- </el-tooltip> -->
              <el-button plain @click="chooseCinema1">请选择影院</el-button>
              <cinemaTable
                ref="chooseCinema1"
                @searchUser1="searchUser1"
                @chooseUser1="chooseUser1"
                @changeCurrentPage1="changeCurrentPage1"
              ></cinemaTable>
            </el-form-item>
            <el-form-item label="适用影厅类型：" prop="ciPriceHallType">
              <el-select
                v-model="sizeForm.ciPriceProgram.ciPriceHallType"
                placeholder="请选择影厅"
                @change="ciPriceHallTypeChange"
                multiple
                remove-tag
              >
                <el-option
                  label="不限影厅"
                  value="limit"
                  :disabled="sizeForm.ciPriceProgram.ciPriceHallType[0] != 'limit' && sizeForm.ciPriceProgram.ciPriceHallType.length>0"
                ></el-option>

                <el-option
                  :disabled="sizeForm.ciPriceProgram.ciPriceHallType[0] == 'limit'"
                  v-for="item in HallTypeList"
                  :key="item.value"
                  :label="item.keyName"
                  :value="item.keyCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="适用影厅：">
              <el-select @change="applicableFilm" v-model="applicableFilm1" placeholder="请选择">
                <el-option
                  v-for="item in options2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-table :data="cinemaTypeList" :class="hid">
                <el-table-column prop="cinemaName" label="影院" width="180"></el-table-column>
                <el-table-column prop="type">
                  <template slot="header" slot-scope="scope" :class="scope">
                    <span>适用影厅</span>
                    <span @click="emptyText">清空</span>
                  </template>
                  <template slot-scope="scope">
                    <el-tag
                      class="m-l-5"
                      v-for="(tag,idx) in scope.row.hallList"
                      :key="tag.code"
                      closable
                      @close="handleClose(scope,idx)"
                      type="info"
                    >{{tag.name}}</el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <el-form-item label="适用影片：">
              <!-- 黎的版本  -->
              <el-radio-group v-model="useMovie" @change="changeCinema">
                <el-radio :label="1">不限影片</el-radio>
                <el-radio :label="2">指定影片</el-radio>
              </el-radio-group>
              <br />
              <el-input
                v-model="chooseCinemas"
                v-show="isSome"
                @focus="chooseCinema"
                class="cinema"
              ></el-input>
            </el-form-item>
            <getCinema
              ref="chooseCinema"
              @searchUser="searchUser"
              @chooseUser="chooseUser"
              @changeCurrentPage="changeCurrentPage"
            ></getCinema>
            <el-form-item label="适用影片生命周期：">
              <el-select @change="lifeCycle" v-model="pricing2" placeholder="请选择">
                <el-option
                  v-for="item in lifeCycleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <div :class="hidd">
                <el-checkbox-group v-model="checkList1" @change="lifeCycle1" class="m-t-15">
                  <el-checkbox v-for="item in disVersionList1" :key="item.idx" :label="item.idx">
                    {{item.label}}
                    <i
                      v-if="item.idx>=5"
                      class="el-icon-close"
                      @click="del(item.idx)"
                    ></i>
                  </el-checkbox>
                </el-checkbox-group>
                <i class="el-icon-plus" @click="add"></i>
              </div>
            </el-form-item>
            <el-form-item label="适用时段：" prop="tmList">
              <div :class="{'time-interval':true,'bianju':(index*1)+1<sizeForm.tmList.length}" v-for="(item, index) in sizeForm.tmList" :key="index">
                <div class="time-interval-1">
                  <el-checkbox
                    :indeterminate="item.isIndeterminate_week"
                    v-model="item.weekDay_checkAll"
                    @change="handleCheckWeekAllChange($event,index)"
                  >工作日</el-checkbox>
                  <div class="time-interval-week">
                    <el-checkbox
                      v-model="item.monday"
                      @change="handleCheckedWeekChange($event,index)"
                      true-label="1"
                      false-label="0"
                    >周一</el-checkbox>
                    <el-checkbox
                      v-model="item.tuesday"
                      @change="handleCheckedWeekChange($event,index)"
                      true-label="1"
                      false-label="0"
                    >周二</el-checkbox>
                    <el-checkbox
                      v-model="item.wednesday"
                      @change="handleCheckedWeekChange($event,index)"
                      true-label="1"
                      false-label="0"
                    >周三</el-checkbox>
                    <el-checkbox
                      v-model="item.thursday"
                      @change="handleCheckedWeekChange($event,index)"
                      true-label="1"
                      false-label="0"
                    >周四</el-checkbox>
                    <el-checkbox
                      v-model="item.friday"
                      @change="handleCheckedWeekChange($event,index)"
                      true-label="1"
                      false-label="0"
                    >周五</el-checkbox>
                  </div>
                </div>
                <div class="time-interval-2">
                  <el-checkbox
                    :indeterminate="item.isIndeterminate_weekend"
                    v-model="item.weekendDay_checkAll"
                    @change="handleCheckWeekendAllChange($event,index)"
                  >周末</el-checkbox>
                  <div class="time-interval-weekend">
                    <el-checkbox
                      v-model="item.saturday"
                      @change="handleCheckedWeekendChange($event,index)"
                      true-label="1"
                      false-label="0"
                    >周六</el-checkbox>
                    <el-checkbox
                      v-model="item.sunday"
                      @change="handleCheckedWeekendChange($event,index)"
                      true-label="1"
                      false-label="0"
                    >周日</el-checkbox>
                  </div>
                </div>

                <!-- ********************************************************* -->
                <div class="time-interval-3" ref="timeDom">
                  <div class="time-wrap">
                    <el-time-picker
                      v-model="item.startTm"
                      placeholder="请输入时间"
                      @change="findTime($event,index)"
                    ></el-time-picker>
                    <span class="time-padding">至</span>
                    <el-time-picker v-model="item.endTm" placeholder="请输入时间"></el-time-picker>
                  </div>
                </div>
                <div class="item-interval-delete">
                  <el-button type="text" @click="deleFun(item,index)">删除</el-button>
                </div>
              </div>
              <div class="add-timearea">
                <el-button type="text" @click="addTimearea">
                  <i class="iconfont icon-shijianduantianjia" style="vertical-align: baseline"></i>
                  添加时间
                </el-button>
              </div>
            </el-form-item>

            <!-- <el-form-item label="适用影片：" prop="movieCodeList">  // 刘的版本
              <el-select v-model="sizeForm.ciPriceProgram.movieCodeList" placeholder="请选择影片" @change='movieListChange'
                multiple>
                <el-option label="不限影片" value="limit"
                  :disabled="sizeForm.ciPriceProgram.movieCodeList[0] != 'limit' && sizeForm.ciPriceProgram.movieCodeList.length>0">
                </el-option>
                <el-option :disabled="sizeForm.ciPriceProgram.movieCodeList[0] == 'limit'"
                  v-for="(item,key) in movieList" :key="key" :label="item.c" :value="item.movieCode">
                </el-option>
              </el-select>
            </el-form-item>-->

            <!-- </el-form> -->
          </el-collapse-item>
        </div>
        <div class="basic-info price-system" style="margin-bottom:30px">
          <el-collapse-item title="价格体系" name="3">
            <el-tabs v-model="activeTab" type="card" @tab-click="handleClick">
              <el-tab-pane label="柜台/自助" name="first">
                <!-- <el-form label-width="97px"> -->
                <el-form-item label="适用渠道：" style="margin-bottom: 0;" prop="price_Channel_1">
                  <el-checkbox-group
                    v-model="price_Channel_1"
                    @change="handleCheckedChannel_change_1"
                  >
                    <el-checkbox
                      v-for="chanel in channelsList_1"
                      :key="chanel.uid"
                      :label="chanel.uid"
                    >{{chanel.name}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="适用版本：" style="margin-bottom: 0;">
                  <el-checkbox
                    class="check-all-type"
                    v-model="disVersion_checkAll_1"
                    :indeterminate="disVersion_isIndeterminate_1"
                    @change="disVersion_handleCheckAllChange_1"
                  >全部版本</el-checkbox>
                  <el-checkbox-group
                    v-model="price_disVersion_1"
                    @change="handleCheckedDisVersion_Change"
                  >
                    <el-checkbox
                      v-for="(item, index) in disVersionList"
                      :key="index"
                      :label="item.keyCode + ',' + item.keyName"
                    >{{item.keyName}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="适用票类：">
                  <el-checkbox-group
                    v-model="price_tickettype"
                    @change="handleCheckedDisTickettype_Change"
                  >
                    <template v-for="(item, i) in tickettypeList">
                      <el-checkbox
                        :disabled="item.name == '成人票' "
                        :key="i"
                        :label="item.uid+','+item.name"
                      >{{item.name}}</el-checkbox>
                    </template>
                  </el-checkbox-group>
                  <div>
                    <el-table
                      :data="ttVoList"
                      ref="multipleTable1"
                      @selection-change="handleSelectionTtVoListChange"
                    >
                      <el-table-column type="selection" width="60"></el-table-column>
                      <el-table-column prop="ttName" label="票类" width="100"></el-table-column>
                      <el-table-column prop="movieVersionName" label="影片版本" width="100"></el-table-column>
                      <el-table-column prop="price">
                        <template slot="header" slot-scope="scope" :class="scope">
                          <span>价格</span>
                          <el-checkbox
                            v-model="checked"
                            @change="handleCheckAllChange"
                            class="m-l-10"
                          >统一定价</el-checkbox>
                        </template>
                        <template slot-scope="scope" v-if="scope.row.price!=null">
                          <el-select v-model="scope.row.feeFlag">
                            <el-option
                              v-for="(item, index) in scope.row.sel"
                              :key="index"
                              :value="item.value"
                              :label="item.label"
                            ></el-option>
                          </el-select>
                          <span class="input-con">
                            <el-input
                              type="number"
                              maxlength="9"
                              v-model="scope.row.price"
                              @change="priceChange1(scope.row.price,scope.$index)"
                            ></el-input>
                            <i class="rmb-hover">¥</i>
                          </span>
                        </template>
                      </el-table-column>
                    </el-table>
                    <p class="table-rule">1、若价格方案的定价低于最低发行价时，将以影片最低发行价出售</p>
                    <p class="table-rule">2、场次标准票价=场次成人票票价</p>
                  </div>
                </el-form-item>
                <!-- </el-form> -->
              </el-tab-pane>
              <el-tab-pane label="线上网售" name="second">
                <!-- <el-form label-width="97px"> -->
                <el-form-item label="适用渠道">
                  <el-checkbox-group
                    v-model="price_Channel_2"
                    @change="handleCheckedChannel_change_2"
                  >
                    <el-checkbox
                      v-for="(channel, i) in channelsList_2"
                      :key="i"
                      :label="channel.uid"
                      name="type"
                    >{{channel.name}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="适用版本：" style="margin-bottom: 0;">
                  <el-checkbox
                    class="check-all-type"
                    v-model="disVersion_checkAll_2"
                    :indeterminate="disVersion_isIndeterminate_2"
                    @change="disVersion_handleCheckAllChange_2"
                  >全部版本</el-checkbox>
                  <el-checkbox-group
                    v-model="price_disVersion_2"
                    @change="handleCheckedDisVersion_Change_2"
                  >
                    <el-checkbox
                      v-for="(item, index) in disVersionList"
                      :key="index"
                      :label="item.keyCode + ',' + item.keyName"
                    >{{item.keyName}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <div>
                  <el-table
                    class="edit-cichannel-table"
                    ref="multipleTable2"
                    :data="priceNetSale"
                    @selection-change="handleSelectionPriceNetSaleChange"
                  >
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column prop="movieVersionName" label="影片版本" width="100"></el-table-column>
                    <el-table-column prop="price">
                      <template slot="header" slot-scope="scope" :class="scope">
                        <span>渠道结算票价</span>
                        <el-checkbox
                          v-model="checked1"
                          @change="handleCheckAllChange1"
                          class="m-l-10"
                        >统一定价</el-checkbox>
                      </template>
                      <template slot-scope="scope" v-if="scope.row.price!=null">
                        <el-select v-model="scope.row.feeFlag">
                          <el-option
                            v-for="(item, index) in scope.row.sel"
                            :key="index"
                            :value="item.value"
                            :label="item.label"
                          ></el-option>
                        </el-select>
                        <span class="input-con">
                          <el-input
                            type="number"
                            maxlength="9"
                            v-model="scope.row.price"
                            @change="priceChange2(scope.row.price,scope.$index)"
                          ></el-input>
                          <i class="rmb-hover">¥</i>
                        </span>
                      </template>
                    </el-table-column>
                  </el-table>
                  <p class="table-rule">1、若价格方案的定价低于最低发行价时，将以影片最低发行价出售</p>
                  <p class="table-rule">2、场次标准票价=场次成人票票价</p>
                </div>

                <!-- </el-form> -->
              </el-tab-pane>
            </el-tabs>
            <div class="table-bottom-menu">
              <el-form-item label="分区定价：" class="m-t-10">
                <el-select @change="zoningPricing" v-model="pricing" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-table :data="tableData" style="width: 262px" :class="hidden">
                  <el-table-column prop="name" label="分区" width="80">
                    <template slot-scope="scope">
                      <i :style="{background:scope.row.color}">&nbsp;&nbsp;&nbsp;&nbsp;</i>
                      <span>{{scope.row.name}}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="price" label="加减价（正数为加，负数为减）" width="180">
                    <template slot-scope="scope">
                      <span class="input-con">
                        <el-input
                          type="number"
                          maxlength="9"
                          placeholder="0"
                          v-model="scope.row.price"
                          @change="priceChang(scope.row.price,scope.$index)"
                        ></el-input>
                        <i class="rmb-hover">¥</i>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>

              <el-form-item label="执行动态调价：" class="m-t-10">
                <el-select @change="dynamicPrice" v-model="pricing1" placeholder="请选择">
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <div :class="hidde">
                  <el-checkbox-group
                    v-model="checkList"
                    @change="checklist"
                    class="m-t-15"
                    style="width:300px;"
                  >
                    <el-checkbox
                      v-for="item in disVersionList2"
                      :key="item.idx"
                      :label="item.idx"
                    >{{item.label}}</el-checkbox>
                  </el-checkbox-group>
                  <div>
                    <p
                      style="width:800px;margin-top:10px;"
                      v-for="item in activeList"
                      :key="item.idx"
                    >
                      <el-input
                        v-if="ifCheck[0]==0"
                        type="number"
                        style="width: 80px;"
                        v-model="item.attendanceRate"
                        placeholder="0"
                        @change="changeNumer(item.attendanceRate,item.idx)"
                      ></el-input>
                      <span v-if="ifCheck[0]==0">%&nbsp;≤&nbsp;上座率&nbsp;＜&nbsp;</span>
                      <el-input
                        v-if="ifCheck[0]==0"
                        type="number"
                        style="width: 80px;"
                        v-model="item.attendanceRate1"
                        placeholder="0"
                        @change="changeNumer1(item.attendanceRate1,item.idx)"
                      ></el-input>
                      <span v-if="ifCheck[0]==0">%&nbsp;&nbsp;</span>
                      <span v-if="ifCheck[0]==0&&ifCheck[1]">且</span>
                      <span v-if="ifCheck[0]==1||ifCheck[1]==1">&nbsp;&nbsp;开映前&nbsp;</span>
                      <el-input
                        v-if="ifCheck[0]==1||ifCheck[1]==1"
                        type="number"
                        style="width: 80px;"
                        v-model="item.opening"
                        placeholder="0"
                        @change="changeTime(item.opening,item.idx)"
                      ></el-input>
                      <span v-if="ifCheck[0]==1||ifCheck[1]==1">小时；</span>
                      <el-select
                        v-if="ifCheck[0]==0||ifCheck[0]==1"
                        v-model="item.type"
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in opt1"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        ></el-option>
                      </el-select>
                      <el-input
                        v-if="ifCheck[0]==0||ifCheck[0]==1"
                        type="number"
                        style="width: 80px;"
                        v-model="item.price"
                        placeholder="0"
                        @change="changeNumer2(item.price,item.idx)"
                      ></el-input>
                      <a v-if="ifCheck[0]==0||ifCheck[0]==1" @click="delRuler(item.idx)">删除</a>
                    </p>
                    <a v-if="ifCheck[0]==0||ifCheck[0]==1" @click="addRuler">添加规则</a>
                  </div>
                </div>
              </el-form-item>
              <!-- <div class="canal-pirce-input">
              <span>渠道代收费</span><em>¥</em>
              <el-input>0.10</el-input>
              </div>-->
            </div>
          </el-collapse-item>
        </div>
      </el-form>
    </el-collapse>
    <div class="price-add-button-wrap">
      <div class="btn-area">
        <el-button type="primary" @click="priceprogramSave('rulesSizeForm')" :disabled="pd">保存</el-button>
        <el-button @click="cancelFun" :disabled="pd">取消</el-button>
      </div>
    </div>
    <fixStepTool :stepData="stepData.stepList"></fixStepTool>
    <cinemaSelect
      ref="checkNode"
      :selectCinemaStatus="selectCinemaStatus"
      :getCinemaTreeList="getCinemaTreeList"
      @getSelectedCinema="getSelectedCinema"
      @selectCinemaClose="selectCinemaClose"
      :ciCinemaList="sizeForm.ciCinemaList"
    ></cinemaSelect>
  </div>
</template>

<script>
import FixStepTool from "ctm/components/fix-step-tool/fix-step-tool";
import fixStepMixin from "ctm/mixins/fixStepTool";
import cinemaSelect from "ctm/components/common/check";
import getCinema from "./getCinema";
import cinemaTable from "./cinemaTable";
const cityOptions1 = [
  {
    name: "周一",
    value: "monday"
  },
  {
    name: "周二",
    value: "tuesday"
  },
  {
    name: "周三",
    value: "wednesday"
  },
  {
    name: "周四",
    value: "thursday"
  },
  {
    name: "周五",
    value: "friday"
  }
];
const cityOptions2 = [
  {
    name: "周六",
    value: "saturday"
  },
  {
    name: "周日",
    value: "sunday"
  }
];
// const week = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]
export default {
  mixins: [fixStepMixin],
  // flag: {
  //   opt(){
  //     this.opt = "opt2";
  //   }
  // },
  data() {
    //  var validateTimeArea= (rule, value, callback) => {

    //     if ( !(this.sizeForm.tmList.length>0 && (this.sizeForm.tmList[0].flagWeekArr.length>0 || this.sizeForm.tmList[0].flagWeekendArr.length>0) (this.sizeForm.tmList[0].startTm != '' && this.sizeForm.tmList[0].endTm != '')) ) {
    //       callback(new Error('请输入适用时段'));
    //     } else {
    //       callback();
    //     }
    //   };
    return {
      dateClick:false,
      pd: false,
      chooseCinemas1: "",
      ifCheck: [],
      lifeCyclelist: [],
      activeList: [
        {
          idx: 0,
          attendanceRate: null,
          attendanceRate1: null,
          opening: null,
          price: null,
          type: 0
        }
      ],
      disVersionList2: [
        { idx: 0, label: "上座率动态调价" },
        { idx: 1, label: "开映前多少小时动态调价" }
      ],
      disVersionList1: [
        { idx: 0, label: "第1周" },
        { idx: 1, label: "第2周" },
        { idx: 2, label: "第3周" },
        { idx: 3, label: "第4周" },
        { idx: 4, label: "第5周" }
      ],
      lifeCycleList: [
        {
          value: 0,
          label: "不限"
        },
        {
          value: 1,
          label: "指定影片生命周期"
        }
      ],
      checkList: [],
      checkList1: [],
      hidd: "hide",
      hidde: "hide",
      hidden: "hide",
      tableData: [],
      options: [
        {
          value: 0,
          label: "不执行分区定价"
        },
        {
          value: 1,
          label: "执行分区定价"
        }
      ],
      options1: [
        {
          value: 0,
          label: "不执行动态调价"
        },
        {
          value: 1,
          label: "执行动态调价"
        }
      ],
      options2: [
        {
          value: 0,
          label: "不限"
        },
        {
          value: 1,
          label: "指定影厅"
        }
      ],
      opt1: [
        {
          value: 0,
          label: "出票价+N元"
        },
        {
          value: 1,
          label: "出票价-N元"
        },
        {
          value: 2,
          label: "出票价打折%"
        }
      ],
      cinemaTypeList: [],
      applicableFilm1: 0,
      rulers: 0,
      hid: "hide",
      pricing: 0,
      pricing1: 0,
      pricing2: 0,
      pri: 0,
      pric: 0,
      check: false,
      checked1: false,
      checked: false, //统一定价默认状态
      isSome: false, // 是否选择部分
      useMovie: 1, // 是否全部
      chooseCinemas: "", // 选择的影院
      flagWeekArr: [],
      flagWeekendArr: [],
      cinemaUids: "", //影院uid集合
      //交互部分****************
      selectCinemaStatus: false,
      getCinemaTreeList: [],
      activeTab: "first",
      activeNames: ["1", "2", "3"],
      stepData: {
        stepEl: ".el-collapse-item",
        stepList: [
          {
            name: "基础信息",
            isactive: false
          },
          {
            name: "触发条件",
            isactive: false
          },
          {
            name: "价格体系",
            isactive: false
          }
        ]
      },
      // stepData 固定格式
      // stepEl: 计算高度的 元素
      // stepList: 定制悬浮层信息
      // ********************
      //触发条件
      forbbidenFlag: 0,
      weekDay_checkAll: false,
      isIndeterminate_week: false,
      weekendDay_checkAll: false,
      isIndeterminate_weekend: false,

      cities1: cityOptions1,
      cities2: cityOptions2,
      // isIndeterminate: true,
      // *************柜台/自助****************
      ttVoList: [],
      formTtVoList: [],
      disVersionCheckAll: false,
      // 适用影片版本
      price_disVersion_1: [],
      price_disVersion_2: [],
      disVersion_checkAll_1: false,
      disVersion_checkAll_2: false,
      disVersion_isIndeterminate_1: false,
      disVersion_isIndeterminate_2: false,
      // 渠道选中值
      price_Channel_1: [],
      price_Channel_2: [],
      ciPriceSaleChannelVoList_1: [],
      ciPriceSaleChannelVoList_2: [],
      // Channel_checkAll:false,
      //票类增加
      price_tickettype: [],
      flag: 1,
      // 可选参数******/
      HallTypeList: [],
      tickettypeList: [],
      disVersionList: [],
      movieList: [],
      channelsList_1: [],
      channelsList_2: [],
      // *************线上网络****************
      priceNetSale: [],
      formPriceNetSale: [],
      testmodle: {
        sunday: "",
        saturday: ""
      },
      //业务数据部分
      sizeForm: {
        ciPriceProgram: {
          name: "",
          status: 1,
          priority: "",
          startDy: "",
          endDy: "",
          ciPriceHallType: [],
          tiemStart_end: [],
          movieCodeList: []
        },
        // weekDay_1: [],
        // weekDay_2: [],
        ciPriceSaleChannelVoList: [],
        ciCinemaList: [
          // {
          //   uid: "cd83a2a7-734e-4861-a7bb-bec328aefb9f"
          // }
        ],
        schBashHallTypeList: [],
        tmList: [
          {
            // id: 1,
            uid: "",
            tenantId: "",
            programUid: "",
            startTm: "2019/1/1 00:00:00",
            endTm: "2019/1/1 23:59:00",
            monday: "0",
            tuesday: "0",
            wednesday: "0",
            thursday: "0",
            friday: "0",
            saturday: "0",
            sunday: "0",
            delFlag: "",
            createTime: "",
            updateTime: "",
            //业务需要字段
            weekDay_checkAll: false,
            isIndeterminate_week: false,
            weekendDay_checkAll: false,
            isIndeterminate_weekend: false,
            flagWeekArr: [],
            flagWeekendArr: []
          }
        ],
        schBashMovieList: []
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入方案名称",
            trigger: "blur"
          },
          {
            max: 15,
            message: "长度不超过15 个字符",
            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,
            message: "请选择方案状态",
            trigger: "change"
          }
        ],
        priority: [
          {
            required: true,
            message: "请输入方案优先级",
            trigger: "blur"
          }
          //{ type: "number", message: "优先级别只能为数值", trigger: "change" }
        ],
        ciPriceHallType: [
          {
            type: "array",
            required: true,
            message: "请选择影厅",
            trigger: "change"
          }
        ],
        tiemStart_end: [
          {
            required: true,
            message: "请选择有效日期",
            trigger: "change"
          }
        ],
        movieCodeList: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个影片",
            trigger: "change"
          }
        ]
        // tmList:[
        //  {  required: true,validator: validateTimeArea, trigger: 'change' }]
        // resource: [
        //   { required: true, message: '请选择活动资源', trigger: 'change' }
        // ],
        // desc: [
        //   { required: true, message: '请填写活动形式', trigger: 'blur' }
        // ]
      }
    };
  },
  created() {
    console.log(this.sizeForm.ciPriceProgram.tiemStart_end)
    this.getHallTypeList();
    this.getTickettypeList();
    this.getDisVersionList();
    // this.getMovieList();
    this.getChannelList(0);
    this.getChannelList(2);
    this.getCinemaLi();
    this.$ctmList
      .getRegionTypeList()
      .then(ret => {
        if (ret.code == 200) {
          this.tableData = ret.data;
          this.tableData.forEach(item => {
            this.$set(item, "price", null);
          });
          console.log(this.tableData);
        }
      })
      .catch(() => {
        console.log("哪里出错了，检擦一下哥哥");
      });
  },
  mounted() {},
  updated: function() {},
  methods: {
    dateAdd(startDate) {
        startDate = new Date(startDate);
        startDate = +startDate + 1000*60*60*24;
        startDate = new Date(startDate);
        var startMonth = startDate.getMonth()+1;
        if(startMonth<10){
          startMonth = '0'+startMonth
        }
        var startDay = startDate.getDate();
        if(startDay<10){
          startDay = '0'+startDay
        }
        var nextStartDate = startDate.getFullYear()+"-"+startMonth+"-"+startDay;
        return nextStartDate;
    },
    dateChange(){
      console.log(this.sizeForm.ciPriceProgram.tiemStart_end)
      if(this.sizeForm.ciPriceProgram.tiemStart_end!=null){
        this.dateClick = true;
      }else{
        this.dateClick = false;
      }
    },
    getCinemaLi(val = 1, names, code) {
      let params = {
        // is_public_value: 0,
        // movieCode: "",
        pageNum: val,
        pageSize: 10,
        cinemaName: names || "",
        cinemaCode: code || ""
      };
      this.$ctmList
        .cinemaFindList(params)
        .then(res => {
          this.$refs.chooseCinema1.gridData = res.data.records;
          this.$refs.chooseCinema1.pageData = res.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    searchUser1(name, code) {
      console.log(name, code);
      this.getCinemaLi(1, name, code);
    },
    chooseUser1(arr) {
      this.chooseCinemas1 = "";
      arr.forEach(item => {
        this.chooseCinemas1 += item.cinemaName + ",";
      });
      this.chooseCinemas1 = this.chooseCinemas1.slice(
        0,
        this.chooseCinemas1.length - 1
      );
      let self = this;
      self.sizeForm.ciCinemaList = arr;
      let UidArr = [];
      self.sizeForm.ciCinemaList.forEach((item, index) => {
        this.$set(item, "uid", item.cinemaUid);
        UidArr.push(item.uid);
      });
      self.cinemaUids = UidArr.join(",");
      console.log(self.cinemaUids);
      self.getTickettypeList();
      self.getMovieList();
      self.ttVoList = [];
      this.cinemaLists();
    },
    chooseCinema1() {
      event.srcElement.blur();
      // if (!this.cinemaUids) {
      //   this.$alert("请先选择影院", "提示", {
      //     confirmButtonText: "确定"
      //   });
      // } else {
      this.$refs.chooseCinema1.dialogTableVisible = true;
      this.$refs.chooseCinema1.title = "选择影院"; //  关联代码 getCinema
      this.$refs.chooseCinema1.title1 = "影院名称";
      this.$refs.chooseCinema1.heightOver = "630px";
      // }
    },
    changeCurrentPage1(val, name, code) {
      console.log(val, name, code);
      this.getCinemaLi(val, name, code);
    },
    emptyText() {
      console.log(this.cinemaTypeList);
      this.cinemaTypeList.forEach(item => {
        item.hallList = [];
      });
    },
    handleClose(scope, idx) {
      console.log(scope.$index);
      this.$delete(this.cinemaTypeList[scope.$index].hallList, idx);
      console.log(this.cinemaTypeList[scope.$index].hallList);
    },
    //适用影厅请求
    cinemaLists() {
      var cinemaList = this.sizeForm.ciCinemaList;
      var cinList = this.sizeForm.schBashHallTypeList;
      var cinemaLists = [];
      var cinemaLi = [];
      cinemaList.forEach(item => {
        cinemaLists.push(item.uid);
      });
      cinList.forEach(item => {
        cinemaLi.push(item.keyCode);
      });
      console.log("data", cinemaLists, cinemaLi);
      this.$ctmList
        .findHallByType({
          cinemaUidList: cinemaLists,
          hallTypeList: cinemaLi
        })
        .then(res => {
          console.log(res.data);
          if (res.code == 200) {
            this.cinemaTypeList = res.data;
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    applicableFilm(val) {
      if (val == 1) {
        this.hid = "show";
        this.cinemaLists();
        this.applicableFilm1 = val;
        // this.$ctmList
        //   .findHallByType()
        //   .then(res => {
        //     console.log(res);
        //   })
        //   .catch(() => {
        //     console.log(error);
        //   });
      } else if (val == 0) {
        this.hid = "hide";
        this.cinemaLists();
        this.applicableFilm1 = val;
      }
    },
    //调价规则输入信息转换 且不可为0
    changeNumer(val, idx) {
      if(this.activeList[idx].attendanceRate1){
        if(val*1 > this.activeList[idx].attendanceRate1*1){
            this.activeList[idx].attendanceRate = null;
            this.$message({
            message: "最小上座率需小于最大上座率",
            type: "warning"
            });
            return;
        }
      }
      let newVal = parseFloat(val);
      if (newVal < 0) {
        this.activeList[idx].attendanceRate = null;
        this.$message({
          message: "不得小于0",
          type: "warning"
        });
        return;
      }
      this.activeList[idx].attendanceRate = newVal.toFixed(1);
    },
    changeNumer1(val, idx) {
      if(this.activeList[idx].attendanceRate){
          if(val*1 < this.activeList[idx].attendanceRate*1){
              this.activeList[idx].attendanceRate1 = null;
              this.$message({
                message: "最大上座率需大于最小上座率",
                type: "warning"
              });
              return;
          }
      }
      let newVal = parseFloat(val);
      if (newVal < 0) {
        this.activeList[idx].attendanceRate1 = null;
        this.$message({
          message: "不得小于0",
          type: "warning"
        });
        return;
      }
      this.activeList[idx].attendanceRate1 = newVal.toFixed(1);
    },
    changeNumer2(val, idx) {
        let newVal = parseFloat(val);
        if (newVal < 0) {
            this.activeList[idx].price = null;
            this.$message({
            message: "不得小于0",
            type: "warning"
            });
            return;
        }else if(newVal > 999.99){
            this.activeList[idx].price = null;
            this.$message({
            message: "不得高于999.99",
            type: "warning"
            });
            return;
        }
        if(this.ttVoList.length>0){
            var z = true;
            this.ttVoList.forEach(item =>{
                    if(this.pricing == 1){
                        var a = true;
                        this.tableData.forEach(i =>{
                            if(a){
                              if(i.price != null){
                                if(this.activeList[idx].type==0){
                                    var p = val*1 + item.price*1 +i.price*1;
                                    if(p<=0){
                                        this.$message({
                                            message: "总和不得小于等于0",
                                            type: "warning"
                                        })
                                        a =false;
                                        z =false;
                                        this.activeList[idx].price = null;
                                    }
                                    if(p >999.99){
                                        this.$message({
                                            message: "总和不得超过999.99",
                                            type: "warning"
                                        })
                                        a =false;
                                        z =false;
                                        this.activeList[idx].price = null;
                                    }else if(0<p&&p<=999.99){
                                        this.activeList[idx].price = newVal.toFixed(2);
                                    }
                                }else if(this.activeList[idx].type==1){
                                    var p = val*-1 + item.price*1 +i.price*1;
                                    if(p<=0){
                                      console.log(p)
                                        this.$message({
                                            message: "总和不得小于等于01",
                                            type: "warning"
                                        })
                                        a =false;
                                        z =false;
                                        this.activeList[idx].price = null;
                                        console.log(this.activeList[idx].price)
                                    }
                                    if(p >999.99){
                                        this.$message({
                                            message: "总和不得超过999.99",
                                            type: "warning"
                                        })
                                        a =false;
                                        z =false;
                                        this.activeList[idx].price = null;
                                    }else if(p>0&&p<=999.99){
                                        this.activeList[idx].price = newVal.toFixed(2);
                                    }
                                }
                              }
                            }
                        })
                    }else if(this.activeList[idx].type==0){
                        var p = val*1 + item.price*1 ;
                        if(p <=0){
                            this.$message({
                                message: "总和不得小于等于0",
                                type: "warning"
                            })
                            z =false;
                            this.activeList[idx].price = null;
                        }
                        if(p >999.99){
                            this.$message({
                                message: "总和不得超过999.99",
                                type: "warning"
                            })
                            z =false;
                            this.activeList[idx].price = null;
                        }else if(p>0&&p<=999.99){
                            z =false;
                            this.activeList[idx].price = newVal.toFixed(2);
                        }
                    }else if(this.activeList[idx].type==1){
                        var p = val*-1 + item.price*1 
                        if(p <=0){
                            this.$message({
                                message: "总和不得小于等于0",
                                type: "warning"
                            })
                            z =false;
                            this.activeList[idx].price = null;
                        }
                        if(p >999.99){
                            this.$message({
                                message: "总和不得超过999.99",
                                type: "warning"
                            })
                            z =false;
                            this.activeList[idx].price = null;
                        }else if(p<=999.99&&p>0){
                            console.log(1)
                            this.activeList[idx].price = newVal.toFixed(2);
                        }
                    }else{
                        this.activeList[idx].price = newVal.toFixed(2);
                    }
                
            })
        }
        if(this.priceNetSale.length>0){
            var z = true;
            this.priceNetSale.forEach(item =>{
                    if(this.pricing == 1){
                        var a = true;
                        this.tableData.forEach(i =>{
                            if(a){
                                if(this.activeList[idx].type==0){
                                    var p = val*1 + item.price*1 +i.price*1;
                                    if(p<=0){
                                        this.$message({
                                            message: "总和不得小于等于0",
                                            type: "warning"
                                        })
                                        a =false;
                                        z =false;
                                        this.activeList[idx].price = null;
                                    }
                                    if(p >999.99){
                                        this.$message({
                                            message: "总和不得超过999.99",
                                            type: "warning"
                                        })
                                        a =false;
                                        z =false;
                                        this.activeList[idx].price = null;
                                    }else if(0<p&&p<=999.99){
                                        this.activeList[idx].price = newVal.toFixed(2);
                                    }
                                }else if(this.activeList[idx].type==1){
                                    var p = val*-1 + item.price*1 +i.price*1;
                                    if(p<=0){
                                        this.$message({
                                            message: "总和不得小于等于0",
                                            type: "warning"
                                        })
                                        a =false;
                                        z =false;
                                        this.activeList[idx].price = null;
                                    }
                                    if(p >999.99){
                                        this.$message({
                                            message: "总和不得超过999.99",
                                            type: "warning"
                                        })
                                        a =false;
                                        z =false;
                                        this.activeList[idx].price = null;
                                    }else if(p>0&&p<=999.99){
                                        this.activeList[idx].price = newVal.toFixed(2);
                                    }
                                }
                            }
                        })
                    }else if(this.activeList[idx].type==0){
                        var p = val*1 + item.price*1 ;
                        if(p <=0){
                            this.$message({
                                message: "总和不得小于等于0",
                                type: "warning"
                            })
                            z =false;
                            this.activeList[idx].price = null;
                        }
                        if(p >999.99){
                            this.$message({
                                message: "总和不得超过999.99",
                                type: "warning"
                            })
                            z =false;
                            this.activeList[idx].price = null;
                        }else if(p>0&&p<=999.99){
                            z =false;
                            this.activeList[idx].price = newVal.toFixed(2);
                        }
                    }else if(this.activeList[idx].type==1){
                        var p = val*-1 + item.price*1 
                        if(p <=0){
                            this.$message({
                                message: "总和不得小于等于0",
                                type: "warning"
                            })
                            z =false;
                            this.activeList[idx].price = null;
                        }
                        if(p >999.99){
                            this.$message({
                                message: "总和不得超过999.99",
                                type: "warning"
                            })
                            z =false;
                            this.activeList[idx].price = null;
                        }else if(p<=999.99&&p>0){
                            console.log(1)
                            this.activeList[idx].price = newVal.toFixed(2);
                        }
                    }else{
                        this.activeList[idx].price = newVal.toFixed(2);
                    }
                
            })
        }
        if(this.ttVoList.length==0&&this.priceNetSale.length==0){
          this.tableData[index].price = newVal.toFixed(2);
        }
    },
    changeTime(val, idx) {
      let newVal = parseFloat(val);
      if (newVal < 0) {
        this.activeList[idx].opening = null;
        this.$message({
          message: "不得小于0",
          type: "warning"
        });
        return;
      }
      this.activeList[idx].opening = newVal.toFixed(1);
    },
    lifeCycle(val) {
      console.log(val);
      if (val == 1) {
        this.hidd = "show";
      } else if (val == 0) {
        this.hidd = "hide";
      }
    },
    del(idx) {
      this.$delete(this.disVersionList1, idx);
    },
    delRuler(idx) {
      this.$delete(this.activeList, idx);
    },
    add() {
      var a = this.disVersionList1.length;
      var b = a + 1;
      this.$set(this.disVersionList1, a, {
        idx: a,
        label: "第" + b + "周"
      });
    },
    addRuler() {
      var a = this.activeList.length ? this.activeList.length : 0;
      this.$set(this.activeList, a, {
        idx: a,
        attendanceRate: null,
        attendanceRate1: null,
        opening: null,
        type: 0
      });
      console.log(this.activeList);
    },
    //影片生命周期
    lifeCycle1(value) {
      let channelArr = [];
      let resulValue = value;
      this.disVersionList1.forEach((item, index) => {
        resulValue.forEach((value, i) => {
          if (item.idx == value) {
            channelArr.push(item);
          }
        });
      });
      this.lifeCyclelist = channelArr; //生命周期选中数据
      console.log(" channelArr", channelArr);
    },
    checklist(value) {
      let channelArr = [];
      let resulValue = value;
      this.disVersionList2.forEach((item, index) => {
        resulValue.forEach((value, i) => {
          if (item.idx == value) {
            channelArr.push(item.idx);
          }
        });
      });
      this.ifCheck = channelArr;
      console.log(" channelArr", channelArr);
    },
    dynamicPrice(val) {
      console.log(val);
      if (val == 1) {
        this.pricing1 = val;
        this.hidde = "show";
      } else if (val == 0) {
        this.hidde = "hide";
        this.pricing1 = val;
      }
    },
    zoningPricing(val) {
      console.log(val);
      if (val == 1) {
        this.pricing = val;
        this.hidden = "show";
      } else if (val == 0) {
        this.hidden = "hide";
        this.pricing = val;
      }
    },
    handleCheckAllChange(val) {
      console.log(val);
      if (val) {
        this.checked = val;
        for (var i = 0; i < this.ttVoList.length; i++) {
          if (i != 0) {
            this.$set(this.ttVoList[i], "price", null);
          }
        }
      } else {
        this.checked = val;
        if (this.ttVoList.length != 0) {
          this.pri = this.ttVoList[0].price;
        }
        this.ttVoList_Fun();
      }
      console.log(this.formTtVoList);
    },
    handleCheckAllChange1(val) {
      console.log(val);
      if (val) {
        this.checked1 = val;
        for (var j = 0; j < this.priceNetSale.length; j++) {
          if (j != 0) {
            this.$set(this.priceNetSale[j], "price", null);
          }
        }
      } else {
        this.checked1 = val;
        if (this.priceNetSale.length != 0) {
          this.pric = this.priceNetSale[0].price;
        }
        this.priceNetSale_Fun();
      }
      console.log(this.priceNetSale);
    },
    //=========================================================================
    changeCinema(val) {
      if (val == 1) {
        this.sizeForm.schBashMovieList = [];
      }
      // 是否出现输入框
      this.isSome = val == "1" ? false : true;
      this.useMovie = val;
      if (val == 2) {
        this.getMovieList();
      }

      // console.log(JSON.stringify(params))
      // this.$ctmList
      //   .ByCinemaUidsLoadMovies(params)
      //   .then(ret => {
      //     if (ret.data) {
      //       // self.movieList = ret.data;
      //       this.$refs.chooseCinema.gridData = ret.data.list;
      //       this.$refs.chooseCinema.pageData = ret.data;
      //     }
      //   })
      //   .catch(() => {
      //     console.log("哪里出错了，检擦一下哥哥");
      //   });
    },
    searchUser(name) {
      console.log(name);
      this.getMovieList(1, name);
    },
    chooseUser(arr) {
      console.log(arr);
      this.sizeForm.schBashMovieList = arr;
      this.chooseCinemas = "";
      arr.forEach(item => {
        this.chooseCinemas += item.movieName + ",";
      });
      this.chooseCinemas = this.chooseCinemas.slice(
        0,
        this.chooseCinemas.length - 1
      );
    },
    chooseCinema() {
      event.srcElement.blur();
      // if (!this.cinemaUids) {
      //   this.$alert("请先选择影院", "提示", {
      //     confirmButtonText: "确定"
      //   });
      // } else {
      this.$refs.chooseCinema.dialogTableVisible = true;
      this.$refs.chooseCinema.title = "影片名称"; //  关联代码 getMovieList
      this.$refs.chooseCinema.title1 = "影片名称";
      this.$refs.chooseCinema.heightOver = "630px";
      // }
    },
    changeCurrentPage(val, name) {
      console.log(val);
      this.getMovieList(val, name);
    },
    toggleSelection1(rows) {
      let self = this;
      if (rows) {
        rows.forEach(row => {
          self.$refs.multipleTable1.toggleRowSelection(row);
        });
      } else {
        self.$refs.multipleTable1.clearSelection();
      }
    },
    toggleSelection2(rows) {
      let self = this;
      if (rows) {
        rows.forEach(row => {
          self.$refs.multipleTable2.toggleRowSelection(row);
        });
      } else {
        self.$refs.multipleTable2.clearSelection();
      }
    },
    selectCinemaClose(val) {
      console.log("val8888888888888888888", val);
      this.selectCinemaStatus = val;
    },
    //选择影院方法
    // cinemaSelectFun() {
    //   let self = this;
    //   self.selectCinemaStatus = true;
    //   let data = {};
    //   self.$ctmList
    //     .getCinemaTreeList(data)
    //     .then(ret => {
    //       if (ret.data) {
    //         self.getCinemaTreeList = ret.data.children;
    //         console.log(
    //           "this.sizeForm.ciCinemaList",
    //           this.sizeForm.ciCinemaList
    //         );
    //         this.$nextTick(_ => {
    //           this.$refs.checkNode.initCheckedTreeNode(
    //             this.sizeForm.ciCinemaList
    //           );
    //         });
    //       }
    //     })
    //     .catch(() => {
    //       console.log("哪里出错了，检擦一下哥哥");
    //     });
    // },
    //获取已经选择的影院
    getSelectedCinema(val) {
      let self = this;
      console.log(val);
      self.sizeForm.ciCinemaList = val;
      let UidArr = [];
      self.sizeForm.ciCinemaList.forEach((item, index) => {
        UidArr.push(item.uid);
      });
      self.cinemaUids = UidArr.join(",");
      self.getTickettypeList();
      self.getMovieList();
      self.ttVoList = [];
      this.cinemaLists();
    },
    tableFixed(scope) {
      console.log("scope", scope);
    },
    alertTest($event, index) {
      console.log("$event", $event, index);
      console.log("sizeform.timelist.[]", this.sizeForm.tmList[index].monday);
    },
    getxxx(val) {
      console.log("val", val, typeof val);
    },
    getgg(val) {
      console.log("val", val, typeof val);
    },
    //交互部分方法********************************************************************************
    TimeStartChange() {
      let self = this;
      // console.log("val", item);
      if (self.sizeForm.tmList.length > 0) {
        resultTime = self.sizeForm.tmList.map((item, index) => {
          item.startTm =
            item.startTm.getHours() + ":" + item.startTm.getMinutes();
          item.endTm = item.endTm.getHours() + ":" + item.endTm.getMinutes();
          return item;
        });
        console.log("resultTime", resultTime);
      }
      // alert('0')
      //  self.forbbidenFlag = 0
      // alert('1')
      // if (
      //   item.endTm * 1 >item.startTm * 1
      // ) {

      // alert('2')
      // self.sizeForm.tmList[index].startTm = "";
      // self.sizeForm.tmList[index].endTm = "";
      // self.$message({
      //   message: "时间段不能重叠",
      //   type: "warning"
      // });
      // }
    },

    //增加时间
    addTimearea() {
      let self = this;

      if (this.sizeForm.tmList.length > 4) {
        this.$message({
          message: "时间段不能超过5个",
          type: "warning"
        });
        return;
      } else {
        this.sizeForm.tmList.push({
          // id: 1,
          uid: "",
          tenantId: "",
          programUid: "",
          startTm: "2019/1/1 00:00:00",
          endTm: "2019/1/1 23:59:00",
          monday: "0",
          tuesday: "0",
          wednesday: "0",
          thursday: "0",
          friday: "0",
          saturday: "0",
          sunday: "0",
          delFlag: "",
          createTime: "",
          updateTime: "",
          //业务需要字段
          weekDay_checkAll: false,
          isIndeterminate_week: false,
          weekendDay_checkAll: false,
          isIndeterminate_weekend: false,
          flagWeekArr: [],
          flagWeekendArr: []
        });
      }
    },
    //删除时间
    deleFun(item, index) {
      var flag = this.sizeForm.tmList.indexOf(item);
      if (index == 0) {
        this.$message({
          message: "必须保留一个时间段",
          type: "warning"
        });
        return;
      } else {
        if (flag > -1) {
          this.sizeForm.tmList.splice(flag, 1);
        }
      }
    },
    // //价格体系勾选
    // tableSelRule(row) {
    //  console.log('rowrrrrrrrrrrrrrrrrrrrrrrrrrrrr',row)
    // },

    handleSelectionTtVoListChange(val) {
      let self = this;
      self.formTtVoList = val;
      console.log("formTtVoList", self.formTtVoList);
    },
    handleSelectionPriceNetSaleChange(val) {
      let self = this;
      self.formPriceNetSale = val;
      console.log("formPriceNetSale", self.formPriceNetSale);
    },
    handleClick(tab, event) {
      if (tab.name === "second") {
        this.flag = 0;
      } else {
        this.flag = 1;
      }
    },
    // ****************************************************************************************
    //触发条件**********************************************************************************
    //工作日
    handleCheckedWeekChange($event, index) {
      let self = this;
      let event = $event * 1;

      // self.flagWeekArr =self.sizeForm.tmList
      if (event) {
        self.sizeForm.tmList[index].flagWeekArr.push(1);
      } else {
        self.sizeForm.tmList[index].flagWeekArr.pop();
      }
      let checkedCount = self.sizeForm.tmList[index].flagWeekArr.length;
      // debugger
      self.sizeForm.tmList[index].weekDay_checkAll =
        checkedCount === this.cities1.length;

      self.sizeForm.tmList[index].isIndeterminate_week =
        checkedCount > 0 && checkedCount < this.cities1.length;
    },
    handleCheckWeekAllChange($event, index) {
      let self = this;
      if ($event) {
        self.sizeForm.tmList[index].monday = "1";
        self.sizeForm.tmList[index].tuesday = "1";
        self.sizeForm.tmList[index].wednesday = "1";
        self.sizeForm.tmList[index].thursday = "1";
        self.sizeForm.tmList[index].friday = "1";
        self.sizeForm.tmList[index].flagWeekArr.push(1);
      } else {
        self.sizeForm.tmList[index].monday = "0";
        self.sizeForm.tmList[index].tuesday = "0";
        self.sizeForm.tmList[index].wednesday = "0";
        self.sizeForm.tmList[index].thursday = "0";
        self.sizeForm.tmList[index].friday = "0";
        self.sizeForm.tmList[index].flagWeekArr.pop();
      }
      self.sizeForm.tmList[index].isIndeterminate_week = false;
    },
    //周末
    handleCheckedWeekendChange($event, index) {
      let self = this;
      let event = $event * 1;
      if (event) {
        self.sizeForm.tmList[index].flagWeekendArr.push(1);
      } else {
        self.sizeForm.tmList[index].flagWeekendArr.pop();
      }
      let checkedCount = self.sizeForm.tmList[index].flagWeekendArr.length;
      self.sizeForm.tmList[index].weekendDay_checkAll =
        checkedCount === this.cities2.length;
      self.sizeForm.tmList[index].isIndeterminate_weekend =
        checkedCount > 0 && checkedCount < this.cities2.length;
    },
    handleCheckWeekendAllChange($event, index) {
      let self = this;
      if ($event) {
        self.sizeForm.tmList[index].saturday = "1";
        self.sizeForm.tmList[index].sunday = "1";
        self.isIndeterminate_week = true;
        self.sizeForm.tmList[index].flagWeekendArr.push(1);
      } else {
        self.sizeForm.tmList[index].saturday = "0";
        self.sizeForm.tmList[index].sunday = "0";
        self.isIndeterminate_week = false;
        self.sizeForm.tmList[index].flagWeekendArr.pop();
      }
      self.sizeForm.tmList[index].isIndeterminate_weekend = false;
    },
    // ****************************************************************************************
    // 线下模块方法**********************************************************************************************************
    handleCheckedDisVersion_Change(value) {
      let checkedCount = value.length;
      this.disVersion_checkAll_1 = checkedCount == this.disVersionList.length;
      this.disVersion_isIndeterminate_1 =
        checkedCount > 0 && checkedCount < this.disVersionList.length;
      this.ttVoList_Fun();
    },
    handleCheckedDisTickettype_Change(value) {
      let checkedCount = value.length;
      this.ttVoList_Fun();
    },

    disVersion_handleCheckAllChange_1(val) {
      let disVersionListCopy = [...this.disVersionList];
      let result = disVersionListCopy.map((item, index) => {
        return item.keyCode + "," + item.keyName;
      });
      if (result.length > 0) {
        this.price_disVersion_1 = val ? result : [];
        this.disVersion_isIndeterminate_1 = false;
        this.ttVoList_Fun();
      }
    },
    ttVoList_Fun() {
      let self = this;
      let resultArr = [];
      var oldArr = this.ttVoList;
      self.price_disVersion_1.forEach((item, i) => {
        if (self.price_tickettype.length > 0) {
          self.price_tickettype.forEach((item2, i2) => {
            //生成列表数组
            let resultItem = {
              price: 0,
              feeFlag: 0,
              sel: [
                {
                  label: "最低票价加价",
                  value: 1
                },
                {
                  label: "固定价格",
                  value: 0
                }
              ]
            };
            resultItem.ttUid = item2.split(",")[0];
            resultItem.ttName = item2.split(",")[1];
            resultItem.movieVersion = item.split(",")[0];
            resultItem.movieVersionName = item.split(",")[1];
            resultArr.push(resultItem);
          });
        }
      });
      self.ttVoList = resultArr;
      self.ttVoList.forEach(item=>{
        oldArr.forEach(i =>{
          if(item.movieVersionName == i.movieVersionName&&item.ttName==i.ttName){
            this.$set(item,'price',i.price)
          }
        })
      })
      if (this.checked) {
        for (var i = 0; i < this.ttVoList.length; i++) {
          if (i != 0) {
            this.$set(this.ttVoList[i], "price", null);
          }
        }
      } else {
        if (this.pri != 0) {
          for (var i = 0; i < this.ttVoList.length; i++) {
            this.$set(this.ttVoList[i], "price", this.pri);
          }
        }
      }
      if (resultArr.length > 0) {
        self.$nextTick(() => {
          self.toggleSelection1(resultArr);
        });
      }
    },
    // 线上售票方法********************************************************************************************
    handleCheckedDisVersion_Change_2(value) {
      let checkedCount = value.length;
      this.disVersion_checkAll_2 = checkedCount == this.disVersionList.length;
      this.disVersion_isIndeterminate_2 =
        checkedCount > 0 && checkedCount < this.disVersionList.length;
      this.priceNetSale_Fun();
    },
    disVersion_handleCheckAllChange_2(val) {
      let disVersionListCopy = [...this.disVersionList];
      let result = disVersionListCopy.map((item, index) => {
        return item.keyCode + "," + item.keyName;
      });
      if (result.length > 0) {
        this.price_disVersion_2 = val ? result : [];
        this.disVersion_isIndeterminate_2 = false;
        this.priceNetSale_Fun();
      }
    },
    handleCheckedChannel_change_2(value) {
      let self = this;
      let resulValue = value;
      let channelArr = [];
      self.channelsList_2.forEach((item, index) => {
        resulValue.forEach((value, i) => {
          if (item.uid == value) {
            console.log("value", value);

            channelArr.push(item);
          }
        });
      });
      self.ciPriceSaleChannelVoList_2 = channelArr;
      // console.log(" self.ciPriceSaleChannelVoList_2",  self.ciPriceSaleChannelVoList_2);
      // console.log('value',value)
    },
    handleCheckedChannel_change_1(value) {
      let self = this;
      let channelArr = [];
      let resulValue = value;
      self.channelsList_1.forEach((item, index) => {
        resulValue.forEach((value, i) => {
          if (item.uid == value) {
            channelArr.push(item);
          }
        });
      });
      self.ciPriceSaleChannelVoList_1 = channelArr;
      console.log(" channelArr", channelArr);
    },
    priceNetSale_Fun() {
      let self = this;
      var oldArr = self.priceNetSale;
      let resultArr = [];
      self.price_disVersion_2.forEach((item, i) => {
        //生成列表数组
        let resultItem = {
          price: 0,
          feeFlag: 0,
          sel: [
            {
              label: "最低票价加价",
              value: 1
            },
            {
              label: "固定价格",
              value: 0
            }
          ]
        };
        resultItem.movieVersion = item.split(",")[0];
        resultItem.movieVersionName = item.split(",")[1];
        resultArr.push(resultItem);
      });
      self.priceNetSale = resultArr;
      self.priceNetSale.forEach(item=>{
        oldArr.forEach(i =>{
          if(item.movieVersionName == i.movieVersionName&&item.ttName==i.ttName){
            this.$set(item,'price',i.price)
          }
        })
      })
      if (this.checked1) {
        for (var i = 0; i < this.priceNetSale.length; i++) {
          if (i != 0) {
            this.$set(this.priceNetSale[i], "price", null);
          }
        }
      } else {
        if (this.pric != 0) {
          for (var i = 0; i < this.priceNetSale.length; i++) {
            this.$set(this.priceNetSale[i], "price", this.pric);
          }
        }
      }
      if (resultArr.length > 0) {
        self.$nextTick(() => {
          self.toggleSelection2(resultArr);
        });
      }
    },
    priceChang(val, index) {
      let newVal = parseFloat(val);
      if(val >= 999.99){
          this.$message({
          message: "最高不得超过999.99",
          type: "warning"
          });
          this.tableData[index].price = null;
      }
      if(this.ttVoList.length>0){
          this.ttVoList.forEach(item =>{
                  if(this.pricing1==1){
                      this.activeList.forEach(i =>{
                          if(i.price != null){
                              if(i.type == 0){
                                  if(i.price*1 +item.price*1 + val*1> 999.99){
                                      this.$message({
                                          message: "最高不得超过999.99",
                                          type: "warning"
                                      });
                                      this.tableData[index].price = null;
                                  }else if(i.price*1 +item.price*1 + val*1<= 0){
                                      this.$message({
                                          message: "总和不得小于等于0",
                                          type: "warning"
                                      });
                                      this.tableData[index].price = null;
                                  }else{
                                      this.tableData[index].price = newVal.toFixed(2);
                                  }
                              }else if(i.type == 1){
                                  if(i.price*-1 +item.price*1 + val*1<= 0){
                                      this.$message({
                                          message: "总和不得小于等于0",
                                          type: "warning"
                                      });
                                      this.tableData[index].price = null;
                                  }
                              }else{
                                  this.tableData[index].price = newVal.toFixed(2);
                              }
                          }
                      })
                  }else if(item.price*1 + val*1 > 999.99){
                      this.$message({
                          message: "最高不得超过999.99",
                          type: "warning"
                      });
                      this.tableData[index].price = null;
                  }else if(item.price*1 + val*1 <= 0){
                      this.$message({
                          message: "总和不得小于等于0",
                          type: "warning"
                      });
                      this.tableData[index].price = null;
                  }else{
                      this.tableData[index].price = newVal.toFixed(2);
                  }
              
          })
      }
      if(this.priceNetSale.length>0){
          this.priceNetSale.forEach(item =>{
                  if(this.pricing1==1){
                      this.activeList.forEach(i =>{
                          if(i.price != null){
                              if(i.type == 0){
                                  if(i.price*1 +item.price*1 + val*1> 999.99){
                                      this.$message({
                                          message: "最高不得超过999.99",
                                          type: "warning"
                                      });
                                      this.tableData[index].price = null;
                                  }else if(i.price*1 +item.price*1 + val*1<= 0){
                                      this.$message({
                                          message: "总和不得小于等于0",
                                          type: "warning"
                                      });
                                      this.tableData[index].price = null;
                                  }else{
                                      this.tableData[index].price = newVal.toFixed(2);
                                  }
                              }else if(i.type == 1){
                                  if(i.price*-1 +item.price*1 + val*1<= 0){
                                      this.$message({
                                          message: "总和不得小于等于0",
                                          type: "warning"
                                      });
                                      this.tableData[index].price = null;
                                  }
                              }else{
                                  this.tableData[index].price = newVal.toFixed(2);
                              }
                          }
                      })
                  }else if(item.price*1 + val*1 > 999.99){
                      this.$message({
                          message: "最高不得超过999.99",
                          type: "warning"
                      });
                      this.tableData[index].price = null;
                  }else if(item.price*1 + val*1 <= 0){
                      this.$message({
                          message: "总和不得小于等于0",
                          type: "warning"
                      });
                      this.tableData[index].price = null;
                  }else{
                      this.tableData[index].price = newVal.toFixed(2);
                  }
              
          })
      }
      if(this.ttVoList.length==0&&this.priceNetSale.length==0){
        this.tableData[index].price = newVal.toFixed(2);
      }
    },
    //价格不能为负数
    priceChange1(val, index) {
        let newVal = parseFloat(val);
        if (newVal < 0) {
            this.ttVoList[index].price = 0;
            this.$message({
                message: "不得小于0",
                type: "warning"
            });
        }
        if (newVal > 999.99) {
            this.ttVoList[index].price = 0;
            this.$message({
                message: "不得高于999.99",
                type: "warning"
            });
        }
        if(this.tableData.length>0 && this.activeList.length>0){
            var a = true;
            this.activeList.forEach(item =>{
                this.tableData.forEach(i =>{
                    if(a){
                        if(i.price != null){
                            if(item.type == 0){
                                var p =val*1 + item.price*1+i.price*1;
                                if(p<=0){
                                    this.ttVoList[index].price = 0;
                                    this.$message({
                                        message: "总和不得小于等于0",
                                        type: "warning"
                                    });
                                    a =false;
                                }else if (p>999.99){
                                    this.ttVoList[index].price = 0;
                                    this.$message({
                                        message: "总和不得高于999.99",
                                        type: "warning"
                                    });
                                    a=false;
                                }else if(p<=999.99&&p>=0){
                                    this.ttVoList[index].price = newVal.toFixed(2);
                                }
                            }else if(item.type == 0){
                                var p =val*1 + item.price*1+i.price*-1;
                                if(p<=0){
                                    this.ttVoList[index].price = 0;
                                    this.$message({
                                        message: "总和不得小于等于0",
                                        type: "warning"
                                    });
                                    a =false;
                                }else if (p>999.99){
                                    this.ttVoList[index].price = 0;
                                    this.$message({
                                        message: "总和不得高于999.99",
                                        type: "warning"
                                    });
                                    a=false;
                                }else if(p<=999.99&&p>=0){
                                    this.ttVoList[index].price = newVal.toFixed(2);
                                }
                            }
                        }else{
                          this.ttVoList[index].price = newVal.toFixed(2);
                        }
                    }
                })
            })
        }else if(this.tableData.length>0){
            this.tableData.forEach(item =>{
                if(item.price != null){
                    var p = val*1 + item.price*1;
                    if(p<=0){
                        this.ttVoList[index].price = 0;
                        this.$message({
                            message: "总和不得小于等于0",
                            type: "warning"
                        });
                    }else if(p>999.99){
                        this.ttVoList[index].price = 0;
                        this.$message({
                            message: "总和不得高于999.99",
                            type: "warning"
                        });
                    }else if(p<=999.99&&p>=0){
                        this.ttVoList[index].price = newVal.toFixed(2);
                    }
                }else{
                  this.ttVoList[index].price = newVal.toFixed(2);
                }
            })
        }else if(this.activeList.length>0){
            var a = true;
            this.activeList.forEach(item =>{
                if(item.type == 0){
                  if(item.price != null){
                    if(a){
                        var p = val*1 + item.price*1;
                        if(p <0){
                            this.ttVoList[index].price = 0;
                            this.$message({
                                message: "总和不得小于等于0",
                                type: "warning"
                            });
                            a =false;
                        }else if (p>999.99) {
                            this.ttVoList[index].price = 0;
                            this.$message({
                                message: "总和不得高于999.99",
                                type: "warning"
                            });
                            a=false;
                        }else if(p<=999.99&&p>=0){
                            this.ttVoList[index].price = newVal.toFixed(2);
                        }
                    }
                  }else{
                    this.ttVoList[index].price = newVal.toFixed(2);
                  }
                }else if(item.type == 1){
                    if(a){
                        var p = val*1 + item.price*-1;
                        if(p <0){
                            this.ttVoList[index].price = 0;
                            this.$message({
                                message: "总和不得小于等于0",
                                type: "warning"
                            });
                            a =false;
                        }else if (p>999.99) {
                            this.ttVoList[index].price = 0;
                            this.$message({
                                message: "总和不得高于999.99",
                                type: "warning"
                            });
                            a=false;
                        }else if(p<=999.99&&p>=0){
                            this.ttVoList[index].price = newVal.toFixed(2);
                        }
                    }
                }
            })
        }else{
          this.ttVoList[index].price = newVal.toFixed(2);
        }
    },
    priceChange2(val, index) {
        let newVal = parseFloat(val);
        if (newVal < 0) {
            this.priceNetSale[index].price = 0;
            this.$message({
                message: "不得小于0",
                type: "warning"
            });
        }
        if (newVal > 999.99) {
            this.priceNetSale[index].price = 0;
            this.$message({
                message: "不得高于999.99",
                type: "warning"
            });
        }
        if(this.tableData.length>0 && this.activeList.length>0){
            var a = true;
            this.activeList.forEach(item =>{
                this.tableData.forEach(i =>{
                    if(a){
                        if(i.price != null){
                            if(item.type == 0){
                                var p =val*1 + item.price*1+i.price*1;
                                if(p<=0){
                                    this.priceNetSale[index].price = 0;
                                    this.$message({
                                        message: "总和不得小于等于0",
                                        type: "warning"
                                    });
                                    a =false;
                                }else if (p>999.99){
                                    this.priceNetSale[index].price = 0;
                                    this.$message({
                                        message: "总和不得高于999.99",
                                        type: "warning"
                                    });
                                    a=false;
                                }else if(p<=999.99&&p>=0){
                                    this.priceNetSale[index].price = newVal.toFixed(2);
                                }
                            }else if(item.type == 0){
                                var p =val*1 + item.price*1+i.price*-1;
                                if(p<=0){
                                    this.priceNetSale[index].price = 0;
                                    this.$message({
                                        message: "总和不得小于等于0",
                                        type: "warning"
                                    });
                                    a =false;
                                }else if (p>999.99){
                                    this.priceNetSale[index].price = 0;
                                    this.$message({
                                        message: "总和不得高于999.99",
                                        type: "warning"
                                    });
                                    a=false;
                                }else if(p<=999.99&&p>=0){
                                    this.priceNetSale[index].price = newVal.toFixed(2);
                                }
                            }
                        }else{
                          this.priceNetSale[index].price = newVal.toFixed(2);
                        }
                    }
                })
            })
        }else if(this.tableData.length>0){
            this.tableData.forEach(item =>{
                if(item.price != null){
                    var p = val*1 + item.price*1;
                    if(p<=0){
                        this.priceNetSale[index].price = 0;
                        this.$message({
                            message: "总和不得小于等于0",
                            type: "warning"
                        });
                    }else if(p>999.99){
                        this.priceNetSale[index].price = 0;
                        this.$message({
                            message: "总和不得高于999.99",
                            type: "warning"
                        });
                    }else if(p<=999.99&&p>=0){
                        this.priceNetSale[index].price = newVal.toFixed(2);
                    }
                }else{
                  this.priceNetSale[index].price = newVal.toFixed(2);
                }
            })
        }else if(this.activeList.length>0){
            var a = true;
            this.activeList.forEach(item =>{
                if(item.type == 0){
                  if(item.price != null){
                    if(a){
                        var p = val*1 + item.price*1;
                        if(p <0){
                            this.priceNetSale[index].price = 0;
                            this.$message({
                                message: "总和不得小于等于0",
                                type: "warning"
                            });
                            a =false;
                        }else if (p>999.99) {
                            this.priceNetSale[index].price = 0;
                            this.$message({
                                message: "总和不得高于999.99",
                                type: "warning"
                            });
                            a=false;
                        }else if(p<=999.99&&p>=0){
                            this.priceNetSale[index].price = newVal.toFixed(2);
                        }
                    }
                  }else{
                    this.priceNetSale[index].price = newVal.toFixed(2);
                  }
                }else if(item.type == 1){
                    if(a){
                        var p = val*1 + item.price*-1;
                        if(p <0){
                            this.priceNetSale[index].price = 0;
                            this.$message({
                                message: "总和不得小于等于0",
                                type: "warning"
                            });
                            a =false;
                        }else if (p>999.99) {
                            this.priceNetSale[index].price = 0;
                            this.$message({
                                message: "总和不得高于999.99",
                                type: "warning"
                            });
                            a=false;
                        }else if(p<=999.99&&p>=0){
                            this.priceNetSale[index].price = newVal.toFixed(2);
                        }
                    }
                }
            })
        }else{
          this.priceNetSale[index].price = newVal.toFixed(2);
        }
    },
    //********************************************************************************************** */
    //初始化获取页面可选项******************************************************************************
    getHallTypeList() {
      let self = this;
      let data = {
        name: "CI_HALL_TYPE"
      };
      this.$ctmList
        .cinemagetByName(data)
        .then(ret => {
          if (ret.code == 200) {
            self.HallTypeList = ret.data;
          }
        })
        .catch(() => {
          console.log("哪里出错了，检擦一下哥哥");
        });
    },
    getTickettypeList() {
      let self = this;
      let data = {
        type: 0,
        cinemaUids: self.cinemaUids
      };
      self.$ctmList
        .getTickettypeList(data)
        .then(ret => {
          if (ret.data) {
            self.tickettypeList = ret.data;
            self.tickettypeList.forEach((item, index) => {
              let result;
              if (item.name == "成人票") {
                self.price_tickettype = [];
                self.price_tickettype.push(item.uid + "," + item.name);
              }
            });
          }
        })
        .catch(() => {
          console.log("哪里出错了，检擦一下哥哥");
        });
    },
    getDisVersionList() {
      let self = this;
      let data = {
        name: "SCH_MOVIE_DIS_VERSION"
      };
      self.$ctmList
        .disVersionList(data)
        .then(ret => {
          if (ret.code == 200) {
            self.disVersionList = ret.data;
          }
        })
        .catch(() => {
          console.log("哪里出错了，检擦一下哥哥");
        });
    },
    //获取影片数据
    getMovieList(current = 1, name) {
      let self = this;
      let params = {
        // is_public_value: 0,
        // movieCode: "",
        movieName: name || "",
        pageNum: current,
        pageSize: 10,
        uids: self.cinemaUids || ""
      };
      // console.log(JSON.stringify(params))
      this.$ctmList
        .findMovieByCinemaUids(params)
        .then(ret => {
          this.$refs.chooseCinema.gridData = ret.data.records;
          this.$refs.chooseCinema.pageData = ret.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
    getChannelList(val) {
      let self = this;
      let params = {
        channelNature: val
      };
      self.$ctmList
        .getPriceAddChannelList(params)
        .then(ret => {
          if (ret.data) {
            console.log("ret.data", ret.data);
            if (val == 0) {
              self.channelsList_1 = ret.data;
            } else if (val == 2) {
              self.channelsList_2 = ret.data;
            }
          }
        })
        .catch(() => {
          console.log("哪里出错了，检擦一下哥哥");
        });
    },
    // ****************************************************************************************
    //数据格式转换方法**************************************************************************
    getTimearrFun(val) {
      let arr = [];
      for (let i in val) {
        arr.push(val[i]);
      }
      return arr;
    },
    movieListChange() {
      // let self = this;
      // let resultMovieList = [];
      // self.movieList.forEach((item, i) => {
      //   self.sizeForm.ciPriceProgram.movieCodeList.forEach((item_2, i_2) => {
      //     if (item.movieCode == item_2) {
      //       resultMovieList.push(item);
      //     }
      //   });
      // });
      // if (self.sizeForm.ciPriceProgram.movieCodeList.length == 1 && self.sizeForm.ciPriceProgram.movieCodeList[0] ==
      //   'limit') {
      //   self.sizeForm.schBashMovieList = []
      // } else {
      //   self.sizeForm.schBashMovieList = resultMovieList;
      // }
    },
    ciPriceHallTypeChange() {
      let self = this;
      let resultHallTypeList = [];
      self.HallTypeList.forEach((item, i) => {
        self.sizeForm.ciPriceProgram.ciPriceHallType.forEach((item_2, i_2) => {
          if (item.keyCode == item_2) {
            resultHallTypeList.push(item);
          }
        });
      });
      if (
        self.sizeForm.ciPriceProgram.ciPriceHallType.length == 1 &&
        self.sizeForm.ciPriceProgram.ciPriceHallType[0] == "limit"
      ) {
        self.sizeForm.schBashHallTypeList = [];
      } else {
        self.sizeForm.schBashHallTypeList = resultHallTypeList;
      }
      this.cinemaLists();
    },
    findTime($event, index) {
      console.log("event:", $event);
    },
    // *************************************************************************************************
    // 保存价格方案
    priceprogramSave(rulesSizeForm) {
      let self = this;
      // console.log("this.$refs[rulesSizeForm]", this.$refs[rulesSizeForm]);
      this.$refs[rulesSizeForm].validate(valid => {
        if (valid) {
          this.pd = true;
          if (this.pricing2 == 1) {
            var useMovieLifeCycle = 0;
            var movieLifeCycleStr = "";
            this.lifeCyclelist.forEach((item, index) => {
              var a = item.idx + 1;
              movieLifeCycleStr += a + ",";
            });
            movieLifeCycleStr = movieLifeCycleStr.substring(
              0,
              movieLifeCycleStr.length - 1
            );
          } else {
            var useMovieLifeCycle = 1;
          }
          this.sizeForm.schBashHallTypeList.forEach(item => {
            this.$set(item, "type", item.keyCode);
          });
          console.log(this.sizeForm.schBashHallTypeList);
          //影厅类型数据处理
          var ciPriceHall = this.cinemaTypeList;
          // this.cinemaTypeList
          var priceRegionList = [];
          this.tableData.forEach((item, index) => {
            index = {
              price: null,
              regionTypeUid: null
            };
            index.price = item.price;
            index.regionTypeUid = item.uid;
            priceRegionList.push(index);
          });
          if (this.ifCheck[0] == 0 && this.ifCheck[1] == 1) {
            var useOccupancyFlag = 1;
            var useStartTimeFlag = 1;
          } else if (this.ifCheck[0] == 1) {
            var useStartTimeFlag = 1;
            var useOccupancyFlag = 0;
          } else if (this.ifCheck[0] == 0) {
            var useOccupancyFlag = 1;
            var useStartTimeFlag = 0;
          } else {
            var useOccupancyFlag = 0;
            var useStartTimeFlag = 0;
          }
          if (this.ifCheck[0] == 0 || 1) {
            var rulers = this.rulers;
            var priceAdjustmentList = [];
            console.log(this.activeList);
            this.activeList.forEach((item, index) => {
              index = {
                adjustmentType: null,
                occupancyMax: null,
                occupancyMin: null,
                percentage: null,
                price: null,
                time: null,
                useOccupancyFlag: null,
                useStartTimeFlag: null
              };
              if (item.type == 0 || 1) {
                index.adjustmentType = 1;
                // this.$set(item,'adjustmentType',1)
                if (item.type == 0) {
                  index.price = item.price * 1;
                  // this.$set(item,'price',item.price * 1)
                } else if (item.type == 1) {
                  index.price = item.price * -1;
                  // this.$set(item,'price',item.price * -1)
                } else if (item.type == 2) {
                  index.adjustmentType = 2;
                  index.percentage = item.price * 1;
                  // this.$set(item,'adjustmentType',2)
                  // this.$set(item,'percentage',item.price * 1)
                }
              }
              // if (rulers == 0 || rulers == 1) {
              //   index.adjustmentType = 1;
              //   if (rulers == 0) {
              //     index.price = item.price * 1;
              //   } else if (rulers == 1) {
              //     index.price = item.price * -1;
              //   }
              // } else if (rulers == 2) {
              //   index.adjustmentType = 2;
              //   index.percentage = item.price * 1;
              // }
              index.occupancyMin = item.attendanceRate * 1;
              index.occupancyMax = item.attendanceRate1 * 1;
              index.time = item.opening * 1;
              index.useOccupancyFlag = useOccupancyFlag;
              index.useStartTimeFlag = useStartTimeFlag;
              priceAdjustmentList.push(index);
            });
            console.log(priceAdjustmentList);
            this.pd = false;
          }
          //  数据处理和提交
          let ciPriceProgram = {};
          let tiemStart_end = self.sizeForm.ciPriceProgram.tiemStart_end.map(
            (item, index) => {
              if (item.length <= 10) {
                item = item + " " + "00:00:00";
              }
              return item;
            }
          );
          //影院uidList处理
          let ciCinemaList = [];
          self.sizeForm.ciCinemaList.forEach((item, index) => {
            let obj = {};
            obj.cinemaUid = item.uid;
            ciCinemaList.push(obj);
          });

          ciPriceProgram.name = self.sizeForm.ciPriceProgram.name;
          ciPriceProgram.status = self.sizeForm.ciPriceProgram.status;
          ciPriceProgram.priority = self.sizeForm.ciPriceProgram.priority * 1;
          ciPriceProgram.startDy = tiemStart_end[0];
          ciPriceProgram.endDy = tiemStart_end[1];
          let ciPriceSaleChannelVoList = self.ciPriceSaleChannelVoList_1.concat(
            self.ciPriceSaleChannelVoList_2
          );
          var useAdjustmentPrice = this.pricing1;
          var useRegionPrice = this.pricing;
          console.log("1111", this.sizeForm.ciCinemaList);
          if (this.sizeForm.ciCinemaList.length != 0) {
            var useCinema = 0;
          } else {
            var useCinema = 1;
            ciCinemaList = [];
          }
          console.log(
            "useCinema",
            this.sizeForm.ciPriceProgram.ciPriceHallType
          );
          if (this.sizeForm.ciPriceProgram.ciPriceHallType[0] == "limit") {
            var useHallType = 1;
          } else {
            var useHallType = 0;
          }
          if (this.applicableFilm1 == 1) {
            var useHall = 0;
          } else {
            var useHall = 1;
          }
          console.log(this.sizeForm.ciPriceProgram.ciPriceHallType);
          var useMovie = this.useMovie;
          if (this.pricing2 == 0) {
            var useMovieLifeCycle = 1;
          } else {
            var useMovieLifeCycle = 0;
          }
          ciPriceProgram.useAdjustmentPrice = useAdjustmentPrice;
          ciPriceProgram.useCinema = useCinema;
          ciPriceProgram.useHall = useHall;
          ciPriceProgram.useHallType = useHallType;
          ciPriceProgram.useMovie = useMovie;
          ciPriceProgram.useMovieLifeCycle = useMovieLifeCycle;
          ciPriceProgram.useRegionPrice = useRegionPrice;
          ciPriceProgram.movieLifeCycleStr = movieLifeCycleStr;

          ciPriceSaleChannelVoList.forEach(item => {
            this.$set(item, "channelUid", item.uid);
          });

          //时分截取
          let resultTime = JSON.parse(JSON.stringify(self.sizeForm.tmList));
          if (self.sizeForm.tmList.length > 0) {
            resultTime = resultTime.map((item, index) => {
              if (item.startTm && item.endTm) {
                item.startTm =
                  new Date(item.startTm).getHours() +
                  ":" +
                  new Date(item.startTm).getMinutes();
                item.endTm =
                  new Date(item.endTm).getHours() +
                  ":" +
                  new Date(item.endTm).getMinutes();
              }
              return item;
            });
          }
          if (this.checked) {
            var pri = this.ttVoList[0].price;
            this.ttVoList.forEach(item => {
              item.price = pri;
            });
          }
          console.log(this.formPriceNetSale);
          if (this.checked1) {
            var pric = this.formPriceNetSale[0].price;
            this.formPriceNetSale.forEach(item => {
              item.price = pric;
            });
          }
          self.sizeForm.schBashMovieList.forEach(item => {
            this.$set(item, "movieUid", item.uid);
          });
          console.log(priceRegionList, priceAdjustmentList);
          let params = {
            priceProgramVo: ciPriceProgram,
            ciCinemaList: ciCinemaList,
            ciPriceHallType: self.sizeForm.schBashHallTypeList,
            tmList: resultTime,
            movieList: self.sizeForm.schBashMovieList,
            priceNetSale: self.formPriceNetSale,
            ttVoList: self.formTtVoList,
            ciPriceSaleChannelVoList: ciPriceSaleChannelVoList,
            ciPriceHall: ciPriceHall,
            priceRegionList: priceRegionList,
            priceAdjustmentList: priceAdjustmentList
          };
          // var token = localStorage.getItem("token");
          // axios
          //   .post(
          //     "http://192.168.101.83:2301/priceprogram/insertPriceProgram",
          //     params,
          //     {
          //       headers: {
          //         "Cpm-User-Token": token
          //       }
          //     }
          //   )
          //   .then(res => {
          //     alert(res.data.msg);
          //   })
          //   .catch(e => {
          //     alert(e);
          //   });
          //判断适用时段是否选择
          if (
            !self.sizeForm.tmList.some((item, index) => {
              return (
                (item.flagWeekArr.length > 0 ||
                  item.flagWeekendArr.length > 0) &&
                (item.startTm != null && item.endTm != null)
              );
            })
          ) {
            self.$message({
              message: "请选择适用时段",
              type: "warning"
            });
            this.pd = false;
            return;
          }
          //判断渠道是否选择
          if (ciPriceSaleChannelVoList.length <= 0) {
            self.$message({
              message: "请选择渠道",
              type: "warning"
            });
            this.pd = false;
            return;
          }
          //判断表格选择
          if (
            self.formPriceNetSale.length == 0 &&
            self.formTtVoList.length == 0
          ) {
            self.$message({
              message: "请选择价格体系",
              type: "warning"
            });
            this.pd = false;
            return;
          }
          //判断价格不能为0
          if (
            self.formPriceNetSale.some((item, index) => {
              return item.price == 0;
            })
          ) {
            self.$message({
              message: "票类价格必须大于0",
              type: "warning"
            });
            this.pd = false;
            return;
          }
          if (
            self.formTtVoList.some((item, index) => {
              return item.price == 0;
            })
          ) {
            self.$message({
              message: "票类价格必须大于0",
              type: "warning"
            });
            this.pd = false;
            return;
          }
          this.$ctmList
            .insertPriceProgram(params)
            .then(res => {
              this.pd = false;
              if (res.code == 200) {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
                this.$router.push("/ticket/ticketPrice_Plan/list");
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            })
            .catch(function(error) {
              console.log(error);
            });

          // alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    cancelFun() {
      this.$confirm(
        "检测到未保存的内容，是否在离开页面前保存修改？",
        "确认信息",
        {
          distinguishCancelAndClose: true,
          confirmButtonText: "留下",
          cancelButtonText: "放弃修改"
        }
      )
        .then(() => {
          //  this.onSubmit()
        })
        .catch(action => {
          console.log("action", action);
          if (action != "cancel") return;
          this.$router.push({
            path: "list"
          });
        });
    }
  },
  components: {
    fixStepTool: FixStepTool,
    cinemaSelect: cinemaSelect,
    getCinema,
    cinemaTable
  }
};
</script>

<style lang="scss">
.movie-price-plan {
  padding-bottom: 30px;
  position: relative;
  .cinema {
    width: 360px;
  }
  .el-collapse-item__header::after {
    height: 0px !important;
  }
  .el-collapse-item__content {
    padding-bottom: 0px;
  }
  .basic-info {
    .el-collapse-item__content {
      margin-left: 13px;
    }

    // form css reset
    .el-tabs--card > .el-tabs__header {
      width: 937px;
    }

    .el-form-item__label:before {
      content: "*";
      color: #f56c6c;
      margin-right: 4px;
    }
    .add-timearea{
        .el-button{
          padding: 0 0 ;
        }
      }
    .bianju{
      margin-bottom: 24px;
    }
    .time-interval {
      position: relative;
      width: 348px;
      padding: 0px 12px 12px;
      background: #f5f5f5;

      .item-interval-delete {
        position: absolute;
        top: 59px;
        right: -59px;
      }

      .el-checkbox {
        margin-right: 0px;
      }

      .time-interval-1 {
        width: 100%;

        .el-checkbox__label {
          font-size: 12px;
        }

        .el-checkbox-group {
          width: 263px;
          float: right;
        }

        .el-checkbox + .el-checkbox {
          margin-left: 4px;
        }

        .time-interval-week {
          width: 324px;
          float: right;
        }
      }

      .time-interval-2 {
        width: 330px;
        overflow: hidden;

        .el-checkbox__label {
          font-size: 12px;
        }

        .el-checkbox-group {
          width: 257px;
          float: right;
        }

        .el-checkbox + .el-checkbox {
          margin-left: 4px;
        }

        .time-interval-weekend {
          width: 260px;
          float: right;
        }
      }

      .time-interval-3 {
        width: 330px;

        .time-wrap {
          .time-padding {
            display: inline-block;
            margin-left: 5px;
            margin-right: 5px;
            color: #666;
            font-size: 12px;
          }

          .el-date-editor {
            width: 150px;

            .el-input__inner {
              width: 100%;
            }
          }
        }

        .el-input__inner {
          width: 332px;
          margin-top: 5px;
        }
      }
    }

    .el-table {
      &::before {
        height: 0;
      }

      tr:nth-child(1n) {
        background-color: #fff;

        &:hover > td {
          background-color: #fff;
        }
      }

      tr:nth-child(2n) {
        background-color: #f5f5f5;

        &:hover > td {
          background-color: #f5f5f5;
        }
      }

      th,
      td {
        padding: 0;
        height: 38px;
        line-height: 38px;
        box-sizing: border-box;
        border: none;
      }

      th {
        background-color: rgb(242, 244, 253);
      }

      .el-table__header-wrapper {
        background-color: rgb(242, 244, 253);
      }

      .has-gutter {
        .cell {
          color: #333;
        }
      }

      .cell {
        font-size: 12px;
        color: #666;
      }
    }

    .el-form-item {
      margin-bottom: 24px;
    }

    .el-form-item__label {
      font-size: 12px;
      text-align: left;
      color: #666666;
    }

    .el-select,
    .el-textarea,
    .el-input__inner {
      width: 360px;
      color: #666666;
    }
    .el-input__inner{
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }

    .cinema-stock-edit-text {
      font-size: 12px;
      color: #808080;
    }

    .separate-accounts-date,
    .separate-accounts-price,
    .separate-accounts-action {
      display: inline-block;
      //   height: 32px;
    }

    .canal-pirce-input {
      .el-input {
        width: 48px;
        height: 20px;

        .el-input__inner {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          padding: 0 0 0 10px;
        }
      }
    }

    //	价格体系
    &.price-system {
      .el-form-item {
        margin-bottom: 0px;
      }

      .el-tabs {
        width: 900px;
      }

      .el-button {
        padding: 0;
        width: 92px;
        height: 32px;
        line-height: 32px;

        span {
          font-size: 12px;
        }
      }

      .el-checkbox__inner {
        width: 12px;
        height: 12px;
      }

      .el-checkbox__input {
        width: 12px;
        height: 12px;

        &.is-checked {
          width: 12px;
          height: 12px;
        }

        .el-checkbox__inner::after {
          top: 0;
          left: 3px;
          transform: rotate(45deg) scaleY(0.8);
        }
      }

      .el-checkbox__label {
        // display: inline-block;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        color: #666;
        padding-left: 4px;
        vertical-align: middle;
      }

      .el-checkbox {
        margin-right: 12px;
      }

      .el-checkbox + .el-checkbox {
        margin-left: 0;
      }

      .el-table {
        width: 900px;
        margin-bottom: 4px;

        .el-select {
          margin-right: 10px;
          width: 130px;
          height: 20px;

          .el-input__inner {
            width: 130px;
            height: 20px;
          }

          .el-input {
            width: 130px;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
          }
        }

        .input-con {
          position: relative;
          display: inline-block;
          font-size: 12px;

          .rmb-hover {
            position: absolute;
            left: 10px;
            top: 2px;
            font-size: 12px;
            font-style: normal;
          }

          .el-input__inner {
            width: 150px;
            height: 20px;
            padding-left: 20px;
            padding-right: 0px;
          }

          .el-input {
            width: 80px;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
          }
        }
      }

      .table-rule {
        color: #3f3f3f;
        font-size: 12px;
        height: 20px;
        line-height: 20px;
      }

      .prcie-promise {
        columns: #666;
        height: 20px;
        line-height: 20px;
      }

      .table-bottom-menu {
        width: 360px;
        position: relative;
        margin-top: 10px;

        .canal-pirce-input {
          position: absolute;
          right: 0;
          bottom: 0;
          color: #666;
          font-size: 12px;
          height: 20px;
          line-height: 20px;

          span {
            display: inline-block;
            font-size: 12px;
            width: 72px;
            height: 20px;
            line-height: 20px;
            vertical-align: middle;
          }

          em {
            display: inline-block;
            height: 20px;
            line-height: 20px;
            margin-right: 6px;
            vertical-align: middle;
          }

          .el-input {
            width: 48px;
            height: 20px;
            vertical-align: middle;

            .el-input__inner {
              font-size: 12px;
              line-height: 20px;
              height: 20px;
            }
          }
        }
      }

      // .el-checkbox-group {
      //   display: inline-block;
      // }

      .check-all-type {
        margin-right: 12px;
      }

      .edit-cichannel-table {
        .cell {
          span {
            display: inline-block;
            font-size: 12px;
          }

          .input-con {
            width: 120px;
          }
        }

        .el-input {
          width: 120px;

          .el-input__inner {
            width: 120px;
            padding-right: 0px;
            font-size: 12px;
            color: #666;
          }
        }

        .el-select-dropdown__item {
          font-size: 12px;
        }
      }
    }

    // 分区加价设置
    &.zone-add-price {
      .button-new-tag {
        width: 105px;
        height: 32px;
        box-sizing: border-box;
        padding: 0;

        span {
          font-size: 12px;
        }
      }

      .tags-con {
        width: 360px;
        height: 36px;
        background-color: #f5f5f5;
        padding: 0 12px;
        box-sizing: border-box;
        border-radius: 5px;

        .el-tag {
          height: 20px;
          line-height: 20px;
          background-color: #fff;
          color: #666;
          border-color: #bcbcbc;

          .el-tag__close {
            color: #666;

            &:hover {
              background-color: #fff;
              color: #666;
            }
          }
        }
      }

      .item-tip {
        color: #666;
        font-size: 12px;
      }

      .el-radio-group {
        margin-bottom: 14px;
      }

      .radio-con {
        margin-bottom: 5px;

        .el-radio__original {
          color: #666;
          font-size: 12px;
        }

        .el-radio__label {
          font-size: 12px;
          color: #666;
        }

        .el-button {
          width: 90px;
          height: 20px;
          padding: 0;
          margin-left: 5px;

          span {
            font-size: 12px;
          }
        }
      }

      .el-table {
        width: 615px !important;
        // .el-table__header-wrapper {
        // 		background-color: rgb(242, 244, 253)
        // 	}
        // .has-gutter {

        // 	th {
        // 		background-color: rgb(242, 244, 253)
        // 	}
        // 	.cell {
        // 		color: #333;
        // 	}
        // }
        // .cell {
        // 	font-size: 12px;
        // 	color: #666;
        // }
      }
    }

    // 上座浮动率调价
    &.float-price {
      .dib-l,
      .dib-r {
        display: inline-block;
        vertical-align: middle;

        & .el-input,
        & .el-input__inner {
          width: 64px;
          height: 32px;
        }
      }

      .add-price-rule {
        color: #3b74ff;

        span {
          cursor: pointer;
        }

        .iconfont {
          margin-right: 5px;
        }
      }
    }

    // 分账信息
    &.checkout-account {
      .el-form-item {
        margin-bottom: 8px;
      }

      .separate-accounts-price {
        color: #666;

        span {
          font-size: 12px;
        }

        .el-input,
        .el-input__inner {
          width: 56px;
          height: 32px;
        }
      }

      .separate-accounts-date {
        margin-left: -12px;

        span {
          font-size: 12px;
          color: #666666;
        }

        .el-date-editor--daterange.el-input__inner {
          vertical-align: middle;
          width: 196px;
          height: 32px;

          .el-input__inner {
            height: 32px;
          }
        }
      }

      .separate-accounts-action {
        margin-left: 6px;

        .el-button {
          width: 40px;
          height: 32px;
          border: 1px solid #3b74ff;
          box-sizing: border-box;
          color: #3b74ff;
          vertical-align: middle;

          span {
            font-size: 12px;
          }
        }

        .el-button--mini {
          padding: 10px 5px 8px;
        }
      }
    }
  }

  .el-collapse {
    border-bottom: none;
  }

  //设置折叠框箭头和位置
  .el-collapse-item__arrow {
    float: left;
    margin: 16px 5px 0;
    // transform: rotate(-90deg);
  }

  .el-collapse-item__header {
    display: inline-block;
    border-bottom: none;
    position: relative;
    padding: 7px 0;
    font-size: 14px;
    color: #333;

    &::after {
      left: 0;
      bottom: 0;
      width: 968px;
      height: 1px;
      content: "";
      position: absolute;
      background-color: #ebeef5;
      z-index: 1;
    }
  }

  // .el-collapse-item__arrow.is-active {
  //     transform: rotate(90deg);
  // }
  .el-collapse-item__wrap {
    border: none;
    padding-top: 0px;
  }

  .price-add-button-wrap {
    height: 64px;
    width: 100%;
    position: absolute;
    z-index: 999;
    bottom: 0;
    right: 0;

    // background-color: #f5f5f5;
    .btn-area {
      width: 500px;
      margin: 0 auto;
      height: 64px;
      text-align: center;
      padding-top: 16px;
      box-sizing: border-box;
    }
  }
  .hide {
    display: none;
    margin-top: 15px;
    .el-input__inner {
      width: 80px;
      box-sizing: border-box;
    }
  }
  .el-form-item__content {
    width: 800px;
  }
  .show {
    margin-top: 15px;
    display: block;
    .el-input__inner {
      width: 80px;
      box-sizing: border-box;
      padding-right: 0;
    }
    .el-select {
      width: 120px;
      .el-input__inner {
        width: 120px;
      }
    }
  }
}
</style>