<template>
    <div class="retail-style" id="terminal-classify-goods">
        <div class="common-header">
            <el-form
                    :inline="true"
                    :model="queryData"
                    label-position="left"
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
                    <el-button @click="handleDialogEvent('refCinemalDialog')" type="primary" plain>选择</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="good-setting">
            <div class="good-setting-title clearfix">
                <div class="left">
                    <span>商品分类设置</span>
                    <span class="hint">操作提示: 可通过鼠标拖拽排序</span>
                </div>
                <div class="right">
                    <el-button @click="handleUsedGoodEvent(1)">添加商品分类</el-button>
                    <el-button @click="handleSave(1)">保存</el-button>
                </div>
            </div>
            <div class="draggable-box">
                <div class="common-goods left">常用商品</div>
                <draggable-goods v-model="queryData.useVoList"  type="classifyGood"></draggable-goods>
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
                            <el-button type="text" size="small" @click.stop="handleOperateEvent('1',row)">编辑</el-button>
                            <el-button type="text" size="small" @click.stop="handleOperateEvent('2',row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>

        <!-- 选择影院弹窗 -->
        <cinemal-dialog ref="refCinemalDialog" title="选择门店" @onSumit="onCinemalSumit" :dialogFeedbackData="[{ cinemaUid : queryData.cinemaUid,cinemaName:queryData.cinemaName }]"></cinemal-dialog>
        <!-- 选择供应商弹窗 -->
        <!-- 选择商品分类弹窗 -->
        <goods-classify-dialog
                :dialogVisible.sync="selectedGoodsDialogVisible"
                :cinemaUid="queryData.cinemaUid"
                :dialogFeedbackData="queryData.useVoList"
                @cimCategoryDialogCallBack="cimCategoryDialogCallBack"
        ></goods-classify-dialog>
        <!-- 选择终端弹窗 -->
        <terminal-selected-dialog
                ref="refTerminalSelectedDialog"
                :title="'添加独立终端设置'"
                :cinemaUid="queryData.cinemaUid"
                :dialogFeedbackData="terminaCheckedKeys"
                @onSumit="onTerminalSumit"
                type="classifyGood"
        ></terminal-selected-dialog>
    </div>
