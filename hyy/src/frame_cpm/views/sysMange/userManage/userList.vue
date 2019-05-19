<template>
    <div class="content-wrapper">
        <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>用户授权</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="list-wrapper">
            <div class="form">
                <el-form :inline="true" :model="formInline">
                    <el-form-item label="用户账号：" prop="loginName">
                        <el-input v-model="formInline.loginName"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名称："  prop="fullName">
                        <el-input v-model="formInline.fullName"></el-input>
                    </el-form-item>
                    <el-form-item label="状态：" prop="status">
                        <el-select v-model="formInline.status" placeholder="请选择" @change="chooseStatus">
                            <el-option
                                    v-for="item in statusArr"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="所属组织：" style="margin: 0px !important;">
                        <el-input v-model="formInline.orgName" disabled></el-input>
                        <i class="el-icon-close" style="top: 11px;right: 4px;position: absolute;font-weight: bolder;color:red;font-size: large" @click="formInline.orgName=''"></i>
                    </el-form-item>
                    <el-form-item style="margin: 0px !important;">
                        <div class="companySpan" @click='dialogVisible=true'>
                            <i class="el-icon-more"></i>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">查询</el-button>
                    </el-form-item>
                    <el-form-item style="float: right">
                        <el-button  type="primary" @click="to">新建</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div class="table">
                <el-table
                        :data="userList"
                        stripe
                        style="width: 100%">
                    <el-table-column
                            prop="loginName"
                            label="用户账号"

                            >
                    </el-table-column>
                    <el-table-column
                            prop="fullName"
                            label="用户名称"

                           >
                    </el-table-column>
                    <el-table-column
                            prop="phone"
                            label="手机号码"

                            >
                    </el-table-column>
                    <el-table-column
                        prop="status"
                        label="状态"

                    >
                        <template slot-scope="scope">{{scope.row.status==0?'启用':scope.row.status==1?'禁用':'离职'}}</template>
                    </el-table-column>
                    <el-table-column
                        prop="organization"
                        label="所属部门"

                    >
                        <template slot-scope="scope">{{scope.row.organization.name}}</template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <el-button @click="handleClick(scope.row)" type="text">查看</el-button>
                            <el-button @click="editUser(scope.row)" type="text">编辑</el-button>
                            <el-button  @click="diaPwd(scope.row)" type="text">重置密码</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- footer 分页条 -->
                <div class="page-wrap">
                    <el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            :page-sizes="[10, 25, 50, 100]"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <el-dialog title="选择组织" :visible.sync="dialogVisible">
            <el-tree
                    :data='orgArr'
                    ref="tree"
                    @node-click="handleNodeClick"
                    node-key="code"
                    default-expand-all
                    :highlight-current="true"
                    :props="defaultProps"
            >
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
                title="提示"
                :visible.sync="resetVisible"
                width="30%"
               >
            <i class="el-icon-warning" style="font-size: 30px; color:#3B74FF;"></i>
            <span>确定重置此员工密码？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="resetVisible = false">取 消</el-button>
                <el-button type="primary" @click="resetPwd" >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {userList,resetPassword,orgList} from 'frame_cpm/http/interface.js'
  export default {
    name: "userList",
    data() {
      return {
          statusArr: [{
              value: '0',
              label: '启用'
            }, {
              value: '1',
              label: '禁用'
            }, {
              value: '2',
              label: '离职'
          }],
          //总数
          total:1,
          //当前页
          currentPage:1,
          //当前页数大小
          pageSize:10,
          orgTreeList: [],
          formInline: {
              loginName: '',
              fullName: '',
              status: '',
              orgUid: '',
              orgName: ''
          },
          orgArr: [],
          userList: [],
          dialogVisible: false,
          resetVisible: false,
          status: '',
          defaultProps: {
              children: 'children',
              label: 'text'
          }
      }
    },
    created() {
        this.getUserList()
        this.getOrgTreeList()
    },
    methods: {
        to() {
          this.$router.push('newUser')
        },
        editUser(val) {
            this.$router.push('editUser')
            localStorage.setItem('onlyUser',val.uid)
        },
        diaPwd(val) {
            this.resetVisible = true
            this.uid = val.uid
        },
        resetPwd() {
            let _this = this;
            resetPassword(this.uid)
                .then(ret => {
                    if(ret && ret.code==200){
                        this.resetVisible = false
                        this.uid = ''
                        _this.$message({
                            message: '重置密码成功',
                            type: 'success'
                        });
                    }
                })
                .catch(() => {
                });
        },
        chooseStatus(val) {
            this.statusArr.map((s,index)=>{
                if(s.value === val){
                    this.status = this.statusArr[index].value
                }
            })
        },
        getUserList(){
              let _this = this;
              let params = {
                  pageNum: this.currentPage,
                  pageSize: this.pageSize,
                  loginName: this.formInline.loginName,
                  fullName: this.formInline.fullName,
                  status: this.status,
                  orgUid: this.formInline.orgUid,
              }
              userList(params)
              .then(ret => {
                if(ret && ret.code==200){
                  _this.pageNum = ret.data.pageNum
                  _this.pageSize = ret.data.pageSize
                  _this.total = ret.data.total
                  _this.userList = ret.data.rows
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
        getOrgTreeList(){
            let _this = this;
            orgList()
                .then(ret => {
                    if(ret && ret.code==200){
                        this.orgArr = ret.data
                    }
                })
                .catch(() => {
                });
        },
        handleNodeClick(val) {
            this.formInline.orgUid = val.id
            this.formInline.orgName = val.text
        },
        handleClick(val) {
            localStorage.setItem('usDetail_uid',val.uid)
            this.$router.push('userDetail')

        },
        onSubmit() {
            this.getUserList()
        },
        //当前页改变
        handleCurrentChange(value) {
            this.currentPage = value;
            this.getUserList();
        },
        //当前页数数目改变e
        handleSizeChange(value) {
            this.pageSize = value;
            this.getUserList();
        },
    }
  }
</script>
<style lang="scss" scoped>
    .content-wrapper {
        height: 100%;
        .breadcrumb {
            padding: 9px 0 9px 3px;

            .el-breadcrumb {
                span {
                    font-size: 14px;
                }
            }
        }
        .list-wrapper {
            .el-form--inline .el-form-item {
                margin-right: 5% !important;
            }
            .companySpan {
                width: 40px;
                height: 32px;
                border-radius: 4px;
                line-height: 40px;
                text-align: center;
                background-color: #3B74FF;
                color: #fff;
                margin-top: 4px;

                i {
                    font-size: 30px;
                }
            }

            .newBuild {
                width: 100%;
                height: 60px;
                background-color: #ccc;
                border-top: #8b8b8b;
            }

            .table {
                width: 96%;
                margin: 30px auto;
            }
            .form{
                width:100%;
                margin:10px 0 10px 10px;
            }
        }
        .window {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background-color: rgba(204, 204, 204, 0.9);
            z-index: 1000;

            .treeBox {
                width: 500px;
                height: 400px;
                background-color: #fff;
                position: absolute;
                top: 20%;
                left: 30%;
                border-radius: 2%;

                .title {
                    font-size: 20px;
                    text-align: left;
                    text-indent: 20px;
                    line-height: 40px;
                    color: #8b8b8b;

                    i {
                        display: inline-block;
                        float: right;
                        font-size: 20px;
                        font-weight: bolder;
                        margin: 10px;

                        &:hover {
                            color: red;
                            font-size: 25px;
                        }
                    }
                }

                .border {
                    width: 100%;
                    height: 1px;
                    background-color: #ccc;
                    margin: 6px 0;
                }

                .message {
                    width: 90%;
                    height: 60%;
                    overflow-y: scroll;
                    border: 1px solid #91bbe9;
                    margin: 20px auto;

                }

                .btn {
                    width: 90%;
                    display: flex;
                    justify-content: flex-end;
                    margin: 20px auto;

                }
            }

        }
    }
</style>
