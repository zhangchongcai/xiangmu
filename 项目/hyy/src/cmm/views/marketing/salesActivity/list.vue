<template>
<div class="mod-user">
    <div v-if="pageShow=='actList'">
        <!-- 搜索栏 -->
        <section>
            <searchLan :modelName="modelName" :config="searchConfig" :isCache="isCache" @pressSearch="search" @searchValueChange="setSearch"></searchLan>
        </section>

        <!-- 按钮组 -->
        <section class="flex-base flex-end">
            <el-row>
                <el-button class="addBtn" @click="addAct">新建</el-button>
            </el-row>
        </section>

        <!-- 表格 -->
        <section>
            <commonTable :tableData="tableData" :tableLabels="tableLabels" :tableOptions="tableOptions" @handleButton="handleButton"></commonTable>
        </section>

        <!-- 分页 -->
        <section class="flex-base flex-center pageStyle">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.currentPage" :page-sizes="pageConfig.pageSizes" :page-size="pageConfig.pageSize" background layout="total, prev, pager, next, jumper, sizes" :total="pageConfig.total">
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

    <add-sales v-if="pageShow=='addAct'" ref="addOrUpdate" @refreshDataList="search"></add-sales>
    <audit-view v-if="pageShow=='auditView'" ref="auditView" @refreshDataList="search"></audit-view>
     <!-- 查看审批单弹窗 -->
    <approvalDialog v-if="showApproval"  ref="approvalDialog" :bizNo="bizNo" :dialogFormVisible="showApproval" @close="approvalDetailClose"></approvalDialog>

</div>
</template>

<script>
import AddSales from './add-or-update';
import AuditView from './auditView';
import searchLan from 'cmm/components/search/index.vue';
import commonTable from '../../../components/Table/commonTable.vue';

