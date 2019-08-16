<template>
 <div class="content-wrapper distribution-page">
    <el-form ref="listQuery" :model="listQuery" label-width="124px" label-position="right" label-height='60px'>
        <div class="form-group">
            <div class="twice-item">
                <div class="child-item">
                    <el-form-item label="短信标题：">
                        <span class="normal-text">{{pageDetail.batchTitle}}</span>
                    </el-form-item>
                </div>
            </div>
            <div class="twice-item">
                <div class="child-item"> 
                    <el-form-item label="手机号：">
                        <span class="normal-text">{{pageDetail.mobiles}}</span>
                    </el-form-item>
                </div>
            </div>
            <el-form-item label="短信内容：">
                 <span class="normal-text">{{pageDetail.content}}</span>
            </el-form-item>   
            <el-form-item label="发送结果：" class="width100" prop="fullName" style="width:100%;">
                <!-- <el-select v-model="listQuery.status" style="width:180px;" filterable  placeholder="发送状态：">
                    <el-option label="全部" value=''></el-option>
                    <el-option v-for="item in sendStatuses" :key="item.status" :label="item.name" :value="item.status">
                        {{item.name}}
                    </el-option>
                </el-select>   -->
                <el-button type="primary" @click="getList" class="search-style">查询</el-button>
                <el-button plain class="chongfa"  v-auth="'system_message_distribution_retransmission'" @click="failResend">失败短信重发</el-button>
            </el-form-item>       
        </div>
        <div class="customer-list" style="margin-bottom:36px;">
            <el-table size="mini" ref="tableDataRef" :empty-text="tipMessage"  :data="tableData" key="tableDataKey" stripe fit highlight-current-row class="plan-table" style="width: 100%">
                <el-table-column label="手机号" prop="mobile" align="center"></el-table-column>
                <!-- <el-table-column prop="status" label="发送状态"  align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.status | stateFormat}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column label="发送时间" prop="createTime" align="center"></el-table-column>
            </el-table>
            <!-- footer 分页条 -->
            <div class="page-wrap">
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="listQuery.pageNum"
                        :page-sizes="[10, 25, 50, 100]"
                        :page-size="listQuery.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
      <div class="btn" style="margin-top:20px;margin-bottom:20px; text-align:center;">
        <el-button @click="out">返回</el-button>
      </div>
    </el-form>
</div>
</template>

