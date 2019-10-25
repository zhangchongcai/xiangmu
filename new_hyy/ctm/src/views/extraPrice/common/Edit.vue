<template>
  <div class="ctm extra-price-list">
    <el-collapse v-model="activeNames">
      <el-form ref="dataForm" :model="dataForm" label-width="110px" :rules="rules" class="base-form" :class="enabledEdit?'':'scan'">
        <el-collapse-item class="first-item" title="基础信息" name="1">
          <el-form-item label="方案名称：" prop="name">
            <el-input v-if="enabledEdit" v-model="dataForm.name"></el-input>
            <span class="c-view" v-if="!enabledEdit">{{dataForm.name}}</span>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-radio-group v-if="enabledEdit" v-model="dataForm.status">
              <el-radio :label='1'>启用</el-radio>
              <el-radio :label='0'>禁用</el-radio>
            </el-radio-group>
            <span class="c-view" v-if="!enabledEdit">{{dataForm.status==1?'启用': (dataForm.status==0?'禁用':'')}}</span>
          </el-form-item>
          <el-form-item label="优先级：" prop="priority">
            <el-select v-if="enabledEdit" v-model="dataForm.priority" placeholder="请选择优先级">
              <el-option v-for="item in 9" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <span class="c-view" v-if="!enabledEdit">{{dataForm.priority}}</span>
            <span v-if="enabledEdit" class="tip-c f-12 m-l-5">数字越大，优先级越高</span>
          </el-form-item>
        </el-collapse-item>
        <el-collapse-item title="适用条件" name="2">
          <el-form-item label="适用影院：" prop="cinemaNames">
            <el-input v-if="enabledEdit" ref="useCinemaNameInput" :readonly="true" v-model="dataForm.cinemaNames" placeholder=""></el-input>

            <el-button class="m-l-6" v-if="enabledEdit" type="primary" plain @click="showCinemaModel()">选择影院</el-button>
            <div class="w-600">
              <span class="c-view" v-if="!enabledEdit">{{dataForm.cinemaNames}}</span>
            </div>
          </el-form-item>
          <el-form-item label="适用渠道：" prop="useChannel">
            <el-select v-if="enabledEdit" v-model="dataForm.useChannel" @change="useChannelChange" placeholder="请选择">
              <el-option label="不限" :value="1"></el-option>
              <el-option label="指定渠道" :value="0"></el-option>
            </el-select>
            <el-input v-if="enabledEdit" v-show="dataForm.useChannel==0" ref="channelNameInput" style="margin-left:5px;" :readonly="true" v-model="dataForm.channelShortName" placeholder=""></el-input>
            <el-button v-if="enabledEdit" plain type="primary" v-show="dataForm.useChannel==0" style="margin-left:10px;" @click.prevent="showChannelModel">请选择渠道</el-button>
            <div class="w-600">
              <span v-if="!enabledEdit && dataForm.useChannel==1">不限渠道</span>
              <span class="c-view" v-if="!enabledEdit && dataForm.useChannel==0">{{dataForm.channelNameStr}}</span>
            </div>
          </el-form-item>

          <el-form-item label="适用影厅类型：" prop="useHallType">
            <el-select v-if="enabledEdit" v-model="dataForm.useHallType" @change="useHallTypeChange" placeholder="请选择">
              <el-option label="不限" :value="1"></el-option>
              <el-option label="指定影厅类型" :value="0"></el-option>
            </el-select>
            <el-checkbox-group v-if="enabledEdit" class="m-t-16" ref="cinemaTypeInput" @change="checkListChange" v-show="dataForm.useHallType==0" v-model="dataForm.checkList">
              <el-checkbox v-for="item in dataForm.ciPriceHallTypeOption" :key="item.keyCode" :label="item.keyCode">{{item.keyName}}</el-checkbox>
            </el-checkbox-group>
            <div class="w-600">
              <span class="c-view" v-if="!enabledEdit">{{dataForm.useHallType==0?(dataForm.ciPriceHallTypeStr):'不限类型'}}</span>
            </div>
          </el-form-item>

          <el-form-item label="适用影厅：" prop="useHall">
            <el-select v-if="enabledEdit" v-model="dataForm.useHall" @change="useHallChange" placeholder="请选择">
              <el-option label="不限" :value="1"></el-option>
              <el-option label="指定影厅" :value="0"></el-option>
            </el-select>
            <span class="c-view" v-if="!enabledEdit && dataForm.useHall==1">不限影厅</span>
            <div class="cinema-room m-t-16" v-show="dataForm.useHall==0">
              <div class="flex-wrapper header">
                <div class="td w-150">影院</div>
                <div class="td flex-1">适用影厅</div>
              </div>
              <div v-for="(item,index) in dataForm.ciCinemaAndHallVos" :key="index" class="flex-wrapper">
                <div class="td w-150 flex-wrapper a-i-c">{{item.cinema.name}}</div>
                <div class="td flex-1 s-h-326" :class="(item.selectedHalls && item.selectedHalls.length>4)?'':'f-h-32'">
                  <el-select class="m-v-5" v-if="item.hallList && enabledEdit" size="small" v-model="item.selectedHalls" @change="(val)=>electedHallChange(val,item)" multiple placeholder="请选择">
                    <el-option v-for="(item,idx) in item.hallList" :key="idx" :label="item.name" :value="item.uid">
                    </el-option>
                  </el-select>
                  <span class="c-view" v-if="!enabledEdit">{{item.hallStr}}</span>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item label="有效日期：" prop="daterange">
            <el-date-picker v-if="enabledEdit" clearable v-model="dataForm.daterange" type="daterange" value-format="yyyy-MM-dd HH:mm:SS" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
            <span class="c-view" v-if="!enabledEdit">{{dataForm.daterange.length==2?(formatDate(dataForm.daterange[0])+' 至 '+formatDate(dataForm.daterange[1])):''}}</span>
          </el-form-item>

          <el-form-item label="适用时段：" prop="tmList">
            <div class="flex-wrapper a-i-c time-interval" v-for='(item, index) in dataForm.tmList' :key="index">
              <div class="c-view" v-if="!enabledEdit">
                {{item.timeRangeStr}}
                <span class="m-l-8">{{item.timeStr}}</span>
              </div>
              <div v-if="enabledEdit" class="b-o b-g-h">
                <div class="flex-wrapper b-b time-interval-1">
                  <div class="w-80 p-v-8 p-l-8">
                    <el-checkbox :indeterminate="item.isIndeterminate_week" v-model="item.weekDay_checkAll" @change="handleCheckWeekAllChange($event,index)">工作日</el-checkbox>
                  </div>
                  <div class="time-interval-week p-8">
                    <el-checkbox v-model="item.monday" @change="handleCheckedWeekChange($event,index)" true-label="1" false-label="0">周一</el-checkbox>
                    <el-checkbox v-model="item.tuesday" @change="handleCheckedWeekChange($event,index)" true-label="1" false-label="0">周二</el-checkbox>
                    <el-checkbox v-model="item.wednesday" @change="handleCheckedWeekChange($event,index)" true-label="1" false-label="0">周三</el-checkbox>
                    <el-checkbox v-model="item.thursday" @change="handleCheckedWeekChange($event,index)" true-label="1" false-label="0">周四</el-checkbox>
                    <el-checkbox v-model="item.friday" @change="handleCheckedWeekChange($event,index)" true-label="1" false-label="0">周五</el-checkbox>
                  </div>

                </div>
                <div class="flex-wrapper b-b">
                  <div class="w-80 p-v-8 p-l-8">
                    <el-checkbox :indeterminate="item.isIndeterminate_weekend" v-model="item.weekendDay_checkAll" @change="handleCheckWeekendAllChange($event,index)">周末</el-checkbox>
                  </div>
                  <div class="p-8">
                    <el-checkbox v-model="item.saturday" @change="handleCheckedWeekendChange($event,index)" true-label="1" false-label="0">周六</el-checkbox>
                    <el-checkbox v-model="item.sunday" @change="handleCheckedWeekendChange($event,index)" true-label="1" false-label="0">周日</el-checkbox>
                  </div>
                </div>

                <div class="m-v-10 m-l-10 time-interval-3" ref='timeDom'>
                  <div class="time-wrap">
                    <el-time-picker v-model="item.startTm" placeholder="请输入时间">
                    </el-time-picker>
                    <span class="time-padding">至</span>
                    <el-time-picker v-model="item.endTm" placeholder="请输入时间">
                    </el-time-picker>

                  </div>
                </div>
              </div>

              <div v-if="enabledEdit" class="item-interval-delete">
                <el-button type="text" @click="deleFun(item,index)">
                  删除
                </el-button>
              </div>
            </div>
            <div v-if="enabledEdit" class="add-timearea">
              <span class="f-12 c-primary c-p" @click="addTimearea">
                <i class="iconfont icon-neiye-tianjia-"></i>
                <span>添加时间</span>
              </span>
            </div>
          </el-form-item>

        </el-collapse-item>
        <el-collapse-item title="增值服务费价格设置" name="3">
          <el-form-item label="调价规则：" prop="ruleType">
            <div v-if="enabledEdit">
              <el-radio class="m-r-8" v-model="dataForm.ruleType" :label="0">指定增值服务费</el-radio>

              <el-select class="m-r-8" v-model="dataForm.priceTypeA" @change="priceTypeChange" placeholder="请选择">
                <el-option label="固定金额" :value="0"></el-option>
                <el-option label="结算价百分比%" :value="1"></el-option>
              </el-select>
              <el-input-number class="w-180" v-model="dataForm.priceA" :controls="false" :min="0" :max="dataForm.priceTypeA==1?100:999999999" :precision="2" placeholder=""></el-input-number>
              <span v-show="dataForm.priceTypeA==1" class="f-12">%</span>
            </div>
            <div v-if="showRuleTypeTip" class="v-error f-12 l-h-1 p-t-6">
              请完善调价规则
            </div>
            <div v-if="enabledEdit" class="m-t-16">

              <el-radio class="m-r-8" v-model="dataForm.ruleType" :label="1">等于结算价和最低发行价差额</el-radio>

              <el-select class="m-r-8" v-model="dataForm.priceTypeB" placeholder="请选择">
                <el-option label="不限最高限价" :value="2"></el-option>
                <el-option label="指定增值服务费最高限价N元" :value="3"></el-option>
              </el-select>
              <el-input-number v-show="dataForm.priceTypeB==3" v-model="dataForm.priceB" :controls="false" :min="0" :precision="2" placeholder=""></el-input-number>
            </div>

            <span class="c-view" v-if="!enabledEdit">{{dataForm.rulePriceStr}}</span>

          </el-form-item>
        </el-collapse-item>
      </el-form>
    </el-collapse>
    <div v-if="enabledEdit" class="p-b-30">
      <div class="a-c">
        <el-button type="primary" :loading="saveLoading" class="w-80" @click="submitForm(false)">保存</el-button>
        <!-- <el-button
          type="primary"
          :loading="draftLoading"
          @click="submitForm(true)"
        >保存草稿</el-button> -->
        <el-button class="w-80" @click="cancelFun">取消</el-button>
      </div>
    </div>
    <div v-if="!enabledEdit" class="p-b-30">
      <div class="a-c">
        <el-button class="w-80" @click="cancelFun">关闭</el-button>
      </div>
    </div>
    <TableSelect :formItems="formItems" nameKey="name" rowKey="uid" :request="requestApi" :columns="brandColumns" :defaultQuery="defaultQuery" :multiSelect="true" title="选择影院" :modelVisible="modelVisible" @close="modelVisible=false" @select="selectedTable" :defaultSelectRows="defaultSelectRows" />
    <TableSelect :formItems="channelFormItems" nameKey="name" rowKey="uid" :request="channelRequestApi" :columns="channelColumns" :defaultQuery="channelDefaultQuery" :multiSelect="true" title="选择渠道" :modelVisible="channelModelVisible" @close="channelModelVisible=false" @select="channelSelect" :defaultSelectRows="channelDefaultSelectRows" />
    <fixStepTool :stepData="stepData.stepList"></fixStepTool>
  </div>
