<template>
    <div class="film-container">
        <div class="film-nav">
           <div class="left" @click="showFullOrder">
              <i class="common-font-size iconfont iconquanbupaiqi"></i>
              <span class="common-font-size" style="margin-left: 2px;">全部排期</span>
            </div> 
            <div class="center">
                <i class="iconfont iconzuojiantouda" @click="preDate"></i>
                <span class="common-font-size" @click="showDatePicker">{{currentDateStr}}</span>
                <i class="iconfont iconyoujiantouda" @click="nextDate"></i>
            </div>
            <div class="right" @click="refreshCurrentOrder">
                <i style="font-size: 1.36vw" class="iconfont iconshuaxin"></i>
            </div>
        </div>

        <div class="film-tab-header">
           <span :class="['default-tab', item.is_sel ? 'active' : '']" v-for="(item, index) in tabNav" :key="'film' + index" @click="selOrderType(index)">
               {{item.name}}
           </span>
        </div>

        <div v-show="getFilmData.length" class="tab-items-film-order">
            <!-- 综合排序上下按钮 -->
            <i v-show="currentTab == 'all' && getFilmData.length > 6" :class="['iconfont', 'scroll-arrow-up', 'iconxiangshangzhankaixiaojiantou', 'scroll-arrow-up-left-film']" @click="allOrderUp"></i>
            <i v-show="currentTab == 'all' && getFilmData.length > 6" :class="['iconfont', 'scroll-arrow-down', 'iconxiangxiazhankaixiaojiantou', 'scroll-arrow-down-left-film']" @click="allOrderDown"></i>

            <!-- 按电影排序左侧按钮 -->
            <i v-show="currentTab == 'film' && getFilmData.length > 6" :class="['iconfont', 'scroll-arrow-up', 'iconxiangshangzhankaixiaojiantou', 'scroll-arrow-up-left-film']" @click="filmOrderLeftUp"></i>
            <i v-show="currentTab == 'film' && getFilmData.length > 6" :class="['iconfont', 'scroll-arrow-down', 'iconxiangxiazhankaixiaojiantou', 'scroll-arrow-down-left-film']" @click="filmOrderLeftDown"></i>
            
            <!-- 按电影排序右侧按钮 -->
            <i v-show="currentTab == 'film' && filmContents.length > 6" :class="['iconfont', 'scroll-arrow-up-right', 'iconxiangshangzhankaixiaojiantou', 'scroll-arrow-up-right-film']" @click="filmOrderRightUp"></i>
            <i v-show="currentTab == 'film' && filmContents.length > 6" :class="['iconfont', 'scroll-arrow-down-right', 'iconxiangxiazhankaixiaojiantou','scroll-arrow-down-right-film']" @click="filmOrderRightDown"></i>
            
            <!-- 按影厅右侧排序按钮 -->
            <i v-show="currentTab == 'hall' && filmHallContentsArr.length > 8" :class="['iconfont', 'scroll-arrow-up-right', 'iconxiangshangzhankaixiaojiantou', 'scroll-arrow-up-right-hall']" @click="hallOrderRightUp"></i>
            <i v-show="currentTab == 'hall' && filmHallContentsArr.length > 8" :class="['iconfont', 'scroll-arrow-down-right', 'iconxiangxiazhankaixiaojiantou','scroll-arrow-down-right-hall']" @click="hallOrderRightDown"></i>
            
            <!-- 按影厅排序按钮 -->
            <i v-show="currentTab == 'hall' && getFilmHallData.length > 4" :class="['iconfont', 'scroll-arrow-up', 'iconxiangshangzhankaixiaojiantou', 'scroll-arrow-up-left-hall']" @click="hallOrderLeftUp"></i>
            <i v-show="currentTab == 'hall' && getFilmHallData.length > 4" :class="['iconfont', 'scroll-arrow-down', 'iconxiangxiazhankaixiaojiantou','scroll-arrow-down-left-hall']" @click="hallOrderLeftDown"></i>
            
            <!-- 按时间按钮 -->
            <i v-show="currentTab == 'timer' && getFilmTimeData.length > 8" :class="['iconfont', 'scroll-arrow-up-right', 'iconxiangshangzhankaixiaojiantou','scroll-arrow-up-right-timer']" @click="timerOrderUp"></i>
            <i v-show="currentTab == 'timer' && getFilmTimeData.length > 8" :class="['iconfont', 'scroll-arrow-down-right', 'iconxiangxiazhankaixiaojiantou', 'scroll-arrow-down-right-timer']" @click="timerOrderDown"></i>

          <!-- 综合排序   -->
          <swiper :options="swiperOptionAllOrder" v-show="currentTab == 'all'" ref="allFilm" class="all-order">
            <swiper-slide class="swiper-all-order-slide" v-for="(item, index) in getFilmData" :key="'film' + index">
                <all-film-order :filmInfo="item" @selectionHallId="selectionHallId(arguments[0], index)" @toFilmTab="toFilmTab(item.movieUid)"></all-film-order>
            </swiper-slide>
          </swiper>

          <!-- 按影片 -->
          <swiper :options="swiperOptionFilmTab" v-show="currentTab == 'film'" ref="filmLeft"  class="film-order-left">
            <swiper-slide v-for="(item, index) in getFilmData" :key="'film' + index">
                <film-order ref="orderLeftItem" :filmInfo="item" @changeToAll="changeToAll"></film-order>
            </swiper-slide>
          </swiper>

          <swiper :options="swiperOptionFilmContents" v-show="currentTab == 'film'" ref="filmRight" class="film-order-right">
            <swiper-slide v-for="(item, index) in filmContents" :key="'filmcontent' + index">
                <film-tab-contents ref="orderRightItem" :content="item"></film-tab-contents>
            </swiper-slide>
          </swiper>

          <!-- 按时间 -->
          <swiper :options="swiperOptionTime" v-show="currentTab == 'timer'" ref="timer" class="film-order-time">
              <swiper-slide class="swiper-timer-order-slide" v-for="(item, index) in getFilmTimeData" :key="'time' + index">
                  <time-order ref="orderRightItem" :filmInfo="item"></time-order>
              </swiper-slide>
          </swiper>

          <!-- 按影厅 -->
          <swiper :options="swiperOptionHallTab" v-show="currentTab == 'hall'" ref="hallLeft" class="hall-order-left">
             <swiper-slide v-for="(item, index) in getFilmHallData" :key="'hall' + index">
                 <hall-order ref="orderLeftItem" :filmInfo="item"></hall-order>
             </swiper-slide>
          </swiper>

          <swiper :options="swiperOptionHallContents" v-show="currentTab == 'hall'" ref="hallRight" class="hall-order-right">
            <swiper-slide v-for="(item, index) in filmHallContentsArr" :key="'filmcontent' + index">
                <hall-tab-contents ref="orderRightItem" :filmInfo="item"></hall-tab-contents>
            </swiper-slide>
          </swiper>
        </div>

        <div v-if="!getFilmData.length" style="text-align: center; color: #666; font-size: 14px;">
            请选择日期后，查看排期
        </div>
    </div>
