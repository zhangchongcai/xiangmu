<template>
    <div class="reset-target-dialog">
        <el-dialog :visible="show" title="选择竞对影院" class="reset-fix-dialog"
        :before-close="handleClose">
           <div class="content">
               <div class="search">
                   <label>
                       竞对范围：
                        <el-select size="small" v-model="distance">
                            <el-option v-for="(item,index) in distanceRange" :key="index"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select>
                   </label>
                    <label style="margin-left:24px;">
                       影院名称：
                        <el-input size="small" style="width:160px" v-model="cinemaName"></el-input>
                   </label>
                   <el-button style="margin-left:24px" type="primary" size="small" @click="search">搜索</el-button>
               </div>
               <div class="select-wrap flex">
                    <div class="select none-border-table">
                       <el-table  :data="cinemaList"   @selection-change="handleSelectionChange">
                            <el-table-column type="selection"></el-table-column>
                            <el-table-column prop="competeCinemaName" label="影院名称" min-width="110"></el-table-column>
                            <el-table-column prop="competeCinemaHall" label="影厅数" min-width="60"></el-table-column>
                            <el-table-column prop="competeCinemaSeat" label="座位数" min-width="60"></el-table-column>
                            <el-table-column prop="adress" label="地址"  min-width="120"></el-table-column>
                       </el-table>
                       <div class="reset-page" v-if="cinemaList.length > 0">  
                           <el-pagination 
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="page"
                            :page-size="pageSize"
                            layout="total, prev, pager, next,jumper"
                            :total="total">
                        </el-pagination>
                       </div>
                    </div>
                    <div class="selected">
                        <div  class="title flex">
                            <div>已选竞对({{selectedList.length}})</div>
                            <div class="text-blue cursor" @click="clearSelected">清空</div>
                        </div>
                        <div class="item flex" v-for="(item,index) in selectedList" :key="index">
                            <div> {{item.competeCinemaName}}</div>
                           <div><i class="el-icon-close" @click="deleteSelected(item.id)"></i></div>
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
            pageSize:10,
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
                this.cinemaList = res.list
            })
        },
        // 搜索
        search(){
            this.getCompeteList()
        },
        deleteSelected(id){
            this.selectedList.forEach((item,index)=>{
                if(item.id == id){
                    this.selectedList.splice(index,1)
                }
            })
        },
        // 保存
        sure(){
            let params = {
                userId:this.userId,
                cinemaCode:this.cinemaId,
                competeIds:this.selectedList.map(item=>{
                    return item.id
                })
            };
            this.$emit('addCinema',params)
        },      
         clearSelected(){
            this.selectedList = [];
        },
        handleSelectionChange(arr){
            this.selectedList = arr
        },
        handleClose(){
            this.show = false;
        },
         handleSizeChange(val) {
            this.pageSize = val;
            this.initData()
        },
        handleCurrentChange(val) {
            this.page = val;
           this.initData()
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
        .search{
            label{
                font-size:12px;
            }
        }
        .select-wrap{
            margin-top:10px;
            height:400px;
            border:1px solid #E5E5E5;
            .select{
                width:60%;
                height:400px;
                overflow: auto;
            }
            .selected{
                width:40%;
                height:400px;
                padding:10px;
                box-sizing: border-box;
                border-left:1px solid #E5E5E5;
                .title{
                    padding-left:4px;
                    padding-bottom:4px;
                    border-bottom:1px solid #F5F5F5;
                }
                .item{
                    padding:4px;
                    font-size:8px;
                    cursor:pointer;
                    &:hover{
                        background:  #F5F5F5
                    }
                }
            }
        }   
    }
    .footer{
        padding-top:10px;
        text-align:center
    }
</style>


