<template>
  <div class="role-list-wrap-1">
    <div class="modal-search">
      <div class="search-wrap ">
        <span  >上级组织：</span>
        <el-input
          v-model="parentOrgData.label"
          placeholder="请输入内容"
          disabled
        ></el-input>
      </div>
      <div class="search-wrap plian" >
        <span>组织名称：</span>
        <template >
            <el-input
            v-model="lastOrgData.text"
            placeholder="请输入内容"
            clearable
            ></el-input>
            <div class="childen-search">
                <el-input
                v-model="lastOrgData.remark"
                placeholder="备注信息"
                clearable
                ></el-input>
            </div>
        </template>
        
      </div>
      <!-- <div class="addOrg-wrap">
        <el-button type="text" @click='addOrgInforFun'>
        <i class="iconfont icon-neiye-tianjia"></i>
        添加
        </el-button>
     </div> -->
    </div>
   
    <div class="confirm-cancel">
	    <el-button @click="cancel(false)">取 消</el-button>
	    <el-button type="primary" @click="editOrgFun()">确 定</el-button>
    </div>
   
    
  </div>
</template>
<script>
import {listOrganizationCinema,cinemaBinding,addOrg,editOrg} from 'frame_cpm/http/interface.js'
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
      formData:[{name:"",remark:'',}]
    };
  },
  props: ['dialogVisible_editNextOrgChange','getOrgList','lastOrgData','parentOrgData'],
  watch: {
  },
  components:{
     
  },
  methods: {
    cancel(){
        this.$emit('dialogVisible_editNextOrgChange',false)
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
    //编辑组织
    editOrgFun(){
      let self = this;
      let item={}
      item.name = self.lastOrgData.text
      item.remark = self.lastOrgData.remark
      item.uid =  self.lastOrgData.id
      let data ={
        orgJson:item,
      }
        editOrg(data)
          .then(ret => {
              if(ret.code == 200){
               self.$message({
                        message: '新建成功',
                        type: 'success'
                        });
                this.$emit('getOrgList');
                this.$emit('dialogVisible_editNextOrgChange',false)

            }else{
                  self.$message(ret.msg);
            }
          })
          .catch((err) => {
            self.$message('服务器繁忙，稍等再试');
          });
    
    },
    addOrgInforFun(){
        let item={name:"",remark:''}
       if(this.formData.length>2){
           return
       }else{
            this.formData.push(item)
       }
    }
  },
  created() {
     
  }
};
</script>
<style lang='scss'>
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
    background: #f5f5f5;
    text-align: center;
      .el-button--default{
        display: inline-block;
        border: 1px solid #BCBCBC;
        color: #666666
      }
    }
}
</style>
