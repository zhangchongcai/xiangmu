<template>
  <div class="memDetail">
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
        <div class="member-basic-desc" style="min-width:210px">
          <div class="member-name">{{information.name | emptyShow}}</div>
          <div class="member-gender">
            <label class="lable">性别：</label>
            {{information.sex | emptyShow}}
          </div>
          <div class="member-birthday">
            <label class="lable">生日：</label>
            {{information.birthday | emptyShow}}
          </div>
          <div class="member-phone">
            <label class="lable">手机号：</label>
            {{information.mobileNum | numberFn}}
          </div>
          <div class="id-card">
            <label class="lable">身份证：</label>
            {{information.creditNum | emptyShow}}
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
          <div class="_member-account-row">
            <div class="stored-money">储值金额：
              <div class="stored-total">
                ￥{{information.totalBalance | emptyShow}}
                <div class="stored-detail">（ 实收￥{{information.basicBalance | emptyShow}}，奖励￥{{information.donateBalance |
                emptyShow}} ）</div>
              </div>
            </div>
            <div class="cumulative-money">累计充值金额：
              <div class="cumulative-total">￥{{information.totalChargeAmount | emptyShow}}</div>
            </div>
          </div>
          <div class="_member-account-row _member-account-row-down">
            <div class="cumulative-money">积分余额：
              <div class="cumulative-total">{{information.scoreBalance | emptyShow}}</div>
            </div>
            <div class="cumulative-money">累计积分：
              <div class="cumulative-total">{{information.totalScore | emptyShow}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 会员标签、会员等级 -->
    <div class="_member-label-level-wrap">
      <div class="_member-item-iinner">
        <label class="lable">会员等级：</label>
        {{information.levelName | emptyShow}}
      </div>
      <div class="_member-item-iinner">
        <label class="lable">会员标签：</label>
        <div class="_no-label" v-if="information.labelVOS.length == 0 || information.labelVOS ==null">暂无标签</div>
        <div class="_label-item-wrap" v-else>
          <div class="_member-label-item" :style="`border-color:${item.labelColor}`"
            v-for="(item, index) of information.labelVOS" :key="index">
            <span :style="`color:${item.labelColor}`" class="_member-label-color">{{item.labelName}}</span>
          </div>
        </div>
      </div>

    </div>
    <el-collapse v-model="activeNames" class="holding-card-info">
      <!-- 会员权益 -->
      <el-collapse-item title="会员权益" name="0">
        <div class="_member-level-rights-wrap">
          <div class="_member-level-rights-title">{{levelData.levelName}}</div>
          <ul class="_member-level-rights-items-wrap" v-if="levelData.levelEquitys.length>0">
            <li class="_member-level-rights-item" v-for="(item,index) of levelData.levelEquitys" :key="index">
              <img :src="item.equity.logoPic" :alt="index">
              <div class="_equity-name">{{item.equity.equityName?item.equity.equityName:'-'}}</div>
            </li>
          </ul>
          <div v-else class="_no-equity-word">暂无会员等级权益</div>
        </div>
      </el-collapse-item>
      <!-- 未使用优惠券 -->
      <el-collapse-item title="未使用优惠券" name="1">
        <div class="_m-member-table-custom" style="margin-left:20px;">
          <el-table :data="information.couponList" stripe style="width: 100%">
            <template slot="empty">{{unusedCouponsTip}}</template>
            <!-- <template slot="empty">该会员没有未使用的优惠券</template> -->
            <el-table-column prop="couponName" label="券名称" min-width="250" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="couponNo" label="券码" min-width="250" :formatter="formateEmpty" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="createTime" label="获得时间" min-width="250" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="endTime" label="过期时间" min-width="250" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
      <!-- 持有卡信息 -->
      <el-collapse-item title="持有卡信息" name="2">
        <el-row style="width:100%;padding-left: 20px;">
          <div v-if="information.cardList=='' || information.cardList==null" style="text-align: center;color: #909399;">
            暂无持有卡信息</div>
          <el-col class="card-item-wrap" style="margin-bottom:20px"
            v-for="(item,index) in information.cardList?information.cardList:[]" :key="index">
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
              <div class="term-of-validity" v-if="item.cardTypeCode != 'stored_card'">
                <div class="_member-default-card" v-if="item.defaultCard == 1">默认</div>
                <div v-else></div>
                <div class="term-of-validity-date">{{item.startTime | timeFn}} -
                  {{item.endTime | timeFn}}</div>
              </div>
              <div v-else class="_default-card-btn-wrap">
                <div class="_member-default-card" v-if="item.defaultCard == 1">默认</div>
              </div>
              <div class="status-wrap">
                <div class="status-detail">状态：{{item.statusName}}</div>
                <div class="detail-btn" @click="handleMembershipCardDetail(item.cardNo)">查看详情</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>
      <!-- 历史账单明细 -->
      <el-collapse-item title="历史账单明细" name="3">
        <el-radio-group v-model="tabPosition" class="radio-btn-wrap" @change="changeTab">
          <el-radio-button label="CONSUME">消费</el-radio-button>
          <el-radio-button label="CHARGE">储值</el-radio-button>
          <el-radio-button label="INTEGRAL">积分</el-radio-button>
        </el-radio-group>
        <div class="historical-bill-table _m-member-table-custom">
          <el-table :data="consumptionList" stripe style="width: 100%" v-if="type=='CONSUME'">
            <template slot="empty">{{tipMessage}}</template>
            <!-- <template slot="empty">该会员没有消费记录</template> -->
            <el-table-column prop="businessName" label="交易类型" min-width="80" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="cardNo" label="会员卡号" min-width="110" :formatter="formateEmpty" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="transactionTime" label="时间" min-width="130" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="outOrderNo" label="订单号" min-width="240" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="flowNo" label="流水号" min-width="130" :formatter="formateEmpty" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="cinemaName" label="门店" min-width="100" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="amount" label="消费总金额(元)" min-width="110" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="basicAmount" label="实收金额(元)" min-width="95" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="channelName" label="交易渠道" min-width="95" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
          </el-table>
          <!-- 储值 -->
          <el-table :data="consumptionList" stripe style="width: 100%" v-if="type=='CHARGE'">
            <template slot="empty">{{tipMessage}}</template>
            <!-- <template slot="empty">该会员没有储值记录</template> -->
            <el-table-column prop="businessName" label="交易类型" min-width="80" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="cardNo" label="会员卡号" min-width="110" :formatter="formateEmpty" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="transactionTime" label="时间" min-width="130" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
              <el-table-column prop="outOrderNo" label="订单号" min-width="240" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="flowNo" label="流水号" min-width="130" :formatter="formateEmpty" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="cinemaName" label="门店" min-width="120" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="basicAmount" label="充值金额(元)" min-width="95" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="giveAmount" label="奖励金额(元)" min-width="95" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="channelName" label="交易渠道" min-width="95" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <!-- <el-table-column
              prop="modifyBy"
              label="操作人"
              min-width="120"
             :formatter="formateEmpty" show-overflow-tooltip
            ></el-table-column> -->
          </el-table>
          <!-- 积分 -->
          <el-table :data="consumptionList" stripe style="width: 100%" v-if="type=='INTEGRAL'">
            <template slot="empty">{{tipMessage}}</template>
            <el-table-column prop="flowNo" label="积分流水号" min-width="120" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="transactionTime" label="交易时间" min-width="140" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="integral" label="积分数量" min-width="100" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="integralType" label="积分交易类型" key="integralType" min-width="110"
              :formatter="formateEmpty" show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.integralType | formatIntegralType}}
              </template>
            </el-table-column>
            <el-table-column prop="channelName" label="交易渠道" min-width="100" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="cinemaName" label="交易影院" min-width="110" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
            <el-table-column prop="operator" label="操作人" min-width="100" :formatter="formateEmpty"
              show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
        <!-- 分页 start -->
        <div class="page-wrap">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
            :current-page="current-0" :page-size="size-0" layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[20 , 50 , 100]" :total="total-0"></el-pagination>
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
      levelData: {
        levelName: "-",
        levelEquitys: []
      },
      tabPosition: "CONSUME",
      id: this.$route.query.id,
      tenantId: this.$store.state.loginUser.consumerId,
      current: 1,
      size: 20,
      total: 1000,
      activeNames: ["0", "1", "2", "3"],
      tableData3: [],
      information: {
        labelVOS: []
      },
      type: "CONSUME", // CONSUME消费 CHARGE充值
      consumptionList: [],
      tipMessage: "",
      unusedCouponsTip: ""
    };
  },
  filters: {
    formatIntegralType(val) {
      switch (val) {
        case 0:
          return "积分获取";
          break;
        case 1:
          return "积分兑换";
          break;
        case 2:
          return "积分冲销";
          break;
        case 3:
          return "手动调整积分";
          break;
        case 4:
          return "退积分";
          break;
        default:
          return "-";
          break;
      }
    },
    emptyShow: function(value) {
      if (value == null || value == "") {
        return "-";
      } else {
        return value;
      }
    },
    timeFn: function(val) {
      if (val) {
        return new Date(val.replace(/-/g, "/")).formatDate("yyyy-MM-dd");
      } else {
        return "-";
      }
    },
    numberFn: function(val) {
      if (val) {
        return val.replace(/(\d{3})(\d{4})/, "$1 $2 ");
      } else {
        return "-";
      }
    }
  },
  created() {
    this.loadingData();
    this.change();
    this.getLevelEquity();
  },
  methods: {
    // 关闭
    handleBack() {
      this.$store.commit("tagNav/removeTagNav", this.$route);
      this.$router.push({ path: "/member/member/list" });
    },
    formateEmpty(row, column, cellValue, index) {
      if (cellValue == null || cellValue == "") {
        return "-";
      } else {
        return cellValue;
      }
    },
    // 获取等级权益
    getLevelEquity() {
      let params = {
        levelNo: this.$route.query.levelNo,
        tenantId: this.$store.state.loginUser.consumerId
      };
      this.$crmList
        .getLevelEquityByLevelCode(params)
        .then(res => {
          this.levelData = {
            levelEquitys: res.levelEquitys ? res.levelEquitys : [],
            levelName: res.levelName ? res.levelName : "-"
          };
        })
        .catch(err => {
          console.log(err);
        });
    },
    loadingData() {
      //数据加载
      let _this = this,
        params = {
          id: this.id,
          tenantId: this.$store.state.loginUser.consumerId
        };
      _this.unusedCouponsTip = "数据加载中...";
      _this.$crmList
        .memberBasicDetail(params)
        .then(ret => {
          // console.log(ret)
          if (!ret) {
            this.$message.warning("暂无数据！");
          }
          if (ret.couponList.length == 0) {
            _this.unusedCouponsTip = "该会员没有未使用的优惠券";
          }
          {
            _this.information = ret;
          }
        })
        .catch(err => {
          if (err && err.msg) {
            _this.unusedCouponsTip = err.msg;
          } else {
            _this.unusedCouponsTip = "系统繁忙，请稍后重试！";
          }
        });
    },
    //1 储值； 2 消费 菜单切换
    change() {
      let _this = this;
      let params = {
        businessType: this.type,
        cardNo: "",
        memberId: this.id,
        current: _this.current,
        startTime: _this.$route.query.startOpenDate,
        endTime: _this.$route.query.endOpenDate,
        tenantId: this.$store.state.loginUser.consumerId,
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
          }
          _this.consumptionList = ret.records;
          _this.size = ret.size;
          _this.total = ret.total;
        })
        .catch(err => {
          _this.consumptionList = [];
          if (err && err.msg) {
            _this.tipMessage = err.msg;
          } else {
            _this.tipMessage = "系统繁忙，请稍后重试！";
          }
          console.log(err);
        });
    },
    // 获取积分列表
    integralChange() {
      let _this = this;
      let data = {
        memberId: this.id,
        current: _this.current,
        size: _this.size,
        tenantId: this.$store.state.loginUser.consumerId
      };
      _this.tipMessage = "数据加载中...";
      _this.$crmList
        .getIntegralTradeRecordList(data)
        .then(ret => {
          if (ret.total == 0 && _this.type == "INTEGRAL") {
            _this.tipMessage = "该会员没有积分记录";
          }
          _this.consumptionList = ret.records;
          _this.size = ret.size;
          _this.total = ret.total;
        })
        .catch(err => {
          _this.consumptionList = [];
          if (err && err.msg) {
            _this.tipMessage = err.msg;
          } else {
            _this.tipMessage = "系统繁忙，请稍后重试！";
          }
          console.log(err);
        });
    },
    changeTab(val) {
      this.current = 1;
      this.type = val;
      if (val == "INTEGRAL") {
        this.integralChange();
      } else {
        this.change();
      }
    },
    handleSizeChange(val) {
      this.size = val;
      if (this.type == "INTEGRAL") {
        this.integralChange();
      } else {
        this.change();
      }
    },
    handleCurrentChange(val) {
      this.current = val;
      if (this.type == "INTEGRAL") {
        this.integralChange();
      } else {
        this.change();
      }
    },
    // 查看卡详情
    handleMembershipCardDetail(cardNo) {
      this.$router.push({
        path: "/member/membershipCard/detail",
        query: {
          cardNo: cardNo,
          pathOrigin: "detail",
          levelNo: this.$route.query.levelNo,
          id: this.$route.query.id,
          startOpenDate: this.$route.query.startOpenDate,
          endOpenDate: this.$route.query.endOpenDate
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
        min-width: 186px;
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
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
        width: 55%;
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
        padding: 20px 0 0;
        ._member-account-row {
          display: flex;
          .stored-money {
            font-size: 12px;
            color: #666666;
            width: 200px;
            .stored-total {
              // display: flex;
              align-items: center;
              font-size: 21px;
              color: #333333;
              margin-top: 10px;
              font-weight: bold;
              margin-left: -4px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              .stored-detail {
                font-size: 12px;
                color: #666;
                // padding-left: 5px;
                font-weight: inherit;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }
          }
          .cumulative-money {
            font-size: 12px;
            color: #666666;
            width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            .cumulative-total {
              font-size: 21px;
              color: #333333;
              margin-top: 10px;
              font-weight: bold;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
          }
        }
        ._member-account-row-down {
          margin-top: 10px;
        }
      }
    }
  }
  // 会员标签
  ._member-label-level-wrap {
    display: flex;
    flex-direction: column;
    padding: 12px 0 0 242px;
    align-items: baseline;
    ._member-item-iinner {
      display: flex;
      margin-bottom: 12px;
      font-size: 12px;
      color: #666;
      .lable {
        width: 60px;
        display: inline-block;
        font-size: 12px;
        color: #666;
        flex-shrink: 0;
      }
      ._no-label {
        font-size: 12px;
        color: #666;
        margin-left: 5px;
      }
      ._label-item-wrap {
        display: flex;
        flex-wrap: wrap;
        ._member-label-item {
          border: 1px solid #666;
          margin: 0 10px 10px 0;
          padding: 0 8px;
          height: 20px;
          line-height: 18px;
          border-radius: 2px;
          ._member-label-color {
            font-size: 12px;
            color: #666;
          }
        }
      }
    }
  }
  .holding-card-info {
    margin-top: 20px;
    border: 0;
    // 等级权益
    ._member-level-rights-wrap {
      display: flex;
      background: #f5f7fa;
      border-radius: 4px;
      padding: 10px 15px 0;
      margin-left: 20px;
      ._member-level-rights-title {
        flex-shrink: 0;
        font-size: 12px;
        font-weight: bold;
        color: #333333;
        letter-spacing: 0;
        height: 76px;
        line-height: 76px;
        padding: 0 30px 0 15px;
        border-right: 1px solid #dededf;
      }
      ._member-level-rights-items-wrap {
        display: flex;
        flex-wrap: wrap;
        ._member-level-rights-item {
          text-align: center;
          width: 100px;
          margin: 6px 10px 10px;
          img {
            width: 36px;
            height: 36px;
            vertical-align: middle;
            margin-bottom: 14px;
          }
          ._equity-name {
            font-size: 12px;
            color: #333333;
            letter-spacing: 0;
          }
        }
      }
      ._no-equity-word {
        text-align: center;
        color: #909399;
        width: 83%;
        height: 86px;
        line-height: 76px;
      }
    }
    // 卡样式
    .card-item-wrap {
      width: 352px;
      // height: 166px;
      margin-right: 20px;
      .card-item {
        border: 0;
        border-radius: 8px;
        background: linear-gradient(-180deg, #ffcd6c 3%, #ffbc39 97%);
        ._default-card-btn-wrap {
          height: 21px;
          padding-left: 20px;
          position: relative;
          top: -6px;
        }
        ._member-default-card {
          background: #ffffff;
          box-shadow: 0 1px 2px 0 #ffbc39;
          color: #ffa900;
          padding: 0 9px;
          border-radius: 30px;
          // margin-right: 50px;
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          text-align: center;
          width: 44px;
          // overflow: hidden;
          // text-overflow: ellipsis;
          // white-space: nowrap;
          // margin-bottom: 6px;
        }
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
              font-size: 12px;
              color: #ffffff;
              display: block;
              margin-top: -4px;
            }
          }
          .card-type {
            font-size: 12px;
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
            max-width: 294px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .unit {
            font-size: 12px;
            color: #ffffff;
          }
        }
        .term-of-validity {
          padding: 0 20px;
          height: 21px;
          display: flex;
          justify-content: space-between;
          position: relative;
          top: -5px;
          .term-of-validity-date {
            font-size: 12px;
            color: #ffffff;
          }
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
      .el-radio-button:first-child .el-radio-button__inner {
        border-right: none;
      }
      .el-radio-button:last-child .el-radio-button__inner {
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
  .detail-btn-wrap {
    width: 100%;
    margin: 1px 0 40px;
    text-align: center;
  }
}
</style>