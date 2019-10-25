<template>
  <!-- 时间选择控件，带跨度的，方便搜索使用 -->
  <div style="display:inline-block;">
    <el-date-picker v-model="datetime" :type="type" class="input adjustProfixPlace" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="dateTimeValueChange" placeholder="请选择操作时间">
    </el-date-picker>
  </div>
</template>
<script type="text/javascript">
function formatDate (datetime, fmt) {
  let _this = new Date(datetime);
  var o = {
    'M+': _this.getMonth() + 1,
    'd+': _this.getDate(),
    'h+': _this.getHours(),
    'm+': _this.getMinutes(),
    's+': _this.getSeconds(),
    'q+': Math.floor((_this.getMonth() + 3) / 3),
    'S': _this.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (_this.getFullYear() + '').substr(4 - RegExp.$1.length)); }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) { fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))); }
  }
  return fmt;
}
export default {
  props: {
    value: {
      type: Array | String,
      default: [] | '',
      require: true
    },
    type: {
      type: String,
      default: 'daterange'
    },
    addTimeString: {
      type: Boolean,
      default: true
    },
    default: {
      type: String,
      default: ''
    },
    num: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      datetime: this.value
    };
  },
  watch: {
    'value': function () {
      this.dateTime = this.value;
    }
  },
  methods: {
    dateTimeValueChange (val) {
      this.datetime = val;
      let result = [];
      if (val) {
        if (this.type == 'daterange') {
          let val_01 = formatDate(val[0], 'yyyy-MM-dd') + (this.addTimeString ? ' 00:00:00' : '');
          let val_02 = formatDate(val[1], 'yyyy-MM-dd') + (this.addTimeString ? ' 23:59:59' : '');
          result.push(val_01);
          result.push(val_02);
        }        else {
          let val_01 = formatDate(val[0], 'yyyy-MM-dd hh:mm:ss');
          let val_02 = formatDate(val[1], 'yyyy-MM-dd hh:mm:ss');
          result.push(val_01);
          result.push(val_02);
        }
      }
      this.$emit('input', result);
      this.$emit('change');
    }
  }
};
</script>