<template>
    <div class="container">
        <div :class="['film-contents', currentFilmId == item.id ? 'selected' : '']" v-for="(item, index) in content" :key="'hall' + index" @click="setFilmId(item.id, item.plan_code, item.allow_single_sold, item.min_price)">
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
            <!-- <i v-show="currentFilmId == item.id" class="iconfont selection-pos iconchangcixuanzhongzhuangtai"></i> -->
        </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {SET_FILM_CURRENT_SEL_ID, SET_CURRENT_FILM_TITLE, SET_CURRENT_PLANCODE, SET_CURRENT_TICKET_MINPRICE} from 'types'
export default {
    props: {
        content: {
            type: Array
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
    .container {
        width: 100%;
        height: 100%;

        .film-contents {
            flex: 0 0 50%;
            width: 50%;
            height: 100%;
            box-sizing: border-box;
            border: 1px solid $bg-searchPaydetalTabColor;
            padding: 1.6vh;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            margin-top: -1px;
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

        .selected {
            box-shadow: 0 0 1px 1px inset $btn-background-color-theme;
        }
    } 
</style>


