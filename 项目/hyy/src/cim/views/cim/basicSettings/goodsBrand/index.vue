<template>
  <div class="retail-style goods-brand">
<!--      <div class="breadcrumb">-->
<!--          <el-breadcrumb separator-class="el-icon-arrow-right">-->
<!--              <el-breadcrumb-item>零售管理</el-breadcrumb-item>-->
<!--              <el-breadcrumb-item>运营管理</el-breadcrumb-item>-->
<!--              <el-breadcrumb-item>品牌管理</el-breadcrumb-item>-->
<!--          </el-breadcrumb>-->
<!--      </div>-->
    <div class="common-header">
      <el-form
        :inline="true"
        :model="queryData"
        label-position="right"
        label-width="80px"
        label-suffix="："
      >
        <el-form-item label="品牌编码">
          <el-input v-model="queryData.code" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="品牌名称">
          <el-input v-model="queryData.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-button class="query-btn" type="primary" @click="onQuery">查询</el-button>
      </el-form>
    </div>
    <!-- <div class="common-new-built">
      <el-button type="primary" size="small" plain @click="handleNewBuilt">新建</el-button>
    </div> -->
    <div>
      <el-table :data="tableData" v-loading="tableLoding" stripe>
        <el-table-column
          v-for="item in tableColumn"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
        >
          <template slot-scope="{row}" name="header">
              <div v-if="item.key=='logoUrl'">
                 <img class="logo-url" :src="row[item.key]" alt="">
              </div>
              <div v-else>
                <span>{{row[item.key]}}</span>
              </div>
            </template>
        </el-table-column>
        <!-- <el-table-column label="操作">
          <template slot-scope="{row,$index}">
            <el-button type="text" size="small" @click.stop="handleModification(row, $index)">修改</el-button>
            <el-button type="text" size="small" @click.stop="handleeDlete(row, $index)">删除</el-button>
          </template>
        </el-table-column> -->
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
    <el-dialog
      class="change-dialog"
      :title="isNewBuile ? '新建单位':'修改单位'"
      :visible.sync="changeDialog"
      width="400px"
    >
      <el-form
        :inline="true"
        :model="changeData"
        ref="changeForm"
        label-position="left"
        label-width="100px"
        label-suffix=":"
        :rules="changeRules"
      >
        <el-form-item label="品牌编码" prop="code">
          <el-input v-model="changeData.code" :disabled="!isNewBuile"></el-input>
        </el-form-item>
        <el-form-item label="品牌名称" prop="name">
          <el-input v-model="changeData.name"></el-input>
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
    import {letterAndNumReg} from "cim/util/reg.js";

    export default {
  mixins: [mixin],
  data() {
    return {
      //查询数据
      queryData: {
        code: "",
        name: "",
        page: 1,
        pageSize: 10
      },
      total: 0,
      tableColumn: [
        {
          label: "品牌编码",
          key: "code"
        },
        {
          label: "品牌名称",
          key: "name"
        },
        {
          label: "中文名称",
          key: "cnName"
        },
        {
          label: "英文名称",
          key: "enName"
        },
        {
          label: "首字母",
          key: "firstLetter"
        },
        {
          label: "品牌LOGO",
          key: "logoUrl"
        },
      ],
      tableData: [],
      tableLoding: false,
      //新建or修改数据
      changeData: {
        code: "",
        name: "",
        remark: ""
      },
      isNewBuile: true,
      changeDialog: false,
      changeRules: {
        code: [
          { required: true, message: "请输入品牌编码", trigger: "blur" },
          {
            pattern: letterAndNumReg,
            message: "请输入英文或数字!"
          }
        ],
        name: [{ required: true, message: "请输入品牌名称", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.onQuery();
    },
    // 查询
    onQuery() {
      this.getBrandLists(this.queryData);
      // console.log(this.queryData);
    },
    // 获取品牌列表
    getBrandLists(param) {
      try {
        this.tableLoding = true;
        this.$cimList
          .findBrandList(param)
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
      } catch (err) {
        this.tableLoding = false;
      }
    },
    // 新建
    saveBrand(param) {
      this.$api.saveBrand(param).then(resData => {
        if (resData.code == 200) {
          this.onQuery();
        }
      });
    },
    // 回选
    getBrand(param) {
      this.$api.getBrand(qs.stringify(param)).then(resData => {
        if (resData.code == 200) {
          this.changeData.code = resData.data.code;
        }
      });
    },
    // 修改
    updateBrand(param) {
      this.$api.updateBrand(param).then(resData => {
        if (resData.code == 200) {
          this.onQuery();
        }
      });
    },
    // 删除
    delBrand(param) {
      this.$api.delBrand(qs.stringify(param)).then(resData => {
        if (resData.code == 200) {
          this.onQuery();
        }
      });
    },
    // 修改操作
    handleModification(row, index) {
      console.log(index, row);
      const { code, name, remark, id } = row;
      this.changeData.code = code;
      this.changeData.name = name;
      this.changeData.remark = remark;
      this.changeData.id = id;
      this.changeDialog = true;
      this.isNewBuile = false;
    },
    // 删除操作
    handleeDlete(row, index) {
      this.delBrand({
        code: row.code
      });
    },
    //确认提交修改
    handleModificationSubmit() {
      this.$refs["changeForm"].validate(valid => {
        if (valid) {
          if (this.isNewBuile) {
            this.saveBrand(this.changeData);
          } else {
            this.updateBrand(this.changeData);
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
      this.changeData = {
        code: "",
        name: "",
        remark: ""
      };
      this.getBrand();
      this.changeDialog = true;
      this.isNewBuile = true;
    }
  }
};
</script>

<style lang="scss">
  @import "../../../../assets/css/element-common.scss";
  @import "../../../../assets/css/common.scss";
  .goods-brand{
    .logo-url{
      width: 100px;
    }
    .change-dialog {
      .el-form--inline .el-form-item {
        width: 100%;
      }
      .el-form-item__content {
        width: 70%;
      }
  }
}
</style>