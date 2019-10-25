<template>
  <div class="content-wrapper">
    <div class="list-wrapper">
      <div class="form">
        <el-form :inline="true" :model="formInline" size="mini" label-width="100px">
          <el-form-item label="用户账号：" prop="loginName">
            <el-input v-model.trim="formInline.loginName"></el-input>
          </el-form-item>
          <el-form-item label="用户名称：" prop="fullName">
            <el-input v-model.trim="formInline.fullName"></el-input>
          </el-form-item>
          <el-form-item label="用户属性：" prop="attributeType">
            <el-select v-model="formInline.attributeType" placeholder="请选择">
              <el-option v-for="item in attributeArr" :key="item.propertyCode" :label="item.propertyName" :value="item.propertyCode">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select v-model="formInline.status" placeholder="请选择" @change="chooseStatus">
              <el-option v-for="item in statusArr" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属组织：" prop="orgName">
            <el-input v-model="formInline.orgName" style="width: 192px" disabled></el-input>
            <el-button @click='dialogVisible=true' type="primary" plain>选择</el-button>
            <i class="el-icon-close" v-if="formInline.orgName" style="top: 8px;left: 172px;position: absolute;font-weight: bolder;color:#3b74ff;font-size: medium" @click="clear"></i>
            <el-button type="primary" @click="onSubmit" style="margin-left:29px">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="create-wrapper">
        <p class="tip"><i class="el-icon-warning"></i>用户初始密码：123456</p>
        <el-button type="primary" @click="to" v-auth="'system_userManage_add'">新建</el-button>
      </div>
      <div class="table">
        <el-table :data="userList" stripe style="width:100%">
          <el-table-column prop="loginName" label="用户账号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="fullName" label="用户名称" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="phone" label="手机号码" show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="attributeType" label="用户属性" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.attributeType | attributeFilter}}</template>
          </el-table-column>
          <el-table-column prop="status" label="状态" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.status==0?'启用':scope.row.status==1?'禁用':'离职'}}
            </template>
          </el-table-column>
          <el-table-column prop="organization" label="所属组织" show-overflow-tooltip>
            <template slot-scope="scope">{{scope.row.organization.name}}</template>
          </el-table-column>
          <el-table-column label="操作" width="250" fixed="right">
            <template slot-scope="scope">
              <el-button v-auth="'system_userManage_see'" class="table-btn-mini" @click="handleClick(scope.row)" type="text">查看
              </el-button>
              <el-button v-auth="'system_userManage_update'" class="table-btn-mini" @click="editUser(scope.row)" type="text">编辑
              </el-button>
              <el-button v-auth="'system_userManage_reSetPs'" class="table-btn-mini" @click="diaPwd(scope.row)" type="text">重置密码
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- footer 分页条 -->
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="diaWindow treeDialog">
      <el-dialog title="选择组织" :visible.sync="dialogVisible" width="448px" lock-scroll>
        <div class="divider"></div>
        <div class="content">
          <el-tree :data='orgArr' ref="tree" node-key="id" @node-click="handleNodeClick" :expand-on-click-node="false" default-expand-all :highlight-current="true" :props="defaultProps">
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
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          <el-button @click="dialogVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
    <el-dialog title="提示" :visible.sync="resetVisible" width="30%">
      <i class="el-icon-warning" style="font-size: 30px; color:#3B74FF;"></i>
      <span>确定重置此员工密码？</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="resetPwd">确 定</el-button>
        <el-button @click="resetVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userList, resetPassword, orgList, attributeType } from 'baseSrc/http/interface.js';
import mixins from '../../../mixins/cacheMixin.js';

