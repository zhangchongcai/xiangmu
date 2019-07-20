<template>
  <div class="cinemaList">
    <div class="searchAdition">
      <el-form :inline="true" class="demo-form-inline search-form" size="small" label-width="100px">
        <el-form-item label="影院选择:">
          <el-input v-model="cinemaName" @focus="openCinema"></el-input>
        </el-form-item>
        <el-form-item label="制单人:">
          <el-input v-model="searchAdition.createUserName" @focus="openCreate"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="search-time">
            <span class="like-lable">制单时间:</span>
            <el-date-picker v-model="timeRange" type="daterange" unlink-panels range-separator="至"
              start-placeholder="yyyy-MM-dd" end-placeholder="yyyy-MM-dd" :picker-options="pickerOptions"
              @change="chooseTime"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="收银员:">
          <el-input v-model="searchAdition.workerName" @focus="openWorker"></el-input>
        </el-form-item>
        <el-form-item label="单据状态:">
          <el-select v-model="searchAdition.status">
            <el-option label="全部" value>全部</el-option>
            <el-option label="收银中" value="1">收银中</el-option>
            <el-option label="清机中" value="2">清机中</el-option>
            <el-option label="已情机" value="3">已清机</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单据编号:">
          <el-input v-model="searchAdition.timeCode"></el-input>
        </el-form-item>
        <el-button type="primary" @click="search" class="search-btn">查询</el-button>
      </el-form>
    </div>
    <div class="content">
      <el-row style="padding:5px;float:right;">
        <el-button type="primary" plain class="xinjian" @click="account_add">上班登记</el-button>
      </el-row>
      <br style="clear:both;">
      <!-- <el-row> -->
        <el-table :data="tableData" stripe border style="width: 100%">
          <el-table-column prop="timeCode" label="单据标号" width="200"></el-table-column>
          <el-table-column prop="workerName" label="收银员"></el-table-column>
          <el-table-column prop="createUserName" label="制单人" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="制作时间" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="workEndTime" label="班次结束时间" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="preAmount" label="备用金领用" width="100" show-overflow-tooltip></el-table-column>
          <el-table-column prop="thingCount" label="卡劵领用" show-overflow-tooltip></el-table-column>
          <el-table-column prop="status" label="状态" show-overflow-tooltip></el-table-column>
          <el-table-column prop="workStartTime" label="班次起始时间" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="updateUserName" label="清机人" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="300" fixed="right">
            <template slot-scope="scope">
              <el-button size='small' type="text" @click="detail(scope.row)">查看</el-button>
              <el-button size='small' type="text" @click="adjust(scope.row)" v-show="scope.row.detail">追加领用</el-button>
              <el-button size='small' type="text" @click="workClose(scope.row)" v-show="scope.row.adjust">清机结算
              </el-button>
              <el-button size='small' type="text" @click="cinema_edit(scope.row.uid)">导出</el-button>
              <el-button size='small' type="text" @click="wall_edit(scope.row.uid)">打印</el-button>
            </template>
          </el-table-column>
        </el-table>
      <!-- </el-row> -->
       
      <!-- <div class="page-wrap" ref="page_div">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="current" :page-size="pageSize" :total="total"
          layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div> -->
    </div>
    <div class="page-wrap" ref="page_div">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="page.current" :page-sizes="[15, 20, 30]" :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="page.total"></el-pagination>
      </div>
    <singeCinema ref="singeCinema" @callback="callback"></singeCinema>
    <mydialog ref="searchDialog" @callback="chooseWorker" @searchWorker="searchWorker"></mydialog>
  </div>
