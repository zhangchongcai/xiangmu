<template>
    <div class="full-container">

        <!-- 头部内容 -->
       <div class="full-header">
         <span class="page-title">全部排期</span>
         <span class="date-control">
            <i class="iconfont iconzuojiantouda" @click="preDate"></i>
            <span class="common-font-size" @click="showDatePicker">{{currentDateStr}}</span>
            <i class="iconfont iconyoujiantouda" @click="nextDate"></i>
         </span>
         <span class="tab-box">
             <span v-for="(item, index) in tabNav" :key="'nav' + index" :class="['tab-btn', currentNav == item.id ? 'sel-nav' : '']" @click="changeTab(item.id)">{{item.name}}</span>
         </span>
         <el-checkbox class="check-font" v-model="outline">只显示可售场次</el-checkbox>
         <i class="iconfont iconshuaxin" @click="refreshCurrentOrder"></i>
       </div>


       <div class="contents" ref="scrollContainer">

           <!-- 按照电影 -->
         <div v-if="currentNav == 'film'">
              <div v-for="(item, index) in allfilmData" :key="'film' + index" :class="['item', index % 2 == 0 ? 'light-blue' : '']">
                    <div class="item-left">
                        <span class="film-name">{{item.name}}</span>
                        <span class="film-tip">
                            <span class="tip">{{item.play_effect}}</span>
                            <span class="tip">{{item.language}}</span>
                        </span>
                        <i class="iconfont iconyoujiantouda"></i>
                    </div>

                    <div class="item-right">
                    <div ref="scorllUnit" v-for="(plan, index) in item.arr_plan_list" :key="'plan' + index" :class="['item-right-item', currentFilmId == plan.id ? 'selected' : '']" @click="setId(plan.id, plan.plan_code, plan.allow_single_sold)">
                        <span class="play-time">{{plan.show_time.substring(10, 16)}}</span>
                        <span class="play-hall">{{plan.hall_name}}</span>
                        <span class="hall-info">
                            <span>已售{{plan.soldnum + '/' + plan.seatnum}}</span>
                        </span>

                        <i v-show="currentFilmId == plan.id" class="iconfont selection-pos iconchangcixuanzhongzhuangtai"></i>
                    </div>
                    </div>
                </div>
         </div>
          
           <!-- 按照时间 -->
          <div v-if="currentNav == 'time'">
              <div v-for="(item, index) in allTimeData" :key="'timer' + index" :class="['item', index % 2 == 0 ? 'light-blue' : '']">
                    <div class="item-left" style="align-items: center">
                    <span class="film-time">{{item.start_time + '-' + item.end_time}}</span>
                    <i class="iconfont iconyoujiantouda"></i>
                    </div>

                    <div class="item-right">
                    <div ref="scorllUnit" v-for="(plan, index) in item.arr_plan_list" :key="'plan' + index" :class="['item-right-item-time', currentFilmId == plan.id ? 'selected' : '']" @click="setId(plan.id, plan.plan_code, plan.allow_single_sold)">
                        <span class="play-name">{{plan.name}}</span>
                        <span class="play-time">{{plan.show_time.substring(10, 16)}}</span>
                        <span class="hall-info">
                            <span class="film-tip">
                                <span class="tip">{{plan.play_effect}}</span>
                                <span class="tip">{{plan.language}}</span>
                            </span> 
                            <span>已售{{plan.soldnum + '/' + plan.seatnum}}</span>
                        </span>

                        <i v-show="currentFilmId == plan.id" class="iconfont selection-pos iconchangcixuanzhongzhuangtai"></i>
                    </div>
                    </div>
                </div>
          </div>

          <!-- 按照影厅 -->
          <div v-if="currentNav == 'hall'">
              <div v-for="(item, index) in allHallData" :key="'film' + index" :class="['item', index % 2 == 0 ? 'light-blue' : '']">
                    <div class="item-left" style="align-items: center">
                    <span class="film-time">{{item.hall_name}}</span>
                    <span class="film-seats">({{item.seatnum + '座'}})</span>
                    <i class="iconfont iconyoujiantouda"></i>
                    </div>

                    <div class="item-right">
                    <div ref="scorllUnit" v-for="(plan, index) in item.arr_plan_list" :key="'plan' + index" :class="['item-right-item-time',  currentFilmId == plan.id ? 'selected' : '']" @click="setId(plan.id, plan.plan_code, plan.allow_single_sold)">
                        <span class="play-name">{{plan.name}}</span>
                        <span class="play-time">{{plan.show_time.substring(10, 16)}}</span>
                        <span class="hall-info">
                            <span class="film-tip">
                                <span class="tip">{{plan.play_effect}}</span>
                                <span class="tip">{{plan.language}}</span>
                            </span> 
                            <span>已售{{plan.soldnum + '/' + plan.seatnum}}</span>
                        </span>

                        <i v-show="currentFilmId == plan.id" class="iconfont selection-pos iconchangcixuanzhongzhuangtai"></i>
                    </div>
                    
                    </div>
                </div>
          </div>

       </div>
       <!-- 底部翻页 -->
       <div class="full-footer">
         <div class="pager">
             <i class="iconfont iconshangjiantouanniu" @click="turnUp"></i>
             <i class="iconfont iconxiajiantouanniu" @click="turnDown"></i>
         </div>

         <div class="close">
             <span class="btn-common close-btn" @click="closeFull">关闭</span>
             <span class="btn-common history-btn">历史排期</span>
         </div>
       </div>
    </div>
