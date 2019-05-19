<template>
    <div class='login-bg'>
        <div class="zixun">
            <img src="../../assets/images/zixun.png"/>
            <span>咨询热线：400-8881-503</span>
            <img src="../../assets/images/shouhou.png"/>
            <span>售后热线：400-8118-896</span>
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
                    <el-tab-pane label="用户名登录" name="first" class='psw_login'>
                        <ul @keyup.13="userLoginCheck">
                            <!-- <li class="message">账号或密码错误</li> -->
                            <li>
                                <div class="bottom">
                                    <img src="../../assets/images/xulie.png"/>
                                    <el-input maxlength="16" v-model="customerCode" placeholder="请输入序列号" clearable></el-input>
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
                                    <el-input clearable type="password" v-model="password" placeholder="请输入密码"></el-input>
                                </div>
                            </li>
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
                        <!-- <p class="tel">服务电话：400 1234 1234</p> -->
                    </el-tab-pane>
                    <!-- 手机快捷登陆 -->
                    <el-tab-pane label="手机号登录" name="second" class="message_login">
                        <ul  @keyup.13="userMobileLoginClick">
                            <!-- <li class="message" v-show="inputInforAndSureClick">手机号或验证码错误</li> -->
                            <li>
                                <img src="../../assets/images/mobile.png"/>
                                <el-input v-model="loginMobile" placeholder="请输入手机号"></el-input>
                            </li>
                            <li>
                                <el-input v-model="loginImgCode" placeholder="请输入右侧验证码" class="fill-verify"
                                          style="float:left;"></el-input>
                                <a class='verify imgCodeInfor' v-if="imgCodeInfor">
                                    <img :src="imgCodeInfor.kaptchaImage"
                                         style="height:38px;position:relative;top:-4px;" title="点击切换"
                                         @click="getImgCodeLoad"/>
                                </a>
                            </li>
                            <li>
                                <el-input v-model="loginSmsCode" placeholder="请输入动态码" class="fill-verify"></el-input>
                                <template v-if="tickCount < 1">
                                    <a class='verify ' @click="getSmsCodeHandle">
                                        <span class="verifyBackground">获取动态码</span>
                                    </a>
                                </template>
                                <template v-else>
                                    <a class='verify' style="height:40px;line-height:40px;color:#000;">
                                        {{tickCount}}s
                                    </a>
                                </template>
                            </li>
                            <li>
                                <a class="btn loginBtn" @click="userMobileLoginClick">登录</a>
                            </li>

                        </ul>
                        <!-- <p class="tel message">服务电话：400 1234 1234</p> -->
                    </el-tab-pane>
                </el-tabs>
            </div>
        </section>
        <!--<el-dialog width=50% :visible="resetPwdDialogVisible" :show-close='false' :close-on-click-modal='false'
                   :before-close="handlerClose">
            <component :is="currentComponent" @closeDialog="dialogCloseHandler" :account="account"
                       :password="password"></component>
        </el-dialog>-->
        <div class="word_bottom">版权所有：数码辰星科技发展（北京）有限公司&nbsp京ICP备&nbsp12015164号</div>
    </div>
