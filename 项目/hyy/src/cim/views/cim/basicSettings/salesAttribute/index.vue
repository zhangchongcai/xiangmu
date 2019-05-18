<template>
  <div class="salesAttribute-box">
    <div class="common-header">
      <el-form
        :inline="true"
        :model="queryData"
        label-position="right"
        label-width="100px"
        label-suffix=":"
      >
        <el-form-item label="销售属性名称">
          <el-input v-model="queryData.name" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="属性类型">
          <el-select v-model="queryData.attrType">
            <el-option label="全部" value></el-option>
            <el-option label="关键属性" value="1"></el-option>
            <el-option label="销售属性" value="2"></el-option>
            <el-option label="扩展属性" value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="query-btn-box">
          <el-button type="primary" @click="onQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- <div class="common-new-built">
      <el-button type="primary" size="small" plain @click="handleNewBuilt">新建</el-button>
    </div> -->
    <div>
      <el-table :data="tableData" stripe v-loading="tableLoding">
        <el-table-column
          v-for="item in tableColumn"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          :formatter="item.formatter"
        ></el-table-column>
        <!-- <el-table-column label="操作">
          <template slot-scope="{row,$index}">
            <el-button type="text" size="small" @click.stop="handleModification($index, row)">修改</el-button>
            <el-button type="text" size="small" @click.stop="handleDlete($index, row)">删除</el-button>
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
      :title="isNewBuile ? '新建销售属性':'修改销售属性'"
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
        <el-form-item label="状态" prop="status">
          <el-radio v-model="changeData.status" label="1">启用</el-radio>
          <el-radio v-model="changeData.status" label="0">停用</el-radio>
        </el-form-item>
        <el-form-item label="属性名称" prop="name">
          <el-input v-model="changeData.name"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="attrType">
          <el-select v-model="changeData.attrType" placeholder>
            <el-option label="单选" value="1"></el-option>
            <el-option label="多选" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="选项值"
          v-for="(item,index) in changeData.attributeItemEntityList"
          :prop="'attributeItemEntityList.' + index + '.attrValue'"
          :key="item.id || item.uid"
          :class="{'no-label':index != 0}"
        >
          <el-input
            v-model="item.attrValue"
            autosize
            :class="{attrIalueInput:changeData.attributeItemEntityList.length>1}"
          ></el-input>
          <el-button
            type="text"
            size="small"
            @click.stop="handleAttrValueDlete(index)"
            v-if="changeData.attributeItemEntityList.length>1"
          >删除</el-button>
        </el-form-item>
        <el-form-item label="新增" class="no-label">
          <el-button type="primary" size="small" plain @click="handleAttrValueAdd">新增</el-button>
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
        name: '',
        attrType: '',
        page: 1,
        pageSize: 10
      },
      //表头
      tableColumn: [
        {
          label: "属性编码",
          key: "code",
        },
        {
          label: "属性类型",
          key: "attrType",
          formatter(row, column, cellValue) {
              let result = "";
              switch (row.attrType) {
                case 1:
                  result = "关键属性";
                  break;
                case 2:
                  result = "销售属性";
                  break;
                case 3:
                  result = "扩展属性";
                  break;
              }
              return result;
            }
        },
        {
          label: "属性名称",
          key: "name"
        },
        {
          label: "输入类型",
          key: "valueType",
          formatter(row, column, cellValue) {
            let result = "";
            switch (row.valueType) {
              case 1:
                result = "普通";
                break;
              case 2:
                result = "单选";
                break;
              case 3:
                result = "多选";
                break;
            }
            return result;
          }
        },
        {
          label: "属性值",
          key: "attrValue",
        },
      ],
      //表格数据
      tableData: [],
      tableLoding: false,
      total: 0,
      changeDialog: false,
      isNewBuile: true,
      //新建or修改数据
      changeData: {
        status: "1",
        name: "",
        attrType: "2",
        attributeItemEntityList: [
          {
            attrValue: "",
            id: Math.random(),
            delFlag: 0
          }
        ]
      },
      attriListSource: [],
      //表单验证规则
      changeRules: {
        name: [{ required: true, message: "请输入属性名称", trigger: "blur" }]
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
      this.getSalesAttributes(this.queryData);
      console.log(this.queryData);
    },
    // 查询列表
    getSalesAttributes(param) {
      // this.tableLoding = true;
      this.$cimList
        .selectSalesAttribute(param)
        .then(resData => {
          if (resData.code == 200) {
            // this.tableData = resData.data.list;
            this.tableData = resData.data.list.map(item => {
              if (item.attributeItemEntityList) {
                item.attrValue = item.attributeItemEntityList
                  .map(attrItem => {
                    return attrItem.attrValue;
                  }).join('/')
              }
              return item;
            });
            // console.log( this.tableData)
            this.total = resData.data.total;
          }
          this.tableLoding = false;
        })
        .catch(() => {
          this.tableLoding = false;
        });

      // console.log(resData);
    },
    // 新建
    saveSlesAttribute(param) {
      this.$cimList.saveSlesAttribute(param).then(resData => {
        if (resData.code == 200) {
          this.onQuery();
        }
      });
    },
    // 修改
    updateSalesAttribute(param) {
      this.$cimList.updateSalesAttribute(param).then(resData => {
        if (resData.code == 200) {
          this.onQuery();
        }
      });
    },
    // 删除
    deleteSalesAttribute(param) {
      this.$cimList.deleteSalesAttribute(qs.stringify(param)).then(resData => {
        if (resData.code == 200) {
          this.onQuery();
        }
      });
    },
    // 修改操作
    handleModification(index, row) {
      // console.log(index, row);
      let { uid, status, name, attrType, attributeItemEntity } = row;
      this.changeData.uid = uid;
      this.changeData.status = status.toString();
      this.changeData.name = name;
      this.changeData.attrType = attrType.toString();
      //处理选项值
      this.changeData.attributeItemEntityList = attributeItemEntity;
      this.changeDialog = true;
      this.isNewBuile = false;
      this.attriListSource = JSON.parse(JSON.stringify(attributeItemEntity)); //保存原始数据，用来修改属性的时候匹配删除的属性值
      console.log(this.attriListSource);
    },
    // 删除操作
    handleDlete(index, row) {
      this.deleteSalesAttribute({
        uid: row.uid
      });
    },
    //确认提交修改
    handleModificationSubmit() {
      this.$refs["changeForm"].validate(valid => {
        if (valid) {
          if (this.isNewBuile) {
            this.saveSlesAttribute(this.changeData);
          } else {
            console.log(this.changeData);
            let attributeLists = this.handleAttributeData(
              this.attriListSource,
              this.changeData.attributeItemEntityList
            );
            let param = JSON.parse(JSON.stringify(this.changeData));
            param.attributeItemEntityList = attributeLists;
            this.updateSalesAttribute(param);
          }
          this.changeDialog = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      // console.log(this.changeData);
    },
    handleAttributeData(sources = [], operationeds = []) {
      let tepmArr = [...sources, ...operationeds].filter(item => {
        return item.attrValue;
      });
      let hash = {};
      // 去除id相同的数组成员
      let arr = tepmArr.reduce((item, next) => {
        hash[next.id] ? "" : (hash[next.id] = true && item.push(next));
        return item;
      }, []);
      return arr;
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
        status: "1",
        name: "",
        attrType: "2",
        attributeItemEntityList: [
          {
            attrValue: "",
            id: Math.random(),
            delFlag: 0
          }
        ]
      };
      this.changeDialog = true;
      this.isNewBuile = true;
    },
    //新增选项值
    handleAttrValueAdd() {
      this.changeData.attributeItemEntityList.push({
        attrValue: "",
        id: Math.random(),
        delFlag: 0
      });
    },
    //删除属性值
    handleAttrValueDlete(index) {
      this.$set(this.attriListSource[index], "delFlag", 1);
      this.changeData.attributeItemEntityList.splice(index, 1);
    }
  }
};
</script>

<style lang="scss">
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
.attrIalueInput {
  width: 70%;
}
.no-label {
  .el-form-item__label {
    opacity: 0;
  }
}
</style>