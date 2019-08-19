<template>
    <div class='login-bg'>
        <div class="loginLogo">
            <!--<img src="../../assets/images/loginLogo.png"/>-->
        </div>
        <div class="zixun">
            <img src="../../assets/images/zixun.png"/>
            <span>咨询热线：400-8881-503</span>
            <img src="../../assets/images/shouhou.png"/>
            <span>售后热线：400-8108-896</span>
        </div>
        <div class="code" v-show="!flag">
            <img src="../../assets/images/qr_code.png" />
            <span>APP下载</span>
        </div>
        <div class="scan" v-show="flag">
            <img src="../../assets/images/scan.png" />
            <span>扫一扫 下载智慧影院APP</span>
        </div>
        <div class="div" ref="box">
            <canvas class='canvas' ref="cava"></canvas>
        </div>
        <section class="mian-posotion">
            <div class="loginFromArea">
                <el-tabs v-model="activeName2" @tab-click="handleClick">
                    <!-- 密码登陆 -->
                    <el-tab-pane label="密码登录" name="first" class='psw_login'>
                        <ul @keyup.13="userLoginCheck">
                            <li>
                                <div class="bottom">
                                    <img src="../../assets/images/xulie.png"/>
                                    <el-input maxlength="16" v-model="customerCode" placeholder="请输入客户编码" clearable></el-input>
                                </div>
                            </li>
                            <li>
                                <div class="bottom">
                                    <img src="../../assets/images/user.png"/>
                                    <el-input v-model="loginName" placeholder="请输入用户名" clearable></el-input>
                                </div>
                            </li>
                            <li>
                                <div class="bottom">
                                    <img src="../../assets/images/password.png"/>
                                    <el-input clearable v-model="password" type="password" placeholder="请输入密码"></el-input>
                                </div>
                            </li>
                            <li style="margin-bottom:2px;" v-if="sliderFlag">
                                <nocaptcha @sliderData="sliderData"></nocaptcha><!---->
                            </li>
                            <!--<li class="error_tips" >
                                <div class="error" v-show="flag">
                                    <img src="../../assets/images/tanhao.png"/>
                                    <p class="tips" v-show="tipsNum == 1">请输入用户名</p>
                                    <p class="tips" v-show="tipsNum == 2">请输入密码</p>
                                    <p class="tips" v-show="tipsNum == 3">用户名或密码错误</p>
                                    <p class="tips" v-show="tipsNum == 4">请执行滑块校验</p>
                                    <p class="tips" v-show="tipsNum == 5">网络开小差了</p>
                                    <p class="tips"
                                          v-show="tipsNum == 5001 || tipsNum == 5002 || tipsNum == 5003 || tipsNum == 5004  || tipsNum == 5005 || tipsNum == 5006 || tipsNum == 5007  || tipsNum == 5008|| tipsNum == -200">
                                        {{this.backendError}}
                                    </p>
                                </div>
                            </li>-->
                            <!-- <li class="remmemberli">
                                 <span class="remenberPwd"> <el-checkbox v-model="checked">记住密码</el-checkbox></span><a
                                 class="forgetPwd" @click="forgetPassword">忘记密码</a>
                             </li>-->
                            <!--<li class="error_tips" >-->
                            <!--<div class="error">-->
                            <!--<img src="../../assets/images/tanhao.png"/>-->
                            <!--<p class="tips">{{tipMessage}}</p>-->
                            <!--</div>-->
                            <!--</li>-->
                            <li class="loginli">
                                <a class="btn loginBtn" @click="userLoginCheck">登录</a>
                            </li>
                        </ul>
                    </el-tab-pane>
                    <!-- 手机快捷登陆 -->
                    <el-tab-pane label="验证码登录" name="second" class='psw_login'>
                        <ul @keyup.13="userMobileLoginClick">
                            <!-- <li class="message" v-show="inputInforAndSureClick">手机号或验证码错误</li> -->
                            <li>
                                <div class="bottom">
                                    <img src="../../assets/images/xulie.png"/>
                                    <el-input maxlength="16" v-model="consumerCode" placeholder="请输入客户编码" clearable></el-input>
                                </div>
                            </li>
                            <li>
                                <div class="bottom">
                                    <img src="../../assets/images/mobile.png"/>
                                    <el-input v-model="mobile" placeholder="请输入手机号"  clearable></el-input>
                                </div>
                            </li>
                            <li style="margin-bottom:14px;">
                                <nocaptcha @sliderData="sliderData"></nocaptcha><!---->
                            </li>
                            <li>
                                <div class="bottom">
                                    <img src="../../assets/images/password.png"/>
                                    <el-input v-model="verifyCode" placeholder="请输入动态码" class="fill-verify"></el-input>
                                    <template v-if="tickCount < 1">
                                        <a class='verify' @click="getSmsCodeHandle" style="background: #3b74ff">
                                            <span class="verifyBackground">发送验证码</span>
                                        </a>
                                    </template>
                                    <template v-else>
                                        <a class='verify' style="color:#000;">
                                            <span class="verifyBackground" style="color:#000;"> {{tickCount}}s</span>
                                        </a>
                                    </template>
                                </div>
                            </li>
                            <li class="loginli">
                                <a class="btn loginBtn" @click="userMobileLoginClick">登录</a>
                            </li>

                        </ul>
                        <!--<p class="tel message">服务电话：400 1234 1234</p>-->
                    </el-tab-pane>
                </el-tabs>
            </div>
        </section>
        <!--<el-dialog width=50% :visible="resetPwdDialogVisible" :show-close='false' :close-on-click-modal='false'
                   :before-close="handlerClose">
            <component :is="currentComponent" @closeDialog="dialogCloseHandler" :account="account"
                       :password="password"></component>
        </el-dialog>-->
        <div class="word_bottom">版权所有：数码辰星科技发展（北京）有限公司&nbsp京ICP备&nbsp12015164号-6</div>
    </div>
