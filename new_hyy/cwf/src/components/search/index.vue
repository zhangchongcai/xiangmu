<template>
  <div class="search-window">
    <el-form v-if="isShowForm" :inline="true" :model="baseConfig.form">

      <template v-for="(item,index) in baseConfig.system">
        <el-form-item v-if="isShowLevelItem(item)" :key="index" :prop="item.keyName" :label="item.name" :rules="item.rules" style="flex:1">
          <!-- 单个输入框 - 是否带唤起弹窗按钮-->
          <template v-if="item.type == 'input'">
            <el-row class="flex-base">
              <el-input class="input-type-166" :clearable="item.clearable" :readonly="item.readonly" v-model="baseConfig.form[`${item.keyName}`]" :placeholder="item.placeholider"></el-input>
              <el-button class="callWindowBtn" type="primary" plain v-if="item.alertButton == true" @click="callWindow(item.alertSrc,item.keyName,item.isNeedReturn)">{{item.alertButtonText ? item.alertButtonText : '选择'}}</el-button>
            </el-row>
          </template>
          <!-- 范围输入框 -->
          <template v-if="item.type == 'input-more'">
            <el-row class="flex-base input-more">
              <template v-for="(jtem,index) in item.options">
                <el-form-item :key="index" :prop="jtem.prop" :label="jtem.name" :rules="jtem.rules">
                  <el-row class="flex-base input-row">
                    <el-input class="input-type-166" v-model="baseConfig.form[`${jtem.keyName}`]"></el-input>
                    <span class="line">-</span>
                  </el-row>
                </el-form-item>
              </template>
            </el-row>
          </template>
          <!-- 选择框 -->
          <template v-if="item.type == 'select'">
            <el-select class="input-type-166" v-model="baseConfig.form[`${item.keyName}`]" :placeholder="item.placeholder ? item.placeholder : '请选择'" :multiple="item.multiple" :multiple-limit="item.multipleLimit">
              <el-option v-for="item in item.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </template>
          <!-- 日期选择 -->
          <template v-if="item.type == 'date-picker'">
            <el-date-picker v-model="baseConfig.form[`${item.keyName}`]" :type="item.dateType ? item.dateType : 'daterange'" :placeholder="item.placeholder ? item.placeholder : '选择日期'" :range-separator="item.rangeSeparator ? item.rangeSeparator : '至'" :start-placeholder="item.startPlaceholder ? item.startPlaceholder : '请选择开始日期'" :end-placeholder="item.endPlaceholder ? item.endPlaceholder : '请选择结束日期'"></el-date-picker>
          </template>
        </el-form-item>
      </template>

      <el-form-item class="btn-group">
        <el-row class="flex-base" :class="{'isTicketManagement': modelName == 'salesManagement'}" style="margin:5px 0px;">
          <el-button type="primary" class="searchBtn" @click="emitSearch">查询</el-button>
          <el-button type="text" v-if="searchLevelButton" @click="changeSearchType">高级查询<i class="el-icon--right" :class="{'el-icon-arrow-down': !isShowHightLevel, 'el-icon-arrow-up': isShowHightLevel}"></i></el-button>
        </el-row>
      </el-form-item>
    </el-form>
    <!-- 弹窗 -->
    <section v-if="isShowAlert">
      <alertWindow :config="alertConfig" @alertCallBack="changeInputValue"></alertWindow>
    </section>
  </div>
</template>

