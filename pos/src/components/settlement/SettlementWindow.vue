<template>
    <div class="outter-wrapper"
    v-if="payDialog"  
    v-loading="loading"
    :element-loading-text="loadingContents"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(255, 255, 255, 0.65)">
    <el-button class="cancel-btn" v-show="cancelBtn && (payMethod.currentPayMethodId == 'WXPAY' || payMethod.currentPayMethodId == 'ALIPAY')" type="info" @click="cancelAliOrWiPay">取消支付</el-button>
        <div class="settlement-container">
            <div class="settlement-header">
              支付
              <i class="iconfont iconguanbi" @click="closePayDialog = true"></i>
            </div>

            <div class="settlement-contents">
               <div class="settle-left">
                  <div class="header-name">订单详情</div>
                  <div class="detial">
                    <GoodsDetil :hiddenAction=false :cartData="cartData" :goodTitleshow="false"></GoodsDetil>
                  </div>
               </div>

               <div class="settle-right">
                   <div class="header-name">可参与优惠活动</div>
                   <div class="discount-activity">
                      <div v-show="activityList.length" :class="['active-item', item.enable == 0 ? 'actived-item' : '', item.enable >= 0  ? '' : 'no-sel']" v-for="(item, index) in computedActivityList" :key="'active' + index" @mouseleave="closeDetail" @click="checkActivityPrice(item)">
                         <span class="item-name">{{item.ruleGroupName}}</span>
                         <span class="item-extend-btn">
                             <i class="iconfont iconyuanxingxialajiantou arrow-circle" @click.stop="openExtendDetail(item.id)"></i>
                         </span>
                         <div v-show="activitytempId == item.id" class="info-extend">
                             {{item.releGroupRemark}}
                         </div>
                      </div>

                      <div v-show="activityList.length" class="arrow-btn pre-btn" @click="prePage">
                          <i :class="['iconfont', activityList.length <= 6 ? 'no-iconfont' : '',  'iconshangjiantouanniu']"></i>
                      </div>
                      <div v-show="activityList.length" class="arrow-btn next-btn" @click="nextPage">
                          <i :class="['iconfont', activityList.length <= 6 ? 'no-iconfont' : '',  'iconxiajiantouanniu']"></i>
                      </div>

                      <div class="active-default" v-show='!activityList.length'>
                        {{activityTip}}
                      </div>
                   </div>

                   <div class="header-name">
                       <span class="header-name-span">支付方式
                           <span class="current-paymethod">已选：{{payMethod.currentPayMethod}}</span>
                       </span>
                       <el-button class="change-paymethods-button" @click="showMorePayMethods">更换支付方式</el-button>
                   </div>

                   <div class="pay-container">
                       <components ref="payComp" :is="componentsName" @openCouponCheckoutBox="openCouponCheckoutBox" @closePay="closePayDialog = true"  @payIt="goPaying" @inputMemberPassword="inputMemberPassword"></components> 
                   </div>

                   <div v-if="payData.payedAmount != 0" class="pay-result">
                        <span>已支付:
                            <span class="pay-price">{{payData.payedAmount}}元</span>
                        </span>
                    </div>

                    <div v-show="payedList.length" class="payed-lists-container">
                        <div class="payed-list-left">
                            <span class="payed-item" v-for="(item, index) in payedList" :key="index">
                                <span class="payed-name">{{item.payTypeName}}</span>
                                <span class="payed-detail" style="color: #ff7900;">
                                    {{item.payTypeName}}
                                    {{(item.voucherAmount) + '元'}}
                                </span>
                                <i  v-show="!(item.payTypeCode == '0X10' || item.payTypeCode == '0X09' || item.payTypeCode == 'GPFB')" class="iconfont iconshanchu" style="color: #3B74FF; padding: 0 8px; cursor: pointer; float: right" @click="refundIt(item)"></i>
                            </span>
                        </div>
                        <!-- <div class="payed-list-right">
                        </div> -->
                    </div>

               </div>
            </div>
        </div>

        <!-- 更多支付方式 -->
        <more-pay usedInBox="paypop"></more-pay>
        <!-- 查询会员优惠券 -->
        <check-coupon></check-coupon>
        <!-- 优惠票券查询结果 -->
        <coupon-results></coupon-results>
        <!-- 团购券查询结果 -->
        <g-coupon-results @passGrouponData="openconsumegcBox"></g-coupon-results>
        <!-- 团购券查询添加 -->
        <consumegc :datas="passData"></consumegc>

        <!-- 会员支付密码 -->
        <el-dialog
        :visible.sync="memberPassWordBox"
        width="28%"
        :append-to-body="true"
        :close-on-click-modal="false"
        >
            <span slot="title" style="font-size: 1.22vw">请输入会员支付密码</span>
            <div style="width: 23.6vw; margin: 0 auto;">
                <el-input
                ref="memberPwdInputer"
                style="width: 23.6vw; margin: 0 auto;"
                placeholder="输入密码"
                type="password"
                v-model="memberPassWord"
                clearable>
                </el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="memberPassWordBox = false">取 消</el-button>
                <el-button type="primary" @keyup.native.enter="confirmPasswords" @click="confirmPasswords">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 代金券密码输入 -->
        <el-dialog
        :visible.sync="couponBox"
        width="28%"
        :append-to-body="true"
        :close-on-click-modal="false"
        >
            <span slot="title" style="font-size: 1.22vw">请输入代金券密码</span>
            <div style="width: 23.6vw; margin: 0 auto;">
                <el-input
                ref="couponPwdInputer"
                style="width: 23.6vw; margin: 0 auto;"
                placeholder="输入密码"
                type="password"
                v-model="couponPassWord"
                clearable>
                </el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="couponBox = false">取 消</el-button>
                <el-button type="primary"  @click="confirmCouponPasswords">确 定</el-button>
            </span>
        </el-dialog> 

        <!-- 票券查询 -->
        <el-dialog
        :visible.sync="couponCheckoutBox"
        width="28%"
        :append-to-body="true"
        :close-on-click-modal="false"
        :before-close="CouponClose"
        >   
            <span slot="title" style="font-size: 1.22vw">使用票券</span>
            <div style="width: 23.6vw; margin: 0 auto;">
                <el-input
                ref="addCouponsInputer"
                placeholder="请扫描或输入票券编号"
                v-model="couponNum"
                clearable>
                </el-input>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button class="coupon-common-style coupon-add" type="primary" @click="directeCheckout">添加</el-button>
            </span>
        </el-dialog>

        <!-- 取消支付前确认 -->
        <el-dialog
        :visible.sync="closePayDialog"
        width="28%"
        :append-to-body="true"
        :close-on-click-modal="false"
        >   
            <span slot="title" style="font-size: 1.22vw">提示</span>
            <span style="font-size: 1.04vw">
                {{payedList.length ? "返回主页面后将自动撤销所有支付并清空购物车，是否继续？" : "返回主页面将清空购物车，是否继续？"}}
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closePayDialog = false">取 消</el-button>
                <el-button type="primary" @click="closePay">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 结算失败弹框 -->
        <el-dialog
        :visible.sync="settleDown"
        width="28%"
        :append-to-body="true"
        :close-on-click-modal="false"
        :show-close="false"
        >
            <span slot="title" style="font-size: 1.22vw">提示</span>
            <span style="font-size: 1.04vw">
                结算失败，请返回主页面，系统将自动撤销所有支付并清空购物车
            </span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="closePay">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import md5 from 'js-md5'
