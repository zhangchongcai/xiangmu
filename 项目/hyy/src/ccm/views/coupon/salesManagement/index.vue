<template>
<div class="table-page">
    <!-- 搜索栏 -->
    <section class="search-section">
        <searchLan :modelName="modelName" :config="searchConfig" @pressSearch="search" :searchLevelButton="searchLevelButton" @searchValueChange="setSearch"></searchLan>
    </section>

    <!-- 按钮组 -->
    <section class="btnGroup-section flex-base flex-end">
        <el-button type="primary" plain @click="create">新建</el-button>
    </section>

    <!-- 表格 -->
    <section class="table-section">
        <el-table :data="table.data" style="width: 100%">
            <template v-for="(item,index) in table.title">
                <el-table-column :key="index" v-if="!item.hasTemplate" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
                <el-table-column :key="index" v-if="item.hasTemplate" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed">
                    <template slot-scope="scope">
                        <div v-if="item.prop == 'couponType'">
                            {{scope.row.couponType == '0' ? '兑换券' : scope.row.couponType == '1' ? '代金券' : '优惠券'}}
                        </div>
                        <div v-if="item.prop == 'state'">
                            {{ticketStatus(scope.row.state)}}
                        </div>
                        <div v-else-if="item.prop == 'auditState'">
                            {{auditStatus(scope.row.auditState)}}
                        </div>
                        <div v-else-if="item.prop == 'validDateStart' || item.prop == 'validDateEnd'">
                            {{tiemRule(scope.row[`${item.prop}`])}}
                        </div>
                        <div v-else-if="item.label == '操作'">
                            <el-row>
                                <!-- 此处返回一级操作菜单 -->
                                <el-button v-for="(item,index) in level1Template(scope.row.auditState, scope.row.state)" :key="index" type="text" @click="controlEmitFn(item.emitFn,scope.row)">{{item.label}}</el-button>
                                <!-- 此处返回更多操作菜单 -->
                                <el-dropdown @command="commandLevel2">
                                    <span class="el-dropdown-link">更多<i class="el-icon-arrow-down el-icon--right"></i></span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item v-for="(item,index) in level2Template(scope.row.auditState, scope.row.state)" :key="index" :command="[scope.row,item]">{{item.label}}</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </el-row>
                        </div>
                    </template>
                </el-table-column>
            </template>
        </el-table>
    </section>

    <!-- 分页 -->
    <section class="pagination-section flex-base flex-center" v-if="table.data.length != 0">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.pageNo" :page-sizes="pageConfig.pageSizes" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.total">
        </el-pagination>
    </section>

    <!-- 弹窗 -->
    <el-dialog title="票券延期" :visible.sync="delayWindow.isShow">
        <el-form>
            <el-form-item label="调整票券有效期:" :label-width="delayWindow.labelWidth">
                <el-row class="flex-base">
                    <span>{{delayWindow.validDateStart}}</span>
                    <span class="delayLine"> - </span>
                    <el-date-picker v-model="delayWindow.validDateEnd" align="right" type="date" placeholder="选择日期" :picker-options="delayWindow.pickerOptions"></el-date-picker>
                </el-row>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancleDelay">取 消</el-button>
            <el-button type="primary" @click="sureDelay">确 定</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import searchLan from '../../../components/search/index.vue';
