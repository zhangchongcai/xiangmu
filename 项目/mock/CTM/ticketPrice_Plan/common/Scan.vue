<template>
    <div class="cinema-stock-scan-wrap">
        <div class="cinema-stock-scan-content">
            <el-collapse
                v-model="activeNames"
                @change="handleChange"
            >
                <el-collapse-item
                    title="基础信息"
                    name="1"
                >
                    <div class="basic-info">
                        <el-form
                            ref="form"
                            :model="sizeForm"
                            label-width="85px"
                            size="small"
                        >
                            <el-form-item label="方案编码：">
                                <span class="cinema-stock-scan-text">
                                  {{"无"}}
                                </span>
                            </el-form-item>
                            <el-form-item label="方案名称：">
                                <span class="cinema-stock-scan-text">
                                  {{sizeForm.ciPriceProgram.name}}
                                </span>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-collapse-item>
                <!-- ********************************************************************************************* -->
                <el-collapse-item
                    title="详细信息"
                    name="2"
                >
                    <div class="basic-info">
                        <el-form
                            ref="form"
                            :model="sizeForm"
                            label-width="85px"
                            size="small"
                        >

                            <el-form-item label="适用影院：">
                                <template v-for="(ciCinemaItem,index) in sizeForm.ciCinemaList">
                                    <span class="cinema-stock-scan-text" :key="index">
                                        {{ciCinemaItem.name}}
                                    </span>
                                </template>
                                
                            </el-form-item>
                            <el-form-item label="适用影厅：">
                                 <template v-for="(ciPriceHallTypeItem,index) in sizeForm.ciPriceHallType">
                                     <span class="cinema-stock-scan-text" :key=index>
                                        {{ciPriceHallTypeItem.keyName}}
                                    </span>
                                 </template>
                                
                            </el-form-item>
                            <el-form-item label="有效日期：">
                                <span class="cinema-stock-scan-text" v-if="sizeForm.ciPriceProgram.startDy && sizeForm.ciPriceProgram.endDy">
                                    {{sizeForm.ciPriceProgram.startDy.split(" ")[0]}} 至 {{sizeForm.ciPriceProgram.endDy.split(" ")[0]}}
                                </span>
                            </el-form-item>
                            <el-form-item label="适用时段：">
                                <span class="cinema-stock-scan-text">
                                    {{sizeForm.movieLevel}}
                                </span>
                            </el-form-item>
                            <el-form-item label="适用影片：">
                                <span class="cinema-stock-scan-text">
                                    {{sizeForm.movieDirect}}
                                </span>
                            </el-form-item>

                        </el-form>
                    </div>
                </el-collapse-item>
                <el-collapse-item
                    title="价格方案"
                    name="3"
                >
                    <div class="basic-info">
                        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                            <el-tab-pane label="柜台/自助" name="first">
                                <el-form
                                    ref="form"
                                    :model="sizeForm"
                                    label-width="85px"
                                    size="small"
                                >
                                    <el-form-item label="定价方案：">
                                        <el-table
                                            :data="sizeForm.tableData"
                                            border
                                            style="width: 100%">
                                            <el-table-column
                                                prop="date"
                                                label="影片版本"
                                                width="180">
                                            </el-table-column>
                                            <el-table-column
                                                prop="name"
                                                label="票类"
                                                width="180">
                                            </el-table-column>
                                            <el-table-column
                                                prop="address"
                                                label="价格">
                                            </el-table-column>
                                        </el-table>

                                    </el-form-item>
                                    <el-form-item label="分区加价：">
                                    <span class="cinema-stock-scan-text">
                                        {{sizeForm.movieDirect}}
                                    </span>
                                    </el-form-item>
                                    <el-form-item label="调价规则：">
                                    <span class="cinema-stock-scan-text">
                                        {{sizeForm.movieDirect}}
                                    </span>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                            <el-tab-pane label="线上网售" name="second">
                                <el-form
                                    ref="form"
                                    :model="sizeForm"
                                    label-width="85px"
                                    size="small"
                                >
                                    <el-form-item label="适用渠道：">
                                    <span class="cinema-stock-scan-text">
                                        {{sizeForm.movieDirect}}
                                    </span>
                                    </el-form-item>
                                    <el-form-item label="定价方案：">
                                        <el-table
                                            :data="sizeForm.tableData2"
                                            border
                                            style="width: 100%">
                                            <el-table-column
                                                prop="date"
                                                label="影片版本"
                                                width="180">
                                            </el-table-column>
                                            <el-table-column
                                                prop="name"
                                                label="渠道结算票价"
                                                width="180">
                                            </el-table-column>
                                            <el-table-column
                                                prop="address"
                                                label="渠道市场价">
                                            </el-table-column>
                                        </el-table>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                        </el-tabs>
                    </div>

                </el-collapse-item>
            </el-collapse>

        </div>
        <fixStepTool :stepData="stepData.stepList"></fixStepTool>
    </div>
