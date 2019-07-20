<template>
  <div>
    <el-select
      popper-class="rpt-select"
      v-model="movieType"
      placeholder="请选择"
      @change="getdataValue"
      @focus="focusBTn"
    >
      <el-option label="全部" value></el-option>
      <el-option
        v-for="item in options"
        :key="item.propertyCode"
        :label="item.propertyValue"
        v-loading="loading"
        :value="item.propertyValue"
      ></el-option>
    </el-select>
  </div>
</template>
<script type="text/javascript">
import mixins from "src/frame_cpm/mixins/cacheMixin.js";
export default {
  mixins: [mixins.cacheMixin],
  props: {
    selectValue: {
      type: null | Object,
      default: "",
      require: true
    },
    resetStatus: Boolean
  },
  data() {
    return {
      cacheField: ["movieType"],
      subComName: "movieType",
      newselectValue: this.selectValue,
      options: [],
      channelName: this.selectValue.defVALUE,
      loading: false,
      movieType: ""
    };
  },
  methods: {
    //选择触发事件
    getdataValue: function(selVal) {
      // this.newselectValue.queryColValue = selVal;
      this.$emit("selectMovieTypeData", selVal);
    },
    focusBTn: function() {
      this.$rptList.movieType().then(res => {
        this.options = [];
        if (res.code == 200) {
          for (var i = 0; i < res.data.propertyList.length; i++) {
            this.options.push(res.data.propertyList[i]);
          }
        }
      });
    },
    getDatacenterSucc(res) {
      this.options = res.data.data.result;
      Vue.nextTick(function() {});
    }
  },
  watch: {
    selectValue: function(newVal, oldVal) {
      this.newselectValue = newVal;
    },
    resetStatus(newVal) {
      if (newVal) {
        this.movieType = "";
      }
    }
  }
};
</script>