<template>
  <section class="cinema">

    <singleCinema ref="frameSingleCinema" :framedialogVisible.sync="singleCinemaVisible" :type="singleCinemaType" :innerData="innerData" @callBackSingle="callBackSingle">
      <div slot="footerId" class="single-cinema-btn">
        <el-button type="primary" @click="$refs.frameSingleCinema.confirmData(), singleCinemaVisible = false">确 定</el-button>
        <el-button @click="singleCinemaVisible = false">取 消</el-button>
      </div>
    </singleCinema>

    <el-form :inline="true" :model="formData" class="demo-form-inline search-form" size="small">
      <el-form-item label="影院名称：">
        <el-input class="readonly-input" v-model="cinemaName" readonly></el-input>
        <el-button class="normal-btn" @click="singleCinemaVisible = true, $refs.frameSingleCinema.listAuthCommCinemas()">选择</el-button>
      </el-form-item>
      <el-form-item label="渠道类型：">
        <el-select v-model="formData.channelNature" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in channelNatureOptions" :key="item.keyCode" :label="item.keyName" :value="item.keyCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态：">
        <el-select v-model="formData.status" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in statusOptions" :key="item.keyCode" :label="item.keyName" :value="item.keyCode">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="渠道名称：">
        <el-input placeholder="请输入渠道名称" v-model="formData.channelName" clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button style="height: 32px; width: 80px" type="primary" @click="search">查询</el-button>
        <!--<el-button @click="resetFields">重置条件</el-button>-->
      </el-form-item>
    </el-form>

    <el-table :data="tableData" style="width: 100%; margin-top: 20px">
      <el-table-column label="序号" type="index" width="100">
      </el-table-column>
      <el-table-column prop="code" label="渠道编码" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="name" label="渠道名称" show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="nature" label="渠道类型" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.nature === 1 || scope.row.nature === 0">自营渠道</span>
          <span v-else-if="scope.row.nature === 2">第三方渠道</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120" show-overflow-tooltip>
        <template slot-scope="scope">
          <span v-if="scope.row.status === 0">启用</span>
          <span v-else>停用</span>
        </template>
      </el-table-column>
      <el-table-column width="300" fixed="right" label="操作">
        <template slot-scope="scope">
          <!--                    <el-button style="padding: 0" @click="updateStatus(scope.row.status === 0 ? 1 : 0, scope.row.uid)" type="text" size="small">{{scope.row.status ? '启用' : '停用'}}</el-button>-->
          <el-button style="padding: 0" @click="setParams(scope.row)" type="text" size="small">设置参数
          </el-button>
          <!--                    <el-button style="padding: 0" @click="setAuthorizedCinema(scope.row.uid)" type="text" size="small">卖品网售设置</el-button>-->
          <el-button style="padding: 0" @click="toParamsDetail(scope.row)" type="text" size="small">查看详情
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <div class="page-wrap">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="formData.current" :page-sizes="[20, 40, 60, 80]" :page-size="formData.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </section>
</template>

<script>
// import singleCinema from "frame_cpm/dialogs/cinemaDialog/singleCinema"
const { singleCinema } = requireModule('base')

export default {
  name: "cinema",
  components: {
    singleCinema
  },
  data () {
    return {
      singleCinemaVisible: false,
      singleCinemaType: 2,
      innerData: {
        id: '',
      },

      cinemaName: '',
      tableData: [],
      channelNatureOptions: [{
        keyCode: 2,
        keyName: '第三方渠道'
      }, {
        keyCode: 1,
        keyName: '自营渠道'
      }],
      statusOptions: [{
        keyCode: 0,
        keyName: '启用'
      }, {
        keyCode: 1,
        keyName: '停用'
      }],
      total: 0,
      formData: {
        cinemaUid: '',
        channelNature: '',
        channelName: '',
        status: '',
        pageSize: 20,
        current: 1,
      },
    }
  },
  methods: {

    callBackSingle (data) {
      this.singleCinemaVisible = data.framedialogVisible

      if (data.isCloseWindow) return

      console.log(data, '-----> data')
      this.formData.cinemaUid = data.data.id
      this.cinemaName = data.data.name
      this.cinemaName = this.cinemaName.length > 10 ? this.cinemaName.substring(0, 9) + "..." : this.cinemaName
      this.innerData.id = data.data.id

      this.search()
    },

    toParamsDetail (row) {
      this.$router.push({
        path: '/trade/cinemaChannelDetail',
        query: {
          data: row,
          cinemaUid: this.formData.cinemaUid
        }
      })
    },

    setParams (row) {
      this.$router.push({
        path: '/trade/cinemaChannelParam',
        query: {
          data: row,
          cinemaUid: this.formData.cinemaUid
        }
      })

    },

    updateStatus (status, channelUid) {
      this.$csmList.setChannelStatus({
        channelUid,
        status
      }).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.success(res.msg)
          this.search()
        } else {
          this.error(res.msg)
        }

      })

    },

    search () {
      this.$csmList.getCinemaChannelList(this.formData).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.tableData = res.data.list
          this.total = res.data.total

        } else {
          this.error(res.msg)
        }

      })
    },

    getUserInfo () {
      this.$csmList.getCtmUserInfo().then(res => {
        console.log(res)
        if (res.code === 200) {
          this.cinemaName = res.data.cinemaName
          this.formData.cinemaUid = res.data.cinemaUid
          this.innerData.id = Number(res.data.cinemaUid)

          this.search()

        } else {
          this.error(res.msg)
        }
      })
    },

    handleSizeChange (val) {
      console.log(`每页 ${val} 条`);
      this.formData.pageSize = val
      this.search()
    },

    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
      this.formData.current = val
      this.search()
    },


  },
  mounted () {
    this.getUserInfo()
  }
}
</script>

<style lang="scss">
.cinema {
  .single-cinema-btn {
    .el-button {
      padding: 8px 16px;
      min-width: 80px;
      height: 32px;
    }
    .el-button + .el-button {
      margin-left: 30px;
    }
  }
  .normal-btn {
    min-width: 80px;
    height: 32px;
    border: 1px solid #3b74ff;
    border-radius: 4px;
    padding: 8px 16px;
    background: #fff;
    span {
      font-size: 12px;
      color: #3b74ff;
    }
  }

  .search-form {
    background: #f5f5f5;
    padding: 24px 24px 6px 24px;

    .el-form-item {
      margin-right: 32px;
      .el-form-item__label,
      .el-input {
        font-size: 12px;
        color: #666;
      }
      .readonly-input {
        width: 192px;
        margin-right: 8px;
        .el-input__inner {
          background: #f5f5f5;
        }
      }
      .el-button + .el-button {
        margin-left: 8px;
      }
    }

    .el-icon-arrow-left,
    .el-icon-arrow-right {
      cursor: pointer;
    }

    .el-icon-date,
    .el-range__close-icon {
      display: none;
    }

    .month {
      width: 140px;

      .el-input__inner {
        text-align: center;
      }

      .el-input__prefix {
        display: none;
      }
    }
  }

  .el-table {
    .el-button {
      padding: 0;

      span {
        font-size: 12px;
      }
    }

    .el-button + .el-button {
      margin-left: 0;
    }
  }

  .el-row-btns {
    padding: 8px 0;
  }
}
</style>