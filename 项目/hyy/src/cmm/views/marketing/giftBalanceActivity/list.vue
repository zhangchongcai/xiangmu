<template>
<div class="table-section">
    <div v-if="pageShow=='actList'">
        <!-- 搜索栏 -->
        <section class="search-section">
            <searchLan :modelName="modelName" :config="searchConfig" @pressSearch="search" @searchValueChange="setSearch"></searchLan>
        </section>

        <!-- 按钮组 -->
        <section class="btnGroup-section flex-base flex-end">
            <el-button type="primary" @click="addAct">新建</el-button>
        </section>

        <!-- 表格 -->
        <section class="table-section">
            <commonTable :tableData="tableData" :tableLabels="tableLabels" :tableOptions="tableOptions" @handleButton="handleButton"></commonTable>
        </section>

        <!-- 分页 -->
        <section class="pagination-section flex-base flex-center" v-if="tableData.lenth != 0">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.currentPage" :page-sizes="pageConfig.pageSizes" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.total">
            </el-pagination>
        </section>

        <el-dialog title="停用/启用活动" width="40%" :close-on-click-modal="false" :visible.sync="startOrStopShow" append-to-body>
            <div style="margin-left: 60px; font-weight: 600;">请确认是否{{status==0?'停用':'启用'}}该营销活动?</div>
            <el-form :model="startOrStopForm" :rules="startOrStopRule" ref="startOrStopForm">
                <el-form-item label="备注" prop="remark">
                    <el-input style="width:80%;" type="textarea" v-model="startOrStopForm.remark" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="startOrStopSubmit()">确定</el-button>
          <el-button @click="startOrStopShow = false">取消</el-button>
        </span>
        </el-dialog>

    </div>

    <add-gift-balance v-if="pageShow=='addAct'" ref="addOrUpdate" @refreshDataList="search"></add-gift-balance>
    <audit-view v-if="pageShow=='auditView'" ref="auditView" @refreshDataList="search"></audit-view>

</div>
</template>

<script>
import '../../../assets/common.scss';
import AddGiftBalance from './add-or-update';
import AuditView from './auditView';
import searchLan from '../../../components/search/index.vue';
import commonTable from '../../../components/Table/commonTable.vue';

