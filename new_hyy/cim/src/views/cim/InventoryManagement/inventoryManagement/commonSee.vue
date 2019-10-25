<template>
  <div class="content imsee">
    <!-- <div class="breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/retail/InventoryManagement/inventoryManagement/list'}">盘点单管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{typeText}}盘点单</el-breadcrumb-item>
      </el-breadcrumb>
    </div> -->
    <!-- {{this.queryData}} -->
    <div class="tittle"></div>
    <el-form
      :inline="true"
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
              <el-col :span="6">
                <el-form-item label="盘点单号" label-width="75px">
                  <span>{{queryData.billCode}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="盘点门店" class="select-input" label-width="75px">
                  <span>{{queryData.cinemaName}}</span>
                </el-form-item> 
              </el-col>
              <el-col :span="6">
                <el-form-item label="盘点方案" label-width="75px">
                  <span>{{queryData.solutionName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label=''>
                  <span>{{queryData.storeType == "1" ? "盘点仓库" : "盘点货架"}}</span>
                  <span>:</span>
                  <span style="margin-left:15px;">{{queryData.storehouseName}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="6">
                <el-form-item label="单据状态" label-width="75px">
                  <span>{{saleCinemastatus(queryData.status)}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="盘点月份" label-width="75px">
                  <span>{{queryData.checkMonth}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="制单时间" label-width="75px">
                  <span>{{queryData.billTime}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="制单员" label-width="75px">
                  <span>{{queryData.billUserName}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="审核状态" label-width="75px">
                  <span>{{saleCinemaapprovalStatus(queryData.approvalStatus)}}</span>
                </el-form-item>
              </el-col>
              
            </el-row>
          </div>
        </el-collapse-item>
        <!-- 基础信息 end-->
        <!-- 商品清单 start-->
        <el-collapse-item title="盘点商品清单" name="2">
          <div>
            <el-table 
              :data="queryData.checkBillMerEntityList" 
              stripe 
              height="300" 
              show-summary
              :summary-method="getSummaries"
              > 
              <el-table-column
                v-for="item in tableColumn"
                :key="item.key"
                :prop="item.key"
                :label="item.label"
                :width="item.width"
                :formatter="item.formatter"
              >
                <template slot-scope="{row}" name="header">
                  <div v-if="item.edit">
                    <el-input size="small" v-model="row[item.key]" placeholder></el-input>
                  </div>
                  <div v-if="item.color">
                    <span :style="tableColor(row)">{{row[item.key]}}</span>
                    <!-- <el-input size="small" v-model="row[item.key]" placeholder :style="tableColor(row)"></el-input> -->
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
              <el-table-column label="操作" style="width:180px;" v-if="this.newseeStatus == false">
                <template 
                  slot-scope="{row,$index}">
                  <el-button type="text" size="small" @click.stop="seeChayiEvent(row,$index)">{{routeQuery.type == 3 ? "查看差异调整" : row.variance === 0 ? "" : "差异处理"}}</el-button>
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
                    v-if="routeQuery.type==4"
                    class="remark-input"
                    v-model="queryData.remarks"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
        <!-- 商品清单 end-->
        <!--  审批流程-->
        <el-collapse-item title="审批流程" name="3" v-if="routeQuery.type=='3'">
            <el-form-item label="审批流程名称" label-width="110px">
                <span>盘点单审核</span>
            </el-form-item>
            <el-steps :space="200" :active="approvalActive" finish-status="success">
                <el-step :title="approvalStart()"></el-step>
                <el-step :title="item.auditMan" :key="item.auditTime"
                        v-for="item in queryData.reviewRecordList"></el-step>
                <el-step title="结束" v-if="queryData.approvalStatus==2"></el-step>
            </el-steps>
        </el-collapse-item>
        <!--  审批记录-->
        <el-collapse-item title="审批记录" name="4" v-if="routeQuery.type=='3'">
            <div>
                <el-table :data="queryData.reviewRecordList" stripe>
                    <el-table-column
                            v-for="item in reviewRecordTableColumn"
                            :key="item.key"
                            :prop="item.key"
                            :label="item.label"
                            :formatter="item.formatter"
                    >
                    </el-table-column>
                </el-table>
            </div>
        </el-collapse-item>
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
      <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit"></cinemal-dialog>
      <el-dialog
        :title='routeQuery.type == 3 ? "查看差异调整" : "差异处理"'
        :visible.sync="chayidialogVisible"
        width="600px"
        @close="chayihandleClose"
        >
        <el-col>
          <el-form
              :inline="true"
              ref="chayiruleForm"
              :model="chayiData"
              label-position="right"
              label-width="80px"
              label-suffix="："
              >
              <span class="colred">{{this.chayiData.merName}}:</span>
              <span>实盘库存数：{{this.chayiData.checkStoreCount}} -系统库存数：{{this.chayiData.recordStoreCount}} = <span class="colred">{{this.ykActive == true ? "盘盈：":"盘亏："}}{{Math.abs(this.ykVal)}}</span>
              </span>
            <el-collapse  v-model="activeNames1">
              <el-collapse-item title="差异说明" name="1">
                <el-col>
                    <el-form-item 
                      label="差异类别"
                      prop="changeTypeCode"
                      :rules="[
                          { required: true, message: '请选择差异类别',trigger: 'change' }
                        ]"
                      >
                      <el-select v-model="chayiData.changeTypeCode" @focus="pdfnSelEvent()" @change="changePdfnEvent()" v-if="routeQuery.type==4">
                        <el-option 
                          v-for = "item in CYdata"
                          :key="item.keyCode"
                          :label="item.keyDesc"
                          :value="item.keyCode"
                        ></el-option>
                      </el-select>
                      <span v-if="routeQuery.type==3">{{chayiData.changeTypeName}}</span>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item prop="changeReason" label="差异原因">
                        <span v-if="routeQuery.type==3">{{chayiData.changeReason}}</span>
                        <template v-else>
                          <el-input
                            type="textarea"
                            placeholder="请输入"
                            maxlength="50"
                            class="remark-input"
                            :autosize="{ minRows: 2, maxRows: 3}"
                            v-model="chayiData.changeReason"
                            @change="cChangeReason"
                          ></el-input>
                          <span class="remnant">({{remnant}}/50)</span>
                        </template>
                      </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="差异处理">
                    <span v-if="routeQuery.type==3">{{newchangeHandle}}</span>
                    <div v-if="routeQuery.type==4">
                      <el-radio-group v-model="chayiData.changeHandle" @change="changeHandleEvent()">
                        <el-radio label=1>接受{{this.ykActive == true ? "盘盈":"盘亏"}}</el-radio>
                        <el-radio label=2>调整{{this.ykActive == true ? "盘盈":"盘亏"}}</el-radio>
                      </el-radio-group>
                    </div>
                      <!-- <span v-if="routeQuery.type==3">{{chayiData.changeHandle === '1' ? "接受盘亏":"调整盘亏"}}</span> -->
                    </el-form-item>
                    <div v-if="chayiData.changeHandle=='2'">
                      <div>实盘库存数：{{this.chayiData.checkStoreCount}} -系统库存数：{{this.chayiData.recordStoreCount}} ={{this.ykActive == true ? "盘盈：":"盘亏："}}{{Math.abs(this.ykVal)}}</div>
                      <div>复盘库存数<el-input v-model="jtshuzhi" @change="StoreCountEvent()" style="width:200px;margin-left:15px;">复盘后{{this.ykActive == true ? "盘盈：":"盘亏："}}：</el-input></div>
                    </div>
                </el-col> 
                <el-col> 
                  <el-form-item prop="bunesRate" label="备注">
                        <span v-if="routeQuery.type==3">{{chayiData.rechangeReason}}</span>
                        <template v-else>
                          <el-input
                            type="textarea"
                            placeholder="请输入"
                            class="remark-input"
                            maxlength="50"
                            :autosize="{ minRows: 2, maxRows: 3}"
                            v-model="chayiData.rechangeReason"
                          ></el-input>
                          <span class="remnant">({{remnant1}}/50)</span>
                        </template>
                      </el-form-item>
                </el-col>
              </el-collapse-item>
              <div v-if="this.chayiData.changeHandle == 1" class="fontbold">差异处理后{{this.ykActive == true ? "盘盈：":"盘亏："}}{{Math.abs(this.ykVal)}}</div>
              <div v-if="this.chayiData.changeHandle == 2" class="fontbold">差异处理后{{jtshuzhi-this.chayiData.recordStoreCount >0 ? "盘盈：":"盘亏："}}{{Math.abs(this.newykval)}}</div>
            </el-collapse>
          </el-form>
        </el-col>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="pankuiBtn()" v-if="routeQuery.type == 4">保 存</el-button>
            <el-button @click="pankuidialogVisible()">{{routeQuery.type == 4 ? "取 消":"关闭"}}</el-button>
          </span>     
      </el-dialog>
      <div class="submit-box">
        <el-button type="primary" @click="ThandleSubmit" v-if="routeQuery.type ==4">保存并提交</el-button>
        <el-button @click="chuliCancel">{{routeQuery.type !="3" ? "取消":"关闭"}}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import qs from "qs";
import moment from "moment";
import mixin from "cimSrc/mixins/cim/paginationConfig.js";
import cinemalDialog from "cimSrc/components/cinemalDialog/cinemaDialog.vue";
import suppliersDialog from "cimSrc/components/suppliersDialog/suppliersDialog.vue";
import selectedGoods from "cimSrc/dialogs/cimSelectedGoods/index.vue";
export default {
  mixins: [mixin],
  data() {
    return {
      newseeStatus:"",
      newchangeHandle:"",
      activeNames:['1','2','3','4'],
      activeNames1:['1'],
      remnant:"0",
      remnant1:"0",
      hhhh:{},
      // 盈亏状态
      ykActive:"",
      // 盈亏状态值
      ykVal:"",
      // 调整盘亏值
      newykval:0,
      oldchayiData:"",
      // 复盘库存数
      jtshuzhi:"",
      thischuliIndex:"",
      deHadle:"",
      newresizeVariance:"",
      pamkuiData:"",
      chayiData:{
        changeHandle:1,
        changeReason:"",
        rechangeReason:"",
        changeTypeCode:"",
        changeTypeName:"",
        checkBillUid:"",
        saveStatus:"",
        uid:"",
        variance:"",
        recheckStoreCount:"",
        recordStoreCount:"",
        checkStoreCount:"",
        resizeVariance:""
      },
      chayidialogVisible:false,
      // 盘点商品当前分页数
      currentPage:"",
      // 盘点商品总数
      totalPag:"",
      CYdata:[
        {
          id:"5",
          keyCode:"tp01",
          keyDesc:"历史遗留"
        },
        {
          id:"6",
          keyCode:"tp02",
          keyDesc:"设备损坏"
        },{
          id:"7",
          keyCode:"tp03",
          keyDesc:"操作失误"
        },{
          id:"8",
          keyCode:"tp04",
          keyDesc:"输入错误"
        },{
          id:"9",
          keyCode:"tp05",
          keyDesc:"漏盘错盘"
        },
      ],
      // 查看审核表头
      reviewRecordTableColumn:[
        {
            label: "审核时间",
            key: "auditTime"
        },
        {
            label: "审核人",
            key: "auditMan"
        },
        {
            label: "审核结果",
            key: "arditResult"
        },
        {
            label: "审核意见",
            key: "auditOpinion"
        },
      ],
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
        checkBillMerEntityList:[],
        totalPrice:""
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
      activeNames:['1','2','3','4'],
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
          label: "商品编码",
          key: "merCode"
        },
        {
          label: "速记代码",
          key: "shorthandCode"
        },
        {
          label: "基本单位",
          key: "unitName"
        },
        {
          label: "实盘库存数",
          key: "checkStoreCount"
        },
        {
          label: "系统库存数",
          key: "recordStoreCount"
        },
        {
          label: "差异数",
          key: "variance",
          color:"true",
        },
        {
          label: "差异成本金额（元）",
          key: "varianceCostPrice",
          width:"160"
        },
        {
          label: "调整后差异数",
          key: "resizeVariance",
          width:"160"
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
  watch:{
    jtshuzhi(val){
      console.log(val)
      if(val === "" || val === null){
        this.newykval = 0
        this.jtshuzhi = ""
      }else{
        this.newykval = Math.abs(val - this.chayiData.recordStoreCount)
      }
    },
    'chayiData.changeReason'(newval){
      if(newval != null){
          this.remnant = 50
          let val = newval
          this.remnant = 50 - val.length
        } 
      },
    'chayiData.rechangeReason'(newval){
      if(newval != null){
          this.remnant1 = 50
          let val = newval
          this.remnant1 = 50 - val.length
      }
    }
    
  },
  methods: {
    init() {
      if(this.$route.query.type == "1"){
        this.resCheckBillCreateBillCode()
        console.log(JSON.parse(this.$route.query.data))
      }else if(this.$route.query.type == "2"){
        this.queryData = JSON.parse(this.$route.query.data)
        console.log(this.queryData)
      }else if(this.$route.query.type == "3"){
        this.resCheckBillQueryCheckBill(JSON.parse(this.$route.query.data))
      }else if(this.$route.query.type == "4"){
        this.resCheckBillQueryCheckBill(JSON.parse(this.$route.query.data))
      }
    },
        // 跳转修改页面请求
    resCheckBillQueryCheckBill(row){
      let val = {
        uid:row
      }
      this.$cimList.inventoryManagement
        .checkBillQueryCheckBill(val)
        .then(res => {
          if (res.code === 200) {
            if(this.$route.query.type == "3"){
              this.queryData = res.data
              this.queryData.checkBillMerEntityList = this.queryData.checkBillInfoVoList
              this.newseeStatus = this.$route.query.active
              this.queryData.reviewRecordList = this.queryData.reviewRecordList == null ? []:this.queryData.reviewRecordList
              this.queryData.checkBillMerEntityList.forEach((val,newindex,arr)=>{
                    if(val.variance >= 0){
                      this.$set(arr[newindex],'color','red')
                      val.variance = "+"+val.variance
                    }else{
                      this.$set(arr[newindex],'color','green')
                    }
              })
            }else if(this.$route.query.type == "4"){
              this.queryData = res.data
              this.queryData.checkBillMerEntityList = this.queryData.checkBillInfoVoList
              this.queryData.checkBillMerEntityList.forEach((val,newindex,arr)=>{
                if(val.checkStoreCount === val.recordStoreCount){
                    val.doStatus = 1
                }
                if(val.variance >= 0){
                  this.$set(arr[newindex],'color','red')
                  val.variance = "+"+val.variance
                }else{
                  this.$set(arr[newindex],'color','green')
                }
              })
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
        // 选泽门店回调
    setCinema(val = []) {
      if (val.length > 0) {
        this.queryData.cinemaName = val[0].name;
        this.queryData.cinemaUid = val[0].uid;
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
    cChangeReason(value){
        console.log("value---------------------------"+value)
    },
        // 取消返回
    // fanhuihandleCancel() {
    //   this.$store.commit("tagNav/removeTagNav", {
    //       name: this.$route.name,
    //       path: this.$route.path,
    //       title: this.$route.meta.title,
    //       query: this.$route.query
    //   })
    //   this.$router.push({
    //       path: "/retail/InventoryManagement/inventoryManagement/list",
    //   });
    // },
    pankuidialogVisible(){
      this.chayiData.changeHandle = this.deHadle 
      this.deHadle = ""     
      this.chayidialogVisible = false
      // console.log(this.oldchayiData)
      // let valnew = this.thischuliIndex
      //   this.queryData.checkBillMerEntityList.forEach((val,index,arr)=>{
      //     if(index == this.thischuliIndex){
      //       arr[index] = this.oldchayiData
      //       this.chayiData = this.oldchayiData
      //     }
      //   })
    }, 
    pankuiBtn(){
      this.$refs["chayiruleForm"].validate(valid => {
        if (valid) {
          this.chayidialogVisible = false
          let valnew = this.thischuliIndex
          console.log(this.chayiData.changeHandle)
          if(this.chayiData.changeHandle == "1"){
            this.queryData.checkBillMerEntityList.forEach((val,newindex,arr)=>{
              if(valnew === newindex){
                val.changeHandle = this.chayiData.changeHandle
                val.checkBillUid = this.chayiData.checkBillUid
                val.uid = this.chayiData.uid
                val.variance = this.chayiData.variance
                val.recheckStoreCount = null
                val.recordStoreCount = this.chayiData.recordStoreCount
                val.checkStoreCount = this.chayiData.checkStoreCount
                val.changeReason = this.chayiData.changeReason
                val.rechangeReason = this.chayiData.rechangeReason
                val.changeTypeCode = this.chayiData.changeTypeCode
                val.changeTypeName = this.chayiData.changeTypeName
                val.resizeVariance = this.chayiData.variance
                val.doStatus = 1
              }
            })
          }else if(this.chayiData.changeHandle == "2"){
            this.queryData.checkBillMerEntityList.forEach((val,newindex,arr)=>{
              if(valnew === newindex){
                  val.changeHandle = this.chayiData.changeHandle
                  val.checkBillUid = this.chayiData.checkBillUid
                  val.uid = this.chayiData.uid
                  val.variance = this.chayiData.variance
                  val.recheckStoreCount = Math.abs(this.jtshuzhi)
                  val.recordStoreCount = this.chayiData.recordStoreCount
                  val.checkStoreCount = this.chayiData.checkStoreCount
                  val.changeReason = this.chayiData.changeReason
                  val.rechangeReason = this.chayiData.rechangeReason
                  val.changeTypeCode = this.chayiData.changeTypeCode
                  val.changeTypeName = this.chayiData.changeTypeName
                  // val.resizeVariance = this.jtshuzhi - this.chayiData.recordStoreCount
                  val.resizeVariance = Math.abs(this.newykval)
                  val.doStatus = 2
                }
              })
          }
          this.chayiData = {
            changeHandle:1,
            changeReason:"",
            rechangeReason:"",
            changeTypeCode:"",
            changeTypeName:"",
            checkBillUid:"",
            saveStatus:"",
            uid:"",
            variance:"",
            recheckStoreCount:"",
            recordStoreCount:"",
            checkStoreCount:"",
            resizeVariance:""
          }
        } else {
          // this.$message("请输入带*必填项");
          return false;
        }
      });  
     
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
    seeChayiEvent(row,index) {
      this.newchangeHandle = ""
      let lsActive = row.checkStoreCount-row.recordStoreCount
      this.ykVal = lsActive
      this.ykActive = lsActive >= 0 ? true : false
      this.thischuliIndex = index
      this.deHadle = row.changeHandle
      let newchayiData={
        changeHandle:row.changeHandle,
        checkBillUid:row.checkBillUid,
        uid:row.uid,
        variance:row.variance,
        recheckStoreCount:row.recheckStoreCount,
        recordStoreCount:row.recordStoreCount,
        checkStoreCount:row.checkStoreCount,
        resizeVariance:row.resizeVariance,
        changeReason:row.changeReason,
        rechangeReason:row.rechangeReason,
        changeTypeCode:row.changeTypeCode,
        changeTypeName:row.changeTypeName,
        merName:row.merName
      }
      this.chayiData = newchayiData
      if(this.chayiData.changeHandle == "1"){
          this.newchangeHandle = this.ykActive == true ? "接受盘盈":"接受盘亏"
      }else{
          this.newchangeHandle = this.ykActive == true ? "调整盘盈":"调整盘亏"
      }
      this.chayiData.changeHandle = this.chayiData.changeHandle === null ? "1" : this.chayiData.changeHandle.toString()
      this.jtshuzhi = this.chayiData.recheckStoreCount
      if(row.changeTypeName == null || row.changeTypeName== ""){

      }else{
        let selectedWorkName = {};
         selectedWorkName = this.CYdata.find((item)=>{
             return item.keyDesc === row.changeTypeName;
         });
         console.log(selectedWorkName)
         this.chayiData.changeTypeCode = selectedWorkName.keyCode
      }
      this.chayidialogVisible = true
    },
    ThandleSubmit() {
      let newAvtive = {}
      let dqActive = ""
      this.queryData.checkBillMerEntityList.some((val,newindex,arr)=>{
        if( val.doStatus === null){
          return newAvtive = {a1:true,a2:val}
        }
      })
      if(newAvtive.a1 === true){
        this.$message(newAvtive.a2.merName+":没有进行差异处理");
      }else{
        this.resCheckBillSubmitCheck(this.queryData,1)
        
      }
    },
    chuliCancel(){
      this.resCheckBillSubmitCheck(this.queryData,2)
      this.handleCancel()
    },
    changeHandleEvent(){
      console.log(this.thischuliIndex)
      console.log(this.chayiData.changeHandle)
      this.newykval = ""
      this.jtshuzhi = ""
      if(this.chayiData.changeHandle == 1){

        // this.queryData.checkBillMerEntityList.forEach((val,index,arr)=>{
        //   if(index === this.thischuliIndex){
        //     val.recheckStoreCount = null
        //   }
        // })
        // this.newresizeVariance = parseInt(this.chayiData.variance)
      }else{
        // this.
        // this.chayiData.recheckStoreCount = ""
      }
    },
    handleCancel() {
      this.$store.commit("tagNav/removeTagNav", {
          name: this.$route.name,
          path: this.$route.path,
          title: this.$route.meta.title,
          query: this.$route.query
      })
      // console.log(JSON.stringify(this.queryData))
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
    saleCinemastatus(status) {
      let result = ""
      switch (status) {
        case 1:
          result = "未提交";
          break;
        case 2:
          result = "待差异处理";
          break;
        case 3:
          result = "处理完成";
          break;
        case 4:
          result = "盘点完成";
          break;
      }
      return result;
    },
    saleCinemaapprovalStatus(approvalStatus) {
      let result = "";
        switch (approvalStatus) {
          case 0:
            result = "未审核";
            break;
          case 1:
            result = "待审核";
            break;
          case 2:
            result = "审核通过";
            break;
          case 3:
            result = "审核不通过";
            break;
          case 4:
            result = "无需审核";
            break;
        }
        return result;
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
        this.rescheckBillStorehouse(this.queryData)
      }else if(this.queryData.storeType == "2"){
        this.resCheckBillStorageRack(this.queryData)
      }
    },
    // 盘点方案事件
    pdfnSelEvent(){
      this.resCheckBillCategory()   
    },
    changePdfnEvent(){
      this.resCheckBillCategory()   
      let selectedWorkName = {};
       selectedWorkName = this.CYdata.find((item)=>{
           return item.keyCode === this.chayiData.changeTypeCode;
       });
       console.log(selectedWorkName)
       this.chayiData.changeTypeName = selectedWorkName.keyDesc
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
          }
        })
        .catch(err => {});
    },
    // 请求货架列表
    resCheckBillStorageRack(row){
      let val = {
        cinameUid:row.uid
      }
      this.$cimList.inventoryManagement
        .checkBillStorageRack(val)
        .then(res => {
          if (res.code === 200) {
            this.storeData = res.data
            console.log(res)
          } else {
            this.$message(res.msg);
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
          }
        })
        .catch(err => {});
    },
    chayihandleClose(){
       // 每次盘点差异刷新总金额
        let totalPrice = 0
        this.queryData.checkBillMerEntityList.forEach((val,index,arr)=>{
            if(val.doStatus === 2){
              // 差异成本金额
              let vala = parseFloat(val.varianceCostPrice)
              // 调整后差异数
              let valb = parseFloat(val.resizeVariance)
              // 差异数
              let valc = parseFloat(val.variance)
              // 调整差异金额计算方法：差异成本金额+调整后差异*(差异成本金额/差异数)
              totalPrice =valb*(vala/valc)+totalPrice
              console.log(totalPrice)             
            }else{
              totalPrice = totalPrice + parseFloat(val.varianceCostPrice)
            }
        })
        this.queryData.totalPrice = totalPrice
    },
    getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总金额';
            return;
          }
          if(index === 1){
            sums[index] = this.queryData.totalPrice;
            return;
          }
          // const values = data.map(item => Number(item[column.property]));
          // if (!values.every(value => isNaN(value))) {
          //   sums[index] = values.reduce((prev, curr) => {
          //     const value = Number(curr);
          //     if (!isNaN(value)) {
          //       return prev + curr;
          //     } else {
          //       return prev;
          //     }
          //   }, 0);
          //   sums[index] += ' 元';
          // } else {
          //   sums[index] = 'N/A';
          // }
        });

        return sums;
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
    StoreCountEvent(){
      console.log(this.jtshuzhi)

      // this.newresizeVariance = parseInt(this.chayiData.recheckStoreCount) - parseInt(this.chayiData.recordStoreCount)
    },
    elseStoreCountEvent(){
      this.newresizeVariance = parseInt(this.chayiData.recordStoreCount)
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
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {});
    },
    // 差异类别列表
    resCheckBillCategory(){
      this.$cimList.inventoryManagement
        .checkBillCategory()
        .then(res => {
          if (res.code === 200) {
            this.pdfnData = res.data
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {});
    },
    // 处理差异(接受盘亏)
    resCheckBillDifferenceManage(val){
      this.$cimList.inventoryManagement
        .checkBillDifferenceManage(val)
        .then(res => {
          if (res.code === 200) {
            let valnew = res.data.uid
            this.queryData.checkBillMerEntityList.forEach((val,index,arr)=>{
              if(valnew == val.uid){
                arr[index].resizeVariance = res.data.resizeVariance
              }
            })
            this.$message("盘亏成功");
            // this.resCheckBillQueryCheckBill(this.queryData)
            cosnole.log(res)
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {});
    },
    // // 跳转修改页面请求
    // resCheckBillQueryCheckBill(row){
    //   let val = {
    //     uid:row.uid
    //   }
    //   this.$cimList.inventoryManagement
    //     .checkBillQueryCheckBill(val)
    //     .then(res => {
    //       if (res.code === 200) {
    //         this.queryData = res.data
    //         this.queryData.checkBillMerEntityList = this.queryData.checkBillInfoVoList
    //       } else {
    //         this.$message(res.msg);
    //       }
    //     })
    //     .catch(err => {});
    // },
    // 处理提交审核
    resCheckBillSubmitCheck(row,num){
      let val = {
        billCode:row.billCode,
        saveStatus:num,
        uid:row.uid,
        checkBillInfoVoList:row.checkBillMerEntityList
      }
      this.hhhh = val
      console.log(val)
      this.$cimList.inventoryManagement
        .checkBillSubmitCheck(val)
        .then(res => {
          if (res.code === 200) {
            if(num === 1){
              this.handleCancel()
              this.$message("处理成功");
            }
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {});

    },
    approvalStart(type) {
      let result = "";
      switch (this.queryData.approvalStatus) {
          case 0:
              result = "未审核";
              break;
          case 1:
              result = "待审核";
              break;
          case 2:
              if (type == 1) {
                  result = "审核通过";
              } else {
                  result = "开始";
              }
              break;
          case 3:
              result = "审核不通过";
              break;
          case 4:
              result = "无需审核";
              break;
      }
      return result;
    },
    tableColor(row){
      let result = "";
      switch (row.color) {
          case "red":
              result = 'color:green';
              break;
          case "green":
              result = 'color:red';
              break;
      }
      return result;
    }
  },
  computed: {
    pamkuiDataEvent(){
      this.pamkuiData = this.chayiData.checkStoreCount-this.chayiData.recordStoreCount
    },
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
        case "4":
          return "处理";
          break;  
      }
    },
    approvalActive() {
        let result = 0;
        switch (this.queryData.approvalStatus) {
            case 0:
                result = 1;
                break;
            case 1:
                result = 1;
                break;
            case 2:
                result = this.queryData.reviewRecordList.length + 2
                break;
            case 3:
                result = this.queryData.reviewRecordList.length + 2
                break;
            case 4:
                result = 1;
                break;
        }
        return result;
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
.imsee{
.basic-input {
  min-width: 250px;
}
.select-input {
  .el-input {
    width: 65%;
  }
}
.remnant{
  vertical-align: top;
  color: #999;
}
.remark-input {
  width: 300px;
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
.el-collapse-item__wrap{
  padding-top:0px
}
}
</style>