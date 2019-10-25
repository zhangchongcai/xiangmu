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
      goodSku: '',
      goodsInfo: {},
      quotaMap: {
        sale: '销售类',
        purchase: '采购类',
        profit: '利润类',
        inventory: '库存类',
        efficiency: '效率类'
      },
      orderMap: {
        sale: '1',
        purchase: '4',
        profit: '2',
        inventory: '5',
        efficiency: '3'
      },
      quotaList: [],
      orgType: Global.judgeOrgType,
      orgName: '总部',
      startTime:
        this.$route.query.startTime || new Date().formatDate('yyyy-MM-dd'),
      endTime: this.$route.query.endTime || new Date().formatDate('yyyy-MM-dd'),
      time:
        (!this.$route.query.timeType || this.$route.query.timeType == 'day'
          ? this.$route.query.startTime
          : [this.$route.query.startTime, this.$route.query.endTime]) ||
        new Date(),
      dateType: ['天', '周', '月', '年', '自定义'],
      dateTypeActive: this.$route.query.timeType || '天',
      dateTypeIndex: null,
      timeType: this.$route.query.timeType || 'day',
      memberType: false, // 会员类型
      memberTypeVal: 0, // 会员类型 值
      commodityName: '', // 卖品名称
      loading: false,
      optionsList: [],
      activeType: 'xse',
      targetLabel: Global.commodityDetailTrend, // 趋势指标
      otherLabel: Global.commodityDetailTrendOther, // 趋势指标 -其他
      trendIndicatorType: 'xse', // 品类指标
      tableSortMsg: null, // 表格排序信息
      sizes: Global.pageSizes,
      size: Global.pageSize,
      page: 1,
      total: 0,
      isLine: true,
      boxTableData: [],
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
      // icons: [
      //   "icon-neiye-zongxiaoshoue",
      //   "icon-neiye-kedanjia",
      //   "icon-neiyegoumaishuai",
      //   "icon-neiye-jine",
      //   "icon-neiye-xiaofei",
      //   "icon-neiye-xiaoshoue"
      // ],
      icons: {
        销售额: 'icon-neiye-zongxiaoshoue',
        销售单量: 'icon-neiye-kedanjia',
        销售数量: 'icon-neiye-kedanjia',
        客单价: 'icon-neiye-zongxiaoshoue',
        件单价: 'icon-neiye-zongxiaoshoue',
        客单量: 'icon-neiye-kedanjia',
        销售成本: 'icon-neiye-zongxiaoshoue',
        销售毛利: 'icon-neiye-jine',
        销售毛利率: 'icon-neiye-jine',
        成本价: 'icon-neiye-zongxiaoshoue',
        人均卖品金额: 'icon-neiye-zongxiaoshoue',
        购买率: 'icon-neiye-zongxiaoshoue',
        会员消费占比: 'icon-jingyingjuece-fene',
        套餐消费占比: 'icon-jingyingjuece-fene',
        采购数量: 'icon-neiye-kedanjia',
        采购金额: 'icon-neiye-zongxiaoshoue',
        平均采购价: 'icon-neiye-zongxiaoshoue',
        期初库存数量: 'icon-neiye-kedanjia',
        期初库存金额: 'icon-neiye-zongxiaoshoue',
        期初库存成本额: 'icon-neiye-zongxiaoshoue',
        期末库存数量: 'icon-neiye-kedanjia',
        期末库存金额: 'icon-neiye-zongxiaoshoue',
        期末库存成本额: 'icon-neiye-zongxiaoshoue',
        库存数量周转天: 'icon-jingyingjuece-zhouzhuan',
        库存金额周转天: 'icon-jingyingjuece-zhouzhuan'
      }
    };
  },
  watch: {
    commodityName (newName) {
      this.goodSku = newName;
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
      if ([-99999.99, 99999.99, '∞'].includes(money)) return '∞';
      if (
        [
          '销售单量',
          '销售数量',
          '采购数量',
          '期初库存数量',
          '期末库存数量',
          'fixed',
          'xsdl',
          'xssl',
          'cgsl',
          'qckcsl',
          'qmkcsl'
        ].includes(count) &&
        money < 10000
      ) {
        return isNaN(money) ? '--' : Math.round(money);
      }
      return Global.formatNum(money, count, unit);
    },
    // 不带单位
    formatMoney (money, indicatorCode) {
      if ([-99999.99, 99999.99].includes(money)) return '∞';
      if (
        [
          '销售单量',
          '销售数量',
          '采购数量',
          '期初库存数量',
          '期末库存数量',
          'fixed',
          'xsdl',
          'xssl',
          'cgsl',
          'qckcsl',
          'qmkcsl'
        ].includes(indicatorCode) &&
        money < 10000
      ) {
        return isNaN(money) ? '--' : Math.round(money);
      }
      return Global.formatMoney(money);
    },
    formatTargetUnit: (type, money) => {
      return Global.formatBoxOfficeTargetUnit(type, money);
    }
  },
  created () {
    this.scrollTop();
    this.initData();
    this.getOrgType();
    this.getAllData();
  },
  methods: {
    // all api
    getAllData () {
      this.getTargetTrend();
      this.getMainInfo();
    },
    scrollTop () {
      let wrapper = document.querySelector('.content-wrapper');
      if (wrapper && wrapper.scrollTop > 0) {
        wrapper.scrollTo(0, 0);
      }
    },
    initData () {
      if (this.$route.query.goodSku) {
        this.optionsList = [
          {
            goodSku: this.$route.query.goodSku,
            goodName: this.$route.query.goodName
          }
        ];
        this.commodityName = this.goodSku = this.$route.query.goodSku;
      }
      // else {
      //   this.getSkuNames('',true)
      // }
    },
    remoteMethod (query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          this.getSkuNames(query);
        }, 200);
      } else {
        this.optionsList = [];
      }
    },
    getSkuNames (keyName) {
      this.$camList
        .querySkuByName({
          body: {
            dateType: this.timeType,
            endDate: this.endTime,
            startDate: this.startTime,
            member: this.memberTypeVal,
            goodName: keyName
          }
        })
        .then(res => {
          this.optionsList = res.data;
        });
    },
    getMainInfo () {
      let params = {
        body: {
          dateType: this.timeType,
          startDate: this.startTime,
          endDate: this.endTime,
          // groupId:59,
          goodSku: this.goodSku,
          member: this.memberTypeVal
        }
      };
      this.$camList.querySkuDetailsInfo(params).then(res => {
        this.quotaList = [];
        if (res.data) {
          let indicator = res.data.indicator;
          delete res.data.indicator;
          this.goodsInfo = res.data;
          for (var key in indicator) {
            this.quotaMap[key] &&
              this.quotaList.push({
                label: this.quotaMap[key],
                key,
                list: indicator[key],
                order: this.orderMap[key]
              });
          }
          this.quotaList.sort((prev, next) => {
            return prev.order.localeCompare(next.order);
          });
        }
      });
    },
    // 改变/会员
    changeMemberType () {
      this.memberTypeVal = +this.memberType;

      if (this.memberTypeVal) {
        // 仅会员
        this.$refs.targetLabel.resetSelect();
        this.getMainInfo();
      } else {
        this.getAllData();
      }
    },
    getOrgType () {
      getOrgInfo({ body: {} }).then(response => {
        if (response.data) {
          this.orgType = response.data.orgType;
          this.orgName = response.data.orgName;
        }
      });
    },
    // 查询趋势图信息
    getTargetTrend () {
      let params = {
        body: {
          // brandId: this.cinemaId,
          dateType: this.timeType,
          startDate: this.startTime,
          endDate: this.endTime,
          member: this.memberTypeVal,
          // groupId: 59,
          goodSku: this.goodSku,
          bsiCodes: this.trendIndicatorType
        }
      };
      this.$route.query.cityId &&
        (params.body.cityId = this.$route.query.cityId);
      this.$route.query.cinemaId &&
        (params.body.cinemaId = this.$route.query.cinemaId);
      this.$camList.querySkuDetailsTrend(params).then(res => {
        if (res.data) {
          this.boxTableData = res.data.models || [];
          let rows = res.data[this.trendIndicatorType];
          if (rows && rows.length > 0) {
            this.lineChartEmpty = false;
            this.boxLineData.rows = rows.map(item => {
              return {
                date: item.name,
                value:
                  ([-99999.99, 99999.99].includes(item.value)
                    ? '∞'
                    : item.value) || 0
              };
            });
          } else {
            this.lineChartEmpty = true;
          }
        } else {
          this.lineChartEmpty = true;
        }
      });
    },
    // 指标趋势表格下载
    getTrendOut () {
      // let baseURL = config.baseURL;
      let baseURL = this.$store.state.default.apiConfig.baseURL;
      let downUrl = `${baseURL}/analysis/skuAnalysis/downloadSkuTrend?startDate=${this.startTime}&endDate=${this.endTime}&dateType=${this.timeType}&member=${this.memberTypeVal}&goodSku=${this.goodSku}&bsiCodes=${this.trendIndicatorType}&token=${this.$store.state.loginToken}`;
      window.location.href = downUrl;
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
        this.startTime = option.formatDate('yyyy/MM/dd');
        this.endTime = option.formatDate('yyyy/MM/dd');
      }
    },
    // 查询
    search () {
      this.getAllData();
    },
    // 改变/指标趋势类型
    changeTrendType (id) {
      this.trendIndicatorType = id;
      this.getTargetTrend();
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
    }
  }
};
