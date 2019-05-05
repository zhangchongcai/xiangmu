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
        <el-form-item label="单位类型">
          <el-select v-model="queryData.unitType">
            <el-option label="全部" value></el-option>
            <el-option label="基本单位" value="0"></el-option>
            <el-option label="采购单位" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位编码">
          <el-input v-model="queryData.unitCode" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="单位名称">
          <el-input v-model="queryData.unitName" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
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
      <el-table :data="tableData" stripe v-loading="tableLoding">
        <el-table-column
          v-for="item in tableColumn"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          :formatter="item.formatter"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row,$index}">
            <el-button type="text" size="small" @click.stop="handleModification(row, $index)">修改</el-button>
            <el-button type="text" size="small" @click.stop="handleeDlete(row, $index)">删除</el-button>
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
    <el-dialog
      class="change-dialog"
      :title="isNewBuile ? '新建单位':'修改单位'"
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
        <el-form-item label="单位类型" prop="unitType">
          <el-radio
            v-model="changeData.unitType"
            label="0"
            :disabled="!isNewBuile"
            @change="handleUnitTypeChange"
          >基本单位</el-radio>
          <el-radio
            v-model="changeData.unitType"
            label="1"
            :disabled="!isNewBuile"
            @change="handleUnitTypeChange"
          >采购单位</el-radio>
        </el-form-item>
        <el-form-item label="单位编码" prop="unitCode">
          <el-input v-model="changeData.unitCode" :disabled="!isNewBuile"></el-input>
        </el-form-item>
        <el-form-item label="单位名称" prop="unitName">
          <el-input v-model="changeData.unitName"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="changeData.remark"></el-input>
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
      //查询数据
      queryData: {
        unitType: "",
        unitCode: "",
        unitName: "",
        page: 1,
        pageSize: 10
      },
      tableColumn: [
        {
          label: "单位类型",
          key: "unitType",
          formatter(row, column, cellValue) {
            let result = "";
            switch (row.unitType) {
              case 0:
                result = "基本单位";
                break;
              case 1:
                result = "采购单位";
                break;
            }
            return result;
          }
        },
        {
          label: "单位编码",
          key: "unitCode"
        },
        {
          label: "单位名称",
          key: "unitName"
        },
        {
          label: "备注",
          key: "remark"
        }
      ],
      tableData: [],
      tableLoding: false,
      total: 0,
      //新建or修改数据
      changeData: {
        unitType: "0",
        unitCode: " ",
        unitName: " ",
        remark: " "
      },
      isNewBuile: true,
      changeDialog: false,
      changeRules: {
        unitCode: [
          { required: true, message: "请输入单位编码", trigger: "blur" },
          {
            pattern: this.$reg.letterAndNumReg,
            message: "请输入英文或数字!"
          }
        ],
        unitName: [
          { required: true, message: "请输入单位名称", trigger: "blur" }
        ]
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
    // 获取单位列表
    getUnitLists(param) {
      this.tableLoding = true;
      this.$api
        .queryUnit(qs.stringify(param))
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
    // 新建
    saveUnit(param) {
      this.$api.saveUnit(qs.stringify(param)).then(resData => {
        if (resData.code == 200) {
          this.onQuery();
        }
      });
    },
    // 修改
    updateUnit(param) {
      this.$api.updateUnit(qs.stringify(param)).then(resData => {
        if (resData.code == 200) {
          this.onQuery();
        }
      });
    },
    // 删除
    deleteUnit(param) {
      this.$api.deleteUnit(qs.stringify(param)).then(resData => {
        if (resData.code == 200) {
          this.onQuery();
        }
      });
    },
    // 回选
    seletUnitByuid(param) {
      this.$api.seletUnitByuid(qs.stringify(param)).then(resData => {
        if (resData.code == 200) {
        }
      });
    },
    // 生成单位编码
    generateUnitCode(param) {
      this.$api.generateUnitCode(qs.stringify(param)).then(resData => {
        if (resData.code == 200) {
          this.changeData.unitCode = resData.data;
        }
      });
    },
    // 查询
    onQuery() {
      this.getUnitLists(this.queryData);
    },
    // 修改操作
    handleModification(row, index) {
      const { unitType, unitCode, unitName, remark } = row;
      this.changeData.unitType = unitType.toString();
      this.changeData.unitCode = unitCode;
      this.changeData.unitName = unitName;
      this.changeData.remark = remark;
      this.changeData.uid = row.uid;
      this.changeDialog = true;
      this.isNewBuile = false;
    },
    // 删除操作
    handleeDlete(row, index) {
      this.deleteUnit({
        uid: row.uid
      });
    },
    //确认提交修改
    handleModificationSubmit() {
      this.$refs["changeForm"].validate(valid => {
        if (valid) {
          if (this.isNewBuile) {
            this.saveUnit(this.changeData);
          } else {
            this.updateUnit(this.changeData);
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
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.onQuery();
      console.log(`当前页: ${val}`);
    },
    handleUnitTypeChange(val) {
      if (this.isNewBuile) {
        this.generateUnitCode({
          unitType: this.changeData.unitType
        });
      }
    },
    handleNewBuilt() {
      this.changeData = {
        unitType: "0",
        unitCode: "",
        unitName: "",
        remark: ""
      };
      this.generateUnitCode({
        unitType: this.changeData.unitType
      });
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