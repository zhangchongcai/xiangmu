<template>
  <div class="content">
    <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item to @click.native="handleCancel">库存管理</el-breadcrumb-item>
        <el-breadcrumb-item to>库存管理入库登记</el-breadcrumb-item>
        <el-breadcrumb-item>{{typeText}}领用退回入库</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="tittle"></div>
    <el-form
      :inline="true"
      :model="queryData"
      label-position="left"
      label-width="100px"
      label-suffix=":"
    >
      <!-- 基础信息 start-->
      <div>
        <div class="sub-tittle">基础信息</div>
        <el-row>
          <el-col :span="8">
            <el-form-item label="盘点单号">
              <span>{{queryData.billCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-input v-model="queryData.cinemaName" placeholder="请选择门店" style="width:150px;">
              <i class="el-icon-close el-input__icon" slot="suffix" @click="onCinemalSumit()"></i>
            </el-input>
            <el-button @click="selectCinemalDialog">选择</el-button>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="盘点方案">
              <el-select v-model="queryData.solutionUid" @focus="pdfnSelEvent()" @change="changePdfnEvent()">
                <el-option 
                  v-for = "item in pdfnData"
                  :key="item.uid"
                  :label="item.name"
                  :value="item.uid"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label=''>
              <el-select v-model="queryData.storeType" @focus="ckhjEvent()">
                <!-- <el-option label="全部" value></el-option> -->
                <el-option label="盘点仓库" value="1"></el-option>
                <el-option label="盘点货架" value="2"></el-option>
              </el-select>
              <span>:</span>
              <el-select v-model="queryData.storehouseCode" @focus="storeSelEvent()" @change="changeStoreEvent()">
                <el-option 
                  v-for = "item in storeData"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <!-- 基础信息 end-->
    <!-- {{this.queryData}} -->
      <!-- 商品清单 start-->
      <div>
<!--         <div class="text-right" v-if="routeQuery.type!=3">
          <el-button @click="selectedGoodsDialogVisible=true">添加商品</el-button>
        </div> -->
        <div class="sub-tittle">商品清单</div>
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
      <!-- 商品清单 end-->
      <!-- 选择供应商弹窗 -->
      <suppliers-dialog ref="mySuppliersDialog"></suppliers-dialog>
      <!-- 选择商品 -->
      <selected-goods
        :dialogVisible.sync="selectedGoodsDialogVisible"
        :dialogFeedbackData="goodList"
        @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
      ></selected-goods>
      <!-- 选择影院弹窗 -->
      <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit"></cinemal-dialog>
      <div class="submit-box">
        <el-button type="primary" @click="ThandleSubmit">保存并提交</el-button>
        <el-button type="primary" @click="ChandleSubmit">保存为草稿</el-button>
        <el-button @click="handleCancel">取 消</el-button>
      </div>
    </el-form>
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
        cinemaName:"万达影城",
        cinemaUid:"111111",
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
          label: "商品规格",
          key: "merSpec"
        },
        {
          label: "SKU编码",
          key: "skuCode"
        },
        {
          label: "基本单位",
          key: "unitName"
        },
        {
          label: "实盘库存数字",
          key: "checkStoreCount",
          edit:true,
        }
      ],
      // 表格数据
      tableData: [
        {
          supplierCode: "CG201904010001",
          supplierName: "中影德金影城客村丽影店",
          areaName: "美联经营部"
        }
      ]
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
        console.log(JSON.parse(this.$route.query.data))
      }
    },
    // 查询
    onQuery() {
      console.log(this.materialQueryData);

      this.findSemifinishedMater(this.materialQueryData);
    },
        // 选泽门店回调
    onCinemalSumit(val = []) {
      if (val.length > 0) {
        this.queryData.cinemaName = val[0].name;
        this.queryData.cinemaUid = val[0].cinemaUid;
      } else {
        this.queryData.cinemaName = "";
        this.queryData.cinemaUid = "";
      }
      console.log(val);
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
      this.queryData.saveStatus = 2
      this.resCheckBillSave(this.queryData)
      this.$router.go(-1);
    },
    ChandleSubmit() {
      this.queryData.saveStatus = 1
      this.resCheckBillSave(this.queryData)
      this.$router.go(-1);
    },
    //
    handleCancel() {
      this.$router.go(-1);
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
      if(this.queryData.storeType == "1"){
        this.rescheckBillStorehouse("111111")
      }else if(this.queryData.storeType == "2"){
        this.resCheckBillStorageRack("111111")
      }
    },
    // 盘点方案事件
    pdfnSelEvent(){
      if(this.queryData.cinemaName == ""){
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
        cinemaUid:row.uid
      }
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
        cinemaUid:row.uid
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
        cinemaUid:"111111",
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
            this.queryData.checkBillMerEntityList = res.data.list
            console.log(res)
            debugger
          } else {
            this.$message(res.msg);
            this.error(res.msg);
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
  .el-form-item {
    // margin-bottom: 10;
  }
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
</style>