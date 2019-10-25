<template>
  <div class="cinemaList">
    <div class="searchAdition">
      <el-form :inline="true" class="demo-form-inline search-form" size="small">
        <el-form-item label="影院名称：">
          <el-button style="width:176px;height:32px;" disabled>
            {{ cinemaName }}</el-button>
          <el-button @click="singleCinemaVisible = true, $refs.frameSingleCinema.listAuthCommCinemas()" style="border:1px solid #3B74FF;color: #3B74FF;width:80px;height:32px;">选择</el-button>
        </el-form-item>
        <el-form-item label="订单单号:">
          <el-input v-model="searchAdition.saleBillCode"></el-input>
        </el-form-item>
        <el-form-item label="订单类型:">
          <el-select v-model="searchAdition.billType">
            <el-option label="全部" value>全部</el-option>
            <!-- <el-option  v-for="(val,key) in billType" :key="key" :label="val" :value="key">{{val}}</el-option> -->
            <el-option label="消费" value="1">消费</el-option>
            <el-option label="影票补登" value="6">影票补登</el-option>
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
        <!-- 高级搜索 -->
        <el-collapse-transition>
          <div v-show="isHigh" class="high_search">
            <el-form-item label="收银员:">
              <el-button style="width:176px;height:32px;" disabled>
                {{ searchAdition.userName }}</el-button>
              <el-button @click="openWorker" style="border:1px solid #3B74FF;color: #3B74FF;width:80px;height:32px;">选择
              </el-button>
            </el-form-item>
            <el-form-item label="商品名称:">
              <el-input v-model="searchAdition.goodName"></el-input>
            </el-form-item>
            <el-form-item>
              <div class="search-time">
                <span class="like-lable">订单时间:</span>
                <el-date-picker v-model="timeRange" type="datetimerange" unlink-panels range-separator="至" start-placeholder="yyyy-MM-dd" end-placeholder="yyyy-MM-dd" :picker-options="pickerOptions" @change="chooseTime" style="width:346px;height:32px;"></el-date-picker>
              </div>
            </el-form-item>
            <el-form-item label="商品类型:">
              <el-select v-model="searchAdition.goodQueryType">
                <el-option label="全部" value>全部</el-option>
                <el-option label="影票" value="1">影票</el-option>
                <el-option label="卖品" value="2">卖品</el-option>
                <el-option label="影票+卖品" value="3">影票+卖品</el-option>
              </el-select>
            </el-form-item>

            <!-- <el-form-item label="订单状态:">
            <el-select v-model="searchAdition.billStatus">
              <el-option label="全部" value>全部</el-option>
              <el-option  v-for="(val,key) in billStatus" :key="key" :label="val" :value="key">{{val}}</el-option>
            </el-select>
          </el-form-item> -->
            <el-form-item label="销售类型:">
              <!--  // saleType  1销售  2退货  3 补登 -->
              <el-select v-model="searchAdition.saleType">
                <el-option label="全部" value>全部</el-option>
                <el-option label="销售" value="1">销售</el-option>
                <el-option label="退货" value="2">退货</el-option>
                <!-- <el-option label="影票补登" value="3">影票补登</el-option> -->
              </el-select>
            </el-form-item>
            <el-form-item label="审核状态:">
              <el-select v-model="searchAdition.applyStatusType">
                <el-option label="全部" value>全部</el-option>
                <el-option label="已审核" value="T">已审核</el-option>
                <el-option label="未审核" value="F">未审核</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="支付方式:">
              <el-select v-model="searchAdition.payTypeCode">
                <el-option label="全部" value>全部</el-option>
                <el-option v-for="(item,index) in payType" :key="index" :label="item.payTypeName" :value="item.payTypeCode">{{item.payTypeName}}</el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="交易终端:">
              <el-input v-model="searchAdition.terminalCode"></el-input>
            </el-form-item>
            <el-form-item label="会员卡号:">
              <el-input v-model="searchAdition.cardCode"></el-input>
            </el-form-item>
            <el-form-item label="交易凭证号:">
              <el-input v-model="searchAdition.returnCode"></el-input>
            </el-form-item>
            <el-form-item label="票券编号:">
              <el-input v-model="searchAdition.ticketCode"></el-input>
            </el-form-item>
          </div>
        </el-collapse-transition>
        <el-button type="primary" @click="search" class="search-btn" v-loading.fullscreen.lock="fullscreenLoading">查询
        </el-button>
        <span class="change_tip" @click="changeHigh">{{highWord}} <i class="el-icon-arrow-down" ref="iconChange"></i></span>
        <!-- <el-button type="primary" @click="changeHigh" class="search-btn">{{highWord}}</el-button> -->
      </el-form>
    </div>
    <div class="content">
      <el-row>
        <el-table :data="tableData" stripe>
          <el-table-column prop="saleBillCode" label="订单单号" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column prop="billType" label="订单类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="saleType" label="销售类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="saleGoodsType" label="商品类型" show-overflow-tooltip></el-table-column>
          <el-table-column prop="transactionTime" label="订单时间" show-overflow-tooltip width="180"></el-table-column>
          <el-table-column prop="payAmount" label="订单金额（元）" width="120" show-overflow-tooltip></el-table-column>
          <!-- <el-table-column prop="billStatus" label="订单状态" show-overflow-tooltip  width="150"></el-table-column> -->
          <el-table-column prop="cinemaName" label="交易影院" show-overflow-tooltip width="200"></el-table-column>
          <el-table-column prop="terminalCode" label="交易终端" show-overflow-tooltip width="150"></el-table-column>
          <el-table-column prop="applyStatusType" label="审核状态" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" show-overflow-tooltip width="80" fixed="right">
            <template slot-scope="scope">
              <el-button size='small' type="text" @click="account_add(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <singleCinema ref="frameSingleCinema" :framedialogVisible.sync="singleCinemaVisible" :type="singleCinemaType" :innerData="innerData" @callBackSingle="callBackSingle">
        <div slot="footerId" class="cinema-footer">

          <el-button type="primary" @click="$refs.frameSingleCinema.confirmData(), singleCinemaVisible = false">确
            定</el-button>
          <el-button @click="singleCinemaVisible = false" style="margin-left:32px;">取 消</el-button>
        </div>
      </singleCinema>
      <!-- <singeCinema ref="singeCinema" @callback="callback"></singeCinema> -->
      <mydialog ref="searchDialog" @callback="chooseWorker" @searchWorker="searchWorker"></mydialog>
      <div class="page-wrap">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current" :page-sizes="[15, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import mydialog from "../public/searchDialog"
// import singeCinema from '../publicModule/singeCinema'

// import singleCinema from "frame_cpm/dialogs/cinemaDialog/singleCinema"
// import mixins from "src/frame_cpm/mixins/cacheMixin.js";
// import config from 'frame_cpm/http/config.js';
const { singleCinema, cacheMixin } = requireModule('base')

function timeStampToString (time) {
  var datetime = new Date();
  datetime.setTime(time);
  var year = datetime.getFullYear();
  var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
  var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
  var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
  var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
  var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
  // return year + "-" + month + "-" + date;  
  return `${year}-${month}-${date}-${hour}-${minute}-${second}`
}

export default {
  components: {
    singleCinema,
    mydialog
  },
  mixins: [cacheMixin.cacheMixin],
  data () {
    return {
      singleCinemaVisible: false,
      singleCinemaType: 2,
      innerData: {
        id: '',
        resourceCode: 'csm_order_manager'
      },
      cinemaName: '',
      cacheField: ["searchAdition", "cinemaName"],
      subComName: "xxxxxxxxxxx",
      total: 1, //总数
      current: 1, //当前页
      pageSize: 15, //当前页数大小
      tableData: [], //列表
      //查询条件
      timeRange: [new Date(new Date().toLocaleDateString()).getTime() - (24 * 60 * 60 * 1000) * 30,
      new Date(new Date().toLocaleDateString()).getTime() + ((24 * 60 * 60 * 1000) - 1)],
      // 日期
      pickerOptions: {
        onPick: ({
          minDate,
          maxDate
        }) => {
          console.log(minDate, maxDate)
          // this.searchAdition.dateStart = timeStampToString(minDate);
          // this.searchAdition.dateEnd = timeStampToString(maxDate);
        }
      },
      // 是否高级
      isHigh: false,
      highWord: "高级筛选",
      searchAdition: {
        workerName: "",
        createUserName: "",
        dateStart: timeStampToString(new Date(new Date().toLocaleDateString()).getTime() - (24 * 60 * 60 * 1000) * 30),
        dateEnd: timeStampToString(new Date(new Date().toLocaleDateString()).getTime() + ((24 * 60 * 60 * 1000) - 1)),
        status: "",
        timeCode: "",
        cinemaUid: ""
      },
      // 订单类型
      billType: {
        1: "消费",
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
      // billStatus:{
      //   0:"新建",1:"支付中",2:"完成",5:"预定", 6:"订单取消",7:"预定结束"
      // },
      payType: [],
      // cinemaUID:"",
      cinemaName: "",
      fullscreenLoading: false // 遮罩层
    };
  },
  methods: {
    // 支付方式
    getPayType () {
      this.$csmList.payType({
        cinemaUid: this.searchAdition.cinemaUid
      })
        .then(data => {
          if (data && data.code === 200) {
            this.payType = data.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 订单详情
    account_add (row) {
      console.log(row)
      this.$router.push({
        path: 'detail',
        query: {
          saleBillFlowUid: row.uid,
          cinemaUid: row.cinemaUid
        }
      })
    },
    //查询
    search () {
      !this.cinemaName ? this.$alert('请先选择影院', '提示', {
        confirmButtonText: '确定',
      }) : this.getList(1) || this.getPayType() || this.remberSearch();
    },
    // 保存值
    remberSearch () {
      this.searchAdition["cinemaName"] = this.cinemaName
      this.$store.commit("csmRemberTrading", this.searchAdition)
    },
    // 是否高级
    changeHigh () {
      this.isHigh = !this.isHigh
      this.highWord = this.highWord == "高级筛选" ? '收起' : '高级筛选';
      this.$refs.iconChange.classList.toggle("is-active")
    },
    // 清除时间
    chooseTime (val) {
      if (!val) {
        this.searchAdition.dateStart = '';
        this.searchAdition.dateEnd = '';
        return
      }
      console.log(val)
      this.searchAdition.dateStart = timeStampToString(val[0]);
      this.searchAdition.dateEnd = timeStampToString(val[1]);
      console.log(this.searchAdition.dateStart, this.searchAdition.dateEnd)

    },
    //获取列表数据
    getList (page = 1) {
      // this.fullscreenLoading = true;
      let addition = this.searchAdition;
      this.$csmList.orderList(Object.assign({}, addition), page, this.pageSize)
        .then(data => {
          console.log(data)
          if (data && data.code === 200) {
            setTimeout(() => {
              this.fullscreenLoading = false;
            }, 1000);
            this.tableData = data.data.records;
            this.tableData.forEach(item => {
              item.applyStatusType = item.applyStatusType == "T" ? "已审核" : "未审核"
              item.billType = this.billType[item.billType]
              item.saleType = item.saleType == "1" ? "销售" : "退货"
              item.saleGoodsType = item.saleGoodsType == "movieTicket" ? "影票" :
                item.saleGoodsType == "mer" ? "卖品" : item.saleGoodsType == "movieTicketmer" ? "电影票+卖品" : "--"
              if (item.saleGoodsType == "卖品" || item.saleGoodsType == "--") item.applyStatusType = "--"
            })
            this.total = data.data.total;
            this.currPage = data.current;
          } else { }
        })
        .catch(err => {
          console.log(err);
        })
    },
    // 获取收银员
    getWorker (current = 1, userName) {
      let limit = {
        current,
        size: 10,
        userName,
        // userAccount,
        cinemaUid: this.searchAdition.cinemaUid
      };
      // getCashier  之前是用getworker
      this.$csmList.orderWorker(Object.assign({}, limit))
        .then(data => {
          if (data && data.code === 200) {
            this.$refs.searchDialog.gridData = data.data.records
            this.$refs.searchDialog.pageData = data.data
          }
        })
    },
    //当前页数数目改变
    handleSizeChange (valua) {
      this.pageSize = valua;
      console.log(this.current);
      this.getList(1);
    },
    //当前页改变
    handleCurrentChange (valua) {
      this.current = valua;
      console.log(this.current);
      this.getList(this.current);
    },
    // 打开收银员
    openWorker (event) {
      event.srcElement.blur()
      if (!this.cinemaName) {
        this.$alert('请先选择影院', '提示', {
          confirmButtonText: '确定',
          callback: () => { }
        })
      } else {
        this.getWorker()
        this.$refs.searchDialog.dialogTableVisible = true;
        this.$refs.searchDialog.title = "查找收银员";
        this.$refs.searchDialog.showWhich = "creater";
      }
    },
    //  返回值
    chooseWorker (obj) {
      let whichOne = this.$refs.searchDialog.showWhich;
      console.log(obj, whichOne)
      if (whichOne == "worker") {
        // this.searchAdition.userName = obj.userName
        this.$set(this.searchAdition, "userName", obj.userName)
      } else if (whichOne == "creater") {
        this.$set(this.searchAdition, "userName", obj.userName)
        // this.searchAdition.createUserName = obj.userName
      }
    },
    searchWorker (current, userName, userAccount) {
      this.getWorker(current, userName, userAccount)
    },

    openCinema () { // 打开影院
      this.$refs.singeCinema.opendialog = true;
      // this.$refs.singeCinema.innerCinemaMultiData.resourceCode = "csm_order_manager";
    },
    callBackSingle (data) {
      console.log(data, '-----> data')
      this.searchAdition.cinemaUid = data.data.id
      this.cinemaName = data.data.name
      this.cinemaName = this.cinemaName.length > 10 ? this.cinemaName.substring(0, 9) + "..." : this.cinemaName
      this.innerData.id = data.data.id
      this.singleCinemaVisible = data.framedialogVisible
      // this.search() 
    },
    getUserInfo () {
      this.$csmList.getCtmUserInfo().then(res => {
        console.log(res)
        if (res.code === 200) {
          this.cinemaName = res.data.cinemaName
          this.cinemaName = this.cinemaName.length > 10 ? this.cinemaName.substring(0, 9) + "..." : this
            .cinemaName
          this.searchAdition.cinemaUid = res.data.cinemaUid
          this.innerData.id = Number(res.data.cinemaUid)
          this.search()
        } else {
          this.error(res.msg)
        }
      })
    },
    callback (val) {
      console.log(val)
      this.cinemaName = val.orgName
      this.searchAdition.cinemaUid = val.cinemaUID
      this.cinemaName && this.getPayType() // 后台接口想要改变
    }
  },
  created () {
    console.log(this.$store.state.csm.tradingSearch)
    let tradingSearch = this.$store.state.csm.tradingSearch
    if (tradingSearch.cinemaName) {
      this.cinemaName = tradingSearch.cinemaName;
      this.searchAdition.cinemaUid = tradingSearch.cinemaUid;
      this.cinemaName && this.getList() || this.getPayType;
    }

    this.getUserInfo()

  }
};
</script>

<style lang="scss" scoped>
.cinemaList {
  .el-button--default.is-disabled {
    background: #f5f5f5;
    border: 1px solid #bcbcbc;
    border-radius: 4px;
    text-align: left;
  }

  box-sizing: border-box;
  width: 100%;

  /deep/ .search-form {
    background: #f5f5f5;
    padding: 24px 24px 16px;
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    transition: all 1s linear;
    position: relative;

    .el-input__inner {
      width: 176px;
    }

    .high_search {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
    }

    .change_tip {
      font-family: MicrosoftYaHei;
      font-size: 12px;
      color: #666666;
      letter-spacing: 0;
      cursor: pointer;
      position: absolute;
      top: 32px;
      right: 40px;

      .el-icon-arrow-down {
        transition: all linear 0.3s;
      }

      .is-active {
        transform: rotate(180deg);
        transition: all linear 0.3s;
      }
    }

    .el-form-item__label {
      font-size: 12px;
      color: #666;
    }

    .el-form-item {
      margin-bottom: 8px;
      margin-right: 32px;
      display: flex;

      .el-form-item__content {
        height: 32px;
        display: flex;
        align-items: center;
      }

      .el-button + .el-button {
        margin-left: 8px;
      }
    }
  }

  /deep/ .el-date-editor .el-range-separator {
    //时间选择器样式
    line-height: 24px;
    width: 24px;
  }
}

/deep/ .el-date-editor--daterange.el-input__inner {
  width: 256px !important;
}

.el-button--primary {
  width: 80px;
  height: 32px;
  display: flex;
  justify-content: center;
  padding: 0;
  align-items: center;
}

.el-form-item {
  // width: 300px;
  margin-bottom: 8px;
  transition: all 1s linear;
}

.el-input--suffix,
.el-input__inner,
.el-select,
.el-form-item__content {
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
  width: 256px !important;
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
  // position: absolute;
  bottom: 24px;
  right: 120px;
  // padding: 9px 36px;
}
.cinema-footer {
  display: flex;
  justify-content: center;
}
/deep/ .el-pagination.is-background .el-pager li {
  margin: 0 1px;
}
</style>