// import config from "frame_cpm/http/config"
// import TargetLabel from "../../views/partical/targetLabel";
// import TargetDialog from "../../views/partical/targetDialog";
// import CalendarView from '../../components/calendar/calendar'
// import Global from '../global.js'
// import AuthorityName from '../../views/partical/authorityName'
// import BreadCrumb from '../../views/partical/breadCrumb'
export default {
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
      targetLabel:Global.memberTargetLabel,
      otherLabel:Global.memberOtherLabel,
      cinemaBrand:[{id:1,name:'全部'},{id:2,name:'大地'},{id:3,name:'中瑞'}],
      brandId:null,
      orgType:'group',
      orgName:'总部',
      currentTime:null,
      disabledChain:false, //不显示 环比
      disabledSame:false, //不显示 同比
      dateType:['天', '周', '月', '年','自定义'],
      dateTypeActive:'天',
      dateTypeIndex:null,
      timeType: "day",
      time: new Date(),
      startTime: this.$moment(new Date()).format("YYYY-MM-DD"),
      endTime: this.$moment(new Date()).format("YYYY-MM-DD"),
      channelTitle:{
        show:true,
        text:'新增会员渠道占比',
        textStyle:{
          fontSize:12,
          color:'#666'
        },
        padding:[20,10,10,10],
      },
      categoryTitle:{
        show:true,
        text:'会员类型分布',
        textStyle:{
          fontSize:12,
          color:'#666'
        },
        padding:[20,10,10,10],
      },
     
      isLine:true,
      userId:this.$store.state.loginUser?this.$store.state.loginUser.uid:null,
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
      sizes:Global.pageSizes,
      size: 15,
      page: 1,
      total: 0,
      iconColors:['#fe825e','#8e7eff','#3b74ff','#ff6081','#fec107','#17cd31'],
      icons:["icon-neiye-zongxiaoshoue","icon-neiye-kedanjia","icon-neiyegoumaishuai","icon-neiye-jine","icon-neiye-xiaofei","icon-neiye-xiaoshoue"],
      // 指标概览
      targetArr: [{
          indicatorName:'新增会员数',
          value:34567,
          indicatorCode:'人',
          roundPeriodValue:10,
          samePeriodValue:12,

      },{
          indicatorName:'有效会员数',
          value:34567,
          indicatorCode:'人',
          roundPeriodValue:10,
          samePeriodValue:12,

      },{
          indicatorName:'会员卡费收益',
          value:34567,
          indicatorCode:'人',
          roundPeriodValue:10,
          samePeriodValue:12,

      },{
          indicatorName:'会员储值金额',
          value:34567,
          indicatorCode:'元',
          roundPeriodValue:10,
          samePeriodValue:12,

      },{
          indicatorName:'会员消费金额',
          value:34567,
          indicatorCode:'元',
          roundPeriodValue:10,
          samePeriodValue:12,

      },{
          indicatorName:'会员消费占比',
          value:34567,
          indicatorCode:'元',
          roundPeriodValue:10,
          samePeriodValue:12,

      }],
      // 指标趋势
      saleLineData: {
        columns: ["date", "value"],
        rows: []
      },
      // 指标趋势/折线图设置
      lineSettings: {
        itemStyle: {
          color: "#3B74FF", // 折线点颜色
        }, 
        lineStyle: {
          color: "#3B74FF"
		}
      },
      // 指标趋势/折线图扩展
      lineExtend: {
        "xAxis.0.axisLabel.rotate": 45,
		    'xAxis.0.axisLabel.interval': 2,
        tooltip:{
              // trigger:'', // axis：坐标轴触发：（折线图、柱状图） item:数据项触发，散点图，饼图
          formatter:(params)=>{
            let date = params[0].name;
            let value = this.$options.filters.formatNum(params[0].value[1]);
            let str = date + '<br>' + value;
            return str;
                }
            }
          },
      // 渠道饼图
      channelData:{
        columns: ["name", "value"],
        rows: []
      },
      // 渠道设置
      channelSettings: {
        level:[['线上','线下'],[]]
      },
      // 渠道柱状图
      channelBarData:{
        columns: ["name", "value"],
        rows: []
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
		  },
		},
		label:{
			formatter:'{b}({d}%)'
		},
		tooltip:{
			formatter:(params) =>{
				let name = params.name;
				let value = this.$options.filters.formatNum(params.value);
				let percent = params.percent;
				let str = name + ':' + value + '<br>'+ '(' + percent + '%)';
				return str
			}
		}
      },
      //柱状图扩展
      barExtend: {
        barWidth: 10,
        color: "#3B74FF",
        tooltip:{
          formatter:(params)=>{
            let name = params[0].name;
            let value = this.$options.filters.formatNum(params[0].value);
            let str = name + '<br>' + value;
            return str;
          }
		  }
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
		tooltip:{
			formatter:(params)=>{
				let name = params.seriesName + "<br>";
				let ratio = '购买率:'+ params.value[0] + '%'  + "<br>";
				let unitPrice = '客单价:'+ this.$options.filters.formatNum(params.value[1])  + "<br>";
				let sale = '销售额:' + this.$options.filters.formatNum(params.value[2])  + "<br>";
				return name + ratio + unitPrice + sale;
			}
		},
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
    // 带单位
    formatNum:(money,unit) =>{
      return Global.formatNum(money,unit);
     
    },
    // 不带单位
    formatMoney(money){
      return Global.formatMoney(money)
    },
    formatTargetUnit:(type,money)=>{
      return Global.formatTargetUnit(type,money)
    },
  },
  watch:{
    "$route.query.startTime":function(){
      this.getCurrentTime();
      this.initData();
    }
  },
  created() {
    this.getCurrentTime();
    // this.initData();
  },
  methods: {
    
    getCurrentTime(){
      this.$camList.getCurrentTime().then(res=>{
        this.currentTime = res.data;
      })
    },
    initData(){
      let params = this.$route.query;
      this.timeType =  params.dateType?params.dateType:'day',
      this.dateTypeActive = params.dateType?params.dateType:'day',
      this.dateTypeIndex = params.dateTypeIndex?params.dateTypeIndex:null,
      this.startTime = params.startTime?params.startTime:this.$moment(new Date()).format("YYYY-MM-DD"), 
      this.endTime = params.endTime?params.endTime:this.$moment(new Date()).format("YYYY-MM-DD");
      if(this.timeType == 'day'){
        this.time = this.startTime;
      }else{
        this.time = [this.startTime,this.endTime]
      }
      this.getAllData()
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
    let saleDownUrl =`${baseURL}/analysis/sellGoods/downloadSellGoodsSaleTend?userId=${this.userId}&startDate=${this.startTime}&endDate=${this.endTime}&dateType=${this.timeType}&member=${this.memberType}&bsiCodes=[${this.saleAllType}]&token=${this.$store.state.loginToken}`;
      // console.log(saleDownUrl,'group 指标趋势下载')
      window.location.href = saleDownUrl;
    },
    // 区域导出
    getAreaOut(){
       let params = {
          userId:this.userId,
          startDate: this.startTime,
          endDate: this.endTime,
          member:this.memberType,
          dateType: this.timeType,  
      }; 
      let baseURL = config.baseURL;
      let saleDownUrl =`${baseURL}/analysis/sellGoods/downloadSellGoodsArea?userId=${this.userId}&startDate=${this.startTime}&endDate=${this.endTime}&dateType=${this.timeType}&member=${this.memberType}&token=${this.$store.state.loginToken}`;
      // console.log(saleDownUrl,'group表格下载')
     	window.location.href = saleDownUrl;
    },
    // all api
    getAllData() {
        this.getTargetView();
        this.getTargetTrend();
        this.getChannelData();
        this.getGoodsData();
        this.getTableData();
        // this.init()
    },
    // 2.卖品指标概览
    getTargetView(codes){
    //   let params = {
    //     body:{
    //       userId:this.userId,
    //       startDate:this.startTime,
    //       endDate:this.endTime,
    //       dateType:this.timeType,
    //       member:this.memberType,
    //       indicatorCodes:codes,
    //     }
    //   };
    //   this.$camList.saleTargetView(params).then(response =>{
    //     let res = response.data;
    //     this.targetArr = res;
    //   })
    },
    // 3.卖品指标趋势
    getTargetTrend(){
    //   let params = {
    //     body:{
    //       userId:this.userId,
    //       startDate:this.startTime,
    //       endDate:this.endTime,
    //       dateType:this.timeType,
    //       member:this.memberType,
    //       bsiCodes:this.saleAllType,
    //     }
    //   };
    //   this.$camList.switchTarget(params).then(response =>{
    //     let res = response.data;
	// 	this.saleLineAllData = res;
    //     if(res.indicatorSellGoods){
    //        this.saleTableData = res.indicatorSellGoods;
    //     }
    //     if(res[this.saleType].sellAnalysis){
    //         this.saleLineData.rows = res[this.saleType].sellAnalysis.map(item=>{
    //         return {
    //           date:item.name,
    //           value:item.value,
    //         }
    //       })
    //     }
      
    //   })      
    },
    // 4. 渠道/品类数据
    getChannelData() {
    //    let params = {
    //     body:{
    //       userId:this.userId,
    //       startDate:this.startTime,
    //       endDate:this.endTime,
    //       dateType:this.timeType,
    //       member:this.memberType,
    //       bsiCodes:this.saleAllType,
    //     }
    //   };
    //   this.$camList.switchChannel(params).then(response =>{
    //       this.channelAllData = response.data;
    //       let res = response.data;
    //       let targetData = response.data[this.channelType];
    //       // 品类
    //       if(targetData.category){
    //         this.categoryData.rows = targetData.category;
    //       }
    //       // 渠道
    //       if(targetData.channel){
    //         // this.channelBarData.rows = targetData.channel;
    //         this.channelDataHandle(targetData.channel,targetData.channelLine)
    //       }
    //       if (this.channelType == 'xse' || this.channelType == 'xssl' || this.channelType == 'xsml' || this.channelType == 'xscb') {
    //           this.showPie = true;
    //       } else {
    //           this.showPie = false;
    //       }
    //   })
    },
    // 5. 销售表现
    getGoodsData() {
      let params = {
        body: {
          userId:this.userId,
          groupId: this.groupId,
          startDate: this.startTime,
          endDate: this.endTime,
          dateType: this.timeType,
          member:this.memberType,
        }
      };
      this.$camList.SaleGoodsData(params).then(response => {
        let res = response.data;
        if (res && res.sellGoodsAll) {
		  let data = res.sellGoodsAll;
          if (data) {
			this.scatterData.rows = data;
          }
        }
      });
    },
    // 6.区域分页
    getTableData() {
      let params = {
        body: {
          userId:this.userId,
          dateType: this.timeType,
          startDate: this.startTime,
          endDate: this.endTime,
          member:this.memberType,
          pageNo: this.page,
          pageSize: this.size
        }
	  };
      this.$camList.cityTabelData(params).then(response => {
		let res = response.data;
        if (res.sellGoodsList) {
		  this.tableData = res.sellGoodsList.list;
		  this.total = res.sellGoodsList.total;
        }
      });
    },
    //获取时间类型
    getTimeType(type) {
	  this.timeType = type;
      if(this.timeType == 'custom'){
        // 自定义 不显示同比、环比
        this.disabledSame = true;
        this.disabledChain = true;
        this.ratioType = null;
	  }else{
        this.disabledSame = false;
        this.disabledChain = false;
        this.ratioType = 1
      }
    },
    //改变时间
    changeTime(option) {
      if (option.startTime) {
        this.startTime = option.startTime;
        this.endTime = option.endTime;
        this.dateTypeIndex = option.index;
      }else{
        this.startTime = this.$moment(option).format('YYYY-MM-DD');
        this.endTime = this.$moment(option).format('YYYY-MM-DD');
	  }
	  this.page = 1;
      this.$nextTick(()=>{
         this.getAllData();
      })
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
    //   let targetData = this.saleLineAllData[this.saleType];
    //   if(targetData.sellAnalysis){
    //       this.saleLineData.rows = targetData.sellAnalysis.map(item=>{
    //         return {
    //           date:item.name,
    //           value:item.value,
    //         }
    //       })
    //   }
    },
    // 改变/类型及渠道分布
    changeChannelType(id) {
      //  销售额1、销售数量3、销售毛利7、销售成本9 展示饼图
      //  销售单量2、人均消费额11、客单价4、件单价5、客单量6、购买率10、销售毛利率8、会员消费占比12 展示柱形图
    //   this.channelType = id;
    //   let targetData = this.channelAllData[id];
    //   if(targetData.category){
    //     this.categoryData.rows = targetData.category;
    //   }
    //   if(targetData.channel){
    //     this.channelDataHandle(targetData.channel,targetData.channelLine)
    //   }
    //   this.$nextTick(()=>{
    //     if (id == 'xse' || id == 'xssl' || id == 'xsml' || id == 'xscb') {
    //       this.showPie = true;
    //     } else {
    //       this.showPie = false;
    //     }
    //   })
    },
    // 渠道线上/线下数据处理
    channelDataHandle(channelData,channelLine){
     let newData = channelData.slice(0);
     if(channelLine && channelLine.length>0){
        newData = newData.concat(channelLine);
     }
      this.channelBarData.rows = channelData;
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
    // 前往城市版
    goDetail(id) {
      this.$router.push({ path: "/analysis/area/sale/total", 
        query: { 
          cityId: id, 
          startTime:this.startTime,
          endTime:this.endTime,
          dateType:this.timeType, // 时间类型
          dateTypeIndex:this.dateTypeIndex
        }
      });
    },
    // 查询
    search(){
      this.getAllData()
    }, 
    // 分页/大小
    handleSizeChange(num) {
      this.size = num;
      this.getTableData();
    },
    //分页/页码
    handleCurrentChange(num) {
      this.page = num;
      this.getTableData();
    }
  }
};