<script>
import {querySmsRecordBatch,reSendSameContentBatchMsg,querySmsRecord} from 'frame_cpm/http/interface.js'
export default {
    name: "distributionView",
    data(){
        return{
            tipMessage: "",
            debouceSend:false,
            attachmentList: [],
            uploadValue:'',
            fileListFujian:[],
            provs:[],
            citys: [],
            areas:[],
            relatedInformations:[],
            selectProv: '',
            selectCity: '',
            tableData: [],
            listQuery:{
                status:'',      //影院状态，1营业，2测试
                pageSize:10,
                pageNum:0
            },
            total:0,
            pageDetail:{},
            sendStatuses:[
                {status:1,name:'发送完成'},
                {status:2,name:'发送中'},
                {status:0,name:'发送失败'}
            ]
        }
    },
    methods:{
        //修改保存
        resent(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let listQuery = this.listQuery;
                    this.$api.createConsumerPost(listQuery)
                    .then( data => {
                        console.log(data)
                        if (data && data.code === 200) {
                            this.success('操作成功')
                        } else {
                            this.error('操作失败')
                        }
                    }).catch( err => {
                        console.log(err)
                    })
                } else {
                    return false;
                }
            });
        },
        //
        async getInfo(){
            let params =  {batchNumber: this.$route.query.batchNumber,batchTitle:this.$route.query.batchTitle}
            this.tipMessage = "数据加载中...";
            let res = await querySmsRecordBatch(params)
            if(res.result){
                this.pageDetail = res.data.rows[0];
                let batchNumber = this.$route.query.batchNumber;
                let postParams = {batchNumber: this.$route.query.batchNumber}
                let resData =  await querySmsRecord(postParams)
                if(resData.result){
                    let mobilesArr = resData.data.rows.map(item=>item.mobile)
                    this.pageDetail.mobiles = mobilesArr.join(',')
                    this.tableData = resData.data.rows;
                    this.total = resData.data.total
                    this.tipMessage = "暂无数据";
                    if (resData.data.total == 0) {
                        this.tipMessage = "暂无数据";
                    }
                }
                //     querySmsRecord({batchNumber:batchNumber})
                //     .then((ret)=> {
                //         if(ret.data){
                //             this.pageDetail = ret.data.rows;
                //         }
                //     }).catch(function (error) {
                //         console.log(error);
                //     });
                   
                }
           
          
        },
        getList(){
            this.tipMessage = "数据加载中...";
            let params =  {status: this.listQuery.status,batchNumber:this.$route.query.batchNumber}
            querySmsRecord(params)
            .then((resData)=> {
                if(resData.data){
                    this.tipMessage = "暂无数据";
                    if (resData.data.total == 0) {
                        this.tipMessage = "暂无数据";
                    }
                    let mobilesArr = resData.data.rows.map(item=>item.mobile)
                    this.pageDetail.mobiles = mobilesArr.join(',')
                    this.tableData = resData.data.rows;
                }
            }).catch(function (error) {
                console.log(error);
            });
           
        },
        async failResend(){
            setTimeout(()=>{
                this.debouceSend = true
            },1000*60)
            let params =  {batchNumber: this.$route.query.batchNumber}
            let res = await reSendSameContentBatchMsg(params)
            if(res.result){
                this.debouceSend = false
                this.success('失败短信重发成功')
            } else {
                this.debouceSend = false
                this.error(res.msg)
            }
        },
        //取消退出
        out(){
            this.$store.commit("tagNav/removeTagNav", this.$route)
            this.$router.push('/sys/message/distribution');
        },
        handleSizeChange (val) {
          this.listQuery.pageSize = val
          this.getList()
        },
        handleCurrentChange (val) {
          this.listQuery.pageNum = val
          this.getList()
        },
    },
    created(){
        this.getInfo();
    },
    filters:{
        stateFormat(status) {
            if (status == 1) {
                return '发送完成'
            }else if (status == 2) {
                return '发送中'
            }else if (status == 0) {
                return '发送失败'
            }
            // else if (status == 3) {
            //       return '发送失败'
            // }else if (status == 4) {
            //       return '已送达'
            // }
        },
        isDefaultFilter(value){
            switch (value){
                case true:
                    return '是';
                    break;
            }
            
        }
    }
}
</script>
<style lang="scss">
.distribution-page{
    .normal-text{
        font-size: 12px;
    }
    .el-select-dropdown__item{
        font-size: 12px!important;
    }
    .el-select{
        .el-input__inner{
            font-size: 12px;
        }
    }
    .el-form-item__label{
        line-height: 18px;
    }
    .el-form-item__content{
        line-height: 18px;
    }
}
</style>

<style  lang='scss' scoped>
.el-button.chongfa {
    border: 1px solid #3b74ff;
    color: #3b74ff;
    height: 32px;
    width: 104px;
    padding: 0;
}
.search-style{
    margin-left:8px;
}
.normal-text{
    color: #666;
}
.need-enclosure{
    height: 24px;
    .preview{
        color: #606266;
        &:hover{
            color: #3b74ff;
        }
    }
}
.form-group{
    //  width: calc(100% - 120px);
    .twice-item {
        display: flex;
        .child-item-left{
            flex:0 0 540px;
        }
        .child-item-right{
            flex:1;
        }
    }
    .el-upload__tip{
        display: inline-block;
        margin-left:12px;
    }
}
    .customer-detail{
        width: calc(89%);
        .el-form-item__label{font-size: 12px}
        .el-radio__label{font-size: 12px;}
        .el-input.is-disabled .el-input__inner{
            border:0;
            background: transparent;
            color: #333;
        }
    }
    .customer-detail .el-breadcrumb  {
            margin: 30px 0 20px 30px;
        }
    .customer-detail .form_left{
        float: left;
    }
    .customer-detail .el-form-item {
        //input的
        margin: 5px
    }
    .form-group .el-form-item__content {
        width: 300px
    }
    .form-group .el-form-item.width100 .el-form-item__content {
        width: calc(100% - 132px);
    }
    .form-group .el-form-item.width100per .el-form-item__content {
        width: calc(100% - 120px);
    }
    .cinema-edit .btn{
        text-align: center;
    }
    .cinema-edit .el-form-item__error{
        width: 100px;
        top: 10px;
        left: 316px;
    }
    .customer-list {
        .el-form-item__content{
            margin:0 !important;
        }
    }
</style>