</template>
<script>
    import draggable from "vuedraggable";
    import sortable from "sortablejs";
    import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
    import goodsClassifyDialog from "cim/components/goodsClassifyDialog/index.vue";
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
                    type: "0", //1-常用商品 2-推荐商品 3-终端常用商品 4-终端推荐商品
                    useVoList: [], //常用分类列表
                    terminaInfoList: [], //终端分类商品列表
                    recomuseVoList: [], //推荐分类列表
                    recomterminaInfoList: [] //终端分类商品列表
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
                this.categoryUserQuery({cinemaUid: this.queryData.cinemaUid})
            },
            //设置保存
            handleSave(type) {
                this.queryData.type = type;
                // console.log(this.queryData);
                this.userProSaveUseInfo(this.queryData,type);
            },
            // 查询商品分类设置
            categoryUserQuery(param) {
                // debugger
                this.$cimList.posSetting.categoryUserQuery(param).then(resData => {
                    if (resData.code == 200) {
                        this.queryData.useVoList = resData.data.merCategoryUserVoList.map(item=>{
                            item.preType  = 1
                            return item
                        })
                        this.queryData.terminaInfoList = resData.data.terminaInfoList.map(item=>{
                            item.preType  = 1
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
                let tempParams = {
                    cinemaUid: this.queryData.cinemaUid
                };
                if(type==1){
                    //常用商品分类保存
                    tempParams.categoryUseEntityList = param.useVoList.map(item => {
                        return {
                            categoryUid: item.categoryUid,
                            cinemaUid: this.queryData.cinemaUid,
                            color: item.color,
                            uid: item.uid,
                        }
                    })
                    this.categoryUserSave(tempParams);
                } else if (type == 3) {
                    //终端分类保存
                    tempParams.cinemaUid = this.queryData.cinemaUid;
                    tempParams.cinemaName = this.queryData.cinemaName;
                    tempParams.terminaInfoList = this.queryData.terminaInfoList;
                    // console.log(param)
                    this.categoryUserTerminalSave(tempParams);
                }
            },
            //常用商品分类保存
            categoryUserSave(param) {
                this.$cimList.posSetting.categoryUserSave(param).then(resData => {
                    if (resData.code == 200) {
                        this.$message({
                            type: "success",
                            message: "保存成功!"
                        });
                        this.onQuery()
                    } else {
                        this.$message({
                            message: resData.msg
                        });
                    }
                })
            },
            //终端商品分类保存
            categoryUserTerminalSave(param) {
                this.$cimList.posSetting.categoryUserTerminalSave(param).then(resData => {
                    if (resData.code == 200) {
                        this.$message({
                            type: "success",
                            message: "保存成功!"
                        });
                        this.onQuery()
                    } else {
                        this.$message({
                            message: resData.msg
                        });
                    }
                })
            },
            // 删除终端商品
            userProDelterminal(param) {
                this.$cimList.posSetting.categoryUserDelterminal(param).then(resData => {
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
                    this.useVoListCheckedKeys = this.queryData.useVoList;
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
            cimCategoryDialogCallBack(value) {
                if (value.btnType == 1) {
                    value.data = value.data.map(item => {
                        item.categoryUid = item.uid;
                        item.uid = "";
                        return item;
                    });
                    let tempArr = JSON.parse(JSON.stringify(this.queryData.useVoList));
                    tempArr.push(...value.data);
                    this.queryData.useVoList = this.unRepeat(tempArr);
                } else {
                }
            },
            //去重(根据uid相同，避免数据问题)
            unRepeat(arr) {
                let hash = {};
                return arr.reduce((item, next) => {
                    if (!hash[next.categoryUid]) {
                        hash[next.categoryUid] = true;
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
                if (type == 1) {
                    //修改
                    if (row.preType == 1) {
                       this.handleTerminalGoodEvent(1,'upDate')
                    }else{
                        this.handleTerminalGoodEvent(2,'upDate')
                    }
                } else {
                    this.$confirm("<i class='el-icon-circle-close'></i><span>确定删除吗?</span>", {
                        customClass: "retail-style",
                        dangerouslyUseHTMLString: true,
                        cancelButtonText: "取消",
                        confirmButtonText: "确定",
                        center: true,
                    })
                    .then(() => {
                        //删除
                        this.userProDelterminal({cinemaUid:this.queryData.cinemaUid,code:row.code})
                    })
                    .catch(() => {
                    });
                }
            },
            // 选泽门店回调
            onCinemalSumit(val = [],type) {
                // console.log(val," 选泽门店回调",type);
                if (val.length > 0) {
                    if(type=="default"){
                        if(val.length==1){
                            this.setCinema(val);
                            this.onQuery();
                        }
                    }else{
                        this.setCinema(val)
                        this.onQuery();
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
            //终端商品设置
            onTerminalSumit(val) {
                // console.log(val);
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

                }
            }
        },
        watch: {

        },
        computed: {},
        components: {
            draggable,
            sortable,
            cinemalDialog,
            goodsClassifyDialog,
            terminalSelectedDialog,
            draggableGoods
        }
    };
</script>
<style lang="scss">
    @import "../../../../assets/css/common.scss";
    @import "../../../../assets/css/element-common.scss";
   #terminal-classify-goods{
       .common-goods{
           position: relative;
           width: 120px;
           height: 100px;
           line-height: 100px;
           background: #fffec2;
           border-radius: 5px;
           text-align: center;
           margin-left: 10px;
           margin-top: 10px;
           border: 1px solid #ccc;
       }
       .good-setting {
           width: 1200px;
           border: 1px solid #ccc;
           margin-bottom: 20px;
       }

       .name-box {
           height: 50px;
       }
       .good-setting-title {
           border-bottom: 1px solid #ccc;
           padding: 10px;
           line-height: 35px;
       }

       .draggable-box {
           min-height: 300px;
           max-height: 600px;
           overflow: scroll;
       }
       .own-terminal-header {
           border-top: 1px solid #ccc;
           margin-top: 10px;
       }

       .own-terminal {
           /*margin-bottom: 20px;*/
           padding: 10px;
       }

       .hint {
           color: #E6A23C;
           margin-left: 10px;
       }
       .draggable-box-li .name {
           margin-top: 20px;
       }
   }
</style>
