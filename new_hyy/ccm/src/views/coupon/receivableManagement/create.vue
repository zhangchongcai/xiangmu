<template>
  <div>
    <main>
      <el-collapse v-model="activeNames">
        <el-collapse-item title="销售申请单信息" name="baseInfo">
          <div class="base-info">
            <div class="base-box">
              <div class="option">
                <label class="keyName">合同协议号:</label>
                <span class="keyValue">{{formData.contractCode}}</span>
              </div>
              <div class="option">
                <label class="keyName">销售申请人:</label>
                <span class="keyValue">{{formData.createUserName}}</span>
              </div>
              <div class="option">
                <label class="keyName">客户名称:</label>
                <span class="keyValue">{{formData.custName}}</span>
              </div>
              <div class="option">
                <label class="keyName">已收款金额:</label>
                <span class="keyValue">{{formData.receiptAmount}}</span>
              </div>
            </div>
            <div class="base-box">
              <div class="option">
                <label class="keyName">销售申请单号:</label>
                <span class="keyValue">{{formData.applyCode}}</span>
              </div>
              <div class="option">
                <label class="keyName">申请时间:</label>
                <span class="keyValue">{{formData.dateOfApplication}}</span>
              </div>
              <div class="option">
                <label class="keyName">合同总金额:</label>
                <span class="keyValue">{{formData.totalAmount}}</span>
              </div>
              <div class="option">
                <label class="keyName">未收款金额:</label>
                <span class="keyValue">{{formData.uncollectedAmount}}</span>
              </div>
            </div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="本次收款情况" name="state">
          <el-form :model="form" label-width="150px" ref="form" :rules="rules">
            <div class="input-box">
              <div>
                <el-form-item label="本次收款金额(元)：" prop="totalAmount">
                  <el-input v-model="form.totalAmount" class="input-type-217"></el-input>
                </el-form-item>

                <el-form-item label="本次收款日期：" prop="dateOfApplication">
                  <el-date-picker v-model="form.dateOfApplication" align="right" type="date" placeholder="选择日期" :picker-options="currenReceivTime"></el-date-picker>
                </el-form-item>
              </div>
              <div>
                <el-form-item label="支付方式：" prop="payTypeName">
                  <el-input v-model="form.payTypeName" class=" popup-input" :readonly="true" style="width:137px">
                    <i slot="suffix" class="el-icon-close close popup-close" @click="clearInputValue()" v-show="form.payTypeName"></i>
                  </el-input>
                  <el-button type="primary" plain @click="selectInputValue()">选择</el-button>

                </el-form-item>
                <el-form-item label="下次回款日期：">
                  <el-date-picker v-model="form.nextReceiptDate" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions"></el-date-picker>
                </el-form-item>
              </div>
            </div>
          </el-form>
          <div class="fixed-bottom">
            <el-button type="primary" @click="saveOrSubmit()" style="width:80px;height:32px;">确定</el-button>
            <el-button plain @click="canCel()" style="width:80px;height:32px;margin-left:22px;">取消</el-button>
          </div>
        </el-collapse-item>
      </el-collapse>
    </main>

    <!-- 支付弹窗 -->
    <pay-type ref="payType" @payTypeCallBack="payTypeCallBack"></pay-type>

  </div>
</template>

