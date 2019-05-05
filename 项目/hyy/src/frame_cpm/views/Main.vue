<template>
    <el-container class="bigBox">
            <el-aside :width="this.isCollapse ? '60px' : '136px'">
                <h1 class="project-title"><i class="el-icon-tickets"></i>慧影云</h1>
                <el-menu
                        @open="handleOpen()"
                        @close="handleClose()"
                        background-color="#21376B"
                        text-color="#fff"
                        active-text-color="#fff"
                        :default-active="defaultActive"
                        :defaultOpeneds="defaultOpenedsArr"
                >
                    <el-menu-item index="1">
                        <div class="gongzuo">
                            <i class="el-icon-menu"></i>
                            <span slot="title">工作台</span>
                            <div class="border"></div>
                        </div>
                    </el-menu-item>
                    <div class="xian"></div>
                    <el-submenu index="2">
                        <template slot="title">全部功能</template>
                        <el-menu-item
                                :index="(2-i)+''"
                                v-for="(item, i) in list"
                                class="first"
                                :key="i"
                        >
                            <div
                                    class="divTitle"
                            >
                                <i class="el-icon-menu" ></i>
                                <span slot="title" :index='(2-1-i)+""' >
                                {{item.menuName}}
                            </span>
                            </div>
                            <ul class="secondMenu">
                                <template  v-for="(sub, s) in item.submenu">
                                    <li v-if="sub.menuName" class="secondTitle" :key="s">
                                        {{sub.menuName}}
                                        <ul class="secondList" v-if="sub.submenu">
                                            <template  v-for="(su, b) in sub.submenu">
                                                <li v-if="su.menuName" :key="b">
                                                    <router-link
                                                            :to="su.resUrl?su.resUrl:su"
                                                            :title="su.menuName"
                                                    >{{ su.menuName }}
                                                    </router-link>
                                                </li>
                                            </template>
                                        </ul>
                                    </li>
                                </template>
                            </ul>
                        </el-menu-item>
                    </el-submenu>
                    <div class="xian"></div>
                    <el-submenu index="3">
                        <template slot="title">常用功能</template>
                    </el-submenu>
                </el-menu>
                <div class="button">
                    <router-link to="/sys/add">
                        <el-button>
                            <i class="el-icon-plus"></i>添加
                        </el-button>
                    </router-link>
                </div>
            </el-aside>
            <el-main>
                <el-header height="56px">
                    <!-- <div class="head-cinema-info">
                        <span class="el-icon-location-outline"></span>
                        <span class="head-cinema-name">北京自由人影城</span>
                    </div> -->
                    <Tabs :iframResult ="iframResult" :iframeList="iframeList"></Tabs>
                    <div class="header-user">
                        <div class="user-img"></div>
                        <el-menu
                                :default-active="activeIndex"
                                class="el-menu-demo"
                                mode="horizontal"
                                @select="handleSelect"
                        >
                            <el-submenu index="1">
                                <template slot="title" v-if="user">{{user}}</template>
                                <template slot="title" v-else>未登录</template>
                                <el-menu-item index="1-1">修改密码</el-menu-item>
                                <el-menu-item index="1-2">退出</el-menu-item>
                            </el-submenu>
                        </el-menu>
                    </div>
                </el-header>
                <div class="content-wrapper">
                    <router-view></router-view>
                </div>
                <el-dialog
                        title="修改密码"
                        :visible.sync="dialogVisible"
                        width="600px"
                        :before-close="closeDialog">
                    <div class="film-top" style="padding:20px;">
                        <el-form ref="resetForm" :model="resetForm" :rules="rules" label-width="148px" size="mini" class="film-search">
                            <el-form-item label="请输入原密码：" prop="password" style="width:560px;">
                                <el-input type="password" v-model="resetForm.password" placeholder="请输入新密码"></el-input>
                            </el-form-item>
                            <el-form-item label="请输入新密码：" prop="newPassword" style="width:560px;">
                                <el-input type="password" v-model="resetForm.newPassword" placeholder="请输入新密码"></el-input>
                            </el-form-item>
                            <el-form-item label="请再次输入新密码：" prop="reNewPassword" style="width:560px;">
                                <el-input type="password" v-model="resetForm.reNewPassword" placeholder="请再次输入新密码"></el-input>
                            </el-form-item>
                            <div class="btn-bottom" style="margin: 80px auto 0 auto; text-align:center;">
                                <el-button @click="closeDialog(false)">取 消</el-button>
                                <el-button type="primary" @click="querenDialog('resetForm')">确 定</el-button>
                            </div>
                        </el-form>
                    </div>
                </el-dialog>
            </el-main>
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
            defaultActive: "",
            defaultOpenedsArr:['2'],
            isCollapse: false,
            activeIndex:'1',
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
        this.user = str.loginName
        this.getData()
    },
    mounted() {
        this.$nextTick(()=>{
          if(localStorage.getItem('changeCode')){
            this.handleSelect(localStorage.getItem('changeCode'))
          }
        })
    },
    methods: {
        handleOpen(){

        },
        handleClose(){

        },
        handleSelect(index) {
            let _this = this;
            if (index === "1-1") {
                this.dialogVisible = true
                // this.resetForm.newPassword = null
                // this.resetForm.reNewPassword = null
                if(this.$refs.resetForm){
                    this.$refs.resetForm.clearValidate()
                }
            } else if (index === "1-2") {
                this.loginOutFun()
            }
        },
      loginOutFun(){
          let token =localStorage.getItem('token')
          let data ={
              token
          }
        this.$store.commit('updateLoginToken','')
        this.$store.commit('updateLoginUser','')
        localStorage.removeItem('token');
        let _this = this;
        _this.$cpmList.LoginOutApi(data)
          .then(ret => {
              if(ret.code == 200 ){
                 _this.$router.push("/login");

            }else{
                 _this.$message(ret.msg);
            }

          })
          .catch(() => {
               _this.$message('服务器繁忙，稍等再试');
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
                    modifyUserPassword(queryObj).then((ret)=>{
                      localStorage.removeItem('changeCode')
                        if(ret.result){
                            _this.success(ret.msg)
                            _this.dialogVisible = false
                            this.resetForm = {}
                        }else{
                            _this.error(ret.msg)
                        }
                    }).catch(()=>{

                    })
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

      },
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
    .el-menu--horizontal {
        text-align: center;
    }
    .bigBox {
            position: absolute;
            top: 0px;
            bottom: 0px;
            width: 100%;

            .el-header {
                height: 54px;
                padding-top: 16px;
                padding-left: 24px;
                box-sizing: border-box;
                box-shadow: 0 2px 7px 0 rgba(102, 102, 102, 0.1);
                .head-cinema-info {
                    display: inline-block;
                    height: 38px;
                    width: 140px;
                    color: #999;
                    font-size: 0px;
                    .el-icon-location-outline {
                        margin-right: 6px;
                        font-size: 14px;
                    }
                    .head-cinema-name {
                        font-size: 14px;
                        display: inline-block;
                        height: 100%;
                        line-height: 34px;
                    }
                }
                .header-user {
                    width: 158px;
                    height: 38px;
                    position: absolute;
                    top: 16px;
                    right: 0px;
                    display: flex;
                    z-index: 99;
                    justify-content: center;
                    .el-menu-demo {
                        border:0;
                    }
                    .user-img {
                        width: 28px;
                        height: 28px;
                        margin-left: -6px;
                        margin-right: 6px;
                        margin-top: 9px;
                        border-radius: 50%;
                        background-image: url("../assets/images/man.png");
                        background-size: contain;
                        background-repeat: no-repeat;
                    }
                    .el-dropdown-link {
                        padding-left: 15px;
                        cursor: pointer;
                        color: #666666;
                    }
                }
            }
            .el-aside {
                background: #21376b;
                color: #fff;
                overflow: visible;
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
                .work-space {
                    width: 100%;
                    height: 40px;
                    line-height: 40px;
                    text-align: center;
                    /* background-color: rgba( 59, 116, 255, 0.2);
                     color: #FFFFFF;*/
                    .el-icon-date{
                        margin-right: 10px;
                    }
                }
                .el-menu-item {
                    width: 100%;
                    height: 40px;
                    .gongzuo {
                        width: 135px;
                        height: 100%;
                        text-align: center;
                        line-height: 40px;
                        background-color: rgba(59,116,255,0.2) !important;
                        .border {
                            float: right;
                            width: 5px;
                            height: 40px;
                            background-color: #3B74FF;
                            visibility: visible;
                        }
                    }
                }
                .xian{
                    width: 80px;
                    height: 2px;
                    border: none;
                    background: #FFFFFF;
                    opacity: 0.2;
                    margin: 5px auto;

                }
                .divTitle {
                    width: 135px;
                }
                .first{
                    position: relative;
                    .secondMenu{
                        min-width: 200px;
                        height: 451px;
                        position: absolute;
                        left: 136px;
                        top: 0;
                        background-color: #fff;
                        box-shadow: 4px 4px 12px 0 rgba(0,0,0,0.20);
                        z-index: 99;
                        display: none;
                        overflow-y: scroll;
                        li.secondTitle{
                            color: #ccc;
                            font-size: 12px;
                            border-bottom: 1px solid #ccc;
                        }
                        li{
                            .secondList{
                                width: 400px;
                                display: flex;
                                justify-content: flex-start;
                                align-items: center;
                                flex-wrap: wrap;
                                li{
                                    color: #666;
                                    margin: 0 20px 0 10px;
                                    width: 100px;
                                    text-overflow: ellipsis;
                                    overflow: hidden;

                                }
                            }
                        }

                    }
                    &:hover {
                        background-color: #fff !important;
                        i{
                            color: #1278E1;
                        }
                        span{
                            color: #1278E1;
                        }
                        .secondMenu{
                            display: block;
                        }
                    }
                }
                .button {
                    width: 100%;
                }
            }
            .el-main {
                padding: 0;
                height: 100vh;
                .content-wrapper {
                    height: calc(100vh - 56px);
                    overflow: auto;
                    padding: 10px 10px 0 10px;
                    box-sizing: border-box;
                    .page-wrapper{
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
            // mmodal
            .el-dialog {
                border-radius: 5px;
                overflow: hidden;
                .el-dialog__header {
                    padding: 14px;
                    .el-dialog__title {
                        font-size: 18px;
                        color: black;
                    }
                }
                .el-dialog__body {
                  padding: 0 10px 10px 10px;
                }
            }

            .el-step.is-center .el-step__main {
                // text-align:left;
            }
            .el-step__icon.is-text {
                border-color: #303133;
                color: #303133;
            }
            .el-step__head.is-finish .el-step__icon.is-text,
            .forgot-pwd .content .el-step__head.is-success .el-step__icon.is-text {
                color: #ffa037;
                border-color: #ffa037;
                font-weight: bold;
            }
            .el-step__title.is-wait {
                color: #303133;
            }

            .show{
                display:block;
            }
            .list-wrapper {
                width: 100%;
                margin-top: 10px;
                border: 1px solid #ccc;
                .search-form{
                    padding: 24px 0 0 6px;
                    margin-bottom: 10px;
                    .mini-select-size{
                        width: 158px;
                    }
                    .search-padding{
                        margin-left:8px;
                        padding: 7px 16px;
                    }
                }
                .newBuild {
                    width: 100%;
                    height: 60px;
                    background-color: #ccc;
                    border-top: #8b8b8b;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                }
                .el-table.el-table--striped{
                    border: 1px solid #e5e5e5;
                    border-bottom:0;
                }
                .el-table--striped .el-table__body tr.el-table__row--striped td{
                    background:#f0f0f0;
                }
                .el-table--striped .el-table__body tr.el-table__row--striped.current-row td{
                    background:#e7ebff;
                }
                .el-table__body tr.current-row > td{
                    background:#e7ebff;
                }
                .el-table .cell{
                    padding-left: 8px;
                    padding-right: 8px;
                    span{
                        color:#333;
                        &.table-btn-mini{
                            color:#3B74FF;
                            cursor: pointer;
                            margin-right:6px;
                        }
                    }
                }
                .el-table th.is-leaf{
                    border-bottom: 1px solid #e5e5e5;
                    border-left: 1px solid #e5e5e5;
                    background: #e7ebff;
                    color: #333;
                }
                .el-table td {
                    border-left: 1px solid #e5e5e5;
                }
                .el-table th.is-leaf:nth-child(1), .el-table td:nth-child(1) {
                    border-left: 0;
                }
                .table {
                    width: 96%;
                    margin: 30px auto;
                }
            }
            .create-wrapper {
                width: 100%;
                height: 32px;
                margin-bottom:10px;
                // background-color: #ccc;
                // border-top: #8b8b8b;
                display: flex;
                justify-content: flex-end;
                align-items: center;
            }
            .has-gutter tr th{
                background: #F2F4FD;
                color: #333333;
                font-family: MicrosoftYaHei;
            }
            .content-line{
                clear:both;
                height: 1px;
                line-height: 1px;
                font-size:0;
                background: #ccc;
                margin:0 auto 20px;
            }

        }
        .el-menu {
            width: 100%;
            text-align: center;
        }
        .el-submenu .el-menu-item {
            min-width: 0px;
            width: 136px;
            height: 40px;
            line-height: 40px;

        }
        .el-icon--right {
            margin-left: 12px;
        }
        .el-submenu__title {
            width: 135px;
            height: 40px;
            line-height: 40px;
            opacity: 0.6;
            font-family: MicrosoftYaHei;
            color: #ffffff;
        }
        .el-menu-item,
        .el-submenu__title {
            padding: 0 16px 0 0 !important;
            text-align: center;
        }
        .el-menu--horizontal > .el-submenu .el-submenu__title {
            height: 43px;
            line-height: 43px;
            color: #909399;
            background-color: #fff !important;
            padding: 0 0 0 10px !important;
            margin-left: -6px;
        }
        .el-menu--popup {
            min-width: 116px;
        }

        .el-menu--horizontal .el-menu .el-menu-item:hover {
            background: #f5f5f5 !important;
        }
        .el-menu-item.is-active i,.el-menu-item.is-active span{
            color:#1278e1 !important
        }
        .el-menu-item{
            &.is-active{
                background-color: #fff!important;
                color:#1278e1!important;
            }
        }
        .el-menu-vertical-demo {
            width: 136px;
        }
        .el-aside{
            .el-button--default {
                display: flex;
                justify-content: space-around;
                background: transparent;
                opacity: 0.4;
                border: 1px solid #BCBCBC;
                border-radius: 4px;
                word-break: break-all;
                width: 80px;
                height: 32px;
                color: rgba(255, 255, 255, 0.9);
                // color: #666666;
                margin: 10px auto;
                // 默认按钮
            }
            .el-button--default:hover {
                background: #F5F5F5;
                border: 1px solid #bcbcbc;
                color: blue;
                opacity: 1;
            }
            .el-button--default.is-disabled {
                background: #F5F5F5;
                color: #BCBCBC;
            }
            .el-icon-plus {
                margin-right: 7px;
            }

        }

        .el-menu-item [class^="el-icon-"] {
            width: 13px;
            font-size: 13px;
            color: #fff;
        }
        .main-container .el-aside .el-menu-item {
            padding-left: 0px !important;
            i{
                color:#fff;
            }
        }
        .el-submenu__title:hover {
            background-color: rgba(59, 116, 255, 0.2) !important;
        }
        .el-menu--horizontal > .el-submenu.is-active .el-submenu__title {
            border: none;
        }

</style>
