<template>
  <div class="add-entity-card-wrap">
    <!-- 面包屑 -->
    <div class="crumbs-wrap">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>会员</el-breadcrumb-item>
        <el-breadcrumb-item>会员卡</el-breadcrumb-item>
        <el-breadcrumb-item>
          <router-link
            :to="{path:'/membershipCard/entityCardList'}"
            style="font-weight: normal;color: #606266"
          >实体卡管理</router-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span style="color: rgb(59, 116, 255)">新建申请</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="110px"
      label-position="left"
      class="form-data-wrap specialTab"
    >
      <el-form-item label="批次名" prop="name">
        <el-input v-model="ruleForm.name" maxlength="10" placeholder="请输入实体卡批次名称"></el-input>
      </el-form-item>
      <el-form-item label="适用政策" prop="cardTypeId">
        <el-select v-model="ruleForm.cardTypeId" placeholder="请选择适用政策">
          <el-option
            v-for="item in cardList"
            :key="item.id"
            :label="item.cardName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡号生成规则" prop="cardNumberRule">
        <el-radio-group v-model="ruleForm.cardNumberRule">
          <el-radio label="0">随机卡号</el-radio>
          <!-- <el-radio label="1">自定义卡号</el-radio> -->
          <el-tooltip class="item" effect="dark" content="卡号不能为7位或11位，只支持数字或字母" placement="right">
            <!-- <i class="el-icon-info" style="marginLeft:15px;"></i> -->
          </el-tooltip>
          <el-input
            v-if="ruleForm.cardNumberRule=='1'?true:false"
            placeholder="请输入自定义卡号"
            style="marginLeft:30px;"
          ></el-input>
        </el-radio-group>
      </el-form-item>
      <!-- <el-form-item
        label="卡密码规则"
        prop="passwordRule"
      >
        <el-radio-group v-model="ruleForm.passwordRule">
          <el-radio label="0">随机密码</el-radio>
          <el-radio label="1">统一设置密码</el-radio>
          <el-input
            v-if="ruleForm.passwordRule=='1'?true:false"
            placeholder="请输入统一密码"
            style="marginLeft:45px;"
          ></el-input>
        </el-radio-group>
      </el-form-item>-->
      <el-form-item label="申请张数" prop="numberOfSheets">
        <el-input v-model="ruleForm.numberOfSheets"></el-input>张
      </el-form-item>
      <el-form-item class="btn-wrap">
        <el-button class="btnRepeat el-btn-custom">
          <router-link :to="{path:'/member/membershipCard/entityCardList'}">取消</router-link>
        </el-button>
        <el-button
          type="primary"
          :loading="uploadDate"
          @click="submitForm('ruleForm')"
          class="el-btn-custom"
        >保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: "addEntityCard",
  data() {
    return {
      ruleForm: {
        id: "",
        cardName: "",
        name: "",
        region: "",
        cardNumberRule: "0",
        passwordRule: "0",
        numberOfSheets: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入卡批次名称", trigger: "blur" }
        ],
        cardTypeId: [
          { required: true, message: "请选择适用政策", trigger: "change" }
        ],
        cardNumberRule: [
          { required: true, message: "请选择卡号生成规则", trigger: "change" }
        ],
        passwordRule: [
          { required: true, message: "请选择卡密码生成规则", trigger: "change" }
        ],
        numberOfSheets: [
          { required: true, message: "请输入申请张数", trigger: "blur" }
        ]
      },
      cardTypeId: "",
      options: [],
      current: 1,
      size: 25,
      tenantId: this.$store.state.loginUser.consumerId,
      cardList: [],
      uploadDate: false,
      cardTypeObject: {}
    };
  },
  created() {
    this.getCardType();
  },
  // watch: {
  //   cardTypeId() {
  //     this.changeCardType();
  //   }
  // },
  methods: {
    getCardType() {
      let _this = this,
        params = {
          cardProductName: "",
          cardType: "",
          channelNo: "",
          current: _this.current,
          size: _this.size,
          status: "start",
          tenantId: _this.tenantId
        };
      _this.$crmList.cardproductList(params).then(ret => {
        _this.cardList = ret.records;
        ret.records.forEach(function(item) {
          _this.cardTypeObject[item.id] = item.cardName;
        });
        console.log(_this.cardTypeObject);
        // if (ret.records.length > 0) {
        //   _this.ruleForm.cardTypeId = ret.records[0].id;
        // }
        // _this.ruleForm.id = this.ruleForm.region.id;
        // _this.ruleForm.cardName = this.ruleForm.region.cardName;
      });
    },
    // changeCardType() {
    //   // console.log(this.cardTypeId);
    //   let itemArr = this.cardList.filter((item, index) => {
    //     console.log(item);
    //     return (this.ruleForm.cardTypeId = item.id);
    //   });
    //   // console.log(itemArr);
    //   if (itemArr.length > 0) {
    //     this.ruleForm.id = itemArr[0].id;
    //     this.ruleForm.cardName = itemArr[0].cardName;
    //   }
    // },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            batchCount: this.ruleForm.numberOfSheets,
            batchName: this.ruleForm.name,
            cardNoRule: this.ruleForm.cardNumberRule == "0" ? "auto" : "",
            cardProductId: this.ruleForm.cardTypeId,
            cardProductName: this.cardTypeObject[this.ruleForm.cardTypeId],
            // cardProductName: this.cardTypeObject.id,
            tenantId: this.tenantId
          };
          let reg = /^\+?[1-9][0-9]*$/;
          if (!reg.test(this.ruleForm.numberOfSheets)) {
            this.$message.warning("申请张数请输入非零正整数");
            return false;
          }
          if (
            this.ruleForm.numberOfSheets > 10000 ||
            this.ruleForm.numberOfSheets < 0
          ) {
            this.$message.warning("申请的卡张数范围在1-10000内！");
            return false;
          }
          this.uploadDate = true;
          this.$crmList
            .cardbatchAdd(params)
            .then(ret => {
              this.success("申请成功啦！");
              // return false;
              this.$router.push({
                path: "/member/membershipCard/entityCardList"
              });
              this.uploadDate = false;
            })
            .catch(() => {
              this.uploadDate = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.add-entity-card-wrap {
  // padding: 20px;
  .crumbs-wrap {
    padding: 0 0 20px 0;
  }
  .form-data-wrap {
    padding: 20px;
    background: #f5f5f5;

    .el-form-item__error {
      top: 12px !important;
      left: 380px;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
    .btn-wrap {
      text-align: center;
    }
  }
}
</style>

<style lang="scss" scoped>
.specialTab {
  .el-input__inner {
    width: 360px !important;
    line-height: 32px !important;
  }
  .add-entity-card-wrap .form-data-wrap .el-input {
    width: 360px !important;
  }
}
.el-input {
  width: 360px !important;
}
.add-entity-card-wrap .form-data-wrap .el-input {
  width: 360px !important;
}
</style>

