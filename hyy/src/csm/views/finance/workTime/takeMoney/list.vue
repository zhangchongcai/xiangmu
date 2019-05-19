<template>
  <div class="cinemaList">
    <!-- 面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>抽钞记录管理</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: 'list' }">抽钞记录管理</el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class="searchAdition">
      <el-form :inline="true" class="demo-form-inline search-form" size="small" label-width="100px">
        <el-form-item label="收银员:">
          <el-input v-model="searchAdition.workerName" @focus="dialogTableVisible1 = true"></el-input>

        </el-form-item>
        <el-form-item label="抽钞人:">
          <el-input v-model="searchAdition.extractUserName" @focus="dialogTableVisible2 = true"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="search-time">
            <span class="like-lable">操作起始时间:</span>
            <el-date-picker v-model="timeRange" type="daterange" unlink-panels range-separator="~"
              start-placeholder="yyyy-MM-dd" end-placeholder="yyyy-MM-dd" :picker-options="pickerOptions"
              @change="chooseTime"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="终端编号:">
          <el-input v-model="searchAdition.terminalCode"></el-input>
        </el-form-item>
        <el-form-item label="清机状态:">
          <el-select v-model="searchAdition.status">
            <el-option label="全部" value>全部</el-option>
            <el-option label="收银中" value="1">收银中</el-option>
            <el-option label="清机中" value="2">清机中</el-option>
            <el-option label="已情机" value="3">已清机</el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="search" class="search-btn">查询</el-button>
      </el-form>
    </div>
    <div class="content">
      <el-row>
        <el-table :data="tableData" stripe border style="width: 100%">
          <el-table-column prop="createTime" label="交易时间" width="200"></el-table-column>
          <el-table-column prop="amount" label="发生金额（元）"></el-table-column>
          <el-table-column prop="workerName" label="收银人" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="extractUserName" label="抽钞人" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="terminalCode" label="终端编号" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" label="清机状态" show-overflow-tooltip></el-table-column>
        </el-table>
      </el-row>
      <div class="page-wrap">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="current" :page-sizes="[10, 20, 30]" :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <!-- 弹出层1 -->
    <el-dialog title="查找收银员" :visible.sync="dialogTableVisible1" required>
      <el-form :model="searchAdition" label-width="60px" :inline="true">
        <el-form-item label="用户姓名" class="two_search">
          <el-input v-model="search1.userName" style="width:152px"></el-input>
        </el-form-item>
        <el-form-item label="用户账号" class="two_search">
          <el-input v-model="search1.userAccount" style="width:152px"></el-input>
        </el-form-item>
        <el-button type="primary" @click="getMoneyCashier" style="margin-top:4px;">查询</el-button>
      </el-form>
      <el-table :data="gridData1" :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0}
        highlight-current-row @current-change="handleCurrentChange1">
        <el-table-column width="56">
          <template slot-scope="scope">
            <el-radio v-model="templateRadio" :label="scope.$index"></el-radio>
          </template>
        </el-table-column>
        <el-table-column property="userName" label="用户姓名" width="240"></el-table-column>
        <el-table-column property="userAccount" label="用户账号" width="240"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination @current-change="handleCurrentChange" background :current-page.sync="dialog.currentPage"
          :page-size="100" layout="prev, pager, next, jumper, total" :total="dialog.total">
        </el-pagination>
      </div>
      <div style="height:24px;background:transparent;"></div>
      <div class="btn-area">
        <el-button type="primary" @click="chooseUser">确定</el-button>
        <el-button @click="dialogTableVisible1 = false">取消</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层2 -->
    <el-dialog title="查找抽钞人" :visible.sync="dialogTableVisible2">
      <el-form :model="searchAdition" label-width="80px" :inline="true">
        <el-form-item label="抽钞人姓名" class="one_search">
          <el-input v-model="search2.createName" style="width:184px;"></el-input>
        </el-form-item>
        <el-button type="primary" @click="getMoneyPerson">查询</el-button>
      </el-form>
      <el-table :data="gridData2" :cell-style={padding:0} :row-style={height:30} :header-cell-style={padding:0}
        highlight-current-row @current-change="handleCurrentChange2">
        <el-table-column width="56">
          <template slot-scope="scope">
            <el-radio v-model="templateRadio" :label="scope.$index"></el-radio>
          </template>
        </el-table-column>
        <!-- <el-table-column property="date" label="用户姓名" width="240"></el-table-column> -->
        <el-table-column property="userName" label="用户姓名" width="480"></el-table-column>
      </el-table>
      <div class="block">
        <el-pagination @current-change="handleCurrentChange" background :current-page.sync="dialog.currentPage"
          :page-size="100" layout="prev, pager, next, jumper, total" :total="dialog.total">
        </el-pagination>
      </div>
      <div style="height:24px;background:transparent;"></div>
      <div class="btn-area">
        <el-button type="primary" @click="chooseUser2">确定</el-button>
        <el-button @click="dialogTableVisible2 = false">取消</el-button>
      </div>
    </el-dialog>
     <singeCinema ref="singeCinema" @callback="callback" @firstCinema="firstCinema"></singeCinema>
  </div>
