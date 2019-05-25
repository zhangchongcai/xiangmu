<template>
  <div>
    <div class="ciniema-stock-header">
      <div class="search-wrap" style="margin-left:0px;">
        <span> 影片名称：</span>
        <el-input
          size='small'
          placeholder="请输入内容"
          v-model="movieName"
        >
        </el-input>
      </div>
      <div class="search-wrap">
        <span>影片编码：</span>
        <el-input
          size='small'
          placeholder="请输入内容"
          v-model="movieCode"
        >
        </el-input>
      </div>
      <div class="search-wrap">
        <span>适用影院：</span>
        <el-input
          size='small'
          placeholder="请输入内容"
          v-model="innerDataSingle.fullName"
        >
        </el-input>
       <div class="companySpan" @click='chosenCinemaFun'><i class="el-icon-more"></i></div>
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
         <el-checkbox v-model="is_public_value" size="medium" >正在上映</el-checkbox>
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
          plain
        >重置</el-button>

      </div>
    </div>
    <div class="ticket-price-plan-tableNew" style="">
      <div class="creat-tickPrice" style="display:inline-block;float:right;margin-bottom:12px;margin-top:11px;">
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
        width="40%"
        :before-close="handleClose">
        <div>
          <div class="block">
          <div class="demonstration" style="margin-bottom:20px;">影片公映日期范围：</div>
          <el-date-picker
            v-model="downLoadMovieTime2"
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
    <div class="cinema-stock-table">
      <el-table
        :data="tableData"
        :row-class-name="tableRowClassName"
        style="width: 100%"
      >
        <!-- <el-table-column
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
          label="影片状态"
        >
         <template slot-scope="scope">
           <span v-if="new Date().getTime() < new Date(scope.row.dateShowFirst).getTime()">未上映</span>
           <span v-else-if="new Date(scope.row.dateShowFirst).getTime() < new Date().getTime() < new Date(scope.row.dateShowOff).getTime()">上映中</span>
           <span v-else>下映</span>
          </template>

        </el-table-column> -->
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
          label="公映日期:"
          width="100"
        >
         <template slot-scope="scope" v-if='scope.row.datePublicShow'>
           {{scope.row.datePublicShow.substr(0,10)}}
          </template>
        
        </el-table-column>
        <el-table-column
          prop="dateShowFirst"
          label="首映日期"
          width="100"
        >
         <template slot-scope="scope" v-if='scope.row.dateShowFirst'>
           {{scope.row.dateShowFirst.substr(0,10)}}
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
           <span v-if="(new Date().getTime() < new Date(scope.row.dateShowFirst).getTime()) ||!scope.row.dateShowFirst ">待上映</span>
           <span v-else-if="new Date(scope.row.dateShowFirst).getTime() < new Date().getTime() && new Date().getTime() < new Date(scope.row.dateShowOff).getTime()">上映中</span>
           <span v-else>已下映</span>
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
    <!-- <frameSingleFilmBase :reviewData="reviewFilmDataSingle" 
         :innerData="paramsFilmDataSingle" :whereUse="mainPageUnique"
         @frameFilmBaseSingleCallBack="frameSingleFilmBaseCallBack"
         ref='frameSingleFilm'>
    </frameSingleFilmBase> -->
    <frame-singlecinema
      :framedialogVisible="singleCinemaVisible"
      :whereUse="whereUse"
      :type="cinematype"
      :innerData="innerDataSingle"
      @callBackSingle="handleSingleCallBack"
      ref="frameSingleCinema"
    >
      <div slot="footerId">
        <el-button @click="singleCinemaVisible= false">取 消</el-button>
        <el-button
          type="primary"
          @click="confirmCinemaSingleDialog(), singleCinemaVisible= false"
        >确 定</el-button>
      </div>
    </frame-singlecinema>
  </div>

