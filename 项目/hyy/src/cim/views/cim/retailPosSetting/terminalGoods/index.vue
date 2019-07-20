<template>
    <div class="retail-style terminal-goods">
        <div class="common-header">
            <el-form
                    :inline="true"
                    :model="queryData"
                    label-position="right"
                    label-width="80px"
                    label-suffix="："
            >
                <el-form-item label="门店名称" class="select-input">
                    <el-input
                            v-model="queryData.cinemaName"
                            clearable
                            @clear="onCinemalSumit"
                            @focus="handleDialogEvent('refCinemalDialog')"
                            placeholder="请选择门店"
                    ></el-input>
                    <el-button @click="handleDialogEvent('refCinemalDialog')" type="primary" plain>{{queryData.cinemaName?"编辑":"选择"}}</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="good-setting">
            <div class="good-setting-title clearfix">
                <div class="left">
                    <span>常用商品设置</span>
                </div>
                <div class="right">
                    <el-button @click="addBlankBlock(1)">添加空白块</el-button>
                    <el-button @click="handleUsedGoodEvent(1)">添加常用商品</el-button>
                    <el-button @click="handleSave(1)">保存</el-button>
                </div>
            </div>
            <div class="draggable-box">
                <draggable-goods v-model="queryData.useVoList"></draggable-goods>
            </div>
            <div class="own-terminal-header">
                <div class="own-terminal clearfix">
                    <el-button class="right" @click="handleTerminalGoodEvent(1,'add')">添加独立终端设置</el-button>
                </div>
                <el-table :data="queryData.terminaInfoList" stripe>
                    <el-table-column
                            v-for="item in ownTerminalTableColumn"
                            :key="item.key"
                            :prop="item.key"
                            :label="item.label"
                            :formatter="item.formatter"
                    ></el-table-column>
                    <el-table-column label="操作" style="width:180px;">
                        <template slot-scope="{row}">
                            <el-button type="text" size="small" @click.stop="handleOperateEvent('1',row)">修改</el-button>
                            <el-button type="text" size="small" @click.stop="handleOperateEvent('2',row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <div class="good-setting">
            <div class="good-setting-title clearfix">
                <div class="left">
                    <span>推荐商品设置(最多选4种)</span>
                </div>
                <div class="right">
                    <el-button @click="addBlankBlock(2)">添加空白块</el-button>
                    <el-button @click="handleUsedGoodEvent(2)">添加常用商品</el-button>
                    <el-button @click="handleSave(2)">保存</el-button>
                </div>
            </div>
            <div class="draggable-box">
                <draggable-goods v-model="queryData.recomuseVoList"></draggable-goods>
            </div>
            <div class="own-terminal-header">
                <div class="own-terminal clearfix">
                    <el-button class="right" @click="handleTerminalGoodEvent(2,'add')">添加独立终端设置</el-button>
                </div>

                <el-table :data="queryData.recomterminaInfoList" stripe>
                    <el-table-column
                            v-for="item in ownTerminalTableColumn"
                            :key="item.key"
                            :prop="item.key"
                            :label="item.label"
                            :formatter="item.formatter"
                    ></el-table-column>
                    <el-table-column label="操作" style="width:180px;">
                        <template slot-scope="{row}">
                            <el-button type="text" size="small" @click.stop="handleOperateEvent('1',row)">修改</el-button>
                            <el-button type="text" size="small" @click.stop="handleOperateEvent('2',row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <!-- 选择影院弹窗 -->
        <cinemal-dialog ref="refCinemalDialog" @onSumit="onCinemalSumit" :dialogFeedbackData="[{ cinemaUid : queryData.cinemaUid,cinemaName:queryData.cinemaName }]"></cinemal-dialog>
        <!-- 选择供应商弹窗 -->
        <suppliers-dialog ref="refSuppliersDialog"></suppliers-dialog>
        <!-- 选择商品弹窗 -->
<!--        <selected-goods-->
<!--                :dialogVisible.sync="selectedGoodsDialogVisible"-->
<!--                :cinemaUid="queryData.cinemaUid"-->
<!--                :dialogFeedbackData="[{ skuUid: '0503a326-9dfd-446e-91f1-bea42236660e',name:'name' },{ skuUid: '922b51e6-f81b-459a-a09d-539570f8114f',name:'name1' },{skuUid:'645717a6-e9b3-4598-9661-06a23e2004ce',name:'name2'}]"-->
<!--                :autoClose="false"-->
<!--                @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"-->
<!--        ></selected-goods>-->
        <selected-goods
                :dialogVisible.sync="selectedGoodsDialogVisible"
                :cinemaUid="queryData.cinemaUid"
                :dialogFeedbackData="useVoListCheckedKeys"
                :autoClose="false"
                @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
        ></selected-goods>
        <!-- 选择终端弹窗 -->
        <terminal-selected-dialog
                ref="refTerminalSelectedDialog"
                :title="'添加独立终端设置'"
                :cinemaUid="queryData.cinemaUid"
                :dialogFeedbackData="terminaCheckedKeys"
                @onSumit="onTerminalSumit"
        ></terminal-selected-dialog>
    </div>
