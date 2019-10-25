<template>
  <div class="diydialog-multi-cinema">
    <el-dialog title="选择影片" :visible.sync="framedialogVisible" width="70%" :show-close="false" custom-class="usual-dialog">
      <div class="film-top">
        <el-form :inline="true" ref="ruleForm" label-width="85px" size="small" class="film-search">
          <el-form-item label="影片ID：">
            <el-input v-model="searchAdition.id"></el-input>
          </el-form-item>
          <el-form-item label="影片名称：">
            <el-input v-model="searchAdition.fullName"></el-input>
          </el-form-item>
          <!-- <el-select size="small" style="width: 110px" v-model="searchAdition.filmType" placeholder="影片类型" >
                <el-option v-for="item in filmTypes" :label="item.filmName" :value="item.filmCode" :key="item.filmCode">
                </el-option>
            </el-select> -->
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
          <el-button type="primary" @click="listAuthCommCinemas" icon="el-icon-search" style="margin-top: 1px">搜索</el-button>
        </el-form>
      </div>
      <!-- <div class="film-body" style="max-height:320px;overflow:auto;"> -->
      <div class="box">
        <div class="box-left">
          <el-table :data="filmList" @selection-change="changePageCoreRecordData" height="308px" ref="filmListRef" class="diy-header" stripe>
            <el-table-column type="selection" :selectable="selectableFunc" width="55"></el-table-column>
            <el-table-column prop="id" label="影片ID" show-overflow-tooltip></el-table-column>
            <el-table-column prop="fullName" label="影片名称" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column prop="area" label="年代" show-overflow-tooltip></el-table-column> -->
            <!-- <el-table-column prop="filmType" label="影片类型" show-overflow-tooltip>
                <template slot-scope="scope">
               {{scope.row.filmType | filterFilmType}}
               </template>
             </el-table-column> -->
          </el-table>
        </div>
        <div class="box-main-right">
          <div class="box-last-top">
            已选内容
            <span>清空</span>
          </div>
          <hr>
          <ul class="box-last-ul">
            <li v-for="(item,index) in multipleSelectionAll" :key="item.code">
              <span class="span-left">{{item.name}}</span>
              <span class="span-right" @click="deleteCurrentIndex(index,true)">
                <i class="el-icon-close btn-color"></i>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="film-bottom">
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 25, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="this.total"></el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <slot name="footerId"></slot>
        <!-- <el-button @click="closeDialog(false)">取 消</el-button>
        <el-button type="primary" @click="confirmData()">确 定</el-button>-->
        <!-- <div class="class" slot="dialogfooter"></div> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import cinemaData from './cinema.js';
