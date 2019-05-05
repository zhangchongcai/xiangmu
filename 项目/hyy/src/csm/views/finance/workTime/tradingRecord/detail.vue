<template>
  <div class="cinemaList">
    <!-- 面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: 'list' }">订单管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: 'detail' }">订单明细</el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class="searchAdition">
      <p class="div_title"><i class="el-icon-arrow-down">基础信息</i></p>
      <el-form :inline="true" size="small" label-width="100px">
        <el-row :gutter="24" style="height:32px;">
          <el-col :span="7">
            <el-form-item label="订单单号:">
              <span>{{dataTotal.billCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="订单类型:">
              <span>{{billType[dataTotal.billType]}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="订单状态:">
              <span>{{billStatus[dataTotal.billStatus]}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="21">
          <el-col :span="7">
            <el-form-item label="订单影院:">
              <span>{{dataTotal.cinemaName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="订单时间:">
              <span>{{dataTotal.createTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="订单金额:">
              <span>{{dataTotal.payAmount - dataTotal.rejectAmount}}元</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="21">
          <el-col :span="7">
            <el-form-item label="订单终端:">
              <span>{{dataTotal.channelCode}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="收银员:">
              <span>{{dataTotal.userName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="审核状态:">
              <span>{{dataTotal.applyStatusType=dataTotal.applyStatusType == "T" ? "已审核" : "未审核"}}</span>
            </el-form-item>
          </el-col>
          
        </el-row>
        <el-row :gutter="21">
          <el-col :span="7">
            <el-form-item label="创建时间:">
              <span>{{dataTotal.createTime}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="订单渠道:">
              <span>{{dataTotal.channelName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="手机号:">
              <span>{{dataTotal.phone}}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="21">
        <el-col :span="7">
            <el-form-item label="退货状态:">
              <span>{{rejectStatus[dataTotal.rejectStatus]}}</span>
            </el-form-item>
          </el-col>
          </el-row>
      </el-form>
    </div>
    <!-- 商品明细 -->
    <div class="table_div">
      <p class="div_title">
        <i class="el-icon-arrow-down">商品明细</i>
        <!-- <el-button plain class="title_btn" type="primary">查看取货码</el-button>
        <el-button plain class="title_btn" type="primary">查看操作过程</el-button> -->
      </p>
      <el-table :data="goodList" style="width: 100%">
        <el-table-column prop="goodsType" label="商品类型">
        </el-table-column>
        <el-table-column prop="reportStatus" label="上报状态">
        </el-table-column>
        <el-table-column prop="applyStatus" label="审核状态">
        </el-table-column>
        <el-table-column prop="goodsName" label="商品名称">
        </el-table-column>
         <el-table-column prop="saleNum" label="销售数量">
        </el-table-column>
        <el-table-column prop="saleTotal" label="销售金额（元)" width="130">
        </el-table-column>
         <el-table-column prop="rejectNum" label="退货数量">
        </el-table-column>
        <el-table-column prop="rejectTotal" label="退货金额金额（元）" width="180">
        </el-table-column>
          <el-table-column prop="goodItemName" label="商品明细" show-overflow-tooltip>
              </el-table-column>
         <el-table-column label="电影票信息码" show-overflow-tooltip prop="ticketInfoCode" width="120">
            <!-- <template slot-scope="">
              <span class="icon-color" >查看</span>
            </template> -->

        </el-table-column>
      </el-table>
    </div>
    <!-- 支付明细 -->
    <div class="table_div">
      <p class="div_title">
        <i class="el-icon-arrow-down">支付明细</i>
        <!-- <el-button plain class="title_btn" type="primary">查看取货码</el-button>
        <el-button plain class="title_btn" type="primary">查看操作过程</el-button> -->
      </p>
      <el-table :data="saleList" style="width: 100%">
        <el-table-column prop="payTypeName" label="支付方法" width="180">
        </el-table-column>
        <el-table-column prop="payNo" label="订单流水号" width="180">
        </el-table-column>
         <el-table-column prop="opType" label="交易类型">
        </el-table-column>
        <el-table-column prop="payAmount" label="支付金额（元）">
        </el-table-column>
         <el-table-column prop="rejectAmount" label="退款金额（元）">
        </el-table-column>
      </el-table>
    </div>
    <!-- 底部 -->
    <div style="height:80px;background:transparent;"></div>
    <div class="bottom-handler-tool">
      <div class="btn-area">
        <el-button type="primary">打印</el-button>
        <el-button type="primary">导出Excel</el-button>
        <!-- <el-button>取消</el-button> -->
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>
<script type="text/javascript">
  // 商品类型
  let goodType={
    1:"普通商品",2:"服务商品",3:"套餐",4:"电影票",5:"网络代售费",6:"增值服务费",
    7:"会员服务",8:"票券销售",12:"原材料",13:"现调"
  };
  let applyStatus = {
    1:"不需要审核",2:"广电受理中",3:"受理成功",4:"广电未受理",5:"受理失败"
  } 
  export default {
    components: {},
    data() {
      return {
        // 订单类型
        billType: {
          1: "商品销售",
          2: "会员服务",
          3: "赠送",
          4: "报损",
          5: "留座",
          6: "影票补登",
          21: "会员开卡",
          22: "会员充值",
          23: "会员补卡",
          24: "会员注销",
          25: "升级换卡",
          26: "充值冲销",
          27: "会员激活",
          28: "余额结转"
        },
        // 订单状态
        billStatus:{
          0:"新建",1:"支付中",2:"完成",5:"预定", 6:"订单取消",7:"预定结束"
        },
        rejectStatus:{
          0:"未退货",1:"部分退货",2:"全部退货"
        },
        // 商品类型
        goodType:{
          1:"普通商品",2:"服务商品",3:"套餐",4:"电影票",5:"网络代售费",6:"增值服务费",
          7:"会员服务",8:"票券销售",12:"原材料",13:"现调"
        },
        // 总的数据
        dataTotal:{},
        // 商品明细
        goodList:[],
        // 支付明细
        saleList:[]
      }
    },
    methods: {
      getDetail() {
        let limit = {
          saleBillUid:this.$route.query.id
        };
        this.$csmList.payDetail(Object.assign({}, limit))
          .then(data => {
            console.log(data)
            if (data && data.code === 200) {
              this.dataTotal = data.data
              this.goodList.push(...data.data.goodsList)
              // 商品明细的操作
              this.goodList.map(item =>{
                item.goodsType = goodType[item.goodsType]
                item.applyStatus = applyStatus[item.applyStatus]
                // && 前真返回后面 || 前真返回前面 
                // item.reportStatus = item.reportStatus == "NO"&&"未上报" ||( "FAIL"&&"上报失败" || "REPORTED"&&"已上报" )
                item.reportStatus = item.reportStatus == "NO"?"未上报":item.reportStatus == "FAIL"?"上报失败":"已上报" 
                item.saleTotal = item.saleNum * item.salePrice
                item.rejectTotal = item.rejectNum * item.salePrice
                console.log(item)
                for (const key in item) {
                  item[key] = item[key] == "0"?"——":item[key]
                }
                return item
              })
              this.saleList.push(...data.data.saleBillPayList)
              this.saleList.map(item =>{
                item.opType = item.opType == "1"?"销售支付":item.opType == "2"?"支付冲销":退货退款
                for (const key in item) {
                  item[key] = item[key] == "0"?"——":item[key]
                }
                return item
              })
            }
          })
      },
      cancelFun() {

      }
    },
    created() {
      this.getDetail();
    }
  };
</script>
<style lang="scss" scoped>
  //  提示信息
  .el-form{
    box-sizing: border-box;
    overflow: hidden;
  .el-row {
    .el-form-item {
      margin-bottom: 0;
    }
  }
  }
  // title 
  .table_div,.searchAdition{
    margin-bottom: 20px;
  }
  .div_title {
    padding: 1em;
    // overflow: hidden;
    line-height: 32px;

    .title_btn {
      padding: 8px 12px;
      float: right;
      margin-right: 12px;
      // width: 88px;
      height: 32px;

      span {
        font-size: 12px;
      }
    }

    &::after {
      content: '';
      display: block;
      clear: both;
    }

    &::before {
      content: '';
      display: inline-block;
      width: 2px;
      height: 10px;
      background-color: rgb(25, 40, 80);
      margin-right: 10px;
    }

    // border-left: 2px rgb(25, 40, 80) solid;
    .el-icon-arrow-down:before {
      margin-right: 5px;
    }
  }

  // 基础信息
  .el-form-item__label,
  .el-form-item__content span {
    font-size: 12px;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }

  // 设置表单增删的长度
  .content {
    // .el-input {
    //   width: 192px;
    // }

    .like_ul {
      padding: 8px 8px 0;
    }

    .el-form-item {
      margin: 0;
    }
  }

  //设置折叠框箭头和位置
  .el-collapse-item__arrow {
    margin: 0 8px 0;
    // transform: rotate(-90deg);
  }

  .el-collapse-item__header {
    display: inline-block;
    border-bottom: none;
    position: relative;
    padding: 7px 0;
    font-size: 14px;
    color: #333;

    &::after {
      left: 0;
      bottom: 0;
      width: 968px;
      height: 1px;
      content: "";
      position: absolute;
      background-color: #ebeef5;
      z-index: 1;
    }
  }

  // 清除.el-form-item的长度限制
  .el-form-item {
    width: auto;
  }

  //时间选择器样式
  .el-date-editor .el-range-separator {
    line-height: 24px;
  }

  .el-date-editor .el-range__icon {
    line-height: 24px;
  }

  .el-date-editor--daterange.el-input__inner {
    width: 256px;
  }

  .el-date-table td span {
    border-radius: 0;
  }

  .like-lable {
    color: #606266;
    padding: 0 12px 0 0;
    width: 100px;
    box-sizing: border-box;
    white-space: nowrap;
    text-align: right;
  }

  .search-time {
    display: flex;
  }

  .el-input--suffix {
    width: 177px;
  }

  .search-btn {
    margin-left: 30px;
  }

  // 底部
  .bottom-handler-tool {
    height: 64px;
    width: 100%;
    position: fixed;
    z-index: 999;
    bottom: 0;
    right: 0;
    background-color: #f5f5f5;

    .btn-area {
      width: 500px;
      margin: 0 auto;
      height: 64px;
      text-align: center;
      padding-top: 16px;
      box-sizing: border-box;
    }
  }
</style>