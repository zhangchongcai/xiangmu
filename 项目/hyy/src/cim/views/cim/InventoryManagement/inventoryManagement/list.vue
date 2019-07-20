<template>
  <div class="itm-style">
    <div class="common-header">
      <el-form
        :inline="true"
        :model="queryData"
        label-position="right"
        label-width="100px"
        label-suffix=":"
        >
        <el-form-item label="盘点单号">
          <el-input
            v-model="queryData.billCode"
            placeholder="请输内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="盘点门店" class="select-input">
            <el-input
                    v-model="queryData.cinemaName"
                    clearable
                    @clear="onCinemalSumit"
                    @focus="selectCinemalDialog"
                    placeholder="请选择门店"
            ></el-input>
            <el-button @click="selectCinemalDialog" type="primary cinemaSel-btn" plain>选择</el-button>
        </el-form-item>
        <el-form-item label="盘点月份">
          <el-date-picker
            v-model="queryData.checkMonth"
            type="month"
            placeholder="选择月"
            format="yyyy-MM"
            value-format="yyyy-MM"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label='queryData.storeType != "" ? "":"仓库"' label-width="100">
          <el-select v-model="queryData.storeType" @change="changeStoreType()">
            <!-- <el-option label="全部" value></el-option> -->
            <el-option label="盘点仓库" value="1"></el-option>
            <el-option label="盘点货架" value="2"></el-option>
          </el-select>
          <template v-if="queryData.storeType != ''">
            <span>:</span>
            <el-select v-model="queryData.storehouseCode" @focus="storeSelEvent()" @change="changeStoreEvent()">
              <el-option 
                v-for = "item in storeData"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </template>  
        </el-form-item>
        <el-form-item label="制单日期">
          <el-date-picker
            class="basic-input"
            v-model="queryData.createTime"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="单据状态">
          <el-select v-model="queryData.status">
            <el-option label="全部" value></el-option>
            <el-option label="未提交" value="1"></el-option>
            <el-option label="待差异处理" value="2"></el-option>
            <el-option label="处理完成" value="3"></el-option>
            <el-option label="盘点完成" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="queryData.approvalStatus">
            <el-option label="全部" value></el-option>
            <el-option label="未审核" value="0"></el-option>
            <el-option label="待审核" value="1"></el-option>
            <el-option label="审核通过" value="2"></el-option>
            <el-option label="审核不通过" value="3"></el-option>
            <el-option label="无需审核" value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="query-btn-box">
          <el-button type="primary query-btn" @click="onQuery()">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
        <!-- {{this.queryData}} -->
        <!-- {{this.queryData.storehouseName}} -->
    <div>
      <div class="common-new-built">
        <el-button type="primary" size="small" plain @click="addinvent()">新建</el-button>
      </div>
      <div>
        <el-table :data="tableData" stripe :height="this.defaultTableHeight">
          <el-table-column
            v-for="item in tableColumn"
            :key="item.key"
            :prop="item.key"
            :label="item.label"
            :formatter="item.formatter"
          ></el-table-column>
          <el-table-column label="操作" width="200">
            <template 
              slot-scope="{row}">
              <el-button type="text" size="small" @click.stop="handleOperateEvent('1', row)">查看</el-button>
              <el-button 
                type="text" 
                size="small" 
                @click.stop="handleOperateEvent('2', row)"
                v-if="row.status === 1 || row.approvalStatus === 0"
                >编辑</el-button>
              <!-- <el-button 
                type="text" 
                size="small" 
                @click.stop="handleOperateEvent('3', row)"
                v-if="row.status === 1 && row.approvalStatus === 0"
                >提交</el-button> -->
              <el-button 
                type="text" 
                size="small" 
                @click.stop="handleOperateEvent('4', row)"
                v-if="row.status === 1 && row.approvalStatus === 0 || row.status === 4 && row.approvalStatus === 3"
                >删除</el-button>
              <el-button 
                type="text" 
                size="small" 
                @click.stop="handleOperateEvent('5', row)"
                v-if="row.status === 2 && row.approvalStatus === 0 || row.status === 4 && row.approvalStatus === 3"
                >差异处理</el-button>
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
    </div>
    <!-- 选择影院弹窗 -->
    <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit" :dialogFeedbackData="saleCinemaList"></cinemal-dialog>
    <!-- 选择供应商弹窗 -->
    <suppliers-dialog ref="mySuppliersDialog"></suppliers-dialog>
  </div>
