<template>
  <div class="query-dialog-wrapper">
    <div class="input-button">
      <div @mouseenter="handleIconShow" @mouseleave="handleIconHide">
        <el-input v-model="controllerObj[this.controllerKey].vModelValue" :disabled="true">
          <i
            v-if="isShowIcon"
            class="iconfont icon-neiye-danchuangquxiao"
            slot="suffix"
            @click="handleIconClick"
          ></i>
        </el-input>
      </div>
      <button class="edit-button" @click="handleControllerDialogOpen">选择</button>
    </div>
    <div class="my_dialog">
      <el-dialog
        :title="controllerTitle"
        :visible.sync="controllerVisible"
        @close="handleControllerDialogClose"
      >
        <el-form label-width :inline="true">
          <slot name="controller-query"></slot>
          <el-button type="primary" @click="handleSearchClick">查询</el-button>
        </el-form>
        <div class="choose_table">
          <div>
            <el-table
              :data="controllerTableData"
              :cell-style="{padding:0}"
              :row-style="{height:30}"
              :header-cell-style="{padding:0}"
              :height="354"
              ref="multipleTable"
              @select="handleRowSelect"
              @select-all="handleSelectAll"
              @row-click="handleRowClick"
              v-loading="controllerTableLoading"
              class="controller-table"
            >
              <el-table-column type="selection" width="40"></el-table-column>
              <template v-for="(item, index) of controllerTablerHeader">
                <el-table-column
                  :property="item.property"
                  :label="item.label"
                  :width="item.width"
                  :key="index"
                ></el-table-column>
              </template>
            </el-table>
            <div class="block">
              <el-pagination
                @current-change="handleCurrentPageChange"
                background
                :current-page.sync="controllerPagination.pageNum"
                :page-size="controllerPagination.pageSize"
                layout="total, prev, pager, next, jumper"
                :total="controllerPagination.total"
                class="rpt-pagination"
              ></el-pagination>
            </div>
          </div>
          <div class="choose_ul">
            <p class="ul_header">
              <span>已选内容：</span>
              <span style="color: #3B74FF;cursor: pointer;" @click="handleClearClick">清空</span>
            </p>
            <ul class="ul_body">
              <li v-for="(item,index) in controllerObj[controllerKey].selectedData" :key="index">
                <div class="choose_name">{{item[vModelKey]}}</div>
                <div class="delate_span" @click="handleDeleteClick(item)">
                  <i class="el-icon-close"></i>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div style="height:12px;background:transparent;"></div>
        <div class="btn-area">
          <el-button type="primary" @click="handleComfirmClick" style="margin-right:22px;">确定</el-button>
          <el-button @click="handleCancelClick">取消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    controllerObj: Object,
    controllerTitle: String,
    controllerVisible: Boolean,
    idKey: String,
    valueKey: String,
    vModelKey: String,
    controllerTablerHeader: Array,
    controllerTableData: Array,
    controllerPagination: Object,
    resetStatus: Boolean,
    queryData: Object,
    controllerTableLoading: Boolean
  },
  data() {
    return {
      isShowIcon: false,
      cinemaUids: [],
      dealType: "",
      dealName: "",
      isClickComfirmButton: false,
      isClosed: false,
      controllerKey: ""
    };
  },
  created() {
    this.controllerKey = `${this.queryData.controlType}-${
      this.queryData.queryColKey
    }`;
    if (!this.controllerObj[this.controllerKey]) {
      this.controllerObj[this.controllerKey] = {
        selectedData: [],
        selectObj: {},
        usefulData: [],
        usefulObj: {},
        vModelValue: ""
      };
    }
  },
  methods: {
    handleIconClick() {
      this.queryData.queryColValue = "";
      this.controllerObj[this.controllerKey].vModelValue = "";
      this.controllerObj[this.controllerKey].usefulObj = {};
      this.controllerObj[this.controllerKey].usefulData = [];
      this.controllerObj[this.controllerKey].selectedData = [];
      this.controllerObj[this.controllerKey].selectObj = {};
      this.$forceUpdate();
    },
    handleIconShow() {
      if (this.queryData.queryColValue !== "") this.isShowIcon = true;
      this.$forceUpdate();
    },
    handleIconHide() {
      this.isShowIcon = false;
    },
    //控件显示
    handleControllerDialogOpen() {
      this.$emit("handleControllerDialogOpen", true);
    },
    //关闭弹框的回调
    handleControllerDialogClose() {
      this.$emit("handleControllerDialogClose");
      if (
        this.isClickComfirmButton ||
        this.controllerObj[this.controllerKey].usefulObj.length === 0
      ) {
        this.controllerObj[this.controllerKey].selectObj = {};
        this.controllerObj[this.controllerKey].selectedData = [];
        if (this.controllerObj[this.controllerKey].usefulData.length != 0) {
          this.controllerObj[this.controllerKey].usefulData.forEach(element => {
            this.controllerObj[this.controllerKey].selectObj[
              element[this.idKey]
            ] = element[this.idKey];
            this.controllerObj[this.controllerKey].selectedData.push(element);
          });
        }
        this.isClosed = true;
      }
      this.$forceUpdate();
    },
    //条件查询
    handleSearchClick() {
      this.$emit("handleSearchClick");
    },
    //表格单次单选行数据
    handleRowSelect(selection, row) {
      //获取回显数据
      if (this.controllerObj[this.controllerKey].selectObj[row[this.idKey]]) {
        delete this.controllerObj[this.controllerKey].selectObj[
          row[this.idKey]
        ];
      } else {
        this.controllerObj[this.controllerKey].selectObj[row[this.idKey]] =
          row[this.idKey];
      }

      //获取选择的数据
      let deleteTemporaryData = [];
      let addTemporaryData = [];

      if (this.controllerObj[this.controllerKey].selectedData.length === 0) {
        addTemporaryData = selection;
      } else {
        for (
          let i = 0;
          i < this.controllerObj[this.controllerKey].selectedData.length;
          i++
        ) {
          if (
            this.controllerObj[this.controllerKey].selectedData[i][
              this.idKey
            ] === row[this.idKey]
          ) {
            deleteTemporaryData.push(row);
          } else {
            addTemporaryData.push(row);
          }
        }
      }

      if (deleteTemporaryData.length !== 0) {
        let deleteIndex = this.controllerObj[
          this.controllerKey
        ].selectedData.findIndex(element => {
          return element[this.idKey] === deleteTemporaryData[0][this.idKey];
        });
        this.controllerObj[this.controllerKey].selectedData.splice(
          deleteIndex,
          1
        );
      }
      if (deleteTemporaryData.length === 0 && addTemporaryData.length !== 0) {
        [...new Set(addTemporaryData)].forEach(element => {
          this.controllerObj[this.controllerKey].selectedData.push(element);
        });
      }
      this.$forceUpdate();
    },
    //表格同时多选行
    handleSelectAll(selection) {
      //获取回显数据
      this.controllerTableData.forEach((row, index) => {
        if (
          this.controllerObj[this.controllerKey].selectObj.hasOwnProperty(
            row[this.idKey]
          )
        ) {
          selection.length
            ? null
            : delete this.controllerObj[this.controllerKey].selectObj[
                row[this.idKey]
              ];
        } else {
          this.controllerObj[this.controllerKey].selectObj[row[this.idKey]] =
            row[this.idKey];
        }
      });

      //获取选择的数据
      let deleteTemporaryData = [];
      let addTemporaryData = [];

      if (selection.length === 0) {
        this.controllerTableData.forEach((row1, index1) => {
          this.controllerObj[this.controllerKey].selectedData.forEach(
            (row2, index2) => {
              if (row1[this.idKey] === row2[this.idKey]) {
                deleteTemporaryData.push(row2);
              }
            }
          );
        });
        deleteTemporaryData.forEach(element1 => {
          let deleteIndex = this.controllerObj[
            this.controllerKey
          ].selectedData.findIndex(element2 => {
            return element1[this.idKey] === element2[this.idKey];
          });
          this.controllerObj[this.controllerKey].selectedData.splice(
            deleteIndex,
            1
          );
        });
      } else if (
        selection.length !== 0 &&
        this.controllerObj[this.controllerKey].selectedData.length === 0
      ) {
        this.controllerObj[this.controllerKey].selectedData = selection;
      } else {
        this.controllerTableData.forEach((row1, index1) => {
          this.controllerObj[this.controllerKey].selectedData.forEach(
            (row2, index2) => {
              if (row1[this.idKey] !== row2[this.idKey]) {
                addTemporaryData.push(row1);
              }
            }
          );
        });

        addTemporaryData.forEach(element => {
          this.controllerObj[this.controllerKey].selectedData.push(element);
        });
      }
      let hash = {};
      this.controllerObj[this.controllerKey].selectedData = this.controllerObj[
        this.controllerKey
      ].selectedData.reduce((item, next) => {
        hash[next[this.idKey]]
          ? ""
          : (hash[next[this.idKey]] = true && item.push(next));
        return item;
      }, []);

      this.$forceUpdate();
    },
    //点击表格某一行
    handleRowClick(row) {
      let deleteTemporaryData = [];
      let addTemporaryData = [];
      this.controllerObj[this.controllerKey].selectObj[row[this.idKey]]
        ? delete this.controllerObj[this.controllerKey].selectObj[
            row[this.idKey]
          ]
        : (this.controllerObj[this.controllerKey].selectObj[row[this.idKey]] =
            row[this.idKey]);

      if (this.controllerObj[this.controllerKey].selectedData.length !== 0) {
        this.controllerObj[this.controllerKey].selectedData.forEach(
          (element, index) => {
            element[this.idKey] !== row[this.idKey]
              ? addTemporaryData.push(row)
              : null;
            element[this.idKey] === row[this.idKey]
              ? deleteTemporaryData.push(row)
              : null;
          }
        );
      } else {
        this.controllerObj[this.controllerKey].selectedData.push(row);
      }

      addTemporaryData.length !== 0 && deleteTemporaryData.length === 0
        ? [...new Set(addTemporaryData)].forEach(element => {
            this.controllerObj[this.controllerKey].selectedData.push(element);
          })
        : null;

      deleteTemporaryData.length !== 0
        ? [...new Set(deleteTemporaryData)].forEach(element => {
            let deleteIndex = this.controllerObj[
              this.controllerKey
            ].selectedData.findIndex(
              element => element[this.idKey] === row[this.idKey]
            );
            this.controllerObj[this.controllerKey].selectedData.splice(
              deleteIndex,
              1
            );
          })
        : null;
      this.$forceUpdate();
    },
    //切换分页请求数据
    handleCurrentPageChange(val) {
      this.$emit("handleCurrentPageChange", val);
    },
    //清空所选数据
    handleClearClick() {
      this.$refs.multipleTable.clearSelection();
      this.controllerObj[this.controllerKey].selectedData = [];
      this.controllerObj[this.controllerKey].selectObj = {};
      this.$forceUpdate();
    },
    //单次删除单条数据
    handleDeleteClick(item) {
      if (item) {
        this.$refs.multipleTable.toggleRowSelection(item);
        delete this.controllerObj[this.controllerKey].selectObj[
          item[this.idKey]
        ];
        this.controllerObj[this.controllerKey].selectedData.forEach(
          (row, index) => {
            if (item[this.idKey] === row[this.idKey]) {
              this.controllerObj[this.controllerKey].selectedData.splice(
                index,
                1
              );
            }
          }
        );
        this.$forceUpdate();
      }
    },
    formateData(selectedData, queryColValue, vModelValue) {
      queryColValue = "";
      vModelValue = "";
      selectedData.forEach(element => {
        queryColValue += `${element[this.valueKey]},`;
        vModelValue += `${element[this.vModelKey]}、`;
      });
      queryColValue = queryColValue.substring(0, queryColValue.length - 1);
      vModelValue = vModelValue.substring(0, vModelValue.length - 1);
    },
    //点击确认
    handleComfirmClick() {
      this.controllerObj[this.controllerKey].usefulData = JSON.parse(
        JSON.stringify(this.controllerObj[this.controllerKey].selectedData)
      );
      this.controllerObj[this.controllerKey].usefulObj = JSON.parse(
        JSON.stringify(this.controllerObj[this.controllerKey].selectObj)
      );
      this.queryData.queryColValue = "";
      this.controllerObj[this.controllerKey].vModelValue = "";
      if (this.controllerObj[this.controllerKey].selectedData.length !== 0) {
        this.controllerObj[this.controllerKey].selectedData.forEach(element => {
          this.queryData.queryColValue += `${element[this.valueKey]},`;
          this.controllerObj[this.controllerKey].vModelValue += `${
            element[this.vModelKey]
          }、`;
        });
        this.queryData.queryColValue = this.queryData.queryColValue.substring(
          0,
          this.queryData.queryColValue.length - 1
        );
        this.controllerObj[this.controllerKey].vModelValue = this.controllerObj[
          this.controllerKey
        ].vModelValue.substring(
          0,
          this.controllerObj[this.controllerKey].vModelValue.length - 1
        );
      }
      this.isClickComfirmButton = true;
      this.$emit("handleControllerDialogClose");
      this.$forceUpdate();
    },
    //点击取消
    handleCancelClick() {
      this.$emit("handleControllerDialogClose");
    },
    //控件显示及分页切换时数据保持
    dataRedisplay(data) {
      this.controllerTableData.forEach((row, index) => {
        if (data.hasOwnProperty(row[this.idKey])) {
          this.$refs.multipleTable.toggleRowSelection(row, true);
        } else {
          this.$refs.multipleTable.toggleRowSelection(row, false);
        }
      });
    }
  },
  updated() {
    if (this.controllerVisible === true && this.isClosed === false) {
      this.dataRedisplay(this.controllerObj[this.controllerKey].selectObj);
    }
    if (this.isClosed === true) {
      this.dataRedisplay(this.controllerObj[this.controllerKey].usefulObj);
      this.isClosed = false;
    }
  },
  watch: {
    resetStatus(newVal) {
      if (newVal) {
        this.queryData.queryColValue = "";
        this.controllerObj[this.controllerKey].vModelValue = "";
        this.controllerObj[this.controllerKey].usefulObj = {};
        this.controllerObj[this.controllerKey].usefulData = [];
        this.controllerObj[this.controllerKey].selectedData = [];
        this.controllerObj[this.controllerKey].selectObj = {};
        this.$forceUpdate();
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
        background: #ffffff;
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
      .el-form {
        display: flex;
        justify-content: space-between;
        align-items: center;
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
        .controller-table {
          .el-table__body-wrapper {
            margin-top: 0 !important;
          }
        }
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
