<template>
  <div>
    <div class="ciniema-stock-header">
      <div class="search-wrap">
        <span> 影片名称：</span>
        <el-input
          size='small'
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="movieName"
        >
        </el-input>
      </div>
      <div class="search-wrap">
        <span>影片编号：</span>
        <el-input
          size='small'
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="movieCode"
        >
        </el-input>
      </div>
      <div class="search-wrap">
        <span>首映日期</span>
        <el-date-picker
          v-model="value7"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions2"
        >
        </el-date-picker>
      </div>
      <div class="search-wrap">
         <el-checkbox v-model="is_public_value" size="medium" >正在上映</el-checkbox>
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
          @click="resetHandle"
          plain
        >重置</el-button>

      </div>
    </div>
    <div class="cinema-stock-table">
      <el-table
        :data="tableData"
        :row-class-name="tableRowClassName"
        style="width: 100%"
      >
        <el-table-column
          prop="movieCode"
          label="影片编码"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="movieName"
          label="影片名称"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="disVersion"
          label="发行版本"
        >
        </el-table-column>
        <el-table-column
          prop="movieClass"
          label="故事分类"
        >
        </el-table-column>
        <el-table-column
          prop="movieDescLanguage"
          label="语言"
        >
        </el-table-column>
        <el-table-column
          prop="timeLong"
          label="时长（分钟）"
        >
        </el-table-column>
        <el-table-column
          prop="dateShowFirst"
          label="首映日期"
          width="150"
        >
        </el-table-column>
        <el-table-column
          prop="dateShowOff"
          label="下映日期"
           width="150"
        >
        </el-table-column>
        <el-table-column
          label="状态"
        >
         <template slot-scope="scope">
           <span v-if="new Date(scope.row.dateShowFirst).getTime() - new Date(scope.row.dateShowOff).getTime() < 0">
             正在上映
           </span>
           <span v-else>下映</span>
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
        :page-sizes="[10, 20, 30]"
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
      is_public_value:false,
      movieCode: "",
      movieName: "",
      cinemaUid:"e5330271-5357-4340-b7af-10d1872fb71d",
      tableData: [],
       //交互部分
      currentPage: "" || 1,
      total: "" || 1,
      size: 10,
      pages: "" || 1,
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
 
  methods: {
    resetHandle(){
      let self = this;
      self.is_public_value = !self.is_public_value ;
      self.movieCode = "";
      self.movieName = "";
      self.value7 = [];
    },
    getDatas() {
      let self = this;
      console.log('value7',self.value7)
      let params = {
        // cinemaUid:self.cinemaUid,
        is_public_value:self.is_public_value == true ? 1 : 0,
        movieCode: self.movieCode,
        movieName: self.movieName,
        dateShowFirst:self.value7[0],
        dateShowOff:self.value7[1],
        size:self.size || 10,
        currentPage:self.currentPage || 1,
      };
      self.$api
        .cinemaStockList(params)
        .then(ret => {
          console.log("retsssssssssss", ret.data);

          if (ret.data) {
            let result = ret.data;
            self.tableData =  result.records;
            self.currentPage = result.current;
            self.total = result.total;
            self.size = result.size;
            self.pages = result.pages;
            //重置搜索参数
            // self.movieCode = "";
            // self.movieName = "";
          }
        })
        .catch(() => {
          console.log("哪里出错了，检擦一下哥哥");
        });
    },
    //交互部分方法
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
    handleScan(index,row) {
       this.$router.push({
        path: "scan",
        query:{
          movieCode:row.movieCode,
          uid_cinema:row.uidCinema
        }
      });
    },
    handleEdit(index,row) {
      console.log('row.uidCinema',row.uidCinema)
      this.$router.push({
        path: "edit",
        query:{
         movieCode:row.movieCode,
          uid_cinema:row.uidCinema
        }
      });
    }
  },
  
  created() {
    this.getDatas();
  }
};
</script>
<style lang="scss">
.ciniema-stock-header {
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
  .button-wrap {
    margin-top:15px;
    margin-left: 31.4px;
    display: inline-block;
  }
}
.cinema-stock-table {
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
