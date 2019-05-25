<template>
  <div>

    <div class="download-film-header">
      <div class="search-wrap">
        <span> 影片编码：</span>
        <el-input
          size='small'
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="movieCode"
        >
        </el-input>
      </div>
      <div class="search-wrap">
        <span>影片名称：</span>
        <el-input
          size='small'
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="movieName"
        >
        </el-input>
      </div>
       <div class="search-wrap">
         <el-checkbox v-model="is_public_value" size="medium">正在上映</el-checkbox>
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
        >重置</el-button>

      </div>
    </div>
    <div class="download-film-table">
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
          label="影片类别"
        >
        </el-table-column>
        <el-table-column
          prop="datePublicShow"
          label="公映日期"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
            >下载至影院库 </el-button>
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
<script type="text/javascript">
export default {
  data() {
    return {
       is_public_value:false,
      tableData: [],
      movieCode:"",
      movieName:'',
      //交互部分
      currentPage:  1,
      total: "" || 1,
      size: 10,
      pages: "" || 1
    };
  },
  created() {
    let self = this;
    self.getDatas();
  },
  methods: {
     resetHandle(){
      let self = this;
      self.is_public_value = !self.is_public_value ;
      self.movieCode = "";
      self.movieName = "";
     
    },
    getDatas() {
      let self = this;
      console.log(':self.currentPage',self.currentPage)
      let params = {
        is_public_value:self.is_public_value == true ? 1 : 0,
        movieCode: self.movieCode,
        movieName:self.movieName,
        size:self.size || 10,
        currentPage:self.currentPage || 1,
      };
      self.$api
        .DownloadmovieList(params)
        .then(ret => {
          console.log("retsssssssssss", ret.data);

          if(ret.data){
            let result = ret.data;
            self.tableData = result.records;
            self.currentPage = result.current;
            self.total = result.total;
            self.size = result.size;
            self.pages = result.pages;
            //重置搜索参数
            // self.movieCode ='';
            // self.movieName=''
          }
          
        })
        .catch(() => {
          console.log("哪里出错了，检擦一下哥哥");
        });
    },
    //***************************** */
     //交互模块
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
          movieId:row.movieCode
        }
      });
    },
    handleEdit(index,row) {
      console.log('row数据',row)
      this.$router.push({
        path: "edit",
          query:{
          movieId:row.movieCode
        }
      });
    }
  }
};
</script>
<style  type="text/css"  lang='scss' >
.download-film-header {
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
    margin-left: 31.4px;
    display: inline-block;
  }
}
.download-film-table {
  // margin-left: 174px;
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
