<template>
  <div class="query-dialog-wrapper">
    <div class="input-button">
      <div @mouseenter="showIcon" @mouseleave="hideIcon">
        <el-input v-model="ticketVale" :disabled="true">
          <i
            v-if="isShowIcon"
            class="iconfont icon-neiye-danchuangquxiao"
            slot="suffix"
            @click="handleIconClick"
          ></i>
        </el-input>
      </div>
      <button class="edit-button" @click="openDialog">选择</button>
    </div>
    <!-- <el-input v-model="ticketVale" v-on:click.native="openDialog"></el-input> -->
    <div class="my_dialog">
      <el-dialog title="影片" :visible.sync="dialigVisible" @close="closeDialog">
        <el-form label-width :inline="true">
          <div style="position:relative">
            <el-form-item label="票类名称">
              <el-input v-model="ticketName" style="width:184px"></el-input>
            </el-form-item>
            <el-button
              type="primary"
              style="position:absolute;right:0;top:5px;"
              @click="searchClick"
            >查询</el-button>
          </div>
        </el-form>

        <!-- highlight-current-row  -->
        <div class="choose_table">
          <div>
            <el-table
              :data="tableData"
              :cell-style="{padding:0}"
              :row-style="{height:30}"
              :header-cell-style="{padding:0}"
              :height="354"
              :key="Math.random()"
              ref="multipleTable"
              @select="selectRow"
              @select-all="selectAll"
              @row-click="rowClick"
            >
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column prop="name" label="票类名称" show-overflow-tooltip></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="block">
              <el-pagination
                @current-change="currentChange"
                background
                :current-page.sync="pageNationData.pageNum"
                :page-size="pageNationData.size"
                layout="total, prev, pager, next, jumper"
                :total="pageNationData.total"
              ></el-pagination>
            </div>
          </div>
          <div class="choose_ul">
            <p class="ul_header">
              <span>已选内容：</span>
              <span style="color: #3B74FF;cursor: pointer;" @click="clearClick">清空</span>
            </p>
            <ul class="ul_body">
              <li v-for="(item,index) in selectedData" :key="index">
                <div class="choose_name">{{item.name}}</div>
                <div class="delate_span" @click="deleteClick(item)">
                  <i class="el-icon-close"></i>
                </div>
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
import mixins from "src/frame_cpm/mixins/cacheMixin.js";
export default {
  mixins: [mixins.cacheMixin],
  props: {
    resetStatus: Boolean,
    cinemaUid: String
  },
  data() {
    return {
      cacheField: [
        "ticketVale",
        "tableData",
        "pageNationData",
        "selectObj",
        "usefulData",
        "usefulObj"
      ],
      subComName: "ticketType",
      ticketVale: "",
      isShowIcon: false,
      dialigVisible: false,
      ticketName: "",
      cinemaUids: [],
      tableData: [],
      pageNationData: {},
      selectedData: [],
      selectObj: {},
      usefulData: [],
      usefulObj: {},
      isClickComfirmButton: false,
      isClosed: false
    };
  },
  methods: {
    handleIconClick() {
      this.ticketVale = "";
      this.selectedData = [];
      this.selectObj = {};
      this.$emit("selectTicketTypeData", this.ticketVale);
    },
    showIcon() {
      if (this.ticketVale !== "") this.isShowIcon = true;
    },
    hideIcon() {
      this.isShowIcon = false;
    },
    //控件显示
    openDialog() {
      this.cinemaUids = this.cinemaUid.split(",");
      if ((this.cinemaUids.length === 1) && (this.cinemaUids[0] === "")) {
        this.$message({
          message: "请先选择影院",
          iconClass: "iconfont icon-danchuang-jingtanhao",
          customClass: "rpt-alert-message",
          center: "true"
        });
      } else {
        this.dialigVisible = true;
        this.getData(1, 10, this.cinemaUids, "");
        // this.getData(1, 10, ['745498'], "");
      }
    },
    setData() {
      this.selectObj = {};
      this.selectedData = [];

      this.usefulData.forEach(element => {
        this.selectObj[element.id] = element.id;
        this.selectedData.push(element);
      });
      this.isClosed = true;
    },
    //关闭弹框的回调
    closeDialog() {
      this.dialigVisible = false;
      this.isClickComfirmButton === true || this.usefulData.length === 0
        ? this.setData()
        : null;
    },
    //条件查询
    searchClick() {
      this.getData(1, 10, this.cinemaUids, this.ticketName);
    // this.getData(1, 10, ['745498'], this.ticketName);
    },
    //表格单次单选行数据
    selectRow(selection, row) {
      console.log(111);
      //获取回显数据
      if (this.selectObj[row.id]) {
        delete this.selectObj[row.id];
      } else {
        this.selectObj[row.id] = row.id;
      }

      //获取选择的数据
      let deleteTemporaryData = [];
      let addTemporaryData = [];

      if (this.selectedData.length === 0) {
        addTemporaryData = selection;
      } else {
        for (let i = 0; i < this.selectedData.length; i++) {
          if (this.selectedData[i].id === row.id) {
            deleteTemporaryData.push(row);
          } else {
            addTemporaryData.push(row);
          }
        }
      }

      if (deleteTemporaryData.length !== 0) {
        let deleteIndex = this.selectedData.findIndex(element => {
          return element.id === deleteTemporaryData[0].id;
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
    selectAll(selection) {
      console.log(222);
      //获取回显数据
      this.tableData.forEach((row, index) => {
        if (this.selectObj.hasOwnProperty(row.id)) {
          selection.length ? null : delete this.selectObj[row.id];
        } else {
          this.selectObj[row.id] = row.id;
        }
      });

      //获取选择的数据
      let deleteTemporaryData = [];
      let addTemporaryData = [];

      if (selection.length === 0) {
        this.tableData.forEach((row1, index1) => {
          this.selectedData.forEach((row2, index2) => {
            if (row1.id === row2.id) {
              deleteTemporaryData.push(row2);
            }
          });
        });
        deleteTemporaryData.forEach(element1 => {
          let deleteIndex = this.selectedData.findIndex(element2 => {
            return element1.id === element2.id;
          });
          this.selectedData.splice(deleteIndex, 1);
        });
      } else if (selection.length !== 0 && this.selectedData.length === 0) {
        this.selectedData = selection;
      } else {
        this.tableData.forEach((row1, index1) => {
          this.selectedData.forEach((row2, index2) => {
            if (row1.id !== row2.id) {
              addTemporaryData.push(row1);
            }
          });
        });

        addTemporaryData.forEach(element => {
          this.selectedData.push(element);
        });
      }
      let hash = {};
      this.selectedData = this.selectedData.reduce((item, next) => {
        hash[next.id] ? "" : (hash[next.id] = true && item.push(next));
        return item;
      }, []);

      console.log(this.selectedData);
    },
    //点击表格某一行
    rowClick(row) {
      let deleteTemporaryData = [];
      let addTemporaryData = [];

      this.selectObj[row.id]
        ? delete this.selectObj[row.id]
        : (this.selectObj[row.id] = row.id);

      if (this.selectedData.length !== 0) {
        this.selectedData.forEach((element, index) => {
          element.id !== row.id ? addTemporaryData.push(row) : null;
          element.id === row.id ? deleteTemporaryData.push(row) : null;
        });
      } else {
        this.selectedData.push(row);
      }

      addTemporaryData.length !== 0 && deleteTemporaryData.length === 0
        ? [...new Set(addTemporaryData)].forEach(element => {
            this.selectedData.push(element);
          })
        : null;

      deleteTemporaryData.length !== 0
        ? [...new Set(deleteTemporaryData)].forEach(element => {
            let deleteIndex = this.selectedData.findIndex(
              element => element.id === row.id
            );
            this.selectedData.splice(deleteIndex, 1);
          })
        : null;
    },
    //切换分页请求数据
    currentChange(val) {
      this.getData(val, 10, this.cinemaUids, this.ticketName);
    // this.getData(val, 10, ['745498'], this.ticketName);
    },
    //清空所选数据
    clearClick() {
      this.$refs.multipleTable.clearSelection();
      this.selectedData = [];
      this.selectObj = {};
    },
    //单次删除单条数据
    deleteClick(item) {
      if (item) {
        this.$refs.multipleTable.toggleRowSelection(item);
        delete this.selectObj[item.id];
        console.log(this.selectedData);
        this.selectedData.forEach((row, index) => {
          if (item.id === row.id) {
            this.selectedData.splice(index, 1);
          }
        });
        console.log(this.selectedData);
      }
    },
    //点击确认
    comfirmClick() {
      this.usefulData = JSON.parse(JSON.stringify(this.selectedData));
      this.usefulObj = JSON.parse(JSON.stringify(this.selectObj));
      this.dialigVisible = false;
      this.ticketVale = "";
      let ticketTypeUid = "";
      if (this.selectedData.length !== 0) {
        this.selectedData.forEach(element => {
          this.ticketVale += `${element.name},`;
          ticketTypeUid += `${element.Uid},`;
        });
      } else {
        this.ticketVale = "";
      }
      this.$emit("selectTicketTypeData", ticketTypeUid);
      this.isClickComfirmButton = true;
    },
    //点击取消
    cancelClick() {
      this.dialigVisible = false;
    },
    //发请求获取数据的方法
    getData(currentPage, pageSize, cinemaUid, ticketTypeName) {
      this.$rptList
        .gitTicketData(currentPage, pageSize, cinemaUid, ticketTypeName)
        .then(res => {
          if (res && res.code === 200) {
            this.tableData = JSON.parse(JSON.stringify(res.data.records));
            this.pageNationData = res.data;
            this.$forceUpdate();
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //控件显示及分页切换时数据保持
    dataRedisplay(data) {
      this.tableData.forEach((row, index) => {
        if (data.hasOwnProperty(row.id)) {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        } else {
          this.$refs.multipleTable.toggleRowSelection(row, false);
        }
      });
    }
  },
  updated() {
    if (this.dialigVisible === true && this.isClosed === false) {
      this.dataRedisplay(this.selectObj);
    }
    if (this.isClosed === true) {
      this.dataRedisplay(this.usefulObj);
      this.isClosed = false;
    }
  },
  watch: {
    resetStatus(newVal) {
      if (newVal) {
        this.ticketVale = "";
        this.usefulData = [];
        this.usefulObj = {};
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.query-dialog-wrapper {
  .select-button {
    font-family: "MicrosoftYaHei";
    font-size: 12px;
    color: #3b74ff;
    letter-spacing: 0;
    text-align: center;
    width: 80px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #3b74ff;
    border-radius: 4px;
    &:hover {
      cursor: pointer;
    }
  }

  /deep/ .input-button {
    display: flex;
    .el-input {
      margin-right: 8px;
      .el-input__inner {
        width: 192px;
        height: 32px;
        padding-left: 16px;
        padding-right: 26px;
        font-family: "MicrosoftYaHei";
        font-size: 12px;
        color: #666666;
        background: #f5f5f5;
        border: 1px solid #bcbcbc;
        border-radius: 4px;
        text-overflow: ellipsis;
      }
      .el-input__suffix {
        right: 15px;
      }
      .iconfont {
        font-size: 10px;
        line-height: 32px;
        color: #3b74ff;
        margin-right: 4px;
        &:hover {
          cursor: pointer;
        }
      }
    }
    .edit-button {
      width: 80px;
      height: 32px;
      font-family: "MicrosoftYaHei";
      font-size: 12px;
      color: #3b74ff;
      background: #ffffff;
      border: 1px solid #3b74ff;
      border-radius: 4px;
      &:hover {
        cursor: pointer;
      }
      span {
        font-family: "MicrosoftYaHei";
        font-size: 12px;
      }
    }
  }
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

      .el-button {
        width: 80px;
        height: 32px;
        span {
          font-family: "MicrosoftYaHei";
          font-size: 12px;
        }
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
            margin-top: 12px;
            overflow-y: scroll;
            height: 350px;
            li {
              padding: 0 0 0 16px;
              display: flex;
              justify-content: space-between;
              margin-top: 0;
              line-height: 16px;
              .choose_name {
                display: flex;
                align-items: center;
                padding-right: 8px;
                width: 180px;
                line-height: 16px;
                white-space: normal;
                word-break: break-all;
                word-wrap: break-word;
                font-family: MicrosoftYaHei;
                font-size: 12px;
                color: #666666;
                letter-spacing: 0;
              }

              .delate_span {
                display: flex;
                align-items: center;
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

        .block {
          padding: 10px;
          .el-pagination.is-background .el-pager li {
            margin: 0 5px !important;
          }
          .el-pagination {
            text-align: center;
            .el-pagination__total {
              margin-top: -2px;
            }
            .btn-prev,
            .btn-next,
            .active,
            .number {
              margin-top: -1px;
              min-width: 24px;
              height: 24px;
              line-height: 24px;
            }
            .el-icon-more {
              height: 24px;
              line-height: 24px;
              margin-top: -1px;
            }
            /deep/ .more {
              height: 24px;
              line-height: 24px;
            }
            .el-input__inner {
              width: 48px;
              height: 24px;
            }
            .el-pagination__jump {
              margin-top: -2px;
            }
          }
        }
      }

      .btn-area {
        display: flex;
        justify-content: center;
        .el-button {
          width: 80px;
          height: 32px;
        }
      }

      /deep/ .content .el-input {
        width: 50px;
      }
    }
  }
}
</style>