import commonutil from 'util'
import {openCashBox} from "views/member/util/utils";
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {PAY_DIALOG_TRIGER, MORE_PAY_TRIGER, PAY_METHOD_TRIGER, GET_KIND_PRICE, SET_RETURN_PAY, CART_SET_GOODS_DATA, SET_PAY_RESULT,GET_CART_BILLCODE, CLEAR_SELECTION, GET_CART_DATA, CHECK_CURRENT_SEAT_STATUS, SET_PAYED_LIST, SET_ACTIVITY_LIST, GET_ACTIVITY_DATA, SET_ACTIVITY_ID_TEMP, CART_FIND_CART_DATA, SELECTE_ACTIVITY_ID, CHECK_OUT_COUPON, CANCEL_ACTIVITY_DATA, SAVE_AVAILABEL_COUPON, CLEAR_ALL_SELECTED_COUPON, CLEAR_ALL_CART, RENDER_SELECTION_AFTER_RELEASE, CHECKOUT_CONSUMEGCOUPON_RESULT, CLEAR_ALL_GROUPONS, SET_VIP_INFO,SET_HAS_CONSUME_ACTIVITY, SET_CHECK_MANY, CLEAR_SEL_ACTIVITY,CART_IS_PAY_ING,SET_WITH_COUPON} from 'types'
import { VM_CLOCE_COUPON } from 'types/vmOnType'
import {payIt, findCart, saveSaleBill, settleIt, clearAllTicket, syncFlow,movieTicketSuccess, findTimeSeatStatus, refundIt, clearAllCart, checkoutActivety, payVip,  proveCoupon, refundVip, couponPay, consumeCoupon, consumeActivity, cancelAllActivityCoupons, releaseSeat, proveCouponPwd, proveIsNeedPwd, queryAliWeiPayResult, grouponPay,getJhPayParam, checkoutVip, proveSecCoupon} from 'src/http/apis.js'