</template>
<script type="text/javascript">
  import singeCinema from '../publicModule/singeCinema'
  function timeStampToString(time) {
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
    return year + "-" + month + "-" + date;
  }
  export default {
    components: {
      singeCinema
    },
    data() {
      return {
        total: 1, //总数
        current: 1, //当前页
        pageSize: 10, //当前页数大小 
        tableData: [], //列表
        timeRange: "", //查询条件
        pickerOptions: {
          onPick: ({
            maxDate,
            minDate
          }) => {
            this.searchAdition.dateStart = timeStampToString(minDate);
            this.searchAdition.dateEnd = timeStampToString(maxDate);
          }
        }, // 日期
        searchAdition: {},
        // 弹窗
        dialogTableVisible1: false,
        dialogTableVisible2: false,
        dialog: {
          total: 0
        },
        search1: {
          userName: '',
          userAccount: ''
        },
        search2: {
          createName: ''
        },
        gridData1: [],
        gridData2: [],
        templateRadio: '',
        createName: '',
      };
    },
    methods: {
      // 上班登记
      account_add() {
        this.$router.push('add')
      },
      detail(row) {
        this.$router.push({
          path: "detail",
          query: {
            uid: row.uid,
            timeCode: row.timeCode
          }
        });
      },
      adjust(row) {
        console.log(row)
        this.$router.push({
          path: "adjust",
          query: {
            timeCode: row.timeCode,
            workerName: row.workerName,
            workStartTime: row.workStartTime,
            uid: row.uid
          }
        });
      },
      //开始结算
      workClose(row) {
        row.status == '收银中' && this.$router.push({
          path: "close",
          query: {
            uid: row.uid,
          }
        });
        row.status == '清机中' && this.$router.push({
          path: "detail",
          query: {
            uid: row.uid,
            parentPage: 'clear'
          }
        });
      },
      //查询
      search() {
        this.getList();
      },
      // 清除时间
      chooseTime(val) {
        if (!val) {
          this.searchAdition.dateStart = '';
          this.searchAdition.dateEnd = '';
        }
      },
      //获取列表数据
      getList() {
        let addition = this.searchAdition;
        this.$csmList.getMoneyList(Object.assign({}, addition), this.current, this.pageSize)
          .then(data => {
            console.log(data)
            if (data && data.code === 200) {
              this.tableData = data.data.records;
              this.tableData.forEach(item => {
                item.adjust = true;
                item.detail = true;
                item.thingCount = item.thingCount > 0 ? "有" : "无"
                switch (item.status) {
                  case 1:
                    item.status = '收银中'
                    break;
                  case 2:
                    item.status = '清机中'
                    item.detail = false //是否显示清机
                    break;
                  case 3:
                    item.status = '已清机'
                    item.detail = false // 临时存的值
                    item.adjust = false //是否显示清机
                    break;
                }
              })
              this.total = data.data.total;
              // this.current = data.current;
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
      },
      /**
       * 弹出层函数
       *  */
      // 点击选择1
      handleCurrentChange1(row) {
        try {
          this.search1.userName = row.userName;
          this.search1.userAccount = row.userAccount
          this.templateRadio = this.gridData1.indexOf(row);
        } catch (error) {

        }
      },
      // 确定选择
      chooseUser() {
        try {
          this.searchAdition.workerName = this.search1.userName;
          this.dialogTableVisible1 = false;
          this.templateRadio = Number
          this.search1.userName = ''
          this.search1.userAccount = ''
        } catch (error) {

        }

      },
      handleCurrentChange2(row) {
        try {
          this.search2.createName = row.userName;
          this.templateRadio = this.gridData2.indexOf(row);
        } catch (error) {}
      },
      // 确定选择
      chooseUser2() {

        this.searchAdition.extractUserName = this.search2.createName;
        this.dialogTableVisible2 = false;
        this.templateRadio = Number
        this.search2.createName = ''
      },
      // 获取收银员
      getMoneyCashier() {
        let limit = {
          current: this.current,
          size: this.pageSize,
          userName: this.search1.userName,
          userAccount: this.search1.userAccount
        };
        this.$csmList.getMoneyCashier(Object.assign({}, limit))
          .then(data => {
            if (data && data.code === 200) {
              this.gridData1 = []
              this.gridData1.push(...data.data.records)
              this.dialog.total = data.data.total;
              console.log(this.gridData1)
            }
          })
      },
      //  获取抽钞人
      getMoneyPerson() {
        let limit = {
          current: this.current,
          size: this.pageSize,
          userName: this.search2.createName
        };
        this.$csmList.getMoneyPerson(Object.assign({}, limit))
          .then(data => {
            if (data && data.code === 200) {
              this.gridData2 = []
              this.gridData2.push(...data.data.records)
              this.dialog.total = data.data.total;
            }
          })
      },
       // 打开影院
       openCinema(){
        this.$refs.singeCinema.opendialog = true;
      },
      callback(val){
        console.log(val)
        this.cinemaName = val.orgName
        this.searchAdition.cinemaUid = val.cinemaUID
      },
      firstCinema(val){
        // this.$set(this.searchAdition,"cinemaUID",val.cinemaUID)
        this.searchAdition.cinemaUid = val.cinemaUID;
        this.searchAdition.cinemaUid &&  this.getList();
      }
    },
    watch: {
      dialogTableVisible1() {
        this.templateRadio = Number
        this.search1.userName = ''
        this.search1.userAccount = ''
        this.getMoneyCashier()
      },

      dialogTableVisible2() {
        this.templateRadio = Number
        this.search2.createName = '';
        this.getMoneyPerson()
      }

    },
    created() {
      this.getList();
      this.getMoneyCashier();
      this.getMoneyPerson();
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

      /deep/ .el-input__inner {
        width: 176px;
      }
    }
  }

  .el-form-item {
    width: 300px;
  }

  //表格样式
  .cinemaList tr th {
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

  /deep/ .el-date-editor--daterange.el-input__inner {
    width: 256px !important;
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



  .search-btn {
    // position: absolute;
    top: calc(50% - 24px);
    right: 32px;
  }

  // dialog的样式
  /deep/ .el-dialog {
    width: 576px;
    height: 576px;

    .el-dialog__header::after {
      content: "";
      display: block;
      width: 536px;
      height: 1px;
      background: #e5e5e5;
    }

    .el-dialog__body {
      padding: 0 20px;

      .two_search {
        width: 214px;
        height: 32px;
      }

      .one_search {
        width: 268px;
      }

      .el-form-item__label {
        font-size: 12px;
      }

      .el-table {
        margin-top: 11px;
        height: 340px;

        .cinemaList .has-gutter tr th {
          padding: 0;
        }

        .cell {
          font-size: 12px;
          line-height: 30px;
          // text-align: center;
        }

        .el-radio__label {
          padding: 0;
          display: none;
        }
      }

      .block {
        margin-top: 15px;
      }
    }

    .btn-area {
      display: flex;
      justify-content: center;
    }
  }
</style>