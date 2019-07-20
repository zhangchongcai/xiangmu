<template>
    <div>
        <el-dialog class="terminal-good-select-dialog" width="950px" :title="title" :visible.sync="visibleDialog"
                   @open="openCallBack">
            <div>
                <el-row>
                    <el-col :span="6" class="category-trees">
                        <el-tree
                                ref="refCategoryTrees"
                                :data="categoryTrees"
                                show-checkbox
                                node-key="code"
                                default-expand-all
                                :props="defaultProps"
                                @check="handleaCtegoryTrees"
                        ></el-tree>
                    </el-col>
                    <el-col :span="18">
                        <div>
                            <el-form :inline="true" label-position="right" label-width="100px" label-suffix=":">
                                <el-form-item label="商品设置">
                                    <el-button @click="addBlankBlock" v-if="type=='userGood'">添加空白块</el-button>
                                    <el-button @click="handleUsedGoodEvent" v-if="type=='userGood'">添加常用商品</el-button>
                                    <el-button @click="handleClassifyDialogVisible" v-else>添加商品分类</el-button>
                                    <el-button @click="handleSubmit()" v-if="type=='userGood'">保存</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div>
                            <div class="draggable-box">
                                <draggable-goods v-model="userGoodlist" :dialogFeedbackData="dialogFeedbackData"></draggable-goods>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <span slot="footer">
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
                <el-button @click="handleDialog(false)">取 消</el-button>
            </span>
        </el-dialog>
        <!-- 选择商品 -->
        <selected-goods
                :dialogVisible.sync="selectedGoodsDialogVisible"
                @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
                :dialogFeedbackData="selectedGoodsCheckedKeys"
        ></selected-goods>
        <!-- 选择商品分类弹窗 -->
        <goods-classify-dialog
                :dialogVisible.sync="selectedsClassifyDialogVisible"
        ></goods-classify-dialog>
    </div>
</template>

