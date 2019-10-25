<template>
  <div>
    <div class="cinemaList">
      <div class="searchAdition">
        <el-form :inline="true" :model="queryData" label-position="right" class="demo-form-inline search-form" label-suffix="：">
          <!-- <el-form-item label="门店名称">
            <el-input v-model="cinemaName" @focus="openCinema"></el-input>
          </el-form-item> -->
          <el-form-item label="影院名称">
            <el-button style="width:176px;height:32px;" disabled>
              {{ cinemaName }}</el-button>
            <el-button @click="singleCinemaVisible = true, $refs.frameSingleCinema.listAuthCommCinemas()" style="border:1px solid #3B74FF;color: #3B74FF;width:80px;height:32px;">选择</el-button>
          </el-form-item>
          <el-form-item label="销售地点编码">
            <el-input v-model="queryData.code" placeholder="请输内容"></el-input>
          </el-form-item>
          <el-form-item label="销售地点名称">
            <el-input v-model="queryData.placeName" placeholder="请输内容"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryData.status">
              <el-option label="全部" value></el-option>
              <el-option label="启用" value="1"></el-option>
              <el-option label="停用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="query-btn-box">
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
        </el-form>

      </div>
    </div>
    <div class="common-new-built" style="padding:5px;float:right;">
      <el-button type="primary" size="small" plain @click="newTerminal">新建</el-button>
    </div>
    <div>
      <el-table :data="tableData" stripe>
        <el-table-column label="门店名称">
          <template slot-scope="{}">
            {{cinemaName}}
          </template>
        </el-table-column>
        <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter"></el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click.stop="addressChange(row)">修改</el-button>
            <el-button type="text" size="small" @click.stop="addressDlete(row)" v-show="!row.isDef">删除</el-button>
            <el-button type="text" size="small" @click.stop="changeStatus(row)">{{statusValue(row.status)}}
            </el-button>
            <el-button type="text" size="small" @click.stop="addressDetail(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-wrap">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryData.page" :page-sizes="[10,20,30]" :page-size="queryData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
      </div>
    </div>
    <singleCinema ref="frameSingleCinema" :framedialogVisible.sync="singleCinemaVisible" :type="singleCinemaType" :innerData="innerData" @callBackSingle="callBackSingle">
      <div slot="footerId" class="cinema-footer">

        <el-button type="primary" @click="$refs.frameSingleCinema.confirmData(), singleCinemaVisible = false">确
          定</el-button>
        <el-button @click="singleCinemaVisible = false" style="margin-left:32px;">取 消</el-button>
      </div>
    </singleCinema>
    <showDialog ref="showDialog" @callback="callback"></showDialog>
  </div>
</template>

