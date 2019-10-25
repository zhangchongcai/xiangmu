<template>
  <div class="section">
    <div class="section-title">
      <i class="el-icon-arrow-up icon"></i>指标概览
      <div class="reset-radios-group right">
        <el-radio-group v-model="ratioType" v-if="showRatio">
          <el-radio :label="1" :disabled="hiddenRound">环比</el-radio>
          <el-radio :label="2" :disabled="hiddenSame">同比</el-radio>
        </el-radio-group>
        <el-button size="mini" style="margin-left:20px" @click="showTargetSetting">指标设置</el-button>
      </div>
    </div>
    <div class="section-content" v-if="selectedTarget">
      <div class="target-flex">
        <div class="target-block" v-for="(item,index) in selectedTarget" :key="index">
          <div class="target-title">{{item.indicatorName}}</div>
          <div class="money">
            <i class="iconfont" :class="icons[item.indicatorCode].icon" :style="{color:iconColors[index]}"></i>
            <span class="money-num">{{item.value |formatMoney(item.indicatorCode)}}</span>
            <span class="unit">{{item.indicatorCode |formatTargetUnit(item.value*1)}}</span>
          </div>
          <template v-if="showRatio">
            <div class="ratio" v-if="ratioType == 1">
              环比
              <span class="ratio-num" :class="item.roundPeriodValue*1 > 0 ? 'text-green':'text-red'">
                <i class="iconfont" :class="[item.roundPeriodValue > 0?'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']">
                </i>
                {{item.roundPeriodValue == '-9999'?'--':item.roundPeriodValue*1 >0?(item.roundPeriodValue*1).toFixed(2):(item.roundPeriodValue*(-1)).toFixed(2)}}%
              </span>
            </div>
            <div class="ratio" v-if="ratioType == 2">
              同比
              <span class="ratio-num" :class="item.samePeriodValue*1 >0?'text-green':'text-red'">
                <i class="iconfont" :class="[item.samePeriodValue > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></i>
                {{item.samePeriodValue == '-9999'?'--':item.samePeriodValue*1 >0 ?(item.samePeriodValue*1).toFixed(2):(item.samePeriodValue*(-1)).toFixed(2)}}%
              </span>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Global from '../../../util/global.js';
export default {
  props: {
    showRatio: {
      type: Boolean
    },
    hiddenRound: {},
    hiddenSame: {},
    type: {},
    selectedTarget: {
      type: Array
    }
  },
  data () {
    return {
      ratioType: this.type,
      iconColors: Global.iconColors,
      icons: Global.memberIcon
    };
  },
  watch: {
    type () {
      this.ratioType = this.type;
    }
  },
  filters: {
    formatMoney (money, code) {
      // let codeArr = ['xzhy','yxhy','ljhy','kzhyh',
      // 'xinkhy','xukhy','bkhy','czhy','ydqhy30','ydqhy7'];
      let codeArr = Global.targetNum;
      if (codeArr.includes(code)) {
        return Global.formatMoney(money, 0);
      } else {
        return Global.formatMoney(money);
      }
    },
    formatTargetUnit: (type, money) => {
      return Global.formatMemberTargetUnit(type, money);
    }
  },
  methods: {
    showTargetSetting () {
      this.$emit('showTargetSetting');
    }
  }
};
</script>