<script>
    import selectedGoods from "cim/dialogs/cimSelectedGoods/index.vue";
    import draggableGoods from "cim/components/draggableGoods/draggableGoods.vue";
    import goodsClassifyDialog from "cim/components/goodsClassifyDialog/index.vue";
    export default {
        props: {
            title: {
                type: String,
                default: "选择商品"
            },
            cinemaUid: {
                type: [String, Number],
            },
            //回选数据
            dialogFeedbackData: {
                type: [Object,Array],
                default: {}
            },
            type: {
                type: String,
                default: "userGood"
            },
        },
        data() {
            return {
                userGoodlist: [],
                visibleDialog: false,
                selectedGoodsDialogVisible: false,
                selectedsClassifyDialogVisible: false,
                // 原材料查询数据
                queryData: {
                    mercatUid: "", //商品分类id
                    name: "",
                    code: "",
                    shorthandCode: "",
                    skuCode: "",
                    page: 1,
                    pageSize: 10
                },
                categoryTrees: [
                    {
                        tername: "全选终端",
                        type: 'all',
                        children: [
                            // {
                            //     terminalName: "100011[1-1]",
                            //     terminalCode: "01",
                            // },
                        ]
                    }
                ],
                defaultProps: {
                    children: "children",
                    label: "tername",

                },
                selecteTerminals: [],
                selectedgoods: [],
            };
        },
        mounted() {

        },
        methods: {
            openCallBack() {
                this.init();
            },
            init() {
                this.userProTerminalList({cinemaUid: this.cinemaUid});
            },
            handleDialog(flag) {
                this.visibleDialog = flag;
            },
            //添加空白块
            addBlankBlock() {
                this.userGoodlist.push({
                    blankId: Math.random()
                });
            },
            //添加常用商品弹窗
            handleUsedGoodEvent() {
                this.selectedGoodsDialogVisible = true;
            },
            //添加商品分类弹窗
            handleClassifyDialogVisible() {
                this.selectedsClassifyDialogVisible = true;
            },
            // 查询
            onQuery() {
                console.log(this.queryData);
            },
            // 提交
            handleSubmit() {
                if (this.selecteTerminals.length == 0) {
                    this.$message({
                        message: "请添加至少一个终端！"
                    });
                    return;
                }
                if (this.userGoodlist.length == 0) {
                    this.$message({
                        message: "请添加至少一个常用商品！"
                    });
                    return;
                }

                let tempObj = this.selecteTerminals.map(item => {
                    item.terminalList = this.userGoodlist;
                    return item;
                }).filter(item => {
                    return item.code
                })

                console.log(tempObj)
                this.$emit("onSumit", tempObj);
                this.handleDialog(false)
            },
            // 获取终端列表
            userProTerminalList(param) {
                this.$cimList.procurement
                    .userProTerminalList(param)
                    .then(resData => {
                        if (resData.code == 200) {
                            setTimeout(()=>{
                                if(this.terminaCheckedKeys){
                                    this.$refs.refCategoryTrees.setCheckedKeys(this.terminaCheckedKeys,true);
                                    this.userGoodlist = this.dialogFeedbackData.terminalList || [];
                                }else{
                                    this.$refs.refCategoryTrees.setCheckedKeys(this.terminaCheckedKeys,false);
                                }
                                this.handleaCtegoryTrees();
                            })
                            this.categoryTrees[0].children = resData.data;
                        }
                    });
            },
            // 查询树
            handleaCtegoryTrees(data) {
                console.log(data)
                this.selecteTerminals = this.$refs.refCategoryTrees.getCheckedNodes();

                // this.findSemifinishedMater(this.queryData);
            },
            selectedGoodsDialogCallBack(value) {
                value.data = value.data.map(item => {
                    //正常商品
                    if(item.merCode){
                        item.merUid = item.uid;
                    }
                    return item;
                });
                if (value.btnType == 1) {
                    let tempArr = JSON.parse(JSON.stringify(this.userGoodlist));
                    tempArr.push(...value.data);
                    this.userGoodlist = this.unRepeat(tempArr);
                    this.dialogFeedbackData.terminalList = this.userGoodlist;
                } else {
                }
            },
            //去重(根据uid相同，避免数据问题)
            unRepeat(arr) {
                let hash = {};
                return arr.reduce((item, next) => {
                    if (!hash[next.merCode]) {
                        hash[next.merCode] = true;
                        item.push(next);
                    }
                    return item;
                }, []);
            },
            handleDialogEvent(name) {
                this.$refs[name].handleDialog(true);
            }
        },
        computed: {
            terminaCheckedKeys(){
                return [this.dialogFeedbackData.code]
            },
            selectedGoodsCheckedKeys(){
                if( this.dialogFeedbackData.terminalList){
                    return  this.dialogFeedbackData.terminalList.filter(item=>{
                        return item.skuUid
                    })
                }else{
                    return [];
                }

            },

        },
        components: {
            selectedGoods,
            draggableGoods,
            goodsClassifyDialog
        },
        watch: {}
    };
</script>


<style lang="scss" scoped>
    @import "../../assets/css/common.scss";
    @import "../../assets/css/element-common.scss";

    .terminal-good-select-dialog {
        .category-trees{
            max-height: 400px;
            overflow-y: scroll;
        }
        .el-form-item__content {
            // width: 200px;
        }

        .draggable-box {
            width: 100%;
            padding-bottom: 10px;
        }

        .empty-box {
            padding: 10px;

            .selected-content {
                margin-top: 6px;
            }

            .el-button {
                padding-left: 0;
                padding-right: 0;
            }

            .empty-content {
                height: 300px;
                overflow-y: auto;

                li {
                    margin-top: 5px;
                }
            }

            .el-tag {
                width: 100%;
            }

            .el-tag .el-icon-close {
                float: right;
                top: 4px;
            }
        }
    }
</style>