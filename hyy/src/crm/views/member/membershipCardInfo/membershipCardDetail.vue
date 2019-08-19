<template>
  <div class="member-detail">
    <!-- 会员基本信息 -->
    <div class="member-basic-info">
      <el-card shadow="hover" class="card-item">
        <div class="card-name-wrap">
          <div class="card-basic-info-wrap">
            <div class="card-name">{{cardDetail.cardProductName}}</div>
            <div class="card-number">{{cardDetail.cardNo}}</div>
          </div>
          <div class="card-type">{{cardDetail.cardType}}</div>
        </div>
        <div class="total-money-wrap">
          <div class="RMB">￥</div>
          <div class="sum-money">{{cardDetail.totalBalance}}</div>
          <div class="unit">元</div>
        </div>
        <!-- <div class="term-of-validity">2018.01-2019.23</div> -->
        <div class="term-of-validity" v-if="cardDetail.cardTypeCode != 'stored_card'">
          {{cardDetail.startTime}}-{{cardDetail.endTime}}</div>
        <div v-else style="height:22px;"></div>
        <div class="status-wrap">
          <div class="status-detail" v-if="cardDetail.status == 'normal'">状态：正常</div>
          <div class="status-detail" v-if="cardDetail.status == 'expire'">状态：过期</div>
          <div class="status-detail" v-if="cardDetail.status == 'frozen'">状态：冻结</div>
          <div class="status-detail" v-if="cardDetail.status == 'cancel'">状态：注销</div>
          <div class="detail-btn" @click="handleMembershipCardDetail">查看卡政策</div>
          <div class="change-status-btn" @click="handleChangeStatus(cardDetail.cardNo,'frozen')"
            v-if="cardDetail.status == 'normal'">冻结</div>
          <div class="change-status-btn" @click="handleChangeStatus(cardDetail.cardNo,'normal')"
            v-if="cardDetail.status == 'frozen'">解冻</div>
        </div>
      </el-card>
      <div class="member-desc-wrap">
        <div class="member-basic-desc-left">
          <div class="member-name itemInfo">
            <label class="lable">会员姓名：</label>
            {{cardDetail.userName | emptyShow}}
          </div>
          <div class="member-gender itemInfo">
            <label class="lable">性别：</label>
            {{cardDetail.gender | formatGender}}
          </div>
          <div class="member-birthday itemInfo">
            <label class="lable">生日：</label>
            {{cardDetail.birthday | emptyShow}}
          </div>
          <div class="member-phone itemInfo">
            <label class="lable">手机号：</label>
            {{cardDetail.phoneNumber | emptyShow}}
          </div>
          <div class="id-card itemInfo">
            <label class="lable">身份证：</label>
            {{cardDetail.creditNum | emptyShow}}
          </div>
        </div>
        <div class="member-basic-desc-right">
          <div class="opening-time itemInfo">
            <label class="lable">开卡时间：</label>
            {{cardDetail.createTime | emptyShow}}
          </div>
          <div class="regist-channel itemInfo">
            <label class="lable">注册渠道：</label>
            {{cardDetail.cinemaName | emptyShow}}
          </div>
          <div class="member-email itemInfo">
            <label class="lable">邮箱：</label>
            {{cardDetail.email | emptyShow}}
          </div>
          <div class="member-email itemInfo" v-if="cardDetail.cardTypeCode == 'stored_card'">
            <label class="lable">储值金额：</label>
            <div class="stored-total">
              ￥{{cardDetail.totalBalance | emptyShow}} &nbsp;
              <span class="stored-detail">(实收￥{{cardDetail.basicBalance | emptyShow}}，奖励￥{{cardDetail.giveBalance |
                emptyShow}})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 交易记录 -->
    <el-collapse v-model="activeNames" @change="handleChange" class="transaction-record">
      <el-collapse-item title="交易记录" name="1">
        <el-form :inline="true" :model="formData" ref="formData" class="form-data-wrap _member-search-area-custom">
          <el-form-item label="查询时间：" prop="date">
            <el-date-picker style="width:256px" v-model="formData.date" type="daterange" align="right" unlink-panels
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="交易类型：" prop="source">
            <el-select v-model="formData.source" placeholder="全部类型" clearable style="width:192px">
              <el-option v-for="item in sourceOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search" class="_el-btn-custom">搜索</el-button>
            <el-button @click="resetForm('formData')" class="_el-btn-custom _member-custom-ghost-button">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- </div> -->
        <div class="_m-member-table-custom">
          <el-table :data="tableDataList" stripe style="width: 100%" v-loading="listLoading"
            element-loading-text="拼命加载中...">
            <el-table-column prop="businessName" label="交易类型" min-width="100" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="transactionTime" label="时间" min-width="120" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="outOrderNo" label="订单号" min-width="140" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="flowNo" label="流水号" min-width="140" :formatter="formateEmpty" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="cinemaName" label="门店" min-width="100" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="amount" label="交易金额" min-width="100" :formatter="formateEmpty" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="totalBalance" label="余额" min-width="100" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="channelName" label="交易渠道" min-width="100" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <!-- 分页 start -->
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="current-0" :page-sizes="[20 , 50 , 100]" :page-size="pageSize-0"
            layout="total, sizes, prev, pager, next, jumper" :total="total-0"></el-pagination>
        </div>
        <!-- 分页 end -->
      </el-collapse-item>
    </el-collapse>
    <div class="detail-btn-wrap">
      <el-button class="_el-btn-custom" @click="handleBack">关闭</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ManageDetail",
  data() {
    return {
      listLoading: false,
      cardDetail: [],
      current: 1,
      pageSize: 20,
      total: "",
      activeNames: ["1"],

      tableDataList: [],
      sourceOptions: [
        {
          label: "消费",
          value: "CONSUME"
        },
        {
          label: "充值",
          value: "CHARGE"
        },
        {
          label: "冲销",
          value: "CHARGEOFF"
        },
        {
          label: "退款",
          value: "REFUND"
        }
      ],

      formData: {
        date: [
          new Date().addMonths(-1).formatDate("yyyy-MM-dd"),
          new Date().formatDate("yyyy-MM-dd")
        ],
        source: "" // 会员来源
      }
    };
  },
  created() {
    this.getMemberCardDetail();
    this.getCardflowList();
  },
  filters: {
    formatGender(value) {
      if (value == "male") {
        return "男";
      } else if (value == "female") {
        return "女";
      } else {
        return "-";
      }
    },
    emptyShow: function(value) {
      if (value || value == 0) {
        return value;
      } else {
        return "-";
      }
    }
  },
  methods: {
    // 关闭
    handleBack() {
      this.$store.commit("tagNav/removeTagNav", this.$route);
      if (this.$route.query.pathOrigin == "detail") {
        this.$router.push({
          path: "/member/member/detail",
          query: {
            levelNo: this.$route.query.levelNo,
            id: this.$route.query.id,
            startOpenDate: this.$route.query.startOpenDate,
            endOpenDate: this.$route.query.endOpenDate
          }
        });
      } else {
        this.$router.push({ path: "/member/membershipCard/list" });
      }
    },
    formateEmpty(row, column, cellValue, index) {
      if (cellValue == null || cellValue == "") {
        return "-";
      } else {
        return cellValue;
      }
    },
    getMemberCardDetail() {
      let _this = this;
      let param = {
        cardNo: _this.$route.query.cardNo,
        tenantId: this.$store.state.loginUser.consumerId
      };
      _this.$crmList.memberCardDetail(param).then(ret => {
        _this.cardDetail = ret;
      });
    },
    getCardflowList() {
      let _this = this;
      if (_this.formData.date == null) {
        _this.$message.warning("请选择查询时间");
        return false;
      }
      let param = {
        current: _this.current,
        size: _this.pageSize,
        startTime: _this.formData.date[0],
        endTime: _this.formData.date[1],
        cardNo: _this.$route.query.cardNo,
        tenantId: this.$store.state.loginUser.consumerId,
        businessType: _this.formData.source,
        memberId: ""
      };
      // _this.listLoading = true;
      _this.$crmList.cardflowList(param).then(ret => {
        _this.tableDataList = ret.records;
        // _this.listLoading = false;
        _this.current = ret.current; // 页码
        _this.pageSize = ret.size; // 每页数量
        _this.total = ret.total;
      });
    },
    search() {
      this.current = 1;
      this.getCardflowList();
    },
    // 重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    handleSizeChange(val) {
      let _this = this;
      _this.current = 1;
      _this.pageSize = val;
      _this.getCardflowList();
    },
    handleCurrentChange(val) {
      let _this = this;
      _this.current = val;
      _this.getCardflowList();
    },
    handleChange(val) {
      console.log(val);
    },
    // 查看卡详情
    handleMembershipCardDetail() {
      this.$router.push({
        path: "/member/cardTypeManagement/detail",
        query: {
          cardProductId: this.cardDetail.cardProductId,
          cardNo: this.$route.query.cardNo,
          pathOrigin: "detail"
        }
      });
    },
    // 修改状态
    handleChangeStatus(cardNo, status) {
      let _this = this;
      let msg =
        status == "frozen"
          ? "冻结后此卡将无法正常使用，确定冻结吗？"
          : "确定解冻此卡？";
      _this
        .$confirm(msg, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let param = {
            cardNo: cardNo,
            status: status,
            tenantId: this.$store.state.loginUser.consumerId
          };
          _this.$crmList.rcardStatus(param).then(ret => {
            _this.getMemberCardDetail();
          });
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss">
.member-detail {
  // padding: 20px;
  .member-basic-info {
    width: 100%;
    .member-desc-wrap {
      // display: flex;
      vertical-align: top;
      margin-left: 50px;
      flex-grow: 1;
      display: inline-block;
      font-size: 24px;
      .lable {
        width: 64px;
        font-size: 12px;
        color: #666666;
        display: inline-block;
      }
      .member-basic-desc-left {
        display: inline-block;
        vertical-align: top;
        margin-right: 150px;
        .itemInfo {
          margin: 10px;
          color: #666666;
          font-size: 12px;
        }
      }
      .member-basic-desc-right {
        display: inline-block;
        .itemInfo {
          margin: 10px;
          color: #666666;
          font-size: 12px;
          .stored-total {
            display: flex;
            align-items: center;
            font-size: 21px;
            color: #333333;
            margin-top: 15px;
            .stored-detail {
              font-size: 12px;
              color: #666;
            }
          }
        }
      }
    }
    // 卡样式
    .card-item {
      display: inline-block;
      width: 352px;
      margin-left: 10px;
      border: 0;
      border-radius: 8px;
      background: linear-gradient(-180deg, #ffcd6c 3%, #ffbc39 97%);
      div.el-card__body {
        padding: 0;
      }
      .card-name-wrap {
        display: flex;
        justify-content: space-between;
        padding: 15px 20px 0;
        .card-basic-info-wrap {
          // display: flex;
          // line-height: 20px;
          .card-name {
            // display: inline-block;
            background: #ffffff;
            box-shadow: 0 1px 2px 0 #ffbc39;
            color: #ffa900;
            padding: 0 15px;
            border-radius: 30px;
            margin-right: 50px;
            height: 20px;
            line-height: 20px;
            font-size: 12px;
            text-align: center;
            max-width: 150px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-bottom: 6px;
          }
          .card-number {
            // display: inline-block;
            // vertical-align: top;
            font-size: 12px;
            color: #ffffff;
          }
        }
        .card-type {
          font-size: 12px;
          color: #ffffff;
          white-space: nowrap;
          text-shadow: 0 1px 2px #ffb119;
        }
      }
      .total-money-wrap {
        display: flex;
        justify-content: center;
        align-items: baseline;
        // margin: -15px 0 0;
        .RMB {
          font-size: 24px;
          color: #ffffff;
          letter-spacing: 0;
          line-height: 24px;
          text-shadow: 0 2px 4px #fdba1e;
        }
        .sum-money {
          color: #ffffff;
          line-height: 50px;
          font-size: 48px;
          letter-spacing: 0;
          text-shadow: 0 2px 4px #fcb11d;
          font-weight: bold;
        }
        .unit {
          font-size: 12px;
          line-height: 12px;
          color: #ffffff;
        }
      }
      .term-of-validity {
        font-size: 12px;
        color: #ffffff;
        text-align: right;
        padding: 4px 15px;
      }
      .status-wrap {
        display: flex;
        justify-content: space-between;
        border-top: 2px solid #fcb429;
        padding: 8px 20px;
        .status-detail {
          font-size: 12px;
          color: #ffffff;
        }
        .detail-btn {
          font-size: 12px;
          color: #ffffff;
          cursor: pointer;
        }
        .change-status-btn {
          font-size: 12px;
          color: #ffffff;
          cursor: pointer;
        }
      }
    }
  }
  .transaction-record {
    margin-top: 15px;
    border: 0;
    .form-data-wrap {
      display: flex;
      justify-content: space-between;
      padding: 20px 20px 0;
      margin-bottom: 15px;
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
        color: #717171;
        font-size: 12px;
        padding-right: 0;
      }
    }
  }
  .detail-btn-wrap {
    width: 100%;
    margin: 1px 0 40px;
    text-align: center;
  }
}
</style>