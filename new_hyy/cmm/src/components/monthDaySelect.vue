<template>
  <div style="display:inline-block;">
    <el-cascader :disabled="disabled" :options="optionsWithDisabled" v-model="expireTime" @change="cascaderChangeHandler">
    </el-cascader>
  </div>
</template>
<script type="text/javascript">
export default {
  props: {
    value: {
      type: Array,
      default: [],
      required: true  //验证是否从父组件传递值过来
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    'value': function () {
      this.expireTime = this.value;
    }
  },
  data () {
    return {
      expireTime: this.value
    }
  },
  created () {
    this.optionsWithDisabledFn();
  },
  methods: {
    optionsWithDisabledFn () {
      let val = [];
      for (let i = 1; i < 13; i++) {
        let item = {
          value: i,
          label: i + '月'
        }
        item.children = [];
        let dayLength = 31;
        if (i == 2) {
          dayLength = 29;
        }
        if (i == 4 || i == 6 || i == 9 || i == 11) {
          dayLength = 30;
        }
        for (let j = 1; j <= dayLength; j++) {
          item.children.push({
            value: j,
            label: j + '日'
          });
        }
        val.push(item);
      }
      this.optionsWithDisabled = val;
    },
    cascaderChangeHandler (val) {
      this.expireTime = val;
      this.$emit('input', val);
    }
  }
}
</script>