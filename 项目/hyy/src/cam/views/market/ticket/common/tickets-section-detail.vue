<template>
    <div>
        <div class="mt30">
            <el-table :data="tableData">
                <el-table-column align="center" min-width="100" prop="ticketBatchNo" label="票券申请单号"></el-table-column>
                <el-table-column align="center" min-width="195" prop="ticketName" label="票券名称">
                    <template slot-scope="scope">
                        <span class="text-blue cursor" @click="goDetail(scope.row)">{{scope.row.ticketName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="100" prop="ticketType" label="票券类型">
                    <template slot-scope="scope">
                          <span>{{scope.row.ticketType | transType}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="100" prop="ticketStatus" label="票券状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.ticketStatus | transStatus}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" min-width="100" prop="ticketCreateTime" label="创建日期"></el-table-column>
                <el-table-column align="center" min-width="270" label="票券有效期">
                    <template slot-scope="scope">
                        {{scope.row.ticketValidTimeStart + '~' + scope.row.ticketValidTimeEnd}}
                    </template>   
                </el-table-column>
                <el-table-column align="center" min-width="120" prop="sendCounts" label="发放数量"></el-table-column>
                <el-table-column align="center" min-width="120" prop="useCounts" label="使用数量"></el-table-column>
                <el-table-column align="center" min-width="120" prop="useRate" label="使用率"></el-table-column>
                <el-table-column align="center" min-width="120" prop="consumeAmount" label="带动消费金额"></el-table-column>
            </el-table>
        </div>
        <slot></slot>
    </div>
</template>
<script>
const statusMap = {
    0: "未提交",
    1: "新建",
    2: "已激活",
    3: "已停用",
    4: "已作废",
    5: "已过期",
    6: "已删除",
    7: "验证中",
    8: "验证不通过"
}
const typeMap = {
    0:"兑换券",
    1:"代金券",
    2:"优惠券"
}
export default {
    props:['tableData','orgType'],
    methods:{
        goDetail(row){
            let orgType = this.orgType;
            let org = orgType == 'group'?'group':(orgType == 'city'?'area':"cinema");
            let id = row.ticketBatchNo;
            let startTime = row.ticketValidTimeStart;
            let endTime = row.ticketValidTimeEnd;
            let nowDate = this.$moment(new Date()).format('YYYY-MM-DD');
            if(startTime > nowDate){
                return ;
            }else if(endTime>nowDate){
                this.$emit('goDetail',{type:org,id:id,startTime:startTime,endTime:nowDate})
            }else{
                this.$emit('goDetail',{type:org,id:id,startTime:startTime,endTime:endTime})
            }
        }
    },
    filters: {
        transStatus(val) {
            return statusMap[val] ? statusMap[val] : val
        },
        transType(val){
             return typeMap[val] ? typeMap[val] : val
        }
        
    }

}
</script>


