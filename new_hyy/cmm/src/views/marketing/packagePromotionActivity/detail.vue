<template>
  <div class="detail">
    <el-collapse v-model="activeNames">
      <el-collapse-item v-for="item in config" :key="item.title" :title="item.title" :name="item.activeName">
        <ul class="con_ul">
          <li v-for="(conItem,conIdx) in item.content" :key="conIdx">
            <el-row>
              <el-col :span="2">
                <div>{{conItem.title+"："}}</div>
              </el-col>
              <el-col :span="22">
                <div>
                  <el-row>
                    <el-col :span="2">
                      <span v-if="conItem.opUniqueName">{{conItem.opUniqueName}}</span>
                    </el-col>
                    <el-col :span="11">
                      <span>{{conItem.value}}</span>
                    </el-col>
                  </el-row>
                </div>
                <div v-if="conItem.key == 'closeGoodsSet'" class="closeGoodsSet">
                  <el-row v-for="(option,opIdx) in conItem.options" :class="option.className" :key="opIdx" style="width:723px;border: 1px solid #F5F5F5;margin-bottom:24px;">
                    <div class="ticketSetting">{{option.title}}</div>
                    <div class="closeGoodsSet_div">
                      <ul>
                        <li v-for="(opItem,opIdx) in option.content" :key="opIdx">
                          <el-row>
                            <el-col :span="4">
                              <div>{{opItem.title+"："}}</div>
                            </el-col>
                            <el-col :span="20">
                              <div>
                                <el-row>
                                  <el-col :span="4">
                                    <span v-if="opItem.opUniqueName">{{opItem.opUniqueName}}</span>
                                  </el-col>
                                  <el-col :span="20">
                                    <span>{{opItem.value}}</span>
                                  </el-col>
                                </el-row>
                              </div>
                              <div v-if="opItem.opUniqueName == '指定条件'">
                                <div v-for="(option,index) in opItem.options" :key="index">
                                  <el-row>
                                    <el-col :span="4">
                                      <div>{{option.title+"："}}</div>
                                    </el-col>
                                    <el-col :span="20">
                                      <div>
                                        <el-row>
                                          <el-col :span="6">
                                            <span v-if="option.opUniqueName">{{option.opUniqueName}}</span>
                                          </el-col>
                                          <el-col :span="18">
                                            <span>{{option.value}}</span>
                                          </el-col>
                                        </el-row>
                                      </div>
                                      <div v-for="(optionItem) in option.options" :key="optionItem">{{optionItem}}</div>
                                    </el-col>
                                  </el-row>
                                </div>
                              </div>
                            </el-col>
                          </el-row>
                        </li>
                      </ul>
                    </div>
                  </el-row>
                </div>
                <div v-else v-for="(option,index) in conItem.options" :key="index">{{option}}</div>
              </el-col>
            </el-row>
          </li>
        </ul>
      </el-collapse-item>
    </el-collapse>
    <el-row class="flex-base flex-center bottom-control-group detailReturnBtn">
      <el-button class="returnBtn" @click="returnList()">返回</el-button>
    </el-row>
  </div>
