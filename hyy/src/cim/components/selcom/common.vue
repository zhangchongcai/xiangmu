<template>
<div>
<el-dialog
  title="选择商品"
  :visible.sync="ComBankdialogVisible"
  width="70%"
  :before-close="cancelComBtn">
  <div class="box">
    <div class="box-left">
      <el-tree 
        :data="proThreedata"
        :props="proThreedefaultProps" 
        @node-click="handleNodeClick"
        >
        </el-tree>
    </div>
    <div class="box-right">
      <div class="box-right-top">
        <el-form
          :inline="true"
          :model="GoodsListQueryData"
          label-position="left"
          label-suffix=":"
        >
        <el-row>
          <el-col :span="8">
            <el-form-item label="商品名称">
              <el-input v-model="GoodsListQueryData.merName" placeholder="请输内容"></el-input>
            </el-form-item>
          </el-col>  
          <el-col :span="8">
            <el-form-item label="商品编码">
              <el-input v-model="GoodsListQueryData.merCode" placeholder="请输内容"></el-input>
            </el-form-item> 
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">  
            <el-form-item label="SKU编码">
              <el-input v-model="GoodsListQueryData.skuCode" placeholder="请输内容"></el-input>
            </el-form-item>
          </el-col> 
          <el-col :span="8">  
            <el-form-item label="速记代码">
              <el-input v-model="GoodsListQueryData.shorthandCode" placeholder="请输内容"></el-input>
            </el-form-item>
          </el-col>  
          <el-col :span="2">    
            <el-form-item  class="query-btn-box">
              <el-button type="primary" @click="onSubmit">搜索</el-button>
            </el-form-item>
            </el-col>  
        </el-row> 
        </el-form>
      </div>
      <div class="box-right-main">
        <div class="box-main-table">
          <div class="page-table">
            <el-table :data="GoodsListData" height="340" stripe>
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column
                v-for="item in tableColumn"
                :key="item.key"
                :prop="item.key"
                :label="item.label"
              ></el-table-column>
            </el-table>
          </div>
          <div class="page-wrap">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="GoodsListQueryData.page"
              :page-sizes="[10,20,30]"
              :page-size="GoodsListQueryData.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total='this.total'>
            </el-pagination>
          </div>
        </div>
        <div class="box-main-right">
          <div class="box-last-top">已选内容<span>清空</span></div>
          <hr>
          <ul class="box-last-ul">
            <li>
              <span class="span-left">可口可乐</span>
              <span class="span-right"><i class="el-icon-close"></i></span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <span slot="footer" class="dialog-footer">
  <el-button type="primary" @click="confirmComBtn()">确定</el-button>
    <el-button @click="cancelComBtn()">取 消</el-button>
  </span>
</el-dialog>
</div>


</template>

<script>

