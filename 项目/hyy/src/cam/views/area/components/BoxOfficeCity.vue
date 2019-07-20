<template>
  <div class="BoxContainer">
    <!--票房详情-->
    <div class="BoxOffice">
      <div class="BoxTitle flex" height="40">
        <div>
          <span class="iconfont icon-shouye-piaofang"></span>
          <span>票房</span>
        </div>
        <div>
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
            <h1>{{BoxofficeTop.boxOffice | capitalizeOne}}</h1>
            <p>票房收入({{BoxofficeTop.boxOffice | foo}})</p>
          </div>
        </li>
        <li @click="MeClick('1')" :class="{active:cur==1}">
          <div>观影人次</div>
          <div>
            <span>{{BoxofficeTop.audienceCount | capitalizePerson}}</span>{{BoxofficeTop.audienceCount | too}}
          </div>
        </li>
        <li @click="MeClick('2')" :class="{active:cur==2}">
          <div>平均票价</div>
          <div v-if="BoxofficeTop.avgTicketPrice != 0">
            <span>{{BoxofficeTop.avgTicketPrice | capitalizeOne}}</span>{{BoxofficeTop.avgTicketPrice | foo}}
          </div>
          <div v-else-if="BoxofficeTop.avgTicketPrice == 0">
            <span>0</span>元
          </div>
          <div v-else>
            <span>--</span>
          </div> 
        </li>
        <li @click="MeClick('3')" :class="{active:cur==3}">
          <div>上座率</div>
          <div>
            <span>{{ BoxofficeTop.attendanceRate | woo}}</span>%
          </div>
        </li>
        <li>
          <!-- <div>
            市场份额
           <el-tooltip class="item" effect="dark" content="市场份额=自身票房收入/全国大盘票房收入" placement="bottom-start">
            <i class="iconfont icon-danchuang-tishi"></i>
           </el-tooltip>  
          </div> -->
          <div>市场份额</div>
          <div v-if="BoxofficeTop.marketShare != 0">
            <span>{{ BoxofficeTop.marketShare | woo}}</span>%
          </div>
          
          <div v-else>
            <span>--</span>
          </div>

        </li>
      </ul>
       <el-tooltip class="item" effect="dark" content="市场份额=自身票房收入/全国大盘票房收入" placement="bottom-start">
          <i class="iconfont icon-danchuang-tishi"></i>
       </el-tooltip>  
    </div>

    <!--票房收入Content-->
    <div class="Boxoffice_Content ModuleKPI" v-if="cur==0">
      <!--KPI完成率-->
      <div class="ModuleTitleLayout" v-if="flag">
        <div class="ModuleTitle">
          <div>
            KPI完成率
            <el-tooltip class="item" effect="dark" placement="right-start">
              <div slot="content" style="width:300px">
                <ul id="ulMain">
                  <li>票房收入当日达成 : <span>{{BoxKPIDataCity.boxOfficeCurrent | capitalizeOne}}{{BoxKPIDataCity.boxOfficeCurrent | foo}}</span></li>
                  <li>环比前一日 : <span :class="[BoxKPIDataCity.boxOfficeChainDay > 0? 'green':'red']"><i class="iconfont" style="font-size:12px" :class="[BoxKPIDataCity.boxOfficeChainDay > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></i>{{BoxKPIDataCity.boxOfficeChainDay | woo}}%</span></li>
                  <li>月至今达成 : <span>{{BoxKPIDataCity.boxOfficeMonthToNow | capitalizeOne}}{{BoxKPIDataCity.boxOfficeMonthToNow | foo}}</span></li>
                  <li>环比上月 : <span :class="[BoxKPIDataCity.boxOfficeChainMonth > 0? 'green':'red']"><i class="iconfont" style="font-size:12px" :class="[BoxKPIDataCity.boxOfficeChainMonth > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></i>{{BoxKPIDataCity.boxOfficeChainMonth | woo}}%</span></li>
                  <li>本月目标为 : <span>{{BoxKPIDataCity.boxOfficeTarget | capitalizeOne}}{{BoxKPIDataCity.boxOfficeTarget | foo}}</span></li>
                  <li>达成率 : <span>{{BoxKPIDataCity.boxOfficeRate | woo}}</span>%</li>
                  <li>与时间进度差距为 : <span :class="[BoxKPIDataCity.timeRateGap > 0? 'green':'red']">{{BoxKPIDataCity.timeRateGap | woo}}%</span></li>
                  <li>按目前进度,预计月底达成率为 : <span>{{BoxKPIDataCity.boxOfficeExpect}}</span>%</li>
                  <li>与目标额差距 : <span :class="[BoxKPIDataCity.boxOfficeGap > 0? 'green':'red']">{{BoxKPIDataCity.boxOfficeGap | woo}}%</span></li>
                </ul>
              </div>
              <i class="iconfont icon-danchuang-tishi"></i>
            </el-tooltip>
          </div>
          <div class="last">截止:{{this.startDate && this.endDate}}</div>
        </div>
        <div class="kip-wrap">
          <box-dash-city :BoxKPIvalue="BoxKPIDataCity"></box-dash-city>
        </div>
      </div>
      <!--票房收入占比 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>影片收入占比</div>
          <div></div>
        </div>
        <!-- 饼状图 -->
        <ve-ring 
          width="100%"
          class="veRing"
          :data="chartIncome"
          :settings="categorySettings"
          :extend="pieExtendTwo"
          :colors="colors"
          :data-empty="chartEmpty"
        ></ve-ring>
      </div>
      <!--区域详情 -->
      <div class="ModuleTitleLayout CityModuleLayout">
        <div class="ModuleTitle">
          <div>区域详情</div>
          <div></div>
        </div>
        <div class="ModuleTable reset-table topTable">
          <el-table 
            size="mini" 
            border
            :data="CurrentBoxTableTop" 
            @sort-change='SortChange'
            :default-sort = "{prop: 'showNumCity', order: 'descending'}"
            ref="table0"
          >
            <el-table-column label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="影院名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="showNumCity" label="票房收入" min-width="100" align="left" sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.showNumCity }}</span>
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
      <!--分页 -->
      <div class="reset-page">
        <el-pagination v-if="this.totalPage>10"
          background 
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.totalPage" 
        >
        </el-pagination>
      </div>
    </div>

    <!--观影人次Content-->
    <div class="Viewing_Content ModuleKPI" v-if="cur==1">
      <!--影片收入占比 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>观影人次占比</div>
          <div></div>
        </div>
        <!-- 饼状图 -->
        <ve-ring
          ref="one"
          class="veRing"
          :data="ChartViewing"
          :settings="categorySettingsPerson"
          :extend="pieExtend"
          :colors="colors"
        ></ve-ring>
 
      </div>
      <!--区域详情 -->
      <div class="ModuleTitleLayout CityModuleLayout" >
        <div class="ModuleTitle">
          <div>区域详情</div>
          <div></div>
        </div>
        <div class="ModuleTable reset-table topTable"> 
          <el-table
            size="mini" 
            :data="CurrentBoxTableTop" 
            border
            @sort-change='SortChange'
            :default-sort = "{prop: 'showNumCity', order: 'descending'}"
            ref="table1"
          >
            <el-table-column label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="影院名称" min-width="100" align="left" >
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="showNumCity" label="观影人次" min-width="100" align="left" sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.showNumCity }}</span>
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
      <!--分页 -->
      <div class="reset-page">
        <el-pagination v-if="this.totalPage>10"
          background 
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.totalPage" 
        >
        </el-pagination>
      </div>
    </div>

    <!--平均票价Content-->
    <div class="Average_Content ModuleKPI" v-if="cur==2">
      <!--影片收入占比 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>平均票价收入对比</div>
          <div></div>
        </div>
        <!-- 条形图 -->
        <ve-bar 
          :data="ChartBarfare"
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
            size="mini" 
            :data="CurrentBoxTableTop" 
            border
            @sort-change='SortChange'
            :default-sort = "{prop: 'showNumCity', order: 'descending'}"
            ref="table2"
          >
            <el-table-column label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="影院名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="showNumCity" label="平均票价" min-width="100" align="left" sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.showNumCity }}</span>
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
      <!--分页 -->
      <div class="reset-page">
        <el-pagination v-if="this.totalPage>10"
          background 
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.totalPage" 
        ></el-pagination>
      </div>
    </div>

    <!--上座率Content-->
    <div class="Attendance_Content ModuleKPI" v-if="cur==3">
      <!--影片收入占比 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>上座率对比</div>
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
            size="mini" 
            :data="CurrentBoxTableTop" 
            border
            @sort-change='SortChange'
            :default-sort = "{prop: 'showNumCity', order: 'descending'}"
            ref="table3"
          >
            <el-table-column label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="影院名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="showNumCity" label="上座率" min-width="100" align="left" sortable="custom">
              <template slot-scope="scope">
                <span>{{ scope.row.showNumCity}}</span>
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
      <!--分页 -->
      <div class="reset-page">
       <el-pagination v-if="this.totalPage>10"
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
import BoxDashCity from "./KPI/BoxDashCity";
export default {
  components:{
    BoxDashCity
  },
  name: "BoxOffice",
  props: {
    BoxTotal:{
      type: Number
    },
    BoxofficeTop: {
      type: Object
    },
    BoxTableTop: {
      type: Array
    },
    chartIncome: {
      type: Object
    },
    chartViewing: {
      type: Object
    },
    chartBarfare: {
      type: Object
    },
    lineData: {
      type: Object
    },
    cityId:{
      type: [Number,String]
    },
    cityName: {
      type: String
    },
    BoxKPIDataCity:{
      type:Object
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
    dateTypeActive:{
      default:null,
    },
    dateTypeIndex:{
       default:null,
    },
    initBoxPage:{
      type:Number
    }
  },
  
  data() {
    this.barColors = [
      '#3B74FF'
    ], 
    //玫瑰图
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
      chartEmpty: true,
      CurrentBoxTableTop:JSON.parse(JSON.stringify(this.BoxTableTop)),
      flag:true,
      seq:'',
      seqType:'',
      cur:0,
      currentPage:1,// 当前页码
      pageSize:10,// 每页大小
      totalPage:0,
      BoxType:'box_office',
      BoxPage:true,
      loading: false,
      Boxcityid:this.cityId,
      BoxTableMain:[],  //票房指标数据
      BoxTablePage:[],  //票房分页数据
      //观影人次饼图
      ChartViewing:{
        columns: [],
        rows: []
      },
      //平均票价条形图
      ChartBarfare:{
        columns: [],
        rows: []
      },
      //上座率条形图
      ChartRate:{
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
      // 折线图扩展
      lineExtend: {},
      //玫瑰图设置
      categorySettings: {
        top:0,
        roseType: 'radius',
        label: { // 文本标签
          formatter:(params)=>{
            let value = this.formatValue(params.value,'元');
            let percent = params.percent;
            let str =  percent + '%';
            return str
          }
        },
        labelLine:{
          normal:{
            length:5,
            length2:5
          }
        }
      },
      categorySettingsPerson: {
        top:0,
        roseType: 'radius',
        label: { // 文本标签
          formatter:(params)=>{
            let value = this.formatPerson(params.value*1,'人');
            let percent = params.percent;
            let str = percent + '%';
            return str
          }
        },
        labelLine:{
          normal:{
            length:5,
            length2:5
          }
        }
      },
      //玫瑰图扩展
      pieExtend: {
        legend: {
          top: "bottom",
          width:'350',
          bottom: 0,
          itemGap: 20,
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            color: "#666",
            fontSize: 12
          }
        },
        tooltip:{
          trigger:'item',
          formatter:(params)=>{
            let value = this.formatPerson(params.value,'人');
            let percent = params.percent;
            let name = params.name;
            let str = name + '<br>' + value + '('+ percent + '%)'
            return  str
          }
        }
      },
      pieExtendTwo: {
        legend: {
          top: "bottom",
          width:'350',
          bottom: 0,
          itemGap: 20,
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            color: "#666",
            fontSize: 12
          }
        },
        tooltip:{
          trigger:'item',
          formatter:(params)=>{
              let value = this.formatValue(params.value,'元');
              let percent = params.percent;
              let name = params.name;
              let str = name + '<br>' + value + '('+ percent + '%)'
              return  str
          }
        }
      },
      barExtendTwo:{
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter:(params)=>{
            let value = this.formatValue(params[1].value*1,'元');
            let name = params[0].value;
            let str = name + '<br>' + value 
            return  str;
          }
        },
        barWidth: 10,
        legend:{
          show:false
        }
      },
      //条形图
      barExtend:{
        tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'shadow'
          },
          formatter:function(params){
            if(Number(params[1].value)){
              return params[0].value + '<br/> '+ params[1].value + '%'
            }
          }
        },
        barWidth: 10,
        legend:{
          show:false
        }
      }
    }
  },
  filters: {
    woo(value){
      if (!value) return "--"
      return value.toFixed(2)
    },
    capitalizeOne(value) {
      if (!value) return "--"
      if(value < 10000){
          return value.toFixed(2) < 10000 ? value.toFixed(2) : '1.00';
      }else if(value < 100000000){
          return (value/10000).toFixed(2) < 10000 ? (value/10000).toFixed(2) : '1.00';
      }else {
          return (value/100000000).toFixed(2);
      }
    },
    //处理万人计算保留两位小数
    capitalizePerson(value) {
      if (!value) return "--"
      if(value < 10000){
          return value.toFixed(2) < 10000 ? value.toFixed(2) : '1.00';
      }else if(value < 100000000){
          return (value/10000).toFixed(2) < 10000 ? (value/10000).toFixed(2) : '1.00';
      }else {
          return (value/100000000).toFixed(2);
      }
    },
    //处理万元计算
    foo(value){
      if (!value) return ""
      if(value < 10000){
          return value.toFixed(2) < 10000 ? '元' : '万元';
      }else if(value < 100000000){
          return (value/10000).toFixed(2) < 10000 ? '万元' : '亿元'; 
      }else {
          return '亿元' 
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
  watch: {
    BoxTableTop(val){
      this.CurrentBoxTableTop = val
    },
    chartIncome: {
      handler: function (val, oldVal){
        if(val.rows && val.rows.length > 0){
          this.chartEmpty = false
        }else {
          this.chartEmpty = true
        }
      },
      deep: true
    }
  },
  methods: {
    // 跳转票房详情 区域页面
    goDetail(){
      this.$router.push({
        path: "/analysis/area/boxOffice/total",
        query: {
          name: this.cityName,
          cityId: this.cityId,
          startTime:this.startDate,
          endTime:this.endDate,
          dateType:this.timeType,
          dateTypeIndex:this.dateTypeIndex
        }
      });
    },
    active(){
      this.cur= 0
      this.currentPage = 1
    },
    formatPercentage(num, company) {
      let showNum
      if (num < 10000) {
          showNum = `${num.toFixed(2)}${company}`
      } 
      if (num >= 10000 && num < 100000000) {
          showNum = `${num.toFixed(2)}${company}`
      }
      if (num >= 100000000) {
          showNum = `${num.toFixed(2)}${company}`
      }
      return showNum
    },
    formatValue(money, company) {
      let showNumCity = null;
      let num = money*1;
      if (num < 10000) {
          showNumCity = `${num.toFixed(2)}${company}`
      } 
      if (num >= 10000 && num < 100000000) {
          showNumCity = `${(num/10000).toFixed(2)}万${company}`
      }
      if (num >= 100000000) {
          showNumCity = `${(num/100000000).toFixed(2)}亿${company}`
      }
      return showNumCity
    },
    formatPerson(num, company) {
      let showNumCity
      if (num < 10000) {
            let count = (num*1).toFixed(0);
            showNumCity = `${count}${company}`
      } 
      if (num >= 10000 && num < 100000000) {
          showNumCity = `${(num/10000).toFixed(2)}万${company}`
      }
      if (num >= 100000000) {
          showNumCity = `${(num/100000000).toFixed(2)}亿${company}`
      }
      return showNumCity
    },
    //初始化分页数据
    testFun(){
      this.totalPage = this.initBoxPage
    },
    foo(val){
      this.flag = val
    },
    MeClick(val){
      this.$refs['table0'] && this.$refs['table0'].sort('showNumCity','descending')
      this.$refs['table1'] && this.$refs['table1'].sort('showNumCity','descending')
      this.$refs['table2'] && this.$refs['table2'].sort('showNumCity','descending')
      this.$refs['table3'] && this.$refs['table3'].sort('showNumCity','descending')
      this.cur = val
      if(val === '0'){
        
        if(this.BoxType){
          //调用票房首页指标数据
          this.getBoxOfficeTab('box_office');
        }
      }
      else if(val === '1'){
        
        if(this.BoxType){
         //调用观影人次指标数据
         this.getBoxOfficeTab('audience_count');
        }
      }
      else if(val === '2'){
        
        if(this.BoxType){
          //调用平均票价指标数据
          this.getBoxOfficeTab('avg_ticket_price');
        }
      }
      else if(val === '3'){
        
        if(this.BoxType){
          //调用上座率票价指标数据
          this.getBoxOfficeTab('attendance_rate');
        }
      }
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleCurrentChange: function(val){
      this.currentPage = val
      if(this.BoxType === "box_office"){
        //调用票房首页分页数据
        this.getBoxPages('box_office',this.currentPage,this.seqType)
      }else if(this.BoxType === "audience_count"){
        //调用观影人次分页数据
        this.getBoxPages('audience_count',this.currentPage,this.seqType)
      }else if(this.BoxType === "avg_ticket_price"){
        //调用平均票价分页数据
        this.getBoxPages('avg_ticket_price',this.currentPage,this.seqType)
      }else if(this.BoxType === "attendance_rate"){
        //调用上座率票价分页数据
        this.getBoxPages('attendance_rate',this.currentPage,this.seqType)
      }
    },
    //排序事件
    SortChange(column){
      if(column.order === 'descending'){
        this.seq = 'DESC'
        this.$camList.BoxPager({
          body: {
            columnType: this.BoxType,
            startDate: this.startDate,
            endDate: this.endDate,
            dateType: this.timeType,
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            cityId:this.Boxcityid,
            seq:this.seq
          }
        })
        .then(response => {
          let res = response.data;
          
          if(this.BoxType === 'box_office'){
            //判断票房收入的
            if(res.boxOfficeCinemaPageInfo){
              res.boxOfficeCinemaPageInfo.list.forEach(item => {
                item.showNumCity = this.formatValue(item.columeName,'元')
              })
              this.CurrentBoxTableTop = res.boxOfficeCinemaPageInfo.list
            }
          }
          else if(this.BoxType === 'audience_count'){
            //判断观影人次
            if(res.boxOfficeCinemaPageInfo){
              res.boxOfficeCinemaPageInfo.list.forEach(item => {
                item.showNumCity = this.formatPerson(item.columeName,'人')
              })
              this.CurrentBoxTableTop = res.boxOfficeCinemaPageInfo.list
            }
          }
          else if(this.BoxType === 'avg_ticket_price'){
            //判断平均票价
            if(res.boxOfficeCinemaPageInfo){
              res.boxOfficeCinemaPageInfo.list.forEach(item => {
                item.showNumCity = this.formatValue(item.columeName,'元')
              })
              this.CurrentBoxTableTop = res.boxOfficeCinemaPageInfo.list
            }
          }
          else if(this.BoxType === 'attendance_rate'){
            //判断上座率
            if(res.boxOfficeCinemaPageInfo){
              res.boxOfficeCinemaPageInfo.list.forEach(item => {
                item.showNumCity = this.formatPercentage(item.columeName,'%')
              })
              this.CurrentBoxTableTop = res.boxOfficeCinemaPageInfo.list
            }
          }
          
        });
      }
      else if(column.order === 'ascending'){
        this.seq = 'ASC'
        this.$camList.BoxPager({
          body: {
            columnType: this.BoxType,
            startDate: this.startDate,
            endDate: this.endDate,
            dateType: this.timeType,
            pageSize: this.pageSize,
            pageNo: this.currentPage,
            cityId:this.Boxcityid,
            seq:this.seq
          }
        })
        .then(response => {
          let res = response.data;
           if(this.BoxType === 'box_office'){
            //判断票房收入的
            if(res.boxOfficeCinemaPageInfo){
              res.boxOfficeCinemaPageInfo.list.forEach(item => {
                item.showNumCity = this.formatValue(item.columeName,'元')
              })
              this.CurrentBoxTableTop = res.boxOfficeCinemaPageInfo.list
            }
          }
          else if(this.BoxType === 'audience_count'){
            //判断观影人次
            if(res.boxOfficeCinemaPageInfo){
              res.boxOfficeCinemaPageInfo.list.forEach(item => {
                item.showNumCity = this.formatPerson(item.columeName,'人')
              })
              this.CurrentBoxTableTop = res.boxOfficeCinemaPageInfo.list
            }
          }
          else if(this.BoxType === 'avg_ticket_price'){
            //判断平均票价
            if(res.boxOfficeCinemaPageInfo){
              res.boxOfficeCinemaPageInfo.list.forEach(item => {
                item.showNumCity = this.formatValue(item.columeName,'元')
              })
              this.CurrentBoxTableTop = res.boxOfficeCinemaPageInfo.list
            }
          }
          else if(this.BoxType === 'attendance_rate'){
            //判断上座率
            if(res.boxOfficeCinemaPageInfo){
              res.boxOfficeCinemaPageInfo.list.forEach(item => {
                item.showNumCity = this.formatPercentage(item.columeName,'%')
              })
              this.CurrentBoxTableTop = res.boxOfficeCinemaPageInfo.list
            }
          }
        });
      }
    },
    //票房分页公用组件
    getBoxPages(val,currentPage,seq){
      this.currentPage = currentPage ? currentPage : 1
      this.BoxType = val;
      if(this.seq === 'DESC'){
        this.seqType = this.seq
      }
      else if(this.seq === 'ASC'){
        this.seqType = this.seq
      }
      this.$camList.BoxPager({
        body: {
          startDate: this.startDate,
          endDate: this.endDate,
          dateType: this.timeType,
          pageSize:this.pageSize,
          pageNo:this.currentPage,
          columnType:this.BoxType,
          cityId:this.Boxcityid,
          seq:this.seqType
        }
      })
      .then(response => {
          let res = response.data;
          if(this.BoxType === "box_office"){
            res.boxOfficeCinemaPageInfo.list.forEach(item => {
              item.showNumCity = this.formatValue(item.columeName,'元')
            })
          }
          else if(this.BoxType === "audience_count"){
            res.boxOfficeCinemaPageInfo.list.forEach(item => {
            item.showNumCity = this.formatPerson(item.columeName,'人')
            })
          }
          else if(this.BoxType === "avg_ticket_price"){
            res.boxOfficeCinemaPageInfo.list.forEach(item => {
            item.showNumCity = this.formatValue(item.columeName,'元')
            })
          }
          else if(this.BoxType === "attendance_rate"){
            res.boxOfficeCinemaPageInfo.list.forEach(item => {
            item.showNumCity = this.formatPercentage(item.columeName,'%')
            })
          }
          this.CurrentBoxTableTop = res.boxOfficeCinemaPageInfo.list;
      });
    },
    //票房指标切换接口
    getBoxOfficeTab (val,currentPage) {
      this.BoxType = val
      this.currentPage = currentPage ? currentPage : 1
      this.$camList.SwitchBoxOfficeTab({
        body: {
          startDate: this.startDate,
          endDate: this.endDate,
          dateType: this.timeType,
          pageSize:this.pageSize,
          pageNo:this.currentPage,
          columnType:this.BoxType,
          cityId:this.Boxcityid,
          initBoxOffice:this.BoxTotal
        }
      })
      .then(response => {
        let res = response.data;
        if(this.BoxType === "box_office"){
          res.boxOfficeCinemaPageInfo.list.forEach(item => {
              item.showNumCity = this.formatPerson(item.columeName,'元')
          })
          this.CurrentBoxTableTop = res.boxOfficeCinemaPageInfo.list;
          //获取KPI
          this.BoxKPIDataCity = res.boxOfficeKpiInfo;
        }
        else if(this.BoxType === "audience_count"){
          res.boxOfficeCinemaPageInfo.list.forEach(item => {
            item.showNumCity = this.formatPerson(item.columeName,'人')
          })
          this.CurrentBoxTableTop = res.boxOfficeCinemaPageInfo.list;

          //初始化观影人次玫瑰图数据
          this.getViewChart(res)
        } 
        else if(this.BoxType === "avg_ticket_price"){
          res.boxOfficeCinemaPageInfo.list.forEach(item => {
            item.showNumCity = this.formatValue(item.columeName,'元')
          })
          this.CurrentBoxTableTop = res.boxOfficeCinemaPageInfo.list;
          //初始化平均票价条形图 
          this.getFareChart(res)
        }
        else if(this.BoxType === "attendance_rate"){
          res.boxOfficeCinemaPageInfo.list.forEach(item => {
            item.showNumCity = this.formatPercentage(item.columeName,'%')
          })
          this.CurrentBoxTableTop = res.boxOfficeCinemaPageInfo.list;
          
          //初始化上座率条形图
          this.getChartRate(res)
        }
      });
    },  
    //票房-观影人次玫瑰图
    getViewChart(res){
      let ChartsDataX = res.boxOfficeMovies ?  res.boxOfficeMovies.xAxis || [] : [];
      let ChartsDataY = res.boxOfficeMovies ?  res.boxOfficeMovies.yAxis || [] : [];
      //获取饼状图数据
      if(ChartsDataX && ChartsDataY){
        let foo = ChartsDataY.map(item => {
          return {
            name: item.movieName,
            value: item.audienceCount.toFixed(2)
          };
        });
        this.ChartViewing.columns = ["name", "value"];
        this.ChartViewing.rows = foo;
      }
    },
    //票房-平均票价条形图
    getFareChart(res){
      let ChartsDataX = res.boxOfficeMovies ?  res.boxOfficeMovies.xAxis || [] : [];
      let ChartsDataY = res.boxOfficeMovies ?  res.boxOfficeMovies.yAxis || [] : [];
      //获取饼状图数据
      if(ChartsDataX && ChartsDataY){
        let foo = ChartsDataY.map(item => {
          return {
            newName: item.movieName.length > 8? (item.movieName.substr(0,8) + '...'):(item.movieName),
            name: item.movieName,
            平均票价: item.avgBoxOffice.toFixed(2)
          };
        });
        this.ChartBarfare.columns = ["newName","name", "平均票价"];
        this.ChartBarfare.rows = foo;
      }
    },
    //票房-上座率条形图
    getChartRate(res){
      let ChartsDataX = res.boxOfficeMovies ?  res.boxOfficeMovies.xAxis || [] : [];
      let ChartsDataY = res.boxOfficeMovies ?  res.boxOfficeMovies.yAxis || [] : [];
      //获取饼状图数据
      if(ChartsDataX && ChartsDataY){
        let foo = ChartsDataY.map(item => {
          return {
            newName: item.movieName.length > 8? (item.movieName.substr(0,8) + '...'):(item.movieName),
            name: item.movieName,
            '上座率': item.offerSeatPercent.toFixed(2)
          };
        });
        this.ChartRate.columns = ["newName","name", "上座率"];
        this.ChartRate.rows = foo;
      }
    },
    //router跳转
    clickCity(index, row) {
      let cityId = row.cityId;
      let cinemaId = row.cinemaId;
      let cityName = row.name;
      this.$router.push({
        path: "/analysis/cinema/home",
        query: {
          cityId: cityId,
          Member: cinemaId,
          startTime:this.startDate,
          endTime:this.endDate,
          dateType:this.timeType,
          dateTypeIndex:this.dateTypeIndex,
          cityName:cityName
        }
      });
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
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
      right: 165px;
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
  width: 93%;
  margin: 0 auto;
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
  .el-table__header-wrapper {
    .has-gutter {
      tr th {
        padding: 0px;
      }
    }
  }
}
.icon-shouye-piaofang {
  color: #0845f788 !important;
}
.reset-table .el-table th.is-leaf {
  padding: 0px;
}
.veRing {
  position: relative;
  top: -35px;
}
.icon-neiye-shangshengjiantou{
  color:#2DBC2D;
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
  color:#2DBC2D;
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