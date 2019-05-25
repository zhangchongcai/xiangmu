<template>
<div>
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width">
        <!-- 搜索栏 -->
        <searchLan class="margin-bottom-10" :modelName="searchConfig.name" :config="searchConfig.elements" :searchLevelButton="searchConfig.isShowLevel" @pressSearch="search" @searchValueChange="setSearch"></searchLan>
        <!-- 表格内容 -->
        <el-table class="margin-bottom-10" :ref="table.ref" :data="table.data" :border="table.border" highlight-current-row :style="{width: table.width}" @row-click="tableCurrentChange">
            <!-- <el-table-column type="selection" width="55" :fixed="'left'" :align="table.itemAlign"></el-table-column> -->
            <template v-for="item in table.title">
                <el-table-column :show-overflow-tooltip="table.itemTooltip" :align="table.itemAlign" :key="item.title" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed">
                    <template slot-scope="scope">
                        <div v-if="!item.hasTemplate">{{scope.row[`${item.prop}`]}}</div>
                        <section v-else>
                            <div v-if="item.prop == 'auditState'">
                                {{auditStateText(scope.row[`${item.prop}`])}}
                            </div>
                            <div v-if="item.prop == 'state'">
                                {{stateText(scope.row[`${item.prop}`])}}
                            </div>
                            <div v-if="item.prop == 'couponType'">
                                {{couponTypeText(scope.row[`${item.prop}`])}}
                            </div>
                        </section>
                    </template>
                </el-table-column>
            </template>
        </el-table>
        <el-row v-if="table.data.length != 0" class="flex-base flex-center margin-top-10">
            <el-pagination @size-change="paginationSizeChange" @current-change="paginationCurrentChange" :current-page="pagination.currentPage" :page-sizes="pagination.sizes" :page-size="pagination.size" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"></el-pagination>
        </el-row>
        <div slot="footer" class="dialog-footer">
            <el-row class="flex-base flex-center">
                <el-button type="primary" @click="emitFn()">确 定</el-button>
                <el-button @click="dialog.visible = false">取 消</el-button>
            </el-row>
        </div>
    </el-dialog>
</div>
</template>

