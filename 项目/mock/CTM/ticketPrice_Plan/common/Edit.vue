<template>
  <div class="movie-plan_default">
    <el-collapse
      v-model="activeNames"
      @change="handleChange"
    >
      <el-form
        ref="rulesSizeForm"
        :model="sizeForm.ciPriceProgram"
        label-width="97px"
        size="small"
        :rules="rules"
        class="demo-ruleForm"
      >
        <el-collapse-item
          title="基础信息"
          name="1"
        >
          <div class="basic-info">
            <!-- <el-form
            ref="form"
            :model="sizeForm"
            label-width="124px"
            size="small"
          > -->
            <el-form-item
              label="方案名称："
              prop="name"
            >
              <el-input v-model="sizeForm.ciPriceProgram.name" @blur="getgg(sizeForm.ciPriceProgram.name)"></el-input>
            </el-form-item>
            <el-form-item label="状态：" prop="status">
              <el-radio-group v-model="sizeForm.ciPriceProgram.status">
                <el-radio label="1">启用</el-radio>
                <el-radio label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="优先级："
              prop="priority"
            >
              <el-input v-model.number="sizeForm.ciPriceProgram.priority" @change="getxxx"></el-input>
            </el-form-item>
            <!-- </el-form> -->
          </div>
        </el-collapse-item>

        <el-collapse-item
          title="触发条件"
          name="2"
        >
          <div class="basic-info">
            <!-- <el-form
            ref="form"
            :model="sizeForm.ciPriceHallType"
            label-width="97px"
            size="small"
          > -->
            <el-form-item label="适用影院：">
              <el-button plain>请选择影院</el-button><span style="color:#f56c6c;font-size:14px;margin-left:8px">广州辰星影院7</span>
            </el-form-item>
            <el-form-item
              label="适用影厅："
              prop="ciPriceHallType"
            >
              <el-select
                v-model="sizeForm.ciPriceProgram.ciPriceHallType"
                placeholder="请选择影厅"
                @change='ciPriceHallTypeChange'
                multiple
              >
                <el-option
                  v-for="item in HallTypeList"
                  :key="item.value"
                  :label="item.keyName"
                  :value="item.keyCode"
                ></el-option>

              </el-select>
            </el-form-item>
            <el-form-item
              label="有效时间："
              prop="tiemStart_end"
            >
              <el-date-picker
                v-model="sizeForm.ciPriceProgram.tiemStart_end"
                value-format="yyyy-MM-dd hh:mm:ss"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="适用时段："
              prop="weekDay_1"
            >
              <div class="time-interval">
                <div class="time-interval-1">
                  <el-checkbox
                    :indeterminate="isIndeterminate_week"
                    v-model="weekDay_1_checkAll"
                    @change="handleCheckWeekAllChange"
                  >工作日</el-checkbox>
                  <el-checkbox-group
                    v-model="sizeForm.ciPriceProgram.weekDay_1"
                    @change="handleCheckedWeekChange"
                  >
                    <el-checkbox
                      v-for="(day,index) in cities1"
                      :label="day.value"
                      :key="index"
                    >{{day.name}}</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div class="time-interval-2">
                  <el-checkbox
                    :indeterminate="isIndeterminate_weekend"
                    v-model="weekDay_2_checkAll"
                    @change="handleCheckWeekendAllChange"
                  >周末</el-checkbox>
                  <el-checkbox-group
                    v-model="sizeForm.ciPriceProgram.weekDay_2"
                    @change="handleCheckedWeekendChange"
                  >
                    <el-checkbox
                      v-for="(day,index) in cities2"
                      :label="day.value"
                      :key="index"
                    >{{day.name}}</el-checkbox>
                  </el-checkbox-group>
                </div>
                <div
                  class="time-interval-3"
                  ref='timeDom'
                >
                  <div
                    v-for='(item, index) in sizeForm.tmList'
                    :key='index'
                    class="time-wrap"
                  >
                    <el-time-picker
                      v-model="sizeForm.tmList[index].startTm"
                      placeholder="请输入时间"
                      @change="TimeStartChange(index)"
                    >
                    </el-time-picker>
                    <span class="time-padding">至</span>
                    <el-time-picker
                      v-model="sizeForm.tmList[index].endTm"
                      placeholder="请输入时间"
                    >
                    </el-time-picker>
                    <span
                      style="color:#3b74ff"
                      class="time-dele"
                      @click="deleFun(item,index)"
                    >x</span>
                  </div>

                </div>
                <div
                  class="add-time-btn"
                  @click="addTimearea"
                >
                  <el-button type="text">
                    <i class="iconfont icon-neiye-tianjia"></i>
                    添加时间
                  </el-button>
                </div>

              </div>
            </el-form-item>
            <el-form-item
              label="适用影片："
              prop="movieCodeList"
            >
              <el-select
                v-model="sizeForm.ciPriceProgram.movieCodeList"
                placeholder="请选择影片"
                @change='movieListChange'
                multiple
              >
                <el-option
                  v-for="(item,key) in movieList"
                  :key="key"
                  :label="item.movieName"
                  :value="item.movieCode"
                ></el-option>

              </el-select>
            </el-form-item>
            <!-- </el-form> -->
          </div>
        </el-collapse-item>

        <el-collapse-item
          title="价格体系"
          name="3"
        >
          <div
            class="basic-info price-system"
            style="margin-bottom:30px"
          >
            <el-tabs
              v-model="activeTab"
              type="card"
              @tab-click="handleClick"
            >
              <el-tab-pane
                label="柜台/自助"
                name="first"
              >
                <!-- <el-form label-width="97px"> -->
                <el-form-item
                  label="适用渠道："
                  style="margin-bottom: 0;"
                  prop="price_Channel_1"
                >
                  <el-checkbox-group
                    v-model="price_Channel_1"
                    @change='handleCheckedChannel_change_1'
                  >
                    <el-checkbox
                      v-for="chanel in channelsList_1"
                      :key="chanel.uid"
                      :label="chanel.uid"
                    >{{chanel.name}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item
                  label="适用影片版本："
                  style="margin-bottom: 0;"
                >
                  <el-checkbox
                    disabled
                    class="check-all-type"
                    v-model="disVersion_checkAll_1"
                    :indeterminate="disVersion_isIndeterminate_1"
                    @change="disVersion_handleCheckAllChange_1"
                     
                  >全部版本</el-checkbox>
                  <el-checkbox-group
                    v-model="price_disVersion_1"
                    @change='handleCheckedDisVersion_Change'
                  >
                    <el-checkbox
                     disabled
                      v-for="(item, index) in disVersionList"
                      :key="index"
                      :label="item.keyCode + ',' + item.keyName"
                    >{{item.keyName}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="适用票类：">
                  <el-checkbox-group
                    v-model="price_tickettype"
                    @change='handleCheckedDisTickettype_Change'
                  >
                    <el-checkbox
                    disabled
                      v-for="(item, i) in tickettypeList"
                      :key="i"
                      :label="item.uid+','+item.name"
                    >
                      {{item.name}}
                    </el-checkbox>
                  </el-checkbox-group>
                  <div>

                    <el-table
                      ref="multipleTable1"
                      :data="ttVoList"
                      @selection-change="handleSelectionTtVoListChange"
                    >
                      <el-table-column
                        type="selection"
                        width="60"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="ttName"
                        label="票类"
                        width="100"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="movieVersionName"
                        label="影片版本"
                        width="100"
                      >
                      </el-table-column>
                      <el-table-column
                        prop="price"
                        label="价格"
                      >
                        <template slot-scope="scope">
                          <el-select v-model="scope.row.feeFlag">
                            <el-option
                              v-for="(item, index) in scope.row.sel"
                              :key="index"
                              :value="item.value"
                              :label="item.label"
                            >
                            </el-option>
                          </el-select>
                          <span class="input-con">
                            <el-input
                              type="number"
                              @blur="tableFixed(scope)"
                              maxlength="9"
                              v-model="scope.row.price"
                            ></el-input><i class="rmb-hover">¥</i>
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
              <el-tab-pane
                label="线上网售"
                name="second"
              >
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
                <el-form-item
                  label="适用影片版本："
                  style="margin-bottom: 0;"
                >
                  <el-checkbox
                    disabled
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
                      disabled
                      v-for="(item, index) in disVersionList"
                      :key="index"
                      :label="item.keyCode + ',' + item.keyName"
                    >{{item.keyName}}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <div>

                  <el-table
                    class="edit-cichannel-table"
                    :data="priceNetSale"
                    ref='multipleTable2'
                     @selection-change="handleSelectionPriceNetSaleChange"
                  >
                    <el-table-column
                        type="selection"
                        width="60"
                      >
                      </el-table-column>
                    <el-table-column
                      prop="movieVersionName"
                      label="影片版本"
                      width="100"
                    >
                    </el-table-column>
                    <el-table-column
                      prop="price"
                      label="渠道结算票价"
                    >
                      <template slot-scope="scope">
                        <el-select v-model="scope.row.feeFlag">
                          <el-option
                            v-for="(item, index) in scope.row.sel"
                            :key="index"
                            :value="item.value"
                            :label="item.label"
                          >
                          </el-option>
                        </el-select>
                        <span class="input-con">
                          <el-input
                            type="number"
                            maxlength="9"
                            v-model="scope.row.price"
                          ></el-input><i class="rmb-hover">¥</i>
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
              <div class="prcie-promise">
                <el-checkbox
                  label="允许包厢单卖"
                  name="type"
                  v-model="sizeForm.ciPriceProgram.permitSaleBox"
                  @change="getBox"
                ></el-checkbox>
              </div>
              <div class="prcie-promise">
                <el-checkbox
                  label="允许营销活动折扣、会员折扣"
                  name="type"
                  v-model="sizeForm.ciPriceProgram.permitDiscount"
                ></el-checkbox>
              </div>
              <!-- <div class="canal-pirce-input">
              <span>渠道代收费</span><em>¥</em>
              <el-input>0.10</el-input>
            </div> -->
            </div>
          </div>
        </el-collapse-item>
      </el-form>
    </el-collapse>
    <div class="bottom-handler-tool">
      <div class="btn-area">
        <el-button
          type="primary"
          @click="priceprogramUpdate('rulesSizeForm')"
        >保存</el-button>
        <el-button @click="cancelFun">取消</el-button>
      </div>

    </div>
    <fixStepTool :stepData="stepData.stepList"></fixStepTool>
  </div>
</template>

<script>
// import { getMoviePlanList, getSchPlanLang, getPriceSystem } from '../../../../src/http/interface.js'
import FixStepTool from "../../../../components/fix-step-tool/fix-step-tool";
import fixStepMixin from "../../../../mixins/CTM/fixStepTool.js";
import index from '../../../../vuex/modules/tagNav';
const cityOptions1 = [
  { name: "周一", value: "monday" },
  { name: "周二", value: "tuesday" },
  { name: "周三", value: "wednesday" },
  { name: "周四", value: "thursday" },
  { name: "周五", value: "friday" }
];
const cityOptions2 = [
  { name: "周六", value: "saturday" },
  { name: "周日", value: "sunday" }
];

export default {
  data() {
     var validateTimeArea= (rule, value, callback) => {
      // console.log(' this.weekDay_1.length', this.sizeForm.ciPriceProgram.weekDay_1.length)
        if ( !((this.sizeForm.ciPriceProgram.weekDay_1.length>0 ||  this.sizeForm.ciPriceProgram.weekDay_2.length>0)  && this.sizeForm.tmList.length>0)) {
          callback(new Error('请输入适用时段'));
        } else {
          callback();
        }
      };
    return {
      
      //交互部分****************
      activeTab: "second",
      activeNames: ["1", "2", "3"],
      // stepData 固定格式
      // stepEl: 计算高度的 元素
      // stepList: 定制悬浮层信息
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
      // ********************
      //触发条件
      forbbidenFlag: 0,
      weekDay_1_checkAll: false,
      weekDay_2_checkAll: false,
      cities1: cityOptions1,
      cities2: cityOptions2,
      isIndeterminate_weekend: false,
      isIndeterminate_week: false,
      // isIndeterminate: true,
      // *************柜台/自助****************
      ttVoList: [],
      formTtVoList:[],
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
      formPriceNetSale:[],
      //业务数据部分
      sizeForm: {
        ciPriceProgram: {
          name: "",
          status: 0,
          priority: "",
          monday: "0",
          tuesday: "0",
          wednesday: "0",
          thursday: "0",
          friday: "0",
          saturday: "0",
          sunday: "0",
          startDy: "",
          endDy: "",
          permitSaleBox: true,
          permitDiscount: true,
          weekDay_1: [],
          weekDay_2: [],
          ciPriceHallType: [],
          tiemStart_end:[],
          movieCodeList:[]
        },
        ciPriceSaleChannelVoList: [],
        ciCinemaList: [
          {
            uid: "cd83a2a7-734e-4861-a7bb-bec328aefb9f"
          }
        ],
        schBashHallTypeList: [],
        tmList: [{ startTm: "2019/1/2 14:00:00", endTm: "" }],
        schBashMovieList: [],
      },
      rules: {
        name: [
          { required: true, message: "请输入方案名称", trigger: "blur" },
          { max: 15, message: "长度不超过15 个字符", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择方案状态", trigger: "change" }
        ],
        priority: [
           { required: true, message: "请输入方案优先级", trigger: "blur" },
          { type: "number", message: "优先级别只能为数值", trigger: "change" }
        ],
        ciPriceHallType:[{
           type: "array", required: true, message: "请选择影厅", trigger: "change"
        }],
        tiemStart_end:[{ required: true, message: "请选择有效时间", trigger: "change" }],
        movieCodeList:[ { type: 'array', required: true, message: '请至少选择一个影片', trigger: 'change' }],
        weekDay_1:[
         {  required: true,validator: validateTimeArea, trigger: 'change' }]
        // resource: [
        //   { required: true, message: '请选择活动资源', trigger: 'change' }
        // ],
        // desc: [
        //   { required: true, message: '请填写活动形式', trigger: 'blur' }
        // ]
      }
    };
  },
  mixins: [fixStepMixin],
  created() {
    this.getHallTypeList();
    this.getTickettypeList();
    this.getDisVersionList();
    this.getMovieList();
    this.getChannelList(0);
    this.getChannelList(1);
    this.getDatas()
  },
  mounted() {},
  updated: function() {},
  methods: {
    getxxx(val){
      console.log('val',val,typeof(val))
    },
    getgg(val){
       console.log('val',val,typeof(val))
    },
    //交互部分方法********************************************************************************
    TimeStartChange(index) {
      let self = this;
      console.log("val", index);
      // alert('0')
      //  self.forbbidenFlag = 0
      if (index > 0) {
        // alert('1')
        if (
          self.sizeForm.tmList[index - 1].endTm * 1 >
          self.sizeForm.tmList[index].startTm * 1
        ) {
          // alert('2')
          self.sizeForm.tmList[index].startTm = "";
          self.sizeForm.tmList[index].endTm = "";
          self.$message({
            message: "时间段不能重叠",
            type: "warning"
          });
        }
      }
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
          startTm: "08:40:00",
          endTm: "10:40:00"
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
      self.formTtVoList = val
      console.log('formTtVoList', self.formTtVoList)

    },
    handleSelectionPriceNetSaleChange(val){
      let self = this;
      self.formPriceNetSale = val
       console.log('formPriceNetSale', self.formPriceNetSale)

    },
    handleClick(tab, event) {
      if (tab.name === "second") {
        this.flag = 0;
      } else {
        this.flag = 1;
      }
    },
    handleChange(e) {},
    // ****************************************************************************************
    //触发条件**********************************************************************************
    //工作日
    handleCheckedWeekChange(value) {
      let checkedCount = value.length;
      this.weekDay_1_checkAll = checkedCount === this.cities1.length;

      this.isIndeterminate_week =
        checkedCount > 0 && checkedCount < this.cities1.length;
    },
    handleCheckWeekAllChange(val) {
      let weekList = [];
      this.cities1.forEach((item, i) => {
        weekList.push(item.value);
      });
      this.sizeForm.ciPriceProgram.weekDay_1 = val ? weekList : [];
      this.isIndeterminate_week = false;
    },
    //周末
    handleCheckedWeekendChange(value) {
      let checkedCount = value.length;
      this.weekDay_2_checkAll = checkedCount === this.cities2.length;

      this.isIndeterminate_weekend =
        checkedCount > 0 && checkedCount < this.cities2.length;
    },
    handleCheckWeekendAllChange(val) {
      let weekendList = [];
      this.cities2.forEach((item, i) => {
        weekendList.push(item.value);
      });
      this.sizeForm.ciPriceProgram.weekDay_2 = val ? weekendList : [];
      this.isIndeterminate_week = false;
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
      self.price_disVersion_1.forEach((item, i) => {
        if (self.price_tickettype.length > 0) {
          self.price_tickettype.forEach((item2, i2) => {
            //生成列表数组
            let resultItem = {
              price: 0,
              feeFlag: 0,
              sel: [
                { label: "基本价格加价", value: "1" },
                { label: "固定价格", value: "0" }
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
      let resultArr = [];
      self.price_disVersion_2.forEach((item, i) => {
        //生成列表数组
        let resultItem = {
          price: 0,
          feeFlag: 0,
          sel: [
            { label: "基本价格加价", value: 1 },
            { label: "固定价格", value: 0 }
          ]
        };
        resultItem.movieVersion = item.split(",")[0];
        resultItem.movieVersionName = item.split(",")[1];
        resultArr.push(resultItem);
      });
      self.priceNetSale = resultArr;
    },

    //********************************************************************************************** */
    //初始化获取页面可选项******************************************************************************
    getHallTypeList() {
      let self = this;
      let data = {
        name: "CI_HALL_TYPE"
      };
      self.$api
        .hallTypeList(data)
        .then(ret => {
          if (ret.data) {
            self.HallTypeList = ret.data;
          }
        })
        .catch(() => {
          console.log("哪里出错了，检擦一下哥哥");
        });
    },
    getTickettypeList() {
      let self = this;
      let data = {};
      self.$api
        .getTickettypeList(data)
        .then(ret => {
          if (ret.data) {
            self.tickettypeList = ret.data;
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
      self.$api
        .disVersionList(data)
        .then(ret => {
          if (ret.data) {
            self.disVersionList = ret.data;
          }
        })
        .catch(() => {
          console.log("哪里出错了，检擦一下哥哥");
        });
    },
    getMovieList() {
      let self = this;
      let params = {
        is_public_value: 0,
        movieCode: "",
        movieName: "",
        currentPage: 0,
        size: 1000
      };
      self.$api
        .DownloadmovieList(params)
        .then(ret => {
          if (ret.data) {
            self.movieList = ret.data.records;
          }
        })
        .catch(() => {
          console.log("哪里出错了，检擦一下哥哥");
        });
    },
    getChannelList(val) {
      let self = this;
      let params = {
        channelNature: val
      };
      self.$api
        .getPriceAddChannelList(params)
        .then(ret => {
          if (ret.data) {
            console.log("ret.data", ret.data);
            if (val == 0) {
              self.channelsList_1 = ret.data;
            } else if (val == 1) {
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
      let self = this;
      let resultMovieList = [];
      self.movieList.forEach((item, i) => {
        self.sizeForm.ciPriceProgram.movieCodeList.forEach((item_2, i_2) => {
          if (item.movieCode == item_2) {
            resultMovieList.push(item);
          }
        });
      });
      self.sizeForm.schBashMovieList = resultMovieList;
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
      self.sizeForm.schBashHallTypeList = resultHallTypeList;
      console.log('resultHallTypeList ',resultHallTypeList )
    },
    // *************************************************************************************************
    // 修改价格方案
    priceprogramUpdate(rulesSizeForm) {
      let self = this;
      // self.ciPriceHallTypeChange()
      // self.movieListChange()
      console.log("this.$refs[rulesSizeForm]", this.$refs[rulesSizeForm]);
      this.$refs[rulesSizeForm].validate(valid => {
        if (valid) {
          //  数据处理和提交
          //处理日期参数
          let ciPriceProgram = {};
          self.sizeForm.ciPriceProgram.weekDay_1.forEach((item, i) => {
            ciPriceProgram[item] = 1;
          });
          self.sizeForm.ciPriceProgram.weekDay_2.forEach((item, i) => {
            ciPriceProgram[item] = 1;
          });
          //包厢
          if (self.sizeForm.ciPriceProgram.permitSaleBox) {
            ciPriceProgram.permitSaleBox = 1;
          } else {
            ciPriceProgram.permitSaleBox = 0;
          }
          //折扣
          if (self.sizeForm.ciPriceProgram.permitDiscount) {
            ciPriceProgram.permitDiscount = 1;
          } else {
            ciPriceProgram.permitDiscount = 0;
          }
          ciPriceProgram.name = self.sizeForm.ciPriceProgram.name;
          ciPriceProgram.status = self.sizeForm.ciPriceProgram.status;
          ciPriceProgram.priority = self.sizeForm.ciPriceProgram.priority;
          ciPriceProgram.startDy =  self.sizeForm.ciPriceProgram.tiemStart_end[0];
          ciPriceProgram.endDy =  self.sizeForm.ciPriceProgram.tiemStart_end[1];
          let ciPriceSaleChannelVoList = self.ciPriceSaleChannelVoList_1.concat(
            self.ciPriceSaleChannelVoList_2
          );
          console.log(
            "self.ciPriceSaleChannelVoList",
            ciPriceSaleChannelVoList
          );
          // console.log('ciPriceProgram',ciPriceProgram)
          //时分截取
          let resultTime = [];
          if (self.sizeForm.tmList.length > 0) {
            resultTime = self.sizeForm.tmList.map((item, index) => {
              console.log("item", item);
              let itemArr = {};
              itemArr.startTm =
                new Date(item.startTm).getHours() + ":" + new Date(item.startTm).getMinutes();
              itemArr.endTm =
               new Date( item.endTm).getHours() + ":" +new Date( item.endTm).getMinutes();
              return itemArr;
            });
            // console.log('resultTime',resultTime)
          }
           let params = {
                  ciPriceProgram: ciPriceProgram,
                  ciCinemaList: [
                    {
                      uid: "cd83a2a7-734e-4861-a7bb-bec328aefb9f"
                    }
                  ],
                  ciPriceHallType: self.sizeForm.schBashHallTypeList,
                  tmList: resultTime,
                  schBashMovieList: self.sizeForm.schBashMovieList,
                  priceNetSale: self.formPriceNetSale,
                  ttVoList: self.formTtVoList,
                  ciPriceSaleChannelVoList: ciPriceSaleChannelVoList
              };
              //判断渠道是否选择
              if(ciPriceSaleChannelVoList.length <= 0){
                 self.$message({
                  message: '请选择渠道',
                  type: 'warning'
                }); 
                return
              }
          //判断表格选择
          if(self.formPriceNetSale.length <= 0 && self.formTtVoList.length <= 0){
             self.$message({
                  message: '请选择价格体系',
                  type: 'warning'
                }); 
                return
          }
          self.$api
                .priceprogramUpdate(params)
                .then(ret => {
                  console.log("保存价格方法返回", ret.data);
                  if (ret.data) {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                        });
                        this.$router.push({
                        path: "list",
                    });
                  }
                })
                .catch(() => {
                  console.log("哪里出错了，检擦一下哥哥");
                });

          // alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
     cancelFun(){
         this.$confirm('检测到未保存的内容，是否在离开页面前保存修改？', '确认信息', {
                distinguishCancelAndClose: true,
                confirmButtonText: '留下',
                cancelButtonText: '放弃修改'
                })
                .then(() => {
                  //  this.onSubmit()
                })
                .catch(action => {
                  console.log('action',action)
                    if (action != 'cancel') return
                    this.$router.push({
                      path: "list",
                    });
                    
                });  
    },
     toggleSelection1(rows) {
       let self =this
        if (rows) {
          rows.forEach(row => {
            self.$refs.multipleTable1.toggleRowSelection(row);
          });
        } else {
          self.$refs.multipleTable1.clearSelection();
        }
      },
       toggleSelection2(rows) {
       let self =this
        if (rows) {
          rows.forEach(row => {
            self.$refs.multipleTable2.toggleRowSelection(row);
          });
        } else {
          self.$refs.multipleTable2.clearSelection();
        }
      },
      getBox(){
        console.log('sizeForm.ciPriceProgram.permitSaleBox',this.sizeForm.ciPriceProgram.permitSaleBox)
      },
    //获取初始数据
    getDatas() {
      let self = this;
      console.log('self.$route.query.id',self.$route.query.id)
      let data = {
         id: self.$route.query.id,
      };
      self.$api
        .priceprogramScan(data)
        .then(ret => {
          console.log("获取初始数据", ret.data);
          if(ret.data){
            let result = ret.data;
            // self.$set(self.sizeForm, 'ciPriceProgram', result.ciPriceProgram)
            Object.assign( self.sizeForm.ciPriceProgram, result.ciPriceProgram)
            // self.sizeForm.ciPriceProgram =result.ciPriceProgram;
            console.log(result.ciPriceProgram, self.sizeForm.ciPriceProgram)
            //处理影厅数据
            if(result.ciPriceHallType.length>0){
              // this.$set(self.sizeForm, 'ciPriceProgram.ciPriceHallType', result.ciPriceHallType.map((item,index)=>{
              //   return item.keyCode
              // }))
              self.sizeForm.ciPriceProgram.ciPriceHallType = result.ciPriceHallType.map((item,index)=>{
                return item.keyCode
              })
            }
            console.log([result.ciPriceProgram.startDy,result.ciPriceProgram.endDy])
            self.sizeForm.ciPriceProgram.tiemStart_end =  result.ciPriceProgram.startDy ?[result.ciPriceProgram.startDy,result.ciPriceProgram.endDy]:[]
            //星期数处理
           
            let ciPriceProgramArr =  Object.keys(self.sizeForm.ciPriceProgram)
            let ciPriceProgramResultArr_1 =[]
            let ciPriceProgramResultArr_2 = []
             ciPriceProgramArr.forEach((item,index)=>{
               //提取周末
               cityOptions1.forEach((item2,index2)=>{
                if( item2.value == item){
                  if(result.ciPriceProgram[ item2.value]){
                    ciPriceProgramResultArr_1.push(item)
                  }
                }
               })
              //提取工作日
                cityOptions2.forEach((item2,index2)=>{
                if( item2.value == item){
                  if(result.ciPriceProgram[ item2.value]){
                    ciPriceProgramResultArr_2.push(item)
                  }
                }
               })
               if(ciPriceProgramResultArr_1.length==5){
                    self.weekDay_1_checkAll=true;
               }
               if( ciPriceProgramResultArr_2.length==2){
                    self.weekDay_2_checkAll=true;
               }
                self.sizeForm.ciPriceProgram.weekDay_1 = ciPriceProgramResultArr_1
               self.sizeForm.ciPriceProgram.weekDay_2 = ciPriceProgramResultArr_2
             })
            //时间段处理
            self.sizeForm.tmList = result.tmList.map((item,index)=>{
              let item2 ={}
              item2.endTm = "2019/1/1" + " "+item.endTm + ':00'
              item2.startTm = "2019/1/1" + " "+item.startTm + ':00'
              // console.log('item2-加时间',item2)
              return item2
            })
            //影片量处理
            self.sizeForm.ciPriceProgram.movieCodeList  =  result.schBashMovieList.map((item,index)=>{
              return item.movieCode
            })
            //给影厅影片赋值
            self.sizeForm.schBashMovieList = result.schBashMovieList
           self.sizeForm.schBashHallTypeList = result.ciPriceHallType;
           console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',result.ciPriceHallType)
            //处理渠道
            if(result.ciPriceSaleChannelVoList.length>0){
              result.ciPriceSaleChannelVoList.forEach((item,index)=>{
                if(item.channelNature = 0){
                  self.price_Channel_1.push(item.uid)
                   self.ciPriceSaleChannelVoList_1.push(item)
                }else if(item.channelNature = 1){
                   self.price_Channel_2.push(item.uid)
                   self.ciPriceSaleChannelVoList_2.push(item)
                }
                console.log()
              })
            }
            //包厢或者折扣
             //包厢
          if (result.ciPriceProgram.permitSaleBox ==1) {
            self.sizeForm.ciPriceProgram.permitSaleBox = true;
          } else {
            self.sizeForm.ciPriceProgram.permitSaleBox = false;
          }
          //折扣
          if (result.ciPriceProgram.permitDiscount ==1) {
            self.sizeForm.ciPriceProgram.permitDiscount = true;
          } else {
            self.sizeForm.ciPriceProgram.permitDiscount = false;
          }
            // self.sizeForm.ciPriceProgram.permitDiscount = result.ciPriceProgram.permitDiscount;
            // self.sizeForm.ciPriceProgram.permitSaleBox = result.ciPriceProgram.permitSaleBox;
            //  票类和票版处理
            self.priceNetSale =result.priceNetSale;
            self.ttVoList =result.ttVoList
             self.price_tickettype=result.ttVoList.map((item,index)=>{
              console.log('item',item.ttUid + ',' +item.ttName)
              return item.ttUid + ',' +item.ttName;
            })
            self.price_disVersion_1 =result.ttVoList.map((item,index)=>{
               return item.movieVersion + ',' +item.movieVersionName;
            })
            self.price_disVersion_2=result.priceNetSale.map((item,index)=>{
               return item.movieVersion + ',' +item.movieVersionName;
            })
            //表格数据处理
              self.priceNetSale.forEach((item,index)=>{
                item.sel =[
                  { label: "基本价格加价", value: 1 },
                  { label: "固定价格", value: 0 }
                ]
              
              })
              self.ttVoList.forEach((item,index)=>{
                item.sel =[
                  { label: "基本价格加价", value: 1 },
                  { label: "固定价格", value: 0 }
                ]               
              })
             self.$nextTick(()=>{
               self.toggleSelection1( result.ttVoList)
               self.toggleSelection2( result.priceNetSale)

             })
             console.log('self.ttVoListgggggggggggggggggggggggggggggggggggggggggggggggggg',result.ttVoList)
            self.$refs.multipleTable1.toggleRowSelection(self.ttVoList);
             self.$refs.multipleTable2.toggleRowSelection(self.priceNetSale);
            
            
           
          }
          
        })
        .catch((err) => {
          console.log("哪里出错了，检擦一下哥哥",err);
        });
    },
  },
  components: {
    fixStepTool: FixStepTool
  }
};
</script>

<style lang="scss">
.movie-plan_default {
  padding-bottom: 30px;
  .basic-info {
    margin-left: 30px;
    // form css reset
    .el-tabs--card > .el-tabs__header {
      width: 937px;
    }
    .time-interval {
      width: 338px;
      padding: 20px 12px 20px;
      background: #f5f5f5;
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
          position: relative;
          .time-dele {
            position: absolute;
            right: -15px;
            top: 5px;
            cursor: Pointer;
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
    }
    .el-select,
    .el-textarea,
    .el-input__inner {
      width: 360px;
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
           .el-checkbox__inner::after {
          top: 0;
          left: 3px;
          transform: rotate(45deg) scaleY(0.8);
        }
        }
       
      }
      .el-checkbox__label {
        display: inline-block;
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
        width: 900px !important;
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
      .el-checkbox-group {
        display: inline-block;
      }
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
    margin: 0 8px 0;
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
    padding-top: 24px;
  }
  .bottom-handler-tool {
    height: 64px;
    width: 100%;
    position: fixed;
    z-index: 999;
    bottom: 0;
    right: 0;
    background-color: #f5f5f5;
    .btn-area {
      width: 500px;
      margin: 0 auto;
      height: 64px;
      text-align: center;
      padding-top: 16px;
      box-sizing: border-box;
    }
  }
}
</style>