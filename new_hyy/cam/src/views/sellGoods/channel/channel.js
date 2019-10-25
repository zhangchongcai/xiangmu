import Global from '../../../util/global.js';
import AuthorityName from '../../partical/authorityName';
import CalendarView from '../../../components/calendar/calendar';
import TargetLabel from '../../partical/targetLabel';
import TreeGrid from '../../partical/TreeGrid';
// import config from "frame_cpm/http/config";
import { getOrgInfo } from '../../../http/interface';

export default {
  components: {
    AuthorityName,
    CalendarView,
    TargetLabel,
    TreeGrid
  },
  data () {
    return {
      columns: [
        {
          text: '渠道名称',
          dataIndex: 'channelName',
          width: 130,
          fixed: true,
          isNotFormat: true,
          isNotSort: true
        },
        {
          text: '销售额(元)',
          dataIndex: 'salesVolume'
          // fixed: true,
          // isSlot: true
        },
        {
          text: '销售额占比(%)',
          dataIndex: 'salesVolumePercent',
          width: 130
        },

        {
          text: '销售单量',
          dataIndex: 'salesOrders'
        },
        {
          text: '销售数量',
          dataIndex: 'salesCount'
        },
        {
          text: '客单价(元)',
          dataIndex: 'unitPrice'
        },
        {
          text: '件单价(元)',
          dataIndex: 'piecePrice'
        },
        {
          text: '客单量',
          dataIndex: 'unitCount'
        },
        {
          text: '购买率(%)',
          dataIndex: 'buyRate'
        },
        {
          text: '人均卖品金额(元)',
          dataIndex: 'sppPrice',
          width: 150
        },
        {
          text: '销售成本(元)',
          dataIndex: 'sellingCost',
          width: 130
        },
        {
          text: '成本价(元)',
          dataIndex: 'costPrice'
        },
        {
          text: '销售毛利',
          dataIndex: 'salesGrossProfit'
        },
        {
          text: '销售毛利率(%)',
          dataIndex: 'salesGrossProfitRate',
          width: 130
        },
        {
          text: '会员消费占比(%)',
          dataIndex: 'memberSalesVolumePercent',
          width: 150
        }
        // {
        //   text: '套餐消费占比(%)',
        //   dataIndex: 'setmealSalesVolumePercent',
        //   width: 140
        // }
      ],
      dataSource: [],
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
      activeType: 'xse',
      targetLabel: Global.categoryTrend, // 趋势指标
      otherLabel: Global.categoryTrendOther, // 趋势指标 -其他
      trendIndicatorType: 'xse', // 渠道趋势指标
      isNumber: 0, // 0是数值1是占比
      isHistogram: false, // 是否显示柱形图
      chartSettings: {
        stack: { date: [] }
      },
      chartExtend: {
        barGap: '0',
        tooltip: {
          formatter: params => {
            let str = params[0].name + '<br>';
            params.forEach(item => {
              //, this.trendIndicatorType
              str += `${item.marker} ${
                item.seriesName
              } : ${this.$options.filters.formatNum(item.value)}<br>`;
            });
            return str;
          }
        }
      },
      stackArr: [],
      chartData: {
        columns: [],
        rows: []
      },
      tableData: [], // 表格列表

      tableSortMsg: null, // 表格排序信息
      sizes: Global.pageSizes,
      size: Global.pageSize,
      page: 1,
      total: 0
    };
  },
  computed: {},
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
      if (['xsdl', 'xssl', 'kdl'].includes(count) && money < 10000) {
        return isNaN(money) ? '--' : Math.round(money);
      }
      return Global.formatNum(money, count, unit);
    },
    // 不带单位
    formatMoney (money, indicatorCode) {
      if (['xsdl', 'xssl', 'kdl'].includes(indicatorCode)) {
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
  watch: {
    isNumber (val) {
      this.getTargetTrend();
    }
  },
  created () {
    this.getOrgType();
    this.getAllData();
  },
  methods: {
    getOrgType () {
      getOrgInfo({ body: {} }).then(response => {
        if (response.data) {
          this.orgType = response.data.orgType;
          this.orgName = response.data.orgName;
        }
      });
    },
    // all api
    getAllData () {
      this.getTargetTrend();
      this.getTableData();
    },
    // 获取时间类型
    getTimeType (type) {
      this.timeType = type;
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
        this.$refs.targetLabel.resetSelect();
        this.getTableData();
      } else {
        this.getAllData();
      }
    },
    // 改变/指标趋势类型
    changeTrendType (id) {
      this.isHistogram =
        Global.categoryTrendOther.findIndex(item => item.id === id) > -1;
      if (this.isHistogram) {
        this.chartSettings = {
          tiled: {
            date: this.stackArr
          }
        };
      } else {
        this.chartSettings = {
          stack: {
            date: this.stackArr
          }
        };
      }
      this.trendIndicatorType = id;
      this.getTargetTrend();
    },
    // 查询趋势图信息
    getTargetTrend () {
      let params = {
        body: {
          bsiCode: this.trendIndicatorType,
          dateType: this.timeType,
          startDate: this.startTime,
          endDate: this.endTime,
          member: this.memberTypeVal,
          searchType: this.isNumber
        }
      };
      this.$camList.queryChannelTrend(params).then(res => {
        if (res.data && res.data.list.length > 0) {
          this.lineChartEmpty = false;
          this.chartData.columns = ['date'].concat(res.data.columns);
          this.stackArr = res.data.columns;
          this.chartSettings.stack &&
            (this.chartSettings.stack.date = res.data.columns);
          this.chartData.rows = res.data.list;
        } else {
          this.lineChartEmpty = true;
        }
      });
    },
    // 渠道明细导出
    getChannelOut () {
      // let baseURL = config.baseURL;
      let baseURL = this.$store.state.default.apiConfig.baseURL;
      let downUrl = `${baseURL}/analysis/channel/downloadSellGoodsDetails?startDate=${this.startTime}&endDate=${this.endTime}&dateType=${this.timeType}&member=${this.memberTypeVal}&token=${this.$store.state.loginToken}`;
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
      this.sortable(orderObj, this.dataSource);
      // this.getTableData(orderObj)
    },
    sortable (orderObj, dataArr) {
      if (!orderObj || (dataArr && dataArr.length < 2)) return;
      for (let item of dataArr) {
        if (item.child) {
          this.sortable(orderObj, item.child);
        }
      }
      if (orderObj.seq == 'ASC') {
        dataArr.sort(
          (prev, next) => prev[orderObj.columnType] - next[orderObj.columnType]
        );
      } else {
        dataArr.sort(
          (prev, next) => next[orderObj.columnType] - prev[orderObj.columnType]
        );
      }
    },
    // 查询渠道明细
    getTableData (orderObj) {
      let params = {
        body: {
          dateType: this.timeType,
          startDate: this.startTime,
          endDate: this.endTime,
          pageNo: this.page,
          pageSize: this.size,
          member: this.memberTypeVal
        }
      };
      orderObj = orderObj || this.tableSortMsg;
      if (orderObj) {
        params.body = Object.assign({}, orderObj, params.body);
      }
      this.$camList.queryChannelDetails(params).then(res => {
        if (res.data && res.data.length > 0) {
          this.dataSource = res.data;
          this.sortable(
            {
              columnType: 'salesVolume',
              seq: 'DESC'
            },
            this.dataSource
          );
          // this.total = res.data.total
        }
      });
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
