<template>
  <div>
    <div class="common-header sales-type-header">
      <el-form
        :inline="true"
        :model="queryData"
        label-position="right"
        label-width="100px"
        label-suffix=":"
      >
        <el-form-item label="销售大类">
          <el-select v-model="queryData.uid" @change="handleBigClassChange">
            <el-option
              v-for="item in bigClassList"
              :label="item.name"
              :value="item.uid"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="common-new-built">
      <el-button type="primary" size="small" plain @click="handleNewBuilt">新建</el-button>
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
              ></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="{row,$index}">
                  <el-button
                    type="text"
                    size="small"
                    @click.stop="handlePullDown($index, row)"
                    class="icon-xiala"
                    v-if="tableData.length>1"
                  >
                    <i
                      class="iconfont icon-icon-youjiantou"
                      v-show="$index != (tableData.length-1)"
                    ></i>
                  </el-button>
                  <el-button
                    type="text"
                    size="small"
                    @click.stop="handlePullUp($index, row)"
                    class="icon-shangla"
                    v-if="tableData.length>1"
                  >
                    <i class="iconfont icon-icon-youjiantou" v-show="$index!=0"></i>
                  </el-button>
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
      width="400px"
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
        <el-form-item label="销售大类">
          <el-select v-model="changeData.bigClassUid" @change="handleBuildClassChange">
            <el-option
              v-for="item in bigClassList"
              :label="item.name"
              :value="item.uid"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父级类别" prop="parentUid">
          <p>
            {{buildSelectedParent.name}}
            <el-popover placement="right" width="400" trigger="click">
              <div class="change-tree">
                <el-tree
                  :data="buildBigClassTeeData"
                  :props="defaultProps"
                  accordion
                  @node-click="handleBuildTreeNodeClick"
                ></el-tree>
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
import qs from "qs";
import mixin from "cim/mixins/cim/paginationConfig.js";

export default {
  mixins: [mixin],
  data() {
    return {
      bigClassList: [], //销售大类列表
      bigClassTeeData: [],
      buildBigClassTeeData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      //查询数据
      queryData: {
        uid: "", //类别id
        page: 1,
        pageSize: 10
      },
      tableColumn: [
        {
          label: "编码",
          key: "classCode"
        },
        {
          label: "名称",
          key: "className"
        },
        {
          label: "备注",
          key: "remark"
        }
      ],

      tableData: [],
      treeLoding: false,
      tableLoding: false,
      total: 0,
      currentSelectedBigClassUid: null, //当前选中的大类id
      currentSelectedUid: null, //当前选中的商品类别id
      buildSelectedParent: {}, //新建或者修改选择的父类
      //新建or修改数据
      changeData: {
        bigClassUid: "",
        parentUid: "",
        className: "",
        classCode: "",
        remark: ""
      },
      isNewBuile: true,
      changeDialog: false,
      changeRules: {
        classCode: [
          { required: true, message: "请输入类别编码", trigger: "blur" },
          {
            pattern: this.$reg.letterAndNumReg,
            message: "请输入英文或数字!"
          }
        ],
        className: [
          { required: true, message: "请输入类别名称", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.getBigClassList();
      this.onQuery();
    },
    // 查询
    onQuery() {
      this.getClassList(this.queryData);
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
    // 获取大类列表
    getBigClassList(param) {
      this.$api.getBigClassList(param).then(resData => {
        if (resData.code == 200) {
          this.bigClassList = resData.data;
          if (this.bigClassList.length == 0) {
          }
        }
      });
    },
    // 根据销售大类获取类别树
    getClassTree(param, type) {
      this.treeLoding = true;
      this.$api.getClassTree(param).then(resData => {
        if (resData.code == 200) {
          if (type == "build") {
            this.buildBigClassTeeData = resData.data;
          } else {
            this.bigClassTeeData = resData.data;
          }
        }
        this.treeLoding = false;
      });
    },
    // 获取类别管理列表
    getClassList(param) {
      this.tableLoding = true;
      this.$api
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
    classAdd(param) {
      this.$api.classAdd(param).then(resData => {
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
    classUpdate(param) {
      this.$api.classUpdate(param).then(resData => {
        if (resData.code == 200) {
          this.getClassList({
            uid: this.currentSelectedUid
          });
        }
      });
    },
    // 删除
    classDelete(param) {
      this.$api.classDelete(param).then(resData => {
        if (resData.code == 200) {
          this.getClassList({
            uid: this.currentSelectedUid
          });
        }
      });
    },
    // 上移
    classUp(param) {
      this.$api.classUp(param).then(resData => {
        if (resData.code == 200) {
          this.getClassList({
            uid: this.currentSelectedUid
          });
        }
      });
    },
    // 下移
    classDown(param) {
      this.$api.classDown(param).then(resData => {
        if (resData.code == 200) {
          this.getClassList({
            uid: this.currentSelectedUid
          });
        }
      });
    },
    // 回选
    classDetail(param) {
      this.$api.classDetail(param).then(resData => {
        if (resData.code == 200) {
          this.changeData.classCode = resData.data.classCode;
        }
      });
    },
    // 修改操作
    handleModification(index, row) {
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
    handleDlete(index, row) {
      console.log(index, row);
      this.classDelete({
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
        bigClassUid: "",
        parentUid: "",
        className: "",
        classCode: "",
        remark: ""
      };
      this.buildSelectedParent.name = "";
      this.changeDialog = true;
      this.isNewBuile = true;
    },
    // 查询树
    handleTreeNodeClick(data) {
      this.currentSelectedUid = data.id;
      this.getClassList({
        uid: this.currentSelectedUid
      });
    },
    // 新建或修改树
    handleBuildTreeNodeClick(data) {
      this.changeData.parentUid = data.id;
      this.buildSelectedParent = data;
    },
    //上拉表格
    handlePullUp(index, row) {
      this.classUp({
        uid: row.uid
      });
    },
    //下拉表格
    handlePullDown(index, row) {
      this.classDown({
        uid: row.uid
      });
      console.log("下拉表格", index, row);
    },
    // 两个元素换位子
    swapArr(arr, currentIndex, targetIndex) {
      arr[currentIndex] = arr.splice(targetIndex, 1, arr[currentIndex])[0];
      return arr;
    }
  }
};
</script>

<style lang="scss">
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