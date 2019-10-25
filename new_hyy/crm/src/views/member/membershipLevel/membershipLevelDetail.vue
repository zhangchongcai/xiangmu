<template>
  <div class="_membership-level-detail">
    <div class="level-detail-head">
      <div class="level-cycle">
        <div class="cycle-left">
          <div class="lable">等级定级周期：</div>
          <span class="level-cycle-num">{{searchData.rankCycle}}</span>
          <span class="unit-desc">个月</span>
          <div class="cycle-tips">注：每日1点进行会员升级调整，定级周期内最后一月月末1点进行会员降级调整，修改会员等级后，新等级将在次日1点生效。</div>
        </div>
        <el-tooltip class="item" :disabled="isEdit" effect="dark" content="数据请求中，请稍后编辑" placement="left">
          <span>
            <el-button type="primary" @click="handleEdit" :disabled="!isEdit">编辑</el-button>
          </span>
        </el-tooltip>
      </div>
    </div>
    <!-- 内容区 -->
    <el-collapse v-model="activeNames" class="_edit-membership-level-content">
      <!-- 会员等级 -->
      <el-collapse-item title="会员等级" name="0">
        <div style="padding-left:20px;">
          <div class="member-level-title">
            <div class="level-explain">等级编号数字越大级别越高</div>
          </div>
          <div class="_m-member-table-custom">
            <el-table :data="searchData.memberLevelRuleVOList" stripe border style="width: 100%">
              <el-table-column prop="levelNo" label="会员等级编号" min-width="100">
                <template slot-scope="scope">
                  <span class="index-wrap">{{scope.$index + 1}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="levelName" label="会员等级名称" min-width="120" show-overflow-tooltip>
              </el-table-column>
              <el-table-column label="保级升级规则" min-width="600" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.levelNo == '1'" class="ordinary">
                    当前等级为最低，无法添加升级规则
                  </span>
                  <span v-else class="no-ordinary">
                    升级标准：定级周期内成长值达到
                    {{scope.row.levelupGrowth | emptyShow}} 点；
                    保级标准：定级周期内成长值达到
                    {{scope.row.saveGrowth | emptyShow}} 点
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-collapse-item>
      <!-- 基础信息 -->
      <el-collapse-item title="基础信息" name="1" class="basic-info">
        <div class="growth-name">
          <div class="item-inner"><label class="lable-name">成长值名称：</label>{{searchData.growthName | emptyShow}}</div>
        </div>
      </el-collapse-item>
      <!-- 成长值获取规则 -->
      <el-collapse-item title="成长值获取规则" name="2" class="get-rules">
        <div class="growth-value-options" v-for="(domain, index) in searchData.memberGrowthRuleAndChannelVOList" :key="index">
          <div class="item-inner"><label class="lable-name">获取渠道：</label>{{domain.memberGrowthRuleChannelVOList |
            foematChannel}}</div>
          <div class="rules-selection">
            <div class="rules-lable">获取规则：</div>
            <div style="width:80%">
              <div class="rules-item" v-for="(item, index) of domain.memberGrowthRuleVOList" :key="index">
                <div class="rules-title" v-if="index==0">{{item.getType == '0'?'消费类：':'服务类：'}}</div>
                <!-- 购买影票 -->
                <div class="buy-ticket">
                  <div class="buy-type">{{item.goodsType == '0'?'购买影票':'购买卖品'}}</div>
                  【{{item.goodsWay == '0'?'按金额':'按次数'}}】
                  每消费1{{item.goodsWay == '0'?'元':'次'}}，获取
                  【{{item.everyFullGrowth | emptyShow}}】
                  成长值，每天上限
                  【{{item.everyDayUpper | emptyShow}}】
                  成长值
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
import FixStepTool from '../../../components/fix-step-tool/fix-step-tool';
import fixStepMixin from '../../../mixins/CRM/fixStepTool.js';
export default {
  name: 'MembershipLevelDetail',
  data () {
    return {
      isEdit: false,
      id: '',
      activeNames: ['0', '1', '2'],
      stepData: {
        stepEl: '.el-collapse-item',
        stepList: [
          {
            name: '会员等级',
            isactive: false
          },
          {
            name: '基础信息',
            isactive: false
          },
          {
            name: '成长值获取规则',
            isactive: false
          }
        ]
      },
      searchData: ''
    };
  },
  filters: {
    emptyShow: function (value) {
      if (value == null || value == undefined || value === '') {
        return '-';
      } else {
        return value;
      }
    },
    foematChannel (value) {
      if (value.length > 0) {
        return value
          .map(item => {
            return item.channelName;
          })
          .join(' , ');
      } else {
        return '-';
      }
    }
  },
  mixins: [fixStepMixin],
  components: {
    fixStepTool: FixStepTool
  },
  created () {
    this.$crmList
      .getLevelDetail({ tenantId: this.$store.state.loginUser.consumerId })
      .then(res => {
        this.isEdit = true;
        var data = res;
        // this.searchData = res;
        this.id = res.id;
        if (
          res.memberLevelRuleVOList == null ||
          res.memberLevelRuleVOList.length == 0
        ) {
          data.memberLevelRuleVOList = [
            {
              levelNo: '1',
              levelName: '普通会员',
              levelupGrowth: '0',
              saveGrowth: '0'
            }
          ];

          this.searchData = data;
        } else {
          data.memberLevelRuleVOList[0].levelNo = 1;
          data.memberLevelRuleVOList[0].levelupGrowth = 0;
          data.memberLevelRuleVOList[0].saveGrowth = 0;
          this.searchData = data;
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    handleEdit () {
      this.$router.push({
        path: '/member/membershipLevel/edit',
        query: { id: this.id }
      });
    }
  }
};
</script>
<style lang="scss">
._membership-level-detail {
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
    .member-level-title {
      display: flex;
      justify-content: space-between;
      padding-bottom: 5px;
      .level-explain {
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
      }
    }
    // table内样式
    .index-wrap {
      display: inline-block;
      width: 12px;
      height: 12px;
      text-align: center;
      line-height: 12px;
      border-radius: 50%;
      border: 1px solid #333;
      color: #333;
    }
    .no-ordinary,
    .ordinary {
      font-size: 12px;
      color: #333;
      .levelup-growth,
      .save-growth {
        width: 80px;
        margin: 0 8px;
        .el-input__inner {
          height: 20px;
        }
      }
    }
    // 基础信息
    .basic-info {
      .growth-name {
        padding-left: 20px;
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
      }
    }
    // 获取成长值规则
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
            .rules-title {
              width: 60px;
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
          .rules-item:nth-child(2) {
            margin: 15px 0 0 60px;
          }
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