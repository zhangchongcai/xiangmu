<template>
  <div class="_member-integral-query">
    <!-- 查询头 -->
    <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap _member-search-area-custom">
      <el-form-item label="会员ID：" label-width="90px" prop="memberParam">
        <el-input v-model="formData.memberParam" @blur="()=>{formData.memberParam = formData.memberParam.trim()}" placeholder="ID/手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="会员姓名：" label-width="90px" prop="memberName">
        <el-input v-model="formData.memberName" @blur="()=>{formData.memberName = formData.memberName.trim()}" placeholder="会员姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="会员等级：" label-width="90px" prop="memberLevel">
        <el-select v-model="formData.memberLevel" placeholder="请选择会员等级" clearable>
          <el-option v-for="item in memberLevelOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <br/>
      <el-form-item label="积分余额：" label-width="90px" prop="minBalance">
        <el-input style="width:192px;" v-model="formData.minBalance" @blur="()=>{formData.minBalance = formData.minBalance.trim()}" placeholder="" clearable></el-input>
        <span class="word-line">至</span>
        <el-form-item  prop="maxBalance">
          <el-input style="width:192px;" v-model="formData.maxBalance" @blur="()=>{formData.maxBalance = formData.maxBalance.trim()}" placeholder="" clearable></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item label="累计积分：" label-width="90px" prop="minTotal">
        <el-input style="width:192px;" v-model="formData.minTotal" @blur="()=>{formData.minTotal = formData.minTotal.trim()}" placeholder="" clearable></el-input>
        <span class="word-line">至</span>
        <el-form-item  prop="maxTotal">
          <el-input style="width:192px;" v-model="formData.maxTotal" @blur="()=>{formData.maxTotal = formData.maxTotal.trim()}" placeholder="" clearable></el-input>
        </el-form-item>
      </el-form-item>
      <el-form-item class="btn-wrap">
        <el-button type="primary" @click="handleSearch" class="_el-btn-custom">搜索</el-button>
        <el-button @click="resetForm('formData')" plain class="_el-btn-custom _member-custom-ghost-button">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 选择加减积分 -->
    <div class="member-level-title">
      <el-checkbox style="height:32px;line-height:32px;" v-model="checked" @change="toggleSelection(checked)">全选</el-checkbox>
      <el-radio style="height:32px;line-height:32px;" v-model="integralParamsType" label="0">+</el-radio>
      <el-radio style="height:32px;line-height:32px;" v-model="integralParamsType" label="1">-</el-radio>
      <el-input style="width:192px;" v-model="integralParams.integral" @blur="()=>{integralParams.integral = integralParams.integral.trim()}" placeholder="积分" clearable></el-input>
      <div class="word-style">积分</div>
      <el-button type="primary" class="_el-btn-custom" @click="commitIntegral">确定</el-button>
    </div>
    <!-- 列表 -->
    <div class="member-list-table _m-member-table-custom">
      <el-table :data="tableData" stripe style="width: 100%"  ref="multipleTable" :empty-text="tipMessage" @selection-change="handleSelectionChange" @select-all="handleSelectAll">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="memberId" label="会员ID" min-width="100" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memberName" label="姓名" min-width="100" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mobileNum" label="手机号" min-width="120" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="memberLevel" label="会员等级" min-width="100" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="integralBalance" label="积分余额" min-width="100" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="totalIntegral" label="累计积分" min-width="100" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="willExpireIntegral" label="即将过期积分" min-width="100" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="modifyTime" label="过期日期" min-width="120" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="200">
          <template slot-scope="scope">
            <el-button @click="handleIntegralDetail(scope.row)" type="text" size="small" class="operation-button">查看</el-button>
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
  </div>
