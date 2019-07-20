<template>
    <div class="contentCenter message-record">
        <div class="list-wrapper">
            <el-form :inline="true" :model="listQuery"  size="mini" label-position="right" label-width="100px" class="demo-form-inline search-box" style="margin: 15px 0 10px 0">
                <el-form-item label="场景名称：">
                    <el-input v-model="listQuery.sceneName"  style="width:240px;" placeholder="请输入你要查询的名称"></el-input>
                </el-form-item>
                <el-form-item label="发送时间：">
                  <el-date-picker
                    style="width:280px;"
                    v-model="listQuery.value7"
                    type="daterange"
                    align="right"
                    unlink-panels
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                  >
                  </el-date-picker>
                </el-form-item>
                 <el-form-item label="短信场景：" prop="type">
                    <el-select v-model="listQuery.secne" style="width:240px;" filterable placeholder="请选择">
                       <el-option label="全部" value=''></el-option>
                        <el-option
                                v-for="item in msgsSecne"
                                :key="item.code"
                                :label="item.name"
                                :value="item.code">
                        </el-option>
                    </el-select>
                  </el-form-item>
                   <el-form-item label="发送方：" prop="type">
                    <el-select v-model="listQuery.sender" style="width:240px;" filterable placeholder="请选择">
                       <el-option label="全部" value=''></el-option>
                       <el-option
                          v-for="item in msgsSecne"
                          :key="item.code"
                          :label="item.name"
                          :value="item.code">
                        </el-option>
                    </el-select>
                  </el-form-item>
                <el-form-item label="发送状态：">
                  <el-select v-model="listQuery.status" style="width:240px;" filterable  placeholder="发送状态：">
                    <el-option label="全部" value=''></el-option>
                    <el-option label="启用" value='1'></el-option>
                    <el-option label="禁用" value='2'></el-option>
                  </el-select>  
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch">查询</el-button>
                </el-form-item>
            </el-form>
            <div class="content-line"></div>
            <div class="create-wrapper">
                <el-button type="primary" @click="tocreate">新建</el-button>
            </div>
            <el-table :data="recordlist" stripe style="margin-bottom:16px;" class="diy-header">
                <el-table-column prop="mobile" label="手机号"></el-table-column>
                <el-table-column prop="sceneName" label="场景名称"></el-table-column>
                <el-table-column prop="sender" label="发送方"></el-table-column>
                 <el-table-column prop="content" label="短信内容">
                    <template slot-scope="scope">
                        <span>{{scope.row.content}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="操作时间"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.status | stateFormat}}</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn-mini" @click="handleClick(scope.row)">查看</span>
                        <span class="table-btn-mini" @click="handleEdit(scope.row)">编辑</span>
                        <span class="table-btn-mini" v-if="scope.row.status == 1" @click="disableBtn(scope.row)">禁用</span>
                        <span class="table-btn-mini" v-if="scope.row.status == 0" @click="enableBtn(scope.row)">启用</span>
                    </template>
                </el-table-column> -->
            </el-table>
            <!-- footer 分页条 -->
            <!-- <div class="page-wrap">
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
            </div> -->
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
    import {querySmsRecord,querySmsTemplate,deletSmsTemplate,updateSmsTemplate} from 'frame_cpm/http/interface.js'
  export default {
    name: "messageTemplateList",
      // components:{
      //   'resoucedialog': resouceDialog
      // },
      data() {
        return {
            listQuery: {
                pageNum: 1,
                pageSize: 10,
                value7:'',
                sceneName: ''
            },
            bitianxiangObj:{
              menuId:null
            },
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
            start: 1,
            limit: 10,
            treeData: [],
            defaultProps: {
              children: 'children',
              label: 'text'
            }
        }
    },
      created() {
          this.getList()
          // localStorage.removeItem('templatedetail')
      },
      methods: {
        enableBtn(obj){
       let operObj = obj
          operObj.status = 1;
          delete operObj.propertyList
          updateSmsTemplate(operObj)
          .then((ret) => {
             if(ret.result){
                this.getList()
                this.success('启用成功')
              }else{
                this.error(ret.msg) // '禁用失败'
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
            querySmsRecord(queryObj)
              .then(ret => {
                if(ret&&ret.code==200){
                  debugger
                  // _this.pageNum = ret.data.pageNum
                  // _this.pageSize = ret.data.pageSize
                  // _this.total = ret.data.total
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
        onSearch() {
            this.getList()
        },
      },
      filters:{
          stateFormat(status) {
              if (status == 0) {
                    return '禁用'
              }else if (status == 1) {
                    return '启用'
              }
          }
      }
  }
</script>

<style  lang="scss">
.message-record{
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
  margin-bottom:12px;
}
}
</style>
<style  lang="scss" scoped>
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
      padding-bottom: 6px;
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
