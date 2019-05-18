<template>
    <div class="reset-target-dialog">
        <el-dialog :visible="show" title="影院kpi编辑" class="reset-fix-dialog"
        :before-close="handleClose">
            <div class="content ">
                <el-form ref="kpiRef" label-width="140px" label-position="right" class="reset-form" 
                    :model="infoData"
                    :rules="rules"
                    >
                    <el-form-item label="影院名称:" class="reset-form-input">
                       <el-input size="small" v-model="infoData.cinemaName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="专资编码:" class="reset-form-input">
                       <el-input size="small" v-model="infoData.id" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="时间选择:" class="reset-form-select">
                        <el-date-picker disabled size="small"
                            v-model="infoData.dateKey"
                            type="month"
                            placeholder="选择月">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="票房收入目标:" class="reset-form-input" prop="boxOfficeTarget">
                        <el-input size="small" type="number" v-model="infoData.boxOfficeTarget" :min="0"></el-input>
                    </el-form-item>
                    <el-form-item size="samll" label="卖品收入目标:" class="reset-form-input" prop="sellGoodsTarget">
                        <el-input type="number" v-model="infoData.sellGoodsTarget" :min="0"></el-input>
                    </el-form-item>
                    <el-form-item label="观影人次目标:" class="reset-form-input" prop="audienceCountTarget">
                        <el-input size="small" type="number" v-model="infoData.audienceCountTarget" :min="0"></el-input>
                    </el-form-item>
                    <el-form-item label="新增会员目标:" class="reset-form-input" prop="addMemberCount">
                        <el-input size="small" type="number" v-model="infoData.addMemberCount" :min="0"></el-input>
                    </el-form-item>
                    <el-form-item label="会员消费金额目标:" class="reset-form-input" prop="memberConsumeTarget">
                        <el-input size="small" type="number" v-model="infoData.memberConsumeTarget" :min="0"></el-input>
                    </el-form-item>
                    <el-form-item label="票房市场份额目标:" class="reset-form-input" prop="marketShare">
                        <el-input size="small" type="number" v-model="infoData.marketShare" :min="0"></el-input>
                    </el-form-item>
                </el-form>
             </div>
             <div class="footer">
                <el-button type="primary" size="mini" @click="sure">确认</el-button>
                <el-button size="mini" @click="handleClose"> 取消</el-button>
             </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props:['info'],
    data(){
        return {
            show:false, 
            rules:{
                boxOfficeTarget:[{
                    required:true,
                    message:'请输入票房收入目标'
                }],
                sellGoodsTarget:[{
                    required:true,
                    message:'请输入卖品收入目标'
                }],
                audienceCountTarget:[{
                    required:true,
                    message:'请输入观影人次目标'
                }],
                addMemberCount:[{
                    required:true,
                    message:'请输入新增会员目标'
                }],
                memberConsumeTarget:[{
                    required:true,
                    message:'请输入会员消费金额目标'
                }],
                marketShare:[{
                    required:true,
                    message:'请输入票房市场份额目标'
                }]
            }
        }
    },
    computed:{
        infoData(){
           let data = Object.assign({},this.info);
           return data;
        }
    },
    created(){
        console.log(this.infoData,'props')
    },
    methods:{
        sure(){
            this.$refs.kpiRef.validate(valid=>{
                if(valid){
                    this.$emit('updateKpi',this.infoData)
                }
            })
        },
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


