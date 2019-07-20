<template>
  <el-dialog class="cinema-dialog" :width="multiple ?'896px': '576px'" :title="title" :visible.sync="cinemalDialog"
             @open="openCallBack">
    <!-- <el-form
      :inline="true"
      :model="queryData"
      label-position="left"
      label-width="80px"
      label-suffix=":"
      class="query-box"
    >
      <el-form-item label="影院名称">
        <el-input v-model="queryData.cinemaName" placeholder="请输入影院名称"></el-input>
      </el-form-item>
      <el-button @click="handleCinemalDialogQuery"  type="primary" class="query-btn">搜索</el-button>
    </el-form> -->
    <el-row>
      <el-col :span="multiple  ? 19 : 24">
        <el-table class="table-box"
                  ref="cinemalTable"
                  :data="cinemalTableData"
                  row-key="cinemaUid"
                  height="300"
                  v-loading="tableLoding"
                  @selection-change="handleSelectionCinemal"
        >
          <div v-if="!check">
            <el-table-column type="selection" width="40" reserve-selection v-if="multiple"></el-table-column>
            <el-table-column width="40" v-else>
              <template slot-scope="scope">
                <el-radio
                        v-model="selectRadio"
                        :label="scope.row.uid"></el-radio>
              </template>
            </el-table-column>
          </div>
          <el-table-column
                  v-for="item in cinemalTableColumn"
                  :key="item.key"
                  :prop="item.key"
                  :label="item.label"
                  :formatter="item.formatter"
          ></el-table-column>
        </el-table>
        <div class="page-wrap">
          <el-pagination
                  background
                  :current-page="queryData.page"
                  :page-size="queryData.pageSize"
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange"
                  :total="cinemalTotal"
                  layout="total, prev, pager, next, jumper"
          ></el-pagination>
        </div>
      </el-col>
      <el-col :span="5" v-if="multiple">
        <div class="empty-box">
          <div class="clearfix">
            <span class="selected-content left">已选内容</span>
            <el-button type="text" class="right" @click="handleEmptyMaterials">清 空</el-button>
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
         <el-button type="primary" @click="handleSubmit">确 定</el-button>
         <el-button @click="handleDialog(false)">取 消</el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    //是否多选
    title: {
      type: String,
      default: "选择商品分类"
    },
    //是否多选
    multiple: {
      type: Boolean,
      default: false
    },
    //查看
    check: {
      type: Boolean,
      default: false
    },
    // 回选数据
    dialogFeedbackData: {
      type: [Array],
      default: () => []
    },
    dataRow:{
      type:Object
    }
  },
  data() {
    return {
      selectRadio:"",
      cinemalDialog: false,
      //门店弹窗查询数据
      queryData: {
        cinemaName: "",
        classCode:"",
        page: 1,
        pageSize: 10
      },
      cinemalTotal: 0,
      cinemalTableColumn: [
        {
          label: "分类名称",
          key: "name"
        },
        {
          label: "Code",
          key: "code"
        }
      ],
      cinemalTableData: [],
      selectedData: [],
      tableLoding:false,
    };
  },
  created() {

  },
  mounted() {

  },
  methods: {
    init() {
      console.log(this.dataRow)
      this.queryData.classCode = this.dataRow.classCode
      console.log(this.dialogFeedbackData)
      this.queryData.page = 1;
      if (this.check) {
        this.cinemalTableData = this.dialogFeedbackData.slice(this.queryData.page - 1, this.queryData.pageSize);
        this.cinemalTotal = this.dialogFeedbackData.length;
      } else {
        this.getMerCinemaList(this.queryData, 'open');
      }
      //单选去掉表头的全选
      if (!this.multiple) {

      }
    },
    openCallBack() {
      this.init();
    },
    handleDialog(flag) {
      this.cinemalDialog = flag;
    },
    // 获取门店列表
    getMerCinemaList(param = {}, type) {
      this.tableLoding =true;
      this.$cimList.headquartersGoods.synproQueryCmcProCatByClass(param).then(resData => {
        if (resData.code == 200) {
          if (type == "open") {
            this.$nextTick(() => {
              this.$refs.cinemalTable.clearSelection();
              if (this.dialogFeedbackData.length > 0) {
                this.dialogFeedbackData.forEach(row => {
                  this.$refs.cinemalTable.toggleRowSelection(row, true);
                });
              }
            })
          }
          this.cinemalTableData = resData.data.list.map(item => {
            item.cinemaUid = item.uid;
            return item;
          })
          this.cinemalTotal = resData.data.total;
        }
        this.tableLoding =false;
      }) .catch(err => {
        this.tableLoding =false;
      });
    },
    //影院弹窗搜索
    handleCinemalDialogQuery() {
      if (this.check) {
        if (this.queryData.cinemaName) {
          this.cinemalTableData = this.dialogFeedbackData.filter(item => {
            return item.name.indexOf(this.queryData.cinemaName) > -1
          })
        } else {
          this.cinemalTableData = this.dialogFeedbackData;
        }
      } else {
        this.getMerCinemaList(this.queryData);
      }
    },

    //影院弹窗选择确定
    handleSubmit() {
      if(!this.multiple) {
        this.selectedData = this.cinemalTableData.filter(item => {
          return item.uid == this.selectRadio
        });
      }
      this.$emit("onSumit", this.selectedData);
      this.handleDialog(false);
    },
    //选中影院
    handleSelectionCinemal(rows) {
      console.log("选中影院",rows);
      this.selectedData = rows;
    },
    //删除选择
    deleteSelected(row, flag) {
      console.log(row)
      this.$refs.cinemalTable.toggleRowSelection(row, false);
    },
    // 清空选择
    handleEmptyMaterials() {
      this.$refs.cinemalTable.clearSelection();
    },
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      if (this.check) {
        this.cinemalTableData = this.dialogFeedbackData.slice(0, this.queryData.pageSize);
      } else {
        this.getMerCinemaList(this.queryData);
      }
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      if (this.check) {
        let pageNum = (this.queryData.page - 1) * this.queryData.pageSize;
        this.cinemalTableData = this.dialogFeedbackData.slice(pageNum, pageNum + this.queryData.pageSize);
      } else {
        this.getMerCinemaList(this.queryData);
      }

      console.log(`当前页: ${val}`);
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.cinema-dialog {
  .query-box{
    .el-input{
      width: 152px;
    }
  }
  .el-radio__label{
    display: none;
  }
  .query-btn{
    margin-top: 5px;
  }
  .empty-box {
    padding: 0 10px 10px 10px;
    border: 1px solid #E5E5E5;
    .selected-content {
      padding: 10px 0;
    }
    .el-icon-close{
      cursor:pointer;
    }
    .title{
      width: 85%;
      overflow: hidden; /*超出部分隐藏*/
      white-space: nowrap; /*不换行*/
      text-overflow: ellipsis; /*超出部分文字以...显示*/
    }
    .el-button {
      padding-left: 0;
      padding-right: 0;
    }

    .empty-content {
      height: 245px;
      overflow-y: auto;
      border-top: 1px solid #F5F5F5;
      padding: 5px 0;
      li {
        padding: 6px 0;
      }
    }
  }
}
</style>