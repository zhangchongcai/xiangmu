<template>
  <div>
    <dialogWarp :dialogVisible.sync="dialogVisible">
      <div>
        测试遮罩
      </div>
    </dialogWarp>
    <el-button type="primary" @click="()=>{dialogVisible=true}">点击打开</el-button>
  </div>
</template>
<script type="text/javascript">
import dialogWarp from "../components/dialogWarp/dialogWarp";

export default {
  data() {
    return {
      dialogVisible: false
    };
  },
  components: {
    // editor
    dialogWarp
  },
  mounted() {},
  methods: {
   
  }
};
</script>
<style lang="scss">
</style>