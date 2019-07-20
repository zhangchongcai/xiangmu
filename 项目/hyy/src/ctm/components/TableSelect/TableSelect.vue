/*
import { log } from 'util';
* Description:通用table选择框
* Author:
* Update:
*/
<template>
  <div class="ctm TableSelectWrapper">
    <!-- <edit-model @submit="saveForm" v-bind="$attrs" v-on="$listeners" :title="title" :modelVisible="modelVisible" @close="closeModel"> -->
    <el-dialog
      :close-on-click-modal="false"
      v-bind="$attrs"
      v-on="$listeners"
      :title="title"
      :visible.sync="dialogVisible"
      @before-close="closeModel"
    >
      <div class="table-select p-10">
        <el-form
          class="base-form"
          :inline="true"
          :model="queryForm"
        >
          <!-- <el-form-item label="项目名称：">
          <el-input size="small" v-model="queryForm.name" placeholder="项目名称" clearable></el-input>
        </el-form-item>-->
          <dy-form-item
            v-for="item in formItems"
            :key="item.prop"
            :model="queryForm"
            :item="item"
          ></dy-form-item>

          <el-form-item>
            <el-button
              class="w-80"
              type="primary"
              size="small"
              @click="query()"
            >搜索</el-button>
          </el-form-item>
        </el-form>
        <div class="flex-wrapper">
          <div class="table-left">
            <div
              v-loading="loading"
              class="table-content"
              v-if="isActive"
            >
              <dy-table
                :cell-style={padding:0}
                :row-style={height:30}
                :header-cell-style={padding:0}
                :rowKey="rowKey"
                :multiSelect="multiSelect"
                :singleCheck="!multiSelect"
                :stripe="false"
                :selectedRows="selectedRows"
                :currentRow="currentRow"
                @checkItem="selectCheck"
                @select-all="selectedAll"
                @selection-change="select"
                @updateSelectedRows="updateSelectedRows"
                @updateCurrentRow="updateCurrentRow"
                @row-click="rowClick"
                :columns="columns"
                :rows="rows"
                ref="selectDyTable"
              ></dy-table>
            </div>
            <div class="p-t-10 b-t">
              <el-pagination
                class="a-c p-b-10"
                background
                @current-change="pageNumChange"
                @size-change="pageSizeChange"
                :page-size="pageSize"
                layout="total,prev, pager, next, jumper"
                :total="total"
              ></el-pagination>
            </div>
          </div>
          <div
            v-if="multiSelect"
            class="select-wrapper"
          >
            <div class="select-header">
              已选{{selectedRows.length}}项
              <span @click="clearSelect">清空</span>
            </div>
            <div
              :key="index"
              v-for="(item,index) in selectedRows"
              class="select-item"
            >
              <span class="span-left">{{item[nameKey]}}</span>
              <span
                @click="deleteItem(index)"
                class="span-right"
              >
                <i class="el-icon-close btn-color"></i>
              </span>
            </div>
          </div>
        </div>

      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          class="w-80"
          type="primary"
          @click="saveForm"
        >确 定</el-button>
        <el-button
          class="w-80"
          @click="closeModel"
        >取 消</el-button>
      </span>
    </el-dialog>
    <!-- </edit-model> -->
  </div>

</template>