import approvalDialog from '../../../dialogs/approval/approvalDialog.vue';
import minxins from 'frame_cpm/mixins/cacheMixin.js'
export default {
    components: {
        AddSales,
        AuditView,
        searchLan,
        commonTable,
        approvalDialog
    },
    mixins: [minxins.cacheMixin],
    data() {
        return {
            /* 缓存数据 */
            cacheField: ["pageConfig","tableLabels","tableData"],
            subComName:"salesActivity",
            bizNo:"",//审批单业务编码
            showApproval:false,//是否显示查看审批单弹窗
            tenantId: JSON.parse(localStorage.getItem('user')).consumerId, //商户id
            modelName: "movieTicketManagement",
            isCache:true,
            pageShow: 'actList',
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
                    alertCompontsName: 'userCreaterDialog',
                }, {
                    keyName: 'searchCreaterArea',
                    name: '创建单位',
                    type: 'input',
                    value: '',
                    alertButton: true,
                    alertCompontsName: 'orgStructureDialog',
                }, {
                    keyName: 'searchApprovalmanId',
                    name: '审批人',
                    type: 'input',
                    value: '',
                    alertButton: true,
                    alertCompontsName: 'userApprovalDialog',
                }, {
                    keyName: 'searchBusinessCode',
                    name: '适用影院',
                    type: 'input',
                    value: '',
                    alertButton: true,
                    alertCompontsName: 'cinemaDialog',
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
                    value: '17,18,19,20',
                    options: [{
                            label: '不限',
                            value: '17,18,19,20'
                        }, {
                            label: '卖品打折',
                            value: '17'
                        }, {
                            label: '卖品满减',
                            value: '18'
                        },
                        {
                            label: '卖品立减',
                            value: '19'
                        },
                        {
                            label: '卖品减至',
                            value: '20'
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

            searchParam: {},
            pageConfig: {
                start: 0,
                pageSize: 10,
                pageSizes: [10, 20, 30, 40],
                currentPage: 1,
                total: 0
            },
            tableData: [],
            tableLabels: [{
                    prop: 'activityCode',
                    label: '活动编码',
                    width: '150'
                },
                {
                    prop: 'activityName',
                    label: '活动名称',
                    width: '200'
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
                    width: '110'
                },
                {
                    prop: 'validDateStart',
                    label: '有效期',
                    width: '110',
                    hasTemplate: true,
                    formatRole: (scope) => {
                        return scope.row.validDateStart ? scope.row.validDateStart + " 至 " + scope.row.validDateEnd : '';
                    }
                },
                {
                    prop: 'createrName',
                    label: '创建人',
                    width: '100'
                },
                {
                    prop: 'orgName',
                    label: '创建单位',
                    width: '150'
                },
                {
                    prop: 'createTime',
                    label: '创建日期',
                    width: '100'
                },
                {
                    prop: 'approvalmanName',
                    label: '审批人',
                    width: '100'
                },
                {
                    prop: 'approvalResult',
                    label: '审批状态',
                    width: '100',
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
                            case 4:
                                return '审批不通过';
                                break;
                            default:
                                return '';
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
            tableOptions: {
                label: "操作",
                fixed: "right",
                width: '250',
                options: [{
                        text: "查看",
                        method: "actDetail",
                        condition: (scope) => {
                            return true;
                        }
                    },
                    {
                        text: "修订",
                        method: "reviseAct",
                        condition: (scope) => {
                            // return (scope.row.approvalResult != 2 || scope.row.activityState != 2) && (scope.row.approvalResult != 3 || scope.row.activityState != 5) && scope.row.approvalResult === 3;
                            return scope.row.approvalResult == 3 && (scope.row.activityState == 3 || scope.row.activityState == 4)
                        }
                    },
                    {
                        text: "修改",
                        method: "updateAct",
                        condition: (scope) => {
                            // return (scope.row.approvalResult != 2 || scope.row.activityState != 2) && (scope.row.approvalResult != 3 || scope.row.activityState != 5) && scope.row.approvalResult !== 3
                            return scope.row.activityState == 1 && (scope.row.approvalResult == 1 || scope.row.approvalResult == 4)
                        }
                    },
                    {
                        text: "作废",
                        method: "cancelAct",
                        condition: (scope) => {
                            // return (scope.row.approvalResult != 2 || scope.row.activityState != 2) && (scope.row.approvalResult != 3 || scope.row.activityState != 5) && (scope.row.approvalResult != 1 && scope.row.activityState != 1);
                            return (scope.row.approvalResult == 3 && (scope.row.activityState == 3 || scope.row.activityState == 4))
                            ||(scope.row.approvalResult == 4 && scope.row.activityState == 1)
                        }
                    },
                    {
                        text: "删除",
                        method: "removeAct",
                        condition: (scope) => {
                            // return scope.row.approvalResult === 1 && scope.row.activityState === 1;
                            return scope.row.activityState == 1 && scope.row.approvalResult == 1
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
                            // return scope.row.approvalResult != 2 && scope.row.approvalResult != 3;;
                            return scope.row.activityState == 1 && (scope.row.approvalResult == 1 || scope.row.approvalResult == 4)
                        }
                    },
                    {
                        text: "查看审批单",
                        method: "approvalDetail",
                        condition: (scope) => {
                            // return scope.row.approvalResult != 1 && scope.row.activityState != 5;
                            return ( scope.row.approvalResult == 2 && scope.row.activityState == 2)
                            ||(scope.row.approvalResult == 3 && (scope.row.activityState == 3 || scope.row.activityState == 4))
                            ||(scope.row.approvalResult == 4 && scope.row.activityState == 1)
                        }
                    },
                ]
            },

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
        search(bool) {
            if(bool == true){
                this.isCache = false;
                this.pageConfig.currentPage = 1;
                this.pageConfig.pageSize = 10;
                this.searchParam = {
                    searchActivityName:"",
                    validDate:"",
                    searchCreaterId:"",
                    searchCreaterArea:"",
                    searchApprovalmanId:"",
                    searchBusinessCode:"",
                    executeMode:"",
                    ruleTemplateId:"",
                    searchState:""
                };
            }
            let _param = this.setParam();
            this.getDataList(_param);
        },

        setParam() {
            let exitsSearhParam = JSON.stringify(this.searchParam) != '{}' ? true : false;
            let params = {};
            let pageData = {
                tenantId: this.tenantId, //商户id
                ruleTemplateId: this.searchParam.ruleTemplateId ? this.searchParam.ruleTemplateId : '17,18,19,20',
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
            for(let item of this.searchConfig){
                if(item.keyName == 'searchActivityName'){
                    item.value = this.searchParam.searchActivityName
                }else if(item.keyName == 'validDate'){
                    item.value = this.searchParam.validDate
                }else if(item.keyName == 'searchCreaterId'){
                    item.value = this.searchParam.searchCreaterId
                }else if(item.keyName == 'searchCreaterArea'){
                    item.value = this.searchParam.searchCreaterArea
                }else if(item.keyName == 'searchApprovalmanId'){
                    item.value = this.searchParam.searchApprovalmanId
                }else if(item.keyName == 'searchBusinessCode'){
                    item.value = this.searchParam.searchBusinessCode
                }else if(item.keyName == 'executeMode'){
                    item.value = this.searchParam.executeMode
                }else if(item.keyName == 'ruleTemplateId'){
                    item.value = this.searchParam.ruleTemplateId
                }else if(item.keyName == 'searchState'){
                    item.value = this.searchParam.searchState
                }
            }
            this.pageConfig.currentPage = 1; //改变搜索条件，从第一页开始查询
        },

        // 获取数据列表
        getDataList(params) {
            this.pageShow = 'actList'
            this.$cmmList.marketingList(params).then(data => {
                if (data && data.code === 200) {
                    console.log("result",data.data.result)
                    if(data.data.result.length <= 0 && params.pageNo > 1){
                        params.pageNo--;
                        this.$cmmList.marketingList(params).then(data => {
                            if (data && data.code === 200) {
                                this.tableData = data.data.result;
                                this.pageConfig.total = data.data.totalCount;
                                this.pageConfig.currentPage = data.data.currentPageNo;
                                for(let item of this.tableData){
                                    if(item.priority === 100){
                                        item.priority = "按最优先执行"
                                    }
                                }
                            }else {
                                this.tableData = [];
                                this.pageConfig.total = 0;
                            }
                            this.isCache = true;
                        }).catch(err => {
                            this.isCache = true;
                            console.log(err)
                        })
                    }else{
                        this.tableData = data.data.result;
                        this.pageConfig.total = data.data.totalCount;
                        this.pageConfig.currentPage = data.data.currentPageNo;
                        for(let item of this.tableData){
                            if(item.priority === 100){
                                item.priority = "按最优先执行"
                            }
                        }
                        // this.$message({
                        //     message: "查询成功",
                        //     type: "success",
                        //     duration: 1000
                        // });
                    }
                } else {
                    this.tableData = [];
                    this.pageConfig.total = 0;
                    // this.$message({
                    //     message: data.msg,
                    //     type: "warning",
                    //     duration: 1000
                    // });
                }
                this.isCache = true;
            }).catch(err => {
                this.isCache = true;
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
                case 'removeAct':
                    this.removeAct(data.scope);
                    break;
                case 'reviseAct':
                    this.reviseAct(data.scope);
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
            this.$confirm(`您确定要作废此记录吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteHandle(scope.row.id)
            }).catch(() => {})
        },
        /* 删除活动 */
        removeAct(scope){
            this.$confirm(`您确定要删除此记录吗?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteHandle(scope.row.id)
            }).catch(() => {})
        },
        /* 新建活动 */
        addAct() {
            this.addOrUpdateHandle(null, "add");
        },
        /* 修订活动 */
        reviseAct(scope){
            this.addOrUpdateHandle(scope.row, "revise");
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
            this.$cmmList.marketingDel({
                "id": id,
                "tenantId": this.tenantId
            }).then(data => {
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
        },
        // 停用或启用
        stopOrStartHandle(id, status) {
            this.startOrStopShow = true
            this.startOrStopForm.remark = ''
            console.log(id, status)
            this.stopOrStartId = id
            this.status = status
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
                                    this.search();
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
                // this.pageShow = 'auditView'
                // this.$nextTick(() => {
                //     this.$refs.auditView.init()
                // })
                this.approvalDetailOpen(scope)
            }

        },
          /* 开启审批单 */
        approvalDetailOpen(scope) {
            console.log(scope)
            this.bizNo=scope.row.activityCode
            this.showApproval=true
        },
         //关闭查看审批单
        approvalDetailClose(){
            this.showApproval=false
        },

    }
}
</script>

<style lang="scss" scoped>
@import "../../../assets/comList.scss";
.el-dropdown-menu__item{
    font-size: 12px !important;
}
</style>
