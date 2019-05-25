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
          <el-input v-model="queryData.cinameName" placeholder="请选择门店" style="width:150px;">
            <i class="el-icon-close el-input__icon" slot="suffix" @click="onCinemalSumit()"></i>
          </el-input>
          <el-button @click="selectCinemalDialog">选择</el-button>
        </el-form-item>
        <el-form-item label="货架编码">
          <el-input v-model="queryData.code" placeholder="请输内容" prefix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="货架名称">
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
        <el-form-item label="状态" prop="status" > 
          <el-radio v-model="changeData.status" label="0">启用</el-radio>
          <el-radio v-model="changeData.status" label="1">停用</el-radio>
        </el-form-item>
        <el-form-item label="门店名称" prop="cinemaName">
          <div v-if="isNewBuile == true">
            <el-input v-model="changeData.cinameName" placeholder="请选择门店" style="width:150px;">
              <i class="el-icon-close el-input__icon" slot="suffix" @click="onCinemalSumit1()"></i>
            </el-input>
          <el-button @click="selectCinemalDialog1">选择</el-button>
          </div>
          <span v-else-if>{{this.changeData.cinameName}}</span>
          
        </el-form-item>
        <el-form-item label="货架编码" prop="code">
          <span>{{this.changeData.code}}</span>
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
      qData:{
        cinameUid:"",
        code:"",
        name:"",
        status:"",
        pageSize: 10,
        page: 1
      },
      // 新建状态
      statusRadio:1,
      //查询数据
      queryData: {
        pageSize: 10,
        page: 1,
        name: "",
        code: "",
        status: "",
        cinameName:"",
        cinameUid:""
      },
      // 数据总数
      total:10,
      tableColumn: [
        {
          label: "门店名称",
          key: "cinameUid"
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
          key: "status",
          formatter(row, column, status) {
            let result = "";
            switch (row.status) {
              case 0:
                result = "启用";
                break;
              case 1:
                result = "停用";
                break;
            }
            return result;
          }
        }
      ],
      tableData: [],
      //新建or修改数据
      changeData: {
        status: "0",
        cinameUid:"",
        cinameName:"",
        name: "",
        address:"",
        code:""
      },
      isNewBuile: true,
      changeDialog: false,
      changeRules: {
        storeName: [
          { required: true, message: '请选择门店', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入货架名称', trigger: 'blur' },
          { min: 0, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        code: [
          { required: true, trigger: 'blur' }
        ]
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
      this.queryStoreEvent(this.queryData)
    },
    // 查询
    onSubmit() {
      if(this.queryData.cinameName == ""){
        this.$message("请选择门店");
      }else{
        this.queryStoreEvent(this.queryData)
      }
    },
    // 选泽门店回调
    onCinemalSumit(val = []) {
      // alert(val)
      if (val.length > 0) {
        this.queryData.cinameName = val[0].name;
        this.queryData.cinameUid = val[0].cinemaUid;
      } else {
        this.queryData.cinameName = "";
        this.queryData.cinameUid = "";
      }
      console.log(val);
    },
    // 选泽门店回调
    onCinemalSumit1(val = []) {
      // alert(val)
      if (val.length > 0) {
        this.changeData.cinameName = val[0].name;
        this.changeData.cinameUid = val[0].cinemaUid;
      } else {
        this.changeData.cinameName = "";
        this.changeData.cinameUid = "";
      }
      console.log(val);
    },
    selectCinemalDialog() {
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    selectCinemalDialog1() {
      this.$refs.myCinemalDialog1.handleDialog(true);
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
      this.$cimList.findStorageRackList(data).then( data => {
        let _self = this
          if (data && data.code === 200) {
            let newdata = data.data
            _self.tableData = newdata.list
            // _self.tableData.forEach((val,index,arr)=>{
            //   val.cinemaName = _self.queryData.cinemaName
            // })
            _self.total = newdata.total
          } else {
            this.$message(data.msg);
          }
          })
    },
    // 新增
    saveStoreEvent(data){
      this.$cimList.saveStorageRack(data).then( data => {
        let _self = this
          if (data && data.code === 200) {
            _self.queryData.cinemaName = _self.changeData.cinemaName
            _self.queryData.cinameUid = _self.changeData.cinameUid
            _self.queryStoreEvent(_self.queryData)
            
            _self.$message("新建成功");
          } else {
            _self.$message(data.msg);
          }
          }).catch( err => {
            console.log(err)
          })
    },// 修改
    updateStoreEvent(data){
      this.$cimList.updateStorageRack(data).then( data => {
        let _self = this
          if (data && data.code === 200) {
            _self.queryStoreEvent(_self.queryData)
            this.$message("修改成功");
          } else {
            this.$message(data.msg);
          }
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
      this.$cimList.delStorageRack(row.code).then( data => {
        let _self = this
          if (data && data.code === 200) {
            _self.queryStoreEvent(_self.queryData)
            this.$message("删除成功");
          }else {
              this.$message(data.msg);
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
      
      this.resStoreCode()
      this.changeDialog = true;
      this.isNewBuile = true;
    },
    resStoreCode(val){
      let changeData = {
        status: "0",
        cinameUid:this.queryData.cinameUid,
        // cinameUid:null,
        name: null,
        address:null,
        cinameUid:null,
        cinemaName:null,
        code:null
      }
      let _self = this
      _self.$cimList
        .storageRackGetStorageRackCode()
        .then(res => {
          if (res.code === 200) {
            changeData.code = res.data
            this.changeData = changeData
            // debugger
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