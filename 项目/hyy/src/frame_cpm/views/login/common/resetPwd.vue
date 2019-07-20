<template>
    <div class="m-reset-pwd">
        <!-- <div class="box-card"> -->
        <div class="modal-title-wrap">
            <span class="modal-title">修改密码</span>
            <span class="modal-close" @click="handleCancel">
                <i class="el-icon-close" style="font-size:25px;"></i>
            </span>
        </div>
        <!-- <div slot="header" class="title">
            <span>修改密码</span>
            <span class="modal-close" @click="handleCancel" style="float:right;">
                <i class="el-icon-close" style="font-size:25px;"></i>
            </span>
        </div> -->
        <div class="content">
            <div class="demo-input-suffix">
                <label for='name'>用户名：</label>
                <span class="admin" v-text="account"></span>

            </div>
            <div class="demo-input-suffix">
                <label for='newPwd'>新密码：</label>
                <el-input class="reset-input" id='newPwd' type="password" placeholder="请输入新密码" v-model="newPassword">
                </el-input>
            </div>
            <div class="demo-input-suffix">
                <label for='newPwd'>再次输入：</label>
                <el-input class="reset-input" id='resetPwd' type="password" placeholder="再次输入密码" v-model="newRePassword">
                </el-input>
            </div>
            <div class="demo-input-suffix" v-show="passwordDiffrent">
                <p class="message">两次输入密码不一致</p>
            </div>

        </div>

        <div class="wrap-next">
            <el-button class="" style="width:120px;margin-left:62px;" @click="handleCancel">取消</el-button>
            <el-button class="next" :loading="ajaxLoading" @click="sureResetPassword">完成</el-button>            
        </div>
        <!-- </div> -->
    </div>

</template>
<script>
import { checkPassword } from "../../../util/inputDataCheck";
export default {
  props: {
    account: {
      type: String,
      default: "",
      required: true
    },
    password: {
      type: String,
      default: "",
      required: true
    },
    safeTyMd5: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  data() {
    return {
      active: 1,
      passwordDiffrent: false,
      newPassword: "",
      newRePassword: "",
      ajaxLoading: false
    };
  },
  created() {},
  methods: {
    handleCancel() {
      this.$emit("closeDialog");
    },
    sureResetPassword() {
      if (this.newPassword.trim() == "") {
        this.error("新密码不能为空");
        return false;
      }
      if (!checkPassword(this.newPassword)) {
        this.error("密码为6到20位的数字与字母组合");
        return false;
      }
      if (this.newRePassword.trim() == "") {
        this.error("确定新密码不能为空");
        return false;
      }
      if (this.newPassword != this.newRePassword) {
        this.error("再次密码输入不一致");
        return false;
      }
      let _this = this,
        params = {
          account: _this.account,
        //   passwordOld: _this.password,
          password: _this.newPassword
        };
      if (_this.safeTyMd5) {
          params.passwordOld = '' ; 
        // params.passwordMd5 = _this.password;
      }
      else{
          params.passwordOld = _this.password ; 
      }
      _this.ajaxLoading = true;
      _this.$api
        .resetLoginPassword(params)
        .then(ret => {
          _this.handleCancel();
          _this.success("密码修改成功");
          _this.$router.push("/");
          _this.ajaxLoading = false;
        })
        .catch(() => {
          _this.ajaxLoading = false;
        });
    }
  }
};
</script>
<style lang="scss" >

.m-reset-pwd {
  
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
  //****************************************
//   .box-card {
    // width: 565px;
    height: 408px;
    margin: auto;
    // margin-top:12%;
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
        margin-top:40px;
      .el-step__head.is-success {
        color: #ff9f37;
        border-color: #ff9f37;
      }
      .el-step__title.is-success {
        color: #ff9f37;
      }
      .demo-input-suffix {
        width: 100%;
        height: 47px;
        margin-bottom: 5px;
        .message {
          font-size: 14px;
          color: #ff3c00;
          padding-left: 58px;
        }

        .admin {
          font-size: 14px;
          color: #808080;
          display: inline-block;
          width: 78%;
          float: right;
          height: 47px;
          line-height: 47px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        label {
          font-size: 14px;
          color: #808080;
          width: 20%;
        //   min-width: 70px;
          display: inline-block;
          text-align: right;
          height: 47px;
          line-height: 47px;
          overflow: hidden;
        }
        .reset-input {
          display: inline-block;
          width: 70%;
          float: right;
          padding-right: 40px;
          .el-input__inner {
            width: 100%;
            margin-top: 2px;
          }
        }
      }
    }
    .wrap-next {
      position: absolute;
      width: 100%;
      height: 70px;
      bottom: 30px;
      left: 75px;
      .next {
        margin-left: 62px;
        background: #ff9f37;
        color: #ffffff;
        width: 120px;
      }
      .cancel {
        background: #808080;
      }
      .cancel:active {
        color: #000;
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
