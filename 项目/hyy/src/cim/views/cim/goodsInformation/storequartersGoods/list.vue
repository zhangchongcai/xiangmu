<template>
  <div>
    <div class="common-header">
      <el-form
        :inline="true"
        :model="queryData"
        label-position="right"
        label-width="100px"
        label-suffix=":"
      >
        <el-form-item label="门店名称">
          <el-input v-model="queryData.cinemaUid" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        
        <el-form-item label="商品名称">
          <el-input v-model="queryData.name" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="queryData.code" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="固定属性">
          <el-input v-model="queryData.name" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="商品类型">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="单品" value="0"></el-option>
            <el-option label="原材料" value="1"></el-option>
            <el-option label="合成品" value="2"></el-option>
            <el-option label="套餐" value="3"></el-option>
            <el-option label="服务商品" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="单品" value="0"></el-option>
            <el-option label="原材料" value="1"></el-option>
            <el-option label="合成品" value="2"></el-option>
            <el-option label="套餐" value="3"></el-option>
            <el-option label="服务商品" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售状态">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="启用" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="common-left">
      <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
    </div>
    <div class="common-right">
      <div class="common-new-built">
        <el-button type="primary" size="small" plain @click="handleComBank">从标品库添加商品</el-button>
        <el-dropdown @command="newAddhandleCommand">
          <el-button type="primary">
            新建
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="1">单品</el-dropdown-item>
            <el-dropdown-item command="2">原材料</el-dropdown-item>
            <el-dropdown-item command="3">合成品</el-dropdown-item>
            <el-dropdown-item command="4">套餐</el-dropdown-item>
            <el-dropdown-item command="5">服务商品</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div>
        <el-table :data="tableData" stripe>
          <el-table-column
            v-for="item in tableColumn"
            :key="item.key"
            :prop="item.key"
            :label="item.label"
            width="200px"
          ></el-table-column>
          <el-table-column label="操作" style="width:180px;">
            <template slot-scope="{row,$index}">
              <el-button type="text" size="small" @click.stop="handleeDlete($index, row)">查看</el-button>
              <el-button type="text" size="small" @click.stop="handleModification($index, row)">修改</el-button>
              <el-button type="text" size="small" @click.stop="handleModification($index, row)">停用</el-button>
              <el-button type="text" size="small" @click.stop="handleModification($index, row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrap">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="queryData.page"
            :page-sizes="[10,20,30]"
            :page-size="queryData.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
        {{this.ComBankdialogVisible}}
      </div>
    </div>
    <el-dialog
      class="change-dialog"
      :title="newProtitleArr.newProtitle"
      :visible.sync="newProDialog"
      width="600px"
    >
    <div class="newPro-box">
      <div class="tips">请先查找是否已存在相同商品，避免重复新建。或从标准商品库中选择您要的商品，添加到系统中使用。
      </div>
      <div class="title">商品类型：{{this.newProtitleArr.name}}</div>
      <div class="selectName">请选择商品分类</div>
      <div class="newProTree">
        <el-tree :data="proMerTypedata" :props="defaultProps" @node-click="proMerTypeNodeClick"></el-tree>
      </div>
    </div>
      {{this.newProtitleArr}}
      <span slot="footer">
        <el-button @click="newProDialog = false">取 消</el-button>
        <el-button type="primary" @click="newAddProPage(newProtitleArr.merType)">确 定</el-button>
      </span>
    </el-dialog>
    <com-bank :ComBankdialogVisible.sync="ComBankdialogVisible"></com-bank>
  </div>
</template>

<script>
import qs from "qs";
import ComBank from "./comBank/common";

