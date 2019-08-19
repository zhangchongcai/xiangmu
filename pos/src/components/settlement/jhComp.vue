<template>
    <div class="pay-containers">
      <div class="left">

          <div style="margin-bottom: 8px;">
             <span>
                 <span class="pay-count">原价：</span>
                 <span class="count-num total-num">{{payData.originalAmount + "元"}}</span>
             </span>
             <span>
                 <span class="pay-count">优惠：</span>
                 <span class="count-num total-num">{{payData.couponAmount + "元"}}</span>
             </span>
         </div>
         <div style="margin-bottom: 8px;">
             <span>
                 <span class="pay-count">应收：</span>
                 <span class="count-num total-num">{{payData.payAmount + "元"}}</span>
             </span>
         </div>
         <div style="margin-bottom: 8px;">
             <span>
                 <span class="pay-count">已付款：</span>
                 <span class="count-num total-num">{{payData.payedAmount + "元"}}</span>
             </span>
             <span>
                 <span class="pay-count">待支付：</span>
                 <span class="count-num rest-num">{{payData.notPayAmount + "元"}}</span>
             </span>
         </div>
        <div class="realPay">
             <span class="input-container-side">支付类型:</span>
             <el-radio-group v-model="payType" @change="cardType = 0">
                <el-radio :label="1">扫码支付</el-radio>
                <el-radio :label="2">银行卡支付</el-radio>
              </el-radio-group>
         </div>
         <div class="realPay" v-if="payType == 2">
             <span class="input-container-side">支付模式:</span>
             <el-radio-group v-model="cardType">
                <el-radio :label="0">连线支付</el-radio>
                <el-radio :label="1">离线支付</el-radio>
              </el-radio-group>
         </div>
         <div class="realPay">
             <span class="input-container-side">实收:</span>
             <input class="input-container" :disabled="cardType !=1 ? true : false" v-model="realPay" type="text" placeholder="实收数额">
             <!-- <input class="input-container" v-model="realPay" type="text" placeholder="实收数额">
             <span class="input-container-side">元</span> -->
         </div>
         <div class="realPay" v-if="payType == 1">
             <span class="input-container-side">条形码:</span>
             <input class="input-container" @keyup.enter="payIt" v-model="barCode" type="text" placeholder="条形码" @change="inputtingCode">
         </div>
         <template v-if="cardType == 1">
           <div class="realPay" >
             <span class="input-container-side">银行卡号:</span>
             <input class="input-container" v-model="bankNumber" type="text" placeholder="银行卡号">
          </div>
          <div class="realPay" >
              <span class="input-container-side">支付凭证:</span>
              <input class="input-container" v-model="payVoucher" type="text" placeholder="银行卡号">
          </div>
         </template>

         <div class="action-container" v-if="cardType == 0">
             <span class="input-container-side">提示:</span>
             <span class="input-container-without-line">
                 {{
                   payType == 1 ? '请使用扫码盒扫描顾客手机上的条码' : '请使用刷卡机刷卡'
                 }}
             </span>
         </div>

         <check-coupon-comp @openCouponCheckoutBox="openCouponCheckoutBox"></check-coupon-comp>
      </div>

      <div class="right">
        <NumberKeyBoard :showPointer="true" @keynumber="showResult"></NumberKeyBoard>
        <span class="result-btn" @click="cancle">取消</span>
        <span class="result-btn confirm-btn" @click="payIt">确定</span>
      </div>
    </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
