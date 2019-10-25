<template>
  <div class="retail-style goods-categories">
    <div class="sales-type-header">
      <el-form :inline="true" :model="queryData" label-position="left" label-suffix=":">
      </el-form>
    </div>
    <div>
      <el-row>
        <el-col :lg="4">
          <div class="list-tree">
            <!-- 分类树 -->
            <el-tree :data="bigClassTeeData" :props="defaultProps" node-key="uid" icon-class="iconfont icon-neiye-zhankaijiantou" highlight-current :default-expanded-keys="defaultExpanded" v-loading="treeLoding" @node-click="handleTreeNodeClick"></el-tree>
          </div>
        </el-col>
        <el-col :lg="20">
          <div>
            <!-- 分类表格 -->
            <el-table :data="tableData" v-loading="tableLoding" stripe>
              <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter"></el-table-column>
            </el-table>
            <div class="page-wrap">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryData.currentPage" :page-size="queryData.pageSize" :background="pgbackground" :page-sizes="pageSizes" :layout="pgLayout" :total="total"></el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog class="change-dialog" :title="isNewBuile ? '新建商品类别':'修改商品类别'" :visible.sync="changeDialog" width="400px">
      <el-form :inline="true" ref="changeForm" :model="changeData" label-position="left" label-width="100px" label-suffix=":" :rules="changeRules">
        <el-form-item label="销售大类">
          <el-select v-model="changeData.bigClassUid" @change="handleBuildClassChange">
            <el-option v-for="item in bigClassList" :label="item.name" :value="item.uid" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父级类别" prop="parentUid">
          <p>
            {{buildSelectedParent.name}}
            <el-popover placement="right" width="400" trigger="click">
              <div class="change-tree">
                <el-tree :data="buildBigClassTeeData" :props="defaultProps" accordion @node-click="handleBuildTreeNodeClick"></el-tree>
              </div>
              <el-button slot="reference" type="text" size="small">调整</el-button>
            </el-popover>
          </p>
        </el-form-item>
        <el-form-item label="类别编码" prop="classCode">
          <el-input v-model="changeData.classCode" :disabled="!isNewBuile"></el-input>
        </el-form-item>
        <el-form-item label="类别名称" prop="className">
          <el-input v-model="changeData.className"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="changeData.remark" type="textarea" autosize></el-input>
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
      bigClassList: [], // 销售大类列表
      bigClassTeeData: [],
      buildBigClassTeeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 查询数据
      queryData: {
        uid: '', // 类别id
        page: 1,
        pageSize: 10
      },
      tableColumn: [
        {
          label: '类目名称',
          key: 'name'
        },
        {
          label: '编码',
          key: 'code'
        },
        {
          label: '是否末级',
          key: 'isLeaf',
          formatter (row, column, cellValue) {
            let result = '';
            switch (row.isLeaf) {
              case 0:
                result = '否';
                break;
              case 1:
                result = '是';
                break;
            }
            return result;
          }
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
      treeLoding: false,
      tableLoding: false,
      total: 0,
      currentSelectedBigClassUid: null, // 当前选中的大类id
      currentSelectedUid: null, // 当前选中的商品类别id
      buildSelectedParent: {}, // 新建或者修改选择的父类
      // 新建or修改数据
      changeData: {
        bigClassUid: '',
        parentUid: '',
        className: '',
        classCode: '',
        remark: ''
      },
      isNewBuile: true,
      changeDialog: false,
      changeRules: {
        classCode: [
          { required: true, message: '请输入类别编码', trigger: 'blur' },
          {
            pattern: letterAndNumReg,
            message: '请输入英文或数字!'
          }
        ],
        className: [
          { required: true, message: '请输入类别名称', trigger: 'blur' }
        ]
      }
    };
  },
  mounted () {
    this.init();
  },
  methods: {
    init () {
      this.getClassTree({});
    },
    // 查询
    onQuery () {
      this.getClassList(this.queryData);
    },
    // 新建或者修改类别大类选项改变
    handleBuildClassChange (val) {
      this.getClassTree(
        {
          uid: val
        },
        'build'
      );
    },
    // 获取大类列表
    getBigClassList (param) {
      this.$cimList.getBigClassList(param).then(resData => {
        if (resData.code == 200) {
          this.bigClassList = resData.data;
          if (this.bigClassList.length == 0) {
          }
        }
      });
    },
    // 获取类别树
    getClassTree (param, type) {
      this.$cimList.getClassTree(param).then(resData => {
        if (resData.code == 200) {
          this.bigClassTeeData = resData.data.children;
          this.getClassList({
            uid: ''
          });
        }
        this.treeLoding = false;
      });
    },
    // 获取类别管理列表
    getClassList (param) {
      this.tableLoding = true;
      this.$cimList
        .classList(param)
        .then(resData => {
          if (resData.code == 200) {
            this.tableData = resData.data.list;
            this.total = resData.data.total;
          }
          this.tableLoding = false;
        })
        .catch(() => {
          this.tableLoding = false;
        });
    },
    // 新增
    classAdd (param) {
      this.$cimList.classAdd(param).then(resData => {
        if (resData.code == 200) {
          this.getClassTree({
            uid: this.currentSelectedBigClassUid
          });
          this.getClassList({
            uid: this.currentSelectedUid
          });
        }
      });
    },
    // 修改
    classUpdate (param) {
      this.$cimList.classUpdate(param).then(resData => {
        if (resData.code == 200) {
          this.getClassList({
            uid: this.currentSelectedUid
          });
        }
      });
    },
    // 删除
    classDelete (param) {
      this.$cimList.classDelete(param).then(resData => {
        if (resData.code == 200) {
          this.getClassList({
            uid: this.currentSelectedUid
          });
        }
      });
    },
    // 上移
    classUp (param) {
      this.$cimList.classUp(param).then(resData => {
        if (resData.code == 200) {
          this.getClassList({
            uid: this.currentSelectedUid
          });
        }
      });
    },
    // 下移
    classDown (param) {
      this.$cimList.classDown(param).then(resData => {
        if (resData.code == 200) {
          this.getClassList({
            uid: this.currentSelectedUid
          });
        }
      });
    },
    // 回选
    classDetail (param) {
      this.$cimList.classDetail(param).then(resData => {
        if (resData.code == 200) {
          this.changeData.classCode = resData.data.classCode;
        }
      });
    },
    // 修改操作
    handleModification (index, row) {
      console.log(index, row);
      const {
        uid,
        bigClassUid,
        parentUid,
        className,
        classCode,
        remark,
        parentName
      } = row;
      this.changeData.bigClassUid = bigClassUid;
      this.changeData.parentUid = parentUid;
      this.changeData.classCode = classCode;
      this.changeData.className = className;
      this.changeData.uid = uid;
      this.changeData.remark = remark;
      this.buildSelectedParent.name = parentName;
      this.handleBuildClassChange(bigClassUid);
      this.changeDialog = true;
      this.isNewBuile = false;
    },
    // 删除操作
    handleDlete (index, row) {
      console.log(index, row);
      this.classDelete({
        uid: row.uid
      });
    },
    // 确认提交修改
    handleModificationSubmit () {
      console.log(this.changeData);
      this.$refs['changeForm'].validate(valid => {
        if (valid) {
          if (this.isNewBuile) {
            this.classAdd(this.changeData);
          } else {
            this.classUpdate(this.changeData);
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
      this.classDetail({});
      this.changeData = {
        bigClassUid: '',
        parentUid: '',
        className: '',
        classCode: '',
        remark: ''
      };
      this.buildSelectedParent.name = '';
      this.changeDialog = true;
      this.isNewBuile = true;
    },
    // 查询树
    handleTreeNodeClick (data) {
      this.queryData.uid = data.uid;
      this.currentSelectedUid = data.uid;
      this.getClassList({
        uid: this.currentSelectedUid
      });
    },
    // 新建或修改树
    handleBuildTreeNodeClick (data) {
      this.changeData.parentUid = data.id;
      this.buildSelectedParent = data;
    }
  },
  computed: {
    defaultExpanded () {
      return this.bigClassTeeData.map(item => {
        return item.uid;
      });
    }
  }
};
</script>

<style lang="scss">
@import "../../../../assets/css/element-common.scss";
@import "../../../../assets/css/common.scss";
.goods-categories {
  .list-tree {
    .el-tree {
      background: #f5f5f5;
      min-height: 800px;
    }
  }
  .change-dialog {
    .el-form--inline .el-form-item {
      width: 100%;
    }
    .el-select {
      width: 100%;
    }
    .el-form-item__content {
      width: 70%;
    }
  }
  .icon-xiala {
    transform: rotate(90deg);
    width: 16px;
  }
  .icon-shangla {
    transform: rotate(-90deg);
    width: 16px;
  }
  .el-table .el-button {
    // width: 12px;
    // height:12px ;
  }
}
</style>