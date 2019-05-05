<template>
    <div :class="['time-order-container', currentFilmId == filmInfo.id ? 'selected' : '']" @click="setFilmId(filmInfo.id, filmInfo.plan_code, filmInfo.allow_single_sold)">
        <div class="time">
            {{filmInfo.show_time.substring(10, 16)}}
        </div>
        <div class="detail">
           <div class="detail-name">
               {{filmInfo.name}}
           </div>
           <div class="detail-info">
               <span style="display: flex">
                   <span class="film-tip">{{filmInfo.play_effect}}</span>
                   <span class="film-tip">{{filmInfo.language}}</span>
               </span>
               <span class="sell">{{"已售" + filmInfo.soldnum + "/"  + filmInfo.seatnum}}</span>
               <i v-show="currentFilmId == filmInfo.id" class="iconfont selection-pos iconchangcixuanzhongzhuangtai"></i>
           </div>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {SET_FILM_CURRENT_SEL_ID, SET_CURRENT_FILM_TITLE, SET_CURRENT_PLANCODE} from 'types'
export default {
    props: {
        filmInfo: {
            type: Object
        }
    },

    computed: {
        ...mapGetters([
            'currentFilmId'
        ])
    },

    methods: {
        ...mapMutations([
            SET_FILM_CURRENT_SEL_ID,
            SET_CURRENT_FILM_TITLE,
            SET_CURRENT_PLANCODE
        ]),
        setFilmId(id, code, allowSingle) {
            let codeAndSingle = {
                code,
                allowSingleSold: parseInt(allowSingle) ? true : false
            }
            this.SET_FILM_CURRENT_SEL_ID(id)
            this.SET_CURRENT_PLANCODE(codeAndSingle)
            this.SET_CURRENT_FILM_TITLE()
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

      &.selected {
            box-shadow: 0 0 1px 1px inset $btn-background-color-theme;
        }

    &:hover {
                box-shadow: 0 0 1px 1px inset $btn-background-color-theme;
            }

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

      .detail {
          flex: 1;
          display: flex;
          height: 100%;
          flex-direction: column;
          justify-content: center;
          padding: 0 1.2vw;
          position: relative;


          .selection-pos {
              position: absolute;
              right: 0;
              top: 0;
          }

          .detail-name {
              font-size: $font-size13;
              color: $font-color3;
              font-weight: 500;
          }

          .detail-info {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .film-tip {
                display: block;
                padding: 0 0.6vw;
                height: 2.4vh;
                line-height: 2.4vh;
                background: $btn-background-color-lightblue;
                border-radius: 1.2vh;
                color: $font-color-white;
                margin-right: 2px;
                margin-top: 2px;
                text-align: center;
                font-size: $font-size12;
                transform: scale(0.95);
            }

            .sell {
                font-size: $font-size12;
                color: $font-color6;
            }
          }
      }
  }
</style>


