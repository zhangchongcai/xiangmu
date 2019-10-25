<template>
  <div class="BoxContainer">
    <!--票房详情-->
    <div class="BoxOffice">
      <div class="BoxTitle flex" height="40">
        <div>
          <span class="iconfont icon-shouye-piaofang"></span>
          <span class="title">票房</span>
        </div>
        <div>
          <span class="tip cursor" @click="goDetail">详情</span>
          <i class="iconfont icon-neiye-zhankaijiantou icon-arrow"></i>
        </div>
      </div>
    </div>

    <!--nav导航-->
    <div class="right-col">
      <ul class="listUl">
        <li class="first-li" @click="MeClick('0')" :class="{active:cur==0}">
          <div class="cont">
            <h1 class="BebasNeue">{{BoxofficeTop.boxOffice | capitalizeOne}}</h1>
            <p>票房收入({{BoxofficeTop.boxOffice | foo}})</p>
          </div>
        </li>
        <li @click="MeClick('1')" :class="{active:cur==1}">
          <div>观影人次</div>
          <div>
            <span class="BebasNeue">{{BoxofficeTop.audienceCount | capitalizePerson}}</span>{{BoxofficeTop.audienceCount | too}}
          </div>
        </li>
        <li @click="MeClick('2')" :class="{active:cur==2}">
          <div>平均票价</div>
          <div v-if="BoxofficeTop.avgTicketPrice != 0">
            <span class="BebasNeue">{{BoxofficeTop.avgTicketPrice | capitalizeOne}}</span>{{BoxofficeTop.avgTicketPrice | foo}}
          </div>
          <div v-else-if="BoxofficeTop.avgTicketPrice == 0">
            <span class="BebasNeue">0</span>元
          </div>
          <div v-else>
            <span>--</span>
          </div>
        </li>
        <li @click="MeClick('3')" :class="{active:cur==3}">
          <div>上座率</div>
          <div>
            <span class="BebasNeue">{{BoxofficeTop.attendanceRate | woo}}</span>%
          </div>
        </li>
        <li @click="MeClick('4')" :class="{active:cur==4}">
          <div>市场份额</div>
          <div v-if="BoxofficeTop.marketShare != 0">
            <span class="BebasNeue">{{BoxofficeTop.marketShare | woo}}</span>%
          </div>
          <div v-else>
            <span>--</span>
          </div>
        </li>
      </ul>
      <el-tooltip class="item" effect="dark" content="市场份额=本影院票房收入/（本影院票房收入+竞对影院票房收入）" placement="bottom-start">
        <i class="iconfont icon-danchuang-tishi"></i>
      </el-tooltip>
    </div>

    <!--票房收入Content-->
    <div class="Boxoffice_Content ModuleKPI" v-if="cur==0">
      <!--KPI完成率-->
      <div class="ModuleTitleLayout" v-if="flag">
        <div class="ModuleTitle">
          <div>
            KPI完成率
            <el-tooltip class="item" effect="dark" placement="right-start">
              <div slot="content" style="width:300px">
                <ul id="ulMain">
                  <li>票房收入当日达成 : <span>{{CurrentBoxKPIDataCine.boxOfficeCurrent | capitalizeOne}}{{CurrentBoxKPIDataCine.boxOfficeCurrent | foo}}</span></li>
                  <li>环比前一日 : <span :class="[CurrentBoxKPIDataCine.boxOfficeChainDay > 0? 'green':'red']"><i class="iconfont" style="font-size:12px" :class="[CurrentBoxKPIDataCine.boxOfficeChainDay > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></i>{{CurrentBoxKPIDataCine.boxOfficeChainDay | woo(true)}}%</span></li>
                  <li>月至今达成 : <span>{{CurrentBoxKPIDataCine.boxOfficeMonthToNow | capitalizeOne}}{{CurrentBoxKPIDataCine.boxOfficeMonthToNow | foo}}</span></li>
                  <li>环比上月 : <span :class="[CurrentBoxKPIDataCine.boxOfficeChainMonth > 0? 'green':'red']"><i class="iconfont" style="font-size:12px" :class="[CurrentBoxKPIDataCine.boxOfficeChainMonth > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></i>{{CurrentBoxKPIDataCine.boxOfficeChainMonth | woo(true)}}%</span></li>
                  <li>本月目标为 : <span>{{CurrentBoxKPIDataCine.boxOfficeTarget | capitalizeOne}}</span>{{CurrentBoxKPIDataCine.boxOfficeTarget | foo}}</li>
                  <li>达成率 : <span>{{CurrentBoxKPIDataCine.boxOfficeRate | woo}}</span>%</li>
                  <li>与时间进度差距为 : <span :class="[CurrentBoxKPIDataCine.timeRateGap > 0? 'green':'red']">{{CurrentBoxKPIDataCine.timeRateGap | woo}}%</span></li>
                  <li>按目前进度,预计月底达成率为 : <span>{{CurrentBoxKPIDataCine.boxOfficeExpect | woo}}</span>%</li>
                  <li>与目标额差距 : <span :class="[CurrentBoxKPIDataCine.boxOfficeGap > 0? 'green':'red']">{{CurrentBoxKPIDataCine.boxOfficeGap | woo}}%</span></li>
                </ul>
              </div>
              <i class="iconfont icon-danchuang-tishi"></i>
            </el-tooltip>
          </div>
          <div class="last">截止:{{this.startDate && this.endDate}}</div>
        </div>
        <div class="kip-wrap">
          <box-dash-cine :BoxKPIvalueCine="CurrentBoxKPIDataCine"></box-dash-cine>
        </div>
      </div>
      <!--票房收入占比 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>影片收入占比</div>
          <div></div>
        </div>
        <!-- 饼状图 -->
        <ve-ring class="veRing" :data="chartIncome" :settings="categorySettings" :extend="pieExtend" :colors="colors" :data-empty="chartEmpty"></ve-ring>
      </div>
    </div>

    <!--观影人次Content-->
    <div class="Viewing_Content ModuleKPI" v-if="cur==1">
      <!--影片收入占比 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>观影人次占比</div>
          <div></div>
        </div>
        <!-- 饼状图 -->
        <ve-ring ref="one" class="veRing" :data="ChartViewing" :settings="categorySettingsPerson" :extend="pieExtendPerson" :colors="colors"></ve-ring>

      </div>
    </div>

    <!--平均票价Content-->
    <div class="Average_Content ModuleKPI" v-if="cur==2">
      <!--影片收入占比 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>平均票价收入对比</div>
          <div></div>
        </div>
        <!-- 条形图 -->
        <ve-bar :data="ChartBarfare" :colors="barColors" :extend="barExtend"></ve-bar>
      </div>
    </div>

    <!--上座率Content-->
    <div class="Attendance_Content ModuleKPI" v-if="cur==3">
      <!--影片收入占比 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>上座率对比</div>
          <div></div>
        </div>
        <!-- 条形图 -->
        <ve-bar :data="ChartRate" :colors="barColors" :extend="barExtendTwo"></ve-bar>
      </div>
    </div>

    <!--市场份额Content-->
    <div class="share_Content ModuleKPI" v-if="cur==4">
      <!--KPI完成率-->
      <div class="ModuleTitleLayout" v-if="KPI">
        <div class="ModuleTitle">
          <div>
            KPI完成率
            <el-tooltip class="item" effect="dark" placement="right-start">
              <div slot="content" style="width:300px">
                <ul id="ulMain">
                  <li>市场份额当日达成 : <span>{{BoxKPIDataShare.marketShareCurrent | capitalizeOne}}</span>%</li>
                  <li>环比前一日 : <span :class="[BoxKPIDataShare.marketShareChainDay > 0? 'green':'red']"><i class="iconfont" style="font-size:12px" :class="[BoxKPIDataShare.marketShareChainDay > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></i>{{BoxKPIDataShare.marketShareChainDay | capitalizeOne}}%</span></li>
                  <li>月至今达成 : <span>{{BoxKPIDataShare.marketShareMonthToNow | capitalizeOne}}</span>%</li>
                  <li>环比上月 : <span :class="[BoxKPIDataShare.marketShareChainMonth > 0? 'green':'red']"><i class="iconfont" style="font-size:12px" :class="[BoxKPIDataShare.marketShareChainMonth > 0? 'icon-neiye-shangshengjiantou':'icon-neiye-xiajiangjiantou']"></i>{{BoxKPIDataShare.marketShareChainMonth | capitalizeOne}}%</span></li>
                  <li>本月目标为 : <span>{{BoxKPIDataShare.marketShareTarget | capitalizeOne}}</span>%</li>
                  <li>距目标额差距 : <span :class="[BoxKPIDataShare.marketShareGap > 0? 'green':'red']">{{BoxKPIDataShare.marketShareGap | capitalizeOne}}%</span></li>
                </ul>
              </div>
              <i class="iconfont icon-danchuang-tishi"></i>
            </el-tooltip>
          </div>
          <div class="last">截止:{{this.startDate && this.endDate}}</div>
        </div>
        <div class="kip-wrap">
          <box-dash-share :BoxKPIvalueShare="BoxKPIDataShare"></box-dash-share>
        </div>
      </div>
      <!--市场份额占比 -->
      <div class="ModuleTitleLayout">
        <div class="ModuleTitle">
          <div>市场份额占比</div>
          <div></div>
        </div>
        <!--玫瑰图 -->
        <ve-ring class="veRing" :data="ChartShare" :settings="categorySettingsCopy" :extend="pieExtendThree" :colors="colors"></ve-ring>
      </div>
    </div>

  </div>
