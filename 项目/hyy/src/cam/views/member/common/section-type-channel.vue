<template>
     <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        会员渠道及类型分布
      </div>
      <div class="section-select center">
        <target-label
            :activeType="type"
            :targetLabel="targetLabel"
            :otherLabel="otherLabel"
            @getType="changeType"
            class="target-label__fixed"
        ></target-label>
      </div>
      <!-- 饼图 -->
      <div class="section-content flex" v-if="showPie">
        <div style="width:40%">
          <ve-pie
            :title="channelTitle"
            :data="channelData"
            :settings="channelSettings"
            :extend="pieExtend"
            :colors="colors"
          ></ve-pie>
        </div>
         <div style="width:40%;margin:0 auto">
          <ve-ring
            :title="cardTitle"
            :data="cardData"
            :settings="ringSettings"
            :extend="ringExtend"
            :colors="colors"
          ></ve-ring>
        </div>
      </div>
      <!-- 柱状图 -->
      <div class="section-content flex" v-else>
        <div style="width:40%">
            <ve-histogram
                :title="channelTitle"
                :data="channelBarData"
                :extend="barExtend"
                :legend-visible="false">
            </ve-histogram>
          
        </div>
        <div style="width:40%;margin:0 auto">
            <ve-histogram
                :title="cardTitle"
                :data="cardData"
                :extend="barExtend"
                :legend-visible="false">
            </ve-histogram>
        </div>
      </div>
    </div>
</template>
<script>
import TargetLabel from "../../partical/targetLabel";
import Global from "../../../util/global.js";
export default {
    components:{TargetLabel},
    props:{
        allData:{},
        targetLabel:{
            type:Array,
        },
        otherLabel:{
            type:Array,
        },
        targetType:{
            type:String
        } 
    },
    data(){
        this.colors = [
            "#3B74FF",
            "#FE6081",
            "#FEC107",
            "#A5F053",
            "#FE825E",
            "#8E7EFF",
            "#ca8622",
            "#bda29a",
            "#6e7074",
            "#546570",
            "#c4ccd3"
        ];
        return{
            type:this.targetType,
            showPie:true,
            type:this.targetType,
            channelTitle: {
                show: true,
                text: "会员渠道",
                textStyle: {
                    fontSize: 12,
                    color: "#666"
                },
                padding: [20, 10, 10, 10]
            },
            // 渠道
            channelData: {
                columns: ["name", "value"],
                rows: []
            },
            // 渠道设置
            channelSettings: {
                level: [["线上", "线下"], []]
            },
            // 渠道柱状图
            channelBarData: {
                columns: ["name", "value"],
                rows: []
            },
            // 品类
            cardTitle: {
                show: true,
                text: "会员类型",
                textStyle: {
                    fontSize: 12,
                    color: "#666"
                },
                padding: [20, 10, 10, 10]
            },
            // 品类
            cardData: {
                columns: ["name", "value"],
                rows: []
            },
            // 环图设置
            ringSettings:{
                roseType: "radius", 
            },
            // 环图扩展
            ringExtend:{
                 legend: {
                    top: "bottom",
                    itemWidth: 10,
                    itemHeight: 10,
                    textStyle: {
                        color: "#333",
                        fontSize: 12
                    }
                },
            },
            // 饼图设置
            pieSettings: {},
            // 饼图扩展
            pieExtend: {
                legend: {
                    top: "bottom",
                    itemWidth: 10,
                    itemHeight: 10,
                    textStyle: {
                        color: "#333",
                        fontSize: 12
                    }
                },
            },
            //柱状图扩展
            barExtend: {
                barWidth: 10,
                color: "#3B74FF",
                tooltip: {
                    formatter: params => {
                        // console.log(params[0])
                        let marker = params[0].marker;
                        let name = params[0].name;
                        let value = this.formatNum(params[0].value);
                        let str = marker + name + "<br>" + value;
                        return str;
                    }
                },
                'xAxis.0.axisLabel.interval': 0,
                "xAxis.0.axisLabel.rotate": 45,
            },
        }
    },
    watch:{
        targetType(){
            this.type = this.targetType; 
        },
        allData(){
            let type = this.type;
            let allData = this.allData;
            let cardObj = allData.card;
            let channelObj = allData.channel;
            if(type){
                if(cardObj[type]){
                    this.$set(this.cardData,"rows",cardObj[type])
                }
                if(channelObj[type]) {
                    let resData = JSON.parse(JSON.stringify(channelObj[type]))
                    let lineData = resData.line;
                    let unline = resData.unLine;
                    let channelData = [...lineData,...unline];
                    this.channelSettings.level[1] = unline.map(item=>{
                        return item.name
                    })
                    this.$set(this.channelData,"rows",channelData);
                    this.$set(this.channelBarData,'rows', unline)
                }
            }else{
                this.$set(this.cardData,"rows",[])
                this.$set(this.channelData,"rows",[])
            } 
        }
    },
    methods:{
        changeType(id){
            this.type = id;
            let allData = this.allData;
            let cardData = this.cardData;
            let channelData = this.channelData;
            let lineCode = ['hykdj','hyrjgx','hyxfzb','myxhyzb'];
            if(lineCode.includes(id)){
                this.showPie = false;
            }else{
                this.showPie = true;
            }
            if(allData.card[this.type]){
                cardData.rows = allData.card[this.type];
            }else{
                cardData.rows = [{name:'1',value:'2'},{name:'2',value:'2'}];
            } 
            if(allData.channel[this.type]) {
                let resData = JSON.parse(JSON.stringify(allData.channel[this.type]))
                let lineData = resData.line;
                let unline = resData.unLine;
                let channelData = [...lineData,...unline];
                console.log(channelData,'hebibg')
                this.channelSettings.level[1] = unline.map(item=>{
                    return item.name
                })
                this.$set(this.channelData,"rows",channelData);
                this.$set(this.channelBarData,'rows', unline)
            }else{
                channelData.rows = [{name:'1',value:'2'},{name:'2',value:'2'}];
            }
        },
        formatNum(num){
            return Global.formatNum(num)
        }
    }
}
</script>