export default {
    components: {
        AddGiftBalance,
        AuditView,
        searchLan,
        commonTable
    },
    data() {
        return {
            tenantId: '1', //商户id
            modelName: "movieTicketManagement",
            pageShow: 'actList',
            /* 搜索栏数据 */
            searchConfig: [{
                    keyName: 'searchActivityName',
                    name: '活动名称',
                    type: 'input',
                    value: ''
                }, {
                    keyName: 'validDate',
                    name: '有效期',
                    type: 'date-picker',
                    dateType: 'daterange',
                    value: ''
                }, {
                    keyName: 'searchCreaterId',
                    name: '创建人',
                    type: 'input',
                    value: '',
                    alertButton: true,
                    alertSrc: 'http://192.168.100.148:8080/alertWindow',
                }, {
                    keyName: 'searchCreaterArea',
                    name: '创建单位',
                    type: 'input',
                    value: '',
                    alertButton: true,
                    alertSrc: 'http://192.168.100.148:8080/alertWindow',
                }, {
                    keyName: 'searchApprovalmanId',
                    name: '审批人',
                    type: 'input',
                    value: '',
                    alertButton: true,
                    alertSrc: 'http://192.168.100.148:8080/alertWindow',
                }, {
                    keyName: 'businessCode',
                    name: '适用商户',
                    type: 'input',
                    value: '',
                    alertButton: true,
                    alertSrc: 'http://192.168.100.148:8080/alertWindow',
                }, {
                    keyName: 'executeMode',
                    name: '执行策略',
                    type: 'select',
                    value: '',
                    options: [{
                        label: '全部',
                        value: ''
                    }, {
                        label: '自动',
                        value: 'AUTO_MATCH'
                    }, {
                        label: '推荐',
                        value: 'AUTO_MATCH_RECOMMEND'
                    }]
                }, {
                    keyName: 'ruleTemplateId',
                    name: '活动类型',
                    type: 'select',
                    value: '',
                    options: [{
                            label: '不限',
                            value: ''
                        }, {
                            label: '开卡送余额',
                            value: '27'
                        }, {
                            label: '充值送余额',
                            value: '28'
                        },
                        {
                            label: '消费送余额',
                            value: '29'
                        }
                    ]
                },
                {
                    keyName: 'searchState',
                    name: '活动状态',
                    type: 'select',
                    value: '',
                    options: [{
                            label: '全部',
                            value: ''
                        }, {
                            label: '新建',
                            value: '1'
                        }, {
                            label: '锁定',
                            value: '2'
                        },
                        {
                            label: '执行中',
                            value: '3'
                        },
                        {
                            label: '暂停',
                            value: '4'
                        }, {
                            label: '作废',
                            value: '5'
                        }
                    ]
                },
            ],
            /* 搜索栏返回参数 */
            searchParam: {},
            /* 分页数据 */
            pageConfig: {
                start: 0,
                pageSize: 10,
                pageSizes: [10, 20, 30, 40],
                currentPage: 1,
                total: 0
            },
            /* 表格数据 */
            tableData: [],
            tableLabels: [{
                    prop: 'activityCode',
                    label: '活动编码',
                    width: '150'
                },
                {
                    prop: 'activityName',
                    label: '活动名称',
                    width: '150'
                },
                {
                    prop: 'executeMode',
                    label: '执行策略',
                    width: '80',
                    hasTemplate: true,
                    formatRole: (scope) => {
                        return scope.row.executeMode == "AUTO_MATCH" ? '自动' : '推荐';
                    }
                },
                {
                    prop: 'priority',
                    label: '优先级',
                    width: '80'
                },
                {
                    prop: 'validDateStart',
                    label: '有效期',
                    width: '200',
                    hasTemplate: true,
                    formatRole: (scope) => {
                        return scope.row.validDateStart ? scope.row.validDateStart + " 至 " + scope.row.validDateEnd : '';
                    }
                },
                {
                    prop: 'createrName',
                    label: '创建人',
                    width: '80'
                },
                {
                    prop: 'createrAreaName',
                    label: '创建单位',
                    width: '80'
                },
                {
                    prop: 'createTime',
                    label: '创建日期',
                    width: '100'
                },
                {
                    prop: 'approvalmanName',
                    label: '审批人',
                    width: '80'
                },
                {
                    prop: 'approvalResult',
                    label: '审批状态',
                    width: '80',
                    hasTemplate: true,
                    formatRole: (scope) => {
                        switch (scope.row.approvalResult) {
                            case 1:
                                return '未提交';
                                break;
                            case 2:
                                return '未审批';
                                break;
                            case 3:
                                return '审批通过';
                                break;
                            default:
                                return '审批不通过';
                                break;
                        };
                    }
                },
                {
                    prop: 'activityState',
                    label: '活动状态',
                    width: '80',
                    hasTemplate: true,
                    formatRole: (scope) => {
                        switch (scope.row.activityState) {
                            case 1:
                                return '新建';
                                break;
                            case 2:
                                return '锁定';
                                break;
                            case 3:
                                return '执行中';
                                break;
                            case 4:
                                return '暂停';
                                break;
                            case 5:
                                return '作废';
                                break;
                            default:
                                return '';
                                break;
                        };
                    }
                },
            ],

            /* 表格操作列数据 */
            tableOptions: {
                label: "操作",
                fixed: "right",
                width: '200',
                options: [{
                        text: "查看",
                        method: "actDetail",
                        condition: (scope) => {
                            return true;
                        }
                    },
                    {
                        text: "修订",
                        method: "updateAct",
                        condition: (scope) => {
                            return (scope.row.approvalResult != 2 || scope.row.activityState != 2) && (scope.row.approvalResult != 3 || scope.row.activityState != 5) && scope.row.approvalResult === 3;
                        }
                    },
                    {
                        text: "修改",
                        method: "updateAct",
                        condition: (scope) => {
                            return (scope.row.approvalResult != 2 || scope.row.activityState != 2) && (scope.row.approvalResult != 3 || scope.row.activityState != 5) && scope.row.approvalResult !== 3
                        }
                    },
                    {
                        text: "作废",
                        method: "cancelAct",
                        condition: (scope) => {
                            return (scope.row.approvalResult != 2 || scope.row.activityState != 2) && (scope.row.approvalResult != 3 || scope.row.activityState != 5);
                        }
                    },
                    {
                        text: "复制",
                        method: "copyAct",
                        condition: (scope) => {
                            return true;
                        }
                    },
                    {
                        text: "启用",
                        method: "openAct",
                        condition: (scope) => {
                            return scope.row.approvalResult == 3 && scope.row.activityState == 4;
                        }
                    },
                    {
                        text: "停用",
                        method: "closeAct",
                        condition: (scope) => {
                            return scope.row.approvalResult == 3 && scope.row.activityState == 3;
                        }
                    },
                    {
                        text: "提交审批",
                        method: "submitApproval",
                        condition: (scope) => {
                            return scope.row.approvalResult == 1;
                        }
                    },
                    {
                        text: "查看审批单",
                        method: "approvalDetail",
                        condition: (scope) => {
                            return scope.row.approvalResult != 1;
                        }
                    },
                ]
            },

            /* 启用 停用 弹窗数据 */
            startOrStopShow: false,
            status: 0,
            stopOrStartId: '',
            startOrStopForm: {
                remark: ''
            },
            startOrStopRule: {
                remark: [{
                    required: true,
                    message: '备注不能为空',
                    trigger: 'blur'
                }]
            }
        }
    },
    created() {
        this.search();
    },
    methods: {
        /* @function search - 搜索
         */
        search() {
            let _param = this.setParam();
            this.getDataList(_param);
        },

        /* @function setParam - 搜索参数组装*/
        setParam() {
            let exitsSearhParam = JSON.stringify(this.searchParam) != '{}' ? true : false;
            let params = {};
            let pageData = {
                tenantId: this.tenantId, //商户id
                ruleTemplateId: this.searchParam.ruleTemplateId ? this.searchParam.ruleTemplateId : '27,28,29',
                pageNo: this.pageConfig.currentPage,
                pageSize: this.pageConfig.pageSize,
                searchValidDateStart: '',
                searchValidDateEnd: ''
            }
            if (exitsSearhParam) {
                if (this.searchParam.validDate) {
                    pageData.searchValidDateStart = this.searchParam.validDate[0];
                    pageData.searchValidDateEnd = this.searchParam.validDate[1];
                }
                if (this.searchParam.ruleTemplateId == "") {
                    this.searchParam.ruleTemplateId = pageData.ruleTemplateId;
                }
                params = Object.assign(pageData, this.searchParam);
            } else {
                params = pageData;
            }
            return params;
        },

        /**
         * @function setSearch - 修改搜索栏数据
         * 
         */
        setSearch(param) {
            this.searchParam = param;
            this.pageConfig.currentPage = 1; //改变搜索条件，从第一页开始查询
        },

        /* 获取数据列表 */
        getDataList(params) {
            this.pageShow = 'actList'
            this.$cmmList.marketingList(params).then(data => {
                if (data && data.code === 200) {
                    this.tableData = data.data.result;
                    this.pageConfig.total = data.data.totalCount;
                    this.$message({
                        message: "查询成功",
                        type: "success",
                        duration: 1000
                    });
                } else {
                    this.tableData = [];
                    this.pageConfig.total = 0;
                    this.$message({
                        message: data.msg,
                        type: "warning",
                        duration: 1000
                    });
                }
            }).catch(err => {
                console.log(err)
            })
        },

        //操作列回调
        handleButton(data) {
            switch (data.method) {
                case 'openAct':
                    this.openAct(data.scope);
                    break;
                case 'closeAct':
                    this.closeAct(data.scope);
                    break;
                case 'cancelAct':
                    this.cancelAct(data.scope);
                    break;
                case 'updateAct':
                    this.updateAct(data.scope);
                    break;
                case 'actDetail':
                    this.actDetail(data.scope);
                    break;
                case 'copyAct':
                    this.copyAct(data.scope);
                    break;
                case 'submitApproval':
                    this.submitApproval(data.scope);
                    break;
                case 'approvalDetail':
                    this.approvalDetail(data.scope);
                    break;
            }
        },

        /* 启用活动 */
        openAct(scope) {
            this.stopOrStartHandle(scope.row.id, 1);
        },
        /* 停用活动 */
        closeAct(scope) {
            this.stopOrStartHandle(scope.row.id, 0);
        },
        /* 作废活动 */
        cancelAct(scope) {
            this.deleteHandle(scope.row.id)
        },
        /* 新建活动 */
        addAct() {
            this.addOrUpdateHandle(null, "add");
        },
        /* 修改活动 */
        updateAct(scope) {
            this.addOrUpdateHandle(scope.row, "update");
        },
        /* 查看活动 */
        actDetail(scope) {
            this.addOrUpdateHandle(scope.row, "detail");
        },
        /* 复制活动 */
        copyAct(scope) {
            this.addOrUpdateHandle(scope.row, "copy");
        },
        /* 提交审批 */
        submitApproval(scope) {
            this.handleCommand(1, scope);
        },
        /* 查看审批单 */
        approvalDetail(scope) {
            this.handleCommand(2, scope);
        },

        /**
         * @function handleSizeChange - 修改分页大小
         */
        handleSizeChange(pageSize) {
            this.pageConfig.pageSize = pageSize;
            this.pageConfig.currentPage = 1;
            this.search();
        },
        /**
         * @function handleCurrentChange - 修改当前显示页
         */
        handleCurrentChange(currentPage) {
            this.pageConfig.currentPage = currentPage;
            this.search();
        },

        addOrUpdateHandle(row, isEdit) {
            this.pageShow = 'addAct'
            this.$nextTick(() => {
                this.$refs.addOrUpdate.init(row, isEdit)
            })
        },
        // 删除
        deleteHandle(id) {
            console.log(id)
            this.$confirm(`您确定要删除此记录吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$cmmList.marketingDel({
                    "id": id,
                    "tenantId": this.tenantId
                }).then(data => {
                    console.log(data)
                    if (data && data.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.getDataList()
                            }
                        })
                    } else {
                        this.$message.error(data.msg)
                    }

                }).catch(err => {
                    console.log(err)
                })
            }).catch(() => {})
        },
        // 停用或启用
        stopOrStartHandle(id, status) {
            this.startOrStopShow = true
            this.startOrStopForm.remark = ''
            console.log(id, status)
            this.stopOrStartId = id;
            this.status = status;
        },
        startOrStopSubmit() {
            // this.$confirm(`请确认是否${status==0?'停用':'启用'}该营销活动?`, '停用/启用活动', {
            //   confirmButtonText: '确定',
            //   cancelButtonText: '取消',
            //   type: 'warning'
            // }).then(() => {
            this.$refs['startOrStopForm'].validate((valid) => {
                if (valid) {
                    this.$cmmList.marketingEnableOrDisabl({
                        "id": this.stopOrStartId,
                        "tenantId": this.tenantId,
                        "accountId": 1,
                        "remark": this.startOrStopForm.remark
                    }).then(data => {
                        console.log(data)
                        if (data && data.code === 200) {
                            this.$message({
                                message: '操作成功',
                                type: 'success',
                                duration: 1500,
                                onClose: () => {
                                    this.startOrStopShow = false
                                    this.getDataList()
                                }
                            })
                        } else {
                            this.$message.error(data.msg)
                        }

                    }).catch(err => {
                        console.log(err)
                    })
                }
            })
            // }).catch(() => {})
        },

        handleCommand(command, scope) {
            if (command == 1) { //提交审批
                this.$cmmList.marketingSubmitAudit({
                    "id": scope.row.id,
                    "tenantId": this.tenantId
                }).then(data => {
                    console.log(data)
                    if (data && data.code === 200) {
                        this.$message({
                            message: '操作成功',
                            type: 'success',
                            duration: 1500,
                            onClose: () => {
                                this.search();
                            }
                        })
                    } else {
                        this.$message.error(data.msg)
                    }

                }).catch(err => {
                    console.log(err)
                })
            } else { //查看审批单
                this.pageShow = 'auditView'
                this.$nextTick(() => {
                    this.$refs.auditView.init()
                })
            }

        }

    }
}
</script>

<style lang="scss" scoped>
section {
    margin-bottom: 15px;
}
</style>
