// 卖品概览，有下转页面，要有（集团/区域/影院）三个页面路由
import AuthorityName from '../../partical/authorityName'
import config from "frame_cpm/http/config";
import TargetLabel from "../../partical/targetLabel";
import TargetDialog from "../../partical/targetDialog";
import CalendarView from "../../../components/calendar/calendar";
import Global from "../../../util/global.js";
import 'v-charts/lib/style.css'
// import { EventEmitter } from 'events';
export default {
  components: {TargetLabel, TargetDialog, CalendarView,AuthorityName},
  name:'卖品概览',
  data() {
    this.colors = ["#3B74FF","#FE6081", "#FEC107","#A5F053","#FE825E","#8E7EFF","#ca8622","#bda29a","#6e7074", "#546570","#c4ccd3"];
    return {
        categoryDataEmpty:null,
        channelDataEmpty:null,
        scatterDataEmpty:null,
        scatterLegend:null,
        orgType:null,
        orgName:null,
        cityId:null,
        cinemaId:null,
        targetLabel: Global.targetLabel,
        otherLabel: Global.otherLabel,
        otherLabel1: Global.otherLabel1, // 没有套餐
        currentTime: null,
        dateType: ["天", "周", "月", "年", "自定义"],
        dateTypeActive: "天",
        dateTypeIndex: null,
        timeType: "day",
        time: new Date(),
        startTime: null,
        endTime:null,
        channelTitle: {
            show: true,
            text: "渠\n\n道",
            textStyle: {
            fontSize: 12,
            color: "#666"
          },
          top:'35%'
        },
        categoryTitle: {
            show: true,
            text: "品\n\n类",
            textStyle: {
            fontSize: 12,
            color: "#666"
            },
            top: '35%'
        },
        isLine: true,
        userId: this.$store.state.loginUser? this.$store.state.loginUser.uid: null,
        memberType: 0, // 会员类型
        ratioType: 1, // 环比类型
        disabledChain: false, //不显示 环比
        disabledSame: false, //不显示 同比
        saleType: "xse", // 卖品指标
        saleAllType: ["xse", "xsdl","xssl","kdj", "jdj","kdl","cbj", "xsml","xsmlr","xscb","gml","rjmpje","hyxfzb","tcxfzb"],
        saleLineAllData: null,
        saleTableData: [],
        channelType: "xse", // 渠道/类型指标
        channelAllData: null,
        showPie: true, // 渠道/类型 饼图和柱状图切换
        tableData: [], // 表格列表
        sizes: Global.pageSizes,
        size: 15,
        page: 1,
        total: 0,
        iconColors: Global.iconColors,
        icons:Global.salesIcon,
        targetArr: [], // 指标概览
        saleLineData: {  // 指标趋势
          columns: ["date", "value"],
          rows: []
        },
        lineSettings: { // 指标趋势/折线图设置
            itemStyle: {
              color: "#3B74FF" // 折线点颜色
            },
            lineStyle: {
              color: "#3B74FF"
            }
        },
        lineExtend: {  // 指标趋势/折线图扩展
            "xAxis.0.axisLabel.rotate": 45,
            tooltip: {
                formatter: params => {
                    let date = params[0].name;
                    let value = this.$options.filters.formatNum(params[0].value[1]) + this.saleUnit;
                    let str = params[0].marker + date + "<br>" + "&nbsp&nbsp&nbsp" + value;
                    return str;
                }
            },
        },
        channelData: {  // 渠道饼图
            columns: ["name", "value"],
            rows: []
        },
        channelSettings: { // 渠道设置
            level: [["线上", "线下"], []]
        },
        channelBarData: { // 渠道柱状图
            columns: ["name", "value"],
            rows: []
        },
        categoryData: {  // 品类
            columns: ["name", "value"],
            rows: []
        },
        categorySettings: { // 品类设置
            roseType: "radius"
        },
        pieExtend: {  // 饼图扩展
            legend: {
              top: "bottom",
              itemWidth: 10,
              itemHeight: 10,
              textStyle: {
                  color: "#333",
                  fontSize: 12
              },
            }, 
            label: {
               formatter: (params) => {
                 let name = params.name;
                 if (name == '线上' || name == '线下') {
                   return name
                 } else {
                   let value = this.$options.filters.formatNum(params.value) + this.channelUnit;
                   let percent = params.percent;
                   return percent + '%' + '（' + value + '）'
                 }
               },
            },
            tooltip: {
              formatter: params => {
                  let name = params.name;
                  let value = this.$options.filters.formatNum(params.value) + this.channelUnit;
                  let percent = params.percent;
                  let str = params.marker + name + "<br>"+ percent + '%'+'（' + value + '）';
                  return str;
              }
            },  
        },
        barExtend: {  //柱状图扩展
            barWidth: 10,
            color: "#3B74FF",
            tooltip: {
              formatter: params => {
                  let name = params[0].name;
                  let value = this.$options.filters.formatNum(params[0].value) + this.channelUnit;
                  let str = params[0].marker + name + "<br>" + value;
                  return str;
              }
            },
            xAxis:{
              axisLabel:{
                formatter:(value,index)=>{
                  if(value.length>8){
                    return value.slice(0, 8) + '...'
                  }else{
                    return value
                  }
                },
                rotate:45,
                interval:0
              }
            },
            grid:{
              left:'4%',
              right:'4%',
            }
        },
        scatterData: {  // 卖品销售表现（四象限）
        columns: ["buyRate", "unitPrice", "salesVolume"],
        rows: {}
        },
        scatterTitle:{
            show: true,
            text: "客\n\n单\n\n价\n\n(元)",
            textStyle: {
              fontSize: 12,
              color: "#666"
            },
            top: '35%'
        },
        markLine:{
          lineStyle:{
            color:'#666',
            type:'solid'
          },
          data:[{
            name: 'Y轴的均值水平线',
            yAxis: 0
          },{
            name:'x轴的均值水平线',
            xAxis:0
          }]
        },
        scatterSettings: { 
          tooltipTrigger: 'axis',
          dimension: ["buyRate"], 
          metrics: ["unitPrice", "salesVolume","buyRate"],
          xAxisType: "value", // x轴类型  category, value, time, log
          xAxisName: "卖品购买率(%)", // 
          yAxisName:null,
          labelMap: {
              buyRate: "购买率",
              salesVolume: "销售额",
              unitPrice: "客单价"
          },
        },
        scatterExtend: {  // 散点图扩展
          tooltip: {
            formatter: (params) => {
              let str = params.map(item=>{
                let name = item.marker + item.seriesName + '<br>';
                let ratio = "购买率:" + item.value[0] + "%" + '<br>';
                let unitPrice =
                  "客单价:" +
                  this.$options.filters.formatNum(item.value[1]) + '元' +
                  "<br>";
                let sale =
                  "销售额:" +
                  this.$options.filters.formatNum(item.value[2]) + '元' +
                  "<br>";
                return name + ratio + unitPrice + sale
              })
              return str.join('');
            }
          },
          grid: {
             left: '4%',
             right: '4%'
           },
          yAxis: {
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
              padding: 20
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
  computed:{
    saleUnit(){
       if(this.saleType){
         return Global.saleTargetUnitMap[this.saleType]
       }else{
         return ''
       }
    },
    channelUnit(){
      if (this.channelType){
         return Global.saleTargetUnitMap[this.channelType]
      }else{
        return ''
      }
    },

  },
  filters: {
    // 带单位
    formatNum: (money, count,unit) => {
      return Global.formatNum(money,count,unit);
    },
    // 不带单位
    formatMoney(money,indicatorCode) {
        if(indicatorCode == 'xssl' || indicatorCode == 'xsdl'){
            return Global.formatMoney(money,0);
        }else{
            return Global.formatMoney(money);
        }
    },
    formatTargetUnit: (type, money) => {
      return Global.formatTargetUnit(type, money);
    }
  },
  created() {
    this.getCurrentTime();
    this.initData();
  },
  methods: {
    getCurrentTime() {
      this.$camList.getCurrentTime().then(res => {
        this.currentTime = res.data;
      });
    },
    initData() {
        let params = this.$route.query;
        this.timeType = params.dateType ? params.dateType : "day";
        this.dateTypeActive = params.dateType ? params.dateType : "day";
        // this.dateTypeIndex = params.dateTypeIndex ? params.dateTypeIndex: null;
        this.startTime = params.startTime? params.startTime: this.$moment(new Date()).format("YYYY-MM-DD");
        this.endTime = params.endTime ? params.endTime: this.$moment(new Date()).format("YYYY-MM-DD");
        this.cityId = params.cityId?params.cityId:null;
        this.cinemaId = params.cinemaId?params.cinemaId:null;
        this.orgName = params.name?params.name:null;
        if (this.timeType == "day") {
            this.time = this.startTime;
        } else {
            this.time = [this.startTime, this.endTime];
        }
      this.getOrg().then(()=>{
         this.getAllData();
      });
     
    },
    getOrg(){
       return new Promise((resolve, reject) => {
         if (this.orgName) { 
           let orgType = ["group", "area", "cinema"].find(item => this.$route.path.includes(item));
           if (orgType == 'area') {
             this.orgType = 'city';
           } else {
             this.orgType = orgType;
           }
           resolve()
         } else { 
           this.$camList.getOrgInfo({body: {}}).then(res => {
             if (res.data) {
               this.orgName = res.data.orgName;
               this.orgType = res.data.orgType;
             }
             resolve()
           })
         }
       }) 
    },
    // 指标趋势表格下载
    getSaleOut() {
      let baseURL = config.baseURL;
      let saleDownUrl = `${baseURL}/analysis/sellGoods/downloadSellGoodsSaleTend?userId=${
        this.userId
      }&startDate=${this.startTime}&endDate=${this.endTime}&dateType=${
        this.timeType
      }&member=${this.memberType}&bsiCodes=[${this.saleAllType}]&token=${
        this.$store.state.loginToken
      }`;
      if(this.orgType == 'city'){
          if(this.cityId){
            saleDownUrl = `${saleDownUrl}&cityId=${this.cityId}`;
          }
    }else if(this.orgType == 'cinema'){
        if(this.cinemaId){
          saleDownUrl = `${saleDownUrl}&cinemaId=${this.cinemaId}`;
        }
    }
      window.location.href = saleDownUrl;
    },
    // 区域导出
    getAreaOut() {
      let baseURL = config.baseURL;
      let saleDownUrl = `${baseURL}/analysis/sellGoods/downloadSellGoodsArea?userId=${
        this.userId
      }&startDate=${this.startTime}&endDate=${this.endTime}&dateType=${
        this.timeType
      }&member=${this.memberType}&token=${this.$store.state.loginToken}`;
      if(this.orgType == 'city'){
        if(this.cityId){
          saleDownUrl = `${saleDownUrl}&cityId=${this.cityId}`;
        }
      }else if(this.orgType == 'cinema'){
          if(this.cinemaId){
            saleDownUrl = `${saleDownUrl}&cinemaId=${this.cinemaId}`;
          }
      }
      window.location.href = saleDownUrl;
    },
    getAllData() {
      this.getTargetView();
      this.getTargetTrend();
      this.getChannelData();
      this.getGoodsData();
      this.getTableData();
    },
    // 2.卖品指标概览
    getTargetView(codes) {
      let params = {
        body: {
          userId: this.userId,
          cityId:this.cityId,
          cinemaId:this.cinemaId,
          startDate: this.startTime,
          endDate: this.endTime,
          dateType: this.timeType,
          member: this.memberType,
          indicatorCodes: codes
        }
      };
      this.$camList.saleTargetView(params).then(response => {
        let res = response.data;
        if (res) {
          this.targetArr = res;
        }
      });
    },
    // 3.卖品指标趋势
    getTargetTrend() {
      let params = {
        body: {
          userId: this.userId,
          cityId:this.cityId,
          cinemaId:this.cinemaId,
          startDate: this.startTime,
          endDate: this.endTime,
          dateType: this.timeType,
          member: this.memberType,
          bsiCodes: this.saleAllType
        }
      };
      this.$camList.switchTarget(params).then(response => {
        let res = response.data;
        this.saleLineAllData = res;
        if (res.indicatorSellGoods) {
          this.saleTableData = res.indicatorSellGoods;
        }
        if (res[this.saleType].sellAnalysis) {
          this.saleLineData.rows = res[this.saleType].sellAnalysis.map(item => {
            return {
              date: item.name,
              value: item.value,
            };
          });
        }
      });
    },
    // 4. 渠道/品类数据
    getChannelData() {
      let params = {
        body: {
          userId: this.userId,
          cityId:this.cityId,
          cinemaId:this.cinemaId,
          startDate: this.startTime,
          endDate: this.endTime,
          dateType: this.timeType,
          member: this.memberType,
          bsiCodes: this.saleAllType
        }
      };
      this.$camList.switchChannel(params).then(response => {
        this.channelAllData = response.data;
        let res = response.data;
        let targetData = res[this.channelType];
        if (targetData.category && targetData.category.length>0) {
          this.categoryDataEmpty = false;
          this.categoryTitle.text = "品\n\n类";
          this.categoryData.rows = targetData.category;
        }else{
          this.categoryTitle.text = null;
          this.categoryDataEmpty = true;
           this.categoryData.rows = [];
        }
        if (targetData.channel && targetData.channel.length>0) {
          this.channelDataEmpty = false;
          this.channelTitle.text = "渠\n\n道";
          this.channelDataHandle(targetData.channel, targetData.channelLine);
        }else{
          this.channelTitle.text = null;
          this.channelDataEmpty = true;
          this.channelData.rows = [];
          this.channelBarData.rows = [];
        }
        if (
          this.channelType == "xse" ||
          this.channelType == "xssl" ||
          this.channelType == "xsml" ||
          this.channelType == "xscb"
        ) {
          this.showPie = true;
        } else {
          this.showPie = false;
        }
      });
    },
    // 5. 销售表现
    getGoodsData() {
      let params = {
        body: {
          userId: this.userId,
          cityId:this.cityId,
          cinemaId:this.cinemaId,
          startDate: this.startTime,
          endDate: this.endTime,
          dateType: this.timeType,
          member: this.memberType
        }
      };
      this.$camList.SaleGoodsData(params).then(response => {
        let res = response.data;
        if (res && res.sellGoodsAll) {
          let data = res.sellGoodsAll;
          if (JSON.stringify(data) === '{}' ) {
            this.scatterDataEmpty = true;
            this.scatterData.rows = [];
            this.scatterSettings.xAxisName = null;
            this.scatterTitle.text = null;
            this.scatterLegend = false;
          }else{
            this.scatterDataEmpty = false;
            this.scatterData.rows = data;
            this.scatterMarkLine(data);
            this.scatterSettings.xAxisName = "卖品购买率(%)";
            this.scatterTitle.text = "客\n\n单\n\n价\n\n(元)";
            this.scatterLegend = true;
          }
        }
      });
    },
    scatterMarkLine(data){
      let unitPrices = [];
      let buyRates = [];
      for(let key in data){
        unitPrices.push(data[key][0].unitPrice);
        buyRates.push(data[key][0].buyRate);
      }
      let ymax = Math.max.apply(null,unitPrices);
      let xmax = Math.max.apply(null, buyRates);
      this.markLine.data[0].yAxis = (ymax) / 2;
      this.markLine.data[1].xAxis = (xmax) / 2;
    },
    // 6.区域分页
    getTableData() {
      let params = {
        body: {
          userId: this.userId,
          cityId:this.cityId,
          cinemaId:this.cinemaId,
          dateType: this.timeType,
          startDate: this.startTime,
          endDate: this.endTime,
          member: this.memberType,
          pageNo: this.page,
          pageSize: this.size
        }
      };
      this.$camList.cityTabelData(params).then(response => {
        let res = response.data;
        if (res && res.sellGoodsList) {
          this.tableData = res.sellGoodsList.list;
          this.total = res.sellGoodsList.total;
        }
      });
    },
    //获取时间类型
    getTimeType(type) {
      this.timeType = type;
      if (this.timeType == "year") {
        //年 不显示同比
        this.disabledSame = true;
        this.disabledChain = false;
        this.ratioType = 1; //1.环比 2. 同比
      } else if (this.timeType == "custom") {
        // 自定义 不显示同比、环比
        this.disabledSame = true;
        this.disabledChain = true;
        this.ratioType = null;
      } else {
        this.disabledSame = false;
        this.disabledChain = false;
        this.ratioType = 1;
      }
    },
    //改变时间
    changeTime(option) {
      if (option.startTime) {
        this.startTime = option.startTime;
        this.endTime = option.endTime;
        // this.dateTypeIndex = option.index;
      } else {
        this.startTime = this.$moment(option).format("YYYY-MM-DD");
        this.endTime = this.$moment(option).format("YYYY-MM-DD");
      }
      this.page = 1;
    },
    // 改变/会员
    changeMemberType(id) {
      if(id){
        this.memberType = 1; 
      }else{
        this.memberType = 0; 
      }
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
      if (targetData.sellAnalysis) {
        this.saleLineData.rows = targetData.sellAnalysis.map(item => {
          return {
            date: item.name,
            value: item.value,
            name: id,
          };
        });
      }
    },
    // 改变/渠道及品类分布
    changeChannelType(id) {
      //  销售额1、销售数量3、销售毛利7、销售成本9 展示饼图
      //  销售单量2、人均消费额11、客单价4、件单价5、客单量6、购买率10、销售毛利率8、会员消费占比12 展示柱形图
      this.channelType = id;
      let targetData = this.channelAllData[id];
      if (targetData.category && targetData.category.length>0) {
        this.categoryData.rows = targetData.category;
        this.categoryDataEmpty = false;
        this.categoryTitle.text = "品\n\n类";
      }else{
        this.categoryDataEmpty = true;
        this.categoryTitle.text = null;
        this.categoryData.rows = [];
      }
      if (targetData.channel && targetData.channel.length>0) {
        this.channelDataEmpty = false;
        this.channelTitle.text = "渠\n\n道";
        this.channelDataHandle(targetData.channel, targetData.channelLine);
      }else{
        this.channelTitle.text = null;
        this.channelDataEmpty = true;
        this.channelData.rows = [];
        this.channelBarData.rows = [];
      }
      this.$nextTick(() => {
        if (id == "xse" || id == "xssl" || id == "xsml" || id == "xscb") {
          this.showPie = true;
        } else {
          this.showPie = false;
        }
      });
    },
    // 渠道线上/线下数据处理
    channelDataHandle(channelData, channelLine) {
      let newData = channelData.slice(0);
      // if (channelLine && channelLine.length > 0) {
      //   newData = newData.concat(channelLine);
      // }
      this.channelBarData.rows = channelData;
      this.channelData.rows = newData;
      // let names = channelData.map(item => {
      //       return item.name;
      // })
      // this.channelSettings.level[1] = [...new Set(names)]
    },
    // 指标设置/弹窗
    showTargetSetting() {
      let targetDialog = this.$refs.targetDialog;
      let params = {
        body: {
          userId: this.userId,
        }
      };
      this.$camList.saleTargetBinding(params).then(response => {
        let res = response.data;
        targetDialog.profit = res.profit;
        targetDialog.ratio = res.ratio;
        targetDialog.sale = res.sale;
        targetDialog.show = true;
      });
    },
    goDetail(id,name) {
      this.$router.push({
        path: "/analysis/area/sale/total",
        query: {
          cityId: id,
          startTime: this.startTime,
          endTime: this.endTime,
          dateType: this.timeType,
          // dateTypeIndex: this.dateTypeIndex,
          type:'city',
          name:name
        }
      });
    },
    goCinemaDetail(id,name){
        this.$router.push({
            path: "/analysis/cinema/sale/total",
            query: {
              cinemaId: id,
              cityId: this.cityId,
              startTime: this.startTime,
              endTime: this.endTime,
              dateType: this.timeType,
              // dateTypeIndex: this.dateTypeIndex,
              type:'cinema',
              name:name
            }
          });
    },
    search() {
      this.getAllData();
    },
    handleSizeChange(num) {
      this.size = num;
      this.getTableData();
    },
    handleCurrentChange(num) {
      this.page = num;
      this.getTableData();
    }
  }
};