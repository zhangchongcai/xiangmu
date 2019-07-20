<template>
<div class="table-page">
    <!-- 搜索栏 -->
    <section class="search-section">
        <searchLan :modelName="modelName" :config="searchConfig" @pressSearch="search" @searchValueChange="setSearch"></searchLan>
    </section>

    <!-- 按钮组 -->
    <section class="btnGroup-section flex-base flex-end">
        <el-row>
            <el-button type="primary" @click="createNew">新建预生成批次</el-button>
        </el-row>
    </section>

    <!-- 表格 -->
    <section class="table-section">
        <commonTable :tableData="tableData" :tableLabels="tableLabels" :tableOptions="tableOptions" @handleButton="handleButton"></commonTable>
    </section>

    <!-- 分页 -->
    <section class="pagination-section flex-base flex-center" v-if="tableData.length != 0">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.currentPage" :page-sizes="pageConfig.pageSizes" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.total">
        </el-pagination>
    </section>

</div>
</template>

<script>
import searchLan from '../../../components/search/index.vue';
import config from 'frame_cpm/http/config.js';
import minxins from 'frame_cpm/mixins/cacheMixin.js';

import {
    formatDate
} from '../../../util/formatDate';
import commonTable from '../../../components/Table/commonTable.vue';
import Axios from 'axios';

export default {
    components: {
        searchLan,
        commonTable
    },
    mixins: [minxins.cacheMixin],
    data() {
        return {
            /* 缓存数据 */
            cacheField: ["searchConfig","tableData","pageConfig"],
            baseURL:config.baseURL,
            modelName: 'numberCreate',
            searchConfig: [{
                keyName: 'batchCode',
                name: '批次号',
                type: 'input',
                value: ''
            }, {
                keyName: 'createTime',
                name: '创建日期',
                type: 'date-picker',
                dateType: "date",
                value: ''
            }, {
                keyName: 'queryCreateUserName',
                name: '创建人',
                type: 'input',
                value: ''
            }],
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
                    prop: 'batchCode',
                    label: '批次号',
                    width: '250',
                }, {
                    prop: 'couponCount',
                    label: '数量',
                    width: '150'
                }, {
                    prop: 'couponColor',
                    label: '票券颜色',
                    width: '150'
                }, {
                    prop: 'createTime',
                    label: '创建日期',
                    width: '150',
                    hasTemplate: true,
                    formatRole: (scope) => {
                        return formatDate(new Date(scope.row.createTime), 'yyyy-MM-dd');
                    }
                }, {
                    prop: 'createUserName',
                    label: '创建人',
                    fixed: true
                },
                {
                    prop: 'status',
                    label: '状态',
                    width: '150',
                    hasTemplate: true,
                    formatRole: (scope) => {
                        return scope.row.status == 0 ? '待生成'  : scope.row.status == 1 ? '已生成'  : '票券已导出' 
                    }
                }
            ],

            tableOptions: {
                label: "操作",
                fixed: "right",
                options: [{
                    text: "导出",
                    method: "exportTicketSure"
                }]
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
        search() {
            let _param = this.setParam();
            this.getData(_param);
        },

        /**
         * @function setParam - 设置请求参数
         * 
         * @param {Object} param - 请求参数
         * @param {String} batchCode - 批次号
         * @param {String} createTime  - 创建日期
         * @param {String} queryCreateUserName - 创建人
         * @param {String} pageNo  - 当前页码
         * @param {String} pageSize - 一页记录数
         */
        setParam() {
            let pointer = this;
            let exitsSearhParam = JSON.stringify(pointer.searchParam) != '{}' ? true : false;
            let _param = {
                batchCode: exitsSearhParam ? pointer.searchParam.batchCode : '',
                createTime: exitsSearhParam && pointer.searchParam.createTime ? formatDate(new Date(pointer.searchParam.createTime), "yyyy-MM-dd") : '',
                queryCreateUserName: exitsSearhParam ? pointer.searchParam.queryCreateUserName : '',
                pageNo: pointer.pageConfig.currentPage,
                pageSize: pointer.pageConfig.pageSize
            }
            return _param;
        },

        /**
         * @function setSearch - 修改搜索栏数据
         * 
         */
        setSearch(param) {
            this.searchParam = param;
            this.pageConfig.currentPage = 1; //改变搜索条件，从第一页开始查询
        },

        /**
         * @function getData - 请求表格数据
         * @param {Object} param - 请求数据
         */
        getData(param) {

            let pointer = this;
            this.$ccmList.getTicketNumerList(param).then(data => {
                let flag = data.flag;
                let message = data.msg;
                let type = 'warning';
                if (flag == 1) {
                    type = 'success';
                }

                // pointer.$message({
                //     type,
                //     message,
                //     duration:1000
                // })

                if (type == 'success') {
                    pointer.tableData = data.data;
                    pointer.pageConfig.total = data.pageNum;
                }

            }).catch(msg => {
                console.log(`查询错误,错误信息:${msg}`);
            });
        },

        handleButton(data) {
            if (data.method == "exportTicketSure") {
                this.exportTicketSure(data.scope)
            }
        },

        /**
         * @function exportTicketSure - 确认导出
         * 
         * @param {Object} scope - 参数
         */
        exportTicketSure(scope) {
            let _this = this;
            let _param = scope.row.batchCode;

            if (scope.row.status == 0) {
                return this.$message({
                    type: 'warning',
                    message: '该票券处于待生成状态，无法导出！'
                })
            }

            if (scope.row.status == 1) {
                _this.exportTicket(_param);
            }

            if (scope.row.status == 2) {
                _this.$confirm('该批票券编号已导出过，是否再次导出？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.exportTicket(_param);
                }).catch(() => {

                });
            }
        },

        /**
         * @function exportTicket - 导出
         * 
         * @param {String} value
         */
        exportTicket(param) {
            console.log('导出')
            let pointer = this;
            let type = "warning";
            let url = this.baseURL + "/coupon/prebuild/exportExcel?batchCode=" + param;
            console.log(this.baseURL)
            // let store = this.$stroe
            let headers = {
                // "Content-Type": "application/json;charset=UTF-8",
                // Authorization: store.state.loginToken,
                // timestamp: timestamp,
                // sign: md5(store.state.loginToken + store.state.signKey + timestamp),
                "Cpm-User-Token": localStorage.getItem("token")
            };
                // this.$ccmList.exportExcel({batchCode:param}).
            this.axios(url, {
                headers,
                method: "get",
                responseType: "blob"
            }).then(data => {
                console.log(data)
                let flag = data.headers.flag;
                let message =data.msg? data.msg : '票券导出失败，请稍后尝试！';
                if (flag == '1') {
                    type = "success";
                    message = '票券导出成功！';
                    const blob = new Blob([data.data]);
                    const fileName = data.headers.filename;
                    const elink = document.createElement('a');
                    elink.download = fileName;
                    elink.style.display = 'none';
                    elink.href = URL.createObjectURL(blob);
                    document.body.appendChild(elink);
                    elink.click();
                    URL.revokeObjectURL(elink.href); // 释放URL 对象
                    document.body.removeChild(elink);
                }else if(flag == '2'){
                    message = '该批次导出次数超出系统限制,无法导出'
                }else if(flag == '3'){
                    message = '预生成批次不存在'
                }
                this.$message({
                    type,
                    message
                });

            });

        },

        /**
         * @function createNew - 新建预生成批次
         */
        createNew() {
            this.$router.push({
                path: 'addNumber'
            })
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
        }

    }

}
</script>

<style lang="scss" scoped>

</style>
