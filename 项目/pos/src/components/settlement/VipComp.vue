<template>
    <div class="pay-containers">
      <div class="left">
          <div>
             <span>
                 <span class="pay-count">已优惠：</span>
                 <span class="count-num rest-num">{{"288.05元"}}</span>
             </span>
         </div>
         <div style="margin: 10px 0 20px 0;">
             <span class="vip-info">卡号： {{"星星卡"}}</span>
              <span class="vip-info">余额： {{"30.25元"}}</span>
               <span class="vip-info">积分： {{"132分"}}</span>
         </div>
         <div style="margin: 20px 0;">
             <span>
                 <span class="pay-count">应收：</span>
                 <span class="count-num total-num">{{"288.05元"}}</span>
             </span>
             <span>
                 <span class="pay-count">待支付：</span>
                 <span class="count-num rest-num">{{"30.55元"}}</span>
             </span>
         </div>

         <div class="realPay">
             <span class="input-container-side">实收:</span>
             <input class="input-container" v-model="couponNum" type="text" placeholder="实收数额">
             <span class="input-container-side">元</span>
         </div>

         <div>
             <span class="pay-name">支付方式:</span>
             <div style="margin-top: 10px">
                    <el-checkbox v-model="online">微信</el-checkbox>
                    <el-checkbox v-model="outline">支付宝</el-checkbox>
             </div>
         </div>
      </div>

      <div class="right">
        <NumberKeyBoard :showPointer="true" @keynumber="showResult"></NumberKeyBoard>
        <div class="btn-container">
            <span class="result-btn" @click="cancle">取消</span>
            <span class="result-btn confirm-btn">确定</span>
            <span class="result-btn quickCash">充值</span>
        </div>
      </div>
    </div>
</template>

<script>
import NumberKeyBoard from 'components/numberKeyBoard'
export default {
    data() {
        return {
            couponNum: '',
            couponsArr: [
                "54135451654341",
                "54464324797453",
                "79548+34135341",
                "64346534333133"
            ],

            online: true,
            outline: false
        }
    },

    methods: {
        showResult(value) {
           this.couponNum = value;
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

        .vip-info {
            font-size: $font-size12;
            color: $font-color9;
            transform: scale(0.8);
        }

        .pay-name {
            font-size: $font-size12;
            color: $font-color6;
        }

        .realPay, .action-container {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 20px 0;

            .input-container {
                display: block;
                width: 16.8vw;
                height: 4.9vh;
                border: 1px solid #bcbcbc;
                border-radius: 2px;
                padding: 0 12px;
                margin: 0 4px;
            }
            .input-container-side {
                display: flex;
                height: 4.9vh;
                align-items: center;
                font-size: $font-size12;
                color: $font-color6;
            }
        }

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
        .btn-container {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                }

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
           margin-top: 1.4vh;
           cursor: pointer;
        }

        .confirm-btn {
            background: $btn-background-color-theme;
            color: $font-color-white;
        }

        .quickCash {
             background: $btn-background-color-orange;
             color: $font-color-white;
             border: 1px solid $btn-background-color-orange;
        }
    }
  }
</style>