</template>
<script>
export default {
  name: "MemberIntegralQuery",
   data() {
    return {
      checked:"",
      multipleSelection: [],//选中列表数据
      uploadHeaders: {
        Authorization: this.$store.state.loginToken,
        "Cpm-User-Token": this.$store.state.loginToken
      },
      integralDetailVisible: false, //查看积分交易dialog
      tipMessage: "",
      total: 20,
      tenantId: this.$store.state.loginUser.consumerId, //租户id
      formData: {
        memberParam: "", //会员ID
        memberName: "", //会员姓名
        memberLevel: "", //会员等级
        maxTotal: "", //累计积分上限
        minTotal: "", //累计积分下限
        maxBalance: "", //积分余额上限
        minBalance: "", //积分余额下限
        current: 1,
        size: 20,
        tenantId: this.$store.state.loginUser.consumerId //租户id
      },
      //添加或者减少积分
      integralParamsType:"0",
      integralParams:{
        ids:[],
        integral:"",
      },
      tableData: [],
      //积分交易类型
      memberLevelOptions: [
        { code: "", desc: "全部" },
        { code: "普通会员", desc: "普通会员" },
        { code: "黄金会员", desc: "黄金会员" },
        { code: "白银会员", desc: "白银会员" },
        { code: "钻石会员", desc: "钻石会员" },
      ],
    };
  },
  mounted() {
    this.search()
  },
  methods: {
    formateEmpty(row, column, cellValue, index) {
      return cellValue != null ? cellValue : "-";
    },
    //请求列表
    search() {
      let params = JSON.parse(JSON.stringify(this.formData));
      this.tipMessage = "数据加载中...";
      console.log(params)
      this.$crmList
      .getIntegralQueryList(params)
      .then(data => {
        if (data.total == 0) {
          this.tipMessage = "暂无数据";
        }
        this.tableData = data.records;
        this.total = data.total;
        // this.loading = false;
      })
      .catch(err => {
        console.log(err);
        this.tipMessage = err.message;
        // this.loading = false;
      });
    },
    // 点击全选
    toggleSelection(checked) {
      if(checked){
        this.tableData.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }else{
        this.$refs.multipleTable.clearSelection();
      }
    },
    // 全选事件监听
    handleSelectAll(checked) {
      if(checked){
        this.tableData.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }else{
        this.$refs.multipleTable.clearSelection();
      }
    },
    //提交积分
    commitIntegral(){
      let params={
        ids:[],
        integral:0,
        tenantId:this.tenantId
      }
      //组装数据
      params.ids=this.multipleSelection.map(item=>{
        return (item.memberId-0)
      })
      if(this.integralParamsType==0){
        params.integral=this.integralParams.integral-0
      }
      if(this.integralParamsType==1){
        params.integral=this.integralParams.integral*-1
      }
      console.log(this.multipleSelection);
      //验证
      if(this.multipleSelection.length == 0){
        this.$message({
          message: '请选择会员',
          type: 'warn',
          duration: 1500,
        })
        return;
      }
      if(!this.integralParams.integral.trim()){
        this.$message({
          message: '积分不能为空',
          type: 'warn',
          duration: 1500,
        })
        return;
      }
      if (/(^[1-9]\d*$)/.test(this.integralParams.integral.trim())) {

      } else {
        this.$message({
          message: '请填入正整数',
          type: 'warn',
          duration: 1500,
        })
        return;
      }
      console.log(params)
      //请求接口
      this.adjustIntegral(params)
    },
    //积分调整接口
    adjustIntegral(params){
      this.$crmList
      .adjustIntegral(params)
      .then(data => {
        this.search()
        this.checked=false
        this.integralParams.integral=""
      })
      .catch(err => {
        this.$message({
          message: err,
          type: 'warn',
          duration: 1500,
        })
      });

    },
    //选中列表
    handleSelectionChange(val){
      this.multipleSelection = val;
      console.log("选中列表数据",this.multipleSelection)
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
      this.search();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 查看积分详情
    handleIntegralDetail(scope) {
      this.$router.push({
        path: "/member/memberIntegral/history",
        query: {
          // scope: scope,
          memberId: scope.memberId,
          tenantId: this.tenantId
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
// 会员积分查询列表样式
._member-integral-query {
  .form-data-wrap {
    padding: 15px 20px 0;
    background: #f5f5f5;
    .input-width{
      width: 192px;
    }
    .word-line{
      padding:0 15px;
    }
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
  .member-level-title {
    display: flex;
    justify-content: flex-end;
    padding: 10px 0;
    .word-style{
      height: 32px;
      line-height: 32px;
      padding-left:5px;
      padding-right:20px;
    }
    .goods-types-button-custom {
      padding: 5px 20px;
      border: none;
      color: #0099ff;
      span {
        font-size: 12px;
      }
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
}
</style>
