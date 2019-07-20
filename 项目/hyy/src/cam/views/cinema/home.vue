<template>
  <!--影院-->
  <!--Syscontent-->
  <div class="SysContent">
    <div class="SysHeader">
      <div class="HeaderTop">
        <div class="query">
          <div class="left-sider" :span="12">
            <div class="left-purple-dark submitMain">
              <span style="display:inline-block;margin-right:60px;">影院: {{cityName ? cityName : cityJsonName}}</span>
              <span class="font">选择时间 :</span>
              <calendar-view size="mini" v-model="time"
                :dateType="dateType"
                :dateTypeActive='dateTypeActive'
                :dateTypeIndex="dateTypeIndex"
                @emitCalendarType="getTimeType"
                @change="changeTime"
              ></calendar-view>
            </div>
          </div>
          <div class="right-sider font">
            数据更新时间:{{updateTime}}
          </div>
        </div>
        <div class="total">
          <div class="totalLeft">
            <h1>{{allCount | capitalizeOne}}</h1>
            <p>营 业 总 额({{allCount | foo}})</p>
            <el-tooltip class="item" effect="dark" content="营业总额=票房收入+卖品收入+其他收入" placement="right-start">
              <i class="iconfont icon-danchuang-tishi"></i>
            </el-tooltip>
          </div>
          <div class="progress">
            <div class="ProgressBoxCoff">
              <div class="title">票房占比</div>
              <div class="el-progress">
                <el-progress :text-inside="true" :stroke-width="15" :percentage="+boxRadio"></el-progress>
              </div>
            </div>
            <div style="clear:both;"></div>
            <div class="ProgressBoxCoff">
              <div class="title">卖品占比</div>
              <div class="el-progress">
                <el-progress
                  :text-inside="true"
                  :stroke-width="15"
                  :percentage="+sellRadio"
                  color="rgba(254,130,94, 0.7)"
                ></el-progress>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
    <div class="SysMain">
      <el-row class="el-RowMain" :gutter="15">
        <el-col class="left" :span="8">
          <box-office-no-table
            ref="BoxOffice"
            :BoxofficeTop="BoxOffdetail"
            :chartIncome="ChartQuota"
            :cityId="cityId"
            :cityName="cityName || cityJsonName"
            :memberId="MemberId"
            :startDate="startTime"
            :endDate="endTime"
            :timeType="timeType"
            :BoxKPIDataCine="BoxKPIDataCine"
            :BoxKPIDataShare="BoxKPIDataShare"
            :BoxTotal="BoxTotal"
          ></box-office-no-table>
        </el-col>
        <el-col class="center" :span="8">
          <sell-goods-no-table
            ref="GoodsSell"
            :GoodTop="Goodsdetail"
            :SelllineData="goodsLineData"
            :cityId="cityId"
            :cityName="cityName || cityJsonName"
            :memberId="MemberId"
            :startDate="startTime"
            :endDate="endTime"
            :timeType="timeType"
            :SellKPIDataCine="SellKPIDataCine"
            :SellTotal="SellTotal"
          ></sell-goods-no-table>
        </el-col>
        <el-col class="right" :span="8">
          <member-no-table
            ref="Member"
            :MemberTop="Memberdetail"
            :MemberLineData="MemberLineData"
            :cityId="cityId"
            :cityName="cityName || cityJsonName"
            :memberId="MemberId"
            :startDate="startTime"
            :endDate="endTime"
            :timeType="timeType"
            :MemberKPIDataCine="MemberKPIDataCine"
            :MemberTotal="MemberTotal"
          ></member-no-table>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import BoxOfficeNoTable from "./components/BoxOfficeNoTable";
