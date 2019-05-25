<template>
    <div :class="['film-order-container', currentMovieId == filmInfo.movieUid ? 'active' : '']" @click="changeMovieId(filmInfo.movieUid)">
      <div class="film-name">
        <span :class="['film-name-style', isSelected ? 'name-selected' : '']">{{filmInfo.name}}</span>
        <div style="display: flex; justify-content: flex-end; align-items: center;">
            <i class="iconfont icon-arrow-right-noSelected"></i>
        </div>
        <div style="display: flex; justify-content: flex-start; align-items: center;">
            <span class="film-tip">{{filmInfo.play_effect}}</span>
            <span class="film-tip">{{filmInfo.language}}</span>
        </div>
      </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {SET_FILM_CONTENTS, SET_MOVIE_ID} from 'types'
export default {
    props: {
        itemWidth: {
            type: Number
        },

        filmInfo: {
            type: Object
        }
    },
    data() {
        return {

        }
    },

    computed: {
        ...mapGetters([
            'currentMovieId',
            'currentFilmId'
        ]),
        isSelected() {
            return this.filmInfo.arr_plan_list.some(item => {
                return item.id == this.currentFilmId
            })
        }
    },

    methods: {
        ...mapMutations([
            SET_FILM_CONTENTS,
            SET_MOVIE_ID
        ]),

        changeMovieId(id) {
            if(this.currentMovieId == id) {
                //返回默认
                this.$emit('changeToAll')
            }else {
               this.SET_MOVIE_ID(id)
               this.SET_FILM_CONTENTS()
            }
            
        }
    }
}
</script>

<style lang="scss" scoped>
  .film-order-container {
      display: flex;
      width: 100%;
      height: 100%;
      margin-top: -1px;
      background: #33333341;
      transition: all 0.2s ease-in-out;
      cursor: pointer;

      &.active {
          background: #ffffff;
      }

      &:hover {
          background: #ffffff;
      }

      .film-name {
          width: 11.7vw;
          height: 100%;
          box-sizing: border-box;
          padding: 1.6vh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          border: 1px solid $bg-searchPaydetalTabColor;

          .film-name-style {
              font-size: $font-size13;
              color: $font-color3;
          }
          .name-selected {
                color: $font-color-blue;
            }

          .icon-arrow-right-noSelected {
              color: #bbcfff;
              font-size: $font-size12;
          }

          .film-tip {
              display: block;
              padding: 0 0.6vw;
              height: 2.4vh;
              line-height: 2.4vh;
              background: $btn-background-color-lightblue;
              border-radius: 1.2vh;
              color: $font-color-white;
              margin-right: 2px;
              text-align: center;
              font-size: $font-size12;
          }
      }
      
  }
</style>