</template>
<script type="text/javascript">
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
  import singeCinema from '../publicModule/singeCinema'
  import mydialog from "../public/searchDialog"
  export default {
    components: {
      singeCinema,
      mydialog
    },
    data() {
      return {
        page: {
          total: 1, //总数
          current: 1, //当前页
          pageSize: 15, //当前页数大小 
        },
        val:true,
        tableData: [], //列表
        timeRange: "", // 时间查询条件
        pickerOptions: {
          onPick: ({
            maxDate,
            minDate
          }) => {
            this.searchAdition.dateStart = timeStampToString(minDate);
            this.searchAdition.dateEnd = timeStampToString(maxDate);
          }
        }, // 日期
        searchAdition: {
          workerName: "",
          createUserName: "",
          dateStart: "",
          dateEnd: "",
          status: "",
          timeCode: ""
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
        cinemaName: '', // 影院选择的名字  可以通过这个判断是否选择了影院
      };
    },
    methods: {
      // 上班登记
      account_add() {
        !this.cinemaName ? this.$alert('请先选择影院', '提示', {
          confirmButtonText: '确定',
        }) : this.$router.push({
          path: 'add',
          query: {
            cinemaUid: this.searchAdition.cinemaUid
          }
        })
      },
      detail(row) {
        this.$router.push({
          path: "detail",
          query: {
            uid: row.uid,
            timeCode: row.timeCode,
            cinemaUid: this.searchAdition.cinemaUid
          }
        });
      },
      adjust(row) {
        this.$router.push({
          path: "adjust",
          query: {
            timeCode: row.timeCode,
            workerName: row.workerName,
            workStartTime: row.workStartTime,
            uid: row.uid,
            cinemaUid: this.searchAdition.cinemaUid
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
        !this.cinemaName ? this.$alert('请先选择影院', '提示', {
          confirmButtonText: '确定',
        }) : this.getList();
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
        this.$csmList.clearaccountList(Object.assign({}, addition), this.page.current, this.page.pageSize)
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
              this.$refs.page_div.style.display = data.data.total < 16? "none":"block"  // 分页是否显示  15条不显示
              this.$set(this.page, "total", data.data.total)
              this.$set(this.page, "pageSize", data.data.size)
              this.$set(this.page, "current", data.data.current)
            } else {}
          })
          .catch(err => {
            console.log(err);
          })
      },
      // 获取收银员
      getWorker(current, userName, userAccount) {
        let limit = {
          current,
          size: this.pageSize,
          // size:1,
          userName,
          userAccount,
          cinemaUid: this.searchAdition.cinemaUid
        };
        //  之前用这个后来后台说要改下面这个
        this.$csmList.getWorker(Object.assign({}, limit))
          .then(data => {
            if (data && data.code === 200) {
              this.$refs.searchDialog.gridData = data.data.records
              this.$refs.searchDialog.pageData = data.data
            }
          })
      },
      //  获取制单人
      getCreater(current, createName) {
        let limit = {
          current,
          size: this.pageSize,
          userName: createName,
          cinemaUid: this.searchAdition.cinemaUid
        };
        this.$csmList.getCreater(Object.assign({}, limit))
          .then(data => {
            if (data && data.code === 200) {
              this.$refs.searchDialog.gridData = data.data.records
              this.$refs.searchDialog.pageData = data.data
            }
          })
      },
      //当前页数数目改变
      handleSizeChange(valua) {
        this.page.pageSize = valua;
        this.getList();
      },
      //当前页改变
      handleCurrentChange(valua) {
        this.page.current = valua;
        this.getList();
      },
      // 打开创单人
      openCreate(event) {
        event.srcElement.blur()
        if (!this.cinemaName) {
          this.$alert('请先选择影院', '提示', {
            confirmButtonText: '确定',
            callback: () => {}
          })
        } else {
          this.getCreater()
          this.$refs.searchDialog.dialogTableVisible = true;
          this.$refs.searchDialog.title = "查找制单人";
          this.$refs.searchDialog.showWhich = "creater";
        }
      },
      // 打开收银员
      openWorker(event) {
        event.srcElement.blur()
        if (!this.cinemaName) {
          this.$alert('请先选择影院', '提示', {
            confirmButtonText: '确定',
            callback: () => {}
          })
        } else {
          this.getWorker()
          this.$refs.searchDialog.dialogTableVisible = true;
          this.$refs.searchDialog.title = "查找收银员";
          this.$refs.searchDialog.showWhich = "worker";
        }
      },
      //  返回值
      chooseWorker(obj) {
        let whichOne = this.$refs.searchDialog.showWhich;
        console.log(obj, whichOne)
        if (whichOne == "worker") {
          this.searchAdition.workerName = obj.userName
        } else if (whichOne == "creater") {
          this.searchAdition.createUserName = obj.userName
        }
      },
      searchWorker(current, userName, userAccount) {
        this.getWorker(current, userName, userAccount)
      },
      // 打开影院
      openCinema() {
        this.$refs.singeCinema.opendialog = true;
      },
      callback(val) {
        console.log(val)
        this.cinemaName = val.orgName
        this.searchAdition.cinemaUid = val.cinemaUID
      }
    },
    mounted(){
      this.$refs.page_div.style.display = "none"
    }
  };
</script>
<style lang="scss" scoped>
  .cinemaList {
    box-sizing: border-box;
    width: 100%;
    .search-form {
      background: #f5f5f5;
      padding: 16px 24px 8px;
      margin-bottom: 10px;
      // transition: all 1s linear;
      position: relative;
      /deep/ .el-input__inner{
        width: 176px;
      }
      .change_tip{
        font-family: MicrosoftYaHei;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0;
        cursor: pointer;
        position: absolute;
        top:26px;
        right: 40px;
        .el-icon-arrow-down{
          transition: all linear .3s;
        }
        .is-active{
          transform: rotate(180deg);
          transition: all linear .3s;
        }
      }
    }
    .el-form-item__label{
      font-size: 12px;
      color: #666;
    }
    /deep/ .el-date-editor .el-range-separator {  //时间选择器样式
      line-height: 24px;
      width: 24px;
    }
  }
  .el-form-item {
    width: 300px;
    margin-bottom: 8px;
    transition: all 1s linear;
  }

  .el-button--primary {
    width: 80px;
    padding: 8px;
  }

  .el-form-item {
    width: 300px;
    // margin-bottom: 16px;
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
    //   position: absolute;
    //   top: calc(50% - 24px);
    //   right: 32px;
    margin-left: 25px;
  }
</style>