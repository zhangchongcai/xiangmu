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
        <el-form-item label="影院选择:">
          <el-input v-model="cinemaName" @focus="openCinema()"></el-input>
        </el-form-item>
        <el-form-item label="收银员:">
          <el-input v-model="searchAdition.workerName" @focus="openWorker"></el-input>
        </el-form-item>
        
        <el-form-item>
          <div class="search-time">
            <span class="like-lable">操作起始时间:</span>
            <el-date-picker v-model="timeRange" type="daterange" unlink-panels range-separator="~"
              start-placeholder="yyyy-MM-dd" end-placeholder="yyyy-MM-dd" :picker-options="pickerOptions"
              @change="chooseTime"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="抽钞人:">
          <el-input v-model="searchAdition.extractUserName" @focus="openMoneyPerson"></el-input>
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
    <singeCinema ref="singeCinema" @callback="callback"></singeCinema>
    <mydialog ref="searchDialog" @callback="chooseWorker" @searchWorker="searchWorker"></mydialog>
  </div>
</template>
<script type="text/javascript">
  import singeCinema from '../publicModule/singeCinema'
  import mydialog from "../public/searchDialog"
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
      singeCinema,
      mydialog
    },
    data() {
      return {
        total: 1, // 总数
        current: 1, // 当前页
        pageSize: 10, // 当前页数大小 
        tableData: [], // 列表
        timeRange: "", // 时间区间
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
        cinemaName:""
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
         !this.cinemaName ?  this.$alert('请先选择影院', '提示', {
          confirmButtonText: '确定',
        }): this.getList();
        // this.getList();
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
      getMoneyCashier(current,userName,userAccount) {
        let limit = {
          current,
          size: this.pageSize,
          userName,
          userAccount,
          cinemaUid:this.searchAdition.cinemaUid
        };
        this.$csmList.getMoneyCashier(Object.assign({}, limit))
          .then(data => {
            if (data && data.code === 200) {
              this.$refs.searchDialog.gridData = data.data.records
              this.$refs.searchDialog.pageData = data.data
            }
          })
      },
      //  获取抽钞人
      getMoneyPerson(current,userName,userAccount) {
        let limit = {
          current,
          size: this.pageSize,
          userName,
          userAccount,
          cinemaUid:this.searchAdition.cinemaUid
        };
        this.$csmList.getMoneyPerson(Object.assign({}, limit))
          .then(data => {
            if (data && data.code === 200) {
              this.$refs.searchDialog.gridData = data.data.records
              this.$refs.searchDialog.pageData = data.data
            }
          })
      },
       // 打开收银员
      openWorker(event){
        event.srcElement.blur()
        if(!this.cinemaName){
          this.$alert('请先选择影院', '提示', {
            confirmButtonText: '确定',
            callback:()=>{}
          })
        }else{
          this.getMoneyCashier()
          this.$refs.searchDialog.dialogTableVisible = true;
          this.$refs.searchDialog.title = "查找收银员";
          this.$refs.searchDialog.showWhich = "worker";
        }
      },
       // 打开抽钞人
      openMoneyPerson(event){
        event.srcElement.blur()
        if(!this.cinemaName){
          this.$alert('请先选择影院', '提示', {
            confirmButtonText: '确定',
            callback:()=>{}
          })
        }else{
          this.getMoneyPerson()
          this.$refs.searchDialog.dialogTableVisible = true;
          this.$refs.searchDialog.title = "查找抽钞人";
          this.$refs.searchDialog.showWhich = "moneyPerson";
        }
      },
      //  返回值
      chooseWorker(obj){
        let whichOne = this.$refs.searchDialog.showWhich;
        console.log(obj,whichOne)
        if(whichOne == "worker"){
          this.$set(this.searchAdition,"workerName",obj.userName)
        }else if(whichOne == "moneyPerson"){
          this.$set(this.searchAdition,"extractUserName",obj.userName)
        }
      },
      searchWorker(current,userName,userAccount){
        this.getWorker(current,userName,userAccount)
      },
       // 打开影院
       openCinema(){
        this.$refs.singeCinema.opendialog = true;
      },
      callback(val){
        console.log(val)
        this.cinemaName = val.orgName
        this.searchAdition.cinemaUid = val.cinemaUID
      }
    },
    created() {
      this.cinemaName && this.getList();
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
    padding: 8px 32px;
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