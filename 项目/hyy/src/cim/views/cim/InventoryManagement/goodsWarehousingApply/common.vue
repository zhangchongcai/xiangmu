<template>
<div class="iT-style">
  <div class="content">
    <!-- {{this.queryData}} -->
    <!-- {{this.queryData.outStorehouseCode}} -->
    <!-- {{this.outStorehouseArr}} -->
    <!-- {{this.inStorehouseCodeArr}} -->
    <!-- {{this.routeQuery.type}} -->
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
      label-suffix=":"
    >
      <el-collapse  v-model="activeNames">
        <!-- 基础信息 start-->
        <el-collapse-item title="基础信息" name="1">
          <div>
            <el-row>
              <el-col :span="10">
                <el-form-item label="调拨单号">
                  <span>{{this.queryData.billCode}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="10">
                <el-form-item 
                  label="调入门店" 
                  class="select-input"
                  prop="inCinemaName"
                  :rules="[{ required: routeQuery.type==3 ? false : true, message: '选择调入门店',trigger: 'change' }]"
                  >
                  <template v-if="routeQuery.type=='1' || routeQuery.type=='2'">     
                    <el-input
                            v-model="queryData.inCinemaName"
                            clearable
                            @clear="onCinemalSumit"
                            @focus="selectCinemalDialog"
                            placeholder="请选择门店"
                    ></el-input>
                    <el-button @click="selectCinemalDialog" type="primary cinemaSel-btn" plain>选择</el-button>
                  </template>
                  <span v-else>{{this.queryData.inCinemaName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item 
                  label="调出门店" 
                  class="select-input"
                  prop="outCinemaName"
                  :rules="[{ required: routeQuery.type==3 ? false : true, message: '选择调出门店',trigger: 'change' }]"
                  >
                  <template v-if="routeQuery.type=='1' || routeQuery.type=='2'">     
                    <el-input
                            v-model="queryData.outCinemaName"
                            clearable
                            @clear="onCinemalSumit1"
                            @focus="selectCinemalDialog1"
                            placeholder="请选择门店"
                    ></el-input>
                    <el-button @click="selectCinemalDialog1" type="primary cinemaSel-btn" plain>选择</el-button>
                  </template>
                  <span v-else>{{this.queryData.outCinemaName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="this.routeQuery.type == '2' || this.routeQuery.type == '4'">
              <el-col :span="10">
                <el-form-item label="制单日期">
                  <span>{{this.routeQuery.type == '2' ? "-":this.queryData.billTime}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="制单员">
                  <span>{{this.routeQuery.type == '2' ? "-":this.queryData.billUserName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="this.routeQuery.type == '2' || this.routeQuery.type == '4'">
              <el-col :span="10">
                <el-form-item label="单据状态">
                  <span>{{statusS(this.queryData.status)}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="10">
                <el-form-item label="审核状态">
                  <span>{{approvalStatusS(this.queryData.approvalStatus)}}</span>
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
              <el-button @click="addPreEvevt()">添加商品</el-button>
            </div>
            <el-table :data="goodList" stripe>
              <el-table-column
                v-for="item in tableColumn"
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
      <!-- 选择调入门店 -->
      <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit" :dialogFeedbackData="[{cinemaUid:queryData.inCinemaUid,cinemaName:queryData.inCinemaName}]"></cinemal-dialog>
      <!-- 选择调出门店 -->
      <cinemal-dialog ref="myCinemalDialog1" @onSumit="onCinemalSumit1" :dialogFeedbackData="[{cinemaUid:queryData.outCinemaUid,cinemaName:queryData.outCinemaName}]"></cinemal-dialog>
      <!-- 选择商品 -->
      <selected-goods
        :dialogVisible.sync="selectedGoodsDialogVisible"
        :dialogFeedbackData="goodList"
        :cinemaUid="queryData.outCinemaUid"
        @cimSelectedGoodsDialogCallBack="selectedGoodsDialogCallBack"
      ></selected-goods>
      <div class="submit-box">
        <el-button type="primary" @click="ThandleSubmit" v-if="this.routeQuery.type!=3">保存并提交</el-button>
        <el-button type="primary" @click="ChandleSubmit" v-if="this.routeQuery.type!=3">保存为草稿</el-button>
        <el-button @click="handleCancel">{{routeQuery.type !=3 ? "取消":"关闭"}}</el-button>
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
import selectedGoods from "cim/dialogs/cimDbSelectedGoods/index.vue";
export default {
  mixins: [mixin],
  data() {
    return {
      activeNames:['1','2','3'],
      selectedGoodsDialogVisible:false,
      goodList:[
          // {
          //   "uid":"",
          //   "allotBillUid":"DB201907010001",
          //   "merUid":"ef5f128c-0045-4fd1-837a-c238ef148a76",
          //   "merCode":"DP2019070116281165",
          //   "merName":"可口可乐",
          //   "merSpec":"350ML",
          //   "skuUid":"e716b50c-d6a6-41c3-9de8-490ff3268bbc",
          //   "skuCode":"DP201907011628116594",
          //   "skuName":"可口可乐",
          //   "unitUid":"5c6e9b35-b2ae-4b45-b9d5-d150754b3e72",
          //   "unitName":"箱",
          //   "costPrice":"0.91070000",
          //   "delFlag":"0",
          //   "storeCount":"50",
          //   "allotCount":"",
          // }
      ],
      outStorehouseArr:[],
      inStorehouseCodeArr:[],
      value: '',
      outCode:"",
      //查询数据
      queryData: {
        billCode:"",
        inCinemaName:"",
        inCinemaUid:"",
        outCinemaName:"",
        outCinemaUid:"",
        remark:"",
        status:"",
        detailList:[],
        delFlag:"0",
        approvalStatus:"",
        status:"",
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
          label: "可调数量",
          key: "storeCount"
        },
        {
          label: "调拨申请数量",
          key: "allotCount",
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
      if(this.routeQuery.type == "1"){
        // 新增状态
        this.goodsDataQueryGoodsList()
      }else if(this.routeQuery.type == "3"){
        // 查看状态
        this.resAllotBillFind(JSON.parse(this.routeQuery.data))
        this.tableColumn.forEach((tcval,tcindex)=>{
          if(tcval.key == "allotCount"){
            tcval.edit = false
          }
        })
      }else if(this.routeQuery.type == "2"){
        // 未提交状态
        this.resAllotBillFind(JSON.parse(this.routeQuery.data))
      }else if(this.routeQuery.type == "4"){
        // 已提交状态
        this.resAllotBillFind(JSON.parse(this.routeQuery.data))
      }
    },
    // 查询
    onQuery() {
      console.log(this.materialQueryData);

      this.findSemifinishedMater(this.materialQueryData);
    },
    // 调拨申请编号
    goodsDataQueryGoodsList(){
      this.$cimList.goodsWarehousingApply
        .allotBillGetBillCode()
        .then(res => {
          if (res.code === 200) {
            this.queryData.billCode = res.data
          } else {
            this.$message(res.msg);
          }
        })
    },
    // 调入门店回调
    onCinemalSumit(val = []) {
      if(val.length == 0){
        this.$nextTick(() => { 
          this.goodList = []
        })
      }
      if (val.length > 0) {
        if(val[0].uid == this.queryData.outCinemaUid){
          this.$message("调入门店不能和调出门店相同");
          this.queryData.inCinemaName = "";
          this.queryData.inCinemaUid = "";
        }else{
        this.queryData.inCinemaName = val[0].name;
        this.queryData.inCinemaUid = val[0].uid;
        }
      } else {
        this.queryData.inCinemaName = "";
        this.queryData.inCinemaUid = "";
      }
      console.log(val);
    },
    // 关闭调入门店
    selectCinemalDialog() {
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    // 调出门店回调
    onCinemalSumit1(val = []) {
      if(val.length == 0){
        this.$nextTick(() => { 
          this.goodList = []
        })
      }
      if (val.length > 0) {
        if(val[0].uid == this.queryData.inCinemaUid){
          this.$message("调出门店不能和调入门店相同");
          this.queryData.outCinemaName = "";
          this.queryData.outCinemaUid = "";
        }else{
          this.queryData.outCinemaName = val[0].name;
          this.queryData.outCinemaUid = val[0].uid;
        }
      } else {
        this.queryData.outCinemaName = "";
        this.queryData.outCinemaUid = "";
      }
      console.log(val);
    },
    // 关闭调出门店allotBillSave
    selectCinemalDialog1() {
      this.$refs.myCinemalDialog1.handleDialog(true);
    },
    // 选择商品事件
    addPreEvevt(){
      if(this.queryData.outCinemaUid == undefined || this.queryData.outCinemaUid == ""){
        this.$message("请选调出门店");
      }else{
        this.selectedGoodsDialogVisible = true
      }
    },
    // 选择商品回调
    selectedGoodsDialogCallBack(value) {
      this.goodList = value.data
    },
    // 保存调拨申请单
    resAllotBillSave(type,status,approvalStatus) {
      type.status = status
      type.approvalStatus = approvalStatus
      console.log(type)
      debugger
      this.$cimList.goodsWarehousingApply
        .allotBillSave(type)
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
          }
        });
      },
      // 未提交修改调拨申请单
      resAllotBillUpdate(type,status,approvalStatus) {
        type.status = status
        type.approvalStatus = approvalStatus
        this.$cimList.goodsWarehousingApply
          .allotBillUpdate(type)
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
            }
          });
        },
      // 保存为草稿事件
      ChandleSubmit() {
      if(this.queryData.inCinemaUid == "" || this.queryData.inCinemaUid == null){
        this.$message("请选择调入门店");
      }else{
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            this.queryData.detailList = this.goodList
            if(this.goodList.length === 0){
              this.$message("请选择商品");
            }else{
              let newAvtive = {}
              let dqActive = ""
              this.goodList.some((val,newindex,arr)=>{
                let check = /(^[1-9][0-9]{0,})|(^0)/g
                val.allotCount = val.allotCount.toString()
                if(val.allotCount == "" || val.allotCount == null || !check.test(val.allotCount)){
                  return newAvtive = {a1:true,a2:val}
                }
              })
              if(newAvtive.a1 === true){
                this.$message(newAvtive.a2.merName+":调拨申请数量不能为空");
              }else{
                this.queryData.detailList = this.goodList
                if(this.routeQuery.type == "1"){
                  this.resAllotBillSave(this.queryData,"1","0")
                }else if(this.routeQuery.type == "2" || this.routeQuery.type == "4"){
                  this.resAllotBillUpdate(this.queryData,"1","0")
                }
                
              }
            }
            
          }else{
            return false;
          }
        })
      } 
    },
    // 保存并且提交
    ThandleSubmit() {
      if(this.queryData.inCinemaUid == "" || this.queryData.inCinemaUid == null){
        this.$message("请选择调入门店");
      }else{
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            this.queryData.detailList = this.goodList
            if(this.goodList.length === 0){
              this.$message("请选择商品");
            }else{
              let newAvtive = {}
              let dqActive = ""
              this.goodList.some((val,newindex,arr)=>{
                let check = /(^[1-9][0-9]{0,})|(^0)/g
                val.allotCount = val.allotCount.toString()
                if(val.allotCount == "" || val.allotCount == null || !check.test(val.allotCount)){
                  return newAvtive = {a1:true,a2:val}
                }
              })
              if(newAvtive.a1 === true){
                this.$message(newAvtive.a2.merName+":调拨申请数量不能为空");
              }else{
                 this.queryData.detailList = this.goodList
                  if(this.routeQuery.type == "1"){
                    this.resAllotBillSave(this.queryData,"2","1")
                  }else if(this.routeQuery.type == "2" || this.routeQuery.type == "4"){
                    this.resAllotBillUpdate(this.queryData,"2","1")
                  }
              }
            }
            
          }else{
            return false;
          }
        })
      } 
    },
    // 选择的商品是否
    // 判断转出数量是否为数字
    changeUnitEvent(row,index){
      let check = /(^[1-9][0-9]{0,})|(^0)/g
      if(row.allotCount > row.outallotCount){
        this.$message(row.merName+"转出数量不可以大于可转出数量");
        row.allotCount = ""
      }else if(!check.test(row.allotCount)){
        this.$message("转出数量只能输入数字");
        row.allotCount = ""
      }
    },
    // 返回上一级
    handleCancel() {
      this.returnList({
        returnType:true
      });
    },
    // 跳转
    returnList(param) {
      this.$router.push({
        path: "list",
        query: param
      });
    },
    // 调拨单详情接口
    resAllotBillFind(data) {
      let newData = {
        uid:data
      }
      this.$cimList.goodsWarehousingApply
        .allotBillFind(newData)
        .then(res => {
          if (res.code == 200) {
            this.queryData = res.data
            this.queryData.status = this.queryData.status.toString()
            this.queryData.approvalStatus = this.queryData.approvalStatus.toString()
            this.goodList = this.queryData.detailList
            this.goodList.forEach((storeVal)=>{
              storeVal.storeCount = "50"
            })   
          }
        });
    },
    // 选择商品删除事件
    handleOperateEvent(row,index) {
      this.goodList.splice(index, 1)
    },
    // 单据状态
    statusS(type) {
      switch (type) {
        case "1":
          return "未提交";
          break;
        case "2":
          return "已提交";
          break;
        case "3":
          return "完成出库";
          break; 
        case "4":
          return "完成入库";
          break;
      }
    },
    // 审核状态
    approvalStatusS(type) {
      switch (type) {
        case "0":
          return "未审核";
          break;
        case "1":
          return "待审核";
          break;
        case "2":
          return "审核通过";
          break;
        case "3":
          return "审核不通过";
          break; 
        case "4":
          return "无需审核";
          break;    
      }
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
  },
  components: {
    cinemalDialog,
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