<template>
    <div class="reset-target-dialog">
        <el-dialog :visible="show" title="选择竞对影院" width="896px"
            :before-close="handleClose"
            :close-on-click-modal="false">
            <el-row class="search-section">
                <el-col :span="8">
                    <span>竞对范围：</span> 
                    <el-select size="small" v-model="distance"
                        @change="changeRange">
                        <el-option v-for="(item,index) in distanceRange" 
                        :key="index"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :span="7">
                    <span>影院名称：</span>
                    <el-input size="small" style="width:160px" v-model="cinemaName"></el-input>
                </el-col>
                <el-col :span="2">
                    <el-button  type="primary" size="small" @click="search">搜索</el-button>
                </el-col>
            </el-row>
            <div class="select-wrap flex">
                <div class="select none-border-table">
                    <el-table  ref="multipleTable" height="366" 
                        :data="cinemaList" 
                        :row-key="rowKey" 
                        @clearSelection="clearSelection"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection"  :reserve-selection="true" ></el-table-column>
                        <el-table-column prop="competeCinemaName" label="影院名称" min-width="220"></el-table-column>
                        <el-table-column prop="competeCinemaHall" label="影厅数" min-width="60"></el-table-column>
                        <el-table-column prop="competeCinemaSeat" label="座位数" min-width="60"></el-table-column>
                        <!-- <el-table-column prop="adress" label="地址"  min-width="120"></el-table-column> -->
                    </el-table>
                    <div class="center reset-page"  style="padding:11px 0;margin:0">  
                        <el-pagination v-if="total>15"
                            layout="total,prev,pager,next"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="page"
                            :page-size="pageSize"
                            :total="total">
                        </el-pagination>
                        <span v-else-if="total>0">共{{total}}条</span>
                    </div>
                </div>
                <div class="selected">
                    <div class="title">
                        已选竞对({{selectedList.length}})
                    </div>
                    <div class="item-wrap">
                        <div class="item flex" v-for="(item,index) in selectedList" :key="index">
                        <div class="item-name"> {{item.competeCinemaName}}</div>
                        <div>
                            <i class="el-icon-close" @click="deleteSelected(item)"></i>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
           <div class="footer">
                <el-button type="primary" size="mini" @click="sure">确定</el-button>
                <el-button  size="mini" @click="handleClose">取消</el-button>
           </div>
        </el-dialog>
    </div>
</template>
<script>
export default {
    props:['cinemaId'],
    data(){
        return {
            userId:this.$store.state.loginUser?this.$store.state.loginUser.uid:805852,
            show:false,
            distance:0,
            cinemaName:null,
            page:1,
            pageSize:15,
            total:0,
            distanceRange:[{
                id:0,
                name:'不限'
            },{
                id:3,
                name:'3km'
            },{
                id:5,
                name:'5km'
            }],
            cinemaList:[],
            selectedList:[],
            selectedData:[],
        }
    },
    methods:{
        // 1.查询竞对影院（未绑定 弹窗）
        getCompeteList(){
            let params = {
            body:{
                userId:this.userId,
                cinemaCode:this.cinemaId,
                competeCinemaDistance:this.distance,
                competeCinemaName:this.cinemaName,
                pageNo:this.page,
                pageSize:this.pageSize
            }
            };
            this.$camList.getCompeteCinema(params).then(response =>{
                let res = response.data;
                this.total = res.total;
                this.cinemaList = res.list;
                // this.total = 1000;
                // this.cinemaList= [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},]
            })
        },
        // 2.搜索
        search(){
            this.page = 1;
            this.getCompeteList()
        },
        // 3.改变竞对范围
        changeRange(){
            this.getCompeteList()
        },
        //4.删除竞对影院（前端）
        deleteSelected(row){
            this.toggleSelection(row)
            this.selectedList.forEach((item,index)=>{
                if(item.id == row.id){
                    this.selectedList.splice(index,1)
                }
            })
        },
        // 每一行选中的id
        rowKey(row){
            if(row){
                return row.id;
            }
        },
        // 5.保存
        sure(){
            let params = {
                userId:this.userId,
                cinemaCode:this.cinemaId,
                competeIds:this.selectedList.map(item=>{
                    return item.id
                })
            };
            if(this.selectedList.length>0){
                this.$emit('addCinema',params)
            }
            this.handleClose()
        }, 
        // 6.选择竞对影院
        handleSelectionChange(arr){
            this.selectedList = arr;
        },
        // 7.切换选中状态
        toggleSelection(row){
            if(row){
                this.$refs.multipleTable.toggleRowSelection(row)
            }
        },
        // 8.重置数据
        handleClose(){
            this.distance = null;
            this.cinemaName = null;
            this.page = 1;
            this.show = false;
            this.selectedList = [];
            this.clearSelection();
        },
        clearSelection(){
            this.$refs.multipleTable.clearSelection();
        },
        handleSizeChange(val) {
            this.pageSize = val;
            this.getCompeteList()
        },
        handleCurrentChange(val) {
            this.page = val;
            this.getCompeteList()
        }
    }
}
</script>
<style lang="scss" scoped>
        .select-wrap{
            box-sizing: border-box;
            height:416px;
            width:856px;
            border:1px solid #E5E5E5;
            .select{
                box-sizing: border-box;
                width:512px;
                height:416px;
                overflow: auto;
            }
            .selected{
                box-sizing: border-box;
                width:344px;
                height:416px;
                overflow: auto;
                padding:10px;
                box-sizing: border-box;
                border-left:1px solid #E5E5E5;
                .title{
                    padding-left:4px;
                    padding-bottom:4px;
                    font-size:12px;
                    border-bottom:1px solid #F5F5F5;
                }
                .item-wrap{
                    height:360px;
                    overflow: auto;
                    .item{
                        padding:6px;
                        margin-top:6px;
                    
                        font-size:10px;
                        cursor:pointer;
                        &:hover{
                            background:  #F5F5F5
                        }
                        .item-name{
                            font-size:12px;
                        }
                    }
                }
            }
        }
</style>


