<template>
  <div class="my-dialog">
    <el-dialog title="选择票券批次" :close-on-click-modal="false" :visible.sync="dialogVisible">
      <!-- 查询 -->
      <el-form label-width="" :inline="true">
        <div class="select-header">
          <el-form-item label="申请单号：" label-width="80px">
            <el-input v-model="applyCode" style="width:150px" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="票券名称：" label-width="80px">
            <el-input v-model="couponName" style="width:150px" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="票券类型：" label-width="80px">
            <el-select v-model="couponType" style="width:150px">
              <el-option label="全部" value>全部</el-option>
              <el-option label="兑换券" value="0">兑换券</el-option>
              <el-option label="代金券" value="1">代金券</el-option>
              <el-option label="优惠券" value="2">优惠券</el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" style="font-size:12px;" @click="search">查询</el-button>
        </div>
      </el-form>
      <!-- 列表区域 -->
      <div class="choose_table">
        <div>
          <!-- 列表 -->
          <el-table class="choose-table-list" :data="tableList" @row-click="select" ref="multipleTable">
            <el-table-column width="50px">
              <template slot-scope="scope">
                <el-radio v-model="selectedId" :label="scope.row.applyCode">&nbsp;</el-radio>
              </template>
            </el-table-column>
            <template v-for="(item,index) in tableConfig">
              <el-table-column :key="index" v-if="item.hasTemplate" :prop="item.prop?item.prop:''" :label="item.label?item.label:''">
                <div slot-scope="scope">
                  {{item.label=="票券类型"?formatType(scope.row):""}}
                </div>
              </el-table-column>
              <el-table-column :key="index" v-else :prop="item.prop?item.prop:''" :label="item.label?item.label:''" :width="item.width?item.width:''"></el-table-column>
            </template>
          </el-table>
        </div>
        <!-- 分页 -->
        <div class="pagation">
          <el-pagination @current-change="handleCurrentChange" background :current-page.sync="pageData.pageNum" :page-size="pageData.size" layout="total,prev, pager, next, jumper" :total="pageData.total">
          </el-pagination>
        </div>
      </div>
      <!-- 底部按钮 -->
      <div class="btn-area" slot="footer">
        <el-button type="primary" @click="chooseCommit" style="margin-right:22px;">确定</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findSaleList } from "cmmSrc/http/interface.js"
