<template>
  <div class="cinemaList">
    <div class="searchAdition">
      <el-form class="demo-form-inline search-form" size="small">
        <el-form-item label="影院名称：">
          <el-button style="width:176px;height:32px;" disabled>
            {{ cinemaName }}</el-button>
          <el-button @click="singleCinemaVisible = true, $refs.frameSingleCinema.listAuthCommCinemas()" style="border:1px solid #3B74FF;color: #3B74FF;width:80px;height:32px;">选择</el-button>
        </el-form-item>
        <el-form-item label="制单人：">
          <el-button style="width:176px;height:32px;" disabled>
            {{searchAdition.createUserName}}
          </el-button>
          <el-button @click="openCreate" style="border:1px solid #3B74FF;color: #3B74FF;width:80px;height:32px;">选择
          </el-button>
        </el-form-item>
        <el-form-item label="收银员：">
          <el-button style="width:176px;height:32px;" disabled>
            {{searchAdition.workerName}}
          </el-button>
          <el-button @click="openWorker" style="border:1px solid #3B74FF;color: #3B74FF;width:80px;height:32px;">选择
          </el-button>
        </el-form-item>
        <el-form-item>
          <div class="search-time">
            <span class="like-lable">制单时间：</span>
            <el-date-picker v-model="timeRange" type="daterange" unlink-panels range-separator="至" start-placeholder="yyyy-MM-dd" end-placeholder="yyyy-MM-dd" :picker-options="pickerOptions" @change="chooseTime"></el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="单据状态：">
          <el-select v-model="searchAdition.status">
            <el-option label="全部" value>全部</el-option>
            <el-option label="收银中" value="1">收银中</el-option>
            <el-option label="清机中" value="2">清机中</el-option>
            <el-option label="已清机" value="3">已清机</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单据编号：">
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
        <el-table-column prop="timeCode" label="单据编号" width="200"></el-table-column>
        <el-table-column prop="workerName" label="收银员"></el-table-column>
        <el-table-column prop="createUserName" label="制单人" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createTime" label="制单时间" width="200" show-overflow-tooltip></el-table-column>
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
            <el-button size='small' type="text" @click="exportThis(scope.row)">导出</el-button>
            <el-button size='small' type="text" @click="printThis(scope.row)">打印</el-button>
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
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.current" :page-sizes="[15, 20, 30]" :page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.total"></el-pagination>
    </div>
    <singleCinema ref="frameSingleCinema" :framedialogVisible.sync="singleCinemaVisible" :type="singleCinemaType" :innerData="innerData" @callBackSingle="callBackSingle">
      <div slot="footerId" class="cinema-footer">
        <el-button type="primary" @click="$refs.frameSingleCinema.confirmData(), singleCinemaVisible = false">确
          定</el-button>
        <el-button @click="singleCinemaVisible = false" style="margin-left:32px;">取 消</el-button>
      </div>
    </singleCinema>
    <mydialog ref="searchDialog" @callback="chooseWorker" @searchWorker="searchWorker"></mydialog>
  </div>
