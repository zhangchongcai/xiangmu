<template>
    <el-container>
        <el-aside :width="this.isCollapse ? '60px' : '136px'">
            <h1 class="project-title"></h1>
            <div class="gongzuo">
                <i class="iconfont icon-caidanlan-gongzuotai" style="font-size: 14px;color:#fff;"></i>
                <span class="iconfont" slot="title">工作台</span> <!--@click="getPlatform"-->
                <div class="border"></div>
            </div>
            <div class="xian"></div>
            <el-menu
                    style="width: 104%"
                    @select="handleSelect"
                    background-color="#21376B"
                    text-color="#fff"
                    active-text-color="#fff"
                    :defaultOpeneds="defaultOpenedsArr"
            >
                <div class="second">
                    <el-submenu index="2">
                        <template slot="title">
                            <span style="margin-left: 10px">全部功能</span>
                        </template>
                        <el-menu
                                :collapse="true"
                                style="width:104%;background-color:#21376b"
                        >
                            <el-submenu
                                    :index="'2-'+i"
                                    v-for="(item, i) in list"
                                    :key="i"
                            >
                                <template slot="title">
                                    <p style="width:112%; text-overflow: ellipsis;white-space: nowrap; overflow: hidden;margin-left: 10px;">
                                        <i :class="'iconfont '+item.icon"
                                           style="letter-spacing: 2px;color:#fff;font-size: 14px;">
                                            {{item.menuName}}
                                        </i>
                                    </p>
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
                                        <div style="display:flex;flex-wrap: wrap;border-bottom:1px solid #ccc;width:580px">
                                            <el-menu-item
                                                    :index="'2-'+i+'-'+s+'-'+b"
                                                    v-if="sub.submenu.length!=0"
                                                    v-for="(su, b) in sub.submenu"
                                                    :key="b"
                                                    style="width:190px;text-overflow: ellipsis;overflow: hidden"
                                            >
                                                <router-link
                                                        @click.native="toBreadCrumb(su)"
                                                        v-if="su.menuName"
                                                        :to="su.resUrl?su.resUrl:''"
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
                        <template slot="title">
                            <span style="margin-left: 10px">常用功能</span>
                        </template>
                        <el-menu-item style="height:40px;line-height:40px;min-width: 0; padding: 0 0 0 33px"
                                      :index="'3-'+item.seq" v-for="(item, id) in commonList" :key="id">
                            <div class="divTitle" @click="selectRoutes(item)">
                                <i class="yuan"></i>
                                <span slot="title"> {{item.resourceName}}</span>
                            </div>
                        </el-menu-item>
                    </el-submenu>
                </div>
            </el-menu>
            <div class="button">
                <el-button icon="el-icon-plus" @click="toComFun">添加</el-button>
            </div>
        </el-aside>
        <el-container>
            <el-header>
                <!-- <div class="head-cinema-info">
                    <span class="el-icon-location-outline"></span>
                    <span class="head-cinema-name">北京自由人影城</span>
                </div> -->
                <Tabs :obj="obj"></Tabs>
                <div class="header-user">
                    <div class="tags-ctrl">
                        <span
                                class="el-icon-arrow-left"
                                @click="scroll(-1)"
                        >
                        </span>
                        <span
                                class="el-icon-arrow-right"
                                @click="scroll(1)"
                        >
                        </span>
                    </div>
                    <div class="user-img"></div>
                    <!--<el-avatar shape="circle" size="small" src=""></el-avatar>-->
                    <div class="selectType">
                        <el-dropdown trigger="click" @command="handleCommand">
                          <span class="el-dropdown-link">
                            <span class="nameTitle">{{user?user:'未登录'}}</span>
                            <i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="a">修改密码</el-dropdown-item>
                                <el-dropdown-item command="b">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </el-header>
            <el-main>
                <el-breadcrumb class="breadNav" separator-class="el-icon-arrow-right" v-if="level.level3">
                    <el-breadcrumb-item>{{level.level1}}</el-breadcrumb-item>
                    <el-breadcrumb-item>{{level.level2}}</el-breadcrumb-item>
                    <el-breadcrumb-item>{{level.level3}}</el-breadcrumb-item>
                </el-breadcrumb>
                <div class="content-wrapper">
                    <keep-alive>
                        <router-view v-if="$route.meta.keepAlive"></router-view>
                    </keep-alive>
                    <router-view v-if="!$route.meta.keepAlive"></router-view>
                </div>
                <el-dialog
                        width="600px"
                        title="修改密码"
                        :visible.sync="dialogVisible"
                        :before-close="closeDialog">
                    <div class="film-top" style="padding:0 20px">
                        <el-form ref="resetForm" :model="resetForm" :rules="rules" label-width="150px" size="mini"
                                 class="film-search">
                            <el-form-item label="请输入原密码：" prop="password" style="width:460px;">
                                <el-input type="password" v-model="resetForm.password" placeholder="请输入新密码"></el-input>
                            </el-form-item>
                            <el-form-item label="请输入新密码：" prop="newPassword" style="width:460px;">
                                <el-input type="password" v-model.trim="resetForm.newPassword"
                                          @input="getLvl(resetForm.newPassword)" placeholder="请输入新密码"></el-input>
                                <div class="progress-bar_wrap" v-show="passwordlevel>0">
                                    <div class="progress-bar_item"
                                         :class="[ {'strengthLv1': passwordlevel == 1}, {'strengthLv2': passwordlevel == 2}, {'strengthLv3': passwordlevel == 3}]"></div>
                                </div>
                                <em v-show="passwordlevel==1">弱</em>
                                <em v-show="passwordlevel==2">中</em>
                                <em v-show="passwordlevel==3">强</em>
                            </el-form-item>
                            <el-form-item label="请再次输入新密码：" prop="reNewPassword" style="width:460px;">
                                <el-input type="password" v-model="resetForm.reNewPassword"
                                          placeholder="请再次输入新密码"></el-input>
                            </el-form-item>
                            <div class="btn-bottom" style="text-align:center;margin-top: 50px">
                                <el-button type="primary" @click="querenDialog('resetForm')">确 定</el-button>
                                <el-button @click="closeDialog(false)">取 消</el-button>
                            </div>
                        </el-form>
                    </div>
                </el-dialog>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
  import utils from '../util/uiUtils';
  import navTab from "../components/Tabs/Tabs"
  import CryptoJS from 'crypto-js'
  import {modifyUserPassword, menuList, getUrl, commonFunctions} from 'frame_cpm/http/interface.js'

  export default {
    data() {
      var equalPassword = (rule, value, callback) => {
        console.log(this.password)
        if (value != this.password) {
          callback(new Error('原密码输入错误'));
        } else {
          callback();
        }
      };
      var validatePass1 = (rule, value, callback) => {
        if(value){
          if (value.length < 6 || value.length > 20) {
            callback(new Error('请输入6-20位密码'));
          }
        }
        if (value === this.resetForm.password) {
          callback(new Error('新密码不应与原密码相同'));
        } else {
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.resetForm.newPassword) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        // defaultActive: "",
        passwordlevel: 0,
        rules: {
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            // {validator: equalPassword, trigger: 'blur'}
          ],
          newPassword: [
            {required: true, message: '请输入新密码', trigger: 'blur'},
            {validator: validatePass1, trigger: ['blur', 'change']},
            {validator: validatePass2, trigger: 'blur'},
          ],
          reNewPassword: [
            {required: true, message: '请再次输入新密码', trigger: 'blur'},
            {validator: validatePass1, trigger: 'blur'},
            {validator: validatePass2, trigger: 'blur'},
          ]
        },
        obj: {},
        breadFlag: false,
        defaultOpenedsArr: ['2'],
        isCollapse: false,
        list: [],
        secondList: [],
        request: [],
        url: '',
        iframResult: '',
        iframeList: [],
        iframFlag: 0,
        user: '',
        resetForm: {
          password: '',
          newPassword: '',
          reNewPassword: '',
        },
        dialogVisible: false,
        ico: '',
        commonList: [],
        key: ''
      }
    },
    created() {
      let str = JSON.parse(localStorage.getItem('user'))
      if (str) {
        this.user = str.fullName
      }
      this.getData()
      this.getFunctionList()
    },
    mounted() {
      this.$nextTick(() => {
        if (localStorage.getItem('changeCode')) {
          this.handleCommand(localStorage.getItem('changeCode'))
        }
      })
      this.$eventHub.$on('listFlag', (val) => {
        if (val) {
          this.commonList = val.commonList
        }
      })
    },
    computed: {
      level() {
        return this.$store.state.commonData.level
      },
    },
    beforeDestroy() {
      this.$eventHub.$off("scrollTab")
      this.$eventHub.$off("listFlag")
    },
    methods: {
      selectRoutes(urlObj) {
        let trurl = urlObj.url ? urlObj.url : '';
        let turl = trurl
        this.$router.push(turl)
      },
      getFunctionList() {
        let _this = this
        commonFunctions()
          .then(ret => {
            if (ret && ret.code == 200) {
              this.commonList = ret.data
            } else {
              this.error(ret.msg)
            }
          })
          .catch(() => {

          });
      },
      toComFun() {
        this.$router.push('/sys/commFun')
      },
      getLvl(txt) {
        //默认级别是0
        let levelNUm = 0
        //判断这个字符串中有没有数字
        if (/[0-9]/.test(txt)) {
          levelNUm++;
        }
        //判断字符串中有没有字母
        if (/[a-zA-Z]/.test(txt)) {
          levelNUm++;
        }
        //判断字符串中有没有特殊符号
        if (/[^0-9a-zA-Z_]/.test(txt)) {
          levelNUm++;
        }
        if (!txt) {
          this.passwordlevel = 0;
        } else if (txt && txt.length < 6) {
          this.passwordlevel = 1;
        } else {
          this.passwordlevel = levelNUm;
        }
      },
      toBreadCrumb(obj) {
        this.$store.commit('getLevel', obj)
        this.$eventHub.$emit('tabObj', obj)
        this.$store.commit("tagNav/addRecentVisits", obj)
      },
      getPlatform() {
        this.$router.push('/home')
      },
      scroll(val) {
        this.$eventHub.$emit("scrollTab", val)
      },
      handleSelect(key) {
        if (key == 1) {
          getUrl().then(ret => {
            if (ret.code == 200) {
              this.$router.push(ret.data)
            }
          }).catch(() => {
          })
        }
      },
      handleCommand(command) {
        if (command == 'a') {
          this.dialogVisible = true
          if (this.$refs.resetForm) {
            this.$refs.resetForm.clearValidate()
          }
        } else if (command == 'b') {
          this.loginOutFun()
        }
      },
      loginOutFun() {
        let _this = this;
        _this.$cpmList.LoginOutApi()
          .then(ret => {
            if (ret.code == 200) {
              this.$store.commit('updateLoginTokenCPM', '')
              this.$store.commit('updateLoginUserCPM', '')
              this.$store.state.tagNav.openedPageList = []
              this.$store.state.commonData.level = {}
              localStorage.clear();
              sessionStorage.clear();
              _this.$router.push("/login");
            } else {
              _this.error(ret.msg);
            }

          })
          .catch(() => {
            _this.error('网络繁忙，稍等再试');
          });
      },
      closeDialog() {
        this.resetForm = {
          password: '',
          newPassword: '',
          reNewPassword: '',
        },
          this.dialogVisible = false
        localStorage.removeItem('changeCode')
        this.passwordlevel = 0
      },
      getUUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
        })
      },
      querenDialog(formName) {
        let _this = this
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let userObj = JSON.parse(localStorage.getItem('user'))
            let queryObj = {}
            let UUID = this.getUUID()
            let UUIDConcatString = userObj.loginName + UUID
            let signkey = UUIDConcatString.substr(0, 16)
            this.key = CryptoJS.enc.Utf8.parse(signkey);
            this.$store.commit('updateUserKey', UUID.substr(0, 16));
            var password = CryptoJS.enc.Utf8.parse(this.resetForm.password);
            var encrypted = CryptoJS.AES.encrypt(password, this.key, {
              mode: CryptoJS.mode.ECB,
              padding: CryptoJS.pad.Pkcs7
            });
            var encryptedPwd = encrypted.toString();
            var newPassword = CryptoJS.enc.Utf8.parse(this.resetForm.newPassword);
            var newEncrypted = CryptoJS.AES.encrypt(newPassword, this.key, {
              mode: CryptoJS.mode.ECB,
              padding: CryptoJS.pad.Pkcs7
            });
            var newEncryptedPwd = newEncrypted.toString();
            queryObj.loginName = userObj.loginName
            queryObj.password = encryptedPwd
            queryObj.newPassword = newEncryptedPwd
            modifyUserPassword(queryObj).then((ret) => {
              localStorage.removeItem('changeCode')
              if (ret && ret.code == 200) {
                _this.success('密码修改成功')
                _this.$store.commit('changePwd', this.resetForm.password)
                _this.dialogVisible = false
                this.resetForm = {}
                this.passwordlevel = -1
              } else {
                _this.error(ret.msg)
              }
            }).catch(() => {
            })
          } else {
            return false;
          }
        })
      },
      getData() {
        //从用户信息中拿取菜单
        let self = this;
        let token = sessionStorage.getItem('token')
        let data = {
          token
        }
        menuList(data).then((ret) => {
          if (ret && ret.code == 200) {
            if (ret.data.length == 0) {
              this.error('该用户下暂无授权产品资源')
            }
            localStorage.setItem('leftTreeList', JSON.stringify(ret.data))
            this.$store.commit('updateMenus', ret.data)
            let level1Arr = ret.data.map(item => {
              return {'name': item.menuName, 'id': item.id}
            })
            localStorage.setItem('level1Arr', JSON.stringify(level1Arr))
            let arr = ret.data.map(item => {
              return item.submenu.map(item => {
                return {'name': item.menuName, 'id': item.id, 'parentId': item.parentId}
              })
            })
            let level2Arr = []
            for (var i = 0; i < arr.length; i++) {
              for (var j = 0; j < arr[i].length; j++) {
                level2Arr.push(arr[i][j]);
              }
            }
            localStorage.setItem('level2Arr', JSON.stringify(level2Arr))
            let level3Arr = utils.getMenuTree(ret.data, 'submenu')
            localStorage.setItem('level3Arr', JSON.stringify(level3Arr))
            self.list = ret.data
            ret.data.forEach(s => {
              if (s.productCode === 'RPT') {
                s.submenu[0].submenu.map(item => {
                  return item.resUrl = item.resUrl.replace('?id=', '=')
                })
              }
            })
          } else {
            this.error(ret.msg)
          }
        }).catch((error) => {

        })

      }
    },
    name: "mainCon",
    components: {
      Tabs: navTab,
      // Menu: menu,
    }
  };
