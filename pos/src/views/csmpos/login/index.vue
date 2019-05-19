<template>
    <div class="login-container" style="background: url(/static/imgs/loginbg.png);">
          <div class="header-info">
              <img style="width: 86px; height: 44px" src="/static/imgs/logo.png" alt="oristar">

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
             <input class="login-input" v-model="info.cinemaLicence" type="text" placeholder="请输入许可证号"/>
             <input class="login-input" v-model="info.user_name" type="text" placeholder="请输入用户名称" @focus="showKeyBoard('user_name')" />
             <input style="margin-top: 0" class="login-input" v-model="info.password" type="password" placeholder="请输入密码" @focus="showKeyBoard('password')" />
             <input type="submit" class="login-btn" value="登录" />
          </form>

          <key-board v-model="info[modelStr]" :type="modelStr == 'user_name' ? 'text' : 'password'" @confirm="fillContent" ref="keyboard"></key-board>
    </div>
</template>

<script>
import {loginPos} from 'src/http/apis.js'
import {mapMutations} from 'vuex'
import {SAVE_CINEMA_INFO, SAVE_USER_INFO} from 'types'
import KeyBoard from 'components/keyboard'
export default {
    data() {
        return {
            modelStr: 'user_name',
            info: {
                user_name: '',
                password: '',
                cinemaLicence: 'b931c317c9303855'
            }
            
        }
    },

    methods: {
        ...mapMutations([
            SAVE_CINEMA_INFO,
            SAVE_USER_INFO
        ]),

        showKeyBoard(key){
            this.modelStr = key
            this.$refs.keyboard.show();
        },

        fillContent(value) {
           if(this.modelStr == 'user_name') {
               this.info.user_name = value
           }else {
               this.info.password = value
           }
        },

        showData() {
          let formData = new FormData()
          formData.append("user_name", this.info.user_name);
          formData.append("password", this.info.password);
          formData.append("cinemaLicence", this.info.cinemaLicence);
          loginPos(this.info).then(res => {
            //   console.log(res)
              if(res.code == 200) {
                //   this.SAVE_CINEMA_INFO(res.data)
                  this.SAVE_USER_INFO(res.data)
                  this.$router.push({path: '/home'})
              }else {
                this.$message({
                                showClose: true,
                                message: res.msg,
                                type: 'error'
                            });
              }
          })
        }
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
          width: calc(100% - 10vw);
          margin: 6vh auto;
          align-items: center;
          justify-content: space-between;
          font-size: $font-size12 !important;
          color: $font-color-white !important;
      }

      .left-img {
          position: absolute;
          top: 200px;
          left: 5vw;
      }

      .login {
          position: absolute;
          top: 200px;
          right: 5vw;
          display: flex;
          flex-direction: column;
          width: 31%;
          height: 44.5%;
          background: #ffffff;
          border-radius: 4px;

          .login-name {
              font-family: 'MicrosoftYaHei';
              font-size: $font-size22;
              font-weight: bolder;
              color: $font-color-blue;
              margin-top: 2vw;
              margin-left: 2vw;
          }

          .login-tip {
              font-size: $font-size12;
              color: $font-color6;
              margin-top: 0.5vw;
              margin-left: 2vw;
          }

          .login-input {
              box-sizing: border-box;
              width: 27.5vw;
              height: 40px;
              line-height: 40px;
              padding: 0 20px;
              border-radius: 2px;
              margin: 1.2vh auto;
              outline: none;
              border: 1px solid $font-color6;

              &:focus {
                  border: 1px solid $font-color-blue;
              }
          }

          .login-btn {
              width: 27.5vw;
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
      }
  }
</style>


