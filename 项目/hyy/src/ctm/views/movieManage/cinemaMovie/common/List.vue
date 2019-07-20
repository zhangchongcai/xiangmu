<template>
  <div>
    <div class="ciniema-stock-header">
      <div class="search-wrap">
        <span>影院名称：</span>
        <el-input
          size='small'
          placeholder="请输入内容"
          v-model="innerDataSingle.fullName"
        >
        </el-input>
       <div class="companySpan" @click='chosenCinemaFun'>
         <!-- <i class="el-icon-more"></i> -->
         选择
         </div>
      </div>
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
         <el-checkbox v-model="is_public_value" size="medium" >正在上映</el-checkbox>
      </div> -->
     
      <div class="button-wrap">
        <el-button
          type="primary"
          size="small"
          @click="getDatas"
          class="button-reset"
        >查询</el-button>

      </div>
      <div class="button-wrap">
        <el-button
        class="button-reset"
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
          <span class="demonstration" style="margin-bottom:20px;">影片公映日期范围：</span>
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
           <span v-else-if="new Date(scope.row.dateShowFirst).getTime() < new Date().getTime() && new Date().getTime() < new Date(formatDateTime(scope.row.dateShowOff.substr(0,10)+' '+'23:59:59',0)).getTime()">上映中</span>
           <span v-else>已下映</span>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="200"
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
        :page-sizes="[15, 30, 45,60]"
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
    <frameSinglecinema
      :framedialogVisible="singleCinemaVisible"
      :whereUse="whereUse"
      :type="cinematype"
      :innerData="innerDataSingle"
      @callBackSingle="handleSingleCallBack"
      ref="frameSingleCinema"
    >
      <div slot="footerId">
        <el-button
          type="primary"
          @click="confirmCinemaSingleDialog(), singleCinemaVisible= false"
        >确 定</el-button>
        <el-button @click="singleCinemaVisible= false">取 消</el-button>
      </div>
    </frameSinglecinema>
  </div>

</template>
<script>
import frameSinglecinema from 'frame_cpm/dialogs/cinemaDialog/singleCinema'
import { authQueryUserCinemas } from 'frame_cpm/http/interface.js'
export default {
  data() {
    return {
      // mainPageUnique:1, // 传递给 组件的调用的影院类型 属性参数 1 基础影片
      // paramsFilmDataSingle:{},
      // reviewFilmDataSingle:{"id": 4}, // 需要回显选中的数据
      firstCinema:{},
       // 影院单选
       innerDataSingle: { id: '',fullName:"" },
      singleCinemaVisible: false,
      whereUse: null,
      cinematype: 2, // 传递给 组件的调用的影院类型 属性参数
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
    isOrNotChangeCinenams(){
      console.log('this.$store.state.changeCinemaData:',this.$store.state.changeCinemaData)
      if(this.$store.state.changeCinemaData){
          this.innerDataSingle.id = this.$store.state.changeCinemaData.id
          this.innerDataSingle.fullName = this.$store.state.changeCinemaData.fullName
          this.getDatas()
      }else{
         this.listAuthCommCinemas()
      }
    },
    //初始化拿取一个影院数据
    listAuthCommCinemas(){
                let _this =this
                 this.$ctmList.getUserInfo().then( ret => {
                    if (ret.code === 200) {
                      _this.innerDataSingle.id = ret.data.cinemaUid
                      _this.innerDataSingle.fullName = ret.data.cinemaName
                      _this.getDatas();
                    } else {

                    }
                }).catch( err => {
                    console.log(err)
                })
            },
    chosenCinemaFun(){
      this.singleCinemaVisible = true;
      // this.cinematype = 1;
      this.$refs.frameSingleCinema.listAuthCommCinemas();
    },
    confirmCinemaSingleDialog() {
      this.$refs.frameSingleCinema.confirmData();
    },
    handleSingleCallBack(opt) {
      // console.log('执行了1')
      this.innerDataSingle = opt.data;
      this.singleCinemaVisible = opt.framedialogVisible;
       this.$store.commit('changeCinemaData',opt.data)
      //  console.log('this.$store.state.moviePlan.cinemaUid:',this.$store.state.cinemaUid)
    },
    resetHandle(){
      let _this = this;
      _this.movieCode = "";
      _this.movieName = "";
      _this.value7 = [];
      _this.status =''
    },
    getDatas() {
      let _this = this;
      let params = {
        cinemaUid:_this.innerDataSingle.id,
        movieCode: _this.movieCode,
        movieName: _this.movieName,
        dateShowFirst:_this.value7?_this.value7[0] : '',
        dateShowOff:_this.value7?_this.value7[1]:'',
        size:_this.size || 10,
        current:_this.currentPage || 1,
        status:_this.status
      };
      _this.$ctmList
        .cinemaStockList(params)
        .then(ret => {
          if (ret.data) {
            let result = ret.data;
            _this.tableData =  result.records;
            _this.currentPage = result.current;
            _this.total = result.total;
            _this.size = result.size;
            _this.pages = result.pages;
          }
        })
        .catch(() => {
          console.log("哪里出错了，检擦一下哥哥");
        });
    },
    
    //交互部分方法
        handleSizeChange(val) {
      let _this = this;
      _this.size = val;
      console.log(`每页 ${val} 条`);
      _this.getDatas();
    },
    handleCurrentChange(val) {
      let _this = this;
      _this.currentPage = val;
      console.log(`当前页: ${val}`);
      _this.getDatas();
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
      let _this = this
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
          // console.log('调用了影院的下载方法')
          let _this = this
          let datas = {
            startDate:this.downLoadMovieTime2[0],
            endDate:this.downLoadMovieTime2[1],
            cinemaUid:'',
            ishead:'1'
          }
          // this.$ctmList.cinemaList({page:1,pageSize:10}).then(res =>{ 
          //   if(!res.data.list.length){
          //     this.$message({
          //           message: '查询影院信息失败',
          //           type: 'error',
          //           duration: 1000,
          //           onClose: () => {
          //           }
          //       })
          //   }
            datas.cinemaUid = _this.innerDataSingle.id

            this.$ctmList.schbashmovieLoad(datas).then(res => {
              let type = 'success'
              let message = '同步影片成功！'
              if(res.code==200 || res.status==200){
                _this.getDatas()
                this.dialogVisible = false
              }else{
                type = 'error'
                message = res.msg
              }
              this.$message({
                    message,
                    type,
                    duration: 1000,
                    onClose: () => {
                    }
                })
            })
        // })
      },
  },
  components:{
    frameSinglecinema
  },
  created() {
   
    this.isOrNotChangeCinenams()
    
  }
};
</script>
<style lang="scss">
.ciniema-stock-header {
  min-width: 1260px;
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
    .companySpan {
      // width: 32px;
      // height: 32px;
      // border-radius: 4px;
      // line-height: 32px;
      // text-align: center;
      // display: inline-block;
      // background-color: #3B74FF;
      // color: #fff;
      // vertical-align: middle;
      // i {
      //     font-size: 26px;
      //     vertical-align: middle;
      // }
      width: 62px;
      height: 32px;
      border-radius: 4px;
      line-height: 32px;
      text-align: center;
      display: inline-block;
      background-color: #fff;
      color: #3B74FF;
      vertical-align: middle;
      border: 1px solid #3B74FF;
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
      width: 80px !important; height: 32px; font-size: 12px;
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