export default {
  data() {
    return {
      newProtitleArr:{
        newProtitle:"",
        name:"",
        merType:"",
        merTypeLabel:""
      },
      newProDialog:false,
      ComBankdialogVisible: false,
      // 数结构
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      proMerTypedata: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 新建状态
      statusRadio: 1,
      //查询数据
      queryData: {
        pageSize: 10,
        page: 1,
        cinemaUid: null,
        name: null,
        code: null,
        status: null
      },
      // 数据总数
      total: 10,
      tableColumn: [
        {
          label: "商品编码",
          key: "cinemaUid"
        },
        {
          label: "商品名称",
          key: "code"
        },
        {
          label: "类型",
          key: "name"
        },
        {
          label: "基本单位",
          key: "address"
        },
        {
          label: "价格",
          key: "address"
        },
        {
          label: "状态",
          key: "status"
        }
      ],
      tableData: [
        {
          id: 1,
          uid: "ff5e4f86-fc77-40fb-a734-b3c0324b5165",
          tenantId: "TID000000",
          cinemaUid: "cuid001",
          code: "CK001",
          name: "测试仓库修改1",
          address: "测试仓库修改1地址",
          status: 1,
          isDef: 0,
          delFlag: 0,
          createTime: "2019-03-29 11:57:20",
          createUserUid: "123456789",
          createUserName: "超级管理员",
          updateTime: "2019-03-29 13:58:50",
          updateUserUid: "123456789",
          updateUserName: "超级管理员"
        }
      ],
      //新建or修改数据
      changeData: {
        status: "1",
        cinemaUid: null,
        code: "CK005",
        name: null,
        address: null
      },
      isNewBuile: true,
      changeDialog: false,
      changeRules: {
        // cinemaUid: [{ required: true, message: "请输入门店名称", trigger: "blur" }],
        // code: [{ required: true, message: "请输入仓库编码", trigger: "blur" }],
        // name: [{ required: true, message: "请输入仓库名称", trigger: "blur" }]
      }
    };
  },
  mounted() {
    // this.init();
  },
  methods: {
    // 初始化
    init() {
      this.queryDataIfNull(this.queryData);
      this.queryStoreEvent(this.queryData);
    },
    newAddhandleCommand(command) {
      this.comClassSelect(command)
    },
    comClassSelect(a) {
      this.newProDialog = true
      this.newProtitleArr.newProtitle = "新建"+this.newPro(a)
      this.newProtitleArr.name = this.newPro(a)
      this.newProtitleArr.merType = a
    },
    singleProPage(param) {
      this.$router.push({
        path: "comSingle",
        query: param
      });
    },
    comMaterialProPage(param) {
      this.$router.push({
        path: "comMaterial",
        query: param
      });
    },
    newPro(a){
      switch(a){
        case "1":
          return "单品"
          break;
        case "2":
          return "原材料"
          break;
        case "3":
          return "合成品"
          break;
        case "4":
          return "套餐"
          break;
        case "5":
          return "服务商品"
          break;
      }
    },
    newAddProPage(command){
      this.newProDialog = false
      switch (command) {
        // 单品
        case "1":
          return this.singleProPage({
            type: 1 //1新建，2修改，3查看
          });
          break;
        // 原材料
        case "2":
          return this.comMaterialProPage({
            type: 1 //1新建，2修改，3查看
          });
          break;
        // 合成品
        case "3":
          this.comPositeJump({
            type: 1 //1新建，2修改，3查看
          });
          break;
        // 套餐
        case "4":

          break;
        // 服务商品
        case "5":
          this.serveGoodJump({
            type: 1 //1新建，2修改，3查看
          });
          break;
      }
    },
    proMerTypeNodeClick(data){
      this.newProtitleArr.merTypeLabel = data.label
      console.log(data)
    },
    // 合成品页面跳转
    comPositeJump(param) {
      this.$router.push({
        path: "comPosite",
        query: param
      });
    },
    // 服务商品页面跳转
    serveGoodJump(param) {
      this.$router.push({
        path: "serveGood",
        query: param
      });
    },
    handleComBank() {
      alert();
    },

    // 查询
    onSubmit() {
      this.queryDataIfNull(this.queryData);
      this.queryStoreEvent(this.queryData);
    },
    // 对象属性是否为空 是改为null
    queryDataIfNull(obj) {
      for (var key in obj) {
        if (obj[key] == "") {
          obj[key] = null;
        }
      }
    },
    // 查询数据
    queryStoreEvent(data) {
      this.$api
        .queryStorehouse(data)
        .then(data => {
          let _self = this;
          if (data && data.code === 200) {
            let newdata = data.data;
            _self.tableData = newdata.list;
            _self.total = newdata.total;
            console.log(newdata);
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 新增
    saveStoreEvent(data) {
      this.$api
        .saveStorehouse(data)
        .then(data => {
          let _self = this;
          if (data && data.code === 200) {
            this.queryDataIfNull(this.queryData);
            this.queryStoreEvent(this.queryData);
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    }, // 修改
    updateStoreEvent() {
      let data = {
        status: this.changeData.status,
        cinemaUid: this.changeData.cinemaUid,
        name: this.changeData.name,
        code: this.changeData.code,
        address: this.changeData.address,
        id: this.changeData.id
      };
      // debugger
      this.queryDataIfNull(data);
      this.$api
        .updateStorehouse(data)
        .then(data => {
          let _self = this;
          if (data && data.code === 200) {
            _self.queryDataIfNull(_self.queryData);
            _sethis.queryStoreEvent(this.queryData);
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 修改操作
    handleModification(index, row) {
      this.changeData.status = row.status.toString();
      this.changeData.cinameUid = row.cinameUid;
      this.changeData.name = row.name;
      this.changeData.code = row.code;
      this.changeData.address = row.address;
      this.changeData.id = row.id;
      this.changeDialog = true;
      this.isNewBuile = false;
    },
    // 删除操作
    handleeDlete(index, row) {
      // debugger
      this.$api
        .delStorehouse(row.id)
        .then(data => {
          let _self = this;
          if (data && data.code === 200) {
            _self.queryDataIfNull(_self.queryData);
            _self.queryStoreEvent(_self.queryData);
          } else {
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    //确认提交修改
    handleModificationSubmit() {
      let _self = this;
      console.log(this.changeData);
      _self.$refs["changeForm"].validate(valid => {
        if (valid) {
          if (_self.isNewBuile) {
            _self.queryDataIfNull(_self.changeData);
            _self.saveStoreEvent(_self.changeData);
          } else {
            _self.updateStoreEvent();
          }
          _self.queryDataIfNull(_self.queryData);
          _self.queryStoreEvent(_self.queryData);
          _self.changeDialog = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.queryStoreEvent(this.queryData);
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.queryStoreEvent(this.queryData);
      console.log(`当前页: ${val}`);
    },
    handleComBank() {
      this.ComBankdialogVisible = true;
      // this.changeData={
      //   status: "0",
      //   cinemaUid:"cuidtest0055541",
      //   code: "CK0052",
      //   name: null,
      //   address:null
      // },
      // this.changeDialog = true;
      // this.isNewBuile = true;
    }
  },
  components: {
    ComBank
  }
};
</script>

<style lang="scss">
.change-dialog {
  .el-form--inline .el-form-item {
    width: 100%;
  }
  .el-form-item__content {
    width: 70%;
  }
}

.common-left {
  width: 200px;
  height: 100px;
  float: left;
}
.common-right {
  padding-left: 200px;
}
.newPro-box{
  .tips{

  }
  .title{
    margin:10px 0;
    font-size:16px;
  }
  .selectName{
    font-size:16px;
    margin:10px 0;
  }
  .newProTree{
    height:330px;
    overflow: auto;
  }
}
</style>