</template>

<script>
import {queryAllFilm} from 'src/http/apis.js'
import FilmOrder from 'components/film/FilmOrder'
import FilmTabContents from 'components/film/FilmTabContents'
import TimeOrder from 'components//film/TimeOrder'
import HallOrder from 'components/film/HallOrder'
import HallTabContents from 'components/film/HallTabContents'
import AllFilmOrder from 'components/film/AllFilmOrder'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import {mapMutations, mapGetters} from 'vuex'
import {SHOW_DATE_PICKER, SHOW_FULL_ORDER, SET_FILM_CURRENT_SEL, SET_MOVIE_ID, SET_FILM_CONTENTS, SET_CURRENT_FILM_TITLE} from 'types'
export default {
    data() {
        return {
            swiperOptionAllOrder: {
                direction : 'vertical',
                slidesPerView : 6,
                mousewheel: true,
                init: false,
                speed:200
            },

            swiperOptionTime: {
                direction : 'vertical',
                slidesPerView : 8,
                mousewheel: true,
                init: false,
                speed:200
            },

            swiperOptionHallTab: {
                direction : 'vertical',
                slidesPerView : 4,
                mousewheel: true,
                init: false,
                speed:200
            },

            swiperOptionHallContents: {
                direction: 'vertical',
                slidesPerView: 8,
                mousewheel: true,
                init: false,
                speed:200
            },

            swiperOptionFilmTab: {
                direction: 'vertical',
                slidesPerView: 6,
                mousewheel: true,
                init: false,
                speed:200
            },

            swiperOptionFilmContents: {
                direction: 'vertical',
                slidesPerView: 6,
                mousewheel: true,
                init: false,
                speed:200
            },

            tabNav:[  //排期tab
                {
                  is_sel: false,
                  name: "按影片",
                  en_name: 'film'
                },
                {
                    is_sel: false,
                    name: "按时间",
                    en_name: 'timer'
                },
                {
                    is_sel: false,
                    name: "按影厅",
                    en_name: 'hall'
                }
            ],

            films: [  //按照影片排期标题
                {
                    name: "白蛇",
                    screen: "巨幕",
                    lan: "国语"
                },
                {
                    name: "疯狂外星人",
                    screen: "巨幕",
                    lan: "国语"
                },
                {
                    name: "美丽陌生人",
                    screen: "巨幕",
                    lan: "意大利"
                },
                {
                    name: "电话狂响",
                    screen: "巨幕",
                    lan: "国语"
                },
                {
                    name: "勇敢的心",
                    screen: "巨幕",
                    lan: "英语"
                },
                {
                    name: "自杀专卖店",
                    screen: "巨幕",
                    lan: "法语"
                },
                {
                    name: "疯狂外星人",
                    screen: "巨幕",
                    lan: "国语"
                },
                {
                    name: "亲爱的",
                    screen: "巨幕",
                    lan: "国语"
                },
                {
                    name: "比悲伤更悲伤的故事",
                    screen: "巨幕",
                    lan: "国语"
                },
                {
                    name: "小猪佩奇",
                    screen: "巨幕",
                    lan: "国语"
                },
                {
                    name: "欢天喜地过大年",
                    screen: "巨幕",
                    lan: "国语"
                },
            ],

            filmContentsArr: [ // 按照影片排期详细内容
                {
                    time: "08:12",
                    place: "激光厅",
                    sell: "102",
                    total: 165
                },
                {
                    time: "08:12",
                    place: "4号厅",
                    sell: "102",
                    total: 165
                },
                {
                    time: "08:12",
                    place: "8号厅",
                    sell: "102",
                    total: 165
                },
                {
                    time: "08:12",
                    place: "按摩厅",
                    sell: "102",
                    total: 165
                },
                {
                    time: "08:12",
                    place: "2号厅",
                    sell: "102",
                    total: 165
                },
                {
                    time: "08:12",
                    place: "1号厅",
                    sell: "102",
                    total: 165
                },
                {
                    time: "08:12",
                    place: "大幕厅",
                    sell: "102",
                    total: 165
                },
                {
                    time: "08:12",
                    place: "按摩厅",
                    sell: "102",
                    total: 165
                },
                {
                    time: "08:12",
                    place: "2号厅",
                    sell: "102",
                    total: 165
                },
                {
                    time: "08:12",
                    place: "1号厅",
                    sell: "102",
                    total: 165
                },
                {
                    time: "08:12",
                    place: "大幕厅",
                    sell: "102",
                    total: 165
                },
                {
                    time: "08:12",
                    place: "按摩厅",
                    sell: "102",
                    total: 165
                },
                {
                    time: "08:12",
                    place: "2号厅",
                    sell: "102",
                    total: 165
                },
                {
                    time: "08:12",
                    place: "1号厅",
                    sell: "102",
                    total: 165
                },
                {
                    time: "08:12",
                    place: "大幕厅",
                    sell: "102",
                    total: 165
                },
            ],

            filmTimeOrder: [
                {
                    name: "蜘蛛侠： 平行宇宙",
                    screen: "IMAX",
                    lan: "英语",
                    sell: 120,
                    total: 150,
                    time: "8:35"
                },
                {
                    name: "毒液",
                    screen: "IMAX",
                    lan: "英语",
                    sell: 120,
                    total: 150,
                    time: "12:35"
                },
                {
                    name: "无人区",
                    screen: "巨幕",
                    lan: "国语",
                    sell: 120,
                    total: 150,
                    time: "18:35"
                },
                {
                    name: "蜘蛛侠： 平行宇宙",
                    screen: "IMAX",
                    lan: "英语",
                    sell: 120,
                    total: 150,
                    time: "8:35"
                },
                {
                    name: "毒液",
                    screen: "IMAX",
                    lan: "英语",
                    sell: 120,
                    total: 150,
                    time: "12:35"
                },
                {
                    name: "无人区",
                    screen: "巨幕",
                    lan: "国语",
                    sell: 120,
                    total: 150,
                    time: "18:35"
                }
            ],

            halls: [
                {
                    hallid: '3432432423',
                    hallName: "激光厅"
                },
                {
                    hallid: '0080890',
                    hallName: "一号厅"
                },
                {
                    hallid: '3432432423',
                    hallName: "激光厅"
                },
                {
                    hallid: '0080890',
                    hallName: "一号厅"
                },
                {
                    hallid: '0080890',
                    hallName: "一号厅"
                },
                {
                    hallid: '3432432423',
                    hallName: "激光厅"
                },

            ],

            allfilms: []
        }
    },

    mounted() {

        // queryAllFilm().then(res => {
        //     this.allfilms = res.data
        //     this.allFilm = this.$refs.allFilm.swiper
        //     this.allFilm.init();
        // })
       
        this.timer = this.$refs.timer.swiper
        this.hallLeft = this.$refs.hallLeft.swiper
        this.hallRight = this.$refs.hallRight.swiper
        this.filmLeft = this.$refs.filmLeft.swiper
        this.filmRight = this.$refs.filmRight.swiper
        this.allFilm = this.$refs.allFilm.swiper

        this.$nextTick(() => {
            this.allFilm.init();
            this.timer.init();
            this.hallLeft.init();
            this.hallRight.init();
            this.filmLeft.init();
            this.filmRight.init();
        })
    },

    computed: {
        ...mapGetters([
            'getFilmData',
            'getFilmTimeData',
            'getFilmHallData',
            'filmOrderContentsArr',
            'filmHallContentsArr',
            'currentDateStr',
            'currentPlanCode'
        ]),

        currentTab() {
          let tab = 'all'
          this.tabNav.forEach(item => {
             if(item.is_sel) {
                 tab = item.en_name
             }
          })

          return tab;
        },

        filmContents() {
            let result = []
            for(let i = 0; i < this.filmOrderContentsArr.length; i+=2) {
                let item = this.filmOrderContentsArr.slice(i, i+2)
                result.push(item)
            }

        //    console.log(result)

            return result
        } 
    },

    methods: {

        ...mapMutations([
            SHOW_DATE_PICKER,
            SHOW_FULL_ORDER,
            SET_FILM_CURRENT_SEL,
            SET_MOVIE_ID,
            SET_FILM_CONTENTS,
            SET_CURRENT_FILM_TITLE
        ]),

        preDate() {
           this.$emit('preDate')
        },

        nextDate() {
           this.$emit('nextDate')
        },

        showFullOrder() {
           this.$emit("getAllFilmDatas")
           this.SHOW_FULL_ORDER()
        },

        //刷新
        refreshCurrentOrder() {
            this.$emit('refreshCurrentOrder')
        },

        // handerScroll(direction, ele, innerEle, rate) {
        //     let scrollHeight = this.$refs[ele].scrollHeight
        //     let boxHeight = this.$refs[ele].offsetHeight
        //     let currentScrolltop = this.$refs[ele].scrollTop
        //     let OldscroolHeight = this.$refs[ele].scrollTop
        //     let swiperHeight = (this.$refs[innerEle])[0].$el.offsetHeight
        //     if(scrollHeight>boxHeight){
        //         let Timer = setInterval( _ => {
        //             let speed = direction == 'up' ? Math.floor(swiperHeight / rate) : Math.floor(-swiperHeight / rate);
        //             this.$refs[ele].scrollTop += speed 
        //             currentScrolltop += speed;
        //             if(direction == 'up'){
        //                 if(currentScrolltop >= OldscroolHeight*1+swiperHeight){
        //                     clearInterval(Timer)
        //                 }
        //             }else if(direction == 'down') {
        //                 if(currentScrolltop <= OldscroolHeight-swiperHeight){
        //                     clearInterval(Timer)
        //                 }
        //             }
        //         },10)
        //     }
        // },

      showDatePicker() {
         this.SHOW_DATE_PICKER()
      },
      //设置当前选中的影厅及对应影票
      selectionHallId(sonIndex, faIndex) {
         this.SET_FILM_CURRENT_SEL({sonIndex, faIndex})
         this.SET_CURRENT_FILM_TITLE()
      },

      toFilmTab(id) {
         this.SET_MOVIE_ID(id)
         this.SET_FILM_CONTENTS()
         this.tabNav.forEach((item, index, arr) => {
             if(item.en_name == 'film') {
                arr[index].is_sel = true
             }
         })
      },

      allOrderUp() {
         this.allFilm.slideNext()
      },

      allOrderDown() {
         this.allFilm.slidePrev()
      },

      filmOrderLeftUp() {
        this.filmLeft.slideNext()
      },

      filmOrderLeftDown() {
        this.filmLeft.slidePrev()
      },

      filmOrderRightUp() {
        this.filmRight.slideNext()
      },

      filmOrderRightDown() {
        this.filmRight.slidePrev()
      },

      hallOrderRightUp() {
        this.hallRight.slideNext()
      },
      hallOrderRightDown() {
        this.hallRight.slidePrev()
      },
      hallOrderLeftUp() {
        this.hallLeft.slideNext();
      },
      hallOrderLeftDown() {
        this.hallLeft.slidePrev();
      },
      timerOrderUp() {
        this.timer.slideNext();
      },
      timerOrderDown() {
        this.timer.slidePrev();
      },
      changeToAll() {
        this.tabNav.forEach(item => {
              item.is_sel = false
          })
      },
      selOrderType(index) {
          this.tabNav.forEach(item => {
              item.is_sel = false
          })

          this.tabNav[index].is_sel = true;
      }
    },

    components: {
        FilmOrder,
        FilmTabContents,
        TimeOrder,
        HallOrder,
        HallTabContents,
        swiper,
        swiperSlide,
        AllFilmOrder
    }
}
</script>

