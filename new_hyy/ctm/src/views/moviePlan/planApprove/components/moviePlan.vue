<template>
  <section class="plan-window">

    <div class="plan-tool-left" v-show="showAdvice || showBan">
      <!-- 排片指导 -->
      <planAdvice ref="planAdvice" v-show="showAdvice" :showAdvice="showAdvice" :adviceData="adviceData" @closeLeftTool="closeLeftTool" :style="{height: !showBan && showAdvice ? '100%' : '40%'}"></planAdvice>
      <div class="line" style="margin: 0px auto" v-if="showBan && showAdvice"></div>
      <!-- 排片参考 -->
      <filmBan ref="filmBan" v-show="showBan" :showBan="showBan" :banData="banData" @closeLeftTool="closeLeftTool" :style="{height: showBan && !showAdvice ? '100%' : '60%'}"></filmBan>
    </div>

    <div class="suspend-ban" @click="showFlimBan" v-show="!showBan">
      <div class="plan-single-menu">
        <i class="iconfont icon-neiye-paipiancankao plan-tool-icon"></i>
        <p class="plan-menu-name">排片参考</p>
      </div>
    </div>

    <div class="window_1" :style="{width: showBan || showAdvice ? 'calc(100% - 183px)' : '100%'}">
      <div class="window_2">
        <!-- 影厅库 -->
        <filmRoom ref="filmRoom" :scrollY="scroll.y" :rooms="rooms" :contentSize="contentSize"></filmRoom>
        <div class="window_3">
          <!-- 刻度尺 -->
          <filmScale ref="filmScale" @saveChangeScale="saveChangeScale" :showSetting="showBan" :scrollX="scroll.x" :scaleConfig="scaleConfig" :width="windowWidth - filmScale_deleteWidth"></filmScale>
          <!-- 放映计划 -->
          <filmPlan ref="filmPlan" @cantEdition="cantEdition" :pageControlType="pageControlType" @setMindData="setMindData" @scroll="moviePlanScorll" @cleanMovie="cleanMovie" :width="windowWidth - filmPlan_deleteWidth" :rooms="rooms" :contentSize="contentSize" :selectMovieData="selectMovieData" :baseParam="baseParam" :plan_list="plan_list" :scaleConfig="scaleConfig" @copyMovie="selectMovie" :mode="mode" @initPlanAdvice="initPlanAdvice"></filmPlan>
        </div>
      </div>
      <!-- 标注 -->
      <filmTips ref="filmTips" :width="windowWidth - filmTips_deleteWidth" :filmTips="filmTips"></filmTips>
    </div>

  </section>
</template>

<script>
import filmBan from '../../planEdit/filmBan';
import filmRoom from './filmRoom';
import filmScale from './filmScale';
import filmPlan from './filmPlan';
import filmTips from './filmTips';
import planAdvice from '../../planEdit/planAdvice';
import { getRefTip, getgoldTimeSet, getPlanAdvice, getPlanRoomData } from 'ctmSrc/http/interface';
import { baseInterface } from "base";
const { holList } = baseInterface;

