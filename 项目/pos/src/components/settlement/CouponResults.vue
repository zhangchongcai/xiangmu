<template>
    <div class="more-pay-ticket-warp">
        <el-dialog
            id="el-dialog-width"
            :title="popTitle"
            :visible.sync="CheckCoupon"
            :modal-append-to-body='false'
            :append-to-body="false"
            center>
            <div class="coupons-container">
              <div class="coupon-num">可选择会员票券(共3张)</div>
              <div class="coupons">
                  <div class="coupon-item" v-for="(item, index) in coupons" :key="'coupon' + index">
                    <div class="coupon-inner-container">
                        <span>{{item.name}}</span>
                        <span>{{"有效期至" + item.expires}}</span>
                    </div>
                  </div>
              </div>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
import {CHECK_OUT_COUPON_RESULT} from 'types'
export default {
    data() {
        return {
            popTitle: "会员绑定票券",
            coupons: [
                {
                    name: "生日赠票",
                    expires: "2019/12/30"
                },
                {
                    name: "开业酬宾",
                    expires: "2019/06/06"
                },
                {
                    name: "会员优惠",
                    expires: "2019/07/07"
                },
                {
                    name: "生日赠票",
                    expires: "2019/12/30"
                },
                {
                    name: "开业酬宾",
                    expires: "2019/06/06"
                },
                {
                    name: "会员优惠",
                    expires: "2019/07/07"
                },
                {
                    name: "生日赠票",
                    expires: "2019/12/30"
                },
                {
                    name: "开业酬宾",
                    expires: "2019/06/06"
                },
                {
                    name: "会员优惠",
                    expires: "2019/07/07"
                }
            ]
        }
    },

    computed:{
      ...mapGetters([
          'checkResult',   
      ]),

      CheckCoupon: {
          get() {
              return this.checkResult
          },

          set(val) {
              this.CHECK_OUT_COUPON_RESULT()
          }
      }
    },

    methods: {
        ...mapMutations([
            CHECK_OUT_COUPON_RESULT
        ])
    },
    
    
}
</script>
<style scoped lang="scss">
    .more-pay-ticket-warp{

            #el-dialog-width {
                width: 100% !important;
            }

            .coupons-container {
                width: 100%;
                box-sizing: border-box;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;

                .coupon-num {
                    width: 100%;
                    font-size: $font-size13;
                    color: $font-color6;
                    margin-bottom: 10px;
                    text-align: left;
                }

                .coupons {
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    flex-wrap: wrap;

                    .coupon-item {
                        width: calc(100% / 2);
                        height: 5.2vh;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        .coupon-inner-container {
                            width: 88%;
                            padding: 0 12px;
                            height: 4.2vh;
                            border: 1px solid #BCBCBC;
                            border-radius: 2px;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;
                        }
                    }
                }
            }
            
            .el-dialog__header{
                text-align: left;
                .el-dialog__title{
                    font-size: $font-size12;
                }
                    font-size: $font-size12;
            }
            .dialog-footer{
                text-align: right;
                padding-right: 2.9vw;
                .el-button{
                    padding: 4px 11px;
                    width: 3.9vw;
                    height: 3.5vh;
                    font-size: $font-size12;
                }
            }
        }
        
</style>


