<template>
  <div class="sale-content-wrap">
    <div class="header-fixed">
      <el-breadcrumb separator="/" class="reset-bread" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/group/home' }">
          <span class="text-gray">经营决策</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span class="text-blue">卖品销售概览</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="time-wrap">
        <div class="time-item">
          <label class="label-title">
            时间选择：
            <calendar-view
              size="mini"
              v-model="time"
              @emitCalendarType="getTimeType"
              @change="changeTime"
            ></calendar-view>
          </label>
        </div>
        <div class="time-item">
          <label>
            <span class="label-title">会员属性：</span>
            <el-radio-group
              v-model="memberType"
              @change="changeMemberType"
              class="reset-radios-group">
              <el-radio :label="0">全部</el-radio>
              <el-radio :label="1">仅会员</el-radio>
            </el-radio-group>
          </label>
          <el-button type="primary" size="mini" style="margin-left:30px" @click="search">查询</el-button>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        指标概览
        <div class="inline-block  reset-radios-group right">
          <el-radio-group v-model="ratioType" @change="changeRadio">
            <el-radio :label="1">环比</el-radio>
            <el-radio :label="2">同比</el-radio>
          </el-radio-group>
          <el-button
            size="mini"
            style="margin-left:20px;margin-right:20px"
            @click="showTargetSetting"
          >指标设置</el-button>
        </div>
      </div>
      <div class="section-content" v-if="targetArr">
        <div class="target-flex">
          <div class="target-block" v-for="(item,index) in targetArr" :key="index">
            <div class="target-title">{{item.indicatorName}}</div>
            <div class="money">
              <i class="iconfont" :class="icons[index]" :style="{color:iconColors[index]}"></i>
              <span class="money-num">{{item.value}}</span>
              <span class="unit">{{item.indicatorCode|formatTargetUnit}}</span>
            </div>
            <div class="ratio" v-if="ratioType == 1">
              环比
              <i></i>
              <span class="ratio-num">{{item.roundPeriodValue == '-9999'?'--':item.roundPeriodValue}}</span>%
            </div>
             <div class="ratio" v-else>
              同比
              <i></i>
              <span class="ratio-num">{{item.samePeriodValue == '-9999'?'--':item.samePeriodValue}}</span>%
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        卖品指标趋势
      </div>
      <div class="section-select flex">
        <div class="unit" style="margin-left:30px">单位：元</div>
        <div>
          <target-lable @getType="changeSaleType"></target-lable>
        </div>
        <div></div>
      </div>
      <div class="section-content">
        <ve-line
          :data="saleLineData"
          :legend-visible="false"
          :settings="lineSettings"
          :extend="lineExtend"
        ></ve-line>
      </div>
    </div>
    <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        渠道及品类分布
      </div>
      <div class="section-select center">
        <target-lable  @getType="changeChannelType" type="channel"></target-lable>
      </div>
      <!-- 饼图 -->
      <div class="section-content flex" v-if="showPie">
        <div style="width:50%;">
          <ve-pie
            :data="channelData"
            :settings="channelSettings"
            :extend="pieExtend"
            :colors="colors"
          ></ve-pie>
        </div>
        <div style="width:50%;">
          <ve-ring
            :data="categoryData"
            :settings="categorySettings"
            :extend="pieExtend"
            :colors="colors"
          ></ve-ring>
        </div>
      </div>
      <!-- 柱状图 -->
      <div class="section-content flex" v-else>
        <div style="width:40%;margin:0 auto">
          <ve-histogram :title="渠道" :data="channelData" :extend="barExtend" :legend-visible="false"></ve-histogram>
        </div>
        <div style="width:40%;margin:0 auto">
          <ve-histogram :data="categoryData" :extend="barExtend" :legend-visible="false"></ve-histogram>
        </div>
      </div>
    </div>
    <!-- 指标设置弹窗 -->
    <target-dialog ref="targetDailog" @saveTarget="saveTarget"></target-dialog>
  </div>
