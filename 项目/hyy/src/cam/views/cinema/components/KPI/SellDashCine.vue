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
        <li>月至今达成 : {{BoxRate | capitalizeOne}}{{BoxRate | foo}}</li>
        <li>KPI值 : {{BoxKPItotal | capitalizeOne}}{{BoxKPItotal | foo}}</li>
    </ul>
  </div>
</template>

<script>

export default {
  name:'MemberDash',
  props:{
    SellKPIvalueCine:{
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
        tooltip: {
          //在这里设置
          formatter: '{a0} : {c0}%'
        }
      }
    }
  },
  filters: {
    capitalizeOne(value) {
      if (!value) return ""
      let newValue = value.toString();

     //判断逻辑
      if(newValue.indexOf('.') != -1){

        if(newValue.length < 8){
          return newValue
        }
        else if(newValue.length >= 8 && newValue.length <= 11){

          return (newValue / 10000).toFixed(2)
        }
        else if(newValue.length >= 12){
          return ((newValue / 10000) / 10000).toFixed(2)
        }
      }
      else
      {

        if(newValue.length < 5){
          return newValue
        }
        else if(newValue.length >= 5 && newValue.length <= 8){
          return (newValue / 10000).toFixed(2)
        }
        else if(newValue.length >= 9){
          return ((newValue / 10000) / 10000).toFixed(2)
        }
      }
    },
    //处理万人计算保留两位小数
    capitalizePerson(value) {
      if (!value) return ""
      let newValue = value.toString();

      if(newValue.length < 5){
        return newValue
      }
      else if(newValue.length >= 5 && newValue.length <= 8){

        return (newValue / 10000).toFixed(2)
      }
      else if(newValue.length >= 9){
        return ((newValue / 10000) / 10000).toFixed(2)
      }
    },
    //处理万元计算
    foo(value){
      if (!value) return ""

      let newValue = value.toString();
      let foo = ''

      if(newValue.indexOf('.') != -1){
        if(newValue.length < 8){
          foo = '元'
          return foo
        }
        else if(newValue.length >= 8 && newValue.length <= 11){
          foo = '万元'
          return foo
        }
        else if(newValue.length >= 12){
          foo = '亿元'
          return foo
        }
      }
      else{
        if(newValue.length < 5){
          foo = '元'
          return foo
        }
        else if(newValue.length >= 5 && newValue.length <= 8){
          foo = '万元'
          return foo
        }
        else if(newValue.length >= 9){
          foo = '亿元'
          return foo
        }
      }
    },
    //处理万人单位计算
    too(value){
      if (!value) return ""

      let newValue = value.toString();
      let too = ''

      if(newValue.length < 5){
        too = '人'
        return too
      }
      else if(newValue.length >= 5 && newValue.length <= 8){
        too = '万人'
        return too
      }
      else if(newValue.length >= 9){
        too = '亿人'
        return too
      }
    },
    capitalizeTwo(value) {
      if (!value) return "";
      value = value * 100;
      return value.toFixed(2);
    },
    capitalizeFloor(value) {
      if (!value) return "";
      return value.toFixed(2);
    }
  },
  watch: {
    SellKPIvalueCine: {
      handler(data,oldData) {
        if(data){
          this.getSellKpiData(data)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods:{
    //卖品KPI
    getSellKpiData(SellKPIvalueCine){
      //取到时间进度
      let tool1 = SellKPIvalueCine.timeRate?SellKPIvalueCine.timeRate:0, tool2 = SellKPIvalueCine.sellGoodsRate?SellKPIvalueCine.sellGoodsRate:0;
      //取值title
      this.BoxRate = SellKPIvalueCine.sppMonthToNow
      this.BoxKPItotal = SellKPIvalueCine.sppTarget
      //从新复制
      this.gaugeData = {
        columns: ["name", "value"],
        rows: [
          { name: "实际完成率", value: tool2},
          { name: "时间进度", value: tool1}
        ]
      }
      let gaugeSettings = JSON.parse(JSON.stringify(this.gaugeSettings));
       // 格式化axisLabel 开始
      gaugeSettings.seriesMap.实际完成率.axisLabel.formatter = (value)=>{
        return value.toFixed(0)
      };
      gaugeSettings.seriesMap.时间进度.axisLabel.formatter = (value)=>{
        return value.toFixed(0)
      };
      // 格式化axisLabel 结束
      if(tool2 >100){
        gaugeSettings.seriesMap.实际完成率.max  = (tool2).toFixed(0);
        gaugeSettings.seriesMap.时间进度.max  = (tool2).toFixed(0);
      }else{
        gaugeSettings.seriesMap.实际完成率.max  = 100;
        gaugeSettings.seriesMap.时间进度.max  = 100;
      }
      gaugeSettings.seriesMap.实际完成率.axisLine.lineStyle.color = [
        [tool2/(tool2>100?tool2:100), "#3B74FF"],[1,'#F5F5F5']
      ]
      gaugeSettings.seriesMap.时间进度.axisLine.lineStyle.color = [
        [tool2/(tool2>100?tool2:100), "#3B74FF"],[1,'#F5F5F5']
      ]
      // gaugeSettings.seriesMap.实际完成率.axisLine.lineStyle.color = [
      //   [tool2/(100), "#3B74FF"],[1,'#F5F5F5']
      // ]
      // gaugeSettings.seriesMap.时间进度.axisLine.lineStyle.color = [
      //   [tool2/(100), "#3B74FF"],[1,'#F5F5F5']
      // ]
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