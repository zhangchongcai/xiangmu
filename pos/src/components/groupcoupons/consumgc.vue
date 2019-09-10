<template>
    <div class="more-pay-ticket-warp">
        <el-dialog
            id="el-dialog-width"
            :title="popTitle"
            :visible.sync="CheckCoupon"
            :modal-append-to-body='false'
            :append-to-body="false"
            @close="closeFn"
            style="font-size: 1.04vw"
            center>
            <div style="margin-bottom: 30px">
                <div>
                    {{datas.name + '消费规则：卖品抵扣' + datas.amount}}
                </div>
                <el-input style="width: 29.4vw;" v-model="input" placeholder="请输入内容"></el-input>
                <el-button style="width: 6.3vw;" @click="addGroupons">添加</el-button>
            </div>
            <div v-if="consumeGroupCoupons.length" class="coupons-container">
              <div style="width: 100%; text-align: left">{{"已添加团购券" + consumeGroupCoupons.length + "张"}}</div>
              <div class="coupons">
                  <div class="coupon-item" v-for="(item, index) in consumeGroupCoupons" :key="'coupon' + index">
                    <div class="coupon-inner-container">
                        <span>{{item.ticketName + item.payAmount + ': ' + item.ticketCode}}</span>
                        <i class="iconfont iconshanchu" @click="delTicket(item)"></i> 
                    </div>
                  </div>
              </div>
            </div>
            <div style="display: flex; justify-content: center;">
                <!-- <el-button class="coupon-relut-btn" @click="clearAll">删除全部</el-button> -->
                <el-button class="coupon-relut-btn" @click.native="confimGroups">取消</el-button>
                <el-button class="coupon-relut-btn" type="primary" @click.native="confimGroups">确定</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import {consumeGroupon, delGroupon, changeActivityStatus} from 'src/http/apis.js'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {CHECKOUT_CONSUMEGCOUPON_RESULT, SAVE_CONSUME_GROUPON, DEL_GROUPON_TICKET, CLEAR_ALL_GROUPONS, CART_FIND_CART_DATA} from 'types'
export default {
    props: {
        datas: {
            type: Object
        }
    },
    data() {
        return {
            popTitle: "添加团购券",
            input: ''
        }
    },

    computed:{
      ...mapGetters([
          'consumeGroupCoupons',
          'billCode',
          'checkoutGCResult',
          'selActivityList',
          'payMethod',
          'billCode',
          'selActivityList'

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
              return this.checkoutGCResult
          },

          set(val) {
              this.CHECKOUT_CONSUMEGCOUPON_RESULT()
          }
      }
    },

    methods: {
        ...mapMutations([
            CHECKOUT_CONSUMEGCOUPON_RESULT,
            SAVE_CONSUME_GROUPON,
            DEL_GROUPON_TICKET,
            CLEAR_ALL_GROUPONS
        ]),

        ...mapActions([
            CART_FIND_CART_DATA
        ]),

        addGroupons() {
            if(this.consumeGroupCoupons.length) {
               let isSame =  this.consumeGroupCoupons.some(item => {
                   return item.ticketCode == this.input
                })
               if(isSame){
                   this.$message({
                        showClose: true,
                        message: "票券号重复，请重新输入",
                        type: 'warning'
                    });
                    this.input = ''
                return
               }
            }
            consumeGroupon({
              billCode: this.billCode,
              uid: this.datas.uid,
              ticketCode: this.input
            }).then(res => {
               if(res.code == 200) {
                    this.SAVE_CONSUME_GROUPON(res.data.grouponTicketResults)
                    this.CART_FIND_CART_DATA()
               }else {
                   this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    });
               }
               this.input = ''
            })
        },

        delTicket(item) {
            delGroupon({
               billCode: this.billCode,
               ticketCodes: [item.ticketCode]
            }).then(res => {
                if(res.code == 200) {
                    this.DEL_GROUPON_TICKET(item.ticketCode)
                }else {
                    this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    });
                }
            })
        },

        confimGroups() {
            this.CHECKOUT_CONSUMEGCOUPON_RESULT()
            // changeActivityStatus({
            //     billCode: this.billCode,
            //     chooseKeys: this.selActivityList
            // }).then(res => {
            //     if(res.code == 200) {
            //         this.CART_FIND_CART_DATA()
            //     }else {
            //       this.$message({
            //             showClose: true,
            //             message: res.msg,
            //             type: 'error'
            //         });  
            //     }
            // })
        },
        closeFn(){
            this.CART_FIND_CART_DATA()
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


