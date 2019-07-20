<template>
  <div class="creatCommodityType">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
      <el-form-item label="商品类型名称：" prop="commodityTypeName">
        <el-input maxlength="50" v-model="ruleForm.commodityTypeName"></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input type="textarea" maxlength="500" resize="none" :rows="5" v-model="ruleForm.remark"></el-input>
      </el-form-item>
      <el-form-item style="textAlign:center;marginTop:50px">
        <el-button type="primary" @click="submitForm('ruleForm')" class="_el-btn-custom _member-add-edit-save-btn">保存</el-button>
        <el-button @click="resetForm('ruleForm')" class="_el-btn-custom">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "creatCommodityType",
  data() {
    // 输入限制正则
    var testName = /^[\u4e00-\u9fa50-9a-zA-Z\s\~\`\·\！\!\@\#\￥\%\^\……\&\*\（\）\——\-\+\=\【\】\{\}\|\、\\\：\；\:\;\“\”\‘\’\'\"\[\]\{\}\<\,\>\.\《\》\，\。\？\、\?\/\(\)\_]+$/;
    // 异业商品类型名称
    var checkMerchantName = (rule, value, callback) => {
      if (!value.toString().trim()) {
        callback(new Error("请输入商户名称"));
      } else if (!testName.test(value.toString().trim())) {
        callback(new Error("输入的名称含有不合法字符"));
      } else {
        this.$crmList
          .diffCommodityTypeNameIsexist({
            typeName: value.toString().trim(),
            typeId: this.$route.query.typeId ? this.$route.query.typeId : "",
            tenantId: this.$store.state.loginUser.consumerId
          })
          .then(data => {
            if (data.isExist) {
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
        commodityTypeName: "",
        remark: ""
      },
      rules: {
        commodityTypeName: [
          { max: 50, message: "长度不可超过20个字符", trigger: "blur" },
          { required: true, validator: checkMerchantName, trigger: "blur" }
        ]
        // name: { max: 100,required: true, message: "名称不能为空", trigger: "blur" }
      }
    };
  },
  methods: {
    getDetail(id) {
      this.$crmList.diffCommodityDetail({ id: id, tenantId: this.$store.state.loginUser.consumerId }).then(data => {
        this.ruleForm = data;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var data = this.ruleForm;
          data.tenantId = this.$store.state.loginUser.consumerId;
          if (this.$route.query.typeId) {
            this.$crmList
              .diffCommodityTypeedit(data)
              .then(data => {
                this.$message.success("修改成功");
                this.$router.push({
                  path: "/member/otherCommodity/commodityList"
                });
              })
              .catch(err => console.log(err));
          }

          if (!this.$route.query.typeId) {
            this.$crmList
              .diffCommodityTypeAdd(data)
              .then(data => {
                this.$message.success("添加成功");
                this.$router.push({
                  path: "/member/otherCommodity/commodityList"
                });
              })
              .catch(err => console.log(err));
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
      this.$router.push({ path: "/member/otherCommodity/commodityList" });
    }
  },
  created() {
    if (this.$route.query.typeId) {
      this.ruleForm.id = this.$route.query.typeId;
      this.getDetail(this.$route.query.typeId);
    }
  }
};
</script>
<style lang="scss">
.creatCommodityType {
  padding-top: 34px;
  .el-input {
    width: 360px;
  }
  .el-textarea {
    width: 360px;
  }
}
</style>
