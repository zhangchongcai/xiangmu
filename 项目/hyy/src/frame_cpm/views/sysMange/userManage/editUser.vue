<template>
    <div class="content-wrapper">
        <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>编辑用户</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户账号" prop="loginName">
                <el-input v-model="ruleForm.loginName"  disabled></el-input>
            </el-form-item>
            <el-form-item label="用户名称" prop="fullName">
                <el-input v-model="ruleForm.fullName"></el-input>
            </el-form-item>
            <el-form-item label="用户编码" prop="empCode">
                <el-input v-model="ruleForm.empCode"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status" >
                <el-radio v-model="ruleForm.status" label="0" >启用</el-radio>
                <el-radio v-model="ruleForm.status" label="1" >禁用</el-radio>
                <el-radio v-model="ruleForm.status" label="2" >离职</el-radio>
            </el-form-item>
            <el-form-item label="所属角色" prop="rolesName">
                <el-input v-model="ruleForm.rolesName" label-width="100px" placeholder="请点击右侧选择" disabled></el-input>
                <div class="but" @click='getTree(1)'><i class="el-icon-more"></i></div>
            </el-form-item>
            <el-form-item label="所属组织" prop="orgName">
                <el-input v-model="ruleForm.orgName" label-width="100px" placeholder="请点击右侧选择" disabled></el-input>
                <div class="but" @click='getTree(2)'><i class="el-icon-more"></i></div>
            </el-form-item>
            <el-form-item label="数据权限" prop="deptName">
                <el-input v-model="ruleForm.deptName" label-width="100px" placeholder="请点击右侧选择" disabled></el-input>
                <div class="but" @click='getTree(3)'><i class="el-icon-more"></i></div>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone" >
                <el-input v-model="ruleForm.phone" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email" >
                <el-input v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="submitForm('ruleForm')" type="primary">保存</el-button>
                <el-button @click="resetForm('ruleForm')" >取消</el-button>
            </el-form-item>
        </el-form>
        <el-dialog :title="title" :visible.sync="dialogVisible">
            <el-table
                    :row-key="getrowkey"
                    v-if="treeFlag"
                    :data="roleArr"
                    style="width: 100%"
                    ref="multipleTable"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column
                        type="selection"
                        :reserve-selection="true"
                        width="55">
                </el-table-column>
                <el-table-column
                        prop="name"
                        label="角色名称"
                >
                    <template slot-scope="scope">{{scope.row.name}}</template>
                </el-table-column>
            </el-table>
            <el-tree
                    v-else
                    :data='orgArr'
                    ref="tree"
                    @node-click="handleNodeClick"
                    node-key="id"
                    default-expand-all
                    :expand-on-click-node="false"
                    :highlight-current="true"
                    :props="defaultProps"
            >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                <span class="org-button">
                    <i class="el-icon-menu" v-if="data.isCinema==0||data.isCinema==null"></i>
                    <i class="el-icon-document" v-else></i>
                    {{data.text}}
                  </span>
                </span>
            </el-tree>
             <!--footer 分页条 -->
            <div class="page-wrap" v-if="treeFlag">
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
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="ok">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title='数据权限' :visible.sync="dialogVisible2">
            <div class="demo-input-suffix">
                选择影院：
                <el-radio v-model="radioType" label="1" >指定影院</el-radio>
                <el-radio v-model="radioType" label="0" >指定组织节点</el-radio>
            </div>
            <el-tree
                    :data='deptArr'
                    ref="tree2"
                    node-key="id"
                    default-expand-all
                    show-checkbox
                    :expand-on-click-node="false"
                    :highlight-current="true"
                    :props="defaultProps"
            >
               <span class="custom-tree-node" slot-scope="{ node, data }">
                <span class="org-button">
                    <i class="el-icon-menu" v-if="data.isCinema==0||data.isCinema==null"></i>
                    <i class="el-icon-document" v-else></i>
                    {{data.text}}
                  </span>
                </span>
            </el-tree>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="ok2">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {editUser,orgList,roleTree,deptTree,onlyUser} from 'frame_cpm/http/interface.js'
    export default {
        name: "editUser",
        data() {
            return {
                multipleSelection: [],
                dialogVisible: false,
                roleFlag: false,
                total:null,
                //当前页
                currentPage:1,
                //当前页数大小
                pageSize:10,
                treeFlag: false,
                dialogVisible2: false,
                formLabelWidth: '100px',
                uid: '',
                roleArr: [],
                roleIds: [],
                orgArr: [],
                deptArr: [],
                orgType: '',
                radioType: 1,
                title: '',
                defaultProps: {
                    children: 'children',
                    label: 'text'
                },
                orgUid: '',
                ruleForm: {
                    loginName: '',
                    fullName: '',
                    empCode: '',
                    status: '0',
                    rolesName: '',
                    orgName: '',
                    deptName: '',
                    phone: '',
                    email: '',
                },
                deptIds: [],
                rules: {
                    loginName: [
                        { required: true, message: '请输入用户账号', trigger: 'blur' },
                        // { min: 3, max: 8, message: '长度在 3 到 7 个字符', trigger: 'blur' }
                    ],
                    fullName: [
                        { required: true, message: '请输入全称', trigger: 'blur' },
                        // { min: 3, max: 50, message: '长度在 50 个字符以内', trigger: 'blur' }
                    ],
                    empCode: [
                        { required: true, message: '请输入编码', trigger: 'blur' },
                        // { min: 3, max: 50, message: '长度在 50 个字符以内', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '请选择状态', trigger: 'blur' },
                    ],
                    rolesName: [
                        { required: true, message: '请选择角色', trigger: 'blur' }
                    ],
                    orgName: [
                        { required: true, message: '请选择组织', trigger: 'blur' }
                    ],
                    deptName: [
                        { required: true, message: '请选择数据权限', trigger: 'blur' }
                    ]
                },
                getrowkey(row) {
                  return row.id
                }
            }
        },
        created() {
            this.uid = localStorage.getItem('onlyUser')
            this.getOrgTreeList()
            this.getUser()
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let _this = this;
                        let data = {
                            user:{
                                uid: this.uid,
                                loginName: this.ruleForm.loginName,
                                fullName: this.ruleForm.fullName,
                                empCode: this.ruleForm.empCode,
                                status: this.ruleForm.status,
                                orgUid: this.orgUid,
                                orgType: this.orgType,
                                phone: this.ruleForm.phone,
                                email: this.ruleForm.email
                            },
                            roleIds: this.roleIds,
                            deptIds: this.deptIds,
                            radioType: this.radioType
                        }
                        editUser(data)
                            .then(ret => {
                                if(ret && ret.code === 200){
                                    _this.$message({
                                        message: '用户修改成功',
                                        type: 'success'
                                    });
                                    this.$router.push('index')
                                }else{
                                    _this.$message({
                                        message: ret.msg,
                                        type: 'info'
                                    });
                                }
                            }).catch( () => {
                            _this.$message({
                                message: '网络繁忙，请稍后再试',
                                type: 'info'
                            });
                        })
                    } else {
                        return false;
                    }
                });
            },
            ok() {
              this.dialogVisible = false
                if(this.treeFlag) {
                    let arr = []
                    let arrIds = []
                    this.multipleSelection.forEach(item=>{
                        arr.push(item.name)
                        arrIds.push(item.uid)
                    })
                    this.ruleForm.rolesName = arr.join('，')
                    this.roleIds = arrIds
                }
            },
            ok2() {
                let arr = this.$refs.tree2.getCheckedNodes()
                let resultArr = []
                let newArr = []
                if(this.radioType==1) {
                    arr.forEach(item=>{
                        if(item.isCinema==1) {
                            resultArr.push(item.id)
                            newArr.push(item.text)
                        }
                    })
                } else if(this.radioType==0){
                    arr.forEach(item=>{
                        if(item.isCinema==0) {
                            resultArr.push(item.id)
                            newArr.push(item.text)
                        }
                    })
                }
              if(resultArr.length==0){
                this.$message('选择有误，请重新选择')
              }else{
                this.deptIds = resultArr
                this.ruleForm.deptName = newArr.join('，')
                this.dialogVisible2 = false
              }
            },
            cancel() {
                this.dialogVisible = false
                this.dialogVisible2 = false
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.$router.push('index')
            },
            handleNodeClick(val) {
                if(val.isCinema==1){
                    this.orgType = 1
                }else{
                    this.orgType = 0
                }
                this.orgUid = val.id
                this.ruleForm.orgName = val.text
            },
            handleSelectionChange(val) {
                this.multipleSelection = val
            },
            getUser(){
                let _this = this;
                onlyUser(this.uid)
                    .then(ret => {
                        if(ret && ret.code==200){
                            this.ruleForm.loginName = ret.data.user.loginName
                            this.ruleForm.fullName = ret.data.user.fullName
                            this.ruleForm.status = ret.data.user.status.toString()
                            this.ruleForm.empCode = ret.data.user.empCode
                            this.orgUid = ret.data.user.orgUid
                            this.ruleForm.orgName = ret.data.user.organization.name
                            let arr = []
                            this.multipleSelection = ret.data.user.roles
                            this.multipleSelection.forEach(item=>{
                                this.roleIds.push(item.uid)
                                arr.push(item.name)
                            })
                            this.ruleForm.rolesName= arr.join('，')
                            this.orgType = ret.data.user.orgType.toString()
                            this.radioType = ret.data.radioType.toString()
                            this.ruleForm.phone = ret.data.user.phone
                            this.ruleForm.email = ret.data.user.email
                            let str = JSON.parse(JSON.stringify(ret.data.dataPurview))
                            let dept = []
                            let deptName = []
                            str.forEach(item=>{
                                dept.push(item.uid)
                                deptName.push(item.name)
                            })
                            this.ruleForm.deptName = deptName.join('，')
                            this.deptIds = dept
                        }
                    })
                    .catch(() => {
                    });
            },
            toggleSelection(rows) {
                if (rows) {
                  rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row,true);
                  });
                }
            },
            getTree(val) {
                if(val==1) {
                    this.dialogVisible = true
                    this.title = '选择所属角色'
                    this.treeFlag = true
                    this.getRoleTreeList()
                    this.$nextTick(()=>{
                        this.toggleSelection(this.multipleSelection)
                    })

                }else if(val==2) {
                    this.dialogVisible = true
                    this.title = '选择所属组织'
                    this.treeFlag = false
                    this.$nextTick(()=> {
                        this.$refs.tree.setCurrentKey(this.orgUid)
                    })
                }else if(val==3) {
                    this.dialogVisible = false
                    this.dialogVisible2 = true
                    this.getDeptTreeList()
                    this.$nextTick(()=> {
                        this.$refs.tree2.setCheckedKeys(this.deptIds);
                    })
                }
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
            getRoleTreeList(){
                let _this = this;
                roleTree()
                    .then(ret => {
                        if(ret && ret.code==200){
                          _this.roleArr = ret.data
                          _this.pageSize = ret.data.pageSize
                          _this.total = ret.data.total

                        }
                    })
                    .catch(() => {
                    });
            },
            getDeptTreeList(){
                let _this = this;
                deptTree()
                    .then(ret => {
                        if(ret && ret.code==200){
                            this.deptArr = ret.data
                        }
                    })
                    .catch(() => {
                    });
            },
            // 当前页改变
            handleCurrentChange(value) {
                this.currentPage = value;
                this.getRoleTreeList();
            },
            //当前页数数目改变e
            handleSizeChange(value) {
                this.pageSize = value;
                this.getRoleTreeList();
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
        .el-input {
            width: 40%;
        }
        .but {
            display: inline-block;
            width: 40px;
            height: 32px;
            border-radius: 4px;
            line-height: 32px;
            text-align: center;
            background-color: #3B74FF;
            color: #fff;

            i {
                font-size: 25px;
            }
        }
    }
</style>
