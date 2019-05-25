<template>
<div>
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" :width="dialog.width">
        <!-- 搜索栏 -->
        <searchLan :modelName="searchConfig.name" :config="searchConfig.elements" :searchLevelButton="searchConfig.isShowLevel" @pressSearch="search" @searchValueChange="setSearch"></searchLan>
        <!-- 表格内容 -->
        <el-table :ref="table.ref" :data="table.data" :border="table.border" highlight-current-row :style="{width: table.width}" @current-change="tableCurrentChange">
            <template v-for="item in table.title">
                <el-table-column :key="item.title" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed">
                    <template slot-scope="scope">
                        <div v-if="!item.hasTemplate">{{scope.row[`${item.prop}`]}}</div>
                        <section v-else>
                            <div></div>
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
                <el-button type="primary" @click="emitFn">确 定</el-button>
                <el-button @click="dialog.visible = false">取 消</el-button>
            </el-row>
        </div>
    </el-dialog>
</div>
</template>

<script>
import searchLan from '../search/index.vue';
export default {
    components: {
        searchLan
    },
    data() {
        return {
            dialog: {
                visible: true,
                title: '查询票券批次',
                width: '85%'
            },
            searchConfig: {
                name: 'saleListDialog',
                isShowLevel: false,
                elements: [{
                    keyName: 'incomeCinemaId',
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
                    keyName: 'couponTypeCode',
                    name: '票券类型',
                    type: 'select',
                    value: '',
                    options: [{
                        label: '全部',
                        value: '1'
                    }, {
                        label: '兑换券',
                        value: '2'
                    }, {
                        label: '优惠券',
                        value: '3'
                    }, {
                        label: '代金券',
                        value: '4'
                    }, ]
                }, {
                    keyName: 'cinemaCode',
                    name: '适用影院编码',
                    type: 'input',
                    value: ''
                }, {
                    keyName: 'channelCode',
                    name: '适用渠道编码',
                    type: 'input',
                    value: ''
                }, {
                    keyName: 'salesMode',
                    name: '销售方式',
                    type: 'input',
                    value: '',
                    readonly: true
                }],
                param: {

                }
            },
            table: {
                ref: 'singleTable',
                width: '100%',
                border: true,
                data: [],
                title: [{
                        prop: 'applyCode',
                        label: '票券销售单号',
                        width: '200px'
                    },
                    {
                        prop: 'counponName',
                        label: '票券名称',
                        width: '200px'
                    },
                    {
                        prop: 'price',
                        label: '单价',
                        width: '200px'
                    },
                    {
                        prop: 'saleNum',
                        label: '可售数量',
                        width: '200px'
                    },
                    {
                        prop: 'startTime',
                        label: '有效期起',
                        width: '200px'
                    },
                    {
                        prop: 'endTime',
                        label: '有效期止',
                        width: '200px'
                    },
                    {
                        prop: 'status',
                        label: '销售单状态',
                        width: '200px'
                    },
                    {
                        prop: 'incomeCinemaId',
                        label: '入账影院',
                        width: '200px'
                    }, {
                        prop: 'cinemaCode',
                        label: '适用影院',
                        width: '200px'
                    }, {
                        prop: 'channelCode',
                        label: '适用渠道',
                        width: '200px'
                    }
                ]
            },
            pagination: {
                currentPage: 1,
                size: 10,
                sizes: [10,20,30,40],
                total: 0
            },
            currentRow: null
        }
    },
    create() {

    },
    methods: {
        /**
         * @function showDialog - 显示弹窗
         */
        showDialog() {
            this.dialog.visible = true;
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
            this.search.param = param;
        },
        /**
         * @function setParams - 设置请求参数
         * 
         * @return {Object} param
         */
        setParams(params) {
            let _param = {};

            let keys = Object.keys(params);

            keys.forEach((item) => {
                let itemVal = params[`${item}`];
                if(typeof itemVal == 'object') {
                    _param[`${item}`] = itemVal.value;
                }else {
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
            console.log(params)
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
        paginationCurrentChange(val){
            this.pagination.currentPage = val;
            this.search();
        },
        /**
         * @function emitFn - 返回选中数据
         */
        emitFn() {
            let param = this.currentRow;
            
            if(param) {
                this.$emit('saleListCallBack',{
                    data: param
                });
            }else {
                this.$message({
                    type: 'warning',
                    message: '请选择一行数据'
                });
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    .margin-top-10 {
        margin-top: 10px;
    }
</style>
