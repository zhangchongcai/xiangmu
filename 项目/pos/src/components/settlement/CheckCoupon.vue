<template>
    <div v-if="checkCouponBox" class="more-pay-ticket-warp">
        <el-dialog
            :title="popTitle"
            :visible.sync="CheckCoupon"
            :modal-append-to-body='false'
            :append-to-body="false"
            :before-close="closeDialog"
            :close-on-click-modal="false"
            width="28%"
            center>
            <div v-if="popTitle == '查询会员绑定票券'">
              <div class="contents">
                  <span class="input-title">会员卡/手机号：</span>
                  <el-input ref="checkNumInput" class="input-size" v-model="checkNum" placeholder="手工输入或直接读卡"  @keyup.enter.native="openPassWord"></el-input>
                  <!-- <div v-if="memberArr.length" class="member-list">
                    <span class="member-list-item" v-for="(item, index) in memberArr" :key="'member' + index" @click="chooseMemberNo(item.cardNo)">
                        {{item.cardNo}}
                    </span>  
                  </div> -->
              </div>
              
              <div class="contents">
                  <span class="btns" @click="readCard">读卡</span>
                  <span class="btns" @click="openPassWord">启动密码输入</span>
              </div>
            </div>

            <div v-if="popTitle != '查询会员绑定票券'" class="contents-password">
              <el-input
                ref="passwordInput"
                style="width: 23.6vw; margin: 0 auto;"
                placeholder="输入密码"
                type="password"
                v-model="password"
                clearable @keyup.enter.native="openCouponListBox">
                </el-input>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import app from 'src/http/app'
import {getCouponsData, checkoutVip} from 'src/http/apis.js'
import {mapGetters, mapMutations} from 'vuex'
import {CHECK_OUT_COUPON, CHECK_OUT_COUPON_RESULT, SAVE_COUPON_LIST} from 'types'
export default {
    data() {
        return {
            popTitle: "查询会员绑定票券",
            checkNum: '',
            passWordArr: [],
            password: '',
            memberArr: []
        }
    },

    computed:{
      ...mapGetters([
          'checkCouponBox',
          'billCode',
          'billCode',
          'channelCode'
      ]),

      CheckCoupon: {
          get() {
              this.$nextTick(() => {
                        this.$refs.checkNumInput.focus();
                    })
              return this.checkCouponBox
          },

          set(val) {
              this.CHECK_OUT_COUPON()
              this.popTitle = '查询会员绑定票券'
          }
      }
    },

    watch: {
      popTitle() {
          setTimeout(() => {
              this.$refs.passwordInput.focus();
          }, 1000)
      }
    },

    methods: {
        ...mapMutations([
            CHECK_OUT_COUPON,
            CHECK_OUT_COUPON_RESULT,
            SAVE_COUPON_LIST
        ]),

        readCard(){
          app.readCard(this.configData,(data)=>{
              if(typeof data == 'string') this.$message.error(data)
              this.checkNum = data[0];
            // console.log(data)
          })
      },

        wrongTip(res) {
            this.loading = false
            this.$message({
                        showClose: true,
                        message: res.msg,
                        type: 'error'
                    });
        },
        //先判断输入框输入的是手机号还是会员卡号， 手机号调用查询会员卡号的api, 会员卡号直接查询优惠券接口
        // checkoutMember() {
        //   this.memberArr = []
        //   if(this.checkNum.length == 11) {
        //     this.checkoutVip()
        //   }
        // },
        // async checkoutVip() {
        //     let vipdata = await checkoutVip({memberNumber: this.checkNum, code: this.billCode})
        //     if(vipdata.code == 200) {
        //         console.log(vipdata)
        //         this.memberArr = vipdata.data.memberResultVoList
        //     }else {
        //         this.$message({
        //             message: vipdata.msg,
        //             type: 'warning'
        //             });
        //     }
            
        // },
        //选中当前的会员卡号
        // chooseMemberNo(No) {
        //    this.checkNum = No
        //    this.memberArr = []
        // },
        //回车进行查询并关闭当前对话框
        openCouponListBox() {
            this.password = ""
            getCouponsData({
               current: 1,
               size: 1000,
               memberNumber: this.checkNum,
               code: this.billCode,
               channelCode: this.channelCode
           }).then(res => {
              if(res.code == 200) {
                 this.SAVE_COUPON_LIST(res.data)
                 this.CHECK_OUT_COUPON_RESULT()
              }else {
                  this.wrongTip(res)
              }
           })
          this.popTitle = '查询会员绑定票券'
          this.CHECK_OUT_COUPON()
        },

        //监听键盘输入时间
        inputingPassWord(e) {
          let key = e.key
          if(key == 'Backspace') {
              if(this.passWordArr.length) {
                  this.passWordArr.pop()
              }
          }else if(!(isNaN(parseInt(key))) && this.passWordArr.length < 6){
             this.passWordArr.push(key)
          }
        },

        openPassWord() {
            if(this.checkNum) {
                this.popTitle = "启动密码输入"
                this.checkNum = ""
            }else {
                this.$message.error('账号不能为空！！！');
            }
        },

        closeDialog() {
            this.popTitle = "查询会员绑定票券"
            this.CHECK_OUT_COUPON();
        }
    },
    
    
}
</script>
<style lang="scss" scoped>
    .more-pay-ticket-warp{

          .contents {
              width: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              margin-bottom: 40px;
              position: relative;

              .input-title {
                  font-size: $font-size10;
                  color: $font-color6;
              }

              .input-size {
                    width: 18vw;
                    height: 4.2vh;
                    font-size: $font-size13;
                    color: $font-color6;
                }

              .member-list {
                  position: absolute;
                  width: 19.5vw;
                  height: calc(4.2vh * 4);
                  background: #e9eef9;
                  top: 4.9vh;
                  right: 9.2vw;
                  z-index: 100;
                  display: flex;
                  flex-direction: column;
                  justify-content: flex-start;
                  align-items: flex-end;
                  overflow: scroll;

                  .member-list-item {
                    box-sizing: border-box;
                    display: block;
                    padding: 0 10px;
                    width: 100%;
                    height: 4.2vh;
                    flex: 0 0 4.2vh;
                    line-height: 4.2vh;
                    font-size: $font-size12;
                    color: $font-color6;

                    &:hover {
                        background: #e0e8fa;
                        opacity: 0.75;

                    }
                  }
              }

             .btns {
                 display: inline-flex;
                 justify-content: center;
                 align-items: center;
                 padding: 0.8vw 1.6vw;
                 border: 1px solid $btn-background-color-theme;
                 font-size: $font-size12;
                 margin: 0 32px;
                 border-radius: 2px;
                 cursor: pointer;

                 &:first-child {
                     background: $btn-background-color-theme;
                     color: $font-color-white;
                 }

                 &:last-child {
                     color: $font-color-blue;
                 }
             }

          }

          .contents-password {
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                margin-bottom: 40px;

            .password-title {
                  font-size: $font-size13;
                  color: $font-color6;
              }

              .sixBox {
                  width: 100%;
                  display: flex;
                  justify-content: center;
                  margin: 20px auto;

                  .password-box {
                      display: inline-flex;
                      justify-content: center;
                      align-items: center;
                      width: 4.6vw;
                      height: 4.6vw;
                      border: 1px solid #A7B8E4;
                      margin: 0 1.6vw;
                      font-size: $font-size16;
                      color: $font-color3;
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