</template>
<script>
    import draggable from "vuedraggable";
    import sortable from "sortablejs";
    import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
    import suppliersDialog from "cim/components/suppliersDialog/suppliersDialog.vue";
    import selectedGoods from "cim/dialogs/cimSelectedGoods/index.vue";
    import terminalSelectedDialog from "cim/components/terminalSelectedDialog/terminalSelectedDialog.vue";
    import draggableGoods from "cim/components/draggableGoods/draggableGoods.vue";
    import mixins from "frame_cpm/mixins/cacheMixin";
    export default {
        mixins: [mixins.cacheMixin],
        data() {
            return {
                cacheField:["queryData"],
                queryData: {
                    cinemaUid: "", //门店id
                    cinemaName: "", //门店名称
                    type: "0", //1-常用商品 2-门店推荐商品 3-终端常用商品 4-终端推荐商品
                    useVoList: [], //常用商品列表
                    terminaInfoList: [], //终端常用商品列表
                    recomuseVoList: [], //推荐商品列表
                    recomterminaInfoList: [] //终端推荐商品列表
                },
                selectedGoodsDialogVisible: false,
                preType: 1, //1常用商品，2推荐商品
                // 独立表格表头
                ownTerminalTableColumn: [
                    {
                        label: "序号",
                        key: "code"
                    },
                    {
                        label: "适用终端",
                        key: "tername"
                    }
                ],
                terminaCheckedKeys:{},
                useVoListCheckedKeys: [],
            };
        },
        mounted() {
           // this.onQuery();
        },
        beforeDestroy(){
            // alert("销毁")
        },
        methods: {
            onQuery() {
                this.userProQueryUseInfo({cinemaUid:this.queryData.cinemaUid})
            },
            //设置保存
            handleSave(type) {
                this.queryData.type = type;
                console.log(this.queryData);
                this.userProSaveUseInfo(this.queryData,type);
            },
            // 查询商品设置
            userProQueryUseInfo(param){
                // debugger
                this.$cimList.procurement.userProQueryUseInfo(param).then(resData => {
                    if (resData.code == 200) {
                        this.queryData.useVoList = resData.data.useVoList.map(item=>{
                            item.preType  = 1
                            return item
                        })
                        this.queryData.recomuseVoList = resData.data.recomuseVoList.map(item=>{
                            item.preType  = 2
                            return item
                        })
                        this.queryData.terminaInfoList = resData.data.terminaInfoList.map(item=>{
                            item.preType  = 1
                            return item
                        })
                        this.queryData.recomterminaInfoList = resData.data.recomterminaInfoList.map(item=>{
                            item.preType  = 2
                            return item
                        })
                    } else {

                    }
                });
            },
            // 保存商品设置
            userProSaveUseInfo(param,type) {
                if (!this.queryData.cinemaUid) {
                    this.$message({
                        message: "请先选择门店！"
                    });
                    return;
                }
                this.$cimList.procurement.userProSaveUseInfo(param).then(resData => {
                    if (resData.code == 200) {
                        this.$message({
                            type: "success",
                            message: "保存成功!"
                        });
                        if(type==3 || type==4){
                            this.onQuery()
                        }
                    } else {
                        this.$message({
                            message: resData.msg
                        });
                    }
                });
            },
            // 删除终端商品
            userProDelterminal(param) {
                this.$cimList.procurement.userProDelterminal(param).then(resData => {
                    if (resData.code == 200) {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        this.onQuery()
                    } else {
                        this.$message({
                            message: resData.msg
                        });
                    }
                });
            },
            //添加空白块
            addBlankBlock(preType) {
                if (!this.queryData.cinemaUid) {
                    this.$message({
                        message: "请先选择门店！"
                    });
                    return;
                }
                if (preType == 1) {
                    this.queryData.useVoList.push({
                        blankId: Math.random()
                    });
                } else {
                    this.queryData.recomuseVoList.push({
                        blankId: Math.random()
                    });
                }
            },
            //添加常用商品弹窗
            handleUsedGoodEvent(preType) {
                if (!this.queryData.cinemaUid) {
                    this.$message({
                        message: "请先选择门店！"
                    });
                    return;
                }
                this.preType = preType;
                if (preType == 1) {
                    this.useVoListCheckedKeys = this.queryData.useVoList.filter(item => {
                        return item.merCode
                    })
                } else {
                    this.useVoListCheckedKeys = this.queryData.recomuseVoList.filter(item => {
                        return item.merCode
                    })
                }
                this.selectedGoodsDialogVisible = true;
            },
            //添加终端商品弹窗
            handleTerminalGoodEvent(preType,operationType) {
                if (!this.queryData.cinemaUid) {
                    this.$message({
                        message: "请先选择门店！"
                    });
                    return;
                }
                this.preType = preType;
                if(operationType == 'add'){
                    this.terminaCheckedKeys = {};
                }
                this.handleDialogEvent("refTerminalSelectedDialog");
            },
            selectedGoodsDialogCallBack(value) {
                console.log(value);
                if (value.btnType == 1) {
                    value.data = value.data.map(item => {
                        //正常商品
                        if (item.merCode) {
                            item.merUid = item.uid;
                        }
                        return item;
                    });
                    if (this.preType == 1) {
                        //常用商品
                        let tempArr = JSON.parse(JSON.stringify(this.queryData.useVoList));
                        tempArr.push(...value.data);
                        this.queryData.useVoList = this.unRepeat(tempArr);
                    } else {
                        //推荐商品
                        let tempArr = JSON.parse(
                            JSON.stringify(this.queryData.recomuseVoList)
                        );
                        tempArr.push(...value.data);
                        tempArr = this.unRepeat(tempArr);
                        let flag = tempArr.filter(item=>item.merCode);
                        if(flag.length>4){
                            this.$message({
                                message: "最多只能设置4种推荐商品！"
                            });
                            return
                        }
                        this.queryData.recomuseVoList = tempArr;
                    }
                    this.selectedGoodsDialogVisible = false;
                } else {
                }
            },
            //去重(根据uid相同，避免数据问题)
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
            handleDialogEvent(name) {
                this.$refs[name].handleDialog(true);
            },
            handleOperateEvent(type, row) {
                // debugger
                this.terminaCheckedKeys = row;
                console.log(row);
                if (type == 1) {
                    //修改
                    if (row.preType == 1) {
                       this.handleTerminalGoodEvent(1,'upDate')
                    }else{
                        this.handleTerminalGoodEvent(2,'upDate')
                    }
                } else {
                    this.$confirm("确认删除吗, 是否继续?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    })
                        .then(() => {
                            //删除
                            if (row.preType == 1) {
                                this.userProDelterminal({cinemaUid:this.queryData.cinemaUid,code:row.code,useType:1})
                            } else {
                                this.userProDelterminal({cinemaUid:this.queryData.cinemaUid,code:row.code,useType:2})
                            }
                        })
                        .catch(() => {
                        });
                }
            },
            // 选泽门店回调
            onCinemalSumit(val = []) {
                if (val.length > 0) {
                    this.queryData.cinemaName = val[0].name || val[0].cinemaName;
                    this.queryData.cinemaUid = val[0].uid || val[0].cinemaUid;
                    this.onQuery();
                } else {
                    this.queryData.cinemaName = "";
                    this.queryData.cinemaUid = "";
                }

                console.log(this.queryData);
            },
            //终端商品设置
            onTerminalSumit(val) {
                console.log(val);
                val = JSON.parse(JSON.stringify(val));
                if (this.preType == 1) {
                    //常用商品
                    this.queryData.terminaInfoList = val.map(item => {
                        item.preType = 1;
                        return item;
                    });
                    this.handleSave(3);
                } else {
                    //推荐商品
                    this.queryData.recomterminaInfoList = val.map(item => {
                        item.preType = 2;
                        return item;
                    });
                    this.handleSave(4);
                }
            }
        },
        watch: {
            // useVoList: function (newVal) {
            //     console.log(newVal);
            // }
        },
        components: {
            draggable,
            sortable,
            cinemalDialog,
            suppliersDialog,
            selectedGoods,
            terminalSelectedDialog,
            draggableGoods
        }
    };
</script>
<style lang="scss">
    @import "../../../../assets/css/common.scss";
    @import "../../../../assets/css/element-common.scss";
   .terminal-goods{
       .el-form--inline .el-form-item {
           // margin-right: 40px;
       }

       .good-setting {
           width: 1200px;
           border: 1px solid #ccc;
           margin-bottom: 20px;
       }

       .draggable-box {
           min-height: 300px;
       }

       .good-setting-title {
           border-bottom: 1px solid #ccc;
           padding: 10px;
           line-height: 35px;
       }

       .own-terminal-header {
           border-top: 1px solid #ccc;
           margin-top: 10px;
       }

       .own-terminal {
           /*margin-bottom: 20px;*/
           padding: 10px;
       }

       .select-input {
           .el-input {
               width: 200px;
           }
       }
   }
</style>
