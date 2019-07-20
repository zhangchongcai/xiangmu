<!--Created by 詹陈龙 on 2018/6/11.-->
<template>
  <el-form-item
    v-bind="itemProps(mItem)"
    :class="['my-form-item', {'is-required': !noVerify && mItem.verify && mItem.verify.canBeEmpty === undefined}, mItem.col ? 'col-' + mItem.col : '', mItem.prop]"
    v-loading="loading"
  >
    <!--选择框-->
    <cc-select
      v-model="model[mItem.prop]"
      v-bind="mItem.props"
      :options="mItem.options"
      v-if="mItem.type === 'select'"
      v-on="$listeners"
      @change="val => selectChange(val, mItem)"
    ></cc-select>
    <!--日期，范围-->
    <el-date-picker
      v-model="model[mItem.prop]"
      v-bind="mItem.props"
      :type="mItem.type"
      v-else-if="['date', 'datetime', 'daterange', 'datetimerange'].includes(mItem.type)"
      :value-format="datePickerFarmatter(mItem)"
      v-on="$listeners"
    ></el-date-picker>
    <!--时间选择-->
    <el-time-select
      v-model="model[mItem.prop]"
      v-bind="mItem.props"
      v-else-if="mItem.type=== 'timeselect'"
      v-on="$listeners"
    >
    </el-time-select>
    <!--时间、范围-->
    <el-time-picker
      v-model="model[mItem.prop]"
      v-bind="mItem.props"
      :is-range="mItem.type === 'timerange'"
      v-else-if="['time', 'timerange'].includes(mItem.type)"
      :value-format="mItem.props && mItem.props.valueFormat ? mItem.props.valueFormat : 'HH:mm:ss'"
      v-on="$listeners"
    >
    </el-time-picker>
    <!--开关-->
    <el-switch
      v-model="model[mItem.prop]"
      v-bind="mItem.props"
      v-else-if="mItem.type === 'switch'"
      v-on="$listeners"
    ></el-switch>
    <!--单选-->
    <el-radio-group
      v-model="model[mItem.prop]"
      v-bind="mItem.props"
      v-else-if="mItem.type === 'radio'"
      v-on="$listeners"
    >
      <template v-if="mItem.options && typeof mItem.options !== 'string'">
        <el-radio
          v-bind="option"
          :label="option.value"
          :name="mItem.prop"
          :key="option.value"
          v-for="option in mItem.options"
        >{{option.label}}</el-radio>
      </template>
    </el-radio-group>
    <!--单选-按钮-->
    <el-radio-group
      v-model="model[mItem.prop]"
      v-bind="mItem.props"
      v-else-if="mItem.type === 'radiobutton'"
      v-on="$listeners"
    >
      <template v-if="mItem.options && typeof mItem.options !== 'string'">
        <el-radio-button
          v-bind="option"
          :label="option.value"
          :name="mItem.prop"
          :key="option.value"
          v-for="option in mItem.options"
        >{{option.label}}</el-radio-button>
      </template>
    </el-radio-group>
    <!--多选-->
    <cc-checkbox-group
      v-model="model[mItem.prop]"
      v-bind="mItem.props"
      :options="mItem.options"
      :type="mItem.type"
      v-else-if="['checkbox', 'checkboxbutton'].includes(mItem.type)"
      v-on="$listeners"
    ></cc-checkbox-group>
    <!--级联选择器-->
    <template v-else-if="mItem.type === 'cascader'">
      <el-cascader
        @change="val => cascaderChange(val, mItem)"
        @active-item-change="val=>handleItemChange(val,mItem)"
        v-model="model[mItem.prop]"
        :options="typeof mItem.options === 'string' ? [] : mItem.options"
        v-bind="mItem.props"
        v-if="mItem.options"
        v-on="$listeners"
      />
    </template>
    <!--计数器-->
    <!--<el-input-number v-model="model[mItem.prop]" v-bind="mItem.props" v-else-if="mItem.type === 'number'" v-on="$listeners"></el-input-number>-->
    <cc-input-number
      v-model="model[mItem.prop]"
      v-bind="mItem.props"
      v-else-if="mItem.type === 'number'"
      v-on="$listeners"
    ></cc-input-number>
    <!--滑块-->
    <el-slider
      v-model="model[mItem.prop]"
      v-bind="mItem.props"
      v-else-if="mItem.type === 'slider'"
      v-on="$listeners"
    ></el-slider>
    <!--评分-->
    <el-rate
      v-model="model[mItem.prop]"
      v-bind="mItem.props"
      v-else-if="mItem.type === 'rate'"
      v-on="$listeners"
    ></el-rate>
    <!--popover-table-->
    <template v-else-if="mItem.type === 'table'">
      <cc-input-table
        v-model="model[mItem.prop]"
        v-bind="mItem.props"
        :options="typeof mItem.options === 'string' ? {} : mItem.options"
        v-if="mItem.options"
        v-on="$listeners"
      ></cc-input-table>
    </template>
    <!--popover-tree-->
    <template v-else-if="mItem.type === 'tree'">
      <cc-input-tree
        v-model="model[mItem.prop]"
        v-bind="mItem.props"
        :options="typeof mItem.options === 'string' ? [] : mItem.options"
        v-if="mItem.options"
        v-on="$listeners"
      ></cc-input-tree>
    </template>
    <!--弹出dialog-->
    <cc-input-dialog
      @input="onValueChange(mItem.prop)"
      :title="mItem.label"
      v-model="model[mItem.prop]"
      v-bind="mItem.props"
      :dialog="typeof mItem.options === 'string' ? {} : mItem.options"
      v-else-if="mItem.type === 'dialog'"
      v-on="$listeners"
    ></cc-input-dialog>
    <!--icon-->
    <cc-input-icon
      v-model="model[mItem.prop]"
      v-bind="mItem.props"
      v-else-if="mItem.type === 'icon'"
      v-on="$listeners"
    ></cc-input-icon>
    <!--color-->
    <el-color-picker
      v-model="model[mItem.prop]"
      v-bind="mItem.props"
      v-else-if="mItem.type === 'color'"
      v-on="$listeners"
      :predefine="['#53beea', '#49a361', '#e79f3c', '#cd5542']"
    ></el-color-picker>
    <div v-else-if="mItem.type === 'view'">
      <template v-if="item.formatter">
        {{item.formatter(model, mItem.prop, model[mItem.prop])}}
      </template>
      <template v-else-if="item.renderCell">
        <cc-render :renderFun="item.renderCell"></cc-render>
      </template>
      <template v-else>{{model[mItem.prop]}}</template>
    </div>
    <el-autocomplete
      v-model="model[mItem.prop]"
      v-bind="mItem.props"
      :fetch-suggestions="item.props.fetchSuggestions"
      v-else-if="mItem.type === 'autocomplete'"
      v-on="$listeners"
    ></el-autocomplete>
    <cc-input-tags
      :label="mItem.props.label"
      v-else-if="mItem.type === 'tags'"
      v-model="model[mItem.prop]"
      v-bind="mItem.props"
      v-on="$listeners"
      icon="table"
    ></cc-input-tags>
    <!--input-->
    <oss-upload
      ref="upload"
      v-else-if="mItem.type === 'upload'"
      v-model="model[mItem.prop]"
      v-bind="mItem.props"
    ></oss-upload>
    <!--省市选择-->
    <template v-else-if="mItem.type === 'divider-cascader'">
      <cc-select
        v-model="model[mItem.prop]"
        v-bind="mItem.props"
        :options="mItem.options"
        v-if="mItem.type === 'divider-cascader'"
        v-on="$listeners"
        @change="val => selectAreaChange(val, mItem)"
      ></cc-select>
      <cc-select
        v-model="model[mItem.prop1]"
        v-bind="mItem.props"
        :options="mItem.options1"
        v-if="mItem.type === 'divider-cascader'"
        v-on="$listeners"
        @change="val => selectChange(val, mItem)"
      ></cc-select>
    </template>
    <template v-else>
      <el-input
        v-model.number="model[mItem.prop]"
        v-bind="mItem.props"
        :type="mItem.type"
        v-if="isNumber(mItem.verify)"
        clearable
        v-on="$listeners"
      ></el-input>
      <el-input
        v-model="model[mItem.prop]"
        @click.native="$emit('click')"
        v-bind="mItem.props"
        :type="mItem.type"
        v-else
        clearable
        v-on="$listeners"
      ></el-input>
    </template>
  </el-form-item>
