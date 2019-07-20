<template>
<div class="grOut-style">
  <div class="content">
    <!-- <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item  :to="{ path: '/retail/InventoryManagement/goodsWarehousingOut/list' }">库存管理出库登记</el-breadcrumb-item>
        <el-breadcrumb-item>{{typeText}}报损出库</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <!-- {{this.routeQuery.type}} -->
    <!-- {{this.queryData}} -->
    <!-- {{this.storeData}} -->
    <!-- <div>**********************</div> -->
    <!-- {{this.goodList}} -->
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
                <el-form-item label="单据号">
                  <span>{{this.queryData.billCode}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item 
                  label="登记门店" 
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
                <el-form-item label="单据类型">
                  <span>{{SelbillType(this.queryData.billType)}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label=''
                  prop="storehouseCode"
                  :rules="[{ required: true, message: '选择出库仓库或货架',trigger: 'change' }]"
                  >
                  <span v-if="routeQuery.type=='3'">{{this.queryData.storeType == "1" ? '出库仓库' : '出库货架'}}</span>
                  <el-select v-model="queryData.storeType" @focus="ckhjEvent()" v-else>
                    <!-- <el-option label="全部" value></el-option> -->
                    <el-option label="出库仓库" value="1" key="1"></el-option>
                    <el-option label="出库货架" value="2" key="2"></el-option>
                  </el-select>
                  <span>:</span>
                  <span v-if="routeQuery.type=='3'">{{this.queryData.storehouseName}}</span>
                  <el-select v-model="queryData.storehouseCode" @focus="storeSelEvent()" @change="changeStoreEvent()" v-else
                    >
                    <el-option 
                      v-for = "item in storeData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <!-- 基础信息 end-->

        <!-- 商品清单 start-->
        <el-collapse-item title="商品清单" name="2">
          <div>
            <div class="text-right" v-if="routeQuery.type!='3'">
              <!-- <el-button @click="addgoodsEvent">添加商品</el-button> -->
              <button @click="addgoodsEvent" type="button" class="el-button el-button--primary is-plain">
                <span>添加商品</span>
              </button>
            </div>
            <el-table :data="goodList" stripe>
              <el-table-column
                v-for="item in routeQuery.type == '3' ? tableColumn1:tableColumn"
                :key="item.key"
                :prop="item.key"
                :label="item.label"
                :formatter="item.formatter"
              >

                <template slot-scope="{row,$index}" name="header">
                  <div v-if="item.edit">
                    <el-input size="small" v-model="row[item.key]" @change="changeUnitEvent(row,$index)" placeholder></el-input>
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
              <el-table-column label="操作" style="width:180px;" v-if="routeQuery.type!='3'">
                <template slot-scope="{row,$index}">
                  <el-button type="text" size="small" @click.stop="handleOperateEvent(row,$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="remark" label-width="60px" label="备注">
                  <span v-if="routeQuery.type=='3'">{{queryData.remark}}</span>
                  <el-input
                    type="textarea"
                    placeholder="请输入"
                    v-else
                    class="remark-input"
                    v-model="queryData.remark"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <!-- 商品清单 end-->
      </el-collapse>
      <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit" :dialogFeedbackData="[{cinemaUid:queryData.cinemaUid,cinemaName:queryData.cinemaName}]"></cinemal-dialog>
      <!-- 选择供应商弹窗 -->
      <suppliers-dialog ref="mySuppliersDialog"></suppliers-dialog>
      <!-- 选择商品 -->
      <selected-goods
        :dialogVisible.sync="selectedGoodsDialogVisible"
        :dialogFeedbackData="goodList"
        :cinemaUid="queryData.cinemaUid"
        @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
      ></selected-goods>
      <div class="submit-box">
        <el-button type="primary" @click="ThandleSubmit" v-if="this.routeQuery.type!='3'">保存并提交</el-button>
        <el-button type="primary" @click="ChandleSubmit" v-if="this.routeQuery.type!='3'">保存为草稿</el-button>
        <el-button @click="handleCancel">{{routeQuery.type !="3" ? "取消":"关闭"}}</el-button>
      </div>
    </el-form>
  </div>
</div>  
</template>

<script>
import qs from "qs";
import moment from "moment";
// import eventBus from 'cim/dialogs/eventbus.js';
import mixin from "cim/mixins/cim/paginationConfig.js";
import eventBus from "cim/mixins/cim/eventBus.js";
import suppliersDialog from "cim/components/suppliersDialog/suppliersDialog.vue";
import selectedGoods from "cim/dialogs/cimOutSelectedGoods/index.vue";
import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
export default {
  mixins: [mixin],
  data() {
    return {
      activeNames:['1','2','3'],
      storeData:[],
      selectedGoodsDialogVisible:false,
      goodList:[],
      //查询数据
      newqueryData:{},
      queryData: {
        billCode:"",
        remark:"",
        status:"",
        storeType:"1",
        storehouseCode:"",
        storehouseName:"",
        uid:"",
        dataList:[],
        cinemaUid:"",
        cinemaName:"",
        billType:2,
        approvalStatus:0
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
          label: "出库数量",
          key: "storeoutCount",
          edit:true,
        },
        {
          label: "基本单位成本价（元）",
          key: "price"
        },
        {
          label: "金额（元）",
          key: "amount"
        }
      ],      
      // 表格表头
      tableColumn1: [
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
          label: "出库数量",
          key: "storeoutCount",
        },
        {
          label: "基本单位成本价（元）",
          key: "price"
        },
        {
          label: "金额（元）",
          key: "amount"
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
      // this.routeQuery.type
      this.routeQuery.type = this.routeQuery.type.toString()
      switch (this.routeQuery.type) {
        case "1":
          // 新增
          // this.queryData.cinemaUid = JSON.parse(this.$route.query.data).cinemaUid
          // this.queryData.cinemaName = JSON.parse(this.$route.query.data).cinemaName
          this.resStoreInBillRegisterGetStoreInBillCode()
          // JSON.parse(this.$route.query.data).cinemaUid
          break;
        case "2":
          //编辑
          // this.queryData.cinemaUid = JSON.parse(this.$route.query.cinema).cinemaUid
          // this.queryData.cinemaName = JSON.parse(this.$route.query.cinema).cinemaName
          var datarow = JSON.parse(this.$route.query.data)
          this.resStoreInBillRegisterGetStoreInBillCode(datarow)
          let newArr = []
          let newObj = {}
          newObj.label = datarow.storehouseName
          newObj.value = datarow.storehouseCode
          newArr.push(newObj)
          this.storeData = newArr
          break;
        case "3":
          //查看
          // this.queryData.cinemaUid = JSON.parse(this.$route.query.cinema).cinemaUid
          // this.queryData.cinemaName = JSON.parse(this.$route.query.cinema).cinemaName
          var datarow = JSON.parse(this.$route.query.data)
          this.resStoreInBillRegisterGetStoreInBillCode(datarow)
          break;
      }
    },
    // 查询
    onQuery() {},
    changeUnitEvent(row,index){
      if(row.price == null || row.price == ""){
        row.price = 0
      }
      row.amount = parseInt(row.storeoutCount) * row.price    
    },
    // 获取分类列表
    // getCategoryTrees(param) {
    //   this.$cimList.headquartersGoods
    //     .setmeaLoadCategoies(param)
    //     .then(resData => {
    //       if (resData.code == 200) {
    //         this.categoryTrees = resData.data.children;
    //       }
    //     });
    // },
    // 选择商品回调
    selectedGoodsDialogCallBack(value) {
      this.goodList = value.data;
      console.log(value);
    },
    // 入库选择事件
    ckhjEvent(){
      this.resetForm('ruleForm')
      this.queryData.storehouseName = ""
      this.queryData.storehouseCode = ""
    },
    // 重置验证事件
    resetForm(formName) {
      this.$nextTick(()=>{
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
      })
    },
    // 仓库货架事件
    storeSelEvent(){
      if(this.queryData.cinemaUid === "" || this.queryData.cinemaUid === null){
        this.$message("请选择门店");
      }else{
        if(this.queryData.storeType == "1"){
          this.rescheckBillStorehouse(this.queryData.cinemaUid)
        }else if(this.queryData.storeType == "2"){
          this.resCheckBillStorageRack(this.queryData.cinemaUid)
        }
      }
      
    },
    // 根据仓库code获取名字
    changeStoreEvent(){
      let selectedWorkName = {};
       selectedWorkName = this.storeData.find((item)=>{
           return item.value === this.queryData.storehouseCode;
       });
       this.queryData.storehouseName = selectedWorkName.label
    },
    handleOperateEvent(row,index) {
      this.goodList.splice(index, 1)
    },
   // handleSubmit() {
   //    this.$refs["ruleForm"].validate(valid => {
   //      if (valid) {

   //      } else {
   //        return false;
   //      }
   //    });
   //  },
 
    ThandleSubmit() {
      if(this.goodList.length == 0){
        this.$message("请选择商品");
      }else{
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
              let newDataList = []
              this.goodList.forEach((val,index,arr)=>{
                let newObj = {}
                newObj.amount = val.amount
                newObj.merCode = val.merCode
                newObj.merName = val.merName
                newObj.merSpec = val.merSpec
                newObj.merUid = val.merUid
                newObj.price = val.price
                newObj.skuCode = val.skuCode
                newObj.skuName = val.skuName
                newObj.skuUid = val.skuUid
                newObj.storeCount = val.storeCount
                newObj.storeoutCount = val.storeoutCount
                newObj.uid = val.uid
                newObj.unitName = val.unitName
                newObj.unitUid = val.unitUid
                newDataList.push(newObj)
              })
              this.queryData.dataList = newDataList
              this.queryData.status = 2
              this.queryData.storeType = parseInt(this.queryData.storeType)
              if(this.routeQuery.type == "1"){
                this.resStoreInBillRegisterSave(this.queryData,"新增")
              }else if(this.routeQuery.type == "2"){
                this.resStoreInBillRegisterSave(this.queryData,"修改")
              }
              // this.handleCancel()
          } else {
            return false;
          }
        });
      }
    },    
    ChandleSubmit() {
      if(this.goodList.length == 0){
        this.$message("请选择商品");
      }else{
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
              let newDataList = []
              this.goodList.forEach((val,index,arr)=>{
                let newObj = {}
                newObj.amount = val.amount
                newObj.merCode = val.merCode
                newObj.merName = val.merName
                newObj.merSpec = val.merSpec
                newObj.merUid = val.merUid
                newObj.price = val.price
                newObj.skuCode = val.skuCode
                newObj.skuName = val.skuName
                newObj.skuUid = val.skuUid
                newObj.storeCount = val.storeCount
                newObj.storeoutCount = val.storeoutCount
                newObj.uid = val.uid
                newObj.unitName = val.unitName
                newObj.unitUid = val.unitUid
                newDataList.push(newObj)
              })
              this.queryData.dataList = newDataList
              this.queryData.status = 1
              this.queryData.storeType = parseInt(this.queryData.storeType)
              if(this.routeQuery.type == "1"){
                this.resStoreInBillRegisterSave(this.queryData,"新增")
              }else if(this.routeQuery.type == "2"){
                this.resStoreInBillRegisterSave(this.queryData,"修改")
              }
          } else {
            return false;
          }
        });
      }
    },
    handleCancel() {
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
    SelbillType(type) {
      switch (type) {
        case 1:
          return "采购退货出库";
          break;
        case 2:
          return "报损出库";
          break;
        case 3:
          return "领用出库";
          break;
        case 4:
          return "调拨出库";
          break;
      }
    },
    // 选泽门店回调
    onCinemalSumit(val = []) {
      if(val.length == 0){
        this.$nextTick(() => {
          this.queryData.storehouseCode = ""
          this.queryData.storehouseName = ""  
        })
      }
      if (val.length > 0) {
        this.queryData.cinemaName = val[0].name;
        this.queryData.cinemaUid = val[0].uid;
      } else {
        this.queryData.cinemaName = null;
        this.queryData.cinemaUid = null;
      }
      console.log(val);
    },
    selectCinemalDialog() {
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    selectSuppliersDialog() {
      this.$refs.mySuppliersDialog.handleDialog(true);
    },
    // 请求仓库列表
    rescheckBillStorehouse(cinemaUid){
      let val = {
        cinemaUid:cinemaUid
      }
      this.$cimList.inventoryManagement
        .checkBillStorehouse(val)
        .then(res => {
          if (res.code === 200) {
            this.storeData = res.data
            let newArr = []
            this.storeData.forEach((val,index,arr)=>{
              let newObj = {}
              newObj.label = val.name
              newObj.value = val.code
              newArr.push(newObj)
            })
            this.storeData = newArr
            console.log(res)
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {});
    },
    // 请求货架列表
    resCheckBillStorageRack(cinemaUid){
      let val = {
        cinameUid:cinemaUid
      }
      this.$cimList.inventoryManagement
        .checkBillStorageRack(val)
        .then(res => {
          if (res.code === 200) {
            this.storeData = res.data
            let newArr = []
            this.storeData.forEach((val,index,arr)=>{
              let newObj = {}
              newObj.label = val.name
              newObj.value = val.code
              newArr.push(newObj)
            })
            this.storeData = newArr
            console.log(res)
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {});
    },
    // 请求出库单据号
    resStoreInBillRegisterGetStoreInBillCode(row){
      let val = {
        uid:row == undefined ? "":row.uid
      }
      this.$cimList.goodsWarehousingOut
        .storeoutBillToPage(val)
        .then(res => {
          if (res.code === 200) {
            if(row == undefined){
              this.queryData.billCode = res.data.storeoutBill.billCode
            }else{
              this.queryData = res.data.storeoutBill
              this.goodList = res.data.storeoutBill.dataList
              this.queryData.storeType = this.queryData.storeType.toString()
            }
            console.log(res)
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {});
    },
    // 请求新增保存
    resStoreInBillRegisterSave(val,type){
      this.$cimList.goodsWarehousingOut
        .storeoutBillSave(val)
        .then(res => {
          if (res.code === 200) {
            
              this.handleCancel()
              
              this.$message(type+"成功");
          } else {
            this.queryData.storeType = this.queryData.storeType.toString()
            this.$message(res.msg);
          }
        })
        .catch(err => {});
    },
    // 添加商品
    addgoodsEvent(){
       if (!this.queryData.cinemaUid) {
            this.$message({
                message: "请选择一个门店!"
            });
            return;
        }
        this.selectedGoodsDialogVisible = true
    },
    // 请求修改保存
    resStoreInUpdate(val){
      this.$cimList.goodsWarehousingIn
        .storeInUpdate(val)
        .then(res => {
          if (res.code === 200) {
            console.log(res)
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
  },
  watch:{
    goodList: {
      handler(newVale, oldValue) {
      },
      deep: true
    },
  },
};
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";
.grOut-style{
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
  .el-form-item{
    margin-bottom: 14px;
  }
}  
</style>