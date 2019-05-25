<template>
    <el-container>
        <el-aside :width="this.isCollapse ? '60px' : '136px'">
            <h1 class="project-title"><i class="el-icon-tickets"></i>慧影云</h1>
            <el-menu
                @open="handleOpen()"
                @close="handleClose()"
                background-color="#21376B"
                text-color="#fff"
                active-text-color="#fff"
                :defaultOpeneds="defaultOpenedsArr"
            >
                <el-menu-item index="1">
                    <i class="el-icon-setting"></i>
                    <span slot="title">工作台</span>
                </el-menu-item>
                <div class="xian"></div>
                <div class="second">
                    <el-submenu index="2">
                        <template slot="title">全部功能</template>
                        <el-menu
                                :collapse="true"
                                style="width:100%;background-color:#21376b"
                        >
                            <el-submenu
                                    :index="'2-'+i"
                                    v-for="(item, i) in list"
                                    :key="i"
                            >
                                <template slot="title">
                                    <i
                                            class="el-icon-setting"
                                            style="color:#fff;font-size: 14px">
                                        {{item.menuName}}
                                    </i>
                                </template>
                                <div style="max-height:500px;overflow-y:scroll;">
                                    <el-menu-item-group
                                            :index="'2-'+i+'-'+s"
                                            v-if="item.submenu.length>0"
                                            v-for="(sub, s) in item.submenu"
                                    >
                                    <span
                                            slot="title"
                                            v-if="sub.menuName"
                                            :key="s"
                                    >
                                        {{sub.menuName}}
                                    </span>
                                    <div style="max-width:480px;display:flex;flex-wrap: wrap;" class="title">
                                        <el-menu-item
                                                :index="'2-'+i+'-'+s+'-'+b"
                                                v-if="sub.submenu.length!=0"
                                                v-for="(su, b) in sub.submenu"
                                                :key="b"
                                                style="width:160px;text-overflow: ellipsis;overflow: hidden"
                                        >
                                            <router-link
                                                    v-if="su.menuName"
                                                    :to="su.resUrl?su.resUrl:su"
                                                    :title="su.menuName"

                                            >
                                                {{ su.menuName }}
                                            </router-link>
                                        </el-menu-item>
                                    </div>
                                    </el-menu-item-group>
                                </div>
                            </el-submenu>
                        </el-menu>
                    </el-submenu>
                    <div class="xian"></div>
                    <el-submenu index="3">
                        <template slot="title">常用功能</template>
                        <el-menu-item-group>
                        </el-menu-item-group>
                    </el-submenu>
                    <div class="button">
                        <router-link to="/sys/add">
                            <el-button>
                                <i class="el-icon-plus"></i>添加
                            </el-button>
                        </router-link>
                    </div>
                </div>
            </el-menu>
        </el-aside>
        <el-container>
            <el-header >
            <!-- <div class="head-cinema-info">
                <span class="el-icon-location-outline"></span>
                <span class="head-cinema-name">北京自由人影城</span>
            </div> -->
                <Tabs :iframResult ="iframResult" :iframeList="iframeList"></Tabs>
                <div class="header-user">
                    <div class="user-img"></div>
                    <el-dropdown trigger="click"  @command="handleCommand">
                          <span class="el-dropdown-link">
                            {{user?user:'未登录'}}<i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="a">修改密码</el-dropdown-item>
                            <el-dropdown-item command="b">退出</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </el-header>
            <el-main>
                <div class="content-wrapper">
                    <router-view></router-view>
                </div>
                <el-dialog
                        title="修改密码"
                        :visible.sync="dialogVisible"
                        :before-close="closeDialog">
                    <div class="film-top" style="padding:20px;">
                        <el-form ref="resetForm" :model="resetForm" :rules="rules" label-width="148px" size="mini" class="film-search">
                            <el-form-item label="请输入原密码：" prop="password">
                                <el-input type="password" v-model="resetForm.password" placeholder="请输入新密码"></el-input>
                            </el-form-item>
                            <el-form-item label="请输入新密码：" prop="newPassword">
                                <el-input type="password" v-model="resetForm.newPassword" placeholder="请输入新密码"></el-input>
                            </el-form-item>
                            <el-form-item label="请再次输入新密码：" prop="reNewPassword">
                                <el-input type="password" v-model="resetForm.reNewPassword" placeholder="请再次输入新密码"></el-input>
                            </el-form-item>
                            <div class="btn-bottom" style="text-align:center;">
                                <el-button @click="closeDialog(false)">取 消</el-button>
                                <el-button type="primary" @click="querenDialog('resetForm')">确 定</el-button>
                            </div>
                        </el-form>
                    </div>
                </el-dialog>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import addMenu from './addMenu'
