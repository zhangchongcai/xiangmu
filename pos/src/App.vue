<template>
  <div id="app" class="app-container">
    <router-view></router-view>
    <el-dialog title="操作提示" :visible.sync="show" width="50%">
      <div class="dialogContent">
        <div class="payByCard" v-if="type == 2">
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
    <UseInfo :isShow="useInfoShow" :value="useInfoValue" @useInfoSureClick="useInfoSureClick"></UseInfo>
  </div>
</template>

<script>
import { mapState,mapMutations,mapActions } from 'vuex'
import { EMPOWER_SET_SHOW,EMPOWER_SET_TYPE,EMPOWER_SET_USER,EMPOWER_SET_PASSWORD,GLOBAL_SET_NAV_DATAS,GLOBAL_USER_CONFIG, SAVE_ALL_PAY,GLOBAL_PAY_SORT } from 'types'
import { VM_LOGIN_SET_MENU , VM_AUTHORIZATION_CALLBACK,VM_AUTHORIZATION_CLOSE,VM_ON_SORT_GET_PAY_LIST,VM_ON_LOGIN_UESINFO} from 'types/vmOnType'
import { userAuthorize,getMenuTree,userGetConfig, payType,getUseInfo } from 'http/apis'
import UseInfo from 'components/useInfo/userInfo'
export default {
  components:{
    UseInfo
  },
  data() {
    return {
      modelUser:'',
      modelPassword:'',
      menuList:[],
      otherFlag: false,
      otherList: [],
      arr: [],
      useInfoShow:false,
      useInfoValue:null,
    };
  },
  computed:{
    ...mapState({
      show : state => state.empower.show,
      user : state => state.empower.user,
      password : state => state.empower.password,
      type : state => state.empower.type,
      typesCode: state => state.empower.typesCode,
      configData : state => state.config.configData,
    })
  },
  watch: {
    $route() {
            let token = localStorage.getItem('token')
            if(token) {
              this.getAllPayType()
            }  
          }
  },
  methods:{
    ...mapMutations({
      EMPOWER_SET_SHOW,
      EMPOWER_SET_TYPE,
      EMPOWER_SET_USER,
      EMPOWER_SET_PASSWORD,
      GLOBAL_SET_NAV_DATAS,
      GLOBAL_USER_CONFIG,
      SAVE_ALL_PAY,
      GLOBAL_PAY_SORT
    }),
    async getAllPayType() {
                const payTypeData = await payType()
                if(payTypeData.code == 200) {
                    this.SAVE_ALL_PAY(payTypeData.data)
                }else {
                   this.$message({
                            showClose: true,
                            message: payTypeData.data && payTypeData.data.length == 0 ? '暂无支付方式数据' : payTypeData.msg,
                            type: 'error'
                        }); 
                }
            },
    close(){
      this.changeUser('')
      this.changePassword('')
      this[EMPOWER_SET_SHOW]({
        show:false,
        type:'',
      });
      // if(this.$route.name !='toHome') this.$router.go(-1)
      this.$vm.$emit(VM_AUTHORIZATION_CLOSE)

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
        cardCode: '',
        userName: this.user,
        passWord: this.password,
        type:this.type,
        funcCode : this.typesCode,

      })

      if(data.code != 200) return  this.$message.error(data.msg);
      this.$message.success(data.msg)
      this.$vm.$emit(VM_AUTHORIZATION_CALLBACK,data)
      this[EMPOWER_SET_SHOW]({
        show:false,
        type:'',
      });
    },
    getData() {
      this.otherList = [];
      this.menuList = [];
      this.arr = [];
      this.otherFlag = false;
      getMenuTree().then(ret=>{
          if(ret&&ret.code==200){
          this.$addHomeNavIcon(ret.data);
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
  async userGetConfig(){
    let data = await userGetConfig()
    if(data.code != 200) return this.$message.error(data.msg)
    this[GLOBAL_USER_CONFIG](data.data)
  },
  getArray(data,menuType) {
    // console.log(111)
    let counterTypeValue = this.configData.counter_type_value;
    for (let i in data) {
        if (data[i].menuType == menuType) {
          switch(data[i].menuCode){
            case  'csm_pos_extract_fund_authorize' :
            case  'csm_pos_extract_fund_regulation' :
            case  'csm_pos_open_money_box': //开钱箱
            case  'csm_pos_handsel' : //赠送
            case  'csm_pos_reportloss' : //报损
            case  'csm_pos_reprint_voucher': //重打印凭证
            case  'csm_pos_preparemeals_register': //备餐登记
            case  'csm_pos_preparemeals_detailed'://备餐明细
            case  'csm_pos_vip_write_card': //会员卡写卡
            case  'csm_pos_sale_tictket_roll': //票券销售
            case  'csm_pos_print_tickets': //票券批量打印
            case  'csm_pos_sale_ranking': //我的销售排名
                break
            case  'csm_pos_pay_type_seq': //支付排序
                this[GLOBAL_PAY_SORT](true)
                break;
            case  'csm_pos_sale_ticket_manager' : //影票
                if(counterTypeValue == 'goods') break;
                this.arr.push(data[i])
                break;
            case 'csm_pos_sale_goods_manager': //卖品
                if(counterTypeValue == 'movie') break;
                this.arr.push(data[i])
                break;
            default :
                this.arr.push(data[i])
                break;
          }
        } else {
        this.getArray(data[i].submenu, menuType);
        }
    }
  },
  //请求领用信息
    async requestUseInfo(val){
      let res = await getUseInfo({current:1,size:999,workTimeUid:val})
      let data = res.data || {}
      if(res.code == 200){
          this.useInfoShow = true
          this.useInfoValue = data
      }
    },
    useInfoSureClick(){
        this.useInfoShow = false
      },
  },
  created() {
    setTimeout(() => {
       document.body.removeChild(document.getElementById('loadingImg'))
    }, 1500)
    if(localStorage.getItem('token')){
      this.getData()
      this.userGetConfig()
    }
  },
  mounted() {
    this.$vm.$on(VM_LOGIN_SET_MENU,()=>{
      this.getData()
      this.userGetConfig()
    })
    this.$vm.$on(VM_ON_SORT_GET_PAY_LIST,()=>{
      this.getAllPayType()
    })
    this.$eventHub.$on(VM_ON_LOGIN_UESINFO, (val) => {
      console.log(313131)
        if(val != null){
            this.requestUseInfo(val)
        }
      }) 
  }
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
  -webkit-user-select: none;
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
  font-family: "MicrosoftYaHei",微软雅黑,"Microsoft JhengHei",华文细黑,STHeiti,MingLiu !important;
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
.el-dialog__headerbtn .el-dialog__close {
    color: #909399;
    font-size: 1.24vw;
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
  border-color:#3B74FF ;
  color:#3B74FF ;
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