</template>
<script type="text/javascript">
  import CryptoJS from 'crypto-js'
  import noCaptcha from './no-captcha'
  import {getWeekData} from "../../util/dateListOfWeeks";
  import {checkMobile} from "../../util/inputDataCheck";
  import resetPassword from "./common/resetPwd";
  import forgetPassword from "./common/ForgotPwd";
  import {getUrl,getDictList,sendCode,mobileLogin,menuList} from 'frame_cpm/http/interface.js'
  export default {
    data() {
      return {
        key:'',
        resetPwdDialogVisible: false,
        currentComponent: "",
        activeName2: "first",
        checked: false,
        customerCode:'',
        loginName: "",
        password: "",
        consumerCode:'',
        mobile: '',
        imgCodeInfor: null,
        smsCodeInfor: null,
        verifyCode: '',
        loginImgCode: "",
        loginSmsCode: "",
        inputInforAndSureClick: false,
        inputInforOfError: "",
        tickCount: 0,
        varTimeout: null,
        flag: false,
        tipMessage: '',
        sliderFlag: false,
        slider: null,
        // phoneFlag: false,
        // sliderId:''

      };
    },
    created() {
    },
    mounted() {
      var canvas = this.$refs.cava;
      canvas.width = this.$refs.box.offsetWidth;
      canvas.height = this.$refs.box.offsetHeight;
      var ctx = canvas.getContext('2d');
      var nico = [];
      var maki = "";
      var AKUYA1 = canvas.height / 2;
      var AKUYA2 = 0.1;
      var AKUYA3 = 0;
      window.onload = function(){
        setInterval(excuseme, 1000 / 30);
        // requestAnimationFrame(animate)
      };
      function excuseme() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var naive = new Naive(Math.random() * canvas.width, canvas.height, Math.random() * 0.5, Math.random() * 5, AKUYA2, AKUYA3, Math.random()*4);
        nico.push(naive);
        for (var i = 0; i < nico.length; i++) {
          maki = nico[i];
          maki.zhenji(ctx);
          maki.amr();
        }

        if (nico.length > AKUYA1) {
          nico.shift();
        }
      }
      function Naive(x, y, rgba, pi, h, hm, p) {
        this.x = x;
        this.y = y;
        this.p = p;
        this.rgba = rgba;
        this.pi = pi;
        this.h = h;
        this.hm = hm;
        this.zhenji = function(ctx){
          ctx.fillStyle = "rgba(255, 127, 90," + this.rgba + ")";
          ctx.beginPath();
          ctx.arc(this.x + this.h, this.y, this.pi, 0, Math.PI * 2, true);
          ctx.fill();
          this.rgba -= 0.5 / AKUYA1;
          if ((this.hm+10)%10==0) {
            if (this.h == 0.1) { this.h = -0.1; } else { this.h = 0.1; }
          }
          this.hm++;
        }
        this.amr = function () {
          this.y -= this.p;
        }
      }
    },
    beforeDestroy() {
      clearTimeout(this.varTimeout)
      this.$eventHub.$off('sliderInit')
    },
    components: {
      resetpwd: resetPassword,
      forgetPassword: forgetPassword,
      nocaptcha: noCaptcha
    },
    methods: {
      getUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
        })
      },
      getSmsCodeHandle() {
        if (!checkMobile(this.mobile)) {
          this.error("请输入正确的手机号");
          return false;
        }
        if (this.consumerCode == "") {
          this.error("请输入客户编码");
          return false;
        }
        if(this.slider==null){
          this.error('请执行滑块校验')
          return false
        }
        let _this = this;
        sendCode({
          mobile: _this.mobile,
          consumerCode: _this.consumerCode,
          sessionId: _this.slider.sessionId,
          sig: _this.slider.sig,
          token: _this.slider.token,
          scene: "nc_register"
        })
          .then(ret => {
            if(ret&&ret.code==200){
              _this.success("验证码发送成功");
              _this.tickCount = 60;
              _this.varTimeout = setTimeout(() => {
                _this.tickFunction();
              }, 1000);
              return false;
            }else{
              this.$eventHub.$emit('sliderInit',true)
              this.error(ret.msg)
            }
          })
          .catch(() => {
          });
      },
      tickFunction() {
        if (this.tickCount < 1) {
          clearTimeout(this.varTimeout);
        } else {
          this.tickCount--;
          this.varTimeout = setTimeout(() => {
            this.tickFunction();
          }, 1000);
        }
      },
      userMobileLoginClick() {
        if (this.consumerCode=='') {
          this.error("请输入客户编码");
          return false;
        }
        if (!checkMobile(this.mobile)) {
          this.error("请输入正确的登录手机号");
          return false;
        }
        /*if(this.slider==null){
          this.error('请执行滑块校验')
          return false
        }*/
        if (this.verifyCode == "") {
          this.error("请输入短信验证码");
          return false;
        }
        let _this = this
        let data = {
          consumerCode: _this.consumerCode,
          mobile: _this.mobile,
          verifyCode: _this.verifyCode
        };
        mobileLogin(data)
          .then(ret => {
            if(ret&&ret.code==200){
              this.$router.push('home')
              getDictList().then(ret=>{
                if(ret.code==200) {
                  localStorage.setItem('dicts', JSON.stringify(ret.data))
                }
              }).catch(error=>{
              })
              sessionStorage.setItem("token", ret.data.token);
              localStorage.setItem("user", JSON.stringify(ret.data))
              _this.$store.commit('updateLoginUserCPM',ret.data)
              _this.$store.commit('updateLoginTokenCPM',ret.data.token)
            }else{
              this.error(ret.msg)
              this.$eventHub.$emit('sliderInit',true)
            }
          })
          .catch(() => {
            this.$eventHub.$emit('sliderInit',true)
          });
      },
      sliderData(val){
        if(val){
          this.slider = val
        }
      },
      userLoginCheck() {
        if (this.customerCode == "") {
          this.error("请输入客户编码");
          return false;
        }
        if (this.loginName == "") {
          this.error("请输入用户名");
          return false;
        }
        if (this.password == "") {
          this.error("请输入密码");
          return false;
        }
        if(this.sliderFlag){
          if(this.slider==null){
            this.error('请执行滑块校验')
            return false
          }
        }
        let UUID = this.getUUID()
        let UUIDConcatString = this.loginName + UUID
        let signkey = UUIDConcatString.substr(0,16)
        this.key = CryptoJS.enc.Utf8.parse(signkey);
        this.$store.commit('updateUserKey', UUID.substr(0,16));
        var password = CryptoJS.enc.Utf8.parse(this.password);
        var encrypted = CryptoJS.AES.encrypt(password, this.key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
        var encryptedPwd = encrypted.toString();
        let _this = this
        if(this.slider){
          this.$eventHub.$emit('sliderInit',true)
          var paramMap = {
            customerCode: _this.customerCode,
            loginName: _this.loginName,
            password: encryptedPwd,
            showSlider: true,
            sessionId: _this.slider.sessionId,
            sig: _this.slider.sig,
            token: _this.slider.token,
            scene: "nc_register"
          }
        }else {
          var paramMap = {
            customerCode: _this.customerCode,
            loginName: _this.loginName,
            password: encryptedPwd,
            showSlider:true,
          }
        }
        _this.$cpmList.LoginApi(paramMap)
          .then(ret => {
            if(ret&&ret.code==200){
              getDictList().then(ret=>{
                if(ret.code==200) {
                  localStorage.setItem('dicts', JSON.stringify(ret.data))
                }
              }).catch(error=>{
              })
              _this.$store.commit('updateLoginUserCPM',ret.data)
              sessionStorage.setItem("token", ret.data.token);
              localStorage.setItem("user", JSON.stringify(ret.data))
              _this.$store.commit('updateLoginUserCPM',ret.data)
              _this.$store.commit('updateLoginTokenCPM',ret.data.token)
              this.$store.commit('removeAllCache')
              if (_this.password == "123456") {
                _this.$confirm('您的密码为初始密码，存在较大安全隐患请尽快修改您的密码！', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '暂不修改',
                  type: 'warning'
                }).then(() => {
                  localStorage.setItem('changeCode','a')
                  this.$router.push('home')
                }).catch(() => {
                  this.$router.push('home')
                });
              } else {
                if (_this.checked) {
                  localStorage.setItem(
                    "userLocation",
                    JSON.stringify({
                      customerCode: _this. customerCode,
                      loginName: _this.loginName,
                      password: _this.password
                    })
                  );
                } else {
                  localStorage.removeItem("userLocation");
                }
                this.$router.push('home')
              }
            }else if(ret.code==-120){
              _this.error(ret.msg)
              _this.sliderData()
              this.sliderFlag = true
            }else{
              _this.error(ret.msg)
            }
          })
          .catch(() => {

          });
      },
      handleClick(tab, event) {
        this.activeName2 == tab.name;
        this.slider = null
        this.$eventHub.$emit('sliderInit',true)
      },
      dialogCloseHandler() {
        this.resetPwdDialogVisible = false;
      },
      forgetPassword() {
        this.currentComponent = "forgetPassword";
        this.resetPwdDialogVisible = true;
      }
    }
  };
