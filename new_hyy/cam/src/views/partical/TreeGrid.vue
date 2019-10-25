<template>
  <el-table :data="data" border style="width: 100%" :height="tableHeight" :row-class-name="showTr" :default-sort="defaultSort" size="mini" ref="table" :max-height="38*15+8" @sort-change="tableSortChange" class="tree-table">
    <el-table-column :prop="column.dataIndex" :key="column.dataIndex" :label="column.text" show-overflow-tooltip :min-width="column.width || 110" :fixed="column.fixed || false" :sortable="column.isNotSort ? false:'custom'" v-for="(column,index) in columns">
      <template slot-scope="scope">
        <template v-for="(space, levelIndex) in scope.row._level">
          <span v-if="spaceIconShow(index)" :key="levelIndex" class="ms-tree-space">
          </span>
        </template>
        <span :style="{marginLeft: 18*scope.row._level +'px'}" v-if="index === 0">
        </span>
        <i v-if="!scope.row._expanded && toggleIconShow(index,scope.row)" class="el-icon-caret-right" aria-hidden="true" @click="toggle(scope.$index)"></i>
        <i v-if="scope.row._expanded && toggleIconShow(index,scope.row)" class="el-icon-caret-bottom" aria-hidden="true" @click="toggle(scope.$index)"></i>
        <span v-if="column.isNotFormat">
          <template v-if="column.isSlot && !scope.row.child">
            <slot :row="scope.row"></slot>
          </template>
          <template v-else>
            {{scope.row[column.dataIndex]}}
          </template>
        </span>
        <span v-else>
          {{scope.row[column.dataIndex] | formatNum}}
        </span>
      </template>
    </el-table-column>
    <!-- <template v-else>
            <slot :name="column.dataIndex"></slot>
        </template> -->

  </el-table>
</template>
<script>
import tool from '../../util/table';
import Global from '../../util/global';

export default {
  name: 'TreeGrid',
  props: {
    // 默认的排序列
    defaultSort: {
      type: Object,
      default: function () {
        return {};
      }
    },
    // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
    treeStructure: {
      type: Boolean,
      default: function () {
        return false;
      }
    },
    // height: {
    //     type: Number,
    //     default: function () {
    //         return 500
    //     }
    // },
    more: {
      type: Boolean,
      default: function () {
        return false;
      }
    },
    // 这是相应的字段展示
    columns: {
      type: Array,
      default: function () {
        return [];
      }
    },
    // 这是数据源
    dataSource: {
      type: Array,
      default: function () {
        return [];
      }
    },
    // 这个作用是根据自己需求来的，比如在操作中涉及相关按钮编辑，删除等，需要向服务端发送请求，则可以把url传过来
    requestUrl: {
      type: String,
      default: function () {
        return '';
      }
    },
    // 这个是是否展示操作列
    treeType: {
      type: String,
      default: function () {
        return 'normal';
      }
    },
    // 是否默认展开所有树
    defaultExpandAll: {
      type: Boolean,
      default: function () {
        return false;
      }
    }
  },
  data () {
    return {
      tableHeight: 100
    };
  },
  filters: {
    formatNum: (money, count, unit) => {
      if (money == -9999) {
        return '--';
      }
      return Global.formatNum(money, count, unit);
    }
  },
  computed: {
    // 格式化数据源
    data: function () {
      let me = this;
      if (me.treeStructure) {
        let data = tool.treeToArray(me.dataSource, null, null, me.defaultExpandAll);
        return data;
      }
      return me.dataSource;
    }
  },
  mounted () {
    this.calcTableHeight();
  },
  methods: {
    tableSortChange (column) {
      this.$emit('tableSortChange', column);
    },
    calcTableHeight () {
      let h = 0;
      document.querySelectorAll('.tree-table tr').forEach(node => {
        h += node.clientHeight;
      });
      if (this.columns.some(item => item.fixed)) { // 如果列表有fixed的列，需要调整计算逻辑
        h /= 2;
      }
      this.tableHeight = h + 8;
    },
    // 显示行
    showTr ({ row, index }) {
      let show = (row._parent ? (row._parent._expanded && row._parent._show) : true);
      row._show = show;
      return show ? '' : 'hidden';
    },
    // 展开下级
    toggle (trIndex) {
      let me = this;
      let record = me.data[trIndex];
      // record._expanded = !record._expanded
      if (record._level == 0) {
        me.data.forEach((item, index) => {
          if (trIndex === index && item._level == 0) {
            me.data[index]._expanded = !me.data[index]._expanded;
          } else if (item._level == 0) {
            me.data[index]._expanded = false;
          }
        });
      } else {
        record._expanded = !record._expanded;
      }
    },
    // 显示层级关系的空格和图标
    spaceIconShow (index) {
      let me = this;
      if (me.treeStructure && index === 0) {
        return true;
      }
      return false;
    },
    // 点击展开和关闭的时候，图标的切换
    toggleIconShow (index, record) {
      this.$nextTick(() => {
        this.calcTableHeight();
      });
      let me = this;
      if (me.treeStructure && index === 0 && record.child && record.child.length > 0) {
        return true;
      }
      return false;
    }
  }
};
</script>
<style scoped lang="scss">
.tree-table {
  /deep/ tr {
    &.hidden {
      display: none;
      height: 0;
    }
  }
}
</style>