</template>
<script>
import qs from "qs";
export default {
  data () {
    return {
      // 折叠区域
      activeNames: ["1", "2", "3", "4"],
      templateId: '',
      config: [{
        activeName: "1",
        title: "活动基础信息",
        content: [{
          title: "活动类型",
          key: 'templateId',
          opUniqueName: '',
          value: '',
          options: []
        }, {
          title: "活动名称",
          key: 'name',
          opUniqueName: '',
          value: '',
          options: []
        }, {
          title: "活动描述",
          key: 'remark',
          opUniqueName: '',
          value: '',
          options: []
        }, {
          title: "执行策略",
          key: 'executeMode',
          opUniqueName: '',
          value: '',
          options: []
        }, {
          title: "执行优先级",
          key: 'priority',
          opUniqueName: '',
          value: '',
          options: []
        }, {
          title: "活动有效期",
          key: 'validDate',
          opUniqueName: '',
          value: '',
          options: []
        }, {
          title: "排除日期",
          key: 'excludeDate',
          opUniqueName: '',
          value: '',
          options: []
        }, {
          title: "时段范围",
          key: 'validWeekTimeRange',
          opUniqueName: '不限',
          value: '',
          options: []
        }, {
          title: "交易渠道",
          key: 'consumeWayCode',
          opUniqueName: '不限',
          value: '',
          options: []
        }]
      }, {
        activeName: "2",
        title: "设置活动条件",
        content: [{
          title: "交易影院",
          key: 'cinemaCode',
          opUniqueName: '包含',
          value: '',
          options: []
        }, {
          title: "会员等级",
          key: 'customerLevelCode',
          opUniqueName: '不限',
          value: '',
          options: []
        }, {
          title: "会员卡政策",
          key: 'cardRightCode',
          opUniqueName: '不限',
          value: '',
          options: []
        }, {
          title: "支付方式",
          key: 'payTypeCode',
          opUniqueName: '不限',
          value: '',
          options: []
        }, {
          title: "组合商品设置",
          key: 'closeGoodsSet',
          opUniqueName: '',
          value: '',
          options: [{
            className: 'yingpiao',
            title: "影票设置",
            content: [{
              title: "影票数量",
              key: 'filmTicketAmount',
              opUniqueName: '',
              value: '',
              options: []
            }, {
              title: "影票适用条件",
              key: 'FilmTicketInfo',
              opUniqueName: '不限',
              value: '',
              options: [{
                title: "放映效果",
                key: 'showEffect',
                opUniqueName: '不限',
                value: '',
                options: []
              }, {
                title: "影厅类型",
                key: 'hallTypeKey',
                opUniqueName: '不限',
                value: '',
                options: []
              }, {
                title: "影片",
                key: 'uniformCode',
                opUniqueName: '不限',
                value: '',
                options: []
              }, {
                title: "影片类型",
                key: 'filmTypeKey',
                opUniqueName: '不限',
                value: '',
                options: []
              }, {
                title: "放映有效期",
                key: 'planStartTime',
                opUniqueName: '不限',
                value: '',
                options: []
              }, {
                title: "放映时段范围",
                key: 'filmPlanTimeRange',
                opUniqueName: '不限',
                value: '',
                options: []
              }, {
                title: "最低发行价",
                key: 'lowestPrice',
                opUniqueName: '不限',
                value: '',
                options: []
              },]
            }]
          }, {
            className: 'maipin',
            title: "卖品设置",
            content: [{
              title: "商品名称",
              key: 'merKey',
              opUniqueName: '',
              value: '',
              options: []
            }, {
              title: "卖品数量",
              key: 'amount',
              opUniqueName: '',
              value: '',
              options: []
            }]
          }]
        }]
      }, {
        activeName: "3",
        title: "设置优惠方案",
        content: [{
          title: "优惠设置",
          key: 'modifyValue',
          opUniqueName: '',
          value: '',
          options: []
        }, {
          title: "优惠金额分摊",
          key: 'discountApportion',
          opUniqueName: '',
          value: '先卖品后影票',
          options: []
        }]
      }, {
        activeName: "4",
        title: "设置活动预算",
        content: [{
          title: "活动总预算",
          key: 'activityBudgetSum',
          opUniqueName: '',
          value: '',
          options: []
        }, {
          title: "活动总预算周期限制",
          key: 'runRestrainType',
          opUniqueName: '',
          value: '',
          options: []
        }]
      }],
      // 租户id
      tenantId: this.$store.state.loginUser.consumerId || "",
    }
  },
  created () {
    if (this.$route.query.id) {
      let id = this.$route.query.id;
      this.init(id);
    }
  },
  methods: {
    init (id) {
      let params = qs.stringify({
        activityId: id,
        tenantId: this.tenantId,
      });
      this.$cmmList.marketingViewActivity(params).then(res => {
        if (res && res.code === 200) {
          let ruleGroup = JSON.parse(res.data.marketingActivityVO.ruleGroup);
          this.templateId = ruleGroup.templateId;
          let ruleConditions = ruleGroup.rules[0].ruleConditions;
          let actions = ruleGroup.rules[0].actions;
          let bizPropertyMap = ruleGroup.rules[0].bizPropertyMap;
          for (let item of this.config) {
            // 活动基础信息
            if (item.activeName == 1) {
              // 活动类型
              item.content.find(item => item.key == 'templateId').value = ruleGroup.templateId == 21 ? '立减' : '减至';
              // 活动名称
              item.content.find(item => item.key == 'name').value = ruleGroup.name;
              // 活动描述
              item.content.find(item => item.key == 'remark').value = ruleGroup.remark;
              // 执行策略
              item.content.find(item => item.key == 'executeMode').value = ruleGroup.executeMode == "AUTO_MATCH" ? "自动" : "推荐"
              // 执行优先级
              item.content.find(item => item.key == 'priority').value = ruleGroup.priority == 100 ? "按最优先执行" : ruleGroup.priority;
              // 活动有效期
              item.content.find(item => item.key == 'validDate').value = ruleGroup.validDateStart + "  至  " + ruleGroup.validDateEnd;
              for (let comItem of ruleGroup.commonInfo) {
                // 排除日期
                if (comItem.key == "holiday") {
                  let conItem = item.content.find(item => item.key == 'excludeDate');
                  if (conItem.value) {
                    conItem.value = '节假日除外 / 指定排除日期范围';
                  } else {
                    conItem.value = '节假日除外';
                  }
                }
                if (comItem.key == "appointInvalidDate") {
                  let options = [];
                  let values = JSON.parse(comItem.value)
                  for (let value of values) {
                    value = value[0] + '  至  ' + value[1]
                    options.push(value)
                  }
                  let conItem = item.content.find(item => item.key == 'excludeDate');
                  if (conItem.value) {
                    conItem.value = '节假日除外 / 指定排除日期范围';
                  } else {
                    conItem.value = '指定排除日期范围';
                  }
                  conItem.options = options;
                }
                // 时段范围
                if (comItem.key == 'validWeekTimeRange') {
                  let options = [];
                  let values = JSON.parse(comItem.value)
                  for (let value of values) {
                    let valueItems = []
                    for (let valueItem of value) {
                      if (valueItem == 1) {
                        valueItems.push('星期一')
                      } else if (valueItem == 2) {
                        valueItems.push('星期二')
                      } else if (valueItem == 3) {
                        valueItems.push('星期三')
                      } else if (valueItem == 4) {
                        valueItems.push('星期四')
                      } else if (valueItem == 5) {
                        valueItems.push('星期五')
                      } else if (valueItem == 6) {
                        valueItems.push('星期六')
                      } else if (valueItem == 7) {
                        valueItems.push('星期日')
                      }
                    }
                    valueItems.push(value[value.length - 2] + ':00 至 ' + value[value.length - 1] + ':00 ')
                    valueItems = valueItems.join('、')
                    options.push(valueItems)
                  }
                  let conItem = item.content.find(item => item.key == 'validWeekTimeRange');
                  conItem.opUniqueName = comItem.opUniqueName == "WeekTimeRangeOperator" ? "指定时段" : "不限";
                  conItem.options = options;
                }
                // 交易渠道
                if (comItem.key == 'consumeWayCode') {
                  let conItem = item.content.find(item => item.key == 'consumeWayCode');
                  conItem.opUniqueName = comItem.opUniqueName == "normalIn" ? '包含' : comItem.opUniqueName == "normalNotIn" ? "不包含" : '不限';
                  conItem.value = comItem.text;
                }
              }
            }
            // 设置活动条件
            if (item.activeName == 2) {
              for (let ruleCondition of ruleConditions) {
                //交易影院
                if (ruleCondition.key == "cinemaCode") {
                  let conItem = item.content.find(item => item.key == 'cinemaCode')
                  conItem.opUniqueName = ruleCondition.opUniqueName == 'normalIn' ? '包含' : '不包含';
                  conItem.value = ruleCondition.text;
                }
                // 会员等级
                if (ruleCondition.key == "customerLevelCode") {
                  let conItem = item.content.find(item => item.key == 'customerLevelCode')
                  if (ruleCondition.opUniqueName == 'normalIn') {
                    conItem.opUniqueName = '包含'
                    conItem.value = ruleCondition.text;
                  } else if (ruleCondition.opUniqueName == 'normalNotIn') {
                    conItem.opUniqueName = '不包含'
                    conItem.value = ruleCondition.text;
                  } else if (ruleCondition.opUniqueName == 'not_memberOperator') {
                    conItem.opUniqueName = '非会员'
                  } else {
                    conItem.opUniqueName = '不限'
                  }
                }
                //会员卡政策
                if (ruleCondition.key == "cardRightCode") {
                  let conItem = item.content.find(item => item.key == 'cardRightCode')
                  if (ruleCondition.opUniqueName == 'normalIn') {
                    conItem.opUniqueName = '包含'
                    conItem.value = ruleCondition.text;
                  } else if (ruleCondition.opUniqueName == 'normalNotIn') {
                    conItem.opUniqueName = '不包含'
                    conItem.value = ruleCondition.text;
                  } else if (ruleCondition.opUniqueName == 'AllMember') {
                    conItem.opUniqueName = '全部卡政策'
                  } else {
                    conItem.opUniqueName = '不限'
                  }
                }
                // 支付方式
                if (ruleCondition.key == "payTypeCode") {
                  let conItem = item.content.find(item => item.key == 'payTypeCode')
                  conItem.opUniqueName = ruleCondition.opUniqueName == 'normalIn' ? '包含' : ruleCondition.opUniqueName == 'normalNotIn' ? '不包含' : '不限';
                  conItem.value = ruleCondition.text;
                }

                // 影票设置
                // 影票数量
                if (ruleCondition.key == "filmTicketAmount") {
                  let conItem = item.content.find(item => item.key == 'closeGoodsSet');
                  let opItem = conItem.options[0].content.find(item => item.key == 'filmTicketAmount');
                  opItem.value = ruleCondition.value;
                }
                // 影票适用条件
                if (ruleCondition.category == "FilmTicketInfo") {
                  let conItem = item.content.find(item => item.key == 'closeGoodsSet');
                  let opItem = conItem.options[0].content.find(item => item.key == 'FilmTicketInfo');
                  opItem.opUniqueName = "指定条件";
                  // 放映效果
                  if (ruleCondition.key == "showEffect") {
                    let optionItem = opItem.options.find(item => item.key == 'showEffect');
                    optionItem.opUniqueName = ruleCondition.opUniqueName == 'FieldStringIndexOf' ? '包含' : ruleCondition.opUniqueName == 'notFieldStringIndexOf' ? '不包含' : '不限';
                    optionItem.value = ruleCondition.text;
                  }
                  // 影厅类型
                  if (ruleCondition.key == "hallTypeKey") {
                    let optionItem = opItem.options.find(item => item.key == 'hallTypeKey');
                    optionItem.opUniqueName = ruleCondition.opUniqueName == 'normalIn' ? '包含' : ruleCondition.opUniqueName == 'normalNotIn' ? '不包含' : '不限';
                    optionItem.value = ruleCondition.text;
                  }
                  // 影片
                  if (ruleCondition.key == "uniformCode") {
                    let optionItem = opItem.options.find(item => item.key == 'uniformCode');
                    optionItem.opUniqueName = ruleCondition.opUniqueName == 'normalIn' ? '包含' : ruleCondition.opUniqueName == 'normalNotIn' ? '不包含' : '不限';
                    optionItem.value = ruleCondition.text;
                  }
                  // 影片类型
                  if (ruleCondition.key == "filmTypeKey") {
                    let optionItem = opItem.options.find(item => item.key == 'filmTypeKey');
                    optionItem.opUniqueName = ruleCondition.opUniqueName == 'stringSplitContainOneOperator' ? '包含' : ruleCondition.opUniqueName == 'notStringSplitContainOneOperator' ? '不包含' : '不限';
                    optionItem.value = ruleCondition.text;
                  }
                  // 放映有效期
                  if (ruleCondition.key == "planStartTime") {
                    let optionItem = opItem.options.find(item => item.key == 'planStartTime');
                    ruleCondition.value = JSON.parse(ruleCondition.value)
                    optionItem.value = ruleCondition.value;
                    if (ruleCondition.opUniqueName == "TimeBetweenOperator") {
                      optionItem.opUniqueName = '包含范围';
                      optionItem.value = ruleCondition.value[0] + '  至  ' + ruleCondition.value[1];
                    } else if (ruleCondition.opUniqueName == "DayContainOperator") {
                      optionItem.opUniqueName = '包含每月指定日';
                    } else if (ruleCondition.opUniqueName == "not_DayContainOperator") {
                      optionItem.opUniqueName = '不包含每月指定日';
                    } else {
                      optionItem.opUniqueName = '不限';
                      optionItem.value = '';
                    }
                  }
                  // 放映时段范围
                  if (ruleCondition.key == "filmPlanTimeRange") {
                    let optionItem = opItem.options.find(item => item.key == 'filmPlanTimeRange');
                    if (ruleCondition.opUniqueName == "MorningOperator") {
                      optionItem.opUniqueName = '上午09:00-12:59'
                    } else if (ruleCondition.opUniqueName == "AfternoonOperator") {
                      optionItem.opUniqueName = '下午13:00-16:59'
                    } else if (ruleCondition.opUniqueName == "NightOperator") {
                      optionItem.opUniqueName = '晚上17:00-02:00'
                    } else if (ruleCondition.opUniqueName == "TimeRangeContainOperator") {
                      optionItem.opUniqueName = '指定时段范围'
                      let values = JSON.parse(ruleCondition.value)
                      let options = [];
                      for (let value of values) {
                        value = value[0] + '  至  ' + value[1]
                        options.push(value)
                      }
                      optionItem.options = options;
                    } else {
                      optionItem.opUniqueName = '不限'
                      optionItem.options = [];
                    }
                  }
                  // 最低发行价
                  if (ruleCondition.key == "lowestPrice") {
                    let optionItem = opItem.options.find(item => item.key == 'lowestPrice');
                    optionItem.value = ruleCondition.value;
                    if (ruleCondition.opUniqueName == "normalGreater") {
                      optionItem.opUniqueName = '大于';
                    } else if (ruleCondition.opUniqueName == "normalLess") {
                      optionItem.opUniqueName = '小于';
                    } else if (ruleCondition.opUniqueName == "normalGreaterEqual") {
                      optionItem.opUniqueName = '大于等于';
                    } else if (ruleCondition.opUniqueName == "normalLessEqual") {
                      optionItem.opUniqueName = '小于等于';
                    } else if (ruleCondition.opUniqueName == "normalNotEqual") {
                      optionItem.opUniqueName = '不等于';
                    } else if (ruleCondition.opUniqueName == "normalEqual") {
                      optionItem.opUniqueName = '等于';
                    } else {
                      optionItem.opUniqueName = '不限';
                      optionItem.value = ''
                    }
                  }
                }
                // 卖品设置
                // 商品名称
                if (ruleCondition.key == "merKey") {
                  let conItem = item.content.find(item => item.key == 'closeGoodsSet');
                  let opItem = conItem.options[1].content.find(item => item.key == 'merKey');
                  opItem.value = ruleCondition.text;
                }
                // 卖品数量
                if (ruleCondition.key == "amount") {
                  let conItem = item.content.find(item => item.key == 'closeGoodsSet');
                  let opItem = conItem.options[1].content.find(item => item.key == 'amount');
                  opItem.value = ruleCondition.value;
                }
              }
            }
            //设置优惠方案
            if (item.activeName == 3) {
              for (let action of actions) {
                // 优惠设置
                if (action.key == "modifyValue") {
                  let conItem = item.content.find(item => item.key == 'modifyValue');
                  if (this.templateId == 21) {
                    conItem.value = `立减 ${Math.abs(action.value)} /每套组合商品`;
                  } else if (this.templateId == 22) {
                    conItem.value = `定价 ${Math.abs(action.value)} 元/每套组合商品`;
                  }
                }
                //优惠金额分摊
                if (action.key == "discountApportion") {
                  let conItem = item.content.find(item => item.key == 'discountApportion');
                  if (action.value == "MERCHANDISE_FIRST") {
                    conItem.value = "先卖品后影票";
                  } else if (action.value == "TICKET_FIRST") {
                    conItem.value = "先影票后卖品";
                  } else if (action.value == "TICKET_MERCHANDISE_AVERAGE") {
                    conItem.value = "影票和卖品均摊";
                  }
                }
              }
            }
            //设置活动预算
            if (item.activeName == 4) {
              // 活动总预算
              if (bizPropertyMap.totalTicketsAmount || bizPropertyMap.totalDiscountAmount) {
                let conItem = item.content.find(item => item.key == 'activityBudgetSum');
                conItem.opUniqueName = '指定预算限制'
                if (bizPropertyMap.totalTicketsAmount) {
                  conItem.options.push(`限制套票总数${bizPropertyMap.totalTicketsAmount}张`);
                }
                if (bizPropertyMap.totalDiscountAmount) {
                  conItem.options.push(`限制总优惠金额${bizPropertyMap.totalDiscountAmount}元`);
                }

              } else {
                let conItem = item.content.find(item => item.key == 'activityBudgetSum')
                conItem.opUniqueName = '不限制';
                conItem.options = [];
              }
              // 活动总预算周期限制
              let conItem = item.content.find(item => item.key == 'runRestrainType');
              if (bizPropertyMap.runAmount) {
                conItem.options.push(`数量${bizPropertyMap.runAmount}个`);
              }
              if (bizPropertyMap.runRestrainType == 'perDay') {
                conItem.opUniqueName = '每日限制';
              } else if (bizPropertyMap.runRestrainType == 'perWeek') {
                conItem.opUniqueName = '每周限制';
              } else if (bizPropertyMap.runRestrainType == 'perMonth') {
                conItem.opUniqueName = '每月限制';
              } else if (bizPropertyMap.runRestrainType == 'perYear') {
                conItem.opUniqueName = '每年限制';
              } else if (bizPropertyMap.runRestrainType == 'appointTimeRange') {
                conItem.opUniqueName = '指定周期限制';
                let value = JSON.parse(bizPropertyMap.appointRunRestrainRange)
                conItem.value = value[0] + '  至  ' + value[1]
              } else {
                conItem.opUniqueName = '不限制';
                conItem.options = [];
              }
            }
          }
        }
      }).catch(err => {
        console.log(err);
      });
    },
    // 返回
    returnList () {
      this.$store.commit("tagNav/removeTagNav", this.$route); //关闭页面tag
      this.$router.push({ name: '套票促销活动管理' });
    }
  },
  // 组件路由守卫
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!to.query.id) {
        vm.$store.commit("tagNav/removeTagNav", vm.$route); //关闭页面tag
        next({ name: '套票促销活动管理' });
      }
    })
  }
}
</script>
<style lang="scss" scoped>
/deep/.detail {
  .el-collapse-item {
    .el-collapse-item__header::after {
      height: 0;
      width: 0;
    }
    .el-collapse-item__header {
      height: 36px !important;
      padding-bottom: 0px;
      padding-top: 0px;
      padding-left: 50px !important;
      width: 968px;
      border-bottom: 1px solid #ebeef5;
      font-weight: 600;
      .el-collapse-item__arrow {
        margin-left: -104px;
      }
    }
    .el-collapse-item__wrap {
      padding-top: 0px;
      .el-collapse-item__content {
        padding-bottom: 0px;
        .con_ul {
          div {
            color: #666666 !important;
          }
        }
      }
    }
    .is-active {
      border-bottom: 0 none;
      border-bottom-color: transparent !important;
    }
  }
  .con_ul {
    padding-left: 50px;
    li {
      line-height: 36px;
    }
  }
  .detailReturnBtn {
    position: fixed;
    bottom: 0px;
    height: 56px;
    width: 90%;
    background: #ffffff;
  }
  .bottom-control-group {
    margin-bottom: 0;
  }
  .returnBtn {
    width: 80px;
    height: 32px;
    font-size: 12px;
  }
  .closeGoodsSet {
    .closeGoodsSet_div {
      padding-left: 16px;
      .closeGoodsSet_item {
        margin-bottom: 22px;
      }
    }
    .maipin {
      margin-bottom: 12px !important;
    }
    .ticketSetting {
      height: 32px;
      width: 723px;
      background: #f2f4fd;
      font-size: 12px;
      line-height: 32px;
      padding-left: 16px;
    }
  }
}
</style>