export default {
    components: {
        searchLan
    },
    data() {
        let pointer = this;
        return {
            modelName: 'salesManagement',
            searchLevelButton: true,
            searchConfig: [{
                    keyName: 'incomeCinemaId',
                    name: '入账影院',
                    type: 'input',
                    value: {
                        value: '',
                        text: ''
                    },
                    readonly: true,
                    alertButton: true,
                    alertSrc: 'http://192.168.100.148:8080/alertWindow',
                }, {
                    keyName: 'applyCode',
                    name: '申请单号',
                    type: 'input',
                    value: ''
                }, {
                    keyName: 'couponName',
                    name: '票券名称',
                    type: 'input',
                    value: ''
                }, {
                    keyName: 'queryCreateUserName',
                    name: '申请人',
                    type: 'input',
                    // value: {
                    //     value: '',
                    //     text: ''
                    // },
                    // alertButton: true,
                    // readonly: true,
                    value:'',
                    alertSrc: 'http://192.168.100.148:8080/alertWindow',
                },
                {
                    keyName: 'proposDate',
                    name: '申请日期',
                    type: 'date-picker',
                    level: 'hight',
                    value: ''
                }, {
                    keyName: 'contractCode',
                    name: '合同协议号',
                    type: 'input',
                    level: 'hight',
                    value: ''
                }, {
                    keyName: 'custId',
                    name: '客户名称',
                    type: 'input',
                    level: 'hight',
                    value: {
                        value: '',
                        text: ''
                    },
                    readonly: true,
                    alertButton: true,
                    alertSrc: 'http://192.168.100.148:8080/alertWindow',
                },
                {
                    keyName: 'couponType',
                    name: '票券类型',
                    type: 'select',
                    level: 'hight',
                    value: '',
                    options: [{
                        label: '全部',
                        value: ''
                    }, {
                        label: '兑换券',
                        value: '0'
                    }, {
                        label: '优惠券',
                        value: '2'
                    }, {
                        label: '代金券',
                        value: '1'
                    }, ]
                }, {
                    keyName: 'state',
                    name: '状态',
                    type: 'select',
                    level: 'hight',
                    value: '',
                    options: [{
                        label: '全部',
                        value: ''
                    }, {
                        label: '未提交',
                        value: '0'
                    }, {
                        label: '新建',
                        value: '1'
                    }, {
                        label: '已激活',
                        value: '2'
                    }, {
                        label: '已停用',
                        value: '3'
                    }, {
                        label: '已作废',
                        value: '4'
                    }, {
                        label: '已过期',
                        value: '5'
                    }, {
                        label: '已删除',
                        value: '6'
                    }, {
                        label: '票券验证中',
                        value: '7'
                    }, {
                        label: '票券验证不通过',
                        value: '8'
                    }, {
                        label: '票券生成中',
                        value: '9'
                    }]
                }, {
                    keyName: 'batchCode',
                    name: '销售批次号',
                    type: 'input',
                    level: 'hight',
                    value: '',
                }, {
                    keyName: 'auditState',
                    name: '审批状态',
                    type: 'select',
                    level: 'hight',
                    value: '',
                    options: [{
                        label: '全部',
                        value: '1'
                    }, {
                        label: '未审批',
                        value: '2'
                    }, {
                        label: '审批通过',
                        value: '3'
                    }, {
                        label: '审批未通过',
                        value: '4'
                    }]
                }, {
                    keyName: 'ticketTimeUp',
                    name: '票券过期日期',
                    type: 'date-picker',
                    level: 'hight',
                    value: ''
                }
            ],
            table: {
                title: [{
                    label: '申请单号',
                    prop: 'applyCode',
                    width: '200'
                }, {
                    label: '票券名称',
                    prop: 'couponName',
                    width: '200'
                }, {
                    label: '票券类型',
                    prop: 'couponType',
                    width: '200'
                }, {
                    label: '数量',
                    prop: 'couponCount',
                    width: '200'
                }, {
                    label: '有效期起',
                    prop: 'validDateStart',
                    width: '200',
                    hasTemplate: true
                }, {
                    label: '有效期止',
                    prop: 'validDateEnd',
                    width: '200',
                    hasTemplate: true
                }, {
                    label: '客户名称',
                    prop: 'custName',
                    width: '200'
                }, {
                    label: '申请人',
                    prop: 'createUserName',
                    width: '200'
                }, {
                    label: '状态',
                    prop: 'state',
                    width: '200',
                    hasTemplate: true
                }, {
                    label: '审批状态',
                    prop: 'auditState',
                    width: '200',
                    hasTemplate: true
                }, {
                    label: '操作',
                    hasTemplate: true,
                    fixed: 'right',
                    width: '300'
                }],
                data: []
            },
            pageConfig: {
                start: 0,
                pageSize: 10,
                pageSizes: [10, 20, 30, 40],
                pageNo: 1,
                total: 0
            },
            searchParam: {},
            delayWindow: {
                labelWidth: '120px',
                isShow: false,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < new Date(pointer.delayWindow.validDateStart);
                    }
                },
                applyCode: '',
                validDateStart: '',
                validDateEnd: ''
            }
        }
    },
    created() {
        this.search();
    },
    methods: {
        /**
         * @function search - 搜索
         */
        search(param) {
            let params = this.setParams(param);
            this.getData(params);
        },
        /**
         * @function setSearch - 修改搜索栏数据
         */
        setSearch(param) {
            this.searchParam = param;
        },
        /**
         * @function setParams - 设置请求参数
         * 
         * @return {Object} param
         */
        setParams(params) {
            console.log(params)
            params = params ? params : {};
            let searchParam = this.searchParam;
            let keysArr = ['applyCode', 'auditState', 'batchCode', 'contractCode', 'couponName', 'couponType', 'state', 'queryCreateUserName'];

            let _params = {};
            keysArr.forEach((item) => {
                if (!_params[`${item}`]) {
                    _params[`${item}`] = params[`${item}`] ? params[`${item}`] : searchParam[`${item}`] ? searchParam[`${item}`] : '';
                }
            });

            let timesArr = [{
                keys: 'proposDate',
                children: ['createTimeStart', 'createTimeEnd']
            }, {
                keys: 'ticketTimeUp',
                children: ['validDateStart', 'validDateEnd']
            }]
            timesArr.forEach((item, index) => {
                let key = item.keys;
                let c_keys = item.children;
                c_keys.forEach((item, index) => {
                    if (!_params[`${item}`]) {
                        _params[`${item}`] = params[`${key}`] ? this.tiemRule(params[`${key}`][index]) : searchParam[`${key}`] ? this.tiemRule(searchParam[`${key}`][index]) : '';
                    }
                });
            })

            let _keysArr = ['custId', 'incomeCinemaId'];
            _keysArr.forEach((item, index) => {
                if (!_params[`${item}`]) {
                    _params[`${item}`] = params[`${item}`] ? params[`${item}`].value : searchParam[`${item}`] ? searchParam[`${item}`].value : '';
                }
            });

            let pageKeysArr = ['pageSize', 'pageNo'];
            pageKeysArr.forEach((item, index) => {
                if (!_params[`${item}`]) {
                    _params[`${item}`] = this.pageConfig[`${item}`];
                }
            })

            return _params;
        },
        /**
         * @function tiemRule - 格式化时间
         * 
         */
        tiemRule(time, type) {
            let _time = new Date(time);
            let returnStr = '';
            switch (type) {
                case 'time':
                    returnStr = `${_time.getHours()}:${_time.getMinutes()}`;
                    break;
                default:
                    returnStr = `${_time.getFullYear()}-${_time.getMonth() + 1}-${_time.getDate()}`
            }
            return returnStr;
        },
        /**
         * @function getData - 请求数据
         */
        getData(params) {
            this.$ccmList.findSaleList(params).then((data) => {
                let type = 'warning';
                if (data.flag == 2) {
                    type = 'success';
                }
                if (type == 'success') {
                    this.table.data = data.data;
                    this.pageConfig.total = data.pageNum;
                    this.table.data.map((item,idx)=>{
                        item.couponType = this.ticketTypes(item.couponTypeRight.couponType);
                    })
                }
            }).catch((msg) => {
                console.log('查询销售单列表错误：', msg);
            });
        },
        /**
         * @function create - 新建
         */
        create() {
            this.$router.push({
                name: 'createSales'
            });
        },

        /**
         * @function ticketTypes - 票券类型
         * @param {Number} statusVal - 状态码
         */
        ticketTypes(statusVal) {
            let statusText = '';
            switch (statusVal) {
                case "0":
                    statusText = '兑换卷';
                    break;
                case "1":
                    statusText = '代金卷';
                    break;
                case "2":
                    statusText = '优惠卷';
                    break;
                default:
                    statusText = '全部';
                    break;
            }
            return statusText;
        },
        /**
         * @function ticketStatus - 票券状态
         * @param {Number} statusVal - 状态码
         */
        ticketStatus(statusVal) {
            let statusText = '';
            switch (statusVal) {
                case 0:
                    statusText = '未提交';
                    break;
                case 1:
                    statusText = '新建';
                    break;
                case 2:
                    statusText = '已激活';
                    break;
                case 3:
                    statusText = '已停用';
                    break;
                case 4:
                    statusText = '已作废';
                    break;
                case 5:
                    statusText = '已过期';
                    break;
                case 7:
                    statusText = '票券验证中';
                    break;
                case 8:
                    statusText = '票券验证不通过';
                    break;
                case 9:
                    statusText = '票券生成中';
                    break;
                default:
                    statusText = '未知';
                    break;
            }
            return statusText;
        },
        /**
         * @function auditStatus - 审批状态
         */
        auditStatus(statusVal) {
            let statusText = '';
            switch (statusVal) {
                case 0:
                    statusText = '审批通过';
                    break;
                case 1:
                    statusText = '审批未通过';
                    break;
                case 2:
                    statusText = '未审批';
                    break;
                default:
                    statusText = '未知';
                    break;
            }
            return statusText;
        },
        /**
         * @function level1Template - 一级操作状态模板
         * @param {Number} auditStatus - 审批状态
         * @param {Number} ticketStatus - 票券状态
         */
        level1Template(auditStatus, ticketStatus) {
            // use中第一位为auditStatus，第二位为ticketStatus
            let controls = [{
                label: '查看',
                emitFn: 'check',
                use: 'all'
            }, {
                label: '导出',
                emitFn: 'export',
                use: '0&&2,0&&3,0&&4,0&&5'
            }, {
                label: '修改',
                emitFn: 'change',
                use: '2&&0,2&&8,1&&1'
            }];

            let controlArray = [];
            let currentStatus = `${auditStatus}&&${ticketStatus}`;

            for (let i = 0; i < controls.length; i++) {
                let currentUse = controls[i].use;
                if (currentUse == 'all') {
                    controlArray.push(controls[i]);
                } else if (currentUse.indexOf(currentStatus) != -1) {
                    controlArray.push(controls[i]);
                }
            }
            return controlArray;
        },
        /**
         * @function level2Template - 二级操作状态模板
         * @param {Number} auditStatus - 审批状态
         * @param {Number} ticketStatus - 票券状态
         */
        level2Template(auditStatus, ticketStatus) {
            let controls = [{
                label: '删除',
                emitFn: 'delete',
                use: '2&&0,2&&8'
            }, {
                label: '复制',
                emitFn: 'copy',
                use: 'all'
            }, {
                label: '提交审批',
                emitFn: 'submit',
                use: '2&&0,1&&1,2&&8'
            }, {
                label: '查看审批单',
                emitFn: 'checkApporve',
                use: '2&&1,2&&0,0&&9,0&&2,0&&3,0&&4,0&&5,1&&1'
            }, {
                label: '作废',
                emitFn: 'blankOut',
                use: '0&&9,0&&2,0&&3'
            }, {
                label: '修订',
                emitFn: 'revise',
                use: '0&&2,2&&1,1&&1'
            }, {
                label: '停用',
                emitFn: 'stop',
                use: '0&&2'
            }, {
                label: '延期',
                emitFn: 'delay',
                use: '0&&2'
            }, {
                label: '启用',
                emitFn: 'start',
                use: '0&&3'
            }];

            let controlArray = [];
            let currentStatus = `${auditStatus}&&${ticketStatus}`;

            for (let i = 0; i < controls.length; i++) {
                let currentUse = controls[i].use;
                if (currentUse == 'all') {
                    controlArray.push(controls[i]);
                } else if (currentUse.indexOf(currentStatus) != -1) {
                    controlArray.push(controls[i]);
                }
            }

            return controlArray;
        },
        /**
         * @function controlEmitFn - 操作状态分发事件
         */
        controlEmitFn(emitFn, param) {
            this[`${emitFn}`](param);
        },
        /**
         * @function commandLevel2 - 二级操作菜单分发
         * @param {Array} command - 只有两项，第一项为数据，第二项为触发方法
         */
        commandLevel2(command) {
            let param = command[0];
            let emitFn = command[1].emitFn;
            this.controlEmitFn(emitFn, param);
        },
        /**
         * @function check - 查看
         */
        check(param) {
            this.$router.push({
                path: 'checkSaleList',
                query: {
                    applyCode: param.applyCode
                }
            })
        },
        /**
         * @function change - 修改
         */
        change(param) {
            this.$router.push({
                name: 'createSales',
                params: {
                    applyCode: param.applyCode,
                    isEdit: true
                }
            })
        },
        /**
         * @function export - 导出
         */
        export (param) {
            console.log('导出:', param)
        },
        /**
         * @function delete - 删除
         */
        delete(param) {
            console.log('删除:', param);
            let params = {
                applyCode: param.applyCode
            };
            this.$ccmList.deleteSaleList(params).then(data => {
                console.log(data)
                let type = 'warning';
                if (data.flag == 1) {
                    type = 'success';
                }
                this.$message({
                    type,
                    message: '删除票券申请单成功'
                });
                if (type == 'success') {
                    this.search();
                }
            }).catch(msg => {
                console.log('删除票券申请单错误', msg);
            })
        },
        /**
         * @function copy - 复制
         */
        copy(param) {
            this.$router.push({
                name: 'createSales',
                params: {
                    applyCode: param.applyCode,
                    isEdit: true,
                    isCopy: true
                }
            })
        },
        /**
         * @function submit - 提交审批
         */
        submit(param) {
            console.log('提交审批:', param);
        },
        /**
         * @function checkApporve - 查看审批单
         */
        checkApporve(param) {
            console.log('查看审批单:', param);
        },
        /**
         * @function blankOut - 作废
         */
        blankOut(param) {
            let params = {
                applyCode: param.applyCode
            };
            this.$ccmList.abandonSaleList(params).then(data => {
                let type = 'warning';
                let message = '作废票券销售单失败，请稍后尝试';
                if (data.flag == 3) {
                    type = 'success';
                    message = '作废销售单成功';
                }
                this.$message({
                    type,
                    message
                });
                if (type == 'success') {
                    this.search();
                }

            }).catch(msg => {
                console.log('作废销售申请单错误：', msg);
            });
        },
        /**
         * @function revise - 修订
         */
        revise(param) {
            console.log('修订:', param);
        },
        /**
         * @function start - 启用
         */
        start(param) {
            let params = {
                applyCode: param.applyCode,
                state: param.state
            };
            this.$ccmList.startSaleList(params).then(data => {
                let type = 'warning';
                let message = '启用票券销售单失败，请稍后尝试';
                if (data.flag == 2) {
                    type = 'success';
                    message = '启用销售单成功';
                }
                this.$message({
                    type,
                    message
                });
                if (type == 'success') {
                    this.search();
                }
            }).catch(msg => {
                console.log('启用票券销售单错误：', msg);
            });
        },
        /**
         * @function stop - 停用
         */
        stop(param) {
            let params = {
                applyCode: param.applyCode,
                auditState: param.auditState
            }
            this.$ccmList.stopSaleList(params).then(data => {
                let type = 'warning';
                let message = '停用销售单失败，请稍后再尝试';
                if (data.flag == 2) {
                    type = 'success';
                    message = '停用销售单成功';
                }
                this.$message({
                    type,
                    message
                });
                if (type == 'success') {
                    this.search();
                }
            }).catch(msg => {
                console.log('停用销售单错误：', msg);
            });
        },
        /**
         * @function delay - 延期
         */
        delay(param) {
            this.setDelayParam(true, param.applyCode, param.validDateStart, param.validDateEnd);
        },
        /**
         * @function setDelayParam - 设置延期参数
         */
        setDelayParam(isShow, applyCode, validDateStart, validDateEnd) {
            this.delayWindow[`applyCode`] = applyCode;
            this.delayWindow[`validDateStart`] = this.ruleTime(validDateStart);
            this.delayWindow[`validDateEnd`] = new Date(validDateEnd);
            this.delayWindow.isShow = isShow;
        },
        /**
         * @function sureDelay - 确定延期
         */
        sureDelay() {
            let params = {
                applyCode: this.delayWindow[`applyCode`],
                validDateEnd: this.ruleTime(this.delayWindow[`validDateEnd`])
            };
            this.$ccmList.delaySaleList(params).then(data => {
                let type = 'warning';
                let message = '票券延期失败，请您稍后再尝试';
                if (data.flag == 2) {
                    type = 'success';
                    message = '票券延期成功';
                }
                this.$message({
                    type,
                    message
                });
                this.setDelayParam(false, '', '', '');
                if (type == 'success') {
                    this.search();
                }
            }).catch(msg => {
                console.log(msg);
                this.setDelayParam(false, '', '', '');
            });
        },
        /**
         * @function cancleDelay - 取消延期
         */
        cancleDelay() {
            this.setDelayParam(false, '', '', '');
        },
        /**
         * @function ruleTime - 格式化时间
         * @param {Object} time - 时间
         * @param {String} [type='time'] - 可选参数,格式化类型 时分 
         */
        ruleTime(time, type) {
            let _time = new Date(time);

            let _year = _time.getFullYear(),
                _mounth = _time.getMonth() + 1,
                _day = _time.getDate(),
                _hours = _time.getHours(),
                _minutes = _time.getMinutes();

            let returnStr = `${_year}-${_mounth}-${_day}`;
            if (type == 'time') {
                returnStr = `${_hours}:${_minutes}`;
            }

            return returnStr;
        },
        /**
         * @function handleSizeChange - 修改分页大小
         */
        handleSizeChange(val) {
            this.pageConfig.pageSize = val;
            this.search();
        },
        /**
         * @function handleCurrentChange - 修改当前显示页
         */
        handleCurrentChange(val) {
            this.pageConfig.pageNo = val;
            this.search();
        },
    }
}
</script>

<style lang="scss" scoped>
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
    font-size: 12px;
}

.el-icon-arrow-down {
    font-size: 12px;
}

.delayLine {
    margin-left: 15px;
    margin-right: 15px;
}
</style>
