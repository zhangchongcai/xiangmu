<template>
  <div>
    <el-dialog title="选择商品" :visible.sync="ComBankdialogVisible" width="70%" :before-close="handleClose">
      <div class="box">
        <div class="box-left">
          <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
        <div class="box-right">
          <div class="box-right-top">
            <el-form :inline="true" :model="queryData" label-position="left" label-suffix=":">
              <el-form-item label="品牌">
                <el-input v-model="queryData.code" placeholder="请输内容"></el-input>
              </el-form-item>
              <el-form-item label="商品条码">
                <el-input v-model="queryData.name" placeholder="请输内容"></el-input>
              </el-form-item>
              <el-form-item label="商品名称">
                <el-input v-model="queryData.name" placeholder="请输内容"></el-input>
              </el-form-item>
              <el-form-item class="query-btn-box">
                <el-button type="primary" @click="onSubmit">搜索</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="box-right-main">
            <div class="box-main-table">
              <div class="page-table">
                <el-table :data="tableData" height="360" stripe>
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label"></el-table-column>
                </el-table>
              </div>
              <div class="page-wrap">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
                </el-pagination>
              </div>
            </div>
            <div class="box-main-right">
              <div class="box-last-top">已选内容<span>清空</span></div>
              <hr>
              <ul class="box-last-ul">
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
                <li>
                  <span class="span-left">可口可乐1</span>
                  <span class="span-right"><i class="el-icon-close"></i></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!--     <el-header>
      <el-form
        :inline="true"
        :model="queryData"
        label-position="right"
        label-width="100px"
        label-suffix=":"
      >
        <el-form-item label="品牌">
          <el-input v-model="queryData.code" placeholder="请输内容"></el-input>
        </el-form-item>
        <el-form-item label="商品条码">
          <el-input v-model="queryData.name" placeholder="请输内容"></el-input>
        </el-form-item> 
        <el-form-item label="商品名称">
          <el-input v-model="queryData.name" placeholder="请输内容"></el-input>
        </el-form-item>
        <el-form-item  class="query-btn-box">
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </el-header>
    <div>商品信息</div>
    <div class="common-left">
      <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>
    <div class="common-right">
      <div>
        <el-table :data="tableData" stripe>
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            v-for="item in tableColumn"
            :key="item.key"
            :prop="item.key"
            :label="item.label"
          ></el-table-column>
        </el-table>
        <div class="page-wrap">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryData.page"
            :page-sizes="[10,20,30]"
            :page-size="queryData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div> -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmComBtn()">下一步</el-button>
        <el-button @click="cancelComBtn()">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="为商品指定分类" :visible.sync="AppointDialogVisible" width="70%" :before-close="handleClose">
      <div class="next-box">
        <div class="next-pro-top">已选择商品</div>
        <div class="next-pro-main">
          <el-table :data="tableData" height="475" stripe>
            <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label"></el-table-column>
            <el-table-column label="商品分类">
              <template slot-scope="{row,$index}">
                <el-input v-model="queryData.code" placeholder="请输内容"></el-input>
                <!-- <el-button type="text" size="small" @click.stop="handleSelectCom($index, row)">选择</el-button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AppointDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="AppointDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="选择商品分类" :visible.sync="selectComDialogVisible" width="20%" :before-close="handleClose">
      <div>
        <el-tree :data="data" :props="defaultProps" @node-click="SelectHandleNodeClick"></el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectComDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="selectComDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>

