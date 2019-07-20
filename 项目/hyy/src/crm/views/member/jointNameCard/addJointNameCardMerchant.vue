<template>
  <div class="add-jointNameCard-merchant">
    <!-- 表单区 -->
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" size="medium" label-width="100px" label-position="right"
      class="add-joint-name-card-form">
      <el-form-item label="商户名称：" prop="merchantName">
        <el-input v-model="ruleForm.merchantName" placeholder="请输入商户名称"></el-input>
      </el-form-item>
      <el-form-item label="合同编号：" prop="compactId">
        <el-input v-model="ruleForm.compactId" placeholder="请输入合同编号"></el-input>
      </el-form-item>
      <el-form-item label="合作时间：" prop="cooperationTime" class="cooperation-time">
        <el-date-picker style="width:360px" v-model="cooperationTime" type="daterange" align="right" unlink-panels
          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="备注：" prop="memo" class="_member-joint-name-card-memo">
        <el-input type="textarea" resize="none" :rows="5" v-model="ruleForm.memo"></el-input>
      </el-form-item>
      <el-form-item class="_add-joint-name-card-btn-wrap">
        <el-button type="primary" @click="submitForm('ruleForm')" class="_el-btn-custom _member-add-edit-save-btn">保存
        </el-button>
        <el-button @click="resetForm('ruleForm')" class="_el-btn-custom">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "addJointNameCardMerchant",
  data() {
    // 输入限制正则
    var testName = /^[\u4e00-\u9fa50-9a-zA-Z\s\~\`\·\！\!\@\#\￥\%\^\……\&\*\（\）\——\-\+\=\【\】\{\}\|\、\\\：\；\:\;\“\”\‘\’\'\"\[\]\{\}\<\,\>\.\《\》\，\。\？\、\?\/\(\)\_]+$/;

    // 验证联名卡商户名称
    var checkMerchantName = (rule, value, callback) => {
      if (!value.toString().trim()) {
        callback(new Error("请输入商户名称"));
      } else if (!testName.test(value.toString().trim())) {
        callback(new Error("输入的名称含有不合法字符"));
      } else {
        this.$crmList
          .checkIfNameRepeat({
            name: value.toString().trim(),
            merchantId: this.$route.query.merchantId
              ? this.$route.query.merchantId
              : "",
            tenantId: this.$store.state.loginUser.consumerId
          })
          .then(data => {
            if (data) {
              callback(new Error("该名称已存在，请更换其他名称"));
            } else {
              this.ruleForm.merchantName = value.toString().trim();
              callback();
            }
          })
          .catch(err => console.log(err));
      }
    };
    return {
      ruleForm: {
        // merchantId: "", //联名商户id
        merchantName: "", //商户名称
        compactId: "", //合同编号
        cooperationStart: "", //合同开始时间
        cooperationEnd: "", //合同结束时间
        memo: "", //备注
        status: 1, //状态
        tenantId: this.$store.state.loginUser.consumerId //租户id
      },
      cooperationTime: [],
      rules: {
        merchantName: [
          { max: 20, message: "长度不可超过20个字符", trigger: "blur" },
          { required: true, validator: checkMerchantName, trigger: "blur" }
        ],
        compactId: [
          { max: 20, message: "长度不可超过20个字符", trigger: "blur" }
        ],
        memo: [{ max: 100, message: "长度不可超过100个字符", trigger: "blur" }]
      }
    };
  },
  mounted() {
    // 修改商户信息
    if (this.$route.query.merchantId) {
      let params = {
        merchantId: this.$route.query.merchantId,
        tenantId: this.$store.state.loginUser.consumerId
      };
      this.$crmList
        .getMerchantInfo(params)
        .then(data => {
          this.ruleForm = data;
          this.cooperationTime.push(data.cooperationStart, data.cooperationEnd);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  methods: {
    //   提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.ruleForm));
          if (this.cooperationTime.length) {
            data.cooperationStart = this.cooperationTime[0];
            data.cooperationEnd = this.cooperationTime[1];
          }
          if (this.$route.query.merchantId) {
            // 修改
            this.$crmList
              .editjointNameCardInfo(data)
              .then(() => {
                this.$message.success("修改成功");
                this.$router.go(-1);
              })
              .catch(err => {
                console.log(err);
              });
          } else {
            // 新增
            this.$crmList
              .addjointNameCardMerchant(data)
              .then(() => {
                this.$message.success("添加成功");
                this.$router.go(-1);
              })
              .catch(err => {
                console.log(err);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 取消
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$router.push({ path: "/member/jointNameCard/list" });
    },
    handleChange(value) {
      console.log("alue------", value);
    }
  }
};
</script>
<style lang="scss">
.add-jointNameCard-merchant {
  .add-joint-name-card-form {
    .cooperation-time {
      margin: 5px 0 28px 0 !important;
      .el-range-input {
        font-size: 12px;
      }
      .el-range-separator {
        font-size: 12px;
      }
    }
    ._member-joint-name-card-memo {
      .el-form-item__error {
        top: 120px;
      }
    }
    .el-form--label-left .el-form-item__label {
      color: #666;
      font-size: 12px;
    }
    .el-input {
      width: 360px;
      font-size: 12px;
    }
    .el-textarea {
      width: 360px;
    }
    .el-form-item {
      margin-bottom: 22px;
    }
    .el-form-item__error {
      top: 40px;
    }
    ._add-joint-name-card-btn-wrap {
      width: 100%;
      margin: 40px 0 40px;
      text-align: center;
      .el-form-item__content {
        margin-left: 0 !important;
      }
    }
  }
}
</style>


