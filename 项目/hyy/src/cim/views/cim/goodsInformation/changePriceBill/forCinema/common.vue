<template>
    <div class="content" id="for-cinema-common">
        <!--        <div class="breadcrumb">-->
        <!--            <el-breadcrumb separator-class="el-icon-arrow-right">-->
        <!--                <el-breadcrumb-item>采购管理</el-breadcrumb-item>-->
        <!--                <el-breadcrumb-item :to="{ path: '/retail/priceBill/purchaseNote/list' }">调价单管理</el-breadcrumb-item>-->
        <!--                <el-breadcrumb-item>{{typeText}}调价单</el-breadcrumb-item>-->
        <!--            </el-breadcrumb>-->
        <!--        </div>-->
        <div class="tittle"></div>
        <el-form
                :inline="true"
                ref="ruleForm"
                :model="queryData"
                label-position="left"
                label-width="80px"
                label-suffix="："
        >
            <el-collapse v-model="activeNames">
                <!-- 基础信息 start-->
                <el-collapse-item title="基础信息" name="1">
                    <div>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="调价单号">
                                    <span>{{queryData.billCode}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="调整方式">
                                    <span>（指定商品）调整门店售价</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="生效日期" class="select-input" prop="startTime"
                                              :rules="[{ required: routeQuery.type==1 ? true:  false, message: '生效日期不能为空',trigger: 'change' }]">
                                    <span v-if="routeQuery.type==2 || routeQuery.type==3">
                                        {{queryData.startTime}}
                                    </span>
                                    <el-date-picker
                                            v-else
                                            v-model="queryData.startTime"
                                            type="date"
                                            :disabled="routeQuery.type!=1 ? true : false"
                                            value-format="yyyy-MM-dd"
                                            placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="routeQuery.type!=1">
                            <el-col :span="8" v-if="queryData.billVoTime">
                                <el-form-item label="制单日期">
                                    <span>{{queryData.billVoTime}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8" v-if="queryData.billUserName">
                                <el-form-item label="制单员">
                                    <span>{{queryData.billUserName}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="routeQuery.type!=1">
                            <el-col :span="8">
                                <el-form-item label="生效状态">
                                    <span>{{formatStatus}}</span>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="审核状态">
                                    <span>{{approvalStart(1)}}</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                </el-collapse-item>
                <!-- 基础信息 end-->

                <!-- 商品调价清单 start-->
                <el-collapse-item title="商品调价清单" name="2">
                    <div>
                        <div class="bill-group clearfix">
                            <div class="text-right" v-if="routeQuery.type==1">
                                <el-button @click="handleAddGood" type="primary" plain>添加商品</el-button>
                            </div>
                        </div>
                        <div class="recipe-box clearfix" v-for="(merItem,merGroupIndex) in queryData.billMerVoList"
                             :key="merGroupIndex">
                            <div class="right" v-if="routeQuery.type==1">
                                <i class="el-icon-close right delete-recipe-group"
                                   @click.stop="handleDleteRecipeGroup(merItem,merGroupIndex)"
                                ></i>
                            </div>
                            <el-table :data="merItem.merTableDatas" stripe :row-key="getRowKey">
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
                                                        v-model="row[item.key]"
                                                ></el-input>
                                            </div>
                                            <div v-else>
                                                <span>{{row[item.key]}}</span>
                                            </div>
                                        </div>
                                        <div v-else>
                                            <span>{{row[item.key]}}</span>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div v-if="!merItem.init">
                                <div class="bill-group clearfix" v-if="routeQuery.type!=3">
                                    <div class="text-right">
                                        <el-button
                                                @click="handleDialogEvent('refCinemalDialog',{data:merItem,index:merGroupIndex})"
                                                type="primary" plain v-if="routeQuery.type==1">
                                            调价门店
                                        </el-button>
                                        <el-button @click="handleBatchDialog(merGroupIndex)" type="primary" plain>批量调价
                                        </el-button>
                                    </div>
                                </div>
                                <div class="stores-price">
                                    需调价门店
                                </div>
                                <el-table :data="merItem.billCinemaMerVoList" stripe
                                          @selection-change="handleSelectedCinemal">
                                    <el-table-column
                                            v-if="routeQuery.type!=3"
                                            type="selection"
                                            width="40"
                                            reserve-selection
                                    ></el-table-column>
                                    <el-table-column
                                            v-for="item in cinemaTableColumn"
                                            :key="item.key"
                                            :prop="item.key"
                                            :label="item.label"
                                            :width="item.width"
                                            :formatter="item.formatter"
                                    >
                                        <template slot-scope="{row}" name="header">
                                            <div v-if="routeQuery.type!=3">
                                                <div v-if="item.edit && item.edit(row)">
                                                    <el-input size="small" type="number"
                                                              v-model="row[item.key]"></el-input>
                                                </div>
                                                <div v-else>
                                                    <span>{{row[item.key]}}</span>
                                                </div>
                                            </div>
                                            <div v-else>
                                                <span>{{row[item.key]}}</span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" style="width:180px;" v-if="routeQuery.type==1">
                                        <template slot-scope="{row}">
                                            <el-button type="text" size="small"
                                                       @click.stop="handleOperateEvent(row,merGroupIndex)">删除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                </el-collapse-item>
                <!-- 商品调价清单 end-->

                <!--  审批流程-->
                <el-collapse-item title="审批流程" name="3" v-if="routeQuery.type==3">
                    <el-form-item label="审批流程名称" label-width="110px">
                        <span>调价单审核</span>
                    </el-form-item>
                    <el-steps :space="200" :active="approvalActive" finish-status="success">
                        <el-step :title="approvalStart()"></el-step>
                        <el-step :title="item.auditMan" :key="item.auditTime"
                                 v-for="item in queryData.reviewRecordList"></el-step>
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
            <el-dialog
                    width="300px"
                    class="batch-price-dialog"
                    title="批量调价"
                    :visible="batchDialogVisible"
                    @close="batchDialogVisible=false"
            >
                <el-form
                        :model="batchData"
                        label-width="90px"
                        ref="editDataForm"
                        label-suffix="："
                >
                    <el-form-item label="调整售价为" prop="price" class="batch-price-inp">
                        <el-input v-model="batchData.price" type="number" placeholder="请输入"></el-input>
                    </el-form-item>
                    <span class="batch-unit">元</span>
                </el-form>
                <span slot="footer">
              <el-button type="primary" @click="handleBatchPriceSubmit" :loading="exchSubmitLoading">确 定</el-button>
              <el-button @click="batchDialogVisible=false">取 消</el-button>
            </span>
            </el-dialog>

            <!-- 选择影院弹窗 -->
            <cinemal-dialog ref="refCinemalDialog" @onSumit="onCinemalSumit" multiple
                            :dialogFeedbackData="selectedCinemaCheckedKeys"></cinemal-dialog>

            <!-- 选择商品 -->
            <selected-goods
                    :dialogVisible.sync="selectedGoodsDialogVisible"
                    :cinemaUid="queryData.cinemaUid"
                    :autoClose="false"
                    :dialogFeedbackData="selectedGoodsCheckedKeys"
                    @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
            ></selected-goods>

            <div class="submit-box" v-if="routeQuery.type!=3">
                <el-button type="primary" @click="handleSubmit('1')" :loading="submitLoading">保存并提交</el-button>
                <!--                <el-button type="primary" @click="handleSubmit('0')" :loading="submitLoading">保存为草稿</el-button>-->
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

    export default {
        name: "common",
        mixins: [mixin],
        data() {
            return {
                selectedGoodsDialogVisible: false,
                batchDialogVisible: false,
                //查询数据
                queryData: {
                    billCode: "", //单据编号
                    billType: 2, //单据类型,0无协议,1有协议
                    billMerVoList: [{merTableDatas: [],init:true}], //商品调价清单集合

                    isReview: 1,
                    startTime: "",
                    remark: "",
                    tag: 1 //保存标志,0草稿,1保存并提交
                },
                batchData: {price: ""},
                exchSubmitLoading: false,
                isOpenAgreement: false,
                currentMerGroupIndex: 0, //当前选择的商品组索引
                currentCinemaGroupIndex: 0, //当前选择的门店组索引
                selectCinemals: {},
                total: 0,
                // 表格表头
                tableColumn: [
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
                    // {
                    //     label: "商品规格",
                    //     key: "merSpec"
                    // },
                    {
                        label: "速记代码",
                        key: "shorthandCode",
                    },
                    {
                        label: "售价（元）",
                        key: "price",
                    },
                ],
                //门店表头
                cinemaTableColumn: [
                    {
                        label: "门店名称",
                        key: "cinemaName"
                    },
                    {
                        label: "门店编码",
                        key: "cinemaCode"
                    },
                    {
                        label: "调整售价为（元）",
                        key: "adjustPrice",
                        edit:()=>{
                            return true;
                        },
                        width:200
                    },
                ],
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
                    },
                ],
                computAmount: '',
                submitLoading: false,
                activeNames: ['1', '2', '3', '4']
            };
        },
        created() {

        },
        mounted() {
            this.init();
        },

        methods: {
            init() {
                if (this.routeQuery.type == 1) {
                    this.adjBillCinMerCode();
                } else {
                    this.adjBillCinMerGet({uid: this.routeMerData.uid});
                }
                // console.log(this.routeQuery,"this.routeQuery");
                // let lastLevel = this.typeText + '调价单';
                // this.$route.meta.title = lastLevel;
                // this.$store.commit('getLevel', lastLevel);
            },
            // 生成采购编码
            adjBillCinMerCode(param) {
                this.$cimList.priceBill.adjBillCinMerCode(param).then(resData => {
                    if (resData.code == 200) {
                        this.queryData.billCode = resData.data;
                    }
                });
            },
            // 新增调价单
            adjBillCinMerSave(param) {
                this.submitLoading = true;
                this.$cimList.priceBill.adjBillCinMerSave(param).then(resData => {
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
                }).catch(() => {
                    this.submitLoading = false;
                })
            },
            // 修改调价单
            adjBillCinMerUpdate(param) {
                this.submitLoading = true;
                this.$cimList.priceBill.adjBillCinMerUpdate(param).then(resData => {
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
                }).catch(() => {
                    this.submitLoading = false;
                })
            },
            // 查看调价单
            adjBillCinMerGet(param) {
                this.$cimList.priceBill.adjBillCinMerGet(param).then(resData => {
                    if (resData.code == 200) {
                        resData.data.billMerVoList = resData.data.billMerVoList.map((item,index) => {
                            this.$set(item,"price",item.standardPrice);
                            item.merTableDatas = JSON.parse(JSON.stringify([item]));
                            item.billCinemaMerVoList.map((cinemaItem,cinemaIndex) => {
                                cinemaItem.merIndex = cinemaIndex;
                                return item
                            })
                            return item
                        })
                        this.queryData = resData.data;
                        // console.log( this.queryData,"查询数据")
                    } else {
                        this.$message({
                            message: resData.msg
                        });
                    }
                }).catch(() => {

                })
            },
            handleAddGood() {
                this.selectedGoodsDialogVisible = true
            },

            handleOperateEvent(row,merGroupIndex) {
                this.$confirm("<i class='el-icon-circle-close'></i><span>确定删除吗?</span>", {
                    customClass: "retail-style",
                    dangerouslyUseHTMLString: true,
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    center: true,
                })
                    .then(() => {
                        this.queryData.billMerVoList[merGroupIndex].billCinemaMerVoList =
                            this.queryData.billMerVoList[merGroupIndex].billCinemaMerVoList.filter(
                                item => {
                                    return item.cinemaUid != row.cinemaUid;
                                }
                            );
                    })
                    .catch(() => {
                    });
            },
            //0草稿,1保存并提交
            handleSubmit(type) {
                if(this.queryData.billMerVoList.length==0 || this.queryData.billMerVoList[0].init){
                    this.$message("请添加商品！");
                    return;
                }
                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {
                        let flag =true;
                        for(let item of this.queryData.billMerVoList) {
                            if(!item.billCinemaMerVoList || item.billCinemaMerVoList.length==0){
                                this.$message("请选择调价门店!");
                                flag = false
                                break;
                            }
                            for(let billItem of item.billCinemaMerVoList) {
                                if(!billItem.adjustPrice){
                                    this.$message("调整售价不能为空!");
                                    flag = false
                                    break;
                                }
                                if(billItem.adjustPrice<=0){
                                    this.$message("调整售价必须大于0!");
                                    flag = false
                                    break;
                                }
                            }
                        }
                        if(flag){
                            if (this.routeQuery.type == 1) {
                                this.adjBillCinMerSave(this.queryData);
                            } else {
                                this.adjBillCinMerUpdate(this.queryData);
                            }
                        }
                    } else {
                        this.$message("带*号的为必填项，请填写");
                        return false;
                    }
                });
            },
            //选择门店回调
            handleSelectedCinemal(selection) {
                if (selection.length > 0) {
                    this.currentCinemaGroupIndex = selection[0].merIndex;
                    this.selectCinemals[this.currentCinemaGroupIndex] = selection
                } else {
                    this.selectCinemals[this.currentCinemaGroupIndex] = [];
                }
            },
            handleBatchDialog(index) {
                this.currentMerGroupIndex = index;
                this.batchData.price = "";
                if (this.selectCinemals.hasOwnProperty(index) && this.selectCinemals[index].length > 0) {
                    this.batchDialogVisible = true;
                } else {
                    this.$message("请选择对应门店");
                }
            },
            //批量调价确定
            handleBatchPriceSubmit() {
                this.queryData.billMerVoList[this.currentMerGroupIndex].billCinemaMerVoList.map((item, index) => {
                    this.selectCinemals[this.currentMerGroupIndex].map(selectItem => {
                        if (item.cinemaUid == selectItem.cinemaUid) {
                            this.$set(item, "adjustPrice", this.batchData.price)
                        }
                    })

                })
                this.batchDialogVisible = false;
            },
            handleCancel() {
                this.$store.commit("tagNav/removeTagNav", {
                    name: this.$route.name,
                    path: this.$route.path,
                    title: this.$route.meta.title,
                    query: this.$route.query
                })
                this.$router.push({
                    path: "/retail/changePriceBill/list",
                });

            },
            handleDialogEvent(name, param) {
                this.$refs[name].handleDialog(true);
                this.currentMerGroupIndex = param.index
            },
            //选择商品回调
            selectedGoodsDialogCallBack(value) {
                if (value.btnType == 1) {
                    if (value.data.length > 0) {
                        if(value.data.length>3){
                            this.$message("最多只允许添加3个商品!");
                            return
                        }
                        var tempArr = value.data.map(item => {
                            item.merTableDatas = JSON.parse(JSON.stringify([item]));
                            item.standardPrice = item.price;
                            item.merUid = item.merUid || item.uid;
                            return item
                        })
                        if(this.queryData.billMerVoList.length>0){
                            if(this.queryData.billMerVoList[0].init){
                                this.queryData.billMerVoList = [];
                            }
                        }
                        this.queryData.billMerVoList= tempArr;
                        this.queryData.billMerVoList = this.unRepeat(this.queryData.billMerVoList);

                    } else {

                    }
                    this.selectedGoodsDialogVisible = false;
                } else {
                }
                // console.log(this.queryData.billMerVoList, "商品清单");
            },
            // 选泽门店回调
            onCinemalSumit(val = [], type) {
                // console.log(val, " 选泽门店回调", type);
                if (val.length > 0) {
                    let tempArr = val.map((item) => {
                        item.cinemaCode = item.code;
                        item.merIndex = this.currentMerGroupIndex;
                        item.cinemaName = item.cinemaName || item.name;
                        return item
                    })
                    this.queryData.billMerVoList.map((item,index)=>{
                        if(index== this.currentMerGroupIndex){
                            this.$set(item,"billCinemaMerVoList",tempArr)
                        }
                    })
                } else {
                    // this.setCinema()
                }
                // console.log(this.queryData, "门店数据");
            },
            setCinema(val = []) {
                if (val.length > 0) {
                    this.queryData.cinemaName = val[0].cinemaName || val[0].name;
                    this.queryData.cinemaUid = val[0].cinemaUid || val[0].uid;
                } else {
                    this.queryData.cinemaName = "";
                    this.queryData.cinemaUid = "";
                }
            },
            handleDleteRecipeGroup(row, index) {
                this.queryData.billMerVoList = this.queryData.billMerVoList.filter((item, merIndex) => {
                    return merIndex != index
                })
                // console.log(this.queryData.billMerVoList)
            },
            //去重
            unRepeat(arr) {
                let hash = {};
                return arr.reduce((item, next) => {
                    if (!hash[next.skuUid || next.merCode]) {
                        hash[next.skuUid || next.merCode] = true;
                        item.push(next);
                    }
                    return item;
                }, []);
            },
            approvalStart(type) {
                let result = "";
                switch (this.queryData.approvalStatus) {
                    case 0:
                        result = "未审核";
                        break;
                    case 1:
                        result = "待审核";
                        break;
                    case 2:
                        if (type == 1) {
                            result = "审核通过";
                        } else {
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
            getRowKey(row) {
                //套餐商品没有skuCode
                if (row.skuUid) {
                    return row.skuUid;
                } else {
                    return row.merUid || row.uid || row.merCode;
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
            selectedGoodsCheckedKeys(){
                return this.queryData.billMerVoList.filter(item=>{
                    return  !item.init
                })
            },
            selectedCinemaCheckedKeys(){
                let tempArr = [];
                if(this.queryData.billMerVoList.length>0 && this.queryData.billMerVoList[this.currentMerGroupIndex].billCinemaMerVoList){
                    tempArr = this.queryData.billMerVoList[this.currentMerGroupIndex].billCinemaMerVoList.map(item=>{
                        return {
                            cinemaUid:item.cinemaUid,
                            cinemaName:item.cinemaName,
                        }
                    })
                }

                return tempArr
            },
            typeText() {
                //1新建，2修改，3查看
                switch (this.routeQuery.type) {
                    case "1":
                        return "新建";
                        break;
                    case "2":
                        return "编辑";
                        break;
                    case "3":
                        return "查看";
                        break;
                }
            },
            formatStatus() {
                let result = "";
                switch (this.queryData.status) {
                    case 2:
                        result = "未生效";
                        break;
                    case 3:
                        result = "已生效";
                        break;
                }
                return result;
            },
            approvalActive() {
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
            selectedGoods
        }
    };
</script>

<style lang="scss">
    @import "../../../../../assets/css/common.scss";
    @import "../../../../../assets/css/element-common.scss";
    #for-cinema-common {
        .bill-group {
            padding-top: 10px;
            padding-bottom: 10px;
        }
        .recipe-box{
            margin-bottom: 20px;
        }
        .text-right {
            float: right;
        }

        .batch-price-inp {
            .el-form-item__content {
                margin-left: 0 !important;
            }

            .el-input__inner {
                width: 100px;
            }
        }
        .stores-price{
            margin: 10px 0;
            font-weight: 600;
        }
        .batch-unit {
            margin-top: 16px;
            display: inline-block;
        }
        .delete-recipe-group {
            font-size: 20px;
            cursor: pointer;
        }

    }

</style>