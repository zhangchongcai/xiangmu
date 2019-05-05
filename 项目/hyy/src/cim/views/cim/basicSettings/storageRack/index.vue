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
          <el-input v-model="queryData.storeName" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
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
    </div>
    <el-dialog class="change-dialog" :title="isNewBuile ? '新建货架':'修改货架'" :visible.sync="changeDialog" width="400px">
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
          <el-radio v-model="changeData.status" label="0">启用</el-radio>
          <el-radio v-model="changeData.status" label="1">停用</el-radio>
        </el-form-item>
        <el-form-item label="门店名称" prop="storeName">
          <el-input v-model="changeData.storeName"></el-input>
        </el-form-item>
        <el-form-item label="货架名称" prop="name">
          <el-input v-model="changeData.name"></el-input>
        </el-form-item>
        <el-form-item label="货架地址" prop="address">
          <el-input v-model="changeData.address"></el-input>
        </el-form-item>
      </el-form>
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
        storeName:null,
        name: null,
        code: null,
        status: null
      },
      // 数据总数
      total:10,
      tableColumn: [
        {
          label: "门店名称",
          key: "storeName"
        },
        {
          label: "货架编码",
          key: "code"
        },
        {
          label: "货架名称",
          key: "name"
        },
        {
          label: "货架地址",
          key: "address"
        },
        {
          label: "状态",
          key: "status"
        }
      ],
      tableData: [],
      //新建or修改数据
      changeData: {
        status: "0",
        cinameUid:"3ccd895a-1644-4675-b635-0ded4bce7daf",
        name: null,
        address:null,
        storeName:null
      },
      isNewBuile: true,
      changeDialog: false,
      changeRules: {
        // cinameUid: [{ required: true, message: "请输入门店名称", trigger: "blur" }],
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
      this.queryStoreEvent(this.queryData)
    },
    // 查询
    onSubmit() {
      this.queryStoreEvent(this.queryData)
    },
    // 对象属性是否为空 是改为null
    queryDataIfNull(data){
      for(let key in data){
        if(data[key] == ''){
          data[key] = null
        }
      }
    },
    // 查询数据
    queryStoreEvent(data){
      this.$api.findStorageRackList(data).then( data => {
        let _self = this
          if (data && data.code === 200) {
            let newdata = data.data
            _self.tableData = newdata.list
            _self.total = newdata.total
          } else {

          }
          }).catch( err => {
            console.log(err)
          })
    },
    // 新增
    saveStoreEvent(data){
      this.$api.saveStorageRack(data).then( data => {
        let _self = this
          if (data && data.code === 200) {
            _sethis.queryStoreEvent(this.queryData)
          } else {

          }
          }).catch( err => {
            console.log(err)
          })
    },// 修改
    updateStoreEvent(data){
      this.$api.updateStorageRack(data).then( data => {
        let _self = this
          if (data && data.code === 200) {
            _sethis.queryStoreEvent(JSON.stringify(this.queryData))
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
      this.changeData.storeName = row.storeName;
      this.changeDialog = true;
      this.isNewBuile = false;
    },
    // 删除操作
    handleeDlete(index, row) {
      this.$api.delStorageRack(row.code).then( data => {
        let _self = this
          if (data && data.code === 200) {
            _self.queryStoreEvent(_self.queryData)
          } else if(data && data.code === 400){
            alert("默认货架不能删除")
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
      _self.$refs['changeForm'].validate(valid => {
        if (valid) {
          if (_self.isNewBuile) {
            _self.saveStoreEvent(_self.changeData);
          } else {
            _self.updateStoreEvent(_self.changeData);
          }
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
        cinameUid:"3ccd895a-1644-4675-b635-0ded4bce7daf",
        name: null,
        address:null,
        storeName:null
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