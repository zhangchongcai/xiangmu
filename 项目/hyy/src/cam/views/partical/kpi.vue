<template>
    <!-- 仪表盘 -->
    <div class="section">
      <ve-gauge :data="gaugeData" :settings="gaugeSettings" :extend="gaugeExtend" ></ve-gauge>
    </div>
</template>
<script>
export default {
    props:['timeRadio','targetRadio'],
    data(){
        this.timeNum = this.timeRadio
        this.targetNum = this.targetRadio;
        this.guaguColor=[[this.timeNum/(this.targetNum*1 + this.timeNum*1), "#3B74FF"],[1,'#F5F5F5']];
        return{
            gaugeData: {
                columns: ["name", "value"],
                rows: [
                { name: "实际完成率", value: this.targetNum},
                { name: "时间进度", value: this.timeNum}
                ]
            },
            gaugeSettings: {
                seriesMap: {
                实际完成率: {
                    radius: "80%",
                    endAngle: 0,
                    startAngle: 180,
                    min: 0,
                    max: 100,
                    name:'实际完成率',
                    axisLine: { // 轴线
                    lineStyle: {
                        color: this.guaguColor,
                        width: 20,
                        shadowColor: "#fff",
                        shadowBlur: 10
                    }
                    },
                    splitLine:{ // 分割线
                        show:true,
                        lineStyle:{
                        color:'#bcbcbc',
                        }
                    },
                    axisTick:{ // 刻度线
                    show:true,
                    },
                    axisLabel:{ // 刻度标签
                    show:true,
                    color:'#3B74FF'
                    },
                    pointer:{ // 指针
                    length:'100%',
                    width:2,
                    },
                    itemStyle:{ // 指针样式
                    color:'#3B74FF',
                    borderType:'dashed',
                    },
                    detail:{
                    show:false,
                    },
                },
                时间进度: {
                    name:'时间进度',
                    radius: "80%",
                    endAngle: 0,
                    startAngle: 180,
                    min: 0,
                    max: 100,
                    axisLine: { // 轴线
                    lineStyle: {
                        color: this.guaguColor,
                        width: 20,
                        shadowColor: "#fff",
                        shadowBlur: 10
                    }
                    },
                    splitLine:{ // 分割线
                    show:false,
                    },
                    axisTick:{ // 刻度线
                    show:true,
                    },
                    axisLabel:{ // 刻度标线
                    show:true,
                    color:'#3B74FF'
                    },
                    pointer:{ // 指针
                    length:'100%',
                    width:2,
                    },
                    itemStyle:{ //指针样式
                    borderType:'dotted',
                    color:'#888'
                    },
                    detail:{
                    show:false,
                    // formatter:function(val){
                    //   return val + '%'
                    // },
                    }
                }
            }
            },
            gaugeExtend: {
                seriesMap: {
                实际完成率: {
                    radius: "80%",
                    endAngle: 0,
                    startAngle: 180,
                    min: 0,
                    max: 100,
                    axisLine: {
                    show: false,
                    lineStyle: {
                        color: [[1, "#3B74FF"]],
                        width: 20,
                        shadowColor: "#fff",
                        shadowBlur: 10
                    }
                    }
                },
                时间进度: {
                    radius: "80%",
                    endAngle: 0,
                    startAngle: 180,
                    min: 0,
                    max: 100,
                    axisLine: {
                    show: false,
                    lineStyle: {
                        color: [[1, "#3B74FF"]],
                        width: 20,
                        shadowColor: "#fff",
                        shadowBlur: 10
                    }
                    }
                }
                }
            }
        }   
    },
    created(){
        console.log(this.timeRadio,this.targetRadio,'props')
    },
}
</script>

