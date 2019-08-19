<template>
  <div class="choose-window">
    <el-form :model="formData" :rules="formRule" class="common-form">
      <!-- 操作符选择框 -->
      <template v-if="data.withSelect == 'select'">
        <el-select
          class="input-type-166"
          v-model="data.selectData.selectedValue"
          :placeholder="data.selectData.placeholder ? data.selectData.placeholder : '请选择'"
        >
          <el-option
            v-for="item in data.selectData.selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </template>

      <!-- 纯输入框 -->
      <template v-if="data.withInput == 'true'">
        <el-row class="flex-base">
          <el-input
            class="input-type-166"
            :readonly="data.inputData.readonly"
            v-model="data.inputData.inputValue"
            :placeholder="data.inputData.placeholider"
          ></el-input>
        </el-row>
      </template>

      <!-- 从弹窗获取值 -->
      <template v-if="data.withAlertWindow == 'true'">
        <el-row class="flex-base">
          <el-input
            class="input-type-166"
            clearable
            readonly
            v-model="data.alertWindowData.backValueText"
            :placeholder="请选择"
          ></el-input>
          <el-button
            class="callWindowBtn"
            type="primary"
            plain
            @click="callWindow(data.alertWindowData,modelName)"
          >{{data.alertWindowData.alertButtonText ? data.alertWindowData.alertButtonText : '选择'}}</el-button>
        </el-row>
      </template>

      <!-- 第二个选择框 -->
      <template v-if="data.withSelect == 'doubelSelect'">
        <el-select
          class="input-type-166"
          v-model="data.doubelSelectData.selectedValue"
          :placeholder="data.doubelSelectData.placeholder ? data.doubelSelectData.placeholder : '请选择'"
        >
          <el-option
            v-for="item in data.doubelSelectData.selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </template>

      <template v-if="data.withDate">
        <el-date-picker
          v-model="data.dateValue"
          :type="data.withDate ? data.withDate : 'daterange'"
          :placeholder="'选择日期'"
          :range-separator="'至'"
          :start-placeholder="'请选择开始日期'"
          :end-placeholder="'请选择结束日期'"
        ></el-date-picker>
      </template>
    </el-form>

    <!-- 弹窗 -->
    <section v-if="isShowAlert">
      <alertWindow :config="alertConfig" @alertCallBack="changeInputValue"></alertWindow>
    </section>
  </div>
</template>

<script>
import alertWindow from "../alertWindow/index.vue";

export default {
  components: {
    alertWindow
  },
  props: {
    modelName: {
      required: true,
      type: String
    },
    data: {
      required: true,
      type: Object
    }
  },
  data() {
    return {
      formData: {},
      formRule: {},

      /* 弹窗 */
      isShowAlert: false,
      alertConfig: {
        src: "",
        param: {},
        callFnName: ""
      },
      /* 唤起弹窗后,需填入输入框的值 */
      currentInputText: "",

      /* 此处监听数据变化 */
      watchDataChange: null
    };
  },
  created() {
    this.formData = JSON.parse(JSON.stringify(this.data));

    //实时将数据变化返回
    this.watchDataChange = this.$watch(
      "baseConfig.form",
      (new_val, old_val) => {
        this.$emit("searchValueChange", new_val);
      },
      {
        deep: true
      }
    );

    this.baseConfig = {
      form,
      system
    };
    this.isShowForm = true;
    this.alertConfig.callFnName = "changeInputValue_" + this.modelName;
  },
  methods: {
    /**
     * @function callWindow - 唤起弹窗
     * @param {Boolean} isNeedReturn - 是否需要回传参数给弹窗
     */
    callWindow(alertWindowData, modelName) {
      this.currentInputText = modelName;

      let param = {};
      if (alertWindowData.isNeedReturn) {
        param[`data`] = alertWindowData.backValueText;
      }
      this.alertConfig.src = alertWindowData.alertSrc;
      this.alertConfig.param = param;
      this.isShowAlert = true;
    },
    /**
     * @function changeInputValue - 弹窗回调 修改对应输入框
     */
    changeInputValue(param) {
      let isCancle = param.isCancle;
      if (isCancle) {
        this.currentInputText = "";
        this.isShowAlert = false;
        this.alertConfig.src = "";
        this.alertConfig.param = {};
        return;
      }

      let currentInputText = this.currentInputText;
      this.baseConfig.form[`${currentInputText}`] = param.data;
      this.isShowAlert = false;
      this.alertConfig.src = "";
      this.alertConfig.param = {};
      this.currentInputText = "";
    },
    /**
     * @function emitSearch - 回传事件给父层
     */
    emitSearch() {
      let param = this.baseConfig.form;
      this.$emit("pressSearch", param);
    },
    /**
     * @function changeSearchType - 修改查询规则 高级/低级
     */
    changeSearchType() {
      this.isShowHightLevel = !this.isShowHightLevel;
    },
    /**
     * @function isShowLevelItem - 是否显示高级输入栏
     */
    isShowLevelItem(item) {
      let isShow = true;
      let isShowHightLevel = this.isShowHightLevel;
      if (item.level && !isShowHightLevel) {
        isShow = false;
      }
      return isShow;
    }
  },
  destroyed() {
    this.watchDataChange();
  }
};
</script>

<style lang="scss" scoped>
// .flex-base {
//     display: flex;
//     display: -webkit-flex;
//     align-content: center;
//     justify-content: flex-start;
// }

// .search-window {
//     background: #F5F5F5;

//     .el-form {
//         padding: 24px;
//         justify-content: space-between;

//         .el-form-item {
//             margin-bottom: 8px;
//         }

//         .btn-group {
//             margin-bottom: unset;
//             margin-top: 5px;
//         }
//     }

//     .callWindowBtn {
//         margin-left: 5px;
//         margin-top: 1px;
//     }

// }

/* 范围输入框 */
// .input-more {
//     .input-row {
//         .line {
//             margin: 0 3px;
//         }

//     }

//     .el-form-item {
//         margin-right: unset;
//     }

//     .el-form-item:nth-last-of-type(1) {
//         margin-right: 10px;

//         .line {
//             display: none;
//         }
//     }

// }

// /* 设计规范 输入框 选择框宽度 */
// @each $i in 360,
// 217,
// 166,
// 124,
// 94 {
//     .input-type-#{$i} {
//         width: #{$i}px;
//     }
// }
</style>
