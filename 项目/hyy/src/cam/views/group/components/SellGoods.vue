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
          <span class="tip cursor">详情</span>
          <i class="iconfont icon-neiye-zhankaijiantou icon-arrow"></i>
        </div>
      </div>
    </div>

    <!--nav导航-->
    <div class="right-col">
      <ul class="listUl">
        <li class="first-li" @click="MeClick('0')" :class="{active:cur==0}">
          <div class="cont">
            <h1>{{GoodTop.sppPrice | capitalizeFloor}}</h1>
            <p>人均卖品金额(元)</p>
          </div>
        </li>
        <li @click="MeClick('1')" :class="{active:cur==1}">
          <div>卖品收入</div>
          <div>
            <span>{{GoodTop.salesVolume | capitalizeOne}}</span>万元
          </div>
        </li>
        <li @click="MeClick('2')" :class="{active:cur==2}">
          <div>购买率</div>
          <div>
            <span>{{GoodTop.buyRate}}</span>%
          </div>
        </li>
        <li @click="MeClick('3')" :class="{active:cur==3}">
          <div>客单价</div>
          <div>
            <span>{{GoodTop.unitPrice | capitalizeFloor}}</span>元
          </div>
        </li>
        <li @click="MeClick('4')" :class="{active:cur==4}">
          <div>套餐销售占比</div>
          <div>
            <span>{{GoodTop.setmealSalesVolumePercent}}</span>%
          </div>
        </li>
      </ul>
    </div>

    <!--人均卖品收入Content -->
    <div class="PerCapita_Content" v-if="cur==0">
      <!-- KPI -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>
            KPI完成率
            <i class="iconfont icon-danchuang-tishi"></i>
          </div>
          <div class="last">截止:2018/02/21</div>
        </div>
        <div class="kip-wrap">
          <Sell-dash :SellKPIvalue="SellKPIData" ></Sell-dash>
        </div>
      </div>
      <!--人均卖品收入趋势 -->
      <div class="ModuleTitleLayout">
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
      <!--城市体详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>城市体详情</div>
          <div></div>
        </div>

        <div class="ModuleTable reset-table">
          <el-table 
            :data="GoodTableTop" 
            border 
            size="mini"
          >
            <el-table-column prop="id" label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columeName" label="人均卖品收入" min-width="100" align="left">
              <template slot-scope="scope">
                <span>{{ scope.row.columeName }}元</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent }}%</span>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.total" 
        ></el-pagination>
      </div>
    </div>

    <!--卖品总收入Content -->
    <div class="Revenue_Content" v-if="cur==1">    
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
      <!--城市体详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>城市体详情</div>
          <div></div>
        </div>
        <div class="ModuleTable reset-table">
          <el-table 
            :data="GoodTableTop" 
            border 
            size="mini"
          >
            <el-table-column prop="id" label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columeName" label="卖品收入" min-width="100" align="left">
              <template slot-scope="scope">
                <span>{{ scope.row.columeName }}元</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent }}%</span>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.total" 
        ></el-pagination>
      </div>
    </div>

    <!--购买率Content -->
    <div class="Purchase_Content" v-if="cur==2">    
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
      <!--城市体详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>城市体详情</div>
          <div></div>
        </div>

        <div class="ModuleTable reset-table">
          <el-table 
            :data="GoodTableTop" 
            border 
            size="mini"
          >
            <el-table-column prop="id" label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columeName" label="购买率" min-width="100" align="left">
              <template slot-scope="scope">
                <span>{{ scope.row.columeName }}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent }}%</span>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.total" 
        ></el-pagination>
      </div>
    </div>

    <!--客单价Content -->
    <div class="Customer_Content" v-if="cur==3">    
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
        :extend="barExtend"
        ></ve-bar>
      </div>
      <!--城市体详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>城市体详情</div>
          <div></div>
        </div>

        <div class="ModuleTable reset-table">
          <el-table 
            :data="GoodTableTop" 
            border 
            size="mini"
          >
            <el-table-column prop="id" label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columeName" label="客单价" min-width="100" align="left">
              <template slot-scope="scope">
                <span>{{ scope.row.columeName }}元</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent }}%</span>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.total" 
        ></el-pagination>
      </div>
    </div>

    <!--套餐消费占比趋势Content -->
    <div class="Purchase_Content" v-if="cur==4">    
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
          :extend="lineExtend"
        ></ve-line>
      </div>
      <!--城市体详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>城市体详情</div>
          <div></div>
        </div>

        <div class="ModuleTable reset-table">
          <el-table 
            :data="GoodTableTop" 
            border 
            size="mini"
          >
            <el-table-column prop="id" label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="城市名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columeName" label="套餐消费占比" min-width="100" align="left">
              <template slot-scope="scope">
                <span>{{ scope.row.columeName }}%</span>
              </template>
            </el-table-column>
            <el-table-column prop="columePercent" label="环比" min-width="90" align="left">
              <template slot-scope="scope">
                <div v-if='scope.row.columePercent != 0'>
                  <span class="iconfont" :class="[scope.row.columePercent > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></span>
                  <span :class="[scope.row.columePercent > 0? 'green':'red']">{{ scope.row.columePercent }}%</span>
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
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.total" 
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
    startTime: {
      type:String
    },
    endTime: {
      type:String
    },
    time:{
      type:String
    },
    SellKPIData:{
      type:Object
    }
  },
  components: {
    SellDash
  },
  data() {
    this.chartSettings = {
      roseType: "radius",
      offsetY: "50"
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
      cur:0,
      currentPage:1,// 当前页码
      pageSize:10,// 每页大小
      total:'100',
      BoxType:true,
      BoxPage:true,
      loading: false,
      isShow:1,
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
      pieExtend: {
        legend: {
          bottom: "10%",
          itemWidth: 12,
          itemHeight: 12,
          align: "auto",
          textStyle: {
            color: "#666",
            fontSize: 12
          }
        }
      },
      //条形图
      barExtend:{
        barWidth: 10,
      }
    };
  },
  filters: {
    capitalizeOne(value) {
      if (!value) return "";
      value = value / 10000;
      return value.toFixed(2);
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
  methods: {
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
          //调用人均卖品分页数据
          this.getGoodsPages('spp_price',this.currentPage);

        }
      }
      else if(val === '1'){
        if(this.BoxType){
         //调用卖品收入指标数据
         this.getSellGoodsTab('sales_volume');
         //调用卖品收入分页数据
         this.getGoodsPages('sales_volume',this.currentPage);
        }
      }
      else if(val === '2'){
         if(this.BoxType){
          //调用购买率指标数据
          this.getSellGoodsTab('buy_rate');
          //调用购买率分页数据
          this.getGoodsPages('buy_rate',this.currentPage);
         }
      }
      else if(val === '3'){
        if(this.BoxType){
          //调用客单价票价指标数据
          this.getSellGoodsTab('unit_price');
          //调用客单价票价分页数据
          this.getGoodsPages('unit_price',this.currentPage);
         }
      }
      else if(val === '4'){
        if(this.BoxType){
          //调用套餐销售指标数据
          this.getSellGoodsTab('meal_sales');
          //调用套餐销售分页数据
          this.getGoodsPages('meal_sales',this.currentPage);
         }
      }
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleCurrentChange: function(val){
      this.currentPage = val
      if(this.BoxType === "spp_price"){
        //调用票房首页分页数据
        this.getGoodsPages('spp_price',this.currentPage)
      }else if(this.BoxType === "sales_volume"){
        //调用观影人次分页数据
        this.getGoodsPages('sales_volume',this.currentPage)
      }else if(this.BoxType === "buy_rate"){
        //调用平均票价分页数据
        this.getGoodsPages('buy_rate',this.currentPage)
      }else if(this.BoxType === "unit_price"){
        //调用上座率票价分页数据
        this.getGoodsPages('unit_price',this.currentPage)
      }else if(this.BoxType === "meal_sales"){
        //调用上座率票价分页数据
        this.getGoodsPages('meal_sales',this.currentPage)
      }
    },
    //票房分页公用组件
    getGoodsPages(val,currentPage){
      this.currentPage = currentPage ? currentPage : 1
      this.BoxType = val;
        this.$camList.GoodsPager({
          body: {
            groupId: 1,
            startDate: this.time,
            endDate: this.time,
            chainPerType: "day",
            pageSize:this.pageSize,
            pageNo:this.currentPage,
            columnType:this.BoxType
          }
        })
        .then(res => {
          let resData = res.sellGoodsCinemaPageInfo.list? res.sellGoodsCinemaPageInfo.list:[];
          this.GoodsTablePage = resData;
          this.total = res.sellGoodsCinemaPageInfo.total
          this.GoodTableTop = this.GoodsTablePage; 
        });
    },
    //卖品指标切换接口
    getSellGoodsTab (val) {
      this.BoxType = val
      this.$nextTick(() => {
        this.$camList.SwitchSellGoodsTab({
          body: {
            groupId: 1,
            startDate: this.time,
            endDate: this.time,
            chainPerType: "day",
            pageSize:this.pageSize,
            pageNo:this.currentPage,
            columnType:this.BoxType
          }
        })
        .then(res => {
          //获取总数据
          if(this.BoxType === "spp_price"){
            let resData = res.sellGoodsCinemaPageInfo.list? res.sellGoodsCinemaPageInfo.list: '';
            //把数据赋值到新变量
            this.GoodsTableMain = resData;
            this.GoodTableTop = this.GoodsTableMain
            
          } 
          else if(this.BoxType === "sales_volume"){
            let resData = res.sellGoodsCinemaPageInfo.list? res.sellGoodsCinemaPageInfo.list: '';
            //把数据赋值到新变量
            this.GoodsTableMain = resData;
            this.GoodTableTop = this.GoodsTableMain

            //获取卖品收入玫瑰图
            this.getRevenChart(res)
          }
          else if(this.BoxType === "buy_rate"){
            let resData = res.sellGoodsCinemaPageInfo.list? res.sellGoodsCinemaPageInfo.list: '';
            //把数据赋值到新变量
            this.GoodsTableMain = resData;
            this.GoodTableTop = this.GoodsTableMain
            //获取购买率条形图
            this.getRateChart(res);
          }
          else if(this.BoxType === "unit_price"){
            let resData = res.sellGoodsCinemaPageInfo.list? res.sellGoodsCinemaPageInfo.list: '';
            //把数据赋值到新变量
            this.GoodsTableMain = resData;
            this.GoodTableTop = this.GoodsTableMain
            //获取客单价玫瑰图
            this.getCustChart(res)
          }
          else if(this.BoxType === "meal_sales"){
            let resData = res.sellGoodsCinemaPageInfo.list? res.sellGoodsCinemaPageInfo.list: '';
            //把数据赋值到新变量
            this.GoodsTableMain = resData;
            this.GoodTableTop = this.GoodsTableMain
            //获取套餐销售占比折线图
            this.getSalesChart(res)
          }
        });
      })
    },
    clickCity(index, row) {
      let cityId = row.cityId;
      this.$router.push({
        path: "/area/home",
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
            '购买率': item.sellGoodsBuyRate
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
.el-table .cell > .color:hover{
  color:#3b74ff;
  cursor:pointer;
}
.green{
  color:green;
}
.red{
  color:red;
}
</style>