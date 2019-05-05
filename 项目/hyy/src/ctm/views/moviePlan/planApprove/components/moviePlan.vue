<template>
<section class="planWindow">
    <div class="window_2">
        <!-- 影厅库 -->
        <filmRoom
                ref="filmRoom"
                :scrollY="scroll.y"
                :rooms="rooms"
                :contentSize="contentSize"
                @selectRoom="selectRoom"
                :mode="mode"
                :hallOptions="hallOptions"
                :filteredHallOptions="filteredHallOptions"
                @updateIsIndeterminateByIndex="updateIsIndeterminateByIndex"
        ></filmRoom>
        <div class="window_3">
            <!-- 刻度尺 -->
            <filmScale
                    ref="filmScale"
                    @saveChangeScale="saveChangeScale"
                    :showSetting="showBan"
                    :scrollX="scroll.x"
                    :scaleConfig="scaleConfig"
                    :width="windowWidth - filmScale_deleteWidth"
            ></filmScale>
            <!-- 放映计划 -->
            <filmPlan
                    ref="filmPlan"
                    @updateIsIndeterminate="updateIsIndeterminate"
                    @cantEdition="cantEdition"
                    :pageControlType="pageControlType"
                    @setMindData="setMindData"
                    @scroll="moviePlanScorll"
                    @cleanMovie="cleanMovie"
                    :width="windowWidth - filmPlan_deleteWidth"
                    :rooms="rooms"
                    :contentSize="contentSize"
                    :selectMovieData="selectMovieData"
                    :baseParam="baseParam"
                    :plan_list="plan_list"
                    :scaleConfig="scaleConfig"
                    @copyMovie="selectMovie"
                    :mode="mode"
            ></filmPlan>
        </div>
    </div>
    <!-- 标注 -->
    <filmTips
            ref="filmTips"
            :width="windowWidth - filmTips_deleteWidth"
            :filmTips="filmTips"
    ></filmTips>
</section>
</template>

<script>
import filmRoom from "./filmRoom";
import filmScale from "./filmScale";
import filmPlan from "./filmPlan";
import filmTips from './filmTips';

