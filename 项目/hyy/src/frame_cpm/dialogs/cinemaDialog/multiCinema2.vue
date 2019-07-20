<template>
  <div>
    <dialogWarp :dialogVisible="dialogVisible" name="选择影院" @crmDialogOutputFlag="handleCrmDialogFlag">
      <el-form :inline="true" ref="ruleForm" label-width="85px" size="small" class="film-search">
        <el-form-item label="影院编码：">
					<el-input v-model.trim="searchAdition.cinemaCode"></el-input>
				</el-form-item>
        <el-form-item label="影院全称：">
					<el-input v-model.trim="searchAdition.cinemaName"></el-input>
				</el-form-item>
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
          <el-button type="primary" @click="search" icon="el-icon-search" style="margin-top: 1px">搜索</el-button>
      </el-form>
      <div class="_crm-card-type-dialog-wrap">
        <div class="_m-member-table-custom">
          <el-table ref="multipleTable" :empty-text="tipMessage" :data="tableData" stripe style="width: 100%" @select="handleSelect" @select-all="handleSelect"
            :row-key="getRowKeys">
            <el-table-column type="selection" width="55" :reserve-selection="true" :selectable="selectableFunc">
            </el-table-column>
            <el-table-column prop="code" label="影院编码" show-overflow-tooltip></el-table-column>
            <el-table-column prop="fullName" label="影院全称" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <!-- 分页 start -->
    <div class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="searchAdition.pageNum-0"
        :page-size="searchAdition.pageSize-0" layout="prev, pager, next, jumper, sizes" :page-sizes="[10, 20 , 50 , 100]" :total="total-0"></el-pagination>
    </div>
    <!-- 分页 end -->
      </div>
    </dialogWarp>
  </div>
</template>
<script type="text/javascript">
// import { authQueryUserCinemas } from "frame_cpm/http/interface.js";
import {authQueryUserCinemas} from 'frame_cpm/http/interface.js'
import dialogWarp from "./dialogWrap";
export default {
  data() {
    return {
      searchAdition: {
        cinemaCode: "",
        cinemaName:"",
        fullName: "",
        provinceCode: "",
        cityName: "",
        regionName: "",
        pageNum: 1,
        pageSize: 10,
      },
      tipMessage: "",
      total:0,
      multipleSelectionItem: [], //临时选择的自有权益
      callBackData: [], //暴露出去的已选数据
      tableData: []
    };
  },
  components: {
    dialogWarp
  },
  props: {
    dialogVisible: {
      type:Boolean,
      default:false
    },
    innerCinemaMultiData: {
      // 默认查询的基础数据（查询条件）
      type: Object,
      default: () => {}
    },
    reviewData: {
      //回显数据
      type: Array,
      default: () => []
    },
    disabledData: {
      type: Array,
      default: [],
      required: false
    },
  },
  created() {},
  mounted() {
    
    // this.search();
  },
  watch: {
    dialogVisible: {
      handler(newVal, oldVal) {
        this.multipleSelectionItem = new Array(...this.reviewData);
        if (newVal) {
          this.search();
        }
      }
    },
    deep: true,
    immediate: true
  },
  methods: {
     selectableFunc(row, index) {
      if (row.disabled == true) {
        return false;
      } else {
        return true;
      }
    },
    // 点击搜索按钮
    handleSearch() {
      this.searchAdition.pageNum = 1;
      this.search();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSizeChange(val) {
      this.searchAdition.pageSize = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.searchAdition.pageNum = val;
      this.search();
    },
     // 搜索自有权益
    search() {
      let params = JSON.parse(JSON.stringify(this.searchAdition));
      console.log(this.disabledData)
      this.tipMessage = "数据加载中...";
    //   this.$crmList
    //     .getCardTypeList(params)
    //     .then(data => {
    //       if (data.total == 0) {
    //         this.tipMessage = "暂无数据";
    //       }
    //       this.tableData = data.records;
    //       this.total = data.total;
    //       this.$refs.multipleTable.clearSelection();
    //       this.rowMultipleChecked(this.multipleSelectionItem);
    //     })
    //     .catch(err => {
    //       this.tipMessage = err.message;
    //     });
    let _this = this;
    //   let params = this.innerCinemaMultiData;
      let postObj = {
        cinemaName: this.searchAdition.cinemaName,
        cinemaCode: this.searchAdition.cinemaCode,
        type: this.innerCinemaMultiData && this.innerCinemaMultiData.type,
        resourceCode: this.innerCinemaMultiData && this.innerCinemaMultiData.resourceCode,
        pageNum: this.searchAdition.pageNum,
        pageSize: this.searchAdition.pageSize
      };
      authQueryUserCinemas(postObj)
        .then(data => {
          if (data && data.code === 200) {
            if (data.data.total == 0) {
                this.tipMessage = "暂无数据";
            }
            let cachethisFilmList = data.data.rows;
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
            this.tableData = cachethisFilmList;
            this.total = data.data.total;
            this.$refs.multipleTable.clearSelection();
            this.rowMultipleChecked(this.multipleSelectionItem);
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //数据为空格式化
    emptyShow(row, column, cellValue, index) {
      return cellValue ? cellValue : "-";
    },
    getRowKeys(row) {
      return row.id;
    },
    //单一数据toggle
    rowOneToggle(row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (
          row.id == this.multipleSelectionItem[index].id
        ) {
          this.multipleSelectionItem.splice(index, 1);
          return;
        }
      }
      this.multipleSelectionItem.push(row);
    },
    //单一数据add
    rowOneAdde(row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (
          row.id == this.multipleSelectionItem[index].id
        ) {
          return;
        }
      }
      this.multipleSelectionItem.push(row);
    },
    //单一数据reomove
    rowOneRemove(row) {
      for (let index = 0; index < this.multipleSelectionItem.length; index++) {
        if (
          row.id == this.multipleSelectionItem[index].id
        ) {
          this.multipleSelectionItem.splice(index, 1);
          return;
        }
      }
    },
    //手动选择卡类型
    handleSelect(selection, row) {
      if (row) {
        this.rowOneToggle(row);
      } else {
        if (selection.length == 0) {
          for (let index = 0; index < this.tableData.length; index++) {
            const item = this.tableData[index];
            this.rowOneRemove(item);
          }
        } else {
          for (let j = 0; j < selection.length; j++) {
            const selectionItem = selection[j];
            this.rowOneAdde(selectionItem);
          }
        }
      }
    },
    // 卡类型回显
    rowMultipleChecked(selectedArr) {
      if (selectedArr.length != 0) {
        for (let i = 0; i < selectedArr.length; i++) {
          for (let k = 0; k < this.tableData.length; k++) {
            if (selectedArr[i].id == this.tableData[k].id) {
              this.$refs.multipleTable.toggleRowSelection(
                this.tableData[k],
                true
              );
              break;
            }
          }
        }
      }
    },
    handleCrmDialogFlag(flag) {
      this.$emit("update:dialogVisible", false);
      if (flag == 1) {
        this.callBackData = new Array(...this.multipleSelectionItem);
      } else if (flag == 0) {
        this.callBackData = new Array(...this.reviewData);
        // this.callBackData = new Array(...this.multipleSelectionItem);
      }
      var selectedData = {
        btnType: flag,
        whereUse: this.$attrs.whereUse,
        data: this.callBackData
      };
      console.log("selectedData", selectedData);
      this.$emit("frameCinemaDialogCallBack", selectedData);
    }
  }
};
</script>
<style lang="scss">
._crm-card-type-dialog-wrap {
}
</style>