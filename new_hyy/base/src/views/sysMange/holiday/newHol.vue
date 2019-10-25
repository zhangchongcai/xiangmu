<template>
  <div class="content-wrapper">
    <div class="list-wrapper">
      <el-form :model="ruleForm" :rules="rules" label-width="100px" ref="ruleForm" class="demo-ruleForm">
        <el-form-item label="假日类型：" prop="type">
          <el-input v-model="type" disabled></el-input>
        </el-form-item>
        <el-form-item label="假日名称：" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="开始日期：" prop="startTime">
          <el-date-picker :picker-options="startDatePicker" value-format="yyyy-MM-dd HH:mm:ss" v-model="ruleForm.startTime" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束日期：" prop="endTime">
          <el-date-picker :picker-options="endDatePicker" value-format="yyyy-MM-dd HH:mm:ss" v-model="ruleForm.endTime" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item style="display: flex;justify-content: space-between;">
          <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { newHol, editHol, detailHol } from 'baseSrc/http/interface.js';
import mixins from '../../../mixins/cacheMixin.js';
export default {
  name: 'newHol',
  mixins: [mixins.cacheMixin],
  data () {
    let name = (rule, value, callback) => {
      let nameReg = /^[\u4E00-\u9FA5A-Za-z0-9`~!@#$%^&*()_+<>?:"{},.【】\\/;\-'[\]\s\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3008|\u3009|\u3010|\u3011|\u300e|\u300f|\u300c|\u300d|\ufe43|\ufe44|\u3014|\u3015|\u2026|\u2014|\uff5e|\ufe4f|\uffe5]{1,30}$/;
      if (!value) {
        return callback(new Error('假日名称不能为空'));
      } else {
        if (!nameReg.test(value)) {
          callback(new Error('请输入字母、数字或者汉字，长度在30个字符以内'));
        } else {
          callback();
        }
      }
    };
    return {
      cacheField: ['ruleForm'],
      type: '自定义',
      id: '',
      ruleForm: {
        name: '',
        startTime: '',
        endTime: ''
      },
      rules: {
        name: [
          { required: true, validator: name, trigger: 'blur' }
        ],
        startTime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endTime: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ]
      },
      startDatePicker: this.beginDate(),
      endDatePicker: this.processDate()
    };
  },
  created () {
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      this.getData(this.id);
    } else {
      this.id = '';
      this.ruleForm = {
        name: '',
        startTime: '',
        endTime: ''
      };
    }
  },
  methods: {
    beginDate () {
      const self = this;
      return {
        disabledDate (time) {
          if (self.ruleForm.endTime) {  // 如果结束时间不为空，则小于结束时间
            return new Date(self.ruleForm.endTime).getTime() < time.getTime();
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    },
    processDate () {
      const self = this;
      return {
        disabledDate (time) {
          if (self.ruleForm.startTime) {  // 如果开始时间不为空，则结束时间大于开始时间
            return new Date(self.ruleForm.startTime).getTime() > time.getTime();
          } else {
            // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
          }
        }
      };
    },
    getData (val) {
      let data = {
        id: val
      };
      detailHol(data)
        .then(ret => {
          if (ret && ret.result) {
            this.ruleForm.name = ret.data.name;
            this.ruleForm.startTime = ret.data.startTime;
            this.ruleForm.endTime = ret.data.endTime;
          }
        }).catch(err => {
        });
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.id) {
            this.ruleForm.id = this.id;
            this.ruleForm.endTime = this.ruleForm.endTime.replace('00:00:00', '23:59:59') ? this.ruleForm.endTime.replace('00:00:00', '23:59:59') : this.ruleForm.endTime;
            editHol(this.ruleForm).then(ret => {
              if (ret && ret.code == 200) {
                this.success('修改成功');
                this.$store.commit('tagNav/removeTagNav', this.$route);
                this.$router.push('index');
                this.ruleForm = {};
              } else {
                this.error(ret.msg);
              }
            }).catch(() => {
              this.error('网络繁忙，请稍后再试');
            });
          } else {
            this.ruleForm.endTime = this.ruleForm.endTime.replace('00:00:00', '23:59:59');
            newHol(this.ruleForm).then(ret => {
              if (ret && ret.code == 200) {
                this.success('新建成功');
                this.$store.commit('tagNav/removeTagNav', this.$route);
                this.$router.push('index');
                this.ruleForm = {};
              } else {
                this.error(ret.msg);
              }
            }).catch(() => {
              this.error('网络繁忙，请稍后再试');
            });
          }
        } else {
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.$store.commit('tagNav/removeTagNav', this.$route);
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.el-col-2 {
  color: #606266;
}
.el-col-3 {
  width: 24%;
}
.el-input {
  width: 40%;
}
</style>
