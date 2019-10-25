<template>
  <div class="page-wrapper dict-list">
    <!-- header 查询条件 -->
    <div class="list-wrapper">
      <el-form :inline="true" :model="listQuery" ref="listQuery" class="search-form search-box" label-position="right" label-width="86px">
        <!-- <div>
           <el-button-group>
            <el-button size="mini" type="primary"  @click="handleCreate" icon="el-icon-plus">新 增</el-button>
            <el-button size="mini" type="primary" @click="handleUpdate" icon="el-icon-edit-outline">编辑</el-button>
            <el-button size="mini" type="primary" @click="deletes" icon="el-icon-close">删除</el-button>
            <el-button size="mini" type="primary" @click="handleStatus(1)" icon="el-icon-check">启用</el-button>
            <el-button size="mini" type="primary" @click="handleStatus(0)" icon="fa fa-ban" style="margin-right:4px;">禁用</el-button>
           </el-button-group> 
        </div> -->
        <div class="form-group" style="margin-top:0; border-top:0;">
          <el-form-item label="类型名称：" prop="dicName">
            <el-input @keyup.enter.native="handleFilter" class="wid192" placeholder="请根据名称进行模糊搜索" v-model="listQuery.dicName" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="类型编码：" prop="dicCode">
            <el-input @keyup.enter.native="handleFilter" class="wid192" placeholder="请根据编码进行模糊搜索" v-model="listQuery.dicCode" clearable>
            </el-input>
          </el-form-item>
          <el-form-item label="启用状态：" prop="status">
            <el-select v-model="listQuery.status" class="wid192" filterable placeholder="请选择" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" value="0"></el-option>
              <el-option label="禁用" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class='search-padding searchBtn' @click="searchList">搜 索</el-button>
          </el-form-item>
          <!-- <el-form-item style="float: right">
            <el-button style="float: right" @click="handleCreate" type="primary" icon="el-icon-plus">新 增</el-button>
          </el-form-item> -->
        </div>
      </el-form>
      <!-- <div class="content-line"></div> -->
      <div class="create-wrapper" style="float: right">
        <el-button type="primary" style="margin-right: 10px;width:80px;height:32px;margin-bottom:10px;" @click="toCreate">新 建</el-button>
      </div>
      <!-- table表格 -->
      <el-table :key='tableKey' :data="list" @selection-change="selsChange" v-loading="listLoading" element-loading-text="拼命加载中..." highlight-current-row stripe size="mini" style="margin-top:8px;">
        <!-- <el-table-column
      type="selection"
      width="55"
      >
    </el-table-column>         -->
        <!-- <el-table-column
      type="index"
      width="50"
      label="序号">
      </el-table-column> -->
        <el-table-column label="类型编码">
          <template slot-scope="scope">
            <span>{{ scope.row.dicCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型名称">
          <template slot-scope="scope">
            <span>{{ scope.row.dicName }}</span>
          </template>
        </el-table-column>

        <el-table-column label="描述">
          <template slot-scope="scope">
            <span>{{ scope.row.dicDesc }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="排序号">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column> -->
        <el-table-column label="启用状态">
          <template slot-scope="scope">
            <span>{{ scope.row.delFlag | statusFilter}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime}}</span>
        </template>
      </el-table-column> -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- @click="toDetail(scope.row)" -->
            <el-button type="text" class="table-btn-mini" @click="toDetail(scope.row)">查看</el-button>
            <el-button type="text" class="table-btn-mini" @click="tomodifyDict(scope.row)">修改</el-button>
            <!-- <span class="table-btn-mini" v-if="scope.row.status == 1" @click="disableBtn(scope.row)">禁用</span>
                <span class="table-btn-mini" v-if="scope.row.status == -1" @click="enableBtn(scope.row)">启用</span> -->
          </template>
        </el-table-column>
      </el-table>
      <!-- footer 分页条 -->
      <div class="page-wrap">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.pageNum" :page-sizes="[10, 25, 50, 100]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" style="margin: -10px;">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="创建字典项" :visible.sync="dialogFormVisible" width="500px">
      <el-form :inline="true" :model="form" :rules="rules" ref="form" label-width="110px">
        <el-form-item label="类别编码" prop="dicCode" style="margin-bottom:15px">
          <el-input v-model="form.dicCode" placeholder="数据值"></el-input>
        </el-form-item>
        <el-form-item label="类别名称" prop="dicName" style="margin-bottom:15px">
          <el-input v-model="form.dicName" placeholder="标签名"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="dicDesc" style="margin-bottom:15px">
          <el-input v-model="form.dicDesc" placeholder="描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" icon="el-icon-close">取 消</el-button>
        <el-button type="primary" @click="create('form')" icon="el-icon-check">确 定</el-button>
        <!-- <el-button @click="update('form')" icon="el-icon-check">修 改</el-button> -->
      </div>
    </el-dialog>
  </div>

</template>

<script>

import { findByPage, dictionarySave } from '../../http/interface.js';
import { mapGetters } from 'vuex';
import { baseInterface } from 'base';
const { queryDictList, saveDict, updateDict, queryDictPropertyList, updateDictProperty } = baseInterface;

export default {
  name: 'dict',
  data () {
    return {
      ids: '',
      dialogFormVisible: false,
      statusType: '',
      fileList2: [],
      dialogImageUrl: '',
      dialogVisible: false,
      treeDeptData: [],
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        pageSize: 10,
        // sort: 'desc',
        dicName: '',
        dicCode: null,
        status: ''
      },
      sys_dict_add: false,
      sys_dict_upd: false,
      sys_dict_del: false,
      tableKey: 0,
      form: {},
      rules: {
        dicCode: [
          { required: true, message: '类别编码必填', trigger: 'blur' }
        ],
        dicName: [
          { required: true, message: '类别名称必填', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '编码必填', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '名称必填', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    // ...mapGetters(['permissions'])
  },
  filters: {
    statusFilter (status) {
      if (status == 0) {
        return '启用';
      } else if (status == 1) {
        return '禁用';
      }
    }
  },
  created () {
    this.getList();
    // this.sys_dict_add = this.permissions['sys_dict_add']
    // this.sys_dict_upd = this.permissions['sys_dict_upd']
    // this.sys_dict_del = this.permissions['sys_dict_del']
  },
  activated: function () {
    this.getList();
  },
  deactivated: function () {
  },
  methods: {
    getList () {
      this.listLoading = true;
      // this.listQuery.sortName = 'id'
      // this.listQuery.sort = false
      let postObj = this.listQuery;
      findByPage(postObj).then(ret => {
        this.list = ret.data.list;
        this.total = ret.data.total != 0 ? ret.data.total : 1;
        this.listLoading = false;
      });
    },
    searchList () {
      this.getList();
    },
    handleSizeChange (val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange (val) {
      this.listQuery.page = val;
      this.getList();
    },
    selsChange (rows) {
      let ids = '';
      ids = rows.map(item => item.id).join(',');// 获取所有选中行的id组成的字符串，以逗号分隔
      // 被选中的行组成数组
      this.ids = ids;
    },
    enableBtn (obj) {
      let operObj = obj;
      operObj.status = 1;
      delete operObj.propertyList;
      updateDict(operObj)
        .then((ret) => {
          this.getList();
          this.success('启用成功');
        })
        .catch(() => {
          this.error('启用失败'); // '禁用失败'
        });
    },
    disableBtn (obj) {
      this.$confirm(
        '确认禁用后将不可用，是否继续禁用?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '再想想',
          type: 'warning'
        }
      ).then(() => {
        let operObj = obj;
        delete operObj.propertyList;
        operObj.status = -1;
        updateDict(operObj)
          .then((ret) => {
            this.getList();
            this.success('禁用成功');
          })
          .catch(() => {
            this.error('禁用失败'); // '禁用失败'
          });
      });
    },
    // handleStatus (type){
    //   let deleteFlag = this.ids.length !== 0;
    //   let flagStr = type.status === 1 ? "启用" : "禁用"
    //     this.$confirm(
    //       '确认' + flagStr + '?',
    //       '提示',
    //       {
    //         confirmButtonText: '确定',
    //         cancelButtonText: '取消',
    //         type: 'warning'
    //       }
    //     ).then(() => {
    //       let obj = { ids: this.ids, statusType: type }
    //       updateStatus(obj)
    //         .then((ret) => {
    //           // this.getList()
    //           this.success(flagStr+'成功')
    //         })
    //         .catch(() => {
    //           this.success(flagStr+'失败')
    //         })
    //     })
    // },
    update (formName) {
      const set = this.$refs;
      this.form.role = this.role;
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false;
          this.form.password = undefined;
          updateObj(this.form).then(res => {
            this.dialogFormVisible = false;
            console.log(res);
            if (res.code == 200) {
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              });
              console.log(res.data);
              this.getList();
            } else {
              alert(res.msg);
            }
          });
        } else {
          return false;
        }
      });
    },
    create (formName) {
      const set = this.$refs;
      set[formName].validate(valid => {
        if (valid) {
          this.form.delFlag = 0;
          dictionarySave(this.form).then(res => {
            this.dialogFormVisible = false;
            if (res.code == 200) {
              this.getList();
              this.$message({
                title: '成功',
                message: '创建成功',
                type: 'warning',
                duration: 2000
              });
              set[formName].resetFields();
            } else {
              alert(res.msg);
              set[formName].resetFields();
            }
          });
        } else {
          return false;
        }
      });
    },
    cancel (formName) {
      this.dialogFormVisible = false;
      const set = this.$refs;
      set[formName].resetFields();
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.listQuery.categoryName = '';
      this.listQuery.categoryCode = '';
      this.listQuery.description = '';
      this.listQuery.status = '';
      this.listQuery.page = 1;
      this.getList();
    },
    toDetail (params) {
      this.$router.push({ path: '../dict/detail', query: { isJustSee: true, isEdit: true, dicCode: params.dicCode, dicName: params.dicName, dicDesc: params.dicDesc } });
    },
    toCreate (params) {
      this.dialogFormVisible = true;
      //  this.$router.push({path: '../dict/create', query: {isJustSee:false,isEdit:false}})
    },
    tomodifyDict (params) {
      this.$router.push({ path: '../dict/edit', query: { isEdit: true, dicCode: params.dicCode, dicName: params.dicName, dicDesc: params.dicDesc } });
    }
  }
};
</script>
<style lang="scss">
.dict-list {
  .search-box {
    padding: 20px 24px;
    margin-bottom: 10px;
    background: #f5f5f5;
  }
  .el-input__inner {
    font-size: 12px;
  }
  .el-select .el-input .el-input__inner {
    font-size: 12px;
  }
  .el-range-editor .el-range-input {
    font-size: 12px;
  }
}
</style>

<style lang="scss" scoped>
.wid192 {
  width: 192px;
}
.wid256 {
  width: 256px;
}
.addBtn {
  width: 80px;
  padding-left: 0;
  padding-right: 0;
  height: 32px;
  font-size: 12px;
  border-color: #3b74ff;
  color: #3b74ff;
}
.searchBtn {
  width: 80px;
  margin-left: 12px;
  height: 32px;
  font-size: 12px;
}
.el-form-item {
  margin-bottom: 0px;
}
.page-wrapper {
  padding: 0 14px 0 14px;
}
.form-group {
  // margin-top: 15px;
  // padding-top: 15px;
  border-top: 1px solid #ccc;
}

.bread-crumb {
  margin-top: 8px;
  margin-bottom: 8px;
}
.searchreset {
  display: block;
  clear: both;
  float: right;
}
</style>
