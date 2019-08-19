<template>
  <div class="member-dialogVisible" v-show="dialogVisible">
    <div class="shadow"></div>
    <div class="bottom">
      <div class="header">
        {{name}}
      </div>
      <div class="contetn">

        <slot></slot>
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
      default: "弹窗"
    }
  },
  created() {},
  methods: {
    closeWarp() {
      this.$emit("update:dialogVisible", false);
    }
  },
  watch: {
    dialogVisible(val) {
      this.$emit("toggleDialog", val);
    }
  }
};
</script>
<style lang="scss" scope>
.member-dialogVisible {
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
    bottom: 0;
    width: 100%;
    color: #ffffff;
    .header {
      width: 100%;
      height: 6.3%;
      border-radius: 5px 5px 0 0;
      font-size: $font-size16;
      text-indent: 2.9vw;
      line-height: 6.3vh;
      background: #3559af;
    }
    .contetn {
      width: 100%;
      background: #ffffff;
      padding-bottom: 2.6vh;
      padding-top: 2.6vh;
    }
    .iconBox {
      position: absolute;
      right: 2vw;
      top: 1vh;
      .el-icon-close {
        cursor: pointer;
        color: #ffffff;
        font-size: 2.2vw;
      }
    }
  }
}
</style>


