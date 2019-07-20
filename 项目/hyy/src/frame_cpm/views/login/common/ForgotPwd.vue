<template>
  <div class="forgot-pwd">
    <!-- <el-card class="box-card"> -->
    <div class="modal-title-wrap">
      <span class="modal-title">找回密码</span>
      <span class="modal-close" @click="handleCancel">
        <i class="el-icon-close" style="font-size:25px;"></i>
      </span>
    </div>
    <!-- <div slot="header" class="title">
            <span>找回密码</span>
            <span class="modal-close" @click="handleCancel" style="float:right;">
                <i class="el-icon-close" style="font-size:25px;"></i>
            </span>
         </div> -->
    <div class="content">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="认证用户 "></el-step>
        <el-step title="设置新密码 "></el-step>
        <el-step title="完成 "></el-step>
      </el-steps>
      <div v-if='active == 1'>
        <ul v-loading="loginLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
          <!-- <li class="message">手机号或验证码错误</li> -->
          <li style="padding-top:40px;">
            <el-input v-model="mobile" placeholder="请输入手机号"></el-input>
          </li>
          <li>
            <el-input v-model="verifyCode" placeholder="请输入右侧验证码" class="fill-verify" style="float:left;"></el-input>
            <a class='verify imgCodeInfor' v-if="imgCodeInfor">
              <img :src="imgCodeInfor.kaptchaImage" style="height:38px;position:relative;top:-4px;" title="点击切换" @click="getImgCodeLoad" />
            </a>
          </li>
          <li>
            <el-input v-model="smsCode" placeholder="请输入动态码" class="fill-verify"></el-input>
            <template v-if="tickCount < 1">
              <a class='verify' @click="getSmsCodeHandle">
                <span class="verifyBackground">获取动态码</span>
              </a>
            </template>
            <template v-else>
              <a class='verify' style="color:#666;">
                {{tickCount}}s
              </a>
            </template>
          </li>
        </ul>
      </div>
      <div v-if='active == 2'>
        <ul v-loading="loginLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
          <!-- <li class="message">两次输入密码不一致</li> -->
          <li style="padding-top:40px;">
            <el-input type="password" v-model="newPassword" placeholder="请输入新密码"></el-input>
          </li>
          <li>
            <el-input type="password" v-model="reNewPassword" placeholder="请再次输入新密码"></el-input>
          </li>

        </ul>
      </div>
      <div v-if='active > 2'>
        <ul v-loading="loginLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)" style="padding-top:40px;">
          <h1>恭喜你修改成功！！！</h1>
        </ul>
      </div>
    </div>

    <div class="wrap-next">
      <template v-if="active==1">
        <el-button class="next" :loading="checkMobileLoading" @click="checkMobileAndSmsCodeInfor">下一步</el-button>
      </template>
      <template v-if="active==2">
        <el-button class="next" :loading="rePwdLoading" @click="resetNewPassword">设置新密码</el-button>
      </template>
      <template v-if="active>2">
        <el-button class="next" :loading="rePwdLoading" @click="handleCancel">重新登录</el-button>
      </template>
      <!-- :loading="ajaxLoading" -->
    </div>
    <!-- </el-card> -->
  </div>