</script>
<style lang="scss">
    .el-menu--popup-right-start {
        margin-left: 0 !important;
    }

    .el-breadcrumb {
        width: 100%;
        height: 24px;
        line-height: 12px;
        padding: 10px 24px 0;
        box-sizing: border-box;

        .el-breadcrumb__item:nth-child(1),
        .el-breadcrumb__item:nth-child(2) {
            .el-breadcrumb__inner {
                font-family: "MicrosoftYaHei";
                font-size: 12px;
                color: #bcbcbc;
            }
        }

        .el-breadcrumb__item:nth-child(3) {
            .el-breadcrumb__inner {
                font-family: "MicrosoftYaHei";
                font-size: 12px;
                color: #3b74ff;

                /*&:hover {*/
                /*cursor: pointer;*/
                /*}*/
            }
        }
    }

    .el-menu-item:hover, .el-menu-item:focus {
        background-color: #fff;
    }

    /*.el-menu--popup-right-start {
        margin-left: 8px;
    }*/
    .el-submenu__title {
        height: 40px;
        line-height: 40px;
    }

    .el-form-item__label {
        font-size: 12px;
    }

    .el-dialog__title {
        font-weight: bolder;
    }

    .form {
        background: #f5f5f5;

        .el-form--inline .el-form-item__label {
            padding: 0 16px 0 0 !important;
        }

        .el-input--mini .el-input__inner {
            height: 32px;
            line-height: 32px;
        }

        .el-button {
            height: 32px;
            width: 80px;
        }

        .el-form-item--mini.el-form-item {
            margin-right: 32px;
        }

        .el-form {
            padding: 24px 0 12px 24px;
        }

    }

    .diaWindow {
        .el-tree {
            height: 430px;
            overflow: scroll;
        }

        .el-table {
            width: 96%;
            height: 430px;
            margin-left: 8px;
            overflow: scroll;
        }

        .el-dialog {
            margin-top: 5vh !important;
            height: 576px;
        }

        .el-dialog__body {
            padding: 0px 10px;

        }

        .divider {
            width: 96%;
            margin: 0 auto 20px;
            height: 0;
            border-bottom: 1px solid #E5E5E5;
        }

        .el-dialog__footer {
            padding: 0;
        }

        .demo-input-suffix {
            margin: 0px 0 10px 10px;

        }
    }
