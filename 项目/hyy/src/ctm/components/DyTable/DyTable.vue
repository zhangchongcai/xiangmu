<!--Created by 詹陈龙 on 2018-12-17.-->
<!--关于2019/1/18的改动说明：某些表格中，接口返回的数据是一个对象，而界面需要展示其中的某一个属性，
    加上template之后，可在template中写一个方法对接口返回的数据进行操作之后，再进行渲染-->
<template>
  <el-table
    ref="table"
    :data="rows"
    v-bind="$attrs"
    v-on="$listeners"
    :row-key="rowKey"
    :stripe="stripe"
    :highlight-current-row="!multi"
    @current-change="currentChange"
  >
    <!-- @row-click="rowClick" -->
    <!-- <el-table-column type="selection" width="55" v-if="multi" /> -->
    <el-table-column
      label="选择"
      width="50"
      align="center"
      v-if="!multi && singleCheck"
    >
      <template scope="scope">
        <el-radio
          class="radio"
          :value="currentRow[rowKey]"
          :label="scope.row[rowKey]"
        >&nbsp;</el-radio>
      </template>
    </el-table-column>
    <el-table-column
      type="selection"
      width="55"
      v-if="multi"
    >
      <template slot-scope="scope">
        <el-checkbox
          :value="checkState(scope.row)"
          @change="checkItem(scope.row)"
        ></el-checkbox>
      </template>
    </el-table-column>
    <template v-for="(column, index) in columns">
      <el-table-column
        v-if="column.type=='index'"
        width="50"
        align="center"
        type="index"
        :label="column.label||'序号'"
        :key="index"
      ></el-table-column>
      <el-table-column
        v-else
        v-bind="column"
        :showOverflowTooltip="column|isShowTooltip"
        :key="index"
      >
        <template slot-scope="scope">
          <div
            v-if="column.btns"
            class="action"
          >
            <span
              v-for="(btn, index) in column.btns"
              :key="index"
            >
              <el-button
                plain
                size="mini"
                type="primary"
                :icon="btn.icon"
                v-bind="btn.props"
                @click.stop="btn.cb({value: scope.row[scope.column['property']], row: scope.row, index: scope.$index})"
              >{{btn.text}}</el-button>
            </span>
          </div>
          <div v-else-if="column.template">
            {{ column.template ? column.template(scope.row[column.key]) : scope.row[column.key] }}
          </div>
          <dy-render
            :column="column"
            :scope="scope"
            v-else
          ></dy-render>
        </template>
      </el-table-column>
      <!--<el-table-column v-bind="column" v-else/>-->
    </template>
  </el-table>
</template>

