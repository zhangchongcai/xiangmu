<template>
  <div class="section">
    <div class="section-title">
      <i class="el-icon-arrow-up icon"></i>
      会员渠道及类型分布
    </div>
    <div class="section-select center">
      <target-label ref="labels" :activeType="type" :targetLabel="targetLabel" :otherLabel="otherLabel" @getType="changeType" class="target-label__fixed"></target-label>
    </div>
    <!-- 饼图 -->
    <div class="section-content flex" v-if="showPie">
      <div style="width:50%">
        <ve-ring :data-empty="channelDataEmpty" :title="channelTitle" :data="channelData" :settings="ringSettings" :extend="pieExtend" :colors="colors"></ve-ring>
      </div>
      <div style="width:50%">
        <ve-ring :data-empty="cardDataEmpty" :title="cardTitle" :data="cardData" :settings="ringSettings" :extend="ringExtend" :colors="colors"></ve-ring>
      </div>
    </div>
    <!-- 柱状图 -->
    <div class="section-content flex" v-else>
      <div style="width:50%">
        <ve-histogram :data-empty="channelDataEmpty" :title="channelTitle" :data="channelBarData" :extend="barExtend" :legend-visible="false">
        </ve-histogram>
      </div>
      <div style="width:50%">
        <ve-histogram :data-empty="cardDataEmpty" :title="cardTitle" :data="cardData" :extend="barExtend" :legend-visible="false">
        </ve-histogram>
      </div>
    </div>
  </div>
