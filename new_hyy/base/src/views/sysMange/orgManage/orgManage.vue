<template>
  <div class="org-manager-wrapper">
    <div class="contentBigBox">
      <div class="leftBox">
        <div class="header-wrap">
          <span class="span">查询组织：</span>
          <el-input clearable size="small" placeholder="请输入查询内容" prefix-icon="el-icon-search" v-model.trim="filterText"></el-input>
          <el-button type="primary" @click="getDatas">搜索</el-button>
          <div class="btn">
            <el-button style="padding: 0" type="primary" @click="addNewOrgFun()" v-auth="'system_orgManage_add'">新建组织
            </el-button>
          </div>
        </div>
        <div class="org-sys">
          <el-tree :data="dataTree" node-key="id" ref="tree" default-expand-all highlight-current :filter-node-method="filterNode" :expand-on-click-node="false" :props="defaultProps">
            <span class="custom-tree-node" slot-scope="{ node, data }" @click="getListOrganizationCinema(data)">
              <span>
                <i class="iconfont" :class="{'icon-neiye-zongbu':data.text == '总部','icon-neiye-zuzhi':data.isCinema == 0,'icon-neiye-quyu':data.isCinema == 1}">
                  {{data.text}}
                </i>

              </span>
              <span class="org-button-wrap">
                <el-button v-auth="'system_orgManage_add'" type="text" size="mini" @click="() => append(node,data)">
                  新建下级
                </el-button>
                <el-button v-auth="'system_orgManage_update'" type="text" size="mini" @click="() => edit(node, data)">
                  编辑
                </el-button>
                <el-button v-auth="'system_orgManage_remove'" v-if="node.level!=1" type="text" size="mini" @click="() => remove(node, data)">
                  删除
                </el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="rightBox">
        <div class="header-btn">
          <el-button class="orgBtn" plain @click="removeRelationGroup" v-auth="'system_orgManage_removeBind'">
            批量解绑
          </el-button>
          <el-button class="orgBtn" plain @click="addRelationOpen()" v-auth="'system_orgManage_bindCinema'">
            绑定影院
          </el-button>
        </div>
        <div class="org-right">
          <el-table style="width:100%" ref="multipleTable" :data="tableData" stripe :row-class-name="tableRowClassName" :header-cell-style='{"background":"#E7EBFF"}' @selection-change="handleSelectionChange">
            <el-table-column type="selection">
            </el-table-column>
            <el-table-column prop="code" label="影院编码">
            </el-table-column>
            <el-table-column prop="name" label="影院名称">
            </el-table-column>
            <el-table-column label="操作" width="100" fixed="right" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button v-auth="'system_orgManage_removeBind'" size="mini" type="text" @click="removeRelation(scope.$index, scope.row)">解绑
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <div class="diaWindow">
      <el-dialog :visible.sync="dialogVisible_cinemaList" width='644px' lock-scroll :show-close='false' title="绑定影院">
        <div class="divider"></div>
        <cinema-list ref="cinema" :orgUid='orgUid' :orgName="orgName" @cancel="hide" @getListOrganizationCinema='getListOrganizationCinema' @addRelationOpen='addRelationOpen' />
      </el-dialog>
      <el-dialog :visible.sync="dialogVisible_addorg" width="448px" style="margin-top: 3vh;height: 450px;overflow: hidden" :show-close='true' :close-on-click-modal='false' title="新建组织" lock-scroll>

        <add-org @openOrgListFun='openOrgListFun' @bigName="bigName" :chosenOneOrg='chosenOneOrg' @dialogVisible_addorgChange='dialogVisible_addorgChange' @getOrgList='getOrgList' />
        <el-dialog :visible.sync="dialogVisible_orgList" width="448px" lock-scroll :show-close='true' :close-on-click-modal='false' title="选择组织" append-to-body>
          <org-list @getOneOrgChosen='getOneOrgChosen' @dialogVisible_orgListChange='dialogVisible_orgListChange' />
        </el-dialog>
      </el-dialog>
      <el-dialog :visible.sync="dialogVisible_addNextOrg" width="448px" style="margin-top: 3vh;height: 450px;overflow: hidden" :show-close='true' :close-on-click-modal='false' title="新建下级组织">
        <add-next-org @dialogVisible_appendChange='dialogVisible_appendChange' @getOrgList='getOrgList' :lastOrgData='lastOrgData' ref="addOrgNode" />
      </el-dialog>
      <el-dialog :visible.sync="dialogVisible_editNextOrg" width="448px" style="margin-top:10vh;height: 450px;overflow: hidden" :show-close='true' :close-on-click-modal='false' title="编辑本级组织">
        <edit-next-org @dialogVisible_editNextOrgChange='dialogVisible_editNextOrgChange' @getOrgList='getOrgList' :lastOrgData='lastOrgData' :parentOrgData='parentOrgData' />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  listCinemaUnBind,
  organizationList,
  listOrganizationCinema,
  cinemaBinding,
  removeBindingCinema,
  editOrg,
  deleteOrg
} from 'baseSrc/http/interface.js';
import cinemaListComponent from './common/cinemaList.vue';
import addOrg from './common/addOrg.vue';
import orgList from './common/orgList.vue';
import addNextOrg from './common/addNextOrg.vue';
import editNextOrg from './common/editNextOrg.vue';
import mixins from '../../../mixins/cacheMixin.js';