<script>
import searchLan from '../../components/search/index.vue';
export default {
    props: {
        incomeData: {
            type: Object,
            default: null
        }
    },
    components: {
        searchLan
    },
    created() {
        let data = this.incomeData;

        if (typeof data != 'object') {
            return TypeError('传入参数不是一个对象!');
        }
        let elements = JSON.parse(JSON.stringify(this.searchConfig.elements));

        if (JSON.stringify(data) != 'null') {
            let keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
                let itemVal = data[`${keys[i]}`];
                for (let y = 0; y < elements.length; y++) {
                    if (elements[y].keyName == keys[i]) {
                        console.log(keys[i], itemVal, elements[y].keyName, elements[y].value)
                        elements[y].value = itemVal;
                    }
                }
            }
            this.searchConfig.elements = elements;
        }
    },
    data() {
        return {
            dialog: {
                visible: false,
                title: '查询票券批次',
                width: '85%'
            },
            searchConfig: {
                name: 'saleListDialog',
                isShowLevel: false,
                elements: [{
                    keyName: 'applicableChannel',
                    name: '适用渠道',
                    type: 'input',
                    value: {
                        value: '',
                        text: ''
                    },
                    readonly: true,
                    required: true,
                    alertButton: true,
                    alertSrc: 'http://192.168.100.148:8080/alertWindow',
                }, {
                    keyName: 'cinemaCodes',
                    name: '适用影院',
                    type: 'input',
                    value: {
                        value: '',
                        text: ''
                    },
                    readonly: true,
                    required: true,
                    alertButton: true,
                    alertSrc: 'http://192.168.100.148:8080/alertWindow',
                }, {
                    keyName: 'incomeCinemaName',
                    name: '入账影院',
                    type: 'input',
                    value: {
                        value: '',
                        text: ''
                    },
                    readonly: true,
                    required: true,
                    alertButton: true,
                    alertSrc: 'http://192.168.100.148:8080/alertWindow',
                }, {
                    keyName: 'couponType',
                    name: '票券类型',
                    type: 'select',
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
                    }]
                }, {
                    keyName: 'salesMode',
                    name: '销售方式',
                    type: 'select',
                    value: '',
                    options: [{
                        label: '全部',
                        value: ''
                    }, {
                        label: '影院零售',
                        value: '1'
                    }, {
                        label: '营销活动',
                        value: '2'
                    }, {
                        label: '大客户',
                        value: '3'
                    }, {
                        label: '第三方合作',
                        value: '4'
                    }]
                }, {
                    keyName: 'validate',
                    name: '票券有效期范围',
                    type: 'date-picker',
                    value: '',
                }],
                param: {

                }
            },
            table: {
                ref: 'singleTable',
                width: '100%',
                // maxHeight: '450px',
                border: true,
                itemTooltip: true,
                itemAlign: 'center',
                data: [],
                title: [{
                        prop: 'applyCode',
                        label: '适用渠道',
                        width: '200px'
                    },
                    {
                        prop: 'applyCode',
                        label: '票券销售单号',
                        width: '200px'
                    }, {
                        prop: 'cinemaCodes',
                        label: '适用影院',
                        width: '200px'
                    }, {
                        prop: 'couponCount',
                        label: '票券数量',
                        width: '200px'
                    },
                    {
                        prop: 'couponName',
                        label: '票券名称',
                        width: '200px'
                    }, {
                        prop: 'couponType',
                        label: '票券类型',
                        width: '200px',
                        hasTemplate: true
                    }, {
                        prop: 'couponPrice',
                        label: '价格',
                        width: '200px'
                    }, {
                        prop: 'num',
                        label: '可售数量',
                        width: '200px'
                    }, {
                        prop: 'createUserName',
                        label: '申请人',
                        width: '200px'
                    }, {
                        prop: 'custId',
                        label: '客户id',
                        width: '200px'
                    }, {
                        prop: 'incomeCinemaId',
                        label: '入账影院id',
                        width: '200px'
                    }, {
                        prop: 'state',
                        label: '票券申请单状态',
                        width: '200px',
                        hasTemplate: true
                    }, {
                        prop: 'auditState',
                        label: '审核结果',
                        width: '200px',
                        hasTemplate: true
                    }, {
                        prop: 'validDateStart',
                        label: '有效开始时间',
                        width: '200px'
                    }, {
                        prop: 'validDateEnd',
                        label: '有效结束时间',
                        width: '200px'
                    }
                ]
            },
            pagination: {
                currentPage: 1,
                size: 10,
                sizes: [10, 20, 30, 40],
                total: 0
            },
            currentRow: null
        }
    },
    watch:{
        incomeData:{
            handler: function(newVal,oldVal) {
                console.log(newVal)
                let param={
                    applicableChannel:this.incomeData.applicableChannel||"",
                    cinemaCodes:this.incomeData.cinemaCodes||"",
                    incomeCinemaName:this.incomeData.incomeCinemaName||"",
                    couponType:this.incomeData.couponType,
                    salesMode:this.incomeData.salesMode||"",
                    validate:this.incomeData.validate||"",
                    pageNo:this.pagination.currentPage,
                    pageSize:this.pagination.size   
                }
                this.search(param)
            },
        deep: true,
          
        }
      
    },
    mounted() {
        let param={
            applicableChannel:this.incomeData.applicableChannel||"",
            cinemaCodes:this.incomeData.cinemaCodes||"",
            incomeCinemaName:this.incomeData.incomeCinemaName||"",
            couponType:this.incomeData.couponType,
            salesMode:this.incomeData.salesMode||"",
            validate:this.incomeData.validate||"",
            pageNo:this.pagination.currentPage,
            pageSize:this.pagination.size   
        }
      
        this.search(param);
    },
    methods: {
        /**
         * @function isShowDialog - 控制弹窗显示
         * @param {Bollean} isShow - 显示:true, 隐藏：false
         */
        isShowDialog(isShow) {
           this.dialog.visible = isShow;
        },
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
            this.searchConfig.param = param;
        },
        /**
         * @function setParams - 设置请求参数
         * 
         * @return {Object} param
         */
        setParams(params) {
            params = params ? params : this.searchConfig.param;

            let _param = {};

            let keys = Object.keys(params);

            keys.forEach((item) => {
                let itemVal = params[`${item}`];
                if (typeof itemVal == 'object' && item != 'validate') {
                    _param[`${item}`] = itemVal.value;
                } else if (item == 'validate' && itemVal && itemVal.length != 0) {
                    _param[`createTimeEnd`] = this.ruleTime(itemVal[1], 'ymd', '-');
                    _param[`createTimeStart`] = this.ruleTime(itemVal[0], 'ymd', '-');
                } else {
                    _param[`${item}`] = itemVal;
                }
            });

            _param[`pageNo`] = this.pagination.currentPage;
            _param[`pageSize`] = this.pagination.size;

            return _param;
        },
        /**
         * @function getData - 获取数据
         */
        getData(params) {
            this.$ccmList.alertSaleList(params).then(data => {
                let type = 'warning';
                let message = '查询票券批次错误，请稍后重试';
                if (data.flag == '2') {
                    type = 'success';
                    message = '查询票券批次成功';
                }

                if (type == 'success') {
                    let _data = data.data;
                    for (let i = 0; i < _data.length; i++) {
                        _data[i][`couponType`] = _data[i][`couponTypeRight`][`couponType`];
                    };
                    this.table.data = _data;
                    this.pagination.total = data.pageNum;
                } else {
                    this.$message({
                        type,
                        message
                    });
                }
            }).catch(msg => {
                console.log(`获取销售申请单数据错误：${msg}`);
            });
        },
        /**
         * @function tableCurrentChange - 选中表格行
         */
        tableCurrentChange(row) {
            this.currentRow = row;
        },
        /**
         * @function paginationSizeChange - 当前分页每页显示改变
         */
        paginationSizeChange(val) {
            this.pagination.size = val;
            this.search();
        },
        /**
         * @function paginationCurrentChange - 当前分页变化
         */
        paginationCurrentChange(val) {
            this.pagination.currentPage = val;
            this.search();
        },
        /**
         * @function emitFn - 返回选中数据
         */
        emitFn() {
            let param = this.currentRow;
            if (param) {
                this.$emit('ccmSaleListCallBack', {
                    data: param
                });
                this.dialog.visible = false;
            } else {
                this.$message({
                    type: 'warning',
                    message: '请选择一行数据'
                });
            }
        },
        /**
         * @function ruleTime - 格式化时间
         * 
         * @param {Date} time - 时间格式数据
         * @param {String} type - 需要返回类型 ymd：年月日，hm：小时分钟
         * @param {String} split - 分隔符 
         */
        ruleTime(time, type, split) {
            let _time;
            type = type ? type : 'ymd';
            split = split ? split : '/';

            try {
                _time = new Date(time);
            } catch (msg) {
                return new Error(`格式化时间错误：${msg}，时间：${time}`);
            }

            let _timeArr = new Array();
            switch (type) {
                case 'ymd':
                    _timeArr = [_time.getFullYear(), _time.getMonth() + 1, _time.getDate()];
                    break;
                case 'hm':
                    _timeArr = [_time.getHours(), _time.getMinutes()];
                    break;
                default:
                    _timeArr = [];
                    break;
            }
            return _timeArr.join(`${split}`);
        },
        /**
         * @function auditStateText -  审核结果
         */
        auditStateText(auditState) {
            let keys = {
                0: '通过',
                1: '不通过',
                2: '未审批'
            };
            return keys[`${auditState}`]
        },
        /**
         * @function stateText - 票券申请单状态
         */
        stateText(state) {
            let keys = {
                0: '未提交',
                1: '新建',
                2: '已激活',
                3: '已停用',
                4: '已作废',
                5: '已过期',
                6: '已删除'
            }
            return keys[`${state}`];
        },
        /**
         * @function couponTypeText - 票券类型
         */
        couponTypeText(couponType) {
            let keys = {
                0: '兑换券',
                2: '优惠券',
                1: '代金券'
            }
            return keys[`${couponType}`];
        }
    }
}
</script>

<style lang="scss" scoped>
.margin-top-10 {
    margin-top: 10px;
}

.margin-bottom-10 {
    margin-bottom: 10px;
}
</style>