//各类型支付方式的组件导入
import payWXPAYComp from 'components/settlement/payWXPAYComp'
import payALIPAYComp from 'components/settlement/payALIPAYComp'
import payXUNPComp from 'components/settlement/payXUNPComp'
import pay0X03Comp from 'components/settlement/pay0X03Comp'
import payXRMBComp from 'components/settlement/payXRMBComp'
import payJHPAYComp from 'components/settlement/payJHPAYComp'
import thirdpartyComp from  'components/settlement/thirdpartyComp'
import ScoreComp from 'components/settlement/ScoreComp'
import HoldComp from 'components/settlement/HoldComp'
import payUNIONPAYComp from 'components/settlement/payUNIONPAYComp'
import MorePay from 'components/dialog/MorePay'
import CheckCoupon from 'components/settlement/CheckCoupon'
import GoodsDetil from 'components/cart/DetailGood'
import CouponResults from 'components/settlement/CouponResults'
import GCouponResults from 'components/groupcoupons'
import CouponList from 'components/settlement/CouponList'
import Consumegc from 'components/groupcoupons/consumgc'
import util from 'src/http/app.js'
import voucherData from 'src/http/voucherData'
import printing from 'src/http/printing'
import jhPay from 'http/jhPay';
export default {
    data() {
        return {
          loading: false, //遮罩
          loadingContents: "请求中...", //遮罩文字内容
          cancelBtn: false,
          currentPayIndex: 0,
          componentsTypeName: 'coupon',
          memberPassWord: '',
          couponNum: '',
          memberPassWordBox: false,
          couponCheckoutBox: false,
          currentPage: 1,
          couponBox: false,
          couponPassWord: '',
          tempCouponData: null,
          startWaitingTime: 0,         
          passData: {},
          ws:null,
          closePayDialog: false,
          settleDown: false,
          nowApplyCode:'',
          key:0
        }
    },
    watch: {
      //自动获取焦点
      memberPassWordBox() {
          setTimeout(() => {
              this.$refs.memberPwdInputer.focus()
          }, 300)
      },

      couponBox() {
         setTimeout(() => {
             this.$refs.couponPwdInputer.focus()
         }, 300)
      },

      couponCheckoutBox() {
          setTimeout(() => {
             this.$refs.addCouponsInputer.focus()
          }, 300)
      }
    },

    computed: {
       ...mapGetters([
           'payDialog',
           'allPayWays',
           'cartData',
           'payMethod',
           'payNum',
           'payData',
           'billCode',
           'cinemaUid',
           'billCodeUid',
           'terminalId',
           'currentFilmId',
           'payResult',
           'configData',
           'cinemaCode',
           'currentPlanCode',
           'currentTicketMinPrice',
           'payedList',
           'activityList',
           'activitytempId',
           'vipInfo',
           'goodsList',
           'cartDatalist',
           'channelCode',
           'channelName',
           'selActivityList',
           'terminalId',
           'tenantId',
           'userUid',
           'availableCouponList',
           'activityTip',
           'seatSelection',
           'consumeGroupCoupons',
           'jhPayBody',
           'jhPayBanks',
           'cardPayBanks',
           'hasConsumeActivity',
           'checkMany',
           'cashCouponsLen',
           'getUserConfig'
       ]),

       computedActivityList() { //活动分页处理
          if(this.activityList.length)
          return this.activityList.slice((this.currentPage-1) * 6, (this.currentPage) * 6)
       },

      totalSize() {  //活动总页数
         if(this.activityList.length)
         return Math.ceil(this.activityList.length / 6)

      },

        // XRMB 现金
        // 0X03 会员卡
        // XUNP 银行卡
        // 0X08 留座
        // INCRM 积分
        // 0X10 影院补贴
        // UNIONPAY 银联
        // ALIPAY 支付宝
        // WXPAY 微信
        // JHPAY 聚合支付

       componentsName() {
           let currentPayMethodType = this.payMethod.currentPayMethodId
           switch(currentPayMethodType) {
               case 'WXPAY':
               case 'ALIPAY':
               case 'XUNP':
               case 'UNIONPAY':
               case '0X03':
               case 'XRMB':
            //    case 'INCRM':
            //    case '0X08':
               case 'JHPAY':
               return `pay${currentPayMethodType}Comp`
               default :
               return 'thirdpartyComp'
           }
       }
       
       
    },

    methods: {
        ...mapMutations([
           PAY_DIALOG_TRIGER,
           MORE_PAY_TRIGER,
           PAY_METHOD_TRIGER,
           GET_KIND_PRICE,
           SET_RETURN_PAY,
           SET_PAY_RESULT,
           GET_CART_BILLCODE,
           CLEAR_SELECTION,
           GET_CART_DATA,
           CART_SET_GOODS_DATA,
           CHECK_CURRENT_SEAT_STATUS,
           SET_PAYED_LIST,
           SET_ACTIVITY_LIST,
           SET_ACTIVITY_ID_TEMP,
           SELECTE_ACTIVITY_ID,
           CHECK_OUT_COUPON,
           SAVE_AVAILABEL_COUPON,
           CLEAR_ALL_SELECTED_COUPON,
           CLEAR_ALL_CART,
           RENDER_SELECTION_AFTER_RELEASE,
           CHECKOUT_CONSUMEGCOUPON_RESULT,
           CLEAR_ALL_GROUPONS,
           SET_VIP_INFO,
           SET_HAS_CONSUME_ACTIVITY,
           SET_CHECK_MANY,
           CLEAR_SEL_ACTIVITY,
           CART_IS_PAY_ING,
           SET_WITH_COUPON
        ]),
        ...mapActions([
            GET_ACTIVITY_DATA,
            CART_FIND_CART_DATA,
            CANCEL_ACTIVITY_DATA
        ]),

        CouponClose(done){
            if(!this.nowApplyCode) return done()
            this.$confirm('关闭会清空该套券, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    for(let i = 0; i < this.availableCouponList.length; i++){
                        let item = this.availableCouponList[i];
                        if(item.applyCode == this.nowApplyCode && item.key == this.key){
                            this.$vm.$emit(VM_CLOCE_COUPON,item)
                            this.nowApplyCode = '';
                            done()
                            break;
                        }
                        
                    }
                }).catch(() => {
                       
                });
        },

        //取消微信支付宝支付
        cancelAliOrWiPay() {
           this.cancelBtn = false
        },

        //打开团购券消费接口
        openconsumegcBox(item) {
          this.passData = item
          this.CHECKOUT_CONSUMEGCOUPON_RESULT()
        },

        //取消支付
        async cancelAll() {
           await clearAllCart({
               billCode: this.billCode
           }).then(res => {
               if(res.code == 200) {
                  this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'info'
                    });
                  this.SET_PAYED_LIST([])
                  this.closePayDialog = false
                  this.SET_PAY_RESULT()
                  this.SAVE_AVAILABEL_COUPON([])
                  this.CART_SET_GOODS_DATA([])
                  this.GET_CART_BILLCODE('')
                  this.SET_HAS_CONSUME_ACTIVITY(false)
                  this.CLEAR_ALL_SELECTED_COUPON()
                  this.currentPage = 1
                  this.settleDown = false
                  this.loading = false
                  this.PAY_DIALOG_TRIGER()
               }
           })
        },

        //活动上一页
        prePage() {
           if(this.currentPage > 1) {
               this.currentPage = this.currentPage - 1
           }
        },

        //活动下一页
        nextPage() {
           if(this.currentPage < this.totalSize) {
               this.currentPage = this.currentPage + 1
           }
        },

        openCouponCheckoutBox() {
          this.couponCheckoutBox = true
          this.couponNum = ''
        },

        //优惠券的验证 添加按钮触发
        directeCheckout() {
          if(!this.couponNum) {
              return this.wrongTip({msg: "票券不能为空"})
          }
          if(!(this.availableCouponList.some(item => {
              return item.ticketCode == this.couponNum
          }))) {
            let status = true;
            this.availableCouponList.map((item)=>{
                if(item.applyCode == this.nowApplyCode){
                    status = false
                }
            })  
            if(status){
                proveIsNeedPwd({
                    billCode: this.billCode,
                    couponCode: this.couponNum,
                    cardNum: this.vipInfo.cardNo || "",
                    payTypeCode: this.payMethod.currentPayMethodId,
                    tenantId: this.tenantId,
                    timestamp: commonutil.formatTime(new Date(), 'yyyy-MM-dd hh:mm:ss.S'),
                    businessCode: this.cinemaCode,
                    channelCode: this.channelCode,
                    terminalCode: this.terminalId,
                    chooseKeys: this.selActivityList
                }).then(res => {
                    if(res.code == 200) {
                        if(res.data) {
                            this.couponBox = true
                        }else {
                            this.proveTickets()
                        }
                    }else {
                        this.wrongTip(res)
                    }
                    this.couponCheckoutBox = false
                })
            }else{
                this.proveTickets()
            }
          }else {
            //-------qiudongyue添加，如果有更好方法请重写start---------
            this.$message({
                showClose: true,
                message: "已添加此票券",
                type: 'error',
                duration: 500,
                onClose: () => {
                    this.couponCheckoutBox = true
                    this.couponNum=""
                }
            });
            //-------qiudongyue添加，如果有更好方法请重写end---------
          }
          
          this.couponCheckoutBox = false
        //   this.couponNum = ''
        },
        //打开会员持有的优惠券列表
        checkoutCouponList() {
           this.couponCheckoutBox = false
           this.CHECK_OUT_COUPON()
        },
        //活动详情展开关闭
        openExtendDetail(id) {
          this.SET_ACTIVITY_ID_TEMP(id)
        },
        //关闭详情
        closeDetail() {
          this.SET_ACTIVITY_ID_TEMP('')
        },
        //活动查询价格
        async checkActivityPrice(item) {
           if(this.hasConsumeActivity) return this.$message({
                        showClose: true,
                        message: "已有支付生成，不可变更活动",
                        type: 'warning'
                    });
           if(item.enable == 1) {
              this.loading = true
              this.loadingContents = '请求中...'
              this.SELECTE_ACTIVITY_ID(item.id)
              let couponData = await checkoutActivety({billCode: this.billCode, payTypeCode: this.payMethod.currentPayMethodId, couponKey: item.id, chooseKeys: this.selActivityList})
                if(couponData.code == 200) {
                    this.SET_ACTIVITY_LIST(couponData.data.marketingResultList)
                    this.GET_KIND_PRICE(couponData.data)
                    this.CART_FIND_CART_DATA()
                    this.loading = false
                }else {
                    this.loading = false
                    this.CANCEL_ACTIVITY_DATA(item.id)
                    this.wrongTip(couponData)
                }
           }else if(item.enable == 0){
              this.loading = true
              this.loadingContents = '请求中...'
              this.CANCEL_ACTIVITY_DATA(item.id)
              setTimeout(() => {
                  this.loading = false
              }, 300)
           }
        },
        //错误提示
        wrongTip(res) {
            this.loading = false
            this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    });
        },
        confirmPasswords() {
           if(!this.memberPassWord) {
               this.wrongTip({
                   msg: "密码不能为空"
               })
           }else {
               this.memberPassWordBox = false
               this.goPaying()
           }
        },
        inputMemberPassword() {
            if(this.payData.notPayAmount == 0 || this.memberPassWord) {
                this.goPaying()
            }else {
                this.memberPassWordBox = true
                commonutil.secKeyBoard(this.configData).then((res)=>{
                    this.memberPassWord = res;
                    this.memberPassWordBox = false;
                    this.confirmPasswords();
                }).catch(err=>{
                    // debugger
                    // this.memberPassWordBox = false;
                })
            }
        },

        //代金券输入密码
        confirmCouponPasswords() {
          proveCouponPwd({
            couponCode: this.couponNum,
            pwd: this.couponPassWord,
            cinemaCode: this.cinemaCode,
            channelCode: this.channelCode,
            tenantId: this.tenantId
          }).then(res => {
             if(res.code == 200) {
                this.proveTickets()
                }else {
                    this.couponPassWord = ''
                    this.tempCouponData = null
                    this.couponBox = false
                    this.wrongTip(res)
                }
          })
        },

        //验证票券的可用性
       proveTickets() {
           let paras = {
                        billCode: this.billCode,
                        couponCode: this.couponNum,
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
                        let newArr = [...this.availableCouponList,item]
                        this.SAVE_AVAILABEL_COUPON(newArr)
                        this.couponPassWord = ''
                        this.couponNum = ''
                        this.couponBox = false
                        let index = 0;
                        for(let i = 0; i < this.availableCouponList.length; i++){
                            if(this.availableCouponList[i].applyCode == this.nowApplyCode && this.availableCouponList[i].key == this.key){
                                index++
                            }
                        }
                        if(index < item.couponAmount) {
                            
                            this.SET_CHECK_MANY(true)
                            this.couponCheckoutBox = true
                            this.$message({
                                showClose: true,
                                message: "请再输入一张券",
                                type: 'warning'
                            });
                        }else {
                            this.SET_CHECK_MANY(false)
                            this.nowApplyCode = '';
                        }
                    }else {
                        this.wrongTip(res)
                        this.couponCheckoutBox = true
                        this.couponNum = ''
                        
                    }
                })
           }else {
               proveCoupon(paras).then(res => {
                if(res.code == 200) {
                    // let currentTickets = res.data.ticketResultList.filter(item => {
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
                    this.couponPassWord = ''
                    this.couponNum = ''
                    this.couponBox = false
                    this.nowApplyCode = res.data.ticketResultList[0].applyCode
                    if(res.data.ticketResultList[0].couponAmount >= 2) {
                        // this.SET_CHECK_MANY(true)
                        // this.nowApplyCode = res.data.ticketResultList[0].applyCode
                        this.couponCheckoutBox = true
                        this.$message({
                            showClose: true,
                            message: "请再输入一张券",
                            type: 'warning'
                        });
                    }else {
                        this.SET_CHECK_MANY(false)
                        this.nowApplyCode = '';
                    }
                }else {
                    this.CART_FIND_CART_DATA()
                    this.couponCheckoutBox = true;
                    this.wrongTip(res)
                }
            })
           }
       },

       goPaying() {
         if(this.payData.notPayAmount == 0) {
             this.directSettle()
         }else {
             this.payIt()
         }
       },

       //待支付为0时 直接调用结算接口
       async directSettle() {
           this.loading = true
           this.loadingContents = "结算中..."
            
           if(this.selActivityList.length) {
            let cinemaPayAmount = '';
            for(let i = 0; i < this.cartData.marketingResultList.length; i++){
                if(this.cartData.marketingResultList[i].enable === 0){
                    cinemaPayAmount = this.cartData.marketingResultList[i].cinemaTicketPay
                    break
                }
            }
             let consumeActivityData = await consumeActivity({
                tenantId: this.tenantId,
                memberId: this.vipInfo.memberId || null,
                billCode: this.billCode,
                payTypeCode: this.payMethod.currentPayMethodId,
                chooseKeys: this.selActivityList,
                cinemaPayAmount
            })

            if(consumeActivityData.code != 200) {
                return this.wrongTip(consumeActivityData)
            }else {
                this.SET_HAS_CONSUME_ACTIVITY(true)
                this.CLEAR_SEL_ACTIVITY()
            }
          }

          let saveData = await saveSaleBill({billCode: this.billCode})

          if(saveData.code != 200) {
            return this.wrongTip(saveData)
          }

        //   if(!this.hasConsumeActivity){
        //       this[SET_WITH_COUPON](0)
        //       if(this.availableCouponList.length) {
        //             let appliesArr = this.availableCouponList.map(item => {
        //                 let obj = {
        //                     applyCode: item.applyCode,
        //                     ruleId: item.ruleId,
        //                     exchangeType: item.exchangeType,
        //                     couponCodes: [{
        //                         couponCode: item.ticketCode,
        //                         pwd: item.pwd,
        //                         creditAmount: item.recoveryAmount
        //                     }]
        //                 }

        //                 return obj
        //             })
        //             //  console.log(appliesArr)
        //             let consumeCouponData =  await consumeCoupon({
        //                 tenantId: this.tenantId,
        //                 channelCode: this.channelCode,
        //                 outTradeNo: this.billCode,
        //                 businessCode: this.cinemaCode,
        //                 applies: appliesArr
        //             })
        //             if(consumeCouponData.code !=200){
        //                 this[SET_WITH_COUPON](1)
        //                 return this.wrongTip(consumeCouponData)
        //             }
        //         }
        //     }
        this[SET_WITH_COUPON](0)
            if(this.availableCouponList.length) {
                    let appliesArr = this.availableCouponList.map(item => {
                        let obj = {
                            applyCode: item.applyCode,
                            ruleId: item.ruleId,
                            exchangeType: item.exchangeType,
                            couponCodes: [{
                                couponCode: item.ticketCode,
                                pwd: item.pwd,
                                creditAmount: item.recoveryAmount
                            }]
                        }

                        return obj
                    })
                    //  console.log(appliesArr)
                    let consumeCouponData =  await consumeCoupon({
                        tenantId: this.tenantId,
                        channelCode: this.channelCode,
                        outTradeNo: this.billCode,
                        businessCode: this.cinemaCode,
                        applies: appliesArr
                    })
                    if(consumeCouponData.code !=200){
                        this[SET_WITH_COUPON](1)
                        return this.wrongTip(consumeCouponData)
                    }
                }
          let directSettlementData = await settleIt({
                    original_price: this.payData.originalAmount,
                    plan_id: this.currentFilmId,
                    saleBillUid: this.billCodeUid,
                    terminalCode: this.terminalId,
                    total_price: this.payData.payAmount,
                    getFlag: this.configData.sale_goods_print_type
                 })
        // console.log(directSettlementData)

        if(directSettlementData.status == 200) {
                this.$message({
                    showClose: true,
                    message: "购买成功！谢谢",
                    type: 'success'
                });
                this[CART_IS_PAY_ING](false)

                    this.GET_CART_BILLCODE('')
                    this.CART_SET_GOODS_DATA([])
                    this.SET_PAYED_LIST([])
                    this.CLEAR_SELECTION()
                    this.CLEAR_ALL_GROUPONS()
                    this.CLEAR_ALL_CART();
                    this.SET_HAS_CONSUME_ACTIVITY(false)
                    this.CLEAR_ALL_SELECTED_COUPON()
                    this.currentPage = 1

                findTimeSeatStatus({
                        cinemaCode: this.cinemaCode,
                        planCode: this.currentPlanCode
                    }).then(res => {
                        if(res.code == 200) {
                           this.CHECK_CURRENT_SEAT_STATUS(res.data)
                        }
                    })

                this.PAY_DIALOG_TRIGER()
                this.loading = false
                let cti = directSettlementData.data.cinemaTicketInfo
                let index =  0 
                let successPrintArr=[]
                if(this.payMethod.currentPayMethodId == 'XRMB') openCashBox.call(this,this.configData)
                if(cti && cti.length){ //判断是否有购买影票
                    this.printTicket(cti , index , successPrintArr,()=>{
                        this.printVoucherTicket(directSettlementData.data.transactionVoucher)
                    })
                }else{
                    this.printVoucherTicket(directSettlementData.data.transactionVoucher)
                }
          }else {
                 this.settleDown = true
          }
       },

        async payIt() {  //确定支付，由子组件触发事件

           this.loading = true //打开遮罩
           this.loadingContents = "支付中..."
           let ticketLen = this.cartData.goodsList.length
           let goodsLen = this.cartDatalist.length
           let payType = ticketLen && goodsLen ? 2 : ticketLen ? 0 : goodsLen ? 1 : ''; //判断支付产品类型

          if(this.selActivityList.length) {
              let cinemaPayAmount = ''
              for(let i = 0; i < this.cartData.marketingResultList.length; i++){
                if(this.cartData.marketingResultList[i].enable === 0){
                    cinemaPayAmount = this.cartData.marketingResultList[i].cinemaTicketPay
                    break
                }
                }
             let consumeActivityData = await consumeActivity({
                tenantId: this.tenantId,
                memberId: this.vipInfo.memberId || null,
                billCode: this.billCode,
                payTypeCode: this.payMethod.currentPayMethodId,
                chooseKeys: this.selActivityList,
                cinemaPayAmount
            })

            if(consumeActivityData.code != 200) {
                return this.wrongTip(consumeActivityData)
            }else {
                this.SET_HAS_CONSUME_ACTIVITY(true)
                this.CLEAR_SEL_ACTIVITY()
            }
          }

        //   if(!this.hasConsumeActivity){
        //       this[SET_WITH_COUPON](0)
        //       if(this.availableCouponList.length) {
        //             let appliesArr = this.availableCouponList.map(item => {
        //                 let obj = {
        //                     applyCode: item.applyCode,
        //                     ruleId: item.ruleId,
        //                     exchangeType: item.exchangeType,
        //                     couponCodes: [{
        //                         couponCode: item.ticketCode,
        //                         pwd: item.pwd,
        //                         creditAmount: item.recoveryAmount
        //                     }]
        //                 }

        //                 return obj
        //             })
        //             //  console.log(appliesArr)
        //             let consumeCouponData =  await consumeCoupon({
        //                 tenantId: this.tenantId,
        //                 channelCode: this.channelCode,
        //                 outTradeNo: this.billCode,
        //                 businessCode: this.cinemaCode,
        //                 applies: appliesArr
        //             })
        //             if(consumeCouponData.code !=200){
        //                 this[SET_WITH_COUPON](1)
        //                 return this.wrongTip(consumeCouponData)
        //             }
        //         }
        //     }
         
           
            
          let saveData = await saveSaleBill({billCode: this.billCode}), couponPayData, payData;  //定义查询结果变量 减少深度嵌套导致的深度查询

          if(saveData.code == 200) {
              let requestData = {
                    cinemaUid: this.cinemaUid,
                    saleBillCode: this.billCode,
                    saleBillUid: this.billCodeUid,
                    payTypeCode: this.payMethod.currentPayMethodId,
                    body: this.jhPayBody || "影票/卖品",
                    payTypeName: this.payMethod.currentPayMethod,
                    returnAmount: this.payNum.realChange,
                    payAmount: this.payNum.realPayNum,
                    authCode: this.payNum.authCode,
                    memberCardCode: this.vipInfo.cardNo,
                    memberId: this.vipInfo.memberId,
                    ruleId: this.selActivityList,
                    maiden: !Boolean(this.payedList.length),
                    memberPassword: md5(this.memberPassWord),
                    payType: payType,
                    channelNo: this.channelCode,
                    channelName: this.channelName,
                    barCode: this.payNum.authCode,
                    terminaCode: this.terminalId,
                    delFlag:this.jhPayBanks.delFlag || this.cardPayBanks.delFlag,
                    bankCardCode:this.jhPayBanks.bankCardCode || this.cardPayBanks.bankCardCode,
                    returnCode:this.jhPayBanks.returnCode || this.cardPayBanks.returnCode,
                    defFg:this.payMethod.defFg ? true : false,
              } 

                payData = await payIt(requestData)   

          }else {
              return this.wrongTip(saveData)
          }
          if(payData.code == 200) this.SET_HAS_CONSUME_ACTIVITY(true)
          if(payData.code == 200 && payData.data.status == 1) {
            this.memberPassWordBox = false
            this.SET_RETURN_PAY(payData.data.returnAmount)
            this.SET_PAY_RESULT()
            if(this.payMethod.currentPayMethodId == '0X03') {
               this.checkMemberInfo()
            }
            this.isSettle()
          }else {
            if((this.payMethod.currentPayMethodId == 'WXPAY' || this.payMethod.currentPayMethodId == 'ALIPAY') && payData.code == 200 && payData.data.status == 0) {
                // console.log("微信支付中...")
                this.startWaitingTime = new Date().getTime();
                this.SET_PAY_RESULT()
                this.memberPassWordBox = false
                this.queryAliWeiPayResults(payData.data.uid)
            }else {
                this.memberPassWord = ''
                return this.wrongTip(payData)
            }
            
          }
        },

        //查询购物车待支付金额是否发起结算
        async isSettle() {
          let findCartData = await findCart({billCode: this.billCode}), settlementData;

          if(findCartData && findCartData.code == 200) {
              this.GET_KIND_PRICE(findCartData.data)
              this.SET_PAYED_LIST(findCartData.data.payedList)
              if(findCartData.data.notPayAmount <= 0) {
                 this.loadingContents = '结算中...'
                    this[SET_WITH_COUPON](0)
                    if(this.availableCouponList.length) {
                            let appliesArr = this.availableCouponList.map(item => {
                                let obj = {
                                    applyCode: item.applyCode,
                                    ruleId: item.ruleId,
                                    exchangeType: item.exchangeType,
                                    couponCodes: [{
                                        couponCode: item.ticketCode,
                                        pwd: item.pwd,
                                        creditAmount: item.recoveryAmount
                                    }]
                                }

                                return obj
                            })
                            //  console.log(appliesArr)
                            let consumeCouponData =  await consumeCoupon({
                                tenantId: this.tenantId,
                                channelCode: this.channelCode,
                                outTradeNo: this.billCode,
                                businessCode: this.cinemaCode,
                                applies: appliesArr
                            })
                            if(consumeCouponData.code !=200){
                                this[SET_WITH_COUPON](1)
                                return this.wrongTip(consumeCouponData)
                            }
                        }
                 settlementData = await settleIt({
                    original_price: this.payData.originalAmount,
                    plan_id: this.currentFilmId,
                    saleBillUid: this.billCodeUid,
                    terminalCode: this.terminalId,
                    total_price: this.payData.payAmount,
                    getFlag: this.configData.sale_goods_print_type
                 })
              }else {
                    this.loading = false
                    this.cancelBtn = false
                    this[CART_IS_PAY_ING](true)
                    this.$refs.payComp.clearOldCash();
                    this.$message({
                                showClose: true,
                                message: "请完成剩余支付",
                                type: 'warning'
                            });
                    return
                }
          }else {
            return this.wrongTip(findCartData)
          }
          if(settlementData.status == 200) {
                this.$message({
                    showClose: true,
                    message: "购买成功！谢谢",
                    type: 'success'
                });
                this[CART_IS_PAY_ING](false)
                this[SET_WITH_COUPON](1)
                
                    this.GET_CART_DATA({goodsList: []})
                    this.GET_CART_BILLCODE('')
                    this.CART_SET_GOODS_DATA([])
                    this.SET_PAYED_LIST([])
                    this.CLEAR_SELECTION()
                    this.CLEAR_ALL_GROUPONS()
                    this.SET_HAS_CONSUME_ACTIVITY(false)
                    this.CLEAR_ALL_SELECTED_COUPON()
                    this.currentPage = 1
                    this.memberPassWord = ''

                findTimeSeatStatus({
                        cinemaCode: this.cinemaCode,
                        planCode: this.currentPlanCode
                    }).then(res => {
                        if(res.code == 200) {
                           this.CHECK_CURRENT_SEAT_STATUS(res.data)
                        }
                    })

                this.PAY_DIALOG_TRIGER()
                this.loading = false
                this.cancelBtn = false
                let cti = settlementData.data.cinemaTicketInfo
                let index =  0 
                let successPrintArr=[]
                if(this.payMethod.currentPayMethodId == 'XRMB') openCashBox.call(this,this.configData)
                if(cti && cti.length){ //判断是否有购买影票
                    this.printTicket(cti , index , successPrintArr,()=>{
                        this.printVoucherTicket(settlementData.data.transactionVoucher)
                    })
                }else{
                    this.printVoucherTicket(settlementData.data.transactionVoucher)
                }
          }else {
                 this.settleDown = true
          }
        },
        
        printTicket(cti,index,successPrintArr,callback) {
            let cel = cti[index]
            util.printTicket('film_print',cel,this.configData,args=> {
                if(args == "浏览器不支持此功能"){
                    return this.$message.error('浏览器不支持打印功能')
                }
                // console.log('打印：',index,'影票 ')
                // console.log("数据：",cel)
                if(args[0]==0){
                    successPrintArr.push(cel.ticketUid)
                    this.$message({
                                showClose: true,
                                message: `打印完成第${index+1}张影票`,
                                type: 'success',
                                duration:1000
                            });
                }else{
                    this.$message.error({
                                type:'error',
                                showClose: true,
                                message:`打印第${index+1}张影票失败`,
                                duration:0
                    })
                }
                index++
                if(index<cti.length){
                    // console.log('打印影票')
                    this.printTicket(cti,index,successPrintArr,callback)
                }else{
                    //打印结束
                    // console.log(successPrintArr,)
                    this.$message({
                                message:'打印结束！',
                                showClose: true,
                                type:'success',
                                duration:3000
                        })
                    
                   //打印结束后发起打印结果的请求
                   callback && callback()
                    movieTicketSuccess(successPrintArr).then(res => {
                        // console.log('打印完成后发起打印结果请求',res)
                    })
                }
            })
        },
        printVoucherTicket(data,type=1){ //打印凭证，
            if(!data) return
            let printData  =  voucherData.trade_print(type,voucherData.type1Data(data))
            util.printTicket('bill_print',printData,this.configData,(res)=>{
                
                if(this.configData.sale_goods_print_type != 1){ //此处判断是否打印取货凭证
                    if(type ==2 ) return //防止死循环，打印取货凭证 传多一个type为2
                    this.printVoucherTicket(data,2)
                }
            })
        },

        //查询会员信息
        async checkMemberInfo() {
            let vipResultdata = await checkoutVip({memberNumber: this.vipInfo.cardNo, code: this.billCode})
            if(vipResultdata.code == 200) {
                vipResultdata.data.memberCardVO.withCash = vipResultdata.data.withCash
                this.SET_VIP_INFO(vipResultdata.data.memberCardVO)
            }else {
                this.$message({
                            message: vipResultdata.msg || '查询会员信息失败',
                            type: 'warning'
                            });
            }
        },

        //支付宝微信查询支付结果
        async queryAliWeiPayResults(uid) {
          if(!this.loading) {
              clearInterval(queryInterval);
              return
          } 
          this.loading = true
          this.loadingContents = '支付中...'
          this.cancelBtn = true
          let queryInterval = null
          let currentDate = new Date().getTime() - this.startWaitingTime
          if(currentDate / 1000 > 90) {
              this.startWaitingTime = 0;
              clearInterval(queryInterval);
              return this.wrongTip({msg: "支付超时"})
          }
          let payResults = await queryAliWeiPayResult({
              saleBillPayUid: uid,
              cinemaUid: this.cinemaUid,
              queryType: this.payMethod.currentPayMethodId
          })

        //   console.log(payResults)

          if(payResults.code == 200 && payResults.data.status == 1) {
              this.cancelBtn = false
              clearInterval(queryInterval)
              this.isSettle()
                
          }else if(payResults.code == 200 && payResults.data.status == 0) {
              clearInterval(queryInterval)
              queryInterval = setTimeout(() => {
                  this.queryAliWeiPayResults(uid)
              }, 1500)
          }else {
              this.loading = false
              this.cancelBtn = false
              clearInterval(queryInterval)
              return this.wrongTip({msg: "支付失败，请重新支付"})
          }
        },

        async closePay(isRefresh) {
            let jhPayState = false;
            for(let i = 0; i < this.payedList.length; i++){
                if(this.payedList[i].payTypeCode == 'JHPAY'){
                    jhPayState = true;
                    break
                }
            }
            if(!jhPayState) return this.releaseSeat()
            const data = await getJhPayParam({
                cinameUid : this.cinemaUid,
                saleBillCode:this.billCode,
            })
            if(data.data){
                const applicationType = data.data.silverOrderNumber ? '02' : '00'
                this.ws = new jhPay({
                    open:(res) => {
                        this.ws.send({
                            applicationType:applicationType, //消费类型  循序1
                            transactionType:'01',//交易类型标志 循序4
                            payAmount:data.data.payAmount+'',//JH支付金额转换 循序5
                            voucherNO:data.data.oldVoucherNO,
                            bankBillCode:data.data.silverOrderNumber,
                        })
                    },
                    message:(res) => {
                        if(res.returnCode != "00") return this.$message.error(res.misrepresentation)
                        this.releaseSeat()
                        console.log(res)
                    },
                    close:this.close,
                    error:(res) => {
                    }
                })
            }else{
                this.releaseSeat()
            }
           
            // console.log(data)
            
        },
        async releaseSeat(){
            await this.cancelAll()
            await releaseSeat({
                    channelCode: this.channelCode,
                    cinemaCode: this.cinemaCode,
                    saleBillCode: this.billCode,
                    timeSeatList: this.seatSelection
                    }).then(res => {
                    if(res.code == 200) {
                        this.GET_CART_DATA({goodsList: []})
                        this.CLEAR_SELECTION()
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
           this[SET_WITH_COUPON](1)
        },
        showMorePayMethods() {
            this.MORE_PAY_TRIGER()
        },

        selecDialogItem(val) {
           this.currentPayIndex = val
        },

        //撤销退款
        refundIt(item) {
            refundIt({payUid: item.uid, billCode: this.billCode}).then(res => {
                if(res.code == 200) {
                       this.$message({
                                showClose: true,
                                message: "撤销成功",
                                type: 'success'
                            });
                            this.CART_FIND_CART_DATA()
                    
                }else {
                    this.wrongTip(res)
                }
            })
        },

        //会员退款
        refundVip(item) {
            refundVip({
                cinemaUid: this.cinemaUid,
                terminalCode: this.terminalId,
                saleBillUid: this.saleBillUid,
                saleBillCode: this.saleBillCode,
                refundReason: "不想要了",
                refundTotalAmount: item.amount,
                memberNumber: this.memberNumber,
                workTimeUid: this.userUid,
                outRefundNo: "djfojw4jrl34o",
                items: []
            })
        }
    },

    components: {
        payWXPAYComp,
        payALIPAYComp,
        payXUNPComp,
        pay0X03Comp,
        payXRMBComp,
        payJHPAYComp,
        payUNIONPAYComp,
        ScoreComp,
        HoldComp,
        MorePay,
        CheckCoupon,
        GoodsDetil,
        CouponResults,
        CouponList,
        GCouponResults,
        Consumegc,
        thirdpartyComp
    }
}
</script>

<style lang="scss" scoped>
 .outter-wrapper {
     width: 100vw;
     height: 100vh;
     background-color: #3333333a;
     position: fixed;
     bottom: 0;
     left: 0;
     z-index: 800;
     transition: all 0.3s ease-in-out;

     .cancel-btn {
        position: absolute; 
        left: 47%; 
        top: 60%; 
        transform: translate(-50% 50%); 
        z-index: 5000;
     }

 }
  .settlement-container {
      width: 100vw;
      height: 100vh;
      position: absolute;
      bottom: 0;
      left: 0;
      background: $background-color-page-theme;
      overflow: hidden;

      .settlement-header {
          box-sizing: border-box;
          width: 100%;
          height: 6.3vh;
          background: $background-color-theme;
          color: $font-color-white;
          line-height: 6.3vh;
          padding: 0 20px;
          position: relative;

          .iconguanbi {
              position: absolute;
              right: 22px;
              top: 50%;
              transform: translateY(-50%);
              color: $font-color-white;
              font-size: $font-size14;
              padding: 8px;
              cursor: pointer;
          }
      }

      .settlement-contents {
          box-sizing: border-box;
          width: 100%;
          height: calc(100% - 6.3vh);
          background: $background-color-page-theme;
          padding: 2vw;
          display:flex;
          justify-content: space-between;
          align-items: flex-start;

          .header-name {
              font-size: $font-size14;
              color: $font-color3;
              font-weight: bold;
              width: 100%;
              height: 4.5vh;
              display: flex;
              align-items: center;
              justify-content: space-between;

              .header-name-span {
                 font-size: $font-size14;
                 color: $font-color3;
                 font-weight: bold;

                 .current-paymethod {
                    font-size: $font-size12;
                    color: $blue-color;
                    margin-left: 20px;
                }
              }

              .change-paymethods-button {
                  padding: 0;
                  width: 8.6vw;
                  height: 3.4vh;
                  background: $blue-color;
                  color: $white-color;
                  font-size: $font-size12;
                  float: right;
              }
          }
            .settle-left {
                width: 36vw;
                height: 100%;
                display: flex;
                flex-direction: column;
                .detial{
                    flex: 1;
                    overflow:auto;
                }
            }

          .settle-right {
              width: 58vw;
              height: 300px;

              .pay-result {
                    width: 100%;
                    background: #EBEBEB;
                    padding: 10px 0;
                    margin-top: -13vh;
                    font-size: $font-size12 !important;
                    color: $font-color3 !important;

                    .pay-price {
                        color: $font-color-orange !important;
                    }
                }

              .discount-activity {
                  width: 100%;
                  height: 15.9vh;
                  background: #ffffff;
                  display: flex;
                  flex-wrap: wrap;
                  justify-content: flex-start;
                  align-items: flex-start;
                  position: relative;

                  .active-default {
                     font-size: $font-size12;
                     color: $font-color6;
                     position: absolute;
                     left: 50%;
                     top: 50%;
                     transform: translate(-50%, -50%);
                  }

                  .active-item {
                      width: 15.8vw;
                      height: 6vh;
                      box-sizing: border-box;
                      border: 1px solid #A7B8E4;
                      border-radius: 2px;
                      margin-left: 2%;
                      margin-top: 1%;
                      display: flex;
                      padding: 8px;
                      justify-content: space-between;
                      align-items: center;
                      position:relative;

                      .info-extend {
                          width: 100%;
                          height: 14.5vh;
                          box-sizing: border-box;
                          padding: 12px;
                          color: #333;
                          font-size: $font-size12;
                          background: #E8EEFF;
                          position: absolute;
                          top: 6vh;
                          left: 0;
                          z-index: 100;
                      }

                      .item-name {
                        flex: 0 0 80%;
                        width: 80%;
                        font-size: $font-size12;
                      }

                      .item-extend-btn {
                          flex: 0 0 2.0vw;
                          width: 2.0vw;
                          height: 2.0vw;
                          display: flex;
                          justify-content: center;
                          align-items: center;

                          .arrow-circle {
                              font-size: $font-size16;
                              color: $font-color-blue;
                          }
                      }
                  }

                  .actived-item {
                      background: #3B74FF;
                      border: none;
                      color: #ffffff;

                      .arrow-circle {
                              font-size: $font-size16;
                              color: #ffffff !important;
                          }
                  }

                  .no-sel {
                      background: #f5f5f5;
                      border: none;
                      color: #666666;
                      border: 1px solid #bcbcbc;

                      .arrow-circle {
                              font-size: $font-size16;
                              color: #bcbcbc !important;
                          }
                  }

                  .arrow-btn {
                      width: 3.9vw;
                      height: 3.4vh;
                      position: absolute;
                      display: flex;
                      justify-content: center;
                      align-items: center;

                      .iconfont {
                          color: $themeColor;
                          font-size: 2.6vw;
                      }

                      .no-iconfont {
                          color: #bcbcbc;
                          font-size: 2.6vw;
                      }
                  }

                  .pre-btn {
                      top: 8%;
                      right: 1%;
                  }

                  .next-btn {
                      bottom: 8%;
                      right: 1%;
                  }
              }

              .pay-container {
                  width: 100%;
                  height: 60.5vh;
                  background: #ffffff;
                  box-sizing: border-box;
                  padding: 12px;

                  .pay-methods {
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;

                    .default-pay {
                        width: 10.4vw;
                        height: 5.2vh;
                        box-sizing: border-box;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border: 1px solid #A7B8E4;
                        border-radius: 2px;
                        margin-right: 1vw;

                        &:hover {
                            background: $btn-background-color-theme;
                            color: $font-color-white;
                            cursor: pointer;
                        }
                    }

                    .active {
                        background: $btn-background-color-theme;
                        color: $font-color-white;
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

            .payed-lists-container {
                width: 100%;
                height: 9vh;
                overflow: scroll;
                display: flex;
                justify-content: space-between;

                .payed-list-left {
                    flex: 1;
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;

                    .payed-item {
                        box-sizing: border-box;
                        height: 3.4vh;
                        flex: 0 0 50%;
                        display: flex;
                        justify-content: flex-start;
                        align-items: center;
                        color: #333;
                        font-size: $font-size12;
                        padding: 0 10px;

                        .payed-name {
                            flex: 0 0 32%;
                            width: 32%;
                        }

                        .payed-detail {
                            flex: 0 0 48%;
                        }
                    }
                }

                .payed-list-right {
                    flex: 0 0 4vw;
                }
            }
          }
      }

      .coupon-common-style {
          padding: 0;
          height: 4.2vh;
          font-size: $font-size12;
      }

      .coupon-add {
          background: $blue-color !important;
          color: #ffffff !important;
      }
  }
</style>

