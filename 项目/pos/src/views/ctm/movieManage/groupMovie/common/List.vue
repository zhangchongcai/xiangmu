<template>
  <div>

    <div class="download-film-header">
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
        <span>公映日期</span>
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
      <div class="search-wrap plan-size">
        <span>影片状态：</span>
        <el-select
          v-model="status"
          placeholder="请选择影片状态："
        >
          <el-option
            label="已下映"
            value='2'
          ></el-option>
          <el-option
            label="上映中"
            value='3'
          ></el-option>
           <el-option
            label="待上映"
            value='4'
          ></el-option>
          <el-option
            label="全部"
            value='1'
          ></el-option>
        </el-select>
      </div>
       <!-- <div class="search-wrap">
         <el-checkbox v-model="is_public_value" size="medium">正在上映</el-checkbox>
      </div> -->
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
      <div class="ticket-price-plan-tableNew">
        <div class="creat-tickPrice">
          <el-button
            type="primary"
            size="small"
            plain
            @click="openDownloadMovie()"
          >下载至影院库</el-button>
        </div>

      </div>
      <el-dialog
        title="下载影片"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
        <div>
          <div class="block">
          <div class="demonstration" style="margin-bottom:20px;">影片公映日期范围：</div>
          <el-date-picker
            v-model="downLoadMovieTime"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="center"
            value-format="yyyy-MM-dd"
            >
          </el-date-picker>
        </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="downLoadMovie">确 定</el-button>
        </span>
      </el-dialog>
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
          label="影片分类"
        >
        </el-table-column>
        
        <el-table-column
          prop="moviedesclanguage"
          label="语言"
        >
        </el-table-column>
        <el-table-column
          label="最低票价（元）"
          prop="minPrice"
        >
        </el-table-column>
         <el-table-column
          prop="timeLong"
          label="时长（分钟）"
        >
        </el-table-column>
        <el-table-column
          prop="datePublicShow"
          label="公映日期"
          width="100"
        >
         <template slot-scope="scope">
           {{scope.row.datePublicShow?scope.row.datePublicShow.substr(0,10):'123'}}
          </template>
        
        </el-table-column>
        <el-table-column
          prop="dateShowFirst"
          label="首映日期"
          width="100"
        >
         <template slot-scope="scope">
           {{scope.row.dateShowFirst?scope.row.dateShowFirst.substr(0,10):''}}
          </template>
        </el-table-column>
        <el-table-column
          prop="dateShowOff"
          label="下映日期"
          width="100"
        >
        <template slot-scope="scope">
           {{scope.row.dateShowOff?scope.row.dateShowOff.substr(0,10):''}}
          </template>
        </el-table-column>
        <el-table-column
          label="影片状态"
        >
        <template slot-scope="scope">
           <span v-if="new Date().getTime() < new Date(scope.row.dateShowFirst).getTime()">待上映</span>
           <span v-else-if="new Date(scope.row.dateShowFirst).getTime() < new Date().getTime() && new Date().getTime() < new Date(scope.row.dateShowOff).getTime()">上映中</span>
           <span v-else>已下映</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300"
        >
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              type="text"
              @click="handleEdit(scope.$index, scope.row)"
            >下载至影院库 </el-button> -->
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
      //  is_public_value:false,
      tableData: [],
      movieCode:"",
      movieName:'',
      //交互部分
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
      dialogVisible:false,
      downLoadMovieTime:'',
      currentPage:  1,
      total: "" || 1,
      size: 10,
      pages: "" || 1,
      status:"1",
      value7: ""
    };
  },
  created() {
    let self = this;
    self.getDatas();
  },
  methods: {
     resetHandle(){
      let self = this;
      // self.is_public_value = !self.is_public_value ;
      self.movieCode = "";
      self.movieName = "";
       self.value7 = [];
       self.status =''
     
    },
    getDatas() {
      let self = this;
      console.log(':self.currentPage',self.currentPage)
      let params = {
        // is_public_value:self.is_public_value == true ? 1 : 0,
        movieCode: self.movieCode,
        movieName:self.movieName,
        size:self.size || 10,
        current:self.currentPage || 1,
        status:self.status,
        dateShowFirst:self.value7[0],
        dateShowOff:self.value7[1],
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
    },
    //下载至影院库
    openDownloadMovie(){
      this.dialogVisible =true
    },
    downLoadMovie() {
      let self = this
      let datas = {
        startDate:this.downLoadMovieTime[0],
        endDate:this.downLoadMovieTime[1],
        cinemaUid:'',
        ishead:'0'
      }
      this.$api.cinemaList({page:1,pageSize:10}).then(res =>{ 
        datas.cinemaUid = res.data.list[0]['uid']
        console.log(datas)
        this.$api.schbashmovieLoad(datas).then(res => {
          console.log(res.data)
          if(res.code==200){
            this.$message({
                message: '同步影片成功！',
                type: 'success',
                duration: 1000,
                onClose: () => {
                }
            })
            self.getDatas()
            this.dialogVisible = false
          }
        })
      })
    },
    handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
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
  .plan-size{
      .el-input {
      width: 160px;
    }
    }
  .button-wrap {
    margin-left: 31.4px;
    display: inline-block;
  }
}
.download-film-table {
  // margin-left: 174px;
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
