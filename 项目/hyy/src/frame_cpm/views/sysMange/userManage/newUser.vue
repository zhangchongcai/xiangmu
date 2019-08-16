<template>
    <div class="content-wrapper">
        <div class="list-wrapper">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="90px" style="margin-top: 1px">
                <el-form-item label="用户账号：" prop="loginName">
                    <el-input v-model="ruleForm.loginName"></el-input>
                </el-form-item>
                <el-form-item label="用户名称：" prop="fullName">
                    <el-input v-model="ruleForm.fullName"></el-input>
                </el-form-item>
                <el-form-item label="用户编码：" prop="empCode">
                    <el-input v-model="ruleForm.empCode"></el-input>
                </el-form-item>
                <el-form-item label="状态：" prop="status" >
                    <el-radio v-model="ruleForm.status" label="0" >启用</el-radio>
                    <el-radio v-model="ruleForm.status" label="1" >禁用</el-radio>
                    <el-radio v-model="ruleForm.status" label="2" >离职</el-radio>
                </el-form-item>
                <el-form-item label="用户属性：" prop="attributeType">
                    <el-select v-model="ruleForm.attributeType" placeholder="请选择">
                        <el-option
                                v-for="item in attributeArr"
                                :key="item.propertyCode"
                                :label="item.propertyName"
                                :value="item.propertyCode"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="所属角色：" prop="rolesName" >
                    <div class="box">
                        <ul class="tool" v-if="multipleSelection.length">
                            <i class="el-icon-close" style="top: -27px;left:300px;position: absolute;font-weight: bolder;color:#3b74ff;font-size: medium" @click="clear(1)"></i>
                            <li v-for="(item,id) in multipleSelection" :key="id">{{item.name}}</li>
                        </ul>
                        <el-input
                                style="width:100%"
                                disabled
                                placeholder="请点击右侧选择"
                                v-model="ruleForm.rolesName">
                        </el-input>
                    </div>
                    <el-button type="primary" @click='getTree(1)' plain style="top: 6px;left: 365px;position: absolute;">
                        选择
                    </el-button>
                </el-form-item>
                <el-form-item label="所属组织：" prop="orgName">
                    <div class="box">
                        <ul class="tool" v-if="ruleForm.orgName">
                            <i class="el-icon-close" style="top: -27px;left:300px;position: absolute;font-weight: bolder;color:#3b74ff;font-size: medium" @click="clear(2)"></i>
                        </ul>
                        <el-input
                                style="width:100%"
                                disabled
                                placeholder="请点击右侧选择"
                                v-model="ruleForm.orgName">
                        </el-input>
                    </div>
                    <el-button type="primary" @click='getTree(2)' plain style="top: 6px;left: 365px;position: absolute;">
                        选择
                    </el-button>
                </el-form-item>
                <el-form-item label="数据权限：" prop="deptName">
                    <div class="box">
                        <ul class="tool" v-if="deptNameArr.length">
                            <i class="el-icon-close" style="top: -29px;left:300px;position: absolute;font-weight: bolder;color:#3b74ff;font-size: large" @click="clear(3)"></i>
                            <li v-for="(item,id) in deptNameArr" :key="id">{{item.text}}</li>
                        </ul>
                        <el-input
                                style="width:100%"
                                disabled
                                placeholder="请点击右侧选择"
                                v-model="ruleForm.deptName">
                        </el-input>
                    </div>
                    <el-button type="primary" @click='getTree(3)' plain style="top: 6px;left: 365px;position: absolute;">
                        选择
                    </el-button>
                </el-form-item>
                <el-form-item label="手机号码：" prop="phone">
                    <el-input v-model="ruleForm.phone" placeholder="此手机号作为验证码登录方式使用"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" prop="email" >
                    <el-input v-model="ruleForm.email"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                    <el-button @click="resetForm('ruleForm')">取消</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="diaWindow">
            <el-dialog :title="title" :visible.sync="dialogVisible"  width="448px" lock-scroll>
                <div class="divider"></div>
                <el-table
                        height="350"
                        v-if="treeFlag"
                        :data="roleArr"
                        ref="multipleTable"
                        :row-key="getrowkey"
                        @selection-change="handleSelectionChange"
                >
                    <el-table-column
                            width="50"
                            :reserve-selection="true"
                            type="selection">
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
                        ref="tree1"
                        @node-click="handleNodeClick"
                        node-key="id"
                        default-expand-all
                        :expand-on-click-node="false"
                        :highlight-current="true"
                        :props="defaultProps"
                >
                     <span class="custom-tree-node" slot-scope="{ node, data }">
                      <span class="org-button">
                          <i
                               class="iconfont"
                               :class="{'icon-neiye-zongbu':data.text == '总部','icon-neiye-zuzhi':data.isCinema == 0,'icon-neiye-quyu':data.isCinema == 1}"
                          >
                              {{data.text}}
                          </i>
                      </span>
                    </span>
                </el-tree>
                <!-- footer 分页条 -->
                <div class="page-wrap" v-if="treeFlag">
                    <el-pagination
                            background
                            :pager-count="5"
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="currentPage"
                            :page-size="pageSize"
                            layout="total, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </div>
                <div class="divider"></div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="ok">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </el-dialog>
            <el-dialog title='数据权限' :visible.sync="dialogVisible2" width="448px" lock-scroll>
                <div class="divider"></div>
                <div class="demo-input-suffix">
                    选择影院：
                    <el-radio v-model="radioType" label="1" @change="chooseOrg">指定影院</el-radio>
                    <el-radio v-model="radioType" label="0" @change="chooseOrg">指定组织节点</el-radio>
                </div>
                <el-tree
                        style="height:408px"
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
                          <i
                              class="iconfont"
                              :class="{'icon-neiye-zongbu':data.text == '总部','icon-neiye-zuzhi':data.isCinema == 0,'icon-neiye-quyu':data.isCinema == 1}"
                          >
                              {{data.text}}
                          </i>
                      </span>
                    </span>
                </el-tree>
                <div class="divider"></div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="ok2">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import mixins from '../../../mixins/cacheMixin.js'
    import {addUser,orgList,roleTree,deptTree,attributeType} from 'frame_cpm/http/interface.js'
    export default {
        name: "newUser",
        mixins: [mixins.cacheMixin],
        data() {
          let empCode = (rule, value, callback) => {
            let nameReg = /^[A-Za-z0-9_\-]{1,20}$/
            if(!value) {
              return callback(new Error('用户编码不能为空'));
            }else{
              if (!nameReg.test(value)) {
                callback(new Error('请输入字母或数字，长度在20个字符以内'))
              } else {
                callback()
              }
            }
          }
          let fullName = (rule, value, callback) => {
            let nameReg = /^[\u4E00-\u9FA5A-Za-z0-9`~!@#$%^&*()_+<>?:"{},.【】\\/;\-'[\]\s\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]{1,20}$/
            if(!value) {
              return callback(new Error('请输入用户名称'));
            }else{
              if (!nameReg.test(value)) {
                callback(new Error('请输入汉字，字母或数字，长度在20个字符以内'))
              } else {
                callback()
              }
            }
          }
          let loginName = (rule, value, callback) => {
            let nameReg = /^[A-Za-z0-9`~!@#$%^&*()_+<>?:"{},.【】\\/;\-'[\]\s\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]{1,20}$/
            if(!value) {
              return callback(new Error('用户账号不能为空'));
            }else{
              if (!nameReg.test(value)) {
                callback(new Error('请输入字母或数字，长度在20个字符以内'))
              } else {
                callback()
              }
            }
          }
          let phone = (rule, value, callback) => {
            let phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/
            if(value) {
              if (!phoneReg.test(value)) {
                callback(new Error('手机号格式不正确，请输入正确的手机号'))
              } else {
                callback()
              }
            }else{
              callback()
            }
          }
          let email = (rule, value, callback) => {
            let emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
            if(value){
              if (!emailReg.test(value)) {
                callback(new Error('邮箱格式有误'))
              } else {
                callback()
              }
            }else{
              callback()
            }
          }
            return {
                cacheField: ["ruleForm",'deptIds','roleIds','orgType','orgUid'],
                getrowkey(row) {
                    return row.id
                },
                roleToolTipFlag: false,
                multipleSelection: [],
                dialogVisible: false,
                total:null,
                //当前页
                currentPage:1,
                //当前页数大小
                pageSize:20,
                treeFlag: false,
                dialogVisible2: false,
                formLabelWidth: '100px',
                attributeArr: [],
                roleArr: [],
                orgArr: [],
                deptArr: [],
                orgType: '',
                radioType: '1',
                title: '',
                defaultProps: {
                    children: 'children',
                    label: 'text'
                },
                str: '',
                roleIds: [],
                ruleForm: {
                    loginName: '',
                    fullName: '',
                    empCode: '',
                    attributeType: '',
                    status: '0',
                    rolesName: '',
                    orgName: '',
                    deptName: '',
                    phone: '',
                    email: '',
                },
                orgUid: '',
                deptIds: '',
                deptNameArr: [],
                rules: {
                    loginName: [
                      { validator: loginName, required: true, trigger: 'blur' },
                    ],
                    fullName: [
                      { validator: fullName, required: true, trigger: 'blur' },
                    ],
                    empCode: [
                      { validator: empCode, required: true, trigger: 'blur' },
                    ],
                    status: [
                        { required: true, message: '请选择状态', trigger: 'blur' },
                    ],
                    attributeType: [
                        { required: true, message: '请选择用户属性', trigger: 'blur' },
                    ],
                    rolesName: [
                        { required: true, message: '请选择角色', trigger: 'blur' }
                    ],
                    orgName: [
                        { required: true, message: '请选择组织', trigger: 'blur' }
                    ],
                    deptName: [
                        { required: true, message: '请选择数据权限', trigger: 'blur' }
                    ],
                    phone: [
                        { validator: phone, trigger: 'blur' }
                    ],
                    email: [
                        { validator: email, trigger: 'blur' }
                    ],
                }
            }
        },
        watch:{
          multipleSelection(val) {
            if(val){
              this.roleToolTipFlag = false
            }else{
              this.roleToolTipFlag = true
            }
          }
        },
        created() {
          this.getRoleTreeList()
          this.getOrgTreeList()
          this.getDeptTreeList()
          this.getAttribute()
        },
        methods: {
          getCinema(nodes_tmp, children = 'children') {
            if (!nodes_tmp) {
              return [];
            }
            let nodes = JSON.parse(JSON.stringify(nodes_tmp));
            let r = [];
            if (Array.isArray(nodes)) {
              for (let i = 0; i < nodes.length; i++) {
                if (nodes[i].isCinema == 1) {
                  r.push(nodes[i]); // 取每项数据放入一个新数组
                }
                // if (Array.isArray(nodes[i][children]) && nodes[i][children].length > 0) {
                // 若存在children则递归调用，把数据拼接到新数组中，并且删除该children
                r = r.concat(this.getCinema(nodes[i][children], children));
                delete nodes[i][children]
                // }
              }
            }
            return r;
          },
          clear(val) {
            switch(val){
              case 1:this.ruleForm.rolesName = this.roleIds = '',this.multipleSelection = [];break;
              case 2:this.ruleForm.orgName = this.orgUid = '';break;
              case 3:this.ruleForm.deptName = this.deptIds = '',this.deptNameArr = [];break;
            }
          },
          chooseOrg(val) {
            if(val==0){
              orgList({showCinema:Boolean(false)})
                .then(ret => {
                  if(ret && ret.code==200){
                    this.deptArr = ret.data
                  } else{
                    this.error(ret.msg)
                  }
                })
                .catch(() => {
                });
            }else{
              deptTree()
                .then(ret => {
                  if(ret && ret.code==200){
                    this.deptArr = this.getCinema(ret.data,'children')
                  } else{
                    this.error(ret.msg)
                  }
                })
                .catch(() => {
                });
            }

          },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let _this = this;
                        let data = {
                            user:{
                                loginName: this.ruleForm.loginName,
                                fullName: this.ruleForm.fullName,
                                empCode: this.ruleForm.empCode,
                                status: this.ruleForm.status,
                                attributeType: this.ruleForm.attributeType,
                                orgUid: this.orgUid,
                                orgType: this.orgType,
                                phone: this.ruleForm.phone,
                                email: this.ruleForm.email
                            },
                            roleIds: this.roleIds,
                            deptIds: this.deptIds,
                            radioType: this.radioType
                        }
                        addUser(data)
                            .then(ret => {
                                if(ret && ret.code == 200){
                                    _this.$message({
                                        message: '用户新建成功',
                                        type: 'success'
                                    });
                                    this.$store.commit("tagNav/removeTagNav", this.$route)
                                    this.$router.push('index')
                                    this.ruleForm ={}
                                }else{
                                  _this.$message({
                                    message: ret.msg,
                                    type: 'info'
                                  });
                                }
                            }).catch( err => {
                                console.log(err)
                            })
                    } else {
                        return false;
                    }
                });
            },
          toggleSelection(rows) {
            if (rows) {
              rows.forEach(row => {
                this.$refs.multipleTable.toggleRowSelection(row,true);
              });
            } else {
              this.$refs.multipleTable.clearSelection();
            }
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
                    this.roleIds= arrIds
                }
            },
            ok2() {
                this.deptNameArr = this.$refs.tree2.getCheckedNodes()
                let arr = this.$refs.tree2.getCheckedNodes()
                let resultArr = []
                let newArr = []
                if(this.radioType==1) {
                    arr.forEach(item=>{
                        resultArr.push(item.id)
                        newArr.push(item.text)
                    })
                } else if(this.radioType==0){
                    arr.forEach(item=>{
                        resultArr.push(item.id)
                        newArr.push(item.text)
                    })
                }
                if(resultArr.length==0){
                  this.$message('请选择数据权限')
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
                this.$store.commit("tagNav/removeTagNav", this.$route)
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
                this.multipleSelection = val;
            },
            getTree(val) {
                if(val==1) {
                    this.dialogVisible = true
                    this.title = '选择所属角色'
                    this.treeFlag = true
                    this.toggleSelection(this.multipleSelection)
                }else if(val==2) {
                    this.dialogVisible = true
                    this.title = '选择所属组织'
                    this.treeFlag = false
                }else if(val==3) {
                    this.dialogVisible = false
                    this.dialogVisible2 = true
                }
            },
            getAttribute(){
              attributeType()
              .then(ret => {
                if(ret && ret.code==200){
                  this.attributeArr = ret.data
                }else{
                  this.error(ret.msg)
                }
              })
              .catch(() => {
              });
            },
            getOrgTreeList(){
                orgList()
                    .then(ret => {
                        if(ret && ret.code==200){
                            this.orgArr = ret.data
                        }else{
                          this.error(ret.msg)
                        }
                    })
                    .catch(() => {
                      this.error('网络错误')
                    });
            },
            getRoleTreeList(){
                let data={
                  pageNum: this.currentPage,
                  pageSize: this.pageSize,
                }
                roleTree(data)
                    .then(ret => {
                        if(ret && ret.code==200){
                            this.roleArr = ret.data.rows
                            this.currentPage = ret.data.pageNum
                            this.pageSize = ret.data.pageSize
                            this.total = ret.data.total
                        }else{
                          this.error(ret.msg)
                        }
                    })
                    .catch(() => {
                      this.error('网络错误')
                    });
            },
            getDeptTreeList(){
              deptTree()
                .then(ret => {
                  if(ret && ret.code==200){
                    this.deptArr = this.getCinema(ret.data,'children')
                  } else{
                    this.error(ret.msg)
                  }
                })
                .catch(() => {
                });
            },
            //当前页改变
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
<style lang="scss">
    .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
        background: #3B74FF !important;
        color: #fff;
    }
    .el-tree-node__content:hover {
        background-color: #3B74FF !important;
        color: #ffffff;
    }
    .el-input.is-disabled .el-input__inner {
        text-overflow: ellipsis;
    }
</style>
<style lang="scss" scoped>
    .content-wrapper {

        .el-input {
            width: 360px;
        }
        .el-input__inner{
            overflow: hidden;
            text-overflow: ellipsis;

        }
        .el-select{
            width: 360px;
        }
        .box{
            width: 360px;
            &:hover .tool{
                display: block;
            }
        }
        .tool{
            display: none;
            width: 290px;
            position:absolute;
            top:100%;
            left:38px;
            z-index: 100;
            background: rgba(0,0,0,0.8);
            color:#fff;
            border-radius: 5px 5px 5px 5px;
            li{
                height: 24px;
                line-height: 24px;
                padding-left: 10px;
            }
        }

    }

</style>
