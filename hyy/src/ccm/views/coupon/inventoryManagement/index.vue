<template>
<div class="table-page">
    <!-- 搜索栏 -->
    <section class="search-section">
        <search-lan :config="searchConfig" :modelName="modelName" @pressSearch="search" @searchValueChange="setSearch"></search-lan>
    </section>

    <!-- 按钮组 -->
    <section class="btnGroup-section flex-base flex-end">
        <el-button type="primary" plain @click="issue('issue')">配发</el-button>
        <el-button type="primary" plain @click="issue('debad')">报损</el-button>
    </section>

    <!-- 表格内容 -->
    <section class="table-section">
        <el-table ref="iTable" :data="table.data" tooltip-effect="dark" style="width: 100%" :row-key="getRowKeys" @selection-change="handleSelectionChange">
            <template v-for="(item,index) in table.title">
                <el-table-column :key="index" v-if="item.type" :type="item.type" :width="item.width" :reserve-selection="true"></el-table-column>
                <el-table-column :key="index" v-else-if="!item.type && !item.hasTemeplate" :prop="item.prop" :label="item.label" :width="item.width" show-overflow-tooltip></el-table-column>
                <el-table-column :key="index" v-else-if="!item.type && item.hasTemeplate" :prop="item.prop" :label="item.label" :width="item.width" :fixed="item.fiexd" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div v-if="item.prop == 'stockStatus'">
                            {{!scope.row.stockStatus ? '原票' : scope.row.stockStatus == 2  ? '报损' : '配发'}}
                        </div>
                        <div v-else-if="item.prop == 'allocateTime' ">
                            <span v-if="scope.row.allocateTime">{{scope.row.allocateTime|formatDate('yyyy-MM-dd')}}</span>
                            <span v-else></span>
                        </div>
                    </template>
                </el-table-column>
            </template>
        </el-table>
    </section>

    <!-- 分页 -->
    <section v-if="table.data.length != 0" class="pagination-section flex-base flex-center pageStyle">
        <el-pagination 
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page.sync="pageConfig.currentPage" 
        :page-sizes="pageConfig.pageSizes" 
        :page-size="pageConfig.pageSize" 
        background layout="total, prev, pager, next, jumper, sizes" 
        :total="pageConfig.total">
        </el-pagination>
    </section>
    <!-- 弹窗 -->
    <cinemaTreeDialog  ref="cinemaTreeDialog"  :innerData="cinemaData" @cinemaCallBack="scinemaCallBack"></cinemaTreeDialog>

</div>
</template>

<script>
import searchLan from '../../../components/search/index.vue';
import cinemaTreeDialog from 'ccm/dialogs/treeCinema'
import minxins from 'frame_cpm/mixins/cacheMixin.js'


