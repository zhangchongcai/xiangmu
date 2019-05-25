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
          <span class="tip cursor" @click="clickPush()">详情</span>
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
    <div class="PerCapita_Content" v-if="cur==0">
      <!-- KPI -->
      <div class="ModuleTitleLayout ModuleKPI" v-if="flag">
        <div class="ModuleTitle ">
          <div>
            KPI完成率
            <el-tooltip class="item" effect="dark" placement="right-start">
              <div slot="content" style="width:300px">
                <ul id="ulMain">
                  <li>人均卖品收入当日达成 : <span>{{SellKPIData.sppCurrent | capitalizeOne}}{{SellKPIData.sppCurrent | foo}}</span></li>
                  <li>环比前一日 : <span :class="[SellKPIData.sppChainDay > 0? 'green':'red']"><i class="iconfont" style="font-size:12px" :class="[SellKPIData.sppChainDay > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></i>{{SellKPIData.sppChainDay | woo}}%</span></li>
                  <li>月至今达成 : <span>{{SellKPIData.sppMonthToNow | capitalizeOne}}{{SellKPIData.sppMonthToNow | foo}}</span></li>
                  <li>环比上月 : <span :class="[SellKPIData.sppChainMonth > 0? 'green':'red']"><i class="iconfont" style="font-size:12px" :class="[SellKPIData.sppChainMonth > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></i>{{SellKPIData.sppChainMonth | woo}}%</span></li>
                  <li>本月目标为 : <span>{{SellKPIData.sppTarget | capitalizeOne}}</span>{{SellKPIData.sppTarget | foo}}</li>
                  <li>距目标额差距 : <span :class="[SellKPIData.sppGap > 0? 'green':'red']">{{SellKPIData.sppGap | woo}}%</span></li>
                </ul>
              </div>
              <i class="iconfont icon-danchuang-tishi"></i>
            </el-tooltip>
          </div>
          <div class="last">截止:{{this.startDate && this.endDate}}</div>
        </div>
        <div class="kip-wrap">
          <Sell-dash :SellKPIvalue="SellKPIData" ></Sell-dash>
        </div>
      </div>
      <!--人均卖品收入趋势 -->
      <div class="ModuleTitleLayout ModuleKPI">
        <div class="ModuleTitle">
          <div>人均卖品收入趋势</div>
          <div></div>
        </div>
        <ve-line
          :data="lineData"
          :legend-visible="false"
          :settings="lineSettings"
          :extend="lineExtend"
        ></ve-line>
      </div>
      <!--区域详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>区域详情</div>
          <div></div>
        </div>

        <div class="ModuleTable reset-table topTable">
          <el-table 
            :data="CurrentGoodTableTop" 
            border 
            size="mini"
            @sort-change='SortChange'
            :default-sort = "{prop: 'showNumSell', order: 'descending'}"
          >
            <el-table-column prop="id" label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="showNumSell" label="人均卖品收入" min-width="115" align="left" sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.showNumSell }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent > 0? scope.row.columePercent.toFixed(2) : scope.row.columePercent.toFixed(2).substr(1,5) }}%</span>
                </div>
                <div v-else>
                  <span style="font-size:30px">--</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--分页-->
      <div class="page">
        <el-pagination 
          background 
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.totalPage" 
        ></el-pagination>
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
      <!--区域详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>区域详情</div>
          <div></div>
        </div>
        <div class="ModuleTable reset-table topTable">
          <el-table 
            :data="CurrentGoodTableTop" 
            border 
            size="mini"
            @sort-change='SortChange'
            :default-sort = "{prop: 'showNumSell', order: 'descending'}"
          >
            <el-table-column prop="id" label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="showNumSell" label="卖品收入" min-width="100" align="left" sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.showNumSell }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent > 0? scope.row.columePercent.toFixed(2) : scope.row.columePercent.toFixed(2).substr(1,5) }}%</span>
                </div>
                <div v-else>
                  <span style="font-size:30px">--</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--分页-->
      <div class="page">
        <el-pagination 
          background 
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.totalPage" 
        ></el-pagination>
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
      <!--区域详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>区域详情</div>
          <div></div>
        </div>

        <div class="ModuleTable reset-table topTable">
          <el-table 
            :data="CurrentGoodTableTop" 
            border 
            size="mini"
            @sort-change='SortChange'
            :default-sort = "{prop: 'showNumSell', order: 'descending'}"
          >
            <el-table-column prop="id" label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="showNumSell" label="购买率" min-width="100" align="left" sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.showNumSell }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent > 0? scope.row.columePercent.toFixed(2) : scope.row.columePercent.toFixed(2).substr(1,5) }}%</span>
                </div>
                <div v-else>
                  <span style="font-size:30px">--</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--分页-->
      <div class="page">
        <el-pagination 
          background 
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.totalPage" 
        ></el-pagination>
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
      <!--区域详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>区域详情</div>
          <div></div>
        </div>

        <div class="ModuleTable reset-table topTable">
          <el-table 
            :data="CurrentGoodTableTop" 
            border 
            size="mini"
            @sort-change='SortChange'
            :default-sort = "{prop: 'showNumSell', order: 'descending'}"
          >
            <el-table-column prop="id" label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="showNumSell" label="客单价" min-width="100" align="left" sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.showNumSell}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent > 0? scope.row.columePercent.toFixed(2) : scope.row.columePercent.toFixed(2).substr(1,5) }}%</span>
                </div>
                <div v-else>
                  <span style="font-size:30px">--</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--分页-->
      <div class="page">
       <el-pagination 
          background 
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.totalPage" 
        ></el-pagination>
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
          :extend="lineExtendMain"
        ></ve-line>
      </div>
      <!--区域详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>区域详情</div>
          <div></div>
        </div>

        <div class="ModuleTable reset-table topTable">
          <el-table 
            :data="CurrentGoodTableTop" 
            border 
            size="mini"
            @sort-change='SortChange'
            :default-sort = "{prop: 'showNumSell', order: 'descending'}"
          >
            <el-table-column prop="id" label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="showNumSell" label="套餐消费占比" min-width="115" align="left" sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.showNumSell }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent > 0? scope.row.columePercent.toFixed(2) : scope.row.columePercent.toFixed(2).substr(1,5) }}%</span>
                </div>
                <div v-else>
                  <span style="font-size:30px">--</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <!--分页-->
      <div class="page">
        <el-pagination 
          background 
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.totalPage" 
        ></el-pagination>
      </div>
    </div>
    
  </div>
