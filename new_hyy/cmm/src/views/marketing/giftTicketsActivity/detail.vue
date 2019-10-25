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
                <div v-for="(optItem,index) in conItem.options" :key="index">{{optItem}}</div>
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
        content: []
      }, {
        activeName: "3",
        title: "设置优惠方案",
        content: [{
          title: "选择赠送票券",
          key: 'couponApplyCode',
          opUniqueName: '',
          value: '',
          options: []
        }, {
          title: "数量",
          key: 'amount',
          opUniqueName: '',
          value: '',
          options: []
        }, {
          title: "是否发送短信",
          key: 'isSendSms',
          opUniqueName: '',
          value: '是',
          options: []
        }]
      }, {
        activeName: "4",
        title: "设置活动预算",
        content: []
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
              if (ruleGroup.templateId == 30) {
                item.content.find(item => item.key == 'templateId').value = '开卡送票券';
              } else if (ruleGroup.templateId == 31) {
                item.content.find(item => item.key == 'templateId').value = '充值送票券';
              } else if (ruleGroup.templateId == 32) {
                item.content.find(item => item.key == 'templateId').value = '消费送票券';
              }
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
              if (ruleGroup.templateId == 30) {// 开卡送票券
                item.content = [{
                  title: "注册影院",
                  key: 'cinemaCode',
                  opUniqueName: '',
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
                  title: "首充金额",
                  key: 'firstRecharge',
                  opUniqueName: '不限',
                  value: '',
                  options: []
                }, {
                  title: "开卡日期",
                  key: 'openDate',
                  opUniqueName: '不限',
                  value: '',
                  options: []
                }]
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
                  // 首充金额
                  if (ruleCondition.key == "firstRecharge") {
                    let conItem = item.content.find(item => item.key == 'firstRecharge')
                    conItem.value = ruleCondition.value;
                    if (ruleCondition.opUniqueName == 'normalGreater') {
                      conItem.opUniqueName = '大于';
                    } else if (ruleCondition.opUniqueName == 'normalEqual') {
                      conItem.opUniqueName = '等于';
                    } else if (ruleCondition.opUniqueName == 'normalLess') {
                      conItem.opUniqueName = '小于';
                    } else if (ruleCondition.opUniqueName == 'normalGreaterEqual') {
                      conItem.opUniqueName = '大于等于';
                    } else if (ruleCondition.opUniqueName == 'normalLessEqual') {
                      conItem.opUniqueName = '小于等于';
                    } else if (ruleCondition.opUniqueName == 'normalNotEqual') {
                      conItem.opUniqueName = '不等于';
                    } else if (ruleCondition.opUniqueName == 'BetweenOperator') {
                      conItem.opUniqueName = '包含区间';
                      let value = JSON.parse(ruleCondition.value)[0];
                      conItem.value = `${value[0]} - ${value[1]}`;
                    } else if (ruleCondition.opUniqueName == 'not_BetweenOperator') {
                      conItem.opUniqueName = '不包含区间';
                      let value = JSON.parse(ruleCondition.value)[0];
                      conItem.value = `${value[0]} - ${value[1]}`;
                    } else {
                      conItem.opUniqueName = '不限';
                      conItem.value = '';
                    }
                  }
                  // 开卡日期
                  if (ruleCondition.key == "openDate") {
                    let conItem = item.content.find(item => item.key == 'openDate');
                    conItem.value = ruleCondition.value;
                    if (ruleCondition.opUniqueName == 'TimeGreaterOperator') {
                      conItem.opUniqueName = '大于';
                    } else if (ruleCondition.opUniqueName == 'TimeEqualOperator') {
                      conItem.opUniqueName = '等于';
                    } else if (ruleCondition.opUniqueName == 'TimeLessOperator') {
                      conItem.opUniqueName = '小于';
                    } else if (ruleCondition.opUniqueName == 'TimeGreaterEqualOperator') {
                      conItem.opUniqueName = '大于等于';
                    } else if (ruleCondition.opUniqueName == 'TimeLessEqualOperator') {
                      conItem.opUniqueName = '小于等于';
                    } else if (ruleCondition.opUniqueName == 'not_TimeEqualOperator') {
                      conItem.opUniqueName = '不等于';
                    } else if (ruleCondition.opUniqueName == 'DateRangeContainOperator') {
                      conItem.opUniqueName = '包含区间';
                      ruleCondition.value = JSON.parse(ruleCondition.value);
                      conItem.value = ruleCondition.value[0] + '  至  ' + ruleCondition.value[1];
                    } else if (ruleCondition.opUniqueName == 'not_DateRangeContainOperator') {
                      conItem.opUniqueName = '不包含区间';
                      ruleCondition.value = JSON.parse(ruleCondition.value);
                      conItem.value = ruleCondition.value[0] + '  至  ' + ruleCondition.value[1];
                    } else {
                      conItem.opUniqueName = '不限';
                      conItem.value = '';
                    }
                  }
                }
              } else if (ruleGroup.templateId == 31) {// 充值送票券
                item.content = [{
                  title: "交易影院",
                  key: 'cinemaCode',
                  opUniqueName: '',
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
                  title: "单次充值金额",
                  key: 'sumPrice',
                  opUniqueName: '不限',
                  value: '',
                  options: []
                }, {
                  title: "累计充值金额",
                  key: 'chargeSum',
                  opUniqueName: '不限',
                  value: '',
                  options: []
                }, {
                  title: "累计消费金额",
                  key: 'consumeSum',
                  opUniqueName: '不限',
                  value: '',
                  options: []
                }, {
                  title: "生日",
                  key: 'birthday',
                  opUniqueName: '不限',
                  value: '',
                  options: []
                }, {
                  title: "开卡年限",
                  key: 'openYears',
                  opUniqueName: '不限',
                  value: '',
                  options: []
                }, {
                  title: "开卡月限",
                  key: 'openMonths',
                  opUniqueName: '不限',
                  value: '',
                  options: []
                }, {
                  title: "开卡日期",
                  key: 'openDate',
                  opUniqueName: '不限',
                  value: '',
                  options: []
                }]
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
                    let conItem = item.content.find(item => item.key == 'cardRightCode');
                    if (ruleCondition.opUniqueName == 'normalIn') {
                      conItem.opUniqueName = '包含';
                      conItem.value = ruleCondition.text;
                    } else if (ruleCondition.opUniqueName == 'normalNotIn') {
                      conItem.opUniqueName = '不包含';
                      conItem.value = ruleCondition.text;
                    } else if (ruleCondition.opUniqueName == 'AllMember') {
                      conItem.opUniqueName = '全部卡政策';
                    } else {
                      conItem.opUniqueName = '不限';
                    }
                  }
                  // 单次充值金额
                  if (ruleCondition.key == "sumPrice") {
                    let conItem = item.content.find(item => item.key == 'sumPrice');
                    conItem.value = ruleCondition.value;
                    if (ruleCondition.opUniqueName == 'customGreater') {
                      conItem.opUniqueName = '大于';
                    } else if (ruleCondition.opUniqueName == 'customEqual') {
                      conItem.opUniqueName = '等于';
                    } else if (ruleCondition.opUniqueName == 'customLess') {
                      conItem.opUniqueName = '小于';
                    } else if (ruleCondition.opUniqueName == 'customLessEqual') {
                      conItem.opUniqueName = '小于等于';
                    } else if (ruleCondition.opUniqueName == 'customGreaterEqual') {
                      conItem.opUniqueName = '大于等于';
                    } else {
                      conItem.opUniqueName = '不限';
                    }
                  }
                  // 累计充值金额
                  if (ruleCondition.key == "chargeSum") {
                    let conItem = item.content.find(item => item.key == 'chargeSum');
                    conItem.value = ruleCondition.value;
                    if (ruleCondition.opUniqueName == 'normalGreater') {
                      conItem.opUniqueName = '大于';
                    } else if (ruleCondition.opUniqueName == 'normalEqual') {
                      conItem.opUniqueName = '等于';
                    } else if (ruleCondition.opUniqueName == 'normalLess') {
                      conItem.opUniqueName = '小于';
                    } else if (ruleCondition.opUniqueName == 'normalLessEqual') {
                      conItem.opUniqueName = '小于等于';
                    } else if (ruleCondition.opUniqueName == 'normalGreaterEqual') {
                      conItem.opUniqueName = '大于等于';
                    } else if (ruleCondition.opUniqueName == 'normalNotEqual') {
                      conItem.opUniqueName = '不等于';
                    } else {
                      conItem.opUniqueName = '不限';
                    }
                  }
                  // 累计消费金额
                  if (ruleCondition.key == "consumeSum") {
                    let conItem = item.content.find(item => item.key == 'consumeSum');
                    conItem.value = ruleCondition.value;
                    if (ruleCondition.opUniqueName == 'normalGreater') {
                      conItem.opUniqueName = '大于';
                    } else if (ruleCondition.opUniqueName == 'normalEqual') {
                      conItem.opUniqueName = '等于';
                    } else if (ruleCondition.opUniqueName == 'normalLess') {
                      conItem.opUniqueName = '小于';
                    } else if (ruleCondition.opUniqueName == 'normalLessEqual') {
                      conItem.opUniqueName = '小于等于';
                    } else if (ruleCondition.opUniqueName == 'normalGreaterEqual') {
                      conItem.opUniqueName = '大于等于';
                    } else if (ruleCondition.opUniqueName == 'normalNotEqual') {
                      conItem.opUniqueName = '不等于';
                    } else {
                      conItem.opUniqueName = '不限';
                    }
                  }
                  // 生日
                  if (ruleCondition.key == "birthday") {
                    let conItem = item.content.find(item => item.key == 'birthday');
                    if (ruleCondition.opUniqueName == 'EqualCurrentDay') {
                      conItem.opUniqueName = '等于当日';
                    } else if (ruleCondition.opUniqueName == 'EqualCurrentMoney') {
                      conItem.opUniqueName = '等于当月';
                    } else if (ruleCondition.opUniqueName == 'EqualCurrentMonthOffset') {
                      conItem.opUniqueName = '交易当月前后N月';
                      conItem.value = ruleCondition.value;
                    } else {
                      conItem.opUniqueName = '不限';
                    }
                  }
                  // 开卡年限
                  if (ruleCondition.key == "openYears") {
                    let conItem = item.content.find(item => item.key == 'openYears');
                    conItem.value = ruleCondition.value;
                    if (ruleCondition.opUniqueName == 'normalGreater') {
                      conItem.opUniqueName = '大于';
                    } else if (ruleCondition.opUniqueName == 'normalEqual') {
                      conItem.opUniqueName = '等于';
                    } else if (ruleCondition.opUniqueName == 'normalLess') {
                      conItem.opUniqueName = '小于';
                    } else if (ruleCondition.opUniqueName == 'normalGreaterEqual') {
                      conItem.opUniqueName = '大于等于';
                    } else if (ruleCondition.opUniqueName == 'normalLessEqual') {
                      conItem.opUniqueName = '小于等于';
                    } else if (ruleCondition.opUniqueName == 'normalNotEqual') {
                      conItem.opUniqueName = '不等于';
                    } else if (ruleCondition.opUniqueName == 'BetweenOperator') {
                      conItem.opUniqueName = '包含区间';
                      let value = JSON.parse(ruleCondition.value)[0];
                      conItem.value = `${value[0]} - ${value[1]}`;
                    } else if (ruleCondition.opUniqueName == 'not_BetweenOperator') {
                      conItem.opUniqueName = '不包含区间';
                      let value = JSON.parse(ruleCondition.value)[0];
                      conItem.value = `${value[0]} - ${value[1]}`;
                    } else {
                      conItem.opUniqueName = '不限';
                    }
                  }
                  // 开卡月限
                  if (ruleCondition.key == "openMonths") {
                    let conItem = item.content.find(item => item.key == 'openMonths');
                    conItem.value = ruleCondition.value;
                    if (ruleCondition.opUniqueName == 'normalGreater') {
                      conItem.opUniqueName = '大于';
                    } else if (ruleCondition.opUniqueName == 'normalEqual') {
                      conItem.opUniqueName = '等于';
                    } else if (ruleCondition.opUniqueName == 'normalLess') {
                      conItem.opUniqueName = '小于';
                    } else if (ruleCondition.opUniqueName == 'normalGreaterEqual') {
                      conItem.opUniqueName = '大于等于';
                    } else if (ruleCondition.opUniqueName == 'normalLessEqual') {
                      conItem.opUniqueName = '小于等于';
                    } else if (ruleCondition.opUniqueName == 'normalNotEqual') {
                      conItem.opUniqueName = '不等于';
                    } else if (ruleCondition.opUniqueName == 'BetweenOperator') {
                      conItem.opUniqueName = '包含区间';
                      let value = JSON.parse(ruleCondition.value)[0];
                      conItem.value = `${value[0]} - ${value[1]}`;
                    } else if (ruleCondition.opUniqueName == 'not_BetweenOperator') {
                      conItem.opUniqueName = '不包含区间';
                      let value = JSON.parse(ruleCondition.value)[0];
                      conItem.value = `${value[0]} - ${value[1]}`;
                    } else {
                      conItem.opUniqueName = '不限';
                    }
                  }
                  // 开卡日期
                  if (ruleCondition.key == "openDate") {
                    let conItem = item.content.find(item => item.key == 'openDate');
                    conItem.value = ruleCondition.value;
                    if (ruleCondition.opUniqueName == 'TimeGreaterOperator') {
                      conItem.opUniqueName = '大于';
                    } else if (ruleCondition.opUniqueName == 'TimeEqualOperator') {
                      conItem.opUniqueName = '等于';
                    } else if (ruleCondition.opUniqueName == 'TimeLessOperator') {
                      conItem.opUniqueName = '小于';
                    } else if (ruleCondition.opUniqueName == 'TimeGreaterEqualOperator') {
                      conItem.opUniqueName = '大于等于';
                    } else if (ruleCondition.opUniqueName == 'TimeLessEqualOperator') {
                      conItem.opUniqueName = '小于等于';
                    } else if (ruleCondition.opUniqueName == 'not_TimeEqualOperator') {
                      conItem.opUniqueName = '不等于';
                    } else if (ruleCondition.opUniqueName == 'DateRangeContainOperator') {
                      conItem.opUniqueName = '包含区间';
                      ruleCondition.value = JSON.parse(ruleCondition.value);
                      conItem.value = ruleCondition.value[0] + '  至  ' + ruleCondition.value[1];
                    } else if (ruleCondition.opUniqueName == 'not_DateRangeContainOperator') {
                      conItem.opUniqueName = '不包含区间';
                      ruleCondition.value = JSON.parse(ruleCondition.value);
                      conItem.value = ruleCondition.value[0] + '  至  ' + ruleCondition.value[1];
                    } else {
                      conItem.opUniqueName = '不限';
                      conItem.value = '';
                    }
                  }
                }
              } else if (ruleGroup.templateId == 32) { // 消费送票券
                item.content = [{
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
                }, {
                  title: "商品名称",
                  key: 'merKey',
                  opUniqueName: '不限',
                  value: '',
                  options: []
                }, {
                  title: "卖品单价",
                  key: 'merPrice',
                  opUniqueName: '不限',
                  value: '',
                  options: []
                }, {
                  title: "支付方式",
                  key: 'payTypeCode',
                  opUniqueName: '不限',
                  value: '',
                  option: []
                }]
                for (let ruleCondition of ruleConditions) {
                  if (ruleCondition.key == "cinemaCode") { //交易影院
                    let conItem = item.content.find(item => item.key == 'cinemaCode')
                    conItem.opUniqueName = ruleCondition.opUniqueName == 'normalIn' ? '包含' : '不包含';
                    conItem.value = ruleCondition.text;
                  } else if (ruleCondition.key == "customerLevelCode") { // 会员等级
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
                  } else if (ruleCondition.key == "cardRightCode") { //会员卡政策
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
                  } else if (ruleCondition.key == "showEffect") { // 放映效果
                    let conItem = item.content.find(item => item.key == 'showEffect')
                    conItem.opUniqueName = ruleCondition.opUniqueName == 'FieldStringIndexOf' ? '包含' : ruleCondition.opUniqueName == 'notFieldStringIndexOf' ? '不包含' : '不限';
                    conItem.value = ruleCondition.text;
                  } else if (ruleCondition.key == "hallTypeKey") { //影厅类型
                    let conItem = item.content.find(item => item.key == 'hallTypeKey')
                    conItem.opUniqueName = ruleCondition.opUniqueName == 'normalIn' ? '包含' : ruleCondition.opUniqueName == 'normalNotIn' ? '不包含' : '不限';
                    conItem.value = ruleCondition.text;
                  } else if (ruleCondition.key == "uniformCode") { // 影片
                    let conItem = item.content.find(item => item.key == 'uniformCode')
                    conItem.opUniqueName = ruleCondition.opUniqueName == 'normalIn' ? '包含' : ruleCondition.opUniqueName == 'normalNotIn' ? '不包含' : '不限';
                    conItem.value = ruleCondition.text;
                  } else if (ruleCondition.key == "filmTypeKey") { //影片类型
                    let conItem = item.content.find(item => item.key == 'filmTypeKey')
                    conItem.opUniqueName = ruleCondition.opUniqueName == 'stringSplitContainOneOperator' ? '包含' : '不包含';
                    conItem.value = ruleCondition.text;
                  } else if (ruleCondition.key == "planStartTime") { //放映有效期
                    let conItem = item.content.find(item => item.key == 'planStartTime')
                    ruleCondition.value = JSON.parse(ruleCondition.value)
                    conItem.value = ruleCondition.value;
                    if (ruleCondition.opUniqueName == "TimeBetweenOperator") {
                      conItem.opUniqueName = '包含范围';
                      conItem.value = ruleCondition.value[0] + '  至  ' + ruleCondition.value[1];
                    } else if (ruleCondition.opUniqueName == "DayContainOperator") {
                      conItem.opUniqueName = '包含每月指定日';
                    } else if (ruleCondition.opUniqueName == "not_DayContainOperator") {
                      conItem.opUniqueName = '不包含每月指定日';
                    } else {
                      conItem.opUniqueName = '不限';
                      conItem.value = '';
                    }
                  } else if (ruleCondition.key == "filmPlanTimeRange") { //放映时段范围
                    let conItem = item.content.find(item => item.key == 'filmPlanTimeRange')
                    if (ruleCondition.opUniqueName == "MorningOperator") {
                      conItem.opUniqueName = '上午09:00-12:59'
                    } else if (ruleCondition.opUniqueName == "AfternoonOperator") {
                      conItem.opUniqueName = '下午13:00-16:59'
                    } else if (ruleCondition.opUniqueName == "NightOperator") {
                      conItem.opUniqueName = '晚上17:00-02:00'
                    } else if (ruleCondition.opUniqueName == "TimeRangeContainOperator") {
                      conItem.opUniqueName = '指定时段范围'
                      let values = JSON.parse(ruleCondition.value)
                      let options = [];
                      for (let value of values) {
                        value = value[0] + '  至  ' + value[1]
                        options.push(value)
                      }
                      conItem.options = options;
                    } else {
                      conItem.opUniqueName = '不限'
                      conItem.options = [];
                    }
                  } else if (ruleCondition.key == "lowestPrice") { //最低发行价
                    let conItem = item.content.find(item => item.key == 'lowestPrice');
                    conItem.value = ruleCondition.value;
                    if (ruleCondition.opUniqueName == "normalGreater") {
                      conItem.opUniqueName = '大于';
                    } else if (ruleCondition.opUniqueName == "normalLess") {
                      conItem.opUniqueName = '小于';
                    } else if (ruleCondition.opUniqueName == "normalGreaterEqual") {
                      conItem.opUniqueName = '大于等于';
                    } else if (ruleCondition.opUniqueName == "normalLessEqual") {
                      conItem.opUniqueName = '小于等于';
                    } else if (ruleCondition.opUniqueName == "normalNotEqual") {
                      conItem.opUniqueName = '不等于';
                    } else if (ruleCondition.opUniqueName == "normalEqual") {
                      conItem.opUniqueName = '等于';
                    } else {
                      conItem.opUniqueName = '不限';
                      conItem.value = '';
                    }
                  } else if (ruleCondition.key == "merKey") { // 商品名称
                    let conItem = item.content.find(item => item.key == 'merKey')
                    conItem.opUniqueName = ruleCondition.opUniqueName == 'normalIn' ? '包含' : ruleCondition.opUniqueName == 'normalNotIn' ? '不包含' : '不限';
                    conItem.value = ruleCondition.text;
                  } else if (ruleCondition.key == "merPrice") {// 卖品单价
                    let conItem = item.content.find(item => item.key == 'merPrice')
                    conItem.value = ruleCondition.value;
                    if (ruleCondition.opUniqueName == "normalGreater") {
                      conItem.opUniqueName = '大于';
                    } else if (ruleCondition.opUniqueName == "normalLess") {
                      conItem.opUniqueName = '小于';
                    } else if (ruleCondition.opUniqueName == "normalGreaterEqual") {
                      conItem.opUniqueName = '大于等于';
                    } else if (ruleCondition.opUniqueName == "normalLessEqual") {
                      conItem.opUniqueName = '小于等于';
                    } else if (ruleCondition.opUniqueName == "normalNotEqual") {
                      conItem.opUniqueName = '不等于';
                    } else if (ruleCondition.opUniqueName == "normalEqual") {
                      conItem.opUniqueName = '等于';
                    } else {
                      conItem.opUniqueName = '不限';
                      conItem.value = '';
                    }
                  } else if (ruleCondition.key == "payTypeCode") { //支付方式
                    let conItem = item.content.find(item => item.key == 'payTypeCode');
                    conItem.opUniqueName = ruleCondition.opUniqueName == 'normalIn' ? '包含' : ruleCondition.opUniqueName == 'normalNotIn' ? '不包含' : '不限';
                    conItem.value = ruleCondition.text;
                  }
                }
              }
            }
            //设置优惠方案
            if (item.activeName == 3) {
              for (let action of actions) {
                // 选择赠送票券
                if (action.key == "couponApplyCode") {
                  item.content.find(item => item.key == 'couponApplyCode').value = action.text;
                }
                // 数量
                if (action.key == "amount") {
                  item.content.find(item => item.key == 'amount').value = action.value;
                }
                // 是否发送短信
                if (action.key == "isSendSms") {
                  item.content.find(item => item.key == 'isSendSms').value = action.value == 'send' ? '是' : '否';
                }
              }
            }
            //设置活动预算
            if (item.activeName == 4) {
              if (ruleGroup.templateId == 30) {// 开卡送票券
                item.content = [{
                  title: "活动总预算",
                  key: 'customerRegCardAmount',
                  opUniqueName: '不限制',
                  value: '',
                  options: []
                }]
                // 活动总预算
                if (bizPropertyMap.customerRegCardAmount) {
                  let conItem = item.content.find(item => item.key == 'customerRegCardAmount');
                  conItem.opUniqueName = '指定预算限制';
                  conItem.options.push(`开卡总数量限制${bizPropertyMap.customerRegCardAmount}张`);
                } else {
                  let conItem = item.content.find(item => item.key == 'customerRegCardAmount');
                  conItem.opUniqueName = '不限制';
                }
              } else if (ruleGroup.templateId == 31) {// 充值送票券
                item.content = [{
                  title: "活动总预算",
                  key: 'runAmount',
                  opUniqueName: '不限制',
                  value: '',
                  options: []
                }, {
                  title: "单用户限制",
                  key: 'userTradeAmount',
                  opUniqueName: '不限制',
                  value: '',
                  options: []
                }]
                // 活动总预算
                if (bizPropertyMap.runAmount) {
                  let conItem = item.content.find(item => item.key == 'runAmount');
                  conItem.opUniqueName = '指定预算限制';
                  conItem.options.push(`充值次数限制${bizPropertyMap.runAmount}次`);
                } else {
                  let conItem = item.content.find(item => item.key == 'runAmount');
                  conItem.opUniqueName = '不限制';
                }
                // 单用户限制
                if (bizPropertyMap.userTradeAmount) {
                  let conItem = item.content.find(item => item.key == 'userTradeAmount');
                  conItem.opUniqueName = '指定预算限制';
                  conItem.options.push(`充值次数限制${bizPropertyMap.userTradeAmount}次`);
                } else {
                  let conItem = item.content.find(item => item.key == 'userTradeAmount');
                  conItem.opUniqueName = '不限制';
                }
              } else if (ruleGroup.templateId == 32) { // 消费送票券
                item.content = [{
                  title: "活动总预算",
                  key: 'runAmount',
                  opUniqueName: '不限制',
                  value: '',
                  options: []
                }, {
                  title: "单用户限制",
                  key: 'userTradeAmount',
                  opUniqueName: '不限制',
                  value: '',
                  options: []
                }]
                // 活动总预算
                if (bizPropertyMap.runAmount) {
                  let conItem = item.content.find(item => item.key == 'runAmount');
                  conItem.opUniqueName = '指定预算限制';
                  conItem.options.push(`交易次数限制${bizPropertyMap.runAmount}次`);
                } else {
                  let conItem = item.content.find(item => item.key == 'runAmount');
                  conItem.opUniqueName = '不限制';
                }
                // 单用户限制
                if (bizPropertyMap.userTradeAmount) {
                  let conItem = item.content.find(item => item.key == 'userTradeAmount');
                  conItem.opUniqueName = '指定预算限制';
                  conItem.options.push(`交易次数限制${bizPropertyMap.userTradeAmount}次`);
                } else {
                  let conItem = item.content.find(item => item.key == 'userTradeAmount');
                  conItem.opUniqueName = '不限制';
                }
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
      this.$router.push({ name: '赠送票券活动管理' });
    }
  },
  // 组件路由守卫
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (!to.query.id) {
        vm.$store.commit("tagNav/removeTagNav", vm.$route); //关闭页面tag
        next({ name: '赠送票券活动管理' });
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
}
</style>