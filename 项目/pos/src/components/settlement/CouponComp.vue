<template>
    <div class="pay-containers">
      <div class="left">
         <div>
             <span>
                 <span class="pay-count">应收：</span>
                 <span class="count-num total-num">{{"288.05元"}}</span>
             </span>
             <span>
                 <span class="pay-count">待支付：</span>
                 <span class="count-num rest-num">{{"30.55元"}}</span>
             </span>
         </div>

         <input class="input-container" v-model="couponNum" type="text" placeholder="请扫描或输入票券编号">

         <div class="action-container">
             <span class="default-btn add-num">
                 添加
             </span>
             <span class="default-btn check-num" @click="toCheckOut">
                查询会员绑定票券
             </span>
             
             <div v-if="couponsArr.length" class="coupon-num">
                 {{"已添加票券（" + couponsArr.length + "张）"}}
             </div>

             <div class="coupon-container">
                 <div class="coupon-item" v-for="(item, index) in couponsArr" :key="'cou' + index">
                     <span class="num-string">{{item}}</span>
                     <i class="iconfont icon-neiye-shanchu"></i>
                 </div>
             </div>
         </div>
      </div>

      <div class="right">
        <NumberKeyBoard :showPointer="true" @keynumber="showResult"></NumberKeyBoard>
        <span class="result-btn" @click="cancle">取消</span>
        <span class="result-btn confirm-btn">确定</span>
      </div>
    </div>
</template>

<script>
import NumberKeyBoard from 'components/numberKeyBoard'
import {mapGetters, mapMutations} from 'vuex'
import {CHECK_OUT_COUPON} from 'types'
export default {
    data() {
        return {
            couponNum: '',
            couponsArr: [
                "54135451654341",
                "54464324797453",
                "79548+34135341",
                "64346534333133"
            ]
        }
    },

    methods: {
        ...mapMutations([
           CHECK_OUT_COUPON
        ]),

        showResult(value) {
           this.couponNum = value;
        },

        toCheckOut() {
            this.CHECK_OUT_COUPON()
        },

        cancle() {
          this.$emit('closePay')
        },
    },

    components: {
        NumberKeyBoard
    }
}
</script>

<style lang="scss" scoped>
  .pay-containers {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-top: 18px;

    .left {
        width: 34vw;

        .pay-count {
            font-size: $font-size12;
            color: $font-color6;
            margin-right: 2px;
        }

        .count-num {
            font-size: $font-size14;
            font-weight: bold;
        }

        .total-num  {
            margin-right: 50px;
            color: $font-color3;
        }

        .rest-num {
            color: #FF7900;
        }

        .input-container {
            display: block;
            width: 22.8vw;
            height: 4.9vh;
            border: 1px solid #bcbcbc;
            border-radius: 2px;
            padding: 0 12px;
            margin-top: 30px;
            margin-bottom: 8px;
        }

        .action-container {
            margin-top: 8px;
            margin-bottom: 2px;

            .default-btn {
                border-radius: 2px;
                border: 1px solid $btn-background-color-theme;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                color: $font-color-blue;
                font-size: $font-size12;
                cursor: pointer;
            }

            .add-num {
                width: 6.1vw;
                height: 4.2vh;
                margin-right: 8px;
            }

            .check-num {
                width: 12.7vw;
                height: 4.2vh;
            }

            .coupon-num {
               font-size: $font-size12;
               color: $font-color6;
               margin-top: 15px;
               margin-bottom: 4px;
            }

            .coupon-container {
                box-sizing: border-box;
                width: 22.9vw;
                background: #EFF3FF;
                padding: 10px;

                .coupon-item {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 4px 0;

                    .num-string {
                        font-size: $font-size12;
                        color: $font-color3;
                    }

                    .icon-neiye-shanchu {
                        font-size: $font-size12;
                        color: $themeColor;
                    }
                }
            }
        }
    }

    .right {
        width: 23vw;

        .result-btn {
           display: inline-flex;
           width: 6.8vw;
           height: 5.2vh;
           justify-content: center;
           align-items: center;
           border: 1px solid $btn-background-color-theme;
           border-radius: 4px;
           color: $font-color-blue;
           font-size: $font-size14;
           margin-right: 0.6vw;
           margin-top: 1.4vh;
           cursor: pointer;
        }

        .confirm-btn {
            background: $btn-background-color-theme;
            color: $font-color-white;
        }
    }
  }
</style>


