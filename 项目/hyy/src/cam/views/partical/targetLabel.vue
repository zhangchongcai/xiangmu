<template>
  <div class="auto-radio-button-wrap">
    <div
      class="auto-radio-button"
      :class="{active:targetType == item.id?true:false}"
      v-for="(item,index) in targetLabel"
      :key="index"
      @click="changeRadio(item.id)"
    >{{item.name}}</div>
    <div class="reset-select" :class="{selectActive:otherType?true:false}" v-show="otherLabel.length != 0">
      <el-select v-model="otherType" placeholder="其他" @change="changeSelect" clearable @clear="clearHandle">
        <el-option v-for="item in otherLabel" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    activeType:{},
    type:{},
    targetLabel:{
      type:Array,
      default:()=>{
        return [{name:'指标1',id:1}]
      }
    },
    otherLabel:{
      type:Array,
      default:()=>{
        return [{name:'其他',id:1}]
      }
    }
  },
  data() {
    return {
      targetType: this.activeType,
      otherType: null,
    };
  },
  watch:{
    activeType(){
        this.targetType = this.activeType;
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
      this.otherType && this.$emit("getType", this.otherType);
    },
    resetSelect() {
      this.targetType = this.targetLabel[0].id;
      this.otherType = null;
      this.$emit("getType", this.targetType);
    },
    clearHandle() {
      this.resetSelect()
    }
  }
};
</script>
<style lang="scss" scoped>
.auto-radio-button-wrap {
  border-top: 1px solid #3b74ff;
  border-bottom: 1px solid #3b74ff;
  border-radius: 4px;
  display: inline-block;
  .auto-radio-button {
        cursor: pointer;
        display: inline-block;
        vertical-align: middle;
        min-width: 80px;
        height: 32px;
        padding:0 6px;
        box-sizing: border-box;
        line-height: 32px;
        text-align: center;
        border-left:1px solid #3b74ff;
        color: #3b74ff;
        font-size: 12px;
        &:first-of-type{
            border-top-left-radius: 4px;
            border-bottom-left-radius:4px;
        }
  }
  .reset-select{
        width: 120px; 
        height: 32px;
        display: inline-block;
        vertical-align: middle;
        box-sizing: border-box;
        border-right:1px solid #3b74ff;
        .el-select{
            border-left:1px solid #3b74ff;
            left:-6px;
            .el-input__inner {
                height: 32px;
                line-height: 32px;
                font-size:12px;
                border:none;
                // border-left:1px solid #3b74ff;
                text-align:center;
                border-radius: 0 0 0 0;
            }
            input::-webkit-input-placeholder{ 
                /* WebKit browsers */ 
                color: #3b74ff; 
            }
            input::-moz-placeholder{
                /* Mozilla Firefox 19+ */
                color: #3b74ff; 
            } 
            input::-ms-input-placeholder{
                /* Internet Explorer 10+ */ 
                color: #3b74ff; 
            }
    
        }
  }
  .reset-select.selectActive{
        background:#3b74ff;
        .el-select{
          .el-input__inner {
              background:#3b74ff;
              color:#fff
            }
        }
    }
    .active {
        color: #fff;
        background: #3b74ff;
    }
}
</style>