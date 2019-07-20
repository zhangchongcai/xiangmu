<template>
    <div class="content purchase-return-common">
<!--        <div class="breadcrumb">-->
<!--            <el-breadcrumb separator-class="el-icon-arrow-right">-->
<!--                <el-breadcrumb-item>采购管理</el-breadcrumb-item>-->
<!--                <el-breadcrumb-item  :to="{ path: '/retail/procurement/purchaseReturn/list' }">采购退货单管理</el-breadcrumb-item>-->
<!--                <el-breadcrumb-item>{{typeText}}采购退货单</el-breadcrumb-item>-->
<!--            </el-breadcrumb>-->
<!--        </div>-->
        <div class="tittle"></div>
        <el-form
                :inline="true"
                :model="queryData"
                ref="ruleForm"
                label-position="left"
                label-width="120px"
                label-suffix="："
        >
            <el-collapse v-model="activeNames">
                <!-- 基础信息 start-->
                <el-collapse-item title="基础信息" name="1">
                    <div>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="采购退货单号">
                                    <span>{{queryData.billCode}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="退货门店" class="select-input" prop="cinemaUid"
                                              :rules="[{ required: routeQuery.type!=3  ? true :false , message: '退货门店不能为空',trigger: 'change' }]">
                                    <span v-if="routeQuery.type==3">{{queryData.cinemaName}}</span>
                                    <div v-else>
                                        <el-input v-model="queryData.cinemaName" placeholder="请选择门店"
                                                  clearable
                                                  @clear="onCinemalSumit()"
                                                  @focus="handleDialogEvent('refCinemalDialog')">
                                        </el-input>
                                        <el-button type="primary" plain @click="handleDialogEvent('refCinemalDialog')">
                                            {{queryData.cinemaName?"编辑":"选择"}}
                                        </el-button>
                                    </div>

                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="采购入库单" class="select-input">
                                    <span v-if="routeQuery.type==3">{{queryData.storeinBillCode}}</span>
                                    <div v-else>
                                        <el-input v-model="queryData.storeinBillCode" placeholder="请选择采购入库单号" clearable
                                                  @clear="onPurchasStoragSumit()"
                                                  @focus="handlePurchaseStoragDialogEvent()">

                                        </el-input>
                                        <el-button type="primary" plain @click="handlePurchaseStoragDialogEvent()">
                                            {{queryData.storeinBillCode?"编辑":"选择"}}
                                        </el-button>
                                    </div>

                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="供应商名称" class="select-input">
                                    <span v-if="routeQuery.type==3">{{queryData.supName}}</span>
                                    <div v-else>
                                        <el-input v-model="queryData.supName" placeholder="请选择供应商" clearable
                                                  @clear="onSupplierSumit()"
                                                  @focus="handleDialogEvent('refSuppliersDialog')"
                                                  :disabled="queryData.storeinBillCode ? true: false">
                                        </el-input>
                                        <el-button type="primary" plain @click="handleDialogEvent('refSuppliersDialog')"
                                                   :disabled="queryData.storeinBillCode ? true: false">
                                            {{queryData.supName?"编辑":"选择"}}
                                        </el-button>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item label="退货原因" prop="reasonCode"
                                              :rules="[{ required: routeQuery.type!=3  ? true :false, message: '退货原因不能为空',trigger: 'change' }]">
                                    <span v-if="routeQuery.type==3">{{queryData.returnReason}}</span>
                                    <el-select class="storehouse-name" v-else v-model="queryData.reasonCode" @change="reasonCodeChange">
                                        <el-option :value="item.value":label="item.label" v-for="item in reasonList" :key="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item prop="storehouseCode"
                                              :rules="[{ required: routeQuery.type==3 ? false : true, message: queryData.storeType==1 ? '入库仓库不能为空':'入库货架不能为空',trigger: 'change' }]">
                                    <span slot="label">
                                        <span v-if="routeQuery.type==3">{{queryData.storeType == 1? '退货仓库：':'退货货架：'}}</span>
                                        <el-select v-else v-model="queryData.storeType" @change="storehouseChange" class="store-type"
                                                   :disabled="queryData.storeinBillCode ? true: false">
                                            <el-option label="退货仓库" value="1"></el-option>
                                            <el-option label="退货货架" value="2"></el-option>
                                        </el-select>
                                    </span>
                                    <span v-if="routeQuery.type==3">
                                        {{queryData.storehouseCode}}
                                    </span>
                                    <el-select class="storehouse-name" v-else v-model="queryData.storehouseCode" @change="storehouseListChange"
                                               @click.native="storehouseListClick"
                                               :disabled="queryData.storeinBillCode ? true: false">
                                        <el-option
                                                :label="item.name"
                                                :value="item.code"
                                                :key="item.id"
                                                v-for="item in  storehouseList"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-collapse-item>
                <!-- 基础信息 end-->

                <!-- 退货信息 start-->
                <el-collapse-item title="退货信息" name="2">
                    <div>
                        <div class="text-right" v-if="routeQuery.type!=3 && !queryData.storeinBillCode">
                            <el-button @click="handleAddGood" type="primary" plain>添加商品</el-button>
                        </div>
                        <el-table :data="queryData.dataList" stripe>
                            <el-table-column
                                    v-for="item in formatTableColumn()"
                                    :key="item.key"
                                    :prop="item.key"
                                    :label="item.label"
                                    :formatter="item.formatter"
                            >
                                <template slot-scope="{row}" name="header">
                                    <div v-if="item.edit && item.edit()">
                                        <el-input size="small" type="number" :value="row[item.key]"
                                                  @input="inputEvent($event,row,item.key)" placeholder></el-input>
                                    </div>
                                    <div v-else-if="item.selsect">
                                        <el-select v-model="row[item.key]" v-if="row.unitList && row.unitList.length>0"  @change="changeUnitList($event,row,item.key)">
                                            <el-option
                                                    :key="unitItem.id"
                                                    :label="unitItem.unitName || unitItem.name"
                                                    :value="unitItem.unitUid  ||  unitItem.uid"
                                                    v-for="unitItem in row.unitList"
                                            ></el-option>
                                        </el-select>
                                    </div>
                                    <div v-else>
                                        <span>{{calculateCost(row,item)}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" style="width:180px;" v-if="routeQuery.type!=3">
                                <template slot-scope="{row}">
                                    <el-button type="text" size="small" @click.stop="handleOperateEvent(row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item prop="remark" label-width="60px" label="备注">
                                    <span v-if="routeQuery.type==3">{{queryData.remark}}</span>
                                    <el-input
                                            type="textarea"
                                            placeholder="请输入"
                                            v-else
                                            class="remark-input"
                                            v-model="queryData.remark"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-collapse-item>
                <!-- 退货信息 end-->

                <!--  审批流程-->
                <el-collapse-item title="审批流程" name="3" v-if="routeQuery.type==3">
                    <el-form-item  label="审批流程名称"  label-width="110px">
                        <span>采购退货单审核</span>
                    </el-form-item>
                    <el-steps :space="200" :active="approvalActive" finish-status="success">
                        <el-step :title="approvalStart"></el-step>
                        <el-step :title="item.auditMan" :key="item.auditTime" v-for="item in queryData.reviewRecordList"></el-step>
                        <el-step title="结束" v-if="queryData.approvalStatus==2"></el-step>
                    </el-steps>
                </el-collapse-item>

                <!--  审批记录-->
                <el-collapse-item title="审批记录" name="3" v-if="routeQuery.type==3">
                    <div>
                        <el-table :data="queryData.reviewRecordList" stripe>
                            <el-table-column
                                    v-for="item in reviewRecordTableColumn"
                                    :key="item.key"
                                    :prop="item.key"
                                    :label="item.label"
                                    :formatter="item.formatter"
                            >
                            </el-table-column>
                        </el-table>
                    </div>
                </el-collapse-item>
            </el-collapse>

            <!-- 选择影院弹窗 -->
            <cinemal-dialog ref="refCinemalDialog" @onSumit="onCinemalSumit"
                            :dialogFeedbackData="[{cinemaUid:queryData.cinemaUid,cinemaName:queryData.cinemaName}]"></cinemal-dialog>
            <!-- 选择采购入库单弹窗 -->
            <purchase-storage-dialog ref="refPurchaseStoragDialog" :billTypeList="[1]" :cinemaUid="queryData.cinemaUid"
                                     :cinemaName="queryData.cinemaName" :approvalStatus="2"
                                     @onSumit="onPurchasStoragSumit"></purchase-storage-dialog>
            <!-- 选择供应商弹窗 -->
            <suppliers-dialog ref="refSuppliersDialog" @onSumit="onSupplierSumit"></suppliers-dialog>
            <!-- 选择商品 -->
            <selected-goods
                    :dialogVisible.sync="selectedGoodsDialogVisible"
                    :cinemaUid="queryData.cinemaUid"
                    :merType="'1,5'"
                    @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
            ></selected-goods>

            <div class="submit-box" v-if="routeQuery.type!=3">
                <el-button type="primary" @click="handleSubmit('2')">保存并提交</el-button>
                <el-button type="primary" @click="handleSubmit('1')" v-if="queryData.status==1">保存为草稿</el-button>
                <el-button @click="handleCancel">取 消</el-button>
            </div>
            <div v-else class="submit-box">
                <el-button @click="handleCancel">关 闭</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import mixin from "cim/mixins/cim/paginationConfig.js";
    import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
    import suppliersDialog from "cim/components/suppliersDialog/suppliersDialog.vue";
    import selectedGoods from "cim/dialogs/cimSelectedGoods/index.vue";
    import purchaseStorageDialog from "cim/components/purchaseStorageDialog/purchaseStorageDialog.vue";
    import lodash from "lodash";

    export default {
        mixins: [mixin],
        data() {
            return {
                //查询数据
                queryData: {
                    //基础信息
                    billCode: "", //退货单编号
                    cinemaUid: "", //门店id
                    cinemaName: "", //门店名称
                    billType: "1", //出库单类型，1：采购退货出库，2：报损出库，3：领用出库，4：调拨出库
                    agreementCode: "", //	协议编码
                    agreementName: "", //协议名称
                    agreementUid: "", //	协议uid
                    storeType: "1", //库存类型，1：仓库，2：货架
                    storehouseCode: "", //库存编码
                    storehouseName: "", //库存名称
                    dataList: [], //退货明细列表
                    supName: "", //供应商名称
                    storeinBillCode: "", //入库单编号
                    storeinBillUid: "", //入库单UID
                    supUid: "", //供应商id
                    reasonCode:"",//退货原因编码
                    returnReason:"",//退货原因名称
                    isReview: 1, //是否需要审核,0不需要,1需要
                    remark: "", //备注
                    status: 1 //保存标志,1草稿,2保存并提交
                },
                storehouseList: [], //仓库货架列表
                total: 0,
                // 退货信息表格表头
                tableColumn: [
                    {
                        label: "商品名称",
                        key: "merName"
                    },
                    {
                        label: "SKU编码",
                        key: "skuCode"
                    },
                    {
                        label: "商品规格",
                        key: "merSpec"
                    },
                    {
                        label: "基本单位",
                        key: "unitUid",
                        selsect: () => true
                    },
                    {
                        label: "库存数量",
                        key: "storeCount"
                    },
                    {
                        label: "退货数量",
                        key: "storeoutCount",
                        edit: () => {
                            if (this.routeQuery.type == 3) {
                                return false
                            } else {
                                return true;
                            }
                        }
                    },
                    {
                        label: "单价(元)",
                        key: "price",
                        edit: () => {
                            if (this.routeQuery.type == 1) {
                                return true
                            } else if (this.routeQuery.type == 2) {
                                if (this.queryData.storeinBillCode) {
                                    return false
                                } else {
                                    return true
                                }
                            } else {
                                return false
                            }
                        }
                    },
                    {
                        label: "税率(%)",
                        key: "taxRate",
                        edit: () => {
                            if (this.routeQuery.type == 1) {
                                return true
                            } else if (this.routeQuery.type == 2) {
                                if (this.queryData.storeinBillCode) {
                                    return false
                                } else {
                                    return true
                                }
                            } else {
                                return false
                            }
                        }
                    },
                    {
                        label: "含税金额(元)",
                        key: "amount",
                        edit: () => {
                            if (this.routeQuery.type == 1) {
                                return true
                            } else if (this.routeQuery.type == 2) {
                                if (this.queryData.storeinBillCode) {
                                    return false
                                } else {
                                    return true
                                }
                            } else {
                                return false
                            }
                        }
                    },
                    {
                        label: "不含税金额(元)",
                        key: "excludingTaxAmount"
                    },
                    {
                        label: "税额(元)",
                        key: "taxAmount"
                    }
                ],
                reviewRecordTableColumn:[
                    {
                        label: "审核时间",
                        key: "auditTime"
                    },
                    {
                        label: "审核人",
                        key: "auditMan"
                    },
                    {
                        label: "审核结果",
                        key: "arditResult"
                    },
                    {
                        label: "审核意见",
                        key: "auditOpinion"
                    },
                ],
                reasonList:[
                    {value:"reason01",label:"商品已过期"},
                    {value:"reason02",label:"商品存在破损"},
                    {value:"reason03",label:"总部要求统一退货"},
                    {value:"reason05",label:"不想要了"},
                    {value:"reason04",label:"其他"},
                ],
                selectedGoodsDialogVisible: false,
                activeNames: ['1', '2', '3']
            };
        },
        activated(){
            // this.init();
        },
        mounted() {
            this.init();
            console.log(this.routeMerData);
        },

        methods: {
            init() {
                this.onQuery();
                let lastLevel = this.typeText+'采购退货单';
                this.$route.meta.title = lastLevel;
                this.$store.commit('getLevel',lastLevel);
            },
            // 查询
            onQuery() {
                if(this.routeQuery.type==1){
                    this.storeoutBillToPage({});
                }else{
                    this.storeoutBillToPage({uid:this.routeMerData.uid});

                }
            },
            //添加退货单商品明细
            purchasePurchaseMer(param) {
                this.$cimList.procurement.purchasePurchaseMer(param).then(resData => {
                    if (resData.code == 200) {
                        this.queryData.dataList = resData.data.map(item => {
                            item.merUid = item.uid;
                            return item;
                        })
                    }
                });
            },
            // 获取回选参数
            storeoutBillToPage(param) {
                this.$cimList.procurement.storeoutBillToPage(param).then(resData => {
                    if (resData.code == 200) {
                        if(this.routeQuery.type==1){
                            this.queryData.billCode= resData.data.storeoutBill.billCode;
                        }else{
                            this.queryData = resData.data.storeoutBill;
                            this.queryData.dataLis =  this.queryData.dataList.map(item=>{
                                if(!item.purPrice){
                                    item.purPrice = item.price
                                }
                                if(!item.baseCount){
                                    item.baseCount = item.storeCount
                                }
                                return item
                            })
                            this.queryData.storeType = this.queryData.storeType.toString();
                            this.queryData.delList = [];
                            this.storehouseChange(this.queryData.storeType,false)
                        }
                    }
                });
            },
            // 新增退货单
            purchaseReturnSave(param) {
                this.$cimList.procurement.purchaseReturnSave(param).then(resData => {
                    if (resData.code == 200) {
                        this.$message({
                            type: "success",
                            message: "新建成功!"
                        });
                        this.handleCancel();
                    } else {
                        this.$message({
                            type: "error",
                            message: resData.msg
                        });
                    }
                });
            },
            storehouseListClick(){
                if (!this.queryData.cinemaUid) {
                    this.$message({
                        message: "请先选择一个门店!"
                    });
                    return;
                }
            },
            //仓库或者货架值改变
            storehouseListChange(value) {
                if (!this.queryData.storeinBillCode) {
                    this.queryData.dataList = [];
                }
                this.storehouseList.forEach(item => {
                    if (value == item.code) {
                        this.queryData.storehouseName = item.name
                    }
                })
            },
            //仓库货架改变
            storehouseChange(value,isEmpty=true) {
                if(isEmpty){
                    this.queryData.storehouseCode = "";
                    if (!this.queryData.storeinBillCode) {
                        this.queryData.dataList = [];
                    }
                }
                if (value == 1) {
                    //仓库查询
                    this.queryStoreEvent({
                        cinemaUid: this.queryData.cinemaUid,
                        cinemaName: this.queryData.cinemaName,
                        status:"1",
                        page: 1,
                        pageSize: 100
                    });
                } else {
                    //货架查询
                    this.queryRackEvent({
                        cinameUid: this.queryData.cinemaUid,
                        cinemaName: this.queryData.cinemaName,
                        status:"1",
                        page: 1,
                        pageSize: 100
                    });
                }

            },
            reasonCodeChange(value){
                this.reasonList.forEach(item => {
                    if (value == item.value) {
                        this.queryData.returnReason = item.label
                    }
                })
            },
            // 更新或者删除操作
            purchaseReturnUpdate(param) {
                console.log(param);
                this.$cimList.procurement
                    .purchaseReturnUpdate(param)
                    .then(resData => {
                        if (resData.code == 200) {
                            this.$message({
                                type: "success",
                                message: "编辑成功!"
                            });
                            this.handleCancel();
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
            // 查询仓库数据
            queryStoreEvent(param) {
                this.$cimList
                    .queryStorehouse(param)
                    .then(resData => {
                        if (resData.code === 200) {
                            this.storehouseList = resData.data.list
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 查询货架数据
            queryRackEvent(param) {
                this.$cimList
                    .findStorageRackList(param)
                    .then(resData => {
                        if (resData.code === 200) {
                            this.storehouseList = resData.data.list
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            handlePurchaseStoragDialogEvent() {
                if (!this.queryData.cinemaUid) {
                    this.$message({
                        message: "请先选择一个门店!"
                    });
                    return;
                }
                this.handleDialogEvent('refPurchaseStoragDialog')
            },
            handleAddGood() {
                if (!this.queryData.cinemaUid) {
                    this.$message({
                        message: "请先选择一个门店!"
                    });
                    return;
                }
                if (!this.queryData.storehouseCode) {
                    this.$message({
                        message: "请先选择一个退货仓库和货架!"
                    });
                    return;
                }
                this.selectedGoodsDialogVisible = true
            },
            handleOperateEvent(row) {
                this.$confirm("<i class='el-icon-circle-close'></i><span>确定删除吗?</span>", {
                    customClass: "retail-style",
                    dangerouslyUseHTMLString: true,
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    center: true,
                })
                    .then(() => {
                        this.queryData.dataList = this.queryData.dataList.filter(
                            item => {
                                return item.skuCode != row.skuCode;
                            }
                        );
                        if(row.uid){
                            this.queryData.delList.push({uid:row.uid});
                        }
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                    })
                    .catch(() => {
                    });
            },
            //
            handleSubmit(type) {
                console.log(this.queryData)

                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {
                        if( this.queryData.dataList.length==0){
                            this.$message("请先选择一个采购单或者添加一个商品!");
                            return;
                        }
                        this.queryData.status = type;
                        if (this.routeQuery.type == 1) {
                            this.purchaseReturnSave(this.queryData)
                        } else if (this.routeQuery.type == 2) {
                            this.purchaseReturnUpdate(this.queryData)
                        }
                    } else {
                        this.$message("带*号的为必填项，请填写");
                        return false;
                    }
                });

            },
            //
            handleCancel() {
                this.$store.commit("tagNav/removeTagNav", {
                    name: this.$route.name,
                    path: this.$route.path,
                    title: this.$route.meta.title,
                    query: this.$route.query
                })
                this.$router.push({
                    path: "/retail/procurement/purchaseReturn/list",
                });
            },
            saleCinemaType(type) {
                switch (type) {
                    case "0":
                        return "指定门店";
                        break;
                    case "1":
                        return "全部门店";
                        break;
                    case "2":
                        return "排除门店";
                        break;
                }
            },
            changeUnitList(value, row, key) {
                row.unitList.forEach(item => {
                    if (value == (item.uid || item.unitUid)) {
                        row.unitName =item. unitName || item.name
                    }
                })
            },
            // 选泽供应商回调
            onSupplierSumit(val = []) {
                if (val.length > 0) {
                    this.queryData.supName = val[0].supplierName;
                    this.queryData.supUid = val[0].uid;
                } else {
                    this.queryData.supName = "";
                    this.queryData.uid = "";
                }
            },
            // 选泽门店回调
            onCinemalSumit(val = []) {
                if (val.length > 0) {
                    let name = val[0].cinemaName || val[0].name;
                    let uid = val[0].cinemaUid || val[0].uid;
                    // if(this.queryData.cinemaUid && this.queryData.storeinBillCode){
                    //     if(this.queryData.cinemaUid != uid){
                            this.queryData.storeinBillCode = '';
                            this.queryData.storeinBillUid = '';
                            this.queryData.supName = "";
                            this.queryData.supUid = "";
                    //         return;
                    //     }else{
                    //
                    //     }
                    // }
                    this.queryData.cinemaName = name;
                    this.queryData.cinemaUid = uid;
                } else {
                    this.queryData.cinemaName = "";
                    this.queryData.cinemaUid = "";
                }
                this.storehouseChange(this.queryData.storeType)
                console.log(this.queryData);
            },
            // 选泽采购入库单回调
            onPurchasStoragSumit(val = []) {
                console.log("采购入库单数据", val);
                if (val.length > 0) {
                    this.queryData.storeinBillCode = val[0].billCode;
                    this.queryData.storeinBillUid = val[0].uid;
                    this.queryData.supName = val[0].supName;
                    this.queryData.supUid = val[0].supUid;
                    this.storeBillGetStoreIn({uid: val[0].uid})
                } else {
                    this.queryData.storehouseCode = "";
                    this.queryData.storeinBillCode = "";
                    this.queryData.storeinBillUid = "";
                    this.queryData.supName = "";
                    this.queryData.supUid = "";
                    this.queryData.dataList = [];
                }

                // console.log(this.queryData.billDetailList);
            },
            // 根据商品uid查基本单位
            queryPurUnitBySpuUid(param,callBack) {
                this.$cimList.procurement
                    .queryPurUnitBySpuUid(param)
                    .then(resData => {
                        if (resData.code === 200) {
                            callBack(resData.data)
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 查询采购入库单
            storeBillGetStoreIn(param) {
                this.$cimList.procurement.storeBillGetStoreIn(param).then(resData => {
                    if (resData.code == 200) {
                        let tempArr = resData.data.billDetailList.filter(item => {
                            return item.inType == 1;
                        })
                        this.queryData.dataList =[];
                        tempArr.forEach(item => {
                            this.queryPurUnitBySpuUid({spuUid:item.merUid,tag:2},(data)=>{
                                item.unitList = data
                                item.uid = "";
                                this.queryData.dataList.push(item)
                            })
                        })
                        console.log(this.queryData.dataList)
                        if (resData.data.storehouseCode.indexOf('CK') > -1) {
                            this.queryData.storeType = "1"
                        } else {
                            this.queryData.storeType = "2"
                        }
                        this.queryData.storehouseCode = resData.data.storehouseCode;
                        console.log(this.queryData.storeType)
                        this.storehouseChange(this.queryData.storeType,false)
                    }
                });
            },
            handleDialogEvent(name) {
                this.$refs[name].handleDialog(true);
            },
            selectedGoodsDialogCallBack(value) {
                if (value.btnType == 1) {
                    let param = {flag: 1, purchaseMerVoList: value.data, storehouseCode: this.queryData.storehouseCode}
                    this.purchasePurchaseMer(param);
                    console.log(value);
                } else {
                }
                console.log(value);
            },
            inputEvent(value, row, key) {
                console.log(value, row, key)
                row[key] = value;
                //选择了采购入库单
                if(this.queryData.storeinBillCode){
                    if (key == "storeoutCount" || key == "purPrice") {
                        row.amount = row.storeoutCount * row.purPrice
                    }
                    if (key == "amount") {
                        row.purPrice = (row.amount / row.storeoutCount).toFixed(2)
                    }
                }else{
                    if (key == "storeoutCount" || key == "price") {
                        row.amount = row.storeoutCount * row.price
                    }
                    if (key == "amount") {
                        row.price = (row.amount / row.storeoutCount).toFixed(2)
                    }
                }
            },
            //计算成本
            calculateCost(row, item) {
                switch (item.key) {
                    case "excludingTaxAmount":
                        //不含税金额=含税金额-含税金额*税率
                        if (row.amount && row.taxRate) {
                            return row[item.key] =
                                (row.amount - (row.amount * row.taxRate) / 100).toFixed(2);
                        } else {
                            return "";
                        }
                        break;
                    case "taxAmount":
                        //税额=含税金额-不含税金额
                        if (row.amount && row.excludingTaxAmount) {
                            return row[item.key] = (row.amount - row.excludingTaxAmount).toFixed(2);
                        } else {
                            return "";
                        }
                        break;
                    default:
                        return row[item.key];
                }
            },
            formatTableColumn() {
                var tempTableColumn = lodash.cloneDeep(this.tableColumn);
                if (this.queryData.storeinBillCode) {
                    tempTableColumn.splice(6, 1, {
                        label: "采购价(元)",
                        key:  "purPrice",
                        edit: () => {
                            if (this.routeQuery.type == 1) {
                                return true
                            } else if (this.routeQuery.type == 2) {
                                if (this.queryData.storeinBillCode) {
                                    return false
                                } else {
                                    return true
                                }
                            } else {
                                return false
                            }
                        }
                    });
                    tempTableColumn.splice(4, 1, {
                        label: "库存数量",
                        key: "baseCount"
                    });
                    if (this.routeQuery.type == 2 || this.routeQuery.type == 3) {
                        tempTableColumn.splice(3, 1, {
                            label: "基本单位",
                            key: "unitName"
                        });
                    }
                    return tempTableColumn;
                } else {

                    return tempTableColumn;
                }
            }
        },
        computed: {
            routeQuery() {
                return this.$route.query;
            },
            routeMerData() {
                if (this.$route.query.data) {
                    return JSON.parse(this.$route.query.data);
                } else {
                    return {};
                }
            },
            typeText() {
                //1新建，2修改，3查看
                switch (this.routeQuery.type) {
                    // 单品
                    case "1":
                        return "新建";
                        break;
                    // 财务
                    case "2":
                        return "编辑";
                        break;
                    // 合成品
                    case "3":
                        return "查看";
                        break;
                }
            },
            approvalStart(){
                let result = "";
                switch (this.queryData.approvalStatus) {
                    case 0:
                        result = "未审核";
                        break;
                    case 1:
                        result = "待审核";
                        break;
                    case 2:
                        result = "开始";
                        break;
                    case 3:
                        result = "审核不通过";
                        break;
                    case 4:
                        result = "无需审核";
                        break;
                }
                return result;
            },
            approvalActive(){
                let result = 0;
                switch (this.queryData.approvalStatus) {
                    case 0:
                        result = 1;
                        break;
                    case 1:
                        result = 1;
                        break;
                    case 2:
                        result = this.queryData.reviewRecordList.length + 2
                        break;
                    case 3:
                        result = this.queryData.reviewRecordList.length + 2
                        break;
                    case 4:
                        result = 1;
                        break;
                }
                return result;
            }
        },
        watch:{
           

        },
        components: {
            cinemalDialog,
            suppliersDialog,
            selectedGoods,
            purchaseStorageDialog
        }
    };
</script>

<style lang="scss">
    @import "../../../../assets/css/common.scss";
    @import "../../../../assets/css/element-common.scss";
    .purchase-return-common{
        .text-right {
            float: right;
            margin-bottom: 20px;
        }
        .store-type{
            width: 105px;
        }
        .storehouse-name{
            width: 298px;
        }
    }
    
</style>