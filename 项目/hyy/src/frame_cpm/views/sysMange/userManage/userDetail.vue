<template>
    <div class="content-wrapper">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户账号" prop="loginName">
                <el-input v-model="ruleForm.loginName" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户名称" prop="fullName">
                <el-input v-model="ruleForm.fullName" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户编码" prop="empCode">
                <el-input v-model="ruleForm.empCode" disabled></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status" >
                <el-input v-model="ruleForm.status" disabled></el-input>
            </el-form-item>
            <el-form-item label="用户属性：" prop="attributeType">
                <el-input v-model="ruleForm.attributeType" disabled></el-input>
            </el-form-item>
            <el-form-item label="所属角色" prop="rolesId">
                <el-input
                        placeholder="请点击右侧选择"
                        type="textarea"
                        disabled
                        autosize
                        v-model="ruleForm.rolesName">
                </el-input>
            </el-form-item>
            <el-form-item label="所属组织" prop="orgUid">
                <el-input v-model="ruleForm.orgName" label-width="100px" placeholder="请点击右侧选择" disabled></el-input>
            </el-form-item>
            <el-form-item label="数据权限" prop="deptName">
                <el-input
                        type="textarea"
                        disabled
                        autosize
                        v-model="ruleForm.deptName">
                </el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone" >
                <el-input v-model="ruleForm.phone" disabled></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email" >
                <el-input v-model="ruleForm.email" disabled></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click=to>返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {onlyUser,attributeType} from 'frame_cpm/http/interface.js'
    export default {
        name: "userDetail",
        data() {
            return {
                user: '',
                uid: '',
                title: '',
                str: '',
                roles: '',
              attributeArr: [],
                ruleForm: {
                    loginName: '',
                    fullName: '',
                    empCode: '',
                    status: '0',
                    rolesId: '',
                    rolesName: '',
                    orgName: '',
                    deptName: '',
                    phone: '',
                    email: '',
                    attributeType:'',
                },
                deptIds: '',
                orgUid: '',
            }
        },
        created() {
            this.uid = localStorage.getItem('usDetail_uid')
            this.getUser()
            this.getAttribute()
        },
        methods: {
          getAttribute(){
            attributeType()
              .then(ret => {
                if(ret && ret.code==200){
                  this.attributeArr = ret.data
                }else{
                  this.error(ret.msg)
                }
              })
              .catch(() => {
              });
          },
            to() {
                this.$router.push('index')
            },
            getUser(){
                let _this = this;
                onlyUser(this.uid)
                    .then(ret => {
                        if(ret && ret.code==200){
                            this.ruleForm.loginName = ret.data.user.loginName
                            this.ruleForm.fullName = ret.data.user.fullName
                            this.ruleForm.status = ret.data.user.status.toString()==0?'启用':ret.data.user.status.toString()==1?'禁用':'离职'
                            this.ruleForm.empCode = ret.data.user.empCode
                            if(ret.data.user.attributeType){
                                this.attributeArr.forEach(item=>{
                                  if(item.propertyCode == ret.data.user.attributeType){
                                    this.ruleForm.attributeType = item.propertyName
                                  }
                                })
                            }
                            this.orgUid = ret.data.user.orgUid
                            this.ruleForm.orgName = ret.data.user.organization.name
                            this.ruleForm.rolesId = ret.data.user.roles
                            this.ruleForm.rolesId.map(item=>{
                                this.str += `${item.name}，`
                                this.ruleForm.rolesName = this.str.substring(0,this.str.length - 1)
                            })
                            this.ruleForm.phone = ret.data.user.phone
                            this.ruleForm.email = ret.data.user.email
                            let str = JSON.parse(JSON.stringify(ret.data.dataPurview))
                            let deptName = []
                            str.forEach(item=>{
                                deptName.push(item.name)
                            })
                            this.ruleForm.deptName = deptName.join('，')
                        }
                    })
                    .catch(() => {
                    });
            },
        }
    }
</script>
<style lang="scss" scoped>
    .content-wrapper {
        height: 100%;
        .el-input {
            width: 40%;
        }
        .el-textarea {
            width: 40%;
        }
        .but {
            display: inline-block;
            width: 40px;
            height: 32px;
            border-radius: 4px;
            line-height: 32px;
            text-align: center;
            background-color: #3B74FF;
            color: #fff;

            i {
                font-size: 25px;
            }
        }
    }
</style>
