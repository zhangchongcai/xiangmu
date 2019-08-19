<template>
    <div class="content purchase-storage-common">
<!--        <div class="breadcrumb">-->
<!--            <el-breadcrumb separator-class="el-icon-arrow-right">-->
<!--                <el-breadcrumb-item>采购管理</el-breadcrumb-item>-->
<!--                <el-breadcrumb-item  :to="{ path: '/retail/procurement/purchaseStorage/list' }">采购入库单管理</el-breadcrumb-item>-->
<!--                <el-breadcrumb-item>{{typeText}}{{billTypeText}}单</el-breadcrumb-item>-->
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
                                <el-form-item label="采购入库单号">
                                    <span>{{queryData.billCode}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="入库门店" class="select-input" prop="cinemaName"
                                              :rules="[{ required: routeQuery.type==3 ? false : true, message: '采购门店不能为空',trigger: 'change' }]">
                                    <span v-if="routeQuery.type==3">{{queryData.cinemaName}}</span>
                                    <div v-else>
                                        <el-input
                                                v-model="queryData.cinemaName"
                                                clearable
                                                @clear="onCinemalSumit()"
                                                placeholder="请选择门店"
                                                @focus="handleDialogEvent('refCinemalDialog')"
                                                :rules="[{ required: routeQuery.type==3 ? false : true, message: '速记代码不能为空',trigger: 'change' }]"
                                        ></el-input>
                                        <el-button type="primary" plain @click="handleDialogEvent('refCinemalDialog')">选择</el-button>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item v-if="routeQuery.billType==1" label="采购单号" class="select-input" prop="purchaseBillCode"
                                              :rules="[{ required: routeQuery.type==3 ? false : true, message: '采购单号不能为空',trigger: 'change' }]">
                                    <span v-if="routeQuery.type==3">{{queryData.purchaseBillCode}}</span>
                                    <div v-else>
                                         <el-input
                                                 v-model="queryData.purchaseBillCode"
                                                 clearable
                                                 @clear="onPurchaseNoteSumit()"
                                                 @focus="handleAddGood('chaseNote')"
                                                 placeholder="请选择采购单号"
                                         ></el-input>
                                         <el-button type="primary" plain @click="handleAddGood('chaseNote')">选择</el-button>
                                    </div>
                                </el-form-item>
                                <el-form-item v-else label="供应商名称" class="select-input" prop="supName"
                                              :rules="[{ required: routeQuery.type==3 ? false : true, message: '供应商名称不能为空',trigger: 'change' }]">
                                    <span v-if="routeQuery.type==3">{{queryData.supName}}</span>
                                    <div v-else>
                                        <el-input
                                                v-model="queryData.supName"
                                                clearable
                                                @clear="onSupplierSumit()"
                                                @focus="handleDialogEvent('refSuppliersDialog')"
                                                placeholder="请选择供应商"
                                        ></el-input>
                                        <el-button type="primary" plain @click="handleDialogEvent('refSuppliersDialog')">选择</el-button>
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="入库类型">
                                    <span>{{billTypeText}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row >
                            <el-col :span="10"  v-if="queryData.agreementCode">
                                <el-form-item label="协议编码" prop="code">
                                    <span>{{queryData.agreementCode}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10"  v-if="queryData.agreementName">
                                <el-form-item label="协议名称">
                                    <span>{{queryData.agreementName}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row>
                            <el-col :span="10">
                                <el-form-item  prop="storehouseCode"
                                               :rules="[{ required: routeQuery.type==3 ? false : true, message: queryData.storeType==1 ? '入库仓库不能为空':'入库货架不能为空',trigger: 'change' }]">
                                    <span slot="label">
                                        <div v-if="routeQuery.type==3">{{queryData.storeType==1 ? '入库仓库：':'入库货架：'}}</div>
                                        <el-select v-else v-model="queryData.storeType" @change="storehouseChange" class="store-type">
                                            <el-option label="入库仓库" value="1"></el-option>
                                            <el-option label="入库货架" value="2"></el-option>
                                        </el-select>
                                    </span>
                                    <span v-if="routeQuery.type==3">{{queryData.storehouseName}}</span>
                                    <el-select class="storehouse-name" v-else v-model="queryData.storehouseCode" @change="storehouseListChange"  @click.native="storehouseListClick">
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
                        <el-row v-if="routeQuery.type!=1">
                            <el-col :span="10" v-if="queryData.billTime">
                                <el-form-item label="制单日期">
                                    <span>{{queryData.billTime}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10" v-if="queryData.billUserName">
                                <el-form-item label="制单员" >
                                    <span>{{queryData.billUserName}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="routeQuery.type!=1">
                            <el-col :span="10">
                                <el-form-item label="单据状态">
                                    <span>{{formatStatus}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="审核状态" >
                                    <span>{{approvalStart(1)}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-collapse-item>
                <!-- 基础信息 end-->

                <!-- 入库信息 商品清单 start-->
                <el-collapse-item title="入库信息" name="2"  v-if="routeQuery.billType!=2">
                    <div>
                        <div class="text-right" v-if="routeQuery.billType==3 && routeQuery.type!=3">
                            <el-button @click="handleAddGood" type="primary" plain>添加商品</el-button>
                        </div>
                        <el-table :data="queryData.detailVoList" stripe>
                            <el-table-column
                                    v-for="item in formattedStorageTableColumn(storageTableColumn)"
                                    :key="item.key"
                                    :prop="item.key"
                                    :label="item.label"
                                    :formatter="item.formatter"
                            >
                                <template slot-scope="{row}" name="header">
                                    <div v-if="routeQuery.type==3">
                                        <div v-if="item.selsect && item.selsect(row)">
                                            <el-select v-model="row[item.key]" v-if="row.purUnitVoList" disabled>
                                                <el-option
                                                        :key="unitItem.id"
                                                        :label="unitItem.name"
                                                        :value="unitItem.unitUid"
                                                        v-for="unitItem in row.purUnitVoList"
                                                ></el-option>
                                            </el-select>
                                        </div>
                                        <div v-else>
                                            {{calculateCost(row,item)}}
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div v-if="item.edit && item.edit(row)">
                                            <el-input
                                                    size="small"
                                                    type="number"
                                                    :value="row[item.key]"
                                                    @input="inputEvent($event,row,item.key)"
                                                    placeholder
                                            ></el-input>
                                        </div>
                                        <div v-else-if="item.selsect && item.selsect(row)">
                                            <div v-if="routeQuery.type ==1 && routeQuery.billType==1">
                                                {{row.purUnitName}}
                                            </div>
                                            <div else>
                                                <el-select v-model="row[item.key]" v-if="row.purUnitVoList"
                                                           :disabled="(routeQuery.type!=1 && routeQuery.billType!=3) ? true : false"
                                                           @change="changePurUnitVoList($event,row,item.key)">
                                                    <el-option
                                                            :key="unitItem.id"
                                                            :label="unitItem.name"
                                                            :value="unitItem.unitUid"
                                                            v-for="unitItem in row.purUnitVoList"
                                                    ></el-option>
                                                </el-select>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <span>{{calculateCost(row,item)}}</span>
                                        </div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" style="width:180px;" v-if="routeQuery.type!=3 && routeQuery.billType==3">
                                <template slot-scope="{row}">
                                    <el-button type="text" size="small" @click.stop="handleOperateEvent(row,3)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-collapse-item>
                <!-- 入库信息 商品清单 end-->

                <!-- 赠送商品 start-->
                <el-collapse-item :title="routeQuery.billType==2?'入库信息':'赠送商品'" name="3"  v-if="routeQuery.billType!=3">
                    <div>
                        <div class="text-right" v-if="routeQuery.type!=3 && queryData.status!='2'">
                            <el-button @click="handleAddGood">添加商品</el-button>
                        </div>
                        <el-table :data="freeGoodsTableData" stripe>
                            <el-table-column
                                    v-for="item in freeGoodsTableColumn"
                                    :key="item.key"
                                    :prop="item.key"
                                    :label="item.label"
                                    :formatter="item.formatter"
                            >
                                <template slot-scope="{row}" name="header">
                                    <div v-if="routeQuery.type==3">
                                        <div v-if="item.selsect && item.selsect(row)">
                                            <el-select v-model="row[item.key]" v-if="row.purUnitVoList" disabled>
                                                <el-option
                                                        :key="unitItem.id"
                                                        :label="unitItem.name"
                                                        :value="unitItem.unitUid"
                                                        v-for="unitItem in row.purUnitVoList"
                                                ></el-option>
                                            </el-select>
                                        </div>
                                        <div v-else>
                                            {{calculateCost(row,item)}}
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div v-if="item.edit">
                                            <el-input size="small" v-model="row[item.key]"  type="number" placeholder></el-input>
                                        </div>
                                        <div v-else-if="item.selsect && item.selsect(row)">
                                            <el-select v-model="row[item.key]" v-if="row.purUnitVoList"
                                                       :disabled="((routeQuery.type!=1)&&routeQuery.billType!=2)  ? true: false"
                                                       @change="changePurUnitVoList($event,row,item.key)">
                                                <el-option
                                                        :key="unitItem.uid"
                                                        :label="unitItem.name"
                                                        :value="unitItem.unitUid"
                                                        v-for="unitItem in row.purUnitVoList"
                                                ></el-option>
                                            </el-select>
                                        </div>
                                        <div v-else>
                                            <span>{{row[item.key]}}</span>
                                        </div>
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
                <!-- 赠送商品 end-->

                <!--  审批流程-->
                <el-collapse-item title="审批流程" name="3" v-if="routeQuery.type==3">
                    <el-form-item  label="审批流程名称"  label-width="110px">
                        <span>{{billTypeText}}审核</span>
                    </el-form-item>
                    <el-steps :space="200" :active="approvalActive" finish-status="success">
                        <el-step :title="approvalStart()"></el-step>
                        <el-step :title="item.auditMan" :key="item.auditTime" v-for="item in queryData.reviewRecordList"></el-step>
                        <el-step title="结束" v-if="queryData.approvalStatus==2"></el-step>
                    </el-steps>
                </el-collapse-item>
                <!--  审批记录-->
                <el-collapse-item title="审批记录" name="4" v-if="routeQuery.type==3">
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
            <cinemal-dialog ref="refCinemalDialog" title="选择门店" @onSumit="onCinemalSumit" :dialogFeedbackData="[{cinemaUid:queryData.cinemaUid,cinemaName:queryData.cinemaName}]"></cinemal-dialog>
            <!-- 选择采购单弹窗 -->
            <purchase-note-dialog ref="refPurchaseNoteDialog" :cinemaUid="queryData.cinemaUid" :approvalStatus="2"
                                  @onSumit="onPurchaseNoteSumit"></purchase-note-dialog>
            <!-- 选择供应商弹窗 -->
            <suppliers-dialog ref="refSuppliersDialog" @onSumit="onSupplierSumit" :dialogFeedbackData="[{supUid:queryData.supUid}]"></suppliers-dialog>
            <!-- 选择商品 -->
            <selected-goods
                    :dialogVisible.sync="selectedGoodsDialogVisible"
                    :cinemaUid="queryData.cinemaUid"
                    :merType="'1,5'"
                    canSale="-1"
                    @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
            ></selected-goods>

            <div class="submit-box" v-if="routeQuery.type!=3">
                <el-button type="primary" @click="handleSubmit('2')" :loading="submitLoading">保存并提交</el-button>
                <el-button v-if="queryData.status!=2" type="primary" @click="handleSubmit('1')" :loading="submitLoading">保存为草稿</el-button>
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
    import selectedGoods from "cim/dialogs/cimSelectedGoods/index.vue";
    import suppliersDialog from "cim/components/suppliersDialog/suppliersDialog.vue";
    import purchaseNoteDialog from "cim/components/purchaseNoteDialog/purchaseNoteDialog.vue";

    export default {
        mixins: [mixin],
        data() {
            return {
                //查询数据
                queryData: {
                    //基础信息
                    purchaseBillCode: "", //采购单编号
                    purchaseBillUid: "", //采购单编号
                    billCode: "", //入库单编号
                    cinemaUid: "", //门店id
                    cinemaName: "", //门店名称
                    billType: "", //入库单类型,1：采购入库，2：赠送入库，3：直接入库
                    agreementCode: "", //	协议编码
                    agreementName: "", //协议名称
                    agreementUid: "", //	协议uid
                    storeType: "1", //库存类型，1：仓库，2：货架
                    storehouseCode: "", //库存编码
                    storehouseName: "", //库存名称
                    detailVoList: [], //入库明细列表
                    supName: "", //供应商名称
                    supUid: "", //供应商id
                    isReview: 1, //是否需要审核,0不需要,1需要
                    remark: "", //备注
                    status: 1 //保存标志,1草稿,2保存并提交
                },
                storehouseList: [], //仓库货架列表
                total: 0,
                // 入库信息表格表头
                storageTableColumn: [
                    {
                        label: "商品名称",
                        key: "skuName"
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
                        label: "采购单位",
                        key: "purUnitUid",
                        selsect: row => {
                            return true;
                        }
                    },
                    {
                        label: "采购数量",
                        key: "purCount",
                        edit: row => {
                            // 直接入库可以编辑
                            if (this.routeQuery.billType == 3) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    {
                        label: "入库数量",
                        key: "storeinCount",
                        edit: () => true
                    },
                    {
                        label: "已入库数量",
                        key: "inCount",
                    },
                    {
                        label: "采购成本(元)",
                        key: "purPrice",
                        edit: row => {
                            // 直接入库可以编辑
                            if (this.routeQuery.billType == 3) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    {
                        label: "税率(%)",
                        key: "taxRate",
                        edit: row => {
                            // 直接入库可以编辑
                            if (this.routeQuery.billType == 3) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    {
                        label: "含税金额(元)",
                        key: "amount",
                        edit: row => {
                            // 直接入库可以编辑
                            if (this.routeQuery.billType == 3) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    {
                        label: "不含税采购成本(元)",
                        key: "excludingTaxCost"
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
                freeGoodsTableColumn: [
                    {
                        label: "商品名称",
                        key: "skuName"
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
                        label: "采购单位",
                        key: "purUnitUid",
                        selsect: row => true
                    },
                    {
                        label: "入库数量",
                        key: "storeinCount",
                        edit: true
                    },
                    {
                        label: "采购成本(元)",
                        key: "purPrice"
                    }
                ],
                // 赠送表格数据
                freeGoodsTableData: [],
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
                selectedGoodsDialogVisible: false,
                submitLoading:false,
                deleteDetailList:[],
                activeNames: ['1', '2', '3']
            };
        },
        activated(){
            // this.init();
        },
        mounted() {
            this.init();
        },

        methods: {
            init() {
                this.onQuery();
                // let lastLevel = this.typeText + this.billTypeText + "单";
                // this.$route.meta.title = lastLevel;
                // this.$store.commit('getLevel', lastLevel);
            },
            // 查询
            onQuery() {
                // console.log(this.materialQueryData);
                if (this.routeQuery.type == 1) {
                    this.queryData.billType = this.routeQuery.billType - 0;
                    this.storeBillGetStoreInBillCode();
                } else {
                    this.storeBillGetStoreIn({uid: this.routeMerData.uid});
                }
            },
            // 生成编码
            storeBillGetStoreInBillCode(param) {
                this.$cimList.procurement
                    .storeBillGetStoreInBillCode(param)
                    .then(resData => {
                        if (resData.code == 200) {
                            this.queryData.billCode = resData.data;
                        }
                    });
            },
            // 查看
            storeBillGetStoreIn(param) {
                this.$cimList.procurement.storeBillGetStoreIn(param).then(resData => {
                    if (resData.code == 200) {
                        this.queryData = JSON.parse(JSON.stringify(resData.data));
                        this.queryData.storeType = this.queryData.storeType.toString();
                        this.routeQuery.billType = this.queryData.billType - 0;
                        this.storehouseChange(this.queryData.storeType)
                        this.queryData.storehouseCode = resData.data.storehouseCode;
                        let tempArr = JSON.parse(JSON.stringify(this.queryData.detailVoList));
                        this.queryData.detailVoList = [];//清空，重新赋值
                        this.freeGoodsTableData = [];//清空，重新赋值
                        tempArr.forEach(item => {
                            this.queryPurUnitBySpuUid({spuUid:item.merUid,tag:1},(data)=>{
                                item.purUnitVoList = data
                                // 1：主入库商品，2：附加入库，采购赠送
                                if (item.inType == 1) {
                                    this.queryData.detailVoList.push(item)
                                } else {
                                    this.freeGoodsTableData.push(item)
                                }
                            })
                        })
                    }
                });
            },
            //仓库货架改变
            storehouseChange(value) {
                this.queryData.storehouseCode = "";
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
            changePurUnitVoList(value, row, key) {
                row.purUnitVoList.forEach(item => {
                    if (value == item.unitUid) {
                        row.purUnitName = item.name
                        row.purUnitRatio = item.purUnitRatio
                    }
                })
            },
            storehouseListChange(value) {
                this.storehouseList.forEach(item => {
                    if (value == item.code) {
                       this.queryData.storehouseName = item.name
                    }
                })
            },
            // 查询仓库数据
            queryStoreEvent(param) {
                this.$cimList
                    .queryStorehouse(param)
                    .then(resData => {
                        if (resData.code === 200) {
                            this.storehouseList = resData.data.list.filter((item, merIndex) => {
                                return item.status != 2
                            })
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
                            this.storehouseList = resData.data.list.filter((item, merIndex) => {
                                return item.status != 2
                            })
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    });
            },
            // 根据商品uid查采购单位
            queryPurUnitBySpuUid(param,callBack) {
                this.$cimList.procurement
                    .queryPurUnitBySpuUid(param)
                    .then(resData => {
                        if (resData.code === 200) {
                            callBack(resData.data)
                        }else{
                            this.$message({
                                message: resData.message
                            });
                        }
                    })
                    .catch(resData => {
                        this.$message({
                            message: resData.message
                        });
                    });
            },
            // 新增
            storeBillSaveStoreIn(param) {
                this.submitLoading = true;
                this.$cimList.procurement.storeBillSaveStoreIn(param).then(resData => {
                    this.submitLoading = false;
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
                }).catch(()=>{
                    this.submitLoading = false;
                })
            },
            // 更新或删除入库单
            storeBillUpdateStoreIn(param) {
                this.submitLoading = true;
                this.$cimList.procurement.storeBillUpdateStoreIn(param).then(resData => {
                    this.submitLoading = false;
                    if (resData.code == 200) {
                        this.$message({
                            type: "success",
                            message: "更新成功!"
                        });
                        this.handleCancel();
                    } else {
                        this.$message({
                            type: "error",
                            message: resData.msg
                        });
                    }
                }).catch(()=>{
                    this.submitLoading = false;
                })
            },
            handleAddGood(type) {
                if (!this.queryData.cinemaUid) {
                    this.$message({
                        message: "请先选择一个门店!"
                    });
                    return;
                }
                if (type == "chaseNote") {
                    this.handleDialogEvent('refPurchaseNoteDialog')
                } else {
                    this.selectedGoodsDialogVisible = true
                }

            },
            handleOperateEvent(row,type) {
                this.$confirm("<i class='el-icon-circle-close'></i><span>确定删除吗?</span>", {
                    customClass: "retail-style",
                    dangerouslyUseHTMLString: true,
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    center: true,
                })
                    .then(() => {
                        if(type ==3 ){
                            this.queryData.detailVoList = this.queryData.detailVoList.filter(
                                item => {
                                    return item.uid != row.uid;
                                }
                            )
                        }else{
                            this.freeGoodsTableData = this.freeGoodsTableData.filter(
                                item => {
                                    return item.uid != row.uid;
                                }
                            );
                        }
                        if(!row.addFlag){
                           this.deleteDetailList.push({uid:row.uid})
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
                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {
                        //0草稿,1保存并提交
                        this.queryData.status = type;
                        let param = JSON.parse(JSON.stringify(this.queryData));
                        if (this.freeGoodsTableData.length > 0) {
                            param.detailVoList.push(...this.freeGoodsTableData);
                        }
                        param.detailVoList = param.detailVoList.map(item=>{
                            item.storehouseCode = param.storehouseCode;
                            item.storehouseName = param.storehouseName;
                            return item
                        })
                        if (param.detailVoList.length == 0) {
                            this.$message({
                                message: "请添加一个商品!"
                            });
                            return;
                        }
                        let flag =true;
                        for(let item of param.detailVoList) {
                            if(!item.purUnitUid){
                                this.$message("请选择采购单位");
                                flag = false
                                break;
                            }
                            if(item.storeinCount<1){
                                this.$message("入库数量必须是大于0的整数");
                                flag = false
                                break;
                            }
                            if(this.routeQuery.billType == 3){
                                if(!item.purPrice){
                                    this.$message("请填写采购成本");
                                    flag = false
                                    break;
                                }else{
                                    if(item.purPrice<0){
                                        this.$message("采购成本必须大于0");
                                        flag = false
                                        break;
                                    }
                                }
                                if(!item.taxRate){
                                    this.$message("请填写税率");
                                    flag = false
                                    break;
                                }else{
                                    if(item.taxRate<0){
                                        this.$message("税率必须大于0");
                                        flag = false
                                        break;
                                    }
                                }
                                if(!item.amount){
                                    this.$message("请写含税金额");
                                    flag = false
                                    break;
                                }
                            }

                        }
                        if(!flag){
                            return;
                        }
                        if (this.routeQuery.type == 1) {
                            //新建
                            this.storeBillSaveStoreIn(param);
                        } else if (this.routeQuery.type == 2) {
                            //修改
                            let updateParam = {
                                billType : this.queryData.billType,
                                status : type,
                                delFlag:0,
                                uid : this.queryData.uid,
                                addDetailList : [], //增加列表
                                updateDetailList : [],//更新列表
                                deleteDetailList : this.deleteDetailList,//删除列表
                            }
                            param.detailVoList.forEach(item=>{
                                if(item.addFlag){
                                    updateParam.addDetailList.push(item);
                                }else{
                                    updateParam.updateDetailList.push(item);
                                }
                            })
                            this.storeBillUpdateStoreIn(updateParam);
                        }
                    } else {
                        this.$message("带*号的为必填项，请填写");
                        return false;
                    }
                });
            },

            // 选泽门店回调
            onCinemalSumit(val = [],type) {
                // console.log(val," 选泽门店回调",type);
                if (val.length > 0) {
                    if(type=="default"){
                        if(val.length==1){
                            this.setCinema(val);
                            this.storehouseChange(this.queryData.storeType)
                        }
                    }else{
                        this.setCinema(val)
                        this.storehouseChange(this.queryData.storeType)
                    }
                } else {
                    this.setCinema()
                }
            },
            setCinema(val=[]){
                if(val.length>0){
                    this.queryData.cinemaName =  val[0].name || val[0].cinemaName ;
                    this.queryData.cinemaUid =  val[0].uid || val[0].cinemaUid;
                }else{
                    this.queryData.cinemaName = "";
                    this.queryData.cinemaUid = "";
                }
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
            // 选泽采购单回调
            onPurchaseNoteSumit(val = []) {
                if (val.length > 0) {
                    if (this.routeQuery.billType == 1) {
                        let tempArr = [];
                        val[0].purchaseBillDetailVoList.forEach(
                            item => {
                                if(item.inCount != item.purCount){
                                    item.inType = 1;
                                    tempArr.push(item)
                                }
                            }
                        )
                        this.queryData.detailVoList = tempArr;
                    }
                    this.queryData.purchaseBillCode = val[0].billCode;
                    this.queryData.purchaseBillUid = val[0].uid;
                    this.queryData.supUid = val[0].supUid;
                    this.queryData.supName = val[0].supName;
                    this.queryData.agreementName = val[0].agreementName;
                    this.queryData.agreementCode = val[0].agreementCode;
                } else {
                    this.queryData.purchaseBillCode = "";
                    this.queryData.purchaseBillUid = "";
                    this.queryData.supUid = "";
                    this.queryData.supName = "";
                    this.queryData.agreementName = "";
                    this.queryData.agreementCode = "";
                }
            },

            handleDialogEvent(name) {
                this.$refs[name].handleDialog(true);
            },
            storehouseListClick(){
                if (!this.queryData.cinemaUid) {
                    this.$message({
                        message: "请先选择一个门店!"
                    });
                    return;
                }
            },
            //添加入库单商品明细
            purchasePurchaseMer(param) {
                this.$cimList.procurement.purchasePurchaseMer(param).then(resData => {
                    if (resData.code == 200) {
                        //采购入库和赠送入库
                        if (this.routeQuery.billType == 1 || this.routeQuery.billType == 2) {
                             let result =  resData.data.map(item => {
                                item.inType = 2;
                                item.merUid = item.uid;
                                item.addFlag = true
                                item.purPrice = 0; //赠送入库采购成本0
                                return item;
                            });
                            this.freeGoodsTableData.push(...result);
                            this.freeGoodsTableData =  this.unRepeat(this.freeGoodsTableData)
                        }  //直接入库
                        if (this.routeQuery.billType == 3) {
                            let result =  resData.data.map(item => {
                                item.inType = 1;
                                item.addFlag = true
                                item.merUid = item.uid;
                                return item
                            })
                            this.queryData.detailVoList.push(...result);
                            this.queryData.detailVoList =  this.unRepeat(this.queryData.detailVoList)
                        }

                    }else{
                        this.$message({
                            message: resData.msg
                        });
                    }
                }).catch(resData => {
                    this.$message({
                        message: resData.message
                    });
                });
            },
            //去重
            unRepeat(arr) {
                let hash = {};
                return arr.reduce((item, next) => {
                    if (!hash[next.skuUid]) {
                        hash[next.skuUid] = true;
                        item.push(next);
                    }
                    return item;
                }, []);
            },
            selectedGoodsDialogCallBack(value) {
                if (value.btnType == 1) {
                    if(value.data.length>0){
                        this.purchasePurchaseMer({flag: 1, purchaseMerVoList: value.data});
                    }
                } else {
                }
            },
            inputEvent(value,row,key) {
                // console.log(value,row,key)
                row[key] = value.replace(/^(.*\..{4}).*$/,"$1");
                if(key =="storeinCount"  ||key =="purPrice" ){
                    row.amount =  (row.storeinCount * row.purPrice).toFixed(4)
                }
                if(key =="amount"){
                    if(row.amount && row.storeinCount){
                        row.purPrice =  (row.amount/row.storeinCount).toFixed(4)
                    }
                }
            },
            //计算成本
            calculateCost(row, item) {
                if(typeof row.purPrice === 'number') {
                    row.purPrice = row.purPrice.toFixed(4).toString();
                }
                if(typeof row.amount === 'number') {
                    row.amount = row.amount.toFixed(4).toString();
                }
                if(typeof row.taxRate === 'number') {
                    row.taxRate = row.taxRate.toString();
                }
                switch (item.key) {
                    case "excludingTaxCost":
                        // 不含税采购成本=采购成本-采购成本*税率
                        if (row.purPrice && row.taxRate) {
                            return row[item.key] =
                                (row.purPrice - (row.purPrice * row.taxRate) / 100).toFixed(4);
                        } else {
                            return "";
                        }
                        break;
                    case "excludingTaxAmount":
                        //不含税金额=含税金额-含税金额*税率
                        if (row.amount && row.taxRate) {
                            return row[item.key] =
                                (row.amount - (row.amount * row.taxRate) / 100).toFixed(4);
                        } else {
                            return "";
                        }
                        break;
                    case "taxAmount":
                        //税额=含税金额-不含税金额
                        if (row.amount && row.excludingTaxAmount) {
                            return row[item.key] = (row.amount - row.excludingTaxAmount).toFixed(4);
                        } else {
                            return "";
                        }
                        break;
                    default:
                        return row[item.key];
                }
            },
            // 取消提交信息
            handleCancel() {
                this.$store.commit("tagNav/removeTagNav", {
                    name: this.$route.name,
                    path: this.$route.path,
                    title: this.$route.meta.title,
                    query: this.$route.query
                })
                this.$router.push({
                    path: "/retail/procurement/purchaseStorage/list",
                });
            },
            formattedStorageTableColumn(clumns) {
                //直接入库不需要采购数量和已入库数量
                if (this.routeQuery.billType == 3) {
                    clumns = clumns.filter(item => {
                        return(item.key != "purCount" && item.key != "inCount")
                    })
                }
                return clumns;
            },
            approvalStart(type){
                let result = "";
                switch (this.queryData.approvalStatus) {
                    case 0:
                        result = "未审核";
                        break;
                    case 1:
                        result = "待审核";
                        break;
                    case 2:
                        if(type==1){
                            result = "审核通过";
                        }else{
                            result = "开始";
                        }
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
            formatStatus(){
                let result = "";
                switch (this.queryData.status) {
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
            },
            billTypeText() {
                // debugger
                switch (this.routeMerData.billType ||this.queryData.billType) {
                    case 1:
                        return "采购入库";
                        break;
                    case 2:
                        return "赠送入库";
                        break;
                    case 3:
                        return "直接入库";
                        break;
                }
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
        components: {
            cinemalDialog,
            purchaseNoteDialog,
            selectedGoods,
            suppliersDialog
        }
    };
</script>

<style lang="scss">
    @import "../../../../assets/css/common.scss";
    @import "../../../../assets/css/element-common.scss";
    .purchase-storage-common{
        .text-right{
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