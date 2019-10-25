<template>
  <el-dialog id="cinema-dialog" :width="multiple ?'900px': '600px'" :title="title" :visible.sync="cinemalDialog" @open="openCallBack">
    <el-form :inline="true" :model="queryData" label-position="left" label-suffix=":" class="query-box">
      <el-form-item label="门店名称">
        <el-input v-model="queryData.cinemaName" placeholder="请输入门店名称"></el-input>
      </el-form-item>
      <el-button @click="handleCinemalDialogQuery" type="primary" class="query-btn">搜索</el-button>
    </el-form>
    <el-row>
      <el-col :span="multiple  ? 19 : 24">
        <el-table class="table-box" ref="cinemalTable" :data="tableData" row-key="cinemaUid" height="421" v-loading="tableLoding" @selection-change="handleSelectionCinemal">
          <div v-if="!check">
            <el-table-column type="selection" width="40" reserve-selection v-if="multiple"></el-table-column>
            <el-table-column width="40" v-else>
              <template slot-scope="scope">
                <el-radio v-model="selectRadio" :label="scope.row.cinemaUid"></el-radio>
              </template>
            </el-table-column>
          </div>
          <el-table-column v-for="item in cinemalTableColumn" :key="item.key" :prop="item.key" :label="item.label">
            <template slot-scope="{row}" name="header">
              <div v-if="item.key=='areaName'" class="area-name">
                <span v-if="row['provinceName']">{{row['provinceName']}}</span>
                <span v-if="row['cityName']">{{row['cityName']}}</span>
                <span v-if="row['areaName'] && row['areaName'] !='null'">{{row['areaName']}}</span>
                <!--                <span>{{row['address']}}</span>-->
              </div>
              <div v-else>{{row[item.key]}}</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrap">
          <el-pagination background :current-page="queryData.page" :page-size="queryData.pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange" :total="cinemalTotal" layout="total, prev, pager, next, jumper"></el-pagination>
        </div>
      </el-col>
      <el-col :span="5" v-if="multiple">
        <div class="empty-box">
          <div class="clearfix">
            <span class="selected-content left">已选门店</span>
            <el-button type="text" class="right empty-btn" @click="handleEmptyMaterials">清 空</el-button>
          </div>
          <ul class="empty-content">
            <li :key="item.merCode" v-for="(item) in selectedData" class="clearfix">
              <span class="left title">{{item.cinemaName || item.name}}</span>
              <i class="el-icon-close right" @click="deleteSelected(item,false)"></i>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
    <span slot="footer">
      <div v-if="check">
        <el-button @click="handleDialog(false)">关 闭</el-button>
      </div>
      <div v-else>
        <el-button type="primary mgr22" @click="handleSubmit">确 定</el-button>
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
      default: '选择门店'
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
    // 回选数据
    dialogFeedbackData: {
      type: [Array],
      default: () => []
    }
  },
  data () {
    return {
      selectRadio: '',
      cinemalDialog: false,
      // 门店弹窗查询数据
      queryData: {
        cinemaName: '',
        page: 1,
        pageSize: 10
      },
      cinemalTotal: 0,
      cinemalTableColumn: [
        {
          label: '门店名称',
          key: 'name'
        },
        {
          label: '门店编码',
          key: 'code'
        },
        {
          label: '城市地区',
          key: 'areaName'
        }
      ],
      tableData: [],
      selectedData: [],
      tableLoding: false
    };
  },
  created () { },
  mounted () {
    this.init();
  },
  methods: {
    init (type) {
      this.queryData.page = 1;
      if (!this.check) {
        this.getMerCinemaList(this.queryData, type);
      }
    },
    openCallBack () {
      // 解决多选回选问题
      if (this.multiple) {
        this.init('open');
      }
      if (this.check) {
        this.tableData = this.dialogFeedbackData.slice(
          this.queryData.page - 1,
          this.queryData.pageSize
        );
        this.cinemalTotal = this.dialogFeedbackData.length;
      }
    },

    setCinemalTableChecked () {
      this.$nextTick(() => {
        if (this.$refs.cinemalTable) {
          this.$refs.cinemalTable.clearSelection();
          if (this.dialogFeedbackData.length > 0) {
            this.dialogFeedbackData.forEach(row => {
              if (row.cinemaUid) {
                this.$refs.cinemalTable.toggleRowSelection(row, true);
              }
            });
          }
        }
      });
    },
    handleDialog (flag) {
      this.cinemalDialog = flag;
    },
    // 获取门店列表
    getMerCinemaList (param = {}, type) {
      this.tableLoding = true;
      this.$cimList
        .merCinemaList(param)
        .then(resData => {
          if (resData.code == 200) {
            // resData.data.list =  [resData.data.list[0]]
            if (type == 'open') {
              this.setCinemalTableChecked();
            }
            this.tableData = resData.data.list.map(item => {
              item.cinemaUid = item.uid || item.id;
              item.uid = item.uid || item.id;
              item.extend = null;
              return item;
            });
            this.cinemalTotal = resData.data.total;
            if (!this.multiple) {
              if (this.tableData.length == 1) {
                this.selectRadio = this.tableData[0].cinemaUid;
              } else {
                this.selectRadio = this.dialogFeedbackData[0].cinemaUid;
              }
              this.$emit('onSumit', this.tableData, 'default');
            }
          }
          this.tableLoding = false;
        })
        .catch(err => {
          this.tableLoding = false;
        });
    },
    // 门店弹窗搜索
    handleCinemalDialogQuery () {
      if (this.check) {
        if (this.queryData.cinemaName) {
          this.tableData = this.dialogFeedbackData.filter(item => {
            return item.name.indexOf(this.queryData.cinemaName) > -1;
          });
        } else {
          this.tableData = this.dialogFeedbackData;
        }
      } else {
        this.getMerCinemaList(this.queryData);
      }
    },

    // 门店弹窗选择确定
    handleSubmit () {
      if (!this.multiple) {
        this.selectedData = this.tableData.filter(item => {
          return item.cinemaUid == this.selectRadio;
        });
      }
      this.$emit('onSumit', this.selectedData);
      this.handleDialog(false);
    },
    // 选中门店
    handleSelectionCinemal (rows) {
      // console.log("选中门店",rows);
      this.selectedData = rows;
    },
    // 删除选择
    deleteSelected (row, flag) {
      // console.log(row)
      this.$refs.cinemalTable.toggleRowSelection(row, false);
      // 删除数据
      // this.dialogFeedbackData= this.dialogFeedbackData.filter(item => {
      //   return item.cinemaUid != row.cinemaUid
      // })
      // 取消表格的勾选
      this.tableData.map(item => {
        if (item.cinemaUid == row.cinemaUid) {
          this.$refs.cinemalTable.toggleRowSelection(item, false);
        }
      });
    },
    // 清空选择
    handleEmptyMaterials () {
      this.$refs.cinemalTable.clearSelection();
    },
    handleSizeChange (val) {
      this.queryData.pageSize = val;
      if (this.check) {
        this.tableData = this.dialogFeedbackData.slice(
          0,
          this.queryData.pageSize
        );
      } else {
        this.getMerCinemaList(this.queryData);
      }
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.queryData.page = val;
      if (this.check) {
        let pageNum = (this.queryData.page - 1) * this.queryData.pageSize;
        this.tableData = this.dialogFeedbackData.slice(
          pageNum,
          pageNum + this.queryData.pageSize
        );
      } else {
        this.getMerCinemaList(this.queryData);
      }

      // console.log(`当前页: ${val}`);
    }
  }
};
</script>

<style lang="scss">
#cinema-dialog {
  .el-radio__label {
    display: none;
  }
  .query-btn {
    margin-top: 6px;
  }
  .area-name {
    span {
      float: left;
    }
  }
  .empty-box {
    padding: 0 10px 10px 10px;
    border: 1px solid #e5e5e5;
    border-left: none;
    .selected-content {
      padding: 10px 0;
    }
    .empty-btn {
      margin-top: 4px;
    }
    .el-icon-close {
      cursor: pointer;
    }
    .title {
      width: 85%;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*不换行*/
      text-overflow: ellipsis; /*超出部分文字以...显示*/
      font-size: 12px;
    }
    .el-button {
      padding-left: 0;
      padding-right: 0;
    }

    .empty-content {
      height: 352px;
      overflow-y: auto;
      border-top: 1px solid #f5f5f5;
      padding: 5px 0;
      li {
        padding: 6px 0;
      }
    }
  }
}
</style>