<template>
<div>
    <el-collapse v-model="activeName">
        <template v-for="item in collapseArr">
            <el-collapse-item :key="item.activeName" :title="item.title" :name="item.activeName">
                <template v-for="item in item.keysArr">
                    <el-row :key="item.key" class="flex-base rule-item">
                        <span class="title" :style="{width: styleConfig.titleWidth}">{{item.text}}:</span>
                        <span class="content">{{item.value}}</span>
                        <span class="tips" v-if="item.tips">{{item.tips}}</span>
                    </el-row>
                </template>
            </el-collapse-item>
        </template>
    </el-collapse>
    <el-row class="flex-base flex-center">
        <el-button type="primary" @click="returnPath">返回</el-button>
    </el-row>
</div>
</template>

<script>
export default {
    data() {
        return {
            activeName: ['actions', 'ruleConditions'],
            styleConfig: {
                titleWidth: '120px'
            },
            model: {
                type: '',
                ticketType: '',
                pathFrom: '',
                returnQuery: ''
            },
            collapseArr: [{
                    activeName: 'ruleConditions',
                    title: '商品属性信息',
                    keysArr: []
                },
                {
                    activeName: 'actions',
                    title: '',
                    keysArr: []
                }
            ],
        }
    },
    created() {
        let query = this.$route.query;

        let params = this.$store.getters['saleList/getCheckRule'].checkRule;

        let type = query.type,
            ticketType = query.ticketType,
            ruleConditions = params.conditionActions.ruleConditions,
            actions = params.conditionActions.actions;

        let ruleTitle = type == 'exchange' ? '兑换' : '优惠';
        ruleTitle += ticketType == 'films' ? '影票' : '卖品';

        this.collapseArr[1].title = ruleTitle + '规则';

        let keysObj = this.unpackToObj(actions, ruleConditions);
        this.collapseArr[0].keysArr = this.unpackRuleConditions(keysObj, type, ticketType);
        this.collapseArr[1].keysArr = this.unpackActions(keysObj, type, ticketType);

        this.model = {
            type,
            ticketType,
            pathFrom: query.path,
            returnQuery: params.enterQuery
        };

    },
    methods: {
        /**
         * @function unpackToObj - 将数组转化成key对象
         * 
         * @param {Array} actions - actions数组
         * @param {Array} ruleConditions -  ruleConditions数组
         * @return {Object} - key对象
         */
        unpackToObj(actions, ruleConditions) {
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
            })

            return {
                actions: actionsObj,
                ruleConditions: ruleConditionsObj
            }
        },
        /**
         * @function unpackRuleConditions - 拆解ruleConditions
         * 
         * @param {Object} keysObj - 组装actions和ruleConditions对象
         * @param {String} type - 查看类型： exchange兑换，favorable优惠
         * @param {String} ticketType - 商品属性：films影票，goods卖品
         */
        unpackRuleConditions(keysObj, type, ticketType) {
            let ruleConditions = keysObj.ruleConditions,
                actions = keysObj.actions;

            let ruleConditionsArr = [];

            // 商品类型
            let saleItemTypeVal = ruleConditions[`saleItemType`];
            if (saleItemTypeVal) {
                let obj = {
                    text: '商品类型',
                    value: saleItemTypeVal.value == 0 ? '影票' : '商品'
                };
                ruleConditionsArr.push(obj);
            }

            // 商品数量
            let amount = actions[`amount`];
            let amountVal = '不限';
            if (amount) {
                amountVal = amount.value;
            }
            ruleConditionsArr.push({
                text: '商品数量',
                value: amountVal
            });

            switch (ticketType) {
                case 'films':
                    // 放映有效期
                    let planStartTime = ruleConditions[`planStartTime`];
                    let planStartTimeVal = '不限';
                    if (planStartTime) {
                        planStartTimeVal = `指定时间范围：${JSON.parse(planStartTime.value).join('至')}`;
                    }
                    ruleConditionsArr.push({
                        text: '放映有效期',
                        value: planStartTimeVal
                    });

                    // 放映排除日期 - 节假日除外
                    let not_RelateDateHolidayOperator = ruleConditions[`not_RelateDateHolidayOperator`];
                    let filmPlanInvalidTimeVal = [];
                    if (not_RelateDateHolidayOperator) {
                        filmPlanInvalidTimeVal.push('节假日除外');
                    }

                    //放映排除日期 - 指定排除日期范围
                    let not_DateRangeContainOperator = ruleConditions[`not_DateRangeContainOperator`];
                    if (not_DateRangeContainOperator) {
                        let textVal = '指定排除日期范围：';
                        let timeArr = JSON.parse(not_DateRangeContainOperator.value);
                        timeArr.forEach((item, index) => {
                            textVal += `${item[0]}至${item[1]}`;
                            if (index != timeArr.length - 1) {
                                textVal += ', ';
                            }
                        })
                        filmPlanInvalidTimeVal.push(textVal);
                    }
                    ruleConditionsArr.push({
                        text: '放映排除日期',
                        value: filmPlanInvalidTimeVal.join(',')
                    });

                    // 放映星期范围
                    let filmPlanWeekRange = ruleConditions[`filmPlanWeekRange`];
                    let filmPlanWeekRangeVal = '每天';
                    if (filmPlanWeekRange) {
                        let keysObj = {
                            WeekDateOperator: '周一至周五',
                            WeekDateRangeOperator: '指定范围：'
                        }
                        let opUniqueName = filmPlanWeekRange.opUniqueName;
                        filmPlanWeekRangeVal = keysObj[`${opUniqueName}`];
                        if (opUniqueName == 'WeekDateRangeOperator') {
                            let keysObj = {
                                1: '星期一',
                                2: '星期二',
                                3: '星期三',
                                4: '星期四',
                                5: '星期五',
                                6: '星期六',
                                7: '星期天',
                            };

                            let weekStr = filmPlanWeekRange.value;
                            let weekArr = filmPlanWeekRange.value.split(',');

                            weekArr.forEach(item => {
                                let reg = `${item}`,
                                    replaceMent = keysObj[`${item}`];
                                weekStr = weekStr.replace(reg, replaceMent);
                            })

                            filmPlanWeekRangeVal += weekStr;
                        }
                    }
                    ruleConditionsArr.push({
                        text: '放映星期范围',
                        value: filmPlanWeekRangeVal
                    });

                    // 放映时间段范围
                    let filmPlanTimeRange = ruleConditions[`filmPlanTimeRange`];
                    let filmPlanTimeRangeVal = '全天';
                    if (filmPlanTimeRange) {
                        let keysObj = {
                            MorningOperator: '上午',
                            AfternoonOperator: '下午',
                            NightOperator: '晚上',
                            TimeRangeContainOperator: '自定义：'
                        };

                        let opUniqueName = filmPlanTimeRange.opUniqueName;
                        filmPlanTimeRangeVal = keysObj[`${opUniqueName}`];
                        if (opUniqueName == 'TimeRangeContainOperator') {
                            let timeArr = JSON.parse(filmPlanTimeRange.value);

                            timeArr.forEach((item, index) => {
                                filmPlanTimeRangeVal += `${item[0]}至${item[1]}`;
                                if (index != timeArr.length - 1) {
                                    filmPlanTimeRangeVal += ', ';
                                }
                            })
                        }
                    }
                    ruleConditionsArr.push({
                        text: '放映时间段范围',
                        value: filmPlanTimeRangeVal
                    });

                    // 影票效果
                    let filmsArr = [{
                            key: 'showEffect',
                            defaultVal: '不限',
                            text: '影片效果'
                        },
                        {
                            key: 'uniformCode',
                            defaultVal: '不限',
                            text: '影片名称'
                        },
                        {
                            key: 'filmTypeKey',
                            defaultVal: '不限',
                            text: '影片类型'
                        },
                        {
                            key: 'hallTypeKey',
                            defaultVal: '不限',
                            text: '影厅类型'
                        }
                    ]
                    filmsArr.forEach((item, index) => {
                        let key = item.key,
                            text = item.text,
                            defaultVal = item.defaultVal,
                            keyValue = '';
                        let filmsVal = ruleConditions[`${key}`];
                        if (filmsVal) {
                            keyValue = filmsVal.text;
                        }
                        ruleConditionsArr.push({
                            text,
                            value: keyValue == '' ? defaultVal : keyValue
                        })
                    })

                    break;
                case 'goods':
                    let goodsArr = [{
                            key: 'merKey',
                            text: '商品名称'
                        },
                        {
                            key: 'classCode',
                            text: '商品类别'
                        },
                        {
                            key: 'brandId',
                            text: '商品品牌'
                        }
                    ];
                    goodsArr.forEach((item) => {
                        let key = item.key,
                            text = item.text;
                        let goodsVal = ruleConditions[`${key}`];
                        if (goodsVal) {
                            ruleConditionsArr.push({
                                text,
                                value: goodsVal.text
                            })
                        }
                    })
                    break;
            }

            // 价格范围
            let price = ruleConditions[`price`];
            let priceVal = '不限';
            if (price) {
                let priceValue = JSON.parse(price.value)[0];
                priceVal = `指定票价范围：${priceValue[0]}元至${priceValue[1]}元`;
            }
            ruleConditionsArr.push({
                text: '价格范围',
                value: priceVal
            });

            return ruleConditionsArr;
        },
        /**
         * @function unpackActions - 拆解actions
         * 
         * @param {Object} keysObj - 组装actions和ruleConditions对象
         * @param {String} type - 查看类型： exchange兑换，favorable优惠
         * @param {String} ticketType - 商品属性：films影票，goods卖品
         */
        unpackActions(keysObj, type, ticketType) {
            let actionsArr = [];
            let actions = keysObj.actions;
            console.log(keysObj);

            // 调整零售价方法
            let priceModifyMethod = actions[`priceModifyMethod`];
            if (priceModifyMethod) {
                let opUniqueName = priceModifyMethod.value;
                let keysObj = {
                    lowest_price: '影片最低发行价',
                    fix_price: '固定金额：N元',
                    subPrice: '扣减金额：N元',
                    appointPercent: '指定折扣：N%'
                };
                let priceModifyMethodVal = keysObj[`${opUniqueName}`];
                if (opUniqueName != 'lowest_price') {
                    priceModifyMethodVal = priceModifyMethodVal.replace('N', actions[`priceModifyValue`].value);
                }
                actionsArr.push({
                    text: '调整零售价为(元)',
                    value: priceModifyMethodVal
                });
            }

            switch (type) {
                case 'exchange':
                    //  抵用金额方式
                    let moneyMethod = actions[`moneyMethod`];
                    if (moneyMethod) {
                        let opUniqueName = moneyMethod.value;
                        let keysObj = {
                            sale_price: '零售价(扣减加价金额)',
                            fix_price: '固定金额：'
                        }
                        let moneyMethodVal = keysObj[`${opUniqueName}`];
                        if (opUniqueName == 'fix_price') {
                            moneyMethodVal += actions[`fixPriceValue`].value + '元';
                        }

                        actionsArr.push({
                            text: '抵用金额方式',
                            value: moneyMethodVal
                        });
                    }

                    if (moneyMethod.opUniqueName == 'sale_price') {
                        // 加价金额
                        let addPriceValue = actions[`addPriceValue`];
                        if (addPriceValue) {
                            actionsArr.push({
                                text: '加价金额',
                                value: addPriceValue.value + '元',
                                tips: '（设置加价兑换时需设置此金额）'
                            });
                        }
                    } else {
                        // 	低于零售价时，由'什么角色支付'
                        let payer = actions[`payer `];
                        if (payer) {
                            let keysObj = {
                                cinema: '影院',
                                client: '客户'
                            };
                            let payerVal = keysObj[`${payer.value}`] + '支付';
                            if (payer.value == 'client') {
                                payerVal += `限额${actions[`payerPayAmount`].value}元`;
                            }
                            actionsArr.push({
                                text: '低于零售价时，由',
                                value: payerVal
                            });
                        }

                        // 是否高于零售价时，使用抵用金额作为零售价
                        let couponMoneyAsPrice = actions[`couponMoneyAsPrice`];
                        if (couponMoneyAsPrice) {
                            actionsArr.push({
                                text: '高于零售价时，使用抵用金额作为零售价',
                                value: '是'
                            });
                        }
                    }
                    break;
            }

            // 折扣后取整方式
            let decimalRoundMode = actions[`decimalRoundMode`];
            if (decimalRoundMode) {
                let opUniqueName = decimalRoundMode.value;
                let keysObj = {
                    ROUND_HALF_UP: '四舍五入',
                    ROUND_FLOOR: '忽略小数取整',
                    ROUND_CEILING: '小数进1取整',
                    ROUND_UNNECESSARY: '保留小数'
                }
                actionsArr.push({
                    text: '折扣后取整方式',
                    value: keysObj[`${opUniqueName}`]
                });
            }

            return actionsArr;
        },
        /**
         * @function returnPath - 返回上一页
         */
        returnPath() {
            console.log(this.model);
            let model = this.model;
            let path = model.pathFrom,
                query = model.returnQuery;
                //query[`isGetSave`] = true;

            this.$router.push({
                path,
                query
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@mixin font-base {
    font-family: MicrosoftYaHei;
    font-size: 12px;
    color: #666666;
    letter-spacing: 0;
}

.rule-item {
    margin-bottom: 10px;

    .title {
        text-align: right;
        @include font-base;
    }

    .content {
        margin-left: 16px;
        @include font-base;
    }

    .tips {}
}
</style>
