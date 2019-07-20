<template>
  <div class="retail-style goods-categories-management">
    <div class="common-new-built">
      <el-button type="primary" size="mini" plain @click="handleNewBuilt">新建分类</el-button>
    </div>
    <div>
      <el-row>
        <el-col :lg="4">
          <div class="list-tree">
            <!-- 分类树 -->
            <el-tree
                    :data="bigClassTeeData"
                    :props="defaultProps"
                    node-key="uid"
                    highlight-current
                    :default-expanded-keys="defaultExpanded"
                    v-loading="treeLoding"
                    @node-click="handleTreeNodeClick"
            >
               <span class="custom-tree-node" slot-scope="{ node, data }">
                     <span class="tree-dot" v-if="data.isLeaf">.</span>
                     <span>{{ node.label }}</span>
                   </span>
            </el-tree>
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
                    编辑
                  </el-button>
                  <el-button type="text" size="small" @click.stop="handleDlete($index, row)">
                   删除
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
      :title="isNewBuile ? '新建商品分类':'修改商品分类'"
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
            <el-input v-model="classSelectedParent.name" disabled></el-input>
            <el-popover placement="right" width="400" trigger="click">
              <div class="change-tree retail-style">
                <el-tree
                        :data="buildBigClassTeeData"
                        :props="defaultProps"
                        accordion
                        icon-class="iconfont icon-neiye-zhankaijiantou"
                        highlight-current
                        @node-click="handleClassTreeNodeClick"
                >
                   <span class="custom-tree-node" slot-scope="{ node, data }">
                     <el-radio v-model="customTree" :label="data.uid"></el-radio>
                     <span>{{ node.label }}</span>
                   </span>
                </el-tree>
              </div>
              <el-button slot="reference" size="small" class="selsect-btn" type="primary" plain>选择</el-button>
            </el-popover>
          </p>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="changeData.name"></el-input>
        </el-form-item>
        <el-form-item label="分类编码" prop="code">
          <el-input v-model="changeData.code" disabled></el-input>
        </el-form-item>
        <el-form-item label="是否末级分类" prop="isLeaf">
          <el-radio-group v-model="changeData.isLeaf">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标准类目" prop="merClassUid" v-if="changeData.isLeaf==1">
          <p>
            <el-input v-model="criterionSelected.name" disabled></el-input>
            <el-popover class="retail-style" placement="right" width="400" trigger="click">
              <div class="change-tree retail-style">
                <el-tree
                        :data="buildCriterionClassData"
                        :props="defaultProps"
                        accordion
                        icon-class="iconfont icon-neiye-zhankaijiantou"
                        highlight-current
                        @node-click="handleCriterionNodeClick"
                >
                   <span class="custom-tree-node" slot-scope="{ node, data }">
                     <el-radio v-model="customTree" :label="data.uid"></el-radio>
                     <span>{{ node.label }}</span>
                   </span>
                </el-tree>
              </div>
              <el-button slot="reference" size="small" class="selsect-btn" type="primary" plain>选择</el-button>
            </el-popover>
          </p>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="handleModificationSubmit">确 定</el-button>
         <el-button @click="changeDialog = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import mixin from "cim/mixins/cim/paginationConfig.js";
  import {letterAndNumReg} from "cim/util/reg.js";

  export default {
  mixins: [mixin],
  data() {
    return {
      customTree:'',
      bigClassList: [], //销售大类列表
      bigClassTeeData: [],
      buildBigClassTeeData: [],
      buildCriterionClassData: [], //标准类目树
      defaultProps: {
        children: "children",
        label: "name",
        // disabled: (data, node) => {
        //   // console.log(data, node);
        //   if (data.isLeaf == 1) {
        //     return false;
        //   } else {
        //     return true;
        //   }
        // }
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

      tableData: [],
      treeLoding: false,
      tableLoding: false,
      total: 0,
      currentSelectedBigClassUid: null, //当前选中的大类id
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
          {required: true, message: "请输入分类编码", trigger: "change"},
          {
            pattern: letterAndNumReg,
            message: "请输入英文或数字!"
          }
        ],
        name: [
          {required: true, message: "请输入分类名称", trigger: "change"},
          {
            min: 1,
            max: 20,
            message: "最多输入20个字符!",
            trigger: "change"
          }
        ],
        merClassUid: [
          { required: true, message: "请输入标准类目", trigger: "change" }
        ]
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getCategoryTrees();
      this.onQuery();
    },
    // 查询
    onQuery() {
      this.getCategoryList(this.queryData);
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
    //根据父分类获取code
    categoryBuildCode(param) {
      this.$cimList.categoryBuildCode((param)).then(resData => {
        if (resData.code == 200) {
          this.changeData.code = resData.data;
        }
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
          this.getCategoryList(this.queryData);
          this.changeDialog = false;
          this.$message("新建成功!");
        } else {
          this.$message(resData.msg);
        }
      });
    },
    // 修改
    classUpdate(param) {
      this.$cimList.categorySave(param).then(resData => {
        if (resData.code == 200) {
          this.getCategoryTrees();
          this.getCategoryList(this.queryData);
          this.changeDialog = false;
          this.$message("修改成功!");
        } else {
          this.$message(resData.msg);
        }
      });
    },
    // 删除
    classDelete(param) {
      this.$cimList.categoryDelete(param).then(resData => {
        if (resData.code == 200) {
          this.getCategoryTrees();
          this.getCategoryList(this.queryData);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        } else {
          this.$message(resData.msg);
        }
      });
    },
    // 回选
    classDetail(param) {
      this.$cimList.categoryToPage(param).then(resData => {
        if (resData.code == 200) {
          let category = resData.data.category;
          this.changeData.code = category.code;
          if (category.name) {
            this.changeData.name = category.name;

          }
          this.classSelectedParent.name = category.parentName;
          this.criterionSelected.name = category.merClassName;
          this.buildBigClassTeeData = [resData.data.categories];
          this.buildCriterionClassData = [resData.data.classes]; //	标准分类树
          this.changeData.uid = category.uid;
          this.changeData.merClassUid = category.merClassUid;
          this.changeData.parentUid = category.parentUid;
          if (category.isLeaf != null) {
            this.changeData.isLeaf = category.isLeaf.toString();
          }
        }
      });
    },
    // 修改操作
    handleModification(index, row) {
      // console.log(index, row);
      const { uid } = row;
      this.classDetail({ uid: uid });
      this.changeData.uid = uid;
      this.changeDialog = true;
      this.isNewBuile = false;
    },
    // 删除操作
    handleDlete(index, row) {
      this.$confirm("<i class='el-icon-circle-close'></i><span>确定删除吗?</span>", {
        customClass:"retail-style",
        dangerouslyUseHTMLString: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        center: true,
      })
        .then(() => {
          this.classDelete({
            isLeaf: row.isLeaf,
            uid: row.uid
          });
        })
        .catch(() => {

        });

      // console.log(index, row);
    },
    //确认提交修改
    handleModificationSubmit() {
      // console.log(this.changeData);
      this.$refs["changeForm"].validate(valid => {
        if (valid) {
          if (this.isNewBuile) {
            this.classAdd(this.changeData);
          } else {
            this.classUpdate(this.changeData);
          }
        } else {
          // console.log("error submit!!");
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
      this.classDetail({});
    },
    // 查询树
    handleTreeNodeClick(data) {
      this.queryData.uid = data.uid;
      this.getCategoryList(this.queryData);
    },
    //上级分类点击
    handleClassTreeNodeClick(data) {
      this.changeData.parentUid = data.uid;
      this.customTree = data.uid;
      this.classSelectedParent = data;
      this.categoryBuildCode({ parentUid: data.uid, uid: this.changeData.uid });
    },
    // 标准类目点击
    handleCriterionNodeClick(data) {
      this.changeData.merClassUid = data.uid;
      this.customTree = data.uid;
      this.criterionSelected = data;
    }
  },
  computed: {
    defaultExpanded() {
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
.change-tree{
  .el-radio{
    margin-right: 0;
  }
  .el-radio__label{
    display: none;
  }
}
.goods-categories-management {

  .list-tree {
    .el-tree {
      min-height: 750px;
    }
  }
  .custom-tree-node{
    position: relative;
    .tree-dot{
      font-weight: 900;
      position: absolute;
      left: -8px;
      top: -3px;
    }
  }
  .change-dialog {
    .change-tree {
      height: 500px;
      overflow-y: scroll;
    }

    .el-form--inline .el-form-item {
      width: 100%;
      margin-right: 0;
    }

    .el-select {
      width: 100%;
    }

    .el-form-item__content {
      width: 360px;
    }

    .el-input {
      width: 70%;
    }

    .el-button {
      width: 80px;
    }
  }
}

</style>