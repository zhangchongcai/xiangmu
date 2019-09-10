<template>
    <div>
        <el-dialog
            v-loading="loading"
            :visible.sync="showStatus"
            :close-on-click-modal="false"
            width="30%"
            >
            <span slot="title" style="font-size: 1.22vw">请输入会员卡或手机号</span>
            <div class="input-container">
                
                <span class="input-name">会员卡/手机号</span>
                <el-input ref="autofocusInput" class="input-box" v-model="telNumber" placeholder="在这里输入"  @keyup.enter.native="checkoutVip"></el-input>
                
            </div>
            <span slot="footer" style="justify-content: center;" class="dialog-footer">
                <el-button style="margin-left: 20px;" @click="readCard">读 卡</el-button>
                <el-button type="primary" @click="checkoutVip">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
          v-loading="loading"
          :visible.sync="showListStatus"
          :close-on-click-modal="false"
          width="88vw"
          style="font-size: 1.36vw !important"
        >
         <span slot="title" style="font-size: 1.22vw">选择会员卡</span>
          <div>
              <span class="mobile-num">
                  手机号：{{mobileNum}}
              </span>
          </div>
          <el-table
            :data="vipList"
            ref="multipleTable"
            stripe
            :header-cell-style="{background:'#E5EAFF ',color:'#333'}"
            style="width: 90%; height: 4.9%; margin: 20px auto;"
            :cell-style="abnormalStyleFn"
            @row-click="clickSingleRow"
          >
            <el-table-column
            >
                <template slot-scope="scope">
                    <el-radio :disabled="scope.row.cardStatus != '正常'" class="radio"   v-model="selectedId" :label="scope.row.cardNo">&nbsp;</el-radio>
                </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
            >
            </el-table-column>
            <el-table-column
              prop="cardNo"
              label="卡号"
            >
            </el-table-column>
            <el-table-column
              prop="totalBalance"
              label="余额"
            >
            </el-table-column>
            <el-table-column
              prop="scoreBalance"
              label="积分"
            >
            </el-table-column>
            <el-table-column
              prop="cardType"
              label="卡类"
            >
            </el-table-column>
            <el-table-column
              prop="cardStatus"
              label="卡状态"
            >
            </el-table-column>
          </el-table>
          <div style="display:flex; justify-content:center">
              <el-button style=" width: 7.8vw; height: 4.2vh; background: #3B74FF; padding: 0; font-size: 1.04vw" type="primary" :disabled="buttonName == '查询中...'" @click.native="checkoutVipActivity">{{buttonName}}</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {SET_VIP_CHECKOUT_BOX, SET_VIP_LIST_BOX, SET_ACTIVITY_LIST, PAY_DIALOG_TRIGER, SET_VIP_INFO, CART_FIND_CART_DATA, PAY_METHOD_TRIGER, SAVE_VIP_ISPWD, GET_ACTIVITY_DATA,SET_WITH_COUPON} from 'types'