export default {
  name:"ComBank",
  props:[
    // 'ComBankdialogVisible'
  ],
  data(){
    return{
      total:"",
      ComBankdialogVisible:false,
      queryData: {
        pageSize: 10,
        page: 1,
        cinemaUid:null,
        name: null,
        code: null,
        status: null
      },
      proThreedata: [],
      proThreedefaultProps: {
        children: "children",
        label: "name"
      },
        tableColumn: [
        {
          label: "商品名称",
          key: "merName"
        },
        {
          label: "商品编码",
          key: "merCode"
        },
        {
          label: "SKU编码",
          key: "skuCode"
        },
        {
          label: "速记代码",
          key: "shorthandCode"
        },
        {
          label: "商品规格",
          key: "merSpec"
        },
        {
          label: "单位",
          key: "unitName"
        }
      ],
      AppointDialogVisible: false,
      selectComDialogVisible: false,
       tableData: [{
            "id":1,
            "uid":"ff5e4f86-fc77-40fb-a734-b3c0324b5165",
            "tenantId":"TID000000",
            "cinemaUid":"cuid001",
            "code":"CK001",
            "name":"测试仓库修改1",
            "address":"测试仓库修改1地址",
            "status":1,
            "isDef":0,
            "delFlag":0,
            "createTime":"2019-03-29 11:57:20",
            "createUserUid":"123456789",
            "createUserName":"超级管理员",
            "updateTime":"2019-03-29 13:58:50",
            "updateUserUid":"123456789",
            "updateUserName":"超级管理员"
        },{
            "id":1,
            "uid":"ff5e4f86-fc77-40fb-a734-b3c0324b5165",
            "tenantId":"TID000000",
            "cinemaUid":"cuid001",
            "code":"CK001",
            "name":"测试仓库修改1",
            "address":"测试仓库修改1地址",
            "status":1,
            "isDef":0,
            "delFlag":0,
            "createTime":"2019-03-29 11:57:20",
            "createUserUid":"123456789",
            "createUserName":"超级管理员",
            "updateTime":"2019-03-29 13:58:50",
            "updateUserUid":"123456789",
            "updateUserName":"超级管理员"
        },{
            "id":1,
            "uid":"ff5e4f86-fc77-40fb-a734-b3c0324b5165",
            "tenantId":"TID000000",
            "cinemaUid":"cuid001",
            "code":"CK001",
            "name":"测试仓库修改1",
            "address":"测试仓库修改1地址",
            "status":1,
            "isDef":0,
            "delFlag":0,
            "createTime":"2019-03-29 11:57:20",
            "createUserUid":"123456789",
            "createUserName":"超级管理员",
            "updateTime":"2019-03-29 13:58:50",
            "updateUserUid":"123456789",
            "updateUserName":"超级管理员"
        },{
            "id":1,
            "uid":"ff5e4f86-fc77-40fb-a734-b3c0324b5165",
            "tenantId":"TID000000",
            "cinemaUid":"cuid001",
            "code":"CK001",
            "name":"测试仓库修改1",
            "address":"测试仓库修改1地址",
            "status":1,
            "isDef":0,
            "delFlag":0,
            "createTime":"2019-03-29 11:57:20",
            "createUserUid":"123456789",
            "createUserName":"超级管理员",
            "updateTime":"2019-03-29 13:58:50",
            "updateUserUid":"123456789",
            "updateUserName":"超级管理员"
        },{
            "id":1,
            "uid":"ff5e4f86-fc77-40fb-a734-b3c0324b5165",
            "tenantId":"TID000000",
            "cinemaUid":"cuid001",
            "code":"CK001",
            "name":"测试仓库修改1",
            "address":"测试仓库修改1地址",
            "status":1,
            "isDef":0,
            "delFlag":0,
            "createTime":"2019-03-29 11:57:20",
            "createUserUid":"123456789",
            "createUserName":"超级管理员",
            "updateTime":"2019-03-29 13:58:50",
            "updateUserUid":"123456789",
            "updateUserName":"超级管理员"
        },{
            "id":1,
            "uid":"ff5e4f86-fc77-40fb-a734-b3c0324b5165",
            "tenantId":"TID000000",
            "cinemaUid":"cuid001",
            "code":"CK001",
            "name":"测试仓库修改1",
            "address":"测试仓库修改1地址",
            "status":1,
            "isDef":0,
            "delFlag":0,
            "createTime":"2019-03-29 11:57:20",
            "createUserUid":"123456789",
            "createUserName":"超级管理员",
            "updateTime":"2019-03-29 13:58:50",
            "updateUserUid":"123456789",
            "updateUserName":"超级管理员"
        },{
            "id":1,
            "uid":"ff5e4f86-fc77-40fb-a734-b3c0324b5165",
            "tenantId":"TID000000",
            "cinemaUid":"cuid001",
            "code":"CK001",
            "name":"测试仓库修改1",
            "address":"测试仓库修改1地址",
            "status":1,
            "isDef":0,
            "delFlag":0,
            "createTime":"2019-03-29 11:57:20",
            "createUserUid":"123456789",
            "createUserName":"超级管理员",
            "updateTime":"2019-03-29 13:58:50",
            "updateUserUid":"123456789",
            "updateUserName":"超级管理员"
        },{
            "id":1,
            "uid":"ff5e4f86-fc77-40fb-a734-b3c0324b5165",
            "tenantId":"TID000000",
            "cinemaUid":"cuid001",
            "code":"CK001",
            "name":"测试仓库修改1",
            "address":"测试仓库修改1地址",
            "status":1,
            "isDef":0,
            "delFlag":0,
            "createTime":"2019-03-29 11:57:20",
            "createUserUid":"123456789",
            "createUserName":"超级管理员",
            "updateTime":"2019-03-29 13:58:50",
            "updateUserUid":"123456789",
            "updateUserName":"超级管理员"
        },{
            "id":1,
            "uid":"ff5e4f86-fc77-40fb-a734-b3c0324b5165",
            "tenantId":"TID000000",
            "cinemaUid":"cuid001",
            "code":"CK001",
            "name":"测试仓库修改1",
            "address":"测试仓库修改1地址",
            "status":1,
            "isDef":0,
            "delFlag":0,
            "createTime":"2019-03-29 11:57:20",
            "createUserUid":"123456789",
            "createUserName":"超级管理员",
            "updateTime":"2019-03-29 13:58:50",
            "updateUserUid":"123456789",
            "updateUserName":"超级管理员"
        },{
            "id":1,
            "uid":"ff5e4f86-fc77-40fb-a734-b3c0324b5165",
            "tenantId":"TID000000",
            "cinemaUid":"cuid001",
            "code":"CK001",
            "name":"测试仓库修改1",
            "address":"测试仓库修改1地址",
            "status":1,
            "isDef":0,
            "delFlag":0,
            "createTime":"2019-03-29 11:57:20",
            "createUserUid":"123456789",
            "createUserName":"超级管理员",
            "updateTime":"2019-03-29 13:58:50",
            "updateUserUid":"123456789",
            "updateUserName":"超级管理员"
        }],
      // 首页查询参数
      GoodsListQueryData: {
        pageSize: 10,
        page: 1,
        merName: "",
        merCode: "",
        classUid: "",
        canSale: "",
        merType: "",
        shorthandCode: "",
        skuCode: "",
        classUid: ""
      },
    }
  },
  mounted() {
  },
  methods:{
    init(){
      this.handleClose(true)
      this.selectProductClass()
      this.goodsDataQueryGoodsList()
    },
    cancelComBtn:function(){
      this.handleClose(false)
    },
    confirmComBtn:function(){
      this.$emit("update:ComBankdialogVisible",false);
      this.handleClose(false)
    },
    handleClose:function(flag){
      this.ComBankdialogVisible = flag
    },
    // 请求商品接口
    selectProductClass() {
      let proClass = { uid: "" };
      this.$cimList.headquartersGoods
        .setmeaLoadCategoies(proClass)
        .then(res => {
          if (res.code === 200) {
            this.proThreedata = [];
            this.proThreedata.push(res.data);
            console.log(res.data);
          } else {
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    onSubmit(){
      this.goodsDataQueryGoodsList()
    },
    // 查询总部首页方法
    goodsDataQueryGoodsList() {
      let GoodsListQueryData = this.GoodsListQueryData;
      this.$cimList.headquartersGoods
        .goodsDataQueryGoodsList(GoodsListQueryData)
        .then(res => {
          if (res.code === 200) {
            this.GoodsListData = res.data.list;
            this.total = res.data.total;
            // debugger
          } else {
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    handleSizeChange(val) {
      this.GoodsListQueryData.pageSize = val;
      this.goodsDataQueryGoodsList()
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.GoodsListQueryData.page = val;
      this.goodsDataQueryGoodsList()
      console.log(`当前页: ${val}`);
    },
  }
}
  
</script>


<style lang="scss">
.el-form--inline .el-form-item{
  margin-bottom: 0px;
}
.el-dialog__body{
  padding-top:10px;
}
.el-header{
  .el-form-item__content{
    width:100px;
  }
  .el-form-item__label{
    width:80px;
  }
}

.box{
  display:flex;
  height:470px;
  overflow: hidden;
}
.box-left{
  flex:0 0 200px;
  height:100%;
  overflow: auto;
  float: left;
} 
.box-right{
  flex:1;
  height:100%;
  display:flex;
  flex-direction:column;
  .box-right-top{
    .el-input__inner{
      width:150px;
    }
  } 
}

.box-right-main{
  flex:1;
  overflow: hidden;
  display:flex;
}
.box-main-table{
  overflow: auto;
  flex:1;
  height:100%;
  display:flex;
  flex-direction:column;
  .page-table{
    flex:1;
  }
  .page-wrap{
    height:40px;
    padding:0;
  }
}
.box-main-right{
  flex:0 0 200px;
  border:1px solid #EBEEF5;
  box-sizing: border-box;
  padding:5px;
  .box-last-top{
    span{
      float: right;
      cursor: pointer;
    }
  }
  .box-last-ul{
    height:370px;
    overflow: auto;
    li{
      display:flex;
      height:30px;
      line-height:30px;
      .span-left{
        flex:1;
        width:168px;
        font-size:12px;
        overflow:hidden;
        text-overflow:ellipsis;
        white-space:nowrap
      }
      .span-right{
        display:inline-block;
        flex:0 0 20px;
        cursor: pointer;
        i{

        }
      }
    }
  }
}
.next-box{
  display:flex;
  flex-direction:column;
  .next-pro-top{
    flex:0 0 30px;
    line-height:30px;
  }
  .next-pro-main{
    flex:1;
  }
}
.box-right .box-right-top{
  height:auto;
}
</style>