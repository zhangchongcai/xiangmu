<template>
    <div class="content" id="for-cinema-common">
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
                                    <span>（指定门店）调整商品售价</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <el-form-item label="生效日期" class="select-input" prop="adjustTime"
                                              :rules="[{ required: routeQuery.type ==1 ? true :false, message: '生效日期不能为空',trigger: 'change' }]">
                                    <span v-if="routeQuery.type!=1">
                                        {{queryData.adjustTime}}
                                    </span>
                                    <el-date-picker
                                            v-else
                                            v-model="queryData.adjustTime"
                                            type="date"
                                            value-format="yyyy-MM-dd"
                                            placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-form-item 
                                label="调价门店" 
                                class="select-input"
                                prop="cinemaName"
                                :rules="[{ required: routeQuery.type ==1 ? true :false, message: '选择调价门店',trigger: 'change' }]"
                                >
                                <template v-if="routeQuery.type=='1'">     
                                    <el-input
                                            v-model="queryData.cinemaName"
                                            clearable
                                            @clear="onCinemalSumit"
                                            @focus="selectCinemalDialog"
                                            placeholder="请选择门店"
                                    ></el-input>
                                    <el-button @click="selectCinemalDialog" type="primary cinemaSel-btn" plain>选择</el-button>
                                </template>
                                <template v-else>
                                    <div class="see-style">
                                        <span  class="c-type" @click="cinemaClick()">{{queryData.cinemaName}}</span>
                                        <span class="c-type" @click="cinemaClick()">...共{{this.suncinema}}家</span>
                                    </div>
                                </template>
                            </el-form-item>
                        </el-row>
                        <el-row v-if="routeQuery.type!=1">
                            <el-col :span="8" v-if="queryData.billTime">
                                <el-form-item label="制单日期">
                                    <span>{{queryData.billTime}}</span>
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
                                 <el-button @click="handleDel" type="primary" plain>批量删除</el-button>
                            </div>
                        </div>
                        <el-table :data="queryData.list"  @selection-change="handleselbtn" stripe>
                        <el-table-column
                        type="selection"
                        v-if="routeQuery.type!=3"
                        width="40">
                        </el-table-column>
                        <el-table-column
                            v-for="item in tableColumn"
                            :key="item.key"
                            :prop="item.key"
                            :label="item.label"
                            :formatter="item.formatter"
                        >
                            <template slot-scope="{row,$index}" name="header">
                            <div v-if="item.edit">
                                <el-input size="small" v-model="row[item.key]" placeholder @change="changeUnitEvent(row,$index)"></el-input>
                            </div>
                            <div v-else-if="item.selsect">
                                <el-select  v-model="row[item.key]">
                                <el-option key="0" label="瓶" value="0"></el-option>
                                <el-option key="1" label="箱" value="1"></el-option>
                                </el-select>
                            </div>
                            <div v-else>
                                <span>{{row[item.key]}}</span>
                            </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" style="width:180px;" v-if="routeQuery.type == 1">
                            <template slot-scope="{row,$index}">
                            <el-button type="text" size="small" @click.stop="handleOperateEvent(row,$index)">删除</el-button>
                            </template>
                        </el-table-column>
                        </el-table>
                    </div>
                </el-collapse-item>
                <!-- 商品调价清单 end-->

                <!--  审批流程-->
                <el-collapse-item title="审批流程" name="3" v-if="routeQuery.type==3">
                    <el-form-item label="审批流程名称" label-width="110px">
                        <span>商品调价单审核</span>
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
            <!-- 选择影院弹窗 -->
            <cinemal-dialog ref="refCinemalDialog" @onSumit="onCinemalSumit" multiple
                            :dialogFeedbackData="selectedCinemaCheckedKeys"></cinemal-dialog>
            <!-- 选择商品 -->
            <selected-goods
                    :dialogVisible.sync="selectedGoodsDialogVisible"
                    :cinemaUid="queryData.cinemaUid"
                    :dialogFeedbackData="selectedGoodsCheckedKeys"
                    @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
            ></selected-goods>
            <seecinemal-dialog
                 :dialogVisible.sync="dialogVisibleseecinema"
                 :needData="JSON.stringify(this.queryData.cinemaUids)"
                 >
            </seecinemal-dialog>
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
    import seecinemalDialog from "cim/components/seeCinemalDialog/seeCinemalDialog.vue";


    export default {
        name: "common",
        mixins: [mixin],
        data() {
            return {
                selPro:[],
                // 查看影院组件
                dialogVisibleseecinema:false,
                // 选择调价门店数量
                suncinema:"",
                // 多选影院名称
                selectedGoodsDialogVisible: false,
                batchDialogVisible: false,
                //查询数据
                queryData: {
                    cinemaName:"",
                    billCode: "", //单据编号
                    billType: 1, //单据类型,0无协议,1有协议
                    cinemaUids:[],
                    list:[],
                    adjustTime: "",
                    // tag: 1 //保存标志,0草稿,1保存并提交
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
                    {
                        label: "速记代码",
                        key: "shorthandCode",
                    },
                    {
                        label: "总部标准价（元）",
                        key: "standardPrice",
                    },
                    {
                        label: "调整售价为（元）",
                        key: "adjustPrice",
                        edit:true,
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
                    let data = JSON.parse(this.$route.query.data)
                    this.adjBillCinMerGet({uid: data.uid,billCode:data.billCode});
                }
                // console.log(this.$route);
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
                // 判断转出数量是否为数字
            changeUnitEvent(row,index){
            let check = /(^[1-9][0-9]{0,})|(^0)/g
            // let check = /(^[1-9][0-9]{0,})|^([0])|^([0]\.[0-9]{1,2})$|^([1-9][0-9]{0,}\.[0-9]{1,2})$/g
            if(!check.test(row.adjustPrice)){
                this.$message("调整售价只能输入数字,小数最多2位");
                row.adjustPrice = ""
            }
            },
            // 新增调价单
            adjBillCinMerSave(param) {
                this.submitLoading = true;
                this.$cimList.priceBill.adjustBillSave(param).then(resData => {
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
            selectCinemalDialog() {
                this.$refs.refCinemalDialog.handleDialog(true);
            },
            // 查看影院
            cinemaClick(){
                this.dialogVisibleseecinema = true
            },
            // 修改调价单
            adjBillCinMerUpdate(param) {
                this.submitLoading = true;
                this.$cimList.priceBill.adjustBillUpdate(param).then(resData => {
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
                this.$cimList.priceBill.adjustBillQueryAdjustInfo(param).then(resData => {
                    if (resData.code == 200) {
                        this.queryData = resData.data;
                        if(this.routeQuery.type == 3){
                            this.tableColumn.forEach((val)=>{
                                if(val.key == "adjustPrice"){
                                   val.edit = false
                                }
                            })
                            this.queryData.cinemaName = this.queryData.cinemaUids.map((cval)=>{
                                return cval.cinemaName
                            }).join(',')
                            this.suncinema = this.queryData.cinemaUids == null ? 0:this.queryData.cinemaUids.length
                        }else if(this.routeQuery.type == 2){
                            this.queryData.cinemaName = this.queryData.cinemaUids.map((cval)=>{
                                return cval.cinemaName
                            }).join(',')
                            this.suncinema = this.queryData.cinemaUids == null ? 0:this.queryData.cinemaUids.length
                        }

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

            handleOperateEvent(row,index) {
                this.$confirm("<i class='el-icon-circle-close'></i><span>确定删除吗?</span>", {
                    customClass: "retail-style",
                    dangerouslyUseHTMLString: true,
                    cancelButtonText: "取消",
                    confirmButtonText: "确定",
                    center: true,
                })
                    .then(() => {
                       this.queryData.list.splice(index, 1)
                    })
                    .catch(() => {
                    });
            },
            //0草稿,1保存并提交
            handleSubmit(type) {
                console.log(this.queryData);
                if(this.queryData.list.length==0){
                    this.$message("请添加商品！");
                    return;
                }
                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {
                        let newAvtive = {}
                        let dqActive = ""
                        this.queryData.list.some((val,newindex,arr)=>{
                            // /^([1-9][0-9]{0,5})$|^([0]\.[0-9]{1,2})$|^([1-9][0-9]{0,5}\.[0-9]{1,2})$|^([0])$|^\\./
                            // let check = /(^[1-9][0-9]{0,})|^([0])$|^([0]\.[0-9]{1,2})$|^([1-9][0-9]{0,}\.[0-9]{1,2})$|^\\./g
                            if(val.adjustPrice == "" || val.adjustPrice == null){
                            return newAvtive = {a1:true,a2:val}
                            }
                        })
                        if(newAvtive.a1 === true){
                            this.$message(newAvtive.a2.merName+":调整售价不能为空");
                        }else{
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
                console.log(this.selectCinemals, "this.selectCinemals")
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
                this.queryData.list[this.currentMerGroupIndex].billCinemaMerVoList.map((item, index) => {
                    this.selectCinemals[this.currentMerGroupIndex].map(selectItem => {
                        if (item.cinemaUid == selectItem.cinemaUid) {
                            this.$set(item, "adjustPrice", this.batchData.price)
                        }
                    })

                })
                this.batchDialogVisible = false;
                console.log(this.selectCinemals)
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
            handleselbtn(rows){
                this.selPro = rows == null || rows == "" ? []:rows
            },
            handleDel(){
                if(this.selPro.length>0){
                    this.selPro.forEach((val1)=>{
                        this.queryData.list.forEach((val2,index2,arr2)=>{
                            if(val2.merUid == val1.merUid){
                                arr2.splice(index2,1)
                            }
                        })
                    })
                }
            },
            //选择商品回调
            selectedGoodsDialogCallBack(value) {
                if (value.btnType == 1) {
                    if (value.data.length > 0) {
                        let newArr = []
                        value.data.forEach((item,index,arr)=>{
                            let newObj = {}
                            newObj.standardPrice = item.price
                            newObj.merName = item.merName
                            newObj.merCode = item.merCode
                            newObj.merType = item.merType
                            newObj.merUid = item.uid
                            newObj.merType = item.merType
                            newObj.skuUid = item.skuUid
                            newObj.skuName = item.skuName
                            newObj.skuCode = item.skuCode
                            newObj.shorthandCode = item.shorthandCode
                            newObj.adjustPrice = item.adjustPrice
                            newObj.unitName = item.unitName
                            newObj.unitUid = item.unitUid
                            newArr.push(newObj)
                        })
                        this.queryData.list.forEach((val1)=>{
                            newArr.forEach((val2)=>{
                            if(val2.merCode == val1.merCode){
                                val2.adjustPrice = val1.adjustPrice
                            }
                            })
                        })
                        this.queryData.list = newArr
                        console.log(this.queryData.list)
                    } else {

                    }

                } else {
                }
                console.log(this.queryData.list, "商品清单");
            },
            // 选泽门店回调
            onCinemalSumit(val = [], type) {
                console.log(val, " 选泽门店回调", type);
                if (val.length > 0) {
                    this.queryData.cinemaName = val.map((item,index)=>{
                        return item.name
                    }).join(",");
                   let cinemaUids = val.map((item,index)=>{
                       return {cinemaUid:item.uid}
                   })
                   this.queryData.cinemaUids = cinemaUids
                } else {
                    // this.setCinema()
                }
                console.log(this.queryData, "门店数据");
            },
            // setCinema(val = []) {
            //     if (val.length > 0) {
            //         this.cinemaName = val.map((item,index)=>{
            //             return item.name
            //         }).join(",");
            //         // this.queryData.cinemaName = val[0].cinemaName || val[0].name;
            //         // this.queryData.cinemaUid = val[0].cinemaUid || val[0].uid;
            //     } else {
            //         // this.queryData.cinemaName = "";
            //         // this.queryData.cinemaUid = "";
            //     }
            // },
            handleDleteRecipeGroup(row, index) {
                this.queryData.list = this.queryData.list.filter((item, merIndex) => {
                    return merIndex != index
                })
            },
            //去重
            unRepeat(arr) {
                let hash = {};
                return arr.reduce((item, next) => {
                    if (!hash[next.skuUid || merCode]) {
                        hash[next.skuUid || merCode] = true;
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
                let tempArr = this.queryData.list.map(item=>{
                    return {
                        skuUid:item.skuUid,
                        merName:item.merName,
                    }
                })
                return tempArr
            },
            selectedCinemaCheckedKeys(){
                let tempArr = [];
                if(this.queryData.list.length>0 && this.queryData.list[this.currentMerGroupIndex].billCinemaMerVoList){
                    tempArr = this.queryData.list[this.currentMerGroupIndex].billCinemaMerVoList.map(item=>{
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
                    case 1:
                        result = "未生效";
                        break;
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
                        result = this.queryData.reviewRecordList == null ? 1:this.queryData.reviewRecordList.length + 2
                        break;
                    case 3:
                        result = this.queryData.reviewRecordList == null ? 1:this.queryData.reviewRecordList.length + 2
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
            selectedGoods,
            seecinemalDialog
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