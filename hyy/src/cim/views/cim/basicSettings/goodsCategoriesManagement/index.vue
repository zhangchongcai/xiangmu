<template>
  <div>
    <div class="common-new-built">
      <el-button type="primary" size="small" plain @click="handleNewBuilt">新建分类</el-button>
    </div>
    <div>
      <el-row>
        <el-col :lg="4">
          <div class="list-tree">
            <!-- 分类树 -->
            <el-tree
              :data="bigClassTeeData"
              :props="defaultProps"
              accordion
              v-loading="treeLoding"
              @node-click="handleTreeNodeClick"
            ></el-tree>
          </div>
        </el-col>
        <el-col :lg="20">
          <div>
            <!-- 分类表格 -->
            <el-table :data="tableData" v-loading="tableLoding" stripe>
              <el-table-column
                v-for="item in tableColumn"
                :key="item.key"
                :prop="item.key"
                :label="item.label"
                :formatter="item.formatter"
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{row,$index}">
                  <el-button type="text" size="small" @click.stop="handleModification($index, row)">
                    <i class="iconfont icon-Wechatneiye-bianji"></i>
                  </el-button>
                  <el-button type="text" size="small" @click.stop="handleDlete($index, row)">
                    <i class="iconfont icon-neiye-shanchu"></i>
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="page-wrap">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryData.currentPage"
                :page-size="queryData.pageSize"
                :background="pgbackground"
                :page-sizes="pageSizes"
                :layout="pgLayout"
                :total="total"
              ></el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <el-dialog
      class="change-dialog"
      :title="isNewBuile ? '新建商品类别':'修改商品类别'"
      :visible.sync="changeDialog"
      width="500px"
    >
      <el-form
        :inline="true"
        ref="changeForm"
        :model="changeData"
        label-position="left"
        label-width="100px"
        label-suffix=":"
        :rules="changeRules"
      >
        <el-form-item label="上级分类" prop="parentUid">
          <p>
            <!-- {{classSelectedParent.name}} -->
            <el-input v-model="classSelectedParent.name" disabled></el-input>
            <el-popover placement="right" width="400" trigger="click">
              <div class="change-tree">
                <el-tree
                  :data="buildBigClassTeeData"
                  :props="defaultProps"
                  accordion
                  @node-click="handleClassTreeNodeClick"
                ></el-tree>
              </div>
              <el-button slot="reference" size="small">选择</el-button>
            </el-popover>
          </p>
        </el-form-item>
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="changeData.name"></el-input>
        </el-form-item>
        <el-form-item label="类别编码" prop="code">
          <el-input v-model="changeData.code" :disabled="!isNewBuile"></el-input>
        </el-form-item>
        <el-form-item label="是否末级分类" prop="isLeaf">
          <el-radio-group v-model="changeData.isLeaf">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标准类目" prop="parentUid" v-if="changeData.isLeaf==1">
          <p>
            <el-input v-model="criterionSelected.name" disabled></el-input>
            <el-popover placement="right" width="400" trigger="click">
              <div class="change-tree">
                <el-tree
                  :data="buildCriterionClassData"
                  :props="defaultProps"
                  accordion
                  @node-click="handleCriterionNodeClick"
                ></el-tree>
              </div>
              <el-button slot="reference" size="small">选择</el-button>
            </el-popover>
          </p>
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
import qs from "qs";
import mixin from "cim/mixins/cim/paginationConfig.js";
import { letterAndNumReg } from "cim/util/reg.js";

