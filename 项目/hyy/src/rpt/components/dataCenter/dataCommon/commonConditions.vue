<template>
  <div>
    <el-select v-model="channelName" placeholder="请选择" @change="getdataValue" @focus="focusBTn">
      <el-option
        v-for="item in options"
        :key="item.channelName"
        :label="item.label"
        v-loading="this.loading"
        :value="item.channelName"
      ></el-option>
    </el-select>
  </div>
</template>
<script type="text/javascript">
import datacenterBus from "../../../assets/datacenterBus.js";
export default {
  props: {
    selectValue: {
      type: null | Object,
      default: "",
      require: true
    }
  },
  data() {
    return {
      newselectValue: this.selectValue,
      options: [],
      channelName: this.selectValue.defVALUE,
      loading: false
    };
  },
  watch: {},
  methods: {
    getdataValue: function() {
      console.log(this.channelName);
      this.newselectValue.queryColValue = this.channelName;
      // datacenterBus.$emit("returnValueEvent",this.newselectValue)
    },
    focusBTn: function() {
      this.loading = true;
      // axios.get("http://58.67.170.171:8088"+this.selectValue.interfaceURL)
        axios.get("http://58.67.170.171:8088"+this.selectValue.interfaceURL)
        .then(this.getDatacenterSucc);
    },
    getDatacenterSucc(res) {
      console.log(res.data.data.result);
      this.options = res.data.data.result;
      Vue.nextTick(function() {
        this.loading = false;
      });
    }
  },
  watch: {
    selectValue: function(newVal, oldVal) {
      this.newselectValue = newVal;
    }
  }
};
</script>