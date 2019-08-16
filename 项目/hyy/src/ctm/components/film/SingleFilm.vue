<template>
  <div class="ctm-select-single-film">
    <el-dialog title="选择影片" :visible.sync="dialogVisible" @close="close" :show-close="true">
      <div class="film-top p-h-20">
        <el-form :inline="true" ref="ruleForm" size="small" class="film-search">
          <!-- <el-form-item label="影片ID：">
            <el-input v-model="searchAdition.id"></el-input>
          </el-form-item> -->
          <el-form-item label="影片名称：">
            <el-input v-model="searchAdition.movieName"></el-input>
          </el-form-item>

          <el-button type="primary" @click="searchFunc" style="margin-top: 1px">搜索</el-button>
        </el-form>
      </div>
      <div class="film-body p-h-20">
        <div class="aside_left">
          <!-- class="diy-header" -->
          <el-table :data="filmList" @row-click="showRow" @current-change="handleRowChange" ref="filmListRef" height="388px" highlight-current-row style="width: 98%;margin-left:1%;">
            <!-- <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column> -->
            <el-table-column label="选择" width="50" align="center">
              <template slot-scope="scope">
                <el-radio class="radio" :value="selectedId" :label="scope.row.movieId">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="movieName" label="影片名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="movieCode" label="影片编码" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column prop="area" label="城市地区" show-overflow-tooltip></el-table-column> -->
            <!-- <el-table-column prop="isActive" label="状态" show-overflow-tooltip><el-table-column> -->
            <!-- <el-table-column prop="area" label="年代" show-overflow-tooltip></el-table-column> -->
            <!-- <el-table-column prop="filmType" label="影片类型" show-overflow-tooltip>
              <template slot-scope="scope">
            {{scope.row.filmType | filterFilmType}}
            </template>
          </el-table-column> -->
          </el-table>
        </div>
      </div>
      <div class="p-l-20 p-r-20">
        <div v-if="total>pageSize" class="b-b b-l b-r">
          <div class="p-10 a-c">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <slot name="footerId"></slot>
        <el-button type="primary" @click="confirmData()">确 定</el-button>
        <el-button @click="close">取 消</el-button>
        <!-- <div class="class" slot="dialogfooter"></div> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import cinemaData from './cinema.js'
import { authQueryUserCinemas, cpmFilmList } from 'frame_cpm/http/interface.js'
import { getPlanMovieList, DownloadmovieList } from 'ctm/http/interface.js'

