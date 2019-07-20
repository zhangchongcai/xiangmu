<template>
  <div class="member-list">
    <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap _member-search-area-custom">
      <el-form-item label="标签名称：" prop="labelName">
        <el-input v-model="formData.labelName" @blur="()=>{formData.labelName = formData.labelName.trim()}"
          placeholder="填写标签名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="mobileNum">
        <el-input v-model="formData.mobileNum" @blur="()=>{formData.mobileNum = formData.mobileNum.trim()}"
          placeholder="填写手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="会员ID：" prop="memberId">
        <el-input v-model="formData.memberId" @blur="()=>{formData.memberId = formData.memberId.trim()}"
          placeholder="填写会员ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="会员姓名：" prop="memberName">
        <el-input v-model="formData.memberName" @blur="()=>{formData.memberName = formData.memberName.trim()}"
          placeholder="填写会员姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="短信批次号：" prop="messageBatchNo">
        <el-input v-model="formData.messageBatchNo"
          @blur="()=>{formData.messageBatchNo = formData.messageBatchNo.trim()}" placeholder="短信批次号" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="发送状态：" prop="status">
        <el-select v-model="formData.status" placeholder="全部状态" clearable>
          <el-option v-for="item in MsgStatusOptions" :key="item.code" :label="item.desc" :value="item.code">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送时间：" prop="date">
        <el-date-picker v-model="formData.date" type="daterange" align="right" unlink-panels range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item class="btn-wrap">
        <el-button type="primary" @click="handleSearch" class="_el-btn-custom">搜索</el-button>
        <el-button @click="resetForm('formData')" plain class="_el-btn-custom _member-custom-ghost-button">重置
        </el-button>
      </el-form-item>
    </el-form>
    <div class="_resend-msg">
      <el-button plain class="add-button-custom _member-custom-ghost-button" @click="handleResendMsg">重新发送短信</el-button>
      <el-button plain class="add-button-custom _member-custom-ghost-button" @click="handleExportExcel">导出Excel
      </el-button>
    </div>
    <div class="_msg-detail-list-table _m-member-table-custom">
      <el-table ref="msgDetailTable" :data="tableData" stripe style="width: 100%" :empty-text="tipMessage"
        :row-key="getRowKeys" @selection-change="handleSelectMsg">
        <el-table-column type="selection" :selectable="selectable" width="40" :reserve-selection="true" align="center">
        </el-table-column>
        <el-table-column type="index" prop="id" label="序号" width="60">
          <template slot-scope="scope">
            <span style="font-size:12px;">{{scope.$index + (formData.current - 1) * formData.size + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="labelName" label="标签名称" min-width="130" :formatter="formateEmpty" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="messageBatchNo" label="短信批次号" min-width="115" :formatter="formateEmpty"
          show-overflow-tooltip></el-table-column>
        <el-table-column prop="mobileNum" label="手机号" min-width="95" :formatter="formateEmpty" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sendTime" label="发送时间" min-width="140" show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.sendTime | formatCreateTime}}</template>
        </el-table-column>
        <el-table-column prop="memberId" label="会员ID" min-width="120" :formatter="formateEmpty" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="memberName" label="会员姓名" min-width="90" :formatter="formateEmpty" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="status" label="发送状态" min-width="90" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="scope.row.status=='success'?'success':'fail'" style="fontSize:12px;">{{scope.row.status
              | judegStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="failReason" label="失败原因" min-width="120" :formatter="formateEmpty" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.failReason != null && scope.row.failReason != ''" class="circle"
              :class="scope.row.failReason=='systemError'?'system-reason':scope.row.failReason=='messageTimeSpanError'? 'send-frequent':''"></span>
            {{scope.row.failReason | formatFailReason}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" min-width="100">
          <template slot-scope="scope">
            <el-button @click="handleViewMsgContent(scope.row)" type="text" size="small" class="operation-button">查看短信内容
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 start -->
    <div class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="formData.current-0" :page-size="formData.size-0" layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[20 , 50 , 100]" :total="total-0"></el-pagination>
    </div>
    <!-- 分页 end -->
    <!--  查看短信内容的dialog -->
    <el-dialog title="短信内容" class="__view-msg-dialog" :visible.sync="viewMsgDialog">
      <div class="_view-msg-content-wrap">
        <span style="font-size:12px;" v-html="formatRemark(viewMsgContent)"></span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="viewMsgDialog = false" class="_el-btn-custom">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { formatRemark } from "../../../util/filterData.js";
export default {
  name: "CardList",
  data() {
    return {
      sendAgainMsg: [], //需要重发的短信
      viewMsgDialog: false, //查看短信内容的弹窗是否显示
      viewMsgContent: "", //短信内容
      tipMessage: "",
      total: 0,
      formData: {
        date: [], //日期选择
        labelName: "", //标签名称
        mobileNum: "", //手机号
        memberId: "", //会员ID
        memberName: "", //会员姓名
        messageBatchNo: "", //短信批次号
        status: "", //短信发送状态
        startTime: "", //发送短信开始时间
        endTime: "", //发送短信结束时间
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId //租户id
      },
      tableData: [],
      MsgStatusOptions: [
        {
          code: "",
          desc: "全部"
        },
        {
          code: "success",
          desc: "发送成功"
        },
        {
          code: "fail",
          desc: "发送失败"
        }
      ] //短信发送状态
    };
  },
  mounted() {
    this.search();
  },
  // activated(){
  //   this.search();
  // },
  filters: {
    formatFailReason(value) {
      if (value == null || value == "") {
        return "-";
      } else if (value == "messageTimeSpanError") {
        return "短信时间间隔内";
      } else if (value == "systemError") {
        return "系统问题";
      }
    },
    judegStatus: function(value) {
      if (value == "success") {
        return "发送成功";
      } else if (value == "fail") {
        return "发送失败";
      } else {
        return "-";
      }
    },
    formatCreateTime: function(value) {
      if (value) {
        return new Date(value.replace(/-/g, "/")).formatDate(
          "yyyy-MM-dd hh:mm:ss"
        );
      } else {
        return "-";
      }
    }
  },
  methods: {
    search() {
      let params = JSON.parse(JSON.stringify(this.formData));
      this.$delete(params, "date");
      if (this.formData.date && this.formData.date.length == 2) {
        params.startTime = this.formData.date[0];
        params.endTime = this.formData.date[1];
      }
      this.tipMessage = "数据加载中...";
      this.$crmList
        .labelMessageListPage(params)
        .then(data => {
          if (data.total == 0) {
            this.tipMessage = "暂无数据";
          }
          this.tableData = data.records;
          this.total = data.total;
        })
        .catch(err => {
          if (err && err.msg) {
            this.tipMessage = err.msg;
          } else {
            this.tipMessage = "系统繁忙，请稍后重试！";
          }
        });
    },
    // 搜索
    handleSearch() {
      this.formData.current = 1;
      this.search();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSizeChange(val) {
      this.formData.size = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.formData.current = val;
      this.search();
    },
    // 处理表格禁选
    selectable(row, index) {
      if (row.status == "success") {
        return false;
      } else if (
        row.status == "fail" &&
        row.failReason == "messageTimeSpanError"
      ) {
        return false;
      } else if (row.status == "fail" && row.failReason == "systemError") {
        return true;
      }
    },
    // 表格中所选的数据
    handleSelectMsg(selection) {
      this.sendAgainMsg = selection;
    },
    // 查看短信内容
    handleViewMsgContent(scope) {
      this.viewMsgDialog = true;
      this.viewMsgContent = scope.content;
    },
    // 重新发送短信
    handleResendMsg() {
      if (this.sendAgainMsg.length == 0) {
        this.$message.warning("请选择要重新发送的短信");
        return false;
      }
      let data = { labelMessageDetailVOList: this.sendAgainMsg };
      this.$crmList
        .resendLabelMessageList(data)
        .then(res => {
          if (res) {
            this.$refs.msgDetailTable.clearSelection();
            this.search();
            this.$message.success("操作成功,请稍后查看短信发送结果");
          }
        })
        .catch(err => {
          this.$message.error("操作失败，请重试");
          console.log(err);
        });
    },
    // 导出Excel
    handleExportExcel() {
      let url =
        this.$store.state.crm.domain +
        "/label/export?tenantId=" +
        this.$store.state.loginUser.consumerId +
        "&labelName=" +
        this.formData.labelName +
        "&memberId=" +
        this.formData.memberId +
        "&memberName=" +
        this.formData.memberName +
        "&messageBatchNo=" +
        this.formData.messageBatchNo +
        "&mobileNum=" +
        this.formData.mobileNum +
        "&status=" +
        this.formData.status +
        "&startTime=" +
        (this.formData.date.length == 2 ? this.formData.date[0] : "") +
        "&endTime=" +
        (this.formData.date.length == 2 ? this.formData.date[1] : "") +
        "&token=" +
        this.$store.state.loginToken;
      window.open(url, "_blank");
    },
    // 处理短信内容的格式问题
    formatRemark(value) {
      return formatRemark(value);
    },
    formateEmpty(row, column, cellValue, index) {
      return cellValue != null && cellValue != "" ? cellValue : "-";
    },
    getRowKeys(row) {
      return row.id;
    }
  }
};
</script>

<style lang='scss'>
.member-list {
  // padding: 20px;
  .form-data-wrap {
    padding: 15px 20px 0;
    background: #f5f5f5;
    .el-form-item {
      margin-bottom: 15px;
    }
    .el-form-item__label {
      font-size: 12px;
      color: #717171;
      padding: 0 6px 0 0;
    }
    .el-date-editor .el-range-input {
      // color: #717171;
      font-size: 12px;
    }
    .el-date-editor .el-range-separator {
      font-size: 12px;
    }
    .el-date-editor--daterange.el-input__inner {
      width: 210px;
      color: #717171;
      font-size: 12px;
    }
    .el-input--suffix .el-input__inner {
      width: 125px;
      color: #717171;
      font-size: 12px;
      padding-right: 0;
    }
  }
  ._resend-msg {
    font-size: 12px;
    padding: 6px 0;
    text-align: right;
    .add-button-custom {
      font-size: 12px;
      //   width: 96px;
      padding: 8px 10px;
    }
  }
  ._msg-detail-list-table {
    table thead tr th:first-child .cell {
      padding-left: 10px !important;
    }
    table tbody tr td:first-child .cell {
      padding-left: 10px !important;
    }
    .circle {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-right: 2px;
    }
    .system-reason {
      background: #739BFF;
    }
    .send-frequent {
      background: #F33430;
    }
    .success {
      color: #2dbc2d;
    }
    .fail {
      color: #F33430;
    }
    .operation-button span {
      font-size: 12px;
    }
  }
}
// 查看短信的dialog
.__view-msg-dialog {
  .el-dialog__header {
    padding: 10px 20px;
  }
  .el-dialog__body {
    padding: 0px 20px;
    position: relative;
  }
  .el-dialog__footer {
    text-align: center;
  }
  .el-dialog__headerbtn {
    top: 13px;
  }
  ._view-msg-content-wrap {
    margin-top: 10px;
    padding: 0 50px;
    min-height: 200px;
  }
}
</style>