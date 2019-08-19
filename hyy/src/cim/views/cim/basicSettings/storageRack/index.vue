<template>
  <div class="retail-style">
    <div class="common-header storageRack-style">
      <el-form
        :inline="true"
        :model="queryData"
        label-position="left"
        label-suffix="："
      >
        <el-form-item label="门店名称" class="select-input">
            <el-input
                    v-model="queryData.cinameName"
                    clearable
                    @clear="onCinemalSumit"
                    @focus="selectCinemalDialog"
                    placeholder="请选择门店"
            ></el-input>
            <el-button @click="selectCinemalDialog" type="primary cinemaSel-btn" plain>选择</el-button>
        </el-form-item>
        <el-form-item label="货架编码">
          <el-input v-model="queryData.code" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="货架名称">
          <el-input v-model="queryData.name" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="0"></el-option>
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
      <el-table :data="tableData" stripe v-loading="tableLoding" :height="this.defaultTableHeight">
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
    <el-dialog class="change-dialog dialog-common-style" :title="isNewBuile ? '新建货架':'修改货架'" :visible.sync="changeDialog" width="450px">
      <el-form
        :inline="true"
        ref="changeForm"
        :model="changeData"
        label-position="left"
        label-width="100px"
        label-suffix="："
        :rules="changeRules"
        @close="candleBtn"
      >
      <!-- {{changeData.status}} -->
        <el-form-item label="状态" prop="status" > 
          <span v-if="this.isDefVal == true">{{this.changeData.status == 1 ? "启用" : "停用"}}</span>
          <div v-else>
            <el-radio-group v-model="changeData.status">
              <el-radio label="1">{{qy}}</el-radio>
              <el-radio label="0">{{qn}}</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-col>
          <el-form-item label="门店名称" class="select-input" prop="cinameName">
              <span v-if="this.cinemaDefVal == true || this.isDefVal == true">{{this.newcinameName}}</span>
              <div v-else>
                <el-input
                        v-model="newcinameName"
                        clearable
                        @clear="onCinemalSumit1"
                        @focus="selectCinemalDialog1"
                        placeholder="请选择门店"
                ></el-input>
                <el-button @click="selectCinemalDialog1" type="primary" plain>选择</el-button>
              </div>
          </el-form-item>
        </el-col>
        <el-col>
          <el-form-item label="货架编码" prop="code">
            <span class="Dspan">{{this.changeData.code}}</span>
          </el-form-item>
        </el-col>
        <el-form-item label="货架名称" prop="name">
          <el-input v-model="changeData.name"></el-input>
        </el-form-item>
        <el-form-item label="货架地址" prop="address">
          <el-input v-model="changeData.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button type="primary" @click="handleModificationSubmit">保  存</el-button>
        <el-button @click="candleBtn">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit" :dialogFeedbackData="[{cinemaUid:queryData.cinameUid,cinemaName:queryData.cinameName}]"></cinemal-dialog>
    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="myCinemalDialog1" @onSumit="onCinemalSumit1" :dialogFeedbackData="[{cinemaUid:changeData.cinameUid,cinemaName:changeData.cinameName}]"></cinemal-dialog>
  </div>
</template>

