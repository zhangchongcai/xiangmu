<template>
    <div class="flex breadcrumb-wrap">
        <el-breadcrumb separator="/" class="reset-bread" separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path:'/analysis/new/home' }">
            <span class=" cursor" style="font-size:12px;">经营决策</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item :to="{path:item.path}" v-for="(item,index) in dataList" :key="index" >
            <span class=" cursor" style="font-size:12px;">{{item.name}}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="current-time" style="font-size:12px;color:#666" v-if="currentTime">数据更新时间：{{currentTime}}</div>
      </div>
</template>
<script>
export default {
    props:['currentTime','dataList'],
    props:{
        currentTime:{
            dafault:null,
        },
        dataList:{
            type:Array,
            default:()=>{
                return null
            }
        }
    } 
}
</script>
<style lang="scss" scoped>
.breadcrumb-wrap{
    .el-breadcrumb{
        .el-breadcrumb__item{
            .el-breadcrumb__inner{
                span{
                    color:#666;
                } 
            }
            &:first-of-type{
                .el-breadcrumb__inner{
                    span{
                        color:#bcbcbc;
                    } 
                }  
            }
            &:last-of-type{
                .el-breadcrumb__inner{
                    span{
                        color:#3B74FF;
                    } 
                }
            }
        }
    }
}
</style>


