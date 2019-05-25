<template>
  <div class="memDetail">
    <!-- 面包屑 -->
    <div class="crumbs-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>会员</el-breadcrumb-item>
        <el-breadcrumb-item>会员</el-breadcrumb-item>
        <el-breadcrumb-item>
          <router-link :to="{path:'/member/list'}" style="font-weight: normal;color: #606266">会员信息管理</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span style="color: rgb(59, 116, 255)">会员信息</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <!-- 会员基本信息 -->
    <div class="member-basic-info">
      <div class="member-avatar">
        <img src="../../../assets/image/member.png" class="avatar-img" alt="avatar">
        <div class="member-desc">
          <div class="img-member-ID">用户ID：<br>{{information.id}}</div>
          <div class="img-member-name">{{information.name}}</div>
        </div>
      </div>
      <div class="member-desc-wrap">
        <div class="member-basic-desc" style="width:520px">
          <div class="member-name">{{information.name}}</div>
          <div class="member-gender">
            <label class="lable">性别：</label>
            {{information.sex}}
          </div>
          <div class="member-birthday">
            <label class="lable">生日：</label>
            {{information.birthday}}
          </div>
          <div class="member-phone">
            <label class="lable">手机号：</label>
            {{information.mobileNum | numberFn}}
          </div>
          <div class="id-card">
            <label class="lable">身份证：</label>
            {{information.creditNum}}
          </div>
          <div class="regist-channel">
            <label class="lable">注册渠道：</label>
            {{!information.channelName?"暂无信息":information.channelName}}
          </div>
          <div class="opening-time">
            <label class="lable">注册时间：</label>
            {{information.openDate | timeFn}}
          </div>
        </div>
        <div class="member-account-desc">
          <div class="stored-money">储值金额：
            <div class="stored-total">
              ￥{{information.totalBalance}} &nbsp;
              <span class="stored-detail">(实收￥{{information.basicBalance}}，奖励￥{{information.donateBalance}})</span>
            </div>
          </div>
          <div class="cumulative-money">累计充值金额：
            <div class="cumulative-total">￥{{information.totalChargeAmount}}</div>
          </div>
        </div>
      </div>
    </div>

    <el-collapse v-model="activeNames" @change="handleChange" class="holding-card-info">
      <!-- 未使用优惠券 -->
      <el-collapse-item title="未使用优惠券" name="0">
        <div class="_m-member-table-custom">
          <el-table :data="information.couponList" stripe style="width: 100%">
            <template slot="empty">{{unusedCouponsTip}}</template>
            <!-- <template slot="empty">该会员没有未使用的优惠券</template> -->
            <el-table-column prop="couponName" label="券名称" min-width="250" show-overflow-tooltip></el-table-column>
            <el-table-column prop="couponNo" label="券码" min-width="250" show-overflow-tooltip></el-table-column>
            <el-table-column prop="startTime" label="获得时间" min-width="250" show-overflow-tooltip></el-table-column>
            <el-table-column prop="endTime" label="过期时间" min-width="250" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
      <!-- 持有卡信息 -->
      <el-collapse-item title="持有卡信息" name="1">
        <el-row style="width:100%;padding-left: 20px;">
          <div v-if="information.cardList=='' || information.cardList==null" style="text-align: center;">暂无持有卡信息</div>
          <el-col class="card-item-wrap" style="margin-bottom:20px" v-for="(item,index) in information.cardList?information.cardList:[]"
            :key="index">
            <el-card shadow="hover" class="card-item">
              <div class="card-name-wrap">
                <div class="card-basic-info-wrap">
                  <div class="card-name">{{item.cardProductName}}</div>
                  <div class="card-number">{{item.cardNo}}</div>
                </div>
                <div class="card-type">{{item.cardTypeName}}</div>
              </div>
              <div class="total-money-wrap">
                <div class="RMB">￥</div>
                <div class="sum-money">{{item.totalBalance}}</div>
                <div class="unit">元</div>
              </div>
              <div class="term-of-validity" v-if="item.cardTypeCode != 'stored_card'">{{item.startTime | timeFn}} - {{item.endTime | timeFn}}</div>
              <div v-else style="height:21px;"></div>
              <div class="status-wrap">
                <div class="status-detail">状态：{{item.statusName}}</div>
                <div class="detail-btn" @click="handleMembershipCardDetail(item.cardNo)">查看详情</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>
      <!-- 历史账单明细 -->
      <el-collapse-item title="历史账单明细" name="2">
        <el-radio-group v-model="tabPosition" class="radio-btn-wrap" @change="changeTab">
          <el-radio-button label="CONSUME">消费</el-radio-button>
          <el-radio-button label="CHARGE">储值</el-radio-button>
          <!-- <el-radio-button label="COUPON">优惠券</el-radio-button> -->
        </el-radio-group>
        <div class="historical-bill-table _m-member-table-custom">
          <el-table :data="consumptionList" stripe style="width: 100%" v-if="type=='CONSUME'">
            <template slot="empty">{{tipMessage}}</template>
            <!-- <template slot="empty">该会员没有消费记录</template> -->
            <el-table-column prop="businessName" label="交易类型" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="transactionTime" label="时间" min-width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="outOrderNo" label="订单号" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="flowNo" label="流水号" min-width="150" show-overflow-tooltip></el-table-column>
            <el-table-column prop="cinemaName" label="门店" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="amount" label="消费总金额(元)" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="basicAmount" label="实收金额(元)" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="channelName" label="交易渠道" min-width="120" show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- 储值 -->
          <el-table :data="consumptionList" stripe style="width: 100%" v-if="type=='CHARGE'">
            <template slot="empty">{{tipMessage}}</template>
            <!-- <template slot="empty">该会员没有储值记录</template> -->
            <el-table-column prop="businessName" label="交易类型" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="transactionTime" label="时间" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="flowNo" label="流水号" min-width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="cinemaName" label="门店" min-width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="basicAmount" label="充值金额(元)" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="giveAmount" label="奖励金额(元)" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="channelName" label="交易渠道" min-width="120" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column
              prop="modifyBy"
              label="操作人"
              min-width="120"
              show-overflow-tooltip
            ></el-table-column> -->
          </el-table>
          <!-- 优惠券 -->
          <!-- <el-table :data="consumptionList" stripe style="width: 100%" v-if="type=='COUPON'">
            <template slot="empty">{{tipMessage}}</template>
            <el-table-column prop="businessName" label="交易类型" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="transactionTime" label="时间" min-width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="flowNo" label="流水号" min-width="140" show-overflow-tooltip></el-table-column>
            <el-table-column prop="cinemaName" label="门店" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="couponName" label="券名称" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="couponApplicableCommodity" label="适用商品" min-width="110" show-overflow-tooltip></el-table-column>
            <el-table-column prop="couponAmount" label="券面值" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="couponNo" label="券码" min-width="100" show-overflow-tooltip></el-table-column>
            <el-table-column prop="couponSource" label="券来源" min-width="100" show-overflow-tooltip></el-table-column>
          </el-table> -->
        </div>
        <!-- 分页 start -->
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current-0"
            :page-size="size-0" layout="prev, pager, next, jumper, sizes" :page-sizes="[20 , 50 , 100]" :total="total-0"></el-pagination>
        </div>
        <!-- 分页 end -->
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  name: "ManageDetail",
  data() {
    return {
      tabPosition: "CONSUME",
      scope: JSON.stringify(this.$route.query.scope), //解析路径json
      id: this.$route.query.id,
      tenantId:  this.$store.state.loginUser.consumerId,
      current: 1,
      size: 20,
      total: 1000,
      activeNames: ["0", "1", "2"],
      currentPage: 1,
      tableData3: [],
      information: {},
      type: "CONSUME", // CONSUME消费 CHARGE充值
      consumptionList: [],
      tipMessage: "",
      unusedCouponsTip: ""
    };
  },
  filters: {
    timeFn: function(val) {
      if (val) {
        return new Date(val.replace(/-/g, "/")).formatDate("yyyy-MM-dd");
      }
    },
    numberFn: function(val) {
      if (val) {
        return val.replace(/(\d{3})(\d{4})/, "$1 $2 ");
      }
    }
  },
  created() {
    this.loadingData();
    this.change("CONSUME");
  },
  methods: {
    loadingData() {
      //数据加载
      let _this = this,
        params = {
          id: this.id,
          tenantId:  this.$store.state.loginUser.consumerId
        };
        _this.unusedCouponsTip = "数据加载中...";
      _this.$crmList.memberBasicDetail(params).then(ret => {
        // console.log(ret)
        if (!ret) {
          this.$message.warning("暂无数据！");
        }
        if(ret.couponList.length == 0){
          _this.unusedCouponsTip = "该会员没有未使用的优惠券"
        }
        {
          _this.information = ret;
        }
      }).catch(err => {
        _this.unusedCouponsTip = err.message;
      });
    },

    change(val) {
      //1 储值； 2 消费 菜单切换
      let _this = this;
      // _this.type=val;
      let params = {
        businessType: this.type,
        cardNo: "",
        memberId: this.id,
        current: _this.current,
        startTime: _this.$route.query.startOpenDate,
        endTime: _this.$route.query.endOpenDate,
        tenantId:  this.$store.state.loginUser.consumerId,
        size: _this.size
      };
      _this.tipMessage = "数据加载中...";
      _this.$crmList
        .memberDetailConsumption(params)
        .then(ret => {
          if (ret.total == 0 && _this.type == "CONSUME") {
            _this.tipMessage = "该会员没有消费记录";
          } else if (ret.total == 0 && _this.type == "CHARGE") {
            _this.tipMessage = "该会员没有储值记录";
          } else if (ret.total == 0 && _this.type == "COUPON") {
            _this.tipMessage = "该会员没有优惠券记录";
          }
          _this.consumptionList = ret.records;
          _this.size = ret.size;
          _this.total = ret.total;
          // console.log(ret.total)
        })
        .catch(err => {
          _this.tipMessage = err.message;
          _this.consumptionList = [];
          // if(err.message == "Network Error"){
          //   _this.$message.error("网络错误，请重试");
          //   _this.consumptionList = []
          // }
          console.log(err);
        });
    },
    changeTab(val) {
      this.current = 1;
      this.type = val;
      this.change(this.type);
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.size = val;
      this.change(this.type);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.current = val;
      this.change(this.type);
    },
    handleChange(val) {
      // console.log(val);
    },
    // 查看卡详情
    handleMembershipCardDetail(id) {
      this.$router.push({
        path: "/member/membershipCard/detail",
        query: {
          cardNo: id,
          tenantId:  this.$store.state.loginUser.consumerId
        }
      });
    }
  }
};
</script>
<style lang="scss">
.memDetail {
  // padding: 20px;
  padding-right: 0;
  .crumbs-wrap {
    padding: 0 0 20px 0;
  }
  .member-basic-info {
    display: flex;
    padding-left: 20px;
    .member-avatar {
      width: 186px;
      height: 186px;
      position: relative;
      .avatar-img {
        width: 100%;
        height: 100%;
      }
      .member-desc {
        width: 186px;
        background: rgba(0, 0, 0, 0.5);
        position: absolute;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        padding: 4px 10px;
        box-sizing: border-box;
        .img-member-ID {
          font-size: 12px;
          color: #ffffff;
          width: 170px;
          word-break: break-all;
          word-wrap: break-word;
        }
        .img-member-name {
          font-size: 12px;
          color: #ffffff;
          position: absolute;
          right: 10px;
        }
      }
    }
    .member-desc-wrap {
      display: flex;
      margin-left: 37px;
      flex-grow: 1;
      .member-basic-desc {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 50%;
        font-family: MicrosoftYaHei;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        .lable {
          width: 60px;
          display: inline-block;
          font-size: 12px;
        }
        .member-name {
          font-size: 14px;
          font-weight: bold;
          // margin-top: -7px;
        }
      }
      .member-basic-desc div:not(.member-name) {
        font-size: 12px;
      }
      .member-account-desc {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        // margin-left: 40px;
        padding: 30px 0;
        .stored-money {
          font-size: 12px;
          color: #666666;
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
        .cumulative-money {
          font-size: 12px;
          color: #666666;
          .cumulative-total {
            font-size: 21px;
            color: #333333;
            margin-top: 15px;
          }
        }
      }
    }
  }
  .holding-card-info {
    margin-top: 20px;
    border: 0;
    // 卡样式
    .card-item-wrap {
      // min-width: 320px;
      // width: 29%;
      // margin: 0 2%;
      width: 326px;
      height: 166px;
      margin-right: 20px;
      .card-item {
        border: 0;
        border-radius: 8px;
        background: linear-gradient(-180deg, #ffcd6c 3%, #ffbc39 97%);
        .el-card__body {
          padding: 0;
        }
        .card-name-wrap {
          display: flex;
          justify-content: space-between;
          padding: 15px 20px 0;
          .card-basic-info-wrap {
            // display: flex;
            .card-name {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              max-width: 132px;
              height: 22px;
              background: #ffffff;
              box-shadow: 0 1px 2px 0 #ffbc39;
              font-size: 12px;
              color: #ffa900;
              border-radius: 10px;
              line-height: 22px;
              padding: 0 5px 0 10px;
              // padding: 0 10px;
              display: inline-block;
              margin-bottom: 4px;
            }
            .card-number {
              font-size: 14px;
              color: #ffffff;
              display: block;
              margin-top: -4px;
            }
          }
          .card-type {
            font-size: 14px;
            color: #ffffff;
            text-shadow: 0 1px 2px #ffb119;
          }
        }
        .total-money-wrap {
          display: flex;
          justify-content: center;
          align-items: baseline;
          margin: -28px 0 -15px 0;
          .RMB {
            font-size: 24px;
            color: #ffffff;
            text-shadow: 0 2px 4px #fdba1e;
          }
          .sum-money {
            font-size: 48px;
            color: #ffffff;
            text-shadow: 0 2px 4px #fcb11d;
            font-family: Arial-BoldMT;
            font-size: 48px;
            color: #ffffff;
            letter-spacing: 0;
            text-shadow: 0 2px 4px #fcb11d;
          }
          .unit {
            font-size: 12px;
            color: #ffffff;
          }
        }
        .term-of-validity {
          font-size: 12px;
          color: #ffffff;
          text-align: right;
          padding: 0 20px;
        }
        .status-wrap {
          display: flex;
          justify-content: space-between;
          border-top: 1px solid #fcb429;
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
        }
      }
    }
    // 历史交易账单表格
    .radio-btn-wrap {
      margin: 0 0 15px 20px;
      .is-active {
        span {
          color: #fff !important;
        }
      }
      .el-radio-button:first-child .el-radio-button__inner{
            border-right: none;
      }
      .el-radio-button:last-child .el-radio-button__inner{
            border-left: none;
      }
      .el-radio-button__inner {
        width: 80px;
        height: 32px;
        line-height: 32px;
        padding: 0;
            border: 1px solid #3b74ff;
        color: #3b74ff;
      }
    }
    .historical-bill-table {
      padding: 0 15px 0 20px;
    }
  }
}
</style>

