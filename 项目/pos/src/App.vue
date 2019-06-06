<template>
  <div class="app-container">
    <router-view></router-view>
    <el-dialog title="操作提示" :visible.sync="show" width="50%">
      <div class="dialogContent">
        <div class="payByCard" v-if="type == 1">
          <div><i class="iconfont iconqingshuaqiatuikuan"></i></div>
          <div>请刷卡退款</div>
        </div>
        <div class="formlayer" v-else>
          <el-form ref="form" label-width="120px" >
            <el-form-item label="登录账号：">
              <el-input    :value="user" @input="changeUser($event)"></el-input>
            </el-form-item>
            <el-form-item label="登录密码：">
              <el-input  type="password"  :value="password"  @input="changePassword($event)"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="refor">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState,mapMutations,mapActions } from 'vuex'
import { EMPOWER_SET_SHOW,EMPOWER_SET_TYPE,EMPOWER_SET_USER,EMPOWER_SET_PASSWORD,GLOBAL_SET_NAV_DATAS } from 'types'
import { userAuthorize,getMenuTree } from 'http/apis'
export default {
  data() {
    return {
      modelUser:'',
      modelPassword:'',
      menuList:[],
      otherFlag: false,
      otherList: [],
      arr: [],
    };
  },
  computed:{
    ...mapState({
      show : state => state.empower.show,
      user : state => state.empower.user,
      password : state => state.empower.password,
      type : state => state.empower.type,
    })
  },
  methods:{
    ...mapMutations({
      EMPOWER_SET_SHOW,
      EMPOWER_SET_TYPE,
      EMPOWER_SET_USER,
      EMPOWER_SET_PASSWORD,
      GLOBAL_SET_NAV_DATAS,
    }),
    close(){
      this.changeUser('')
      this.changePassword('')
      this[EMPOWER_SET_SHOW](false);
      if(this.$route.name !='toHome') this.$router.go(-1)
    },
    changeUser(e){
      this[EMPOWER_SET_USER](e)
    },
    changePassword(e){
      this[EMPOWER_SET_PASSWORD](e)
    },
    async refor(){
      if(!this.user) return this.$message.warning('请输入账号!');
      if(!this.password) return this.$message.warning('请输入密码!')
      const data = await userAuthorize({
        userName : this.user,
        password : this.password
      })

      if(data.code != 200) return  this.$message.error(data.msg);
      this[EMPOWER_SET_SHOW](false);
    },
    getData() {
      getMenuTree().then(ret=>{
          if(ret&&ret.code==200){
          this.getArray(ret.data,4)
          if(this.arr.length>=0&&this.arr.length<=8){
              this.arr.forEach(item=>{
                  this.menuList.push(item)
              })
          }else{
              this.arr.forEach((item,index)=>{
              if(index<7){
                  this.menuList.push(item)
              }else{
                  this.otherFlag=true
                  this.otherList.push(item)
              }
              })
          }
          this[GLOBAL_SET_NAV_DATAS]({
          otherFlag :this.otherFlag,
          otherList : this.otherList,
          menuList : this.menuList,
          })
          }
      })
  },
  getArray(data,menuType) {
    for (var i in data) {
        if (data[i].menuType == menuType) {
        this.arr.push(data[i])
        } else {
        this.getArray(data[i].submenu, menuType);
        }
    }
  },
  },
  created() {
    this.getData()
  },
  mounted() {}
};
</script>

