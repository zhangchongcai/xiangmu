<template>
<div class="grIn-style">
  <!-- {{this.goodList}} -->
  <!-- {{"111111111111111"+this.queryData.storehouseCode}} -->
  <div class="content">
    <!-- <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item  :to="{ path: '/retail/InventoryManagement/goodsWarehousingIn/list' }">库存管理入库登记</el-breadcrumb-item>
        <el-breadcrumb-item>{{typeText}}领用退回入库</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <div class="tittle"></div>
    <el-form
      :inline="true"
      ref="ruleForm"
      :model="queryData"
      label-position="left"
      label-width="100px"
      label-suffix="："
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
                <el-form-item 
                  label='' 
                  prop="storehouseCode"
                  :rules="[{ required: true, message: '选择出库仓库或货架',trigger: 'change' }]"
                  >
                  <span v-if="routeQuery.type=='3'" class="wid100">{{this.queryData.storeType == "1" ? '入库仓库：' : '入库货架：'}}</span>
                  <el-select v-model="queryData.storeType" @focus="ckhjEvent()" v-else>
                    <!-- <el-option label="全部" value></el-option> -->
                    <el-option label="入库仓库" value="1" key="1"></el-option>
                    <el-option label="入库货架" value="2" key="2"></el-option>
                  </el-select>
                  <!-- <span>:</span> -->
                  <span v-if="routeQuery.type=='3'">{{this.queryData.storehouseName}}</span>
                  <el-select v-model="queryData.storehouseCode" @focus="storeSelEvent()" @change="changeStoreEvent()" v-else>
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
              <el-col :span="12" style="margin-top: 6px;">
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
      </el-collapse>
      <!-- 商品清单 end-->

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
        <el-button @click="fanhuihandleCancel">{{routeQuery.type !="3" ? "取消":"关闭"}}</el-button>
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
import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
import suppliersDialog from "cim/components/suppliersDialog/suppliersDialog.vue";
import selectedGoods from "cim/dialogs/cimInSelectedGoods/index.vue";
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
        cinemaUid:"",
        cinemaName:"",
        billType:4,
        storeType:"1",
        storehouseCode:"",
        storehouseName:"",
        storehouseuid:"",
        remark:"",
        status:"",
        addDetailList:[],
        detailVoList:[]
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
          label: "入库数量",
          key: "storeinCount",
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
          label: "入库数量",
          key: "storeinCount",
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
          this.resStoreInDetail(JSON.parse(this.$route.query.data))
          break;
        case "3":
          //查看
          this.resStoreInDetail(JSON.parse(this.$route.query.data))
          break;
      }
    },
        // 查看修改进入详情页请求
    resStoreInDetail(row){
      let val = {
        uid:row
      }
      this.$cimList.goodsWarehousingIn
        .storeInDetail(val)
        .then(res => {
          if (res.code === 200) {
            if(this.routeQuery.type == "3"){
              this.queryData = res.data
              this.goodList = this.queryData.detailVoList
              this.queryData.addDetailList = this.queryData.detailVoList
            }else if(this.routeQuery.type == "2"){
              this.queryData =  res.data
              this.queryData.storeType =this.queryData.storeType.toString()
              this.goodList = this.queryData.detailVoList
              this.queryData.addDetailList = this.queryData.detailVoList
              let newArr = []
              let newObj = {}
              newObj.label = this.queryData.storehouseName
              newObj.value = this.queryData.storehouseCode
              newArr.push(newObj)
              this.storeData = newArr
            }
               
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {});
    },
    // 查询
    onQuery() {
      console.log(this.materialQueryData);

      this.findSemifinishedMater(this.materialQueryData);
    },
    changeUnitEvent(row,index){
      console.log(row.storeinCount)
      if(row.price == null || row.price == ""){
        row.price = 0
      }
      row.amount = (parseInt(row.storeinCount) * row.price).toFixed(4)   
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
    // 选择商品回调
    selectedGoodsDialogCallBack(value) {
      let newData = value.data
      this.goodList.forEach((val1)=>{
        newData.forEach((val2)=>{
          if(val2.merCode == val1.merCode){
            val2.storeinCount = val1.storeinCount
          }
        })
      })
      this.goodList = newData
      this.queryData.addDetailList = this.goodList
    },
    //去重
    unRepeat(arr) {
        let hash = {};
        return arr.reduce((item, next) => {
            if (!hash[next.merCode]) {
                hash[next.merCode] = true;
                item.push(next);
            }
            return item;
        }, []);
    },
    // 入库选择事件
    ckhjEvent(){
      // this.resetForm('ruleForm')
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
      if(this.queryData.cinemaUid === ""){
        this.storeData = []
        this.$message("请选择门店");
      }else{
        if(this.queryData.storeType == "1"){
          this.rescheckBillStorehouse(this.queryData.cinemaUid)
        }else if(this.queryData.storeType == "2"){
          this.resCheckBillStorageRack(this.queryData.cinemaUid)
        }
      }
    },
    addgoodsEvent(){
       if (!this.queryData.cinemaUid) {
            this.$message({
                message: "请选择一个门店!"
            });
            return;
        }
        this.selectedGoodsDialogVisible = true
    },
    fanhuihandleCancel() {
      this.$store.commit("tagNav/removeTagNav", {
          name: this.$route.name,
          path: this.$route.path,
          title: this.$route.meta.title,
          query: this.$route.query
      })
      this.$router.push({
          path: "/retail/InventoryManagement/goodsWarehousingIn/list",
      });
    },
    // 根据仓库code获取名字
    changeStoreEvent(){
      let selectedWorkName = {};
       selectedWorkName = this.storeData.find((item)=>{
           return item.value === this.queryData.storehouseCode;
       });
       this.queryData.storehouseName = selectedWorkName.label
    },
        // 选泽门店回调
    setCinema(val = []) {
      if(val.length == 0){
        this.$nextTick(() => {
          this.queryData.storehouseCode = ""
          this.queryData.storehouseName = ""
          this.queryData.addDetailList = []
          this.goodList = []
        })
      }
      if (val.length > 0) {
        this.queryData.cinemaName = val[0].name;
        this.queryData.cinemaUid = val[0].uid;
        // this.queryData.storehouseCode = ""
        // this.queryData.storehouseName = ""
        // this.queryData.addDetailList = []
        // this.goodList = []
      } else {
        // debugger
        this.queryData.cinemaName = "";
        this.queryData.cinemaUid = "";
      }
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
    selectCinemalDialog() {
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    handleOperateEvent(row,index) {
      this.goodList.splice(index, 1)
    },
    //
    ThandleSubmit() {
      if(this.queryData.cinemaUid == ""){
        this.$message("请选择门店");
      }else{
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            if(this.goodList.length == 0){
              this.$message("请选择商品");
            }else{  
              let newAvtive = {}
              let dqActive = ""
              this.queryData.addDetailList.some((val,newindex,arr)=>{
                let check = /(^[1-9][0-9]{0,})|(^0)/g
                if(val.storeinCount === "" || val.storeinCount === null || !check.test(val.storeinCount)){
                  return newAvtive = {a1:true,a2:val}
                }
              })
              if(newAvtive.a1 === true){
                this.$message(newAvtive.a2.merName+":入库数量必须大于等于0");
              }else{
                if(this.routeQuery.type == "1"){
                        this.queryData.status = 2
                        // this.queryData.storeType = parseInt(this.queryData.storeType)
                        this.queryData.addDetailList.forEach((val,index,arr)=>{
                          val.merUid = val.merUid
                          val.baseUnitUid = val.unitUid
                          val.purPrice = val.price  
                          delete val.uid
                          delete val.unitUid
                        })
                        this.resStoreInBillRegisterSave(this.queryData)
                }else if(this.routeQuery.type == "2"){
                        let newArr = []
                        this.goodList.forEach((val,index,arr)=>{
                            if(val.flag == true){
                              let newObj = {}
                              newObj.baseCount = val.baseCount
                              newObj.price = val.price
                              newObj.purPrice = val.price
                              newObj.basePrice = val.basePrice
                              newObj.baseUnitUid = val.baseUnitUid
                              newObj.inType = val.inType
                              newObj.merCode = val.merCode
                              newObj.merName = val.merName
                              newObj.merSpec = val.merSpec
                              newObj.merUid = val.merUid
                              newObj.purCount = val.purCount
                              newObj.purUnitName = val.purUnitName
                              newObj.purUnitUid = val.purUnitUid
                              newObj.skuCode = val.skuCode
                              newObj.skuName = val.skuName
                              newObj.skuUid = val.skuUid
                              newObj.uid = val.uid
                              newObj.storeinCount = val.storeinCount
                              newArr.push(newObj)
                            }else{
                              val.merUid = val.merUid
                              val.baseUnitUid = val.unitUid  
                              val.purPrice = val.price        
                              delete val.uid
                              delete val.unitUid
                              newArr.push(val)
                            }
                        })
                        let val = {
                          detailVoList:newArr,
                          billCode:this.queryData.billCode,
                          billType:this.queryData.billType,
                          cinemaName:this.queryData.cinemaName,
                          cinemaUid:this.queryData.cinemaUid,
                          remark:this.queryData.remark,
                          status:2,
                          storeType:this.queryData.storeType,
                          storehouseCode:this.queryData.storehouseCode,
                          storehouseName:this.queryData.storehouseName,
                          storehouseuid:this.queryData.storehouseuid,
                          uid:this.queryData.uid
                        }
                        this.resStoreInUpdate(val)
                }
              }
            }
          }else{
            return false;
          }
        }) 
      } 
    },    
    ChandleSubmit() {
      if(this.queryData.cinemaUid == ""){
        this.$message("请选择门店");
      }else{
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            if(this.goodList.length == 0){
              this.$message("请选择商品");
            }else{
              let newAvtive = {}
              let dqActive = ""
              this.queryData.addDetailList.some((val,newindex,arr)=>{
                let check = /(^[1-9][0-9]{0,})|(^0)/g
                if(val.storeinCount === "" || val.storeinCount === null || !check.test(val.storeinCount)){
                  return newAvtive = {a1:true,a2:val}
                }
              })
              if(newAvtive.a1 === true){
                this.$message(newAvtive.a2.merName+":入库数量必须大于等于0");
              }else{
                if(this.routeQuery.type == "1"){
                        this.queryData.status = 1
                        // this.queryData.storeType = parseInt(this.queryData.storeType)
                        this.queryData.addDetailList.forEach((val,index,arr)=>{
                          val.merUid = val.merUid
                          val.baseUnitUid = val.unitUid  
                          val.purPrice = val.price     
                          delete val.uid
                          delete val.unitUid
                        })
                        this.resStoreInBillRegisterSave(this.queryData)
                }else if(this.routeQuery.type == "2"){
                        let newArr = []
                        this.goodList.forEach((val,index,arr)=>{
                            if(val.flag == true){
                              let newObj = {}
                              newObj.baseCount = val.baseCount
                              newObj.price = val.price
                              newObj.purPrice = val.price
                              newObj.basePrice = val.basePrice
                              newObj.baseUnitUid = val.baseUnitUid
                              newObj.inType = val.inType
                              newObj.merCode = val.merCode
                              newObj.merName = val.merName
                              newObj.merSpec = val.merSpec
                              newObj.merUid = val.merUid
                              newObj.purCount = val.purCount
                              newObj.purUnitName = val.purUnitName
                              newObj.purUnitUid = val.purUnitUid
                              newObj.skuCode = val.skuCode
                              newObj.skuName = val.skuName
                              newObj.skuUid = val.skuUid
                              newObj.uid = val.uid
                              newObj.storeinCount = val.storeinCount
                              newArr.push(newObj)
                            }else{
                              val.merUid = val.merUid
                              val.baseUnitUid = val.unitUid  
                              val.purPrice = val.price       
                              delete val.uid
                              delete val.unitUid
                              newArr.push(val)
                            }
                        })
                        let val = {
                          detailVoList:newArr,
                          billCode:this.queryData.billCode,
                          billType:this.queryData.billType,
                          cinemaName:this.queryData.cinemaName,
                          cinemaUid:this.queryData.cinemaUid,
                          remark:this.queryData.remark,
                          status:1,
                          storeType:this.queryData.storeType,
                          storehouseCode:this.queryData.storehouseCode,
                          storehouseName:this.queryData.storehouseName,
                          storehouseuid:this.queryData.storehouseuid,
                          uid:this.queryData.uid
                        }
                        this.resStoreInUpdate(val)
                }
              }
            }
          }else{
            return false;
          }
        })  
      }
    },
    handleCancel() {
      this.$store.commit("tagNav/removeTagNav", {
          name: this.$route.name,
          path: this.$route.path,
          title: this.$route.meta.title,
          query: this.$route.query
      })
      let queryData = {
        cinemaUid:this.queryData.cinemaUid,
        cinemaName:this.queryData.cinemaName
      }
      this.returnList({
        returnType:true,
        cinema: JSON.stringify(queryData)
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
          return "采购入库";
          break;
        case 2:
          return "赠送入库";
          break;
        case 3:
          return "直接入库";
          break;
        case 4:
          return "领用退回入库";
          break;
        case 5:
          return "盘点赔偿入库";
          break;
        case 6:
          return "调拨入库";
          break;
      }
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
            console.log(this.storeData)
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {});
    },
    // 请求出库单据号
    resStoreInBillRegisterGetStoreInBillCode(){
      this.$cimList.goodsWarehousingIn
        .storeInBillRegisterGetStoreInBillCode()
        .then(res => {
          if (res.code === 200) {
            this.queryData.billCode = res.data
            console.log(res)
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {});
    },
    // 请求新增保存
    resStoreInBillRegisterSave(val){
      this.$cimList.goodsWarehousingIn
        .storeInBillRegisterSave(val)
        .then(res => {
          if (res.code === 200) {
            console.log(res)
            this.handleCancel()
            this.$message("新增成功");
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {});
    },
    // 请求修改保存
    resStoreInUpdate(val){
      this.$cimList.goodsWarehousingIn
        .storeInUpdate(val)
        .then(res => {
          if (res.code === 200) {
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
.grIn-style{
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