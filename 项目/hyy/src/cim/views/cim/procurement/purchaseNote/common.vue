<template>
    <div class="content purchase-note-common">
        <!--        <div class="breadcrumb">-->
        <!--            <el-breadcrumb separator-class="el-icon-arrow-right">-->
        <!--                <el-breadcrumb-item>采购管理</el-breadcrumb-item>-->
        <!--                <el-breadcrumb-item :to="{ path: '/retail/procurement/purchaseNote/list' }">采购单管理</el-breadcrumb-item>-->
        <!--                <el-breadcrumb-item>{{typeText}}采购单</el-breadcrumb-item>-->
        <!--            </el-breadcrumb>-->
        <!--        </div>-->
        <div class="tittle"></div>
        <el-form
                :inline="true"
                ref="ruleForm"
                :model="queryData"
                label-position="left"
                label-width="100px"
                label-suffix="："
        >
            <el-collapse v-model="activeNames">
                <!-- 基础信息 start-->
                <el-collapse-item title="基础信息" name="1">
                    <div>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="采购单号">
                                    <span>{{queryData.billCode}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="采购门店" class="select-input" prop="cinemaName"
                                              :rules="[{ required: routeQuery.type==3 ? false : true, message: '采购门店不能为空',trigger: 'change' }]">
                                    <span v-if="routeQuery.type==3">{{queryData.cinemaName}}</span>
                                    <div v-else>
                                        <el-input
                                                v-model="queryData.cinemaName"
                                                clearable
                                                :disabled="routeQuery.type==1 ? false:true"
                                                @focus="handleDialogEvent('refCinemalDialog')"
                                                @clear="onCinemalSumit()"
                                                placeholder="请选择门店"
                                        ></el-input>
                                        <el-button type="primary" plain @click="handleDialogEvent('refCinemalDialog')" v-if="routeQuery.type==1">{{queryData.cinemaName?"编辑":"选择"}}</el-button>
                                    </div>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
<!--                                <el-form-item  label-width="110px" class="select-input" prop="supName">-->
<!--                                    <el-checkbox solt="label" v-model="isOpenAgreement" @change="changeOpenAgreement">-->
<!--                                        启用采购协议-->
<!--                                    </el-checkbox>-->
<!--                                    <span v-if="isOpenAgreement">-->
<!--                                        <el-input-->
<!--                                                v-model="queryData.agreementName"-->
<!--                                                clearable-->
<!--                                                @focus="handleDialogEvent('refAgreementDialog')"-->
<!--                                                @clear="onAgreementSumit()"-->
<!--                                                placeholder="请选择采购协议"-->
<!--                                        ></el-input>-->
<!--                                        <el-button type="primary" plain @click="handleDialogEvent('refAgreementDialog')"-->
<!--                                                   v-if="routeQuery.type==1">{{queryData.supName?"编辑":"选择"}}</el-button>-->
<!--                                    </span>-->
<!--                                </el-form-item>-->
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="供应商名称" class="select-input" prop="supName"
                                              :rules="[{ required: routeQuery.type==3 ? false : true, message: '供应商名称不能为空',trigger: 'change' }]">
                                    <div v-if="queryData.billType==1">
                                        {{queryData.supName}}
                                    </div>
                                    <div v-else>
                                        <span v-if="routeQuery.type==3">{{queryData.supName}}</span>
                                        <div v-else>
                                            <el-input
                                                    :disabled="routeQuery.type==1 ? false:true"
                                                    v-model="queryData.supName"
                                                    clearable
                                                    @clear="onSupplierSumit()"
                                                    @focus="handleDialogEvent('refSuppliersDialog')"
                                                    placeholder="请选择供应商"
                                            ></el-input>
                                            <el-button type="primary" plain @click="handleDialogEvent('refSuppliersDialog')" v-if="routeQuery.type==1">{{queryData.supName?"编辑":"选择"}}</el-button>
                                        </div>
                                    </div>

                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="queryData.agreementCode">
                            <el-col :span="8">
                                <el-form-item label="协议编码" prop="code">
                                    <span>{{queryData.agreementCode}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="有效期">
                                    <span>{{queryData.beginTime}} ~ {{queryData.finishTime}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-collapse-item>
                <!-- 基础信息 end-->

                <!-- 商品清单 start-->
                <el-collapse-item title="商品清单" name="2">
                    <div>
                        <div class="text-right" v-if="!isOpenAgreement">
                            <el-button @click="handleAddGood" type="primary" plain v-if="queryData.billType!=1">添加商品
                            </el-button>
                        </div>
                        <el-table :data="queryData.purchaseBillDetailVoList" stripe>
                            <el-table-column
                                    v-for="item in tableColumn"
                                    :key="item.key"
                                    :prop="item.key"
                                    :label="item.label"
                                    :formatter="item.formatter"
                            >
                                <template slot-scope="{row}" name="header">
                                    <div v-if="routeQuery.type!=3">
                                        <div v-if="item.edit && item.edit(row)">
                                            <el-input
                                                    size="small"
                                                    :value="row[item.key]"
                                                    @input="inputEvent($event,row,item.key)"
                                            ></el-input>
                                        </div>
                                        <div v-else-if="item.selsect">
                                            <el-select v-model="row[item.key]"  :disabled="routeQuery.type==1 ? false:true">
                                                <el-option
                                                        :key="unitItem.id"
                                                        :label="unitItem.name"
                                                        :value="unitItem.unitUid"
                                                        v-for="unitItem in row.purUnitVoList"
                                                ></el-option>
                                            </el-select>
                                        </div>
                                        <div v-else>
                                            <span>{{calculateCost(row,item)}}</span>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div v-if="item.selsect">
                                            <el-select v-model="row[item.key]" disabled>
                                                <el-option
                                                        :key="unitItem.id"
                                                        :label="unitItem.name"
                                                        :value="unitItem.unitUid"
                                                        v-for="unitItem in row.purUnitVoList"
                                                ></el-option>
                                            </el-select>
                                        </div>
                                        <span v-else>{{row[item.key]}}</span>
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
                <!-- 商品清单 end-->

                <!--  审批流程-->
                <el-collapse-item title="审批流程" name="3" v-if="routeQuery.type==3">
                    <el-form-item  label="审批流程名称"  label-width="110px">
                        <span>采购单审核</span>
                    </el-form-item>
                    <el-steps :space="200" :active="approvalActive" finish-status="success">
                        <el-step :title="approvalStart"></el-step>
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
            <cinemal-dialog ref="refCinemalDialog" @onSumit="onCinemalSumit" :dialogFeedbackData="[{cinemaUid:queryData.cinemaUid,cinemaName:queryData.cinemaName}]"></cinemal-dialog>

            <!-- 选择采购协议 -->
            <agreement-dialog
                    ref="refAgreementDialog"
                    @onSumit="onAgreementSumit"
            ></agreement-dialog>

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
                <el-button type="primary" @click="handleSubmit('1')" :loading="submitLoading">保存并提交</el-button>
                <el-button type="primary" @click="handleSubmit('0')" :loading="submitLoading" v-if="queryData.status==1">保存为草稿</el-button>
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
    import agreementDialog from "cim/components/agreementDialog/agreementDialog.vue";

    export default {
        name:"common",
        mixins: [mixin],
        data() {
            return {
                selectedGoodsDialogVisible: false,
                //查询数据
                queryData: {
                    //基础信息
                    billCode: "", //采购单号
                    cinemaUid: "", //门店id
                    cinemaName: "", //门店名称
                    billType: "0", //单据类型,0无协议,1有协议
                    agreementCode: "", //	协议编码
                    agreementName: "", //协议名称
                    agreementUid: "", //	协议uid
                    purchaseBillDetailVoList: [], //采购商品明细集合
                    supName: "", //供应商名称
                    supUid: "", //供应商id
                    isReview: 1, //是否需要审核,0不需要,1需要
                    remark: "", //备注
                    status:1,
                    tag: "" //保存标志,0草稿,1保存并提交
                },
                isOpenAgreement: false,
                total: 0,
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
                computAmount: '',
                submitLoading: false,
                activeNames: ['1', '2', '3','4']
            };
        },
        created(){

        },
        mounted() {
            this.init();
        },

        methods: {
            init() {
                if (this.routeQuery.type == 1) {
                    this.purchaseCode();
                } else {
                    this.purchaseGet({billCode: this.routeMerData.billCode});
                }
                console.log(this.$route);
                let lastLevel = this.typeText+'采购单';
                this.$route.meta.title = lastLevel;
                this.$store.commit('getLevel',lastLevel);
            },
            // 生成采购编码
            purchaseCode(param) {
                this.$cimList.procurement.purchaseCode(param).then(resData => {
                    if (resData.code == 200) {
                        this.queryData.billCode = resData.data;
                    }
                });
            },
            //添加采购单商品明细
            purchasePurchaseMer(param) {
                this.$cimList.procurement.purchasePurchaseMer(param).then(resData => {
                    if (resData.code == 200) {
                        this.queryData.purchaseBillDetailVoList.push(...resData.data.map(item => {
                            item.merUid = item.uid;
                            item.baseUnitUid = item.unitUid;
                            item.isProceedUpdate = 0;
                            if(item.purCount ===undefined){
                                item.purCount = null;
                            }
                            if (item.purPrice===undefined) {
                                item.purPrice = null;
                            }
                            if (item.amount===undefined) {
                                item.amount = null;
                            }
                            return item
                        }))
                        this.queryData.purchaseBillDetailVoList = this.unRepeat(this.queryData.purchaseBillDetailVoList)
                    } else {
                        this.$message({
                            message: resData.msg
                        });
                    }
                }).catch((resData) => {
                    this.$message({
                        message: resData.message
                    });
                })
            },
            // 新增采购单
            purchaseSave(param) {
                this.submitLoading = true;
                this.$cimList.procurement.purchaseSave(param).then(resData => {
                    this.submitLoading = false;
                    if (resData.code == 200) {
                        this.$message({
                            type: "success",
                            message: "新建成功!"
                        });
                        this.handleCancel();
                    } else {
                        this.$message({
                            message: resData.msg
                        });
                    }
                }).catch(()=>{
                    this.submitLoading = false;
                })
            },
            // 修改采购单
            purchaseUpdate(param) {
                this.submitLoading = true;
                this.$cimList.procurement.purchaseUpdate(param).then(resData => {
                    this.submitLoading = false;
                    if (resData.code == 200) {
                        this.$message({
                            type: "success",
                            message: "修改成功!"
                        });
                        this.handleCancel();
                    } else {
                        this.$message({
                            message: resData.msg
                        });
                    }
                }).catch(()=>{
                    this.submitLoading = false;
                })
            },
            // 查看采购单
            purchaseGet(param) {
                this.$cimList.procurement.purchaseGet(param).then(resData => {
                    if (resData.code == 200) {
                        this.queryData = resData.data;
                    } else {
                        this.$message({
                            message: resData.msg
                        });
                    }
                }).catch(() => {

                })
            },
            handleAddGood() {
                if (!this.queryData.cinemaUid) {
                    this.$message({
                        message: "请先选择一个门店!"
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
                        this.queryData.purchaseBillDetailVoList = this.queryData.purchaseBillDetailVoList.filter(
                            item => {
                                return item.uid != row.uid;
                            }
                        );
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
                //0草稿,1保存并提交
                this.queryData.tag = type;
                this.queryData.isReview = type;
                console.log(this.queryData);
                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {
                        if(this.isOpenAgreement && !this.queryData.agreementCode){
                            this.$message({
                                message: "请选择采购协议!"
                            });
                            return;
                        }
                        if (this.queryData.purchaseBillDetailVoList.length == 0) {
                            this.$message({
                                message: "请添加一个商品!"
                            });
                            return;
                        }
                        let purchaseList  = this.queryData.purchaseBillDetailVoList;
                        let flag =true;
                        for(let item of purchaseList) {
                            if(typeof(item.amount)=="number"){
                                item.amount = item.amount.toString();
                            }
                            if(!item.purUnitUid){
                                this.$message("请选择采购单位");
                                flag = false
                                break;
                            }
                            if(!item.purPrice){
                                this.$message("请填写采购成本");
                                flag = false
                                break;
                            }
                            if(!item.purCount){
                                this.$message("请填写采购数量");
                                flag = false
                                break;
                            }
                            if(!item.taxRate){
                                this.$message("请填写税率");
                                flag = false
                                break;
                            }
                            if(!item.amount){
                                this.$message("请写含税金额");
                                flag = false
                                break;
                            }
                        }
                        if(flag){
                            if (this.routeQuery.type == 1) {
                                this.purchaseSave(this.queryData);
                            }else{
                                this.purchaseUpdate(this.queryData);
                            }
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
                    path: "/retail/procurement/purchaseNote/list",
                });

            },
            handleDialogEvent(name) {
                this.$refs[name].handleDialog(true);
            },
            selectedGoodsDialogCallBack(value) {
                console.log(value);
                if (value.btnType == 1) {
                    if (value.data.length > 0) {
                        this.purchasePurchaseMer({flag: 0, purchaseMerVoList: value.data});
                    } else {

                    }

                } else {
                }
            },
            //去重
            unRepeat(arr) {
                let hash = {};
                return arr.reduce((item, next) => {
                    if (!hash[next.skuCode]) {
                        hash[next.skuCode] = true;
                        item.push(next);
                    }
                    return item;
                }, []);
            },
            // 选泽门店回调
            onCinemalSumit(val = []) {
                if (val.length > 0) {
                    this.queryData.cinemaName =  val[0].cinemaName || val[0].name;
                    this.queryData.cinemaUid = val[0].cinemaUid  || val[0].uid;
                } else {
                    this.queryData.cinemaName = "";
                    this.queryData.cinemaUid = "";
                }
                console.log(this.queryData);
            },
            changeOpenAgreement(value) {
                this.onAgreementSumit([]);
            },
            // 选泽采购协议
            onAgreementSumit(val = []) {
                if (val.length > 0) {
                    this.queryData.billType = "1";
                    this.queryData.supName = val[0].supName;
                    this.queryData.agreementCode = val[0].code;
                    this.queryData.agreementName = val[0].name;
                    this.queryData.agreementUid = val[0].uid;
                    this.queryData.beginTime = val[0].beginTime;
                    this.queryData.finishTime = val[0].finishTime;
                    this.agreementGet({uid: val[0].uid})
                } else {
                    this.queryData.billType = "0";
                    this.queryData.supName = "";
                    this.queryData.agreementCode = "";
                    this.queryData.agreementName = "";
                    this.queryData.agreementUid = "";
                    this.queryData.beginTime = "";
                    this.queryData.finishTime = "";
                    this.queryData.purchaseBillDetailVoList = []
                }
                console.log(this.queryData);
            },
            // 查看协议单
            agreementGet(param) {
                this.$cimList.procurement.agreementGet(param).then(resData => {
                    if (resData.code == 200) {
                        this.queryData.purchaseBillDetailVoList = resData.data.agreementDetailList.map(item => {
                            if (item.purCount === undefined) {
                                item.purCount = null;
                            }
                            if (item.purPrice === undefined) {
                                item.purPrice = null;
                            }
                            if (!item.amount === undefined) {
                                item.amount = null;
                            }
                            return item
                        })
                    }
                });
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
                console.log(this.queryData);
            },
            inputEvent(value,row,key) {
                console.log(value,row,key)
                row[key] = value;
                if (key == "purCount" || key == "purPrice") {
                    row.amount =  row.purCount * row.purPrice
                }
                if(key =="amount"){
                    row.purPrice =  (row.amount/row.purCount).toFixed(2)
                }
            },
            //计算成本
            calculateCost(row, item) {
                switch (item.key) {
                    case "excludingTaxCost":
                        // 不含税采购成本=采购成本-采购成本*税率
                        if (row.purPrice && row.taxRate) {
                            return row[item.key] =
                                (row.purPrice - (row.purPrice * row.taxRate) / 100).toFixed(2);
                        } else {
                            return "";
                        }
                        break;
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
            // 表格表头
            tableColumn() {
                return [
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
                        label: "采购单位",
                        key: "purUnitUid",
                        selsect: true
                    },
                    {
                        label: "采购数量",
                        key: "purCount",
                        edit: row => {
                            return true
                        }
                    },
                    {
                        label: "采购成本(元)",
                        key: "purPrice",
                        edit: row => {
                            if (this.routeQuery.type == 1) {
                                if (this.queryData.billType == 1) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return false;
                            }
                        }
                    },
                    {
                        label: "税率(%)",
                        key: "taxRate",
                        edit: row => {
                            if (this.routeQuery.type == 1) {
                                if (this.queryData.billType == 1) {
                                    return false;
                                } else {
                                    return true;
                                }
                            } else {
                                return false;
                            }
                        }
                    },
                    {
                        label: "含税金额(元)",
                        key: "amount",
                        edit: row => {
                            if (this.routeQuery.type == 1) {
                                if (this.queryData.billType == 1) {
                                    return false;
                                } else {
                                    return true;
                                }
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
                ]
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
            suppliersDialog,
            agreementDialog,
            selectedGoods
        }
    };
</script>

<style lang="scss">
    @import "../../../../assets/css/common.scss";
    @import "../../../../assets/css/element-common.scss";
    .purchase-note-common {
       .text-right{
           float: right;
           margin-bottom: 20px;
       }
    }

</style>