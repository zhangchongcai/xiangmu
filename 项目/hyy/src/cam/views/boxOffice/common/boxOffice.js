import config from "frame_cpm/http/config";
import TargetLabel from "../../partical/targetLabel";
import TargetDialog from "../../partical/targetNewDialog";
import AuthorityName from "../../partical/authorityName"
import CalendarView from "../../../components/calendar/calendar";
import Global from "../../../util/global.js";
import CalcPad from '../../../mixins/calcPad.js'
export default {
  mixins: [CalcPad],
  components: { 
    TargetLabel, 
    TargetDialog, 
    CalendarView,
    AuthorityName
  },
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
      // 数据
      showMoviePie: true, //影院显示  饼图/柱状图
      showChannelPie: true, //渠道显示  饼图/柱状图
      activeType: 'boxOffice',
      memberType: false, // 会员类型
      memberTypeVal: 0,
      cinemaList: [],
      cinemaId: null,
      orgType:"group",
      orgName:"大地影院集团",
      targetList: [],
      targetLabel: Global.boxOfficeTrend,   // 趋势指标
      targetLabel1: Global.boxOfficeMovie,  // 影片指标
      targetLabel2: Global.boxOfficeMovie,  // 渠道指标
      otherLabel: Global.boxOfficeTrendOther, // 趋势指标 -其他
      otherLabel1: Global.boxOfficeMovieOther, // 影片指标 -其他
      otherLabel2: Global.boxOfficeChannelOther, // 渠道指标 -其他
      currentTime: null,
      disabledChain: false, //不显示 环比
      disabledSame: false, //不显示 同比
      dateType: ["天", "周", "月", "年", "自定义"],
      dateTypeActive: "天",
      dateTypeIndex: null,
      timeType: "day",
      time: new Date(),
      showTimeLabel: new Date().formatDate("yyyy/MM/dd"),
      startTime: new Date().formatDate("yyyy/MM/dd"),
      endTime: new Date().formatDate("yyyy/MM/dd"),
      movieChartEmpty: true,
      movieTitle: {
        show: true,
        text: "",//"影\n片\n票\n房\n占\n比",
        textStyle: {
          fontSize: 12,
          color: "#666"
        },
        left: '0',
        top: 'center'
      },
      movieTitle1: {
        show: true,
        text: "",//"影片票房占比",
        textStyle: {
          fontSize: 12,
          color: "#666"
        },
        left: 'center',
        top: '10',
        padding: [20, 10, 10, 10]
      },
      channelChartEmpty: true,
      channelTitle: {
        show: true,
        text: "",//"渠\n道\n票\n房\n占\n比",
        textStyle: {
          fontSize: 12,
          color: "#666"
        },
        left: '0',
        top: 'center'
      },
      channelTitle1: {
        show: true,
        text: "",//"渠道票房占比",
        textStyle: {
          fontSize: 12,
          color: "#666"
        },
        left: 'center',
        top: '10',
        padding: [20, 10, 10, 10]
      },
      groupId: null,
      isLine: true,
      userId: this.$store.state.loginUser
      ? this.$store.state.loginUser.uid
      : null,
      ratioType: 1, // 环比类型
      trendIndicatorType: "boxOffice", // 票房指标
      channelIndicatorType: 'boxOffice', //渠道指标类型
      movieIndicatorType: 'boxOffice', //影片指标类型
      boxTableData: [],
      channelType: "xse", // 渠道/类型指标
      channelAllData: null,
      tableData: [
       
      ], // 表格列表
      sizes: Global.pageSizes,
      size: Global.pageSize,
      page: 1,
      total: 0,
      tableSortMsg: null, //表格排序信息
      iconColors: [
        "#fe825e",
        "#8e7eff",
        "#3b74ff",
        "#ff6081",
        "#fec107",
        "#17cd31"
      ],
      icons: [
        "icon-neiye-zongxiaoshoue",
        "icon-neiye-kedanjia",
        "icon-neiyegoumaishuai",
        "icon-neiye-jine",
        "icon-neiye-xiaofei",
        "icon-neiye-xiaoshoue"
      ],
      // 指标概览
      targetArr: [],
      // 指标趋势
      boxLineData: {
        columns: ["date", "value"],
        rows: []
      },
      lineChartEmpty: true,
      // 指标趋势/折线图设置
      lineSettings: {
        itemStyle: {
          color: "#3B74FF" // 折线点颜色
        },
        lineStyle: {
          color: "#3B74FF"
        }
      },
      // 指标趋势/折线图扩展
      lineExtend: {
        "xAxis.0.axisLabel.rotate": 45,
        "xAxis.0.axisLabel.interval": 2,
        tooltip: {
          // trigger:'', // axis：坐标轴触发：（折线图、柱状图） item:数据项触发，散点图，饼图
          formatter: params => {
            let date = params[0].name;
            let index = params[0].dataIndex;
            let value = this.$options.filters.formatNum(params[0].value[1], this.trendIndicatorType) + this.$options.filters.formatTargetUnit(this.trendIndicatorType);
            let str = params[0].marker + date + "<br>" + value;
            return str;
          }
        }
      },
      // 影片玫瑰图
      movieData: {
        columns: ["name", "value"],
        rows: []
      },
      // 渠道设置
      channelSettings: {
        level: [["线上", "线下"], []]
      },
      // 渠道
      channelData: {
        columns: ["name", "value"],
        rows: []
      },
      //柱状图扩展
      barExtendChannel: {
        barWidth: 10,
        color: "#3B74FF",
        tooltip: {
          formatter: params => {
            let name = params[0].name;
            let value = this.$options.filters.formatNum(params[0].value, this.channelIndicatorType) + this.$options.filters.formatTargetUnit(this.channelIndicatorType);
            let str = params[0].marker + name + "<br>" + value;
            return str;
          }
        },
        "xAxis.0.axisLabel.interval": 0,
        "xAxis.0.axisLabel.rotate": 45
      },
      //柱状图扩展
      barExtendMovie: {
        barWidth: 10,
        color: "#3B74FF",
        tooltip: {
          formatter: params => {
            let name = params[0].name;
            let value = this.$options.filters.formatNum(params[0].value, this.movieIndicatorType) + this.$options.filters.formatTargetUnit(this.movieIndicatorType);
            let str = params[0].marker + name + "<br>" + value;
            return str;
          }
        },
        "xAxis.0.axisLabel.interval": 0,
        "xAxis.0.axisLabel.rotate": 45
      },
      // 饼图扩展
      pieExtendChannel: {
        legend: {
          top: "bottom",
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: "#333",
            fontSize: 12
          }
        },
        label: {
          formatter: params => {
            // let name =  params.name;
            // name = name.length > 15 ? name.slice(0,3) + '...' : name ;
            let value = this.$options.filters.formatNum(params.value, this.channelIndicatorType) + this.$options.filters.formatTargetUnit(this.channelIndicatorType);
            return params.percent + "%" +'（'+ value +'）' ;
          }
        },
        tooltip: {
          formatter: params => {
            let name = params.name;
            let value = this.$options.filters.formatNum(params.value, this.channelIndicatorType) + this.$options.filters.formatTargetUnit(this.channelIndicatorType);
            let percent = params.percent;
            let str = params.marker + name + "<br>"+ percent + "%"  + "（" + value +"）";
            return str;
          }
        }
      },
      // 饼图扩展
      pieExtendMovie: {
        legend: {
          top: "bottom",
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: "#333",
            fontSize: 12
          }
        },
        label: {
          formatter: params => {
            let value = this.$options.filters.formatNum(params.value, this.movieIndicatorType) + this.$options.filters.formatTargetUnit(this.movieIndicatorType);
            return params.percent + "%" + '（' + value + '）';
          }
        },
        tooltip: {
          formatter: params => {
            let name = params.name;
            let value = this.$options.filters.formatNum(params.value, this.movieIndicatorType) + this.$options.filters.formatTargetUnit(this.movieIndicatorType);
            let percent = params.percent;
            let str = params.marker + name + "<br>" + percent + "%" + "（" + value + "）";
            return str;
          }
        }
      }
    };
  },
  computed: {
    // showMoviePie() {
    //   return !['avgTicketPrice','attendanceRate',
    //   'avgPlanShowCount','avgSeatPrice',
    //   'unShowCountRate','memberBoxOfficePer','marketShare'].includes(this.movieIndicatorType)
    // },
    // showChannelPie() {
    //   return !['avgTicketPrice','memberBoxOfficePer'].includes(this.channelIndicatorType)
    // },
    isShowTarget() {
      return function(code) {
        return this.memberTypeVal === 0 || (this.memberTypeVal === 1 && ['pf','sffwf','ytfwf','yjzzpf','fzpf','gyrc','pjpj','hyxfzb'].includes(code))
      }
    }
  },
  filters: {
    numberToFixed: (val) => {
      if(val == '-9999') {
        return '--'
      }
      val = +val
      if(val < 0) {
        val = -val
      }
      return val.toFixed(2)
    },
    // 未返回的数据格式
    formatNull: (num) => {
      if(num === null || num === undefined) return '--'
      return num
    },
    // 满足特定格式化要求
    formatFixed: (num) => {
      if(num === null || num === undefined) return '--'
      if(num < 10000) {
        return Math.round(num)
      }
      return num
    },
    // 带单位
    formatNum: (money,type,unit) => {
      if (['audienceCount', 'avgPlanShowCount', 'planShowCount'].includes(type)){
        return Global.formatNum(money,0, unit);
      }else{
        return Global.formatNum(money,2, unit);
      }
    },
    // 不带单位
    formatMoney(money,indicatorCode) {
      // 场次、人均场次、观影人次
        if(['cc','rjcc','gyrc'].includes(indicatorCode)){
            if(money > 10000) {
              return Global.formatMoney(money);
            }else {
              return isNaN(money) ? '--' : Math.round(money)
            } 
        }else{
          return Global.formatMoney(money);
        }
    },
    formatTargetUnit: (type, money) => {
      return Global.formatBoxOfficeTargetUnit(type, money);
    }
  },
  watch: {
    "$route.query.startTime": function() {
      this.getCurrentTime();
      this.initData();
    }
  },
  created() {
    this.getCurrentTime();
    this.initData();
  },
  methods: {
    // 区域/影院列表排序
    tableSortChange(column) {
      let orderObj = null
      if(column.column) {
        orderObj = {
          columnType: this.transIndicator(column.prop),
          seq: column.order === 'ascending' ? 'ASC':'DESC'
        }
        this.tableSortMsg = Object.assign({},orderObj)
      }else {
        this.tableSortMsg = null
      }
      this.getTableData(orderObj)
    },
    saveTarget(codes) {
      let params = {
        body: {
          bsiType: 2,
          indicatorCodes: codes,
          userId: this.userId
        }
      }
      this.$route.query.cityId && (params.body.cityId = this.$route.query.cityId);
      this.$route.query.cinemaId && (params.body.cinemaId = this.$route.query.cinemaId);
      this.$camList.saveIndicator(params).then(res => {
        this.getTargetView();
      });
      this.$refs.targetDialog.show = false
    },
    transIndicator(indicator) {
      return indicator.replace(/([A-Z])/g,function(m,$1){
          return `_${$1.toLocaleLowerCase()}`
      })
    },
    changeCinema() {
      (!this.cinemaId) && (this.cinemaId = null);
      this.page = 1;
      // this.getAllData()
    },
    getCinemaList() {
      this.$camList.selectBrand({
        body: {
          userId: this.userId
        }
      }).then(res => {
        this.cinemaList = res.data
        // this.cinemaId =  this.cinemaList[0] && this.cinemaList[0].brandCode 去掉默认影院品牌
      });
    },
    getCurrentTime() {
      this.$camList.getCurrentTime().then(res => {
        this.currentTime = res.data;
      });
    },
    initData() {
      this.getCinemaList();
      let params = this.$route.query;
      (this.timeType = params.dateType ? params.dateType : "day"),
        (this.dateTypeActive = params.dateType ? params.dateType : "day"),
        (this.dateTypeIndex = params.dateTypeIndex
          ? params.dateTypeIndex
          : null),
        (this.startTime = params.startTime
          ? new Date(params.startTime).formatDate("yyyy/MM/dd")
          : new Date().formatDate("yyyy/MM/dd")),
        (this.endTime = params.endTime
          ? new Date(params.endTime).formatDate("yyyy/MM/dd")
          : new Date().formatDate("yyyy/MM/dd"));
          this.showTimeLabel = this.startTime
      if (this.timeType == "day") {
        this.time = this.startTime;
      } else {
        this.time = [this.startTime, this.endTime];
      }
      this.getAllData();
    },
    // 指标趋势表格下载
    getTrendOut() {
      let baseURL = config.baseURL;
      let downUrl = `${baseURL}/analysis/boxOffice/exportTrendData?userId=${
        this.userId
      }&startDate=${this.startTime}&endDate=${this.endTime}&dateType=${
        this.timeType
      }&member=${this.memberTypeVal}&token=${
        this.$store.state.loginToken
      }`;
      if(this.cinemaId) {
        downUrl += `&brandId=${this.cinemaId}`
      }
      window.location.href = downUrl;
    },
    // 区域导出
    getAreaOut() {
      let baseURL = config.baseURL;
      let downUrl = `${baseURL}/analysis/boxOffice/exportRegionData?userId=${
        this.userId
      }&startDate=${this.startTime}&endDate=${this.endTime}&dateType=${
        this.timeType
      }&member=${this.memberTypeVal}&token=${this.$store.state.loginToken}`;
      if(this.cinemaId) {
        downUrl += `&brandId=${this.cinemaId}`
      }
      window.location.href = downUrl;
    },
    // all api
    getAllData(flag) {
      if(!flag) {
        this.getTargetTrend();
        this.getMovieData();
        this.getChannelData();
      }
      this.getTargetView();
      this.getTableData();
    },
    // 2.票房指标概览
    getTargetView(codes) {
      // //指标信息
      let params = {
          body: {
            brandId: this.cinemaId,
            dateType: this.timeType,
            startDate: this.startTime,
            endDate: this.endTime,
            pageNo: this.page,
            pageSize:  this.size,
            member: this.memberTypeVal,
            userId: this.userId,
            // groupId: 44
          }
        }
      this.$route.query.cityId && (params.body.cityId = this.$route.query.cityId);
      this.$route.query.cinemaId && (params.body.cinemaId = this.$route.query.cinemaId);
      this.$camList.boxOfficeQuota(params).then((res)=>{
        this.targetArr = res.data.data;
        this.orgType === 'group' && (this.orgName =  res.data.orgName);
        (!this.$route.query.name) && (this.orgName =  res.data.orgName);
      })
    },
    //查询趋势图信息
    getTargetTrend() {
      let params = {
          body: {
            brandId: this.cinemaId,
            columnType: this.trendIndicatorType,
            dateType: this.timeType,
            startDate: this.startTime,
            endDate: this.endTime,
            pageNo: this.page,
            pageSize:  this.size,
            member: this.memberTypeVal,
            // groupId: 44
          }
        }
      this.$route.query.cityId && (params.body.cityId = this.$route.query.cityId);
      this.$route.query.cinemaId && (params.body.cinemaId = this.$route.query.cinemaId);
      this.$camList.boxOfficeTrend(params).then((res)=>{
        if(res.data && res.data.yAxis.length > 0) {
          this.lineChartEmpty = false
          this.boxLineData.rows = res.data.yAxis.map(item => {
            return {
                date: item.dateKey,
                value: item[this.trendIndicatorType] || 0
              };
          });
        }else {
          this.lineChartEmpty = true
        }
        this.boxTableData = res.data.list;
      })
    },
    // 查询渠道信息
    getChannelData() {
      let params = {
          body: {
            brandId: this.cinemaId,
            columnType: this.transIndicator(this.channelIndicatorType),
            dateType: this.timeType,
            startDate: this.startTime,
            endDate: this.endTime,
            pageNo: this.page,
            pageSize:  this.size,
            member: this.memberTypeVal,
            // groupId: 44
          }
        }
      this.$route.query.cityId && (params.body.cityId = this.$route.query.cityId);
      this.$route.query.cinemaId && (params.body.cinemaId = this.$route.query.cinemaId);
      this.$camList.boxOfficeChannel(params).then((res)=>{

        if(res.data && res.data.yAxis.length > 0) {
          this.channelChartEmpty = false
          // this.channelSettings.level[1] = res.data.xAxis
          let data = res.data.yAxis.map(item=> {
              return {
                name:item.channelName,
                value:item[this.channelIndicatorType]
              }
            } 
          )
          // 线上线下数据处理
          // if((!['avgTicketPrice','memberBoxOfficePer'].includes(this.channelIndicatorType)) && res.data.channel && Array.isArray(res.data.channel)) {
          //   data = data.concat(this.transArr(res.data.channel))
          // }
          this.channelData.rows = data
        }else {
          this.channelChartEmpty = true
          this.channelData.rows = []
        }
        
        this.showChannelPie = !['avgTicketPrice','memberBoxOfficePer'].includes(this.channelIndicatorType)
      })
    },
    //转化数据格式
    transArr(inputArr, initArr = []) {
      inputArr.forEach(item=>{
        for(var key in item) {
          initArr.push({
                name: key,
                value: item[key]
            })
        }
      })
      return initArr
    },
    // 查询影片信息
    getMovieData() {
      //影片信息
      let params = {
          body: {
            brandId: this.cinemaId,
            columnType: this.movieIndicatorType != 'unShowCountRate' ? this.transIndicator(this.movieIndicatorType) : 'un_plan_show_count_rate',
            dateType: this.timeType,
            startDate: this.startTime,
            endDate: this.endTime,
            pageNo: this.page,
            pageSize:  this.size,
            member: this.memberTypeVal,
            // groupId: 44
          }
        }
      this.$route.query.cityId && (params.body.cityId = this.$route.query.cityId);
      this.$route.query.cinemaId && (params.body.cinemaId = this.$route.query.cinemaId);
      this.$camList.boxOfficeMovie(params).then((res)=>{

        if(res.data && res.data.yAxis.length > 0) {
          this.movieChartEmpty = false
          this.movieData.rows = res.data.yAxis.map(item=> {   
              let value 
              if(this.movieIndicatorType === 'avgTicketPrice') {
                value = item['avgBoxOffice']
              }else if(this.movieIndicatorType === 'attendanceRate'){
                value = item['offerSeatPercent']
              }else if(this.movieIndicatorType === 'unShowCountRate'){
                value = item['unShowCount']
              }else {
                value = item[this.movieIndicatorType]
              }
              return {
                name:item.movieName,
                value
              }
            } 
          )
        }else {
           this.movieChartEmpty = true
           this.movieData.rows = []
        }
        this.showMoviePie = !['avgTicketPrice','attendanceRate',
        'avgPlanShowCount','avgSeatPrice',
        'unShowCountRate','memberBoxOfficePer','marketShare'].includes(this.movieIndicatorType)
      })
    },
    // 查询区域明细
    getTableData(orderObj) {
      let params = {
        body: {
          brandId: this.cinemaId,
          dateType: this.timeType,
          startDate: this.startTime,
          endDate: this.endTime,
          pageNo: this.page,
          pageSize:  this.size,
          member: this.memberTypeVal,
          // groupId: 44
        }
      }
      orderObj = orderObj || this.tableSortMsg
      if(orderObj) {
        params.body = Object.assign({},orderObj,params.body)
      }
      this.$camList.boxOfficeAreaList(params).then(res => {
          this.tableData = res.data.list
          this.total = res.data.total
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
        this.dateTypeIndex = option.index;
      } else {
        this.startTime = option.formatDate("yyyy/MM/dd");
        this.endTime = option.formatDate("yyyy/MM/dd");
      }
      if(this.startTime === this.endTime) {
        this.showTimeLabel = this.startTime
      }else {
        this.showTimeLabel = `${this.startTime}-${this.endTime}`
      }
      this.page = 1;
      // this.$nextTick(() => {
      //   this.getAllData();
      // });
    },
    // 改变/会员
    changeMemberType() {
      this.memberTypeVal = +this.memberType;
      if(this.memberTypeVal) { //仅会员
        // this.activeType = 'boxOffice'
        this.$refs.targetLabel.resetSelect()
        this.$refs.targetLabel1.resetSelect()
        this.$refs.targetLabel2.resetSelect()

        this.otherLabel = Global.boxOfficeTrendOther.filter(item=>item.onlyMember)
        this.otherLabel1 = Global.boxOfficeMovieOther.filter(item=>item.onlyMember)
        this.otherLabel2 = Global.boxOfficeChannelOther.filter(item=>item.onlyMember)
        this.getAllData(true);
      }else {
        this.otherLabel = Global.boxOfficeTrendOther
        this.otherLabel1 = Global.boxOfficeMovieOther
        this.otherLabel2 = Global.boxOfficeChannelOther
        this.getAllData();
      }
      
    },
    // 改变/指标概览(环比/同比)
    changeRadio(id) {
      this.ratioType = id;
    },
    // 改变/票房指标趋势类型
    changeTrendType(id) {
      this.trendIndicatorType = id;
      this.getTargetTrend()
    },
    // 改变/票房指标影片类型
    changeMovieType(id) {
      this.movieIndicatorType = id;
      this.getMovieData()
    },
    // 改变/票房指标渠道类型
    changeChannelType(id) {
      this.channelIndicatorType = id;
      this.getChannelData()
    },
    // 指标设置/弹窗
    showTargetSetting() {
      let targetDialog = this.$refs.targetDailog;
      let params = {
        body: {
          userId: this.userId,
          bsiType: 2
        }
      };
      this.$route.query.cityId && (params.body.cityId = this.$route.query.cityId);
      this.$route.query.cinemaId && (params.body.cinemaId = this.$route.query.cinemaId);
      this.$camList.queryIndicatorCodes(params).then(response => {
        let res = response.data
        if(res) {
          this.targetList = []
          for(var key in res) {
            let valList = res[key]
            for(var item of valList) {
              if(this.memberTypeVal === 1 && !['pf','sffwf','ytfwf','yjzzpf','fzpf','gyrc','pjpj','hyxfzb'].includes(item.code)) {
                item.gray = 1
              }
            }
            this.targetList.push({
              name: valList[0] && valList[0].categoryName,
              list: valList
            })
          }
        }
        this.$refs['targetDialog'].show = true;
      });
    },
    // 前往城市版
    goDetail(id,name) {
      this.$router.push({
        path: "/analysis/area/boxOffice/total",
        query: {
          cityId: id,
          name: name,
          startTime: this.startTime,
          endTime: this.endTime,
          dateType: this.timeType,
          dateTypeIndex: this.dateTypeIndex
        }
      });
    },
    // 查询
    search() {
      this.getAllData();
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