</style>
<style lang='scss' scoped>
    .progress-bar_wrap {
        width: 270px;
        height: 5px;
        background: #F6F6FA;
        display: inline-block;
        vertical-align: middle;
        overflow: hidden;
        border-radius: 5px;

        .progress-bar_item {
            height: 100%;
            float: left;
            visibility: hidden;
            transition: background-color .2s, visisility .1s;
        }

        .strengthLv1 {
            width: 33.33%;
            background: #f56c6c;
            visibility: visible;
        }

        .strengthLv2 {
            width: 66.66%;
            background: #f9ae35;
            visibility: visible;
        }

        .strengthLv3 {
            width: 100%;
            // background: #00EE00;
            background: #67c23a;
            visibility: visible;
        }
    }

    .el-container {
        height: 100%;
        width: 100%;

        .el-menu {
            border: 0;
        }

        .el-aside {
            height: 100%;
            line-height: 100%;
            background: #21376b;
            color: #fff;
            overflow: hidden;

            .el-menu {
                max-height: 80%;
                overflow: scroll;

                .el-submenu {
                    overflow: hidden;
                }

                .el-submenu__title:hover {
                    background-color: #fff;

                    i {
                        color: #3b74ff !important;
                    }

                }

                .divTitle {
                    width: 95%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    letter-spacing: 2px;

                    span {
                        font-size: 14px;
                    }

                    &:hover {
                        .yuan {
                            border: 1px solid #3b74ff;
                        }

                        span {
                            color: #3b74ff;
                        }
                    }

                    .yuan {
                        display: inline-block;
                        width: 6px;
                        height: 6px;
                        border-radius: 4px;
                        border: 1px solid #FFF;
                        cursor: pointer;
                    }
                }

                .yuan {
                    display: inline-block;
                    width: 6px;
                    height: 6px;
                    border-radius: 4px;
                    border: 1px solid #fff;
                    margin-right: 6px;
                }

            }

            .project-title {
                width: 84px;
                margin: 24px auto 20px;
                height: 40px;
                background-image: url("../assets/images/mainLogo.png");
                background-size: cover;
            }

            .gongzuo {
                width: 100%;
                height: 40px;
                text-align: center;
                line-height: 40px;
                font-size: 14px;
                letter-spacing: 2px;
                background-color: rgba(59, 116, 255, 0.2) !important;

                span {
                    font-size: 14px;
                }

                .border {
                    float: right;
                    width: 5px;
                    height: 40px;
                    background-color: #3b74ff;
                }
            }

            .button {
                width: 100%;
                text-align: center;
                height: 50px;
                background-color: #21376b;
                line-height: 50px;

                .el-button--default {
                    color: #fff;
                    background-color: #21376b;

                    &:hover {
                        color: #1278E1;
                        background-color: #fff;
                    }
                }

            }

            .el-menu-item {
                /*width: 100%;*/
                height: 40px;
                /*.gongzuo {
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    line-height: 40px;
                    font-size:14px;
                    letter-spacing: 2px;
                    background-color: rgba(59, 116, 255, 0.2) !important;
                    span{
                        font-size:14px;
                    }
                    .border {
                        float: right;
                        width: 5px;
                        height: 40px;
                        background-color: #3b74ff;
                    }
                }*/
            }

            .xian {
                width: 90px;
                height: 2px;
                border: none;
                background: #FFFFFF;
                opacity: 0.2;
                margin: 8px auto;

            }

        }

        .el-container {
            .el-header {
                height: 60px;
                line-height: 60px;
                box-sizing: border-box;
                box-shadow: 0 2px 7px 0 rgba(102, 102, 102, 0.1);
                padding: 0 24px;
                z-index: 99;

                .header-user {
                    max-width: 180px;
                    height: 45px;
                    line-height: 45px;
                    margin-top: 15px;
                    float: right;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .tags-ctrl {
                        width: 45px;
                        height: 50px;
                        line-height: 50px;

                        span {
                            &:hover {
                                color: blue;
                                font-weight: bolder;
                                font-size: 16px;
                            }
                        }
                    }

                    .user-img {
                        width: 25px;
                        height: 25px;
                        margin-right: 10px;
                        border-radius: 50%;
                        display: inline-block;
                        background-image: url("../assets/images/man.png");
                        background-size: contain;
                        background-repeat: no-repeat;
                    }

                    .selectType {
                        max-width: 122px;
                        height: 45px;

                        .el-dropdown {
                            width: 100%;
                            height: 45px;
                            white-space: nowrap;

                            .nameTitle {
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                                max-width: 84px;
                                display: inline-block;
                                text-align: right;
                                margin-right: 15px;
                            }

                            .el-icon-arrow-down {
                                position: fixed;
                                top: 32px;
                                right: 24px;
                            }
                        }
                    }

                }
            }

            .el-main {
                overflow-y: hidden;
                padding: 0px;
                height: calc(100% - 60px);

                .content-wrapper {
                    width: 100%;
                    height: calc(100% - 34px);
                    box-sizing: border-box;
                    padding: 24px 24px 0;
                    overflow-y: auto;

                }
            }
        }
    }


</style>
