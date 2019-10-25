<template>
  <div class="cwf_billSetting">
    <el-radio-group v-model="activeName" style="margin:20px 0px;">
      <el-radio-button label="first">通用设置</el-radio-button>
      <el-radio-button label="second">按组织个性设置</el-radio-button>
    </el-radio-group>
    <normal-setting v-show="activeName=='first'"></normal-setting>
    <merchant-setting v-show="activeName=='second'"></merchant-setting>

  </div>
</template>

<script>
import normalSetting from './normalSetting'//通用设置
import merchantSetting from './merchantSetting'//按组织个性设置
// import minxins from 'frame_cpm/mixins/cacheMixin.js'
const { cacheMixin } = requireModule('base');
export default {
  components: {
    merchantSetting,
    normalSetting
  },
  mixins: [cacheMixin.cacheMixin],
  data () {
    return {
      activeName: this.$route.query.page || "first",//默认显示
      cacheField: ["activeName"],//缓存对象数据
      subComName: "billSetting_activeName",//缓存数据唯一标识
    }
  },
  created () {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.cwf_billSetting {
}
</style>
