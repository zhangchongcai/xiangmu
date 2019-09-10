<template>
    <div class="login-container" style="background: url(/static/imgs/loginbg.png);">
          <div class="header-info">
              <img style="width: 8.3vw;" src="/static/imgs/logo.png" alt="oristar">

              <span>
                <img style="margin: 0 4px 0 20px" src="/static/imgs/phone.png" alt="热线">
                <span>咨询热线： 400-8881-503</span>

                <img style="margin: 0 4px 0 20px" src="/static/imgs/tel.png" alt="电话">
                <span>售后服务： 400-8180-896</span>
              </span>
          </div>
          <img class="left-img" src="/static/imgs/bgleft.png" alt="oristar">
          <form class="login" @submit.prevent="showData">
             <h1 class="login-name">零售POS终端</h1>
             <h3 class="login-tip">请直接刷卡或输入账号密码登录</h3>
             <div v-if="brower" class="login-input-box">
                 <input class="login-input" v-model="info.macCode" type="text" placeholder="请输入硬件识别码"/>
             </div>
             <div v-if="brower" class="login-input-box">
                 <input class="login-input" v-model="info.cinemaLicence" type="text" placeholder="请输入许可证号"/>
             </div>
             <div class="login-input-box">
                 <img class="icon-img" src="/static/imgs/username.png" alt="用户">
                 <input class="login-input" v-model="info.user_name" type="text" placeholder="请输入用户账号" @focus="showKeyBoard('user_name')" @keyup.enter="toPassWord" />
             </div>
             <div class="login-input-box">
                 <img class="icon-img" src="/static/imgs/password.png" alt="密码">
                 <input ref="passWordInputBox" style="margin-top: 0" class="login-input" v-model="info.password" type="password" placeholder="请输入密码" @focus="showKeyBoard('password')" />
             </div>
             <div class="login-input-box" style="display: flex; justify-content: space-between; margin: 6.9vh auto 3.9vh">
                 <input type="submit" class="login-btn" value="登录" />
                 <input type="button" class="login-btn close-btn" value="关闭" @click="closePos" />
             </div>
          </form>

          <el-dialog
                title="温馨提示"
                :visible.sync="resetPwd"
                width="30%"
                >
                <span style="font-size: 1.2vw;">密码过于简单请重置密码</span>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="close">取 消</el-button>
                    <el-button type="primary" @click="toPassWordPage">确 定</el-button>
                </span>
          </el-dialog>

          <!-- <key-board v-model="info[modelStr]" :type="modelStr == 'user_name' ? 'text' : 'password'" @confirm="fillContent" ref="keyboard"></key-board> -->
    </div>
</template>

