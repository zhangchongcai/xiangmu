<template>
  <div class="_member-integral-history">
    <!-- 查询头 -->
    <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap _member-search-area-custom">
      <el-form-item label="积分流水号：" label-width="84px" prop="flowNo">
        <el-input v-model="formData.flowNo" @blur="()=>{formData.flowNo = formData.flowNo.trim()}" placeholder="积分流水号" clearable></el-input>
      </el-form-item>
      <el-form-item label="积分交易类型：" label-width="96px" prop="integralType">
        <el-select v-model="formData.integralType" placeholder="请选择积分交易类型" clearable>
          <el-option v-for="item in integralTypeOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="交易时间：" label-width="72px" prop="startTime">
        <el-date-picker v-model="formData.startTime" value-format="yyyy-MM-dd HH:mm:ss" default-time="00:00:00" type="datetime" placeholder="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        <span class="word-line">至</span>
        <el-form-item prop="endTime" style="margin-right: 0px!important;">
          <el-date-picker v-model="formData.endTime" value-format="yyyy-MM-dd HH:mm:ss" default-time="23:59:59" type="datetime" placeholder="yyyy-MM-dd HH:mm:ss"></el-date-picker>
        </el-form-item>
      </el-form-item>
      <el-form-item label="交易渠道：" label-width="72px" prop="channelName">
        <el-input v-model="formData.channelName" @blur="()=>{formData.channelName = formData.channelName.trim()}" placeholder="交易渠道" clearable></el-input>
      </el-form-item>
      <el-form-item label="交易影院：" label-width="72px" prop="cinemaName">
        <el-input v-model="formData.cinemaName" @blur="()=>{formData.cinemaName = formData.cinemaName.trim()}" placeholder="交易影院" clearable></el-input>
      </el-form-item>
      <el-form-item label="操作人：" label-width="60px" prop="operator">
        <el-input v-model="formData.operator" @blur="()=>{formData.operator = formData.operator.trim()}" placeholder="操作人" clearable></el-input>
      </el-form-item>
      <el-form-item class="btn-wrap">
        <el-button type="primary" @click="handleSearch" class="_el-btn-custom">搜索</el-button>
        <el-button @click="resetForm('formData')" plain class="_el-btn-custom _member-custom-ghost-button">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="result-title" v-if="total">为您查询到{{total}}个积分交易信息</div>
    <!-- 列表 -->
    <div class="member-list-table _m-member-table-custom">
      <el-table :data="tableData" stripe style="width: 100%" :empty-text="tipMessage">
        <el-table-column prop="flowNo" label="积分流水号" min-width="200" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="transactionTime" label="交易时间" min-width="120" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="integral" label="积分数量" min-width="80" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="integralType" label="积分交易类型" min-width="100" :formatter="formateEmpty" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.row.integralType==0?"积分获取":""}}
              {{scope.row.integralType==1?"积分兑换":""}}
              {{scope.row.integralType==2?"积分冲销":""}}
              {{scope.row.integralType==3?"手动调整积分":""}}
              {{scope.row.integralType==4?"退积分":""}}
            </template>        
        </el-table-column>
        <el-table-column prop="channelName" label="交易渠道" min-width="100" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="cinemaName" label="交易影院" min-width="120" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="operator" label="操作人" min-width="100" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button @click="handleCheckIntegralDetail(scope.row)" type="text" size="small" class="operation-button">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formData.current-0"
        :page-size="formData.size-0" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[20 , 50 , 100]"
        :total="total-0"></el-pagination>
    </div>
    <!-- 查看积分交易记录详情的dialog -->
    <el-dialog title="积分交易记录详情" :visible.sync="integralDetailVisible">
        <div class="_member-check">
          <div class="_member-check-item" style="border-top:1px solid #666666;">
            <div class="_member-check-item-left">
              <div class="_member-check-item-info">
                <span>交易流水号：</span><span>{{ scopeDialogData.flowNo || "-" }}</span>
              </div>
              <div class="_member-check-item-info">
                <span>交易日期：</span><span>{{ scopeDialogData.transactionTime || "-" }}</span>
              </div>
              <div class="_member-check-item-info">
                <span>交易渠道：</span><span>{{ scopeDialogData.channelName || "-" }}</span>
              </div>
            </div>
            <div class="_member-check-item-right">
              <div class="_member-check-item-info">
                <span>交易积分：</span><span>{{scopeDialogData.integral || "-" }}</span>
              </div>
              <div class="_member-check-item-info">
                <span>积分交易类型：</span>
                <span>
                  <!-- {{ scopeDialogData.integralType || "-" }} -->
                  {{scopeDialogData.integralType==0?"积分获取":""}}
                  {{scopeDialogData.integralType==1?"积分兑换":""}}
                  {{scopeDialogData.integralType==2?"积分冲销":""}}
                  {{scopeDialogData.integralType==3?"手动调整积分":""}}
                  {{scopeDialogData.integralType==4?"退积分":""}}
                </span>
              </div>
              <div class="_member-check-item-info">
                <span>交易影院：</span><span>{{ scopeDialogData.cinemaName || "-" }}</span>
              </div>
            </div>
          </div>
          <!-- <div class="_member-check-line">
            <div class="_member-check-line-item"></div>
          </div> -->
          <!-- <div class="_member-check-item">
            <div class="_member-check-item-left">
              <div class="_member-check-item-info">
                <span>订单编号：</span><span>{{ scopeDialogData.orderNo || "-" }}</span>
              </div>
              <div class="_member-check-item-info">
                <span>会员ID：</span><span style="margin-right:20px;">{{ scopeDialogData.memberId || "-" }}</span><span>姓名：</span><span>{{ scopeDialogData.memberName || "-" }}</span>
              </div>
              <div class="_member-check-item-info">
                <span>会员等级：</span><span>{{ scopeDialogData.memberLevel || "-" }}</span>
              </div>
            </div>
            <div class="_member-check-item-right">
              <div class="_member-check-item-info">
                <span>支付流水：</span><span>{{ scopeDialogData.paymentFlow || "-" }}</span>
              </div>
              <div class="_member-check-item-info">
                <span>手机号：</span><span>{{ scopeDialogData.phoneNum || "-" }}</span>
              </div>
              <div class="_member-check-item-info">
                <span>会员卡号：</span><span>{{ scopeDialogData.memberCardNo || "-" }}</span>
              </div>
            </div>
          </div> -->
        </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "MemberIntegralHistory",
  data() {
    return {
      uploadHeaders: {
        Authorization: this.$store.state.loginToken,
        "Cpm-User-Token": this.$store.state.loginToken
      },
      integralDetailVisible: false, //查看积分交易dialog
      tipMessage: "",
      total: 0,
      tenantId: this.$store.state.loginUser.consumerId, //租户id
      formData: {
        memberId:this.$route.query.memberId,//会员ID
        flowNo: "", //积分流水号
        // tradeTime: [], //交易时间
        endTime: "", //交易创建时间（结束）
        startTime: "", //交易创建时间（开始）
        integralType: "", //积分交易类型
        channelName: "", //交易渠道
        cinemaName: "", //交易影院
        operator: "", //操作人
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId //租户id
      },
      scopeDialogData:{},//弹窗显示内容数据
      tableData: [],
      //积分交易类型
      integralTypeOptions: [
        { code: "", desc: "全部" },
        { code: "0", desc: "积分获取" },
        { code: "1", desc: "积分兑换" },
        { code: "2", desc: "积分冲销" },
        { code: "3", desc: "手动调整积分" },
        { code: "4", desc: "退积分" },
      ],
    };
  },
  mounted() {
    console.log(this.formData.memberId)
    this.search()
  },
  methods: {
    formateEmpty(row, column, cellValue, index) {
      return cellValue != null ? cellValue : "-";
    },
    //过滤查询头空值
    formDataSelectionEmpty(object) {
      let obj={}
      for (const key in object) {
        if (object[key]) {
         obj[key]=object[key]
        }
      }
      return obj;
    },
    //请求列表
    search() {
    let params = this.formDataSelectionEmpty(JSON.parse(JSON.stringify(this.formData)));
    this.tipMessage = "数据加载中...";
    console.log(params)
    this.$crmList
      .getIntegralTradeRecordList(params)
      .then(data => {
        if (data.total == 0) {
          this.tipMessage = "暂无数据";
        }
        this.tableData = data.records || [];
        this.total = data.total || 0;
      })
      .catch(err => {
        console.log(err);
        this.tipMessage = err;
      });
    },
    // 条数
    handleSizeChange(val) {
      this.formData.size = val;
      this.search();
    },
    // 页数
    handleCurrentChange(val) {
      this.formData.current = val;
      this.search();
    },
    // 搜索
    handleSearch() {
      this.formData.current = 1;
      if(this.formData.startTime || this.formData.endTime){
        if(!this.formData.startTime){
          this.$message({
            message: '开始时间不能为空',
            type: 'warn',
            duration: 1500,
          })
          return false;
        }
        if(!this.formData.endTime){
          this.$message({
            message: '结束时间不能为空',
            type: 'warn',
            duration: 1500,
          })
          return false;
        }
      }     
      this.search();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 查看积分详情
    handleCheckIntegralDetail(scope) {
      this.integralDetailVisible = true;
      // this.scopeDialogData=scope
      let params ={
        flowNo:scope.flowNo,
        tenantId:this.tenantId
      }
      this.$crmList
      .getIntegralTradeRecordDetail(params)
      .then(data => {
        this.scopeDialogData = data;
      })
      .catch(err => {
        console.log(err);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
// 会员积分交易记录样式
._member-integral-history {
  .el-date-editor.el-input{
    width:192px;
  }
  .form-data-wrap {
    padding:24px;
    background: #f5f5f5;
    .el-form-item {
      margin-bottom: 0px;
    }
    .word-line{
      padding:0 15px;
      font-size:12px;
      color: #666 ;
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
  .member-list-table {
    .not_on {
      color: #0099ff;
    }
    .has_been_on {
      color: #80d91e;
    }
    .has_been_off {
      color: #ff3d00;
    }
    .operation-button span {
      font-size: 12px;
    }
  }
  .result-title {
    font-size: 12px;
    color: #b1b1b1;
    padding: 8px 0;
  }
  ._member-check{
    overflow:hidden;
    padding:0px 10px 10px 10px;
    color:#000;
    box-sizing: border-box;

    ._member-check-item{
      overflow:hidden;
      margin-bottom:20px;
      ._member-check-item-left{
        width:60%;
        float:left;
        padding:0 20px;
        ._member-check-item-info{
          height:20px;
          line-height:20px;
          margin-top:20px;
          font-size:14px;
          
        }
      }
      ._member-check-item-right{
        width:40%;
        float:right;
        padding:0 20px;
        ._member-check-item-info{
          font-size:14px;
          height:20px;
          line-height:20px;
          margin-top:20px;
        }
      }
    }
    ._member-check-line{
      width:100%;
      box-sizing: border-box;
      overflow:hidden;
      padding:5px 40px;
      ._member-check-line-item{
        border-top:1px dashed #666666;
        height:1px;
      }

    }
  }
 
}



</style>