export default {
  name: 'ComBank',
  props: [
    'ComBankdialogVisible'
  ],
  data () {
    return {
      queryData: {
        pageSize: 10,
        page: 1,
        cinemaUid: null,
        name: null,
        code: null,
        status: null
      },
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }, {
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      } ],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableColumn: [
        {
          label: '商品名称',
          key: 'cinemaUid'
        },
        {
          label: '商品编码',
          key: 'code'
        },
        {
          label: '品牌',
          key: 'name'
        },
        {
          label: '商品规格',
          key: 'name'
        },
        {
          label: '单位',
          key: 'address'
        }
      ],
      AppointDialogVisible: false,
      selectComDialogVisible: false,
      tableData: [{
        'id': 1,
        'uid': 'ff5e4f86-fc77-40fb-a734-b3c0324b5165',
        'tenantId': 'TID000000',
        'cinemaUid': 'cuid001',
        'code': 'CK001',
        'name': '测试仓库修改1',
        'address': '测试仓库修改1地址',
        'status': 1,
        'isDef': 0,
        'delFlag': 0,
        'createTime': '2019-03-29 11:57:20',
        'createUserUid': '123456789',
        'createUserName': '超级管理员',
        'updateTime': '2019-03-29 13:58:50',
        'updateUserUid': '123456789',
        'updateUserName': '超级管理员'
      }, {
        'id': 1,
        'uid': 'ff5e4f86-fc77-40fb-a734-b3c0324b5165',
        'tenantId': 'TID000000',
        'cinemaUid': 'cuid001',
        'code': 'CK001',
        'name': '测试仓库修改1',
        'address': '测试仓库修改1地址',
        'status': 1,
        'isDef': 0,
        'delFlag': 0,
        'createTime': '2019-03-29 11:57:20',
        'createUserUid': '123456789',
        'createUserName': '超级管理员',
        'updateTime': '2019-03-29 13:58:50',
        'updateUserUid': '123456789',
        'updateUserName': '超级管理员'
      }, {
        'id': 1,
        'uid': 'ff5e4f86-fc77-40fb-a734-b3c0324b5165',
        'tenantId': 'TID000000',
        'cinemaUid': 'cuid001',
        'code': 'CK001',
        'name': '测试仓库修改1',
        'address': '测试仓库修改1地址',
        'status': 1,
        'isDef': 0,
        'delFlag': 0,
        'createTime': '2019-03-29 11:57:20',
        'createUserUid': '123456789',
        'createUserName': '超级管理员',
        'updateTime': '2019-03-29 13:58:50',
        'updateUserUid': '123456789',
        'updateUserName': '超级管理员'
      }, {
        'id': 1,
        'uid': 'ff5e4f86-fc77-40fb-a734-b3c0324b5165',
        'tenantId': 'TID000000',
        'cinemaUid': 'cuid001',
        'code': 'CK001',
        'name': '测试仓库修改1',
        'address': '测试仓库修改1地址',
        'status': 1,
        'isDef': 0,
        'delFlag': 0,
        'createTime': '2019-03-29 11:57:20',
        'createUserUid': '123456789',
        'createUserName': '超级管理员',
        'updateTime': '2019-03-29 13:58:50',
        'updateUserUid': '123456789',
        'updateUserName': '超级管理员'
      }, {
        'id': 1,
        'uid': 'ff5e4f86-fc77-40fb-a734-b3c0324b5165',
        'tenantId': 'TID000000',
        'cinemaUid': 'cuid001',
        'code': 'CK001',
        'name': '测试仓库修改1',
        'address': '测试仓库修改1地址',
        'status': 1,
        'isDef': 0,
        'delFlag': 0,
        'createTime': '2019-03-29 11:57:20',
        'createUserUid': '123456789',
        'createUserName': '超级管理员',
        'updateTime': '2019-03-29 13:58:50',
        'updateUserUid': '123456789',
        'updateUserName': '超级管理员'
      }, {
        'id': 1,
        'uid': 'ff5e4f86-fc77-40fb-a734-b3c0324b5165',
        'tenantId': 'TID000000',
        'cinemaUid': 'cuid001',
        'code': 'CK001',
        'name': '测试仓库修改1',
        'address': '测试仓库修改1地址',
        'status': 1,
        'isDef': 0,
        'delFlag': 0,
        'createTime': '2019-03-29 11:57:20',
        'createUserUid': '123456789',
        'createUserName': '超级管理员',
        'updateTime': '2019-03-29 13:58:50',
        'updateUserUid': '123456789',
        'updateUserName': '超级管理员'
      }, {
        'id': 1,
        'uid': 'ff5e4f86-fc77-40fb-a734-b3c0324b5165',
        'tenantId': 'TID000000',
        'cinemaUid': 'cuid001',
        'code': 'CK001',
        'name': '测试仓库修改1',
        'address': '测试仓库修改1地址',
        'status': 1,
        'isDef': 0,
        'delFlag': 0,
        'createTime': '2019-03-29 11:57:20',
        'createUserUid': '123456789',
        'createUserName': '超级管理员',
        'updateTime': '2019-03-29 13:58:50',
        'updateUserUid': '123456789',
        'updateUserName': '超级管理员'
      }, {
        'id': 1,
        'uid': 'ff5e4f86-fc77-40fb-a734-b3c0324b5165',
        'tenantId': 'TID000000',
        'cinemaUid': 'cuid001',
        'code': 'CK001',
        'name': '测试仓库修改1',
        'address': '测试仓库修改1地址',
        'status': 1,
        'isDef': 0,
        'delFlag': 0,
        'createTime': '2019-03-29 11:57:20',
        'createUserUid': '123456789',
        'createUserName': '超级管理员',
        'updateTime': '2019-03-29 13:58:50',
        'updateUserUid': '123456789',
        'updateUserName': '超级管理员'
      }, {
        'id': 1,
        'uid': 'ff5e4f86-fc77-40fb-a734-b3c0324b5165',
        'tenantId': 'TID000000',
        'cinemaUid': 'cuid001',
        'code': 'CK001',
        'name': '测试仓库修改1',
        'address': '测试仓库修改1地址',
        'status': 1,
        'isDef': 0,
        'delFlag': 0,
        'createTime': '2019-03-29 11:57:20',
        'createUserUid': '123456789',
        'createUserName': '超级管理员',
        'updateTime': '2019-03-29 13:58:50',
        'updateUserUid': '123456789',
        'updateUserName': '超级管理员'
      }, {
        'id': 1,
        'uid': 'ff5e4f86-fc77-40fb-a734-b3c0324b5165',
        'tenantId': 'TID000000',
        'cinemaUid': 'cuid001',
        'code': 'CK001',
        'name': '测试仓库修改1',
        'address': '测试仓库修改1地址',
        'status': 1,
        'isDef': 0,
        'delFlag': 0,
        'createTime': '2019-03-29 11:57:20',
        'createUserUid': '123456789',
        'createUserName': '超级管理员',
        'updateTime': '2019-03-29 13:58:50',
        'updateUserUid': '123456789',
        'updateUserName': '超级管理员'
      }]
    };
  },
  methods: {
    cancelComBtn: function () {
      this.$emit('update:ComBankdialogVisible', false);
    },
    confirmComBtn: function () {
      this.$emit('update:ComBankdialogVisible', false);
      this.AppointDialogVisible = true;
    },
    handleClose: function () {
      this.$emit('update:ComBankdialogVisible', false);
    },
    handleSelectCom: function (index, row) {
      this.selectComDialogVisible = true;
    },
    // 选择商品分类
    SelectHandleNodeClick (data) {
      // this.$refs.tree.getCheckedNodes()
      //   alert(data);
    }
  }
};
</script>


