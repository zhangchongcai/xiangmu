<template>
  <div class="cinemaList">
    <div class="searchAdition">

      <el-form :inline="true" class="demo-form-inline search-form" size="small">
        <el-form-item label="影院名称：" v-show="canShow">
          <el-button style="width:176px;height:32px;" disabled>
            {{ cinemaName }}</el-button>
          <el-button @click="singleCinemaVisible = true, $refs.frameSingleCinema.listAuthCommCinemas()" style="border:1px solid #3B74FF;color: #3B74FF;width:80px;height:32px;">选择</el-button>
        </el-form-item>
        <el-form-item label="资金科目：">
          <el-select v-model="searchAdition.subjectName">
            <el-option label="全部" value>全部</el-option>
            <el-option v-for="(item,index) in subjectList" :key="index" :label="item.subjectFull" :value="item.subjectName">{{item.subjectFull}}</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="制单人：">
          <el-button style="width:176px;height:32px;" disabled>
            {{ searchAdition.createUserName }}</el-button>
          <el-button @click="openCreate" style="border:1px solid #3B74FF;color: #3B74FF;width:80px;height:32px;padding:8px;">选择</el-button>
        </el-form-item>
        <el-form-item label="摘要说明：">
          <el-input v-model="searchAdition.remarks"></el-input>
        </el-form-item>
        <el-button type="primary" @click="search" class="search-btn">查询</el-button>
      </el-form>
    </div>
    <div class="content">
      <el-row style="padding:5px;float:right;">
        <el-button type="primary" plain class="xinjian" @click="account_add" v-show="!canShow">新建</el-button>
      </el-row>
      <br style="clear:both;">
      <el-row>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="fundCode" label="编号" width="200"></el-table-column>
          <el-table-column prop="createUserName" label="制单人" show-overflow-tooltip></el-table-column>
          <el-table-column prop="createTime" label="制单时间" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="timeCode" label="关联单据" show-overflow-tooltip></el-table-column>
          <el-table-column prop="changed" label="调整内容" show-overflow-tooltip></el-table-column>
          <el-table-column label="操作" width="70" fixed="right">
            <template slot-scope="scope">
              <el-button size='small' type="text" @click="detail(scope.row)">查看</el-button>
              <!-- <span class="icon-color" @click="detail(scope.row)">查看</span> -->
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <div class="page-wrap">
        <el-pagination background @current-change="handleCurrentChange" :current-page="current" :page-size="size" layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
      <mydialog ref="searchDialog" @callback="chooseWorker" @searchWorker="searchWorker"></mydialog>
      <ShowDialog ref="dataDialog" :dialogTableVisible.sync="dialogTableVisible" :title="title" :showData="totalData" :gridData="gridData" :pageData="pageData" :uid="$route.query.uid" :timeCode="$route.query.timeCode" :subjectList="subjectList" @changeDialogTableVisible="changeDialogTableVisible" @changeCurrentPage="changeCurrentPage" @addSuccess="addSuccess"></ShowDialog>
      <textDialog ref="textDialog" @callback="chooseWorker" @searchWorker="searchWorker"></textDialog>
    </div>
    <singleCinema ref="frameSingleCinema" :framedialogVisible.sync="singleCinemaVisible" :type="singleCinemaType" :innerData="innerData" @callBackSingle="callBackSingle">
      <div slot="footerId">
        <el-button type="primary" @click="$refs.frameSingleCinema.confirmData(), singleCinemaVisible = false">确
          定</el-button>
        <el-button @click="singleCinemaVisible = false" style="margin-left:32px;">取 消</el-button>
      </div>
    </singleCinema>
  </div>
