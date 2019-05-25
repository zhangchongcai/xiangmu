<template>
<div>
    <div>
        <!-- 搜索栏 -->
        <section>
            <searchLan :modelName="modelName" :config="searchConfig" @pressSearch="search" @searchValueChange="setSearch"></searchLan>
        </section>
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
    <!-- 弹窗 -->
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
            dataInfo:{},//弹窗传入数据
            showDetail:false,//弹窗是否显示
            showType:"",//弹窗类型
            dialogFormVisible: false,//弹窗开启状态
            tenantId: 805852, //商户id
            modelName: "approvalSettingManagement",//查询模块名字
            //查询配置
            searchConfig: [
                {
                    keyName: 'searchActivityName',
                    name: '适用商户名称',
                    type: 'input',
                    value: ''
                }
            ],
            //查询的参数
            searchParam: {},
            //分页配置
            pageConfig: {
                start: 0,
                pageSize: 10,
                pageSizes: [10, 20, 30, 40],
                currentPage: 1,
                total: 0
            },
            //列表显示数据
            tableData: [],
            //列表渲染配置
            tableLabels: [{
                    prop: 'orginizationName',
                    label: '适用商户名称',
                    width: '500'
                },
                {
                    prop: 'createTime',
                    label: '创建时间',
                    width: '300',
                },
              
            ],
            //列表操作配置
            tableOptions: {
                label: "操作",
                fixed: "right",
                width: '150',
                options: [{
                        text: "编辑",
                        method: "editDetail",
                        condition: (scope) => {
                            return true;
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

        }
    },
     created() {
        //  this.search();
         this.getBillSettingList()
    },
    methods: {
        setSearch(){

        },
        /* @function search - 搜索
         */
        //查询列表
        search() {
            // let _param = this.setParam();
            let _param = {
                pageNo:1,
                pageSize:10,
                // biz_no:"",
                // apply_user_name:"",
                // biz_type_name:"",
                status:[1]

            };
            this.getDataList(_param);
        },
        // 初始化参数
        setParam() {
            let exitsSearhParam = JSON.stringify(this.searchParam) != '{}' ? true : false;
            let params = {};
            let pageData = {
                tenantId: this.tenantId, //商户id
                ruleTemplateId: this.searchParam.ruleTemplateId ? this.searchParam.ruleTemplateId : '14,15,16',
                pageNo: this.pageConfig.currentPage,
                pageSize: this.pageConfig.pageSize,
                searchValidDateStart: '',
                searchValidDateEnd: ''
            }
            if (exitsSearhParam) {
                if (this.searchParam.validDate) {
                    pageData.searchValidDateStart = this.timeRule(this.searchParam.validDate[0], 'time');
                    pageData.searchValidDateEnd = this.timeRule(this.searchParam.validDate[1], 'time');

                }
                // if (this.searchParam.ruleTemplateId == "") {
                //     this.searchParam.ruleTemplateId = pageData.ruleTemplateId;
                // }
                params = Object.assign(pageData, this.searchParam);
            } else {
                params = pageData;
            }
            return params;
        },

        // 获取查询单据数据列表
         getDataList(params) {
            this.$cwfList.searchApproval(params).then(data => {
                if (data && data.code === 200) {
                    this.tableData = data.data;
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
            this[`${data.method}`](data.scope);
        },
        //编辑
        editDetail(scope){
            this.showType="edit"
            this.openDetail(scope)
        },
        //新增
        addDetail(){
            this.showType="add"
            this.openDetail()
        },
        //删除
        delDetail(scope){
            console.log(scope)
            let params= {
                id:scope.row.id+"",
                orginizationId:scope.row.orginizationId,
                tenantId:805852
            }
            this.$cwfList.deleteBillSetting(params).then(data => {
            if (data && data.code === 200&&data.flag ==0) {
                // this.tableData = data.data.list;
                // this.pageConfig.total = data.data.total;
                this.getBillSettingList()
                this.$message({
                    message: "删除成功",
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
        //打开弹窗并且传入数据
        openDetail(scope){
            if(scope){
                this.dataInfo=scope.row
            }else{
                this.dataInfo={
                                 
                }
            }
            this.showDetail=true
            
        },
        closeDetail(update){
            this.showDetail=false
            if(update){
                this.getBillSettingList()
            }
        },
        handleSizeChange(){
            
        },
        handleCurrentChange(){

        },
        //获取单据设置列表
        getBillSettingList(){
            let params={
                global:1,
                orginizationId:0,
                tenantId:805852
            }
            this.$cwfList.getBillSettingList(params).then(data => {
                if (data && data.code === 200) {
                    this.tableData=data.data.workflowBusinessList
                    this.$message({
                        message: "查询成功",
                        type: "success",
                        duration: 1000
                    });
                } else {
                    this.$message({
                        message: data.msg,
                        type: "warning",
                        duration: 1000
                    });
                }
            }).catch(err => {
                console.log(err)
            })
        }

        
        
    }
}
</script>

<style lang="scss" scoped>
section {
    margin-bottom: 15px;
}
</style>
