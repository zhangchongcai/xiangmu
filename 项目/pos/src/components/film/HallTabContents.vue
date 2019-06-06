<template>
    <div :class="['hall-order-container', currentFilmId == filmInfo.id ? 'selected' : '']" @click="setFilmId(filmInfo.id, filmInfo.plan_code, filmInfo.allow_single_sold)">
        <div class="detail">
           <div class="detail-name">
              <span :class="['film-name',  currentFilmId == filmInfo.id ? 'font-selected' : '']">
                   {{filmInfo.name}}
              </span>
              <span :class="['film-time',  currentFilmId == filmInfo.id ? 'font-selected' : '']">
                  {{filmInfo.show_time.substring(10, 16)}}
              </span>
           </div>
           <div class="detail-info">
               <span style="display: flex">
                   <span v-show="filmInfo.play_effect" class="film-tip">{{filmInfo.play_effect}}</span>
                   <span v-show="filmInfo.language" class="film-tip">{{filmInfo.language}}</span>
               </span>
               <span :class="['sell', currentFilmId == filmInfo.id ? 'font-selected' : '']">{{"已售" + filmInfo.soldnum + "/"  + filmInfo.seatnum}}</span>
           </div>
        </div>
        <img v-show="currentFilmId == filmInfo.id" class="selection-pos" src="/static/imgs/selected.png" alt="选中">
        <!-- <i v-show="currentFilmId == filmInfo.id" class="iconfont selection-pos iconchangcixuanzhongzhuangtai"></i> -->
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
  .hall-order-container {
      display: flex;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border: 1px solid $bg-searchPaydetalTabColor;
      margin-top: -1px;
      position: relative;
      user-select: none;
      cursor: pointer;

      &.selected {
            box-shadow: 0 0 1px 1px inset $btn-background-color-theme;
        }

      &:hover {
                box-shadow: 0 0 1px 1px inset $btn-background-color-theme;
            }

      .selection-pos {
          position: absolute;
          top: 0;
          right: 0;
          width: 1.4vw;
      }

      .detail {
          flex: 1;
          display: flex;
          height: 100%;
          flex-direction: column;
          justify-content: center;
          padding: 0 1.2vw;

          .detail-name {
              display: flex;
              justify-content: space-between;
              align-items: center;
              
              .film-name {
                  font-size: $font-size13;
                  color: $font-color3;
              }

              .film-time {
                  font-size: $font-size12;
                  color: $font-color3;
              }
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