</template>
<script>
import { checkMobile, checkPassword } from "../../../util/inputDataCheck";
export default {
  data() {
    return {
      active: 1,
      imgCodeInfor: null,
      mobile: "",
      verifyCode: "",
      smsCode: "",
      tickCount: 0,
      checkMobileLoading: false,
      rePwdLoading: false,
      varTimeout: null,
      newPassword: "",
      reNewPassword: ""
    };
  },
  created() {
    this.getImgCodeLoad();
  },
  methods: {
    getImgCodeLoad() {
      let _this = this;
      _this.$api
        .getImgCode()
        .then(ret => {
          _this.imgCodeInfor = ret;
        })
        .catch(() => {});
    },
    handleCancel() {
      this.active = 1;
      this.mobile = "";
      this.verifyCode = "";
      this.smsCode = "";
      this.newPassword = "";
      this.reNewPassword = "";
      this.$emit("closeDialog");
    },
    getSmsCodeHandle() {
      //获取验证码
      if (!checkMobile(this.mobile)) {
        this.error("请输入正确的登录手机号");
        return false;
      }
      if (this.verifyCode == "") {
        this.error("请输入图片验证码");
        return false;
      }
      if (this.verifyCode != this.imgCodeInfor.kaptchaText) {
        this.error("图片验证码输入错误，请重新输入");
        return false;
      }
      let _this = this;
      _this.$api
        .smsCode_forgetPassword({
          kaptcha: _this.verifyCode,
          kaptchaToken: _this.imgCodeInfor.kaptchaToken,
          phone: _this.mobile
        })
        .then(ret => {
          _this.success("短信发送成功");
          _this.tickCount = 60;
          _this.varTimeout = setTimeout(() => {
            _this.tickFunction();
          }, 1000);
          return false;
        })
        .catch(() => {});
    },
    checkMobileAndSmsCodeInfor() {
      if (!checkMobile(this.mobile)) {
        this.error("请输入正确的登录手机号");
        return false;
      }
      if (this.verifyCode == "") {
        this.error("请输入图片验证码");
        return false;
      }
      if (this.smsCode == "") {
        this.error("请输入短信验证码");
        return false;
      }
      let _this = this,
        params = {
          kaptcha: _this.verifyCode,
          kaptchaToken: _this.imgCodeInfor.kaptchaToken,
          phone: _this.mobile,
          smsCode: _this.smsCode
        };
      _this.checkMobileLoading = true;
      _this.$api
        .forgetPwd_checkMobileAndCode(params)
        .then(ret => {
          _this.active = 2;
          _this.checkMobileLoading = false;
        })
        .catch(() => {
          _this.checkMobileLoading = false;
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
    resetNewPassword() {
      if (this.newPassword.trim() == "") {
        this.error("请输入新密码");
        return false;
      }
      if (!checkPassword(this.newPassword)) {
        this.error("密码为6到20位的数字与字母组合");
        return false;
      }
      if (this.reNewPassword.trim() == "") {
        this.error("请确认新密码");
        return false;
      }
      if (this.newPassword != this.reNewPassword) {
        this.error("两次密码输入不一致，请重新输入");
        return false;
      }
      let _this = this,
        params = {
          password: _this.newPassword,
          phone: _this.mobile
        };
      _this.rePwdLoading = true;
      _this.$api
        .resetPasswordByMobile(params)
        .then(ret => {
          _this.active = 3;
          _this.rePwdLoading = false;
        })
        .catch(() => {
          _this.rePwdLoading = false;
        });
    }
  }
};
</script>
<style lang="scss" >
.forgot-pwd {
  .modal-title-wrap {
    padding: 15px 15px 15px 30px;
    border-bottom: 2px solid #ff9f37;
    .modal-title {
      font-size: 18px;
      font-weight: bold;
      color: #808080;
    }
    .modal-close {
      float: right;
      font-size: 12px;
      font-weight: bold;
      color: #808080;
      line-height: 27px;
      cursor: pointer;
      padding: 0 15px;
    }
  }
  //********************************
  //   .box-card {
  // width: 720px;
  height: 500px;
  margin: auto;
  // margin-top: 12%;
  position: relative;
  .el-card__header {
    border-bottom: 1px solid #ff9f37;
    .title {
      span {
        font-size: 18px;
        font-family: Microsoft Yahei;
        color: #808080;
        font-size: 500;
      }
    }
  }
  .content {
    margin-top: 40px;
    .el-step__head.is-success {
      color: #ff9f37;
      border-color: #ff9f37;
    }
    .el-step__title.is-success {
      color: #ff9f37;
    }
    // 用户认证***********************************************************
    .is-active {
      background-color: #ffffff;
    }
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
        }
        input::-webkit-input-placeholder {
          color: #cccccc;
          font-size: 16px;
        }
        .verify {
          float: right;
          color: #ffffff;
          display: inline-block;
          width: 35%;
          font-size: 16px;
          text-align: center;
          line-height: 46px;
          .verifyBackground {
            background: #808080;
            border-radius: 5px;
            margin-left: 2px;
            // margin-right: 2px;
            display: inline-block;
            width: 95%;
            height: 40px;
            line-height: 45px;
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
          background: #ff9f37;
        }
      }
    }

    h1 {
      text-align: center;
      font-size: 30px;
      color: #76e989;
      margin-top: 50px;
    }
  }
  .wrap-next {
    position: absolute;
    width: 100%;
    bottom: 30px;
    left: 0px;
    .next {
      display: block;
      margin: 12px auto;
      background: #ff9f37;
      color: #ffffff;
    }
  }

  .el-button:active {
    color: #808080;
    border-color: #ffffff;
    outline: 0;
  }
  //   }
}
</style>