<script>
import payType from 'ccmSrc/dialogs/payType';
export default {
  components: {
    payType
  },
  data () {
    var amount = (rule, value, callBack) => {
      let regExp = /^(-?\d+)(\.\d+)?$/;
      if (!value) {
        return callBack(new TypeError('请输入金额'));
      } else if (!regExp.test(value)) {
        return callBack(new TypeError('请输入数字'));
      } else if (value.indexOf('.') > -1) {
        if (value.split('.')[1].length > 2) {
          return callBack(new TypeError('最多输入两位小数'));
        }
      }

      if (Number(value) >= Number(this.formData.receiptAmount * -1) && Number(value) <= this.formData.uncollectedAmount) {
        return callBack();
      } else {
        return callBack(new TypeError('金额大于等于已收款负数小于等于未收款'));
      }
      callBack();
    };
    return {
      activeNames: ['baseInfo', 'state'],
      formData: {},
      pickerOptions: {
        disabledDate (time) {
          let date = new Date();
          let y = date.getFullYear();
          let m = date.getMonth() + 1;
          let d = date.getDate();
          let dateString = `${y}-${m}-${d}`;
          return time.getTime() < new Date(dateString);
        }
      },
      currenReceivTime: {
        disabledDate (time) {
          let date = new Date();
          let y = date.getFullYear();
          let m = date.getMonth() + 1;
          let d = date.getDate();
          let dateString = `${y}-${m}-${d}`;
          return time.getTime() > new Date(dateString);
        }
      },
      form: {
        totalAmount: '',
        dateOfApplication: new Date(),
        payTypeName: '现金',
        payTypeCode: 'XRMB',
        nextReceiptDate: '',
        receivableId: ''
      },
      rules: {
        totalAmount: { required: true, validator: amount, trigger: 'blur' },
        dateOfApplication: { required: true, message: '请选择日期', trigger: 'change' },
        payTypeName: { required: true, message: '请选择支付方式', trigger: 'change' }

      }
    };
  },
  created () {
    console.log('传来的id', this.$route.query.id);
    this.form.receivableId = this.$route.query.id;
    let param = { id: this.$route.query.id };
    this.search(param);
  },
  methods: {
    search (param) {
      this.$ccmList.receivableList(param).then(res => {
        if (res.code == 200) {
          this.formData = res.data.list[0];
        }
      });
    },
    saveOrSubmit () {
      this.$refs[`form`].validate((validate) => {
        if (validate) {
          let params = JSON.parse(JSON.stringify(this.form));
          // 时间格式化
          params.dateOfApplication = this.ruleTime(params.dateOfApplication);
          params.nextReceiptDate = this.ruleTime(params.nextReceiptDate);
          /**
           * 1.收款金额等于未收款金额，去掉nextReceiptDate
           * 2.
          */
          if (Number(params.totalAmount) < Number(this.formData.uncollectedAmount)) {
            console.log('params.nextReceiptDate', params.nextReceiptDate);
            if (params.nextReceiptDate == 'NaN-NaN-NaN' || !params.nextReceiptDate) {
              return this.$message({
                type: 'warning',
                message: '请填写下次回款时间'
              });
            }
          } else if (Number(params.totalAmount) == Number(this.formData.uncollectedAmount)) {
            delete params['nextReceiptDate'];
          }
          this.$ccmList.addReceivableItem(params).then(res => {
            let type = 'warning';
            let message = res.msg ? res.msg : '新增收款记录失败';
            if (res.code == 200) {
              type = 'success',
                message = res.msg ? res.msg : '新增收款记录成功';
            }
            this.$message({
              type,
              message
            });
            if (res.code == 200) {
              this.$store.commit('tagNav/removeTagNav', {
                name: this.$route.name,
                path: this.$route.path,
                title: this.$route.meta.title,
                query: this.$route.query
              });
              this.$router.push({
                name: 'receivableManagement',
                params: { isFresh: true }
              });
            }
          });
        }
      });
    },
    // 时间转换
    ruleTime (time, type) {
      let _time = new Date(time);

      let _year = _time.getFullYear(),
        _mounth = _time.getMonth() + 1,
        _day = _time.getDate(),
        _hours = _time.getHours(),
        _minutes = _time.getMinutes();

      let returnStr = `${_year}-${_mounth}-${_day}`;
      if (type == 'time') {
        returnStr = `${_hours}:${_minutes}`;
      }

      return returnStr;
    },
    selectInputValue () {
      this.$refs.payType.openDialog(this.form.payTypeCode);
    },
    // 清除
    clearInputValue () {
      this.form.payTypeName = '';
      this.form.payTypeCode = '';
    },
    payTypeCallBack (data) {
      this.form.payTypeName = data.payTypeName;
      this.form.payTypeCode = data.payTypeCode;
    },
    // 返回
    canCel () {
      this.$store.commit('tagNav/removeTagNav', {
        name: this.$route.name,
        path: this.$route.path,
        title: this.$route.meta.title,
        query: this.$route.query
      });
      this.$router.push({
        path: 'receivableManagement'
      });
    }
  },
  mounted () { }
};
</script>

<style lang="scss" scoped>
@import "../../../assets/css/element-reset.scss";
.base-info {
  display: flex;
  margin-left: 27px;
  .base-box {
    flex: 1;
    .keyName,
    .keyValue {
      color: #666;
      font-size: 12px;
    }
  }
}
.option {
  height: 40px;
}
.input-box {
  display: flex;
  margin-left: 10px;
  & > div {
    flex: 1;
  }
}
.fixed-bottom {
  text-align: center;
}

/deep/ .el-form-item__label {
  text-align: left;
}
/deep/ .el-form {
  margin-left: 8px;
}
.close {
  cursor: pointer;
}
</style>
