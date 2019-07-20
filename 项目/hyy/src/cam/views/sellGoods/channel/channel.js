import Global from "../../../util/global.js";
import AuthorityName from "../../partical/authorityName"
import CalendarView from "../../../components/calendar/calendar"
import TargetLabel from "../../partical/targetLabel"

export default {
  components: { 
    AuthorityName,
    CalendarView,
    TargetLabel
  },
  data() {
    return {
      orgType: Global.judgeOrgType,
      orgName: '总部',
      time: new Date(),
      dateType: ["天", "周", "月", "年", "自定义"],
      dateTypeActive: "天",
      dateTypeIndex: null,
      timeType: "day",
      memberType: false, // 会员类型
      memberTypeVal: 0,  // 会员类型 值
      activeType: 'xse',
      targetLabel: Global.categoryTrend,   // 趋势指标
      otherLabel: Global.categoryTrendOther, // 趋势指标 -其他
      trendIndicatorType: "xse", // 品类指标
      isNumber: true, // 是数值还是占比
      isHistogram: false, // 是否显示柱形图
      chartSettings: {
        stack: { '用户': ['自有渠道', '第三方渠道'] }
      },
      chartData: {
        columns: ['日期', '自有渠道', '第三方渠道'],
        rows: [
          { '日期': '2019年2月', '自有渠道': 1393, '第三方渠道': 1093 },
          { '日期': '2019年3月', '自有渠道': 3530, '第三方渠道': 3230 },
          { '日期': '2019年4月', '自有渠道': 2923, '第三方渠道': 2623 },
          { '日期': '2019年5月', '自有渠道': 1723, '第三方渠道': 1423 },
          { '日期': '2019年6月', '自有渠道': 3792, '第三方渠道': 3492 },
          { '日期': '2019年7月', '自有渠道': 4593, '第三方渠道': 4293 }
        ]
      },
      tableData: [
        
      ], // 表格列表
      
      tableSortMsg: null, //表格排序信息
      sizes: Global.pageSizes,
      size: 10,
      page: 1,
      total: 0,
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
  watch: {
    isNumber(val) {
      console.log('是否是数值',val)
    }
  },
  created() {
    
  },
  methods: {
    //获取时间类型  --待定
    getTimeType(type) {
      this.timeType = type;
      if (this.timeType == "year") {
        
      } else if (this.timeType == "custom") {
        
      } else {
        
      }
    },
    //改变时间
    changeTime(option) {

    },
    // 查询
    search() {
      // this.getAllData();
    },
    // 改变/会员
    changeMemberType() {
      this.memberTypeVal = +this.memberType;
      if(this.memberTypeVal) { //仅会员
        
        
      }else {
        
      }
    },
    // 改变/指标趋势类型
    changeTrendType(id) {
      this.isHistogram = Global.categoryTrendOther.findIndex(item=>item.id === id) > -1
      if(this.isHistogram) {
        this.chartSettings = {}
      }else {
        this.chartSettings = {
          stack: { '用户': ['自有渠道', '第三方渠道'] }
        }
      }
      this.trendIndicatorType = id;
      // this.getTargetTrend()
    },
    // 渠道明细导出
    getChannelOut() {
      // let baseURL = config.baseURL;
      // let downUrl = `${baseURL}/analysis/boxOffice/exportRegionData?userId=${
      //   this.userId
      // }&startDate=${this.startTime}&endDate=${this.endTime}&dateType=${
      //   this.timeType
      // }&member=${this.memberTypeVal}&token=${this.$store.state.loginToken}`;
      // if(this.cinemaId) {
      //   downUrl += `&brandId=${this.cinemaId}`
      // }
      // window.location.href = downUrl;
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
      // this.getTableData(orderObj)
    },
    // 去往品类详情页面
    goDetail(id) {
      return
      this.$router.push({
        path: "/analysis/area/boxOffice/total",
        query: {
          id: id,
        }
      });
    },
  }
}