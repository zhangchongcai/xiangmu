<template>
  <div class="coupon-checkSaleList">
    <el-collapse v-model="activeNames">
      <template v-for="item in config">
        <el-collapse-item :key="item.itemName" :title="item.title" :name="item.itemName">
          <ul>
            <template v-for="(item,index) in item.content">
              <li class="baseItem flex-base" :key="index" v-if="item.isShow">
                <span class="item-title" :style="{'width': itemTitle.width +'px'}">
                  {{item.title}}:
                </span>
                <div class="item-content">
                  <template v-if="item.type == 'text'">
                    {{item.value}}{{item.univalent ? item.univalent : ''}}
                  </template>
                  <template v-if="item.type == 'button'">
                    <el-button class="textBtn" :type="item.buttonType" @click="emiteFn(item.clickFn,item.clickFnParam)">{{item.value}}</el-button>
                  </template>
                </div>
              </li>
            </template>
          </ul>
        </el-collapse-item>
      </template>
      <!-- 规则 -->
      <el-collapse-item :title='ruleTitle+"规则"' name='ruleInfo'>
        <!-- 兑换/优惠 -->
        <el-container v-if="model.type == 'exchange' || model.type == 'favorable'" :style="setStyle(ruleStyle.mainContent)">
          <el-header :style="setStyle(ruleStyle.header)"></el-header>
          <el-container :style="setStyle(ruleStyle._main)">
            <el-aside :style="setStyle(ruleStyle.aside)">
              <el-radio-group v-model="ruleRadio">
                <ul class="rule-select-content flex-base flex-center">
                  <template v-for="(item,index) in rule">
                    <li class="rule-select-item flex-base flex-between" :class="{'active':item.name == ruleRadio}" :key="index" @click="selectRule(index)">
                      <span :title="item.name">{{item.name}}</span>
                      <div class="rule-select-radio">
                        <el-radio :label="item.name">{{''}}</el-radio>
                      </div>
                    </li>
                  </template>
                </ul>
              </el-radio-group>
            </el-aside>
            <el-main :style="setStyle(ruleStyle.main)">
              <ul class="rule-content">
                <li class="flex-base">
                  <span>规则名称:</span>
                  <span>{{ruleConten.name}}</span>
                </li>
                <li class="flex-base">
                  <span>票券数量:</span>
                  <span>{{ruleConten.count}}</span>
                </li>
                <li class="flex-base" v-if="ruleConten.isShowTotalAddPrice">
                  <span>加价金额:</span>
                  <span>{{ruleConten.totalAddPrice}}元</span>
                </li>
                <li>
                  <div>可{{ruleTitle}}商品:</div>
                  <div>
                    <el-table :data="ruleConten.tableData" style="width: 100%">
                      <template v-for="(item,index) in tableConfig">
                        <el-table-column v-if="!item.hasTemplate" :key="index" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
                        <el-table-column v-if="item.hasTemplate" :key="index" :prop="item.prop" :label="item.label" :width="item.width">
                          <template slot-scope="scope">
                            <el-button type="text" style="width:auto" @click="checkRule(scope.row)">查看</el-button>
                          </template>
                        </el-table-column>
                      </template>
                    </el-table>
                    <div class="pagination">共{{ruleConten.tableData.length}}条</div>
                  </div>
                </li>
              </ul>
            </el-main>
          </el-container>
        </el-container>
        <!-- 代金券 -->
        <template v-else-if="model.type == 'voucher'">
          <el-row class="flex-base voucherRuleItem" v-for="item in voucherRule" :key="item.text">
            <span class="title" :style="{'width': itemTitle.width +'px'}">{{item.text}}:</span>
            <span class="content">{{item.value}}</span>
          </el-row>
        </template>
      </el-collapse-item>
      <el-row class="flex-base flex-center fixed-btn">
        <el-button type="primary" @click="returnPath">返回</el-button>
      </el-row>
    </el-collapse>
    <fixStepTool :stepData="stepData.stepList"></fixStepTool>
  </div>
</template>

