<template>
  <el-select v-model="channelValue" placeholder="请选择" @focus="getChannel('POS_CHANNEL_TYPE',3)">
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
  data() {
    return {
      channelValue: "",
      options: [[]]
    };
  },
  methods: {
    getChannel(name, index) {
      this.$rptList.getMoudelData("1", 100, name).then(data => {
        console.log(data, index);
        if (data && data.code === 200) {
          // 创建二维数组 添加数据
          this.$set(this.options, index, data.data.list);
        }
      });
    }
  },
  watch: {
    channelValue(val) {
      console.log(this.options);
      this.$emit("selectChannelData", this.channelValue);
    }
  }
};
</script>

<style lang="sass" scoped>

</style>