</template>

<script>
import qs from "qs";
import mixin from "cim/mixins/cim/paginationConfig.js";
import cinemalDialog from "cim/components/cinemalDialog/cinemaDialog.vue";
import suppliersDialog from "cim/components/suppliersDialog/suppliersDialog.vue";
import mixins from "frame_cpm/mixins/cacheMixin";
export default {
  mixins: [mixin,mixins.cacheMixin],
  data() {
    return {
      cacheField:["queryData"],
      saleCinemaList:[],
      returnType:false,
      newBillCode:"",
      //查询数据
      queryData: {
        billTimeTotal:[],
        cinemaName: "",
        cinemaUid: "",
        endTime: "",
        beginTime: "",
        billCode: "",
        createTime: "",
        status: "",
        approvalStatus: "",
        checkMonth: "",
        storeType: "1",
        storehouseCode: "",
        storehouseName: "",
        pageSize: 15,
        page: 1
      },
      storeData:[],
      total: 0,
      // 表格表头
      tableColumn: [
        {
          label: "盘点单号",
          key: "billCode"
        },
        {
          label: "盘点门店",
          key: "cinemaName"
        },
        {
          label: "盘点方案",
          key: "solutionName"
        },
        {
          label: "盘点月份",
          key: "checkMonth"
        },
        {
          label: "盘点仓库",
          key: "storehouseName"
        },
        {
          label: "制单日期",
          key: "billTime"
        },
        {
          label: "制单员",
          key: "billUserName"
        },
        {
          label: "单据状态",
          key: "status",
          formatter(row, column, cellValue) {
            let result = "";
            switch (row.status) {
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
          }
        },
        {
          label: "审核状态",
          key: "approvalStatus",
          formatter(row, column, cellValue) {
            let result = "";
            switch (row.approvalStatus) {
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
          }
        }
      ],
      // 表格数据
      tableData: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.queryData.pageSize = this.pageSize
      this.$nextTick(() => {
        this.returnType = this.$route.query.returnType
        if(this.returnType === true){
          this.queryData.cinemaUid = JSON.parse(this.$route.query.cinema).cinemaUid
          this.queryData.cinemaName = JSON.parse(this.$route.query.cinema).cinemaName
          let newObj = {}
          newObj.cinemaUid = this.queryData.cinemaUid
          newObj.name = this.queryData.cinemaName
          this.saleCinemaList.push(newObj)
        }
        if(this.queryData.cinemaUid == "" || this.queryData.cinemaUid == null){

        }else{
          this.resCheckBillQuery(this.queryData)
        }
      })
      
    },
    // 查询
    onQuery() {
      if (this.queryData.createTime) {
        this.queryData.beginTime = this.queryData.createTime[0];
        this.queryData.endTime = this.queryData.createTime[1];
      } else {
        this.queryData.beginTime = "";
        this.queryData.endTime = "";
      }

      if(this.queryData.cinemaUid == "" || this.queryData.cinemaUid == null){
        this.$message("请选择影院");
      }else{
        // if(this.queryData.storeType == "1" && this.queryData.storehouseCode == "" && this.queryData.storehouseName == ""){
        //   this.$message("请选择仓库");
        // }else if(this.queryData.storeType == "2" && this.queryData.storehouseCode == "" && this.queryData.storehouseName == ""){
        //   this.$message("请选择货架");
        // }else{
          this.resCheckBillQuery(this.queryData)
        // }
      }
      
      // console.log(this.queryData)
      // this.resCheckBillQuery(this.queryData)
      // console.log(this.queryData);
    },
    // 新建按钮
    // handleNewPurchaseNote() {
    //   console.log("新建");
    //   this.$router.push({
    //     path: "common",
    //     query: {}
    //   });
    // },
    handleNewPurchaseNote(param) {
      this.$router.push({
        path: "common",
        query: param
      });
    },
    handleNewCommonSee(param) {
      this.$router.push({
        path: "commonSee",
        query: param
      });
    },
    // 新建盘点单
    addinvent(row){
      this.handleNewPurchaseNote({
        type:"1",
        data:JSON.stringify(row)
      })
    },
    handleOperateEvent(type, row) {
      switch (type) {
        case "1":
          // 查看
          this.seetable(row)
          break;
        case "2":
          //编辑
          this.eaittable(row)
          break;
        case "3":
          //提交
          break;
        case "4":
          //删除
          this.handleeDlete(row);
          break;
        case "5":
          //处理
          this.chuliable(row)
          break;
      }
    },
    // 删除操作
    handleeDlete(row) {
      this.$confirm("确认删除吗, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            this.resCheckSolutionDelete(row)
        })
    },
    // 修改操作
    eaittable(row){
      this.resCheckBillToPage(row,"2")
    },
    // 查看操作
    seetable(row){
      let seeStatus = row.status === 2 && row.approvalStatus === 0 || row.status === 4 && row.approvalStatus === 3
      this.resCheckBillQueryCheckBill(row,"3",seeStatus)
    },
    // 处理操作
    chuliable(row){
      this.resCheckBillQueryCheckBill(row,"4")
    },
    // 选泽门店回调
    onCinemalSumit(data = []) {
      if(data.length == 0){
        this.$nextTick(() => {
          this.queryData.storehouseCode = ""
          this.queryData.storehouseName = ""  
        })
      }
      if (data.length > 0) {
        this.queryData.cinemaName = data[0].name || data[0].cinemaName;
        this.queryData.cinemaUid = data[0].uid || data[0].cinemaUid;
      } else {
        this.queryData.cinemaName = null;
        this.queryData.cinemaUid = null;
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
    selectCinemalDialog() {
      this.$refs.myCinemalDialog.handleDialog(true);
    },
    selectSuppliersDialog() {
      this.$refs.mySuppliersDialog.handleDialog(true);
    },
    handleSizeChange(val) {
      this.queryData.pageSize = val;
      this.resCheckBillQuery(this.queryData);
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      this.queryData.page = val;
      this.resCheckBillQuery(this.queryData);
      console.log(`当前页: ${val}`);
    },
    storeSelEvent(){
      this.storeData = []
      if(this.queryData.cinemaUid == "" || this.queryData.cinemaUid ==null){
        this.$message("请选择门店");
      }else{
        if(this.queryData.storeType == "1"){
          this.rescheckBillStorehouse(this.queryData.cinemaUid)
        }else if(this.queryData.storeType == "2"){
          this.resCheckBillStorageRack(this.queryData.cinemaUid)
        }
      }
      
    },
    changeStoreType(){
        this.queryData.storehouseCode = ""
        this.queryData.storehouseName = ""
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
          }
        })
        .catch(err => {});
    },
    // 请求盘点单首页查询
    resCheckBillQuery(row){
      row.name = row.storehouseName 
      this.$cimList.inventoryManagement
        .checkBillQuery(row)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data.list
            this.total = res.data.total
            console.log(res)
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {});
    },
    // 盘点单删除请求
    resCheckSolutionDelete(row){
      let val = {
        approvalStatus:row.approvalStatus,
        status:row.status,
        uid:row.uid
      }
      this.$cimList.inventoryManagement
        .checkBillDelete(val)
        .then(res => {
          if (res.code === 200) {
            this.resCheckBillQuery(this.queryData)
            this.$message("删除成功");
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {});

    },
    // 跳转修改页面请求
    resCheckBillToPage(row,type){
      let val = {
        uid:row.uid
      }
      this.$cimList.inventoryManagement
        .checkBillToPage(val)
        .then(res => {
          if (res.code === 200) {
            this.handleNewPurchaseNote({
              type:type,
              data:JSON.stringify(res.data)
            })
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {});

    },
    // 跳转修改页面请求
    resCheckBillQueryCheckBill(row,type,active){
      let val = {
        uid:row.uid
      }
      this.$cimList.inventoryManagement
        .checkBillQueryCheckBill(val)
        .then(res => {
          if (res.code === 200) {
            this.handleNewCommonSee({
              type:type,
              data:JSON.stringify(res.data),
              active:active
            })
          } else {
            this.$message(res.msg);
          }
        })
        .catch(err => {});
    },
  },
  computed:{
    typeCk() {
      switch (this.queryData.storeType) {
        case "1":
          return "仓库";
          break;
        case "2":
          return "货架";
          break;
      }
    }
  },
  components: {
    cinemalDialog,
    suppliersDialog
  }
};
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";
.itm-style{
  .select-input {
    .el-input {
      width: 70%;
    }
  }

  .newPro-box {
    .title {
      margin: 10px 0;
      font-size: 16px;
    }
    .selectName {
      font-size: 16px;
      margin: 10px 0;
    }
    .newProTree {
      height: 330px;
      overflow: auto;
    }
  }
}
</style>