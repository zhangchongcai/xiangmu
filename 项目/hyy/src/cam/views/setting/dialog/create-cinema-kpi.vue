<template>
    <div class="reset-target-dialog">
        <el-dialog :visible="show" title="影院kpi创建"
            :before-close="handleClose"
            :close-on-click-modal="false">
            <div class="content ">
                <el-form class="reset-form"  ref="kpiRef" label-width="150px" label-position="right" 
                    :model="infoData"
                    :rules="rules">
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
                    <el-form-item label="专资编码:" class="reset-form-input" prop="cinemaCode">
                       <el-input size="small" v-model="infoData.cinemaCode" readonly></el-input>
                    </el-form-item>
                    <el-form-item label="时间选择:" class="reset-form-select" prop="dateKey">
                        <el-date-picker  size="small"
                            v-model="infoData.dateKey"
                            type="month"
                            placeholder="选择月"
                            value-format="yyyy-MM"
                           >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="票房收入目标:" class="reset-form-input" prop="boxOfficeTarget">
                        <el-input size="small" type="number" v-model="infoData.boxOfficeTarget" :min="0" :max="9999999999"></el-input>
                        <span class="tip">&nbsp;元</span>
                    </el-form-item>
                    <el-form-item size="small" label="卖品收入目标:" class="reset-form-input" prop="sellGoodsTarget">
                        <el-input type="number" v-model="infoData.sellGoodsTarget" :min="0" :max="9999999999"></el-input>
                        <span class="tip">&nbsp;元</span>
                    </el-form-item>
                    <el-form-item label="观影人次目标:" class="reset-form-input" prop="audienceCountTarget">
                        <el-input size="small" type="number" v-model="infoData.audienceCountTarget" :min="0" :max="9999999999"></el-input>
                        <span class="tip">&nbsp;次</span>
                    </el-form-item>
                    <el-form-item label="新增会员目标:" class="reset-form-input" prop="addMemberCount">
                        <el-input size="small" type="number" v-model="infoData.addMemberCount" :min="0" :max="9999999999"></el-input>
                        <span class="tip">&nbsp;人</span>
                    </el-form-item>
                    <el-form-item label="会员消费金额目标:" class="reset-form-input" prop="memberConsumeTarget">
                        <el-input size="small" type="number" v-model="infoData.memberConsumeTarget" :min="0" :max="9999999999"></el-input>
                        <span class="tip">&nbsp;元</span>
                    </el-form-item>
                    <el-form-item label="票房市场份额目标:" class="reset-form-input" prop="marketShare">
                        <el-input size="small" type="number" v-model.trim="infoData.marketShare" :min="0" :max="9999999999"></el-input>
                        <span class="tip">&nbsp;%</span>
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
        var validateNum = (rule,value,callback) => {
            if(!value){
                callback(new Error('目标值不能为空'))
            }
            if(!Number.isInteger(value*1)){
                 callback(new Error('请输入数字值'))
            }else {
                if(value < 0 ){
                    callback(new Error('目标值不能为负值'))
                }else if(value > 9999999999){
                    callback(new Error('目标值不能超过9999999999'))
                }else{
                    callback()
                }
            }
        }
        var validateMark = (rule,value,callback) => {
            if(!value){
                callback(new Error('份额目标值不能为空'))
            }else if(value*1 < 0 ){
                callback(new Error('份额目标值不能为负值'))
            }else if(value*1 > 100){
                callback(new Error('份额目标值不能超过100'))
            }else{
                callback()
            }
        }
        return {
            show:false,
            cinemaName:null,
            cinemaId:null,
            setTimeoutId:null,
            options:[],
            userId:this.$store.state.loginUser?this.$store.state.loginUser.uid:null,
            infoData:{
                userId:this.$store.state.loginUser?this.$store.state.loginUser.uid:805852,
                cinemaName:null,
                cinemaCode:null,
                cinemaid:null,
                boxOfficeTarget:null,
                sellGoodsTarget:null,
                audienceCountTarget:null,
                addMemberCount:null,
                memberConsumeTarget:null,
                marketShare:null,
                dateKey:null
            },
            rules:{
                cinemaName:[{
                    required:true,
                    message:'请输入影院名称',
                }],
                dateKey:[{
                    required:true,
                    message:'请选择月份'
                }],
                boxOfficeTarget:[{
                    required:true,
                    validator:validateNum
                }],
                sellGoodsTarget:[{ 
                    required:true,
                    validator:validateNum
                }],
                audienceCountTarget:[{
                    required:true,
                    validator:validateNum
                }],
                addMemberCount:[{
                    required:true,
                    validator:validateNum
                }],
                memberConsumeTarget:[{
                    required:true,
                    validator:validateNum
                }],
                marketShare:[{
                    required:true,
                    validator:validateMark
                }]
            }
        }
    },
    methods:{
        // 影院列表(未设置kpi)
        getCinema(str,cb){
            this.infoData.cinemaCode = null;
            clearTimeout(this.setTimeoutId);
            this.setTimeoutId = setTimeout(()=>{
            let params = {
                body:{
                    userId:this.userId,
                    cinemaName:str,
                    pageNo:1,
                    pageSize:10,
                }
            };
            this.$camList.getUnbindKpiCinema(params).then(response=>{
                this.options = response.data
                if(this.options.length > 0 ){
                    let resData = this.options.map(item=>{
                        return {
                            value:item.cinemaName,
                            cinemaCode:item.cinemaCode,
                            cinemaid:item.cinemaid
                        }
                    })
                    cb(resData)
                }
                
            })
           },200) 
        },
        // 选择影院
        selectCinema(item){
            this.infoData.cinemaCode = item.cinemaCode;
            this.infoData.cinemaName = item.value,
            this.infoData.cinemaid = item.cinemaid;
        },  
        // 创建kpi
        sure(){
            this.$refs.kpiRef.validate((valid) => {
                if(valid){
                    this.$emit('createKpi',this.infoData)
                }
            })
        },
        // close
        handleClose(){
            this.$refs.kpiRef.resetFields();
            this.show = false;  
        }
    }
}
</script>