<script>
import util from 'src/http/app.js'
import {loginPos,getMenuTree, payType} from 'src/http/apis.js'
import {mapMutations,mapGetters} from 'vuex'
import {SAVE_CINEMA_INFO, SAVE_USER_INFO,GLOBAL_SET_NAV_DATAS, SAVE_ALL_PAY,GLOBAL_SET_FIRST_LOGON} from 'types'
import { VM_LOGIN_SET_MENU,VM_ON_LOGIN_UESINFO } from 'types/vmOnType'
import KeyBoard from 'components/keyboard'
export default {
    data() {
        return {
            modelStr: 'user_name',
            brower: false,
            resetPwd: false,
            info: {
                user_name: '',
                password: '',
                cinemaLicence: 'b0233f558a2191d1',
                macCode: 'ABC321'
            },
            loading:null,
        }
    },

    created() {
      try {
           util.getCinemaInfoParameter(res => {
              let data = JSON.parse(res[1])
              this.info.macCode = data.machine
              this.info.cinemaLicence = data.license
           })
           localStorage
      } catch (error) {
          if(error) {
            this.brower = true;
          }
      }
    },
    computed:{
        ...mapGetters([
            'configData'
        ])
    },

    methods: {
        ...mapMutations([
            SAVE_CINEMA_INFO,
            SAVE_USER_INFO,
            GLOBAL_SET_NAV_DATAS,
            SAVE_ALL_PAY,
            GLOBAL_SET_FIRST_LOGON
        ]),

        showKeyBoard(key){
            this.modelStr = key
            this.$refs.keyboard.show();
        },
        //输入name后回车跳到密码框
        toPassWord() {
          if(!this.info.user_name) {
              this.$message({
                            showClose: true,
                            message: "请输入名称",
                            type: 'error'
                        });
          }else {
             this.$refs.passWordInputBox.focus();
          }
        },

        fillContent(value) {
           if(this.modelStr == 'user_name') {
               this.info.user_name = value
           }else {
               this.info.password = value
           }
        },

        async showData() {
            if(!this.info.user_name && !this.info.password) return this.$message({
                        showClose: true,
                        message: '请填写正确的用户名和密码',
                        type: 'error'
                    });
            this.loading = this.$loading({
                lock: true,
                text: '登录中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            const res = await loginPos(this.info)
            if(this.info.forceLogin) delete this.info.forceLogin;
            if(res.code == 201) {
                return this.$confirm(res.msg, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {
                    this.loading.close()
                    this.info.forceLogin = 1
                    this.showData()
                }).catch(() => {
                    this.loading.close()
                });
            }
            // res.data.userAccount = this.info.user_name;
            if(res.code == 200 && res.data.passworkIsEssay) {
                this.resetPwd = true
                
                this.loginSaveUserInfo(res)
                return
            }
            if(res.code !=200 && res.code !=201) {
                this.loading.close()
                return this.$message({
                                showClose: true,
                                message: res.msg,
                                type: 'error'
                            });
            }
            this.loginSaveUserInfo(res)
            if(['both','movie'].includes(this.configData.counter_type_value)){
                this.$router.push({path: '/home'})
            }else{
                this.$router.push({path: '/home/goods/cellgoods'})
            }
        },
        loginSaveUserInfo(res){
            this.loading.close()
            // this.$eventHub.$emit(VM_ON_LOGIN_UESINFO,res.data.workTimeUid)
            this[GLOBAL_SET_FIRST_LOGON](res.data.workTimeUid)
            this.$vm.$emit(VM_LOGIN_SET_MENU)
            this.SAVE_USER_INFO(res.data)
            this.SAVE_CINEMA_INFO(res.data)
            localStorage.setItem('cinemaLicence',this.info.cinemaLicence)
                payType().then(res=> {
                if(res.code==200) {
                    let {data} = res
                    // console.log("payType ===>", data)
                    this.SAVE_ALL_PAY(data)
                }else {
                    this.$message({
                                showClose: true,
                                message: res.data && res.data.length == 0 ? '暂无支付方式数据' : res.msg,
                                type: 'error'
                            });
                }
            })
        },

        //密码过于简单 跳转到密码重置页面
        toPassWordPage() {
           this.resetPwd = false
           this.$router.push({path: '/page/settings/changePassword'})
        },
        close(){
            this.resetPwd = false;
            if(['both','movie'].includes(this.configData.counter_type_value)){
                this.$router.push({path: '/home'})
            }else{
                this.$router.push({path: '/home/goods/cellgoods'})
            }
        },
        closePos() {
            util.quit()
        },
    },

    components: {
        KeyBoard
    }
}
</script>

<style lang="scss" scoped>
  .login-container {
      width: 100vw;
      height: 100vh;
      box-sizing: border-box;
      padding-top: 1px;
      position: relative;
      overflow: hidden;

      .header-info {
          display: flex;
          width: calc(100% - 20vw);
          margin: 6vh auto;
          align-items: center;
          justify-content: space-between;
          font-size: $font-size12 !important;
          color: $font-color-white !important;
      }

      .left-img {
          position: absolute;
          top: 200px;
          left: 10vw;
          width: 42.2vw;
      }

      .login {
          position: absolute;
          top: 200px;
          right: 10vw;
          display: flex;
          flex-direction: column;
          width: 31%;
          background: #ffffff;
          border-radius: 4px;

          .login-name {
              font-size: $font-size28;
              font-weight: bolder;
              color: $font-color-blue;
              margin-top: 2vw;
              margin-left: 2vw;
          }

          .login-tip {
              font-size: $font-size14;
              color: $font-color9;
              font-weight: 300;
              margin-top: 0.5vw;
              margin-left: 2vw;
          }

          .login-input-box {
              box-sizing: border-box;
              width: 27.5vw;
              height: 40px;
              border-radius: 2px;
              margin: 1.2vh auto;
              position: relative;

              .icon-img {
                  position: absolute;
                  left: 8px;
                  top: 8px;
              }
          }

          .login-input {
              box-sizing: border-box;
              width: 27.5vw;
              height: 40px;
              line-height: 40px;
              padding: 0 40px;
              border-radius: 2px;
              outline: none;
              border: 1px solid $font-color6;

              &:focus {
                  border: 1px solid $font-color-blue;
              }
          }

          .login-btn {
              width: 12.5vw;
              height: 40px;
              line-height: 40px;
              margin: 0 auto;
              outline: none;
              border: none;
              color: $font-color-white;
              background: $font-color-blue; 
              border-radius: 4px;

              &:active {
                  opacity: 0.88;
              }
          }

          .close-btn {
              color: $font-color6;
              background: $font-color-white;
              border: 1px solid #bcbcbc;
          }
      }
  }
</style>


