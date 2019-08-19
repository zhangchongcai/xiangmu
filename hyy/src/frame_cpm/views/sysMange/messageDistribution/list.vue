<template>
    <div class="contentCenter message-record">
        <div class="list-wrapper">
            <el-form :inline="true" :model="listQuery"  label-position="right" label-width="86px" class="demo-form-inline search-box">
                <el-form-item label="短信标题：">
                    <el-input v-model="listQuery.batchTitle"  class="wid192" placeholder="请输入你要查询的名称"></el-input>
                </el-form-item>
                <el-form-item label="发送时间：" >
                   <el-date-picker
                    v-model="value7"
                    type="daterange"
                    align="right"
                    unlink-panels
                    class="wid256"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="searchBtn" @click="getList">查询</el-button>
                </el-form-item>
            </el-form>
            <div class="content-line"></div>
            <div class="create-wrapper">
               <el-button type="primary" class="is-plain addBtn" v-auth="'system_message_distribution_add'" @click="tocreate">新建</el-button>
            </div>
            <el-table :data="recordlist" v-loading="tableLoding" :empty-text="tipMessage" stripe style="margin-bottom:16px;" class="diy-header">
                <el-table-column prop="batchNumber" label="批次"></el-table-column>
                <el-table-column prop="batchTitle" label="短信标题"></el-table-column>
                <el-table-column prop="content" label="短信内容">
                    <template slot-scope="scope">
                        <span>{{scope.row.content}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="mobileCount" label="目标人数"></el-table-column>
                <!-- <el-table-column prop="status" label="发送状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.status | stateFormat}}</span>
                    </template>
                </el-table-column> -->
                <el-table-column prop="sender" label="操作人"></el-table-column>
                <el-table-column prop="createTime" label="发送时间"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button class="table-btn-mini" type="text"  v-auth="'system_message_distribution_see'" @click="lookup(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
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
    </div>
</template>

<script>
  import {querySmsRecordBatch,querySmsTemplate,deletSmsTemplate,updateSmsTemplate,querySmsScene,resendSmsMsg} from 'frame_cpm/http/interface.js'
  export default {
    name: "messageTemplateList",
      data() {
        return {
            tableLoding: false,
            listQuery: {
                pageNum: 1,
                pageSize: 10,
                batchTitle:'',
                startDate:'',
                status:null,
                endDate:''
            },
            value7:'',
            tipMessage: "",
            editManagerDialogFormVisible:false,
            total: 1,
            listLoading: true,
            tableKey: 0,
            msgsSecne:[],
            form: {
              loginName: '',
              fullName: '',
              empcode: '',
              ruleFormstatus: '',
              rolesId: '',
              orgUid: '',
              cinemald: '',
              radioType: '',
              phone: '',
              email: ''
            },
            isEdit:true,
            xj: false,
            flag: false,
            recordlist: [],
            loginName: '',
            fullName: '',
            status: '',
            orgUid: '',
        }
    },
      created() {
          this.getList()
          this.querySmsScene()
          // localStorage.removeItem('templatedetail')
      },
      methods: {
         querySmsScene() {
          this.listLoading = true;
          // this.listQuery.sortName = 'id'
          // this.listQuery.sort = false
          let postObj = {};
          querySmsScene().then(ret => {
            this.msgsSecne = ret.data.data;
          });
        },
        lookup(obj){
          localStorage.setItem('detailDistribution',JSON.stringify(obj))
          let isJustSee = true,
          batchNumber = obj.batchNumber,
          batchTitle = obj.batchTitle
          this.$router.push({path: 'detailDistribution',query:{isJustSee,batchNumber}})
        },
        tocreate(){
          this.$router.push({path: 'sendDistribution'})
        },
        introduceSelf (opt) {
          this.editManagerDialogFormVisible = opt.dialogVisible;
        },
        editManagerDialog(data){
          this.editManagerDialogFormVisible=true
          // this.navigatorText = node.data.productVersion
        },
        closeDialog(){
          this.editManagerDialogFormVisible=false
        },
        editManager(){

        },
        getList(){
            let _this = this;
            let queryObj = this.listQuery
            queryObj.startDate=_this.value7?_this.value7[0] : ''
            queryObj.endDate=_this.value7?_this.value7[1]:''
            this.tipMessage = "数据加载中...";
            this.tableLoding = true;
            querySmsRecordBatch(queryObj)
              .then(ret => {
                this.tableLoding = false;
                if(ret&&ret.code==200){
                  // _this.pageNum = ret.data.pageNum
                  // _this.pageSize = ret.data.pageSize
                  _this.total = ret.data.total
                  if (ret.data.total == 0) {
                    this.tipMessage = "暂无数据";
                  }
                  ret.data.rows.map(item=>{
                    item.debouceSend = false
                  })
                  _this.recordlist = ret.data.rows
                }else{
                  _this.$message({
                    message:ret.msg,
                    type: 'info'
                  });
                }
              })
              .catch(() => {
                _this.$message('网络繁忙，请稍后再试')
              });
        },
        handleSizeChange (val) {
          this.listQuery.pageSize = val
          this.getList()
        },
        handleCurrentChange (val) {
          this.listQuery.pageNum = val
          this.getList()
        },
        // onSearch() {
        //     this.getList()
        // },
      },
      filters:{
          stateFormat(status) {
              if (status == 1) {
                    return '发送完成'
              }else if (status == 2) {
                    return '发送中'
              }
              // else if (status == 3) {
              //       return '发送失败'
              // }else if (status == 4) {
              //       return '已送达'
              // }
          }
      }
  }
</script>

<style  lang="scss">
.message-record{
  .search-box .el-date-editor--daterange.el-input__inner {
    width: 256px;
  }
  .el-form--inline .el-form-item{
    margin-bottom:0;
  }
  .el-input__inner{
    font-size: 12px;
  }
  .el-select .el-input .el-input__inner{
    font-size: 12px;
  }
  .el-range-editor .el-range-input{
    font-size: 12px;
  }
  .el-date-editor .el-range__icon {
    line-height: 24px;
  }
  .el-date-editor .el-range-separator {
    display: inline-block;
    height: 100%;
    padding: 0 0px;
    margin: 0;
    text-align: center;
    line-height: 32px;
    font-size: 14px;
    height: 32px;
    width: 5%;
    color: #303133;
}
}
</style>
<style  lang="scss" scoped>
.wid192{
  width:192px;
}
.wid256{
  width:256px;
}
.addBtn{
  width: 80px;
  padding-left: 0;
  padding-right: 0;
  height: 32px;
  font-size: 12px;
  border-color: #3B74FF;
  color: #3B74FF;
}
.searchBtn{
  width: 80px;
  margin-left:12px;
  height: 32px;
  font-size: 12px;
}
.contentCenter{
    height: 100%;
    .breadcrumb{
        padding:9px 0 9px 3px;
        .el-breadcrumb{
            span{
                font-size: 14px;
            }
        }
    }
    .search-box{
      padding: 24px;
      margin-bottom:10px;
      background: #f5f5f5;
    }
    .bread-crumb{
      margin-top: 8px;
      margin-bottom: 8px;
    }
    .list-wrapper{
      width: 100%;
      margin-top: 10px;
      margin-bottom: 8px;
      // border: 1px solid #ccc;
        height:100%;
      .el-table.el-table--striped{
          // border: 1px solid #e5e5e5;
          border-bottom:0;
        }
        .el-table--striped .el-table__body tr.el-table__row--striped td{
          background:#f0f0f0;
        }
        .el-table--striped .el-table__body tr.el-table__row--striped.current-row td{
          background:#e7ebff;
        }
        .el-table__body tr.current-row > td{
          background:#e7ebff;
        }
        .el-table .cell{
          padding-left: 8px;
          padding-right: 8px;
          span{
            color:#333;
            &.table-btn-mini{
              color:#3B74FF;
              cursor: pointer;
              margin-right:6px;
            }
          }
        }
        .el-table th.is-leaf{
            border-bottom: 1px solid #e5e5e5;
            border-left: 1px solid #e5e5e5;
            background: #e7ebff;
            color: #333;
        }
        .el-table td {
            border-left: 1px solid #e5e5e5;
        }
        .el-table th.is-leaf:nth-child(1), .el-table td:nth-child(1) {
            border-left: 0;
        }
        .table {
            width: 96%;
            margin: 30px auto;
        }
      .create-wrapper {
        width: 100%;
        height: 32px;
        margin-bottom: 10px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
</style>
