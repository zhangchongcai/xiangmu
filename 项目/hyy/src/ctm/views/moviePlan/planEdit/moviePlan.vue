<template>
<section class="planWindow" ref="planArea">
    <!-- 排片占比 -->
    <filmBan ref="filmBan" :showBan="showBan" :banData="banData" @closeFilmBan="closeFilmBan"></filmBan>
    <div class="suspend-ban" @click="showFlimBan" v-if="!showBan">
        <div class="plan-single-menu">
            <i class="iconfont icon-neiye-paipiancankao plan-tool-icon"></i>
            <p class="plan-menu-name">排片参考</p>
        </div>
    </div>
    <div class="window_1" :style="{width: showBan ? 'calc(100% - 183px)' : '100%'}">
        <!-- 影片库 -->
        <filmLibary ref="filmLibary" :films="films" @selectMovie="selectMovie" :width="windowWidth - filmLibary_deleteWidth " :mode="mode"></filmLibary>
        <div class="window_2" :style="{width: windowWidth - filmScale_deleteWidth + 'px'}">
            <!-- 影厅库 -->
            <filmRoom ref="filmRoom" :scrollY="scroll.y" :rooms="rooms" :contentSize="contentSize" @selectRoom="selectRoom" :mode="mode"></filmRoom>
            <div class="window_3" >
                <!-- 刻度尺 -->
                <filmScale ref="filmScale" @saveChangeScale="saveChangeScale" :scrollX="scroll.x" :scaleConfig="scaleConfig" :width="windowWidth - filmScale_deleteWidth"></filmScale>
                <!-- 放映计划 -->
                <filmPlan ref="filmPlan" @cantEdition="cantEdition" @setMindData="setMindData" @scroll="moviePlanScorll" @cleanMovie="cleanMovie" :width="windowWidth - filmPlan_deleteWidth" :rooms="rooms" :contentSize="contentSize" :selectMovieData="selectMovieData" :baseParam="baseParam" :plan_list="plan_list" :scaleConfig="scaleConfig" @initMoivePlan="initMoivePlan" @copyMovie="selectMovie" :pricePlan="pricePlan" @changeMyData="changeMyData" :mode="mode"></filmPlan>
            </div>
        </div>
        <!-- 标注 -->
        <filmTips ref="filmTips" :width="windowWidth - filmTips_deleteWidth" :filmTips="filmTips"></filmTips>
    </div>
</section>
</template>

