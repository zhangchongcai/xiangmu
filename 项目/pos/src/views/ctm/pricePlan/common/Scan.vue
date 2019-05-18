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
                                  {{sizeForm.ciPriceProgram.code}}
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
                                <span v-if="sizeForm.ciPriceHallType.length==0" class="cinema-stock-scan-text">
                                        不限影厅
                                </span>
                            </el-form-item>
                            <el-form-item label="有效日期：">
                                <span class="cinema-stock-scan-text" v-if="sizeForm.ciPriceProgram.startDy && sizeForm.ciPriceProgram.endDy">
                                    {{sizeForm.ciPriceProgram.startDy.split(" ")[0]}} 至 {{sizeForm.ciPriceProgram.endDy.split(" ")[0]}}
                                </span>
                            </el-form-item>
                            <el-form-item label="适用时段：">
                                <div v-for=" (item,index) in sizeForm.tmList" :key=index>
                                     <span class="cinema-stock-scan-text" v-if="item.monday ==1">
                                      星期一、
                                    </span>
                                    <span class="cinema-stock-scan-text" v-if="item.tuesday ==1">
                                      星期二、
                                    </span>
                                    <span class="cinema-stock-scan-text" v-if="item.wednesday ==1">
                                       星期三、
                                    </span>
                                    <span class="cinema-stock-scan-text" v-if="item.thursday ==1">
                                       星期四、
                                    </span>
                                    <span class="cinema-stock-scan-text" v-if="item.friday ==1">
                                       星期五、
                                    </span>
                                    <span class="cinema-stock-scan-text" v-if="item.saturday ==1">
                                       星期六、
                                    </span>
                                    <span class="cinema-stock-scan-text" v-if="item.sunday ==1">
                                       星期日
                                    </span>
                                    <span class="cinema-stock-scan-text cinema-stock-scan-distant" >
                                       {{item.startTm}} ~ {{item.endTm}}
                                    </span>
                                </div>
                                
                               
                                
                            </el-form-item>
                            <el-form-item label="适用影片：">
                                <template v-for="(schBashMovieItem,index) in sizeForm.schBashMovieList">
                                     <span class="cinema-stock-scan-text" :key=index>
                                    {{schBashMovieItem.movieName}}
                                </span>
                                </template>
                               <span v-if="sizeForm.schBashMovieList.length==0" class="cinema-stock-scan-text">
                                        不限影片
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
                                            :data="sizeForm.ttVoList"
                                            border
                                            style="width: 100%">
                                            <el-table-column
                                                prop="movieVersionName"
                                                label="影片版本"
                                                width="180">
                                            </el-table-column>
                                            <el-table-column
                                                prop="ttName"
                                                label="票类"
                                                width="180">
                                            </el-table-column>
                                            <el-table-column
                                                prop="price"
                                                label="价格">
                                                <template slot-scope="scope">
                                                    ￥{{scope.row.price}}
                                                </template>
                                            </el-table-column>
                                        </el-table>

                                    </el-form-item>
                                    <el-form-item label="">
                                    <span class="cinema-stock-scan-text">
                                        若价格方案的定价低于发行价时，将以影片最低发行价出售。
                                    </span>
                                    </el-form-item>
                                    <div class="lable-wrap2">
                                        <el-form-item label="允许包厢单卖：" style="width:145px; !important">
                                    <span class="cinema-stock-scan-text" v-if="sizeForm.ciPriceProgram.permitSaleBox">
                                        是
                                    </span>
                                    <span class="cinema-stock-scan-text" v-else>
                                        否
                                    </span>
                                    </el-form-item>
                                    </div>
                                    
                                    <div class="lable-wrap1">
                                        <el-form-item label="允许营销活动、会员折扣：">
                                    <span class="cinema-stock-scan-text" v-if="sizeForm.ciPriceProgram.permitDiscount">
                                        是
                                    </span>
                                    <span class="cinema-stock-scan-text" v-else>
                                        否
                                    </span>
                                    </el-form-item>
                                    </div>
                                    
                                    <el-form-item label="分区加价：">
                                    <span class="cinema-stock-scan-text">
                                        暂无
                                    </span>
                                    </el-form-item>
                                    <el-form-item label="调价规则：">
                                    <span class="cinema-stock-scan-text">
                                       暂无
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
                                        <template v-for="(ciPriceSaleChannelVoItem,index) in sizeForm.ciPriceSaleChannelVoList">
                                            <span class="cinema-stock-scan-text" :key=index>
                                                {{ciPriceSaleChannelVoItem.name}}
                                            </span>
                                        </template>
                                    
                                    </el-form-item>
                                    <el-form-item label="定价方案：">
                                        <el-table
                                            :data="sizeForm.priceNetSale"
                                            border
                                            style="width: 100%">
                                            <el-table-column
                                                prop="movieVersionName"
                                                label="影片版本"
                                                width="180">
                                            </el-table-column>
                                            <el-table-column
                                                prop="price"
                                                label="渠道结算票价"
                                                width="180">
                                                <template slot-scope="scope">
                                                    ￥{{scope.row.price}}
                                                </template>
                                            </el-table-column>
                                            <!-- <el-table-column
                                                prop="price"
                                                label="渠道市场价">
                                                <template slot-scope="scope">
                                                    暂无
                                                </template>
                                            </el-table-column> -->
                                        </el-table>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                        </el-tabs>
                    </div>

                </el-collapse-item>
            </el-collapse>
        <div class="bottom-handler-tool">
            <div class="btn-area" >
                <el-button @click="cancelFun">关闭</el-button>
            </div>
        </div>
        </div>
        <fixStepTool :stepData="stepData.stepList"></fixStepTool>
    </div>
</template>
<script>
    import FixStepTool from "src/components/fix-step-tool/fix-step-tool"
    import fixStepMixin from "src/mixins/ctm/fixStepTool.js"
    const cityOptions = [
    { name: "周一", value: "monday" },
    { name: "周二", value: "tuesday" },
    { name: "周三", value: "wednesday" },
    { name: "周四", value: "thursday" },
    { name: "周五", value: "friday" },
    { name: "周六", value: "saturday" },
    { name: "周日", value: "sunday" }
    ];
  
    export default {
        data() {
            return {

                activeNames: ['1','2','3'],
                activeName: 'first',
                week:cityOptions,
                priceList: [],
                rateList: [],
                sizeForm: {
                   ciPriceProgram:{},
                   ciCinemaList:[],
                   ciPriceHallType:[],
                   schBashMovieList:[],
                   ciPriceSaleChannelVoList:[],
                   priceNetSale:[]
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
                        console.log('resultsssssssssssssssssssss', self.sizeForm)
                    }
                    
                    })
                    .catch((err) => {
                    console.log("哪里出错了，检擦一下哥哥",err);
                    });
    },
    cancelFun(){
         this.$router.push({
                      path: "list",
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
        .el-collapse-item__header::after{
            height: 0px;
        }
        //新button样式
        .bottom-handler-tool {
                height: 64px;
                width: 100%;
                position: fixed;
                z-index: 999;
                bottom: 0;
                right: 0;
                background-color: #f5f5f5;
                .btn-area {
                    width: 500px;
                    margin: 0 auto;
                    height: 64px;
                    text-align: center;
                    padding-top: 16px;
                    box-sizing: border-box;
                }
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
            .lable-wrap1{
                .el-form-item__label{
                    width: 156px !important;
                }
            }
            .lable-wrap2{
                .el-form-item__label{
                    width: 97px !important;
                }
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
             .cinema-stock-scan-distant{
                 margin-left: 8px;
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
