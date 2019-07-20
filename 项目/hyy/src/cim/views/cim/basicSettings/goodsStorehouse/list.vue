<template>
  <div class="retail-style">
    <div class="common-header storeHouse-style">
      <el-form
        :inline="true"
        :model="queryData"
        label-position="right"
        label-width="100px"
        label-suffix=":"
        >
        <el-form-item label="门店名称" class="select-input">
            <el-input
                    v-model="queryData.cinemaName"
                    clearable
                    @clear="onCinemalSumit"
                    @focus="selectCinemalDialog"
                    placeholder="请选择门店"
            ></el-input>
            <el-button @click="selectCinemalDialog" type="primary cinemaSel-btn" plain>{{queryData.cinemaName?"编辑":"选择"}}</el-button>
        </el-form-item>
        <el-form-item label="仓库编码">
          <el-input v-model="queryData.code" placeholder="请输内容"></el-input>
        </el-form-item>
        <el-form-item label="仓库名称">
          <el-input v-model="queryData.name" placeholder="请输内容"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
            <!-- <el-option label="盘点" value="2"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item  class="query-btn-box">
          <el-button type="primary query-btn" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="common-new-built">
      <el-button type="primary" size="small" plain @click="handleNewBuilt">新建</el-button>
    </div>
    <div>
      <el-table :data="tableData" stripe v-loading="tableLoding"
      :height="this.defaultTableHeight">
        <el-table-column
          v-for="item in tableColumn"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
          :formatter="item.formatter"

        ></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="{row,$index}">
            <el-button type="text" size="small" @click.stop="handleModification($index, row)">编辑</el-button>
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
          :page-sizes="this.pageSizes"
          :page-size="queryData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="this.total"
        ></el-pagination>
      </div>
    </div>
    <el-dialog class="change-dialog dialog-common-style" :title="isNewBuile ? '新建仓库':'修改仓库'" :visible.sync="changeDialog" width="450px">
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
          <span v-if="this.isDefVal == true">{{this.changeData.status == 1 ? "启用" : "停用"}}</span>
          <div v-else>
            <el-radio-group v-model="changeData.status">
              <el-radio label="1">{{qy}}</el-radio>
              <el-radio label="0">{{qn}}</el-radio>
            </el-radio-group>
            <!-- <el-radio v-model="changeData.status" label="1">启用</el-radio>
            <el-radio v-model="changeData.status" label="0">停用</el-radio> -->
          </div>
        </el-form-item>
        <el-col>
          <el-form-item label="门店名称" class="select-input" prop="cinemaName">
              <span v-if="this.cinemaDefVal == true || this.isDefVal == true">{{this.changeData.cinemaName}}</span>
              <div v-else>
                <el-input
                        v-model="changeData.cinemaName"
                        clearable
                        @clear="onCinemalSumit1"
                        @focus="selectCinemalDialog1"
                        placeholder="请选择门店"
                ></el-input>
                <el-button @click="selectCinemalDialog1" type="primary" plain>{{changeData.cinemaName?"编辑":"选择"}}</el-button>
              </div>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="仓库编码" prop="code">
            <span class="Dspan">{{this.changeData.code}}</span>
          </el-form-item>
        </el-col>
        <el-form-item label="仓库名称" prop="name">
          <el-input v-model="changeData.name"></el-input>
        </el-form-item>
        <el-form-item label="仓库地址" prop="address">
          <el-input v-model="changeData.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary common-new-built" @click="handleModificationSubmit">保  存</el-button>
        <el-button @click="candleBtn">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit" :dialogFeedbackData="cinemaList"></cinemal-dialog>
    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="myCinemalDialog1" @onSumit="onCinemalSumit1" :dialogFeedbackData="cinemaList1"></cinemal-dialog>
  </div>
</template>

<script>
import qs from "qs";
import mixin from "cim/mixins/cim/paginationConfig.js";
import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
import mixins from "frame_cpm/mixins/cacheMixin";

// mixins: [mixins.cacheMixin],
//  cacheField:["GoodsListQueryData"],

