<template>
    <div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="通用设置" name="first">
                <normal-setting></normal-setting>
            </el-tab-pane>
            <el-tab-pane label="按商户个性设置" name="second">
                <merchant-setting></merchant-setting>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import '../../../assets/common.scss';
import merchantSetting from './merchantSetting'
import normalSetting from './normalSetting'

export default {
    components: {
       merchantSetting,
       normalSetting
    },
    data() {
        return {
           activeName:"first"
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