<script>
import alertWindow from '../alertWindow/index.vue';
// import minxins from 'frame_cpm/mixins/cacheMixin.js'
const { cacheMixin } = requireModule('base');
export default {
  components: {
    alertWindow
  },
  mixins: [cacheMixin.cacheMixin],
  props: {
    config: {
      required: true,
      type: Array
    },
    modelName: {
      required: true,
      type: String
    },
    searchLevelButton: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    config: {
      deep: true,
      handler (val) {
        this.initData()
      }
    }
  },
  data () {
    return {
      /* 基本配置 */
      /* 缓存数据 */
      cacheField: ["baseConfig"],
      isShowForm: false,
      baseConfig: {
        form: {

        },
        system: [{
          name: '',
          keyName: '',
          type: '',
          value: '',
          placeholder: '',
          rules: []
        }]
      },
      /* 弹窗 */
      isShowAlert: false,
      alertConfig: {
        src: '',
        param: {},
        callFnName: ''
      },
      /* 唤起弹窗后,需填入输入框的名 */
      currentInputName: '',
      /* 是否显示高级检索内容 */
      isShowHightLevel: false,
      /* 此处监听数据变化 */
      watchDataChange: null
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      /* 根据输入config 构建form */
      let form = {};
      let system = JSON.parse(JSON.stringify(this.config));

      for (let i = 0; i < system.length; i++) {
        let item = system[i];
        let isMore = item.type == 'input-more' ? true : false;
        if (isMore) {
          let options = item.options;
          for (let j = 0; j < options.length; j++) {
            let jtem = options[j];
            if (!form[`${jtem.keyName}`]) {
              form[`${jtem.keyName}`] = jtem.value ? jtem.value : '';
            } else {
              return new Error('在传入config渲染搜索框时,请确保keyName的值为唯一');
            }
          }
        } else {
          if (!form[`${item.keyName}`]) {
            form[`${item.keyName}`] = item.value ? item.value : '';
          } else {
            return new Error('在传入config渲染搜索框时,请确保keyName的值为唯一');
          }
        }
      }

      // 实时将数据变化返回
      this.watchDataChange = this.$watch('baseConfig.form', (new_val, old_val) => {
        console.log("searchValueChange-new_val", new_val)
        console.log("searchValueChange-old_val", old_val)
        this.$emit('searchValueChange', new_val);
      }, {
          deep: true
        })

      this.baseConfig = {
        form,
        system
      }
      this.isShowForm = true;
      this.alertConfig.callFnName = 'changeInputValue_' + this.modelName;
    },
    /**
     * @function callWindow - 唤起弹窗
     * @param {Boolean} isNeedReturn - 是否需要回传参数给弹窗
     */
    //监听下拉事件
    change () {
      this.$forceUpdate()
    },
    callWindow (alertSrc, keyName, isNeedReturn) {
      this.currentInputName = keyName;

      let param = {}
      if (isNeedReturn) {
        param[`data`] = this.baseConfig.form[`${keyName}`];
      }
      this.alertConfig.src = alertSrc;
      this.alertConfig.param = param;
      this.isShowAlert = true;
    },
    /**
     * @function changeInputValue - 弹窗回调 修改对应输入框
     */
    changeInputValue (param) {
      let isCancle = param.isCancle;
      if (isCancle) {
        this.currentInputName = '';
        this.isShowAlert = false;
        this.alertConfig.src = '';
        this.alertConfig.param = {};
        return;
      }

      let currentInputName = this.currentInputName;
      this.baseConfig.form[`${currentInputName}`] = param.data;
      this.isShowAlert = false;
      this.alertConfig.src = '';
      this.alertConfig.param = {};
      this.currentInputName = '';
    },
    /**
     * @function emitSearch - 回传事件给父层
     */
    emitSearch () {
      let param = this.baseConfig.form;
      this.$emit('pressSearch', param)
    },
    /**
     * @function changeSearchType - 修改查询规则 高级/低级
     */
    changeSearchType () {
      this.isShowHightLevel = !this.isShowHightLevel;
    },
    /**
     * @function isShowLevelItem - 是否显示高级输入栏
     */
    isShowLevelItem (item) {
      let isShow = true;
      let isShowHightLevel = this.isShowHightLevel;
      if (item.level && !isShowHightLevel) {
        isShow = false;
      }
      return isShow;
    }
  },
  destroyed () {
    this.watchDataChange();
  }
}
</script>

<style lang="scss" scoped>
// .flex-base {
//     display: flex;
//     display: -webkit-flex;
//     align-content: center;
//     justify-content: center;
// }

/deep/.search-window {
  overflow: hidden;
  font-size: 12px;
  background: #f3f3f3;
  padding: 24px;
  .windowBtn {
    width: 80px;
    padding-left: 0;
    padding-right: 0;
    height: 32px;
    font-size: 12px;
    margin-left: 10px;
    position: relative;
    top: 1px;
  }
  .searchBtn {
    width: 80px;
    height: 32px;
    line-height: 32px;
    font-size: 12px;
    padding: 0;
    text-align: center;
  }
  .el-form-item {
    margin-right: 32px;
    margin-bottom: 0px;
  }
  .searchActivityName {
    .el-input {
      width: 264px;
    }
  }
  .validDate {
    .el-icon-date {
      position: absolute;
      top: 0;
      right: 9px;
    }
    .el-range-input {
      font-size: 12px;
    }
    .el-range-separator {
      width: 50px;
      font-size: 12px;
    }
    .el-form-item__label {
      padding-right: 24px;
    }
    .el-date-editor {
      width: 264px;
    }
  }
  .searchCreaterId {
    .el-form-item__label {
      padding-right: 24px;
    }
    .el-input {
      width: 174px;
    }
  }
  .searchApprovalmanId {
    .el-form-item__label {
      padding-right: 24px;
    }
    .el-input {
      width: 174px;
    }
  }
  .searchCreaterArea,
  .searchBusinessCode {
    .el-input {
      width: 174px;
    }
  }
  .windowInput {
    input {
      background: #f5f5f5;
    }
  }
  .el-form-item__label,
  .el-select-dropdown__item,
  .el-form-item__content,
  .el-input__inner {
    color: #666666;
    font-size: 12px !important;
  }
  .el-select-dropdown__item {
    font-size: 12px !important;
  }
  .btn-group {
    float: right;
    margin-right: 8px;
  }
}

// /* 范围输入框 */
.input-more {
  .input-row {
    .line {
      margin: 0 3px;
    }
  }
  .el-form-item {
    margin-right: unset;
  }

  .el-form-item:nth-last-of-type(1) {
    margin-right: 10px;

    .line {
      display: none;
    }
  }
}
</style>

