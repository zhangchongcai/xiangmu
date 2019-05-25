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
          <el-input v-model="queryData.cinemaName" placeholder="请选择门店" style="width:150px;">
            <i class="el-icon-close el-input__icon" slot="suffix" @click="onCinemalSumit()"></i>
          </el-input>
          <el-button @click="selectCinemalDialog">选择</el-button>
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
          :formatter="item.formatter"

        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{row,$index}">
            <el-button type="text" size="small" @click.stop="handleModification($index, row)">修改</el-button>
            <el-button type="text" size="small" v-if="row.isDef != 1" @click.stop="handleeDlete($index, row)">删除</el-button>
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
          <el-radio v-model="changeData.status" label="1">启用</el-radio>
          <el-radio v-model="changeData.status" label="0">停用</el-radio>
        </el-form-item>
        <el-form-item label="门店名称">
          <div v-if="isNewBuile == true">
            <el-input v-model="changeData.cinemaName" placeholder="请选择门店" style="width:150px;">
              <i class="el-icon-close el-input__icon" slot="suffix" @click="onCinemalSumit1()"></i>
            </el-input>
            <el-button @click="selectCinemalDialog1">选择</el-button>
          </div>
            <span v-else>{{this.changeData.cinemaName}}</span>
        </el-form-item>
        <el-form-item label="仓库编码" prop="code">
          <span>{{this.changeData.code}}</span>
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
    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit"></cinemal-dialog>
    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="myCinemalDialog1" @onSumit="onCinemalSumit1"></cinemal-dialog>
  </div>
</template>

<script>
import qs from "qs";
import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
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
        cinemaName:null,
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
          key: "status",
          formatter(row, column, cellValue) {
            let result = "";
            switch (row.status) {
              case 1:
                result = "启用";
                break;
              case 0:
                result = "禁用";
                break;
            }
            return result;
          }
        }
      ],
      tableData: [],
      //新建or修改数据
      changeData: {
        status: "1",
        cinemaUid:null,
        cinemaName:null,
        code: null,
        name: null,
        address:null
      },
      isNewBuile: true,
      changeDialog: false,
      changeRules:{
        cinemaUid: [{ required: true, message: "请输入门店名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入仓库编码", trigger: "blur" }],
        name: [{ required: true, message: "请输入仓库名称", trigger: "blur" }]
      }
    };
  },
  mounted() {
    // this.init();
  },
  components: {
    cinemalDialog
  },
  methods: {
    // 初始化
    init() {
      this.queryDataIfNull(this.queryData)
      this.queryStoreEvent(this.queryData)
    },
    // 查询
    onSubmit() {
      if(this.queryData.cinemaName == null || this.queryData.cinemaName == ""){
        this.$message("请选择门店");
      }else{
        this.queryDataIfNull(this.queryData)
        this.queryStoreEvent(this.queryData)
      }
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
    selectCinemalDialog() {
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    selectCinemalDialog1() {
      this.$refs.myCinemalDialog1.handleDialog(true);
    },
    // 选泽门店回调
    onCinemalSumit(val = []) {
      // alert(val)
      if (val.length > 0) {
        this.queryData.cinemaName = val[0].name;
        this.queryData.cinemaUid = val[0].cinemaUid;
      } else {
        this.queryData.cinemaName = null;
        this.queryData.cinemaUid = null;
      }
      console.log(val);
    },
    // 选泽门店回调
    onCinemalSumit1(val = []) {
      if (val.length > 0) {
        this.changeData.cinemaName = val[0].name;
        this.changeData.cinemaUid = val[0].cinemaUid;
      } else {
        this.changeData.cinemaName = null;
        this.changeData.cinemaUid = null;
      }
      console.log(val);
    },
    // 新增
    saveStoreEvent(data){
      this.$cimList.saveStorehouse(data).then( data => {
          if (data && data.code === 200) {
            this.queryData.cinemaName = this.changeData.cinemaName
            this.queryData.cinemaUid = this.changeData.cinemaUid
            debugger
            this.queryDataIfNull(this.queryData)
            this.queryStoreEvent(this.queryData)
            this.$message("新建成功");
          } else {
            this.$message(data.msg);
          }
          }).catch( err => {
            console.log(err)
          })
    },// 修改
    updateStoreEvent(){
      let data = {
        status:this.changeData.status,
        cinemaUid:this.changeData.cinemaUid,
        // cinemaName:this.changeData.cinemaName,
        name:this.changeData.name,
        code:this.changeData.code,
        address:this.changeData.address,
        uid:this.changeData.uid
      }
      console.log(data)
      debugger
      this.queryDataIfNull(data)
      this.$cimList.updateStorehouse(data).then( data => {
        let _self = this
          if (data && data.code === 200) {
            _self.queryData.cinemaUid = _self.changeData.cinemaUid
            _self.queryData.cinemaName = _self.changeData.cinemaName
            _self.queryDataIfNull(_self.queryData)
            _self.queryStoreEvent(_self.queryData)
            _self.$message("修改成功");
          } else {
            _self.$message(data.msg);
          }
          }).catch( err => {
            console.log(err)
          })
    },
    // 修改操作
    handleModification(index, row) {
      this.changeData.status = row.status.toString();
      this.changeData.cinemaUid = row.cinemaUid;
      this.changeData.cinemaName = this.queryData.cinemaName;
      this.changeData.name = row.name;
      this.changeData.code = row.code;
      this.changeData.address = row.address;
      this.changeData.id = row.id;
      this.changeData.uid = row.uid;
      this.changeDialog = true;
      this.isNewBuile = false;
    },
    // 删除操作
    handleeDlete(index, row) {
      let val = {
        "uid":row.uid
      }
      this.$cimList.delStorehouse(val).then( data => {
          if (data && data.code === 200) {
            this.queryDataIfNull(this.queryData)
            this.queryStoreEvent(this.queryData)
            this.$message("删除成功");
          }
          else {
            this.$message(data.msg);
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
          // _self.queryDataIfNull(_self.queryData)
          // _self.queryStoreEvent(_self.queryData)
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
      this.changeData ={
        status: "1",
        cinemaUid:null,
        cinemaName:null,
        name: null,
        address:null,
        code:null
      },
      this.resGetStorehouseCode()
      this.changeDialog = true;
      this.isNewBuile = true;
    },
    resGetStorehouseCode(){
      let val = {
          "uid":""
      }
      let _self = this
      _self.$cimList
        .storehouseGetStorehouse(val)
        .then(res => {
          if (res.code === 200) {
            this.changeData.code = res.data.code
          }else{
            _self.$message(res.msg);
          }
        })
        .catch(err => {});
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
.common-new-built{
  float:right;
}
</style>