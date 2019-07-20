<template>
  <div class="_member-integral-rules">
    <div class="level-detail-head">
      <div class="level-cycle">
        <div class="cycle-left">
          <div class="lable">积分有效期：</div>
          <span class="level-cycle-num">3</span>
          <span class="unit-desc">年</span>
          <!-- <div class="cycle-tips">注：每日1点进行会员升级调整，定级周期内最后一月月末1点进行会员降级调整，修改会员等级后，新等级将在次日1点生效。</div> -->
        </div>
        <el-button type="primary" @click="handleEdit">编辑</el-button>
      </div>
    </div>
    <!-- 内容区 -->
    <el-collapse v-model="activeNames" class="_edit-membership-level-content">
      <!-- 购买影票规则 -->
      <el-collapse-item title="购买影票规则" name="0" class="get-rules">
        <div class="growth-value-options" v-for="(domain, index) in searchData.memberGrowthRuleAndChannelVOList" :key="id+index">
          <div class="item-inner"><label class="lable-name">获取渠道：</label>{{domain.memberGrowthRuleChannelVOList |
            foematChannel}}</div>
          <div class="rules-selection">
            <div class="rules-lable">获取规则：</div>
            <div style="width:90%">
              <div class="rules-item rules-item-2n" v-for="(item, index) of domain.memberGrowthRuleVOList" :key="id+index">
                <div class="rules-title" v-if="index==0">APP：</div>
                <!--  -->
                <div class="buy-ticket">
                  <div class="buy-type">会员等级</div>
                    【111】至【222】
                    支付方式【信用卡】，
                    订单满【1】元&nbsp;&nbsp;
                    获取【2】积分，
                    设置获取积分上限&nbsp;&nbsp;
                    每订单获取上限【2】积分，
                    每日上限【20】积分
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-collapse-item>
      <!-- 购买卖品规则 -->
      <el-collapse-item title="购买卖品规则" name="1" class="get-rules">
        <div class="growth-value-options" v-for="(domain, index) in searchData.memberGrowthRuleAndChannelVOList" :key="index">
          <div class="item-inner"><label class="lable-name">获取渠道：</label>{{domain.memberGrowthRuleChannelVOList |
            foematChannel}}</div>
          <div class="rules-selection">
            <div class="rules-lable">获取规则：</div>
            <div style="width:90%">
                <div class="rules-item rules-item-3n" v-for="(item, index) of domain.memberGrowthRuleVOList" :key="index">
                  <div class="rules-title" v-if="index==0">APP：</div>
                  <!--  -->
                  <div class="buy-ticket" style="height:60px" v-if="index==0">是否同购买影票规则：是</div>
                  <div class="buy-ticket" style="margin-left:100px;">
                    <div class="buy-type">会员等级</div>
                    【111】至【222】
                    支付方式【信用卡】，
                    订单满【1】元&nbsp;&nbsp;
                    获取【2】积分，
                    设置获取积分上限&nbsp;&nbsp;
                    每订单获取上限【2】积分，
                    每日上限【20】积分
                  </div>
                </div>
              </div>
            </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <fixStepTool :stepData="stepData.stepList" class="_fixsteptool-member"></fixStepTool>
  </div>
