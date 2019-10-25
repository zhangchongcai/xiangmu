<template>
  <div class="coupon-search-window">
    <el-form v-if="isShowForm" :inline="true" :model="baseConfig.form">
      <template v-for="(item,index) in baseConfig.system">
        <el-form-item v-if="isShowLevelItem(item)" :key="index" :prop="item.keyName" :required="item.required" :label="item.name+':'" :rules="item.rules">
          <!-- 单个输入框 - 是否带唤起弹窗按钮-->
          <template v-if="item.type == 'input'">
            <el-row class="flex-base">
              <el-input class="input-type-166" v-if="!item.alertButton" :clearable="item.clearable" @clear="clearInputVal(item.keyName,item.alertButton)" :readonly="item.readonly" v-model="baseConfig.form[`${item.keyName}`]" :placeholder="item.placeholider"></el-input>
              <template v-if="item.alertButton">
                <el-input class="input-type-166 popup-input alter-input " :clearable="item.clearable" @clear="clearInputVal(item.keyName,item.alertButton)" :readonly=true v-model="baseConfig.form[`${item.keyName}`].text" :placeholder="item.placeholider">
                  <i slot="suffix" class="el-icon-close popup-close" @click="clearInputVal(item.keyName,item.alertButton)" v-show="baseConfig.form[`${item.keyName}`].text"></i>
                </el-input>
                <el-button type="primary callWindowBtn" plain @click="callWindow(item.alertCompontsName,item.keyName,item.isNeedReturn)">{{item.alertButtonText ? item.alertButtonText : '选择'}}</el-button>
              </template>
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
            <el-date-picker v-model="baseConfig.form[`${item.keyName}`]" :type="item.dateType ? item.dateType : 'daterange'" :placeholder="item.placeholder ? item.placeholder : '选择日期'" :range-separator="item.rangeSeparator ? item.rangeSeparator : '至'" :start-placeholder="item.startPlaceholder ? item.startPlaceholder : '开始日期'" :end-placeholder="item.endPlaceholder ? item.endPlaceholder : '结束日期'"></el-date-picker>
          </template>
        </el-form-item>
      </template>
      <el-form-item class="btn-group">
        <el-row class="flex-base" :class="{'isTicketManagement': modelName == 'salesManagement'}">
          <el-button type="primary" @click="emitSearch">查询</el-button>
          <el-button type="text" v-if="searchLevelButton" @click="changeSearchType">高级查询<i class="el-icon--right" :class="{'el-icon-arrow-down': !isShowHightLevel, 'el-icon-arrow-up': isShowHightLevel}"></i></el-button>
        </el-row>
      </el-form-item>
    </el-form>
    <!-- 弹窗 -->
    <section class="alert-group">
      <!-- 选择支付 -->
      <!-- <payType @getData="handlePayTypeBack" ref="payType"></payType> -->
      <!-- 选择组织节点 -->
      <cinemaTreeDialog ref="cinemaSingle" @cinemaCallBack="cinemaSingleCallBack"></cinemaTreeDialog>
      <!-- 交易客商单选 -->
      <tradeMerchantSingle ref="tradeMerchantSingle" @tradeMerchantSingleCallBack="tradeMerchantSingleCallBack"></tradeMerchantSingle>

    </section>
  </div>
