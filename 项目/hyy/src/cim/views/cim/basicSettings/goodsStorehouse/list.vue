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
        <el-form-item label="仓库编码">
          <el-input v-model="queryData.code" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="仓库名称">
          <el-input v-model="queryData.name" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="启用" value="0"></el-option>
            <el-option label="停用" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item  class="query-btn-box">
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="common-new-built">
      <el-button type="primary" size="small" plain @click="handleNewBuilt">新建</el-button>
    </div>
    <div>
      <el-table :data="tableData" stripe>
        <el-table-column
          v-for="item in tableColumn"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row,$index}">
            <el-button type="text" size="small" @click.stop="handleModification($index, row)">修改</el-button>
            <el-button type="text" size="small" @click.stop="handleeDlete($index, row)">删除</el-button>
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
      <!-- {{this.queryData}} -->
    </div>
    <el-dialog class="change-dialog" :title="isNewBuile ? '新建仓库':'修改仓库'" :visible.sync="changeDialog" width="400px">
      <el-form
        :inline="true"
        ref="changeForm"
        :model="changeData"
        label-position="left"
        label-width="100px"
        label-suffix=":"
        :rules="changeRules"
      >
        <el-form-item label="状态" prop="status">
          <el-radio v-model="changeData.status" label="0">停用</el-radio>
          <el-radio v-model="changeData.status" label="1">启用</el-radio>
        </el-form-item>
        <el-form-item label="门店名称" prop="cinemaUid">
          <el-input v-model="changeData.cinemaUid"></el-input>
        </el-form-item>
        <el-form-item label="仓库编码" prop="code">
          <el-input v-model="changeData.code"></el-input>
        </el-form-item>
        <el-form-item label="仓库名称" prop="name">
          <el-input v-model="changeData.name"></el-input>
        </el-form-item>
        <el-form-item label="仓库地址" prop="address">
          <el-input v-model="changeData.address"></el-input>
        </el-form-item>
      </el-form>
      <!-- {{this.changeData}} -->
      <span slot="footer">
        <el-button @click="changeDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleModificationSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from "qs";
export default {
  data() {
    return {
      // 新建状态
      statusRadio:1,
      //查询数据
      queryData: {
        pageSize: 10,
        page: 1,
        cinemaUid:null,
        name: null,
        code: null,
        status: null
      },
      // 数据总数
      total:10,
      tableColumn: [
        {
          label: "门店名称",
          key: "cinemaUid"
        },
        {
          label: "仓库编码",
          key: "code"
        },
        {
          label: "仓库名称",
          key: "name"
        },
        {
          label: "仓库地址",
          key: "address"
        },
        {
          label: "状态",
          key: "status"
        }
      ],
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
        }],
      //新建or修改数据
      changeData: {
        status: "1",
        cinemaUid:null,
        code: "CK005",
        name: null,
        address:null
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
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.queryDataIfNull(this.queryData)
      this.queryStoreEvent(this.queryData)
    },
    // 查询
    onSubmit() {
      this.queryDataIfNull(this.queryData)
      this.queryStoreEvent(this.queryData)
    },
    // 对象属性是否为空 是改为null
    queryDataIfNull(obj){
      for(var key in obj){
        if(obj[key] == ''){
          obj[key] = null
        }
      }
    },
    // 查询数据
    queryStoreEvent(data){
      this.$cimList.queryStorehouse(data).then( data => {
        let _self = this
          if (data && data.code === 200) {
            let newdata = data.data
            _self.tableData = newdata.list
            _self.total = newdata.total
            console.log(newdata)
          } else {

          }
          }).catch( err => {
            console.log(err)
          })
    },
    // 新增
    saveStoreEvent(data){
      this.$cimList.saveStorehouse(data).then( data => {
        let _self = this
          if (data && data.code === 200) {
            this.queryDataIfNull(this.queryData)
            this.queryStoreEvent(this.queryData)
          } else {

          }
          }).catch( err => {
            console.log(err)
          })
    },// 修改
    updateStoreEvent(){
      let data = {
        status:this.changeData.status,
        cinemaUid:this.changeData.cinemaUid,
        name:this.changeData.name,
        code:this.changeData.code,
        address:this.changeData.address,
        id:this.changeData.id
      }
      // debugger
      this.queryDataIfNull(data)
      this.$cimList.updateStorehouse(data).then( data => {
        let _self = this
          if (data && data.code === 200) {
            _self.queryDataIfNull(_self.queryData)
            _sethis.queryStoreEvent(this.queryData)
          } else {

          }
          }).catch( err => {
            console.log(err)
          })
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
      this.$cimList.delStorehouse(row.id).then( data => {
        let _self = this
          if (data && data.code === 200) {
            _self.queryDataIfNull(_self.queryData)
            _self.queryStoreEvent(_self.queryData)
          }
          else {

          }
          }).catch( err => {
            console.log(err)
          })
    },
    //确认提交修改
    handleModificationSubmit() {
      let _self = this
      console.log(this.changeData)
      _self.$refs['changeForm'].validate(valid => {
        if (valid) {
          if (_self.isNewBuile) {
            _self.queryDataIfNull(_self.changeData)
            _self.saveStoreEvent(_self.changeData);
          } else {
            _self.updateStoreEvent();
          }
          _self.queryDataIfNull(_self.queryData)
          _self.queryStoreEvent(_self.queryData)
          _self.changeDialog = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });

    },
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.queryStoreEvent(this.queryData)
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.queryStoreEvent(this.queryData)
      console.log(`当前页: ${val}`);
    },
    handleNewBuilt() {
      this.changeData={
        status: "0",
        cinemaUid:"cuidtest0055541",
        code: "CK0052",
        name: null,
        address:null
      },
      this.changeDialog = true;
      this.isNewBuile = true;
    }
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
</style>