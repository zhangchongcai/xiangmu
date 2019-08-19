<template>
    <div class="time-order-container" @click="setFilmId(filmInfo.id, filmInfo.plan_code, filmInfo.allow_single_sold, filmInfo.min_price)">
        <div :class="['time', currentFilmId == filmInfo.id ? 'time-selected' : '']">
            {{filmInfo.next_day + filmInfo.show_time.substring(10, 16)}}
        </div>
        <div :class="['detail', currentFilmId == filmInfo.id ? 'selected' : '']">
            <el-tooltip effect="dark" :content="filmInfo.join_flag == 1 ? filmInfo.display_name : filmInfo.name" placement="bottom">
                <div :class="['detail-name', currentFilmId == filmInfo.id ? 'font-selected' : '']">
                    {{filmInfo.join_flag == 1 ? filmInfo.display_name : filmInfo.name}}
                </div>
            </el-tooltip>
           <div class="detail-info">
               <span style="display: flex">
                   <span :title="filmInfo.play_effect" v-show="filmInfo.play_effect" class="film-tip">{{filmInfo.play_effect}}</span>
                   <span :title="filmInfo.language"  v-show="filmInfo.language" class="film-tip">{{filmInfo.language}}</span>
               </span>
               <span :class="['sell', currentFilmId == filmInfo.id ? 'font-selected' : '']">
                   <!-- {{"已售" + filmInfo.soldnum + "/"  + filmInfo.seatnum}} -->
                   {{'共' + filmInfo.seatnum + '座'}}
                   </span>
               <img v-show="currentFilmId == filmInfo.id" class="selection-pos" src="/static/imgs/selected.png" alt="选中">
               <!-- <i v-show="currentFilmId == filmInfo.id" class="iconfont selection-pos iconchangcixuanzhongzhuangtai"></i> -->
           </div>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {SET_FILM_CURRENT_SEL_ID, SET_CURRENT_FILM_TITLE, SET_CURRENT_PLANCODE, SET_CURRENT_TICKET_MINPRICE} from 'types'
export default {
    props: {
        filmInfo: {
            type: Object
        }
    },

    computed: {
        ...mapGetters([
            'currentFilmId',
            'seatSelection'
        ])
    },

    methods: {
        ...mapMutations([
            SET_FILM_CURRENT_SEL_ID,
            SET_CURRENT_FILM_TITLE,
            SET_CURRENT_PLANCODE,
            SET_CURRENT_TICKET_MINPRICE
        ]),
        setFilmId(id, code, allowSingle, minPrice) {
            if(this.seatSelection.length) {
               this.$alert('请取消当前场次的影票及座位后再切换场次', {
                 confirmButtonText: '确定'
               });
            }else {
               let codeAndSingle = {
                    code,
                    allowSingleSold: parseInt(allowSingle) ? true : false
                }
                this.SET_FILM_CURRENT_SEL_ID(id)
                this.SET_CURRENT_PLANCODE(codeAndSingle)
                this.SET_CURRENT_FILM_TITLE()
                this.SET_CURRENT_TICKET_MINPRICE(minPrice)
            }
        },
    }
}
</script>

<style lang="scss" scoped>
  .time-order-container {
      display: flex;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: 1px solid $bg-searchPaydetalTabColor;
      margin-top: -1px;
      user-select: none;
      cursor: pointer;

      .time {
          flex: 0 0 9.5vw;
          width: 9.5vw;
          height: 100%;
          border-right: 1px solid $bg-searchPaydetalTabColor;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: $font-size18;
          font-weight: bold;
          color: $font-color3;
      }

      .time-selected {
          color: $blue-color;
      }

      .detail {
          flex: 1;
          display: flex;
          height: 100%;
          flex-direction: column;
          justify-content: center;
          padding: 0 1.2vw;
          position: relative;
          overflow: hidden;

          &.selected {
            box-shadow: 0 0 1px 1px inset $btn-background-color-theme;
        }

            &:hover {
                        box-shadow: 0 0 1px 1px inset $btn-background-color-theme;
                    }


          .selection-pos {
              position: absolute;
              right: 0;
              top: 0;
              width: 2.2vw;
          }

          .detail-name {
              font-size: $font-size13;
              color: $font-color3;
              font-weight: 500;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
          }

          .detail-info {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .film-tip {
                display: block;
                padding: 0 0.6vw;
                height: 2.1vh;
                line-height: 2.1vh;
                background: $btn-background-color-lightblue;
                border-radius: 1.2vh;
                color: $font-color-white;
                margin-right: 2px;
                margin-top: 2px;
                text-align: center;
                font-size: $font-size10;
                overflow: hidden;
            }

            .sell {
                font-size: $font-size12;
                color: $font-color6;
            }
          }
      }
  }

  .font-selected {
        color: $blue-color !important;
    }
</style>


