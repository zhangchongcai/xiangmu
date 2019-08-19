<template>
    <div>
        <draggable class="clearfix" element="ul" v-model="goodList">
            <li name="list" tag="li" class="draggable-box-li left" v-for="(item) in value" :key="item.skuUid || item.uid || item.categoryUid">
                <div class="color" :style="{borderRightColor:item.color,borderTopColor:item.color}"></div>
                <div :class="{'name-box':true,'classify-good':type=='classifyGood'}" class="">
                    <div v-if="item.merName || item.name">
                        <p class="name">{{item.merName || item.name}} </p>
                        <p class="price" v-if="item.price || item.merPrice">￥{{item.price || item.merPrice}}</p>
                    </div>
                </div>
                <div class="clearfix option">
                    <span class="left" @click="handleSetColor(item)">设置颜色</span>
                    <span class="right" @click="handleRemove(item)">移除</span>
                </div>
            </li>
        </draggable>
        <el-dialog title="请选择颜色" class="retail-style" :visible.sync="colorDialogVisible" width="590px"  append-to-body>
            <ul class="select-color clearfix">
                <li
                        class="left"
                        v-for="(item,index) in selectColorList"
                        :key="index"
                        :style="{background:item.color}"
                        @click="handleSelectColor(item,index)"
                >
                    <i class="el-icon-circle-check icon" v-if="item.selected"></i>
                    <div v-if="item.text">{{item.text}}</div>
                </li>
            </ul>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleColorConfirm">确 定</el-button>
                <el-button @click="colorDialogVisible = false">取 消</el-button>
             </span>
        </el-dialog>
    </div>
</template>
<script>
    import draggable from "vuedraggable";
    import sortable from "sortablejs";

    export default {
        props: {
            value: {
                type: [Object, Array]
            },
            //回选数据
            dialogFeedbackData: {
                type: [Object,String],
            },
            type: {
                type: String,
                default: "userGood"
            },
        },
        data() {
            return {
                goodList: this.value,
                colorDialogVisible: false,
                selectColorList: [
                    {
                        color: "#E2E2E2"
                        // selected: true
                    },
                    {
                        color: "#3BCBA7"
                    },
                    {
                        color: "#9B7BE9"
                    },
                    {
                        color: "#F15364"
                    },
                    {
                        color: "#E2A92D"
                    },
                    {
                        color: "#54B830"
                    },
                    {
                        color: "#1793CB"
                    },
                    {
                        color: "",
                        text: "无"
                    }
                ],
                currentSelectColor: {}
            };
        },
        updated() {
            this.goodList = this.value;
            // console.log(this.goodList)
        },
        methods: {
            init() {
                // console.log(this.goodList)
            },
            //设置颜色
            handleSetColor(item) {
                this.colorDialogVisible = true;
                this.currentSelectColor.uid = item.uid || item.categoryUid;
            },
            //选择颜色
            handleSelectColor(row, index) {
                this.currentSelectColor.color = row.color;
                this.selectColorList = this.selectColorList.map(item => {
                    if (item.color == row.color) {
                        item.selected = true;
                    } else {
                        item.selected = false;
                    }
                    return item;
                });
            },
            //移除常用商品
            handleRemove(row) {
                this.goodList = this.goodList.filter(item => {
                    if (item.uid) {
                        return item.uid != row.uid;
                    } else if (item.categoryUid) {
                        return item.categoryUid != row.categoryUid;
                    }
                    else if (item.blankId) {
                        return item.blankId != row.blankId;
                    }
                });
                this.$emit("input", this.goodList);
            },
            // 确定选择颜色
            handleColorConfirm() {
                // console.log(this.currentSelectColor);
                this.goodList = this.goodList.map(item => {
                    if (this.currentSelectColor.uid == (item.uid || item.categoryUid)) {
                        item.color = this.currentSelectColor.color;
                    }
                    return item;
                });
                this.$emit("input", this.goodList);
                this.$emit("on", this.goodList);
                this.colorDialogVisible = false;
            }
        },
        watch: {
            goodList: function (newVal) {
                this.$emit("input", newVal);
            }
        },
        components: {
            draggable,
            sortable
        }
    };
</script>
<style lang="scss" scoped>
    @import "../../assets/css/common.scss";
    @import "../../assets/css/element-common.scss";

    .color {
        position: absolute;
        right: 0;
        top: 0;
        border: 10px solid transparent;
    }
    .draggable-box-li {
        position: relative;
        width: 120px;
        height: 100px;
        // line-height: 100px;
        cursor: move;
        border-radius: 5px;
        text-align: center;
        margin-left: 10px;
        margin-top: 10px;
        border: 1px solid #ccc;

        .name-box {
            height: 70px;
        }

        .name {
            padding: 20px 5px 10px;
            margin-bottom: 8px;
            height: 50px;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }

        .option {
            display: none;
            cursor: pointer;

            span {
                padding: 8px;
            }
        }
    }


    .draggable-box-li:hover {
        .option {
            display: block;
        }
    }

    .select-color {
        li {
            cursor: pointer;
            width: 100px;
            height: 100px;
            margin-right: 5px;
            margin-left: 5px;
            margin-top: 10px;
            position: relative;
            line-height: 100px;
            text-align: center;
        }

        li:hover {
            // border: 1px dotted #000;
            /*transform: rotate(3);*/
        }

        .icon {
            font-size: 20px;
            color: #000;
            position: absolute;
            right: 10px;
            top: 10px;
        }
    }
    .classify-good {
        margin-top: 20px;
        height: 20px;
    }
</style>
