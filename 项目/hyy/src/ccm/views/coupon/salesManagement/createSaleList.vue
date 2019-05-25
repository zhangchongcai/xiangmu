<template>
<div>
    <el-form :model="form" label-width="150px" ref="form">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="票劵基本资料" name="baseInfo">
                <el-form-item label="票券名称:" prop="baseInfo.name.value" :rules="form.baseInfo.name.rules">
                    <el-input v-model="form.baseInfo.name.value" class="input-type-217"></el-input>
                </el-form-item>
                <el-form-item label="票券类型:" prop="baseInfo.couponType.value">
                    <el-radio-group v-model="form.baseInfo.couponType.value" @change="resetcouponTypeId">
                        <el-radio-button v-for="item in form.baseInfo.couponType.options" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="票券分类:" prop="baseInfo.couponTypeId.value" :rules="form.baseInfo.couponTypeId.rules">
                    <el-select v-model="form.baseInfo.couponTypeId.value" placeholder="请选择" @change="changeTicketType">
                        <el-option v-for="item in form.baseInfo.couponTypeId.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="票券数量:" prop="baseInfo.couponCount.value" :rules="form.baseInfo.couponCount.rules">
                    <el-input v-model="form.baseInfo.couponCount.value" class="input-type-94"></el-input> <span class="tips-font">(不大于100,000)</span>
                </el-form-item>
                <el-form-item label="销售单价:" prop="baseInfo.couponPrice.value" :rules="form.baseInfo.couponPrice.rules">
                    <el-input v-model="form.baseInfo.couponPrice.value" class="input-type-94"></el-input> 元
                </el-form-item>
                <el-form-item label="起售数量:" prop="baseInfo.startSaleNum.value" :rules="form.baseInfo.startSaleNum.rules">
                    <el-input v-model="form.baseInfo.startSaleNum.value" class="input-type-94"></el-input> 元
                </el-form-item>
                <el-form-item label="销售方式:" prop="baseInfo.salesMode.value">
                    <el-radio-group v-model="form.baseInfo.salesMode.value">
                        <el-radio v-for="item in form.baseInfo.salesMode.options" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <template v-if="form.baseInfo.salesMode.value == '3' || form.baseInfo.salesMode.value == '4'">
                    <el-form-item label="客户名称:" prop="baseInfo.custId.value" :rules="form.baseInfo.custId.rules">
                        <el-row>
                            <el-input v-model="form.baseInfo.custId.text" class="input-type-124"  :clearable="true" @clear="clearInputValue('custId','baseInfo','both')"></el-input>
                            <el-button type="primary" plain @click="selectInputValue('custId')">选择</el-button>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="合同协议号:" prop="baseInfo.contractCode.value">
                        <el-row class="flex-base">
                            <el-input v-model="form.baseInfo.contractCode.value" class="input-type-124"></el-input>
                            <el-upload class="upload" ref="attatchFile" :action="form.baseInfo.attatchFile.action" :on-preview="handlePreview" :on-remove="removeAttatchFile" :limit="form.baseInfo.attatchFile.limit" :file-list="form.baseInfo.attatchFile.list" :on-change="setAttatchFile" :auto-upload="false">
                                <el-button slot="trigger" size="small" type="primary">添加附件</el-button>
                            </el-upload>
                        </el-row>
                    </el-form-item>
                </template>
                <el-form-item label="入账影院:" prop="baseInfo.incomeCinemaId.value" :rules="form.baseInfo.incomeCinemaId.rules">
                    <el-row>
                        <el-input v-model="form.baseInfo.incomeCinemaId.text" class="input-type-124" ></el-input>
                        <el-button type="primary" plain @click="selectInputValue('incomeCinemaId')">选择</el-button>
                    </el-row>
                </el-form-item>
                <el-form-item label="票券编号:" prop="baseInfo.couponGeneration.value">
                    <el-radio-group v-model="form.baseInfo.couponGeneration.value" @change="couponGeneration">
                        <el-radio v-for="item in form.baseInfo.couponGeneration.options" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="外部导入:" prop="baseInfo.importFile.value" v-if="form.baseInfo.couponGeneration.value == '1'">
                    <el-row class="flex-base">
                        <el-upload class="upload" ref="importFile" :action="form.baseInfo.importFile.action" :limit="form.baseInfo.importFile.limit" :on-preview="handlePreview" :on-remove="removeImportFile" :file-list="form.baseInfo.importFile.list" :on-change="setImportFile" :auto-upload="false">
                            <el-button slot="trigger" size="small" type="primary" plain>导入票券编号</el-button>
                        </el-upload>
                        <el-button type="primary" class="margin-left-10" plain @click="downloadTemplate">下载导入模板</el-button>
                    </el-row>
                </el-form-item>
                <el-form-item label="备注:" prop="baseInfo.remark.value">
                    <el-input type="textarea" class="input-type-360" :rows="2" placeholder="请输入内容" v-model="form.baseInfo.remark.value">
                    </el-input>
                </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="票券消费规则" name="commonInfo">
                <el-form-item label="有效期:" prop="commonInfo.validDate.value" :rules="form.commonInfo.validDate.rules">
                    <el-date-picker v-model="form.commonInfo.validDate.value" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="排除日期:" prop="commonInfo.eliminationDate.value">
                    <el-checkbox-group v-model="form.commonInfo.eliminationDate.value">
                        <el-checkbox v-for="item in form.commonInfo.eliminationDate.options" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                    <template v-if="form.commonInfo.eliminationDate.value.includes('not_DateRangeContainOperator')">
                        <el-form-item v-for="(item,index) in form.commonInfo.appointInvalidDate.value" :key="index" :prop="'commonInfo.appointInvalidDate.value.' + index + '.value'" :rules="{required: true, message: '请选择日期范围', trigger: 'blur'}">
                            <el-row class="flex-base margin-bottom-10">
                                <el-date-picker v-model="item.value" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                                </el-date-picker>
                                <el-button type="text" class="margin-left-10" @click="addOrRemove(index)">{{index == 0 ? '添加' : '删除'}}</el-button>
                            </el-row>
                        </el-form-item>
                    </template>
                </el-form-item>
                <el-form-item label="星期范围:" prop="commonInfo.ruleValidWeek.value">
                    <el-select v-model="form.commonInfo.ruleValidWeek.value" placeholder="请选择">
                        <el-option v-for="item in form.commonInfo.ruleValidWeek.options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <template v-if="form.commonInfo.ruleValidWeek.value == 'WeekDateRangeOperator'">
                        <el-form-item prop="commonInfo.week.value" :rules="form.commonInfo.week.rules">
                            <el-checkbox-group v-model="form.commonInfo.week.value">
                                <template v-for="(item,index) in form.commonInfo.week.options">
                                    <el-checkbox :key="item.label" :label="item.value" @change="handleSelectType($event,item)">{{item.label}}</el-checkbox>
                                    <br :key="index" v-if="item.br"/>
                                </template>
                            </el-checkbox-group>
                        </el-form-item>
                    </template>
                </el-form-item>
                <el-form-item label="时段范围:" prop="commonInfo.ruleValidTime.value">
                    <el-select class="margin-bottom-10" v-model="form.commonInfo.ruleValidTime.value" placeholder="请选择">
                        <el-option v-for="item in form.commonInfo.ruleValidTime.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <template v-if="form.commonInfo.ruleValidTime.value == 'TimeRangeContainOperator'">
                        <el-form-item v-for="(item, index) in form.commonInfo.TimeRangeContainOperator.value" :key="index" :prop="'commonInfo.TimeRangeContainOperator.value.' + index + '.value'" :rules="{required: true, message: '请选择日期范围', trigger: 'blur'}">
                            <el-row class="flex-base margin-bottom-10">
                                <el-time-picker is-range v-model="item.value" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时段范围">
                                </el-time-picker>
                                <el-button type="text" class="margin-left-10" @click="addOrRemoveTimeRangeContainOperator(index)">{{index == 0 ? '添加' : '删除'}}</el-button>
                            </el-row>
                        </el-form-item>
                    </template>
                </el-form-item>
                <el-form-item label="影院范围:" prop="commonInfo.cinemaCode.value">
                    <el-row class="flex-base">
                        <el-select class="margin-right-10" v-model="form.commonInfo.cinemaCode.value" placeholder="请选择">
                            <el-option v-for="item in form.commonInfo.cinemaCode.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                        <template v-if="form.commonInfo.cinemaCode.value != ''">
                            <el-form-item prop="commonInfo.cinemarangev.value" :rules="form.commonInfo.cinemarangev.rules">
                                <el-row class="flex-base">
                                    <el-input class="input-type-124" v-model="form.commonInfo.cinemarangev.text"></el-input>
                                    <el-button class="margin-left-10" type="primary" plain @click="selectInputValue('cinemarangev')">选择</el-button>
                                </el-row>
                            </el-form-item>
                        </template>
                    </el-row>
                </el-form-item>
                <el-form-item label="消费渠道:" prop="commonInfo.consumeWayCode.value">
                    <el-radio-group v-model="form.commonInfo.consumeWayCode.value">
                        <el-radio v-for="item in form.commonInfo.consumeWayCode.options" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                    </el-radio-group>
                    <template v-if="form.commonInfo.consumeWayCode.value.includes('normalIn')">
                        <el-form-item prop="commonInfo.consumeWayCodeOp.value" :rules="form.commonInfo.consumeWayCodeOp.rules">
                            <el-checkbox-group v-model="form.commonInfo.consumeWayCodeOp.value">
                                <el-checkbox v-for="item in form.commonInfo.consumeWayCodeOp.options" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </template>
                </el-form-item>
                <el-form-item label="消费者身份:" prop="commonInfo.consumerTypeKey.value">
                    <el-row class="flex-base">
                        <el-select v-model="form.commonInfo.consumerTypeKey.value" placeholder="请选择">
                            <el-option v-for="item in form.commonInfo.consumerTypeKey.options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <template v-if="form.commonInfo.consumerTypeKey.value == 'normalIn'">
                            <el-row class="flex-base margin-left-10">
                                <el-form-item prop="commonInfo.consumerType.value" :rules="form.commonInfo.consumerType.rules">
                                    <el-input class="input-type-124"  v-model="form.commonInfo.consumerType.text"></el-input>
                                    <el-button class="margin-left-10" type="primary" plain @click="selectInputValue('consumerType')">选择</el-button>
                                </el-form-item>
                            </el-row>
                        </template>
                    </el-row>
                </el-form-item>
                <el-form-item label="会员生日:" prop="commonInfo.MemberInfo.value">
                    <el-row class="flex-base">
                        <el-select class="margin-right-10" v-model="form.commonInfo.MemberInfo.value" placeholder="请选择">
                            <el-option v-for="item in form.commonInfo.MemberInfo.options" :key="item.value" :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <template v-if="form.commonInfo.MemberInfo.value == 'EqualCurrentDayOffset'">
                            <el-form-item prop="commonInfo.memberBirthdayOffset.value" :rules="form.commonInfo.memberBirthdayOffset.rules">
                                <el-input class="input-type-124" v-model="form.commonInfo.memberBirthdayOffset.value" placeholder="请输入"></el-input>
                            </el-form-item>
                        </template>
                    </el-row>
                </el-form-item>
            </el-collapse-item>
            <el-collapse-item v-if="ruleInfo.isShow" :title="ruleInfo.config.title" name="moneyInfo">
                <template v-if="ruleInfo.config.showType == '0' || ruleInfo.config.showType == '2'">
                    <ul class="flex-base rule-window">
                        <template v-for="(item,index) in showRule">
                            <li :key="item.name" class="rule-item flex-base">
                                <div class="rule-title flex-base">
                                    <span>{{item.name}}</span>
                                </div>
                                <div class="flex-base rule-content">
                                    <div class="rule-content-title">可{{form.baseInfo.couponType.value == '0' ? '兑换' : '优惠'}}商品:</div>
                                    <div class="rule-content-content flex-base">
                                        <ol>
                                            <template v-for="item in item.child">
                                                <li :key="item.name">{{item.name}}:{{item.text}}</li>
                                            </template>
                                        </ol>
                                    </div>
                                </div>
                                <div class="delete-btn" @click="deleteRule(index)">
                                    <i class="el-icon-close"></i>
                                </div>
                                <div class="change-text" @click="editionRule('edit',index)">
                                    修改
                                </div>
                            </li>
                        </template>
                        <li class="addRule flex-base" @click="editionRule">
                            <i class="el-icon-plus"></i>
                        </li>
                    </ul>
                </template>
                <template v-if="ruleInfo.config.showType == '1'">
                    <el-form-item class="change-label" label="代金券面值(抵用金额):" prop="moneyInfo.voucherValue.value" :rules="form.moneyInfo.voucherValue.rules">
                        <el-input class="input-type-217" v-model="form.moneyInfo.voucherValue.value"></el-input>
                    </el-form-item>
                    <el-form-item class="change-label" label="代金券消费密码:" prop="moneyInfo.voucherIsPassword.value">
                        <el-row class="flex-base">
                            <el-checkbox v-model="form.moneyInfo.voucherIsPassword.value"></el-checkbox>
                            <el-form-item v-if="form.moneyInfo.voucherIsPassword.value" prop="moneyInfo.voucherPasswordType.value">
                                <el-radio-group v-model="form.moneyInfo.voucherPasswordType.value">
                                    <el-radio v-for="item in form.moneyInfo.voucherPasswordType.options" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item v-if="form.moneyInfo.voucherPasswordType.value == '2'" prop="moneyInfo.voucherPassword.value" :rules="form.moneyInfo.voucherPassword.rules">
                                <el-input class="margin-left-15 input-type-166" v-model="form.moneyInfo.voucherPassword.value" placeholder="请输入6位密码" maxlength="6"></el-input>
                            </el-form-item>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="允许购买商品范围:" prop="moneyInfo.saleItemType.value">
                        <el-radio-group v-model="form.moneyInfo.saleItemType.value">
                            <el-radio v-for="item in form.moneyInfo.saleItemType.options" :key="item.value" :label="item.value">{{item.label}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="每笔消费金额不小于:" prop="moneyInfo.sumPrice.value" :rules="form.moneyInfo.sumPrice.rules">
                        <el-input class="input-type-94" v-model="form.moneyInfo.sumPrice.value"></el-input> 元
                    </el-form-item>
                </template>
            </el-collapse-item>
        </el-collapse>
        <el-form-item class="flex-base flex-center">
            <el-button type="primary" @click="saveOrSubmit('form',2)">提交审批</el-button>
            <el-button type="primary" @click="saveOrSubmit('form',1)">保存</el-button>
            <el-button @click="cancle()">取消</el-button>
        </el-form-item>
    </el-form>
    <section v-if="alert.isShow">
        <alertWindow :config="alert.config" @alertCallBack="alertCallBack"></alertWindow>
    </section>
</div>
</template>

<script>
import alertWindow from '../../../components/alertWindow/index.vue';
const saleListUtil = require('../../../util/saleList.js');
export default {
    components: {
        alertWindow
    },
    data() {
        return {
            /**
             * @param model - 模式
             * @param model.type - create 新建模式，change 修改模式
             * @param model.applyCode - 销售申请单号，修改时使用
             * @param model.id - 销售单ID，修改时使用
             */
            model: {
                type: 'create',
                applyCode: null,
                id: null
            },
            /* 用于计时器缓存 */
            time: null,
            /* 活动栏 */
            activeNames: ['baseInfo', 'commonInfo', 'moneyInfo'],
            /* 表单内容 */
            form: {
                /* 基本资料 */
                baseInfo: {
                    // 票券名称
                    name: {
                        value: '',
                        rules: {
                            required: true,
                            trigger: 'change',
                            validator: (rules, value, callback) => {
                                if (!value) {
                                    return callback(new Error('请输入票券名称'));
                                }

                                let param = {
                                    couponName: value
                                }
                                let pointer = this;
                                if (pointer.model.type == 'editi') {
                                    param[`id`] = pointer.model.id;
                                }
                                // 校验唯一性 debunch
                                if (pointer.time) clearTimeout(pointer.time);

                                pointer.time = setTimeout(() => {
                                    pointer.$ccmList.saleListCheckName(param).then(data => {
                                        if (data.flag == 1) {
                                            callback();
                                        } else {
                                            callback(new Error(`查询票券名重复错误:${data.msg}`));
                                        }
                                        clearTimeout(pointer.time);
                                    }).catch(msg => {
                                        callback(`查询票券名重复错误：${msg}`);
                                        clearTimeout(pointer.time);
                                    })
                                }, 1000);
                            }
                        }
                    },
                    // 票券类型
                    couponType: {
                        value: '0',
                        options: [{
                            label: '兑换券',
                            value: '0'
                        }, {
                            label: '代金券',
                            value: '1'
                        }, {
                            label: '优惠券',
                            value: '2'
                        }]
                    },
                    // 票券分类
                    couponTypeId: {
                        value: '',
                        options: [],
                        rules: {
                            required: true,
                            message: '请选择票券分类',
                            trigger: 'blur'
                        }
                    },
                    // 票券数量
                    couponCount: {
                        value: '',
                        rules: {
                            required: true,
                            validator: (rule, value, callback) => {
                                if(!value) {
                                    return callback(new Error('请输入票券数量'));
                                }
                                if (value > 0 && value < 100000) {
                                    return callback();
                                } else {
                                    return callback(new Error('请输入100000以内的数字'));
                                }
                            },
                            trigger: 'blur'
                        }
                    },
                    // 销售单价
                    couponPrice: {
                        value: '',
                        rules: {
                            required: true,
                            trigger: 'blur',
                            validator: function (rules, value, callback) {
                                if (!value) {
                                    return callback(new Error('请输入销售单价'));
                                }

                                const reg = /^(?!0{1,4})(\d{1,4}|10{4}|0)$/;

                                if (!reg.test(value)) {
                                    return callback(new Error('请输入大于0小于10000的整数'))
                                }

                                callback();
                            }
                        }
                    },
                    // 起售数量
                    startSaleNum: {
                        value: '',
                        rules: {
                            // required: true,
                            trigger: 'blur',
                            validator: (rules, value, callback) => {
                                if(!value) {
                                     //return callback(new Error('请输入起售数量'));
                                     return callback();
                                }
                                if(typeof value != 'string') {
                                    value = value.toString();
                                }
                                let couponCount = this.form.baseInfo.couponCount.value;
                                if (value > couponCount) {
                                    return callback(new Error('起售数量不能超过销售数量'))
                                }
                                callback();
                            }
                        }
                    },
                    // 销售方式
                    salesMode: {
                        value: 1,
                        options: [{
                            label: '影院临售',
                            value: 1
                        }, {
                            label: '营销活动',
                            value: 2
                        }, {
                            label: '大客户',
                            value: 3
                        }, {
                            label: '第三方合作',
                            value: 4
                        }]
                    },
                    // 客户Id名称 此项只在销售方式为'3','4'时出现，且必填
                    custId: {
                        value: '',
                        text: '',
                        rules: {
                            required: true,
                            validator: (rule, value, callback) => {
                                if (!value) {
                                    return callback(new Error('请选择客户名称'));
                                }
                                callback();
                            }
                        }
                    },
                    // 合同协议号 此项只在销售方式为'3','4'时出现
                    contractCode: {
                        value: '',
                    },
                    // 添加附件
                    attatchFile: {
                        value: '',
                        action: 'https://jsonplaceholder.typicode.com/posts/',
                        list: [],
                        limit: 1
                    },
                    // 入账影院
                    incomeCinemaId: {
                        value: '',
                        text: '',
                        rules: {
                            required: true,
                            message: '请选择入账影院',
                            trigger: 'blur'
                        }
                    },
                    // 票券编号
                    couponGeneration: {
                        value: '0',
                        options: [{
                            label: '系统生成',
                            value: '0'
                        }, {
                            label: '外部导入',
                            value: '1'
                        }, {
                            label: '使用预生成编号',
                            value: '2'
                        }]
                    },
                    // 导入票券编号
                    importFile: {
                        value: '',
                        action: 'https://jsonplaceholder.typicode.com/posts/',
                        list: [],
                        limit: 1
                    },
                    // 预生成编号ID
                    batchTicketIds: {
                        value: ''
                    },
                    // 备注
                    remark: {
                        value: ''
                    }
                },
                /* 票券消费规则 */
                commonInfo: {
                    // 有效期 需要拆分成 validDateStart 和 validDateEnd
                    validDate: {
                        value: [],
                        rules: {
                            required: true,
                            message: '请选择有效期范围'
                        }
                    },
                    // 节假日排除 指定排除日期范围
                    eliminationDate: {
                        value: [],
                        options: [{
                            label: '节假日除外',
                            value: 'not_HolidayOperator'
                        }, {
                            label: '指定排除日期范围',
                            value: 'not_DateRangeContainOperator'
                        }]
                    },
                    // 指定排除日期范围
                    appointInvalidDate: {
                        value: [{
                            value: ''
                        }]
                    },
                    // 星期范围
                    ruleValidWeek: {
                        value: '',
                        options: [{
                            label: '每天',
                            value: ''
                        }, {
                            label: '周一至周五',
                            value: 'WeekDateOperator'
                        }, {
                            label: '指定范围',
                            value: 'WeekDateRangeOperator'
                        }]
                    },
                    // 指定范围
                    week: {
                        value: [],
                        options: [{
                            label: '工作日',
                            value: 'workday',
                            check: false,
                            index: 0,
                            isIndeterminate: true,
                            list: ['1', '2', '3', '4', '5']
                        }, {
                            label: '星期一',
                            value: '1'
                        }, {
                            label: '星期二',
                            value: '2'
                        }, {
                            label: '星期三',
                            value: '3'
                        }, {
                            label: '星期四',
                            value: '4'
                        }, {
                            label: '星期五',
                            value: '5',
                            br: true
                        }, {
                            label: '周末',
                            value: 'holiday',
                            check: false,
                            index: 6,
                            isIndeterminate: true,
                            list: ['6', '7']
                        }, {
                            label: '星期六',
                            value: '6'
                        }, {
                            label: '星期天',
                            value: '7'
                        }],
                        rules: {
                            required: true,
                            message: '请选择指定范围'
                        }
                    },
                    // 时段范围
                    ruleValidTime: {
                        value: '',
                        options: [{
                            label: '全天有效',
                            value: ''
                        }, {
                            label: '上午（09:00—12:59）',
                            value: 'MorningOperator'
                        }, {
                            label: '下午（13:00—16:59）',
                            value: 'AfternoonOperator'
                        }, {
                            label: '晚上（17:00—02:00）',
                            value: 'NightOperator'
                        }, {
                            label: '指定时段',
                            value: 'TimeRangeContainOperator'
                        }]
                    },
                    // 指定时段
                    TimeRangeContainOperator: {
                        value: [{
                            value: ''
                        }]
                    },
                    // 影院范围
                    cinemaCode: {
                        value: '',
                        options: [{
                            label: '不限',
                            value: ''
                        }, {
                            label: '等于',
                            value: 'normalEqual'
                        }, {
                            label: '包含',
                            value: 'normalIn'
                        }]
                    },
                    // 指定 等于
                    cinemarangev: {
                        value: '',
                        text: '',
                        rules: {
                            required: true,
                            message: '请选择影院范围'
                        }
                    },
                    // 消费渠道
                    consumeWayCode: {
                        value: '',
                        options: [{
                            label: '不限',
                            value: ''
                        }, {
                            label: '指定消费渠道',
                            value: 'normalIn'
                        }]
                    },
                    // 指定消费渠道
                    consumeWayCodeOp: {
                        value: [],
                        options: [{
                            label: '柜台',
                            value: '0'
                        }, {
                            label: '自助终端',
                            value: '1'
                        }, {
                            label: '官方网站',
                            value: '2'
                        }, {
                            label: '手机及微信',
                            value: '3'
                        }, {
                            label: '电话',
                            value: '4'
                        }, {
                            label: '第三方渠道',
                            value: 'T'
                        }],
                        rules: {
                            required: true,
                            message: '请选择消费渠道'
                        }
                    },
                    // 消费者身份
                    consumerTypeKey: {
                        value: '',
                        options: [{
                            label: '不限',
                            value: ''
                        }, {
                            label: '全部会员',
                            value: 'AllMember'
                        }, {
                            label: '指定会员等级',
                            value: 'normalIn'
                        }]
                    },
                    // 指定会员等级
                    consumerType: {
                        text: '',
                        value: '',
                        rules: {
                            required: true,
                            message: '请选择消费者身份'
                        }
                    },
                    // 会员生日
                    MemberInfo: {
                        value: '',
                        options: [{
                            label: '不限',
                            value: ''
                        }, {
                            label: '生日当天',
                            value: 'EqualCurrentDay'
                        }, {
                            label: '生日当月',
                            value: 'EqualCurrentMoney'
                        }, {
                            label: '生日前后N日',
                            value: 'EqualCurrentDayOffset'
                        }]
                    },
                    // 生日前后N天
                    memberBirthdayOffset: {
                        value: '',
                        rules: {
                            required: true,
                            message: '生日前后N天为必填字段'
                        }
                    }
                },
                /* 代金规则 */
                moneyInfo: {
                    // 代金券面值(抵用金额)
                    voucherValue: {
                        value: '',
                        rules: {
                            required: true,

                            message: '请输入代金券面值（抵用金额）'
                        }
                    },
                    // 代金券消费密码
                    voucherIsPassword: {
                        value: false
                    },
                    // 是否需要代金券消费密码
                    voucherPasswordType: {
                        value: '1',
                        options: [{
                            label: '随机密码（一票一码）',
                            value: '1'
                        }, {
                            label: '统一密码',
                            value: '2'
                        }]
                    },
                    // 消费密码
                    voucherPassword: {
                        value: '',
                        rules: [{
                            required: true,
                            message: '请输入密码'
                        }]
                    },
                    // 允许购买商品范围
                    saleItemType: {
                        value: '',
                        options: [{
                            label: ' 不限',
                            value: ''
                        }, {
                            label: '电影票',
                            value: '0'
                        }, {
                            label: '卖品',
                            value: '1'
                        }]
                    },
                    // 每笔消费金额不小于
                    sumPrice: {
                        value: '',
                        rules: {
                            required: true,
                            message: '请输入消费金额'
                        }
                    }
                }
            },
            /* 兑换规则 */
            ruleInfo: {
                config: {
                    title: '',
                    router: '',
                    showType: ''
                },
                isShow: false
            },
            /* 弹窗属性 */
            alert: {
                isShow: false,
                // 可选项
                options: {
                    // 客户名称
                    custId: {
                        src: 'http://192.168.100.148:8080/alertWindow',
                        param: {
                            test: '汉字自翼虎'
                        },
                        callFnName: 'baseInfo_custId'
                    },
                    // 入账影院
                    incomeCinemaId: {
                        src: 'http://192.168.100.148:8080/alertWindow',
                        param: {
                            test: '汉字自翼虎'
                        },
                        callFnName: 'baseInfo_incomeCinemaId'
                    },
                    // 使用预生成编号
                    couponGeneration: {
                        src: 'http://192.168.100.148:8080/alertWindow',
                        param: {
                            test: '汉字自翼虎'
                        },
                        callFnName: 'baseInfo_couponGeneration'
                    },
                    // 影院范围 指定 等于
                    cinemarangev: {
                        src: 'http://192.168.100.148:8080/alertWindow',
                        param: {
                            test: '汉字自翼虎'
                        },
                        callFnName: 'commonInfo_cinemarangev'
                    },
                    // 指定消费者身份
                    consumerType: {
                        src: 'http://192.168.100.148:8080/alertWindow',
                        param: {
                            test: '汉字自翼虎'
                        },
                        callFnName: 'commonInfo_consumerType'
                    }
                },
                // 当前弹窗
                config: {

                }
            },
            ruleChild: [],
            showRule: [],
            limitName: []
        }
    },
    created() {
        // 当前是否为修改状态
        let isEdit = this.$route.params.isEdit ? this.$route.params.isEdit : false;
        if (isEdit) {
            let type = 'editi';

            let isCopy = this.$route.params.isCopy ? this.$route.params.isCopy : false;
            if (isCopy) {
                type = 'copy';
            }

            this.model.type = type;

            this.editiSaleList(this.$route.params.applyCode);
            this.getcouponTypeId(this.form.baseInfo.couponType.value);
            return ;
        }

        // 是否需要从缓存中拿取之前的操作
        let isGetForm = this.$route.params.isGetForm ? this.$route.params.isGetForm : false;
        if (isGetForm) {
            // 从vuex上获取数据
            let params = this.$store.getters['saleList/getForm'];
            let keyArray = Object.keys(params);
            keyArray.forEach((item, index) => {
                this[`${item}`] = JSON.parse(JSON.stringify(params[`${item}`]));
            });
            // 清空缓存
            this.$store.commit('saleList/deleteForm');
        }
        // 是否需要获取rule
        let isGetRule = this.$route.params.isGetRule ? this.$route.params.isGetRule : false;
        if (isGetRule) {
            // 从vuex上获取数据
            let params = this.$store.getters['saleList/getChildRule'];
            let editIndex = this.$route.params.editIndex;
            if (editIndex != null) {
                this.ruleChild.splice(editIndex, 1, JSON.parse(JSON.stringify(params.ruleChild)));
            } else {
                this.ruleChild.push(JSON.parse(JSON.stringify(params.ruleChild)));
            }
            // 清空缓存
            this.$store.commit('saleList/deleteChildRule');
        }
        // 展示ruleChild
        this.showRuleData(this.ruleChild);
        // 查询当前票券分类类型
        this.getcouponTypeId(this.form.baseInfo.couponType.value);
    },
    methods: {
        /**
         * @function editiSaleList - 编辑销售单
         * 
         * @param {String} applyCode - 销售申请单号
         */
        editiSaleList(applyCode) {
            let param = {
                applyCode
            }
            this.$ccmList.checkSaleList(param).then((data) => {
                if (data.flag == 1) {
                    saleListUtil.unPackageForm(data.data, this);
                }
            }).catch((msg) => {
                console.log('编辑销售申请单错误：', msg);
            });
        },
        /**
         * @function selectInputValue - 选择，调起弹窗
         * @param {String} formName -  表单名
         */
        selectInputValue(inputName) {
            if (typeof inputName != 'string') {
                return TypeError('select方法只接受string类型，您输入的类型是：', typeof inputName);
            }

            let options = this.alert.options;
            if (!options[`${inputName}`]) {
                return TypeError('alertConfigs对象中不包含：', inputName);
            }

            this.alert.config = options[`${inputName}`];
            this.alert.isShow = true;
        },
        /**
         * @function clearInputValue - 清空输入框
         * @param {String} inputName - 需要清空的输入框名
         * @param {String} formName -  表单名
         * @param {String} [type='both'] 可选值传入既清空 text 和 value 否在只清空 value
         */
        clearInputValue(inputName, formName, type) {
            if (type == 'both') {
                this.form[`${formName}`][`${inputName}`].text = '';
            }

            this.form[`${formName}`][`${inputName}`].value = '';
        },
        /**
         * @function alertCallBack - 弹窗回调
         */
        alertCallBack(param) {
            if (param.callFnName) {
                this[`changeInput`](param.callFnName, param);
            }
            this.alert.isShow = false;
            this.alert.config = {};
        },
        /**
         * @function changeInput - 修改输入框的值
         */
        changeInput(callFnName, param) {
            let formName = callFnName.split('_')[0];
            let keyName = callFnName.split('_')[1];

            if (keyName == 'couponGeneration') {
                if (param.isCancle) {
                    this.form.baseInfo.couponGeneration.value = '0';
                    this.form.baseInfo.batchTicketIds.value = '';
                } else {
                    // 使用预生成编号生成方式时，选择的票券id
                    this.form[`${formName}`].batchTicketIds.value = param.data;
                }
            } else {
                // text 为展示给用户的信息
                this.form[`${formName}`][`${keyName}`].text = param.data;
                // value 为传递给后端的数据
                this.form[`${formName}`][`${keyName}`].value = param.data;
            }
        },
        /**
         * @function handlePreview - 点击文件列表中已上传的文件时的钩子
         */
        handlePreview() {},
        /**
         * @function downloadTemplate - 下载导入模板
         */
        downloadTemplate() {},
        /**
         * @function addOrRemove - 添加或移除指定排除日期
         */
        addOrRemove(index) {
            if (index != 0) {
                let appointInvalidDate = JSON.parse(JSON.stringify(this.form.commonInfo.appointInvalidDate.value));
                appointInvalidDate.splice(index, 1);
                this.form.commonInfo.appointInvalidDate.value = appointInvalidDate;
            } else {
                this.form.commonInfo.appointInvalidDate.value.push({
                    value: ''
                });
            }
        },
        /**
         * @function handleSelectType - 选中对应项 星期范围
         */
        handleSelectType(check, param) {
            let isIndeterminate = param.isIndeterminate;

            if (!isIndeterminate) {
                return;
            }
            let isCheck = check;
            let weekArray = JSON.parse(JSON.stringify(this.form.commonInfo.week.value));
            let currentList = param.list;
            if (isCheck) {
                // 校验是否已经存在
                for (let i = 0; i < currentList.length; i++) {
                    let currentItem = currentList[i];
                    if (!weekArray.includes(currentItem)) {
                        weekArray.push(currentItem);
                    }
                }
            } else {
                for (let i = 0; i < currentList.length; i++) {
                    let currentItem = currentList[i];
                    for (let j = 0; j < weekArray.length; j++) {
                        if (weekArray[j] == currentItem) {
                            weekArray.splice(j, 1);
                        }
                    }
                }
            }
            this.form.commonInfo.week.value = weekArray;
        },
        /**
         * @function addOrRemoveTimeRangeContainOperator - 添加或移除指定时段
         */
        addOrRemoveTimeRangeContainOperator(index) {
            if (index != 0) {
                let timeArr = JSON.parse(JSON.stringify(this.form.commonInfo.TimeRangeContainOperator.value));
                timeArr.splice(index, 1);
                this.form.commonInfo.TimeRangeContainOperator.value = timeArr;
            } else {
                this.form.commonInfo.TimeRangeContainOperator.value.push({
                    value: ''
                });
            }
        },
        /**
         * @function resetcouponTypeId - 重置票券分类选择
         * @param  {String} couponType - '0':兑换券;'1':代金券;'2':优惠券;
         */
        resetcouponTypeId(couponType) {
            this.form.baseInfo.couponTypeId.value = '';
            this.ruleInfo.isShow = false;

            this.getcouponTypeId(couponType);
        },
        /**
         * @function getcouponTypeId - 
         */
        getcouponTypeId(couponType) {
            let params = {
                couponName: '',
                couponType,
                couponTypeStatus: 0,
                pageNo: 1,
                pageSize: 1000
            };
            this.$ccmList.findCouponList(params).then(data => {
                if (data.flag == 1) {
                    let couponDataArr = data.data;
                    let couponArr = [];
                    couponDataArr.forEach(item => {
                        let label = item.couponName,
                            value = item.id;
                        couponArr.push({
                            label,
                            value
                        });
                    });
                    this.form.baseInfo.couponTypeId.options = couponArr;
                } else {
                    this.$message({
                        type: 'warning',
                        message: `查询票券分类错误：${msg}`
                    });
                }
            }).catch(msg => {
                console.log(`查询票券分类错误：${msg}`);
            });
        },
        /**
         * @function couponGeneration - 票券编号方式
         * @descrition 当选择预生成编号生成方式时，唤起弹窗，选择的票券id
         */
        couponGeneration(val) {
            if (val == '2') {
                this.selectInputValue('couponGeneration');
            }
        },
        /**
         * @function changeTicketType - 根据票券类型,是否选择修改跳转路由
         */
        changeTicketType() {
            let type = this.form.baseInfo.couponType.value;
            let title = '';
            let showType;
            let router;
            switch (type) {
                case '0':
                    title = '兑换';
                    showType = '0';
                    router = 'createExchange';
                    break;
                case '1':
                    title = '代金';
                    showType = '1';
                    router = '';
                    break;
                case '2':
                    title = '优惠';
                    showType = '2';
                    router = 'createFavourable';
                    break;
                default:
                    break;
            }
            let config = {
                title: title + '规则',
                showType,
                router,
            }
            this.ruleInfo.config = config;
            this.ruleInfo.isShow = true;
        },
        /**
         * @function saveForm - 缓存表格
         */
        saveForm() {
            // 缓存填写信息
            this.$store.commit('saleList/updateForm', {
                model: this.model,
                form: this.form,
                ruleInfo: this.ruleInfo,
                ruleChild: this.ruleChild
            });
        },
        /**
         * @function editionRule - 添加或编辑子项规则
         */
        editionRule(type, index) {
            let _type = this.form.baseInfo.couponType.value == '0' ? 'exchange' : 'favourable';

            this.saveForm();

            if (type == 'edit') {
                this.$store.commit('saleList/updateChildRule', {
                    ruleChild: this.ruleChild[index]
                });
            }

            this.$router.push({
                path: 'setRuleItem',
                query: {
                    type: _type,
                    familyIdBaseNum: (new Date()).getTime(),
                    isEdition: type == 'edit' ? true : false,
                    editIndex: type == 'edit' ? index : null,
                    limitName: this.limitName
                }
            })
        },
        /**
         * @function deleteRule - 删除子规则
         */
        deleteRule(index) {
            this.ruleChild.splice(index, 1);
            this.showRuleData(this.ruleChild);
        },
        /**
         * @function removeAttatchFile - 移除合同协议号附件文件
         */
        removeAttatchFile(file, fileList) {
            this.$refs[`attatchFile`].abort();
            this.form.baseInfo[`attatchFile`].value = '';
            this.form.baseInfo[`attatchFile`].list = [];
        },
        /**
         * @function removeImportFile - 移除外部导入文件
         */
        removeImportFile(file, fileList) {
            this.$refs[`importFile`].abort();
            this.form.baseInfo[`importFile`].value = '';
            this.form.baseInfo[`importFile`].list = [];
        },
        /**
         * @function setAttatchFile - 设置合同协议附件
         */
        setAttatchFile(file, fileList) {
            this.fileReader('attatchFile', file, this);
        },
        /**
         * @function setImportFile - 设置外部导入票券文件
         */
        setImportFile(file, fileList) {
            this.fileReader('importFile', file, this);
        },
        /**
         * @function fileReader - 文件转化，分发
         */
        fileReader(type, file, pointer) {
            let _file = file.raw;
            // 10M
            let limitSize = 10485760;
            if (_file.size > limitSize) {
                pointer.$refs[`${type}`].clearFiles();

                pointer.$message({
                    type: 'warning',
                    message: '您上传的内容已超过10M',
                    showClose: true
                });

                return;
            }

            let fileReader = new FileReader();

            pointer.form.baseInfo[`${type}`].list.push({
                name: file.name,
                url: file.url
            });

            fileReader.readAsDataURL(_file);

            fileReader.onload = () => {
                pointer.form.baseInfo[`${type}`].value = `${file.name}(_file_)${fileReader.result}`;
            };

        },
        /**
         * @function saveOrSubmit - 保存/提交审批
         * 
         * @param {Number} flag - 1：保存；2：保存并提交审批
         */
        saveOrSubmit(formName, flag) {
            this.$refs[formName].validate((valid) => {
                if (valid) {

                    if (this.form.baseInfo.couponType.value != '1' && this.ruleChild.length == 0) {
                        return this.$message({
                            message: '请添加规则项',
                            type: 'warning'
                        });
                    };

                    let param = this.packageParam(this.form, flag);

                    this.$ccmList.saleListSaveOrUpdate(param).then(data => {
                        let type = '';
                        if (data.flag == 1) {
                            type = 'success';
                        } else {
                            type = 'warning';
                        }

                        this.$message({
                            type,
                            message: data.msg
                        });

                        if (type == 'success') {
                            this.$router.push({
                                path: 'salesManagement'
                            });
                        }

                    }).catch(msg => {
                        console.log(`${this.model.type == 'change' ? '更新' : '新建'}票券销售申请单错误：${msg}`);
                    });

                }
            });
        },
        /**
         * @function cancle - 取消
         */
        cancle() {
            this.$router.push({
                path: 'salesManagement'
            });
        },
        /**
         * @function packageParam - 组装数据
         * 
         * @param {Object} form 需要组装的表单 
         * @param {Number} flag - 1：保存；2：保存并提交审批
         * 
         * @returns {Object} param 请求参数 
         */
        packageParam(form, flag) {
            // 基本资料
            let baseInfo = form.baseInfo;
            // 票券消费规则
            let commonInfo = form.commonInfo;
            // 代金规则 票券类型为 (代金券:1) 存在
            let moneyInfo = form.moneyInfo;

            let param = {
                flag
            };

            // 修改的时候需要传
            let modelType = this.model.type;
            if (modelType == 'editi') {
                param[`applyCode`] = this.model.applyCode;
                param[`id`] = this.model.id;
            }

            let keyArr_baseInfo = ['couponType', 'couponTypeId', 'couponCount', 'couponPrice', 'startSaleNum', 'salesMode', 'incomeCinemaId', 'couponGeneration'];
            keyArr_baseInfo.forEach((item, index) => {
                let value = baseInfo[`${item}`].value;
                param[`${item}`] = value;

                // 销售模式
                if (item == 'salesMode' && (value == '3' || value == '4')) {
                    // 客户id
                    param[`custId`] = baseInfo[`custId`].value;
                    // 合同协议号
                    let contractCodeVal = baseInfo[`contractCode`].value;
                    if (contractCodeVal) {
                        param[`contractCode`] = contractCodeVal;
                    }
                    // 添加附件
                    let attatchFileVal = baseInfo[`attatchFile`].value;
                    if (attatchFileVal) {
                        param[`attatchFile`] = attatchFileVal;
                    }
                }
                // 票券编号
                if (item == 'couponGeneration') {
                    let importFileVal = baseInfo[`importFile`].value;
                    let batchTicketIdsVal = baseInfo[`batchTicketIds`].value;
                    // 合同协议附件
                    if (value == '1' && importFileVal) {
                        param[`importFile`] = importFileVal;
                    } else if (value == '2') {
                        param[`batchTicketIds`] = batchTicketIdsVal;
                    }
                }
            })

            // 组装commonInfo
            let param_commonInfo = this.packageCommonInfo(commonInfo, this);

            // 规则组
            let simpleRuleGroupStr = {
                ruleType: 'CouponSale',
                name: baseInfo[`name`].value,
                remark: baseInfo[`name`].value,
                validDateStart: this.timeRule(commonInfo[`validDate`].value[0]),
                validDateEnd: this.timeRule(commonInfo[`validDate`].value[1]),
                commonInfo: param_commonInfo,
                rules: []
            }

            // 代金券
            if (baseInfo[`couponType`].value == '1') {
                // 代金券面值（抵用金额）
                param[`voucherValue`] = moneyInfo[`voucherValue`].value;

                // 代金券是否需要密码，1-不需要，2-需要
                let isPassword = moneyInfo[`voucherIsPassword`].value;
                let passwordVal = 1;
                if (isPassword) {
                    passwordVal = 2;
                }
                param[`voucherIsPassword`] = passwordVal;

                // 代金券消费密码类型，1-随机，2-统一密码
                let passwordTypeVal = moneyInfo[`voucherPasswordType`].value;
                param[`voucherPasswordType`] = passwordTypeVal;
                if (passwordTypeVal == '2') {
                    param[`voucherPassword`] = moneyInfo[`voucherPassword`].value;
                }

                let voucherRulesObj = {
                    ruleConditions: [],
                    actions: []
                }
                // ruleConditions
                // 允许购买商品范围
                let saleItemTypeVal = moneyInfo[`saleItemType`].value;
                if (saleItemTypeVal) {
                    let obj = {
                        key: 'saleItemType',
                        category: 'SaleItemInfo',
                        opUniqueName: 'normalEqual',
                        value: saleItemTypeVal
                    }
                    voucherRulesObj.ruleConditions.push(obj);
                }

                // 每笔消费金额不小于
                voucherRulesObj.ruleConditions.push({
                    key: 'sumPrice',
                    category: 'SaleInfo',
                    opUniqueName: 'normalGreaterEqual',
                    value: moneyInfo[`sumPrice`].value
                });

                // actions
                // 抵用金额
                voucherRulesObj.actions.push({
                    key: 'cashValue',
                    value: moneyInfo[`sumPrice`].value,
                    familyId: '1',
                    opUniqueName: 'CashCouponMoneyFunction'
                });

                simpleRuleGroupStr.rules.push(voucherRulesObj);

            } else {
                simpleRuleGroupStr.rules = this.ruleChild;
            }
            param[`simpleRuleGroupStr`] = JSON.stringify(simpleRuleGroupStr);

            return param;

        },
        /**
         * @function packageCommonInfo - 组装commonInfo
         * 
         * @param  {Object} form.commonInfo 票券消费规则
         * @param {Object} pointer - this指针
         * @returns {Array} commonInfo
         */
        packageCommonInfo(param, pointer) {

            let commonInfo = [];

            // 节假日排除与否
            if (param[`eliminationDate`].value.includes('not_HolidayOperator')) {
                let obj = {
                    key: 'holiday',
                    category: 'CommonInfo',
                    opUniqueName: 'not_HolidayOperator'
                }
                commonInfo.push(obj);
            }

            // 指定排除日期范围
            if (param[`eliminationDate`].value.includes('not_DateRangeContainOperator')) {
                let obj = {
                    key: 'appointInvalidDate',
                    category: 'CommonInfo',
                    opUniqueName: 'not_DateRangeContainOperator'
                }

                let timeArr = param[`appointInvalidDate`].value;

                let _timeArr = [];
                for (let i = 0; i < timeArr.length; i++) {
                    let item = timeArr[i].value;
                    _timeArr.push([pointer.timeRule(item[0]), pointer.timeRule(item[1])]);
                }
                obj['value'] = JSON.stringify(_timeArr);
                commonInfo.push(obj);
            }

            // 星期范围
            let ruleValidWeekVal = param[`ruleValidWeek`].value;
            if (ruleValidWeekVal) {
                let obj = {
                    key: 'validWeek',
                    category: 'CommonInfo',
                    opUniqueName: ruleValidWeekVal
                }
                // 指定范围
                if (ruleValidWeekVal == 'WeekDateRangeOperator') {
                    let weekArr = param[`week`].value;
                    let weekStr = '';
                    for (let i = 0; i < weekArr.length; i++) {
                        let item = weekArr[i];
                        if (item != 'workday' && item != 'holiday') {
                            weekStr += i == weekArr.length - 1 ? item : `${item},`
                        }
                    }
                    obj[`value`] = weekStr;
                }
                commonInfo.push(obj);
            }

            // 时段范围
            let ruleValidTimeVal = param[`ruleValidTime`].value;
            if (ruleValidTimeVal) {
                let obj = {
                    key: 'validTime',
                    category: 'CommonInfo',
                    opUniqueName: ruleValidTimeVal
                }
                // 指定时段
                if (ruleValidTimeVal == 'TimeRangeContainOperator') {
                    let timeArr = param[`TimeRangeContainOperator`].value;
                    let _timeArr = [];

                    for (let i = 0; i < timeArr.length; i++) {
                        let item = timeArr[i].value;

                        _timeArr.push([pointer.timeRule(item[0], 'hours'), pointer.timeRule(item[1], 'hours')]);
                    }
                    obj[`value`] = JSON.stringify(_timeArr);
                }
                commonInfo.push(obj);
            }

            // 影院范围
            let cinemaCodeVal = param[`cinemaCode`].value;
            if (cinemaCodeVal) {
                let obj = {
                    key: 'cinemaCode',
                    category: 'SaleInfo',
                    opUniqueName: cinemaCodeVal,
                    value: param[`cinemarangev`].value,
                    text: param[`cinemarangev`].text
                }
                commonInfo.push(obj);
            }

            // 消费渠道
            let consumeWayCodeVal = param[`consumeWayCode`].value;
            if (consumeWayCodeVal) {
                let obj = {
                    key: 'consumeWayCode',
                    category: 'SaleInfo',
                    opUniqueName: consumeWayCodeVal
                };
                // 指定消费渠道
                if (consumeWayCodeVal == 'normalIn') {
                    let typeArr = param[`consumeWayCodeOp`].value;
                    let typeStr = '';
                    for (let i = 0; i < typeArr.length; i++) {
                        typeStr += i == typeArr.length - 1 ? typeArr[i] : `${typeArr[i]},`;
                    }
                    obj[`value`] = typeStr;
                }
                commonInfo.push(obj);
            }

            // 消费者身份
            let consumerTypeVal = param[`consumerTypeKey`].value;
            if (consumerTypeVal) {
                let obj = {
                    key: 'consumerTypeKey',
                    category: 'SaleInfo',
                    opUniqueName: consumerTypeVal
                }
                // 指定消费者身份
                if (consumerTypeVal == 'normalIn') {
                    obj[`value`] = param[`consumerType`].value;
                }
                commonInfo.push(obj);
            }

            // 会员生日
            let MemberInfoVal = param[`MemberInfo`].value;
            if (MemberInfoVal) {
                let obj = {
                    key: 'birthday',
                    category: 'MemberInfo',
                    opUniqueName: MemberInfoVal
                }
                // 生日前后N日
                if (MemberInfoVal == 'EqualCurrentDayOffset') {
                    obj[`value`] = param[`memberBirthdayOffset`].value;
                }
                commonInfo.push(obj);
            }

            return commonInfo;
        },
        /**
         * @function timeRule - 格式化时间 用于后台传参
         * 
         * @param {String} time - 时间
         * @param {String} [type] - 格式化类型 00:00 可不传，格式化为年月日
         */
        timeRule(time, type) {
            try {
                let _time = new Date(time);

                let _year = _time.getFullYear(),
                    _mounth = _time.getMonth() + 1,
                    _day = _time.getDate(),
                    _hours = _time.getHours(),
                    _minutes = _time.getMinutes();

                let returnStr = `${_year}-${_mounth}-${_day}`;

                if (type == 'hours') {
                    returnStr = `${_hours}:${_minutes}`;
                }

                return returnStr;

            } catch (msg) {
                console.log(new TypeError('转换时间类型错误：', msg));
            }
        },
        /**
         * @function showRule - 展示ruleChild
         */
        showRuleData(ruleChild) {
            let showRule = [];
            // 用于限制同一规则组里面出现命名重复
            let limitName = [];
            for (let i = 0; i < ruleChild.length; i++) {
                let _obj = {};
                let item = ruleChild[i];
                let containSaleItemType = item.bizPropertyMap.containSaleItemType;
                // let _actions = item.actions;
                // let _ruleCondition = item.ruleConditions

                _obj[`name`] = item.name;
                limitName.push(item.name);
                let _arr = [];

                if (containSaleItemType.indexOf('0') != -1) {
                    _arr.push({
                        name: '影票',
                        text: '不限'
                    })
                }
                if (containSaleItemType.indexOf('1') != -1) {
                    _arr.push({
                        name: '卖品',
                        text: '不限'
                    })
                };
                _obj[`child`] = _arr;
                showRule.push(_obj);
            }
            this.showRule = showRule;
            this.limitName = limitName;
        },
    },
}
</script>

<style lang="scss" scoped>
@mixin font-base {
    font {
        family: 'MicrosoftYaHei';
        size: 12px;
    }

    color: #333333;
    letter-spacing: 0;
    text-align: left;
    line-height: 15px;
}

@each $i in 5,
10,
15,
20 {
    .margin-left-#{$i} {
        margin-left: #{$i}px;
    }

    .margin-right-#{$i} {
        margin-right: #{$i}px;
    }

    .margin-top-#{$i} {
        margin-top: #{$i}px;
    }

    .margin-bottom-#{$i} {
        margin-bottom: #{$i}px;
    }
}