<script>
import DyRender from './DyRender.vue'
export default {
  props: {
    singleCheck: {
      type: Boolean,
      default: false
    },
    stripe: {
      type: Boolean,
      default: true
    },
    rows: {
      type: Array
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    columns: {
      type: Array
    },
    multiSelect: {
      type: Boolean
    },
    selectedRows: {
      type: Array
    },
    currentRow: {
      type: Object
    }
  },
  filters: {
    isShowTooltip (column) {
      if (column.showOverflowTooltip === undefined) {
        if (column.btns || column.renderCell || column.formatter) {
          return false
        }
        return true
      }
      return column.showOverflowTooltip
    }
  },
  components: {
    DyRender
  },
  computed: {
    multi () {
      return this.multiSelect
    },
    // checkState () {
    //   return function (row) {
    //     let ret = false;
    //     this.selectedRows.forEach((item) => {
    //       if (item[this.rowKey] == row[this.rowKey]) {
    //         ret = true;
    //       }
    //     })
    //     return ret;
    //   }
    // }
  },
  mounted () {
    // console.log(this.stripe)
    // if (this.multiSelect) {
    // let t_rows = [];
    // this.$refs.table.clearSelection();
    // this.selectedRows.forEach(row => {
    //   let t_row = this.rows.find(
    //     item => item[this.rowKey] === row[this.rowKey]
    //   );
    //   t_rows.push(t_row);
    //   this.$refs.table.toggleRowSelection(t_row, true);
    // });
    // // this.selectedRows=t_rows;
    // this.$emit("updateSelectedRows", t_rows);
    // console.log("activated")
    // }
  },
  // get multi () {
  //   return this.multiSelect
  // }
  watch: {
    // selectedRows (val, old) {
    //   this.$refs.table.clearSelection()
    //   if (val) {
    //     this.$nextTick(() =>
    //       val.forEach(row => {
    //         this.$refs.table.toggleRowSelection(row, true)
    //         // console.log(this.$refs.table);
    //       })
    //     )
    //   }
    // },
    currentRow (val, old) {
      if (val) {
        this.$nextTick(() =>
          setTimeout(this.$refs.table.setCurrentRow(val), 0)
        )
      } else {
        this.$nextTick(() => setTimeout(this.$refs.table.setCurrentRow(), 0))
      }
    },
    // selectedRows(val, old) {
    //   this.$refs.table.clearSelection()
    //   if (val) {
    //     this.$nextTick(() => val.forEach((row) => {
    //       this.$refs.table.toggleRowSelection(row, true)
    //     }))
    //   }
    // },
    // currentRow (val, old) {
    //   if (val) {
    //     this.$nextTick(() => setTimeout(this.$refs.table.setCurrentRow(val), 0))
    //   } else {
    //     this.$nextTick(() => setTimeout(this.$refs.table.setCurrentRow(), 0))
    //   }
    // }
  },
  methods: {
    checkState (row) {
      let ret = false;
      // console.log("重新渲染力");
      // console.log(this.selectedRows);
      this.selectedRows.forEach((item) => {
        if (item[this.rowKey] == row[this.rowKey]) {
          ret = true;
        }
      })
      return ret;
    },
    checkItem (row) {
      this.$emit('checkItem', row)
    },
    clearSelection () {
      this.$refs.table.clearSelection()
    },
    refreshRowSelection () {
      if (this.multiSelect) {
        let tRows = []
        this.$refs.table.clearSelection()
        // console.log(this.selectedRows)
        // console.log(this.rows)
        this.selectedRows.forEach(row => {
          let tRow = this.rows.find(
            item => item[this.rowKey] === row[this.rowKey]
          )
          if (tRow && tRow[this.rowKey]) {
            tRows.push(tRow)
            this.$refs.table.toggleRowSelection(tRow, true)
          }
        })
        // this.selectedRows=t_rows;
        // this.$emit("updateSelectedRows", tRows);
      }
    },
    currentChange (row) {
      if (row) {
        // this.$emit('update:currentRow', row)
        this.$emit('updateCurrentRow', row)
      }
    },
    select (rows, row) {
      // this.$emit('update:selectedRows', rows)
      // console.log("select");
      // this.selectedRows=rows;
      // console.log(rows);
      // this.$emit('updateSelectedRows', rows)
    },
    // 多选的时候，让点击行的时候，也能选中和取消选中行
    rowClick (row) {
      // console.log("rowClick");
      if (this.multi) {
        // const index = this.selectedRows.findIndex(
        //   item => item[this.rowKey] === row[this.rowKey]
        // )
        // if (index >= 0) {
        //   this.selectedRows.splice(index, 1)
        // } else {
        //   this.selectedRows.push(row)
        // }
        // console.log(this.selectedRows)
      } else {
        this.$emit('single-click')
      }
    },
    //
    toggleRowSelection (rows) {
      rows.forEach(row => {
        this.$refs.table.toggleRowSelection(row, true)
      })
    },
    changeRowSelection (row, flag) {
      this.$refs.table.toggleRowSelection(row, flag)
    },
  }
}
</script>

<style lang="scss" scoped>
.action {
  display: flex;
  flex-wrap: wrap;
  // > *,
  // /deep/ > * {
  //   padding: 4px;
  //   // flex: 0 0 50%;
  // }
}
</style>