<style lang="scss" scoped>
  .film-container {
      width: 100%;
      height: 75.3vh;
      user-select: none;
      box-sizing: border-box;
      border-right: 1px solid $bg-searchPaydetalTabColor;
      .film-nav {
         box-sizing: border-box;
         padding: 0 10px;
         height: 6.3vh;
         width: 100%;
         @include color('bgColor', $darkBlue-color); 
         font-size: $font-size14 !important;
         @include color('color', $white-color);
         display: flex;
         justify-content: space-between;
         align-items: center;
         .common-font-size {
             font-size: $font-size12;
             margin: 0 4px;
         }
         .center {
             cursor: pointer;
         }
         .left {
             flex: 0 0 26%;
             display: flex;
             align-items: center;
             cursor: pointer;
         }
         .right {
             flex: 0 0 14%;
             text-align: right;
         }
      }

      .film-tab-header {
          box-sizing: border-box;
          padding: 0 12px;
          width: 100%;
          height: 5.6vh;
          @include color('bgColor', $darkWhite-color);
          display: flex;
          justify-content: space-between;
          align-items: center;

          .default-tab {
              display: block;
              width: 7vw;
              height: 3.4vh;
              line-height: 3.4vh;
              text-align: center;
              font-size: $font-size12;
              color: $font-color3;
              cursor: pointer;
              border-radius: 1.7vh;

              &:hover {
                background: $blue-color;
                color: $white-color;
              }
          }

          .active {
               background: $blue-color;
               color: $white-color;
          }
      }

      .tab-items-film-order {
          width: 100%;
          display: flex;
          height: calc(100% - 11.9vh);
          position: relative;

          &:hover .iconxiangshangzhankaixiaojiantou {
              opacity: 1.0;
          }

          &:hover .iconxiangxiazhankaixiaojiantou {
              opacity: 1.0;
          }

          .iconxiangshangzhankaixiaojiantou {
              border-bottom-left-radius: 4px;
              border-bottom-right-radius: 4px;
              opacity: 0.3;
              transition: all 0.2s ease-in;
              font-size: $font-size16;
              font-weight: bold;
          }
          .iconxiangxiazhankaixiaojiantou  {
              border-top-left-radius: 4px;
              border-top-right-radius: 4px;
              opacity: 0.3;
              transition: all 0.2s ease-in;
              font-size: $font-size16;
              font-weight: bold;
          }
          .iconxiangshangzhankaixiaojiantou:hover {
              background: rgba(67, 107, 200, 0.4);
              cursor: pointer;
          }
          .iconxiangxiazhankaixiaojiantou:hover {
              background: rgba(67, 107, 200, 0.4);
              cursor: pointer;
          }
          .scroll-arrow-up, .scroll-arrow-down {
                 font-size: $font-size16;
                 display: block;
                 width: 7vw;
                 height: 2.6vh;
                 background: rgba(67, 107, 200, 0.2);
                 text-align: center;
                 position: absolute;
                 color: $font-color-white;
                 left: 2.3vw;
                 z-index: 100
             }

             .scroll-arrow-up-left-film, .scroll-arrow-down-left-film {
                 left: 2.3vw;
             }

             .scroll-arrow-up-left-hall, .scroll-arrow-down-left-hall {
                 left: 1.3vw;
             }

             .scroll-arrow-up-right, .scroll-arrow-down-right {
                 font-size: $font-size12;
                 display: block;
                 width: 7vw;
                 height: 2.6vh;
                 background: rgba(67, 107, 200, 0.2);
                 text-align: center;
                 position: absolute;
                 @include color('color', $white-color);
                 z-index: 750;
             }

             .scroll-arrow-up-right-film, .scroll-arrow-down-right-film {
                 right: 5.7vw;
             }

             .scroll-arrow-up-right-hall, .scroll-arrow-down-right-hall {
                 right: 6.7vw;
             }

             .scroll-arrow-up-right-timer, .scroll-arrow-down-right-timer {
                 right: 22.1vw;
             }

             .scroll-arrow-up, .scroll-arrow-up-right {
                top: 0;
             }

             .scroll-arrow-down, .scroll-arrow-down-right {
                bottom: 0;
             }

          .all-order {
              width: 100%;
              height: 100%;
              overflow: scroll;
              &::-webkit-scrollbar {display:none};
            //   border-right: 1px solid $bg-searchPaydetalTabColor;

              .swiper-all-order-slide:nth-of-type(even) {
                  @include color('bgColor', $lightWhite-color);
              }
          }

          .film-order-time {
              width: 100%;
              height: 100%;
              overflow: scroll;
              &::-webkit-scrollbar {display:none};
            //   border-right: 1px solid $bg-searchPaydetalTabColor;

              .swiper-timer-order-slide:nth-of-type(even) {
                  @include color('bgColor', $lightWhite-color);
              }
          }

          .film-order-left {
              width: 11.7vw;
              height: 100%;
              overflow: scroll;
              border-right: 1px solid $bg-searchPaydetalTabColor;
              &::-webkit-scrollbar {display:none}
          }

          .film-order-right {
              width: calc(100% - 11.7vw);
              height: 100%;
              overflow: scroll;
              &::-webkit-scrollbar {display:none};
              margin-left: -1px;
          }

           .hall-order-left {
              width: 9.5vw;
              height: 100%;
              border-right: 1px solid $bg-searchPaydetalTabColor;
          }

          .hall-order-right {
              width: calc(100% - 9.5vw);
              height: 100%;
              overflow: scroll;
              &::-webkit-scrollbar {display:none}
              margin-left: -1px;
              margin-top: 1px;
          }
      }
  }
</style>


