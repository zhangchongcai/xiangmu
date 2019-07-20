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
                <el-button class="fr" type="primary" @click="addDetail">新建</el-button>
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
import minxins from 'frame_cpm/mixins/cacheMixin.js'

export default {
    components: {
        searchLan,
        commonTable,
        edit
    },
    mixins: [minxins.cacheMixin],
    data() {
        return {
            /* 缓存数据 */
            // cacheField: ["pageConfig","tableLabels","tableData"],
            // subComName:"billSetting",
            dataInfo:{},//弹窗传入数据
            showDetail:false,//弹窗是否显示
            showType:"",//弹窗类型
            dialogFormVisible: false,//弹窗开启状态
            tenantId: JSON.parse(localStorage.getItem('user')).consumerId, //商户id
            modelName: "billSettingManagement",//查询模块名字
            //查询配置
            searchConfig: [
                {
                    keyName: 'orginizationName',
                    name: '适用组织名称',
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
                    prop: 'businessName',
                    label: '适用组织名称',
                    width: '500'
                },
                {
                    prop: 'createTime',
                    label: '更新时间',
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
         this.search();
    },
    methods: {
       
        //重置数据
        init(){
            this.pageConfig={
                start: 0,
                pageSize: 10,
                pageSizes: [10, 20, 30, 40],
                currentPage: 1,
                total: 0
            }
            //列表渲染配置
            this.tableLabels=[{
                    prop: 'businessName',
                    label: '适用组织名称',
                    width: '500'
                },
                {
                    prop: 'createTime',
                    label: '更新时间',
                    width: '300',
                },
              
            ],
            this.tableData= []
        },
        //查询列表
        search() {
            let _param = this.setParam();
            this.getBillSettingList(_param);
        },
        setParam() {
            let exitsSearhParam = JSON.stringify(this.searchParam) != '{}' ? true : false;
            let params = {};
            console.log(this.searchParam)
            //查询
            if (exitsSearhParam) {
                let dataParams = {
                    pageNo:this.pageConfig.currentPage,
                    pageSize:this.pageConfig.pageSize,
                    orginizationName:this.searchParam.orginizationName,
                    tenantId:this.tenantId
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
                    tenantId:this.tenantId
                };
            }
            return params;
        },
        //获取单据设置列表
        getBillSettingList(params){
            this.$cwfList.searchBillSetting(params).then(data => {
                if (data && data.code == 200 &&data.flag==1) {
                    this.tableData=data.data.workflowBusinessList.list
                    this.pageConfig.total=data.data.workflowBusinessList.total
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
        //确认删除
        delDetail(scope){
            this.$confirm('确定删除？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
               this.delItem(scope)
            }).catch((msg) => {
                console.log(msg)
            })
        },
        //删除
        delItem(scope){
            let params= {
                merchantId:scope.row.merchantId,
                tenantId:this.tenantId
            }
            this.$cwfList.deleteBillSetting(params).then(data => {
            if (data && data.code === 200&&data.flag==1) {
                this.search()
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
                this.init()
                this.search()
            }
        },
         //修改搜索栏数据
        setSearch(param) {
            this.searchParam = param;
            this.pageConfig.currentPage = 1; //改变搜索条件，从第一页开始查询
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
        // //获取单据设置列表
        // getBillSettingList(){
        //     let params={
        //         pageNo:this.pageConfig.currentPage,
        //         pageSize:this.pageConfig.pageSize,
        //         tenantId:this.tenantId
        //     }
        //     this.$cwfList.getBillSettingList(params).then(data => {
        //         if (data && data.code === 200) {
        //             this.tableData=data.data.workflowBusinessList.list
        //             this.$message({
        //                 message: "查询成功",
        //                 type: "success",
        //                 duration: 1000
        //             });
        //         } else {
        //             this.$message({
        //                 message: data.msg,
        //                 type: "warning",
        //                 duration: 1000
        //             });
        //         }
        //     }).catch(err => {
        //         console.log(err)
        //     })
        // }

        
        
    }
}
</script>

<style lang="scss" scoped>
section {
    margin-bottom: 15px;
}
.fr{
    float: right;
}
.el-pagination{
    text-align: center;
}
</style>
