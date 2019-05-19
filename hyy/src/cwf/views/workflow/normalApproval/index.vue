<template>
<div>
    <div v-if="pageShow=='actList'">
        <!-- 搜索栏 -->
        <section>
            <searchLan :modelName="modelName" :config="searchConfig" @pressSearch="search" @searchValueChange="setSearch"></searchLan>
        </section>
      
        <!-- 表格 -->
        <section>
            <commonTable :tableData="tableData" :tableLabels="tableLabels" :tableOptions="tableOptions" @handleButton="handleButton"></commonTable>
        </section>

        <!-- 分页 -->
        <section class="flex-base flex-center" v-if="tableData.length != 0">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.currentPage" :page-sizes="pageConfig.pageSizes" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.total">
            </el-pagination>
        </section>
    </div>
    <!-- 查询弹窗 -->
    <check v-if="showApproval" :dialogFormVisible="showApproval" @close="approvalDetailClose" :checkInfo="checkInfo"></check>
    <!-- 审批弹窗 -->
    <approval v-if="showApprovalSetting" :dialogFormVisible="showApprovalSetting" @close="approvalSettingClose" :approvalInfo="approvalInfo"></approval>
</div>
</template>

<script>
import '../../../assets/common.scss';
import searchLan from '../../../components/search/index.vue';
import commonTable from '../../../components/Table/commonTable.vue';
import check from './check'
import approval from './approval'