</template>
<script type="text/javascript">
    import {getWeekData} from "../../util/dateListOfWeeks";
    import {checkMobile} from "../../util/inputDataCheck";
    import resetPassword from "./common/resetPwd";
    import forgetPassword from "./common/ForgotPwd";
    import {getUrl} from 'frame_cpm/http/interface.js'
    export default {
        data() {
            return {
                resetPwdDialogVisible: false,
                currentComponent: "",
                activeName2: "first",
                checked: false,
                customerCode:'',
                loginName: "",
                password: "",
                imgCodeInfor: null,
                smsCodeInfor: null,
                loginMobile: "",
                loginImgCode: "",
                loginSmsCode: "",
                inputInforAndSureClick: false,
                inputInforOfError: "",
                tickCount: 0,
                varTimeout: null,
                flag: false,
                tipMessage: ''

            };
        },
        created() {
            /*this.getImgCodeLoad();
            if (localStorage.getItem("userLocation")) {
                let userInfor = JSON.parse(localStorage.getItem("userLocation"));
                this.bar_code = userInfor.bar_code;
                this.account = userInfor.account;
                this.password = userInfor.password;
                this.checked = true;
            }*/
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
              ctx.fillStyle = "rgba(255, 127, 80," + this.rgba + ")";
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
        components: {
            resetpwd: resetPassword,
            forgetPassword: forgetPassword
        },
        methods: {
            getImgCodeLoad() {
                let _this = this;
                _this.$cpmList
                    .getImgCode()
                    .then(ret => {
                        _this.imgCodeInfor = ret;
                    })
                    .catch(() => {
                    });
            },
            getSmsCodeHandle() {
                if (!checkMobile(this.loginMobile)) {
                    this.error("请输入正确的登录手机号");
                    return false;
                }
                if (this.loginImgCode == "") {
                    this.error("请输入图片验证码");
                    return false;
                }
                if (this.loginImgCode != this.imgCodeInfor.kaptchaText) {
                    this.error("图片验证码输入错误，请重新输入");
                    return false;
                }
                let _this = this;
                _this.$cpmList
                    .getSmsCode({
                        kaptcha: _this.loginImgCode,
                        kaptchaToken: _this.imgCodeInfor.kaptchaToken,
                        phone: _this.loginMobile
                    })
                    .then(ret => {
                        _this.success("短信发送成功");
                        _this.tickCount = 60;
                        _this.varTimeout = setTimeout(() => {
                            _this.tickFunction();
                        }, 1000);
                        return false;
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
                if (!checkMobile(this.loginMobile)) {
                    this.error("请输入正确的登录手机号");
                    return false;
                }
                if (this.loginImgCode == "") {
                    this.error("请输入图片验证码");
                    return false;
                }
                if (this.loginSmsCode == "") {
                    this.error("请输入短信验证码");
                    return false;
                }
                let _this = this,
                    params = {
                        kaptcha: _this.loginImgCode,
                        kaptchaToken: _this.imgCodeInfor.kaptchaToken,
                        phone: _this.loginMobile,
                        smsCode: _this.loginSmsCode
                    };
                _this.$cpmList
                    .loginByPhoneApi(params)
                    .then(ret => {
                        localStorage.setItem("token", ret.token);
                        localStorage.setItem("user", JSON.stringify(ret.user));
                        localStorage.setItem("userMenu", JSON.stringify(ret.userMenuTree));
                        _this.$router.push("/");
                    })
                    .catch(() => {
                    });
            },
            userLoginCheck() {
                if (this.customerCode == "") {
                    this.error("请输入序列号");
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
                let _this = this,
                    paramMap = {
                      customerCode: _this.customerCode,
                      loginName: _this.loginName,
                      password: _this.password
                    };
                _this.$cpmList
                    .LoginApi(paramMap)
                    .then(ret => {
                        if(ret&&ret.result) {
                          localStorage.setItem("token", ret.data.token);
                            localStorage.setItem("user", JSON.stringify(ret.data));
                            _this.$store.commit('updateLoginUser',ret.data)
                            _this.$store.commit('updateLoginToken',ret.data.token)
                            if (_this.password == "123456") {
                                _this.$confirm('您的密码为初始密码，存在较大安全隐患请尽快修改您的密码！', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                  localStorage.setItem('changeCode','a')
                                  getUrl().then(ret=>{
                                    if(ret.code==200) {
                                      localStorage.setItem('defaultPath',ret.data)
                                      this.$router.push(ret.data)
                                    }
                                  }).catch(error=>{
                                  })
                                }).catch(() => {
                                  getUrl().then(ret=>{
                                    if(ret.code==200) {
                                      localStorage.setItem('defaultPath',ret.data)
                                      this.$router.push(ret.data)
                                    }
                                  }).catch(error=>{
                                  })
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
                                getUrl().then(ret=>{
                                    if(ret.code==200) {
                                      localStorage.setItem('defaultPath',ret.data)
                                      this.$router.push(ret.data)
                                    }
                                }).catch(error=>{
                                })
                            }
                        }else if(ret.msg){
                          _this.error(ret.msg)
                        }else{
                          _this.error('服务器内部错误')
                        }
                    })
                    .catch((error) => {
                      _this.error('服务器内部错误');
                    });
            },
            handleClick(tab, event) {
                this.activeName2 == tab.name;
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
<style type="text/css" lang="scss">
    div.loginFromArea {
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
        background: url('../../assets/images/login-bg.png') center left no-repeat #21376B;
        background-size: 60%;
        @media (max-width: 768px) {
            width: 768px;
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
            position: absolute;
            top: 29.3%;
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
            width: 50%;
            height: 20px;
            font-size: 14px;
            line-height: 20px;
            color: #808080;
            background-color: #fff;
        }
        .psw_login {
            .el-input__icon {
                padding: 0 10px;
                border-right: 1px solid #ddd;
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
                        caret-color: #3B74FF;;
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
                        font-weight: bold;

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
                    .verify {
                        color: #ffffff;
                        float: right;
                        display: inline-block;
                        width: 35%;
                        font-size: 16px;
                        text-align: center;
                        .verifyBackground{
                        background: #808080;
                        border-radius:5px;
                        margin-left: 2px;
                        display: inline-block;
                        width: 96%;
                        height: 40px;
                        line-height: 43px;
                    }
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
                        font-weight: bold;

                    }

                }
            }

        }
        .tel {
            font-size: 18px;
            color: #808080;
            text-align: center;
            font-weight: bold;

        }
        .tel.message {
            margin-top: -5px;

        }
        .el-step.is-center .el-step__main{
            // text-align:left;
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
            margin-left: 8%;
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
            width: 100%;
            height: 36px;
        }
        .el-tabs__header {
            width: 280px;
            margin: 0 auto;
        }
        .login-bg .psw_login .el-input__icon {
            border: 0 !important;
        }
    }

</style>
