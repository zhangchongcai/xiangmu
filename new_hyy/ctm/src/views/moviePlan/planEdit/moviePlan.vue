<template>
  <section class="planWindow" ref="planArea" v-loading="loading">
    <div class="plan-tool-left" v-show="showAdvice || showBan">
      <!-- 排片指导 -->
      <planAdvice ref="planAdvice" v-show="showAdvice" :showAdvice="showAdvice" :adviceData="adviceData" @closeLeftTool="closeLeftTool" :style="{height: !showBan && showAdvice ? '100%' : '40%'}"></planAdvice>
      <div class="line" v-if="showBan && showAdvice" style="margin: 0px auto"></div>
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
      <!-- 影片库 -->
      <filmLibary ref="filmLibary" :films="showFilms" @selectMovie="selectMovie" :width="windowWidth - filmLibary_deleteWidth " :mode="mode"></filmLibary>
      <div class="window_2">
        <!-- 影厅库 -->
        <filmRoom ref="filmRoom" :scrollY="scroll.y" :rooms="rooms" :contentSize="contentSize" @selectRoom="selectRoom" :mode="mode"></filmRoom>
        <div class="window_3">
          <!-- 刻度尺 -->
          <filmScale ref="filmScale" @saveChangeScale="saveChangeScale" :scrollX="scroll.x" :scaleConfig="scaleConfig" :width="windowWidth - filmScale_deleteWidth"></filmScale>
          <!-- 放映计划 -->
          <filmPlan ref="filmPlan" @selectStauts="selectStauts" @scroll="moviePlanScorll" @cleanMovie="cleanMovie" :width="windowWidth - filmPlan_deleteWidth" :rooms="rooms" :contentSize="contentSize" :selectMovieData="selectMovieData" :baseParam="baseParam" :plan_list="plan_list" :scaleConfig="scaleConfig" @initMoviePlan="initMoviePlan" @initPlanAdvice="initPlanAdvice" @copyMovie="selectMovie" :pricePlan="pricePlan" @changeMyData="changeMyData" :mode="mode" :adviceData="adviceData" :showPricePlanName="showPricePlanName" @changehallBoxOfficeVoList="changehallBoxOfficeVoList"></filmPlan>
        </div>
      </div>
      <!-- 标注 -->
      <filmTips ref="filmTips" :width="windowWidth - filmTips_deleteWidth" :filmTips="filmTips"></filmTips>
    </div>
    <el-dialog title="片库设置" :visible.sync="filmStoreDialog" @closed="resetFilmSet" class="film-stroe-set">
      <el-form :model="form">
        <el-form-item class="serach-con">
          <div class="search-wrap">
            <el-input v-model="searchMovieName" placeholder="请您输入影片名称">
            </el-input>
          </div>
          <el-button type="primary" icon="el-icon-search" @click="searchMovie">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="curShowType" @change="changeShowFilm">
            <el-radio :label="0">全部(共{{filmsCopy.length}}部)</el-radio>
            <el-radio :label="1">只看显示的影片({{filmsCopy.filter(film => film.oftenUse).length}}部)</el-radio>
            <el-radio :label="2">只看不显示的影片({{filmsCopy.filter(film => !film.oftenUse).length}}部)</el-radio>
          </el-radio-group>
          <div class="film-store-tip"><i class="el-icon-warning" style="margin-right: 3px;"></i>注: 已勾选的影片将在排期界面显示, 未勾选的影片不会显示</div>
        </el-form-item>
        <el-form-item>
          <div class="show-film-con">
            <el-checkbox v-for="film in curShowFilmList" :key="film.id" @change="changeSingleFilmStatus(film)" v-model="film.isOftenUse">
              <div class="film-item" :class="{isSelect: film.select}">
                <div class="line" :style="{background:film.color}"></div>
                <div class="film-content">
                  <div :title="film.movieName" class="text-hide">{{film.movieName}}</div>
                  <div>
                    <div :title="film.disversion +'/'+ film.language" class="text-hide">({{film.disversion}}/{{film.language}})</div>
                    <div :title="film.timeLong+'分钟'">{{film.timeLong}}分钟</div>
                  </div>
                </div>
              </div>
            </el-checkbox>
          </div>

        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="filmStoreDialog = false" class="dialog-btn-w80">关闭</el-button>
      </div>
    </el-dialog>
    <import-plan ref="importPlan" :baseParam="baseParam" @initMoviePlan="initMoviePlan"></import-plan>
    <!-- <el-dialog
        title="提示"
        :visible.sync="insertTip"
        width="30%"
        :show-close="false"	
        :close-on-click-modal="false"
        :close-on-press-escape="false"	>
        <span>{{insertTipMsg}}</span>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="closeInsertTip">确 定</el-button>
        </span>
        </el-dialog> -->
  </section>
