<template>
  <div class="sale-content-wrap">
    <div class="header-fixed">
      <el-breadcrumb separator="/" class="reset-bread" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{  path:'/analysis/new/home' }">
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
        <div class="reset-radios-group right">
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
              <span class="money-num">{{item.value |formatMoney}}</span>
              <span class="unit">{{item.indicatorCode|formatTargetUnit(item.value)}}</span>
            </div>
             <div class="ratio" v-if="ratioType == 1">
              环比
              <span class="ratio-num" :class="item.roundPeriodValue*1 > 0 ? 'text-green':'text-red' ">
                <i class="iconfont" :class="[item.roundPeriodValue > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']">
                </i>
               {{item.roundPeriodValue == '-9999'?'--':(item.roundPeriodValue*1 >0?item.roundPeriodValue*1:item.roundPeriodValue*(-1))}}%
              </span>
            </div>
             <div class="ratio" v-else>
              同比
              <span class="ratio-num" :class="item.samePeriodValue*1 >0?'text-green':'text-red'">
                <i class="iconfont" :class="[item.samePeriodValue > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']">
                </i>
                {{item.samePeriodValue == '-9999'?'--':(item.samePeriodValue*1 >0 ?item.samePeriodValue:item.samePeriodValue*(-1))}}%
              </span>
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
        <div>
          <i class="iconfont icon-neiye-zhexiantu cursor" :class="[isLine?'text-blue':'']"  @click="isLine = true"></i>
          <i class="iconfont icon-neiye-biaoge cursor" :class="[isLine?'':'text-blue']" @click="isLine = false"></i>
        </div>
      </div>
      <div class="section-content">
        <ve-line v-if="isLine"
          :data="saleLineData"
          :legend-visible="false"
          :settings="lineSettings"
          :extend="lineExtend"
        >
        </ve-line>
        <div  class="reset-table" v-else>
           <div style="overflow:hidden;zoom:1;margin:10px 0" class="reset-button">
            <el-button class="right" size="mini"  @click="getSaleOut">导出</el-button>
           </div>
            <el-table border :data="saleTableData" height="380">
            <el-table-column prop="dateKey" label="日期" min-width="100" fixed></el-table-column>
            <el-table-column prop="salesVolume" label="销售额" min-width="100" fixed></el-table-column>
            <el-table-column prop="salesOrders"  label="销售单量" min-width="100" fixed></el-table-column>
            <el-table-column prop="salesCount" label="销售数量" min-width="100" fixed></el-table-column>
            <el-table-column prop="unitPrice" label="平均单价" min-width="100"></el-table-column>
            <el-table-column prop="buyRate" label="购买率" min-width="100"></el-table-column>
            <el-table-column prop="sppPrice" label="SPP" min-width="100"></el-table-column>
            <el-table-column prop="sellingCost" label="销售成本" min-width="100"></el-table-column>
            <el-table-column prop="salesGrossProfit" label="销售毛利" min-width="100"></el-table-column>
            <el-table-column prop="salesGrossProfitRate" label="销售毛利率" min-width="100"></el-table-column>
            <el-table-column prop="memberSalesVolumePercent" label="会员消费占比" min-width="100"></el-table-column>
          </el-table>
        </div>
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
    <!-- <div class="section">
      <div class="section-title">
        <i class="el-icon-arrow-up icon"></i>
        卖品销售表现
      </div>
      <div class="section-content">
        <ve-scatter 
          :legend-visible="false"
          :data="scatterData"
          :settings="scatterSettings"
          :extend="scatterExtend"
        ></ve-scatter>
      </div>
    </div> -->
    <!-- 指标设置弹窗 -->
    <target-dialog ref="targetDailog" :userId="userId"></target-dialog>
  </div>
