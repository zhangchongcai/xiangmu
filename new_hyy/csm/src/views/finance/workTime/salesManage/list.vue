<template>
  <div>
    <div class="cinemaList">
      <div class="searchAdition">
        <el-form :inline="true" :model="queryData" label-position="right" class="demo-form-inline search-form" label-suffix="：">
          <el-form-item label="影院名称">
            <el-button style="width:176px;height:32px;">
              {{ cinemaName }}</el-button>
            <el-button @click="singleCinemaVisible = true, $refs.frameSingleCinema.listAuthCommCinemas()" style="border:1px solid #3B74FF;color: #3B74FF;width:80px;height:32px;">选择</el-button>
          </el-form-item>
          <el-form-item label="终端名称">
            <el-input v-model="queryData.tername" placeholder="请输内容"></el-input>
          </el-form-item>
          <el-form-item label="终端编码">
            <el-input v-model="queryData.code" placeholder="请输内容"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryData.status">
              <el-option label="全部" value></el-option>
              <el-option label="启用" value="1"></el-option>
              <el-option label="停用" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="硬件识别码">
            <el-input v-model="queryData.mac" placeholder="请输内容"></el-input>
          </el-form-item>
          <el-form-item label="IP地址">
            <el-input v-model="queryData.ip" placeholder="请输内容"></el-input>
          </el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form>

      </div>
    </div>
    <div>
      <el-table :data="tableData" stripe>
        <el-table-column label="门店名称">
          <template slot-scope="{}">
            {{cinemaName}}
          </template>
        </el-table-column>
        <el-table-column v-for="item in tableColumn" :key="item.key" :prop="item.key" :label="item.label" :formatter="item.formatter"></el-table-column>
        <el-table-column label="操作" width="70" fixed="right">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click.stop="addressChange(row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-wrap">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="current" :page-sizes="[15, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" :hide-on-single-page="true"></el-pagination>
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
    <showDialog ref="showDialog" @changeData="changeData"></showDialog>
  </div>
</template>

<script>
// import singleCinema from "frame_cpm/dialogs/cinemaDialog/singleCinema"
// import singeCinema from '../publicModule/singeCinema'
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
      current: 1,
      pageSize: 15,
      // 新建状态
      statusRadio: 1,
      terminalData: {
        cinemaUid: "",
        code: "",
        ip: "",
        mac: "",
        status: "",
        tername: ""
      },
      //查询数据
      queryData: {
        cinemaUid: "",
      },
      // 数据总数
      total: 0,
      tableColumn: [{
        label: "终端名称",
        key: "tername"
      },
      {
        label: "终端编码",
        key: "code"
      },
      {
        label: "硬件识别码",
        key: "mac"
      },
      {
        label: "计算机IP",
        key: "ip"
      },
      {
        label: "终端状态",
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
      },
      {
        label: "终端类型",
        key: "type"
      },
      {
        label: "扣减仓库/货架",
        key: "rackName"
      },
      {
        label: "销售地点",
        key: "salePlaceEntity",
        formatter (row, column, cellValue) {
          let result = cellValue && cellValue.placeName || "";
          return result;
        }
      },
      ],
      tableData: []
    };
  },
  methods: {
    //查询
    search () {
      !this.cinemaName ? this.$message('请先选择影院') : this.queryStoreEvent(this.queryData);
    },
    // 查询列表数据
    queryStoreEvent (data) {
      let obj = JSON.parse(JSON.stringify(this.queryData))
      // 去除空查询条件
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (obj[key] === null || obj[key] === undefined || obj[key] === "") delete obj[key];
        }
      }
      this.$csmList.terminalList(this.current, this.pageSize, obj)
        .then(data => {
          if (data && data.code === 200) {
            this.tableData = data.data.list
            let salelist = [];
            this.tableData && this.tableData.forEach(item => {
              item.saleAddress = (item.salePlaceEntity && item.salePlaceEntity.placeName) || ""
              salelist.push(item.saleAddress)
            })
            this.total = data.data.total
            console.log(this.total)
            this.$refs.showDialog.salelist = salelist // 传给弹窗的
          }
        }).catch(err => {
          console.log(err)
        })
    },
    // 打开影院
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
    callback (val) {
      console.log(val)
      this.cinemaName = val.orgName
      this.queryData.cinemaUid = val.cinemaUID
    },
    changeData () {
      this.queryStoreEvent(this.queryData)
    },
    addressChange (row) {
      console.log(row)
      this.$refs.showDialog.dialogTableVisible = true;
      this.getEntrepot(row.cinemaUid)
      this.getSaleList(row.cinemaUid)
      this.$refs.showDialog.tername = row.tername;
      this.$refs.showDialog.status = row.status;
      this.$refs.showDialog.id = row.id;
      this.$refs.showDialog.cinemaUid = row.cinemaUid;
      // this.$refs.showDialog.rackName2 = `${row.rackName},${row.code},${row.storeType}`
      // this.$refs.showDialog.uid2 = row.salePlaceEntity
      this.$refs.showDialog.placeName = (row.salePlaceEntity && row.salePlaceEntity.placeName) || ""
      // this.$refs.showDialog.rackName = {name:row.rackName,code:row.code,storeType:row.storeType}
      this.$refs.showDialog.rackName = row.rackName;
      this.$refs.showDialog.rackCode = row.rackCode;
      this.$refs.showDialog.storeType = row.storeType;
      this.$refs.showDialog.uid = (row.salePlaceEntity && row.salePlaceEntity.uid) || ""
    },
    // 仓库
    getEntrepot (uid) {
      this.$csmList.rackAll(uid).then(data => {
        if (data && data.code === 200) {
          // 货架
          data.data.storageRack && data.data.storageRack.forEach(item => {
            item.storeType = 2
            // {rackName:item.name,rackCode:item.code,storeType:item.storeType}
            item.keyValue = `${item.name},${item.code},${item.storeType}`
          })
          // 仓库
          data.data.storehouse && data.data.storehouse.forEach(item => {
            item.storeType = 1
            item.keyValue = `${item.name},${item.code},${item.storeType}`
          })
          this.$refs.showDialog.goodlist = data.data.storageRack.concat(data.data.storehouse)
          // this.$refs.showDialog.rackName = data.data.storageRack.concat(data.data.storehouse)[0].keyValue
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 查询列表数据
    getSaleList (uid) {
      this.$csmList.queryPage(1, 1000, {
        cinemaUid: uid
      }).then(data => {
        if (data && data.code === 200) {
          this.$refs.showDialog.salelist = data.data.list || []
          // this.$refs.showDialog.uid = data.data.list && data.data.list[0].uid
        }
      }).catch(err => {
        console.log(err)
      })
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
    //当前页数数目改变
    handleSizeChange (valua) {
      this.pageSize = valua;
      this.queryStoreEvent(this.queryData)
    },
    //当前页改变
    handleCurrentChange (valua) {
      this.current = valua;
      this.queryStoreEvent(this.queryData)
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

.change-dialog {
  .el-form--inline .el-form-item {
    width: 100%;
  }

  .el-form-item__content {
    width: 70%;
  }
}
.cinema-footer {
  display: flex;
  justify-content: center;
}
.zd-box button {
  float: right;
}
</style>