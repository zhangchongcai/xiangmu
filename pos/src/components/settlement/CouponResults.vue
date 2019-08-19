<template>
    <div class="more-pay-ticket-warp">
        <el-dialog
            id="el-dialog-width"
            :title="popTitle"
            :visible.sync="CheckCoupon"
            :modal-append-to-body='false'
            :close-on-click-modal="false"
            :append-to-body="false"
            style="font-size: 1.04vw"
            v-loading="loading" 
            element-loading-text="添加票券中..."
            element-loading-background="rgba(0, 0, 0, 0.8)"
            center>
            <div v-if="couponList.length" class="coupons-container">
              <div class="coupon-num">可选择会员票券(共{{availableNum}}张)</div>
              <div class="coupons">
                  <div class="coupon-item" v-for="(item, index) in couponList" :key="'coupon' + index" @click="toProveCoupon(item)">
                    <div :class="['coupon-inner-container', item.status == -1 ? 'no-sel' : '']">
                        <span>{{item.couponName}}</span>
                        <span>{{"有效期至" + item.expireTime}}</span>
                    </div>
                  </div>
              </div>
            </div>
            <div v-else>
                暂无票券！
            </div>
            <!-- <div v-show="couponList.length" style="display: flex; justify-content: center;">
                <el-button class="coupon-relut-btn" @click="CHECK_OUT_COUPON_RESULT">取消</el-button>
                <el-button class="coupon-relut-btn" type="primary" @click="CHECK_OUT_COUPON_RESULT">确定</el-button>
            </div> -->
            <div style="text-align: center; line-height: 30px;" v-show="couponList.lenght == 0">
                暂无票券
            </div>
        </el-dialog>

    </div>
</template>
<script>
import {proveCoupon} from 'src/http/apis.js'
import {mapGetters, mapMutations} from 'vuex'
import commonutil from 'util'
import {SET_ACTIVITY_LIST, GET_KIND_PRICE, CHECK_OUT_COUPON_RESULT, SAVE_AVAILABEL_COUPON, CART_SET_GOODS_DATA, GET_CART_DATA, SET_PAYED_LIST} from 'types'
export default {
    data() {
        return {
            popTitle: "会员绑定票券",
            loading: false
        }
    },

    computed:{
      ...mapGetters([
          'checkResult',
          'billCode',
          'cinemaCode',
          'vipInfo',
          'channelCode',
          'terminalId',
          'couponList',
          'selActivityList',
          'payMethod'

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
              return this.checkResult
          },

          set(val) {
              this.CHECK_OUT_COUPON_RESULT()
          }
      }
    },

    methods: {
        ...mapMutations([
            CHECK_OUT_COUPON_RESULT,
            SAVE_AVAILABEL_COUPON,
            CART_SET_GOODS_DATA,
            GET_CART_DATA,
            GET_KIND_PRICE,
            SET_ACTIVITY_LIST,
            SET_PAYED_LIST
        ]),

        toProveCoupon(item) {
          if(item.status != -1) {
              this.loading = true
            //   this.CHECK_OUT_COUPON_RESULT()
              proveCoupon({
                    billCode: this.billCode,
                    couponCode: item.couponNo,
                    cardNum: this.vipInfo.cardNo || "",
                    tenantId: item.tenantId,
                    payTypeCode: this.payMethod.currentPayMethodId,
                    timestamp: commonutil.formatTime(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
                    businessCode: this.cinemaCode,
                    channelCode: this.channelCode,
                    terminalCode: this.terminalId,
                    chooseKeys: this.selActivityList
            }).then(res => {
                if(res.code == 200) {
                    this.loading = false
                    this.SAVE_AVAILABEL_COUPON(res.data.ticketResultList)
                    this.SET_ACTIVITY_LIST(res.data.marketingResultList)
                    this.GET_KIND_PRICE(res.data)
                    this.CART_SET_GOODS_DATA(res.data.merGoodsList)
                    this.GET_CART_DATA(res.data)
                    this.SET_PAYED_LIST(res.data.payedList)
                    this.CHECK_OUT_COUPON_RESULT()
                }else {
                    this.loading = false
                    this.$message({
                            showClose: true,
                            message: res.msg,
                            type: 'warning'
                        });
                }
            })
          }
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


