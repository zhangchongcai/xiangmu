<template>
  <div class="cinemaList">
    <div class="searchAdition">
      <el-form :inline="true" class="demo-form-inline search-form" size="small">
        <!-- <el-form-item label="影院选择:">
          <el-input v-model="cinemaName" @focus="openCinema()"></el-input>
        </el-form-item> -->
        <el-form-item label="影院名称：">
          <el-button style="width:176px;height:32px;" disabled>
            {{ cinemaName }}</el-button>
          <el-button @click="singleCinemaVisible = true, $refs.frameSingleCinema.listAuthCommCinemas()" style="border:1px solid #3B74FF;color: #3B74FF;width:80px;height:32px;">选择</el-button>
        </el-form-item>
        <el-form-item label="收银员:">
          <el-button style="width:176px;height:32px;" disabled>
            {{ searchAdition.workerName }}</el-button>
          <el-button @click="openWorker" style="border:1px solid #3B74FF;color: #3B74FF;width:80px;height:32px;">选择
          </el-button>
        </el-form-item>

        <el-form-item>
          <div class="search-time">
            <span class="like-lable">操作起始时间:</span>
            <el-date-picker v-model="timeRange" type="daterange" unlink-panels range-separator="~" start-placeholder="yyyy-MM-dd" end-placeholder="yyyy-MM-dd" :picker-options="pickerOptions" @change="chooseTime"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="抽钞人:">
          <el-button style="width:176px;height:32px;" disabled>
            {{ searchAdition.extractUserName }}</el-button>
          <!-- <el-input v-model="searchAdition.extractUserName" @focus="openMoneyPerson"></el-input> -->
          <el-button @click="openMoneyPerson" style="border:1px solid #3B74FF;color: #3B74FF;width:80px;height:32px;">选择
          </el-button>
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
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current" :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <singleCinema ref="frameSingleCinema" :framedialogVisible.sync="singleCinemaVisible" :type="singleCinemaType" :innerData="innerData" @callBackSingle="callBackSingle">
      <div slot="footerId" class="cinema-footer">

        <el-button type="primary" @click="$refs.frameSingleCinema.confirmData(), singleCinemaVisible = false">确
          定</el-button>
        <el-button @click="singleCinemaVisible = false" style="margin-left:32px;">取 消</el-button>
      </div>
    </singleCinema>
    <!-- <singeCinema ref="singeCinema" @callback="callback"></singeCinema> -->
    <mydialog ref="searchDialog" @callback="chooseWorker" @searchWorker="searchWorker"></mydialog>
  </div>
</template>
<script type="text/javascript">
// import singleCinema from "frame_cpm/dialogs/cinemaDialog/singleCinema"
// import singeCinema from '../publicModule/singeCinema'
import mydialog from "../public/searchDialog"
const { singleCinema } = requireModule('base')

function timeStampToString (time) {
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
    singleCinema,
    mydialog
  },
  data () {
    return {
      singleCinemaVisible: false,
      singleCinemaType: 2,
      innerData: {
        id: '',
      },
      cinemaName: '',
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
      cinemaName: ""
    };
  },
  methods: {
    // 上班登记
    account_add () {
      this.$router.push('add')
    },
    detail (row) {
      this.$router.push({
        path: "detail",
        query: {
          uid: row.uid,
          timeCode: row.timeCode
        }
      });
    },
    adjust (row) {
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
    workClose (row) {
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
    search () {
      !this.cinemaName ? this.$alert('请先选择影院', '提示', {
        confirmButtonText: '确定',
      }) : this.getList();
      // this.getList();
    },
    // 清除时间
    chooseTime (val) {
      if (!val) {
        this.searchAdition.dateStart = '';
        this.searchAdition.dateEnd = '';
      }
    },
    //获取列表数据
    getList () {
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
          } else { }
        })
        .catch(err => {
          console.log(err);
        })
    },
    //当前页数数目改变
    handleSizeChange (valua) {
      this.pageSize = valua;
      console.log(this.current);
      this.getList();
    },
    //当前页改变
    handleCurrentChange (valua) {
      this.current = valua;
      console.log(this.current);
      this.getList();
    },

    handleCurrentChange2 (row) {
      try {
        this.search2.createName = row.userName;
        this.templateRadio = this.gridData2.indexOf(row);
      } catch (error) { }
    },
    // 确定选择
    chooseUser2 () {

      this.searchAdition.extractUserName = this.search2.createName;
      this.dialogTableVisible2 = false;
      this.templateRadio = Number
      this.search2.createName = ''
    },
    // 获取收银员
    getMoneyCashier (current, userName, userAccount) {
      let limit = {
        current,
        size: this.pageSize,
        userName,
        userAccount,
        cinemaUid: this.searchAdition.cinemaUid
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
    getMoneyPerson (current, userName, userAccount) {
      let limit = {
        current,
        size: this.pageSize,
        userName,
        userAccount,
        cinemaUid: this.searchAdition.cinemaUid
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
    openWorker (event) {
      event.srcElement.blur()
      if (!this.cinemaName) {
        this.$alert('请先选择影院', '提示', {
          confirmButtonText: '确定',
          callback: () => { }
        })
      } else {
        this.getMoneyCashier()
        this.$refs.searchDialog.dialogTableVisible = true;
        this.$refs.searchDialog.title = "查找收银员";
        this.$refs.searchDialog.showWhich = "worker";
      }
    },
    // 打开抽钞人
    openMoneyPerson (event) {
      event.srcElement.blur()
      if (!this.cinemaName) {
        this.$alert('请先选择影院', '提示', {
          confirmButtonText: '确定',
          callback: () => { }
        })
      } else {
        this.getMoneyPerson()
        this.$refs.searchDialog.dialogTableVisible = true;
        this.$refs.searchDialog.title = "查找抽钞人";
        this.$refs.searchDialog.showWhich = "moneyPerson";
      }
    },
    //  返回值
    chooseWorker (obj) {
      let whichOne = this.$refs.searchDialog.showWhich;
      console.log(obj, whichOne)
      if (whichOne == "worker") {
        this.$set(this.searchAdition, "workerName", obj.userName)
      } else if (whichOne == "moneyPerson") {
        this.$set(this.searchAdition, "extractUserName", obj.userName)
      }
    },
    searchWorker (current, userName, userAccount) {
      this.getWorker(current, userName, userAccount)
    },
    // 打开影院
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
          this.searchAdition.cinemaUid = res.data.cinemaUid
          this.innerData.id = Number(res.data.cinemaUid)

          this.search()

        } else {
          this.error(res.msg)
        }
      })
    },
  },
  created () {
    this.cinemaName && this.getList();
    this.getUserInfo()
  }
};
</script>
<style lang="scss" scoped>
.cinemaList {
  box-sizing: border-box;
  width: 100%;

  /deep/ .search-form {
    background: #f5f5f5;
    padding: 24px 24px 16px;
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;

    .el-input__inner {
      width: 176px;
    }

    .el-button--default.is-disabled {
      background: #f5f5f5;
      border: 1px solid #bcbcbc;
      border-radius: 4px;
      text-align: left;
    }

    .el-form-item__label {
      font-size: 12px;
      color: #666;
      height: 32px;
    }

    .el-form-item {
      margin-bottom: 8px;
      margin-right: 32px;
      display: flex;
      height: 32px;

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
.cinema-footer {
  display: flex;
  justify-content: center;
}
.el-button--primary {
  display: flex;
  width: 80px;
  height: 32px;
  justify-content: center;
  align-items: center;
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
  top: calc(50% - 24px);
  right: 32px;
  padding: 8px 32px;
}
</style>