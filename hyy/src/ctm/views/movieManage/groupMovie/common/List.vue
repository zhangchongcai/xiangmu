<template>
  <div>

    <div class="download-film-header">
      <div class="search-wrap" style="margin-left:0px;">
        <span>影片名称：</span>
        <el-input
          size='small'
          placeholder="请输入内容"
          v-model="movieName"
        >
        </el-input>
      </div>
      <div class="search-wrap">
        <span> 影片编码：</span>
        <el-input
          size='small'
          placeholder="请输入内容"
          v-model="movieCode"
        >
        </el-input>
      </div>
      
      <div class="search-wrap">
        <span>公映日期：</span>
        <el-date-picker
          v-model="value7"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
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
          class="button-reset"
          @click="getDatas('backPageOne')"
        >查询</el-button>

      </div>
      <div class="button-wrap">
        <el-button
          class="button-reset"
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
          >下载影片</el-button>
        </div>

      </div>
      <el-dialog
        title="下载影片"
        :visible.sync="dialogVisible"
        width="448px"
        :before-close="handleClose">
        <div>
          <div class="block">
          <span class="demonstration" style="margin-bottom:20px;">影片公映日期范围：</span>
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
          <el-button type="primary" @click="downLoadMovie" class="button-reset">确 定</el-button>
          <el-button @click="dialogVisible = false" class="button-reset">取 消</el-button>
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
        
        <!-- <el-table-column
          prop="moviedesclanguage"
          label="语言"
        >
        </el-table-column> -->
        <el-table-column
          label="最低票价（元）"
          prop="minPrice"
           width="120"
        >
        </el-table-column>
         <el-table-column
          prop="timeLong"
          label="时长（分钟）"
           width="100"
        >
        </el-table-column>
        <el-table-column
          prop="datePublicShow"
          label="公映日期"
          width="100"
        >
         <template slot-scope="scope" v-if="scope.row.datePublicShow">
           {{scope.row.datePublicShow.substr(0,10)}}
          </template>
        
        </el-table-column>
        <el-table-column
          prop="dateShowFirst"
          label="首映日期"
          width="100"
        >
         <template slot-scope="scope" v-if='scope.row.dateShowFirst'>
           {{formatDateTime(scope.row.dateShowFirst.substr(0,10)+' '+'23:59:59',1)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="dateShowOff"
          label="下映日期"
          width="100"
        >
        <template slot-scope="scope" v-if='scope.row.dateShowOff'>
           {{scope.row.dateShowOff.substr(0,10)}}
          </template>
        </el-table-column>
        <el-table-column
          label="影片状态"
        >
        <template slot-scope="scope">
           <span v-if="(new Date().getTime() < new Date(scope.row.dateShowFirst).getTime())||!scope.row.dateShowFirst ">待上映</span>
           <span v-else-if="new Date(scope.row.dateShowFirst).getTime() < new Date().getTime() && new Date().getTime() < new Date(formatDateTime(scope.row.dateShowOff.substr(0,10)+' '+'23:59:59',0)).getTime()">上映中</span>
           <span v-else>已下映</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="200"
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
            >编辑</el-button>
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
        :page-sizes="[15, 30, 45,60]"
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
    console.log('this.$store',this.$store)
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
     formatDateTime(timeStamp, type) { // type: 0 全格式 1 仅日 2 仅时间
      var date = new Date(timeStamp)
      let y = date.getFullYear()
      let m = date.getMonth() + 1
      m = m < 10 ? `0${m}` : m
      let d = date.getDate()
      d = d < 10 ? `0${d}` : d
      let h = date.getHours()
      h = h < 10 ? `0${h}` : h
      let mm = date.getMinutes()
      mm = mm < 10 ? `0${mm}` : mm
      let ss = date.getSeconds()
      ss = ss < 10 ? `0${ss}` : ss
      
      return type == 0 ? `${y}-${m}-${d} ${h}:${mm}:${ss}` : type == 1 ? `${y}-${m}-${d}` : type == 2 ? `${h}:${mm}` : `${y}-${m}-${d} ${h}:${mm}`
     },
    getDatas(backPageOne) {
      let self = this;
      if(backPageOne) {
        self.currentPage = 1
      }
      console.log(':self.currentPage',self.currentPage)
      let params = {
        // is_public_value:self.is_public_value == true ? 1 : 0,
        movieCode: self.movieCode,
        movieName:self.movieName,
        size:self.size || 10,
        current:self.currentPage || 1,
        status:self.status,
        dateShowFirst:self.value7 ?self.value7[0] : '',
        dateShowOff:self.value7 ? self.value7[1]:'',
      };
      self.$ctmList
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
          movieId:row.movieCode,
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
        startDate:self.downLoadMovieTime[0],
        endDate:self.downLoadMovieTime[1],
        cinemaUid:'',
        ishead:'0'
      }
      self.$ctmList.cinemaList({page:1,pageSize:10}).then(res =>{ 
        datas.cinemaUid = res.data.list[0]['uid']
        self.$ctmList.schbashmovieLoad(datas).then(res => {
          let type = 'success'
          let message = '同步影片成功！'
          if(res.code==200 || res.status==200){
            self.getDatas()
            self.dialogVisible = false
          }else{
            type = 'error'
            message = res.msg
          }
          self.$message({
                message,
                type,
                duration: 1000,
                onClose: () => {
                }
            })
        })
      })
    },
    handleClose(done) {
        done();
      }
  }
};
</script>
<style  type="text/css"  lang='scss' >
.download-film-header {
  min-width: 1024px;
  width: 100%;
  padding-top: 25px;
  padding-bottom: 25px;
  padding-left: 24px;
  background: #f5f5f5;
  box-sizing: border-box;
  .search-wrap {
    display: inline-block;
    height: 32px;
    margin-right: 30px;
    .el-date-range-picker__content.is-left{
      border-right: 0px;
    }
    .el-input {
      width: 264px;
    }
    .el-range-editor .el-range-input{
      font-size: 12px;
    }
    .el-range-editor.el-input__inner{
      padding: 0 10px;
    }
    .el-date-editor--daterange.el-input__inner{
      width: 264px;
    }
    .el-date-editor .el-range-separator{
      width: 9%;
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
    .el-input--suffix .el-input__inner{
      font-size: 12px;
    }
    }
  .button-wrap {
    margin-left: 8px;
    display: inline-block;
    margin-top:15px;
     span{
      font-size: 12px;
    }
    .button-reset{
      width: 80px; height: 32px; font-size: 12px;
    }
  }
}
.download-film-table {
  //下载影片
  .el-dialog__header .el-dialog__title{
    color: #333333;
  }

  .el-icon-close{
    font-size: 12px;
  }
  .block{
    .demonstration{
      color:#666666;
    }
    display: inline-block;
    height: 32px;
    .el-date-range-picker__content.is-left{
      border-right: 0px;
    }
    .el-input {
      width: 360px;
    }
    .el-range-editor .el-range-input{
      font-size: 12px;
    }
    .el-range-editor.el-input__inner{
      padding: 0 10px;
    }
    .el-date-editor--daterange.el-input__inner{
      width: 256px;
    }
    .el-date-editor .el-range-separator{
      width: 8%;
    }
    span {
      color: #666666;
      font-size: 12px;
    }
  }
  .dialog-footer{
      margin-left: 8px;
      display: inline-block;
      // margin-top:15px;
      span{
        font-size: 12px;
      }
      .button-reset{
        width: 80px; height: 32px; font-size: 12px;
      }
    }
  // margin-left: 174px;
  .ticket-price-plan-tableNew {
    width: 100%;
    height: 32px;
    .creat-tickPrice {
      margin-top: 11px;
      // margin-right: 22px;
      float: right;
      display: inline-block;
      margin-bottom: 12px;
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
