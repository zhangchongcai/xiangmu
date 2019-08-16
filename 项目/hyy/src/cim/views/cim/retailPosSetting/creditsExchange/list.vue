<template>
    <div class="tag-printing-list">
        <div class="common-header">
            <el-form
                    :inline="true"
                    :model="queryData"
                    label-position="left"
                    label-suffix="："
            >
                <el-form-item label="商品名称">
                    <el-input
                            v-model="queryData.merName"
                            placeholder="请输入"
                    ></el-input>
                </el-form-item>
                <el-form-item label="商品编码">
                    <el-input
                            v-model="queryData.merCode"
                            placeholder="请输入"
                    ></el-input>
                </el-form-item>
                <el-form-item label="SKU编码">
                    <el-input v-model="queryData.skuCode" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="速记代码">
                    <el-input v-model="queryData.shorthandCode" placeholder="请输入"></el-input>
                </el-form-item>
                <el-button class="query-btn" type="primary" @click="onQuery()">查询</el-button>
            </el-form>
        </div>
        <div>
            <div class="common-new-built">
                <el-button type="primary" size="small" plain @click="handleAddGoodEvent">添加商品</el-button>
                <el-button type="primary" size="small" plain @click="handleBatchesEditEvent">批量编辑</el-button>
                <el-button type="primary" size="small" plain @click="handleBatchesDelete">批量删除</el-button>
            </div>
            <div>
                <el-table :data="tableData" stripe v-loading="tableLoding" ref="goodsTable" row-key="uid"
                          @selection-change="handleSelectionTable">
                    <el-table-column
                            type="selection"
                            width="40"
                            reserve-selection
                    ></el-table-column>
                    <el-table-column
                            v-for="item in tableColumn"
                            :key="item.key"
                            :prop="item.key"
                            :label="item.label"
                            :formatter="item.formatter"
                    ></el-table-column>
                    <el-table-column label="操作" fixed="right" width="150">
                        <template slot-scope="{row}">
                            <el-button type="text" size="small" @click.stop="handleOperateEvent('1',row)">编辑</el-button>
                            <el-button type="text" size="small" @click.stop="handleOperateEvent('2',row)">
                                {{row.status==1?'停用':'启用'}}
                            </el-button>
                            <el-button type="text" size="small" @click.stop="handleOperateEvent('3',row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page-wrap">
                    <el-pagination
                            background
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="queryData.page"
                            :page-sizes="[10,20,30]"
                            :page-size="queryData.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total"
                    ></el-pagination>
                </div>
            </div>
        </div>
        <selected-goods
                :dialogVisible.sync="selectedGoodsDialogVisible"
                @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
        ></selected-goods>
        <el-dialog
                width="1000px"
                :title="integralExchTitle"
                :visible="batchDialogVisible"
                @close="batchDialogVisible=false"
        >
            <el-table :data="tgralExchTableData" stripe v-loading="tableLoding" ref="goodsTable" row-key="uid"
                      @selection-change="handleSelectionTable">
                <el-table-column
                        v-for="item in tableColumn"
                        :key="item.key"
                        :prop="item.key"
                        :label="item.label"
                >
                    <template slot-scope="{row}" name="header">
                        <div v-if="item.edit && item.edit()">
                            <el-input size="small" type="number" v-model="row[item.key]" placeholder></el-input>
                        </div>
                        <div v-else>
                            <span v-if="item.key=='canSale'">{{ row[item.key] =='1' ? '允许' : '禁止'}}</span>
                            <span v-else-if="item.key=='status'">{{ row[item.key] =='1' ? '启用' : '停用'}}</span>
                            <span v-else>{{row[item.key]}}</span>
                        </div>
                    </template>

                </el-table-column>
                <el-table-column label="操作" fixed="right" width="120">
                    <template slot-scope="{row}">
                        <el-button v-if="isBatchesEdit" type="text" size="small"
                                   @click.stop="handleOperateEvent('2',row)">
                            {{row.status==1?'停用':'启用'}}
                        </el-button>
                        <el-button type="text" size="small" @click="handleOperateEvent('4',row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer">
              <el-button type="primary" @click="handleinTegralExchSubmit" :loading="exchSubmitLoading">确 定</el-button>
              <el-button @click="batchDialogVisible=false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog
                width="400px"
                class="integral-exch-dialog"
                :title="integralExchTitle"
                :visible="editDialogVisible"
                @close="editDialogVisible=false"
        >
            <el-form
                    :model="editData"
                    label-position="right"
                    label-width="90px"
                    ref="editDataForm"
                    label-suffix="："
            >
                <el-form-item label="商品名称">
                    <span>{{editData.merName}}</span>
                </el-form-item>
                <el-form-item label="商品编码">
                    <span>{{editData.merCode}}</span>
                </el-form-item>
                <el-form-item label="SKU编码">
                    <span>{{editData.skuCode}}</span>
                </el-form-item>
                <el-form-item label="速记代码">
                    <span>{{editData.shorthandCode}}</span>
                </el-form-item>
                <el-form-item label="商品规格">
                    <span>{{editData.merSpec}}</span>
                </el-form-item>
                <el-form-item label="基本单位">
                    <span>{{editData.unitName}}</span>
                </el-form-item>
                <el-form-item label="销售状态">
                    <span>{{editData.canSale==1?'允许':'禁止'}}</span>
                </el-form-item>
                <el-form-item label="售价(元)">
                    <span>{{editData.price}}</span>
                </el-form-item>
                <el-form-item label="兑换积分"  prop="integral" :rules="[{ required: true , message: '兑换积分不能为空',trigger: 'change' }]">
                    <el-input class="integral" v-model="editData.integral" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="兑换状态" prop="status">
                    <el-radio-group v-model="editData.status">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer">
              <el-button type="primary" @click="handleinEditExchSubmit" :loading="exchSubmitLoading">确 定</el-button>
              <el-button @click="editDialogVisible=false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import mixins from "frame_cpm/mixins/cacheMixin";
    import selectedGoods from "cim/dialogs/cimSelectedGoods/index.vue";

    export default {
        mixins: [mixins.cacheMixin],
        data() {
            return {
                cacheField: ["queryData"],
                integralExchTitle: "设置兑换积分",//商品积分标题
                batchDialogVisible: false, //批量编辑
                editDialogVisible: false, //单个编辑
                //查询数据
                queryData: {
                    cinemaUid: "745498",
                    merName: "",
                    merCode: "",
                    skuCode: "",
                    shorthandCode: "",
                    page: 1,
                    pageSize: 10
                },
                exchSubmitLoading: false,
                editData: {},
                // 数据总数
                total: 0,
                tableLoding: false,
                // 表格数据
                tableData: [],
                tgralExchTableData: [],
                isBatchesEdit: false,
                selectedgoods: [],
                changeRules: {},
                selectedGoodsDialogVisible: false,
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            // 初始化
            init() {
                this.onQuery();
            },
            // 查询
            onQuery() {
                // console.log(this.queryData);
                this.integralExchQuery(this.queryData);
            },
            handleSelectionTable(value) {
                this.selectedgoods = value;
            },
            // 查询
            integralExchQuery(param) {
                this.tableLoding = true;
                this.$cimList.posSetting.integralExchQuery(param).then(resData => {
                    if (resData.code == 200) {
                        this.tableData = resData.data.list;
                        this.total = resData.data.total;
                    }
                    this.tableLoding = false;
                }).catch(() => {
                    this.tableLoding = false;
                });
            },
            // 添加积分
            integralExchSave(param) {
                this.exchSubmitLoading = true;
                this.$cimList.posSetting
                    .integralExchSave(param)
                    .then(resData => {
                        if (resData.code == 200) {
                            this.onQuery();
                            this.batchDialogVisible = false;
                        } else {
                            this.$message({
                                message: resData.msg
                            });
                        }
                        this.exchSubmitLoading = false;
                    }).catch(() => {
                    this.exchSubmitLoading = false;
                });
            },
            // 更新积分
            integralExchUpdate(param) {
                this.exchSubmitLoading = true;
                this.$cimList.posSetting
                    .integralExchUpdate(param)
                    .then(resData => {
                        if (resData.code == 200) {
                            this.onQuery();
                            this.editDialogVisible = false;
                        } else {
                            this.$message({
                                message: resData.msg
                            });
                        }
                        this.exchSubmitLoading = false;
                    }).catch(() => {
                    this.exchSubmitLoading = false;
                });
            },
            // 批量更新积分
            integralExchBatchUpdate(param) {
                this.exchSubmitLoading = true;
                this.$cimList.posSetting
                    .integralExchBatchUpdate(param)
                    .then(resData => {
                        if (resData.code == 200) {
                            this.onQuery();
                            this.batchDialogVisible = false;
                        } else {
                            this.$message({
                                message: resData.msg
                            });
                        }
                        this.exchSubmitLoading = false;
                    }).catch(() => {
                    this.exchSubmitLoading = false;
                });
            },
            //启用或禁用
            integralExchDisabled(param) {
                // console.log(param)
                this.$cimList.posSetting.integralExchDisabled(param)
                    .then(resData => {
                        if (resData.code == 200) {
                            this.onQuery();
                        } else {
                            this.$message({
                                message: resData.msg
                            });
                        }
                    });
            },
            // 删除
            integralExchDelete(param) {
                // console.log(param)
                this.$cimList.posSetting.integralExchDelete(param)
                    .then(resData => {
                        if (resData.code == 200) {
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                            this.onQuery();
                        } else {
                            this.$message({
                                message: resData.msg
                            });
                        }
                    });
            },
            // 多个删除
            integralExchBatchDelete(param) {
                this.$cimList.posSetting
                    .integralExchBatchDelete(param)
                    .then(resData => {
                        if (resData.code == 200) {
                            this.$message({
                                type: "success",
                                message: "删除成功!"
                            });
                            this.selectedgoods =[];
                            this.$refs.goodsTable.clearSelection();
                            this.onQuery();
                        } else {
                            this.$message({
                                message: resData.msg
                            });
                        }
                    });
            },
            // 添加商品
            handleAddGoodEvent() {
                this.selectedGoodsDialogVisible = true;
                this.isBatchesEdit = false;
            },
            //批量编辑
            handleBatchesEditEvent() {
                if (this.selectedgoods.length == 0) {
                    this.$message({
                        message: "请选择至少一个选项!"
                    });
                    return;
                }
                this.integralExchTitle = "批量设置兑换积分";
                this.batchDialogVisible = true;
                this.isBatchesEdit = true;
                this.tgralExchTableData = this.selectedgoods;
                // console.log( this.tgralExchTableData,"this.tgralExchTableData")
            },
            handleBatchesDelete() {
                if (this.selectedgoods.length == 0) {
                    this.$message({
                        message: "请选择至少一个选项!"
                    });
                    return;
                }
                let uids = this.selectedgoods.map(item => {
                    return {uid: item.uid};
                })
                //删除
                this.$confirm("<i class='el-icon-circle-close'></i><span>确定删除吗?</span>", {
                    customClass: "retail-style",
                    dangerouslyUseHTMLString: true,
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    center: true,
                })
                    .then(() => {
                        this.integralExchBatchDelete({
                            integralExchEntityList: uids
                        })
                    })
                    .catch(() => {
                    });

            },
            selectedGoodsDialogCallBack(value) {
                if (value.btnType == 1) {
                    this.tgralExchTableData = value.data.map(item => {
                        item.canSale = item.canSaleType;
                        item.status = 1;
                        return item;
                    })
                    this.batchDialogVisible = true;
                }
            },
            // 单个编辑确认
            handleinEditExchSubmit(){
                if(!this.editData.integral){
                    this.$message("请输入商品积分");
                    return;

                }
                this.integralExchUpdate(this.editData)
            },
            //批量编辑确定
            handleinTegralExchSubmit() {
                // console.log(this.tgralExchTableData)
                let params = {};
                let flag = true;
                for (let item of this.tgralExchTableData) {
                    if (!item.integral) {
                        this.$message("请输入商品积分");
                        flag = false
                        break;
                    }
                }
                if (!flag) {
                    return;
                }
                if (this.isBatchesEdit) {
                    params.integralExchEntityList = this.tgralExchTableData.map(item => {
                        return {
                            integral: item.integral,
                            merUid: item.merUid,
                            uid: item.uid,
                            skuUid: item.skuUid,
                        }
                    })
                    if (params.integralExchEntityList.length > 0) {
                        this.integralExchBatchUpdate(params);
                    } else {
                        this.batchDialogVisible = false;
                    }
                } else {
                    params.integralExchEntityList = this.tgralExchTableData.map(item => {
                        return {
                            integral: item.integral,
                            merUid: item.uid,
                            skuUid: item.skuUid,
                        }
                    })
                    if (params.integralExchEntityList.length > 0) {
                        this.integralExchSave(params);
                    } else {
                        this.batchDialogVisible = false;
                    }

                }

            },
            jumpPage(param = {}) {
                this.$router.push({
                    path: "/retail/posSetting/suppliers/common",
                    query: param
                });
            },
            handleOperateEvent(type, row) {
                // console.log(row)
                switch (type) {
                    case "1":
                        //编辑
                        this.integralExchTitle = "设置兑换积分";
                        this.editDialogVisible = true;
                        this.editData = row;
                        break;
                    case "2":
                        //停用或启用
                        let tempStaus= 1;
                        if(row.status ==1){
                            tempStaus =0
                        }else{
                            tempStaus= 1;
                        }
                        this.integralExchDisabled({uid: row.uid, status: tempStaus});
                        this.tgralExchTableData = this.tgralExchTableData.map(item => {
                            if (row.skuUid == item.skuUid) {
                                item.status = tempStaus;
                            }
                            return item;
                        })
                        break;
                    case "3":
                        //删除
                        this.$confirm("<i class='el-icon-circle-close'></i><span>确定删除吗?</span>", {
                            customClass: "retail-style",
                            dangerouslyUseHTMLString: true,
                            cancelButtonText: "取消",
                            confirmButtonText: "确定",
                            center: true,
                        })
                            .then(() => {
                                this.integralExchDelete({
                                    uid: row.uid
                                });
                            })
                            .catch(() => {
                            });
                        break;
                    case "4":
                        //删除
                        this.tgralExchTableData = this.tgralExchTableData.filter(item => {
                            return item.uid != row.uid;
                        })
                        break;
                }
            },
            handleSizeChange(val) {
                this.queryData.pageSize = val;
                this.onQuery();
                // console.log(`每页 ${val} 条`);
            },
            handleCurrentChange(val) {
                this.queryData.page = val;
                this.onQuery();
                // console.log(`当前页: ${val}`);
            }
        },
        computed: {
            tableColumn() {
                // 表格表头
                let tempArr = [
                    {
                        label: "商品名称",
                        key: "merName"
                    },
                    {
                        label: "商品编码",
                        key: "merCode"
                    },
                    {
                        label: "SKU编码",
                        key: "skuCode"
                    },
                    {
                        label: "速记代码",
                        key: "shorthandCode"
                    },
                    {
                        label: "商品规格",
                        key: "merSpec"
                    },
                    {
                        label: "基本单位",
                        key: "unitName"
                    },
                    {
                        label: "销售状态",
                        key: "canSale",
                        formatter(row, column, cellValue) {
                            let result = "";
                            switch (row.canSale) {
                                case 0:
                                    result = "禁止";
                                    break;
                                case 1:
                                    result = "允许";
                                    break;
                            }
                            return result;
                        }
                    },
                    {
                        label: "售价（元）",
                        key: "price"
                    },
                    {
                        label: "兑换积分",
                        key: "integral",
                        edit: () => {
                            if (this.batchDialogVisible) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    {
                        label: "兑换状态",
                        key: "status",
                        formatter(row, column, cellValue) {
                            let result = "";
                            switch (row.status) {
                                case 0:
                                    result = "停用";
                                    break;
                                case 1:
                                    result = "启用";
                                    break;
                            }
                            return result;
                        }
                    }
                ]
                if (this.isBatchesEdit) {
                    // tempArr.push({
                    //     label: "兑换状态",
                    //     key: "status",
                    //     formatter(row, column, cellValue) {
                    //         let result = "";
                    //         switch (row.status) {
                    //             case 0:
                    //                 result = "停用";
                    //                 break;
                    //             case 1:
                    //                 result = "启用";
                    //                 break;
                    //         }
                    //         return result;
                    //     }
                    // })
                }
                return tempArr;
            }
        },
        components: {
            selectedGoods
        }
    };
</script>

<style lang="scss">
    @import "../../../../assets/css/common.scss";
    @import "../../../../assets/css/element-common.scss";

    .tag-printing-list {
        .integral-exch-dialog {
            .el-form-item {
                margin-bottom: 0px;
            }
        }

        .integral {
            width: 192px;
        }

    }

</style>