</script>
<style lang="scss">
    div.loginFromArea {
        position:relative;
        width: 340px;
        height: 360px;
        text-align: center;
        /*border: 1px solid #cccccc;*/
        border-radius: 4px;
        background-color: #ffffff;
        .el-tabs__item {
            font-weight: bold;
        }
    }

    .login-bg {
        min-width: 800px;
        min-height: 500px;
        width: 100%;
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        z-index: 2;
        background: url('../../assets/images/login-bg.png') center left no-repeat #111d75;
        background-size: 60%;
        @media (max-width: 768px) {
            width: 768px;
        }
        .loginLogo {
            width: 80px;
            height: 38px;
            background: url('../../assets/images/loginLogo.png') no-repeat;
            background-size: cover;
            position: absolute;
            top: 36px;
            left: 12%;
        }
        .zixun{
            display: flex;
            justify-content: center;
            height: 20px;
            line-height: 20px;
            position: absolute;
            top: 4.2%;
            right: 14.4%;
            img{
                width: 14px;
                height: 14px;
                margin:3px 10px 0 50px;
            }
            span{
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #fff;
            }
        }
        .div{
            position: absolute;
            left: 21%;
            top: 16%;
            width: 10%;
            height: 30%;
            border-radius: 50%;
            overflow: hidden;
        }
        .word_bottom{
            /*width: 100%;*/
            opacity: 0.4;
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #FFFFFF;
            /*text-align: ;*/
            height:17px;
            position: absolute;
            bottom: 4.4%;
            right: 37.2%;
        }
        .code{
            width: 70px;
            height: 88px;
            /*opacity: 0.1;*/
            background: rgba(255,255,255,0.1);
            position: absolute;
            right: 0;
            top: 71%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            img{
                width: 42px;
                height: 42px;
                margin-top: 10px;
            }
            span{
                font-size: 12px;
                color: #5989FF;
                height: 17px;
                line-height: 17px;
            }
        }
        .scan {
            width: 156px;
            height: 168px;
            background: #FFF;
            border-radius: 4px 0px 0px 4px;
            position: absolute;
            right: 0;
            top: 58%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            img{
                width: 120px;
                height: 120px;
                margin-top: 10px;
            }
            span{
                font-size: 12px;
                color: #666;
                height: 17px;
                line-height: 17px;
            }
        }
        // mmodal
        .el-dialog {
            border-radius: 5px;
            overflow: hidden;
            .el-dialog__header {
                padding: 0;
            }
            .el-dialog__body {
                padding: 0;
            }
        }
        .mian-posotion {
            width: 340px;
            height: 360px;
            position: fixed;
            top: 34%;
            right: 14.4%;
            .title {
                width: 372px;
                color: #ff9f37;
                margin-bottom: 50px;
                div {
                    display: inline-block;
                    width: 60px;
                    i {
                        font-size: 38px;
                    }
                }
                span {
                    font-size: 38px;
                    font-weight: bold;
                }

            }

        }
        .el-tabs__item {
            height: 20px;
            font-size: 14px;
            line-height: 20px;
            background-color: #fff;
            text-align: left;
        }
        /*.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
            text-align: left;
        }
        .el-tabs--top .el-tabs__item.is-top:last-child {
            !*text-align: right;*!
        }*/
        .psw_login {
            input {
                color: #808080;
                font-size: 16px;
                outline: none;
                -web-kit-appearance: none;
                border: 0;
                border-bottom: 1px solid #ccc;
                border-radius: 0;
            }
            input::-webkit-input-placeholder {
                color: #cccccc;
                font-size: 16px;
            }
            .el-input__icon {
                padding: 0 10px;
                /*border-right: 1px solid #ddd;*/
            }
            ul {
                width: 280px;
                margin: 11px auto 0px;
                .message {
                    text-align: left;
                    color: #ff3c00;
                    font-size: 16px;
                }
                li {
                    margin-bottom: 16px;
                    overflow: hidden;
                    width: 100%;
                    &.error_tips{
                        height:18px;
                        line-height: 18px;
                    }
                    .bottom {
                        display: flex;
                        width: 100%;
                        border-bottom: 1px solid #999;
                    }
                    .error {
                        display: flex;
                        width: 100%;
                        img{
                            width: 12px;
                            height: 12px;
                            margin-right: 12px;
                        }
                        .tips {
                            font-size: 12px;
                            color: #FF0200;

                        }
                    }
                    img {
                        height:15px;
                        margin: auto 0;
                    }
                    input {
                        /*caret-color: #fff;*/
                        font-size: 14px;
                        outline: none;
                        -web-kit-appearance: none;
                        border: 0;
                    }
                    input::-webkit-input-placeholder {
                        font-family: PingFangSC-Regular;
                        font-size: 12px;
                        color: #999999;
                    }
                    .el-input__inner:focus {
                        border-color: #3B74FF;;
                        outline: none;
                        -web-kit-appearance: none;
                        border: 0;
                    }

                    a.btn {
                        display: block;
                        height: 48px;
                        text-align: center;
                        line-height: 45px;
                        font-size: 18px;
                        color: #ffffff;
                        border-radius: 5px;
                    }
                    a.loginBtn {
                        background: #3B74FF;
                        font-size:16px;
                        margin-top:20px;
                    }
                    a.forgetPwd {
                        float: right;;
                        color: #808080;
                        font-size: 14px;
                    }
                    span.remenberPwd {
                        float: left;
                        color: #808080;
                        font-size: 16px;
                        .el-checkbox__label {
                            color: #808080;
                        }
                        /*.el-checkbox__inner{*/
                        /*border: 1px solid #ff9f37;*/
                        /*}*/
                        // .el-checkbox__label{
                        //     color:  #808080;
                        //     font-size: 16px;
                        // }
                        // .el-checkbox__inner{
                        //     background-color: #ff9f37;
                        //     border-color: #ff9f37;
                        // }
                    }
                    span.el-input__suffix{
                        top:8px;
                        width: 14px;
                        height: 14px;
                        right: 14px;
                    }
                    .verify {
                        border-radius: 5%;
                        background: #808080;
                        color: #ffffff;
                        float: right;
                        margin-bottom: 1px;
                        width:40%;
                        font-size: 12px;
                        text-align: center;
                        .verifyBackground {
                            height: 32px;
                            line-height: 32px;
                        }
                    }
                }
            }
        }

        // 快捷登陆样式
        .message_login {
            ul {
                width: 310px;
                margin: 11px auto 0px;
                .message {
                    text-align: left;
                    color: #ff3c00;
                    font-size: 16px;
                }
                li {
                    margin-bottom: 16px;
                    overflow: hidden;
                    input {
                        color: #808080;
                        font-size: 16px;
                        outline: none;
                        -web-kit-appearance: none;
                        border: 0;
                        border-bottom: 1px solid #ccc;
                        border-radius: 0;
                    }
                    input::-webkit-input-placeholder {
                        color: #cccccc;
                        font-size: 16px;
                    }

                    .imgCodeInfor{
                        line-height: 46px;
                    }
                    a:hover {
                        text-decoration: none;
                        color: #ff9f37;
                    }
                    .fill-verify {
                        width: 65%;
                    }
                    .el-input__inner:focus {
                        border-color: #ff9f37;
                    }

                    a.btn {
                        display: block;
                        height: 45px;
                        text-align: center;
                        line-height: 45px;
                        font-size: 18px;
                        color: #ffffff;
                        border-radius: 5px;
                    }
                    a.loginBtn {
                        background: blue;
                        /*font-weight: bold;*/

                    }

                }
            }

        }
        .el-step__icon.is-text{
            border-color:#303133;
            color:#303133;
        }
        .el-step__head.is-finish .el-step__icon.is-text , .forgot-pwd .content .el-step__head.is-success .el-step__icon.is-text{
            color: #ffa037;
            border-color: #ffa037;
            font-weight:bold;
        }
        .el-step__title.is-wait{
            color:#303133;
            font-weight:bold;
        }
        .el-tabs__active-bar {
            width: 70px !important;
            height: 3px;
            background-color: #3B74FF;
        }
        .el-tabs__nav-wrap::after {
            z-index: 2;
            opacity: 0.5;
        }
        .el-tabs__nav-scroll {
            margin-top: 30px;
        }
        .el-tabs__nav-next, .el-tabs__nav-prev {
            display: none;
        }
        .el-tabs__nav {
            height: 36px;
        }
        .el-tabs__header {
            width: 280px;
            margin: 0 auto;
        }
        .el-tabs__item {
            width: 100%;
        }
    }

</style>
