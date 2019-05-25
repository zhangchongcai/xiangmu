<template>
    <div class="content-wrapper">
        <div class="breadcrumb">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item>系统设置</el-breadcrumb-item>
                <el-breadcrumb-item>用户管理</el-breadcrumb-item>
                <el-breadcrumb-item>用户详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="用户账号" prop="loginName">
                <el-input v-model="ruleForm.loginName"></el-input>
            </el-form-item>
            <el-form-item label="用户名称" prop="fullName">
                <el-input v-model="ruleForm.fullName" placeholder="请输入20个以内汉字或字符"></el-input>
            </el-form-item>
            <el-form-item label="用户编码" prop="empCode">
                <el-input v-model="ruleForm.empCode" placeholder="请输入10个以内汉字或字符"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status" >
                <el-radio v-model="ruleForm.status" label="0" >启用</el-radio>
                <el-radio v-model="ruleForm.status" label="1" >禁用</el-radio>
                <el-radio v-model="ruleForm.status" label="2" >离职</el-radio>
            </el-form-item>
            <el-form-item label="所属角色" prop="rolesId">
                <el-input v-model="ruleForm.rolesName" label-width="100px" placeholder="请点击右侧选择" disabled></el-input>
            </el-form-item>
            <el-form-item label="所属组织" prop="orgUid">
                <el-input v-model="ruleForm.orgName" label-width="100px" placeholder="请点击右侧选择" disabled></el-input>
            </el-form-item>
            <el-form-item label="数据权限" prop="deptName">
                <el-input v-model="ruleForm.deptName" label-width="100px" placeholder="请点击右侧选择" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="phone" >
                <el-input v-model="ruleForm.phone" placeholder="请输入手机号码"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email" >
                <el-input v-model="ruleForm.email" placeholder="请输入邮箱"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click=to>返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {onlyUser} from 'frame_cpm/http/interface.js'
    export default {
        name: "userDetail",
        data() {
            return {
                user: '',
                uid: '',
                title: '',
                str: '',
                roles: '',
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
                },
                deptIds: '',
                orgUid: '',
            }
        },
        created() {
            this.uid = localStorage.getItem('usDetail_uid')
            this.getUser()
        },
        methods: {
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
                            this.ruleForm.status = ret.data.user.status.toString()
                            this.ruleForm.empCode = ret.data.user.empCode
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

        .breadcrumb {
            padding: 9px 0 9px 3px;

            .el-breadcrumb {
                span {
                    font-size: 14px;
                }
            }
        }
        .el-input {
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