</template>
<script>
import FixStepTool from "../../../components/fix-step-tool/fix-step-tool";
import fixStepMixin from "../../../mixins/CRM/fixStepTool.js";
export default {
  name: "MembershipLevelDetail",
  data() {
    return {
      id: "",
      activeNames: ["0", "1"],
      stepData: {
        stepEl: ".el-collapse-item",
        stepList: [
          {
            name: "购买影票规则",
            isactive: false
          },
          {
            name: "购买卖品规则",
            isactive: false
          }
        ]
      },
      searchData: ""
    };
  },
  filters: {
    emptyShow: function(value) {
      if (value || (typeof value == "number" && value == 0)) {
        return value;
      } else {
        return "-";
      }
    },
    foematChannel(value) {
      if (value.length > 0) {
        return value
          .map(item => {
            return item.channelName;
          })
          .join(" , ");
      } else {
        return "-";
      }
    }
  },
  mixins: [fixStepMixin],
  components: {
    fixStepTool: FixStepTool
  },
  created() {
    this.$crmList
      .getLevelDetail({ tenantId: this.$store.state.loginUser.consumerId })
      .then(res => {
        var data = res;
        // this.searchData = res;
        this.id = res.id;
        if(res.memberLevelRuleVOList == null || res.memberLevelRuleVOList.length == 0 ){
          data.memberLevelRuleVOList = [{
            levelNo: "1",
            levelName: "普通会员",
            levelupGrowth: "0",
            saveGrowth: "0"
          }]

          this.searchData = data

        }else {
          data.memberLevelRuleVOList[0].levelNo = 1;
          data.memberLevelRuleVOList[0].levelupGrowth = 0;
          data.memberLevelRuleVOList[0].saveGrowth = 0;
          this.searchData = data
          console.log('this.searchData=====',this.searchData)
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    handleEdit() {
      this.$router.push({
        path: "/member/memberIntegral/editRules",
        query: { id: this.id }
      });
    }
  }
};
</script>
<style lang="scss">
._member-integral-rules {
  .level-detail-head {
    background: #f5f5f5;
    height: 64px;
    line-height: 64px;
    padding: 0 24px;
    font-size: 12px;
    color: #666666;
    letter-spacing: 0;
    .level-cycle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .cycle-left {
        display: flex;
        .lable {
          font-size: 12px;
          color: #666666;
          letter-spacing: 0;
        }
        .level-cycle-num {
          font-size: 12px;
          font-weight: bold;
          color: #151515;
          letter-spacing: 0;
        }
        .unit-desc {
          font-size: 12px;
          color: #666666;
          letter-spacing: 0;
          // margin-left: 8px;
        }
        .cycle-tips {
          font-size: 12px;
          color: #3b74ff;
          letter-spacing: 0;
          margin-left: 24px;
        }
      }
      .el-button {
        width: 80px;
        height: 32px;
        padding: 8px 20px;
      }
    }
  }
  ._edit-membership-level-content {
    width: 80%;
    margin-top: 20px;
    border: 0;
    .el-form-item__label {
      font-size: 12px;
    }
    // 购买影票、卖品规则
    .get-rules {
      .growth-value-options {
        background: #f5f5f5;
        border-radius: 4px;
        padding: 15px 0 20px 20px;
        margin: 0 0 15px 20px;
        .item-inner {
          display: flex;
          align-items: baseline;
          font-size: 12px;
          color: #666666;
          .lable-name {
            width: 80px;
            display: inline-block;
            font-size: 12px;
            color: #666666;
            line-height: 1.3;
          }
        }
        .rules-selection {
          margin-top: 15px;
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          .rules-lable {
            width: 80px;
            display: inline-block;
            font-size: 12px;
            color: #666666;
            letter-spacing: 0;
          }
          .rules-item {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin-top: 20px;
            .rules-title {
              width: 100px;
              font-size: 12px;
              font-weight: bold;
              color: #666666;
              letter-spacing: 0;
              display: inline-block;
            }
            .buy-ticket {
              display: flex;
              align-items: center;
              font-size: 12px;
              color: #666666;
              .buy-type {
                font-size: 12px;
                color: #666666;
                letter-spacing: 0;
              }
            }
          }
          
          .rules-item-2n:nth-child(2n) {
            margin: 15px 0 0 100px;
          }
          // .rules-item-3n:nth-child(2n) {
          //   margin: 15px 0 0 100px;
          // }
         
        }
      }
      .add-growth-value-btn {
        font-size: 12px;
        color: #3b74ff;
        letter-spacing: 0;
        cursor: pointer;
      }
    }
  }
}
</style>