<script>
// import config from 'frame_cpm/http/config.js';
import FixStepTool from 'ccmSrc/components/fix-step-tool/fix-step-tool';
import fixStepMixin from 'ccmSrc/mixins/marketing/fixStepTool';
export default {
  mixins: [fixStepMixin],
  components: { FixStepTool },
  data () {
    return {
      baseUrl: this.$store.state.default.apiConfig.baseURL,
      activeNames: ['baseInfo', 'commonInfo', 'ruleInfo'],
      itemTitle: {
        width: '80'
      },
      /* 固定侧边栏 */
      stepData: {
        stepEl: '.el-collapse-item',
        stepList: [
          {
            name: '票劵基本资料',
            isactive: false
          },
          {
            name: '票券消费规则',
            isactive: false
          }
        ]
      },
      config: [{
        itemName: 'baseInfo',
        title: '基本资料',
        content: [{
          title: '票券名称',
          prop: 'name',
          value: '',
          type: 'text',
          isShow: true
        },
        {
          title: '票券类型',
          prop: 'couponType',
          value: '',
          options: {
            0: '兑换券',
            1: '代金券',
            2: '优惠券'
          },
          type: 'text',
          isShow: true
        },
        {
          title: '票券分类',
          prop: 'couponTypeName',
          value: '',
          type: 'text',
          isShow: true
        },
        {
          title: '票券数量',
          prop: 'couponCount',
          value: '',
          type: 'text',
          isShow: true
        },
        {
          title: '销售单价',
          prop: 'couponPrice',
          value: '',
          univalent: '元',
          type: 'text',
          isShow: true
        },
        {
          title: '起售数量',
          prop: 'startSaleNum',
          value: '',
          type: 'text',
          isShow: true
        },
        {
          title: '销售方式',
          prop: 'salesMode',
          value: '',
          options: {
            1: '影院零售',
            2: '营销活动',
            3: '大客户',
            4: '第三方合作'
          },
          type: 'text',
          isShow: true
        },
        {
          title: '客商名称',
          prop: 'custName',
          value: '',
          type: 'text',
          isShow: true
        },
        {
          title: '票券编号',
          prop: 'applyCode',
          value: '查看编号',
          type: 'button',
          buttonType: 'text',
          clickFn: 'alertWindow',
          clickFnParam: {
            src: '/coupon/couponSales/searchNumber',
            param: {
            }
          },
          isShow: true
        },
        {
          title: '票券验证结果',
          prop: 'exlFilePath',
          value: '查看验证结果',
          type: 'button',
          buttonType: 'text',
          clickFn: 'searchAttachFileName',
          clickFnParam: {
            src: ''
          },
          isShow: false
        },
        {
          title: '合同协议号',
          prop: 'contractCode',
          value: '',
          type: 'text',
          isShow: false
        },
        {
          title: '合同附件',
          prop: 'attachFileName',
          value: '查看附件',
          type: 'button',
          buttonType: 'text',
          clickFn: 'searchAttachFileName',
          isShow: false,
          clickFnParam: {
            src: ''
          },
          isShow: false
        },
        {
          title: '入账影院',
          prop: 'incomeCinemaName',
          value: '',
          type: 'text',
          isShow: true
        },
        {
          title: '备注',
          prop: 'remark',
          value: '',
          type: 'text',
          isShow: true
        }
        ]
      },
      {
        itemName: 'commonInfo',
        title: '票券消费规则',
        content: [{
          title: '有效期',
          value: '',
          type: 'text',
          prop: 'holiday',
          isShow: true
        },
        {
          title: '排除日期',
          value: '',
          type: 'text',
          prop: 'appointInvalidDate',
          isShow: true
        },
        {
          title: '星期范围',
          value: '',
          type: 'text',
          prop: 'validWeek',
          isShow: true
        },
        {
          title: '时段范围',
          value: '',
          type: 'text',
          prop: 'validTime',
          isShow: true
        },
        {
          title: '影院范围',
          value: '',
          type: 'text',
          prop: 'cinemaCode',
          isShow: true
        },
        {
          title: '交易渠道',
          value: '',
          type: 'text',
          prop: 'consumeWayCode',
          isShow: true
        },
        {
          title: '会员等级',
          value: '',
          type: 'text',
          prop: 'customerLevelCode',
          isShow: true
        },
        {
          title: '会员卡政策',
          value: '',
          type: 'text',
          prop: 'cardRightCode',
          isShow: true
        },
        {
          title: '会员生日',
          value: '',
          type: 'text',
          prop: 'birthday',
          isShow: true
        }
        ]
      }
      ],
      /* 兑换规则布局配置 */
      ruleStyle: {
        mainContent: {
          margin: {
            left: '34px'
          }
        },
        header: {
          width: '967px',
          height: '32px',
          background: '#F2F4FD',
          border: ''
        },
        _main: {
          width: '967px',
          border: '1px solid #BCBCBC'
        },
        main: {
          width: '776px',
          height: '546px'
        },
        aside: {
          width: '192px',
          height: '546px',
          background: 'unset',
          border: {
            right: '1px solid #BCBCBC'
          }
        }

      },
      ruleTitle: '',
      /* 兑换规则,展示哪个 */
      ruleRadio: '',
      /* 兑换规则 */
      rule: [],
      /* 兑换规则详情 */
      ruleConten: {},
      /* 表格设置 */
      tableConfig: [],
      /* 表格设置选项 */
      tableConfigOptions: {
        exchange: [{
          prop: 'counponType',
          label: '类型',
          width: ''
        }, {
          prop: 'counponTypeCode',
          label: '商品类别',
          width: ''
        }, {
          prop: 'counponName',
          label: '商品名称',
          width: ''
        }, {
          prop: 'count',
          label: '数量',
          width: ''
        },
        {
          label: '操作',
          width: '',
          hasTemplate: true,
          fixed: true
        }
        ],
        favorable: [{
          prop: 'counponType',
          label: '类型',
          width: ''
        }, {
          prop: 'counponTypeCode',
          label: '商品类别',
          width: ''
        }, {
          prop: 'counponName',
          label: '商品名称',
          width: ''
        }, {
          prop: 'count',
          label: '数量',
          width: ''
        },
        {
          prop: 'priceModifyMethod',
          label: '优惠方式',
          width: ''
        },
        {
          label: '操作',
          width: '',
          hasTemplate: true,
          fixed: true
        }
        ]
      },
      // 用于查看ruleItem
      enterQuery: {},
      model: {
        type: ''
      },
      // 代金规则
      voucherRule: []
    };
  },
  created () {
    let query = this.$route.query;
    this.enterQuery = query;
    this.search(query.applyCode);

    // let baseInfoArr = this.unpackParams(data);
  },
  methods: {
    /**
     * @function search - 查询
     */
    search (applyCode) {
      let params = {
        applyCode
      };
      this.$ccmList.checkSaleList(params).then(data => {
        if (data.flag == 1) {
          this.unpackParams(data.data);
        }
      }).catch(msg => {
        console.log(msg);
      });
    },
    /**
     * @function alertWindow - 弹窗
     * @param {Object} config - 弹窗配置
     * @param {String} config.src - 弹窗地址
     * @param {Object} config.param - 弹窗参数
     */
    alertWindow (config) {
      let applyCode = this.enterQuery.applyCode;
      // console.log(applyCode)
      this.$router.push({ path: config.src, query: { applyCode } });
    },
    /**
     * @function searchAttachFileName - 查看合同附件  -下载
     */
    searchAttachFileName (file) {
      let url = this.baseUrl + file.src;
      console.log(url);
      let headers = {};
      if (this.$store.state.CpmUserKey) {
        headers['Cpm-User-Token'] = this.$store.state.CpmUserKey;
      }
      if (sessionStorage.getItem('token')) {
        headers['Cpm-User-Token'] = sessionStorage.getItem('token');
      }
      axios(url, {
        headers,
        method: 'post',
        responseType: 'blob'
      }).then(data => {
        let flag = data.headers.flag;
        let message = '下载模板错误，请稍后再试！';
        let type = 'warning';

        if (flag == '1') {
          type = 'success';
          message = '下载成功';
        }

        this.$message({
          type,
          message
        });
        const blob = new Blob([data.data]);
        const fileName = data.headers.filename;
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      });
    },
    /**
     * @function emiteFn - 事件分发
     * @param {String} fn - 方法名
     * @param {Object} param - 需要传递给方法的参数
     */
    emiteFn (fn, param) {
      this[`${fn}`](param);
    },
    /**
     * @function setStyle - 设置样式
     */
    setStyle (config) {
      let keyArray = Object.keys(config);
      let styleString = new String();
      for (let i = 0; i < keyArray.length; i++) {
        let i_key = keyArray[i];
        let i_val = config[`${i_key}`];
        if (typeof i_val === 'object') {
          let itmeArray = Object.keys(i_val);
          for (let j = 0; j < itmeArray.length; j++) {
            let j_key = itmeArray[j];
            let j_val = i_val[`${j_key}`];
            styleString += `${i_key}-${j_key}:${j_val};`;
          }
        } else {
          styleString += `${i_key}:${i_val};`;
        }
      }
      return styleString;
    },
    /**
     * @function selectRule - 选择子规则
     */
    selectRule (index) {
      this.ruleRadio = this.rule[index].name;
      this.ruleConten = this.rule[index];
    },
    /**
     * @function unpackParams - 拆解数据用于显示
     */
    unpackParams (param) {
      // 规则组
      let ruleGroup = JSON.parse(param.simpleRuleGroupStr);
      let rules = ruleGroup.rules;

      // baseInfo
      let baseInfoArr = this.config[0].content;
      baseInfoArr.forEach((item, index) => {
        let key = item.prop;
        let val = param[`${key}`];
        let options = item.options;
        if (options) {
          val = options[`${val}`];
        }
        if (key == 'name' || key == 'remark') {
          item.value = ruleGroup[`${key}`];
        } else if (key == 'applyCode') {
          item.clickFnParam.param = {
            applyCode: val
          };
        } else {
          if (key == 'couponType') {
            switch (val) {
              case '兑换券':
                this.tableConfig = this.tableConfigOptions[`exchange`];
                this.model.type = 'exchange';
                break;
              case '代金券':
                this.model.type = 'voucher';
                break;
              case '优惠券':
                this.tableConfig = this.tableConfigOptions[`favorable`];
                this.model.type = 'favorable';
                break;
            }
            this.ruleTitle = val.substring(0, 2);
            this.stepData.stepList.push({
              name: this.ruleTitle + '规则',
              isactive: false
            });
          }
          item.value = val;
        }
        // 合同号
        if (key == 'contractCode' && val) {
          item.isShow = true;
        }
        // 合同文件
        if (key == 'attachFileName' && val) {
          item.isShow = true;
          item.clickFnParam.src = val;
          item.value = '查看附件';
        }
        // 查看验证结果
        if (key == 'exlFilePath' && val) {
          console.log('数据：-------', param);
          item.clickFnParam.src = val;
          item.value = '查看验证结果';
          if (param.state == 8) {
            item.isShow = true;
          }
        }
      });

      // commonInfo
      this.unpackCommonInfo(ruleGroup, param);

      // 子规则
      let modelType = this.model.type;
      if (modelType == 'exchange' || modelType == 'favorable') {
        this.unpackRules(rules);
      } else {
        this.voucherRule = this.unpackVoucherRule(param);
      }
    },
    /**
     * @function unpackCommonInfo - 拆解commonInfo
     */
    unpackCommonInfo (ruleGroup, param) {
      console.log('拆解数据-------', ruleGroup, param);
      let commonInfo = ruleGroup.commonInfo;
      let commonInfoObj = {};
      commonInfo.forEach((item, index) => {
        let key = item.key;
        if (!commonInfoObj[`${key}`]) {
          commonInfoObj[`${key}`] = item;
        }
      });

      let commonInfoArr = this.config[1].content;
      console.log('票券消费规则组', commonInfoArr);
      // 有效期
      if (param.validType == 0) {
        commonInfoArr[0].value = `${ruleGroup.validDateStart} 至 ${ruleGroup.validDateEnd}`;
      } else if (param.validType == 1) {
        if (param.validGenType == 1) {
          commonInfoArr[0].value = `${param.validGenValue}日`;
        } else if (param.validGenType == 2) {
          commonInfoArr[0].value = `${param.validGenValue}个月`;
        } else if (param.validGenType == 3) {
          commonInfoArr[0].value = `${param.validGenValue}年`;
        }
      }

      // 节假日排除与否 指定排除日期
      let holidayArr = [];
      let holidayVal = commonInfoObj[`holiday`];
      if (holidayVal) {
        holidayArr.push('节假日排除');
      }
      let appointInvalidDateVal = commonInfoObj[`appointInvalidDate`];
      if (appointInvalidDateVal) {
        let timeArr = JSON.parse(appointInvalidDateVal.value);
        let timeStr = `指定排除日期为：`;
        timeArr.forEach((item, index) => {
          timeStr += `${item[0]}至${item[1]}`;
          if (index != timeArr.length - 1) {
            timeStr += `, `;
          }
        });
        holidayArr.push(timeStr);
      }
      if (holidayArr.length != 0) {
        commonInfoArr[1].value = holidayArr.join(',');
      } else {
        commonInfoArr[1].value = '无';
      }

      // 星期范围
      let validWeekVal = commonInfoObj[`validWeek`];
      let validWeekValue = '每天';
      if (validWeekVal) {
        let opUniqueName = validWeekVal.opUniqueName;
        let keysObj = {
          WeekDateOperator: '周一至周五',
          WeekDateRangeOperator: '指定范围：'
        };
        validWeekValue = keysObj[`${opUniqueName}`];
        if (opUniqueName == 'WeekDateRangeOperator') {
          let daysKey = {
            1: '周一',
            2: '周二',
            3: '周三',
            4: '周四',
            5: '周五',
            6: '周六',
            7: '周日'
          };
          let weekArr = validWeekVal.value.split(',');
          weekArr.forEach((item, index) => {
            validWeekValue += daysKey[`${item}`];
            if (index != weekArr.length - 1) {
              validWeekValue += ', ';
            }
          });
        }
      }
      commonInfoArr[2].value = validWeekValue;

      // 时段范围
      let validTimeVal = commonInfoObj[`validTime`];
      let validTimeValue = '全天';
      if (validTimeVal) {
        let opUniqueName = validTimeVal.opUniqueName;
        let keysObj = {
          MorningOperator: '上午（09:00—12:59）',
          AfternoonOperator: '下午（13:00—16:59）',
          NightOperator: '晚上（17:00—02:00）',
          TimeRangeContainOperator: '指定时段范围：'
        };
        validTimeValue = keysObj[`${opUniqueName}`];
        if (opUniqueName == 'TimeRangeContainOperator') {
          let timeArr = JSON.parse(validTimeVal.value);
          timeArr.forEach((item, index) => {
            validTimeValue += `${item[0]}至${item[1]}`;
            if (index != timeArr.length - 1) {
              validTimeValue += ', ';
            }
          });
        }
      }
      commonInfoArr[3].value = validTimeValue;

      // 影院范围
      let cinemaCodeVal = commonInfoObj[`cinemaCode`];
      let cinemaCodeValue = '不限';
      if (cinemaCodeVal) {
        let opUniqueName = cinemaCodeVal.opUniqueName;
        let keysObj = {
          normalEqual: '等于：',
          normalIn: '包含：'
        };
        cinemaCodeValue = `${keysObj[`${opUniqueName}`]}${cinemaCodeVal.text}`;
      };
      commonInfoArr[4].value = cinemaCodeValue;

      // 消费渠道
      let consumeWayCodeVal = commonInfoObj[`consumeWayCode`];
      let consumeWayCodeValue = '不限';
      if (consumeWayCodeVal) {
        console.log('交易渠道', consumeWayCodeVal);
        // let keysObj = {
        //     0: "柜台",
        //     1: "自助终端",
        //     2: "官方网站",
        //     3: "手机及微信",
        //     4: "电话",
        //     T: "第三方渠道"
        // };
        // let waysArr = consumeWayCodeVal.value.split(',');
        // consumeWayCodeValue = '';
        // waysArr.forEach((item, index) => {
        //     consumeWayCodeValue += `${keysObj[`${item}`]}`;
        //     if (index != waysArr.length - 1) {
        //         consumeWayCodeValue += ', ';
        //     }
        // })
        consumeWayCodeValue = consumeWayCodeVal.text;
      }
      commonInfoArr[5].value = consumeWayCodeValue;

      let keysObj = {
        normalIn: '包含：',
        normalNotIn: '不包含：',
        AllMember: '全部政策：',
        not_memberOperator: '非会员:'
      };
      // 会员等级
      let consumerTypeKeyVal = commonInfoObj[`customerLevelCode`];
      let consumerTypeKeyValue = '不限';
      if (consumerTypeKeyVal) {
        let opUniqueName = consumerTypeKeyVal.opUniqueName;

        consumerTypeKeyValue = keysObj[`${opUniqueName}`];
        if (opUniqueName == 'normalIn' || opUniqueName == 'normalNotIn') {
          consumerTypeKeyValue += consumerTypeKeyVal.text;
        }
      }
      commonInfoArr[6].value = consumerTypeKeyValue;
      // 会员卡政策
      let cardRightCodeVal = commonInfoObj[`cardRightCode`];
      let cardRightCodeValue = '不限';
      if (cardRightCodeVal) {
        let opUniqueName = cardRightCodeVal.opUniqueName;

        cardRightCodeValue = keysObj[`${opUniqueName}`];
        if (opUniqueName == 'normalIn' || opUniqueName == 'normalNotIn') {
          cardRightCodeValue += cardRightCodeVal.text;
        }
      }
      commonInfoArr[7].value = cardRightCodeValue;

      // 会员生日
      let birthdayVal = commonInfoObj[`birthday`];
      let birthdayValue = '不限';
      if (birthdayVal) {
        let opUniqueName = birthdayVal.opUniqueName;
        let keysObj = {
          EqualCurrentDay: '生日当天',
          EqualCurrentMoney: '生日当月',
          EqualCurrentDayOffset: '生日前后N日'
        };
        birthdayValue = keysObj[`${opUniqueName}`];
        if (opUniqueName == 'EqualCurrentDayOffset') {
          birthdayValue = birthdayValue.replace(/\N/, birthdayVal.value);
        }
      }
      commonInfoArr[8].value = birthdayValue;
    },
    /**
     * @function unpackRules - 拆解子规则
     */
    unpackRules (rules) {
      let ruleArr = [];
      rules.forEach((item, index) => {
        let name = item.name,
          count = item.bizPropertyMap ? item.bizPropertyMap.couponAmount : '',
          isShowTotalAddPrice = this.model.type == 'exchange',
          totalAddPrice = isShowTotalAddPrice ? item.bizPropertyMap.totalAddPrice : null,
          actions = item.actions,
          ruleConditions = item.ruleConditions;

        let obj = {
          name,
          count,
          isShowTotalAddPrice,
          totalAddPrice,
          actions,
          ruleConditions,
          tableData: []
        };

        // 根据familyId组装数组
        let familyIdKeys = {};

        actions.forEach((item, index) => {
          let key = item.familyId;
          if (!familyIdKeys[`${key}`]) {
            familyIdKeys[`${key}`] = {
              actions: [],
              ruleConditions: []
            };
          }

          if (familyIdKeys[`${key}`]) {
            familyIdKeys[`${key}`].actions.push(item);
          }
        });

        ruleConditions.forEach((item, index) => {
          let key = item.familyId;
          if (!familyIdKeys[`${key}`]) {
            familyIdKeys[`${key}`] = {
              actions: [],
              ruleConditions: []
            };
          }

          if (familyIdKeys[`${key}`]) {
            familyIdKeys[`${key}`].ruleConditions.push(item);
          }
        });

        let familyIdKeyArr = Object.keys(familyIdKeys);
        familyIdKeyArr.forEach(item => {
          let itemObj = familyIdKeys[`${item}`],
            ruleConditions = itemObj[`ruleConditions`],
            actions = itemObj[`actions`];

          let ruleConditionsObj = {},
            actionsObj = {};

          ruleConditions.forEach((item, index) => {
            if (!ruleConditionsObj[`${item.key}`]) {
              ruleConditionsObj[`${item.key}`] = item;
            }
          });

          actions.forEach((item, index) => {
            if (!actionsObj[`${item.key}`]) {
              actionsObj[`${item.key}`] = item;
            }
          });

          // 根据ruleConditions最后一项判断是影票还是卖品
          let counponType = ruleConditions[0].value == 0;

          let counponTypeCode = '不限',
            counponName = '不限';

          // 卖品
          if (!counponType) {
            // 商品名称
            let merKeyVal = ruleConditionsObj[`merKey`];
            if (merKeyVal) {
              counponName = merKeyVal.text;
            }

            // 商品类别
            let classCodeVal = ruleConditionsObj[`classCode`];
            if (classCodeVal) {
              counponTypeCode = classCodeVal.text;
            }
          }

          let tableItem = {
            counponType: counponType ? '影票' : '卖品',
            counponTypeCode,
            counponName,
            actions,
            ruleConditions
          };
          console.log('actionsObj', actionsObj);
          // 优惠
          if (!isShowTotalAddPrice) {
            tableItem[`count`] = actionsObj[`amount`] ? actionsObj[`amount`].value : '不限';

            // 优惠方式
            let priceModifyMethodVal = actionsObj[`priceModifyMethod`].value,
              priceModifyMethod,
              unitType = '';
            switch (priceModifyMethodVal) {
              case 'lowest_price':
                priceModifyMethod = '影片最低发行价';
                break;
              case 'fix_price':
                priceModifyMethod = '固定金额';
                unitType = '元';
                break;
              case 'subPrice':
                priceModifyMethod = '扣减金额';
                unitType = '元';
                break;
              case 'appointPercent':
                priceModifyMethod = '指定折扣';
                unitType = '%';
                break;
            }

            if (priceModifyMethodVal != 'lowest_price') {
              priceModifyMethod += actionsObj[`priceModifyValue`].value + unitType;
            }

            tableItem[`priceModifyMethod`] = priceModifyMethod;
          } else {
            tableItem[`count`] = actionsObj[`amount`].value;
          }

          obj.tableData.push(tableItem);
        });

        ruleArr.push(obj);
      });

      this.rule = ruleArr;
      // 选中第一项
      this.selectRule(0);
    },
    /**
     * @function checkRule - 查看规则
     */
    checkRule (param) {
      let conditionActions = {
        actions: param.actions,
        ruleConditions: param.ruleConditions
      };

      this.$store.commit('saleList/updateCheckRule', {
        checkRule: {
          enterQuery: this.enterQuery,
          conditionActions
        }
      });

      this.$router.push({
        path: 'checkRuleItem',
        query: {
          type: this.model.type,
          ticketType: param.counponType == '影票' ? 'films' : 'goods',
          path: 'checkSaleList'
        }
      });
    },
    /**
     * @function unpackVoucherRule - 拆解代金券规则
     */
    unpackVoucherRule (param) {
      let ruleGroup = JSON.parse(param.simpleRuleGroupStr);
      let keysObj = this.unpackToObj(ruleGroup.rules[0].actions, ruleGroup.rules[0].ruleConditions);
      let actions = keysObj.actions,
        ruleConditions = keysObj.ruleConditions;

      let voucherRuleArr = [];

      // 代金券面值
      let cashValue = actions[`cashValue`];
      if (cashValue) {
        voucherRuleArr.push({
          text: '代金券面值(抵用金额)',
          value: cashValue.value + '元'
        });
      }

      // 代金券是否需要密码
      let voucher_is_password = param[`voucherIsPassword`];
      let isPassword = '不需要';
      if (voucher_is_password == '2') {
        // 代金券消费密码类型
        let voucher_password_type = param[`voucherPasswordType`];
        if (voucher_password_type == '1') {
          isPassword = `随机密码`;
        } else {
          isPassword = `统一密码：${param[`voucherPassword`]}`;
        }
      }
      voucherRuleArr.push({
        text: '代金券是否需要密码',
        value: isPassword
      });

      // 允许购买范围
      let saleItemType = ruleConditions[`saleItemType`];
      let saleItemTypeVal = '不限';
      if (saleItemType) {
        saleItemTypeVal = saleItemType.value == '0' ? '影票' : '卖品';
      }
      voucherRuleArr.push({
        text: '允许购买范围',
        value: saleItemTypeVal
      });

      // 每笔消费金额不小于
      let sumPrice = ruleConditions[`sumPrice`];
      if (sumPrice) {
        voucherRuleArr.push({
          text: '每笔消费不低于',
          value: sumPrice.value + '元'
        });
      }

      return voucherRuleArr;
    },
    /**
     * @function unpackToObj - 将数组转化成key对象
     *
     * @param {Array} actions - actions数组
     * @param {Array} ruleConditions -  ruleConditions数组
     * @return {Object} - key对象
     */
    unpackToObj (actions, ruleConditions) {
      let actionsObj = {},
        ruleConditionsObj = {};

      actions.forEach(item => {
        if (!actionsObj[`${item.key}`]) {
          actionsObj[`${item.key}`] = item;
        }
      });

      ruleConditions.forEach(item => {
        let key = item.key;

        if (key == 'filmPlanInvalidTime') {
          ruleConditionsObj[`${item.opUniqueName}`] = item;
        } else if (!ruleConditionsObj[`${key}`]) {
          ruleConditionsObj[`${key}`] = item;
        }
      });

      return {
        actions: actionsObj,
        ruleConditions: ruleConditionsObj
      };
    },
    /**
     * @function returnPath - 返回上一级页面
     */
    returnPath () {
      this.$store.commit('tagNav/removeTagNav', {
        name: this.$route.name,
        path: this.$route.path,
        title: this.$route.meta.title,
        query: this.$route.query
      });
      this.$router.push({
        path: 'salesManagement'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/element-reset.scss";
@mixin font-base {
  font-family: MicrosoftYaHei;
  font-size: 12px;
  color: #666666;
  letter-spacing: 0;
}

.baseItem {
  margin-bottom: 10px;
  display: inline-flex;
  width: 35vw;
  .item-title {
    text-align: right;
    @include font-base;
  }

  .item-content {
    flex: 1;
    margin-left: 16px;
    @include font-base;
  }
}

.voucherRuleItem {
  margin-bottom: 10px;

  .title {
    text-align: right;
    @include font-base;
  }

  .content {
    margin-left: 16px;
    @include font-base;
  }
}

.rule-select-content {
  padding: 15px 7px;

  .rule-select-item {
    border: 1px solid #bcbcbc;
    border-radius: 4px;
    width: 176px;
    height: 32px;
    margin-bottom: 8px;
    cursor: pointer;
    span:nth-of-type(1) {
      font-weight: bold;
    }

    span {
      @include font-base;
      font-family: MicrosoftYaHei-Bold;
      color: #333333;
      margin-left: 15px;
      width: 135px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    .rule-select-radio {
      margin-top: 2px;
    }
  }

  .active {
    border: 1px solid #3b74ff;

    span {
      color: #3b74ff;
    }
  }
}

.rule-content {
  li:nth-of-type(1) {
    padding-top: 16px;
  }
  li {
    margin: 16px 0 16px 24px;

    span {
      @include font-base;
      color: #666666;
    }

    span:nth-last-of-type(1) {
      margin-left: 28px;
    }
  }

  li:nth-of-type(1) {
    margin-top: unset;
  }

  li:nth-last-type(1) {
  }
}

.pagination {
  margin-left: 8px;
  @include font-base;
  color: #666666;
}
.fixed-btn {
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
}

/deep/ .textBtn {
  padding: 0;
  width: auto;
  height: auto;
}
</style>
