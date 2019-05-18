<template>
  <!--集团版-->
  <!--Syscontent-->
  <div class="SysContent">
    <div class="SysHeader">
      <div class="HeaderTop">
        <div class="query">
          <div class="left-sider" :span="12">
            <div class="left-purple-dark submitMain">
              <span>选择时间 : </span>
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
                <el-progress :text-inside="true" :stroke-width="15" :percentage="boxRadio"></el-progress>
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
                  color="rgba(142, 113, 199, 0.7)"
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
          <box-office
            ref="BoxOffice"
            :BoxofficeTop="BoxOffdetail" 
            :BoxTableTop="BoxTable" 
            :chartIncome="ChartQuota"
            :startDate="startTime"
            :endDate="endTime"
            :timeType="timeType"
            :cityId="cityId"
            :memberId="MemberId"
            :BoxKPIData="BoxKPIData"
            :BoxTotal="BoxTotal"
            :initBoxPage="initBoxPage" 
          >
          </box-office>
        </el-col>
        <el-col class="center" :span="8">
          <sell-goods 
            ref="GoodsSell"
            :GoodTop="Goodsdetail" 
            :GoodTableTop="GoodTable" 
            :lineData="goodsLineData"
            :startDate="startTime"
            :endDate="endTime"
            :timeType="timeType"
            :cityId="cityId"
            :memberId="MemberId"
            :SellKPIData="SellKPIData"
            :SellTotal="SellTotal"
            :initSellPage="initSellPage"
          >
          </sell-goods>
        </el-col>
        <el-col class="right" :span="8">
          <member
            ref="Member"
            :MemberTop="Memberdetail"
            :MemberTableTop="MemberTable"
            :lineData="memberLineData"
            :startDate="startTime"
            :endDate="endTime"
            :timeType="timeType"
            :cityId="cityId"
            :memberId="MemberId"
            :MemberKPIData="MemberKPIData"
            :MemberTotal="MemberTotal"
            :initMemberPage="initMemberPage"
          ></member>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import BoxOffice from "./components/BoxOffice";