export default {
  components: {
    filmBan,
    filmRoom,
    filmScale,
    filmPlan,
    filmTips,
    planAdvice
  },
  props: {
    baseParam: {
      type: Object
    },
    pageControlType: {
      type: Boolean,
      default: true
    },
    mode: {
      type: Number,
      default: 1
    }
  },
  watch: {
    baseParam (data, old_data) {
      this.initMoviePlan();
    },
    initFlag (data, oData) {
      if (data.movie && data.plan && data.hall) {
        let seatCount = this.hallData.reduce((count, item) => item.seatnum + count, 0), roomData = [];
        this.hallData.forEach((item, i) => {
          // status 有效 或者 无效但有排片纪录
          if (item.status == 1 || this.planOriData.some(plan => plan.hallUid == item.uid)) {
            console.log();
            item.seat_count ? seatCount += item.seatNum : seatCount += 0;
            roomData.push({
              add_fee_amount: item.amount,
              add_fee_percentage: item.percentage,
              add_fee_type: item.addFeeType,
              hall_code: item.code,
              hall_name: item.name,
              hall_type: item.type,
              hall_type_code: item.code,
              is_on_add_fee: item.isOnAddFee,
              seat_count: item.seatnum,
              uid_hall: item.uid,
              personTime: item.personTime,
              occupancy: item.occupancy,
              tolatMoney: item.tolatMoney,
              status: item.status
            });
          }
        });
        this.filmTips = {
          seatCount,
          roomNum: roomData.length
        };
        console.log(roomData, 'roomData');
        this.rooms = roomData;

        this.contentSize['height'] = this.rooms.length * this.contentSize.roomItemHeight;
        // 排片数据处理
        let planData = this.rooms.map(item => []);
        this.planOriData.forEach((item, i) => {
          item.disversion = item.disVersionName || '';
          item.language = item.languageName || '';
          if (item.joinFlag) item.movieName = item.joinMovieName;
          this.films.some(film => {
            if (film.movieCode == item.movieCode) {
              item.color = film.color;

              return true;
            }
          });
          if (this.films.every(film => film.movieCode != item.movieCode)) {
            item.color = this.colorBox[0];
          }
          this.rooms.forEach((room, index) => {
            if (room.uid_hall == item.hallUid) {
              planData[index].push(item);
            }
          });
        });

        this.plan_list = {
          data: planData
        };
        this.initFlag = {
          movie: false,
          plan: false,
          hall: false
        };
        // 获取当前影院的 黄金时段设置
        getgoldTimeSet({ cinemaUid: this.baseParam.uidCinema }).then(res => {
          if (res.code != 200) return this.error(res.msg);
          if (res.code == 200 && res.data) {
            this.consultCinemaCode = res.data.consultCinemaCode || '00000000';
            holList({
              pageNum: 1,
              pageSize: 300,
              year: new Date(this.baseParam.planDate).getFullYear()
            }).then(ret => {
              if (ret.code === 200 && ret.data) {
                let holDay = ret.data.rows.filter(item => item.isOpen && !item.type);
                if (holDay.some(day => new Date(day.startTime) <= new Date(this.baseParam.planDate).getTime() && new Date(day.endtTime).getTime() >= new Date(this.baseParam.planDate).getTime())) {
                  this.goldTimeStart = `${this.baseParam.planDate} ${res.data.holidayStart}:00`;
                  this.goldTimeEnd = `${this.baseParam.planDate} ${res.data.holidayEnd}:00`;
                } else if (new Date(this.baseParam.planDate).getDay() > 4) {
                  this.goldTimeStart = `${this.baseParam.planDate} ${res.data.weekendStart}:00`;
                  this.goldTimeEnd = `${this.baseParam.planDate} ${res.data.weekendEnd}:00`;
                } else if (new Date(this.baseParam.planDate).getDay() == 4) {
                  this.goldTimeStart = `${this.baseParam.planDate} ${res.data.fridayStart}:00`;
                  this.goldTimeEnd = `${this.baseParam.planDate} ${res.data.fridayEnd}:00`;
                } else {
                  this.goldTimeStart = `${this.baseParam.planDate} ${res.data.workingDayStart}:00`;
                  this.goldTimeEnd = `${this.baseParam.planDate} ${res.data.workingDayEnd}:00`;
                }
                this.getReference();
              } else {
                this.error(ret.msg);
              }
            });
          }
        });
      }
    }
  },
  data () {
    return {

      /* uidCinema */
      // baseParam: {
      //     uidCinema: 'a405489f-adcc-42cd-b2ee-6789693aa481',
      //     planDate: '2019-01-16'
      // },

      windowWidth: 0,
      scroll: {
        x: 0,
        y: 0
      },
      /* 影厅列表数据 */
      rooms: [],

      /* 影片库数据 */
      films: [],
      /* 排片参考 - 我的数据 */
      banData: {
        consultData: [],
        myData: [],
        loadFlag: false
      },
      adviceData: [],

      /* 刻度尺 - 传入排片 */
      scaleConfig: {
        dragPrecision: 1,
        timeInterval: 1
      },
      /* 标注信息 */
      filmTips: {
        seatCount: 0,
        roomNum: 0
      },
      filmLibary_deleteWidth: null,
      filmPlan_deleteWidth: null,
      filmScale_deleteWidth: null,
      filmTips_deleteWidth: null,
      deleteCofig: {
        // ban: {
        //     width: 154,
        //     margin_right: 4,
        //     can_delete_type: 'filmPlan,filmScale,filmLibary,filmTips',
        //     musthType: 'show'
        // },
        filmRoom: {
          width: 128,
          can_delete_type: 'filmPlan,filmScale'
        },
        changeScale: {
          width: 32,
          can_delete_type: 'filmPlan,filmScale,filmTips'
        }
        // menuBar: {
        //     width: 136,
        //     padding: 24,
        //     can_delete_type: 'filmPlan,filmScale,filmLibary,filmTips',
        // }
      },
      /* 排片画布 */
      contentSize: {
        width: null,
        height: null,
        roomItemHeight: null
      },
      /* 已选电影 */
      selectMovieData: {
        isSelect: false
      },
      /* 色值范围 */
      colorBox: [
        '#FF1E78',
        '#619BFF',
        '#C191E8',
        '#FBA07C',
        '#35C635',
        '#FFF300',
        '#4CDEF6',
        '#F74701',
        '#C59300',
        '#FF6CD8',
        '#7CFBD8',
        '#B63BC4',
        '#01E5AA',
        '#3AA8FF',
        '#D53A92',
        '#0085C5',
        '#1D03FF',
        '#CA2121',
        '#7FBB34',
        '#40ADBF'
      ],
      /* 排片数据 */
      plan_list: {},
      //
      showBan: true,
      showAdvice: true,

      roomIndexObj: {},
      movie_obj: {},

      initFlag: {
        movie: false,
        plan: false,
        hall: false
      },
      planOriData: [],
      turnPageParamType: null,
      hallData: []

    };
  },
  mounted () {
    this.windowWidth = document.querySelector('.audit-content').offsetWidth;
    this.filmPlan_deleteWidth = this.deleteWidth('filmPlan', 'show');
    this.filmLibary_deleteWidth = this.deleteWidth('filmLibary', 'show');
    this.filmScale_deleteWidth = this.deleteWidth('filmScale', 'show');
    this.filmTips_deleteWidth = this.deleteWidth('filmTips', 'show');
    this.contentSize = {
      width: 1560,
      height: this.$refs.filmRoom.$el.children[1].offsetHeight,
      roomItemHeight: 80
    };

    // 排片参考 等后台有数据接口时使用
    // this.banData.filmsBan = filmsBan.sort(this.sort("planNum", "down"))
  },
  created () { },
  methods: {

    // 初始化排片指导数据
    /**
     *  @planData 排片数据连接的一维数组(不包括连排)
     */
    initPlanAdviceOld (planData) {
      getPlanAdvice({
        cinemaUid: this.baseParam.uidCinema,
        planDate: this.baseParam.planDate
      }).then(res => {
        if (res.code != 200) return this.error(res.msg);
        let originData = res.data;
        originData.forEach(item => {
          item.myNum = 0;
          item.myPer = 0;
        });
        originData.forEach(item => {
          if (item.timeNumLower == null || item.timeNumUpper == null || (!item.timeNumLower && !item.timeNumUpper)) {
            item.numNoCheck = true;
          }
          if (item.timeRatioLower == null || item.timeRatioUpper == null || (!item.timeRatioLower && !item.timeRatioUpper)) {
            item.rangeNoCheck = true;
          }
          let myNum = planData.reduce((data, plan) => {
            // 判断影片是否连排
              if (!plan.joinFlag) {
              return plan.movieCode == item.movieCode ? data + 1 : data;
            } else {
              return data + plan.planTimeVoList.reduce((cData, citem) => {
                return citem.movieCode == item.movieCode ? cData + 1 : cData;
              }, 0);
            }
            }, 0),
            allPlansNum = planData.reduce((data, plan) => {
              return !plan.joinFlag ? data + 1 : data + plan.planTimeVoList.length;
            }, 0),
            myPer = allPlansNum ? (myNum / allPlansNum * 100).toFixed(2) : '0.00';
          item.myNum = myNum || 0;
          item.myPer = myPer || '0.00';
          item.isAdvice = true;
        });
        let needSortOriginData = originData.filter(item => !item.rangeNoCheck);
        needSortOriginData.sort((a, b) => b.timeRatioLower - a.timeRatioLower);
        let noNeedSortOriginData = originData.filter(item => item.rangeNoCheck);
        originData = needSortOriginData.concat(noNeedSortOriginData);

        let noAdviceData = planData.filter(plan => originData.every(item => item.movieCode != plan.movieCode) && !plan.joinFlag);
        let concatData = [];
        noAdviceData.forEach(plan => {
          if (concatData.every(item => item.movieCode != plan.movieCode)) {
            concatData.push({
              isAdvice: false,
              movieName: plan.movieName,
              movieCode: plan.movieCode
            });
          }
        });
        concatData.forEach(item => {
          let myNum = planData.reduce((data, plan) => {
            // 判断影片是否连排
              if (!plan.joinFlag) {
              return plan.movieCode == item.movieCode ? data + 1 : data;
            } else {
              return data + plan.planTimeVoList.reduce((cData, citem) => {
                return citem.movieCode == item.movieCode ? cData + 1 : cData;
              }, 0);
            }
            }, 0),
            allPlansNum = planData.reduce((data, plan) => {
              return !plan.joinFlag ? data + 1 : data + plan.planTimeVoList.length;
            }, 0),
            myPer = allPlansNum ? (myNum / allPlansNum * 100).toFixed(2) : '0.00';

          item.myNum = myNum || 0;
          item.myPer = myPer || '0.00';
        });
        concatData.sort((a, b) => b.myPer - a.myPer);

        this.checkUpAdvice(originData);
        this.adviceData = originData.concat(concatData);
        this.adviceData.forEach(item => {
          this.films.some(film => {
            if (film.movieCode == item.movieCode) {
              item.color = film.color;
              item.disVersion = film.disversion || '';
              return true;
            }
          });
          if (!item.color) item.color = this.colorBox[0];
        });
      });
    },

    // 初始化排片指导数据
    initPlanAdvice (planData) {
      getPlanAdvice({
        cinemaUid: this.baseParam.uidCinema,
        planDate: this.baseParam.planDate
      }).then(res => {
        if (res.code != 200) return this.error(res.msg);
        if (res.code == 200) {
          // debugger
          let originData = JSON.parse(JSON.stringify(res.data));
          originData.forEach(item => {
            item.myNum = 0;
            item.myPer = 0;
          });
          // 计算出 当前排片场次和占比
          originData.forEach(item => {
            item.goldTimeCheck = item.movieDetailVoList.some(hall => hall.detailType == 'h');
            if (item.movieDetailVoList.find(hall => hall.detailType != 'h')) {
              item.rangeNoCheck = item.movieDetailVoList.find(hall => hall.detailType != 'h').numberOrRatio == 1;
              item.numNoCheck = item.movieDetailVoList.find(hall => hall.detailType != 'h').numberOrRatio == 0;
            }
            item.goldNocheck = !item.movieDetailVoList.find(hall => hall.detailType == 'h');

            let myNum = item.movieInfoVoList.reduce((count, movie) => {
              let everyCount = planData.reduce((data, plan) => {
                // 判断影片是否连排
                if (!plan.joinFlag) {
                  return movie.movieCodeList.find(singleMoive => singleMoive.movieCode == plan.movieCode) ? data + 1 : data;
                } else {
                  return data + plan.planTimeVoList.reduce((cData, citem) => {
                    return movie.movieCodeList.find(singleMoive => singleMoive.movieCode == citem.movieCode) ? cData + 1 : cData;
                  }, 0);
                }
              }, 0);
              return count + everyCount;
            }, 0);

            let allPlansNum = planData.reduce((data, plan) => {
                return !plan.joinFlag ? data + 1 : data + plan.planTimeVoList.length;
              }, 0),
              myPer = allPlansNum ? (myNum / allPlansNum * 100).toFixed(2) : '0.00';
            item.allPlansNum = allPlansNum;
            console.log(item);
            item.myNum = myNum || 0;
            item.myPer = myPer || '0.00';
            item.isAdvice = true;
            if (this.goldTimeStart && this.goldTimeEnd) {
              let goldTimeStart = new Date(this.goldTimeStart).getTime(), goldTimeEnd = new Date(this.goldTimeEnd).getTime();
              let goldTotal = planData.reduce((data, film) => {
                if (!film.joinFlag) {
                  let startTime = film.startTime.hours < 6
                    ? new Date(`${this.baseParam.planDate} ${film.startTime.hours}:${film.startTime.minute}`).getTime() + 24 * 60 * 60 * 1000
                    : new Date(`${this.baseParam.planDate} ${film.startTime.hours}:${film.startTime.minute}`).getTime();
                  let endTime = film.endTime.hours < 6
                    ? new Date(`${this.baseParam.planDate} ${film.endTime.hours}:${film.endTime.minute}`).getTime() + 24 * 60 * 60 * 1000
                    : new Date(`${this.baseParam.planDate} ${film.endTime.hours}:${film.endTime.minute}`).getTime();
                  return startTime >= goldTimeStart && startTime <= goldTimeEnd ? data + 1 : data + 0;
                } else {
                  return data + film.planTimeVoList.reduce((cData, citem) => {
                    let startTime = new Date(citem.planTimeStart).getTime(),
                      endTime = new Date(citem.planTimeEnd).getTime();
                    return startTime >= goldTimeStart && startTime <= goldTimeEnd ? cData + 1 : cData + 0;
                  }, 0);
                }
              }, 0);

              item.goldNum = planData.reduce((data, film) => {
                if (!film.joinFlag) {
                  if (item.movieInfoVoList.find(citem => citem.cmcBaseMovieId == film.cmcBaseMovieId)) {
                    let startTime = film.startTime.hours < 6
                      ? new Date(`${this.baseParam.planDate} ${film.startTime.hours}:${film.startTime.minute}`).getTime() + 24 * 60 * 60 * 1000
                      : new Date(`${this.baseParam.planDate} ${film.startTime.hours}:${film.startTime.minute}`).getTime();
                    let endTime = film.endTime.hours < 6
                      ? new Date(`${this.baseParam.planDate} ${film.endTime.hours}:${film.endTime.minute}`).getTime() + 24 * 60 * 60 * 1000
                      : new Date(`${this.baseParam.planDate} ${film.endTime.hours}:${film.endTime.minute}`).getTime();

                    return startTime >= goldTimeStart && startTime <= goldTimeEnd ? data += 1 : data += 0;
                  } else {
                    return data += 0;
                  }
                } else {
                  return data + film.planTimeVoList.reduce((cData, citem) => {
                    if (item.movieInfoVoList.find(movie => movie.cmcBaseMovieId == citem.cmcBaseMovieId)) {
                      let startTime = new Date(citem.planTimeStart).getTime(), endTime = new Date(citem.planTimeEnd).getTime();
                      return startTime >= goldTimeStart && startTime <= goldTimeEnd ? cData + 1 : cData + 0;
                    } else {
                      return cData + 0;
                    }
                  }, 0);
                }
              }, 0);
              item.goldPer = (item.goldScene / goldTotal * 100) ? (item.goldScene / goldTotal * 100).toFixed(2) : '0.00';
            }
          });

          let needSortOriginData = originData.filter(item => !item.rangeNoCheck);
          needSortOriginData.sort((a, b) => b.movieDetailVoList.find(item => item.detailType != 'h').timeRatioLower - a.movieDetailVoList.find(item => item.detailType != 'h').timeRatioLower);
          let noNeedSortOriginData = originData.filter(item => item.rangeNoCheck);
          originData = needSortOriginData.concat(noNeedSortOriginData);

          let noAdviceData = planData.filter(plan => originData.every(item => !item.movieInfoVoList.some(citem => citem.movieCodeList.find(singleMovie => singleMovie.movieCode == plan.movieCode))) && !plan.joinFlag);
          let concatData = [];
          noAdviceData.forEach(plan => {
            if (concatData.every(item => !item.movieInfoVoList.some(citem => citem.movieCodeList.find(singleMovie => singleMovie.movieCode == plan.movieCode)))) {
              concatData.push({
                isAdvice: false,
                movieInfoVoList: [
                  {
                    movieCodeList: [{
                      movieCode: plan.movieCode
                    }],
                    movieName: plan.movieName
                  }
                ]

              });
            }
          });

          concatData.forEach(item => {
            let myNum = item.movieInfoVoList.reduce((count, movie) => {
              let everyCount = planData.reduce((data, plan) => {
                // 判断影片是否连排
                if (!plan.joinFlag) {
                  return movie.movieCodeList.find(singleMoive => singleMoive.movieCode == plan.movieCode) ? data + 1 : data;
                } else {
                  return data + plan.planTimeVoList.reduce((cData, citem) => {
                    return movie.movieCodeList.find(singleMoive => singleMoive.movieCode == citem.movieCode) ? cData + 1 : cData;
                  }, 0);
                }
              }, 0);
              return count + everyCount;
            }, 0);

            let allPlansNum = planData.reduce((data, plan) => {
                return !plan.joinFlag ? data + 1 : data + plan.planTimeVoList.length;
              }, 0),

              myPer = allPlansNum ? (myNum / allPlansNum * 100).toFixed(2) : '0.00';
            item.myNum = myNum || 0;
            item.myPer = myPer || '0.00';
            if (this.goldTimeStart && this.goldTimeEnd) {
              let goldTimeStart = new Date(this.goldTimeStart).getTime(), goldTimeEnd = new Date(this.goldTimeEnd).getTime();
              let goldTotal = planData.reduce((data, film) => {
                if (!film.joinFlag) {
                  let startTime = film.startTime.hours < 6
                    ? new Date(`${this.baseParam.planDate} ${film.startTime.hours}:${film.startTime.minute}`).getTime() + 24 * 60 * 60 * 1000
                    : new Date(`${this.baseParam.planDate} ${film.startTime.hours}:${film.startTime.minute}`).getTime();
                  let endTime = film.endTime.hours < 6
                    ? new Date(`${this.baseParam.planDate} ${film.endTime.hours}:${film.endTime.minute}`).getTime() + 24 * 60 * 60 * 1000
                    : new Date(`${this.baseParam.planDate} ${film.endTime.hours}:${film.endTime.minute}`).getTime();
                  return startTime >= goldTimeStart && startTime <= goldTimeEnd ? data + 1 : data + 0;
                } else {
                  return data + film.planTimeVoList.reduce((cData, citem) => {
                    let startTime = new Date(citem.planTimeStart).getTime(),
                      endTime = new Date(citem.planTimeEnd).getTime();
                    return startTime >= goldTimeStart && startTime <= goldTimeEnd ? cData + 1 : cData + 0;
                  }, 0);
                }
              }, 0);

              item.goldNum = planData.reduce((data, film) => {
                if (!film.joinFlag) {
                  if (item.movieInfoVoList.find(citem => citem.cmcBaseMovieId == film.cmcBaseMovieId)) {
                    let startTime = film.startTime.hours < 6
                      ? new Date(`${this.baseParam.planDate} ${film.startTime.hours}:${film.startTime.minute}`).getTime() + 24 * 60 * 60 * 1000
                      : new Date(`${this.baseParam.planDate} ${film.startTime.hours}:${film.startTime.minute}`).getTime();
                    let endTime = film.endTime.hours < 6
                      ? new Date(`${this.baseParam.planDate} ${film.endTime.hours}:${film.endTime.minute}`).getTime() + 24 * 60 * 60 * 1000
                      : new Date(`${this.baseParam.planDate} ${film.endTime.hours}:${film.endTime.minute}`).getTime();

                    return startTime >= goldTimeStart && startTime <= goldTimeEnd ? data += 1 : data += 0;
                  } else {
                    return data += 0;
                  }
                } else {
                  return data + film.planTimeVoList.reduce((cData, citem) => {
                    if (item.movieInfoVoList.find(movie => movie.cmcBaseMovieId == citem.cmcBaseMovieId)) {
                      let startTime = new Date(citem.planTimeStart).getTime(), endTime = new Date(citem.planTimeEnd).getTime();
                      return startTime >= goldTimeStart && startTime <= goldTimeEnd ? cData + 1 : cData + 0;
                    } else {
                      return cData + 0;
                    }
                  }, 0);
                }
              }, 0);
              item.goldPer = (item.goldScene / goldTotal * 100) ? (item.goldScene / goldTotal * 100).toFixed(2) : '0.00';
            }
          });
          concatData.sort((a, b) => b.myPer - a.myPer);
          // TODO 检查是否需要重写检验方法
          this.checkUpAdvice(originData);
          this.adviceData = originData.concat(concatData);
          this.adviceData.forEach(item => {
            this.films.some(film => {
              item.movieInfoVoList.forEach(citem => {
                citem.movieCodeList.some(singleMoive => {
                  if (singleMoive.movieCode == film.movieCode) {
                    item.color = film.color;
                    return true;
                  }
                });
              });
            });
            if (!item.color) item.color = this.colorBox[0];
          });
          // if (this.$refs.filmPlan) {
          //     // TODO 检查是否需要重写检验方法
          //     this.$refs.filmPlan.changeAllowApprove()
          // }
        }
      });
    },

    // 更改错误状态
    checkUpAdvice (data) {
      data.forEach(item => {
        if (item.isAdvice) {
          if (!item.numNoCheck) {
            item.isNumErr = item.myNum < item.timeNumLower || item.myNum > item.timeNumUpper;
          }
          if (!item.rangeNoCheck) {
            item.isPerErr = item.myPer < item.timeRatioLower || item.myPer > item.timeRatioUpper;
          }
        }
      });
    },

    /* 排片发生滚动 */
    moviePlanScorll (data) {
      this.scroll = {
        x: data.scrollLeft,
        y: data.scrollTop
      };
    },
    /* 已选电影 */
    selectMovie (data) {
      data.isShow = false;
      this.selectMovieData = data;
    },
    /* 清除当前所选电影 */
    cleanMovie () {
      this.$refs.filmLibary.selectMovie();
    },
    /* 打开排片参考 */
    showFlimBan () {
      this.showBan = true;
      this.filmPlan_deleteWidth = this.deleteWidth('filmPlan', 'show');
      this.filmLibary_deleteWidth = this.deleteWidth('filmLibary', 'show');
      this.filmScale_deleteWidth = this.deleteWidth('filmScale', 'show');
      this.filmTips_deleteWidth = this.deleteWidth('filmTips', 'show');
    },
    /* 关闭排片参考 */
    closeLeftTool (type) {
      if (type == 'advice') {
        this.showAdvice = false;
      } else {
        this.showBan = false;
      }
      if (this.showAdvice || this.showBan) {
        return;
      }
      this.filmPlan_deleteWidth = this.deleteWidth('filmPlan', 'hide');
      this.filmLibary_deleteWidth = this.deleteWidth('filmLibary', 'hide');
      this.filmScale_deleteWidth = this.deleteWidth('filmScale', 'hide');
      this.filmTips_deleteWidth = this.deleteWidth('filmTips', 'hide');
    },
    /* 计算应减宽度 */
    deleteWidth (type, showOrHide) {
      let keysArrary = Object.keys(this.deleteCofig);
      let _deleteWidth = null;
      keysArrary.forEach(element => {
        let c_keyArrary = Object.keys(this.deleteCofig[element]);
        let c_type = this.deleteCofig[element].can_delete_type;
        let c_must = this.deleteCofig[element].musthType;
        for (let i = 0; i < c_keyArrary.length; i++) {
          let c_element = c_keyArrary[i];
          if (showOrHide != 'show' && c_must == 'show') {
            break;
          }
          if (c_type.includes(type) && typeof this.deleteCofig[element][c_element] === 'number') {
            _deleteWidth += Number(this.deleteCofig[element][c_element]);
          }
        }
      });
      return _deleteWidth;
    },
    /* 保存排片 */
    savePlan () {
      this.$refs.filmPlan.savePlan();
    },
    /* 删除选定 */
    deleteSelect () {
      this.$refs.filmPlan.deletSelectPlan();
    },
    /* 我的数据 */
    setMindData (data) {
      let myBan = data.mindArr;
      this.banData.myBan = JSON.parse(JSON.stringify(myBan.sort(this.sort('planPercent', 'down'))));
    },
    /* 确定 - 修改刻度 */
    saveChangeScale (data) {
      if (!this.pageControlType) {
        return this.cantEdition();
      }

      let scaleShowConfig = data;

      let baseParam = JSON.parse(JSON.stringify(this.baseParam));
      let param = {
        planDate: baseParam.planDate,
        uidCinema: baseParam.uidCinema,
        dragPrecision: scaleShowConfig.dragPrecision,
        timeInterval: scaleShowConfig.timeInterval
      };
      this.$ctmList.editTimeLine(param).then(
        data => {
          let _data = data.data;
          if (_data.tag) {
            this.scaleConfig = scaleShowConfig;
          }
        }
      ).catch(
        msg => {
          console.log(msg);
        }
      );
    },
    /* 获取影厅初始化数据 */
    initMoviePlan (turnPageParam) {
      //    this.turnPageParamType = turnPageParam ?  turnPageParam.type : null
      //    this.turnPageParam = turnPageParam ? turnPageParam : null
      // 打开时间轴
      let timeline_param = {
        'uidCinema': this.baseParam.uidCinema
      };
      this.$ctmList.initTimeLine(timeline_param).then(data => {
        let _data = data.data;
        let dragPrecision = _data.dragPrecision;
        let timeInterval = _data.timeInterval;
        this.scaleConfig = {
          dragPrecision,
          timeInterval
        };
      }).catch(
        msg => {
          console.log(msg);
        }
      );
      this.getRoomData().then(
        this.getPlanList(turnPageParam)
      );
      this.getAllMovie();
    },
    getAllMovie () {
      this.$ctmList.getPlanMovieList({
        'targetDate': this.baseParam.planDate,
        'cinemaUid': this.baseParam.uidCinema,
        'current': 1,
        'size': 100
      }).then(res => {
        if (res.code != 200) return this.error(res.msg);
        if (res.code == 200 && res.data) {
          let movieData = [];
          res.data.forEach((item, i) => {
            movieData.push({
              movieName: item.movieName,
              language: item.moviedesclanguage,
              disversion: item.disVersion,
              timeLong: item.timeLong,
              baseMovieUid: item.uid,
              movieCode: item.movieCode,
              color: (i % res.data.length) < (this.colorBox.length - 1) ? this.colorBox[i % res.data.length] : this.colorBox[(i % res.data.length) % this.colorBox.length],
              boxOffice: item.boxOffice,
              countrySeatRate: item.countrySeatRate,
              hallSeatRate: item.hallSeatRate,
              id: item.id,
              oftenUse: item.oftenUse,
              languageCode: item.languageCode,
              isOftenUse: item.oftenUse == 1,
              dateShowFirst: item.dateShowFirst,
              dateShowOff: item.dateShowOff
            });
          });

          this.films = movieData;
          this.initFlag = {
            movie: true,
            hall: this.initFlag.hall,
            plan: this.initFlag.plan
          };
        }
      });
    },
    getRoomData () {
      return getPlanRoomData({
        'cinemaUid': this.baseParam.uidCinema,
        'planDate': this.baseParam.planDate
      }).then(res => {
        if (res.code != 200) return this.error(res.msg);
        if (res.code == 200 && res.data) {
          this.hallData = res.data || [];
          this.initFlag = {
            movie: this.initFlag.movie,
            hall: true,
            plan: this.initFlag.plan
          };
        }
      });
    },

    getReference () {
      getRefTip({
        cinemaUid: this.baseParam.uidCinema,
        consultCinemaCode: this.consultCinemaCode,
        planDate: this.baseParam.planDate
        // "startTime": `${this.baseParam.planDate} 17:00:00` ,
        // "endTime": `${this.baseParam.planDate} 21:00:00`
      }).then(res => {
        if (res.code != 200) return this.error(res.msg);
        if (res.code == 200 && res.data) {
          this.consultCinemaName = res.data.consultCinemaName;
          res.data.myData.forEach(item => {
            this.films.some(film => {
              if (film.movieCode == item.movieCode) {
                item.color = film.color;
                return true;
              }
            });
            if (!item.color) item.color = this.colorBox[0];
          });
          this.banData = Object.assign(res.data, { loadFlag: true });
          let planArr = this.$refs.filmPlan.plan_rooms.reduce((data, item) => {
            return data.concat(item);
          }, []);
          this.calcRefTipData(planArr);
        }
      });
    },
    calcRefTipData (planData) {
      // 计算 排片总数 和 黄金场次总数
      let planTotal = planData.reduce((data, item) => {
        return !item.joinFlag ? data + 1 : data + item.planTimeVoList.length;
      }, 0);
      let goldTimeStart = new Date(this.goldTimeStart).getTime(), goldTimeEnd = new Date(this.goldTimeEnd).getTime();
      let goldTotal = planData.reduce((data, film) => {
        if (!film.joinFlag) {
          let startTime = film.startTime.hours < 6
            ? new Date(`${this.baseParam.planDate} ${film.startTime.hours}:${film.startTime.minute}`).getTime() + 24 * 60 * 60 * 1000
            : new Date(`${this.baseParam.planDate} ${film.startTime.hours}:${film.startTime.minute}`).getTime();
          let endTime = film.endTime.hours < 6
            ? new Date(`${this.baseParam.planDate} ${film.endTime.hours}:${film.endTime.minute}`).getTime() + 24 * 60 * 60 * 1000
            : new Date(`${this.baseParam.planDate} ${film.endTime.hours}:${film.endTime.minute}`).getTime();
          return startTime >= goldTimeStart && startTime <= goldTimeEnd ? data + 1 : data + 0;
        } else {
          return data + film.planTimeVoList.reduce((cData, citem) => {
            let startTime = new Date(citem.planTimeStart).getTime(),
              endTime = new Date(citem.planTimeEnd).getTime();
            return startTime >= goldTimeStart && startTime <= goldTimeEnd ? cData + 1 : cData + 0;
          }, 0);
        }
      }, 0);

      this.banData.myData.forEach(item => {
        item.scene = planData.reduce((data, film) => {
          if (!film.joinFlag) {
            return film.movieCode == item.movieCode ? data + 1 : data + 0;
          } else {
            return data + film.planTimeVoList.reduce((cData, citem) => {
              return citem.movieCode == item.movieCode ? cData + 1 : cData + 0;
            }, 0);
          }
        }, 0);
        item.goldScene = planData.reduce((data, film) => {
          if (!film.joinFlag) {
            if (film.movieCode == item.movieCode) {
              let startTime = film.startTime.hours < 6
                ? new Date(`${this.baseParam.planDate} ${film.startTime.hours}:${film.startTime.minute}`).getTime() + 24 * 60 * 60 * 1000
                : new Date(`${this.baseParam.planDate} ${film.startTime.hours}:${film.startTime.minute}`).getTime();
              let endTime = film.endTime.hours < 6
                ? new Date(`${this.baseParam.planDate} ${film.endTime.hours}:${film.endTime.minute}`).getTime() + 24 * 60 * 60 * 1000
                : new Date(`${this.baseParam.planDate} ${film.endTime.hours}:${film.endTime.minute}`).getTime();

              return startTime >= goldTimeStart && startTime <= goldTimeEnd ? data += 1 : data += 0;
            } else {
              return data += 0;
            }
          } else {
            return data + film.planTimeVoList.reduce((cData, citem) => {
              if (citem.movieCode == item.movieCode) {
                let startTime = new Date(citem.planTimeStart).getTime(), endTime = new Date(citem.planTimeEnd).getTime();
                return startTime >= goldTimeStart && startTime <= goldTimeEnd ? cData + 1 : cData + 0;
              } else {
                return cData + 0;
              }
            }, 0);
          }
        }, 0);
        item.scenePer = (item.scene / planTotal * 100) ? (item.scene / planTotal * 100).toFixed(2) : '0.00';
        item.goldScenePer = (item.goldScene / goldTotal * 100) ? (item.goldScene / goldTotal * 100).toFixed(2) : '0.00';
      });
    },
    getPlanList (turnPageParam) {
      this.$ctmList.datePlanList({
        'planDate': this.baseParam.planDate,
        'cinemaUid': this.baseParam.uidCinema
      }).then(res => {
        if (res.code == 200 && res.data) {
          this.planOriData = res.data;
          this.initFlag = {
            movie: this.initFlag.movie,
            hall: this.initFlag.hall,
            plan: true
          };
          if (turnPageParam && turnPageParam.type) {
            let uid = '';
            res.data.some(item => {
              if (item.hallUid == turnPageParam.curPlan.hallUid && item.startTime == `${turnPageParam.curPlan.startTime.hours}:${turnPageParam.curPlan.startTime.minute}`) {
                uid = item.planUid;
                return true;
              }
            });
            this.$router.push({
              path: `/ctm/moviePlan/detail?mode=${turnPageParam.type}&uid=${uid}`
            });
          }
        }
      });
    },
    /* 当前用户不具有操作权限提示 */
    cantEdition () {
      this.warning('请在编辑放映计划页面中进行编辑！');
    },
    /* 审核通过/驳货 */
    approvePassPlan (type) {
      this.$refs.filmPlan.approvePassPlan(type);
    },
    /* 提交审核 */
    submitReview () {
      this.$refs.filmPlan.submitReview();
    }
  }
};
</script>