</template>

<script>
import {mapMutations, mapGetters} from 'vuex'
import { SHOW_FULL_ORDER, SET_FILM_CURRENT_SEL_ID, SHOW_DATE_PICKER, SET_CURRENT_PLANCODE, SET_CURRENT_FILM_TITLE } from 'types'
export default {
    data() {
        return {
            outline: false,
            tabNav: [
                {
                    name: '按电影',
                    id: 'film'
                },
                {
                    name: '按时间',
                    id: 'time'
                },
                {
                    name: '按影厅',
                    id: 'hall'
                }
            ],

            currentNav: 'film'
        }
    },

    computed: {
       ...mapGetters([
            'allfilmData',
            'allTimeData',
            'allHallData',
            'currentFilmId',
            'getDatePicker',
            'currentDateStr'
       ])
    },

    methods: {

        ...mapMutations([
           SHOW_FULL_ORDER,
           SET_FILM_CURRENT_SEL_ID,
           SHOW_FULL_ORDER,
           SHOW_DATE_PICKER,
           SET_CURRENT_PLANCODE,
           SET_CURRENT_FILM_TITLE
        ]),

        //刷新
        refreshCurrentOrder() {
            this.$emit('refreshCurrentOrder')
        },

        preDate() {
           this.$emit('preDate')
        },

        nextDate() {
           this.$emit('nextDate')
        },

        setId(id, code, allowSingle) {
            let codeAndSingle = {
                code,
                allowSingleSold: parseInt(allowSingle) ? true : false
            }
            this.SET_FILM_CURRENT_SEL_ID(id)
            this.SET_CURRENT_PLANCODE(codeAndSingle)
            this.SET_CURRENT_FILM_TITLE()
            this.SHOW_FULL_ORDER()
        },

        //打开日历
        showDatePicker() {
            this.SHOW_DATE_PICKER()
        },



        closeFull() {
          this.SHOW_FULL_ORDER()
        },

        handerScroll(direction, ele, innerEle, rate) {
            let scrollHeight = this.$refs[ele].scrollHeight
            let boxHeight = this.$refs[ele].offsetHeight
            let currentScrolltop = this.$refs[ele].scrollTop
            let OldscroolHeight = this.$refs[ele].scrollTop
            let swiperHeight = (this.$refs[innerEle])[0].offsetHeight
            if(scrollHeight>boxHeight){
                let Timer = setInterval( _ => {
                    let speed = direction == 'up' ? Math.floor(swiperHeight / rate) : Math.floor(-swiperHeight / rate);
                    this.$refs[ele].scrollTop += speed 
                    currentScrolltop += speed;
                    if(direction == 'up'){
                        if(currentScrolltop >= OldscroolHeight*1+swiperHeight){
                            clearInterval(Timer)
                        }
                    }else if(direction == 'down') {
                        if(currentScrolltop <= OldscroolHeight-swiperHeight){
                            clearInterval(Timer)
                        }
                    }
                },10)
            }
        },

        turnUp() {
          this.handerScroll('up', 'scrollContainer', 'scorllUnit', 15)
        },

        turnDown() {
          this.handerScroll('down', 'scrollContainer', 'scorllUnit', 15)
        },
        
        //打开日历
        showDatePicker() {
            this.SHOW_DATE_PICKER()
        },

        changeTab(id) {
            this.currentNav = id;
        }
    },
}
</script>

