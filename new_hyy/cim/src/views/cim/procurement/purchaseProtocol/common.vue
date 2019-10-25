<template>
    <div class="content purchase-protocol-common">
<!--        <div class="breadcrumb">-->
<!--            <el-breadcrumb separator-class="el-icon-arrow-right">-->
        <!--                <el-breadcrumb-item>协议管理</el-breadcrumb-item>-->
        <!--                <el-breadcrumb-item :to="{ path: '/retail/procurement/purchaseProtocol/list' }">协议协议管理-->
<!--                </el-breadcrumb-item>-->
        <!--                <el-breadcrumb-item>{{typeText}}协议协议</el-breadcrumb-item>-->
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
                            <el-col :span="10">
                                <el-form-item label="协议编码">
                                    <span>{{queryData.code}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item
                                        label="协议名称"
                                        prop="name"
                                        :rules="[{ required: routeQuery.type==3 ? false : true, message: '协议名称不能为空',trigger: 'change' }]"
                                >
                                    <span v-if="routeQuery.type==3">{{queryData.name}}</span>
                                    <el-input v-else v-model="queryData.name" placeholder="请输入"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item
                                        label="供应商名称"
                                        class="select-input"
                                        prop="supName"
                                        :rules="[{ required: routeQuery.type==3 ? false : true, message: '供应商名称不能为空',trigger: 'change' }]"
                                >
                                    <span v-if="routeQuery.type==3">{{queryData.supName}}</span>
                                    <div v-else>
                                        <el-input
                                                v-model="queryData.supName"
                                                clearable
                                                @clear="onSupplierSumit()"
                                                @focus="handleDialogEvent('refSuppliersDialog')"
                                                placeholder="请选择供应商"
                                        ></el-input>
                                        <el-button
                                                type="primary"
                                                plain
                                                @click="handleDialogEvent('refSuppliersDialog')"
                                        >选择</el-button>
                                    </div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="状态" prop="status">
                                    <span v-if="routeQuery.type==3">{{queryData.status == 1 ? '启用':'停用'}}</span>
                                    <el-radio-group v-else v-model="queryData.status">
                                        <el-radio :label="1">启用</el-radio>
                                        <el-radio :label="0">停用</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="10">
                                <el-form-item
                                        prop="cooperationTime"
                                        label="有效期"
                                        class="cooperation-time"
                                        :rules="[{ required:  routeQuery.type==3 ? false : true, message: '有效期不能为空',trigger: 'change' }]"
                                >
                                    <span v-if="routeQuery.type==3">{{queryData.beginTime +'至' + queryData.finishTime}}</span>
                                    <el-date-picker
                                            v-else
                                            class="basic-input"
                                            v-model="queryData.cooperationTime"
                                            type="daterange"
                                            :picker-options="pickerOptions"
                                            value-format="yyyy-MM-dd"
                                            placeholder="选择日期"
                                    ></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="10">
                                <el-form-item label="附件">
                                    <div v-if="routeQuery.type==3">
                                        <a target="_Blank" :href="queryData.fileUrl" :download="queryData.fileName" v-if="queryData.fileName">
                                            <span>点击下载: </span>
                                            <span class="download">{{queryData.fileName}}</span>
                                        </a>
                                    </div>
                                    <img-upload v-else :url="queryData.fileUrl" :fileName="queryData.fileName" @on-success="successAvatarUpload" type="accessory" @on-successUpload="onSuccessUpload"></img-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-collapse-item>
                <!-- 基础信息 end-->

                <!-- 供应商品 start-->
                <el-collapse-item title="供应商品" name="2">
                    <div>
                        <div class="text-right" v-if="routeQuery.type!=3">
                            <el-button @click="handleAddGood" type="primary" plain>添加商品</el-button>
                        </div>
                        <el-table :data="queryData.agreementDetailList" stripe>
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
                                                    type="number"
                                                    :value="row[item.key]"
                                                    @input="inputEvent($event,row,item.key)"
                                            ></el-input>
                                        </div>
                                        <div v-else-if="item.selsect && row.purUnitVoList">
                                            <el-select
                                                    v-model="row[item.key]"
                                                    @change="changePurUnitVoList($event,row,item.key)"
                                            >
                                                <el-option
                                                        v-for="unitItem in row.purUnitVoList"
                                                        :key="unitItem.id"
                                                        :label="unitItem.name"
                                                        :value="unitItem.unitUid"
                                                ></el-option>
                                            </el-select>
                                        </div>
                                        <span v-else>{{row[item.key]}}</span>
                                    </div>
                                    <div v-else>
                                        <div v-if="item.selsect"></div>
                                        <span v-else>{{row[item.key]}}</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" style="width:180px;" v-if="routeQuery.type!=3">
                                <template slot-scope="{row,$index}">
                                    <el-button type="text" size="small" @click.stop="handleOperateEvent(row,$index)">删除
                                    </el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-collapse-item>
                <!-- 供应商品 end-->
            </el-collapse>

            <!-- 选择影院弹窗 -->
<!--            <cinemal-dialog-->
<!--                    ref="refCinemalDialog"-->
<!--                    @onSumit="onCinemalSumit"-->
<!--                    :dialogFeedbackData="[{cinemaUid:queryData.cinemaUid,cinemaName:queryData.cinemaName}]"-->
<!--            ></cinemal-dialog>-->



            <!-- 选择供应商弹窗 -->
            <suppliers-dialog ref="refSuppliersDialog" @onSumit="onSupplierSumit"></suppliers-dialog>
            <!-- 选择商品 -->
            <selected-goods
                    :dialogVisible.sync="selectedGoodsDialogVisible"
                    :merType="'1,5'"
                    :canSale="'-1'"
                    @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
            ></selected-goods>

            <div class="submit-box" v-if="routeQuery.type!=3">
                <el-button type="primary" @click="handleSubmit('1')" :loading="submitLoading">保存</el-button>
                <el-button @click="handleCancel">取 消</el-button>
            </div>
            <div v-else class="submit-box">
                <el-button @click="handleCancel">关 闭</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    import mixin from "cimSrc/mixins/cim/paginationConfig.js";
    import cinemalDialog from "cimSrc/components/cinemalDialog/cinemaDialog.vue";
    import suppliersDialog from "cimSrc/components/suppliersDialog/suppliersDialog.vue";
    import selectedGoods from "cimSrc/dialogs/cimSelectedGoods/index.vue";
    import imgUpload from "cimSrc/components/imgUpload/imgUpload.vue";
    export default {
        name: "common",
        mixins: [mixin],
        data() {
            return {
                fileList:[],
                selectedGoodsDialogVisible: false,
                //查询数据
                queryData: {
                    //基础信息
                    code: "", //	协议编码
                    name: "",//协议名称
                    agreementDetailList: [], //协议商品明细集合
                    cooperationTime: [], //合作时间
                    beginTime: '',
                    finishTime: '',
                    status: 1,
                    // fileUrl: "//onetitemdev.oss-cn-zhangjiakou.aliyuncs.com/picture/goods/GOODS_20190704145410.jpg",
                    fileUrl: "",
                    fileName: "",
                    supName: "", //供应商名称
                    supUid: "", //供应商id
                },
                total: 0,
                reviewRecordTableColumn: [
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
                    }
                ],
                computAmount: "",
                submitLoading: false,
                activeNames: ["1", "2", "3"],
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;//当天之后的时间可选
                    }
                },
            };
        },
        activated() {
            // this.init();
        },
        mounted() {
            this.init();
        },

        methods: {
            init() {
                if (this.routeQuery.type == 1) {
                    this.purchaseCode();
                } else {
                    this.purchaseGet({uid: this.routeMerData.uid});
                }
            },
            // 生成协议编码
            purchaseCode(param) {
                this.$cimList.procurement.agreementCreateCode(param).then(resData => {
                    if (resData.code == 200) {
                        this.queryData.code = resData.data;
                    }
                });
            },
            //添加协议单商品明细
            purchasePurchaseMer(param) {
                this.$cimList.procurement.purchasePurchaseMer(param).then(resData => {
                    if (resData.code == 200) {
                        this.queryData.agreementDetailList.push(
                            ...resData.data.map(item => {
                                item.merUid = item.uid;
                                item.baseUnitUid = item.unitUid;
                                item.purCostPrice = null;
                                return item;
                            })
                        );
                        this.queryData.agreementDetailList = this.unRepeat(this.queryData.agreementDetailList)
                    }
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
            // 新增协议单
            agreementSave(param) {
                this.submitLoading = true;
                this.$cimList.procurement
                    .agreementSave(param)
                    .then(resData => {
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
                    })
                    .catch(() => {
                        this.submitLoading = false;
                    });
            },
            // 修改协议单
            agreementUpdate(param) {
                this.submitLoading = true;
                this.$cimList.procurement
                    .agreementUpdate(param)
                    .then(resData => {
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
                    })
                    .catch(() => {
                        this.submitLoading = false;
                    });
            },
            // 查看协议单
            purchaseGet(param) {
                this.$cimList.procurement.agreementGet(param).then(resData => {
                    if (resData.code == 200) {
                        this.queryData = resData.data;
                        this.$set(this.queryData, 'cooperationTime', [this.queryData.beginTime,this.queryData.finishTime])
                    }
                });
            },
            changePurUnitVoList(value, row, key) {
                row.purUnitVoList.forEach(item => {
                    if (value == item.unitUid) {
                        row.purUnitName = item.name
                        row.purUnitRatio = item.purUnitRatio
                    }
                })
            },
            //图片上传成功回调
            successAvatarUpload(response) {
                this.queryData.fileUrl = response;
            },
            onSuccessUpload(response) {
                this.queryData.fileName = response.fileName;
            },
            inputEvent(value, row, key) {
                // console.log(value, row, key)
                // 通过正则过滤小数点后两位
                row[key] = value.replace(/^(.*\..{4}).*$/,"$1");
            },
            handleAddGood() {
                this.selectedGoodsDialogVisible = true;
            },
            handleOperateEvent(row,index) {
                this.$confirm(
                    "<i class='el-icon-circle-close'></i><span>确定删除吗?</span>",
                    {
                        customClass: "retail-style",
                        dangerouslyUseHTMLString: true,
                        cancelButtonText: "取消",
                        confirmButtonText: "确定",
                        center: true
                    }
                )
                    .then(() => {
                        this.queryData.agreementDetailList = this.queryData.agreementDetailList.filter(
                            (item,listIndex) => {
                                return listIndex != index;
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
                if (this.queryData.cooperationTime.length > 0) {
                    this.queryData.beginTime = this.queryData.cooperationTime[0];
                    this.queryData.finishTime = this.queryData.cooperationTime[1];
                } else {
                    this.queryData.beginTime = "";
                    this.queryData.finishTime = "";
                }
                // console.log(this.queryData);
                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {
                        if (this.queryData.agreementDetailList.length == 0) {
                            this.$message({
                                message: "请添加一个商品!"
                            });
                            return;
                        }
                        let purchaseList = this.queryData.agreementDetailList;
                        let flag = true;
                        for (let item of purchaseList) {
                            if (typeof item.amount == "number") {
                                item.amount = item.amount.toString();
                            }
                            if (typeof item.taxRate == "number") {
                                item.taxRate = item.taxRate.toString();
                            }
                            if (!item.purCostPrice) {
                                this.$message("请填写采购成本!");
                                flag = false;
                                break;
                            }else{
                                if(item.purCostPrice<0){
                                    this.$message("采购成本不能小于0!");
                                    flag = false;
                                    break;
                                }
                            }
                            if (!item.taxRate) {
                                this.$message("请填写税率!");
                                flag = false;
                                break;
                            }else{
                                if(item.taxRate<0){
                                    this.$message("税率不能小于0!");
                                    flag = false;
                                    break;
                                }
                            }
                            if (!item.purUnitUid) {
                                this.$message("请选择采购单位!");
                                flag = false;
                                break;
                            }
                        }
                        if (flag) {
                            if (this.routeQuery.type == 1) {
                                this.agreementSave(this.queryData);
                            } else {
                                this.agreementUpdate(this.queryData);
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
                    path: "/retail/procurement/purchaseProtocol/list",
                });
            },
            handleDialogEvent(name) {
                this.$refs[name].handleDialog(true);
            },
            selectedGoodsDialogCallBack(value) {
                if (value.btnType == 1) {
                    if (value.data.length > 0) {
                        this.purchasePurchaseMer({flag: 1, purchaseMerVoList: value.data});
                    } else {
                    }
                } else {
                }
            },
            // 选泽门店回调
            onCinemalSumit(val = []) {
                if (val.length > 0) {
                    this.queryData.cinemaName = val[0].cinemaName || val[0].name;
                    this.queryData.cinemaUid = val[0].cinemaUid || val[0].uid;
                } else {
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
            // 表格表头
            tableColumn(){
                let  tempTableColumn = [
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
                        selsect: true
                    },
                    {
                        label: "采购成本(元)",
                        key: "purCostPrice",
                        edit: row => {
                            return true;
                        }
                    },
                    {
                        label: "税率(%)",
                        key: "taxRate",
                        edit: row => {
                            return true;
                        }
                    },
                ]
                if(this.routeQuery.type == 3){
                    tempTableColumn.splice(3, 1, {
                        label: "采购单位",
                        key:  "purUnitName",
                    });
                }else{
                    tempTableColumn.splice(3, 1, {
                        label: "采购单位",
                        key:  "purUnitUid",
                        selsect: true
                    });
                }
                return tempTableColumn;
            },

        },
        components: {
            cinemalDialog,
            suppliersDialog,
            selectedGoods,
            imgUpload
        }
    };
</script>

<style lang="scss">
    @import "../../../../assets/css/common.scss";
    @import "../../../../assets/css/element-common.scss";
    .purchase-protocol-common {
        .el-range-editor{
            width: 298px;
        }
        .text-right {
            float: right;
            margin-bottom: 20px;
        }
        .download {
            color: #3B74FF;
        }
        .remark-input {
            margin-top: 20px;
            width: 400px;
        }
    }
</style>