</template>

<script type='text/ecmascript-6'>
import fixStepTool from 'ctmSrc/components/fix-step-tool/fix-step-tool';
import fixStepMixin from 'ctmSrc/mixins/fixStepTool';
import { baseInterface, cacheMixin } from 'base';

import { cinemaList, queryChannelList, queryExtraPriceDetail, fetchCinemaList, hallTypeList, fetchCinameHallByType, saveExtraPrice, updateExtraPrice, getEditChannelList } from 'ctmSrc/http/interface';
import TableSelect from '../../../components/TableSelect/TableSelect';
import moment from 'moment';
const { authQueryUserCinemas } = baseInterface;
const cityOptions1 = [{
  name: '周一',
  value: 'monday'
},
{
  name: '周二',
  value: 'tuesday'
},
{
  name: '周三',
  value: 'wednesday'
},
{
  name: '周四',
  value: 'thursday'
},
{
  name: '周五',
  value: 'friday'
}
];
const cityOptions2 = [{
  name: '周六',
  value: 'saturday'
},
{
  name: '周日',
  value: 'sunday'
}
];
export default {
  components: {
    fixStepTool,
    TableSelect
  },
  mixins: [fixStepMixin, cacheMixin.cacheMixin],
  data () {
    return {
      cacheField: ['dataForm', 'defaultSelectRows', 'channelDefaultSelectRows'],
      scan: 2, // 1为新增 2编辑 3查看
      draftLoading: false,
      saveLoading: false,
      defaultQuery: {},
      formItems: [
        { label: '影院名称：', prop: 'name' },
        { label: '影院编码：', prop: 'code' }
      ],
      defaultSelectRows: [],
      currentRow: {},
      requestApi: fetchCinemaList,
      brandColumns: [
        // { type: 'index', align: 'center', label: '序号' },
        { label: '影院全称', prop: 'name' },
        { label: '影院编码', prop: 'code' }
        // { label: '品牌简称', prop: 'shortName' }
      ],
      modelVisible: false,

      // 渠道弹框
      // type: 2
      channelDefaultQuery: { type: 2 },
      channelRequestApi: queryChannelList,
      channelColumns: [
        // { type: 'index', align: 'center', label: '序号' },
        { label: '渠道名称', prop: 'name' },
        { label: '渠道编码', prop: 'code' }
        // { label: '品牌简称', prop: 'shortName' }
      ],
      channelFormItems: [
        { label: '渠道名称：', prop: 'name' },
        { label: '渠道编码：', prop: 'code' }
      ],
      channelDefaultSelectRows: [],
      channelModelVisible: false,

      activeNames: ['1', '2', '3'],
      dataForm: {
        ruleType: 0,
        priceTypeA: '',
        priceTypeB: '',
        priceA: undefined,
        priceB: undefined,
        priority: '',
        name: '',
        status: 1,
        ciPriceHallTypeOption: [],
        daterange: [],
        ciPriceProgram: {},
        cinemaNames: '',
        useChannel: 1,
        useHallType: 1,
        useHall: 1,
        ciCinemaAndHallVos: [],
        checkList: [],
        tmList: [{
          id: 1,
          uid: '',
          tenantId: '',
          programUid: '',
          startTm: '2019/1/1 00:00:00',
          endTm: '2019/1/1 23:59:00',
          monday: '0',
          tuesday: '0',
          wednesday: '0',
          thursday: '0',
          friday: '0',
          saturday: '0',
          sunday: '0',
          delFlag: '',
          createTime: '',
          updateTime: '',
          weekDay_checkAll: false,
          isIndeterminate_week: false,
          weekendDay_checkAll: false,
          isIndeterminate_weekend: false,
          flagWeekArr: [],
          flagWeekendArr: []
        }]
      },
      cities1: cityOptions1,
      cities2: cityOptions2,
      rules: {
        name: [
          { required: true, message: '必填项不能为空', trigger: 'change' }
        ],
        status: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        priority: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        cinemaNames: [
          { required: true, message: '必填项不能为空', trigger: 'change' }
        ],
        useChannel: [
          { required: true, message: '必填项不能为空', trigger: 'change' },
          { validator: this.validChannelType, trigger: 'change' }
        ],
        useHallType: [
          { required: true, message: '必填项不能为空', trigger: 'change' },
          { validator: this.validCinameType, trigger: 'change' }
        ],
        useHall: [
          { required: true, message: '必填项不能为空', trigger: 'change' }
        ],
        daterange: [
          { required: true, message: '必填项不能为空', trigger: 'blur' }
        ],
        ruleType: [
          { required: true, message: '请完善调价规则', trigger: 'change' },
          { validator: this.validRuleType, trigger: 'change' }
        ],
        tmList: [
          { required: true, message: '必填项不能为空', trigger: 'change' }
        ]
      },
      showRuleTypeTip: false,
      stepData: {
        stepEl: '.el-collapse-item',
        stepList: [{
          name: '基础信息',
          isactive: false
        },
        {
          name: '适用条件',
          isactive: false
        },
        {
          name: '增值服务费价格设置',
          isactive: false
        }
        ]
      }
    };
  },
  created () {
    if (this.$route.query.uid) {
      if (this.$route.query.uid != this.dataForm.uid) {
        this.resetForm();
      }
    }
  },
  mounted () {
    this.resetPageStatus();
    if (this.$route.query.uid) {
      if (this.$route.query.uid != this.dataForm.uid) {
        // this.resetForm();
        this.getDetail(this.$route.query.uid);
      } else {
        console.log('取缓存数据');
      }
    }
    this.getHallTypeList();
  },
  computed: {
    enabledEdit () {
      if (this.scan == 3) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    resetForm () {
      // return;
      this.defaultSelectRows = [];
      this.channelDefaultSelectRows = [];
      this.dataForm = {
        ruleType: 0,
        priceTypeA: '',
        priceTypeB: '',
        priceA: undefined,
        priceB: undefined,
        priority: '',
        name: '',
        status: 1,
        ciPriceHallTypeOption: [],
        daterange: [],
        ciPriceProgram: {},
        cinemaNames: '',
        useChannel: 1,
        useHallType: 1,
        useHall: 1,
        ciCinemaAndHallVos: [],
        checkList: [],
        tmList: [{
          id: 1,
          uid: '',
          tenantId: '',
          programUid: '',
          startTm: '2019/1/1 00:00:00',
          endTm: '2019/1/1 23:59:00',
          monday: '0',
          tuesday: '0',
          wednesday: '0',
          thursday: '0',
          friday: '0',
          saturday: '0',
          sunday: '0',
          delFlag: '',
          createTime: '',
          updateTime: '',
          weekDay_checkAll: false,
          isIndeterminate_week: false,
          weekendDay_checkAll: false,
          isIndeterminate_weekend: false,
          flagWeekArr: [],
          flagWeekendArr: []
        }]
      };
      this.$nextTick(() => {
        if (this.$refs['dataForm']) {
          this.$refs['dataForm'].resetFields();
        }
      });
    },
    formatDate (str) {
      if (str && str.length > 10) {
        return str.substring(0, 10);
      } else {
        return str || '';
      }
    },
    // 获取影厅类型
    async getHallTypeList () {
      let params = {
        name: 'CI_HALL_TYPE'
      };
      let [err, ret] = await this.$to(hallTypeList(params));
      if (err) {
        return;
      }
      // console.log(ret)
      this.dataForm.ciPriceHallTypeOption = ret.data;
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    useHallChange (val) {
      if (val == 1) {
        // this.dataForm.checkList=[];
        // 适用影厅 清空所选
        if (this.dataForm.ciCinemaAndHallVos && this.dataForm.ciCinemaAndHallVos.length > 0) {
          this.dataForm.ciCinemaAndHallVos.forEach(item => {
            item.selectedHalls = [];
          });
        }
      }
    },
    useHallTypeChange (val) {
      if (val == 1) {
        this.dataForm.checkList = [];
        this.getCinameHallByType(this.dataForm.ciCinemaAndHallVos, this.dataForm.checkList);
      }
    },
    checkListChange (val) {
      // console.log(this.dataForm.checkList);
      this.getCinameHallByType(this.dataForm.ciCinemaAndHallVos, this.dataForm.checkList);
    },
    useChannelChange (val) {
      if (val == 1) {
        this.dataForm.ciPriceSaleChannelVoList = [];
        this.channelDefaultSelectRows = [];
        this.dataForm.channelShortName = '';
        this.dataForm.channelNameStr = '';
      }
    },
    electedHallChange (val, item) {
      // console.log(val);
      item.selectedHalls = val;
      this.$nextTick(() => {
        this.$forceUpdate();
      });
    },
    priceTypeChange (val) {
      console.log(val);
      if (val == 1) {
        if (this.dataForm.priceA > 100) {
          this.dataForm.priceA = 100;
        }
      }
    },
    validRuleType (rule, value, callback) {
      if (value === 0 || value === 1) {
        if (value === 0) {
          if ((this.dataForm.priceTypeA != 0 && this.dataForm.priceTypeA != 1) || !this.dataForm.priceA) {
            callback(new Error('请完善调价规则'));
          } else {
            callback();
          }
        } else {
          if (!this.dataForm.priceTypeB || (this.dataForm.priceTypeB == 3 && !this.dataForm.priceB)) {
            callback(new Error('请完善调价规则'));
          } else {
            callback();
          }
        }
      } else {
        callback(new Error('请完善调价规则'));
      }
    },
    validCinameType (rule, value, callback) {
      let cinemaTypeList = this.$refs.cinemaTypeInput.value;
      if (value == 0) {
        if (!cinemaTypeList || (cinemaTypeList && cinemaTypeList.length == 0)) {
          callback(new Error('请选择影厅类型'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    validChannelType (rule, value, callback) {
      let useCinemaName = this.$refs.channelNameInput.value;
      if (value == 0) {
        if (!useCinemaName) {
          callback(new Error('请选择渠道'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    },
    async channelSelect (val) {
      console.log(val);
      this.channelDefaultSelectRows = val;
      this.dataForm.ciPriceSaleChannelVoList = val;
      let str = '';
      let cutStr = '';
      val.forEach((item, index) => {
        if (index == val.length - 1) {
          str = str + item.name;
        } else {
          str = str + item.name + '，';
        }
      });
      cutStr = str;
      if (val.length > 2 && str.length > 20) {
        cutStr = str.substring(0, 14) + '...共' + val.length + '种';
      }
      this.dataForm.channelShortName = cutStr;
      this.dataForm.channelNameStr = str;
      this.$nextTick(() => {
        this.$refs.dataForm.validateField('useChannel');
      });
    },
    showChannelModel () {
      this.channelModelVisible = true;
    },
    showCinemaModel () {
      this.modelVisible = true;
    },
    async selectedTable (val) {
      // console.log(val);
      this.defaultSelectRows = val;
      let str = '';
      let cutStr = '';
      let ciCinemaAndHallVos = [];

      val.forEach((item, index) => {
        let cinemaObj = {};
        // item.uid=item.cinemaUid;
        // item.name=item.cinemaName;
        cinemaObj.cinema = item;
        cinemaObj.halls = [];
        cinemaObj.selectedHalls = [];
        cinemaObj.hallList = [];
        let existObj = this.dataForm.ciCinemaAndHallVos.find(el => {
          return el.cinema.uid == item.uid;
        });
        if (existObj) {
          let halls = [];
          // if(existObj.selectedHalls && existObj.selectedHalls.length>0){
          //   existObj.selectedHalls.forEach(uid=>{
          //     let hallObj=existObj.hallList.find(el=>{
          //       return uid==el.uid
          //     })
          //     halls.push(hallObj);
          //   })
          // }
          cinemaObj.halls = halls;
          cinemaObj.selectedHalls = existObj.selectedHalls;
          cinemaObj.hallList = existObj.hallList;
        }
        ciCinemaAndHallVos.push(cinemaObj);

        if (index == val.length - 1) {
          str = str + item.name;
        } else {
          str = str + item.name + '，';
        }
      });
      cutStr = str;
      if (val.length > 2 && str.length > 20) {
        cutStr = str.substring(0, 14) + '...共' + val.length + '家';
      }
      this.dataForm.cinemaNames = cutStr;
      this.dataForm.cinemaNameStr = str;
      this.dataForm.ciCinemaAndHallVos = ciCinemaAndHallVos;
      // 获取影厅
      this.getCinameHallByType(ciCinemaAndHallVos, this.dataForm.checkList);
    },
    async getCinameHallByType (ciCinemaAndHallVos, checkList) {
      let cinemaUidList = [];
      if (ciCinemaAndHallVos && ciCinemaAndHallVos.length > 0) {
        ciCinemaAndHallVos.forEach(item => {
          cinemaUidList.push(item.cinema.uid);
        });
      }
      let params = {
        cinemaUidList: cinemaUidList,
        hallTypeList: checkList
      };
      let [err, ret] = await this.$to(fetchCinameHallByType(params));
      if (err) {
        return;
      }
      console.log(ret);
      if (ret.code == 200) {
        if (ret.data && ret.data.length > 0) {
          ret.data.forEach(item => {
            item.uid = item.cinemaUid;
            let obj = this.dataForm.ciCinemaAndHallVos.find(el => {
              return item.cinemaUid == el.cinema.uid;
            });
            if (obj) {
              item.hallList.forEach(hallObj => {
                hallObj.uid = hallObj.hallUid;
              });
              obj.hallList = item.hallList;
              // 重置选择项目
              let selectedHalls = [];
              if (obj.selectedHalls && obj.selectedHalls.length > 0) {
                obj.selectedHalls.forEach(hallUid => {
                  let tempObj = obj.hallList.find(hallItem => {
                    return hallItem.uid == hallUid;
                  });
                  if (tempObj) {
                    selectedHalls.push(hallUid);
                  }
                });
              }
              obj.selectedHalls = selectedHalls;
            }
          });
          this.$nextTick(() => {
            this.$forceUpdate();
          });
        }
      }
    },
    async submitForm (draft) {
      if (!this.dataForm.ciPriceProgram) {
        this.dataForm.ciPriceProgram = {};
      }
      if (this.dataForm.daterange && this.dataForm.daterange.length == 2) {
        this.dataForm.ciPriceProgram.startDy = this.dataForm.daterange[0];
        this.dataForm.ciPriceProgram.endDy = this.dataForm.daterange[1];
      }
      this.dataForm.ciPriceProgram.name = this.dataForm.name;
      this.dataForm.ciPriceProgram.priority = this.dataForm.priority;
      this.dataForm.ciPriceProgram.status = this.dataForm.status;
      this.dataForm.ciPriceProgram.useChannel = this.dataForm.useChannel;
      this.dataForm.ciPriceProgram.useHall = this.dataForm.useHall;
      this.dataForm.ciPriceProgram.useCinema = 0;
      this.dataForm.ciPriceProgram.useHallType = this.dataForm.useHallType;

      if (this.$route.query.uid) {
        this.dataForm.ciPriceProgram.uid = this.$route.query.uid;
      }

      if (!this.dataForm.addedAdjus) {
        this.dataForm.addedAdjus = {};
      }
      this.dataForm.addedAdjus.ruleType = this.dataForm.ruleType;
      if (this.dataForm.ruleType == 0) {
        this.dataForm.addedAdjus.priceType = this.dataForm.priceTypeA;
        this.dataForm.addedAdjus.price = this.dataForm.priceA;
      } else if (this.dataForm.ruleType == 1) {
        this.dataForm.addedAdjus.priceType = this.dataForm.priceTypeB;
        this.dataForm.addedAdjus.price = this.dataForm.priceB;
      }

      console.log(this.dataForm);
      this.$refs['dataForm'].validate(async valid => {
        if (valid) {
          // 判断适用时段是否选择
          if (!this.dataForm.tmList.every((item, index) => {
            return (item.flagWeekArr.length > 0 || item.flagWeekendArr.length > 0) && (item.startTm != null &&
              item.endTm != null);
          })) {
            this.$message({
              message: '请选择适用时段！',
              type: 'warning'
            });
            return;
          }
          if (!this.dataForm.tmList.every((item, index) => {
            moment.suppressDeprecationWarnings = true;
            var t1 = moment(item.startTm);
            var t2 = moment(item.endTm);
            // console.log(t1);
            // console.log(t2);
            // console.log(t2.diff(t1, 'minute'));
            return (item.startTm != null && item.endTm != null) && (t2.diff(t1, 'minute') >= 0);
          })) {
            this.$message({
              message: '适用时段开始时间不能大于结束时间！',
              type: 'warning'
            });
            return;
          }

          let ciPriceHallType = [];
          if (this.dataForm.checkList && this.dataForm.checkList.length > 0) {
            this.dataForm.checkList.forEach(keyCode => {
              let typeObj = this.dataForm.ciPriceHallTypeOption.find(item => {
                return keyCode == item.keyCode;
              });
              if (typeObj) {
                ciPriceHallType.push(typeObj);
              }
            });
            this.dataForm.ciPriceHallType = ciPriceHallType;
          } else {
            this.dataForm.ciPriceHallType = [];
          }

          // 适用影厅
          if (this.dataForm.ciCinemaAndHallVos && this.dataForm.ciCinemaAndHallVos.length > 0) {
            this.dataForm.ciCinemaAndHallVos.forEach(item => {
              let halls = [];
              if (item.selectedHalls && item.selectedHalls.length > 0) {
                item.selectedHalls.forEach(uid => {
                  let hallObj = item.hallList.find(el => {
                    return uid == el.uid;
                  });
                  halls.push(hallObj);
                });
              }
              item.halls = halls;
            });
          }
          if (draft == true) {
            this.draftLoading = true;
          } else {
            this.saveLoading = true;
          }

          this.dataForm.draft = draft;
          let saveParams = JSON.parse(JSON.stringify(this.dataForm));
          delete saveParams.daterange;
          delete saveParams.ciPriceHallTypeOption;
          delete saveParams.checkList;

          // let resultTime = JSON.parse(JSON.stringify(this.dataForm.tmList))
          let resultTime = saveParams.tmList;
          if (resultTime && resultTime.length > 0) {
            resultTime = resultTime.map((item, index) => {
              if (item.startTm && item.endTm) {
                item.startTm = new Date(item.startTm).getHours() + ':' + new Date(item.startTm).getMinutes();
                item.endTm = new Date(item.endTm).getHours() + ':' + new Date(item.endTm).getMinutes();
              }
              return item;
            });
            console.log('resultTime', resultTime);
            saveParams.tmList = resultTime;
          }

          if (this.$route.query.uid) {
            let [err, ret] = await this.$to(updateExtraPrice(saveParams));
            this.saveLoading = false;
            this.draftLoading = false;
            if (err) {
              return;
            }
            if (ret.code == 200) {
              this.$message({
                type: 'success',
                message: '保存成功！'
              });
              this.$router.push('/ticket/extraPrice/list');
            } else {
              this.$message({
                type: 'warning',
                message: ret.msg ? ret.msg : '保存失败，请稍后再试！'
              });
            }
          } else {
            let [err, ret] = await this.$to(saveExtraPrice(saveParams));
            this.saveLoading = false;
            this.draftLoading = false;
            if (err) {
              return;
            }
            if (ret.code == 200) {
              this.resetForm();
              this.$message({
                type: 'success',
                message: '保存成功！'
              });
              this.$router.push('/ticket/extraPrice/list');
            } else {
              this.$message({
                type: 'warning',
                message: ret.msg ? ret.msg : '保存失败，请稍后再试！'
              });
            }
          }
        } else {
          this.$message({
            type: 'warning',
            message: '输入错误,请检查您的输入!!!'
          });
        }
      });
    },
    resetPageStatus () {
      if (this.$route.query.uid && this.$route.query.uid) {
        if (this.$route.fullPath.indexOf('/scan') != -1) {
          // 查看页面
          console.log('scan view');
          this.scan = 3;
          this.rules = {};
        } else {
          this.scan = 2;
          // 编辑页面
        }
      } else {
        this.scan = 1;
        // 新增
      }
    },
    async getDetail (uid) {
      let self = this;
      // let ret=require("./detail.json");
      // console.log(ret);
      let params = {
        programUid: uid,
        uid: uid
      };
      let [err, result] = await this.$to(queryExtraPriceDetail(params));
      if (err) {
        return;
      }

      if (result.code != 200) {
        return;
      }
      let ret = result.data;

      // 时间段处理
      if (ret.tmList && ret.tmList.length > 0) {
        self.dataForm.tmList = ret.tmList.map((item, index) => {
          // let item2 ={}
          let startTmStr = item.startTm;
          if (item.startTm) {
            let tmArr = item.startTm.split(':');
            if (tmArr.length == 2) {
              tmArr[0] = tmArr[0].length == 1 ? ('0' + tmArr[0]) : tmArr[0];
              tmArr[1] = tmArr[1].length == 1 ? ('0' + tmArr[1]) : tmArr[1];
              startTmStr = tmArr[0] + ':' + tmArr[1];
            }
          }
          let endTmStr = item.endTm;
          if (item.endTm) {
            let tmArr = item.endTm.split(':');
            if (tmArr.length == 2) {
              tmArr[0] = tmArr[0].length == 1 ? ('0' + tmArr[0]) : tmArr[0];
              tmArr[1] = tmArr[1].length == 1 ? ('0' + tmArr[1]) : tmArr[1];
              endTmStr = tmArr[0] + ':' + tmArr[1];
            }
          }
          let timeStr = startTmStr + ' 至 ' + endTmStr;
          let timeRangeStr = '';

          item.endTm = '2019/1/1' + ' ' + item.endTm + ':00';
          item.startTm = '2019/1/1' + ' ' + item.startTm + ':00';
          if (item.monday == 1 && item.tuesday == 1 && item.wednesday == 1 && item.thursday == 1 && item
            .friday == 1) {
            item.weekDay_checkAll = true;
            item.isIndeterminate_week = false;
          } else if (item.monday == 0 && item.tuesday == 0 && item.wednesday == 0 && item.thursday == 0 &&
            item.friday == 0) {
            item.weekDay_checkAll = false;
            item.isIndeterminate_week = false;
          } else {
            item.weekDay_checkAll = false;
            item.isIndeterminate_week = true;
          }
          if (item.saturday == 1 && item.sunday == 1) {
            item.weekendDay_checkAll = true;
            item.isIndeterminate_weekend = false;
          } else if (item.saturday == 0 && item.sunday == 0) {
            item.weekendDay_checkAll = false;
            item.isIndeterminate_weekend = false;
          } else {
            item.weekendDay_checkAll = false;
            item.isIndeterminate_weekend = true;
          }
          item.monday = item.monday + '';
          item.tuesday = item.tuesday + '';
          item.wednesday = item.wednesday + '';
          item.thursday = item.thursday + '';
          item.friday = item.friday + '';
          item.saturday = item.saturday + '';
          item.sunday = item.sunday + '';
          item.flagWeekArr = [];
          item.flagWeekendArr = [];
          // 增加选择标识
          if (item.monday == 1) {
            timeRangeStr = '星期一';
            item.flagWeekArr.push(1);
          }
          if (item.tuesday == 1) {
            timeRangeStr = timeRangeStr + '、星期二';
            item.flagWeekArr.push(1);
          }
          if (item.wednesday == 1) {
            timeRangeStr = timeRangeStr + '、星期三';
            item.flagWeekArr.push(1);
          }
          if (item.thursday == 1) {
            timeRangeStr = timeRangeStr + '、星期四';
            item.flagWeekArr.push(1);
          }
          if (item.friday == 1) {
            timeRangeStr = timeRangeStr + '、星期五';
            item.flagWeekArr.push(1);
          }
          if (item.saturday == 1) {
            timeRangeStr = timeRangeStr + '、星期六';
            item.flagWeekendArr.push(1);
          }
          if (item.sunday == 1) {
            timeRangeStr = timeRangeStr + '、星期日';
            item.flagWeekendArr.push(1);
          }
          if (item.monday != 1 && timeRangeStr.length > 1) {
            timeRangeStr = timeRangeStr.substring(1, timeRangeStr.length);
          }
          // timeRangeStr=timeRangeStr;
          item.timeRangeStr = timeRangeStr;
          item.timeStr = timeStr;
          // console.log('item-加时间',item)
          return item;
        });
      }

      this.dataForm.daterange = [ret.ciPriceProgram.startDy, ret.ciPriceProgram.endDy];

      this.dataForm.ciPriceProgram = ret.ciPriceProgram;
      this.dataForm.name = ret.ciPriceProgram.name;
      this.dataForm.status = ret.ciPriceProgram.status;
      this.dataForm.priority = ret.ciPriceProgram.priority;
      this.dataForm.useChannel = ret.ciPriceProgram.useChannel;
      this.dataForm.useHallType = ret.ciPriceProgram.useHallType;
      this.dataForm.uid = ret.ciPriceProgram.uid;

      // 调价规则
      if (ret.addedAdjus) {
        this.dataForm.ruleType = ret.addedAdjus.ruleType;
        let rulePriceStr = '';
        if (this.dataForm.ruleType == 0) {
          this.dataForm.priceTypeA = ret.addedAdjus.priceType;
          this.dataForm.priceA = ret.addedAdjus.price;
          if (this.dataForm.priceTypeA == 0) {
            rulePriceStr = '固定金额：' + (this.dataForm.priceA ? this.dataForm.priceA.toFixed(2) : 0) + '元';
          } else if (this.dataForm.priceTypeA == 1) {
            rulePriceStr = '结算价百分比：' + (this.dataForm.priceA ? this.dataForm.priceA.toFixed(2) : 0) + '%';
          }
        } else if (this.dataForm.ruleType == 1) {
          this.dataForm.priceTypeB = ret.addedAdjus.priceType;
          this.dataForm.priceB = ret.addedAdjus.price;
          if (this.dataForm.priceTypeB == 2) {
            rulePriceStr = '不限最高价';
          } else if (this.dataForm.priceTypeB == 3) {
            rulePriceStr = '指定增值服务费最高限价' + (this.dataForm.priceB ? this.dataForm.priceB.toFixed(2) : 0) + '元';
          }
        }
        this.dataForm.rulePriceStr = rulePriceStr;
      }

      // 影院列表
      this.dataForm.ciCinemaAndHallVos = ret.ciCinemaAndHallVos || [];
      console.log(this.dataForm.ciCinemaAndHallVos);
      let str = '';
      let cutStr = '';
      if (ret.ciCinemaAndHallVos && ret.ciCinemaAndHallVos.length > 0) {
        let defaultSelectRows = [];
        ret.ciCinemaAndHallVos.forEach((item, index) => {
          let defaultSelectObj = {
            cinemaName: item.cinema.name,
            cinemaUid: item.cinema.uid,
            name: item.cinema.name,
            uid: item.cinema.uid
          };
          defaultSelectRows.push(defaultSelectObj);
          item.cinema.cinemaName = item.cinema.name;
          item.cinema.cinemaUid = item.cinema.uid;
          if (!item.halls) {
            item.halls = [];
          }
          item.hallList = item.halls;
          let selectedHalls = [];
          let hallStr = '';
          item.halls.forEach((el, idx) => {
            selectedHalls.push(el.uid);
            if (idx == item.halls.length - 1) {
              hallStr = hallStr + el.name;
            } else {
              hallStr = hallStr + el.name + '，';
            }
          });
          item.hallStr = hallStr;
          item.selectedHalls = selectedHalls;
          // console.log(selectedHalls);
          if (index == ret.ciCinemaAndHallVos.length - 1) {
            str = str + item.cinema.name;
          } else {
            str = str + item.cinema.name + '，';
          }
        });
        this.defaultSelectRows = defaultSelectRows;
        cutStr = str;
        if (ret.ciCinemaAndHallVos.length > 2 && str.length > 20) {
          cutStr = str.substring(0, 14) + '...共' + ret.ciCinemaAndHallVos.length + '家';
        }
      }
      this.dataForm.cinemaNames = cutStr;
      this.dataForm.cinemaNameStr = str;
      // 获取渠道数据
      str = '';
      cutStr = '';
      if (ret.baseChannelEntities && ret.baseChannelEntities.length > 0) {
        ret.baseChannelEntities.forEach((item, index) => {
          if (index == ret.baseChannelEntities.length - 1) {
            str = str + item.name;
          } else {
            str = str + item.name + '，';
          }
        });
        cutStr = str;
        if (ret.baseChannelEntities.length > 2 && str.length > 20) {
          cutStr = str.substring(0, 14) + '...共' + ret.baseChannelEntities.length + '种';
        }
        this.dataForm.channelShortName = cutStr;
        this.dataForm.channelNameStr = str;
      }
      this.dataForm.ciPriceSaleChannelVoList = ret.baseChannelEntities;
      this.channelDefaultSelectRows = ret.baseChannelEntities;

      // 影厅类型
      if (ret.ciPriceHallType && ret.ciPriceHallType.length > 0) {
        let arr = [];
        let ciPriceHallTypeStr = '';
        ret.ciPriceHallType.forEach((item, index) => {
          arr.push(item.keyCode);
          if (index == ret.ciPriceHallType.length - 1) {
            ciPriceHallTypeStr = ciPriceHallTypeStr + item.keyName;
          } else {
            ciPriceHallTypeStr = ciPriceHallTypeStr + item.keyName + '，';
          }
        });
        this.dataForm.checkList = arr;
        this.dataForm.ciPriceHallType = ret.ciPriceHallType;
        this.dataForm.ciPriceHallTypeStr = ciPriceHallTypeStr;
      }

      this.$nextTick(() => {
        this.dataForm.useHall = ret.ciPriceProgram.useHall;
        this.$forceUpdate();
      });

      this.getCinameHallByType(this.dataForm.ciCinemaAndHallVos, this.dataForm.checkList);
    },
    async cancelFun () {
      // const re = await this.$utils.confirm("确定放弃当前更改吗？")
      // if (re) { }
      this.resetForm();
      this.$router.go(-1);
    },
    // 工作日
    handleCheckedWeekChange ($event, index) {
      let self = this;
      let event = $event * 1;

      // self.flagWeekArr =self.dataForm.tmList
      if (event) {
        self.dataForm.tmList[index].flagWeekArr.push(1);
      } else {
        self.dataForm.tmList[index].flagWeekArr.pop();
      }
      let checkedCount = self.dataForm.tmList[index].flagWeekArr.length;
      // debugger
      console.log(' self.dataForm.tmList[index].weekDay_checkAll', self.dataForm.tmList[index].weekDay_checkAll);
      self.dataForm.tmList[index].weekDay_checkAll = checkedCount === this.cities1.length;

      self.dataForm.tmList[index].isIndeterminate_week =
        checkedCount > 0 && checkedCount < this.cities1.length;
    },
    handleCheckWeekAllChange ($event, index) {
      let self = this;
      if ($event) {
        self.dataForm.tmList[index].monday = '1';
        self.dataForm.tmList[index].tuesday = '1';
        self.dataForm.tmList[index].wednesday = '1';
        self.dataForm.tmList[index].thursday = '1';
        self.dataForm.tmList[index].friday = '1';
        self.dataForm.tmList[index].flagWeekArr.push(1);
      } else {
        self.dataForm.tmList[index].monday = '0';
        self.dataForm.tmList[index].tuesday = '0';
        self.dataForm.tmList[index].wednesday = '0';
        self.dataForm.tmList[index].thursday = '0';
        self.dataForm.tmList[index].friday = '0';
        self.dataForm.tmList[index].flagWeekArr.pop();
      }
      self.dataForm.tmList[index].isIndeterminate_week = false;
    },
    // 周末
    handleCheckedWeekendChange ($event, index) {
      let self = this;
      let event = $event * 1;
      if (event) {
        self.dataForm.tmList[index].flagWeekendArr.push(1);
      } else {
        self.dataForm.tmList[index].flagWeekendArr.pop();
      }
      let checkedCount = self.dataForm.tmList[index].flagWeekendArr.length;
      self.dataForm.tmList[index].weekendDay_checkAll = checkedCount === this.cities2.length;
      self.dataForm.tmList[index].isIndeterminate_weekend =
        checkedCount > 0 && checkedCount < this.cities2.length;
    },
    handleCheckWeekendAllChange ($event, index) {
      let self = this;
      if ($event) {
        self.dataForm.tmList[index].saturday = '1';
        self.dataForm.tmList[index].sunday = '1';
        self.isIndeterminate_week = true;
        self.dataForm.tmList[index].flagWeekendArr.push(1);
      } else {
        self.dataForm.tmList[index].saturday = '0';
        self.dataForm.tmList[index].sunday = '0';
        self.isIndeterminate_week = false;
        self.dataForm.tmList[index].flagWeekendArr.pop();
      }
      self.dataForm.tmList[index].isIndeterminate_weekend = false;
    },
    // 删除时间
    deleFun (item, index) {
      var flag = this.dataForm.tmList.indexOf(item);
      if (this.dataForm.tmList.length == 1) {
        this.$message({
          message: '必须保留一个时间段',
          type: 'warning'
        });
      } else {
        if (flag > -1) {
          this.dataForm.tmList.splice(flag, 1);
        }
      }
    },
    // 增加时间
    addTimearea () {
      let self = this;

      if (this.dataForm.tmList.length > 4) {
        this.$message({
          message: '时间段不能超过5个',
          type: 'warning'
        });
      } else {
        this.dataForm.tmList.push({
          id: 1,
          uid: '',
          tenantId: '',
          programUid: '',
          startTm: '2019/1/1 00:00:00',
          endTm: '2019/1/1 23:59:00',
          monday: '0',
          tuesday: '0',
          wednesday: '0',
          thursday: '0',
          friday: '0',
          saturday: '0',
          sunday: '0',
          delFlag: '',
          createTime: '',
          updateTime: '',
          // 业务需要字段
          weekDay_checkAll: false,
          isIndeterminate_week: false,
          weekendDay_checkAll: false,
          isIndeterminate_weekend: false,
          flagWeekArr: [],
          flagWeekendArr: []
        });
      }
    }
  }
};
</script>

<style lang='scss' scoped>
.extra-price-list {
  .c-form {
    color: #666;
  }
  .flex-wrapper {
    display: -ms-flexbox;
    display: -moz-box;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
  }
  /deep/ .f-h-32 {
    .el-input__inner {
      height: 32px !important;
    }
  }
  /deep/ .s-h-326 {
    .el-input {
      width: 326px;
    }
  }
  .l-h-1 {
    line-height: 1;
  }
  .c-p {
    cursor: pointer;
  }
  .time-interval {
    margin-top: 16px;
  }
  .time-interval:first-child {
    margin-top: 5px;
  }
  .b-g-h {
    background-color: #f5f5f5;
  }
  .a-i-c {
    align-items: center;
  }
  .tip-c {
    color: #ff8900;
  }
  .v-error {
    color: #f56c6c;
  }
  /deep/ .el-input-number .el-input {
    width: 180px;
  }
  /deep/ .el-collapse-item__wrap {
    padding-top: 8px;
  }
  .cinema-room {
    width: 600px;
    border-left: 1px solid #e5e5e5;
    .header {
      background-color: #e7ebff;
    }
    .td {
      padding-left: 8px;
      border-right: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
    }
    .flex-1 {
      flex: 1;
    }
  }
}
</style>