<style lang="scss" scoped>
   .full-container {
       width: 100vw;
       height: 100vh;
       position: fixed;
       top: 0;
       left: 0;
       background: #ffffff;
       z-index: 1000;
       user-select: none;
       transition: all 0.3s ease-in;

       .full-header {
           width: 100vw;
           height: 6.3vh;
           @include bg_color($themeColor);
           color: $font-color-white !important;
           display: flex;
           justify-content: space-between;
           align-items: center;

           .page-title {
               font-size: $font-size16;
               padding: 0 7vw 0 1.8vw;
           }

           .date-control {
               font-size: $font-size14;
               padding-right: 6vw;
               cursor: pointer;

               .common-font-size {
                   font-size: $font-size13;
               }
           }

           .tab-box {
               padding-right: 8vw;

               .tab-btn {
                   display: inline-flex;
                   height: 3.6vh;
                   width: 7.8vw;
                   border-radius: 1.8vh;
                   justify-content: center;
                   align-items: center;
                   margin: 0 1.8vw;
                   font-size: $font-size14;
                   cursor: pointer;
                   transition: all 0.2s ease-out;

                   &:hover {
                       background: $btn-background-color-theme;
                   }
               }

               .sel-nav {
                   background: $btn-background-color-theme;
               }
           }

           .check-font {
               color: $font-color-white;
           }


           .iconshuaxin {
               font-size: $font-size14;
               padding-right: 1.8vw;
           }
       }

       .contents {
           width: 100vw;
           height: calc(100vh - 8.2vh - 6.3vh);
           overflow: scroll;
           &::-webkit-scrollbar {display:none}

           .light-blue {
               background: #f1f1f1;
           }

           .item {
               box-sizing: border-box;
               width: 100%;
               display: flex;
               min-height: 10.5vh;

               .item-left {
                   flex: 0 0 16.4vw;
                   width: 16.4vw;
                   min-height: 10.5vh;
                   display: flex;
                   box-sizing: border-box;
                   padding-left: 1.4vw;
                   flex-direction: column;
                   justify-content: center;
                   align-items: flex-start;
                   border-right: 1px solid $bg-searchPaydetalTabColor;
                   border-bottom: 1px solid $bg-searchPaydetalTabColor;
                   position: relative;

                   .iconyoujiantouda {
                       color: #bbcfff;
                       font-size: $font-size16;
                       position: absolute;
                       right: 4px;
                       top: 50%;
                       transform: translateY(-50%);
                   }

                   .film-name {
                       font-size: $font-size14;
                       font-weight: bold;
                       margin-bottom: 2px;
                   }

                   .film-seats {
                       font-size: $font-size12;
                   }

                   .film-time {
                       font-size: $font-size16;
                       font-weight: bold;
                   } 

                   .film-tip {
                       display:flex;
                       justify-content: flex-start;

                       .tip {
                           font-size: $font-size12;
                           color:$font-color-white;
                           height: 2.4vh;
                           border-radius: 1.2vh;
                           padding: 0 0.6vw;
                           display: inline-flex;
                           justify-content: center;
                           align-items: center;
                           background: $btn-background-color-theme;
                           margin-right: 4px;
                       }
                   }
               }

               .item-right {
                   flex: 0 0 1;
                   width: calc(100vw - 16.4vw);
                   display: flex;
                   justify-content: flex-start;
                   flex-wrap: wrap;

                   .item-right-item {
                       width: calc((100vw - 16.4vw) / 7);
                       height: 10.5vh;
                       box-sizing: border-box;
                       border: 1px solid $bg-searchPaydetalTabColor;
                       display: flex;
                       flex-direction: column;
                       justify-content: center;
                       align-items: flex-start;
                       padding-left: 1.1vw;
                       margin-left: -1px;
                       cursor: pointer;
                       position: relative;
                       .selection-pos {
                            position: absolute;
                            right: 0;
                            top:0;
                            font-size: $font-size12;
                        }

                       &.selected {
                           box-shadow: 0 0 1px 1px inset $btn-background-color-theme;
                       }


                       &:hover {
                            box-shadow: 0 0 1px 1px inset $btn-background-color-theme;
                        }

                       .play-time {
                           color: $font-color3;
                           font-weight: bold;
                           font-size: $font-size16;
                       }

                       .play-hall, .hall-info {
                           color: $font-color6;
                           font-size: $font-size12;
                       }
                   }

                   .item-right-item-time {
                       width: calc((100vw - 16.4vw) / 4);
                       height: 10.5vh;
                       box-sizing: border-box;
                       border: 1px solid $bg-searchPaydetalTabColor;
                       display: flex;
                       flex-direction: column;
                       justify-content: center;
                       align-items: flex-start;
                       padding-left: 1.1vw;
                       padding-right: 1.1vw;
                       margin-left: -1px;
                       cursor: pointer;
                       position: relative;

                       &.selected {
                           box-shadow: 0 0 1px 1px inset $btn-background-color-theme;
                       }

                       .selection-pos {
                            position: absolute;
                            right: 0;
                            top:0;
                            font-size: $font-size12;
                        }

                       &:hover {
                            box-shadow: 0 0 1px 1px inset $btn-background-color-theme;
                        }

                       .play-name {
                           color: $font-color3;
                           font-size: $font-size13;
                       }

                       .play-time {
                           color: $font-color3;
                           font-weight: bold;
                           font-size: $font-size12;
                           margin: 4px 0;
                       }

                       .hall-info {
                           display: flex;
                           width: 100%;
                           justify-content: space-between;
                           color: $font-color6;
                           font-size: $font-size12;

                           .film-tip {
                                display:flex;
                                justify-content: flex-start;

                                .tip {
                                    font-size: $font-size12;
                                    color:$font-color-white;
                                    height: 2.4vh;
                                    display: inline-flex;
                                    justify-content: center;
                                    align-items: center;
                                    border-radius: 1.2vh;
                                    padding: 0 0.6vw;
                                    background: $btn-background-color-theme;
                                    margin-right: 4px;
                                }
                            }
                       }
                   }
               }
           }
       }


       .full-footer {
           width: 100vw;
           height: 8.2vh;
           position: absolute;
           bottom: 0;
           left: 0;
           background: #ffffff;
           border-top: 1px solid #dedede;

           .pager {
               position: absolute;
               left: 50%;
               top: 50%;
               transform: translate(-50%, -50%);

               .iconshangjiantouanniu,
                .iconxiajiantouanniu {
                    font-size: $font-size22;
                    margin: 0 14px;
                    color: $font-color-blue;
                }

                .iconfont {
                    cursor: pointer;
                }
           }

           .close {
               position: absolute;
               right: 0;
               top: 50%;
               transform: translateY(-50%);

               .btn-common {
                  width: 7.8vw;
                  height: 4.2vh;
                  border-radius: 2px;
                  display: inline-flex;
                  justify-content: center;
                  align-items: center;
                  border: 1px solid $btn-background-color-theme;
                  margin: 0 14px;
                  font-size: $font-size12;
               }

               .close-btn {
                   color: $font-color-blue;
               }

               .history-btn {
                   background: $btn-background-color-theme;
                   color: $font-color-white;
               }
           }
       }
   }
</style>