import SellGoods from "./components/SellGoods";
import Member from "./components/Member";
import CalendarView from '../../components/calendar/calendar'
export default {
  name: "Group-detail",
  data() {
    return {
      boxCount: null,
      saleCount: null,
      time: this.$moment(this.$moment(new Date())
        .add(-1, "day"))
        .format("YYYY-MM-DD"),
      startTime: this.$moment(new Date())
        .add(-1, "day")
        .format("YYYY-MM-DD"),
      endTime: this.$moment(new Date())
        .add(-1, "day")
        .format("YYYY-MM-DD"),
      timeType: "day",
      cityId: "",
      MemberId: "",
      BoxType:"box_office",
      BoxTotal:0,      //票房总收入单独值
      MemberTotal:0,   //会员新增人数单独值
      SellTotal:0,     //卖品总收入单独值
      BoxOffdetail: {}, //票房数据
      Goodsdetail: {},  //卖品数据
      Memberdetail: {}, //会员数据
      initBoxPage:0,
      initSellPage:0,
      initMemberPage:0,
      BoxTable: [],     //票房表格数据
      GoodTable: [],    //卖品表格数据
      MemberTable: [],  //会员表格数据
      value2: 20,
      Boxincome: "",
      Goodsincome: "",
      BoxKPIData:{},    //票房KPI
      MemberKPIData:{}, //会员KPI
      SellKPIData:{},   //卖品KPI
      //票房收入饼图
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
    BoxOffice,
    SellGoods,
    Member,
    CalendarView
  },
  created: function() {
    //获取票房数据数据
    this.getBoxOfficeData();
    //获取卖品数据数据
    this.getGoodsData();
    //获取会员数据
    this.getMemberData();
    //父组件加载时直接调用子组件分页数据
    
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
      if (num > 10000 && num < 100000000) {
          showNum = `${(num/10000).toFixed(2)}万${company}`
      }
      if (num >= 100000000) {
          showNum = `${(num/100000000).toFixed(2)}亿${company}`
      }
      return showNum
    },

    //票房
    getBoxOfficeData() {
      this.$camList.BoxOfficeData({
          body: {
            groupId: 44,
            startDate: this.startTime,
            endDate: this.endTime,
            dateType: this.timeType,
            pageSize:this.pageSize,
            pageNo:this.currentPage
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
            if(res.boxOfficeKpiInfo !== null || res.boxOfficeKpiInfo !== undefined){
              this.BoxKPIData = res.boxOfficeKpiInfo;

              this.$nextTick(()=>{
                this.$refs.BoxOffice.foo(true);
              })
            }
            else{
              this.$nextTick(()=>{
                this.$refs.BoxOffice.foo(false);
              })
            }
          }

          //票房数据
          if(res.boxOfficeCinemaVO){
            this.BoxOffdetail = res.boxOfficeCinemaVO;
            console.log(this.BoxOffdetail)
            //取到票房总收入
            this.Boxincome = res.boxOfficeCinemaVO.boxOffice;
            this.boxCount = res.boxOfficeCinemaVO.boxOffice;
          }
          
          //获取票房总收入
          if(res.boxOfficeCinemaVO){
            this.BoxTotal = res.boxOfficeCinemaVO.boxOffice;
          }
         
          //获取table表格数据
          if(res.boxOfficeCinemaPageInfo){
            //获取票房table数据
            res.boxOfficeCinemaPageInfo.list.forEach(item => {
                item.showNum = this.formatValue(item.boxOffice,'元')
            })
            this.BoxTable = res.boxOfficeCinemaPageInfo.list;
          }
              
          //初始化分页总数
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
      this.$camList.GoodsData({
          body: {
            groupId: 44,
            startDate: this.startTime,
            endDate: this.endTime,
            dateType: this.timeType,
            pageSize:this.pageSize,
            pageNo:this.currentPage
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
            if(res.sellGoodsKpiInfo !== null || res.sellGoodsKpiInfo !== undefined){
              //获取KPI
              let ResKPI = res.sellGoodsKpiInfo;
              this.SellKPIData = ResKPI

              this.$nextTick(()=>{
              this.$refs.GoodsSell.foo(true);
              })
            }
            else{
              this.$nextTick(()=>{
                this.$refs.GoodsSell.foo(false);
              })
            }
          }

          if(res.sellGoodsCinema){
            //卖品数据
            this.Goodsdetail = res.sellGoodsCinema;
            //获取卖品table数据
            this.$nextTick(()=>{
              res.sellGoodsCinemaPageInfo.list.forEach(item => {
                item.showNumSell = this.formatValue(item.columeName,'元')
              })
              this.GoodTable = res.sellGoodsCinemaPageInfo.list;
            })
            
            //取到卖品总收入
            this.Goodsincome = res.sellGoodsCinema.sppPrice;
            this.saleCount = res.sellGoodsCinema.salesVolume;
          }

          if(res.sellGoodsCinema){
            //获取人均卖品金额
            this.SellTotal = res.sellGoodsCinema.sppPrice;
          }
          
          //初始化分页总数
          if(res.sellGoodsCinemaPageInfo){
            this.initSellPage = res.sellGoodsCinemaPageInfo.total

            this.$nextTick(()=>{
              this.$refs.GoodsSell.testFun()
            })
          }

          //获取折线图
          if(res.sellGoodsIndex){
            // 折线图
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
      this.$camList.MemberData({
        body: {
          groupId: 44,
          startDate: this.startTime,
          endDate: this.endTime,
          dateType: this.timeType,
          pageSize:this.pageSize,
          pageNo:this.currentPage
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
            let ResKPI = res.memberKpiInfo;
            this.MemberKPIData = ResKPI
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


        if(res.memberCinemaVO){
          //获取五项指标数据
          let resData = res.memberCinemaVO;
          this.Memberdetail = resData;

          //取新增会员的值
          let resTotal = res.memberCinemaVO.newMember;
          this.MemberTotal = resTotal
        }


        if(res.memberCinemaPageInfo){
          //获取会员table
          res.memberCinemaPageInfo.list.forEach(item => {
            item.showNumMember = this.formatPerson(item.columeName,'人')
          })
          this.MemberTable = res.memberCinemaPageInfo.list; 
        }

        //初始化分页总数
        if(res.memberCinemaPageInfo){
          this.initMemberPage = res.memberCinemaPageInfo.total
          this.$nextTick(()=>{
            this.$refs.Member.testFun()
          })
        }
        // 会员折线图
        if(res.memberIndex){
          this.memberLineData.columns = ["日期", "新增会员人数"];
          this.memberLineData.rows = res.memberIndex.yAxis.map(item => {
            return {
              日期: item.dateKey,
              新增会员人数: item.newMember
            };
          });
        }
        
        //获取KPI判断
        if(res.memberKpiInfo){
          //获取KPI
          let ResKPI = res.memberKpiInfo;
          this.MemberKPIData = ResKPI
          this.$refs.Member.foo(true);
        }
        else{
          this.$nextTick(()=>{
            this.$refs.Member.foo(false);
          })
        }
      });
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
        //父组件加载时直接调用子组件分页数据
       
      }else{
        this.startTime = this.$moment(option).format('YYYY-MM-DD');
        this.endTime = this.$moment(option).format('YYYY-MM-DD');
      }
      
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
            color: #3b74ff;
            font-size: 12px;
          }
        }
        h1 {
          margin: 10px 0 5px;
          font-size: 48px;
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

.el-message{
  background:red;
}


</style>