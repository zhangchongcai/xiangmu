<template>
  <div class="grTR-style">
    <!-- {{this.queryData}} -->
    <div class="common-header">
      <el-form
        :inline="true"
        :model="queryData"
        label-position="right"
        label-width="100px"
        label-suffix=":"
      >
        <el-form-item label="调拨单号">
          <el-input
            v-model="queryData.billCode"
            placeholder="请输内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="调入门店" class="select-input">
            <el-input
                    v-model="queryData.inCinemaName"
                    clearable
                    @clear="onCinemalSumit"
                    @focus="selectCinemalDialog"
                    placeholder="请选择门店"
            ></el-input>
            <el-button @click="selectCinemalDialog" type="primary cinemaSel-btn" plain>选择</el-button>
        </el-form-item>

        <el-form-item label="调出门店" class="select-input">
            <el-input
                    v-model="queryData.outCinemaName"
                    clearable
                    @clear="onCinemalSumit1"
                    @focus="selectCinemalDialog1"
                    placeholder="请选择门店"
            ></el-input>
            <el-button @click="selectCinemalDialog1" type="primary cinemaSel-btn" plain>选择</el-button>
        </el-form-item>
        
        <el-form-item label="制单日期">
          <el-date-picker
            class="basic-input"
            v-model="queryData.billTimeTotal"
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
            <el-option label="已提交" value="2"></el-option>
            <el-option label="完成出库" value="3"></el-option>
            <el-option label="完成入库" value="4"></el-option>
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
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click.stop="handleOperateEvent('1', row)">查看</el-button>
              <el-button type="text" size="small" @click.stop="handleOperateEvent('2', row)" v-if="row.status == '1' || row.approvalStatus == '3'">编辑</el-button>
              <el-button type="text" size="small" @click.stop="handleOperateEvent('3', row)" v-if="row.status == '1'">提交</el-button>
              <el-button type="text" size="small" @click.stop="handleOperateEvent('4', row)" v-if="row.status == '1'">删除</el-button>
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
    <!-- 选择调入门店 -->
      <cinemal-dialog ref="myCinemalDialog" @onSumit="onCinemalSumit" :dialogFeedbackData="[{cinemaUid:queryData.inCinemaUid,cinemaName:queryData.inCinemaName}]"></cinemal-dialog>
      <!-- 选择调出门店 -->
      <cinemal-dialog ref="myCinemalDialog1" @onSumit="onCinemalSumit1" :dialogFeedbackData="[{cinemaUid:queryData.outCinemaUid,cinemaName:queryData.outCinemaName}]"></cinemal-dialog>
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
      selData:{},
      //查询数据
      queryData: {
        billTimeTotal:null,
        beginTime:"",
        endTime:"",
        billCode:"",
        inCinemaName:"",
        inCinemaUid:"",
        outCinemaName:"",
        outCinemaUid:"",
        status:"",
        approvalStatus:"",
        status:"",
        pageSize: 15,
        page: 1
      },
      total: 0,
      // 表格表头
      tableColumn: [
        {
          label: "调拨单号",
          key: "billCode"
        },
        {
          label: "调入门店",
          key: "inCinemaName"
        },
        {
          label: "调出门店",
          key: "outCinemaName"
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
              case "1":
                result = "未提交";
                break;
              case "2":
                result = "已提交";
                break;
              case "3":
                result = "完成出库";
                break; 
              case "4":
                result = "完成入库";
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
              case "0":
                result = "未审核";
                break;
              case "1":
                result = "待审核";
                break;
              case "2":
                result = "审核通过";
                break;
              case "3":
                result = "审核不通过";
                break; 
              case "4":
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

      //  this.$nextTick(() => {
      //     this.returnType = this.$route.query.returnType
      //       if(this.returnType === true){
      //         this.queryData.cinemaUid = JSON.parse(this.$route.query.cinema).cinemaUid
      //         this.queryData.cinemaName = JSON.parse(this.$route.query.cinema).cinemaName
      //       }
      //       if(this.queryData.cinemaUid == "" || this.queryData.cinemaUid == null){
      //       }else{
              this.onQuery()
      //       }
      // })
      
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
    // 关闭调出门店
    selectCinemalDialog1() {
      this.$refs.myCinemalDialog1.handleDialog(true);
    },

    // 查询
    onQuery() {
        if (this.queryData.billTimeTotal != null) {
          this.queryData.beginTime = this.queryData.billTimeTotal[0];
          this.queryData.endTime = this.queryData.billTimeTotal[1];
        } else {
          this.queryData.beginTime = "";
          this.queryData.endTime = "";
        }
        this.goodsDataQueryGoodsList(this.queryData)
    },
    // 调拨申请查询接口
    goodsDataQueryGoodsList(data){
      this.$cimList.goodsWarehousingApply
        .allotBillList(data)
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data.list
            this.tableData.forEach((val,index)=>{
              val.status = val.status.toString()
              val.approvalStatus = val.approvalStatus.toString()
            })
            this.total = res.total
            console.log(res)
          } else {
            this.$message(res.msg);
          }
        })
    },
    // 新增调拨申请
    addinvent(){
      this.handleNewPurchaseNote({
        type:"1"
      })
    },

    // 跳转库存转移
    handleNewPurchaseNote(param) {
      this.$router.push({
        path: "common",
        query: param
      });
    },
    handleOperateEvent(type, row) {
      switch (type) {
        case "1":
          // 查看
          this.seetable(row)
          break;
        case "2":
          //编辑
          this.edirtable(row)
          break;
        case "3":
          //提交
           this.tjtable(row)
          break;
        case "4":
          //删除
          this.detable(row)
          break;
      }
    },
    // 查看操作
    seetable(row){
      this.handleNewPurchaseNote({
          type:"3",
          data:JSON.stringify(row.uid)
        })
    },
    // 编辑操作
    edirtable(row){
      if(row.status == "1"){
        this.handleNewPurchaseNote({
          type:"2",
          data:JSON.stringify(row.uid)
        })
      }else if(row.status == "2" && row.approvalStatus == "3"){
        this.handleNewPurchaseNote({
          type:"4",
          data:JSON.stringify(row.uid)
        })
      }
    },
    // 提交操作
    tjtable(row){
      this.resAllotBillRefer(row)
    },
    // 提交请求
    resAllotBillRefer(row) {
      let val = {
        uid:row.uid
      }
      this.$cimList.goodsWarehousingApply
        .allotBillRefer(val)
        .then(res => {
          if (res.code == 200) {
            this.onQuery()
            this.$message("提交成功");
          }
        });
      },
      // 删除操作
      detable(row){
        this.resAllotBillDelete(row)
      },
      // 删除请求
      resAllotBillDelete(row) {
      let val = {
        uid:row.uid
      }
      this.$cimList.goodsWarehousingApply
        .allotBillDelete(val)
        .then(res => {
          if (res.code == 200) {
            this.onQuery()
            this.$message("删除成功");
          }
        });
      },
      // 分页
      handleSizeChange(val) {
        this.queryData.pageSize = val;
        this.goodsDataQueryGoodsList();
        console.log(`每页 ${val} 条`);
      },
      // 分页
      handleCurrentChange(val) {
        this.queryData.page = val;
        this.goodsDataQueryGoodsList();
        console.log(`当前页: ${val}`);
      },
  },
  components: {
    cinemalDialog
  }
};
</script>

<style lang="scss">
@import "../../../../assets/css/common.scss";
@import "../../../../assets/css/element-common.scss";
.grTR-style{
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