</template>
<script type="text/javascript">
// import singleCinema from "frame_cpm/dialogs/cinemaDialog/singleCinema"
import ShowDialog from "../public/moneyDialog"
import mydialog from "../public/searchDialog"
import textDialog from "../public/textDialog"
const { singleCinema } = requireModule('base')
export default {
  components: {
    singleCinema,
    ShowDialog,
    mydialog,
    textDialog
  },
  data () {
    return {
      singleCinemaVisible: false,
      singleCinemaType: 2,
      innerData: {
        id: '',
      },
      cinemaName: "", //影院名字
      cinemaUid: "",
      total: 1, //总数
      current: 1, //当前页
      size: 10, //当前页数大小 
      tableData: [], //列表
      searchAdition: {
        createUserName: "",
      },
      subjectList: [],
      // 弹窗
      search2: {
        createName: ''
      },
      gridData2: [],
      templateRadio: '',
      createName: '',
      totalData: {},
      dialogTableVisible: false, // 增加
      title: "",
      gridData: [],
      thingGridData: [],
      pageData: {},
      current: 1,
      // isFristPage:true
      canShow: false
    };
  },
  methods: {
    changeDialogTableVisible (val) {
      this.dialogTableVisible = val;
    },
    changeCurrentPage (val) {
      this.getThingsDetail(val);
    },
    // 新建资金调整
    account_add () {
      this.dialogTableVisible = true;
      this.title = "资金调整单";
      console.log(this.$route.query.uid)
      if (this.$route.query.uid) {
        console.log(111)
        this.$refs.dataDialog.isFristPage = true
      } else {
        this.$refs.dataDialog.isFristPage = false;
      }
    },
    //查询资金调整单
    search () {
      this.getList();
    },
    //获取列表数据
    getList () {
      console.log(this.$route.query)
      let limit = {
        // timeCode:this.$route.query.timeCode,
        workTimeUid: this.$route.query.uid,
        cinemaUid: this.cinemaUid
      };
      let addition = this.searchAdition;
      this.$csmList.adjustList(Object.assign({}, limit, addition), this.current, this.size)
        .then(data => {
          if (data && data.code === 200) {
            this.tableData = [];
            this.tableData = data.data.records;
            this.total = data.data.total
            this.tableData.forEach((item, index) => {
              item.itemEntityList && item.itemEntityList.forEach(el => {
                el.changed = `${el.subjectName}:${el.changeValue}`;
              })
              let obj = item.itemEntityList.length > 0 && item.itemEntityList.reduce((prev, curr) => {
                return {
                  changed: `${prev.changed};${curr.changed}`
                }
              })
              this.tableData[index].changed = obj.changed
            })
          } else { }
        })
        .catch(err => {
          // console.log(err);
        })
    },
    //当前页改变
    handleCurrentChange (valua) {
      this.current = valua;
      this.getList();
    },
    // 打开影院
    callback (val) {
      console.log(val)
      this.cinemaName = val.orgName
      this.cinemaUid = val.cinemaUID
    },

    callBackSingle (data) {
      console.log(data, '-----> data')
      this.cinemaUid = data.data.id
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
          this.cinemaUid = res.data.cinemaUid
          this.innerData.id = Number(res.data.cinemaUid)

          this.search()

        } else {
          this.error(res.msg)
        }
      })
    },
    //  获取制单人
    getCreater () {
      let limit = {
        current: this.current,
        size: this.size,
        userName: this.search2.createName,
        cinemaUid: this.$route.query.cinemaUid || this.cinemaUid
      };
      this.$csmList.getCreater(Object.assign({}, limit))
        .then(data => {
          if (data && data.code === 200) {
            // this.gridData2 = data.data.records
            // this.total = data.data.total;
            this.$refs.searchDialog.gridData = data.data.records
            this.$refs.searchDialog.pageData = data.data
          }
        })
    },
    // 打开制单人
    openCreate (event) {
      event.srcElement.blur()
      this.getCreater()
      this.$refs.searchDialog.dialogTableVisible = true;
      this.$refs.searchDialog.title = "查找制单人";
      this.$refs.searchDialog.showWhich = "creater";
    },
    //  返回值
    chooseWorker (obj) {
      let whichOne = this.$refs.searchDialog.showWhich;
      console.log(obj, whichOne)
      if (whichOne == "worker") {
        this.searchAdition.workerName = obj.userName
      } else if (whichOne == "creater") {
        this.searchAdition.createUserName = obj.userName
        console.log(this.searchAdition.createUserName)
      }
    },
    searchWorker (current, userName, userAccount) {
      this.getWorker(current, userName, userAccount)
    },
    getSubject () { // 获取资金科目
      this.$csmList.getAdjustSubject({})
        .then(data => {
          if (data && data.code === 200) {
            console.log(data)
            data.data.records.length && data.data.records.forEach(item => {
              item.subjectFull = item.bpType == 0 ? item.subjectName + "(收入)" : item.subjectName + "(支出)"
              console.log(item.subjectFull)
            })
            this.subjectList = data.data.records;
          }
        })
    },
    // 获取详细内容
    detail (row) {
      this.$refs.textDialog.dialogTableVisible = true;
      this.$refs.textDialog.title = "资金调整单详情";
      row.itemEntityList.forEach(item => {
        item.payTypeCode = item.payTypeCode == "XRMB" ? "现金" : "银联"
      })
      this.$refs.textDialog.gridData = row.itemEntityList;
      this.$refs.textDialog.billCode = row.timeCode;
      this.$refs.textDialog.uid = row.uid;
      console.log(row)
    },
    addSuccess () { // 添加成功之后
      this.getList();
      this.$refs.dataDialog.tableData = [];
    }
  },
  created () {
    this.getList();
    // this.getCreater();
    this.getSubject();
    //   this.getUserInfo();
    try {
      this.canShow = this.$route.query.uid ? false : true
      console.log(this.$route.query, this.isFristPage)
    } catch (error) {

    }
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        console.log(val.query.uid, val.query.uid == undefined);
        if (val.query.uid == undefined) {
          console.log(222)
          this.canShow = true
        }
      },
      // 深度观察监听
      // deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
.cinemaList {
  box-sizing: border-box;
  width: 100%;

  /deep/ .search-form {
    background: #f3f3f3;
    padding: 24px 24px 16px 24px;
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;

    .el-form-item__label {
      font-size: 12px;
      color: #666;
      // margin-right: 16px;
    }

    .el-button + .el-button {
      margin-left: 8px;
    }

    .el-form-item {
      margin-right: 32px;
      display: flex;
      margin-bottom: 8px;

      .el-form-item__content {
        height: 32px;
        display: flex;
        align-items: center;
      }
    }
  }
}

.el-button--default.is-disabled {
  background: #f5f5f5;
  border: 1px solid #bcbcbc;
  border-radius: 4px;
  text-align: left;
}

.el-button--primary {
  width: 80px;
  height: 32px;
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

.el-input--suffix,
.el-input__inner,
.el-select,
.el-form-item__content {
  width: 176px;
}
</style>