export default {
  name: 'orgMange',
  mixins: [mixins.cacheMixin],
  data () {
    return {
      cacheField: ['filterText', 'tableData', 'currentPage', 'pageSize'],
      flag: false,
      filterText: '',
      dataTree: [],
      defaultProps: {
        children: 'children',
        label: 'text'
      },
      dialogVisible_addorg: false,
      dialogVisible_orgList: false,
      dialogVisible_addNextOrg: false,
      dialogVisible_editNextOrg: false,
      chosenOneOrg: '',
      lastOrgData: '',
      parentOrgData: '',
      // ********
      currentPage: 0,
      total: 0,
      pageSize: 10,
      pages: '' || 1,
      name: '',
      multipleSelection: [],
      dialogVisible_cinemaList: false,
      tableData: [],
      orgUid: '',
      orgName: '',
      cinemaIds: [],
      tenantLicenseList: [],
      cinemaList: [],
      all: '',
      pageNum: ''
    };
  },
  components: {
    'cinema-list': cinemaListComponent,
    'add-org': addOrg,
    'org-list': orgList,
    'add-next-org': addNextOrg,
    'edit-next-org': editNextOrg
  },
  activated () {

  },
  created () {
    this.getOrgList();
    // this.getCinemaList()
  },
  methods: {
    hide (val) {
      this.dialogVisible_cinemaList = val;
    },
    handleSizeChange (val) {
      let self = this;
      self.size = val;
      self.getListOrganizationCinema({});
    },
    handleCurrentChange (val) {
      let self = this;
      self.currentPage = val;
      self.getListOrganizationCinema({});
    },

    //* *************** */
    // 过滤数据
    filterNode (value, data) {
      if (!value) return true;
      return data.text.indexOf(value) !== -1;
    },
    // 获取拾取的某个组织
    getOneOrgChosen (val) {
      this.chosenOneOrg = val;
    },
    // 新建组织结构-总
    addNewOrgFun () {
      this.dialogVisible_addorg = !this.dialogVisible_addorg;
    },
    dialogVisible_addorgChange (val) {
      this.dialogVisible_addorg = val;
    },
    bigName () {
      this.chosenOneOrg = '';
    },
    openOrgListFun () {
      this.dialogVisible_orgList = !this.dialogVisible_orgList;
    },
    dialogVisible_orgListChange (val) {
      this.dialogVisible_orgList = val;
    },
    // 组织结构新建下级
    append (node, data) {
      this.lastOrgData = data;
      this.dialogVisible_addNextOrg = !this.dialogVisible_addNextOrg;
    },
    dialogVisible_appendChange (val) {
      this.dialogVisible_addNextOrg = val;
    },
    // 编辑下级组织
    edit (node, data) {
      console.log(' const parent = data.parent;', data);
      this.parentOrgData = node.parent;
      this.lastOrgData = data;
      this.dialogVisible_editNextOrg = !this.dialogVisible_editNextOrg;
    },
    dialogVisible_editNextOrgChange (val) {
      console.log(val);
      this.dialogVisible_editNextOrg = val;
    },
    // 删除当前级别
    remove (node, data) {
      // const parent = node.parent;
      let self = this;
      let params = {
        uid: data.id
      };
      this.$confirm('此操作将永久删除该组织, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteOrg(params)
          .then(ret => {
            if (ret.code == 200) {
              self.$message({
                message: '删除成功',
                type: 'success'
              });
              self.getOrgList();
              self.$emit('dialogVisible_addorgChange', false);
            } else {
              self.$message({
                message: ret.msg,
                type: 'warning'
              });
            }
          })
          .catch(() => {
            self.$message('网络繁忙，稍等再试');
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    getDatas () {
      this.$refs.tree.filter(this.filterText);
    },
    // 获取组织结构列表
    getOrgList () {
      let self = this;
      let data = {};
      organizationList(data)
        .then(ret => {
          if (ret.data) {
            self.dataTree = JSON.parse(JSON.stringify(ret.data));
          } else {
            self.$message(ret.msg);
          }
        })
        .catch((err) => {
          self.$message(err.msg);
        });
    },
    getListOrganizationCinema (val) {
      this.flag = true;
      let self = this;
      if (val.id) {
        self.orgUid = val.id;
        self.orgName = val.text;
      }
      let data = {
        orgUid: self.orgUid ? self.orgUid : val.id,
        pageNum: self.currentPage,
        pageSize: self.size

      };
      // 获得某组织结构下的影院列表
      listOrganizationCinema(data)
        .then(ret => {
          if (ret && ret.code == 200) {
            self.tableData = ret.data.rows;
            self.currentPage = ret.data.pageNum;
            self.total = ret.data.total;
            self.pageSize = ret.data.pageSize;
          } else {
            self.$message(ret.msg);
          }
        })
        .catch(() => {
          self.$message('网络繁忙，稍等再试');
        });
    },

    // 某组织结构绑定影院
    addRelationOpen () {
      let self = this;
      if (this.flag) {
        this.dialogVisible_cinemaList = true;
        setTimeout(() => {
          this.$refs.cinema.search();
        }, 0);
      } else {
        self.$message('请先选择组织');
      }
    },
    // 组织解绑影院
    removeRelation (index, row) {
      let self = this;
      let arr = [];
      arr.push(row.id);
      let data = {
        uid: self.orgUid,
        cinemaIds: arr
      };
      this.$confirm(
        `是否确认解绑?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '再想想',
          type: 'warning'
        }
      ).then(() => {
        removeBindingCinema(data)
          .then(ret => {
            if (ret.code == 200) {
              self.$message({
                message: '解绑成功',
                type: 'success'
              });
              self.getListOrganizationCinema({});
            } else {
              self.$message('网络繁忙，稍等再试');
            }
          })
          .catch(() => {
            this.error('网络出错，请稍后再试');
          });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消解绑'
        });
      });
    },
    removeRelationGroup () {
      if (this.cinemaIds.length != 0) {
        let self = this;
        let data = {
          uid: self.orgUid,
          cinemaIds: this.cinemaIds
        };
        this.$confirm(
          `是否确认批量解绑?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '再想想',
            type: 'warning'
          }
        ).then(() => {
          removeBindingCinema(data)
            .then(ret => {
              if (ret.code == 200) {
                self.$message({
                  message: '解绑成功',
                  type: 'success'
                });
                self.getListOrganizationCinema({});
              } else {
                self.$message(ret.msg);
              }
            }).catch(() => {
              this.error('网络出错，请稍后再试');
            });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消解绑'
          });
        });
      } else {
        this.$message({
          type: 'info',
          message: '请选择需要解绑的影院！'
        });
      }
    },
    handleSelectionChange (val) {
      let itemArr = val;
      let resultArr = [];
      resultArr = itemArr.map((item, index) => {
        return item.id;
      });
      this.cinemaIds = resultArr;
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return 'warning-row';
      } else {
        return 'success-row';
      }
      return '';
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ret => {
          done();
        })
        .catch(_error => {
        });
    }
  }
};
</script>
<style lang="scss">
.leftBox {
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background: #3b74ff !important;
    color: #fff;
  }

  .el-tree-node__content:hover {
    background-color: #3b74ff !important;
    color: #ffffff;
  }

  .el-tree > .el-tree-node {
    display: inline-block;
    min-width: 100%;
  }
}

