<template>
  <el-dialog class="channel-dialog" :width="multiple?'750px': '576px'" :title="title" :visible.sync="channelDialog" @open="openCallBack">
    <el-form
      :inline="true"
      :model="queryData"
      label-position="left"
      label-width="80px"
      label-suffix=":"
    >
      <!-- <el-form-item label="渠道名称">
        <el-input v-model="queryData.cinemaName" placeholder="请输入渠道名称"></el-input>
      </el-form-item>
      <el-button @click="handlechannelDialogQuery">搜索</el-button> -->
    </el-form>
    <el-row>
      <el-col :span="multiple ? 18 : 24">
        <div class="table-box">
          <el-table
                  ref="channelTable"
                  :data="tableData"
                  row-key="channelUid"
                  height="400"
                  v-loading="tableLoding"
                  @selection-change="handleSelectionchannel"
                  stripe
                  empty-text="暂无记录"
          >
            <el-table-column type="selection" width="40" reserve-selection v-if="!check"></el-table-column>
            <el-table-column
                    v-for="item in channelTableColumn"
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
                    :total="total"
                    layout="total, prev, pager, next, jumper"
            ></el-pagination>
          </div>
        </div>
      </el-col>
      <el-col :span="6" v-if="multiple">
        <div class="empty-box">
          <div class="clearfix">
            <span class="selected-content left">已选内容</span>
            <el-button type="text" class="right" @click="handleEmptyMaterials">清 空</el-button>
          </div>
          <ul class="empty-content">
            <li :key="item.merCode" v-for="(item) in selectedData" class="clearfix">
              <span class="left title">{{item.channelName || item.name}}</span>
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
    //标题
    title: {
      type: String,
      default: "选择渠道"
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
    cinemaUid: {
      type: String,
      default: '',
    },
    // 回选数据
    dialogFeedbackData: {
      type: [Array],
      default: () => []
    },
  },
  data() {
    return {
      channelDialog: false,
      //渠道弹窗查询数据
      queryData: {
        cinemaName: "",
        cinemaUid:this.cinemaUid,
        page: 1,
        pageSize: 10
      },

      channelTotal: 0,
      selectedData: [],
      channelTableColumn: [
        {
          label: "渠道名称",
          key: "name"
        },
        {
          label: "渠道编码",
          key: "code"
        },
        {
          label: "公司名",
          key: "company"
        },
      ],
      tableLoding:false,
      tableData: [],
      total:0,
    };
  },
  created() {

  },
  mounted() {


  },
  methods: {
    init() {
      console.log(this.dialogFeedbackData)
      this.queryData.page = 1;
      if(this.check){
        this.tableData = this.dialogFeedbackData.slice(this.queryData.page-1,this.queryData.pageSize);
        this.total = this.dialogFeedbackData.length;
      }else{
        this.queryBaseChannel(this.queryData,"open");
      }

    },
    openCallBack() {
      this.init();
    },
    handleDialog(flag) {
      this.channelDialog = flag;
    },
    // 获取渠道列表
    queryBaseChannel(param={},type) {
      this.tableLoding = true;
      this.$cimList.headquartersGoods
        .queryBaseChannel(param)
        .then(resData => {
          if (resData.code == 200) {
            if(type="open"){
              this.$nextTick(() => {
                this.$refs.channelTable.clearSelection();
                if (this.dialogFeedbackData && this.dialogFeedbackData.length > 0) {
                  this.dialogFeedbackData.forEach(row => {
                    this.$refs.channelTable.toggleRowSelection(row, true);
                  });
                }
              })
            }
            resData.data.list = resData.data.list || [];
            this.tableData = resData.data.list.map(item => {
              item.channelUid = item.uid;
              return item;
            })
            this.total = resData.data.total;
          }
          this.tableLoding = false;
        })
        .catch(err => {
          this.tableLoding = false;
        });
    },
    //渠道弹窗搜索
    handlechannelDialogQuery() {

    },

    //渠道弹窗选择确定
    handleSubmit() {
      this.$emit("onSumit", this.selectedData);
      this.handleDialog(false);
    },
    //选中渠道
    handleSelectionchannel(rows) {
      console.log("选中渠道", rows)
      this.selectedData = rows;
      //不是多选
      if (!this.multiple) {
        if (this.selectedData.length > 1) {
          this.$refs.channelTable.toggleRowSelection(
            this.selectedData[0]
          );
        }
      } else {
      }
    },
    //去重(根据uid相同，避免数据问题)
    unRepeat(arr) {
      let hash = {};
      return arr.reduce((item, next) => {
        if (!hash[next.uid]) {
          hash[next.uid] = true;
          item.push(next);
        }
        return item;
      }, []);
    },
    //删除选择
    deleteSelected(row, flag) {
      console.log(row)
      this.$refs.channelTable.toggleRowSelection(row, false);
    },
    // 清空选择
    handleEmptyMaterials() {
      this.$refs.channelTable.clearSelection();
    },
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      if(this.check){
        this.tableData = this.dialogFeedbackData.slice(0,this.queryData.pageSize);
      }else{
        this.queryBaseChannel(this.queryData);
      }
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      if(this.check){
        let pageNum =  (this.queryData.page-1) * this.queryData.pageSize;
        this.tableData = this.dialogFeedbackData.slice(pageNum,pageNum + this.queryData.pageSize);
      }else{
        this.queryBaseChannel(this.queryData);
      }
      console.log(`当前页: ${val}`);
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.channel-dialog {
  .el-form-item__content {
    width: 200px;
  }
  .empty-box {
    padding: 0 10px 10px 10px;
    border: 1px solid #E5E5E5;
    border-left: none;
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
      height: 354px;
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