<script>
import filmBan from "./filmBan"
import filmLibary from "./filmLibary"
import filmRoom from "./filmRoom"
import filmScale from "./filmScale"
import filmPlan from "./filmPlan"
import filmTips from './filmTips'
import {editTimeLine, initTimeLine, cinemaStockList, cinemagetList, datePlanList, getRefTip} from 'ctm/http/interface'
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
        mode: {
            type: Number,
            default: 1
        }
    },
    watch: {
        baseParam(data, old_data) {
            this.initMoivePlan()
        },
        initFlag(data, oData) {
            if (data.movie && data.plan && data.hall) {
                let seatCount = this.hallData.reduce((count, item) => item.seatnum + count, 0), roomData = []
                this.hallData.forEach((item, i) => {
                    // status 有效 或者 无效但有排片纪录
                    if (item.status == 1 || this.planOriData.some(plan => plan.hallUid == item.uid)) {
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
                        })
                    }
                })
                this.filmTips = {
                        seatCount,
                        roomNum: roomData.length
                    }
                this.rooms = roomData
                this.contentSize['height'] = this.rooms.length * this.contentSize.roomItemHeight
                // 排片数据处理
                let planData = this.rooms.map(item => [])
                this.planOriData.forEach((item, i) => {
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
                
                this.plan_list = {
                    data: planData
                }
                this.initFlag = {
                    movie: false,
                    plan: false,
                    hall: false
                }
                this.getReference()
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
                columnDate: [],
                data: {
                    scenePer: [],
                    scene: [],
                    goldScenePer: [],
                    goldScene: []
                }
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
                },
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
        this.windowWidth = document.querySelector('.movie-plan').offsetWidth
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
    created() {
    },
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
            let keysArrary = Object.keys(this.deleteCofig)
            let _deleteWidth = null
            keysArrary.forEach(element => {
                let c_keyArrary = Object.keys(this.deleteCofig[element])
                let c_type = this.deleteCofig[element].can_delete_type
                let c_must = this.deleteCofig[element].musthType
                for (let i = 0; i < c_keyArrary.length; i++) {
                    let c_element = c_keyArrary[i]
                    if (showOrHide != 'show' && c_must == 'show') {
                        break
                    }
                    if (c_type.includes(type) && typeof this.deleteCofig[element][c_element] == 'number') {
                        _deleteWidth += Number(this.deleteCofig[element][c_element])
                    }
                }
            });
            return _deleteWidth;
        },
        /* 保存排片 */
        savePlan() {
            this.$refs.filmPlan.savePlan();
        },
        /* 我的数据 */
        setMindData(data) {
            let myBan = data.mindArr;
            // this.banData.myBan = JSON.parse(JSON.stringify(myBan.sort(this.sort("planPercent", "down"))));
        },
        /* 确定 - 修改刻度 */
        saveChangeScale(data) {

            let scaleShowConfig = data;

            let baseParam = JSON.parse(JSON.stringify(this.baseParam));
            let param = {
                planDate: baseParam.planDate,
                uidCinema: baseParam.uidCinema,
                dragPrecision: scaleShowConfig.dragPrecision,
                timeInterval: scaleShowConfig.timeInterval
            }
            editTimeLine(param).then(
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
            this.getTimeLine()
            this.getAllMovie()
            this.getRoomData().then(
                this.getPlanList(turnPageParam)
            )
        },
        getTimeLine() {
            initTimeLine({
                'uidCinema': this.baseParam.uidCinema
            }).then(data => {
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
        },
        getAllMovie() {
            cinemaStockList({
                    'targetDate': this.baseParam.planDate,
                    'uidCinema': this.baseParam.uidCinema,
                    'current': 1,
                    'size': 100,
                    'status': "1"
                }).then(res => {
                    if (res.code == 200 && res.data) {
                        let movieData = []
                        res.data.records.forEach((item, i) => {
                            movieData.push({
                                movieName: item.movieName,
                                language: item.moviedesclanguage,
                                disversion: item.disVersion,
                                timeLong: item.timeLong,
                                baseMovieUid: item.uid,
                                movieCode: item.movieCode,
                                color: (i % res.data.records.length) < (this.colorBox.length - 1) ? this.colorBox[i % res.data.records.length] : this.colorBox[(i % res.data.records.length) % this.colorBox.length],
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
            return cinemagetList({
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
            datePlanList({
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
                            path: `detail?mode=${turnPageParam.type}&uid=${uid}`
                        })
                    }
                }
            })
        },
        getReference() {
            getRefTip({
                "cinemaUid":"111111",
                "consultCinemaCode":"00000000",
                "planDate":"2019-04-15",
                "startTime":"2019-04-15 17:00:00",
                "endTime":"2019-04-15 21:00:00"
            }).then(res => {
                if (res.code == 200 && res.data) {
                    res.data.myData.forEach(item => {
                        this.films.some(film => {
                            if (film.movieCode == item.movieCode) {
                                    item.color = film.color
                                    return true
                                }
                            })
                            if (!item.color) item.color = this.colorBox[0]
                    })
                    this.banData = res.data
                }
            })
            // getPlanReference({
            //     "cinemaUid": this.baseParam.uidCinema,
            //     "currentCinemaCode": '00000000',    
            //     "consultCinemaCode": '00000000',
            //     "planDate":"2019-04-15",
            //     "startTime":"2019-04-15 17:00:00",
            //     "endTime":"2019-04-15 21:00:00",
            //     "isGold": 0
            // }).then(res => {
            //     if (res.code == 200 && res.data) {

            //         this.goldTimeStart = new Date(`${this.baseParam.planDate} ${res.data.goldTimeStart}`).getTime()
            //         this.goldTimeEnd = new Date(`${this.baseParam.planDate} ${res.data.goldTimeEnd}`).getTime()

            //         // 竞对影院
            //         this.vieCinemaArr = res.data.cinema.map(item => {
            //             item.isActive = item.id == this.curReCinema  //aisActive popover表示 是否常显
            //             return item
            //         })
                    
            //         let banData = res.data.table
            //         banData.columnDate.forEach(item => {
            //             this.films.some(film => {
            //                 if (film.movieCode == item.movieCode) {
            //                     item.color = film.color
            //                     return true
            //                 }
            //             })
            //             if (!item.color) item.color = this.colorBox[0]
            //         })

                    
            //         for (var k in banData.table) {
                        
            //             let type = ['consultCinema', 'myData', 'currentCinema'], lackArr = []
                        
            //             type.forEach(item => {
            //                 if (banData.table[k].every(value => value.type != item)) {
            //                     lackArr.push('item')
            //                 }
            //             })
            //             lackArr.forEach(value => {
            //                 let pushObj = {type: value, total: '-', cinemaName: value == 'myData' ? '我的当前数据' : value == 'currentCinema' ? this.vieCinemaArr.find(item => {
            //                     return item.cinemaCode == this.curVieCinema
            //                     }).cinema.cinemaName : this.curReCinema ? this.curVieCinemaShow : '无'}
            //                     this.columnDate.forEach(item => {
            //                         pushObj[item.movieCode] = '-'
            //                     })
            //                 banData.table[k].push(pushObj)
            //             })
            //             let arr = type.reduce((data, item) => {
            //                 return data.concat(banData.table[k].find(value => {
            //                     return value.type == item
            //                 }))
            //             }, [])
            //             banData.table[k] = arr
            //         }

            //         this.banData = banData
            //     }
            // })
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
        },
        changeMyData() {
            // 计算 排片总数 和 黄金场次总数
            let planTotal = this.$refs.filmPlan.plan_rooms.reduce((data, item) => {
                return data += item.length
            }, 0)
            let planArr = this.$refs.filmPlan.plan_rooms.reduce((data, item) => {
                return data.concat(item)
            }, [])
            let goldTotal = this.$refs.filmPlan.plan_rooms.reduce((data, item) => {
                    return data += item.reduce((cData, film) => {
                                    let startTime = film.startTime.hours < 6 ? 
                                        new Date(`${this.baseParam.planDate} ${film.startTime.hours}:${film.startTime.minute}`).getTime() + 24 * 60 * 60 * 1000 :
                                        new Date(`${this.baseParam.planDate} ${film.startTime.hours}:${film.startTime.minute}`).getTime()
                                    let endTime = film.endTime.hours < 6 ? 
                                            new Date(`${this.baseParam.planDate} ${film.endTime.hours}:${film.endTime.minute}`).getTime() + 24 * 60 * 60 * 1000 :
                                            new Date(`${this.baseParam.planDate} ${film.endTime.hours}:${film.endTime.minute}`).getTime()
                                    return startTime >= this.goldTimeStart && startTime <= this.goldTimeEnd ? cData +=1 : cData += 0
                                }, 0)    
            }, 0)
            
            this.banData.myData.forEach(item => {
                item.scene = planArr.reduce((data, film) => {
                    return film.movieCode == item.movieCode ? data += 1 : data += 0    
                }, 0)
                item.goldScene = planArr.reduce((data, film) => {
                    if (film.movieCode == item.movieCode) {
                        let startTime = film.startTime.hours < 6 ? 
                            new Date(`${this.baseParam.planDate} ${film.startTime.hours}:${film.startTime.minute}`).getTime() + 24 * 60 * 60 * 1000 :
                            new Date(`${this.baseParam.planDate} ${film.startTime.hours}:${film.startTime.minute}`).getTime()
                        let endTime = film.endTime.hours < 6 ? 
                                new Date(`${this.baseParam.planDate} ${film.endTime.hours}:${film.endTime.minute}`).getTime() + 24 * 60 * 60 * 1000 :
                                new Date(`${this.baseParam.planDate} ${film.endTime.hours}:${film.endTime.minute}`).getTime()
                        return startTime >= this.goldTimeStart && startTime <= this.goldTimeEnd ? data += 1 : data += 0   
                    } else {
                        return data += 0
                    }
                }, 0)
                item.scenePer = (item.scene / planTotal * 100) ? (item.scene / planTotal * 100).toFixed(2) + '%' : '0.00%' 
                item.goldScenePer = (item.goldScene / goldTotal * 100) ? (item.goldScene / goldTotal * 100).toFixed(2)  + '%' : '0.00%'
            })


            // for (var k in this.banData.data) {
            //     data.forEach(film => {
            //         if (k == 'scene') {
            //             type ? this.banData.data[k][1][film.movieCode]++ : this.banData.data[k][1][film.movieCode]--
            //         }
            //         let startTime = film.startTime.hours < 6 ? 
            //                 new Date(`${this.baseParam.planDate} ${film.startTime.hours}:${film.startTime.minute}`).getTime() + 24 * 60 * 60 * 1000 :
            //                 new Date(`${this.baseParam.planDate} ${film.startTime.hours}:${film.startTime.minute}`).getTime()
            //         let endTime = film.endTime.hours < 6 ? 
            //                 new Date(`${this.baseParam.planDate} ${film.endTime.hours}:${film.endTime.minute}`).getTime() + 24 * 60 * 60 * 1000 :
            //                 new Date(`${this.baseParam.planDate} ${film.endTime.hours}:${film.endTime.minute}`).getTime()
            //         if (startTime >= this.goldTimeStart && startTime <= this.goldTimeEnd) {
            //             if (k == 'goldScene') {
            //                 type ? this.banData.data[k][1][film.movieCode]++ : this.banData.data[k][1][film.movieCode]--
            //             }
            //         }
                    
                    
            //     })

            //     // 暂时不需要计算 total
            //     // total 重新计算
            //     // if (!k.includes('Per')) {
            //     //     for (var v in this.banData.data[k][1]) {
            //     //         let total = 0
            //     //         if (v != 'cinemaName' && v != 'total' && v!= 'type') {
            //     //             total += this.banData.data[k][1][v]
            //     //         }
            //     //     }
            //     //     this.banData.data[k][1][total] = total
            //     // }

            // }
            
        }
    },
    computed: {
    }
};
</script>

<style lang="scss">
.planWindow {
    height: calc(100% - 68px);
    // overflow: hidden;
    * {
        font-family: MicrosoftYaHei;
        letter-spacing: 0;
        user-select: none;
    }
    .suspend-ban {
        width: 66px;
        height: 52px;
        position: fixed;
        left: 160px;
        top: 214px;
        background: rgba(0,0,0,0.60);
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
                color: #FF8900;
                letter-spacing: 1px;
                line-height: 16px;
            }
            .plan-tool-icon {
                font-size: 14px;
                color: #FF8900;
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
        height: calc(100% - 32px) !important;
    }
    .window_2 {
        // min-height: 600px;
        height: calc(100% - 54px);
    }

    .window_3 {
        float: left;
        width: calc(100% - 128px);
        height: 100%;
        // overflow-x: scroll;
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
