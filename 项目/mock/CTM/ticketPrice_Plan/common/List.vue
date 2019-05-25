<template>
  <div>
    <div class="ticket-price-plan-header">
      <div class="search-wrap">
        <span> 方案名称：</span>
        <el-input
          size='small'
          placeholder="请输入方案名称"
          prefix-icon="el-icon-search"
          v-model="name"
        >
        </el-input>
      </div>
      <div class="search-wrap">
        <span>营销渠道：</span>
        <el-input
          size='small'
          placeholder="请输入营销渠道"
          prefix-icon="el-icon-search"
          v-model="channel"
        >
        </el-input>
      </div>
      <div class="search-wrap plan-size">
        <span>方案状态：</span>
        <el-select
          v-model="status"
          placeholder="请选择方案状态"
        >
          <el-option
            label="有效"
            value="1"
          ></el-option>
          <el-option
            label="无效"
            value="0"
          ></el-option>
          <el-option
            label="全部"
            value=""
          ></el-option>
        </el-select>
      </div>
      <div class="button-wrap">
        <el-button
          type="primary"
          size="small"
          @click="getDatas"
        >查询</el-button>

      </div>
      <div class="button-wrap">
        <el-button
          type="primary"
          size="small"
          plain
        >重置</el-button>

      </div>
    </div>
    <div class="ticket-price-plan-table">
      <div class="ticket-price-plan-tableNew">
        <div class="creat-tickPrice">
          <el-button
            type="primary"
            size="small"
            plain
            @click="newticketPlan"
          >新建</el-button>
        </div>

      </div>
      <el-table
        :data="tableData"
        :row-class-name="tableRowClassName"
        style="width: 100%"
      >
        <!-- <el-table-column
          prop="date"
          label="方案编码"
          width="180"
        >
        </el-table-column> -->
        <el-table-column
          prop="name"
          label="方案名称"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="channelNames"
          label="适用渠道"
        >
        </el-table-column>
        <el-table-column
          prop="disVersion"
          label="影片版本"
        >
        </el-table-column>
        <el-table-column
          prop="hallType"
          label="适用影厅"
        >
        </el-table-column>
        <el-table-column
          prop="priority"
          label="优先级"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status ==1">
              有效
            </span>
            <span v-else>无效</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleScan(scope.$index, scope.row)"
            >查看</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
            >修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-wrap">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10,20, 30]"
        :page-size="size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>

  </div>

</template>
<script>
export default {
  data() {
    return {
      channel: "",
      name: "",
      status: "",
      //交互部分
      currentPage: "" || 0,
      total: "" || 1,
      size: '' || 10,
      pages: "" || 1,
      tableData: [],
      pickerOptions2: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      value7: ""
    };
  },
  created() {
    this.getDatas();
  },
  methods: {
    getDatas() {
      let self = this;
      console.log("value7", self.value7);
      let params = {
        channel: self.channel,
        status: self.status,
        name: self.name,
        size: self.size || 10,
        currentPage: self.currentPage || 0
      };
      self.$api
        .ticketPriceplanList(params)
        .then(ret => {
          if (ret.data) {
            let result = ret.data;
            console.log(result);
            console.log("嘻嘻嘻嘻嘻嘻嘻嘻寻寻寻寻寻寻寻寻寻", result.records);

            self.tableData = result.records;
            self.currentPage = result.current;
            self.total = result.total;
            self.size = result.size;
            self.pages = result.pages;
            //重置搜索参数
            self.channel = "";
            self.status = "";
            self.name = "";
          }
        })
        .catch(() => {
          console.log("哪里出错了，检擦一下哥哥");
        });
    },
    //交互部分
    handleSizeChange(val) {
      let self = this;
      self.size = val;
      console.log(`每页 ${val} 条`);
      self.getDatas();
    },
    handleCurrentChange(val) {
      let self = this;
      self.currentPage = val;
      console.log(`当前页: ${val}`);
      self.getDatas();
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return "warning-row";
      } else {
        return "success-row";
      }
      return "";
    },
    handleScan(index, row) {
      this.$router.push({
        path: "./scan",
         query: {
          id: row.id,
        }
      });
    },
    handleEdit(index, row) {
      this.$router.push({
        path: "./edit",
        query: {
          id: row.id,
        }
      });
    },
    newticketPlan() {
      this.$router.push({
        path: "./add",
      });
    }
  }
};
</script>
<style lang="scss">
.ticket-price-plan-header {
  width: 100%;
  padding-top: 25px;
  padding-bottom: 25px;
  padding-left: 24px;
  background: #f5f5f5;
  box-sizing: border-box;
  .search-wrap {
    display: inline-block;
    height: 32px;
    margin-left: 32px;
   
    .el-input {
      width: 264px;
    }
    span {
      color: #666666;
      font-size: 12px;
    }
  }
   .plan-size{
      .el-input {
      width: 160px;
    }
    }
  .button-wrap {
    margin-left: 50px;
    display: inline-block;
    margin-top:15px;
  }
}
.ticket-price-plan-table {
  .ticket-price-plan-tableNew {
    width: 100%;

    height: 32px;
    .creat-tickPrice {
      margin-top: 11px;
      margin-right: 22px;
      float: right;
      display: inline-block;
    }
  }
  //   margin-left: 174px;
  .el-table .warning-row {
    background: #f5f5f5;
  }

  .el-table .success-row {
    background: #ffffff;
  }
  .el-table tr {
    background: #f2f4fd;
  }
}
</style>
