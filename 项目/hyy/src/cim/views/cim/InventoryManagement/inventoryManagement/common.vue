<template>
<div class="imtc-style">
  <div class="content">
    <!-- <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/retail/InventoryManagement/inventoryManagement/list'}">盘点单管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{typeText}}盘点单</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <div class="tittle"></div>
    <el-form
      :inline="true"
      ref="ruleForm"
      :model="queryData"
      label-position="left"
      label-width="100px"
      label-suffix=":"
    >
      <el-collapse  v-model="activeNames">
        <!-- 基础信息 start-->
        <el-collapse-item title="基础信息" name="1">
          <div>
            <el-row>
              <el-col :span="10">
                <el-form-item label="盘点单号">
                  <span>{{queryData.billCode}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item 
                  label="盘点门店" 
                  class="select-input"
                  prop="cinemaName"
                  :rules="[{ required: routeQuery.type==3 ? false : true, message: '选择登记门店',trigger: 'change' }]"
                  >
                  <template v-if="routeQuery.type=='1'">     
                    <el-input
                            v-model="queryData.cinemaName"
                            clearable
                            @clear="onCinemalSumit"
                            @focus="selectCinemalDialog"
                            placeholder="请选择门店"
                    ></el-input>
                    <el-button @click="selectCinemalDialog" type="primary cinemaSel-btn" plain>选择</el-button>
                  </template>
                  <span v-else>{{this.queryData.cinemaName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item 
                  label="盘点方案"
                  prop="solutionName"
                  :rules="[{ required: routeQuery.type==3 ? false : true, message: '请选择盘点方案',trigger: 'change' }]"
                  >
                  <el-select v-model="queryData.solutionUid" @focus="pdfnSelEvent()" @change="changePdfnEvent()" v-if="routeQuery.type==1">
                    <el-option 
                      v-for = "item in pdfnData"
                      :key="item.uid"
                      :label="item.name"
                      :value="item.uid"
                    ></el-option>
                  </el-select>
                  <span v-if="routeQuery.type==2">{{queryData.solutionName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item 
                  label=''
                  prop="storehouseName"
                  :rules="[{ required: routeQuery.type==3 ? false : true, message: '请选择盘点仓库或货架',trigger: 'change' }]"
                  >
                  <el-select v-model="queryData.storeType" @focus="ckhjEvent()" v-if="routeQuery.type==1">
                    <!-- <el-option label="全部" value></el-option> -->
                    <el-option label="盘点仓库" value="1"></el-option>
                    <el-option label="盘点货架" value="2"></el-option>
                  </el-select>
                  <span v-if="routeQuery.type==2">{{queryData.storeType == "1" ? "盘点仓库" : "盘点货架"}}</span>
                  <span>:</span>
                  <el-select v-model="queryData.storehouseCode" @focus="storeSelEvent()" @change="changeStoreEvent()" v-if="routeQuery.type==1">
                    <el-option 
                      v-for = "item in storeData"
                      :key="item.code"
                      :label="item.name"
                      :value="item.code"
                    ></el-option>
                  </el-select>
                  <span v-if="routeQuery.type==2">{{queryData.storehouseName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <!-- 基础信息 end-->
        <!-- 商品清单 start-->
        <el-collapse-item title="盘点商品清单" name="2">
          <div>
            <el-table :data="queryData.checkBillMerEntityList" stripe height="300"> 
              <el-table-column
                v-for="item in tableColumn"
                :key="item.key"
                :prop="item.key"
                :label="item.label"
                :formatter="item.formatter"
              >
                <template slot-scope="{row}" name="header">
                  <div v-if="item.edit">
                    <el-input size="small" v-model="row[item.key]" placeholder></el-input>
                  </div>
                  <div v-else-if="item.selsect">
                    <el-select  v-model="row[item.key]">
                      <el-option key="0" label="瓶" value="0"></el-option>
                      <el-option key="1" label="箱" value="1"></el-option>
                    </el-select>
                  </div>
                  <div v-else>
                    <span>{{row[item.key]}}</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="bunesRate" label-width="60px" label="备注">
                  <span v-if="routeQuery.type==3">{{queryData.remarks}}</span>
                  <el-input
                    type="textarea"
                    placeholder="请输入"
                    v-else
                    class="remark-input"
                    v-model="queryData.remarks"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <!-- 商品清单 end-->
      </el-collapse>
      <!-- 选择供应商弹窗 -->
      <suppliers-dialog ref="mySuppliersDialog"></suppliers-dialog>
      <!-- 选择商品 -->
      <selected-goods
        :dialogVisible.sync="selectedGoodsDialogVisible"
        :dialogFeedbackData="goodList"
        @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
      ></selected-goods>
      <!-- 选择影院弹窗 -->
      <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit" :dialogFeedbackData="saleCinemaList"></cinemal-dialog>
      <div class="submit-box">
        <el-button type="primary" @click="ThandleSubmit">保存并提交</el-button>
        <el-button type="primary" @click="ChandleSubmit" v-if="this.queryData.status != 2">保存为草稿</el-button>
        <el-button @click="handleCancel">{{routeQuery.type !="3" ? "取消":"关闭"}}</el-button>
      </div>
    </el-form>
  </div>
</div>  
</template>

<script>
import qs from "qs";
import moment from "moment";
import mixin from "cim/mixins/cim/paginationConfig.js";
import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
import suppliersDialog from "cim/components/suppliersDialog/suppliersDialog.vue";
import selectedGoods from "cim/dialogs/cimSelectedGoods/index.vue";
export default {
  mixins: [mixin],
  data() {
    return {
      activeNames:['1','2','3'],
      saleCinemaList:[],
      // 盘点商品当前分页数
      currentPage:"",
      // 盘点商品总数
      totalPag:"",

      selectedGoodsDialogVisible:false,
      goodList:[],
      pdfnData:[],
      storeData:[],
      //查询数据
      queryData: {
        billCode:"",
        cinemaName:"",
        cinemaUid:"",
        remarks:"",
        saveStatus:"",
        solutionName:"",
        solutionUid:"",
        storeType:"1",
        storehouseCode:"",
        storehouseName:"",
        checkBillMerEntityList:[]
      },
      options: [
        {
          label: "江苏",
          cities: []
        },
        {
          label: "浙江",
          cities: []
        }
      ],
      props: {
        value: "label",
        children: "cities"
      },
      total: 0,
      // 表格表头
      tableColumn: [
        {
          label: "商品名称",
          key: "merName"
        },
        {
          label: "SKU编码",
          key: "skuCode"
        },
        {
          label: "商品规格",
          key: "merSpec"
        },
        {
          label: "基本单位",
          key: "unitName"
        },
        {
          label: "实盘库存数",
          key: "checkStoreCount",
          edit:true,
        }
      ],
      // 表格数据
      tableData: []
    };
  },
  mounted() {
    this.init();
    console.log(this.routeMerData);
  },

  methods: {
    init() {
      if(this.$route.query.type == "1"){
        this.resCheckBillCreateBillCode()
        // console.log(JSON.parse(this.$route.query.data))
      }else if(this.$route.query.type == "2"){
        this.queryData = JSON.parse(this.$route.query.data)
        console.log(this.queryData)
      }
    },
    // 查询
    onQuery() {
      console.log(this.materialQueryData);

      this.findSemifinishedMater(this.materialQueryData);
    },
        // 选泽门店回调
    onCinemalSumit(data = []) {
      this.clearQueryData()
      if (data.length > 0) {
        this.queryData.cinemaName = data[0].name || data[0].cinemaName;
        this.queryData.cinemaUid = data[0].uid || data[0].cinemaUid;
      } else {
        this.queryData.cinemaName = "";
        this.queryData.cinemaUid = "";
      }
      let newArr = []
      data.forEach((val,index,arr)=>{
        let newObj = {}
        newObj.cinemaUid = val.cinemaUid ||  val.uid
        newObj.name = val.cinemaName || val.name
        newArr.push(newObj)
      })
      this.saleCinemaList = newArr
    },
    // 获取分类列表
    getCategoryTrees(param) {
      this.$cimList.headquartersGoods
        .setmeaLoadCategoies(param)
        .then(resData => {
          if (resData.code == 200) {
            this.categoryTrees = resData.data.children;
          }
        });
    },
    handleOperateEvent(row,index) {
      this.goodList.splice(index, 1)
      console.log(this.goodList)
    },
    //
    ThandleSubmit() {
      let newAvtive = {}
      let dqActive = ""
      this.queryData.checkBillMerEntityList.some((val,newindex,arr)=>{
        let check = /(^[1-9][0-9]{0,})|(^0)/g
        if(val.checkStoreCount === "" || val.checkStoreCount === null || !check.test(val.checkStoreCount)){
          return newAvtive = {a1:true,a2:val}
        }
      })
      if(newAvtive.a1 === true){
        this.$message(newAvtive.a2.merName+":没有填入实盘库存数字");
      }else{
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            if(this.$route.query.type == "1"){
              this.queryData.saveStatus = 2
              this.queryData.checkBillMerEntityList.forEach((val,index,arr)=>{
                delete val.uid
              })
              console.log(this.queryData.checkBillMerEntityList)
              this.resCheckBillSave(this.queryData)
            }else if(this.$route.query.type == "2"){
              this.queryData.saveStatus = 2
              this.resCheckBillUpdate(this.queryData)
            }
          }else{
            return false;
          }
        })  
      }
    },
    ChandleSubmit() {
      let newAvtive = {}
      let dqActive = ""
      this.queryData.checkBillMerEntityList.some((val,newindex,arr)=>{
        let check = /(^[1-9][0-9]{0,})|(^0)/g
        if(val.checkStoreCount === "" || val.checkStoreCount === null || !check.test(val.checkStoreCount)){
          return newAvtive = {a1:true,a2:val}
        }
      })
      if(newAvtive.a1 === true){
        this.$message(newAvtive.a2.merName+":实盘库存数必须大于等于0");
      }else{
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            if(this.$route.query.type == "1"){
              this.queryData.saveStatus = 1
              console.log(this.queryData)
              this.queryData.checkBillMerEntityList.forEach((val,index,arr)=>{
                delete val.uid
              })
              this.resCheckBillSave(this.queryData)
              
            }else if(this.$route.query.type == "2"){
              this.queryData.saveStatus = 2
              this.resCheckBillUpdate(this.queryData)
            }
          }else{
            return false;
          }
        }) 
      }
    },
    //
    handleCancel() {
      console.log(JSON.stringify(this.queryData))
      this.returnList({
        returnType:true,
        cinema: JSON.stringify(this.queryData)
      });
    },
    returnList(param) {
      this.$router.push({
        path: "list",
        query: param
      });
    },
    saleCinemaType(type) {
      switch (type) {
        case "0":
          return "指定门店";
          break;
        case "1":
          return "全部门店";
          break;
        case "2":
          return "排除门店";
          break;
      }
    },
    selectCinemalDialog() {
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    clearQueryData(){
      this.queryData.solutionName = ""
      this.queryData.solutionUid = ""
      this.queryData.storehouseCode = ""
      this.queryData.storehouseName = ""
      this.queryData.checkBillMerEntityList = []

    },
    selectSuppliersDialog() {
      this.$refs.mySuppliersDialog.handleDialog(true);
    },
    ckhjEvent(){
      this.queryData.storehouseName = ""
      this.queryData.storehouseCode = ""
    },
    selectedGoodsDialogCallBack(value) {
      this.goodList = value.data;
      console.log(value);
    },
    // 仓库货架事件
    storeSelEvent(){
      if(this.queryData.cinemaUid == "" || this.queryData.cinemaUid == undefined || this.queryData.cinemaUid == null){
        this.$message("请选择门店");
      }else{
        if(this.queryData.storeType == "1"){
          this.rescheckBillStorehouse(this.queryData.cinemaUid)
        }else if(this.queryData.storeType == "2"){
          this.resCheckBillStorageRack(this.queryData.cinemaUid)
        }
      }
    },
    // 盘点方案事件
    pdfnSelEvent(){
      if(this.queryData.cinemaUid == "" || this.queryData.cinemaUid == undefined || this.queryData.cinemaUid == null){
        this.$message("请选择门店");
      }else{
        this.resCheckBillNames("row")
      }    
    },
    changePdfnEvent(){
      let selectedWorkName = {};
       selectedWorkName = this.pdfnData.find((item)=>{
           return item.uid === this.queryData.solutionUid;
       });
       this.queryData.solutionName = selectedWorkName.name
       if(this.queryData.solutionUid == ""){
       }else{
        this.resCheckBillCheckSolutionMerInfo()
      }
    },
    changeStoreEvent(){
      let selectedWorkName = {};
       selectedWorkName = this.storeData.find((item)=>{
           return item.code === this.queryData.storehouseCode;
       });
       this.queryData.storehouseName = selectedWorkName.name
    },
    // 请求仓库列表
    rescheckBillStorehouse(row){
      let val = {
        cinemaUid:row
      }
      console.log(val)
      this.$cimList.inventoryManagement
        .checkBillStorehouse(val)
        .then(res => {
          if (res.code === 200) {
            this.storeData = res.data
            console.log(res)
          } else {
            this.$message(res.msg);
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    // 请求货架列表
    resCheckBillStorageRack(row){
      let val = {
        cinameUid:row
      }
      this.$cimList.inventoryManagement
        .checkBillStorageRack(val)
        .then(res => {
          if (res.code === 200) {
            this.storeData = res.data
            console.log(res)
          } else {
            this.$message(res.msg);
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    // 请求盘点单号
    resCheckBillCreateBillCode(){
      this.$cimList.inventoryManagement
        .checkBillCreateBillCode()
        .then(res => {
          if (res.code === 200) {
            this.queryData.billCode = res.data
          } else {
            this.$message(res.msg);
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    // 请求盘点方案
    resCheckBillNames(row){
      let val = {
        cinemaUid:this.queryData.cinemaUid,
      }
      this.$cimList.inventoryManagement
        .checkBillNames(val)
        .then(res => {
          if (res.code === 200) {
            this.pdfnData = res.data
          } else {
            this.$message(res.msg);
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    // 请求查询盘点商品清单列表
    resCheckBillCheckSolutionMerInfo(row){
      this.currentPage = 1
      let val = {
        uid:this.queryData.solutionUid,
        page:this.currentPage,
        pageSize:10
      }
      this.$cimList.inventoryManagement
        .checkBillCheckSolutionMerInfo(val)
        .then(res => {
          if (res.code === 200) {
            this.queryData.checkBillMerEntityList = res.data.list
            this.totalPag = res.data.total
            console.log(res)
          } else {
            this.$message(res.msg);
            this.error(res.msg);
          }
        })
        .catch(err => {});
    },
    // 请求新增盘点单
    resCheckBillSave(row){
      this.$cimList.inventoryManagement
        .checkBillSave(row)
        .then(res => {
          if (res.code === 200) {
            this.handleCancel()
            this.$message("新增成功");
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {});
    },
    // 请求修改盘点单
    resCheckBillUpdate(row){
      this.$cimList.inventoryManagement
        .checkBillUpdate(row)
        .then(res => {
          if (res.code === 200) {
            // this.queryData.checkBillMerEntityList = res.data.list
            console.log(res)
             this.handleCancel()
            this.$message("修改成功");
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {});
    },
  },
  computed: {
    routeQuery() {
      return this.$route.query;
    },
    routeMerData() {
      if (this.$route.query.data) {
        return JSON.parse(this.$route.query.data);
      } else {
        return {};
      }
    },
    typeText() {
      //1新建，2修改，3查看
      switch (this.routeQuery.type) {
        // 单品
        case "1":
          return "新建";
          break;
        // 财务
        case "2":
          return "修改";
          break;
        // 合成品
        case "3":
          return "查看";
          break;
      }
    }
  },
  components: {
    cinemalDialog,
    suppliersDialog,
    selectedGoods
  }
};
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";
.imtc-style{
  .basic-input {
    min-width: 250px;
  }
  .select-input {
    .el-input {
      width: 65%;
    }
  }
  .remark-input {
    min-width: 450px;
    margin-top: 10px;
    input {
      width: 80%;
    }
  }
  .putaway-timer {
    .el-form-item__content {
      min-width: 150px;
    }
  }

  .recipe-box {
    margin: 30px 0;
  }
  .recipe-tittle-box {
    margin: 10px 0;
  }
  .recipe-tittle {
    line-height: 40px;
    text-align: center;
    font-size: 20px;
  }
  .change-dialog {
    .el-form-item__content {
      width: 60%;
    }
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 180px;
  }
  .delete-recipe-group {
    font-size: 20px;
  }
  .recipe-name-inp {
    width: 200px;
  }
  .price-inp {
    width: 100px;
  }
  .content {
    padding: 20px;
  }
  .tittle {
    font-weight: 900;
    font-size: 18px;
  }
  .sub-tittle {
    height: 40px;
    line-height: 40px;
    width: 100%;
    background: #f5f5f5;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .submit-box {
    margin-top: 50px;
    text-align: center;
  }
  .table-box {
    margin-top: 10px;
  }
  .both-edit-inp {
    width: 60px;
  }
  .breadcrumb {
    margin-bottom: 30px;
  }
  .text-right {
    text-align: right;
    margin-bottom: 10px;
  }
  .endTime-input {
    width: 110px;
  }
  .empty-box {
    padding: 10px;
    .selected-content {
      margin-top: 6px;
    }
    .el-button {
      padding-left: 0;
      padding-right: 0;
    }
    .empty-content {
      height: 300px;
      overflow-y: auto;
      li {
        margin-top: 5px;
      }
    }
    .el-tag {
      width: 100%;
    }
    .el-tag .el-icon-close {
      float: right;
      top: 4px;
    }
  }
  .el-form-item{
    margin-bottom: 14px;
  }
}
</style>