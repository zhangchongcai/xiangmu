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
          <el-form-item label="类型名称：" prop="dictName">
            <el-input @keyup.enter.native="handleFilter" class="wid192" placeholder="请根据名称进行模糊搜索" v-model="listQuery.dictName">
            </el-input>
          </el-form-item>
          <el-form-item label="类型编码：" prop="dictCode">
            <el-input @keyup.enter.native="handleFilter" class="wid192" placeholder="请根据编码进行模糊搜索" v-model="listQuery.dictCode">
            </el-input>
          </el-form-item>
          <el-form-item label="启用状态：" prop="status">
            <el-select v-model="listQuery.status" class="wid192" filterable placeholder="请选择" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="-1"></el-option>
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
      <!-- <div class="create-wrapper"> -->
      <!-- <el-button type="primary" style="margin-right: 10px;"  v-auth="'system_dictionary_add'" @click="toCreate" icon="el-icon-plus">新 建</el-button> -->
      <!-- </div> -->
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
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型名称">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="描述">
          <template slot-scope="scope">
            <span>{{ scope.row.description }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="排序号">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column> -->
        <el-table-column label="启用状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status | statusFilter}}</span>
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
            <el-button type="text" class="table-btn-mini" v-auth="'system_dictionary_see'" @click="toDetail(scope.row)">查看</el-button>
            <el-button type="text" class="table-btn-mini" v-auth="'system_dictionary_update'" @click="tomodifyDict(scope.row)">修改</el-button>
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
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="1000px">
      <el-form :inline="true" :model="form" :rules="rules" ref="form" label-position="right" label-width="110px">
        <el-form-item label="类别编码" prop="categoryCode">
          <el-input v-model="form.categoryCode" placeholder="数据值"></el-input>
        </el-form-item>
        <el-form-item label="类别名称" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="标签名"></el-input>
        </el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" placeholder="编码"></el-input>
        </el-form-item>
        <el-form-item label="排序号" prop="seq">
          <el-input v-model="form.seq" placeholder="排序号"></el-input>
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-select v-model="form.status" filterable placeholder="请选择" clearable>
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" placeholder="描述"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" icon="el-icon-close">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" icon="el-icon-check">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')" icon="el-icon-check">修 改</el-button>
      </div>
    </el-dialog>
  </div>

</template>

<script>
import { queryDictList, saveDict, updateDict, queryDictPropertyList, updateDictProperty } from 'baseSrc/http/interface.js';
import { mapGetters } from 'vuex';

export default {
  name: 'dict',
  data () {
    return {
      ids: '',
      dialogStatus: '',
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
        pageNum: 1,
        pageSize: 10,
        // sort: 'desc',
        dictName: '',
        dictCode: null,
        status: ''
      },
      sys_dict_add: false,
      sys_dict_upd: false,
      sys_dict_del: false,
      textMap: {
        update: '编辑字典项',
        create: '创建字典项'
      },
      tableKey: 0,
      form: {},
      rules: {
        categoryCode: [
          { required: true, message: '类别编码必填', trigger: 'blur' }
        ],
        categoryName: [
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
      if (status == 1) {
        return '启用';
      } else if (status == -1) {
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
      queryDictList(postObj).then(ret => {
        this.list = ret.data.result;
        this.total = ret.data.totalSize != 0 ? ret.data.totalSize : 1;
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
      this.listQuery.pageNum = val;
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
          updateObj(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            });
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
          addObj(this.form).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            });
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
      this.listQuery.pageNo = 1;
      this.getList();
    },
    toDetail (params) {
      this.$router.push({ path: '/sys/dict/detail', query: { isJustSee: true, isEdit: true, id: params.id, dictCode: params.code, propertyCode: params.propertyCode, dictName: params.name, description: params.description } });
    },
    toCreate (params) {
      this.$router.push({ path: '/sys/dict/create', query: { isJustSee: false, isEdit: false } });
    },
    tomodifyDict (params) {
      this.$router.push({ path: '/sys/dict/edit', query: { isEdit: true, id: params.id, dictCode: params.code, propertyCode: params.propertyCode, dictName: params.name, description: params.description } });
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
