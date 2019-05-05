/**
 * 此公用方法用于销售申请单
 */

module.exports = {
        /**
         * @function unPackageForm - 拆解后端返回完整数据数据用于显示
         */
        unPackageForm: function(param, pointer) {
            // 需将string simpleRuleGroupStr转换成 json格式
            param.simpleRuleGroupStr = JSON.parse(param.simpleRuleGroupStr);

            let ruleGroup = param.simpleRuleGroupStr;
            let model = JSON.parse(JSON.stringify(pointer.model)),
                form = JSON.parse(JSON.stringify(pointer.form)),
                moneyInfo = form[`moneyInfo`],
                couponType = param[`couponType`];

            let _baseInfo = [{
                    from: 'simpleRuleGroupStr',
                    to: 'baseInfo',
                    name: 'name'
                }, {
                    from: 'param',
                    to: 'baseInfo',
                    name: 'couponType'
                }, {
                    from: 'param',
                    to: 'baseInfo',
                    name: 'couponCount'
                }, {
                    from: 'param',
                    to: 'baseInfo',
                    name: 'couponPrice'
                }, {
                    from: 'param',
                    to: 'baseInfo',
                    name: 'startSaleNum'
                }, {
                    from: 'param',
                    to: 'baseInfo',
                    name: 'salesMode'
                }, {
                    from: 'param',
                    to: 'baseInfo',
                    name: 'couponGeneration'
                }, {
                    from: 'simpleRuleGroupStr',
                    to: 'baseInfo',
                    name: 'remark'
                }, {
                    from: 'param',
                    to: 'baseInfo',
                    name: 'contractCode'
                }, {
                    from: 'param',
                    to: 'model',
                    name: 'applyCode'
                }, {
                    from: 'param',
                    to: 'model',
                    name: 'id'
                }, {
                    from: 'param',
                    to: 'baseInfo',
                    name: 'batchTicketIds'
                },
                // 这三项需要查找数据 暂放测试
                {
                    from: 'param',
                    to: 'baseInfo',
                    name: 'couponTypeCode'
                }, {
                    from: 'param',
                    to: 'baseInfo',
                    name: 'incomeCinemaId'
                }, {
                    from: 'param',
                    to: 'baseInfo',
                    name: 'custId'
                },
            ];

            // baseInfo
            _baseInfo.forEach((item, index) => {
                let from = item.from,
                    to = item.to,
                    name = item.name;
                if (from == 'param') {
                    let itemVal = param[`${name}`];
                    if (itemVal) {
                        if (to == 'model') {
                            model[`${name}`] = itemVal;
                        } else {
                            form[`${to}`][`${name}`].value = itemVal;
                        }
                    }
                } else if (from == 'simpleRuleGroupStr') {
                    let itemVal = param.simpleRuleGroupStr[`${name}`];
                    if (itemVal) {
                        form[`${to}`][`${name}`].value = itemVal;
                    }
                }
            });

            // 票券分类 couponTypeCode

            // 入账影院 incomeCinemaId

            // 客户名称 custId

            // 外部导入票券文件 importFile

            // 合同协议附件 attatchFile

            // commonInfo
            form.commonInfo = this.unPackageCommonInfo(ruleGroup.commonInfo, pointer);
            // 有效日期
            form.commonInfo.validDate.value = [new Date(ruleGroup.validDateStart), new Date(ruleGroup.validDateEnd)];

            // rule
            // 代金券
            if (couponType == '1') {
                let rulesObj = ruleGroup.rules[0],
                    ruleConditions = rulesObj.ruleConditions,
                    actions = rulesObj.actions;

                let ruleConditionsKey = {},
                    actionsKey = {};

                ruleConditions.forEach((item, index) => {
                    if (!ruleConditionsKey[`${item.key}`]) {
                        ruleConditionsKey[`${item.key}`] = item;
                    }
                });

                actions.forEach((item, index) => {
                    if (!actionsKey[`${item.key}`]) {
                        actionsKey[`${item.key}`] = item;
                    }
                })

                // 允许购买范围
                let saleItemTypeVal = ruleConditionsKey[`saleItemType`];
                if (saleItemTypeVal) {
                    moneyInfo[`saleItemType`].value = saleItemTypeVal.value;
                }

                // 每笔消费不低于N元
                let sumPriceVal = ruleConditionsKey[`sumPrice`];
                if (sumPriceVal) {
                    moneyInfo[`sumPrice`].value = sumPriceVal.value;
                }

                // 抵用金额
                let cashValueVal = actionsKey[`cashValue`];
                if (cashValueVal) {
                    moneyInfo[`voucherValue`].value = cashValueVal.value;
                }

                // "voucherIsPassword" : 1,//代金券是否需要密码，1-不需要，2-需要
                //"voucherPasswordType" : 1,//代金券消费密码类型，1-随机，2-统一密码
                //"voucherPassword" : "1234234",//代金券消费密码，数字类型

                // 代金券是否需要密码
                let voucherIsPassword = param[`voucherIsPassword`];
                if (voucherIsPassword == '2') {
                    moneyInfo[`voucherIsPassword`].value = true;
                }

                // 代金券消费密码类型
                let voucherPasswordType = param[`voucherPasswordType`];
                if (voucherPasswordType) {
                    moneyInfo[`voucherPasswordType`].value = voucherPasswordType.toString();
                }

                // 代金券消费密码
                let voucherPassword = param[`voucherPassword`];
                if (voucherPassword) {
                    moneyInfo[`voucherPassword`].value = voucherPassword;
                }

            } else {
                // 兑换券 优惠券
                pointer.ruleChild = ruleGroup.rules;
                pointer.showRuleData(ruleGroup.rules);
            }
            pointer.form = form;
            pointer.model = model;
            // 显示对应的规则
            pointer.changeTicketType();
        },
        /**
         * @function unPackageCommonInfo - 拆解commonInfo
         */
        unPackageCommonInfo: function(param, pointer) {
            let keysObj = {};

            param.forEach((item, index) => {
                if (!keysObj[`${item.key}`]) {
                    keysObj[`${item.key}`] = item;
                }
            })

            let commonInfo = JSON.parse(JSON.stringify(pointer.form.commonInfo));

            // 节假日排除与否
            let holidayVal = keysObj[`holiday`];
            if (holidayVal) {
                commonInfo[`eliminationDate`].value.push(holidayVal.opUniqueName);
            }

            // 指定排除日期范围
            let appointInvalidDateVal = keysObj[`appointInvalidDate`]
            if (appointInvalidDateVal) {
                commonInfo[`eliminationDate`].value.push(appointInvalidDateVal.opUniqueName);

                let timeArr = JSON.parse(appointInvalidDateVal.value);
                let _timeArr = [];
                timeArr.forEach((item, index) => {
                    let startTime = item[0];
                    let endTime = item[1];

                    _timeArr.push({
                        value: [new Date(startTime), new Date(endTime)]
                    });
                })

                commonInfo[`appointInvalidDate`].value = _timeArr;
            }

            // 星期范围
            let validWeekVal = keysObj[`validWeek`];
            if (validWeekVal) {
                commonInfo[`ruleValidWeek`].value = validWeekVal.opUniqueName;
                commonInfo[`week`].value = validWeekVal.value.split(',');
            }

            // 时段范围
            let validTimeVal = keysObj[`validTime`];

            if (validTimeVal) {
                let opUniqueName = validTimeVal.opUniqueName;
                commonInfo[`ruleValidTime`].value = opUniqueName;
                // 指定时段范围
                if (opUniqueName == 'TimeRangeContainOperator') {
                    let timeArr = JSON.parse(validTimeVal.value);
                    let _timeArr = [];
                    timeArr.forEach((item, index) => {
                        let date = new Date();
                        let _start = item[0].split(':');
                        let _end = item[1].split(':');
                        let startTime = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate(), _start[0], _start[1]);
                        let endTime = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate(), _end[0], _end[1]);
                        _timeArr.push({
                            value: [startTime, endTime]
                        })
                    })

                    commonInfo[`TimeRangeContainOperator`].value = _timeArr;
                }
            }

            // 影院范围
            let cinemaCodeVal = keysObj[`cinemaCode`];
            if (cinemaCodeVal) {
                commonInfo[`cinemaCode`].value = cinemaCodeVal.opUniqueName;
                commonInfo[`cinemarangev`].value = cinemaCodeVal.value;
                commonInfo[`cinemarangev`].text = cinemaCodeVal.text;
            }

            // 消费渠道
            let consumeWayCodeVal = keysObj[`consumeWayCode`];
            if (consumeWayCodeVal) {
                commonInfo[`consumeWayCode`].value = consumeWayCodeVal.opUniqueName;
                commonInfo[`consumeWayCodeOp`].value = consumeWayCodeVal.value.split(',');
            }

            // 消费者身份
            let consumerTypeKey = keysObj[`consumerTypeKey`];
            if (consumerTypeKey) {
                let opUniqueName = consumerTypeKey.opUniqueName;
                commonInfo[`consumerTypeKey`].value = opUniqueName;
                // 指定会员等级
                if (opUniqueName == 'opUniqueName') {
                    commonInfo[`consumerType`].value = consumerTypeKey.value;
                    // commonInfo[`consumerType`].text = consumerTypeKey.text;
                }
            }

            // 会员生日
            let birthdayVal = keysObj[`birthday`];
            if (birthdayVal) {
                let opUniqueName = birthdayVal.opUniqueName
                commonInfo[`MemberInfo`].value = opUniqueName;

                // 生日前后N日
                if (opUniqueName == 'EqualCurrentDayOffset') {
                    commonInfo[`memberBirthdayOffset`].value = birthdayVal.value;
                }
            }

            return commonInfo;
        },
        /**
         * @function unPackageAddForm - 拆解ruleConditions和actions用于表单显示
         * 
         * @param {Object} form - 用于显显示的表单
         * @param {Object} ruleConditionsActionsObj - 需要拆解的对象
         * @param {String} type - 影票：films,卖品：goods
         * @param {Boolean} isTableReturn - 用于表格显示返回
         */
        unPackageAddForm: function(form, ruleConditionsActionsObj, type, isTableReturn, pointer) {

            let actions = ruleConditionsActionsObj.actions,
                ruleConditions = ruleConditionsActionsObj.ruleConditions;

            let actionsObj = {};
            for (let i = 0; i < actions.length; i++) {
                let item = actions[i];
                if (!actionsObj[item.key]) {
                    actionsObj[item.key] = item;
                }
            }
            let ruleCondtionObj = {};
            for (let i = 0; i < ruleConditions.length; i++) {
                let item = ruleConditions[i];
                if (!ruleCondtionObj[item.key]) {
                    if (item.key == 'filmPlanInvalidTime') {
                        ruleCondtionObj[`${item.key}#${item.opUniqueName}`] = item;
                    } else {
                        ruleCondtionObj[item.key] = item;
                    }
                }
            }

            // ruleConditions
            if (type == 'films') {
                // 放映有效期
                let planStartTime = ruleCondtionObj[`planStartTime`];
                if (planStartTime) {
                    form[`planStartTimeOp`] = 'TimeBetweenOperator';
                    let timeArr = JSON.parse(planStartTime.value);
                    form[`planTime`] = [new Date(timeArr[0]), new Date(timeArr[1])];
                }

                // 放映排除日期 - 节假日除外
                let not_RelateDateHolidayOperator = ruleCondtionObj[`filmPlanInvalidTime#not_RelateDateHolidayOperator`];
                if (not_RelateDateHolidayOperator) {
                    form[`filmPlanInvalidTime`].push('not_RelateDateHolidayOperator');
                }

                // 放映排除日期 - 指定排除日期范围
                let not_DateRangeContainOperator = ruleCondtionObj[`filmPlanInvalidTime#not_DateRangeContainOperator`];
                if (not_DateRangeContainOperator) {
                    form[`filmPlanInvalidTime`].push('not_DateRangeContainOperator');

                    let timeArr = JSON.parse(not_DateRangeContainOperator.value);
                    let _timeArr = [];
                    for (let i = 0; i < timeArr.length; i++) {
                        let item = timeArr[i];
                        _timeArr.push({
                            value: [new Date(item[0]), new Date(item[1])]
                        });

                    }
                    form[`filmPlanInvalidTime_more`] = _timeArr;
                }

                // 放映星期范围
                let filmPlanWeekRange = ruleCondtionObj[`filmPlanWeekRange`];
                if (filmPlanWeekRange) {
                    let opUniqueName = filmPlanWeekRange.opUniqueName
                    form[`filmPlanWeekRange`] = opUniqueName;

                    if (opUniqueName == 'WeekDateRangeOperator') {
                        form[`week`] = filmPlanWeekRange.value.split(',');
                    }
                }

                // 放映时段范围
                let validTime = ruleCondtionObj[`validTime`];
                if (validTime) {
                    let opUniqueName = validTime.opUniqueName;
                    form[`filmPlanTimeRange`] = opUniqueName;
                    // 指定时段
                    if (opUniqueName == 'TimeRangeContainOperator') {
                        let timeArr = JSON.parse(validTime.value);
                        let _timeArr = [];
                        for (let i = 0; i < timeArr.length; i++) {
                            let item = timeArr[i];
                            _timeArr.push({
                                value: [new Date(item[0]), new Date(item[1])]
                            });
                        }
                        form[`filmPlanTimeRange_more`] = _timeArr;
                    }
                }

                // 影片效果
                let filmsEfectArr = [{
                    key: 'showEffect',
                    opVal: 'showEffectOp',
                    toVal: 'showEffectCode'
                }, {
                    key: 'uniformCode',
                    opVal: 'movieNameOp',
                    toVal: 'uniformCode'
                }, {
                    key: 'filmTypeKey',
                    opVal: 'filmTypeNameOp',
                    toVal: 'filmTypeKey'
                }, {
                    key: 'hallTypeKey',
                    opVal: 'hallTypeNameOp',
                    toVal: 'hallTypeKey'
                }];
                for (let i = 0; i < filmsEfectArr.length; i++) {
                    let item = filmsEfectArr[i];
                    let formItem = ruleCondtionObj[`${item.key}`];
                    if (formItem) {
                        form[`${item.key}`] = formItem.opUniqueName;
                        form[`${item.opVal}`] = {
                            value: formItem.value,
                            text: formItem.text
                        }
                    }
                };
            } else if (type == 'goods') {
                // 商品名称
                let merKey = ruleCondtionObj[`merKey`];
                if (merKey) {
                    form[`merName`] = {
                            value: merKey.value,
                            text: merKey.text
                        }
                        // 商品选项
                    form[`productType`] = '0';
                }

                // 商品类别
                let classCode = ruleCondtionObj[`classCode`];
                if (classCode) {
                    form[`className`] = {
                            value: classCode.value,
                            text: classCode.text
                        }
                        // 商品选项
                    form[`productType`] = '1';
                }

                // 品牌
                let brandId = ruleCondtionObj[`brandId`];
                if (brandId) {
                    form[`brandName`] = {
                            value: brandId.value,
                            text: brandId.text
                        }
                        // 商品选项
                    form[`productType`] = '1';
                }
            }

            // 价格范围
            let price = ruleCondtionObj[`price`];
            if (price) {
                form[`priceRange`] = price.opUniqueName;
                let priceVal = JSON.parse(price.value)[0];
                form[`priceStart`] = priceVal[0];
                form[`priceEnd`] = priceVal[1];
            }

            // actions
            // 商品数量
            let amount = actionsObj[`amount`];
            if (amount) {
                form[`amount`] = amount.value;
                if (pointer.model.type == 'favourable' && amount) {
                    form[`appointAmount`] = 'appointAmount';
                }
            }

            // 调整零售价方法
            let priceModifyMethod = actionsObj[`priceModifyMethod`];
            if (priceModifyMethod) {
                form[`priceModifyMethod`] = priceModifyMethod.value;
                if (priceModifyMethod.value != 'lowest_price') {
                    form[`priceModifyValue`] = actionsObj[`priceModifyValue`].value;
                }
            }

            // 抵用金额
            let moneyMethod = actionsObj[`moneyMethod`];

            if (moneyMethod) {
                form[`moneyMethod`] = moneyMethodVal;

                let moneyMethodVal = moneyMethod.value
                    // 加价金额
                if (moneyMethodVal == 'sale_price') {
                    form[`addPriceValue`] = actionsObj[`addPriceValue`].value;
                }

                if (moneyMethodVal == 'fix_price') {
                    // 抵用金额
                    form[`fixPriceValue`] = actionsObj[`fixPriceValue`].value;
                    // 抵用金额
                    let payerVal = actionsObj[`payer`].value
                    form[`payer`] = payerVal;
                    if (payerVal == 'cinema') {
                        form[`payerPayAmount`] = actionsObj[`payerPayAmount`].value;
                    }
                }
            }



            // 是否高于零售价
            let couponMoneyAsPrice = actionsObj[`couponMoneyAsPrice`];
            if (couponMoneyAsPrice) {
                form[`couponMoneyAsPriceIn`] = true;
            }

            // 折扣后取整方式
            let decimalRoundMode = actionsObj[`decimalRoundMode`];
            if (decimalRoundMode) {
                form[`decimalRoundMode`] = decimalRoundMode.value;
            }

            if (isTableReturn) {
                return form;
            } else {
                pointer.addConfig.form = form;
                pointer.addConfig.type = type;
                pointer.addConfig.isShow = true;
            }
        },
        /**
         * @function returnruleConditionsActions - 拆解actions和ruleCondtion
         * @returns {Object} - 包含对应familyId的actions和ruleCondtion 
         */
        returnruleConditionsActions: function(ruleChild, familyId) {
            let _actions = ruleChild.actions,
                _ruleConditions = ruleChild.ruleConditions;

            let actions = [],
                ruleConditions = [];

            for (let i = 0; i < _actions.length; i++) {
                let item = _actions[i];
                if (familyId == item.familyId) {
                    actions.push(item);
                }
            }

            for (let i = 0; i < _ruleConditions.length; i++) {
                let item = _ruleConditions[i];
                if (familyId == item.familyId) {
                    ruleConditions.push(item);
                }
            }

            return {
                actions,
                ruleConditions
            }
        },
        /**
         * @function unPackageRuleTable - 将rule设置成tabel数据
         */
        unPackageRuleTable: function(ruleChild, pointer) {
            let _ruleConditions = ruleChild.ruleConditions;
            let _actions = ruleChild.actions;

            let familyIdsObj = {};
            for (let i = 0; i < _ruleConditions.length; i++) {
                let item = _ruleConditions[i];
                let familyId = item.familyId;
                if (!familyIdsObj[`${familyId}`]) {
                    familyIdsObj[`${familyId}`] = {
                        ruleConditions: [item],
                        actions: []
                    }
                } else {
                    familyIdsObj[`${familyId}`].ruleConditions.push(item);
                }
            }

            for (let i = 0; i < _actions.length; i++) {
                let item = _actions[i];
                let familyId = item.familyId;
                if (!familyIdsObj[`${familyId}`]) {
                    familyIdsObj[`${familyId}`] = {
                        ruleConditions: [],
                        actions: [item]
                    }
                } else {
                    familyIdsObj[`${familyId}`].actions.push(item);
                }
            }

            // 影片还是卖品 应该填充的form
            let modelType = pointer.model.type;
            let keysArr = Object.keys(familyIdsObj);
            keysArr.forEach(item => {
                let ruleConditionsActionsObj = familyIdsObj[`${item}`];


                let ruleConditions = ruleConditionsActionsObj.ruleConditions;

                let type = '';
                ruleConditions.forEach(item => {
                    let key = item.key;
                    if (key == 'saleItemType') {
                        type = item.value == '0' ? 'films' : 'goods';
                    }
                });

                let form = JSON.parse(JSON.stringify(pointer.addConfig.options[`${modelType}_${type}`]));

                // 拆解数据用于显示
                let _form = this.unPackageAddForm(form, ruleConditionsActionsObj, type, true, pointer);

                // 显示表格
                this.setRuleTable(_form, type, item, pointer);
            });
        },
        /**
         * @function setRuleTable - 设置表格
         */
        setRuleTable: function(form, type, familyId, pointer) {
                /* 用于表格显示*/
                let className = '不限';
                let merName = '不限';
                // 价格区间
                let priceRange = pointer.model.type != 'exchange' ? '' : form[`priceRange`] != 'BetweenOperator' ? '不限' : `${form[`priceStart`]}-${form[`priceEnd`]}`;
        if (type == 'goods') {
            className = form[`productType`] == '0' ? '不限' : form[`className`].text ? form[`className`].text : '不限';
            merName = form[`productType`] == '1' ? '不限' : form[`merName`].text;
        }
        let amount = form[`amount`] ? form[`amount`] : '不限';
        let priceModifyMethod = form[`priceModifyMethod`];
        let _text = '';
        let _unit = '';

        switch (priceModifyMethod) {
            case 'lowest_price':
                _text = '影片最低发行价';
                _unit = '';
                break;
            case 'fix_price':
                _text = '固定金额:';
                _unit = '元';
                break;
            case 'subPrice':
                _text = '扣减金额:';
                _unit = '元';
                break;
            case 'appointPercent':
                _text = '指定折扣:';
                _unit = '%'
                break;
        }

        let tableData = {
            merType: type == 'goods' ? '卖品' : '影票',
            type,
            className,
            merName,
            amount,
            familyId,
            priceRange,
            priceModifyMethod: `${_text} ${form[`priceModifyValue`]} ${_unit}`
        };

        pointer.tableConfig.data.push(tableData);
    }
}