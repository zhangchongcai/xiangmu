<template>
<div class="table-page">
    <!-- 搜索栏 -->
    <section class="search-section">
        <searchLan :modelName="modelName" :config="searchConfig" @pressSearch="search" @searchValueChange="setSearch"></searchLan>
    </section>

    <!-- 表格 -->
    <section class="table-section">
        <el-table :data="tableData" style="width: 100%">
            <template v-for="(item,index) in tableConfig">
                <el-table-column v-if="!item.hasTemplate" :key="index" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
                <el-table-column v-else-if="item.hasTemplate" :key="index" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fixed">
                    <template slot-scope="scope">
                        <div v-if="item.label == '操作'">
                            <el-button type="text" @click="print(scope.row)">打印</el-button>
                            <el-button type="text" @click="rePrint(scope.row)">重打</el-button>
                        </div>
                    </template>
                </el-table-column>
            </template>
        </el-table>
    </section>

    <!-- 分页 -->
    <section class="pagination-section flex-base flex-center" v-if="tableData.length != 0">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageConfig.currentPgae" :page-sizes="pageConfig.pageSizes" :page-size="pageConfig.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pageConfig.total">
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
            tableData: [],
            modelName: 'printManagement',
            searchConfig: [{
                name: '申请单号',
                keyName: 'orderList',
                type: 'input',
                value: ''
            }, {
                name: '票券名称',
                keyName: 'ticketName',
                type: 'input',
                value: ''
            }, {
                name: '申请人',
                keyName: 'proposer',
                type: 'input',
                value: {
                    value: '',
                    text: ''
                },
                alertButton: true,
                alertSrc: 'http://192.168.100.148:8080/alertWindow',
                isNeedReturn: true
            }],
            tableConfig: [{
                    label: '申请单号',
                    prop: 'applyCode',
                    width: '200'
                }, {
                    label: '票券名称',
                    prop: 'couponName',
                    width: '200'
                }, {
                    label: '客户名称',
                    prop: 'applyCode',
                    width: '200'
                }, {
                    label: '票券类型',
                    prop: 'couponType',
                    width: '200'
                }, {
                    label: '申请日期',
                    prop: 'createTime',
                    width: '200'
                }, {
                    label: '数量',
                    prop: 'salesnum',
                    width: '200'
                }, {
                    label: '单价',
                    prop: 'price',
                    width: '200'
                }, {
                    label: '已打印数量',
                    prop: 'printCount',
                    width: '200'
                }, {
                    label: '未打印数量',
                    prop: 'unPrintCount',
                    width: '200'
                }, {
                    label: '最后打印序列号',
                    prop: 'lastPrintSeq',
                    width: '200'
                },
                {
                    label: '操作',
                    width: '200',
                    hasTemplate: true,
                    fixed: 'right'
                }
            ],
            /* 分页设置 */
            pageConfig: {
                currentPage: 1,
                pageSizes: [10, 20, 30, 40],
                pageSize: 10,
                total: 15
            },
            searchParam: {}
        }
    },
    created() {
        let data = {
            "totalCount": 10,
            "result": [{
                "createTime": "2019-03-07 17:23:58",
                "price": 5,
                "couponName": "测试用券E",
                "printCount": 0,
                "couponType": "0",
                "salesnum": 10,
                "applyCode": "XS201903070009",
                "unPrintCount": 10,
                "lastPrintSeq": 0
            }, {
                "createTime": "2019-03-07 16:46:15",
                "price": 3,
                "couponName": "测试用券D",
                "printCount": 0,
                "couponType": "0",
                "salesnum": 10,
                "applyCode": "XS201903070007",
                "unPrintCount": 10,
                "lastPrintSeq": 0
            }, {
                "createTime": "2019-03-07 16:45:30",
                "price": 3,
                "couponName": "测试用券C",
                "printCount": 0,
                "couponType": "0",
                "salesnum": 10,
                "applyCode": "XS201903070005",
                "unPrintCount": 10,
                "lastPrintSeq": 0
            }, {
                "createTime": "2019-03-07 16:34:06",
                "price": 3,
                "couponName": "测试用券B",
                "printCount": 0,
                "couponType": "0",
                "salesnum": 10,
                "applyCode": "XS201903070003",
                "unPrintCount": 10,
                "lastPrintSeq": 0
            }, {
                "createTime": "2019-03-07 16:06:17",
                "price": 5,
                "couponName": "测试用券A",
                "printCount": 0,
                "couponType": "0",
                "salesnum": 10,
                "applyCode": "XS201903070001",
                "unPrintCount": 10,
                "lastPrintSeq": 0
            }, {
                "createTime": "2019-02-13 17:52:11",
                "price": 100,
                "couponName": "一券兑换一张影票",
                "printCount": 5,
                "couponType": "0",
                "salesnum": 10,
                "applyCode": "XS201902130005",
                "unPrintCount": 5,
                "lastPrintSeq": 5
            }, {
                "createTime": "2019-02-13 15:45:58",
                "price": 0,
                "couponName": "测试券",
                "printCount": 0,
                "couponType": "0",
                "salesnum": 10,
                "applyCode": "XS201902130001",
                "unPrintCount": 10,
                "lastPrintSeq": 0
            }, {
                "createTime": "2018-12-01 09:10:21",
                "price": 0,
                "couponName": "测试券兑换影票",
                "printCount": 10,
                "couponType": "0",
                "salesnum": 100,
                "applyCode": "XS201812010001",
                "unPrintCount": 90,
                "lastPrintSeq": 10
            }, {
                "createTime": "2018-11-25 14:52:59",
                "price": 5,
                "couponName": "小食兑换券",
                "printCount": 20,
                "couponType": "0",
                "salesnum": 100,
                "applyCode": "XS201811240001",
                "unPrintCount": 80,
                "lastPrintSeq": 20
            }, {
                "createTime": "2018-11-25 14:51:49",
                "price": 0,
                "couponName": "VIP",
                "printCount": 15,
                "couponType": "0",
                "salesnum": 20,
                "applyCode": "XS201811250001",
                "unPrintCount": 5,
                "lastPrintSeq": 15
            }]
        };

        this.tableData = data.result;
    },
    methods: {
        /**
         * @function setSearch - 修改搜索栏
         */
        setSearch(param) {
            this.searchParam = param;
        },

        /**
         * @function search - 搜索
         */
        search(param) {
            console.log(param);
        },

        /**
         * @function print - 打印
         */
        print(param) {
            console.log(param)
        },

        /**
         * @function rePrint - 重打
         */
        rePrint(param) {
            console.log(param)
        },

        /**
         * @function handleSizeChange - 分页改变size
         */
        handleSizeChange() {

        },

        /**
         * @function handleCurrentChange - 分页改变页码
         */
        handleCurrentChange() {

        }
    },
}
</script>

<style lang="scss" scoped>

</style>