export default {
    components: {
        searchLan,
        commonTable,
        check,
        approval
    },
    data() {

        return {
            checkInfo:{},//查询数据
            approvalInfo:{},//审批数据

            showApproval:false,//是否显示查询弹窗
            showApprovalSetting:false,//是否显示审批弹窗

            // dialogFormVisible: false,
            // pageShow: 'actList',
            tenantId: '1', //商户id
            modelName: "normalApprovalManagement",//搜索栏区域名
            //查询配置
            searchConfig: [{
                    keyName: 'bizNo',
                    name: '业务单据号',
                    type: 'input',
                    value: ''
                }, {
                    keyName: 'applyUserName',
                    name: '申请人',
                    type: 'input',
                    value: ''
                }, {
                    keyName: 'bizTypeName',
                    name: '单据类型',
                    type: 'select',
                    value: '',
                    options: [
                        {
                            label: '票券销售申请单',
                            value: '票券销售申请单'
                        }, {
                            label: '预充值卡',
                            value: '预充值卡'
                        },{
                            label: '营销活动',
                            value: '营销活动'
                        }, {
                            label: '卖品申购单',
                            value: '卖品申购单'
                        }, {
                            label: '卖品盘点单',
                            value: '卖品盘点单'
                        },{
                            label: '卖品订货单',
                            value: '卖品订货单'
                        }, {
                            label: '卖品退货单',
                            value: '卖品退货单'
                        }, {
                            label: '调拨申请单',
                            value: '调拨申请单'
                        }, {
                            label: '商品零售价调整单',
                            value: '商品零售价调整单'
                        }, {
                            label: '套餐零售价调整单',
                            value: '套餐零售价调整单'
                        }, {
                            label: '采购入库单',
                            value: '采购入库单'
                        }, {
                            label: '赠送入库单',
                            value: '赠送入库单'
                        }
                    ]
                },
                {
                    keyName: 'statusRespons',
                    name: '审批状态',
                    type: 'select',
                    value: '',
                    options: [
                        {
                            label: '待审核',
                            value: '1'
                        }, {
                            label: '审核通过',
                            value: '2'
                        }, {
                            label: '审核驳回',
                            value: '3'
                        }

                    ]
                },
            ],
            //查询返回参数
            searchParam: {},
            //分页设置
            pageConfig: {
                start: 0,
                pageSize: 10,
                pageSizes: [10, 20, 30, 40],
                currentPage: 1,
                total: 0
            },
            //表格数据
            tableData: [],
            //表格项名称数据
            tableLabels: [{
                    prop: 'bizNo',
                    label: '业务单据号',
                    width: '150'
                },
                {
                    prop: 'bizName',
                    label: '单据名称',
                    width: '150'
                },
                {
                    prop: 'bizTypeName',
                    label: '单据类型',
                    width: '150'
                },
                {
                    prop: 'createTime',
                    label: '创建时间',
                    width: '200'
                },
                {
                    prop: 'applyUserName',
                    label: '申请人',
                    width: '80'
                },
                {
                    prop: 'applyGroupName',
                    label: '申请人单位',
                    width: '100'
                },
                {
                    prop: 'statusRespons',
                    label: '审批状态',
                    width: '80',
                    hasTemplate: true,
                    formatRole: (scope) => {
                        switch (scope.row.statusRespons) {
                            case 1:
                                return '待审核';
                                break;
                            case 2:
                                return '审核通过';
                                break;
                            case 3:
                                return '审核驳回';
                                break;
                            default:
                                return '未知状态';
                                break;
                        };
                    }
                }
            ],
            //表格操作设置
            tableOptions: {
                label: "操作",
                fixed: "right",
                width: '150',
                options: [{
                        text: "查看",
                        method: "approvalDetail",
                        condition: (scope) => {
                            return true;
                        }
                    },{
                        text: "审批",
                        method: "approvalSetting",
                        condition: (scope) => {
                            return (scope.row.statusRespons != 2 && scope.row.statusRespons != 3)
                        }
                    }
                ]
            },

            // startOrStopShow: false,
            // status: 0,
            // stopOrStartId: '',
            // startOrStopForm: {
            //     remark: ''
            // },
            // startOrStopRule: {
            //     remark: [{
            //         required: true,
            //         message: '备注不能为空',
            //         trigger: 'blur'
            //     }]
            // }
        }
    },
     created() {
         this.search();
    },
    methods: {
        //搜索
        search() {
            let _param = this.setParam();
            this.getDataList(_param);
        },
        //重构数据
        setParam() {
            let exitsSearhParam = JSON.stringify(this.searchParam) != '{}' ? true : false;
            let params = {};
            let pageData = 
            console.log(this.searchParam)
            //查询
            if (exitsSearhParam) {
                let statusRespons=[]
                if(this.searchParam.statusRespons){
                    statusRespons.push(parseInt(this.searchParam.statusRespons))
                    
                }else{
                    statusRespons=[1]
                }
                
                let dataParams = {
                    pageNo:this.pageConfig.currentPage,
                    pageSize:this.pageConfig.pageSize,
                    bizNo:this.searchParam.bizNo,
                    applyUserName:this.searchParam.applyUserName,
                    bizTypeName:this.searchParam.bizTypeName,
                    status:statusRespons
                };
                //过滤空的值
                for (let key in dataParams) {
                    if(dataParams[key]){
                        params[key]=dataParams[key]
                    }
                }

            } else {
                params = {
                    pageNo:this.pageConfig.currentPage,
                    pageSize:this.pageConfig.pageSize,
                    status:[1]
                };
            }
            return params;
        },
        //修改搜索栏数据
        setSearch(param) {
            this.searchParam = param;
            this.pageConfig.currentPage = 1; //改变搜索条件，从第一页开始查询
        },
        // 获取数据列表
        getDataList(params) {
            this.pageShow = 'actList'
            this.$cwfList.searchApproval(params).then(data => {
                if (data && data.code === 200) {
                    this.tableData = data.data;
                    this.pageConfig.total = data.pageNum;
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
            this[`${data.method}`](data.scope);
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
            // this.handleCommand(2, scope);
            console.log("checkInfo",scope)
            this.checkInfo=scope.row
            this.showApproval=true
        },
        approvalSetting(scope){
            console.log("approvalInfo",scope)
            this.approvalInfo=scope.row
            this.showApprovalSetting=true
        },
        approvalDetailClose(){
            this.showApproval=false
        },
        approvalSettingClose(){
            this.showApprovalSetting=false
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
                                this.search()
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
