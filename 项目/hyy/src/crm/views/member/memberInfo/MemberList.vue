<template>
  <div class="member-list">
    <!-- 面包屑 -->
    <div class="crumbs-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>会员</el-breadcrumb-item>
        <el-breadcrumb-item>会员</el-breadcrumb-item>
        <el-breadcrumb-item>
          <span style="color: rgb(59, 116, 255)">会员信息管理</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap">
      <el-form-item label="开卡时间：" prop="date">
        <el-date-picker v-model="formData.date" type="daterange" align="right" unlink-panels range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions"></el-date-picker>
      </el-form-item>
      <el-form-item label="会员ID/手机号：" prop="memberIdOrPhone">
        <el-input v-model="formData.memberIdOrPhone" @blur="()=>{formData.memberIdOrPhone = formData.memberIdOrPhone.trim()}"
          placeholder="会员ID/手机号" clearable></el-input>
      </el-form-item>
      <el-form-item label="会员等级：" prop="status">
        <el-select v-model="formData.status" placeholder="全部等级" clearable disabled>
          <el-option v-for="item in rankOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="来源：" prop="source">
        <el-select v-model="formData.source" placeholder="全部来源" clearable @change="channelList">
          <el-option v-for="item in sourceOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchMember" class="el-btn-custom">搜索</el-button>
        <el-button @click="resetForm('formData')" class="btnRepeat el-btn-custom">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- <div class="result-title" v-if="!formData.total">暂无数据</div> -->
    <div class="result-title" v-if="formData.total">为您查询到{{formData.total}}个会员信息</div>
    <div class="_m-member-table-custom">
      <el-table :data="records" stripe style="width: 100%" :empty-text="tipMessage">
        <el-table-column prop="id" label="会员ID" min-width="140" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="name" label="姓名" min-width="120" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="mobileNum" label="手机号" min-width="120" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sex" label="性别" min-width="80" :formatter="formateEmpty"></el-table-column>
        <el-table-column prop="birthday" label="生日" min-width="100" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="levelId" label="会员等级" min-width="100" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="openDate" label="注册时间" min-width="100" :formatter="formateEmpty" show-overflow-tooltip></el-table-column>
        <el-table-column prop="channelName" label="全部来源" min-width="100" :formatter="formateEmpty"
          show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" min-width="100">
          <span slot-scope="scope" @click="handleMemberDetail(scope.row)" style="color:#3B74FF;cursor: pointer;fontSize:12px;">详情</span>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 start -->
    <div class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage-0"
        :page-size="formData.size - 0" layout="prev, pager, next, jumper, sizes" :page-sizes="[20, 50, 100]" :total="formData.total-0"></el-pagination>
    </div>
    <!-- 分页 end -->
  </div>
</template>

<script>
export default {
  name: "MemberList",
  data() {
    return {
      tipMessage: "暂无数据",
      tenantId:  this.$store.state.loginUser.consumerId,
      currentPage: 1,
      records: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      rankOptions: [
        {
          label: "普通会员",
          value: 0
        },
        {
          label: "积分会员",
          value: 1
        }
      ],
      sourceOptions: [
        {
          label: "商务总部",
          value: 0
        },
        {
          label: "实体分部",
          value: 1
        }
      ],
      formData: {
        date: [new Date().addMonths(-1), new Date()],
        startOpenDate: new Date().addDays(-30).formatDate("yyyy-MM-dd"),
        endOpenDate: new Date().addDays(-1).formatDate("yyyy-MM-dd"),
        status: "", // 会员等级
        source: "", // 会员来源
        memberIdOrPhone: "", //会员id或手机号
        size: 20, //分页大小
        total: 0 //总条数
      }
    };
  },
  created() {
    this.channelList();
    this.search();
  },
  methods: {
    channelList() {
      //会员来源
      let _this = this;
      _this.$crmList.channelList({ tenantId: _this.tenantId }).then(ret => {
        _this.sourceOptions = ret;
        console.log(ret);
      });
    },
    search() {
      if (this.formData.date == null) {
        this.$message.warning("请输入开卡时间");
        return false;
      }
      let _this = this,
        params = {
          tenantId: _this.tenantId,
          channelId: _this.formData.source,
          current: _this.currentPage,
          size: _this.formData.size,
          startOpenDate: this.formData.date[0].formatDate("yyyy-MM-dd"),
          endOpenDate: this.formData.date[1].formatDate("yyyy-MM-dd"),
          levelId: _this.formData.status,
          memberIdOrMobileNum: _this.formData.memberIdOrPhone
        };
      _this.tipMessage = "数据加载中...";
      _this.$crmList
        .memberListPage(params)
        .then(ret => {
          if (ret.total == 0) {
            _this.tipMessage = "暂无数据";
          }
          _this.records = ret.records;
          // _this.formData.size=ret.size;
          _this.formData.total = ret.total;
          // console.log(ret.total)
        })
        .catch(err => {
          console.log("err===", err);
          _this.tipMessage = err.message;
        });
    },
    searchMember() {
      this.currentPage = 1;
      this.search();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.formData.size = val;
      this.search();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.search();
    },
    // 查看会员详情
    handleMemberDetail(scope) {
      // console.log("scope=", scope);
      this.$router.push({
        path: "/member/member/detail",
        query: {
          scope: scope,
          id: scope.id,
          startOpenDate: this.formData.date[0].formatDate("yyyy-MM-dd"),
          endOpenDate: this.formData.date[1].formatDate("yyyy-MM-dd"),
          tenantId: this.tenantId
        }
      });
    },
    formateEmpty(row, column, cellValue, index) {
      return cellValue ? cellValue : "-";
    }
  }
};
</script>

<style lang='scss' >
.member-list {
  // padding: 20px;
  .crumbs-wrap {
    padding: 0 0 20px 0;
  }
  .form-data-wrap {
    padding: 20px 20px 0;
    background: #f5f5f5;
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
  .result-title {
    font-size: 12px;
    color: #b1b1b1;
    padding: 8px 0;
  }
}
</style>