<script type='text/ecmascript-6'>
import { mapState } from 'vuex'
export default {
  props: {
    defaultParams: {
      type: Object,
      required: false,
      default: () => { }
    },
    modelVisible: {
      type: Boolean,
      required: false,
      default: false
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    nameKey: {
      type: String,
      default: 'name'
    },
    title: {
      type: String,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    request: {
      type: Function,
      required: false
    },
    multiSelect: {
      type: Boolean,
      required: false,
      default: false
    },
    formItems: {
      type: Array,
      required: false,
      default: () => []
    },
    defaultSelectRows: {
      type: Array,
      required: false
    },
    defaultSelectRow: {
      type: Object,
      required: false
    },
    defaultQuery: {
      type: Object,
      required: false,
      default: () => { return {} }
    }
  },
  data () {
    return {
      loading: false,
      total: 0,
      pageSize: 10,
      pageNum: 1,
      rows: [],
      queryForm: {},
      selectedRows: [],
      currentRow: {},
      isActive: false,
      localModelVisible: false,
    }
  },
  create () {

  },
  computed: {
    dialogVisible: {
      get () {
        return this.modelVisible || this.localModelVisible
      },
      set (val) {
        this.$emit('close')
      }
    }
    // ...mapState({
    //   userInfo: state => state.default.userInfo
    // })
  },
  watch: {
    modelVisible (cur, old) {
      if (cur === true) {
        // console.log(this.defaultQuery)
        this.queryForm = this.defaultQuery || {}
        if (this.multiSelect) {
          if (this.defaultSelectRows) {
            // console.log(this.defaultSelectRows)
            this.selectedRows = this.defaultSelectRows
            this.$nextTick(() => {
              this.isActive = true
              this.$forceUpdate()
              this.getData()
            })
          } else {
            this.isActive = true
            if (this.rows.length === 0) {
              this.getData()
            }
          }
        } else {
          this.isActive = true

          this.currentRow = this.defaultSelectRow || {};
          this.getData()
        }
      } else {
        this.isActive = false
      }
    }
  },
  created () {
  },
  mounted () {
    // console.log(this.defaultParams)
  },
  activated () { },

  deactivated () { },
  methods: {
    rowClick (row) {
      // console.log(row);
      let dyRow = this.rows.find((el) => {
        return el[this.rowKey] == row[this.rowKey]
      })

      let tmp_item = this.selectedRows.find((el) => {
        return el[this.rowKey] == row[this.rowKey]
      })
      if (tmp_item) {
        this.$refs.selectDyTable && this.$refs.selectDyTable.changeRowSelection(
          dyRow,
          false
        );
      } else {
        this.$refs.selectDyTable && this.$refs.selectDyTable.changeRowSelection(
          dyRow,
          true
        );
      }
    },
    select (selection, row) {
      // console.log("select change");
      if (selection && selection instanceof Array) {
        // console.log(selection)
        this.rows.forEach(item => {
          let tmp = selection.find(el => {
            return el[this.rowKey] == item[this.rowKey]
          })
          if (!tmp) {
            this.removeItem(item);
          }
        })
        selection.forEach(item => {
          this.pushItem(item)
        })
      }
    },
    pushItem (item) {
      let tmp_item = this.selectedRows.find((el) => {
        return el[this.rowKey] == item[this.rowKey]
      })
      if (!tmp_item) {
        this.selectedRows.push(item)
      }
    },
    removeItem (item) {
      this.selectedRows = this.selectedRows.filter((el) => {
        return el[this.rowKey] != item[this.rowKey]
      })
    },
    selectedAll (selection) {
      // console.log(selection);
      // return;
      // if (selection && selection instanceof Array) {
      //   // console.log(selection)
      //   // this.chooseItem = selection;
      //   this.rows.forEach(item => {
      //     let tmp = selection.find(el => {
      //       return el[this.rowKey] == item[this.rowKey]
      //     })
      //     if (!tmp) {
      //       this.removeItem(item);
      //     }
      //   })
      //   selection.forEach(item => {
      //     this.pushItem(item)
      //   })
      // }
      // if (val.length == (this.selectedRows.length - this.rows.length)) {
      //   this.rows.forEach((item) => {
      //     let index = this.isExist(item);
      //     if (index != -1) {
      //       this.selectedRows.splice(index, 1);
      //     }
      //   })
      // } else {
      //   this.rows.forEach((item) => {
      //     if (this.isExist(item) == -1) {
      //       this.selectedRows.push(item);
      //     }
      //   })
      // }
      // this.$forceUpdate();
    },
    selectCheck (row) {
      // console.log(row);
      let index = this.isExist(row);
      if (index != -1) {
        this.selectedRows.splice(index, 1);
      } else {
        this.selectedRows.push(row);
      }
      this.$forceUpdate();
    },
    isExist (row) {
      let index = -1;
      this.selectedRows.forEach((item, idx) => {
        if (item[this.rowKey] == row[this.rowKey]) {
          index = idx
        }
      });
      return index;
    },
    clearSelect () {
      this.selectedRows = [];
    },
    deleteItem (index) {
      this.selectedRows.splice(index, 1);
      this.$nextTick(() => {
        this.$forceUpdate();
      })
    },
    async getData () {
      if (this.queryForm.areas && this.queryForm.areas.length > 0) {
        if (this.queryForm.areas.length == 3) {
          this.queryForm.cityCode = this.queryForm.areas[1];
          this.queryForm.countyCode = this.queryForm.areas[2];
        } else if (this.queryForm.areas.length == 2) {
          this.queryForm.cityCode = this.queryForm.areas[1];
        }
        this.queryForm.provinceCode = this.queryForm.areas[0];
      }

      let params = {
        ...this.queryForm,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        limit: this.pageSize,
        current: this.pageNum
      }
      this.rows = [];
      if (this.$refs.selectDyTable) {
        this.$refs.selectDyTable.clearSelection();
      }
      // console.log(params)
      this.loading = true
      let [err, data] = await this.$to(this.request(params));
      this.loading = false
      if (err) {
        console.log(err);
        return;
      }
      // console.log(data)
      if (data.code === 200) {
        // this.rows = data.data;
        if (data.data) {
          if (data.data.list && data.data.list.length > 0) {
            this.rows = data.data.list;
          } else if (data.data.rows && data.data.rows.length > 0) {
            this.rows = data.data.rows;
          } else {
            this.rows = data.data.records;
          }
          this.total = parseInt(data.data.total)
        }
        // this.selectedRows = this.defaultSelectRows;
        this.$nextTick(() => {
          // this.setCurrentSelect();
          this.$refs.selectDyTable.refreshRowSelection()
        })
      }
    },
    pageSizeChange (pageSize) {
      this.pageSize = pageSize
      this.getData()
    },
    pageNumChange (pageNum) {
      this.pageNum = pageNum
      this.getData()
    },
    closeModel () {
      // console.log("closeModel");
      this.$emit('close')
    },
    query () {
      console.log(this.queryForm)
      this.getData()
    },
    saveForm () {
      if (this.multiSelect) {
        // console.log(this.selectedRows)
        this.$emit('select', this.selectedRows)
      } else {
        // console.log(this.currentRow);
        this.$emit('select', this.currentRow)
      }
      this.$emit('close')
    },
    updateCurrentRow (row) {
      // console.log(row);
      this.currentRow = row
    },
    updateSelectedRows (rows) {
      this.selectedRows = rows
      // console.log(this.selectedRows);
    }
  }
}
</script>

<style lang='scss' scoped>
// .table-select {
//   /deep/ .el-form.el-form--inline .el-input {
//     width: 180px;
//   }
// }
.TableSelectWrapper {
  /deep/ .el-dialog {
    // width: calc(576px + 224px);
    width: 892px;
    min-height: 576px;
  }
  /deep/ .el-dialog .el-dialog__body {
    padding: 0px 10px !important;
  }
  /deep/ .el-dialog {
    .el-dialog__header {
      padding-top: 16px;
    }
    .el-dialog__body {
      border-top: 1px solid #e5e5e5;
      // border-bottom: 1px solid #e5e5e5;
      padding: 0;
    }
    .el-form.el-form--inline .el-form-item {
      margin-bottom: 10px;
    }
    .el-table {
      // border-left: 0px solid #f0f0f0;
      // border-right: 0px solid #f0f0f0;
      border: none;
    }
    .el-dialog__footer {
      padding-top: 16px;
      padding-bottom: 16px;
    }
  }
  // positi1on: relative;
  .flex-wrapper {
    // width: 100%;
    // display: table;
    display: -ms-flexbox;
    display: -moz-box;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    border: 1px solid #efefef;
    box-sizing: border-box;
    // padding: 10px;
    // padding-bottom: 10px;
    .table-left {
      // display: table-cell;
      -moz-box-flex: 1;
      box-flex: 1;
      -webkit-box-flex: 1;
      -webkit-flex: 1;
      flex: 1;
      border-right: 1px solid #efefef;
      .table-content {
        height: 330px;
        overflow-y: scroll;
      }
    }
    .select-wrapper {
      width: 150px;
      // display: table-cell;
      overflow: scroll;
      max-height: 380px;
      .select-header {
        padding: 12px 12px;
        border-bottom: 1px solid #efefef;
        font-size: 13px;
        span {
          float: right;
          cursor: pointer;
        }
      }
      .select-item {
        padding: 12px 12px;
        border-bottom: 1px solid #efefef;
        font-size: 13px;
        display: flex;

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
}
</style>
