<template>
    <div class="time-wrap">
       <el-row>
           <el-col :span="4" style="text-align:left">
                <div class="time-item">
                    <label class="label-title">
                    {{orgType =='group'?'总部':(orgType =='city'?'区域':'影院')}}：{{orgName}}
                    </label>
                </div>
           </el-col>
           <el-col :span="4">
                <div class="time-item">
                    <label class="label-title">票劵批次ID：{{ticketInfo.id}}</label>
                </div> 
           </el-col>
           <el-col :span="4">
                <div class="time-item">
                    <label class="label-title">票劵名称：{{ticketInfo.name}}</label>
                </div>
           </el-col>
            <el-col :span="4">
                 <div class="time-item">
                    <label class="label-title">票劵类型：{{ticketInfo.type | typeMap}}</label>
                </div>
           </el-col>
            <el-col :span="8">
                 <div class="time-item">
                    <label class="label-title">票劵有效期：{{ticketInfo.time[0]}} 至 {{ticketInfo.time[1]}}</label>
                 </div>
           </el-col>
       </el-row>
       <el-row>
           <el-col :span="24" class="mt10">
                <div class="time-item">
                    <label>
                        <span class="label-title">统计时间段：</span>
                        <el-date-picker v-model="timeRange"  size="mini"
                            type="daterange"
                            range-separator="~"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间" 
                            :picker-options="pickerOptions"
                            @change="changeTime"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                       
                    </label>
                    <el-button type="primary" size="small" style="margin-left:30px" @click="search">查询</el-button>
                </div>
           </el-col>
       </el-row> 
    </div>
</template>
<script>
 const typeMap = {
    0:"兑换券",
    1:"代金券",
    2:"优惠券"
}
export default {
    props:{
        orgName:{},
        orgType:{},
        ticketInfo:{
            type:Object,
        },
        time:{
            type:Array
        }
    },
   
    data(){
        return {
            timeRange:null,
            pickerOptions:{
                disabledDate:(time)=>{
                    let selectedTime = this.$moment(time.getTime()).format('YYYY-MM-DD');
                    let timeRange = this.ticketInfo.time;
                    return (selectedTime > timeRange[1] || selectedTime < timeRange[0]);
                }
            }
        }
    },
    watch:{
        time: {
            handler(val) {
                this.timeRange = this.time;
            },
            deep: true,
            immediate: true
        }
    },
    filters:{
        typeMap(id){
            return typeMap[id]?typeMap[id]:id
        }
    },
    methods:{
        changeTime(time){
            this.$emit('changeTime',time)
        },
        search(){
            this.$emit('search')
        }
    }
}
</script>