import navTab from "../components/Tabs/Tabs"
import menu from "../components/Menu/Menu"
import {modifyUserPassword,menuList} from 'frame_cpm/http/interface.js'
export default {
    data() {
        return {
            // defaultActive: "",
            defaultOpenedsArr:['2'],
            isCollapse:false,
            list: [],
            secondList: [],
            request: [],
            url: '',
            iframResult:'',
            iframeList:[],
            iframFlag:0,
            user:'',
            resetForm:{
                password: '',
                newPassword:'',
                reNewPassword:'',
            },
            dialogVisible: false,
            rules: {
                password:[
                    {required: true ,message:'请输入密码', trigger: 'blur'},
                    // {validator:validatePass1,trigger:'blur'}
                ],
                newPassword: [
                    {required: true ,message:'请输入新密码', trigger: 'blur'},
                    // {validator:validatePass1,trigger:'blur'}
                ],
                reNewPassword:[
                    {required: true, message:'请再次输入新密码', trigger:'blur'},
                    // {validator:validatePass2, trigger:'blur'},
                ]
            },
        }
    },
    created() {
        let str = JSON.parse(localStorage.getItem('user'))
        this.user = str.fullName
        this.getData()
    },
    mounted() {
        this.$nextTick(()=>{
          if(localStorage.getItem('changeCode')){
            this.handleCommand(localStorage.getItem('changeCode'))
          }
        })
    },
    methods: {
        handleCommand(command) {
          if (command == 'a') {
            this.dialogVisible = true
            if(this.$refs.resetForm){
              this.$refs.resetForm.clearValidate()
            }
          } else if (command =='b') {
            this.loginOutFun()
          }
        },
        loginOutFun(){
          let token =localStorage.getItem('token')
          let data ={
              token
          }
          let _this = this;
          _this.$cpmList.LoginOutApi(data)
          .then(ret => {
              if(ret.code == 200 ){
                this.$store.commit('updateLoginToken','')
                this.$store.commit('updateLoginUser','')
                localStorage.removeItem('token');
                 _this.$router.push("/login");

            }else{
                 _this.error(ret.msg);
            }

          })
          .catch(() => {
               _this.error('服务器繁忙，稍等再试');
          });
      },
        closeDialog(){
            this.dialogVisible= false
            localStorage.removeItem('changeCode')
        },
        querenDialog(formName){
            let _this = this
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let userObj = JSON.parse(localStorage.getItem('user'))
                    let queryObj = {}
                    queryObj.loginName = userObj.loginName
                    queryObj.password = this.resetForm.password
                    queryObj.newPassword = this.resetForm.newPassword;
                    if(this.resetForm.password==this.resetForm.newPassword){
                      this.error('新密码与原密码相同，请重新输入')
                    }else{
                      if(this.resetForm.reNewPassword===queryObj.newPassword) {
                        modifyUserPassword(queryObj).then((ret)=>{
                          localStorage.removeItem('changeCode')
                          if(ret.result){
                            _this.success(ret.msg)
                            _this.dialogVisible = false
                            this.resetForm = {}
                          }else{
                            _this.error('原密码输入错误,请重新输入')
                          }
                        }).catch(()=>{
                        })
                      }else{
                        this.error('新密码输入不一致，请重新输入')
                      }
                    }


                }else{
                  return false;
                }
            })
        },
      getData() {
        //从用户信息中拿取菜单
        let self = this;
        let token =localStorage.getItem('token')
        let data ={
            token
        }
        this.$store.commit('updateLoginToken','')
        this.$store.commit('updateLoginUser','')
          menuList(data).then((ret)=>{
            if(ret&&ret.code==200){
              localStorage.setItem('leftTreeList',JSON.stringify(ret.data))
              self.list = ret.data
              ret.data.forEach(s=>{
                if(s.productCode==='RPT') {
                  s.submenu[0].submenu.map(item=>{
                    return item.resUrl = item.resUrl.replace('?id=','=')
                  })
                }
              })
            }
          }).catch((error)=>{

          })

      }
    },
    name: "mainCon",
    components: {
        Tabs: navTab,
        Menu: menu,
        add: addMenu
    }
};
</script>
<style lang='scss'>
.el-container{
    height:100%;
    line-height: 100%;
    .el-menu{
        border:0;
    }
    .el-aside {
        height:100%;
        line-height: 100%;
        background: #21376b;
        color: #fff;
        overflow: hidden;
        .el-menu {
            height:80%;
            .second{
                height:100%;
                overflow-y: scroll;
                .el-menu--popup-right-start {
                    margin-left: 100px !important;
                }
            }
            .el-submenu__title{
                 height:40px;
                 line-height:40px;
            }
            .el-submenu__title:hover {
                background-color: #fff;
                i {
                    color: #3b74ff !important;
                }

            }
            .button {
                width: 100%;
                text-align: center;
                height: 50px;
                background-color: #21376b;
                line-height: 50px;
                .el-button--default{
                    color: #fff;
                    background-color: #21376b;
                    &:hover {
                        color: #1278E1;
                        background-color: #fff;
                    }
                }

            }

        }
        .project-title {
            font-size: 18px;
            line-height: 25px;
            letter-spacing: 3.5px;
            font-weight: 800;
            display: block;
            text-align: center;
            margin-bottom: 20px;
            padding: 10px 0;
        }
        .xian{
            width: 90px;
            height: 2px;
            border: none;
            background: #FFFFFF;
            opacity: 0.2;
            margin: 5px auto;

        }

    }
    .el-container{
        .el-header {
            height: 60px;
            line-height: 60px;
            box-sizing: border-box;
            box-shadow: 0 2px 7px 0 rgba(102, 102, 102, 0.1);
            .header-user {
                width: 160px;
                height: 56px;
                line-height: 56px;
                margin-top:4px;
                float:right;
                display: flex;
                justify-content: center;
                align-items: center;
                .user-img {
                    width: 28px;
                    height: 28px;
                    margin-right:10px;
                    border-radius: 50%;
                    display: inline-block;
                    background-image: url("../assets/images/man.png");
                    background-size: contain;
                    background-repeat: no-repeat;
                }

            }
        }
        .el-main {
            .content-wrapper {
                height:100%;
                padding: 0 10px 0 10px;
                box-sizing: border-box;
                overflow-y: scroll;
                .list-wrapper{
                    .el-form--inline{
                        .el-form-item__label{
                            padding:0;
                        }
                        .el-form-item{
                            margin-right: 0;
                        }
                    }
                }
            }
        }
    }
}



</style>
