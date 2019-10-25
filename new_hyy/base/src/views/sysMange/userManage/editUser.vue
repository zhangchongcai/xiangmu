<template>
  <div class="content-wrapper">
    <div class="list-wrapper">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="94px" style="margin-top: 1px">
        <el-form-item label="用户账号：" prop="loginName">
          <el-input v-model="ruleForm.loginName" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户名称：" prop="fullName">
          <el-input v-model="ruleForm.fullName"></el-input>
        </el-form-item>
        <el-form-item label="用户编码：" prop="empCode">
          <el-input v-model="ruleForm.empCode"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio v-model="ruleForm.status" label="0">启用</el-radio>
          <el-radio v-model="ruleForm.status" label="1">禁用</el-radio>
          <el-radio v-model="ruleForm.status" label="2">离职</el-radio>
        </el-form-item>
        <el-form-item label="用户属性：" prop="attributeType">
          <el-select v-model="ruleForm.attributeType" placeholder="请选择">
            <el-option v-for="item in attributeArr" :key="item.propertyCode" :label="item.propertyName" :value="item.propertyCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属角色：" prop="rolesName">
          <div class="box">
            <ul class="tool" v-if="multipleSelection.length">
              <!--<i class="el-icon-close"
                               style="top: -26px;left: 300px;position: absolute;font-weight: bolder;color:#3b74ff;font-size: medium"
                               @click="clear(1)"></i>-->
              <li v-for="(item,uid) in multipleSelection" :key="uid">{{item.name}}</li>
            </ul>
            <el-input style="width:100%;" disabled placeholder="请点击右侧选择" v-model="ruleForm.rolesName">
            </el-input>
          </div>
          <el-button type="primary" @click='getTree(1)' plain style="height:32px;top: 5px;line-height:16px;
                               left: 365px;position: absolute;">
            选择
          </el-button>
        </el-form-item>
        <el-form-item label="所属组织：" prop="orgName">
          <div class="box">
            <ul class="tool" v-if="ruleForm.orgName">
              <!--<i class="el-icon-close"
                               style="top: -26px;left:304px;position: absolute;font-weight: bolder;color:#3b74ff;font-size: medium"
                               @click="clear(2)"></i>-->
            </ul>
            <el-input style="width:100%" disabled placeholder="请点击右侧选择" v-model="ruleForm.orgName">
            </el-input>
          </div>
          <el-button type="primary" @click='getTree(2)' plain style="height:32px;top: 5px;line-height:16px;left: 365px;position: absolute;">
            选择
          </el-button>
        </el-form-item>
        <el-form-item label="数据权限：" prop="deptName">
          <div class="box">
            <ul class="tool" v-if="deptNameArr.length">
              <!--<i class="el-icon-close"
                               style="top: -26px;left: 304px;position: absolute;font-weight: bolder;color:#3b74ff;font-size: medium"
                               @click="clear(3)"></i>-->
              <li v-for="(item,id) in deptNameArr" :key="id">{{item.text?item.text:item.name}}</li>
            </ul>
            <el-input style="width:100%;" disabled placeholder="请点击右侧选择" v-model="ruleForm.deptName">
            </el-input>
          </div>
          <el-button type="primary" @click='getTree(3)' plain style="height:32px;top: 5px;line-height:16px;left: 365px;position: absolute;">
            选择
          </el-button>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phone">
          <el-input v-model="ruleForm.phone" placeholder="此手机号作为验证码登录方式使用"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitForm('ruleForm')" type="primary">保存</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="diaWindow targetTable">
      <el-dialog v-bind="$attrs" v-on="$listeners" :title="title" :visible.sync="dialogVisible" width="892px" :close-on-click-modal="false">
        <div class="table-select p-10">
          <div class="flex-wrapper">
            <div class="table-left">
              <div class="table-content">
                <el-table v-bind="$attrs" v-on="$listeners" :row-key="getRowKey" @select="handleSelect" @select-all="handleSelect" :data="roleArr" ref="multipleTable">
                  <el-table-column :reserve-selection="true" type="selection" width="55">
                  </el-table-column>
                  <el-table-column prop="name" label="角色名称">
                    <template slot-scope="scope">{{scope.row.name}}</template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="p-t-10 b-t">
                <el-pagination class="a-c p-b-10" background @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total,prev, pager, next, jumper" :total="total">
                </el-pagination>
              </div>
            </div>
            <div class="select-wrapper">
              <div class="select-header">
                已选{{multipleSelection.length}}项
                <span @click="clearSelect">清空</span>
              </div>
              <div :key="index" v-for="(item,index) in multipleSelection" class="select-item">
                <span class="span-left">{{item.name}}</span>
                <span @click="deleteItem(index,item)" class="span-right">
                  <i class="el-icon-close btn-color"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="ok">确 定</el-button>
          <el-button @click="cancel(1)">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="diaWindow treeDialog">
      <el-dialog title='数据权限' :visible.sync="dialogVisible2" width="448px">
        <div class="divider"></div>
        <div class="content">
          <div class="demo-input-suffix">
            选择影院：
            <el-radio v-model="radioType" label="1" @change="chooseOrg">指定影院</el-radio>
            <el-radio v-model="radioType" label="0" @change="chooseOrg">指定组织节点</el-radio>
          </div>
          <el-tree style="height:408px" :data='deptArr' ref="tree2" node-key="id" default-expand-all show-checkbox :expand-on-click-node="false" :highlight-current="true" :props="defaultProps">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span class="org-button">
                <i class="iconfont" :class="{'icon-neiye-zongbu':data.text == '总部','icon-neiye-zuzhi':data.isCinema == 0,'icon-neiye-quyu':data.isCinema == 1}">
                  {{data.text}}
                </i>
              </span>
            </span>
          </el-tree>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="ok2">确 定</el-button>
          <el-button @click="cancel(2)">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <div class="diaWindow treeDialog">
      <el-dialog :title="title" :visible.sync="dialogVisible3" width="448px" @close='cancel(3)'>
        <div class="divider"></div>
        <div class="content">
          <el-tree :data='orgArr' ref="tree" @node-click="handleNodeClick" node-key="id" default-expand-all :expand-on-click-node="false" :highlight-current="true" :props="defaultProps">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span class="org-button">
                <i class="iconfont" :class="{'icon-neiye-zongbu':data.text == '总部','icon-neiye-zuzhi':data.isCinema == 0,'icon-neiye-quyu':data.isCinema == 1}">
                  {{data.text}}
                </i>
              </span>
            </span>
          </el-tree>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="ok3">确 定</el-button>
          <el-button @click="cancel(3)">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import mixins from '../../../mixins/cacheMixin.js';