</template>
<script>
import TargetLabel from '../../partical/targetLabel';
import Global from '../../../util/global.js';
export default {
  components: { TargetLabel },
  props: {
    targetType: {
      type: String
    },
    allData: {},
    targetLabel: {
      type: Array
    },
    otherLabel: {
      type: Array
    }

  },
  data () {
    this.colors = ['#3B74FF', '#FE6081', '#FEC107', '#A5F053', '#FE825E', '#8E7EFF', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
    return {
      unitNum: 2,
      type: 'xzhy',
      showPie: true,
      type: this.targetType,
      channelDataEmpty: false,
      cardDataEmpty: false,
      channelTitle: {
        show: true,
        text: `会\n\n员\n\n渠\n\n道`,
        textStyle: {
          fontSize: 12,
          color: '#666'
        },
        top: '30%'
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
      cardTitle: {
        show: true,
        text: '会\n\n员\n\n类\n\n型',
        textStyle: {
          fontSize: 12,
          color: '#666'
        },
        top: '30%'
      },
      // 品类
      cardData: {
        columns: ['name', 'value'],
        rows: []
      },
      // 环图设置
      ringSettings: {
        roseType: 'radius'
      },
      // 环图扩展
      ringExtend: {
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
          formatter: (params) => {
            let value = this.formatNum(params.value, this.unitNum) + this.unit;
            let percent = params.percent;
            return percent + '%' + '（' + value + '）';
          }
        },
        grid: {
          left: '10%',
          right: '10%'
        },
        tooltip: {
          formatter: params => {
            let name = params.data.name;
            let value = this.formatNum(params.data.value, this.unitNum) + this.unit;
            let percent = params.percent;
            return `${params.marker}${name}<br>${percent}%（${value}）`;
          }
        }
      },
      // 饼图设置
      pieSettings: {},
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
          formatter: (params) => {
            let name = params.name;
            if (name == '线上' || name == '线下') {
              return name;
            } else {
              let value = this.formatNum(params.value, this.unitNum) + this.unit;
              let percent = params.percent;
              return percent + '%' + '（' + value + '）';
            }
          }
        },
        grid: {
          left: '8%',
          right: '8%'
        },
        tooltip: {
          formatter: params => {
            let name = params.data.name;
            let percent = params.percent;
            let value = this.formatNum(params.data.value, this.unitNum) + this.unit;
            return `${params.marker}${name}<br>${percent}%（${value}）`;
          }
        }
      },
      // 柱状图扩展
      barExtend: {
        barWidth: 10,
        color: '#3B74FF',
        tooltip: {
          formatter: params => {
            let marker = params[0].marker;
            let name = params[0].name;
            let value = this.formatNum(params[0].value, this.unitNum) + this.unit;
            let str = marker + name + '<br>' + value;
            return str;
          }
        },
        'xAxis.0.axisLabel.interval': 0,
        'xAxis.0.axisLabel.rotate': 45,
        grid: {
          left: '8%',
          right: '8%'
        }
      }
    };
  },
  computed: {
    unit () {
      let type = this.type;
      if (type) {
        if (Global.targetNum.includes(type)) {
          this.unitNum = 0;
        } else {
          this.unitNum = 2;
        }
        return Global.memberTargetUnitMap[type];
      } else {
        return '';
      }
    }
  },
  watch: {
    allData () {
      let type = 'xzhy';
      this.type = 'xzhy';
      let allData = this.allData;
      let cardObj = allData.card;
      let channelObj = allData.channel;
      if (cardObj[type] || channelObj[type]) {
        if (cardObj[type] && cardObj[type].length > 0) {
          this.cardDataEmpty = false;
          this.cardTitle.text = '会\n\n员\n\n类\n\n型';
          this.$set(this.cardData, 'rows', cardObj[type]);
        } else {
          this.cardDataEmpty = true;
          this.cardTitle.text = null;
          this.$set(this.cardData, 'rows', []);
        }
        if (channelObj[type] && Object.keys(channelObj[type]).length > 0) {
          let resData = JSON.parse(JSON.stringify(channelObj[type]));
          let lineData = resData.line;
          let unline = resData.unLine;
          let channelData = [...unline];
          this.channelSettings.level[1] = unline.map(item => {
            return item.name;
          });
          this.channelTitle.text = '会\n\n员\n\n渠\n\n道';
          this.channelDataEmpty = false;
          this.$set(this.channelData, 'rows', channelData);
          this.$set(this.channelBarData, 'rows', unline);
        } else {
          this.channelTitle.text = null;
          this.channelDataEmpty = true;
          this.$set(this.channelData, 'rows', []);
          this.$set(this.channelBarData, 'rows', []);
        }
      } else {
        this.cardDataEmpty = true;
        this.cardTitle.text = null;
        this.channelTitle.text = null;
        this.channelDataEmpty = true;
        this.$set(this.cardData, 'rows', []);
        this.$set(this.channelData, 'rows', []);
        this.$set(this.channelBarData, 'rows', []);
      }
    }
  },
  methods: {
    changeType (id) {
      this.type = id;
      let allData = this.allData;
      let cardData = this.cardData;
      let channelData = this.channelData;
      let lineCode = ['hykdj', 'hyrjgx', 'hyxfzb', 'myxhyzb'];
      if (lineCode.includes(id)) {
        this.showPie = false;
      } else {
        this.showPie = true;
      }
      if (allData.card[this.type] && allData.card[this.type].length > 0) {
        this.cardDataEmpty = false;
        this.cardTitle.text = '会\n\n员\n\n类\n\n型';
        cardData.rows = allData.card[this.type];
      } else {
        this.cardDataEmpty = true;
        this.cardTitle.text = null;
        cardData.rows = [];
      }
      if (allData.channel[this.type] && Object.keys(allData.channel[this.type]).length > 0) {
        let resData = JSON.parse(JSON.stringify(allData.channel[this.type]));
        let lineData = resData.line;
        let unline = resData.unLine;
        let channelData = [...unline];
        // let channelData = [...lineData,...unline];
        this.channelSettings.level[1] = unline.map(item => {
          return item.name;
        });
        this.channelDataEmpty = false;
        this.channelTitle.text = '会\n\n员\n\n渠\n\n道';
        this.$set(this.channelData, 'rows', channelData);
        this.$set(this.channelBarData, 'rows', unline);
      } else {
        this.channelDataEmpty = true;
        this.channelTitle.text = null;
        this.$set(this.channelData, 'rows', []);
        this.$set(this.channelBarData, 'rows', []);
      }
    },
    formatNum (num) {
      return Global.formatNum(num);
    }
  }
};
</script>