<template>
  <!--kpi -->
  <div class="section" style="width:100%;height:300px;">
    <ve-gauge 
      style="height:230px"
      :data="gaugeData" 
      :settings="gaugeSettings"
      :extend="gaugeExtend"
    >
    </ve-gauge>
    <ul class="ulContainer">
        <li>月至今达成 : {{BoxRate}}元</li>
        <li>KPI值 : {{BoxKPItotal}}元</li>
    </ul>
  </div>
</template>

<script>

export default {
  name:'BoxDash',
  props:{
    BoxKPIvalue:{
      type:Object
    }
  },
  data(){
    return {
      BoxRate:'',
      BoxKPItotal: '' ,
      gaugeData: {
        columns: ["name", "value"],
        rows: [
          { name: "实际完成率", value: ''},
          { name: "时间进度", value: ''}
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
                color: [
                  [],
                  []
                ],
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
                color: [
                  [],
                  []
                ],
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
  watch: {
    BoxKPIvalue(data,oldData) {
      this.getBoxKpiData(data)
    },
    MemberKPIvalue(data,oldData) {
      this.getMemKpiData(data)
    }
  },
  methods:{
    //票房KPI
    getBoxKpiData(BoxKPIvalue){
      //取到时间进度
      let tool1 = BoxKPIvalue.timeRate, tool2 = BoxKPIvalue.boxOfficeRate
      
      //取值title
      this.BoxRate = BoxKPIvalue.boxOfficeTarget
      this.BoxKPItotal = BoxKPIvalue.boxOfficeCurrent
      //从新复制
      this.gaugeData = {
        columns: ["name", "value"],
        rows: [
          { name: "实际完成率", value: tool1},
          { name: "时间进度", value: tool2}
        ]
      }

      let gaugeSettings = JSON.parse(JSON.stringify(this.gaugeSettings))

      gaugeSettings.seriesMap.实际完成率.axisLine.lineStyle.color = [
        [tool2/(tool2*1 + tool1*1), "#3B74FF"],[1,'#F5F5F5']
      ]
      gaugeSettings.seriesMap.时间进度.axisLine.lineStyle.color = [
        [tool2/(tool2*1 + tool1*1), "#3B74FF"],[1,'#F5F5F5']
      ]
      this.gaugeSettings = gaugeSettings
    },
    //卖品KPI
    getMemKpiData(MemberKPIvalue){
      //取到时间进度
      let tool1 = MemberKPIvalue.timeRate, tool2 = MemberKPIvalue.boxOfficeRate
      //取值title
      this.BoxRate = MemberKPIvalue.boxOfficeTarget
      this.BoxKPItotal = MemberKPIvalue.boxOfficeCurrent
      //从新复制
      this.gaugeData = {
        columns: ["name", "value"],
        rows: [
          { name: "实际完成率", value: tool1},
          { name: "时间进度", value: tool2}
        ]
      }
      let gaugeSettings = JSON.parse(JSON.stringify(this.gaugeSettings))

      gaugeSettings.seriesMap.实际完成率.axisLine.lineStyle.color = [
        [tool2/(tool2*1 + tool1*1), "#3B74FF"],[1,'#F5F5F5']
      ]
      gaugeSettings.seriesMap.时间进度.axisLine.lineStyle.color = [
        [tool2/(tool2*1 + tool1*1), "#3B74FF"],[1,'#F5F5F5']
      ]
      this.gaugeSettings = gaugeSettings
    }
  },
}
</script>

<style lang="scss" scoped>
.ulContainer{
  width:100%;
  display: flex;
  height:50px;
  list-style-type:none;
  padding:0px;
}
.ulContainer li{
  flex:1;
  text-align:center;
  line-height:50px;
  font-size:12px;
}

</style>