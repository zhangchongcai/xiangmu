<template>
<div class="table-page">
    <!-- 搜索栏 -->
    <section class="search-section">
        <searchLan :modelName="modelName" :config="searchConfig" @pressSearch="search" @searchValueChange="setSearch"></searchLan>
    </section>

    <!-- 按钮 -->
    <section class="btnGroup-section flex-base flex-end">
        <el-button type="primary" plain @click="addItem">新建</el-button>
        <el-button type="primary" plain @click="deleteSelectItem">删除</el-button>
    </section>

    <!-- 表格 -->
    <section class="table-section">
        <el-table ref="multipleTable" :data="tableConfig.data" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
            <template v-for="(item,index) in tableConfig.title">
                <el-table-column :key="index" v-if="item.type == 'selection'" :type="item.type" :width="item.width"></el-table-column>
                <el-table-column :key="index" v-if="!item.type && !item.hasTemplate" :width="item.width" :label="item.label">
                    <template slot-scope="scope">
                        <div v-if="item.prop == 'couponName'">
                            {{scope.row.couponName}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column :key="index" v-if="!item.type && item.hasTemplate" :width="item.width" :label="item.label" :fixed="item.fixed">
                    <template slot-scope="scope">
                        <div v-if="item.prop == 'couponType'">
                            {{scope.row.couponType == '0' ? '兑换券' : scope.row.couponType == '1' ? '代金券' : '优惠券'}}
                        </div>
                        <div v-else-if="item.prop == 'couponTypeStatus'">
                            {{scope.row.couponTypeStatus == '1' ? '无效' : '有效'}}
                        </div>
                        <div v-else-if="item.prop == 'control'">
                            <el-button type="text" @click="editItem(scope)">修改</el-button>
                            <el-button type="text" @click="deleteItem(scope)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </template>
        </el-table>
    </section>

    <!-- 分页 -->
    <section v-if="tableConfig.data.length != 0" class="pagination-section flex-base flex-center">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.currentPage" :page-sizes="pageConfig.pageSizes" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.total">
        </el-pagination>
    </section>
</div>
</template>

<script>
import searchLan from '../../../components/search/index.vue';
export default {
    components: {
        searchLan
    },
    data() {
        return {
            modelName: 'typeManagement',
            searchConfig: [{
                keyName: 'couponName',
                name: '分类名称',
                type: 'input',
                value: ''
            }, {
                keyName: 'couponType',
                name: '类型',
                type: 'select',
                value: '',
                options: [{
                    label: '全部',
                    value: ''
                }, {
                    label: '兑换券',
                    value: '0'
                }, {
                    label: '代金券',
                    value: '1'
                }, {
                    label: '优惠券',
                    value: '2'
                }]
            }, {
                keyName: 'couponTypeStatus',
                name: '状态',
                type: 'select',
                value: '',
                options: [{
                    label: '全部',
                    value: ''
                }, {
                    label: '有效',
                    value: '0'
                }, {
                    label: '无效',
                    value: '1'
                }]
            }],
            tableConfig: {
                title: [{
                    type: 'selection',
                }, {
                    label: '分类名称',
                    prop: 'couponName'
                }, {
                    label: '类型',
                    prop: 'couponType',
                    hasTemplate: true
                }, {
                    label: '状态',
                    prop: 'couponTypeStatus',
                    hasTemplate: true
                }, {
                    label: '操作',
                    prop: 'control',
                    fixed: 'right',
                    hasTemplate: true
                }],
                data: []
            },
            multipleSelection: [],
            /* 分页设置 */
            pageConfig: {
                currentPage: '1',
                pageSizes: [10, 20, 30, 40],
                pageSize: 10,
                currentPage: 1,
                total: 10
            },
            /* 搜索返回值 */
            searchParam: {},
            /* 查询提示 */
            searchBool:false
        }
    },
    created() {
        let _param = this.setParam();
        this.getTableData(_param);
    },
    methods: {
        /**
         * @function setSearch - 实时监听数据返回
         */
        setSearch(param) {
            this.searchParam = param;
        },
        /**
         * @function setParam - 初始化请求参数
         */
        setParam(data) {
            let _data = data ? data : {};
            let couponName = _data.couponName ? _data.couponName : this.searchParam.couponName ? this.searchParam.couponName : '';
            let couponType = _data.couponType ? _data.couponType : this.searchParam.couponType ? this.searchParam.couponType : '';
            let couponTypeStatus = _data.couponTypeStatus ? _data.couponTypeStatus : this.searchParam.couponTypeStatus ? this.searchParam.couponTypeStatus : '';
            let param = {
                couponName,
                couponType,
                couponTypeStatus,
                pageNo: this.pageConfig.currentPage,
                pageSize: this.pageConfig.pageSize
            };

            return param;
        },
        /**
         * @function search - 查询
         */
        search(param, isPagenation) {
            let c_param;
            if (!isPagenation) {
                this.searchParam = param;
                c_param = param;
            } else {
                c_param = this.searchParam;
            }
            
            let _param = this.setParam(c_param);
            this.getTableData(_param);

            this.searchBool = true;
        },
        /**
         * @function getTableData - 获取表格数据
         */
        getTableData(param) {
            let pointer = this;
            this.$ccmList.findCouponList(param).then(data => {
                console.log(data);
                let type = '';
                if (data.code == 200) {
                    type = 'success';
                } else {
                    type = 'warning';
                }
                if (type == 'success') {
                    pointer.tableConfig.data = data.data;
                    pointer.pageConfig.total = data.pageNum;
                }
                /* 查询提示弹窗 */
                if(this.searchBool){
                    if(type == 'success'){
                        data.msg = '查询成功';
                    }else{
                        data.msg = '查询失败';
                    }
                    pointer.$message({
                        message: data.msg,
                        type
                    });
                    this.searchBool = false;
                }

            }).catch(msg => {
                console.log('错误:', msg);
            })
        },
        /**
         * @function handleSelectionChange - 统一处理选中
         * @param {array} val - element-table对象 选中对象数组
         */
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        /**
         * @function editItem - 修改所选项
         * @param {object} scope - element-table对象
         * @param {object} scope.row - 当前所选行数据
         */
        editItem(scope) {
            this.$router.push({
                path: 'addTicket',
                query: {
                    data: scope.row,
                    isChangeType: true
                }
            });
        },
        /**
         * @function deleteItem - 删除所选项
         * @param {object} scope - element-table对象
         * @param {object} scope.row - 当前所选行数据
         */
        deleteItem(scope) {
            let pointer = this;
            let data = scope.row;
            let deleteId = data.id;
            let ticketName = data.couponName;
            let ticketType = data.couponType == '0' ? '兑换券' : data.couponType == '2' ? '优惠券' : '代金券';
            pointer.$confirm(`确定删除${ticketType}(${ticketName})`, '提示')
                .then(_ => {
                    pointer.sendDeleteItem([`${deleteId}`]);
                }).catch(_ => {});
        },
        /**
         * @function addItem - 添加一项
         */
        addItem() {
            this.$router.push({
                path: 'addTicket'
            })
        },
        /**
         * @function deleteSelectItem - 删除所选项
         */
        deleteSelectItem() {
            let pointer = this;
            let multipleSelection = pointer.multipleSelection;

            if (multipleSelection.length == 0) {
                return this.$message({
                    message: '请选择需要删除的票券分类再操作！',
                    type: 'warning'
                });
            }

            let deleteArray = [];
            for (let i = 0; i < multipleSelection.length; i++) {
                deleteArray.push(multipleSelection[i].id);
            }

            pointer.sendDeleteItem(deleteArray);
        },
        /**
         * @function sendDeleteItem - 发送删除项
         * @param {Array} ids - 需要删除的项,必须是数组
         */
        sendDeleteItem(ids) {
            let pointer = this;
            let param = {
                ids
            }
            pointer.$ccmList.deleteCouponType(param).then(data => {
                let flag = data.flag;

                let type = '';
                if (flag == 3) {
                    type = 'success';
                } else if (flag == 1 || flag == 2) {
                    type = 'warning';
                } else {
                    type = 'error';
                }
                if(type == 'success'){
                    data.msg ='删除成功';
                }else if(type == 'error'){
                    data.msg ='删除失败';
                }

                pointer.$message({
                    showClose: true,
                    message: data.msg,
                    type
                });

                if (flag == 3) {
                    let _param = this.setParam();
                    pointer.getTableData(_param);
                }

            }).catch(msg => {
                console.log(msg)
            });
        },
        /**
         * @function handleSizeChange - elementui分页回调，每页条数
         */
        handleSizeChange(e) {
            this.pageConfig.pageSize = e;
            this.search('', true);
        },
        /**
         * @function handleCurrentChange - elementui分页回调,当前页
         */
        handleCurrentChange(e) {
            this.pageConfig.currentPage = e;
            this.search('', true);
        },
        /**
         * @function prevClick - elementui分页回调,上一页
         */
        prevClick(e) {
            this.pageConfig.currentPage = e;
            this.search('', true);
        },
        /**
         * @function nextClick - element分页回调，下一页
         */
        nextClick(e) {
            this.pageConfig.currentPage = e;
            this.search('', true);
        }
    }
}
</script>

<style lang="scss" scoped>
.search-lan {
    background: #F5F5F5;

    ul {
        padding: 24px;

        li {
            margin-right: 30px;
        }
    }
}

// .btn-group {
//     margin-top: 8px;
//     justify-content: flex-end;
// }

// .pagination {
//     margin: 10px 0;
//     justify-content: center;
// }
</style>
