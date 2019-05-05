<template>
  <div class="auto-radio-button-wrap">
    <div
      class="auto-radio-button"
      :class="{active:targetType == item.id?true:false}"
      v-for="(item,index) in targetLabel"
      :key="index"
      @click="changeRadio(item.id)"
    >{{item.name}}</div>
    <div class="reset-select">
      <el-select v-model="otherType" placeholder="其他" @change="changeSelect" clearable>
        <el-option v-for="item in otherLabel" :key="item.value" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
export default {
  // fdfd
  data() {
    return {
      targetType: 1,
      otherType: null,
      type: null,
      // 指标
      targetLabel: [
        {
          id: 1,
          name: "销售额"
        },
        {
          id: 2,
          name: "销售单量"
        },
        {
          id: 3,
          name: "销售数量"
        },
        {
          id: 4,
          name: "客单价"
        },
        {
          id: 5,
          name: "件单价"
        },
        {
          id: 6,
          name: "客单量"
        }
      ],
      // 其他指标
      otherLabel: [
        {
          id: 7,
          name: "销售毛利"
        },
        {
          id: 8,
          name: "销售毛利润"
        },
        {
          id: 9,
          name: "销售成本"
        },
        {
          id: 10,
          name: "购买率"
        },
        {
          id: 11,
          name: "人均卖品金额"
        },
        {
          id: 12,
          name: "会员消费占比"
        }
       
      ]
    };
  },
  methods: {
    changeRadio(id) {
      this.targetType = id;
      this.otherType = null;
      this.$emit("getType", this.targetType);
    },
    changeSelect() {
      this.targetType = null;
      this.$emit("getType", this.otherType);
    }
  }
};
</script>
<style lang="scss" scoped>
.auto-radio-button-wrap {
  .reset-select {
    display: inline-block;
    width: 120px;
    height: 30px;
    .el-input__inner {
      height: 34px;
      line-height: 34px;
    }
  }
  .auto-radio-button {
    cursor: pointer;
    display: inline-block;
    width: 80px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-left: 1px solid #3b74ff;
    border-top: 1px solid #3b74ff;
    border-bottom: 1px solid #3b74ff;
    color: #3b74ff;
    font-size: 12px;
  }
  .auto-radio-button:first-of-type {
    border-radius: 4px 0px 0px 4px;
  }
  .auto-radio-button:nth-last-of-type(2) {
    border-right: 1px solid #3b74ff;
    border-radius: 0px 4px 4px 0px;
  }
  .active {
    color: #fff;
    background: #3b74ff;
  }
}
</style>