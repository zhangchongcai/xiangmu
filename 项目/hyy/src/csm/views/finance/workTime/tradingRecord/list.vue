<template>
  <div class="cinemaList">
    <!-- 面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: 'list' }">订单管理</el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class="searchAdition">
      <el-form :inline="true" class="demo-form-inline search-form" size="small" label-width="90px">
        <el-form-item label="订单单号:">
          <el-input v-model="searchAdition.billCode"></el-input>
        </el-form-item>
        <el-form-item label="订单类型:">
          <el-select v-model="searchAdition.billType">
            <el-option label="全部" value>全部</el-option>
            <!-- <el-option  v-for="(val,key) in billType" :key="key" :label="val" :value="key">{{val}}</el-option> -->
            <el-option label="商品销售" value="1">商品销售</el-option>
            <el-option label="会员开卡" value="21">会员开卡</el-option>
            <el-option label="会员充值" value="22">会员充值</el-option>
            <el-option label="会员补卡" value="23">会员补卡</el-option>
            <el-option label="会员注销" value="24">会员注销</el-option>
            <el-option label="升级换卡" value="25">升级换卡</el-option>
            <el-option label="充值冲销" value="26">充值冲销</el-option>
            <el-option label="会员激活" value="27">会员激活</el-option>
            <el-option label="余额结转" value="28">余额结转</el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div class="search-time">
            <span class="like-lable">订单时间:</span>
            <el-date-picker v-model="timeRange" type="daterange" unlink-panels range-separator="~" 
              start-placeholder="yyyy-MM-dd" end-placeholder="yyyy-MM-dd" :picker-options="pickerOptions"
              @change="chooseTime"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="收银员:">
          <el-input v-model="searchAdition.userName"></el-input>
        </el-form-item>
        <el-form-item label="商品名称:">
          <el-input v-model="searchAdition.goodName"></el-input>
        </el-form-item>
        <!-- 高级搜索 -->
         <el-form-item label="商品类型 :" v-show="isHigh">
          <el-select v-model="searchAdition.goodQueryType">
            <el-option label="全部" value>全部</el-option>
            <el-option label="电影票" value="1">电影票</el-option>
            <el-option label="卖品" value="2">卖品</el-option>
            <el-option label="电影票+卖品" value="3">电影票+卖品</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态:" v-show="isHigh">
          <el-select v-model="searchAdition.billStatus">
            <el-option label="全部" value>全部</el-option>
             <el-option  v-for="(val,key) in billStatus" :key="key" :label="val" :value="key">{{val}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退货状态:" v-show="isHigh">
          <el-select v-model="searchAdition.rejectStatus">
            <el-option label="全部" value>全部</el-option>
            <el-option label="未退货" value="0">未退货</el-option>
            <el-option label="部分退货" value="1">部分退货</el-option>
            <el-option label="全部退货" value="2">全部退货</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态:" v-show="isHigh">
          <el-select v-model="searchAdition.applyStatusType">
            <el-option label="全部" value>全部</el-option>
            <el-option label="已审核" value="T">已审核</el-option>
            <el-option label="未审核" value="F">未审核</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式:" v-show="isHigh">
          <el-select v-model="searchAdition.payTypeName">
            <el-option label="全部" value>全部</el-option>
            <el-option  v-for="(item,index) in payType" :key="index" :label="item.payTypeName" :value="item.payTypeName">{{item.payTypeName}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="交易终端:" v-show="isHigh">
          <el-input v-model="searchAdition.terminalCode" ></el-input>
        </el-form-item>
        <el-form-item label="会员卡号:" v-show="isHigh">
          <el-input v-model="searchAdition.cardCode" ></el-input>
        </el-form-item>
        <el-form-item label="交易凭证号:" v-show="isHigh">
          <el-input v-model="searchAdition.returnCode"></el-input>
        </el-form-item>
        <el-form-item label="票券编号:" v-show="isHigh">
          <el-input v-model="searchAdition.ticketCode"></el-input>
        </el-form-item>
        <el-button type="primary" @click="search" class="search-btn">查询</el-button>
        <el-button type="primary" @click="changeHigh" class="search-btn">{{highWord}}</el-button>
      </el-form>
    </div>
    <div class="content">
      <el-row>
        <el-table :data="tableData" stripe>
          <el-table-column prop="billCode" label="订单单号" show-overflow-tooltip width="200"></el-table-column>
          <el-table-column prop="billType" label="订单类型" show-overflow-tooltip width="200"></el-table-column>
          <el-table-column prop="createTime" label="订单时间" show-overflow-tooltip width="180"></el-table-column>
          <el-table-column prop="payAmount" label="订单金额（元）" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="billStatus" label="订单状态" show-overflow-tooltip  width="150"></el-table-column>
          <el-table-column prop="cinemaName" label="订单影院" show-overflow-tooltip  width="200"></el-table-column>
          <el-table-column prop="terminalCode" label="交易终端" show-overflow-tooltip  width="150"></el-table-column>
          <el-table-column prop="applyStatusType" label="审核状态" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" show-overflow-tooltip width="80" fixed="right">
            <template slot-scope="scope">
              <span class="icon-color" @click="account_add(scope.row.uid)">查看</span>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <div class="page-wrap">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="current" :page-sizes="[10, 20, 30]" :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
  import  dialog from '../public/dialog.vue'
  
  function timeStampToString(time){  
    var datetime = new Date();  
    datetime.setTime(time);  
    var year = datetime.getFullYear();  
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;  
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();  
    var hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();  
    var minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();  
    var second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();  
    return year + "-" + month + "-" + date;  
	} 
   
  export default {
    components: {},
    data() {
      return {
        total: 1,//总数
        current: 1,//当前页
        pageSize: 10, //当前页数大小
        tableData: [],//列表
        //查询条件
        timeRange: "",
        // 日期
        pickerOptions: {
          onPick: ({ minDate, maxDate }) => {
            this.searchAdition.dateStart = timeStampToString(minDate);
            this.searchAdition.dateEnd = timeStampToString(maxDate);
          }
        },
        // 是否高级
        isHigh: false,
        highWord: "切换至高级查询",
        searchAdition: {
          workerName: "",
          createUserName: "",
          dateStart: "",
          dateEnd: "",
          status: "",
          timeCode: ""
        },
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
        payType:[]
      };
    },
    watch:{
      timeRange(){
        // if(this.timeRange = null){
          //  this.searchAdition.dateStart = '';
          //  this.searchAdition.dateEnd = ''
        // }
        // console.log(this.timeRange)
      }
    },
    methods: {
      // 支付方式
      getPayType(){
        this.$csmList.payType()
          .then(data =>{
            if (data && data.code === 200) {
              this.payType = data.data
            }
          })
          .catch(err =>{
            console.log(err)
          })
      },
      // 订单详情
      account_add(id) {
        console.log(id)
        this.$router.push({path:'detail',query:{id}})
      },
      //查询
      search() {
        this.getList();
      },
      // 是否高级
      changeHigh() {
        this.isHigh = !this.isHigh
        this.highWord = this.highWord == "切换至高级查询" ? '切换至简单查询' : '切换至高级查询'
      },
      // 清除时间
      chooseTime(val) {
        if(!val){
          this.searchAdition.dateStart = '';
          this.searchAdition.dateEnd = '';
        }
      },
      //获取列表数据
      getList() {
        let limit = {
          page: this.current,
          pageSize: this.pageSize
        };
        let addition = this.searchAdition;
        this.$csmList.orderList(Object.assign({}, limit, addition),this.current,this.pageSize)
          .then(data => {
            console.log(data)
            if (data && data.code === 200) {
              this.tableData = data.data.records;
              this.tableData.forEach(item => {
                item.applyStatusType = item.applyStatusType == "T" ? "已审核" : "未审核"
                item.billType = this.billType[item.billType]
                item.billStatus = this.billStatus[item.billStatus]
              })
              this.total = data.data.total;
              this.currPage = data.current;
            } else {}
          })
          .catch(err => {
            console.log(err);
          })
      },
      //当前页数数目改变
      handleSizeChange(valua) {
        this.pageSize = valua;
        console.log(this.current);
        this.getList();
      },
      //当前页改变
      handleCurrentChange(valua) {
        this.current = valua;
        console.log(this.current);
        this.getList();
      }
    },
    created() {
      this.getList();
      this.getPayType()
    }
  };
</script>
<style lang="scss" scoped>
  .cinemaList {
    box-sizing: border-box;
    width: 100%;

    .search-form {
      background: #f5f5f5;
      padding: 16px 24px;
      margin-bottom: 10px;
      /deep/ .el-input__inner{
        width: 176px;
      }
    }
  }

  .el-form-item {
    width: 300px;
    transition: all 1s linear;
  }
  .el-input--suffix,.el-input__inner,.el-select,.el-form-item__content{
    width: 176px;
  }
  //表格样式
  .cinemaList .has-gutter tr th {
    background: #f2f4fd;
    color: #333333;
    font-family: MicrosoftYaHei;
  }

  //行高
  .cinemaList .el-table th {
    padding: 7px 0;
  }

  .cinemaList .el-table td {
    padding: 7px 0;
  }

  .cinemaList .el-pagination {
    text-align: center;
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
    width: 90px;
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
</style>