.tips-font {
    font-size: 12px;
    color: grey;
}

.upload {
    margin-left: 5px;
    display: flex;
}

.rule-window {
    $margin15: 15px;

    &>li {
        margin-left: $margin15;
        margin-bottom: $margin15;
    }
}

.rule-item {
    $ruleWidth: 160px;
    width: 200px;
    height: 90px;
    background: #F2F4FD;
    border: 1px solid #3B74FF;
    border-radius: 4px;
    align-content: center;
    justify-content: center;
    position: relative;

    .rule-title {
        @include font-base;
        width: $ruleWidth;
        font-weight: bold;
        margin-bottom: 8px;
    }

    .rule-content {
        width: $ruleWidth;
        height: 40px;
        justify-content: flex-start;
        align-items: flex-start;

        .rule-content-title {
            @include font-base;
            margin-right: 8px;
        }

        .rule-content-content {
            @include font-base;
        }
    }

    $margin: 6px;

    .delete-btn {
        $wh: 14px;
        position: absolute;
        right: $margin;
        top: $margin;
        width: $wh;
        height: $wh;
        cursor: pointer;

        i {
            display: inherit;
        }

        &:hover {
            color: #3B74FF;
        }
    }

    .change-text {
        cursor: pointer;
        position: absolute;
        right: $margin;
        bottom: $margin;
        @include font-base;

        &:hover {
            color: #3B74FF;
        }
    }
}

.addRule {
    $width: 90px;
    width: $width;
    height: $width;
    background: #FFFFFF;
    border: 1px dashed #BCBCBC;
    border-radius: 4px;
    justify-content: center;
    cursor: pointer;

    &:hover {
        border: 1px dashed #3B74FF;

        i {
            color: #3B74FF;
        }
    }
}

.change-label .el-form-item__label {
    line-height: 20px;
}
</style>