import { editUser, orgList, roleTree, deptTree, onlyUser, attributeType } from 'baseSrc/http/interface.js';

export default {
  name: 'editUser',
  mixins: [mixins.cacheMixin],
  data () {
    let empCode = (rule, value, callback) => {
      let nameReg = /^[A-Za-z0-9_\-]{1,20}$/;
      if (!value) {
        return callback(new Error('用户编码不能为空'));
      } else {
        if (!nameReg.test(value)) {
          callback(new Error('请输入字母或数字，长度在20个字符以内'));
        } else {
          callback();
        }
      }
    };
    let fullName = (rule, value, callback) => {
      let nameReg = /^[\u4E00-\u9FA5A-Za-z0-9`~!@#$%^&*()_+<>?:"{},.【】\\/;\-'[\]\s\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]{1,20}$/;
      if (!value) {
        return callback(new Error('请输入用户名称'));
      } else {
        if (!nameReg.test(value)) {
          callback(new Error('请输入汉字，字母或数字，长度在20个字符以内'));
        } else {
          callback();
        }
      }
    };
    let loginName = (rule, value, callback) => {
      let nameReg = /^[A-Za-z0-9`~!@#$%^&*()_+<>?:"{},.【】\\/;\-'[\]\s\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]{1,20}$/;
      if (!value) {
        return callback(new Error('用户账号不能为空'));
      } else {
        if (!nameReg.test(value)) {
          callback(new Error('请输入字母或数字，长度在20个字符以内'));
        } else {
          callback();
        }
      }
    };
    let mobile = (rule, value, callback) => {
      let phoneReg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[01678]|18[0-9]|14[57])[0-9]{8}$/;
      if (value) {
        if (!phoneReg.test(value)) {
          callback(new Error('手机号格式有误'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    let email = (rule, value, callback) => {
      let emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (value) {
        if (!emailReg.test(value)) {
          callback(new Error('邮箱格式有误'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      getRowKey (row) {
        return row.uid;
      },
      cacheField: ['ruleForm', 'deptIds', 'roleIds', 'orgType', 'orgUid'],
      multipleSelection: [],
      dialogVisible: false,
      roleFlag: false,
      total: null,
      // 当前页
      currentPage: 1,
      // 当前页数大小
      pageSize: 10,
      treeFlag: false,
      dialogVisible2: false,
      dialogVisible3: false,
      organizationName: '',
      organizationUid: '',
      formLabelWidth: '100px',
      uid: '',
      roleArr: [],
      roleIds: [],
      orgArr: [],
      deptArr: [],
      attributeArr: [],
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
        attributeType: '',
        rolesName: '',
        orgName: '',
        deptName: '',
        phone: '',
        email: ''
      },
      deptIds: [],
      deptNameArr: [],
      rules: {
        loginName: [
          { validator: loginName, required: true, trigger: 'blur' }
        ],
        fullName: [
          { validator: fullName, required: true, trigger: 'blur' }
        ],
        empCode: [
          { validator: empCode, required: true, trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'blur' }
        ],
        attributeType: [
          { required: true, message: '请选择用户属性', trigger: 'blur' }
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
          { validator: mobile, trigger: 'blur' }
        ],
        email: [
          { validator: email, trigger: 'blur' }
        ]
      },
      selectData: [],
      removeData: []
    };
  },
  created () {
    this.uid = localStorage.getItem('onlyUser');
    this.getUser();
    this.getAttribute();
  },
  methods: {
    getCinema (nodes_tmp, children = 'children') {
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
          r = r.concat(this.getCinema(nodes[i][children], children));
          delete nodes[i][children];
        }
      }
      return r;
    },
    chooseOrg (val) {
      if (val == 0) {
        this.getOrgList();
      } else {
        this.getDeptTreeList();
      }
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let _this = this;
          let data = {
            user: {
              uid: this.uid,
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
          };
          editUser(data)
            .then(ret => {
              if (ret && ret.code == 200) {
                _this.$message({
                  message: '用户修改成功',
                  type: 'success'
                });
                this.$store.commit('tagNav/removeTagNav', this.$route);
                this.$router.push('index');
              } else {
                _this.$message({
                  message: ret.msg,
                  type: 'info'
                });
              }
            }).catch(() => {
              _this.$message({
                message: '网络繁忙，请稍后再试',
                type: 'info'
              });
            });
        } else {
          return false;
        }
      });
    },
    ok2 () {
      let arr = this.$refs.tree2.getCheckedNodes();
      let resultArr = [];
      let newArr = [];
      if (this.radioType == 1) {
        arr.forEach(item => {
          resultArr.push(item.id);
          newArr.push(item.text);
        });
        this.deptIds = resultArr;
        this.ruleForm.deptName = newArr.join('，');
        this.deptNameArr = this.$refs.tree2.getCheckedNodes();
      } else if (this.radioType == 0) {
        arr.forEach(item => {
          resultArr.push(item.id);
          if (!item.children) {
            newArr.push(item.text);
          }
        });
        this.deptIds = resultArr;
        this.ruleForm.deptName = newArr.join('，');
        this.deptNameArr = this.$refs.tree2.getCheckedNodes().filter(it => it.children == undefined);
      }
      this.dialogVisible2 = false;
    },
    ok3 () {
      this.orgUid = this.organizationUid;
      this.ruleForm.orgName = this.organizationName;
      this.dialogVisible3 = false;
    },
    cancel (val) {
      switch (val) {
        case 1:
          if (this.removeData.length) {
            this.removeData.forEach(it => {
              this.multipleSelection.push(it);
            });
          }
          if (this.selectData.length) {
            this.selectData.forEach(it => {
              let index = this.multipleSelection.findIndex(i => i.uid == it.uid);
              this.multipleSelection.splice(index, 1);
            });
          }
          this.selectData = [];
          this.removeData = [];
          this.dialogVisible = false;
          break;
        case 2:
          this.dialogVisible2 = false;
          break;
        case 3:
          this.dialogVisible3 = false;
          break;
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.$store.commit('tagNav/removeTagNav', this.$route);
      this.$router.push('index');
    },
    handleNodeClick (val) {
      if (val.isCinema == 1) {
        this.orgType = 1;
      } else {
        this.orgType = 0;
      }
      this.organizationName = val.text;
      this.organizationUid = val.id;
    },
    getUser () {
      let _this = this;
      onlyUser(this.uid)
        .then(ret => {
          if (ret && ret.code == 200) {
            this.ruleForm.loginName = ret.data.user.loginName;
            this.ruleForm.fullName = ret.data.user.fullName;
            this.ruleForm.status = ret.data.user.status.toString();
            this.ruleForm.empCode = ret.data.user.empCode;
            this.orgUid = ret.data.user.orgUid;
            this.ruleForm.orgName = ret.data.user.organization.name;
            if (ret.data.user.roles) {
              this.multipleSelection = ret.data.user.roles;
              this.roleIds = this.multipleSelection.map(it => {
                return it.uid;
              });
              this.ruleForm.rolesName = this.multipleSelection.map(it => {
                return it.name;
              }).join('，');
            }
            this.ruleForm.attributeType = ret.data.user.attributeType ? ret.data.user.attributeType.toString() : '';
            this.orgType = ret.data.user.orgType.toString();
            this.radioType = ret.data.radioType.toString();
            this.ruleForm.phone = ret.data.user.phone;
            this.ruleForm.email = ret.data.user.email;
            if (JSON.parse(JSON.stringify(ret.data.dataPurview))) {
              this.deptNameArr = JSON.parse(JSON.stringify(ret.data.dataPurview));
              this.deptIds = this.deptNameArr.map(it => {
                return it.uid;
              });
              this.ruleForm.deptName = this.deptNameArr.map(it => {
                return it.name;
              }).join('，');
            }
          }
        })
        .catch(() => {
        });
    },
    ok () {
      if (this.multipleSelection.length) {
        this.roleIds = this.multipleSelection.map(it => {
          return it.uid;
        });
        this.ruleForm.rolesName = this.multipleSelection.map(it => {
          return it.name;
        }).join('，');
        this.dialogVisible = false;
        this.selectData = [];
        this.removeData = [];
      } else {
        this.$message({
          message: '所属角色不能为空',
          type: 'info'
        });
      }
    },
    // 单一数据toggle
    rowOneToggle (row) {
      for (let index = 0; index < this.multipleSelection.length; index++) {
        if (
          row.uid == this.multipleSelection[index].uid
        ) {
          this.removeData.push(row);
          this.multipleSelection.splice(index, 1);
          return;
        }
      }
      this.multipleSelection.push(row);
      this.selectData.push(row);
    },
    // 单一数据add
    rowOneAdd (row) {
      for (let index = 0; index < this.multipleSelection.length; index++) {
        if (row.uid == this.multipleSelection[index].uid) {
          return;
        }
      }
      this.multipleSelection.push(row);
      this.selectData.push(row);
    },
    // 单一数据reomove
    rowOneRemove (row) {
      for (let index = 0; index < this.multipleSelection.length; index++) {
        if (row.uid == this.multipleSelection[index].uid) {
          this.removeData.push(row);
          this.multipleSelection.splice(index, 1);
          return;
        }
      }
    },
    // 删除
    deleteItem (index, item) {
      this.removeData.push(item);
      this.multipleSelection.splice(index, 1);
      this.$refs.multipleTable.clearSelection();
      this.rowMultipleChecked(this.multipleSelection);
    },
    // 清除
    clearSelect () {
      this.multipleSelection.forEach(it => {
        this.removeData.push(it);
      });
      try {
        this.$refs.multipleTable.clearSelection();
      } catch (error) {
        console.log(error);
      }
      this.multipleSelection = [];
    },
    handleSelect (selection, row) {
      if (row) {
        this.rowOneToggle(row);
      } else {
        if (selection.length == 0) {
          for (let index = 0; index < this.roleArr.length; index++) {
            const item = this.roleArr[index];
            this.rowOneRemove(item);
          }
        } else {
          for (let j = 0; j < selection.length; j++) {
            const selectionItem = selection[j];
            this.rowOneAdd(selectionItem);
          }
        }
      }
    },
    rowMultipleChecked (selectedArr) {
      if (selectedArr.length != 0) {
        for (let i = 0; i < selectedArr.length; i++) {
          for (let k = 0; k < this.roleArr.length; k++) {
            if (selectedArr[i].uid == this.roleArr[k].uid) {
              this.$refs.multipleTable.toggleRowSelection(
                this.roleArr[k],
                true
              );
              break;
            }
          }
        }
      }
    },
    getRoleTreeList () {
      let data = {
        pageNum: this.currentPage,
        pageSize: this.pageSize
      };
      roleTree(data)
        .then(ret => {
          if (ret && ret.code == 200) {
            this.roleArr = ret.data.rows;
            this.currentPage = ret.data.pageNum;
            this.pageSize = ret.data.pageSize;
            this.total = ret.data.total;
            this.$refs.multipleTable.clearSelection();
            this.rowMultipleChecked(this.multipleSelection);
          } else {
            this.error(ret.msg);
          }
        })
        .catch(() => {

        });
    },
    getTree (val) {
      if (val == 1) {
        this.dialogVisible = true;
        this.title = '选择所属角色';
        this.getRoleTreeList();
      } else if (val == 2) {
        this.dialogVisible3 = true;
        this.title = '选择所属组织';
        this.getOrgTreeList();
      } else if (val == 3) {
        this.dialogVisible2 = true;
        if (this.radioType && this.radioType == 0) {
          this.getOrgList();
        } else {
          this.getDeptTreeList();
        }
      }
    },
    getOrgTreeList () {
      orgList()
        .then(ret => {
          if (ret && ret.code == 200) {
            this.orgArr = ret.data;
            this.$nextTick(() => {
              this.$refs.tree.setCurrentKey(this.orgUid);
            });
          }
        })
        .catch(() => {
        });
    },
    getOrgList () {
      orgList({ showCinema: Boolean(false) })
        .then(ret => {
          if (ret && ret.code == 200) {
            this.deptArr = ret.data;
            if (this.deptIds) {
              this.$refs.tree2.setCheckedKeys(this.deptIds);
            }
          } else {
            this.error(ret.msg);
          }
        })
        .catch(() => {
        });
    },
    getDeptTreeList () {
      deptTree()
        .then(ret => {
          if (ret && ret.code == 200) {
            this.deptArr = this.getCinema(ret.data, 'children');
            if (this.deptIds) {
              this.$refs.tree2.setCheckedKeys(this.deptIds);
            }
          }
        })
        .catch(() => {
        });
    },
    getAttribute () {
      attributeType()
        .then(ret => {
          if (ret && ret.code == 200) {
            this.attributeArr = ret.data;
          } else {
            this.error(ret.msg);
          }
        })
        .catch(() => {
        });
    },
    // 当前页改变
    handleCurrentChange (value) {
      this.currentPage = value;
      this.getRoleTreeList();
    },
    // 当前页数数目改变e
    handleSizeChange (value) {
      this.pageSize = value;
      this.getRoleTreeList();
    }
  }
};
</script>
<style lang="scss">
.treeDialog {
  .el-dialog__body {
    border-bottom: 1px solid #e5e5e5;
    margin-bottom: 10px;
  }

  .el-dialog {
    height: auto;
  }
}

.targetTable {
  .el-dialog__body {
    border-top: 1px solid #e5e5e5;
  }

  .el-dialog {
    height: auto;
  }
}
</style>

<style lang="scss" scoped>
.content-wrapper {
  height: 100%;
  /*.el-dialog{
            min-height:556px;
        }*/
  .el-input {
    width: 360px;
  }

  .el-input__inner {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .el-select {
    width: 360px;
  }

  .box {
    width: 360px;

    &:hover .tool {
      display: block;
    }
  }

  .tool {
    display: none;
    width: 290px;
    position: absolute;
    top: 100%;
    left: 38px;
    z-index: 100;
    background: rgba(0, 0, 0, 0.8);
    color: #fff;
    border-radius: 5px 5px 5px 5px;

    li {
      height: 24px;
      line-height: 24px;
      padding-left: 10px;
    }
  }

  .flex-wrapper {
    display: -ms-flexbox;
    display: -moz-box;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    border: 1px solid #efefef;
    box-sizing: border-box;

    .table-left {
      -moz-box-flex: 1;
      box-flex: 1;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      border-right: 1px solid #efefef;

      .table-content {
        height: 342px;
        overflow-y: auto;
      }
    }

    .select-wrapper {
      width: 224px;
      overflow: auto;
      max-height: 380px;

      .select-header {
        padding: 12px 12px;
        border-bottom: 1px solid #efefef;
        font-size: 13px;

        span {
          float: right;
          cursor: pointer;
        }
      }

      .select-item {
        padding: 12px 12px;
        border-bottom: 1px solid #efefef;
        font-size: 13px;
        display: flex;

        .span-left {
          flex: 1;
          width: 168px;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .span-right {
          display: inline-block;
          flex: 0 0 20px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
