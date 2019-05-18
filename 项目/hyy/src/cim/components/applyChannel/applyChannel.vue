<template>
  <div>
    <el-radio-group v-model="defaultSelected" @change="handleApplyChange">
      <el-radio v-for="(item) in radios" @click.native="(item)" :label="item.type" :key="item.type">
        {{item.label}}
        <span class="apply-tag" v-if="item.type!='1' && item.type == defaultSelected">
          <el-input
            class="input"
            v-model="item.name"
            placeholder="请选择"
            :disabled="item.name ?true:false"
            @focus="setCheckedKeys(item.type)"
          >
            <i
              slot="suffix"
              v-if="item.name"
              class="el-icon-close icon"
              @click.stop="handleDelete(item)"
            ></i>
          </el-input>
          <el-button @click.stop="setCheckedKeys(item.type)" v-if="item.name">编辑</el-button>
        </span>
      </el-radio>
    </el-radio-group>
    <!-- 选择门店 -->
    <el-dialog :title="title" :visible.sync="applyDialog">
      <div>
        <el-form :inline="true" label-position="right" label-suffix=":">
          <el-form-item :label="title">
            <el-input placeholder="请输入你要查询的内容" v-model="filterQueryValue">
              <el-button slot="append" icon="el-icon-search" @click="handleQuery(filterQueryValue)"></el-button>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="apply-tree">
        <el-row>
          <el-col :span="24">
            <!-- <el-table
              ref="materialTable"
              :data="tableData"
              height="300"
              @selection-change="handleSelectionMaterial"
              stripe
              empty-text="暂无记录"
            >
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column
                v-for="item in tableColumn"
                :key="item.key"
                :prop="item.key"
                :label="item.label"
                :formatter="item.formatter"
              ></el-table-column>
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
            </div> -->
            <el-tree
              :data="sourceData"
              :props="defaultProps"
              show-checkbox
              node-key="id"
              :default-expanded-keys="defaultCheckedKys"
              :filter-node-method="filterNode"
              ref="applyTree"
            ></el-tree>
          </el-col>
        </el-row>
      </div>
      <span slot="footer">
        <el-button @click="applyDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleApplySubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String
      // default: false
    },
    defaultSelected: {
      type: [String, Number]
      // default: false
    },
    radios: {
      type: Array,
      default: [],
      required: true
    }
  },
  data() {
    return {
      // type: this.defaultSelected,
      queryData: {
        currentPage: 1,
        pageSize: 20
      },
      filterQueryValue: "", //筛选值
      applyDialog: false,
      defaultCheckedKys: [],
      currentChecked: [],
      sourceData: [
        {
          id: 1,
          label: "一级 1",
          children: [
            {
              id: 4,
              label: "二级 1-1",
              children: [
                {
                  id: 9,
                  label: "渠道一"
                },
                {
                  id: 10,
                  label: "渠道二"
                }
              ]
            }
          ]
        },
        {
          id: 2,
          label: "一级 2",
          children: [
            {
              id: 5,
              label: "大学城影院"
            },
            {
              id: 6,
              label: "二级 2-2"
            }
          ]
        },
        {
          id: 3,
          label: "一级 3",
          children: [
            {
              id: 7,
              label: "二级 3-1"
            },
            {
              id: 8,
              label: "二级 3-2"
            }
          ]
        }
      ],
      tableData: [],
      selectedtableData: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      tableColumn: [
        {
          label: "商品名称",
          key: "name"
        },
        {
          label: "商品编码",
          key: "code"
        },
        {
          label: "SKU编码",
          key: "skuCode"
        },
        {
          label: "速记代码",
          key: "shorthandCode"
        },
        {
          label: "商品规格",
          key: "attrValue"
        },
        {
          label: "基本单位",
          key: "unitName"
        }
      ]
    };
  },
  mounted() {
    this.queryBaseChannel();
  },
  methods: {
    // 获取基本单位
    queryBaseChannel(param) {
      this.$cimList.headquartersGoods
        .queryBaseChannel(param)
        .then(resData => {
          if (resData.code == 200) {
            this.tableData = resData.data;
          }
        })
        .catch(err => {});
    },
    //切换
    handleApplyChange(type) {
      let tempArr = this.radios.filter(item => {
        return item.type == type;
      });
      this.currentChecked = tempArr[0];
      this.$emit("onCheckedNodes", {
        type: this.defaultSelected,
        value: this.currentChecked.value || []
      });
      //  this.$emit("onRadioChange", this.type);
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    setCheckedKeys() {
      this.applyDialog = true;
      this.$nextTick(() => {
        this.defaultCheckedKys = this.currentChecked.checkedKys;
        this.$refs.applyTree.setCheckedKeys(this.defaultCheckedKys);
      });
      console.log(this.defaultCheckedKys);
    },
    handleSelectionMaterial(value) {
      console.log(value)
    },
    handleDelete(item) {
      item.name = "";
      item.value = [];
      item.checkedKys = [];
      let tempObj = {
        type: this.defaultSelected,
        value: []
      };
      this.$emit("onCheckedNodes", tempObj);
      // console.log(this.radios);
    },
    // 筛选
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //查询
    handleQuery(val) {
      this.$refs.applyTree.filter(val);
    },
    //选择
    handleApplySubmit() {
      let checkedNodes = this.$refs.applyTree.getCheckedNodes(true);
      let tempObj = {
        type: this.defaultSelected,
        value: checkedNodes
      };
      this.$emit("onCheckedNodes", tempObj);
      this.applyDialog = false;
    }
  },
  computed: {
    showCheckedNodes() {}
  },
  watch: {
    filterQueryValue(val) {
      this.$refs.applyTree.filter(val);
    }
  }
};
</script>


<style lang="scss">
.apply-tree {
  margin-top: 10px;
  margin-bottom: 10px;
}
.apply-tag {
  margin-left: 10px;
  margin-right: 10px;
  .input {
    width: 200px;
  }
  .icon {
    cursor: pointer;
    font-size: 18px;
    margin-top: 6px;
  }
  .el-icon-more {
    font-size: 22px;
    position: absolute;
  }
}
</style>