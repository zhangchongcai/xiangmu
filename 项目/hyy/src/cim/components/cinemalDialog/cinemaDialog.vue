<template>
  <el-dialog class="cinema-dialog" width="40%" :title="title" :visible.sync="cinemalDialog">
    <el-form
      :inline="true"
      :model="queryData"
      label-position="left"
      label-width="80px"
      label-suffix=":"
    >
      <el-form-item label="影院名称">
        <el-input v-model="queryData.cinemaName" placeholder="请输入影院名称"></el-input>
      </el-form-item>
      <el-button @click="handleCinemalDialogQuery">搜索</el-button>
    </el-form>
    <div class="table-box">
      <el-table
        ref="cinemalTable"
        :data="cinemalTableData"
        height="300"
        @selection-change="handleSelectionCinemal"
        stripe
        empty-text="暂无记录"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column
          v-for="item in cinemalTableColumn"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          :formatter="item.formatter"
        ></el-table-column>
      </el-table>
      <div class="page-wrap">
        <el-pagination
          :current-page="queryData.page"
          :page-size="queryData.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="cinemalTotal"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
    <span slot="footer">
      <el-button @click="handleDialog(false)">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    //是否多选
    title: {
      type: String,
      default: "选择影院"
    },
    //是否多选
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      cinemalDialog: false,
      //门店弹窗查询数据
      queryData: {
        cinemaName: "",
        page: 1,
        pageSize: 10
      },

      cinemalTotal: 0,
      cinemalTableSelection: [],
      cinemalTableColumn: [
        {
          label: "影院名称",
          key: "name"
        },
        {
          label: "专资编码",
          key: "code"
        },
        {
          label: "城市地区",
          key: "areaName"
        }
      ],

      cinemalTableData: [
        // {
        //   cinemalCode: "CG201904010001",
        //   cinemaName: "辰星测试影院1",
        //   areaName: "北京"
        // },
      ]
    };
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    init() {
      this.getMerCinemaList(this.queryData);
    },
    handleDialog(flag) {
      this.cinemalDialog = flag;
    },
    // 获取门店列表
    getMerCinemaList(param = {}) {
      this.$cimList.merCinemaList(param).then(resData => {
        if (resData.code == 200) {
          this.cinemalTableData = resData.data.list;
          this.cinemalTotal = resData.data.total;
        }
      });
    },
    //影院弹窗搜索
    handleCinemalDialogQuery() {
      this.getMerCinemaList(this.queryData);
    },

    //影院弹窗选择确定
    handleSubmit() {
      this.$emit("onSumit", this.cinemalTableSelection);
      this.handleDialog(false);
    },
    //选中影院
    handleSelectionCinemal(rows) {
      this.cinemalTableSelection = rows;
      //不是多选
      if (!this.multiple) {
        if (this.cinemalTableSelection.length > 1) {
          this.$refs.cinemalTable.toggleRowSelection(
            this.cinemalTableSelection[0]
          );
        }
      } else {
      }
    },
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.getMerCinemaList(this.queryData);
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.getMerCinemaList(this.queryData);
      console.log(`当前页: ${val}`);
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.cinema-dialog {
  .el-form-item__content {
    width: 250px;
  }
  .el-button {
    margin-top: 5px;
  }
}
</style>