export default {
  props: {
    customerType: {
      default: ''
    }
  },
  data () {
    return {
      dialogVisible: false,//显示弹窗
      selectedId: '',//储存选中id
      selectRows: '',//储存选中项
      applyCode: "",
      couponName: "",
      couponType: "",
      tableList: [],
      chooseItem: {},
      pageData: {
        pageNum: 1,
        total: 0,
        size: 10,
      },
      //列表配置
      tableConfig: [
        {
          label: '申请单号',
          prop: 'applyCode',
          // width: '315px',
          hasTemplate: false
        },
        {
          label: '票券名称',
          prop: 'couponName',
          // width: '315px',
          hasTemplate: false
        },
        {
          label: '票券类型',
          prop: 'couponTypeRight.couponType',
          // width: '314px',
          hasTemplate: true,
        },
      ]
    }
  },
  watch: {
    dialogVisible (val) {
      console.log(val)
      this.mydialogTableVisible = val;
      this.couponType = "";
      this.applyCode = "";
      this.couponName = "";
      this.selectedId = "";
      this.selectRows = "";
      this.chooseItem = {};
      this.tableList = []
    },
  },
  methods: {
    //过滤票券数据
    formatType (row) {
      if (row.couponTypeRight.couponType == 0) return '兑换券'
      if (row.couponTypeRight.couponType == 1) return '代金券'
      if (row.couponTypeRight.couponType == 2) return '优惠券'
    },
    // 查询
    search () {
      this.getCouponBatchSingleList()
    },
    //获取票券列表
    getCouponBatchSingleList (reviewData) {
      let params = {
        pageNo: this.pageData.pageNum,
        pageSize: this.pageData.size,
        couponType: this.couponType,
        applyCode: this.applyCode,
        couponName: this.couponName,
        state: "2",//已激活
        isPop: "true",//数量不为0
      }
      findSaleList(params).then(res => {
        if (res.data && res.code == 200) {
          this.tableList = res.data || []
          this.pageData.total = res.pageNum || 0
          //回显
          if (reviewData) {
            this.selectedId = reviewData.applyCode;
            this.selectRows = reviewData;
          }
        }
      }).catch(err => {
        console.log(err)
      })
    },
    //点击选择数据（暂时储存的数据）
    select (row) {
      if (row) {
        console.log(row)
        this.selectedId = row.applyCode || ""
        this.selectRows = row || [];
      }
    },
    //点击确定按钮
    chooseCommit () {
      this.$emit("callBack", this.selectRows);
      this.dialogVisible = false;
    },
    //打开弹窗
    openDialog (val, reviewData) {
      //初始化页面
      this.pageData = {
        pageNum: 1,
        total: 0,
        size: 10,
      },
        //显示弹窗
        this.dialogVisible = val
      //回显
      if ((JSON.stringify(reviewData) != "{}")) {
        this.chooseItem = JSON.parse(JSON.stringify(reviewData))
      } else {
        this.chooseItem = {}
      }
      console.log("chooseItem", this.chooseItem)
      //清除以前选项
      this.selectedId = ""
      this.selectRows = [];
      //请求
      this.getCouponBatchSingleList(this.chooseItem)
    },
    // 页面改变
    handleCurrentChange (val) {
      this.pageData.pageNum = val
      console.log(val)
      this.getCouponBatchSingleList()
    },
  },
}
</script>

<style lang="scss" scoped>
.my-dialog {
  .select-header {
    padding: 0 10px 10px 10px;
  }
  /deep/ .el-dialog {
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: #666666;
    // width: calc(576px + 224px);
    width: 892px;
    // height: 576px;
    border-radius: 4px;
    overflow: hidden;
    .choose_table {
      .choose-table-list {
        .el-table__empty-block {
          // width: 100%!important;
          min-height: 242px;
        }
      }
    }
    .el-dialog__header {
      padding: 10px 20px;
      .el-dialog__title {
        font-family: MicrosoftYaHei;
        color: #333333;
        letter-spacing: 0;
        line-height: 28px;
      }
    }
    .el-dialog__headerbtn .el-dialog__close {
      color: #979797;
    }
    .el-table__header-wrapper,
    .el-table__body-wrapper {
      overflow: hidden;
    }
    .el-icon-close {
      font-size: 8px;
    }
    .el-button {
      display: inline-block;
      width: 80px;
      height: 32px;
      line-height: 15px;
      vertical-align: middle;
      font-size: 12px;
    }
    .el-dialog__header::after {
      content: "";
      display: block;
      // width: calc(536px + 224px);
      width: 852px;
      height: 1px;
      background: #e5e5e5;
    }
    .pagation {
      text-align: center;
    }
    .el-pagination {
      padding: 14px 0;
    }
    .el-form-item {
      margin-right: 16px;
      margin-bottom: 0px;
      height: 40px;
      line-height: 40px !important;
      vertical-align: middle;
      .el-input__inner {
        font-size: 12px;
      }
      .el-form-item__content {
        line-height: 40px;
      }
      .el-form-item__label {
        font-size: 12px;
        height: 40px;
        line-height: 40px;
      }
    }
    .el-table {
      tr,
      th,
      td {
        padding: 0;
      }
      td {
        height: 34px;
      }
      .cell {
        // font-size: 12px;
        line-height: 25px;
        height: 25px;
        // float: left;
        // text-align: center;
      }
      .el-radio__label {
        padding: 0;
        display: none;
      }
    }
    .el-dialog__body {
      padding: 0px 10px;
    }
    .el-dialog__footer {
      padding: 0 20px 10px 20px;
    }
  }
}
</style>
