<template>
    <div class="params-setting">
        <aside class="aside">
            <cinemaTree v-on:choseCinema="handerChoseCinema"></cinemaTree>
        </aside>
        <div class="content">
            <el-radio-group v-model="tabPosition" >
                <el-radio-button  label="RepParams" >上报参数</el-radio-button>
                <el-radio-button  label="BasicParams" >基础参数设置</el-radio-button>
            </el-radio-group>
            <div>
                <component :is="tabPosition"  :applicableObj="applicableObj" v-if="applicableObj"></component>
            </div>
        </div>
    </div>
</template>
<script>
import cinemaTree from 'ctm/components/SystemGetUserMenuTree'
import RepParams from './RepParams'
import BasicParams from './BasicParams'
export default {
    components:{RepParams,BasicParams,cinemaTree},
    data() {
        return {
            tabPosition:'RepParams',
            dataTree: [],
            defaultProps: {
                label: 'menuName',
                children: 'sonTree'
            },
            applicableObj:'',
            defaulKey:[]
        }
    },
    methods: {
        handerChoseCinema(vale){
            this.applicableObj = vale
        }
    },
    created() {
    }
}
</script>
<style lang="scss">
    .params-setting{
        box-sizing: border-box;
        padding: 20px;
        display: flex;
        .el-form{margin: 0;}
        .title{
            height: 40px;
            line-height: 40px;
            background: #f5f5f5;
            color: #666;
            margin-top: 10px;
            margin-bottom: 10px;
        }
        .aside{
            width: 250px;
            // background: #f0f0f0;
        }
        .content{
            flex: 1;
        }
        .footer{
            text-align:center;
            margin-top:10px;
            width: 950px;
        }
        // .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
        //     background: #3B74FF;
        //     color:#fff;
        // }
    }

</style>