</template>
<script>
import TargetLable from "../partical/targetLable";
import TargetDialog from "../partical/targetDialog";
import CalendarView from '../../components/calendar/calendar'
export default {
  components: { TargetLable, TargetDialog,CalendarView},
  data() {
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
      userId:this.$store.state.loginUser?this.$store.state.loginUser.uid:805852,
      groupId:1,
      cityId:this.$route.query.cityId?this.$route.query.cityId:1,
      cinemaId:this.$route.query.cinemaId? this.$route.query.cinemaId:1,
      time: this.$moment(this.$moment(new Date()).add(-1, "day")).format(
        "YYYY-MM-DD"
      ),
      startTime: this.$moment(new Date())
        .add(-1, "day")
        .format("YYYY-MM-DD"),
      endTime: this.$moment(new Date())
        .add(-1, "day")
        .format("YYYY-MM-DD"),
      timeType: "day",
      memberType: 0, // 会员类型
      ratioType: 1, // 环比类型
      saleType: 'xse', // 卖品指标
      channelType: 'xse', // 渠道/类型指标
      showPie: true, // 渠道/类型 饼图和柱状图切换
      tableData: [], // 表格列表
      size: 10,
      page: 1,
      total: 0,
      iconColors:['#fe825e','#8e7eff','#3b74ff','#ff6081','#fec107','#17cd31'],
      icons:["icon-neiye-zongxiaoshoue","icon-neiye-kedanjia","icon-neiyegoumaishuai","icon-neiye-jine","icon-neiye-xiaofei","icon-neiye-xiaoshoue"],
      // 指标概览
      targetArr: [],
      // 指标趋势
      saleLineData: {
        columns: ["date", "value"],
        rows: []
      },
      // 指标趋势/折线图设置
      lineSettings: {
        itemStyle: {
          color: "#3B74FF", // 折线点颜色
          lineStyle: {
            color: "#3B74FF"
          }
        } 
      },
      // 指标趋势/折线图扩展
      lineExtend: {
        "xAxis.0.axisLabel.rotate": 45,
      },
      // 渠道
      channelData:{
        columns: ["name", "value"],
        rows: []
      },
      // 渠道设置
      channelSettings: {
      },
      // 品类
      categoryData:{
        columns: ["name", "value"],
        rows: []
      },
      // 品类设置
      categorySettings: {
        roseType: "radius",
      },
      // 饼图扩展
      pieExtend: {
        legend: {
          top: "bottom",
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: "#333",
            fontSize: 12
          }
        },
       
      },
      //柱状图扩展
      barExtend: {
        barWidth: 10,
        color: "#3B74FF"
      },
      // 卖品销售表现（四象限）
      scatterData: {
        columns: ["buyRate", "unitPrice", "salesVolume"],
        rows: {}
      },
      // 散点图设置
      scatterSettings: {
        dimension: ["buyRate"], // 维度
        metrics: ["unitPrice", "salesVolume",'buyRate'], // 指标
        xAxisType: "value", // x轴类型  category, value, time, log
        xAxisName: "卖品购买率(%)", // x轴标题
        yAxisName: "客单价(元)",
        labelMap: {
          buyRate: "购买率", // 别名
          salesVolume: "销售额",
          unitPrice: "客单价",
        },
      },
      // 散点图扩展
      scatterExtend: {
        yAxis: {
          nameLocation: "end",
          nameTextStyle: {
            color: "#000",
            fontSize: 12,
            padding:[0,0,0,40],
          },
          splitLine: false,
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "#eee"
            }
          },
          axisLabel: {
            color: "000"
          }
        },
        xAxis: {
          nameLocation: "middle",
          nameTextStyle: {
            color: "#000",
            fontSize: 12,
            padding:20,
          },
          splitLine: false,
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: "#eee"
            }
          },
          axisLabel: {
            color: "000"
          }
        }
      }
    };
  },
  filters:{
    formatTargetUnit(type){
      switch(type){
        case 'xse': // 销售额
          return '万';
        break;
        case 'xscb': // 销售成本
          return '元';
        break;
        case 'xsdl': // 销售单量
          return '元';
        break;
        case 'xssl': // 销售数量
          return '个';
        break;
        case 'xsml': // 销售毛利
          return '元';
        break;
        case 'xsmlr': // 销售毛利率
          return '%';
        break;
        case 'kdj': // 客单价
          return '元';
        break;
        case 'kdl': // 客单量
          return '个';
        break;
        case 'jdj': // 件单价
          return '元';
        break;
        case 'gml': // 购买率
          return '%';
        break;
        case 'rjmpje': // 人均卖品金额
          return '元';
        break;
        case 'hyxfzb': // 会员消费占比
          return '%';
        break;
        case 'tcxfzb': // 套餐消费占比
          return '%';
        break;
        case 'cbj': // 成本价
          return '元';
        break;
      }
    }
  },
  created() {
    this.getAllData();
  },
  methods: {
    getAllData() {
      this.getTargetView();
      this.getTargetTrend();
      this.getChannelData();
    },
    // 1.城市体列表
    getData() {
      let params = {
        body: {
          userId:this.userId,
          groupId: this.groupId,
          cityId:this.cityId,
          cinemaId:this.cinemaId*1,
          startDate: this.startTime,
          endDate: this.endTime,
          member:this.memberType,
          dateType: this.timeType
        }
      };
      this.$camList.SaleData(params).then(response => {
        let res = response.data;
        if (res) {
          let resData = res;
          // 3.初始化表格
          this.tableData = resData.sellGoodsList.list.slice(0);
          this.tableData.forEach(item => {
            item.buyRate = item.buyRate + "%";
            item.salesGrossProfitRate = item.salesGrossProfitRate + "%";
            item.memberSalesVolumePercent = item.memberSalesVolumePercent + "%";
            item.setmealSalesVolumePercent = item.setmealSalesVolumePercent + "%";
            item.salesVolume =
              ((item.salesVolume * 1) / 10000).toFixed(2) + "万";
          });
          this.total = resData.sellGoodsList.total;
        }
      });
    },
    // 2.卖品指标概览
    getTargetView(codes){
      let params = {
        body:{
          userId:this.userId,
          groupId:this.groupId,
          cityId:this.cityId,
          cinemaId:this.cinemaId*1,
          startDate:this.startTime,
          endDate:this.endTime,
          dateType:this.timeType,
          member:this.memberType,
          indicatorCodes:codes,
        }
      };
      this.$camList.saleTargetView(params).then(response =>{
        let res = response.data;
        this.targetArr = res;
      })
    },
    // 3.卖品指标趋势
    getTargetTrend(){
      let params = {
        body:{
          userId:this.userId,
          groupId:this.groupId,
          cityId:this.cityId,
          cinemaId:this.cinemaId*1,
          startDate:this.startTime,
          endDate:this.endTime,
          dateType:this.timeType,
          member:this.memberType,
          bsiCodes:[this.saleType],
        }
      };
      this.$camList.switchTarget(params).then(response =>{
        let res = response.data;
         this.saleLineData.rows = res[this.saleType].sellAnalysis.map(item=>{
          return {
            date:item.name,
            value:item.value,
          }
        })
      })      
    },
    // 4. 渠道/品类数据
    getChannelData() {
      let id = this.channelType;
       let params = {
        body:{
          userId:this.userId,
          bsiCodes:[id],
          groupId:this.groupId,
          cinemaId:this.cinemaId*1,
          cityId:this.cityId,
          startDate:this.startTime,
          endDate:this.endTime,
          dateType:this.timeType,
          member:this.memberType,
        }
      };
      this.$camList.switchChannel(params).then(response =>{
          let res = response.data;
          let resData = res[id];
          if(resData.category){
            this.categoryData.rows = resData.category
          }
          if(resData.channel){
            this.channelData.rows = resData.channel
          }
          if (id == 'xse' || id == 'xssl' || id == 'xsml' || id == 'xscb') {
              this.showPie = true;
          } else {
              this.showPie = false;
          }
      })
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
      }else{
        this.startTime = this.$moment(option).format('YYYY-MM-DD');
        this.endTime = this.$moment(option).format('YYYY-MM-DD')
      }
      this.getAllData();
    },
    // 改变/会员
    changeMemberType(id) {
      this.memberType = id;
      this.getAllData();
    },
    // 改变/指标概览(环比/同比)
    changeRadio(id) {
      this.ratioType = id;
    },
    // 改变/卖品指标趋势类型
    changeSaleType(id) {
      this.saleType = id;
      this.getTargetTrend()
    },
    // 改变/渠道及品类分布
    changeChannelType(id) {
      //  销售额1、销售数量3、销售毛利7、销售成本9 展示饼图
      //  销售单量2、人均消费额11、客单价4、件单价5、客单量6、购买率10、销售毛利率8、会员消费占比12 展示柱形图
      this.channelType = id;
      this.getChannelData()
    },
    // 指标设置/弹窗
    showTargetSetting() {
      let targetDialog = this.$refs.targetDailog;
       let params = {
        body:{
          userId:this.userId
        }
      };
      this.$camList.saleTargetBinding(params).then(response =>{
        let res = response.data;
        targetDialog.profit = res.profit;
        targetDialog.ratio = res.ratio;
        targetDialog.sale = res.sale;
        targetDialog.show = true;
      })
    },
    // 指标设置/保存
    saveTarget(ids){
      let targetDialog = this.$refs.targetDailog;
      let params = {
        body:{
          userId:this.userId,
          indicatorCodes:ids
        } 
      };
      this.$camList.saleTargetSave(params).then(response =>{
        let res = response.data;
        targetDialog.show = false;
        this.getTargetView() 
      })
    }, 
    // 查询
    search(){
      this.getAllData()
    }
  }
};
</script>
