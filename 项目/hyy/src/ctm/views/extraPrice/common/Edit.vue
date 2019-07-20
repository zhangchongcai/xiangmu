<template>
  <div class="ctm extra-price-list">
    <el-collapse v-model="activeNames">
      <el-form
        ref="dataForm"
        :model="dataForm"
        label-width="97px"
        size="small"
        :rules="rules"
        class="base-form"
      >
        <el-collapse-item
          title="基础信息"
          name="1"
        >
          <el-form-item
            label="方案名称："
            prop="name"
          >
            <el-input v-model="dataForm.name"></el-input>
          </el-form-item>
          <el-form-item
            label="状态："
            prop="status"
          >
            <el-radio-group v-model="dataForm.status">
              <el-radio :label='1'>启用</el-radio>
              <el-radio :label='0'>禁用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            label="优先级："
            prop="priority"
          >
            <el-select
              v-model="dataForm.priority"
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
        </el-collapse-item>
        <el-collapse-item
          title="适用条件"
          name="2"
        >
          <el-form-item label="适用影院：">
            <el-button
              type="primary"
              plain
              @click="cinemaSelectFun()"
            >请选择影院</el-button><span
              style="color:#f56c6c;font-size:14px;margin-left:8px"
              v-for="(item,index) in dataForm.ciCinemaList"
              :key="index"
            >{{item.name}}</span>
          </el-form-item>
          <el-form-item
            label="适用渠道："
            prop="useCinema"
          >
            <el-select
              v-model="dataForm.useCinema"
              placeholder="请选择"
            >
              <el-option
                label="不限"
                :value="1"
              ></el-option>
              <el-option
                label="指定渠道"
                :value="0"
              ></el-option>
            </el-select>
            <el-input
              v-show="dataForm.useCinema==0"
              ref="useCinemaNameInput"
              style="margin-left:5px;"
              :readonly="true"
              v-model="dataForm.useCinemaName"
              placeholder="适用影院"
            ></el-input>
            <el-button
              plain
              type="primary"
              v-show="dataForm.useCinema==0"
              style="margin-left:10px;"
              @click.prevent="showCinemaModel"
            >选择</el-button>
          </el-form-item>

          <el-form-item
            label="适用影厅类型："
            prop="useCinema"
          >
            <el-select
              v-model="dataForm.cinemaType"
              placeholder="请选择"
            >
              <el-option
                label="不限"
                :value="1"
              ></el-option>
              <el-option
                label="指定影厅类型"
                :value="0"
              ></el-option>
            </el-select>
            <el-checkbox-group
              class="m-t-16"
              v-show="dataForm.cinemaType==0"
              v-model="dataForm.checkList"
            >
              <el-checkbox label="1">3D影厅</el-checkbox>
              <el-checkbox label="2">IMAX</el-checkbox>
              <el-checkbox label="3">巨幕影厅</el-checkbox>
            </el-checkbox-group>
          </el-form-item>

          <el-form-item
            label="适用影厅："
            prop="useCinema"
          >
            <el-select
              v-model="dataForm.cinemaRoom"
              placeholder="请选择"
            >
              <el-option
                label="不限"
                :value="1"
              ></el-option>
              <el-option
                label="指定影厅"
                :value="0"
              ></el-option>
            </el-select>
            <div
              class="cinema-room m-t-16"
              v-show="dataForm.cinemaRoom==0"
            >
              <div class="flex-wrapper header">
                <div class="td w-150">影院</div>
                <div class="td flex-1">适用影厅</div>
              </div>
              <div
                v-for="(item,index) in dataForm.cinemaList"
                :key="index"
                class="flex-wrapper"
              >
                <div class="td w-150">XXX影院</div>
                <div class="td flex-1">
                  <el-select
                    v-model="dataForm.selectedList"
                    multiple
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in item.options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </el-form-item>

          <el-form-item
            label="有效日期："
            prop="daterange"
          >
            <el-date-picker
              clearable
              v-model="dataForm.daterange"
              type="daterange"
              value-format="yyyy-MM-dd"
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

            <div
              class="flex-wrapper a-i-c time-interval"
              v-for='(item, index) in dataForm.tmList'
              :key="index"
            >
              <div class="b-o b-g-h">
                <div class="flex-wrapper b-b time-interval-1">
                  <div class="w-80 p-v-8 p-l-8">
                    <el-checkbox
                      :indeterminate="item.isIndeterminate_week"
                      v-model="item.weekDay_checkAll"
                      @change="handleCheckWeekAllChange($event,index)"
                    >工作日</el-checkbox>
                  </div>
                  <div class="time-interval-week p-8">
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
                <div class="flex-wrapper b-b">
                  <div class="w-80 p-v-8 p-l-8">
                    <el-checkbox
                      :indeterminate="item.isIndeterminate_weekend"
                      v-model="item.weekendDay_checkAll"
                      @change="handleCheckWeekendAllChange($event,index)"
                    >周末</el-checkbox>
                  </div>
                  <div class="p-8">
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

                <div
                  class="m-v-10 m-l-10 time-interval-3"
                  ref='timeDom'
                >
                  <div class="time-wrap">
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

              <div class="item-interval-delete">
                <el-button
                  type="text"
                  @click="deleFun(item,index)"
                >
                  删除
                </el-button>
              </div>
            </div>
            <div class="add-timearea">
              <span
                class="f-12 c-primary c-p"
                @click="addTimearea"
              >
                <i class="iconfont icon-neiye-tianjia-"></i>
                <span>添加时间</span>
              </span>
            </div>
          </el-form-item>

        </el-collapse-item>
        <el-collapse-item
          title="增值服务费价格设置"
          name="3"
        >
          <el-form-item
            label="调价规则："
            prop="daterange"
          >
            <div>
              <el-radio
                class="m-r-8"
                v-model="dataForm.radio"
                label="1"
              >指定增值服务费</el-radio>
              <el-select
                class="m-r-8"
                v-model="dataForm.extraType"
                placeholder="请选择"
              >
                <el-option
                  label="固定金额"
                  :value="1"
                ></el-option>
                <el-option
                  label="结算价百分比%"
                  :value="0"
                ></el-option>
              </el-select>
              <el-input-number
                v-show="dataForm.extraType==0"
                v-model="dataForm.seq"
                :controls="false"
                placeholder=""
              ></el-input-number>
            </div>
            <div class="m-t-16">
              <el-radio
                class="m-r-8"
                v-model="dataForm.radio"
                label="2"
              >等于结算价和最低发行价差额</el-radio>
              <el-select
                class="m-r-8"
                v-model="dataForm.sumType"
                placeholder="请选择"
              >
                <el-option
                  label="不限最高限价"
                  :value="1"
                ></el-option>
                <el-option
                  label="指定增值服务费最高限价N元"
                  :value="0"
                ></el-option>
              </el-select>
              <el-input-number
                v-show="dataForm.sumType==1"
                v-model="dataForm.seq"
                :controls="false"
                placeholder=""
              ></el-input-number>
            </div>

          </el-form-item>
        </el-collapse-item>
      </el-form>
    </el-collapse>
    <fixStepTool :stepData="stepData.stepList"></fixStepTool>
  </div>