</template>
<script type="text/javascript">
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
// import singleCinema from "frame_cpm/dialogs/cinemaDialog/singleCinema"
// import singeCinema from '../publicModule/singeCinema'
import mydialog from "../public/searchDialog"
const { singleCinema } = requireModule('base')

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
      page: {
        total: 1, //总数
        current: 1, //当前页
        pageSize: 15, //当前页数大小 
      },
      val: true,
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
      rebackObj: {},
      rebackCreater: {}
    };
  },
  methods: {
    // 上班登记
    account_add () {
      !this.cinemaName ? this.$message("请先选择影院") : this.$router.push({
        path: 'add',
        query: {
          cinemaUid: this.searchAdition.cinemaUid
        }
      })
    },
    detail (row) {
      this.$router.push({
        path: "detail",
        query: {
          uid: row.uid,
          timeCode: row.timeCode,
          cinemaUid: this.searchAdition.cinemaUid
        }
      });
    },
    adjust (row) {
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
    exportThis (row) { // 导出
      if (row.detail) {
        this.$router.push({
          path: "exportSimple",
          query: {
            uid: row.uid
          }
        })
      } else {
        this.$router.push({
          path: "export",
          query: {
            uid: row.uid

          }
        })
      }
    },
    printThis (row) { // 打印
      //  row.detail true 上班中  false 
      console.log(row.status)
      if (row.detail) {
        this.$router.push({
          path: "printSimple",
          query: {
            uid: row.uid

          }
        })
      } else {
        this.$router.push({
          path: "print",
          query: {
            uid: row.uid

          }
        })
      }

    },
    //开始结算
    workClose (row) {
      console.log(row)
      if (row.status == '收银中') {
        this.$confirm(`对收银员${row.workerName}进行清机结算，系统将强制其退出POS销售，是否确定进行清机结算？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push({
            path: "close",
            query: {
              uid: row.uid,
              timeCode: row.timeCode,
              cinemaUid: this.searchAdition.cinemaUid
            }
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消清机结算'
          });
        })
      } else {
        this.$router.push({
          path: "detail",
          query: {
            uid: row.uid,
            parentPage: 'clear',
            timeCode: row.timeCode,
            cinemaUid: this.searchAdition.cinemaUid
          }
        });
      }

    },
    //查询
    search () {
      !this.cinemaName ? this.$message({
        message: '请先选择影院',
        type: 'warning'
      }) : this.getList();
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
            // this.$refs.page_div.style.display = data.data.total < 16 ? "none" : "block" // 分页是否显示  15条不显示
            this.$set(this.page, "total", data.data.total)
            this.$set(this.page, "pageSize", data.data.size)
            this.$set(this.page, "current", data.data.current)
          } else { }
        })
        .catch(err => {
          console.log(err);
        })
    },
    // 获取收银员
    getWorker (current, userName, userAccount) {
      let limit = {
        current,
        size: 10,
        userName,
        userAccount,
        cinemaUid: this.searchAdition.cinemaUid
      };
      //  之前用这个后来后台说要改下面这个
      this.$csmList.getWorker(Object.assign({}, limit))
        .then(data => {
          if (data && data.code === 200) {
            this.$refs.searchDialog.templateRadio = ''
            this.$refs.searchDialog.gridData = data.data.records
            this.$refs.searchDialog.pageData = data.data
            data.data.records.forEach((item, index) => {
              if (JSON.stringify(item) == JSON.stringify(this.rebackWorker)) {
                this.$refs.searchDialog.templateRadio = index
              }
            })
          }
        })
    },
    //  获取制单人
    getCreater (current, createName) {
      let limit = {
        current,
        size: 10,
        userName: createName,
        cinemaUid: this.searchAdition.cinemaUid
      };
      this.$csmList.getCreater(Object.assign({}, limit))
        .then(data => {
          if (data && data.code === 200) {
            this.$refs.searchDialog.templateRadio = ''
            this.$refs.searchDialog.gridData = data.data.records
            this.$refs.searchDialog.pageData = data.data
            data.data.records.forEach((item, index) => {
              if (JSON.stringify(item) == JSON.stringify(this.rebackCreater)) {
                this.$refs.searchDialog.templateRadio = index
              }
            })
          }
        })
    },
    //当前页数数目改变
    handleSizeChange (valua) {
      this.page.pageSize = valua;
      this.getList();
    },
    //当前页改变
    handleCurrentChange (valua) {
      this.page.current = valua;
      this.getList();
    },
    // 打开创单人
    openCreate (event) {
      event.srcElement.blur()

      this.getCreater()

      this.$refs.searchDialog.dialogTableVisible = true;
      this.$refs.searchDialog.title = "查找制单人";
      this.$refs.searchDialog.showWhich = "creater";

    },
    // 打开收银员
    openWorker (event) {
      event.srcElement.blur()
      this.getWorker()
      this.$refs.searchDialog.dialogTableVisible = true;
      this.$refs.searchDialog.title = "查找收银员";
      this.$refs.searchDialog.showWhich = "worker";
    },
    //  返回值
    chooseWorker (obj) {
      let whichOne = this.$refs.searchDialog.showWhich;

      console.log(obj, whichOne)
      if (whichOne == "worker") {
        this.searchAdition.workerName = obj.userName
        this.rebackWorker = obj;
      } else if (whichOne == "creater") {
        this.searchAdition.createUserName = obj.userName
        this.rebackCreater = obj;
      }
    },
    searchWorker (current, userName, userAccount) {
      this.getWorker(current, userName, userAccount)
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
  },
  mounted () {
    // this.$refs.page_div.style.display = "none"
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

.el-button--primary {
  width: 80px;
  height: 32px;
  display: flex;
  justify-content: center;
  padding: 0;
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
  box-sizing: border-box;
  white-space: nowrap;
  text-align: right;
}

.search-time {
  display: flex;
}

.el-button--default.is-disabled {
  background: #f5f5f5;
  border: 1px solid #bcbcbc;
  border-radius: 4px;
  text-align: left;
  color: #666;
}

.cinema-footer {
  display: flex;
  justify-content: center;
}
</style>