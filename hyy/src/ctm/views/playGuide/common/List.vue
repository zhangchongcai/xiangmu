/*
* Description:
* Author:
* Update:
*/
<template>
  <div class="ctm play-guide-list">
    <div class="bg-panel p-h-24 p-t-24 p-b-16">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="searchApplyList()">
        <el-form-item label="使用影院:">
          <el-row>

            <el-input v-model="dataForm.cinemaName" clearable readonly placeholder="全部"></el-input>

            <el-button type="primary callWindowBtn" plain @click="showCinemaModel">选择</el-button>

          </el-row>

        </el-form-item>
        <el-form-item label="结算日期:">
          <el-date-picker clearable v-model="dataForm.settlementTime" type="date" value-format="yyyy-MM-dd" placeholder="结算日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="影片名称:">
          <el-row>

            <el-input v-model="dataForm.filmName" clearable readonly placeholder="请选择"></el-input>

            <el-button type="primary callWindowBtn" plain @click="showSingleFilmModel">选择</el-button>

          </el-row>

        </el-form-item>

        <el-form-item>
          <el-button class="m-l-10" type="primary" @click="getDatas()">查询</el-button>
          <el-button type="primary" plain @click="resetHandle">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="play-guide-list-table">
      <div class="play-guide-list-tableNew">
        <div class="creat-btn-wapper">
          <el-button type="primary" plain @click="add">新建</el-button>
        </div>
      </div>
      <el-table :data="tableData" :row-class-name="tableRowClassName" style="width: 100%">
        <el-table-column prop="movieName" label="影片名称" width="180">
        </el-table-column>
        <el-table-column prop="disVersion" label="发行版本">
        </el-table-column>
        <el-table-column prop="channelNames" label="放映日期" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.startDate && scope.row.endDate">
              {{$moment(scope.row.startDate).format("YYYY-MM-DD")}}--{{$moment(scope.row.endDate).format("YYYY-MM-DD")}}
            </span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column prop="disVersion" label="排片占比">
          <template slot-scope="scope">
            <span v-if="scope.row.timeRatioLower || scope.row.timeRatioUpper">
              {{scope.row.timeRatioLower}}-{{scope.row.timeRatioUpper}}%
            </span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column prop="hallType" label="场次数">
          <template slot-scope="scope">
            <span v-if="scope.row.timeNumLower || scope.row.timeNumUpper">
              {{scope.row.timeNumLower}}-{{scope.row.timeNumUpper}}
            </span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column prop="guideType" label="指导类型">
          <template slot-scope="scope">
            <span v-if="scope.row.guideType ==1">强制</span>
            <span v-else>指导</span>
          </template>
        </el-table-column>
        <el-table-column prop="useCinema" label="适用影院" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.useCinema==1">全部</span>
            <span v-else-if="scope.row.cinemaList && scope.row.cinemaList.length>0">
              <span v-if="scope.row.cinemaList.length==1">{{scope.row.cinemaList[0].cinemaName}}</span>
              <span v-else>{{scope.row.cinemaList[0].cinemaName}}"等"{{scope.row.cinemaList.length}}家影城</span>
            </span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新日期" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.updateTime">
              {{$moment(scope.row.updateTime).format("YYYY-MM-DD hh:mm")}}
            </span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleScan(scope.$index, scope.row)">查看</el-button>
            <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
            <el-button size="mini" type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="total>size" class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10,20, 30]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <single-cinema @close="singleCinemaVisible=false" v-if="singleCinemaVisible" :framedialogVisible="singleCinemaVisible" :whereUse="whereUse" :type="cinematype" :innerData="innerDataSingle" @callBackSingle="handleSingleCallBack" ref="frameSingleCinema">
      <div slot="footerId">
        <el-button type="primary" @click="confirmCinemaSingleDialog(), singleCinemaVisible= false">确 定</el-button>
        <el-button @click="singleCinemaVisible= false">取 消</el-button>
      </div>
    </single-cinema>
    <frame-singlefilm @close="singleFilmVisible=false" v-if="singleFilmVisible" :framedialogVisible="singleFilmVisible" :whereUse="whereUse" :type="filmtype" :innerData="innerFilmDataSingle" @callBackFilSingle="handleSingleFileCallBack" ref='frameSingleFilm'>
      <!-- <div slot="footer">
        <el-button @click="singleFilmVisible=false">取 消</el-button>
        <el-button type="primary" @click="confirmFilmSingleDialog()">确 定</el-button>
      </div> -->
    </frame-singlefilm>
  </div>
