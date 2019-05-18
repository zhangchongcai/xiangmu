<template>
  <div class="_member-dialogVisible" v-show="dialogVisible">
    <div class="shadow"></div>
    <div class="bottom">
      <div class="header">
        {{name?name:'默认标题'}}
      </div>
      <div class="contetn">
        <slot></slot>
      </div>
      <div class="btnwarp">
        <el-button type="primary" @click="closeAndOk">确定</el-button>
        <el-button @click="closeWarp">取消</el-button>
      </div>
      <div class="iconBox">
        <i class="el-icon-close" @click="closeWarp"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ""
    }
  },
  created() {},
  methods: {
    closeWarp() {
      this.$emit("update:dialogVisible", false);
      this.$emit('crmDialogOutputFlag',0)
    },
    closeAndOk(){
      this.$emit("update:dialogVisible", false);
      this.$emit('crmDialogOutputFlag',1)
    },
    closeAndReset(){
      this.$emit('crmDialogOutputFlag','reset')
    }
  },
  watch: {
   
  }
};
</script>
<style lang="scss" scope>
._member-dialogVisible {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.5;
    background: #000;
  }
  .bottom {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 700px;
    background: #ffffff;
    box-shadow: rgba(0, 0, 0, 0.1);
    border-radius: 5px 5px 5px 5px;
    padding: 0 20px;
    padding-bottom: 20px;
    .header {
      width: 100%;
      height: 40px;
      border-radius: 5px 5px 0 0;
      font-size: 16px;
      line-height: 40px;
    }
    .contetn {
      width: 100%;
      background: #ffffff;
      padding-bottom: 20px;
    }
    .btnwarp {
      text-align: center;
    }
    .iconBox {
      position: absolute;
      right: 2vw;
      top: 1vh;
      .el-icon-close {
        cursor: pointer;
        color: #999;
        font-size: 20px;
      }
    }
  }
}
</style>


