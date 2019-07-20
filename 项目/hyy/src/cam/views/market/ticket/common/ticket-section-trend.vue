<template>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        票劵指标趋势
      </div>
      <div class="section-select flex">
        <div class="unit" style="margin-left:30px"></div>
        <target-label 
            :activeType="targetType"
            :targetLabel="trendTargetLabel" 
            :otherLabel="trendOtherLabel" 
            @getType="changeType"></target-label>
        <div>
          <i class="iconfont icon-neiye-zhexiantu cursor text-blue"  @click="isLine = true"></i>
          <i class="iconfont icon-neiye-biaoge cursor text-blue"  @click="isLine = false"></i>
        </div>
      </div>
      <div class="section-content">
        <ve-line v-if="isLine"
          :data="lineData"
          :legend-visible="false"
          :settings="lineSettings"
          :extend="lineExtend">
        </ve-line>
        <!-- 趋势表格下载 -->
        <div class="reset-table" v-else>
            <div style="overflow:hidden;zoom:1;margin:10px 0" class="reset-button">
                <el-button class="right" size="mini" @click="getOut">导出</el-button>
            </div>
            <el-table border :data="allData.models" height="380" class="mt10">
                <el-table-column prop="dateKey" label="日期" min-width="100" fixed></el-table-column>
                <el-table-column prop="sendCounts" label="发放数量" min-width="140" fixed>
                    <template slot-scope="scope">
                        {{scope.row.sendCounts | formatNum(0)}}
                    </template>
                </el-table-column>
                <el-table-column prop="useCounts" label="使用数量" min-width="100" fixed>
                    <template slot-scope="scope">
                        {{scope.row.useCounts | formatNum(0)}}
                    </template>
                </el-table-column>
                <el-table-column prop="useRate" label="使用率" min-width="100" fixed >
                    <template slot-scope="scope">
                        {{scope.row.useRate | formatNum}}
                    </template>
                </el-table-column>
                <el-table-column prop="consumeAmount" label="带动消费额" min-width="100" >
                    <template slot-scope="scope">
                        {{scope.row.consumeAmount | formatNum}}
                    </template>
                </el-table-column>
                <el-table-column prop="consumeOrders" label="带动销售单量" min-width="100">
                    <template slot-scope="scope">
                        {{scope.row.consumeOrders | formatNum(0)}}
                    </template>
                </el-table-column>
                <el-table-column prop="unitPrice" label="客单价" min-width="100" >
                     <template slot-scope="scope">
                        {{scope.row.consumeOrders | formatNum}}
                    </template>
                </el-table-column>
                <el-table-column prop="budgetTicketCost" label="发放票劵成本" min-width="120" >
                     <template slot-scope="scope">
                        {{scope.row.consumeOrders | formatNum}}
                    </template>
                </el-table-column>
                <el-table-column prop="useTicketCost" label="使用票劵成本" min-width="120" >
                     <template slot-scope="scope">
                        {{scope.row.consumeOrders | formatNum}}
                    </template>
                </el-table-column>
                <el-table-column prop="memberUserCounts" label="参与会员数量" min-width="100" >
                    <template slot-scope="scope">
                        {{scope.row.consumeOrders | formatNum(0)}}
                    </template>
                </el-table-column>
                <el-table-column prop="memberConsumePer" label="会员消费占比" min-width="100" >
                     <template slot-scope="scope">
                        {{scope.row.consumeOrders | formatNum}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
      </div>
    </div>
</template>
<script>
import Global from "../../../../util/global.js";
import TargetLabel from "../../../partical/targetLabel";
export default {
    props:['allData'],
    components:{TargetLabel},
    watch:{
        allData(){
            this.$set(this.lineData,'rows',this.allData[this.targetType]);
            let len = this.allData[this.targetType].length;
            let num = 0;
            if(len>20){
                num = 20;
            }else{
                num = 0;
            }
            this.$set(this.lineExtend,'xAxis.0.axisLabel.interval',num)
        }
    },
    data(){
        return {
            isLine:true,
            tableData:[],
            targetType:'ffsl',
            trendTargetLabel:[
                {id:'ffsl',name:'发放数量'},
                {id:'sysl',name:'使用数量'},
                {id:'syl',name:'使用率'},
                {id:'ddxfe',name:'带动消费额'},
                {id:'ddxfdl',name:'带动消费单量'},
                {id:'kdj',name:'客单价'}
            ],
            trendOtherLabel:[ 
                {id:'yspqcb',name:'发放票劵成本'},
                {id:'sypqcb',name:'使用票劵成本'},
                {id:'cyhysl',name:'参与会员数量'},
                {id:'hyxfzb',name:'会员消费占比'}
            ],
            // 指标趋势
            lineData: {
                columns: ["name", "value"],
                rows: []
            },
            // 指标趋势/折线图设置
            lineSettings: {
                itemStyle: {
                    color: "#3B74FF" // 折线点颜色
                },
                lineStyle: {
                    color: "#3B74FF"
                }
            },
            // 指标趋势/折线图扩展
            lineExtend: {
                "xAxis.0.axisLabel.rotate": 45,
                "xAxis.0.axisLabel.interval": 0,
                tooltip: {
                    formatter: params => {
                        let date = params[0].name;
                        let value = this.formatNum(params[0].value[1]);
                        let str = date + "<br>" + value;
                        return str;
                    }
                }
            },
        }
    },
    filters:{
        formatNum(value,count){
            return Global.formatNum(value,count)
        }
    },
    methods:{
        changeType(id){
            console.log(456)
            this.targetType = id
            this.$set(this.lineData,'rows',this.allData[id])
        },
        getOut(){
            this.$emit('getOut')
        },
        formatNum(value){
            return Global.formatNum(value)
        }
    }
}
</script>

