<template>
    <div class="params-setting">
        <aside class="aside">
            <cinemaTree v-on:choseCinema="handerChoseCinema"></cinemaTree>
        </aside>
        <main class="main">
            <div class="tab">
                <el-radio-group v-model="tabPosition" >
                    <el-radio-button  label="RepParams" >上报参数</el-radio-button>
                    <el-radio-button  label="BasicParams" >基础参数设置</el-radio-button>
                </el-radio-group>
            </div>
            <div class="conponents">
                <component :is="tabPosition"  :applicableObj="applicableObj" v-if="applicableObj"></component>
            </div>
        </main>
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
        display: flex;
        // height: 670px;
        // overflow: auto;
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
            width: 240px;
            overflow-x:auto;
            background: #f5f5f5;
        }
        .main{
            flex: 1;
            display: flex;
            flex-direction: column;
            padding-left: 20px;
            .delete,.add{cursor: pointer;}
            .tab{
                height: 50px;
            }
            .conponents{
                flex: 1;
                height:calc(100% - 60px) ;
                overflow: hidden;
            }
        }
        .footer{
            position: fixed;
            left: 400px;
            right: 10px;
            bottom: 0px;
            height: 40px;
            padding-bottom: 10px;
            z-index: 99;
            background: #fff;
            text-align: center;
        }
        
    }

</style>
