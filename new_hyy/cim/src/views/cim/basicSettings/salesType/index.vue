<template>
  <div>
    <div class="common-header sales-type-header">
      <el-form :inline="true" :model="queryData" label-position="right" label-width="100px" label-suffix=":">
        <el-form-item label="大类编码">
          <el-input v-model="queryData.code" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="大类名称">
          <el-input v-model="queryData.name" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="停用" value="0"></el-option>
            <el-option label="启用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button type="primary" @click="onQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="common-new-built">
      <el-button type="primary" size="small" plain @click="handleNewBuilt">新建</el-button>
    </div>
    <div>
      <el-table :data="tableData" v-loading="tableLoding" stripe>
        <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row,$index}">
            <el-button type="text" size="small" @click.stop="handleModification(row,$index)">修改</el-button>
            <el-button type="text" size="small" @click.stop="handlePause(row,$index)">停用</el-button>
            <el-button type="text" size="small" @click.stop="handleDlete(row,$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-wrap">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryData.currentPage" :page-size="queryData.pageSize" :background="pgbackground" :page-sizes="pageSizes" :layout="pgLayout" :total="total"></el-pagination>
      </div>
    </div>
    <el-dialog class="change-dialog" :title="isNewBuile ? '新建大类':'修改大类'" :visible.sync="changeDialog" width="400px">
      <el-form ref="changeForm" :inline="true" :model="changeData" label-position="left" label-width="100px" label-suffix=":" :rules="changeRules">
        <el-form-item label="状态" prop="status">
          <el-radio v-model="changeData.status" label="1">启用</el-radio>
          <el-radio v-model="changeData.status" label="0">停用</el-radio>
        </el-form-item>
        <el-form-item label="大类编码" prop="code">
          <el-input v-model="changeData.code" :disabled="!isNewBuile"></el-input>
        </el-form-item>
        <el-form-item label="大类名称" prop="name">
          <el-input v-model="changeData.name"></el-input>
        </el-form-item>
        <el-form-item label="排序号" prop="seq">
          <el-input v-model="changeData.seq"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="changeDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleModificationSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs';
import mixin from 'cimSrc/mixins/cim/paginationConfig.js';
import { letterAndNumReg } from 'cimSrc/util/reg.js';

export default {
  mixins: [mixin],
  data () {
    return {
      // 查询数据
      queryData: {
        code: null,
        name: null,
        status: '',
        page: 1,
        pageSize: 10
      },
      // 修改终端数据
      changeData: {
        status: '1',
        code: '',
        name: '',
        seq: ''
      },
      tableColumn: [
        {
          label: '大类编码',
          key: 'code'
        },
        {
          label: '大类名称',
          key: 'name'
        },
        {
          label: '排序号',
          key: 'seq'
        },
        {
          label: '状态',
          key: 'status',
          formatter (row, column, cellValue) {
            let result = '';
            switch (row.status) {
              case 0:
                result = '停用';
                break;
              case 1:
                result = '启用';
                break;
            }
            return result;
          }
        }
      ],
      tableData: [],
      tableLoding: false,
      total: 0,
      isNewBuile: true,
      changeDialog: false,
      changeRules: {
        code: [
          { required: true, message: '请输入大类编码', trigger: 'blur' },
          {
            pattern: letterAndNumReg,
            message: '请输入英文或数字!'
          }
        ],
        name: [{ required: true, message: '请输入大类名称', trigger: 'blur' }]
      }
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      this.onQuery();
    },
    // 查询
    onQuery () {
      // console.log(this.queryData);
      this.getQueryBigClass(this.queryData);
    },
    // 获取销售大类列表
    getQueryBigClass (param) {
      this.tableLoding = true;
      let tempParam = JSON.parse(JSON.stringify(param));
      if (tempParam.status) {
        tempParam.status = tempParam.status - 0;
      }
      this.$cimList
        .queryBigClass(tempParam)
        .then(resData => {
          if (resData.code == 200) {
            this.tableData = resData.data.list;
            this.total = resData.data.total;
          }
          this.tableLoding = false;
          // console.log(resData);
        })
        .catch(() => {
          this.tableLoding = false;
        });
    },
    // 回选,新建的时候回填编码
    getBigClass (param) {
      this.$cimList.getBigClass(qs.stringify(param)).then(resData => {
        if (resData.code == 200) {
          this.changeData.code = resData.data.code;
        }
      });
    },
    // 新建
    insertBigClass (param) {
      this.$cimList.insertBigClass(qs.stringify(param)).then(resData => {
        if (resData.code == 200) {
          this.onQuery();
        }
      });
    },
    // 修改
    updateBigClass (param) {
      this.$cimList.updateBigClass(qs.stringify(param)).then(resData => {
        if (resData.code == 200) {
          this.onQuery();
        }
      });
    },
    // 停用
    stopBigClass (param) {
      this.$cimList.stopBigClass(qs.stringify(param)).then(resData => {
        if (resData.code == 200) {
          this.onQuery();
        }
      });
    },
    // 删除
    deleteBigClass (param) {
      this.$cimList.deleteBigClass(qs.stringify(param)).then(resData => {
        if (resData.code == 200) {
          this.onQuery();
        }
      });
    },
    // 修改操作
    handleModification (row, index) {
      const { code, name, status, seq, uid } = row;
      this.changeData.status = status.toString();
      this.changeData.code = code;
      this.changeData.name = name;
      this.changeData.seq = seq;
      this.changeData.uid = uid;
      this.changeDialog = true;
      this.isNewBuile = false;
    },
    // 暂停操作
    handlePause (row, index) {
      this.stopBigClass({
        code: row.code,
        uid: row.uid
      });
    },
    // 修改操作
    handleDlete (row, index) {
      this.deleteBigClass({
        code: row.code,
        uid: row.uid
      });
    },
    // 确认提交修改
    handleModificationSubmit () {
      this.$refs['changeForm'].validate(valid => {
        if (valid) {
          if (this.isNewBuile) {
            this.insertBigClass(this.changeData);
          } else {
            this.updateBigClass(this.changeData);
          }
          this.changeDialog = false;
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleSizeChange (val) {
      this.queryData.pageSize = val;
      this.onQuery();
    },
    handleCurrentChange (val) {
      this.queryData.page = val;
      this.onQuery();
    },
    handleNewBuilt () {
      this.changeData = {
        status: '1',
        code: '',
        name: '',
        seq: ''
      };
      this.getBigClass();
      this.changeDialog = true;
      this.isNewBuile = true;
    }
  }
};
</script>

<style lang="scss">
.change-dialog {
  .el-form--inline .el-form-item {
    width: 100%;
  }
  .el-form-item__content {
    width: 70%;
  }
}
</style>