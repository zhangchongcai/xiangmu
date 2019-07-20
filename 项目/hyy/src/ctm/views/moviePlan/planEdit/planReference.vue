<template>
    <div class="plan-reference">
        <div>
            <div class="cur-vie-cinema">
                <span>当前参考: </span>
                <span class="cinema-name">{{curVieCinemaShow}}</span>
                <span v-if="curReCinema" class="cancle-refer" @click="refSetCancel">取消参考</span>
            </div>
        </div>
        <div class="right-top-check">
            <div><el-checkbox v-model="showGoldTimeOnly" @change="getGoldDataOrNo">只显示黄金时段场次({{goldTimeRange}})</el-checkbox></div>
        </div>

        <section class="echarts-container">

            <el-radio-group v-model="curVieCinema" @change="radioChange">
                <div class="button-con">
                    <div class="button-hover-con" :class="curReCinema == '00000000' ? '' : 'hide'">
                        <div class="white-bg"></div>
                        <div class="blue-sj"></div>
                        <div class="button-arwea">
                            <el-button v-if="curReCinema != '00000000'" type="text" @click="setRecinema('00000000')">设为参考</el-button>
                            <el-button v-else type="text" @click="refSetCancel">取消参考</el-button>
                        </div>
                    </div>
                    <el-radio-button slot="reference" label="00000000">全国大盘</el-radio-button>
                </div>
                <div class="button-con">
                    <div class="button-hover-con" :class="curReCinema ==  '11111111' ? '' : 'hide'">
                        <div class="white-bg"></div>
                        <div class="blue-sj"></div>
                        <div class="button-arwea">
                            <el-button v-if="curReCinema != '11111111'" type="text" @click="setRecinema('11111111')">设为参考</el-button>
                            <el-button v-else type="text" @click="refSetCancel">取消参考</el-button>
                        </div>
                    </div>
                    <el-radio-button slot="reference" label="11111111">竞对平均</el-radio-button>
                </div>
                <div
                    class="button-con"
                    v-for="cinema in vieCinemaArr"
                    :key="cinema.cinemaCompeteCode">
                    <div class="button-hover-con" :class="curReCinema == cinema.cinemaCompeteCode ? '' : 'hide'">
                        <div class="white-bg"></div>
                        <div class="blue-sj"></div>
                        <div class="button-arwea">
                            <el-button v-if="curReCinema != cinema.cinemaCompeteCode" type="text" @click="setRecinema(cinema.cinemaCompeteCode)">设为参考</el-button>
                            <el-button v-else type="text" @click="refSetCancel()">取消参考</el-button>
                        </div>
                    </div>
                    <el-radio-button slot="reference" :label="cinema.cinemaCompeteCode">{{cinema.cinemaName}}</el-radio-button>
                </div>
                
            </el-radio-group>

            <div class="echarts-con" v-loading="isLoading">
                <chart
                    :options="bar"
                    ref="bar"
                    autoresize />
            </div>
            
        </section>

        <section>
            <el-table
                class="ref-table"
                v-loading="isLoading"
                :span-method="objectSpanMethod"
                :data="referenceTable"
                style="max-width: 100%;">
                <el-table-column
                width="112"
                fixed="left">
                    <template slot-scope="scope">
                        <div>{{tableLeftCol[Math.floor(scope.$index / 3)]}}</div>
                    </template>
                </el-table-column>
                <el-table-column
                    label=""
                    fixed="left"
                    width="88"
                    prop="cinemaName"
                    >
                </el-table-column>
                <el-table-column
                    prop="total"
                    label="合计">
                </el-table-column>
                <!-- :min-width="item.movieName.length * 15" -->
                 <el-table-column
                    width="120"
                    v-for="(item, index) in columnDate"
                    :key="index"
                    :prop="item.movieCode"
                    :label="item.movieName">
                    <template slot="header" slot-scope="scope">
                        <div class="table-movie-name">
                            <span :class="item.ended ? 'ended' : ''" :title="item.movieName">{{item.movieName}}</span>
                            <i v-if="item.isNew" class="new-tip">NEW</i>
                        </div>
                            
                    </template>  
                </el-table-column>
            </el-table>
        </section>
    </div>
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/dataZoom'
import {getRefCinema, getPlanReference} from 'ctm/http/interface'
export default {
    data() {
        return {
            cinemaUid: '',
            planDate: '',
            curVieCinema: '00000000',  // 当前选择
            curReCinema: 'default',    // 当前设为参考
            vieCinemaArr: [],   // 竞对影院 List
            // 接口参数
            goldTimeStart: '',
            goldTimeEnd: '',
            goldTimeRange: '',   // 黄金时段 value
            showGoldTimeOnly: false,    // 是否只显示黄金时段,
            curRadioValue: '全国大盘',  // 当前单选框
            bar: {
                legend: {
                    data: []
                },
                grid:{
                    bottom: "25%" //
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    },
                    formatter:function(params){
                        return params[0].name + "<br>" + params[0].seriesName + ":" + params[0].data + "<br>" +
                        params[1].seriesName + ":" + params[1].data + "%"
                        },
                },
                dataset: {
                    // Provide data.
                    source: {
                        film: [],
                        '我的数据': [],
                        '参考竞对': [],
                        '当前选中': []
                    }
                },
                // Declare X axis, which is a category axis, mapping
                // to the first column by default.
                xAxis: { 
                        type: 'category',
                        // interval: 128,
                        axisLine: {
                            lineStyle: {
                                color: '#eee'
                            }
                        },
                        axisTick: {
                            length: 0, 
                            interval: 0
                        },
                        axisLabel: {
                            // formatter: function(value, index) {
                            //     var newParamsName = ''
                            //     var paramsNameNumber = value.length
                            //     var provideNumber = 7
                            //     var rowNumber = Math.ceil(paramsNameNumber / provideNumber)
                            //     for (let row = 0; row < rowNumber; row++) {
                            //         newParamsName +=
                            //             value.substring(
                            //             row * provideNumber,
                            //             (row + 1) * provideNumber
                            //             ) + '\n'
                            //     }
                            //     return newParamsName
                            // },
                            interval: 0,
                            color: '#666',
                            lineHeight: 14
                            
                            
                        }
                        
                    },
                // Declare Y axis, which is a value axis.
                yAxis: {
                    axisLine: {
                        lineStyle: {
                            color: '#eee',
                            opacity: 0
                        }
                    },
                    axisTick: {
                        length: 0, 
                        interval: 0
                    },
                    axisLabel: {
                        interval: 0,
                        color: '#666',
                        formatter: '{value}%'
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#EEE'
                        }
                    }
                },
                dataZoom: [
                    {
                        type: 'slider',
                        show: true,
                        start: 0,
                        end: 90,
                        handleSize: 8
                    }
                ],
                // Declare several series, each of them mapped to a
                // column of the dataset by default.
                series: [
                    {   
                        type: 'bar',
                        barWidth: 16
                    },
                    {   
                        type: 'bar',
                        barWidth: 16
                    },
                    {   
                        type: 'bar',
                        barWidth: 16
                    }
                    ],
                color: ['#FE825E','#FEC107', '#3B74FF'],
            },
            referenceTable: [

            ],
            columnDate: [],
            countryActive: true,
            averageActive: false,
            tableLeftCol: ['场次占比', '黄金场次占比', '场次', '黄金场次'],
            isLoading: true
        }
    },
    mounted() {
        this.cinemaUid = this.$route.query.cinemaUid ? this.$route.query.cinemaUid : ''
        this.curReCinema = this.$route.query.consultCinemaCode ? this.$route.query.consultCinemaCode : 'default'
        this.planDate = this.$route.query.cinemaUid ? this.$route.query.planDate : this.formatDateTime(new Date().getTime(), 1)
        this.goldTimeStart = this.$route.query.goldTimeStart ? this.$route.query.goldTimeStart : this.formatDateTime(new Date().getTime(), 0)
        this.goldTimeEnd = this.$route.query.goldTimeEnd ? this.$route.query.goldTimeEnd : this.formatDateTime(new Date().getTime(), 0)

        this.getReference()
        getRefCinema({
            cinemaUid: this.cinemaUid
        }).then(result => {
            if (result.code != 200) return this.error(result.msg)
            if (result.code == 200 && result.data) {
                // 竞对影院
                // this.vieCinemaArr = res.data.cinema.map(item => {
                //     item.cinemaName = item.name
                //     item.cinemaCompeteCode = item.cinemaCode
                //     return item
                // }).concat(result.data)
                this.vieCinemaArr = result.data
            }
            
        })
    },
    methods: {
        getReference() {
            this.isLoading = true
            getPlanReference({
                "cinemaUid": this.cinemaUid,
                "currentCinemaCode": this.curVieCinema,
                "consultCinemaCode": this.curReCinema,
                "planDate": this.planDate,
                "startTime": this.goldTimeStart,
                "endTime": this.goldTimeEnd,
                "isGold": this.showGoldTimeOnly ? 1 : 0
            }).then(res => {
                if (res.code != 200) return this.error(res.msg)
                if (res.code == 200 && res.data) {
                    // bar
                    let {myData, curVieData, curSelectSecData} = res.data.bar.yaxis
                    
                    // myData = myData ? myData.map(item => {
                    //     return item + '%'
                    // }) : []
                    // curVieData = curVieData ? curVieData.map(item => {
                    //     return item + '%'
                    // }) : []
                    // curSelectSecData = curSelectSecData ? curSelectSecData.map(item => {
                    //     return item + '%'
                    // }) : []
                    let bar = JSON.parse(JSON.stringify(this.bar))
                    bar.legend.data = this.curReCinema ? ['我的数据', '参考竞对', '当前选中'] : ['我的数据', '当前选中']
                    
                    
                    bar.color = this.curReCinema ? ['#FE825E','#FEC107', '#3B74FF'] : ['#FE825E', '#3B74FF']
                    bar.dataset.source = this.curReCinema ? {
                        film: res.data.bar.xaxis.map(this.formatter),
                            // film: res.data.bar.xaxis,
                            '我的数据': myData, 
                            '参考竞对': curVieData,
                            '当前选中': curSelectSecData
                        } : {
                            film: res.data.bar.xaxis.map(this.formatter),
                            // film: res.data.bar.xaxis,
                            '我的数据': myData,
                            '当前选中': curSelectSecData
                        }
                    bar.series = this.curReCinema ?  [
                    {   
                        type: 'bar',
                        barWidth: 16
                    },
                    {   
                        type: 'bar',
                        barWidth: 16
                    },
                    {   
                        type: 'bar',
                        barWidth: 16
                    }
                    ] :  [
                    {   
                        type: 'bar',
                        barWidth: 16
                    },
                    {   
                        type: 'bar',
                        barWidth: 16
                    }]
                    this.bar = bar
                    // goldTimeRange
                    this.goldTimeRange = `${res.data.goldTimeStart}-${res.data.goldTimeEnd}`
                    // 默认参考
                    this.curReCinema = res.data.cinema.find(item => {
                        return item.isConsult
                    }) ? res.data.cinema.find(item => {
                        return item.isConsult
                    }).cinemaCode : ''
                    // 表格数据
                    let table = res.data.table.data
                    this.columnDate = res.data.table.columnDate.map((item, i) => {
                        if (!item.movieName) {
                            item.movieName = i.toString()
                        }
                        return item
                    })
                    
                    // 数据缺少补足数据
                    for (var k in table) {
                        
                        let type = ['consultCinema', 'myData', 'currentCinema'], lackArr = []
                        
                        type.forEach(item => {
                            if (table[k].every(value => value.type != item)) {
                                lackArr.push(item)
                            }
                        })
                        lackArr.forEach(value => {
                            let pushObj = {type: value, total: '-', cinemaName: value == 'myData' ? '我的当前数据' : value == 'currentCinema' ? this.vieCinemaArr.find(item => {
                                return item.cinemaCompeteCode == this.curVieCinema
                                }).cinemaName : this.curReCinema ? this.curVieCinemaShow : '无'}
                                this.columnDate.forEach(item => {
                                    pushObj[item.movieCode] = '-'
                                })
                            table[k].push(pushObj)
                            
                        })
                        let arr = type.reduce((data, item) => {
                            return data.concat(table[k].find(value => {
                                return value.type == item
                            }))
                        }, [])
                        table[k] = arr
                        
                    }
                    table.goldScenePer.forEach(item => {
                        for(var k in item) {
                            if (k != 'type' && k != 'cinemaName' && item[k] != '-') {
                                item[k] = item[k] + '%'
                            }
                        }
                    })
                    table.scenePer.forEach(item => {
                        for(var k in item) {
                            if (k != 'type' && k != 'cinemaName' && item[k] != '-') {
                                item[k] = item[k] + '%'
                            }
                        }
                    })
                    this.referenceTable = this.showGoldTimeOnly ? table.goldScenePer.concat(table.goldScene) : table.scenePer.concat(table.goldScenePer, table.scene, table.goldScene)
                    this.isLoading = false
                }
            })
        },
        radioChange (val) {
            this.curVieCinema = val
            this.getReference()
            
        },
        setRecinema(val) {
            this.curReCinema = val
            this.getReference()
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (rowIndex % 3 === 0) {
                    return {
                        rowspan: 3,
                        colspan: 1
                    };
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    };
                }
            }
        },
        refSetCancel() {
            this.curReCinema = ''
            this.getReference()
        },
        getGoldDataOrNo(val) {
            this.showGoldTimeOnly = val
            this.getReference()
        },
        formatDateTime(timeStamp, type) { // type: 0 全格式 1 仅日 2 仅时间
            var date = new Date(timeStamp)
            let y = date.getFullYear()
            let m = date.getMonth() + 1
            m = m < 10 ? `0${m}` : m
            let d = date.getDate()
            d = d < 10 ? `0${d}` : d
            let h = date.getHours()
            h = h < 10 ? `0${h}` : h
            let mm = date.getMinutes()
            mm = mm < 10 ? `0${mm}` : mm
            return type == 0 ? `${y}-${m}-${d} ${h}:${mm}` : type == 1 ? `${y}-${m}-${d}` : type == 2 ? `${h}:${mm}` : `${y}-${m}-${d} ${h}:${mm}`
        },
        formatter(params) {
            // return params.length > 5 ? params.substring(0, 4) + '...' : params
            var newParamsName = ''
            var paramsNameNumber = params.length
            var provideNumber = 5
            var rowNumber = Math.ceil(paramsNameNumber / provideNumber)
            for (let row = 0; row < rowNumber; row++) {
                newParamsName +=
                    params.substring(
                    row * provideNumber,
                    (row + 1) * provideNumber
                    ) + '\n'
            }
            return newParamsName
        }
    },
    watch: {
        showGoldTimeOnly(data, oldData) {
            this.tableLeftCol = data ? ['黄金场次占比', '黄金场次'] : ['场次占比', '黄金场次占比', '场次', '黄金场次'] 
        }
    },
    components: {
        chart: ECharts
    },
    computed: {
        curVieCinemaShow() {
            return this.curReCinema == '00000000' ? '全国大盘' : this.curReCinema == '11111111' ? '竞对平均' : this.vieCinemaArr.length ? this.vieCinemaArr.filter(item => item.cinemaCompeteCode == this.curReCinema).length ? this.vieCinemaArr.filter(item => item.cinemaCompeteCode == this.curReCinema)[0].cinemaName : '无' : '无'
        }
    }
    
}
</script>

