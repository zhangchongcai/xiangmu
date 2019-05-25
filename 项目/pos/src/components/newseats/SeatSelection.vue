<template>
    <div v-show="selectedTickets.length" class="small-sel-container">
        <span class="clear-seat-btn" @click="clearSeat">清空座位</span>
        <span class="have-sel-font">已选：</span>
        <div class="small-sel-small-seat">
            <span v-for="(item, index) in selectedTickets.slice(0, 12)" :key="'seat' + index" class="small-have-sel-seat">{{item.seat_name}}</span>
        </div>
        <!-- <span class="total-seats-num" @click="extendSeats">共{{selectedTickets.length}}张</span> -->
        <el-tooltip class="total-seats-num" effect="dark" content="点击查看全部选座" placement="top-start" @click.native="extendSeats">
          <el-button>共{{selectedTickets.length}}张</el-button>
        </el-tooltip>
    </div>
</template>

<script>
import {mapMutations, mapGetters} from 'vuex'
import {CLEAR_SELECTION, GET_CART_DATA, GET_CART_BILLCODE, GET_CART_BILLCODEUID, GET_CART_CINEMAUID, RENDER_SELECTION_AFTER_RELEASE} from 'types'
import {releaseSeat, onlyClearSeats, findCart} from 'src/http/apis.js'  //获取全部座位，用来座位布局
export default {
    props: {
        selectedTickets: {
            type: Array
        }
    },

    computed: {
      ...mapGetters([
            'seatSelection',
            'channelCode',
            'cinemaCode',
            'billCode',
            'currentPlanCode'
      ])
    },

    watch: {
         currentPlanCode() {
           this.clearSeat()
         }
      },

    methods: {
        ...mapMutations([
           CLEAR_SELECTION,
           GET_CART_BILLCODE,
           GET_CART_BILLCODEUID,
           GET_CART_CINEMAUID,
           GET_CART_DATA,
           RENDER_SELECTION_AFTER_RELEASE
        ]),

        extendSeats() {
            this.$emit('extendSeats')
        },

        clearSeat() {
            onlyClearSeats({
                billCode: this.billCode
                }).then(res => {
                if(res.code == 200) {
                    this.GET_CART_DATA({goodsList: []})
                    releaseSeat({
                        channelCode: this.channelCode,
                        cinemaCode: this.cinemaCode,
                        saleBillCode: this.billCode,
                        timeSeatList: this.seatSelection
                        }).then(res => {
                        if(res.code == 200) {
                            this.CLEAR_SELECTION()
                            // this.GET_CART_BILLCODE('')
                            // this.GET_CART_BILLCODEUID('')
                            this.GET_CART_DATA({goodsList:[]})
                            this.RENDER_SELECTION_AFTER_RELEASE(res.data)
                            }else {
                                this.$message({
                                        showClose: true,
                                        message: res.msg,
                                        type: 'error'
                                    });
                            }
                    })
                }else {
                        this.$message({
                                        showClose: true,
                                        message: res.msg,
                                        type: 'error',
                                        customClass: 'global-tip-style'
                                    });
                    }
                })
            
        }
    }
}
</script>

<style lang="scss" scoped>
  .small-sel-container {
        box-sizing: border-box;
        position: fixed;
        overflow: hidden;
        width: 70vw;
        right: 0;
        bottom: 19.8vh;
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        background-color: #F2F2F2;
        padding: 1vh 18px;
        border-radius: 4px;
        z-index: 90;
    }
    .small-sel-small-seat {
        flex: 0 0 70%;
        width: 70%;
        display:flex;
        flex-wrap: wrap;
    }
    .clear-seat-btn {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 8.6vw;
        height: 3.1vh;
        color: #3b74ff;
        background: #ffffff;
        border: 1px solid #3b74ff;
        font-size: $font-size12;
        box-sizing: border-box;
        cursor: pointer;
    }
    .have-sel-font,
    .total-seats-num {
        font-size: $font-size12;
        color: $font-color3;
        margin-left: 10px;
        letter-spacing: 2px;
        padding: 2px;
        cursor: pointer;
    }

    .small-have-sel-seat {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 7vw;
        height: 3.1vh;
        color: #ffffff;
        background: #3b74ff;
        font-size: 1vw;
        margin: 0 1% 1% 0;
    }
</style>


