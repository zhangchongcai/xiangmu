<template>
    <div v-loading="loading" class="more-pay-ticket-warp">
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
                  <div class="coupon-item" v-for="(item, index) in computedCouponList" :key="'coupon' + index" @click="proveTickets(item)">
                    <div :class="['coupon-inner-container', item.status == -1 ? 'no-sel' : '']">
                        <i v-show="item.selected" class="iconfont iconchangcixuanzhongzhuangtai1"></i>
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
import {mapGetters, mapMutations, mapActions} from 'vuex'
import commonutil from 'util'
import {SET_ACTIVITY_LIST, GET_KIND_PRICE, CHECK_OUT_COUPON_RESULT, SAVE_AVAILABEL_COUPON, CART_SET_GOODS_DATA, GET_CART_DATA, SET_PAYED_LIST, SET_CHECK_MANY, CART_FIND_CART_DATA} from 'types'
export default {
    data() {
        return {
            popTitle: "会员绑定票券",
            loading: false,
            nowApplyCode:'',
            key: 100,
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
          'payMethod',
          'availableCouponList',
          'tenantId',
          'getUserConfig',
          'cashCouponsLen'

      ]),

      availableNum() {
        let availabeleArr = this.couponList.filter(item => {
            return item.status != "-1"
        })
        return availabeleArr.length;
      },

      computedCouponList() {
        this.couponList.forEach((coupon, index) => {
                this.availableCouponList.forEach(item => {
                    if(coupon.couponNo == item.ticketCode) {
                        this.couponList[index].selected = 1
                    }
                })
            })
        return this.couponList
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
            SET_PAYED_LIST,
            SET_CHECK_MANY
        ]),

        ...mapActions([
           CART_FIND_CART_DATA
        ]),

        proveTickets(item) {
           if(this.availableCouponList.some(coupon => {
              return coupon.ticketCode == item.couponNo
          })) {
              return this.$message({
                        showClose: true,
                        message: "已添加此票券",
                        type: 'error'
                    });
          }
           if(item.status != -1) {
              this.loading = true
              let paras = {
                            billCode: this.billCode,
                            couponCode: item.couponNo,
                            payTypeCode: this.payMethod.currentPayMethodId,
                            tenantId: this.tenantId,
                            timestamp: commonutil.formatTime(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
                            businessCode: this.cinemaCode,
                            channelCode: this.channelCode,
                            terminalCode: this.terminalId,
                            chooseKeys: this.selActivityList,
                            cardNum: this.vipInfo.cardNo || "",
                            applyCode : this.nowApplyCode,
                    }
            if(this.nowApplyCode) {
                proveSecCoupon(paras).then(res => {
                        if(res.code == 200) {
                            let item = '';
                            for(let i = 0; i < this.availableCouponList.length; i++){
                                if(this.availableCouponList[i].applyCode == this.nowApplyCode && this.availableCouponList[i].key == this.key){

                                    item = {
                                            ...this.availableCouponList[i],
                                            ticketCode :this.couponNum
                                            }
                                    break;
                                }
                            }

                            // res.data.ticketResultList[0].pwd = this.couponPassWord
                            let newArr = [...this.availableCouponList,item]
                            this.SAVE_AVAILABEL_COUPON(newArr)
                            // this.SET_ACTIVITY_LIST(res.data.marketingResultList)
                            // this.GET_KIND_PRICE(res.data)
                            // this.CART_SET_GOODS_DATA(res.data.merGoodsList)
                            // this.GET_CART_DATA(res.data)
                            // this.SET_PAYED_LIST(res.data.payedList)
                            // this.couponPassWord = ''
                            // this.couponNum = ''
                            // this.couponBox = false
                            let index = 0;
                            for(let i = 0; i < this.availableCouponList.length; i++){
                                if(this.availableCouponList[i].applyCode == this.nowApplyCode && this.availableCouponList[i].key == this.key){
                                    index++
                                }
                            }
                            if(index < item.couponAmount) {
                                
                                this.SET_CHECK_MANY(true)
                                // this.couponCheckoutBox = true
                                this.$message({
                                    showClose: true,
                                    message: "请再输入一张券",
                                    type: 'warning'
                                });
                            }else {
                                this.SET_CHECK_MANY(false)
                                this.nowApplyCode = '';
                            }
                            this.loading = false
                        }else {
                            this.wrongTip(res)
                            
                        }
                    })
            }else {
                proveCoupon(paras).then(res => {
                    if(res.code == 200) {
                        //  let currentTickets = res.data.ticketResultList.filter(item => {
                        //     return item.ticketCode == paras.couponCode
                        // })
                        // if(currentTickets[0].ticketType == 1 && this.cashCouponsLen > Number(this.getUserConfig.max_sale_voucher_num) - 1) return this.$message({
                        //             showClose: true,
                        //             message: "代金券使用数量已达上限",
                        //             type: 'warning'
                        //         });
                        let item = res.data instanceof Array ? res.data[0] : res.data
                        this.key++
                        res.data.ticketResultList[0].key = this.key
                        res.data.ticketResultList[0].pwd = this.couponPassWord
                        let fliterCodeArr = [];
                        let ticketResultList = [];
                        [...this.availableCouponList,...res.data.ticketResultList].map((item)=>{
                            if(!fliterCodeArr.includes(item.ticketCode)){
                                fliterCodeArr.push(item.ticketCode)
                                ticketResultList.push(item)
                            }
                        })
                        
                        

                        this.SAVE_AVAILABEL_COUPON(ticketResultList)
                        this.SET_ACTIVITY_LIST(res.data.marketingResultList)
                        this.GET_KIND_PRICE(res.data)
                        this.CART_SET_GOODS_DATA(res.data.merGoodsList)
                        this.GET_CART_DATA(res.data)
                        this.SET_PAYED_LIST(res.data.payedList)
                        // this.couponPassWord = ''
                        // this.couponNum = ''
                        // this.couponBox = false
                        this.nowApplyCode = res.data.ticketResultList[0].applyCode
                        if(res.data.ticketResultList[0].couponAmount >= 2) {
                            // this.SET_CHECK_MANY(true)
                            // this.nowApplyCode = res.data.ticketResultList[0].applyCode
                            // this.couponCheckoutBox = true
                            this.$message({
                                showClose: true,
                                message: "请再输入一张券",
                                type: 'warning'
                            });
                        }else {
                            this.SET_CHECK_MANY(false)
                            this.nowApplyCode = '';
                        }
                        this.loading = false
                    }else {
                        this.CART_FIND_CART_DATA()
                        this.wrongTip(res)
                    }

                })
            }
           }
           
       },

       wrongTip(res) {
            this.loading = false
            this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    });
            return
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
                            position: relative;
                        }
                        .no-sel {
                            border: 1px solid #BCBCBC;
                            color: $font-color6;
                            cursor: not-allowed;
                        }
                        .iconchangcixuanzhongzhuangtai1 {
                            position: absolute;
                            right: 0;
                            top: 0;
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