<style lang="scss">
.plan-window {
  height: 560px;
  // overflow: hidden;
  .plan-tool-left {
    margin-right: 6px;
    background-color: #f5f5f5;
    float: left;
    height: 100%;
    .line {
      width: 151px;
      height: 1px;
      // margin-bottom: 15px;
      background: #dcdbdb;
      margin: 7px auto;
    }
  }
  .suspend-ban {
    width: 66px;
    height: 52px;
    position: fixed;
    left: 160px;
    top: 214px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 4px;
    z-index: 9999;
    .plan-single-menu {
      text-align: center;
      height: 100%;
      box-sizing: border-box;
      // display: inline-block;
      padding-top: 8px;
      cursor: pointer;
      .plan-menu-name {
        padding: 4px 0px;
        font-size: 12px;
        color: #ff8900;
        letter-spacing: 1px;
        line-height: 16px;
      }
      .plan-tool-icon {
        font-size: 14px;
        color: #ff8900;
      }
    }
  }
  .flex-base {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }

  .planWindow {
    width: 100%;
    height: calc(100% - 68px);
  }
  .window_1 {
    float: left;
    height: 100% !important;
  }
  .window_2 {
    // min-height: 600px;
    height: calc(100% - 32px);
    // overflow-y: hidden;
    // overflow-x: hidden;
    box-sizing: border-box;
  }

  .window_3 {
    float: left;
    width: calc(100% - 128px);
    height: 100%;
    overflow-x: scroll;
  }

  ::-webkit-scrollbar {
    width: 0.5rem;
    height: 0.5rem;
    background: hsla(0, 0%, 100%, 0.6);
  }

  ::-webkit-scrollbar-track {
    border-radius: 0;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 0;
    background-color: rgba(95, 95, 95, 0.4);
    transition: all 0.2s;
    border-radius: 0.5rem;

    &:hover {
      background-color: rgba(95, 95, 95, 0.7);
    }
  }

  // 三角形
  .triangle-relative {
    width: 0;
    height: 0;
    border-style: solid;
    position: relative;
  }

  .triangle-absolute {
    width: 0;
    height: 0;
    border-style: solid;
    position: absolute;
  }

  // 已审批
  .success {
    border-width: 0px 0px 15px 15px;
    border-color: transparent transparent #05e043;
  }

  // 审批中
  .going {
    border-width: 0px 0px 15px 15px;
    border-color: transparent transparent #ffaa00;
  }

  // 已驳回
  .warn {
    border-width: 0px 0px 15px 15px;
    border-color: transparent transparent #fc4040;
  }

  // 已停用
  .stop {
    border-width: 0px 0px 15px 15px;
    border-color: transparent transparent #888888;
  }

  // 文字超出隐藏
  .text-hide {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