export default {
    components: {
        filmRoom,
        filmScale,
        filmPlan,
        filmTips
    },
    props: {
        baseParam: {
            type: Object
        },
        pageControlType:{
            type:Boolean,
            default: true
        },
        mode: {
            type: Number,
            default: 1
        }
    },
    watch: {
        baseParam(data, old_data) {
            this.initMoivePlan()
            this.$refs.filmRoom.updateCheckedHall([])
        },
        initFlag(data, oData) {
            if (data.movie && data.plan && data.hall) {
                let seatCount = this.hallData.reduce((count, item) => item.seatnum + count, 0), roomData = []
                this.hallData.forEach((item, i) => {
                    // status 有效 或者 无效但有排片纪录
                    if (item.status == 1 || this.planOriData.some(plan => plan.hallUid == item.uid)) {
                        console.log()
                        item.seat_count ? seatCount += item.seatNum : seatCount += 0
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
                            saleNum: item.seatNum,
                            saleMoney: item.boxOffice,
                            seatPercent: item.seatRate,
                            isIndeterminate: false,
                            isDisabled: true,
                        })
                    }
                })
                this.filmTips = {
                        seatCount,
                        roomNum: roomData.length
                    }
                this.rooms = roomData


                this.hallOptions = roomData.map( (item, index) => {
                    return index
                })

                this.contentSize['height'] = this.rooms.length * this.contentSize.roomItemHeight
                // 排片数据处理
                let planData = this.rooms.map(item => [])
                this.planOriData.forEach((item, i) => {
                    // let relatedMovie = this.movie_obj[`${item.movieCode}`]
                    this.films.some(film => {
                        if (film.movieCode == item.movieCode) {
                            item.color = film.color
                            item.disversion = film.disversion
                            item.language = film.language
                            item.timeLong = film.timeLong
                            return true
                        }
                    })
                    if ( this.films.every(film => film.movieCode != item.movieCode) ) {
                        item.color = this.colorBox[0]
                    }
                    this.rooms.forEach((room, index) => {
                        if (room.uid_hall == item.hallUid) {
                            planData[index].push(item)
                        }
                    })
                })

                planData.forEach( (item, index) => {
                    item.some( innerItem => {
                        if(innerItem.approveStatus === 'WAIT_APPROVE') {
                            this.rooms[index].isDisabled = false
                            return true
                        }
                    })
                })

                this.filteredHallOptions = this.hallOptions.filter( item => {
                    return !this.rooms[item].isDisabled
                })

                this.plan_list = {
                    data: planData
                }
                this.initFlag = {
                    movie: false,
                    plan: false,
                    hall: false
                }
            }
        }
    },
    data() {
        return {
            /* uidCinema */
            // baseParam: {
            //     uidCinema: 'a405489f-adcc-42cd-b2ee-6789693aa481',
            //     planDate: '2019-01-16'
            // },

            windowWidth: '',
            scroll: {
                x: 0,
                y: 0
            },
            /* 影厅列表数据 */
            rooms: [],

            hallOptions: [],
            filteredHallOptions: [],

            /* 影片库数据 */
            films: [],
            /* 排片参考 - 我的数据 */
            banData: {
                // filmsBan: [],
                myBan: [],
            },
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
                },
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
    mounted() {
        this.windowWidth = document.querySelector('.moviePlanWrap').offsetWidth
        this.filmPlan_deleteWidth = this.deleteWidth('filmPlan', 'show')
        this.filmLibary_deleteWidth = this.deleteWidth('filmLibary', 'show')
        this.filmScale_deleteWidth = this.deleteWidth('filmScale', 'show')
        this.filmTips_deleteWidth = this.deleteWidth('filmTips', 'show')
        this.contentSize = {
            width: 1560,
            height: this.$refs.filmRoom.$el.children[1].offsetHeight,
            roomItemHeight: 80
        }


        // 排片参考 等后台有数据接口时使用
        // this.banData.filmsBan = filmsBan.sort(this.sort("planNum", "down"))
    },
    created() {},
    methods: {
        updateRoomsIsIndeterminate() {
            this.rooms.forEach( item => {
                item.isIndeterminate = false
            })
        },

        updateIsIndeterminateByIndex(index) {
            this.rooms[index].isIndeterminate = false
        },

        updateIsIndeterminate(val) {
            val.forEach( (item, index) => {
                this.rooms[index].isIndeterminate = item
            })

        },

        handleCheckedHall(val) {
            this.$refs.filmRoom.handleCheckedHall(val ? this.filteredHallOptions : [])
        },

        /* 排片发生滚动 */
        moviePlanScorll(data) {
            this.scroll = {
                x: data.scrollLeft,
                y: data.scrollTop
            };
        },
        /* 已选电影 */
        selectMovie(data) {
            data.isShow = false;
            this.selectMovieData = data;
        },
        /* 清除当前所选电影 */
        cleanMovie() {
            this.$refs.filmLibary.selectMovie();
        },
        /* 选中当前影厅所有可选电影 */
        selectRoom(data) {
            this.$refs.filmPlan.selectRoom(data);
        },
        /* 打开排片参考 */
        showFlimBan() {
            this.showBan = true
            this.filmPlan_deleteWidth = this.deleteWidth('filmPlan', 'show');
            this.filmLibary_deleteWidth = this.deleteWidth('filmLibary', 'show');
            this.filmScale_deleteWidth = this.deleteWidth('filmScale', 'show');
            this.filmTips_deleteWidth = this.deleteWidth('filmTips', 'show');
        },
        /* 关闭排片参考 */
        closeFilmBan() {
            this.showBan = false
            this.filmPlan_deleteWidth = this.deleteWidth('filmPlan', 'hide');
            this.filmLibary_deleteWidth = this.deleteWidth('filmLibary', 'hide');
            this.filmScale_deleteWidth = this.deleteWidth('filmScale', 'hide');
            this.filmTips_deleteWidth = this.deleteWidth('filmTips', 'hide');
        },
        /* 计算应减宽度 */
        deleteWidth(type, showOrHide) {
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
                    if (c_type.includes(type) && typeof this.deleteCofig[element][c_element] == 'number') {
                        _deleteWidth += Number(this.deleteCofig[element][c_element]);
                    }
                }
            });
            return _deleteWidth;
        },
        /* 保存排片 */
        savePlan() {
            this.$refs.filmPlan.savePlan();
        },
        /* 删除选定 */
        deleteSelect() {
            this.$refs.filmPlan.deletSelectPlan();
        },
        /* 我的数据 */
        setMindData(data) {
            let myBan = data.mindArr;
            this.banData.myBan = JSON.parse(JSON.stringify(myBan.sort(this.sort("planPercent", "down"))));
        },
        /* 确定 - 修改刻度 */
        saveChangeScale(data) {
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
            }
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
        initMoivePlan(turnPageParam) {
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
                }
            }).catch(
                msg => {
                    console.log(msg);
                }
            )
            this.getRoomData().then(
                this.getPlanList(turnPageParam)
            )
            this.getAllMovie()
        },
        getAllMovie() {
            this.$ctmList.cinemaStockList({
                    'targetDate': this.baseParam.planDate,
                    'uidCinema': this.baseParam.uidCinema,
                    'current': 1,
                    'size': 10,
                    'status': "1"
                }).then(res => {
                    if (res.code == 200 && res.data) {
                        let movieData = []
                        // let movie_obj = {}
                        res.data.records.forEach((item, i) => {
                            movieData.push({
                                movieName: item.movieName,
                                language: item.moviedesclanguage,
                                disversion: item.disVersion,
                                timeLong: item.timeLong,
                                baseMovieUid: item.uid,
                                movieCode: item.movieCode,
                                color: this.colorBox[i % res.data.records.length],
                                boxOffice: item.boxOffice,
                                countrySeatRate: item.countrySeatRate,
                                hallSeatRate: item.hallSeatRate,
                            })
                        })
                        
                        this.films = movieData
                        this.initFlag = {
                            movie: true,
                            hall: this.initFlag.hall,
                            plan: this.initFlag.plan
                        }
                    }
                })
        },
        getRoomData() {
            return this.$ctmList.cinemagetList({
                    'cinemaUid': this.baseParam.uidCinema,
                    'page': 1,
                    'pageSize': 100
                }).then(res => {
                    if (res.code == 200 && res.data) {
                        this.hallData = res.data.list || []
                        this.initFlag = {
                            movie: this.initFlag.movie,
                            hall: true,
                            plan: this.initFlag.plan
                        }
                    }
                })
        },
        getPlanList(turnPageParam) {
            this.$ctmList.datePlanList({
                'planDate': this.baseParam.planDate,
                "cinemaUid": this.baseParam.uidCinema
            }).then(res => {
                if (res.code == 200 && res.data) {

                    this.planOriData = res.data
                    this.initFlag = {
                        movie: this.initFlag.movie,
                        hall: this.initFlag.hall,
                        plan: true
                    }
                    this.$refs.filmPlan.resetSaveFlage()
                    if (turnPageParam && turnPageParam.type) {
                        let uid = ''
                        res.data.some(item => {
                            if (item.hallUid == turnPageParam.curPlan.hallUid && item.startTime == `${turnPageParam.curPlan.startTime.hours}:${turnPageParam.curPlan.startTime.minute}`) {
                                    uid = item.planUid
                                    return true
                                }
                        })
                        this.$router.push({
                            path: `/ctm/moviePlan/detail?mode=${turnPageParam.type}&uid=${uid}`
                        })
                    }
                }
            })
        },
        /* 当前用户不具有操作权限提示 */
        cantEdition() {
            this.warning('请在编辑放映计划页面中进行编辑！')
        },
        /* 审核通过/驳货 */
        approvePassPlan(type) {
            this.$refs.filmPlan.approvePassPlan(type);
        },
        /* 提交审核 */
        submitReview() {
            this.$refs.filmPlan.submitReview();
        }
    }
};
</script>

<style lang="scss">
.planWindow {
    * {
        font-family: MicrosoftYaHei;
        letter-spacing: 0;
        user-select: none;
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
    }
    .window_2 {
        min-height: 600px
    }

    .window_3 {
        float: left;
        width: calc(100% - 128px);
    }

    ::-webkit-scrollbar {
        width: .5rem;
        height: .5rem;
        background: hsla(0, 0%, 100%, 0.6);
    }

    ::-webkit-scrollbar-track {
        border-radius: 0;
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 0;
        background-color: rgba(95, 95, 95, 0.4);
        transition: all .2s;
        border-radius: .5rem;

        &:hover {
            background-color: rgba(95, 95, 95, .7);
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
        border-color: transparent transparent #05E043;
    }

    // 审批中
    .going {
        border-width: 0px 0px 15px 15px;
        border-color: transparent transparent #FFAA00;
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