</template>

<script>
import BoxDashCine from './KPI/BoxDashCine';
import BoxDashShare from './KPI/BoxDashShare';
export default {
  components: {
    BoxDashCine,
    BoxDashShare
  },
  name: 'BoxOffice',
  props: {
    BoxTotal: {
      // type: Number
    },
    BoxofficeTop: {
      type: Object
    },
    BoxTableTop: {
      type: Array
    },
    chartIncome: {
      type: Object
    },
    lineData: {
      type: Object
    },
    cityName: {
      type: String
    },
    cityId: {
      // type: Number
    },
    memberId: {
      // type: Number
    },
    BoxKPIDataCine: {
      type: Object
    },
    startDate: {
      type: String
    },
    endDate: {
      type: String
    },
    timeType: {
      type: String
    },
    dateTypeActive: {
      default: null
    },
    dateTypeIndex: {
      default: null
    }
  },
  data () {
    this.barColors = [
      '#3B74FF'
    ],
      // 玫瑰图
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
      chartEmpty: true,
      CurrentBoxKPIDataCine: JSON.parse(JSON.stringify(this.BoxKPIDataCine)),
      flag: true,
      cur: 0,
      KPI: true,
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页大小
      total: '100',
      BoxType: true,
      BoxPage: true,
      loading: false,
      Boxcityid: this.cityId,
      BoxMemberId: this.memberId,
      BoxTableMain: [],  // 票房指标数据
      BoxTablePage: [],  // 票房分页数据
      BoxKPIDataShare: {}, // 市场分额KPI
      boxOfficeCurrent: null,
      newMemberCurrent: null,
      sppCurrent: null,
      // 观影人次饼图
      ChartViewing: {
        columns: [],
        rows: []
      },
      // 平均票价条形图
      ChartBarfare: {
        columns: [],
        rows: []
      },
      // 上座率条形图
      ChartRate: {
        columns: [],
        rows: []
      },
      // 市场份额
      ChartShare: {
        columns: [],
        rows: []
      },
      // 1.1折线图的设置
      lineSettings: {
        smooth: false,
        itemStyle: {
          color: '#3B74FF', // 折线点颜色
          lineStyle: {
            color: '#FE825E'
          }
        }
      },
      // 折线图扩展
      lineExtend: {},
      // 玫瑰图市场份额
      categorySettingsCopy: {
        roseType: 'radius',
        label: {
          normal: {
            formatter: '{c}%',
            position: 'outside'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '15',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            length: 5,
            length2: 5
          }
        }
      },
      // 玫瑰图设置
      categorySettings: {
        top: 0,
        roseType: 'radius',
        label: { // 文本标签
          formatter: (params) => {
            let value = this.formatValue(params.value, '元');
            let percent = params.percent;
            let str = percent + '%';
            return str;
          }
        },
        labelLine: {
          normal: {
            length: 5,
            length2: 5
          }
        }
      },
      categorySettingsPerson: {
        top: 0,
        roseType: 'radius',
        label: { // 文本标签
          formatter: (params) => {
            let value = this.formatPerson(params.value * 1, '人');
            let percent = params.percent;
            let str = percent + '%';
            return str;
          }
        },
        labelLine: {
          normal: {
            length: 5,
            length2: 5
          }
        }
      },
      // 玫瑰图扩展
      pieExtend: {
        // legend: {
        //   orient: 'horizontal',
        //   left: 0,
        //   top: "bottom",
        //   width:'450',
        //   bottom: 0,
        //   itemGap: 5,
        //   itemWidth: 12,
        //   itemHeight: 12,
        //   textStyle: {
        //     color: "#666",
        //     fontSize: 12
        //   }
        // },
        legend: {
          top: 'bottom',
          itemGap: 20,
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            color: '#666',
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            let value = this.formatValue(params.value, '元');
            let percent = params.percent;
            let name = params.name;
            let str = name + '<br>' + value + '(' + percent + '%)';
            return str;
          }
        }
      },
      pieExtendThree: {
        legend: {
          x: 'center',
          orient: 'horizontal',
          y: 'bottom',
          left: 0,
          bottom: 0,
          itemGap: 15,
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            color: '#666',
            fontSize: 12
          }
        },
        labelLine: {
          normal: {
            length: 5,
            length2: 5
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            let name = params.name;
            let percent = params.value;
            let str = name + '<br>' + percent + '%';
            return str;
          }
        }
      },
      pieExtendPerson: {
        legend: {
          top: 'bottom',
          width: '350',
          bottom: 0,
          itemGap: 20,
          itemWidth: 12,
          itemHeight: 12,
          textStyle: {
            color: '#666',
            fontSize: 12
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => {
            let value = this.formatPerson(params.value, '人');
            let percent = params.percent;
            let name = params.name;
            let str = name + '<br>' + value + '(' + percent + '%)';
            return str;
          }
        },
        labelLine: {
          normal: {
            length: 5,
            length2: 5
          }
        }
        // radius:"90"

      },
      // 条形图
      barExtend: {
        legend: {
          show: false
        },
        barWidth: 10,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: (params) => {
            let value = this.formatValue(params[1].value * 1, '元');
            let name = params[0].value;
            let str = name + '<br>' + value;
            return str;
          }
        }
      },
      barExtendTwo: {
        legend: {
          show: false
        },
        barWidth: 10,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            if (Number(params[1].value)) {
              return params[0].value + '<br/> ' + params[1].value + '%';
            }
          }
        }
      }
    };
  },
  watch: {
    BoxKPIDataCine (val) {
      this.CurrentBoxKPIDataCine = val;
    },
    chartIncome: {
      handler: function (val, oldVal) {
        if (val.rows && val.rows.length > 0) {
          this.chartEmpty = false;
        } else {
          this.chartEmpty = true;
        }
      },
      deep: true
    }
  },
  filters: {
    woo (value, isPositive) {
      if (!value) return '--';
      return isPositive ? Math.abs(value).toFixed(2) : value.toFixed(2);
    },
    // 处理万元单位
    capitalizeOne (value) {
      if (!value) return '--';
      if (value < 10000) {
        return value.toFixed(2) < 10000 ? value.toFixed(2) : '1.00';
      } else if (value < 100000000) {
        return (value / 10000).toFixed(2) < 10000 ? (value / 10000).toFixed(2) : '1.00';
      } else {
        return (value / 100000000).toFixed(2);
      }
    },
    // 处理万元计算
    foo (value) {
      if (!value) return '';
      if (value < 10000) {
        return value.toFixed(2) < 10000 ? '元' : '万元';
      } else if (value < 100000000) {
        return (value / 10000).toFixed(2) < 10000 ? '万元' : '亿元';
      } else {
        return '亿元';
      }
    },
    // 处理万人计算保留两位小数
    capitalizePerson (value) {
      if (!value) return '--';
      if (value < 10000) {
        return value.toFixed(2) < 10000 ? value : '1.00';
      } else if (value < 100000000) {
        return (value / 10000).toFixed(2) < 10000 ? (value / 10000).toFixed(2) : '1.00';
      } else {
        return (value / 100000000).toFixed(2);
      }
    },
    // 处理万人单位计算
    too (value) {
      if (!value) return '';

      let newValue = value.toString();
      let too = '';

      if (newValue.length < 5) {
        too = '人';
        return too;
      }      else if (newValue.length >= 5 && newValue.length <= 8) {
        too = '万人';
        return too;
      }      else if (newValue.length >= 9) {
        too = '亿人';
        return too;
      }
    }
  },
  methods: {
    // 跳转票房详情 影院页面
    goDetail () {
      this.$router.push({
        path: '/analysis/cinema/boxOffice/total',
        query: {
          name: this.cityName,
          cinemaId: this.memberId,
          cityId: this.$route.query.cityId,
          startTime: this.startDate,
          endTime: this.endDate,
          dateType: this.timeType,
          dateTypeIndex: this.dateTypeIndex
        }
      });
    },
    formatValue (money, company) {
      let showNum = null;
      let num = money * 1;
      if (num < 10000) {
        showNum = `${num.toFixed(2)}${company}`;
      }
      if (num >= 10000 && num < 100000000) {
        showNum = `${(num / 10000).toFixed(2)}万${company}`;
      }
      if (num >= 100000000) {
        showNum = `${(num / 100000000).toFixed(2)}亿${company}`;
      }
      return showNum;
    },
    formatPerson (num, company) {
      let showNum;
      if (num < 10000) {
        let count = (num * 1).toFixed(0);
        showNum = `${count}${company}`;
      }
      if (num >= 10000 && num < 100000000) {
        showNum = `${(num / 10000).toFixed(2)}万${company}`;
      }
      if (num >= 100000000) {
        showNum = `${(num / 100000000).toFixed(2)}亿${company}`;
      }
      return showNum;
    },
    active () {
      this.cur = 0;
      this.currentPage = 1;
    },
    foo (val) {
      this.flag = val;
    },
    MeClick (val) {
      this.cur = val;
      if (val === '0') {
        if (this.BoxType) {
          // 调用票房首页指标数据
          this.getBoxOfficeTab('box_office');
        }
      }      else if (val === '1') {
        if (this.BoxType) {
          // 调用观影人次指标数据
          this.getBoxOfficeTab('audience_count');
        }
      }      else if (val === '2') {
        if (this.BoxType) {
          // 调用平均票价指标数据
          this.getBoxOfficeTab('avg_ticket_price');
        }
      }      else if (val === '3') {
        if (this.BoxType) {
          // 调用上座率票价指标数据
          this.getBoxOfficeTab('attendance_rate');
        }
      }      else if (val === '4') {
        if (this.BoxType) {
          // 调用市场份额指标数据
          this.getBoxOfficeTab('market_share');
        }
      }
    },
    // 切换接口
    getBoxOfficeTab (val) {
      this.BoxType = val;
      this.$camList.SwitchBoxOfficeTab({
        body: {
          startDate: this.startDate,
          endDate: this.endDate,
          dateType: this.timeType,
          columnType: this.BoxType,
          cityid: this.Boxcityid,
          cinemaId: this.BoxMemberId,
          initBoxOffice: this.BoxTotal
        }
      })
        .then(response => {
          let res = response.data;
          if (this.BoxType === 'box_office') {
            // 获取KPI
            if (res.boxOfficeKpiInfo) {
              this.CurrentBoxKPIDataCine = res.boxOfficeKpiInfo;
            }
          }          else if (this.BoxType === 'audience_count') {
            // 初始化观影人次玫瑰图数据
            this.getViewChart(res);
          }          else if (this.BoxType === 'avg_ticket_price') {
            // 初始化平均票价条形图
            this.getFareChart(res);
          }          else if (this.BoxType === 'attendance_rate') {
            // 初始化上座率条形图
            this.getChartRate(res);
          }          else if (this.BoxType === 'market_share') {
            // 选取周月年判断
            if (this.timeType !== 'day') {
              // console.log(2)
              // 是周月年时候隐藏KPI
              this.$nextTick(() => {
                this.KPI = false;
              });
            }            else {
              // 是天的时候获取KPI
              if (!res.marketKpiInfo || JSON.stringify(res.marketKpiInfo) == '{}') {
                this.$nextTick(() => {
                  this.KPI = false;
                });
              }              else {
                // 如果有KPI就赋值给BoxKPIDataShare
                this.BoxKPIDataShare = res.marketKpiInfo;
                // 显示KPI模块
                this.$nextTick(() => {
                  this.KPI = true;
                });
              }
            }
            // 初始化市场份额图表
            this.getShareChart(res);
          }
        });
    },
    // 票房-观影人次玫瑰图
    getViewChart (res) {
      let ChartsDataX = res.boxOfficeMovies ? res.boxOfficeMovies.xAxis || [] : [];
      let ChartsDataY = res.boxOfficeMovies ? res.boxOfficeMovies.yAxis || [] : [];
      // 获取饼状图数据
      if (ChartsDataX && ChartsDataY) {
        let foo = ChartsDataY.map(item => {
          return {
            name: item.movieName,
            '观影人次': item.audienceCount && item.audienceCount.toFixed(2) || 0
          };
        });
        this.ChartViewing.columns = ['name', '观影人次'];
        this.ChartViewing.rows = foo;
      }
    },
    // 票房-平均票价条形图
    getFareChart (res) {
      let ChartsDataX = res.boxOfficeMovies ? res.boxOfficeMovies.xAxis || [] : [];
      let ChartsDataY = res.boxOfficeMovies ? res.boxOfficeMovies.yAxis || [] : [];
      // 获取饼状图数据
      if (ChartsDataX && ChartsDataY) {
        let foo = ChartsDataY.map(item => {
          return {
            newName: (item.movieName && item.movieName.length) > 8 ? (item.movieName.substr(0, 8) + '...') : (item.movieName),
            name: item.movieName,
            '平均票价': item.avgBoxOffice && item.avgBoxOffice.toFixed(2) || 0
          };
        });
        this.ChartBarfare.columns = ['newName', 'name', '平均票价'];
        this.ChartBarfare.rows = foo;
      }
    },
    // 票房-上座率条形图
    getChartRate (res) {
      let ChartsDataX = res.boxOfficeMovies ? res.boxOfficeMovies.xAxis || [] : [];
      let ChartsDataY = res.boxOfficeMovies ? res.boxOfficeMovies.yAxis || [] : [];
      // 获取饼状图数据
      if (ChartsDataX && ChartsDataY) {
        let foo = ChartsDataY.map(item => {
          return {
            newName: item.movieName.length > 8 ? (item.movieName.substr(0, 8) + '...') : (item.movieName),
            name: item.movieName,
            '上座率': item.offerSeatPercent && item.offerSeatPercent.toFixed(2) || 0
          };
        });
        this.ChartRate.columns = ['newName', 'name', '上座率'];
        this.ChartRate.rows = foo;
      }
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row';
      } else if (rowIndex === 3) {
        return 'success-row';
      }
      return '';
    },
    // 市场份额
    getShareChart (res) {
      //    console.log(res,'ff')
      let ChartsDataX = res.boxOfficeMarket ? res.boxOfficeMarket.xAxis || [] : [];
      let ChartsDataY = res.boxOfficeMarket ? res.boxOfficeMarket.yAxis || [] : [];
      // 获取饼状图数据
      if (ChartsDataX && ChartsDataY) {
        // console.log(ChartsDataY,'ff')
        let foo = ChartsDataY.map(item => {
          return {
            name: item.cinemaName,
            '市场份额': item.competeCinemaPer && item.competeCinemaPer.toFixed(2) || 0
          };
        });

        this.ChartShare.columns = ['name', '市场份额'];
        this.ChartShare.rows = foo;
        //  console.log(this.ChartShare,'市场份额')
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.kip-wrap {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  .kip {
    width: 100%;
    height: auto;
  }
}
.BoxContainer {
  background: white;
  border-radius: 6px;
  .BoxOffice {
    width: 100%;
    height: 100%;
    background: white;
    border-radius: 6px;
    .BoxTitle {
      box-sizing: border-box;
      width: 100%;
      line-height: 40px;
      padding: 0 16px;
      .title {
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #333;
      }
      .iconfont {
        margin-right: 5px;
        color: #1296db;
        position: relative;
        top: -2px;
      }
      .icon-arrow {
        font-size: 10px;
        color: #3b74ff;
        position: relative;
        top: 0px;
      }
      .tip {
        font-size: 12px;
        color: #3b74ff;
        font-weight: normal;
        vertical-align: middle;
      }
    }
  }
  .right-col {
    height: 151px;
    position: relative;
    border-top: 1px solid #f5f5f5;
    border-bottom: 1px solid #f5f5f5;
    .listUl {
      padding: 0px;
      margin: 0px;
      padding-left: 43%;
      li.first-li {
        position: absolute;
        left: 0px;
        width: 43%;
        height: 151px;
        display: flex;
        justify-content: center;
        align-items: center;
        .cont {
          padding: 0px;
          h1 {
            margin: 0px;
            color: #333;
            font-size: 48px;
            text-align: center;
            display: block;
            margin-top: 13px;
            // font-weight:bold;
          }
          p {
            font-size: 12px;
            color: #333333;
            text-align: center;
          }
        }
      }
      li.active > .cont > p {
        color: #3b74ff;
      }
      li.active > .cont > h1 {
        color: #3b74ff;
      }
      li.active {
        background: #e8efff;
      }
      li.active div {
        color: #3b74ff;
      }
      li.active div > span {
        color: #3b74ff;
      }
      li {
        display: flex;
        justify-content: space-between;
        height: 37px;
        line-height: 37px;
        border-bottom: 1px solid #f3f3f3;
        div {
          font-size: 12px;
          color: #666666;
          padding: 0px 10px;
          span {
            // font-family: "Microsoft YaHei";
            font-size: 20px;
            color: black;
            letter-spacing: -1px;
            // font-weight: bold;
            margin-right: 3px;
          }
        }
        div.last {
          text-align: right;
        }
      }
    }
    i {
      position: absolute;
      right: 165px;
      bottom: 12px;
      color: #3b74ff;
      font-size: 12px;
    }
  }
}
//iconfont
.ModuleTitle .icon-danchuang-tishi {
  color: #3b74ff;
  font-size: 12px;
  margin-left: 10px;
  position: relative;
  top: -2px;
}
//Table表格设置
.CityModuleLayout {
  height: auto;
  background: none;
}
.ModuleTable {
  width: 93%;
  margin: 0 auto;
  .el-table {
    .el-table__row {
      td {
        padding: 0px;
        height: 35px;
        line-height: 35px;
      }
    }
  }
}
.ModuleTable {
  .el-table .warning-row {
    background: oldlace;
  }
  .el-table .success-row {
    background: #f0f9eb;
  }
}
.ModuleTable {
  .el-table__header-wrapper {
    .has-gutter {
      tr th {
        padding: 0px;
      }
    }
  }
}
.icon-shouye-piaofang {
  color: #0845f788 !important;
  font-size: 16px;
}
.reset-table .el-table th.is-leaf {
  padding: 0px;
}
.veRing {
  position: relative;
  top: -35px;
}
.icon-neiye-shangshengjiantou {
  color: #2dbc2d;
}
.icon-neiye-xiajiangjiantou {
  color: red;
}
.green {
  color: #2dbc2d;
}
.red {
  color: red;
}
#ulMain {
  width: 250px;
  list-style-type: none;
  padding: 0px;
  margin: 0px;
  li {
    line-height: 23px;
  }
}
@media screen and (max-width: 1500px) {
  .BoxContainer .right-col .listUl li.first-li .cont h1 {
    transform: scale(0.8);
  }
}
</style>