<style lang="scss">
.plan-reference {
    position: relative;
    .right-top-check {
        position: absolute;
        top: 30px;
        right: 22px;
        z-index: 99;
        .el-checkbox__input.is-checked .el-checkbox__inner::after {
            transform: none;    
            transform: translate(-50%,-50%)  rotate(0) scale(1);
        }
        .el-checkbox__inner::after {
            border-left: none;
            border-top: none;
        }
        .el-checkbox__input.is-checked {
            .el-checkbox__inner {
                background: #3B74FF;
            }
        }
        .el-checkbox__inner {
            border: 1px solid #dcdfe6;
            border-radius: 100%;
            width: 14px;
            height: 14px;
            position: relative;
            cursor: pointer;
            display: inline-block;
            box-sizing: border-box;
            border-color: #3B74FF;
            background: #fff;
            &::after {
                width: 4px;
                height: 4px;
                border-radius: 100%;
                background-color: #fff;
                content: "";
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%,-50%) scale(0);
                transition: transform .15s ease-in;
            }
        }
    }
    .cur-vie-cinema {
        font-size: 14px;
        color: #666;
        margin: 24px 0;
        .cinema-name {
            display: inline-block;
            color: #151515;
            margin-right: 16px;
        }
        .cancle-refer {
            display: inline-block;
            width: 80px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            border: 1px solid #3B74FF;
            border-radius: 4px;
            cursor: pointer;
        }
    }
    .button-con {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        .button-hover-con {
            position: absolute;
            width: 96px;
            height: 42px;
            bottom: -42px;
            left: 0;
            z-index: 99;
            border-radius: 4px;
            .white-bg {
                background-color: #fff;
                height: 10px;
            }
            .blue-sj {
                width: 10px;
                height: 10px;
                background-color: #fff;
                border-radius: 2px;
                transform: rotate(-45deg);
                position: absolute;
                top: 5px;
                left: 42px;
                border: 1px solid #3B74FF;
                border-left: none;
                border-bottom: none;
            }
            .button-arwea {
                border: 1px solid #3B74FF;
                border-radius: 4px;
                .el-button {
                    width: 100%;
                    text-align: center;
                    height: 32px;
                    left: 32px;
                    padding: 0;
                }
            }
            &.hide {
                display: none;
                .button-arwea {
                    background-color: #3B74FF;  
                    .el-button {
                        color: #fff;
                    }
                }
                .blue-sj {
                    background-color: #3B74FF;
                }
                
            }
        }
        &:hover {
            .button-hover-con.hide {
                display: block;
            }
        }
        .el-radio-button:last-child .el-radio-button__inner {
                border-radius: 0;
        }
    }
    .echarts-container {
        text-align: center;
        .el-radio-group {
            margin-bottom: 60px;
            .button-con:first-child {
                .el-radio-button__inner {
                    border-top-left-radius: 4px;
                    border-bottom-left-radius: 4px;
                    border-left: 1px solid #dcdfe6;
                }
                .el-radio-button.is-active{
                    .el-radio-button__inner {
                        border-left: none;
                    }
                }
            }
            .button-con:last-child {
                .el-radio-button__inner {
                    border-top-right-radius: 4px;
                    border-bottom-right-radius: 4px;
                }
            }
        }
    }
    .echarts-con {
        width: 100%;
        // height: 220px;
        height: 400px;
        margin-bottom: 40px;
        .echarts {
            width: 100%;
            height: 100%;
        }
    }
    .ref-table.el-table {
        .el-table__header-wrapper {
            th {
                .cell {
                    padding: 0;
                }
            }
        }
        .table-movie-name {
            position: relative;
            padding-left: 16px;
            width: 100%;
            display: block;
            .new-tip {
                position: absolute;
                width: 50px;
                height: 36px;
                line-height: 58px;
                left: -21px;
                top: -14px;
                transform: rotate(-45deg) scale(.7);
                background-color: #FE825E;
                color: #fff;
                font-size: 12px;
                font-weight: 700;
                text-align: center;
                font-style: normal;
            }
            span {
                display: block;
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .ended {
                color: #999;
            }
        }
    }
}


</style>