import {checkoutVip} from 'src/http/apis'
import commonutil from 'util'
export default {
    data() {
        return {
           telNumber: '',
           mobileNum: '',
           selectedId: '',
           buttonName: '确认',
           loading: false,
           vipList: [
               {
                   name: "divad",
                   cardNo: "431634322543165",
                   totalBalance: 45,
                   scoreBalance: 121,
                   cardType: "储值卡",
                   cardStatus: "正常"
               },
               {
                   name: "divad",
                   cardNo: "431634322543165",
                   totalBalance: 45,
                   scoreBalance: 121,
                   cardType: "储值卡",
                   cardStatus: "正常"
               },
               {
                   name: "divad",
                   cardNo: "431634322543165",
                   totalBalance: 45,
                   scoreBalance: 121,
                   cardType: "储值卡",
                   cardStatus: "正常"
               },
               {
                   name: "divad",
                   cardNo: "431634322543165",
                   totalBalance: 45,
                   scoreBalance: 121,
                   cardType: "储值卡",
                   cardStatus: "正常"
               }
           ]
        }
    },

    computed: {
        ...mapGetters([
            'vipInputStatus',
            'vipListStatus',
            'billCode',
            'payDialog',
            'configData',
        ]),

        showStatus: {
            get() {
                // this.autofocusInput()
                return this.vipInputStatus
            },
            set(val) {
                this.SET_VIP_CHECKOUT_BOX(false)
                this.telNumber = ''
            }
        },

        showListStatus: {
            get() {
                return this.vipListStatus
            },

            set(val) {
                this.SET_VIP_LIST_BOX(false)
            }
        }
    },

    watch: {
       vipInputStatus() {
           setTimeout(() => {
               this.autofocusInput()
           }, 1000)
       }
    },

    methods: {
      ...mapMutations([
        SET_VIP_CHECKOUT_BOX,
        SET_VIP_LIST_BOX,
        SET_ACTIVITY_LIST,
        PAY_DIALOG_TRIGER,
        SET_VIP_INFO,
        PAY_METHOD_TRIGER,
        SAVE_VIP_ISPWD,
        SET_WITH_COUPON
      ]),
      ...mapActions([
          CART_FIND_CART_DATA,
          GET_ACTIVITY_DATA
      ]),
      //   自动获取焦点
      autofocusInput() {
         this.$refs.autofocusInput.focus();
      },

      abnormalStyleFn({row, column, rowIndex, columnIndex}) {
        //   console.log(row.cardStatus)
         if(row.cardStatus != '正常') {
             return  'background: #f0f0f0; color: #999999'
         }
      },
      async checkoutVip() {
         if(!this.telNumber) {
            this.$message({
                        message: "未输入手机号或者会员卡号",
                        type: 'warning'
                        });
         }else {
                this.loading = true
                let vipdata = await checkoutVip({memberNumber: this.telNumber, code: this.billCode})
                if(vipdata.code == 200) {
                    this.loading = false
                    if(this.telNumber.length == 11) {
                        this.SET_VIP_CHECKOUT_BOX(false)
                        this.mobileNum = vipdata.data.mobileNum
                        this.vipList = vipdata.data.memberResultVoList
                        this.SET_VIP_LIST_BOX(true)
                    }else {
                        // if(!vipdata.data.memberCardVO.phoneNumber){
                        //     return this.$confirm('该卡没有绑定手机号，请先完善会员资料！', '操作提示', {
                        //     confirmButtonText: '去完善',
                        //     cancelButtonText: '取消',
                        //     type: 'warning'
                        //     }).then(() => {
                        //         this.SET_VIP_CHECKOUT_BOX(false)
                        //         this.$router.push({
                        //         name:'ModifyData',
                        //         query:{
                        //             phoneOrCard:this.telNumber,
                        //             type:'card'
                        //             }
                        //         })
                        //     }).catch(() => {
                                    
                        //     });
                        // }
                        this.SET_VIP_CHECKOUT_BOX(false)
                        this.SET_ACTIVITY_LIST(vipdata.data.marketingResultVoList)
                        this.SAVE_VIP_ISPWD(vipdata.data.freeConsumption)
                        vipdata.data.memberCardVO.withCash = vipdata.data.withCash
                        this.SET_VIP_INFO(vipdata.data.memberCardVO)
                        this.SET_WITH_COUPON(vipdata.data.isWithCoupon)
                        this.PAY_METHOD_TRIGER({
                            payTypeName: '会员卡',
                            payTypeCode: '0X03'
                        })
                        if(!this.payDialog) {this.PAY_DIALOG_TRIGER()}
                        this.buttonName = '确定'
                        this.GET_ACTIVITY_DATA()
                    }
                    
                }else if(vipdata.code == -204) {
                    this.$confirm('当前余额不足，请使用其他支付方式', '操作提示', {
                            confirmButtonText: '关闭',
                            showCancelButton: false,
                            showClose: false,
                            closeOnClickModal: false,
                            type: 'warning'
                            }).then(() => {
                                this.loading = false
                                this.SET_VIP_CHECKOUT_BOX(false)
                            })
                }else if(vipdata.code == -202) {
                    this.$confirm('此会员卡未与手机号绑定，请绑定！', '操作提示', {
                            confirmButtonText: '去完善',
                            showClose: false,
                            closeOnClickModal: false,
                            type: 'warning'
                            }).then(() => {
                                this.loading = false
                                this.SET_VIP_CHECKOUT_BOX(false)
                                this.$router.push({path: `/member/ModifyData`, query: { phoneOrCard: vipdata.data.memberCardVO.cardNo, perform: true}})
                            }).catch(() => {
                                this.loading = false
                                this.SET_VIP_CHECKOUT_BOX(false)
                            })
                }else if(vipdata.code == -203) {
                    this.$confirm('当前余额不足，是否充值？', '操作提示', {
                            confirmButtonText: '去充值',
                            cancelButtonText: '取消',
                            type: 'warning'
                            }).then(() => {
                                this.loading = false
                                this.SET_VIP_CHECKOUT_BOX(false)
                                this.$router.push({path: `/member/memberRecharge`, query: { phoneOrCard: vipdata.data.memberCardVO.cardNo, perform: true}})
                            }).catch(() => {
                                if(vipdata.data.withCash == 1) {
                                    this.loading = false
                                    this.SET_VIP_CHECKOUT_BOX(false)
                                    vipdata.data.memberCardVO.withCash = vipdata.data.withCash
                                    this.SET_VIP_INFO(vipdata.data.memberCardVO)
                                    this.SAVE_VIP_ISPWD(vipdata.data.freeConsumption)
                                    this.SET_WITH_COUPON(vipdata.data.isWithCoupon)
                                    this.PAY_METHOD_TRIGER({
                                        payTypeName: '会员卡',
                                        payTypeCode: '0X03'
                                    })
                                    this.GET_ACTIVITY_DATA()
                                    if(!this.payDialog) {this.PAY_DIALOG_TRIGER()}
                                } else {
                                    this.loading = false
                                    this.SET_VIP_CHECKOUT_BOX(false)
                                }
                            });
                }else if(vipdata.code == -201) {
                    this.$confirm('手机号不存在，是否注册会员？', '操作提示', {
                            confirmButtonText: '会员注册',
                            showClose: false,
                            closeOnClickModal: false,
                            type: 'warning'
                            }).then(() => {
                                this.loading = false
                                this.SET_VIP_CHECKOUT_BOX(false)
                                this.$router.push({path: `/member/memberApplyCard`})
                            }).catch(() => {
                                this.loading = false
                                this.SET_VIP_CHECKOUT_BOX(false)
                            })
                }else if(vipdata.code == -206) {
                    return this.$confirm('此卡不可用，请激活', '操作提示', {
                            confirmButtonText: '激活',
                            showClose: false,
                            closeOnClickModal: false,
                            type: 'warning'
                            }).then(() => {
                                this.loading = false
                                this.SET_VIP_CHECKOUT_BOX(false)
                                this.$router.push({path: `/member/memberApplyCard`,  query: { phoneOrCard: this.telNumber, perform: true}})
                                this.telNumber = ''
                            }).catch(() => {
                                this.telNumber = ''
                                this.loading = false
                                this.SET_VIP_CHECKOUT_BOX(false)
                            })
                }
                else {
                    this.loading = false
                    this.$message({
                        message: vipdata.msg,
                        type: 'warning'
                        });
                }
                this.telNumber = ''
         }
        
      },

      clickSingleRow(row) {
        if(row.cardStatus == '正常')
        this.selectedId = row.cardNo
      },

      async checkoutVipActivity() {
          if(this.selectedId) {
            this.buttonName = "查询中..."
            this.loading = true
            let vipResultdata = await checkoutVip({memberNumber: this.selectedId, code: this.billCode})
            if(vipResultdata.code == 200) {
                this.load = false
                vipResultdata.data.memberCardVO.withCash = vipResultdata.data.withCash
                this.SET_VIP_INFO(vipResultdata.data.memberCardVO)
                this.SAVE_VIP_ISPWD(vipResultdata.data.freeConsumption)
                this.SET_WITH_COUPON(vipResultdata.data.isWithCoupon)
                this.PAY_METHOD_TRIGER({
                    payTypeName: '会员卡',
                    payTypeCode: '0X03'
                })
                this.buttonName = '确定'
                this.SET_VIP_LIST_BOX(false)
                this.GET_ACTIVITY_DATA()
                if(!this.payDialog) {this.PAY_DIALOG_TRIGER()}
            }else if(vipResultdata.code == -203) {
                    return this.$confirm('当前余额不足，是否充值？', '操作提示', {
                            confirmButtonText: '去充值',
                            cancelButtonText: '取消',
                            type: 'warning'
                            }).then(() => {
                                this.buttonName = '确定'
                                this.SET_VIP_LIST_BOX(false)
                                this.$router.push({path: `/member/memberRecharge`, query: { phoneOrCard: this.selectedId, perform: true}})
                            }).catch(() => {
                                if(vipResultdata.data.withCash == 1) {
                                    this.load = false
                                    vipResultdata.data.memberCardVO.withCash = vipResultdata.data.withCash
                                    this.SET_VIP_INFO(vipResultdata.data.memberCardVO)
                                    this.SAVE_VIP_ISPWD(vipResultdata.data.freeConsumption)
                                    this.SET_WITH_COUPON(vipResultdata.data.isWithCoupon)
                                    this.PAY_METHOD_TRIGER({
                                        payTypeName: '会员卡',
                                        payTypeCode: '0X03'
                                    })
                                    this.buttonName = '确定'
                                    this.SET_VIP_LIST_BOX(false)
                                    this.GET_ACTIVITY_DATA()
                                    if(!this.payDialog) {this.PAY_DIALOG_TRIGER()}
                                }else {
                                    this.load = false
                                    this.buttonName = '确定'
                                    this.SET_VIP_LIST_BOX(false)
                                }
                            });
                }else if(vipResultdata.code == -204) {
                    return this.$confirm('当前余额不足，请使用其他支付方式', '操作提示', {
                            confirmButtonText: '关闭',
                            showCancelButton: false,
                            showClose: false,
                            closeOnClickModal: false,
                            type: 'warning'
                            }).then(() => {
                                this.load = false
                                this.buttonName = '确定'
                                this.SET_VIP_LIST_BOX(false)
                            }).catch(() => {
                                
                            });
                }
            else{
                this.load = false
                this.$message({
                    message: vipResultdata.msg || '查询失败',
                    type: 'warning'
                    });
                this.buttonName = '确定'
            }
          }else {
              this.$message({
                    message: '请选择有效会员卡',
                    type: 'warning'
                    });
          }
      },
      readCard(){
            commonutil.readCard(this.configData).then(res =>{
                    // console.log(res)
                    this.telNumber = res.replace(/\,| \，/g,'')
                })
        },
    }
}
</script>

<style lang="scss" scoped>
  .input-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .input-name {
          flex: 0 0 8vw;
          font-size: $font-size12;
          color: $font-color3;
      }
      .input-box {
          flex: 1;
      }
  }
  .dialog-footer {
      display:flex;
      justify-content: flex-end;
  }
  .list-container {
      width: 88vw;
      height: 63vh;
      background: #ffffff;
      border-radius: 4px;
  }
  .mobile-num {
      font-size: $font-size12;
  }
</style>


