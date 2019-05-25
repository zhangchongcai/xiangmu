<template>
  <el-dialog class="cinema-dialog" width="40%" :title="title" :visible.sync="channelDialog">
    <el-form
      :inline="true"
      :model="queryData"
      label-position="left"
      label-width="80px"
      label-suffix=":"
    >
      <!-- <el-form-item label="渠道名称">
        <el-input v-model="queryData.cinemaName" placeholder="请输入渠道名称"></el-input>
      </el-form-item>
      <el-button @click="handlechannelDialogQuery">搜索</el-button> -->
    </el-form>
    <div class="table-box">
      <el-table
        ref="channelTable"
        :data="tableData"
        height="300"
        @selection-change="handleSelectionchannel"
        stripe
        empty-text="暂无记录"
      >
        <el-table-column type="selection" width="40"></el-table-column>
        <el-table-column
          v-for="item in channelTableColumn"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          :formatter="item.formatter"
        ></el-table-column>
      </el-table>
      <!-- <div class="page-wrap">
        <el-pagination
          :current-page="queryData.page"
          :page-size="queryData.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="channelTotal"
          layout="total, prev, pager, next, jumper"
        ></el-pagination>
      </div> -->
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
      default: "选择渠道"
    },
    //是否多选
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      channelDialog: false,
      //渠道弹窗查询数据
      queryData: {
        cinemaName: "",
        page: 1,
        pageSize: 10
      },

      channelTotal: 0,
      channelTableSelection: [],
      channelTableColumn: [
        {
          label: "渠道名称",
          key: "name"
        },
        {
          label: "渠道编码",
          key: "code"
        },
        {
          label: "公司名",
          key: "company"
        },
      ],

      tableData: [
        // {
        //   channelCode: "CG201904010001",
        //   cinemaName: "辰星测试渠道1",
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
      this.queryBaseChannel(this.queryData);
    },
    handleDialog(flag) {
      this.channelDialog = flag;
    },
    // 获取渠道列表
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
    //渠道弹窗搜索
    handlechannelDialogQuery() {
      this.getMerchannelist(this.queryData);
    },

    //渠道弹窗选择确定
    handleSubmit() {
      this.$emit("onSumit", this.channelTableSelection);
      this.handleDialog(false);
    },
    //选中渠道
    handleSelectionchannel(rows) {
      this.channelTableSelection = rows;
      //不是多选
      if (!this.multiple) {
        if (this.channelTableSelection.length > 1) {
          this.$refs.channelTable.toggleRowSelection(
            this.channelTableSelection[0]
          );
        }
      } else {
      }
    },
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.getMerchannelist(this.queryData);
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.getMerchannelist(this.queryData);
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