import {SAVE_CHANGE_CASH, SAVE_CHANGE_CODE,GLOBAL_JHPAY_BODY_INFO,GLOBAL_JHPAY_SET_BANk_INFO} from 'types'
import NumberKeyBoard from 'components/numberKeyBoard'
import CheckCouponComp from 'components/coupons/CheckCoupon'
import vAlert from 'components/dialog/alert';
import jhPay from 'http/jhPay';
export default {
    data() {
        return {
            realPay: '', //实际支付
            barCode: '', //条形码
            online: false,
            outline: true,
            payType:1,
            cardType:0,
            bankNumber:'',
            payVoucher:'',
            ws:null,
            userAccount : localStorage.getItem('userAccount'),
            loading:null,
        }
    },

    computed:{
    ...mapGetters([
        'payData',
        'billCode'
    ]),
    applicationType(){
        if(this.payType == 1) return '02'
        if(this.payType != 1) return '00'
    },
    notPayAmount(){
        return this.payData.notPayAmount
    }
    },
    mounted(){
        this.realPay = this.payData.notPayAmount+'';
        // console.log(this.ws)
    },
    watch: {
        realPay() {
          this.realPay = this.NumberCheck(this.realPay)
          let change =Number(this.realPay) -  Number(this.payData.notPayAmount)
          change = change <= 0 ? 0 : change
          this.SAVE_CHANGE_CASH({cash: this.realPay, change: change})
        },
        notPayAmount(value){
            this.realPay = value
        }
    },

    methods: {
        ...mapMutations([
            SAVE_CHANGE_CASH,
            SAVE_CHANGE_CODE,
            GLOBAL_JHPAY_BODY_INFO,
            GLOBAL_JHPAY_SET_BANk_INFO
        ]),
        close(res){
        },
        openCouponCheckoutBox() {
           this.$emit("openCouponCheckoutBox")
        },

        inputtingCode() {
            // console.log(this.barCode)
            this.SAVE_CHANGE_CODE(this.barCode)
        },
        
        showResult(value) {
           this.realPay = value;
        },

        NumberCheck(num) {
            let str = num;
            let len1 = str.substr(0, 1);
            let len2 = str.substr(1, 1);
            //如果第一位是0，第二位不是点，就用数字把点替换掉
            if (str.length > 1 && len1 == 0 && len2 != ".") {
                str = str.substr(1, 1);
            }
            //第一位不能是.
            if (len1 == ".") {
                str = "";
            }
            //限制只能输入一个小数点
            if (str.indexOf(".") != -1) {
                let str_ = str.substr(str.indexOf(".") + 1);
                if (str_.indexOf(".") != -1) {
                str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
                }
            }
            //正则替换，保留数字和小数点
            str = str.replace(/[^\d^\.]+/g,'')
            //如果需要保留小数点后两位，则用下面公式
            // str = str.replace(/\.\d\d$/,'')
            return str;
        },

        payIt() {
          if(this.realPay) {
              if(this.payType == 1) {
                  if(!this.barCode) return this.$message.warning('请输入条形码！')
              }
              this[GLOBAL_JHPAY_SET_BANk_INFO]({
                  delFlag:this.cardType,
                  bankCardCode:this.bankNumber,
                  returnCode:this.payVoucher,
              })

            //  this.$emit('payIt')
            if(this.cardType == 0){
                this.ws = new jhPay({
                    open:(res) => {
                        this.ws.send({
                            applicationType:this.applicationType, //消费类型  循序1
                            transactionType:'00',//交易类型标志 循序4
                            payAmount:this.realPay,//JH支付金额转换 循序5
                            payCode:this.barCode, //支付码
                            ERPBillCode:this.billCode//订单号
                        })
                    },
                    message:(res) => {
                        if(res.returnCode != "00") return this.$message.error(res.misrepresentation)
                        this[GLOBAL_JHPAY_BODY_INFO](res.body)
                        this.$emit('payIt')
                    },
                    close:this.close,
                    error:(res) => {
                    }
                })
            }else{
                if(!this.bankNumber) return this.$message.warning('请输入银行卡号！')
                if(!this.payVoucher) return this.$message.warning('请输入支付凭证！')
                this.$emit('payIt')
            }
            
          }else {
               this.$message({
                                showClose: true,
                                message: "请输入支付价格",
                                type: 'error'
                             });
          }
        },

        cancle() {
          this.$emit('closePay')
        },
    },

    components: {
        NumberKeyBoard,
        CheckCouponComp,
        vAlert
    }
}
</script>

<style lang="scss" scoped>
  .pay-containers {
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-top: 6px;

    .left {
        width: 34vw;

        

        .realPay, .action-container {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin: 8px 0;

            .input-container {
                display: block;
                width: 15.8vw;
                height: 4.2vh;
                border: 1px solid #bcbcbc;
                border-radius: 2px;
                padding: 0 12px;
                margin: 0 4px;

                &:focus {
                    border: 1px solid $btn-background-color-theme;
                }
            }
            .input-container-without-line {
                display: block;
                margin: 0 4px;
            }
            .input-container-side {
                display: flex;
                width: 6.2vw;
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
                padding: 1.2vh 2.2vw;
                cursor: pointer;

                &:hover {
                    background: $btn-background-color-theme;
                    color: $font-color-white;
                }

                &:first-child{
                    margin-left: 4.4vw;
                }
            }
        }

        .open-coupon-btn {
            width: 6.3vw;
            height: 4.2vh;
            background: #ffffff;
            border-color: $blue-color;
            color: $blue-color;
            padding: 0;
            font-size: $font-size12;
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
           margin-right: 0.6vw;
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


