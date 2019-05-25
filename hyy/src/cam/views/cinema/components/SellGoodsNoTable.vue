<template>
  <div class="BoxContainer">
    <!--卖品详情-->
    <div class="BoxOffice">
      <div class="BoxTitle flex" height="40">
        <div class="left">
          <span class="iconfont icon-shouye-maipin"></span>
          <span>卖品</span>
        </div>
        <div class="right">
          <span class="tip cursor" @click="goDetail">详情</span>
          <i class="iconfont icon-neiye-zhankaijiantou icon-arrow"></i>
        </div>
      </div>
    </div>

    <!--nav导航-->
    <div class="right-col">
      <ul class="listUl">
        <li class="first-li" @click="MeClick('0')" :class="{active:cur==0}">
          <div class="cont">
            <h1>{{GoodTop.sppPrice | capitalizeOne}}</h1>
            <p>人均卖品金额({{GoodTop.sppPrice | foo}})</p>
          </div>
        </li>
        <li @click="MeClick('1')" :class="{active:cur==1}">
          <div>卖品收入</div>
          <div>
            <span>{{GoodTop.salesVolume | capitalizeOne}}</span>{{GoodTop.salesVolume | foo}}
          </div>
        </li>
        <li @click="MeClick('2')" :class="{active:cur==2}">
          <div>购买率</div>
          <div>
            <span>{{GoodTop.buyRate | woo}}</span>%
          </div>
        </li>
        <li @click="MeClick('3')" :class="{active:cur==3}">
          <div>客单价</div>
          <div>
            <span>{{GoodTop.unitPrice | capitalizeOne}}</span>{{GoodTop.unitPrice | foo}}
          </div>
        </li>
        <li @click="MeClick('4')" :class="{active:cur==4}">
          <div>套餐销售占比</div>
          <div>
            <span>{{GoodTop.setmealSalesVolumePercent | woo}}</span>%
          </div>
        </li>
      </ul>
    </div>

    <!--人均卖品收入Content -->
    <div class="PerCapita_Content ModuleKPI" v-if="cur==0">
      <!-- KPI -->
      <div class="ModuleTitleLayout" v-if="flag">
        <div class="ModuleTitle">
          <div>
            KPI完成率
            <el-tooltip class="item" effect="dark" placement="right-start">
              <div slot="content" style="width:300px">
                <ul id="ulMain">
                  <li>人均卖品收入当日达成 : <span>{{CurrentSellKPIDataCine.sppCurrent | capitalizeOne}}{{CurrentSellKPIDataCine.sppCurrent | foo}}</span></li>
                  <li>环比前一日 : <span :class="[CurrentSellKPIDataCine.sppChainDay > 0? 'green':'red']"><i class="iconfont" style="font-size:12px" :class="[CurrentSellKPIDataCine.sppChainDay > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></i>{{CurrentSellKPIDataCine.sppChainDay | woo}}%</span></li>
                  <li>月至今达成 : <span>{{CurrentSellKPIDataCine.sppMonthToNow | capitalizeOne}}{{CurrentSellKPIDataCine.sppMonthToNow | foo}}</span></li>
                  <li>环比上月 : <span :class="[CurrentSellKPIDataCine.sppChainMonth > 0? 'green':'red']"><i class="iconfont" style="font-size:12px" :class="[CurrentSellKPIDataCine.sppChainMonth > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></i>{{CurrentSellKPIDataCine.sppChainMonth | woo}}%</span></li>
                  <li>本月目标为 : <span>{{CurrentSellKPIDataCine.sppTarget | capitalizeOne}}</span>{{CurrentSellKPIDataCine.sppTarget | foo}}</li>
                  <li>距目标额差距 : <span :class="[CurrentSellKPIDataCine.sppGap > 0? 'green':'red']">{{CurrentSellKPIDataCine.sppGap | woo}}</span>%</li>
                </ul>
              </div>
              <i class="iconfont icon-danchuang-tishi"></i>
            </el-tooltip>
          </div>
          <div class="last">截止:{{this.startDate && this.endDate}}</div>
        </div>
        <div class="kip-wrap">
          <sell-dash-cine :SellKPIvalueCine="CurrentSellKPIDataCine"></sell-dash-cine>
        </div>
      </div>
      <!--人均卖品收入趋势 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>人均卖品收入趋势</div>
          <div></div>
        </div>
        <ve-line
          :data="SelllineData"
          :legend-visible="false"
          :settings="lineSettings"
          :extend="lineExtend"
        ></ve-line>
      </div>
    </div>

    <!--卖品总收入Content -->
    <div class="Revenue_Content ModuleKPI" v-if="cur==1">    
      <!--卖品总收入 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>卖品收入各品类占比</div>
          <div></div>
        </div>
        <!-- 饼状图 -->
        <ve-pie
          class="veRing"
          :data="ChartRevenue"
          :settings="categorySettings"
          :extend="pieExtend"
          :colors="colors"
        ></ve-pie>
      </div>
    </div>

    <!--购买率Content -->
    <div class="Purchase_Content ModuleKPI" v-if="cur==2">    
      <!--购买率 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>购买率各品类对比</div>
          <div></div>
        </div>
        <!-- 条形图 -->
        <ve-bar 
        :data="ChartRate"
        :colors="barColors"
        :extend="barExtend"
        ></ve-bar>
      </div>
    </div>

    <!--客单价Content -->
    <div class="Customer_Content ModuleKPI" v-if="cur==3">    
      <!--客单价 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>客单价各品类对比</div>
          <div></div>
        </div>
        <!-- 条形图 -->
        <ve-bar 
        :data="ChartsCust"
        :colors="barColors"
        :extend="barExtendTwo"
        ></ve-bar>
      </div>
    </div>
    <!--套餐消费占比趋势Content -->
    <div class="Purchase_Content ModuleKPI" v-if="cur==4">    
      <!--套餐消费占比趋势 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>套餐消费占比趋势</div>
          <div></div>
        </div>
        <!-- 条形图 -->
        <ve-line
          :data="ChartsLine"
          :legend-visible="false"
          :settings="lineSettings"
          :extend="lineExtendTwo"
        ></ve-line>
      </div>
    </div>
    
  </div>