<style lang="scss">
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
dir,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
font,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td {
  margin: 0px;
  padding: 0px;
  border: 0px;
  outline: 0;
  font-size: 14px;
  vertical-align: baseline;
  background: transparent;
  user-select: none;
}
html,
body,
.app-container {
  width: 100%;
  height: 100%;
}
body {
  margin: 0px;
  padding: 0px;
  font-family: "Microsoft YaHei",微软雅黑,"Microsoft JhengHei",华文细黑,STHeiti,MingLiu !important;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
  background: #fff;
}
ul,
ol,
ul {
  list-style: none;
}
blockquote,
q {
  quotes: none;
}
blockquote:before,
blockquote:after,
q:before,
q:after {
  content: "";
  content: none;
}
:focus {
  outline: 0;
  -moz-outline-style: none;
}
ins {
  text-decoration: none;
}
del {
  text-decoration: line-through;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
}
img {
  vertical-align: middle;
  border: 0;
}
address,
caption,
cite,
code,
dfn,
em,
th,
var {
  font-weight: normal;
  font-style: normal;
}
select {
  border: 1px solid #b5bcc2;
}
input,
textarea,
select {
  font-family: Arial;
  vertical-align: middle;
}
input[type="checkbox"],
input[type="radio"] {
  top: -2px;
  *top: 0px;
}
.clear {
  clear: both;
  height: 0;
  overflow: hidden;
}
a {
  text-decoration: none;
  cursor: pointer;
}
a {
  outline-style: none;
  color: #333;
  text-decoration: none;
}
a:visited {
}
a:active {
}
a:hover {
  text-decoration: none;
  color: #5ca7ff;
}
.clearfix {
}
.clearfix:after {
  content: ".";
  height: 0px;
  font-size: 0px;
  clear: both;
  display: block;
  visibility: hidden;
}
.el-submenu[class^="fa"] {
  vertical-align: baseline;
  margin-right: 10px;
}
.el-menu-item [class^="fa"] {
  vertical-align: baseline;
  margin-right: 10px;
}
.toolbar {
  background: #f2f2f2;
  padding: 10px;
  /*  //border:1px solid #dfe6ec;*/
  margin: 10px 0px;
}
.toolbar .el-form-item {
  margin-bottom: 10px;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
.app-container {
  // 重置elementUI分页样式
  .page-wrap {
    padding: 24px;
    text-align: center;
    .el-pagination {
      display: inline-block;
      .el-input__inner {
        height: 28px;
        line-height: 28px;
      }
      .el-input__icon {
        line-height: 28px;
      }
    }
  }
}
.action_start {
  color: #6ed200;
}
.action_stop {
  color: #ff3c00;
}
.action_more {
  color: 808080;
}

.el-tooltip__popper.is-dark {
    background: #212121bf;
}

// 重写框架样式
.el-button {
}
// 默认按钮
// .el-button--default {
//   background: #FFFFFF;
//   border: 1px solid #3B74FF;
//   color: #3B74FF;
// }
// .el-button--default:hover {
//   background: #F5F5F5;
//   border: 1px solid #BCBCBC;
//   color: #666666;
// }
// .el-button--default.is-disabled {
//   background: #F5F5F5;
//   color: #BCBCBC;
// }
// 主要按钮
.el-button--primary {
  background: #3B74FF;
  color: #FFFFFF;
}
.el-button--primary:hover {
  background: #0F55FF;
  color: #FFFFFF;
}
.el-button--primary.is-disabled {
 
}
// 主要按钮 空心
.el-button--primary.is-plain {
  background: #FFFFFF;
  border: 1px solid #3B74FF;
  color: #3B74FF;
}
.el-button--primary.is-plain:hover {
  background: #FFFFFF;
  border: 1px solid #0F55FF;
  color: #0F55FF;
}
.el-button--primary.is-plain.is-disabled {
  background: #FFFFFF;
  border: 1px solid #3B74FF;
  color: #3B74FF;
}

// 表格中的按钮
.el-table .el-button {
  font-size: 12px;
  border-radius: 2px;
}
.el-table .el-button--primary {
  background: #FFFFFF;
  border: 1px solid #3B74FF;
}
.el-table .el-button--primary:hover {
  background: #F5F5F5;
  border: 1px solid #BCBCBC;
  color: #666666;
}
// selected 样式要根据自己的操作 js动态添加
.el-table .el-button--primary.selected {
  background: #3B74FF;
  color: #FFFFFF;
}
.el-table .el-button--default:hover {
  background: #FFFFFF;
  border: 1px solid #BCBCBC;
}
// selected 样式要根据自己的操作 js动态添加
.el-table .el-button--default.selected {
  background: #3B74FF;
  border-radius: 2px;
  color: #FFFFFF;
}

.el-select{
  .el-input__inner{
    border-color: #3B74FF;
  }
}
// 输入框
.el-input__inner {
  // height: 32px;
  border: 1px solid #BCBCBC;
  // line-height: 32px;
} 
.el-input__inner:focus {
  border-color:#3B74FF;
}
// 下拉框内的图标
.el-input__icon {
  // line-height: 32px;
}
.el-table .el-input__inner {
  height: 20px;
  line-height: 20px;
}
.el-table .el-input__icon {
  line-height: 20px;
}
// dialog弹窗
.main-container .el-dialog .el-dialog__header {
      padding: 20px 20px 10px 20px !important;
}
.main-container .el-dialog .el-dialog__body {
        padding: 30px 20px !important;
}
.el-dialog__title {
  font-size: 14px;
}
.el-dialog__footer {
  text-align: center;
}


// 排片提示信息
.tool-tips {
  div {
      font-size: 12px;
      margin-bottom: 5px;
      span {
        color:#FF8900;
      }
  }
  div:nth-last-of-type(1) {
    margin-bottom: 0;
  }
}
.icon{
  width: 1em; height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
