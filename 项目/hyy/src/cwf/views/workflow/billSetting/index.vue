<template>
    <div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="通用设置" name="first">
                <normal-setting></normal-setting>
            </el-tab-pane>
            <el-tab-pane label="按组织个性设置" name="second">
                <merchant-setting></merchant-setting>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import '../../../assets/common.scss';
import merchantSetting from './merchantSetting'
import normalSetting from './normalSetting'
import minxins from 'frame_cpm/mixins/cacheMixin.js'
export default {
    components: {
       merchantSetting,
       normalSetting
    },
    mixins: [minxins.cacheMixin],
    data() {
        return {
              /* 缓存数据 */
            cacheField: ["activeName"],
            subComName:"billSetting_activeName",
            activeName:"first"//默认显示
        }
    },
     created() {
      
    },
    methods: {
        handleClick(){

        }
    }
}
</script>

<style lang="scss" scoped>

</style>