</template>
<script>
import config from "frame_cpm/http/config"
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
      groupId:1,
      cityId:this.$route.query.cityId?this.$route.query.cityId:null,
      cinemaId:this.$route.query.cinemaId? this.$route.query.cinemaId:null,
      isLine:true,
      userId:this.$store.state.loginUser?this.$store.state.loginUser.uid:805852,
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
      saleAllType:['xse','xsdl','xssl','kdj','jdj','kdl','cbj','xsml','xsmlr','xscb','gml','rjmpje','hyxfzb','tcxfzb'],
      saleLineAllData:null,
      saleTableData:[],
      channelType: 'xse', // 渠道/类型指标
      channelAllData:null,
      showPie: true, // 渠道/类型 饼图和柱状图切换
      tableData: [], // 表格列表
      size: 15,
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
        'xAxis.0.axisLabel.interval': 2,
      },
      // 渠道
      channelData:{
        columns: ["name", "value"],
        rows: []
      },
      // 渠道设置
      channelSettings: {
        level:[['线上','线下'],[]]
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
    formatTargetUnit:(type,money)=>{
      function formatUnit(num){
        if(Number.isInteger(num)){
          if(num <10000){
            return ''
          }else if(num <100000000){
            return  '万'
          }else {
            return  '亿'
          }
      }else{
        if(num < 10000){
          return ''
        }else if(num < 100000000){
            return '万'
        }else{
          return  '亿'
        }
      }
    }
      let unit = formatUnit(money);
      switch(type){
        case 'xse': // 销售额
          return unit + '元';
        break;
        case 'xscb': // 销售成本
          return unit + '元';
        break;
        case 'xsdl': // 销售单量
          return unit+ '单';
        break;
        case 'xssl': // 销售数量
          return unit + '件';
        break;
        case 'xsml': // 销售毛利
          return unit + '元';
        break;
        case 'xsmlr': // 销售毛利率
          return '%';
        break;
        case 'kdj': // 客单价
          return unit + '元';
        break;
        case 'kdl': // 客单量
          return unit + '件/单';
        break;
        case 'jdj': // 件单价
          return unit + '元';
        break;
        case 'gml': // 购买率
          return '%';
        break;
        case 'rjmpje': // 人均卖品金额
          return unit + '元';
        break;
        case 'hyxfzb': // 会员消费占比
          return '%';
        break;
        case 'tcxfzb': // 套餐消费占比
          return '%';
        break;
        case 'cbj': // 成本价
          return unit + '元';
        break;
      }
    },
    formatMoney(money){
      if(Number.isInteger(money)){
          if(money<10000){
            return money
          }else if(money <100000000){
            return (money/10000).toFixed(2)
          }else {
            return (money/(10000*10000)).toFixed(2)
          }
      }else{
        if(money < 10000){
          return money
        }else if(money < 100000000){
            return (money*100/(10000*100)).toFixed(2)
        }else{
          return (money*100/(10000*10000*100)).toFixed(2)
        }
      }
    }
  },
  created() {
    this.getAllData();
  },
  methods: {
    // 排序
    sortChange(column,prop,order){
      let params = {
          order:column.order,
          prop:column.prop
      };
    },
    // 指标趋势表格下载
    getSaleOut(){
      let params = {
          userId:this.userId,
          startDate: this.startTime,
          endDate: this.endTime,
          member:this.memberType,
          dateType: this.timeType,
          bsiCodes:this.saleAllType,
      }; 
      let baseURL = config.baseURL;
      let saleDownUrl =`${baseURL}/analysis/sellGoods/downloadSellGoodsSaleTend?userId=${this.userId}&startDate=${this.startTime}&endDate=${this.endTime}&dateType=${this.timeType}&member=${this.memberType}&bsiCodes=[${this.saleAllType}]&token=${this.$store.state.loginToken}`
      window.location.href = saleDownUrl;
    },
    getAllData() {
      this.getData();
      this.getTargetView();
      this.getTargetTrend();
      this.getChannelData();
      this.getGoodsData();
    },
    // 1.区域列表
    getData() {
      let params = {
        body: {
          userId:this.userId,
          groupId:this.groupId,
          cityId:this.cityId,
          cinemaId:this.cinemaId,
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
          cinemaId:this.cinemaId,
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
          cinemaId:this.cinemaId,
          startDate:this.startTime,
          endDate:this.endTime,
          dateType:this.timeType,
          member:this.memberType,
          bsiCodes:this.saleAllType,
        }
      };
      this.$camList.switchTarget(params).then(response =>{
        let res = response.data;
        this.saleLineAllData = res;
        this.saleTableData = res.indicatorSellGoods;
        if(res[this.saleType].sellAnalysis){
            this.saleLineData.rows = res[this.saleType].sellAnalysis.map(item=>{
            return {
              date:item.name,
              value:item.value,
            }
          })
        }
      })      
    },
    // 4. 渠道/品类数据
    getChannelData() {
      let id = this.channelType;
       let params = {
        body:{
          userId:this.userId,
          groupId:this.groupId,
          cityId:this.cityId,
          cinemaId:this.cinemaId,
          bsiCodes:this.saleAllType,
          startDate:this.startTime,
          endDate:this.endTime,
          dateType:this.timeType,
          member:this.memberType,
        }
      };
      this.$camList.switchChannel(params).then(response =>{
          this.channelAllData = response.data;
          let res = response.data;
          let targetData = response.data[this.channelType];
           // 品类
          if(targetData.category){
            this.categoryData.rows = targetData.category;
          }
          // 渠道
          if(targetData.channel){
            // this.channelData.rows = targetData.channel;
            this.channelDataHandle(targetData.channel)
          }
          if (id == 'xse' || id == 'xssl' || id == 'xsml' || id == 'xscb') {
              this.showPie = true;
          } else {
              this.showPie = false;
          }
      })
    },
    // 5. 销售表现
    getGoodsData() {
      let params = {
        body: {
          userId:this.userId,
          groupId:this.groupId,
          cityId:this.cityId,
          cinemaId:this.cinemaId,
          startDate: this.startTime,
          endDate: this.endTime,
          dateType: this.timeType,
          member:this.memberType,
        }
      };
      this.$camList.SaleGoodsData(params).then(response => {
        console.log(response,'卖品销售表现')
        let res = response.data;
        if (res.sellGoodsAll) {
          let data = res.sellGoodsAll;
          if (data) {
            for (var key in data) {
              data[key][0].buyRate = data[key][0].buyRate.toFixed(2); // 购买率
            }
            this.scatterData.rows = data;
          }
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
      let targetData = this.saleLineAllData[this.saleType];
      if(targetData.sellAnalysis){
          this.saleLineData.rows = targetData.sellAnalysis.map(item=>{
            return {
              date:item.name,
              value:item.value,
            }
          })
      }
    },
    // 改变/渠道及品类分布
    changeChannelType(id) {
      //  销售额1、销售数量3、销售毛利7、销售成本9 展示饼图
      //  销售单量2、人均消费额11、客单价4、件单价5、客单量6、购买率10、销售毛利率8、会员消费占比12 展示柱形图
      this.channelType = id;
      let targetData = this.channelAllData[id];
      if(targetData.category){
        this.categoryData.rows = targetData.category;
      }
      if(targetData.channel){
        this.channelDataHandle(targetData.channel)
      }
      if (id == 'xse' || id == 'xssl' || id == 'xsml' || id == 'xscb') {
        this.showPie = true;
      } else {
        this.showPie = false;
      }
    },
    // 渠道线上/线下数据处理
    channelDataHandle(channelData){
          let newData = channelData.slice(0);
          let onlineNum = 0;
          channelData.forEach(item=>{
              if(item.name == "pos机"){
                newData.push({name:'线下',value:item.value});
              }else{
                onlineNum += onlineNum + item.value;
              }
          })
          newData.push({name:'线上',value:onlineNum});
          this.channelData.rows = newData;
          this.channelSettings.level[1] = channelData.map(item=>{
            return item.name
          })
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
    
    // 查询
    search(){
      this.getAllData()
    }
  }
};
</script>
