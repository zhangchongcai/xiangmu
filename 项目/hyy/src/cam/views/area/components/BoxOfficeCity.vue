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
          <span class="tip">详情</span>
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
            <p>票房收入(万元)</p>
          </div>
        </li>
        <li @click="MeClick('1')" :class="{active:cur==1}">
          <div>观影人次</div>
          <div>
            <span>{{BoxofficeTop.audienceCount | capitalizeOne}}</span>万次
          </div>
        </li>
        <li @click="MeClick('2')" :class="{active:cur==2}">
          <div>平均票价</div>
          <div>
            <span>{{BoxofficeTop.avgTicketPrice}}</span>元
          </div>
        </li>
        <li @click="MeClick('3')" :class="{active:cur==3}">
          <div>上座率</div>
          <div>
            <span>{{BoxofficeTop.attendanceRate}}</span>%
          </div>
        </li>
        <li>
          <div>市场份额</div>
          <div>
            <span>{{BoxofficeTop.marketShare}}</span>%
          </div>
        </li>
      </ul>
      <el-tooltip class="item" effect="dark" content="市场份额=本集团票房/竞对总票房" placement="bottom-start">
        <i class="iconfont icon-danchuang-tishi"></i>
      </el-tooltip>    
    </div>

    <!--票房收入Content-->
    <div class="Boxoffice_Content" v-if="cur==0">
      <!--KPI完成率-->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>
            KPI完成率
            <i class="iconfont icon-danchuang-tishi"></i>
          </div>
          <div class="last">截止:2018/02/21</div>
        </div>
        <div class="kip-wrap">
          <div style="height:200px;">
             <kip-view></kip-view>
          </div>
          <div class="flex" style="color:#666;font-size:12px;margin-top:30px">
            <div>月至今达成：8456.765元</div>
            <div>KPI值：9567.8元</div>
          </div>
        </div>
      </div>
      <!--票房收入占比 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>影片收入占比</div>
          <div></div>
        </div>
        <!-- 饼状图 -->
        <ve-pie
          class="veRing"
          :data="chartIncome"
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
            size="mini" 
            border
            :data="BoxTableTop" 
          >
            <el-table-column label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="影院名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columeName" label="票房收入" min-width="100" align="left">
              <template slot-scope="scope">
                <span>{{ scope.row.columeName}}元</span>
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
      <!--分页 -->
      <div class="page">
        <el-pagination 
          background 
          layout="prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.total" 
        >
        </el-pagination>
      </div>
    </div>

    <!--观影人次Content-->
    <div class="Viewing_Content" v-if="cur==1">
      <!--影片收入占比 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>观影人次占比</div>
          <div></div>
        </div>
        <!-- 饼状图 -->
        <ve-pie
          ref="one"
          class="veRing"
          :data="ChartViewing"
          :settings="categorySettings"
          :extend="pieExtend"
          :colors="colors"
        ></ve-pie>
 
      </div>
      <!--城市体详情 -->
      <div class="ModuleTitleLayout CityModuleLayout" >
        <div class="ModuleTitle">
          <div>城市体详情</div>
          <div></div>
        </div>
        <div class="ModuleTable reset-table"> 
          <el-table
            size="mini" 
            :data="BoxTableTop" 
            border
          >
            <el-table-column label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="影院名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columeName" label="观影人次" min-width="100" align="left">
              <template slot-scope="scope">
                <span>{{ scope.row.columeName}}人</span>
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
      <!--分页 -->
      <div class="page">
        <el-pagination 
          background 
          layout="prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="this.currentPage"
          :page-size="this.pageSize"
          :total="this.total" 
        >
        </el-pagination>
      </div>
    </div>

    <!--平均票价Content-->
    <div class="Average_Content" v-if="cur==2">
      <!--影片收入占比 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>平均票价收入占比</div>
          <div></div>
        </div>
        <!-- 条形图 -->
        <ve-bar 
          :data="ChartBarfare"
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
          <el-table size="mini" :data="BoxTableTop" border>
            <el-table-column label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="影院名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columeName" label="平均票价" min-width="100" align="left">
              <template slot-scope="scope">
                <span>{{ scope.row.columeName}}元</span>
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
      <!--分页 -->
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

    <!--上座率Content-->
    <div class="Attendance_Content" v-if="cur==3">
      <!--影片收入占比 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>上座率占比</div>
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
          <el-table size="mini" :data="BoxTableTop" border>
            <el-table-column label="序号" min-width="68" type="index" align="left"></el-table-column>
            <el-table-column prop="name" label="影院名称" min-width="100" align="left">
              <template slot-scope="scope">
                <span class="color" @click="clickCity(scope.$index, scope.row)">{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="columeName" label="上座率" min-width="100" align="left">
              <template slot-scope="scope">
                <span>{{ scope.row.columeName}}%</span>
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
      <!--分页 -->
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
import KipView from '../../partical/kpi'
export default {
  components:{KipView},
  name: "BoxOffice",
  props: {
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
      type:String
    },
    memberId:{
      type:String
    },
    time:{
      type:String
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
      cur:0,
      currentPage:1,// 当前页码
      pageSize:10,// 每页大小
      total:'100',
      BoxType:true,
      BoxPage:true,
      loading: false,
      Boxcityid:this.cityId,
      BoxMemberId:this.memberId,
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
        radius:"120"
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
        }
      },
      //条形图
      barExtend:{
        barWidth: 10,
      }
    }
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
    MeClick(val){
      this.cur = val
      if(val === '0'){
        if(this.BoxType){
          //调用票房首页指标数据
          this.getBoxOfficeTab('box_office');
          //调用票房首页分页数据
          this.getBoxPages('box_office',this.currentPage);
        }
      }
      else if(val === '1'){
        if(this.BoxType){
         //调用观影人次指标数据
         this.getBoxOfficeTab('audience_count');
         //调用观影人次分页数据
         this.getBoxPages('audience_count',this.currentPage);
         
         
        }
      }
      else if(val === '2'){
         if(this.BoxType){
          //调用平均票价指标数据
          this.getBoxOfficeTab('avg_ticket_price');
          //调用平均票价分页数据
          this.getBoxPages('avg_ticket_price',this.currentPage);
         
         }
      }
      else if(val === '3'){
        if(this.BoxType){
          //调用上座率票价指标数据
          this.getBoxOfficeTab('attendance_rate');
          //调用上座率票价分页数据
          this.getBoxPages('attendance_rate',this.currentPage);
         }
      }
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleCurrentChange: function(val){
      this.currentPage = val
      if(this.BoxType === "box_office"){
        //调用票房首页分页数据
        this.getBoxPages('box_office',this.currentPage)
      }else if(this.BoxType === "audience_count"){
        //调用观影人次分页数据
        this.getBoxPages('audience_count',this.currentPage)
      }else if(this.BoxType === "avg_ticket_price"){
        //调用平均票价分页数据
        this.getBoxPages('avg_ticket_price',this.currentPage)
      }else if(this.BoxType === "attendance_rate"){
        //调用上座率票价分页数据
        this.getBoxPages('attendance_rate',this.currentPage)
      }
    },
    //票房分页公用组件
    getBoxPages(val,currentPage){
      this.currentPage = currentPage ? currentPage : 1
      this.BoxType = val;
        this.$camList.BoxPager({
          body: {
            groupId: 1,
            startDate: this.time,
            endDate: this.time,
            chainPerType: "day",
            pageSize:this.pageSize,
            pageNo:this.currentPage,
            columnType:this.BoxType,
            cityId:this.Boxcityid,
            cinemaId:this.BoxMemberId
          }
        })
        .then(res => {
            let resData = res.boxOfficeCinemaPageInfo.list
            this.BoxTablePage = resData;
            this.total = res.boxOfficeCinemaPageInfo.total
            this.BoxTableTop = this.BoxTablePage; 
        });
    },
    //票房指标切换接口
    getBoxOfficeTab (val) {
      this.BoxType = val
        this.$camList.SwitchBoxOfficeTab({
          body: {
            groupId: 1,
            startDate: this.time,
            endDate: this.time,
            chainPerType: "day",
            pageSize:this.pageSize,
            pageNo:this.currentPage,
            columnType:this.BoxType,
            cityId:this.Boxcityid,
            cinemaId:this.BoxMemberId
          }
        })
        .then(res => {
          if(this.BoxType === "audience_count"){
            let resData = res.boxOfficeCinemaPageInfo.list;
            //把数据赋值到新变量
            this.BoxTableMain = resData;
            this.BoxTableTop = this.BoxTableMain
            //初始化观影人次玫瑰图数据
            this.getViewChart(res)
          } 
          else if(this.BoxType === "avg_ticket_price"){
            let resData = res.boxOfficeCinemaPageInfo.list;
            //把数据赋值到新变量
            this.BoxTableMain = resData;
            this.BoxTableTop = this.BoxTableMain

            //初始化平均票价条形图
            this.getFareChart(res)
          }
          else if(this.BoxType === "attendance_rate"){
            let resData = res.boxOfficeCinemaPageInfo.list;
            //把数据赋值到新变量
            this.BoxTableMain = resData;
            this.BoxTableTop = this.BoxTableMain

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
            value: item.boxOffice
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
            name: item.movieName,
            '平均票价': item.avgBoxOffice
          };
        });
        this.ChartBarfare.columns = ["name", "平均票价"];
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
            name: item.movieName,
            '上座率': item.offerSeatPercent
          };
        });
        this.ChartRate.columns = ["name", "上座率"];
        this.ChartRate.rows = foo;
      }
    },
    //router跳转
    clickCity(index, row) {
      let cityId = row.cityId;
      let cinemaId = row.cinemaId;
      this.$router.push({
        path: "/Cinema/home",
        query: {
          cityId: cityId,
          Member: cinemaId
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
      right: 177px;
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