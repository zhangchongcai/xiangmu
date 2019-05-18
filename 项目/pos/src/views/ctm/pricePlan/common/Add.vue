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
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="优先级："
              prop="priority"
            >
              <!-- <el-input v-model.number="sizeForm.ciPriceProgram.priority" @change="getxxx"></el-input> -->
              <el-select
                v-model="sizeForm.ciPriceProgram.priority"
                placeholder="请选择优先级"
              >
                <el-option
                  key="1"
                  label="1"
                  value="1"
                ></el-option>
                 <el-option
                  key="2"
                  label="2"
                  value="2"
                ></el-option>
                 <el-option
                  key="3"
                  label="3"
                  value="3"
                ></el-option>
                 <el-option
                  key="4"
                  label="4"
                  value="4"
                ></el-option>
                 <el-option
                  key="5"
                  label="5"
                  value="5"
                ></el-option>
                 <el-option
                  key="6"
                  label="6"
                  value="6"
                ></el-option>
                 <el-option
                  key="7"
                  label="7"
                  value="7"
                ></el-option>
                 <el-option
                  key="8"
                  label="8"
                  value="8"
                ></el-option>
                 <el-option
                  key="9"
                  label="9"
                  value="9"
                ></el-option>

              </el-select>
              <span style="color:#909399;font-size:12px;margin-left:5px;">数字越大，优先级越高</span>
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
              <el-button plain @click="cinemaSelectFun()">请选择影院</el-button><span style="color:#f56c6c;font-size:14px;margin-left:8px" v-for="(item,index) in sizeForm.ciCinemaList" :key="index">{{item.name}}</span>
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
            <el-form-item
              label="有效日期："
              prop="tiemStart_end"
            >
              <el-date-picker
                v-model="sizeForm.ciPriceProgram.tiemStart_end"
                value-format="yyyy-MM-dd"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              label="适用时段："
              prop="tmList"
            >
              <div class="time-interval"  
                  v-for='(item, index) in sizeForm.tmList'
                  :key="index">
                
                 <div class="time-interval-1">
                  <el-checkbox
                    :indeterminate="item.isIndeterminate_week"
                    v-model="item.weekDay_checkAll"
                    @change="handleCheckWeekAllChange($event,index)"
                  >工作日</el-checkbox>
                  <div class="time-interval-week">
                    <el-checkbox v-model="item.monday" @change="handleCheckedWeekChange($event,index)" true-label="1" false-label="0">周一</el-checkbox>
                    <el-checkbox v-model="item.tuesday" @change="handleCheckedWeekChange($event,index)" true-label="1" false-label="0">周二</el-checkbox>
                    <el-checkbox v-model="item.wednesday" @change="handleCheckedWeekChange($event,index)" true-label="1" false-label="0">周三</el-checkbox>
                    <el-checkbox v-model="item.thursday" @change="handleCheckedWeekChange($event,index)" true-label="1" false-label="0">周四</el-checkbox>
                    <el-checkbox v-model="item.friday" @change="handleCheckedWeekChange($event,index)" true-label="1" false-label="0">周五</el-checkbox>
                  </div>
                 
                </div>
                <div class="time-interval-2">
                  <el-checkbox
                    :indeterminate="item.isIndeterminate_weekend"
                    v-model="item.weekendDay_checkAll"
                    @change="handleCheckWeekendAllChange($event,index)"
                  >周末</el-checkbox>
                  <div  class="time-interval-weekend">
                    <el-checkbox v-model="item.saturday" @change="handleCheckedWeekendChange($event,index)" true-label="1" false-label="0">周六</el-checkbox>
                    <el-checkbox v-model="item.sunday" @change="handleCheckedWeekendChange($event,index)" true-label="1" false-label="0">周日</el-checkbox>
                  </div>
                   
                </div>
               
                <!-- ********************************************************* -->
                <div
                  class="time-interval-3"
                  ref='timeDom'
                >
                  <div
                    class="time-wrap"
                  >
                    <el-time-picker
                      v-model="item.startTm"
                      placeholder="请输入时间"
                     
                    >
                    </el-time-picker>
                    <span class="time-padding">至</span>
                    <el-time-picker
                      v-model="item.endTm"
                      placeholder="请输入时间"
                    >
                    </el-time-picker>                   
                  </div>
                </div>
               

              </div>
               <div
                  
                  class="add-timearea"
                >
                  <el-button type="text" @click="addTimearea">
                    <i class="iconfont icon-neiye-tianjia"></i>
                    添加时间
                  </el-button>
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
                  label="不限影片"
                  value="limit"
                  :disabled="sizeForm.ciPriceProgram.movieCodeList[0] != 'limit' && sizeForm.ciPriceProgram.movieCodeList.length>0"
                ></el-option>
                <el-option
                  :disabled="sizeForm.ciPriceProgram.movieCodeList[0] == 'limit'"
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
                  label="适用版本："
                  style="margin-bottom: 0;"
                >
                  <el-checkbox
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
                  <template v-for="(item, i) in tickettypeList">
                     <el-checkbox
                      :disabled="item.name == '成人票' "
                      :key="i"
                      :label="item.uid+','+item.name"
                    >
                      {{item.name}}
                    </el-checkbox>
                  </template>
                  </el-checkbox-group>
                  <div>

                    <el-table
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
                              maxlength="9"
                              v-model="scope.row.price"
                              @change="priceChange1(scope.row.price,scope.$index)"
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
                  label="适用版本："
                  style="margin-bottom: 0;"
                >
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
                    :data="priceNetSale"
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
                            @change="priceChange2(scope.row.price,scope.$index)"
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
          @click="priceprogramSave('rulesSizeForm')"
        >保存</el-button>
        <el-button @click="cancelFun">取消</el-button>
      </div>

    </div>
    <fixStepTool :stepData="stepData.stepList"></fixStepTool>
    <cinemaSelect ref="checkNode" :selectCinemaStatus='selectCinemaStatus' :getCinemaTreeList='getCinemaTreeList' @getSelectedCinema='getSelectedCinema' @selectCinemaClose="selectCinemaClose" :ciCinemaList='sizeForm.ciCinemaList'></cinemaSelect>
  </div>