</template>
<script>
    import FixStepTool from "src/components/fix-step-tool/fix-step-tool"
    import fixStepMixin from "src/mixins/CTM/fixStepTool.js"

    export default {
        data() {
            return {

                activeNames: ['1','2','3'],
                activeName: 'first',

                priceList: [],
                rateList: [],
                sizeForm: {
                   ciPriceProgram:{},
                   ciCinemaList:[],
                   ciPriceHallType:[]
                },
                leftDisabled: false,
                rightDisabled: true,
                //交互部分数据
                stepData: {
                    stepEl: ".el-collapse-item",
                    stepList: [
                        {
                            name: "基础信息",
                            isactive: false
                        },
                        {
                            name: "详细信息",
                            isactive: false
                        },
                        {
                            name: "价格方案",
                            isactive: false
                        }
                    ]
                },
            };
        },
        components: {
            fixStepTool: FixStepTool
        },
        methods: {

            handleClick(tab, event) {
                console.log(tab, event);
            },
             getDatas() {
                let self = this;
                console.log('self.$route.query.id',self.$route.query.id)
                let data = {
                    id: self.$route.query.id,
                };
                self.$api
                    .priceprogramScan(data)
                    .then(ret => {
                    if(ret.data){
                        let result = ret.data;
                        self.sizeForm = result
                        // console.log('result',result)
                    }
                    
                    })
                    .catch((err) => {
                    console.log("哪里出错了，检擦一下哥哥",err);
                    });
    },
            //图片动画部分***************************/
            handleChange(val) {
                console.log(val);
            },
            handleCarousel(isLeft) {
                let current = this.$refs.carousel.style.transform.replace(/[^0-9\-,]/g, '')
                let width = this.$refs.carousel.childNodes[0].offsetWidth
                if (isLeft) {
                    // 左
                    if ((this.$refs.carousel.childNodes.length - 5) * width == -current) {
                        this.leftDisabled = true
                    }
                    if ((this.$refs.carousel.childNodes.length - 4) * width == -current) {
                        return
                    }
                    this.rightDisabled = false
                    this.$refs.carousel.style.transform = `translateX(${Number(current) - width}px)`
                } else {
                    // 右
                    if (-current <= width) {
                        this.rightDisabled = true
                    }
                    if (current >= 0) {
                        return
                    }
                    this.leftDisabled = false
                    this.$refs.carousel.style.transform = `translateX(${Number(current) + width}px)`

                }

            }
        },
        mixins: [fixStepMixin],
        created() {
            this.getDatas()
        }
    };
</script>
<style lang="scss">
    .cinema-stock-scan-wrap {
        width: 100%;
        .cinema-stock-scan-breadcrumb {
            margin-left: 24px;
            margin-top: 10px;
            margin-bottom: 10px;
            color: 12px;
        }
        .basic-info {
            width: 884px;
            margin-left: 30px;
            // form css reset

            .el-table {
                .date-css {
                    font-size: 12px;
                    color: #666;
                }
                &::before {
                    height: 0;
                }
                tr:nth-child(1n) {
                    background-color: #fff;
                    &:hover > td {
                        background-color: #fff;
                    }
                }
                tr:nth-child(2n) {
                    background-color: #f5f5f5;
                    &:hover > td {
                        background-color: #f5f5f5;
                    }
                }
                th, td {
                    padding: 0;
                    height: 38px;
                    line-height: 38px;
                    box-sizing: border-box;
                    border: none;
                }
                th {
                    background-color: rgb(242, 244, 253)
                }
                .el-table__header-wrapper {
                    background-color: rgb(242, 244, 253)
                }
                .has-gutter {
                    .cell {
                        color: #333;
                    }
                }
                .cell {
                    font-size: 12px;
                    color: #666;
                }
            }
            .el-form-item {
                margin-bottom: 14px;
            }
            .el-form-item__label {
                font-size: 12px;
                text-align: left;
            }
            .el-select,
            .el-textarea,
            .el-input__inner {
                width: 360px;
            }
            .cinema-stock-scan-table {
                width: 680px;
            }
            .el-form-item__label {
                font-size: 12px;
            }

            .cinema-stock-scan-text {
                font-size: 12px;
                width: 360px;
                color: #808080;
            }
            //影片剧照list
            .main-container {
                position: relative;
                width: 100%;
                .carousel-container {
                    overflow: hidden;
                    width: 92%;
                    margin: 0 auto;
                    .carousel {
                        transition: transform 1s;
                        list-style: none;
                        white-space: nowrap;
                        width: 100%;
                        .carousel-item {
                            display: inline-block;
                            padding: 5px;
                            width: calc(25% - 10px);
                            height: 200px;
                            .inner-img {
                                width: 100%;
                                height: 100%;
                            }
                        }
                    }

                }
                .el-button {
                    position: absolute;
                    top: 50%;
                    z-index: 10;
                    transform: translateY(-50%);
                }
                .arrow-left {
                    left: 0;
                }
                .arrow-right {
                    right: 0;
                }

            }
            // ****************************************
            .separate-accounts-date,
            .separate-accounts-price,
            .separate-accounts-action {
                display: inline-block;
                //   height: 32px;
            }
            .separate-accounts-price {
                width: 83px;
                .el-input--small {
                    width: 46px;
                }
                span {
                    font-size: 12px;
                    color: #666666;
                }
            }
            .separate-accounts-date {
                width: 224px;
                margin-left: -12px;
                span {
                    font-size: 12px;
                    color: #666666;
                }
                .el-date-editor--daterange.el-input__inner {
                    width: 196px;
                }
            }
            .separate-accounts-action {
                margin-left: 6px;
                .el-button {
                    border: 1px solid #3b74ff;
                    color: #3b74ff;
                    span {
                        font-size: 12px;
                    }
                }
                .el-button--mini {
                    padding: 10px 5px 8px;
                }
            }
        }
        .film-info-save {
            text-align: center;
            margin-top: 12px;
            margin-bottom: 12px;
        }
        //设置折叠框箭头和位置
        .el-collapse-item__arrow {
            margin: 0 8px 0;
            transform: rotate(-90deg);
        }
        .el-collapse-item__arrow.is-active {
            transform: rotate(90deg);
        }
        .el-collapse-item__wrap {
            border: 1px solid #ffffff;
        }
    }
</style>
