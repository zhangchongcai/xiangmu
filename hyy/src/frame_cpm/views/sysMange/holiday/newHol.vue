<template>
    <div class="content-wrapper">
        <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>客户管理</el-breadcrumb-item>
                <el-breadcrumb-item>{{this.$route.name}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="list-wrapper">
            <el-form :model="ruleForm" :rules="rules" label-width="120px" ref="ruleForm" class="demo-ruleForm">
                <el-form-item label="假日类型：" prop="type" >
                    <el-input v-model="type" disabled></el-input>
                </el-form-item>
                <el-form-item label="假日名称：" prop="name" >
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="开始日期：" prop="startTime" >
                    <el-date-picker
                            :picker-options="startDatePicker"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="ruleForm.startTime"
                            type="datetime"
                            default-time="00:00:00"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期：" prop="endTime">
                    <el-date-picker
                            :picker-options="endDatePicker"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            v-model="ruleForm.endTime"
                            type="datetime"
                            default-time="24:00:00"
                            placeholder="选择日期">
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
  import {newHol,editHol,detailHol} from 'frame_cpm/http/interface.js'
  export default {
    name: "newHol",
    data() {
      return {
        type: '自定义',
        id: '',
        ruleForm: {
          name: '',
          startTime: '',
          endTime: '',
        },
        rules:{
          name: [
            { required: true, message: '请输入假日名称', trigger: 'blur' },
          ],
          startTime: [
            { required: true, message: '请选择开始时间', trigger: 'blur' },
          ],
          endTime: [
            { required: true, message: '请选择结束时间', trigger: 'blur' },
          ],
        },
        startDatePicker:this.beginDate(),
        endDatePicker:this.processDate()
      }
    },
    watch: {
      $route: {
        handler: function(newVal, oldVal){
          if(newVal.query.id){
            this.id = this.$route.query.id
            this.getData(this.id)
          }else{
            this.id = ''
            this.ruleForm ={
                name: '',
                startTime: '',
                endTime: '',
            }
          }
        },
        // 深度观察监听
        deep: true
      }
    },
    created() {
      if(this.$route.query.id){
        this.id = this.$route.query.id
        this.getData(this.id)
      }else{
        this.id = ''
        this.ruleForm ={
              name: '',
              startTime: '',
              endTime: '',
        }
      }
    },
    methods: {
      beginDate(){
        const self = this
        return {
          disabledDate(time){
            if (self.ruleForm.endTime) {  //如果结束时间不为空，则小于结束时间
              return new Date(self.ruleForm.endTime).getTime() < time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
      processDate() {
        const  self = this
        return {
          disabledDate(time) {
            if (self.ruleForm.startTime) {  //如果开始时间不为空，则结束时间大于开始时间
              return new Date(self.ruleForm.startTime).getTime() > time.getTime()
            } else {
              // return time.getTime() > Date.now()//开始时间不选时，结束时间最大值小于等于当天
            }
          }
        }
      },
      getData(val) {
        let data = {
          id:val
        }
        detailHol(data)
          .then(ret => {
            if(ret&&ret.result){
               this.ruleForm.name = ret.data.name
               this.ruleForm.startTime = ret.data.startTime
               this.ruleForm.endTime = ret.data.endTime
            }
          }).catch( err => {
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if(this.id){
              this.ruleForm.id = this.id
              editHol(this.ruleForm).then(ret=>{
                if(ret&&ret.result){
                  this.success('修改成功')
                  this.$router.push('index')
                }else{
                  this.error(ret.msg)
                }
              }).catch(()=>{
                this.error('服务器出错，请稍后再试')
              })
            }else{
              newHol(this.ruleForm).then(ret=>{
                if(ret&&ret.result){
                  this.success('新建成功')
                  this.$router.push('index')
                }else{
                  this.error(ret.msg)
                }
              }).catch(()=>{
                this.error('服务器出错，请稍后再试')
              })
            }
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$router.push('index')
      }
    },
  }
</script>
<style lang="scss" scoped>
    .breadcrumb {
        margin-bottom: 10px;
        .el-breadcrumb {
            span {
                font-size: 14px;
            }
        }
    }
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