</template>

<script>
// import { getMoviePlanList, getSchPlanLang, getPriceSystem } from '../../../../src/http/interface.js'
import FixStepTool from "../../../../components/fix-step-tool/fix-step-tool";
import fixStepMixin from "../../../../mixins/ctm/fixStepTool.js";
import cinemaSelect from "components/common/check"
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
// const week = ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]
export default {
  data() {
    //  var validateTimeArea= (rule, value, callback) => {
      
    //     if ( !(this.sizeForm.tmList.length>0 && (this.sizeForm.tmList[0].flagWeekArr.length>0 || this.sizeForm.tmList[0].flagWeekendArr.length>0) (this.sizeForm.tmList[0].startTm != '' && this.sizeForm.tmList[0].endTm != '')) ) {
    //       callback(new Error('请输入适用时段'));
    //     } else {
    //       callback();
    //     }
    //   };
    return {
      flagWeekArr:[],
      flagWeekendArr:[],
      //交互部分****************
      selectCinemaStatus:false,
      getCinemaTreeList:[],
      activeTab: "first",
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
      weekDay_checkAll: false,
      isIndeterminate_week: false,
      weekendDay_checkAll: false,
      isIndeterminate_weekend: false,
      
      cities1: cityOptions1,
      cities2: cityOptions2,
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
      testmodle:{
        sunday:"",
        saturday:"",
      },
      //业务数据部分
      sizeForm: {
        ciPriceProgram: {
          name: "",
          status: 1,
          priority: "",
          startDy: "",
          endDy: "",
          permitSaleBox: false,
          permitDiscount: true,
          ciPriceHallType: [],
          tiemStart_end:[],
          movieCodeList:[]
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
        // tmList: [{ startTm: "", endTm: "" }],
        tmList: [  {
                // id: 1,
                uid: "",
                tenantId: "",
                programUid: "",
                startTm: "",
                endTm: "",
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
                flagWeekArr:[],
                flagWeekendArr:[],
            },
            ],
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
          //{ type: "number", message: "优先级别只能为数值", trigger: "change" }
        ],
        ciPriceHallType:[{
           type: "array", required: true, message: "请选择影厅", trigger: "change"
        }],
        tiemStart_end:[{ required: true, message: "请选择有效日期", trigger: "change" }],
        movieCodeList:[ { type: 'array', required: true, message: '请至少选择一个影片', trigger: 'change' }],
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
  mixins: [fixStepMixin],
  created() {
    this.getHallTypeList();
    this.getTickettypeList();
    this.getDisVersionList();
    this.getMovieList();
    this.getChannelList(0);
    this.getChannelList(2);
  },
  mounted() {},
  updated: function() {},
  methods: {
    selectCinemaClose(val){
      console.log('val8888888888888888888',val)
      this.selectCinemaStatus = val
    },
    //选择影院方法
    cinemaSelectFun(){
      let self =this;
      self.selectCinemaStatus =true
      let data = {
      };
      self.$api
        .getCinemaTreeList(data)
        .then(ret => {
          if (ret.data) {
            self.getCinemaTreeList = ret.data.children;
            console.log('this.sizeForm.ciCinemaList',this.sizeForm.ciCinemaList)
           this.$nextTick(_ => {
            this.$refs.checkNode.initCheckedTreeNode(this.sizeForm.ciCinemaList);
          });
          }
        })
        .catch(() => {
          console.log("哪里出错了，检擦一下哥哥");
        });
    },
    //获取已经选择的影院
    getSelectedCinema(val){
      let self =this
      self.sizeForm.ciCinemaList =val
      console.log('valllllllllllllllllllllllll',val)
    },
    tableFixed(scope){
      console.log('scope',scope)
    },
    alertTest($event,index){
      console.log('$event',$event,index)
      console.log('sizeform.timelist.[]',this.sizeForm.tmList[index].monday)
    },
    getxxx(val){
      console.log('val',val,typeof(val))
    },
    getgg(val){
       console.log('val',val,typeof(val))
    },
    //交互部分方法********************************************************************************
    TimeStartChange() {
      let self = this;
      // console.log("val", item);
      if (self.sizeForm.tmList.length > 0) {
            resultTime = self.sizeForm.tmList.map((item, index) => {
              // let itemArr = {};
              console.log('jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj',item.startTm.getHours())
              item.startTm =
                item.startTm.getHours() + ":" + item.startTm.getMinutes();
              item.endTm =
                item.endTm.getHours() + ":" + item.endTm.getMinutes();
              return item;
            });
            console.log('resultTime',resultTime)
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
                startTm: "",
                endTm: "",
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
                flagWeekArr:[],
                flagWeekendArr:[],
            },);
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
    handleCheckedWeekChange($event,index) {
      let self =this
      let event =$event*1
      
      // self.flagWeekArr =self.sizeForm.tmList
      if(event){
       self.sizeForm.tmList[index].flagWeekArr.push(1)
      }else{
        self.sizeForm.tmList[index].flagWeekArr.pop()
      }
      let checkedCount = self.sizeForm.tmList[index].flagWeekArr.length;
      // debugger
      console.log(' self.sizeForm.tmList[index].weekDay_checkAll', self.sizeForm.tmList[index].weekDay_checkAll)
      self.sizeForm.tmList[index].weekDay_checkAll = checkedCount === this.cities1.length;
      

      self.sizeForm.tmList[index].isIndeterminate_week =
        checkedCount > 0 && checkedCount < this.cities1.length;
    },
    handleCheckWeekAllChange($event,index) {
      let self = this;
      if($event){
        self.sizeForm.tmList[index].monday = "1";
        self.sizeForm.tmList[index].tuesday = "1"
        self.sizeForm.tmList[index].wednesday = "1"
        self.sizeForm.tmList[index].thursday = "1"
        self.sizeForm.tmList[index].friday = "1"
        
      }else{
       self.sizeForm.tmList[index].monday ="0";
        self.sizeForm.tmList[index].tuesday ="0"
        self.sizeForm.tmList[index].wednesday ="0"
        self.sizeForm.tmList[index].thursday ="0"
        self.sizeForm.tmList[index].friday ="0"
      }
      self.sizeForm.tmList[index].isIndeterminate_week = false;
      
    },
    //周末
    handleCheckedWeekendChange($event,index) {
    let self =this
      let event =$event*1
      if(event){
       self.sizeForm.tmList[index].flagWeekendArr.push(1)
      }else{
         self.sizeForm.tmList[index].flagWeekendArr.pop()
      }
      let checkedCount =  self.sizeForm.tmList[index].flagWeekendArr.length;
      self.sizeForm.tmList[index].weekendDay_checkAll = checkedCount === this.cities2.length;
      self.sizeForm.tmList[index].isIndeterminate_weekend =
        checkedCount > 0 && checkedCount < this.cities2.length;
    },
    handleCheckWeekendAllChange($event,index) {
      let self = this;
      if($event){
        self.sizeForm.tmList[index].saturday = "1"
        self.sizeForm.tmList[index].sunday = "1"
        self.isIndeterminate_week = true;
      }else{
        self.sizeForm.tmList[index].saturday = "0"
        self.sizeForm.tmList[index].sunday = "0"
        self.isIndeterminate_week = false;
       
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
      self.price_disVersion_1.forEach((item, i) => {
        if (self.price_tickettype.length > 0) {
          self.price_tickettype.forEach((item2, i2) => {
            //生成列表数组
            let resultItem = {
              price: 0,
              feeFlag: 0,
              sel: [
                { label: "基本价格加价", value: 1 },
                { label: "固定价格", value: 0 }
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
  //价格不能为负数
  priceChange1(val,index){
    let newVal = parseFloat(val)
    parseFloat
    if(newVal<0){
      this.ttVoList[index].price=0
      return
    }
    this.ttVoList[index].price=newVal.toFixed(2)
  },
  priceChange2(val,index){
    let newVal = parseFloat(val)
    if(newVal<0){
      this.priceNetSale[index].price=0
      return
    }
    this.priceNetSale[index].price=newVal.toFixed(2)
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
      let data = {
        type:0
      };
      self.$api
        .getTickettypeList(data)
        .then(ret => {
          if (ret.data) {
            self.tickettypeList = ret.data;
            self.tickettypeList.forEach((item,index)=>{
              let result 
              if(item.name=='成人票'){
                self.price_tickettype.push(item.uid+','+item.name)
              }
            })
            
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
      let self = this;
      let resultMovieList = [];
      self.movieList.forEach((item, i) => {
        self.sizeForm.ciPriceProgram.movieCodeList.forEach((item_2, i_2) => {
          if (item.movieCode == item_2) {
            resultMovieList.push(item);
          }
        });
      });
      
      if(self.sizeForm.ciPriceProgram.movieCodeList.length == 1 && self.sizeForm.ciPriceProgram.movieCodeList[0] == 'limit'){
        self.sizeForm.schBashMovieList= []
      }else{
        self.sizeForm.schBashMovieList = resultMovieList;
      }
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
      if(self.sizeForm.ciPriceProgram.ciPriceHallType.length == 1 && self.sizeForm.ciPriceProgram.ciPriceHallType[0] == 'limit'){
        self.sizeForm.schBashHallTypeList= []
      }else{
        self.sizeForm.schBashHallTypeList = resultHallTypeList;
      }
    },
    // *************************************************************************************************
    // 保存价格方案
    priceprogramSave(rulesSizeForm) {
      let self = this;
      // console.log("this.$refs[rulesSizeForm]", this.$refs[rulesSizeForm]);
      this.$refs[rulesSizeForm].validate(valid => {
        if (valid) {
          //  数据处理和提交
         let ciPriceProgram ={}
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
          // let tiemStart_end= []
           let tiemStart_end=self.sizeForm.ciPriceProgram.tiemStart_end.map((item,index)=>{
            if(item.length<=10){
             
              item =item+" "+"00:00:00"
            }
            return item
          })
          //  console.log('进去了吗',tiemStart_end)
          ciPriceProgram.name = self.sizeForm.ciPriceProgram.name;
          ciPriceProgram.status = self.sizeForm.ciPriceProgram.status;
          ciPriceProgram.priority = self.sizeForm.ciPriceProgram.priority*1;
          ciPriceProgram.startDy =  tiemStart_end[0];
          ciPriceProgram.endDy =  tiemStart_end[1];
          let ciPriceSaleChannelVoList = self.ciPriceSaleChannelVoList_1.concat(
            self.ciPriceSaleChannelVoList_2
          );
         
          //时分截取
          let resultTime =JSON.parse(JSON.stringify(self.sizeForm.tmList))
          if (self.sizeForm.tmList.length > 0) {
            resultTime = resultTime.map((item, index) => {
              item.startTm =
                new Date(item.startTm).getHours() + ":" + new Date(item.startTm).getMinutes();
              item.endTm =
               new Date(item.endTm).getHours() + ":" + new Date(item.endTm).getMinutes();
              return item;
            });
            console.log('resultTime',resultTime)
          }
          //影院uidList处理
          let ciCinemaList = []
          self.sizeForm.ciCinemaList.forEach((item,index)=>{
            let obj={}
            obj.uid=item.uid
            ciCinemaList.push(obj)
          })
           let params = {
                  ciPriceProgram: ciPriceProgram,
                  ciCinemaList:ciCinemaList,
                  ciPriceHallType: self.sizeForm.schBashHallTypeList,
                  tmList:  resultTime,
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
                .priceprogramSave(params)
                .then(ret => {
                  console.log("保存价格方法返回", ret.data);
                  if (ret.data) {
                      this.$message({
                        message: '新增成功',
                        type: 'success'
                      });
                     this.$router.push({
                        path: "./list"
                      });
                  }
                })
                .catch((err) => {
                  console.log("哪里出错了，检擦一下哥哥",err);
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
  },
  components: {
    fixStepTool: FixStepTool,
    cinemaSelect:cinemaSelect
  }

};
</script>

<style lang="scss">
.movie-plan_default {
  padding-bottom: 30px;
   .el-collapse-item__header::after{
            height: 0px !important;
        }
  .basic-info {
    margin-left: 30px;
    // form css reset
    .el-tabs--card > .el-tabs__header {
     
      width: 937px;
    }
     .el-form-item__label:before{
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
    .time-interval {
      width: 348px;
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
        .time-interval-week{
           width: 278px;
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
        .time-interval-weekend{
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
      .add-timearea{
        
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
        }
        .el-checkbox__inner::after {
          top: 0;
          left: 3px;
          transform: rotate(45deg) scaleY(0.8);
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
        .el-select-dropdown__item{
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