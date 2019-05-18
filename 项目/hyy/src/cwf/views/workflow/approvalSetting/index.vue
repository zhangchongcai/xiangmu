<template>
<div>
    <div v-if="pageShow=='actList'">
        <!-- 搜索栏 -->
        <!-- <section>
            <searchLan :modelName="modelName" :config="searchConfig" @pressSearch="search" @searchValueChange="setSearch"></searchLan>
        </section> -->
        <!-- 按钮组 -->
        <section class="flex-base flex-end">
            <el-row>
                <el-button type="primary" @click="addDetail">新建</el-button>
            </el-row>
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
    <edit v-if="showDetail" :dialogFormVisible="showDetail" @close="closeDetail" :dataInfo="dataInfo" :showType="showType"></edit>
    
</div>
</template>

<script>
import '../../../assets/common.scss';
import searchLan from '../../../components/search/index.vue';
import commonTable from '../../../components/Table/commonTable.vue';
import edit from './edit'

export default {
    components: {
        searchLan,
        commonTable,
        edit
    },
    data() {
        return {
            dataInfo:{},
            showDetail:false,
            showType:"",
            dialogFormVisible: false,
            pageShow: 'actList',
            tenantId: '1', //商户id
            modelName: "approvalSettingManagement",
            searchConfig: [{
                    keyName: 'searchActivityName',
                    name: '业务单据号',
                    type: 'input',
                    value: ''
                }, {
                    keyName: 'validDate',
                    name: '申请人',
                    type: 'input',
                    value: ''
                }, {
                    keyName: 'executeMode',
                    name: '单据类型',
                    type: 'select',
                    value: '',
                    options: [
                        {
                            label: '全部',
                            value: ''
                        }, {
                            label: '票券销售申请单',
                            value: '1'
                        }, {
                            label: '预充值卡',
                            value: '2'
                        },{
                            label: '营销活动',
                            value: '3'
                        }, {
                            label: '卖品申购单',
                            value: '4'
                        }, {
                            label: '卖品盘点单',
                            value: '5'
                        },{
                            label: '卖品订货单',
                            value: '6'
                        }, {
                            label: '卖品退货单',
                            value: '7'
                        }, {
                            label: '调拨申请单',
                            value: '8'
                        }, {
                            label: '商品零售价调整单',
                            value: '9'
                        }, {
                            label: '套餐零售价调整单',
                            value: '10'
                        }, {
                            label: '采购入库单',
                            value: '11'
                        }, {
                            label: '赠送入库单',
                            value: '12'
                        }
                    ]
                },
                {
                    keyName: 'ruleTemplateId',
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
                    prop: 'name',
                    label: '流程名称',
                    width: '200'
                },
                {
                    prop: 'processList',
                    label: '流程示意图',
                    width: '500',
                    hasTemplate: true,
                    formatRole: (scope)=> {
                        
                    }
                },
                {
                    prop: 'updateTime',
                    label: '创建时间',
                    width: '200',
                },
              
            ],
            tableOptions: {
                label: "操作",
                fixed: "right",
                width: '150',
                options: [{
                        text: "查看",
                        method: "checkDetail",
                        condition: (scope) => {
                            return true;
                        }
                    },
                    {
                        text: "编辑",
                        method: "editDetail",
                        condition: (scope) => {
                            return true
                        }
                    },
                    {
                        text: "删除",
                        method: "delDetail",
                        condition: (scope) => {
                           return true;
                        }
                    }
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
        search() {
            // let _param = this.setParam();
            let _param = {
                pageNo:this.pageConfig.currentPage
                // pageSize:10,
                // biz_no:"",
                // apply_user_name:"",
                // biz_type_name:"",
                // status:[1]

            };
            this.getDataList(_param);
        },

        setParam() {
            
        },

        // 获取数据列表
         getDataList(params) {
            this.$cwfList.selectApprovalProcess(params).then(data => {
                if (data && data.code === 200) {
                    this.tableData = data.data.list;
                    this.pageConfig.total = data.data.total;
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
        checkDetail(scope){
            this.showType="check"
            this.openDetail(scope)
        },
        editDetail(scope){
            this.showType="edit"
            this.openDetail(scope)
        },
        addDetail(){
            this.showType="add"
            this.openDetail()
        },
        delDetail(scope){
            let params= {
                id:scope.row.id
            }
            this.$cwfList.deleteApprovalProcess(params).then(data => {
            if (data && data.code === 200&&data.flag ==0) {
                // this.tableData = data.data.list;
                // this.pageConfig.total = data.data.total;
                this.search()
                this.$message({
                    message: "删除成功",
                    type: "success",
                    duration: 1000
                });
            } else {
                // this.tableData = [];
                // this.pageConfig.total = 0;
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
        openDetail(scope){
            console.log(scope)
            if(scope){
                this.dataInfo=scope.row
            }else{
                this.dataInfo={
                    name:"",
                    noteNum:1,
                    tenantId:111,
                    processList:[],
                    status:0,                    
                }
                this.dataInfo.processList.push({
                    assigneeId:"",
                    assigneeName:"",
                    assigneeType:0,
                    nextNoteNum:0,
                    noteNum:0,
                    tenantId:111
                })
            }
            this.showDetail=true
        },
        closeDetail(){
            this.showDetail=false
        },
        handleSizeChange(){
            
        },
        handleCurrentChange(currentPage){
            this.pageConfig.currentPage = currentPage;
            this.search();
        }

        
        
    }
}
</script>

<style lang="scss" scoped>
section {
    margin-bottom: 15px;
}
</style>