</template>

<script>
import SellDash from "./KPI/SellDash"
export default {
  components:{
    SellDash
  },
  name: "BoxOffice",
  props: {
    GoodTop: {
      type: Object
    },
    GoodTableTop: {
      type: Array
    },
    lineData: {
      type: Object
    },
    SellKPIData:{
      type:Object
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
    },
    initSellPage:{
      type: Number
    }
  },
  components: {
    SellDash
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
        formatter: '{a0} :<br> \{c0}<br>元'
      }
    };
    this.lineExtendMain = {
      'xAxis.0.axisLabel.rotate': 60,
      xAxis:{
        offset:10
      },
      tooltip: {
        trigger: 'axis',
        //在这里设置
        formatter: '{a0} :<br> \{c0}<br>%'
      }
    };
    this.pieExtend = {
      legend: {
        bottom: "10%",
        itemWidth: 12,
        itemHeight: 12,
        align: "auto",
        textStyle: {
          color: "#666",
          fontSize: 12
        }
      },
      formatter: '{a0} :<br> \{c0}<br>元'
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
      seq:'',
      CurrentGoodTableTop:JSON.parse(JSON.stringify(this.GoodTableTop)),
      flag:false,
      cur:0,
      currentPage:1,// 当前页码
      pageSize:10,// 每页大小
      totalPage:0,
      BoxType:"spp_price",
      BoxPage:true,
      loading: false,
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
        offsetY: "180",
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
        radius:"105"
      },
      //条形图
      barExtend:{
        tooltip: {
          trigger: 'axis',
          //在这里设置
          formatter: '{a0} : {c0} %'
        },
        barWidth: 10,
        legend:{
          show:false
        }
      },
      barExtendTwo:{
        tooltip: {
          trigger: 'axis',
          //在这里设置
          formatter: '{a0} : {c0} 元'
        },
        barWidth: 10,
        legend:{
          show:false
        }
      }
    };
  },
  watch: {
    GoodTableTop(val){
      this.CurrentGoodTableTop = val
    }
  },
  filters: {
    woo(value){
      if (!value) return ""
      return value.toFixed(2)
    },
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

      if(newValue.indexOf('.') != -1){
        if(newValue.length < 7){
          foo = '元'
          return foo
        }
        else if(newValue.length >= 7 && newValue.length <= 11){
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
    }
  },
  methods: {
    active(){
      this.cur = 0
      this.currentPage = 1
    },
    clickPush(){
      this.$router.push({
        path: "/analysis/group/sale/total"
      });
    },
    formatValue(num, company) {
      let showNum
      if (num < 10000) {
          showNum = `${num.toFixed(2)}${company}`
      } 
      if (num >= 10000 && num < 100000000) {
          showNum = `${(num/10000).toFixed(2)}万${company}`
      }
      if (num >= 100000000) {
          showNum = `${(num/100000000).toFixed(2)}亿${company}`
      }
      return showNum
    },
    testFun(){
      this.totalPage = this.initSellPage
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
    //排序事件
    SortChange(column){
      if(column.order === 'descending'){
        this.seq = 'DESC'
        this.$camList.GoodsPager({
          body: {
            groupId: 44,
            columnType: this.BoxType,
            startDate: this.startDate,
            endDate: this.endDate,
            dateType: this.timeType,
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            seq:this.seq
          }
        })
        .then(response => {
          let res = response.data;
          
          if(this.BoxType === "spp_price"){
            //判断人均卖品金额
            if(res.sellGoodsCinemaPageInfo){
              res.sellGoodsCinemaPageInfo.list.forEach(item => {
                item.showNumSell = this.formatValue(item.columeName,'元')
              })
              this.CurrentGoodTableTop = res.sellGoodsCinemaPageInfo.list
            }
          }
          else if(this.BoxType === "sales_volume"){
            //判断卖品收入
            if(res.sellGoodsCinemaPageInfo){
              res.sellGoodsCinemaPageInfo.list.forEach(item => {
                item.showNumSell = this.formatValue(item.columeName,'元')
              })
              this.CurrentGoodTableTop = res.sellGoodsCinemaPageInfo.list
            }
          }
          else if(this.BoxType === "buy_rate"){
            //判断购买率
            if(res.sellGoodsCinemaPageInfo){
              res.sellGoodsCinemaPageInfo.list.forEach(item => {
                item.showNumSell = this.formatValue(item.columeName,'%')
              })
              this.CurrentGoodTableTop = res.sellGoodsCinemaPageInfo.list
            }
          }
          else if(this.BoxType === "unit_price"){
            //判断客单价
            if(res.sellGoodsCinemaPageInfo){
              res.sellGoodsCinemaPageInfo.list.forEach(item => {
                item.showNumSell = this.formatValue(item.columeName,'元')
              })
              this.CurrentGoodTableTop = res.sellGoodsCinemaPageInfo.list
            }
          }
          else if(this.BoxType === "meal_sales"){
            //判断套餐销售占比
            if(res.sellGoodsCinemaPageInfo){
              res.sellGoodsCinemaPageInfo.list.forEach(item => {
                item.showNumSell = this.formatValue(item.columeName,'%')
              })
              this.CurrentGoodTableTop = res.sellGoodsCinemaPageInfo.list
            }
          }
          
        });
      }
      else if(column.order === 'ascending'){
        this.seq = 'ASC'
        this.$camList.GoodsPager({
          body: {
            groupId: 44,
            columnType: this.BoxType,
            startDate: this.startDate,
            endDate: this.endDate,
            dateType: this.timeType,
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            seq:this.seq
          }
        })
        .then(response => {
          let res = response.data;
           if(this.BoxType === 'spp_price'){
            //判断人均卖品金额
            if(res.sellGoodsCinemaPageInfo){
              res.sellGoodsCinemaPageInfo.list.forEach(item => {
                item.showNumSell = this.formatValue(item.columeName,'元')
              })
              this.CurrentGoodTableTop = res.sellGoodsCinemaPageInfo.list
            }
          }
          else if(this.BoxType === 'sales_volume'){
            //判断卖品收入
            if(res.sellGoodsCinemaPageInfo){
              res.sellGoodsCinemaPageInfo.list.forEach(item => {
                item.showNumSell = this.formatValue(item.columeName,'元')
              })
              this.CurrentGoodTableTop = res.sellGoodsCinemaPageInfo.list
            }
          }
          else if(this.BoxType === 'buy_rate'){
            //判断购买率
            if(res.sellGoodsCinemaPageInfo){
              res.sellGoodsCinemaPageInfo.list.forEach(item => {
                item.showNumSell = this.formatValue(item.columeName,'%')
              })
              this.CurrentGoodTableTop = res.sellGoodsCinemaPageInfo.list
            }
          }
          else if(this.BoxType === 'unit_price'){
            //判断客单价
            if(res.sellGoodsCinemaPageInfo){
              res.sellGoodsCinemaPageInfo.list.forEach(item => {
                item.showNumSell = this.formatValue(item.columeName,'元')
              })
              this.CurrentGoodTableTop = res.sellGoodsCinemaPageInfo.list
            }
          }
          else if(this.BoxType === "meal_sales"){
            //判断套餐销售占比
            if(res.sellGoodsCinemaPageInfo){
              res.sellGoodsCinemaPageInfo.list.forEach(item => {
                item.showNumSell = this.formatValue(item.columeName,'%')
              })
              this.CurrentGoodTableTop = res.sellGoodsCinemaPageInfo.list
            }
          }
        });
      }
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleCurrentChange(val){
      this.currentPage = val
      if(this.BoxType === "spp_price"){
        //调用票房首页分页数据
        this.getGoodsPages('spp_price',this.currentPage,this.seqType)
      }else if(this.BoxType === "sales_volume"){
        //调用观影人次分页数据
        this.getGoodsPages('sales_volume',this.currentPage,this.seqType)
      }else if(this.BoxType === "buy_rate"){
        //调用平均票价分页数据
        this.getGoodsPages('buy_rate',this.currentPage,this.seqType)
      }else if(this.BoxType === "unit_price"){
        //调用上座率票价分页数据
        this.getGoodsPages('unit_price',this.currentPage,this.seqType)
      }else if(this.BoxType === "meal_sales"){
        //调用上座率票价分页数据
        this.getGoodsPages('meal_sales',this.currentPage,this.seqType)
      }
    },
    //票房分页公用组件
    getGoodsPages(val,currentPage,seq){
      this.currentPage = currentPage ? currentPage : 1
      this.BoxType = val;

      if(this.seq === 'DESC'){
        this.seqType = this.seq
      }
      else if(this.seq === 'ASC'){
        this.seqType = this.seq
      }

      this.$camList.GoodsPager({
        body: {
          groupId: 44,
          columnType:this.BoxType,
          startDate: this.startDate,
          endDate: this.endDate,
          dateType: this.timeType,
          pageSize:this.pageSize,
          pageNo:this.currentPage,
          seq:this.seqType
        }
      })
      .then(response => {
        let res = response.data;
        if(this.BoxType === "spp_price"){
          res.sellGoodsCinemaPageInfo.list.forEach(item => {
            item.showNumSell = this.formatValue(item.columeName,'元')
          })
        }
        else if(this.BoxType === "sales_volume"){
          res.sellGoodsCinemaPageInfo.list.forEach(item => {
            item.showNumSell = this.formatValue(item.columeName,'元')
          })
        }
        else if(this.BoxType === "buy_rate"){
          res.sellGoodsCinemaPageInfo.list.forEach(item => {
            item.showNumSell = this.formatValue(item.columeName,'%')
          })
        }
        else if(this.BoxType === "unit_price"){
          res.sellGoodsCinemaPageInfo.list.forEach(item => {
            item.showNumSell = this.formatValue(item.columeName,'元')
          })
        }
        else if(this.BoxType === "meal_sales"){
          res.sellGoodsCinemaPageInfo.list.forEach(item => {
            item.showNumSell = this.formatValue(item.columeName,'%')
          })
        }
        this.CurrentGoodTableTop = res.sellGoodsCinemaPageInfo.list? res.sellGoodsCinemaPageInfo.list:[];

      });
    },
    //卖品指标切换接口
    getSellGoodsTab (val,currentPage) {
      this.currentPage = currentPage ? currentPage : 1
      this.BoxType = val
      this.$nextTick(() => {
        this.$camList.SwitchSellGoodsTab({
          body: {
            groupId: 44,
            startDate: this.startDate,
            endDate: this.endDate,
            dateType: this.timeType,
            pageSize:this.pageSize,
            pageNo:this.currentPage,
            columnType:this.BoxType,
            initSppPrice:this.SellTotal
          }
        })
        .then(response => {
          let res = response.data;
          //获取总数据
          if(this.BoxType === "spp_price"){
            res.sellGoodsCinemaPageInfo.list.forEach(item => {
              item.showNumSell = this.formatValue(item.columeName,'元')
            })
            this.CurrentGoodTableTop = res.sellGoodsCinemaPageInfo.list? res.sellGoodsCinemaPageInfo.list: '';
            
            //获取KPI
            let ResKPI = res.sellGoodsKpiInfo;
            this.SellKPIData = ResKPI

          } 
          else if(this.BoxType === "sales_volume"){
            res.sellGoodsCinemaPageInfo.list.forEach(item => {
              item.showNumSell = this.formatValue(item.columeName,'元')
            })
            this.CurrentGoodTableTop = res.sellGoodsCinemaPageInfo.list? res.sellGoodsCinemaPageInfo.list: '';

            //获取卖品收入玫瑰图
            this.getRevenChart(res)
          }
          else if(this.BoxType === "buy_rate"){
            res.sellGoodsCinemaPageInfo.list.forEach(item => {
              item.showNumSell = this.formatValue(item.columeName,'%')
            })
            this.CurrentGoodTableTop = res.sellGoodsCinemaPageInfo.list? res.sellGoodsCinemaPageInfo.list: '';
            //获取购买率条形图
            this.getRateChart(res);
          }
          else if(this.BoxType === "unit_price"){
            res.sellGoodsCinemaPageInfo.list.forEach(item => {
              item.showNumSell = this.formatValue(item.columeName,'元')
            })
            this.CurrentGoodTableTop = res.sellGoodsCinemaPageInfo.list? res.sellGoodsCinemaPageInfo.list: '';
            //获取客单价玫瑰图
            this.getCustChart(res)
          }
          else if(this.BoxType === "meal_sales"){
            res.sellGoodsCinemaPageInfo.list.forEach(item => {
              item.showNumSell = this.formatValue(item.columeName,'%')
            })
            this.CurrentGoodTableTop = res.sellGoodsCinemaPageInfo.list? res.sellGoodsCinemaPageInfo.list: '';
            //获取套餐销售占比折线图
            this.getSalesChart(res)
          }
        });
      })
    },
    clickCity(index, row) {
      let cityId = row.cityId;
      this.$router.push({
        path: "/analysis/area/home",
        query: {
          cityId: cityId
        }
      });
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
      //获取饼状图数据
      if(ChartsDataX && ChartsDataY){
        let foo = ChartsDataY.map(item => {
          return {
            name: item.categoryName,
            "购买率": item.sellGoodsBuyRate
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
      //获取饼状图数据
      if(ChartsDataX && ChartsDataY){
        let foo = ChartsDataY.map(item => {
          return {
            name: item.categoryName,
            '客单价': item.unitPrice
          };
        });
        this.ChartsCust.columns = ["name", "客单价"];
        this.ChartsCust.rows = foo;
      }
    },
    //套餐销售占比
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
    // 集团卖品详情
    goDetail(){
      this.$router.push({name:"集团卖品分析"})
    }
  }
};
</script>

<style lang="scss" scoped>
#ulMain{
  width:250px;
  list-style-type:none;
  padding:0px;
  margin:0px;
  li{
    line-height:23px;
  }
}
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
    height:151px;
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
  top:-2px
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
.el-table .cell > .color{
  color:#3b74ff;
}
.el-table .cell > .color:hover{
  cursor:pointer;
}
.green{
  color:green;
}
.red{
  color:red;
}
.el-pagination{
  padding-bottom:20px;
}
</style>