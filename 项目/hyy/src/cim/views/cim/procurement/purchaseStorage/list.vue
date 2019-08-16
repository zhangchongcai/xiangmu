<template>
    <div class="purchase-storage-list">
        <div class="common-header">
            <el-form
                    :inline="true"
                    :model="queryData"
                    label-position="left"
                    label-suffix="："
            >
                <el-form-item label="入库单号">
                    <el-input v-model="queryData.billCode" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="入库门店" class="select-input">
                    <el-input
                            v-model="queryData.cinemaName"
                            clearable
                            @clear="onCinemalSumit"
                            @focus="handleDialogEvent('myCinemalDialog')"
                            placeholder="请选择门店"
                    ></el-input>
                    <el-button type="primary" plain @click="handleDialogEvent('myCinemalDialog')">选择</el-button>
                </el-form-item>
                <el-form-item label="供应商名称" class="select-input">
                    <el-input v-model="queryData.supName" clearable placeholder="请选择供应商"
                              @clear="onSuppliersSumit"
                              @focus="handleDialogEvent('mySuppliersDialog')"></el-input>
                    <el-button type="primary" plain @click="handleDialogEvent('mySuppliersDialog')">选择</el-button>
                </el-form-item>
                <el-form-item label="制单日期">
                    <el-date-picker
                            class="basic-input"
                            v-model="queryData.billTimeTotal"
                            type="datetimerange"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm"
                            placeholder="选择日期"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item label="入库类型">
                    <el-select @change="billTypeListChange"  v-model="queryData.billType">
                        <el-option label="全部" value></el-option>
                        <el-option label="采购入库" :value="1"></el-option>
                        <el-option label="赠送入库" :value="2"></el-option>
                        <el-option label="直接入库" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="单据状态">
                    <el-select v-model="queryData.status">
                        <el-option label="全部" value></el-option>
                        <el-option label="未提交" value="1"></el-option>
                        <el-option label="已提交" value="2"></el-option>
                        <el-option label="已入库" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="审核状态">
                    <el-select v-model="queryData.approvalStatus">
                        <el-option label="全部" value></el-option>
                        <el-option label="未审核" value="0"></el-option>
                        <el-option label="待审核" value="1"></el-option>
                        <el-option label="审核通过" value="2"></el-option>
                        <el-option label="审核不通过" value="3"></el-option>
                        <!-- <el-option label="无需审核" value="4"></el-option> -->
                    </el-select>
                </el-form-item>
                <el-button class="query-btn" type="primary" @click="onQuery()">查询</el-button>
            </el-form>
        </div>
        <div>
            <div class="common-new-built">
                <el-dropdown @command="handleNewBuilt">
                    <el-button type="primary" plain>
                        新建
                        <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="1">采购入库</el-dropdown-item>
                        <el-dropdown-item command="2">赠送入库</el-dropdown-item>
                        <el-dropdown-item command="3">直接入库</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <!-- <el-button type="primary" size="small" plain>批量导出</el-button> -->
            </div>
            <div>
                <el-table :data="tableData" stripe v-loading="tableLoding">
                    <el-table-column
                            v-for="item in tableColumn"
                            :key="item.key"
                            :prop="item.key"
                            :label="item.label"
                            :formatter="item.formatter"
                    ></el-table-column>
                    <el-table-column label="操作" width="200">
                        <template slot-scope="{row}">
                            <!--"审核状态", //,0：未审核，1：待审核，2：审核通过，3：审核不通过，4：无需审核'-->
                            <el-button type="text" size="small" @click.stop="handleOperateEvent('1', row)">查看
                            </el-button>
                            <el-button
                                    type="text"
                                    size="small"
                                    v-if="row.approvalStatus==0 || row.approvalStatus==3"
                                    @click.stop="handleOperateEvent('2', row)"
                            >编辑
                            </el-button>
                            <el-button
                                    type="text"
                                    size="small"
                                    v-if="row.approvalStatus==0 || row.approvalStatus==3"
                                    @click.stop="handleOperateEvent('3', row)"
                            >提交
                            </el-button>
                            <el-button
                                    type="text"
                                    size="small"
                                    v-if="row.approvalStatus==0 || row.approvalStatus==3"
                                    @click.stop="handleOperateEvent('4', row)"
                            >删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-wrap">
                    <el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page.sync="queryData.page"
                            :page-sizes="pageSizes"
                            :page-size.sync="queryData.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                    ></el-pagination>
                </div>
            </div>
        </div>
        <!-- 选择影院弹窗 -->
        <cinemal-dialog ref="myCinemalDialog" title="选择门店" @onSumit="onCinemalSumit" :dialogFeedbackData="[{cinemaUid:queryData.cinemaUid,cinemaName:queryData.cinemaName}]"></cinemal-dialog>
        <!-- 选择供应商弹窗 -->
        <suppliers-dialog ref="mySuppliersDialog" @onSumit="onSuppliersSumit"></suppliers-dialog>
        <!-- 选择采购单弹窗 -->
    </div>
