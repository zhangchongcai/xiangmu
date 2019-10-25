<template>
  <div class="reset-target-dialog">
    <el-dialog :visible="show" title="影院kpi编辑" :before-close="handleClose" :close-on-click-modal="false">
      <div class="content" style="max-height:500px" v-if="infoData && infoData.cinemaCode">
        <el-form ref="updateKpi" class="reset-form" label-width="140px" label-position="right" :model="infoData" :rules="ruleForm">
          <el-form-item label="影院名称:" class="reset-form-input">
            <el-input size="small" v-model="infoData.cinemaName" disabled></el-input>
          </el-form-item>
          <el-form-item label="专资编码:" class="reset-form-input">
            <el-input size="small" v-model="infoData.cinemaCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="时间选择:" class="reset-form-select">
            <el-date-picker disabled size="small" v-model="infoData.dateKey" type="month" placeholder="选择月" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="票房收入目标:" class="reset-form-input" prop="boxOfficeTarget">
            <el-input size="small" type="number" v-model="infoData.boxOfficeTarget" :min="0"></el-input>
            <span class="tip">&nbsp;元</span>
          </el-form-item>
          <el-form-item size="samll" label="卖品收入目标:" class="reset-form-input" prop="sellGoodsTarget">
            <el-input type="number" v-model="infoData.sellGoodsTarget" :min="0"></el-input>
            <span class="tip">&nbsp;元</span>
          </el-form-item>
          <el-form-item label="观影人次目标:" class="reset-form-input" prop="audienceCountTarget">
            <el-input size="small" type="number" v-model="infoData.audienceCountTarget" :min="0"></el-input>
            <span class="tip">&nbsp;次</span>
          </el-form-item>
          <el-form-item label="新增会员目标:" class="reset-form-input" prop="addMemberCount">
            <el-input size="small" type="number" v-model="infoData.addMemberCount" :min="0"></el-input>
            <span class="tip">&nbsp;元</span>
          </el-form-item>
          <el-form-item label="会员消费金额目标:" class="reset-form-input" prop="memberConsumeTarget">
            <el-input size="small" type="number" v-model.number="infoData.memberConsumeTarget" :min="0"></el-input>
            <span class="tip">&nbsp;元</span>
          </el-form-item>
          <el-form-item label="票房市场份额目标:" class="reset-form-input" prop="marketShare">
            <el-input size="small" type="number" v-model.number="infoData.marketShare" :min="0" :max="1"></el-input>
            <span class="tip">&nbsp;%</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="footer">
        <el-button type="primary" size="mini" @click="sure">确认</el-button>
        <el-button size="mini" @click="handleClose"> 取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    var validateNum = (rule, value, callback) => {
      if (!value) {
        callback(new Error('目标值不能为空'));
      }
      if (!Number.isInteger(value * 1)) {
        callback(new Error('请输入数字值'));
      } else {
        if (value * 1 < 0) {
          callback(new Error('目标值不能为负值'));
        } else if (value * 1 > 9999999999) {
          callback(new Error('目标值不能超过9999999999'));
        } else {
          callback();
        }
      }
    };
    var validateMark = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('份额目标值不能为空'));
      } else if (value * 1 < 0) {
        callback(new Error('份额目标值不能为负值'));
      } else if (value * 1 > 100) {
        callback(new Error('份额目标值不能超过100'));
      } else {
        callback();
      }
    };
    return {
      show: false,
      infoData: null,
      ruleForm: {
        boxOfficeTarget: [{
          required: true,
          validator: validateNum
        }],
        sellGoodsTarget: [{
          required: true,
          validator: validateNum
        }],
        audienceCountTarget: [{
          required: true,
          validator: validateNum
        }],
        addMemberCount: [{
          required: true,
          validator: validateNum
        }],
        memberConsumeTarget: [{
          required: true,
          validator: validateNum
        }],
        marketShare: [{
          required: true,
          validator: validateMark
        }]
      }
    };
  },
  methods: {
    sure () {
      this.$refs.updateKpi.validate(valid => {
        if (valid) {
          this.$emit('updateKpi', this.infoData);
        }
      });
    },
    handleClose () {
      this.show = false;
    }
  }
};
</script>



