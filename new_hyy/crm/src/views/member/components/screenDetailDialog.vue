<template>
  <ul class="_screen-detail-dialog">
    <li v-for="(item, index) of newScreenData" :key="index" class="_screen-detail-item">
      <i class="iconfont icon-danchuang-queren"></i>{{item}}
    </li>
  </ul>
</template>
<script>
export default {
  name: 'screenDetailDialog',
  data () {
    return {
      newScreenData: ['包含手机号']
    };
  },
  mounted () {
    this.formatScreenData();
  },
  methods: {
    formatScreenData () {
      var fomatUnit = u => {
        if (u == 'day') {
          return '天';
        } else if (u == 'month') {
          return '月';
        }
      };
      if (this.screenData == null || this.screenData.length == 0) {
        return false;
      } else {
        let data = JSON.parse(JSON.stringify(this.screenData));
        this.newScreenData = data.map(item => {
          if (item.lableType == 'mobileNum') {
            return '包含手机号';
          }
          if (item.lableType == 'birthday') {
            return (
              '生日：' +
              item.conditionDetail[0].startTime +
              '至' +
              item.conditionDetail[0].endTime
            );
          }
          if (item.lableType == 'cinema') {
            let labelStr = '消费影院：';
            let nameStr = item.conditionDetail
              .map(item => {
                return item.desc;
              })
              .join('、 ');
            if (item.conditionType == 'lastOneTime') {
              labelStr = '最后一次消费影院：';
            } else if (item.conditionType == 'anyOneTime') {
              labelStr = '任意一次消费影院：';
            }
            return labelStr + nameStr;
          }
          if (item.lableType == 'cardType') {
            let cardTypeStr = item.conditionDetail
              .map(item => {
                return item.desc;
              })
              .join('、 ');
            return '会员卡类型：' + cardTypeStr;
          }
          if (item.lableType == 'openDate') {
            if (item.conditionType == 'fixTime') {
              return (
                '开卡时间：' +
                item.conditionDetail[0].startTime +
                '至' +
                item.conditionDetail[0].endTime
              );
            } else if (item.conditionType == 'relativeTime') {
              return (
                '开卡时间：最近' +
                item.conditionDetail[0].relativeValue +
                fomatUnit(item.unit) +
                '开卡'
              );
            }
          }
          if (item.lableType == 'endTime') {
            if (item.conditionType == 'fixTime') {
              return (
                '卡到期时间：' +
                item.conditionDetail[0].startTime +
                '至' +
                item.conditionDetail[0].endTime
              );
            } else if (item.conditionType == 'relativeTime') {
              return (
                '卡到期时间：最近' +
                item.conditionDetail[0].relativeValue +
                fomatUnit(item.unit) +
                '到期'
              );
            }
          }
          if (item.lableType == 'totalBalance') {
            return (
              '储值余额：' +
              item.conditionDetail[0].downValue +
              '至' +
              item.conditionDetail[0].upValue +
              '元'
            );
          }
          if (item.lableType == 'couponName') {
            let nameStr = item.conditionDetail
              .map(item => {
                return item.desc;
              })
              .join('、 ');
            return '可用券名称：' + nameStr;
          }
          if (item.lableType == 'channel') {
            let channelStr = item.conditionDetail
              .map(item => {
                return item.desc;
              })
              .join('、 ');
            return '消费渠道：' + channelStr;
          }
          if (item.lableType == 'consumeTimes') {
            if (item.conditionType == 'anyTime') {
              return (
                '消费次数：' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '次'
              );
            } else if (item.conditionType == 'fixTime') {
              return (
                '消费次数：' +
                item.conditionDetail[0].startTime +
                '至' +
                item.conditionDetail[0].endTime +
                '累计消费' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '次'
              );
            } else if (item.conditionType == 'relativeTime') {
              return (
                '消费次数：最近' +
                item.conditionDetail[0].relativeValue +
                fomatUnit(item.unit) +
                '内累计消费' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '次'
              );
            }
          }
          if (item.lableType == 'chargeTimes') {
            if (item.conditionType == 'anyTime') {
              return (
                '充值次数：' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '次'
              );
            } else if (item.conditionType == 'fixTime') {
              return (
                '充值次数：' +
                item.conditionDetail[0].startTime +
                '至' +
                item.conditionDetail[0].endTime +
                '累计充值' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '次'
              );
            } else if (item.conditionType == 'relativeTime') {
              return (
                '充值次数：最近' +
                item.conditionDetail[0].relativeValue +
                fomatUnit(item.unit) +
                '内累计充值' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '次'
              );
            }
          }
          if (item.lableType == 'totalConsumeAmount') {
            if (item.conditionType == 'anyTime') {
              return (
                '累计消费金额：' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '元'
              );
            } else if (item.conditionType == 'fixTime') {
              return (
                '累计消费金额：' +
                item.conditionDetail[0].startTime +
                '至' +
                item.conditionDetail[0].endTime +
                '累计消费' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '元'
              );
            } else if (item.conditionType == 'relativeTime') {
              return (
                '累计消费金额：最近' +
                item.conditionDetail[0].relativeValue +
                fomatUnit(item.unit) +
                '内累计消费' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '元'
              );
            }
          }
          if (item.lableType == 'totalChargeAmount') {
            if (item.conditionType == 'anyTime') {
              return (
                '累计充值金额：' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '元'
              );
            } else if (item.conditionType == 'fixTime') {
              return (
                '累计充值金额：' +
                item.conditionDetail[0].startTime +
                '至' +
                item.conditionDetail[0].endTime +
                '累计消费' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '元'
              );
            } else if (item.conditionType == 'relativeTime') {
              return (
                '累计充值金额：最近' +
                item.conditionDetail[0].relativeValue +
                fomatUnit(item.unit) +
                '内累计充值' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '元'
              );
            }
          }
          if (item.lableType == 'movieConsumeTimes') {
            if (item.conditionType == 'anyTime') {
              return (
                '影票消费次数：' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '次'
              );
            } else if (item.conditionType == 'fixTime') {
              return (
                '影票消费次数：' +
                item.conditionDetail[0].startTime +
                '至' +
                item.conditionDetail[0].endTime +
                '累计充值' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '次'
              );
            } else if (item.conditionType == 'relativeTime') {
              return (
                '影票消费次数：最近' +
                item.conditionDetail[0].relativeValue +
                fomatUnit(item.unit) +
                '内影票消费' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '次'
              );
            }
          }
          if (item.lableType == 'movieConsumeAmount') {
            if (item.conditionType == 'anyTime') {
              return (
                '影票消费金额：' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '元'
              );
            } else if (item.conditionType == 'fixTime') {
              return (
                '影票消费金额：' +
                item.conditionDetail[0].startTime +
                '至' +
                item.conditionDetail[0].endTime +
                '累计消费' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '元'
              );
            } else if (item.conditionType == 'relativeTime') {
              return (
                '影票消费金额：最近' +
                item.conditionDetail[0].relativeValue +
                fomatUnit(item.unit) +
                '内影票消费' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '元'
              );
            }
          }
          if (item.lableType == 'shopConsumeTimes') {
            if (item.conditionType == 'anyTime') {
              return (
                '卖品消费次数：' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '次'
              );
            } else if (item.conditionType == 'fixTime') {
              return (
                '卖品消费次数：' +
                item.conditionDetail[0].startTime +
                '至' +
                item.conditionDetail[0].endTime +
                '累计充值' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '次'
              );
            } else if (item.conditionType == 'relativeTime') {
              return (
                '卖品消费次数：最近' +
                item.conditionDetail[0].relativeValue +
                fomatUnit(item.unit) +
                '内卖品消费' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '次'
              );
            }
          }
          if (item.lableType == 'shopConsumeAmount') {
            if (item.conditionType == 'anyTime') {
              return (
                '卖品消费金额：' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '元'
              );
            } else if (item.conditionType == 'fixTime') {
              return (
                '卖品消费金额：' +
                item.conditionDetail[0].startTime +
                '至' +
                item.conditionDetail[0].endTime +
                '累计消费' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '元'
              );
            } else if (item.conditionType == 'relativeTime') {
              return (
                '卖品消费金额：最近' +
                item.conditionDetail[0].relativeValue +
                fomatUnit(item.unit) +
                '内卖品消费' +
                item.conditionDetail[0].downValue +
                '至' +
                item.conditionDetail[0].upValue +
                '元'
              );
            }
          }
          if (item.lableType == 'lastConsume') {
            return (
              '距上次消费天数：' +
              item.conditionDetail[0].downValue +
              '至' +
              item.conditionDetail[0].upValue +
              '天'
            );
          }
        });
      }
    }
  },
  props: {
    screenData: {
      type: Array,
      default: () => [],
      required: false
    }
  },
  watch: {
    screenData: {
      handler (newName, oldName) {
        this.formatScreenData();
      }
    },
    deep: true,
    immediate: true
  }
};
</script>
<style lang="scss">
._screen-detail-dialog {
  min-height: 200px;
  padding: 10px 30px 0;
  ._screen-detail-item {
    padding: 4px 20px 4px 0;
    line-height: 1.5;
    font-size: 12px;
    color: #666;
    width: 500px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    .icon-danchuang-queren {
      font-size: 12px;
      margin-right: 5px;
      color: #2dbc2d;
      position: relative;
      top: -2px;
    }
  }
}
</style>