export default {
    components: {
        searchLan,
        cinemaTreeDialog
    },
    mixins: [minxins.cacheMixin],
    data() {
        return {
            /* 缓存数据 */
            cacheField: ["searchConfig","table","pageConfig"],
            modelName: 'inventoryManagement',
            cinemaData:{
                type:2,
            },
            sendIssueData:'',
            searchConfig: [
            /* 弹窗参数 */
            {
                keyName: 'batchCode',
                name: '票券批次号',
                type: 'input',
                value: ''
            }, {
                keyName: 'couponColor',
                name: '票纸颜色',
                type: 'select',
                value: '',
                options: [{
                    label: '全部',
                    value: ''
                }, {
                    label: '不设',
                    value: '不设'
                }, {
                    label: '红色',
                    value: '红色'
                }, {
                    label: '绿色',
                    value: '绿色'
                }, {
                    label: '蓝色',
                    value: '蓝色'
                }, {
                    label: '紫色',
                    value: '紫色'
                }, {
                    label: '黄色',
                    value: '黄色'
                }, {
                    label: '3D',
                    value: '3D'
                }]
            }, {
                // keyName: 'serial',
                name: '票券流水号范围',
                type: 'input-more',
                inputNum: 2,
                options: [{
                    keyName: 'startId',
                    value: '',
                }, {
                    keyName: 'endId',
                    value: ''
                }],
            }, {
                keyName: 'couponCode',
                name: '票券编号',
                type: 'input',
                value: ''
            }, {
                keyName: 'stockStatus',
                name: '库存状态',
                type: 'select',
                value: '',
                options: [{
                    label: '全部',
                    value: ''
                }, {
                    label: '原票',
                    value: '0'
                }, {
                    label: '配发',
                    value: '1'
                }, {
                    label: '报损',
                    value: '2'
                }]
            }, {
                keyName: 'queryCreateUserName',
                name: '操作人',
                type: 'input',
                value: '',
            }],
            table: {
                data: [],
                title: [{
                    type: 'selection',
                    width: '55'
                }, {
                    prop: 'id',
                    label: '票券流水号',
                    width: ''
                }, {
                    prop: 'couponCode',
                    label: '票券编号',
                    width: ''
                }, {
                    prop: 'couponColor',
                    label: '票纸颜色',
                    width: '100',
                }, {
                    prop: 'allocateBusinessName',
                    label: '配发影院',
                    width: ''
                }, {
                    prop: 'stockStatus',
                    label: '库存状态',
                    width: '120',
                    hasTemeplate: true,
                }, {
                    prop: 'allocateTime',
                    label: '操作日期',
                    width: '',
                    hasTemeplate: true,
                }, {
                    prop: 'createUserName',
                    label: '操作人',
                }]
            },
            /* 分页设置 */
            pageConfig: {
                currentPage: 1,
                pageSizes: [10, 20, 30, 40],
                pageSize: 10,
                total: 15
            },
            /* 查询参数 */
            searchParam: {},
            /* 选择的数据 */
            select: []
        }
    },
    methods: {
        getRowKeys(row){
            return row.id
        },

        /**
         * @function setSearch - 实时返回搜索栏数据
         */
        setSearch(param) {
            this.searchParam = param;
        },
        /**
         * @function search - 搜索
         * @param {Object} param - 搜索栏回传参数
         * @param {Object} pointer - 当前执行对象指针
         */
        search(param, pointer,backFirstpage) {
            if(param){
                this.$refs.iTable.clearSelection()
            }
            if(param){
                let reg = /[^\-?\d.]/g
                if(reg.test(param.endId)){
                    this.$message({
                        type: 'warning',
                        message:"票券流水号范围只能输入数字"
                    });
                    return
                }else if(reg.test(param.startId)){
                    this.$message({
                        type: 'warning',
                        message:"票券流水号范围只能输入数字"
                    });
                    return
                }
            }
            let _this = pointer ? pointer : this;
            if (!backFirstpage) {
                //带条件查询则页数返回第一页
                _this.searchParam = param;
                this.pageConfig.currentPage=1
            }
            let _param = _this.setParam(param);
            _this.getData(_param);
            

        },
        /**
         * @function setParam - 设置请求参数
         * @param {Object} param - 请求参数
         * @param {String} data.batchCode - 批次号
         * @param {String} data.couponColor - 票券颜色
         * @param {String} data.startId - 流水号起始范围  serial[0].value
         * @param {String} data.endId - 流水号结束范围 serial[1].value
         * @param {String} data.couponCode - 票券编号
         * @param {Number} data.stockStatus - 库存状态
         * @param {String} data.queryCreateUserName - 创建人名称
         * @param {Number} data.pageNo - 第几页
         * @param {Number} data.pageSize - 每页多少条
         */
        setParam(param) {
            let pointer = this;
            let exitsParam = param ? JSON.stringify(param) != '{}' ? true : false : false;
            let exitsSearhParam = JSON.stringify(pointer.searchParam) != '{}' ? true : false;
            let _param = {
                batchCode: exitsParam ? param.batchCode : exitsSearhParam ? pointer.searchParam.batchCode : '',
                couponColor: exitsParam ? param.couponColor : exitsSearhParam ? pointer.searchParam.couponColor : '',
                startId: exitsParam ? param.startId : exitsSearhParam ? pointer.searchParam.startId : '',
                endId: exitsParam ? param.endId : exitsSearhParam ? pointer.searchParam.endId : '',
                couponCode: exitsParam ? param.couponCode : exitsSearhParam ? pointer.searchParam.couponCode : '',
                stockStatus: exitsParam ? param.stockStatus : exitsSearhParam ? pointer.searchParam.stockStatus : '',
                queryCreateUserName: exitsParam ? param.queryCreateUserName : exitsSearhParam ? pointer.searchParam.queryCreateUserName : '',
                pageNo:pointer.pageConfig.currentPage,
                pageSize: pointer.pageConfig.pageSize
            }
            return _param;
        },
        /**
         * @function getData - 请求表格数据
         * @param {Object} param - 请求数据
         */
        getData(param) {
            let pointer = this;
            this.$ccmList.findCouponCodeList(param).then(data => {
                let flag = data.flag;
                let message = data.msg;
                let type = '';
                if (flag == 3) {
                    type = 'success';
                } else {
                    type = 'warning';
                }

                if (type == 'warning') {
                    pointer.$message({
                        type,
                        message
                    })
                }

                if (type == 'success') {
                    pointer.table.data = data.data;
                    pointer.pageConfig.total = data.pageNum;
                }

            }).catch(msg => {
                console.log(`查询报表错误,错误信息:${msg}`);
            });
        },

        /**
         * @function issue - 配发 / 报损
         */
        issue(type) {
            let pointer = this;
            // 是否勾选
            let isSelect = true;
            let select = JSON.parse(JSON.stringify(pointer.select));
            let param = JSON.parse(JSON.stringify(pointer.searchParam))
            // 是否填写票券批次号
            let isBatchCode = true;
            let batchCode = param.batchCode;
            // 是否填写票券流水号范围
            let isIdRound = true;
            let startId = param.startId,
                endId = param.endId;

            let ids = [];
            if (select.length == 0) {
                isSelect = false;
            } else {
                for (let i = 0; i < select.length; i++) {
                    let flag = true;
                    let message = '';
                    let stockStatus = select[i].stockStatus;
                    if (type == 'issue' && stockStatus == 2) {
                        // 配发
                        flag = false;
                        message = '报损的票券不能配发,请重新选择!';
                    } else if ( (type == 'debad' || type == 'issue') && (stockStatus == 1 || stockStatus == 2)) {
                        // 报损
                        flag = false;
                        let way = type=='issue'? '配发': '报损'
                        message = `只能${way}原票, 请重新选择`;
                    }

                    if (!flag) {
                        return pointer.$message({
                            type: 'warning',
                            message
                        });
                    }
                    ids.push(select[i].id);
                }
            }

            if (batchCode == '') {
                isBatchCode = false;
            }

            if (startId == '' || endId == '') {
                isIdRound = false;
            }

            if (!isSelect && !isBatchCode && !isIdRound) {
                pointer.$message({
                    type: 'warning',
                    message: `请勾选需配发的票券 或 填写票券批次号、票券流水号范围批量${type == 'issue' ? '配发' : '报损'}`
                });
            } else {
                let param = {
                    ids,
                    batchCode,
                    startId,
                    endId,
                    stockStatus: type == 'issue' ? 1 : 2
                }
                pointer.$ccmList.validateCoupon(param).then(data => {
                    let _param = {
                        ids,
                        stockStatus: type == 'issue' ? 1 : 2
                    }

                    if (data.flag == 3) {
                        pointer.sendIssue(pointer, _param);
                    } else {
                        pointer.$message({
                            type: 'warning',
                            message: data.msg
                        });
                    }

                }).catch(msg => {
                    console.log(msg);
                })
            }

        },
        /**
         * @function sendIssue - 1=配发/2=报损/0原票
         */
    
        sendIssue(pointer,param) {
            if (param.stockStatus == 1) {
                // 此处应该唤起弹窗
                // 唤起弹窗
                this.$refs.cinemaTreeDialog.openDialog(true)
                this.sendIssueData = param
                
            } else {
                this.$confirm('确认操作报损！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    pointer.$ccmList.reimburseCoupon(param).then(data => {
                        let type = 'warning';
                        if (data.flag == 5) {
                            type = 'success';
                        }
                        pointer.$message({
                            type,
                            message: data.msg
                        });

                        if (type == 'success') {
                            let _param = pointer.setParam();
                            pointer.getData(_param);
                            this.$refs.iTable.clearSelection()
                        }
                    }).catch(msg => {
                        console.log(msg);
                    })
                })
                
            }
        },
        /**
         *  cinemaCallBack - 影院参数回传 +  配发请求
         */
        scinemaCallBack(data) {
            let pointer = this
            let param = this.sendIssueData
            console.log(data)
            param['allocateBusinessId'] = data.id
            param['allocateBusinessName'] = data.text
            pointer.$ccmList.issueCoupon(param).then(data => {
                let type = 'warning';
                if (data.flag == 5) {
                    type = 'success';
                }
                pointer.$message({
                    type,
                    message: data.msg
                });
                if (type == 'success') {
                    let _param = pointer.setParam();
                    pointer.getData(_param);
                    this.$refs.iTable.clearSelection()
                }
            }).catch(msg => {
                console.log(msg);
            })
        },
        /**
         * @function handleSelectionChange - 表格选中
         */
        handleSelectionChange(val) {
            console.log(val)
            this.select = val;
        },
        /**
         * @function handleSizeChange - 分页改变size
         */
        handleSizeChange(pageSize) {
            this.pageConfig.pageSize = pageSize;
            this.search(null, this,'backFirstpage');
        },
        /**
         * @function handleCurrentChange - 分页改变页码
         */
        handleCurrentChange(currentPage) {
            this.pageConfig.currentPage = currentPage;
            this.search(null, this,'backFirstpage');
        }
    },
    created() {}
}
</script>

<style lang="scss" scoped>
@import "../../../assets/css/comList.scss";   

</style>
