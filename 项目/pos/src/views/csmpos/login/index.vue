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
                 <input class="login-input" v-model="info.user_name" type="text" placeholder="请输入用户名称" @focus="showKeyBoard('user_name')" />
             </div>
             <div class="login-input-box">
                 <img class="icon-img" src="/static/imgs/password.png" alt="密码">
                 <input style="margin-top: 0" class="login-input" v-model="info.password" type="password" placeholder="请输入密码" @focus="showKeyBoard('password')" />
             </div>
             <div class="login-input-box" style="display: flex; justify-content: space-between">
                 <input type="submit" class="login-btn" value="登录" />
                 <input type="button" class="login-btn close-btn" value="关闭" @click="closePos" />
             </div>
          </form>

          <key-board v-model="info[modelStr]" :type="modelStr == 'user_name' ? 'text' : 'password'" @confirm="fillContent" ref="keyboard"></key-board>
    </div>
</template>

<script>
import util from 'src/http/app.js'
import {loginPos,getMenuTree} from 'src/http/apis.js'
import {mapMutations} from 'vuex'
import {SAVE_CINEMA_INFO, SAVE_USER_INFO,GLOBAL_SET_NAV_DATAS} from 'types'
import KeyBoard from 'components/keyboard'
export default {
    data() {
        return {
            modelStr: 'user_name',
            brower: false,
            info: {
                user_name: '',
                password: '',
                cinemaLicence: '1e67a45f65e4ba51',
                macCode: 'ABC321'
            },
            menuList:[],
            otherFlag: false,
            otherList: [],
            arr: [],
            
        }
    },

    created() {
      try {
           let code = util.License_Read_REQUEST()
           console.log(code)
      } catch (error) {
          if(error) {
            this.brower = true;
            console.log(error)
          }
      }
    },

    methods: {
        ...mapMutations([
            SAVE_CINEMA_INFO,
            SAVE_USER_INFO,
            GLOBAL_SET_NAV_DATAS,
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
          if(this.info.user_name && this.info.password) {
              loginPos(this.info).then(res => {
                if(res.code == 200) {
                    this.getData()
                    this.SAVE_USER_INFO(res.data)
                    this.SAVE_CINEMA_INFO(res.data)
                    this.$router.push({path: '/home'})
                }else {
                    this.$message({
                                    showClose: true,
                                    message: res.msg,
                                    type: 'error'
                                });
                }
            })
          }else {
              this.$message({
                            showClose: true,
                            message: '请填写正确的用户名和密码',
                            type: 'error'
                        });
          }
          
        },

        closePos() {
            util.quit()
        },
        getData() {
            getMenuTree().then(ret=>{
                if(ret&&ret.code==200){
                this.getArray(ret.data,4)
                if(this.arr.length>=0&&this.arr.length<=8){
                    this.arr.forEach(item=>{
                        this.menuList.push(item)
                    })
                }else{
                    this.arr.forEach((item,index)=>{
                    if(index<7){
                        this.menuList.push(item)
                    }else{
                        this.otherFlag=true
                        this.otherList.push(item)
                    }
                    })
                }
                this[GLOBAL_SET_NAV_DATAS]({
                otherFlag :this.otherFlag,
                otherList : this.otherList,
                menuList : this.menuList,
                })
                }
            })
        },
        getArray(data,menuType) {
            for (var i in data) {
                if (data[i].menuType == menuType) {
                this.arr.push(data[i])
                } else {
                this.getArray(data[i].submenu, menuType);
                }
            }
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
          width: 42.2vw;
      }

      .login {
          position: absolute;
          top: 200px;
          right: 5vw;
          display: flex;
          flex-direction: column;
          width: 31%;
          height: 54%;
          background: #ffffff;
          border-radius: 4px;

          .login-name {
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


