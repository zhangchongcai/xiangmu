<template>
  <div class="add-entity-card-wrap">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px" label-position="left" class="form-data-wrap specialTab">
      <el-form-item label="批次名：" prop="name">
        <el-input v-model="ruleForm.name" maxlength="10" placeholder="请输入实体卡批次名称"></el-input>
      </el-form-item>
      <el-form-item label="开卡方式：" prop="cardWay">
        <el-radio-group v-model="ruleForm.cardWay">
          <el-radio :label="1">磁条卡读卡</el-radio>
          <el-radio :label="0">IC卡写卡</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="卡类型：" prop="cardType">
        <el-select v-model="ruleForm.cardType" placeholder="请选择卡类型" @change="handleChangeCardType" clearable>
          <el-option v-for="item in cardTypeOptions" :key="item.code" :label="item.desc" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适用政策：" prop="cardProductId">
        <el-select v-model="ruleForm.cardProductId" placeholder="请选择适用政策" @change='handleSelectCardType' filterable clearable>
          <el-option v-for="item in cardList" :key="item.id" :label="item.cardName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="卡号生成规则：" prop="cardNumberRule">
        <el-radio-group v-model="ruleForm.cardNumberRule">
          <el-radio label="0">随机卡号</el-radio>
          <!-- <el-radio label="1">自定义卡号</el-radio> -->
          <el-tooltip class="item" effect="dark" content="卡号不能为7位或11位，只支持数字或字母" placement="right">
            <!-- <i class="el-icon-info" style="marginLeft:15px;"></i> -->
          </el-tooltip>
          <el-input v-if="ruleForm.cardNumberRule=='1'" placeholder="请输入自定义卡号" style="marginLeft:30px;">
          </el-input>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="卡密码规则：" prop="passwordRule" v-if="cardTypeCode == 'gift_card'">
        <el-radio-group v-model="ruleForm.passwordRule">
          <el-radio :label="1">随机密码</el-radio>
          <el-radio :label="0">统一设置密码</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="统一密码：" prop="password" v-if="cardTypeCode == 'gift_card' && ruleForm.passwordRule==0">
        <el-input v-model="ruleForm.password" placeholder="请输入6位密码">
        </el-input>
      </el-form-item>
      <el-form-item label="申请张数：" prop="numberOfSheets">
        <el-input v-model="ruleForm.numberOfSheets"></el-input><span class="_member-unit-custom">张</span>
      </el-form-item>
      <el-form-item class="btn-wrap">
        <el-button type="primary" @click="submitForm('ruleForm')" class="_el-btn-custom _member-add-edit-save-btn">保存
        </el-button>
        <el-button @click="handleCancelAdd" class="_el-btn-custom">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'addEntityCard',
  data () {
    // 校验密码
    var checkPassword = (rule, value, callback) => {
      if (value.toString().replace(/\s/g, '') == '') {
        callback(new Error('请输入数字'));
      }
      if (!/^[0-9]\d*$/.test(value.toString().replace(/\s/g, ''))) {
        callback(new Error('请输入非负整数'));
      }
      if (!/^\d{6}$/.test(value.toString().replace(/\s/g, ''))) {
        callback(new Error('请输入6位密码'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        cardWay: 1, // 开卡方式
        cardType: 'stored_card', // 卡类型
        cardProductId: '', //	卡类型ID
        name: '', //	批次名
        cardNumberRule: '0', // 卡号生成规则
        passwordRule: 1, // 卡密码规则
        password: '', // 卡密码
        numberOfSheets: '' // 申请张数
      },
      rules: {
        name: [
          { required: true, message: '请输入卡批次名称', trigger: 'blur' }
        ],
        cardWay: [
          { required: true, message: '请选择开卡方式', trigger: 'change' }
        ],
        cardType: [
          { required: true, message: '请选择卡类型', trigger: 'change' }
        ],
        cardProductId: [
          { required: true, message: '请选择适用政策', trigger: 'change' }
        ],
        cardNumberRule: [
          { required: true, message: '请选择卡号生成规则', trigger: 'change' }
        ],
        passwordRule: [{ required: true, message: ' ', trigger: 'change' }],
        password: [
          { required: true, validator: checkPassword, trigger: 'blur' }
        ],
        numberOfSheets: [
          { required: true, message: '请输入申请张数', trigger: 'blur' }
        ]
      },
      cardTypeOptions: [], // 卡类型
      current: 1,
      size: 1000,
      tenantId: this.$store.state.loginUser.consumerId,
      cardList: [],
      cardTypeObject: {},
      cardTypeCode: '' // 卡类型code
    };
  },
  created () {
    this.handleCardType();
    this.getCardPolicy();
  },
  methods: {
    // 切换卡类型
    handleChangeCardType () {
      this.ruleForm.cardProductId = '';
      this.$nextTick(function () {
        this.$refs['ruleForm'].clearValidate('cardProductId');
      });
      this.getCardPolicy();
    },
    // 选择卡政策的回调
    handleSelectCardType (val) {
      let _this = this;
      _this.cardList.forEach(function (item) {
        if (item.id == val) {
          _this.cardTypeCode = item.cardTypeCode;
        }
      });
    },
    // 取消
    handleCancelAdd () {
      this.$store.commit('tagNav/removeTagNav', this.$route);
      this.$router.push({
        path: '/member/membershipCard/entityCardList'
      });
    },
    // 卡类型
    handleCardType () {
      let params = { tenantId: this.$store.state.loginUser.consumerId };
      let _this = this;
      _this.$crmList.getCardType(params).then(ret => {
        _this.cardTypeOptions = ret;
      });
    },
    // 获取卡政策
    getCardPolicy () {
      let _this = this,
        params = {
          cardProductName: '',
          cardType: _this.ruleForm.cardType
            ? _this.ruleForm.cardType
            : 'stored_card',
          channelNo: '',
          checkExpire: true, // 是否过滤已过期的礼品卡
          current: _this.current,
          size: _this.size,
          status: 'start',
          tenantId: _this.tenantId
        };
      _this.$crmList
        .cardproductList(params)
        .then(ret => {
          _this.cardList = ret.records;
          ret.records.forEach(function (item) {
            _this.cardTypeObject[item.id] = item.cardName;
          });
        })
        .catch(err => {
          _this.cardList = [];
        });
    },
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.cardTypeCode != this.ruleForm.cardType) {
            this.$message.warning('所选适用政策与卡类型不一致，请重新选择');
            return false;
          }
          let params = {
            cardWay: this.ruleForm.cardWay,
            batchCount: this.ruleForm.numberOfSheets,
            batchName: this.ruleForm.name,
            cardNoRule: this.ruleForm.cardNumberRule == '0' ? 'auto' : '',
            cardType: this.ruleForm.cardType,
            cardProductId: this.ruleForm.cardProductId,
            cardProductName: this.cardTypeObject[this.ruleForm.cardProductId],
            passwordRule: this.ruleForm.passwordRule,
            password: this.ruleForm.password,
            tenantId: this.tenantId
          };
          let reg = /^\+?[1-9][0-9]*$/;
          if (!reg.test(this.ruleForm.numberOfSheets)) {
            this.$message.warning('申请张数请输入非零正整数');
            return false;
          }
          if (
            this.ruleForm.numberOfSheets > 10000 ||
            this.ruleForm.numberOfSheets < 0
          ) {
            this.$message.warning('申请的卡张数范围在1-10000内！');
            return false;
          }
          if (this.cardTypeCode != 'gift_card') {
            params.passwordRule = '';
            params.password = '';
          }
          this.$crmList
            .cardbatchAdd(params)
            .then(ret => {
              this.$message.success('保存成功');
              this.$store.commit('tagNav/removeTagNav', this.$route);
              this.$router.push({
                path: '/member/membershipCard/entityCardList'
              });
            })
            .catch(err => {
              this.$message.error('保存失败，请重试');
              console.log(err);
            });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.add-entity-card-wrap {
  .form-data-wrap {
    padding: 20px;
    .el-form-item__error {
      top: 40px !important;
    }
    .el-form-item {
      margin-bottom: 20px;
    }
    ._member-unit-custom {
      font-size: 14px;
      color: #666;
      margin-left: 8px;
    }
    .el-input__inner {
      width: 360px !important;
      line-height: 32px !important;
    }
    .el-input {
      width: 360px !important;
    }
    .btn-wrap {
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