</template>
<script>
import SellDashCine from './KPI/SellDashCine'
export default {
  components:{
    SellDashCine
  },
  name: "BoxOffice",
  props: {
    GoodTop: {
      type: Object
    },
    GoodTableTop: {
      type: Array
    },
    SelllineData: {
      type: Object
    },
    cityId:{
      type: Number
    },
    memberId:{
      type: Number
    },
    SellKPIDataCine:{
      type: Object
    },
    SellTotal:{
      type: Number
    },
    startDate:{
      type: String
    },
    endDate:{
      type: String
    },
    timeType:{
      type: String
    }
  },
  data() {
    this.lineExtend = {
      'xAxis.0.axisLabel.rotate': 60,
      xAxis:{
        offset:10
      },
      tooltip: {
        trigger: 'axis',
        //在这里设置
        formatter: '{a0} : {c0}元'
      }
    };
    this.lineExtendTwo = {
      'xAxis.0.axisLabel.rotate': 60,
      xAxis:{
        offset:10
      },
      tooltip: {
        trigger: 'axis',
        //在这里设置
        formatter: '{a0} : {c0}%'
      }
    };
    this.chartSettings = {
      roseType: "radius",
      offsetY: "100"
    };
    this.barColors = [
      '#3B74FF'
    ],
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
    return {
      CurrentSellKPIDataCine:JSON.parse(JSON.stringify(this.SellKPIDataCine)),
      flag:true,
      cur:0,
      currentPage:1,// 当前页码
      pageSize:10,// 每页大小
      total:'100',
      BoxType:true,
      BoxPage:true,
      loading: false,
      Boxcityid:this.cityId,
      BoxMemberId:this.memberId,
      GoodsTableMain:[],  //卖品指标数据
      GoodsTablePage:[],  //卖品分页数据
      ChartRevenue:{      //玫瑰图
        columns: [],
        rows: []
      },
      ChartRate:{         //购买率条形图
        columns: [],
        rows: []
      },
      ChartsCust:{        //客单价条形图
        columns: [],
        rows: []
      },
      ChartsLine:{        //套餐销售占比
        columns: [],
        rows: []
      },
      // 1.1折线图的设置
      lineSettings: {
        smooth: false,
        itemStyle: {
          color: "#3B74FF", // 折线点颜色
          lineStyle: {
            color: "#FE825E"
          }
        }
      },
      //玫瑰图设置
      categorySettings: {
        roseType: "radius",
        label: {
          normal: {
            textStyle: {
              color: '#666666'
            }
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '15',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: true,
            lineStyle: {
              color: '#BCBCBC'
            }
          }
        },
        radius:"140"
      },
      pieExtend: {
        legend: {
          top: "bottom",
          itemWidth: 12,
          itemHeight: 12,
          align: "auto",
          textStyle: {
            color: "#666",
            fontSize: 12
          }
        }
      },
      barExtend:{
        legend: {
          show:false
        },
        barWidth: 10,
        tooltip: {
          trigger: 'axis',
          //在这里设置
          formatter: '{a0} : {c0}%'
        }
      },
      barExtendTwo:{
        legend: {
          show:false
        },
        barWidth: 10,
        tooltip: {
          trigger: 'axis',
          //在这里设置
          formatter: '{a0} : {c0}元'
        }
      }
    };
  },
  watch: {
    SellKPIDataCine(val){
      this.CurrentSellKPIDataCine = val
    }
  },
  filters: {
    woo(value){
      if (!value) return ""
      return value.toFixed(2)
    },
    //处理万元单位
    capitalizeOne(value) {
      if (!value) return ""
      let newValue = value.toString();
      //判断逻辑
      if(newValue.indexOf('.') != -1){
        
        if(newValue.length < 7){
          return Number(newValue + '0').toFixed(2)
        }
        else if(newValue.length >= 7 && newValue.length <= 11){
          return (newValue / 10000).toFixed(2)
        }
        else if(newValue.length >= 12){
          return ((newValue / 10000) / 10000).toFixed(2)
        }
      }
      else
      {
        if(newValue.length < 5){
          return Number(newValue + '.00').toFixed(2)
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
    },
    //处理万人单位计算
    too(value){
      if (!value) return ""

      let newValue = value.toString();
      let too = ''

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
    }
  },
  methods: {
    active(){
      this.cur= 0
    },
    clickPush(){
      this.$router.push({
        path: "/analysis/cinema/sale/total"
      });
    },
    foo(val){
      this.flag = val
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    MeClick(val){
      this.cur = val
      if(val === '0'){
        if(this.BoxType){
          //调用人均卖品指标数据
          this.getSellGoodsTab('spp_price');
        }
      }
      else if(val === '1'){
        if(this.BoxType){
         //调用卖品收入指标数据
         this.getSellGoodsTab('sales_volume');
        }
      }
      else if(val === '2'){
         if(this.BoxType){
          //调用购买率指标数据
          this.getSellGoodsTab('buy_rate');
         }
      }
      else if(val === '3'){
        if(this.BoxType){
          //调用客单价票价指标数据
          this.getSellGoodsTab('unit_price');
         }
      }
      else if(val === '4'){
        if(this.BoxType){
          //调用套餐销售指标数据
          this.getSellGoodsTab('meal_sales');
         }
      }
    },
    //卖品指标切换接口
    getSellGoodsTab (val) {
      this.BoxType = val
      this.$nextTick(() => {
        this.$camList.SwitchSellGoodsTab({
          body: {
            groupId:44,
            startDate: this.startDate,
            endDate: this.endDate,
            dateType: this.timeType,
            pageSize:this.pageSize,
            pageNo:this.currentPage,
            columnType:this.BoxType,
            cityId:this.Boxcityid,
            cinemaId:this.BoxMemberId,
            initSppPrice:this.SellTotal
          }
        })
        .then(response => {
          let res = response.data;
          //获取总数据
          if(this.BoxType === "spp_price"){
            if(res.sellGoodsKpiInfo){
              //获取KPI
              this.CurrentSellKPIDataCine = res.sellGoodsKpiInfo;
            }
          }
          else if(this.BoxType === "sales_volume"){
            //获取卖品收入玫瑰图
            this.getRevenChart(res)
          }
          else if(this.BoxType === "buy_rate"){
            //获取购买率条形图
            this.getRateChart(res);
          }
          else if(this.BoxType === "unit_price"){
            //获取客单价玫瑰图
            this.getCustChart(res)
          }
          else if(this.BoxType === "meal_sales"){
            //获取套餐销售占比折线图
            this.getSalesChart(res)
          }
        });
      })
    },
    //卖品收入玫瑰图
    getRevenChart(res){
      let ChartsDataX = res.sellGoodsCategory ?  res.sellGoodsCategory.xAxis || [] : [];
      let ChartsDataY = res.sellGoodsCategory ?  res.sellGoodsCategory.yAxis || [] : [];
      //获取饼状图数据
      if(ChartsDataX && ChartsDataY){
        let foo = ChartsDataY.map(item => {
          return {
            name: item.categoryName,
            value: item.salesVolume,
          };
        });
        this.ChartRevenue.columns = ["name", "value"];
        this.ChartRevenue.rows = foo;
      }
    },
    //卖品-购买率条形图
    getRateChart(res){
      let ChartsDataX = res.sellGoodsCategory ?  res.sellGoodsCategory.xAxis || [] : [];
      let ChartsDataY = res.sellGoodsCategory ?  res.sellGoodsCategory.yAxis || [] : [];
      if(ChartsDataX && ChartsDataY){
        let foo = ChartsDataY.map(item => {
          return {
            name: item.categoryName,
            购买率: item.sellGoodsBuyRate
          };
        });
        this.ChartRate.columns = ["name", "购买率"];
        this.ChartRate.rows = foo;
      }
    },
    //卖品-客单价条形图
    getCustChart(res){
      let ChartsDataX = res.sellGoodsCategory ?  res.sellGoodsCategory.xAxis || [] : [];
      let ChartsDataY = res.sellGoodsCategory ?  res.sellGoodsCategory.yAxis || [] : [];

      if(ChartsDataX && ChartsDataY){
        let foo = ChartsDataY.map(item => {
          return {
            name: item.categoryName,
            客单价: item.unitPrice
          };
        });
        this.ChartsCust.columns = ["name", "客单价"];
        this.ChartsCust.rows = foo;
      }
    },
    //卖品销售占比
    getSalesChart(res){
      // 折线图
      this.ChartsLine.columns = ["日期", "套餐销售占比"];
      this.ChartsLine.rows = res.sellGoodsIndex.yAxis.map(item => {
        return {
          日期: item.dateKey,
          套餐销售占比: item.setmealSalesVolumePercent
        };
      });
    },
    //router跳转
    clickCity(index, row) {
      let cityid = row.cityId;
      let cinemaid = row.cinemaId;
      this.$router.push({
        path: "/Cinema/home",
        query: {
          cityid: cityid,
          Member: cinemaid
        }
      });
    },
     // 影院卖品分析
     goDetail(){
      this.$router.push({name:"影院卖品分析"})
    }
  }
};
</script>

<style lang="scss" scoped>
.kip-wrap {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  .kip {
    width: 100%;
    height: auto;
  }
}
.BoxContainer {
  background: white;
  border-radius: 6px;
  .BoxOffice {
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 6px;
    .BoxTitle {
      box-sizing: border-box;
      width: 100%;
      line-height: 40px;
      padding: 0 16px;
      font-size: 16px;
      font-weight: bold;
      .iconfont {
        margin-right: 5px;
        color: #1296db;
        position: relative;
        top: -2px;
      }
      .icon-arrow {
        font-size: 10px;
        color: #3b74ff;
        position: relative;
        top: 0px;
      }
      .tip {
        font-size: 12px;
        color: #3b74ff;
        font-weight: normal;
        vertical-align: middle;
      }
    }
  }
  .right-col {
    height: 151px;
    position: relative;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    .listUl {
      padding: 0px;
      margin: 0px;
      padding-left: 43%;
      li.first-li{
        position: absolute;
        left: 0px;
        width: 43%;
        height: 151px;
        display: flex;
        justify-content: center;
        align-items: center;
        .cont{
          padding:0px;
          h1 {
            margin: 0px;
            color: black;
            font-size: 44px;
            text-align: center;
            display: block;
            margin-top:13px;
          }
          p {
            font-size: 12px;
            color: #333333;
            text-align: center;
          }
        }
      }
      li.active > .cont > p{
        color:#3b74ff;
      } 
      li.active > .cont > h1{
        color:#3b74ff;
      }
      li.active{
        background:#e8efff;
      }
      li.active div{
        color:#3b74ff;
      }
      li.active div > span{
        color:#3b74ff;
      }
      li {
        display: flex;
        justify-content: space-between;
        height: 37px;
        line-height: 37px;
        border-bottom: 1px solid #f3f3f3;
        div {
          font-size: 12px;
          color: #666666;
          padding: 0px 10px;
          span {
            font-family: "Microsoft YaHei";
            font-size: 18px;
            color: black;
            letter-spacing: -1px;
            font-weight: bold;
            margin-right:3px;
          }
        }
        div.last {
          text-align: right;
        }
      }
    }
    i {
      position: absolute;
      right: 151px;
      bottom: 12px;
      color: #3b74ff;
      font-size: 12px;
    }
  }
}
//iconfont
.ModuleTitle .icon-danchuang-tishi {
  color: #3b74ff;
  font-size: 12px;
  margin-left: 10px;
  position: relative;
  top:-2px;
}

//Table表格设置
.CityModuleLayout {
  height: auto;
  background: none;
}
.ModuleTable {
  .el-table {
    .el-table__row {
      td {
        padding: 0px;
        height: 35px;
        line-height: 35px;
      }
    }
  }
}
.ModuleTable {
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
}

.ModuleTable {
  width: 93%;
  margin: 0 auto;
  .el-table__header-wrapper {
    .has-gutter {
      tr th {
        padding: 0px;
      }
    }
  }
}
.icon-shouye-maipin {
  color: #f79414 !important;
}
.page {
  text-align: center;
}
.icon-neiye-shangshengjiantou{
  color:green;
}
.icon-neiye-xiajiangjiantou{
  color:red;
}
.green{
  color:green;
}
.red{
  color:red;
}
#ulMain{
  width:250px;
  list-style-type:none;
  padding:0px;
  margin:0px;
  li{
    line-height:23px;
  }
}
</style>