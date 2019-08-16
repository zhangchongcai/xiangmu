<template>
  <div class="entity-card-list">
    <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap _member-search-area-custom">
      <el-form-item label="创建时间：" prop="date">
        <el-date-picker style="width:256px" v-model="formData.date" type="daterange" align="right" unlink-panels
          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="批次号：" prop="cardBatchNo">
        <el-input v-model="formData.cardBatchNo" @blur="()=>{formData.cardBatchNo = formData.cardBatchNo.trim()}"
          placeholder="请输入卡批次编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="批次名：" prop="cardBatchName">
        <el-input v-model="formData.cardBatchName" @blur="()=>{formData.cardBatchName = formData.cardBatchName.trim()}"
          placeholder="请输入卡批次名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="卡政策：" prop="cardProductId">
        <el-select v-model="formData.cardProductId" placeholder="请选择卡政策" filterable clearable>
          <el-option v-for="item in cardNameOptions" :key="item.id" :label="item.cardName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search" class="_el-btn-custom">搜索</el-button>
        <el-button @click="resetForm('formData')" plain class="_el-btn-custom _member-custom-ghost-button">重置
        </el-button>
      </el-form-item>
    </el-form>
    <div>
      <div class="head-info-wrap">
        <div class="data-title">数据更新于 {{startOpenDate}}</div>
        <div>
          <el-button @click="handleApplyCard" size="small" plain class="_el-btn-custom _member-custom-ghost-button">
            申请会员卡
          </el-button>
          <el-button @click="handleReceiveCard" size="small" plain class="_el-btn-custom _member-custom-ghost-button">
            领用礼品卡
          </el-button>
        </div>
      </div>
      <!-- <tempalte v-if="tableDataList.length>0"> -->
      <div class="entity-card-list-table _m-member-table-custom">
        <el-table :data="tableDataList" stripe style="width: 100%" :empty-text="tipMessage">
          <el-table-column type="index" width="80" label="序号" show-overflow-tooltip>
            <template slot-scope="scope">
              {{scope.$index + (current - 1) * pageSize + 1}}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="140" show-overflow-tooltip></el-table-column>
          <el-table-column prop="batchNo" label="批次号" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="batchName" label="批次名" min-width="120"></el-table-column>
          <el-table-column prop="cardProductName" label="卡政策" min-width="120" show-overflow-tooltip></el-table-column>
          <el-table-column prop="batchCount" label="申请张数" min-width="110" show-overflow-tooltip></el-table-column>
          <el-table-column prop="bindingCount" label="绑定张数" min-width="110" show-overflow-tooltip></el-table-column>
          <el-table-column fixed="right" label="操作" min-width="110">
            <template slot-scope="scope">
              <!-- <el-button @click="handleChange(scope.row)" type="text" size="small" class="change-btn">修改</el-button> -->
              <el-button @click="handleMemberDetail(scope.row.id,scope.row.status)" type="text" size="small"
                class="download-btn">下载Excel</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 start -->
      <div class="page-wrap">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="current-0" :page-sizes="[20 , 50 , 100]" :page-size="pageSize-0"
          layout="total, sizes, prev, pager, next, jumper" :total="total-0"></el-pagination>
      </div>
      <!-- 分页 end -->
      <!-- </tempalte> -->
    </div>
    <!-- 无实体卡时的空数据页面 -->
    <!-- 暂时不要这个页面 -->
    <!-- <div class="noData" v-if="tableDataList.length==0">
      <img src="../../../assets/image/iocn_noCard.png" width="109" height="80">
      <p>暂无实体卡哦！</p>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "entityCardList",
  data() {
    return {
      tipMessage: "",
      formData: {
        cardBatchName: "",
        date: [
          new Date().addMonths(-1).formatDate("yyyy-MM-dd"),
          new Date().formatDate("yyyy-MM-dd")
        ],
        cardBatchNo: "",
        cardProductId: ""
      },
      cardNameOptions: [],
      current: 1,
      pageSize: 20,
      total: 0,
      tableDataList: [],
      startOpenDate: new Date().addDays(0).formatDate("yyyy-MM-dd hh:mm:ss"),
      cardCurrent: 1,
      cardPageSize: 1000
    };
  },
  created() {
    this.getCardbatchList();
    this.getCardproductList();
    // console.log(this.$crmList.cardbatchExport);
  },
  // activated() {
  //   this.getCardbatchList();
  //   this.getCardproductList();
  // },
  methods: {
    getCardbatchList() {
      let _this = this;
      if (_this.formData.date == null) {
        _this.$message.warning("请选择查询时间");
        return false;
      }
      _this.tipMessage = "数据加载中...";
      let param = {
        current: _this.current,
        size: _this.pageSize,
        tenantId: _this.$store.state.loginUser.consumerId,
        cardBatchName: _this.formData.cardBatchName,
        // createTime: _this.formData.date,
        startTime: _this.formData.date[0],
        endTime: _this.formData.date[1],
        cardBatchNo: _this.formData.cardBatchNo,
        cardProductId: _this.formData.cardProductId
      };
      _this.$crmList
        .cardbatchList(param)
        .then(ret => {
          if (ret.total == 0 || ret.data == null) {
            _this.tipMessage = "暂无数据";
          }
          _this.tableDataList = ret.records;
          // console.log(_this.tableDataList);
          _this.current = ret.current; //
          _this.pageSize = ret.size; // 每页数量
          _this.total = ret.total;
        })
        .catch(err => {
          console.log(err);
          if (err && err.msg) {
            this.tipMessage = err.msg;
          } else {
            this.tipMessage = "系统繁忙，请稍后重试！";
          }
        });
    },
    getCardproductList() {
      let _this = this;
      let param = {
        current: _this.cardCurrent,
        size: _this.cardPageSize,
        tenantId: this.$store.state.loginUser.consumerId,
        status: "start"
      };
      _this.$crmList.cardproductList(param).then(ret => {
        _this.cardNameOptions = ret.records;
      });
    },
    search() {
      this.current = 1;
      this.getCardbatchList();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //   申请会员卡
    handleApplyCard() {
      this.$router.push({
        path: "/member/membershipCard/addEntityCard"
      });
    },
    // 领用会员卡
    handleReceiveCard() {
      this.$router.push({
        path: "/member/membershipCard/receiveEntityCard"
      });
    },
    handleSizeChange(val) {
      let _this = this;
      _this.pageSize = val;
      _this.getCardbatchList();
    },
    handleCurrentChange(val) {
      let _this = this;
      _this.current = val;
      _this.getCardbatchList();
      // _this.current = 1;
    },
    // 修改

    // handleChange(scope) {
    //   console.log("scope=", scope);
    //   this.$router.push({ path: "/membershipCard/addEntityCard" });
    // },
    // 下载Excel
    handleMemberDetail(cardBatchId, status) {
      let _this = this;
      let param = {
        cardBatchId: cardBatchId,
        tenantId: this.$store.state.loginUser.consumerId
      };
      if (status == "success") {
        let url =
          this.$store.state.crm.domain +
          "/cardbatch/export?cardBatchId=" +
          cardBatchId +
          "&tenantId=" +
          this.$store.state.loginUser.consumerId +
          "&token=" +
          this.$store.state.loginToken;
        window.open(url, "_blank");
      } else {
        // checkStatus
        _this.$crmList.checkStatus(param).then(ret => {
          // console.log(ret);
          if ((ret.msg = "ok")) {
            let url =
              this.$store.state.crm.domain +
              "/cardbatch/export?cardBatchId=" +
              cardBatchId +
              "&tenantId=" +
              this.$store.state.loginUser.consumerId +
              "&token=" +
              this.$store.state.loginToken;
            window.open(url, "_blank");
          }
          this.getCardbatchList();
          // _this.getCardbatchList();
        });
      }
      // checkStatus
      // let param = {
      //   cardBatchId: cardBatchId,
      //   tenantId: 1
      // };
      // _this.$crmList.cardbatchExport(param).then(ret => {
      //   _this.getCardbatchList();
      // });
    }
  }
};
</script>

<style lang='scss' >
.entity-card-list {
  // padding: 20px;
  .form-data-wrap {
    padding: 20px 20px 0;
    background: #f5f5f5;
    margin-bottom: 10px;
    .el-form-item {
      margin-right: 30px;
      .el-input__inner {
        width: 192px;
      }
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
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 170px;
      color: #717171;
      font-size: 12px;
    }

    .el-input--suffix .el-input__inner {
      // width: 125px;
      color: #717171;
      font-size: 12px;
      padding-right: 0;
    }
  }
  .head-info-wrap {
    display: flex;
    justify-content: space-between;
    height: 40px;
    line-height: 2;
    .data-title {
      font-size: 12px;
      color: #b1b1b1;
      padding: 8px 0;
    }
    // .apply-card-btn {
    //   padding: 0 15px;
    //   height: 30px;
    // }
  }
  .entity-card-list-table {
    .download-btn span,
    .change-btn span {
      font-size: 12px;
    }
  }
  .noData {
    margin: 15% auto;
    // margin: 230px auto;
    text-align: center;
    font-family: MicrosoftYaHei;
    font-size: 16px;
    color: #bcbcbc;
    letter-spacing: 0.19px;
    p {
      margin-top: 30px;
    }
  }
}
</style>