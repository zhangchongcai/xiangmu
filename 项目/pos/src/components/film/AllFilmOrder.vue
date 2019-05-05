<template>
    <div class="all-order">
      <div class="item-container">
        <div class="film-order-container" @click="toFilmTab">
            <div class="film-name">
                <span class="film-name-style">{{filmInfo.name}}</span>
                <div class="arrow-style">
                    <i class="iconfont icon-arrow-right-noSelected"></i>
                </div>
                <div style="display: flex; justify-content: flex-start; align-items: center;">
                    <span class="film-tip">{{filmInfo.play_effect}}</span>
                    <span class="film-tip">{{filmInfo.language}}</span>
                </div>
            </div>
        </div>

        <div :class="['film-contents', currentFilmId == item.id ? 'selected' : '']" v-for="(item, index) in filmInfo.arr_plan_list.slice(0, 2)" :key="'hall' + index" @click="setHallIndex(index)">
            <span class="play-time">
                {{item.show_time.substring(10, 16)}}
            </span>
            <span class="play-place">
                {{item.hall_name}}
            </span>
            <span class="play-sell">
                {{"已售" + item.soldnum  + "/" + item.seatnum}}
            </span>
            <i v-show="currentFilmId == item.id" class="iconfont selection-pos iconchangcixuanzhongzhuangtai"></i>
        </div>
      </div>
    </div>
</template>


<script>
import {mapGetters, mapMutations} from 'vuex'
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
        setHallIndex(index) {
            this.$emit('selectionHallId', index)
        },

        toFilmTab() {
            this.$emit('toFilmTab')
        }
    }
}
</script>

<style lang="scss" scoped>
  .all-order {
      width: 100%;
      height: 100%;
      margin-top: -1px;
      user-select: none;
      cursor: pointer;

       .item-container {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: flex-start;

          

      .film-order-container {
        display: flex;
        width: 11.7vw;
        height: 100%;
        

        

        .film-name {
            width: 11.7vw;
            height: 100%;
            box-sizing: border-box;
            padding: 1.6vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            @include color('border', $lightWhite-color);
            position: relative;

            .arrow-style {
                position: absolute;
                right: 6px;
                top: 50%;
                transform: translateY(-50%);
            }

            &:hover {
                box-shadow: 0 0 1px 1px inset $btn-background-color-theme;
            }

            .film-name-style {
                font-size: $font-size12;
                color: $font-color3;
                font-weight: bold;
                margin-bottom: 4px;
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
                transform: scale(0.95);
            }
        }
      }

      .selected {
          box-shadow: 0 0 1px 1px inset $btn-background-color-theme;
      }

      .film-contents {
            width: 9.2vw;
            height: 100%;
            border: 1px solid $bg-searchPaydetalTabColor;
            box-sizing: border-box;
            padding: 1.6vh;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            float: left;
            position: relative;

            &:hover {
                box-shadow: 0 0 1px 1px inset $btn-background-color-theme;
            }

                .selection-pos {
                    position: absolute;
                    right: 0;
                    top:0;
                    font-size: $font-size12;
                }

                .play-time {
                    font-size: $font-size16;
                    color: $font-color3;
                }

                .play-place, .play-sell {
                    font-size: $font-size12;
                    color: $font-color6;
                }
        }
    }
  }
</style>

