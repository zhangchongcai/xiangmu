<template>
    <div class="page-wrapper">
        <div class="bread">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>film demo</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="list-wrapper detail">
            <div class="table">
                <el-table
                        :data="userList"
                        stripe
                        style="width: 100%">
                    <el-table-column
                            prop="loginName"
                            label="字段1"

                            >
                    </el-table-column>
                    <el-table-column
                            prop="fullName"
                            label="字段2"

                           >
                    </el-table-column>
                    <el-table-column
                            prop="phone"
                            label="字段3"

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
                        label="字段4"

                    >
                        <template slot-scope="scope">{{scope.row.organization.name}}</template>
                    </el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="scope">
                            <!-- <span @click="handleClick(scope.row)" class="table-btn-mini">查看</span>
                            <span class="table-btn-mini" @click="editUser(scope.row)">编辑</span>
                            <span class="table-btn-mini" @click="diaPwd(scope.row)">重置密码</span> -->
                            <span class="table-btn-mini" @click="chooseFilm(scope.row)">选择影片多选</span>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- footer 分页条 -->
                <div class="page-wrap">
                    <el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="currentPage"
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
        <frame-multifilm :dialogVisible="multiFilmVisible" :innerData="innerFilmData" :isListprop="true" @callBack="handleCallBack" ref='frameMultiFilm'>
            <div slot="footerId">
                <el-button @click="closeDialogFilmDialog(false)">取 消</el-button>
                <el-button type="primary" @click="confirmFilmDialog()">确 定</el-button>
            </div>
        </frame-multifilm>

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
          total: 10,
          pages: 1,
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
          // 影片复选
          multiFilmVisible: false,
          selectedFilms:[],
          innerFilmData:{},
          status: '',
          defaultProps: {
              children: 'children',
              label: 'text'
          }
      }
    },
    created() {
        this.getUserList()
    },
    methods: {
        // 影片多选
         chooseFilm(){
            this.multiFilmVisible = true
            this.$refs.frameMultiFilm.listAuthFilm()
        },
        closeDialogFilmDialog(){
            this.multiFilmVisible = false
        },
        confirmFilmDialog(){
            this.$refs.frameMultiFilm.confirmData()
        },
        handleCallBack (opt) {
            this.selectedCinemas = opt.dataList
            this.multiFilmVisible = opt.dialogVisible;
            console.log(this.selectedfilms)
        },
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
                    this.userList = ret.data.rows
                    this.total = ret.data.total
                    this.formInline.loginName = this.formInline.fullName = this.formInline.status = this.formInline.orgUid = this.formInline.orgName = ''
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
    .el-input__inner {
        width: 150px;
    }
    .el-form-item__label {
        padding: 0;
    }
    .cell span {
        color:#3b74ff;
        cursor: pointer;
    }
</style>
<style lang="scss" scoped>
    .bread {
        width: 100%;
        height: 20px;
    }
    
    .detail {
        .companySpan {
            display: inline-block;
            width: 40px;
            height: 32px;
            border-radius: 4px;
            line-height: 40px;
            text-align: center;
            background-color: #3B74FF;
            color: #fff;
            margin-top: 4px;
            i{
                font-size: 30px ;
            }
        }
        .newBuild {
            width: 100%;
            height: 60px;
            background-color: #ccc;
            border-top: #8b8b8b;
            /*display: flex;*/
            /*justify-content: space-between;*/
            /*align-items: center;*/
            /*p{*/
            /*    color: orangered;*/
            /*    margin-left: 20px;*/
            /*}*/
        }
        .table {
            width: 96%;
            margin: 30px auto;
        }
    }
    .window {
        position: fixed;
        top:0;
        left:0;
        bottom:0;
        right:0;
        background-color: rgba(204,204,204,0.9);
        z-index: 1000;
        .treeBox {
            width:500px;
            height:400px;
            background-color: #fff;
            position: absolute;
            top: 20%;
            left:30%;
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
                    &:hover{
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

</style>
