<template>
    <div class="content-wrapper">
        <div class="list-wrapper">
            <el-form :model="ruleForm" :rules="rules" label-width="120px" ref="ruleForm" class="demo-ruleForm">
                <el-form-item label="客户编码：" prop="code">
                    <el-input v-model="ruleForm.code" :disabled="flag"></el-input>
                </el-form-item>
                <el-form-item label="客户类型：" prop="type">
                    <el-input v-model="ruleForm.type" :disabled="true" v-if="flag"></el-input>
                    <el-select v-model="ruleForm.type" placeholder="请选择" v-else style="width:40%">
                        <el-option
                                v-for="item in typeArr"
                                :key="item.propertyCode"
                                :label="item.propertyName"
                                :value="item.propertyCode"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户全称：" prop="fullName">
                    <el-input v-model="ruleForm.fullName" :disabled="flag"></el-input>
                </el-form-item>
                <el-form-item label="客户简称：" prop="name">
                    <el-input v-model="ruleForm.name" :disabled="flag"></el-input>
                </el-form-item>
                <el-form-item label="社会信用代码：" prop="socialCreditCode" >
                    <el-input v-model="ruleForm.socialCreditCode" :disabled="flag"></el-input>
                </el-form-item>
                <el-form-item label="所属城市：" v-if="$route.query.type!=3">
                    <el-col :span="4">
                        <el-form-item prop="provinceCode">
                            <el-select
                                    filterable
                                    v-model="ruleForm.provinceCode"
                                    @change="chooseProvince"
                                    placeholder="省级地区">
                                <el-option
                                        v-for="item in province"
                                        :key="item.areaCode"
                                        :label="item.areaName"
                                        :value="item.areaCode"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="1">-</el-col>
                    <el-col :span="4">
                        <el-form-item prop="cityCode">
                            <el-select
                                    filterable
                                    v-model="ruleForm.cityCode"
                                    @change="chooseCity"
                                    placeholder="市级地区">
                                <el-option
                                        v-for="item in city"
                                        :key="item.areaCode"
                                        :label="item.areaName"
                                        :value="item.areaCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="1">-</el-col>
                    <el-col :span="4">
                        <el-form-item prop="areaCode">
                            <el-select
                                    filterable
                                    v-model="ruleForm.areaCode"
                                    @change="chooseArea"
                                    placeholder="区级地区">
                                <el-option
                                        v-for="item in area"
                                        :key="item.areaCode"
                                        :label="item.areaName"
                                        :value="item.areaCode">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="所属城市：" prop="area" v-else>
                    <el-input
                            v-model="ruleForm.area"
                            :disabled="flag"
                            type="textarea"
                            :autosize="{ minRows: 1, maxRows: 2}"></el-input>
                </el-form-item>
                <el-form-item prop="remark" label="备注：">
                    <el-input
                            :disabled="flag"
                            type="textarea"
                            :autosize="{ minRows: 2, maxRows: 4}"
                            placeholder="请输入内容"
                            v-model="ruleForm.remark">
                    </el-input>
                </el-form-item>
                <el-form-item label="联系人信息：" prop="" style="margin-bottom:50px" >
                    <el-button style="float: right;margin-bottom:6px;" type="primary" @click="addContacts" v-if="!flag">增加</el-button>
                    <el-table
                            :data="tableData"
                            style="width: 100%"
                            >
                        <el-table-column
                                prop="name"
                                label="联系人"
                                >
                        </el-table-column>
                        <el-table-column
                                prop="mobile"
                                label="联系电话"
                                >
                        </el-table-column>
                        <el-table-column
                                prop="job"
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
                                v-if="$route.query.type!=3"
                                prop="address"
                                label="操作"
                                width="120"
                        >
                            <template slot-scope="scope">
                                <el-button
                                        size="mini"
                                        type="text"
                                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item style="display: flex;justify-content: space-between;">
                    <el-button type="primary" @click="submitForm('ruleForm')" v-if="!flag">保存</el-button>
                    <el-button @click="resetForm('ruleForm')" v-if="!flag">取消</el-button>
                    <el-button @click="goBack" v-else type="primary">返回</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog :visible.sync="dialogFormVisible" title="新建联系人">
            <el-form :model="form" ref="form" :rules="userRules" label-width="100px">
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
  import mixins from '../../../mixins/cacheMixin.js'
  import {addCus,cusDetail,editCus,typeList,checkFullName,checkName,checkSocial,provinceData,areaData,checkCode} from 'frame_cpm/http/interface.js'
  export default {
    name: "newCus",
    mixins: [mixins.cacheMixin],
    data() {
      let social = (rule, value, callback) => {
        let nameReg = /^[A-Za-z0-9]{18}$/
        if(value) {
          if (!nameReg.test(value)) {
            callback(new Error('请输入字母或者数字，长度为18个字符'))
          } else {
            if(this.ruleForm.socialCreditCode!=this.result.socialCreditCode){
              let data={
                socialCreditCode:this.ruleForm.socialCreditCode
              }
              checkSocial(data).then(ret=>{
                if(ret.result&&ret.data){
                  callback(new Error("此社会信用代码已存在，请重新输入"))
                }else{
                  callback()
                }
              })
            }else{
              callback()
            }
          }
        }else{
          callback()
        }
      }
      let consumerFullName = (rule, value, callback) => {
        let nameReg = /^[\u4E00-\u9FA5A-Za-z0-9]{1,50}$/
        if(!value) {
          return callback(new Error('请输入客户全称'));
        }else{
          if (!nameReg.test(value)) {
            callback(new Error('请输入字母、数字或者汉字，长度在50个字符以内'))
          } else {
            if(this.ruleForm.fullName!=this.result.fullName){
              let data={
                fullName:this.ruleForm.fullName
              }
              checkFullName(data).then(ret=>{
                if(ret.result&&ret.data){
                  callback(new Error("此全称已存在，请重新输入"))
                }else{
                  callback()
                }
              })
            }else{
              callback()
            }
          }
        }
      }
      let code = (rule, value, callback) => {
        let nameReg = /^[A-Za-z0-9`~!@#$%^&*()_+<>?:"{},.\\/;'[\]]{1,20}$/
        if(!value) {
          return callback(new Error('请输入客户编码'));
        }else{
          if (!nameReg.test(value)) {
            callback(new Error('请输入字母、数字，长度在20个字符以内'))
          } else {
            if(this.ruleForm.code!=this.result.code){
              let data={
                buyerCode:this.ruleForm.code
              }
              checkCode(data).then(ret=>{
                if(ret.result&&ret.data){
                  callback(new Error("此编码已存在，请重新输入"))
                }else{
                  callback()
                }
              })
            }else{
              callback()
            }
          }
        }
      }
      let consumerName = (rule, value, callback) => {
        let nameReg = /^[\u4E00-\u9FA5A-Za-z0-9]{1,50}$/
        if(value) {
          if (!nameReg.test(value)) {
            callback(new Error('请输入数字、字母、或者汉字，长度在50个字符以内'))
          } else {
              if(this.ruleForm.name!=this.result.name){
                let data={
                  name:this.ruleForm.name
                }
                checkName(data).then(ret=>{
                  if(ret.result&&ret.data){
                    callback(new Error("此简称已存在，请重新输入"))
                  }else{
                    callback()
                  }
                })
              }else{
                callback()
              }
          }
        }else{
          callback()
        }
      }
      let name = (rule, value, callback) => {
        let nameReg = /^[\u4E00-\u9FA5A-Za-z0-9]{1,20}$/
        if(!value) {
          return callback(new Error('联系人名称不能为空'));
        }else{
          if (!nameReg.test(value)) {
            callback(new Error('请输入字母、数字或者汉字，长度在20个字符以内'))
          } else {
            callback()
          }
        }
      }
      let mobile = (rule, value, callback) => {
        let phoneReg = /^1[34578]\d{9}$/
        if(!value) {
          return callback(new Error('手机号不能为空'));
        }else{
          if (!phoneReg.test(value)) {
            callback(new Error('手机号格式有误'))
          } else {
            callback()
          }
        }
      }
      let email = (rule, value, callback) => {
        let emailReg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
        if(value){
          if (!emailReg.test(value)) {
            callback(new Error('邮箱格式有误'))
          } else {
            callback()
          }
        }else{
          callback()
        }
      }
      let job = (rule, value, callback) => {
        let jobReg = /^[\u4E00-\u9FA5A-Za-z0-9]{1,20}$/
        if(value){
          if (!jobReg.test(value)) {
            callback(new Error('请输入数字、字母、或者汉字,长度在20个字符以内'))
          } else {
            callback()
          }
        }else{
          callback()
        }
      }
      return {
        // cacheField: ["ruleForm"],
        province: [],
        city: [],
        area: [],
        provinceName: '',
        cityName: '',
        areaName: '',
        areaFlag: false,
        areaFlag2: false,
        block: false,
        buyerCode: '',
        dialogFormVisible: false,
        typeArr: [],
        form: {
          name: '',
          mobile: '',
          job: '',
          email: '',
          status: '2'
        },
        result:{},
        flag: false,
        tableData: [],
        fileType: '',
        ruleForm: {
          code: '',
          name: '',
          socialCreditCode: '',
          fullName: '',
          type: '',
          remark: '',
          provinceCode:'',
          areaCode: '',
          cityCode: '',
          area: '',
        },
        rules:{
          code: [
            { required: true, validator: code, trigger: 'blur' },
          ],
          fullName: [
            { validator: consumerFullName, required: true, trigger: 'blur' },
          ],
          name: [
            { validator: consumerName, trigger: 'blur' },
          ],
          type: [
            { required: true, message: '请选择客户类型', trigger: 'blur' },
          ],
          socialCreditCode: [
            { validator: social, trigger: 'blur' },
          ],
          remark: [
            { min: 0, max: 500, message: '长度在 0 到 500 个字符', trigger: 'blur' }
          ],
        },
        userRules:{
          name: [
            { validator: name, required: true, trigger: 'blur' },
          ],
          mobile: [
            { required: true, validator: mobile, trigger: 'blur' },
          ],
          email: [
            { validator: email, trigger: 'blur' },
          ],
          job: [
            { validator: job, trigger: 'blur' },
          ],
        },
      }
    },
    activated () {
      // this.getData(this.$route.query.code);
      // if (this.$route.query.id) {
      //   if (this.$route.query.id != this.dataForm.id) {
      //     this.getData(this.$route.query.id);
      //   }
      // }
      // this.userDefaultParams = {
      //   attributeType: this.user.attributeType
      // }
    },
    created() {
        this.getProvinceData()
        this.fileType = this.$route.query.type
        this.getType()
        if(this.fileType==2){
          this.getData(this.$route.query.code)
        }else if(this.fileType==3){
          this.getData(this.$route.query.code)
          this.flag = true
        }else{
          return
        }
    },
    methods: {
      getProvinceData() {
        let _this = this
        provinceData()
          .then(ret => {
            if (ret && ret.code == 200) {
              this.province = ret.data
            }
          }).catch(err => {
          console.log(err)
        })
      },
      getAreaData(val) {
        let _this = this
        let params = {
          parentCode : val
        }
        areaData(params)
          .then(ret => {
            if (ret && ret.code==200) {
              if(!this.block) {
                this.city = ret.data
                this.block = true
                if(this.ruleForm.cityCode){
                  this.chooseCity(this.ruleForm.cityCode)
                  this.areaFlag = true
                }
              }else {
                this.area = ret.data
                this.block = false
                this.areaFlag2 = true
                if(this.$route.query.type==3&&this.ruleForm.areaCode) {
                  this.area.forEach(i => {
                    if (i.areaCode === this.ruleForm.areaCode) {
                      this.areaName = i.areaName
                      let arr = new Array(this.provinceName,this.cityName,this.areaName)
                      this.ruleForm.area = arr.join(',')
                    }
                  })
                }

              }

            }
          }).catch(err => {
          console.log(err)
        })
      },
      chooseProvince(val) {
        if(this.areaFlag){
          this.ruleForm.cityCode = this.ruleForm.areaCode = ''
        }
        this.area = []
        this.block = false
        this.province.forEach(s=>{
          if(s.areaCode == val){
            if(this.$route.query.type==3){
              this.provinceName = s.areaName
              let arr = new Array(this.provinceName)
              this.ruleForm.area = arr.join(',')
            }
            this.getAreaData(s.areaCode)
          }
        })

      },
      chooseCity(val) {
        if(this.areaFlag2){
          this.ruleForm.areaCode = ''
        }
        this.block = true
        this.city.forEach(s=>{
          if(s.areaCode == val){
            if(this.$route.query.type==3){
              this.cityName = s.areaName
              let arr = new Array(this.provinceName, this.cityName)
              this.ruleForm.area = arr.join(',')
            }
            this.getAreaData(s.areaCode)
          }
        })
      },
      chooseArea() {
        this.block = true
      },
      getType() {
        typeList()
          .then(ret => {
            if(ret && ret.code==200){
              this.typeArr = ret.data
            }else{
              this.$message({
                message:ret.msg,
                type: 'info'
              });
            }
          })
          .catch(() => {
          });
      },
      goBack() {
        this.$router.push('index')
      },
      getData(val) {
        cusDetail(val)
          .then(ret => {
            if(ret&&ret.code==200){
                this.result = ret.data
                let result = ret.data
                this.ruleForm.code = result.code
                this.ruleForm.name =  result.name
                this.ruleForm.fullName = result.fullName
                if(this.$route.query.type==3){
                  this.typeArr.forEach(item=>{
                    if(item.propertyCode==result.type){
                      this.ruleForm.type = item.propertyName
                    }
                  })
                }else{
                  this.ruleForm.type = result.type
                }
                this.ruleForm.remark = result.remark
                this.ruleForm.socialCreditCode = result.socialCreditCode
                this.tableData = result.buyerContactsList
                this.ruleForm.provinceCode= result.provinceCode
                this.ruleForm.cityCode = result.cityCode
                this.ruleForm.areaCode = result.areaCode
                if(this.$route.query.type!==1&&result.provinceCode){
                  this.chooseProvince(result.provinceCode)
                }
            }else{
              this.error(ret.msg)
            }
          }).catch( error => {
            console.log(error)
        })
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let _this = this;
            if(this.$route.query.type==1){
              let data = {
                buyer:{
                  socialCreditCode: this.ruleForm.socialCreditCode,
                  fullName: this.ruleForm.fullName,
                  name: this.ruleForm.name,
                  type: this.ruleForm.type,
                  remark: this.ruleForm.remark,
                  status: 1,
                  code: this.ruleForm.code,
                  provinceCode: this.ruleForm.provinceCode,
                  cityCode: this.ruleForm.cityCode,
                  areaCode: this.ruleForm.areaCode,
                },
                buyerContactsList: this.tableData
              }
              addCus(data)
                .then(ret => {
                  if(ret && ret.code == 200){
                    this.$router.push('index')
                    _this.success("添加成功")
                  }else{
                    _this.error(ret.msg)
                  }
                }).catch( err => {
              })
            }else{
              this.tableData.forEach(item=>{
                item.buyerCode = this.ruleForm.code
              })
              let data = {
                buyer:{
                  code: this.ruleForm.code,
                  socialCreditCode: this.ruleForm.socialCreditCode,
                  fullName: this.ruleForm.fullName,
                  name: this.ruleForm.name,
                  type: this.ruleForm.type,
                  remark: this.ruleForm.remark,
                  status: 1,
                  id: this.$route.query.id,
                  consumerId:  this.$route.query.consumerId,
                  provinceCode: this.ruleForm.provinceCode,
                  cityCode: this.ruleForm.cityCode,
                  areaCode: this.ruleForm.areaCode,
                },
                buyerContactsList: this.tableData
              }
              editCus(data)
                .then(ret => {
                  if(ret && ret.code == 200){
                    _this.success('修改成功')
                    this.$router.push('index')
                  }else{
                    _this.error(ret.msg)
                  }
                }).catch( () => {
                  this.error('网络繁忙，请稍后再试')
              })
            }
          } else {
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.$router.go(-1)
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
           if(this.tableData.length==0){
              this.tableData.push({
                name: this.form.name,
                mobile: this.form.mobile,
                job: this.form.job,
                email: this.form.email,
                status:this.form.status,
              })
             this.dialogFormVisible = false
             this.form = {
               name: '',
               mobile: '',
               job: '',
               email: '',
               status: '2'
             }
            }else{
                let arr =[]
                this.tableData.forEach(item=>{
                    arr.push(Number(item.status))
                })
                arr.push(Number(this.form.status))
                let brr = []
                arr.forEach(item=>{
                    if(item==1){
                        brr.push(item)
                    }
                })
                if((new Set(brr)).size != brr.length){
                    this.error("默认联系人只能有一位")
                }else{
                  this.tableData.push({
                    name: this.form.name,
                    mobile: this.form.mobile,
                    job: this.form.job,
                    email: this.form.email,
                    status:this.form.status,
                  })
                  this.dialogFormVisible = false
                  this.form = {
                    name: '',
                    mobile: '',
                    job: '',
                    email: '',
                    status: '2'
                  }
                }
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
    .content-wrapper{
        .el-col-2 {
            color: #606266;
        }
        .el-col-3 {
            width: 24%;
        }
        .el-input {
            width: 40%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .el-textarea{
            width: 40%;
        }
        .el-col-1{
            width: 2%;
            text-align: center;
        }
    }

</style>