</template>

<script>
import CcInputTable from './CcInputTable.vue'
import CcInputTags from './CcInputTags'
import CcInputTree from './CcInputTree.vue'
import CcRender from '../DyTable/DyRender'
// import CcInputDialog from './CcInputDialog.vue'
// import CcInputIcon from './CcInputIcon.vue'
import CcCheckboxGroup from './CcCheckboxGroup.vue'
import CcInputNumber from './CcInputNumber.vue'
import CcSelect from './CcSelect.vue'
import { mapActions } from 'vuex'
import { fetchProvinces, fetchAreaByCode, queryAreaByParent } from '../../http/interface'

export default {
  components: { CcCheckboxGroup, CcInputTree, CcSelect, CcInputNumber, CcInputTable, CcInputTags, CcRender },
  props: {
    model: { required: true, type: [Object] },
    item: { required: true },
    noVerify: Boolean
  },
  data () {
    return {
      loading: false,
      mItem: JSON.parse(JSON.stringify(this.item)),
      areasK: {}
    }
  },
  /* vue-vuex */
  /* vue-compute */
  /* vue-watch */
  watch: {
    item () {
      // this.mItem = JSON.parse(JSON.stringify(this.item))
      this.mItem = Object.assign({}, this.item)
    },
    mItem: {
      handler: function (val) {
        this.initOptions()
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['getOptions', 'getPageOptions', 'requestUrl', 'getAllArea']),
    // 过滤form-item的props
    itemProps (item) {
      const { target, options, props, dialog, verify, placeholder, multiSelect, ...itemProps } = item
      item.props = item.props || {}
      if (item.props.clearable === undefined) {
        item.props.clearable = true
      }
      if (placeholder) {
        item.props.placeholder = placeholder
      }
      if (multiSelect) {
        item.props.multiSelect = multiSelect
      }
      if (this.noVerify) {
        return { ...itemProps }
      } else {
        // 处理表单校验
        if (verify) {
          verify.verify = ''
          // 校验框架没有必填选项，只有canBeEmpty，所以转换一下
          // if (!verify.required) {
          //   verify.canBeEmpty = ''
          // }
        }
        return { ...itemProps, ...verify }
      }
    },
    // 日期控件默认格式
    datePickerFarmatter (item) {
      if (item.props && item.props.valueFormat) {
        return item.props.valueFormat
      } else {
        return (item.type === 'date' || item.type === 'daterange') ? 'yyyy-MM-dd' : 'yyyy-MM-dd HH:mm:ss'
      }
    },
    // 检查输入框的值是否是number，以判断是否要加number修饰符
    isNumber (verify) {
      return verify && (verify.number || verify.int || verify.maxDecimalLength || verify.gt || verify.gte || verify.lt || verify.lte)
    },
    // 在dialog的值变化的时候，触发一次校验
    onValueChange (prop) {
      this.$emit('value-change', prop)
    },
    async handleItemChange (val, mItem) {
      console.log(val);
      console.log(mItem);
      let city = this.areasK[val[val.length - 1]]
      let glass = 2;
      if (city) {
        if (city.glass == 1) {
          glass = 2
        } else if (city.glass == 2) {
          glass = 3
        }
      } else {
        city = { areaCode: val[val.length - 1] }
      }
      let ret = await fetchAreaByCode({ areaCode: city.areaCode })
      if (ret.code == 200) {
        ret.data.forEach(item => {
          item.glass = glass;
          if (item.glass < mItem.props.level) {
            item.children = [];
          }
          this.areasK[item.areaCode] = item
        })
        city.children = ret.data;
        this.$forceUpdate();
      }
    },
    //
    async initOptions () {
      let data = null
      if (this.mItem.options && typeof this.mItem.options === 'string') {
        this.loading = true
        const type = this.mItem.type

        // 先在常量表里面找有没有值
        if (this.$c.options[this.mItem.options]) {
          data = this.$c.options[this.mItem.options]
        } else {
          if (this.mItem.options.indexOf('/') === 0) {
            data = await this.requestUrl({ url: this.mItem.options, params: this.mItem.optionsProps || {} })
          } else if (this.mItem.options === 'action') {
            data = await this.$store.dispatch(this.mItem.optionsProps.actionName, this.mItem.optionsProps.actionNameParams)
          } else {
            if (type === 'dialog') {
              data = await this.getPageOptions(this.mItem.options)
            } else if (this.mItem.options === 'area') {
              // 先获取省的数据
              // const areas = await this.getAllArea()
              const areas = await fetchProvinces();
              if (areas.code == 200) {
                areas.data.forEach((item) => {
                  item.children = [];
                  item.glass = 1;
                  this.areasK[item.areaCode] = item
                })
              }
              data = this.getAreas(areas, this.mItem.props.level)
            } else if (this.mItem.options === 'divider-area') {
              const areas = await queryAreaByParent({ parentCode: "000000" });
              console.log(areas);
              areas.data.forEach(item => {
                item.label = item.areaName;
                item.value = item.areaCode;
              })
              data = areas.data;
              // data = [
              //   {
              //     label: "北京",
              //     value: "af"
              //   },
              //   {
              //     label: "上海",
              //     value: "32"
              //   }
              // ]
            } else {
              data = await this.getOptions({ url: this.mItem.options, params: this.mItem.optionsProps || {} })
            }
          }
        }
        this.loading = false
        if (data) {
          data = data.data || data
        }
      }
      if (this.item.optionsProps && this.item.optionsProps.handler) {
        data = this.item.optionsProps.handler(data)
      }
      if (data) {
        this.mItem.options = data
      }
    },
    getAreas (areas, level = 3) {
      const data = areas // .filter(a => a.level <= level)
      // return this.$utils.list2Tree([...data], '-1', 'id', 'parentId', level)
      return data;
    },
    cascaderChange (val, item) {
      const props = item.props && item.props.props ? item.props.props : {}
      const value = props.value || 'value'
      let source = item.options
      const objArr = []
      val.forEach(v => {
        const obj = source.find(o => o[value] === v)
        objArr.push(obj)
        source = obj.children || []
      })
      this.$emit('selected-obj', objArr)
    },
    selectChange (val, item) {
      let obj = item.options.find(element => element.id === val)
      this.$emit('selected-obj', obj)
      this.$forceUpdate();
    },
    async selectAreaChange (val, item) {
      // console.log(val);
      this.model[item.prop1] = "";
      const areas = await queryAreaByParent({ parentCode: val });
      console.log(areas);
      areas.data.forEach(item => {
        item.label = item.areaName;
        item.value = item.areaCode;
      })
      item.options1 = areas.data;
      this.$forceUpdate();
    }
  }
}
</script>

<style lang="scss" scoped>
// .my-form-item /deep/ {
//   .el-date-editor,
//   .el-cascader,
//   .el-select {
//     // width: 100%;
//   }
// }
</style>
