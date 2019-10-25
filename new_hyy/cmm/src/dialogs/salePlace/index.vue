<template>
  <div>
    <div class="my_dialog">
      <el-dialog title="商品" :close-on-click-modal="false" :visible.sync="dialigVisible" @close="closeDialog">
        <el-form label-width :inline="true">
          <div style="position:relative">
            <el-form-item label="商品名称">
              <el-input v-model="goodsName" style="width:184px"></el-input>
            </el-form-item>
            <el-form-item label="店内码">
              <el-input v-model="goodsNumber" style="width:184px"></el-input>
            </el-form-item>
            <el-button type="primary" style="position:absolute;right:0;top:5px;" @click="searchClick">查询</el-button>
          </div>
        </el-form>
        <!-- highlight-current-row  -->
        <div class="choose_table">
          <div>
            <el-table :data="tableData" :cell-style="{padding:0}" :row-style="{height:30}" :header-cell-style="{padding:0}" :height="354" ref="multipleTable" @select="selectRow" @select-all="selectAll">
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column property="merName" label="商品名称" width="100"></el-table-column>
              <el-table-column property="merCode" label="商品编码"></el-table-column>
              <el-table-column property="merCode" label="店内码"></el-table-column>
              <el-table-column property="price" label="标准价(元)"></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="cmm-block-pagination">
              <el-pagination @current-change="currentChange" background :current-page.sync="pageNationData.pageNum" :page-size="pageNationData.size" layout="prev, pager, next, jumper" :total="pageNationData.total"></el-pagination>
            </div>
          </div>
          <div class="choose_ul">
            <p class="ul_header">
              <span>已选内容：</span>
              <span style="color: #3B74FF;cursor: pointer;" @click="clearClick">清空</span>
            </p>
            <ul class="ul_body">
              <li v-for="(item,index) in selectedData" :key="index">
                <span>{{item.merName}}</span>
                <span class="delate_span" @click="deleteClick(item)">
                  <i class="el-icon-close"></i>
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div style="height:12px;background:transparent;"></div>
        <div class="btn-area">
          <el-button type="primary" @click="comfirmClick" style="margin-right:22px;">确定</el-button>
          <el-button @click="cancelClick">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    merTypeUid: {
      type: String,
      default: ""
    },
    merClassUid: {
      type: String,
      default: ""
    }
  },
  data () {
    return {
      dialigVisible: false,
      goodsName: "",
      goodsNumber: "",
      tableData: [],
      pageNationData: {
        pageNum: 1,
        size: 10,
        total: 0
      },
      selectedData: [],
      selectObj: {},
      usefulData: [],
      usefulObj: {},
      GoodsListQueryData: {
        pageSize: 10,
        page: 1,
        cinemaUid: 1111,
        uid: 11111
      },
      isClickComfirmButton: false,
      isClosed: false
    };
  },
  methods: {
    //控件显示
    openDialog () {
      this.dialigVisible = true;
      this.getData();
    },
    setData () {
      this.selectObj = {};
      this.selectedData = [];

      this.usefulData.forEach(element => {
        this.selectObj[element.uid] = element.uid;
        this.selectedData.push(element);
      });
      this.isClosed = true;
    },
    //关闭弹框的回调
    closeDialog () {
      this.dialigVisible = false;
      this.isClickComfirmButton === true || this.usefulData.length === 0
        ? this.setData()
        : null;
    },
    //条件查询
    searchClick () {
      this.GoodsListQueryData.cinemaUid = 11111;
      this.GoodsListQueryData.uid = 11111;
      // this.GoodsListQueryData.cinemaUid = this.goodsName;
      this.getData();
    },
    //表格单次单选行数据
    selectRow (selection, row) {
      //获取回显数据
      if (this.selectObj[row.uid]) {
        delete this.selectObj[row.uid];
      } else {
        this.selectObj[row.uid] = row.uid;
      }

      //获取选择的数据
      let deleteTemporaryData = [];
      let addTemporaryData = [];

      if (this.selectedData.length === 0) {
        addTemporaryData = selection;
      } else {
        for (let i = 0; i < this.selectedData.length; i++) {
          if (this.selectedData[i].uid === row.uid) {
            deleteTemporaryData.push(row);
          } else {
            addTemporaryData.push(row);
          }
        }
      }

      if (deleteTemporaryData.length !== 0) {
        let deleteIndex = this.selectedData.findIndex(element => {
          return element.uid === deleteTemporaryData[0].uid;
        });
        this.selectedData.splice(deleteIndex, 1);
      }
      if (deleteTemporaryData.length === 0 && addTemporaryData.length !== 0) {
        [...new Set(addTemporaryData)].forEach(element => {
          this.selectedData.push(element);
        });
      }

      console.log(this.selectedData);
    },
    //表格同时多选行
    selectAll (selection) {
      //获取回显数据
      this.tableData.forEach((row, index) => {
        if (this.selectObj.hasOwnProperty(row.uid)) {
          selection.length ? null : delete this.selectObj[row.uid];
        } else {
          this.selectObj[row.uid] = row.uid;
        }
      });

      //获取选择的数据
      let deleteTemporaryData = [];
      let addTemporaryData = [];

      if (selection.length === 0) {
        this.tableData.forEach((row1, index1) => {
          this.selectedData.forEach((row2, index2) => {
            if (row1.uid === row2.uid) {
              deleteTemporaryData.push(row2);
            }
          });
        });
        deleteTemporaryData.forEach(element1 => {
          let deleteIndex = this.selectedData.findIndex(element2 => {
            return element1.uid === element2.uid;
          });
          this.selectedData.splice(deleteIndex, 1);
        });
      } else if (selection.length !== 0 && this.selectedData.length === 0) {
        this.selectedData = selection;
      } else {
        this.tableData.forEach((row1, index1) => {
          this.selectedData.forEach((row2, index2) => {
            if (row1.uid !== row2.uid) {
              addTemporaryData.push(row1);
            }
          });
        });

        addTemporaryData.forEach(element => {
          this.selectedData.push(element);
        });
        this.selectedData = [...new Set(this.selectedData)];
      }

      console.log(this.selectedData);
    },
    //切换分页请求数据
    currentChange (val) {
      this.GoodsListQueryData.page = Number(val);
      this.getData();
    },
    //清空所选数据
    clearClick () {
      this.$refs.multipleTable.clearSelection();
      this.selectedData = [];
      this.selectObj = {};
    },
    //单次删除单条数据
    deleteClick (item) {
      if (item) {
        this.$refs.multipleTable.toggleRowSelection(item);
        delete this.selectObj[item.uid];
        console.log(this.selectedData);
        this.selectedData.forEach((row, index) => {
          if (item.uid === row.uid) {
            this.selectedData.splice(index, 1);
          }
        });
        console.log(this.selectedData);
      }
    },
    //点击确认
    comfirmClick () {
      this.usefulData = JSON.parse(JSON.stringify(this.selectedData));
      this.usefulObj = JSON.parse(JSON.stringify(this.selectObj));
      this.dialigVisible = false;
      this.$emit("SelectedGoodsCallBack", this.selectedData);
      this.$emit("appointGoodsBack", this.selectedData);
      this.isClickComfirmButton = true;
    },
    //点击取消
    cancelClick () {
      this.dialigVisible = false;
    },
    //发请求获取数据的方法
    getData () {
      let GoodsListQueryData = this.GoodsListQueryData;
      this.$cmmList
        .querySalePlace(GoodsListQueryData)
        .then(res => {
          if (res.code === 200) {
            console.log(res.data.list);
            this.tableData = JSON.parse(JSON.stringify(res.data.list));
            this.pageNationData.total = Number(res.data.total);
          } else {
            this.error(res.msg);
          }
        })
        .catch(err => { });
    },
    //控件显示及分页切换时数据保持
    dataRedisplay (data) {
      this.tableData.forEach((row, index) => {
        if (data.hasOwnProperty(row.uid)) {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        } else {
          this.$refs.multipleTable.toggleRowSelection(row, false);
        }
      });
    }
  },
  updated () {
    if (this.dialigVisible === true && this.isClosed === false) {
      this.dataRedisplay(this.selectObj);
    }
    if (this.isClosed === true) {
      this.dataRedisplay(this.usefulObj);
      this.isClosed = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.my_dialog {
  /deep/ .el-dialog {
    // width: calc(576px + 224px);
    width: 892px;
    height: 576px;
    border-radius: 4px;
    .el-dialog__header {
      padding: 14px 20px 10px;
    }
    .el-dialog__title {
      font-family: MicrosoftYaHei;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0;
      line-height: 28px;
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #979797;
      font-size: 16px;
    }
    .el-form-item__label {
      font-size: 12px;
    }

    .el-form-item {
      margin-bottom: 0;
    }

    .el-dialog__header::after {
      content: "";
      display: block;
      // width: calc(536px + 224px);
      width: 852px;
      height: 1px;
      background: #e5e5e5;
    }

    .choose_table {
      display: flex;
      margin-top: 11px;
      border-left: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;

      .choose_ul {
        background: #ffffff;
        border: 1px solid #e5e5e5;
        border-bottom: none;
        width: 224px;

        .ul_header {
          display: flex;
          padding: 10px 16px;
          justify-content: space-between;
          position: relative;

          // border-bottom: 1px solid #F5F5F5;
          &::after {
            display: block;
            position: absolute;
            top: 37px;
            content: "";
            width: 192px;
            height: 1px;
            background-color: #f5f5f5;
          }

          span {
            font-family: MicrosoftYaHei;
            font-size: 12px;
            color: #666666;
            line-height: 15px;
            letter-spacing: 0;
          }
        }

        .ul_body {
          margin-top: 10px;
          overflow-y: scroll;
          height: 350px;
          li {
            padding: 0 16px;
            display: flex;
            justify-content: space-between;
            margin-top: 0;
            width: 184px;
            height: 15px;
            line-height: 15px;
            span {
              font-family: MicrosoftYaHei;
              font-size: 12px;
              color: #666666;
              letter-spacing: 0;
            }

            .delate_span {
              cursor: pointer;
            }
          }
        }
      }
    }

    .el-dialog__body {
      padding: 0 20px;

      tr th,
      tr td {
        height: 30px;
        line-height: 30px;
      }

      .two_search {
        width: 214px;
        font-size: 12px;
      }

      .one_search {
        width: 268px;
      }

      .el-table__header-wrapper,
      .el-table__body-wrapper,
      .el-table__footer-wrapper {
        // width: 536px;
        width: calc(536px + 92px);
      }

      .el-table {
        height: 353px;
        // width: 536px;
        width: calc(536px + 92px);
        flex: 0 1 auto;
        box-sizing: border-box;

        .has-gutter tr th {
          padding: 0;
        }

        .cell {
          font-size: 12px;
          line-height: 30px;
          // float: left;
          // text-align: center;
        }

        .el-radio__label {
          padding: 0;
          display: none;
        }
      }

      .cmm-block-pagination {
        padding: 10px;

        .el-pagination {
          text-align: center;
          .btn-prev,
          .btn-next,
          .active,
          .number {
            min-width: 24px;
            height: 24px;
            line-height: 24px;
          }
          /deep/ .more {
            height: 24px;
            line-height: 24px;
            margin: 0 !important;
          }
          .el-input__inner {
            width: 48px;
            height: 24px;
          }
          button,
          ul {
            margin-top: 2px;
          }
        }
      }
    }

    .btn-area {
      display: flex;
      justify-content: center;
    }

    /deep/ .content .el-input {
      width: 50px;
    }
  }
}
</style>
