<template>
    <div class="reset-target-dialog">
        <el-dialog :visible="show" title="卖品规则修改" class="reset-fix-dialog"
        :before-close="handleClose">
            <div  class="content ">
                <el-form ref="updateRef" label-width="140px" label-position="right" class="reset-form"
                     :rules="rules" 
                     :model="info">
                    <el-form-item label="品类ID:" class="reset-form-input">
                       <el-input size="small" v-model="info.id" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="品类名称:" class="reset-form-input">
                       <el-input size="small" v-model="info.name" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="最低库存周转天数:" class="reset-form-input" prop="lowday">
                        <el-input size="small" type="number" :min="0" v-model="info.lowday"></el-input>
                    </el-form-item>
                    <el-form-item label="最高库存周转天数:" class="reset-form-input" prop="highday"> 
                        <el-input size="small" type="number" :min="0" v-model="info.highday"></el-input>
                    </el-form-item>
                </el-form>
             </div>
             <div class="footer">
                <el-button type="primary" size="small">确认</el-button>
                <el-button size="small" @click="handleClose"> 取消</el-button>
             </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return {
            show:false,  
            info:{
                id:1,
                name:'品类名称',
                lowday:10,
                highday:20,
            },
            rules:{
                lowday:[{required:true,message:'请输入最低库存周转天数'}],
                highday:[{required:true,message:'请输入最高库存周转天数'}]
            }
        }
    },
    methods:{
        handleClose(){
            this.show = false;
        }
    }
}
</script>
<style lang="scss" scoped>
    .content{
        color:#666;
        font-size:12px;
        border-top:1px solid  #E5E5E5;
        padding-top:10px;

       .reset-form{
           width:80%;
           margin:0 auto;
       }
    }
    .footer{
        padding-top:20px;
        text-align:center;
        border-top:1px solid  #E5E5E5;
    }
</style>


