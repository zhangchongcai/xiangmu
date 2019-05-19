<template>
  <div class="auto-radio-button-wrap">
    <div
      class="auto-radio-button"
      :class="{active:targetType == item.id?true:false}"
      v-for="(item,index) in targetLabel"
      :key="index"
      @click="changeRadio(item.id)"
    >{{item.name}}</div>
    <div class="reset-select" :class="{selectActive:otherType?true:false}">
      <el-select v-model="otherType" placeholder="其他" @change="changeSelect" clearable>
        <el-option v-for="item in otherLabel" :key="item.value" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    type:String,
  },
  data() {
    return {
      targetType: 'xse',
      otherType: null,
      type: null,
      // 指标
      targetLabel: [
        {
          id: 'xse',
          name: "销售额"
        },
        {
          id: 'xsdl',
          name: "销售单量"
        },
        {
          id: 'xssl',
          name: "销售数量"
        },
        {
          id: 'kdj',
          name: "客单价"
        },
        {
          id: 'jdj',
          name: "件单价"
        },
        {
          id:'kdl',
          name: "客单量"
        }
      ]
    };
  },
  computed:{
     // 其他指标
    otherLabel(){
      // 品类/渠道没有套餐消费占比
      if(this.type == 'channel'){
        return [
      //     {
      //   id:'cbj',
      //   name: "成本价"
      // },
        {
          id: 'xsml',
          name: "销售毛利"
        },
        {
          id: 'xsmlr',
          name: "销售毛利率"
        },
        {
          id: 'xscb',
          name: "销售成本"
        },
        {
          id: 'gml',
          name: "购买率"
        },
        {
          id: 'rjmpje',
          name: "人均卖品金额"
        },
        {
          id: 'hyxfzb',
          name: "会员消费占比"
        }]
      }else{
        return [
      //     {
      //   id:'cbj',
      //   name: "成本价"
      // },
        {
          id: 'xsml',
          name: "销售毛利"
        },
        {
          id: 'xsmlr',
          name: "销售毛利率"
        },
        {
          id: 'xscb',
          name: "销售成本"
        },
        {
          id: 'gml',
          name: "购买率"
        },
        {
          id: 'rjmpje',
          name: "人均卖品金额"
        },
        {
          id: 'hyxfzb',
          name: "会员消费占比"
        }, {
          id: 'tcxfzb',
          name: "套餐消费占比"
        }]
      }
    }
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
  border:1px solid #3b74ff;
  width:600px;
  margin:0 auto;
  display: flex;
  .auto-radio-button {
    cursor: pointer;
    display: inline-block;
    width: 80px;
    height: 32px;
    box-sizing: border-box;
    line-height: 32px;
    text-align: center;
    border-right:1px solid #3b74ff;
    color: #3b74ff;
    font-size: 12px;
  }
  .reset-select{
    width: 120px; 
    .el-select{
      left:-5px;
    }
  }
  .reset-select.selectActive{
    background:#3b74ff
  }
  .active {
    color: #fff;
    background: #3b74ff;
  }
}
</style>