<template>
  <div>
    <div class="datacenter-query" v-if="ISshow">
      <ul class="datacenter-query-ul">
        <template v-for="item in baseQueryArr">
          <li v-if="item.controlType == 'TREE_SING'">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <el-select v-model="value2" placeholder="请选择" @focus="getSelectValue">
                <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value">
                </el-option>
              </el-select>
            </div>
          </li>
          <li v-if="item.controlType == 'SELECT'">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <el-select v-model="value2" placeholder="请选择" @focus="getSelectValue">
                <el-option v-for="option in options" :key="option.value" :label="option.label" :value="option.value">
                </el-option>
              </el-select>
            </div>
          </li>
          <li v-if="item.controlType == 'DATE'">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <rangedate-timeselet @input="dsad"></rangedate-timeselet>
          </li>
          <li class="more" v-else>
            <el-checkbox v-model="paydetails" name="paydetails1">展示支付明细</el-checkbox>
            <el-button type="primary DC-query-btn" @click="query">查询</el-button>
            <span class="DC666">高级筛选<i class="el-icon-arrow-down DC-icon-left" @click="conditionShow"></i></span>
          </li>
        </template>
      </ul>
    </div>
    <div class="datacenter-query" v-else>
      <ul class="datacenter-query-ul">
        <template v-for="item in baseQueryArr">
          <li v-if="item.controlType == 'SELECT'">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <el-select v-model="value" placeholder="请选择">
                <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </li>
          <li v-if="item.controlType == 'DATE'">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <rangedate-timeselet></rangedate-timeselet>
          </li>
          <li class="more" v-else>
            <span class="DC666">收起<i class="el-icon-arrow-up DC-icon-left" @click="conditionDide"></i></span>
          </li>
        </template>
      </ul>
      <ul class="datacenter-query-ul datacenter-query-ul--active">
        <template v-for="item in yesQueryArr">
          <li v-if="item.controlType == 'TREE_SING'">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <div class="small-ii DC-input208">
              <el-select v-model="value" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </li>
          <li v-if="item.controlType == 'DATE'">
            <span class="small-ii DC666 DC-margin-left32">{{ item.queryName + "：" }}</span>
            <rangedate-timeselet></rangedate-timeselet>
          </li>
        </template>
      </ul>
      <ul class="datacenter-query-ul">
        <li class="more">
          <el-checkbox v-model="checked">展示支付明细</el-checkbox>
          <el-button type="primary plain DC-query-btn-acitve">查询</el-button>
          <el-button type="el-button--acitve" @click="setCommonBtn">设置常用条件</el-button>
        </li>
      </ul>
    </div>
    <el-dialog title="选择通用条件" :visible.sync="commonConditions" width="610" :before-close="handleClose">
      <div class="common-box">
        <ul class="common-box-query">
          <draggable v-model="nownoQueryArr" :options="{group:'people'}">
            <li class="commonbox-query-coment" v-for="element in nownoQueryArr">{{ element.queryName }}</li>
          </draggable>
        </ul>
        <div class="commonbox-query-tips">拖动排序筛选顺序</div>
        <ul class="common-box-query">
          <draggable v-model="nowyesQueryArr" :options="{group:'people'}">
            <li class="commonbox-query-coment" v-for="element in nowyesQueryArr">{{ element.queryName }}</li>
          </draggable>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDeBtn">取 消</el-button>
        <el-button type="primary new-style-btn" @click="setQdBtn">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 		{{ this.nowyesQueryArr }}
		<br/>
		{{ this.nownoQueryArr }} -->
  </div>
</template>

<script type="text/javascript">
import draggable from 'vuedraggable';
import rangedateTimeselet from './dataCommon/rangeDateTimeSelet.vue';
export default {
  props: {
    // 基础查询
    baseQueryArr: Array,
    // 扩展查询
    extQueryArr: Array,
    adQueryArr: Array
  },
  data () {
    return {
      commonConditions: false,
      ISshow: true,
      yesQueryArr: this.extQueryArr,
      noQueryArr: this.adQueryArr,
      nowyesQueryArr: [],
      nownoQueryArr: []

    };
  },
  methods: {
    conditionShow: function () {
      this.ISshow = false;
    },
    conditionDide: function () {
      this.ISshow = true;
    },
    setQdBtn: function () {
      this.yesQueryArr = this.nowyesQueryArr;
      this.noQueryArr = this.noQueryArr;
      this.commonConditions = false;
    },
    setDeBtn: function () {
      this.commonConditions = false;
    },
    setCommonBtn: function () {
      this.nowyesQueryArr = this.yesQueryArr;
      this.noQueryArr = this.noQueryArr;
      this.commonConditions = true;
    },
    getSelectValue: function () {
      // 点击触发
      axios.get('/api/index.json')
        .then(this.getDatacenterSucc);
    },
    getDatacenterSucc (res) {
      console.log(res);
      const data = res.data.reportTableInfo;
      this.Jdata = data.options2;
    }

  },
  components: {
    rangedateTimeselet,
    draggable
  },
  watch: {
    extQueryArr: function (newVal, oldVal) {
      this.yesQueryArr = newVal;
    }
  }
};
</script>
<style Scoped>
.datacenter-query {
  padding-right: 24px;
  padding-top: 24px;
  padding-bottom: 24px;
  background: #f5f5f5;
  overflow: hidden;
}
.el-input__inner {
  height: 32px;
  line-height: 32px;
}
.el-input__icon {
  height: 32px;
  line-height: 32px;
}
.el-date-editor .el-range-separator {
  line-height: 22px;
}
.el-button {
  font-size: 12px;

  padding: 8px 11px;
}
.el-button--acitve {
}
.el-button span {
  font-size: 12px;
}
.datacenter-query-ul {
  overflow: hidden;
  padding-bottom: 1px;
}
.datacenter-query-ul li {
  height: 32px;
  line-height: 32px;
  float: left;
  margin-top: 8px;
}
.datacenter-query-ul li.more {
  height: 32px;
  line-height: 32px;
  float: right;
}
.DC-query-btn {
  margin: 0 16px;
  padding: 8px 35px;
}
.DC-query-btn-acitve {
  margin: 0 8px;
  padding: 8px 35px;
}
.el-button + .el-button {
  margin-left: 0px;
}
.DC-icon-left {
  margin-left: 8px;
}
.DC-margin-left32 {
  margin-left: 24px;
}
.DC-input208 {
  width: 208px;
}
.DC666 {
  color: #666666;
}
.more-query {
  display: block;
}
.datacenter-query-ul li .small-ii {
  float: left;
}
.el-date-editor .el-range-separator {
  color: #666666;
}
.el-icon-arrow-down,
.el-icon-arrow-up {
  cursor: pointer;
}

.common-box {
}
.common-box-query {
  overflow: hidden;
  padding: 16px 0;
  min-height: 20px;
}
.common-box-query div {
  width: 100%;
  min-height: 40px;
}
.commonbox-query-coment {
  float: left;
  padding-left: 12px;
  padding-right: 12px;
  height: 32px;
  line-height: 32px;
  text-align: center;
  background: #ffffff;
  box-sizing: border-box;
  border: 1px solid #bcbcbc;
  border-radius: 4px;
  margin-right: 8px;
  margin-bottom: 8px;
  cursor: pointer;
}
.el-dialog__body {
  padding: 0px 20px;
}
.el-dialog__title {
  font-size: 14px;
}
.el-dialog__header {
  padding-bottom: 0px;
}
.el-dialog__footer {
  text-align: center;
}
.el-button {
  padding: 9px 29px;
}
.commonbox-query-tips {
  color: #333333;
}
</style>