<style lang="scss">
.el-dialog__body {
  padding-top: 10px;
}
.el-header {
  .el-form-item__content {
    width: 100px;
  }
  .el-form-item__label {
    width: 80px;
  }
}

.box {
  display: flex;
  height: 470px;
  overflow: hidden;
}
.box-left {
  flex: 0 0 200px;
  height: 100%;
  overflow: auto;
  float: left;
}
.box-right {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  .box-right-top {
    height: 60px;
    .el-input__inner {
      width: 150px;
    }
  }
}

.box-right-main {
  flex: 1;
  overflow: hidden;
  display: flex;
}
.box-main-table {
  overflow: auto;
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  .page-table {
    flex: 1;
  }
  .page-wrap {
    height: 40px;
    padding: 0;
  }
}
.box-main-right {
  flex: 0 0 200px;
  border: 1px solid #ebeef5;
  box-sizing: border-box;
  padding: 5px;
  .box-last-top {
    span {
      float: right;
      cursor: pointer;
    }
  }
  .box-last-ul {
    height: 370px;
    overflow: auto;
    li {
      display: flex;
      height: 30px;
      line-height: 30px;
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
        i {
        }
      }
    }
  }
}
.next-box {
  display: flex;
  flex-direction: column;
  .next-pro-top {
    flex: 0 0 30px;
    line-height: 30px;
  }
  .next-pro-main {
    flex: 1;
  }
}
</style>