<template>
    <div class="content-wrapper">
        <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统管理</el-breadcrumb-item>
                <el-breadcrumb-item>角色管理</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="list-wrapper">
            <el-form :inline="true" :model="listQuery" class="demo-form-inline" style="margin: 15px 0 0 15px">
                <el-form-item label="角色名称：">
                    <el-input v-model="listQuery.name" placeholder="请输入你要查询的名称"></el-input>
                </el-form-item>
                <el-form-item label="状态：">
                    <el-select v-model="listQuery.status" filterable placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="启用" value="1"></el-option>
                        <el-option label="禁用" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSearch">查询</el-button>
                </el-form-item>
            </el-form>
            <div class="content-line"></div>
            <div class="create-wrapper">
                <el-button style="margin-right: 10px;" type="primary" @click="tocreate">新建</el-button>
            </div>
            <el-table :data="rolelist" stripe style="width: 98%;margin-left:1%;" class="diy-header">
                <el-table-column prop="name" label="角色名称"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope">
                        <span>{{scope.row.status | stateFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <span class="table-btn-mini" @click="handleClick(scope.row)">查看</span>
                        <span class="table-btn-mini" @click="handleEdit(scope.row)">编辑</span>
                        <span class="table-btn-mini" @click="handleDelete(scope.row)">删除</span>
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
    import {roleList,deleteRole} from 'frame_cpm/http/interface.js'
  export default {
    name: "roleMange",

      data() {
        return {
            detailFlag:false,
            listQuery: {
                pageNum: 1,
                pageSize: 10,
                name: '',
                status:''
            },
            bitianxiangObj:{
              menuId:null
            },
            editManagerDialogFormVisible:false,
            total: 1,
            listLoading: true,
            tableKey: 0,
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
            rolelist: [],
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

      },
      methods: {
        tocreate(){
            this.$router.push({path: 'createRole',query:{level:'new'}})
        },
        handleEdit(data){
            localStorage.setItem('roleEdit',JSON.stringify(data))
            let isEdit = true,
            roleUid = data.uid;
            this.$router.push({path: 'editRole',query:{isEdit,roleUid}})
        },
        handleClick(data){
            localStorage.setItem('roleEdit',JSON.stringify(data))
            let isJustSee = true,
            roleUid = data.uid
            this.$router.push({path: 'seeRole',query:{isJustSee,roleUid}})
        },
        goBack() {
            this.detailFlag = false
            this.$router.push('index')

        },
        handleDelete(data){
            let _this = this
            this.$confirm(`您确定要删除此角色吗? `, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
              deleteRole({uid:data.uid}).then(ret => {
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
            roleList(queryObj)
              .then(ret => {
                if(ret&&ret.code==200){
                  _this.pageNum = ret.data.pageNum
                  _this.pageSize = ret.data.pageSize
                  _this.total = ret.data.total
                  _this.rolelist = ret.data.rows
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
.content-wrapper{
    height: 100%;
    .breadcrumb{
        padding:9px 0 9px 3px;
        .el-breadcrumb{
            span{
                font-size: 14px;
            }
        }
    }

    .list-wrapper{
      width: 100%;
      margin-top: 10px;
      margin-bottom: 8px;
      border: 1px solid #ccc;
        height:100%;
      .el-table.el-table--striped{
          border: 1px solid #e5e5e5;
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