export default {
  name: 'userList',
  mixins: [mixins.cacheMixin],
  data () {
    return {
      cacheField: ['userList', 'currentPage', 'pageSize', 'formInline'],
      statusArr: [{
        value: '',
        label: '全部'
      },
      {
        value: '0',
        label: '启用'
      }, {
        value: '1',
        label: '禁用'
      }, {
        value: '2',
        label: '离职'
      }],
      // 总数
      total: 1,
      // 当前页
      currentPage: 1,
      // 当前页数大小
      pageSize: 10,
      orgTreeList: [],
      formInline: {
        loginName: '',
        fullName: '',
        status: '',
        orgUid: '',
        orgName: '全部',
        attributeType: ''
      },
      orgArr: [],
      userList: [],
      dialogVisible: false,
      resetVisible: false,
      status: '',
      attributeArr: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      }
    };
  },
  activated () {
    this.getUserList();
  },
  created () {
    this.getAttribute();
    this.getUserList();
    this.getOrgTreeList();
  },
  filters: {
    attributeFilter (value) {
      if (!value) {
        return '';
      } else {
        let arr = JSON.parse(sessionStorage.getItem('attribute'));
        if (arr) {
          return arr.map(item => {
            if (item.propertyCode == value) {
              return item.propertyName;
            }
          }).join().replace(/,/g, '');
        }
      }
    }
  },
  methods: {
    clear () {
      this.formInline.orgName = this.formInline.orgUid = '';
    },
    to () {
      this.$router.push('newUser');
    },
    editUser (val) {
      this.$router.push('editUser');
      localStorage.setItem('onlyUser', val.uid);
    },
    diaPwd (val) {
      this.resetVisible = true;
      this.uid = val.uid;
    },
    resetPwd () {
      let _this = this;
      resetPassword(this.uid)
        .then(ret => {
          if (ret && ret.code == 200) {
            this.resetVisible = false;
            this.uid = '';
            _this.$message({
              message: '重置密码成功',
              type: 'success'
            });
          }
        })
        .catch(() => {
        });
    },
    chooseStatus (val) {
      this.statusArr.map((s, index) => {
        if (s.value === val) {
          this.status = this.statusArr[index].value;
        }
      });
    },
    getUserList () {
      let _this = this;
      let params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        loginName: this.formInline.loginName,
        fullName: this.formInline.fullName,
        status: this.status,
        orgUid: this.formInline.orgUid,
        attributeType: this.formInline.attributeType
      };
      userList(params)
        .then(ret => {
          if (ret && ret.code == 200) {
            _this.pageNum = ret.data.pageNum;
            _this.pageSize = ret.data.pageSize;
            _this.total = ret.data.total;
            _this.userList = ret.data.rows;
          } else {
            _this.$message({
              message: ret.msg,
              type: 'info'
            });
          }
        })
        .catch(() => {
          _this.$message('网络繁忙，请稍后再试');
        });
    },
    getOrgTreeList () {
      orgList()
        .then(ret => {
          if (ret && ret.code == 200) {
            this.orgArr = ret.data;
          } else {
            this.error(ret.msg);
          }
        })
        .catch(() => {
        });
    },
    getAttribute () {
      attributeType()
        .then(ret => {
          if (ret && ret.code == 200) {
            if (ret.data) {
              sessionStorage.setItem('attribute', JSON.stringify(ret.data));
            }
            this.attributeArr = ret.data;
            this.attributeArr.unshift({
              'propertyCode': '',
              'propertyName': '全部'
            });
          } else {
            this.error(ret.msg);
          }
        })
        .catch(() => {
        });
    },
    handleNodeClick (val) {
      this.formInline.orgUid = val.id;
      this.formInline.orgName = val.text;
    },
    handleClick (val) {
      localStorage.setItem('usDetail_uid', val.uid);
      this.$router.push('userDetail');
    },
    onSubmit () {
      this.getUserList();
    },
    // 当前页改变
    handleCurrentChange (value) {
      this.currentPage = value;
      this.getUserList();
    },
    // 当前页数数目改变e
    handleSizeChange (value) {
      this.pageSize = value;
      this.getUserList();
    }
  }
};
</script>
<style lang="scss" scoped>
.content-wrapper {
  height: 100%;

  .list-wrapper {
    .form {
      .el-form-item--mini.el-form-item {
        margin-bottom: 8px;
      }

      .el-input {
        width: 192px;
        height: 32px;
      }

      .el-select {
        width: 192px;
        height: 32px;
      }

      .el-button {
        width: 80px;
        height: 32px;
      }
    }

    .create-wrapper {
      width: 100%;
      height: 32px;
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-button {
        width: 80px;
        height: 32px;
      }
      .tip {
        i {
          margin-right: 5px;
          font-size: 14px;
        }

        font-size: 14px;
        color: #fec107;
      }
    }

    .newBuild {
      width: 100%;
      height: 60px;
      background-color: #ccc;
      border-top: #8b8b8b;
    }
  }
}
</style>
