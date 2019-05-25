<template>
  <!--城市体-->
  <!--Syscontent-->
  <div class="SysContent">
    <div class="SysHeader">
      <div class="HeaderTop">
        <div class="query">
          <div class="left-sider" :span="12">
            <div class="left-purple-dark submitMain">
              <span>选择时间 :</span>
              <calendar-view
                size="mini"
                v-model="time"
                @emitCalendarType="getTimeType"
                @change="changeTime"
              ></calendar-view>
            </div>
          </div>
        </div>
        <div class="total">
          <div class="totalLeft">
            <h1>{{allCount | capitalizeOne}}</h1>
            <p>营 业 总 额({{allCount | foo}})</p>
            <el-tooltip class="item" effect="dark" content="营业总额=票房收入+卖品收入" placement="right-start">
              <i class="iconfont icon-danchuang-tishi"></i>
            </el-tooltip>
          </div>
          <div class="progress">
            <div class="ProgressBoxCoff">
              <div class="title">票房占比</div>
              <div class="el-progress">
                <el-progress 
                  :text-inside="true" 
                  :stroke-width="15" 
                  :percentage="boxRadio"
                ></el-progress>
              </div>
            </div>
            <div style="clear:both;"></div>
            <div class="ProgressBoxCoff">
              <div class="title">卖品占比</div>
              <div class="el-progress">
                <el-progress
                  :text-inside="true"
                  :stroke-width="15"
                  :percentage="sellRadio"
                  color="rgba(254,130,94, 0.7)"
                ></el-progress>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="SysMain">
      <el-row class="el-RowMain" :gutter="15">
        <el-col class="left" :span="8">
          <box-office-city 
            ref="BoxOffice"
            :BoxofficeTop="BoxOffdetail" 
            :BoxTableTop="BoxTable" 
            :chartIncome="ChartQuota"
            :cityId="cityId"
            :memberId="MemberId"
            :BoxKPIDataCity="BoxKPIDataCity"
            :BoxTotal="BoxTotal"
            :startDate="startTime"
            :endDate="endTime"
            :timeType="timeType"
            :initBoxPage="initBoxPage"
          >
          </box-office-city>
        </el-col>
        <el-col class="center" :span="8">
          <sell-goods-city
            ref="GoodsSell"
            :GoodTop="Goodsdetail" 
            :GoodTableTop="GoodTable" 
            :lineData="goodsLineData"
            :cityId="cityId"
            :memberId="MemberId"
            :SellKPIDataCity="SellKPIDataCity"
            :SellTotal="SellTotal"
            :startDate="startTime"
            :endDate="endTime"
            :timeType="timeType"
            :initSellPage="initSellPage"
          ></sell-goods-city>
        </el-col>
        <el-col class="right" :span="8">
          <member-city
            ref="Member"
            :MemberTop="Memberdetail"
            :MemberTableTop="MemberTable"
            :lineData="memberLineData"
            :cityId="cityId"
            :memberId="MemberId"
            :MemberKPIDataCity="MemberKPIDataCity"
            :MemberTotal="MemberTotal"
            :startDate="startTime"
            :endDate="endTime"
            :timeType="timeType"
            :initMemberPage="initMemberPage"
          ></member-city>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import BoxOfficeCity from "./components/BoxOfficeCity";
