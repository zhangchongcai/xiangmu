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
                <el-form-item label="客户编码：" prop="code" >
                    <el-input v-model="ruleForm.code" :disabled="codeFlag"></el-input>
                </el-form-item>
                <el-form-item label="社会信用代码：" prop="socialCreditCode" >
                    <el-input v-model="ruleForm.socialCreditCode" :disabled="flag"></el-input>
                </el-form-item>
                <el-form-item label="客户简称：" prop="name">
                    <el-input v-model="ruleForm.name" :disabled="flag" @blur="checkName"></el-input>
                </el-form-item>
                <el-form-item label="客户全称：" prop="fullName">
                    <el-input v-model="ruleForm.fullName" :disabled="flag" @blur="checkFullName"></el-input>
                </el-form-item>
                <el-form-item label="客户类型：" prop="type">
                    <el-input v-model="ruleForm.type" :disabled="true" v-if="flag"></el-input>
                    <el-select v-model="ruleForm.type" placeholder="请选择" v-else>
                        <el-option
                                v-for="item in typeArr"
                                :key="item.value"
                                :label="item.label"
                                :value="item.label"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="联系人信息：" prop="" style="margin-bottom:50px" >
                    <el-button style="float: right" type="primary" @click="addContacts" v-if="!flag">增加</el-button>
                    <el-table
                            :data="tableData"
                            >
                        <el-table-column
                                prop="name"
                                label="联系人"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="mobile"
                                label="联系电话"
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="title"
                                label="职务">
                        </el-table-column>
                        <el-table-column
                                prop="email"
                                label="邮箱">
                        </el-table-column>
                        <el-table-column
                                prop="status"
                                label="是否默认">
                            <template slot-scope="scope">{{scope.row.status==1?'是':'否'}}</template>
                        </el-table-column>
                        <el-table-column
                                prop="address"
                                label="操作">
                            <template slot-scope="scope">
                                <el-button
                                        size="mini"
                                        type="danger"
                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item prop="remark" label="备注：" :disabled="flag">
                    <el-input
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="ruleForm.remark">
                    </el-input>
                </el-form-item>
                <el-form-item style="display: flex;justify-content: space-between;">
                    <el-button type="primary" @click="submitForm('ruleForm')" v-if="!flag">保存</el-button>
                    <el-button @click="resetForm('ruleForm')" v-if="!flag">取消</el-button>
                    <el-button @click="goBack" v-else type="primary">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog :visible.sync="dialogFormVisible" title="新建联系人">
            <el-form :model="form" ref="form" :rules="userRules">
                <el-form-item label="联系人：" prop="name">
                    <el-input v-model="form.name" ></el-input>
                </el-form-item>
                <el-form-item label="联系电话：" prop="mobile">
                    <el-input v-model.number="form.mobile"></el-input>
                </el-form-item>
                <el-form-item label="职务：" prop="job">
                    <el-input v-model="form.job"></el-input>
                </el-form-item>
                <el-form-item label="邮箱：" prop="email">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item label="是否默认：" prop="status">
                    <el-radio v-model="form.status" label="1">是</el-radio>
                    <el-radio v-model="form.status" label="2">否</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelDialogForm('form')">取 消</el-button>
                <el-button type="primary" @click="dialogSubmit('form')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import {addCus,cusDetail,editCus,cusN,cusFn} from 'frame_cpm/http/interface.js'
  export default {
    name: "newCus",
    data() {
      let validcode=(rule,value,callback)=>{
        let reg=/[0-9|a-z|A-Z]{6,20}/
        if(!reg.test(value)){callback(new Error('账号必须是由6-20位数字和字母组合'))
        }else{
          callback()
        }
      };
      return {
        codeFlag: false,
        dialogFormVisible: false,
        typeArr: [{
          value: '0',
          label: '第三方'
        }, {
          value: '1',
          label: '大客户'
        }],
        form: {
          name: '',
          mobile: '',
          job: '',
          email: '',
          status: '2'
        },
        flag: false,
        tableData: [],
        fileType: '',
        ruleForm: {
          code: '',
          name: '',
          socialCreditCode: '',
          fullName: '',
          type: '',
          remark: ''
        },
        rules:{
          code: [
            { required: true, message: '请输入客户编码', trigger: 'blur' },
          ],
          fullName: [
            { required: true, message: '请输入客户全称', trigger: 'blur' },
          ],
          type: [
            { required: true, message: '请输入选择客户类型', trigger: 'blur' },
          ],
        },
        userRules:{
          name: [
            { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          ],
          mobile: [
            { required: true, message: '请输入联系人电话', trigger: 'blur' },
            { type: 'number', message: '年龄必须为数字值'}
          ],
          status: [
            { required: true, message: '请选择是否默认', trigger: 'blur' },
          ]
        },

      }
    },
    watch: {
      $route: {
        handler: function(newVal, oldVal){
          if(newVal.query.type==2){
            this.flag = false
            this.codeFlag = true
            this.getData(this.$route.query.code)
          }else if(newVal.query.type==3){
            this.getData(this.$route.query.code)
            this.flag = true
            this.codeFlag = true
          }else{
            this.ruleForm = {
                code: '',
                name: '',
                socialCreditCode: '',
                fullName: '',
                type: '',
                remark: ''
            }
            this.tableData = []
            this.flag = false
            this.codeFlag = false
          }
        },
        // 深度观察监听
        deep: true
      }
    },
    created() {
      this.fileType = this.$route.query.type
        if(this.fileType==2){
          this.codeFlag = true
          this.getData(this.$route.query.code)
        }else if(this.fileType==3){
          this.codeFlag = true
          this.getData(this.$route.query.code)
          this.flag = true
        }else{
          return
        }
    },
    methods: {
      checkName() {
        let data={
          name:this.ruleForm.name
        }
        cusN(data).then(ret=>{
          if(ret.result&&ret.data){
            this.$message("此名称已存在，请重新输入")
            this.ruleForm.name =  ''
          }else{
            return
          }
        })
      },
      checkFullName() {
        let data={
          fullName:this.ruleForm.fullName
        }
        cusFn(data).then(ret=>{
          if(ret.result&&ret.data){
            this.$message("此名称已存在，请重新输入")
          }else{
            return
          }
        })
      },
      goBack() {
        this.$router.push('index')
      },
      getData(val) {
        let data = {
          buyerCode:val
        }
        cusDetail(val)
          .then(ret => {
            if(ret&&ret.result){
                let result = ret.data
                this.ruleForm.code = result.code
                this.ruleForm.name =  result.name,
                this.ruleForm.fullName = result.fullName,
                this.ruleForm.type = result.type
                this.ruleForm.remark = result.remark
                this.ruleForm.socialCreditCode = result.socialCreditCode
                this.tableData = result.buyerContactsList
            }
          }).catch( err => {
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let _this = this;
            let data = {
              buyer:{
                socialCreditCode: this.ruleForm.socialCreditCode,
                fullName: this.ruleForm.fullName,
                name: this.ruleForm.name,
                type: this.ruleForm.type,
                remark: this.ruleForm.remark,
                status: 1,
              },
              buyerContactsList: this.tableData
            }
            if(this.$route.query.type==1){
              data.buyer.code = this.ruleForm.code
              addCus(data)
                .then(ret => {
                  if(ret && ret.code === 200){
                    alert(12)
                    this.$router.push('index')
                    _this.success("添加成功")
                  }else{
                    _this.error(ret.msg)
                  }
                }).catch( err => {
              })
            }else{
              data.buyer.id = this.$route.query.id
              data.buyer.consumerId =  this.$route.query.consumerId
              editCus(data)
                .then(ret => {
                  if(ret && ret.code === 200){
                    this.$router.push('index')
                    _this.success('修改成功')
                  }else{
                    _this.error(ret.msg)
                  }
                }).catch( err => {
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
      },
      handleDelete(index, row) {
        this.tableData.splice(index, 1)
      },
      addContacts() {
        this.dialogFormVisible = true
      },
      dialogSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if(valid){
            this.dialogFormVisible = false
            this.tableData.push({
              name: this.form.name,
              mobile: this.form.mobile,
              job: this.form.job,
              email: this.form.email,
              status:this.form.status
            })
            this.form = {
              name: '',
              mobile: '',
              job: '',
              email: '',
              status: '2'
            }
          }else{
            return false
          }
        })
      },
      cancelDialogForm(form) {
        this.$refs[form].resetFields();
        this.dialogFormVisible = false
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
