import Global from '../../../util/global.js';
import AuthorityName from '../../partical/authorityName';
import CalendarView from '../../../components/calendar/calendar';
import TargetLabel from '../../partical/targetLabel';
import { getOrgInfo } from '../../../http/interface';
// import config from "frame_cpm/http/config";

export default {
  components: {
    AuthorityName,
    CalendarView,
    TargetLabel
  },
  data () {
    return {
      orgType: Global.judgeOrgType,
      orgName: '总部',
      startTime: new Date().formatDate('yyyy-MM-dd'),
      endTime: new Date().formatDate('yyyy-MM-dd'),
      time: new Date(),
      dateType: ['天', '周', '月', '年', '自定义'],
      dateTypeActive: '天',
      dateTypeIndex: null,
      timeType: 'day',
      memberType: false, // 会员类型
      memberTypeVal: 0, // 会员类型 值
      activeType: 'sqos',
      targetLabel: Global.commodityTrend, // 趋势指标
      // otherLabel: Global.categoryTrendOther, // 趋势指标 -其他
      trendIndicatorType: 'sqos', // 商品指标
      isHistogram: false, // 是否显示柱形图
      tableData: [], // 表格列表

      tableSortMsg: null, // 表格排序信息
      sizes: Global.pageSizes,
      size: Global.pageSize,
      page: 1,
      total: 0,
      ratioType: 1, // 环比类型
      disabledChain: false, // 不显示 环比
      disabledSame: false, // 不显示 同比
      boxTableData: [],
      // 指标概览
      targetArr: [
        {
          indicatorName: '在售SKU数量',
          value: 567,
          indicatorCode: 'zxskusl',
          roundPeriodValue: 1,
          samePeriodValue: 1
        }
      ],
      // 指标趋势
      boxLineData: {
        columns: ['date', 'value'],
        rows: []
      },
      lineChartEmpty: true,
      // 指标趋势/折线图设置
      lineSettings: {
        itemStyle: {
          color: '#3B74FF' // 折线点颜色
        },
        lineStyle: {
          color: '#3B74FF'
        }
      },
      // 指标趋势/折线图扩展
      lineExtend: {
        'xAxis.0.axisLabel.rotate': 45,
        'xAxis.0.axisLabel.interval': 2,
        tooltip: {
          // trigger:'', // axis：坐标轴触发：（折线图、柱状图） item:数据项触发，散点图，饼图
          formatter: params => {
            let date = params[0].name;
            let index = params[0].dataIndex;
            let value =
              this.$options.filters.formatNum(
                params[0].value[1],
                this.trendIndicatorType
              ) +
              this.$options.filters.formatTargetUnit(this.trendIndicatorType);
            let str = params[0].marker + date + '<br>' + value;
            return str;
          }
        }
      },
      iconColors: [
        '#fe825e',
        '#8e7eff',
        '#3b74ff',
        '#ff6081',
        '#fec107',
        '#17cd31'
      ],
      icons: [
        'icon-neiye-zongxiaoshoue',
        'icon-neiye-kedanjia',
        'icon-neiyegoumaishuai',
        'icon-neiye-jine',
        'icon-neiye-xiaofei',
        'icon-neiye-xiaoshoue'
      ],
      icons: {
        sqos: 'icon-neiye-kedanjia',
        qoms: 'icon-neiye-kedanjia',
        msr: 'icon-neiye-jine',
        nop: 'icon-neiye-kedanjia',
        ps: 'icon-neiye-zongxiaoshoue',
        popc: 'icon-jingyingjuece-fene'
      },
      isLine: true,
      authorType: '1',
      currentShow: true // 补货/滞销按钮（本周/月显示）
    };
  },
  computed: {
    isShowTarget () {
      return function (code) {
        return (
          this.memberTypeVal === 0 ||
          (this.memberTypeVal === 1 &&
            [
              'pf',
              'sffwf',
              'ytfwf',
              'yjzzpf',
              'fzpf',
              'gyrc',
              'pjpj',
              'hyxfzb'
            ].includes(code))
        );
      };
    }
  },
  filters: {
    // 未返回的数据格式
    formatNull: num => {
      if (num === null || num === undefined) return '--';
      return num;
    },
    // 满足特定格式化要求
    formatFixed: num => {
      if (num === null || num === undefined) return '--';
      if (num < 10000) {
        return Math.round(num);
      }
      return num;
    },
    // 带单位
    formatNum: (money, count, unit) => {
      if (['fixed', 'sqos', 'qoms', 'nop'].includes(count) && money < 10000) {
        return isNaN(money) ? '--' : Math.round(money);
      }
      return Global.formatNum(money, count, unit);
    },
    // 不带单位
    formatMoney (money, indicatorCode) {
      if (['sqos', 'qoms', 'nop'].includes(indicatorCode)) {
        if (money > 10000) {
          return Global.formatMoney(money);
        } else {
          return isNaN(money) ? '--' : Math.round(money);
        }
      } else {
        return Global.formatMoney(money);
      }
    },
    formatTargetUnit: (type, money) => {
      return Global.formatBoxOfficeTargetUnit(type, money);
    }
  },
  watch: {},
  created () {
    this.Time();
    this.getOrgType();
    this.getAllData();
  },
  methods: {
    Time () {
      var now = new Date();
      var nowDayOfWeek = now.getDay(); // 今天本周的第几天
      var nowDay = now.getDate(); // 当前日
      var nowMonth = now.getMonth();
      var nowYear = now.getYear() < 2000 ? now.getYear() + 1900 : 0;
      // 本周开始时间
      var weekStartDate = this.$moment(
        new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 1)
      ).format('YYYY-MM-DD');
      // 本周结束时间
      var weekEndDate = this.$moment(
        new Date(nowYear, nowMonth, nowDay + (7 - nowDayOfWeek))
      ).format('YYYY-MM-DD');
      // 本月开始时间
      var monthStartDate = this.$moment(new Date(nowYear, nowMonth, 1)).format(
        'YYYY-MM-DD'
      );
      // 本月结束时间
      var monthEndDate = this.$moment(
        this.$moment(new Date(nowYear, nowMonth + 1, 1)).add(-1, 'day')
      ).format('YYYY-MM-DD');
      this.currentDay = new Date().formatDate('yyyy-MM-dd');
      this.currentWeekTime = [weekStartDate, weekEndDate];
      this.currentMonth = [monthStartDate, monthEndDate];
    },
    getOrgType () {
      getOrgInfo({ body: {} }).then(response => {
        if (response.data) {
          this.orgType = response.data.orgType;
          this.orgName = response.data.orgName;
        }
      });
    },
    getAllData () {
      this.getTargetView();
      this.getTargetTrend();
      this.getTableData();
    },
    // 商品指标概览
    getTargetView () {
      // //指标信息
      let params = {
        body: {
          indicatorCodes: '',
          dateType: this.timeType,
          startDate: this.startTime,
          endDate: this.endTime,
          member: this.memberTypeVal
        }
      };
      // this.$route.query.cityId && (params.body.cityId = this.$route.query.cityId);
      // this.$route.query.cinemaId && (params.body.cinemaId = this.$route.query.cinemaId);
      this.$camList.querySkuIndicator(params).then(res => {
        this.targetArr = res.data;
      });
    },
    // 查询趋势图信息
    getTargetTrend (trendIndicatorType) {
      let params = {
        body: {
          bsiCodes: ['sqos', 'qoms', 'msr', 'nop', 'ps', 'popc'],
          dateType: this.timeType,
          startDate: this.startTime,
          endDate: this.endTime,
          member: this.memberTypeVal
        }
      };
      if (trendIndicatorType) {
        if (this.trendInfo && this.trendInfo[trendIndicatorType]) {
          this.boxLineData.rows = this.trendInfo[trendIndicatorType][
            'sellAnalysis'
          ].map(item => {
            return {
              date: item.name,
              value: item.value || 0
            };
          });
        }
        return false;
      }
      this.$route.query.cityId &&
        (params.body.cityId = this.$route.query.cityId);
      this.$route.query.cinemaId &&
        (params.body.cinemaId = this.$route.query.cinemaId);
      this.$camList.querySkuTrend(params).then(res => {
        if (res.data) {
          this.boxTableData = res.data.indicatorSellGoodsWares;
          this.trendInfo = res.data;
          this.lineChartEmpty = false;
          this.boxLineData.rows = res.data[this.trendIndicatorType][
            'sellAnalysis'
          ].map(item => {
            return {
              date: item.name,
              value: item.value || 0
            };
          });
        } else {
          this.lineChartEmpty = true;
        }
      });
    },
    // 切换类型
    changeAuthorType (tab) {
      this.authorType = tab.name;
      // 请求明细数据
      this.getTableData();
    },
    // 改变/指标概览(环比/同比)
    changeRadio (id) {
      this.ratioType = id;
    },
    // 获取时间类型
    getTimeType (type) {
      this.timeType = type;
      if (this.timeType == 'year') {
        // 年 不显示同比
        this.disabledSame = true;
        this.disabledChain = false;
        this.ratioType = 1; // 1.环比 2. 同比
      } else if (this.timeType == 'custom') {
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
    // 改变时间
    changeTime (option) {
      if (option.startTime) {
        this.startTime = option.startTime;
        this.endTime = option.endTime;
        this.dateTypeIndex = option.index;
      } else {
        this.startTime = option.formatDate('yyyy-MM-dd');
        this.endTime = option.formatDate('yyyy-MM-dd');
      }
      // 本周/本月判断
      let type = this.timeType;
      if (type == 'week') {
        // 本周
        if (this.startTime == this.currentWeekTime[0]) {
          this.currentShow = true;
        } else {
          this.currentShow = false;
        }
      } else if (type == 'month') {
        // 本月
        if (this.startTime == this.currentMonth[0]) {
          this.currentShow = true;
        } else {
          this.currentShow = false;
        }
      } else if (type == 'year') {
        // 本年
        if (this.startTime.substr(0, 4) == new Date().formatDate('yyyy')) {
          this.currentShow = true;
        } else {
          this.currentShow = false;
        }
      } else if (type == 'day') {
        // 当天
        if (this.startTime == this.currentDay) {
          this.currentShow = true;
        } else {
          this.currentShow = false;
        }
      } else if (type == 'custom') {
        // 当前自定义时间
        if (this.endTime == this.currentDay) {
          this.currentShow = true;
        } else {
          this.currentShow = false;
        }
      } else {
        this.currentShow = false;
      }
      this.page = 1;
    },
    // 查询
    search () {
      this.getAllData();
    },
    // 改变/会员
    changeMemberType () {
      this.memberTypeVal = +this.memberType;
      if (this.memberTypeVal) {
        // 仅会员
        // this.$refs.targetLabel.resetSelect()
        // this.getTableData()
        // this.getTargetView()
        this.getAllData();
      } else {
        this.getAllData();
      }
    },
    // 改变/指标趋势类型
    changeTrendType (id) {
      this.trendIndicatorType = id;
      this.getTargetTrend(this.trendIndicatorType);
    },
    // 指标趋势表格下载
    getTrendOut () {
      // let baseURL = config.baseURL;
      let baseURL = this.$store.state.default.apiConfig.baseURL;
      let downUrl = `${baseURL}/analysis/sellGoods/wares/downloadSellGoodsWaresTend?userId=${
        this.userId
      }&startDate=${this.startTime}&endDate=${this.endTime}&dateType=${
        this.timeType
      }&member=${this.memberTypeVal}&bsiCodes=${[
        'sqos',
        'qoms',
        'msr',
        'nop',
        'ps',
        'popc'
      ]}&token=${this.$store.state.loginToken}`;
      // if(this.cinemaId) {
      //   downUrl += `&brandId=${this.cinemaId}`
      // }
      window.location.href = downUrl;
    },
    // 商品明细导出
    getCommodityOut () {
      // let baseURL = config.baseURL;
      let baseURL = this.$store.state.default.apiConfig.baseURL;
      let downUrl = `${baseURL}/analysis/sellGoods/wares/downloadSellGoodsWaresDetail?userId=${
        this.userId
      }&startDate=${this.startTime}&endDate=${this.endTime}&dateType=${
        this.timeType
      }&member=${this.memberTypeVal}&detailType=${
        this.authorType == '1' ? 4 : 1
      }&token=${this.$store.state.loginToken}`;
      // if(this.cinemaId) {
      //   downUrl += `&brandId=${this.cinemaId}`
      // }
      window.location.href = downUrl;
    },
    // 列表排序
    tableSortChange (column) {
      let orderObj = null;
      if (column.column) {
        orderObj = {
          columnType: column.prop,
          seq: column.order === 'ascending' ? 'ASC' : 'DESC'
        };
        this.tableSortMsg = Object.assign({}, orderObj);
      } else {
        this.tableSortMsg = null;
      }
      this.getTableData(orderObj);
    },
    // 查询商品明细
    getTableData (orderObj) {
      let params = {
        body: {
          dateType: this.timeType,
          startDate: this.startTime,
          endDate: this.endTime,
          pageNo: this.page,
          pageSize: this.size,
          member: this.memberTypeVal,
          detailType: this.authorType == '1' ? 4 : 1
        }
      };
      orderObj = orderObj || this.tableSortMsg;
      if (orderObj) {
        params.body = Object.assign({}, orderObj, params.body);
      }
      this.$camList.querySkuDetails(params).then(res => {
        if (res.data) {
          this.tableData = res.data.sellGoodsList.list;
          this.total = res.data.sellGoodsList.total;
        }
      });
    },
    // 去往商品详情页面
    goDetail (id, name) {
      this.$router.push(
        `/analysis/common/commodity/detail?goodSku=${id}&goodName=${name}&startTime=${this.startTime}&endTime=${this.endTime}&timeType=${this.timeType}`
      );
    },
    // 跳转 缺货明细
    replenish () {
      // this.$router.push('/analysis/cinema/replenish')
    },
    // 跳转 滞销明细
    unsale () {
      // this.$router.push('/analysis/cinema/unsale')
    },
    // 分页/大小
    handleSizeChange (num) {
      this.size = num;
      this.getTableData();
    },
    // 分页/页码
    handleCurrentChange (num) {
      this.page = num;
      this.getTableData();
    }
  }
};
