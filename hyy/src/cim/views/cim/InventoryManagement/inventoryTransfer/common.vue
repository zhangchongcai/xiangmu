<template>
<div class="iT-style">
  <div class="content">
    <!-- {{this.goodList}} -->
    <!-- {{this.queryData.outStorehouseCode}} -->
    <!-- {{this.outStorehouseArr}} -->
    <!-- {{this.inStorehouseCodeArr}} -->
    <!-- {{this.goodList}} -->
    <!-- <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item  :to="{ path: '/retail/InventoryManagement/inventoryTransfer/list' }">库存转移管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{typeText}}库存转移管理</el-breadcrumb-item>
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
                  label="转移门店" 
                  class="select-input"
                  prop="cinemaName"
                  :rules="[{ required: routeQuery.type==3 ? false : true, message: '选择转移门店',trigger: 'change' }]"
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
                  label=""
                  prop="outStorehouseCode"
                  :rules="[{ required: routeQuery.type==3 ? false : true, message: '选择转出仓库或货架',trigger: 'change' }]"
                  >
                  <span v-if="routeQuery.type==3" class="wid100">{{this.queryData.outStoreType == "1" ? '转出仓库：' : '转出货架：'}}</span>
                  <el-select v-model="queryData.outStoreType" v-else @focus="chukkuEvent() ">
                    <!-- <el-option label="全部" value></el-option> -->
                    <el-option label="转出仓库" value="1"></el-option>
                    <el-option label="转出货架" value="2"></el-option>
                  </el-select>
                  <span v-if="routeQuery.type==3">{{this.queryData.outStorehouseName}}</span>
                  <el-select v-model="queryData.outStorehouseCode" @focus="selCkORHj(queryData.outStoreType)" v-else @change="changeSelCk()">
                    <el-option
                      v-for="item in outStorehouseArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="">
                  <span v-if="routeQuery.type==3" class="wid100">{{this.queryData.inStoreType == "1" ? '转入仓库：' : '转入货架：'}}</span>
                  <el-select v-model="queryData.inStoreType" v-else @focus="rukuEvent()">
                    <!-- <el-option label="全部" value></el-option> -->
                    <el-option label="转入仓库" value="1"></el-option>
                    <el-option label="转入货架" value="2"></el-option>
                  </el-select>
                  <span v-if="routeQuery.type==3">{{this.queryData.inStorehouseName}}</span>
                  <el-select v-model="queryData.inStorehouseCode" v-else @focus="selRkORHj(queryData.inStoreType)" @change="changeSelRk()">
                    <el-option
                      v-for="item in inStorehouseCodeArr"
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
            <div class="text-right" v-if="routeQuery.type!=3">
              <!-- <el-button @click="addPreEvevt()">添加商品</el-button> -->
              <button @click="addPreEvevt()" type="button" class="el-button el-button--primary is-plain">
                <span>添加商品</span>
              </button>
            </div>
            <el-table :data="goodList" stripe>
              <el-table-column
                v-for="item in routeQuery.type =='3' ? tableColumn1 : tableColumn"
                :key="item.key"
                :prop="item.key"
                :label="item.label"
                :formatter="item.formatter"
              >

                <template slot-scope="{row,$index}" name="header">
                  <div v-if="item.edit">
                    <el-input size="small" v-model="row[item.key]" placeholder @change="changeUnitEvent(row,$index)"></el-input>
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
              <el-table-column label="操作" style="width:180px;" v-if="routeQuery.type!=3">
                <template slot-scope="{row}">
                  <el-button type="text" size="small" @click.stop="handleOperateEvent(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row>
              <el-col :span="12">
                <el-form-item prop="remark" label-width="60px" label="备注">
                  <span v-if="routeQuery.type==3">{{queryData.remark}}</span>
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
        :Qdata="queryData"
        @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
      ></selected-goods>
      <div class="submit-box">
        <el-button type="primary" @click="ThandleSubmit" v-if="this.routeQuery.type!=3">保存并提交</el-button>
        <el-button type="primary" @click="ChandleSubmit" v-if="this.routeQuery.type!=3">保存为草稿</el-button>
        <el-button @click="fanhuihandleCancel">{{routeQuery.type !=3 ? "取消":"关闭"}}</el-button>
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
import selectedGoods from "cim/dialogs/cimKcSelectedGoods/index.vue";
export default {
  mixins: [mixin],
  data() {
    return {
      activeNames:['1','2','3'],
      selectedGoodsDialogVisible:false,
      goodList:[],
      outStorehouseArr:[],
      inStorehouseCodeArr:[],
      value: '',
      outCode:"",
      //查询数据
      queryData: {
        billCode:"",
        cinemaName:"",
        cinemaUid:"",
        inStoreType:"1",
        inStorehouseCode:"",
        inStorehouseName:"",
        outStoreType:"1",
        outStorehouseName:"",
        outStorehouseCode:"",
        outStorehouseUid:"",
        remark:"",
        status:"",
        moveBillDetailEntityList:[]
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
          label: "单位",
          key: "unitName"
        },
        {
          label: "基本单位成本价（元）",
          key: "costPrice"
        },
        {
          label: "可转出数量",
          key: "outStoreCount"
        },
        {
          label: "转出数量",
          key: "outCount",
          edit: true
        }
      ],
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
          label: "单位",
          key: "unitName"
        },
        {
          label: "基本单位成本价（元）",
          key: "costPrice"
        },
        {
          label: "可转出数量",
          key: "outStoreCount"
        },
        {
          label: "转出数量",
          key: "outCount"
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
      if(this.routeQuery.type == "1"){
        this.resMoveBillFindMoveDetailInfo()
      }else if(this.routeQuery.type == "3"){
        this.resMoveBillFindMoveDetailInfo1(JSON.parse(this.routeQuery.data))
      }else if(this.routeQuery.type == "2"){
        this.resMoveBillFindMoveDetailInfo1(JSON.parse(this.routeQuery.data))
      }
    },
        // 转移管理查询接口
    resMoveBillFindMoveDetailInfo1(row){
      let val = {
        uid:row == undefined ? "":row
      }
      this.$cimList.inventoryTransfer
        .moveBillFindMoveDetailInfo(val)
        .then(res => {
          if (res.code === 200) {
            if(this.routeQuery.type == "3"){
              this.queryData = res.data
              this.queryData.outStoreType = this.queryData.outStoreType.toString()
              this.queryData.inStoreType = this.queryData.inStoreType.toString()
              this.goodList = this.queryData.moveBillDetailEntityList
            }else if(this.routeQuery.type == "2"){
              this.queryData = res.data
              this.queryData.outStoreType = this.queryData.outStoreType.toString()
              this.queryData.inStoreType = this.queryData.inStoreType.toString()
              this.goodList = this.queryData.moveBillDetailEntityList
              let newArr = []
              let newObj = {}
              newObj.label = this.queryData.inStorehouseName
              newObj.value = this.queryData.inStorehouseCode
              newArr.push(newObj)
              this.inStorehouseCodeArr = newArr
              let newArr1 = []
              let newObj1 = {}
              newObj1.label = this.queryData.outStorehouseName
              newObj1.value = this.queryData.outStorehouseCode
              newArr1.push(newObj1)
              this.outStorehouseArr = newArr1
            }
          } else {
            this.error(res.msg);
            this.$message(res.msg);
          }
        })
    },
    // 查询
    onQuery() {
      console.log(this.materialQueryData);

      this.findSemifinishedMater(this.materialQueryData);
    },
    changeUnitEvent(row,index){
      let check = /(^[1-9][0-9]{0,})|(^0)/g
      if(row.outCount > row.outStoreCount){
        this.$message(row.merName+"转出数量不可以大于可转出数量");
        row.outCount = ""
      }else if(!check.test(row.outCount)){
        this.$message("转出数量只能输入数字");
        row.outCount = ""
      }
    },
    // 选泽门店回调
    setCinema(val = []) {
      if(val.length == 0){
        this.$nextTick(() => {
          this.queryData.inStorehouseCode = ""
          this.queryData.inStorehouseName = ""
          this.queryData.outStorehouseCode = "" 
          this.queryData.outStorehouseName = "" 
          this.queryData.outStorehouseUid = ""  
          this.goodList = []
        })
      }
      if (val.length > 0) {
        this.queryData.cinemaName = val[0].name;
        this.queryData.cinemaUid = val[0].uid;
        // this.queryData.inStorehouseCode = ""
        // this.queryData.inStorehouseName = ""
        // this.queryData.outStorehouseCode = "" 
        // this.queryData.outStorehouseName = "" 
        // this.queryData.outStorehouseUid = ""  
        // this.goodList = []
      } else {
        this.queryData.cinemaName = "";
        this.queryData.cinemaUid = "";
      }
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
    selectedGoodsDialogCallBack(value) {
      // let nowgoodList = JSON.stringify(JSON.parse(this.goodList))
      // debugger
      let newgoodList = []
      value.data.forEach((val,index,arr)=>{
        let newObj = val.moveBillDetailEntity
        newgoodList.push(newObj)
      })
      // let newData = value.data
      // this.goodList.forEach((val1)=>{
      //   newData.forEach((val2)=>{
      //     if(val2.merCode == val1.merCode){
      //       val2.outCount = val1.outCount
      //       // val2.costPrice = val1.costPrice
      //       // val2.outStoreCount = val1.outStoreCount
      //     }
      //   })
      // })
      this.goodList = newgoodList
      this.queryData.moveBillDetailEntityList = this.goodList
      // console.log(newData);
      // debugger
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
    chukkuEvent(){
      this.queryData.outStorehouseName = ""
      this.queryData.outStorehouseCode = ""
      this.queryData.outStorehouseUid = ""
    },
    rukuEvent(){
      this.queryData.inStorehouseName = ""
      this.queryData.inStorehouseCode = ""
    },
    // 选择仓库或者货架
    selCkORHj(type){
      this.outStorehouseArr = []
      if(this.queryData.cinemaUid === "" || this.queryData.cinemaUid === null){
        this.$message("请选择门店");
      }else{
        this.goodList = []
        this.resMoveBillFindAllStorehouse(parseInt(type))
      }
      
    },
    selRkORHj(type){
      this.inStorehouseCodeArr = []
      if(this.queryData.cinemaUid === "" || this.queryData.cinemaUid === null){
        this.$message("请选择门店");
      }else{
        this.resMoveBillFindAllStorehouse1(parseInt(type))
      }
      
    },
    fanhuihandleCancel() {
      this.$store.commit("tagNav/removeTagNav", {
          name: this.$route.name,
          path: this.$route.path,
          title: this.$route.meta.title,
          query: this.$route.query
      })
      this.$router.push({
          path: "/retail/InventoryManagement/inventoryTransfer/list",
      });
    },
    addPreEvevt(){
      if(this.queryData.cinemaUid == undefined || this.queryData.cinemaUid == ""){
        this.$message("请选择转移门店");
      }else if(this.queryData.outStoreType == undefined || this.queryData.outStoreType == ""){
        this.$message("请选择转出库类型");
      }else if(this.queryData.outStorehouseCode == undefined || this.queryData.outStorehouseCode == ""){
        this.$message("请选择转出仓库或货架");
      }else{
        this.selectedGoodsDialogVisible = true
      }
      
    },
    changeSelCk(){
        let selectedWorkName = {};
        selectedWorkName = this.outStorehouseArr.find((item)=>{
            return item.value === this.queryData.outStorehouseCode;
        });
        this.queryData.outStorehouseName = selectedWorkName.label
        this.queryData.outStorehouseUid = selectedWorkName.uid
    },
    changeSelRk(){
        let selectedWorkName = {};
        selectedWorkName = this.inStorehouseCodeArr.find((item)=>{
            return item.value === this.queryData.inStorehouseCode;
        });
        this.queryData.inStorehouseName = selectedWorkName.label
    },
    // 获取分类列表
    resMoveBillFindAllStorehouse(type) {
      let val = {
        cinemaUid:this.queryData.cinemaUid,
        type:type
      }
      console.log(val)
      this.$cimList.inventoryTransfer
        .moveBillFindAllStorehouse(val)
        .then(res => {
          if (res.code == 200) {
              this.outStorehouseArr = res.data
              let newArr = []
              this.outStorehouseArr.forEach((val,index,arr)=>{
                let newObj = {}
                newObj.label = val.name
                newObj.value = val.code
                newObj.uid = val.uid
                newArr.push(newObj)
              })
            this.outStorehouseArr = newArr       
          }
        });
    },
    // 获取分类列表
    resMoveBillFindAllStorehouse1(type) {
      let val = {
        cinemaUid:this.queryData.cinemaUid,
        type:type
      }
      console.log(val)
      this.$cimList.inventoryTransfer
        .moveBillFindAllStorehouse(val)
        .then(res => {
          if (res.code == 200) {
              this.inStorehouseCodeArr = res.data  
              let newArr = []
              this.inStorehouseCodeArr.forEach((val,index,arr)=>{
                let newObj = {}
                newObj.label = val.name
                newObj.value = val.code
                newArr.push(newObj)
              })
            this.inStorehouseCodeArr = newArr      
          }
        });
    },
    // 获取code请求
    resMoveBillFindMoveDetailInfo(type) {
      let val = {
        uid:type
      }
      console.log(val)
      this.$cimList.inventoryTransfer
        .moveBillFindMoveDetailInfo(val)
        .then(res => {
          if (res.code == 200) {
            this.queryData.billCode = res.data.billCode
            console.log(res)
          }
        });
    },
        // 新增
    resMoveBillSaveMoveBillInfo(type,status) {
      type.status = status
      this.$cimList.inventoryTransfer
        .moveBillSaveMoveBillInfo(type)
        .then(res => {
          if (res.code == 200) {
            if(this.routeQuery.type == "1"){
              this.$message("新建成功");
            }else if(this.routeQuery.type == "2"){
              this.$message("编辑成功");
            }
             this.handleCancel()
          } else {
            this.$message(res.msg);
            this.$message(res.data);
          }
        });
      },
    handleOperateEvent(row,index) {
      this.goodList.splice(index, 1)
    },
    //
    ThandleSubmit() {
      if(this.queryData.inStorehouseCode == "" || this.queryData.inStorehouseCode == null){
        this.$message("请选择转出仓库");
      }else if(this.queryData.inStorehouseCode == this.queryData.outStorehouseCode){
         this.$message("转出和转入仓库或货架不能相同");
      }else{
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            this.queryData.moveBillDetailEntityList = this.goodList
            if(this.goodList.length === 0){
              this.$message("请选择商品");
            }else{
              let newAvtive = {}
              let dqActive = ""
              this.goodList.some((val,newindex,arr)=>{
                val.outCount = val.outCount.toString()
                let check = /(^[1-9][0-9]{0,})|^([0])$/g
                if(val.outCount == "" || val.outCount == null || !check.test(val.outCount)){
                  return newAvtive = {a1:true,a2:val}
                }
              })
              if(newAvtive.a1 === true){
                this.$message(newAvtive.a2.merName+":转出数量不能为空");
              }else{
                this.resMoveBillSaveMoveBillInfo(this.queryData,"2")
              }
            }
          }else{
            return false;
          }  
        })
      }
    },
    ChandleSubmit() {
      if(this.queryData.inStorehouseCode == "" || this.queryData.inStorehouseCode == null){
        this.$message("请选择转出仓库");
      }else if(this.queryData.inStorehouseCode == this.queryData.outStorehouseCode){
         this.$message("转出和转入仓库或货架不能相同");
      }else{
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            this.queryData.moveBillDetailEntityList = this.goodList
            if(this.goodList.length === 0){
              this.$message("请选择商品");
            }else{
              let newAvtive = {}
              let dqActive = ""
              this.goodList.some((val,newindex,arr)=>{
                let check = /(^[1-9][0-9]{0,})|(^0)/g
                val.outCount = val.outCount.toString()
                if(val.outCount == "" || val.outCount == null || !check.test(val.outCount)){
                  return newAvtive = {a1:true,a2:val}
                }
              })
              if(newAvtive.a1 === true){
                this.$message(newAvtive.a2.merName+":转出数量不能为空");
              }else{
                this.resMoveBillSaveMoveBillInfo(this.queryData,"1")
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
    }
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
.iT-style{
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