</template>
<script>
import frameSingleFilmBase from 'src/frame_cpm/dialogs/film/singleBase'
export default {
  data() {
    return {
      // mainPageUnique:1, // 传递给 组件的调用的影院类型 属性参数 1 基础影片
      // paramsFilmDataSingle:{},
      // reviewFilmDataSingle:{"id": 4}, // 需要回显选中的数据
       // 影院单选
       innerDataSingle: { id: 38 },
      singleCinemaVisible: false,
      whereUse: null,
      cinematype: 1, // 传递给 组件的调用的影院类型 属性参数
      innerData: [], // 传递给 组件的可选参数 props 参数
      // is_public_value:false,
      movieCode: "",
      movieName: "",
      cinemaUid:"1e09f42b-fa4f-425d-bf10-f290225b0dd3",
      tableData: [],
      channelList:[],
      channelsList_1:[],
      channelsList_2:[],
      downLoadMovieTime2:'',
      dialogVisible:false,
       //交互部分
      currentPage: "" || 1,
      total: "" || 1,
      size: 10,
      pages: "" || 1,
      status:"1",
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
    chosenCinemaFun(){
      this.singleCinemaVisible = true;
      this.cinematype = 1;
      this.$refs.frameSingleCinema.listAuthCommCinemas();
    },
    confirmCinemaSingleDialog() {
      this.$refs.frameSingleCinema.confirmData();
    },
    //  frameSingleFilmBaseCallBack(opt) {
    //         this.reviewFilmDataSingle = opt.data
    //         console.log(' this.reviewFilmDataSingle:', this.reviewFilmDataSingle)
    //   },
    handleSingleCallBack(opt) {
      this.innerDataSingle = opt.data;
      // console.log(' this.innerDataSingle:', this.innerDataSingle)
      this.singleCinemaVisible = opt.framedialogVisible;
    },
    resetHandle(){
      let self = this;
      self.movieCode = "";
      self.movieName = "";
      self.value7 = [];
      self.status =''
    },
    getDatas() {
      let self = this;
      let params = {
        cinemaUid:self.innerDataSingle.id,
        movieCode: self.movieCode,
        movieName: self.movieName,
        dateShowFirst:self.value7?self.value7[0] : '',
        dateShowOff:self.value7?self.value7[1]:'',
        size:self.size || 10,
        current:self.currentPage || 1,
        status:self.status
      };
      self.$ctmList
        .cinemaStockList(params)
        .then(ret => {
          if (ret.data) {
            let result = ret.data;
            self.tableData =  result.records;
            self.currentPage = result.current;
            self.total = result.total;
            self.size = result.size;
            self.pages = result.pages;
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
      console.log('row.cinemaUid',row.uidCinema)
      let self = this
       this.$router.push({
        path: "scan",
        query:{
          movieCode:row.movieCode,
          uid_cinema:row.uidCinema
        }
      });
    },
    handleEdit(index,row) {
      let self = this
      this.$router.push({
        path: "edit",
        query:{
         movieCode:row.movieCode,
          uid_cinema:row.uidCinema
        }
      });
    },
    openDownloadMovie() {
        this.dialogVisible =true
      },
      handleClose(){
          this.$confirm('确认关闭？')
            .then(_ => {
              done();
            })
            .catch(_ => {});
      },
        downLoadMovie() {
          console.log('调用了影院的下载方法')
          let self = this
          let datas = {
            startDate:this.downLoadMovieTime2[0],
            endDate:this.downLoadMovieTime2[1],
            cinemaUid:'',
            ishead:'1'
          }
          this.$ctmList.cinemaList({page:1,pageSize:10}).then(res =>{ 
            if(!res.data.list.length){
              this.$message({
                    message: '查询影院信息失败',
                    type: 'error',
                    duration: 1000,
                    onClose: () => {
                    }
                })
            }
            datas.cinemaUid = res.data.list[0]['uid']
            console.log(datas)
            this.$ctmList.schbashmovieLoad(datas).then(res => {
              console.log(res.data)
              if(res.code==200 || res.status==200){
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
  },
  components:{
    frameSingleFilmBase
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
    // margin-left: 32px;
    .el-input {
      width: 264px;
    }
    span {
      color: #666666;
      font-size: 12px;
    }
    .companySpan {
      width: 32px;
      height: 32px;
      border-radius: 4px;
      line-height: 32px;
      text-align: center;
      display: inline-block;
      background-color: #3B74FF;
      color: #fff;
      vertical-align: middle;
      i {
          font-size: 26px;
          vertical-align: middle;
      }
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
    margin-top:15px;
    margin-left: 31.4px;
    display: inline-block;
     span{
      font-size: 12px;
    }
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
