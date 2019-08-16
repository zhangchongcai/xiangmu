<template>
    <div class="more-pay-ticket-warp">
        <el-dialog
            id="el-dialog-width"
            :title="popTitle"
            :visible.sync="CheckCoupon"
            :modal-append-to-body='false'
            :append-to-body="false"
            :close-on-click-modal="false"
            style="font-size: 1.04vw"
            center>
            <div v-if="groupCoupons.length" class="coupons-container">
              <div class="coupons">
                  <div class="coupon-item" v-for="(item, index) in groupCoupons" :key="'coupon' + index" @click="toProveCoupon(item)">
                    <div class="coupon-inner-container">
                        <span>{{item.grouponTicketEntity.name}}</span>
                        <span class="goods">卖品</span>
                    </div>
                  </div>
              </div>
            </div>
            <div v-else>
                暂无票券！
            </div>
            <!-- <div v-show="groupCoupons.length" style="display: flex; justify-content: center;">
                <el-button class="coupon-relut-btn">取消</el-button>
                <el-button class="coupon-relut-btn" type="primary">确定</el-button>
            </div> -->
            <div style="text-align: center; line-height: 30px;" v-show="groupCoupons.lenght == 0">
                暂无票券！
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
import {CHECK_OUT_GCOUPON_RESULT} from 'types'
export default {
    data() {
        return {
            popTitle: "可用团购券"
        }
    },

    computed:{
      ...mapGetters([
          'groupCoupons',
          'billCode',
          'checkGCResult'

      ]),

      availableNum() {
        let availabeleArr = this.couponList.filter(item => {
            return item.status != "-1"
        })

        // console.log(availabeleArr)

        return availabeleArr.length;
      },

      CheckCoupon: {
          get() {
              return this.checkGCResult
          },

          set(val) {
              this.CHECK_OUT_GCOUPON_RESULT()
          }
      }
    },

    methods: {
        ...mapMutations([
            CHECK_OUT_GCOUPON_RESULT
        ]),

        toProveCoupon(item) {
          let passData = item.grouponTicketEntity
          this.$emit("passGrouponData", passData)
          this.CHECK_OUT_GCOUPON_RESULT()

        }
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
                            border: 1px solid #3B74FF;
                            color: #3B74FF;
                            border-radius: 2px;
                            display: flex;
                            align-items: center;
                            justify-content: space-between;

                            .goods {
                              display: block;
                              width: 2.8vw;
                              height: 1.8vh;
                              border-radius: 0.9vh;
                              border: 1px solid #ff8900;
                              color: #ff8900;
                              text-align: center;
                              line-height: 1.8vh;
                            }
                        }
                        .no-sel {
                            border: 1px solid #BCBCBC;
                            color: $font-color6;
                            cursor: not-allowed;
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
            .coupon-relut-btn {
                padding: 0;
                margin: 20px;
                font-size: $font-size12;
                width: 7.8vw;
                height: 4.2vh;
            }
        }
        
</style>


