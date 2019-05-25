<template>
  <div>
    <el-select v-model="movieType" placeholder="请选择" @change="getdataValue" @focus="focusBTn">
      <el-option
        v-for="item in options"   
        :key="item.propertyCode"
        :label="item.propertyValue"
        v-loading="loading"
        :value="item.propertyCode"
      ></el-option>
    </el-select>
  </div>
</template>
<script type="text/javascript">
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
      loading: false,
      movieType: ''
    };
  },
  methods: {
    //选择触发事件
    getdataValue: function(selVal) {
      // this.newselectValue.queryColValue = selVal;
      this.$emit('selectMovieTypeData', selVal);
    },
    focusBTn: function() {
      this.$rptList.movieType()
          .then(res => {
              this.options = [{"propertyCode":"","propertyValue":"全部"}];
              if(res.code==200){
                for(var i=0;i<res.data.propertyList.length;i++){
                  this.options.push(res.data.propertyList[i]);
                }
              }
          });
    },
    getDatacenterSucc(res) {
      console.log(res.data.data.result);
      this.options = res.data.data.result;
      Vue.nextTick(function() {
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