</template>

<script>
    import mixin from "cim/mixins/cim/paginationConfig.js";
    import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
    import suppliersDialog from "cim/components/suppliersDialog/suppliersDialog.vue";
    import mixins from "frame_cpm/mixins/cacheMixin";
    export default {
        mixins: [mixin,mixins.cacheMixin],
        data() {
            return {
                cacheField:["queryData"],
                //查询数据
                queryData: {
                    billCode: "", //入库单号
                    cinemaUid: "", //门店id
                    cinemaName: "", //门店名称
                    supName: "", //供应商名称
                    supUid: "", //供应商id
                    billTimeTotal: [],
                    createTimeStart: "", //制单开始时间
                    createTimeEnd: "", //制单结束时间
                    billType: "", //入库类型
                    billTypeList:[1,2,3], //入库类型全部的时候传 1，2，3 ， 1：采购入库，2：赠送入库，3：直接入库
                    status: "", //单据状态
                    approvalStatus: "", //审核状态
                    page: 1,
                    pageSize: 15
                },
                total: 0,
                // 表格表头
                tableColumn: [
                    {
                        label: "入库单号",
                        key: "billCode"
                    },
                    {
                        label: "入库门店",
                        key: "cinemaName"
                    },
                    {
                        label: "供应商名称",
                        key: "supName"
                    },
                    {
                        label: "制单日期",
                        key: "billTime"
                    },
                    {
                        label: "制单员",
                        key: "billUserName"
                    },
                    {
                        label: "入库类型",
                        key: "billType",
                        formatter(row, column, cellValue) {
                            let result = "";
                            switch (row.billType) {
                                case 1:
                                    result = "采购入库";
                                    break;
                                case 2:
                                    result = "赠送入库";
                                    break;
                                case 3:
                                    result = "直接入库";
                                    break;
                                case 4:
                                    result = "领用退回入库";
                                    break;
                                case 5:
                                    result = "盘点赔偿入库";
                                    break;
                                case 6:
                                    result = "调拨入库";
                                    break;
                            }
                            return result;
                        }
                    },
                    {
                        label: "单据状态", //1：未提交，2：已提交，3：部分入库，4：全部入库
                        key: "status",
                        formatter(row, column, cellValue) {
                            let result = "";
                            switch (row.status) {
                                case 1:
                                    result = "未提交";
                                    break;
                                case 2:
                                    result = "已提交";
                                    break;
                                case 3:
                                    result = "已入库";
                                    break;
                            }
                            return result;
                        }
                    },
                    {
                        label: "审核状态", //,0：未审核，1：待审核，2：审核通过，3：审核不通过，4：无需审核'
                        key: "approvalStatus",
                        formatter(row, column, cellValue) {
                            let result = "";
                            switch (row.approvalStatus) {
                                case 0:
                                    result = "未审核";
                                    break;
                                case 1:
                                    result = "待审核";
                                    break;
                                case 2:
                                    result = "审核通过";
                                    break;
                                case 3:
                                    result = "审核不通过";
                                    break;
                                case 4:
                                    result = "无需审核";
                                    break;
                            }
                            return result;
                        }
                    }
                ],
                tableLoding:false,
                // 表格数据
                tableData: []
            };
        },

        mounted() {
            this.init();
        },
        methods: {
            // 初始化
            init() {
                // this.$store.commit('getLevel',this.$route.meta.title)
                if(this.queryData.cinemaUid){
                    this.onQuery();
                }
            },
            // 查询
            onQuery() {
                if(!this.queryData.cinemaUid){
                    this.$message({
                        message: "请选择门店!"
                    });
                    return;
                }
                if (this.queryData.billTimeTotal) {
                    this.queryData.createTimeStart = this.queryData.billTimeTotal[0];
                    this.queryData.createTimeEnd = this.queryData.billTimeTotal[1];
                } else {
                    this.queryData.createTimeStart = "";
                    this.queryData.createTimeEnd = "";
                }
                this.storeBillQueryStoreIn(this.queryData);
            },
            // 查询
            storeBillQueryStoreIn(param) {
                this.tableLoding = true;
                this.$cimList.procurement.storeBillQueryStoreIn(param).then(resData => {
                    if (resData.code == 200) {
                        this.tableData = resData.data.list;
                        this.total = resData.data.total;
                    }
                    this.tableLoding = false;
                }) .catch(() => {
                    this.tableLoding = false;
                });
            },
            billTypeListChange(value){
                if(value == ''){
                    this.queryData.billTypeList = [1,2,3]
                }else{
                    this.queryData.billTypeList = [value]
                }
            },
            // 新建
            handleNewBuilt(billType) {
                this.jumpPage({
                    type: "1",
                    billType: billType
                });
            },
            jumpPage(param = {}) {
                let router = '';
                switch (param.type) {
                    case "1":
                        // 新增
                        router = 'add';
                        break;
                    case "2":
                        // 编辑
                        router = 'edit';
                        break;
                    case "3":
                        // 查看
                        router = 'details';
                        break;
                }
                this.$router.push({
                    path: "/retail/procurement/purchaseStorage/"+router,
                    query: param
                });
            },
            handleOperateEvent(type, row) {
                switch (type) {
                    case "1":
                        // 查看
                        this.jumpPage({
                            type: "3",
                            data:  JSON.stringify({uid:row.uid,billType:row.billType})
                        });
                        break;
                    case "2":
                        // 查看
                        this.jumpPage({
                            type: "2",
                            data:  JSON.stringify({uid:row.uid,billType:row.billType})
                        });
                        //编辑
                        break;
                    case "3":
                        //提交
                        this.storeBillUpdateStoreIn({billType: row.billType, status: "2", uid: row.uid},()=>{
                            this.$message({
                                type: "success",
                                message: "提交成功!"
                            });
                        })
                        break;
                    case "4":
                        //删除
                        this.$confirm("<i class='el-icon-circle-close'></i><span>确定删除吗?</span>", {
                            customClass: "retail-style",
                            dangerouslyUseHTMLString: true,
                            cancelButtonText: "取消",
                            confirmButtonText: "确定",
                            center: true,
                        })
                            .then(() => {
                                //删除
                                this.storeBillUpdateStoreIn({billType: row.billType, uid: row.uid, delFlag: 1},()=>{
                                     this.$message({
                                         type: "success",
                                         message: "删除成功!"
                                     });
                                });
                            })
                            .catch(() => {
                            });
                        break;
                }
            },
            // 更新或者删除操作
            storeBillUpdateStoreIn(param,callBack=()=>{}) {
                this.$cimList.procurement
                    .storeBillUpdateStoreIn(param)
                    .then(resData => {
                        if (resData.code == 200) {
                            callBack();
                            this.onQuery();
                        } else {
                            this.$message({
                                type: "error",
                                message: resData.msg
                            });
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            handleDialogEvent(name) {
                this.$refs[name].handleDialog(true);
            },
            // 选泽门店回调
            onCinemalSumit(val = [],type) {
                // console.log(val," 选泽门店回调",type);
                if (val.length > 0) {
                    if(type=="default"){
                        if(val.length==1){
                            this.setCinema(val)
                            this.onQuery();
                        }
                    }else{
                        this.setCinema(val)
                    }
                } else {
                    this.setCinema()
                }
            },
            setCinema(val=[]){
                if(val.length>0){
                    this.queryData.cinemaName =  val[0].cinemaName || val[0].name ;
                    this.queryData.cinemaUid =  val[0].cinemaUid || val[0].uid;
                }else{
                    this.queryData.cinemaName = "";
                    this.queryData.cinemaUid = "";
                }
            },
            // 选泽供应商回调
            onSuppliersSumit(val = []) {
                if (val.length > 0) {
                    this.queryData.supName = val[0].supplierName;
                    this.queryData.supUid = val[0].uid;
                } else {
                    this.queryData.supName = "";
                    this.queryData.supUid = "";
                }
            },
            handleSizeChange(val) {
                this.queryData.pageSize = val;
                this.onQuery();
            },
            handleCurrentChange(val) {
                this.queryData.page = val;
                this.onQuery();
                // console.log(`当前页: ${val}`);
            }
        },
        components: {
            cinemalDialog,
            suppliersDialog
        }
    };
</script>

<style lang="scss">
    @import "../../../../assets/css/common.scss";
    @import "../../../../assets/css/element-common.scss";
    .purchase-storage-list{

    }

</style>