</template>

<script type='text/ecmascript-6'>
import fixStepTool from "ctm/components/fix-step-tool/fix-step-tool"
import fixStepMixin from "ctm/mixins/fixStepTool"
const cityOptions1 = [{
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
const cityOptions2 = [{
  name: "周六",
  value: "saturday"
},
{
  name: "周日",
  value: "sunday"
}
];
export default {
  components: {
    fixStepTool
  },
  mixins: [fixStepMixin],
  data () {
    return {
      activeNames: ["1", "2", "3"],

      dataForm: {
        ciCinemaList: { name: "广电测试影院" },
        cinemaList: [{
          options: [{
            label: "你弟",
            value: 'ds'
          }]
        }
        ],
        checkList: [],
        tmList: [{
          id: 1,
          uid: "",
          tenantId: "",
          programUid: "",
          startTm: '2019/1/1 00:00:00',
          endTm: '2019/1/1 23:59:00',
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
          flagWeekendArr: [],
        }],
      },
      cities1: cityOptions1,
      cities2: cityOptions2,
      rules: {},
      stepData: {
        stepEl: ".el-collapse-item",
        stepList: [{
          name: "基础信息",
          isactive: false
        },
        {
          name: "适用条件",
          isactive: false
        },
        {
          name: "增值服务费价格设置",
          isactive: false
        }
        ]
      },
    }
  },
  created () {
  },
  mounted () {

  },
  methods: {
    //工作日
    handleCheckedWeekChange ($event, index) {
      let self = this
      let event = $event * 1

      // self.flagWeekArr =self.dataForm.tmList
      if (event) {
        self.dataForm.tmList[index].flagWeekArr.push(1)
      } else {
        self.dataForm.tmList[index].flagWeekArr.pop()
      }
      let checkedCount = self.dataForm.tmList[index].flagWeekArr.length;
      // debugger
      console.log(' self.dataForm.tmList[index].weekDay_checkAll', self.dataForm.tmList[index].weekDay_checkAll)
      self.dataForm.tmList[index].weekDay_checkAll = checkedCount === this.cities1.length;


      self.dataForm.tmList[index].isIndeterminate_week =
        checkedCount > 0 && checkedCount < this.cities1.length;
    },
    handleCheckWeekAllChange ($event, index) {
      let self = this;
      if ($event) {
        self.dataForm.tmList[index].monday = "1";
        self.dataForm.tmList[index].tuesday = "1"
        self.dataForm.tmList[index].wednesday = "1"
        self.dataForm.tmList[index].thursday = "1"
        self.dataForm.tmList[index].friday = "1"
        self.dataForm.tmList[index].flagWeekArr.push(1)

      } else {
        self.dataForm.tmList[index].monday = "0";
        self.dataForm.tmList[index].tuesday = "0"
        self.dataForm.tmList[index].wednesday = "0"
        self.dataForm.tmList[index].thursday = "0"
        self.dataForm.tmList[index].friday = "0"
        self.dataForm.tmList[index].flagWeekArr.pop()
      }
      self.dataForm.tmList[index].isIndeterminate_week = false;

    },
    //周末
    handleCheckedWeekendChange ($event, index) {
      let self = this
      let event = $event * 1
      if (event) {
        self.dataForm.tmList[index].flagWeekendArr.push(1)
      } else {
        self.dataForm.tmList[index].flagWeekendArr.pop()
      }
      let checkedCount = self.dataForm.tmList[index].flagWeekendArr.length;
      self.dataForm.tmList[index].weekendDay_checkAll = checkedCount === this.cities2.length;
      self.dataForm.tmList[index].isIndeterminate_weekend =
        checkedCount > 0 && checkedCount < this.cities2.length;
    },
    handleCheckWeekendAllChange ($event, index) {
      let self = this;
      if ($event) {
        self.dataForm.tmList[index].saturday = "1"
        self.dataForm.tmList[index].sunday = "1"
        self.isIndeterminate_week = true;
        self.dataForm.tmList[index].flagWeekendArr.push(1)
      } else {
        self.dataForm.tmList[index].saturday = "0"
        self.dataForm.tmList[index].sunday = "0"
        self.isIndeterminate_week = false;
        self.dataForm.tmList[index].flagWeekendArr.pop()

      }
      self.dataForm.tmList[index].isIndeterminate_weekend = false;

    },
    //删除时间
    deleFun (item, index) {
      var flag = this.dataForm.tmList.indexOf(item);
      if (index == 0) {
        this.$message({
          message: "必须保留一个时间段",
          type: "warning"
        });
        return;
      } else {
        if (flag > -1) {
          this.dataForm.tmList.splice(flag, 1);
        }
      }
    },
    //增加时间
    addTimearea () {
      let self = this;

      if (this.dataForm.tmList.length > 4) {
        this.$message({
          message: "时间段不能超过5个",
          type: "warning"
        });
        return;
      } else {
        this.dataForm.tmList.push({
          id: 1,
          uid: "",
          tenantId: "",
          programUid: "",
          startTm: '2019/1/1 00:00:00',
          endTm: '2019/1/1 23:59:00',
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
          flagWeekendArr: [],
        });
      }
    },
  }
}
</script>

<style lang='scss' scoped>
.extra-price-list {
  .flex-wrapper {
    display: -ms-flexbox;
    display: -moz-box;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
  }
  .c-p {
    cursor: pointer;
  }
  .time-interval {
    margin-top: 16px;
  }
  .time-interval:first-child {
    margin-top: 0px;
  }
  .b-g-h {
    background-color: #f5f5f5;
  }
  .a-i-c {
    align-items: center;
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