.org-sys {
  .el-tree--highlight-current
    .el-tree-node.is-current
    > .el-tree-node__content {
    background: #3b74ff !important;
    color: #fff;
  }
  .el-tree-node__content:hover {
    background-color: #3b74ff !important;
    color: #ffffff;
  }
}
</style>

<style lang="scss" scoped>
.org-manager-wrapper {
  /*height: 100%;*/
  .el-dialog {
    max-height: 300px;
    border-radius: 5px;
    overflow: hidden;

    .el-dialog__header {
      padding: 18px;
    }

    .el-dialog__body {
      padding: 10px;
    }
  }

  .contentBigBox {
    width: 100%;
    overflow-x: scroll;

    .orgBtn {
      border: 1px solid #3b74ff;
      color: #3b74ff;
      height: 32px;
      width: 80px;
      padding: 0;
    }

    .el-button--primary {
      width: 80px;
      height: 32px;

      span {
        font-size: 12px;
      }
    }

    .leftBox {
      background: #f0f0f0;
      display: inline-block;
      width: 49%;
      overflow-x: hidden;

      .header-wrap {
        margin: 20px 0 30px;
        height: 34px;

        .span {
          color: #606266;
          font-size: 14px;
          margin-left: 5px;
        }

        .el-input {
          width: 170px;
        }

        .btn {
          height: 34px;
          margin-right: 5px;
          display: inline-block;
        }
      }

      .org-sys {
        .el-tree {
          width: 100%;
          height: 400px;
          overflow: scroll;
          background: #f0f0f0;

          .custom-tree-node {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 12px;
            padding-right: 8px;

            .org-button-wrap {
              .el-button {
                padding: 0;
                margin-right: 10px;
                margin-left: 0px;
                color: #f0f0f0;
              }

              span {
                font-size: 12px;
              }
            }
          }
        }
      }
    }

    .rightBox {
      display: inline-block;
      width: 49%;
      float: right;
    }

    .header-btn {
      display: flex;
      justify-content: flex-end;
      margin: 10px 0;
    }
  }
}
</style>