import SellGoodsNoTable from "./components/SellGoodsNoTable";
import MemberNoTable from "./components/MemberNoTable";
import CalendarView from '../../components/calendar/calendar'
export default {
//   name: "经营分析概览",
  data() {
    return {
      cityJsonName:'',
      boxCount: null,
      saleCount: null,
      dateType:['天', '周', '月', '年'],
      time: null,
      updateTime:'',
      timeType: null,
      startTime:null,
      endTime: null,
      dateTypeActive:null,
      dateTypeIndex:null,
      BoxTotal:0,
      MemberTotal:0,
      SellTotal:0,
      BoxOffdetail: {},
      Goodsdetail: {},
      Memberdetail: {},
      BoxTable: [],
      GoodTable: [],
      MemberTable: [],
      value2: 20,
      Boxincome: "",
      Goodsincome: "",
      MemberId: 0,
      cityId: 0,
      BoxKPIDataCine:{},    //票房KPI
      MemberKPIDataCine:{}, //会员KPI
      SellKPIDataCine:{},   //卖品KPI
      BoxKPIDataShare:{},   //市场分额KPI
      ChartQuota: {
        columns: [],
        rows: []
      },
      goodsLineData: {
        columns: [],
        rows: []
      },
      MemberLineData: {
        columns: [],
        rows: []
      }
    };
  },
  computed: {
    // 销售总额
    allCount() {
      if (this.boxCount && this.saleCount) {
        let newValue = (this.boxCount * 1 + this.saleCount * 1).toFixed(2);
        return newValue
      } else {
        return 0;
      }
    },
    // 票房占比
    boxRadio() {
      if (this.boxCount && this.saleCount) {
        return (
          (this.boxCount / (this.boxCount * 1 + this.saleCount * 1)) *
          100
        ).toFixed(2);
      } else {
        return 0;
      }
    },
    // 卖品占比
    sellRadio() {
      if (this.boxCount && this.saleCount) {
        return (
          (this.saleCount / (this.boxCount * 1 + this.saleCount * 1)) *
          100
        ).toFixed(2);
      } else {
        return 0;
      }
    }
  },
  filters: {
    capitalizeOne(value) {
      if (!value) return "--"
      let newValue = value.toString();

      if(newValue.length < 8){
        return newValue
      }
      else if(newValue.length >= 8 && newValue.length <= 11){

        return (newValue / 10000).toFixed(2)
      }
      else if(newValue.length >= 12){
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
    }
  },
  components: {
    BoxOfficeNoTable,
    SellGoodsNoTable,
    MemberNoTable,
    CalendarView
  },
  created: function() {
    this.initData()
  },
  activated: function() {
    // console.log("激活状态");
    this.initData();
  },
  deactivated: function() {
    // console.log("退出时的状态");
    this.initData();
  },
  methods: {
    initData(){
      // <--- url 时间处理 开始
      let params = this.$route.query;
      this.cityId = params.cityId?params.cityId:null;
      this.MemberId = params.Member?params.Member:null;
      this.timeType =  params.dateType? params.dateType:'day',
      this.dateTypeActive = params.dateType? params.dateType:'day',
      this.dateTypeIndex = params.dateTypeIndex?params.dateTypeIndex:null,
      this.startTime = params.startTime?params.startTime: this.$moment(new Date()).format("YYYY-MM-DD"), 
      this.endTime = params.endTime?params.endTime:this.$moment(new Date()).format("YYYY-MM-DD");
      this.cityName = params.cityName?params.cityName:null;
      // console.log(this.$route.query.cityName);
      if(this.timeType == 'day'){
        this.time = this.startTime;
      }else{
        this.time = [this.startTime,this.endTime]
      }
      // ---> url 时间处理 结束
      //获取票房数据数据
      this.getBoxOfficeData();
      //获取卖品数据数据
      this.getGoodsData();
      //获取会员数据
      this.getMemberData();
      //获取更新时间
      this.getCurrentTime();
    },
    //票房
    getBoxOfficeData() {
      this.$camList
        .BoxOfficeData({
          body: {
            cityId: this.cityId,
            cinemaId: this.MemberId,
            startDate: this.startTime,
            endDate: this.endTime,
            dateType: this.timeType,
          }
        })
        .then(response => {
          let res = response.data;
          //如果是区域直接进入
          if(res.orgName){
            this.cityJsonName = res.orgName
          }
          
          if(res){
            this.cityId = res.cityId;
            this.MemberId = res.cinemaId;
          }
          //选取周月年判断
          if(this.timeType !== 'day'){
            //是周月年时候隐藏KPI
            this.$nextTick(()=>{
              this.$refs.BoxOffice.foo(false);
            })
          }
          else{
            //是天的时候获取KPI
            if(!res.boxOfficeKpiInfo || JSON.stringify(res.boxOfficeKpiInfo) == "{}"){
              
             this.$nextTick(()=>{
                this.$refs.BoxOffice.foo(false);
              })
            }
            else{
              this.BoxKPIDataCine = res.boxOfficeKpiInfo;
              this.$nextTick(()=>{
                this.$refs.BoxOffice.foo(true);
              })
            }
          }      
          //获取票房总数据    
          if(res.boxOfficeCinemaVO){
            //票房数据
            this.BoxOffdetail = res.boxOfficeCinemaVO;
            //获取票房收入
            this.BoxTotal = res.boxOfficeCinemaVO.boxOffice;
            //取到票房总收入
            this.Boxincome = res.boxOfficeCinemaVO.boxOffice;
            this.boxCount = res.boxOfficeCinemaVO.boxOffice;
          }
          
          //初始化玫瑰图
          this.getRoseChart(res)    
        });
    },
    //卖品
    getGoodsData() {
      this.$camList
        .GoodsData({
          body: {
            cityId: this.cityId,
            cinemaId: this.MemberId,
            startDate: this.startTime,
            endDate: this.endTime,
            dateType: this.timeType,
          }
        })
        .then(response => {
          let res = response.data;
          //选取周月年判断
          if(this.timeType !== 'day'){
            //是周月年时候隐藏KPI
            this.$nextTick(()=>{
              this.$refs.GoodsSell.foo(false);
            })
          }
          else{
            //KPI
            if(!res.sellGoodsKpiInfo || JSON.stringify(res.sellGoodsKpiInfo) == "{}"){
              this.$nextTick(()=>{
                this.$refs.GoodsSell.foo(false);
              })
            }
            else{
              //获取KPI
              this.SellKPIDataCine = res.sellGoodsKpiInfo;
              this.$nextTick(()=>{
                this.$refs.GoodsSell.foo(true);
              })
            }
          }
          //获取卖品总数据
          if(res.sellGoodsCinema){
            //卖品数据
            this.Goodsdetail = res.sellGoodsCinema;

            //取到卖品总收入
            this.Goodsincome = res.sellGoodsCinema.sppPrice;
            this.saleCount = res.sellGoodsCinema.salesVolume;

            //获取人均卖品金额
            this.SellTotal = res.sellGoodsCinema.sppPrice;
          }
            //获取卖品折线图初始化
            this.getSellLineChart(res)
        });
    },
    //会员
    getMemberData() {
      this.$camList
        .MemberData({
          body: {
            cityId: this.cityId,
            cinemaId: this.MemberId,
            startDate: this.startTime,
            endDate: this.endTime,
            dateType: this.timeType,
          }
        })
        .then(response => {
          let res = response.data;
          
          //判断KPI
          if(this.timeType !== 'day'){
            //是周月年时候隐藏KPI
            this.$nextTick(()=>{
              this.$refs.Member.foo(false);
            })
          }
          else
          {
            if(!res.memberKpiInfo || JSON.stringify(res.memberKpiInfo) == "{}"){
              //获取KPI
              this.$nextTick(()=>{
                this.$refs.Member.foo(false);
              })
            }
            else{
              this.MemberKPIDataCine = res.memberKpiInfo;
              this.$nextTick(()=>{
                this.$refs.Member.foo(true);
              })
            }
          }
          //获取会员数据
          if(res.memberCinemaVO){
            this.Memberdetail = res.memberCinemaVO;
            //获取新增会员数
            this.MemberTotal = res.memberCinemaVO.newMember;
          }
            //获取会员折线图
            this.getMemberLineChart(res)

          
        });
    },
    //获取更新时间
    getCurrentTime() {
      this.$camList.getCurrentTime().then(response => {
        let res = response.data;
        this.updateTime = res; 
      });
    },
    //票房-票房收入玫瑰图
    getRoseChart(res){
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
        this.ChartQuota.columns = ["name", "value"];
        this.ChartQuota.rows = foo;
      }
    },
    //卖品-折线图
    getSellLineChart(res){
      // 卖品折线图
      if(!res.sellGoodsIndex || JSON.stringify(res.sellGoodsIndex) == "{}"){
        // console.log('卖品没有字段')
        this.$nextTick(()=>{
          this.$refs.GoodsSell.foo(false);
        })
      }
      else{
        this.goodsLineData.columns = ["日期", "人均卖品收入"];
        this.goodsLineData.rows = res.sellGoodsIndex.yAxis.map(item => {
          return {
            日期: item.dateKey,
            人均卖品收入: item.sppPrice.toFixed(2)
          };
        });
      }
    },
    //会员-折线图
    getMemberLineChart(res){
      // 卖品折线图
      if(!res.memberIndex || JSON.stringify(res.memberIndex) == "{}"){
        // console.log('会员没有字段')
        this.$nextTick(()=>{
          this.$refs.Member.foo(false);
        })
      }
      else{
        this.MemberLineData.columns = ["日期", "新增会员人数"];
        this.MemberLineData.rows = res.memberIndex.yAxis.map(item => {
          return {
            日期: item.dateKey,
            新增会员人数: item.newMember
          };
        });
      }
     
    },
    //获取时间类型
    getTimeType(type) {
      this.timeType = type;
    },
    //改变时间
    changeTime(option) {
      if (option.startTime) {
        this.startTime = option.startTime;
        this.endTime = option.endTime;
        this.dateTypeIndex = option.index;
        this.getBoxOfficeData();
        this.getMemberData();
        this.getGoodsData();
        this.getCurrentTime();

        this.$refs.BoxOffice.active()
        this.$refs.GoodsSell.active()
        this.$refs.Member.active()
      }else{
        this.startTime = this.$moment(option).format('YYYY-MM-DD');
        this.endTime = this.$moment(option).format('YYYY-MM-DD');
        this.time = this.$moment(option).format('YYYY-MM-DD')
      }
      
    }
  }
};
</script>
<style lang="scss" scoped>
// .self-el-section-warp{
//   z-index:10;
// }
.font{
  font-size:12px;
  color:#666;
}
//外层容器
.SysContent {
  padding: 0px 20px;
  background: #eeeeee;
  .SysHeader {
    width: 100%;
    height: 166px;
    .HeaderTop {
      // line-height: 60px;
      padding-top:10px;
      .left-sider {
        float: left;
      }
      .right-sider {
        float: right;
      }
      .total {
        width: 100%;
        height: 106px;
        margin-top: 10px;
        border-left: 3px solid #3b74ff;
        background: white;
        display: flex;
        justify-content: space-around;
        .totalLeft {
          position: relative;
          line-height: 60px;
          .icon-danchuang-tishi {
            position: absolute;
            right: -20px;
            top: -4px;
            color: #3b74ff;
            font-size: 12px;
          }
        }
        h1 {
          margin: 10px 0 5px;
          font-size: 58px;
          font-weight: bold;
          color: #3b74ff;
          text-align: center;
        }
        p {
          margin: 0px;
          font-size: 12px;
          line-height: 10px;
          text-align: center;
        }
      }
    }
  }
}

.SysMain {
  margin-top: 20px;
  width: 100%;
  padding-bottom:20px;
}
.left-purple-dark {
  height: 50px;
  text-align: left;
  color: #666;
  font-size: 12px;
}
.right-purple-dark {
  height: 50px;
  text-align: right;
}

.ProgressBoxCoff {
  height: 40px;
  .title {
    width: 60px;
    display: inline-block;
    float: left;
    height: 35px;
    line-height: 35px;
    position: relative;
    top: 12px;
    font-size: 12px;
    color: #666666;
    &:after {
      content: "";
      clear: both;
    }
  }
  .el-progress {
    float: left;
    width: 80%;
    position: relative;
    top: 10px;
  }
}
.SysContent .SysHeader .HeaderTop .total .progress {
  width: 582px;
  // position: relative;
  // left: -130px;
}

</style>