<template>
  <div class="diydialog-single-film">
    <el-dialog title="选择影片" :visible.sync="framedialogVisible" width="80%" :show-close="false">
      <div class="film-top">
        <el-form :inline="true" ref="ruleForm" label-width="85px" size="small" class="film-search">
          <el-form-item label="影片ID：">
            <el-input v-model="searchAdition.id"></el-input>
          </el-form-item>
          <el-form-item label="影片名称：">
            <el-input v-model="searchAdition.fullName"></el-input>
          </el-form-item>
          <el-select size="small" style="width: 110px" v-model="searchAdition.filmType" placeholder="影片类型">
            <el-option v-for="item in filmTypes" :label="item.filmName" :value="item.filmCode" :key="item.filmCode">
            </el-option>
          </el-select>
          <!-- <el-form-item class="width100" label="地区选择：" prop="area">
                        <el-select size="small" style="width: 110px" v-model="searchAdition.provinceCode" v-on:change="getProv($event)" placeholder="请选择省份">
                        <el-option v-for="item in provs" :label="item.areaName" :value="item.areaCode" :key= "item.value">
                        </el-option>
                    </el-select>
                    <el-select size="small" style="width: 110px" v-model="searchAdition.cityName" v-on:change="getCity($event)" placeholder="请选择城市">
                        <el-option v-for="item in citys" :label="item.areaName" :value="item.areaCode" :key="item.value">
                        </el-option>
                    </el-select>
                        <el-select size="small" style="width: 110px" v-model="searchAdition.regionName" v-on:change="getArea($event)" placeholder="请选择地区" >
                        <el-option v-for="item in areas" :label="item.areaName" :value="item.areaCode" :key="item.value">
                        </el-option>
                    </el-select>
                </el-form-item> -->
          <el-button type="primary" @click="searchFunc" icon="el-icon-search" style="margin-top: 1px">搜索</el-button>
        </el-form>
      </div>
      <div class="film-body">
        <div class="aside_left">
          <!-- class="diy-header" -->
          <el-table :data="filmList" @row-click="showRow" @current-change="handleRowChange" ref="filmListRef" height="308px" highlight-current-row style="width: 98%;margin-left:1%;">
            <!-- <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column> -->
            <el-table-column label="选择" width="50" align="center">
              <template slot-scope="scope">
                <el-radio class="radio" v-model="selectedId" :label="scope.row.id">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="影片ID" show-overflow-tooltip></el-table-column>
            <el-table-column prop="name" label="影片名称" show-overflow-tooltip></el-table-column>
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
      <div class="film-bottom">
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="this.total">
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <slot name="footerId"></slot> -->
        <el-button @click="framedialogVisible = !framedialogVisible">取 消</el-button>
        <el-button type="primary" @click="confirmData(),framedialogVisible = !framedialogVisible">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import cinemaData from './cinema.js'