export default {
  props: {
    framedialogVisible: {
      type: Boolean,
      default: true,
      required: true
    },
    innerData: {
      type: Object,
      default: {},
      required: true
    },
    isListprop: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data () {
    return {
      // framedialogVisible: false,
      dialogVisible: this.framedialogVisible,
      searchAdition: {
        id: '',
        movieName: '',
        filmType: '',
        provinceCode: '',
        cityName: '',
        regionName: ''
      },
      multipleSelection: [],
      filmList: [],
      filmTypes: [],
      provs: [],
      citys: [],
      areas: [],
      rules: {},
      total: 0,
      pageSize: 10,
      pageNum: 1,
      selectedId: '',
      selectedRows: null,
    }
  },
  created () {
    // this.getAreaByparentCode()
    // this.filterCinemaList()
    // console.log("created");
    this.selectedId = this.innerData.movieId
    this.listAuthCommCinemas();
  },
  activated () {
    // console.log("activated");
    // this.selectedId = this.innerData.movieId
  },
  methods: {
    close () {
      this.$emit("close");
    },
    toggleShowDialog (bool) {
      this.framedialogVisible = !this.framedialogVisible
    },
    handleRowChange (val) {
      // this.selectedRows = val;
      // this.selectedId=this.selectedRows.id;
    },
    showRow (row) {
      //赋值给radio
      let _this = this;
      let selectedRowsIndex = this.filmList.indexOf(row);
      this.selectedRows = row;
      this.selectedId = this.selectedRows.movieId;
      console.log(row);
      console.log(this.selectedId);
      _this.$nextTick(function () {
        if (selectedRowsIndex != -1) {
          _this.$refs.filmListRef.setCurrentRow(_this.filmList[selectedRowsIndex]);
        }
      })
    },
    confirmData () {
      let _this = this;
      let cinemaIdss = this.selectedRows
      _this.$emit('callBackFilSingle', {
        singleFilmVisible: false,
        data: cinemaIdss
      })

    },
    //查询
    searchFunc () {
      this.listAuthCommCinemas();
    },
    selectable (row) {
      return row.approveStatus === 'WAIT_APPROVE'
    },
    getProv: function (prov) {
      var item = this.provs.filter(item => {
        return item.areaCode == prov
      })
      this.searchAdition.area.pcode = item[0].areaCode;
      this.searchAdition.area.pname = item[0].areaName;
      this.searchAdition.area.cname = ""
      this.searchAdition.area.aname = "" // 供valadite 使用
      this.searchAdition.provinceCode = item[0].areaCode;
      this.searchAdition.provinceName = item[0].areaName;
      this.searchAdition.cityCode = ''
      this.searchAdition.cityName = ''
      this.searchAdition.regionCode = ''
      this.searchAdition.regionName = ''
      this.getAreaByparentCode(prov)
    },
    //保存城市数据
    getCity: function (city) {
      var item = this.citys.filter(item => {
        return item.areaCode == city
      })
      this.searchAdition.area.ccode = item[0].areaCode;
      this.searchAdition.area.cname = item[0].areaName;
      this.searchAdition.area.aname = "" // 供valadite 使用
      this.searchAdition.cityCode = item[0].areaCode;
      this.searchAdition.cityName = item[0].areaName;
      this.searchAdition.regionCode = ''
      this.searchAdition.regionName = ''
      this.$api.getAreaByparentCode({ areaCode: city })
        .then(ret => {
          if (ret && ret.code === 200) {
            this.areas = ret.data
          } else { }
        }).catch(err => {
          console.log(err)
        })
    },
    getArea: function (area) {
      var item = this.areas.filter(item => {
        return item.areaCode == area
      })
      this.searchAdition.area.acode = item[0].areaCode;
      this.searchAdition.area.aname = item[0].areaName;  // 供valadite 使用

      this.searchAdition.regionCode = item[0].areaCode;
      this.searchAdition.regionName = item[0].areaName;
      console.log(this.searchAdition)
    },
    getAreaByparentCode (code) {
      var parentCode = code ? code : "000000";
      this.$api.getAreaByparentCode({ areaCode: parentCode })
        .then(ret => {
          if (ret && ret.code === 200) {
            if (!code) {
              this.provs = ret.data
            } else {
              this.citys = ret.data
            }
          } else { }
        }).catch(err => {
          console.log(err)
        })
    },
    listAuthCommCinemas () {
      // let params={
      //     consumerId:175,
      //     productVersionId:1,
      //     relatedInformationId:1
      // }
      // this.selectedId = this.innerData.movieId
      let _this = this
      let params = this.innerData
      let postObj = {
        movieName: this.searchAdition.movieName,
        // id: this.searchAdition.id,
        // type: this.$attrs.type,
        // dateShowFirst: this.$moment().format("YYYY-MM-DD"),
        // targetDate: this.$moment().format("YYYY-MM-DD"),
        status: 5,
        size: this.pageSize,
        current: this.pageNum
      }
      DownloadmovieList(postObj).then(ret => {
        if (ret && ret.code === 200) {
          _this.total = ret.data.total
          _this.filmList = ret.data.records
          _this.selectedId = params.movieId
          if (!!params.id || !!_this.selectedRows) {
            // _this.selectedRows = this.filmList.filter(item=>params.id == item.id)[0]
            let selectedSingleData = this.filmList.filter(item => params.id == item.id)[0]
            if (!!selectedSingleData) {
              _this.selectedRows = selectedSingleData
            } else {
              _this.selectedRows = params
            }
            _this.$nextTick(function () {
              for (let i = 0; i < _this.filmList.length; i++) {
                if (_this.filmList[i].id == params.id) {
                  _this.$refs.filmListRef.setCurrentRow(_this.filmList[i]);
                }
              }
            })
          }


        } else {

        }
      }).catch(err => {
        console.log(err)
      })
    },
    //当前页数数目改变
    handleSizeChange (valua) {
      this.pageNum = 1;
      this.pageSize = valua;
      this.listAuthCommCinemas();
    },
    //当前页改变
    handleCurrentChange (valua) {
      this.pageNum = valua;
      this.listAuthCommCinemas();
    },
    submitForm (formName) {

    },

  }
}
</script>

<style lang="scss" scoped>
.ctm-select-single-film {
  /deep/ .el-form.el-form--inline .el-form-item {
    margin-bottom: 10px;
    margin-right: 10px;
  }
  /deep/ .el-dialog {
    width: 702px;
    .el-dialog__body {
      border-top: 1px solid #ccc;
      // border-bottom: 1px solid #ccc;
      padding-top: 10px !important;
      padding-bottom: 10px;
      padding-left: 0;
      padding-right: 0;
    }
  }
  /deep/ .el-table {
    margin: 0 !important;
    width: 100% !important;
  }
  /deep/ .el-dialog__footer {
    padding-bottom: 12px;
    padding-top: 2px;
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
.film-body {
  .aside_left {
    width: 100%;
  }
  .aside_right {
    width: 48%;
    padding: 1%;
    margin-left: -8px;
    float: left;
    border: 1px solid #e5e5e5;
    border-left: 0;
    .choose-header {
      padding-bottom: 12px;
    }
  }
  .selected-ul {
    .li-item {
      width: 100%;
      clear: both;
      display: block;
    }
  }
}
.film-bottom {
  margin-top: 10px;
}
</style>
