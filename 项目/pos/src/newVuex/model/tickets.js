import * as TYPES from '../types'

export default {
    state: {
        showBar: true,
        seatSelection: [],
        isExtend: false,
        datePicker: false,
        fullOrder: false,
        showMoreNav: false,
        checkCouponBox: false,
        checkResult: false,
        filmData: [],
        filmTimeData: [],
        filmHallData: [],
        filmHallContentsArr: [],
        filmOrderContentsArr: [],
        allfilmData:[],
        allTimeData:[],
        allHallData:[],
        currentFilmId: '',
        currentMovieId: '',
        currentHallId: '',
        currentTicketId: '',
        currentPlanCode: '',
        currentFilmTitle: '',
        allPayWays: [],
        allTickets: [],
        allSeat: [],
        currentDateStr: '',
        allowSingleSold: false,
        ticketsStatus: {
            totalSeat: 0,
            isSell: 0,
            mallSell: 0,
            netSell: 0,
            isLocked: 0,
            isHeld: 0,
            cantNotSell: 0,
            noTaken: 0,
            isBroken: 0
        }
    },
    mutations: {
        //间隔3s请求一次座位状态
        [TYPES.CHECK_CURRENT_SEAT_STATUS] : (state, obj) => {

           obj.timeSeatStatusList.forEach(item => {
               state.allSeat.forEach(seat => {
                   if(item.seatCode == seat.seatCode) {
                       seat.status = item.status
                   }
               })
           })



           state.allSeat.forEach(item => {

            // 配置不同座位颜色
            switch(item.status){
                case 0:
                item.colorStyle = 'broken-seat';
                break;
                case 2:
                item.colorStyle = 'sold-seat';
                break;
                case 3:
                item.colorStyle = 'seat-default-style-active';
                break;
                case 4:
                item.colorStyle = 'hold-seat';
                break;
                case 1:
                item.colorStyle = 'seat-default-style';
                break;
              }
            })

            state.ticketsStatus.mallSell = obj.sceneSaleNum
            state.ticketsStatus.isLocked = obj.lockNum
            state.ticketsStatus.isHeld = obj.reserveNum
            state.ticketsStatus.netSell = obj.netSaleNum
            state.ticketsStatus.isSell = state.ticketsStatus.totalSeat - state.ticketsStatus.isBroken - obj.saleNum - obj.reserveNum - obj.lockNum
        },

        [TYPES.SAVE_ALL_FILM_DATA] : (state, filmArr) => {
            state.allfilmData = filmArr
        },
        [TYPES.SAVE_ALL_TIME_DATA] : (state, filmArr) => {
            state.allTimeData = filmArr
        },
        [TYPES.SAVE_ALL_HALL_DATA] : (state, filmArr) => {
            state.allHallData = filmArr
        },
        [TYPES.SHOW_BOTTOM_BAR] : (state) => {
            state.showBar = !state.showBar
        },
        [TYPES.SEAT_SELECTION] : (state, seat) => {
            // console.log(seat)
            state.seatSelection = seat.concat(state.seatSelection)
        },
        [TYPES.DEL_SEAT] : (state, seatId) => {
                state.seatSelection = state.seatSelection.filter(item => {
                //    return groupCode != item.groupCode
                   if(Number(state.allowSingleSold)) {
                       return seatId != item.seatCode
                   }else {
                       return seatId != item.groupCode
                   }
                })
        },
        [TYPES.CLEAR_SELECTION] : (state) => {
            state.seatSelection = []
            // state.allSeat.forEach(item => {
            //     // item.is_sel = false
            // })
        },
        [TYPES.EXTEND_SEAT] : (state) => {
            state.isExtend = !state.isExtend
        },
        [TYPES.SHOW_MORE_NAV] : (state) => {
            state.showMoreNav = !state.showMoreNav
        },
        [TYPES.SAVE_ALL_PAY] : (state, arr) => {
            state.allPayWays = arr
        },
        [TYPES.SHOW_DATE_PICKER] : (state) => {
            state.datePicker = !state.datePicker
        },
        [TYPES.SAVE_FILM_DATA] : (state, filmArr) => {
            state.filmData = filmArr
            state.filmOrderContentsArr = filmArr[0].arr_plan_list
            state.currentFilmId = filmArr[0].arr_plan_list[0].id
            state.currentPlanCode = filmArr[0].arr_plan_list[0].plan_code
            state.allowSingleSold = filmArr[0].arr_plan_list[0].allow_single_sold
            state.allTickets = filmArr[0].arr_plan_list[0].arr_basic_ticket_type
            state.currentTicketId = state.allTickets[0].id
            state.currentMovieId = filmArr[0].movieUid

            let currentFilm = {}
            filmArr.forEach(item => {
                item.arr_plan_list.forEach(inner => {
                    if(inner.id == state.currentFilmId) {
                        currentFilm = inner
                        Object.assign(currentFilm,  {
                            name: item.name,
                            display_name: item.display_name,
                            language: item.language
                        })
                    }
                })
            })

            state.currentFilmTitle = `${currentFilm.name}(${currentFilm.display_name}/${currentFilm.language}) | ${currentFilm.show_time} | ${currentFilm.hall_name} | ${currentFilm.time_long}分钟`
        },
        [TYPES.SET_CURRENT_TICKET_ID] : (state, id) => {
            state.currentTicketId = id
        },
        [TYPES.SET_CURRENT_FILM_TITLE] : (state) => {
            let currentFilm = {}
            state.filmData.forEach(item => {
                item.arr_plan_list.forEach(inner => {
                    if(inner.id == state.currentFilmId) {
                        currentFilm = inner
                        Object.assign(currentFilm,  {
                            name: item.name,
                            display_name: item.display_name,
                            language: item.language
                        })
                    }
                })
            })

            state.currentFilmTitle = `${currentFilm.display_name} | ${currentFilm.show_time} | ${currentFilm.hall_name} | ${currentFilm.time_long}分钟`

            // console.log('film-name:' + state.currentFilmTitle)
        },
        [TYPES.SET_FILM_CONTENTS] : (state) => {
            let arr = state.filmData.filter(item => {
                return item.movieUid == state.currentMovieId
            })

            state.filmOrderContentsArr = arr[0].arr_plan_list
        },
        [TYPES.SET_FILM_CURRENT_SEL] : (state, index) => {
            state.currentFilmId = state.filmData[index.faIndex].arr_plan_list[index.sonIndex].id
            state.currentPlanCode = state.filmData[index.faIndex].arr_plan_list[index.sonIndex].plan_code
            state.allowSingleSold = state.filmData[index.faIndex].arr_plan_list[index.sonIndex].allow_single_sold
            state.currentTicketId = state.filmData[index.faIndex].arr_plan_list[index.sonIndex].arr_basic_ticket_type[0].id
            state.allTickets = state.filmData[index.faIndex].arr_plan_list[index.sonIndex].arr_basic_ticket_type
        },
        [TYPES.SET_FILM_CURRENT_SEL_ID] : (state, filmId) => {
            state.currentFilmId = filmId
            state.filmData.forEach(item => {
                item.arr_plan_list.forEach(inner => {
                    if(inner.id == filmId) {
                        state.allTickets = inner.arr_basic_ticket_type
                        state.currentTicketId = state.allTickets[0].id
                    }
                })
            })
        },
        [TYPES.SET_MOVIE_ID] : (state, moveId) => {
            state.currentMovieId = moveId
        },
        [TYPES.SET_HALL_ID] : (state, hallId) => {
            state.currentHallId = hallId
        },
        [TYPES.SAVE_TIME_DATA] : (state, filmArr) => {
            state.filmTimeData = filmArr
        },
        [TYPES.SAVE_HALL_DATA] : (state, filmArr) => {
            state.filmHallData = filmArr
            state.filmHallContentsArr = filmArr[0].arr_plan_list //右侧影厅对应的播放计划
            state.currentHallId = filmArr[0].hall_id
        },
        [TYPES.SET_HALL_CONTENTS] : (state) => {
            let arr = state.filmHallData.filter(item => {
                return item.hall_id == state.currentHallId
            })

            state.filmHallContentsArr = arr[0].arr_plan_list
        },
        [TYPES.SHOW_FULL_ORDER] : (state) => {
            state.fullOrder = !state.fullOrder
        },
        [TYPES.CHECK_OUT_COUPON] : (state) => {
            state.checkCouponBox = !state.checkCouponBox
        },
        [TYPES.CHECK_OUT_COUPON_RESULT] : (state) => {
            state.checkResult = !state.checkResult
        },
        [TYPES.SAVE_CURRENT_PLAN_SEAT] : (state, seatsArr) => {
           if(seatsArr.length) {
            seatsArr.sort((a, b) => {
                return a.ulX - b.ulX
            })
            let minX = parseFloat(seatsArr[0].ulX)
            
            seatsArr.sort((a, b) => {
                return a.ulY - b.ulY
            })
            let minY = parseFloat(seatsArr[0].ulY)
            state.allSeat = seatsArr.map((item) => {
                let obj = {
                  cinemaCode: item.cinemaCode,
                  cinemaUid: item.cinemaUid,
                  planCode: item.planCode,
                  seatCode: item.seatCode,
                  col: item.seatCol,
                  groupCode: item.groupCode,
                  priority: item.seatLevel,
                  row: item.seatRow,
                  type: item.seatType,
                  width: item.width,
                  x: parseInt(item.ulX - minX) * 2.7,
                  y: parseInt(item.ulY - minY) * 2.7,
                  status: item.status,
                  imageType: item.imageType,
                  seat_name: `${item.seatRow}排${item.seatCol}座`
                }

                return obj
              })

              state.allSeat.forEach(item => {

                // 配置不同座位颜色
                switch(item.status){
                    case 0:
                    item.colorStyle = 'broken-seat';
                    break;
                    case 2:
                    item.colorStyle = 'sold-seat';
                    break;
                    case 3:
                    item.colorStyle = 'seat-default-style-active';
                    break;
                    case 4:
                    item.colorStyle = 'hold-seat';
                    break;
                    case 1:
                    item.colorStyle = 'seat-default-style';
                    break;
                  }
    
                switch(item.imageType) {
                    case 1:
                    item.seatIcon = 'iconputongzuoyi';
                    break;
                    case 2:
                    item.seatIcon = 'iconqinglvzuoyizuo1';
                    break;
                    case 3:
                    item.seatIcon = 'iconqinglvzuoyiyou1';
                    break;
                    case 4:
                    item.seatIcon = 'iconduorenzuoyizuo';
                    break;
                    case 5:
                    item.seatIcon = 'iconduorenzuoyizhong';
                    break;
                    case 6:
                    item.seatIcon = 'iconduorenzuoyiyou';
                    break;
                    case 7:
                    item.seatIcon = 'iconcanjizuoyi';
                    break;
                    case 8:
                    item.seatIcon = 'iconputongzuoyi';
                    break;
                    case 9:
                    item.seatIcon = 'iconanmozuoyi';
                  }  
                })
                state.ticketsStatus.totalSeat =  state.allSeat.length
                let brokenArr = state.allSeat.filter(item => {
                    return item.status == 0
                })
                let soldArr = state.allSeat.filter(item => {
                    return item.status == 2
                })
                let lockArr = state.allSeat.filter(item => {
                    return item.status == 3
                })
                state.ticketsStatus.isBroken = brokenArr.length
                state.ticketsStatus.mallSell = soldArr.length
                state.ticketsStatus.isLocked = lockArr.length
                state.ticketsStatus.isSell = state.ticketsStatus.totalSeat - state.ticketsStatus.isBroken - state.ticketsStatus.mallSell - state.ticketsStatus.isLocked
                
           }else {
            state.allSeat = []
            state.filmData = []
            state.filmTimeData = []
            state.filmHallData = []
            state.filmHallContentsArr = []
            state.filmOrderContentsArr = []
            state.allfilmData = []
            state.allTimeData = []
            state.allHallData = []
            state.allTickets = []
           }
        },
        [TYPES.SET_CURRENT_DATE] : (state, str) => {
            state.currentDateStr = str
        },
        [TYPES.SET_CURRENT_PLANCODE] : (state, codeAndSingle) => {
            state.currentPlanCode = codeAndSingle.code
            state.allowSingleSold = codeAndSingle.allowSingleSold
        },
        //添加购物车后渲染选中的座位
        [TYPES.RENDER_SELECTION] : (state, obj) => {
            if(state.allowSingleSold) {
                obj.goodsList.forEach(item => {
                    state.allSeat.forEach((seat, index, seats) => {
                        if(item.timeSeat.seatCode == seat.seatCode) {
                            seats[index].status = item.timeSeat.status
                        }
                    })
                })
            }else {
                obj.goodsList.forEach(item => {
                    state.allSeat.forEach((seat, index, seats) => {
                        if(item.timeSeat.groupCode == seat.groupCode) {
                            seats[index].status = item.timeSeat.status
                        }
                    })
                })
            }
        },
        //释放后渲染选中的座位
        [TYPES.RENDER_SELECTION_AFTER_RELEASE] : (state, obj) => {
            console.log(obj)
            if(state.allowSingleSold) {
                obj.timeSeatList.forEach(item => {
                    state.allSeat.forEach((seat, index, seats) => {
                        if(item.seatCode == seat.seatCode) {
                            seats[index].status = item.status
                        }
                    })
                })
            }else {
                obj.timeSeatList.forEach(item => {
                    state.allSeat.forEach((seat, index, seats) => {
                        if(item.groupCode == seat.groupCode) {
                            seats[index].status = item.status
                        }
                    })
                })
            }

            state.allSeat.forEach(item => {

                // 配置不同座位颜色
                switch(item.status){
                    case 0:
                    item.colorStyle = 'broken-seat';
                    break;
                    case 2:
                    item.colorStyle = 'sold-seat';
                    break;
                    case 3:
                    item.colorStyle = 'seat-default-style-active';
                    break;
                    case 4:
                    item.colorStyle = 'hold-seat';
                    break;
                    case 1:
                    item.colorStyle = 'seat-default-style';
                    break;
                  }
                })
        }
    },
    getters: {
        // 判断是否可以单买
        allowSingleSold(state) {
            return Number(state.allowSingleSold)
        },
        currentPlanCode(state) {
           return state.currentPlanCode
        },
        currentDateStr(state) {
            return state.currentDateStr
        },
        allSeat(state) {
            return state.allSeat
        },
        showBar(state) {
            return state.showBar
        },
        showMoreNav(state) {
            return state.showMoreNav
        },
        seatSelection(state) {
            return state.seatSelection
        },
        isExtends(state) {
            return state.isExtend
        },
        fullOrder(state) {
           return state.fullOrder
        },
        allPayWays(state) {
            return state.allPayWays
        },
        allTickets(state) {
            return state.allTickets
        },
        getDatePicker(state) {
           return state.datePicker
        },
        getFilmData(state) {
           return state.filmData
        },
        getFilmTimeData(state) {
            return state.filmTimeData
        },
        getFilmHallData(state) {
            return state.filmHallData
        },
        checkCouponBox(state) {
            return state.checkCouponBox
        },
        filmHallContentsArr(state) {
            return state.filmHallContentsArr
        },
        filmOrderContentsArr(state) {
            return state.filmOrderContentsArr
        },
        currentFilmId(state) {
            return state.currentFilmId
        },
        currentMovieId(state) {
            return state.currentMovieId
        },
        currentHallId(state) {
            return state.currentHallId
        },
        currentTicketId(state) {
            return state.currentTicketId     
        },
        currentFilmTitle(state) {
            return state.currentFilmTitle
        },
        allfilmData(state) {
            return state.allfilmData
        },
        allTimeData(state) {
            return state.allTimeData
        },
        allHallData(state) {
            return state.allHallData
        },
        checkResult(state) {
            return state.checkResult
        },
        pagesSeatSelection(state) {
            let tempArr = state.seatSelection;
            let len = tempArr.length;
            let selectedPages = []
            if(len) {
                for(let i = 0; i < tempArr.length; i += 5) {
                    selectedPages.push(tempArr.slice(i, i+5))
                }
            }else {
              selectedPages = []
            }

            return selectedPages;
        },
        ticketsStatus(state) {
            return state.ticketsStatus
        }
    }
}