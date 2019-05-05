<template>
  <!--集团版-->
  <!--Syscontent-->
  <div class="SysContent">
    <div class="SysHeader">
      <div class="HeaderTop">
        <div class="query">
          <div class="left-sider" :span="12">
            <div class="left-purple-dark submitMain">
              <span>选择时间 :</span>
              <el-date-picker
                v-model="time"
                type="date"
                placeholder="选择日期"
                size="small"
                @change="changeTime"
              ></el-date-picker>
              <el-button type="primary" size="small" class="submit">查询</el-button>
            </div>
          </div>
        </div>
        <div class="total">
          <div class="totalLeft">
            <h1>{{allCount}}</h1>
            <p>营 业 总 额( 万 元 )</p>
            <el-tooltip class="item" effect="dark" content="营业总额=卖品+票房首页" placement="right-start">
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
            :time="time"
            :cityId="cityId"
            :memberId="MemberId"
            :BoxKPIData="BoxKPIData"
          >
          </box-office>

        </el-col>
        <el-col class="center" :span="8">
          <sell-goods 
            ref="GoodsSell"
            :GoodTop="Goodsdetail" 
            :GoodTableTop="GoodTable" 
            :lineData="goodsLineData"
            :time="time"
            :cityId="cityId"
            :memberId="MemberId"
            :SellKPIData="SellKPIData"
          >
          </sell-goods>
        </el-col>
        <el-col class="right" :span="8">
          <member
            ref="Member"
            :MemberTop="Memberdetail"
            :MemberTableTop="MemberTable"
            :lineData="memberLineData"
            :time="time"
            :cityId="cityId"
            :memberId="MemberId"
            :MemberKPIData="MemberKPIData"
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
export default {
  name: "Group-detail",
  data() {
    return {
      boxCount: null,
      saleCount: null,
      time: this.$moment(this.$moment(new Date()).add(-1, "day")).format("YYYY-MM-DD"),
      cityId: "",
      MemberId: "",
      BoxType:"box_office",
      BoxOffdetail: {},
      Goodsdetail: {},
      Memberdetail: {},
      BoxTable: [],
      GoodTable: [],
      MemberTable: [],
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
        return ((this.boxCount * 1 + this.saleCount * 1) / 10000).toFixed(2);
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
  components: {
    BoxOffice,
    SellGoods,
    Member
  },
  created: function() {
    //获取票房数据数据
    this.getBoxOfficeData();
    //获取卖品数据数据
    this.getGoodsData();
    //获取会员数据
    this.getMemberData();
    //父组件加载时直接调用子组件分页数据
    this.$nextTick(()=>{
      this.$refs.BoxOffice.getBoxPages('box_office');
      this.$refs.GoodsSell.getGoodsPages('spp_price');
      this.$refs.Member.getMemberPages('new_member');
    })
    
  },
  methods: {
    //票房
    getBoxOfficeData() {
      this.$camList
        .BoxOfficeData({
          body: {
            groupId: 1,
            startDate: this.time,
            endDate: this.time,
            chainPerType: "day",
            pageSize:this.pageSize,
            pageNo:this.currentPage
          }
        })
        .then(res => {
          //票房数据
          let resData = res.boxOfficeCinemaVO;
          this.BoxOffdetail = resData;

          //取到票房总收入
          this.Boxincome = res.boxOfficeCinemaVO.boxOffice;
          this.boxCount = res.boxOfficeCinemaVO.boxOffice;

          //获取票房table数据
          let resTable = res.boxOfficeCinemaPageInfo.list;
          this.BoxTable = resTable;
          //初始化票房首页玫瑰图数据
          this.getRoseChart(res)
          //获取KPI
          let ResKPI = res.boxOfficeKpiInfo;
          this.BoxKPIData = ResKPI
         
        });
    },
    //卖品
    getGoodsData() {
      this.$camList
        .GoodsData({
          body: {
            groupId: 1,
            startDate: this.time,
            endDate: this.time,
            chainPerType: "day"
          }
        })
        .then(res => {
          //卖品数据
          let resData = res.sellGoodsCinema;
          this.Goodsdetail = resData;

          //获取卖品table数据
          let resTable = res.sellGoodsCinemaPageInfo.list;
          this.GoodTable = resTable;

          //取到卖品总收入
          this.Goodsincome = res.sellGoodsCinema.sppPrice;
          this.saleCount = res.sellGoodsCinema.salesVolume;
          
          // 折线图
          this.goodsLineData.columns = ["日期", "人均卖品收入"];
          this.goodsLineData.rows = res.sellGoodsIndex.yAxis.map(item => {
            return {
              日期: item.dateKey,
              人均卖品收入: item.sppPrice
            };
          });

          //获取KPI
          let ResKPI = res.sellGoodsKpiInfo;
          this.SellKPIData = ResKPI
          // console.log(this.MemberKPIData)

        });
    },
    //会员
    getMemberData() {
      this.$camList
      .MemberData({
        body: {
          groupId: 1,
          startDate: this.time,
          endDate: this.time,
          chainPerType: "day"
        }
      })
      .then(res => {
        //获取五项指标数据
        let resData = res.memberCinemaVO;
        this.Memberdetail = resData;

        //获取会员table
        let resTable = res.memberCinemaPageInfo.list;
        this.MemberTable = resTable;

        // 会员折线图
        this.memberLineData.columns = ["日期", "新增会员人数"];
        this.memberLineData.rows = res.memberIndex.yAxis.map(item => {
          return {
            日期: item.dateKey,
            新增会员人数: item.newMember
          };
        });

        //获取KPI
        let ResKPI = res.memberKpiInfo;
        this.MemberKPIData = ResKPI
        console.log(this.MemberKPIData)
      });
    },
    // 1.change time
    changeTime(time) {
      if (time) {
        this.$moment(time).format("YYYY-MM-DD");
        let new_time = this.$moment(time).format("YYYY-MM-DD");
        this.startTime = new_time;
        this.endTime = new_time;
        this.time = new_time;

      } else {
        this.startTime = null;
        this.endTime = null;
      }
      this.getBoxOfficeData();
      this.getMemberData();
      this.getGoodsData();
      //父组件加载时直接调用子组件分页数据
      this.$nextTick(()=>{
        this.$refs.BoxOffice.getBoxPages('box_office');
        this.$refs.GoodsSell.getGoodsPages('spp_price');
         this.$refs.Member.getMemberPages('new_member');
      })
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
            value: item.boxOfficePercent
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