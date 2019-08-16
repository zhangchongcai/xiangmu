<template>
    <div class="all-order">
      <div class="item-container">
        <div class="film-order-container" @click="toFilmTab">
                <div class="film-name">
                    <el-tooltip effect="dark" :content="filmInfo.name" placement="bottom">
                    <span :class="['film-name-style', isSelected ? 'name-selected' : '']">{{filmInfo.name}}</span>
                    </el-tooltip>
                    <div class="arrow-style">
                        <i class="iconfont iconpaiqixiangyouyindaojiantou"></i>
                    </div>
                    <div style="display: flex; justify-content: flex-start; align-items: center;">
                        <span :title="filmInfo.play_effect" v-show="filmInfo.play_effect" class="film-tip">{{filmInfo.play_effect}}</span>
                        <span :title="filmInfo.language" v-show="filmInfo.language" class="film-tip">{{filmInfo.language}}</span>
                    </div>
                </div>
        </div>

        <div :class="['film-contents', currentFilmId == item.id ? 'selected' : '']" v-for="(item, index) in filmInfo.arr_plan_list.slice(0, 2)" :key="'hall' + index" @click="setHallIndex(index)">
            <span :class="['play-time', currentFilmId == item.id ? 'font-selected' : '']">
                {{item.next_day + item.show_time.substring(10, 16)}}
            </span>
            <span :class="['play-place', currentFilmId == item.id ? 'font-selected' : '']">
                {{item.hall_name}}
            </span>
            <span :class="['play-sell', currentFilmId == item.id ? 'font-selected' : '']">
                <!-- {{"已售" + item.soldnum  + "/" + item.seatnum}} -->
                {{'共' + item.seatnum +  '座'}}
            </span>
            <img v-show="currentFilmId == item.id" class="selection-pos" src="/static/imgs/selected.png" alt="选中">
            <!-- <i v-show="currentFilmId == item.id" class="iconfont selection-pos iconchangcixuanzhongzhuangtai1"></i> -->
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
            'currentFilmId',
            'seatSelection',
            'seatSelection'
        ]),
        isSelected() {
            return this.filmInfo.arr_plan_list.some(item => {
                return item.id == this.currentFilmId
            })
        }
    },

    methods: {
        setHallIndex(index) {
            if(this.seatSelection.length) {
               this.$alert('请取消当前场次的影票及座位后再切换场次', {
                 confirmButtonText: '确定'
               });
            }else {
               this.$emit('selectionHallId', index)
            }
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
            justify-content: space-between;
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
                font-size: $font-size13;
                color: $font-color3;
                font-weight: bold;
                text-align: left;
                width:100%;
                overflow:hidden; 
                text-overflow:ellipsis;
                white-space:nowrap; 
            }
            .name-selected {
                color: $font-color-blue;
            }

            .iconpaiqixiangyouyindaojiantou {
                color: #bbcfff;
                font-size: $font-size12;
            }

            .film-tip {
                display: block;
                padding: 0 0.6vw;
                height: 2.1vh;
                line-height: 2.1vh;
                background: $btn-background-color-lightblue;
                border-radius: 1.2vh;
                color: $font-color-white;
                margin-right: 2px;
                text-align: center;
                font-size: $font-size10;
                overflow: hidden;
            }
        }
      }

      .selected {
          box-shadow: 0 0 1px 1px inset $blue-color;
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
                    // font-size: $font-size12;
                    width: 2.2vw;
                }

                .play-time {
                    font-size: $font-size14;
                    color: $font-color3;
                }

                .play-place, .play-sell {
                    font-size: $font-size12;
                    color: $font-color6;
                }

                .font-selected {
                    color: $font-color-blue;
                }
        }
    }
  }
</style>

