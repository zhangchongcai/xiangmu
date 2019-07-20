<template>
    <div class="content-wrapper">
        <div class="list-wrapper">
            <div class="form">
                <el-form sizi="mini" :inline="true" :model="listQuery" class="demo-form-inline" label-width="100px">
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
                        <el-button type="primary" @click="onSearch" v-auth="'system_roleManage_view'">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="create-wrapper">
                <el-button type="primary" @click="tocreate" v-auth="'system_roleManage_add'">新建</el-button>
            </div>
            <div class="table">
                <el-table :data="rolelist" border>
                    <el-table-column prop="name" label="角色名称"></el-table-column>
                    <el-table-column prop="status" label="状态">
                        <template slot-scope="scope">
                            <span>{{scope.row.status | stateFormat}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    class="table-btn-mini"
                                    @click="handleClick(scope.row)"
                                    type="text"
                            >查看</el-button>
                            <el-button
                                    v-auth="'system_roleManage_update'"
                                    class="table-btn-mini"
                                    @click="handleEdit(scope.row)"
                                    type="text"
                            >编辑</el-button>
                            <!--<span @click="changeStatus(scope.row)" class="table-btn-mini" v-if="scope.row.platform==2" style="padding:0;margin:0;">-->
                            <!--{{scope.row.isOpen?'禁用':'启用'}}-->
                            <!--</span>-->
                            <el-button
                                    v-auth="'system_roleManage_remove'"
                                    class="table-btn-mini"
                                    @click="handleDelete(scope.row)"
                                    type="text"
                            >删除</el-button>
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
    </div>
</template>

<script>
    import {roleList,deleteRole} from 'frame_cpm/http/interface.js'
    import mixins from '../../../mixins/cacheMixin.js'
  export default {
      name: "roleMange",
      mixins: [mixins.cacheMixin],
      data() {
        return {
            cacheField: ["rolelist",'listQuery'],
            userType: '',
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
      activated() {
        this.getList()
      },
      created() {
        // this.userType = JSON.parse(localStorage.getItem('user')).userType
        this.getList()
      },
      methods: {
        tocreate(){
            this.$router.push({path: 'createRole',query:{level:'new'}})
        },
        handleEdit(data){
          console.log(data)
            localStorage.setItem('roleEdit',JSON.stringify(data))
            let isEdit = true,
            roleUid = data.uid;
            this.$router.push({path: 'editRole',query:{isEdit,roleUid}})
        },
        handleClick(data){
          console.log(data)
            localStorage.setItem('roleEdit',JSON.stringify(data))
            let isJustSee = true,
            roleUid = data.uid
            this.$router.push({path: 'seeRole',query:{isJustSee,roleUid}})
        },
        changeStatus(val) {
          let data = {
            isOpen: !val.isOpen,
            id: val.id
          }
          if(val.isOpen){
            this.$confirm(
              `确认禁用后将不可用，是否继续禁用?`,
              '提示',
              {
                confirmButtonText: '确定',
                cancelButtonText: '再想想',
                type: 'warning'
              }
            ).then(() => {
              changeHolStatus(data)
                .then(ret => {
                  if(ret && ret.code == 200){
                    this.success("禁用成功")
                    val.isOpen = false
                  }
                })
                .catch(() => {
                  this.error('失败')
                })
            })
          }else{
            changeHolStatus(data)
              .then(ret => {
                if(ret && ret.code == 200){
                  this.success("启用成功")
                  val.isOpen = true
                }
              })
              .catch(() => {
                this.error('失败')
              })
          }
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

<style  lang="scss" scoped>
.content-wrapper{
    height: 100%;
    .list-wrapper {
        .form {
            background: #f5f5f5;
            padding: 20px 0 0;
        }

        .create-wrapper {
            width: 100%;
            height: 32px;
            margin: 10px 0;
            display: flex;
            justify-content: flex-end;
            align-items: center;
        }
    }

  }
</style>
