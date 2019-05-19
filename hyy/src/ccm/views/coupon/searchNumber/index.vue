<template>
<div class="table-page">
    <!-- 搜索栏 -->
    <section class="search-section">
        <searchLan :modelName="modelName" :config="searchConfig" @pressSearch="search" @searchValueChange="setSearch"></searchLan>
    </section>

    <!-- 信息提示/按钮组 -->
    <section class="btnGropu-section flex-base flex-between">
        <div class="flex-base searchInfo">
            <span class="searchInfo_title">查询结果明细：</span>
            <ul class="flex-base searchInfo_content">
                <li class="flex-base" v-for="(item,index) in searchInfo" :key="index">
                    <span>{{item.label}}:</span>
                    <span>{{item.value}}张</span>
                </li>
            </ul>
        </div>
    </section>

    <!-- 表格 -->
    <section class="table-section">
        <el-table :data="tableConfig.data" style="width: 100%">
            <template v-for="(item,index) in tableConfig.title">
                <el-table-column :key="index" v-if="item.prop && !item.hasTemplate" :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip :fixed="item.fixed"></el-table-column>
                <el-table-column :key="index" v-else-if="item.hasTemplate" :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip :fixed="item.fixed">
                    <template v-if="item.label == '票券状态'" slot-scope="scope">
                        {{counponStatus(scope.row.status)}}
                    </template>
                    <template v-if="item.label == '操作'" slot-scope="scope">
                        <el-button :key='item.label' type="text" v-for="item in controlBtn(scope.row.status)" @click="emitFn(item.emitFn,scope.row)">{{item.text}}</el-button>
                    </template>
                </el-table-column>
            </template>
        </el-table>
    </section>
    
    <!-- 分页 -->
    <section class="pagination-section flex-base flex-center" v-if="tableConfig.data.length != 0">
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
            /* 查询结果明显 */
            searchInfo: [{
                label: '总票券数量',
                value: 0
            }, {
                label: '激活状态',
                value: 0
            }, {
                label: '已消费',
                value: 0
            }, {
                label: '已退货',
                value: 0
            }, {
                label: '停用',
                value: 0
            }, {
                label: '已打印',
                value: 0
            }, ],
            /* 当前模块的名称 - 用于避免弹窗消息 */
            modelName: 'searchNumber',
            /* 搜索栏 */
            searchConfig: [{
                    keyName: 'applyCode',
                    name: '销售申请单号',
                    type: 'input',
                    value: ''
                }, {
                    keyName: 'couponCode',
                    name: '票券编号',
                    type: 'input',
                    value: ''
                }, {
                    keyName: 'status',
                    name: '票券状态',
                    type: 'select',
                    value: '',
                    options: [{
                        label: '全部',
                        value: ''
                    }, {
                        label: '激活',
                        value: '1'
                    }, {
                        label: '已消费',
                        value: '2'
                    }, {
                        label: '已退货',
                        value: '3'
                    }, {
                        label: '停用',
                        value: '4'
                    }, {
                        label: '已作废',
                        value: '6'
                    }]
                },
                //  {
                //     keyName: 'alreadyPresented',
                //     name: '是否已赠送',
                //     type: 'select',
                //     value: '',
                //     options: [{
                //         label: '不限',
                //         value: 'selected'
                //     }, {
                //         label: '是',
                //         value: '1'
                //     }, {
                //         label: '否',
                //         value: '2'
                //     }],
                // }, {
                //     keyName: 'memberCarNo',
                //     name: '会员卡号',
                //     type: 'input',
                //     value: ''
                // }, {
                //     keyName: 'telphoneNo',
                //     name: '手机号',
                //     type: 'input',
                //     value: ''
                // }, 
                {
                    keyName: 'contractCode',
                    name: '合同协议号',
                    type: 'input',
                    value: ''
                }
            ],
            /* 表格设置 */
            tableConfig: {
                data: [],
                title: [{
                    label: '销售申请单号',
                    prop: 'applyCode',
                    width: '200',
                }, {
                    label: '票券编号',
                    prop: 'couponCode',
                    width: '200',
                }, {
                    label: '票券名称',
                    prop: 'couponName',
                    width: '200',
                }, {
                    label: '赠送',
                    prop: 'gifty',
                    width: '200',
                }, {
                    label: '会员手机号',
                    prop: 'memberPho',
                    width: '200',
                }, {
                    label: '会员卡号',
                    prop: 'memberNo',
                    width: '200',
                }, {
                    label: '激活日期',
                    prop: 'actTime',
                    width: '200',
                }, {
                    label: '消费日期',
                    prop: 'saleTime',
                    width: '200',
                }, {
                    label: '绑定日期',
                    prop: 'bindDay',
                    width: '200',
                }, {
                    label: '票券状态',
                    prop: 'status',
                    hasTemplate: true,
                    width: '200',
                }, {
                    label: '操作',
                    fixed: 'right',
                    hasTemplate: true,
                    width: '200'
                }]
            },
            /* 分页设置 */
            pageConfig: {
                pageSizes: [10, 20, 30, 40],
                pageSize: 10,
                currentPage: 1,
                total: 0
            },
            searchParam: {}
        }
    },
    created() {
        let applyCode = this.$route.query[`applyCode`];
        if (applyCode) {
            this.searchConfig[0].value = applyCode;
            this.searchParam.applyCode = applyCode;
            this.search();
        }
    },
    methods: {
        /**
         * @function setSearch - 实时返回搜索栏数据
         */
        setSearch(param) {
            this.searchParam = param;
        },
        /**
         * @function search - 搜索
         * @param {Object} param - 搜索栏回传参数
         */
        search(param) {
            let params = this.setParams(param);

            if (params.isShow) {
                return this.$message({
                    type: 'warning',
                    message: '请输入“申请单号”或“合同协议号”或“票券编号”或“会员卡号”或“手机号”进行查询。',
                    showClose: true
                });
            }

            this.$ccmList.queryCodeList(params).then(data => {
                if (data.flag == 1) {
                    if (data.data) {
                        this.tableConfig.data = data.data;
                        this.pageConfig.total = data.pageNum;
                        // 设置查询信息
                        this.setSearchInfo(data.data);
                    }
                } else {
                    this.$message({
                        type: 'warning',
                        message: '票券编号查询失败，请稍后再尝试！'
                    })
                }

            }).catch(msg => {
                console.log('票券编号查询错误：', msg);
            })
        },
        /**
         * @function setParams - 设置请求参数
         */
        setParams(param) {
            param = JSON.stringify(param) != '{}' ? param : undefined;
            let params = {};
            let keysArr = [{
                    key: 'applyCode',
                    isReg: true
                },
                {
                    key: 'status',
                    isReg: false
                },
                {
                    key: 'contractCode',
                    isReg: true
                },
                {
                    key: 'couponCode',
                    isReg: true
                }
            ]
            let message = {
                isShow: true
            };
            keysArr.forEach((item, index) => {
                let key = item.key;
                let isReg = item.isReg;

                if (!params[`${key}`]) {
                    params[`${key}`] = param ? param[`${key}`] : this.searchParam ? this.searchParam[`${key}`] : '';
                }
                if (message.isShow && isReg && params[`${key}`] != '') {
                    message.isShow = false;
                }
            })

            if (message.isShow) {
                return message;
            }

            params[`pageNo`] = this.pageConfig.currentPage;
            params[`pageSize`] = this.pageConfig.pageSize;
            return params;
        },
        /**
         * @function handleSizeChange - 分页改变size
         */
        handleSizeChange(pageSize) {
            this.pageConfig.pageSize = pageSize;
            this.search();
        },
        /**
         * @function handleCurrentChange - - 分页修改当前页
         */
        handleCurrentChange(currentPage) {
            this.pageConfig.currentPage = currentPage;
            this.search();
        },
        /**
         * @function counponStatus - 修改票卷状态显示对应text
         */
        counponStatus(status) {
            let text = '未知';
            let statusTextKey = {
                0: '未激活',
                1: '已激活',
                2: '已消费',
                3: '已退货',
                4: '已停用',
                5: '未生成',
                6: '已作废',
                7: '已过期'
            }
            if (statusTextKey[`${status}`]) {
                text = statusTextKey[`${status}`];
            }
            return text;
        },
        /**
         * @function controlBtn - 返回可操作按钮
         */
        controlBtn(status) {
            let controlBtnArr = [{
                type: 'check',
                emitFn: 'checkCounpon',
                text: '查看'
            }];

            if (status == 1) {
                controlBtnArr.push({
                    type: 'abandon',
                    emitFn: 'abandonCoupon',
                    text: '作废'
                })
            }
            return controlBtnArr;
        },
        /**
         * @function emitFn - 分发按钮事件
         */
        emitFn(emitFn, params) {
            this[`${emitFn}`](params);
        },
        /**
         * @function checkCounpon - 查看票券
         */
        checkCounpon(params) {
            this.$router.push({
                path: 'checkSearchNumber',
                query: params
            })
        },
        /**
         * @function abandonCoupon - 作废票券
         */
        abandonCoupon(params) {
            let _params = {
                couponCode: params.couponCode
            }
            this.$ccmList.cancelCode(_params).then(data => {
                let type = data.flag == 3 ? 'success' : 'warning',
                    message = data.flag == 3 ? '作废票券成功！' : data.msg ? data.msg : '作废票券失败，请稍后重试！';

                this.$message({
                    message,
                    type
                });

                if (type == 'success') {
                    this.search();
                }

            }).catch(msg => {
                console.log(`作废票券错误：${msg}`);
            });
        },
        /**
         * @function setSearchInfo - 设置查询结果
         */
        setSearchInfo(data) {

        }
    }
}
</script>

<style lang="scss" scoped>
$margin:5px;
$fontSize: 12px;

.searchInfo {
    font-family: MicrosoftYaHei;
    letter-spacing: 0;
    padding: 20px;

    .searchInfo_title {
        color: #666666;
        font-size: $fontSize;
    }

    .searchInfo_content {
        margin-left: $margin;

        li {
            margin-right: $margin;

            span:nth-of-type(1) {
                font-size: $fontSize;
                font-family: MicrosoftYaHei-Bold;
            }

            span:nth-of-type(2) {
                margin-left: $margin;
                font-size: $fontSize;
                color: #3B74FF;
            }
        }
    }
}
</style>
