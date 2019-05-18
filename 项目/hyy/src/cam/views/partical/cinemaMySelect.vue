<template>
    <div class="reset-target-dialog">
        <el-dialog :visible="show" title="选择影院" class="reset-fix-dialog"
        :before-close="handleClose">
           <div class="content">
               <div class="search">
                    <label style="margin-left:24px;">
                       影院名称：
                        <el-input size="mini" style="width:160px" palceholder="请输入影院名称" v-model="cinemaName"></el-input>
                   </label>
                   <el-button style="margin-left:24px" type="primary" size="mini" @click="search">搜索</el-button>
               </div>
               <div class="select-wrap">
                    <div class="select none-border-table">
                       <el-table :data="cinemaList">
                             <el-table-column  min-width="30" >
                                <template slot-scope="scope">
                                    <el-radio v-model="cinemaId" :label="scope.row.cinemaCode" @change="changeCinema(scope.row.cinemaName)">
                                        {{''}}
                                    </el-radio>
                                </template>
                            </el-table-column>
                            <el-table-column prop="cinemaName" label="影院名称" min-width="60" >
                            </el-table-column>
                            <el-table-column prop="cinemaCode" label="专资编码" min-width="120"></el-table-column>
                            <el-table-column prop="address" label="城市地区" min-width="140"></el-table-column>
                       </el-table>
                    </div>
                    <div class="center" style="padding:12px 0" v-if="cinemaList.length > 0">
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
    props:{},
    data(){
        return {
            userId:this.$store.state.loginUser?this.$store.state.loginUser.uid:805852,
            show:false,
            cinemaName:null,
            cinemaId:null,
            cinemaList:[],
            page:1,
            pageSize:10,
            total:null,
        }
    },
    methods:{
        // 1.查询我的影院列表
        initData(){
            let params = {
                body:{
                    userId:this.userId,
                    cinemaName:this.cinemaName,
                    pageNo:this.page,
                    pageSize:this.pageSize
                }
            }
            this.$camList.getCinemaList(params).then(response =>{
                let res = response.data;
                this.cinemaList = res.list
                this.total = res.total;
            })
        }, 
        // 搜索
        search(){
            this.initData()
        },
        // 选择影院
        changeCinema(name){
            this.cinemaName = name;
        },
        // 确定
        sure(){
            this.$emit('getList',{cinemaId:this.cinemaId,cinemaName:this.cinemaName});
            this.show = false;
        },
        // 4.取消
        handleClose(){
            this.cinemaId = null;
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
        .select-wrap{
            margin-top:10px;
            border:1px solid #E5E5E5;
            .select{
                width:100%; 
            }
        }   
    }
    .footer{
        padding-top:10px;
        text-align:center
    }
</style>


