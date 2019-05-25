<template>
<section class="planWindow flex-base">
    <!-- 排片占比 -->
    <filmBan ref="filmBan" v-bind:banData="banData" v-on:closeFilmBan="closeFilmBan"></filmBan>
    <div class="flex-base window_1">
        <!-- 影片库 -->
        <filmLibary ref="filmLibary" v-if="pageControlType" v-bind:films="films" v-on:selectMovie="selectMovie" v-bind:width="windowWidth ? windowWidth - filmLibary_deleteWidth : normalWidth - filmLibary_deleteWidth"></filmLibary>
        <div class="flex-base window_2">
            <!-- 影厅库 -->
            <filmRoom ref="filmRoom" v-bind:scrollY="scroll.y" v-bind:rooms="rooms" v-bind:contentSize="contentSize" v-on:selectRoom="selectRoom"></filmRoom>
            <div class="flex-base window_3">
                <!-- 刻度尺 -->
                <filmScale ref="filmScale" v-on:saveChangeScale="saveChangeScale" v-bind:scrollX="scroll.x" v-bind:scaleConfig="scaleConfig" v-bind:width="windowWidth ? windowWidth - filmScale_deleteWidth : normalWidth - filmScale_deleteWidth"></filmScale>
                <!-- 放映计划 -->
                <filmPlan ref="filmPlan" v-on:cantEdition="cantEdition" v-bind:pageControlType="pageControlType" v-on:setMindData="setMindData" v-on:scroll="moviePlanScorll" v-on:cleanMovie="cleanMovie" v-bind:width="windowWidth ? windowWidth - filmPlan_deleteWidth: normalWidth - filmPlan_deleteWidth" v-bind:rooms="rooms" v-bind:contentSize="contentSize" v-bind:selectMovieData="selectMovieData" v-bind:baseParam="baseParam" v-bind:plan_list="plan_list" v-bind:scaleConfig="scaleConfig" v-on:initMoivePlan="initMoivePlan" v-on:copyMovie="selectMovie" v-bind:pricePlan="pricePlan"></filmPlan>
            </div>
        </div>
        <!-- 标注 -->
        <filmTips ref="filmTips" v-bind:width="windowWidth ? windowWidth - filmTips_deleteWidth: normalWidth - filmTips_deleteWidth" v-bind:filmTips="filmTips"></filmTips>
    </div>
</section>
</template>

<script>
import filmBan from "./filmBan";
import filmLibary from "./filmLibary";
import filmRoom from "./filmRoom";
import filmScale from "./filmScale";
import filmPlan from "./filmPlan";
import filmTips from './filmTips';