import { authQueryUserCinemas, cpmFilmList } from 'baseSrc/http/interface.js';
export default {
  props: {
    innerData: {
      type: Object,
      default: {},
      required: true
    },
    reviewData: {
      type: Object,
      default: {},
      required: true
    }
    // isListprop: {
    //     type:Boolean,
    //     default: false,
    //     required: false
    // }
  },
  data () {
    return {
      framedialogVisible: false,
      searchAdition: {
        id: '',
        fullName: '',
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
      pageSize: 20,
      pageNum: 1,
      selectedId: '',
      selectedRows: null
    };
  },
  created () {
    // this.getAreaByparentCode()
    // this.filterCinemaList()
    this.selectedId = this.reviewData.id;
  },
  methods: {
    toggleShowDialog (bool) {
      this.framedialogVisible = !this.framedialogVisible;
    },
    handleRowChange (val) {
      // this.selectedRows = val;
      // this.selectedId=this.selectedRows.id;
    },
    showRow (row) {
      // 赋值给radio
      let _this = this;
      let selectedRowsIndex = this.filmList.indexOf(row);
      this.selectedRows = row;
      this.selectedId = this.selectedRows.id;
      _this.$nextTick(function () {
        if (selectedRowsIndex != -1) {
          _this.$refs.filmListRef.setCurrentRow(_this.filmList[selectedRowsIndex]);
        }
      });
    },
    confirmData () {
      let _this = this;
      let cinemaIdss = this.selectedRows;
      _this.$emit('frameFilmBaseSingleCallBack', {
        data: cinemaIdss,
        whereUse: this.$attrs.whereUse
      });
    },
    // 查询
    searchFunc () {
      this.listAuthCommCinemas();
    },
    selectable (row) {
      return row.approveStatus === 'WAIT_APPROVE';
    },
    getProv: function (prov) {
      var item = this.provs.filter(item => {
        return item.areaCode == prov;
      });
      this.searchAdition.area.pcode = item[0].areaCode;
      this.searchAdition.area.pname = item[0].areaName;
      this.searchAdition.area.cname = '';
      this.searchAdition.area.aname = ''; // 供valadite 使用
      this.searchAdition.provinceCode = item[0].areaCode;
      this.searchAdition.provinceName = item[0].areaName;
      this.searchAdition.cityCode = '';
      this.searchAdition.cityName = '';
      this.searchAdition.regionCode = '';
      this.searchAdition.regionName = '';
      this.getAreaByparentCode(prov);
    },
    // 保存城市数据
    getCity: function (city) {
      var item = this.citys.filter(item => {
        return item.areaCode == city;
      });
      this.searchAdition.area.ccode = item[0].areaCode;
      this.searchAdition.area.cname = item[0].areaName;
      this.searchAdition.area.aname = ''; // 供valadite 使用
      this.searchAdition.cityCode = item[0].areaCode;
      this.searchAdition.cityName = item[0].areaName;
      this.searchAdition.regionCode = '';
      this.searchAdition.regionName = '';
      this.$api.getAreaByparentCode({ areaCode: city })
        .then(ret => {
          if (ret && ret.code === 200) {
            this.areas = ret.data;
          } else { }
        }).catch(err => {
          console.log(err);
        });
    },
    getArea: function (area) {
      var item = this.areas.filter(item => {
        return item.areaCode == area;
      });
      this.searchAdition.area.acode = item[0].areaCode;
      this.searchAdition.area.aname = item[0].areaName;  // 供valadite 使用

      this.searchAdition.regionCode = item[0].areaCode;
      this.searchAdition.regionName = item[0].areaName;
      console.log(this.searchAdition);
    },
    getAreaByparentCode (code) {
      var parentCode = code || "000000";
      this.$api.getAreaByparentCode({ areaCode: parentCode })
        .then(ret => {
          if (ret && ret.code === 200) {
            if (!code) {
              this.provs = ret.data;
            } else {
              this.citys = ret.data;
            }
          } else { }
        }).catch(err => {
          console.log(err);
        });
    },
    listAuthCommCinemas () {
      // let params={
      //     consumerId:175,
      //     productVersionId:1,
      //     relatedInformationId:1
      // }
      let _this = this;
      let params = this.reviewData;
      // debugger
      let postObj = {
        fullName: this.searchAdition.fullName,
        id: this.searchAdition.id,
        type: this.$attrs.type,
        pageSize: this.pageSize,
        pageNum: this.pageNum
      };
      cpmFilmList(postObj).then(ret => {
        if (ret && ret.code === 200) {
          _this.total = ret.data.total;
          _this.filmList = ret.data.rows;
          _this.selectedId = params.id;
          if (!!params.id || !!_this.selectedRows) {
            // _this.selectedRows = this.filmList.filter(item=>params.id == item.id)[0]
            let selectedSingleData = this.filmList.filter(item => params.id == item.id)[0];
            if (selectedSingleData) {
              _this.selectedRows = selectedSingleData;
            } else {
              _this.selectedRows = params;
            }
            _this.$nextTick(function () {
              for (let i = 0; i < _this.filmList.length; i++) {
                // debugger
                if (_this.filmList[i].id == params.id) {
                  // debugger
                  _this.$refs.filmListRef.setCurrentRow(_this.filmList[i]);
                }
              }
            });
          }
        } else {

        }
      }).catch(err => {
        console.log(err);
      });
    },
    // 当前页数数目改变
    handleSizeChange (valua) {
      this.pageNum = 1;
      this.pageSize = valua;
      this.listAuthCommCinemas();
    },
    // 当前页改变
    handleCurrentChange (valua) {
      this.pageNum = valua;
      this.listAuthCommCinemas();
    },
    submitForm (formName) {

    }

  }
};
</script>

<style lang="scss">
.diydialog-single-film {
  .page-wrap {
    height: 40px;
    padding: 0;
    width: 98%;
    margin-left: 1%;
    .el-pagination {
      float: left;
    }
  }
  .usual-dialog {
    z-index: 999999;
  }
  .el-dialog__wrapper {
    z-index: 999999 !important;
  }
  .el-dialog {
    .el-dialog__body {
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
      padding: 20px 0px 0 !important;
    }
  }
  .el-dialog__body {
    padding-top: 10px;
  }
  .el-header {
    .el-form-item__content {
      width: 100px;
    }
    .el-form-item__label {
      width: 80px;
    }
  }

  .box {
    display: flex;
    height: 332px;
    overflow: hidden;
  }
  .box-left {
    flex: 1;
    height: 100%;
    overflow: auto;
    float: left;
  }
  .box-right {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    .box-right-top {
      height: 60px;
      .el-input__inner {
        width: 150px;
      }
    }
  }

  .box-right-main {
    flex: 0 0 200px;
    overflow: hidden;
    display: flex;
  }
  .box-main-table {
    overflow: auto;
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    .page-table {
      flex: 1;
    }
  }
  .box-main-right {
    flex: 0 0 200px;
    border: 1px solid #ebeef5;
    box-sizing: border-box;
    padding: 5px;
    height: 308px;
    overflow: auto;
    .box-last-top {
      span {
        float: right;
        cursor: pointer;
      }
    }
    .box-last-ul {
      height: 260px;
      overflow: auto;
      li {
        display: flex;
        height: 30px;
        line-height: 30px;
        .span-left {
          flex: 1;
          width: 168px;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .span-right {
          display: inline-block;
          flex: 0 0 20px;
          cursor: pointer;
          i {
          }
        }
      }
    }
  }
  .next-box {
    display: flex;
    flex-direction: column;
    .next-pro-top {
      flex: 0 0 30px;
      line-height: 30px;
    }
    .next-pro-main {
      flex: 1;
    }
  }
}
</style>
<style lang="scss" scoped>
.film-body {
  padding-top: 8px;
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
