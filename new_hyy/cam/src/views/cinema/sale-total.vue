<template>
  <div class="sale-content-wrap">
    <div class="header-fixed">
      <!-- <bread-crumb  :currentTime="currentTime" :dataList="dataList"></bread-crumb> -->
      <div class="time-wrap">
        <div class="time-item">
          <Authority-Name :orgType="orgType" :orgName="orgName"></Authority-Name>
        </div>
        <div class="time-item">
          <label class="label-title">
            时间选择：
            <calendar-view size="mini" v-model="time" :dateType="dateType" :dateTypeActive='dateTypeActive' :dateTypeIndex="dateTypeIndex" @emitCalendarType="getTimeType" @change="changeTime"></calendar-view>
          </label>
        </div>
        <div class="time-item">
          <label>
            <span class="label-title">会员属性：</span>
            <el-radio-group v-model="memberType" @change="changeMemberType" class="reset-radios-group">
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
            <el-radio :label="1" :disabled="disabledChain">环比</el-radio>
            <el-radio :label="2" :disabled="disabledSame">同比</el-radio>
          </el-radio-group>
          <el-button size="mini" style="margin-left:20px" @click="showTargetSetting">指标设置</el-button>
        </div>
      </div>
      <div class="section-content" v-if="targetArr">
        <div class="target-flex">
          <div class="target-block" v-for="(item,index) in targetArr" :key="index">
            <div class="target-title">{{item.indicatorName}}</div>
            <div class="money">
              <i class="iconfont" :class="icons[item.indicatorCode].icon" :style="{color:iconColors[index]}"></i>
              <span class="money-num">{{item.value |formatMoney(item.indicatorCode)}}</span>
              <span class="unit">{{item.indicatorCode|formatTargetUnit(item.value*1)}}</span>
            </div>
            <div class="ratio" v-if="ratioType == 1 && !disabledChain">
              环比
              <span class="ratio-num" :class="item.roundPeriodValue*1 > 0 ? 'text-green':'text-red' ">
                <i class="iconfont" :class="[item.roundPeriodValue > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']">
                </i>
                {{item.roundPeriodValue == '-9999'?'--':(item.roundPeriodValue*1 >0?item.roundPeriodValue*1:item.roundPeriodValue*(-1))}}%
              </span>
            </div>
            <div class="ratio" v-if="ratioType == 2 && !disabledSame">
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
        <div class="unit" style="margin-left:30px">
          <!-- 单位：元 -->
        </div>
        <div>
          <target-label activeType="xse" :targetLabel="targetLabel" :otherLabel="otherLabel" @getType="changeSaleType">
          </target-label>
        </div>
        <div>
          <i class="iconfont icon-neiye-zhexiantu cursor text-blue" @click="isLine = true"></i>
          <i class="iconfont icon-neiye-biaoge cursor text-blue" @click="isLine = false"></i>
        </div>
      </div>
      <div class="section-content">
        <ve-line v-if="isLine" :data="saleLineData" :legend-visible="false" :settings="lineSettings" :extend="lineExtend">
        </ve-line>
        <div class="reset-table" v-else>
          <div style="overflow:hidden;zoom:1;margin:10px 0" class="reset-button">
            <el-button class="right" size="mini" @click="getSaleOut">导出</el-button>
          </div>
          <el-table border :data="saleTableData" height="380" class="mt10">
            <el-table-column prop="dateKey" label="日期" min-width="100" fixed></el-table-column>
            <el-table-column prop="salesVolume" label="销售额(元)" min-width="140" fixed>
              <template slot-scope="scope">
                {{scope.row.salesVolume | formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="salesOrders" label="销售单量(单)" min-width="100" fixed>
              <template slot-scope="scope">
                {{scope.row.salesOrders | formatNum(0)}}
              </template>
            </el-table-column>
            <el-table-column prop="salesCount" label="销售数量(件)" min-width="100" fixed>
              <template slot-scope="scope">
                {{scope.row.salesCount | formatNum(0)}}
              </template>
            </el-table-column>
            <el-table-column prop="unitPrice" label="客单价(元)" min-width="100">
              <template slot-scope="scope">
                {{scope.row.unitPrice|formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="piecePrice" label="件单价(元)" min-width="100">
              <template slot-scope="scope">
                {{scope.row.piecePrice|formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="unitCount" label="客单量(件/单)" min-width="100">
              <template slot-scope="scope">
                {{scope.row.unitCount|formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="buyRate" label="购买率(%)" min-width="100">
            </el-table-column>
            <el-table-column prop="sppPrice" label="人均卖品金额(元)" min-width="120">
              <template slot-scope="scope">
                {{scope.row.sppPrice | formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="sellingCost" label="销售成本(元)" min-width="100">
              <template slot-scope="scope">
                {{scope.row.sellingCost | formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="salesGrossProfit" label="销售毛利(元)" min-width="100">
              <template slot-scope="scope">
                {{scope.row.salesGrossProfit | formatNum}}
              </template>
            </el-table-column>
            <el-table-column prop="salesGrossProfitRate" label="销售毛利率(%)" min-width="100"></el-table-column>
            <el-table-column prop="memberSalesVolumePercent" label="会员消费占比(%)" min-width="100"></el-table-column>
            <el-table-column prop="setmealSalesVolumePercent" label="套餐消费占比(%)" min-width="100"></el-table-column>
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
        <target-label activeType="xse" :targetLabel="targetLabel" :otherLabel="otherLabel1" @getType="changeChannelType"></target-label>
      </div>
      <!-- 饼图 -->
      <div class="section-content flex" v-if="showPie">
        <div style="width:44%;">
          <ve-pie :title="channelTitle" :data="channelData" :settings="channelSettings" :extend="pieExtend" :colors="colors"></ve-pie>
        </div>
        <div style="width:44%;margin:0 auto">
          <ve-ring :title="categoryTitle" :data="categoryData" :settings="categorySettings" :extend="pieExtend" :colors="colors"></ve-ring>
        </div>
      </div>
      <!-- 柱状图 -->
      <div class="section-content flex" v-else>
        <div style="width:44%">
          <ve-histogram :title="channelTitle" :data="channelBarData" :extend="barExtend" :legend-visible="false"></ve-histogram>
        </div>
        <div style="width:44%;margin:0 auto">
          <ve-histogram :title="categoryTitle" :data="categoryData" :extend="barExtend" :legend-visible="false"></ve-histogram>
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
import AuthorityName from '../partical/authorityName';
// import config from 'frame_cpm/http/config';
import TargetLabel from '../partical/targetLabel';
import TargetDialog from '../partical/targetDialog';
import CalendarView from '../../components/calendar/calendar';
import Global from '../../util/global.js';
import BreadCrumb from '../partical/breadCrumb';
export default {
  components: { BreadCrumb, TargetLabel, TargetDialog, CalendarView, AuthorityName },
  name: '卖品概览',
  data () {
    this.colors = [
      '#3B74FF',
      '#FE6081',
      '#FEC107',
      '#A5F053',
      '#FE825E',
      '#8E7EFF',
      '#ca8622',
      '#bda29a',
      '#6e7074',
      '#546570',
      '#c4ccd3'
    ];
    return {
      orgType: 'cinema',
      orgName: null,
      dataList: [{ name: '卖品销售概览' }],
      targetLabel: Global.targetLabel,
      otherLabel: Global.otherLabel,
      otherLabel1: Global.otherLabel1, // 没有套餐
      currentTime: null,
      disabledChain: false, // 不显示 环比
      disabledSame: false, // 不显示 同比
      dateType: ['天', '周', '月', '年', '自定义'],
      dateTypeActive: null,
      dateTypeIndex: null,
      startTime: null,
      endTime: null,
      timeType: 'day',
      time: null,
      cityId: this.$route.query.cityId ? this.$route.query.cityId : null,
      cinemaId: this.$route.query.cinemaId ? this.$route.query.cinemaId : null,
      channelTitle: {
        show: true,
        text: '渠道',
        textStyle: {
          fontSize: 12,
          color: '#666'
        },
        padding: [20, 10, 10, 10]

      },
      categoryTitle: {
        show: true,
        text: '品类',
        textStyle: {
          fontSize: 12,
          color: '#666'
        },
        padding: [20, 10, 10, 10]
      },

      isLine: true,
      userId: this.$store.state.loginUser ? this.$store.state.loginUser.uid : null,
      memberType: 0, // 会员类型
      ratioType: 1, // 环比类型
      saleType: 'xse', // 卖品指标
      saleAllType: ['xse', 'xsdl', 'xssl', 'kdj', 'jdj', 'kdl', 'cbj', 'xsml', 'xsmlr', 'xscb', 'gml', 'rjmpje', 'hyxfzb', 'tcxfzb'],
      saleLineAllData: null,
      saleTableData: [],
      channelType: 'xse', // 渠道/类型指标
      channelAllData: null,
      showPie: true, // 渠道/类型 饼图和柱状图切换
      iconColors: Global.iconColors,
      icons: Global.salesIcon,
      // 指标概览
      targetArr: [],
      // 指标趋势
      saleLineData: {
        columns: ['date', 'value'],
        rows: []
      },
      // 指标趋势/折线图设置
      lineSettings: {
        itemStyle: {
          color: '#3B74FF', // 折线点颜色
          lineStyle: {
            color: '#3B74FF'
          }
        }
      },
      // 指标趋势/折线图扩展
      lineExtend: {
        'xAxis.0.axisLabel.rotate': 45,
        'xAxis.0.axisLabel.interval': 2,
        tooltip: {
          // trigger:'', // axis：坐标轴触发：（折线图、柱状图） item:数据项触发，散点图，饼图
          formatter: (params) => {
            let date = params[0].name;
            let value = this.$options.filters.formatNum(params[0].value[1]);
            let str = params[0].marker + date + '<br>' + value;
            return str;
          }
        }
      },
      // 渠道
      channelData: {
        columns: ['name', 'value'],
        rows: []
      },
      // 渠道设置
      channelSettings: {
        level: [['线上', '线下'], []]
      },
      // 渠道柱状图
      channelBarData: {
        columns: ['name', 'value'],
        rows: []
      },
      // 品类
      categoryData: {
        columns: ['name', 'value'],
        rows: []
      },
      // 品类设置
      categorySettings: {
        roseType: 'radius'
      },
      // 饼图扩展
      pieExtend: {
        legend: {
          top: 'bottom',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            color: '#333',
            fontSize: 12
          }
        },
        label: {
          formatter: '{b}({d}%)'
        },
        tooltip: {
          formatter: (params) => {
            let name = params.name;
            let value = this.$options.filters.formatNum(params.value);
            let percent = params.percent;
            let str = params.marker + name + '<br>' + value + '（' + percent + '%）';
            return str;
          }
        }
      },
      // 柱状图扩展
      barExtend: {
        barWidth: 10,
        color: '#3B74FF',
        tooltip: {
          formatter: (params) => {
            let name = params[0].name;
            let value = this.$options.filters.formatNum(params[0].value);
            let str = params[0].marker + name + '<br>' + value;
            return str;
          }
        },
        'xAxis.0.axisLabel.interval': 0,
        'xAxis.0.axisLabel.rotate': 45
      },
      // 卖品销售表现（四象限）
      scatterData: {
        columns: ['buyRate', 'unitPrice', 'salesVolume'],
        rows: {}
      },
      // 散点图设置
      scatterSettings: {
        dimension: ['buyRate'], // 维度
        metrics: ['unitPrice', 'salesVolume', 'buyRate'], // 指标
        xAxisType: 'value', // x轴类型  category, value, time, log
        xAxisName: '卖品购买率(%)', // x轴标题
        yAxisName: '客单价(元)',
        labelMap: {
          buyRate: '购买率', // 别名
          salesVolume: '销售额',
          unitPrice: '客单价'
        }
      },
      // 散点图扩展
      scatterExtend: {
        tooltip: {
          formatter: (params) => {
            let name = params.seriesName + '<br>';
            let ratio = '购买率:' + params.value[0] + '%' + '<br>';
            let unitPrice = '客单价:' + this.$options.filters.formatNum(params.value[1]) + '<br>';
            let sale = '销售额:' + this.$options.filters.formatNum(params.value[2]) + '<br>';
            return name + ratio + unitPrice + sale;
          }
        },
        yAxis: {
          nameLocation: 'end',
          nameTextStyle: {
            color: '#000',
            fontSize: 12,
            padding: [0, 0, 0, 40]
          },
          splitLine: false,
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: '#eee'
            }
          },
          axisLabel: {
            color: '000'
          }
        },
        xAxis: {
          nameLocation: 'middle',
          nameTextStyle: {
            color: '#000',
            fontSize: 12,
            padding: 20
          },
          splitLine: false,
          axisLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: '#eee'
            }
          },
          axisLabel: {
            color: '000'
          }
        }
      }
    };
  },
  filters: {
    formatNum: (money, count, unit) => {
      return Global.formatNum(money * 1, count, unit);
    },
    formatTargetUnit: (type, money) => {
      return Global.formatTargetUnit(type, money * 1);
    },
    formatMoney (money, indicatorCode) {
      if (indicatorCode == 'xssl' || indicatorCode == 'xsdl') {
        return Global.formatMoney(money * 1, 0);
      } else {
        return Global.formatMoney(money * 1);
      }
    }
  },
  watch: {
    '$route': function (to, from) {
      if (to.name == from.name && to.path.endsWith('cinema/sale/total')) {
        this.getCurrentTime();
        this.initData();
      }
    }
  },
  created () {
    this.getCurrentTime();
    this.initData();
  },
  methods: {
    getCurrentTime () {
      this.$camList.getCurrentTime().then(res => {
        this.currentTime = res.data;
      });
    },
    initData () {
      let params = this.$route.query;
      this.cityId = params.cityId ? params.cityId : null;
      this.cinemaId = params.cinemaId ? params.cinemaId : null;
      this.timeType = params.dateType ? params.dateType : 'day',
        this.dateTypeActive = params.dateType ? params.dateType : 'day',
        this.dateTypeIndex = params.dateTypeIndex ? params.dateTypeIndex : null,
        this.startTime = params.startTime ? params.startTime : this.$moment(new Date()).format('YYYY-MM-DD'),
        this.endTime = params.endTime ? params.endTime : this.$moment(new Date()).format('YYYY-MM-DD');
      if (this.timeType == 'day') {
        this.time = this.startTime;
      } else {
        this.time = [this.startTime, this.endTime];
      }
      this.getAllData();
      this.getOrg();
    },
    getOrg () {
      // 下转带的权限
      if (this.$route.query.name) {
        this.orgName = this.$route.query.name;
      } else {
        this.$camList.getOrgInfo({ body: {} }).then(res => {
          if (res.data) {
            this.orgName = res.data.orgName;
            this.orgType = res.data.orgType;
          }
        });
      }
    },
    getAllData () {
      this.getTargetView();
      this.getTargetTrend();
      this.getChannelData();
      this.getGoodsData();
    },
    // 指标趋势表格下载
    getSaleOut () {
      let params = {
        userId: this.userId,
        startDate: this.startTime,
        endDate: this.endTime,
        member: this.memberType,
        dateType: this.timeType,
        bsiCodes: this.saleAllType
      };
      // let baseURL = config.baseURL;
      let baseURL = this.$store.state.default.apiConfig.baseURL;
      let saleDownUrl = `${baseURL}/analysis/sellGoods/downloadSellGoodsSaleTend?userId=${this.userId}&startDate=${this.startTime}&endDate=${this.endTime}&dateType=${this.timeType}&member=${this.memberType}&bsiCodes=[${this.saleAllType}]&token=${this.$store.state.loginToken}`;
      if (this.cinemaId) {
        saleDownUrl += `&cinemaId=${this.cinemaId}`;
      }
      window.location.href = saleDownUrl;
    },
    // 2.卖品指标概览
    getTargetView (codes) {
      let params = {
        body: {
          userId: this.userId,
          cityId: this.cityId,
          cinemaId: this.cinemaId,
          startDate: this.startTime,
          endDate: this.endTime,
          dateType: this.timeType,
          member: this.memberType,
          indicatorCodes: codes
        }
      };
      this.$camList.saleTargetView(params).then(response => {
        let res = response.data;
        this.targetArr = res;
      });
    },
    // 3.卖品指标趋势
    getTargetTrend () {
      let params = {
        body: {
          userId: this.userId,
          cityId: this.cityId,
          cinemaId: this.cinemaId,
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
              value: item.value
            };
          });
        }
      });
    },
    // 4. 渠道/品类数据
    getChannelData () {
      let id = this.channelType;
      let params = {
        body: {
          userId: this.userId,
          cityId: this.cityId,
          cinemaId: this.cinemaId,
          bsiCodes: this.saleAllType,
          startDate: this.startTime,
          endDate: this.endTime,
          dateType: this.timeType,
          member: this.memberType
        }
      };
      this.$camList.switchChannel(params).then(response => {
        this.channelAllData = response.data;
        let res = response.data;
        let targetData = response.data[this.channelType];
        // 品类
        if (targetData.category) {
          this.categoryData.rows = targetData.category;
        }
        // 渠道
        if (targetData.channel) {
          this.channelDataHandle(targetData.channel, targetData.channelLine);
        }
        if (id == 'xse' || id == 'xssl' || id == 'xsml' || id == 'xscb') {
          this.showPie = true;
        } else {
          this.showPie = false;
        }
      });
    },
    // 5. 销售表现
    getGoodsData () {
      let params = {
        body: {
          userId: this.userId,
          cityId: this.cityId,
          cinemaId: this.cinemaId,
          startDate: this.startTime,
          endDate: this.endTime,
          dateType: this.timeType,
          member: this.memberType
        }
      };
      this.$camList.SaleGoodsData(params).then(response => {
        let res = response.data;
        if (res.sellGoodsAll) {
          let data = res.sellGoodsAll;
          if (data) {
            for (var key in data) {
              data[key][0].buyRate = data[key][0].buyRate && data[key][0].buyRate.toFixed(2) || 0; // 购买率
            }
            this.scatterData.rows = data;
          }
        }
      });
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
        this.startTime = this.$moment(option).format('YYYY-MM-DD');
        this.endTime = this.$moment(option).format('YYYY-MM-DD');
      }
      this.getAllData();
    },
    // 改变/会员
    changeMemberType (id) {
      this.memberType = id;
      this.getAllData();
    },
    // 改变/指标概览(环比/同比)
    changeRadio (id) {
      this.ratioType = id;
    },
    // 改变/卖品指标趋势类型
    changeSaleType (id) {
      this.saleType = id;
      let targetData = this.saleLineAllData[this.saleType];
      if (targetData.sellAnalysis) {
        this.saleLineData.rows = targetData.sellAnalysis.map(item => {
          return {
            date: item.name,
            value: item.value
          };
        });
      }
    },
    // 改变/渠道及品类分布
    changeChannelType (id) {
      //  销售额1、销售数量3、销售毛利7、销售成本9 展示饼图
      //  销售单量2、人均消费额11、客单价4、件单价5、客单量6、购买率10、销售毛利率8、会员消费占比12 展示柱形图
      this.channelType = id;
      let targetData = this.channelAllData[id];
      if (targetData.category) {
        this.categoryData.rows = targetData.category;
      }
      if (targetData.channel) {
        this.channelDataHandle(targetData.channel, targetData.channelLine);
      }
      if (id == 'xse' || id == 'xssl' || id == 'xsml' || id == 'xscb') {
        this.showPie = true;
      } else {
        this.showPie = false;
      }
    },
    // 渠道线上/线下数据处理
    channelDataHandle (channelData, channelLine) {
      let newData = channelData.slice(0);
      if (channelLine && channelLine.length > 0) {
        newData = newData.concat(channelLine);
      }
      this.channelBarData.rows = channelData;
      this.channelData.rows = newData;
      this.channelSettings.level[1] = channelData.map(item => {
        return item.name;
      });
    },
    // 指标设置/弹窗
    showTargetSetting () {
      let targetDialog = this.$refs.targetDailog;
      let params = {
        body: {
          userId: this.userId
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
    // 查询
    search () {
      this.getAllData();
    }
  }
};
</script>