export default {
  mixins: [mixin],
  data() {
    return {
      bigClassList: [], //销售大类列表
      bigClassTeeData: [],
      buildBigClassTeeData: [],
      buildCriterionClassData: [], //标准类目树
      defaultProps: {
        children: "children",
        label: "name",
        disabled: (data, node) => {
          console.log(data, node);
          if (data.isLeaf == 1) {
            return true;
          } else {
            return false;
          }
          
        }
      },
      //查询数据
      queryData: {
        uid: "", //类别id
        page: 1,
        pageSize: 10
      },
      tableColumn: [
        {
          label: "子分类名称",
          key: "name"
        },
        {
          label: "编码",
          key: "code"
        },
        {
          label: "是否末级分类",
          key: "isLeaf",
          formatter(row, column, cellValue) {
            let result = "";
            switch (row.isLeaf) {
              case 0:
                result = "否";
                break;
              case 1:
                result = "是";
                break;
            }
            return result;
          }
        },
        {
          label: "关联标准类目",
          key: "merClassName"
        }
      ],

      tableData: [
        // {
        //   name: "爆米花套餐",
        //   code: "012",
        //   code1: "否",
        //   remark: "食品/套餐"
        // },
        // {
        //   name: "爆米花套餐",
        //   code: "012",
        //   code1: "否",
        //   remark: "食品/套餐"
        // }
      ],
      treeLoding: false,
      tableLoding: false,
      total: 0,
      currentSelectedBigClassUid: null, //当前选中的大类id
      currentSelectedUid: null, //当前选中的商品类别id
      classSelectedParent: {}, //选择的父类
      criterionSelected: {}, //选择的标准类目
      //新建or修改数据
      changeData: {
        merClassUid: "",
        parentUid: "",
        name: "",
        code: "",
        isLeaf: "0",
        uid: ""
      },
      isNewBuile: true,
      changeDialog: false,
      changeRules: {
        code: [
          { required: true, message: "请输入类别编码", trigger: "blur" },
          {
            pattern: letterAndNumReg,
            message: "请输入英文或数字!"
          }
        ],
        name: [{ required: true, message: "请输入类别名称", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getCategoryTrees();
      // this.onQuery();
    },
    // 查询
    onQuery() {
      this.getCategoryList(this.queryData);
    },
    //查询大类选项改变
    handleBigClassChange(val) {
      this.tableData = [];
      this.currentSelectedUid = null;
      this.currentSelectedBigClassUid = val;
      this.getClassTree({
        uid: val
      });
    },
    // 新建或者修改类别大类选项改变
    handleBuildClassChange(val) {
      this.getClassTree(
        {
          uid: val
        },
        "build"
      );
    },
    // 获取分类树
    getCategoryTrees(param) {
      this.$cimList.getCategoryTrees((param = {})).then(resData => {
        if (resData.code == 200) {
          this.bigClassTeeData = [resData.data];
          console.log(this.bigClassTeeData);
        }
      });
    },
    // 根据销售大类获取类别树
    getClassTree(param, type) {
      // this.treeLoding = true;
      this.$cimList.getClassTree(param).then(resData => {
        if (resData.code == 200) {
          if (type == "build") {
            this.buildBigClassTeeData = resData.data;
          } else {
            this.bigClassTeeData = resData.data;
            console.log(this.bigClassTeeData);
          }
        }
        // this.treeLoding = false;
      });
    },
    // 获取类别管理列表
    getCategoryList(param) {
      this.tableLoding = true;
      this.$cimList
        .categoryList(param)
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
    classAdd(param) {
      this.$cimList.categorySave(param).then(resData => {
        if (resData.code == 200) {
          this.getCategoryTrees();
          this.getCategoryList({
            uid: this.currentSelectedUid
          });
        }
      });
    },
    // 修改
    classUpdate(param) {
      this.$cimList.categorySave(param).then(resData => {
        if (resData.code == 200) {
          this.getCategoryList({
            uid: this.currentSelectedUid
          });
        }
      });
    },
    // 删除
    classDelete(param) {
      this.$cimList.categoryDelete(param).then(resData => {
        if (resData.code == 200) {
          this.getCategoryList({
            uid: this.currentSelectedUid
          });
        }
      });
    },
    // 回选
    classDetail(param) {
      this.$cimList.categoryToPage(param).then(resData => {
        if (resData.code == 200) {
          let category = resData.data.category;
          this.changeData.code = category.code;
          this.changeData.name = category.name;
          this.changeData.uid = category.uid;
          this.changeData.isLeaf = category.isLeaf.toString();
          this.classSelectedParent.name = category.parentName;
          this.criterionSelected.name = category.merClassName;
          this.buildBigClassTeeData = [resData.data.categories];
          this.buildCriterionClassData = [resData.data.classes]; //	标准分类树
        }
      });
    },
    // 修改操作
    handleModification(index, row) {
      console.log(index, row);
      const { uid } = row;
      this.classDetail({ uid: uid });
      this.changeData.uid = uid;
      this.changeDialog = true;
      this.isNewBuile = false;
    },
    // 删除操作
    handleDlete(index, row) {
      console.log(index, row);
      this.classDelete({
        isLeaf: row.isLeaf,
        uid: row.uid
      });
    },
    //确认提交修改
    handleModificationSubmit() {
      console.log(this.changeData);
      this.$refs["changeForm"].validate(valid => {
        if (valid) {
          if (this.isNewBuile) {
            this.classAdd(this.changeData);
          } else {
            this.classUpdate(this.changeData);
          }
          this.changeDialog = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.onQuery();
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.onQuery();
    },
    handleNewBuilt() {
      this.classDetail({});
      this.changeData = {
        merClassUid: "",
        parentUid: "",
        name: "",
        code: "",
        isLeaf: "0"
      };
      this.classSelectedParent.name = "";
      this.criterionSelected.name = "";
      this.changeDialog = true;
      this.isNewBuile = true;
    },
    // 查询树
    handleTreeNodeClick(data) {
      this.currentSelectedUid = data.uid;
      this.getCategoryList({
        uid: this.currentSelectedUid
      });
    },
    //上级分类点击
    handleClassTreeNodeClick(data) {
      this.changeData.parentUid = data.uid;
      this.classSelectedParent = data;
    },
    // 标准类目点击
    handleCriterionNodeClick(data) {
      this.changeData.merClassUid = data.uid;
      this.criterionSelected = data;
    }
  }
};
</script>

<style lang="scss">
@import "../../../../assets/css/element-common.scss";
@import "../../../../assets/css/common.scss";
.list-tree {
  .el-tree {
    background: #f5f5f5;
    min-height: 700px;
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
  .el-input {
    width: 75%;
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
</style>