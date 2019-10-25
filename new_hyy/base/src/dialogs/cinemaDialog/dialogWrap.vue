<template>
  <div class="_frame-dialogVisible" v-show="dialogVisible">
    <div class="shadow"></div>
    <div class="bottom-warp">
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

  </div>
</template>
<script>
export default {
  data () {
    return {};
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    }
  },
  created () { },
  methods: {
    closeWarp () {
      // this.$emit("update:dialogVisible", false);
      this.$emit('crmDialogOutputFlag', 0);
    },
    closeAndOk () {
      // this.$emit("update:dialogVisible", false);
      this.$emit('crmDialogOutputFlag', 1);
    },
    closeAndReset () {
      this.$emit('crmDialogOutputFlag', 'reset');
    }
  },
  watch: {}
};
</script>
<style lang="scss" scope>
._frame-dialogVisible {
  position: fixed;
  top: 0;
  left: 0;
  min-height: 100vh;
  min-width: 100vw;
  z-index: 2000;
  overflow: auto;
  .bottom-warp {
    position: absolute;
    width: 100%;
    overflow: hidden;
    z-index: 2000;
    .bottom {
      position: relative;
      margin: 0 auto;
      margin-top: 15vh;
      margin-bottom: 15vh;
      z-index: 2000;
      width: 892px;
      background: #ffffff;
      box-shadow: rgba(0, 0, 0, 0.1);
      border-radius: 2px;
      padding: 10px 20px 20px;
      .header {
        width: 100%;
        height: 40px;
        border-radius: 2px;
        font-size: 16px;
        line-height: 40px;
        font-size: 14px;
        border-bottom: 1px solid #f5f5f5;
        margin-bottom: 8px;
      }
      .contetn {
        width: 100%;
        background: #ffffff;
        margin: 10px 0 20px;
      }
      .btnwarp {
        text-align: center;
      }
      .iconBox {
        position: absolute;
        right: 20px;
        top: 20px;
        .el-icon-close {
          cursor: pointer;
          color: #999;
          font-size: 18px;
        }
      }
    }
  }
  .shadow {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.5;
    background: #000;
    z-index: 2000;
  }
  .el-pagination__editor.is-in-pagination {
    .el-input__inner {
      width: 42px;
    }
  }
  .el-pagination__sizes {
    .el-select {
      .el-input__inner {
        width: 102px;
      }
    }
  }
}
</style>