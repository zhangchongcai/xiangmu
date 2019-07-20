<template>
  <div class="role-list-wrap-1">
    <div class="modal-search">
      <div class="search-wrap ">
        <span>上级组织：</span>
        <el-input
          v-model="lastOrgData.text"
          disabled
        ></el-input>
      </div>
      <div class="search-wrap plian" >
        <span>组织名称：</span>
        <el-input v-model="name" clearable></el-input>
        <!--<div class="childen-search">-->
            <!--<el-input v-model="remark" placeholder="备注信息" clearable></el-input>-->
        <!--</div>-->
      </div>
    </div>
    <div class="confirm-cancel">
	    <el-button @click="cancel(false)">取 消</el-button>
	    <el-button type="primary" @click="addNextOrgFun()">确 定</el-button>
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
      status: "",
      bf:'',
      tenantLicenses:'',
      name:"",
      // remark:'',
    };
  },
  props: ['dialogVisible_appendChange','getOrgList','lastOrgData'],
  watch: {
  },
  components:{

  },
  methods: {
    cancel(){
        this.$emit('dialogVisible_appendChange',false)
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
    addNextOrgFun(){
      let self = this;
      let nameReg = /^[\u4E00-\u9FA5A-Za-z0-9]{1,20}$/
      if (this.name == "") {
        this.error("请输入组织名称");
        return false;
      }else if(!nameReg.test(this.name)){
        this.error('组织名称为20位字母或者数字或者汉字')
        return false;
      }
      let data ={
        pUid: this.lastOrgData.id? this.lastOrgData.id:0,
        name: this.name,
        // remark:this.remark
      }
        addOrg(data)
          .then(ret => {
              if(ret.code == 200){
               self.$message({
                        message: '新建成功',
                        type: 'success'
                        });
                this.$emit('getOrgList');
                this.$emit('dialogVisible_appendChange',false)
                this.name = ''

            }else{
                  self.$message(ret.msg);
            }
          })
          .catch(() => {
            self.error('网络繁忙，稍等再试');
          });

    },
  },
  created() {

  }
};
</script>
<style lang='scss' scoped>
.role-list-wrap-1 {
  margin-top:-30px;
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
    padding: 8px 0px;
    height: 203px;
    .search-wrap {
          height: 32px;
          .el-input {
            width: 188px;
          }
          .childen-search{
              display: inline-block;
              .el-input {
                width:300px;
            }
          }
          span {
            color: #666666;
            font-size: 12px;
          }
          .el-textarea{
              width: 376px;
          }
          .el-textarea__inner{
              min-height: 66px;
          }
    }
    .addOrg-wrap{
        padding-left: 44px;
    }
    .plian{
      padding-right:30px;
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
    /*background: #f5f5f5;*/
    text-align: center;
      .el-button--default{
        display: inline-block;
        border: 1px solid #BCBCBC;
        color: #666666
      }
    }
}
</style>
