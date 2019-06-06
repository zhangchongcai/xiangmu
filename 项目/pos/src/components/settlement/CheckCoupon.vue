<template>
    <div class="more-pay-ticket-warp">
        <el-dialog
            :title="popTitle"
            :visible.sync="CheckCoupon"
            :modal-append-to-body='false'
            :append-to-body="false"
            :before-close="closeDialog"
            center>
            <div v-show="popTitle == '查询会员绑定票券'">
              <div class="contents">
                  <span class="input-title">会员卡/手机号：</span>
                  <el-input class="input-size" v-model="num" placeholder="手工输入或直接读卡"></el-input>
              </div>
              <div class="contents">
                  <span class="btns">读卡</span>
                  <span class="btns" @click="openPassWord">启动密码输入</span>
              </div>
            </div>

            <div v-show="popTitle != '查询会员绑定票券'" class="contents-password">
              <span class="password-title">请输入密码......</span>
              <div class="sixBox">
                  <span class="password-box">{{passWordArr[0] ? '*' : ''}}</span>
                  <span class="password-box">{{passWordArr[1] ? '*' : ''}}</span>
                  <span class="password-box">{{passWordArr[2] ? '*' : ''}}</span>
                  <span class="password-box">{{passWordArr[3] ? '*' : ''}}</span>
                  <span class="password-box">{{passWordArr[4] ? '*' : ''}}</span>
                  <span class="password-box">{{passWordArr[5] ? '*' : ''}}</span>
                  <input style="width: 0; height: 0; border: none" maxlength="6" v-if="popTitle != '查询会员绑定票券'" v-focus  @keydown="inputingPassWord"/>
              </div>
            </div>
        </el-dialog>

    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
import {CHECK_OUT_COUPON} from 'types'
export default {
    data() {
        return {
            popTitle: "查询会员绑定票券",
            num: '',
            passWordArr: [],
            password: '',
        }
    },

    computed:{
      ...mapGetters([
          'checkCouponBox',   
      ]),

      CheckCoupon: {
          get() {
              return this.checkCouponBox
          },

          set(val) {
              this.CHECK_OUT_COUPON()
              this.popTitle = '查询会员绑定票券'
          }
      }
    },

     directives: {
        focus: {
            // 当绑定元素插入到 DOM 中。
            inserted: function (el) {
            // 聚焦元素
            el.focus()
        }
        }
    },

    methods: {
        ...mapMutations([
            CHECK_OUT_COUPON
        ]),

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
            if(this.num) {
                this.popTitle = "启动密码输入"
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

              .input-title {
                  font-size: $font-size13;
                  color: $font-color6;
              }

              .input-size {
                    width: 19.5vw;
                    height: 4.2vh;
                    font-size: $font-size13;
                    color: $font-color6;
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


