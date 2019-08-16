<template>
     <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>会员指标趋势
      </div>
      <div class="section-select flex">
        <div class="unit" style="margin-left:30px"></div>
        <target-label  :activeType="type" :targetLabel="targetLabel" :otherLabel="otherLabel" @getType="changeType"></target-label>
        <div>
          <i class="iconfont icon-neiye-zhexiantu cursor text-blue" @click="isLine = true"></i>
          <i class="iconfont icon-neiye-biaoge cursor text-blue" @click="isLine = false"></i>
        </div>
      </div>
      <div class="section-content">
        <ve-line
          v-if="isLine"
          :data="targetLineData"
          :legend-visible="false"
          :settings="lineSettings"
          :extend="lineExtend"
        ></ve-line>
        <div class="reset-table" v-else>
          <div style="overflow:hidden;zoom:1;margin:10px 0" class="reset-button">
            <el-button class="right" size="mini" @click="getOut">导出</el-button>
          </div>
          <el-table border :data="allData.models" height="380" class="mt10">
            <el-table-column prop="dateKey" label="日期" min-width="100" fixed></el-table-column>
            <!-- 只有选择天时才显示: 有效会员数、累计会员、已到期30会员、已到期7天会员、累计储值金额、有效会员占比 -->
            <el-table-column prop="newMember" label="新增会员数(人)" min-width="130" sortable :formatter="formatNum"></el-table-column>
            <el-table-column prop="effectiveMember" label="有效会员数(人)" min-width="130" sortable :formatter="formatNum" v-if="timeType == 'day'"> </el-table-column>
            <el-table-column prop="cumulativeMember" label="累计会员数(人)" min-width="130" sortable :formatter="formatNum" v-if="timeType == 'day'"></el-table-column>
            <el-table-column prop="coverMember" label="可转化用户数(人)" min-width="140" sortable :formatter="formatNum"></el-table-column>
            <el-table-column prop="newCardMember" label="新卡会员数(人)" min-width="130" sortable :formatter="formatNum"></el-table-column>
            <el-table-column prop="renewMember" label="续卡会员数(人)" min-width="130" sortable :formatter="formatNum"></el-table-column>
            <el-table-column prop="patchCardMember" label="补卡会员数(人)" min-width="130" sortable :formatter="formatNum"></el-table-column>
            <el-table-column prop="storeMember" label="储值会员数(人)" min-width="130" sortable :formatter="formatNum"></el-table-column>
            <el-table-column prop="expireMember30" label="已到期30天会员(人)" min-width="160" sortable :formatter="formatNum" v-if="timeType == 'day'"></el-table-column>
            <el-table-column prop="expireMember7" label="已到期7天会员(人)" min-width="150" sortable :formatter="formatNum" v-if="timeType == 'day'"></el-table-column>
            <el-table-column prop="memberCardProfit" label="会员卡费收益(元)" min-width="140" sortable :formatter="formatNum"></el-table-column>
            <el-table-column prop="memberStoreAmount" label="会员储值金额(元)" min-width="140" sortable :formatter="formatNum"></el-table-column>
            <el-table-column prop="memberConsumeAmount" label="会员消费金额(元)"  min-width="140" sortable :formatter="formatNum"></el-table-column>
            <el-table-column prop="totalStoreAmount" label="累计储值余额(元)" min-width="140" sortable :formatter="formatNum" v-if="type == 'group' && timeType == 'day'"></el-table-column>
            <el-table-column prop="memberNewCardProfit" label="会员开新卡收益(元)" min-width="150" sortable :formatter="formatNum"></el-table-column>
            <el-table-column prop="memberRenewCardProfit" label="会员续卡收益(元)" min-width="140" sortable :formatter="formatNum"></el-table-column>
            <el-table-column prop="memberPatchCardProfit" label="会员补卡收益(元)" min-width="140" sortable :formatter="formatNum"></el-table-column>
            <el-table-column prop="memberUnitPrice" label="会员客单价(元)" min-width="130" sortable :formatter="formatNum"></el-table-column>
            <el-table-column prop="memberPersonProfit" label="会员人均贡献(元)" min-width="140" sortable :formatter="formatNum"></el-table-column>
            <el-table-column prop="memberConsumePercent" label="会员消费占比(%)" min-width="140" sortable :formatter="formatNum"></el-table-column>
            <el-table-column prop="effectiveMemberRate" label="有效会员占比(%)" min-width="140" sortable :formatter="formatNum" v-if="timeType == 'day'"></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
</template>
<script>
import TargetLabel from "../../partical/targetLabel";
import Global from "../../../util/global.js";
export default {
    props:{
        allData:{
            type:Object,
        },
        targetLabel:{
            type:Array,
        },
        otherLabel:{
            type:Array,
        },
        targetType:{
            type:String,
        },
        timeType:{
            type:String,
            default:'day'
        }
    },
    components:{TargetLabel},
    data(){
        return{
            unitNum:2,
            isLine:true,
            targetLineData:{
                columns: ["name", "value"],
                rows: []
            },
            type:this.targetType,
            tableData:this.allData.models,
            lineExtend: {
                "xAxis.0.axisLabel.rotate": 45,
                tooltip: {
                    formatter: params => {
                        let date = params[0].name;
                        let value = Global.formatNum(params[0].value[1],this.unitNum)+ this.unit;
                        let str = params[0].marker + date + "<br>" + value;
                        return str;
                    }
                }
            },
            lineSettings: {
                itemStyle: {
                    color: "#3B74FF" // 折线点颜色
                },
                lineStyle: {
                    color: "#3B74FF"
                }
            }  
        }
    },
    computed:{
        unit(){
            let type = this.type;
            if(type){
                if(Global.targetNum.includes(type)){
                    this.unitNum = 0;
                }else{
                    this.unitNum = 2;
                }
                return Global.memberTargetUnitMap[type];
            }else{
                return ''
            }
        }
    },
    watch:{
        targetType(){
            this.type = this.targetType;
        },
        allData(){
            if(this.type){
                this.$set(this.targetLineData,"rows",this.allData[this.type])
            }
        }
    },
    methods:{
        changeType(id) {
            this.type = id;
            this.targetLineData.rows = this.allData[this.type]
        },
        getOut(){
            this.$emit('getOut')
        },
        formatNum(row,column,cellValue){
            let item = column.label;
            let arr = ['新增会员数(人)','有效会员数(人)','累计会员数(人)',
            '可转化用户数(人)','新卡会员数(人)','续卡会员数(人)','补卡会员数(人)',
            '储值会员数(人)','已到期30天会员(人)','已到期7天会员(人)'];
            if(arr.includes(item)){
                return Global.formatNum(cellValue,0)
            }else{
                return Global.formatNum(cellValue)
            }
        }
    }
}
</script>