<script>
import qs from "qs";
import mixin from "cim/mixins/cim/paginationConfig.js";
import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
import mixins from "frame_cpm/mixins/cacheMixin";
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
      // 缓存数据
      cacheField:["queryData"],
      tableLoding:false,
      cinemaList:[],
      cinemaList1:[],
      newcinameName:"",
      isDefVal:"",
      cinemaDefVal:"",
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
      total:0,
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
          key: "status",
          formatter(row, column, status) {
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
        cinameUid:"",
        cinameName:"",
        name: "",
        address:"",
        code:""
      },
      isNewBuile: true,
      changeDialog: false,
      changeRules: {
        newcinameName: [{ required: true, message: '请选择门店', trigger: 'blur' }],
        name: [{ required: true, message: '请输入货架名称', trigger: 'change' }],
        code: [{ required: true,validator:codePass, trigger: 'change'}]
      }
    };
  },
  mounted() {
    this.init();
    this.queryData.pageSize = this.pageSize
  },
  watch:{
    changeData: {
      handler(newVale, oldValue) {
        console.log(newVale)
      },
      deep: true
    },
  },
  components: {
    cinemalDialog
  },
  methods: {
    // 初始化
    init() {
      if(this.queryData.cinameName == ""){
      }else{
        this.queryStoreEvent(this.queryData)
      }
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
    setCinema(val = []) {
      if (val.length > 0) {
        this.queryData.cinameName = val[0].name;
        this.queryData.cinameUid = val[0].uid || val[0].cinemaUid;
      } else {
        this.queryData.cinameName = "";
        this.queryData.cinameUid = "";
      }
      let cinemaL = []
      val.forEach((newval)=>{
        let newObj = {}
        newObj.cinemaUid = newval.cinemaUid || newval.uid
        newObj.name = newval.name
        cinemaL.push(newObj)
      })
      this.cinemaList = cinemaL
      console.log(val);
    },
    // 选泽门店回调
    onCinemalSumit(val = [],type) {
      console.log(val," 选泽门店回调",type);
      if (val.length > 0) {
        if(type=="default"){
          if(val.length==1){
            this.setCinema(val)
          }
        }else{
          this.setCinema(val)
        }
      } else {
        this.setCinema()
      }
    },
    // 选泽门店回调
    setCinema1(val = []) {
      let cinemaL = []
      val.forEach((newval)=>{
        let newObj = {}
        newObj.cinemaUid = newval.cinemaUid
        newObj.name = newval.name
        cinemaL.push(newObj)
      })
      this.cinemaList1 = cinemaL
      if (val.length > 0) {
        this.changeData.cinameName = val[0].name;
        this.changeData.cinameUid = val[0].uid || val[0].cinemaUid;
        this.newcinameName = val[0].name;
        this.resStoreCode(this.cinemaList1)
      } else {
        this.changeData.cinameName = "";
        this.changeData.cinameUid = "";
        this.newcinameName = "";
      }
    },
    // 选泽门店回调
    onCinemalSumit1(val = [],type) {
      console.log(val," 选泽门店回调",type);
      if (val.length > 0) {
        if(type=="default"){
          if(val.length==1){
            this.setCinema1(val)
          }
        }else{
          this.setCinema1(val)
        }
      } else {
        this.setCinema1()
      }
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
      this.tableLoding = true;
      this.$cimList.findStorageRackList(data).then( data => {
        let _self = this
          if (data && data.code === 200) {
            let newdata = data.data
            _self.tableData = newdata.list
            _self.tableLoding = false;
            // _self.tableData.forEach((val,index,arr)=>{
            //   val.cinemaName = _self.queryData.cinemaName
            // })
            _self.total = newdata.total
          } else {
             _self.tableLoding = false;
            _self.$message(data.msg);
          }
          })
    },
    // 新增
    saveStoreEvent(data){
      this.$cimList.saveStorageRack(data).then( data => {
        let _self = this
          if (data && data.code === 200) {
            _self.queryData.cinameName = _self.newcinameName
            _self.queryData.cinameUid = _self.changeData.cinameUid
            _self.queryStoreEvent(_self.queryData)
            _self.changeDialog = false;
            _self.cinemaList = _self.cinemaList1
            _self.$message("新建成功");
            this.changeData ={
              status: "1",
              cinameUid:null,
              cinameName:null,
              name: null,
              address:null,
              code:null
            }
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
            _self.changeDialog = false;
            _self.cinemaDefVal = false
            _self.$message("修改成功");
            this.changeData ={
              status: "1",
              cinameUid:null,
              cinameName:null,
              name: null,
              address:null,
              code:null
            }
          } else {
            _self.$message(data.msg);
          }
          })
    },
    candleBtn(){
      this.changeData ={
        status: "1",
        cinameUid:null,
        cinameName:null,
        name: null,
        address:null,
        code:null
      }
      this.isDefVal = ""
      this.changeDialog = false
      this.cinemaDefVal = false
      this.resetForm('changeForm')
    },
    resetForm(formName) {
      this.$nextTick(()=>{
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
      })
    },
    // 修改操作
    handleModification(index, row) {
      // this.resetForm('changeForm')
      if(row.isDef == 1){
        this.isDefVal = true
      }else{
        this.isDefVal = false
      }
      this.cinemaDefVal = true
      this.changeData.status = row.status.toString();
      this.changeData.cinameUid = row.cinameUid;
      this.changeData.cinameName = row.storeName;
      this.changeData.name = row.name;
      this.changeData.code = row.code;
      this.changeData.address = row.address;
      this.changeData.storeName = row.storeName;
      this.newcinameName = row.storeName;
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
          this.$cimList.delStorageRack(row).then( data => {
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
        })
        .catch(() => {});
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
          
        } else {
          console.log("error submit!!");
          return false;
        }
      });
      // _self.isDefVal = ""
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
      this.resetForm('changeForm')
      this.isDefVal = ""
      this.cinemaDefVal = false
      this.cinemaList1 = []
      this.changeData ={
        status: "1",
        cinameUid:null,
        cinameName:null,
        name: null,
        address:null,
        code:null
      }
      this.newcinameName = ""
      this.changeDialog = true;
      this.isNewBuile = true;
      
    },
    resStoreCode(row){
      let val= {
        "cinameUid":row[0].cinemaUid
      }
      let _self = this
      _self.$cimList
        .storageRackGetStorageRackCode(val)
        .then(res => {
          if (res.code === 200) {
            _self.changeData.code = res.data
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
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";
.storageRack-style{
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