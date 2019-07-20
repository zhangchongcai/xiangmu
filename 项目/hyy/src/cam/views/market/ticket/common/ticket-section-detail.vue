<template>
     <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>明细列表
      </div>
      <div class="section-content">
          <div class="flex">
            <div class="reset-tab">
                <el-tabs  v-model="authorType" type="card" size="mini" @tab-click="changeAuthorType">
                    <el-tab-pane type="primary" v-for="(item,index) in tableTabs"  :key="index" :label="item.label" :name="item.name" >
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div>
                <el-button size="mini" @click="showCompar">对比</el-button>
                <el-button size="mini" @click="detailExport">导出</el-button>
            </div>
         </div>
        <div class="reset-table mt10 flex" style="position:relative">
                <el-table ref="refTable"  border
                    :height="height"
                    :data="tableData"
                    @selection-change='changeSelect' 
                    @sort-change="sortChange">
                <el-table-column  width="60" type="selection" fixed>
                </el-table-column>
                <el-table-column label="区域名称" width="120" fixed v-if="authorType == 1">
                    <template slot-scope="scope">
                        <div class="cursor" @click="goDetail({cityId:scope.row.cityId,name:scope.row.cityName,type:'city'})">
                        <span class="text-blue">{{scope.row.cityName}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="影院名称" width="120" fixed v-if="authorType == 2">
                    <template slot-scope="scope">
                        <div class="cursor" @click="goDetail({cinemaId:scope.row.cinemaId,name:scope.row.cinemaName,type:'cinema'})">
                        <span class="text-blue">{{scope.row.cinemaName}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="影片名称" width="120" fixed v-if="authorType == 3">
                    <template slot-scope="scope">
                        <div class="cursor">
                            <span class="text-blue">{{scope.row.movieName}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="useCounts" label="使用数量" min-width="100" sortable="custom">
                    <template slot-scope="scope">
                        {{scope.row.useCounts | formatNum(0)}}
                    </template>
                </el-table-column>
                <el-table-column prop="useRate" label="使用率" min-width="90" sortable>
                    <template slot-scope="scope">
                        {{scope.row.useRate | formatNum}}
                    </template>
                </el-table-column>
                <el-table-column prop="consumeAmount" label="带动消费额" min-width="120" sortable>
                    <template slot-scope="scope">
                        {{scope.row.consumeAmount | formatNum}}
                    </template>
                </el-table-column>
                <el-table-column prop="consumeOrders" label="带动销售单量" min-width="120" sortable>
                    <template slot-scope="scope">
                        {{scope.row.consumeOrders | formatNum(0)}}
                    </template>
                </el-table-column>
                <el-table-column prop="unitPrice" label="客单价" min-width="90" sortable>
                    <template slot-scope="scope">
                        {{scope.row.unitPrice | formatNum}}
                    </template>
                </el-table-column>
                <el-table-column prop="useTicketCost" label="使用票劵成本" min-width="120" sortable>
                    <template slot-scope="scope">
                        {{scope.row.useTicketCost | formatNum}}
                    </template>
                </el-table-column>
                <el-table-column prop="memberUserCounts" label="参与会员数量" min-width="120" sortable>
                    <template slot-scope="scope">
                        {{scope.row.memberUserCounts | formatNum(0)}}
                    </template>
                </el-table-column>
                <el-table-column prop="memberConsumePer" label="会员消费占比" min-width="120" sortable>
                    <template slot-scope="scope">
                        {{scope.row.memberConsumePer | formatNum}}
                    </template>
                </el-table-column>
            </el-table>
            <div v-if="isCompar" class="computed-wrap">
                <div  class="title cleafix">
                    对比区域 
                    <i class="el-icon-close close" @click="closeCompar"></i>
                </div>
                <div class="content">
                    <target-label
                        :activeType="targetType"
                        :targetLabel="trendTargetLabel" 
                        :otherLabel="trendOtherLabel" 
                        @getType="changeType">
                    </target-label>
                    <ve-line 
                        :colors="colors"
                        :data="lineData">
                    </ve-line>
                </div>
            </div>
        </div>
        <!-- 分页 -->
        <slot></slot>
      </div>
    </div>
</template>
<script>
import Global from "../../../../util/global.js";
import TargetLabel from "../../../partical/targetLabel";
export default {
    props:['tableData','orgType'],
    components:{TargetLabel},
    data(){
        this.colors = [
            "#3B74FF",
            "#FE6081",
            "#FEC107",
            "#A5F053",
            "#FE825E",
            "#8E7EFF",
            "#ca8622",
            "#bda29a",
            "#6e7074",
            "#546570",
            "#c4ccd3"
        ];
        return{
            height:null,
            targetType:'ffsl',
            code:'ffsl',
            lineData: {
                columns: ["date", "value"],
                rows: []
            },
            selectedList:null,
            isCompar:false,
            authorType:this.orgType == 'group'?"1":(this.orgType == 'city'?"2":"3"),
            authorId:null,
            tableTabs:[],
            idsMap:{
                'area':1,
                'cinema':2,
                'move':3
            },
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
        }
    },
    watch:{
        orgType(){
             if(this.orgType == 'group'){
                this.authorType = "1";
                this.tableTabs =  [
                    {label:'区域明细',name:"1"},
                    {label:'影院明细',name:"2"},
                    {label:'影片明细',name:"3"}
                ];
            }else if(this.orgType == 'city'){
                this.authorType = "2";
                this.tableTabs = [
                    {label:'影院明细',name:"2"},
                    {label:'影片明细',name:"3"}
                ];
            }else if(this.orgType == 'cinema'){
                this.authorType = "3";
                this.tableTabs = [{label:'影片明细',name:"3"}];
               
            }
        },
        tableData(){
             if(this.orgType == 'group'){
                this.tableTabs =  [
                    {label:'区域明细',name:"1"},
                    {label:'影院明细',name:"2"},
                    {label:'影片明细',name:"3"}
                ];
            }else if(this.orgType == 'city'){
                this.tableTabs = [
                    {label:'影院明细',name:"2"},
                    {label:'影片明细',name:"3"}
                ];
            }else if(this.orgType == 'cinema'){
                this.tableTabs = [{label:'影片明细',name:"3"}]; 
            }
        }
    },
    filters:{
        formatNum(value,count){
            return Global.formatNum(value,count)
        }
    },
    methods:{
        // 切换指标
        changeType(id){
            this.code = id;
            this.showCompar()
        },
        sortChange(sort){
            let orderMap = {ascending:"asc",descending:"desc"};
            let column = (sort.prop).replace(/[A-Z]/g,(match)=>{
                return '_'+ match.toLowerCase()
            })
            let params = {
                orderByColumn:column,
                sort:orderMap[sort.order],
                type:this.authorType
            };
            this.$emit('getTableData',params)
        },
        // 对比
        showCompar(){
            let ids = [];
            let selectedIds =  this.selectedList;
            if(selectedIds && selectedIds.length>0){
                if(this.authorType == 1){
                    ids = selectedIds.map(item=>{
                        return item.cityId
                    });
                }else if(this.authorType == 2){
                    ids = selectedIds.map(item=>{
                        return item.cinemaId
                    });
                }else if(this.authorType == 3){
                    ids = selectedIds.map(item=>{
                        return item.movieId
                    });
                }
                console.log(this.$refs.refTable,'ggg')
                this.height = 500;
                this.$emit('showCompar',{ids:ids,type:this.authorType,code:this.code})
            }else{
                this.$message({type:'error',message:'请选择'});
            
            }
        },
        closeCompar(){
            this.isCompar = false;
           this.height = null;
        },
        // 切换类型
        changeAuthorType(tab){
            this.authorType = tab.name;
            this.$set(this.lineData,'columns',[]);
            this.$set(this.lineData,'rows',[]);
            this.isCompar = false;
            this.$emit('getTableData',{type:this.authorType,page:1})
        },
        // 导出
        detailExport(){
            this.$emit('getOut',{type:this.authorType})
        },
        // 多选
        changeSelect(rows){
            this.selectedList = rows.slice(0);
        },
        // 详情
        goDetail(option){
            this.$emit('goDetail',option)
        }
    }
}
</script>
<style lang="scss" scoped>
    .computed-wrap{
        position: absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        margin-left:180px;
        background: #fff;
        border-left:1px solid #e5e5e5;
        border-right:1px solid #e5e5e5;
        .title{
            text-align:center;
            line-height:40px;
            background-color:#E7EBFF;
            font-size:12px;
            color:#333;
            vertical-align: middle;
            .close{
                font-size:20px;
                float:right;
                margin-right:10px;
                line-height: 40px;
            }
        }
        .content{
            margin:0 auto;
            padding:20px;
            text-align:center;
            box-sizing: border-box
        }
        
    }
</style>