export default {
    components: {
        filmBan,
        filmRoom,
        filmScale,
        filmPlan,
        filmLibary,
        filmTips
    },
    props: {
        pricePlan: {
            type: Object,
            required: true
        },
        baseParam: {
            type: Object
        },
        pageControlType:{
            type:Boolean,
            default: true
        }
    },
    watch: {
        baseParam(data, old_data) {
            this.initMoivePlan();
        }
    },
    data() {
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
            /* 初始浏览器宽度 需要移除的固定宽度，动态修改刻度尺 排片窗口 */
            normalWidth: null,
            filmLibary_deleteWidth: null,
            filmPlan_deleteWidth: null,
            filmScale_deleteWidth: null,
            filmTips_deleteWidth: null,
            deleteCofig: {
                ban: {
                    width: 154,
                    margin_right: 4,
                    can_delete_type: 'filmPlan,filmScale,filmLibary,filmTips',
                    musthType: 'show'
                },
                filmRoom: {
                    width: 128,
                    can_delete_type: 'filmPlan,filmScale'
                },
                changeScale: {
                    width: 47,
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
            plan_list: {}
        };
    },
    mounted() {
        this.filmPlan_deleteWidth = this.$options.methods.deleteWidth(this, 'filmPlan', 'show');
        this.filmLibary_deleteWidth = this.$options.methods.deleteWidth(this, 'filmLibary', 'show');
        this.filmScale_deleteWidth = this.$options.methods.deleteWidth(this, 'filmScale', 'show');
        this.filmTips_deleteWidth = this.$options.methods.deleteWidth(this, 'filmTips', 'show');
        this.normalWidth = window.innerWidth;
        this.contentSize = {
            width: 1489,
            height: this.$refs.filmRoom.$el.children[1].offsetHeight,
            roomItemHeight: 80
        };

        // 排片参考 等后台有数据接口时使用
        // this.banData.filmsBan = filmsBan.sort(this.sort("planNum", "down"));
    },
    created() {},
    methods: {
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
            this.filmPlan_deleteWidth = this.$options.methods.deleteWidth(this, 'filmPlan', 'show');
            this.filmLibary_deleteWidth = this.$options.methods.deleteWidth(this, 'filmLibary', 'show');
            this.filmScale_deleteWidth = this.$options.methods.deleteWidth(this, 'filmScale', 'show');
            this.filmTips_deleteWidth = this.$options.methods.deleteWidth(this, 'filmTips', 'show');
            this.$refs.filmBan.showFilmBan();
        },
        /* 关闭排片参考 */
        closeFilmBan() {
            this.filmPlan_deleteWidth = this.$options.methods.deleteWidth(this, 'filmPlan', 'hide');
            this.filmLibary_deleteWidth = this.$options.methods.deleteWidth(this, 'filmLibary', 'hide');
            this.filmScale_deleteWidth = this.$options.methods.deleteWidth(this, 'filmScale', 'hide');
            this.filmTips_deleteWidth = this.$options.methods.deleteWidth(this, 'filmTips', 'hide');
        },
        /* 计算应减宽度 */
        deleteWidth(that, type, showOrHide) {
            let keysArrary = Object.keys(that.deleteCofig);
            let _deleteWidth = null;
            keysArrary.forEach(element => {
                let c_keyArrary = Object.keys(that.deleteCofig[element]);
                let c_type = that.deleteCofig[element].can_delete_type;
                let c_must = that.deleteCofig[element].musthType;
                for (let i = 0; i < c_keyArrary.length; i++) {
                    let c_element = c_keyArrary[i];
                    if (showOrHide != 'show' && c_must == 'show') {
                        break;
                    }
                    if (c_type.indexOf(type) != -1 && typeof that.deleteCofig[element][c_element] == 'number') {
                        _deleteWidth += Number(that.deleteCofig[element][c_element]);
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
            this.$api.editTimeLine(param).then(
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
            // 打开时间轴
            let timeline_param = {
                'uidCinema': this.baseParam.uidCinema
            };
            this.$api.initTimeLine(timeline_param).then(data => {
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
            );

            // 获取影厅列表
            let room_param = {
                'uidCinema': this.baseParam.uidCinema
            };
            // 获取时间轴内排片
            let datePlan_param = {
                'planDate': this.baseParam.planDate,
                "uidCinema": this.baseParam.uidCinema
            };
            // 获取电影
            let movie_param = {
                "dateShowFirst": this.baseParam.planDate,
                "uidCinema": this.baseParam.uidCinema
            };

            let getRooms = this.$api.cinemaRoomList(room_param);
            let getPlanList = this.$api.datePlanList(datePlan_param);
            let getMovie = this.$api.cinemaMovieList(movie_param);

            Promise.all([getRooms, getPlanList, getMovie]).then(data => {
                let rooms_data = data[0].data.allHall;
                let planList_data = data[1].data.result;
                let movie_data = data[2].data.movies;

                // 电影库
                let m_d = [];
                let movie_obj = {};
                for (let i = 0; i < movie_data.length; i++) {
                    let c_m = movie_data[i],
                        c_m_code = c_m.movieCode,
                        c_m_name = c_m.movieName,
                        c_m_lan = c_m.language,
                        c_m_moiveuid = c_m.movieUid ? c_m.movieUid : c_m.baseMovieUid,
                        c_m_color;
                    if (i < this.colorBox.length) {
                        c_m_color = this.colorBox[i];
                    } else {
                        c_m_color = this.colorBox[Math.floor(Math.random() * this.colorBox.length)];
                    }
                    m_d.push({
                        movieName: c_m_name,
                        language: c_m_lan,
                        disversion: c_m.disversion,
                        timeLong: c_m.timeLong,
                        movieUid: c_m_moiveuid,
                        movieCode: c_m_code,
                        baseMovieUid: c_m.baseMovieUid,
                        color: c_m_color,
                        boxOffice: c_m.boxOffice,
                        countrySeatRate: c_m.countrySeatRate,
                        hallSeatRate: c_m.hallSeatRate
                    })
                    if (!movie_obj[c_m_code]) {
                        movie_obj[c_m_code] = {
                            movieName: c_m_name,
                            language: c_m_lan,
                            disversion: c_m.disversion,
                            color: c_m_color,
                            movieUid: c_m_moiveuid
                        }
                    }
                }
                this.films = m_d;

                // 影厅列表
                let r_d = [];
                let r_flage = {};
                let seatCount = 0,
                    roomNum = rooms_data.length;
                for (let i = 0; i < rooms_data.length; i++) {
                    let c_data = rooms_data[i];
                    seatCount += c_data.seat_count;
                    r_d.push({
                        add_fee_amount: c_data.add_fee_amount,
                        add_fee_percentage: c_data.add_fee_percentage,
                        add_fee_type: c_data.add_fee_type,
                        hall_code: c_data.hall_code,
                        hall_name: c_data.hall_name,
                        hall_type: c_data.hall_type,
                        hall_type_code: c_data.hall_type_code,
                        is_on_add_fee: c_data.is_on_add_fee,
                        seat_count: c_data.seat_count,
                        uid_hall: c_data.uid_hall,
                        saleNum: c_data.seat_count,
                        saleMoney: c_data.boxOffice,
                        seatPercent: c_data.seatRate,
                    })
                    if (!r_flage[`${c_data.uid_hall}`]) {
                        r_flage[`${c_data.uid_hall}`] = i;
                    }
                }
                this.filmTips = {
                    seatCount,
                    roomNum
                };
                this.rooms = r_d;
                this.contentSize['height'] = r_d.length * this.contentSize.roomItemHeight;

                // 排片数据
                let p_d = [];
                let arrayLength = Object.keys(r_flage).length;
                for (let i = 0; i < arrayLength; i++) {
                    p_d.push([]);
                }

                for (let i = 0; i < planList_data.length; i++) {
                    let c_data = planList_data[i];
                    let _data = JSON.parse(JSON.stringify(c_data.schPlan));
                    _data.color = movie_obj[`${_data.movieCode}`].color;
                    _data.movieName = movie_obj[`${_data.movieCode}`].movieName;
                    _data.language = c_data.priceAndRate.movieLanguage;
                    _data.disversion = c_data.priceAndRate.disVersion;
                    _data.movieUid = movie_obj[`${_data.movieCode}`].movieUid;
                    _data.baseConfig = {
                        arrPlan: c_data.arrPlan,
                        movie: c_data.movie,
                        planUids: c_data.planUids,
                        schPlanBaseTicketList: c_data.schPlanBaseTicketList,
                        schPlanSaleChannelList: c_data.schPlanSaleChannelList,
                        uidCinema: c_data.uidCinema,
                        schPlanFavTicketlList: c_data.schPlanFavTicketlList,
                        priceAndRate: c_data.priceAndRate
                    };
                    let r_index = r_flage[`${_data.uidHall}`];
                    p_d[r_index].push(_data);
                }

                let type = null;
                // 重新触发切换编辑
                if (turnPageParam && turnPageParam.type) {
                    type = turnPageParam.type;
                }
                this.plan_list = {
                    data: p_d,
                    type
                }

            });
        },
        /* 暂停所选场次 */
        stopPlan() {
            this.$refs.filmPlan.planStop();
        },
        /* 打开所选暂停场次 */
        openPlan() {
            this.$refs.filmPlan.planOpen();
        },
        /* 当前用户不具有操作权限提示 */
        cantEdition() {
            this.$message({
                message: '请在编辑放映计划页面中进行编辑！',
                type: 'warning'
            });
        },
        /* 审核通过/驳货 */
        approvePassPlan(type) {
            this.$refs.filmPlan.approvePassPlan(type);
        }
    },
    computed: {
        windowWidth(e) {
            return this.$store.state.innerWidth;
        }
    }
};
</script>

<style lang="scss">
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
    align-items: flex-start;
    justify-content: flex-start;
}

.window_1,
.window_3 {
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
}

.window_2 {
    align-items: flex-start;
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
</style>
