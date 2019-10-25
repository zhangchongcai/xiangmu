<template>
  <el-dialog class="cinema-dialog" width="40%" :title="title" :visible.sync="channelDialog" @open="openCallBack">
    <el-form :inline="true" :model="queryData" label-position="left" label-width="80px" label-suffix=":">
    </el-form>
    <div class="table-box">
      <el-table ref="channelTable" :data="tableData" height="300" row-key="placeUid" @selection-change="handleSelectionchannel" stripe v-loading="tableLoding" empty-text="暂无记录">
        <el-table-column type="selection" width="40" reserve-selection v-if="!check"></el-table-column>
        <el-table-column v-for="item in channelTableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter"></el-table-column>
      </el-table>
      <div class="page-wrap">
        <el-pagination :current-page="queryData.page" :page-size="queryData.pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="total" layout="total, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
    <span slot="footer">
      <div v-if="check">
        <el-button @click="handleDialog(false)">关 闭</el-button>
      </div>
      <div v-else>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
        <el-button @click="handleDialog(false)">取 消</el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    // 是否多选
    title: {
      type: String,
      default: '选择地点'
    },
    // 是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 查看
    check: {
      type: Boolean,
      default: false
    },
    cinemaUid: {
      type: [String, Number],
      default: ''
    },
    // 回选数据
    dialogFeedbackData: {
      type: [Array],
      default: () => []
    }
  },
  data () {
    return {
      channelDialog: false,
      // 销售地点弹窗查询数据
      queryData: {
        cinemaName: '',
        cinemaUid: '',
        page: 1,
        pageSize: 10
      },
      channelTableSelection: [],
      channelTableColumn: [
        {
          label: '销售地点名称',
          key: 'placeName'
        },
        {
          label: '编码',
          key: 'code'
        }
      ],
      tableLoding: false,
      tableData: [],
      total: 0
    };
  },
  created () {
    // this.init();
  },
  mounted () { },
  methods: {
    init () {
      // console.log(this.dialogFeedbackData)
      // debugge
      this.queryData.cinemaUid = this.cinemaUid;
      this.queryData.page = 1;
      if (this.check) {
        this.tableData = this.dialogFeedbackData.slice(this.queryData.page - 1, this.queryData.pageSize);
        this.total = this.dialogFeedbackData.length;
      } else {
        this.querySalePlace(this.queryData, 'open');
      }

      // 单选去掉表头的全选
      if (!this.multiple && !this.check) {
        setTimeout(() => {
          let ele = document.querySelector('.cinema-dialog .has-gutter .cell');
          ele.style.display = 'none';
        }, 100);
      }
    },
    handleDialog (flag) {
      this.channelDialog = flag;
    },
    openCallBack () {
      this.init();
    },
    // 获取销售地点列表
    querySalePlace (param, type) {
      this.tableLoding = true;
      this.$cimList.headquartersGoods
        .querySalePlace(param)
        .then(resData => {
          if (resData.code == 200) {
            if (type == 'open') {
              this.$nextTick(() => {
                this.$refs.channelTable.clearSelection();
                if (this.dialogFeedbackData && this.dialogFeedbackData.length > 0) {
                  this.dialogFeedbackData.forEach(row => {
                    this.$refs.channelTable.toggleRowSelection(row, true);
                  });
                }
              });
            }
            resData.data.list = resData.data.list || [];
            this.tableData = resData.data.list.map(item => {
              item.placeUid = item.uid;
              return item;
            });
            this.total = resData.data.total;
          }
          this.tableLoding = false;
        })
        .catch(err => {
          this.tableLoding = false;
        });
    },
    // 销售地点弹窗搜索
    handlechannelDialogQuery () {

    },

    // 销售地点弹窗选择确定
    handleSubmit () {
      this.$emit('onSumit', this.channelTableSelection);
      this.handleDialog(false);
    },
    // 选中销售地点
    handleSelectionchannel (rows) {
      this.channelTableSelection = rows;
      // 不是多选
      if (!this.multiple) {
        if (this.channelTableSelection.length > 1) {
          this.$refs.channelTable.toggleRowSelection(
            this.channelTableSelection[0]
          );
        }
      } else {
      }
    },
    handleSizeChange (val) {
      this.queryData.pageSize = val;
      this.querySalePlace(this.queryData);
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.queryData.page = val;
      this.querySalePlace(this.queryData);
      // console.log(`当前页: ${val}`);
    }
  },
  mounted () { }
};
</script>

<style lang="scss" scoped>
.cinema-dialog {
  .el-form-item__content {
    width: 250px;
  }
  .el-button {
    margin-top: 5px;
  }
}
</style>