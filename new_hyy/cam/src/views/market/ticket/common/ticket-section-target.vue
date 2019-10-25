<template>
  <!-- 指标设置 -->
  <div class="section">
    <div class="section-title">
      <i class="el-icon-arrow-up icon"></i>
      指标概览
      <div class="reset-radios-group right">
        <el-button size="mini" @click="showTargetSetting">指标设置</el-button>
      </div>
    </div>
    <div class="section-content">
      <div class="target-flex" v-if="targetArr && targetArr.length>0">
        <div class="target-block" v-for="(item,index) in targetArr" :key="index">
          <div class="target-title">{{item.indicatorName}}</div>
          <div class="money" v-if="item.indicatorName">
            <i class="iconfont" :class="icons[item.indicatorCode].icon" :style="{color:iconColors[index]}">
            </i>
            <span class="money-num">{{item.value| formatMoney(item.indicatorCode)}}</span>
            <span class="unit">{{item.indicatorCode |formatTargetUnit(item.value*1)}}</span>
          </div>
          <!-- 日期是天，显示环比，自定义时间：隐藏环比 -->
          <div class="ratio" v-if="timeType == 'day' && item.indicatorCode !='yspqcb' && item.indicatorCode !='ffsl'">
            环比
            <span class="ratio-num" :class="item.roundPeriodValue*1 > 0 ? 'text-green':'text-red' ">
              <i class="iconfont" :class="[item.roundPeriodValue > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></i>
              {{item.roundPeriodValue == '-9999'?'--':(item.roundPeriodValue*1 >0?item.roundPeriodValue*1:item.roundPeriodValue*(-1))}}%
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Global from '../../../../util/global.js';
export default {
  props: {
    targetArr: {
      type: Array
    },
    timeType: {
      type: String
    }
  },
  filters: {
    formatMoney (num, indicatorCode) {
      let money = Number(num);
      if (Global.targetNum.includes(indicatorCode)) {
        return Global.formatMoney(money, 0);
      } else {
        return Global.formatMoney(money);
      }
    },
    formatTargetUnit: (type, money) => {
      return Global.formatTicketUnit(type, money);
    }
  },
  data () {
    return {
      icons: Global.ticketIcon,
      iconColors: Global.iconColors
    };
  },
  methods: {
    showTargetSetting () {
      this.$emit('showTargetSetting');
    }
  }
};
</script>

