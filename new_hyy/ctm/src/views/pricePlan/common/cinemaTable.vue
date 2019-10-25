<template>
  <div class="my_dialog">
    <el-dialog :title="title" :visible.sync="dialogTableVisible">
      <el-form :inline="true">
        <el-form-item label="影院编码：">
          <el-input v-model="cinemaCode" clearable></el-input>
        </el-form-item>
        <el-form-item label="影院名称：">
          <el-input v-model="cinemaName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="position:relative;top:2px;" @click="searchUser">查询</el-button>
          <el-button type="primary" style="position:relative;top:2px;" @click="rebackName">重置条件</el-button>
        </el-form-item>
      </el-form>
      <!-- highlight-current-row  -->
      <div class="choose_table">
        <div>
          <el-table :data="gridData" :cell-style="{padding:0}" :row-style="{height:30}" :header-cell-style="{padding:0}" @select="select" ref="multipleTable" @select-all="selectAll" :row-key="getRowKeys" @selection-change="selectChange">
            <el-table-column type="selection" :reserve-selection="true" width="40"></el-table-column>
            <el-table-column prop="cinemaCode" label="影院编码">
            </el-table-column>
            <el-table-column prop="cinemaName" :label="title1">
              <template slot-scope="scope">
                <span>{{scope.row.cinemaName}}</span>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <div class="block">
            <el-pagination @current-change="handleCurrentChange" background :current-page.sync="pageData.pageNum" :page-size="pageData.pageSize" layout="total,prev, pager, next, jumper" :total="pageData.total"></el-pagination>
          </div>
        </div>
        <div class="choose_ul">
          <p class="ul_header">
            <span>已选内容：</span>
            <span style="color: #3B74FF;cursor: pointer;" @click="clearSelection">清空</span>
          </p>
          <ul class="ul_body">
            <li v-for="(item,index) in chooseItem" :key="index" style="height:20px;">
              <span style="width:100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis">{{item.cinemaName}}</span>
              <span class="delate_span" @click="delateSpan(item)">
                <i class="el-icon-close"></i>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div style="height:12px;background:transparent;"></div>
      <div class="btn-area">
        <el-button type="primary" @click="chooseUser" style="margin-right:22px;">确定</el-button>
        <el-button @click="dialogTableVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialogTableVisible: false,
      title: '',
      title1: '',
      heightOver: '',
      gridData: [],
      pageData: {},
      chooseItem: [],
      rows: [],
      cinemaName: '',
      cList: [],
      zx: null,
      cinemaCode: null
    };
  },
  methods: {
    // 点击选择数据（暂时储存的数据）
    select (selection, row) {
      if (selection && selection instanceof Array) {
        this.chooseItem = selection;
        // this.chooseItem.push(row)
      }
      console.log(this.chooseItem);
    },
    // 储存状态
    getRowKeys (row) {
      return row.cinemaUid;
    },
    toggleRowSelection () { },
    // 全选
    selectAll (selection) {
      if (selection && selection instanceof Array) {
        this.chooseItem = selection;
      }
    },
    // 确定选择
    chooseUser () {
      this.dialogTableVisible = false;
      // this.rows = this.chooseItem;
      this.$emit('chooseUser1', this.chooseItem);
    },
    checked () {
      this.$nextTick(() => {
        this.selectChange();
        // this.$refs.multipleTable.toggleAllSelection()

        // this.$refs.multipleTable.toggleRowSelection(this.gridData[1],true);
      });
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
    },
    // 数据改变
    selectChange (selection) {
      console.log(selection);
    },
    // 页面改变
    handleCurrentChange (val) {
      console.log(val, this.cinemaName);
      this.$emit('changeCurrentPage1', val, this.cinemaName, this.cinemaCode);
    },
    // 查询
    searchUser () {
      console.log(this.cinemaName);
      this.$emit('searchUser1', this.cinemaName, this.cinemaCode);
    },
    // 删除
    delateSpan (item) {
      console.log(item);
      if (item) {
        this.$refs.multipleTable.toggleRowSelection(item, false);
      }
    },
    clearSelection () {
      this.$refs.multipleTable.clearSelection();
      this.chooseItem = [];
    },
    rebackName () {
      // 清空选择项
      this.cinemaName = '';
    },
    first (rows) {
      this.$nextTick(() => {
        this.$refs.multipleTable.toggleRowSelection(rows, true);
      });
    }
  },
  watch: {
    dialogTableVisible (val) {
      this.mydialogTableVisible = val;
      this.cinemaName = '';
      if (this.cList.length > 0 && this.zx == 1) {
        this.cList.forEach(item => {
          this.gridData.forEach((i, index) => {
            if (i.cinemaUid == item.uid) {
              this.first(this.gridData[index]);
            }
          });
        });
        this.chooseItem = this.cList;
        this.zx = 0;
      }

      // this.isRember = false;
      // this.checked();
    },
    gridData () {
      this.timer = setTimeout(this.checked, 10);
    }
  },
  // mounted(){
  //
  // },
  beforeDestroy () {
    clearTimeout(this.timer);
  }
};
</script>

<style lang="scss" scoped>
.my_dialog {
  /deep/ .el-dialog {
    // width: calc(576px + 224px);
    width: 892px;
    height: 580px;
    border-radius: 4px;
    .el-form-item__content {
      width: 185px !important;
    }
    .el-form-item .el-input__inner {
      width: 184px;
    }
    .el-button {
      width: 80px;
      padding: 8px !important;
    }
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
            letter-spacing: 0;
          }
        }

        .ul_body {
          overflow-y: scroll;
          height: 350px;
          margin-top: 10px;
          li {
            padding: 0 16px;
            display: flex;
            justify-content: space-between;
            height: 20px !important;
            span {
              font-family: MicrosoftYaHei;
              font-size: 12px;
              color: #666666;
              letter-spacing: 0;

              line-height: 20px !important;
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

      .block {
        padding: 10px;

        .el-pagination {
          text-align: center;
        }
        .el-input__inner {
          width: 46px;
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