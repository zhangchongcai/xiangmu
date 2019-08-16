import Global from "../../../util/global.js";
import AuthorityName from "../../partical/authorityName"
import CalendarView from "../../../components/calendar/calendar"
import TargetLabel from "../../partical/targetLabel"
import {getOrgInfo} from '../../../http/interface'
import config from "frame_cpm/http/config";

export default {
  components: { 
    AuthorityName,
    CalendarView,
    TargetLabel
  },
  data() {
    return {
      goodsInfo: {},
      quotaMap: {
        sale: "销售类",
        purchase: "采购类",
        profit: "利润类",
        inventory: "库存类",
        efficiency: "效率类"
      },
      orderMap: {
        sale: "1",
        purchase: "4",
        profit: "2",
        inventory: "5",
        efficiency: "3"
      },
      quotaList: [],
      orgType: Global.judgeOrgType,
      orgName: '总部',
      startTime: new Date().formatDate("yyyy-MM-dd"),
      endTime: new Date().formatDate("yyyy-MM-dd"),
      time: new Date(),
      dateType: ["天", "周", "月", "年", "自定义"],
      dateTypeActive: "天",
      dateTypeIndex: null,
      timeType: "day",
      memberType: false, // 会员类型
      memberTypeVal: 0,  // 会员类型 值
      commodityName: '',
      activeType: 'xse',
      targetLabel: Global.commodityDetailTrend,   // 趋势指标
      otherLabel: Global.commodityDetailTrendOther, // 趋势指标 -其他
      trendIndicatorType: "xse", // 品类指标
      tableSortMsg: null, //表格排序信息
      sizes: Global.pageSizes,
      size: Global.pageSize,
      page: 1,
      total: 0,
      isLine: true,
      boxTableData: [],
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
            let value = this.$options.filters.formatNum(params[0].value[1]);
            let str = params[0].marker + date + "<br>" + value;
            return str;
          }
        }
      },
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
    }
  },
  computed: {
    
  },
  filters: {
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
    formatNum: (money, count,unit) => {
      return Global.formatNum(money,count,unit);
    },
    // 不带单位
    formatMoney(money,indicatorCode) {
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
  created() {
    this.getOrgType()
    this.getAllData()
  },
  methods: {
    // all api
    getAllData() {
      this.getTargetTrend()
      this.getMainInfo()
    },
    getMainInfo() {
      let params = {
        body:{
            dateType: this.timeType,
            startDate: this.startTime,
            endDate: this.endTime,
            // groupId:59,
            goodSku:this.$route.query.goodSku,
            member: this.memberTypeVal,
        }
      }
      this.$camList.querySkuDetailsInfo(params).then((res)=>{
        this.quotaList = []
        if(res.data) {
          let indicator = res.data.indicator
          delete res.data.indicator
          this.goodsInfo = res.data
          for(var key in indicator) {
            this.quotaMap[key] && this.quotaList.push(
              {
                label: this.quotaMap[key],
                key,
                list: indicator[key],
                order: this.orderMap[key]
              }
            )
          }
          this.quotaList.sort((prev,next)=>{
            return prev.order.localeCompare(next.order)
          })
        }   
      })
      
    },
    // 改变/会员
    changeMemberType() {
      this.memberTypeVal = +this.memberType

      if(this.memberTypeVal) { //仅会员
        this.$refs.targetLabel.resetSelect()
        this.getMainInfo()
      }else {
        this.getAllData()
      }
    },
    getOrgType() {
      getOrgInfo({body:{}}).then(response =>{
        if(response.data){
          this.orgType = response.data.orgType
          this.orgName = response.data.orgName
        }
      }) 
    },
    //查询趋势图信息
    getTargetTrend() {
      let params = {
          body: {
            // brandId: this.cinemaId,
            dateType: this.timeType,
            startDate: this.startTime,
            endDate: this.endTime,
            member: this.memberTypeVal,
            // groupId: 59,
            goodSku: this.$route.query.goodSku,
            bsiCodes: this.trendIndicatorType
          }
        }
      this.$route.query.cityId && (params.body.cityId = this.$route.query.cityId);
      this.$route.query.cinemaId && (params.body.cinemaId = this.$route.query.cinemaId);
      this.$camList.querySkuDetailsTrend(params).then((res)=>{
        if(res.data) {
          this.boxTableData = res.data.models || [];
          let rows = res.data[this.trendIndicatorType]
          if(rows && rows.length > 0 ) {
            this.lineChartEmpty = false
            this.boxLineData.rows = rows.map(item => {
              return {
                  date: item.name,
                  value: item.value || 0
                };
            });
          }else {
            this.lineChartEmpty = true
          }
        }else {
          this.lineChartEmpty = true
        }
        
      })
    },
    // 指标趋势表格下载
    getTrendOut() {
      let baseURL = config.baseURL;
      let downUrl = `${baseURL}/analysis/downloadSkuTrend?userId=${
        this.userId
      }&startDate=${this.startTime}&endDate=${this.endTime}&dateType=${
        this.timeType
      }&member=${this.memberTypeVal}&goodSku=${this.$route.query.goodSku}&bsiCodes=${this.trendIndicatorType}&token=${
        this.$store.state.loginToken
      }`;
      window.location.href = downUrl;
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
      } else {
        this.startTime = option.formatDate("yyyy/MM/dd");
        this.endTime = option.formatDate("yyyy/MM/dd");
      }
    },
    // 查询
    search() {
      this.getAllData();
    },
    // 改变/指标趋势类型
    changeTrendType(id) {
      this.trendIndicatorType = id;
      this.getTargetTrend()
    },
    // 列表排序
    tableSortChange(column) {
      let orderObj = null
      if(column.column) {
        orderObj = {
          columnType: column.prop,
          seq: column.order === 'ascending' ? 'ASC':'DESC'
        }
        this.tableSortMsg = Object.assign({},orderObj)
      }else {
        this.tableSortMsg = null
      }
    }
  }
}