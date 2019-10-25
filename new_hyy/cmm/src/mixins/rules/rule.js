export default {
  data () {
    return {
      // 自定义营销活动分组执行活动验证
      basicDataRule: {
        // 子活动名称
        activityName: [
          {
            required: true,
            message: '分组活动名称不能为空',
            trigger: 'blur'
          }
        ],
        // --------------子活动条件活动start-----------------
        // --------------子活动条件活动-会员类--------------
        // 生日
        'birthday7.opUniqueName': [
          {
            required: true,
            message: '请选择生日',
            trigger: 'change'
          }
        ],
        'birthday7.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('生日不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 性别
        'sex8.opUniqueName': [
          {
            required: true,
            message: '请选择性别',
            trigger: 'change'
          }
        ],
        sexState: [
          {
            required: true,
            message: '性别不能为空',
            trigger: 'change'
          }
        ],
        // 年龄
        'age9.opUniqueName': [
          {
            required: true,
            message: '请选择年龄',
            trigger: 'change'
          }
        ],
        'age9.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('年龄不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 开卡月限
        'openMonths87.opUniqueName': [
          {
            required: true,
            message: '请选择开卡月限',
            trigger: 'change'
          }
        ],
        'openMonths87.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('开卡月限不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0 || value > 12) {
                return callback(new TypeError('请输入1-12正整数'));
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 开卡年限
        'openYears11.opUniqueName': [
          {
            required: true,
            message: '请选择开卡年限',
            trigger: 'change'
          }
        ],
        'openYears11.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('开卡年限不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 开卡日期
        'openDate12.opUniqueName': [
          {
            required: true,
            message: '请选择开卡日期',
            trigger: 'change'
          }
        ],
        'openDate12.value': [
          {
            required: true,
            message: '开卡日期不能为空',
            trigger: 'blur'
          }
        ],
        // 注册影院
        'registerBusinessCode13.opUniqueName': [
          {
            required: true,
            message: '请选择注册影院',
            trigger: 'change'
          }
        ],
        'registerBusinessCode13.text': [
          {
            required: true,
            message: '注册影院不能为空',
            trigger: 'change'
          }
        ],
        // 账户余额
        'balance3.opUniqueName': [
          {
            required: true,
            message: '请选择账户余额',
            trigger: 'change'
          }
        ],
        'balance3.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('账户余额不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 积分余额
        'integral4.opUniqueName': [
          {
            required: true,
            message: '请选择积分余额',
            trigger: 'change'
          }
        ],
        'integral4.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('积分余额不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 累计积分
        'integralTotall52.opUniqueName': [
          {
            required: true,
            message: '请选择累计积分',
            trigger: 'change'
          }
        ],
        'integralTotall52.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('累计积分不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 单次消费金额
        'sumPrice2.opUniqueName': [
          {
            required: true,
            message: '请选择单次消费金额',
            trigger: 'change'
          }
        ],
        'sumPrice2.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('单次消费金额不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 累计消费金额
        'consumeSum6.opUniqueName': [
          {
            required: true,
            message: '请选择累计消费金额',
            trigger: 'change'
          }
        ],
        'consumeSum6.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('累计消费金额不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 会员等级
        'customerLevelCode101.opUniqueName': [
          {
            required: true,
            message: '请选择会员等级',
            trigger: 'change'
          }
        ],
        'customerLevelCode101.text': [
          {
            required: true,
            message: '会员等级不能为空',
            trigger: 'change'
          }
        ],
        // 会员卡政策
        'cardRightCode100.opUniqueName': [
          {
            required: true,
            message: '请选择会员卡政策',
            trigger: 'change'
          }
        ],
        'cardRightCode100.text': [
          {
            required: true,
            message: '会员卡政策不能为空',
            trigger: 'change'
          }
        ],
        // 会员卡类型
        'cardTypeKey10.opUniqueName': [
          {
            required: true,
            message: '请选择会员卡类型',
            trigger: 'change'
          }
        ],
        'cardTypeKey10.text': [
          {
            required: true,
            message: '会员卡类型不能为空',
            trigger: 'blur'
          }
        ],
        // 首充金额
        'firstRecharge98.opUniqueName': [
          {
            required: true,
            message: '请选择首充金额',
            trigger: 'change'
          }
        ],
        'firstRecharge98.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('首充金额不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 单次充值金额
        'sumPrice1.opUniqueName': [
          {
            required: true,
            message: '请选择单次充值金额',
            trigger: 'change'
          }
        ],
        'sumPrice1.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('单次充值金额不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 累计充值金额
        'chargeSum50.opUniqueName': [
          {
            required: true,
            message: '请选择累计充值金额',
            trigger: 'change'
          }
        ],
        'chargeSum50.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('累计充值金额不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 商品类型-已弃用
        'cycleConsumeNum.saleItemType17.opUniqueName': [
          {
            required: true,
            message: '请选择商品类型',
            trigger: 'change'
          }
        ],
        goodsItemTypeState: [
          {
            required: true,
            message: '商品类型不能为空',
            trigger: 'change'
          }
        ],
        // 交易渠道-已弃用
        'consumeNum.consumeWayCode15.opUniqueName': [
          {
            required: true,
            message: '请选择交易渠道',
            trigger: 'change'
          }
        ],
        consumeWayState: [
          {
            required: true,
            message: '交易渠道不能为空',
            trigger: 'change'
          }
        ],
        // 动态周期消费次数-已弃用
        // 动态周期消费次数-动态周期
        'consumeNum.dynamicPeriod15.value': [
          {
            required: true,
            message: '动态周期不能为空',
            trigger: 'change'
          }
        ],
        // 动态周期消费次数-指定周期
        // ---------无----------
        // 动态周期消费次数-消费次数
        'consumeNum.dynamicConsumeCount15.value': [
          {
            required: true,
            message: '消费次数不能为空',
            trigger: 'change'
          }
        ],
        // 动态周期消费额-已弃用
        // 动态周期消费额-动态周期
        'cycleConsumeNum.dynamicPeriod17.value': [
          {
            required: true,
            message: '动态周期不能为空',
            trigger: 'change'
          }
        ],
        // 动态周期消费额-指定周期
        // ---------无----------
        // 动态周期消费额-消费次数
        'cycleConsumeNum.dynamicConsumeSum17.value': [
          {
            required: true,
            message: '消费次数不能为空',
            trigger: 'change'
          }
        ],
        // ----------子活动条件活动-影票类------------
        // 影片
        'uniformCode79.opUniqueName': [
          {
            required: true,
            message: '请选择影片',
            trigger: 'change'
          }
        ],
        'uniformCode79.text': [
          {
            required: true,
            message: '影片不能为空',
            trigger: 'change'
          }
        ],
        // 影片类型
        'filmTypeKey34.opUniqueName': [
          {
            required: true,
            message: '请选择影片类型',
            trigger: 'change'
          }
        ],
        'filmTypeKey34.text': [
          {
            required: true,
            message: '影片类型不能为空',
            trigger: 'change'
          }
        ],
        // 影厅类型
        'hallTypeKey36.opUniqueName': [
          {
            required: true,
            message: '请选择影厅类型',
            trigger: 'change'
          }
        ],
        'hallTypeKey36.text': [
          {
            required: true,
            message: '影厅类型不能为空',
            trigger: 'change'
          }
        ],
        // 放映效果
        'showEffect35.opUniqueName': [
          {
            required: true,
            message: '请选择放映效果',
            trigger: 'change'
          }
        ],
        'showEffect35.text': [
          {
            required: true,
            message: '放映效果不能为空',
            trigger: 'change'
          }
        ],
        // 座位等级
        seatLevelState: [
          {
            required: true,
            message: '请选择座位等级',
            trigger: 'change'
          }
        ],
        // 放映厅座位数
        'hallSeatAmout37.opUniqueName': [
          {
            required: true,
            message: '请选择放映厅座位数',
            trigger: 'change'
          }
        ],
        'hallSeatAmout37.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('放映厅座位数不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 最低发行价
        'lowestPrice38.opUniqueName': [
          {
            required: true,
            message: '请选择最低发行价',
            trigger: 'change'
          }
        ],
        'lowestPrice38.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('最低发行价不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 放映有效期
        'planStartTime81.opUniqueName': [
          {
            required: true,
            message: '请选择放映有效期',
            trigger: 'change'
          }
        ],
        'planStartTime81.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('指定日不能为空'));
              }
              // 把中文逗号替换成英文逗号
              value = value.replace(/，/gi, ',');
              value = value.split(',');
              if (new Set(value).size != value.length) {
                return callback(new Error('指定日不能重复'));
              }
              let regExp = /^\+?[1-9][0-9]*$/;
              for (let item of value) {
                if (!regExp.test(item)) {
                  return callback(
                    new Error('日期用逗号分隔，如"1,10,22",某个值只能1到31')
                  );
                } else if (item > 31) {
                  return callback(
                    new Error('日期用逗号分隔，如"1,10,22",某个值只能1到31')
                  );
                }
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        screeningValidityOption: [
          {
            required: true,
            message: '放映有效期不能为空',
            trigger: 'change'
          }
        ],
        // 放映星期范围
        'filmPlanWeekRange83.opUniqueName': [
          {
            required: true,
            message: '请选择放映星期范围',
            trigger: 'change'
          }
        ],
        weekRangeState: [
          {
            required: true,
            message: '放映星期范围不能为空',
            trigger: 'change'
          }
        ],
        // 放映排除日期
        // -----------无---------
        // 放映时段范围
        'filmPlanTimeRange84.opUniqueName': [
          {
            required: true,
            message: '请选择放映时段范围',
            trigger: 'change'
          }
        ],
        // --------------子活动条件活动-卖品类--------------
        // 品牌
        'brandId40.opUniqueName': [
          {
            required: true,
            message: '请选择品牌',
            trigger: 'change'
          }
        ],
        'brandId40.text': [
          {
            required: true,
            message: '品牌不能为空',
            trigger: 'change'
          }
        ],
        // 类别
        'classCode41.opUniqueName': [
          {
            required: true,
            message: '请选择类别',
            trigger: 'change'
          }
        ],
        'classCode41.text': [
          {
            required: true,
            message: '类别不能为空',
            trigger: 'change'
          }
        ],
        // 商品名称
        'merKey46.opUniqueName': [
          {
            required: true,
            message: '请选择商品名称',
            trigger: 'change'
          }
        ],
        'merKey46.text': [
          {
            required: true,
            message: '商品名称不能为空',
            trigger: 'change'
          }
        ],
        // --------------子活动条件活动-交易类--------------
        // 交易影院行政区域
        'cinemaAreaId25.opUniqueName': [
          {
            required: true,
            message: '请选择交易影院行政区域',
            trigger: 'change'
          }
        ],
        'cinemaAreaId25.text': [
          {
            required: true,
            message: '交易影院行政区域不能为空',
            trigger: 'change'
          }
        ],
        // 商品单价
        'price31.opUniqueName': [
          {
            required: true,
            message: '请选择商品单价',
            trigger: 'change'
          }
        ],
        'price31.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('商品单价不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 影票单价
        'filmPrice92.opUniqueName': [
          {
            required: true,
            message: '请选择影票单价',
            trigger: 'change'
          }
        ],
        'filmPrice92.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('影票单价不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 卖品单价
        'merPrice93.opUniqueName': [
          {
            required: true,
            message: '请选择卖品单价',
            trigger: 'change'
          }
        ],
        'merPrice93.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('卖品单价不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 影票商品数量
        'filmTicketAmount80.opUniqueName': [
          {
            required: true,
            message: '请选择影票商品数量',
            trigger: 'change'
          }
        ],
        'filmTicketAmount80.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('影票商品数量不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 影票总金额
        'filmSumPrice90.opUniqueName': [
          {
            required: true,
            message: '请选择影票总金额',
            trigger: 'change'
          }
        ],
        'filmSumPrice90.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('影票总金额不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 卖品总金额
        'merSumPrice91.opUniqueName': [
          {
            required: true,
            message: '请选择卖品总金额',
            trigger: 'change'
          }
        ],
        'merSumPrice91.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('卖品总金额不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 整单交易金额
        'sumPrice26.opUniqueName': [
          {
            required: true,
            message: '请选择整单交易金额',
            trigger: 'change'
          }
        ],
        'sumPrice26.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('整单交易金额不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 指定商品购买数量
        // 指定商品购买数量-商品名称
        // "buyNum.merKey21.opUniqueName": [{
        //     required: true,
        //     message: "请选择商品名称",
        //     trigger: "change"
        // }],
        'buyNum.merKey21.text': [
          {
            required: true,
            message: '商品名称不能为空',
            trigger: 'change'
          }
        ],
        // 指定商品购买数量-数量
        'buyNum.amount21.opUniqueName': [
          {
            required: true,
            message: '请选择数量',
            trigger: 'change'
          }
        ],
        'buyNum.amount21.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('数量不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          },
          {
            validator (rule, value, callback) {
              if (/(^[1-9]\d*$)/.test(value)) {
                callback();
              } else {
                callback(new Error('请输入正整数'));
              }
            },
            trigger: 'blur'
          }
        ],
        // 同类商品累计购买数量
        // 同类商品累计购买数量-商品类别
        // "buyNumByType.classCode28.opUniqueName": [{
        //     required: true,
        //     message: "请选择商品类别",
        //     trigger: "change"
        // }],
        'buyNumByType.classCode28.text': [
          {
            required: true,
            message: '商品类别不能为空',
            trigger: 'change'
          }
        ],
        // 同类商品累计购买数量-累计购买数量
        'buyNumByType.sumAmount28.opUniqueName': [
          {
            required: true,
            message: '请选择累计购买数量',
            trigger: 'change'
          }
        ],
        'buyNumByType.sumAmount28.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('累计购买数量不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 同品牌商品累计购买数量
        // 同品牌商品累计购买数量-商品类别
        // "buyNumByBrand.brandId29.opUniqueName":[{
        //     required: true,
        //     message: "请选择商品类别",
        //     trigger: "change"
        // }],
        'buyNumByBrand.brandId29.text': [
          {
            required: true,
            message: '商品类别不能为空',
            trigger: 'change'
          }
        ],
        // 同品牌商品累计购买数量-累计购买数量
        'buyNumByBrand.sumAmount29.opUniqueName': [
          {
            required: true,
            message: '请选择累计购买数量',
            trigger: 'change'
          }
        ],
        'buyNumByBrand.sumAmount29.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('累计购买数量不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 支付方式（柜台用）
        'payTypeCode86.opUniqueName': [
          {
            required: true,
            message: '请选择支付方式',
            trigger: 'change'
          }
        ],
        'payTypeCode86.text': [
          {
            required: true,
            message: '支付方式不能为空',
            trigger: 'change'
          }
        ],
        // 放映前N天
        'filmStartDayBefore94.opUniqueName': [
          {
            required: true,
            message: '请选择放映前N天',
            trigger: 'change'
          }
        ],
        'filmStartDayBefore94.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('放映前N天不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 放映前N小时
        'filmStartHourBefore95.opUniqueName': [
          {
            required: true,
            message: '请选择放映前N小时',
            trigger: 'change'
          }
        ],
        'filmStartHourBefore95.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('放映前N小时不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 首次购票
        // ---------无----------
        // 交易客商-已弃用
        'businessCode14.opUniqueName': [
          {
            required: true,
            message: '请选择交易客商',
            trigger: 'change'
          }
        ],
        'businessCode14.text': [
          {
            required: true,
            message: '交易客商不能为空',
            trigger: 'change'
          }
        ],
        // 消费者身份-已弃用
        'consumerTypeKey27.opUniqueName': [
          {
            required: true,
            message: '请选择消费者身份',
            trigger: 'change'
          }
        ],
        'consumerTypeKey27.text': [
          {
            required: true,
            message: '消费者身份不能为空',
            trigger: 'change'
          }
        ],
        // 交易类型-已弃用
        'tradeType33.opUniqueName': [
          {
            required: true,
            message: '请选择交易类型',
            trigger: 'change'
          }
        ],
        tradeTypeState: [
          {
            required: true,
            message: '交易类型不能为空',
            trigger: 'change'
          }
        ],
        // 商品类型-已弃用
        'saleItemType100.opUniqueName': [
          {
            required: true,
            message: '请选择商品类型',
            trigger: 'change'
          }
        ],
        SaleItemTypeState: [
          {
            required: true,
            message: '商品类型不能为空',
            trigger: 'change'
          }
        ],
        // 交易渠道-已弃用
        'cycleConsumeNum.consumeWayCode17.opUniqueName': [
          {
            required: true,
            message: '请选择交易渠道',
            trigger: 'change'
          }
        ],
        cycleConsumeWayState: [
          {
            required: true,
            message: '交易渠道不能为空',
            trigger: 'change'
          }
        ],
        // --------------子活动条件活动end-----------------

        // --------------子活动执行方法start-----------------
        // --------------子活动执行方法-会员类--------------
        // 赠送积分
        'presentPoint1.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('赠送积分不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 赠送积分倍率
        'pointPersent18.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('赠送积分倍率不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 赠送会员卡储值额
        'presentMoney2.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('赠送会员卡储值额不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 赠送票券
        // 赠送票券-票券名称
        'giftTicket.couponApplyCode3.text': [
          {
            required: true,
            message: '票券名称不能为空',
            trigger: 'change'
          }
        ],
        // 赠送票券-数量
        'giftTicket.amount3.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('数量不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          },
          {
            validator (rule, value, callback) {
              if (/(^[1-9]\d*$)/.test(value)) {
                callback();
              } else {
                callback(new Error('请输入正整数'));
              }
            },
            trigger: 'blur'
          }
        ],
        // 赠送票券-是否发送短信
        'giftTicket.isSendSms3.value': [
          {
            required: true,
            message: '请选择是否发送短信',
            trigger: 'change'
          }
        ],
        // --------------子活动执行方法-影票类--------------
        // 修改单票售价
        // 修改单票售价-调价方式
        'updateTicketPrice.modifyWay15.value': [
          {
            required: true,
            message: '请选择调价方式',
            trigger: 'change'
          }
        ],
        // 修改单票售价-调整额
        'updateTicketPrice.modifyValue15.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('调整额不能为空'));
              }
              if (
                this.basicDataForm.updateTicketPrice.modifyWay15.value ==
                'discountPrice'
              ) {
                if (value == '0') {
                  return callback();
                }
                let regExp = /^(?:(?!0\d)\d{1,2}(?:\.\d{1,2})?|100(?:\.0{1,2})?)$/;
                if (!regExp.test(value)) {
                  return callback(
                    new TypeError('请输入100以内的正数,且只允许输入两位小数位')
                  );
                }
              } else if (
                this.basicDataForm.updateTicketPrice.modifyWay15.value ==
                'fixPrice'
              ) {
                let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if (!regExp.test(value) || value <= 0) {
                  return callback(
                    new TypeError('请输入正数,且只允许输入两位小数位')
                  );
                } else if (value >= 1000) {
                  return callback(new TypeError('超出范围'));
                }
              } else if (
                this.basicDataForm.updateTicketPrice.modifyWay15.value ==
                'addToLowestPrice'
              ) {
                if (value == '0') {
                  return callback();
                }
                let regExp = /(^-?[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^-?[0-9]\.[0-9]([0-9])?$)/;
                if (!regExp.test(value) || (value > 0 && value < 1.0)) {
                  return callback(new TypeError('只允许输入两位小数位'));
                } else if (value >= 1000000000 || value <= -1000000000) {
                  return callback(new TypeError('超出范围'));
                }
              } else {
                if (value == '0') {
                  return callback();
                }
                let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if (!regExp.test(value) || value < 1.0) {
                  return callback(
                    new TypeError('请输入正数,且只允许输入两位小数位')
                  );
                } else if (value >= 1000000000) {
                  return callback(new TypeError('超出范围'));
                }
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 修改单票售价-调价方式-折扣后加减N元
        'updateTicketPrice.addAmountAfterDiscount15.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (value) {
                if (!regExp.test(value) || value < 1.0) {
                  return callback(
                    new TypeError('请输入正数,且只允许输入两位小数位')
                  );
                } else if (value >= 1000000000) {
                  return callback(new TypeError('超出范围'));
                }
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 修改单票售价-积分定价（分）
        'updateTicketPrice.integralAmount15.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              let regExp = /^[1-9]\d*$/;
              if (value) {
                if (!regExp.test(value) || value == 0) {
                  return callback(new TypeError('请输入正整数'));
                } else if (value >= 1000000000) {
                  return callback(new TypeError('超出范围'));
                }
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 修改单票售价-加金额（元）
        'updateTicketPrice.integralMoney15.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (value == '0') {
                return callback();
              }
              if (value) {
                if (!regExp.test(value) || value < 1.0) {
                  return callback(
                    new TypeError('请输入正数,且只允许输入两位小数位')
                  );
                } else if (value >= 1000000000) {
                  return callback(new TypeError('超出范围'));
                }
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 修改单票售价-折后取整方式
        // ----------无------------
        // 修改单票售价-低于最低价时
        // ----------无------------
        // 修改单票售价-低于最低价时-最多补贴N元
        'updateTicketPrice.cinemaPayAmount15.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('最多补贴N元不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 修改单票售价-调价商品数量
        'updateTicketPrice.modifyAmountMethod15.value': [
          {
            required: true,
            message: '调价商品数量不能为空',
            trigger: 'change'
          }
        ],
        // 修改单票售价-数量
        'updateTicketPrice.modifyAmount15.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('数量不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          },
          {
            validator (rule, value, callback) {
              if (/(^[1-9]\d*$)/.test(value)) {
                callback();
              } else {
                callback(new Error('请输入正整数'));
              }
            },
            trigger: 'blur'
          }
        ],
        // 按座位等级修改票价
        // 按座位等级修改票价-调价方式
        'updateTicketPriceBySeatGrade.modifyWay29.value': [
          {
            required: true,
            message: '调价方式不能为空',
            trigger: 'change'
          }
        ],
        // 按座位等级修改票价-调整额
        'updateTicketPriceBySeatGrade.modifyValue29.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('调整额不能为空'));
              }
              if (
                this.basicDataForm.updateTicketPriceBySeatGrade.modifyWay29
                  .value == 'discountPrice'
              ) {
                if (value == '0') {
                  return callback();
                }
                let regExp = /^(?:(?!0\d)\d{1,2}(?:\.\d{1,2})?|100(?:\.0{1,2})?)$/;
                if (!regExp.test(value)) {
                  return callback(
                    new TypeError('请输入100以内的正数,且只允许输入两位小数位')
                  );
                }
              } else if (
                this.basicDataForm.updateTicketPriceBySeatGrade.modifyWay29
                  .value == 'fixPrice'
              ) {
                let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if (!regExp.test(value) || value <= 0) {
                  return callback(
                    new TypeError('请输入正数,且只允许输入两位小数位')
                  );
                } else if (value >= 1000) {
                  return callback(new TypeError('超出范围'));
                }
              } else if (
                this.basicDataForm.updateTicketPriceBySeatGrade.modifyWay29
                  .value == 'addToLowestPrice'
              ) {
                if (value == '0') {
                  return callback();
                }
                let regExp = /(^-?[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^-?[0-9]\.[0-9]([0-9])?$)/;
                if (!regExp.test(value) || (value > 0 && value < 1.0)) {
                  return callback(new TypeError('只允许输入两位小数位'));
                } else if (value >= 1000000000 || value <= -1000000000) {
                  return callback(new TypeError('超出范围'));
                }
              } else {
                if (value == '0') {
                  return callback();
                }
                let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if (!regExp.test(value) || value < 1.0) {
                  return callback(
                    new TypeError('请输入正数,且只允许输入两位小数位')
                  );
                } else if (value >= 1000000000) {
                  return callback(new TypeError('超出范围'));
                }
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 按座位等级修改票价-调价方式-折扣后加减N元
        'updateTicketPriceBySeatGrade.addAmountAfterDiscount29.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (value) {
                if (!regExp.test(value) || value < 1.0) {
                  return callback(
                    new TypeError('请输入正数,且只允许输入两位小数位')
                  );
                } else if (value >= 1000000000) {
                  return callback(new TypeError('超出范围'));
                }
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 按座位等级修改票价-积分定价（分）
        'updateTicketPriceBySeatGrade.integralAmount29.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              let regExp = /^[1-9]\d*$/;
              if (value) {
                if (!regExp.test(value) || value == 0) {
                  return callback(new TypeError('请输入正整数'));
                } else if (value >= 1000000000) {
                  return callback(new TypeError('超出范围'));
                }
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 按座位等级修改票价-加金额（元）
        'updateTicketPriceBySeatGrade.integralMoney29.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (value == '0') {
                return callback();
              }
              if (value) {
                if (!regExp.test(value) || value < 1.0) {
                  return callback(
                    new TypeError('请输入正数,且只允许输入两位小数位')
                  );
                } else if (value >= 1000000000) {
                  return callback(new TypeError('超出范围'));
                }
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 按座位等级修改票价-折后取整方式
        // ----------无------------
        // 按座位等级修改票价-低于最低价时
        // ----------无------------
        // 按座位等级修改票价-低于最低价时-最多补贴N元
        'updateTicketPriceBySeatGrade.cinemaPayAmount29.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('最多补贴N元不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 按座位等级修改票价-调价商品数量
        'updateTicketPriceBySeatGrade.modifyAmountMethod29.value': [
          {
            required: true,
            message: '调价商品数量不能为空',
            trigger: 'change'
          }
        ],
        // 按座位等级修改票价-数量
        'updateTicketPriceBySeatGrade.modifyAmount29.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('数量不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          },
          {
            validator (rule, value, callback) {
              if (/(^[1-9]\d*$)/.test(value)) {
                callback();
              } else {
                callback(new Error('请输入正整数'));
              }
            },
            trigger: 'blur'
          }
        ],
        // 按座位等级修改票价-座位等级
        action_seatLevel: [
          {
            required: true,
            message: '座位等级不能为空',
            trigger: 'change'
          }
        ],
        // --------------子活动执行方法-交易类--------------
        // 赠送商品
        // 赠送商品-商品
        'giftGoods.merKey11.text': [
          {
            required: true,
            message: '商品不能为空',
            trigger: 'change'
          }
        ],
        // 赠送商品-商品单价
        'giftGoods.price11.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (value == '0') {
                return callback();
              }
              if (!value) {
                return callback(new Error('商品单价不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 赠送商品-赠送数量
        'giftGoods.amount11.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('赠送数量不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          },
          {
            validator (rule, value, callback) {
              if (/(^[1-9]\d*$)/.test(value)) {
                callback();
              } else {
                callback(new Error('请输入正整数'));
              }
            },
            trigger: 'blur'
          }
        ],
        // 单品优惠价调整
        // 单品优惠价调整-商品
        'judgeDiscountPrice.merKey9.text': [
          {
            required: true,
            message: '商品不能为空',
            trigger: 'change'
          }
        ],
        // 单品优惠价调整-调价方式
        'judgeDiscountPrice.modifyWay9.value': [
          {
            required: true,
            message: '调价方式不能为空',
            trigger: 'change'
          }
        ],
        // 单品优惠价调整-调整额
        'judgeDiscountPrice.modifyValue9.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('调整额不能为空'));
              }
              if (
                this.basicDataForm.judgeDiscountPrice.modifyWay9.value ==
                'discountPrice'
              ) {
                if (value == '0') {
                  return callback();
                }
                let regExp = /^(?:(?!0\d)\d{1,2}(?:\.\d{1,2})?|100(?:\.0{1,2})?)$/;
                if (!regExp.test(value)) {
                  return callback(
                    new TypeError('请输入100以内的正数,且只允许输入两位小数位')
                  );
                }
              } else if (
                this.basicDataForm.judgeDiscountPrice.modifyWay9.value ==
                'fixPrice'
              ) {
                let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if (!regExp.test(value) || value <= 0) {
                  return callback(
                    new TypeError('请输入正数,且只允许输入两位小数位')
                  );
                } else if (value >= 1000) {
                  return callback(new TypeError('超出范围'));
                }
              } else {
                if (value == '0') {
                  return callback();
                }
                let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if (!regExp.test(value) || value < 1.0) {
                  return callback(
                    new TypeError('请输入正数,且只允许输入两位小数位')
                  );
                } else if (value >= 1000000000) {
                  return callback(new TypeError('超出范围'));
                }
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 单品优惠价调整-调价方式-折扣后加减N元
        'judgeDiscountPrice.addAmountAfterDiscount9.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (value) {
                if (!regExp.test(value) || value < 1.0) {
                  return callback(
                    new TypeError('请输入正数,且只允许输入两位小数位')
                  );
                } else if (value >= 1000000000) {
                  return callback(new TypeError('超出范围'));
                }
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 单品优惠价调整-积分定价（分）
        'judgeDiscountPrice.integralAmount9.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              let regExp = /^[1-9]\d*$/;
              if (value) {
                if (!regExp.test(value) || value == 0) {
                  return callback(new TypeError('请输入正整数'));
                } else if (value >= 1000000000) {
                  return callback(new TypeError('超出范围'));
                }
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 单品优惠价调整-加金额（元）
        'judgeDiscountPrice.integralMoney9.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (value == '0') {
                return callback();
              }
              if (value) {
                if (!regExp.test(value) || value < 1.0) {
                  return callback(
                    new TypeError('请输入正数,且只允许输入两位小数位')
                  );
                } else if (value >= 1000000000) {
                  return callback(new TypeError('超出范围'));
                }
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 单品优惠价调整-调价商品数量
        'judgeDiscountPrice.modifyAmountMethod9.value': [
          {
            required: true,
            message: '调价商品数量不能为空',
            trigger: 'change'
          }
        ],
        // 单品优惠价调整-数量
        'judgeDiscountPrice.modifyAmount9.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('数量不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 单品优惠价调整-折后取整方式
        // ----------无------------

        // 以优惠价格增加单品
        // 以优惠价格增加单品-商品
        'addGoodsWithDiscountPrice.merKey10.text': [
          {
            required: true,
            message: '商品不能为空',
            trigger: 'change'
          }
        ],
        // 以优惠价格增加单品-商品单价
        'addGoodsWithDiscountPrice.price10.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('商品单价不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 以优惠价格增加单品-增加数量
        'addGoodsWithDiscountPrice.amount10.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('增加数量不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          },
          {
            validator (rule, value, callback) {
              if (/(^[1-9]\d*$)/.test(value)) {
                callback();
              } else {
                callback(new Error('请输入正整数'));
              }
            },
            trigger: 'blur'
          }
        ],
        // 卖品分类优惠价调整
        // 卖品分类优惠价调整-商品分类
        // ----------无------------
        // 卖品分类优惠价调整-商品分类-分类
        'judgeDiscountPriceByType.classCode27.text': [
          {
            required: true,
            message: '分类不能为空',
            trigger: 'change'
          }
        ],
        // 卖品分类优惠价调整-调价方式
        'judgeDiscountPriceByType.modifyWay27.value': [
          {
            required: true,
            message: '调价方式不能为空',
            trigger: 'change'
          }
        ],
        // 卖品分类优惠价调整-调价方式-调价值
        'judgeDiscountPriceByType.modifyValue27.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (value == '0') {
                return callback();
              }
              if (!value) {
                return callback(new Error('调价值不能为空'));
              }
              if (
                this.basicDataForm.judgeDiscountPriceByType.modifyWay27.value ==
                'subPrice'
              ) {
                let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
                if (!regExp.test(value) || value < 1.0) {
                  return callback(
                    new TypeError('请输入正数,且只允许输入两位小数位')
                  );
                } else if (value >= 1000000000) {
                  return callback(new TypeError('超出范围'));
                }
              } else {
                let regExp = /^(?:(?!0\d)\d{1,2}(?:\.\d{1,2})?|100(?:\.0{1,2})?)$/;
                if (!regExp.test(value)) {
                  return callback(
                    new TypeError('请输入100以内的正数,且只允许输入两位小数位')
                  );
                }
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 卖品分类优惠价调整-调价方式-折扣后加减N元
        'judgeDiscountPriceByType.addAmountAfterDiscount27.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (value) {
                if (!regExp.test(value) || value < 1.0) {
                  return callback(
                    new TypeError('请输入正数,且只允许输入两位小数位')
                  );
                } else if (value >= 1000000000) {
                  return callback(new TypeError('超出范围'));
                }
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 卖品分类优惠价调整-调价商品数量
        'judgeDiscountPriceByType.modifyAmountMethod27.value': [
          {
            required: true,
            message: '调价商品数量不能为空',
            trigger: 'change'
          }
        ],
        // 卖品分类优惠价调整-数量
        'judgeDiscountPriceByType.modifyAmount27.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('数量不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 卖品分类优惠价调整-折后取整方式
        // ----------无------------

        // 按品牌优惠价调整
        // 按品牌优惠价调整-商品品牌
        'judgeDiscountPriceByBrand.merBrandMethod28.value': [
          {
            required: true,
            message: '商品品牌不能为空',
            trigger: 'change'
          }
        ],
        // 按品牌优惠价调整-商品品牌-品牌
        'judgeDiscountPriceByBrand.brandId28.text': [
          {
            required: true,
            message: '品牌不能为空',
            trigger: 'change'
          }
        ],
        // 按品牌优惠价调整-调价方式
        'judgeDiscountPriceByBrand.modifyWay28.value': [
          {
            required: true,
            message: '调价方式不能为空',
            trigger: 'change'
          }
        ],
        // 按品牌优惠价调整-调价方式-调价值
        'judgeDiscountPriceByBrand.modifyValue28.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (value == '0') {
                return callback();
              }
              if (!value) {
                return callback(new Error('调价值不能为空'));
              }
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (!regExp.test(value) || value < 1.0) {
                return callback(
                  new TypeError('请输入正数,且只允许输入两位小数位')
                );
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }

              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 按品牌优惠价调整-调价方式-折扣后加减N元
        'judgeDiscountPriceByBrand.addAmountAfterDiscount28.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              let regExp = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
              if (value) {
                if (!regExp.test(value) || value < 1.0) {
                  return callback(
                    new TypeError('请输入正数,且只允许输入两位小数位')
                  );
                } else if (value >= 1000000000) {
                  return callback(new TypeError('超出范围'));
                }
              }
              return callback();
            },
            trigger: 'blur'
          }
        ],
        // 按品牌优惠价调整-调价商品数量
        'judgeDiscountPriceByBrand.modifyAmountMethod28.value': [
          {
            required: true,
            message: '调价商品数量不能为空',
            trigger: 'change'
          }
        ],
        // 按品牌优惠价调整-数量
        'judgeDiscountPriceByBrand.modifyAmount28.value': [
          {
            required: true,
            validator: (rules, value, callback) => {
              if (!value) {
                return callback(new Error('数量不能为空'));
              }
              let regExp = /^[1-9]\d*$/;
              if (!regExp.test(value) || value == 0) {
                return callback(new TypeError('请输入正整数'));
              } else if (value >= 1000000000) {
                return callback(new TypeError('超出范围'));
              }
              return callback();
            },
            trigger: 'blur'
          }
        ]
        // 按品牌优惠价调整-折后取整方式
        // ----------无------------
        // --------------子活动执行方法end-----------------
      }
    };
  },
  created () {},
  methods: {}
};
