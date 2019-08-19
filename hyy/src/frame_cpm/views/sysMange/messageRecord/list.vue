<template>
    <div class="contentCenter message-record">
        <div class="list-wrapper">
            <el-form :inline="true" :model="listQuery" label-position="right" label-width="86px" class="demo-form-inline search-box" style="margin: 0 0 10px 0">
                <el-form-item label="手机号：">
                    <el-input v-model="listQuery.mobile"  class="wid192" placeholder="请输入你要查询的名称"></el-input>
                </el-form-item>
                <el-form-item label="发送批次：">
                    <el-input v-model="listQuery.batchNumber"  class="wid192" placeholder="请输入你要查询的批次"></el-input>
                </el-form-item>
                <el-form-item label="发送时间：" >
                   <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    align="right"
                    unlink-panels
                   :picker-options="pickerOptions"
                   class="wid256"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="短信场景：" prop="sceneName">
                  <el-select v-model="listQuery.sceneCode" class="wid192" filterable placeholder="请选择">
                      <el-option label="全部" value=''></el-option>
                      <el-option v-for="item in msgsSecne" :key="item.sceneCode" :label="item.sceneName" :value="item.sceneCode">
                        {{item.sceneName}}
                      </el-option>
                  </el-select>
                </el-form-item>
                   <!-- <el-form-item label="发送方：" prop="type">
                    <el-select v-model="listQuery.sender" style="width:264px;" filterable placeholder="请选择">
                       <el-option label="全部" value=''></el-option>
                       <el-option
                          v-for="item in msgsSecne"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code">
                        </el-option>
                    </el-select>
                  </el-form-item> -->
                <el-form-item label="发送状态：">
                  <el-select v-model="listQuery.status" class="wid192" filterable  placeholder="发送状态：">
                    <el-option label="全部" value=''></el-option>
                    <!-- <el-option label="发送成功" value='1'></el-option>
                    <el-option label="发送失败" value='0'></el-option>
                    <el-option label="未发送" value='2'></el-option>
                    <el-option label="已送达" value='3'></el-option> -->
                    <el-option v-for="item in sendStatuses" :key="item.status" :label="item.name" :value="item.status">
                      {{item.name}}
                    </el-option>
                  </el-select>  
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" class="searchBtn" @click="getList">查询</el-button>
                </el-form-item>
            </el-form>
            <div class="content-line"></div>
            <!-- <div class="create-wrapper">
                <el-button type="primary" @click="tocreate">新建</el-button>
            </div> -->
            <el-table :data="recordlist" :empty-text="tipMessage" stripe  v-loading="tableLoding" style="margin-bottom:16px;" class="diy-header">
                <el-table-column prop="mobile" label="手机号"></el-table-column>
                <el-table-column prop="sceneName" label="场景名称"></el-table-column>
                <el-table-column prop="sender" label="发送方"></el-table-column>
                 <el-table-column prop="batchNumber" label="发送批次"></el-table-column>
                 <el-table-column prop="content" label="短信内容">
                    <template slot-scope="scope">
                        <span>{{scope.row.content}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="操作时间"></el-table-column>
                <el-table-column prop="status" label="发送状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.status | stateFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="备注">
                  <template slot-scope="scope">
                    <span>{{scope.row.msg}}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="text" v-if="scope.row.sceneCode != 'CMC_001' && scope.row.sceneCode != 'HY_015'" class="table-btn-mini" v-auth="'system_messageRecord_retransmission'" @click="reSend(scope.row)">重发</el-button>
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
        <!-- <resoucedialog :dialogVisible="editManagerDialogFormVisible" :bitianxiang="bitianxiangObj" :isListprop="true" @introduce="introduceSelf" ref='newResouceRef' roleTitle="添加管理人">
            <div slot="footerId">
                <el-button @click="closeDialog(false)">取 消</el-button>
                <el-button type="primary" @click="confirmNewResource()">确 定</el-button>
            </div>
        </resoucedialog> -->
    </div>
</template>

<script>
    // import resouceDialog from './resouceDialog'
    import {querySmsRecord,querySmsTemplate,deletSmsTemplate,updateSmsTemplate,querySmsScene,resendSmsMsg} from 'frame_cpm/http/interface.js'
  export default {
    name: "messageTemplateList",
      // components:{
      //   'resoucedialog': resouceDialog
      // },
      data() {
        return {
          pickerOptions:{
            //日期选择问题
            onPick: ({ maxDate, minDate }) => {
     
              this.pickerMinDate = minDate.getTime();
             
              if (maxDate) {
                this.pickerMinDate = "";
              }
            },
            disabledDate: time => {
              const day30 = (30 - 1) * 24 * 3600 * 1000;
              if (this.pickerMinDate !== "") {
                
                let maxTime = this.pickerMinDate + day30;
                 let minTime = this.pickerMaxDate;
                if (maxTime > new Date()) {
                  maxTime = new Date();
                }
                return time.getTime() > maxTime;
              }
              return time.getTime() > Date.now();
            }
          },
          pickerMinDate: "",
          pickerMaxDate: "",
            listQuery: {
                pageNum: 1,
                pageSize: 10,
                mobile:'',
                batchNumber:'',
                startDate:'',
                status:null,
                endDate:''
            },
            tipMessage: "",
            dateRange:'',
            bitianxiangObj:{
              menuId:null
            },
            editManagerDialogFormVisible:false,
            total: 1,
            tableLoding: false,
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
            sendStatuses:[
                {status:0,name:'发送失败'},
                {status:1,name:'发送成功'},
                {status:2,name:'未发送'},
                {status:3,name:'已送达'}
            ]
        }
    },
      created() {
          this.getList()
          this.querySmsScene()
          this.startTime();
          // localStorage.removeItem('templatedetail')
      },
      methods: {
        startTime() {
          //默认开始时间：31天前，结束时间: 当天！
          let now = new Date();
          let startDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() -31)).toISOString().slice(0, 10);
          let endDate = new Date( Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())).toISOString().slice(0, 10);
          this.dateRange = [];
          this.dateRange.push(startDate);
          this.dateRange.push(endDate);
        },
         querySmsScene() {
          // this.listQuery.sortName = 'id'
          // this.listQuery.sort = false
          let postObj = {};
          querySmsScene().then(ret => {
            this.msgsSecne = ret.data.data;

          });
        },
        reSend(obj){
          let operObj = {}
          obj.debouceSend = true
          operObj.globalId = obj.globalId;
          operObj.msgRequestStr = obj.msgRequest;
          resendSmsMsg(operObj)
          .then((ret) => {
             if(ret.result){
                this.getList()
                this.success('重发成功')
                setTimeout(()=>{
                  obj.debouceSend = false
                },1000*60)
              }else{
                this.error(ret.msg) // '禁用失败'
                setTimeout(()=>{
                  obj.debouceSend = false
                },1000*60)
              }
          })
          .catch(() => {
             this.error('网络错误，请重试') // '禁用失败'
          })
			},
    disableBtn (obj) {
        this.$confirm(
          '确认禁用后将不可用，是否继续禁用?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '再想想',
            type: 'warning'
          }
        ).then(() => {         
          let operObj = obj
          operObj.status = 0;
          updateSmsTemplate(operObj)
            .then((ret) => {
              if(ret.result){
                this.getList()
                this.success('禁用成功')
              }else{
                this.error(ret.msg) // '禁用失败'
              }
            })
            .catch(() => {
              this.error('网络错误，请重试') // '禁用失败'
            })
        })
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
        tocreate(){
            this.$router.push({path: 'addTemplate'})
        },
        handleEdit(data){
            localStorage.setItem('detailTemplate',JSON.stringify(data))
            let isModify = true,
            id = data.id,
            sceneCode = data.sceneCode;
            this.$router.push({path: 'editTemplate',query:{isModify,id,sceneCode}})
        },
        handleClick(data){
            // localStorage.setItem('detailTemplate',JSON.stringify(data))
            let isJustSee = true,
            id = data.id,
            sceneCode = data.sceneCode,
            isModify = true;
            this.$router.push({path: 'detailTemplate',query:{isJustSee,id,isModify,sceneCode}})
        },
        editManager(){

        },
        handleDelete(data){
            let _this = this
            this.$confirm(`您确定要删除此短信模板吗? `, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
              deletSmsTemplate({id:data.id}).then(ret => {
                if(ret.result){
                  this.success(ret.msg)
                  this.getList()
                }else{
                  this.error(ret.msg)
                }
              }).catch(() => {
              });
            }).catch(() => {})

        },
        getList(){
            let _this = this;
            let queryObj = this.listQuery
            queryObj.startDate=_this.dateRange?_this.dateRange[0] : ''
            queryObj.endDate=_this.dateRange?_this.dateRange[1]:''
            this.tipMessage = "数据加载中...";
             this.tableLoding = true;
            querySmsRecord(queryObj)
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
              if (status == 2) {
                    return '未发送'
              }else if (status == 1) {
                    return '发送成功'
              }else if (status == 0) {
                    return '发送失败'
              }else if (status == 3) {
                    return '已送达'
              }
          }
      }
  }
</script>

<style  lang="scss">
.message-record{
  .search-box .el-date-editor--daterange.el-input__inner {
    width: 256px;
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
.addBtn{
  width: 80px;
  padding-left: 0;
  padding-right: 0;
  height: 32px;
  font-size: 12px;
  border-color: #3B74FF;
  color: #3B74FF;
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
      padding: 20px 24px;
      background: #f5f5f5;
    }
    .bread-crumb{
      margin-top: 8px;
      margin-bottom: 8px;
    }
    .list-wrapper{
      width: 100%;
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