</template>

<script>
import filmBan from './filmBan';
import filmLibary from './filmLibary';
import filmRoom from './filmRoom';
import filmScale from './filmScale';
import filmPlan from './filmPlan';
import filmTips from './filmTips';
import planAdvice from './planAdvice';
import importPlan from './importPlan';

import { editTimeLine, initTimeLine, getPlanMovieList, getPlanRoomData, datePlanList, getRefTip, getgoldTimeSet, getPlanAdvice, updateMovieOftenUseStatus, getGoldTime, getPlanCtrlPerson, lockPlanCtrlPerson } from 'ctmSrc/http/interface';
// import {holList} from 'frame_cpm/http/interface.js'
export default {
  components: {
    filmBan,
    filmRoom,
    filmScale,
    filmPlan,
    filmLibary,
    filmTips,
    planAdvice,
    importPlan
  },
  props: {
    pricePlan: {
      type: Object,
      required: true
    },
    baseParam: {
      type: Object
    },
    mode: {
      type: Number,
      default: 1
    },
    showPricePlanName: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    baseParam (data, oData) {
      // if (this.timer) {
      //     clearInterval(this.timer)
      //     this.timer = null
      // }
      // if (!this.mode) {
      //     this.initMoviePlan()
      //     return
      // }
      // getPlanCtrlPerson({
      //     cinemaUid: data.uidCinema,
      //     makeDate: data.planDate
      // }).then(res => {
      //     if (res.code != 200) return this.error(res.msg)
      //     if (res.code == 200) {
      //         if (res.data) {
      //             this.initMoviePlan()
      //             this.timer = setInterval(() => {
      //                 lockPlanCtrlPerson({
      //                     cinemaUid: data.uidCinema,
      //                     makeDate: data.planDate,
      //                     operation: 'update'
      //                 }).then(res => {
      //                     if (!res.data) {
      //                         if (!this.insertTip) {
      //                             this.insertTip = true
      //                             this.insertTipMsg = `当前操作人员${res.msg}`
      //                         }
      //                         if (this.timer) {
      //                             clearInterval(this.timer)
      //                             this.timer = null
      //                         }
      //                     }
      //                 })
      //             }, 30000)
      //         } else {
      //             this.$confirm(`${res.msg}正在编排放映计划, 是否强制进入编排`, '确认信息', {
      //                 distinguishCancelAndClose: true,
      //                 confirmButtonText: '确认',
      //                 cancelButtonText: '取消'
      //                 })
      //                 .then(() => {
      //                     lockPlanCtrlPerson({
      //                         cinemaUid: data.uidCinema,
      //                         makeDate: data.planDate,
      //                         operation: 'insert'
      //                     }).then(res => {
      //                         // console.log(res)
      //                     })
      //                     if (this.timer) {
      //                         clearInterval(this.timer)
      //                         this.timer = null
      //                     }
      //                     this.timer = setInterval(() => {
      //                         lockPlanCtrlPerson({
      //                             cinemaUid: data.uidCinema,
      //                             makeDate: data.planDate,
      //                             operation: 'update'
      //                         }).then(res => {
      //                             if (!res.data) {
      //                                 if (!this.insertTip) {
      //                                     this.insertTip = true
      //                                     this.insertTipMsg = `当前操作人员${res.msg}`
      //                                 }
      //                                 if (this.timer) {
      //                                     clearInterval(this.timer)
      //                                     this.timer = null
      //                                 }
      //                             }
      //                         })
      //                     }, 30000)
      //                     this.initMoviePlan()
      //                 })
      //                 .catch(action => {
      //                     this.initMoviePlan()
      //                     this.error('切换为查看模式')
      //                     this.$emit('changeMode', 'view')
      //                 })
      //         }
      //     }
      // })

      this.initMoviePlan();
    },
    initFlag (data, oData) {
      if (data.plan && data.hall) {
        let seatCount = this.hallData.reduce((count, item) => item.seatnum + count, 0), roomData = [];
        // 当前时间和未来时间不展示 禁用影厅
        if (new Date(`${this.baseParam.planDate} 00:00:00`).getTime() >= new Date().getTime() || this.$refs.filmPlan.formatDateTime(new Date().getTime()) == this.baseParam.planDate) {
          this.hallData = this.hallData.filter(item => item.status);
        }
        this.hallData.forEach((item, i) => {
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
        });
        this.filmTips = {
          seatCount,
          roomNum: roomData.length
        };
        this.rooms = roomData;
        this.contentSize['height'] = this.rooms.length * this.contentSize.roomItemHeight;
        // 排片数据处理
        let planData = this.rooms.map(item => []);
        if (data.movie) {
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
          getGoldTime({
            cinemaUid: this.baseParam.uidCinema,
            planDate: this.baseParam.planDate
          }).then(res => {
            if (res.code != 200) return this.error(res.msg);
            if (res.code == 200) {
              this.goldTimeStart = `${this.baseParam.planDate} ${res.data.startTime}`;
              this.goldTimeEnd = `${this.baseParam.planDate} ${res.data.endTime}`;
              // console.log(this.goldTimeStart, this.goldTimeEnd)
              // TODO 竞对
              this.consultCinemaCode = res.data.consultCinemaCode || '00000000';
              this.getReference();
            }
          });

          return;
        } else {
          let colorIndex = 0;
          this.planOriData.forEach((item, i) => {
            if (this.planOriData.some(citem => citem.movieCode == item.movieCode && citem.color)) {
              item.color = this.planOriData.find(citem => citem.movieCode == item.movieCode && citem.color).color;
            } else {
              item.color = this.colorBox[colorIndex];
              colorIndex += 1;
            }
            item.disversion = item.disVersionName;
            item.language = item.languageName;
            if (item.joinFlag) item.movieName = item.joinMovieName;

            this.rooms.forEach((room, index) => {
              if (room.uid_hall == item.hallUid) {
                planData[index].push(item);
              }
            });
          });
        }

        this.plan_list = {
          data: planData
        };
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
      scroll: {
        x: 0,
        y: 0
      },
      /* 影厅列表数据 */
      rooms: [],
      /* 影片库数据 */
      films: [],
      /* 排片参考 */
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
      /* 获取父组件的真实宽度 */
      windowWidth: '',
      filmLibary_deleteWidth: null,
      filmPlan_deleteWidth: null,
      filmScale_deleteWidth: null,
      filmTips_deleteWidth: null,
      deleteCofig: {
        ban: {
          width: 177, // 177 + 6 = 183
          margin_right: 6,
          can_delete_type: 'filmPlan,filmScale,filmLibary,filmTips',
          musthType: 'show'
        },
        filmRoom: {
          width: 128,
          can_delete_type: 'filmPlan,filmScale'
        }
        // changeScale: {
        //     width: 32,
        //     can_delete_type: 'filmPlan,filmScale,filmTips'
        // },
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
      hallData: [],
      goldTimeStart: '',
      consultCinemaCode: '',
      goldTimeEnd: '',
      consultCinemaName: '',
      // 片库设置dialog
      filmStoreDialog: false,
      curShowType: 0,
      // 允许排片的影片list
      showFilms: [],
      // filmsCopy
      filmsCopy: [],
      // 当前显示影片list
      curShowFilmList: [],
      form: {},
      searchMovieName: '',
      loading: false,
      timer: null,
      //  操作人员被顶掉提示
      insertTip: false,
      insertTipMsg: '',
      subApproveUids: []
    };
  },
  mounted () {
    this.windowWidth = document.querySelector('.movie-plan').offsetWidth;
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
  created () {
  },
  methods: {
    selectStauts (val) {
      this.loading = val;
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
    /* 选中当前影厅所有可选电影 */
    selectRoom (data) {
      this.$refs.filmPlan.selectRoom(data);
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
    /* 确定 - 修改刻度 */
    saveChangeScale (data) {
      let scaleShowConfig = data;

      let baseParam = JSON.parse(JSON.stringify(this.baseParam));
      let param = {
        planDate: baseParam.planDate,
        uidCinema: baseParam.uidCinema,
        dragPrecision: scaleShowConfig.dragPrecision,
        timeInterval: scaleShowConfig.timeInterval
      };
      editTimeLine(param).then(
        res => {
          if (res.code != 200) return this.error(res.msg);
          let _data = res.data;
          if (_data.tag) {
            this.scaleConfig = scaleShowConfig;
          }
        }
      );
    },
    /* 获取影厅初始化数据 */
    initMoviePlan (turnPageParam) {
      this.loading = true;
      this.getTimeLine();
      this.getAllMovie();
      this.getRoomData().then(
        this.getPlanList(turnPageParam)
      );
      // 清除影片选中状态
      this.cleanMovie();
      this.$refs.filmPlan.cleanCopy();
      this.$refs.filmPlan.hideControl();
    },
    getTimeLine () {
      initTimeLine({
        'uidCinema': this.baseParam.uidCinema
      }).then(data => {
        let _data = data.data;
        let dragPrecision = _data.dragPrecision;
        let timeInterval = _data.timeInterval;
        this.scaleConfig = {
          dragPrecision,
          timeInterval
        };
      });
    },
    getAllMovie () {
      getPlanMovieList({
        'targetDate': this.baseParam.planDate,
        'cinemaUid': this.baseParam.uidCinema
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
              dateShowOff: item.dateShowOff,
              planInfoMovieTimeVoList: item.planInfoMovieTimeVoList || [],
              cmcBaseMovieId: item.cmcBaseMovieId
            });
          });

          this.films = movieData;
          this.filmsCopy = JSON.parse(JSON.stringify(this.films));
          this.showFilms = this.films.filter(item => item.oftenUse);
          this.changeShowFilm();
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
    getPlanList (turnPageParam) {
      datePlanList({
        'planDate': this.baseParam.planDate,
        'cinemaUid': this.baseParam.uidCinema
      }).then(res => {
        this.loading = false
        if (res.code != 200) return this.error(res.msg)
        if (res.code == 200 && res.data) {
          let subApproveUids = []
          if (turnPageParam && turnPageParam.type) {
            if (turnPageParam.type == 'approved') {
              res.data.forEach(item => {
                this.$refs.filmPlan.curApproveData.forEach(plan => {
                  if (item.hallUid == plan.hallUid && item.startTime == `${plan.startTime.hours}:${plan.startTime.minute}`) {
                    subApproveUids.push(item.planUid)
                  }
                })
              })
              this.subApproveUids = subApproveUids
              res.data.forEach(plan => {
                if (this.subApproveUids.includes(plan.planUid)) {
                  plan.approveTip = '稍后自动开售，请刷新!'
                }
              })
            }
          }
          this.planOriData = res.data
          this.$refs.filmPlan.resetSaveFlage()
          this.initFlag = {
            movie: this.initFlag.movie,
            hall: this.initFlag.hall,
            plan: true
          }
          if (turnPageParam && turnPageParam.type) {
            if (turnPageParam.type == 'approve') {
              let subApproveUids = []
              res.data.forEach(item => {
                this.$refs.filmPlan.curApproveData.forEach(plan => {
                  if (item.hallUid == plan.hallUid && item.startTime == `${plan.startTime.hours}:${plan.startTime.minute}`) {
                    subApproveUids.push(item.planUid)
                  }
                })
              })
              this.$refs.filmPlan.selectPlanApprove({
                cinemaUid: this.baseParam.uidCinema,
                makeDate: this.baseParam.planDate,
                planUids: subApproveUids
              })
              return
            }
            if (turnPageParam.type == 'approved') return
            let uid = '', joinFlag = 0, type = turnPageParam.type
            res.data.some(item => {
              if (item.hallUid == turnPageParam.curPlan.hallUid && item.startTime == `${turnPageParam.curPlan.startTime.hours}:${turnPageParam.curPlan.startTime.minute}`) {
                uid = item.planUid
                joinFlag = item.joinFlag
                return true
              }
            })
            let path = type == 'continuityPlan' ? `consecutivePlan?mode=edit&uid=${uid}` : joinFlag ? `consecutivePlan?mode=${type}&uid=${uid}` : `detail?mode=${type}&uid=${uid}`
            path += `&referer=${encodeURIComponent('/ticket/moviePlan/layout?date=' + this.baseParam.planDate)}`
            this.$router.push({
              path
            })
            
          }
        }
      });
    },
    getReference () {
      getRefTip({
        cinemaUid: this.baseParam.uidCinema,
        consultCinemaCode: this.consultCinemaCode || '00000000',
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
          if (this.$refs.filmPlan) {
            let planArr = this.$refs.filmPlan.plan_rooms.reduce((data, item) => {
              return data.concat(item);
            }, []);
            this.calcRefTipData(planArr);
          }
        }
      });
    },
    /* 审核通过/驳货 */
    approvePassPlan (type) {
      this.$refs.filmPlan.approvePassPlan(type);
    },
    changeMyData () {
      if (!this.banData.loadFlag) {
        return;
      }

      if (!this.$refs.filmPlan.plan_rooms) return;
      let planArr = this.$refs.filmPlan.plan_rooms.reduce((data, item) => {
        return data.concat(item);
      }, []);
      // 修改排片指导数据
      this.changeAdviceData(planArr);
      this.calcRefTipData(planArr);
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
    closeApproveDialog () {
      this.approveErrorDialog = false;
    },
    // 初始化排片指导数据
    /**
     *  @planData 排片数据连接的一维数组()
     */
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
                    // console.log(film.movieName, startTime >= goldTimeStart && startTime <= goldTimeEnd)
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
              // console.log(item.goldNum)
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
            item.allPlansNum = allPlansNum;
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
              // console.log(item.goldNum)
              item.goldPer = (item.goldScene / goldTotal * 100) ? (item.goldScene / goldTotal * 100).toFixed(2) : '0.00';
            }
          });
          concatData.sort((a, b) => b.myPer - a.myPer);

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
          if (this.$refs.filmPlan) {
            this.$refs.filmPlan.changeAllowApprove();
          }
        }
      });
    },
    changeAdviceData (planData) {
      let originData = this.adviceData.filter(item => item.isAdvice);

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
        item.allPlansNum = allPlansNum;
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
      if (this.$refs.filmPlan) {
        this.$refs.filmPlan.changeAllowApprove();
      }
    },
    // 更改错误状态
    checkUpAdvice (data) {
      data.forEach(item => {
        if (item.isAdvice) {
          if (!item.numNoCheck) {
            item.isNumErr = item.myNum < item.movieDetailVoList.find(citem => citem.detailType != 'h').timeNumLower || item.myNum > item.movieDetailVoList.find(citem => citem.detailType != 'h').timeNumUpper;
          }
          if (!item.rangeNoCheck) {
            item.isPerErr = item.myPer < item.movieDetailVoList.find(citem => citem.detailType != 'h').timeRatioLower || item.myPer > item.movieDetailVoList.find(citem => citem.detailType != 'h').timeRatioUpper;
          }
          if (!item.goldNocheck) {
            if (item.movieDetailVoList.find(citem => citem.detailType == 'h').numberOrRatio == 1) {
              item.isGoldErr = item.goldNum < item.movieDetailVoList.find(citem => citem.detailType == 'h').timeNumLower || item.goldNum > item.movieDetailVoList.find(citem => citem.detailType == 'h').timeNumUpper;
            } else {
              item.isGoldErr = item.goldNum < item.movieDetailVoList.find(citem => citem.detailType == 'h').timeRatioLower || item.goldNum > item.movieDetailVoList.find(citem => citem.detailType == 'h').timeRatioUpper;
            }
          }
          item.allNumErr = item.allPlansNum > item.planNumUpper;
        }
      });
    },
    changeShowFilm (type) {
      type = type || 0;
      if (type == 0) {
        this.curShowFilmList = JSON.parse(JSON.stringify(this.filmsCopy));
      } else if (type == 1) {
        this.curShowFilmList = this.filmsCopy.filter(item => item.oftenUse);
      } else if (type == 2) {
        this.curShowFilmList = this.filmsCopy.filter(item => !item.oftenUse);
      }
    },
    showFilmStoreSet () {
      this.filmStoreDialog = true;
    },
    changeSingleFilmStatus (film) {
      let filmsData = JSON.parse(JSON.stringify(this.films));
      filmsData.some(item => {
        if (item.id == film.id) {
          item.oftenUse = !film.oftenUse ? 1 : 0;
          item.isOftenUse = item.oftenUse == 1;
          return true;
        }
      });
      this.films = filmsData;
      let films = JSON.parse(JSON.stringify(this.filmsCopy)), oftenUse;
      films.some(item => {
        if (item.id == film.id) {
          item.oftenUse = !film.oftenUse ? 1 : 0;
          item.isOftenUse = item.oftenUse == 1;
          oftenUse = item.oftenUse;
          return true;
        }
      });

      this.filmsCopy = films;
      this.changeShowFilm(this.curShowType);
      this.showFilms = films.filter(item => item.oftenUse);
      updateMovieOftenUseStatus({
        languageCode: film.languageCode,
        movieUid: film.baseMovieUid,
        oftenUse
      }).then(res => {
        if (res.code != 200) return this.error(res.msg);
      });
    },
    searchMovie () {
      if (this.searchMovieName) {
        this.filmsCopy = this.filmsCopy.filter(item => item.movieName.includes(this.searchMovieName));
      } else {
        this.filmsCopy = JSON.parse(JSON.stringify(this.films));
      }
      // 如需要搜索完返回所有 则重置curShowType
      this.changeShowFilm(this.curShowType);
    },
    resetFilmSet () {
      this.searchMovieName = '';
      this.filmsCopy = JSON.parse(JSON.stringify(this.films));
      this.curShowType = 0;
      this.changeShowFilm(this.curShowType);
    },
    changehallBoxOfficeVoList (roomAddData) {
      let rooms = JSON.parse(JSON.stringify(this.rooms));
      rooms.forEach(hall => {
        roomAddData.some(item => {
          if (item.hallUid == hall.uid_hall) {
            hall.occupancy = item.occupancy;
            hall.personTime = item.personTime;
            hall.tolatMoney = item.tolatMoney;
            return true;
          }
        });
      });
      this.rooms = rooms;
    },
    closeInsertTip () {
      // this.insertTip = false
      // this.insertTipMsg = ''
      // this.error('切换为查看模式')
      // this.$emit('changeMode', 'view')
    }
  },
  beforeDestroy () {
    // if (this.timer) {
    //     clearInterval(this.timer)
    //     this.timer = null
    // }
    // lockPlanCtrlPerson({
    //     cinemaUid: this.baseParam.uidCinema,
    //     makeDate: this.baseParam.planDate,
    //     operation: 'cancel'
    // }).then(res => {
    //     // console.log(res, new Date())
    // })
  },
  computed: {
  }
};
</script>