import SellGoodsCity from "./components/SellGoodsCity";
import MemberCity from "./components/MemberCity";
import CalendarView from '../../components/calendar/calendar'
export default {
  name: "CityBody-detail",
  data() {
    return {
      boxCount: 0,
      saleCount: 0,
      time: this.$moment(this.$moment(new Date()).add(0, "day")).format("YYYY-MM-DD"),
      startTime: this.$moment(new Date()).add(0, "day").format("YYYY-MM-DD"),
      endTime: this.$moment(new Date()).add(0, "day").format("YYYY-MM-DD"),
      timeType: "day",
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
      cityId: "",
      MemberId: "",
      initBoxPage:0,        //票房分页
      initSellPage:0,       //卖品分页
      initMemberPage:0,     //会员分页
      BoxKPIDataCity:{},    //票房KPI
      MemberKPIDataCity:{}, //会员KPI
      SellKPIDataCity:{},   //卖品KPI
      ChartQuota: {
        columns: [],
        rows: []
      },
      goodsLineData: {
        columns: [],
        rows: []
      },
      memberLineData: {
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
    }
  },
  components: {
    BoxOfficeCity,
    SellGoodsCity,
    MemberCity,
    CalendarView
  },
  created: function() {
    //获取id
    this.getquery();
    //父组件加载时直接调用子组件分页数据
    
  },
  mounted:function(){
    //获取票房数据数据
    this.getBoxOfficeData();
    //获取卖品数据数据
    this.getGoodsData();
    //获取会员数据
    this.getMemberData();
  },
  methods: {
    formatValue(num, company) {
      let showNum
      if (num < 10000) {
          showNum = `${num.toFixed(2)}${company}`
      } 
      if (num > 10000 && num < 100000000) {
          showNum = `${(num/10000).toFixed(2)}万${company}`
      }
      if (num >= 100000000) {
          showNum = `${(num/100000000).toFixed(2)}亿${company}`
      }
      return showNum
    },

    formatPerson(num, company) {
      let showNum
      if (num < 10000) {
          showNum = `${num}${company}`
      } 
      if (num >= 10000 && num < 100000000) {
          showNum = `${(num/10000).toFixed(2)}万${company}`
      }
      if (num >= 100000000) {
          showNum = `${(num/100000000).toFixed(2)}亿${company}`
      }
      return showNum ? showNum : 0
    },
    getquery() {
      this.cityId = Number(this.$route.query.cityId);
      this.MemberId = Number(this.$route.query.cinemaId);
    },
    //票房
    getBoxOfficeData() {
      this.$camList
        .BoxOfficeData({
          body: {
            groupId: 44,
            cityId: this.cityId,
            cinemaId: this.MemberId,
            startDate: this.startTime,
            endDate: this.endTime,
            dateType: this.timeType
          }
        })
        .then(response => {
          let res = response.data;

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
              this.BoxKPIData = res.boxOfficeKpiInfo;
              this.$nextTick(()=>{
                this.$refs.BoxOffice.foo(true);
              })
            }
          }
          
          if(res.boxOfficeCinemaVO){
            //票房数据
            this.BoxOffdetail = res.boxOfficeCinemaVO;

            //取到票房总收入
            this.Boxincome = res.boxOfficeCinemaVO.boxOffice;
            this.boxCount = res.boxOfficeCinemaVO.boxOffice;
          }
  
          //获取票房收入
          if(res.boxOfficeCinemaVO){
              this.BoxTotal = res.boxOfficeCinemaVO.boxOffice;
          }
            
          if(res.boxOfficeCinemaPageInfo){
            //获取票房table数据
            res.boxOfficeCinemaPageInfo.list.forEach(item => {
              item.showNumCity = this.formatValue(item.boxOffice,'元')
            })
            this.BoxTable = res.boxOfficeCinemaPageInfo.list;
          }
        
          //初始化分页数据
          if(res.boxOfficeCinemaPageInfo){
            this.initBoxPage = res.boxOfficeCinemaPageInfo.total
            
            this.$nextTick(()=>{
              this.$refs.BoxOffice.testFun()
            })
          }
          //初始化票房首页玫瑰图数据
          this.getRoseChart(res)
        });
    },
    //卖品
    getGoodsData() {
      this.$camList
        .GoodsData({
          body: {
            groupId: 44,
            cityId: this.cityId,
            cinemaId: this.MemberId,
            startDate: this.startTime,
            endDate: this.endTime,
            dateType: this.timeType
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
              this.SellKPIDataCity = res.sellGoodsKpiInfo;
              this.$nextTick(()=>{
                this.$refs.GoodsSell.foo(true);
              })
            }
          }
          //获取接口总数据
          if(res.sellGoodsCinema){
            //卖品数据
            this.Goodsdetail = res.sellGoodsCinema;

            //获取卖品table数据
            this.$nextTick(()=>{
              if(res.sellGoodsCinemaPageInfo){
                res.sellGoodsCinemaPageInfo.list.forEach(item => {
                  item.showNumSell = this.formatValue(item.columeName,'元')
                })
              }
              this.GoodTable = res.sellGoodsCinemaPageInfo.list;
            })
            
            //取到卖品总收入
            this.Goodsincome = res.sellGoodsCinema.sppPrice;
            this.saleCount = res.sellGoodsCinema.salesVolume;
            
          }
          
          if(res.sellGoodsCinema.sppPrice){
            //获取人均卖品金额
            this.SellTotal = res.sellGoodsCinema.sppPrice;
          }
       
          //初始化分页数据
          if(res.sellGoodsCinemaPageInfo){
            this.initSellPage = res.sellGoodsCinemaPageInfo.total
            
            this.$nextTick(()=>{
              this.$refs.GoodsSell.testFun()
            })
          }
          //获取卖品折线图
          if(res.sellGoodsIndex){
            // 卖品折线图
            this.goodsLineData.columns = ["日期", "人均卖品收入"];
            this.goodsLineData.rows = res.sellGoodsIndex.yAxis.map(item => {
              return {
                日期: item.dateKey,
                人均卖品收入: item.sppPrice
              };
            });
          }
          
        });
    },
    //会员
    getMemberData() {
      this.$camList
        .MemberData({
          body: {
            groupId: 44,
            cityId: this.cityId,
            cinemaId: this.MemberId,
            startDate: this.startTime,
            endDate: this.endTime,
            dateType: this.timeType
          }
        })
        .then(response => {
          let res = response.data;

          if(this.timeType !== 'day'){
            //是周月年时候隐藏KPI
            this.$nextTick(()=>{
              this.$refs.Member.foo(false);
            })
          }else{
            if(res.memberKpiInfo !== null || res.memberKpiInfo !== undefined){
              //获取KPI
              this.MemberKPIDataCity = res.memberKpiInfo;
              this.$nextTick(()=>{
                this.$refs.Member.foo(true);
              })
            }
            else{
              this.$nextTick(()=>{
                this.$refs.Member.foo(false);
              })
            }
          }

          //判断数据指标
          if(res.memberCinemaVO){
            this.Memberdetail = res.memberCinemaVO;
            //获取新增会员数
            this.MemberTotal = res.memberCinemaVO.newMember;
          }
          
          if(res.memberCinemaPageInfo != null){
            //获取会员table
            res.memberCinemaPageInfo.list.forEach(item => {
              item.showNumMember = this.formatPerson(item.columeName,'人')
            })
            this.MemberTable = res.memberCinemaPageInfo.list; 
            console.log(this.MemberTable)
          }

          //新增会员数
          if(res.memberCinemaPageInfo){
            this.initMemberPage = res.memberCinemaPageInfo.total
            
            this.$nextTick(()=>{
              this.$refs.Member.testFun()
            })
          }
          //获取折线图
          if(res.memberIndex){
            // 会员折线图
            this.memberLineData.columns = ["日期", "新增会员人数"];
            this.memberLineData.rows = res.memberIndex.yAxis.map(item => {
              return {
                日期: item.dateKey,
                新增会员人数: item.newMember
              };
            });
          }
          

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
    //获取时间类型
    getTimeType(type) {
      this.timeType = type;
    },
    //改变时间
    changeTime(option) {
      if (option.startTime) {
        this.startTime = option.startTime;
        this.endTime = option.endTime;

        this.getBoxOfficeData();
        this.getMemberData();
        this.getGoodsData();

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
.self-el-section-warp{
  z-index:10;
}
//外层容器
.SysContent {
  padding: 0px 20px;
  background: #eeeeee;
  .SysHeader {
    width: 100%;
    height: 166px;
    .HeaderTop {
      line-height: 60px;
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
          .icon-danchuang-tishi {
            position: absolute;
            right: -20px;
            top: -4px;
            color: blue;
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
  position: relative;
  left: -130px;
}
</style>