</template>
<script>
// 弹窗混入回调方法，注册弹窗和设置回调都在此处
import searchAlertHandle from './searchAlertHandle.js';
// import minxins from 'frame_cpm/mixins/cacheMixin.js';
import { cacheMixin } from 'base';
export default {
  components: {},
  mixins: [searchAlertHandle, cacheMixin.cacheMixin],
  props: {
    config: {
      required: true,
      type: Array
    },
    modelName: {
      type: String
    },
    searchLevelButton: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      /* 基本配置 */
      isShowForm: false,
      baseConfig: {
        form: {},
        system: [{
          name: '',
          keyName: '',
          type: '',
          value: '',
          placeholder: '',
          rules: []
        }]
      },
      /* 缓存数据 */
      cacheField: ['baseConfig', 'isShowHightLevel'],
      subComName: ['searBar'],
      /* 唤起弹窗后,需填入输入框的名 */
      currentInputName: '',
      /* 是否显示高级检索内容 */
      isShowHightLevel: false,
      /* 此处监听数据变化 */
      watchDataChange: null
    };
  },
  watch: {
    config: {
      deep: true,
      handler (val) {
        this.init();
      }
    }
  },
  created () {
    this.init();
  },
  methods: {
    init (data) {
      /* 根据输入config 构建form */
      let form = {};
      let system = {};
      system = JSON.parse(JSON.stringify(this.config));

      if (data) {
        system = JSON.parse(JSON.stringify(data));
      }
      try {
        for (let i = 0; i < system.length; i++) {
          let item = system[i];
          let isMore = item.type == 'input-more';
          if (isMore) {
            let options = item.options;
            for (let j = 0; j < options.length; j++) {
              let jtem = options[j];
              if (!form[`${jtem.keyName}`]) {
                form[`${jtem.keyName}`] = jtem.value ? jtem.value : '';
              } else {
                throw new Error('在传入config渲染搜索框时,请确保keyName的值为唯一');
              }
            }
          } else {
            if (!form[`${item.keyName}`]) {
              form[`${item.keyName}`] = item.value ? item.value : '';
            } else {
              throw new Error('在传入config渲染搜索框时,请确保keyName的值为唯一');
            }
          }
        }
      } catch (msg) {
        console.log(msg);
      }

      // 实时将数据变化返回
      this.watchDataChange = this.$watch('baseConfig.form', (new_val, old_val) => {
        this.$emit('searchValueChange', new_val);
      }, {
          deep: true
        });
      // console.log(this.baseConfig)
      /* ------star-------- */
      let _form = this.baseConfig.form;
      let cacheForm = false;
      for (var item of Object.keys(_form)) {
        if (typeof (_form[item]) === 'object' && _form[item]) {
          // console.log('类型：',typeof(_form[item]),'item:',item,',值:',_form[item])
          if (_form[item].text != '') {
            cacheForm = true;
          }
        } else if (typeof (_form[item]) === 'string') {
          if (_form[item] != '') {
            // console.log(`有值的项${item}:`,_form[item])
            cacheForm = true;
          }
        }
      }
      // data 是销售单的查询带过来的
      if (cacheForm && !data) {
        form = _form;
      }
      /* -----end--------- */
      this.baseConfig = {
        form,
        system
      };
      this.isShowForm = true;
    },
    /**
     * @function callWindow - 唤起弹窗
     * @param {Boolean} isNeedReturn - 是否需要回传参数给弹窗
     */

    callWindow (alertCompontsName, keyName, isNeedReturn) {
      this.currentInputName = keyName;
      let param = {};
      if (isNeedReturn) {
        param[`data`] = this.baseConfig.form[`${keyName}`];
      }
      // 触发弹窗
      try {
        if (typeof alertCompontsName !== 'string' || alertCompontsName == '') {
          throw new TypeError(`请在alertCompontsName传入非空字符串`);
        }

        let fnName = this.altertKeysFn[`${alertCompontsName}`];
        if (fnName) {
          let fn = this[`${fnName}`];
          if (typeof fn === 'function') {
            fn(alertCompontsName, this.baseConfig.form[`${keyName}`]);
          } else {
            throw new TypeError(`mixin:searchAlertHandle方法中不存在${alertCompontsName}所对应的方法，无法执行`);
          }
        } else {
          throw new TypeError(`mixin:searchAlertHandle方法中不存在${alertCompontsName}所对应的配置方法，无法执行`);
        }
      } catch (msg) {
        console.log(msg);
      }
    },
    /**
     * @function changeInputValue - 弹窗回调 修改对应输入框
     */
    changeInputValue (param) {
      let isCancle = param.isCancle;
      if (isCancle) {
        this.currentInputName = '';
        return;
      }

      let currentInputName = this.currentInputName;
      // 传给后台的id 用于前端显示的text
      this.baseConfig.form[`${currentInputName}`] = {
        text: param.data,
        value: param.data
      };
      let inputItem = this.baseConfig.form[`${currentInputName}`];
      if (typeof inputItem === 'object') {
        inputItem = {
          text: param.text,
          value: param.data
        };
      } else {
        inputItem = {
          value: param.data
        };
      }

      this.currentInputName = '';
    },
    /**
     * @function emitSearch - 回传事件给父层
     */
    emitSearch () {
      let param = this.baseConfig.form;
      this.$emit('pressSearch', param);
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
    },
    /**
     * @function clearInputVal - 清空输入框的值
     * @param {String} keyName - 输入框key
     * @param {Boolean} isAlert - 是否为弹框清除，如果是需要同时清除text和value 否在只清除value
     */
    clearInputVal (keyName, isAlert) {
      try {
        let isExist = this.baseConfig.form[`${keyName}`];
        if (isExist) {
          if (isAlert) {
            this.baseConfig.form[`${keyName}`] = {
              text: '',
              value: ''
            };
          } else {
            this.baseConfig.form[`${keyName}`] = '';
          }
        } else {
          throw new Error(`搜索栏中不存在${keyName}`);
        }
      } catch (msg) {
        console.log(msg);
      }
    }

  },
  destroyed () {
    this.watchDataChange();
  }
};
</script>

<style lang="scss" scoped>
@import "./element-reset.scss";
.flex-base {
  display: flex;
  display: -webkit-flex;
  align-content: center;
  justify-content: center;
}

.coupon-search-window {
  background: #f5f5f5;

  .el-form {
    padding: 24px 0;
    margin: 0;
    .el-form-item {
      margin-bottom: 4px;
    }

    .btn-group {
      margin-bottom: unset;
      margin-top: 5px;
    }
  }

  .callWindowBtn {
    margin-left: 5px;
    margin-top: 1px;
  }
  .el-button {
    width: 80px;
    height: 32px;
    & > span {
      font-size: 12px;
    }
  }

  /* 范围输入框 */
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

  /* 设计规范 输入框 选择框宽度 */
  @each $i in 360, 217, 166, 124, 94 {
    .input-type-#{$i} {
      width: #{$i}px;
    }
  }
  /deep/ .alter-input {
    input {
      background: #f5f5f5;
    }
  }
  .el-form-item {
    margin-left: 20px;
  }
  .el-date-editor .el-range-input {
    font-size: 12px;
  }

  .el-form-item__label {
    font-size: 12px;
    color: #666;
  }
}
</style>