<style lang="scss">
.planWindow {
  height: calc(100% - 68px);
  // overflow: hidden;
  .plan-tool-left {
    margin-right: 6px;
    background-color: #f5f5f5;
    .line {
      width: 151px;
      height: 1px;
      // margin-bottom: 15px;
      background: #dcdbdb;
      margin: 7px auto;
    }
  }
  .plan-tool-left {
    float: left;
    height: 100%;
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
    height: calc(100% - 86px);
    box-sizing: border-box;
  }

  .window_3 {
    float: left;
    width: calc(100% - 128px);
    height: 100%;
    overflow-x: auto;
  }
  // .table-advice-err {
  //     color: red;
  // }
  ::-webkit-scrollbar {
    // width: .5rem;
    // height: .5rem;
    // height: .5rem;
    // background: hsla(0, 0%, 100%, 0.6);
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
  .el-table tr.force-row {
    .error-cell {
      color: #f33430;
    }
    .all-error-cell {
      color: #f33430;
    }
  }
  .el-table tr.advice-row {
    .error-cell {
      color: #ff8900;
    }
    .all-error-cell {
      color: #f33430;
    }
  }
}
// 排片提示信息
.el-tooltip__popper {
}
.plan-tool-tips {
  .plan-tip {
    font-size: 12px;
    margin-bottom: 8px;
    .font-bold {
      font-weight: bold;
      color: #ff8900;
    }
  }
  .plan-tip:nth-last-of-type(1) {
    margin-bottom: 0;
  }
  .plan-tip {
    .mr30 {
      font-size: 12px;
      margin-right: 30px;
    }
  }
  div {
    font-size: 12px;
    margin-bottom: 8px;
  }
}
.guide-tip-class {
  height: 30px;
  line-height: 30px;
}
.film-stroe-set {
  .el-form-item {
    margin-bottom: 10px;
  }
  .search-wrap {
    display: inline-block;
    margin-right: 10px;
  }
  .film-store-tip {
    font-size: 12px;
    height: 14px;
    line-height: 14px;
  }
  .show-film-con {
    overflow: hidden;
    background-color: #edf1fd;
    padding: 10px;
    .el-checkbox {
      .el-checkbox__input {
        position: relative;
        top: 10px;
        vertical-align: top;
      }
    }
  }
  .film-item {
    float: left;
    width: 154px;
    height: 46px;
    background: #edf1fd;
    margin-right: 8px;

    .line {
      width: 3px;
      height: 100%;
      float: left;
    }

    .film-content {
      float: left;
      height: 100%;
      width: 151px;
      background-color: #fff;
      & > div {
        margin-left: 10px;
      }

      & > div:nth-of-type(1) {
        font-size: 12px;
        color: #333333;
        font-weight: bold;
        margin-bottom: 6px;
        max-width: 70%;
      }

      & > div:nth-of-type(2) {
        overflow: hidden;
        div {
          font-size: 12px;
          color: #333333;
          float: left;
        }

        div:nth-of-type(1) {
          max-width: 50%;
        }

        div:nth-of-type(2) {
          margin-left: 20px;
        }
      }
    }
  }
}
</style>