</template>
<script>
import { deletePricePlan, getPlayGuideList, deletePlayGuide } from 'ctm/http/interface'
// import frameSingleFilmBase from 'src/frame_cpm/dialogs/film/singleBase'
import FrameSinglefilm from '../../../components/film/SingleFilm'
import SingleCinema from '../../../components/cinema/SingleCinema'
import mixins from 'src/frame_cpm/mixins/cacheMixin.js'
export default {
  mixins: [mixins.cacheMixin],
  components: {
    // frameSingleFilmBase,
    FrameSinglefilm,
    SingleCinema
  },
  data () {
    return {
      cacheField: ["dataForm", "currentPage", "size"],
      singleFilmVisible: false,
      innerFilmDataSingle: {},
      filmtype: 1, // 传递给 组件的调用的影院类型 属性参数
      dataForm: { planDate: this.$moment().format("YYYY-MM-DD") },
      singleCinemaVisible: false,
      // 影院单选
      innerDataSingle: { id: '', fullName: "" },
      whereUse: null,
      cinematype: 2, // 传递给 组件的调用的影院类型 属性参数
      channel: "",
      name: "",
      //交互部分
      currentPage: "" || 1,
      total: "" || 1,
      size: "" || 10,
      pages: "" || 1,
      tableData: [],
    };
  },
  created () {
    console.log("created");
    console.log(this.$store.state);
    this.getDatas();
  },
  methods: {
    showSingleFilmModel () {
      this.singleFilmVisible = true;
      // this.$refs.frameSingleFilm.listAuthCommCinemas()
      // console.log("showSingleFilmModel");
    },
    confirmFilmSingleDialog () {
      this.$refs.frameSingleFilm.confirmData()
      // this.singleFilmVisible = false
    },
    handleSingleFileCallBack (opt) {
      this.innerFilmDataSingle = opt.data
      this.singleFilmVisible = false;
      this.dataForm.filmName = opt.data.movieName
      this.dataForm.movieCode = opt.data.movieCode
      console.log(opt);
    },
    showCinemaModel () {
      this.singleCinemaVisible = true;
      // this.$refs.frameSingleCinema.listAuthCommCinemas();
    },
    confirmCinemaSingleDialog () {
      this.$refs.frameSingleCinema.confirmData();
    },
    handleSingleCallBack (opt) {
      this.innerDataSingle = opt.data;
      console.log(opt);
      this.dataForm.cinemaName = opt.data.name;
      this.dataForm.cinemaCode = opt.data.code;
      // this.singleCinemaVisible = opt.framedialogVisible;
    },
    resetHandle () {
      let self = this;
      self.dataForm = { planDate: this.$moment().format("YYYY-MM-DD") }
      self.getDatas();
    },
    getDatas () {
      let self = this;
      let params = {
        // ...dataForm,
        movieCode: this.dataForm.movieCode || undefined,
        cinemaCode: this.dataForm.cinemaCode || undefined,
        planDate: this.dataForm.planDate,
        size: self.size || 10,
        current: self.currentPage
      };
      getPlayGuideList(params)
        .then(ret => {
          if (ret.data) {
            let result = ret.data;
            self.tableData = result.list;
            // self.currentPage = result.current;
            self.total = result.total;
            // self.size = result.size;
            // self.pages = result.pages;
          }
        })
        .catch(() => {
          console.log("哪里出错了，检擦一下哥哥");
        });
    },
    //交互部分
    handleSizeChange (val) {
      let self = this;
      self.size = val;
      console.log(`每页 ${val} 条`);
      self.getDatas();
    },
    handleCurrentChange (val) {
      let self = this;
      self.currentPage = val;
      console.log(`当前页: ${val}`);
      self.getDatas();
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex % 2 == 1) {
        return "warning-row";
      } else {
        return "success-row";
      }
      return "";
    },
    handleScan (index, row) {
      this.$router.push({
        path: "./scan",
        query: {
          uid: row.uid
        }
      });
    },
    handleEdit (index, row) {
      this.$router.push({
        path: "./edit",
        query: {
          uid: row.uid
        }
      });
    },
    handleDelete (index, row) {
      let self = this;
      this.$confirm('此操作将删除当前数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let params = {
          uid: row.uid
        }
        deletePlayGuide(params)
          .then((ret) => {
            if (ret.code == 200) {
              this.getDatas();
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
            } else {
              this.$message({
                type: 'success',
                message: '删除失败!'
              });
            }
          }).catch((err) => {

          });
        // this.$message({
        //   type: 'success',
        //   message: '删除成功!'
        // });
      }).catch(() => {
        // this.$message({
        //   type: 'info',
        //   message: '已取消删除'
        // });
      });
    },
    add () {
      this.$router.push({
        path: "./add"
      });
    }
  }
};
</script>
<style lang="scss">
.play-guide-list {
  .flex-base {
    display: flex;
    display: -webkit-flex;
    align-content: center;
    justify-content: center;
  }
  /deep/ .el-form.el-form--inline .el-input {
    width: 160px;
  }
  /deep/ .el-form.el-form--inline .el-form-item {
    margin-bottom: 10px;
    margin-right: 10px;
  }
  /deep/ .el-form {
    .el-form-item__label {
      font-size: 12px;
    }
    .el-input__inner {
      font-size: 12px;
    }
  }
}
.play-guide-list-header {
  width: 100%;
  padding-top: 24px;
  padding-bottom: 24px;
  padding-left: 24px;
  background: #f5f5f5;
  box-sizing: border-box;

  .search-wrap {
    display: inline-block;
    height: 32px;
    margin-left: 10px;
    // :first-child{
    //   margin-left: 0px;
    // }
    .el-input {
      width: 264px;
      font-size: 12px;
    }
    span {
      color: #666666;
      font-size: 12px;
    }
    .el-button {
      span {
        color: #ffffff;
      }
    }
  }
  .search-wrap:first-child {
    margin-left: 0px;
  }
  .plan-size {
    .el-input {
      width: 160px;
    }
  }
  .button-wrap {
    margin-left: 8px;
    display: inline-block;
    margin-top: 15px;
    span {
      font-size: 12px;
    }
  }
}
.play-guide-list-table {
  .play-guide-list-tableNew {
    width: 100%;

    height: 32px;
    .creat-btn-wapper {
      margin-top: 11px;
      margin-right: 22px;
      float: right;
      display: inline-block;
      margin-bottom: 12px;
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
