<template>
    <div class="reset-target-dialog">
        <el-dialog :visible="show" title="影院kpi创建" class="reset-fix-dialog"
            :before-close="handleClose">
            <div class="content ">
                <el-form ref="kpiRef" label-width="140px" label-position="right" class="reset-form" 
                    :model="infoData"
                    :rules="rules"
                    >
                    <el-form-item label="影院名称:" class="reset-form-input" prop="cinemaName">
                         <el-autocomplete size="small"
                            class="inline-input"
                            v-model="infoData.cinemaName"
                            :fetch-suggestions="getCinema"
                            placeholder="请输入内容"
                            :trigger-on-focus="false"
                            @select="selectCinema"
                            ></el-autocomplete>
                    </el-form-item>
                    <el-form-item label="专资编码:" class="reset-form-input" prop="id">
                       <el-input size="small" v-model="infoData.id" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="时间选择:" class="reset-form-select" prop="dateKey">
                        <el-date-picker  size="small"
                            v-model="infoData.dateKey"
                            type="month"
                            placeholder="选择月"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="票房收入目标:" class="reset-form-input" prop="boxOfficeTarget">
                        <el-input size="small" type="number" v-model="infoData.boxOfficeTarget" :min="0"></el-input>
                    </el-form-item>
                    <el-form-item size="small" label="卖品收入目标:" class="reset-form-input" prop="sellGoodsTarget">
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
    data(){
        return {
            show:false,
            cinemaName:null,
            cinemaId:null,
            options:[],
            infoData:{
                userId:this.$store.state.loginUser?this.$store.state.loginUser.uid:805852,
                cinemaName:null,
                id:null,
                boxOfficeTarget:null,
                sellGoodsTarget:null,
                audienceCountTarget:null,
                addMemberCount:null,
                memberConsumeTarget:null,
                marketShare:null
            },
            rules:{
                cinemaName:[{
                    required:true,
                    message:'请输入影院名称',
                }],
                id:[{
                    required:true, 
                    message:'请输入影院id'
                }],
                dateKey:[{
                    required:true,
                    message:'请选择月份'
                }],
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
    methods:{
        // 影院列表(未设置kpi)
        getCinema(str,cb){
           setTimeout(()=>{
            let params = {
                body:{
                    userId:this.userId,
                    cinemaName:str,
                    consumerId:805852,
                    pageNo:1,
                    pageSize:10,
                }
            };
           
            this.$camList.getUnbindKpiCinema(params).then(response=>{
                this.options = response.data
                let resData = this.options.map(item=>{
                    return {
                        "value":item.cinemaName,
                        "id":item.id
                    }
                })
                cb(resData)
            })
           },200) 
        },
        // 选择影院
        selectCinema(item){
            this.infoData.cinemaName = item.value,
            this.infoData.id = item.id
        },  
        // 创建kpi
        sure(){
            this.$refs.kpiRef.validate(valid => {
                if(valid){
                    this.$emit('createKpi',this.infoData)
                }
            })
        },
        // close
        handleClose(){
            this.$refs.kpiRef.resetFields()
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