<script>
// import singleCinema from "frame_cpm/dialogs/cinemaDialog/singleCinema"
import showDialog from './showDialog'
const { singleCinema } = requireModule('base')
export default {
  components: {
    singleCinema,
    showDialog
  },
  data () {
    return {
      singleCinemaVisible: false,
      singleCinemaType: 2,
      innerData: {
        id: '',
      },
      cinemaName: "", //影院名字
      checkDialog: false,
      addTerminal: false,
      page: 1,
      pageSize: 10,
      // 新建状态
      statusRadio: 1,
      terminalData: {
        cinemaUid: "",
        code: "",
        ip: "",
        mac: "",
        page: 1,
        pageSize: 10,
        status: "",
        tername: ""
      },
      //查询数据
      queryData: {
        cinemaUid: "",
        code: "",
        placeName: "",
        status: ""
      },
      // 数据总数
      total: 0,
      tableColumn: [{
        label: "销售地点编码",
        key: "code"
      },
      {
        label: "销售地点名称",
        key: "placeName"
      },
      {
        label: "绑定终端编号",
        key: "terminalCodesStr"
      },
      {
        label: "状态",
        key: "status",
        formatter (row, column, cellValue) {
          let result = "";
          switch (row.status) {
            case 0:
              result = "停用";
              break;
            case 1:
              result = "启用";
              break;
          }
          return result;
        }
      }
      ],
      tableData: [],
      //新建or修改数据
      changeData: {
        status: "1",
        cinemaUid: "",
        placeName: "",
        uid: "",
        terminals: []
      },
      checkChangeData: {
        status: "",
        cinemaUid: "",
        placeName: "",
        code: "",
        uid: "",
        terminals: []
      },
      isNewBuile: true,
      changeDialog: false,
      zdtableData: [{
        cinemaUid: "",
        code: "",
        placeName: "",
        terminalCodesStr: "",
        status: ""
      }],
      terminalmultipleSelection: []
    };
  },
  methods: {
    //查询
    search () {
      !this.cinemaName ? this.$message('请先选择影院') : this.queryStoreEvent(this.queryData);
    },
    // 查询列表数据
    queryStoreEvent (data) {
      this.$csmList.queryPage(this.page, this.pageSize, data).then(data => {
        if (data && data.code === 200) {
          this.tableData = data.data.list
          this.total = data.data.total
          // let terminalArray = data.data.list.terminalCodes
          this.tableData && this.tableData.forEach(item => {
            item.terminalCodesStr = item.terminalCodes.join(",")
          })
          // terminalArray
        }
      }).catch(err => {
        console.log(err)
      })
    },

    newTerminal () { // 新建
      this.$router.push({
        path: 'add',
        query: {
          cinemaName: this.cinemaName,
          cinemaUid: this.queryData.cinemaUid
        }
      })
    },
    // 打开影院
    callback (val) {
      console.log(val)
      this.cinemaName = val.orgName
      this.queryData.cinemaUid = val.cinemaUID
    },

    callBackSingle (data) {
      console.log(data, '-----> data')
      this.queryData.cinemaUid = data.data.id
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
          this.queryData.cinemaUid = res.data.cinemaUid
          this.innerData.id = Number(res.data.cinemaUid)

          this.search()

        } else {
          this.error(res.msg)
        }
      })
    },
    // 查询终端
    queryTerminalEvent (data) {
      this.$csmList.terminalQueryPage(data).then(data => {
        if (data && data.code === 200) {
          let newdata = data.data
          this.zdtableData = newdata.records;
          // let 
        }
      }).catch(err => {
        console.log(err)
      })
    },

    // 新增
    saveStoreEvent (data) {
      this.$cimList.salePlaceSave(data).then(data => {
        if (data && data.code === 200) {
          this.queryStoreEvent(this.queryData)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 修改
    addressChange (row) {
      console.log(row)
      this.$router.push({
        path: "change",
        query: {
          uid: row.uid,
          cinemaName: this.cinemaName,
          cinemaUid: row.cinemaUid
        }
      })
    },
    // 启用/停用
    changeStatus (row) {
      this.$csmList.changeStatus(row.uid, row.status == "1" ? "0" : "1")
        .then((data) => {
          if (data && data.code === 200) {
            this.$message(data.msg)
            this.queryStoreEvent(this.queryData)
          } else {
            this.$message(data.msg)
          }
        }).catch(err => {
          this.$message(data.msg)
        })
    },
    // 删除
    addressDlete (row) {
      console.log(row)
      this.$csmList.addressDelete(row.uid).then((data) => {
        console.log(data)
        if (data && data.code === 200) {
          // this.$alert('删除成功', '提示', {
          //   confirmButtonText: '确定',
          // }) 
          this.$message(data.msg)
          this.queryStoreEvent(this.queryData);
        } else {
          this.$message(data.msg)
        }
      }).catch(err => {
        this.$message(data.msg)
        console.log(err)
      })

    },
    // 详情
    addressDetail (row) {
      console.log(row)
      this.$refs.showDialog.dialogTableVisible = true;
      this.$refs.showDialog.showData = row;
      this.$refs.showDialog.gridData = row.terminals
    },
    // 查询终端
    addTerminalEvent () {
      this.addTerminal = true
      this.queryTerminalEvent(this.terminalData)
    },
    // 添加终端确定
    terminalConfirm () {
      this.addTerminal = false
      this.changeData.terminals = this.terminalmultipleSelection
    },


    // 删除终端操作
    terminalHandleeDlete (index, row) {

      this.changeData.terminals.splice(index, 1)
    },
    statusValue (type) {
      switch (type) {
        case 1:
          return "停用"
          break;
        case 0:
          return "启用"
          break;
      }
    },
    handleStop (index, row) {
      if (row.terminalCodesStr == "") {
        if (row.status == 0) {
          row.status = 1
        } else {
          row.status = 0
        }
        this.$cimList.salePlaceStatus(row.status, row.uid).then(data => {
          let _self = this
          if (data && data.code === 200) {
            _self.queryStoreEvent(_self.queryData)
          } else {

          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        alert("绑定终端不能停用")
      }
    },
    handleSizeChange (val) {
      this.pageSize = val;
      this.queryStoreEvent(this.queryData)
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange (val) {
      this.page = val;
      this.queryStoreEvent(this.queryData)
      console.log(`当前页: ${val}`);
    },
    handleNewBuilt () {
      this.changeData = {
        status: "1",
        cinemaUid: "006",
        placeName: "",
        uid: "",
        terminals: []
      },
        this.changeDialog = true;
      this.isNewBuile = true;
    }
  },
  mounted () {
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
      font-size: 12px;
    }

    .el-form-item__label {
      font-size: 12px;
      color: #666;
      height: 32px;
      line-height: 32px;
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
  .el-button--default.is-disabled {
    background: #f5f5f5;
    border: 1px solid #bcbcbc;
    border-radius: 4px;
    text-align: left;
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

.change-dialog {
  .el-form--inline .el-form-item {
    width: 100%;
  }

  .el-form-item__content {
    width: 70%;
  }
}

.zd-box button {
  float: right;
}
.cinema-footer {
  display: flex;
  justify-content: center;
}
</style>