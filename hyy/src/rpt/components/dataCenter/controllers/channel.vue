<template>
  <el-select popper-class="rpt-select" v-model="channelObj.channelValue" placeholder="请选择" @focus="getChannel('POS_CHANNEL_TYPE',3)">
    <el-option label="全部" value></el-option>
    <el-option
      v-for="(item,index) in options[3]"
      :key="`channel_${index}`"
      :label="item.keyName"
      :value="item.keyName"
    ></el-option>
  </el-select>
</template>

<script>
export default {
  props: {
    resetStatus: Boolean,
    channelObj: Object
  },
  data() {
    return {
      channelValue: "",
      options: [[]]
    };
  },
  methods: {
    getChannel(name, index) {
      this.$rptList.getMoudelData("1", 100, name).then(data => {
        if (data && data.code === 200) {
          // 创建二维数组 添加数据
          this.$set(this.options, index, data.data.list);
        }
      });
    }
  },
  watch: {
    channelObj: {
      handler(newVal, oldVal) {
        this.$emit("selectChannelData", this.channelObj.channelValue);
      },
      deep: true
    },
    resetStatus(newVal) {
      if (newVal) {
        this.channelObj.channelValue = "";
      }
    }
  }
};
</script>

<style lang="sass" scoped>

</style>