import { authQueryUserCinemas, cpmFilmList, cpmFilmCodeList } from 'baseSrc/http/interface.js';
export default {
  props: {
    framedialogVisible: {
      type: Boolean,
      default: true,
      required: true
    },
    innerFilmMultiData: {
      type: Array,
      default: [],
      required: true
    },
    disabledData: {
      type: Array,
      default: [],
      required: false
    },
    isListprop: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  data () {
    return {
      searchAdition: {
        id: '',
        fullName: '',
        provinceCode: '',
        cityName: '',
        regionName: ''
      },
      multipleSelection: [], // 当前页选中的数据
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      idKey: 'id', // 标识列表数据中每一行的唯一键的名称(需要按自己的数据改一下)
      filmList: [], // 表格数据
      provs: [],
      citys: [],
      areas: [],
      rules: {},
      total: 0,
      pageSize: 10,
      pageNum: 1
    };
  },
  watch: {
    innerFilmMultiData (val) {
      this.multipleSelectionAll = val;
      console.log(val);
    }
  },
  created () {
    this.listAuthCommCinemas();
  },
  filters: {
    filterFilmType (value) {

    }
  },
  methods: {
    selectableFunc (row, index) {
      if (row.disabled == true) {
        return false;
      } else {
        return true;
      }
      // if(this.disabledData.some(el=>{return el.id===row.id})){
      //     return false;
      // }else{
      //     return true;
      // }
    },
    confirmData () {
      let _this = this;
      let ad = this.multipleSelection;
      let cinemaIdss = this.multipleSelection.map(item => item.id);
      this.multipleSelection.map(item => (item.checked = true));
      _this.$emit('callBack', {
        dataList: this.multipleSelectionAll,
        whereUse: this.$attrs.whereUse
      });
    },
    // 查询
    searchFunc () {
      this.listAuthCommCinemas();
    },
    getProv: function (prov) {
      var item = this.provs.filter(item => {
        return item.areaCode == prov;
      });
      // console.log(item)
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
      this.$api
        .getAreaByparentCode({ areaCode: city })
        .then(ret => {
          if (ret && ret.code === 200) {
            this.areas = ret.data;
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    getArea: function (area) {
      var item = this.areas.filter(item => {
        return item.areaCode == area;
      });
      this.searchAdition.area.acode = item[0].areaCode;
      this.searchAdition.area.aname = item[0].areaName; // 供valadite 使用

      this.searchAdition.regionCode = item[0].areaCode;
      this.searchAdition.regionName = item[0].areaName;
      console.log(this.searchAdition);
    },
    getAreaByparentCode (code) {
      var parentCode = code || '000000';
      this.$api
        .getAreaByparentCode({ areaCode: parentCode })
        .then(ret => {
          if (ret && ret.code === 200) {
            if (!code) {
              this.provs = ret.data;
            } else {
              this.citys = ret.data;
            }
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    listAuthCommCinemas () {
      let _this = this;
      let params = this.innerFilmMultiData;
      let postObj = {
        fullName: this.searchAdition.fullName,
        id: this.searchAdition.id,
        type: this.$attrs.type,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      if (this.$attrs.type == 1 || this.$attrs.type == undefined || this.$attrs.type == null || this.$attrs.type == '') {
        cpmFilmList(postObj).then(ret => {
          if (ret && ret.code === 200) {
            let cachethisFilmList = ret.data.rows;
            let disabledObj = this.disabledData;
            for (let i = 0; i < cachethisFilmList.length; i++) {
              cachethisFilmList[i].disabled = false;
              if (disabledObj && disabledObj.length) {
                for (let j = 0; j < disabledObj.length; j++) {
                  if (cachethisFilmList[i].id == disabledObj[j].id) {
                    cachethisFilmList[i].disabled = true;
                  }
                }
              }
            }
            console.log(cachethisFilmList);
            this.filmList = cachethisFilmList;
            this.total = ret.data.total;
            this.setSelectRow();
          } else {
          }
        })
          .catch(err => {
            console.log(err);
          });
      } else {
        cpmFilmCodeList(postObj).then(ret => {
          if (ret && ret.code === 200) {
            let cachethisFilmList = ret.data.rows;
            let disabledObj = this.disabledData;
            for (let i = 0; i < cachethisFilmList.length; i++) {
              cachethisFilmList[i].disabled = false;
              if (disabledObj && disabledObj.length) {
                for (let j = 0; j < disabledObj.length; j++) {
                  if (cachethisFilmList[i].id == disabledObj[j].id) {
                    cachethisFilmList[i].disabled = true;
                  }
                }
              }
            }
            console.log(cachethisFilmList);
            this.filmList = cachethisFilmList;
            this.total = ret.data.total;
            this.setSelectRow();
          } else {
          }
        })
          .catch(err => {
            console.log(err);
          });
      }
    },
    /**
     * index 删除数组的索引
     * isDelete 不是左侧的反勾选 而是右侧的删除
     */
    deleteCurrentIndex (index, isDelete) {
      let temArrayData = this.multipleSelectionAll;
      temArrayData.splice(index, 1);
      this.changePageCoreRecordData(temArrayData, isDelete);
    },
    // 当前页数数目改变
    handleSizeChange (valua) {
      this.pageSize = valua;
      this.pageNum = 1;
      this.changePageCoreRecordData();
      this.listAuthCommCinemas();
    },
    // 当前页改变
    handleCurrentChange (valua) {
      this.pageNum = valua;
      this.changePageCoreRecordData();
      this.listAuthCommCinemas();
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
      for (var i = 0; i < val.length; i++) {
        let multipleSelectionIds = this.multipleSelection.map(item => item.id);
        if (this.multipleSelection.indexOf(this.multipleSelectionAll[i][this.idKey]) == -1) {
          this.multipleSelectionAll.push(this.multipleSelection[i]);
        }
      }
    },
    setSelectRow () {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return;
      }
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let selectAllIds = [];
      let that = this;
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      this.$refs.filmListRef.clearSelection();
      this.$nextTick(function () {
        for (var i = 0; i < this.filmList.length; i++) {
          let aa = this.filmList[i][idKey];
          if (selectAllIds.indexOf(this.filmList[i][idKey]) >= 0) {
            // 设置选中，记住table组件需要使用ref="filmListRef"
            this.$refs.filmListRef.toggleRowSelection(this.filmList[i], true);
          }
        }
      });
      console.log(this.multipleSelectionAll);
    },
    // 记忆选择核心方法
    changePageCoreRecordData (val, isDelete) {
      if (val && val.length) {
        this.multipleSelection = val;
      }
      // 标识当前行的唯一键的名称
      let idKey = this.idKey;
      let that = this;
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection;
        return;
      }
      // 总选择里面的key集合
      let selectAllIds = [];
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey]);
      });
      let selectIds = [];
      // 获取当前页选中的id
      console.log(this.multipleSelectionAll, 5);
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey]);
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row);
        }
      });
      console.log(this.multipleSelectionAll, 6);
      let noSelectIds = [];
      console.log('noSelectIds:' + noSelectIds);
      // 得到当前页没有选中的id
      this.filmList.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey]);
        }
      });
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] == id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1);
              break;
            }
          }
        }
      });
      if (isDelete) {
        this.setSelectRow();
      }
      console.log(this.multipleSelectionAll, 4);
    }
  }
};
</script>

<style lang="scss">
.diydialog-multi-cinema {
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
    padding-left: 10px;
    padding-right: 10px;
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
    width: 88%;
    float: left;
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
.el-icon-close.btn-color {
  color: #3b74ff;
}
</style>