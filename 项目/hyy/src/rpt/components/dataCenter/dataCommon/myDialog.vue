<template>
  <div>
    <div class="my-dialog-mask" v-if="visibility" ref="mask" @click="handleMaskClick"></div>
    <div
      ref="myDialog"
      class="my-dialog"
      :style="{
      width: width,
      height: height
    }"
      v-if="visibility"
    >
      <div class="dialog-header" :style="{marginBottom: `${marginBottom}px`}">
        <div class="title">{{ this.title }}</div>
        <div class="close-icon">
          <i :class="`iconfont ${iconClassName}`" @click="handleCloseClick"></i>
        </div>
      </div>
      <hr class="top-hr" v-if="marginBottom === 0">
      <div
        class="dialog-content"
        :style="{height: contentHeight, marginBottom: `${marginBottom}px`}"
      >
        <slot name="dialog-content"></slot>
      </div>
      <hr class="bottom-hr" v-if="marginBottom === 0">
      <div class="dialog-button">
        <button class="comfirm-button" @click="handleBtnComfirmClick">确定</button>
        <button class="cancel-button" @click="handleBtnCancelClick">取消</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dialogWidth: {
      type: Number
    },
    dialogHeight: {
      type: Number
    },
    isShow: {
      type: Boolean
    },
    title: {
      type: String,
      default: "标题"
    },
    iconClassName: {
      type: String,
      default: "icon-neiye-danchuangquxiao"
    },
    dialogContentHeight: {
      type: Number
    },
    marginBottom: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      visibility: false
    };
  },
  computed: {
    width() {
      return typeof this.dialogWidth === "number"
        ? `${this.dialogWidth}px`
        : "auto";
    },
    height() {
      return typeof this.dialogHeight === "number"
        ? `${this.dialogHeight}px`
        : "auto";
    },
    contentHeight() {
      return typeof this.dialogContentHeight === "number"
        ? `${this.dialogContentHeight}px`
        : "auto";
    }
  },
  methods: {
    handleBtnComfirmClick() {
      this.$emit("handleBtnComfirmClick");
      this.$emit("close");
      this.visibility = false;
    },
    handleBtnCancelClick() {
      this.$emit("handleBtnCancelClick");
      this.$emit("close");
      this.visibility = false;
    },
    handleCloseClick() {
      this.$emit("handleCloseClick");
      this.$emit("close");
      this.visibility = false;
    },
    handleMaskClick() {
      this.visibility = false;
      this.$emit("close");
    }
  },
  watch: {
    isShow(newVal, oldVal) {
      this.visibility = newVal;
    }
  }
};
</script>

<style lang="scss" scoped>
$titleFontSize: 14px;
$titleColor: #333333;
$closeIconColor: #979797;
$contentFontSize: 12px;
$fontFamily: "MicrosoftYaHe";
$buttonWidth: 80px;
$buttunHeight: 32px;

@keyframes maskFadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.6;
  }
}
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.my-dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  opacity: 0.6;
  z-index: 499;
  animation: maskFadeIn ease 0.3s;
}
.my-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 16px 16px 12px 16px;
  font-size: $contentFontSize;
  background: #ffffff;
  box-shadow: 0 1px 4px 0 rgba(102, 102, 102, 0.25);
  border-radius: 4px;
  z-index: 500;
  // box-sizing: border-box;
  animation: fadeIn ease 0.3s;
  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    .title {
      font-family: $fontFamily;
      font-size: $titleFontSize;
      color: $titleColor;
    }
    .close-icon {
      color: $closeIconColor;
      i {
        font-size: $titleFontSize;
      }
    }
    .close-icon:hover {
      cursor: pointer;
      color: #0f55ff;
    }
  }
  hr {
    background-color: #e5e5e5;
    height: 1px;
    border: none;
  }
  .dialog-content {
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .bottom-hr {
    position: absolute;
    bottom: 56px;
    left: 0;
    width: 100%;
  }
  .dialog-button {
    position: absolute;
    bottom: 16px;
    left: 50%;
    margin-left: -96px;
    display: flex;
    justify-content: center;
    margin-top: 12px;
    button {
      margin-right: 32px;
      width: $buttonWidth;
      height: $buttunHeight;
      font-size: $contentFontSize;
      border: none;
      border-radius: 4px;
    }
    .comfirm-button {
      background: #3b74ff;
      color: white;
    }
    .comfirm-button:hover {
      background: #0f55ff;
      cursor: pointer;
    }
    .cancel-button {
      color: #666666;
      background: #ffffff;
      border: 1px solid #bcbcbc;
      border-radius: 4px;
    }
    .cancel-button:hover {
      background: #f5f5f5;
      cursor: pointer;
    }
  }
}
</style>


