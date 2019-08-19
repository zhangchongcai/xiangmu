<template>
  <div class="role-list-wrap-1">
    <div class="modal-search">
      <div class="search-wrap ">
        <span>上级组织：</span>
        <el-input v-model.trim="chosenOneOrg.text" @focus="openOrgList()" prefix-icon="el-icon-edit" placeholder="请输入内容"></el-input>
      </div>
      <div class="search-wrap plian">
        <span>组织名称：</span>
          <el-input v-model.trim="name" placeholder="请输入内容" clearable></el-input>
          <!--<div class="childen-search">-->
              <!--<el-input v-model="remark" placeholder="备注信息" clearable></el-input>-->
          <!--</div>-->
      </div>
      <!--<div class="addOrg-wrap">-->
        <!--<el-button type="text" @click='addOrgInforFun'>-->
        <!--<i class="iconfont icon-neiye-tianjia"></i>-->
        <!--添加-->
        <!--</el-button>-->
      <!--</div>-->
    </div>

    <div class="confirm-cancel">
        <el-button type="primary" @click="addNewOrgFun()">确 定</el-button>
	    <el-button @click="cancel(false)">取 消</el-button>

    </div>


  </div>
</template>
<script>
import {listOrganizationCinema,cinemaBinding,addOrg} from 'frame_cpm/http/interface.js'
;
export default {
  name: "addOrg",
  data() {
    return {
      currentPage: 1,
      total: 1,
      size: 50,
      pages: 1,
      userNameOrAccount: "总部",
      status: "",
      bf:'',
      tenantLicenses:'',
      name:"",
      // remark:'',
    };
  },
  props: ['openOrgListFun','chosenOneOrg','dialogVisible_addorgChange','getOrgList','bigName'],
  watch: {
  },
  components:{

  },
  methods: {
    openOrgList(){
        this.$emit('openOrgListFun')
    },
    cancel(){
      this.name = ''
        this.$emit('dialogVisible_addorgChange',false)
      this.$emit('bigName')
    },

    //刷新数据
    getDatas(val) {
      let self = this;
      if (val == 1) {
        self.currentPage = val*1;
      }
      let item = {};
      item.current = self.currentPage;
      item.size = self.size;
      // this.$emit("getListOrganizationCinema", item);
    },
    //新建组织
    addNewOrgFun(){
      let self = this;
      let nameReg = /^[\u4E00-\u9FA5A-Za-z0-9]{1,20}$/
      if(this.chosenOneOrg.id==null){
        this.error("请选择上级组织");
        return false;
      }
      if (this.name == "") {
        this.error("请输入组织名称");
        return false;
      }else if(!nameReg.test(this.name)){
        this.error('用户名称为20位字母或者数字或者汉字')
        return false;
      }
      let data ={
        pUid: this.chosenOneOrg.id,
        name: this.name,
      }
        addOrg(data)
          .then(ret => {
              if(ret&&ret.code == 200){
               self.$message({
                        message: '新建成功',
                        type: 'success'
                        });
                this.$emit('getOrgList');
                this.$emit('dialogVisible_addorgChange',false)
                this.name=''

            }else{
                  self.$message(ret.msg);
            }
          })
          .catch(() => {
            self.$message.error('网络繁忙，稍等再试');
          });

    },
  },
  created() {
  }
};
</script>
<style lang="scss">
    .role-list-wrap-1 .confirm-cancel {
        background: #fff;
    }
</style>
<style lang='scss' scoped>
.role-list-wrap-1 {
  .modal-title-wrap {
    padding: 15px 30px;
    border-bottom: 2px solid #ff9f37;
    .modal-title {
      font-size: 18px;
      font-weight: bold;
      color: #808080;
    }
    .modal-close {
      float: right;
      font-size: 16px;
      // font-weight: bold;
      color: #808080;
      line-height: 27px;
      cursor: pointer;
    }
  }
  .modal-search {
    padding: 40px 0px 0 0;
    height: 160px;
    text-align: center;
    .search-wrap {
          height: 32px;
          .el-input {
            width: 200px;
          }
          .childen-search{
              display: inline-block;
              .el-input {
                width:200px;
            }
          }
          span {
            color: #666666;
            font-size: 12px;
          }
          .el-textarea{
              width: 200px;
          }
          .el-textarea__inner{
              min-height: 66px;
          }
    }
    .addOrg-wrap{
        padding-left: 44px;
    }
    .plian{
      /*padding-right:30px;*/
      margin-top:12px;
    }
    .plian2{
      display: inline-block;
      padding-right:20px;
      margin-top:12px;
      margin-left: 62px
    }

  }
  // footer样式
  .role-detail-footer {
    text-align: center;
    margin: 30px auto;
  }
  .confirm-cancel{
    width: 100%;
    text-align: center;
      .el-button--default{
        display: inline-block;
        border: 1px solid #BCBCBC;
        color: #666666
      }
    }
}
</style>