export default {
  mixins: [mixin,mixins.cacheMixin],
  data() {
    var codePass = (rule, value, callback) => {
      if(value === "" || value === null){
        callback(new Error('选择门店会生成仓库编码'));
      }else{
        callback()
      }
    }
    return {
      qy:"启用",
      qn:"停用",
      // 加载loding
      tableLoding:false,
      // 缓存数据
      cacheField:["queryData"],
      isDefVal:"",
      cinemaDefVal:"",
      // 新建状态
      statusRadio:1,
      //查询数据
      cinemaList:[],
      cinemaList1:[],
      queryData: {
        pageSize: 10,
        page: 1,
        cinemaUid:null,
        cinemaName:null,
        name: null,
        code: null,
        status: "1"
      },
      // 数据总数
      total:0,
      tableColumn: [
        {
          label: "门店名称",
          key: "cinemaName"
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
                result = "停用";
                break;
              case 2:
                result = "盘点";
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
        cinemaName: [{ required: true, message: "请输入门店名称", trigger: "change" }],
        code:[{validator:codePass,trigger: "blur",required: true,}],
        name: [{ required: true, message: "请输入仓库名称", trigger: "change" }]
      }
    };
  },
  mounted() {
    if(this.queryData.cinemaUid == null || this.queryData.cinemaUid == ""){
      }else{
        this.queryDataIfNull(this.queryData)
        this.queryStoreEvent(this.queryData)
      }
    this.queryData.pageSize = this.pageSize
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
      if(this.queryData.cinemaUid == null || this.queryData.cinemaUid == ""){
        this.$message("请选择门店");
      }else{
        // this.queryData.status = this.queryData.status === "" ?
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
      this.tableLoding = true;
      this.$cimList.queryStorehouse(data).then( data => {
        let _self = this
          if (data && data.code === 200) {
            let newdata = data.data
            _self.tableData = newdata.list
            _self.total = newdata.total
            _self.tableLoding = false;
          } else {
            _self.tableLoding = false;
          }
          }).catch( err => {
            console.log(err)
          })
            if(this.queryData.status === null){
              this.queryData.status = ""
            }
    },
    selectCinemalDialog() {
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    selectCinemalDialog1() {
      this.$refs.myCinemalDialog1.handleDialog(true);
    },
    // 选泽门店回调
    onCinemalSumit(val = []) {
      if (val.length > 0) {
        this.queryData.cinemaName = val[0].name;
        this.queryData.cinemaUid = val[0].cinemaUid;
      } else {
        this.queryData.cinemaName = null;
        this.queryData.cinemaUid = null;
      }
      let cinemaL = []
      val.forEach((newval)=>{
        let newObj = {}
        newObj.cinemaUid = newval.cinemaUid
        newObj.name = newval.name
        cinemaL.push(newObj)
      })
      this.cinemaList = cinemaL
    },
    // 选泽门店回调
    onCinemalSumit1(val = []) {
      if (val.length > 0) {
        this.changeData.cinemaName = val[0].name;
        this.changeData.cinemaUid = val[0].cinemaUid;
        this.resStorehouseBuildCode(this.changeData.cinemaUid)
      } else {
        this.changeData.cinemaName = null;
        this.changeData.cinemaUid = null;
      }
       let cinemaL = []
      val.forEach((newval)=>{
        let newObj = {}
        newObj.cinemaUid = newval.cinemaUid
        newObj.name = newval.name
        cinemaL.push(newObj)
      })
      this.cinemaList1 = cinemaL
    },
    // 新增
    saveStoreEvent(data){
      this.$cimList.saveStorehouse(data).then( data => {
          if (data && data.code === 200) {
            this.queryData.cinemaName = this.changeData.cinemaName
            this.queryData.cinemaUid = this.changeData.cinemaUid
            this.queryDataIfNull(this.queryData)
            this.queryStoreEvent(this.queryData)
            this.cinemaList = this.cinemaList1
            this.cinemaList1 = []
            this.changeDialog = false;
            this.changeData ={
              status: "1",
              cinemaUid:null,
              cinemaName:null,
              name: null,
              address:null,
              code:null
            }
            this.$message("新建成功");
          } else {
            this.$message(data.msg);
          }
          }).catch( err => {
            this.$message(err);
          })
    },// 修改
    updateStoreEvent(){
      let data = {
        status:this.changeData.status,
        cinemaUid:this.changeData.cinemaUid,
        name:this.changeData.name,
        code:this.changeData.code,
        address:this.changeData.address,
        uid:this.changeData.uid
      }
      this.$cimList.updateStorehouse(data).then( data => {
        let _self = this
          if (data && data.code === 200) {
            _self.queryData.cinemaUid = _self.changeData.cinemaUid
            _self.queryData.cinemaName = _self.changeData.cinemaName
            _self.queryDataIfNull(_self.queryData)
            _self.queryStoreEvent(_self.queryData)
            _self.changeDialog = false
            _self.cinemaDefVal = false
            _self.$message("修改成功");
            _self.changeData ={
            status: "1",
            cinemaUid:null,
            cinemaName:null,
            name: null,
            address:null,
            code:null
          }
          } else {
            _self.$message(data.msg);
          }
          }).catch( err => {
            _self.$message(err);
            console.log(err)
          })
    },
    candleBtn(){
      this.changeDialog = false
      this.cinemaDefVal = false
      this.changeData ={
        status: "1",
        cinemaUid:null,
        cinemaName:null,
        name: null,
        address:null,
        code:null
      }
      this.resetForm('changeForm')
    },
    // 修改操作
    handleModification(index, row) {
      if(row.isDef == 1){
        this.isDefVal = true
      }else{
        this.isDefVal = false
      }
      this.cinemaDefVal = true
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
      this.$confirm("确认删除吗, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              //删除
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
      })
      .catch(() => {});
    },
    //确认提交修改
    handleModificationSubmit() {
      let _self = this
      _self.$refs['changeForm'].validate(valid => {
        if (valid) {
          if (_self.isNewBuile) {
            // _self.changeData.status = parseInt(this.changeData.status)
            _self.queryDataIfNull(_self.changeData)
            _self.saveStoreEvent(_self.changeData);
          } else {
            _self.updateStoreEvent();
          }
        } else {
          return false;
        }
      });

    },
   resetForm(formName) {
      this.$nextTick(()=>{
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
      })
    },
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.queryStoreEvent(this.queryData)
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.queryStoreEvent(this.queryData)
      // console.log(`当前页: ${val}`);
    },
    handleNewBuilt() {
      this.resetForm('changeForm')
      this.isDefVal = ""
      this.cinemaDefVal = false
      this.cinemaList1 = []
      this.changeData ={
        status: "1",
        cinemaUid:null,
        cinemaName:null,
        name: null,
        address:null,
        code:null
      }
      this.changeDialog = true;
      this.isNewBuile = true;
      
    },
    resStorehouseBuildCode(row){
      let val = {
          "cinemaUid":row
      }
      let _self = this
      _self.$cimList
        .storehouseBuildCode(val)
        .then(res => {
          if (res.code === 200) {
            this.changeData.code = res.data
          }else{
            _self.$message(res.msg);
          }
        })
        .catch(err => {});
    },
  }
};
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";

.storeHouse-style{
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
}
  .Dspan{
    display: inline-block;
    height:32px;
    width: 192px;
    line-height:32px;
  }
</style>